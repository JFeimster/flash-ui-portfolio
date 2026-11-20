// Browser-only operational workflow simulations. No messaging, billing, CRM writes or network calls.
const clean=(v,label,max=160)=>{if(typeof v!=='string'||!v.trim())throw Error('Enter '+label+'.');const s=v.trim();if(s.length>max)throw Error(label+' is too long.');return s};
const int=(v,label,min,max)=>{if(v===''||v==null||!Number.isInteger(Number(v))||Number(v)<min||Number(v)>max)throw Error(label+' must be a whole number from '+min+' to '+max+'.');return Number(v)};
const money=(v,label)=>{if(v===''||v==null||!Number.isFinite(Number(v))||Number(v)<=0||Number(v)>1e9)throw Error('Enter a positive '+label+' under $1 billion.');return Number(v)};
const fmt=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);
const guard='This is a local draft only. Nothing was sent, scheduled, collected, saved to a CRM or shared with a third party.';
export function missedCallWorkflow(payload){
 const caller=clean(payload.caller,'Caller or business name',80),service=clean(payload.service,'Requested service',120),missed=int(payload.missedMinutes,'Minutes since missed call',0,10080),urgency=clean(payload.urgency,'Urgency',20);
 if(!['routine','time-sensitive','urgent'].includes(urgency))throw Error('Choose a valid urgency.');
 const score=urgency==='urgent'?90:urgency==='time-sensitive'?65:35;
 const penalty=Math.min(45,Math.floor(missed/60)*5);
 const priority=urgency==='urgent'||score+penalty>=100?'Immediate':score+penalty>=65?'High':'Standard';
 const reply='Hi '+caller+', thanks for reaching out about '+service+'. Sorry we missed you. Can you share a good time for our team to follow up?';
 const action=urgency==='urgent'?'Review for immediate human callback':'Add to the team callback review queue';
 return {title:'Missed-call recovery',summary:priority+' priority · '+missed+' minutes since missed inquiry',metrics:[['Priority',priority],['Elapsed time',missed+' min'],['Urgency',urgency]],steps:['Verify customer identity and permission before responding',action,'Confirm service need and callback availability','Record result only in an authorized CRM'],drafts:[{type:'Unsent reply draft',text:reply}],payload:{caller,service,missedMinutes:missed,urgency,priority},warning:guard+' Confirm consent before any outbound communication.'};
}
export function invoiceFollowupWorkflow(payload){
 const client=clean(payload.client,'Client name',80),invoice=clean(payload.invoice,'Invoice reference',60),amount=money(payload.amount,'invoice amount'),days=int(payload.daysOverdue,'Overdue days',0,3650);
 const disputed=payload.disputed===true||payload.disputed==='yes';
 const severity=disputed?'Dispute review':days>=60?'Escalate for review':days>=30?'High':days>=7?'Standard':'Courtesy';
 const subject=(disputed?'Invoice question':'Payment status check')+' — '+invoice;
 const body=disputed?'Hello '+client+', we are reviewing the question about invoice '+invoice+'. Please share any supporting details so the team can resolve it. No payment demand is being issued while the dispute is under review.':'Hello '+client+', this is a friendly status check on invoice '+invoice+' for '+fmt(amount)+'. Our records show '+days+' days past due. Could you confirm payment status or let us know if there is an issue to resolve?';
 return {title:'Invoice follow-up',summary:severity+' · '+fmt(amount)+' · '+days+' overdue days',metrics:[['Priority',severity],['Invoice amount',fmt(amount)],['Days overdue',String(days)]],steps:disputed?['Review the dispute and invoice evidence','Assign an authorized account owner','Resolve discrepancies before requesting payment']:['Confirm ledger and payment status','Verify customer communications permissions','Review and approve the draft before sending','Update accounting system only after verified payment or communication'],drafts:[{type:'Email subject',text:subject},{type:'Unsent email draft',text:body}],payload:{client,invoice,amount,daysOverdue:days,disputed},warning:guard+' Follow applicable collection and customer communication laws.'};
}
export function onboardingWorkflow(payload){
 const client=clean(payload.client,'Client or organization name',100),service=clean(payload.service,'Service offered',100),owner=clean(payload.owner,'Responsible operator',80),deadline=int(payload.deadlineDays,'Delivery window in days',1,365);
 const complexity=clean(payload.complexity,'Project complexity',20);
 if(!['simple','standard','complex'].includes(complexity))throw Error('Choose a valid complexity.');
 const steps=[
 ['Confirm service scope and sign agreement','Scope approved by client',1],
 ['Collect client intake, brand assets and access needs','Secure input checklist complete',2],
 ['Review access permissions and integration contracts','Operator approves permissions',Math.max(2,Math.ceil(deadline*.2))],
 ['Define milestones, deliverables and review owners','Milestone plan approved',Math.max(3,Math.ceil(deadline*.35))],
 ['Prepare first deliverable and internal QA','QA checklist complete',Math.max(4,Math.ceil(deadline*.7))],
 ['Submit draft for client approval','Client review requested',Math.max(5,Math.ceil(deadline*.85))],
 ['Hand off approved deliverables and next steps','Handoff signed off',deadline]
 ];
 if(complexity==='complex')steps.splice(4,0,['Add security and data-flow review','Security review complete',Math.max(3,Math.ceil(deadline*.55))]);
 const checklist=steps.map(([task,evidence,dueDay],i)=>({id:'TASK-'+String(i+1).padStart(2,'0'),task,evidence,owner,dueDay:Math.min(deadline,dueDay),status:'not-started'}));
 return {title:'Client onboarding project plan',summary:client+' · '+service+' · '+deadline+' day delivery',metrics:[['Tasks',String(checklist.length)],['Delivery window',deadline+' days'],['Complexity',complexity]],steps:checklist.map(x=>x.id+' · Day '+x.dueDay+' — '+x.task+' ('+x.evidence+')'),drafts:[{type:'Welcome message (unsent)',text:'Hello '+client+', we are preparing the '+service+' engagement. '+owner+' will coordinate intake, milestone approvals and your '+deadline+'-day delivery plan. Please review the requested onboarding materials before kickoff.'}],payload:{client,service,owner,deadlineDays:deadline,complexity,checklist},warning:guard+' Any service-specific legal obligations and integrations require separate implementation.'};
}
