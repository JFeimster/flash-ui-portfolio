import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4174';
const browser = await chromium.launch({ headless: true });
const temp = await mkdtemp(join(tmpdir(), 'flash-ui-tool-factory-'));
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, acceptDownloads: true });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/factory/`);
    await page.getByText('Working calculator preview ready.').waitFor();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.className), 'skip', 'skip link should be first keyboard target');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${width}px overflow`);
    if (width === 390) await page.getByRole('tab', { name: 'Output', exact: true }).click();
    const frame = page.frameLocator('#preview');
    await frame.getByRole('button', { name: 'Calculate' }).click();
    await frame.getByText(/Estimated gap: 4500/).waitFor();
    await frame.locator('#tool-expenses').fill('-1');
    await frame.getByRole('button', { name: 'Calculate' }).click();
    await frame.getByText(/use 0 to/).waitFor();
    if (width === 390) await page.getByRole('tab', { name: 'Editor' }).click();
    await page.locator('#archetype').selectOption('scorecard'); await page.locator('#build').click();
    if (width === 390) await page.getByRole('tab', { name: 'Output', exact: true }).click();
    await frame.getByText('Question 1 of 3').waitFor();
    await frame.getByRole('button', { name: 'Next' }).click();
    await frame.getByText(/Choose an answer/).waitFor();
    await frame.getByText('Clearly defined').click(); await frame.getByRole('button', { name: 'Next' }).click();
    await frame.getByText('Question 2 of 3').waitFor();
    await frame.getByRole('button', { name: 'Back' }).click(); await frame.getByText('Question 1 of 3').waitFor();
    if (width === 390) await page.getByRole('tab', { name: 'Editor' }).click();
    await page.locator('#archetype').selectOption('checklist'); await page.locator('#build').click();
    if (width === 390) await page.getByRole('tab', { name: 'Output', exact: true }).click();
    await frame.getByText('Verify the core logic').click(); await frame.getByRole('button', { name: 'Make checklist' }).click();
    await frame.getByText(/Demo checklist/).waitFor();
    await page.getByRole('tab', { name: 'Brief' }).click(); assert.ok((await page.locator('#briefOutput').inputValue()).includes('Core Logic / Function'));
    await page.getByRole('tab', { name: 'Preview' }).click(); await frame.getByText(/Demo checklist/).waitFor();
    if (width === 1440) {
      const downloadEvent = page.waitForEvent('download'); await page.locator('#downloadZip').click(); const downloaded = await downloadEvent; const zipPath = join(temp, 'tool.zip'); await downloaded.saveAs(zipPath);
      execFileSync('python', ['-c', 'import zipfile,sys; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])', zipPath, join(temp, 'extracted')]);
      const exported = await browser.newPage(); await exported.goto(pathToFileURL(join(temp, 'extracted', 'index.html')).href); await exported.getByText('Tool Launch Checklist').waitFor(); await exported.getByText('Verify the core logic').click(); await exported.getByRole('button', { name: 'Make checklist' }).click(); await exported.getByText(/Demo checklist/).waitFor(); await exported.close();
      await page.locator('#sourceSearch').fill('calculator'); await page.locator('[data-source-id]').first().click(); assert.ok((await page.locator('#specEditor').inputValue()).includes('"source_refs"'));
      await page.goto(`${base}/factory/?idea=logline-lab`); await page.locator('#title').waitFor(); assert.equal(await page.locator('#title').inputValue(), 'Logline Lab');
    }
    assert.deepEqual(errors, [], `page errors at ${width}px`);
    await page.close();
  }
  const hidden = await browser.newPage();
  await hidden.route('**/data/site-generator-public.json', async route => route.fulfill({ json: { entries: [{ id: 'secret-tool', name: 'Secret Tool', type: 'Calculator', factory: { kind: 'site-idea' }, visibility: 'private' }, { id: 'public-tool', name: 'Public Tool', type: 'Calculator', factory: { kind: 'site-idea' } }] } }));
  await hidden.goto(`${base}/factory/`); await hidden.locator('#sourceSearch').fill('Tool');
  assert.equal(await hidden.locator('[data-source-id="secret-tool"]').count(), 0);
  assert.equal(await hidden.locator('[data-source-id="public-tool"]').count(), 1);
  await hidden.close();
} finally { await browser.close(); await rm(temp, { recursive: true, force: true }); }
