import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageData = JSON.parse(await readFile(new URL('../data/asset-packages.json', import.meta.url), 'utf8'));
const manifest = packageData.entries;
assert.ok(Object.keys(manifest).length > 0, 'at least one asset must be eligible');
for (const [route, entry] of Object.entries(manifest)) {
  assert.equal(entry.previewPath, route);
  assert.ok(entry.files.some(file => file.name === 'index.html'), `${route} needs an index.html`);
  assert.equal(new Set(entry.files.map(file => file.name)).size, entry.files.length, `${route} has duplicate names`);
  for (const file of entry.files) {
    assert.ok(file.source.startsWith('/sites/') && !file.source.includes('..'), `${route} source path is unsafe`);
    await readFile(path.join(root, decodeURIComponent(file.source.slice(1))));
  }
}
assert.ok(!manifest['/sites/jester-quotes/'], 'multi-page app should not have a static package');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ acceptDownloads: true });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto(new URL('/sites/', base).href);
  await page.getByRole('heading', { name: 'Partner Academy' }).waitFor();
  const single = page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Partner Academy' }) });
  assert.equal(await single.getByRole('link', { name: 'Use This Asset' }).count(), 1);
  const app = page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Jester Quotes', exact: true }) });
  assert.equal(await app.getByRole('link', { name: 'Use This Asset' }).count(), 0);

  await page.locator('#searchInput').fill('The Gentleman Degenerate');
  await page.getByRole('link', { name: 'Explore variants of The Gentleman Degenerate' }).click();
  await page.getByRole('heading', { name: 'The Gentleman Degenerate — Dada Riot' }).waitFor();
  const variant = page.locator('.variant-card').first();
  await variant.getByRole('link', { name: 'Use This Asset' }).click();
  await page.getByRole('heading', { name: 'Use The Gentleman Degenerate — Dada Riot' }).waitFor();
  const prompt = await page.locator('#promptText').textContent();
  for (const name of ['index.html', 'app.js', 'lounge.jpg', 'styles.css']) assert.ok(prompt.includes(name), `prompt must name ${name}`);
  assert.equal(await page.locator('iframe').getAttribute('src'), '/sites/the-gentleman-degenerate/variant-1/');
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `asset page should fit ${width}px`);
  }
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download project ZIP' }).click();
  const download = await downloadPromise;
  const zip = await readFile(await download.path());
  assert.equal(zip.readUInt32LE(0), 0x04034b50, 'download must be a ZIP');
  assert.ok(zip.includes(Buffer.from('CUSTOMIZE.md')) && zip.includes(Buffer.from('README.md')), 'download must include instructions');
  assert.ok(zip.includes(Buffer.from('lounge.jpg')) && zip.includes(Buffer.from('styles.css')), 'download must include source assets');
  assert.match(await page.locator('#assetStatus').textContent(), /Project ZIP ready/);
  assert.ok(await page.locator('.source-files a').count() >= 4, 'source files are inspectable');
  await page.locator('#briefBrand').fill('Example Brand');
  assert.match(await page.locator('#promptText').textContent(), /New brand: Example Brand/);
  assert.match(await page.locator('#embedText').textContent(), /<iframe/);
  await page.goto(new URL('/use-asset/?asset=' + encodeURIComponent('/sites/embed-widget-studio/variant-2/'), base).href);
  await page.getByRole('heading', { name: /Inspect/ }).waitFor();
  assert.equal(await page.locator('#downloadAsset').count(), 0, 'partial source is not exportable');
  assert.ok(await page.locator('.source-inspection code').count() > 0, 'missing files are identified');
  const externalRoute = Object.keys(packageData.review).find(key => key.startsWith('https://'));
  assert.ok(externalRoute, 'external application review entry exists');
  await page.goto(new URL('/use-asset/?asset=' + encodeURIComponent(externalRoute), base).href);
  assert.equal(await page.locator('#downloadAsset').count(), 0, 'external application is not exportable');
  assert.equal(await page.getByRole('link', { name: 'Open external application ↗' }).count(), 1);
  assert.deepEqual(errors, [], 'asset workflow should not raise browser errors');
  console.log(`Use This Asset smoke passed: ${Object.keys(manifest).length} eligible packages, single/variant actions, preview, and ZIP download.`);
} finally { await browser.close(); }
