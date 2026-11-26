// Suggestions use recorded catalog fields and graph links. A score is a ranking aid, not identity or quality proof.
const words = value => new Set(String(value || '').toLowerCase().match(/[a-z0-9]{4,}/g) || []);
const list = value => Array.isArray(value) ? value : value ? [value] : [];
const intersection = (a,b) => a.filter(value => b.includes(value));

export function similarity(a,b) {
  const reasons=[];
  const ac=a.catalog||{},bc=b.catalog||{};
  for(const [field,label,weight] of [['designThemeIds','theme',4],['capabilities','capability',3],['audiences','audience',2],['industries','industry',2],['productCategory','category',1]]) {
    const common=intersection(list(ac[field]),list(bc[field]));
    if(common.length) reasons.push({field,label,values:common,weight});
  }
  const commonWords=[...words([a.title,a.description].filter(Boolean).join(' '))].filter(word=>words([b.title,b.description].filter(Boolean).join(' ')).has(word)).slice(0,4);
  if(commonWords.length) reasons.push({field:'text',label:'shared description terms',values:commonWords,weight:1});
  return {score:reasons.reduce((sum,reason)=>sum+reason.weight,0),reasons};
}

export function recommendReuse(selected,rows,limit=5) {
  if(!selected)return [];
  return rows.filter(row=>row.id!==selected.id && row.path).map(row=>({row,...similarity(selected,row)}))
    .filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.row.title.localeCompare(b.row.title)).slice(0,limit);
}

export function integrationAdvice(row,integrations=[]) {
  const text=[row?.title,row?.description,...list(row?.catalog?.capabilities),...list(row?.catalog?.integrations)].join(' ').toLowerCase();
  const rules=[
    {match:/form|lead|signup|contact|newsletter|email/,ids:['resend'],reason:'Lead capture or messaging appears in the recorded description.'},
    {match:/payment|checkout|billing|commerce|subscription/,ids:['stripe'],reason:'A payment or billing workflow appears in the recorded description.'},
    {match:/account|login|member|portal|dashboard/,ids:['clerk','supabase'],reason:'Accounts or persistent user data may be needed.'},
    {match:/search|directory|catalog/,ids:['algolia'],reason:'Search or directory behavior appears in the recorded description.'},
    {match:/ai |agent|copilot|model|prompt/,ids:['openai-api'],reason:'Model-backed behavior may be relevant; deterministic behavior remains available.'}
  ];
  const selected=new Map();
  for(const rule of rules)if(rule.match.test(text))for(const id of rule.ids){const integration=integrations.find(item=>item.id===id);if(integration)selected.set(id,{...integration,reason:rule.reason,status:'planning suggestion; setup and authorization required'});}
  for(const id of list(row?.catalog?.integrations)){const integration=integrations.find(item=>item.id===id);if(integration)selected.set(id,{...integration,reason:'Explicit catalog integration field.',status:'catalog record; operation unverified'});}
  return [...selected.values()];
}

export function mcpAdvice(row) {
 const text=[row?.title,row?.description,...list(row?.catalog?.capabilities)].join(' ').toLowerCase();
 const candidates=[];
 if(/calculator|estimate|scorecard|checklist/.test(text))candidates.push({name:'Read-only calculation tool',reason:'A recorded calculator, estimator, scorecard, or checklist could expose deterministic inputs and outputs.'});
 if(/directory|catalog|search|library/.test(text))candidates.push({name:'Searchable resource',reason:'A recorded directory or catalog could expose browse and lookup operations.'});
 if(/workflow|automation|agent/.test(text))candidates.push({name:'Workflow action draft',reason:'A recorded workflow could be mapped to a permissioned action after review.'});
 return candidates.map(item=>({...item,status:'MCP design candidate only; no server, endpoint, or permissioned action is implemented'}));
}

export function compareAssets(a,b) {
  if(!a||!b)return [];
  const fields=[['Category','productCategory'],['Type','productType'],['Audiences','audiences'],['Capabilities','capabilities'],['Themes','designThemeIds'],['Integrations','integrations'],['Distribution','distributionMethods']];
  return fields.map(([label,key])=>({label,left:list(a.catalog?.[key]).join(', ')||'Unrecorded',right:list(b.catalog?.[key]).join(', ')||'Unrecorded'}));
}
