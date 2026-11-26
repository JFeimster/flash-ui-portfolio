import { filterAssets } from './asset-explorer-core.mjs';
import { groupAssets, possibleMatches } from './asset-groups.mjs';
import {normalizeCatalog} from './catalog-core.mjs';
import {recommendReuse,integrationAdvice,mcpAdvice,compareAssets} from './asset-intelligence-core.mjs';
const labels={idea:'Ideas',template:'Design Templates',site:'Sites',github:'Repositories',vercel:'Vercel Projects',tool:'Prompt Recipes',gpt:'GPTs',capability:'Plugins / MCP / API'};
const params=new URLSearchParams(location.search),$=id=>document.getElementById(id);
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n};
const safeUrl=url=>{try{const u=new URL(url,location.origin);return (url.startsWith('/')&&!url.startsWith('//')&&u.origin===location.origin)||(url.startsWith('https://')&&u.protocol==='https:')?u.href:null}catch{return null}};
const label=n=>labels[n.type]||n.type;
let graph={nodes:[],edges:[]},groups=[],suggestedLinks=[],active=params.get('asset')||'',saved=new Set(),dense=false,onlySaved=false,pageSize=80,catalogRows=[],integrations=[],compareId='',views=[];
try{saved=new Set(JSON.parse(localStorage.getItem('flash-ui-ecosystem-saved')||'[]'));dense=localStorage.getItem('flash-ui-ecosystem-dense')==='1'}catch{saved=new Set()}
try{views=JSON.parse(localStorage.getItem('flash-ui-ecosystem-views')||'[]');if(!Array.isArray(views))views=[]}catch{views=[]}
const catalogFor=g=>catalogRows.find(row=>g.members.some(node=>node.id==='site:'+row.id));
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
  optionList('capability',catalogRows.flatMap(row=>row.catalog?.capabilities||[]));$('capability').addEventListener('change',render);optionList('theme',catalogRows.flatMap(row=>row.catalog?.designThemeIds||[]));$('theme').addEventListener('change',render);
  const renderViews=()=>{const selected=$('savedViews').value;$('savedViews').replaceChildren();const blank=el('option','','Choose a saved view');blank.value='';$('savedViews').append(blank);views.forEach((view,index)=>{const option=el('option','',view.name);option.value=String(index);$('savedViews').append(option)});$('savedViews').value=selected};renderViews();
  $('saveView').addEventListener('click',()=>{const name=prompt('Name this filter view');if(!name?.trim())return;views.push({name:name.trim().slice(0,80),filters:{...filters(),capability:$('capability').value,theme:$('theme').value,sort:$('sort').value}});localStorage.setItem('flash-ui-ecosystem-views',JSON.stringify(views));renderViews();$('savedViews').value=String(views.length-1)});
  $('savedViews').addEventListener('change',()=>{const view=views[Number($('savedViews').value)];if(!view)return;const f=view.filters;for(const id of ['ecosystem','category','maturity','linkage','capability','theme','sort'])$(id).value=f[id]||'';$('search').value=f.q||'';if(f.type)params.set('type',f.type);else params.delete('type');if(f.collection)params.set('collection',f.collection);else params.delete('collection');render()});
  $('deleteView').addEventListener('click',()=>{const selected=$('savedViews').value;if(selected==='')return;views.splice(Number(selected),1);localStorage.setItem('flash-ui-ecosystem-views',JSON.stringify(views));$('savedViews').value='';renderViews()});
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
  const catalog=catalogFor(g);
  if(catalog){const meta=el('div','intelligence-meta');meta.append(el('span','eyebrow','CATALOG V2 / SOURCE PROVENANCE'));for(const [label,value] of [['Category',catalog.catalog.productCategory],['Audience',(catalog.catalog.audiences||[]).join(', ')],['Repository',catalog.catalog.repositoryUrl],['Production',catalog.catalog.productionUrl],['Source',catalog.item?.source]])if(value){const line=el('p','',`${label}: ${value}`);meta.append(line)}box.append(meta)}
  if(catalog?.catalog?.frameworkImplementations?.length){box.append(el('h3','','Framework implementations'));const implementations=el('div','variant-strip');for(const item of catalog.catalog.frameworkImplementations){const card=el('div','variant-tile');card.append(el('strong','',item.name||item.archiveName||'Implementation'),el('small','',(item.frameworks||[]).join(', ')));const packageNames=(item.packageMetadata||[]).map(pkg=>pkg.name&&`${pkg.name}${pkg.version?` v${pkg.version}`:''}`).filter(Boolean);if(packageNames.length)card.append(el('small','',packageNames.join(', ')));card.append(el('small','source-meta','Cataloged source implementation; not deployed.'));implementations.append(card)}box.append(implementations)}
  if(g.matchCount)box.append(el('p','match-note',g.matchCount+' evidence-backed identity link'+(g.matchCount!==1?'s':'')+' connecting these public source records.'));
  const actions=el('div','detail-actions');actions.append(button(isSaved(g)?'★ Saved':'☆ Save',isSaved(g),()=>{const ids=g.members.map(n=>n.id);if(isSaved(g)){saved.delete(g.id);ids.forEach(id=>saved.delete(id))}else saved.add(g.id);localStorage.setItem('flash-ui-ecosystem-saved',JSON.stringify([...saved]));render()}));actions.append(button('Copy product ID',false,()=>navigator.clipboard.writeText(g.id)));box.append(actions);
  const heading=el('div','source-heading');heading.append(el('h3','',g.members.length>1?'Connected sources':'Available source'),el('span','source-meta',g.members.length+' record'+(g.members.length!==1?'s':'')));box.append(heading);
  const sources=el('div','source-list');
  for(const n of g.members){const card=el('section','source-card');card.append(el('span','source-kind',label(n)),el('h4','',n.name));if(n.summary&&n.summary!==g.summary)card.append(el('p','',n.summary));const evidence=graph.edges.filter(e=>(e.from===n.id||e.to===n.id)&&g.ids.has(e.from)&&g.ids.has(e.to));if(evidence.length)card.append(el('p','source-meta',evidence.map(e=>e.type.replaceAll('_',' ')+' · '+e.status+' · '+e.provenance).join(' | ')));const meta=[n.maturity,n.urlStatus&&'URL status: '+n.urlStatus,n.source].filter(Boolean).join(' · ');card.append(el('div','source-meta',meta));const action=link(n.type==='idea'?'Explore idea':n.type==='template'?'Use template':n.type==='vercel'?'Open recorded URL (not live-verified)':n.type==='github'?'Open repository':n.type==='gpt'?'Open GPT':n.type==='site'?'Open site':'Open source',n.url);if(action)card.append(action);sources.append(card)}box.append(sources);
  const related=graph.edges.filter(e=>g.ids.has(e.from)||g.ids.has(e.to));const external=related.filter(e=>!(g.ids.has(e.from)&&g.ids.has(e.to)));
  box.append(el('h3','','Other recorded relationships'));
  if(!external.length){box.append(el('p','state',related.length?'All recorded relationships are already represented above.':'No further recorded relationships.'));}
  const list=el('ul','relations');
  for(const edge of external){const other=graph.nodes.find(n=>n.id===(g.ids.has(edge.from)?edge.to:edge.from));if(!other)continue;const item=el('li');item.append(button(other.name,false,()=>{active=findGroup(other.id)?.id||other.id;render()}),el('span','',edge.type.replaceAll('_',' ')+' · '+edge.status),el('small','',edge.provenance));list.append(item)}if(external.length)box.append(list);
  if(catalog){
    if(catalog.variants?.length){box.append(el('h3','','Recorded variants'));const variants=el('div','variant-strip');for(const variant of catalog.variants){const card=el('div','variant-tile');if(variant.preview?.image){const img=el('img');img.src=variant.preview.image;img.alt=`Preview of ${catalog.title} variant ${variant.variantNumber}`;img.loading='lazy';card.append(img)}card.append(el('strong','',`Variant ${variant.variantNumber}`),el('small','',(variant.designThemeIds||[]).join(', ')||'Theme unrecorded'));const a=link('Open variant',variant.resolvedPath);if(a)card.append(a);variants.append(card)}box.append(variants)}
    const reuse=recommendReuse(catalog,catalogRows);box.append(el('h3','','Reuse recommendations'));if(!reuse.length)box.append(el('p','state','No catalog overlap recorded yet.'));for(const item of reuse){const panel=el('div','suggestion-card');panel.append(el('strong','',item.row.title),el('small','',item.reasons.map(r=>`${r.label}: ${r.values.join(', ')}`).join(' · ')));const a=link('Open project',item.row.path);if(a)panel.append(a);box.append(panel)}
    const comparison=el('section','comparison');comparison.append(el('h3','','Side-by-side comparison'));const choose=el('select');choose.setAttribute('aria-label','Choose asset to compare');const blank=el('option','','Choose another asset');blank.value='';choose.append(blank);for(const row of catalogRows.filter(row=>row.id!==catalog.id&&row.path).sort((a,b)=>a.title.localeCompare(b.title))){const option=el('option','',row.title);option.value=row.id;choose.append(option)}choose.value=compareId;choose.addEventListener('change',()=>{compareId=choose.value;showDetail()});comparison.append(choose);const other=catalogRows.find(row=>row.id===compareId);if(other){const table=el('table');const head=el('tr');for(const title of ['Field',catalog.title,other.title])head.append(el('th','',title));table.append(head);for(const line of compareAssets(catalog,other)){const tr=el('tr');for(const value of [line.label,line.left,line.right])tr.append(el('td','',value));table.append(tr)}comparison.append(table)}box.append(comparison);
    const advice=integrationAdvice(catalog,integrations),mcp=mcpAdvice(catalog);box.append(el('h3','','Integration & MCP Advisor'),el('p','source-meta','Planning suggestions from recorded catalog fields. No live service or MCP connection is verified.'));if(!advice.length&&!mcp.length)box.append(el('p','state','No integration need inferred from the current record.'));for(const item of [...advice,...mcp]){const panel=el('div','suggestion-card');panel.append(el('strong','',item.name),el('small','',`${item.reason} ${item.status}`));box.append(panel)}
    const handoff=el('div','handoff-links');for(const [label,url] of [['Use this asset','/use-asset/?asset='+encodeURIComponent(catalog.previewPath||catalog.path)],['Build package','/build/?asset='+encodeURIComponent(catalog.previewPath||catalog.path)],['Generator','/generator/?asset='+encodeURIComponent(catalog.id)]]){const a=link(label,url);if(a)handoff.append(a)}box.append(handoff);
  }
  const candidates=possibleMatches(g,groups,suggestedLinks);
  if(candidates.length){box.append(el('h3','','Possible matches — unconfirmed'));
    box.append(el('p','source-meta','Matching names or suggested connections are not proof that these are the same product.'));
    const suggestions=el('ul','relations');
    for(const candidate of candidates){const item=el('li');
      item.append(button(candidate.group.name,false,()=>{active=candidate.group.id;render()}),
        el('span','','suggested · not grouped'),el('small','',candidate.provenance));suggestions.append(item)}
    box.append(suggestions);
  }
}
function render(){
  sync();
  const selected=params.get('type')||'';
  for(const b of document.querySelectorAll('#typeFilters button')){const type=Object.entries(labels).find(([,name])=>name===b.textContent)?.[0]||'';const pressed=selected===type;b.classList.toggle('selected',pressed);b.setAttribute('aria-pressed',String(pressed))}
  const collection=params.get('collection')||'',keys=['','built-ideas','widgets','variations','repos-no-deploy','vercel-repos','gpts'];
  [...document.querySelectorAll('#collections button')].forEach((b,i)=>b.classList.toggle('selected',collection===keys[i]));
  $('viewToggle').setAttribute('aria-pressed',String(dense));$('savedOnly').setAttribute('aria-pressed',String(onlySaved));
  const matched=new Set(filterAssets(graph.nodes,graph.edges,filters()).map(n=>n.id));
  const query=$('search').value.trim().toLowerCase();
  let items=groups.filter(g=>{const catalog=catalogFor(g),catalogMatch=query&&catalog&&JSON.stringify([catalog.title,catalog.description,catalog.catalog,catalog.variants]).toLowerCase().includes(query);return(g.members.some(n=>matched.has(n.id))||catalogMatch)&&(!onlySaved||isSaved(g))&&(!$('capability').value||(catalog?.catalog?.capabilities||[]).includes($('capability').value))&&(!$('theme').value||(catalog?.catalog?.designThemeIds||[]).includes($('theme').value))});
  const sort=$('sort').value;items.sort((a,b)=>sort==='links'?relationCount(b)-relationCount(a)||a.name.localeCompare(b.name):sort==='type'?a.primary.type.localeCompare(b.primary.type)||a.name.localeCompare(b.name):a.name.localeCompare(b.name));
  $('visibleCount').textContent=items.length+' of '+groups.length+' products';
  $('totalCount').textContent=groups.length+' products · '+graph.nodes.length+' source records · '+groups.filter(g=>g.members.length>1).length+' linked products';
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
try{const resources=['asset-graph.public.json','asset-route-resolution.json','asset-showcase.json','asset-previews.json','transferable-design-themes.json','asset-groups.json','variant-route-contracts.json','site-generator-integrations.json'];const loaded=await Promise.all(resources.map(async name=>{const res=await fetch('/data/'+name);if(!res.ok)throw Error(name+' HTTP '+res.status);return res.json()}));const [assetGraph,routes,showcase,previews,themes,assetGroups,contracts,integrationData]=loaded;graph=assetGraph;catalogRows=normalizeCatalog({routes,showcase,previews,themes,groups:assetGroups,contracts});integrations=integrationData.integrations||[];
// The graph is a generated snapshot. Join current Catalog v2 routes at runtime so newer imports and grouped projects appear without maintaining a second registry.
const graphIds=new Set(graph.nodes.map(node=>node.id));for(const row of catalogRows){if(!row.path?.startsWith('/sites/'))continue;const id='site:'+row.id;if(graphIds.has(id))continue;graph.nodes.push({id,type:'site',name:row.title,summary:row.description,url:row.path,category:row.category,ecosystem:'',source:'asset-route-resolution + Catalog v2',maturity:'local route',variants:row.count});graphIds.add(id)}
try{const overlayRes=await fetch('/data/asset-links.public.json');if(overlayRes.ok){
  const overlay=await overlayRes.json();
  suggestedLinks=Array.isArray(overlay.relationships)?overlay.relationships.filter(e=>e.status==='suggested'&&graph.nodes.some(n=>n.id===e.from)&&graph.nodes.some(n=>n.id===e.to)):[];
}}catch(error){console.warn('Relationship suggestions unavailable',error)}
groups=groupAssets(graph.nodes,graph.edges);setup();render()}catch(error){console.error(error);$('resultsList').replaceChildren(el('p','state','Asset catalog unavailable. Refresh to retry.'));$('totalCount').textContent='Catalog unavailable'}
