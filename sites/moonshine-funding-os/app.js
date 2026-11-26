const DATA_FILES = {
  providers: "data/providers.json",
  products: "data/products.json",
  routing: "data/routing_logic.json",
  weights: "data/recommendation_weights.json",
  archetypes: "data/borrower_archetypes.json",
  dimensions: "data/readiness_dimensions.json",
  riskFlags: "data/risk_flags.json",
  partnerFit: "data/partner_fit_scoring.json",
  config: "data/app_config.json"
};

const familyLabels = {
  working_capital_emergency_capital: "Fast Working Capital",
  lines_of_credit_revolving_access: "Business Line of Credit",
  structured_growth_capital: "Structured Growth Capital",
  startup_credit_leverage: "Startup / Credit-Leverage Funding",
  equipment_truck_asset_backed: "Equipment / Asset-Backed Funding",
  real_estate_asset_secured: "Real Estate / Asset-Secured Capital",
  platform_marketplace_seller_capital: "E-commerce / Marketplace Seller Capital",
  manual_review: "Manual Funding Strategy Review",
  business_credit_builder: "Business Credit / Funding Prep"
};

const state = { data: {}, result: null, analystVisible: false };

async function loadData() {
  const pairs = await Promise.all(Object.entries(DATA_FILES).map(async ([key, url]) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    return [key, await response.json()];
  }));
  state.data = Object.fromEntries(pairs);
  document.getElementById("productCount").textContent = state.data.products.records.length;
  document.getElementById("providerCount").textContent = state.data.providers.records.length;
  document.getElementById("disclaimerText").textContent = state.data.config.disclaimer;
  calculateAndRender(getFormAnswers());
}

function getFormAnswers() {
  const form = document.getElementById("borrowerForm");
  const fd = new FormData(form);
  return {
    businessType: fd.get("businessType"),
    monthlyRevenue: Number(fd.get("monthlyRevenue") || 0),
    timeInBusinessMonths: Number(fd.get("timeInBusinessMonths") || 0),
    creditScore: Number(fd.get("creditScore") || 0),
    bankActivity: fd.get("bankActivity"),
    businessStructure: fd.get("businessStructure"),
    fundingPurpose: fd.get("fundingPurpose"),
    desiredFundingAmount: Number(fd.get("desiredFundingAmount") || 0),
    riskFlags: fd.getAll("riskFlags"),
    docs: fd.getAll("docs"),
    contact: {
      name: fd.get("contactName") || null,
      email: fd.get("email") || null,
      businessName: fd.get("businessName") || null,
      state: (fd.get("state") || "").toUpperCase() || null,
      consent: Boolean(fd.get("consent"))
    }
  };
}

function scoreRevenue(monthlyRevenue) {
  if (monthlyRevenue >= 100000) return 25;
  if (monthlyRevenue >= 50000) return 24;
  if (monthlyRevenue >= 20000) return 23;
  if (monthlyRevenue >= 15000) return 19;
  if (monthlyRevenue >= 8500) return 14;
  if (monthlyRevenue >= 3000) return 8;
  return 2;
}
function scoreTib(months) { if (months >= 24) return 20; if (months >= 12) return 17; if (months >= 6) return 13; if (months >= 4) return 9; if (months > 0) return 5; return 4; }
function scoreCredit(credit) { if (credit >= 700) return 20; if (credit >= 680) return 19; if (credit >= 660) return 17; if (credit >= 600) return 14; if (credit >= 580) return 10; if (credit >= 500) return 6; return 1; }
function scoreBank(activity) { return ({ none: 2, inconsistent: 6, consistent: 12, strong_clean: 15, recent_nsfs: 4 })[activity] || 4; }
function scoreStructure(s) { return ({ none: 1, sole_prop: 5, entity_no_bank: 6, entity_bank: 8, entity_bank_clean: 10 })[s] || 4; }
function scorePurpose(p) { return ({ working_capital: 8, inventory: 8, growth: 8, equipment: 9, real_estate: 8, ecommerce: 10, startup: 6, refinance: 5, business_credit: 7 })[p] || 4; }

function riskPenalty(flagIds) {
  const map = Object.fromEntries((state.data.riskFlags?.records || []).map(r => [r.risk_flag_id, r]));
  let total = 0;
  const active = [];
  for (const id of flagIds) {
    const found = map[id];
    let penalty = found?.score_penalty ?? 10;
    if (typeof penalty === "string") penalty = Number(penalty.replace(/[^0-9.-]/g, "")) || 10;
    total += Math.abs(penalty);
    active.push(found || { risk_flag_id: id, risk_name: id, severity: "medium", score_penalty: penalty, manual_review_required: true });
  }
  return { total: Math.min(total, 45), active };
}

function classifyArchetype(a, score) {
  if (a.riskFlags.includes("risk_existing_mca_stack")) return "MCA Stack Risk Borrower";
  if (score < 45 || a.monthlyRevenue < 3000 || a.bankActivity === "none") return "Funding Prep Candidate";
  if (a.businessType === "ecommerce_seller" || a.fundingPurpose === "ecommerce") return "Growth-Stage Ecommerce Seller";
  if (a.businessType === "equipment_heavy" || a.fundingPurpose === "equipment") return "Asset-Heavy Contractor";
  if (a.businessType === "real_estate_investor" || a.fundingPurpose === "real_estate") return "Real Estate Capital Operator";
  if (a.timeInBusinessMonths < 6 && a.creditScore >= 680) return "Credit-Strong Startup Founder";
  if (a.monthlyRevenue >= 20000 && a.creditScore >= 680 && a.timeInBusinessMonths >= 24) return "Prime Expansion Candidate";
  if (a.monthlyRevenue >= 15000 && a.timeInBusinessMonths >= 6) return "Revenue-Stable Operator";
  return "Selective Program Candidate";
}

function determineFamily(a, score) {
  if (a.fundingPurpose === "ecommerce" || a.businessType === "ecommerce_seller") return "platform_marketplace_seller_capital";
  if (a.fundingPurpose === "equipment" || a.businessType === "equipment_heavy") return "equipment_truck_asset_backed";
  if (a.fundingPurpose === "real_estate" || a.businessType === "real_estate_investor") return "real_estate_asset_secured";
  if (a.timeInBusinessMonths < 6 && a.creditScore >= 680) return "startup_credit_leverage";
  if (a.monthlyRevenue >= 20000 && a.timeInBusinessMonths >= 12 && a.creditScore >= 600 && ["growth", "inventory", "refinance"].includes(a.fundingPurpose)) return "structured_growth_capital";
  if (a.monthlyRevenue >= 10000 && a.timeInBusinessMonths >= 6 && a.creditScore >= 500) return "working_capital_emergency_capital";
  if (a.fundingPurpose === "business_credit") return "business_credit_builder";
  return score >= 45 ? "manual_review" : "business_credit_builder";
}

function secondaryFamilies(a, primary) {
  const candidates = [];
  if (a.monthlyRevenue >= 15000 && a.timeInBusinessMonths >= 12) candidates.push("lines_of_credit_revolving_access");
  if (a.creditScore >= 680) candidates.push("startup_credit_leverage");
  if (a.monthlyRevenue >= 20000 && a.creditScore >= 600) candidates.push("structured_growth_capital");
  if (a.monthlyRevenue >= 8500 && a.timeInBusinessMonths >= 6) candidates.push("working_capital_emergency_capital");
  if (a.businessType === "ecommerce_seller") candidates.push("platform_marketplace_seller_capital");
  return [...new Set(candidates.filter(x => x !== primary))].slice(0, 3);
}

function scoreProduct(product, provider, a, primaryFamily) {
  if (product.active_status && product.active_status !== "active") return null;
  const q = product.qualification || {};
  const amount = product.amount || {};
  let score = 0;
  const notes = [];
  let manualReview = Boolean(product.needs_manual_review);

  if (q.min_credit_score == null) { score += 8; notes.push("credit rule missing"); manualReview = true; }
  else if (a.creditScore >= q.min_credit_score) score += 22;
  else score -= Math.min(30, (q.min_credit_score - a.creditScore) / 4);

  const minRev = q.min_monthly_revenue ?? provider?.provider_defaults?.minimum_monthly_revenue;
  if (minRev == null) { score += 8; notes.push("revenue rule missing"); manualReview = true; }
  else if (a.monthlyRevenue >= minRev) score += 24;
  else score -= Math.min(32, (minRev - a.monthlyRevenue) / 1000);

  const minTib = q.min_time_in_business_months ?? provider?.provider_defaults?.minimum_time_in_business_months;
  if (minTib == null) { score += 6; notes.push("time-in-business rule missing"); manualReview = true; }
  else if (a.timeInBusinessMonths >= minTib) score += 18;
  else score -= Math.min(25, (minTib - a.timeInBusinessMonths) * 2);

  if (product.funding_family_id === primaryFamily) score += 22;
  else if (secondaryFamilies(a, primaryFamily).includes(product.funding_family_id)) score += 12;

  if (amount.min != null && a.desiredFundingAmount >= amount.min) score += 4;
  if (amount.max != null && a.desiredFundingAmount <= amount.max) score += 8;
  if (amount.max != null && a.desiredFundingAmount > amount.max) score -= 12;

  if (a.businessType === "ecommerce_seller" && product.funding_family_id === "platform_marketplace_seller_capital") score += 14;
  if (a.businessType === "real_estate_investor" && product.funding_family_id === "real_estate_asset_secured") score += 14;
  if (a.businessType === "equipment_heavy" && product.funding_family_id === "equipment_truck_asset_backed") score += 14;

  if (a.riskFlags.length) { score -= a.riskFlags.length * 6; manualReview = true; }
  if (product.verification_status === "needs_verification") manualReview = true;

  return { product, provider, score: Math.max(0, Math.min(100, Math.round(score))), notes, manualReview };
}

function rankMatches(a, primaryFamily) {
  const providersById = Object.fromEntries(state.data.providers.records.map(p => [p.provider_id, p]));
  return state.data.products.records
    .map(p => scoreProduct(p, providersById[p.provider_id], a, primaryFamily))
    .filter(Boolean)
    .sort((x, y) => y.score - x.score)
    .slice(0, 8);
}

function calculateAndRender(answers) {
  const baseDimensions = {
    revenue_strength_score: scoreRevenue(answers.monthlyRevenue),
    time_in_business_score: scoreTib(answers.timeInBusinessMonths),
    credit_readiness_score: scoreCredit(answers.creditScore),
    bankability_score: scoreBank(answers.bankActivity),
    entity_readiness_score: scoreStructure(answers.businessStructure),
    use_case_fit_score: scorePurpose(answers.fundingPurpose),
    documentation_readiness_score: Math.min(10, answers.docs.length * 2),
  };
  const raw = Object.values(baseDimensions).reduce((a,b)=>a+b,0);
  const penalty = riskPenalty(answers.riskFlags);
  const score = Math.max(0, Math.min(100, Math.round(raw - penalty.total)));
  const tier = score >= 80 ? "Highly Fundable" : score >= 65 ? "Fundable, But Needs Review" : score >= 45 ? "Possible Fit for Select Programs" : "Not Ready Yet — But Fixable";
  const primaryFamily = determineFamily(answers, score);
  const archetype = classifyArchetype(answers, score);
  const confidence = Math.max(35, Math.min(100, 100 - (answers.riskFlags.length * 8) - (answers.docs.length < 2 ? 10 : 0) - (answers.contact.email ? 0 : 5)));
  const matches = rankMatches(answers, primaryFamily);
  const blockers = buildBlockers(answers, penalty.active);
  const nextSteps = buildNextSteps(answers, score, primaryFamily, blockers);
  const publicPaths = [primaryFamily, ...secondaryFamilies(answers, primaryFamily)].map(x => familyLabels[x] || x);
  state.result = { score, tier, archetype, confidence, primaryFamily, publicPaths, blockers, nextSteps, dimensions: baseDimensions, riskPenalty: penalty, internalMatches: matches.map(m => ({ product_id:m.product.product_id, product_name:m.product.product_name, provider_name:m.provider?.provider_name, funding_family_id:m.product.funding_family_id, score:m.score, manual_review:m.manualReview, notes:m.notes })), answers, generatedAt: new Date().toISOString(), compliance_mode: "prequalification_guidance_only" };
  renderResult();
}

function buildBlockers(a, activeRisks) {
  const blockers = [];
  if (a.monthlyRevenue < 3000) blockers.push("Revenue may be below the starting point for most business funding paths.");
  if (a.timeInBusinessMonths < 6 && a.creditScore < 680) blockers.push("Short operating history may limit options unless personal credit is strong.");
  if (a.creditScore < 580) blockers.push("Credit profile may restrict non-revenue-first products.");
  if (a.bankActivity === "none") blockers.push("Most revenue-based options need business bank activity or platform data.");
  if (a.bankActivity === "recent_nsfs") blockers.push("Recent NSFs/overdrafts can reduce fast-capital fit and trigger manual review.");
  activeRisks.forEach(r => blockers.push(`${r.risk_name || r.risk_flag_id}: ${r.recommended_handling || "manual review recommended"}`));
  return blockers.length ? blockers : ["No major blocker detected from the answers provided. Documentation still needs review."];
}

function buildNextSteps(a, score, family, blockers) {
  const steps = [];
  if (score >= 65) steps.push("Review bank statements and confirm the desired funding amount before submission.");
  else steps.push("Strengthen the file before applying broadly; avoid spraying applications like a caffeinated raccoon.");
  if (["working_capital_emergency_capital", "lines_of_credit_revolving_access"].includes(family)) steps.push("Prepare 3–6 months of business bank statements.");
  if (family === "platform_marketplace_seller_capital") steps.push("Prepare marketplace, Shopify, Amazon, Walmart, Stripe, or payment-platform data.");
  if (family === "equipment_truck_asset_backed") steps.push("Collect equipment invoice, spec sheet, vendor quote, or title/collateral details.");
  if (family === "real_estate_asset_secured") steps.push("Collect property address, purchase price, ARV/LTV assumptions, rent roll, or project scope.");
  if (a.creditScore >= 680 && a.timeInBusinessMonths < 6) steps.push("Consider credit-leverage/startup paths while building operating history.");
  if (blockers.length > 1) steps.push("Send to a funding strategist or analyst for manual routing review.");
  return [...new Set(steps)].slice(0, 5);
}

function renderResult() {
  const r = state.result;
  const ring = document.getElementById("scoreRing");
  const circumference = 326.7;
  ring.style.strokeDashoffset = circumference - circumference * (r.score / 100);
  ring.style.stroke = r.score >= 80 ? "var(--green)" : r.score >= 65 ? "var(--cyan)" : r.score >= 45 ? "var(--amber)" : "var(--red)";
  document.getElementById("scoreValue").textContent = r.score;
  document.getElementById("scoreTier").textContent = r.tier;
  document.getElementById("primaryFamily").textContent = familyLabels[r.primaryFamily] || r.primaryFamily;
  document.getElementById("publicSummary").textContent = publicSummary(r);
  document.getElementById("archetypeOut").textContent = r.archetype;
  document.getElementById("confidenceOut").textContent = `${r.confidence}% confidence · ${r.confidence < 70 ? "manual review recommended" : "usable intake signal"}`;
  document.getElementById("publicPaths").innerHTML = r.publicPaths.map(p => `<span class="pill">${escapeHtml(p)}</span>`).join("");
  document.getElementById("blockersList").innerHTML = r.blockers.map(x => `<li>${escapeHtml(x)}</li>`).join("");
  document.getElementById("nextStepsList").innerHTML = r.nextSteps.map(x => `<li>${escapeHtml(x)}</li>`).join("");
  document.getElementById("ctaText").textContent = r.score >= 65 ? "Request a funding review before applying so the file gets routed to the right lane." : "Start with funding prep and manual review before chasing products.";
  renderAnalyst();
  window.fieMvpResult = r;
  window.dispatchEvent(new CustomEvent("fieMvpCalculated", { detail: r }));
}

function publicSummary(r) {
  if (r.score >= 80) return "Based on the answers provided, this borrower appears ready for a serious funding review and may have multiple potential paths available.";
  if (r.score >= 65) return "This borrower may be fundable, but the best path depends on documents, recent bank activity, and product-level criteria.";
  if (r.score >= 45) return "This borrower may fit select programs or prep-oriented paths. Manual routing matters here.";
  return "This borrower is likely not ready for most funding products yet, but the gaps are identifiable and fixable.";
}

function renderAnalyst() {
  const r = state.result;
  document.getElementById("dimensionBars").innerHTML = Object.entries(r.dimensions).map(([k,v]) => `<div class="dim-row"><div class="dim-meta"><span>${labelize(k)}</span><span>${v}</span></div><div class="bar"><span style="width:${Math.min(100,v*4)}%"></span></div></div>`).join("");
  document.getElementById("internalMatches").innerHTML = r.internalMatches.slice(0,5).map(m => `<div class="match-row"><div><strong>${escapeHtml(m.product_name)}</strong><small>${escapeHtml(m.provider_name || "Unknown provider")} · ${escapeHtml(familyLabels[m.funding_family_id] || m.funding_family_id)}</small></div><span class="score-badge">${m.score}% fit</span><small>${m.manual_review ? "Manual review" : "Standard review"}</small></div>`).join("");
  document.getElementById("jsonPayload").textContent = JSON.stringify(r, null, 2);
}
function labelize(s){return s.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

function bindEvents() {
  const form = document.getElementById("borrowerForm");
  form.addEventListener("change", () => calculateAndRender(getFormAnswers()));
  form.addEventListener("submit", e => { e.preventDefault(); calculateAndRender(getFormAnswers()); document.getElementById("recommendations").scrollIntoView({behavior:"smooth",block:"start"}); });
  document.getElementById("toggleAnalyst").addEventListener("click", () => { state.analystVisible = !state.analystVisible; document.getElementById("analyst").classList.toggle("is-hidden", !state.analystVisible); document.getElementById("toggleAnalyst").textContent = state.analystVisible ? "Hide Analyst Debug" : "Show Analyst Debug"; });
  document.getElementById("copyPayload").addEventListener("click", async () => { await navigator.clipboard.writeText(JSON.stringify(state.result, null, 2)); document.getElementById("copyPayload").textContent = "Copied"; setTimeout(()=>document.getElementById("copyPayload").textContent="Copy payload",1000); });
  document.getElementById("loadExample").addEventListener("click", () => {
    setField("businessType","ecommerce_seller"); setField("monthlyRevenue","50000"); setField("timeInBusinessMonths","18"); setField("creditScore","630"); setField("bankActivity","strong_clean"); setField("businessStructure","entity_bank_clean"); setField("fundingPurpose","ecommerce"); setField("desiredFundingAmount","150000");
    document.querySelectorAll('input[name="docs"]').forEach(x => x.checked = ["bank_statements","platform_connection","credit_report"].includes(x.value));
    document.querySelectorAll('input[name="riskFlags"]').forEach(x => x.checked = false);
    calculateAndRender(getFormAnswers());
  });
}
function setField(name, value){document.querySelector(`[name="${name}"]`).value = value;}

bindEvents();
loadData().catch(err => { console.error(err); document.body.insertAdjacentHTML("afterbegin", `<div style="padding:12px;background:#521;color:#fff">Data load failed: ${escapeHtml(err.message)}. Run with a local/static server, not file://.</div>`); });
