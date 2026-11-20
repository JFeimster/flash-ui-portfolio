import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {missedCallWorkflow,invoiceFollowupWorkflow,onboardingWorkflow} from '../assets/js/workflow-lab-core.mjs';
const root=new URL('../',import.meta.url);
const load=async p=>JSON.parse(await readFile(new URL(p,root),'utf8'));
const registry=await load('data/collections-registry.json');
test('20 collections reference 178 unique product ideas and live local pages',async()=>{
 assert.equal(registry.schema,'flash-ui-collections/v1');
 assert.equal(registry.collections.length,20);
 assert.equal(registry.totalConcepts,178);
 assert.equal(registry.collections.reduce((x,c)=>x+c.count,0),178);
 const ids=new Set();
 for(const group of registry.collections){
  assert.ok(!ids.has('collection:'+group.id));ids.add('collection:'+group.id);
  const catalog=await load(group.dataPath.slice(1));assert.equal(catalog.count,group.count);
  assert.equal(catalog.entries.length,group.count);
  await stat(new URL(group.url.slice(1)+'index.html',root));
  for(const idea of catalog.entries){
   assert.ok(!ids.has('idea:'+idea.id),'duplicate global product id '+idea.id);ids.add('idea:'+idea.id);
   assert.ok(idea.title&&idea.description);
   if(group.dataPath.startsWith('/data/collections/')){
    assert.equal(idea.collectionId,group.id);
    assert.ok(idea.functionalSpec.inputs.length>=3);
    assert.ok(idea.functionalSpec.outputs.length>=2);
    assert.ok(idea.functionalSpec.acceptanceCriteria.length>=3);
    assert.ok(idea.integrationRequirements.length>=2);
    assert.ok(idea.monetization.length>=1);
    assert.equal(idea.seo.searchEvidence.startsWith('unverified'),true);
    if(idea.demoPath)await stat(new URL(idea.demoPath.slice(1)+'index.html',root));
   }
  }
 }
});
test('generic collection detail pages are source-aware and searchable',async()=>{
 for(const group of registry.collections.filter(x=>x.dataPath.startsWith('/data/collections/'))){
  const html=await readFile(new URL(group.url.slice(1)+'index.html',root),'utf8');
  assert.match(html,/data-collection-id=/);
  assert.match(html,/id="search"/);assert.match(html,/id="inspector"/);
  assert.match(html,/assets\/js\/collection-detail.mjs/);
 }
 const file=await readFile(new URL('assets/js/collection-detail.mjs',root),'utf8');
 assert.match(file,/navigator.clipboard.writeText/);assert.match(file,/integrationRequirements/);
});
test('missed-call recovery triages urgency and generates draft without sending',()=>{
 const urgent=missedCallWorkflow({caller:'Avery',service:'Commercial repairs',missedMinutes:80,urgency:'urgent'});
 assert.equal(urgent.metrics[0][1],'Immediate');
 assert.match(urgent.drafts[0].text,/Avery/);assert.match(urgent.warning,/Nothing was sent/);
 assert.throws(()=>missedCallWorkflow({caller:'',service:'repairs',missedMinutes:3,urgency:'routine'}));
 assert.throws(()=>missedCallWorkflow({caller:'Avery',service:'repairs',missedMinutes:-2,urgency:'routine'}));
});
test('invoice follow-up respects disputed invoices and overdue prioritization',()=>{
 const x=invoiceFollowupWorkflow({client:'Beta LLC',invoice:'INV-2026',amount:2500,daysOverdue:65,disputed:'no'});
 assert.equal(x.metrics[0][1],'Escalate for review');
 assert.match(x.drafts[1].text,/\$2,500/);
 const dispute=invoiceFollowupWorkflow({client:'Beta LLC',invoice:'INV-2026',amount:100,daysOverdue:30,disputed:'yes'});
 assert.equal(dispute.metrics[0][1],'Dispute review');
 assert.match(dispute.drafts[1].text,/No payment demand/);
 assert.throws(()=>invoiceFollowupWorkflow({client:'Beta',invoice:'INV',amount:-1,daysOverdue:0,disputed:'no'}));
});
test('onboarding builder creates an accountable checklist and JSON-ready output',()=>{
 const r=onboardingWorkflow({client:'Acme',service:'Website rebuild',owner:'Project lead',deadlineDays:30,complexity:'complex'});
 assert.equal(r.payload.checklist.length,8);
 assert.ok(r.payload.checklist.every(x=>x.owner==='Project lead'&&x.dueDay<=30));
 assert.ok(r.payload.checklist.some(x=>/security/i.test(x.task)));
 assert.match(JSON.stringify(r),/Website rebuild/);
 assert.throws(()=>onboardingWorkflow({client:'Acme',service:'Web',owner:'Lead',deadlineDays:0,complexity:'simple'}));
});
test('all three automation pages provide inputs, actions and JSON export',async()=>{
 for(const path of ['tools/missed-call-recovery/index.html','tools/invoice-follow-up/index.html','tools/client-onboarding/index.html']){
  const html=await readFile(new URL(path,root),'utf8');
  assert.match(html,/id="workflowForm"/);
  assert.match(html,/id="workflowFields"/);
  assert.match(html,/id="workflowJSON"/);
  assert.match(html,/assets\/js\/workflow-lab.mjs/);
 }
});
