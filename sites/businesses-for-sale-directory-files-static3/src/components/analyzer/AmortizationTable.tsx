import React, { useState, useMemo } from 'react';

interface AmortizationRow {
  period: number;
  beginningBalance: number;
  payment: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

export default function AmortizationTable() {
  // LBO Configuration States
  const [purchasePrice, setPurchasePrice] = useState<number>(1850000);
  const [ebitda, setEbitda] = useState<number>(620000);
  
  // SBA 7(a) Loan States
  const [sbaPercentage, setSbaPercentage] = useState<number>(75); // 75% of purchase price
  const [sbaRate, setSbaRate] = useState<number>(10.5); // Prime + Spread
  const [sbaTermYears, setSbaTermYears] = useState<number>(10);

  // Seller Standby Note States
  const [sellerNotePercentage, setSellerNotePercentage] = useState<number>(15);
  const [sellerNoteRate, setSellerNoteRate] = useState<number>(8.0);
  const [sellerNoteTermYears, setSellerNoteTermYears] = useState<number>(5);
  const [sellerNoteInterestOnly, setSellerNoteInterestOnly] = useState<boolean>(true);

  // Downside Stress Test States (Revenue/EBITDA haircut)
  const [ebitdaHaircut, setEbitdaHaircut] = useState<number>(20); // 20% downside scenario

  // View Mode: Annual vs Monthly Amortization Table
  const [viewMode, setViewMode] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');

  // Calculated Core Debt Values
  const sbaPrincipal = useMemo(() => (purchasePrice * sbaPercentage) / 100, [purchasePrice, sbaPercentage]);
  const sellerPrincipal = useMemo(() => (purchasePrice * sellerNotePercentage) / 100, [purchasePrice, sellerNotePercentage]);
  const equityRequired = useMemo(() => Math.max(0, purchasePrice - sbaPrincipal - sellerPrincipal), [purchasePrice, sbaPrincipal, sellerPrincipal]);

  // Monthly SBA Payment Calculation (Standard Amortizing)
  const sbaMonthlyPayment = useMemo(() => {
    const monthlyRate = (sbaRate / 100) / 12;
    const numberOfPayments = sbaTermYears * 12;
    if (monthlyRate === 0) return sbaPrincipal / numberOfPayments;
    return (sbaPrincipal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }, [sbaPrincipal, sbaRate, sbaTermYears]);

  // Monthly Seller Note Payment Calculation
  const sellerMonthlyPayment = useMemo(() => {
    const monthlyRate = (sellerNoteRate / 100) / 12;
    const numberOfPayments = sellerNoteTermYears * 12;
    if (sellerNoteInterestOnly) {
      return (sellerPrincipal * (sellerNoteRate / 100)) / 12;
    }
    if (monthlyRate === 0) return sellerPrincipal / numberOfPayments;
    return (sellerPrincipal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }, [sellerPrincipal, sellerNoteRate, sellerNoteTermYears, sellerNoteInterestOnly]);

  // Generate 120-month combined amortization data
  const amortizationSchedule = useMemo(() => {
    const schedule: AmortizationRow[] = [];
    const maxPeriods = Math.max(sbaTermYears, sellerNoteTermYears) * 12;
    
    let sbaBalance = sbaPrincipal;
    let sellerBalance = sellerPrincipal;

    const sbaMonthlyRate = (sbaRate / 100) / 12;
    const sellerMonthlyRate = (sellerNoteRate / 100) / 12;

    for (let month = 1; month <= maxPeriods; month++) {
      let sbaInterest = 0;
      let sbaPaidPrincipal = 0;
      let sbaPayment = 0;

      // Handle SBA Loan active window
      if (month <= sbaTermYears * 12 && sbaBalance > 0) {
        sbaInterest = sbaBalance * sbaMonthlyRate;
        sbaPayment = Math.min(sbaMonthlyPayment, sbaBalance + sbaInterest);
        sbaPaidPrincipal = sbaPayment - sbaInterest;
      }

      let sellerInterest = 0;
      let sellerPaidPrincipal = 0;
      let sellerPayment = 0;

      // Handle Seller Note active window
      if (month <= sellerNoteTermYears * 12 && sellerBalance > 0) {
        sellerInterest = sellerBalance * sellerMonthlyRate;
        if (sellerNoteInterestOnly) {
          sellerPayment = sellerMonthlyPayment;
          sellerPaidPrincipal = (month === sellerNoteTermYears * 12) ? sellerBalance : 0;
        } else {
          sellerPayment = Math.min(sellerMonthlyPayment, sellerBalance + sellerInterest);
          sellerPaidPrincipal = sellerPayment - sellerInterest;
        }
      }

      const begBalance = sbaBalance + sellerBalance;
      const totalPayment = sbaPayment + (sellerNoteInterestOnly && month === sellerNoteTermYears * 12 ? sellerPayment + sellerBalance : sellerPayment);
      const totalPrincipal = sbaPaidPrincipal + sellerPaidPrincipal;
      const totalInterest = sbaInterest + sellerInterest;

      sbaBalance = Math.max(0, sbaBalance - sbaPaidPrincipal);
      sellerBalance = Math.max(0, sellerBalance - sellerPaidPrincipal);
      const endBalance = sbaBalance + sellerBalance;

      schedule.push({
        period: month,
        beginningBalance: begBalance,
        payment: totalPayment,
        principal: totalPrincipal,
        interest: totalInterest,
        endingBalance: endBalance,
      });
    }

    return schedule;
  }, [sbaPrincipal, sbaRate, sbaTermYears, sbaMonthlyPayment, sellerPrincipal, sellerNoteRate, sellerNoteTermYears, sellerMonthlyPayment, sellerNoteInterestOnly]);

  // Year-by-Year Aggregated Schedule
  const annualAmortizationSchedule = useMemo(() => {
    const annualSchedule: AmortizationRow[] = [];
    const totalYears = Math.max(sbaTermYears, sellerNoteTermYears);

    for (let year = 1; year <= totalYears; year++) {
      const monthsOfYear = amortizationSchedule.slice((year - 1) * 12, year * 12);
      if (monthsOfYear.length === 0) break;

      const begBalance = monthsOfYear[0].beginningBalance;
      const endBalance = monthsOfYear[monthsOfYear.length - 1].endingBalance;
      const totalPayment = monthsOfYear.reduce((sum, m) => sum + m.payment, 0);
      const totalPrincipal = monthsOfYear.reduce((sum, m) => sum + m.principal, 0);
      const totalInterest = monthsOfYear.reduce((sum, m) => sum + m.interest, 0);

      annualSchedule.push({
        period: year,
        beginningBalance: begBalance,
        payment: totalPayment,
        principal: totalPrincipal,
        interest: totalInterest,
        endingBalance: endBalance,
      });
    }
    return annualSchedule;
  }, [amortizationSchedule, sbaTermYears, sellerNoteTermYears]);

  // Annual Debt Services & Stress Test Metrics
  const annualDebtService = useMemo(() => {
    // Annualized first year debt service
    const firstYearMonths = amortizationSchedule.slice(0, 12);
    return firstYearMonths.reduce((sum, m) => sum + m.payment, 0);
  }, [amortizationSchedule]);

  const baseDSCR = useMemo(() => {
    if (annualDebtService === 0) return 0;
    return ebitda / annualDebtService;
  }, [ebitda, annualDebtService]);

  const downsideEbitda = useMemo(() => {
    return ebitda * (1 - ebitdaHaircut / 100);
  }, [ebitda, ebitdaHaircut]);

  const downsideDSCR = useMemo(() => {
    if (annualDebtService === 0) return 0;
    return downsideEbitda / annualDebtService;
  }, [downsideEbitda, annualDebtService]);

  const cashOnCash = useMemo(() => {
    if (equityRequired === 0) return 0;
    const postDebtCash = ebitda - annualDebtService;
    return (postDebtCash / equityRequired) * 100;
  }, [ebitda, annualDebtService, equityRequired]);

  const downsideCashOnCash = useMemo(() => {
    if (equityRequired === 0) return 0;
    const postDebtCash = downsideEbitda - annualDebtService;
    return (postDebtCash / equityRequired) * 100;
  }, [downsideEbitda, annualDebtService, equityRequired]);

  // Helper formatting logic
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] font-sans antialiased border border-[#222]">
      
      {/* Header Panel */}
      <div className="p-6 border-b border-[#222] bg-gradient-to-r from-[#050505] via-[#090909] to-[#050505] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#0ea5e9] text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-tighter">LBO SANDBOX</span>
            <span className="text-[10px] font-mono text-[#00FF66] tracking-widest font-bold">STRESS PROTOCOL ENFORCED</span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
            DEBT SERVICE & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] to-[#0EA5E9]">AMORTIZATION ENGINE</span>
          </h2>
          <p className="text-xs text-[#888] font-mono mt-0.5">Stress-test acquisition models under high interest and operational haircuts.</p>
        </div>
        <div className="flex items-center space-x-2 bg-[#111] p-1 border border-[#222]">
          <button 
            onClick={() => setViewMode('ANNUAL')}
            className={`font-mono text-[10px] tracking-wider px-3 py-1.5 uppercase transition-all ${viewMode === 'ANNUAL' ? 'bg-[#00FF66] text-black font-bold' : 'text-[#888] hover:text-white'}`}
          >
            Annual Summary
          </button>
          <button 
            onClick={() => setViewMode('MONTHLY')}
            className={`font-mono text-[10px] tracking-wider px-3 py-1.5 uppercase transition-all ${viewMode === 'MONTHLY' ? 'bg-[#00FF66] text-black font-bold' : 'text-[#888] hover:text-white'}`}
          >
            Monthly Grid
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT COLUMN: CONTROLS & ASSUMPTIONS */}
        <div className="lg:col-span-5 p-6 border-r border-[#222] bg-[#080808] space-y-6">
          <div className="border-b border-[#222] pb-2">
            <h3 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
              <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
              ACQUISITION VALUATION
            </h3>
          </div>

          {/* Core Valuation Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Target Asking Price</label>
              <input 
                type="number" 
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Adjusted EBITDA</label>
              <input 
                type="number" 
                value={ebitda}
                onChange={(e) => setEbitda(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#00FF66] text-xs font-mono text-white p-2.5 outline-none"
              />
            </div>
          </div>

          {/* SBA 7(a) Loan Structural Controls */}
          <div className="space-y-4 pt-2 border-t border-[#111]">
            <div className="flex justify-between items-center">
              <h4 className="font-mono text-[10px] text-white tracking-widest uppercase">1. SBA 7(a) Guarantee Structure</h4>
              <span className="font-mono text-[11px] text-[#0ea5e9] font-bold">{formatCurrency(sbaPrincipal)} ({sbaPercentage}%)</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[9px] text-[#888] mb-1">
                  <span>LOAN PROPORTION</span>
                  <span>{sbaPercentage}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="90" 
                  step="5"
                  value={sbaPercentage}
                  onChange={(e) => setSbaPercentage(parseFloat(e.target.value))}
                  className="w-full accent-[#0ea5e9] bg-[#222] h-1 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-[#888] uppercase">Interest Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={sbaRate}
                    onChange={(e) => setSbaRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-white p-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-[#888] uppercase">Term (Years)</label>
                  <select 
                    value={sbaTermYears}
                    onChange={(e) => setSbaTermYears(parseInt(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-[#F9F9F9] p-2 outline-none"
                  >
                    <option value="5">5 Years (Short Term)</option>
                    <option value="7">7 Years (Mid Term)</option>
                    <option value="10">10 Years (Standard)</option>
                    <option value="15">15 Years (Extended)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Standby Note Controls */}
          <div className="space-y-4 pt-4 border-t border-[#111]">
            <div className="flex justify-between items-center">
              <h4 className="font-mono text-[10px] text-white tracking-widest uppercase">2. Seller Standby Note</h4>
              <span className="font-mono text-[11px] text-[#00FF66] font-bold">{formatCurrency(sellerPrincipal)} ({sellerNotePercentage}%)</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[9px] text-[#888] mb-1">
                  <span>NOTE PROPORTION</span>
                  <span>{sellerNotePercentage}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="25" 
                  step="2.5"
                  value={sellerNotePercentage}
                  onChange={(e) => setSellerNotePercentage(parseFloat(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-[#888] uppercase">Interest Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={sellerNoteRate}
                    onChange={(e) => setSellerNoteRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#00FF66] text-xs font-mono text-white p-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-[#888] uppercase">Note Term (Years)</label>
                  <select 
                    value={sellerNoteTermYears}
                    onChange={(e) => setSellerNoteTermYears(parseInt(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#00FF66] text-xs font-mono text-[#F9F9F9] p-2 outline-none"
                  >
                    <option value="3">3 Years</option>
                    <option value="5">5 Years (Standard)</option>
                    <option value="7">7 Years</option>
                    <option value="10">10 Years</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#0a0a0a] border border-[#222]">
                <span className="font-mono text-[9px] text-[#888] uppercase tracking-wider">Interest-Only Period Standby</span>
                <button 
                  onClick={() => setSellerNoteInterestOnly(!sellerNoteInterestOnly)}
                  className="w-10 h-5 border transition-colors flex items-center px-0.5"
                  style={{ borderRadius: '0px' }}
                  className={`w-10 h-5 border transition-colors flex items-center px-0.5 ${sellerNoteInterestOnly ? 'bg-[#00FF66]/20 border-[#00FF66] justify-end' : 'bg-black border-[#222] justify-start'}`}
                >
                  <span className={`w-3.5 h-3.5 ${sellerNoteInterestOnly ? 'bg-[#00FF66]' : 'bg-[#444]'}`}></span>
                </button>
              </div>
            </div>
          </div>

          {/* Scenario Downside Haircut */}
          <div className="pt-4 border-t border-[#111] space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-mono text-[10px] text-[#FF3333] tracking-widest uppercase font-bold">3. Severe Stress Haircut</h4>
              <span className="font-mono text-[11px] text-[#FF3333] font-bold">-{ebitdaHaircut}% EBITDA</span>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="50" 
              step="5"
              value={ebitdaHaircut}
              onChange={(e) => setEbitdaHaircut(parseInt(e.target.value))}
              className="w-full accent-[#FF3333] bg-[#222] h-1 cursor-pointer"
            />
            <p className="text-[10px] text-[#888] font-mono leading-tight">
              Simulates macroeconomic shock, structural client concentration churn, or immediate wage inflation pressures post-acquisition.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE METRIC DISK & TRANSACTION FEED */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-6 bg-[#050505]">
          
          {/* LBO Health Metrics Dashboard */}
          <div className="space-y-4">
            <div className="border-b border-[#222] pb-2">
              <h3 className="font-mono text-xs font-bold tracking-wider text-[#00FF66] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#00FF66]"></span>
                TRANSACTION LEVERAGE METRIC ANALYSIS
              </h3>
            </div>

            {/* Metric Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              {/* Equity Cash Injection */}
              <div className="bg-[#0c0c0c] border border-[#222] p-4 relative">
                <div className="text-[9px] text-[#888] tracking-wider">EQUITY CASH REQUIRED</div>
                <div className="text-lg font-bold text-white mt-1">{formatCurrency(equityRequired)}</div>
                <div className="text-[9px] text-[#888] mt-1">{( (equityRequired / purchasePrice) * 100 ).toFixed(1)}% of Enterprise Val.</div>
              </div>

              {/* Base DSCR */}
              <div className={`border p-4 relative transition-all ${baseDSCR >= 1.25 ? 'bg-black border-[#00FF66]/40 text-[#00FF66]' : 'bg-[#FF3333]/5 border-[#FF3333]/40 text-[#FF3333]'}`}>
                <div className="text-[9px] text-[#888] tracking-wider">ANNUAL DSCR (BASE)</div>
                <div className="text-lg font-bold mt-1">{baseDSCR.toFixed(2)}x</div>
                <div className="text-[9px] text-[#888] mt-1">SBA Standard Target: 1.25x</div>
              </div>

              {/* Stress DSCR */}
              <div className={`border p-4 relative transition-all ${downsideDSCR >= 1.15 ? 'bg-black border-[#0ea5e9]/40 text-[#0ea5e9]' : 'bg-[#FF3333]/10 border-[#FF3333]/80 text-[#FF3333]'}`}>
                <div className="text-[9px] text-[#888] tracking-wider">ANNUAL DSCR (STRESSED)</div>
                <div className="text-lg font-bold mt-1">{downsideDSCR.toFixed(2)}x</div>
                <div className="text-[9px] text-[#888] mt-1">Stressed EBITDA: {formatCurrency(downsideEbitda)}</div>
              </div>
            </div>

            {/* Yield metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-mono">
              <div className="bg-[#0c0c0c] border border-[#222] p-3.5 flex justify-between items-center">
                <div>
                  <div className="text-[9px] text-[#888]">BASE CASH-ON-CASH YIELD</div>
                  <div className="text-base font-bold text-[#00FF66] mt-0.5">{cashOnCash.toFixed(2)}%</div>
                </div>
                <div className="text-right text-[10px] text-[#888]">
                  Post-Debt Flow: <span className="text-white font-bold">{formatCurrency(ebitda - annualDebtService)}</span>
                </div>
              </div>

              <div className="bg-[#0c0c0c] border border-[#222] p-3.5 flex justify-between items-center">
                <div>
                  <div className="text-[9px] text-[#888]">STRESSED CASH-ON-CASH YIELD</div>
                  <div className="text-base font-bold text-[#FF3333] mt-0.5">{downsideCashOnCash.toFixed(2)}%</div>
                </div>
                <div className="text-right text-[10px] text-[#888]">
                  Post-Debt Flow: <span className="text-white font-bold">{formatCurrency(downsideEbitda - annualDebtService)}</span>
                </div>
              </div>
            </div>

            {/* Severe System Warning Threshold */}
            {downsideDSCR < 1.15 && (
              <div className="bg-[#FF3333]/10 border border-[#FF3333]/40 p-4 font-mono text-xs flex items-start space-x-3">
                <span className="text-[#FF3333] font-bold">[CRITICAL INSOLVENCY ALERT]</span>
                <p className="text-[#888] text-[11px] leading-tight">
                  Stressed DSCR ({downsideDSCR.toFixed(2)}x) is below the standard protective covenant limit of 1.15x. Equity injection must be elevated or transaction price renegotiated.
                </p>
              </div>
            )}
          </div>

          {/* Interactive Amortization Table */}
          <div className="space-y-3 pt-4 border-t border-[#222] flex-grow">
            <div className="flex justify-between items-center">
              <h4 className="font-mono text-xs font-bold text-[#F9F9F9] tracking-wider uppercase">
                {viewMode === 'ANNUAL' ? 'Combined Annual Amortization Profile' : 'Combined Monthly Amortization Feed'}
              </h4>
              <span className="text-[10px] font-mono text-[#888]">
                {viewMode === 'ANNUAL' ? `${annualAmortizationSchedule.length} Periods` : `${amortizationSchedule.length} Periods`}
              </span>
            </div>

            <div className="overflow-x-auto border border-[#222] max-h-[350px] overflow-y-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#0c0c0c] text-[#888] sticky top-0 border-b border-[#222] z-10">
                  <tr>
                    <th className="p-2.5 text-center">{viewMode === 'ANNUAL' ? 'YEAR' : 'MONTH'}</th>
                    <th className="p-2.5 text-right">BEG. BALANCE</th>
                    <th className="p-2.5 text-right text-[#0ea5e9]">DEBT SERVICE</th>
                    <th className="p-2.5 text-right text-white">PRINCIPAL</th>
                    <th className="p-2.5 text-right text-[#FF3333]">INTEREST</th>
                    <th className="p-2.5 text-right">END. BALANCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111]">
                  {(viewMode === 'ANNUAL' ? annualAmortizationSchedule : amortizationSchedule).map((row) => (
                    <tr key={row.period} className="hover:bg-[#111] transition-colors">
                      <td className="p-2 text-center font-bold text-[#888]">{row.period}</td>
                      <td className="p-2 text-right text-neutral-400">{formatCurrency(row.beginningBalance)}</td>
                      <td className="p-2 text-right text-[#0ea5e9] font-bold">{formatCurrency(row.payment)}</td>
                      <td className="p-2 text-right text-white">{formatCurrency(row.principal)}</td>
                      <td className="p-2 text-right text-[#FF3333]/80">{formatCurrency(row.interest)}</td>
                      <td className="p-2 text-right text-neutral-400 font-semibold">{formatCurrency(row.endingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Terminal Advice */}
          <div className="pt-4 border-t border-[#1a1a1a] flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#888]">
            <span className="flex items-center text-[#00FF66]">
              <span className="inline-block w-1.5 h-1.5 bg-[#00FF66] mr-2"></span>
              LBO STRUCTURAL MATRIX SECURE & VALID
            </span>
            <div className="flex space-x-4">
              <span>EST. TOTAL PAYMENT: <strong className="text-white">{formatCurrency(annualDebtService)}/YR</strong></span>
              <span>EST. EQUITY REQUIRED: <strong className="text-[#0EA5E9]">{((equityRequired / purchasePrice) * 100).toFixed(0)}%</strong></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}