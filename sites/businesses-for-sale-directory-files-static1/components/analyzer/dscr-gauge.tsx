import React, { useState, useMemo } from 'react';

export default function DscrGauge() {
  // Preset Templates
  const PRESETS = {
    standardSba: {
      label: 'STANDARD SBA 7(A) LEVERAGE',
      askingPrice: 3200000,
      ebitda: 950000,
      sbaPercent: 75,
      sbaRate: 10.25,
      sbaTerm: 10,
      sellerPercent: 15,
      sellerRate: 8.0,
      sellerTerm: 5,
      mezzPercent: 0,
      mezzRate: 14.0,
      mezzTerm: 5,
    },
    equityHeavy: {
      label: 'EQUITY-SAFE / CONSERVATIVE',
      askingPrice: 3200000,
      ebitda: 950000,
      sbaPercent: 50,
      sbaRate: 9.75,
      sbaTerm: 10,
      sellerPercent: 10,
      sellerRate: 6.5,
      sellerTerm: 7,
      mezzPercent: 0,
      mezzRate: 12.0,
      mezzTerm: 5,
    },
    aggressiveLbo: {
      label: 'HIGH-LEVERAGE MEZZANINE STACK',
      askingPrice: 3200000,
      ebitda: 950000,
      sbaPercent: 75,
      sbaRate: 10.75,
      sbaTerm: 10,
      sellerPercent: 15,
      sellerRate: 9.0,
      sellerTerm: 5,
      mezzPercent: 5,
      mezzRate: 16.0,
      mezzTerm: 5,
    }
  };

  // State Parameters
  const [askingPrice, setAskingPrice] = useState(PRESETS.standardSba.askingPrice);
  const [ebitda, setEbitda] = useState(PRESETS.standardSba.ebitda);
  
  const [sbaPercent, setSbaPercent] = useState(PRESETS.standardSba.sbaPercent);
  const [sbaRate, setSbaRate] = useState(PRESETS.standardSba.sbaRate);
  const [sbaTerm, setSbaTerm] = useState(PRESETS.standardSba.sbaTerm);

  const [sellerPercent, setSellerPercent] = useState(PRESETS.standardSba.sellerPercent);
  const [sellerRate, setSellerRate] = useState(PRESETS.standardSba.sellerRate);
  const [sellerTerm, setSellerTerm] = useState(PRESETS.standardSba.sellerTerm);

  const [mezzPercent, setMezzPercent] = useState(PRESETS.standardSba.mezzPercent);
  const [mezzRate, setMezzRate] = useState(PRESETS.standardSba.mezzRate);
  const [mezzTerm, setMezzTerm] = useState(PRESETS.standardSba.mezzTerm);

  // Apply Preset
  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    const p = PRESETS[presetKey];
    setAskingPrice(p.askingPrice);
    setEbitda(p.ebitda);
    setSbaPercent(p.sbaPercent);
    setSbaRate(p.sbaRate);
    setSbaTerm(p.sbaTerm);
    setSellerPercent(p.sellerPercent);
    setSellerRate(p.sellerRate);
    setSellerTerm(p.sellerTerm);
    setMezzPercent(p.mezzPercent);
    setMezzRate(p.mezzRate);
    setMezzTerm(p.mezzTerm);
  };

  // Calculations
  const calculations = useMemo(() => {
    const sbaLoanAmount = (askingPrice * sbaPercent) / 100;
    const sellerLoanAmount = (askingPrice * sellerPercent) / 100;
    const mezzLoanAmount = (askingPrice * mezzPercent) / 100;
    
    // Remaining balance is Equity Requirement
    const totalDebtPercent = sbaPercent + sellerPercent + mezzPercent;
    const equityPercent = Math.max(0, 100 - totalDebtPercent);
    const equityRequired = (askingPrice * equityPercent) / 100;

    // Amortization function
    const calcAnnualDebtService = (principal: number, annualRate: number, termYears: number) => {
      if (principal <= 0 || termYears <= 0) return 0;
      const r = (annualRate / 100) / 12;
      const n = termYears * 12;
      if (r === 0) return principal / termYears;
      const monthlyPayment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return Math.round(monthlyPayment * 12);
    };

    const sbaDebtService = calcAnnualDebtService(sbaLoanAmount, sbaRate, sbaTerm);
    const sellerDebtService = calcAnnualDebtService(sellerLoanAmount, sellerRate, sellerTerm);
    const mezzDebtService = calcAnnualDebtService(mezzLoanAmount, mezzRate, mezzTerm);

    const totalDebtService = sbaDebtService + sellerDebtService + mezzDebtService;
    const dscr = totalDebtService > 0 ? ebitda / totalDebtService : 99.9;
    const postDebtCashFlow = ebitda - totalDebtService;
    const cashOnCash = equityRequired > 0 ? (postDebtCashFlow / equityRequired) * 100 : 0;

    return {
      sbaLoanAmount,
      sellerLoanAmount,
      mezzLoanAmount,
      equityPercent,
      equityRequired,
      sbaDebtService,
      sellerDebtService,
      mezzDebtService,
      totalDebtService,
      dscr,
      postDebtCashFlow,
      cashOnCash
    };
  }, [askingPrice, ebitda, sbaPercent, sbaRate, sbaTerm, sellerPercent, sellerRate, sellerTerm, mezzPercent, mezzRate, mezzTerm]);

  // Sensitivity Matrix Calculations (DSCR & Cash-on-Cash based on EBITDA shift & Interest shifts)
  const sensitivityData = useMemo(() => {
    const ebitdaShifts = [-20, -10, 0, 10, 20]; // Percent changes
    const rateShifts = [-2, -1, 0, 1, 2]; // Absolute percentage shifts

    return ebitdaShifts.map(ebitdaShift => {
      const adjustedEbitda = ebitda * (1 + ebitdaShift / 100);
      
      const rowData = rateShifts.map(rateShift => {
        // Recalculate debt service with shifted rates
        const adjSbaRate = Math.max(0.5, sbaRate + rateShift);
        const adjSellerRate = Math.max(0.5, sellerRate + rateShift);
        const adjMezzRate = Math.max(0.5, mezzRate + rateShift);

        const sbaAmt = (askingPrice * sbaPercent) / 100;
        const sellerAmt = (askingPrice * sellerPercent) / 100;
        const mezzAmt = (askingPrice * mezzPercent) / 100;

        const calcAnnualDebtService = (principal: number, annualRate: number, termYears: number) => {
          if (principal <= 0 || termYears <= 0) return 0;
          const r = (annualRate / 100) / 12;
          const n = termYears * 12;
          const monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          return Math.round(monthly * 12);
        };

        const totalDebtSvc = 
          calcAnnualDebtService(sbaAmt, adjSbaRate, sbaTerm) +
          calcAnnualDebtService(sellerAmt, adjSellerRate, sellerTerm) +
          calcAnnualDebtService(mezzAmt, adjMezzRate, mezzTerm);

        const localDscr = totalDebtSvc > 0 ? adjustedEbitda / totalDebtSvc : 99.9;
        const localCashFlow = adjustedEbitda - totalDebtSvc;
        const equity = askingPrice * (100 - (sbaPercent + sellerPercent + mezzPercent)) / 100;
        const localCoC = equity > 0 ? (localCashFlow / equity) * 100 : 0;

        return {
          dscr: localDscr,
          coc: localCoC,
          ebitdaShift,
          rateShift
        };
      });
      return { ebitdaShift, rowData };
    });
  }, [askingPrice, ebitda, sbaPercent, sbaRate, sbaTerm, sellerPercent, sellerRate, sellerTerm, mezzPercent, mezzRate, mezzTerm]);

  // Color mappings
  const getDscrColorClass = (dscr: number) => {
    if (dscr >= 1.5) return 'text-[#00FF66] border-[#00FF66]'; // Acid Green
    if (dscr >= 1.25) return 'text-[#0EA5E9] border-[#0EA5E9]'; // Copper Teal
    return 'text-[#FF3333] border-[#FF3333]'; // Warning Crimson
  };

  const getDscrBgClass = (dscr: number) => {
    if (dscr >= 1.5) return 'bg-[#00FF66]';
    if (dscr >= 1.25) return 'bg-[#0EA5E9]';
    return 'bg-[#FF3333]';
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono border border-[#222222] w-full p-4 md:p-6 space-y-6">
      
      {/* 1. Header with System Signals */}
      <div className="border-b border-[#222222] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] text-[#0EA5E9]">
            <span className="w-1.5 h-1.5 bg-[#00FF66] animate-pulse"></span>
            <span>SYSTEM OVERLAY // MULTI-TRANCHE LBO MODULAR DEBT SANDBOX</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-wider mt-1 text-[#F9F9F9]">
            LBO STRUCTURAL ANALYZER & DEBT SERVICE SIMULATOR
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => applyPreset('standardSba')}
            className="text-[10px] px-3 py-1.5 border border-[#222222] bg-[#111111] hover:border-[#00FF66] hover:text-[#00FF66] transition-all"
          >
            [1] Standard SBA
          </button>
          <button 
            onClick={() => applyPreset('equityHeavy')}
            className="text-[10px] px-3 py-1.5 border border-[#222222] bg-[#111111] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all"
          >
            [2] Safe Equity
          </button>
          <button 
            onClick={() => applyPreset('aggressiveLbo')}
            className="text-[10px] px-3 py-1.5 border border-[#222222] bg-[#111111] hover:border-[#FF3333] hover:text-[#FF3333] transition-all"
          >
            [3] Aggressive Mezz Stack
          </button>
        </div>
      </div>

      {/* 2. Parameters Configuration Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Direct Inputs for Asset & Senior Debt */}
        <div className="lg:col-span-4 space-y-4 border-r border-[#222222]/30 pr-0 lg:pr-6">
          <div className="bg-[#0a0a0a] border border-[#222222] p-4 space-y-4">
            <span className="text-xs text-[#888888] uppercase block tracking-widest">// CORE ASSET DATA</span>
            
            <div className="space-y-1">
              <label className="text-[10px] text-[#888888] block">PURCHASE PRICE ($)</label>
              <input 
                type="number" 
                value={askingPrice} 
                onChange={(e) => setAskingPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-2 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#888888] block">ADJUSTED EBITDA ($)</label>
              <input 
                type="number" 
                value={ebitda} 
                onChange={(e) => setEbitda(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-2 font-mono"
              />
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#222222] p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#0EA5E9] uppercase tracking-widest">// SBA 7(A) SENIOR DEBT</span>
              <span className="text-[9px] text-[#888888]">FIRST LIEN</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">LOAN VALUE:</span>
                <span className="text-[#0EA5E9] font-bold">{sbaPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="90" 
                step="5" 
                value={sbaPercent}
                onChange={(e) => setSbaPercent(parseInt(e.target.value))}
                className="w-full accent-[#0EA5E9] bg-[#111111]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-[#888888] block">INTEREST RATE</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    step="0.25"
                    value={sbaRate} 
                    onChange={(e) => setSbaRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#050505] border border-[#222222] text-xs p-2 text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                  />
                  <span className="text-xs px-2 text-[#888888]">%</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#888888] block">TERM YEARS</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    value={sbaTerm} 
                    onChange={(e) => setSbaTerm(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#050505] border border-[#222222] text-xs p-2 text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                  />
                  <span className="text-xs px-2 text-[#888888]">Y</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Mezz & Junior Debt Controls */}
        <div className="lg:col-span-4 space-y-4 border-r border-[#222222]/30 pr-0 lg:pr-6">
          <div className="bg-[#0a0a0a] border border-[#222222] p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#00FF66] uppercase tracking-widest">// SELLER STANDBY NOTE</span>
              <span className="text-[9px] text-[#888888]">SUBORDINATED</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">SELLER FINANCING:</span>
                <span className="text-[#00FF66] font-bold">{sellerPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                step="2.5" 
                value={sellerPercent}
                onChange={(e) => setSellerPercent(parseFloat(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#111111]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-[#888888] block">INTEREST RATE</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    step="0.25"
                    value={sellerRate} 
                    onChange={(e) => setSellerRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#050505] border border-[#222222] text-xs p-2 text-[#F9F9F9] focus:outline-none"
                  />
                  <span className="text-xs px-2 text-[#888888]">%</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#888888] block">TERM YEARS</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    value={sellerTerm} 
                    onChange={(e) => setSellerTerm(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#050505] border border-[#222222] text-xs p-2 text-[#F9F9F9] focus:outline-none"
                  />
                  <span className="text-xs px-2 text-[#888888]">Y</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#222222] p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#FF3333] uppercase tracking-widest">// MEZZANINE GAP LOAN</span>
              <span className="text-[9px] text-[#888888]">HIGH YIELD RISK</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">MEZZANINE VALUE:</span>
                <span className="text-[#FF3333] font-bold">{mezzPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="25" 
                step="5" 
                value={mezzPercent}
                onChange={(e) => setMezzPercent(parseInt(e.target.value))}
                className="w-full accent-[#FF3333] bg-[#111111]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-[#888888] block">INTEREST RATE</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    step="0.5"
                    value={mezzRate} 
                    onChange={(e) => setMezzRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#050505] border border-[#222222] text-xs p-2 text-[#F9F9F9] focus:outline-none"
                  />
                  <span className="text-xs px-2 text-[#888888]">%</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#888888] block">TERM YEARS</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    value={mezzTerm} 
                    onChange={(e) => setMezzTerm(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#050505] border border-[#222222] text-xs p-2 text-[#F9F9F9] focus:outline-none"
                  />
                  <span className="text-xs px-2 text-[#888888]">Y</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulated Outputs & Gauge */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-[#222222] bg-[#0c0c0c] p-4 flex flex-col justify-between h-full">
            <span className="text-xs text-[#888888] uppercase block tracking-widest">// MODEL PERFORMANCE RADIAL INDICATOR</span>

            {/* Dynamic DSCR Circular / Gauge Interface */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                
                {/* Gauge Background ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="72" cy="72" r="60" 
                    stroke="#111111" 
                    strokeWidth="10" 
                    fill="transparent" 
                  />
                  {/* Gauge Live filling ring */}
                  <circle 
                    cx="72" cy="72" r="60" 
                    stroke={calculations.dscr >= 1.5 ? '#00FF66' : (calculations.dscr >= 1.25 ? '#0EA5E9' : '#FF3333')} 
                    strokeWidth="10" 
                    fill="transparent" 
                    strokeDasharray={376.8}
                    strokeDashoffset={376.8 - (376.8 * Math.min(calculations.dscr, 3.0)) / 3.0}
                    className="transition-all duration-300"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-[#888888] uppercase">DSCR RATIO</span>
                  <span className={`text-2xl font-bold ${getDscrColorClass(calculations.dscr)}`}>
                    {calculations.dscr.toFixed(2)}x
                  </span>
                  <span className="text-[8px] border border-[#222222] bg-[#0a0a0a] px-1 text-[#888888] uppercase mt-1">
                    {calculations.dscr >= 1.5 ? 'EXCELLENT' : (calculations.dscr >= 1.25 ? 'MIN REQUIREMENT' : 'CRITICAL')}
                  </span>
                </div>
              </div>
            </div>

            {/* Tactical Debt Stack Bars */}
            <div className="space-y-3 pt-2 border-t border-[#222222]">
              <span className="text-[10px] text-[#888888] uppercase tracking-wider block">LEVERAGE RATIO CONSTRAINTS:</span>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px]">
                  <span className="text-[#888888]">SENIOR BANK DEBT</span>
                  <span className="text-[#0EA5E9] font-bold">{formatCurrency(calculations.sbaLoanAmount)} ({sbaPercent}%)</span>
                </div>
                <div className="w-full bg-[#111111] h-2">
                  <div className="bg-[#0EA5E9] h-full" style={{ width: `${sbaPercent}%` }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px]">
                  <span className="text-[#888888]">SELLER DEBT</span>
                  <span className="text-[#00FF66] font-bold">{formatCurrency(calculations.sellerLoanAmount)} ({sellerPercent}%)</span>
                </div>
                <div className="w-full bg-[#111111] h-2">
                  <div className="bg-[#00FF66] h-full" style={{ width: `${sellerPercent}%` }}></div>
                </div>
              </div>

              {mezzPercent > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px]">
                    <span className="text-[#888888]">MEZZANINE DEBT</span>
                    <span className="text-[#FF3333] font-bold">{formatCurrency(calculations.mezzLoanAmount)} ({mezzPercent}%)</span>
                  </div>
                  <div className="w-full bg-[#111111] h-2">
                    <div className="bg-[#FF3333] h-full" style={{ width: `${mezzPercent}%` }}></div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px]">
                  <span className="text-[#888888]">EQUITY INJECTION</span>
                  <span className="text-[#F9F9F9] font-bold">{formatCurrency(calculations.equityRequired)} ({calculations.equityPercent}%)</span>
                </div>
                <div className="w-full bg-[#111111] h-2">
                  <div className="bg-[#F9F9F9] h-full" style={{ width: `${calculations.equityPercent}%` }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. Calculations Grid Block */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-[#222222] bg-[#0c0c0c]">
        <div>
          <span className="text-[10px] text-[#888888] uppercase block mb-1">ANNUAL DEBT SERVICE</span>
          <span className="text-lg font-bold text-[#FF3333]" x-text="">{formatCurrency(calculations.totalDebtService)}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#888888] uppercase block mb-1">POST-DEBT CASH FLOW</span>
          <span className="text-lg font-bold text-[#00FF66]">{formatCurrency(calculations.postDebtCashFlow)}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#888888] uppercase block mb-1">CASH-ON-CASH (COC)</span>
          <span className="text-lg font-bold text-[#0EA5E9]">{calculations.cashOnCash.toFixed(2)}%</span>
        </div>
        <div>
          <span className="text-[10px] text-[#888888] uppercase block mb-1">TOTAL LBO RATIO</span>
          <span className="text-lg font-bold text-[#F9F9F9]">
            {((askingPrice - calculations.equityRequired) / (ebitda || 1)).toFixed(2)}x
          </span>
        </div>
      </div>

      {/* 4. CoC Return Sensitivity Matrix Table */}
      <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
        <div>
          <span className="text-xs text-[#00FF66] uppercase block tracking-widest">// CASH-ON-CASH SENSITIVITY MATRIX</span>
          <span className="text-[10px] text-[#888888] mt-1 block">
            Impact model showing Cash-on-Cash Return (%) mapping standard interest shifts (X-Axis) against operating EBITDA variances (Y-Axis).
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs tracking-wider border-collapse">
            <thead>
              <tr className="border-b border-[#222222]">
                <th className="py-2 text-[10px] text-[#888888] uppercase font-mono">EBITDA SHIFT \ RATE SHIFT</th>
                <th className="py-2 text-center text-[10px] text-[#888888] uppercase font-mono">-2.0%</th>
                <th className="py-2 text-center text-[10px] text-[#888888] uppercase font-mono">-1.0%</th>
                <th className="py-2 text-center text-[10px] text-[#888888] uppercase font-mono">BASE RATE</th>
                <th className="py-2 text-center text-[10px] text-[#888888] uppercase font-mono">+1.0%</th>
                <th className="py-2 text-center text-[10px] text-[#888888] uppercase font-mono">+2.0%</th>
              </tr>
            </thead>
            <tbody>
              {sensitivityData.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-[#222222]/50 hover:bg-[#111111]">
                  <td className="py-2 font-bold text-[#F9F9F9] text-[11px]">
                    {row.ebitdaShift > 0 ? `+${row.ebitdaShift}%` : `${row.ebitdaShift}%`} (EBITDA: {formatCurrency(ebitda * (1 + row.ebitdaShift / 100))})
                  </td>
                  {row.rowData.map((col, cIdx) => (
                    <td key={cIdx} className="py-2 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`font-mono text-xs font-bold ${col.coc > 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                          {col.coc.toFixed(1)}%
                        </span>
                        <span className="text-[8px] text-[#888888]">
                          DSCR: {col.dscr.toFixed(2)}x
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Warning / Structural Guidelines Footer Block */}
      <div className="border-t border-[#222222] pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] text-[#888888] font-mono leading-relaxed">
        <div className="max-w-2xl">
          <p className="text-[#FF3333] uppercase font-bold tracking-widest">// SYSTEM FEASIBILITY DIAGNOSTICS</p>
          <p className="mt-1">
            * Standard SBA 7(a) rules mandate a minimum Debt Service Coverage Ratio (DSCR) of 1.15x to 1.25x. Any simulation falling below 1.20x triggers high-risk underwriting scrutiny and requires additional equity capital inject.
          </p>
        </div>
        <div className="text-right whitespace-nowrap">
          <span>STABILITY RATING: </span>
          <span className={`font-bold ${calculations.dscr >= 1.25 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
            {calculations.dscr >= 1.50 ? 'SECURE STACK' : (calculations.dscr >= 1.25 ? 'VALID AMORTIZATION' : 'REJECT RISK')}
          </span>
        </div>
      </div>

    </div>
  );
}