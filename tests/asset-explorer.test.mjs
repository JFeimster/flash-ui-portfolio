import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { filterAssets } from '../assets/js/asset-explorer-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const graph = JSON.parse(fs.readFileSync(path.join(root, 'data/asset-graph.public.json')));

test('public export has safe URLs, stable IDs, and resolvable edges', () => {
  const ids = new Set(graph.nodes.map(n => n.id));
  assert.equal(ids.size, graph.nodes.length);
  for (const node of graph.nodes) {
    assert.match(node.id, /^(idea|site|github|vercel|gpt|tool|capability):[a-z0-9-]+$/);
    if (node.url) assert.ok(node.url.startsWith('/') || node.url.startsWith('https://'));
    assert.doesNotMatch(JSON.stringify(node), /vercel\.com\/|chatgpt\.com\/gpts\/editor/i);
    if (node.type === 'site') assert.ok(fs.existsSync(path.join(root, node.url, 'index.html')));
  }
  for (const edge of graph.edges) {
    assert.ok(ids.has(edge.from) && ids.has(edge.to));
    assert.ok(edge.provenance && edge.confidence && edge.status);
  }
});

test('private records, editor URLs, unsafe URLs and duplicate records are excluded', () => {
  const input = fs.mkdtempSync(path.join(os.tmpdir(), 'flash-asset-input-'));
  const output = path.join(input, 'public.json');
  const write = (name, entries) => fs.writeFileSync(path.join(input, name), JSON.stringify({ entries }));
  try {
    write('github-repos.registry.json', [
      { name:'Hidden Repo', visibility:'private', github_url:'https://github.com/example/hidden' },
      { name:'Visible Repo', visibility:'public', github_url:'https://github.com/example/visible' },
      { name:'Duplicate Repo', visibility:'public', github_url:'https://github.com/example/visible' },
      { name:'Unsafe Repo', visibility:'public', github_url:'javascript:alert(1)' }
    ]);
    write('vercel-projects.registry.json', [
      { id:'hidden', visibility:'private', public_url:'https://hidden.vercel.app', github_repo:'example/visible' },
      { id:'visible', public_url:'https://visible.vercel.app', github_repo:'example/visible' },
      { id:'admin', public_url:'https://vercel.com/admin' }
    ]);
    write('custom-gpts.registry.json', [
      { name:'Public GPT', access_url:'https://chatgpt.com/g/g-abc123-public-gpt' },
      { name:'Private GPT', visibility:'private', access_url:'https://chatgpt.com/g/g-secret-private-gpt' },
      { name:'Editor GPT', access_url:'https://chatgpt.com/gpts/editor/g-abc123' }
    ]);
    write('flash-ui-prompt-commands.registry.json', []);
    const run = spawnSync(process.execPath, [path.join(root,'scripts/build-asset-graph.mjs'),'--input-dir',input,'--output',output], { encoding:'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(fs.readFileSync(output));
    assert.ok(result.nodes.some(n => n.id === 'github:example-visible'));
    assert.ok(result.nodes.some(n => n.id === 'vercel:visible'));
    assert.ok(result.nodes.some(n => n.id === 'gpt:g-abc123'));
    assert.ok(!result.nodes.some(n => /hidden|secret|admin|unsafe/i.test(n.id)));
    assert.equal(result.nodes.filter(n => n.id === 'github:example-visible').length,1);
    assert.ok(result.edges.some(e => e.from === 'github:example-visible' && e.to === 'vercel:visible'));
  } finally { fs.rmSync(input,{ recursive:true, force:true }); }
});

test('search, linkage, collections and saved filters work together', () => {
  const nodes = [{ id:'idea:one',type:'idea',name:'Widget concept' },{ id:'site:one',type:'site',name:'Widget build',category:'Widgets',variants:3 },{ id:'github:repo',type:'github',name:'Repository' }];
  const edges = [{ from:'idea:one',to:'site:one',type:'implements' }];
  assert.deepEqual(filterAssets(nodes,edges,{ q:'widget',linkage:'linked' }).map(n=>n.id),['idea:one','site:one']);
  assert.deepEqual(filterAssets(nodes,edges,{ collection:'built-ideas' }).map(n=>n.id),['idea:one']);
  assert.deepEqual(filterAssets(nodes,edges,{ collection:'repos-no-deploy' }).map(n=>n.id),['github:repo']);
  assert.deepEqual(filterAssets(nodes,edges,{ saved:new Set(['site:one']) }).map(n=>n.id),['site:one']);
});
