/* MOONSHINE CAPITAL / OPERATIONS CONSOLE
 * Static simulated administrator workspace. No live writes or privileged APIs.
 */
const app=document.getElementById('app'),dialog=document.getElementById('app-dialog'),toasts=document.getElementById('toast-zone');
let data,statusMap;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=s=>new Intl.DateTimeFormat('en-US',{month:'short',day:'2-digit',year:'numeric'}).format(new Date(s+'T12:00:00'));
const money=n=>n==null?'Not established':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const state={mobile:false,dealFilter:'All',dealSearch:'',dealSort:'updated',docFilter:'All',commFilter:'All',ledgerFilter:'All',auditSearch:'',notification:false};
const nav=[['overview','Action Queue','01'],['triage','Intake Triage','02'],['pipeline','Deal Pipeline','03'],['partners','Partner & Affiliate','04'],['documents','Document Review','05'],['communications','Dispatch','06'],['ledger','Commission Recon','07'],['audit','Audit Log','08'],['settings','Settings & Access','09']];

async function init(){
 try{
  const [d,s]=await Promise.all([fetch('./data/demo.json').then(r=>r.ok?r.json():Promise.reject()),fetch('./data/status-map.json').then(r=>r.ok?r.json():Promise.reject())]);
  data=d;statusMap=s;window.addEventListener('hashchange',render);render();
 }catch{app.innerHTML='<main class="error-state"><h1>Demo data unavailable</h1><p>Serve this folder over HTTP so fixture JSON can load.</p></main>';}
}
function route(){const h=location.hash.replace(/^#/,'')||'/start';const p=h.replace(/^\/+/,'').split('/');return{name:p[0],id:decodeURIComponent(p[1]||'')};}
function badge(s){const x=statusMap.statuses[s]||statusMap.unmappedFallback;return`<span class="status status-${esc(x.tone)}"><i class="status-dot"></i>${esc(x.label)}</span>`;}
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;toasts.appendChild(e);setTimeout(()=>e.remove(),3500);}
function dialogOpen(title,body){dialog.querySelector('#dialog-body').innerHTML=`<div class="dialog-head"><h2>${esc(title)}</h2><button class="icon-button" data-action="close-dialog">×</button></div><div class="dialog-content">${body}</div>`;dialog.showModal();}
function head(kicker,title,sub,action=''){return`<div class="page-heading"><div><div class="page-kicker mono">${kicker}</div><h1>${title}</h1><p>${sub}</p></div>${action}</div>`;}
function section(n,title,right=''){return`<div class="section-title"><div class="section-title-left"><span class="index-no">${n}</span><h2>${title}</h2></div>${right}</div>`;}

function shell(active,content){
 return`<div class="workspace"><aside class="sidebar ${state.mobile?'is-open':''}"><a class="brand" href="#/overview"><div class="brand-logomark">OC<span>///</span></div><div><strong>OPERATIONS</strong><small>CONSOLE</small></div></a><div class="sidebar-rule"></div><div class="sidebar-section-label mono">INTERNAL DEMO / OPS-007</div><nav class="side-nav">${nav.map(n=>`<a class="nav-item ${active===n[0]?'active':''}" href="#/${n[0]}"><b class="nav-index">${n[2]}</b><span>${n[1]}</span></a>`).join('')}</nav><div class="sidebar-spacer"></div><div class="sidebar-help"><span class="mono">SIMULATED PRIVILEGED AREA</span><strong>Server authorization required</strong><button class="sidebar-help-link" data-action="security">Security boundary ↗</button></div></aside><div class="main-column"><header class="topbar"><div class="topbar-leading"><button class="icon-button mobile-menu" data-action="menu">☰</button><span class="crumbs mono">OPERATIONS CONSOLE / ${active.toUpperCase()}</span></div><div class="topbar-actions"><span class="demo-pill"><i></i> DEMO · FICTIONAL DATA</span><button class="icon-button" data-action="notifications">◷</button><a class="user-chip" href="#/settings"><span class="avatar">CM</span><span>Casey M.</span></a></div></header><main class="content">${content}</main><footer class="workspace-footer"><span>OPERATIONS CONSOLE / DEMO ONLY</span><span>No live admin API · No real applicant data</span><a href="#/audit">Audit ↗</a></footer></div></div><div class="sidebar-overlay ${state.mobile?'is-open':''}" data-action="close-menu"></div>${state.notification?`<div class="notification-panel"><div class="notification-header"><strong>Operations Alerts</strong><button class="icon-button" data-action="notifications">×</button></div><a class="notification unread" href="#/triage"><i></i><span><b>Intake triage item</b><small>APP-26-1042 is fictional and awaiting completeness review.</small></span></a><a class="notification" href="#/documents"><i></i><span><b>Document metadata queue</b><small>Review file metadata only.</small></span></a></div>`:''}`;
}
function start(){
 return`<div class="entry"><div class="entry-nav"><div class="entry-brand"><b class="entry-logomark">OC<span>///</span></b><span class="mono">MOONSHINE CAPITAL / OPERATIONS</span></div><span class="demo-pill"><i></i> DEMO · FICTIONAL DATA</span></div><div class="entry-grid"><section class="entry-intro"><div class="entry-eyebrow mono"><i class="entry-signal"></i> INTERNAL OPERATIONS / CONCEPT 004</div><h1>OPERATIONS<br>IN ONE<br><em>CONTROL VIEW.</em></h1><p>Fictional intake, routing, document metadata and reconciliation for a simulated operations team.</p><div class="entry-cta"><a class="btn btn-lime" href="#/overview">Enter Demo Console →</a><span class="mono">SIMULATED PRIVILEGES · NO LIVE ACTIONS</span></div></section><aside class="entry-visual"><div class="entry-visual-heading mono"><span>OPERATIONS CONSOLE</span><span>DEMO DATA</span></div><div class="entry-visual-plate"><div class="visual-alert">04 / ACTION QUEUE ↗</div><div class="visual-core"><span class="mono visual-kicker">NEXT REQUIRED MOVE</span><strong>Review fictional intake completeness.</strong><p>APP-26-1042 · Harborline Supply Co.</p></div><div class="visual-foot"><span class="mono">BOUNDARY</span><b>DEMO ONLY / SERVER RBAC REQUIRED</b></div></div></aside></div></div>`;
}
function overview(){
 const hot=data.queue[0];
 return head('OPERATIONS OVERVIEW / THURSDAY, 19 NOV 2026','Good morning, Casey.','Prioritize fictional action items and simulated operational reviews.')+`<section class="dispatch"><div class="dispatch-top"><span><i class="blinker"></i> ACTION QUEUE / ${hot.id}</span><span class="dispatch-seq">PRIORITY ${hot.priority.toUpperCase()}</span></div><div class="dispatch-body"><div class="dispatch-copy"><div class="dispatch-eyebrow">NEXT REQUIRED MOVE</div><h2>${esc(hot.subject)} <span class="dispatch-star">↗</span></h2><p>${esc(hot.alias)} · ${esc(hot.record)} · ${esc(hot.age)} old</p><div class="dispatch-actions"><a class="btn btn-dark" href="#/triage">Open Triage Queue →</a><a class="plain-link" href="#/audit">View audit log →</a></div></div><aside class="dispatch-meta"><span class="mono">ROLE</span><strong>OPS REVIEWER</strong><div class="dispatch-meta-line"></div><span class="mono">QUEUE ITEMS</span><b>${data.queue.length} simulated</b><div class="dispatch-watermark">04</div></aside></div></section><div class="overview-grid"><section class="surface">${section('02','Current Action Queue')}<div class="queue-list">${data.queue.map(q=>`<a href="${q.kind==='Document'?'#/documents':q.kind==='Commission'?'#/ledger':q.kind==='Routing'?'#/pipeline':'#/triage'}"><span class="queue-priority">${esc(q.priority)}</span><span><strong>${esc(q.subject)}</strong><small>${esc(q.alias)} · ${esc(q.record)}</small></span><b>${esc(q.age)} →</b></a>`).join('')}</div></section><section class="surface">${section('03','Operations Snapshot')}<div class="stats-grid"><div><strong>${data.queue.length}</strong><span>Open actions</span></div><div><strong>${data.documents.length}</strong><span>Metadata reviews</span></div><div><strong>${data.partners.length}</strong><span>Channel accounts</span></div></div></section></div>`;
}
function triage(){
 return head('INTAKE / COMPLETENESS','Intake Triage','Review fictional intake metadata only. No eligibility determination is available.')+`<div class="desktop-table-wrap surface"><table class="data-table"><thead><tr><th>Queue</th><th>Fictional record</th><th>Category</th><th>Priority</th><th>Age</th><th>Status</th><th></th></tr></thead><tbody>${data.queue.filter(q=>q.kind==='Intake'||q.kind==='Routing').map(q=>`<tr><td><strong>${esc(q.subject)}</strong></td><td><a class="table-business" href="#/deals/${esc(q.record.replace('APP-',''))}">${esc(q.alias)}</a><small>${esc(q.record)}</small></td><td>${esc(q.kind)}</td><td>${esc(q.priority)}</td><td>${esc(q.age)}</td><td>${badge(q.status)}</td><td><button class="icon-button" data-action="triage-action" data-record="${esc(q.record)}">→</button></td></tr>`).join('')}</tbody></table></div>`;
}
function filteredDeals(){
 let r=[...data.deals],q=state.dealSearch.toLowerCase();
 if(q)r=r.filter(x=>Object.values(x).join(' ').toLowerCase().includes(q));
 if(state.dealFilter!=='All')r=r.filter(x=>x.status===state.dealFilter);
 if(state.dealSort==='amount')r.sort((a,b)=>b.amount-a.amount);else r.sort((a,b)=>b.updated.localeCompare(a.updated));
 return r;
}
function pipeline(){
 const r=filteredDeals(),filters=['All','triage','review','routed','approved','closed','hold'];
 return head('OPERATIONS / DEAL RECORDS','Applicant & Referral Pipeline','Search fictional operations records and open metadata-only deal views.',`<button class="btn btn-dark" data-action="create-demo">＋ Create Demo Record</button>`)+`<div class="toolbar"><label class="search-box">⌕ <input id="deal-search" value="${esc(state.dealSearch)}" placeholder="Search alias or record"></label><select id="deal-sort"><option value="updated">Latest update</option><option value="amount">Largest amount</option></select></div><div class="filter-row">${filters.map(f=>`<button class="filter-chip ${state.dealFilter===f?'selected':''}" data-deal-filter="${esc(f)}">${esc(f)}</button>`).join('')}</div><div class="desktop-table-wrap surface"><table class="data-table"><thead><tr><th>Deal / alias</th><th>Category / source</th><th>Amount</th><th>Stage</th><th>Status</th><th>Owner</th><th></th></tr></thead><tbody>${r.map(x=>`<tr><td><a class="table-business" href="#/deals/${x.id}">${esc(x.alias)}</a><small>${x.id}</small></td><td><strong>${esc(x.category)}</strong><small>${esc(x.source)}</small></td><td>${money(x.amount)}</td><td>${esc(x.stage)}</td><td>${badge(x.status)}</td><td>${esc(x.owner)}</td><td><a class="row-arrow" href="#/deals/${x.id}">→</a></td></tr>`).join('')}</tbody></table></div>`;
}
function deal(id){
 const x=data.deals.find(d=>d.id===id)||data.deals.find(d=>d.id.endsWith(id));
 if(!x)return shell('pipeline','<div class="empty-state"><h2>Deal not found</h2><a class="btn btn-dark" href="#/pipeline">Back</a></div>');
 return head(`DEAL DOSSIER / ${x.id}`,'Operations Deal View',`${x.alias} · fictional record`,'<a class="btn btn-outline" href="#/pipeline">← Back to Pipeline</a>')+`<div class="dossier-grid"><section class="surface dossier-main"><div class="dossier-fields"><div><span>SAFE ALIAS</span><strong>${esc(x.alias)}</strong></div><div><span>CATEGORY</span><strong>${esc(x.category)}</strong></div><div><span>SOURCE</span><strong>${esc(x.source)}</strong></div><div><span>OWNER</span><strong>${esc(x.owner)}</strong></div></div><div class="stage-rail">${['Intake','Triage','Review','Route','Archive'].map((s,i)=>`<div class="${i===1?'current':''}"><b>0${i+1}</b><span>${s}</span></div>`).join('')}</div><h3>Activity timeline</h3><ol class="timeline">${x.events.map(e=>`<li><time>${date(e.date)}</time><div><strong>${esc(e.title)}</strong><p>${esc(e.detail)}</p></div></li>`).join('')}</ol></section><aside class="dossier-side"><div class="dispatch-mini"><span class="mono">SIMULATED NEXT STEP</span><h2>${esc(x.next)}</h2><p>Actions are client-only demonstrations. Server authorization and audit are required in production.</p><button class="btn btn-lime" data-action="route-demo" data-record="${esc(x.id)}">Simulate Route →</button></div></aside></div>`;
}
function partners(){
 return head('CHANNEL OVERSIGHT / DEMO','Partner & Affiliate Oversight','Review fictional organization relationships and alert counts.')+`<div class="desktop-table-wrap surface"><table class="data-table"><thead><tr><th>Organization</th><th>Channel</th><th>Tier</th><th>Referral count</th><th>Alerts</th><th>Status</th></tr></thead><tbody>${data.partners.map(p=>`<tr><td><strong>${esc(p.name)}</strong><small>${p.id}</small></td><td>${esc(p.kind)}</td><td>${esc(p.tier)}</td><td>${p.referrals}</td><td>${p.alerts}</td><td>${badge(p.status.toLower()==='active'?'approved':'hold')}</td></tr>`).join('')}</tbody></table></div>`;
}
function documents(){
 const rs=state.docFilter==='All'?data.documents:data.documents.filter(d=>d.state===state.docFilter);
 return head('DOCUMENTS / METADATA ONLY','Document Review Queue','No document bytes or private applicant content are accessible.',`<button class="btn btn-outline" data-action="metadata-disclosure">Metadata Boundary</button>`)+`<div class="filter-row">${['All','New','Ready for review','Needs metadata check'].map(f=>`<button class="filter-chip ${state.docFilter===f?'selected':''}" data-doc-filter="${esc(f)}">${esc(f)}</button>`).join('')}</div><div class="desktop-table-wrap surface"><table class="data-table"><thead><tr><th>Fixture filename</th><th>Deal</th><th>Kind</th><th>Metadata</th><th>State</th><th></th></tr></thead><tbody>${rs.map(d=>`<tr><td><strong>${esc(d.name)}</strong></td><td>${esc(d.deal)}</td><td>${esc(d.kind)}</td><td><small>${d.pages} pages · ${d.bytes}</small><small>Updated ${date(d.date)}</small></td><td>${esc(d.state)}</td><td><button class="icon-button" data-action="document-action" data-id="${esc(d.id)}">→</button></td></tr>`).join('')}</tbody></table></div>`;
}
function communications(){
 const r=state.commFilter==='All'?data.communications:data.communications.filter(c=>c.status===state.commFilter);
 return head('COMMUNICATIONS / DRAFTS','Dispatch Queue','Draft simulated messages only. No live delivery is connected.',`<button class="btn btn-dark" data-action="new-draft">＋ New Demo Draft</button>`)+`<div class="filter-row">${['All','Draft','Hold'].map(f=>`<button class="filter-chip ${state.commFilter===f?'selected':''}" data-comm-filter="${esc(f)}">${esc(f)}</button>`).join('')}</div><div class="surface communication-list">${r.map(c=>`<article><div><span class="mono">${esc(c.channel)} / ${esc(c.audience)}</span><h2>${esc(c.subject)}</h2><p>${esc(c.body)}</p></div><aside>${esc(c.status)}<button class="btn btn-outline" data-action="dispatch-draft" data-id="${esc(c.id)}">Simulate Dispatch</button></aside></article>`).join('')}</div>`;
}
function ledger(){
 const r=state.ledgerFilter==='All'?data.ledger:data.ledger.filter(x=>x.status===state.ledgerFilter);
 return head('FINANCE / ILLUSTRATIVE','Commission Reconciliation','No payment execution, eligibility determination or payout promise exists.')+`<div class="filter-row">${['All','Hold','Pending','No Event'].map(f=>`<button class="filter-chip ${state.ledgerFilter===f?'selected':''}" data-ledger-filter="${esc(f)}">${esc(f)}</button>`).join('')}</div><div class="desktop-table-wrap surface"><table class="data-table"><thead><tr><th>Reconciliation</th><th>Deal</th><th>Channel</th><th>Illustrative basis</th><th>Amount</th><th>Status</th></tr></thead><tbody>${r.map(x=>`<tr><td><strong>${x.id}</strong></td><td>${esc(x.deal)}</td><td>${esc(x.channel)}</td><td>${esc(x.basis)}</td><td>${money(x.amount)}</td><td>${esc(x.status)}</td></tr>`).join('')}</tbody></table></div>`;
}
function audit(){
 const r=state.auditSearch?data.audit.filter(a=>Object.values(a).join(' ').toLowerCase().includes(state.auditSearch.toLowerCase())):data.audit;
 return head('GOVERNANCE / ACTIVITY','Audit & Activity Log','Immutable production auditing is a future server contract; these entries are fixture data.')+`<div class="toolbar"><label class="search-box">⌕ <input id="audit-search" value="${esc(state.auditSearch)}" placeholder="Search audit fixture"></label></div><div class="desktop-table-wrap surface"><table class="data-table"><thead><tr><th>Event</th><th>Time</th><th>Actor</th><th>Action</th><th>Record</th><th>Scope</th></tr></thead><tbody>${r.map(a=>`<tr><td>${esc(a.id)}</td><td>${esc(a.time)}</td><td>${esc(a.actor)}</td><td>${esc(a.action)}</td><td>${esc(a.record)}</td><td>${esc(a.scope)}</td></tr>`).join('')}</tbody></table></div>`;
}
function settings(){
 return head('ADMINISTRATION / ROLE OVERVIEW','Platform Settings & Access','Privileged controls are visible but simulated. Production changes require server-enforced RBAC.')+`<div class="overview-grid"><section class="surface">${section('02','Role & Access Boundary')}<div class="role-list">${data.roles.map(r=>`<article><h3>${esc(r.role)}</h3><p>${esc(r.scope)}</p><small>${esc(r.boundary)}</small></article>`).join('')}</div><button class="btn btn-outline" data-action="reset">Reset Demo State</button></section><section class="surface">${section('03','Environment')}<dl class="settings-list"><dt>Mode</dt><dd>Static Demo</dd><dt>Operator</dt><dd>${esc(data.operator.name)}</dd><dt>Role</dt><dd>${esc(data.operator.role)}</dd><dt>Live APIs</dt><dd>Disabled</dd></dl></section></div>`;
}

function render(){
 const r=route(),pages={start,overview,triage,pipeline,partners,documents,communications,ledger,audit,settings};
 if(r.name==='deals')app.innerHTML=shell('pipeline',deal(r.id));
 else app.innerHTML=shell(r.name in pages?r.name:'overview',(pages[r.name in pages?r.name:'overview'])());
 bind();
}
function bind(){
 app.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>{
  const a=el.dataset.action;
  if(a==='menu')state.mobile=!state.mobile;
  else if(a==='close-menu')state.mobile=false;
  else if(a==='notifications')state.notification=!state.notification;
  else if(a==='close-dialog')dialog.close();
  else if(a==='security')dialogOpen('Security Boundary','<p>Static demo labels and routes do not provide authorization. Production access requires server-validated sessions, RBAC and operation scope.</p>');
  else if(a==='create-demo')dialogOpen('Create Demo Record','<p>This creates no record. A future server action would validate scope and write an auditable fixture only.</p>');
  else if(a==='triage-action')dialogOpen('Simulated Triage','<p><strong>'+esc(el.dataset.record)+'</strong> was opened as a simulated action. No live status changed.</p>');
  else if(a==='route-demo')dialogOpen('Simulated Routing','<p>Record <strong>'+esc(el.dataset.record)+'</strong> can only be routed through a future server-enforced workflow. No provider call occurred.</p>');
  else if(a==='document-action')dialogOpen('Metadata-Only Review','<p>Document <strong>'+esc(el.dataset.id)+'</strong> exposes filename, kind, date and size only. Private bytes are unavailable.</p>');
  else if(a==='metadata-disclosure')dialogOpen('Metadata Boundary','<p>Document review in this demo never fetches or uploads file bytes. Production access requires object authorization and audit.</p>');
  else if(a==='new-draft')dialogOpen('New Demo Draft','<p>A communications draft is simulated locally. No message or notification is dispatched.</p>');
  else if(a==='dispatch-draft')dialogOpen('Dispatch Blocked by Demo Mode','<p>Draft <strong>'+esc(el.dataset.id)+'</strong> was not sent. Live communications require server dispatch and audit.</p>');
  else if(a==='reset'){state.dealFilter='All';state.dealSearch='';state.docFilter='All';state.commFilter='All';state.ledgerFilter='All';state.auditSearch='';toast('Operations demo reset');location.hash='#/overview';}
  render();
 }));
 app.querySelectorAll('[data-deal-filter]').forEach(e=>e.onclick=()=>{state.dealFilter=e.dataset.dealFilter;render();});
 app.querySelectorAll('[data-doc-filter]').forEach(e=>e.onclick=()=>{state.docFilter=e.dataset.docFilter;render();});
 app.querySelectorAll('[data-comm-filter]').forEach(e=>e.onclick=()=>{state.commFilter=e.dataset.commFilter;render();});
 app.querySelectorAll('[data-ledger-filter]').forEach(e=>e.onclick=()=>{state.ledgerFilter=e.dataset.ledgerFilter;render();});
 const ds=document.getElementById('deal-search');if(ds)ds.oninput=()=>{state.dealSearch=ds.value;render();document.getElementById('deal-search')?.focus();};
 const so=document.getElementById('deal-sort');if(so){so.value=state.dealSort;so.onchange=()=>{state.dealSort=so.value;render();}};
 const au=document.getElementById('audit-search');if(au)au.oninput=()=>{state.auditSearch=au.value;render();document.getElementById('audit-search')?.focus();};
}
init();
