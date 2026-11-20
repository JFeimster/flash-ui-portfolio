// Launch-kit planner for a service business; deterministic estimates and editable documents only.
const str=(v,name)=>{if(typeof v!=='string'||!v.trim()||v.trim().length>150)throw Error('Enter a valid '+name);return v.trim()};
const numeric=(v,name,min,max)=>{if(v===''||v==null||!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw Error(name+' must be between '+min+' and '+max);return Number(v)};
const usd=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
export function agencyLaunchKit(d){
 const name=str(d.name,'agency name'),vertical=str(d.vertical,'niche or industry'),offer=str(d.offer,'core service'),buyer=str(d.buyer,'target buyer');
 const price=numeric(d.price,'monthly package price',1,1e8),deliveryCost=numeric(d.deliveryCost,'monthly cost per client',0,1e8),targetClients=numeric(d.targetClients,'initial client goal',1,10000);
 if(!Number.isInteger(targetClients))throw Error('Client goal must be a whole number');
 if(price<=deliveryCost)throw Error('Price must exceed delivery cost to produce a positive contribution.');
 const contribution=price-deliveryCost,margin=(contribution/price)*100,mrr=price*targetClients,operatingContribution=contribution*targetClients;
 const actions=[
  'Choose and document the offer promise for '+buyer+' in '+vertical,
  'Define three deliverables and explicitly exclude unsupported services',
  'Produce landing page, discovery questionnaire and service agreement',
  'Map client intake, credentials and approvals before integrations',
  'Set up client execution checklist and QA handoffs',
  'Define monthly reporting, approval gates and escalation ownership',
  'Test first customer delivery manually before scaling automation',
  'Validate fulfillment cost, profit and retention using real customers'
 ];
 const pitch=name+' helps '+buyer+' in '+vertical+' with '+offer+'. Starting service package: '+usd(price)+'/month, subject to a documented scope and onboarding assessment.';
 return {title:'Done-for-you agency launch blueprint',summary:name+' · '+usd(mrr)+' modeled monthly recurring revenue at '+targetClients+' clients',metrics:[['Modeled MRR',usd(mrr)],['Contribution / client',usd(contribution)],['Modeled margin',margin.toFixed(1)+'%'],['Contribution at goal',usd(operatingContribution)]],steps:actions,drafts:[{type:'Positioning & offer copy',text:pitch},{type:'Delivery outline',text:'Offer: '+offer+'\nTarget: '+buyer+'\nNiche: '+vertical+'\nService setup → intake → monthly fulfillment → approved reporting → renewal.'}],payload:{name,vertical,offer,buyer,price,deliveryCost,targetClients,contribution,margin,mrr,operatingContribution,workplan:actions},warning:'Planning model only: no clients, revenue, websites, CRMs, applications or automations have been created. Costs exclude acquisition, tax, overhead and other unmodeled expenses.'};
}
