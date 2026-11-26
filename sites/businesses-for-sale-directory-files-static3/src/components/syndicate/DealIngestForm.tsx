import React, { useState, useEffect } from 'react';

// TS Interface Definitions for terminal state stability
interface Deal {
  codename: string;
  vertical: string;
  location: string;
  revenue: number;
  ebitda: number;
  askingPrice: number;
  equityTarget: number;
  equityRaised: number;
  sellerNotePercent: number;
  sbaEligible: boolean;
  status: 'ORIGINATION' | 'SYNDICATING' | 'UNDER_CONTRACT' | 'CLOSED';
  description: string;
}

interface IOI {
  id: string;
  dealCodename: string;
  sponsorId: string;
  offerValue: number;
  equityCommitted: number;
  escrowVerified: boolean;
  timestamp: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export default function DealIngestForm() {
  // Mock Database - Initial State
  const [deals, setDeals] = useState<Deal[]>([
    {
      codename: "PROJECT HELIOS",
      vertical: "HVAC",
      location: "Phoenix, AZ",
      revenue: 4200000,
      ebitda: 980000,
      askingPrice: 3200000,
      equityTarget: 800000,
      equityRaised: 620000,
      sellerNotePercent: 15,
      sbaEligible: true,
      status: "SYNDICATING",
      description: "Premium commercial HVAC contractor with 85% recurring service contracts. Clean balance sheets, Tier-1 service managers."
    },
    {
      codename: "PROJECT NEPTUNE",
      vertical: "SaaS",
      location: "Remote / US",
      revenue: 1800000,
      ebitda: 720000,
      askingPrice: 2880000,
      equityTarget: 1200000,
      equityRaised: 450000,
      sellerNotePercent: 10,
      sbaEligible: false,
      status: "SYNDICATING",
      description: "B2B compliance software for localized healthcare systems. High customer retention (LTV/CAC ratio of 6.2x)."
    },
    {
      codename: "PROJECT VULCAN",
      vertical: "Manufacturing",
      location: "Ohio Valley",
      revenue: 8500000,
      ebitda: 1900000,
      askingPrice: 6100000,
      equityTarget: 1500000,
      equityRaised: 1500000,
      sellerNotePercent: 20,
      sbaEligible: true,
      status: "UNDER_CONTRACT",
      description: "Precision aerospace machining firm. Long-term defense tooling subcontracts with multi-year visibility."
    }
  ]);

  const [iois, setIois] = useState<IOI[]>([
    {
      id: "IOI-8921",
      dealCodename: "PROJECT HELIOS",
      sponsorId: "SPONSOR #3094 (Pacific Search)",
      offerValue: 3100000,
      equityCommitted: 350000,
      escrowVerified: true,
      timestamp: "10 mins ago",
      status: "PENDING"
    },
    {
      id: "IOI-8922",
      dealCodename: "PROJECT HELIOS",
      sponsorId: "SPONSOR #1105 (Atlas Micro-PE)",
      offerValue: 3250000,
      equityCommitted: 200000,
      escrowVerified: true,
      timestamp: "2 hours ago",
      status: "PENDING"
    },
    {
      id: "IOI-8923",
      dealCodename: "PROJECT NEPTUNE",
      sponsorId: "SPONSOR #7741 (Vertex HoldCo)",
      offerValue: 2750000,
      equityCommitted: 400000,
      escrowVerified: false,
      timestamp: "1 day ago",
      status: "PENDING"
    }
  ]);

  // Terminal States
  const [activeTab, setActiveTab] = useState<'INGEST' | 'LEDGER' | 'IOI_QUEUE'>('INGEST');
  const [selectedDealCode, setSelectedDealCode] = useState<string>("PROJECT HELIOS");
  const [operatorLog, setOperatorLog] = useState<string[]>([
    "INITIALIZING SYNDICATE LEDGER...",
    "SECURE DE-IDENTIFICATION SUBSYSTEMS ARMED.",
    "BROKER CONSOLE AUTHENTICATED [ID: #M&A-8991]."
  ]);

  // Form states for submitting new deal
  const [formData, setFormData] = useState({
    codename: "",
    vertical: "Logistics",
    location: "",
    revenue: 0,
    ebitda: 0,
    askingPrice: 0,
    equityTarget: 0,
    sellerNotePercent: 10,
    sbaEligible: true,
    description: ""
  });

  // Simulator State (Seller Standby Note Structuring)
  const [simNotePercent, setSimNotePercent] = useState<number>(15);
  const [simRate, setSimRate] = useState<number>(8.5);
  const [simAmortYears, setSimAmortYears] = useState<number>(5);

  // Time tracker state
  const [terminalTime, setTerminalTime] = useState<string>("12:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTerminalTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (message: string) => {
    setOperatorLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 9)]);
  };

  // Submit Deal handler
  const handleDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codename.trim()) {
      alert("CRITICAL ERROR: Deal Codename required.");
      return;
    }

    const newDealObj: Deal = {
      codename: formData.codename.toUpperCase().replace(/\s+/g, '_'),
      vertical: formData.vertical,
      location: formData.location || "US / REMOTE",
      revenue: Number(formData.revenue),
      ebitda: Number(formData.ebitda),
      askingPrice: Number(formData.askingPrice),
      equityTarget: Number(formData.equityTarget) || Math.floor(Number(formData.askingPrice) * 0.25),
      equityRaised: 0,
      sellerNotePercent: Number(formData.sellerNotePercent),
      sbaEligible: formData.sbaEligible,
      status: "SYNDICATING",
      description: formData.description || "Blinded description pending broker structural refinement."
    };

    setDeals([newDealObj, ...deals]);
    addLog(`BROKERS LISTED [${newDealObj.codename}] // $${(newDealObj.ebitda/1000).toFixed(0)}k Adj. EBITDA`);
    
    // Reset form
    setFormData({
      codename: "",
      vertical: "Logistics",
      location: "",
      revenue: 0,
      ebitda: 0,
      askingPrice: 0,
      equityTarget: 0,
      sellerNotePercent: 10,
      sbaEligible: true,
      description: ""
    });
    
    // Switch to ledger to view submission
    setActiveTab('LEDGER');
  };

  // Handle IOI update
  const updateIoiStatus = (id: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    setIois(prev => prev.map(ioi => {
      if (ioi.id === id) {
        // If accepted, add equity to deal
        if (newStatus === 'ACCEPTED' && ioi.status !== 'ACCEPTED') {
          setDeals(dPrev => dPrev.map(d => {
            if (d.codename === ioi.dealCodename) {
              const updatedRaised = Math.min(d.equityRaised + ioi.equityCommitted, d.equityTarget);
              addLog(`EQUITY COMMITTED TO ${d.codename}: +$${(ioi.equityCommitted/1000).toFixed(0)}K`);
              return { ...d, equityRaised: updatedRaised };
            }
            return d;
          }));
        }
        return { ...ioi, status: newStatus };
      }
      return ioi;
    }));
    addLog(`IOI COMPLIANCE UPDATED: ${id} -> ${newStatus}`);
  };

  // Selected Deal context helpers
  const selectedDeal = deals.find(d => d.codename === selectedDealCode) || deals[0];

  // Quick calculations for the Deal Simulator Card
  const calcSellerNotePrincipal = () => {
    return (selectedDeal.askingPrice * (simNotePercent / 100));
  };

  const calcAnnualSellerNoteService = () => {
    const p = calcSellerNotePrincipal();
    const r = (simRate / 100) / 12;
    const n = simAmortYears * 12;
    if (r === 0) return p / simAmortYears;
    const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return monthly * 12;
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] selection:bg-[#00FF66] selection:text-black font-sans min-h-screen flex flex-col border border-[#222]">
      
      {/* 1. COMPONENT INTERNAL HEADER */}
      <div className="bg-black border-b border-[#222] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#00FF66] text-black text-[10px] font-mono font-black px-1.5 py-0.5 tracking-tighter">BROKER PORTAL</span>
            <span className="text-[10px] font-mono text-[#0EA5E9] tracking-widest font-bold">M&amp;A ORIGINATION V3.12</span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
            DEAL SUBMIT &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F9F9] via-[#0EA5E9] to-[#00FF66]">SYNDICATE LEDGER</span>
          </h2>
          <p className="text-xs text-[#888] font-mono">Boutique search fund pipelines, equity targets, and secondary syndication ledger mechanics.</p>
        </div>

        {/* Live Terminal Clock & Operator Card */}
        <div className="flex items-center space-x-4 bg-[#0a0a0a] border border-[#222] p-3 font-mono">
          <div>
            <div className="text-[9px] text-[#888] tracking-widest">TERMINAL SECURE TIME</div>
            <div className="text-xs font-bold text-[#00FF66]" x-text="terminalTime">{terminalTime}</div>
          </div>
          <div className="border-l border-[#222] pl-3">
            <div className="text-[9px] text-[#888] tracking-widest">ACTIVE BROKER STATUS</div>
            <div className="text-xs font-bold text-[#0EA5E9]">SECURE (LEVEL 4)</div>
          </div>
        </div>
      </div>

      {/* 2. TABBED CONTROLS */}
      <div className="flex bg-[#080808] border-b border-[#222] overflow-x-auto">
        <button 
          onClick={() => { setActiveTab('INGEST'); addLog('NAVIGATED TO BLINDED INGESTION MODULE'); }}
          className={`px-6 py-4 border-r border-[#222] font-mono text-xs tracking-wider font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'INGEST' ? 'bg-[#00FF66]/10 text-[#00FF66] border-b-2 border-b-[#00FF66]' : 'text-[#888] hover:text-[#F9F9F9]'
          }`}
        >
          <span>[1] INGEST NEW DEALS</span>
        </button>
        <button 
          onClick={() => { setActiveTab('LEDGER'); addLog('NAVIGATED TO SYNDICATED LEDGER LIST'); }}
          className={`px-6 py-4 border-r border-[#222] font-mono text-xs tracking-wider font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'LEDGER' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] border-b-2 border-b-[#0EA5E9]' : 'text-[#888] hover:text-[#F9F9F9]'
          }`}
        >
          <span>[2] EQUITY SYNDICATION LEDGER</span>
          <span className="bg-neutral-800 text-[#F9F9F9] text-[9px] px-1">{deals.length}</span>
        </button>
        <button 
          onClick={() => { setActiveTab('IOI_QUEUE'); addLog('NAVIGATED TO INBOUND IOI QUEUE'); }}
          className={`px-6 py-4 border-r border-[#222] font-mono text-xs tracking-wider font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'IOI_QUEUE' ? 'bg-[#FF3333]/10 text-[#FF3333] border-b-2 border-b-[#FF3333]' : 'text-[#888] hover:text-[#F9F9F9]'
          }`}
        >
          <span>[3] INBOUND IOI QUEUE</span>
          <span className="bg-[#FF3333]/20 text-[#FF3333] text-[9px] px-1 font-bold">
            {iois.filter(i => i.status === 'PENDING').length} NEW
          </span>
        </button>
      </div>

      {/* 3. MAIN TERMINAL BODY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-grow">
        
        {/* Left Column (Changes based on selected tab) */}
        <div className="lg:col-span-8 bg-[#050505] p-6 border-r border-[#222] flex flex-col justify-between">
          
          {/* TAB 1: SUBMIT BLINDED DEALS FORM */}
          {activeTab === 'INGEST' && (
            <div className="space-y-6">
              <div className="border-b border-[#222] pb-3">
                <h3 className="text-sm font-mono font-bold tracking-widest text-[#00FF66] flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 bg-[#00FF66]"></span>
                  BLINDED LISTING METRICS SUBMISSION
                </h3>
                <p className="text-xs text-[#888] font-mono mt-1">
                  Ensure company specific identity metrics (IP address, real name, client names) are replaced with a secure uppercase codename.
                </p>
              </div>

              <form onSubmit={handleDealSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Codename */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-[#888] tracking-wider uppercase">DEAL CODENAME (e.g. PROJECT AURORA)</label>
                    <input 
                      type="text"
                      required
                      placeholder="PROJECT CODENAME"
                      value={formData.codename}
                      onChange={(e) => setFormData({...formData, codename: e.target.value})}
                      className="w-full bg-black border border-[#222] focus:border-[#00FF66] text-xs font-mono text-[#F9F9F9] p-3 outline-none"
                    />
                  </div>

                  {/* Vertical */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-[#888] tracking-wider uppercase">INDUSTRY VERTICAL</label>
                    <select
                      value={formData.vertical}
                      onChange={(e) => setFormData({...formData, vertical: e.target.value})}
                      className="w-full bg-black border border-[#222] focus:border-[#00FF66] text-xs font-mono text-[#F9F9F9] p-3 outline-none"
                    >
                      <option value="Logistics">Logistics &amp; Distribution</option>
                      <option value="SaaS">SaaS &amp; Tech Systems</option>
                      <option value="Manufacturing">Manufacturing &amp; Aerospace</option>
                      <option value="HVAC">HVAC &amp; Mechanical</option>
                      <option value="Home Services">Home Services &amp; Residential</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Revenue */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-[#888] tracking-wider uppercase">ANNUAL REVENUE ($)</label>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 5200000"
                      value={formData.revenue || ''}
                      onChange={(e) => setFormData({...formData, revenue: Number(e.target.value)})}
                      className="w-full bg-black border border-[#222] focus:border-[#00FF66] text-xs font-mono text-[#F9F9F9] p-3 outline-none"
                    />
                  </div>

                  {/* Adjusted EBITDA */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-[#888] tracking-wider uppercase">ADJUSTED EBITDA ($)</label>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 1100000"
                      value={formData.ebitda || ''}
                      onChange={(e) => setFormData({...formData, ebitda: Number(e.target.value)})}
                      className="w-full bg-black border border-[#222] focus:border-[#00FF66] text-xs font-mono text-[#00FF66] font-bold p-3 outline-none"
                    />
                  </div>

                  {/* Asking Price */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-[#888] tracking-wider uppercase">ASKING PRICE ($)</label>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 3500000"
                      value={formData.askingPrice || ''}
                      onChange={(e) => setFormData({...formData, askingPrice: Number(e.target.value)})}
                      className="w-full bg-black border border-[#222] focus:border-[#00FF66] text-xs font-mono text-[#0EA5E9] font-bold p-3 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Location Area */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-[#888] tracking-wider uppercase">REGIONAL HUB / GEOGRAPHY</label>
                    <input 
                      type="text"
                      placeholder="e.g. Pacific Northwest"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-black border border-[#222] focus:border-[#00FF66] text-xs font-mono text-[#F9F9F9] p-3 outline-none"
                    />
                  </div>

                  {/* Equity Raise Goal */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-[#888] tracking-wider uppercase">EQUITY TARGET ($)</label>
                    <input 
                      type="number"
                      placeholder="Leave blank to default to 25%"
                      value={formData.equityTarget || ''}
                      onChange={(e) => setFormData({...formData, equityTarget: Number(e.target.value)})}
                      className="w-full bg-black border border-[#222] focus:border-[#00FF66] text-xs font-mono text-white p-3 outline-none"
                    />
                  </div>

                  {/* Seller Note Percentage */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-[#888] tracking-wider uppercase">SELLER NOTE STANDBY (%)</label>
                    <select
                      value={formData.sellerNotePercent}
                      onChange={(e) => setFormData({...formData, sellerNotePercent: Number(e.target.value)})}
                      className="w-full bg-black border border-[#222] focus:border-[#00FF66] text-xs font-mono text-[#F9F9F9] p-3 outline-none"
                    >
                      <option value="5">5% Seller Carry</option>
                      <option value="10">10% Seller Carry</option>
                      <option value="15">15% Seller Carry</option>
                      <option value="20">20% Seller Carry</option>
                    </select>
                  </div>
                </div>

                {/* SBA Toggle & Blinded Description */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 bg-[#0a0a0a] border border-[#222] p-4 flex flex-col justify-center">
                    <span className="font-mono text-[10px] text-[#888] tracking-wider uppercase mb-2">SBA Pre-Qualified Target</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">ELIGIBILITY:</span>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, sbaEligible: !formData.sbaEligible})}
                        className={`px-3 py-1 text-[11px] font-mono font-bold border transition-colors ${
                          formData.sbaEligible ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66]' : 'bg-black border-[#222] text-[#888]'
                        }`}
                      >
                        {formData.sbaEligible ? '[PRE-QUALIFIED]' : '[INELIGIBLE]'}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-1">
                    <label className="block font-mono text-[10px] text-[#888] tracking-wider uppercase">BLINDED DESCRIPTION / STABILITY STATEMENT</label>
                    <textarea 
                      rows={2}
                      placeholder="Detail operational redundancies, client profile concentration levels, and staff transitions..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-black border border-[#222] focus:border-[#00FF66] text-xs font-mono text-[#F9F9F9] p-3 outline-none resize-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#00FF66] text-black hover:bg-[#F9F9F9] font-mono text-xs font-bold tracking-widest uppercase py-4 transition-all"
                >
                  TRANSMIT BLINDED DEAL TO TERMINAL STREAM &rarr;
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: EQUITY SYNDICATION LEDGER */}
          {activeTab === 'LEDGER' && (
            <div className="space-y-6">
              <div className="border-b border-[#222] pb-3 flex justify-between items-end">
                <div>
                  <h3 className="text-sm font-mono font-bold tracking-widest text-[#0EA5E9] flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 bg-[#0EA5E9]"></span>
                    ACTIVE DEALS SYNDICATION OVERVIEW
                  </h3>
                  <p className="text-xs text-[#888] font-mono mt-1">
                    Live fundraising logs tracking active equity commitments from vetted search sponsors.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-[#888] bg-black border border-[#222] px-2 py-1">
                  TOTAL PIPELINE: <span className="text-white font-bold">{deals.length}</span>
                </div>
              </div>

              <div className="space-y-4">
                {deals.map((deal) => {
                  const percentRaised = Math.min((deal.equityRaised / deal.equityTarget) * 100, 100);
                  const isFullyFunded = percentRaised >= 100;

                  return (
                    <div 
                      key={deal.codename}
                      onClick={() => { setSelectedDealCode(deal.codename); addLog(`LEDGER FOCUS CHANGED TO: ${deal.codename}`); }}
                      className={`border p-4 transition-all cursor-pointer relative bg-black ${
                        selectedDealCode === deal.codename ? 'border-[#0EA5E9] glow-teal' : 'border-[#222] hover:border-[#444]'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-[#F9F9F9]">{deal.codename}</span>
                            <span className="text-[9px] font-mono bg-neutral-900 px-1 text-white/50">{deal.vertical}</span>
                            <span className="text-[9px] font-mono bg-[#111] border border-[#222] px-1 text-[#00FF66]">{deal.location}</span>
                          </div>
                          <p className="text-xs font-mono text-[#888] mt-1 line-clamp-1">{deal.description}</p>
                        </div>
                        <div className="text-right flex flex-row md:flex-col gap-2 md:gap-0 justify-between md:justify-end items-center md:items-end">
                          <span className="text-[10px] font-mono text-[#888]">ASKING PURCHASE:</span>
                          <span className="text-xs font-mono text-[#0EA5E9] font-bold">
                            ${(deal.askingPrice / 1000000).toFixed(2)}M
                          </span>
                        </div>
                      </div>

                      {/* Financial 3-Bar Stats */}
                      <div className="grid grid-cols-3 gap-px bg-[#222] border border-[#222] font-mono text-center my-3 text-[10px]">
                        <div className="bg-[#050505] p-2">
                          <span className="text-[#888]">EBITDA:</span> <span className="text-[#00FF66] font-semibold">${(deal.ebitda/1000).toFixed(0)}k</span>
                        </div>
                        <div className="bg-[#050505] p-2">
                          <span className="text-[#888]">SELLER CARRY:</span> <span className="text-white font-semibold">{deal.sellerNotePercent}%</span>
                        </div>
                        <div className="bg-[#050505] p-2">
                          <span className="text-[#888]">SBA STATUS:</span> <span className={deal.sbaEligible ? 'text-[#00FF66] font-semibold' : 'text-neutral-600'}>{deal.sbaEligible ? 'YES' : 'NO'}</span>
                        </div>
                      </div>

                      {/* Progress Bar for Equity Syndication */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-[#888]">EQUITY SYNDICATION TARGET PROGRESS</span>
                          <span className={`${isFullyFunded ? 'text-[#00FF66]' : 'text-[#0EA5E9]'} font-bold`}>
                            ${(deal.equityRaised/1000).toFixed(0)}k / ${(deal.equityTarget/1000).toFixed(0)}k ({percentRaised.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-[#111] h-1.5 border border-[#222] relative">
                          <div 
                            className={`h-full transition-all duration-500 ${isFullyFunded ? 'bg-[#00FF66]' : 'bg-[#0EA5E9]'}`}
                            style={{ width: `${percentRaised}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: INBOUND IOI QUEUE */}
          {activeTab === 'IOI_QUEUE' && (
            <div className="space-y-6">
              <div className="border-b border-[#222] pb-3 flex justify-between items-end">
                <div>
                  <h3 className="text-sm font-mono font-bold tracking-widest text-[#FF3333] flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 bg-[#FF3333]"></span>
                    INBOUND INDICATION OF INTEREST (IOI) DECK
                  </h3>
                  <p className="text-xs text-[#888] font-mono mt-1">
                    Broker-moderated portal to review operational cash reserves and approve binding/non-binding intent.
                  </p>
                </div>
              </div>

              {iois.length === 0 ? (
                <div className="border border-dashed border-[#222] p-8 text-center font-mono">
                  <span className="text-xs text-[#888]">NO INBOUND BID ACTIVITY RECORDED</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {iois.map((ioi) => (
                    <div 
                      key={ioi.id} 
                      className={`border p-4 bg-black font-mono transition-all ${
                        ioi.status === 'ACCEPTED' ? 'border-[#00FF66]/50 bg-[#00FF66]/5' : 
                        ioi.status === 'REJECTED' ? 'border-[#FF3333]/50 bg-[#FF3333]/5' : 'border-[#222]'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-[#111] border border-[#222] px-1.5 py-0.5 text-[#0EA5E9] font-bold text-[10px]">{ioi.id}</span>
                            <span className="text-white font-semibold">{ioi.dealCodename}</span>
                            <span className="text-neutral-500">|</span>
                            <span className="text-white">{ioi.sponsorId}</span>
                          </div>
                          
                          <div className="mt-2 grid grid-cols-2 gap-4 text-[11px] text-[#888]">
                            <div>OFFER PURCHASE: <span className="text-[#0EA5E9] font-bold">${(ioi.offerValue/1000000).toFixed(2)}M</span></div>
                            <div>EQUITY COMMITTED: <span className="text-[#00FF66] font-bold">${(ioi.equityCommitted/1000).toFixed(0)}k</span></div>
                          </div>

                          <div className="mt-2 flex items-center space-x-2 text-[10px]">
                            <span className="text-[#888]">ESCROW FUNDS VERIFIED:</span>
                            <span className={ioi.escrowVerified ? 'text-[#00FF66] font-bold' : 'text-[#FF3333] font-bold'}>
                              {ioi.escrowVerified ? '[VERIFIED]' : '[PENDING PROOF OF FUNDS]'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col gap-2 justify-end">
                          {ioi.status === 'PENDING' ? (
                            <>
                              <button 
                                onClick={() => updateIoiStatus(ioi.id, 'ACCEPTED')}
                                className="bg-[#00FF66] hover:bg-white text-black text-[10px] font-bold py-1 px-3 tracking-wider uppercase transition-all"
                              >
                                APPROVE &amp; ALLOCATE
                              </button>
                              <button 
                                onClick={() => updateIoiStatus(ioi.id, 'REJECTED')}
                                className="bg-transparent border border-[#FF3333] hover:bg-[#FF3333] hover:text-white text-[#FF3333] text-[10px] font-bold py-1 px-3 tracking-wider uppercase transition-all"
                              >
                                REJECT BID
                              </button>
                            </>
                          ) : (
                            <span className={`text-[11px] font-bold tracking-widest text-right ${
                              ioi.status === 'ACCEPTED' ? 'text-[#00FF66]' : 'text-[#FF3333]'
                            }`}>
                              {ioi.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Persistent Real-time Stream Terminal Log Output */}
          <div className="mt-6 pt-4 border-t border-[#1a1a1a]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] text-[#888] tracking-widest">LIVE LEDGER EVENT LOGSTREAM: COMPLIANT</span>
              <span className="w-1.5 h-1.5 bg-[#00FF66] animate-pulse"></span>
            </div>
            <div className="bg-black p-3 border border-[#222] h-[90px] overflow-y-auto font-mono text-[10px] text-[#888] space-y-1">
              {operatorLog.map((log, idx) => (
                <div key={idx} className={idx === 0 ? 'text-[#00FF66]' : 'text-neutral-500'}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Analysis & Standby Term sheet Generator */}
        <aside className="lg:col-span-4 bg-[#080808] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
                TRANSACTION LEVERAGE METRICS
              </h2>
            </div>

            {/* Selected Deal Snapshot */}
            <div className="bg-[#0a0a0a] border border-[#222] p-4 space-y-3">
              <span className="text-[10px] font-mono text-[#888] tracking-wider block">ACTIVE CONTEXT TARGET</span>
              <div>
                <h4 className="font-mono text-base font-bold text-[#F9F9F9] tracking-tight">{selectedDeal.codename}</h4>
                <p className="text-[11px] text-[#888] font-mono mt-1">{selectedDeal.description}</p>
              </div>

              <div className="space-y-2 border-t border-[#222] pt-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Asking Purchase:</span>
                  <span className="text-white">${selectedDeal.askingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Adjusted EBITDA:</span>
                  <span className="text-[#00FF66] font-semibold">${selectedDeal.ebitda.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Multiple Ratio:</span>
                  <span className="text-[#0EA5E9] font-bold">{(selectedDeal.askingPrice / selectedDeal.ebitda).toFixed(2)}x</span>
                </div>
              </div>
            </div>

            {/* Standby Seller Note Interest Simulator */}
            <div className="bg-[#0c0c0c] border border-[#222] p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-[#222] pb-2">
                <span className="text-[10px] font-mono text-[#00FF66] tracking-widest uppercase font-bold">STANDBY SELLER NOTE INTERMEDIARY SIMULATOR</span>
              </div>

              {/* Slider for carry portion */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888]">Seller Carry %:</span>
                  <span className="text-white font-bold">{simNotePercent}%</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="30"
                  step="2.5"
                  value={simNotePercent}
                  onChange={(e) => setSimNotePercent(Number(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888]">Interest Rate (SBA Standby):</span>
                  <span className="text-[#0EA5E9] font-bold">{simRate}%</span>
                </div>
                <input 
                  type="range"
                  min="4.0"
                  max="12.0"
                  step="0.5"
                  value={simRate}
                  onChange={(e) => setSimRate(Number(e.target.value))}
                  className="w-full accent-[#0ea5e9] bg-[#222] h-1 cursor-pointer"
                />
              </div>

              {/* Moratorium Duration */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888]">Amortization Frame:</span>
                  <span className="text-white font-bold">{simAmortYears} Years</span>
                </div>
                <input 
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={simAmortYears}
                  onChange={(e) => setSimAmortYears(Number(e.target.value))}
                  className="w-full accent-white bg-[#222] h-1 cursor-pointer"
                />
              </div>

              {/* Outputs block */}
              <div className="bg-[#050505] p-3 border border-[#222] font-mono text-[11px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Seller Note Principal:</span>
                  <span className="text-white font-bold">${calcSellerNotePrincipal().toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Est. Annual Service Debt:</span>
                  <span className="text-[#FF3333] font-bold">${calcAnnualSellerNoteService().toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                </div>
                <div className="flex justify-between border-t border-[#222] pt-1.5">
                  <span className="text-neutral-500">Post-Debt Service Cash Cushion:</span>
                  <span className="text-[#00FF66] font-bold">
                    ${(selectedDeal.ebitda - calcAnnualSellerNoteService()).toLocaleString(undefined, {maximumFractionDigits:0})}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System Advisory zone */}
          <div className="p-3 bg-yellow-950/10 border border-yellow-600/30 text-xs font-mono">
            <div className="text-yellow-500 font-bold text-[9px] tracking-wider uppercase mb-1">SBA STANDBY TERMS NOTE</div>
            <p className="text-white/50 text-[10px] leading-relaxed">
              SBA Standard Operating Procedures require a 24-month full standby period (no interest or principal payments) for seller debt counted as equity injection.
            </p>
          </div>
        </aside>

      </div>

      {/* 4. INTEGRATED COMPLIANCE & ESCROW BADGES BAR */}
      <footer className="bg-black border-t border-[#222] mt-auto">
        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center">
          <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66]"></span>
            <span>SECURE ESCROW VALIDATION</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#0EA5E9]"></span>
            <span>AML REGISTERED M&amp;A BROKERAGE</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-white"></span>
            <span>SBA STANDBY COMPLIANT</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#FF3333]"></span>
            <span>SHA-256 LEDGER PROTOCOL</span>
          </div>
        </div>
      </footer>
      
    </div>
  );
}