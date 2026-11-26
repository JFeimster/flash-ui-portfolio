import React, { useState, useMemo } from 'react';

// Help helper for financial PMT calculations (annualized)
function calculateAnnualDebtService(ratePct: number, termYears: number, principal: number): number {
  if (principal <= 0) return 0;
  const r = (ratePct / 100) / 12;
  const n = termYears * 12;
  if (r === 0) return principal / termYears;
  const monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return monthly * 12;
}

export default function LboSensitivityMatrix() {
  // 1. Core Deal Valuation parameters
  const [purchasePrice, setPurchasePrice] = useState<number>(2500000);
  const [ebitda, setEbitda] = useState<number>(650000);

  // 2. Debt Capital Stack Allocations
  const [sbaLeveragePct, setSbaLeveragePct] = useState<number>(75);
  const [sbaInterestRate, setSbaInterestRate] = useState<number>(10.5);
  const [sbaTermYears] = useState<number>(10); // Standard SBA 7a limit

  const [sellerNotePct, setSellerNotePct] = useState<number>(15);
  const [sellerNoteRate, setSellerNoteRate] = useState<number>(8.0);
  const [sellerNoteTerm, setSellerNoteTerm] = useState<number>(5);
  const [sellerNoteInterestOnly, setSellerNoteInterestOnly] = useState<boolean>(true);

  const [mezzaninePct, setMezzaninePct] = useState<number>(0);
  const [mezzanineRate, setMezzanineRate] = useState<number>(14.0);

  // 3. Matrix View Mode Settings
  const [matrixTarget, setMatrixTarget] = useState<'DSCR' | 'CASH_ON_CASH'>('DSCR');
  const [selectedXMetric, setSelectedXMetric] = useState<'EBITDA_FLUCTUATION' | 'SBA_RATE_SHIFT'>('EBITDA_FLUCTUATION');

  // Formatter Utility
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Capital Stack & Balance Computations
  const stackSummary = useMemo(() => {
    const sbaPrincipal = Math.round(purchasePrice * (sbaLeveragePct / 100));
    const sellerNotePrincipal = Math.round(purchasePrice * (sellerNotePct / 100));
    const mezzaninePrincipal = Math.round(purchasePrice * (mezzaninePct / 100));
    
    // Remaining balance is equity cash requirement
    const calculatedEquity = purchasePrice - sbaPrincipal - sellerNotePrincipal - mezzaninePrincipal;
    const equityCash = calculatedEquity > 0 ? calculatedEquity : 0;
    const totalAllocatedPct = sbaLeveragePct + sellerNotePct + mezzaninePct;
    const isOverAllocated = totalAllocatedPct > 100;

    // Debt Service Outputs
    const sbaAnnualDebt = calculateAnnualDebtService(sbaInterestRate, sbaTermYears, sbaPrincipal);
    
    let sellerNoteAnnualDebt = 0;
    if (sellerNoteInterestOnly) {
      sellerNoteAnnualDebt = sellerNotePrincipal * (sellerNoteRate / 100);
    } else {
      sellerNoteAnnualDebt = calculateAnnualDebtService(sellerNoteRate, sellerNoteTerm, sellerNotePrincipal);
    }

    const mezzanineAnnualDebt = mezzaninePrincipal * (mezzanineRate / 100); // Mezzanine treated interest-only

    const totalAnnualDebt = sbaAnnualDebt + sellerNoteAnnualDebt + mezzanineAnnualDebt;
    const dscr = totalAnnualDebt > 0 ? ebitda / totalAnnualDebt : 0;
    const postDebtCashFlow = ebitda - totalAnnualDebt;
    const cashOnCash = equityCash > 0 ? (postDebtCashFlow / equityCash) * 100 : 0;

    return {
      sbaPrincipal,
      sellerNotePrincipal,
      mezzaninePrincipal,
      equityCash,
      isOverAllocated,
      totalAllocatedPct,
      sbaAnnualDebt,
      sellerNoteAnnualDebt,
      mezzanineAnnualDebt,
      totalAnnualDebt,
      dscr,
      postDebtCashFlow,
      cashOnCash,
    };
  }, [
    purchasePrice,
    ebitda,
    sbaLeveragePct,
    sbaInterestRate,
    sbaTermYears,
    sellerNotePct,
    sellerNoteRate,
    sellerNoteTerm,
    sellerNoteInterestOnly,
    mezzaninePct,
    mezzanineRate,
  ]);

  // Generate Matrix data dynamically
  const matrixData = useMemo(() => {
    // Row dimension: Purchase Multiples (e.g., -1.0x to +1.0x of baseline multiple)
    const baseMultiple = purchasePrice / ebitda;
    const multiples = [
      baseMultiple - 0.8,
      baseMultiple - 0.4,
      baseMultiple,
      baseMultiple + 0.4,
      baseMultiple + 0.8,
    ].map(m => Math.max(1.5, m));

    // Column dimension: EBITDA Fluctuation or SBA Interest Rate shift
    let colModifiers: number[] = [];
    if (selectedXMetric === 'EBITDA_FLUCTUATION') {
      colModifiers = [-20, -10, 0, 10, 20]; // Percentage deviations in EBITDA
    } else {
      colModifiers = [-2.0, -1.0, 0, +1.0, +2.0]; // Percentage point deviations in Interest Rate
    }

    return {
      multiples,
      cols: colModifiers,
      grid: multiples.map(mult => {
        return colModifiers.map(colVal => {
          // Calculate theoretical operational parameters for this coordinate
          const cellPurchasePrice = ebitda * mult;
          
          let cellEbitda = ebitda;
          let cellSbaRate = sbaInterestRate;

          if (selectedXMetric === 'EBITDA_FLUCTUATION') {
            cellEbitda = ebitda * (1 + colVal / 100);
          } else {
            cellSbaRate = Math.max(4.0, sbaInterestRate + colVal);
          }

          // Compute dynamic capital stack at this pricing point
          const cellSbaPrincipal = cellPurchasePrice * (sbaLeveragePct / 100);
          const cellSellerPrincipal = cellPurchasePrice * (sellerNotePct / 100);
          const cellMezzPrincipal = cellPurchasePrice * (mezzaninePct / 100);
          const cellEquity = Math.max(0, cellPurchasePrice - cellSbaPrincipal - cellSellerPrincipal - cellMezzPrincipal);

          // Debt Service
          const cellSbaDebt = calculateAnnualDebtService(cellSbaRate, sbaTermYears, cellSbaPrincipal);
          const cellSellerDebt = sellerNoteInterestOnly
            ? cellSellerPrincipal * (sellerNoteRate / 100)
            : calculateAnnualDebtService(sellerNoteRate, sellerNoteTerm, cellSellerPrincipal);
          const cellMezzDebt = cellMezzPrincipal * (mezzanineRate / 100);

          const cellTotalDebt = cellSbaDebt + cellSellerDebt + cellMezzDebt;
          const cellDscr = cellTotalDebt > 0 ? cellEbitda / cellTotalDebt : 99;
          const cellFcf = cellEbitda - cellTotalDebt;
          const cellCoC = cellEquity > 0 ? (cellFcf / cellEquity) * 100 : 0;

          return {
            multiple: mult,
            modifier: colVal,
            dscr: cellDscr,
            cashOnCash: cellCoC,
            purchasePrice: cellPurchasePrice,
          };
        });
      }),
    };
  }, [
    purchasePrice,
    ebitda,
    sbaLeveragePct,
    sbaInterestRate,
    sbaTermYears,
    sellerNotePct,
    sellerNoteRate,
    sellerNoteTerm,
    sellerNoteInterestOnly,
    mezzaninePct,
    mezzanineRate,
    selectedXMetric,
  ]);

  return (
    <div className="bg-[#050505] border border-[#222222] text-[#F9F9F9] font-mono p-6 space-y-6">
      
      {/* 1. Header with simulation active pulse */}
      <div className="border-b border-[#222222] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
            <span className="text-xs text-[#0EA5E9] tracking-[0.2em] font-bold uppercase">// LBO SENSITIVITY SYSTEM v2.0</span>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#F9F9F9] mt-1">
            Debt Sandbox &amp; Coverage Simulator
          </h2>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] bg-[#111111] border border-[#222222] text-[#888888] px-2.5 py-1">
            NODE RUNNER: ACTIVE
          </span>
          <span className="text-[10px] bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] px-2.5 py-1">
            SBA COMPLIANT
          </span>
        </div>
      </div>

      {/* 2. Core Interactive Parameter Config Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Purchase Valuation & Core Cap Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#111111] border border-[#222222] p-4 space-y-4">
            <h3 className="text-xs text-[#0EA5E9] font-bold uppercase tracking-wider border-b border-[#222222] pb-2">
              [STEP 1: Base Purchase Metrics]
            </h3>
            
            {/* Purchase Price Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">ENTERPRISE VALUE (ASKING)</span>
                <span className="text-[#F9F9F9] font-bold">{formatCurrency(purchasePrice)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="50000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#050505] h-1"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>$500k</span>
                <span>$10M limit</span>
              </div>
            </div>

            {/* Adjusted EBITDA */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">ADJUSTED TTM EBITDA</span>
                <span className="text-[#00FF66] font-bold">{formatCurrency(ebitda)}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="2500000"
                step="25000"
                value={ebitda}
                onChange={(e) => setEbitda(Number(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#050505] h-1"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>$100k</span>
                <span>$2.5M limit</span>
              </div>
            </div>

            {/* Implied Multiple readout */}
            <div className="flex justify-between text-xs border-t border-[#222222] pt-3 bg-[#050505]/50 p-2 border border-[#222222]/50">
              <span className="text-[#888888]">IMPLIED VALUATION MULTIPLE:</span>
              <span className="text-[#0EA5E9] font-bold">{(purchasePrice / ebitda).toFixed(2)}x EBITDA</span>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#222222] p-4 space-y-4">
            <h3 className="text-xs text-[#0EA5E9] font-bold uppercase tracking-wider border-b border-[#222222] pb-2">
              [STEP 2: Capital Allocation Stack]
            </h3>

            {/* SBA 7a Allocation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">SBA 7(a) PROPOSED LEVERAGE</span>
                <span className="text-[#0EA5E9] font-bold">{sbaLeveragePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={sbaLeveragePct}
                onChange={(e) => setSbaLeveragePct(Number(e.target.value))}
                className="w-full accent-[#0EA5E9] bg-[#050505] h-1"
              />
              <div className="flex justify-between text-[10px] text-[#888888]">
                <span>Rate: {sbaInterestRate}% (10-yr Term)</span>
                <div className="flex items-center space-x-1">
                  <span className="text-[9px]">SBA Int. %</span>
                  <input
                    type="number"
                    step="0.25"
                    min="5"
                    max="15"
                    value={sbaInterestRate}
                    onChange={(e) => setSbaInterestRate(Number(e.target.value))}
                    className="w-12 bg-[#050505] text-xs text-right text-[#00FF66] border border-[#222222] px-1 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Seller Note Allocation */}
            <div className="space-y-1.5 pt-2 border-t border-[#222222]/30">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">SELLER STANDBY NOTE</span>
                <span className="text-[#F9F9F9] font-bold">{sellerNotePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={sellerNotePct}
                onChange={(e) => setSellerNotePct(Number(e.target.value))}
                className="w-full accent-[#0EA5E9] bg-[#050505] h-1"
              />
              <div className="flex justify-between text-[10px] text-[#888888]">
                <div className="flex items-center space-x-2">
                  <span>Rate: {sellerNoteRate}%</span>
                  <button
                    onClick={() => setSellerNoteInterestOnly(!sellerNoteInterestOnly)}
                    className={`text-[9px] border px-1.5 py-0.5 uppercase ${
                      sellerNoteInterestOnly
                        ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66]'
                        : 'border-[#222222] text-[#888888] hover:border-[#0EA5E9]'
                    }`}
                  >
                    {sellerNoteInterestOnly ? 'Interest-Only' : 'Amortizing'}
                  </button>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[9px]">Note Int. %</span>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    max="15"
                    value={sellerNoteRate}
                    onChange={(e) => setSellerNoteRate(Number(e.target.value))}
                    className="w-12 bg-[#050505] text-xs text-right text-[#00FF66] border border-[#222222] px-1 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Mezzanine Allocation (Optional high yield layer) */}
            <div className="space-y-1.5 pt-2 border-t border-[#222222]/30">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">MEZZANINE DEBT / CO-INVEST</span>
                <span className="text-[#FF3333] font-bold">{mezzaninePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={mezzaninePct}
                onChange={(e) => setMezzaninePct(Number(e.target.value))}
                className="w-full accent-[#FF3333] bg-[#050505] h-1"
              />
              <div className="flex justify-between text-[10px] text-[#888888]">
                <span>Interest Only: {mezzanineRate}%</span>
                <div className="flex items-center space-x-1">
                  <span className="text-[9px]">Mezz Int. %</span>
                  <input
                    type="number"
                    step="0.5"
                    min="8"
                    max="20"
                    value={mezzanineRate}
                    onChange={(e) => setMezzanineRate(Number(e.target.value))}
                    className="w-12 bg-[#050505] text-xs text-right text-[#FF3333] border border-[#222222] px-1 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Allocation Alarm Notice */}
            {stackSummary.isOverAllocated && (
              <div className="bg-[#FF3333]/10 border border-[#FF3333] p-2 text-center text-xs text-[#FF3333] animate-pulse">
                CRITICAL WARNING: DEBT ALLOCATION EXCEDEEDS 100% ({stackSummary.totalAllocatedPct}%). ADJUST PARAMETERS.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visual Cascade Stack, Live Guages, Key Performance Metrics */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Visual Capital Stack Bar */}
          <div className="bg-[#111111] border border-[#222222] p-4 space-y-3">
            <span className="text-xs text-[#888888] uppercase block">// Modeled Capital Stack Layering</span>
            <div className="w-full bg-[#050505] h-8 border border-[#222222] flex overflow-hidden">
              {sbaLeveragePct > 0 && (
                <div
                  style={{ width: `${sbaLeveragePct}%` }}
                  className="bg-[#0EA5E9] h-full flex items-center justify-center text-[10px] font-bold text-[#050505]"
                  title={`SBA 7a: ${sbaLeveragePct}%`}
                >
                  {sbaLeveragePct >= 15 ? `SBA: ${sbaLeveragePct}%` : ''}
                </div>
              )}
              {sellerNotePct > 0 && (
                <div
                  style={{ width: `${sellerNotePct}%` }}
                  className="bg-[#00FF66] h-full flex items-center justify-center text-[10px] font-bold text-[#050505]"
                  title={`Seller Note: ${sellerNotePct}%`}
                >
                  {sellerNotePct >= 15 ? `Seller: ${sellerNotePct}%` : ''}
                </div>
              )}
              {mezzaninePct > 0 && (
                <div
                  style={{ width: `${mezzaninePct}%` }}
                  className="bg-[#FF3333] h-full flex items-center justify-center text-[10px] font-bold text-[#F9F9F9]"
                  title={`Mezzanine: ${mezzaninePct}%`}
                >
                  {mezzaninePct >= 15 ? `Mezz: ${mezzaninePct}%` : ''}
                </div>
              )}
              {stackSummary.equityCash > 0 && (
                <div
                  style={{ width: `${100 - stackSummary.totalAllocatedPct}%` }}
                  className="bg-[#F9F9F9] h-full flex items-center justify-center text-[10px] font-bold text-[#050505]"
                  title={`Equity Cash: ${(100 - stackSummary.totalAllocatedPct).toFixed(0)}%`}
                >
                  {100 - stackSummary.totalAllocatedPct >= 15
                    ? `Equity: ${(100 - stackSummary.totalAllocatedPct).toFixed(0)}%`
                    : ''}
                </div>
              )}
            </div>
            
            {/* Legend with monetary values */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-[#0EA5E9] inline-block"></span>
                <span className="text-[#888888]">SBA: <span className="text-[#F9F9F9] font-bold">{formatCurrency(stackSummary.sbaPrincipal)}</span></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-[#00FF66] inline-block"></span>
                <span className="text-[#888888]">Seller: <span className="text-[#F9F9F9] font-bold">{formatCurrency(stackSummary.sellerNotePrincipal)}</span></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-[#FF3333] inline-block"></span>
                <span className="text-[#888888]">Mezz: <span className="text-[#F9F9F9] font-bold">{formatCurrency(stackSummary.mezzaninePrincipal)}</span></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-[#F9F9F9] inline-block"></span>
                <span className="text-[#888888]">Equity: <span className="text-[#F9F9F9] font-bold">{formatCurrency(stackSummary.equityCash)}</span></span>
              </div>
            </div>
          </div>

          {/* Dual Gauges Section: DSCR & Cash-on-Cash */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Live DSCR Gauge Box */}
            <div className="bg-[#111111] border border-[#222222] p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs text-[#888888] uppercase block">// Coverage Viability</span>
                <span className="text-[10px] text-[#888888] block">SBA 7(a) Target Limit: &gt;1.25x</span>
              </div>
              
              <div className="py-4 flex items-baseline space-x-3">
                <span
                  className={`text-4xl font-bold tracking-tight ${
                    stackSummary.dscr >= 1.5
                      ? 'text-[#00FF66]'
                      : stackSummary.dscr >= 1.25
                      ? 'text-[#0EA5E9]'
                      : 'text-[#FF3333]'
                  }`}
                >
                  {stackSummary.dscr.toFixed(2)}x
                </span>
                <span
                  className={`text-xs px-2 py-0.5 border font-bold ${
                    stackSummary.dscr >= 1.5
                      ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5'
                      : stackSummary.dscr >= 1.25
                      ? 'border-[#0EA5E9] text-[#0EA5E9] bg-[#0EA5E9]/5'
                      : 'border-[#FF3333] text-[#FF3333] bg-[#FF3333]/5'
                  }`}
                >
                  {stackSummary.dscr >= 1.5
                    ? 'STRONG DSCR'
                    : stackSummary.dscr >= 1.25
                    ? 'SBA MINIMUM MET'
                    : 'FINANCING REFUSED'}
                </span>
              </div>

              <div className="border-t border-[#222222] pt-2 text-[10px] text-[#888888]">
                Est. Total Annual Debt Service:{' '}
                <span className="text-[#F9F9F9] font-bold">
                  {formatCurrency(stackSummary.totalAnnualDebt)}/yr
                </span>
              </div>
            </div>

            {/* Live Cash-on-Cash Return Yield */}
            <div className="bg-[#111111] border border-[#222222] p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs text-[#888888] uppercase block">// Projected Equity Yield</span>
                <span className="text-[10px] text-[#888888] block">Pre-tax Cash-on-Cash return</span>
              </div>

              <div className="py-4 flex items-baseline space-x-3">
                <span
                  className={`text-4xl font-bold tracking-tight ${
                    stackSummary.cashOnCash >= 25
                      ? 'text-[#00FF66]'
                      : stackSummary.cashOnCash >= 15
                      ? 'text-[#0EA5E9]'
                      : 'text-[#FF3333]'
                  }`}
                >
                  {stackSummary.cashOnCash.toFixed(1)}%
                </span>
                <span
                  className={`text-xs px-2 py-0.5 border font-bold ${
                    stackSummary.cashOnCash >= 25
                      ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5'
                      : stackSummary.cashOnCash >= 15
                      ? 'border-[#0EA5E9] text-[#0EA5E9] bg-[#0EA5E9]/5'
                      : 'border-[#FF3333] text-[#FF3333] bg-[#FF3333]/5'
                  }`}
                >
                  {stackSummary.cashOnCash >= 25 ? 'EXCELLENT' : stackSummary.cashOnCash >= 15 ? 'ACCEPTABLE' : 'SUB-OPTIMAL'}
                </span>
              </div>

              <div className="border-t border-[#222222] pt-2 text-[10px] text-[#888888]">
                Post-Debt Yield FCF:{' '}
                <span className="text-[#00FF66] font-bold">
                  {formatCurrency(stackSummary.postDebtCashFlow)}/yr
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Deep Matrix: What-If Sensitivity Engine */}
      <div className="border border-[#222222] bg-[#111111] p-4 space-y-4">
        
        {/* Matrix Controls Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#222222] pb-3">
          <div>
            <span className="text-xs text-[#0EA5E9] uppercase block font-bold">// SYSTEM CO-VARIANT STRESS MATRIX</span>
            <p className="text-[11px] text-[#888888]">
              Verify modeled results dynamically under structural pricing and operational fluctuations.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Target Select */}
            <div className="flex border border-[#222222] bg-[#050505]">
              <button
                onClick={() => setMatrixTarget('DSCR')}
                className={`text-[10px] font-bold px-3 py-1.5 uppercase transition-all ${
                  matrixTarget === 'DSCR'
                    ? 'bg-[#00FF66] text-[#050505]'
                    : 'text-[#888888] hover:text-[#F9F9F9]'
                }`}
              >
                Model DSCR
              </button>
              <button
                onClick={() => setMatrixTarget('CASH_ON_CASH')}
                className={`text-[10px] font-bold px-3 py-1.5 uppercase transition-all ${
                  matrixTarget === 'CASH_ON_CASH'
                    ? 'bg-[#00FF66] text-[#050505]'
                    : 'text-[#888888] hover:text-[#F9F9F9]'
                }`}
              >
                Model Cash-on-Cash
              </button>
            </div>

            {/* X-Axis Parameter selector */}
            <div className="flex border border-[#222222] bg-[#050505]">
              <button
                onClick={() => setSelectedXMetric('EBITDA_FLUCTUATION')}
                className={`text-[10px] font-bold px-3 py-1.5 uppercase transition-all ${
                  selectedXMetric === 'EBITDA_FLUCTUATION'
                    ? 'bg-[#0EA5E9] text-[#050505]'
                    : 'text-[#888888] hover:text-[#F9F9F9]'
                }`}
              >
                vs EBITDA Volatility
              </button>
              <button
                onClick={() => setSelectedXMetric('SBA_RATE_SHIFT')}
                className={`text-[10px] font-bold px-3 py-1.5 uppercase transition-all ${
                  selectedXMetric === 'SBA_RATE_SHIFT'
                    ? 'bg-[#0EA5E9] text-[#050505]'
                    : 'text-[#888888] hover:text-[#F9F9F9]'
                }`}
              >
                vs Interest Shifts
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Sensitivity Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#222222] bg-[#050505]">
                {/* Top-Left Header indicating dimensions */}
                <th className="p-3 text-[#888888] font-bold border-r border-[#222222]">
                  MULTIPLE (PRICE)
                </th>
                {matrixData.cols.map((colVal, idx) => (
                  <th key={idx} className="p-3 text-center text-[#F9F9F9] font-bold">
                    {selectedXMetric === 'EBITDA_FLUCTUATION'
                      ? `EBITDA: ${colVal >= 0 ? '+' : ''}${colVal}%`
                      : `SBA Rate: ${colVal >= 0 ? '+' : ''}${colVal}%`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixData.grid.map((rowCells, rowIdx) => {
                const targetMultiple = matrixData.multiples[rowIdx];
                return (
                  <tr
                    key={rowIdx}
                    className={`border-b border-[#222222]/50 hover:bg-[#151515] transition-all ${
                      Math.abs(targetMultiple - (purchasePrice / ebitda)) < 0.2
                        ? 'bg-[#00FF66]/5'
                        : ''
                    }`}
                  >
                    {/* Y-Axis Label: Implied Multiple / Purchase Price */}
                    <td className="p-3 font-bold border-r border-[#222222] bg-[#050505]/40 flex flex-col">
                      <span className="text-[#0EA5E9]">{targetMultiple.toFixed(1)}x Multiple</span>
                      <span className="text-[10px] text-[#888888]">
                        {formatCurrency(ebitda * targetMultiple)} Price
                      </span>
                    </td>

                    {/* Sensitivity Value Cells */}
                    {rowCells.map((cell, colIdx) => {
                      const isDscr = matrixTarget === 'DSCR';
                      const val = isDscr ? cell.dscr : cell.cashOnCash;
                      
                      // Formatting cell color thresholds
                      let textColor = 'text-[#F9F9F9]';
                      let bgColor = 'bg-[#050505]';

                      if (isDscr) {
                        if (val >= 1.5) {
                          textColor = 'text-[#00FF66] font-bold';
                        } else if (val >= 1.25) {
                          textColor = 'text-[#0EA5E9]';
                        } else {
                          textColor = 'text-[#FF3333] font-bold animate-pulse';
                          bgColor = 'bg-[#FF3333]/5';
                        }
                      } else {
                        if (val >= 25) {
                          textColor = 'text-[#00FF66] font-bold';
                        } else if (val >= 15) {
                          textColor = 'text-[#0EA5E9]';
                        } else {
                          textColor = 'text-[#FF3333]';
                        }
                      }

                      return (
                        <td
                          key={colIdx}
                          className={`p-3 text-center border-r border-[#222222]/30 last:border-0 ${bgColor}`}
                        >
                          <div className={`text-sm ${textColor}`}>
                            {isDscr ? `${val.toFixed(2)}x` : `${val.toFixed(1)}%`}
                          </div>
                          <div className="text-[8px] text-[#888888] mt-0.5 uppercase">
                            {isDscr
                              ? val >= 1.25
                                ? 'Pass'
                                : 'Fail'
                              : val > 0
                              ? 'Yield'
                              : 'Neg.'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footnote Compliance Diagnostic Warning */}
        <div className="bg-[#050505] border border-[#222222] p-3 text-[10px] text-[#888888] space-y-1">
          <span className="text-[#F9F9F9] font-bold uppercase tracking-wider block">
            // METRIC FOOTNOTE DIAGNOSTICS:
          </span>
          <p>
            * Highlighted line represents baseline structural parameters closest to current target listing inputs. This sensitivity modeling assumes debt structures remain locked through initial standard holding periods. Extreme shifts trigger severe equity capital re-allocations. Use with technical search advisory compliance checklists.
          </p>
        </div>

      </div>

    </div>
  );
}