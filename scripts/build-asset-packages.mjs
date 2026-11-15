#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routes = JSON.parse(fs.readFileSync(path.join(root, 'data/asset-route-resolution.json'), 'utf8'));
const showcase = JSON.parse(fs.readFileSync(path.join(root, 'data/asset-showcase.json'), 'utf8')).projects || {};
const allowed = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.txt', '.md', '.woff', '.woff2', '.ttf', '.otf']);
const ignoredDirs = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'variants', 'variations']);
const ignoredNames = new Set(['runner-brief.json', 'package-lock.json']);
const posix = value => value.split(path.sep).join('/');
const isInside = (parent, child) => child === parent || child.startsWith(parent + path.sep);
const entrypoint = source => {
  const absolute = path.resolve(root, source);
  return isInside(path.join(root, 'sites'), absolute) && fs.existsSync(absolute) && fs.statSync(absolute).isFile() ? absolute : null;
};
function filesIn(directory, singleFile = null) {
  const files = [];
  function walk(current) {
    for (const item of fs.readdirSync(current, { withFileTypes: true })) {
      if (item.name.startsWith('.') || ignoredNames.has(item.name)) continue;
      const absolute = path.join(current, item.name);
      if (item.isDirectory()) {
        if (!ignoredDirs.has(item.name) && !/^variant-\d+$/.test(item.name)) walk(absolute);
      } else if (item.isFile() && allowed.has(path.extname(item.name).toLowerCase())) {
        files.push(absolute);
      }
    }
  }
  if (singleFile) files.push(singleFile); else walk(directory);
  return files;
}
function localReferences(contents) {
  const refs = [];
  for (const match of contents.matchAll(/\bsrc\s*=\s*["']([^"']+)["']|<link\b[^>]*\bhref\s*=\s*["']([^"']+)["']|url\(\s*["']?([^)'"\s]+)|@import\s+["']([^"']+)/gi)) {
    const value = (match[1] || match[2] || match[3] || match[4]).split(/[?#]/)[0].trim();
    if (!value || value.startsWith('#') || /^%23/i.test(value) || /^(?:[a-z][a-z\d+.-]*:|\/\/|data:)/i.test(value)) continue;
    refs.push(value);
  }
  return refs;
}
function collect(source) {
  const absolute = entrypoint(source);
  if (!absolute || path.extname(absolute).toLowerCase() !== '.html') return null;
  const dir = path.dirname(absolute);
  const rootHtml = dir === path.join(root, 'sites');
  const files = filesIn(dir, rootHtml ? absolute : null);
  if (!files.includes(absolute)) files.push(absolute);
  // Root-level loose HTML files share a folder with unrelated projects; follow only their own references.
  if (rootHtml) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!['.html', '.css'].includes(path.extname(file).toLowerCase())) continue;
      for (const ref of localReferences(fs.readFileSync(file, 'utf8'))) {
        if (ref.startsWith('/')) return null;
        const target = path.resolve(path.dirname(file), decodeURIComponent(ref));
        if (!isInside(dir, target) || !fs.existsSync(target) || !fs.statSync(target).isFile() || !allowed.has(path.extname(target).toLowerCase())) return null;
        if (!files.includes(target)) files.push(target);
      }
    }
  }
  // A package must contain every relative asset referenced by its HTML/CSS.
  const included = new Set(files);
  for (const file of files) {
    if (!['.html', '.css'].includes(path.extname(file).toLowerCase())) continue;
    for (const ref of localReferences(fs.readFileSync(file, 'utf8'))) {
      if (ref.startsWith('/')) return null;
      const target = path.resolve(path.dirname(file), decodeURIComponent(ref));
      if (!included.has(target)) return null;
    }
  }
  return files.sort((a, b) => a.localeCompare(b)).map(file => ({
    source: '/' + posix(path.relative(root, file)).split('/').map(encodeURIComponent).join('/'),
    name: file === absolute ? 'index.html' : posix(path.relative(dir, file))
  }));
}

const entries = {};
const skipped = [];
const hubPaths = new Set((routes.groups || []).map(group => group.hubPath));
for (const item of routes.entries || []) {
  if (item.resolutionStatus !== 'resolved' || !item.resolvedPath || hubPaths.has(item.resolvedPath) || item.type === 'group-hub' || item.type === 'archive' || item.type === 'standalone-app') continue;
  const files = collect(item.sourcePath);
  if (!files?.length) { skipped.push(item.resolvedPath); continue; }
  const key = item.canonicalGroupId || item.slug;
  const copy = showcase[key] || {};
  entries[item.resolvedPath] = {
    title: item.title || copy.title || key,
    description: item.description || copy.description || '',
    category: item.category || '',
    variantNumber: item.variantNumber || null,
    previewPath: item.resolvedPath,
    files
  };
}
const output = { schemaVersion: 1, entries };
fs.writeFileSync(path.join(root, 'data/asset-packages.json'), JSON.stringify(output, null, 2) + '\n');
console.log(`Asset packages: ${Object.keys(entries).length} eligible, ${skipped.length} skipped (missing or external local dependencies).`);
if (skipped.length) console.log(skipped.join('\n'));
