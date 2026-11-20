// Deterministic browser-only lead generation utilities. Nothing is transmitted.
const num=(x,name,min,max)=>{const n=Number(x);if(x===''||x==null||!Number.isFinite(n)||n<min||n>max)throw Error(name+' must be between '+min+' and '+max);return n};
const text=(s,name,max=120)=>{if(typeof s!=='string'||!s.trim()||s.length>max)throw Error('Provide valid '+name);return s.trim()};
const money=x=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(x);
const guard='Locally generated example only. No lead data was collected, sent or saved to an external system.';
export function qualificationQuiz(data){
 const company=text(data.company,'business or project',100),need=text(data.need,'desired outcome',160);
 const budget=num(data.budget,'budget',0,1e8),time=num(data.timelineDays,'decision timeline (days)',0,3650),ready=data.readiness;
 if(!['researching','evaluating','ready'].includes(ready))throw Error('Choose a valid readiness stage');
 const budgetScore=budget>=5000?30:budget>=1500?20:budget>=500?12:4;
 const timelineScore=time<=7?25:time<=30?20:time<=90?12:5;
 const stageScore={researching:5,evaluating:20,ready:35}[ready];
 const score=Math.min(100,budgetScore+timelineScore+stageScore);
 const tier=score>=75?'High priority':score>=50?'Nurture':'Early-stage research';
 return {title:'Qualification assessment',summary:tier+' · '+score+'/100',metrics:[['Lead score',score+'/100'],['Segment',tier],['Indicative budget',money(budget)]],steps:[tier==='High priority'?'Queue for authorized sales review':'Offer a useful educational follow-up','Confirm fit, business need and purchase intent','Request explicit permission before recording or contacting a prospect'],drafts:[{type:'Editable qualification brief',text:company+' needs '+need+'. Indicative budget: '+money(budget)+'. Decision window: '+time+' days. Stage: '+ready+'. Estimated priority: '+tier+'.'}],payload:{company,need,budget,timelineDays:time,readiness:ready,score,tier},warning:guard+' Scoring uses illustrative weights and is not a real conversion prediction.'}
}
export function roiGenerator(data){
 const project=text(data.project,'project name',100);
 const investment=num(data.investment,'investment',1,1e9),monthlySavings=num(data.monthlySavings,'monthly savings',0,1e9),monthlyRevenue=num(data.monthlyRevenue,'incremental monthly revenue',0,1e9),grossMargin=num(data.grossMargin,'incremental revenue gross margin (%)',0,100)/100,months=num(data.months,'months',1,120);
 if(!Number.isInteger(months))throw Error('Months must be a whole number');
 const benefit=months*(monthlySavings+monthlyRevenue*grossMargin),net=benefit-investment,roi=100*net/investment,monthlyNetBenefit=monthlySavings+monthlyRevenue*grossMargin,breakeven=monthlyNetBenefit>0?investment/monthlyNetBenefit:null;
 const textSummary='Scenario: '+project+'. Investment '+money(investment)+'; estimated '+months+'-month gross benefit '+money(benefit)+'; net modeled return '+money(net)+' ('+roi.toFixed(1)+'% ROI).';
 return {title:'ROI scenario',summary:textSummary,metrics:[['Modeled ROI',roi.toFixed(1)+'%'],['Net modeled return',money(net)],['Payback',breakeven===null?'Not achieved':breakeven.toFixed(1)+' months']],steps:['Review inputs and gross-margin assumptions','Verify cost or labor savings against a baseline','Present the scenario with its limitations, not as guaranteed earnings'],drafts:[{type:'Client-facing explanation draft',text:textSummary}],payload:{project,investment,monthlySavings,monthlyRevenue,grossMargin,months,benefit,net,roi,breakeven},warning:guard+' This does not include discount rates, tax, financing costs, time value of money or unmodeled implementation expense.'};
}
export function quoteBuilder(data){
 const service=text(data.service,'service name',100),hours=num(data.hours,'delivery hours',0,100000),rate=num(data.rate,'hourly cost',0,100000),materials=num(data.materials,'material and vendor costs',0,1e9),margin=num(data.margin,'target margin',0,90)/100;
 const cost=hours*rate+materials;if(cost<=0)throw Error('Enter positive delivery labor or materials');
 const price=cost/(1-margin),profit=price-cost,rounded=Math.ceil(price/25)*25;
 const description='Estimate for '+service+': '+hours+' delivery hours at '+money(rate)+'/hr in internal cost, '+money(materials)+' in materials/vendor costs. Proposed quote '+money(rounded)+'.';
 return {title:'Service quote',summary:description,metrics:[['Cost basis',money(cost)],['Quote (rounded)',money(rounded)],['Modeled contribution',money(rounded-cost)]],steps:['Verify scope, quantities and exclusions','Review pricing against the approved service agreement','Present a quote for human acceptance before any invoice or commitment'],drafts:[{type:'Client quote draft',text:description+' Subject to final scope and approval.'}],payload:{service,hours,rate,materials,margin,cost,unroundedPrice:price,quotePrice:rounded,profit:rounded-cost},warning:guard+' Quote is an estimate, not a binding offer; tax, overhead, contingencies and legal terms must be added separately.'};
}
