import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { groupAssets, possibleMatches } from '../assets/js/asset-groups.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const graph = JSON.parse(fs.readFileSync(path.join(root, 'data/asset-graph.public.json'), 'utf8'));
const node = (id, type, name) => ({ id, type, name });
const edge = (from, to, type, provenance, status = 'recorded') => ({ from, to, type, provenance, status });

test('same-name cross-type records remain separate and show possible matches', () => {
  const nodes = [node('github:one','github','AI Citation Auditor'),node('gpt:two','gpt','AI Citation Auditor')];
  const groups = groupAssets(nodes, []);
  assert.equal(groups.length, 2);
  assert.equal(possibleMatches(groups[0], groups).length, 1);
  assert.equal(possibleMatches(groups[0], groups)[0].status, 'suggested');
  assert.equal(groupAssets(nodes,[edge('github:one','gpt:two','related_tool','similarity')]).length,2);
  assert.equal(groupAssets(nodes,[edge('github:one','gpt:two','source_repository','anything','suggested')]).length,2);
});
test('recorded exact idea implementation and repository deployment are grouped', () => {
  const nodes=[node('idea:exact','idea','An Idea'),node('site:exact','site','Built Demo'),
    node('github:owner-project','github','Project'),node('vercel:deploy','vercel','Deployed Project')];
  const edges=[edge('idea:exact','site:exact','implements','exact canonical slug'),
    edge('github:owner-project','vercel:deploy','deployed_as','vercel-projects.github_repo')];
  const groups=groupAssets(nodes,edges);
  assert.equal(groups.length,2);
  assert.ok(groups.every(g=>g.members.length===2 && g.matchCount===1));
  assert.equal(groupAssets(nodes,[edge('idea:exact','site:wrong','implements','same category')]).length,4);
});
test('identity join does not transitively absorb competing repositories or guesses', () => {
  const nodes=[node('github:first','github','First'),node('github:second','github','Second'),node('vercel:one','vercel','One')];
  const edges=[edge('github:first','vercel:one','deployed_as','vercel-projects.github_repo'),
    edge('github:second','vercel:one','deployed_as','vercel-projects.github_repo')];
  const groups=groupAssets(nodes,edges);
  assert.equal(groups.length,2);
  assert.deepEqual(groups.map(g=>g.members.length).sort(),[1,2]);
});
test('public graph retains its 531 nodes and 49 baseline relationships', () => {
  assert.ok(graph.nodes.length>=531);
  assert.ok(graph.edges.length>=49);
  assert.ok(graph.edges.every(e=>e.provenance&&['recorded','verified'].includes(e.status)));
  const groups=groupAssets(graph.nodes,graph.edges);
  assert.equal(groups.reduce((n,g)=>n+g.members.length,0),graph.nodes.length);
  assert.ok(groups.some(g=>g.members.some(n=>n.type==='github')&&g.members.some(n=>n.type==='vercel')));
});
test('overlay refuses unresolvable references, cannot mutate committed graph', () => {
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'flash-ui-relations-'));
  const canonical=path.join(root,'data/asset-graph.public.json');
  const baseline=fs.readFileSync(canonical);
  try {
    const bad=path.join(temp,'bad.json');
    fs.writeFileSync(bad,JSON.stringify({schema_version:'1.1.0',assets:[],
      relationships:[{from:'github:does-not-exist',to:'site:unknown',type:'implements',status:'verified',provenance:'fixture',evidence_url:'https://github.com/sample/repo'}]}));
    const run=spawnSync(process.execPath,[path.join(root,'scripts/build-asset-graph.mjs'),'--links',bad,'--output',path.join(temp,'result.json'),'--input-dir',temp],{encoding:'utf8'});
    assert.notEqual(run.status,0);
    assert.match(run.stderr,/Unresolved public asset relationship ID/);
    assert.deepEqual(fs.readFileSync(canonical),baseline);
    const guard=spawnSync(process.execPath,[path.join(root,'scripts/build-asset-graph.mjs'),'--input-dir',temp],{encoding:'utf8'});
    assert.notEqual(guard.status,0);
    assert.match(guard.stderr,/Refusing incomplete graph rebuild/);
    assert.deepEqual(fs.readFileSync(canonical),baseline);
  } finally { fs.rmSync(temp,{recursive:true,force:true}); }
});
test('source cards visibly distinguish evidence, suggestions and recorded Vercel destinations', () => {
  const ui=fs.readFileSync(path.join(root,'assets/js/asset-explorer.mjs'),'utf8');
  assert.match(ui,/Possible matches — unconfirmed/);
  assert.match(ui,/not live-verified/);
  assert.match(ui,/e\.provenance/);
  assert.match(ui,/possibleMatches/);
});
