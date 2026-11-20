import {acquisitionAffordability,workingCapitalGap,revenueBasedFinancing,creditUtilization,freelanceRate,ecommerceBreakEven,valuationEstimator} from './extra-financial-calculators-core.mjs';
import {loanTrueCost,cashRunway,agencyPricing} from './business-calculators-core.mjs';
const $=id=>document.getElementById(id);
const fmtMoney=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(v);
const fmtNum=v=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(v);
const metric=(name,value)=>{const e=document.createElement('div');e.className='metric';const n=document.createElement('span');n.className='name';n.textContent=name;const strong=document.createElement('strong');strong.textContent=value;e.append(n,strong);return e};
const config={
 loan:{fields:[
  ['principal','Loan amount ($)','100000','1','100000000','1'],['annualRate','Nominal annual interest (%)','12','0','100','0.01'],['months','Term (months)','24','1','600','1'],['upfrontFee','Fee deducted from proceeds ($)','3000','0','100000000','1']],
  calc:loanTrueCost,outputs:r=>[['Monthly payment',fmtMoney(r.payment)],['Net funds received',fmtMoney(r.netProceeds)],['Total paid',fmtMoney(r.totalPaid)],['Total financing cost',fmtMoney(r.financeCharge)],['Estimated APR (nominalized)',fmtNum(r.estimatedApr)+'%'],['Effective annual cost',fmtNum(r.effectiveAnnualRate)+'%']]},
 runway:{fields:[
  ['cash','Starting available cash ($)','75000','0','1000000000000','1'],['revenue','Monthly revenue ($)','25000','0','1000000000000','1'],['expenses','Monthly expenses ($)','35000','0','1000000000000','1'],['months','Projection length (months)','12','1','120','1']],
  calc:cashRunway,outputs:r=>[['Monthly net cash flow',fmtMoney(r.net)],['Monthly cash burn',fmtMoney(r.monthlyBurn)],['Cash runway',r.runwayMonths===null?'No burn':fmtNum(r.runwayMonths)+' months'],['Cash after projection',fmtMoney(r.endingBalance)]]},
 agency:{fields:[
  ['labor','Monthly delivery labor ($)','3200','0','1000000000','1'],['vendors','Monthly vendor & software costs ($)','800','0','1000000000','1'],['overhead','Monthly allocated overhead ($)','1000','0','1000000000','1'],['margin','Target operating margin (%)','35','0','95','0.1'],['actualPrice','Current monthly client price ($)','7000','0','1000000000','1']],
  calc:agencyPricing,outputs:r=>[['Modeled monthly cost',fmtMoney(r.totalCost)],['Recommended client price',fmtMoney(r.recommendedPrice)],['Profit at recommended price',fmtMoney(r.projectedProfit)],['Profit at current price',r.currentProfit===null?'Not provided':fmtMoney(r.currentProfit)],['Current operating margin',r.currentMargin===null?'—':fmtNum(r.currentMargin)+'%'],['Target margin',fmtNum(r.targetMargin)+'%']]}
};
config.acquisition={calc:acquisitionAffordability,fields:[
 ['purchase','Purchase price ($)','1200000','1','10000000000','1'],['equity','Buyer equity ($)','180000','0','10000000000','1'],['rate','Annual interest (%)','10','0','100','0.01'],['years','Loan term (years)','10','1','30','1'],['cashFlow','Annual cash available for debt service ($)','300000','0','10000000000','1']],outputs:r=>r.metrics};
config.workingCapital={calc:workingCapitalGap,fields:[
 ['cash','Available cash ($)','50000','0','1000000000000','1'],['receivables','Outstanding receivables expected ($)','70000','0','1000000000000','1'],['collections','Percent collected within period (%)','65','0','100','0.1'],['payables','Payables due ($)','45000','0','1000000000000','1'],['expenses','Expenses due ($)','75000','0','1000000000000','1'],['minimumCash','Required cash buffer ($)','15000','0','1000000000000','1']],outputs:r=>r.metrics};
config.rbf={calc:revenueBasedFinancing,fields:[
 ['advance','Funding advance ($)','75000','1','1000000000','1'],['factor','Factor rate','1.25','1','5','0.01'],['monthlySales','Monthly gross sales ($)','60000','1','1000000000000','1'],['holdback','Share of revenue remitted (%)','15','0','100','0.1']],outputs:r=>r.metrics};
config.utilization={calc:creditUtilization,fields:[
 ['balance','Account balance ($)','7000','0','1000000000000','1'],['limit','Current credit limit ($)','10000','1','1000000000000','1'],['payment','Planned payment ($)','2500','0','1000000000000','1'],['limitIncrease','Modeled limit increase ($)','0','0','1000000000000','1']],outputs:r=>r.metrics};
config.freelance={calc:freelanceRate,fields:[
 ['income','Annual income target ($)','100000','1','1000000000','1'],['overhead','Annual operating costs ($)','15000','0','1000000000000','1'],['weeks','Working weeks per year','46','1','52','1'],['hours','Total hours per week','40','1','168','0.5'],['utilization','Billable utilization (%)','60','0','100','0.1']],outputs:r=>r.metrics};
config.ecommerce={calc:ecommerceBreakEven,fields:[
 ['price','Sale price per order ($)','75','0.01','1000000000','0.01'],['unitCost','COGS per order ($)','25','0','1000000000000','0.01'],['shipping','Fulfillment per order ($)','7','0','1000000000000','0.01'],['adSpend','Acquisition spend per order ($)','15','0','1000000000000','0.01'],['fees','Processing/platform fee (%)','3','0','100','0.1'],['returns','Expected refund rate (%)','5','0','100','0.1'],['fixedCosts','Monthly fixed costs ($)','3000','0','1000000000000','1']],outputs:r=>r.metrics};
config.valuation={calc:valuationEstimator,fields:[
 ['earnings','Normalized annual earnings ($)','250000','0','1000000000000','1'],['low','Low multiple','2.5','0.1','100','0.1'],['high','High multiple','4.5','0.1','100','0.1'],['adjustments','Enterprise value adjustment (+/- $)','0','-1000000000000','1000000000000','1'],['debt','Debt balance ($)','80000','0','1000000000000','1'],['cash','Excess cash ($)','30000','0','1000000000000','1']],outputs:r=>r.metrics};

const tool=document.body.dataset.tool;const setup=config[tool];if(!setup)throw Error('Unknown calculator');
const form=$('calculatorForm');for(const [key,label,defaultValue,min,max,step] of setup.fields){const wrap=document.createElement('label');wrap.textContent=label;const field=document.createElement('input');field.className='calc-input';field.type='number';field.name=key;field.id=key;field.value=defaultValue;field.min=min;field.max=max;field.step=step;field.required=true;wrap.append(field);$('fieldsPlaceholder').append(wrap)}
function calculate(event){if(event)event.preventDefault();const status=$('resultStatus');const area=$('results');area.replaceChildren();status.textContent='';status.className='note';
 try{if(!form.checkValidity()){form.reportValidity();throw Error('Correct the highlighted input fields.')}
  const data=Object.fromEntries(setup.fields.map(([key])=>[key,$(key).value]));
  const result=setup.calc(data);
  for(const [name,value] of setup.outputs(result))area.append(metric(name,value));
  $('assumptions').textContent=result.assumptions;
  if(tool==='runway'){const note=document.createElement('p');note.className='note';note.textContent=result.runwayMonths!==null&&result.runwayMonths<Number(data.months)?'Projected cash depletion occurs within the modeled period. Negative ending balances indicate an unmet cash need, not an available overdraft.':'Projection assumes the same net monthly cash flow throughout.';$('assumptions').append(document.createTextNode(' '+note.textContent))}
  status.textContent='Scenario calculated locally. Nothing was transmitted or saved.';
 }catch(e){status.textContent=e.message;status.className='error';$('assumptions').textContent=''}}
form.addEventListener('submit',calculate);
$('reset').addEventListener('click',()=>{for(const [key,,defaultValue] of setup.fields)$(key).value=defaultValue;calculate()});
calculate();
