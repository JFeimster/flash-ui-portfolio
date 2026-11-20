import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateIdeas,filterIdeas,prefillIdea,IDEA_SCHEMA} from '../assets/js/capability-ideas-core.mjs';
import {buildPackage,validatePackage} from '../assets/js/capability-factory-core.mjs';
const base=new URL('../',import.meta.url);
const load=async file=>JSON.parse(await readFile(new URL(file,base),'utf8'));
const catalog=await load('data/mcp-agent-product-ideas.json');
test('exactly 25 distinct structured concepts',()=>{
 assert.equal(catalog.schema,IDEA_SCHEMA);assert.equal(catalog.entries.length,25);
 assert.deepEqual(validateIdeas(catalog),[]);
 assert.equal(new Set(catalog.entries.map(x=>x.id)).size,25);
 assert.ok(catalog.entries.every(x=>x.sourceStatus==='template-not-original'&&x.status==='concept-only'));
});
test('all categories, tools and revenue models are searchable',()=>{
 const entries=catalog.entries;
 assert.ok(new Set(entries.map(x=>x.category)).size>=5);
 assert.ok(filterIdeas(entries,{query:'finops'}).some(x=>x.id==='autonomous-finops'));
 assert.ok(filterIdeas(entries,{query:'get_deal'}).some(x=>x.id==='broker-crm-automation'));
 assert.ok(filterIdeas(entries,{query:'white-label'}).length>0);
 assert.ok(filterIdeas(entries,{query:'unobtainium'}).length===0);
 assert.equal(filterIdeas(entries,{category:'Capital & Lending'}).every(x=>x.category==='Capital & Lending'),true);
 assert.equal(filterIdeas(entries,{sort:'title'})[0].title,'Accounts Receivable Recovery MCP');
});
test('one-click prefill carries entire draft specification into existing package engine',()=>{
 for(const idea of catalog.entries){
  const input=prefillIdea(idea);
  assert.equal(input.name,idea.id);assert.equal(input.mode,'mcp-scaffold');
  assert.match(input.instructions,/DRAFT IMPLEMENTATION SPECIFICATION/);
  for(const tool of idea.tools)assert.ok(input.instructions.includes(tool.name));
  for(const required of idea.sourceRequirements)assert.ok(input.knowledge.includes(required));
  for(const rule of idea.functionalSpec.guardrails)assert.ok(input.instructions.includes(rule));
  const pkg=buildPackage(input);
  assert.deepEqual(validatePackage(pkg),[]);
  assert.ok(pkg['MCP-SCAFFOLD.md']);
  assert.ok(!pkg['mcp.json']); // Never pretend the MCP server has an endpoint.
  assert.match(pkg['COMPATIBILITY.md'],/not installed, deployed, or executed/);
 }
});
test('collection rejects missing tools, duplicate IDs and fabricated source claims',()=>{
 const cloned=structuredClone(catalog);cloned.entries[1].id=cloned.entries[0].id;
 assert.ok(validateIdeas(cloned).some(x=>x.includes('Duplicate')));
 const unverified=structuredClone(catalog);unverified.entries[0].sourceStatus='recovered';
 assert.ok(validateIdeas(unverified).some(x=>x.includes('Misleading')));
 const missing=structuredClone(catalog);missing.entries[0].tools=[];
 assert.ok(validateIdeas(missing).some(x=>x.includes('Missing tools')));
});
test('directory routes to factory and factory recognizes idea query',async()=>{
 const directory=await readFile(new URL('capabilities/ideas/index.html',base),'utf8');
 const gallery=await readFile(new URL('assets/js/capability-ideas.mjs',base),'utf8');
 const factory=await readFile(new URL('assets/js/capability-factory.mjs',base),'utf8');
 const root=await readFile(new URL('index.html',base),'utf8');
 assert.match(directory,/id="ideaSearch"/);assert.match(directory,/id="category"/);
 assert.match(gallery,/capabilities\/\?idea=/);assert.match(factory,/prefillFromLibrary/);
 assert.match(factory,/prefillIdea\(idea\)/);
 assert.match(root,/\/capabilities\/ideas\//);
});
