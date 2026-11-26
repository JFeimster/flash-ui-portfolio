import React, { useState, useMemo } from 'react';

// Custom interface for LBO presets
interface LBOPreset {
  name: string;
  sbaPercent: number;
  sbaRate: number;
  sellerPercent: number;
  sellerRate: number;
  mezzPercent: number;
  mezzRate: number;
}

export default function DebtSliderPanel() {
  // Core Operational Variables
  const [purchasePrice, setPurchasePrice] = useState<number>(3500000);
  const [ebitda, setEbitda] = useState<number>(1000000);

  // Leverage Sliders (%)
  const [sbaPercent, setSbaPercent] = useState<number>(75);
  const [sellerPercent, setSellerPercent] = useState<number>(10);
  const [mezzPercent, setMezzPercent] = useState<number>(5);

  // Interest Rates (%)
  const [sbaRate, setSbaRate] = useState<number>(10.25);
  const [sellerRate, setSellerRate] = useState<number>(8.0);
  const [mezzRate, setMezzRate] = useState<number>(13.5);

  // Loan Terms (Years)
  const [sbaTerm, setSbaTerm] = useState<number>(10);
  const [sellerTerm, setSellerTerm] = useState<number>(5);
  const [mezzTerm, setMezzTerm] = useState<number>(7);

  // Presets Configuration
  const presets: Record<string, LBOPreset> = {
    maxSba: {
      name: "SBA MAXIMUM ULTRA-LEVERAGE",
      sbaPercent: 90,
      sbaRate: 10.5,
      sellerPercent: 0,
      sellerRate: 8.0,
      mezzPercent: 0,
      mezzRate: 12.0
    },
    hybridVenture: {
      name: "HYBRID STRUCTURE / CO-INVEST",
      sbaPercent: 70,
      sbaRate: 10.25,
      sellerPercent: 15,
      sellerRate: 7.5,
      mezzPercent: 5,
      mezzRate: 13.0
    },
    conservative: {
      name: "CONSERVATIVE / EQUITY DOMINANT",
      sbaPercent: 50,
      sbaRate: 9.75,
      sellerPercent: 20,
      sellerRate: 6.0,
      mezzPercent: 0,
      mezzRate: 0
    }
  };

  const applyPreset = (presetKey: keyof typeof presets) => {
    const p = presets[presetKey];
    setSbaPercent(p.sbaPercent);
    setSbaRate(p.sbaRate);
    setSellerPercent(p.sellerPercent);
    setSellerRate(p.sellerRate);
    setMezzPercent(p.mezzPercent);
    setMezzRate(p.mezzRate);
  };

  // Live Calculations
  const calculations = useMemo(() => {
    // Prevent overallocation (Total leverage capped at 95% to preserve minimum 5% equity)
    let totalLeverage = sbaPercent + sellerPercent + mezzPercent;
    let adjustedSba = sbaPercent;
    let adjustedSeller = sellerPercent;
    let adjustedMezz = mezzPercent;

    if (totalLeverage > 95) {
      const scale = 95 / totalLeverage;
      adjustedSba = Math.round(sbaPercent * scale * 10) / 10;
      adjustedSeller = Math.round(sellerPercent * scale * 10) / 10;
      adjustedMezz = Math.max(0, Math.round((95 - (adjustedSba + adjustedSeller)) * 10) / 10);
      totalLeverage = adjustedSba + adjustedSeller + adjustedMezz;
    }

    const equityPercent = Math.max(5, 100 - totalLeverage);
    
    const sbaPrincipal = purchasePrice * (adjustedSba / 100);
    const sellerPrincipal = purchasePrice * (adjustedSeller / 100);
    const mezzPrincipal = purchasePrice * (adjustedMezz / 100);
    const equityInjected = purchasePrice * (equityPercent / 100);

    // Amortization Function (Standard monthly PMT * 12)
    const calcAnnualDebtService = (principal: number, annualRate: number, termYears: number) => {
      if (principal <= 0 || annualRate <= 0 || termYears <= 0) return 0;
      const monthlyRate = (annualRate / 100) / 12;
      const totalMonths = termYears * 12;
      const monthlyPmt = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      return Math.round(monthlyPmt * 12);
    };

    const sbaDebtService = calcAnnualDebtService(sbaPrincipal, sbaRate, sbaTerm);
    const sellerDebtService = calcAnnualDebtService(sellerPrincipal, sellerRate, sellerTerm);
    const mezzDebtService = calcAnnualDebtService(mezzPrincipal, mezzRate, mezzTerm);

    const totalAnnualDebtService = sbaDebtService + sellerDebtService + mezzDebtService;
    const postDebtCashFlow = ebitda - totalAnnualDebtService;
    const dscr = totalAnnualDebtService > 0 ? (ebitda / totalAnnualDebtService) : 9.99;

    // Cash-on-Cash Return
    const cashOnCash = equityInjected > 0 ? (postDebtCashFlow / equityInjected) * 100 : 0;

    // Blended Cost of Debt
    const totalDebtPrincipal = sbaPrincipal + sellerPrincipal + mezzPrincipal;
    const blendedRate = totalDebtPrincipal > 0 
      ? ((sbaPrincipal * sbaRate) + (sellerPrincipal * sellerRate) + (mezzPrincipal * mezzRate)) / totalDebtPrincipal
      : 0;

    return {
      adjustedSba,
      adjustedSeller,
      adjustedMezz,
      equityPercent,
      sbaPrincipal,
      sellerPrincipal,
      mezzPrincipal,
      equityInjected,
      sbaDebtService,
      sellerDebtService,
      mezzDebtService,
      totalAnnualDebtService,
      postDebtCashFlow,
      dscr,
      cashOnCash,
      blendedRate
    };
  }, [purchasePrice, ebitda, sbaPercent, sbaRate, sbaTerm, sellerPercent, sellerRate, sellerTerm, mezzPercent, mezzRate, mezzTerm]);

  // Currency Formatter
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="font-mono text-[#F9F9F9] bg-[#050505] border border-[#222222] p-6 max-w-7xl mx-auto space-y-8 select-none relative">
      {/* Scanline CRT decoration overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient(rgba(10,10,10,0.15)_15%,_transparent_80%) z-10" />

      {/* 1. Terminal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#222222] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-[#00FF66] tracking-widest font-bold uppercase">
            <span className="w-2 h-2 bg-[#00FF66] animate-pulse inline-block" />
            LBO STRUCTURAL ANALYZER // DEBT SANDBOX
          </div>
          <h2 className="text-xl font-bold tracking-tight uppercase mt-1">LEVERAGE CAPACITY MODELER</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => applyPreset('maxSba')}
            className="text-[9px] px-3 py-1.5 border border-[#222222] hover:border-[#00FF66] hover:text-[#00FF66] bg-[#0c0c0c] transition-colors"
          >
            [PRESET: MAX SBA]
          </button>
          <button 
            onClick={() => applyPreset('hybridVenture')}
            className="text-[9px] px-3 py-1.5 border border-[#222222] hover:border-[#0EA5E9] hover:text-[#0EA5E9] bg-[#0c0c0c] transition-colors"
          >
            [PRESET: HYBRID]
          </button>
          <button 
            onClick={() => applyPreset('conservative')}
            className="text-[9px] px-3 py-1.5 border border-[#222222] hover:border-[#FF3333] hover:text-[#FF3333] bg-[#0c0c0c] transition-colors"
          >
            [PRESET: EQUITY CO]
          </button>
        </div>
      </div>

      {/* 2. Top-Level Inputs (Purchase Price & Operating EBITDA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#080808] p-4 border border-[#222222]">
        <div>
          <label className="text-[10px] text-[#888888] uppercase block mb-1">AUDITED ENTERPRISE VALUE (PURCHASE PRICE)</label>
          <div className="flex items-center gap-3">
            <input 
              type="range" 
              min={500000} 
              max={15000000} 
              step={100000} 
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full accent-[#0EA5E9] bg-[#111111] h-1"
            />
            <span className="text-sm font-bold text-[#0EA5E9] min-w-[120px] text-right">{formatUSD(purchasePrice)}</span>
          </div>
          <div className="flex justify-between text-[8px] text-[#888888] mt-1">
            <span>$500K</span>
            <span>MULTIPLE: {(purchasePrice / (ebitda || 1)).toFixed(2)}x EBITDA</span>
            <span>$15.0M</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-[#888888] uppercase block mb-1">PROVABLE OPERATIONAL EBITDA (TTM)</label>
          <div className="flex items-center gap-3">
            <input 
              type="range" 
              min={100000} 
              max={3000000} 
              step={25000} 
              value={ebitda}
              onChange={(e) => setEbitda(Number(e.target.value))}
              className="w-full accent-[#00FF66] bg-[#111111] h-1"
            />
            <span className="text-sm font-bold text-[#00FF66] min-w-[120px] text-right">{formatUSD(ebitda)}</span>
          </div>
          <div className="flex justify-between text-[8px] text-[#888888] mt-1">
            <span>$100K</span>
            <span>CASH FLOW GENERATION BASE</span>
            <span>$3.0M</span>
          </div>
        </div>
      </div>

      {/* 3. Debt Architecture Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Structuring Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-xs text-[#888888] tracking-widest uppercase">// CAP TABLE STRATA & INTERMEDIATE LEVERAGE</h3>

          {/* Tier A: SBA 7(a) Amortizing Debt */}
          <div className="border border-[#222222] bg-[#0c0c0c] p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-[11px] font-bold text-[#0EA5E9]">[TIER A: SBA 7(a) PRIMARY DEBT]</span>
              <span className="text-[11px] font-bold text-[#0EA5E9]" style={{ contentVisibility: 'auto' }}>
                {formatUSD(calculations.sbaPrincipal)} ({calculations.adjustedSba}%)
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[9px] text-[#888888] block">ALLOCATION LIMIT</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="range" min="0" max="90" step="5" value={sbaPercent}
                    onChange={(e) => setSbaPercent(Number(e.target.value))}
                    className="w-full accent-[#0EA5E9]"
                  />
                  <span className="text-[10px] font-bold w-8 text-right">{sbaPercent}%</span>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-[#888888] block">BASE SPREAD % (INTEREST)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="range" min="6.0" max="14.0" step="0.25" value={sbaRate}
                    onChange={(e) => setSbaRate(Number(e.target.value))}
                    className="w-full accent-[#0EA5E9]"
                  />
                  <span className="text-[10px] font-bold w-12 text-right text-yellow-500">{sbaRate}%</span>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-[#888888] block">TERM CAP (YEARS)</label>
                <select 
                  value={sbaTerm} 
                  onChange={(e) => setSbaTerm(Number(e.target.value))}
                  className="bg-[#050505] border border-[#222222] text-[10px] p-1 w-full text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                >
                  <option value="5">5 YEARS</option>
                  <option value="7">7 YEARS</option>
                  <option value="10">10 YEARS (MAX)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tier B: Seller Promissory Note */}
          <div className="border border-[#222222] bg-[#0c0c0c] p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-[11px] font-bold text-[#00FF66]">[TIER B: SELLER PROMISSORY NOTE]</span>
              <span className="text-[11px] font-bold text-[#00FF66]" style={{ contentVisibility: 'auto' }}>
                {formatUSD(calculations.sellerPrincipal)} ({calculations.adjustedSeller}%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[9px] text-[#888888] block">ALLOCATION LIMIT</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="range" min="0" max="30" step="2.5" value={sellerPercent}
                    onChange={(e) => setSellerPercent(Number(e.target.value))}
                    className="w-full accent-[#00FF66]"
                  />
                  <span className="text-[10px] font-bold w-8 text-right">{sellerPercent}%</span>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-[#888888] block">STANDBY RATE %</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="range" min="4.0" max="12.0" step="0.5" value={sellerRate}
                    onChange={(e) => setSellerRate(Number(e.target.value))}
                    className="w-full accent-[#00FF66]"
                  />
                  <span className="text-[10px] font-bold w-12 text-right text-yellow-500">{sellerRate}%</span>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-[#888888] block">TERM CAP (YEARS)</label>
                <select 
                  value={sellerTerm} 
                  onChange={(e) => setSellerTerm(Number(e.target.value))}
                  className="bg-[#050505] border border-[#222222] text-[10px] p-1 w-full text-[#F9F9F9] focus:outline-none focus:border-[#00FF66]"
                >
                  <option value="3">3 YEARS</option>
                  <option value="5">5 YEARS</option>
                  <option value="7">7 YEARS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tier C: Mezzanine Debt */}
          <div className="border border-[#222222] bg-[#0c0c0c] p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-[11px] font-bold text-[#FF3333]">[TIER C: MEZZANINE DEBT]</span>
              <span className="text-[11px] font-bold text-[#FF3333]" style={{ contentVisibility: 'auto' }}>
                {formatUSD(calculations.mezzPrincipal)} ({calculations.adjustedMezz}%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[9px] text-[#888888] block">ALLOCATION LIMIT</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="range" min="0" max="25" step="2.5" value={mezzPercent}
                    onChange={(e) => setMezzPercent(Number(e.target.value))}
                    className="w-full accent-[#FF3333]"
                  />
                  <span className="text-[10px] font-bold w-8 text-right">{mezzPercent}%</span>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-[#888888] block">HIGH INTEREST SPREAD %</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="range" min="10.0" max="18.0" step="0.25" value={mezzRate}
                    onChange={(e) => setMezzRate(Number(e.target.value))}
                    className="w-full accent-[#FF3333]"
                  />
                  <span className="text-[10px] font-bold w-12 text-right text-yellow-500">{mezzRate}%</span>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-[#888888] block">TERM CAP (YEARS)</label>
                <select 
                  value={mezzTerm} 
                  onChange={(e) => setMezzTerm(Number(e.target.value))}
                  className="bg-[#050505] border border-[#222222] text-[10px] p-1 w-full text-[#F9F9F9] focus:outline-none focus:border-[#FF3333]"
                >
                  <option value="5">5 YEARS</option>
                  <option value="7">7 YEARS</option>
                  <option value="10">10 YEARS</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Metrics, Gauges & Outputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xs text-[#888888] tracking-widest uppercase">// SYSTEM DIAGNOSTIC GAUGES</h3>

          {/* Key Output Metrics Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#222222] bg-[#0c0c0c] p-3">
              <span className="text-[9px] text-[#888888] uppercase block">TOTAL LTV DEBT %</span>
              <span className="text-lg font-bold text-[#0EA5E9]" style={{ contentVisibility: 'auto' }}>
                {100 - calculations.equityPercent}%
              </span>
            </div>

            <div className="border border-[#222222] bg-[#0c0c0c] p-3">
              <span className="text-[9px] text-[#888888] uppercase block">MIN EQUITY REQ.</span>
              <span className="text-lg font-bold text-[#00FF66]" style={{ contentVisibility: 'auto' }}>
                {formatUSD(calculations.equityInjected)} ({calculations.equityPercent}%)
              </span>
            </div>

            <div className="border border-[#222222] bg-[#0c0c0c] p-3">
              <span className="text-[9px] text-[#888888] uppercase block">BLENDED INT. RATE</span>
              <span className="text-lg font-bold text-yellow-500" style={{ contentVisibility: 'auto' }}>
                {calculations.blendedRate.toFixed(2)}%
              </span>
            </div>

            <div className="border border-[#222222] bg-[#0c0c0c] p-3">
              <span className="text-[9px] text-[#888888] uppercase block">EST. DEBT SERVICE</span>
              <span className="text-lg font-bold text-[#FF3333]" style={{ contentVisibility: 'auto' }}>
                {formatUSD(calculations.totalAnnualDebtService)} / YR
              </span>
            </div>
          </div>

          {/* DSCR Live Gauge and Risk Indicator */}
          <div className="border border-[#222222] bg-[#0c0c0c] p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#888888] uppercase tracking-wider">DEBT SERVICE COVERAGE RATIO (DSCR)</span>
              <span className={`text-xs font-bold px-2 py-0.5 border ${
                calculations.dscr >= 1.50 ? 'border-[#00FF66] text-[#00FF66]' :
                calculations.dscr >= 1.25 ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-[#FF3333] text-[#FF3333]'
              }`} style={{ contentVisibility: 'auto' }}>
                {calculations.dscr >= 1.50 ? 'SECURE' : calculations.dscr >= 1.25 ? 'ACCEPTABLE' : 'CRITICAL WARNING'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold tracking-tight ${
                calculations.dscr >= 1.50 ? 'text-[#00FF66]' :
                calculations.dscr >= 1.25 ? 'text-[#0EA5E9]' : 'text-[#FF3333]'
              }`} style={{ contentVisibility: 'auto' }}>
                {calculations.dscr.toFixed(2)}x
              </span>
              <span className="text-[10px] text-[#888888]">TARGET SIZES: SBA MIN 1.15x / IDEAL &gt;1.50x</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="w-full bg-[#111111] h-3 border border-[#222222] relative overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  calculations.dscr >= 1.50 ? 'bg-[#00FF66]' :
                  calculations.dscr >= 1.25 ? 'bg-[#0EA5E9]' : 'bg-[#FF3333]'
                }`}
                style={{ width: `${Math.min(100, (calculations.dscr / 2.5) * 100)}%` }}
              />
              <div className="absolute left-[50%] top-0 h-full w-0.5 bg-[#F9F9F9]/30" title="SBA Standard Benchmark (1.25x)" />
            </div>
          </div>

          {/* Cash-on-Cash Return Metrics Matrix */}
          <div className="border border-[#222222] bg-[#0c0c0c] p-4 space-y-3">
            <span className="text-[10px] text-[#888888] uppercase tracking-wider block">PRO-FORMA FIRST YEAR CASH-ON-CASH RETURNS</span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-[#888888] block">POST-DEBT CASH FLOW</span>
                <span className={`text-xl font-bold ${calculations.postDebtCashFlow >= 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`} style={{ contentVisibility: 'auto' }}>
                  {formatUSD(calculations.postDebtCashFlow)}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-[#888888] block">PROJECTED COCR Y1</span>
                <span className={`text-xl font-bold ${calculations.cashOnCash >= 15 ? 'text-[#00FF66]' : 'text-yellow-500'}`} style={{ contentVisibility: 'auto' }}>
                  {calculations.cashOnCash.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Interactive Simulation Matrix Grid */}
      <div className="border border-[#222222] bg-[#080808] p-4 space-y-4">
        <h3 className="text-xs text-[#0EA5E9] tracking-widest uppercase">// STRESS TEST SENSITIVITY MATRIX (EBITDA DEVIATIONS)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[-20, -10, 0, 10].map((shift) => {
            const adjustedEbitda = ebitda * (1 + shift / 100);
            const shiftedDscr = calculations.totalAnnualDebtService > 0 ? (adjustedEbitda / calculations.totalAnnualDebtService) : 0;
            const shiftedPostCashFlow = adjustedEbitda - calculations.totalAnnualDebtService;
            const shiftedCocr = calculations.equityInjected > 0 ? (shiftedPostCashFlow / calculations.equityInjected) * 100 : 0;

            return (
              <div 
                key={shift} 
                className={`border p-3 space-y-2 ${
                  shift === 0 ? 'border-[#0EA5E9] bg-[#0d141a]' : 'border-[#222222] bg-[#0c0c0c]'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className={shift < 0 ? 'text-[#FF3333]' : shift > 0 ? 'text-[#00FF66]' : 'text-[#0EA5E9]'}>
                    {shift === 0 ? 'BASELINE EBITDA' : `${shift}% DEVIATION`}
                  </span>
                  <span className="text-[#888888]" style={{ contentVisibility: 'auto' }}>
                    {formatUSD(adjustedEbitda)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#222222] text-[10px]">
                  <div>
                    <span className="text-[#888888] block text-[8px]">STRESSED DSCR</span>
                    <span className={`font-bold ${shiftedDscr >= 1.25 ? 'text-[#F9F9F9]' : 'text-[#FF3333]'}`} style={{ contentVisibility: 'auto' }}>
                      {shiftedDscr.toFixed(2)}x
                    </span>
                  </div>
                  <div>
                    <span className="text-[#888888] block text-[8px]">NET CASH FLOW</span>
                    <span className={`font-bold ${shiftedPostCashFlow >= 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`} style={{ contentVisibility: 'auto' }}>
                      {formatUSD(shiftedPostCashFlow)}
                    </span>
                  </div>
                </div>

                <div className="pt-1 border-t border-[#222222] flex justify-between items-center text-[9px]">
                  <span className="text-[#888888]">CASH RETURN:</span>
                  <span className={`font-bold ${shiftedCocr >= 0 ? 'text-yellow-500' : 'text-[#FF3333]'}`} style={{ contentVisibility: 'auto' }}>
                    {shiftedCocr.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Live Simulation Warning Feed */}
      <div className="flex items-center gap-3 border border-[#FF3333]/30 bg-[#140808] p-3 text-[10px] text-[#FF3333]">
        <svg className="w-5 h-5 animate-pulse shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="leading-relaxed">
          WARNING: Leveraged buyouts utilize high concentrations of collateralized debt obligations. Sliders reflect theoretical model paths. Extreme pricing levels can result in high key-man transition dependencies and regulatory bank restructuring protocols under SBA SOP 50 10 guideline thresholds. Verify calculations with certified SBA deal advisory counsel before initiating structural transitions.
        </p>
      </div>

    </div>
  );
}