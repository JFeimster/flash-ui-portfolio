#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const TARGET = 'sites/jester-quotes';
const MANIFEST = 'data/jester-quotes-sync.json';
const EDITIONS = 'data/jester-quotes-editions.json';
const HUB = 'sites/jester-quotes/variants/index.html';
const SOURCE_URL = 'https://github.com/JFeimster/jester-quotes.git';
const SITE_URL = 'https://flash-ui-portfolio.vercel.app/sites/jester-quotes/';
const hash = value => createHash('sha256').update(value).digest('hex');
const slash = value => value.split(sep).join('/');

function options(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!['--source-sha', '--source-dir', '--built-dir', '--root'].includes(key) || !argv[i + 1]) throw new Error(`Invalid argument: ${key}`);
    result[key.slice(2)] = argv[++i];
  }
  if (result['source-sha'] && !/^[a-f0-9]{40}$/.test(result['source-sha'])) throw new Error('Source SHA must be a full 40-character commit hash');
  return result;
}

function command(cmd, args, cwd, env = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.platform === 'win32' && cmd === 'npm' ? 'npm.cmd' : cmd, args, { cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'inherit'] });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolvePromise(output.trim()) : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`)));
  });
}

async function files(dir) {
  const output = [];
  async function visit(folder) {
    for (const item of await readdir(folder, { withFileTypes: true })) {
      if (item.isSymbolicLink()) throw new Error(`Symlink in static output: ${item.name}`);
      const path = join(folder, item.name);
      if (item.isDirectory()) await visit(path);
      else if (item.isFile()) output.push(slash(relative(dir, path)));
    }
  }
  await visit(dir);
  return output.sort();
}

const textExtensions = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.webmanifest', '.svg']);
export function nestedText(input, extension) {
  let value = input.toString('utf8');
  // The source uses absolute local links. Keep every internal route under the existing import.
  value = value.replace(/(["'`])\/(?=\1)/g, `$1/${TARGET}/`);
  value = value.replace(/(["'`])\/(?!\/|sites\/jester-quotes\/)(?=[A-Za-z0-9_#?])/g, `$1/${TARGET}/`);
  value = value.replace(/(href|src|action|poster|content)=(['"])\/(?!\/|sites\/jester-quotes\/)/gi, `$1=$2/${TARGET}/`);
  value = value.replace(/url\(\s*(['"]?)\/(?!\/|sites\/jester-quotes\/)/gi, `url($1/${TARGET}/`);
  if (extension === '.html' || extension === '.xml' || extension === '.txt') {
    value = value.replaceAll('https://jester-quotes.vercel.app/', SITE_URL);
    if (extension === '.html') value = value.replace(/<meta name="robots" content="[^"]*"/i, '<meta name="robots" content="noindex, nofollow, noarchive"');
  }
  return Buffer.from(value);
}

export function validateEditions(source, existing) {
  if (!Array.isArray(source) || source.length !== 8 || source.filter(item => item.default).length !== 1 || source.find(item => item.default)?.slug !== 'dada-riot') throw new Error('Canonical edition registry is incomplete');
  if (!Array.isArray(existing) || existing.length !== 8) throw new Error('Existing eight-edition portfolio registry is missing');
  for (const edition of source) {
    const old = existing.find(item => item.slug === edition.slug);
    if (!old || !['full', 'preview'].includes(edition.status) || edition.status !== old.status || edition.destination !== old.destination || !/^\/(?:[a-z0-9-]+\/)*$/.test(edition.destination)) throw new Error(`Edition route/status changed; review required: ${edition.slug}`);
  }
  return source.map(item => ({ ...item }));
}

export function resolveRoute(path, available) {
  const local = path.split(/[?#]/, 1)[0];
  if (!local.startsWith(`/${TARGET}/`)) return true;
  const rel = decodeURIComponent(local.slice(TARGET.length + 2));
  if (rel.includes('..') || rel.startsWith('/')) return false;
  return available.has(rel) || available.has(`${rel}index.html`) || available.has(`${rel}/index.html`);
}

export function validateOutput(output, editionRegistry) {
  const names = new Set(output.keys());
  for (const route of ['index.html', 'search/index.html', 'studio/index.html', 'collections/index.html', 'quotes/index.html']) if (!names.has(route)) throw new Error(`Missing required static route: ${route}`);
  if (![...names].some(name => /^quotes\/[^/]+\/index\.html$/.test(name))) throw new Error('Missing nested quote pages');
  if (![...names].some(name => /^collections\/[^/]+\/index\.html$/.test(name))) throw new Error('Missing nested collection pages');
  for (const edition of editionRegistry) {
    const route = edition.destination === '/' ? 'index.html' : `${edition.destination.slice(1)}index.html`;
    if (!names.has(route)) throw new Error(`Missing edition output: ${route}`);
  }
  for (const [name, contents] of output) {
    if (!name.endsWith('.html')) continue;
    const html = contents.toString('utf8');
    for (const match of html.matchAll(/(?:href|src|action|poster)=(['"])(.*?)\1/gi)) {
      if (!resolveRoute(match[2], names) && !match[2].startsWith(`/${TARGET}/variants/`)) throw new Error(`Broken local link in ${name}: ${match[2]}`);
    }
  }
}

async function capturePreviews(output, editions, previous, root) {
  const pending = editions.filter(item => !item.default && (previous.previewSources?.[item.slug] !== hash(output.get(`${item.destination.slice(1)}index.html`))));
  const missing = [];
  for (const item of editions.filter(item => !item.default)) {
    try { await stat(join(root, 'assets/previews/jester-editions', `${item.slug}.png`)); }
    catch { missing.push(item); }
  }
  for (const item of missing) if (!pending.includes(item)) pending.push(item);
  const previewSources = Object.fromEntries(editions.filter(item => !item.default).map(item => [item.slug, hash(output.get(`${item.destination.slice(1)}index.html`))]));
  if (!previous.sourceSha && missing.length === 0) return { previewSources, images: [] }; // Adopt the approved existing captures.
  if (pending.length === 0) return { previewSources, images: [] };
  const { chromium } = await import('playwright');
  const server = createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const local = pathname.startsWith(`/${TARGET}/`) ? pathname.slice(TARGET.length + 2) : pathname.slice(1);
      const name = pathname.endsWith('/') ? `${local}index.html` : local;
      const value = output.get(name);
      if (!value) { response.writeHead(404); response.end(); return; }
      response.setHeader('Content-Type', name.endsWith('.html') ? 'text/html' : name.endsWith('.css') ? 'text/css' : name.endsWith('.js') ? 'text/javascript' : 'application/octet-stream');
      response.end(value);
    } catch { response.writeHead(400); response.end(); }
  });
  await new Promise(resolvePromise => server.listen(0, '127.0.0.1', resolvePromise));
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const images = [];
    for (const item of pending) {
      const response = await page.goto(`http://127.0.0.1:${server.address().port}${item.destination}`, { waitUntil: 'networkidle' });
      if (!response?.ok()) throw new Error(`Preview route failed: ${item.destination}`);
      images.push([join(root, 'assets/previews/jester-editions', `${item.slug}.png`), await page.screenshot({ type: 'png', animations: 'disabled' })]);
    }
    return { previewSources, images };
  } finally { await browser?.close(); await new Promise(resolvePromise => server.close(resolvePromise)); }
}

export async function sync(argv = process.argv.slice(2)) {
  const opts = options(argv);
  const root = opts.root ? resolve(opts.root) : ROOT;
  const previous = JSON.parse(await readFile(join(root, MANIFEST), 'utf8').catch(() => '{}'));
  const existing = JSON.parse(await readFile(join(root, EDITIONS), 'utf8'));
  await stat(join(root, HUB));
  let temporary;
  try {
    let sourceDir = opts['source-dir'] && resolve(opts['source-dir']);
    if (!sourceDir) {
      temporary = await mkdtemp(join(tmpdir(), 'jester-sync-'));
      await command('git', ['clone', '--depth', '1', '--branch', 'main', SOURCE_URL, temporary], root);
      sourceDir = temporary;
    }
    const revision = await command('git', ['rev-parse', 'HEAD'], sourceDir);
    if (opts['source-sha'] && revision !== opts['source-sha']) throw new Error(`Source revision moved: expected ${opts['source-sha']}, got ${revision}`);
    if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Unable to resolve canonical source commit');
    const sourceSite = join(sourceDir, 'sites', 'dada-riot');
    const editions = validateEditions(JSON.parse(await readFile(join(sourceSite, 'src/data/editions.json'), 'utf8')), existing);
    if (previous.sourceSha === revision && previous.version === 1) {
      let intact = true;
      for (const [name, expected] of Object.entries(previous.files || {})) {
        const actual = await readFile(join(root, TARGET, name)).catch(() => null);
        if (!actual || hash(actual) !== expected) { intact = false; break; }
      }
      if (intact && Object.keys(previous.files || {}).length) { console.log(`No changes: ${revision}`); return { changed: 0, revision }; }
    }
    if (!opts['built-dir']) {
      await command('npm', ['ci', '--ignore-scripts'], sourceSite);
      await command('npm', ['run', 'build'], sourceSite, { PUBLIC_SITE_URL: SITE_URL, VERCEL_ENV: 'preview' });
    }
    const buildDir = opts['built-dir'] ? resolve(opts['built-dir']) : join(sourceSite, 'dist');
    const output = new Map();
    for (const name of await files(buildDir)) {
      if (name === 'variants/index.html' || name.startsWith('variants/') || name.startsWith('.') || name.split('/').some(part => ['node_modules', '.git', '.astro'].includes(part))) continue;
      const value = await readFile(join(buildDir, name));
      output.set(name, textExtensions.has(extname(name)) ? nestedText(value, extname(name)) : value);
    }
    validateOutput(output, editions);
    const previews = await capturePreviews(output, editions, previous, root);
    const filesHash = Object.fromEntries([...output].map(([name, value]) => [name, hash(value)]));
    const modified = [];
    for (const [name, value] of output) {
      const destination = join(root, TARGET, name);
      const current = await readFile(destination).catch(() => null);
      if (current && hash(current) === filesHash[name]) continue;
      modified.push([destination, value]);
    }
    const editionsText = `${JSON.stringify(editions, null, 2)}\n`;
    const editionChanged = JSON.stringify(existing) !== JSON.stringify(editions);
    const manifest = { version: 1, source: 'JFeimster/jester-quotes', sourceSha: revision, sourceSite: 'sites/dada-riot', destination: `/${TARGET}/`, files: filesHash, previewSources: previews.previewSources };
    const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
    // All input and route checks finish before the first portfolio write.
    for (const [destination, value] of modified) { await mkdir(dirname(destination), { recursive: true }); await writeFile(destination, value); }
    for (const [destination, value] of previews.images) { await mkdir(dirname(destination), { recursive: true }); await writeFile(destination, value); }
    if (editionChanged) await writeFile(join(root, EDITIONS), editionsText);
    if ((await readFile(join(root, MANIFEST), 'utf8').catch(() => '')) !== manifestText) await writeFile(join(root, MANIFEST), manifestText);
    console.log(`Synced ${revision}: ${modified.length} changed static files, ${output.size - modified.length} reused`);
    return { changed: modified.length + Number(editionChanged), revision };
  } finally { if (temporary) await rm(temporary, { recursive: true, force: true }); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) sync().catch(error => { console.error(error.message); process.exitCode = 1; });
