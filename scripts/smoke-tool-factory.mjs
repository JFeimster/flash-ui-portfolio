import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
const failures = [];
page.on('pageerror', error => failures.push(error.message));

function extractStoreZip(bytes) {
  const files = new Map(); let offset = 0;
  while (offset + 30 <= bytes.length && bytes.readUInt32LE(offset) === 0x04034b50) {
    const size = bytes.readUInt32LE(offset + 18);
    const fileLen = bytes.readUInt16LE(offset + 26), extraLen = bytes.readUInt16LE(offset + 28);
    const nameStart = offset + 30, start = nameStart + fileLen + extraLen;
    const name = bytes.subarray(nameStart, nameStart + fileLen).toString('utf8');
    assert.ok(name && !name.includes('..') && !name.startsWith('/'), 'ZIP entry must be safe');
    assert.ok(start + size <= bytes.length, 'ZIP member is within bounds');
    files.set(name, bytes.subarray(start, start + size));
    offset = start + size;
  }
  assert.equal(bytes.readUInt32LE(offset), 0x02014b50, 'ZIP central directory is present');
  return files;
}

async function select(kind) {
  await page.locator('#archetype').selectOption(kind);
  await page.locator('#build').click();
  await page.waitForTimeout(750);
  const status = await page.locator('#status').innerText();
  if (!/preview ready/i.test(status)) throw new Error('Factory '+kind+' failed to build: '+status+'; browser errors: '+failures.join('; '));
  await page.locator('[data-view="output"]').click();
  await page.locator('[data-tab="preview"]').click();
  await page.frameLocator('#preview').locator('.tool-title').waitFor({ timeout: 10000 });
}

try {
  await page.goto(base + '/factory/', { waitUntil: 'networkidle' });
  assert.match(await page.title(), /Tool Factory/);
  await page.locator('[data-view="editor"]').click();
  await select('comparison');
  const preview = page.frameLocator('#preview');
  await preview.getByRole('button', { name: 'Compare options' }).click();
  await preview.locator('.tool-result').getByText(/Self-service:/).waitFor();
  assert.match(await preview.locator('.tool-result').innerText(), /Weights are normalized/);

  await page.locator('[data-view="editor"]').click();
  await select('eligibility');
  await preview.getByRole('button', { name: 'Run illustrative assessment' }).click();
  assert.match(await preview.locator('.tool-result').innerText(), /Not a lending decision/);
  await preview.locator('input[name="budget"]').fill('0');
  await preview.getByRole('button', { name: 'Run illustrative assessment' }).click();
  assert.match(await preview.locator('.tool-result').innerText(), /Does not meet all example rules/);

  await page.locator('[data-view="editor"]').click();
  await select('decision-tree');
  await preview.getByRole('button', { name: 'Yes' }).click();
  await preview.getByRole('button', { name: 'No' }).click();
  assert.match(await preview.locator('.tool-result').innerText(), /serverless application/);
  await preview.getByRole('button', { name: 'Start over' }).click();
  await preview.getByRole('button', { name: 'No' }).click();
  assert.match(await preview.locator('.tool-result').innerText(), /static HTML tool/);

  await page.locator('[data-view="editor"]').click();
  await select('calculator');
  await preview.getByRole('button', { name: 'Calculate' }).click();
  assert.match(await preview.locator('.tool-result').innerText(), /4500/);

  await page.locator('[data-view="editor"]').click();
  await select('comparison');
  const event = page.waitForEvent('download');
  await page.locator('#downloadZip').click();
  const download = await event;
  const zipBytes = await readFile(await download.path());
  const files = extractStoreZip(zipBytes);
  for(const name of ['index.html','styles.css','script.js','tool-spec.json','README.md','implementation-brief.md']) assert.ok(files.has(name), 'Missing ZIP member: '+name);
  assert.match(files.get('script.js').toString(), /ToolFactoryEngine/);
  assert.match(files.get('script.js').toString(), /ToolFactoryRuntime/);
  assert.match(files.get('script.js').toString(), /VERSION2/);
  const dir = await mkdtemp(path.join(tmpdir(), 'tool-factory-'));
  for(const [name, bytes] of files) await writeFile(path.join(dir, name), bytes);
  const standalone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await standalone.goto(pathToFileURL(path.join(dir,'index.html')).href);
  await standalone.getByRole('button', { name: 'Compare options' }).click();
  assert.match(await standalone.locator('.tool-result').innerText(), /Weights are normalized/);
  await standalone.close();

  const briefEvent = page.waitForEvent('download');
  await page.locator('#downloadBrief').click();
  const brief = await briefEvent;
  assert.match(brief.suggestedFilename(), /implementation-brief\.md$/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 2, '390px page has horizontal overflow: '+overflow);
  assert.deepEqual(failures, [], 'No uncaught browser errors');
  console.log('PASS: 390px factory flow, 4 archetypes, ZIP extraction, offline file:// execution, Markdown export, no overflow/errors');
} finally {
  await browser.close();
}
