"use client";

import React, { useState, useMemo } from 'react';

// Interfaces for UI States
interface LP {
  id: string;
  name: string;
  type: string;
  dryPowder: number;
  minCheck: number;
  maxCheck: number;
  preferredSectors: string[];
  geography: string;
  verified: boolean;
  status: 'ACTIVE' | 'DORMANT' | 'DEPLOYED';
}

interface ActiveSearch {
  id: string;
  codename: string;
  sector: string;
  ebitda: number;
  dealSize: number;
  equityGap: number;
  gpCommitment: number;
  pbpDaysLeft: number;
  location: string;
}

export default function SyndicationHub() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'directory' | 'waterfall' | 'searchers'>('directory');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Safe Comms State
  const [selectedLP, setSelectedLP] = useState<LP | null>(null);
  const [commsModalOpen, setCommsModalOpen] = useState<boolean>(false);
  const [commsMessage, setCommsMessage] = useState<string>('');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [activeCommsLogs, setActiveCommsLogs] = useState<string[]>([
    "[SYSTEM] Tunnel initialization safe-handshake protocol complete.",
    "[SECURE] All outgoing packets routing via decentralized onion layer proxy.",
  ]);

  // Waterfall Modeler Inputs
  const [equityGap, setEquityGap] = useState<number>(1500000); // Amount to raise from LPs
  const [gpCommitment, setGpCommitment] = useState<number>(150000); // GP injection
  const [prefReturn, setPrefReturn] = useState<number>(8); // Hurdle %
  const [gpPromote, setGpPromote] = useState<number>(20); // GP carry split after hurdle
  const [exitValuation, setExitValuation] = useState<number>(8000000); // Exit price
  const [debtOutstanding, setDebtOutstanding] = useState<number>(3500000); // Remaining Senior Debt
  const [retentionYears, setRetentionYears] = useState<number>(5);

  // --- MOCK DATA ---
  const lps: LP[] = [
    {
      id: 'LP-908',
      name: 'Blackwood Search Alliance',
      type: 'Family Office',
      dryPowder: 12500000,
      minCheck: 250000,
      maxCheck: 1500000,
      preferredSectors: ['HVAC', 'Logistics', 'Manufacturing'],
      geography: 'North America / East',
      verified: true,
      status: 'ACTIVE'
    },
    {
      id: 'LP-314',
      name: 'Aether Capital Partners',
      type: 'Micro-PE Hub',
      dryPowder: 24000000,
      minCheck: 500000,
      maxCheck: 3000000,
      preferredSectors: ['SaaS', 'B2B Agency', 'Healthcare IT'],
      geography: 'Sovereign Remote',
      verified: true,
      status: 'ACTIVE'
    },
    {
      id: 'LP-110',
      name: 'Vanguard Legacy Trust',
      type: 'Multi-Family Office',
      dryPowder: 45000000,
      minCheck: 1000000,
      maxCheck: 5000000,
      preferredSectors: ['Manufacturing', 'Industrial Services'],
      geography: 'Midwest Regional',
      verified: true,
      status: 'ACTIVE'
    },
    {
      id: 'LP-772',
      name: 'Ironwood Search Backers',
      type: 'High Net Worth Syndicator',
      dryPowder: 6200000,
      minCheck: 100000,
      maxCheck: 750000,
      preferredSectors: ['Home Services', 'HVAC', 'Logistics'],
      geography: 'Southeastern US',
      verified: true,
      status: 'ACTIVE'
    },
    {
      id: 'LP-454',
      name: 'Helios Frontier Capital',
      type: 'Structured LP Pool',
      dryPowder: 18500000,
      minCheck: 500000,
      maxCheck: 2000000,
      preferredSectors: ['SaaS', 'Logistics'],
      geography: 'Global / Remote',
      verified: false,
      status: 'DEPLOYED'
    }
  ];

  const activeSearches: ActiveSearch[] = [
    {
      id: 'SH-892',
      codename: 'Project Vanguard',
      sector: 'Manufacturing',
      ebitda: 1400000,
      dealSize: 5200000,
      equityGap: 1600000,
      gpCommitment: 150000,
      pbpDaysLeft: 14,
      location: 'Midwest USA'
    },
    {
      id: 'SH-401',
      codename: 'Project Helios',
      sector: 'HVAC',
      ebitda: 1100000,
      dealSize: 3900000,
      equityGap: 950000,
      gpCommitment: 100000,
      pbpDaysLeft: 8,
      location: 'Texas Triangle'
    },
    {
      id: 'SH-112',
      codename: 'Project Titan',
      sector: 'Logistics',
      ebitda: 2200000,
      dealSize: 8400000,
      equityGap: 2900000,
      gpCommitment: 300000,
      pbpDaysLeft: 22,
      location: 'Southeast Hub'
    }
  ];

  // --- FILTERING LOGIC ---
  const filteredLPs = useMemo(() => {
    return lps.filter(lp => {
      const matchSector = sectorFilter === 'ALL' || lp.preferredSectors.includes(sectorFilter);
      const matchSearch = lp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lp.geography.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lp.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSector && matchSearch;
    });
  }, [sectorFilter, searchQuery]);

  // --- WATERFALL MODELER CALCULATIONS ---
  const waterfallData = useMemo(() => {
    const totalEquityInjected = equityGap + gpCommitment;
    if (totalEquityInjected <= 0) return {
      netProceeds: 0,
      lpInitialReturn: 0,
      gpInitialReturn: 0,
      lpHurdleReturn: 0,
      gpHurdleReturn: 0,
      lpSplitReturn: 0,
      gpSplitReturn: 0,
      lpTotalReturn: 0,
      gpTotalReturn: 0,
      lpIRR: 0,
      gpIRR: 0,
      lpMultiple: 0,
      gpMultiple: 0
    };

    // Net Proceeds to distribute
    const netProceeds = Math.max(0, exitValuation - debtOutstanding);

    // LP portion of injected capital (e.g. 1.5M / 1.65M = 90.9%)
    const lpEquityRatio = equityGap / totalEquityInjected;
    const gpEquityRatio = gpCommitment / totalEquityInjected;

    // --- Tier 1: Capital Return ---
    const tier1Distribution = Math.min(netProceeds, totalEquityInjected);
    const lpCapitalReturn = tier1Distribution * lpEquityRatio;
    const gpCapitalReturn = tier1Distribution * gpEquityRatio;

    let remainingProceeds = netProceeds - tier1Distribution;

    // --- Tier 2: Preferred Return Hurdle ---
    // Simple cumulative non-compounded preferred return over retention years
    const totalPrefHurdle = equityGap * (prefReturn / 100) * retentionYears;
    const lpPrefReturnDist = Math.min(remainingProceeds, totalPrefHurdle);
    
    remainingProceeds -= lpPrefReturnDist;

    // --- Tier 3: Split according to GP Carry (Promote) ---
    // e.g. GP gets GP promote % (20%), LP gets remainder (80%)
    const lpSplitDist = remainingProceeds * ((100 - gpPromote) / 100);
    const gpSplitDist = remainingProceeds * (gpPromote / 100);

    // Totals
    const lpTotalReturn = lpCapitalReturn + lpPrefReturnDist + lpSplitDist;
    const gpTotalReturn = gpCapitalReturn + gpSplitDist;

    // Multiple of Invested Capital (MoIC)
    const lpMultiple = equityGap > 0 ? lpTotalReturn / equityGap : 0;
    const gpMultiple = gpCommitment > 0 ? gpTotalReturn / gpCommitment : 0;

    // IRR Approximation: (Future Value / Present Value) ^ (1/N) - 1
    const calculateIRR = (fv: number, pv: number, years: number) => {
      if (pv <= 0 || fv <= 0) return 0;
      return (Math.pow(fv / pv, 1 / years) - 1) * 100;
    };

    const lpIRR = calculateIRR(lpTotalReturn, equityGap, retentionYears);
    const gpIRR = calculateIRR(gpTotalReturn, gpCommitment, retentionYears);

    return {
      netProceeds,
      lpInitialReturn: lpCapitalReturn,
      gpInitialReturn: gpCapitalReturn,
      lpHurdleReturn: lpPrefReturnDist,
      lpSplitReturn: lpSplitDist,
      gpSplitReturn: gpSplitDist,
      lpTotalReturn,
      gpTotalReturn,
      lpIRR,
      gpIRR,
      lpMultiple,
      gpMultiple
    };
  }, [equityGap, gpCommitment, prefReturn, gpPromote, exitValuation, debtOutstanding, retentionYears]);

  // --- SIMULATE SECURE TRANSMISSION MESSAGE ---
  const sendSecureMessage = () => {
    if (!commsMessage.trim() || !selectedLP) return;
    
    setActiveCommsLogs(prev => [
      ...prev,
      `[COMMS] Package generated for secure Node: ${selectedLP.id}`,
      `[CRYPT] Executing SHA-256 local envelope encryption...`,
      `[OUTBOUND] Envelope ${Math.random().toString(36).substring(3, 11).toUpperCase()} dispatched directly to ${selectedLP.name}.`,
    ]);
    
    setCommsMessage('');
    setIsEncrypted(true);
    setTimeout(() => {
      setIsEncrypted(false);
      setCommsModalOpen(false);
    }, 1800);
  };

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono min-h-screen selection:bg-[#00FF66] selection:text-[#050505] antialiased flex flex-col justify-between">
      
      {/* GLOW BAR & HEADER */}
      <header className="border-b border-[#222222] bg-[#050505] sticky top-0 z-40">
        <div className="overflow-hidden border-b border-[#222222] bg-[#0a0a0a] py-1 text-[10px] tracking-[0.2em] text-[#0EA5E9] uppercase">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="mx-4 text-[#00FF66]">[ACTIVE DEALS: 14 VERIFIED SEARCHES ACROSS REGIONS]</span>
            <span className="mx-4">[CO-INVESTOR LIQUIDITY: $148.5M TOTAL DRY POWDER IN PLAY]</span>
            <span className="mx-4 text-[#FF3333] font-bold">[ATTN: 1031 EXCHANGE MATCHING TERMINAL NOW RUNNING]</span>
            <span className="mx-4 text-[#0EA5E9]">[GP ALIGNMENT MODELING VERIFIED FOR ALL ACTIVE SESSIONS]</span>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#00FF66] animate-pulse"></div>
              <span className="text-lg font-bold tracking-wider text-[#F9F9F9]">ACQUIRE<span className="text-[#00FF66]">META</span></span>
            </div>
            <span className="text-[10px] px-2 py-0.5 border border-[#222222] text-[#888888] bg-[#0c0c0c] uppercase">SYNDICATION PORTAL V2.4</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#888888] justify-center md:justify-end">
            <div>SECURE CORE: <span className="text-[#00FF66] font-bold">READY</span></div>
            <div className="hidden sm:block">TOTAL GAP COMMITTED: <span className="text-[#0EA5E9] font-bold">$12.4M</span></div>
            <div className="border border-[#222222] px-2 py-1 bg-[#111111] text-[#F9F9F9] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] block animate-ping"></span>
              SECURE DEPLOYMENT PROTOCOL ACTIVE
            </div>
          </div>
        </div>
      </header>

      {/* CORE SYNDICATION DASHBOARD */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE RAISES & DIRECTORY MATRIX */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* TAB SYSTEM */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-1 flex">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex-1 text-center py-2.5 text-xs font-bold uppercase transition-all duration-150 border ${
                activeTab === 'directory' 
                  ? 'bg-[#00FF66] text-[#050505] border-[#00FF66]' 
                  : 'text-[#888888] border-transparent hover:text-[#00FF66] hover:bg-[#111111]'
              }`}
            >
              [ LP Directory ]
            </button>
            <button
              onClick={() => setActiveTab('searchers')}
              className={`flex-1 text-center py-2.5 text-xs font-bold uppercase transition-all duration-150 border ${
                activeTab === 'searchers' 
                  ? 'bg-[#00FF66] text-[#050505] border-[#00FF66]' 
                  : 'text-[#888888] border-transparent hover:text-[#00FF66] hover:bg-[#111111]'
              }`}
            >
              [ Active Raises ]
            </button>
            <button
              onClick={() => setActiveTab('waterfall')}
              className={`flex-1 text-center py-2.5 text-xs font-bold uppercase transition-all duration-150 border ${
                activeTab === 'waterfall' 
                  ? 'bg-[#00FF66] text-[#050505] border-[#00FF66]' 
                  : 'text-[#888888] border-transparent hover:text-[#00FF66] hover:bg-[#111111]'
              }`}
            >
              [ Waterfall Modeler ]
            </button>
          </div>

          {/* TAB 1: LP DIRECTORY CONTAINER */}
          {activeTab === 'directory' && (
            <div className="space-y-6">
              
              {/* Filter Controls (Sector Filtering Matrix) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-[#222222] bg-[#0a0a0a] p-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-[10px] text-[#888888] uppercase block mb-1">Text-Match Query</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search LPs by type, region, name..."
                    className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-2 placeholder-[#888888] uppercase font-mono tracking-wider transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#888888] uppercase block mb-1">Target Sector</label>
                  <select
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-2 uppercase font-mono tracking-wider"
                  >
                    <option value="ALL">All Sectors</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Home Services">Home Services</option>
                  </select>
                </div>
              </div>

              {/* LP Listings */}
              <div className="space-y-4">
                {filteredLPs.length === 0 ? (
                  <div className="border border-[#FF3333] bg-[#110707] p-8 text-center space-y-2">
                    <p className="text-[#FF3333] font-bold">⚠️ ZERO VERIFIED LP MATCHES</p>
                    <p className="text-xs text-[#888888]">Try loosening your sector filter or textual parameter guidelines.</p>
                  </div>
                ) : (
                  filteredLPs.map((lp) => (
                    <div 
                      key={lp.id}
                      className="border border-[#222222] bg-[#0a0a0a] hover:border-[#0EA5E9] transition-all duration-200"
                    >
                      {/* Header Bar */}
                      <div className="border-b border-[#222222] bg-[#0c0c0c] p-3 flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold px-2 py-0.5 bg-[#111111] border border-[#222222] text-[#0ea5e9]">
                            {lp.id}
                          </span>
                          <span className="text-xs tracking-wider uppercase font-bold text-[#F9F9F9]">
                            {lp.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] px-1.5 py-0.5 bg-[#111111] text-[#888888] border border-[#222222] uppercase">
                            {lp.type}
                          </span>
                          {lp.verified && (
                            <span className="text-[9px] bg-emerald-950 text-[#00FF66] px-1.5 py-0.5 border border-emerald-800 font-bold">
                              VERIFIED DRY-POWDER
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main LP Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#222222]">
                        <div className="p-3 border-r border-[#222222]">
                          <span className="text-[9px] text-[#888888] block uppercase">Est. LP Dry Powder</span>
                          <span className="text-base font-bold text-[#F9F9F9]">
                            {formatCurrency(lp.dryPowder)}
                          </span>
                        </div>
                        <div className="p-3 border-r border-[#222222]">
                          <span className="text-[9px] text-[#888888] block uppercase">Preferred Limits</span>
                          <span className="text-xs text-[#F9F9F9] block">
                            Min Check: {formatCurrency(lp.minCheck)}
                          </span>
                          <span className="text-xs text-[#F9F9F9] block">
                            Max Check: {formatCurrency(lp.maxCheck)}
                          </span>
                        </div>
                        <div className="p-3">
                          <span className="text-[9px] text-[#888888] block uppercase">Operational Area</span>
                          <span className="text-xs text-[#F9F9F9] uppercase block truncate">
                            {lp.geography}
                          </span>
                        </div>
                      </div>

                      {/* Footer tags & Comms */}
                      <div className="p-3 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex flex-wrap gap-1">
                          {lp.preferredSectors.map((sec, idx) => (
                            <span key={idx} className="text-[9px] border border-[#222222] bg-[#050505] px-2 py-0.5 text-[#0EA5E9] uppercase">
                              {sec}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedLP(lp);
                            setCommsModalOpen(true);
                          }}
                          className="text-[10px] text-[#050505] bg-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] font-bold px-3 py-1 transition-all duration-150 uppercase"
                        >
                          Send Safe Communication
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE RAISES FOR CO-INVESTORS */}
          {activeTab === 'searchers' && (
            <div className="space-y-6">
              
              <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-2">
                <h3 className="text-xs font-bold text-[#00FF66] uppercase tracking-widest">// active GP equity gaps</h3>
                <p className="text-[11px] text-[#888888] leading-relaxed">
                  These verified independent searchers hold signed letters of intent (LOIs) with audited target financials and are finalizing capital stacks. Select a node to populate parameters directly into the Waterfall Modeler.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {activeSearches.map((search) => (
                  <div 
                    key={search.id}
                    className="border border-[#222222] bg-[#0a0a0a] hover:border-[#0EA5E9] transition-all duration-200 p-4 relative"
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2 border-b border-[#222222] pb-3 mb-3">
                      <div>
                        <span className="text-[9px] text-[#888888] block">ACTIVE COMPLIANCE ID: {search.id}</span>
                        <h4 className="text-sm font-bold text-[#F9F9F9] uppercase tracking-wider">{search.codename}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-[#888888] block">OFFER LIFESPAN</span>
                        <span className="text-xs font-bold text-[#FF3333] uppercase">{search.pbpDaysLeft} DAYS REMAINING</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-4">
                      <div>
                        <span className="text-[9px] text-[#888888] block uppercase">Target EBITDA</span>
                        <span className="font-bold text-[#F9F9F9]">{formatCurrency(search.ebitda)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#888888] block uppercase">Deal Size</span>
                        <span className="font-bold text-[#F9F9F9]">{formatCurrency(search.dealSize)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#0ea5e9] block uppercase">LP Equity Gap</span>
                        <span className="font-bold text-[#0ea5e9]">{formatCurrency(search.equityGap)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#888888] block uppercase">GP Commitment</span>
                        <span className="font-bold text-[#00FF66]">{formatCurrency(search.gpCommitment)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center flex-wrap gap-2 pt-3 border-t border-[#222222]">
                      <span className="text-[10px] text-[#888888]">Sector Focus: <span className="text-[#F9F9F9] font-bold uppercase">{search.sector}</span> | Region: <span className="text-[#F9F9F9] uppercase">{search.location}</span></span>
                      <button
                        onClick={() => {
                          setEquityGap(search.equityGap);
                          setGpCommitment(search.gpCommitment);
                          setActiveTab('waterfall');
                        }}
                        className="text-[10px] border border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-[#050505] font-bold px-3 py-1 transition-all duration-150 uppercase"
                      >
                        Model Deal Mechanics
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WATERFALL MODELER EXPLANATORY DESK */}
          {activeTab === 'waterfall' && (
            <div className="border border-[#222222] bg-[#0a0a0a] p-5 space-y-4">
              <h3 className="text-xs font-bold text-[#0ea5e9] uppercase tracking-widest">// Waterfall Payout Logic Matrix</h3>
              <div className="text-xs text-[#888888] space-y-3 leading-relaxed">
                <p>
                  This engine simulates distribution sequences when exiting target acquisitions. Adjust parameters on the right side of the screen to witness structural variations on exit payouts.
                </p>
                <div className="border border-[#222222] p-3 bg-[#050505] space-y-2">
                  <div className="text-[#F9F9F9] font-bold uppercase">Standard Priority Waterfall Order:</div>
                  <ul className="list-decimal list-inside space-y-1">
                    <li><span className="text-[#0ea5e9] font-bold">Tier 1: Principal Recovery</span> - Paid proportionally to GP and LP based on actual injected equity.</li>
                    <li><span className="text-[#0ea5e9] font-bold">Tier 2: Preferred Return Hurdle</span> - LP receives accumulated return (e.g. 8% per annum) prior to GP split.</li>
                    <li><span className="text-[#00FF66] font-bold">Tier 3: Promote Profit Split</span> - Remaining net proceeds split using the agreed promote target ratios (e.g. 80% to LP / 20% to GP).</li>
                  </ul>
                </div>
                <p>
                  Calculations on simulated exits do not warrant real-world returns and are meant purely for exploratory asset modeling. Ensure independent legal structuring matches your specific LLC operating documents.
                </p>
              </div>
            </div>
          )}

          {/* REALTIME SYSTEM COMMS TELEMETRY */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-2 font-mono text-[11px]">
            <span className="text-[#888888] uppercase block tracking-wider">// Secure Node Comm-Link History</span>
            <div className="bg-[#050505] p-3 border border-[#222222] h-28 overflow-y-auto space-y-1 select-all scrollbar-thin">
              {activeCommsLogs.map((log, idx) => (
                <div key={idx} className="text-[#888888] flex items-start gap-1">
                  <span className="text-[#00FF66] font-bold">»</span>
                  <span className="truncate">{log}</span>
                </div>
              ))}
            </div>
            <div className="text-[9px] text-[#888888] text-right">
              SYSTEM STATUS: SECURE (1024-BIT ASYMMETRIC ENCRYPT)
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: WATERFALL EQUITY MODELER */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          <div className="border border-[#222222] bg-[#0a0a0a] p-5 space-y-6">
            
            <div className="flex justify-between items-center border-b border-[#222222] pb-3">
              <div className="space-y-0.5">
                <span className="text-[9px] text-[#888888] uppercase block">Modeling Engine</span>
                <h3 className="text-sm font-bold text-[#0ea5e9] uppercase tracking-wider">Equity Waterfall Structurer</h3>
              </div>
              <span className="text-[10px] bg-[#111111] text-[#00FF66] px-2 py-0.5 border border-[#222222]">
                CALC ONLINE
              </span>
            </div>

            {/* Injected Capital Settings */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider">// Capital Influx Parameters</h4>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888]">Target LP Equity Gap:</span>
                  <span className="text-[#0ea5e9] font-bold">{formatCurrency(equityGap)}</span>
                </div>
                <input 
                  type="range" 
                  min="500000" 
                  max="5000000" 
                  step="50000" 
                  value={equityGap} 
                  onChange={(e) => setEquityGap(Number(e.target.value))}
                  className="w-full accent-[#00FF66]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888]">Searcher (GP) Commitment:</span>
                  <span className="text-[#00FF66] font-bold">{formatCurrency(gpCommitment)}</span>
                </div>
                <input 
                  type="range" 
                  min="25000" 
                  max="500000" 
                  step="5000" 
                  value={gpCommitment} 
                  onChange={(e) => setGpCommitment(Number(e.target.value))}
                  className="w-full accent-[#00FF66]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] text-[#888888] uppercase block mb-1">LP Pref Return (% Per Year)</label>
                  <input
                    type="number"
                    value={prefReturn}
                    onChange={(e) => setPrefReturn(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-2"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-[#888888] uppercase block mb-1">Retention Duration (Years)</label>
                  <input
                    type="number"
                    value={retentionYears}
                    onChange={(e) => setRetentionYears(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888]">GP Carry Split After Hurdle (Promote):</span>
                  <span className="text-[#FF3333] font-bold">{gpPromote}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  step="5" 
                  value={gpPromote} 
                  onChange={(e) => setGpPromote(Number(e.target.value))}
                  className="w-full accent-[#00FF66]"
                />
              </div>
            </div>

            {/* Exit Assumptions */}
            <div className="space-y-4 border-t border-[#222222] pt-4">
              <h4 className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider">// Projected Exit Metrics</h4>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888]">Projected Enterprise Exit Value:</span>
                  <span className="text-[#F9F9F9] font-bold">{formatCurrency(exitValuation)}</span>
                </div>
                <input 
                  type="range" 
                  min="3000000" 
                  max="15000000" 
                  step="100000" 
                  value={exitValuation} 
                  onChange={(e) => setExitValuation(Number(e.target.value))}
                  className="w-full accent-[#0ea5e9]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888]">Remaining Senior/Mezz Debt at Exit:</span>
                  <span className="text-[#FF3333] font-bold">{formatCurrency(debtOutstanding)}</span>
                </div>
                <input 
                  type="range" 
                  min="500000" 
                  max="8000000" 
                  step="100000" 
                  value={debtOutstanding} 
                  onChange={(e) => setDebtOutstanding(Number(e.target.value))}
                  className="w-full accent-[#FF3333]"
                />
              </div>
            </div>

            {/* WATERFALL DISTRIBUTION OUTPUTS */}
            <div className="space-y-4 border-t border-[#222222] pt-4">
              <h4 className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider">// Simulated Exit Payout</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111111] border border-[#222222] p-3 text-center">
                  <span className="text-[9px] text-[#888888] uppercase block">Total Net Exit Proceeds</span>
                  <span className="text-sm font-bold text-[#F9F9F9] block mt-1">
                    {formatCurrency(waterfallData.netProceeds)}
                  </span>
                </div>
                <div className="bg-[#111111] border border-[#222222] p-3 text-center">
                  <span className="text-[9px] text-[#888888] uppercase block">Total LP Check Raised</span>
                  <span className="text-sm font-bold text-[#0ea5e9] block mt-1">
                    {formatCurrency(equityGap)}
                  </span>
                </div>
              </div>

              {/* Graphical Visualizer */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#888888] uppercase block">Waterfall Allocation Chart</span>
                
                {/* Visual Bar representing return split */}
                <div className="h-6 w-full flex border border-[#222222] bg-[#111111] overflow-hidden">
                  {waterfallData.netProceeds > 0 ? (
                    <>
                      {/* LP Share */}
                      <div 
                        style={{ width: `${(waterfallData.lpTotalReturn / waterfallData.netProceeds) * 100}%` }}
                        className="bg-[#0ea5e9] h-full transition-all duration-300"
                        title="LP Allocation"
                      />
                      {/* GP Share */}
                      <div 
                        style={{ width: `${(waterfallData.gpTotalReturn / waterfallData.netProceeds) * 100}%` }}
                        className="bg-[#00FF66] h-full transition-all duration-300"
                        title="GP Allocation"
                      />
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-center text-[10px] text-[#FF3333] font-bold">
                      EXIT VALUATION BELOW DEBT OUTSTANDING
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-[9px] text-[#888888]">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 bg-[#0ea5e9]" />
                    <span>LP Portion</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 bg-[#00FF66]" />
                    <span>Searcher (GP) Portion</span>
                  </div>
                </div>
              </div>

              {/* Detailed Numbers */}
              <div className="space-y-2 text-xs border border-[#222222] bg-[#050505] p-3">
                <div className="flex justify-between border-b border-[#222222] pb-1.5">
                  <span className="text-[#888888]">LP Total Payout:</span>
                  <span className="text-[#0ea5e9] font-bold">{formatCurrency(waterfallData.lpTotalReturn)}</span>
                </div>
                <div className="flex justify-between border-b border-[#222222] pb-1.5">
                  <span className="text-[#888888]">LP Invested Multiple (MoIC):</span>
                  <span className="text-[#0ea5e9] font-bold">{waterfallData.lpMultiple.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between border-b border-[#222222] pb-1.5">
                  <span className="text-[#888888]">LP Simulated IRR:</span>
                  <span className="text-[#0ea5e9] font-bold">{waterfallData.lpIRR.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between border-b border-[#222222] pb-1.5">
                  <span className="text-[#888888]">GP Total Payout:</span>
                  <span className="text-[#00FF66] font-bold">{formatCurrency(waterfallData.gpTotalReturn)}</span>
                </div>
                <div className="flex justify-between border-b border-[#222222] pb-1.5">
                  <span className="text-[#888888]">GP Invested Multiple (MoIC):</span>
                  <span className="text-[#00FF66] font-bold">{waterfallData.gpMultiple.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">GP Simulated IRR:</span>
                  <span className="text-[#00FF66] font-bold">{waterfallData.gpIRR.toFixed(1)}%</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* COMPLIANCE DISCLAIMERS & FOOTER */}
      <footer className="border-t border-[#222222] bg-[#030303] mt-12 py-8 px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Trust Row */}
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-[#222222]">
            <div className="text-xs tracking-[0.2em] text-[#888888] uppercase font-mono">
              SECURE SYNDICATION INFRASTRUCTURE
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8 items-center text-[10px] text-[#888888]">
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <span className="text-[#00FF66]">AES-256</span>
                <span>COMMS PROTOCOL ENABLED</span>
              </div>
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <span className="text-[#0EA5E9]">SEC</span>
                <span>REG D / EXEMPTION DIRECTORY</span>
              </div>
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <span className="text-[#00FF66]">KYS</span>
                <span>VERIFIED ACCREDITED INDICES</span>
              </div>
            </div>
          </div>

          {/* Legal text */}
          <div className="text-[10px] text-[#888888] leading-relaxed max-w-7xl space-y-3">
            <p className="uppercase tracking-wider text-[#F9F9F9] font-bold">// FINANCIAL DISCLOSURE NOTICE & SEC LIMITATIONS</p>
            <p>
              Disclaimer: AcquireMeta operates as a technological syndication interface. All LP data directories, dry powder statements, geographic targets, codenames, and active search targets are simulated or provided for searcher exploratory modeling. This does not represent an offer of financial advisory services, securities placement, or investment brokerage.
            </p>
            <p>
              Past simulations do not guarantee future return matrices. The Waterfall modeling tool uses simple linear calculations and non-compounding interest schemas for high-level structuring demonstrations. Any agreement must be validated by independent SEC-licensed securities attorneys prior to execution of LP agreements, PPM documentation, or capital commitments.
            </p>
            <div class="flex justify-between items-center text-[9px] text-[#888888] pt-4">
              <span>© 2026 ACQUIRE_META GLOBAL LTD. ALL CHANNELS REGISTERED.</span>
              <span>SYNDICATION ENGINE [NODE: CO-SYND-99]</span>
            </div>
          </div>

        </div>
      </footer>

      {/* SECURE COMMS MODAL */}
      {commsModalOpen && selectedLP && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-sm" onClick={() => setCommsModalOpen(false)}></div>

          {/* Modal Container */}
          <div className="relative min-h-screen flex items-center justify-center p-4 md:p-6">
            <div className="relative w-full max-w-2xl border border-[#222222] bg-[#0a0a0a] text-[#F9F9F9] p-6 space-y-6">
              
              <div className="border-b border-[#222222] pb-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#0EA5E9] font-bold">ESTABLISHING ENCRYPTED TERMINAL CONNECTION</span>
                  <h3 className="text-base font-bold uppercase tracking-wider">SECURE TRANSMISSION DIRECT: {selectedLP.name}</h3>
                </div>
                <button 
                  onClick={() => setCommsModalOpen(false)} 
                  className="border border-[#222222] text-[#888888] hover:border-[#FF3333] hover:text-[#FF3333] p-1 text-xs uppercase"
                >
                  [CLOSE]
                </button>
              </div>

              {/* LP Quick metadata */}
              <div className="grid grid-cols-3 gap-2 p-3 border border-[#222222] bg-[#060606] text-xs">
                <div>
                  <span className="text-[9px] text-[#888888] block">ID NODE</span>
                  <span className="font-bold text-[#0ea5e9]">{selectedLP.id}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#888888] block">MIN TICKET SIZE</span>
                  <span className="font-bold text-[#F9F9F9]">{formatCurrency(selectedLP.minCheck)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#888888] block">REGIONAL MATRIX</span>
                  <span className="font-bold text-[#00FF66] truncate block">{selectedLP.geography}</span>
                </div>
              </div>

              {/* Comms Panel */}
              <div className="space-y-3">
                <label className="text-[10px] text-[#888888] uppercase block">
                  Compose Confidential Deal Synopsis (Encrypted End-to-End)
                </label>
                <textarea
                  value={commsMessage}
                  onChange={(e) => setCommsMessage(e.target.value)}
                  placeholder="Enter high-level EBITDA parameters, business sector details, and equity gap requirements..."
                  className="w-full h-32 bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-3 placeholder-[#888888] font-mono leading-relaxed"
                />
                
                <div className="text-[10px] text-[#888888] bg-[#111111] p-3 border border-[#222222] space-y-1">
                  <div>• Your local IP is routing through private proxy layers.</div>
                  <div>• Message contents undergo client-side PGP sealing before leaving browser memory.</div>
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#222222]">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isEncrypted ? 'bg-[#00FF66] animate-ping' : 'bg-[#FF3333]'}`} />
                  <span className="text-[9px] text-[#888888] uppercase">
                    {isEncrypted ? 'ENCRYPTING PACKETS...' : 'STANDBY MODE'}
                  </span>
                </div>
                <button
                  onClick={sendSecureMessage}
                  className="text-xs text-[#050505] bg-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] font-bold px-6 py-3 uppercase tracking-widest"
                >
                  TRANSMIT ENVELOPE
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}