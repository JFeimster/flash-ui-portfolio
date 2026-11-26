/* Idempotent, bounded Playwright captures for resolved local portfolio routes. */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.PREVIEW_BASE_URL || 'http://127.0.0.1:4173';
const routeData = JSON.parse(await readFile('data/asset-route-resolution.json', 'utf8'));
const collections = JSON.parse(await readFile('data/curated-collections.json', 'utf8').catch(() => '{"groups":[]}'));
const previous = JSON.parse(await readFile('data/asset-previews.json', 'utf8').catch(() => '{"projects":{}}'));
const projects = { ...(previous.projects || {}) };
const tasks = new Map();
const routeOwners = new Map();
const aliases = new Map();
const duplicateDestinations = [];
const safeId = value => String(value).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
const add = (id, item, familyId = '') => {
  if (!item || item.resolutionStatus !== 'resolved' || !item.resolvedPath || !item.sourcePath || !/\.html?$/i.test(item.sourcePath)) return;
  const sourcePath = item.sourcePath.replaceAll('\\', '/');
  let sourceHash, html;
  try { html = readFileSync(sourcePath, 'utf8'); sourceHash = createHash('sha256').update(html).digest('hex'); } catch { return; }
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
  tasks.set(key, { id: key, familyId, sourcePath, sourceHash, target: item.resolvedPath, label: item.title || 'Project preview' });
};

for (const group of routeData.groups || []) {
  const familyEntries = (routeData.entries || []).filter(entry => entry.canonicalGroupId === group.groupId);
  const members = familyEntries.filter(entry => entry.variantNumber);
  const recommended = familyEntries.find(entry => entry.title === group.recommendedPrimary);
  const primary = recommended || members.find(entry => entry.variantNumber === 1) || members[0] || familyEntries.find(entry => entry.type !== 'group-hub');
  if (primary) add(group.groupId, primary, group.groupId);
  for (const variant of members) add(`${group.groupId}--variant-${variant.variantNumber}`, variant, group.groupId);
}
for (const entry of routeData.entries || []) if (!entry.canonicalGroupId && entry.type !== 'group-hub') add(entry.slug, entry);
for (const collection of collections.groups || []) {
  for (const [index, variant] of (collection.variants || []).entries()) {
    const entry = (routeData.entries || []).find(item => item.sourcePath === variant.sourcePath || item.resolvedPath === variant.path);
    if (entry && index === 0) add(collection.groupId, entry, collection.groupId);
    if (entry) add(`${collection.groupId}--variant-${variant.number || variant.variantNumber}`, entry, collection.groupId);
  }
}

await mkdir('assets/previews', { recursive: true });
const py = process.platform === 'win32' ? 'py' : 'python3';
const pyArgs = process.platform === 'win32' ? ['-3'] : [];
const encoder = path.resolve('scripts/lib/preview-webp.py');
const reusable = [];
for (const task of tasks.values()) {
  const cached = projects[task.id];
  if (cached?.sourceHash === task.sourceHash && cached?.target === task.target && cached?.image) {
    const filename = cached.image.replace(/^\//, '').replaceAll('/', path.sep);
    if (existsSync(filename)) reusable.push({ id: task.id, path: filename });
  }
}
const validation = spawnSync(py, [...pyArgs, encoder, 'validate'], {
  input: JSON.stringify(reusable), encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, windowsHide: true
});
if (validation.status !== 0) throw new Error(`Preview cache validation failed: ${validation.stderr || validation.error || 'unknown error'}`);
const validCacheIds = new Set(JSON.parse(validation.stdout || '[]'));

const priorityIds = new Set((process.env.PREVIEW_PRIORITY_IDS || '').split(',').map(x => x.trim()).filter(Boolean));
const isPriority = task => priorityIds.has(task.id) || priorityIds.has(task.familyId) || priorityIds.has(task.sourcePath.split('/')[1]);
const orderedTasks = [...tasks.values()].sort((a, b) => Number(isPriority(b)) - Number(isPriority(a)) || a.id.localeCompare(b.id));
const eligible = orderedTasks.filter(task => !validCacheIds.has(task.id));
const concurrency = Math.max(1, Math.min(6, Number(process.env.PREVIEW_CONCURRENCY || 6)));
const pageTimeoutMs = Math.max(5000, Math.min(45000, Number(process.env.PREVIEW_PAGE_TIMEOUT_MS || 20000)));
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const pages = await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(1, eligible.length)) }, () => context.newPage()));
const failures = [];
let captured = 0, reused = validCacheIds.size;
let next = 0;
const transient = error => /timeout|timed out|net::ERR_|ECONNRESET|socket hang up|HTTP 429|HTTP 5\d\d/i.test(String(error?.message || error));

async function capture(task, page) {
  const filename = `assets/previews/${task.id}.webp`;
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await page.goto(new URL(task.target, base).href, { waitUntil: 'domcontentloaded', timeout: pageTimeoutMs });
      if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? 'unknown'}`);
      const contentType = response.headers()['content-type'] || '';
      if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) throw new Error(`Non-HTML response: ${contentType || 'missing content type'}`);
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(350);
      const valid = await page.evaluate(() => document.documentElement?.innerText?.trim().length > 30 && !/^(?:404|not found|deployment not found)/i.test(document.title.trim()));
      if (!valid) throw new Error('Empty page or missing-page response');
      const png = await page.screenshot({ type: 'png', animations: 'disabled', caret: 'hide', fullPage: false, timeout: pageTimeoutMs });
      const webp = spawnSync(py, pyArgs.concat(encoder), { input: png, maxBuffer: 64 * 1024 * 1024, windowsHide: true });
      if (webp.status !== 0 || !webp.stdout?.length) throw new Error(`WebP encoding failed: ${webp.stderr?.toString() || webp.error || 'empty output'}`);
      const temp = `${filename}.tmp`;
      await writeFile(temp, webp.stdout);
      await rename(temp, filename);
      projects[task.id] = { ...(projects[task.id] || {}), image: `/${filename.replaceAll('\\', '/')}`, target: task.target, sourcePath: task.sourcePath, sourceHash: task.sourceHash, familyId: task.familyId, label: task.label };
      captured++;
      console.log(`CAPTURED ${task.id} ${task.target}`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt === 0 && transient(error)) { await page.waitForTimeout(300); continue; }
      break;
    }
  }
  failures.push({ id: task.id, route: task.target, reason: String(lastError?.message || lastError), attempts: transient(lastError) ? 2 : 1 });
}

try {
  const workers = pages.map(async page => {
    while (next < eligible.length) {
      const task = eligible[next++];
      await capture(task, page);
    }
  });
  await Promise.all(workers);
} finally {
  await Promise.all(pages.map(page => page.close().catch(() => {})));
  await browser.close();
}

for (const [alias, owner] of aliases) {
  if (projects[owner]?.image) projects[alias] = { ...projects[owner], familyId: tasks.get(owner)?.familyId || projects[owner].familyId };
}
await writeFile('data/asset-previews.json', `${JSON.stringify({ ...previous, version: 2, generatedAt: new Date().toISOString(), base, projects }, null, 2)}\n`);
const report = { generatedAt: new Date().toISOString(), base, requested: tasks.size, eligible: eligible.length, captured, reused, failures, duplicateDestinations, concurrency, pageTimeoutMs, priorityCount: eligible.filter(isPriority).length };
await writeFile('data/preview-capture-report.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(`Preview captures: ${captured} captured, ${reused} reused, ${failures.length} failed, ${duplicateDestinations.length} duplicate destinations skipped (workers=${concurrency})`);
