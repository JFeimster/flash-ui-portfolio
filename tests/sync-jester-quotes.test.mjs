import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { mkdtemp, mkdir, writeFile, rm, unlink } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { nestedText, resolveRoute, validateEditions, validateOutput, sync } from '../scripts/sync-jester-quotes.mjs';

const editions = JSON.parse(await readFile(new URL('../data/jester-quotes-editions.json', import.meta.url)));

test('all eight selectors retain verified routes and preview images', async () => {
  assert.equal(validateEditions(editions, editions).length, 8);
  for (const edition of editions) {
    const href = edition.default ? '/sites/jester-quotes/' : `https://jester-quotes.vercel.app${edition.destination}`;
    assert.match(href, edition.default ? /^\/sites\/jester-quotes\/$/ : /^https:\/\/jester-quotes\.vercel\.app\/editions\//);
    if (!edition.default) await stat(new URL(`../assets/previews/jester-editions/${edition.slug}.png`, import.meta.url));
  }
  await stat(new URL('../sites/jester-quotes/variants/index.html', import.meta.url));
  const previews = JSON.parse(await readFile(new URL('../data/asset-previews.json', import.meta.url)));
  assert.equal(previews.projects['jester-quotes'].target, '/sites/jester-quotes/');
  const cards = await readFile(new URL('../assets/js/app.js', import.meta.url), 'utf8');
  assert.match(cards, /row\.id === 'jester-quotes'.*\/sites\/jester-quotes\/variants\//);
});

test('nested links are rewritten and resolved under the existing route', () => {
  const html = nestedText(Buffer.from('<a href="/search/">Search</a><a href="/">Home</a><img src="/assets/a.png"><a href="https://other.test/">Other</a>'), '.html').toString();
  assert.match(html, /href="\/sites\/jester-quotes\/search\/"/);
  assert.match(html, /href="\/sites\/jester-quotes\/"/);
  assert.match(html, /src="\/sites\/jester-quotes\/assets\/a.png"/);
  assert.match(html, /href="https:\/\/other\.test\/"/);
  const names = new Set(['search/index.html', 'assets/a.png']);
  assert.equal(resolveRoute('/sites/jester-quotes/search/', names), true);
  assert.equal(resolveRoute('/sites/jester-quotes/missing/', names), false);
});

test('missing upstream routes fail validation before writes', () => {
  assert.throws(() => validateOutput(new Map([['index.html', Buffer.from('<html></html>')]]), editions), /Missing required static route/);
  const changed = structuredClone(editions);
  changed[1].destination = '/editions/unverified/';
  assert.throws(() => validateEditions(changed, editions), /route\/status changed/);
});

test('incremental sync changes only updated assets and fails safely on incomplete output', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'jester-sync-test-'));
  const root = join(scratch, 'portfolio');
  const source = join(scratch, 'source');
  const built = join(scratch, 'built');
  const put = async (base, name, value) => { const path = join(base, name); await mkdir(join(path, '..'), { recursive: true }); await writeFile(path, value); };
  const git = (...args) => execFileSync('git', args, { cwd: source, encoding: 'utf8' }).trim();
  const commit = () => { git('add', '.'); git('-c', 'user.name=Sync Test', '-c', 'user.email=sync@example.test', 'commit', '-m', 'fixture'); return git('rev-parse', 'HEAD'); };
  try {
    await mkdir(source, { recursive: true });
    git('init');
    await put(source, 'sites/dada-riot/src/data/editions.json', JSON.stringify(editions));
    let sha = commit();
    await put(root, 'data/jester-quotes-editions.json', JSON.stringify(editions));
    await put(root, 'sites/jester-quotes/variants/index.html', '<html>Existing hub</html>');
    await put(root, 'sites/other-project/index.html', '<html>Keep this card</html>');
    for (const edition of editions.filter(item => !item.default)) await put(root, `assets/previews/jester-editions/${edition.slug}.png`, 'approved artwork');
    for (const name of ['index.html', 'search/index.html', 'studio/index.html', 'collections/index.html', 'collections/test/index.html', 'quotes/index.html', 'quotes/test/index.html', ...editions.filter(item => !item.default).map(item => `${item.destination.slice(1)}index.html`)]) await put(built, name, '<html><a href="/search/">Search</a></html>');
    await put(built, 'assets/changed.txt', 'v1');
    await put(built, 'assets/untouched.txt', 'same');
    const args = ['--root', root, '--source-dir', source, '--built-dir', built];
    assert.ok((await sync([...args, '--source-sha', sha])).changed > 0);
    const untouched = join(root, 'sites/jester-quotes/assets/untouched.txt');
    const before = (await stat(untouched)).mtimeMs;
    assert.equal((await sync([...args, '--source-sha', sha])).changed, 0);
    await put(source, 'revision.txt', 'next');
    sha = commit();
    await put(built, 'assets/changed.txt', 'v2');
    assert.equal((await sync([...args, '--source-sha', sha])).changed, 1);
    assert.equal((await stat(untouched)).mtimeMs, before);
    assert.equal(await readFile(join(root, 'sites/other-project/index.html'), 'utf8'), '<html>Keep this card</html>');
    assert.equal(await readFile(join(root, 'sites/jester-quotes/variants/index.html'), 'utf8'), '<html>Existing hub</html>');
    await put(source, 'revision.txt', 'incomplete');
    sha = commit();
    await unlink(join(built, 'studio/index.html'));
    const manifestBefore = await readFile(join(root, 'data/jester-quotes-sync.json'), 'utf8');
    await assert.rejects(sync([...args, '--source-sha', sha]), /Missing required static route/);
    assert.equal(await readFile(join(root, 'data/jester-quotes-sync.json'), 'utf8'), manifestBefore);
  } finally { await rm(scratch, { recursive: true, force: true }); }
});
