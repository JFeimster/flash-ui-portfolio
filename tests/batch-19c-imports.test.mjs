import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import path from 'node:path';

const mapping = JSON.parse(readFileSync(new URL('../data/batch-19c-import-mapping.json', import.meta.url)));
const routes = JSON.parse(readFileSync(new URL('../data/asset-route-resolution.json', import.meta.url)));

test('imports preserve provenance and resolve one real route per source', () => {
  assert.equal(mapping.imports.length, 14);
  assert.equal(new Set(mapping.imports.map(item => item.entrySha256)).size, 14);
  for (const item of mapping.imports) {
    const target = path.join(process.cwd(), item.destination, 'index.html');
    assert.ok(existsSync(target), target);
    assert.equal(routes.entries.filter(entry => entry.resolvedPath === `/${item.destination}` && entry.canonicalGroupId === item.familyId && entry.resolutionStatus === 'resolved').length, 1);
    for (const file of item.files) assert.ok(existsSync(path.join(process.cwd(), item.destination, file)));
  }
});

test('imported HTML local stylesheet and script references exist', () => {
  for (const item of mapping.imports) {
    const dir = path.join(process.cwd(), item.destination);
    for (const file of item.files.filter(name => name.endsWith('.html'))) {
      const html = readFileSync(path.join(dir, file), 'utf8');
      for (const match of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+\.(?:css|js|mjs)(?:\?[^"']*)?)["']/gi)) {
        const ref = match[1].split('?')[0];
        if (/^(https?:|\/\/|data:)/i.test(ref)) continue;
        const target = ref.startsWith('/') ? path.join(process.cwd(), decodeURIComponent(ref)) : path.resolve(dir, path.dirname(file), decodeURIComponent(ref));
        assert.ok(existsSync(target), `${item.destination}${file}: ${ref}`);
      }
    }
  }
});
