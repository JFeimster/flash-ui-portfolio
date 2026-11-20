// Shared, side-effect-free collection helpers for directory and Capability Factory.
export const IDEA_SCHEMA='flash-ui-mcp-agent-product-ideas/v1';
export function validateIdeas(collection){
 const errors=[];
 if(collection?.schema!==IDEA_SCHEMA)errors.push('Unsupported idea collection schema');
 if(!Array.isArray(collection?.entries)||collection.entries.length!==25)errors.push('Expected exactly 25 ideas');
 if(collection?.count!==collection?.entries?.length)errors.push('Count mismatch');
 const ids=new Set();
 for(const idea of collection?.entries||[]){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(idea.id||''))errors.push('Invalid idea id');
  if(ids.has(idea.id))errors.push('Duplicate id: '+idea.id);ids.add(idea.id);
  for(const key of ['title','category','buyer','description','mode','sourceStatus'])if(!idea[key])errors.push('Missing '+key+': '+idea.id);
  if(idea.mode!=='mcp-scaffold'||idea.sourceStatus!=='template-not-original')errors.push('Misleading source/mode: '+idea.id);
  for(const key of ['inputs','workflow','outputs','guardrails'])if(!Array.isArray(idea.functionalSpec?.[key])||!idea.functionalSpec[key].length)errors.push('Missing functional spec '+key+': '+idea.id);
  for(const key of ['tools','sourceRequirements','monetization'])if(!Array.isArray(idea[key])||!idea[key].length)errors.push('Missing '+key+': '+idea.id);
  if(!idea.tools?.every(t=>/^[a-z][a-z0-9_]*$/.test(t.name)&&t.description))errors.push('Invalid tool: '+idea.id);
 }
 return errors;
}
export function filterIdeas(entries,{query='',category='',sort='priority'}={}){
 const q=query.trim().toLocaleLowerCase();
 const tokens=q.split(/\s+/).filter(Boolean);
 const visible=entries.filter(e=>(!category||e.category===category)&&tokens.every(t=>[
  e.title,e.category,e.buyer,e.description,e.functionalSpec?.objective,
  ...(e.tools||[]).flatMap(x=>[x.name,x.description]),...(e.sourceRequirements||[]),...(e.monetization||[])
 ].join(' ').toLocaleLowerCase().includes(t)));
 const rank=(a,b)=>a.priority-b.priority;
 return visible.sort(sort==='title'?(a,b)=>a.title.localeCompare(b.title):sort==='category'?(a,b)=>a.category.localeCompare(b.category)||rank(a,b):rank);
}
const lines=(items)=>items.map(s=>'- '+s).join('\n');
export function prefillIdea(idea){
 if(!idea||idea.mode!=='mcp-scaffold')throw Error('Unknown MCP product idea');
 const s=idea.functionalSpec;
 const instructions=[
  '# DRAFT IMPLEMENTATION SPECIFICATION — NOT RECOVERED SYSTEM INSTRUCTIONS',
  '# '+idea.title,
  'Status: Concept only. Do not assert a deployed MCP server, verified API, active plugin or functioning integrations.',
  'Target buyer: '+idea.buyer,
  'Objective: '+s.objective,
  'Required inputs:\n'+lines(s.inputs),
  'Functional workflow:\n'+s.workflow.map((step,i)=>(i+1)+'. '+step).join('\n'),
  'Expected outputs:\n'+lines(s.outputs),
  'Proposed MCP tool contracts (unimplemented):\n'+lines(idea.tools.map(t=>t.name+' — '+t.description)),
  'Safety and boundaries:\n'+lines(s.guardrails),
  'Before implementing: Obtain authentic API specifications, credentials via secure runtime configuration, permission scopes, tenant policies and real test data. Stub or document unknown connections; never invent endpoints.'
 ].join('\n\n');
 return {
  name:idea.id,mode:idea.mode,description:idea.description,instructions,
  knowledge:'SOURCE REQUIREMENTS (not supplied):\n'+lines(idea.sourceRequirements),
  contracts:'PROPOSED TOOLS — NOT IMPLEMENTED:\n'+lines(idea.tools.map(t=>t.name+' — '+t.description))+'\n\nRequired integrations and access must be verified.',
  mcpUrl:''
 };
}
