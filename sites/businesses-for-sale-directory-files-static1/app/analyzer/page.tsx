"use client";

import React, { useState, useMemo } from "react";

export default function LboAnalyzerPage() {
  // --- CORE INPUT STATES ---
  const [purchasePrice, setPurchasePrice] = useState<number>(3500000);
  const [ebitda, setEbitda] = useState<number>(950000);
  
  // Sources of Capital (Percentages)
  const [sbaLoanPercent, setSbaLoanPercent] = useState<number>(75);
  const [sellerNotePercent, setSellerNotePercent] = useState<number>(15);
  const [mezzaninePercent, setMezzaninePercent] = useState<number>(0);
  
  // Debt Terms
  const [sbaInterestRate, setSbaInterestRate] = useState<number>(10.25);
  const [sbaTermYears, setSbaTermYears] = useState<number>(10);
  
  const [sellerInterestRate, setSellerInterestRate] = useState<number>(8.0);
  const [sellerTermYears, setSellerTermYears] = useState<number>(7);
  const [sellerInterestOnly, setSellerInterestOnly] = useState<boolean>(false);

  const [mezzInterestRate, setMezzInterestRate] = useState<number>(14.0);
  const [mezzTermYears, setMezzTermYears] = useState<number>(5);
  const [mezzInterestOnly, setMezzInterestOnly] = useState<boolean>(true);

  // Capital Expenditure & Working Capital reserves
  const [capexReserve, setCapexReserve] = useState<number>(50000);

  // --- CALCULATION ENGINE ---
  const calculations = useMemo(() => {
    // Valuation Multiple
    const multiple = purchasePrice / (ebitda || 1);

    // Capital Source Amounts
    const sbaLoanAmount = Math.min(purchasePrice * (sbaLoanPercent / 100), 5000000); // SBA 7(a) legal limit is $5M
    const sellerNoteAmount = purchasePrice * (sellerNotePercent / 100);
    const mezzanineAmount = purchasePrice * (mezzaninePercent / 100);
    
    // Remaining balance is Equity
    const equityRequired = Math.max(0, purchasePrice - sbaLoanAmount - sellerNoteAmount - mezzanineAmount);

    // 1. SBA Debt Service (Standard Monthly Amortization)
    const sbaMonthlyRate = (sbaInterestRate / 100) / 12;
    const sbaTotalMonths = sbaTermYears * 12;
    let sbaAnnualDebtService = 0;
    if (sbaLoanAmount > 0) {
      if (sbaMonthlyRate === 0) {
        sbaAnnualDebtService = sbaLoanAmount / sbaTermYears;
      } else {
        const monthlyPayment = sbaLoanAmount * (sbaMonthlyRate * Math.pow(1 + sbaMonthlyRate, sbaTotalMonths)) / (Math.pow(1 + sbaMonthlyRate, sbaTotalMonths) - 1);
        sbaAnnualDebtService = monthlyPayment * 12;
      }
    }

    // 2. Seller Note Debt Service
    let sellerAnnualDebtService = 0;
    if (sellerNoteAmount > 0) {
      if (sellerInterestOnly) {
        sellerAnnualDebtService = sellerNoteAmount * (sellerInterestRate / 100);
      } else {
        const sellerMonthlyRate = (sellerInterestRate / 100) / 12;
        const sellerTotalMonths = sellerTermYears * 12;
        if (sellerMonthlyRate === 0) {
          sellerAnnualDebtService = sellerNoteAmount / sellerTermYears;
        } else {
          const monthlyPayment = sellerNoteAmount * (sellerMonthlyRate * Math.pow(1 + sellerMonthlyRate, sellerTotalMonths)) / (Math.pow(1 + sellerMonthlyRate, sellerTotalMonths) - 1);
          sellerAnnualDebtService = monthlyPayment * 12;
        }
      }
    }

    // 3. Mezzanine Debt Service
    let mezzAnnualDebtService = 0;
    if (mezzanineAmount > 0) {
      if (mezzInterestOnly) {
        mezzAnnualDebtService = mezzanineAmount * (mezzInterestRate / 100);
      } else {
        const mezzMonthlyRate = (mezzInterestRate / 100) / 12;
        const mezzTotalMonths = mezzTermYears * 12;
        if (mezzMonthlyRate === 0) {
          mezzAnnualDebtService = mezzanineAmount / mezzTermYears;
        } else {
          const monthlyPayment = mezzanineAmount * (mezzMonthlyRate * Math.pow(1 + mezzMonthlyRate, mezzTotalMonths)) / (Math.pow(1 + mezzMonthlyRate, mezzTotalMonths) - 1);
          mezzAnnualDebtService = monthlyPayment * 12;
        }
      }
    }

    // Combined Metrics
    const totalDebtService = sbaAnnualDebtService + sellerAnnualDebtService + mezzAnnualDebtService;
    const postDebtCashFlow = Math.max(-ebitda, ebitda - totalDebtService - capexReserve);
    
    const dscr = totalDebtService > 0 ? ebitda / totalDebtService : 99.9;
    const sbaOnlyDscr = sbaAnnualDebtService > 0 ? ebitda / sbaAnnualDebtService : 99.9;

    const cashOnCash = equityRequired > 0 ? (postDebtCashFlow / equityRequired) * 100 : 0;

    // Warning Flags
    const sbaLimitExceeded = (purchasePrice * (sbaLoanPercent / 100)) > 5000000;

    return {
      multiple,
      sbaLoanAmount,
      sellerNoteAmount,
      mezzanineAmount,
      equityRequired,
      sbaAnnualDebtService,
      sellerAnnualDebtService,
      mezzAnnualDebtService,
      totalDebtService,
      postDebtCashFlow,
      dscr,
      sbaOnlyDscr,
      cashOnCash,
      sbaLimitExceeded
    };
  }, [
    purchasePrice,
    ebitda,
    sbaLoanPercent,
    sellerNotePercent,
    mezzaninePercent,
    sbaInterestRate,
    sbaTermYears,
    sellerInterestRate,
    sellerTermYears,
    sellerInterestOnly,
    mezzInterestRate,
    mezzTermYears,
    mezzInterestOnly,
    capexReserve
  ]);

  // Format Helper
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Sensitivity Matrix Calculations: EBITDA Variance (-20% to +20%) vs Exit Multiples (2.5x to 4.5x)
  const sensitivityEbitdaPoints = [-20, -10, 0, 10, 20];
  const sensitivityMultiplePoints = [2.5, 3.0, 3.5, 4.0, 4.5];

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono min-h-screen flex flex-col selection:bg-[#00FF66] selection:text-[#050505]">
      
      {/* 1. CRT GLOW SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

      {/* 2. TRANSACTION TICKER */}
      <header className="border-b border-[#222222] bg-[#050505] sticky top-0 z-40">
        <div className="overflow-hidden border-b border-[#222222] bg-[#0a0a0a] py-1 text-[10px] tracking-[0.2em] text-[#0EA5E9] uppercase">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="mx-4 text-[#00FF66]">[ACTIVE SANDBOX: LBO STRUCTURAL DEBT SIMULATOR]</span>
            <span className="mx-4">[SBA 7a MAXIMUM CAP LIMIT: $5,000,000]</span>
            <span className="mx-4 text-[#FF3333]">[ALERT: DSCR THRESHOLDS LOWER THAN 1.25x REJECTED BY SBA PREFERRED LENDERS]</span>
            <span className="mx-4">[YIELD FORECAST MATRIX ONLINE]</span>
            {/* Repeat for loop */}
            <span className="mx-4 text-[#00FF66]">[ACTIVE SANDBOX: LBO STRUCTURAL DEBT SIMULATOR]</span>
            <span className="mx-4">[SBA 7a MAXIMUM CAP LIMIT: $5,000,000]</span>
            <span className="mx-4 text-[#FF3333]">[ALERT: DSCR THRESHOLDS LOWER THAN 1.25x REJECTED BY SBA PREFERRED LENDERS]</span>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#00FF66] animate-pulse"></div>
              <span className="text-lg font-bold tracking-wider text-[#F9F9F9]">
                ACQUIRE<span className="text-[#00FF66]">META</span> // <span className="text-[#0EA5E9]">LBO_SANDBOX</span>
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 border border-[#222222] text-[#888888] bg-[#0c0c0c] uppercase">
              System Console v2.4a
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-[#888888] justify-center md:justify-end">
            <div>SIMULATOR CORE: <span className="text-[#00FF66] font-bold">STABLE_EXEC</span></div>
            <div className="border border-[#222222] px-2 py-1 bg-[#111111] text-[#F9F9F9] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] block animate-ping"></span>
              SANDBOX PIPELINE: ONLINE
            </div>
          </div>
        </div>
      </header>

      {/* MAIN ANALYSIS CONSOLE */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CRITICAL MODEL KNOBS & LEVERAGE CONTROLS (5 Cols) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 relative">
            <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-[#050505] px-2 text-[9px] text-[#00FF66]">
              [SECTION-01 // DEALS DEFAULTS]
            </div>
            <h2 className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider mb-4 text-[#0EA5E9]">
              // Primary Asset Valuation Matrix
            </h2>
            
            <div className="space-y-4">
              {/* Purchase Price Input */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888]">ENTERPRISE VALUE / ASKING:</span>
                  <span className="text-[#0EA5E9] font-bold">{formatUSD(purchasePrice)}</span>
                </div>
                <input 
                  type="range" 
                  min={500000} 
                  max={10000000} 
                  step={50000} 
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#111111] h-1"
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>$500K</span>
                  <span>$10M (Enterprise Core)</span>
                </div>
              </div>

              {/* EBITDA Input */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888]">ADJUSTED TTM EBITDA:</span>
                  <span className="text-[#00FF66] font-bold">{formatUSD(ebitda)}</span>
                </div>
                <input 
                  type="range" 
                  min={100000} 
                  max={2500000} 
                  step={25000} 
                  value={ebitda}
                  onChange={(e) => setEbitda(Number(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#111111] h-1"
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>$100K</span>
                  <span>$2.5M EBITDA Limit</span>
                </div>
              </div>

              {/* Implied Multiple readout */}
              <div className="bg-[#050505] border border-[#222222] p-3 flex justify-between items-center text-xs">
                <span className="text-[#888888]">IMPLIED ENTRY MULTIPLE:</span>
                <span className="text-[#0EA5E9] font-bold text-sm bg-[#111111] px-2 py-0.5 border border-[#222222]">
                  {calculations.multiple.toFixed(2)}x EBITDA
                </span>
              </div>
            </div>
          </div>

          {/* CAPITAL SOURCES DECK */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 relative">
            <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-[#050505] px-2 text-[9px] text-[#00FF66]">
              [SECTION-02 // CAPITAL STRUCTURE]
            </div>
            <h2 className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider mb-4 text-[#0EA5E9]">
              // Sources of Funding allocation (%)
            </h2>

            <div className="space-y-4">
              {/* SBA 7(a) slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888] flex items-center gap-1">
                    SBA 7(a) senior debt:
                    {calculations.sbaLimitExceeded && (
                      <span className="text-[#FF3333] text-[9px] animate-pulse">[SBA $5M CAP TRIGGERED]</span>
                    )}
                  </span>
                  <span className="text-[#00FF66] font-bold">{sbaLoanPercent}%</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={90} 
                  step={5} 
                  value={sbaLoanPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSbaLoanPercent(val);
                    if (val + sellerNotePercent + mezzaninePercent > 100) {
                      setSellerNotePercent(Math.max(0, 100 - val - mezzaninePercent));
                    }
                  }}
                  className="w-full accent-[#00FF66] bg-[#111111] h-1"
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>Proposed SBA: {formatUSD(calculations.sbaLoanAmount)}</span>
                  <span>Max 90%</span>
                </div>
              </div>

              {/* Seller Note slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888]">Seller Carryback note:</span>
                  <span className="text-[#00FF66] font-bold">{sellerNotePercent}%</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={50} 
                  step={5} 
                  value={sellerNotePercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSellerNotePercent(val);
                    if (sbaLoanPercent + val + mezzaninePercent > 100) {
                      setSbaLoanPercent(Math.max(0, 100 - val - mezzaninePercent));
                    }
                  }}
                  className="w-full accent-[#00FF66] bg-[#111111] h-1"
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>Proposed Seller Note: {formatUSD(calculations.sellerNoteAmount)}</span>
                  <span>Max 50%</span>
                </div>
              </div>

              {/* Mezzanine slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888]">Mezzanine / Subordinated debt:</span>
                  <span className="text-[#00FF66] font-bold">{mezzaninePercent}%</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={30} 
                  step={5} 
                  value={mezzaninePercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMezzaninePercent(val);
                    if (sbaLoanPercent + sellerNotePercent + val > 100) {
                      setSbaLoanPercent(Math.max(0, 100 - sellerNotePercent - val));
                    }
                  }}
                  className="w-full accent-[#00FF66] bg-[#111111] h-1"
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>Mezz Amount: {formatUSD(calculations.mezzanineAmount)}</span>
                  <span>Max 30%</span>
                </div>
              </div>

              {/* Dynamic Equity Required Field */}
              <div className="bg-[#111111] border border-[#222222] p-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#888888]">SPONSOR EQUITY REQUIRED (GAP):</span>
                  <span className="text-[#0EA5E9] font-bold text-sm">
                    {formatUSD(calculations.equityRequired)}
                  </span>
                </div>
                <div className="w-full bg-[#222222] h-1.5 mt-2 overflow-hidden flex">
                  <div className="h-full bg-[#00FF66]" style={{ width: `${sbaLoanPercent}%` }} title="SBA 7(a)"></div>
                  <div className="h-full bg-[#0EA5E9]" style={{ width: `${sellerNotePercent}%` }} title="Seller Note"></div>
                  <div className="h-full bg-[#FF3333]" style={{ width: `${mezzaninePercent}%` }} title="Mezzanine"></div>
                  <div className="h-full bg-[#F9F9F9]" style={{ width: `${100 - sbaLoanPercent - sellerNotePercent - mezzaninePercent}%` }} title="Required Equity"></div>
                </div>
                <div className="flex justify-between text-[8px] text-[#888888] mt-1">
                  <span>SBA: {sbaLoanPercent}%</span>
                  <span>Seller: {sellerNotePercent}%</span>
                  <span>Mezz: {mezzaninePercent}%</span>
                  <span>Sponsor Equity: {(100 - sbaLoanPercent - sellerNotePercent - mezzaninePercent).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* DEBT DETAILS DECK */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <h2 className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider text-[#0EA5E9]">
              // Debt Terms Configurations
            </h2>

            {/* SBA 7a Terms */}
            <div className="border border-[#222222] p-3 bg-[#050505] space-y-3">
              <span className="text-[10px] text-[#00FF66] font-bold block">// SBA 7(a) SPECIFIC TERMS</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-[#888888] block">SBA INTEREST RATE (%):</label>
                  <input 
                    type="number" 
                    step="0.25"
                    value={sbaInterestRate}
                    onChange={(e) => setSbaInterestRate(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#111111] border border-[#222222] text-[#F9F9F9] p-1 text-xs focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-[#888888] block">AMORTIZATION YEARS:</label>
                  <input 
                    type="number" 
                    value={sbaTermYears}
                    onChange={(e) => setSbaTermYears(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#111111] border border-[#222222] text-[#F9F9F9] p-1 text-xs focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
              </div>
            </div>

            {/* Seller Note Terms */}
            <div className="border border-[#222222] p-3 bg-[#050505] space-y-3">
              <span className="text-[10px] text-[#00FF66] font-bold block">// SELLER NOTE SPECIFIC TERMS</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-[#888888] block">SELLER INTEREST RATE (%):</label>
                  <input 
                    type="number" 
                    step="0.25"
                    value={sellerInterestRate}
                    onChange={(e) => setSellerInterestRate(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#111111] border border-[#222222] text-[#F9F9F9] p-1 text-xs focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-[#888888] block">AMORTIZATION YEARS:</label>
                  <input 
                    type="number" 
                    disabled={sellerInterestOnly}
                    value={sellerTermYears}
                    onChange={(e) => setSellerTermYears(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#111111] border border-[#222222] text-[#F9F9F9] p-1 text-xs focus:outline-none focus:border-[#00FF66] disabled:opacity-40"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="sellerInterestOnly" 
                  checked={sellerInterestOnly}
                  onChange={(e) => setSellerInterestOnly(e.target.checked)}
                  className="accent-[#00FF66] rounded-none cursor-pointer"
                />
                <label htmlFor="sellerInterestOnly" className="text-[10px] text-[#888888] cursor-pointer hover:text-[#00FF66] select-none">
                  Interest Only (No Principal Amortization)
                </label>
              </div>
            </div>

            {/* Capex Reserve Knob */}
            <div className="border border-[#222222] p-3 bg-[#050505]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] text-[#888888] block">ANNUAL CAPEX / WORKING CAPITAL RESERVE:</label>
                <span className="text-[#FF3333] text-xs font-bold">{formatUSD(capexReserve)}</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={200000} 
                step={10000} 
                value={capexReserve}
                onChange={(e) => setCapexReserve(Number(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#111111] h-1"
              />
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: REAL-TIME GAUGES, OUTPUTS, & SENSITIVITY GRID (7 Cols) */}
        <section className="lg:col-span-7 space-y-6">
          
          {/* CRITICAL DEBT SERVICE RATIO DYNAMIC METRIC PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border border-[#222222] bg-[#0a0a0a] p-6 relative">
            <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-[#050505] px-2 text-[9px] text-[#FF3333]">
              [OUTPUT METRIC CORE]
            </div>

            {/* Radial DSCR Needle Visual Simulator */}
            <div className="md:col-span-4 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-[#222222] pb-6 md:pb-0 md:pr-6">
              <span className="text-[10px] text-[#888888] tracking-widest uppercase text-center mb-3">
                DEBT SERVICE COVERAGE (DSCR)
              </span>
              
              <div className="relative flex items-center justify-center w-28 h-28 border-4 border-dashed rounded-full border-[#222222]">
                <div className="absolute inset-2 rounded-full border border-double border-[#222222] flex flex-col justify-center items-center bg-[#050505]">
                  <span className={`text-2xl font-bold tracking-tight ${
                    calculations.dscr >= 1.5 ? 'text-[#00FF66]' : calculations.dscr >= 1.25 ? 'text-[#0EA5E9]' : 'text-[#FF3333]'
                  }`}>
                    {calculations.dscr.toFixed(2)}x
                  </span>
                  <span className={`text-[8px] font-bold tracking-widest ${
                    calculations.dscr >= 1.5 ? 'text-[#00FF66]' : calculations.dscr >= 1.25 ? 'text-[#0EA5E9]' : 'text-[#FF3333]'
                  }`}>
                    {calculations.dscr >= 1.5 ? 'EXCELLENT' : calculations.dscr >= 1.25 ? 'STABLE' : 'HIGH_RISK'}
                  </span>
                </div>
              </div>

              <div className="text-[9px] text-center text-[#888888] mt-3 uppercase leading-normal max-w-[160px]">
                Target 1.25x limit for SBA preferred compliance underwriting.
              </div>
            </div>

            {/* Key Output Analytics Metrics Stack */}
            <div className="md:col-span-8 space-y-4">
              <h3 className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider text-[#0EA5E9]">// Live Debt Outflows Simulation</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111111] border border-[#222222] p-3">
                  <span className="text-[9px] text-[#888888] block">SPONSOR EQUITY INVESTED:</span>
                  <span className="text-lg font-bold text-[#F9F9F9]" style={{ textShadow: "0 0 10px rgba(249,249,249,0.2)" }}>
                    {formatUSD(calculations.equityRequired)}
                  </span>
                </div>

                <div className="bg-[#111111] border border-[#222222] p-3">
                  <span className="text-[9px] text-[#888888] block">CASH-ON-CASH RETURN (YR 1):</span>
                  <span className={`text-lg font-bold ${calculations.cashOnCash >= 25 ? 'text-[#00FF66]' : calculations.cashOnCash >= 15 ? 'text-[#0EA5E9]' : 'text-[#FF3333]'}`}>
                    {calculations.cashOnCash.toFixed(2)}%
                  </span>
                </div>

                <div className="bg-[#111111] border border-[#222222] p-3">
                  <span className="text-[9px] text-[#888888] block">TOTAL ANNUAL DEBT SERVICE:</span>
                  <span className="text-lg font-bold text-[#FF3333]">
                    {formatUSD(calculations.totalDebtService)}
                  </span>
                </div>

                <div className="bg-[#111111] border border-[#222222] p-3">
                  <span className="text-[9px] text-[#888888] block">POST-DEBT CASH FLOW (DISPOSABLE):</span>
                  <span className={`text-lg font-bold ${calculations.postDebtCashFlow > 100000 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                    {formatUSD(calculations.postDebtCashFlow)}
                  </span>
                </div>
              </div>

              {/* Cash Flow Health Status Log Bar */}
              <div className={`p-2 text-[10px] border flex justify-between items-center ${
                calculations.dscr >= 1.25 ? 'border-[#00FF66] bg-[#00FF66]/5 text-[#00FF66]' : 'border-[#FF3333] bg-[#FF3333]/5 text-[#FF3333]'
              }`}>
                <span>SYSTEM HEALTH STATE:</span>
                <span className="font-bold">
                  {calculations.dscr >= 1.25 ? '✓ APPROVED FOR STRUCTURAL DEBT FUNDING' : '⚠️ CRITICAL RED FLAG: DSCR INSUFFICIENT FOR COMPLIANT SENIOR UNDERWRITING'}
                </span>
              </div>
            </div>
          </div>

          {/* DYNAMIC SENSITIVITY GRID MATRIX (Cash-on-Cash Return Based on EBITDA Variation vs Purchase Price Multiple) */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-6 relative">
            <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-[#050505] px-2 text-[9px] text-[#0EA5E9]">
              [MATRIX-GRID 04 // SENSITIVITY ESTIMATE]
            </div>
            
            <div className="mb-4">
              <h3 className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider text-[#0EA5E9]">
                // Cash-on-Cash Return Yield Sensitivity Matrix
              </h3>
              <p className="text-[10px] text-[#888888] mt-1">
                Visualizing potential Year 1 Yield fluctuations across business EBITDA growth volatility (Horizontal) and variations of Implied Multiple (Vertical).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border border-[#222222] border-collapse">
                <thead>
                  <tr className="bg-[#111111] border-b border-[#222222]">
                    <th className="p-2 border-r border-[#222222] text-[#888888] text-[9px]">
                      MULTIPLE VARIANCE
                    </th>
                    {sensitivityEbitdaPoints.map((pct) => (
                      <th key={pct} className="p-2 text-center text-[#888888] text-[9px] border-r border-[#222222]">
                        EBITDA {pct > 0 ? `+${pct}` : pct}%
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensitivityMultiplePoints.map((mult) => {
                    return (
                      <tr key={mult} className="border-b border-[#222222] hover:bg-[#111111]/30">
                        {/* Implied Multiple Row Label */}
                        <td className="p-2 font-bold border-r border-[#222222] text-[#0EA5E9]">
                          {mult.toFixed(1)}x Multiple
                        </td>

                        {/* Calculated Sensitivity Points */}
                        {sensitivityEbitdaPoints.map((pct) => {
                          const targetEbitda = ebitda * (1 + pct / 100);
                          const targetPurchasePrice = targetEbitda * mult;

                          // Source allocations mimicking standard percentages
                          const calculatedSba = Math.min(targetPurchasePrice * (sbaLoanPercent / 100), 5000000);
                          const calculatedSeller = targetPurchasePrice * (sellerNotePercent / 100);
                          const calculatedMezz = targetPurchasePrice * (mezzaninePercent / 100);
                          const calculatedEquity = Math.max(1, targetPurchasePrice - calculatedSba - calculatedSeller - calculatedMezz);

                          // Estimated debt service
                          const sbaDebt = calculations.sbaAnnualDebtService * (calculatedSba / (calculations.sbaLoanAmount || 1));
                          const sellerDebt = calculations.sellerAnnualDebtService * (calculatedSeller / (calculations.sellerNoteAmount || 1));
                          const mezzDebt = calculations.mezzAnnualDebtService * (calculatedMezz / (calculations.mezzanineAmount || 1));
                          
                          const targetDebtService = sbaDebt + sellerDebt + mezzDebt;
                          const targetCashFlow = targetEbitda - targetDebtService - capexReserve;
                          const coc = (targetCashFlow / calculatedEquity) * 100;

                          let textClass = "text-[#888888]";
                          let bgClass = "bg-[#050505]";
                          if (coc >= 30) {
                            textClass = "text-[#00FF66] font-bold";
                            bgClass = "bg-[#00FF66]/5";
                          } else if (coc >= 15) {
                            textClass = "text-[#0EA5E9]";
                            bgClass = "bg-[#0EA5E9]/5";
                          } else if (coc <= 0) {
                            textClass = "text-[#FF3333] font-bold";
                            bgClass = "bg-[#FF3333]/10";
                          }

                          return (
                            <td key={pct} className={`p-2 text-center border-r border-[#222222] ${bgClass} ${textClass}`}>
                              {coc > 999 ? "999%+" : coc < -99 ? "LOST" : `${coc.toFixed(1)}%`}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Color coding index key */}
            <div className="flex justify-between items-center mt-3 text-[9px] text-[#888888] border-t border-[#222222] pt-3">
              <span>COLOR MATRIX KEY:</span>
              <div className="flex space-x-4">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#FF3333]/10 border border-[#FF3333] block"></span> Neg Yield
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#888888]/10 border border-[#888888] block"></span> 0% - 15% Standard
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#0EA5E9]/10 border border-[#0EA5E9] block"></span> 15% - 30% Healthy
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#00FF66]/10 border border-[#00FF66] block"></span> 30%+ Ultra Premium
                </span>
              </div>
            </div>
          </div>

          {/* DETAILED AMORTIZATION SCHEDULE PREVIEW */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 text-xs space-y-3">
            <h3 className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider text-[#0EA5E9]">
              // Structural Financing Amortization Dossier
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-[#888888]">
              <div className="bg-[#050505] p-3 border border-[#222222] space-y-1">
                <span className="text-[#00FF66] font-bold block">SBA 7a DEBT PILE</span>
                <div>Amount: <span className="text-[#F9F9F9]">{formatUSD(calculations.sbaLoanAmount)}</span></div>
                <div>Int Rate: <span className="text-[#F9F9F9]">{sbaInterestRate}%</span></div>
                <div>Ann. Debt Service: <span className="text-[#FF3333]">{formatUSD(calculations.sbaAnnualDebtService)}</span></div>
              </div>

              <div className="bg-[#050505] p-3 border border-[#222222] space-y-1">
                <span className="text-[#00FF66] font-bold block">SELLER PILE</span>
                <div>Amount: <span className="text-[#F9F9F9]">{formatUSD(calculations.sellerNoteAmount)}</span></div>
                <div>Int Rate: <span className="text-[#F9F9F9]">{sellerInterestRate}%</span></div>
                <div>Ann. Debt Service: <span className="text-[#FF3333]">{formatUSD(calculations.sellerAnnualDebtService)}</span></div>
              </div>

              <div className="bg-[#050505] p-3 border border-[#222222] space-y-1">
                <span className="text-[#00FF66] font-bold block">MEZZANINE PILE</span>
                <div>Amount: <span className="text-[#F9F9F9]">{formatUSD(calculations.mezzanineAmount)}</span></div>
                <div>Int Rate: <span className="text-[#F9F9F9]">{mezzInterestRate}%</span></div>
                <div>Ann. Debt Service: <span className="text-[#FF3333]">{formatUSD(calculations.mezzAnnualDebtService)}</span></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-3 border-t border-[#222222]">
              <div className="text-[10px] text-[#888888] leading-tight">
                * Simulated output matrices assume strict compounding cycles and structural static multiples. Consult professional legal underwriting services for final asset purchase models.
              </div>
              <button 
                onClick={() => alert("Acquisition Deal Structure compiled! Configuration metrics exported successfully to system cache.")}
                className="w-full sm:w-auto text-xs text-[#050505] bg-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] hover:shadow-[4px_4px_0px_0px_rgba(0,255,102,1)] font-bold px-6 py-3 transition-all duration-200 uppercase tracking-widest text-center shrink-0"
              >
                Compile LBO Struct
              </button>
            </div>
          </div>

        </section>
      </main>

      {/* FOOTER & TRUST SIGNALS */}
      <footer className="border-t border-[#222222] bg-[#030303] mt-12 py-8 px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-[#222222]">
            <div className="text-xs tracking-[0.2em] text-[#888888] uppercase font-mono">
              SECURE ACQUISITION NETWORKS // SIM CORE
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8 items-center text-[10px] text-[#888888]">
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <svg className="w-4 h-4 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>SBA COMPLIANT METRIC CORE</span>
              </div>
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <svg className="w-4 h-4 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>DATA CALCULATIONS LOCKED</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#888888] leading-relaxed max-w-7xl space-y-3 font-mono">
            <p className="uppercase tracking-wider text-[#F9F9F9]">// LBO SANDBOX & SYSTEM DISCLAIMER</p>
            <p>
              Disclaimer: All calculations, structural variables, equity modeling ratios, and interest assumptions modeled in this system do not constitute certified lending commitments, nor do they represent financial underwriting values from actual banking organizations. Under no circumstances should these models be leveraged as final real-world security proposals.
            </p>
            <p>
              LBO simulations are built for educational purposes and initial operational sandbox analysis of business leverage configurations under SBA standard conditions. Searchers and micro-private equity sponsors assume all risk of financial modeling variations during live market transactions.
            </p>
            <div class="flex justify-between items-center text-[9px] text-[#888888] pt-4">
              <span>© 2026 ACQUIRE_META GLOBAL LTD. DEBT SIMULATOR SUBSYSTEM.</span>
              <span>NODE: DEBT-ANALYZER-491A</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}