import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {acquisitionAffordability,workingCapitalGap,revenueBasedFinancing,creditUtilization,freelanceRate,ecommerceBreakEven,valuationEstimator} from '../assets/js/extra-financial-calculators-core.mjs';
import {qualificationQuiz,roiGenerator,quoteBuilder} from '../assets/js/lead-tools-core.mjs';
import {agencyLaunchKit} from '../assets/js/agency-kit-core.mjs';
const root=new URL('../',import.meta.url);
const catalog=JSON.parse(await readFile(new URL('data/collections-registry.json',root),'utf8'));
test('all 17 browser tools are represented as working products in collection metadata',async()=>{
 const paths=new Set();
 for(const group of catalog.collections){
  const entries=JSON.parse(await readFile(new URL(group.dataPath.slice(1),root),'utf8')).entries;
  const working=entries.filter(x=>x.status==='functional-prototype');
  if(group.workingCount!=null)assert.equal(group.workingCount,working.length,'working count for '+group.id);
  for(const item of working){
   assert.ok(item.demoPath&&item.demoPath.startsWith('/tools/'));
   assert.ok(!paths.has(item.demoPath),'duplicate live path '+item.demoPath);
   paths.add(item.demoPath);await stat(new URL(item.demoPath.slice(1)+'index.html',root));
  }
 }
 assert.equal(paths.size,17);
});
test('SBA acquisition estimator computes annual service and DSCR without eligibility claim',()=>{
 const r=acquisitionAffordability({purchase:1000000,equity:200000,rate:0,years:10,cashFlow:200000});
 assert.deepEqual(r.metrics[0],['Estimated debt','$800,000.00']);
 assert.deepEqual(r.metrics[2],['Annual debt service','$80,000.00']);
 assert.deepEqual(r.metrics[3],['Modeled DSCR','2.5×']);
 assert.match(r.summary,/no lender qualification/i);
 assert.throws(()=>acquisitionAffordability({purchase:100,equity:200,rate:0,years:10,cashFlow:100}));
});
test('working capital gap reconciles cash bridge and required buffer',()=>{
 const r=workingCapitalGap({cash:10000,receivables:20000,collections:50,payables:15000,expenses:10000,minimumCash:5000});
 assert.deepEqual(r.metrics[1],['Forecast cash after payments','-$5,000.00']);
 assert.deepEqual(r.metrics[3],['Estimated funding gap','$10,000.00']);
});
test('RBF calculator uses total fixed-factor payback and monthly holdback',()=>{
 const r=revenueBasedFinancing({advance:100000,factor:1.3,monthlySales:100000,holdback:10});
 assert.deepEqual(r.metrics[0],['Total contractual payback','$130,000.00']);
 assert.deepEqual(r.metrics[3],['Modeled repayment time','13 months']);
 assert.throws(()=>revenueBasedFinancing({advance:100000,factor:1.3,monthlySales:100000,holdback:0}));
});
test('credit utilization is math only, no speculative credit-score forecasts',()=>{
 const r=creditUtilization({balance:8000,limit:10000,payment:2000,limitIncrease:0});
 assert.deepEqual(r.metrics[0],['Current utilization','80%']);
 assert.deepEqual(r.metrics[1],['Modeled utilization','60%']);
 assert.match(r.summary,/does not predict/i);
 assert.throws(()=>creditUtilization({balance:11000,limit:10000,payment:2000,limitIncrease:0}));
});
test('freelancer target rate reflects billable hours and expenses',()=>{
 const r=freelanceRate({income:100000,overhead:20000,weeks:40,hours:40,utilization:50});
 assert.deepEqual(r.metrics[0],['Required hourly rate','$150.00']);
 assert.throws(()=>freelanceRate({income:100000,overhead:0,weeks:40,hours:40,utilization:0}));
});
test('ecommerce break-even uses order contribution and warns on negative margins',()=>{
 const good=ecommerceBreakEven({price:100,unitCost:20,shipping:10,adSpend:20,fees:3,returns:5,fixedCosts:4200});
 assert.deepEqual(good.metrics[2],['Contribution per order','$42.00']);
 assert.deepEqual(good.metrics[3],['Break-even monthly orders','100']);
 const bad=ecommerceBreakEven({price:10,unitCost:20,shipping:10,adSpend:0,fees:0,returns:0,fixedCosts:500});
 assert.deepEqual(bad.metrics[3],['Break-even monthly orders','Not achievable']);
});
test('valuation range shows separated enterprise and equity values',()=>{
 const r=valuationEstimator({earnings:100000,low:2,high:4,adjustments:0,debt:20000,cash:10000});
 assert.deepEqual(r.metrics[0],['Enterprise value (low)','$200,000.00']);
 assert.deepEqual(r.metrics[2],['Illustrative equity value (low)','$190,000.00']);
 assert.throws(()=>valuationEstimator({earnings:100000,low:4,high:2,adjustments:0,debt:0,cash:0}));
});
test('qualification, ROI and quote builder produce domain-specific outputs',()=>{
 const lead=qualificationQuiz({company:'Pilot Co',need:'Funding automation',budget:6000,timelineDays:7,readiness:'ready'});
 assert.equal(lead.payload.score,90);
 assert.match(lead.warning,/No lead data was collected/);
 const roi=roiGenerator({project:'Automate',investment:12000,monthlySavings:1000,monthlyRevenue:0,grossMargin:50,months:12});
 assert.equal(roi.payload.roi,0);
 const quote=quoteBuilder({service:'Implementation',hours:10,rate:100,materials:0,margin:50});
 assert.equal(quote.payload.quotePrice,2000);
 assert.throws(()=>quoteBuilder({service:'Implementation',hours:0,rate:0,materials:0,margin:50}));
});
test('agency launch kit creates realistic service plan and rejects losing offer',()=>{
 const x=agencyLaunchKit({name:'Prototype Agency',vertical:'Trades',offer:'Automated scheduling',buyer:'Contractors',price:1000,deliveryCost:200,targetClients:10});
 assert.equal(x.payload.mrr,10000);
 assert.equal(x.payload.operatingContribution,8000);
 assert.equal(x.steps.length,8);
 assert.match(x.warning,/no clients, revenue/i);
 assert.throws(()=>agencyLaunchKit({name:'X',vertical:'Y',offer:'Z',buyer:'B',price:100,deliveryCost:200,targetClients:10}));
});
test('all new workflows contain usable form, result and export controls',async()=>{
 const routes=['smart-qualification-quiz','roi-calculator-generator','instant-quote-widget','agency-launch-kit'];
 for(const slug of routes){
  const html=await readFile(new URL('tools/'+slug+'/index.html',root),'utf8');
  assert.match(html,/id="workflowForm"/);assert.match(html,/id="workflowJSON"/);
  assert.match(html,/assets\/js\/workflow-lab.mjs/);
 }
 const impl=await readFile(new URL('assets/js/workflow-lab.mjs',root),'utf8');
 for(const mode of ['qualify','roi','quote','kit'])assert.ok(impl.includes('schemas.'+mode+'='));
});
