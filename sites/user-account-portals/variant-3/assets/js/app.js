/* MOONSHINE CAPITAL / PARTNER DISPATCH
 * Static partner workspace. Fictional data only; no auth or writes.
 */
const app=document.getElementById('app');
const dialog=document.getElementById('app-dialog');
const toastZone=document.getElementById('toast-zone');
let data,statusMap;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>n==null?'Not established':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const date=s=>new Intl.DateTimeFormat('en-US',{month:'short',day:'2-digit',year:'numeric'}).format(new Date(s+'T12:00:00'));
const state={mobile:false,filter:'All',search:'',sort:'updated',resource:'All',notification:false,thread:null,draft:''};
const nav=[['overview','Overview','▦'],['submit','Submit Referral','＋'],['pipeline','Referral Pipeline','≡'],['performance','Performance','↗'],['ledger','Revenue Share','▣'],['resources','Resources & Links','◇'],['messages','Messages','◫'],['settings','Organization','⚙'],['support','Support','?']];

async function init(){
 try{
  const [d,s]=await Promise.all([
   fetch('./data/demo.json').then(r=>r.ok?r.json():Promise.reject()),
   fetch('./data/status-map.json').then(r=>r.ok?r.json():Promise.reject())
  ]);
  data=d;statusMap=s;state.thread=d.messages[0]?.id||null;
  window.addEventListener('hashchange',render);
  render();
 }catch{
  app.innerHTML='<main class="error-state"><h1>Demo data unavailable</h1><p>Serve this folder over HTTP so fixture JSON can load.</p></main>';
 }
}
function route(){const h=location.hash.replace(/^#/,'')||'/start';const p=h.split('?')[0].replace(/^\/+/,'').split('/');return{name:p[0],id:decodeURIComponent(p[1]||'')};}
function badge(status){const s=statusMap.statuses[status]||statusMap.unmappedFallback;return`<span class="status status-${esc(s.tone)}"><i class="status-dot"></i>${esc(s.label)}</span>`;}
function toast(message){const el=document.createElement('div');el.className='toast';el.textContent=message;toastZone.appendChild(el);setTimeout(()=>el.remove(),3500);}
function dialogOpen(title,body){dialog.querySelector('#dialog-body').innerHTML=`<div class="dialog-head"><h2>${esc(title)}</h2><button class="icon-button" data-action="close-dialog">×</button></div><div class="dialog-content">${body}</div>`;dialog.showModal();}

function shell(active,content){
 return `<div class="workspace"><aside class="sidebar ${state.mobile?'is-open':''}"><a class="brand" href="#/overview"><div class="brand-logomark">PD<span>///</span></div><div><strong>PARTNER</strong><small>DISPATCH</small></div></a><div class="sidebar-rule"></div><div class="sidebar-section-label mono">PARTNER / DEMO 014</div><nav class="side-nav">${nav.map(n=>`<a class="nav-item ${active===n[0]?'active':''}" href="#/${n[0]}"><b>${n[2]}</b><span>${n[1]}</span></a>`).join('')}</nav><div class="sidebar-spacer"></div><div class="sidebar-help"><span class="mono">PARTNER OPERATIONS</span><strong>Organization support</strong><button data-action="support" class="sidebar-help-link">Open support ↗</button></div></aside><div class="main-column"><header class="topbar"><div class="topbar-leading"><button class="icon-button mobile-menu" data-action="menu">☰</button><span class="crumbs mono">PARTNER WORKSPACE / ${esc(active.toUpperOfCase?active.toUpperOfCase():active)}</span></div><div class="topbar-actions"><span class="demo-pill"><i></i> DEMO · FICTIONAL DATA</span><button class="icon-button notify-button" data-action="notifications">◷${data.notifications.some(n=>n.unread)?'<em class="notification-count">1</em>':''}</button><a class="user-chip" href="#/settings"><span class="avatar">MH</span><span>Morgan H.</span></a></div></header><main class="content">${content}</main><footer class="workspace-footer"><span>PARTNER DISPATCH / DEMO</span><span>Fictional data · No live operations</span><a href="#/support">Support ↗</a></footer></div></div>${state.notification?`<div class="notification-panel">${data.notifications.map(n=>`<a class="notification ${n.unread?'unread':''}" href="${esc(n.route)}"><i></i><span><b>${esc(n.title)}</b><small>${esc(n.body)}</small><em>${date(n.date)}</em></span></a>`).join('')}<button data-action="read-notifications">Mark demo alerts read</button></div>`:''}<div class="sidebar-overlay ${state.mobile?'is-open':''}" data-action="close-menu"></div>`;
}
function head(kicker,title,sub,action=''){return`<div class="page-heading"><div><div class="page-kicker mono">${kicker}</div><h1>${title}</h1><p>${sub}</p></div>${action}</div>`;}

function start(){
 return `<div class="entry"><div class="entry-nav"><div class="entry-brand"><b class="entry-logomark">PD<span>///</span></b><span class="mono">MOONSHINE CAPITAL / PARTNER</span></div><span class="demo-pill"><i></i> DEMO · FICTIONAL DATA</span></div><div class="entry-grid"><section class="entry-intro"><div class="entry-eyebrow mono"><i class="entry-signal"></i> CHANNEL OPERATIONS / CONCEPT 003</div><h1>YOUR PARTNER<br>NETWORK<br><em>IN MOTION.</em></h1><p>Submit referrals, track organization activity and understand partner-visible outcomes.</p><div class="entry-cta"><a class="btn btn-lime" href="#/overview">Explore Demo Workspace →</a><span class="mono">NO SIGN-IN · FICTIONAL RECORDS ONLY</span></div></section><aside class="entry-visual"><div class="entry-visual-heading mono"><span>PARTNER DISPATCH</span><span>DEMO DATA</span></div><div class="entry-visual-plate"><div class="visual-alert">01 / NEXT ACTION ↗</div><div class="visual-core"><span class="mono visual-kicker">PARTNER REFERRAL</span><strong>Confirm the introduction request.</strong><p>PRT-26-1042 · Juniper Property Group</p></div><div class="visual-foot"><span class="mono">PIPELINE</span><b>RECEIVED → ROUTED → REVIEW</b></div></div></aside></div></div>`;
}
function overview(){
 const active=data.referrals.find(r=>r.status==='needs-action')||data.referrals[0];
 const qualified=data.referrals.filter(r=>r.status==='qualified').length;
 return head('COMMAND OVERVIEW / THURSDAY, 19 NOV 2026','Northstar, good to see you.','Track partner-originated opportunities and the next organization action.')+`
 <section class="dispatch"><div class="dispatch-top"><span><i class="blinker"></i> PARTNER DISPATCH / ${active.id}</span><span class="dispatch-seq">PRIORITY 01</span></div><div class="dispatch-body"><div class="dispatch-copy"><div class="dispatch-eyebrow">NEXT REQUIRED MOVE</div><h2>${esc(active.next)} <span class="dispatch-star">↗</span></h2><p>${esc(active.organization)} · ${esc(active.category)} · Partner-visible route</p><div class="dispatch-actions"><a class="btn btn-dark" href="#/referrals/${active.id}">Open Referral Dossier →</a><a class="plain-link" href="#/support">Ask partner support →</a></div></div><aside class="dispatch-meta"><span class="mono">ORGANIZATION</span><strong>${esc(data.partner.tier)}</strong><div class="dispatch-meta-line"></div><span class="mono">QUALIFIED</span><b>${qualified} fictional records</b><div class="dispatch-watermark">03</div></aside></div></section>
 <div class="overview-grid"><section class="surface progress-panel">${section('02','Organization Pipeline')}<div class="pipeline-stages"><a href="#/pipeline?status=received"><span>RECEIVED</span><strong>${data.referrals.filter(r=>r.status==='received'||r.status==='needs-action').length}</strong></a><a href="#/pipeline?status=routed"><span>ROUTED</span><strong>${data.referrals.filter(r=>r.status==='routed'||r.status==='review').length}</strong></a><a href="#/pipeline?status=qualified"><span>QUALIFIED</span><strong>${qualified}</strong></a></div></section><section class="surface summary-panel">${section('03','Partner Snapshot')}<div class="summary-amount">${money(active.value)}<span>Largest active fictional opportunity</span></div><div class="summary-bottom"><span><small>Team members</small><b>${data.team.length}</b></span><span><small>Active referrals</small><b>${data.referrals.filter(r=>r.status!=='closed').length}</b></span></div></section></div>`;
}
function section(n,title,right=''){return`<div class="section-title"><div class="section-title-left"><span class="index-no">${n}</span><h2>${title}</h2></div>${right}</div>`;}
function filtered(){
 let rows=[...data.referrals];const q=state.search.toLowerCase();
 if(q)rows=rows.filter(r=>Object.values(r).join(' ').toLowerCase().includes(q));
 if(state.filter!=='All')rows=rows.filter(r=>r.status===state.filter);
 if(state.sort==='business')rows.sort((a,b)=>a.contactAlias.localeCompare(b.contactAlias));
 else rows.sort((a,b)=>b.updated.localeCompare(a.updated));
 return rows;
}
function pipeline(){
 const rows=filtered(),filters=['All','needs-action','routed','review','qualified','closed'];
 const table=rows.map(r=>`<tr><td><a class="table-business" href="#/referrals/${r.id}">${esc(r.contactAlias)}</a><span class="mono table-ref">${r.id}</span></td><td><strong>${esc(r.organization)}</strong><small>${esc(r.category)}</small></td><td>${date(r.submitted)}<small>Updated ${date(r.updated)}</small></td><td>${badge(r.status)}</td><td>${esc(r.next)}</td><td><a class="row-arrow" href="#/referrals/${r.id}">→</a></td></tr>`).join('');
 return head('PIPELINE / ORGANIZATION REFERRALS','Referral Pipeline','Search and route partner-originated fictional opportunities.',`<button class="btn btn-dark" data-action="submit">＋ Submit Referral</button>`)+`<div class="toolbar"><label class="search-box">⌕ <input id="partner-search" value="${esc(state.search)}" placeholder="Search organization or referral"></label><select id="partner-sort"><option value="updated">Latest update</option><option value="business">Business name</option></select></div><div class="filter-row">${filters.map(f=>`<button class="filter-chip ${state.filter===f?'selected':''}" data-filter="${f}">${esc(f==='All'?f:f.replace('-',' '))}</button>`).join('')}</div><div class="desktop-table-wrap"><table class="data-table"><thead><tr><th>Referral</th><th>Organization / category</th><th>Dates</th><th>Status</th><th>Next step</th><th></th></tr></thead><tbody>${table}</tbody></table></div>`;
}
function submit(){
 return head('REFERRAL INTAKE / DEMO ONLY','Submit a Partner Referral','Create one in-memory fictional partner referral. No live submission occurs.')+`<section class="surface form-grid"><label>Business alias<input id="submit-business" value="Fictional Partner Client"></label><label>Funding category<select id="submit-category"><option>Working Capital</option><option>Equipment</option><option>Acquisition Capital</option></select></label><label>Partner organization<select id="submit-org">${data.organizations.map(o=>`<option>${esc(o.name)}</option>`).join('')}</select></label><label>Partner context<textarea id="submit-context" rows="5" placeholder="Fictional context only"></textarea></label><button class="btn btn-lime" data-action="create-referral">Create Demo Referral →</button></section>`;
}
function detail(id){
 const r=data.referrals.find(x=>x.id===id);
 if(!r)return shell('pipeline','<div class="empty-state"><h2>Referral not found</h2><a class="btn btn-dark" href="#/pipeline">Back</a></div>');
 return head(`REFERRAL DOSSIER / ${r.id}`,'Partner Referral Dossier',`${r.contactAlias} · partner-safe view`,'<a class="btn btn-outline" href="#/pipeline">← Back to Pipeline</a>')+`<div class="dossier-grid"><section class="surface dossier-main"><div class="dossier-fields"><div><span>BUSINESS ALIAS</span><strong>${esc(r.contactAlias)}</strong></div><div><span>PARTNER ORGANIZATION</span><strong>${esc(r.organization)}</strong></div><div><span>CATEGORY</span><strong>${esc(r.category)}</strong></div><div><span>PARTNER OWNER</span><strong>${esc(r.owner)}</strong></div></div><div class="stage-rail">${['Received','Routed','Review','Qualified','Closed'].map((s,i)=>`<div class="${i===(['received','routed','review','qualified','closed'].indexOf(r.status))?'current':''}"><b>0${i+1}</b><span>${s}</span></div>`).join('')}</div><h3>Partner-visible timeline</h3><ol class="timeline">${r.timeline.map(t=>`<li><time>${date(t.date)}</time><div><strong>${esc(t.title)}</strong><p>${esc(t.detail)}</p></div></li>`).join('')}</ol></section><aside class="dossier-side"><div class="dispatch-mini"><span class="mono">NEXT STEP</span><h2>${esc(r.next)}</h2><p>No internal lender logic or private applicant record is represented.</p><a class="btn btn-lime" href="#/support">Partner Support →</a></div></aside></div>`;
}
function performance(){
 const max=Math.max(...data.performance.map(p=>p.referrals));
 return head('PERFORMANCE / ORGANIZATION','Partner Performance','Illustrative partner channel activity. No forecast or payout guarantee.')+`<div class="overview-grid"><section class="surface">${section('02','Monthly Referral Flow')}<div class="bar-chart">${data.performance.map(p=>`<div><span>${p.qualified} qualified</span><i style="height:${p.referrals/max*180}px"></i><b>${p.month}</b></div>`).join('')}</div></section><section class="surface">${section('03','Channel Summary')}<div class="summary-amount">${data.referrals.filter(r=>r.status==='qualified').length}<span>Qualified fictional milestones</span></div><div class="summary-bottom"><span><small>Organization</small><b>${esc(data.partner.name)}</b></span><span><small>Partner tier</small><b>${esc(data.partner.tier)}</b></span></div></section></div>`;
}
function ledger(){
 return head('COMPENSATION / ILLUSTRATIVE','Revenue-Share Ledger','No payment promise or live payout is represented.',`<button class="btn btn-outline" data-action="export-ledger">Export Demo CSV</button>`)+`<div class="surface">${section('02','Ledger Events')}<div class="desktop-table-wrap"><table class="data-table"><thead><tr><th>Event</th><th>Referral</th><th>Illustrative amount</th><th>Status</th><th>Date</th></tr></thead><tbody>${data.ledger.map(x=>`<tr><td><strong>${esc(x.event)}</strong></td><td>${esc(x.referral)}</td><td><strong>${money(x.amount)}</strong></td><td>${esc(x.status)}</td><td>${date(x.date)}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function resources(){
 const rs=state.resource==='All'?data.resources:data.resources.filter(r=>r.category===state.resource);
 return head('ENABLEMENT / ORGANIZATION','Co-branded Resources','Approved-style marketing assets and partner links remain fictional.',`<button class="btn btn-dark" data-action="copy-link">Copy Demo Partner Link</button>`)+`<div class="filter-row">${['All',...new Set(data.resources.map(r=>r.category))].map(f=>`<button class="filter-chip ${state.resource===f?'selected':''}" data-resource="${f}">${esc(f)}</button>`).join('')}</div><div class="resource-grid">${rs.map(r=>`<article class="surface resource-card"><span class="mono">${esc(r.category)}</span><h2>${esc(r.title)}</h2><p>${esc(r.summary)}</p><small>${esc(r.brand)}</small><button class="text-arrow" data-action="open-resource" data-title="${esc(r.title)}">Open fixture ${'→'}</button></article>`).join('')}</div>`;
}
function messages(){
 const m=data.messages.find(x=>x.id===state.thread)||data.messages[0];
 return head('COMMUNICATIONS / DEMO','Partner Messages','Fictional partner support threads only.')+`<div class="messages-grid"><aside class="surface thread-list">${data.messages.map(x=>`<button class="${m.id===x.id?'active':''}" data-thread="${x.id}"><span class="mono">${date(x.date)}</span><strong>${esc(x.subject)}</strong><small>${esc(x.body)}</small></button>`).join('')}</aside><section class="surface conversation"><h2>${esc(m.subject)}</h2><div class="message-stream">${m.thread.map(x=>`<div class="message-bubble ${x.direction==='out'?'out':''}"><small>${esc(x.from)} · ${date(x.date)}</small><p>${esc(x.body)}</p></div>`).join('')}</div><div class="compose"><textarea id="message-draft" placeholder="Draft a demo-only message">${esc(state.draft)}</textarea><button class="btn btn-dark" data-action="send-message">Send Demo Message →</button></div></section></div>`;
}
function settings(){
 return head('ORGANIZATION / TEAM','Partner & Team Settings','Management controls are in-memory demonstrations.')+`<div class="overview-grid"><section class="surface">${section('02','Organization')}<dl class="settings-list"><dt>Organization</dt><dd>${esc(data.partner.name)}</dd><dt>Partner ID</dt><dd>${esc(data.partner.id)}</dd><dt>Region</dt><dd>${esc(data.partner.region)}</dd><dt>Tier</dt><dd>${esc(data.partner.tier)}</dd></dl><button class="btn btn-outline" data-action="reset">Reset Demo State</button></section><section class="surface">${section('03','Team')}<div class="team-list">${data.team.map(t=>`<div><span class="avatar">${esc(t.name.split(' ').map(x=>x[0]).join(''))}</span><p><strong>${esc(t.name)}</strong><small>${esc(t.role)} · ${esc(t.status)}</small></p><button class="icon-button" data-action="member" data-name="${esc(t.name)}">⋯</button></div>`).join('')}</div></section></div>`;
}
function support(){
 return head('SUPPORT / PARTNER OPERATIONS','Partner Support','General partner help. No applicant records or live support channels.')+`<div class="support-grid">${['Referral handoff','Organization access','Revenue-share context','Co-branded resources'].map((x,i)=>`<button class="surface support-card" data-action="support-card" data-topic="${esc(x)}"><span class="index-no">0${i+1}</span><h2>${esc(x)}</h2><p>Open a fictional help route and suggested demo response.</p><b>Open →</b></button>`).join('')}</div>`;
}

function render(){
 const r=route();const pages={
  start,overview,submit,pipeline,performance,ledger,resources,messages,settings,support
 };
 if(r.name==='referrals')app.innerHTML=shell('pipeline',detail(r.id));
 else app.innerHTML=shell(r.name in pages?r.name:'overview',(pages[r.name in pages?r.name:'overview'])());
 bind();
}
function bind(){
 app.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>{
  const a=el.dataset.action;
  if(a==='menu')state.mobile=!state.mobile;
  else if(a==='close-menu')state.mobile=false;
  else if(a==='submit')location.hash='#/submit';
  else if(a==='notifications')state.notification=!state.notification;
  else if(a==='read-notifications'){data.notifications.forEach(n=>n.unread=false);toast('Demo alerts marked read');state.notification=false;}
  else if(a==='close-dialog')dialog.close();
  else if(a==='create-referral'){dialogOpen('Demo referral created','<p><strong>'+esc(document.getElementById('submit-business').value)+'</strong> was represented as a received fictional partner referral. It was not submitted anywhere.</p>');}
  else if(a==='copy-link'){navigator.clipboard?.writeText('https://example.test/partner/northstar');toast('Demo partner link copied');}
  else if(a==='export-ledger'){toast('Demo CSV export simulated');}
  else if(a==='open-resource'){dialogOpen(el.dataset.title,'<p>This fixture is a co-branded resource preview. No document or download is stored.</p>');}
  else if(a==='send-message'){state.draft=document.getElementById('message-draft')?.value||'';toast('Demo message drafted only');}
  else if(a==='reset'){state.filter='All';state.search='';state.resource='All';toast('Partner demo reset');location.hash='#/overview';}
  else if(a==='member')dialogOpen(el.dataset.name,'<p>This team control is simulated. Production member changes require server-enforced organization RBAC.</p>');
  else if(a==='support'||a==='support-card'){location.hash='#/support';if(a==='support-card')dialogOpen(el.dataset.topic,'<p>Fictional response: partner operations can only help with organization-visible demo workflows.</p>');}
  render();
 }));
 app.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{state.filter=el.dataset.filter;render();}));
 app.querySelectorAll('[data-resource]').forEach(el=>el.addEventListener('click',()=>{state.resource=el.dataset.resource;render();}));
 app.querySelectorAll('[data-thread]').forEach(el=>el.addEventListener('click',()=>{state.thread=el.dataset.thread;render();}));
 const search=document.getElementById('partner-search');if(search)search.addEventListener('input',()=>{state.search=search.value;render();search.focus();});
 const sort=document.getElementById('partner-sort');if(sort){sort.value=state.sort;sort.addEventListener('change',()=>{state.sort=sort.value;render();});}
}
init();
