import {validateIdeas,filterIdeas} from './capability-ideas-core.mjs';
const $=id=>document.getElementById(id);
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
let entries=[],activeId='';
const params=new URLSearchParams(location.search);
function makeList(parent,values,ordered=false){const list=el(ordered?'ol':'ul');for(const v of values)list.append(el('li','',v));parent.append(list)}
function renderDetail(idea){
 const root=$('ideaDetail');root.replaceChildren();if(!idea){root.append(el('p','muted','No matching product idea. Reset filters to explore all 25.'));return}
 const line=el('div','detail-topline');line.append(el('span','',idea.category),el('span','','CONCEPT / '+String(idea.priority).padStart(2,'0')));root.append(line);
 root.append(el('h2','',idea.title),el('p','',idea.description));
 const notice=el('div','callout','Concept specification only. Tools and integrations below are proposed, not active. Prefill produces an editable draft, not a deployed MCP server.');root.append(notice);
 const section=(heading)=>{root.append(el('h3','',heading))};
 section('Who pays');root.append(el('p','',idea.buyer));
 section('Functional specification');
 root.append(el('p','',idea.functionalSpec.objective));
 section('Required inputs');makeList(root,idea.functionalSpec.inputs);
 section('Workflow');makeList(root,idea.functionalSpec.workflow,true);
 section('Expected outputs');makeList(root,idea.functionalSpec.outputs);
 section('Example MCP tools');const chips=el('div','tool-pills');for(const tool of idea.tools){const chip=el('code','',tool.name);chip.title=tool.description;chips.append(chip)}root.append(chips);
 section('Source requirements');makeList(root,idea.sourceRequirements);
 section('Monetization');makeList(root,idea.monetization);
 section('Safety boundaries');makeList(root,idea.functionalSpec.guardrails);
 const a=el('a','idea-cta','Use in Capability Factory ↗');a.href='/capabilities/?idea='+encodeURIComponent(idea.id);a.setAttribute('aria-label','Prefill '+idea.title+' in Capability Factory');root.append(a);
 const note=el('p','muted','One click preloads editable draft instructions, proposed tools, knowledge requirements and the MCP server scaffold mode.');root.append(note);
}
function render(){
 const query=$('ideaSearch').value,category=$('category').value,sort=$('sort').value;
 const visible=filterIdeas(entries,{query,category,sort});
 const url=new URL(location.href);query?url.searchParams.set('q',query):url.searchParams.delete('q');category?url.searchParams.set('category',category):url.searchParams.delete('category');sort!=='priority'?url.searchParams.set('sort',sort):url.searchParams.delete('sort');
 history.replaceState(null,'',url.pathname+url.search);
 $('ideaCount').textContent=visible.length+' of '+entries.length+' concepts';
 const cards=$('ideaCards');cards.replaceChildren();
 if(!visible.length)cards.append(el('p','no-ideas','No concepts match this search. Try another keyword or clear the filters.'));
 const selected=visible.find(x=>x.id===activeId)||visible[0];
 activeId=selected?.id||'';
 for(const idea of visible){
  const card=el('button','idea-entry');card.type='button';card.classList.toggle('selected',idea.id===activeId);card.setAttribute('aria-pressed',String(idea.id===activeId));
  card.append(el('span','kind',idea.category),el('strong','',idea.title),el('span','summary',idea.description),el('span','bottom',idea.tools.length+' proposed tools · '+idea.monetization.length+' business models'));
  card.addEventListener('click',()=>{activeId=idea.id;render();if(matchMedia('(max-width:950px)').matches)$('ideaDetail').scrollIntoView({behavior:'smooth',block:'start'})});
  cards.append(card)
 }
 renderDetail(selected);
}
async function main(){
 try{
  const response=await fetch('/data/mcp-agent-product-ideas.json');
  if(!response.ok)throw Error('Collection could not be loaded');
  const catalog=await response.json();const issues=validateIdeas(catalog);if(issues.length)throw Error('Collection invalid: '+issues.join('; '));
  entries=catalog.entries;
  const categories=[...new Set(entries.map(x=>x.category))].sort();
  for(const cat of categories){const o=el('option','',cat);o.value=cat;$('category').append(o)}
  $('ideaSearch').value=params.get('q')||'';
  $('category').value=categories.includes(params.get('category'))?params.get('category'):'';
  $('sort').value=['title','category'].includes(params.get('sort'))?params.get('sort'):'priority';
  activeId=params.get('idea')||'';
  for(const id of ['ideaSearch','category','sort'])$(id).addEventListener(id==='ideaSearch'?'input':'change',render);
  $('reset').addEventListener('click',()=>{$('ideaSearch').value='';$('category').value='';$('sort').value='priority';activeId='';render()});
  render();
 }catch(error){$('ideaCount').textContent='Could not load product ideas';$('ideaDetail').textContent=error.message}
}
main();
