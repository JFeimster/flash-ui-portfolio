import React, { useState, useMemo } from 'react';

// Terminal-grade icons as inline SVGs for high reliability & zero extra dependency
const ShieldAlertIcon = () => (
  <svg className="w-4 h-4 text-[#FF3333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const TerminalIcon = () => (
  <svg className="w-4 h-4 text-[#0EA5E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-[#00FF66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

interface Tranche {
  id: string;
  name: string;
  percentage: number;
  type: 'GP' | 'Anchor_LP' | 'Syndicate_LP';
}

export default function FeeCalculator() {
  // Input parameters
  const [enterpriseValue, setEnterpriseValue] = useState<number>(4500000);
  const [feeStructure, setFeeStructure] = useState<'standard_lehman' | 'double_lehman' | 'flat_percentage' | 'custom'>('standard_lehman');
  const [flatPercentage, setFlatPercentage] = useState<number>(3.5);
  const [retainerFee, setRetainerFee] = useState<number>(50000);
  const [offsetRetainer, setOffsetRetainer] = useState<boolean>(true);
  
  // Funding assumptions
  const [sbaLoanPortion, setSbaLoanPortion] = useState<number>(75); // % of EV
  const [sellerNotePortion, setSellerNotePortion] = useState<number>(15); // % of EV
  const [gpCarryPromote, setGpCarryPromote] = useState<number>(20); // GP Carry %

  // Custom brackets for custom fee structures
  const [customFlatFee, setCustomFlatFee] = useState<number>(150000);

  // Syndicate allocations
  const [tranches, setTranches] = useState<Tranche[]>([
    { id: '1', name: 'Lead Sponsor GP Commit', percentage: 10, type: 'GP' },
    { id: '2', name: 'Alpha Family Office (Anchor)', percentage: 50, type: 'Anchor_LP' },
    { id: '3', name: 'Retail Syndicate LPs', percentage: 40, type: 'Syndicate_LP' },
  ]);

  // Terminal active log state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYSTEM INITIALIZED: ACQUIRE-NET SECURE LEDGER PROTOCOL',
    'FEE STRUCTURE MODEL LOADED: STANDARD LEHMAN 5-4-3-2-1',
    'ESTABLISHED BASE CONNECTION FOR INTERMEDIARY AUDITING'
  ]);

  const addLog = (message: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setTerminalLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 8)]);
  };

  // Calculations
  const calculations = useMemo(() => {
    let successFee = 0;
    const ev = enterpriseValue;

    // 1. Calculate Success Fee based on scale
    if (feeStructure === 'standard_lehman') {
      // 5% of 1st M, 4% of 2nd M, 3% of 3rd M, 2% of 4th M, 1% of everything else
      const tiers = [1000000, 1000000, 1000000, 1000000];
      const rates = [0.05, 0.04, 0.03, 0.02];
      let remaining = ev;

      for (let i = 0; i < tiers.length; i++) {
        const chunk = Math.min(remaining, tiers[i]);
        successFee += chunk * rates[i];
        remaining -= chunk;
        if (remaining <= 0) break;
      }
      if (remaining > 0) {
        successFee += remaining * 0.01;
      }
    } else if (feeStructure === 'double_lehman') {
      // 10% of 1st M, 8% of 2nd M, 6% of 3rd M, 4% of 4th M, 2% of everything else
      const tiers = [1000000, 1000000, 1000000, 1000000];
      const rates = [0.10, 0.08, 0.06, 0.04];
      let remaining = ev;

      for (let i = 0; i < tiers.length; i++) {
        const chunk = Math.min(remaining, tiers[i]);
        successFee += chunk * rates[i];
        remaining -= chunk;
        if (remaining <= 0) break;
      }
      if (remaining > 0) {
        successFee += remaining * 0.02;
      }
    } else if (feeStructure === 'flat_percentage') {
      successFee = ev * (flatPercentage / 100);
    } else if (feeStructure === 'custom') {
      successFee = customFlatFee;
    }

    // 2. Adjust for Retainer Offset
    const netSuccessFee = offsetRetainer 
      ? Math.max(0, successFee - retainerFee) 
      : successFee;

    const totalBrokerCompensation = netSuccessFee + retainerFee;
    const effectiveFeePercentage = ev > 0 ? (totalBrokerCompensation / ev) * 100 : 0;

    // 3. Capital structure parameters
    const sbaDebtAmount = ev * (sbaLoanPortion / 100);
    const sellerNoteAmount = ev * (sellerNotePortion / 100);
    
    // Equity target needed to cover business + closing/broker costs
    const equityRequiredForPurchase = ev - (sbaDebtAmount + sellerNoteAmount);
    // Intermediary/Broker fees are typically funded by buyer at close
    const totalEquitySyndicationTarget = equityRequiredForPurchase + totalBrokerCompensation;

    // 4. Tranche amounts
    const trancheBreakdown = tranches.map(t => ({
      ...t,
      amount: totalEquitySyndicationTarget * (t.percentage / 100)
    }));

    return {
      grossSuccessFee: successFee,
      netSuccessFee,
      totalBrokerCompensation,
      effectiveFeePercentage,
      sbaDebtAmount,
      sellerNoteAmount,
      equityRequiredForPurchase,
      totalEquitySyndicationTarget,
      trancheBreakdown
    };
  }, [enterpriseValue, feeStructure, flatPercentage, retainerFee, offsetRetainer, sbaLoanPortion, sellerNotePortion, customFlatFee, tranches]);

  // Adjust specific tranche percentage safely
  const handleTrancheChange = (id: string, value: number) => {
    const updated = tranches.map(t => t.id === id ? { ...t, percentage: value } : t);
    const totalPercent = updated.reduce((acc, curr) => acc + curr.percentage, 0);
    setTranches(updated);
    addLog(`TRANCHE ID [${id}] ADJUSTED TO ${value}%. SYSTEM CAPITAL DEVIATION: ${100 - totalPercent}%`);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      meta: {
        protocol: "SECTOR-1031-FEE-LEDGER",
        timestamp: new Date().toISOString()
      },
      inputs: {
        enterpriseValue,
        feeStructure,
        flatPercentage,
        retainerFee,
        offsetRetainer,
        sbaLoanPortion,
        sellerNotePortion,
        gpCarryPromote
      },
      outputs: {
        totalBrokerCompensation: calculations.totalBrokerCompensation,
        effectiveFeePercentage: calculations.effectiveFeePercentage,
        totalEquitySyndicationTarget: calculations.totalEquitySyndicationTarget,
        netSuccessFee: calculations.netSuccessFee
      }
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `syndicate_ledger_${enterpriseValue}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog('SYSTEM LEDGER EXPORTED SUCCESSFULY TO JSON STREAM');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const isTrancheBalanced = useMemo(() => {
    const sum = tranches.reduce((sum, t) => sum + t.percentage, 0);
    return Math.abs(sum - 100) < 0.01;
  }, [tranches]);

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono p-6 border border-[#222] min-h-screen flex flex-col justify-between select-none">
      
      {/* 1. Header Metadata Bar */}
      <div className="border-b border-[#222] pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#00FF66] text-black text-[9px] px-1.5 py-0.5 font-bold tracking-tighter">BROKER LEDGER</span>
            <span className="text-[10px] text-[#0EA5E9] tracking-widest font-semibold">M&A SYNDICATION TOOL v3.12</span>
          </div>
          <h1 className="text-xl font-extrabold uppercase mt-1 tracking-tight text-white">
            Intermediary Fee &amp; Equity Syndicate Planner
          </h1>
          <p className="text-[11px] text-[#888]">
            Simulate standard/double Lehman scales, manage offset structures, and structure SPV syndication equity pools.
          </p>
        </div>
        
        {/* Real-time sync light */}
        <div className="flex items-center space-x-3 bg-[#0a0a0a] border border-[#222] px-3 py-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75"></span>
            <span className="relative inline-flex rounded-none h-2 w-2 bg-[#00FF66]"></span>
          </div>
          <div className="text-[10px] text-right">
            <div className="text-white/80 font-bold">LEDGER STATUS: VALID</div>
            <div className="text-[#888] text-[9px]">SBA-7A COMPLIANCE ENGAGED</div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Terminal Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        
        {/* Left Column: Intermediary Deal Parameters Input (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section: Transaction Core */}
          <div className="border border-[#222] bg-[#080808] p-4 space-y-4">
            <div className="border-b border-[#222] pb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0ea5e9] tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-3 bg-[#0ea5e9] inline-block"></span>
                01. Core Deal Metrics
              </span>
              <span className="text-[9px] text-[#888]">[SECURE FEED]</span>
            </div>

            {/* Enterprise value range slider and input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase text-[#888] tracking-widest">Enterprise Value (EV)</label>
                <span className="text-sm text-[#00FF66] font-bold">{formatCurrency(enterpriseValue)}</span>
              </div>
              <input 
                type="range" 
                min="500000" 
                max="25000000" 
                step="100000"
                value={enterpriseValue}
                onChange={(e) => {
                  setEnterpriseValue(Number(e.target.value));
                  addLog(`ADJUSTED ENTERPRISE VALUE TO ${formatCurrency(Number(e.target.value))}`);
                }}
                className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-neutral-600">
                <span>$500K</span>
                <span>$12.5M</span>
                <span>$25.0M</span>
              </div>
            </div>

            {/* SBA & Seller Note Structure Assumptions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase text-[#888] tracking-widest">SBA Debt %</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0"
                    max="90"
                    value={sbaLoanPortion}
                    onChange={(e) => {
                      setSbaLoanPortion(Math.min(90, Number(e.target.value)));
                      addLog(`SET SBA LOAN TARGET TO ${e.target.value}%`);
                    }}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500">%</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase text-[#888] tracking-widest">Seller Note %</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0"
                    max="50"
                    value={sellerNotePortion}
                    onChange={(e) => {
                      setSellerNotePortion(Math.min(50, Number(e.target.value)));
                      addLog(`SET SELLER NOTE RATIO TO ${e.target.value}%`);
                    }}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500">%</span>
                </div>
              </div>
            </div>
            
            <div className="text-[9px] text-[#888] leading-tight bg-black p-2 border border-[#222] flex items-start gap-2">
              <TerminalIcon />
              <span>Implied equity allocation required for asset transfer: <strong className="text-white">{(100 - (sbaLoanPortion + sellerNotePortion))}%</strong> before success fees.</span>
            </div>
          </div>

          {/* Section: Intermediary Fee Structure */}
          <div className="border border-[#222] bg-[#080808] p-4 space-y-4">
            <div className="border-b border-[#222] pb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0ea5e9] tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-3 bg-[#0ea5e9] inline-block"></span>
                02. Success &amp; Advisory Fees
              </span>
              <span className="text-[9px] text-[#888]">[RET-09]</span>
            </div>

            {/* Fee Mode Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-[#888] tracking-widest block">Success Fee Mechanism</label>
              <select 
                value={feeStructure} 
                onChange={(e) => {
                  setFeeStructure(e.target.value as any);
                  addLog(`SWITCHED SUCCESS FEE METHOD: ${e.target.value.toUpperCase()}`);
                }}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-[#F9F9F9] p-3 focus:outline-none"
              >
                <option value="standard_lehman">Standard Lehman Scale (5/4/3/2/1)</option>
                <option value="double_lehman">Double Lehman Scale (10/8/6/4/2)</option>
                <option value="flat_percentage">Flat Percentage Scale</option>
                <option value="custom">Custom Specified Success Fee</option>
              </select>
            </div>

            {/* Conditional Sub-options */}
            {feeStructure === 'flat_percentage' && (
              <div className="space-y-1 p-2 bg-black border border-[#222]">
                <label className="text-[9px] uppercase text-[#888] tracking-widest block">Success Fee Percentage</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0"
                    max="15"
                    value={flatPercentage}
                    onChange={(e) => {
                      setFlatPercentage(Number(e.target.value));
                      addLog(`SET FLAT SUCCESS FEE TO ${e.target.value}%`);
                    }}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888]">%</span>
                </div>
              </div>
            )}

            {feeStructure === 'custom' && (
              <div className="space-y-1 p-2 bg-black border border-[#222]">
                <label className="text-[9px] uppercase text-[#888] tracking-widest block">Fixed Success Fee ($)</label>
                <input 
                  type="number" 
                  step="5000" 
                  min="0"
                  value={customFlatFee}
                  onChange={(e) => {
                    setCustomFlatFee(Number(e.target.value));
                    addLog(`UPDATED CUSTOM FIXED SUCCESS FEE TO ${formatCurrency(Number(e.target.value))}`);
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2 outline-none"
                />
              </div>
            )}

            {/* Retainer Structure */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[9px] uppercase text-[#888] tracking-widest">Retainer / Work Fee</label>
                <input 
                  type="number" 
                  step="5000"
                  value={retainerFee}
                  onChange={(e) => {
                    setRetainerFee(Number(e.target.value));
                    addLog(`RETAINER WORK FEE SET TO ${formatCurrency(Number(e.target.value))}`);
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none"
                />
              </div>

              <div className="space-y-1 flex flex-col justify-end">
                <label className="text-[9px] uppercase text-[#888] tracking-widest mb-1.5">Offset Provision</label>
                <button
                  onClick={() => {
                    setOffsetRetainer(!offsetRetainer);
                    addLog(`TOGGLED RETAINER OFFSET TO ${!offsetRetainer}`);
                  }}
                  className={`w-full text-center py-2.5 border text-xs uppercase tracking-widest font-bold transition-all ${
                    offsetRetainer 
                      ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66]' 
                      : 'bg-[#FF3333]/10 border-[#FF3333] text-[#FF3333]'
                  }`}
                >
                  {offsetRetainer ? 'OFFSET SUCCESS FEE' : 'ADDITIVE SUCCESS FEE'}
                </button>
              </div>
            </div>
          </div>

          {/* Sponsor Carry / Promote Assumptions */}
          <div className="border border-[#222] bg-[#080808] p-4 space-y-3">
            <div className="border-b border-[#222] pb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0ea5e9] tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-3 bg-[#0ea5e9] inline-block"></span>
                03. Sponsor Incentives
              </span>
              <span className="text-[9px] text-[#888]">[CARRY-PRO]</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] uppercase text-[#888] tracking-widest">Sponsor Promote (Carry %)</label>
                <span className="text-xs text-[#00FF66] font-bold">{gpCarryPromote}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="40" 
                step="2.5"
                value={gpCarryPromote}
                onChange={(e) => {
                  setGpCarryPromote(Number(e.target.value));
                  addLog(`SET SPONSOR PROMOTE TO ${e.target.value}%`);
                }}
                className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Broker Calculations, Ledger output & Syndication Tranches (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Visual Dashboard Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#222] border border-[#222]">
            
            <div className="bg-[#0c0c0c] p-4 flex flex-col justify-between">
              <span className="text-[9px] text-[#888] uppercase tracking-wider font-semibold">Total Intermediary Fee</span>
              <div className="mt-2">
                <div className="text-xl font-bold text-[#00FF66] tracking-tight">
                  {formatCurrency(calculations.totalBrokerCompensation)}
                </div>
                <div className="text-[9px] text-neutral-500 font-bold mt-1">
                  EFFECTIVE RATE: {calculations.effectiveFeePercentage.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="bg-[#0c0c0c] p-4 flex flex-col justify-between">
              <span className="text-[9px] text-[#888] uppercase tracking-wider font-semibold">Net Success Fee</span>
              <div className="mt-2">
                <div className="text-xl font-bold text-[#0ea5e9] tracking-tight">
                  {formatCurrency(calculations.netSuccessFee)}
                </div>
                <div className="text-[9px] text-[#888] mt-1">
                  PRE-RETAINER: {formatCurrency(calculations.grossSuccessFee)}
                </div>
              </div>
            </div>

            <div className="bg-[#0c0c0c] p-4 flex flex-col justify-between">
              <span className="text-[9px] text-[#888] uppercase tracking-wider font-semibold">Equity Raise Target</span>
              <div className="mt-2">
                <div className="text-xl font-bold text-white tracking-tight">
                  {formatCurrency(calculations.totalEquitySyndicationTarget)}
                </div>
                <div className="text-[9px] text-[#888] mt-1">
                  INCL. CLOSING/ADVISORY FEES
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Equity Syndication Tranche Allocator */}
          <div className="border border-[#222] bg-[#080808] p-5 space-y-4">
            <div className="border-b border-[#222] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider">
                  04. Equity Syndication Ledger Breakdown
                </h3>
                <p className="text-[10px] text-[#888] mt-0.5">Determine investor commitment thresholds and cash targets.</p>
              </div>

              {/* Status Badge */}
              <div className={`px-2 py-0.5 text-[10px] tracking-widest font-bold border ${
                isTrancheBalanced 
                  ? 'border-[#00FF66]/20 bg-[#00FF66]/10 text-[#00FF66]' 
                  : 'border-[#FF3333]/20 bg-[#FF3333]/10 text-[#FF3333] animate-pulse'
              }`}>
                {isTrancheBalanced ? 'STATUS: BALANCED (100%)' : 'ERROR: UNBALANCED'}
              </div>
            </div>

            {/* Tranche adjustment grid */}
            <div className="space-y-3">
              {tranches.map((tranche) => {
                const calculatedAmount = calculations.totalEquitySyndicationTarget * (tranche.percentage / 100);
                return (
                  <div key={tranche.id} className="p-3 bg-black border border-[#222] space-y-2">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 uppercase ${
                          tranche.type === 'GP' 
                            ? 'bg-neutral-800 text-white' 
                            : tranche.type === 'Anchor_LP' 
                            ? 'bg-[#0ea5e9]/20 text-[#0ea5e9] border border-[#0ea5e9]/30'
                            : 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30'
                        }`}>
                          {tranche.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-white">{tranche.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-white/50">{formatCurrency(calculatedAmount)}</span>
                        <div className="flex items-center space-x-1">
                          <input 
                            type="number" 
                            min="0"
                            max="100"
                            value={tranche.percentage}
                            onChange={(e) => handleTrancheChange(tranche.id, Number(e.target.value))}
                            className="w-14 bg-[#0c0c0c] border border-[#222] text-center text-xs font-mono text-white py-1 focus:outline-none"
                          />
                          <span className="text-[10px] text-neutral-500">%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tiny visual progress bar */}
                    <div className="w-full bg-[#111] h-1">
                      <div 
                        className={`h-full ${tranche.type === 'GP' ? 'bg-[#888]' : tranche.type === 'Anchor_LP' ? 'bg-[#0ea5e9]' : 'bg-[#00FF66]'}`} 
                        style={{ width: `${tranche.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Warn if allocations are invalid */}
            {!isTrancheBalanced && (
              <div className="bg-[#FF3333]/10 border border-[#FF3333]/20 p-3 flex items-start gap-3">
                <ShieldAlertIcon />
                <p className="text-[10px] text-[#FF3333] leading-tight">
                  WARNING: The total equity commitment does not match 100%. Adjust tranche values to align with full capital target requirements. Current total: <strong className="underline">{tranches.reduce((s,t) => s+t.percentage,0)}%</strong>.
                </p>
              </div>
            )}
          </div>

          {/* 5. Terminal Console / Activity Output */}
          <div className="border border-[#222] bg-[#050505] p-4 font-mono">
            <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-2">
              <span className="text-[10px] text-[#0ea5e9] tracking-wider uppercase font-bold flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-[#0ea5e9] animate-pulse"></span>
                Console Activity Feed
              </span>
              <button 
                onClick={() => setTerminalLogs(['CONSOLE CLEAR COMPLETE'])}
                className="text-[8px] text-[#FF3333] hover:underline uppercase"
              >
                Clear Log
              </button>
            </div>
            
            <div className="space-y-1 max-h-[110px] overflow-y-auto text-[10px] leading-relaxed text-[#888]">
              {terminalLogs.map((log, index) => (
                <div key={index} className="truncate">
                  <span className="text-[#00FF66]">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 6. Action Bar Footer */}
      <div className="mt-8 border-t border-[#222] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[11px] text-[#888] flex items-center gap-2">
          <CheckIcon />
          <span>Fincen Registry Compliant Intermediary Framework Active</span>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            onClick={() => {
              addLog('COMMITTED BROKER CONTRACT AGREEMENT TO MEMORY BUFFER');
              alert('Structure saved to current browser runtime session.');
            }}
            className="flex-1 md:flex-initial bg-[#111] hover:bg-[#222] border border-[#222] hover:border-neutral-500 text-white font-mono text-xs font-bold px-5 py-3 tracking-widest uppercase transition-all"
          >
            Lock Agreement Structure
          </button>
          
          <button 
            onClick={handleExportJson}
            className="flex-1 md:flex-initial bg-[#00FF66] text-black font-mono text-xs font-extrabold px-6 py-3 tracking-widest hover:bg-[#F9F9F9] transition-all uppercase"
          >
            Export Escrow Ledger
          </button>
        </div>
      </div>

    </div>
  );
}