import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const pageErrors = [];
page.on("pageerror", error => pageErrors.push(error.message));

try {
  const home = await page.goto(new URL("/", base).href, { waitUntil: "domcontentloaded" });
  assert.equal(home?.status(), 200, "portfolio homepage should load");
  await page.locator(".voltage-card").first().waitFor();
  assert.equal(await page.locator(".card-artwork .card-art-label").count(), 0, "directory thumbnails should not have a blocking label");
  assert.equal(await page.locator(".card-artwork [data-quick-preview]").count(), 0, "quick preview should sit below the artwork");
  assert.ok(await page.locator(".card-bottom [data-quick-preview]").count() > 0, "quick preview should be available in the card actions");

  await page.getByRole("link", { name: /site generator/i }).click();
  await page.waitForURL("**/generator/");
  assert.equal(page.url(), new URL("/generator/", base).href);

  const libraryResponse = await page.request.get(new URL("/data/site-generator-prompts.json", base).href);
  assert.equal(libraryResponse.status(), 200, "generator prompt projection should load");
  const library = await libraryResponse.json();
  assert.equal(library.entry_count, 105, "expected 105 factory-backed ideas/templates");
  const templates = library.entries.filter(entry => entry.factory?.kind === "design-template");
  assert.equal(templates.length, 17, "expected 17 design templates");

  await page.getByText("88 site ideas ready").waitFor();
  const prompt = page.locator("#promptOutput");
  await prompt.waitFor();
  assert.ok((await prompt.inputValue()).length > 100, "initial prompt should be composed");

  const integrationRect = await page.locator(".integrations-section").boundingBox();
  const studioRect = await page.locator(".studio-grid").boundingBox();
  assert.ok(integrationRect && studioRect && integrationRect.width >= studioRect.width * 0.9, "integrations should use the full studio width");

  await page.locator("#seeExports").click();
  await page.waitForFunction(() => location.hash === "#exports");
  assert.equal(await page.evaluate(() => document.activeElement?.id), "exports", "See exports should move focus to the export section");

  const preset = page.locator("[data-preset]").first();
  await preset.click();
  assert.ok((await prompt.inputValue()).length > 100, "preset should leave a usable prompt");

  await page.locator("#advancedSourceFilter").check();
  await page.locator("#sourceSelect").selectOption(templates[0].id);
  await page.locator("#projectName").fill("CI Generator Smoke");
  await page.locator("#brand").fill("Flash UI");
  await page.locator("#audience").fill("Site builders");
  await page.locator("#cta").fill("Generate a site");
  await page.locator('[data-option="framework"]').selectOption("static-html");

  const briefButton = page.locator("#downloadRunnerBrief");
  await briefButton.waitFor();
  assert.equal(await briefButton.isEnabled(), true, "complete design-template brief should export without a review confirmation");
  const downloadPromise = page.waitForEvent("download");
  await briefButton.click();
  const download = await downloadPromise;
  const contents = JSON.parse(await readFile(await download.path(), "utf8"));
  assert.equal(contents.title, "CI Generator Smoke");
  assert.equal(contents.brand, "Flash UI");
  assert.equal(contents.audience, "Site builders");
  assert.equal(contents.primary_action, "Generate a site");
  assert.equal(contents.starter, "static-site");
  assert.equal(contents.delivery.create_repository, false);
  assert.equal(contents.delivery.push_code, false);
  assert.ok((await prompt.inputValue()).length > 100, "editable prompt preview should remain available");

  assert.deepEqual(pageErrors, [], "generator should not throw browser-side errors");
  console.log("Site Generator CI smoke passed: navigation, registry load, prompt, preset, template brief export.");
} finally {
  await browser.close();
}
