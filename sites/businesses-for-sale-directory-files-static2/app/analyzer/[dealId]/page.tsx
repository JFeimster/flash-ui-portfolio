```tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Mock Deal Stream (aligned with base component dataset)
interface Deal {
  id: string;
  codename: string;
  sector: string;
  revenue: number;
  ebitda: number;
  asking: number;
  multiple: number;
  location: string;
  description: string;
  risks: string[];
}

const DEALS: Record<string, Deal> = {
  delta: {
    id: "delta",
    codename: "Project Delta",
    sector: "Logistics",
    revenue: 2400000,
    ebitda: 620000,
    asking: 1800000,
    multiple: 2.9,
    location: "Midwest Territory",
    description: "Critical regional distribution platform specializing in customized third-party logistics integrations for auto manufacturing components.",
    risks: [
      "Sovereign manufacturer is responsible for 42% of gross logistics fees.",
      "Fleet utilization relies heavily on outsourced 1099 operators.",
      "Seller retirement requires transition contingency clause built into SBA standby."
    ]
  },
  kestrel: {
    id: "kestrel",
    codename: "Project Kestrel",
    sector: "SaaS",
    revenue: 1200000,
    ebitda: 450000,
    asking: 1900000,
    multiple: 4.2,
    location: "100% Remote",
    description: "Integrated cloud optimization solution tracking high-value tangible assets for construction logistics corporations.",
    risks: [
      "System built on legacy infrastructure requiring immediate container modernization.",
      "Single-person engineering reliance poses massive key-man vulnerability.",
      "Variable retention ratios on second-tier client cohorts."
    ]
  },
  "hvac-nova": {
    id: "hvac-nova",
    codename: "Project Nova",
    sector: "Home Services",
    revenue: 3100000,
    ebitda: 810000,
    asking: 2600000,
    multiple: 3.2,
    location: "Franconia, VA",
    description: "Highly stable residential and mid-market commercial HVAC maintenance firm featuring high recurring maintenance subscription channels.",
    risks: [
      "Experienced master techs are close to retirement age.",
      "Requires state license structural transition on local corporate bylaws.",
      "Seasonality spikes during high winter heating periods."
    ]
  },
  onyx: {
    id: "onyx",
    codename: "Project Onyx",
    sector: "Manufacturing",
    revenue: 5800000,
    ebitda: 1200000,
    asking: 3800000,
    multiple: 3.1,
    location: "Atlanta Hub",
    description: "State-of-the-art precision components manufacture serving aerospace subsystems with active long-term procurement frameworks.",
    risks: [
      "Requires multi-million dollar machinery modernization cycle within 3 years.",
      "Key site facility lease up for review in 24 months.",
      "Environmental certifications require ongoing EPA filings."
    ]
  },
  titan: {
    id: "titan",
    codename: "Project Titan",
    sector: "Logistics",
    revenue: 4200000,
    ebitda: 950000,
    asking: 2800000,
    multiple: 2.9,
    location: "Chicagoland Area",
    description: "Last-mile final delivery network providing high density distribution contracts for Fortune 500 retail networks.",
    risks: [
      "High depreciation on equipment requires structural personal guarantees.",
      "Fuel surcharge pass-through structures subject to rapid market fluctuations.",
      "Primary distribution hub operating under near-capacity logistics constraints."
    ]
  }
};

// Helper to compute PMT (Equal Monthly Installments)
function PMT(ratePerMonth: number, numberOfPayments: number, presentValue: number): number {
  if (ratePerMonth === 0) return presentValue / numberOfPayments;
  return (presentValue * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfPayments)) / (Math.pow(1 + ratePerMonth, numberOfPayments) - 1);
}

// IRR calculation helper using Newton-Raphson method
function calculateIRR(cashFlows: number[]): number {
  let r = 0.1; // initial guess
  const precision = 0.00001;
  const maxIterations = 1000;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dNpv = 0; // derivative of NPV
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + r, t);
      dNpv -= (t * cashFlows[t]) / Math.pow(1 + r, t + 1);
    }
    if (Math.abs(dNpv) < 1e-12) break;
    const nextR = r - npv / dNpv;
    if (Math.abs(nextR - r) < precision) return nextR;
    r = nextR;
  }
  return r;
}

export default function LboAnalyzerPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = (params?.dealId as string) || "delta";
  const defaultDeal = DEALS[dealId] || DEALS.delta;

  // LBO Configuration State
  const [purchasePrice, setPurchasePrice] = useState<number>(defaultDeal.asking);
  const [ebitda, setEbitda] = useState<number>(defaultDeal.ebitda);
  const [revenue, setRevenue] = useState<number>(defaultDeal.revenue);
  const [exitMultiple, setExitMultiple] = useState<number>(defaultDeal.multiple);

  // Capital Stack Percentages
  const [buyerEquityPct, setBuyerEquityPct] = useState<number>(10);
  const [sellerNotePct, setSellerNotePct] = useState<number>(15);

  // Debt Parameters
  const [sbaInterestRate, setSbaInterestRate] = useState<number>(11.25);
  const [sbaTermYears, setSbaTermYears] = useState<number>(10);
  const [sellerInterestRate, setSellerInterestRate] = useState<number>(8.0);
  const [sellerTermYears, setSellerTermYears] = useState<number>(5);
  const [isSellerStandby, setIsSellerStandby] = useState<boolean>(true); // True means no interest or principal paid till Year 5

  // Growth & Forecast State
  const [growthRate, setGrowthRate] = useState<number>(5.0); // YoY Growth
  const [ebitdaMargin, setEbitdaMargin] = useState<number>(Math.round((defaultDeal.ebitda / defaultDeal.revenue) * 100));
  const [capexPct, setCapexPct] = useState<number>(2.0); // CapEx as % of revenue

  // Reset controls when deal changes
  useEffect(() => {
    const currentDeal = DEALS[dealId] || DEALS.delta;
    setPurchasePrice(currentDeal.asking);
    setEbitda(currentDeal.ebitda);
    setRevenue(currentDeal.revenue);
    setExitMultiple(currentDeal.multiple);
    setEbitdaMargin(Math.round((currentDeal.ebitda / currentDeal.revenue) * 100));
  }, [dealId]);

  // Synchronized SBA loan percentage constraint (remaining portion up to 100%)
  const sbaLoanPct = useMemo(() => {
    const calculated = 100 - buyerEquityPct - sellerNotePct;
    return Math.max(0, calculated);
  }, [buyerEquityPct, sellerNotePct]);

  // Capital structure absolute values
  const equityVal = useMemo(() => purchasePrice * (buyerEquityPct / 100), [purchasePrice, buyerEquityPct]);
  const sellerNoteVal = useMemo(() => purchasePrice * (sellerNotePct / 100), [purchasePrice, sellerNotePct]);
  const sbaLoanVal = useMemo(() => purchasePrice * (sbaLoanPct / 100), [purchasePrice, sbaLoanPct]);

  // Calculations for Annual Debt Service
  const sbaDebtService = useMemo(() => {
    if (sbaLoanVal <= 0) return 0;
    const monthlyRate = sbaInterestRate / 100 / 12;
    const totalMonths = sbaTermYears * 12;
    return PMT(monthlyRate, totalMonths, sbaLoanVal) * 12;
  }, [sbaLoanVal, sbaInterestRate, sbaTermYears]);

  const sellerDebtService = useMemo(() => {
    if (sellerNoteVal <= 0 || isSellerStandby) return 0;
    const monthlyRate = sellerInterestRate / 100 / 12;
    const totalMonths = sellerTermYears * 12;
    return PMT(monthlyRate, totalMonths, sellerNoteVal) * 12;
  }, [sellerNoteVal, sellerInterestRate, sellerTermYears, isSellerStandby]);

  const totalDebtServiceYr1 = sbaDebtService + sellerDebtService;

  // 5-Year Financial Model Projection
  const projection = useMemo(() => {
    const forecast = [];
    let currentRevenue = revenue;
    let sbaRemainingDebt = sbaLoanVal;
    let sellerRemainingDebt = sellerNoteVal;

    for (let year = 1; year <= 5; year++) {
      currentRevenue = currentRevenue * (1 + growthRate / 100);
      const yearEbitda = currentRevenue * (ebitdaMargin / 100);
      const yearCapex = currentRevenue * (capexPct / 100);

      // SBA amortization schedule for the year
      let annualSbaPrincipalPaid = 0;
      let annualSbaInterestPaid = 0;
      const sbaMonthlyRate = sbaInterestRate / 100 / 12;
      const sbaTotalMonths = sbaTermYears * 12;
      const sbaMonthlyPmt = PMT(sbaMonthlyRate, sbaTotalMonths, sbaLoanVal);

      for (let m = 1; m <= 12; m++) {
        const interest = sbaRemainingDebt * sbaMonthlyRate;
        const principal = sbaMonthlyPmt - interest;
        annualSbaInterestPaid += interest;
        annualSbaPrincipalPaid += principal;
        sbaRemainingDebt = Math.max(0, sbaRemainingDebt - principal);
      }

      // Seller note amortization schedule for the year
      let annualSellerPrincipalPaid = 0;
      let annualSellerInterestPaid = 0;

      if (sellerNoteVal > 0 && !isSellerStandby) {
        const sellerMonthlyRate = sellerInterestRate / 100 / 12;
        const sellerTotalMonths = sellerTermYears * 12;
        const sellerMonthlyPmt = PMT(sellerMonthlyRate, sellerTotalMonths, sellerNoteVal);

        for (let m = 1; m <= 12; m++) {
          const interest = sellerRemainingDebt * sellerMonthlyRate;
          const principal = sellerMonthlyPmt - interest;
          annualSellerInterestPaid += interest;
          annualSellerPrincipalPaid += principal;
          sellerRemainingDebt = Math.max(0, sellerRemainingDebt - principal);
        }
      } else if (sellerNoteVal > 0 && isSellerStandby) {
        // Accruing interest on standby, or simple deferred terms
        annualSellerInterestPaid = sellerRemainingDebt * (sellerInterestRate / 100);
        sellerRemainingDebt += annualSellerInterestPaid; // Compound interest onto the standby balance
      }

      const totalYearDebtService = (sbaMonthlyPmt * 12) + (isSellerStandby ? 0 : (sellerDebtService));
      const preTaxFcf = yearEbitda - yearCapex - totalYearDebtService;
      const dscr = totalYearDebtService > 0 ? yearEbitda / totalYearDebtService : 0;

      forecast.push({
        year,
        revenue: currentRevenue,
        ebitda: yearEbitda,
        capex: yearCapex,
        sbaDebtService: sbaMonthlyPmt * 12,
        sellerDebtService: isSellerStandby ? 0 : sellerDebtService,
        totalDebtService: totalYearDebtService,
        preTaxFcf,
        dscr,
        sbaRemainingDebt,
        sellerRemainingDebt,
        totalRemainingDebt: sbaRemainingDebt + sellerRemainingDebt
      });
    }
    return forecast;
  }, [
    revenue, growthRate, ebitdaMargin, capexPct, sbaLoanVal, sbaInterestRate,
    sbaTermYears, sellerNoteVal, sellerInterestRate, sellerTermYears, isSellerStandby, sellerDebtService
  ]);

  // Returns Modeling (Year 5 Exit Scenario)
  const returns = useMemo(() => {
    const yr5Ebitda = projection[4]?.ebitda || ebitda;
    const exitVal = yr5Ebitda * exitMultiple;
    const endingDebt = projection[4]?.totalRemainingDebt || 0;
    const netExitProceeds = exitVal - endingDebt;

    // Build cash flows array for dynamic IRR calculation
    const initialOutflow = -equityVal;
    const cashFlows = [initialOutflow];
    projection.forEach((y, i) => {
      if (i === 4) {
        // Year 5 FCF + Net Sale Proceeds
        cashFlows.push(y.preTaxFcf + netExitProceeds);
      } else {
        cashFlows.push(y.preTaxFcf);
      }
    });

    const calculatedIrr = calculateIRR(cashFlows);
    const moic = equityVal > 0 ? (cashFlows.reduce((sum, val) => sum + (val > 0 ? val : 0), 0)) / equityVal : 0;

    return {
      exitVal,
      endingDebt,
      netExitProceeds,
      irr: calculatedIrr * 100,
      moic
    };
  }, [projection, exitMultiple, ebitda, equityVal]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F9F9F9] selection:bg-[#00FF66] selection:text-black font-sans flex flex-col relative">
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-20"></div>

      {/* 1. GLOBAL TERMINAL STATUS BAR */}
      <header className="relative z-10 w-full bg-[#090909] border-b border-[#222222] h-11 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="bg-[#00FF66] text-black font-mono text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase flex items-center space-x-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
            <span>MODELING ENGINE</span>
          </div>
          <span className="text-[#444] font-mono text-xs">|</span>
          <span className="font-mono text-[10px] text-[#888888] tracking-widest uppercase hidden md:inline">
            CORE PIPELINE SECURE PORT: SH-883
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-mono text-[10px] text-[#00FF66]">SYS_STATUS: READY</span>
          <button
            onClick={() => router.push("/")}
            className="text-xs font-mono text-[#888] hover:text-[#0EA5E9] transition-all border border-[#222222] px-3 h-7 flex items-center hover:border-[#0EA5E9]"
          >
            ← TERM_FEED
          </button>
        </div>
      </header>

      {/* 2. PAGE HERO / ACTIVE TARGET META */}
      <section className="relative z-10 bg-[#080808] border-b border-[#222222] px-6 py-6 md:py-8">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-[#0EA5E9] tracking-widest uppercase">
                {defaultDeal.sector} // {defaultDeal.location}
              </span>
              <span className="text-neutral-700 font-mono text-xs">/</span>
              <span className="font-mono text-xs text-[#666]">CODENAME: {defaultDeal.id.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F9F9F9]">
              {defaultDeal.codename} <span className="text-[#00FF66]">Workspace</span>
            </h1>
            <p className="text-xs text-[#888] max-w-2xl font-mono">
              Leveraged Buyout (LBO) testing sandbox. Alter equity assumptions, leverage margins, operational matrices and exit schedules dynamically.
            </p>
          </div>

          {/* Core Metric Pills */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-black border border-[#222] px-4 py-2.5 min-w-[120px]">
              <span className="font-mono text-[8px] text-[#555] block uppercase">Original Asking</span>
              <span className="text-sm font-mono font-bold text-[#F9F9F9]">{formatCurrency(defaultDeal.asking)}</span>
            </div>
            <div className="bg-black border border-[#222] px-4 py-2.5 min-w-[120px]">
              <span className="font-mono text-[8px] text-[#555] block uppercase">EBITDA (Base)</span>
              <span className="text-sm font-mono font-bold text-[#00FF66]">{formatCurrency(defaultDeal.ebitda)}</span>
            </div>
            <div className="bg-black border border-[#222] px-4 py-2.5 min-w-[120px]">
              <span className="font-mono text-[8px] text-[#555] block uppercase">SBA Pre-Qualified</span>
              <span className="text-sm font-mono font-bold text-[#0EA5E9]">YES (7(A))</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKSPACE CONTAINER */}
      <main className="relative z-10 flex-grow max-w-[1500px] w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CONTROL INTERFACE PANEL (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Bento Group A: Transaction Assumptions */}
          <div className="bg-[#080808] border border-[#222] p-5 space-y-4">
            <div className="border-b border-[#222] pb-2 flex justify-between items-center">
              <h2 className="font-mono text-[10px] text-[#888] tracking-widest uppercase flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-[#0EA5E9] rounded-full"></span>
                <span>01 / DEAL METRICS</span>
              </h2>
              <span className="font-mono text-[9px] text-[#444]">SYS.A1</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase text-[#666] tracking-wider">Purchase Price ($)</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#0EA5E9] text-xs font-mono p-2.5 rounded-none text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase text-[#666] tracking-wider">Base EBITDA ($)</label>
                <input
                  type="number"
                  value={ebitda}
                  onChange={(e) => setEbitda(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#0EA5E9] text-xs font-mono p-2.5 rounded-none text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase text-[#666] tracking-wider">Base Revenue ($)</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#0EA5E9] text-xs font-mono p-2.5 rounded-none text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase text-[#666] tracking-wider">Exit EBITDA Multiple</label>
                <input
                  type="number"
                  step="0.1"
                  value={exitMultiple}
                  onChange={(e) => setExitMultiple(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#0EA5E9] text-xs font-mono p-2.5 rounded-none text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bento Group B: Leverage Stack Sliders */}
          <div className="bg-[#080808] border border-[#222] p-5 space-y-5">
            <div className="border-b border-[#222] pb-2 flex justify-between items-center">
              <h2 className="font-mono text-[10px] text-[#888] tracking-widest uppercase flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-[#00FF66] rounded-full"></span>
                <span>02 / LEVERAGE & STRUCTURAL EQUITY</span>
              </h2>
              <span className="font-mono text-[9px] text-[#444]">SYS.A2</span>
            </div>

            {/* Buyer Cash Injection Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#888] text-[11px]">Buyer Cash Injection (Equity)</span>
                <span className="text-[#F9F9F9] font-bold">{buyerEquityPct}% / {formatCurrency(equityVal)}</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={buyerEquityPct}
                onChange={(e) => setBuyerEquityPct(Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 accent-[#00FF66] cursor-pointer"
              />
            </div>

            {/* Seller Standby Note Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#888] text-[11px]">Seller Standby Note (Vested)</span>
                <span className="text-[#F9F9F9] font-bold">{sellerNotePct}% / {formatCurrency(sellerNoteVal)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={sellerNotePct}
                onChange={(e) => setSellerNotePct(Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 accent-[#00FF66] cursor-pointer"
              />
            </div>

            {/* Locked Senior Debt Info (automatically derived to keep stack to 100%) */}
            <div className="bg-black border border-[#222] p-3 flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="font-mono text-[8px] text-[#666] uppercase block">SBA 7(a) Target Debt (Auto-Balanced)</span>
                <span className="text-xs font-mono font-bold text-[#0EA5E9]">{formatCurrency(sbaLoanVal)}</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#0EA5E9] bg-[#0ea5e9]/10 px-2.5 py-1 border border-[#0ea5e9]/20">
                {sbaLoanPct}% Debt Stack
              </span>
            </div>
          </div>

          {/* Bento Group C: Debt Rates & Amortization parameters */}
          <div className="bg-[#080808] border border-[#222] p-5 space-y-4">
            <div className="border-b border-[#222] pb-2 flex justify-between items-center">
              <h2 className="font-mono text-[10px] text-[#888] tracking-widest uppercase flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-[#FF3333] rounded-full"></span>
                <span>03 / DEBT TERMS</span>
              </h2>
              <span className="font-mono text-[9px] text-[#444]">SYS.A3</span>
            </div>

            {/* Senior SBA Rates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase text-[#666] tracking-wider">SBA Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sbaInterestRate}
                  onChange={(e) => setSbaInterestRate(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#FF3333] text-xs font-mono p-2.5 rounded-none text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase text-[#666] tracking-wider">SBA Amortization (Yrs)</label>
                <input
                  type="number"
                  value={sbaTermYears}
                  onChange={(e) => setSbaTermYears(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#FF3333] text-xs font-mono p-2.5 rounded-none text-white outline-none"
                />
              </div>
            </div>

            {/* Seller Debt Parameters */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase text-[#666] tracking-wider">Seller Note Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  disabled={sellerNotePct === 0}
                  value={sellerInterestRate}
                  onChange={(e) => setSellerInterestRate(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#FF3333] text-xs font-mono p-2.5 rounded-none text-white outline-none disabled:opacity-40"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase text-[#666] tracking-wider">Seller Note Amortization (Yrs)</label>
                <input
                  type="number"
                  disabled={sellerNotePct === 0 || isSellerStandby}
                  value={sellerTermYears}
                  onChange={(e) => setSellerTermYears(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#FF3333] text-xs font-mono p-2.5 rounded-none text-white outline-none disabled:opacity-40"
                />
              </div>
            </div>

            {/* Standby Note Selector (Essential for SBA compliance structure) */}
            {sellerNotePct > 0 && (
              <div className="bg-black border border-[#222] p-3 flex items-center justify-between mt-2">
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-[#FF3333] uppercase block">Standby Period Status</span>
                  <span className="text-xs font-mono text-[#888]">
                    {isSellerStandby ? "Complete standby (Full interest accrues, no cash payment)" : "Standard debt service payouts"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSellerStandby(!isSellerStandby)}
                  className={`px-3 py-1 text-[9px] font-mono uppercase tracking-widest border transition-all ${
                    isSellerStandby
                      ? "bg-[#FF3333]/10 text-[#FF3333] border-[#FF3333]/30"
                      : "bg-neutral-950 text-[#888] border-[#222] hover:text-[#FF3333]"
                  }`}
                >
                  {isSellerStandby ? "[ DEFERRED ]" : "[ CASH Payout ]"}
                </button>
              </div>
            )}
          </div>

          {/* Bento Group D: Operational Assumptions */}
          <div className="bg-[#080808] border border-[#222] p-5 space-y-4">
            <div className="border-b border-[#222] pb-2 flex justify-between items-center">
              <h2 className="font-mono text-[10px] text-[#888] tracking-widest uppercase flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-[#F9F9F9] rounded-full"></span>
                <span>04 / PERFORMANCE PROJECTIONS</span>
              </h2>
              <span className="font-mono text-[9px] text-[#444]">SYS.A4</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="font-mono text-[8px] uppercase text-[#666] tracking-wider">YoY Growth (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#F9F9F9] text-xs font-mono p-2 rounded-none text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[8px] uppercase text-[#666] tracking-wider">EBITDA Margin (%)</label>
                <input
                  type="number"
                  value={ebitdaMargin}
                  onChange={(e) => setEbitdaMargin(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#F9F9F9] text-xs font-mono p-2 rounded-none text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[8px] uppercase text-[#666] tracking-wider">CapEx Pct (% Rev)</label>
                <input
                  type="number"
                  step="0.5"
                  value={capexPct}
                  onChange={(e) => setCapexPct(Number(e.target.value))}
                  className="w-full bg-black border border-[#222] focus:border-[#F9F9F9] text-xs font-mono p-2 rounded-none text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS OUTFLOW BOARD (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Sources and Uses Balance */}
          <div className="bg-[#080808] border border-[#222] p-5">
            <h3 className="font-mono text-[10px] text-[#888] tracking-widest uppercase border-b border-[#222] pb-2 mb-4 flex justify-between items-center">
              <span>SOURCES & USES BALANCE SHEET</span>
              <span className="text-[#00FF66] text-[9px]">TOTAL VALUATION: {formatCurrency(purchasePrice)}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Uses Table */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] uppercase text-[#666] block tracking-wider">01 // TRANSACTION USES</span>
                <div className="border border-[#222] bg-black divide-y divide-[#151515] text-xs font-mono">
                  <div className="p-2.5 flex justify-between">
                    <span className="text-[#888]">Enterprise Value Acquisition</span>
                    <span className="text-white font-semibold">{formatCurrency(purchasePrice)}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-[#888]">Closing & Legal (Est.)</span>
                    <span className="text-white font-semibold">{formatCurrency(purchasePrice * 0.015)}</span>
                  </div>
                  <div className="p-2.5 flex justify-between font-bold bg-[#111]">
                    <span className="text-[#0EA5E9]">Total Transaction Uses</span>
                    <span className="text-[#0EA5E9]">{formatCurrency(purchasePrice * 1.015)}</span>
                  </div>
                </div>
              </div>

              {/* Sources Table */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] uppercase text-[#666] block tracking-wider">02 // CAPITAL SOURCES</span>
                <div className="border border-[#222] bg-black divide-y divide-[#151515] text-xs font-mono">
                  <div className="p-2.5 flex justify-between">
                    <span className="text-[#888]">Senior SBA 7(a) Debt</span>
                    <span className="text-[#00FF66] font-semibold">{formatCurrency(sbaLoanVal)}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-[#888]">Seller Standby Note</span>
                    <span className="text-white font-semibold">{formatCurrency(sellerNoteVal)}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-[#888]">Buyer Cash Equity</span>
                    <span className="text-[#0EA5E9] font-semibold">{formatCurrency(equityVal)}</span>
                  </div>
                  <div className="p-2.5 flex justify-between font-bold bg-[#111]">
                    <span className="text-[#0EA5E9]">Total Structural Sources</span>
                    <span className="text-[#0EA5E9]">{formatCurrency(equityVal + sbaLoanVal + sellerNoteVal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Year Pro-Forma Cash Flow Table */}
          <div className="bg-[#080808] border border-[#222] p-5 overflow-x-auto">
            <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-4">
              <h3 className="font-mono text-[10px] text-[#888] tracking-widest uppercase">
                PRE-TAX FINANCIALS FORECAST & REPAYMENT MODEL
              </h3>
              <span className="font-mono text-[8px] bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20 px-2 py-0.5">
                DSCR CRITICAL RATIOS
              </span>
            </div>

            <table className="w-full text-left font-mono text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#222] text-[#666] text-[10px]">
                  <th className="py-2">VARIABLE</th>
                  <th className="py-2 text-right">YEAR 1</th>
                  <th className="py-2 text-right">YEAR 2</th>
                  <th className="py-2 text-right">YEAR 3</th>
                  <th className="py-2 text-right">YEAR 4</th>
                  <th className="py-2 text-right">YEAR 5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151515]">
                <tr className="hover:bg-neutral-900/50">
                  <td className="py-2.5 font-bold text-[#F9F9F9]">Projected Revenue</td>
                  {projection.map((y) => (
                    <td key={y.year} className="py-2.5 text-right text-white">{formatCurrency(y.revenue)}</td>
                  ))}
                </tr>
                <tr className="hover:bg-neutral-900/50">
                  <td className="py-2.5 font-bold text-[#00FF66]">EBITDA Cash Flow</td>
                  {projection.map((y) => (
                    <td key={y.year} className="py-2.5 text-right text-[#00FF66]">{formatCurrency(y.ebitda)}</td>
                  ))}
                </tr>
                <tr className="hover:bg-neutral-900/50 text-[#888]">
                  <td className="py-2.5">Capital Expenditures</td>
                  {projection.map((y) => (
                    <td key={y.year} className="py-2.5 text-right">{formatCurrency(y.capex)}</td>
                  ))}
                </tr>
                <tr className="hover:bg-neutral-900/50 text-[#888]">
                  <td className="py-2.5">Senior SBA Loan Pmt</td>
                  {projection.map((y) => (
                    <td key={y.year} className="py-2.5 text-right">{formatCurrency(y.sbaDebtService)}</td>
                  ))}
                </tr>
                <tr className="hover:bg-neutral-900/50 text-[#888]">
                  <td className="py-2.5">Seller Note Payout</td>
                  {projection.map((y) => (
                    <td key={y.year} className="py-2.5 text-right">
                      {y.sellerDebtService > 0 ? formatCurrency(y.sellerDebtService) : "$0 (Standby)"}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-neutral-900/50 bg-[#111]/20">
                  <td className="py-2.5 font-bold text-white">Pre-Tax FCF (to Equity)</td>
                  {projection.map((y) => (
                    <td key={y.year} className={`py-2.5 text-right font-bold ${y.preTaxFcf >= 0 ? "text-[#0EA5E9]" : "text-[#FF3333]"}`}>
                      {formatCurrency(y.preTaxFcf)}
                    </td>
                  ))}
                </tr>
                <tr className="bg-black">
                  <td className="py-3 font-bold text-[#888] text-[10px]">DEBT SERVICE COVERAGE (DSCR)</td>
                  {projection.map((y) => (
                    <td
                      key={y.year}
                      className={`py-3 text-right font-mono font-extrabold text-sm ${
                        y.dscr >= 1.75 ? "text-[#00FF66]" : y.dscr >= 1.25 ? "text-[#0EA5E9]" : "text-[#FF3333]"
                      }`}
                    >
                      {y.dscr.toFixed(2)}x
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Leveraged Returns & Exit Evaluation Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Target Return Ratios */}
            <div className="bg-[#080808] border border-[#222222] p-5 space-y-4 relative overflow-hidden">
              <h4 className="font-mono text-[10px] text-[#888] tracking-widest uppercase border-b border-[#222] pb-2">
                03 / ACQUISITION TARGET YIELD
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black border border-[#1c1c1c] p-3">
                    <span className="font-mono text-[8px] text-[#555] block uppercase">5-YEAR HORIZON IRR</span>
                    <span className="text-xl font-bold text-[#00FF66] tracking-tight font-mono">
                      {returns.irr > 0 ? `${returns.irr.toFixed(1)}%` : "N/A"}
                    </span>
                  </div>
                  <div className="bg-black border border-[#1c1c1c] p-3">
                    <span className="font-mono text-[8px] text-[#555] block uppercase">RETURN MULTIPLE (MoIC)</span>
                    <span className="text-xl font-bold text-[#0EA5E9] tracking-tight font-mono">
                      {returns.moic > 0 ? `${returns.moic.toFixed(2)}x` : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono leading-relaxed text-[#888] space-y-1">
                  <p>• Initial Equity Required: <span className="text-white">{formatCurrency(equityVal)}</span></p>
                  <p>• Net Exit proceeds (Yr 5): <span className="text-[#0EA5E9]">{formatCurrency(returns.netExitProceeds)}</span></p>
                  <p>• Ending Multi-Debt Pool: <span className="text-[#FF3333]">{formatCurrency(returns.endingDebt)}</span></p>
                </div>
              </div>
            </div>

            {/* Strategic SBA Underwriting Rules Checklist */}
            <div className="bg-[#080808] border border-[#222] p-5 space-y-3">
              <h4 className="font-mono text-[10px] text-[#FF3333] tracking-widest uppercase border-b border-[#222] pb-2">
                SBA 7(A) CRITICAL AUDITS
              </h4>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-start space-x-2">
                  <span className={sbaLoanVal > 5000000 ? "text-[#FF3333]" : "text-[#00FF66]"}>
                    {sbaLoanVal > 5000000 ? "✕" : "✓"}
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-white block font-bold text-[11px]">SBA Cap Limit Match</span>
                    <p className="text-[10px] text-[#888] leading-normal">
                      Debt cannot exceed $5.0M limit. Current simulated SBA debt: {formatCurrency(sbaLoanVal)}.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <span className={buyerEquityPct < 10 ? "text-[#FF3333]" : "text-[#00FF66]"}>
                    {buyerEquityPct < 10 ? "✕" : "✓"}
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-white block font-bold text-[11px]">Equity Injection Threshold</span>
                    <p className="text-[10px] text-[#888] leading-normal">
                      SBA 7(a) requires a minimum of 10% equity injection on structured buyouts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <span className={isSellerStandby && sellerNotePct > 0 ? "text-[#00FF66]" : "text-[#0EA5E9]"}>
                    {isSellerStandby && sellerNotePct > 0 ? "✓" : "▲"}
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-white block font-bold text-[11px]">Standby Note Alignment</span>
                    <p className="text-[10px] text-[#888] leading-normal">
                      Notes on full standby count as equity equity components for credit requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger Sandbox */}
          <div className="bg-[#080808] border border-[#222] p-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => alert("Acquisition model exported to local secure terminal database as XLSX/CSV simulation.")}
              className="flex-grow h-12 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-xs font-bold tracking-widest uppercase transition-all hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]"
            >
              GENERATE TERM STRUCTURE EXPORT
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 h-12 bg-neutral-900 border border-[#222222] font-mono text-xs text-[#888] hover:text-[#F9F9F9] hover:bg-neutral-800 transition-all uppercase"
            >
              ABORT WORKSPACE
            </button>
          </div>

        </div>
      </main>

      {/* 4. TRANSACTIONS & SYSTEM FOOTER */}
      <footer className="mt-auto w-full bg-[#080808] border-t border-[#222222] relative z-10">
        <div className="max-w-[1500px] w-full mx-auto px-6 py-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-[10px] text-[#666] max-w-4xl leading-relaxed text-center md:text-left">
              Operational parameters modeled on typical variable SBA standards. Actual debt terms under continuous updates depending on primary Fed rates and bank metrics. Real-time system monitoring active.
            </p>
            <div className="flex space-x-2 shrink-0">
              <span className="border border-[#222] bg-black px-3 py-1 font-mono text-[9px] text-[#888] tracking-wider">
                DEBT ENGINE v3.11
              </span>
              <span className="border border-[#222] bg-black px-3 py-1 font-mono text-[9px] text-[#888] tracking-wider">
                MOONSHINE INTEGRATION
              </span>
            </div>
          </div>
          <div className="border-t border-[#111] pt-4 flex justify-between text-[10px] font-mono text-[#444]">
            <span>ESTABLISHED LINK FOR CLIENT SHELL: SH-883</span>
            <span>© 2026 ACQUIREMETA TECHNOLOGY. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
```