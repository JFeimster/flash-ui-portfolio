import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {inspect} from '../scripts/preview-project-intake.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
test('portal catalog preserves four distinct static role paths',()=>{
 const p=read('data/portal-catalog-batch-25b.json');
 assert.deepEqual(p.variants.map(x=>x.variantNumber),[1,2,3,4]);
 for(const v of p.variants) assert.ok(fs.existsSync(new URL('../'+v.path,import.meta.url)));
});
test('intake rejects existing canonical route and unsafe paths',()=>{
 const c=read('data/site-registry.json').find(x=>x.slug==='user-account-portals');
 assert.ok(inspect(c,[read('data/site-registry.json')],{}).errors.some(x=>x.includes('collision')));
 assert.equal(inspect({...c,slug:'new-portal',path:'sites/../bad',livePath:'/sites/new-portal/'},[],{}).valid,false);
});
test('19c triage retains every original candidate without automatic promotion',()=>{
 const a=read('data/batch-19c-import-review.json'),b=read('data/batch-19c-incremental-triage.json');
 assert.equal(a.candidates.length,b.candidates.length);
 assert.equal(b.candidates.filter(x=>x.eligibleForAutomaticStaticImport).length,a.summary.imported);
 assert.equal(b.candidates.filter(x=>x.disposition==='standalone-app-audit').length,a.summary['standalone application']);
});
