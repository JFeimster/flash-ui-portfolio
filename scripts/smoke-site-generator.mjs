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
  assert.equal(library.entry_count, library.entries.length, "generator count should match its registry entries");
  const ideas = library.entries.filter(entry => entry.factory?.kind === "site-idea");
  assert.ok(ideas.length > 0, "site ideas should be available");
  const templates = library.entries.filter(entry => entry.factory?.kind === "design-template");
  assert.equal(templates.length, 17, "expected 17 design templates");

  await page.getByText(`${ideas.length} site ideas ready`).waitFor();
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
  await page.locator('#sourceResults [data-source-id]').filter({ hasText: templates[0].name }).first().click();
  await page.locator("#projectName").fill("CI Generator Smoke");
  await page.locator("#brand").fill("Flash UI");
  await page.locator("#audience").fill("Site builders");
  await page.locator("#cta").fill("Generate a site");
  await page.locator('[data-option="framework"]').selectOption("static-html");

  await page.locator('[data-output-tab="powershell"]').click();
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

  await page.goto(new URL('/sites/', base).href);
  const jesterCard = page.locator('[data-project="jester-quotes"]');
  await jesterCard.waitFor();
  await jesterCard.getByRole('link', { name: /explore editions/i }).click();
  await page.waitForURL('**/sites/jester-quotes/variants/');
  assert.equal(await page.locator('#editions .card').count(), 8, 'Jester family should show eight editions');
  assert.equal(await page.getByRole('link', { name: /open design preview/i }).nth(1).getAttribute('href'), 'https://jester-quotes.vercel.app/editions/neo-brutalist/');
  const screenshots = await page.locator('#editions img').evaluateAll(images => images.map(image => image.getAttribute('src')));
  assert.equal(screenshots.length, 8);
  for (const source of screenshots) assert.equal((await page.request.get(new URL(source, base).href)).status(), 200, `edition screenshot should load: ${source}`);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390, 'mobile hub should not overflow horizontally');
  await page.goBack();
  await page.waitForURL('**/sites/');
  assert.equal((await page.goto(new URL('/sites/jester-quotes/', base).href))?.status(), 200, 'Dada Riot static import should remain available');

  assert.deepEqual(pageErrors, [], "generator should not throw browser-side errors");
  console.log("Site Generator and Jester editions CI smoke passed: registry, prompt, export, portfolio card, variants, images, mobile, static import.");
} finally {
  await browser.close();
}
