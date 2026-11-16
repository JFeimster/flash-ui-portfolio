const $=id=>document.getElementById(id);
const state={entries:[],counts:{},visible:24,favorites:new Set(),list:false,loaded:false,prompt:null,selected:null,cache:{}};
const PER_PAGE=24;
function node(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=String(text);return n;}
function value(id){return $(id).value;}
function option(select,value,label){const o=node('option','',label);o.value=value;select.append(o);}
function populate(id,values){const select=$(id);[...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b)).forEach(x=>option(select,x,x));}
function restoreFavorites(){try{const saved=JSON.parse(localStorage.getItem('flash-ui-idea-favorites-v1')||'[]');if(Array.isArray(saved))state.favorites=new Set(saved.filter(x=>typeof x==='string'));}catch{}}
function saveFavorites(){try{localStorage.setItem('flash-ui-idea-favorites-v1',JSON.stringify([...state.favorites]));}catch{}}
function toggleFavorite(id){if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);saveFavorites();render();}
function syncUrl(){const u=new URL(location.href);for(const id of ['q','source','type','brand','style','group','sort']){const v=value(id);if(v&&(id!=='sort'||v!=='name'))u.searchParams.set(id,v);else u.searchParams.delete(id);}if($('onlySaved').getAttribute('aria-pressed')==='true')u.searchParams.set('saved','1');else u.searchParams.delete('saved');if(state.list)u.searchParams.set('view','list');else u.searchParams.delete('view');history.replaceState(null,'',u.pathname+u.search+u.hash);}
function restoreUrl(){const p=new URLSearchParams(location.search);for(const id of ['q','source','type','brand','style','group','sort']){const v=p.get(id);if(v&&[...$(id).options||[]].some(o=>o.value===v))$(id).value=v;else if(id==='q'&&v)$('q').value=v;}$('onlySaved').setAttribute('aria-pressed',p.get('saved')==='1'?'true':'false');state.list=p.get('view')==='list';$('viewToggle').setAttribute('aria-pressed',state.list?'true':'false');$('viewToggle').textContent=state.list?'Grid view':'List view';}
function eligible(item){const term=value('q').toLowerCase().trim(),src=value('source'),type=value('type'),brand=value('brand'),style=value('style'),group=value('group');if(src&&item.source!==src)return false;if(type&&item.type!==type)return false;if(brand&&item.brand!==brand)return false;if(style&&item.visual_style!==style)return false;if(group&&item.source_group!==group)return false;if($('onlySaved').getAttribute('aria-pressed')==='true'&&!state.favorites.has(item.id))return false;if(term&&!term.split(/\s+/).every(w=>item.search_text.includes(w)))return false;return true;}
function sorted(items){const mode=value('sort');return items.sort((a,b)=>mode==='reverse'?b.name.localeCompare(a.name):mode==='external'?(b.source==='external')-(a.source==='external')||a.name.localeCompare(b.name):mode==='canonical'?(b.source==='canonical')-(a.source==='canonical')||a.name.localeCompare(b.name):a.name.localeCompare(b.name));}
function paragraph(className,text){return node('p',className,text);}
function makeCard(item){const card=node('article','idea-card');card.dataset.ideaId=item.id;
 const top=node('div','card-top');const badge=node('span','source-badge '+(item.source==='canonical'?'core':'external'),item.source==='canonical'?'◆ CANONICAL':'✦ EXTERNAL');top.append(badge);
 const fav=node('button','favorite',state.favorites.has(item.id)?'★':'☆');fav.type='button';fav.setAttribute('aria-label',(state.favorites.has(item.id)?'Remove saved idea: ':'Save idea: ')+item.name);fav.setAttribute('aria-pressed',state.favorites.has(item.id)?'true':'false');fav.addEventListener('click',()=>toggleFavorite(item.id));top.append(fav);
 const title=node('h3','',item.name),text=paragraph('description',item.summary||item.use_case||'Explore the original concept and build prompt.');
 const chips=node('div','chip-row');for(const tag of [item.type,item.brand,item.visual_style].filter(Boolean).slice(0,3))chips.append(node('span','chip',tag));
 const foot=node('div','card-footer');const variants=item.external_prompt_ids.length+(item.canonical_prompt_id?1:0);
 foot.append(paragraph('variant-count',variants>1?variants+' prompt directions':variants+' full prompt'));
 const btn=node('button','view-prompt','View prompt ↗');btn.type='button';btn.addEventListener('click',()=>openPrompt(item));foot.append(btn);
 if(item.source==='canonical'&&item.kind==='site-idea'){const detail=node('a','idea-detail-link','Explore idea ↗');detail.href='/ideas/'+encodeURIComponent(item.id)+'/';const remix=node('a','idea-remix-link','Customize prompt');remix.href='/workbench/?idea='+encodeURIComponent(item.id)+'&mode=remix';foot.append(detail,remix);}
 card.append(top,title,text,chips,foot);return card;}
function render(){if(!state.loaded)return;const matches=sorted(state.entries.filter(eligible));$('count').textContent=matches.length+' matching ideas / '+state.entries.length+' total';$('empty').hidden=matches.length>0;$('loadMore').hidden=matches.length<=state.visible;
 const grid=$('ideaGrid');grid.classList.toggle('list-view',state.list);const fragment=document.createDocumentFragment();for(const item of matches.slice(0,state.visible))fragment.append(makeCard(item));grid.replaceChildren(fragment);syncUrl();}
function reset(){for(const id of ['q','source','type','brand','style','group'])$(id).value='';$('sort').value='name';$('onlySaved').setAttribute('aria-pressed','false');state.visible=PER_PAGE;render();$('q').focus();}
async function getSource(which){if(state.cache[which])return state.cache[which];const url=which==='canonical'?'/data/site-generator-public.json':'/data/external-prompt-library.json';const r=await fetch(url);if(!r.ok)throw Error('Prompt source unavailable');const v=await r.json();state.cache[which]=v;return v;}
async function showPromptVersion(){const selected=state.selected;const choice=value('variant');$('copyStatus').textContent='';$('promptText').textContent='Loading prompt…';$('copyPrompt').disabled=true;
 try{let record;if(choice==='canonical'){const library=await getSource('canonical');record=library.entries.find(x=>x.id===selected.canonical_prompt_id);state.prompt=record?.prompt;}else{const library=await getSource('external');record=library.items.find(x=>x.id===choice.slice('external:'.length));state.prompt=record?.flash_ui_prompt;}
  if(!state.prompt)throw Error('Prompt not found');
  $('promptText').textContent=state.prompt;$('copyPrompt').disabled=false;
  const canonical=selected.canonical_prompt_id;$('openGenerator').href=canonical?'/generator/?source='+encodeURIComponent(canonical):'/generator/';
  $('openGenerator').textContent=canonical?'Open canonical in generator ↗':'Open generator to paste ↗';
 }catch(error){state.prompt=null;$('promptText').textContent='This source prompt could not be loaded. Please try again.';$('copyStatus').textContent=error.message;}}
async function openPrompt(item){state.selected=item;state.prompt=null;$('dialogTitle').textContent=item.name;$('dialogMeta').textContent=item.source==='canonical'?'CANONICAL CONCEPT + SOURCE VERSIONS':'EXTERNAL PROMPT LIBRARY';$('dialogSummary').textContent=item.use_case||item.summary;
 const select=$('variant');select.replaceChildren();if(item.canonical_prompt_id)option(select,'canonical','Canonical generator prompt');for(const id of item.external_prompt_ids)option(select,'external:'+id,'External library · '+id);$('promptDialog').showModal();await showPromptVersion();}
async function copyPrompt(){if(!state.prompt)return;try{await navigator.clipboard.writeText(state.prompt);$('copyStatus').textContent='Full prompt copied.';}catch{$('copyStatus').textContent='Clipboard blocked: select the text in the panel to copy manually.';$('promptText').focus();}}
async function boot(){restoreFavorites();try{const response=await fetch('/data/idea-directory.json');if(!response.ok)throw Error('No catalog');const data=await response.json();if(!Array.isArray(data.entries)||data.counts?.visible_concepts!==data.entries.length)throw Error('Invalid catalog');state.entries=data.entries;state.counts=data.counts;
 $('totalIdeas').textContent=data.counts.visible_concepts;$('canonicalCount').textContent=data.counts.canonical;$('externalCount').textContent=data.counts.external_prompts;
 populate('type',state.entries.map(x=>x.type));populate('brand',state.entries.map(x=>x.brand));populate('style',state.entries.map(x=>x.visual_style));populate('group',state.entries.map(x=>x.source_group));restoreUrl();state.loaded=true;render();
 }catch(e){$('count').textContent='Catalog unavailable';$('error').hidden=false;}}
for(const id of ['q','source','type','brand','style','group','sort'])$(id).addEventListener(id==='q'?'input':'change',()=>{state.visible=PER_PAGE;render();});
$('clear').addEventListener('click',reset);$('clearEmpty').addEventListener('click',reset);$('loadMore').addEventListener('click',()=>{state.visible+=PER_PAGE;render();});
$('onlySaved').addEventListener('click',()=>{$('onlySaved').setAttribute('aria-pressed',$('onlySaved').getAttribute('aria-pressed')==='true'?'false':'true');state.visible=PER_PAGE;render();});
$('viewToggle').addEventListener('click',()=>{state.list=!state.list;$('viewToggle').textContent=state.list?'Grid view':'List view';$('viewToggle').setAttribute('aria-pressed',state.list?'true':'false');render();});
$('variant').addEventListener('change',showPromptVersion);$('copyPrompt').addEventListener('click',copyPrompt);$('closeDialog').addEventListener('click',()=>$('promptDialog').close());
$('promptDialog').addEventListener('click',e=>{if(e.target===$('promptDialog'))$('promptDialog').close();});
boot();
