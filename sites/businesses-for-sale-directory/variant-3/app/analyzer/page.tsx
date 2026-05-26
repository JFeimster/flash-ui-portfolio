"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Plus, 
  Trash2,
  Info,
  DollarSign,
  Percent
} from 'lucide-react';

export default function DealAnalyzer() {
  // Input States
  const [purchasePrice, setPurchasePrice] = useState(1200000);
  const [sde, setSde] = useState(450000);
  const [downPaymentPct, setDownPaymentPct] = useState(10);
  const [interestRate, setInterestRate] = useState(11.5);
  const [termYears, setTermYears] = useState(10);
  const [workingCapital, setWorkingCapital] = useState(50000);
  const [closingCosts, setClosingCosts] = useState(30000);
  
  const [addBacks, setAddBacks] = useState([
    { id: 1, label: 'Owner Health Insurance', value: 12000 },
    { id: 2, label: 'Discretionary Travel', value: 8000 }
  ]);

  const [newAddBack, setNewAddBack] = useState({ label: '', value: '' });

  // Financial Calculations
  const calculations = useMemo(() => {
    const totalAddBacks = addBacks.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const adjustedSde = Number(sde) + totalAddBacks;
    
    const downPaymentAmount = (Number(purchasePrice) * (Number(downPaymentPct) / 100));
    const loanAmount = Number(purchasePrice) - downPaymentAmount;
    
    const monthlyRate = (Number(interestRate) / 100) / 12;
    const totalMonths = Number(termYears) * 12;
    
    const monthlyPayment = loanAmount > 0 
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : 0;
      
    const annualDebtService = monthlyPayment * 12;
    const dscr = annualDebtService > 0 ? adjustedSde / annualDebtService : 0;
    
    const totalEquityInjected = downPaymentAmount + Number(workingCapital) + Number(closingCosts);
    const postDebtCashFlow = adjustedSde - annualDebtService;
    const roi = totalEquityInjected > 0 ? (postDebtCashFlow / totalEquityInjected) * 100 : 0;
    
    return {
      totalAddBacks,
      adjustedSde,
      loanAmount,
      annualDebtService,
      dscr,
      postDebtCashFlow,
      roi,
      totalEquityInjected
    };
  }, [purchasePrice, sde, downPaymentPct, interestRate, termYears, workingCapital, closingCosts, addBacks]);

  // Chart Data Simulation (Sensitivity Analysis)
  const generateSensitivity = () => {
    const rates = [7, 8, 9, 10, 11, 12, 13, 14, 15];
    return rates.map(rate => {
      const monthlyRate = (rate / 100) / 12;
      const loanAmount = Number(purchasePrice) * (1 - (Number(downPaymentPct) / 100));
      const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termYears * 12)) / (Math.pow(1 + monthlyRate, termYears * 12) - 1);
      const postDebt = calculations.adjustedSde - (monthlyPayment * 12);
      const resRoi = (postDebt / calculations.totalEquityInjected) * 100;
      return { rate, roi: resRoi };
    });
  };

  const sensitivityData = generateSensitivity();

  const handleAddBack = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddBack.label && newAddBack.value) {
      setAddBacks([...addBacks, { id: Date.now(), label: newAddBack.label, value: Number(newAddBack.value) }]);
      setNewAddBack({ label: '', value: '' });
    }
  };

  const removeAddBack = (id: number) => {
    setAddBacks(addBacks.filter(a => a.id !== id));
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#C1FF00] selection:text-[#050505]">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      {/* Nav */}
      <nav className="flex justify-between items-center p-6 border-bottom border-2 border-[#1A1A1A] sticky top-0 bg-[#050505] z-50">
        <a href="/" className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
          OXIDIZED<span className="text-[#8E593E]">LEDGER</span>
        </a>
        <div className="flex gap-8 items-center">
          <a href="#" className="text-[0.7rem] font-bold uppercase tracking-widest text-[#666] hover:text-[#C1FF00] transition-colors">Documentation</a>
          <div className="font-mono text-[0.7rem] text-[#C1FF00] border border-[#C1FF00] px-3 py-1 bg-[#C1FF00]/10">
            ENGINE: UNDERWRITER_V.2.4
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-[#0F0F0F] border-2 border-[#1A1A1A] p-6">
            <h2 className="font-mono text-[#8E593E] text-xs font-black uppercase mb-6 flex items-center gap-2">
              <Activity size={14} /> Acquisition Constants
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[0.6rem] font-black text-[#555] uppercase mb-2">Purchase Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] font-mono">$</span>
                  <input 
                    type="number" 
                    value={purchasePrice} 
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full bg-transparent border border-[#1A1A1A] py-3 pl-8 pr-4 font-mono text-sm focus:border-[#F5F5F0] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.6rem] font-black text-[#555] uppercase mb-2">Listed SDE</label>
                <input 
                  type="number" 
                  value={sde} 
                  onChange={(e) => setSde(Number(e.target.value))}
                  className="w-full bg-transparent border border-[#1A1A1A] py-3 px-4 font-mono text-sm focus:border-[#F5F5F0] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.6rem] font-black text-[#555] uppercase mb-2">Working Capital</label>
                  <input 
                    type="number" 
                    value={workingCapital} 
                    onChange={(e) => setWorkingCapital(Number(e.target.value))}
                    className="w-full bg-transparent border border-[#1A1A1A] py-3 px-4 font-mono text-sm focus:border-[#F5F5F0] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[0.6rem] font-black text-[#555] uppercase mb-2">Closing Costs</label>
                  <input 
                    type="number" 
                    value={closingCosts} 
                    onChange={(e) => setClosingCosts(Number(e.target.value))}
                    className="w-full bg-transparent border border-[#1A1A1A] py-3 px-4 font-mono text-sm focus:border-[#F5F5F0] outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#0F0F0F] border-2 border-[#1A1A1A] p-6">
            <h2 className="font-mono text-[#8E593E] text-xs font-black uppercase mb-6 flex items-center gap-2">
              <DollarSign size={14} /> Add-Back Ledger
            </h2>
            
            <div className="space-y-3 mb-6">
              {addBacks.map(ab => (
                <div key={ab.id} className="flex justify-between items-center bg-[#050505] p-3 border border-[#1A1A1A]">
                  <div>
                    <div className="text-[0.65rem] font-black uppercase text-[#888]">{ab.label}</div>
                    <div className="font-mono text-xs text-[#C1FF00]">{formatCurrency(ab.value)}</div>
                  </div>
                  <button onClick={() => removeAddBack(ab.id)} className="text-[#444] hover:text-[#FF3D00] transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddBack} className="grid grid-cols-1 gap-3">
              <input 
                placeholder="DESCRIPTION" 
                value={newAddBack.label}
                onChange={e => setNewAddBack({...newAddBack, label: e.target.value})}
                className="bg-transparent border border-[#1A1A1A] py-2 px-3 text-[0.65rem] font-mono uppercase outline-none focus:border-[#444]"
              />
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="AMOUNT" 
                  value={newAddBack.value}
                  onChange={e => setNewAddBack({...newAddBack, value: e.target.value})}
                  className="bg-transparent border border-[#1A1A1A] py-2 px-3 text-[0.65rem] font-mono uppercase outline-none focus:border-[#444] flex-grow"
                />
                <button className="bg-[#F5F5F0] text-[#050505] px-4 hover:bg-[#C1FF00] transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </form>
          </section>

          <section className="bg-[#0F0F0F] border-2 border-[#1A1A1A] p-6">
            <h2 className="font-mono text-[#8E593E] text-xs font-black uppercase mb-6 flex items-center gap-2">
              <Percent size={14} /> Debt Structuring
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[0.6rem] font-black uppercase mb-2">
                  <span className="text-[#555]">SBA Down Payment</span>
                  <span className="text-[#C1FF00] font-mono">{downPaymentPct}%</span>
                </div>
                <input 
                  type="range" min="5" max="50" step="1" 
                  value={downPaymentPct}
                  onChange={e => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-[#C1FF00] bg-[#1A1A1A]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.6rem] font-black text-[#555] uppercase mb-2">Interest Rate (%)</label>
                  <input 
                    type="number" step="0.1"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full bg-transparent border border-[#1A1A1A] py-3 px-4 font-mono text-sm focus:border-[#F5F5F0] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[0.6rem] font-black text-[#555] uppercase mb-2">Amortization (Yrs)</label>
                  <input 
                    type="number" 
                    value={termYears} 
                    onChange={(e) => setTermYears(Number(e.target.value))}
                    className="w-full bg-transparent border border-[#1A1A1A] py-3 px-4 font-mono text-sm focus:border-[#F5F5F0] outline-none"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Terminal Visualization */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Dashboard Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-[#1A1A1A] border-2 border-[#1A1A1A]">
            <div className="bg-[#0F0F0F] p-8">
              <span className="block text-[0.6rem] font-black text-[#555] uppercase mb-2">Debt Service Coverage (DSCR)</span>
              <div className={`text-4xl font-black font-mono tracking-tighter ${calculations.dscr > 1.25 ? 'text-[#C1FF00]' : 'text-[#FF3D00]'}`}>
                {calculations.dscr.toFixed(2)}x
              </div>
              <p className="mt-2 text-[0.6rem] text-[#444] uppercase tracking-wider">Target: 1.25x Minimum</p>
            </div>
            <div className="bg-[#0F0F0F] p-8">
              <span className="block text-[0.6rem] font-black text-[#555] uppercase mb-2">Net Cash Flow (Post-Debt)</span>
              <div className="text-4xl font-black font-mono tracking-tighter text-[#F5F5F0]">
                {formatCurrency(calculations.postDebtCashFlow)}
              </div>
              <p className="mt-2 text-[0.6rem] text-[#444] uppercase tracking-wider">Annualized Surplus</p>
            </div>
            <div className="bg-[#0F0F0F] p-8">
              <span className="block text-[0.6rem] font-black text-[#555] uppercase mb-2">Equity ROI (Cash-on-Cash)</span>
              <div className="text-4xl font-black font-mono tracking-tighter text-[#8E593E]">
                {calculations.roi.toFixed(1)}%
              </div>
              <p className="mt-2 text-[0.6rem] text-[#444] uppercase tracking-wider">On Total Equity: {formatCurrency(calculations.totalEquityInjected)}</p>
            </div>
          </div>

          {/* Sensitivity Graph */}
          <section className="bg-[#0F0F0F] border-2 border-[#1A1A1A] p-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="font-mono text-xs font-black uppercase text-[#C1FF00]">Rate Sensitivity Analysis</h3>
                <p className="text-[0.65rem] text-[#666] uppercase mt-1">Impact of interest rate volatility on Equity ROI (%)</p>
              </div>
              <div className="text-right">
                <span className="text-[0.6rem] text-[#444] uppercase block mb-1">Max Leverage ROI</span>
                <span className="font-mono text-sm text-[#F5F5F0]">{Math.max(...sensitivityData.map(d => d.roi)).toFixed(1)}%</span>
              </div>
            </div>

            <div className="relative h-64 w-full border-l border-b border-[#1A1A1A] flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid Lines */}
                {[0, 25, 50, 75, 100].map(val => (
                  <line key={val} x1="0" y1={val} x2="100" y2={val} stroke="#1A1A1A" strokeWidth="0.5" />
                ))}
                
                {/* Data Path */}
                <path
                  d={`M ${sensitivityData.map((d, i) => `${(i / (sensitivityData.length - 1)) * 100},${100 - (d.roi / 100 * 100)}`).join(' L ')}`}
                  fill="none"
                  stroke="#C1FF00"
                  strokeWidth="2"
                />

                {/* Points */}
                {sensitivityData.map((d, i) => (
                  <circle
                    key={i}
                    cx={(i / (sensitivityData.length - 1)) * 100}
                    cy={100 - (d.roi / 100 * 100)}
                    r="1.5"
                    fill="#C1FF00"
                  />
                ))}
              </svg>

              {/* X-Axis Labels */}
              <div className="absolute -bottom-6 w-full flex justify-between px-1">
                {sensitivityData.map((d, i) => (
                  <span key={i} className="text-[0.5rem] font-mono text-[#444]">{d.rate}%</span>
                ))}
              </div>
            </div>
          </section>

          {/* Detailed Waterfall Table */}
          <section className="bg-[#0F0F0F] border-2 border-[#1A1A1A] overflow-hidden">
            <div className="p-4 border-b border-[#1A1A1A] bg-[#1A1A1A]/30">
              <h3 className="font-mono text-xs font-black uppercase">Capital Allocation Detail</h3>
            </div>
            <div className="divide-y divide-[#1A1A1A]">
              <div className="flex justify-between p-4 text-xs">
                <span className="text-[#666] uppercase font-bold tracking-widest">Adjusted EBIT/SDE</span>
                <span className="font-mono text-[#C1FF00]">{formatCurrency(calculations.adjustedSde)}</span>
              </div>
              <div className="flex justify-between p-4 text-xs">
                <span className="text-[#666] uppercase font-bold tracking-widest">Annual Debt Service</span>
                <span className="font-mono text-[#FF3D00]">({formatCurrency(calculations.annualDebtService)})</span>
              </div>
              <div className="flex justify-between p-4 text-xs bg-[#050505]">
                <span className="text-[#F5F5F0] uppercase font-black tracking-widest italic">Net Post-Debt Surplus</span>
                <span className="font-mono text-[#F5F5F0] font-black">{formatCurrency(calculations.postDebtCashFlow)}</span>
              </div>
              <div className="flex justify-between p-4 text-xs">
                <span className="text-[#666] uppercase font-bold tracking-widest">Debt-to-Equity Ratio</span>
                <span className="font-mono text-[#F5F5F0]">{(calculations.loanAmount / calculations.totalEquityInjected).toFixed(2)}x</span>
              </div>
              <div className="flex justify-between p-4 text-xs">
                <span className="text-[#666] uppercase font-bold tracking-widest">Payback Period</span>
                <span className="font-mono text-[#8E593E]">{(calculations.totalEquityInjected / calculations.postDebtCashFlow).toFixed(1)} Years</span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#1A1A1A] p-6 flex items-start gap-4">
              <ShieldCheck className="text-[#8E593E] shrink-0" size={20} />
              <div>
                <h4 className="text-[0.65rem] font-black uppercase mb-1">Risk Profile: {calculations.dscr < 1.1 ? 'CRITICAL' : calculations.dscr < 1.4 ? 'MODERATE' : 'STABLE'}</h4>
                <p className="text-[0.6rem] text-[#555] leading-relaxed uppercase">Debt service coverage is {calculations.dscr < 1.25 ? 'below' : 'above'} standard bank covenants. Adjust price or down payment to secure favorable lending terms.</p>
              </div>
            </div>
            <div className="border border-[#C1FF00]/20 bg-[#C1FF00]/5 p-6 flex items-start gap-4">
              <TrendingUp className="text-[#C1FF00] shrink-0" size={20} />
              <div>
                <h4 className="text-[0.65rem] font-black uppercase mb-1">Leverage Opportunity</h4>
                <p className="text-[0.6rem] text-[#555] leading-relaxed uppercase">With {downPaymentPct}% down, you are controlling a {formatCurrency(purchasePrice)} asset with {formatCurrency(calculations.totalEquityInjected)} liquid equity.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-20 p-8 border-t-2 border-[#1A1A1A]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="text-sm font-black uppercase tracking-tighter mb-2">OXIDIZED<span className="text-[#8E593E]">LEDGER</span></div>
            <p className="text-[0.6rem] text-[#444] uppercase tracking-widest max-w-md">Financial models are projections only. All deal decisions should be validated by certified CPA and SBA counsel.</p>
          </div>
          <div className="flex gap-6">
             <button className="bg-transparent border border-[#F5F5F0] text-[#F5F5F0] px-6 py-3 text-[0.65rem] font-black uppercase tracking-widest hover:bg-[#F5F5F0] hover:text-[#050505] transition-all flex items-center gap-2">
               Export PDF Report <ArrowRight size={14} />
             </button>
             <button className="bg-[#C1FF00] text-[#050505] px-6 py-3 text-[0.65rem] font-black uppercase tracking-widest hover:bg-[#F5F5F0] transition-all">
               Save Scenario
             </button>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}"
