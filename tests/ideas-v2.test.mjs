import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const data=name=>readFile(join(root,'data',name),'utf8').then(JSON.parse);
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

test('Batch 37 is a lossless source-aware 370-concept directory',async()=>{
 const [catalog,external,canonical,discovery,legacy]=await Promise.all([data('idea-directory.json'),data('external-prompt-library.json'),data('site-generator-prompts.json'),data('idea-discovery-index.json'),data('site-registry.json')]);
 assert.equal(canonical.entries.length,169);
 assert.equal(discovery.entry_count,169);
 assert.equal(external.items.length,305);
 assert.equal(catalog.entries.length,370);
 assert.deepEqual(catalog.counts,{canonical:169,external_prompts:305,external_distinct_titles:301,canonical_title_matches:100,matched_external_prompts:103,external_only_concepts:201,visible_concepts:370,internal_external_title_variants:1});
 const ids=new Set(catalog.entries.map(x=>x.id));
 assert.equal(ids.size,370);
 assert.equal(new Set(catalog.entries.map(x=>norm(x.name))).size,370);
 assert.ok(Array.isArray(legacy)&&legacy.length>0,'legacy deployed registry remains available');
 assert.deepEqual(catalog.entries.slice(0,169).map(x=>x.id),canonical.entries.map(x=>x.id),'canonical IDs and ordering preserved');
 const cids=new Set(canonical.entries.map(x=>x.id)),eids=new Set(external.items.map(x=>x.id));
 for(const entry of catalog.entries){
   assert.ok(entry.name&&entry.id&&entry.search_text,entry.id);
   assert.ok(['canonical','external'].includes(entry.source));
   assert.equal(entry.source==='canonical',Boolean(entry.canonical_prompt_id));
   if(entry.canonical_prompt_id)assert.ok(cids.has(entry.canonical_prompt_id));
   assert.ok(entry.external_prompt_ids.every(x=>eids.has(x)),entry.id);
 }
 const used=catalog.entries.flatMap(x=>x.external_prompt_ids);
 assert.equal(used.length,305,'every external prompt must appear in exactly one concept');
 assert.equal(new Set(used).size,305,'external variants must not be double-counted');
 assert.ok(catalog.entries.some(x=>x.external_prompt_ids.length>1),'duplicated external titles retained as prompt variants');
});

test('Batch 37 source matches are provisional; full prompts preserved',async()=>{
 const [catalog,external]=await Promise.all([data('idea-directory.json'),data('external-prompt-library.json')]);
 assert.match(catalog.policy,/not semantic equivalence/i);
 assert.ok(external.items.every(x=>typeof x.flash_ui_prompt==='string'&&x.flash_ui_prompt.trim().length>30));
 assert.equal(catalog.entries.filter(x=>x.source==='canonical').length,169);
 assert.equal(catalog.entries.filter(x=>x.source==='external').length,201);
 const files=['ideas/index.html','assets/js/ideas.js','assets/css/ideas.css','scripts/build-ideas-v2.mjs'];
 await Promise.all(files.map(x=>readFile(join(root,x),'utf8').then(text=>assert.ok(text.length>100,x))));
});
