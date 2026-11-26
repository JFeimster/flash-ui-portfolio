```tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';

// Interfaces for Deal Preset Data
interface DealPreset {
  codename: string;
  vertical: string;
  revenue: number;
  ebitda: number;
  asking: number;
  sbaEligible: boolean;
  highConcentration: boolean;
  location: string;
}

export default function LBOAnalyzerPage() {
  // Deal presets matching the underground database
  const dealPresets: DealPreset[] = [
    {
      codename: "PROJECT DELTA",
      vertical: "Logistics",
      revenue: 2450000,
      ebitda: 620000,
      asking: 1850000,
      sbaEligible: true,
      highConcentration: false,
      location: "Southeast Hub",
    },
    {
      codename: "PROJECT HYDRO",
      vertical: "HVAC",
      revenue: 3100000,
      ebitda: 780000,
      asking: 2200000,
      sbaEligible: true,
      highConcentration: false,
      location: "Franconia, VA",
    },
    {
      codename: "PROJECT APEX",
      vertical: "SaaS",
      revenue: 1200000,
      ebitda: 450000,
      asking: 1980000,
      sbaEligible: false,
      highConcentration: true,
      location: "Remote",
    },
    {
      codename: "PROJECT TITAN",
      vertical: "Manufacturing",
      revenue: 5200000,
      ebitda: 1150000,
      asking: 3950000,
      sbaEligible: true,
      highConcentration: false,
      location: "Midwest Cluster",
    },
  ];

  // Active state for presets
  const [selectedPreset, setSelectedPreset] = useState<string>("PROJECT DELTA");

  // Core model state
  const [purchasePrice, setPurchasePrice] = useState<number>(1850000);
  const [ebitda, setEbitda] = useState<number>(620000);

  // Capital Stack Percentages (must total <= 100%, equity is automatic remainder)
  const [sbaLoanPct, setSbaLoanPct] = useState<number>(75);
  const [sbaInterestRate, setSbaInterestRate] = useState<number>(10.5); // Prime + spread
  const [sbaAmortYears, setSbaAmortYears] = useState<number>(10);

  const [sellerNotePct, setSellerNotePct] = useState<number>(15);
  const [sellerNoteRate, setSellerNoteRate] = useState<number>(6.0);
  const [sellerNoteYears, setSellerNoteYears] = useState<number>(5);

  const [mezzaninePct, setMezzaninePct] = useState<number>(0);
  const [mezzanineRate, setMezzanineRate] = useState<number>(14.0);
  const [mezzanineYears, setMezzanineYears] = useState<number>(7);

  // Downside Stress Sliders
  const [ebitdaHaircut, setEbitdaHaircut] = useState<number>(15); // Percentage haircut
  const [rateHike, setRateHike] = useState<number>(0); // Percentage interest rate hike applied globally

  // Clock state
  const [currentTime, setCurrentTime] = useState<string>('12:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Preset Switching
  const handlePresetChange = (name: string) => {
    setSelectedPreset(name);
    if (name === "CUSTOM") return;
    const preset = dealPresets.find(p => p.codename === name);
    if (preset) {
      setPurchasePrice(preset.asking);
      setEbitda(preset.ebitda);
      // Auto structure standard parameters for SBA vs SaaS
      if (preset.sbaEligible) {
        setSbaLoanPct(75);
        setSellerNotePct(15);
        setMezzaninePct(0);
      } else {
        // SaaS/Non-SBA usually requires high cash/mezz/seller leverage
        setSbaLoanPct(0);
        setSellerNotePct(25);
        setMezzaninePct(30);
      }
    }
  };

  // Capital calculations
  const capStack = useMemo(() => {
    const sbaAmount = (purchasePrice * sbaLoanPct) / 100;
    const sellerNoteAmount = (purchasePrice * sellerNotePct) / 100;
    const mezzAmount = (purchasePrice * mezzaninePct) / 100;
    const equityRequired = Math.max(0, purchasePrice - sbaAmount - sellerNoteAmount - mezzAmount);

    return {
      sbaAmount,
      sellerNoteAmount,
      mezzAmount,
      equityRequired,
      totalDebt: sbaAmount + sellerNoteAmount + mezzAmount,
      equityPct: (equityRequired / purchasePrice) * 100,
    };
  }, [purchasePrice, sbaLoanPct, sellerNotePct, mezzaninePct]);

  // Amortization Helpers (PMT Calculator)
  const calcAnnualDebtService = (principal: number, interestRate: number, years: number): number => {
    if (principal <= 0 || interestRate <= 0 || years <= 0) return 0;
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = years * 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return monthlyPayment * 12;
  };

  // Structured calculations with stress tests applied
  const structuralMetrics = useMemo(() => {
    const stressedSbaRate = sbaInterestRate + rateHike;
    const stressedSellerRate = sellerNoteRate + rateHike;
    const stressedMezzRate = mezzanineRate + rateHike;

    const sbaDebtService = calcAnnualDebtService(capStack.sbaAmount, stressedSbaRate, sbaAmortYears);
    const sellerDebtService = calcAnnualDebtService(capStack.sellerNoteAmount, stressedSellerRate, sellerNoteYears);
    const mezzDebtService = calcAnnualDebtService(capStack.mezzAmount, stressedMezzRate, mezzanineYears);

    const totalAnnualDebtService = sbaDebtService + sellerDebtService + mezzDebtService;

    // Haircut Calculations
    const stressedEbitda = ebitda * (1 - ebitdaHaircut / 100);
    const postDebtServiceCashFlow = stressedEbitda - totalAnnualDebtService;

    // DSCR
    const dscr = totalAnnualDebtService > 0 ? stressedEbitda / totalAnnualDebtService : 99.9;

    // Yield Metrics
    const cashOnCashYield = capStack.equityRequired > 0 
      ? (postDebtServiceCashFlow / capStack.equityRequired) * 100 
      : 0;

    return {
      sbaDebtService,
      sellerDebtService,
      mezzDebtService,
      totalAnnualDebtService,
      stressedEbitda,
      postDebtServiceCashFlow,
      dscr,
      cashOnCashYield,
    };
  }, [
    capStack, ebitda, sbaInterestRate, sbaAmortYears, sellerNoteRate, sellerNoteYears,
    mezzanineRate, mezzanineYears, rateHike, ebitdaHaircut
  ]);

  // Dynamic 5-Year Projections Table Data
  const fiveYearProjections = useMemo(() => {
    const projections = [];
    let sbaBal = capStack.sbaAmount;
    let sellerBal = capStack.sellerNoteAmount;
    let mezzBal = capStack.mezzAmount;

    // Simple fixed annual payback estimation for presentation
    for (let year = 1; year <= 5; year++) {
      // Annual ebitda growth estimation (e.g. 3% standard)
      const yrEbitda = structuralMetrics.stressedEbitda * Math.pow(1.03, year - 1);
      
      const sbaInterest = sbaBal * ((sbaInterestRate + rateHike) / 100);
      const sbaPrincipal = Math.min(sbaBal, structuralMetrics.sbaDebtService - sbaInterest);
      
      const sellerInterest = sellerBal * ((sellerNoteRate + rateHike) / 100);
      const sellerPrincipal = Math.min(sellerBal, structuralMetrics.sellerDebtService - sellerInterest);

      const mezzInterest = mezzBal * ((mezzanineRate + rateHike) / 100);
      const mezzPrincipal = Math.min(mezzBal, structuralMetrics.mezzDebtService - mezzInterest);

      const yrDebtService = 
        (sbaBal > 0 ? structuralMetrics.sbaDebtService : 0) + 
        (sellerBal > 0 ? structuralMetrics.sellerDebtService : 0) + 
        (mezzBal > 0 ? structuralMetrics.mezzDebtService : 0);

      sbaBal = Math.max(0, sbaBal - sbaPrincipal);
      sellerBal = Math.max(0, sellerBal - sellerPrincipal);
      mezzBal = Math.max(0, mezzBal - mezzPrincipal);

      const yrRemainingDebt = sbaBal + sellerBal + mezzBal;
      const yrPostCashFlow = yrEbitda - yrDebtService;
      const yrDscr = yrDebtService > 0 ? yrEbitda / yrDebtService : 99.9;

      projections.push({
        year,
        ebitda: yrEbitda,
        debtService: yrDebtService,
        cashFlow: yrPostCashFlow,
        remainingDebt: yrRemainingDebt,
        dscr: yrDscr,
      });
    }
    return projections;
  }, [capStack, structuralMetrics, sbaInterestRate, sellerNoteRate, mezzanineRate, rateHike]);

  // Currency Formatter
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] min-h-screen flex flex-col font-sans select-none selection:bg-[#00FF66] selection:text-black">
      {/* Strict border-radius overrides for cyberpunk/terminal design theme */}
      <style dangerouslySetInnerHTML={{ __html: `* { border-radius: 0px !important; }` }} />

      {/* HEADER PROTOCOL BAR */}
      <header className="w-full bg-black border-b border-[#222] z-50">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#111] text-[10px] font-mono tracking-widest text-[#888]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-[#00FF66] font-semibold">
              <span className="inline-block w-2 h-2 mr-2 bg-[#00FF66] animate-pulse"></span>
              LBO SIMULATION TERMINAL: ACTIVE
            </span>
            <span className="hidden md:inline text-[#222]">|</span>
            <span className="hidden md:inline">SYSTEM CONTEXT: STRESS-TEST ENGINE</span>
            <span className="hidden md:inline text-[#222]">|</span>
            <span className="hidden md:inline">SBA 7(a) COMPLIANCE LAYER: ENGAGED</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>CLOCK: <span className="text-[#00FF66]">{currentTime}</span></span>
            <span className="text-[#0EA5E9]">ENGINE_VER: #89X-LBO</span>
          </div>
        </div>

        {/* Ticker / Alert Marquee */}
        <div className="w-full overflow-hidden whitespace-nowrap bg-[#0a0a0a] py-2 border-b border-[#222] flex items-center">
          <div className="inline-flex animate-[marquee_30s_linear_infinite] text-[10px] font-mono tracking-wider text-[#F9F9F9]/80">
            <span className="mx-6 text-[#FF3333] font-bold">[SBA RATE ALERT: PRIME INDEX AT 8.50% + MULTIPLE BANK SPREADS IN EFFECT]</span>
            <span className="mx-6 text-[#0EA5E9]">[STRESS TEST COMPLIANCE: ALL ACQUISITIONS REQUIRE MINIMUM 1.15x RISK HAIRCUT DSCR]</span>
            <span className="mx-6 text-[#00FF66]">[PRESET SYNC: PROJECT DELTA & HYDRO LOADED FROM LIVE DEALS FEED]</span>
            <span className="mx-6 text-white">[ALERT: CASH-ON-CASH SENSITIVITY HIGHLY CORRELATED TO SELLER STANDBY STRUCTURING]</span>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#050505] via-[#090909] to-[#050505]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#00FF66] text-black text-[10px] font-mono font-black px-1.5 py-0.5 tracking-tighter">FINANCIAL ENGINEERING</span>
              <span className="text-[10px] font-mono text-[#0EA5E9] tracking-widest font-bold">LBO SANDBOX V4.1</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
              DEBT SERVICE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F9F9] via-[#0ea5e9] to-[#00FF66]">AMORTIZATION MATRIX</span>
            </h1>
            <p className="text-xs text-[#888] font-mono mt-0.5">Model capital allocation stacks, evaluate DSCR under downside conditions, and stress test structural metrics.</p>
          </div>

          {/* Quick Header Presets HUD */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-mono text-[#888] self-center mr-2">DEAL PRESETS:</span>
            {dealPresets.map(preset => (
              <button
                key={preset.codename}
                onClick={() => handlePresetChange(preset.codename)}
                className={`px-3 py-1.5 font-mono text-xs border tracking-wider transition-all ${
                  selectedPreset === preset.codename
                    ? 'bg-[#0EA5E9]/20 border-[#0EA5E9] text-[#0EA5E9] font-bold'
                    : 'bg-[#080808] border-[#222] text-[#888] hover:border-[#444] hover:text-white'
                }`}
              >
                {preset.codename}
              </button>
            ))}
            <button
              onClick={() => handlePresetChange('CUSTOM')}
              className={`px-3 py-1.5 font-mono text-xs border tracking-wider transition-all ${
                selectedPreset === 'CUSTOM'
                  ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] font-bold'
                  : 'bg-[#080808] border-[#222] text-[#888] hover:border-[#444] hover:text-white'
              }`}
            >
              [CUSTOM MODEL]
            </button>
          </div>
        </div>
      </header>

      {/* MAIN INTERACTIVE CORE */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#222]">
        
        {/* LEFT COLUMN: PARAMETER DIALS & CONTROLS */}
        <aside className="lg:col-span-4 bg-[#080808] border-r border-[#222] p-6 space-y-6">
          
          {/* Section: Asset Purchase Valuation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-2">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
                ASSET VALUATION
              </h2>
              <span className="text-[10px] font-mono text-[#888]">ENTERPRISE COST</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase">Purchase Price</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => {
                    setSelectedPreset('CUSTOM');
                    setPurchasePrice(Math.max(0, Number(e.target.value)));
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase">Target EBITDA</label>
                <input
                  type="number"
                  value={ebitda}
                  onChange={(e) => {
                    setSelectedPreset('CUSTOM');
                    setEbitda(Math.max(0, Number(e.target.value)));
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#00FF66] text-xs font-mono text-white p-2.5 outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-[#0c0c0c] border border-[#222] flex justify-between items-center text-xs font-mono">
              <span className="text-[#888]">Implied Valuation Multiple:</span>
              <span className="text-[#0EA5E9] font-bold">
                {ebitda > 0 ? (purchasePrice / ebitda).toFixed(2) : '0.00'}x
              </span>
            </div>
          </div>

          {/* Section: Capital Allocation Stack */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-2">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#00FF66] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#00FF66]"></span>
                CAPITAL STACK ENGINES
              </h2>
              <span className="text-[10px] font-mono text-[#00FF66]">TOTAL: {sbaLoanPct + sellerNotePct + mezzaninePct}% + Equity</span>
            </div>

            {/* SBA 7(a) Loan */}
            <div className="space-y-2 p-3 bg-[#0c0c0c] border border-[#222]">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white font-semibold">SBA 7(a) Guarantee Loan</span>
                <span className="text-[#0ea5e9] font-bold">{sbaLoanPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={sbaLoanPct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val + sellerNotePct + mezzaninePct <= 100) {
                    setSbaLoanPct(val);
                  }
                }}
                className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-[8px] font-mono text-[#888] uppercase">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={sbaInterestRate}
                    onChange={(e) => setSbaInterestRate(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#050505] border border-[#222] text-xs font-mono p-1"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-[#888] uppercase">Amortization (Yrs)</label>
                  <input
                    type="number"
                    value={sbaAmortYears}
                    onChange={(e) => setSbaAmortYears(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#050505] border border-[#222] text-xs font-mono p-1"
                  />
                </div>
              </div>
            </div>

            {/* Seller Note */}
            <div className="space-y-2 p-3 bg-[#0c0c0c] border border-[#222]">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white font-semibold">Seller Carry-Back Note</span>
                <span className="text-[#0ea5e9] font-bold">{sellerNotePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={sellerNotePct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (sbaLoanPct + val + mezzaninePct <= 100) {
                    setSellerNotePct(val);
                  }
                }}
                className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-[8px] font-mono text-[#888] uppercase">Note Rate (%)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={sellerNoteRate}
                    onChange={(e) => setSellerNoteRate(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#050505] border border-[#222] text-xs font-mono p-1"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-[#888] uppercase">Term (Yrs)</label>
                  <input
                    type="number"
                    value={sellerNoteYears}
                    onChange={(e) => setSellerNoteYears(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#050505] border border-[#222] text-xs font-mono p-1"
                  />
                </div>
              </div>
            </div>

            {/* Mezzanine Debt */}
            <div className="space-y-2 p-3 bg-[#0c0c0c] border border-[#222]">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white font-semibold">Mezzanine / Senior Debt</span>
                <span className="text-[#0ea5e9] font-bold">{mezzaninePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={mezzaninePct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (sbaLoanPct + sellerNotePct + val <= 100) {
                    setMezzaninePct(val);
                  }
                }}
                className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-[8px] font-mono text-[#888] uppercase">Mezz Rate (%)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={mezzanineRate}
                    onChange={(e) => setMezzanineRate(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#050505] border border-[#222] text-xs font-mono p-1"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-[#888] uppercase">Amort Term (Yrs)</label>
                  <input
                    type="number"
                    value={mezzanineYears}
                    onChange={(e) => setMezzanineYears(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#050505] border border-[#222] text-xs font-mono p-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Downside Scenario Stress-Testing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-2">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#FF3333] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#FF3333]"></span>
                STRESS TEST PARAMETERS
              </h2>
              <span className="text-[10px] font-mono text-[#FF3333] font-bold">WARNING HIGH RISK ZONE</span>
            </div>

            {/* Slider for EBITDA haircut */}
            <div className="space-y-2 p-3 bg-[#110505] border border-[#FF3333]/30">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#FF3333] font-semibold">EBITDA Decline (Haircut)</span>
                <span className="text-[#FF3333] font-bold">-{ebitdaHaircut}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={ebitdaHaircut}
                onChange={(e) => setEbitdaHaircut(Number(e.target.value))}
                className="w-full accent-[#FF3333] bg-[#222] h-1 cursor-pointer"
              />
              <p className="text-[9px] font-mono text-[#888] leading-tight">
                Simulates customer base attrition, severe macroeconomic downturns, or supply-chain shocks.
              </p>
            </div>

            {/* Slider for interest rate hike */}
            <div className="space-y-2 p-3 bg-[#110505] border border-[#FF3333]/30">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#FF3333] font-semibold">Systemic Interest Rate Hike</span>
                <span className="text-[#FF3333] font-bold">+{rateHike.toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.25"
                value={rateHike}
                onChange={(e) => setRateHike(Number(e.target.value))}
                className="w-full accent-[#FF3333] bg-[#222] h-1 cursor-pointer"
              />
              <p className="text-[9px] font-mono text-[#888] leading-tight">
                Applies instant rate expansion to test sensitivity of floating interest mechanisms.
              </p>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: DETAILED HUD INTERFACE & RESULTS */}
        <section className="lg:col-span-8 bg-[#050505] p-6 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* STACK BREAKDOWN & DEBT LEVEL SUMMARY */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#222] border border-[#222]">
              <div className="bg-[#0c0c0c] p-4 font-mono">
                <div className="text-[9px] text-[#888]">TOTAL PURCHASE PRICE</div>
                <div className="text-sm font-bold text-white mt-1">{formatUSD(purchasePrice)}</div>
              </div>
              <div className="bg-[#0c0c0c] p-4 font-mono">
                <div className="text-[9px] text-[#888]">TOTAL LEVERAGE DEBT</div>
                <div className="text-sm font-bold text-[#0ea5e9] mt-1">{formatUSD(capStack.totalDebt)}</div>
              </div>
              <div className="bg-[#0c0c0c] p-4 font-mono">
                <div className="text-[9px] text-[#888]">REQUIRED EQUITY BASE</div>
                <div className="text-sm font-bold text-[#00FF66] mt-1">{formatUSD(capStack.equityRequired)}</div>
              </div>
              <div className="bg-[#0c0c0c] p-4 font-mono">
                <div className="text-[9px] text-[#888]">EQUITY RATIO</div>
                <div className="text-sm font-bold text-white mt-1">{capStack.equityPct.toFixed(1)}%</div>
              </div>
            </div>

            {/* MASTER DSCR REAL-TIME HEADS UP DISPLAY */}
            <div className="border border-[#222] bg-[#080808] p-5 relative overflow-hidden">
              
              {/* Terminal Glow Indicator depending on DSCR health */}
              <div 
                className={`absolute left-0 top-0 w-1.5 h-full ${
                  structuralMetrics.dscr < 1.15 ? 'bg-[#FF3333]' : structuralMetrics.dscr < 1.30 ? 'bg-amber-500' : 'bg-[#00FF66]'
                }`}
              ></div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#888] uppercase">CORE METRIC</span>
                    <span className="bg-[#111] text-[9px] border border-[#222] text-[#0ea5e9] px-1.5 font-mono">STRESSED ESTIMATE</span>
                  </div>
                  <h3 className="font-mono text-lg font-bold text-white">DEBT SERVICE COVERAGE RATIO (DSCR)</h3>
                  <p className="text-xs text-[#888] font-mono">
                    Lenders strictly require &gt;1.15x post-haircut to clear regional underwriting processes.
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div 
                    className={`text-4xl font-mono font-black tracking-tighter ${
                      structuralMetrics.dscr < 1.15 ? 'text-[#FF3333]' : structuralMetrics.dscr < 1.30 ? 'text-amber-500' : 'text-[#00FF66]'
                    }`}
                  >
                    {structuralMetrics.dscr.toFixed(2)}x
                  </div>
                  <div className="text-[10px] font-mono text-[#888] uppercase tracking-wider mt-1">
                    {structuralMetrics.dscr < 1.15 
                      ? '⚠️ CRITICAL REJECTION RANGE' 
                      : structuralMetrics.dscr < 1.30 
                      ? '⚠️ WARNING: THIN COVENANT MARGIN' 
                      : '✅ SECURE DEBT PROFILE'}
                  </div>
                </div>
              </div>

              {/* Progress Indicator HUD Meter */}
              <div className="w-full bg-[#111] h-2 mt-4 border border-[#222] flex">
                <div 
                  className={`h-full transition-all duration-300 ${
                    structuralMetrics.dscr < 1.15 ? 'bg-[#FF3333]' : structuralMetrics.dscr < 1.30 ? 'bg-amber-500' : 'bg-[#00FF66]'
                  }`}
                  style={{ width: `${Math.min(100, (structuralMetrics.dscr / 2.5) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[8px] font-mono text-[#444] mt-1">
                <span>0.0x CRITICAL</span>
                <span>1.15x LENDER MIN</span>
                <span>1.5x SOLID</span>
                <span>2.0x+ SECURE</span>
              </div>
            </div>

            {/* STRESSED OPERATIONAL LEDGER (Detailed cash output flow) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              
              {/* Stressed Cash Flow Bridge */}
              <div className="border border-[#222] bg-[#0c0c0c] p-4 space-y-3">
                <div className="text-[10px] font-bold text-[#0ea5e9] tracking-wider uppercase border-b border-[#222] pb-1.5 flex justify-between">
                  <span>STRESSED EBITDA BRIDGE</span>
                  <span>(DECREASE: {ebitdaHaircut}%)</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[#888]">
                    <span>Original Annual EBITDA:</span>
                    <span className="text-white">{formatUSD(ebitda)}</span>
                  </div>
                  <div className="flex justify-between text-[#FF3333]">
                    <span>Downside Attrition Hit:</span>
                    <span>-{formatUSD(ebitda - structuralMetrics.stressedEbitda)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-[#222] pt-1.5 text-[#00FF66]">
                    <span>Stressed Annual EBITDA:</span>
                    <span>{formatUSD(structuralMetrics.stressedEbitda)}</span>
                  </div>
                </div>
              </div>

              {/* Cash on Cash yields */}
              <div className="border border-[#222] bg-[#0c0c0c] p-4 space-y-3">
                <div className="text-[10px] font-bold text-[#0ea5e9] tracking-wider uppercase border-b border-[#222] pb-1.5 flex justify-between">
                  <span>EQUITY YIELD MATRIX</span>
                  <span>LEVERED RETURN</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[#888]">
                    <span>Net Cash Flow (Post-Debt):</span>
                    <span className={`font-bold ${structuralMetrics.postDebtServiceCashFlow > 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                      {formatUSD(structuralMetrics.postDebtServiceCashFlow)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#888]">
                    <span>Required Cash Equity:</span>
                    <span className="text-white">{formatUSD(capStack.equityRequired)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-[#222] pt-1.5 text-white">
                    <span>Levered Cash-on-Cash Yield:</span>
                    <span className={structuralMetrics.cashOnCashYield > 15 ? 'text-[#00FF66]' : structuralMetrics.cashOnCashYield > 0 ? 'text-amber-500' : 'text-[#FF3333]'}>
                      {structuralMetrics.cashOnCashYield.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Year-by-Year Debt Trajectory Schedule */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs font-bold tracking-wider text-white uppercase border-b border-[#222] pb-1.5">
                5-YEAR INTEGRATED TRANSACTION PROJECTIONS
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] border border-[#222]">
                  <thead>
                    <tr className="bg-[#0c0c0c] text-[#888] border-b border-[#222]">
                      <th className="p-2.5">YEAR</th>
                      <th className="p-2.5 text-right">ESTIMATED EBITDA</th>
                      <th className="p-2.5 text-right">TOTAL DEBT SERVICE</th>
                      <th className="p-2.5 text-right">FREE CASH FLOW (NET)</th>
                      <th className="p-2.5 text-right">DSCR STATUS</th>
                      <th className="p-2.5 text-right">REMAINING PRINCIPAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#111]">
                    {fiveYearProjections.map(proj => (
                      <tr key={proj.year} className="hover:bg-[#0c0c0c]/55 transition-colors">
                        <td className="p-2.5 text-[#0EA5E9] font-bold">Y{proj.year}</td>
                        <td className="p-2.5 text-right text-white">{formatUSD(proj.ebitda)}</td>
                        <td className="p-2.5 text-right text-[#FF3333]">{formatUSD(proj.debtService)}</td>
                        <td className={`p-2.5 text-right font-bold ${proj.cashFlow > 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                          {formatUSD(proj.cashFlow)}
                        </td>
                        <td className={`p-2.5 text-right font-bold ${proj.dscr < 1.15 ? 'text-[#FF3333]' : proj.dscr < 1.3 ? 'text-amber-500' : 'text-[#00FF66]'}`}>
                          {proj.dscr.toFixed(2)}x
                        </td>
                        <td className="p-2.5 text-right text-[#888]">{formatUSD(proj.remainingDebt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>

          {/* RISK MITIGATION ADVISORY & SIMULATION VERDICT */}
          <div className="mt-8 pt-6 border-t border-[#222] grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#0a0a0a]/70 p-4 border border-[#222]">
            <div className="md:col-span-8 space-y-1">
              <span className="text-[9px] font-mono text-[#FF3333] font-bold tracking-widest uppercase">
                AUTOMATED UNDERWRITING FEEDBACK & VERDICT
              </span>
              <p className="text-[11px] font-mono text-[#888] leading-tight">
                {structuralMetrics.dscr < 1.15 
                  ? 'CRITICAL ALERT: Debt service parameters fail structural stress checks. Immediate capital re-balancing required. Increase equity infusion or renegotiate EV.'
                  : structuralMetrics.dscr < 1.3 
                  ? 'COVENANT ADVISORY: Capital stack meets general threshold guidelines, but shows extreme sensitivity to rate shocks. Recommend minimum 20% standby seller carry.'
                  : 'VALIDATED: Sound structural composition. Deal displays high cash coverage resilience and secure payback vectors.'}
              </p>
            </div>

            <div className="md:col-span-4 text-right">
              <button 
                onClick={() => alert(`LBO Amortization Simulation Saved!\n---------------------------\nTarget EV: ${formatUSD(purchasePrice)}\nDSCR Under Attrition: ${structuralMetrics.dscr.toFixed(2)}x\nPost-Debt Free Cash: ${formatUSD(structuralMetrics.postDebtServiceCashFlow)}`)}
                className="w-full bg-[#00FF66] text-black font-mono text-xs font-bold px-4 py-3 tracking-widest hover:bg-[#F9F9F9] transition-all uppercase"
              >
                SAVE LBO MODEL SHEET
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* COMPLIANCE FOOTER DISCLAIMERS */}
      <footer className="bg-black border-t border-[#222] mt-auto">
        <div className="px-6 py-4 border-b border-[#222] grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66] rounded-none"></span>
            <span>MODEL COMPLIANT SEC. 7(a)</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#0EA5E9] rounded-none"></span>
            <span>UNDERWRITING FLOW STRESS ENGINE</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-white rounded-none"></span>
            <span>AMORTIZATION PRESETS SYNCED</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#FF3333] rounded-none"></span>
            <span>PROPRIETARY CRYPTO SIGNATURE</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 text-[10px] font-mono text-[#888] leading-relaxed space-y-3">
          <p>
            <span className="text-[#F9F9F9] font-bold">Underwriting Disclaimer:</span> Amortization modeling simulations, asset purchase mechanics, and cash flow forecasts computed on this terminal are for stress-testing and strategic scenario evaluations. Calculated outputs do not represent formal financial guarantees or firm underwriting commitments. Final approval requires exhaustive physical due-diligence and direct compliance verification.
          </p>
          <div className="flex justify-between items-center text-[9px] text-neutral-600 border-t border-[#111] pt-3">
            <span>&copy; {new Date().getFullYear()} ACQUIRE-NET TERMINAL, LLC. CORE RELEASES SECURED.</span>
            <span>SYSTEM STRUCTURAL METRICS PROCEEDING COMPLIANT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
```