/** Offline creation rules. All suggestions are derived from supplied records and inputs. */
const clean = value => String(value ?? '').trim();
const words = value => new Set(clean(value).toLowerCase().match(/[a-z0-9]+/g) || []);
const overlap = (a,b) => [...words(a)].filter(word => words(b).has(word)).length;
const unique = values => [...new Set(values.map(clean).filter(Boolean))];
const noun = value => clean(value) || 'the project';

export function createCopilotRuntime({suggest, revise, generate} = {}) {
  return Object.freeze({
    provider: suggest || revise || generate ? 'configured-provider' : 'offline-rules',
    async suggest(context) { return suggest ? suggest(context) : offlineSuggestions(context); },
    async revise(context) { return revise ? revise(context) : optimizePrompt(context.prompt, context); },
    async generate(context) { return generate ? generate(context) : composePrompt(context); }
  });
}

export function missingRequirements(brief) {
  return [['projectName','Project name'],['audience','Audience'],['problem','Problem to solve'],['cta','Primary action'],['features','Core features']]
    .filter(([key]) => !clean(brief[key])).map(([,label]) => label);
}

export function recommendThemes(brief, themes, limit=3) {
  const text = [brief.idea,brief.projectName,brief.audience,brief.problem,brief.designDirection].join(' ');
  return (themes || []).map(theme => {
    const terms = unique([...(theme.keywords || []), theme.name, theme.concept]);
    const matches = terms.filter(term => overlap(term,text) > 0);
    return {id:theme.id,name:theme.name,score:matches.length,reason:matches.length ? `Shared brief terms: ${matches.slice(0,3).join(', ')}` : 'General design option; no matching terms recorded'};
  }).sort((a,b)=>b.score-a.score || a.name.localeCompare(b.name)).slice(0,limit);
}

export function recommendAssets(brief, catalog, graph, packages, limit=5) {
  const text = [brief.idea,brief.projectName,brief.problem,brief.audience,brief.features].join(' ');
  const packageEntries = packages?.entries || {};
  const items = (graph?.nodes || []).filter(node => ['site','template','tool','idea'].includes(node.type)).map(node => {
    const matches = unique([node.name,node.category,node.summary].flatMap(part => [...words(part)].filter(term => term.length > 3 && words(text).has(term))));
    const route = node.url?.startsWith('/') ? node.url : '';
    const pkg = packageEntries[route];
    return {id:node.id,name:node.name,type:node.type,url:node.url,score:matches.length,reason:matches.length ? `Shared terms: ${matches.slice(0,4).join(', ')}` : 'No textual match',packageRoute:pkg ? route : null,componentEvidence:pkg ? (pkg.files || []).filter(f => /component|\.css$|\.js$/i.test(f.name)).slice(0,3).map(f=>f.name) : []};
  }).filter(item=>item.score>0);
  const known = new Set(items.map(i=>i.name.toLowerCase()));
  for (const [id,copy] of Object.entries(catalog?.projects || {})) if (!known.has(id.toLowerCase())) {
    const matches = [...words([id,copy.title,copy.description,copy.catalog?.capabilities].join(' '))].filter(term=>term.length>3 && words(text).has(term));
    if(matches.length)items.push({id,name:copy.title||id,type:'catalog',url:`/sites/${id}/`,score:matches.length,reason:`Shared terms: ${matches.slice(0,4).join(', ')}`,packageRoute:null,componentEvidence:[]});
  }
  return items.sort((a,b)=>b.score-a.score || a.name.localeCompare(b.name)).slice(0,limit);
}

export function recommendIntegrations(brief, integrations) {
  const text=[brief.idea,brief.problem,brief.features].join(' ').toLowerCase();
  const candidates=[];
  for(const entry of integrations?.integrations || integrations?.entries || []) {
    const label=entry.name || entry.label || entry.id;
    const tokens=words([label,entry.description,entry.category].join(' '));
    const matches=[...tokens].filter(word=>word.length>3 && words(text).has(word));
    if(matches.length)candidates.push({id:entry.id||label,name:label,reason:`Shared terms: ${matches.slice(0,3).join(', ')}`,status:'candidate; setup unverified'});
  }
  return candidates.slice(0,5);
}

export function offlineSuggestions({brief={},ideas=[],themes=[],catalog={},graph={},packages={},integrations={}}={}) {
  const source=ideas.find(item=>item.id===brief.ideaId);
  const topic=noun(brief.projectName || brief.idea || source?.name);
  const audience=unique([brief.audience,source?.factory?.brief?.audience,source?.visitor_psychology,`People trying to ${clean(brief.problem) || `use ${topic}`}`,`Teams evaluating ${topic}`]);
  const cta=unique([brief.cta,source?.factory?.brief?.primary_action,source?.primary_cta,`Try ${topic}`,`Explore ${topic}`,`Get a plan for ${topic}`]);
  const hooks=unique([brief.hook,`Make ${topic} easier to understand.`,`A clearer way to ${clean(brief.problem) || `explore ${topic}`}.`,`From question to next step with ${topic}.`]);
  const profile=source?.factory?.architecture_profile || source?.factory?.archetype || 'site';
  const features=unique([brief.features,...(profile==='generator'?['Guided inputs','Generated result','Copy and reset']:profile==='directory'?['Search and filters','Detail pages','Empty states']:['Clear navigation','Responsive layout','Accessible primary action'])]);
  return {kind:'rule-based',provider:'offline-rules',sourceIdea:source?.id||null,alternatives:{audience:audience.slice(0,4),cta:cta.slice(0,4),hook:hooks.slice(0,4),features:features.slice(0,6)},missing:missingRequirements(brief),themes:recommendThemes(brief,themes),assets:recommendAssets(brief,catalog,graph,packages),integrations:recommendIntegrations(brief,integrations)};
}

export function composePrompt({brief={},suggestions={}}={}) {
  const missing=missingRequirements(brief);
  const lines=[`# Build ${noun(brief.projectName || brief.idea)}`,'',`Idea: ${clean(brief.idea) || '[define idea]'}`,`Audience: ${clean(brief.audience) || '[confirm audience]'}`,`Problem: ${clean(brief.problem) || '[define problem]'}`,`Hook: ${clean(brief.hook) || '[choose hook]'}`,`Primary action: ${clean(brief.cta) || '[choose CTA]'}`,`Core features: ${clean(brief.features) || '[define features]'}`,`Design direction: ${clean(brief.designDirection) || '[choose design direction]'}`,`Theme ID: ${clean(brief.themeId) || '[choose canonical theme ID]'}`,`Integration needs: ${clean(brief.integrations) || 'Local demo only; no live service configured'}`,'', '## Build requirements','- Use accessible semantic HTML, keyboard controls, responsive layouts, and reduced motion support.','- Include actual empty, validation, success, and failure states where relevant.','- Preserve original source assets and verify all local dependencies.','- Keep external integrations in demo mode until configured and authorized.',`- Reuse candidates: ${(suggestions.assets||[]).map(item=>`${item.name} (${item.reason})`).join('; ') || 'none evidenced'}.`,`- Open decisions: ${missing.join('; ') || 'none in the required fields'}.`];
  return lines.join('\n');
}

export function optimizePrompt(prompt,{brief={}}={}) {
  const source=clean(prompt);
  if(!source)return composePrompt({brief});
  const extras=[];
  if(!/accessib|keyboard/i.test(source))extras.push('Check semantic controls, labels, keyboard use, and focus visibility.');
  if(!/responsive|mobile/i.test(source))extras.push('Check narrow mobile and desktop layouts.');
  if(!/error|empty state/i.test(source))extras.push('Include validation, empty, and error states where relevant.');
  if(!/verif|test/i.test(source))extras.push('Report actual tests and unresolved limitations.');
  return extras.length ? `${source}\n\n## Suggested quality checks\n${extras.map(x=>'- '+x).join('\n')}` : source;
}

export function exportBrief(brief,prompt,history=[]) { return {schemaVersion:'flash-ui-copilot-brief/v1',source:'offline-rule-based',brief:{...brief},prompt:clean(prompt),history:history.map(({id,at,label,prompt})=>({id,at,label,prompt}))}; }
export function importBrief(value) {
  if(!value || value.schemaVersion!=='flash-ui-copilot-brief/v1' || !value.brief || typeof value.brief!=='object' || Array.isArray(value.brief) || typeof value.prompt!=='string')throw Error('Unsupported Copilot brief');
  const fields=['ideaId','idea','projectName','audience','problem','hook','cta','features','designDirection','themeId','integrations'];
  return {brief:Object.fromEntries(fields.map(key=>[key,clean(value.brief[key])])),prompt:value.prompt,history:Array.isArray(value.history)?value.history.filter(v=>v && typeof v.prompt==='string').slice(-50):[]};
}
