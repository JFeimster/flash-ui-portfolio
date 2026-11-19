import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import path from 'node:path';

const read = name => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url)));
const routes = read('asset-route-resolution');
const contracts = read('variant-route-contracts');
const groups = read('asset-groups');
const expected = new Map([
  ['acquisition-financing-calculator', 1],
  ['ai-funding-strategist-landing-page', 2],
  ['cfo-in-a-box', 1],
  ['partner-account-portal', 4],
  ['static-site-prompt-generator-for-flash-ui', 1],
  ['stockout-death-spiral-estimator', 1],
  ['moonshine-capital-partners', 4],
]);

test('recovered families resolve to one group and their real source pages', () => {
  for (const [id, count] of expected) {
    const group = routes.groups.filter(item => item.groupId === id);
    assert.equal(group.length, 1, id);
    assert.equal(group[0].variantCount, count, id);
    assert.equal(groups.groups.filter(item => item.groupId === id).length, 1, id);
    const contract = contracts.groups.find(item => item.groupId === id);
    assert.equal(contract.variants.length, count, id);
    assert.equal(routes.entries.filter(item => item.canonicalGroupId === id && item.type === 'group-hub').length, 1, id);
    for (const variant of contract.variants) {
      const matching = routes.entries.filter(item => item.canonicalGroupId === id && item.variantNumber === variant.number);
      assert.equal(matching.length, 1, `${id} ${variant.number}`);
      assert.equal(matching[0].resolvedPath, variant.path);
      assert.equal(matching[0].resolutionStatus, 'resolved');
      assert.ok(existsSync(path.join(process.cwd(), decodeURIComponent(variant.path), 'index.html')));
    }
  }
});

test('19A widget ownership remains intact', () => {
  const widget = routes.entries.filter(item => item.canonicalGroupId === 'embed-widget-studio' && item.variantNumber);
  const code = routes.entries.filter(item => item.canonicalGroupId === 'embed-code-generator' && item.variantNumber);
  assert.deepEqual(widget.map(item => item.variantNumber).sort(), [1, 2]);
  assert.deepEqual(code.map(item => item.variantNumber).sort(), [1, 2, 3]);
  assert.equal(widget.find(item => item.variantNumber === 2).sourcePath, 'sites/embed-code-generator/variant-3/index.html');
});
