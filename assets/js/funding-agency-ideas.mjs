import {validateFundingCollection,FUNDING_GROUPS} from './funding-agency-core.mjs';
const $=id=>document.getElementById(id),el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
let entries=[],activeId='';
const params=new URLSearchParams(location.search);
function filtered(entries,{query='',category='',sort='priority'}={}){
 const words=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 const found=entries.filter(e=>(!category||category===e.category)&&words.every(w=>[
 e.title,e.description,e.category,e.buyer,e.commercialRole,e.deliveryModel,e.automationScope,e.functionalSpec.objective,
 ...e.tools.map(t=>t.name+' '+t.description),...e.sourceRequirements,...e.monetization
 ].join(' ').toLowerCase().includes(w)));
 return found.sort(sort==='title'?(a,b)=>a.title.localeCompare(b.title):sort==='category'?(a,b)=>a.category.localeCompare(b.category)||a.priority-b.priority:(a,b)=>a.priority-b.priority);
}
function list(parent,values,ordered=false){const ul=el(ordered?'ol':'ul');for(const value of values)ul.append(el('li','',value));parent.append(ul)}
function section(parent,name){parent.append(el('h3','',name))}
function renderDetail(x){
 const root=$('ideaDetail');root.replaceChildren();
 if(!x){root.append(el('p','muted','No matching concepts. Clear filters or search another term.'));return}
 const line=el('div','detail-topline');line.append(el('span','',x.category),el('span','','IDEA '+String(x.priority).padStart(2,'0')+' / 20'));root.append(line);
 root.append(el('h2','',x.title),el('p','',x.description),el('div','callout','Concept specification. No funding agency, lender API or live tool is installed. All proposed automation requires real integrations and explicit action permissions.'));
 section(root,'Commercial role');root.append(el('p','',x.commercialRole));
 section(root,'Buyer');root.append(el('p','',x.buyer));
 section(root,'Delivery model');root.append(el('p','',x.deliveryModel));
 section(root,'Automation boundaries');root.append(el('p','',x.automationScope));
 section(root,'Functional objective');root.append(el('p','',x.functionalSpec.objective));
 section(root,'Inputs');list(root,x.functionalSpec.inputs);
 section(root,'Workflow');list(root,x.functionalSpec.workflow,true);
 section(root,'Outputs');list(root,x.functionalSpec.outputs);
 section(root,'Proposed tools');const pills=el('div','tool-pills');for(const t of x.tools){const chip=el('code','',t.name);chip.title=t.description;pills.append(chip)}root.append(pills);
 section(root,'Source & integrations needed');list(root,x.sourceRequirements);
 section(root,'Revenue model');list(root,x.monetization);
 section(root,'Operating guardrails');list(root,x.functionalSpec.guardrails);
 const a=el('a','idea-cta','Use in Capability Factory ↗');a.href='/capabilities/?fundingIdea='+encodeURIComponent(x.id);a.setAttribute('aria-label','Prefill '+x.title+' in Capability Factory');root.append(a);
 root.append(el('p','muted','Prefills an editable draft MCP/API implementation scaffold with the commercial role, delivery model, tool contracts, source requirements and controls.'));
}
function render(){
 const query=$('ideaSearch').value,category=$('category').value,sort=$('sort').value;
 const visible=filtered(entries,{query,category,sort});
 const url=new URL(location.href);for(const [k,v] of Object.entries({q:query,category,sort:sort==='priority'?'':sort})){if(v)url.searchParams.set(k,v);else url.searchParams.delete(k)}history.replaceState(null,'',url.pathname+url.search);
 $('ideaCount').textContent=visible.length+' of '+entries.length+' funding concepts';
 const box=$('ideaCards');box.replaceChildren();if(!visible.length)box.append(el('p','no-ideas','No funding concepts match those filters.'));
 const selected=visible.find(e=>e.id===activeId)||visible[0];activeId=selected?.id||'';
 for(const x of visible){
  const card=el('button','idea-entry');card.type='button';card.classList.toggle('selected',x.id===activeId);card.setAttribute('aria-pressed',String(x.id===activeId));
  card.append(el('span','kind',x.category),el('strong','',x.title),el('span','summary',x.description),el('span','bottom',x.deliveryModel+' · '+x.monetization.length+' revenue options'));
  card.addEventListener('click',()=>{activeId=x.id;render();if(matchMedia('(max-width:950px)').matches)$('ideaDetail').scrollIntoView({behavior:'smooth',block:'start'})});box.append(card);
 }
 renderDetail(selected);
}
async function init(){
 try{
  const response=await fetch('/data/funding-agency-automation-ideas.json');if(!response.ok)throw Error('Funding product collection unavailable');
  const catalog=await response.json();const issues=validateFundingCollection(catalog);if(issues.length)throw Error('Collection failed validation: '+issues.join('; '));
  entries=catalog.entries;
  for(const group of FUNDING_GROUPS){const option=el('option','',group);option.value=group;$('category').append(option)}
  $('ideaSearch').value=params.get('q')||'';$('category').value=FUNDING_GROUPS.includes(params.get('category'))?params.get('category'):'';$('sort').value=['title','category'].includes(params.get('sort'))?params.get('sort'):'priority';activeId=params.get('idea')||'';
  for(const id of ['ideaSearch','category','sort'])$(id).addEventListener(id==='ideaSearch'?'input':'change',render);
  $('reset').addEventListener('click',()=>{$('ideaSearch').value='';$('category').value='';$('sort').value='priority';activeId='';render()});
  render();
 }catch(e){$('ideaCount').textContent='Unable to load collection';$('ideaDetail').textContent=e.message}
}
init();
