import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import path from 'node:path';

const manifest = JSON.parse(readFileSync(new URL('../data/asset-packages.json', import.meta.url)));
const routes = JSON.parse(readFileSync(new URL('../data/asset-route-resolution.json', import.meta.url)));

test('exportable packages point to complete local static source', () => {
  assert.equal(manifest.schemaVersion, 2);
  for (const [route, entry] of Object.entries(manifest.entries)) {
    assert.equal(entry.previewPath, route);
    assert.equal(entry.status, 'complete static site');
    assert.deepEqual(entry.missingFiles, []);
    assert.ok(entry.files.some(file => file.name === 'index.html'));
    assert.equal(new Set(entry.files.map(file => file.name)).size, entry.files.length);
    assert.ok(routes.entries.some(item => item.resolvedPath === route && item.resolutionStatus === 'resolved'));
    for (const file of entry.files) assert.ok(existsSync(path.join(process.cwd(), decodeURIComponent(file.source))));
  }
});

test('partial and external assets have review paths without downloads', () => {
  assert.ok(Object.keys(manifest.review).length > 0);
  assert.ok(Object.keys(manifest.review).some(key => /^https:/.test(key)));
  for (const [route, entry] of Object.entries(manifest.review)) {
    assert.ok(!manifest.entries[route], `conflicting export status: ${route}`);
    assert.ok(entry.reason);
    assert.ok(['partial prototype', 'external application', 'standalone application'].includes(entry.status));
  }
});
