import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${base}/sites/`);
  await page.locator('[data-project]').first().waitFor();
  assert.equal(await page.locator('[data-project]').count(), 24, 'initial catalog page size');
  assert.equal(await page.locator('[data-project="stockout-death-spiral-estimator"]').count(), 0, 'initial page is progressive');
  await page.locator('#searchInput').fill('stockout');
  assert.equal(await page.locator('[data-project]').count(), 1, 'search matches project name');
  assert.match(await page.locator('[data-project]').first().locator('a.btn.primary').getAttribute('href'), /stockout-death-spiral-estimator\/variant-1\/$/);
  await page.locator('[data-project]').first().locator('[data-quick-preview]').click();
  assert.equal(await page.locator('#quickPreviewDialog').evaluate(node => node.open), true, 'quick preview opens');
  assert.match(await page.locator('#quickPreviewOpen').getAttribute('href'), /stockout-death-spiral-estimator\/variant-1\/$/);
  await page.locator('[data-close-preview]').click();
  await page.locator('#searchInput').fill('Moonshine partner welcome portal');
  assert.equal(await page.locator('[data-project="partner-account-portal"]').count(), 1, 'variant description is searchable');
  await page.locator('#searchInput').fill('');
  await page.locator('#browseFilter').selectOption('featured');
  assert.ok(await page.locator('[data-project]').count() > 0, 'featured results');
  await page.locator('#browseFilter').selectOption('all');
  await page.locator('#categoryFilter').selectOption('Funding Tools');
  assert.ok(await page.locator('[data-project]').count() > 0, 'category results');
  await page.locator('#categoryFilter').selectOption('All');
  await page.locator('#typeFilter').selectOption('variants');
  assert.ok(await page.locator('[data-project="hard-money"]').count() <= 1, 'one card per project');
  await page.locator('#typeFilter').selectOption('All');
  await page.locator('#loadMore').click();
  assert.equal(await page.locator('[data-project]').count(), 48, 'show more adds one page');
  await page.locator('#searchInput').fill('Moonshine Capital Partners');
  const moonshine = page.locator('[data-project="moonshine-capital-partners"]');
  assert.equal(await moonshine.count(), 1);
  assert.match(await moonshine.locator('a.btn.primary').getAttribute('href'), /\/sites\/moonshine-capital-partners\/$/);
  await moonshine.locator('a.btn.primary').click();
  assert.equal(await page.locator('.variant-card').count(), 4, 'four source variations in hub');
  await page.locator('.variant-card a.btn.primary').first().click();
  assert.match(page.url(), /Moonshine%20Capital%20Partners|Moonshine Capital Partners/);
  await page.goto(`${base}/sites/`);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile has no horizontal overflow');
  console.log('Directory navigation, search, grouping, filters, pagination, and mobile smoke passed.');
} finally {
  await browser.close();
}
