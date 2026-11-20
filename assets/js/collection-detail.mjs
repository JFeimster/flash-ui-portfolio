// Generic product-collection explorer. Specs remain sourced from their own JSON registry.
const $=id=>document.getElementById(id);
const make=(tag,cls,content)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(content!==undefined)e.textContent=content;return e};
const collectionId=document.body.dataset.collectionId;
const query=new URLSearchParams(location.search);
let entries=[],selected='';
function itemList(root,title,items){const heading=make('h3','',title);root.append(heading);const ul=make('ul','spec-list');for(const value of items||[])ul.append(make('li','',String(value)));root.append(ul)}
function show(item){
 const inspector=$('inspector');inspector.replaceChildren();
 if(!item){inspector.append(make('p','note','No matching idea. Clear filters to browse the full collection.'));return}
 inspector.append(make('p','eyebrow',item.status==='functional-prototype'?'WORKING DEMO':'PRODUCT CONCEPT'));
 inspector.append(make('h2','',item.title),make('p','note',item.description),make('p','note','Audience: '+item.targetAudience));
 itemList(inspector,'Inputs required',item.functionalSpec.inputs);
 itemList(inspector,'Product workflow',item.functionalSpec.workflow);
 itemList(inspector,'Outputs',item.functionalSpec.outputs);
 itemList(inspector,'Acceptance criteria',item.functionalSpec.acceptanceCriteria);
 itemList(inspector,'Integrations to verify',item.integrationRequirements);
 itemList(inspector,'Revenue model',item.monetization);
 itemList(inspector,'Safeguards',item.safety);
 const actions=make('div','calc-actions');
 if(item.demoPath){const a=make('a','primary','Launch working prototype ↗');a.href=item.demoPath;actions.append(a)}
 const copy=make('button','','Copy complete specification');copy.type='button';
 copy.addEventListener('click',async()=>{const txt=JSON.stringify(item,null,2);try{await navigator.clipboard.writeText(txt);copy.textContent='Copied specification'}catch{copy.textContent='Clipboard unavailable; use browser selection instead'}});
 actions.append(copy);inspector.append(actions);
 inspector.append(make('p','note','Status: '+item.status+' · Search evidence: '+item.seo.searchEvidence+'. No externally connected provider or guaranteed result.'));
}
function filter(){
 const words=$('search').value.trim().toLowerCase().split(/\s+/).filter(Boolean),status=$('filter').value;
 const matches=entries.filter(e=>(!status||e.status===status)&&words.every(w=>[e.title,e.description,e.targetAudience,e.category,...e.functionalSpec.inputs,...e.functionalSpec.outputs,...e.monetization].join(' ').toLowerCase().includes(w)));
 $('count').textContent=matches.length+' of '+entries.length+' product ideas';
 const results=$('cards');results.replaceChildren();
 const current=matches.find(e=>e.id===selected)||matches[0];selected=current?.id||'';
 for(const item of matches){
  const button=make('button','item idea-card');button.type='button';button.classList.toggle('is-selected',item.id===selected);button.setAttribute('aria-pressed',String(item.id===selected));
  button.append(make('span','tag',item.status==='functional-prototype'?'Working tool':'Concept / implementation spec'),make('strong','',item.title),make('p','',item.description),make('span','note',item.productType+' · '+item.monetization.length+' revenue paths'));
  button.addEventListener('click',()=>{selected=item.id;filter();const u=new URL(location.href);u.searchParams.set('idea',selected);history.replaceState(null,'',u.pathname+u.search);if(matchMedia('(max-width:900px)').matches)$('inspector').scrollIntoView({behavior:'smooth',block:'start'})});
  results.append(button)
 }
 if(!matches.length)results.append(make('p','empty','No matching ideas. Change the search or status filter.'));
 show(current);
}
async function init(){
 try{
  const response=await fetch('/data/collections/'+encodeURIComponent(collectionId)+'.json');if(!response.ok)throw Error('Collection data could not be loaded.');
  const catalog=await response.json();if(catalog.schema!=='flash-ui-product-collection/v1'||catalog.id!==collectionId||catalog.count!==catalog.entries?.length)throw Error('Invalid collection registry.');
  entries=catalog.entries;selected=query.get('idea')||'';
  $('search').value=query.get('q')||'';if(['concept','functional-prototype'].includes(query.get('status')))$('filter').value=query.get('status');
  $('search').addEventListener('input',()=>{filter();const u=new URL(location.href);if($('search').value)u.searchParams.set('q',$('search').value);else u.searchParams.delete('q');history.replaceState(null,'',u.pathname+u.search)});
  $('filter').addEventListener('change',filter);
  $('reset').addEventListener('click',()=>{$('search').value='';$('filter').value='';selected='';history.replaceState(null,'',location.pathname);filter()});
  filter();
 }catch(error){$('count').textContent='Collection unavailable';$('inspector').textContent=error.message}
}
init();
