import React, { useState, useMemo } from 'react';

type PresetType = 'SBA_MAX' | 'AGGRESSIVE_SELLER' | 'HIGHLY_LEVERAGED' | 'CONSERVATIVE';

interface LBOState {
  purchasePrice: number;
  ebitda: number;
  equityPct: number;
  sellerNotePct: number;
  seniorInterestRate: number;
  sellerInterestRate: number;
  seniorTermYears: number;
  sellerTermYears: number;
  sellerInterestOnly: boolean;
  capexPct: number;
}

export default function DebtWaterfallChart() {
  // 1. Initial State matching AcquireMeta's top tiers
  const [state, setState] = useState<LBOState>({
    purchasePrice: 2500000,
    ebitda: 650000,
    equityPct: 10,
    sellerNotePct: 15,
    seniorInterestRate: 11.25,
    sellerInterestRate: 8.0,
    seniorTermYears: 10,
    sellerTermYears: 10,
    sellerInterestOnly: false,
    capexPct: 5, // 5% of EBITDA allocated for CapEx
  });

  // Calculate Senior Debt % based on equity & seller note constraints
  const seniorDebtPct = useMemo(() => {
    const totalAllocated = state.equityPct + state.sellerNotePct;
    return Math.max(0, 100 - totalAllocated);
  }, [state.equityPct, state.sellerNotePct]);

  // Adjust parameters via helpers
  const handlePreset = (preset: PresetType) => {
    switch (preset) {
      case 'SBA_MAX':
        setState(prev => ({
          ...prev,
          equityPct: 10,
          sellerNotePct: 15,
          seniorInterestRate: 11.25,
          sellerInterestRate: 8.0,
          seniorTermYears: 10,
          sellerTermYears: 10,
          sellerInterestOnly: false
        }));
        break;
      case 'AGGRESSIVE_SELLER':
        setState(prev => ({
          ...prev,
          equityPct: 10,
          sellerNotePct: 30,
          seniorInterestRate: 11.25,
          sellerInterestRate: 7.0,
          seniorTermYears: 10,
          sellerTermYears: 7,
          sellerInterestOnly: true
        }));
        break;
      case 'HIGHLY_LEVERAGED':
        setState(prev => ({
          ...prev,
          equityPct: 5, // Edge-case high leverage
          sellerNotePct: 15,
          seniorInterestRate: 11.5,
          sellerInterestRate: 9.0,
          seniorTermYears: 10,
          sellerTermYears: 10,
          sellerInterestOnly: false
        }));
        break;
      case 'CONSERVATIVE':
        setState(prev => ({
          ...prev,
          equityPct: 25,
          sellerNotePct: 10,
          seniorInterestRate: 10.75,
          sellerInterestRate: 6.0,
          seniorTermYears: 10,
          sellerTermYears: 5,
          sellerInterestOnly: false
        }));
        break;
    }
  };

  // Debt Amortization Calculations (Standard variable PMT formula)
  const calcPMT = (principal: number, annualRate: number, years: number, interestOnly: boolean) => {
    if (principal <= 0) return 0;
    if (interestOnly) {
      return principal * (annualRate / 100);
    }
    const r = (annualRate / 100) / 12;
    const n = years * 12;
    if (r === 0) return principal / years;
    const monthlyPayment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return monthlyPayment * 12;
  };

  const financials = useMemo(() => {
    const sDebtAmount = state.purchasePrice * (seniorDebtPct / 100);
    const sellerNoteAmount = state.purchasePrice * (state.sellerNotePct / 100);
    const equityAmount = state.purchasePrice * (state.equityPct / 100);

    const seniorDebtService = calcPMT(sDebtAmount, state.seniorInterestRate, state.seniorTermYears, false);
    const sellerDebtService = calcPMT(sellerNoteAmount, state.sellerInterestRate, state.sellerTermYears, state.sellerInterestOnly);
    
    const totalDebtService = seniorDebtService + sellerDebtService;
    const capexReserve = state.ebitda * (state.capexPct / 100);
    const preTaxCashFlow = state.ebitda - totalDebtService - capexReserve;
    
    const dscr = totalDebtService > 0 ? state.ebitda / totalDebtService : 99.9;
    const cashOnCash = equityAmount > 0 ? (preTaxCashFlow / equityAmount) * 100 : 0;
    const impliedMultiple = state.ebitda > 0 ? state.purchasePrice / state.ebitda : 0;

    return {
      sDebtAmount,
      sellerNoteAmount,
      equityAmount,
      seniorDebtService,
      sellerDebtService,
      totalDebtService,
      capexReserve,
      preTaxCashFlow,
      dscr,
      cashOnCash,
      impliedMultiple
    };
  }, [state, seniorDebtPct]);

  // Color mappings for UI signals
  const dscrBadgeStyle = () => {
    if (financials.dscr < 1.15) return { bg: 'bg-[#FF3333]/10 text-[#FF3333] border-[#FF3333]/30', label: 'DANGEROUS / DEFICIT' };
    if (financials.dscr < 1.35) return { bg: 'bg-[#FFC000]/10 text-[#FFC000] border-[#FFC000]/30', label: 'TIGHT / MONITOR' };
    return { bg: 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/30', label: 'OPTIMAL SBA STRUCTURE' };
  };

  return (
    <div className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] font-sans antialiased">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b border-[#222222] bg-[#090909] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#0EA5E9] animate-pulse"></span>
            <span className="font-mono text-[10px] text-[#0EA5E9] tracking-widest uppercase font-bold">INTERACTIVE LBO ENGINE v4.20</span>
          </div>
          <h2 className="text-lg font-bold font-mono tracking-tight text-[#F9F9F9] uppercase mt-1">
            Leveraged Buyout Capital Stack Visualizer
          </h2>
        </div>
        
        {/* Preset Selector Badges */}
        <div className="flex flex-wrap gap-1.5 bg-black p-1 border border-[#1a1a1a]">
          <button 
            onClick={() => handlePreset('SBA_MAX')}
            className={`font-mono text-[9px] px-2.5 py-1.5 transition-all uppercase ${state.equityPct === 10 && state.sellerNotePct === 15 ? 'bg-[#00FF66] text-black font-extrabold' : 'text-[#888] hover:text-[#F9F9F9]'}`}
          >
            SBA 7(a) Max
          </button>
          <button 
            onClick={() => handlePreset('AGGRESSIVE_SELLER')}
            className={`font-mono text-[9px] px-2.5 py-1.5 transition-all uppercase ${state.sellerNotePct === 30 ? 'bg-[#00FF66] text-black font-extrabold' : 'text-[#888] hover:text-[#F9F9F9]'}`}
          >
            Seller Dominant
          </button>
          <button 
            onClick={() => handlePreset('CONSERVATIVE')}
            className={`font-mono text-[9px] px-2.5 py-1.5 transition-all uppercase ${state.equityPct === 25 ? 'bg-[#00FF66] text-black font-extrabold' : 'text-[#888] hover:text-[#F9F9F9]'}`}
          >
            De-risked Stack
          </button>
        </div>
      </div>

      {/* 2. Main Workspace Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 divide-y xl:divide-y-0 xl:divide-x divide-[#222222]">
        
        {/* Left Control Panel Column */}
        <div className="xl:col-span-5 p-6 space-y-6 bg-[#080808]">
          <div className="space-y-4">
            <h3 className="font-mono text-[11px] text-[#888888] tracking-widest uppercase border-b border-[#1a1a1a] pb-2">
              01 / ASSET TRANSACTION PRICING
            </h3>

            {/* Inputs: Purchase Price & EBITDA */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#666666] uppercase block">Purchase Price (EV)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#555] font-mono text-xs">$</span>
                  <input 
                    type="number"
                    value={state.purchasePrice}
                    onChange={(e) => setState(prev => ({ ...prev, purchasePrice: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-full h-9 bg-black border border-[#222222] pl-7 pr-3 text-xs font-mono text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#666666] uppercase block">Normalized EBITDA</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#555] font-mono text-xs">$</span>
                  <input 
                    type="number"
                    value={state.ebitda}
                    onChange={(e) => setState(prev => ({ ...prev, ebitda: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-full h-9 bg-black border border-[#222222] pl-7 pr-3 text-xs font-mono text-[#00FF66] focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#444] text-right">
              IMPLIED VALUATION MULTIPLE: <span className="text-[#0EA5E9]">{financials.impliedMultiple.toFixed(2)}x</span>
            </div>
          </div>

          {/* Capital Allocation Stack Sliders */}
          <div className="space-y-4">
            <h3 className="font-mono text-[11px] text-[#888888] tracking-widest uppercase border-b border-[#1a1a1a] pb-2">
              02 / CAPITAL ALLOCATION (%)
            </h3>

            {/* Equity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#888]">Buyer Cash Equity</span>
                <span className="text-white font-bold">{state.equityPct}% (${(financials.equityAmount / 1000).toLocaleString()}k)</span>
              </div>
              <input 
                type="range"
                min="5"
                max="50"
                step="1"
                value={state.equityPct}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setState(prev => {
                    const nextSeller = Math.min(prev.sellerNotePct, 100 - val);
                    return { ...prev, equityPct: val, sellerNotePct: nextSeller };
                  });
                }}
                className="w-full h-1 bg-[#1a1a1a] accent-[#0EA5E9] cursor-pointer appearance-none"
              />
            </div>

            {/* Seller Note Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#888]">Seller Standby Note</span>
                <span className="text-[#FFC000] font-bold">{state.sellerNotePct}% (${(financials.sellerNoteAmount / 1000).toLocaleString()}k)</span>
              </div>
              <input 
                type="range"
                min="0"
                max="40"
                step="1"
                value={state.sellerNotePct}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setState(prev => {
                    const nextEquity = Math.min(prev.equityPct, 100 - val);
                    return { ...prev, sellerNotePct: val, equityPct: nextEquity };
                  });
                }}
                className="w-full h-1 bg-[#1a1a1a] accent-[#FFC000] cursor-pointer appearance-none"
              />
            </div>

            {/* Dynamic SBA / Senior Allocation (Read-Only indicator) */}
            <div className="bg-black border border-[#1a1a1a] px-3 py-2.5 flex justify-between items-center font-mono text-xs">
              <span className="text-[#666] text-[10px] uppercase">Senior Debt Requirement (Plug)</span>
              <span className="text-[#00FF66] font-extrabold">{seniorDebtPct}% (${(financials.sDebtAmount / 1000).toLocaleString()}k)</span>
            </div>
          </div>

          {/* Underwriting Parameters (Rates & Terms) */}
          <div className="space-y-4">
            <h3 className="font-mono text-[11px] text-[#888888] tracking-widest uppercase border-b border-[#1a1a1a] pb-2">
              03 / UNDERWRITING ASSUMPTIONS
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Senior Loan Rate */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#666666] uppercase block">Senior Interest (SBA)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.05"
                    value={state.seniorInterestRate}
                    onChange={(e) => setState(prev => ({ ...prev, seniorInterestRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full h-9 bg-black border border-[#222222] px-3 text-xs font-mono text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                  <span className="absolute right-3 top-2 text-[#555] font-mono text-xs">%</span>
                </div>
              </div>
              
              {/* Seller Loan Rate */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#666666] uppercase block">Seller Note Interest</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.05"
                    value={state.sellerInterestRate}
                    onChange={(e) => setState(prev => ({ ...prev, sellerInterestRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full h-9 bg-black border border-[#222222] px-3 text-xs font-mono text-white focus:outline-none focus:border-yellow-500"
                  />
                  <span className="absolute right-3 top-2 text-[#555] font-mono text-xs">%</span>
                </div>
              </div>

              {/* Term Assumptions */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#666666] uppercase block">Senior Amort. (Yrs)</label>
                <input 
                  type="number" 
                  value={state.seniorTermYears}
                  onChange={(e) => setState(prev => ({ ...prev, seniorTermYears: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="w-full h-9 bg-black border border-[#222222] px-3 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#666666] uppercase block">Seller Note Amort. (Yrs)</label>
                <input 
                  type="number" 
                  value={state.sellerTermYears}
                  disabled={state.sellerInterestOnly}
                  className="w-full h-9 bg-black border border-[#222222] px-3 text-xs font-mono text-white focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                  onChange={(e) => setState(prev => ({ ...prev, sellerTermYears: Math.max(1, parseInt(e.target.value) || 1) }))}
                />
              </div>
            </div>

            {/* Interest-Only Toggle for Seller Note */}
            <div className="flex items-center justify-between bg-black/40 border border-[#1a1a1a]/80 px-3 py-2">
              <span className="font-mono text-[10px] text-[#888] uppercase">Interest-Only Seller Note</span>
              <button
                type="button"
                onClick={() => setState(prev => ({ ...prev, sellerInterestOnly: !prev.sellerInterestOnly }))}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${state.sellerInterestOnly ? 'bg-[#00FF66]' : 'bg-[#222]'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${state.sellerInterestOnly ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* CapEx % */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="font-mono text-[10px] text-[#666666] uppercase">CapEx Reserve (% of EBITDA)</label>
                <span className="font-mono text-[10px] text-[#888]">{state.capexPct}% (${financials.capexReserve.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr)</span>
              </div>
              <input 
                type="range"
                min="0"
                max="20"
                step="1.5"
                value={state.capexPct}
                onChange={(e) => setState(prev => ({ ...prev, capexPct: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-[#1a1a1a] accent-[#0EA5E9] cursor-pointer appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Right Output & Waterfall Visualizer Pane */}
        <div className="xl:col-span-7 p-6 space-y-6 flex flex-col justify-between">
          
          {/* Main Key-Performance Indicator HUD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* DSCR KPI */}
            <div className={`p-4 border ${dscrBadgeStyle().bg} flex flex-col justify-between space-y-3`}>
              <div>
                <span className="font-mono text-[9px] block uppercase tracking-wider opacity-80">DEBT COVERAGE (DSCR)</span>
                <span className="text-3xl font-extrabold tracking-tight font-mono">{financials.dscr.toFixed(2)}x</span>
              </div>
              <span className="font-mono text-[8px] border border-current px-2 py-0.5 self-start uppercase tracking-wider">
                {dscrBadgeStyle().label}
              </span>
            </div>

            {/* Cash-on-Cash Return KPI */}
            <div className="p-4 border border-[#0ea5e9]/20 bg-[#0ea5e9]/5 flex flex-col justify-between space-y-3">
              <div>
                <span className="font-mono text-[9px] text-[#0ea5e9] block uppercase tracking-wider">Y1 Cash-On-Cash ROI</span>
                <span className="text-3xl font-extrabold tracking-tight text-[#F9F9F9] font-mono">
                  {financials.cashOnCash.toFixed(1)}%
                </span>
              </div>
              <span className="font-mono text-[8px] bg-[#0ea5e9]/20 text-[#0ea5e9] border border-[#0ea5e9]/30 px-2 py-0.5 self-start uppercase tracking-wider">
                Leveraged Return
              </span>
            </div>

            {/* Free Cash Flow Surplus */}
            <div className="p-4 border border-[#222222] bg-black flex flex-col justify-between space-y-3">
              <div>
                <span className="font-mono text-[9px] text-[#888] block uppercase tracking-wider">Net Free Cash Flow</span>
                <span className={`text-2xl font-bold tracking-tight font-mono ${financials.preTaxCashFlow >= 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                  ${Math.round(financials.preTaxCashFlow).toLocaleString()}
                </span>
              </div>
              <span className="font-mono text-[8px] text-[#444] uppercase tracking-wider block">
                Post-Debt Service Surplus / Year
              </span>
            </div>
          </div>

          {/* Sources and Uses Horizontal Split Bar */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-[#888] uppercase tracking-widest">
              CAPITAL STACK DISTRIBUTION // SOURCES &amp; USES
            </h4>
            <div className="w-full h-8 flex border border-[#222222] font-mono text-[10px] overflow-hidden">
              {/* SBA Debt Section */}
              {seniorDebtPct > 0 && (
                <div 
                  style={{ width: `${seniorDebtPct}%` }}
                  className="bg-[#00FF66]/25 border-r border-[#222222] flex items-center justify-center text-[#00FF66] font-bold transition-all relative group"
                >
                  <span className="truncate px-1">SBA Senior: {seniorDebtPct}%</span>
                </div>
              )}
              {/* Seller Note Section */}
              {state.sellerNotePct > 0 && (
                <div 
                  style={{ width: `${state.sellerNotePct}%` }}
                  className="bg-[#FFC000]/20 border-r border-[#222222] flex items-center justify-center text-[#FFC000] font-bold transition-all relative group"
                >
                  <span className="truncate px-1">Seller: {state.sellerNotePct}%</span>
                </div>
              )}
              {/* Equity Section */}
              {state.equityPct > 0 && (
                <div 
                  style={{ width: `${state.equityPct}%` }}
                  className="bg-[#0EA5E9]/20 flex items-center justify-center text-[#0EA5E9] font-bold transition-all relative group"
                >
                  <span className="truncate px-1">Equity: {state.equityPct}%</span>
                </div>
              )}
            </div>
            {/* Legend detailing raw values */}
            <div className="grid grid-cols-3 gap-2 font-mono text-[9px] text-[#888]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-[#00FF66]/40 inline-block"></span>
                <span>SBA Debt: ${financials.sDebtAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-[#FFC000]/40 inline-block"></span>
                <span>Seller Carry: ${financials.sellerNoteAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-[#0EA5E9]/40 inline-block"></span>
                <span>Equity Outlay: ${financials.equityAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* LBO Debt & FCF Waterfall Visualization */}
          <div className="border border-[#222222] bg-black p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
              <h4 className="font-mono text-[10px] text-[#F9F9F9] tracking-wider uppercase">
                PRE-TAX EBITDA WATERFALL MODEL (Y1)
              </h4>
              <span className="font-mono text-[9px] text-[#444]">REPRESENTING YEAR-1 OPERATIONS</span>
            </div>

            {/* Simulated Waterfall Progress Bars */}
            <div className="space-y-4 font-mono text-xs">
              
              {/* Step 1: Starting EBITDA */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#888]">01. OPERATING EBITDA (BASELINE)</span>
                  <span className="text-[#00FF66] font-bold">${state.ebitda.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-[#222222]/30">
                  <div className="h-full bg-[#00FF66] transition-all duration-300" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Step 2: Senior SBA Debt Service */}
              {financials.seniorDebtService > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#888]">02. LESS: SBA 7(a) DEBT SERVICE</span>
                    <span className="text-[#FF3333]">-${Math.round(financials.seniorDebtService).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-[#222222]/30">
                    <div 
                      className="h-full bg-[#FF3333]/80 transition-all duration-300" 
                      style={{ width: `${Math.max(0, 100 - (financials.seniorDebtService / state.ebitda) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Step 3: Seller Standby Debt Service */}
              {financials.sellerDebtService > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#888]">03. LESS: SELLER NOTE DEBT SERVICE</span>
                    <span className="text-[#FF3333]">-${Math.round(financials.sellerDebtService).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-[#222222]/30">
                    <div 
                      className="h-full bg-[#FFC000]/80 transition-all duration-300" 
                      style={{ 
                        width: `${Math.max(0, 100 - ((financials.seniorDebtService + financials.sellerDebtService) / state.ebitda) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Step 4: Maintenance CapEx Allocation */}
              {financials.capexReserve > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#888]">04. LESS: MAINTENANCE CAPEX RESERVE</span>
                    <span className="text-neutral-500">-${Math.round(financials.capexReserve).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-[#222222]/30">
                    <div 
                      className="h-full bg-neutral-600 transition-all duration-300" 
                      style={{ 
                        width: `${Math.max(0, 100 - ((financials.seniorDebtService + financials.sellerDebtService + financials.capexReserve) / state.ebitda) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Step 5: Net Free Cash Flow Final Output */}
              <div className="pt-2 border-t border-[#1a1a1a] flex justify-between items-center">
                <span className="text-[#888] font-bold text-[10px]">PRE-TAX FREE CASH FLOW (FCF) SURPLUS:</span>
                <span className={`text-sm font-extrabold px-2 py-0.5 ${financials.preTaxCashFlow >= 0 ? 'bg-[#00FF66]/10 text-[#00FF66]' : 'bg-[#FF3333]/10 text-[#FF3333]'}`}>
                  ${Math.round(financials.preTaxCashFlow).toLocaleString()} / Year
                </span>
              </div>

            </div>
          </div>

          {/* Underwriting Safe harbor Guidelines */}
          <div className="bg-[#111] p-3.5 border border-[#222222] text-[10px] font-mono text-[#666666] leading-relaxed">
            <span className="text-amber-500 font-bold block uppercase mb-1">🚨 LBO Underwriting Safety Notice:</span>
            Most SBA preferred lenders require a minimum debt service coverage ratio (DSCR) of 1.15x to 1.25x. Interest rates simulate current prevailing Wall Street Journal Prime Rate + local variable spreads. Amortization parameters adjust real-time.
          </div>

        </div>
      </div>
    </div>
  );
}