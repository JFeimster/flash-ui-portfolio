import {prefillIdea} from './capability-ideas-core.mjs';
export const FUNDING_SCHEMA='flash-ui-funding-agency-ideas/v1';
export const FUNDING_GROUPS=['DFY Agency Platforms','Embedded Funding','Funding Automation','Distribution & Partners','Specialized Capital Advisory'];
export function validateFundingCollection(c){
 const errors=[];
 if(c?.schema!==FUNDING_SCHEMA)errors.push('Unexpected funding idea schema');
 if(!Array.isArray(c?.entries)||c.entries.length!==20||c.count!==20)errors.push('Expected 20 funding ideas');
 const ids=new Set();
 for(const x of c?.entries||[]){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x.id||'')||ids.has(x.id))errors.push('Missing or duplicate idea ID: '+x.id);
  ids.add(x.id);
  for(const k of ['title','description','buyer','commercialRole','deliveryModel','automationScope','revenueModel','integrationRequirements','functionalSpec','sourceRequirements','tools','monetization'])if(!x[k]||(Array.isArray(x[k])&&!x[k].length))errors.push('Missing '+k+' on '+x.id);
  if(!FUNDING_GROUPS.includes(x.category))errors.push('Unknown category: '+x.id);
  if(x.mode!=='mcp-scaffold'||x.status!=='concept-only'||x.sourceStatus!=='template-not-original')errors.push('False deployment/source status: '+x.id);
  if(!x.functionalSpec?.inputs?.length||!x.functionalSpec?.workflow?.length||!x.functionalSpec?.outputs?.length||!x.functionalSpec?.guardrails?.length)errors.push('Incomplete specification: '+x.id);
  if(!x.tools?.every(t=>/^[a-z][a-z0-9_]*$/.test(t.name)&&typeof t.description==='string'))errors.push('Invalid tools: '+x.id);
 }
 return errors;
}
export function prefillFundingAgencyIdea(idea){
 if(!idea||idea.kind!=='funding-agency-product-concept')throw Error('Unknown funding agency product idea');
 const draft=prefillIdea(idea);
 draft.instructions+='\n\n# COMMERCIAL OFFER / DELIVERY MODEL\nCommercial role: '+idea.commercialRole+'\nDelivery: '+idea.deliveryModel+'\nAutomation boundary: '+idea.automationScope+'\nPotential revenue model:\n'+idea.revenueModel.map(x=>'- '+x).join('\n')+'\n\nBefore launch: verify applicable broker licensing, lending disclosures, referral compensation, privacy, customer consent and partner agreements for each intended jurisdiction and activity.';
 draft.knowledge+='\n\nINTEGRATION CONTRACTS TO SOURCE:\n'+idea.integrationRequirements.map(x=>'- '+x).join('\n');
 return draft;
}
