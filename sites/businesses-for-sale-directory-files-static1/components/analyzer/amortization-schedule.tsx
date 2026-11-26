import React, { useState, useMemo } from 'react';

// Live interactive LBO Structural Analyzer & Debt Sandbox
export default function AmortizationSchedule() {
  // LBO Sandbox Input States
  const [purchasePrice, setPurchasePrice] = useState<number>(3500000);
  const [ebitda, setEbitda] = useState<number>(950000);
  const [sbaPercent, setSbaPercent] = useState<number>(75);
  const [sbaInterest, setSbaInterest] = useState<number>(10.5);
  const [sbaTerm, setSbaTerm] = useState<number>(10);

  const [sellerPercent, setSellerPercent] = useState<number>(10);
  const [sellerInterest, setSellerInterest] = useState<number>(8.0);
  const [sellerTerm, setSellerTerm] = useState<number>(5);
  const [sellerIO, setSellerIO] = useState<boolean>(false); // Interest-Only toggle

  const [mezzPercent, setMezzPercent] = useState<number>(5);
  const [mezzInterest, setMezzInterest] = useState<number>(14.0);
  const [mezzTerm, setMezzTerm] = useState<number>(7);

  // Selected view tab: 'metrics' | 'schedule' | 'matrix'
  const [activeTab, setActiveTab] = useState<'metrics' | 'schedule' | 'matrix'>('metrics');

  // Format Helper
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Capital Structure Computations
  const caps = useMemo(() => {
    const sbaLoan = Math.max(0, purchasePrice * (sbaPercent / 100));
    const sellerLoan = Math.max(0, purchasePrice * (sellerPercent / 100));
    const mezzLoan = Math.max(0, purchasePrice * (mezzPercent / 100));
    
    const combinedDebt = sbaLoan + sellerLoan + mezzLoan;
    const equityRequired = Math.max(0, purchasePrice - combinedDebt);
    const leverageRatio = combinedDebt / (ebitda || 1);

    // Amortization formulas
    const calcAnnualPMT = (principal: number, annualRate: number, termYears: number, isIO: boolean = false) => {
      if (principal <= 0) return 0;
      const r = annualRate / 100;
      if (isIO) return principal * r;
      if (r === 0) return principal / termYears;
      // Monthly compounding standard translated to annual aggregated PMT
      const monthlyRate = r / 12;
      const totalMonths = termYears * 12;
      const monthlyPmt = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                         (Math.pow(1 + monthlyRate, totalMonths) - 1);
      return monthlyPmt * 12;
    };

    const sbaAnnualPmt = calcAnnualPMT(sbaLoan, sbaInterest, sbaTerm);
    const sellerAnnualPmt = calcAnnualPMT(sellerLoan, sellerInterest, sellerTerm, sellerIO);
    const mezzAnnualPmt = calcAnnualPMT(mezzLoan, mezzInterest, mezzTerm);

    const totalDebtService = sbaAnnualPmt + sellerAnnualPmt + mezzAnnualPmt;
    const dscr = totalDebtService > 0 ? ebitda / totalDebtService : 99.9;
    const debtYield = ebitda / (combinedDebt || 1);
    
    const freeCashFlow = ebitda - totalDebtService;
    const cashOnCash = equityRequired > 0 ? (freeCashFlow / equityRequired) * 100 : 0;

    return {
      sbaLoan,
      sellerLoan,
      mezzLoan,
      combinedDebt,
      equityRequired,
      leverageRatio,
      sbaAnnualPmt,
      sellerAnnualPmt,
      mezzAnnualPmt,
      totalDebtService,
      dscr,
      debtYield,
      freeCashFlow,
      cashOnCash,
    };
  }, [purchasePrice, ebitda, sbaPercent, sbaInterest, sbaTerm, sellerPercent, sellerInterest, sellerTerm, sellerIO, mezzPercent, mezzInterest, mezzTerm]);

  // Compute Year-by-Year Amortization Schedule
  const scheduleData = useMemo(() => {
    const maxYears = Math.max(sbaTerm, sellerTerm, mezzTerm, 10);
    const rows = [];
    
    let sbaBal = caps.sbaLoan;
    let sellerBal = caps.sellerLoan;
    let mezzBal = caps.mezzLoan;

    for (let year = 1; year <= maxYears; year++) {
      // SBA Schedule
      let sbaInterestPaid = 0;
      let sbaPrincipalPaid = 0;
      if (sbaBal > 0 && year <= sbaTerm) {
        sbaInterestPaid = sbaBal * (sbaInterest / 100);
        sbaPrincipalPaid = Math.min(sbaBal, caps.sbaAnnualPmt - sbaInterestPaid);
        sbaBal -= sbaPrincipalPaid;
      }

      // Seller Note Schedule
      let sellerInterestPaid = 0;
      let sellerPrincipalPaid = 0;
      if (sellerBal > 0 && year <= sellerTerm) {
        sellerInterestPaid = sellerBal * (sellerInterest / 100);
        if (sellerIO) {
          // If interest-only, final year pays principal balloon
          sellerPrincipalPaid = year === sellerTerm ? sellerBal : 0;
        } else {
          sellerPrincipalPaid = Math.min(sellerBal, caps.sellerAnnualPmt - sellerInterestPaid);
        }
        sellerBal -= sellerPrincipalPaid;
      }

      // Mezzanine Schedule
      let mezzInterestPaid = 0;
      let mezzPrincipalPaid = 0;
      if (mezzBal > 0 && year <= mezzTerm) {
        mezzInterestPaid = mezzBal * (mezzInterest / 100);
        mezzPrincipalPaid = Math.min(mezzBal, caps.mezzAnnualPmt - mezzInterestPaid);
        mezzBal -= mezzPrincipalPaid;
      }

      const yearTotalPmt = (sbaPrincipalPaid + sbaInterestPaid) + 
                            (sellerPrincipalPaid + sellerInterestPaid) + 
                            (mezzPrincipalPaid + mezzInterestPaid);

      const endingDebt = Math.max(0, sbaBal + sellerBal + mezzBal);

      rows.push({
        year,
        sbaPmt: sbaPrincipalPaid + sbaInterestPaid,
        sellerPmt: sellerPrincipalPaid + sellerInterestPaid,
        mezzPmt: mezzPrincipalPaid + mezzInterestPaid,
        totalPmt: yearTotalPmt,
        endingDebt,
      });
    }
    return rows;
  }, [caps, sbaTerm, sellerTerm, mezzTerm, sbaInterest, sellerInterest, sellerIO, mezzInterest]);

  // Sensitivity Matrix Calculations (EBITDA Change vs. Leverage Level on Cash on Cash Return)
  const sensitivityMatrix = useMemo(() => {
    const priceLevels = [0.9, 1.0, 1.1]; // Purchase Multiple / Price Variance
    const ebitdaLevels = [0.85, 1.0, 1.15]; // Operational Underperformance / Overperformance

    return priceLevels.map((priceMult) => {
      return ebitdaLevels.map((ebitdaMult) => {
        const adjustedPrice = purchasePrice * priceMult;
        const adjustedEbitda = ebitda * ebitdaMult;

        const sbaLoan = adjustedPrice * (sbaPercent / 100);
        const sellerLoan = adjustedPrice * (sellerPercent / 100);
        const mezzLoan = adjustedPrice * (mezzPercent / 100);
        const equity = Math.max(0, adjustedPrice - sbaLoan - sellerLoan - mezzLoan);

        const calcAnnualPMT = (principal: number, annualRate: number, termYears: number, isIO: boolean = false) => {
          if (principal <= 0) return 0;
          const r = annualRate / 100;
          if (isIO) return principal * r;
          const monthlyRate = r / 12;
          const totalMonths = termYears * 12;
          const monthlyPmt = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                             (Math.pow(1 + monthlyRate, totalMonths) - 1);
          return monthlyPmt * 12;
        };

        const totalDebtSvc = calcAnnualPMT(sbaLoan, sbaInterest, sbaTerm) +
                             calcAnnualPMT(sellerLoan, sellerInterest, sellerTerm, sellerIO) +
                             calcAnnualPMT(mezzLoan, mezzInterest, mezzTerm);

        const fcf = adjustedEbitda - totalDebtSvc;
        const coc = equity > 0 ? (fcf / equity) * 100 : 0;
        const dscr = totalDebtSvc > 0 ? adjustedEbitda / totalDebtSvc : 99.9;

        return {
          priceLabel: `${Math.round(priceMult * 100)}% Price`,
          ebitdaLabel: `${Math.round(ebitdaMult * 100)}% EBITDA`,
          coc,
          dscr,
        };
      });
    });
  }, [purchasePrice, ebitda, sbaPercent, sbaInterest, sbaTerm, sellerPercent, sellerInterest, sellerTerm, sellerIO, mezzPercent, mezzInterest, mezzTerm]);

  return (
    <div className="w-full bg-[#050505] border border-[#222222] font-mono text-[#F9F9F9] p-4 md:p-6 space-y-6">
      
      {/* 1. Header Terminal Banner */}
      <div className="border-b border-[#222222] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#00FF66] animate-pulse"></span>
            <span className="text-[10px] text-[#0EA5E9] tracking-widest uppercase">// DEBT SANDBOX & PORTFOLIO STRESS MODEL</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white uppercase mt-1">
            LBO STRUCTURAL ANALYZER
          </h2>
        </div>
        <div className="flex items-center space-x-3 text-[10px] bg-[#111111] px-3 py-1.5 border border-[#222222]">
          <span className="text-[#888888]">LEVERAGE THRESHOLDS:</span>
          <span className={caps.leverageRatio > 4.5 ? 'text-[#FF3333] font-bold' : 'text-[#00FF66] font-bold'}>
            {(caps.leverageRatio).toFixed(2)}x Debt/EBITDA
          </span>
        </div>
      </div>

      {/* 2. Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Acquisition & Debt Structure Configuration Inputs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section: Deal Dimensions */}
          <div className="border border-[#222222] bg-[#0c0c0c] p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs text-[#888888] uppercase">// DEAL METRIC ANCHORS</span>
              <span className="text-[9px] text-[#00FF66]">LIVE MATRIX SYNC</span>
            </div>
            
            {/* Purchase Price Input */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888] uppercase">Purchase Price:</span>
                <span className="text-[#0EA5E9] font-bold">{formatUSD(purchasePrice)}</span>
              </div>
              <input 
                type="range"
                min="500000"
                max="10000000"
                step="50000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full accent-[#0EA5E9] bg-[#050505] h-1"
              />
              <div className="flex justify-between text-[8px] text-[#888888]">
                <span>$500K</span>
                <span>$10M</span>
              </div>
            </div>

            {/* Business EBITDA Input */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888] uppercase">Target EBITDA (TTM):</span>
                <span className="text-[#00FF66] font-bold">{formatUSD(ebitda)}</span>
              </div>
              <input 
                type="range"
                min="100000"
                max="3000000"
                step="25000"
                value={ebitda}
                onChange={(e) => setEbitda(Number(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#050505] h-1"
              />
              <div className="flex justify-between text-[8px] text-[#888888]">
                <span>$100K</span>
                <span>$3.0M</span>
              </div>
            </div>
          </div>

          {/* Section: Debt Tranche Sliders */}
          <div className="border border-[#222222] bg-[#0c0c0c] p-4 space-y-6">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs text-[#888888] uppercase">// CAPITAL STRUCTURE RATIOS</span>
              <span className={`text-[10px] px-1.5 py-0.5 border ${sbaPercent + sellerPercent + mezzPercent > 90 ? 'border-[#FF3333] text-[#FF3333] bg-[#ff3333]/5' : 'border-[#222222] text-[#888888]'}`}>
                {sbaPercent + sellerPercent + mezzPercent}% LEVERAGE
              </span>
            </div>

            {/* Tranche 1: SBA 7a */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-white font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#00FF66] block"></span>
                  SBA 7(a) LOAN
                </span>
                <span className="text-xs text-[#00FF66]">{sbaPercent}% ({formatUSD(caps.sbaLoan)})</span>
              </div>
              <input 
                type="range"
                min="0"
                max="90"
                step="5"
                value={sbaPercent}
                onChange={(e) => setSbaPercent(Number(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#050505] h-1"
              />
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex flex-col bg-[#050505] p-1.5 border border-[#222222] text-[10px]">
                  <span className="text-[#888888]">INTEREST RATE</span>
                  <input 
                    type="number"
                    step="0.25"
                    value={sbaInterest}
                    onChange={(e) => setSbaInterest(Number(e.target.value))}
                    className="bg-transparent border-none text-[#00FF66] font-bold focus:outline-none focus:ring-0 mt-0.5"
                  />
                </div>
                <div className="flex flex-col bg-[#050505] p-1.5 border border-[#222222] text-[10px]">
                  <span className="text-[#888888]">TERM YEARS</span>
                  <input 
                    type="number"
                    value={sbaTerm}
                    onChange={(e) => setSbaTerm(Number(e.target.value))}
                    className="bg-transparent border-none text-[#F9F9F9] font-bold focus:outline-none focus:ring-0 mt-0.5"
                  />
                </div>
              </div>
            </div>

            {/* Tranche 2: Seller Note */}
            <div className="space-y-2 pt-2 border-t border-[#222222]/50">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-white font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#0EA5E9] block"></span>
                  SELLER STRETCH NOTE
                </span>
                <span className="text-xs text-[#0EA5E9]">{sellerPercent}% ({formatUSD(caps.sellerLoan)})</span>
              </div>
              <input 
                type="range"
                min="0"
                max="30"
                step="2.5"
                value={sellerPercent}
                onChange={(e) => setSellerPercent(Number(e.target.value))}
                className="w-full accent-[#0EA5E9] bg-[#050505] h-1"
              />
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className="flex flex-col bg-[#050505] p-1.5 border border-[#222222] text-[10px]">
                  <span className="text-[#888888]">INTEREST</span>
                  <input 
                    type="number"
                    step="0.25"
                    value={sellerInterest}
                    onChange={(e) => setSellerInterest(Number(e.target.value))}
                    className="bg-transparent border-none text-[#0EA5E9] font-bold focus:outline-none focus:ring-0 mt-0.5"
                  />
                </div>
                <div className="flex flex-col bg-[#050505] p-1.5 border border-[#222222] text-[10px]">
                  <span className="text-[#888888]">TERM (YRS)</span>
                  <input 
                    type="number"
                    value={sellerTerm}
                    onChange={(e) => setSellerTerm(Number(e.target.value))}
                    className="bg-transparent border-none text-[#F9F9F9] font-bold focus:outline-none focus:ring-0 mt-0.5"
                  />
                </div>
                <div className="flex flex-col justify-center items-center bg-[#050505] p-1.5 border border-[#222222] text-[10px]">
                  <span className="text-[#888888] text-[9px] uppercase">INT-ONLY</span>
                  <button 
                    onClick={() => setSellerIO(!sellerIO)}
                    className={`mt-1 text-[9px] px-1.5 py-0.5 border font-bold ${sellerIO ? 'border-[#00FF66] text-[#00FF66] bg-[#00ff66]/10' : 'border-[#222222] text-[#888888]'}`}
                  >
                    {sellerIO ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>

            {/* Tranche 3: Mezzanine Debt */}
            <div className="space-y-2 pt-2 border-t border-[#222222]/50">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-white font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#FF3333] block"></span>
                  MEZZANINE / SUB-DEBT
                </span>
                <span className="text-xs text-[#FF3333]">{mezzPercent}% ({formatUSD(caps.mezzLoan)})</span>
              </div>
              <input 
                type="range"
                min="0"
                max="20"
                step="2.5"
                value={mezzPercent}
                onChange={(e) => setMezzPercent(Number(e.target.value))}
                className="w-full accent-[#FF3333] bg-[#050505] h-1"
              />
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex flex-col bg-[#050505] p-1.5 border border-[#222222] text-[10px]">
                  <span className="text-[#888888]">INTEREST RATE</span>
                  <input 
                    type="number"
                    step="0.5"
                    value={mezzInterest}
                    onChange={(e) => setMezzInterest(Number(e.target.value))}
                    className="bg-transparent border-none text-[#FF3333] font-bold focus:outline-none focus:ring-0 mt-0.5"
                  />
                </div>
                <div className="flex flex-col bg-[#050505] p-1.5 border border-[#222222] text-[10px]">
                  <span className="text-[#888888]">TERM YEARS</span>
                  <input 
                    type="number"
                    value={mezzTerm}
                    onChange={(e) => setMezzTerm(Number(e.target.value))}
                    className="bg-transparent border-none text-[#F9F9F9] font-bold focus:outline-none focus:ring-0 mt-0.5"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Output Dashboards, Live Projections & Matrix */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          
          {/* Tab Selection Header */}
          <div className="flex border border-[#222222] bg-[#0a0a0a]">
            <button 
              onClick={() => setActiveTab('metrics')}
              className={`flex-1 text-center py-2.5 text-xs font-bold border-r border-[#222222] uppercase tracking-wider transition-colors ${activeTab === 'metrics' ? 'bg-[#00FF66] text-black' : 'text-[#888888] hover:text-white'}`}
            >
              [ LIVE DEBT FEASIBILITY ]
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 text-center py-2.5 text-xs font-bold border-r border-[#222222] uppercase tracking-wider transition-colors ${activeTab === 'schedule' ? 'bg-[#00FF66] text-black' : 'text-[#888888] hover:text-white'}`}
            >
              [ AMORTIZATION MATRIX ]
            </button>
            <button 
              onClick={() => setActiveTab('matrix')}
              className={`flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'matrix' ? 'bg-[#00FF66] text-black' : 'text-[#888888] hover:text-white'}`}
            >
              [ STRESS TEST MODEL ]
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-grow border border-[#222222] bg-[#080808] p-4 md:p-6 flex flex-col justify-between">
            
            {activeTab === 'metrics' && (
              <div className="space-y-6">
                
                {/* 1. DSCR High-Visibility Gauge */}
                <div className="border border-[#222222] bg-[#0c0c0c] p-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="text-[10px] text-[#888888] uppercase block tracking-widest">// MODEL FEASIBILITY INDICATOR</span>
                    <span className="text-xs text-white block">DEBT SERVICE COVERAGE RATIO (DSCR)</span>
                    <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                      <span className={`text-4xl font-bold font-mono tracking-tight ${caps.dscr >= 1.50 ? 'text-[#00FF66]' : caps.dscr >= 1.25 ? 'text-[#0EA5E9]' : 'text-[#FF3333]'}`}>
                        {caps.dscr.toFixed(2)}x
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 border font-bold ${caps.dscr >= 1.50 ? 'border-[#00FF66] text-[#00FF66] bg-[#00ff66]/5' : caps.dscr >= 1.25 ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-[#FF3333] text-[#FF3333] bg-[#ff3333]/5'}`}>
                        {caps.dscr >= 1.50 ? 'EXCELLENT LENDER SCORE' : caps.dscr >= 1.25 ? 'SBA THRESHOLD MET' : 'CRITICAL UNDERFLOW RISK'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Circular/Semi Dial Visual Simulation */}
                  <div className="relative w-28 h-14 overflow-hidden flex flex-col items-center justify-end border-b border-[#222222]">
                    <div className="absolute top-0 w-28 h-28 border-8 border-dashed rounded-full border-[#111111] pointer-events-none"></div>
                    <div className={`absolute top-0 w-28 h-28 border-8 rounded-full pointer-events-none transition-all duration-300 ${caps.dscr >= 1.50 ? 'border-[#00FF66]' : caps.dscr >= 1.25 ? 'border-[#0EA5E9]' : 'border-[#FF3333]'}`}
                         style={{ transform: `rotate(${Math.min(180, (caps.dscr / 2) * 180)}deg)` }}>
                    </div>
                    <span className="text-[9px] text-[#888888] uppercase mb-1">DSCR METER</span>
                  </div>
                </div>

                {/* 2. Structured Outputs List */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border border-[#222222] bg-[#0c0c0c] p-3 text-center sm:text-left">
                    <span className="text-[9px] text-[#888888] block">EQUITY REQ.</span>
                    <span className="text-base font-bold text-white">{formatUSD(caps.equityRequired)}</span>
                    <span className="text-[9px] text-[#888888] block mt-1">({Math.round((caps.equityRequired/purchasePrice)*100)}% of Purchase)</span>
                  </div>
                  <div className="border border-[#222222] bg-[#0c0c0c] p-3 text-center sm:text-left">
                    <span className="text-[9px] text-[#888888] block">COMBINED LEVERAGE</span>
                    <span className="text-base font-bold text-white">{formatUSD(caps.combinedDebt)}</span>
                    <span className="text-[9px] text-[#888888] block mt-1">({sbaPercent + sellerPercent + mezzPercent}% Leverage)</span>
                  </div>
                  <div className="border border-[#222222] bg-[#0c0c0c] p-3 text-center sm:text-left">
                    <span className="text-[9px] text-[#888888] block">ANNUAL DEBT SERVICE</span>
                    <span className="text-base font-bold text-[#FF3333]">{formatUSD(caps.totalDebtService)}</span>
                    <span className="text-[9px] text-[#888888] block mt-1">Combined Tranches</span>
                  </div>
                  <div className="border border-[#222222] bg-[#0c0c0c] p-3 text-center sm:text-left">
                    <span className="text-[9px] text-[#888888] block">POST-DEBT CASH FLOW</span>
                    <span className="text-base font-bold text-[#00FF66]">{formatUSD(caps.freeCashFlow)}</span>
                    <span className="text-[9px] text-[#888888] block mt-1">Cash-on-Cash: {caps.cashOnCash.toFixed(1)}%</span>
                  </div>
                </div>

                {/* 3. Asset Modeling Remarks */}
                <div className="border border-[#222222] p-4 bg-[#050505] space-y-2">
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block">// REAL-TIME DIAGNOSTIC RE-CALCULATION</span>
                  <ul className="text-[11px] text-[#888888] space-y-1.5 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#00FF66] font-bold">»</span>
                      <span>SBA 7(a) loan structure is evaluated dynamically on standard 10-year monthly amortizing rules. Minimum acceptable bank DSCR benchmark is <span className="text-white font-bold">1.25x</span>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0EA5E9] font-bold">»</span>
                      <span>Seller notes with <span className="text-white">Interest-Only</span> terms buffer early operational transitions, reducing total initial year debt service burden.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF3333] font-bold">»</span>
                      <span>Estimated operational buffer to cover debt default: <span className="text-white font-bold">{Math.max(0, (1 - (1/caps.dscr)) * 100).toFixed(1)}%</span> reduction in TTM EBITDA before cash flow breaches structural requirements.</span>
                    </li>
                  </ul>
                </div>

              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <span className="text-[10px] text-[#888888] uppercase block tracking-widest">// YEAR-BY-YEAR AMORTIZATION & DEBT REPAYMENT GRID</span>
                
                <div className="overflow-x-auto border border-[#222222]">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-[#222222] bg-[#0c0c0c]">
                        <th className="p-2 text-[#888888]">YEAR</th>
                        <th className="p-2 text-[#00FF66] text-right">SBA PAYMENT</th>
                        <th className="p-2 text-[#0EA5E9] text-right">SELLER PMT</th>
                        <th className="p-2 text-[#FF3333] text-right">MEZZ PMT</th>
                        <th className="p-2 text-white text-right font-bold">TOTAL PMT</th>
                        <th className="p-2 text-[#888888] text-right">ENDING DEBT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleData.map((row) => (
                        <tr key={row.year} className="border-b border-[#222222]/50 hover:bg-[#0c0c0c]/50">
                          <td className="p-2 font-bold text-white">Year {row.year}</td>
                          <td className="p-2 text-right text-[#00FF66]">{formatUSD(row.sbaPmt)}</td>
                          <td className="p-2 text-right text-[#0EA5E9]">{formatUSD(row.sellerPmt)}</td>
                          <td className="p-2 text-right text-[#FF3333]">{formatUSD(row.mezzPmt)}</td>
                          <td className="p-2 text-right text-white font-bold">{formatUSD(row.totalPmt)}</td>
                          <td className="p-2 text-right text-[#888888]">{formatUSD(row.endingDebt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[9px] text-[#888888] italic text-right">
                  *All year amortization tables aggregate compounding monthly payments to simplified annualized schedules.
                </p>
              </div>
            )}

            {activeTab === 'matrix' && (
              <div className="space-y-4">
                <span className="text-[10px] text-[#888888] uppercase block tracking-widest">// OP-PERFORMANCE & PRICE STRESS TESTS (CASH-ON-CASH MATRIX)</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sensitivityMatrix.map((matrixRow, index) => {
                    return (
                      <div key={index} className="border border-[#222222] bg-[#0c0c0c] p-3 space-y-3">
                        <div className="text-xs text-[#0EA5E9] font-bold border-b border-[#222222] pb-1 uppercase">
                          {matrixRow[0].priceLabel}
                        </div>
                        <div className="space-y-2">
                          {matrixRow.map((cell, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                              <span className="text-[#888888]">{cell.ebitdaLabel}:</span>
                              <div className="text-right">
                                <span className={`font-bold block ${cell.coc > 20 ? 'text-[#00FF66]' : cell.coc > 5 ? 'text-[#0EA5E9]' : 'text-[#FF3333]'}`}>
                                  {cell.coc.toFixed(1)}% CoC
                                </span>
                                <span className="text-[8px] text-[#888888]">({cell.dscr.toFixed(2)}x DSCR)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border border-[#FF3333]/30 bg-[#ff3333]/5 p-3 text-[10px] text-[#888888] leading-relaxed">
                  <span className="text-[#FF3333] font-bold uppercase block mb-1">⚠️ LBO VIABILITY NOTICE</span>
                  Leverage strategies amplify risk profiles significantly under localized industry downcycles. Ensure operational margins exceed baseline modeling parameters by safe percentages before locking final tranche parameters.
                </div>
              </div>
            )}

            {/* Bottom Panel Actions / Status Signals */}
            <div className="border-t border-[#222222] pt-4 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-[9px] text-[#888888]">
                *SIMULATION DATA INTEGRATED TO TERMINAL ENGINE
              </span>
              <button 
                onClick={() => alert('Exporting parameters to AcquireMeta structural model... Complete.')}
                className="w-full sm:w-auto text-xs text-black bg-[#00FF66] hover:bg-black hover:text-[#00FF66] border border-[#00FF66] hover:shadow-[4px_4px_0px_0px_rgba(0,255,102,1)] font-bold px-4 py-2 transition-all duration-200 uppercase tracking-widest text-center"
              >
                APPLY STRUCTURAL STRUCTURE TO DEAL BOARD
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}