// Shared static discovery for collection groups and standalone calculator concepts.
const $=id=>document.getElementById(id);
const elem=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const search=(items,q,fields)=>{const terms=q.toLowerCase().trim().split(/\s+/).filter(Boolean);return items.filter(x=>terms.every(term=>fields(x).toLowerCase().includes(term)))};
const card=(head,desc,meta,url,action)=>{const root=elem('article','item');root.append(elem('span','tag',meta),elem('h2','',head),elem('p','',desc));const foot=elem('div','footer');const a=elem('a','',action);a.href=url;foot.append(a);root.append(foot);return root};
async function init(){
 const group=document.body.dataset.collectionMode;
 try{
  const response=await fetch(group==='index'?'/data/collections-registry.json':'/data/business-calculator-ideas.json');
  if(!response.ok)throw Error('Library data unavailable');const data=await response.json();
  if(group==='index'&&(data.schema!=='flash-ui-collections/v1'||!Array.isArray(data.collections)))throw Error('Invalid collection registry');
  if(group==='calculators'&&(data.schema!=='flash-ui-business-calculators/v1'||data.entries?.length!==10))throw Error('Invalid calculator directory');
  const all=group==='index'?data.collections:data.entries;
  const categories=[...new Set(all.map(x=>group==='index'?x.category:x.status))];
  const select=$('filter');for(const c of categories.sort()){const o=elem('option','',c==='functional-prototype'?'Working tools':c==='concept'?'Concepts':c);o.value=c;select.append(o)}
  const render=()=>{
   const q=$('search').value,category=select.value;
   const matched=search(all.filter(x=>!category||x[group==='index'?'category':'status']===category),q,x=>group==='index'?[x.title,x.description,x.category,...x.tags].join(' '):[x.title,x.description,x.targetAudience,...x.functionalSpec.inputs,...x.monetization].join(' '));
   $('count').textContent=matched.length+' of '+all.length+(group==='index'?' collections':' tools and concepts');
   const cards=$('cards');cards.replaceChildren();
   for(const x of matched){
    if(group==='index')cards.append(card(x.title,x.description,x.count+' product ideas'+(x.workingCount?' · '+x.workingCount+' working tools':''),x.url,'Explore collection ↗'));
    else cards.append(card(x.title,x.description,x.status==='functional-prototype'?'Working calculator':'Concept / not built',x.demoPath||'/collections/business-calculators/?idea='+encodeURIComponent(x.id),x.demoPath?'Open calculator ↗':'View specification ↓'));
   }
   if(!matched.length)cards.append(elem('p','empty','Nothing matches. Try another search or category.'));
  };
  $('search').addEventListener('input',render);select.addEventListener('change',render);
  $('reset').addEventListener('click',()=>{$('search').value='';select.value='';render()});
  render();
  if(group==='calculators'){
   const idea=new URLSearchParams(location.search).get('idea');
   if(idea){const x=all.find(y=>y.id===idea);if(x){
     const detail=$('conceptDetail');detail.hidden=false;detail.replaceChildren();
     detail.append(elem('h2','',x.title),elem('p','',x.description));
     detail.append(elem('h3','','Inputs'));const list=elem('ul');for(const s of x.functionalSpec.inputs)list.append(elem('li','',s));detail.append(list);
     detail.append(elem('h3','','Outputs'));const outputs=elem('ul');for(const s of x.functionalSpec.outputs)outputs.append(elem('li','',s));detail.append(outputs);
     detail.append(elem('p','note',x.notes+' · This concept does not yet have a working calculator.'));
     detail.scrollIntoView({block:'nearest'});
   }}
  }
 }catch(e){$('count').textContent=e.message;$('cards').replaceChildren(elem('p','error','Unable to load catalog. '+e.message))}
}
init();
