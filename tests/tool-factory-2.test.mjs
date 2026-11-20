import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createZip } from '../assets/js/zip-store.mjs';

const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');
const engine = await read('assets/js/tool-factory-engine.js');
const extension = await read('assets/js/tool-factory-extension.js');
const runtime = await read('assets/js/tool-factory-runtime.js');
const factory = await read('assets/js/tool-factory.js');
const page = await read('factory/index.html');
const context = vm.createContext({});
vm.runInContext(engine + '\n' + extension, context);
const E = context.ToolFactoryEngine;
const common = { schema_version: E.VERSION2, id: 'example-tool', title: 'Example Tool', inputs: [], outputs: [] };
const comparison = () => ({ ...common, archetype: 'comparison', criteria: [{ id: 'quality', label: 'Quality', weight: 3 }, { id: 'cost', label: 'Cost', weight: 1 }], options: [{ id: 'alpha', label: 'Alpha', scores: { quality: 9, cost: 7 } }, { id: 'beta', label: 'Beta', scores: { quality: 6, cost: 10 } }] });
const eligibility = () => ({ ...common, archetype: 'eligibility', inputs: [{ id: 'budget', label: 'Budget', type: 'number', min: 0, max: 100, sample: 60 }, { id: 'owner', label: 'Owner named', type: 'boolean', sample: true }], rules: [{ input: 'budget', operator: 'gte', value: 50, reason: 'Minimum budget' }, { input: 'owner', operator: 'eq', value: true, reason: 'Owner identified' }] });
const tree = () => ({ ...common, archetype: 'decision-tree', start: 'start', nodes: [{ id: 'start', type: 'question', text: 'Server needed?', options: [{ id: 'yes', label: 'Yes', next: 'server' }, { id: 'no', label: 'No', next: 'static' }] }, { id: 'server', type: 'result', text: 'Use serverless' }, { id: 'static', type: 'result', text: 'Use static files' }] });

test('versioned extension keeps v1 validation intact', () => {
  assert.equal(E.VERSION, 'flash-ui-tool-spec/v1');
  assert.equal(E.VERSION2, 'flash-ui-tool-spec/v2');
  const legacy = { schema_version: E.VERSION, id: 'legacy', title: 'Legacy', archetype: 'calculator', inputs: [{ id: 'a', label: 'A', type: 'number', min: 0, max: 10 }, { id: 'b', label: 'B', type: 'number', min: 0, max: 10 }], outputs: [], calculation: { operation: 'difference' } };
  assert.deepEqual(Array.from(E.validate(legacy)), []);
  assert.equal(E.calculate(legacy, { a: 8, b: 3 }).value, 5);
});

test('comparison computes weighted rankings with explainable components', () => {
  const out = E.comparison(comparison());
  assert.deepEqual(Array.from(out.errors), []);
  assert.equal(out.winner.id, 'alpha');
  assert.equal(out.winner.score, 8.5);
  assert.match(out.winner.explanation, /Quality: 9\/10 × 3/);
  const invalid = comparison();
  invalid.options[0].scores.quality = 11;
  assert.ok(E.comparison(invalid).errors.length);
  invalid.options[0].scores.quality = Number.NaN;
  assert.ok(E.comparison(invalid).errors.length);
});

test('eligibility has deterministic pass/fail, boundaries, and disclosure', () => {
  assert.equal(E.eligibility(eligibility(), { budget: 50, owner: true }).eligible, true);
  const failed = E.eligibility(eligibility(), { budget: 49, owner: false });
  assert.equal(failed.eligible, false);
  assert.equal(failed.details.filter(d => !d.pass).length, 2);
  assert.match(failed.disclosure, /Not a lending decision/);
  assert.ok(E.eligibility(eligibility(), { budget: 101, owner: true }).errors.length);
  assert.ok(E.eligibility(eligibility(), { budget: '', owner: true }).errors.length);
});

test('tree follows selected branches and rejects cycles and dangling edges', () => {
  const incomplete = E.decisionTree(tree(), {});
  assert.equal(incomplete.next.id, 'start');
  assert.equal(E.decisionTree(tree(), { start: 'yes' }).result, 'Use serverless');
  assert.equal(E.decisionTree(tree(), { start: 'no' }).result, 'Use static files');
  const cyclic = tree(); cyclic.nodes[1] = { id: 'server', type: 'question', text: 'Again?', options: [{ label: 'Again', next: 'start' }, { label: 'No', next: 'static' }] };
  assert.ok(E.validate(cyclic).some(e => /cycle/.test(e)));
  const missing = tree(); missing.nodes[0].options[0].next = 'missing';
  assert.ok(E.validate(missing).some(e => /valid branches/.test(e)));
});

test('factory includes all archetypes, offline runtime and export controls', () => {
  for (const kind of ['comparison', 'eligibility', 'decision-tree']) {
    assert.match(page, new RegExp('value="' + kind + '"'));
    assert.match(runtime, new RegExp("spec\\.archetype === '" + kind + "'"));
  }
  assert.match(page, /tool-factory-extension\.js/);
  assert.match(page, /id="downloadBrief"/);
  assert.match(factory, /implementation-brief\.md/);
  assert.match(factory, /const \[engine, extension, runtime\] = await sourceText/);
  assert.match(factory, /downloadZip/);
  assert.match(factory, /copyEmbed/);
  assert.match(factory, /downloadSpec/);
  assert.match(factory, /source_refs/);
  assert.match(factory, /design_theme_id/);
  assert.match(factory, /max-width:500px/);
  assert.doesNotMatch(extension, /fetch\(|XMLHttpRequest|localStorage/);
});

test('offline ZIP store can be extracted without network dependencies', async () => {
  const fileNames = ['index.html', 'styles.css', 'script.js', 'tool-spec.json', 'README.md', 'implementation-brief.md'];
  const files = fileNames.map(name => ({ name, bytes: 'test file ' + name }));
  const bytes = Buffer.from(await createZip(files).arrayBuffer());
  let cursor = 0, extracted = [];
  while (bytes.readUInt32LE(cursor) === 0x04034b50) {
    const length = bytes.readUInt32LE(cursor + 18);
    const nameLength = bytes.readUInt16LE(cursor + 26);
    const extraLength = bytes.readUInt16LE(cursor + 28);
    const name = bytes.subarray(cursor + 30, cursor + 30 + nameLength).toString('utf8');
    const bodyStart = cursor + 30 + nameLength + extraLength;
    assert.equal(bytes.subarray(bodyStart, bodyStart + length).toString('utf8'), 'test file ' + name);
    extracted.push(name);
    cursor = bodyStart + length;
  }
  assert.deepEqual(extracted, fileNames);
  assert.equal(bytes.readUInt32LE(cursor), 0x02014b50);
});

test('factory supports 390px viewport controls and exported responsive styles', () => {
  assert.match(page, /name="viewport"/);
  assert.match(page, /data-view="editor"/);
  assert.match(page, /data-view="output"/);
  assert.match(factory, /@media\(max-width:500px\)/);
  assert.match(factory, /button\{width:100%\}/);
});
