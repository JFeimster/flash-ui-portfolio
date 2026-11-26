
const lanes = [{"slug": "sba", "name": "SBA Loans / Bank", "tag": ["Lowest cost", "Docs-heavy"], "best": "Stable cash flow, clean books, low concentration, credible operator.", "pros": ["Lower cost of capital", "Longer amortization supports DSCR", "Common in SMB acquisitions"], "cons": ["Documentation burden", "Eligibility + PG constraints", "Add-backs scrutinized"], "fix": ["Tighten add-backs with proof", "Reduce concentration risk narrative", "Prepare full doc package early"]}, {"slug": "seller-note", "name": "Seller Note (Buffer)", "tag": ["Closes deals", "Negotiation"], "best": "When you need a buffer to satisfy senior debt underwriting or reduce cash down.", "pros": ["Absorbs risk", "Improves lender comfort", "Aligns seller with outcome"], "cons": ["Seller must trust buyer", "Terms matter (standby/subordination)", "Can complicate negotiations"], "fix": ["Draft terms early (rate, term, standby)", "Tie to reps/warranties and retrade mechanics", "Explain how it protects both sides"]}, {"slug": "robs", "name": "ROBS", "tag": ["Speed", "Compliance"], "best": "Buyers with retirement funds who want flexible down payment without a lender bottleneck.", "pros": ["Can reduce outside debt", "Fast execution", "Useful when cash down is limited"], "cons": ["Compliance risk if done wrong", "Not for every deal type", "Ongoing admin requirements"], "fix": ["Use qualified ROBS administrator", "Document plan compliance", "Pair with realistic leverage"]}, {"slug": "equity", "name": "Equity Partner", "tag": ["Scale", "Alignment"], "best": "Sponsors/operators buying larger deals, or deals with higher risk requiring more equity.", "pros": ["Buy bigger deals", "Adds credibility & reserves", "Can enable faster close"], "cons": ["Dilution / control tradeoffs", "Governance & incentives matter", "Exit misalignment risk"], "fix": ["Define control + veto rights clearly", "Model preferred return / waterfall", "Align on timeline + strategy"]}, {"slug": "mezz", "name": "Mezz / Private Credit", "tag": ["Fast", "Expensive"], "best": "When banks/SBA won\u2019t stretch, or timeline demands speed.", "pros": ["Speed to close", "Flexible structures", "Can bridge gaps"], "cons": ["High cost of capital", "Tighter covenants", "Refi risk later"], "fix": ["Prove path to refinance", "Stress-test downside cash flow", "Avoid over-leverage without buffer"]}, {"slug": "abl", "name": "Asset-Backed (AR/Inventory)", "tag": ["Liquidity", "Collateral"], "best": "Businesses with AR/inventory/equipment that need working capital support.", "pros": ["Unlocks liquidity", "Can reduce reliance on mezz", "Scales with operations"], "cons": ["Field exams/reporting", "Advance rates vary", "Collateral quality matters"], "fix": ["Clean AR aging and credit policy", "Inventory valuation discipline", "Plan reporting cadence early"]}];

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

function renderLanes(filter){
  const grid = $("#laneGrid");
  grid.innerHTML = "";
  const items = lanes.filter(l => !filter || l.tag.includes(filter));
  items.forEach(l=>{
    const a = document.createElement("a");
    a.className = "card";
    a.href = `/capital-lanes/${l.slug}.html`;
    a.innerHTML = `
      <h3>${l.name}</h3>
      <p>${l.best}</p>
      <div class="meta">
        ${l.tag.map(t=>`<span class="pill">${t}</span>`).join("")}
      </div>
    `;
    grid.appendChild(a);
  });
  $("#count").textContent = `${items.length} lane${items.length===1?'':'s'}`;
}

document.addEventListener("DOMContentLoaded", ()=>{
  const chips = $$(".chip");
  let active = "";
  chips.forEach(c=>{
    c.addEventListener("click", ()=>{
      chips.forEach(x=>x.classList.remove("active"));
      if(active === c.dataset.filter){
        active = "";
      } else {
        active = c.dataset.filter;
        c.classList.add("active");
      }
      renderLanes(active);
    });
  });
  renderLanes("");
});
