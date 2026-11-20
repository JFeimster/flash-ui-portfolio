import {qualificationQuiz,roiGenerator,quoteBuilder} from './lead-tools-core.mjs';
import {agencyLaunchKit} from './agency-kit-core.mjs';
import {missedCallWorkflow,invoiceFollowupWorkflow,onboardingWorkflow} from './workflow-lab-core.mjs';
const $=id=>document.getElementById(id);
const node=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
const type=document.body.dataset.workflow;
const schemas={
 missed:{title:'Missed-Call Recovery',description:'Triage a fictional missed inquiry, prioritize a callback and generate an unsent reply draft.',fn:missedCallWorkflow,
 fields:[['caller','Caller / business name','text','Taylor / Main Street Repair'],['service','Requested service','text','Emergency HVAC repair'],['missedMinutes','Minutes since missed call','number','45',0,10080],['urgency','Urgency','select','time-sensitive',['routine','time-sensitive','urgent']]]},
 invoice:{title:'Invoice Follow-Up Autopilot',description:'Prioritize an overdue invoice, distinguish disputed amounts and draft review-ready outreach.',fn:invoiceFollowupWorkflow,
 fields:[['client','Client name','text','Northstar Plumbing'],['invoice','Invoice ID','text','INV-1024'],['amount','Amount ($)','number','2450',0.01,1000000000],['daysOverdue','Days overdue','number','30',0,3650],['disputed','Invoice disputed?','select','no',['no','yes']]]},
 onboarding:{title:'Client Onboarding Automation Builder',description:'Build a tailored client delivery checklist with owners, milestones, evidence and unsent welcome copy.',fn:onboardingWorkflow,
 fields:[['client','Client / organization','text','Meridian Advisory'],['service','Service being delivered','text','AI automation implementation'],['owner','Responsible operator','text','Project lead'],['deadlineDays','Delivery timeline (days)','number','30',1,365],['complexity','Complexity','select','standard',['simple','standard','complex']]]}
};
schemas.qualify={title:'Smart Qualification Quiz Builder',description:'Score a fictional prospect and create a consent-safe outreach brief.',fn:qualificationQuiz,fields:[
 ['company','Customer or business name','text','Riverstone Services'],['need','Requested outcome','text','New commercial website'],['budget','Indicative budget ($)','number','3500',0,100000000],['timelineDays','Decision timeline (days)','number','21',0,3650],['readiness','Purchase stage','select','evaluating',['researching','evaluating','ready']]]};
schemas.roi={title:'ROI Calculator Generator',description:'Model project payback with user-controlled cost and benefits.',fn:roiGenerator,fields:[
 ['project','Project name','text','CRM Automation'],['investment','One-time investment ($)','number','12000',1,1000000000],['monthlySavings','Estimated monthly cost savings ($)','number','1800',0,1000000000],['monthlyRevenue','Estimated added monthly revenue ($)','number','1500',0,1000000000],['grossMargin','Added revenue contribution margin (%)','number','45',0,100],['months','Projection months','number','12',1,120]]};
schemas.quote={title:'Instant Quote & Estimate Widget',description:'Calculate an example service quote from costs and target margin.',fn:quoteBuilder,fields:[
 ['service','Service description','text','Workflow Automation Setup'],['hours','Estimated delivery hours','number','30',0,100000],['rate','Internal labor cost ($/hour)','number','60',0,100000],['materials','External/vendor costs ($)','number','800',0,1000000000],['margin','Target pricing margin (%)','number','40',0,90]]};
schemas.kit={title:'Agency Launch Kit Composer',description:'Build an agency service offer, pricing assumptions and execution plan.',fn:agencyLaunchKit,fields:[
 ['name','Agency brand','text','Northstar Automations'],['vertical','Target niche','text','Home services'],['offer','Primary service offering','text','AI customer follow-up automation'],['buyer','Ideal paying customer','text','Owner-operated contracting businesses'],['price','Monthly package price ($)','number','799',1,100000000],['deliveryCost','Monthly fulfillment cost per client ($)','number','220',0,100000000],['targetClients','Initial target clients','number','10',1,10000]]};

const spec=schemas[type];if(!spec)throw Error('Unknown workflow prototype');
const fields=$('workflowFields');for(const [key,label,kind,initial,min,maximum] of spec.fields){
 const wrapper=node('label','',label);const input=kind==='select'?node('select','calc-input'):node('input','calc-input');
 input.id=key;input.name=key;input.required=true;
 if(kind==='select'){for(const option of min){const opt=node('option','',option);opt.value=option;input.append(opt)}}else{input.type=kind;if(kind==='number'){input.min=String(min);input.max=String(maximum);input.step=Number(min)%1===0?'1':'0.01'}input.maxLength=200}
 input.value=initial;wrapper.append(input);fields.append(wrapper)
}
let last=null;
function draw(){
 $('workflowSummary').replaceChildren();$('workflowSteps').replaceChildren();$('workflowDrafts').replaceChildren();$('workflowJSON').value='';
 const model=Object.fromEntries(spec.fields.map(([key])=>[key,$(key).value]));try{
  if(!document.getElementById('workflowForm').checkValidity()){document.getElementById('workflowForm').reportValidity();throw Error('Correct the highlighted fields before generating.')}
  last=spec.fn(model);
  $('workflowSummary').append(node('p','note',last.summary));
  const metrics=node('div','result-grid');for(const [label,value] of last.metrics){const item=node('div','metric');item.append(node('span','name',label),node('strong','',value));metrics.append(item)}$('workflowSummary').append(metrics);
  const steps=node('ol','spec-list');for(const s of last.steps)steps.append(node('li','',s));$('workflowSteps').append(steps);
  for(const draft of last.drafts){const div=node('section','');div.append(node('h3','',draft.type),node('p','draft',draft.text));$('workflowDrafts').append(div)}
  $('workflowJSON').value=JSON.stringify(last,null,2);
  $('warning').textContent=last.warning;
  $('resultStatus').className='note';$('resultStatus').textContent='Generated locally. You can review and export this workflow; no external action was taken.';
  $('copy').disabled=false;$('download').disabled=false;
 }catch(e){last=null;$('resultStatus').className='error';$('resultStatus').textContent=e.message;$('copy').disabled=true;$('download').disabled=true;$('warning').textContent=''}}
$('workflowForm').addEventListener('submit',e=>{e.preventDefault();draw()});
$('reset').addEventListener('click',()=>{for(const [key,, ,initial] of spec.fields)$(key).value=initial;draw()});
$('copy').addEventListener('click',async()=>{if(!last)return;try{await navigator.clipboard.writeText(JSON.stringify(last,null,2));$('resultStatus').textContent='Workflow JSON copied to clipboard.'}catch{$('resultStatus').textContent='Clipboard unavailable. Select and copy the visible JSON instead.'}});
$('download').addEventListener('click',()=>{if(!last)return;const blob=new Blob([JSON.stringify(last,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=node('a');a.href=url;a.download=type+'-workflow.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)});
draw();
