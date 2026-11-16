(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let all = [];
  const clean = v => String(v ?? '').toLocaleLowerCase();
  const toolType = item => /calculator|assessment|generator|quiz|directory|widget|tool|decision|funnel/i.test(`${item.asset_type} ${item.archetype}`);
  const option = (value,label) => {const el=document.createElement('option');el.value=value;el.textContent=label;return el;};
  function fillSelect(id,values) { for(const v of [...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b))) $(id).append(option(v,v)); }
  function render() {
    const term = clean($('search').value.trim());const cat=$('category').value;const type=$('type').value;const sort=$('sort').value;
    const audience = clean($('audience').value.trim()); const buildStatus = $('buildStatus').value;
    const matches = all.filter(item => (!term || clean([item.title,item.summary,item.category,item.asset_type,item.archetype,item.target_audience].join(' ')).includes(term)) && (cat==='all'||item.category===cat) && (type==='all'||item.asset_type===type) && (!audience || clean(item.target_audience).includes(audience)) && (buildStatus==='all'||item.development_status===buildStatus) && (!$('toolsOnly').checked||toolType(item)) && (!$('linkedOnly').checked||!!item.live_path));
    matches.sort((a,b)=>clean(a[sort==='category'?'category':sort==='type'?'asset_type':'title']).localeCompare(clean(b[sort==='category'?'category':sort==='type'?'asset_type':'title']))||a.title.localeCompare(b.title));
    const frag=document.createDocumentFragment();
    for(const item of matches) {
      const card=document.createElement('article'); card.className='card';
      const kind=document.createElement('span');kind.className='type';kind.textContent=item.asset_type||'Idea';card.append(kind);
      const title=document.createElement('h3'); title.textContent=item.title;card.append(title);
      const summary=document.createElement('p');summary.textContent=item.summary||'Explore a proposed digital product concept.';card.append(summary);
      const indicators=document.createElement('div');indicators.className='card-indicators';
      if(item.live_path){const badge=document.createElement('span');badge.textContent='Recorded portfolio site';indicators.append(badge);}
      if(toolType(item)){const badge=document.createElement('span');badge.textContent='Tool concept';indicators.append(badge);}
      card.append(indicators);
      const actions=document.createElement('div');actions.className='card-actions';
      for(const [label,href] of [['Explore idea',item.detail_url],['Customize prompt',`/workbench/?idea=${encodeURIComponent(item.id)}&mode=remix`],...(item.live_path?[['Open related site',item.live_path]]:[])]){
        const link=document.createElement('a');link.textContent=label;link.href=href;actions.append(link);
      }
      card.append(actions);frag.append(card);
    }
    $('ideas').replaceChildren(frag);
    $('count').textContent=`${matches.length} ${matches.length===1?'idea':'ideas'} available`;
    $('empty').hidden=matches.length>0;
    $('empty').textContent = all.length ? 'No ideas match these filters.' : 'No public ideas are available yet.';
  }
  async function init() {
    try {
      const r=await fetch('/data/ideas-discovery-index.json',{cache:'no-store'});
      if(!r.ok) throw new Error('Ideas index unavailable');
      const d=await r.json();if(!Array.isArray(d.ideas))throw new Error('Invalid ideas index');
      all=d.ideas.filter(x=>x&&x.id&&x.title);
      fillSelect('category',all.map(x=>x.category));fillSelect('type',all.map(x=>x.asset_type));fillSelect('buildStatus',all.map(x=>x.development_status));
      $('toolsOnly').checked=new URLSearchParams(location.search).get('focus')==='tools';render();
      for (const id of ['search','category','type','sort','audience','buildStatus','toolsOnly','linkedOnly']) $(id).addEventListener(['search','audience'].includes(id)?'input':'change',render);
    } catch(err) { $('count').textContent='Ideas unavailable';$('empty').hidden=false;$('empty').textContent='The ideas catalog could not be loaded. Try the Site Generator.';}
  }
  init();
})();
