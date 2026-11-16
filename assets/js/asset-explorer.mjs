import { filterAssets } from './asset-explorer-core.mjs';
import { groupAssets } from './asset-groups.mjs';
const labels={idea:'Ideas',template:'Design Templates',site:'Sites',github:'Repositories',vercel:'Vercel Projects',tool:'Prompt Recipes',gpt:'GPTs',capability:'Plugins / MCP / API'};
const params=new URLSearchParams(location.search),$=id=>document.getElementById(id);
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n};
const safeUrl=url=>{try{const u=new URL(url,location.origin);return (url.startsWith('/')&&!url.startsWith('//')&&u.origin===location.origin)||(url.startsWith('https://')&&u.protocol==='https:')?u.href:null}catch{return null}};
const label=n=>labels[n.type]||n.type;
let graph={nodes:[],edges:[]},groups=[],groupByNode=new Map(),active=params.get('asset')||'',saved=new Set(),dense=false,onlySaved=false,pageSize=80;
try{saved=new Set(JSON.parse(localStorage.getItem('flash-ui-ecosystem-saved')||'[]'));dense=localStorage.getItem('flash-ui-ecosystem-dense')==='1'}catch{saved=new Set()}
const findGroup=id=>groups.find(g=>g.id===id||g.ids.has(id));
const isSaved=g=>saved.has(g.id)||g.members.some(n=>saved.has(n.id));
function filters(){return{q:$('search').value,type:params.get('type')||'',ecosystem:$('ecosystem').value,category:$('category').value,maturity:$('maturity').value,linkage:$('linkage').value,collection:params.get('collection')||''}}
function sync(){for(const[k,v]of Object.entries({...filters(),sort:$('sort').value,asset:active})){if(v)params.set(k,v);else params.delete(k)}history.replaceState(null,'',location.pathname+(params.size?'?'+params:''))}
function optionList(id,values){const select=$(id);for(const v of [...new Set(values.filter(Boolean))].sort()){const o=el('option','',v);o.value=v;select.append(o)}select.value=params.get(id)||''}
function button(txt,pressed,fn){const b=el('button',pressed?'selected':'',txt);b.type='button';b.setAttribute('aria-pressed',String(!!pressed));b.addEventListener('click',fn);return b}
function link(text,url){const uri=safeUrl(url);if(!uri)return null;const a=el('a','action',text);a.href=uri;if(!url.startsWith('/')){a.target='_blank';a.rel='noopener noreferrer'}return a}
function setup(){
  optionList('ecosystem',graph.nodes.map(n=>n.ecosystem));optionList('category',graph.nodes.map(n=>n.category));optionList('maturity',graph.nodes.map(n=>n.maturity));
  $('search').value=params.get('q')||'';$('linkage').value=params.get('linkage')||'';$('sort').value=params.get('sort')||'name';
  const types=[['','All types'],...Object.entries(labels).filter(([type])=>graph.nodes.some(n=>n.type===type))];
  for(const [type,name]of types)$('typeFilters').append(button(name,(params.get('type')||'')===type,()=>{if(type)params.set('type',type);else params.delete('type');pageSize=80;render()}));
  const collections=[['','All assets'],['built-ideas','Ideas with builds'],['widgets','Widgets & calculators'],['variations','Site variations'],['repos-no-deploy','Repos without deployment'],['vercel-repos','Projects + repos'],['gpts','Recorded GPT links']];
  for(const [key,name]of collections)$('collections').append(button(name,(params.get('collection')||'')===key,()=>{if(key)params.set('collection',key);else params.delete('collection');pageSize=80;render()}));
  for(const id of ['search','ecosystem','category','maturity','linkage','sort'])$(id).addEventListener(id==='search'?'input':'change',()=>{pageSize=80;render()});
  $('viewToggle').addEventListener('click',()=>{dense=!dense;localStorage.setItem('flash-ui-ecosystem-dense',dense?'1':'0');render()});
  $('savedOnly').addEventListener('click',()=>{onlySaved=!onlySaved;render()});
  $('reset').addEventListener('click',()=>{params.delete('type');params.delete('collection');for(const id of ['search','ecosystem','category','maturity','linkage'])$(id).value='';onlySaved=false;pageSize=80;render()})
}
function relationCount(g){return graph.edges.filter(e=>g.ids.has(e.from)||g.ids.has(e.to)).length}
function showDetail(){
  const box=$('detail');box.replaceChildren();const g=findGroup(active);
  if(!g){box.append(el('p','state','Select a product to see all its available sources.'));return}
  box.append(el('p','eyebrow',g.members.length>1?'CONNECTED PRODUCT':'ASSET DETAIL'),el('h2','',g.name));
  const tags=el('div','product-tags');for(const type of g.types)tags.append(el('span','',labels[type]||type));box.append(tags);
  if(g.summary)box.append(el('p','summary',g.summary));
  if(g.matchCount)box.append(el('p','match-note',g.matchCount+' exact-name match'+(g.matchCount!==1?'es':'')+'; confirm identity before treating these as the same product.'));
  const actions=el('div','detail-actions');actions.append(button(isSaved(g)?'★ Saved':'☆ Save',isSaved(g),()=>{const ids=g.members.map(n=>n.id);if(isSaved(g)){saved.delete(g.id);ids.forEach(id=>saved.delete(id))}else saved.add(g.id);localStorage.setItem('flash-ui-ecosystem-saved',JSON.stringify([...saved]));render()}));actions.append(button('Copy product ID',false,()=>navigator.clipboard.writeText(g.id)));box.append(actions);
  const heading=el('div','source-heading');heading.append(el('h3','',g.members.length>1?'Connected sources':'Available source'),el('span','source-meta',g.members.length+' record'+(g.members.length!==1?'s':'')));box.append(heading);
  const sources=el('div','source-list');
  for(const n of g.members){const card=el('section','source-card');card.append(el('span','source-kind',label(n)),el('h4','',n.name));if(n.summary&&n.summary!==g.summary)card.append(el('p','',n.summary));const meta=[n.maturity,n.urlStatus&&'URL status: '+n.urlStatus,n.source].filter(Boolean).join(' · ');card.append(el('div','source-meta',meta));const action=link(n.type==='idea'?'Explore idea':n.type==='template'?'Use template':n.type==='vercel'?'Open recorded URL':n.type==='github'?'Open repository':n.type==='gpt'?'Open GPT':n.type==='site'?'Open site':'Open source',n.url);if(action)card.append(action);sources.append(card)}box.append(sources);
  const related=graph.edges.filter(e=>g.ids.has(e.from)||g.ids.has(e.to));const external=related.filter(e=>!(g.ids.has(e.from)&&g.ids.has(e.to)));
  box.append(el('h3','','Other recorded relationships'));
  if(!external.length){box.append(el('p','state',related.length?'All recorded relationships are already represented above.':'No further recorded relationships.'));return}
  const list=el('ul','relations');
  for(const edge of external){const other=graph.nodes.find(n=>n.id===(g.ids.has(edge.from)?edge.to:edge.from));if(!other)continue;const item=el('li');item.append(button(other.name,false,()=>{active=findGroup(other.id)?.id||other.id;render()}),el('span','',edge.type.replaceAll('_',' ')+' · '+edge.status),el('small','',edge.provenance));list.append(item)}box.append(list)
}
function render(){
  sync();
  const selected=params.get('type')||'';
  for(const b of document.querySelectorAll('#typeFilters button')){const type=Object.entries(labels).find(([,name])=>name===b.textContent)?.[0]||'';const pressed=selected===type;b.classList.toggle('selected',pressed);b.setAttribute('aria-pressed',String(pressed))}
  const collection=params.get('collection')||'',keys=['','built-ideas','widgets','variations','repos-no-deploy','vercel-repos','gpts'];
  [...document.querySelectorAll('#collections button')].forEach((b,i)=>b.classList.toggle('selected',collection===keys[i]));
  $('viewToggle').setAttribute('aria-pressed',String(dense));$('savedOnly').setAttribute('aria-pressed',String(onlySaved));
  const matched=new Set(filterAssets(graph.nodes,graph.edges,filters()).map(n=>n.id));
  let items=groups.filter(g=>g.members.some(n=>matched.has(n.id))&&(!onlySaved||isSaved(g)));
  const sort=$('sort').value;items.sort((a,b)=>sort==='links'?relationCount(b)-relationCount(a)||a.name.localeCompare(b.name):sort==='type'?a.primary.type.localeCompare(b.primary.type)||a.name.localeCompare(b.name):a.name.localeCompare(b.name));
  $('visibleCount').textContent=items.length+' of '+groups.length+' products';
  $('totalCount').textContent=groups.length+' products · '+graph.nodes.length+' source records';
  const list=$('resultsList');list.replaceChildren();list.classList.toggle('dense',dense);list.setAttribute('aria-busy','false');
  if(!items.length)list.append(el('p','state','No products match these filters. Clear filters or try a broader search.'));
  for(const g of items.slice(0,pageSize)){
    const row=el('button','asset-row');row.type='button';row.classList.toggle('active',findGroup(active)?.id===g.id);
    row.append(el('span','asset-type',g.types.map(t=>labels[t]||t).join(' · ')));
    const body=el('span','asset-body');body.append(el('strong','',g.name));if(g.summary&&!dense)body.append(el('small','',g.summary));row.append(body,el('span','asset-links',g.members.length>1?g.members.length+' sources':''));
    row.addEventListener('click',()=>{active=g.id;render();if(matchMedia('(max-width:1020px)').matches)$('detail').scrollIntoView({behavior:'smooth'})});list.append(row)
  }
  if(items.length>pageSize)list.append(button('Show more ('+(items.length-pageSize)+' remaining)',false,()=>{pageSize+=80;render()}));
  if(!findGroup(active)&&items.length)active=items[0].id;
  showDetail()
}
try{const res=await fetch('/data/asset-graph.public.json');if(!res.ok)throw Error('HTTP '+res.status);graph=await res.json();groups=groupAssets(graph.nodes,graph.edges);groupByNode=new Map(groups.flatMap(g=>g.members.map(n=>[n.id,g])));setup();render()}catch(error){console.error(error);$('resultsList').replaceChildren(el('p','state','Asset catalog unavailable. Refresh to retry.'));$('totalCount').textContent='Catalog unavailable'}
