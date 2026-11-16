import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createZip } from '../assets/js/zip-store.mjs';

const script = await readFile(new URL('../assets/js/tool-factory-engine.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(script, context);
const E = context.ToolFactoryEngine;
const makeCalc = (operation = 'difference') => ({ schema_version: E.VERSION, id: 'test-calculator', title: 'Test Calculator', archetype: 'calculator', inputs: [{ id: 'a', label: 'First', type: 'number', min: 0, max: 100 }, { id: 'b', label: 'Second', type: 'number', min: 0, max: 100 }], calculation: { operation }, outputs: [] });

test('calculator math and boundaries', () => {
  assert.equal(E.calculate(makeCalc(), { a: 10, b: 4 }).value, 6);
  assert.equal(E.calculate(makeCalc('sum'), { a: 10, b: 4 }).value, 14);
  assert.equal(E.calculate(makeCalc('multiply'), { a: 10, b: 4 }).value, 40);
  assert.equal(E.calculate(makeCalc('divide'), { a: 10, b: 4 }).value, 2.5);
  assert.equal(E.calculate(makeCalc(), { a: 0, b: 0 }).value, 0);
  assert.ok(E.calculate(makeCalc('divide'), { a: 10, b: 0 }).errors.length);
  for (const invalid of ['', 'abc', -1, 101, Infinity]) assert.ok(E.calculate(makeCalc(), { a: invalid, b: 2 }).errors.length);
});

test('scorecard gives explainable deterministic tier', () => {
  const s = { schema_version: E.VERSION, id: 'score', title: 'Score', archetype: 'scorecard', inputs: [], outputs: [], questions: [{ id: 'q', label: 'Question', options: [{ id: 'a', label: 'A', points: 0 }, { id: 'b', label: 'B', points: 2 }] }], tiers: [{ min: 0, label: 'Start', recommendation: 'Start here' }, { min: 2, label: 'Ready', recommendation: 'Go' }] };
  assert.equal(E.score(s, { q: 'b' }).label, 'Ready');
  assert.ok(E.score(s, {}).errors.length);
});

test('checklist includes selected items only', () => {
  const s = { schema_version: E.VERSION, id: 'list', title: 'List', archetype: 'checklist', inputs: [], outputs: [], sections: [{ label: 'First', items: [{ id: 'one', label: 'One' }, { id: 'two', label: 'Two' }] }] };
  assert.match(E.checklist(s, ['one']).text, /One/);
  assert.doesNotMatch(E.checklist(s, ['one']).text, /Two/);
  assert.ok(E.checklist(s, []).errors.length);
});

test('canonical source IDs and visibility policy', async () => {
  const data = JSON.parse(await readFile(new URL('../data/site-generator-prompts.json', import.meta.url), 'utf8'));
  const ids = new Set();
  for (const entry of data.entries) { assert.match(entry.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/); assert.ok(!ids.has(entry.id)); ids.add(entry.id); }
  assert.ok(data.entries.some(e => e.factory?.kind === 'site-idea'));
  const app = await readFile(new URL('../assets/js/tool-factory.js', import.meta.url), 'utf8');
  assert.match(app, /item\.visibility !== 'private'/);
  assert.match(app, /item\.hidden !== true/);
});

test('ZIP utility creates required file records', async () => {
  const names = ['index.html', 'styles.css', 'script.js', 'tool-spec.json', 'README.md'];
  const blob = createZip(names.map(name => ({ name, bytes: name })));
  const bytes = Buffer.from(await blob.arrayBuffer());
  for (const name of names) assert.ok(bytes.includes(Buffer.from(name)));
  assert.equal(bytes.readUInt32LE(0), 0x04034b50);
});
