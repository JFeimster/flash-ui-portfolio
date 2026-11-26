import test from 'node:test';
import assert from 'node:assert/strict';
import {createCopilotRuntime,offlineSuggestions,composePrompt,optimizePrompt,exportBrief,importBrief,missingRequirements} from '../assets/js/copilot-core.mjs';

test('offline suggestions are deterministic, labeled, and source-backed',async()=>{
  const context={brief:{ideaId:'tool-one',idea:'finance calculator',projectName:'Finance Calculator',problem:'calculate finance options'},ideas:[{id:'tool-one',name:'Finance Calculator',factory:{brief:{audience:'Small businesses',primary_action:'Calculate options'},architecture_profile:'generator'}}],themes:[{id:'finance-blue',name:'Finance Blue',keywords:['finance','calculator']}],graph:{nodes:[{id:'site:finance',type:'site',name:'Finance Site',summary:'Finance calculator',url:'/sites/finance/'}]},packages:{entries:{'/sites/finance/':{files:[{name:'components/Calculator.js'}]}}}};
  const runtime=createCopilotRuntime();
  const first=await runtime.suggest(context),second=await runtime.suggest(context);
  assert.equal(runtime.provider,'offline-rules');
  assert.deepEqual(first,second);
  assert.equal(first.kind,'rule-based');
  assert.equal(first.alternatives.audience[0],'Small businesses');
  assert.equal(first.themes[0].id,'finance-blue');
  assert.equal(first.assets[0].packageRoute,'/sites/finance/');
  assert.deepEqual(first.assets[0].componentEvidence,['components/Calculator.js']);
  assert.ok(first.missing.includes('Core features'));
});

test('prompt revisions are proposals and preserve source text',()=>{
  const authored='Build a careful scorecard with my exact copy.';
  const revised=optimizePrompt(authored);
  assert.ok(revised.startsWith(authored));
  assert.ok(revised.includes('Suggested quality checks'));
  assert.equal(authored,'Build a careful scorecard with my exact copy.');
  const generated=composePrompt({brief:{projectName:'Scorecard',audience:'Owners'}});
  assert.ok(generated.includes('Scorecard'));
  assert.ok(generated.includes('[define problem]'));
  assert.ok(missingRequirements({projectName:'Scorecard'}).includes('Audience'));
});

test('briefs round trip without changing authored prompts, and reject unknown schema',()=>{
  const prompt='A user-authored prompt\nwith exact punctuation!';
  const payload=exportBrief({projectName:'Original',cta:'Start'},prompt,[{id:'v1',at:'2026-11-26T12:00:00Z',label:'Version 1',prompt}]);
  const restored=importBrief(JSON.parse(JSON.stringify(payload)));
  assert.equal(restored.prompt,prompt);
  assert.equal(restored.history[0].prompt,prompt);
  assert.throws(()=>importBrief({...payload,schemaVersion:'unknown'}),/Unsupported/);
});
