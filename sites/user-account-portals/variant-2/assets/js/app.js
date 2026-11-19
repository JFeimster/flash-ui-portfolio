/**
 * MOONSHINE CAPITAL / REFERRAL DISPATCH
 * Fixture-backed affiliate workspace prototype.
 * No auth, network writes, browser storage, CRM or commission processor.
 */
const root=document.getElementById('app');
const toastZone=document.getElementById('toast-zone');
const dialog=document.getElementById('app-dialog');
let fixture,statusMap;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=s=>s?new Intl.DateTimeFormat('en-US',{month:'short',day:'2-digit',year:'numeric'}).format(new Date(s+'T12:00:00')):'—';
const money=n=>n===null||n===undefined?'Not established':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const icons={
 grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
 users:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-5 2-8 6-8s6 3 6 8M15 14c4 0 6 2 6 6"/>',
 wallet:'<rect x="3" y="5" width="18" height="15" rx="1"/><path d="M3 9h18M15 13h6v4h-6z"/>',
 pulse:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
 launch:'<path d="m12 2 8 8-8 8-8-8zM12 18v4M5 18l-2 2M19 18l2 2"/>',
 book:'<path d="M3 4h7c2 0 3 1 3 3v13c-1-2-2-3-4-3H3zM21 4h-5c-2 0-3 1-3 3v13c1-2 2-3 4-3h4z"/>',
 message:'<path d="M20 11a8 8 0 0 1-8 8 9 9 0 0 1-4-.9L3 20l1.8-5A8 8 0 1 1 20 11z"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3.5-8 8-8s8 3 8 8"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 close:'<path d="M5 5l14 14M19 5 5 19"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 check:'<path d="m4 12 5 5L20 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',
 send:'<path d="m22 2-7 20-4-9-9-4zM11 13 22 2"/>',
 external:'<path d="M13 4h7v7M20 4l-9 9M19 14v6H4V5h6"/>'
};
function icon(n,size=18){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${icons[n]||icons.grid}</svg>`;}
const state={
  mobile:false,notifications:false,unread:new Set(),referralFilter:'All',referralSearch:'',referralSort:'updated-desc',
  commissionFilter:'All',resourceFilter:'All',activeThread:null,draft:'',onboarding:new Set([0,1]),
  activity:{conversations:0,introductions:0,submissions:0,followUps:0},
  goal:{...null},profile:{service:true,marketing:false},threadDraft:''
};
const nav=[
 ['overview','Overview','grid'],['referrals','My Referrals','users'],['commissions','Commission Ledger','wallet'],
 ['activity','Activity & Goals','pulse'],['launch','Agent Launch','launch'],['resources','Resources','book'],
 ['messages','Messages & Support','message'],['settings','Account & Settings','user']
];
function statusBadge(status){const s=statusMap.statuses[status]||statusMap.unmappedFallback;return `<span class="status status-${esc(s.tone)}"><i></i>${esc(s.label)}</span>`;}
function pageHead(kicker,title,sub,action=''){return `<div class="page-heading"><div><div class="page-kicker mono">${kicker}</div><h1>${title}</h1><p>${sub}</p></div>${action?`<div>${action}</div>`:''}</div>`;}
function btn(href,label,kind='dark',extra=''){return `<a class="btn btn-${kind}" href="${esc(href)}" ${extra}>${esc(label)} ${icon('arrow',17)}</a>`;}
function sectionTitle(n,title,right=''){return `<div class="section-title"><div><span class="index-no">${n}</span><h2>${title}</h2></div>${right}</div>`;}
function dialogOpen(title,body){document.getElementById('dialog-body').innerHTML=`<div class="dialog-head"><h2 id="dialog-title">${esc(title)}</h2><button class="icon-button" data-action="close-dialog" aria-label="Close dialog">${icon('close',18)}</button></div>${body}<div class="dialog-footer"><button class="btn btn-dark" data-action="close-dialog">Close</button></div>`;if(!dialog.open)dialog.showModal();}
function toast(message){const el=document.createElement('div');el.className='toast';el.innerHTML=`${icon('check',18)}<span>${esc(message)}</span>`;toastZone.appendChild(el);setTimeout(()=>el.remove(),4200);}

async function init(){
  try{
    const [df,sm]=await Promise.all([fetch('./data/demo.json').then(r=>r.ok?r.json():Promise.reject(r.status)),fetch('./data/status-map.json').then(r=>r.ok?r.json():Promise.reject(r.status))]);
    fixture=df;statusMap=sm;state.unread=new Set(fixture.notifications.filter(n=>n.unread).map(n=>n.id));state.activeThread=fixture.messages[0]?.id||null;state.goal={...fixture.goalDefaults};
    window.addEventListener('hashchange',render);render();
  }catch(error){
    root.innerHTML=`<main class="error-state"><h1>Demo data unavailable</h1><p>Serve this folder over HTTP. Local JSON fixtures could not be loaded.</p><button class="btn btn-dark" onclick="location.reload()">Retry</button></main>`;
  }
}
function route(){const h=location.hash.replace(/^#/,'')||'/start';const parts=h.split('?')[0].replace(/^\/+/,'').split('/');return {name:parts[0]||'start',id:decodeURIComponent(parts[1]||'')};}
function shell(active,content){
  return `<div class="workspace">${sidebar(active)}<div class="main-column">${topbar(active)}<main class="content">${content}</main>${footer()}</div></div><div class="sidebar-overlay ${state.mobile?'is-open':''}" data-action="close-menu"></div>`;
}
function sidebar(active){
  return `<aside class="sidebar ${state.mobile?'is-open':''}" aria-label="Primary navigation"><a class="brand" href="#/start"><div class="brand-logomark">RD<span>///</span></div><div><strong>REFERRAL</strong><small>DISPATCH</small></div></a><div class="sidebar-rule"></div><div class="sidebar-section-label mono">AFFILIATE / DEMO 001</div><nav class="side-nav">${nav.map(([id,title,ico])=>`<a class="nav-item ${active===id?'active':''}" href="#/${id}" ${active===id?'aria-current="page"':''}>${icon(ico,18)}<span>${title}</span>${id==='messages'&&fixture.messages.some(m=>m.unread)?'<span class="nav-count">NEW</span>':''}</a>`).join('')}</nav><div class="sidebar-spacer"></div><div class="sidebar-help"><span class="mono">DISPATCH SUPPORT</span><strong>Referral workflow help</strong><a href="mailto:admin@distilledfunding.com">admin@distilledfunding.com ${icon('arrow',15)}</a></div><div class="sidebar-footer"><span>MOONSHINE CAPITAL</span><span>DEMO / 2026</span></div></aside>`;
}
function topbar(active){
  const unread=state.unread.size;
  return `<header class="topbar"><div><button class="icon-button mobile-menu" data-action="open-menu" aria-expanded="${state.mobile}">${icon('menu',21)}</button><span class="crumbs mono">AFFILIATE WORKSPACE / ${esc(nav.find(n=>n[0]===active)?.[1]||active)}</span></div><div class="topbar-actions"><span class="demo-pill"><i></i> DEMO · FICTIONAL DATA</span><div class="notifications-wrap"><button class="icon-button" data-action="toggle-notifications" aria-label="${unread} unread notifications">${icon('bell',18)}${unread?`<em>${unread}</em>`:''}</button>${state.notifications?notificationPanel():''}</div><a class="user-chip" href="#/settings"><span class="avatar">JE</span><span>JORDAN E.</span></a></div></header>`;
}
function notificationPanel(){
  return `<div class="notification-panel"><div class="notification-header"><div><span class="mono">DISPATCH ALERTS</span><h3>Notifications</h3></div><button class="icon-button small" data-action="toggle-notifications">${icon('close',17)}</button></div>${fixture.notifications.map(n=>`<a class="notification ${state.unread.has(n.id)?'unread':''}" href="${esc(n.href)}" data-notification="${esc(n.id)}"><i></i><span><b>${esc(n.title)}</b><small>${esc(n.body)}</small><em class="mono">${date(n.date)}</em></span>${icon('arrow',15)}</a>`).join('')}<button class="notification-clear" data-action="read-all">Mark all demo alerts read</button></div>`;
}
function footer(){return `<footer class="workspace-footer"><span class="mono">REFERRAL DISPATCH / AFFILIATE DEMO</span><span>Fictional data · No live integrations</span><a href="#/messages">Support ${icon('arrow',14)}</a></footer>`;}
function startPage(){
  return `<div class="entry"><div class="entry-nav"><div class="entry-brand"><b>RD<span>///</span></b><span class="mono">MOONSHINE CAPITAL / AFFILIATE</span></div><span class="demo-pill"><i></i> DEMO · FICTIONAL DATA</span></div><div class="entry-grid"><section class="entry-intro"><div class="entry-eyebrow mono"><i></i> REFERRAL OPERATIONS / CONCEPT 002</div><h1>YOUR REFERRAL<br>OPERATION<br><em>STARTS HERE.</em></h1><p>Your referrals. Your pipeline. Your next move.</p><div class="entry-cta">${btn('#/overview','Explore Demo Workspace','lime')}<span class="mono">NO SIGN-IN · FICTIONAL RECORDS ONLY</span></div></section><aside class="entry-visual"><div class="entry-visual-heading mono"><span>REFERRAL DISPATCH</span><span>DEMO DATA</span></div><div class="entry-visual-plate"><div class="visual-alert">01 / NEXT ACTION ${icon('arrow',24)}</div><div class="visual-core"><span class="mono">LINKED REFERRAL</span><strong>Confirm the introduction request.</strong><p>REF-26-1042 · Harborline Supply Co.</p></div><div class="visual-foot"><span class="mono">PIPELINE</span><b>SUBMITTED → IN PROGRESS → FUNDED</b></div></div></aside></div><div class="entry-bottom"><span>FRONTEND DEMO — NO LIVE ACCOUNT ACCESS</span><div class="signin">Future unified sign-in <b>Not connected in demo</b></div></div></div>`;
}
function referralById(id){return fixture.referrals.find(r=>r.id===id);}
function overviewPage(){
  const dispatch=fixture.referrals.find(r=>r.status==='needs-action')||fixture.referrals[0];
  const counts={submitted:fixture.referrals.filter(r=>r.status==='submitted').length,inProgress:fixture.referrals.filter(r=>r.status==='in-progress').length,funded:fixture.referrals.filter(r=>r.status==='funded').length};
  return `${pageHead('COMMAND OVERVIEW / THURSDAY, 19 NOV 2026','Good to have you back, Jordan.','Track referrals, move the next action, and keep the launch on course.')}<section class="dispatch"><div class="dispatch-top"><span class="mono"><i></i> REFERRAL DISPATCH / ${dispatch.id}</span><span class="mono">PRIORITY 01</span></div><div class="dispatch-body"><div><span class="dispatch-eyebrow">NEXT REQUIRED MOVE</span><h2>${esc(dispatch.nextAction)} ↗</h2><p>${esc(dispatch.alias)} · ${esc(dispatch.provider)} · ${esc(dispatch.category)}</p><div class="dispatch-actions">${btn(`#/referrals/${dispatch.id}`,'Open Referral Dossier','dark')}<a class="plain-link" href="#/messages">Ask support ${icon('arrow',15)}</a></div></div><aside><span class="mono">AFFILIATE-VISIBLE STATUS</span><strong>${esc(dispatch.affiliateStatus)}</strong><span class="mono">LAST UPDATE</span><b>${date(dispatch.updatedAt)}</b></aside></div></section><div class="pipeline-strip">${sectionTitle('02','Referral Pipeline')}<div class="pipeline-stages"><a href="#/referrals?filter=Submitted"><span>SUBMITTED</span><strong>${counts.submitted}</strong></a><a href="#/referrals?filter=In%20Progress"><span>IN PROGRESS</span><strong>${counts.inProgress}</strong></a><a href="#/referrals?filter=Funded"><span>FUNDED</span><strong>${counts.funded}</strong></a><a href="#/commissions"><span>LEDGER ITEMS</span><strong>${fixture.commissionLedger.length}</strong></a></div></div><div class="overview-grid"><section class="surface">${sectionTitle('03','Recent Referral Activity')}<ol class="activity-list">${fixture.activityEvents.map(a=>`<li><span class="activity-icon">${icon('pulse',16)}</span><div><b>${esc(a.title)}</b><p>${esc(a.type)} · ${a.count} · ${date(a.date)}</p><a href="#/referrals/${esc(a.referralId)}" class="mini-link">${esc(a.referralId)} ${icon('arrow',13)}</a></div></li>`).join('')}</ol></section><section class="surface quick-panel">${sectionTitle('04','Next Moves')}<a href="#/referrals"><strong>Review all referrals</strong><span>${icon('arrow',18)}</span></a><a href="#/launch"><strong>Complete launch center</strong><span>${icon('arrow',18)}</span></a><a href="#/messages"><strong>Open support</strong><span>${icon('arrow',18)}</span></a></section></div>`;
}

function filteredReferrals(){
  let rows=[...fixture.referrals];
  const q=state.referralSearch.trim().toLowerCase();
  if(q) rows=rows.filter(r=>[r.id,r.alias,r.provider,r.category,r.affiliateStatus,r.nextAction].some(v=>v.toLowerCase().includes(q)));
  if(state.referralFilter==='Needs Action')rows=rows.filter(r=>r.status==='needs-action');
  if(state.referralFilter==='Submitted')rows=rows.filter(r=>r.status==='submitted');
  if(state.referralFilter==='In Progress')rows=rows.filter(r=>r.status==='in-progress');
  if(state.referralFilter==='Funded')rows=rows.filter(r=>r.status==='funded');
  if(state.referralFilter==='Closed')rows=rows.filter(r=>r.status==='closed');
  if(state.referralSort==='updated-asc')rows.sort((a,b)=>a.updatedAt.localeCompare(b.updatedAt));
  else if(state.referralSort==='business')rows.sort((a,b)=>a.alias.localeCompare(b.alias));
  else if(state.referralSort==='submitted')rows.sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt));
  else rows.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  return rows;
}
function referralsPage(){
  const filters=['All','Needs Action','Submitted','In Progress','Funded','Closed'];
  const param=new URLSearchParams(location.hash.split('?')[1]||'');
  if(param.get('filter')&&filters.includes(param.get('filter')))state.referralFilter=param.get('filter');
  const rows=filteredReferrals();
  const controls=`<button class="btn btn-dark" data-action="submit-referral">${icon('plus',17)} Submit a Referral</button>`;
  const table=rows.length?`<div class="desktop-table-wrap"><table class="data-table"><thead><tr><th>Referral / business</th><th>Channel / provider</th><th>Category</th><th>Submitted / updated</th><th>Status</th><th>Next action</th><th></th></tr></thead><tbody>${rows.map(r=>`<tr><td><a class="table-business" href="#/referrals/${r.id}">${esc(r.alias)}</a><span class="mono table-ref">${r.id}</span></td><td><strong>${esc(r.channel)}</strong><small>${esc(r.provider)}</small></td><td>${esc(r.category)}</td><td><span>${date(r.submittedAt)}</span><small>Updated ${date(r.updatedAt)}</small></td><td>${statusBadge(r.status)}</td><td>${esc(r.nextAction)}</td><td><a class="row-arrow" href="#/referrals/${r.id}" aria-label="Open ${r.id}">${icon('arrow',18)}</a></td></tr>`).join('')}</tbody></table></div><div class="app-mobile-list">${rows.map(r=>`<a class="app-mobile-card" href="#/referrals/${r.id}"><div><span class="mono">${r.id}</span>${statusBadge(r.status)}</div><h3>${esc(r.alias)}</h3><p>${esc(r.provider)} · ${esc(r.category)}</p><b>${esc(r.nextAction)}</b></a>`).join('')}</div>`:`<div class="empty-state"><h3>No referrals found</h3><p>Try another search or status filter.</p><button class="btn btn-outline" data-action="clear-referral-filter">Clear filters</button></div>`;
  return `${pageHead('PIPELINE / REFERRAL RECORDS','My Referrals','Search submitted opportunities and open their affiliate-visible dossier.',controls)}<div class="toolbar"><label class="search-box">${icon('search',17)}<span class="sr-only">Search referrals</span><input id="referral-search" type="search" value="${esc(state.referralSearch)}" placeholder="Search referral, alias or provider"></label><select id="referral-sort" aria-label="Sort referrals"><option value="updated-desc">Last updated</option><option value="submitted">Newest submitted</option><option value="business">Business name</option><option value="updated-asc">Oldest update</option></select></div><div class="filter-row">${filters.map(f=>`<button class="filter-chip ${state.referralFilter===f?'selected':''}" data-referral-filter="${esc(f)}">${esc(f)}</button>`).join('')}</div>${table}<div class="table-caption mono">SHOWING ${rows.length} OF ${fixture.referrals.length} FICTIONAL REFERRALS</div>`;
}
function detailPage(id){
  const r=referralById(id);
  if(!r)return shell('referrals',`<div class="empty-state"><h3>Referral not found</h3><p>Return to the fictional referral list.</p>${btn('#/referrals','Back to Referrals','dark')}</div>`);
  const stages=['Submitted','In Progress','Funded','Closed'];
  const current=Math.max(0,stages.findIndex(s=>r.affiliateStatus===s));
  return `${pageHead(`REFERRAL DOSSIER / ${r.id}`,'Referral Dossier',`${r.alias} · ${r.provider}`,`<a class="btn btn-outline" href="#/referrals">${icon('arrow',17)} Back to Referrals</a>`)}<div class="dossier-grid"><section class="surface dossier-main"><div class="dossier-fields"><div><span>SAFE BUSINESS ALIAS</span><strong>${esc(r.alias)}</strong></div><div><span>CHANNEL</span><strong>${esc(r.channel)}</strong></div><div><span>PROVIDER / PROGRAM</span><strong>${esc(r.provider)}</strong></div><div><span>FUNDING CATEGORY</span><strong>${esc(r.category)}</strong></div></div><div class="stage-rail">${stages.map((s,i)=>`<div class="${i===current?'current':i<current?'done':''}"><b>${String(i+1).padStart(2,'0')}</b><span>${s}</span></div>`).join('')}</div><h3>Affiliate-visible timeline</h3><ol class="timeline">${r.timeline.map(t=>`<li><time>${date(t.date)}</time><div><strong>${esc(t.title)}</strong><p>${esc(t.detail)}</p></div></li>`).join('')}</ol></section><aside class="dossier-side"><div class="dispatch-mini"><span class="mono">REQUIRED NEXT STEP</span><h2>${esc(r.nextAction)}</h2><p>${esc(r.affiliateStatus)} is the affiliate-visible state. Submission or funding is not an approval or commission guarantee.</p>${btn('#/messages','Contact Support','lime')}</div><div class="surface"><span class="mono">SUPPORT CONTACT</span><p><strong>admin@distilledfunding.com</strong><br>General affiliate support only.</p></div></aside></div>`;
}
function filteredCommissions(){
  if(state.commissionFilter==='All')return fixture.commissionLedger;
  if(state.commissionFilter==='Illustrative')return fixture.commissionLedger.filter(c=>c.stage==='Illustrative');
  if(state.commissionFilter==='Pending')return fixture.commissionLedger.filter(c=>c.stage==='Pending Verification');
  return fixture.commissionLedger.filter(c=>c.stage===state.commissionFilter);
}
function commissionsPage(){
  const rows=filteredCommissions();
  const established=fixture.commissionLedger.filter(c=>c.established).reduce((sum,c)=>sum+(c.amount||0),0);
  return `${pageHead('FINANCIAL ACTIVITY / FICTIONAL','Commission Ledger','Separate provider records, verification stages and illustrative estimates.')}<div class="ledger-disclosure"><strong>Demo figures are fictional and do not represent expected earnings.</strong><span>Illustrative estimates are not confirmed earnings or payout balances.</span></div><div class="commission-summary"><div><span>CONFIRMED / PAID DEMO</span><strong>${money(established)}</strong></div><div><span>ILLUST. ESTIMATE ITEMS</span><strong>${fixture.commissionLedger.filter(c=>c.stage==='Illustrative').length}</strong></div><div><span>PENDING VERIFICATION</span><strong>${fixture.commissionLedger.filter(c=>c.stage==='Pending Verification').length}</strong></div></div><div class="filter-row">${['All','Illustrative','Pending','Approved','Paid','Reversed'].map(f=>`<button class="filter-chip ${state.commissionFilter===f?'selected':''}" data-commission-filter="${esc(f)}">${f==='Pending'? 'Pending Verification':esc(f)}</button>`).join('')}</div>${rows.length?`<div class="commission-table"><table class="data-table"><thead><tr><th>Commission / referral</th><th>Provider / program</th><th>Basis</th><th>Amount</th><th>Stage</th><th>Event date</th></tr></thead><tbody>${rows.map(c=>`<tr><td><strong>${esc(c.id)}</strong><small><a href="#/referrals/${esc(c.referralId)}">${esc(c.referralId)}</a></small></td><td><strong>${esc(c.provider)}</strong><small>${esc(c.program)}</small></td><td>${esc(c.basis)}</td><td class="${c.stage==='Illustrative'?'muted':''}">${money(c.amount)}</td><td><span class="stage-badge stage-${c.stage.toLowerCase().replaceAll(' ','-')}">${esc(statusMap.commissionStages[c.stage]||c.stage)}</span></td><td>${date(c.eventDate)}</td></tr>`).join('')}</tbody></table></div>`:`<div class="empty-state"><h3>No ledger items match</h3><p>Choose All or another commission stage.</p><button class="btn btn-outline" data-action="clear-commission-filter">Show All</button></div>`}`;
}
function activityPage(){
  const goalKeys=[['conversations','Conversations'],['introductions','Introductions'],['submissions','Submitted Referrals'],['followUps','Follow-ups']];
  const ratioRows=goalKeys.map(([k,label])=>({label,current:state.activity[k],goal:state.goal[k]}));
  return `${pageHead('USER-ENTERED DEMO / NO GUARANTEE','Activity & Goals','Set an illustrative target and add demo activity. Reset anytime.')}<div class="activity-grid"><section class="surface"><div class="section-title"><div><span class="index-no">01</span><h2>Daily activity pulse</h2></div><button class="btn btn-outline" data-action="reset-activity">${icon('plus',16)} Reset Demo</button></div><div class="activity-controls">${goalKeys.map(([k,label])=>`<div><span>${esc(label)}</span><strong>${state.activity[k]}</strong><button class="btn btn-dark" data-add="${k}" aria-label="Add ${esc(label)}">+ 1</button></div>`).join('')}</div></section><section class="surface"><div class="section-title"><div><span class="index-no">02</span><h2>Illustrative goals</h2></div></div><div class="goal-fields">${goalKeys.map(([k,label])=>`<label>${esc(label)}<input type="number" min="0" max="999" data-goal="${k}" value="${state.goal[k]}"></label>`).join('')}</div><p class="under-note">Conversion ratios are configurable examples only. This demo never predicts income or funding outcomes.</p></section></div><section class="surface progress-panel"><div class="section-title"><div><span class="index-no">03</span><h2>Goal progress</h2></div></div><div class="progress-bars">${ratioRows.map(r=>{const pct=r.goal>0?Math.min(100,Math.round(r.current/r.goal*100)):0;return `<div><div><strong>${esc(r.label)}</strong><span>${r.current} / ${r.goal}</span></div><div class="progress-track"><i style="width:${pct}%"></i></div></div>`}).join('')}</div></section>`;
}

function launchPage(){
  const items=[
    ['Orientation','Review the Referral Dispatch, pipeline and affiliate-visible status concepts.'],
    ['Approved Products','Understand that provider and program details vary.'],
    ['Compliance & Disclosures','Use only approved disclosures and avoid qualification claims.'],
    ['Referral Workflow','Learn submission, handoff and affiliate-next-action patterns.'],
    ['CRM Handoff','Preserve source IDs and avoid duplicate records in a future integration.'],
    ['Training','Review future approved content such as Game Plan or Simple System.'],
    ['First Outreach','Prepare a compliant, clearly labeled draft conversation.'],
    ['Follow-Up','Schedule a disclosed next touch; never imply approval.']
  ];
  const done=state.onboarding.size;
  return `${pageHead('AGENT LAUNCH / ONBOARDING','Agent Launch Center','Complete the fictional launch sequence before your first outreach.')}<div class="launch-layout"><section class="surface launch-checklist"><div class="section-title"><div><span class="index-no">01</span><h2>Launch checklist</h2></div><span class="mono">${done} / ${items.length} COMPLETE</span></div>${items.map((item,i)=>`<label class="check-row ${state.onboarding.has(i)?'done':''}"><input type="checkbox" data-check="${i}" ${state.onboarding.has(i)?'checked':''}><span>${String(i+1).padStart(2,'0')}</span><div><strong>${esc(item[0])}</strong><p>${esc(item[1])}</p></div></label>`).join('')}<button class="btn btn-outline" data-action="reset-onboarding">Reset checklist</button></section><aside class="launch-side"><div class="launch-score"><span class="mono">LAUNCH STATUS</span><strong>${done===items.length?'READY TO PRACTICE':'IN BUILD'}</strong><div class="progress-track"><i style="width:${Math.round(done/items.length*100)}%"></i></div></div><div class="surface"><span class="mono">OPTIONAL PROGRAM REFERENCES</span><h3>DAC / Bank Breezy</h3><p>One provider channel among several. Any referenced DAC training or pay plan is not a Moonshine-wide compensation schedule.</p><h3>Future named content</h3><p>Game Plan, Simple System Onboard Checklist, Building a Strong Foundation and Launching Other Agents may be linked only after approved content is available.</p></div></aside></div>`;
}
function resourcesPage(){
  const cats=['All','Getting Started','Referral Conversations','Product Basics','Follow-Up','Compliance','Tools'];
  const rows=fixture.resources.filter(r=>state.resourceFilter==='All'||r.category===state.resourceFilter);
  return `${pageHead('APPROVED ASSET LIBRARY / FUTURE','Resources & Swipe Files','Training cards and clearly labeled draft scripts.')}<div class="filter-row">${cats.map(c=>`<button class="filter-chip ${state.resourceFilter===c?'selected':''}" data-resource-filter="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="resource-grid">${rows.map(r=>`<article class="resource-card"><div class="resource-top"><span class="mono">${esc(r.category)}</span><span>${esc(r.id)}</span></div><h3>${esc(r.title)}</h3><p>${esc(r.summary)}</p><div class="draft-script"><span class="mono">DEMO DRAFT · NOT PREAPPROVED</span><blockquote>${esc(r.draft)}</blockquote></div><button class="text-arrow" data-resource="${esc(r.id)}">Open resource ${icon('arrow',18)}</button></article>`).join('')}</div>`;
}
function messagesPage(){
  const thread=fixture.messages.find(m=>m.id===state.activeThread)||fixture.messages[0];
  return `${pageHead('AFFILIATE-SAFE SUPPORT','Messages & Support','Fictional support threads; no applicant communications or internal notes.')}<div class="message-layout"><aside class="thread-list"><div class="thread-head mono">SUPPORT THREADS / ${fixture.messages.length}</div>${fixture.messages.map(m=>`<button class="thread ${state.activeThread===m.id?'active':''}" data-thread="${esc(m.id)}"><span><b>${esc(m.subject)}</b><small>${esc(m.referralId)} · ${date(m.date)}</small></span>${m.unread?'<i>NEW</i>':''}</button>`).join('')}</aside><section class="message-thread"><div class="thread-title"><div><span class="mono">${esc(thread.referralId)}</span><h2>${esc(thread.subject)}</h2></div><a class="mini-link" href="mailto:admin@distilledfunding.com">Email general support ${icon('external',14)}</a></div><div class="messages">${thread.messages.map(m=>`<div class="message-bubble ${m.direction==='out'?'out':''}"><span class="mono">${esc(m.from)} · ${date(m.date)}</span><p>${esc(m.body)}</p></div>`).join('')}</div><form class="compose" data-compose><label for="demo-message">Demo draft</label><textarea id="demo-message" rows="4" placeholder="Type a fictional support draft…"></textarea><div><span class="mono">Demo only — no message sent.</span><button class="btn btn-dark" type="submit">${icon('send',16)} Add Demo Draft</button></div></form></section></div>`;
}
function settingsPage(){
  const a=fixture.affiliate;
  return `${pageHead('FICTIONAL PROFILE','Account & Settings','Profile, authorized programs and in-memory notification preferences.')}<div class="settings-grid"><section class="surface"><div class="section-title"><div><span class="index-no">01</span><h2>Demo profile</h2></div></div><div class="settings-profile"><span class="avatar large">JE</span><div><strong>${esc(a.firstName)} ${esc(a.lastName)}</strong><p>${esc(a.email)}</p></div></div><div class="dossier-fields"><div><span>AFFILIATE ID</span><strong>${esc(a.id)}</strong></div><div><span>AGENCY</span><strong>${esc(a.agency)}</strong></div></div><h3>Authorized demo programs</h3><ul class="program-list">${a.programs.map(p=>`<li>${icon('check',16)} ${esc(p)}</li>`).join('')}</ul></section><section class="surface"><div class="section-title"><div><span class="index-no">02</span><h2>Communication preferences</h2></div></div><label class="toggle-row"><div><strong>Operational notices</strong><small>Referral activity and support notifications</small></div><input type="checkbox" data-preference="service" ${state.profile.service?'checked':''}></label><label class="toggle-row"><div><strong>Marketing opt-in</strong><small>Separate fictional marketing preference</small></div><input type="checkbox" data-preference="marketing" ${state.profile.marketing?'checked':''}></label><button class="btn btn-dark" data-action="save-preferences">Save in Demo Memory</button><button class="btn btn-outline" data-action="reset-demo">Reset entire demo</button><p class="under-note">This static prototype has no authentication, passwords, MFA, sessions or banking details.</p></section></div>`;
}

function render(){
  const r=route();
  let content;
  if(r.name==='start')content=startPage();
  else if(r.name==='overview')content=overviewPage();
  else if(r.name==='referrals')content=r.id?detailPage(r.id):referralsPage();
  else if(r.name==='commissions')content=commissionsPage();
  else if(r.name==='activity')content=activityPage();
  else if(r.name==='launch')content=launchPage();
  else if(r.name==='resources')content=resourcesPage();
  else if(r.name==='messages')content=messagesPage();
  else if(r.name==='settings')content=settingsPage();
  else content=overviewPage();
  root.innerHTML=r.name==='start'?content:shell(r.name,content);
  document.title=r.name==='start'?'Referral Dispatch — Affiliate Workspace':`${nav.find(n=>n[0]===r.name)?.[1]||'Affiliate'} — Referral Dispatch`;
  window.scrollTo({top:0,behavior:'auto'});
}
document.addEventListener('click',event=>{
  const el=event.target.closest('[data-action],[data-referral-filter],[data-commission-filter],[data-resource-filter],[data-thread],[data-resource],[data-notification],[data-add],[data-preference],[data-check]');
  if(!el)return;
  if(el.dataset.action==='open-menu'){state.mobile=true;render();}
  if(el.dataset.action==='close-menu'){state.mobile=false;render();}
  if(el.dataset.action==='toggle-notifications'){state.notifications=!state.notifications;render();}
  if(el.dataset.action==='read-all'){state.unread.clear();state.notifications=false;toast('Demo alerts marked read');render();}
  if(el.dataset.action==='close-dialog'){dialog.close();}
  if(el.dataset.action==='submit-referral'){dialogOpen('Submit a Referral — Integration Placeholder','<div class="placeholder-panel"><span class="mono">INTEGRATION NOT CONNECTED</span><h3>No verified referral intake route is configured.</h3><p>This demo does not collect applicant data or connect to Tally, Supabase, a CRM or a provider system.</p></div>');}
  if(el.dataset.action==='clear-referral-filter'){state.referralFilter='All';state.referralSearch='';render();}
  if(el.dataset.action==='clear-commission-filter'){state.commissionFilter='All';render();}
  if(el.dataset.action==='reset-activity'){state.activity={conversations:0,introductions:0,submissions:0,followUps:0};toast('Demo activity reset');render();}
  if(el.dataset.action==='reset-onboarding'){state.onboarding=new Set([0,1]);toast('Onboarding reset');render();}
  if(el.dataset.action==='save-preferences'){toast('Preferences saved in demo memory only');}
  if(el.dataset.action==='reset-demo'){state.onboarding=new Set([0,1]);state.activity={conversations:0,introductions:0,submissions:0,followUps:0};state.goal={...fixture.goalDefaults};state.profile={service:true,marketing:false};toast('Entire demo reset');render();}
  if(el.dataset.referralFilter){state.referralFilter=el.dataset.referralFilter;render();}
  if(el.dataset.commissionFilter){state.commissionFilter=el.dataset.commissionFilter;render();}
  if(el.dataset.resourceFilter){state.resourceFilter=el.dataset.resourceFilter;render();}
  if(el.dataset.thread){state.activeThread=el.dataset.thread;render();}
  if(el.dataset.resource){const r=fixture.resources.find(v=>v.id===el.dataset.resource);if(r)dialogOpen(r.title,`<div class="resource-dialog"><span class="mono">${esc(r.category)} · ${esc(r.integration)}</span><p>${esc(r.summary)}</p><div class="draft-script"><span class="mono">DEMO DRAFT · NOT PREAPPROVED</span><blockquote>${esc(r.draft)}</blockquote></div></div>`);}
  if(el.dataset.notification){state.unread.delete(el.dataset.notification);}
  if(el.dataset.add){const k=el.dataset.add;state.activity[k]=(state.activity[k]||0)+1;toast(`Demo ${k} activity added`);render();}
  if(el.dataset.preference){/* changed by native input handler */ }
  if(el.dataset.check){/* changed by native input handler */ }
});
document.addEventListener('input',event=>{
  if(event.target.id==='referral-search'){state.referralSearch=event.target.value;const pos=event.target.selectionStart;render();const input=document.getElementById('referral-search');if(input){input.focus();input.setSelectionRange(pos,pos);} }
  if(event.target.dataset.goal){const n=Math.max(0,Number(event.target.value)||0);state.goal[event.target.dataset.goal]=n;render();}
});
document.addEventListener('change',event=>{
  if(event.target.id==='referral-sort'){state.referralSort=event.target.value;render();}
  if(event.target.dataset.preference){state.profile[event.target.dataset.preference]=event.target.checked;}
  if(event.target.dataset.check){const i=Number(event.target.dataset.check);event.target.checked?state.onboarding.add(i):state.onboarding.delete(i);render();}
});
document.addEventListener('submit',event=>{
  if(event.target.matches('[data-compose]')){
    event.preventDefault();const text=event.target.querySelector('textarea').value.trim();
    if(!text){toast('Enter a demo draft first');return;}
    toast('Demo draft added — no message sent');event.target.querySelector('textarea').value='';
  }
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){state.mobile=false;state.notifications=false;render();}
});
init();
