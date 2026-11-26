```tsx
import React, { useState, useMemo } from 'react';

interface Preset {
  name: string;
  industry: string;
  price: number;
  ebitda: number;
  revenue: number;
  defaultEquity: number;
  defaultSellerNote: number;
  defaultRate: number;
}

const PRESETS: Record<string, Preset> = {
  delta: {
    name: "Project Delta",
    industry: "B2B Logistics Agency",
    price: 1800000,
    ebitda: 620000,
    revenue: 2400000,
    defaultEquity: 10,
    defaultSellerNote: 15,
    defaultRate: 11.25,
  },
  kestrel: {
    name: "Project Kestrel",
    industry: "Cloud SaaS",
    price: 1900000,
    ebitda: 450000,
    revenue: 1200000,
    defaultEquity: 20,
    defaultSellerNote: 10,
    defaultRate: 11.5,
  },
  nova: {
    name: "Project Nova",
    industry: "Regional HVAC",
    price: 2600000,
    ebitda: 810000,
    revenue: 3100000,
    defaultEquity: 10,
    defaultSellerNote: 20,
    defaultRate: 11.0,
  },
  onyx: {
    name: "Project Onyx",
    industry: "Precision Manufacturing",
    price: 3800000,
    ebitda: 1200000,
    revenue: 5800000,
    defaultEquity: 15,
    defaultSellerNote: 15,
    defaultRate: 10.75,
  }
};

export default function DscrGauge() {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("delta");
  
  // Custom Inputs overrides
  const preset = PRESETS[selectedPresetKey];
  const [price, setPrice] = useState<number>(preset.price);
  const [ebitda, setEbitda] = useState<number>(preset.ebitda);
  const [revenue, setRevenue] = useState<number>(preset.revenue);
  const [equityPct, setEquityPct] = useState<number>(preset.defaultEquity);
  const [sellerPct, setSellerPct] = useState<number>(preset.defaultSellerNote);
  const [interestRate, setInterestRate] = useState<number>(preset.defaultRate);
  const [amortization, setAmortization] = useState<number>(10); // Standard SBA 10-year maturity
  
  // Stress test states
  const [revenueDrop, setRevenueDrop] = useState<number>(0); // % revenue drop to simulate

  // Handle Preset Changes
  const handlePresetChange = (key: string) => {
    setSelectedPresetKey(key);
    const p = PRESETS[key];
    setPrice(p.price);
    setEbitda(p.ebitda);
    setRevenue(p.revenue);
    setEquityPct(p.defaultEquity);
    setSellerPct(p.defaultSellerNote);
    setInterestRate(p.defaultRate);
    setRevenueDrop(0);
  };

  // Safe Math Calculations
  const calculatedEbitda = useMemo(() => {
    if (revenueDrop === 0) return ebitda;
    // Calculate simulated drop: Assuming EBITDA margins drop proportionally with operating leverage
    // For simplicity, we drop EBITDA by the revenue drop % plus an operating leverage factor of 1.2x
    const droppedEbitda = ebitda * (1 - (revenueDrop / 100) * 1.2);
    return Math.max(0, droppedEbitda);
  }, [ebitda, revenueDrop]);

  const debtPct = useMemo(() => {
    const total = 100 - equityPct - sellerPct;
    return Math.max(0, total);
  }, [equityPct, sellerPct]);

  const debtAmount = useMemo(() => {
    return price * (debtPct / 100);
  }, [price, debtPct]);

  const equityAmount = useMemo(() => {
    return price * (equityPct / 100);
  }, [price, equityPct]);

  const sellerNoteAmount = useMemo(() => {
    return price * (sellerPct / 100);
  }, [price, sellerPct]);

  const annualDebtService = useMemo(() => {
    if (debtAmount <= 0) return 0;
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = amortization * 12;
    const monthlyPayment = debtAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return monthlyPayment * 12;
  }, [debtAmount, interestRate, amortization]);

  const postDebtCashFlow = useMemo(() => {
    return calculatedEbitda - annualDebtService;
  }, [calculatedEbitda, annualDebtService]);

  const dscr = useMemo(() => {
    if (annualDebtService <= 0) return 0;
    return calculatedEbitda / annualDebtService;
  }, [calculatedEbitda, annualDebtService]);

  const cashOnCash = useMemo(() => {
    if (equityAmount <= 0) return 0;
    return (postDebtCashFlow / equityAmount) * 100;
  }, [postDebtCashFlow, equityAmount]);

  // Visual formatting
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Color alerts based on DSCR guidelines
  const getDscrColor = (value: number) => {
    if (value < 1.15) return { text: 'text-[#FF3333]', border: 'border-[#FF3333]', bg: 'bg-[#FF3333]', raw: '#FF3333' };
    if (value < 1.4) return { text: 'text-[#0EA5E9]', border: 'border-[#0EA5E9]', bg: 'bg-[#0EA5E9]', raw: '#0EA5E9' };
    return { text: 'text-[#00FF66]', border: 'border-[#00FF66]', bg: 'bg-[#00FF66]', raw: '#00FF66' };
  };

  const dscrStyle = getDscrColor(dscr);

  return (
    <div className="w-full bg-[#090909] border border-[#222222] p-6 font-sans text-[#F9F9F9]">
      
      {/* Header Panel */}
      <div className="border-b border-[#222222] pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
            <span className="font-mono text-xs uppercase text-[#888888] tracking-widest">LBO SIMULATION TERMINAL // ENGINE V4.2</span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight mt-1 text-white">
            DEAL CAPITAL &amp; DSCR ANALYZER
          </h2>
        </div>
        
        {/* Preset Selector */}
        <div className="flex flex-wrap gap-1 bg-black p-1 border border-[#1a1a1a]">
          {Object.keys(PRESETS).map((key) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-all rounded-none ${
                selectedPresetKey === key
                  ? 'bg-[#00FF66] text-black font-extrabold'
                  : 'text-[#888] hover:text-white hover:bg-neutral-900'
              }`}
            >
              {PRESETS[key].name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Controls & Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Target Parameters Overrides */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/60 p-4 border border-[#161616]">
            <div>
              <label className="block font-mono text-[9px] text-[#555] uppercase tracking-wider mb-1">Valuation / Ask</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full h-9 bg-black border border-[#222] px-3 font-mono text-xs text-[#0EA5E9] focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-[#555] uppercase tracking-wider mb-1">Target Base EBITDA</label>
              <input
                type="number"
                value={ebitda}
                onChange={(e) => setEbitda(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full h-9 bg-black border border-[#222] px-3 font-mono text-xs text-[#00FF66] focus:outline-none focus:border-[#00FF66]"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-[#555] uppercase tracking-wider mb-1">Total Rev (FY25)</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full h-9 bg-black border border-[#222] px-3 font-mono text-xs text-white focus:outline-none focus:border-[#222]"
              />
            </div>
          </div>

          {/* Sliders Container */}
          <div className="space-y-4 bg-black/40 p-4 border border-[#1a1a1a] rounded-none">
            <h3 className="font-mono text-[10px] text-[#888] uppercase tracking-widest border-b border-[#222] pb-2 mb-4">
              CAPITAL STACK DISTRIBUTION &amp; DEBT TERMS
            </h3>

            {/* Buyer Equity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#888]">Buyer Equity Injection</span>
                <span className="text-white font-semibold">{equityPct}% ({formatCurrency(equityAmount)})</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={equityPct}
                onChange={(e) => setEquityPct(parseInt(e.target.value))}
                className="w-full h-1 bg-neutral-800 accent-[#0EA5E9] cursor-pointer appearance-none rounded-none"
              />
              <div className="flex justify-between text-[8px] font-mono text-[#444]">
                <span>10% (SBA Min)</span>
                <span>25%</span>
                <span>40%</span>
              </div>
            </div>

            {/* Seller Standby Note */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#888]">Seller Standby Note</span>
                <span className="text-white font-semibold">{sellerPct}% ({formatCurrency(sellerNoteAmount)})</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={sellerPct}
                onChange={(e) => setSellerPct(parseInt(e.target.value))}
                className="w-full h-1 bg-neutral-800 accent-[#0EA5E9] cursor-pointer appearance-none rounded-none"
              />
              <div className="flex justify-between text-[8px] font-mono text-[#444]">
                <span>0% (No Note)</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-1.5 pt-2 border-t border-[#161616]">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#888]">SBA 7(a) Interest Rate</span>
                <span className="text-white font-semibold">{interestRate.toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="8.5"
                max="14.0"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-neutral-800 accent-[#00FF66] cursor-pointer appearance-none rounded-none"
              />
              <div className="flex justify-between text-[8px] font-mono text-[#444]">
                <span>8.5% Base</span>
                <span>11.25% (Prime + 2.75%)</span>
                <span>14.0% Max</span>
              </div>
            </div>

            {/* Amortization Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-[#161616] text-xs font-mono">
              <span className="text-[#888]">Debt Amortization Period</span>
              <div className="flex space-x-1">
                {[7, 10, 15].map((years) => (
                  <button
                    key={years}
                    onClick={() => setAmortization(years)}
                    className={`px-3 py-1 border text-[10px] ${
                      amortization === years
                        ? 'border-[#0ea5e9] text-[#0ea5e9] bg-[#0ea5e9]/5'
                        : 'border-[#222] text-[#666] hover:text-white'
                    }`}
                  >
                    {years} Years
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stress Test Tool */}
          <div className="bg-[#FF3333]/5 border border-[#FF3333]/20 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-[#FF3333] tracking-widest uppercase flex items-center space-x-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-[#FF3333]"></span>
                <span>CRITICAL STRESS TESTING</span>
              </span>
              <span className="font-mono text-xs text-[#FF3333] font-bold">-{revenueDrop}% Revenue Drop</span>
            </div>
            <p className="text-[11px] text-[#888] font-mono leading-relaxed">
              Simulate operational leverage shocks. Standard SBA underwriting targets 1.15x DSCR limits.
            </p>
            <div className="flex gap-2">
              {[0, 10, 20, 30].map((drop) => (
                <button
                  key={drop}
                  onClick={() => setRevenueDrop(drop)}
                  className={`flex-1 h-8 font-mono text-[10px] border transition-all ${
                    revenueDrop === drop
                      ? 'bg-[#FF3333] text-black border-[#FF3333] font-bold'
                      : 'border-[#222222] text-[#888] hover:text-[#FF3333] hover:border-[#FF3333]/40'
                  }`}
                >
                  {drop === 0 ? 'NO DROP' : `-${drop}% DROP`}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Output Gauge, Core Stats & SBA Safe Rules (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* DSCR Gauge Display Block */}
          <div className="bg-black border border-[#222222] p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
            
            {/* Scanline Grid Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }} />

            <span className="font-mono text-[9px] text-[#666] uppercase tracking-widest mb-2 block">
              Calculated Debt Service Coverage Ratio
            </span>

            {/* Glowing Big Number Display */}
            <div className="relative inline-block my-2">
              <span className={`text-4xl md:text-5xl font-mono font-black tracking-tight ${dscrStyle.text}`}>
                {dscr > 0 ? dscr.toFixed(2) : '0.00'}x
              </span>
              <div className="text-[9px] font-mono text-[#888] tracking-widest uppercase mt-1">
                SBA Limit: 1.15x
              </div>
            </div>

            {/* Segmented LED Bar Indicator */}
            <div className="w-full flex space-x-1.5 px-4 my-4">
              {Array.from({ length: 10 }).map((_, idx) => {
                const threshold = 0.5 + idx * 0.25; // Steps: 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0...
                const isActive = dscr >= threshold;
                const segColors = getDscrColor(threshold);
                
                return (
                  <div
                    key={idx}
                    className="flex-1 h-3 transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? segColors.raw : '#111111',
                      boxShadow: isActive ? `0 0 8px ${segColors.raw}33` : 'none',
                      border: `1px solid ${isActive ? segColors.raw : '#222'}`
                    }}
                    title={`DSCR threshold: ${threshold.toFixed(2)}x`}
                  />
                );
              })}
            </div>

            {/* Warning Message Box based on active limits */}
            <div className="w-full border-t border-[#161616] pt-3 mt-1 flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#555]">CAPACITY STATUS:</span>
              {dscr < 1.15 ? (
                <span className="text-[#FF3333] font-bold blink">CRITICAL UNDER COLLATERAL</span>
              ) : dscr < 1.4 ? (
                <span className="text-[#0EA5E9] font-bold">WARNING: THIN MARGIN</span>
              ) : (
                <span className="text-[#00FF66] font-bold">SBA COMPLIANT PASS</span>
              )}
            </div>
          </div>

          {/* Detailed Calculations Bento Stack */}
          <div className="bg-black/80 border border-[#222222] p-4 space-y-3.5">
            <h4 className="font-mono text-[10px] text-[#888] uppercase tracking-widest border-b border-[#222] pb-2">
              SIMULATED TRANSACTION METRICS
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-950 p-3 border border-[#161616]">
                <span className="block font-mono text-[8px] text-[#555] uppercase">Total Senior Debt ({Math.round(debtPct)}%)</span>
                <span className="text-sm font-semibold font-mono text-white">{formatCurrency(debtAmount)}</span>
              </div>
              <div className="bg-neutral-950 p-3 border border-[#161616]">
                <span className="block font-mono text-[8px] text-[#555] uppercase">Amortized Ann. Debt</span>
                <span className="text-sm font-semibold font-mono text-[#FF3333]">{formatCurrency(annualDebtService)}</span>
              </div>
              <div className="bg-neutral-950 p-3 border border-[#161616]">
                <span className="block font-mono text-[8px] text-[#555] uppercase">Post-Debt Free Cash</span>
                <span className="text-sm font-semibold font-mono text-[#00FF66]">{formatCurrency(postDebtCashFlow)}</span>
              </div>
              <div className="bg-neutral-950 p-3 border border-[#161616]">
                <span className="block font-mono text-[8px] text-[#555] uppercase">Cash-on-Cash Return</span>
                <span className={`text-sm font-semibold font-mono ${cashOnCash > 0 ? 'text-[#0EA5E9]' : 'text-[#FF3333]'}`}>
                  {cashOnCash.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* SBA Underwriting Guardrails */}
          <div className="bg-[#0c0c0c] border border-[#222222] p-4 space-y-2">
            <h5 className="font-mono text-[9px] text-[#888] uppercase tracking-wider">
              SBA 7(a) COMPLIANCE SAFEGUARDS
            </h5>
            <ul className="text-[10px] text-[#555] font-mono space-y-1.5">
              <li className="flex items-center space-x-2">
                <span className={`inline-block w-1 h-1 rounded-full ${equityPct >= 10 ? 'bg-[#00FF66]' : 'bg-[#FF3333]'}`} />
                <span>Min. 10% Cash Equity Requirement: {equityPct >= 10 ? 'MET' : 'FAILED'}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`inline-block w-1 h-1 rounded-full ${dscr >= 1.15 ? 'bg-[#00FF66]' : 'bg-[#FF3333]'}`} />
                <span>Standard Underwriting limit (1.15x DSCR): {dscr >= 1.15 ? 'MET' : 'FAILED'}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="inline-block w-1 h-1 rounded-full bg-[#0EA5E9]" />
                <span>Prevailing Variable SBA rate ceiling: 11.25% - 11.5%</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
```