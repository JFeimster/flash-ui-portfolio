import React, { useState, useMemo } from 'react';

// ==========================================
// TYPE DEFINITIONS
// ==========================================
interface Listing {
  id: string;
  codename: string;
  vertical: 'SaaS' | 'Manufacturing' | 'Logistics' | 'HVAC' | 'Home Services';
  location: string;
  ebitda: number;
  asking: number;
  sellerNotePercent: number; // e.g. 15 for 15%
  targetEquity: number;
  raisedEquity: number;
  status: 'ACTIVE' | 'UNDER CONTRACT' | 'CLOSED';
}

interface Ioi {
  id: string;
  listingId: string;
  buyerName: string;
  buyerType: 'Search Fund' | 'Micro-PE' | 'Strategic' | 'Individual';
  offeredValuation: number;
  proposedDebtPercent: number; // SBA / Senior Debt %
  proposedStandbyPercent: number; // Seller Standby Note %
  equityContribution: number;
  status: 'UNDER_REVIEW' | 'NEGOTIATING_STANDBY' | 'LOI_PREP' | 'REJECTED';
  timestamp: string;
}

export default function IoiManagerTable() {
  // ==========================================
  // INITIAL MOCK DATA
  // ==========================================
  const [listings, setListings] = useState<Listing[]>([
    {
      id: 'lst-1',
      codename: 'PROJECT ALPHA-SECURE',
      vertical: 'SaaS',
      location: 'Remote / US East',
      ebitda: 620000,
      asking: 2200000,
      sellerNotePercent: 15,
      targetEquity: 350000,
      raisedEquity: 290000,
      status: 'ACTIVE',
    },
    {
      id: 'lst-2',
      codename: 'PROJECT KEVLAR-HEAVY',
      vertical: 'Manufacturing',
      location: 'Midwest Hub',
      ebitda: 1450000,
      asking: 4800000,
      sellerNotePercent: 10,
      targetEquity: 850000,
      raisedEquity: 450000,
      status: 'ACTIVE',
    },
    {
      id: 'lst-3',
      codename: 'PROJECT NEXUS-FLOW',
      vertical: 'HVAC',
      location: 'Dallas, TX',
      ebitda: 950000,
      asking: 3100000,
      sellerNotePercent: 15,
      targetEquity: 500000,
      raisedEquity: 500000, // Fully funded
      status: 'UNDER CONTRACT',
    },
    {
      id: 'lst-4',
      codename: 'PROJECT RAPID-CARGO',
      vertical: 'Logistics',
      location: 'Port of Savannah',
      ebitda: 550000,
      asking: 1650000,
      sellerNotePercent: 20,
      targetEquity: 250000,
      raisedEquity: 120000,
      status: 'ACTIVE',
    }
  ]);

  const [iois, setIois] = useState<Ioi[]>([
    {
      id: 'ioi-101',
      listingId: 'lst-1',
      buyerName: 'Ironclad Search Partners II',
      buyerType: 'Search Fund',
      offeredValuation: 2100000,
      proposedDebtPercent: 75,
      proposedStandbyPercent: 15,
      equityContribution: 210000,
      status: 'UNDER_REVIEW',
      timestamp: '2023-11-20 14:02:11',
    },
    {
      id: 'ioi-102',
      listingId: 'lst-1',
      buyerName: 'Vanguard Micro-PE',
      buyerType: 'Micro-PE',
      offeredValuation: 2200000,
      proposedDebtPercent: 80,
      proposedStandbyPercent: 10,
      equityContribution: 220000,
      status: 'NEGOTIATING_STANDBY',
      timestamp: '2023-11-19 09:45:30',
    },
    {
      id: 'ioi-103',
      listingId: 'lst-2',
      buyerName: 'Centurion Holdings',
      buyerType: 'Strategic',
      offeredValuation: 4500000,
      proposedDebtPercent: 70,
      proposedStandbyPercent: 15,
      equityContribution: 1125000,
      status: 'UNDER_REVIEW',
      timestamp: '2023-11-20 11:15:00',
    },
    {
      id: 'ioi-104',
      listingId: 'lst-3',
      buyerName: 'Heliostat Capital',
      buyerType: 'Search Fund',
      offeredValuation: 3100000,
      proposedDebtPercent: 75,
      proposedStandbyPercent: 15,
      equityContribution: 310000,
      status: 'LOI_PREP',
      timestamp: '2023-11-18 16:30:22',
    }
  ]);

  // ==========================================
  // COMPONENT STATE & UI BINDINGS
  // ==========================================
  const [selectedListingId, setSelectedListingId] = useState<string>('lst-1');
  const [showAddListing, setShowAddListing] = useState<boolean>(false);

  // Form State for new blind listing
  const [newCodename, setNewCodename] = useState('');
  const [newVertical, setNewVertical] = useState<'SaaS' | 'Manufacturing' | 'Logistics' | 'HVAC' | 'Home Services'>('SaaS');
  const [newLocation, setNewLocation] = useState('');
  const [newEbitda, setNewEbitda] = useState(0);
  const [newAsking, setNewAsking] = useState(0);
  const [newSellerNote, setNewSellerNote] = useState(15);
  const [newTargetEquity, setNewTargetEquity] = useState(0);

  // Selected Listing Computations
  const selectedListing = useMemo(() => {
    return listings.find(l => l.id === selectedListingId) || listings[0];
  }, [listings, selectedListingId]);

  // IOIs matched to selected listing
  const filteredIois = useMemo(() => {
    return iois.filter(i => i.listingId === selectedListingId);
  }, [iois, selectedListingId]);

  // ==========================================
  // SIMULATION SANDBOX CONTROLS
  // ==========================================
  const [simValuation, setSimValuation] = useState<number>(0);
  const [simSbaPercent, setSimSbaPercent] = useState<number>(75);
  const [simStandbyPercent, setSimStandbyPercent] = useState<number>(15);

  // Keep sandbox values in sync with selected listing by default
  React.useEffect(() => {
    if (selectedListing) {
      setSimValuation(selectedListing.asking);
      setSimStandbyPercent(selectedListing.sellerNotePercent);
      // SBA defaults to 75%
      setSimSbaPercent(75);
    }
  }, [selectedListing]);

  // Dynamic Sim Outputs
  const simDebtAmt = (simValuation * simSbaPercent) / 100;
  const simStandbyAmt = (simValuation * simStandbyPercent) / 100;
  const simEquityRequired = Math.max(0, simValuation - simDebtAmt - simStandbyAmt);

  // Estimated Debt service (SBA 7a: 10-year term, currently ~10.5% variable interest rate)
  const estAnnualDebtService = useMemo(() => {
    const principal = simDebtAmt;
    const annualRate = 0.105; 
    const months = 120;
    const monthlyRate = annualRate / 12;
    if (principal <= 0) return 0;
    
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                           (Math.pow(1 + monthlyRate, months) - 1);
    return monthlyPayment * 12;
  }, [simDebtAmt]);

  const simDscr = useMemo(() => {
    if (!selectedListing || estAnnualDebtService <= 0) return 0;
    return selectedListing.ebitda / estAnnualDebtService;
  }, [selectedListing, estAnnualDebtService]);

  // ==========================================
  // ACTIONS / PERSISTENCE
  // ==========================================
  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodename || !newLocation) {
      alert("Missing terminal required identification fields.");
      return;
    }

    const listing: Listing = {
      id: `lst-${Date.now()}`,
      codename: newCodename.toUpperCase().trim(),
      vertical: newVertical,
      location: newLocation.trim(),
      ebitda: Number(newEbitda),
      asking: Number(newAsking),
      sellerNotePercent: Number(newSellerNote),
      targetEquity: Number(newTargetEquity),
      raisedEquity: 0,
      status: 'ACTIVE'
    };

    setListings([...listings, listing]);
    setSelectedListingId(listing.id);
    setShowAddListing(false);

    // Reset fields
    setNewCodename('');
    setNewLocation('');
    setNewEbitda(0);
    setNewAsking(0);
    setNewSellerNote(15);
    setNewTargetEquity(0);
  };

  const handleUpdateIoiStatus = (ioiId: string, nextStatus: Ioi['status']) => {
    setIois(prev => prev.map(i => i.id === ioiId ? { ...i, status: nextStatus } : i));
  };

  const handleCommitEquity = (listingId: string, amount: number) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const nextRaised = Math.min(l.targetEquity, l.raisedEquity + amount);
        return { ...l, raisedEquity: nextRaised };
      }
      return l;
    }));
  };

  // Helper formats
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] border border-[#222] font-sans antialiased w-full p-4 md:p-6 flex flex-col space-y-6 select-none rounded-none">
      
      {/* SECTION TERMINAL PROTOCOL HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#222] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#00FF66] text-black text-[9px] font-mono font-bold px-1.5 py-0.5 tracking-tighter">SECURE OPERATOR</span>
            <span className="text-[10px] font-mono text-[#0EA5E9] tracking-widest font-bold">SYNDICATE LEDGER v2.14</span>
          </div>
          <h2 className="text-xl font-bold font-mono text-white mt-1 tracking-tight">
            BROKER DEAL SUBMIT & SYNDICATE GATEWAY
          </h2>
          <p className="text-xs text-[#888] font-mono">
            Blinded listings cataloging, inbound IOI queues, seller-note mechanics & equity targets matching engine.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddListing(!showAddListing)}
            className="border font-mono text-xs px-3 py-1.5 tracking-wider uppercase transition-colors rounded-none"
            style={{
              borderColor: showAddListing ? '#FF3333' : '#0EA5E9',
              color: showAddListing ? '#FF3333' : '#0EA5E9',
              background: showAddListing ? 'rgba(255,51,51,0.05)' : 'rgba(14,165,233,0.05)'
            }}
          >
            {showAddListing ? '[x] CANCEL SUBMIT' : '[+] SUBMIT BLINDED LISTING'}
          </button>
        </div>
      </div>

      {/* SUBMIT LISTING SLIDEOUT FORM (Collapsible Bento Block) */}
      {showAddListing && (
        <form onSubmit={handleAddListing} className="bg-[#080808] border border-[#0ea5e9]/40 p-5 space-y-4 animate-fade-in rounded-none">
          <div className="border-b border-[#222] pb-2 flex items-center justify-between">
            <span className="text-xs font-mono text-[#0ea5e9] font-bold tracking-widest">[PROTOCOL 1031 COMPLIANT DEAL REGISTER]</span>
            <span className="text-[9px] font-mono text-neutral-600">INPUT PLAIN DATA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Codename */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-[#888] uppercase tracking-wider">Deal Codename</label>
              <input 
                type="text"
                placeholder="e.g. PROJECT QUANTUM"
                value={newCodename}
                onChange={e => setNewCodename(e.target.value)}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] focus:ring-0 text-xs font-mono text-white p-2.5 outline-none rounded-none"
                required
              />
            </div>

            {/* Vertical / Industry */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-[#888] uppercase tracking-wider">Vertical Segment</label>
              <select 
                value={newVertical}
                onChange={e => setNewVertical(e.target.value as any)}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-[#F9F9F9] p-2.5 outline-none rounded-none"
              >
                <option value="SaaS">SaaS (High-margin Recurring)</option>
                <option value="Manufacturing">Manufacturing (Asset-heavy)</option>
                <option value="Logistics">Logistics (Distribution Fleet)</option>
                <option value="HVAC">HVAC (Commercial Mechanical)</option>
                <option value="Home Services">Home Services (Residential Grid)</option>
              </select>
            </div>

            {/* Blind Location */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-[#888] uppercase tracking-wider">Blinded Location/Region</label>
              <input 
                type="text"
                placeholder="e.g. Great Lakes Region"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] focus:ring-0 text-xs font-mono text-white p-2.5 outline-none rounded-none"
                required
              />
            </div>

            {/* EBITDA */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-[#888] uppercase tracking-wider">Adjusted EBITDA (Annual)</label>
              <input 
                type="number"
                placeholder="e.g. 750000"
                value={newEbitda || ''}
                onChange={e => setNewEbitda(Number(e.target.value))}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none rounded-none"
                required
              />
            </div>

            {/* Asking Price */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-[#888] uppercase tracking-wider">Asking Purchase Price</label>
              <input 
                type="number"
                placeholder="e.g. 2500000"
                value={newAsking || ''}
                onChange={e => setNewAsking(Number(e.target.value))}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none rounded-none"
                required
              />
            </div>

            {/* Seller Standby Note */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-[#888] uppercase tracking-wider">Seller Standby Target %</label>
              <input 
                type="number"
                min="0"
                max="30"
                value={newSellerNote}
                onChange={e => setNewSellerNote(Number(e.target.value))}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none rounded-none"
              />
            </div>

            {/* Target Equity Syndication */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-[#888] uppercase tracking-wider">Target Sponsor Equity Target</label>
              <input 
                type="number"
                placeholder="e.g. 400000"
                value={newTargetEquity || ''}
                onChange={e => setNewTargetEquity(Number(e.target.value))}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none rounded-none"
                required
              />
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="bg-[#00FF66] text-black font-mono text-xs font-bold px-6 py-2.5 tracking-wider hover:bg-white transition-all rounded-none uppercase"
            >
              Commit Deal to Terminal Database &rarr;
            </button>
          </div>
        </form>
      )}

      {/* MASTER COLUMNS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 1. BLINDED LISTINGS LEDGER (Left Side Column - spans 5 cols) */}
        <section className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-[#222] pb-2">
            <h3 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
              <span className="inline-block w-1.5 h-3 bg-[#0EA5E9] rounded-none"></span>
              ACTIVE BROKERED ASSETS
            </h3>
            <span className="text-[10px] font-mono text-[#888]" x-text="`${listings.length} Active`">{listings.length} Active Listings</span>
          </div>

          {/* LISTINGS STACK */}
          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {listings.map(l => {
              const multiple = l.ebitda > 0 ? (l.asking / l.ebitda).toFixed(2) : '0.00';
              const progressPct = Math.min(100, Math.round((l.raisedEquity / l.targetEquity) * 100));
              const isSelected = selectedListingId === l.id;

              return (
                <div 
                  key={l.id}
                  onClick={() => setSelectedListingId(l.id)}
                  className="p-4 border transition-all cursor-pointer relative group flex flex-col justify-between rounded-none"
                  style={{
                    backgroundColor: isSelected ? 'rgba(14,165,233,0.03)' : '#080808',
                    borderColor: isSelected ? '#0ea5e9' : '#222',
                  }}
                >
                  {/* Top line with vertical indicator */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[9px] font-mono bg-[#111] border border-[#222] px-1.5 py-0.5 text-[#0ea5e9] tracking-wider uppercase">
                        {l.vertical}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 ml-2">{l.location}</span>
                    </div>

                    <span className="text-[9px] font-mono" style={{ color: l.status === 'ACTIVE' ? '#00FF66' : l.status === 'UNDER CONTRACT' ? '#0EA5E9' : '#FF3333' }}>
                      [{l.status}]
                    </span>
                  </div>

                  {/* Codename & Cost */}
                  <div className="flex justify-between items-baseline mt-1">
                    <h4 className="font-mono text-sm font-bold text-white group-hover:text-[#00FF66] transition-colors">{l.codename}</h4>
                    <span className="text-xs font-mono font-bold text-[#00FF66]">{formatCurrency(l.asking)}</span>
                  </div>

                  {/* Mini Grid Metrics */}
                  <div className="grid grid-cols-3 gap-px bg-[#1a1a1a] border border-[#222] font-mono text-center mt-3 text-[10px]">
                    <div className="bg-black p-1">
                      <span className="block text-[8px] text-neutral-500">EBITDA</span>
                      <span className="text-white font-semibold">{formatCurrency(l.ebitda)}</span>
                    </div>
                    <div className="bg-black p-1">
                      <span className="block text-[8px] text-neutral-500">MULTIPLE</span>
                      <span className="text-[#0ea5e9] font-semibold">{multiple}x</span>
                    </div>
                    <div className="bg-black p-1">
                      <span className="block text-[8px] text-neutral-500">SELLER NOTE</span>
                      <span className="text-[#00FF66] font-semibold">{l.sellerNotePercent}%</span>
                    </div>
                  </div>

                  {/* Syndication Equity Goal Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-[#888]">
                      <span>EQUITY SYN. ({progressPct}%)</span>
                      <span className="text-[#F9F9F9]">{formatCurrency(l.raisedEquity)} / {formatCurrency(l.targetEquity)}</span>
                    </div>
                    <div className="w-full bg-[#111] border border-[#222] h-1.5">
                      <div 
                        className="bg-[#00FF66] h-full transition-all duration-300" 
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive Button inside each for rapid equity simulation mock */}
                  <div className="mt-3 pt-2 border-t border-[#1a1a1a] flex justify-between items-center">
                    <span className="text-[8px] font-mono text-neutral-600">ID: {l.id}</span>
                    {l.raisedEquity < l.targetEquity && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCommitEquity(l.id, 50000);
                        }}
                        className="text-[9px] font-mono text-[#00FF66] hover:underline uppercase tracking-wider"
                      >
                        [+] Commit $50K Equity
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. INBOUND IOI QUEUE & TERMINAL INTERACTION (Right Side Column - spans 7 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Active Selection Details Core */}
          <div className="bg-[#080808] border border-[#222] p-5 space-y-4 rounded-none">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-[#222] pb-3">
              <div>
                <span className="text-[9px] font-mono text-[#0EA5E9] tracking-widest block font-bold">CURRENT SELECTION WORKFLOW</span>
                <h3 className="font-mono text-lg font-black text-white">{selectedListing.codename}</h3>
              </div>
              <div className="bg-black px-3 py-1 border border-[#222] text-right">
                <span className="text-[8px] font-mono text-neutral-500 block">ADJUSTED EBITDA FLOW</span>
                <span className="text-xs font-mono font-bold text-[#00FF66]">{formatCurrency(selectedListing.ebitda)} / Year</span>
              </div>
            </div>

            {/* INBOUND IOI QUEUE GRID */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#888] uppercase tracking-wider">Inbound Indications of Interest ({filteredIois.length})</span>
                <span className="text-[8px] font-mono text-neutral-500">Requires Broker Review</span>
              </div>

              {filteredIois.length === 0 ? (
                <div className="border border-dashed border-[#222] p-6 text-center rounded-none bg-black/40">
                  <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest block">ZERO INBOUND OFFERS FOR THIS ASSET</span>
                  <p className="text-[9px] text-[#888] font-mono mt-1">Blinded marketing is actively broadcasting downstream channels.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredIois.map(ioi => {
                    return (
                      <div key={ioi.id} className="bg-black border border-[#222] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-none">
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white">{ioi.buyerName}</span>
                            <span className="text-[8px] font-mono bg-[#111] px-1 text-[#888] border border-[#222] uppercase">{ioi.buyerType}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-[10px] font-mono text-[#888] pt-1">
                            <div>OFFER: <span className="text-[#00FF66] font-bold">{formatCurrency(ioi.offeredValuation)}</span></div>
                            <div>DEBT/STANDBY: <span className="text-white">{ioi.proposedDebtPercent}% / {ioi.proposedStandbyPercent}%</span></div>
                            <div>EQ: <span className="text-[#0ea5e9]">{formatCurrency(ioi.equityContribution)}</span></div>
                          </div>
                          <div className="text-[8px] font-mono text-neutral-600">TIMESTAMP: {ioi.timestamp}</div>
                        </div>

                        {/* Status + Change Options */}
                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                          <span className="text-[9px] font-mono px-2 py-0.5 border" style={{
                            borderColor: ioi.status === 'UNDER_REVIEW' ? '#0ea5e9' : ioi.status === 'NEGOTIATING_STANDBY' ? '#FF3333' : ioi.status === 'LOI_PREP' ? '#00FF66' : '#222',
                            color: ioi.status === 'UNDER_REVIEW' ? '#0ea5e9' : ioi.status === 'NEGOTIATING_STANDBY' ? '#FF3333' : ioi.status === 'LOI_PREP' ? '#00FF66' : '#888',
                            background: 'rgba(0,0,0,0.4)'
                          }}>
                            STATUS: {ioi.status.replace('_', ' ')}
                          </span>

                          <div className="flex gap-1.5">
                            {ioi.status !== 'LOI_PREP' && (
                              <button 
                                onClick={() => handleUpdateIoiStatus(ioi.id, 'LOI_PREP')}
                                className="text-[9px] font-mono text-[#00FF66] border border-[#00FF66]/30 px-1.5 py-0.5 hover:bg-[#00FF66]/10 rounded-none uppercase"
                              >
                                [LOI Prep]
                              </button>
                            )}
                            {ioi.status !== 'NEGOTIATING_STANDBY' && (
                              <button 
                                onClick={() => handleUpdateIoiStatus(ioi.id, 'NEGOTIATING_STANDBY')}
                                className="text-[9px] font-mono text-[#FF3333] border border-[#FF3333]/30 px-1.5 py-0.5 hover:bg-[#FF3333]/10 rounded-none uppercase"
                              >
                                [Standby Counter]
                              </button>
                            )}
                            {ioi.status !== 'REJECTED' && (
                              <button 
                                onClick={() => handleUpdateIoiStatus(ioi.id, 'REJECTED')}
                                className="text-[9px] font-mono text-neutral-600 hover:text-white border border-[#222] px-1.5 py-0.5 rounded-none uppercase"
                              >
                                [REJECT]
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* 3. INTERACTIVE TERM SHEET SANDBOX (SBA 7a Standard Model Simulation) */}
          <div className="bg-[#080808] border border-[#222] p-5 space-y-4 rounded-none">
            <div className="border-b border-[#222] pb-2 flex justify-between items-center">
              <span className="text-xs font-mono text-[#00FF66] font-bold tracking-widest">[SBA 7(a) STRUCTURAL SIMULATOR]</span>
              <span className="text-[9px] font-mono text-neutral-600">REAL-TIME SANDBOX</span>
            </div>

            <p className="text-[11px] text-[#888] font-mono leading-tight">
              Test different deal mechanics to see how adjust enterprise valuation splits impact the sponsor&apos;s equity gap and required debt service capacity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Slider 1: Enterprise Valuation */}
              <div className="space-y-1 bg-black p-3 border border-[#222]">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[9px] text-[#888] uppercase">Valuation</label>
                  <span className="font-mono text-[11px] text-[#00FF66] font-bold">{formatCurrency(simValuation)}</span>
                </div>
                <input 
                  type="range"
                  min={Math.round(selectedListing.asking * 0.7)}
                  max={Math.round(selectedListing.asking * 1.3)}
                  step="10000"
                  value={simValuation}
                  onChange={e => setSimValuation(Number(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer rounded-none"
                />
                <div className="flex justify-between text-[7px] font-mono text-neutral-600">
                  <span>-30% Asking</span>
                  <span>+30% Asking</span>
                </div>
              </div>

              {/* Slider 2: Senior SBA Debt */}
              <div className="space-y-1 bg-black p-3 border border-[#222]">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[9px] text-[#888] uppercase">Senior Debt (SBA)</label>
                  <span className="font-mono text-[11px] text-[#0ea5e9] font-bold">{simSbaPercent}%</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="90"
                  step="5"
                  value={simSbaPercent}
                  onChange={e => setSimSbaPercent(Number(e.target.value))}
                  className="w-full accent-[#0ea5e9] bg-[#222] h-1 cursor-pointer rounded-none"
                />
                <div className="flex justify-between text-[7px] font-mono text-neutral-600">
                  <span>50%</span>
                  <span>90% Max (7a Limit)</span>
                </div>
              </div>

              {/* Slider 3: Seller Standby */}
              <div className="space-y-1 bg-black p-3 border border-[#222]">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[9px] text-[#888] uppercase">Seller Note %</label>
                  <span className="font-mono text-[11px] text-white font-bold">{simStandbyPercent}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="25"
                  step="2.5"
                  value={simStandbyPercent}
                  onChange={e => setSimStandbyPercent(Number(e.target.value))}
                  className="w-full accent-white bg-[#222] h-1 cursor-pointer rounded-none"
                />
                <div className="flex justify-between text-[7px] font-mono text-neutral-600">
                  <span>0% (Cash Out)</span>
                  <span>25% Max Standby</span>
                </div>
              </div>

            </div>

            {/* DYNAMIC LEVERAGE SUMMARY METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#222] border border-[#222] font-mono text-center text-xs">
              
              <div className="bg-black p-3">
                <span className="block text-[8px] text-[#888]">SENIOR DEBT VALUE</span>
                <span className="text-white font-semibold">{formatCurrency(simDebtAmt)}</span>
              </div>

              <div className="bg-black p-3">
                <span className="block text-[8px] text-[#888]">SELLER STANDBY</span>
                <span className="text-white font-semibold">{formatCurrency(simStandbyAmt)}</span>
              </div>

              <div className="bg-black p-3">
                <span className="block text-[8px] text-[#888] text-[#00FF66]">EQUITY TARGET</span>
                <span className="text-[#00FF66] font-semibold">{formatCurrency(simEquityRequired)}</span>
              </div>

              <div className="bg-black p-3">
                <span className="block text-[8px] text-[#FF3333]">ANNUAL DEBT SERVICE</span>
                <span className="text-[#FF3333] font-semibold">{formatCurrency(estAnnualDebtService)}</span>
              </div>

            </div>

            {/* DEBT RATIOS & VALIDATION ZONE */}
            <div className="bg-black p-4 border border-[#222] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <span className="text-[10px] font-mono text-[#888] uppercase tracking-wider block">Debt Service Coverage Ratio (DSCR)</span>
                <span className="font-mono text-lg font-black" style={{ color: simDscr >= 1.25 ? '#00FF66' : '#FF3333' }}>
                  {simDscr.toFixed(2)}x
                </span>
              </div>
              <div className="text-left md:text-right font-mono text-[10px] text-neutral-500 max-w-md">
                {simDscr >= 1.25 ? (
                  <span className="text-[#00FF66] font-semibold block">[✓ SECTOR-1031 COMPLIANT DEBT ZONE]</span>
                ) : (
                  <span className="text-[#FF3333] font-semibold block">[⚠ CRITICAL FAILURE: DSCR &lt; 1.25x REQ]</span>
                )}
                SBA preferred guidelines mandate &gt; 1.25x margin after interest amortization buffers to guarantee approval.
              </div>
            </div>

          </div>

        </section>

      </div>
      
    </div>
  );
}