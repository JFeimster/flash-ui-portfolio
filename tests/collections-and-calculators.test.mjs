import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {loanTrueCost,cashRunway,agencyPricing} from '../assets/js/business-calculators-core.mjs';
const root=new URL('../',import.meta.url);
const load=async p=>JSON.parse(await readFile(new URL(p,root),'utf8'));
test('shared registry retains original collections and aggregates all new collections',async()=>{
 const registry=await load('data/collections-registry.json');
 assert.equal(registry.schema,'flash-ui-collections/v1');
 assert.equal(registry.collections.length,20);
 assert.deepEqual(registry.collections.slice(0,3).map(x=>x.count),[25,20,10]);
 assert.equal(registry.totalConcepts,178);
 assert.equal(new Set(registry.collections.map(x=>x.id)).size,20);
 assert.equal((await load('data/mcp-agent-product-ideas.json')).count,25);
 assert.equal((await load('data/funding-agency-automation-ideas.json')).count,20);
 for(const x of registry.collections){
  const catalog=await load(x.dataPath.slice(1));assert.equal(catalog.count,x.count);
  await stat(new URL(x.url.slice(1)+'index.html',root));
 }
});
test('calculator idea set has 10 distinct concepts and only 3 working routes',async()=>{
 const catalog=await load('data/business-calculator-ideas.json');
 assert.equal(catalog.schema,'flash-ui-business-calculators/v1');
 assert.equal(catalog.entries.length,10);
 assert.equal(new Set(catalog.entries.map(x=>x.id)).size,10);
 const working=catalog.entries.filter(x=>x.status==='functional-prototype');
 assert.equal(working.length,3);
 for(const x of working)await stat(new URL(x.demoPath.slice(1)+'index.html',root));
 assert.ok(catalog.entries.filter(x=>x.status==='concept').every(x=>x.demoPath===null));
 assert.ok(catalog.entries.every(x=>x.functionalSpec.inputs.length>0&&x.functionalSpec.acceptanceCriteria.length>0));
});
test('loan cost: 0% no fees, 12 monthly payments, nominal APR 0',()=>{
 const x=loanTrueCost({principal:12000,annualRate:0,months:12,upfrontFee:0});
 assert.equal(x.payment,1000);
 assert.equal(x.totalPaid,12000);assert.equal(x.financeCharge,0);
 assert.ok(x.estimatedApr<1e-7);
});
test('loan cost: APR rises when upfront fees reduce proceeds',()=>{
 const noFee=loanTrueCost({principal:100000,annualRate:12,months:24,upfrontFee:0});
 const fee=loanTrueCost({principal:100000,annualRate:12,months:24,upfrontFee:3000});
 assert.ok(Math.abs(noFee.payment-4707.35)<0.1);
 assert.ok(Math.abs(noFee.estimatedApr-12)<0.00001);
 assert.ok(fee.estimatedApr>noFee.estimatedApr);
 assert.equal(fee.netProceeds,97000);
 assert.ok(fee.financeCharge>noFee.financeCharge);
});
test('loan cost validates months, principal, interest and fee',()=>{
 assert.throws(()=>loanTrueCost({principal:10000,annualRate:9,months:0,upfrontFee:0}));
 assert.throws(()=>loanTrueCost({principal:10000,annualRate:9,months:12.5,upfrontFee:0}));
 assert.throws(()=>loanTrueCost({principal:10000,annualRate:9,months:12,upfrontFee:10000}));
 assert.throws(()=>loanTrueCost({principal:0,annualRate:9,months:12,upfrontFee:0}));
});
test('cash runway calculates burn, duration and projection',()=>{
 const r=cashRunway({cash:10000,revenue:3000,expenses:5000,months:12});
 assert.equal(r.monthlyBurn,2000);assert.equal(r.runwayMonths,5);
 assert.equal(r.endingBalance,-14000);assert.equal(r.forecast[5].balance,0);
 assert.equal(r.forecast.length,13);
 const profitable=cashRunway({cash:15000,revenue:8000,expenses:7000,months:12});
 assert.equal(profitable.runwayMonths,null);assert.equal(profitable.endingBalance,27000);
});
test('cash runway rejects negative inputs and noninteger projections',()=>{
 assert.throws(()=>cashRunway({cash:-5,revenue:0,expenses:1000,months:12}));
 assert.throws(()=>cashRunway({cash:5000,revenue:1000,expenses:3000,months:12.5}));
});
test('agency margin derives recommended price from allocated cost',()=>{
 const r=agencyPricing({labor:3200,vendors:800,overhead:1000,margin:25,actualPrice:8000});
 assert.equal(r.totalCost,5000);
 assert.ok(Math.abs(r.recommendedPrice-6666.66666667)<0.001);
 assert.ok(Math.abs(r.currentMargin-37.5)<1e-9);
 assert.equal(r.currentProfit,3000);
 assert.throws(()=>agencyPricing({labor:0,vendors:0,overhead:0,margin:25,actualPrice:0}));
 assert.throws(()=>agencyPricing({labor:50,vendors:0,overhead:0,margin:100,actualPrice:0}));
});
test('discovery routes and calculators load local JS assets and expose controls',async()=>{
 for(const route of ['collections/index.html','collections/business-calculators/index.html']){
  const html=await readFile(new URL(route,root),'utf8');
  assert.match(html,/id="search"/);assert.match(html,/id="cards"/);
  assert.match(html,/assets\/js\/collections.mjs/);
 }
 for(const route of ['tools/business-loan-true-cost/index.html','tools/cash-runway/index.html','tools/agency-pricing-margin/index.html']){
  const html=await readFile(new URL(route,root),'utf8');
  assert.match(html,/id="calculatorForm"/);assert.match(html,/id="fieldsPlaceholder"/);
  assert.match(html,/assets\/js\/business-calculators.mjs/);
  assert.match(html,/id="results"/);
 }
 const frontend=await readFile(new URL('assets/js/business-calculators.mjs',root),'utf8');
 assert.match(frontend,/fieldsPlaceholder/);
});
