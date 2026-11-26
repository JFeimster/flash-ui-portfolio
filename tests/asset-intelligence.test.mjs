import test from 'node:test';
import assert from 'node:assert/strict';
import {similarity,recommendReuse,integrationAdvice,mcpAdvice,compareAssets} from '../assets/js/asset-intelligence-core.mjs';

test('reuse suggestions identify recorded overlap without asserting identity',()=>{
 const a={id:'a',title:'Funding calculator',catalog:{designThemeIds:['dada-riot'],capabilities:['calculator'],audiences:['brokers']}};
 const b={id:'b',title:'Broker scorecard',path:'/sites/b/',catalog:{designThemeIds:['dada-riot'],capabilities:['calculator'],audiences:['brokers']}};
 const result=recommendReuse(a,[a,b]);assert.equal(result[0].row.id,'b');for(const field of ['designThemeIds','capabilities','audiences'])assert.ok(result[0].reasons.some(x=>x.field===field));assert.equal(similarity(a,{id:'c',catalog:{}}).score,0);
});
test('advisor marks integration candidates as planning only',()=>{
 const results=integrationAdvice({title:'Lead capture portal',catalog:{}},[{id:'resend',name:'Resend'},{id:'clerk',name:'Clerk'},{id:'supabase',name:'Supabase'}]);
 assert.deepEqual(results.map(x=>x.id),['resend','clerk','supabase']);assert.ok(results.every(x=>/suggestion/.test(x.status)));
});
test('comparison leaves missing evidence explicit',()=>{
 const rows=compareAssets({catalog:{capabilities:['search']}},{catalog:{}});assert.equal(rows.find(x=>x.label==='Capabilities').right,'Unrecorded');
});
test('MCP candidates remain designs rather than live claims',()=>{
 const result=mcpAdvice({title:'Funding calculator',catalog:{}});assert.equal(result[0].name,'Read-only calculation tool');assert.match(result[0].status,/no server/);
});
