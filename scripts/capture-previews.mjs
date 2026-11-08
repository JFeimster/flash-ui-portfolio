/* Incremental screenshots from route metadata. Invalid or unavailable projects are reported and skipped. */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import sharp from "sharp";

const base = process.env.PREVIEW_BASE_URL || "https://flash-ui-portfolio.vercel.app";
const routeData = JSON.parse(await readFile("data/asset-route-resolution.json", "utf8"));
const collections = JSON.parse(await readFile("data/curated-collections.json", "utf8").catch(() => "{}"));
const previous = JSON.parse(await readFile("data/asset-previews.json", "utf8").catch(() => '{"projects":{}}'));
const projects = { ...previous.projects };
const tasks = new Map();
const routeOwners = new Map();
const aliases = new Map();
const duplicateDestinations = [];
const safeId = value => String(value).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
const add = (id, item, familyId = "") => {
  if (!item || item.resolutionStatus !== "resolved" || !item.resolvedPath || !item.sourcePath || !/\.html?$/i.test(item.sourcePath)) return;
  const sourcePath = item.sourcePath.replaceAll("\\", "/");
  let sourceHash, html;
  try { html = readFileSync(sourcePath, "utf8"); sourceHash = createHash("sha256").update(html).digest("hex"); } catch { return; }
  const structurallyValid = item.structuralValidity?.valid === true || item.structuralValidity?.valid !== false && /<html\b/i.test(html) && /<body\b/i.test(html);
  if (!structurallyValid) return;
  const key = safeId(id);
  if (!key || tasks.has(key)) return;
  const owner = routeOwners.get(item.resolvedPath);
  if (owner) {
    if (owner.sourceHash === sourceHash) aliases.set(key, owner.id);
    else duplicateDestinations.push({ id: key, route: item.resolvedPath, sourcePath, existingSourcePath: owner.sourcePath });
    return;
  }
  routeOwners.set(item.resolvedPath, { id: key, sourceHash, sourcePath });
  tasks.set(key, { id: key, familyId, sourcePath, sourceHash, target: item.resolvedPath, label: item.title || "Project preview" });
};

for (const group of routeData.groups || []) {
  const familyEntries = (routeData.entries || []).filter(entry => entry.canonicalGroupId === group.groupId);
  const members = familyEntries.filter(entry => entry.variantNumber);
  const recommended = members.find(entry => entry.title === group.recommendedPrimary);
  const primary = recommended || members.find(entry => entry.variantNumber === 1) || members[0] || familyEntries.find(entry => entry.type !== "group-hub");
  if (primary) add(group.groupId, primary, group.groupId);
  for (const variant of members) add(`${group.groupId}--variant-${variant.variantNumber}`, variant, group.groupId);
}
for (const entry of routeData.entries || []) if (!entry.canonicalGroupId && entry.type !== "group-hub") add(entry.slug, entry);
for (const collection of collections.groups || []) {
  for (const [index, variant] of (collection.variants || []).entries()) {
    const entry = (routeData.entries || []).find(item => item.sourcePath === variant.sourcePath || item.resolvedPath === variant.path);
    if (entry && index === 0) add(collection.groupId, entry, collection.groupId);
    if (entry) add(`${collection.groupId}--variant-${variant.number || variant.variantNumber}`, entry, collection.groupId);
  }
}

await mkdir("assets/previews", { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
let captured = 0, reused = 0;
const failures = [];
try {
  for (const task of tasks.values()) {
    const filename = `assets/previews/${task.id}.webp`;
    const old = projects[task.id];
    try { await access(filename); if (old?.sourceHash === task.sourceHash && old?.target === task.target) { reused++; continue; } } catch {}
    const page = await context.newPage();
    try {
      const response = await page.goto(new URL(task.target, base).href, { waitUntil: "networkidle", timeout: 30000 });
      if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? "unknown"}`);
      await page.waitForTimeout(500);
      const valid = await page.evaluate(() => document.documentElement?.innerText?.trim().length > 30 && !/404|page not found|deployment not found/i.test(document.title));
      if (!valid) throw new Error("empty page or missing-page response");
      const png = await page.screenshot({ type: "png", animations: "disabled", caret: "hide", fullPage: false });
      const image = sharp(png);
      const { width, height } = await image.metadata();
      if (!width || !height || width < 100 || height < 100) throw new Error("empty screenshot");
      await image.resize({ width: 960, withoutEnlargement: true }).webp({ quality: 77, effort: 4 }).toFile(filename);
      projects[task.id] = { ...(projects[task.id] || {}), image: `/${filename}`, target: task.target, sourcePath: task.sourcePath, sourceHash: task.sourceHash, familyId: task.familyId, label: task.label };
      captured++;
      console.log(`CAPTURED ${task.id} ${task.target}`);
    } catch (error) { failures.push({ id: task.id, route: task.target, reason: error.message }); }
    finally { await page.close(); }
  }
} finally { await browser.close(); }

const currentIds = new Set(tasks.keys());
for (const [alias, owner] of aliases) {
  if (projects[owner]?.image) projects[alias] = { ...projects[owner], familyId: tasks.get(owner)?.familyId || projects[owner].familyId };
  currentIds.add(alias);
}
for (const id of Object.keys(projects)) if (!currentIds.has(id)) delete projects[id];
await writeFile("data/asset-previews.json", `${JSON.stringify({ version: 2, generatedAt: new Date().toISOString(), base, projects }, null, 2)}\n`);
await writeFile("data/preview-capture-report.json", `${JSON.stringify({ generatedAt: new Date().toISOString(), requested: tasks.size, captured, reused, failures, duplicateDestinations }, null, 2)}\n`);
console.log(`Preview captures: ${captured} captured, ${reused} reused, ${failures.length} failed, ${duplicateDestinations.length} duplicate destinations skipped`);
