import React, { useState, useEffect } from 'react';

interface DebtTranche {
  name: string;
  sharePercent: number;
  interestRate: number;
  termYears: number;
  isAmortizing: boolean;
}

export default function LboInputPanel() {
  // --- CORE TRANSACTION PARAMETERS ---
  const [purchasePrice, setPurchasePrice] = useState<number>(2200000);
  const [ebitda, setEbitda] = useState<number>(680000);
  const [capex, setCapex] = useState<number>(45000);
  const [replacementSalary, setReplacementSalary] = useState<number>(110000);

  // --- DEBT STRUCTURE STATES ---
  const [sbaShare, setSbaShare] = useState<number>(75);
  const [sbaRate, setSbaRate] = useState<number>(10.5);
  const [sbaTerm, setSbaTerm] = useState<number>(10);

  const [sellerShare, setSellerShare] = useState<number>(15);
  const [sellerRate, setSellerRate] = useState<number>(8.0);
  const [sellerTerm, setSellerTerm] = useState<number>(5);
  const [sellerAmortizing, setSellerAmortizing] = useState<boolean>(true);

  const [mezzShare, setMezzShare] = useState<number>(0);
  const [mezzRate, setMezzRate] = useState<number>(14.0);
  const [mezzTerm, setMezzTerm] = useState<number>(7);
  const [mezzAmortizing, setMezzAmortizing] = useState<boolean>(false); // Interest only

  // Downside scenario controls
  const [revenueStress, setRevenueStress] = useState<number>(20); // 20% decline stress-test

  // --- DERIVED FINANCIAL CALCULATIONS ---
  const multiple = purchasePrice / (ebitda || 1);
  const equityShare = Math.max(0, 100 - (sbaShare + sellerShare + mezzShare));

  const sbaPrincipal = purchasePrice * (sbaShare / 100);
  const sellerPrincipal = purchasePrice * (sellerShare / 100);
  const mezzPrincipal = purchasePrice * (mezzShare / 100);
  const equityRequired = purchasePrice * (equityShare / 100);

  // Helper function: Calculate annual amortization debt service
  const calculateAnnualDebtService = (
    principal: number,
    annualRate: number,
    termYears: number,
    amortizing: boolean
  ): number => {
    if (principal <= 0 || termYears <= 0) return 0;
    const r = annualRate / 100;
    if (!amortizing) {
      // Interest-only payments
      return principal * r;
    }
    if (r === 0) {
      return principal / termYears;
    }
    // Monthly compounding amortization
    const monthlyRate = r / 12;
    const totalMonths = termYears * 12;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return monthlyPayment * 12;
  };

  const sbaDebtService = calculateAnnualDebtService(sbaPrincipal, sbaRate, sbaTerm, true);
  const sellerDebtService = calculateAnnualDebtService(
    sellerPrincipal,
    sellerRate,
    sellerTerm,
    sellerAmortizing
  );
  const mezzDebtService = calculateAnnualDebtService(
    mezzPrincipal,
    mezzRate,
    mezzTerm,
    mezzAmortizing
  );

  const totalAnnualDebtService = sbaDebtService + sellerDebtService + mezzDebtService;

  // Free Cash Flow Available for Debt Service (CADS)
  const cads = Math.max(0, ebitda - capex - replacementSalary);

  // DSCR Formulas
  const dscr = totalAnnualDebtService > 0 ? cads / totalAnnualDebtService : 0;
  const netCashFlow = cads - totalAnnualDebtService;
  const cashOnCashYield = equityRequired > 0 ? (netCashFlow / equityRequired) * 100 : 0;

  // Stress-tested values
  const stressedEbitda = ebitda * (1 - revenueStress / 100);
  const stressedCads = Math.max(0, stressedEbitda - capex - replacementSalary);
  const stressedDscr = totalAnnualDebtService > 0 ? stressedCads / totalAnnualDebtService : 0;
  const stressedNetCashFlow = stressedCads - totalAnnualDebtService;

  // Determine health levels
  const getDscrSeverity = (val: number) => {
    if (val >= 1.5) return { text: 'SECURE', color: 'text-[#00FF66]', border: 'border-[#00FF66]' };
    if (val >= 1.15) return { text: 'MARGINAL WARNING', color: 'text-[#0EA5E9]', border: 'border-[#0EA5E9]' };
    return { text: 'CRITICAL DEFAULT RISK', color: 'text-[#FF3333]', border: 'border-[#FF3333]' };
  };

  const dscrStatus = getDscrSeverity(dscr);
  const stressedDscrStatus = getDscrSeverity(stressedDscr);

  // Quick helper to format currency
  const formatValue = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] border border-[#222] font-mono grid grid-cols-1 xl:grid-cols-12 max-w-7xl mx-auto w-full">
      
      {/* 1. LEFT CONTROL PANEL (Inputs & Allocations) */}
      <div className="xl:col-span-7 p-6 border-r border-[#222] space-y-6 bg-[#080808]">
        <div className="border-b border-[#222] pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
              <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
              LBO STRUCTURING TERMINAL
            </h2>
            <p className="text-[10px] text-[#888] uppercase mt-1">Acquisition Debt Modeling Sandbox</p>
          </div>
          <span className="bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 px-2 py-0.5 text-[9px] font-bold">
            LIVE ENGINE ACTIVE
          </span>
        </div>

        {/* SECTION A: TARGET PARAMETERS */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold tracking-widest text-[#888] uppercase border-b border-[#111] pb-1">
            A. Target Valuation & Adjustments
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-[#888] uppercase mb-1">Target Purchase Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] text-xs">$</span>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] focus:ring-0 text-xs text-white p-2.5 pl-7 placeholder:text-[#444] outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-[#888] uppercase mb-1">Adjusted EBITDA (Seller Cash Flow)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] text-xs">$</span>
                <input
                  type="number"
                  value={ebitda}
                  onChange={(e) => setEbitda(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#00FF66] focus:ring-0 text-xs text-white p-2.5 pl-7 placeholder:text-[#444] outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-[#888] uppercase mb-1">Est. Post-Close Annual CapEx</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] text-xs">$</span>
                <input
                  type="number"
                  value={capex}
                  onChange={(e) => setCapex(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#222] text-xs text-white p-2.5 pl-7 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-[#888] uppercase mb-1">Owner Replacement Base Salary</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] text-xs">$</span>
                <input
                  type="number"
                  value={replacementSalary}
                  onChange={(e) => setReplacementSalary(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#222] text-xs text-white p-2.5 pl-7 outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center bg-[#050505] border border-[#222] p-2 px-3 text-[10px]">
            <span className="text-[#888]">IMPLIED PURCHASE MULTIPLE:</span>
            <span className="text-white font-bold">{multiple.toFixed(2)}x EBITDA</span>
          </div>
        </div>

        {/* SECTION B: DEBT INSTRUMENTS & CAPITAL STACK */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#111] pb-1">
            <span className="text-[10px] font-bold tracking-widest text-[#888] uppercase">
              B. Capital Stack Allocation
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                sbaShare + sellerShare + mezzShare > 100
                  ? 'border-[#FF3333] bg-[#FF3333]/10 text-[#FF3333]'
                  : 'border-[#0ea5e9]/20 bg-[#0ea5e9]/10 text-[#0ea5e9]'
              }`}
            >
              ALLOCATED DEBT: {sbaShare + sellerShare + mezzShare}% | EQUITY REQUIRED: {equityShare}%
            </span>
          </div>

          {/* 1. SBA 7(a) Senior Tranche */}
          <div className="border border-[#222] p-3.5 space-y-3 bg-[#0a0a0a]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#0EA5E9]">1. SBA 7(a) SENIOR NOTE</span>
              <span className="text-[10px] text-[#888]">{formatValue(sbaPrincipal)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Percentage Share</label>
                <div className="relative">
                  <input
                    type="number"
                    max="90"
                    min="0"
                    value={sbaShare}
                    onChange={(e) => setSbaShare(Math.min(90, Number(e.target.value)))}
                    className="w-full bg-[#050505] border border-[#222] text-xs p-1.5 text-right pr-6"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#444]">%</span>
                </div>
              </div>
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    value={sbaRate}
                    onChange={(e) => setSbaRate(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] text-xs p-1.5 text-right pr-6"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#444]">%</span>
                </div>
              </div>
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Term (Years)</label>
                <input
                  type="number"
                  value={sbaTerm}
                  onChange={(e) => setSbaTerm(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-[#222] text-xs p-1.5 text-center"
                />
              </div>
            </div>
          </div>

          {/* 2. Seller Standby Note */}
          <div className="border border-[#222] p-3.5 space-y-3 bg-[#0a0a0a]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#00FF66]">2. SELLER STANDBY NOTE</span>
              <span className="text-[10px] text-[#888]">{formatValue(sellerPrincipal)}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Percentage Share</label>
                <div className="relative">
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={sellerShare}
                    onChange={(e) => setSellerShare(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] text-xs p-1.5 text-right pr-6"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#444]">%</span>
                </div>
              </div>
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    value={sellerRate}
                    onChange={(e) => setSellerRate(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] text-xs p-1.5 text-right pr-6"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#444]">%</span>
                </div>
              </div>
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Term (Years)</label>
                <input
                  type="number"
                  value={sellerTerm}
                  onChange={(e) => setSellerTerm(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-[#222] text-xs p-1.5 text-center"
                />
              </div>
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Amortization Type</label>
                <button
                  onClick={() => setSellerAmortizing(!sellerAmortizing)}
                  className={`w-full p-1.5 text-[9px] font-bold border ${
                    sellerAmortizing
                      ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5'
                      : 'border-[#444] text-[#888]'
                  } transition-all uppercase`}
                >
                  {sellerAmortizing ? 'Fully Amortized' : 'Interest Only'}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Mezzanine Subordinated Note */}
          <div className="border border-[#222] p-3.5 space-y-3 bg-[#0a0a0a]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#FF3333]">3. MEZZANINE SUBORDINATED NOTE</span>
              <span className="text-[10px] text-[#888]">{formatValue(mezzPrincipal)}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Percentage Share</label>
                <div className="relative">
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={mezzShare}
                    onChange={(e) => setMezzShare(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] text-xs p-1.5 text-right pr-6"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#444]">%</span>
                </div>
              </div>
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    value={mezzRate}
                    onChange={(e) => setMezzRate(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] text-xs p-1.5 text-right pr-6"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#444]">%</span>
                </div>
              </div>
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Term (Years)</label>
                <input
                  type="number"
                  value={mezzTerm}
                  onChange={(e) => setMezzTerm(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-[#222] text-xs p-1.5 text-center"
                />
              </div>
              <div>
                <label className="block text-[8px] text-[#888] uppercase mb-1">Amortization Type</label>
                <button
                  onClick={() => setMezzAmortizing(!mezzAmortizing)}
                  className={`w-full p-1.5 text-[9px] font-bold border ${
                    mezzAmortizing
                      ? 'border-[#FF3333] text-[#FF3333] bg-[#FF3333]/5'
                      : 'border-[#444] text-[#888]'
                  } transition-all uppercase`}
                >
                  {mezzAmortizing ? 'Fully Amortized' : 'Interest Only'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION C: STRESS SCENARIO TRIGGER */}
        <div className="space-y-3 bg-[#0a0a0a] p-3 border border-[#222]">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-[#888] uppercase font-bold tracking-wider">
              C. Volatility & Revenue Decline Stress Test
            </label>
            <span className="text-xs text-[#FF3333] font-bold">{revenueStress}% Stress Drop</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={revenueStress}
            onChange={(e) => setRevenueStress(Number(e.target.value))}
            className="w-full accent-[#FF3333] bg-[#222] h-1 cursor-pointer"
          />
          <div className="flex justify-between text-[8px] text-neutral-600">
            <span>0% (Base Plan)</span>
            <span>25% (Moderate Stress)</span>
            <span>50% (Extreme Downturn)</span>
          </div>
        </div>
      </div>

      {/* 2. RIGHT ANALYTICS BOARD (Outputs, Gauges & Stress Matrix) */}
      <div className="xl:col-span-5 p-6 flex flex-col justify-between bg-[#050505] space-y-6">
        
        {/* TOP STATUS GAUGES */}
        <div className="space-y-6">
          <div className="border-b border-[#222] pb-4">
            <h2 className="text-sm font-bold tracking-tight text-[#F9F9F9]">REAL-TIME LBO REPORT</h2>
            <p className="text-xs text-[#888]">Structural stability metrics and equity returns</p>
          </div>

          {/* DYNAMIC RISK ZONE BANNER */}
          <div className={`p-4 border ${dscrStatus.border} bg-[#080808] space-y-1`}>
            <div className="text-[9px] font-bold tracking-wider text-[#888]">STRUCTURAL ADEQUACY ASSESSMENT</div>
            <div className="flex justify-between items-baseline">
              <span className={`text-sm font-bold ${dscrStatus.color}`}>{dscrStatus.text}</span>
              <span className="text-xs text-white/70">DSCR: {dscr.toFixed(2)}x</span>
            </div>
            <p className="text-[10px] text-[#888] leading-tight">
              {dscr >= 1.5 
                ? 'Excellent parameters. Standard SBA guarantees require minimum 1.15x DSCR post-salary adjustment.'
                : dscr >= 1.15 
                ? 'Marginal threshold. Lenders may require additional collateral or structured seller note terms.'
                : 'CRITICAL WARNING: Base operational cash flow fails to safely service debt. Immediate restructuring required.'}
            </p>
          </div>

          {/* CORE OUTPUT MATRIX */}
          <div className="grid grid-cols-2 gap-px bg-[#222] border border-[#222]">
            <div className="bg-[#0a0a0a] p-3 text-center">
              <div className="text-[8px] text-[#888] uppercase">Total Equity Input</div>
              <div className="text-sm font-bold text-white mt-1">{formatValue(equityRequired)}</div>
              <div className="text-[9px] text-[#888] mt-0.5">({equityShare.toFixed(1)}% of Ask)</div>
            </div>
            <div className="bg-[#0a0a0a] p-3 text-center">
              <div className="text-[8px] text-[#888] uppercase">Annual Debt Service</div>
              <div className="text-sm font-bold text-[#FF3333] mt-1">{formatValue(totalAnnualDebtService)}</div>
              <div className="text-[9px] text-[#888] mt-0.5">({formatValue(totalAnnualDebtService / 12)}/mo)</div>
            </div>
            <div className="bg-[#0a0a0a] p-3 text-center">
              <div className="text-[8px] text-[#888] uppercase">Net Cash Flow (Post-Debt)</div>
              <div className={`text-sm font-bold mt-1 ${netCashFlow >= 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                {formatValue(netCashFlow)}
              </div>
              <div className="text-[9px] text-[#888] mt-0.5">Year 1 Projection</div>
            </div>
            <div className="bg-[#0a0a0a] p-3 text-center">
              <div className="text-[8px] text-[#888] uppercase">Cash-on-Cash Yield</div>
              <div className={`text-sm font-bold mt-1 ${cashOnCashYield >= 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                {cashOnCashYield.toFixed(2)}%
              </div>
              <div className="text-[9px] text-[#888] mt-0.5">Unlevered: {((ebitda/purchasePrice)*100).toFixed(1)}%</div>
            </div>
          </div>

          {/* DOWNSIDE STRESS SIMULATION BOX */}
          <div className="border border-[#222] bg-[#0a0a0a] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#222] pb-1.5">
              <span className="text-[10px] font-bold tracking-widest text-[#FF3333] uppercase">
                STRESS RUNOUT: -{revenueStress}% OPERATIONS
              </span>
              <span className="text-[9px] bg-[#FF3333]/10 text-[#FF3333] px-1 py-0.5 font-bold">
                SIMULATED
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#888]">Stressed EBITDA:</span>
                <span className="text-white font-bold">{formatValue(stressedEbitda)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">Stressed Free Cash Flow (CADS):</span>
                <span className="text-white">{formatValue(stressedCads)}</span>
              </div>
              <div className="flex justify-between border-t border-[#111] pt-1.5">
                <span className="text-[#888]">Stressed DSCR Ratio:</span>
                <span className={`font-bold ${stressedDscrStatus.color}`}>{stressedDscr.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">Stressed Net Cash Flow:</span>
                <span className={`font-bold ${stressedNetCashFlow >= 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                  {formatValue(stressedNetCashFlow)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METRICS MATRIX & CALL-TO-ACTION */}
        <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold text-[#888] uppercase tracking-wider">ANNUAL CAPITAL STACK BREAKDOWN</div>
            <div className="flex h-3 bg-[#111] border border-[#222]">
              {sbaShare > 0 && (
                <div
                  style={{ width: `${sbaShare}%` }}
                  className="bg-[#0EA5E9] h-full"
                  title={`SBA 7(a): ${sbaShare}%`}
                ></div>
              )}
              {sellerShare > 0 && (
                <div
                  style={{ width: `${sellerShare}%` }}
                  className="bg-[#00FF66] h-full"
                  title={`Seller Note: ${sellerShare}%`}
                ></div>
              )}
              {mezzShare > 0 && (
                <div
                  style={{ width: `${mezzShare}%` }}
                  className="bg-[#FF3333] h-full"
                  title={`Mezzanine: ${mezzShare}%`}
                ></div>
              )}
              {equityShare > 0 && (
                <div
                  style={{ width: `${equityShare}%` }}
                  className="bg-[#333] h-full"
                  title={`Equity required: ${equityShare}%`}
                ></div>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-[#888]">
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-[#0EA5E9]"></span> SBA ({sbaShare}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-[#00FF66]"></span> SELLER STANDBY ({sellerShare}%)
              </span>
              {mezzShare > 0 && (
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-[#FF3333]"></span> MEZZANINE ({mezzShare}%)
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-[#333]"></span> EQUITY ({equityShare.toFixed(0)}%)
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              alert(
                `LBO Configuration Lock Saved.\nDSCR: ${dscr.toFixed(2)}x\nEquity: ${formatValue(
                  equityRequired
                )}\nStressed DSCR: ${stressedDscr.toFixed(2)}x`
              );
            }}
            className="w-full bg-[#00FF66] text-black font-bold py-3 text-xs tracking-widest hover:bg-[#F9F9F9] transition-all uppercase flex items-center justify-center space-x-2"
          >
            <span>LOCK TERMS & GENERATE LBO SHEET</span>
            <span>&rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}