import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateFundingCollection,prefillFundingAgencyIdea,FUNDING_GROUPS,FUNDING_SCHEMA} from '../assets/js/funding-agency-core.mjs';
import {buildPackage,validatePackage} from '../assets/js/capability-factory-core.mjs';
const root=new URL('../',import.meta.url);
const contents=async path=>readFile(new URL(path,root),'utf8');
const catalog=JSON.parse(await contents('data/funding-agency-automation-ideas.json'));
test('additive registry contains 20 unique, distinct funding agency products',()=>{
 assert.equal(catalog.schema,FUNDING_SCHEMA);assert.equal(catalog.count,20);
 assert.deepEqual(validateFundingCollection(catalog),[]);
 assert.equal(new Set(catalog.entries.map(x=>x.id)).size,20);
 assert.deepEqual(new Set(catalog.entries.map(x=>x.category)),new Set(FUNDING_GROUPS));
 assert.ok(catalog.entries.every(x=>x.status==='concept-only'&&x.sourceStatus==='template-not-original'));
});
test('all product concepts include detailed operational and commercial definitions',()=>{
 for(const x of catalog.entries){
  assert.ok(x.buyer&&x.commercialRole&&x.deliveryModel&&x.automationScope);
  assert.ok(x.monetization.length>=2&&x.integrationRequirements.length>=3);
  assert.ok(x.tools.length>=4);
  assert.ok(x.functionalSpec.inputs.length>=3&&x.functionalSpec.outputs.length>=3);
  assert.ok(x.functionalSpec.workflow.length>=4&&x.functionalSpec.guardrails.length>=2);
 }
});
test('all 20 entries prefill an editable, safe MCP/API scaffold package',()=>{
 for(const x of catalog.entries){
  const input=prefillFundingAgencyIdea(x);
  assert.equal(input.name,x.id);assert.equal(input.mode,'mcp-scaffold');
  assert.match(input.instructions,/DRAFT IMPLEMENTATION SPECIFICATION/);
  assert.ok(input.instructions.includes(x.deliveryModel));
  assert.ok(input.instructions.includes(x.automationScope));
  for(const tool of x.tools)assert.ok(input.instructions.includes(tool.name));
  for(const requirement of x.integrationRequirements)assert.ok(input.knowledge.includes(requirement));
  const files=buildPackage(input);
  assert.deepEqual(validatePackage(files),[]);
  assert.ok(files['MCP-SCAFFOLD.md']);
  assert.ok(!files['mcp.json']);
 }
});
test('reject missing source claims and duplicate ids',()=>{
 const a=structuredClone(catalog);a.entries[1].id=a.entries[0].id;assert.ok(validateFundingCollection(a).some(e=>e.includes('duplicate')));
 const b=structuredClone(catalog);b.entries[0].sourceStatus='recovered';assert.ok(validateFundingCollection(b).some(e=>e.includes('False deployment')));
 const c=structuredClone(catalog);c.entries[0].integrationRequirements=[];assert.ok(validateFundingCollection(c).some(e=>e.includes('Missing integrationRequirements')));
});
test('directory, navigation, and factory prefill routes are connected',async()=>{
 const directory=await contents('capabilities/funding-agency/index.html');
 const ui=await contents('assets/js/funding-agency-ideas.mjs');
 const factory=await contents('assets/js/capability-factory.mjs');
 const home=await contents('index.html');
 assert.match(directory,/id="ideaSearch"/);assert.match(directory,/id="category"/);
 assert.match(ui,/fundingIdea=/);assert.match(ui,/commercialRole/);assert.match(ui,/deliveryModel/);
 assert.match(factory,/prefillFundingFromLibrary/);
 assert.match(factory,/prefillFundingAgencyIdea/);
 assert.match(home,/\/capabilities\/funding-agency\//);
});
