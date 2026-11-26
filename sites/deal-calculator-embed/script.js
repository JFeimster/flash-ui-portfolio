// Deal Calculator Embed — Distilled Funding
// No dependencies. Runs client-side. Designed for iFrame embedding.

(function () {
  function $(id) { return document.getElementById(id); }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function money(n) {
    if (!isFinite(n)) return "—";
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    });
  }

  function monthlyPayment(principal, annualRatePct, years) {
    principal = Math.max(0, principal);
    const r = (Math.max(0, annualRatePct) / 100) / 12;
    const n = Math.max(1, Math.round(years * 12));
    if (principal === 0) return 0;
    if (r === 0) return principal / n;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const defaults = {
    p_price: 500000,
    p_down_pct: 15,
    p_seller_pct: 25,
    p_seller_rate: 8.5,
    p_seller_years: 5,
    p_bank_rate: 11.25,
    p_bank_years: 10,
    p_ebitda: 175000,
    p_owner_salary: 80000,
    p_capex: 15000,
    p_wc: 10000,
    p_other_debt: 0
  };

  function setBadge(text, tone) {
    const tag = $("healthTag");
    tag.textContent = text;

    // Tone = "good" | "mid" | "bad" | "neutral"
    const colors = {
      good: "rgba(34,197,94,0.70)",
      mid: "rgba(245,158,11,0.70)",
      bad: "rgba(239,68,68,0.70)",
      neutral: "rgba(255,255,255,0.16)"
    };
    tag.style.borderColor = colors[tone] || colors.neutral;
  }

  function reset() {
    Object.keys(defaults).forEach((k) => ($(k).value = defaults[k]));
    calculate();
  }

  function calculate() {
    const price = +$("p_price").value || 0;

    const downPct = clamp((+$("p_down_pct").value || 0), 0, 100);
    const sellerPct = clamp((+$("p_seller_pct").value || 0), 0, 100);

    const bankPct = 100 - downPct - sellerPct;

    const downAmt = price * (downPct / 100);
    const sellerAmt = price * (sellerPct / 100);
    const bankAmt = price * (bankPct / 100);

    const sellerRate = +$("p_seller_rate").value || 0;
    const sellerYrs = +$("p_seller_years").value || 1;

    const bankRate = +$("p_bank_rate").value || 0;
    const bankYrs = +$("p_bank_years").value || 1;

    const sellerPmtM = monthlyPayment(sellerAmt, sellerRate, sellerYrs);
    const bankPmtM = monthlyPayment(bankAmt, bankRate, bankYrs);
    const totalPmtM = sellerPmtM + bankPmtM;
    const totalPmtY = totalPmtM * 12;

    const ebitda = +$("p_ebitda").value || 0;
    const salary = +$("p_owner_salary").value || 0;
    const capex = +$("p_capex").value || 0;
    const wc = +$("p_wc").value || 0;
    const otherDebt = +$("p_other_debt").value || 0;

    const cashAvail = Math.max(0, ebitda - salary - capex - wc - otherDebt);
    const dscr = totalPmtY > 0 ? (cashAvail / totalPmtY) : Infinity;

    $("out_down").textContent = money(downAmt);
    $("out_bank_pct").textContent = "Bank/SBA %: " + (isFinite(bankPct) ? bankPct.toFixed(1) + "%" : "—");

    $("out_monthly").textContent = money(totalPmtM) + " / mo";
    $("out_breakdown").textContent = "Seller: " + money(sellerPmtM) + " • Bank/SBA: " + money(bankPmtM);

    $("out_dscr").textContent = isFinite(dscr) ? dscr.toFixed(2) + "x" : "—";
    $("out_cash").textContent = "Cash available: " + money(cashAvail) + " • Annual debt: " + money(totalPmtY);

    if (bankPct < 0) {
      setBadge("Fix % totals (over 100%)", "bad");
      return;
    }

    if (!isFinite(dscr)) {
      setBadge("Ready", "neutral");
      return;
    }

    // Rough lender bands. Adjust if you want stricter scoring.
    if (dscr >= 1.35) setBadge("Strong (DSCR ≥ 1.35x)", "good");
    else if (dscr >= 1.20) setBadge("Borderline (DSCR 1.20–1.34x)", "mid");
    else setBadge("Risky (DSCR < 1.20x)", "bad");
  }

  // Wire events
  $("calcBtn").addEventListener("click", calculate);
  $("resetBtn").addEventListener("click", reset);

  [
    "p_price", "p_down_pct", "p_seller_pct", "p_seller_rate", "p_seller_years",
    "p_bank_rate", "p_bank_years", "p_ebitda", "p_owner_salary", "p_capex", "p_wc", "p_other_debt"
  ].forEach((id) => $(id).addEventListener("input", calculate));

  calculate();
})();
