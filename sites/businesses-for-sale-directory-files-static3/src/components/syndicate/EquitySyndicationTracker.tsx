import React, { useState, useMemo } from 'react';

export default function EquitySyndicationTracker() {
  // --- MOCK DATABASE STATE ---
  const [syndicates, setSyndicates] = useState([
    {
      id: "syn-1",
      codename: "PROJECT HELIOS",
      vertical: "Logistics",
      targetEquity: 1200000,
      committedEquity: 850000,
      minTicket: 50000,
      gpCarry: 15,
      interestYield: 8.5,
      debtMultiple: "3.1x",
      description: "Regional distribution & temperature-controlled shipping fleet. Prime Midwest lanes.",
      subscribersCount: 9,
      status: "OPEN" // OPEN, CLOSED, FUNDED
    },
    {
      id: "syn-2",
      codename: "PROJECT HYDRO",
      vertical: "HVAC",
      targetEquity: 650000,
      committedEquity: 650000,
      minTicket: 25000,
      gpCarry: 20,
      interestYield: 10.2,
      debtMultiple: "2.8x",
      description: "Industrial multi-zone HVAC & mechanical services provider. 15 technicians under master contracts.",
      subscribersCount: 14,
      status: "CLOSED"
    },
    {
      id: "syn-3",
      codename: "PROJECT APEX",
      vertical: "SaaS",
      targetEquity: 1980000,
      committedEquity: 450000,
      minTicket: 100000,
      gpCarry: 10,
      interestYield: 12.0,
      debtMultiple: "4.4x",
      description: "Proprietary CRM platform for specialized hazardous waste logistics operators.",
      subscribersCount: 3,
      status: "OPEN"
    }
  ]);

  const [iois, setIois] = useState([
    {
      id: "ioi-1",
      bidder: "Aegis Search Partners",
      target: "PROJECT HELIOS",
      offeredValuation: 4100000,
      equityContribution: 950000,
      sellerNoteStandby: 15, // percent
      status: "UNDER REVIEW", // APPROVED, UNDER REVIEW, ARCHIVED
      timestamp: "10:42:19 EST"
    },
    {
      id: "ioi-2",
      bidder: "Onyx Micro-PE",
      target: "PROJECT APEX",
      offeredValuation: 1850000,
      equityContribution: 500000,
      sellerNoteStandby: 20,
      status: "UNDER REVIEW",
      timestamp: "09:14:02 EST"
    },
    {
      id: "ioi-3",
      bidder: "Latitude Search Fund",
      target: "PROJECT HYDRO",
      offeredValuation: 2200000,
      equityContribution: 650000,
      sellerNoteStandby: 10,
      status: "ACCEPTED",
      timestamp: "07:30:11 EST"
    }
  ]);

  // --- NEW LISTING FORM STATE ---
  const [newListing, setNewListing] = useState({
    codename: '',
    vertical: 'Logistics',
    targetEquity: '',
    minTicket: '',
    gpCarry: '15',
    description: '',
  });

  // --- INTERACTIVE SELLER NOTE MODELER STATE ---
  const [askingPrice, setAskingPrice] = useState(2500000);
  const [sellerNotePercent, setSellerNotePercent] = useState(15);
  const [interestRate, setInterestRate] = useState(8.5);
  const [standbyPeriodMonths, setStandbyPeriodMonths] = useState(24);

  // --- SYSTEM STATS & LOGS ---
  const [systemLogs, setSystemLogs] = useState([
    { time: "11:58:02", msg: "Syndication ledger synchronized with SEC Edgar filing API." },
    { time: "11:42:19", msg: "New Inbound IOI submitted for PROJECT HELIOS by Aegis Search Partners." },
    { time: "11:15:30", msg: "Smart-contract escrow verified for subscriber #ETA-922." }
  ]);

  // --- FILTER STATE ---
  const [selectedVerticalFilter, setSelectedVerticalFilter] = useState("ALL");

  // --- HANDLERS ---
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.codename || !newListing.targetEquity) {
      alert("Please supply codename and target equity values.");
      return;
    }

    const created: typeof syndicates[0] = {
      id: `syn-${Date.now()}`,
      codename: newListing.codename.toUpperCase(),
      vertical: newListing.vertical,
      targetEquity: Number(newListing.targetEquity),
      committedEquity: 0,
      minTicket: Number(newListing.minTicket) || 25000,
      gpCarry: Number(newListing.gpCarry) || 15,
      interestYield: 9.0,
      debtMultiple: "3.0x",
      description: newListing.description || "Blinded transactional target.",
      subscribersCount: 0,
      status: "OPEN"
    };

    setSyndicates([created, ...syndicates]);
    addLog(`Operator published new blinded syndication deal: ${created.codename}`);
    setNewListing({
      codename: '',
      vertical: 'Logistics',
      targetEquity: '',
      minTicket: '',
      gpCarry: '15',
      description: '',
    });
  };

  const handleUpdateIoiStatus = (id: string, newStatus: string) => {
    setIois(iois.map(ioi => ioi.id === id ? { ...ioi, status: newStatus } : ioi));
    const targetIoi = iois.find(ioi => ioi.id === id);
    addLog(`IOI status updated to [${newStatus}] for bidder: ${targetIoi?.bidder}`);
  };

  const handleCommitCapital = (id: string, amount: number) => {
    setSyndicates(syndicates.map(syn => {
      if (syn.id === id) {
        const updatedCommitted = Math.min(syn.targetEquity, syn.committedEquity + amount);
        const fullyFunded = updatedCommitted >= syn.targetEquity;
        return {
          ...syn,
          committedEquity: updatedCommitted,
          subscribersCount: syn.subscribersCount + 1,
          status: fullyFunded ? "CLOSED" : "OPEN"
        };
      }
      return syn;
    }));
    const targetSyn = syndicates.find(s => s.id === id);
    addLog(`Subscriber injected $${(amount / 1000).toFixed(0)}K to ${targetSyn?.codename}`);
  };

  const addLog = (msg: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setSystemLogs([{ time: timeStr, msg }, ...systemLogs]);
  };

  // --- REAL-TIME CALCS ---
  const computedSellerNoteTotal = useMemo(() => {
    return (askingPrice * sellerNotePercent) / 100;
  }, [askingPrice, sellerNotePercent]);

  const computedAnnualInterest = useMemo(() => {
    return (computedSellerNoteTotal * interestRate) / 100;
  }, [computedSellerNoteTotal, interestRate]);

  const isSbaStandbyCompliant = useMemo(() => {
    // Standard rule: must have at least 24 months full standby to be considered equity injection by SBA 7a
    return standbyPeriodMonths >= 24;
  }, [standbyPeriodMonths]);

  const filteredSyndicates = useMemo(() => {
    if (selectedVerticalFilter === "ALL") return syndicates;
    return syndicates.filter(s => s.vertical.toUpperCase() === selectedVerticalFilter.toUpperCase());
  }, [syndicates, selectedVerticalFilter]);

  const totalEquityCommittedSum = useMemo(() => {
    return syndicates.reduce((acc, curr) => acc + curr.committedEquity, 0);
  }, [syndicates]);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] p-6 font-sans min-h-screen border-t border-[#222]">
      {/* Custom Styles Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        * {
          border-radius: 0px !important;
        }
        .glow-green-syndicate {
          box-shadow: 0 0 15px rgba(0, 255, 102, 0.1);
        }
        .glow-teal-syndicate {
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.1);
        }
        .glow-red-syndicate {
          box-shadow: 0 0 15px rgba(255, 51, 51, 0.1);
        }
      `}} />

      {/* TERMINAL BRANDED HEADER */}
      <div className="border border-[#222] bg-black p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#00FF66] text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-tighter">BROKER DEPT</span>
            <span className="text-[10px] font-mono text-[#0EA5E9] tracking-widest font-bold">SECURE PORTAL V2.4</span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
            M&amp;A DEAL SYNDICATE &amp; LEDGER DECK
          </h2>
          <p className="text-xs text-[#888] font-mono">Boutique search fund allocations, blinded submissions, and seller note modeling.</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-[#222] text-left font-mono text-xs w-full md:w-auto">
          <div className="bg-[#0c0c0c] p-2 px-3">
            <div className="text-[9px] text-[#888]">TOTAL PLACEMENT TARGET</div>
            <div className="font-bold text-[#F9F9F9]">$3.83M</div>
          </div>
          <div className="bg-[#0c0c0c] p-2 px-3">
            <div className="text-[9px] text-[#888]">COMMITTED EQUITY</div>
            <div className="font-bold text-[#00FF66]">{formatCurrency(totalEquityCommittedSum)}</div>
          </div>
          <div className="bg-[#0c0c0c] p-2 px-3 hidden lg:block">
            <div className="text-[9px] text-[#888]">LEDGER INTEGRITY</div>
            <div className="font-bold text-[#0EA5E9]">SHA-256 ACTIVE</div>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: SUBMISSIONS & NOTE CALCULATOR */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* 1. BLINDED DEAL SUBMITTER */}
          <div className="border border-[#222] bg-[#080808] p-5">
            <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4">
              <h3 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
                SUBMIT BLINDED LISTING
              </h3>
              <span className="text-[9px] font-mono text-neutral-500">ORIGINATION DEV-MODE</span>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="block text-[#888] text-[9px] uppercase tracking-wider">Codename (e.g., PROJECT VENUS)</label>
                <input 
                  type="text" 
                  value={newListing.codename}
                  onChange={(e) => setNewListing({...newListing, codename: e.target.value})}
                  placeholder="PROJECT ALPHA"
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] focus:ring-0 text-xs text-white p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[#888] text-[9px] uppercase tracking-wider">Sector/Vertical</label>
                  <select 
                    value={newListing.vertical}
                    onChange={(e) => setNewListing({...newListing, vertical: e.target.value})}
                    className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2.5 outline-none focus:border-[#0EA5E9]"
                  >
                    <option value="Logistics">Logistics</option>
                    <option value="SaaS">SaaS</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Home Services">Home Services</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[#888] text-[9px] uppercase tracking-wider">GP Carry Allocation</label>
                  <select 
                    value={newListing.gpCarry}
                    onChange={(e) => setNewListing({...newListing, gpCarry: e.target.value})}
                    className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2.5 outline-none focus:border-[#0EA5E9]"
                  >
                    <option value="10">10% Carry</option>
                    <option value="15">15% Carry</option>
                    <option value="20">20% Carry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[#888] text-[9px] uppercase tracking-wider">Target Equity Needed</label>
                  <input 
                    type="number" 
                    value={newListing.targetEquity}
                    onChange={(e) => setNewListing({...newListing, targetEquity: e.target.value})}
                    placeholder="e.g. 500000"
                    className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2.5 outline-none focus:border-[#0EA5E9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[#888] text-[9px] uppercase tracking-wider">Min LP Ticket</label>
                  <input 
                    type="number" 
                    value={newListing.minTicket}
                    onChange={(e) => setNewListing({...newListing, minTicket: e.target.value})}
                    placeholder="e.g. 50000"
                    className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2.5 outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[#888] text-[9px] uppercase tracking-wider">Blinded Description (Executive Abstract)</label>
                <textarea 
                  rows={2}
                  value={newListing.description}
                  onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                  placeholder="Provide essential operational context..."
                  className="w-full bg-[#050505] border border-[#222] text-xs text-white p-2.5 outline-none focus:border-[#0EA5E9] resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#00FF66]/10 border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black py-2.5 font-bold tracking-widest text-xs uppercase transition-colors"
              >
                PUBLISH TO SYNDICATE DECK
              </button>
            </form>
          </div>

          {/* 2. STANDBY NOTE STRUCTURING TERMINAL */}
          <div className="border border-[#222] bg-[#080808] p-5">
            <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4">
              <h3 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0ea5e9]"></span>
                SELLER NOTE NEGO-MODELER
              </h3>
              <span className="bg-[#111] text-[#0EA5E9] border border-[#222] px-1.5 py-0.5 text-[8px] font-mono">
                SBA SOP 50 10 COMPLIANT
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Inputs & Sliders */}
              <div className="space-y-2 bg-black p-3 border border-[#222]">
                <div className="flex justify-between items-center text-[10px] text-[#888]">
                  <span>IMPLIED TRANSACTION VALUE</span>
                  <span className="text-white font-bold">${askingPrice.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="500000" 
                  max="5000000" 
                  step="50000" 
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
                />
              </div>

              <div className="space-y-2 bg-black p-3 border border-[#222]">
                <div className="flex justify-between items-center text-[10px] text-[#888]">
                  <span>SELLER STANDBY NOTE PORTION</span>
                  <span className="text-[#00FF66] font-bold">{sellerNotePercent}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  step="2.5" 
                  value={sellerNotePercent}
                  onChange={(e) => setSellerNotePercent(Number(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[#888] text-[9px] uppercase tracking-wider">Interest Rate %</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] p-2 outline-none focus:border-[#0EA5E9] text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[#888] text-[9px] uppercase tracking-wider">Standby (Months)</label>
                  <input 
                    type="number" 
                    value={standbyPeriodMonths}
                    onChange={(e) => setStandbyPeriodMonths(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-[#222] p-2 outline-none focus:border-[#0EA5E9] text-xs text-white"
                  />
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="border border-neutral-800 bg-[#0c0c0c] p-3 text-xs space-y-2">
                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                  <span className="text-[#888]">Total Seller Debt:</span>
                  <span className="text-white font-bold">{formatCurrency(computedSellerNoteTotal)}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                  <span className="text-[#888]">Annual Interest Accrual:</span>
                  <span className="text-white font-bold">{formatCurrency(computedAnnualInterest)}</span>
                </div>
                
                {/* SBA Compliance Result Block */}
                <div className="pt-1.5 flex items-center justify-between">
                  <span className="text-[#888] text-[9px] uppercase">Equity Treatment Audit:</span>
                  {isSbaStandbyCompliant ? (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 font-bold">
                      SBA COMPLIANT STANDBY
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#FF3333]/10 text-[#FF3333] border border-[#FF3333]/20 font-bold">
                      INELIGIBLE AS INJECTION
                    </span>
                  )}
                </div>
                <p className="text-[9.5px] text-neutral-500 leading-tight">
                  {isSbaStandbyCompliant 
                    ? "✓ Full 24-month standby term qualifies toward SBA equity injection minimums under structural parameters."
                    : "⚠️ Notes with standby terms under 24 months are not recognized as part of buyer equity requirements by SBA lenders."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: ACTIVE DEALS & CO-INVESTMENT PROGRESS */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="border border-[#222] bg-[#080808] p-5 flex-grow">
            
            {/* Header with Filter Pills */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#222] pb-4 mb-5">
              <div>
                <h3 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                  <span className="inline-block w-1.5 h-3 bg-[#0ea5e9]"></span>
                  CO-INVESTMENT SYNDICATES
                </h3>
                <span className="text-[10px] text-neutral-500 font-mono">Live General Partner Offerings</span>
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap gap-1">
                {["ALL", "LOGISTICS", "SAAS", "HVAC"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedVerticalFilter(filter)}
                    className={`font-mono text-[9px] px-2 py-0.5 border ${
                      selectedVerticalFilter === filter
                        ? 'border-[#0ea5e9] text-[#0ea5e9] bg-[#0ea5e9]/5 font-bold'
                        : 'border-[#222] text-[#888] hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Active Syndicates */}
            <div className="space-y-6">
              {filteredSyndicates.length === 0 ? (
                <div className="border border-dashed border-[#222] p-8 text-center text-xs font-mono text-neutral-500">
                  NO PLACEMENTS COMPLY WITH SECTOR FILTERS.
                </div>
              ) : (
                filteredSyndicates.map((syn) => {
                  const percentFunded = Math.floor((syn.committedEquity / syn.targetEquity) * 100);
                  const isClosed = syn.status === "CLOSED" || percentFunded >= 100;
                  
                  return (
                    <div 
                      key={syn.id} 
                      className={`border p-4 space-y-4 relative bg-[#050505] transition-all duration-300 ${
                        isClosed ? 'border-[#222] opacity-70' : 'border-neutral-800 hover:border-neutral-700 glow-teal-syndicate'
                      }`}
                    >
                      {/* Top Meta Line */}
                      <div className="flex items-start justify-between font-mono">
                        <div>
                          <span className="bg-[#111] border border-neutral-800 text-[#0ea5e9] text-[9px] font-bold px-1.5 py-0.5 uppercase">
                            {syn.vertical}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1.5">{syn.codename}</h4>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 ${
                            isClosed ? 'bg-neutral-900 text-neutral-500 border border-neutral-800' : 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 animate-pulse'
                          }`}>
                            {isClosed ? 'CLOSED / CAP VERIFIED' : 'ACTIVE ALLOCATION'}
                          </span>
                          <div className="text-[9px] text-neutral-500 mt-1">{syn.subscribersCount} Subscribed LPs</div>
                        </div>
                      </div>

                      {/* Summary Abstract */}
                      <p className="text-xs font-mono text-neutral-400 leading-relaxed">
                        {syn.description}
                      </p>

                      {/* Structural Metrics */}
                      <div className="grid grid-cols-4 gap-px bg-neutral-800 text-center font-mono py-0.5 border border-neutral-800">
                        <div className="bg-black p-1.5">
                          <div className="text-[8px] text-neutral-500 uppercase">LP Min</div>
                          <div className="text-[11px] font-bold text-white">{formatCurrency(syn.minTicket)}</div>
                        </div>
                        <div className="bg-black p-1.5">
                          <div className="text-[8px] text-neutral-500 uppercase">GP Carry</div>
                          <div className="text-[11px] font-bold text-white">{syn.gpCarry}%</div>
                        </div>
                        <div className="bg-black p-1.5">
                          <div className="text-[8px] text-neutral-500 uppercase">Target EQ</div>
                          <div className="text-[11px] font-bold text-[#0ea5e9]">{formatCurrency(syn.targetEquity)}</div>
                        </div>
                        <div className="bg-black p-1.5">
                          <div className="text-[8px] text-neutral-500 uppercase">Implied Mult</div>
                          <div className="text-[11px] font-bold text-white">{syn.debtMultiple}</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 font-mono">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-neutral-500">Allocation Target Progress</span>
                          <span className="text-[#00FF66] font-bold">{percentFunded}% committed</span>
                        </div>
                        <div className="w-full bg-[#111] h-2 relative border border-neutral-800">
                          <div 
                            className="bg-gradient-to-r from-[#0ea5e9] to-[#00FF66] h-full transition-all duration-500"
                            style={{ width: `${percentFunded}%` }}
                          />
                        </div>
                      </div>

                      {/* Quick Action Simulation buttons */}
                      {!isClosed && (
                        <div className="flex gap-2 font-mono pt-1">
                          <button 
                            onClick={() => handleCommitCapital(syn.id, syn.minTicket)}
                            className="flex-1 bg-neutral-900 border border-neutral-800 text-[#00FF66] hover:bg-[#00FF66]/10 hover:border-[#00FF66] text-[10px] py-2 text-center font-bold tracking-wider uppercase transition-all"
                          >
                            + Commit Minimum Ticket ({formatCurrency(syn.minTicket)})
                          </button>
                          <button 
                            onClick={() => handleCommitCapital(syn.id, syn.targetEquity - syn.committedEquity)}
                            className="bg-[#0ea5e9]/10 border border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-black text-[10px] px-3 py-2 text-center font-bold tracking-wider uppercase transition-all"
                          >
                            Insta-Fund Cap
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INBOUND IOI QUEUE & AUDIT LOGGER */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          
          {/* 1. INBOUND IOI QUEUE */}
          <div className="border border-[#222] bg-[#080808] p-5 flex flex-col">
            <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4">
              <h3 className="font-mono text-xs font-bold tracking-wider text-[#0ea5e9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0ea5e9]"></span>
                INBOUND IOI PIPELINE
              </h3>
              <span className="text-[9px] font-mono text-neutral-500">VERIFY BIDDERS</span>
            </div>

            <div className="space-y-4 flex-grow">
              {iois.map((ioi) => (
                <div key={ioi.id} className="border border-[#222] bg-black p-3.5 space-y-3 font-mono text-xs">
                  
                  {/* Title Bar */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-bold tracking-tight">{ioi.bidder}</div>
                      <div className="text-[9px] text-neutral-500">Submitted: {ioi.timestamp}</div>
                    </div>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 border ${
                      ioi.status === 'ACCEPTED' 
                        ? 'border-[#00FF66]/30 text-[#00FF66] bg-[#00FF66]/5' 
                        : ioi.status === 'ARCHIVED'
                        ? 'border-neutral-800 text-neutral-500 bg-neutral-900'
                        : 'border-[#0ea5e9]/30 text-[#0ea5e9] bg-[#0ea5e9]/5'
                    }`}>
                      {ioi.status}
                    </span>
                  </div>

                  {/* IOI Target and offered value info */}
                  <div className="bg-[#080808] p-2.5 space-y-1.5 border border-neutral-900 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Target Asset:</span>
                      <span className="text-[#0EA5E9] font-bold">{ioi.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Proposed EV:</span>
                      <span className="text-white font-bold">{formatCurrency(ioi.offeredValuation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Equity Check:</span>
                      <span className="text-[#00FF66] font-bold">{formatCurrency(ioi.equityContribution)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Seller Note req:</span>
                      <span className="text-white font-bold">{ioi.sellerNoteStandby}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {ioi.status === 'UNDER REVIEW' && (
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase">
                      <button 
                        onClick={() => handleUpdateIoiStatus(ioi.id, 'ACCEPTED')}
                        className="bg-[#00FF66]/10 border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black py-1.5 transition-colors"
                      >
                        Accept to DD
                      </button>
                      <button 
                        onClick={() => handleUpdateIoiStatus(ioi.id, 'ARCHIVED')}
                        className="bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white py-1.5 transition-colors"
                      >
                        Decline Bid
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. REAL-TIME AUDIT LOG */}
          <div className="border border-[#222] bg-[#080808] p-5 flex flex-col">
            <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-3">
              <h3 className="font-mono text-xs font-bold tracking-wider text-[#FF3333] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#FF3333]"></span>
                TRANSACTION AUDIT TRACE
              </h3>
              <span className="inline-block w-2 h-2 bg-[#FF3333] animate-pulse"></span>
            </div>

            <div className="space-y-3 font-mono text-[10px] text-neutral-400 overflow-y-auto max-h-[180px]">
              {systemLogs.map((log, index) => (
                <div key={index} className="border-b border-neutral-900 pb-2">
                  <span className="text-neutral-600 font-bold block">{log.time} EST</span>
                  <span className="text-neutral-300 block mt-0.5">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}