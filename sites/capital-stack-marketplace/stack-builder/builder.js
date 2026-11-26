const steps = [
  { id:"stage", title:"Deal stage", fields:[
    {key:"stage", label:"Deal stage", type:"select", options:[
      ["loi","LOI signed"],["under_loi","Under LOI"],["diligence","Early diligence"],["exploring","Just exploring"]
    ], help:"Used to set expectations for docs + timeline."}
  ]},
  { id:"snapshot", title:"Deal snapshot", fields:[
    {key:"price", label:"Purchase price (USD)", type:"number", placeholder:"e.g. 2500000"},
    {key:"ebitda", label:"TTM EBITDA (USD)", type:"number", placeholder:"e.g. 550000"},
    {key:"cash", label:"Cash down available (USD)", type:"number", placeholder:"e.g. 250000"},
    {key:"timeline", label:"Target close timeline", type:"select", options:[
      ["30","30 days"],["60","60 days"],["90","90+ days"]
    ]},
    {key:"seller_note", label:"Seller note willingness", type:"select", options:[
      ["yes","Yes"],["maybe","Maybe"],["no","No"],["unknown","Unknown"]
    ]}
  ]},
  { id:"quality", title:"Deal quality", fields:[
    {key:"concentration", label:"Top customer % of revenue", type:"select", options:[
      ["lt10","<10%"],["10to25","10–25%"],["25to40","25–40%"],["gt40",">40%"],["unknown","Unknown"]
    ]},
    {key:"recurring", label:"Revenue type", type:"select", options:[
      ["mostly_recurring","Mostly recurring"],["mixed","Mixed"],["mostly_one_time","Mostly one-time"]
    ]},
    {key:"seasonality", label:"Seasonality", type:"select", options:[
      ["low","Low"],["medium","Medium"],["high","High"]
    ]},
    {key:"addbacks", label:"Add-backs quality", type:"select", options:[
      ["clean","Clean"],["mixed","Mixed"],["aggressive","Aggressive"],["unknown","Unknown"]
    ]},
    {key:"wc", label:"Working capital needs", type:"select", options:[
      ["low","Low"],["medium","Medium"],["high","High"],["unknown","Unknown"]
    ]}
  ]},
  { id:"buyer", title:"Buyer profile", fields:[
    {key:"buyer_type", label:"Buyer type", type:"select", options:[
      ["first_time","First-time buyer"],["operator","Operator"],["sponsor","Independent sponsor"],["broker","Broker/advisor"]
    ]},
    {key:"experience", label:"Relevant operating/investing experience", type:"select", options:[
      ["none","None"],["some","Some"],["strong","Strong"]
    ]},
    {key:"post_close_liquidity", label:"Liquidity after close", type:"select", options:[
      ["tight","Tight"],["okay","Okay"],["strong","Strong"]
    ]}
  ]},
  { id:"assets", title:"Assets / collateral", fields:[
    {key:"ar", label:"Accounts receivable (approx USD)", type:"number", placeholder:"0 if none"},
    {key:"inventory", label:"Inventory (approx USD)", type:"number", placeholder:"0 if none"},
    {key:"equipment", label:"Equipment value (approx USD)", type:"number", placeholder:"0 if none"},
    {key:"real_estate", label:"Real estate included? (approx USD)", type:"number", placeholder:"0 if none"},
    {key:"refi", label:"Existing debt to refinance?", type:"select", options:[["no","No"],["yes","Yes"]]}
  ]},
  { id:"opt", title:"Output preference", fields:[
    {key:"optimize", label:"Optimize for", type:"select", options:[
      ["lowest_cost","Lowest cost"],["fastest_close","Fastest close"],["highest_leverage","Highest leverage"],["flexibility","Most flexible"]
    ], help:"We’ll bias the suggested mixes. Not a guarantee."}
  ]},
  { id:"gate", title:"Unlock results", fields:[
    {key:"name", label:"Name", type:"text", placeholder:"Alex"},
    {key:"email", label:"Email", type:"email", placeholder:"alex@company.com"},
    {key:"consent", label:"I agree to be contacted about deal review + financing options.", type:"checkbox"}
  ]}
];

const state = {
  stepIndex: 0,
  data: {
    stage:"exploring",
    timeline:"60",
    seller_note:"unknown",
    concentration:"unknown",
    recurring:"mixed",
    seasonality:"medium",
    addbacks:"unknown",
    wc:"unknown",
    buyer_type:"first_time",
    experience:"some",
    post_close_liquidity:"okay",
    price: null, ebitda: null, cash: null,
    ar:0, inventory:0, equipment:0, real_estate:0,
    refi:"no",
    optimize:"lowest_cost",
    name:"", email:"", consent:false
  }
};

function renderStepList(){
  const root = $("#stepList");
  root.innerHTML = "";
  steps.forEach((s, idx)=>{
    const div = document.createElement("div");
    div.className = "step-item" + (idx===state.stepIndex ? " active":"") + (idx<state.stepIndex ? " done":"");
    div.innerHTML = `<div><b>${idx+1}.</b> ${s.title}</div><div class="badge">${idx<state.stepIndex ? "Done" : idx===state.stepIndex ? "Now" : "Next"}</div>`;
    root.appendChild(div);
  });
}

function fieldEl(field){
  const wrap = document.createElement("div");
  wrap.className="field";
  const id = `f_${field.key}`;
  if(field.type !== "checkbox"){
    wrap.innerHTML = `<label for="${id}">${field.label}</label>`;
  }
  let input;
  if(field.type==="select"){
    input = document.createElement("select");
    input.id = id;
    field.options.forEach(([v,l])=>{
      const opt = document.createElement("option");
      opt.value = v; opt.textContent = l;
      input.appendChild(opt);
    });
    input.value = state.data[field.key] ?? field.options[0][0];
  } else if(field.type==="checkbox"){
    input = document.createElement("input");
    input.type="checkbox";
    input.id=id;
    input.checked = !!state.data[field.key];
    const lab = document.createElement("label");
    lab.setAttribute("for", id);
    lab.textContent = field.label;
    lab.style.color="var(--text)";
    lab.style.fontSize="13px";
    wrap.appendChild(input);
    wrap.appendChild(lab);
    wrap.style.flexDirection="row";
    wrap.style.alignItems="center";
    wrap.style.gap="10px";
  } else {
    input = document.createElement("input");
    input.type = field.type;
    input.id = id;
    input.placeholder = field.placeholder || "";
    if(state.data[field.key] !== null && state.data[field.key] !== undefined){
      input.value = state.data[field.key];
    }
  }
  if(field.type !== "checkbox"){
    wrap.appendChild(input);
  }
  if(field.help){
    const help = document.createElement("div");
    help.className="small";
    help.style.color="var(--muted)";
    help.textContent = field.help;
    wrap.appendChild(help);
  }
  input.addEventListener("input", ()=>saveField(field, input));
  input.addEventListener("change", ()=>saveField(field, input));
  return wrap;
}

function saveField(field, input){
  if(field.type==="number"){
    const v = input.value.trim()==="" ? null : Number(input.value);
    state.data[field.key] = (v===null || isNaN(v)) ? null : v;
  } else if(field.type==="checkbox"){
    state.data[field.key] = input.checked;
  } else {
    state.data[field.key] = input.value;
  }
  updateProgress();
}

function renderStep(){
  renderStepList();
  const step = steps[state.stepIndex];
  $("#stepTitle").textContent = step.title;
  const form = $("#stepFields");
  form.innerHTML = "";
  // layout: allow 2 columns for numeric clusters in some steps
  const keys2col = new Set(["price","ebitda","cash","timeline","seller_note","ar","inventory","equipment","real_estate","refi"]);
  let row = document.createElement("div");
  row.className="row2";
  let inRow=0;

  step.fields.forEach((f)=>{
    const el = fieldEl(f);
    if(keys2col.has(f.key) && f.type!=="checkbox"){
      row.appendChild(el);
      inRow++;
      if(inRow===2){
        form.appendChild(row);
        row = document.createElement("div");
        row.className="row2";
        inRow=0;
      }
    } else {
      if(inRow>0){
        form.appendChild(row);
        row = document.createElement("div");
        row.className="row2";
        inRow=0;
      }
      form.appendChild(el);
    }
  });
  if(inRow>0) form.appendChild(row);

  $("#btnBack").disabled = state.stepIndex===0;
  $("#btnNext").textContent = state.stepIndex===steps.length-1 ? "Generate stacks" : "Continue";
}

function updateProgress(){
  const pct = Math.round((state.stepIndex) / (steps.length-1) * 100);
  $("#progressBar").style.width = pct + "%";
}

function validateStep(){
  const step = steps[state.stepIndex];
  if(step.id==="snapshot"){
    if(!state.data.price || !state.data.ebitda){
      return {ok:false, msg:"Add purchase price + EBITDA so the stacks aren’t nonsense."};
    }
  }
  if(step.id==="gate"){
    const ok = (state.data.email && state.data.email.includes("@") && state.data.consent);
    if(!ok) return {ok:false, msg:"Add email + consent to unlock results (we’ll send your fix-first plan)."};
  }
  return {ok:true};
}

function riskScore(d){
  let r=0;
  const conc = d.concentration;
  if(conc==="10to25") r+=1;
  else if(conc==="25to40") r+=2;
  else if(conc==="gt40") r+=3;
  else if(conc==="unknown") r+=1;

  if(d.seasonality==="medium") r+=1;
  if(d.seasonality==="high") r+=2;

  if(d.addbacks==="mixed") r+=1;
  if(d.addbacks==="aggressive") r+=3;
  if(d.addbacks==="unknown") r+=1;

  if(d.post_close_liquidity==="tight") r+=2;
  if(d.post_close_liquidity==="okay") r+=1;

  if(d.experience==="none") r+=2;
  if(d.experience==="some") r+=1;

  if(d.wc==="high") r+=2;
  if(d.wc==="unknown") r+=1;

  // clamp 0..12
  return clamp(r,0,12);
}

function canUseABL(d){
  const collateral = (Number(d.ar||0) + Number(d.inventory||0) + Number(d.equipment||0)) || 0;
  return collateral >= 150000 || (d.wc==="high");
}

function baseSeniorDebtPct(d, risk){
  // baseline: 65% good deals, drop with risk, increase with strong experience/liquidity
  let pct = 0.65 - (risk * 0.03);
  if(d.experience==="strong") pct += 0.04;
  if(d.post_close_liquidity==="strong") pct += 0.03;
  if(d.concentration==="gt40") pct -= 0.06;
  if(d.recurring==="mostly_recurring") pct += 0.03;
  if(d.recurring==="mostly_one_time") pct -= 0.03;
  return clamp(pct, 0.35, 0.75);
}

function sellerNotePct(d, risk){
  if(d.seller_note==="no") return 0.00;
  if(d.seller_note==="yes") return clamp(0.10 + risk*0.01, 0.10, 0.22);
  if(d.seller_note==="maybe") return clamp(0.08 + risk*0.01, 0.08, 0.18);
  return clamp(0.06 + risk*0.01, 0.06, 0.14); // unknown
}

function equityPct(d, risk){
  // equity used more when risk high or cash low
  const cashPct = (d.cash && d.price) ? d.cash/d.price : 0;
  let pct = 0.08 + (risk*0.015);
  if(cashPct < 0.08) pct += 0.06;
  if(d.buyer_type==="sponsor") pct += 0.04;
  if(d.buyer_type==="operator") pct -= 0.02;
  return clamp(pct, 0.05, 0.35);
}

function mezzPct(d, risk){
  // mezz used for aggressive leverage or speed
  let pct = 0.00;
  if(d.optimize==="fastest_close") pct += 0.08;
  if(d.optimize==="highest_leverage") pct += 0.10;
  if(risk >= 8) pct += 0.06;
  if(d.seller_note==="yes") pct -= 0.04;
  return clamp(pct, 0.00, 0.20);
}

function robsPct(d){
  // only if buyer is first-time/operator and wants speed/flex
  if(!(d.buyer_type==="first_time" || d.buyer_type==="operator")) return 0;
  if(d.optimize==="fastest_close" || d.optimize==="flexibility") return 0.08;
  return 0.04;
}

function normalizeMix(parts){
  const sum = Object.values(parts).reduce((a,b)=>a+b,0);
  if(sum<=0) return parts;
  const out = {};
  Object.entries(parts).forEach(([k,v])=> out[k]=v/sum);
  return out;
}

function buildStacks(d){
  const risk = riskScore(d);
  const ablOk = canUseABL(d);

  const price = Number(d.price||0);

  // common doc checklist
  const docs = [
    "Last 3 years financial statements + interim",
    "Last 3 years business tax returns",
    "Trailing 12-month P&L and balance sheet",
    "Customer concentration list (top customers + %)",
    "Add-back schedule with support (invoices, contracts, payroll)",
    "Debt schedule (existing obligations)",
    "Bank statements (6–12 months)",
    "AR aging + inventory reports (if applicable)",
    "LOI + draft purchase agreement",
    "Org docs + resumes + personal financial statement"
  ];

  const fixFirst = [];
  if(d.addbacks==="aggressive" || d.addbacks==="unknown") fixFirst.push(["Tighten add-backs", "If it can’t be proven, it doesn’t exist in underwriting."]);
  if(d.concentration in {"25to40":1,"gt40":1,"unknown":1}) fixFirst.push(["De-risk concentration", "Add contracts, term commitments, or explain churn/renewals."]);
  if(d.wc==="high" || d.wc==="unknown") fixFirst.push(["Model working capital", "Most post-close pain is WC, not debt service."]);
  if(d.seller_note!=="yes") fixFirst.push(["Negotiate a seller buffer", "A standby seller note often flips approval odds."]);
  if(d.post_close_liquidity==="tight") fixFirst.push(["Increase liquidity buffer", "Tight liquidity = default risk to lenders."]);

  const whyBase = [];
  if(d.recurring==="mostly_recurring") whyBase.push("Recurring revenue supports leverage (if churn is controlled).");
  if(d.recurring==="mostly_one_time") whyBase.push("One-time revenue needs more buffer and lower leverage.");
  if(d.experience==="strong") whyBase.push("Strong experience reduces perceived execution risk.");
  if(d.timeline==="30") whyBase.push("Fast close bias: fewer moving parts, clearer docs.");

  function mkOption(mode){
    // mode: conservative/balanced/aggressive tweak senior/equity/mezz
    const seniorBase = baseSeniorDebtPct(d, risk);
    let senior = seniorBase + (mode==="conservative"? -0.06 : mode==="aggressive"? 0.06 : 0);
    let seller = sellerNotePct(d, risk) + (mode==="conservative"? 0.02 : mode==="aggressive"? -0.02 : 0);
    let equity = equityPct(d, risk) + (mode==="conservative"? 0.05 : mode==="aggressive"? -0.03 : 0);
    let mezz = mezzPct(d, risk) + (mode==="aggressive"? 0.06 : mode==="conservative"? -0.02 : 0);
    let robs = robsPct(d) * (mode==="aggressive"? 0.8 : 1.0);
    let abl = (ablOk ? (d.wc==="high" ? 0.08 : 0.05) : 0) + (mode==="aggressive" && ablOk ? 0.03 : 0);

    // buyer cash acts as constraint not label; we include it as "Buyer cash down"
    let buyerCash = (d.cash && d.price) ? clamp(d.cash/d.price, 0.02, 0.40) : (mode==="conservative"? 0.18 : 0.10);
    // reduce others to make room for buyerCash, then normalize.
    const partsRaw = {
      "Senior debt (SBA/Bank)": Math.max(0, senior),
      "Seller note": Math.max(0, seller),
      "Equity partner": Math.max(0, equity),
      "Mezz / private credit": Math.max(0, mezz),
      "ROBS": Math.max(0, robs),
      "Asset-based line (AR/Inv/Equip)": Math.max(0, abl),
      "Buyer cash down": Math.max(0, buyerCash),
    };
    // Normalize but keep buyer cash roughly anchored by weighting it a bit heavier
    partsRaw["Buyer cash down"] *= 1.2;
    const mix = normalizeMix(partsRaw);

    // risks
    const risks = [];
    if(risk>=8) risks.push("Underwriting risk is elevated. Expect tighter terms or more equity/buffer.");
    if(d.concentration==="gt40") risks.push("High concentration can cap leverage or trigger conditions.");
    if(d.seasonality==="high") risks.push("High seasonality stresses DSCR and working capital.");
    if(d.addbacks==="aggressive") risks.push("Aggressive add-backs can cause retrade or denial.");
    if(d.post_close_liquidity==="tight") risks.push("Tight liquidity raises default risk (and scrutiny).");
    if(risks.length<3) risks.push("Document quality drives outcome. Missing docs = delays.");

    // why it fits
    const why = [];
    if(mode==="conservative"){
      why.push("More buffer + more equity to survive underwriting and surprises.");
      why.push("Lower leverage reduces DSCR pressure.");
    } else if(mode==="balanced"){
      why.push("Tradeoff stack: reasonable cost, reasonable speed, reasonable leverage.");
      why.push("Uses buffer where it matters, not everywhere.");
    } else {
      why.push("Leverage-forward stack to maximize buying power.");
      why.push("Assumes you can deliver clean docs and execute post-close.");
    }
    why.push(...whyBase.slice(0,2));

    // amounts
    const amounts = {};
    Object.entries(mix).forEach(([k,p])=>{
      amounts[k] = price ? Math.round(price*p) : null;
    });

    return { mode, mix, amounts, why: why.slice(0,3), risks: risks.slice(0,3),
      fixFirst: fixFirst.slice(0,5),
      docs
    };
  }

  // gating: warn if cash down seems too low
  const cashPct = (d.cash && d.price) ? d.cash/d.price : null;
  const headline = (risk<=4) ? "Likely financeable (with clean docs)." :
                   (risk<=8) ? "Financeable, but expect conditions." :
                               "Needs fixes before you shop lenders.";

  return {
    headline,
    risk,
    notes: [
      cashPct!==null && cashPct < 0.07 ? "Down payment looks light. Expect more seller buffer/equity or tighter terms." : null,
      d.timeline==="30" ? "Fast close target: simplify the stack and over-prepare docs." : null,
      d.refi==="yes" ? "Refinance adds complexity. Your structure must cover payoff + working capital." : null
    ].filter(Boolean),
    options: [mkOption("conservative"), mkOption("balanced"), mkOption("aggressive")]
  };
}

function renderResults(result){
  $("#wizardWrap").classList.add("hidden");
  $("#resultsWrap").classList.remove("hidden");

  $("#resultHeadline").textContent = result.headline;
  $("#riskChip").textContent = `Risk score: ${result.risk}/12`;
  $("#riskChip").className = "pill " + (result.risk<=4 ? "tag-ok" : result.risk<=8 ? "tag-warn" : "tag-bad");

  const notesEl = $("#resultNotes");
  notesEl.innerHTML = "";
  if(result.notes.length){
    result.notes.forEach(n=>{
      const div=document.createElement("div");
      div.className="notice";
      div.textContent = n;
      notesEl.appendChild(div);
    });
  }

  // tabs
  const tabs = $$(".tab");
  const panes = ["conservative","balanced","aggressive"];
  function setTab(i){
    tabs.forEach((t,idx)=> t.classList.toggle("active", idx===i));
    panes.forEach((p,idx)=>{
      const el = $(`#pane_${p}`);
      el.classList.toggle("hidden", idx!==i);
    });
  }
  tabs.forEach((t,i)=> t.addEventListener("click", ()=>setTab(i)));
  setTab(1);

  result.options.forEach(opt=>{
    const pane = $(`#pane_${opt.mode}`);
    // build mix bar (total 100)
    const totalPct = Object.values(opt.mix).reduce((a,b)=>a+b,0);
    const bar = pane.querySelector(".bar > span");
    bar.style.width = "100%"; // full bar acts as gradient background
    // mix list
    const list = pane.querySelector(".mixlist");
    list.innerHTML="";
    const sorted = Object.entries(opt.mix).sort((a,b)=>b[1]-a[1]);
    sorted.forEach(([k,p])=>{
      const row=document.createElement("div");
      row.className="mixrow";
      row.innerHTML = `<div><b>${k}</b><br><small>${Math.round(p*100)}%</small></div><div><b>${fmtUSD(opt.amounts[k])}</b></div>`;
      list.appendChild(row);
    });
    // why
    const why = pane.querySelector(".why");
    why.innerHTML = opt.why.map(x=>`<li>${x}</li>`).join("");
    // risks
    const risks = pane.querySelector(".risks");
    risks.innerHTML = opt.risks.map(x=>`<li>${x}</li>`).join("");
    // fix-first
    const fix = pane.querySelector(".fix");
    fix.innerHTML = opt.fixFirst.map(([t,d])=>`<li><b>${t}:</b> ${d}</li>`).join("");
    // docs
    const docs = pane.querySelector(".docs");
    docs.innerHTML = opt.docs.map(x=>`<li>${x}</li>`).join("");
  });

  // persist to localStorage for intake page
  try{
    localStorage.setItem("csm_builder_payload", JSON.stringify(state.data));
  }catch(e){}
}

function next(){
  const v = validateStep();
  if(!v.ok){
    alert(v.msg);
    return;
  }
  if(state.stepIndex === steps.length-1){
    const result = buildStacks(state.data);
    renderResults(result);
    return;
  }
  state.stepIndex++;
  renderStep();
  updateProgress();
}
function back(){
  state.stepIndex = Math.max(0, state.stepIndex-1);
  renderStep();
  updateProgress();
}

document.addEventListener("DOMContentLoaded", ()=>{
  $("#btnNext").addEventListener("click", next);
  $("#btnBack").addEventListener("click", back);
  renderStep();
  updateProgress();
});