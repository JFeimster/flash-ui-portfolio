"use client";

import React, { useState, useEffect } from 'react';

// Live Mock Database
interface IOI {
  id: string;
  investor: string;
  amount: number;
  type: 'EQUITY' | 'DEBT_CO_INVEST';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}

interface Deal {
  codename: string;
  vertical: string;
  headline: string;
  revenue: number;
  ebitda: number;
  asking: number;
  location: string;
  sellerNotePct: number; // e.g. 15 for 15%
  equityTarget: number;
  equityRaised: number;
  sbaEligible: boolean;
  iois: IOI[];
  description: string;
}

const INITIAL_DEALS: Deal[] = [
  {
    codename: "PROJECT VECTOR",
    vertical: "Logistics",
    headline: "B2B Freight Brokerage & Route Grid",
    revenue: 4200000,
    ebitda: 850000,
    asking: 2750000,
    location: "Southeast",
    sellerNotePct: 15,
    equityTarget: 412500, // 15% of asking
    equityRaised: 310000,
    sbaEligible: true,
    description: "Asset-light high-margin brokerage network specializing in industrial chemical haulage.",
    iois: [
      { id: "ioi-1", investor: "Blue Horizon Search Fund", amount: 150000, type: "EQUITY", status: "APPROVED", timestamp: "10:24 AM" },
      { id: "ioi-2", investor: "Chesapeake Holdings", amount: 100000, type: "EQUITY", status: "PENDING", timestamp: "11:12 AM" },
      { id: "ioi-3", investor: "Apex Syndications", amount: 60000, type: "EQUITY", status: "PENDING", timestamp: "11:45 AM" }
    ]
  },
  {
    codename: "PROJECT CYBER_METRIC",
    vertical: "SaaS",
    headline: "Automated SOC-2 Compliance Management Platform",
    revenue: 1800000,
    ebitda: 520000,
    asking: 2400000,
    location: "Remote",
    sellerNotePct: 10,
    equityTarget: 600000, // 25% of asking
    equityRaised: 480000,
    sbaEligible: false,
    description: "Proprietary continuous auditing stack with 91% gross margins and zero developer overhead required post-close.",
    iois: [
      { id: "ioi-4", investor: "Valuation Capital LLC", amount: 250000, type: "EQUITY", status: "APPROVED", timestamp: "Yesterday" },
      { id: "ioi-5", investor: "G. Stone Partners", amount: 230000, type: "EQUITY", status: "APPROVED", timestamp: "Yesterday" }
    ]
  },
  {
    codename: "PROJECT THERMO",
    vertical: "HVAC",
    headline: "Residential Heating & Air Infrastructure Grid",
    revenue: 3500000,
    ebitda: 910000,
    asking: 2900000,
    location: "Central Texas",
    sellerNotePct: 20,
    equityTarget: 350000, // 12% of asking
    equityRaised: 120000,
    sbaEligible: true,
    description: "Multi-city plumbing and dynamic commercial air services. Includes real estate holding valued at $450k.",
    iois: [
      { id: "ioi-6", investor: "Summit Search Co", amount: 120000, type: "EQUITY", status: "PENDING", timestamp: "09:05 AM" }
    ]
  }
];

export default function SyndicateLedger() {
  // App states
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [selectedDealCode, setSelectedDealCode] = useState<string>("PROJECT VECTOR");
  const [currentTime, setCurrentTime] = useState<string>("12:00:00");
  const [tickerState, setTickerState] = useState<string>("COMMITTING: $150K to VECTOR | STANDBY NEGOTIATIONS IN PROCESS FOR PROJECT THERMO");

  // New Deal Form states
  const [newCodename, setNewCodename] = useState("");
  const [newVertical, setNewVertical] = useState("SaaS");
  const [newHeadline, setNewHeadline] = useState("");
  const [newRevenue, setNewRevenue] = useState(1500000);
  const [newEbitda, setNewEbitda] = useState(400000);
  const [newAsking, setNewAsking] = useState(1200000);
  const [newLocation, setNewLocation] = useState("Midwest");
  const [newSellerNote, setNewSellerNote] = useState(15);
  const [newEquityTarget, setNewEquityTarget] = useState(200000);
  const [newSbaEligible, setNewSbaEligible] = useState(true);
  const [newDescription, setNewDescription] = useState("");

  // Term Sheet Negotiator Live States
  const activeDeal = deals.find(d => d.codename === selectedDealCode) || deals[0];

  // Dynamic values based on Live Seller Note sliders
  const [negotiatedSellerNote, setNegotiatedSellerNote] = useState<number>(15);
  
  // Keep live negotiator sync with selected deal
  useEffect(() => {
    if (activeDeal) {
      setNegotiatedSellerNote(activeDeal.sellerNotePct);
    }
  }, [selectedDealCode]);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handler to submit blinded deal
  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodename) return alert("Codename required");

    const created: Deal = {
      codename: newCodename.toUpperCase(),
      vertical: newVertical,
      headline: newHeadline || "Blinded Mid-Market Acquisition Asset",
      revenue: newRevenue,
      ebitda: newEbitda,
      asking: newAsking,
      location: newLocation,
      sellerNotePct: newSellerNote,
      equityTarget: newEquityTarget,
      equityRaised: 0,
      sbaEligible: newSbaEligible,
      description: newDescription || "No broker narrative loaded.",
      iois: []
    };

    setDeals([created, ...deals]);
    setSelectedDealCode(created.codename);
    setTickerState(`NEW PIPELINE SUBMITTED: ${created.codename} [${created.vertical}] ASK: ${formatCurrency(created.asking)}`);
    
    // Reset form
    setNewCodename("");
    setNewHeadline("");
    setNewDescription("");
  };

  // Dynamic Calculations for Active Deal Term-sheet
  const askingPrice = activeDeal ? activeDeal.asking : 0;
  const ebitda = activeDeal ? activeDeal.ebitda : 0;
  
  // Simulated Debt Calculations
  const sellerStandbyNoteAmount = askingPrice * (negotiatedSellerNote / 100);
  const equityDownpaymentAmount = activeDeal ? activeDeal.equityTarget : 0;
  const sba7aLoanAmount = Math.max(0, askingPrice - sellerStandbyNoteAmount - equityDownpaymentAmount);
  
  // Debt Service (Assume 11.5% SBA Interest Rate over 10 Years Amortization, and 8% Seller Note standby over 5 Years)
  const estSbaAnnualDebtService = sba7aLoanAmount * 0.169; // 11.5% constant amortization factor
  const estSellerAnnualDebtService = negotiatedSellerNote > 0 ? (sellerStandbyNoteAmount * 0.25) : 0; // Standby amortized or interest only
  const totalAnnualDebtService = estSbaAnnualDebtService + estSellerAnnualDebtService;
  
  // DSCR Calculation
  const dscr = totalAnnualDebtService > 0 ? (ebitda / totalAnnualDebtService) : 0;

  // Add commitment simulation
  const addMockCommitment = () => {
    if (!activeDeal) return;
    const investAmount = 50000;
    
    const updatedDeals = deals.map(d => {
      if (d.codename === activeDeal.codename) {
        const newIoi: IOI = {
          id: `ioi-${Date.now()}`,
          investor: "OPERATOR SYNDICATE PARTNER",
          amount: investAmount,
          type: "EQUITY",
          status: "PENDING",
          timestamp: "Just Now"
        };
        return {
          ...d,
          equityRaised: Math.min(d.equityTarget, d.equityRaised + investAmount),
          iois: [newIoi, ...d.iois]
        };
      }
      return d;
    });

    setDeals(updatedDeals);
    setTickerState(`SYNDICATE ALERT: Commitments updated for ${activeDeal.codename}`);
  };

  // Fast formatters
  function formatCurrency(num: number) {
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return '$' + (num / 1000).toFixed(0) + 'K';
    }
    return '$' + num;
  }

  // Update IOI status
  const updateIoiStatus = (dealCode: string, ioiId: string, status: 'APPROVED' | 'REJECTED') => {
    setDeals(deals.map(d => {
      if (d.codename === dealCode) {
        return {
          ...d,
          iois: d.iois.map(i => {
            if (i.id === ioiId) {
              return { ...i, status };
            }
            return i;
          })
        };
      }
      return d;
    }));
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] selection:bg-[#00FF66] selection:text-black font-sans min-h-screen flex flex-col overflow-x-hidden">
      
      {/* Strict zero border-radius forcing styling */}
      <style dangerouslySetInnerHTML={{__html: `
        * { border-radius: 0px !important; }
        .terminal-glow-green { box-shadow: 0 0 15px rgba(0, 255, 102, 0.1); }
        .terminal-glow-cyan { box-shadow: 0 0 15px rgba(14, 165, 233, 0.1); }
      `}} />

      {/* 1. GLOBAL STATUS & TICKER */}
      <header className="w-full bg-black border-b border-[#222] z-50 sticky top-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#111] text-[10px] font-mono tracking-widest text-[#888]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-[#00FF66] font-semibold">
              <span className="inline-block w-2 h-2 mr-2 bg-[#00FF66] animate-pulse"></span>
              BROKER BACKBONE: SECURE LEDGER CONNECTION
            </span>
            <span className="hidden md:inline text-[#222]">|</span>
            <span className="hidden md:inline text-[#0EA5E9]">SYNDICATE PROTOCOL V4.1</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>TERMINAL CLOCK: <span className="text-[#F9F9F9]">{currentTime}</span></span>
            <span className="text-[#FF3333]">OPERATOR CODE: #M&A-PRO</span>
          </div>
        </div>

        {/* Dynamic Horizontal Ticker */}
        <div className="w-full overflow-hidden whitespace-nowrap bg-[#0a0a0a] py-2 border-b border-[#222] flex items-center">
          <div className="inline-flex text-xs font-mono tracking-wider text-[#F9F9F9]/90 px-4">
            <span className="text-[#00FF66] font-bold mr-2">[LEDGER EVENT]</span>
            <span className="text-[#888]">{tickerState}</span>
            <span className="mx-6 text-[#222]">|</span>
            <span className="text-[#0ea5e9]">TOTAL COMMITTED VOLUME (YTD): $14.2M</span>
            <span className="mx-6 text-[#222]">|</span>
            <span className="text-[#FF3333]">STANDBY COMPLIANCE: SECTOR-1031</span>
          </div>
        </div>

        {/* Page Main Branding Banner */}
        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#050505] via-[#090909] to-[#050505]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#00FF66] text-black text-[10px] font-mono font-black px-1.5 py-0.5 tracking-tighter">BROKER PORTAL</span>
              <span className="text-[10px] font-mono text-[#0EA5E9] tracking-widest font-bold">SYNDICATE MASTER HUB</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
              DEAL SUBMIT & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F9F9] via-[#0ea5e9] to-[#00FF66]">SYNDICATE LEDGER</span>
            </h1>
            <p className="text-xs text-[#888] font-mono mt-0.5">Publish blinded listings, model capital structures, and monitor investor IOIs instantly.</p>
          </div>

          {/* Quick Hub Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#222] w-full md:w-auto text-left font-mono">
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div className="text-[8px] text-[#888] uppercase">Active Syndicates</div>
              <div className="text-xs font-bold text-[#F9F9F9]">{deals.length} Listings</div>
            </div>
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div className="text-[8px] text-[#888] uppercase">Aggregated Value</div>
              <div className="text-xs font-bold text-[#00FF66]">
                {formatCurrency(deals.reduce((acc, curr) => acc + curr.asking, 0))}
              </div>
            </div>
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div className="text-[8px] text-[#888] uppercase">Total Pending IOIs</div>
              <div className="text-xs font-bold text-[#0ea5e9]">
                {deals.reduce((acc, curr) => acc + curr.iois.filter(i => i.status === 'PENDING').length, 0)} Inbound
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. THE THREE-PANEL TERMINAL CORE */}
      <main className="flex-grow grid grid-cols-1 xl:grid-cols-12 gap-0 border-b border-[#222]">
        
        {/* PANEL A: DEAL INTAKE & SUBMISSION (Left Column - 3 Units) */}
        <section className="xl:col-span-3 bg-[#080808] border-r border-[#222] p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
                BLINDED DEAL SUBMISSION
              </h2>
              <p className="text-[10px] text-[#888] font-mono mt-0.5">Submit new listings to the active syndicate flow</p>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3 font-mono text-xs">
              
              <div>
                <label className="block text-[9px] text-[#888] uppercase tracking-wider mb-1">CODENAME (Unique ID)</label>
                <input 
                  type="text" 
                  value={newCodename}
                  onChange={e => setNewCodename(e.target.value)}
                  placeholder="e.g. PROJECT TITAN"
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] focus:ring-0 text-xs text-white p-2 placeholder:text-[#444] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] text-[#888] uppercase tracking-wider mb-1">Sector Vertical</label>
                  <select 
                    value={newVertical}
                    onChange={e => setNewVertical(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222] text-xs text-[#F9F9F9] p-2 outline-none"
                  >
                    <option value="SaaS">SaaS</option>
                    <option value="Logistics">Logistics</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Home Services">Home Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-[#888] uppercase tracking-wider mb-1">Location / Geo</label>
                  <input 
                    type="text" 
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="e.g. Midwest"
                    className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-[#888] uppercase tracking-wider mb-1">Blinded Headline Pitch</label>
                <input 
                  type="text" 
                  value={newHeadline}
                  onChange={e => setNewHeadline(e.target.value)}
                  placeholder="e.g. High recurrent margin operations..."
                  className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-1">
                <div>
                  <label className="block text-[8px] text-[#888] uppercase mb-1">Revenue ($)</label>
                  <input 
                    type="number" 
                    value={newRevenue}
                    onChange={e => setNewRevenue(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] text-[#888] uppercase mb-1">EBITDA ($)</label>
                  <input 
                    type="number" 
                    value={newEbitda}
                    onChange={e => setNewEbitda(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] text-xs text-[#00FF66] p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] text-[#888] uppercase mb-1">Asking ($)</label>
                  <input 
                    type="number" 
                    value={newAsking}
                    onChange={e => setNewAsking(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] text-xs text-[#0ea5e9] p-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[9px] text-[#888] uppercase tracking-wider mb-1">Seller Standby %</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={newSellerNote}
                    onChange={e => setNewSellerNote(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-[#888] uppercase tracking-wider mb-1">Equity Syndicate Down</label>
                  <input 
                    type="number" 
                    value={newEquityTarget}
                    onChange={e => setNewEquityTarget(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-[#0c0c0c] border border-[#222]">
                <span className="text-[9px] text-[#888] uppercase">SBA 7(a) Qualified</span>
                <input 
                  type="checkbox" 
                  checked={newSbaEligible} 
                  onChange={e => setNewSbaEligible(e.target.checked)}
                  className="accent-[#00FF66] w-4 h-4"
                />
              </div>

              <div>
                <label className="block text-[9px] text-[#888] uppercase tracking-wider mb-1">Asset Operational Summary</label>
                <textarea 
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Detailed structural information or highlights..."
                  className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2 outline-none resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#00FF66] hover:bg-[#F9F9F9] text-black font-bold uppercase py-2.5 text-xs transition-colors"
              >
                COMMIT LISTING TO PIPELINE
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-[#1a1a1a] hidden xl:block space-y-2">
            <div className="p-3 bg-red-950/10 border border-[#FF3333]/30">
              <span className="text-[9px] font-mono text-[#FF3333] font-bold tracking-wider">COMPLIANCE ADVISORY</span>
              <p className="text-[10px] text-[#888] font-mono leading-tight mt-1">
                Ensure all financial details are sanitized. SEC rules restrict broadcasting real identities of private assets during early syndicates.
              </p>
            </div>
          </div>
        </section>

        {/* PANEL B: ACTIVE SYNDICATE LEDGER (Center Column - 5 Units) */}
        <section className="xl:col-span-5 bg-[#050505] p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <div>
              <h2 className="font-mono text-sm font-bold text-[#F9F9F9] tracking-tight">ACTIVE SYNDICATION LEDGER</h2>
              <p className="text-xs text-[#888] font-mono">Live deal listings and corresponding equity trackers</p>
            </div>
            <span className="bg-[#111] text-[10px] font-mono text-[#888] px-2 py-0.5 border border-[#222]">
              SORT: RECENT
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[62vh] pr-1">
            {deals.map((deal) => {
              const pct = Math.min(100, Math.round((deal.equityRaised / deal.equityTarget) * 100)) || 0;
              const isSelected = selectedDealCode === deal.codename;

              return (
                <div 
                  key={deal.codename}
                  onClick={() => setSelectedDealCode(deal.codename)}
                  className={`border p-4 transition-all cursor-pointer relative ${
                    isSelected ? 'border-[#0ea5e9] bg-[#0c0c0c] terminal-glow-cyan' : 'border-[#222] hover:border-[#444] bg-[#070707]'
                  }`}
                >
                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <span className="absolute top-0 right-0 bg-[#0ea5e9] text-black font-mono text-[8px] font-bold px-2 py-0.5 uppercase">
                      Active Focal
                    </span>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="bg-[#1a1a1a] border border-[#222] text-[#0ea5e9] font-mono text-[9px] px-1.5 py-0.5 uppercase font-bold tracking-widest">
                        {deal.vertical}
                      </span>
                      <span className="text-[10px] text-[#666] font-mono ml-2">LOC: {deal.location}</span>
                    </div>
                    <div className="text-[10px] text-[#00FF66] font-mono font-bold">
                      Implied Asking: {formatCurrency(deal.asking)}
                    </div>
                  </div>

                  <h3 className="text-base font-bold font-mono text-[#F9F9F9] mt-2 group-hover:text-[#00FF66]">
                    {deal.codename}
                  </h3>
                  <p className="text-xs text-[#888] font-mono mb-3 leading-snug">{deal.headline}</p>

                  {/* Operational Metrics Strip */}
                  <div className="grid grid-cols-3 gap-px bg-[#222] text-center font-mono text-[10px] py-1 bg-neutral-900 mb-3">
                    <div className="bg-black py-1">
                      <span className="text-[#888] block text-[8px]">REVENUE</span>
                      <span className="text-white font-bold">{formatCurrency(deal.revenue)}</span>
                    </div>
                    <div className="bg-black py-1">
                      <span className="text-[#888] block text-[8px]">ADJ. EBITDA</span>
                      <span className="text-[#00FF66] font-bold">{formatCurrency(deal.ebitda)}</span>
                    </div>
                    <div className="bg-black py-1">
                      <span className="text-[#888] block text-[8px]">ASK MULTIPLE</span>
                      <span className="text-[#0ea5e9] font-bold">{(deal.asking / deal.ebitda).toFixed(2)}x</span>
                    </div>
                  </div>

                  {/* Progress Slider Track for Equity */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[#888]">EQUITY SYNDICATION CAP</span>
                      <span className="text-white font-bold">
                        {formatCurrency(deal.equityRaised)} / {formatCurrency(deal.equityTarget)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#111] h-2.5 border border-[#222] relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#0ea5e9] to-[#00FF66] h-full transition-all duration-300" 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Mini-meta footer */}
                  <div className="mt-3 flex justify-between items-center text-[9px] font-mono text-[#666]">
                    <span>SBA GUARANTEED: {deal.sbaEligible ? "YES (75%)" : "NO (CONVENTIONAL)"}</span>
                    <span>{deal.iois.length} INBOUND INTEREST LOGS</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Sandbox Action buttons */}
          <div className="border border-[#222] p-4 bg-[#0a0a0a] flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-left font-mono">
              <span className="text-[10px] text-[#00FF66] font-bold block">🚨 TEST OPERATOR COMMITS</span>
              <p className="text-[9px] text-[#888]">Inject simulated $50k syndication checks into the selected asset live.</p>
            </div>
            <button 
              onClick={addMockCommitment}
              className="w-full md:w-auto bg-[#0ea5e9]/10 border border-[#0ea5e9] hover:bg-[#0ea5e9]/20 text-[#0ea5e9] font-mono text-xs font-bold px-4 py-2"
            >
              INJECT COMMITMENT
            </button>
          </div>
        </section>

        {/* PANEL C: TERM-SHEET DESIGNER & IOI PIPELINE (Right Column - 4 Units) */}
        <section className="xl:col-span-4 bg-[#080808] border-l border-[#222] p-6 flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            
            {/* Sector Title */}
            <div className="border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#00FF66] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#00FF66]"></span>
                STANDBY TERM SHEET MODELER
              </h2>
              <p className="text-[10px] text-[#888] font-mono mt-0.5">Optimize buyer debt capacities & check real-time coverage factors</p>
            </div>

            {/* Selected Asset Core Specs */}
            <div className="bg-[#050505] p-4 border border-[#222] space-y-3 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#888]">MODEL TARGET:</span>
                <span className="text-xs font-bold text-white bg-[#111] px-2 py-0.5">{activeDeal?.codename}</span>
              </div>
              
              <div className="space-y-1 text-xs">
                <p className="text-[#888] text-[10px] uppercase">OPERATIONAL OVERVIEW</p>
                <p className="text-white text-xs leading-relaxed">{activeDeal?.description}</p>
              </div>

              {/* Slider for standby note */}
              <div className="space-y-2 pt-2 border-t border-[#111]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#888]">Seller Standby Note:</span>
                  <span className="text-[#00FF66] font-bold">{negotiatedSellerNote}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="1"
                  value={negotiatedSellerNote}
                  onChange={(e) => setNegotiatedSellerNote(Number(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#222] h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-neutral-600">
                  <span>0% (No Standby)</span>
                  <span>15% Standard</span>
                  <span>30% High Standby</span>
                </div>
              </div>
            </div>

            {/* Live Structural Amortization Matrix */}
            <div className="space-y-3 font-mono">
              <span className="text-[10px] text-[#888] tracking-widest uppercase block">PRO-FORMA TRANSACTIONS STRUCTURING</span>
              
              <div className="border border-[#222] divide-y divide-[#111] bg-[#0c0c0c] text-xs">
                
                <div className="p-3 flex justify-between">
                  <span className="text-[#888]">Total Purchase Asking:</span>
                  <span className="text-white font-bold">{formatCurrency(askingPrice)}</span>
                </div>

                <div className="p-3 flex justify-between">
                  <span className="text-[#888]">Equity Down (Syndicated):</span>
                  <span className="text-[#0ea5e9] font-bold">{formatCurrency(equityDownpaymentAmount)}</span>
                </div>

                <div className="p-3 flex justify-between">
                  <span className="text-[#888]">Seller Note Standby (Amortized):</span>
                  <span className="text-white font-bold">{formatCurrency(sellerStandbyNoteAmount)}</span>
                </div>

                <div className="p-3 flex justify-between">
                  <span className="text-[#888]">Implied SBA 7(a) Principal:</span>
                  <span className="text-white font-bold">{formatCurrency(sba7aLoanAmount)}</span>
                </div>

                <div className="p-3 flex justify-between bg-black">
                  <span className="text-[#888]">Est. Combined Annual Debt:</span>
                  <span className="text-[#FF3333] font-bold">{formatCurrency(totalAnnualDebtService)}</span>
                </div>

                <div className="p-3 flex justify-between bg-[#111] items-center">
                  <span className="text-[#00FF66] font-bold text-[10px]">DEBT COVERAGE RATIO (DSCR):</span>
                  <span className={`text-sm font-black ${dscr >= 1.25 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                    {dscr.toFixed(2)}x
                  </span>
                </div>

              </div>

              {/* DSCR Compliance Indicator Badge */}
              <div className="p-3 bg-[#0a0a0a] border border-[#222]">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 ${dscr >= 1.25 ? 'bg-[#00FF66]' : 'bg-[#FF3333]'}`}></span>
                  <span className="text-[10px] text-white font-bold">
                    {dscr >= 1.25 ? 'SBA ADVISORY: STRUCTURE COMPLIANT (>1.25x)' : 'SBA ADVISORY: RESTRUCTURE REQUIRED (<1.25x)'}
                  </span>
                </div>
                <p className="text-[9px] text-[#666] mt-1 leading-tight">
                  Increasing seller standby note % reduces external bank financing, yielding higher cash flow margins for equity syndicate partners.
                </p>
              </div>
            </div>

            {/* IOI Inbound Feed Queue */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#0ea5e9] font-mono tracking-widest uppercase block">INBOUND IOI PIPELINE PROTOCOL</span>
              <div className="space-y-1.5 max-h-[22vh] overflow-y-auto pr-1">
                {activeDeal?.iois.length === 0 ? (
                  <p className="text-xs text-[#555] font-mono italic">No inbound syndication commitments filed for this asset yet.</p>
                ) : (
                  activeDeal?.iois.map((ioi) => (
                    <div key={ioi.id} className="bg-black border border-[#222] p-2 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold text-[11px]">{ioi.investor}</span>
                          <span className="text-[8px] bg-[#111] text-[#666] px-1">{ioi.timestamp}</span>
                        </div>
                        <span className="text-[10px] text-[#00FF66] font-semibold">{formatCurrency(ioi.amount)}</span>
                        <span className="text-[#444] text-[9px] ml-1">[{ioi.type}]</span>
                      </div>
                      
                      <div className="flex space-x-1">
                        {ioi.status === 'PENDING' ? (
                          <>
                            <button 
                              onClick={() => updateIoiStatus(activeDeal.codename, ioi.id, 'APPROVED')}
                              className="bg-[#00FF66]/10 hover:bg-[#00FF66] hover:text-black border border-[#00FF66]/30 text-[#00FF66] text-[9px] px-1.5 py-0.5"
                            >
                              ACCEPT
                            </button>
                            <button 
                              onClick={() => updateIoiStatus(activeDeal.codename, ioi.id, 'REJECTED')}
                              className="bg-[#FF3333]/10 hover:bg-[#FF3333] hover:text-black border border-[#FF3333]/30 text-[#FF3333] text-[9px] px-1.5 py-0.5"
                            >
                              DECLINE
                            </button>
                          </>
                        ) : (
                          <span className={`text-[9px] px-2 py-0.5 uppercase ${
                            ioi.status === 'APPROVED' ? 'bg-[#00FF66]/10 text-[#00FF66]' : 'bg-[#FF3333]/10 text-[#FF3333]'
                          }`}>
                            {ioi.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Action Trigger Row */}
          <button 
            onClick={() => alert(`Syndicate Term sheet draft finalized for ${activeDeal?.codename}. Exporting to secure network...`)}
            className="w-full bg-[#00FF66] hover:bg-[#F9F9F9] text-black text-center font-mono text-xs font-bold py-3 uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
          >
            <span>LOCK SYNDICATE TERMS</span>
            <span>&rarr;</span>
          </button>
        </section>

      </main>

      {/* 3. COMPLIANCE & LEGAL BOTTOM COMPONENT */}
      <footer className="bg-black border-t border-[#222]">
        <div className="px-6 py-4 border-b border-[#222] grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66]"></span>
            <span>SEC RE-REGULATED</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#0EA5E9]"></span>
            <span>FINRA REPORTING STACK</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-white"></span>
            <span>ESU-1099 STANDARDS</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#FF3333]"></span>
            <span>SHA-512 SECURE REPLICAS</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 text-[11px] font-mono text-[#888] leading-relaxed space-y-4">
          <p>
            <span className="text-[#F9F9F9] font-bold">Regulatory Advisory:</span> Broker Deal Submit & Syndicate systems simulate strict underwriting conditions for private acquisition networks. Listings submitted under blind indicators cannot display trade identifiers without executed non-disclosure validation. Real-time updates do not imply official SEC-registered syndication offerings.
          </p>
          <div className="flex justify-between items-center text-[9px] text-neutral-600 border-t border-[#111] pt-4">
            <span>&copy; {new Date().getFullYear()} UNDERGROUND ACQUIRE CO. ALL SYSTEM INTENTS PRIVATIZED.</span>
            <span>SYSTEM AUDITED: LEDGER-STATUS OK</span>
          </div>
        </div>
      </footer>

    </div>
  );
}