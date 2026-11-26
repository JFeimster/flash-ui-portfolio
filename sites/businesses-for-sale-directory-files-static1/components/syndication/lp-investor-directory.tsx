import React, { useState, useMemo } from 'react';

// TS Type Declarations for LP data
interface LPInvestor {
  id: string;
  name: string;
  type: 'Family Office' | 'HNW Syndicate' | 'Micro-PE' | 'Institutional Co-Investor';
  dryPowder: number;
  ticketRange: { min: number; max: number };
  sectors: string[];
  geography: string;
  reputationIndex: number; // 0-100 system integrity rating
  status: 'ACTIVE' | 'DEPLOYED' | 'STANDBY';
  verifiedAt: string;
}

export default function LPInvestorDirectory() {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [ticketFilter, setTicketFilter] = useState<number>(100000); // Min ticket filter
  
  // Modeler State
  const [equityNeeded, setEquityNeeded] = useState<number>(1500000);
  const [exitPool, setExitPool] = useState<number>(4500000);
  const [prefRate, setPrefRate] = useState<number>(8); // Pref return in %
  const [gpCarry, setGpCarry] = useState<number>(20); // GP carry split % after pref

  // Secure Transmission Modal State
  const [selectedLPForContact, setSelectedLPForContact] = useState<LPInvestor | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionProgress, setTransmissionProgress] = useState(0);
  const [teaserSubject, setTeaserSubject] = useState('');
  const [teaserBody, setTeaserBody] = useState('');
  const [transmissionSuccess, setTransmissionSuccess] = useState(false);

  // --- LP MOCK DATABASE ---
  const lpDatabase: LPInvestor[] = [
    {
      id: 'LP-9082',
      name: 'Aegis Sentinel Holdings',
      type: 'Family Office',
      dryPowder: 14500000,
      ticketRange: { min: 250000, max: 1500000 },
      sectors: ['HVAC', 'Manufacturing', 'Logistics'],
      geography: 'Southeast US / Mid-Atlantic',
      reputationIndex: 98,
      status: 'ACTIVE',
      verifiedAt: '02-18-2026'
    },
    {
      id: 'LP-3341',
      name: 'Vanguard Legacy Pool',
      type: 'HNW Syndicate',
      dryPowder: 6800000,
      ticketRange: { min: 100000, max: 500000 },
      sectors: ['SaaS', 'Professional Services'],
      geography: 'Remote / US National',
      reputationIndex: 94,
      status: 'ACTIVE',
      verifiedAt: '02-22-2026'
    },
    {
      id: 'LP-5011',
      name: 'Canyon Crest Capital',
      type: 'Micro-PE',
      dryPowder: 22000000,
      ticketRange: { min: 500000, max: 2500000 },
      sectors: ['Manufacturing', 'Logistics', 'Distribution'],
      geography: 'Midwest Corridor',
      reputationIndex: 99,
      status: 'ACTIVE',
      verifiedAt: '02-10-2026'
    },
    {
      id: 'LP-7704',
      name: 'Nero Apex Syndicates',
      type: 'HNW Syndicate',
      dryPowder: 4200000,
      ticketRange: { min: 150000, max: 400000 },
      sectors: ['Home Services', 'HVAC'],
      geography: 'Texas Triangle / South',
      reputationIndex: 91,
      status: 'STANDBY',
      verifiedAt: '02-25-2026'
    },
    {
      id: 'LP-1109',
      name: 'Krypton Real-Asset LP',
      type: 'Institutional Co-Investor',
      dryPowder: 45000000,
      ticketRange: { min: 1000000, max: 5000000 },
      sectors: ['Logistics', 'Manufacturing'],
      geography: 'Global / US Coastal',
      reputationIndex: 97,
      status: 'ACTIVE',
      verifiedAt: '01-30-2026'
    },
    {
      id: 'LP-2290',
      name: 'Apex Horizon Capital',
      type: 'Family Office',
      dryPowder: 11000000,
      ticketRange: { min: 250000, max: 1000000 },
      sectors: ['SaaS', 'Home Services'],
      geography: 'Pacific Northwest',
      reputationIndex: 93,
      status: 'ACTIVE',
      verifiedAt: '02-20-2026'
    }
  ];

  // --- FILTERED DIRECTORY LOGIC ---
  const filteredLPs = useMemo(() => {
    return lpDatabase.filter((lp) => {
      const matchSearch =
        lp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lp.geography.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchSector =
        selectedSector === 'ALL' || lp.sectors.includes(selectedSector);
      
      const matchType = selectedType === 'ALL' || lp.type === selectedType;
      
      const matchTicket = lp.ticketRange.max >= ticketFilter;

      return matchSearch && matchSector && matchType && matchTicket;
    });
  }, [searchTerm, selectedSector, selectedType, ticketFilter]);

  // --- WATERFALL DISTRIBUTION CALCULATION ---
  const waterfallOutcomes = useMemo(() => {
    // Stage 1: Capital Payback (LPs priority split)
    const lpCapitalPayback = Math.min(exitPool, equityNeeded);
    let remainingPool = Math.max(0, exitPool - lpCapitalPayback);

    // Stage 2: LP Preferred Return
    const lpPreferredReturnEarned = equityNeeded * (prefRate / 100);
    const lpPreferredReturnPaid = Math.min(remainingPool, lpPreferredReturnEarned);
    remainingPool = Math.max(0, remainingPool - lpPreferredReturnPaid);

    // Stage 3: Split (GP Carry vs LP Split)
    const gpCarryShare = remainingPool * (gpCarry / 100);
    const lpSplitShare = remainingPool * ((100 - gpCarry) / 100);

    const totalLPDistributions = lpCapitalPayback + lpPreferredReturnPaid + lpSplitShare;
    const totalGPDistributions = gpCarryShare;

    // Return metrics
    const lpRoi = equityNeeded > 0 ? (totalLPDistributions / equityNeeded) * 100 : 0;
    const lpMultiple = equityNeeded > 0 ? totalLPDistributions / equityNeeded : 0;

    return {
      lpCapitalPayback,
      lpPreferredReturnPaid,
      lpSplitShare,
      gpCarryShare,
      totalLPDistributions,
      totalGPDistributions,
      lpRoi,
      lpMultiple,
      excessAboveCapital: exitPool - equityNeeded
    };
  }, [equityNeeded, exitPool, prefRate, gpCarry]);

  // --- TRANSACTION SECURE TRANSMISSION SIMULATOR ---
  const handleInitiateTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    setTransmissionProgress(0);

    const interval = setInterval(() => {
      setTransmissionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTransmitting(false);
          setTransmissionSuccess(true);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono min-h-screen border-t border-[#222222] p-4 md:p-6 select-none">
      
      {/* 1. COMPONENT SECTION TITLE HEADER */}
      <div className="border border-[#222222] bg-[#0a0a0a] p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#0EA5E9] block animate-pulse"></span>
            <span className="text-xs text-[#0EA5E9] font-bold tracking-widest">// CO-INVESTOR SYNDICATION HUB</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-[#F9F9F9] mt-1">
            GP/LP Equity Matcher & Waterfall Distribution Engine
          </h1>
        </div>
        <div className="text-right flex flex-col items-start md:items-end">
          <span className="text-[10px] text-[#888888] uppercase">Secure Syndication Protocol</span>
          <span className="text-xs text-[#00FF66] font-bold mt-1">NETWORK ACTIVE // MULTI-CHANNEL SECURE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 2. LEFT GRID PANEL: WATERFALL EQUITY MODELER */}
        <section className="lg:col-span-5 border border-[#222222] bg-[#0a0a0a] p-4 md:p-6 flex flex-col space-y-6">
          <div className="border-b border-[#222222] pb-3 flex justify-between items-center">
            <span className="text-xs text-[#888888] uppercase tracking-wider">// Equity Waterfall Modeler</span>
            <span className="text-[9px] text-[#00FF66] border border-[#00FF66]/30 px-1.5 py-0.5 bg-[#00FF66]/5">REAL-TIME</span>
          </div>

          <div className="text-[11px] text-[#888888] leading-relaxed">
            Simulate a typical micro-private equity GP/LP capital structure. Determine target fundraising limits, preferred returns (Pref), and carry distributions inside exits.
          </div>

          {/* MODELER INPUTS */}
          <div className="space-y-4">
            
            {/* Target LP Equity Raised */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">REQUIRED LP EQUITY (GAP):</span>
                <span className="text-[#0EA5E9] font-bold">{formatCurrency(equityNeeded)}</span>
              </div>
              <input
                type="range"
                min={200000}
                max={4000000}
                step={100000}
                value={equityNeeded}
                onChange={(e) => setEquityNeeded(Number(e.target.value))}
                className="w-full h-1 bg-[#111111] appearance-none cursor-pointer accent-[#0EA5E9]"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>$200K</span>
                <span>$4.0M</span>
              </div>
            </div>

            {/* Simulated Exit Valuation Liquidity Pool */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">SIMULATED EXIT LIQUIDITY POOL:</span>
                <span className="text-[#00FF66] font-bold">{formatCurrency(exitPool)}</span>
              </div>
              <input
                type="range"
                min={500000}
                max={10000000}
                step={250000}
                value={exitPool}
                onChange={(e) => setExitPool(Number(e.target.value))}
                className="w-full h-1 bg-[#111111] appearance-none cursor-pointer accent-[#00FF66]"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>$500K</span>
                <span>$10.0M (Scale Exit)</span>
              </div>
            </div>

            {/* LP Preferred Return */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">LP PREFERRED RETURN (PREF):</span>
                <span className="text-white font-bold">{prefRate}%</span>
              </div>
              <input
                type="range"
                min={4}
                max={15}
                step={1}
                value={prefRate}
                onChange={(e) => setPrefRate(Number(e.target.value))}
                className="w-full h-1 bg-[#111111] appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>4% Low Yield</span>
                <span>15% Aggressive Pref</span>
              </div>
            </div>

            {/* GP Carry Split post-hurdle */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">GP CARRY SPLIT (POST-PREF):</span>
                <span className="text-[#FF3333] font-bold">{gpCarry}% GP / {100 - gpCarry}% LP</span>
              </div>
              <input
                type="range"
                min={10}
                max={40}
                step={5}
                value={gpCarry}
                onChange={(e) => setGpCarry(Number(e.target.value))}
                className="w-full h-1 bg-[#111111] appearance-none cursor-pointer accent-[#FF3333]"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>10% Low Carry</span>
                <span>40% GP Promoted Target</span>
              </div>
            </div>

          </div>

          {/* VISUAL WATERFALL STACKED PAYOUT PROGRESS BAR */}
          <div className="border border-[#222222] bg-[#070707] p-4 space-y-3">
            <span className="text-[10px] text-[#888888] uppercase block tracking-wider">// Distribution Visual Breakdown</span>
            
            <div className="h-6 bg-[#111] flex overflow-hidden border border-[#222]">
              {/* LP Capital Payback Segment */}
              <div 
                style={{ width: `${(waterfallOutcomes.lpCapitalPayback / exitPool) * 100}%` }}
                className="bg-[#0EA5E9] h-full transition-all duration-300"
                title={`Capital Payback: ${formatCurrency(waterfallOutcomes.lpCapitalPayback)}`}
              ></div>
              {/* LP Pref Paid Segment */}
              <div 
                style={{ width: `${(waterfallOutcomes.lpPreferredReturnPaid / exitPool) * 100}%` }}
                className="bg-white h-full transition-all duration-300"
                title={`LP Pref Paid: ${formatCurrency(waterfallOutcomes.lpPreferredReturnPaid)}`}
              ></div>
              {/* LP Split Share */}
              <div 
                style={{ width: `${(waterfallOutcomes.lpSplitShare / exitPool) * 100}%` }}
                className="bg-[#00FF66]/70 h-full transition-all duration-300"
                title={`LP Post-Pref Share: ${formatCurrency(waterfallOutcomes.lpSplitShare)}`}
              ></div>
              {/* GP Carry split */}
              <div 
                style={{ width: `${(waterfallOutcomes.gpCarryShare / exitPool) * 100}%` }}
                className="bg-[#FF3333] h-full transition-all duration-300"
                title={`GP Carry: ${formatCurrency(waterfallOutcomes.gpCarryShare)}`}
              ></div>
            </div>

            {/* Visualizer Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[10px]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#0EA5E9] inline-block"></span>
                <span className="text-[#888888]">LP CAPITAL RECUPERATION</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-white inline-block"></span>
                <span className="text-[#888888]">LP PREFERRED DIVIDEND</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#00FF66]/70 inline-block"></span>
                <span className="text-[#888888]">LP COMMON EXIT SURPLUS</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#FF3333] inline-block"></span>
                <span className="text-[#888888]">GP PROMOTED CARRY</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC METRIC OUTFLOWS */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] text-[#888888] uppercase block tracking-wider">// Dynamic Metric Outflows</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#222222] p-3 bg-[#0c0c0c]">
                <span className="text-[9px] text-[#888888] block">TOTAL LP PAYOUT</span>
                <span className="text-base font-bold text-[#0EA5E9]">{formatCurrency(waterfallOutcomes.totalLPDistributions)}</span>
                <span className="text-[10px] text-[#888888] block mt-1">ROI: {waterfallOutcomes.lpRoi.toFixed(1)}% ({waterfallOutcomes.lpMultiple.toFixed(2)}x)</span>
              </div>
              <div className="border border-[#222222] p-3 bg-[#0c0c0c]">
                <span className="text-[9px] text-[#888888] block">TOTAL GP PROMOTE CARRY</span>
                <span className="text-base font-bold text-[#FF3333]">{formatCurrency(waterfallOutcomes.totalGPDistributions)}</span>
                <span className="text-[10px] text-[#888888] block mt-1">Carry Effective Split: {((waterfallOutcomes.totalGPDistributions / exitPool) * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="border border-[#222222] p-3 bg-[#111111] text-xs">
              <span className="text-[#888888]">STATUS REPORT:</span>
              {exitPool < equityNeeded ? (
                <div className="text-[#FF3333] font-bold uppercase mt-1">
                  ⚠️ WARNING: Exit Liquidity Pool below Total Target Capital. LPs suffer a capital deficit of {formatCurrency(equityNeeded - exitPool)}.
                </div>
              ) : (
                <div className="text-[#00FF66] font-bold uppercase mt-1">
                  🟢 SYSTEM OK: Hurdle Met. All LP capital returned, Pref return paid, Excess profit division successfully processed.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. RIGHT GRID PANEL: LP CO-INVESTOR DIRECTORY */}
        <section className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* SEARCH & FILTER TERMINAL CONTROL */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col space-y-4">
            <span className="text-xs text-[#888888] uppercase tracking-wider">// Filter & Search Target LP Network</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-[#888888] uppercase block mb-1">Search Keywords</label>
                <input
                  type="text"
                  placeholder="e.g. Aegis, Texas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] p-2 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#888888] uppercase block mb-1">Sector Preference</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] p-2 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                >
                  <option value="ALL">All Sectors</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Logistics">Logistics</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Home Services">Home Services</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#888888] uppercase block mb-1">Investor Class</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] p-2 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                >
                  <option value="ALL">All Investor Classes</option>
                  <option value="Family Office">Family Office</option>
                  <option value="HNW Syndicate">HNW Syndicate</option>
                  <option value="Micro-PE">Micro-PE</option>
                  <option value="Institutional Co-Investor">Institutional Co-Investor</option>
                </select>
              </div>
            </div>

            {/* Ticket Range Minima Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">FILTER BY MIN TICKET COMPATIBILITY:</span>
                <span className="text-[#0EA5E9] font-bold">{formatCurrency(ticketFilter)}</span>
              </div>
              <input
                type="range"
                min={100000}
                max={1500000}
                step={100000}
                value={ticketFilter}
                onChange={(e) => setTicketFilter(Number(e.target.value))}
                className="w-full h-1 bg-[#111111] appearance-none cursor-pointer accent-[#0EA5E9]"
              />
            </div>
          </div>

          {/* ACTIVE DIRECTORY RESULTS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1 text-xs text-[#888888]">
              <span>VERIFIED DIRECTORY MATCHES: {filteredLPs.length} LPs</span>
              <span>STANDBY MODE EXCLUDED: {lpDatabase.filter(l => l.status === 'STANDBY').length}</span>
            </div>

            {filteredLPs.length === 0 ? (
              <div className="border border-[#FF3333] bg-[#ff3333]/5 p-8 text-center space-y-2">
                <span className="text-lg text-[#FF3333] font-bold block">🚨 NO DEPLOYABLE CO-INVESTORS MATCHED</span>
                <p className="text-xs text-[#888888] max-w-md mx-auto">
                  Adjust target ticket parameters, filter structures, or broaden sector selections to re-establish secure communications with LP assets.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLPs.map((lp) => (
                  <div
                    key={lp.id}
                    className="border border-[#222222] bg-[#0a0a0a] hover:border-[#0ea5e9] transition-all duration-300 p-4 flex flex-col justify-between space-y-4"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-[#222222]/50 pb-2">
                      <div>
                        <span className="text-[10px] text-[#0ea5e9] block font-bold">{lp.id} // {lp.type}</span>
                        <h3 className="text-sm font-bold uppercase text-white mt-0.5">{lp.name}</h3>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 border font-bold ${
                        lp.status === 'ACTIVE' ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5' : 'border-yellow-500 text-yellow-500 bg-yellow-500/5'
                      }`}>
                        {lp.status}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] text-[#888888]">
                      <div>
                        <span className="text-[8px] uppercase block">ESTIMATED DRY POWDER</span>
                        <span className="text-white font-bold">{formatCurrency(lp.dryPowder)}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase block">TICKET RANGE</span>
                        <span className="text-white font-bold">
                          {formatCurrency(lp.ticketRange.min)} - {formatCurrency(lp.ticketRange.max)}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[8px] uppercase block">PREFERENCE METRICS</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lp.sectors.map(sector => (
                            <span key={sector} className="bg-[#111] border border-[#222] text-[9px] text-white px-1.5 py-0.5">
                              {sector}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[8px] uppercase block">GEOGRAPHY IN SCOPE</span>
                        <span className="text-[#F9F9F9] text-[10px]">{lp.geography}</span>
                      </div>
                    </div>

                    {/* Foot & Secure Contact Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#222222]/50">
                      <div className="flex items-center space-x-1.5 text-[9px]">
                        <span className="text-[#888888]">REPUTATION INDEX:</span>
                        <span className="text-[#00FF66] font-bold">{lp.reputationIndex}%</span>
                      </div>
                      <button
                        onClick={() => setSelectedLPForContact(lp)}
                        className="text-[10px] px-3 py-1.5 bg-[#0EA5E9] text-[#050505] hover:bg-[#050505] hover:text-[#0EA5E9] border border-[#0EA5E9] font-bold transition-all"
                      >
                        TRANSMIT TEASER
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </section>

      </div>

      {/* 4. MODAL: SECURE LP COMMUNICATION TERMINAL */}
      {selectedLPForContact && (
        <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="border border-[#222222] bg-[#0a0a0a] w-full max-w-2xl p-6 relative space-y-6">
            
            {/* Modal Header */}
            <div className="border-b border-[#222222] pb-4 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-[#0EA5E9] font-bold">// SECURE POINT-TO-POINT SYNDICATION COMMS</span>
                <h3 className="text-lg font-bold uppercase text-white">Teaser Payload Pipeline to {selectedLPForContact.name}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedLPForContact(null);
                  setTransmissionSuccess(false);
                  setIsTransmitting(false);
                }}
                className="text-xs border border-[#222222] px-2 py-1 text-[#888888] hover:border-[#FF3333] hover:text-[#FF3333]"
              >
                [ESC] TERMINATE
              </button>
            </div>

            {transmissionSuccess ? (
              // Success Screen
              <div className="border border-[#00FF66] bg-[#00FF66]/5 p-6 text-center space-y-4">
                <span className="text-2xl text-[#00FF66] font-bold block">✓ TRANSMISSION COMPLETE</span>
                <p className="text-xs text-[#888888] max-w-md mx-auto leading-relaxed">
                  Your encrypted acquisition dossier payload has been piped into the LP portfolio team. 
                  Symmetric security parameters verified. Status is set to <span className="text-[#00FF66]">STANDBY</span>.
                </p>
                <button
                  onClick={() => {
                    setSelectedLPForContact(null);
                    setTransmissionSuccess(false);
                  }}
                  className="bg-[#00FF66] text-black text-xs font-bold px-4 py-2 hover:bg-black hover:text-[#00FF66] border border-[#00FF66] transition-all"
                >
                  Return to Control Deck
                </button>
              </div>
            ) : isTransmitting ? (
              // Transmission Progress Screen
              <div className="space-y-4 py-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#0ea5e9] animate-pulse">ENCRYPTING & ROUTING SECURE PACKAGE...</span>
                  <span className="text-[#0ea5e9]">{transmissionProgress}%</span>
                </div>
                <div className="w-full bg-[#111] h-3 border border-[#222]">
                  <div
                    className="bg-[#0ea5e9] h-full transition-all duration-300"
                    style={{ width: `${transmissionProgress}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-[#888888] space-y-1">
                  <div>PLAID VERIFICATION TOKEN: [OK]</div>
                  <div>CIPHER SUITE: TLS_AES_256_GCM_SHA384</div>
                  <div>SYNDICATION ALLOTMENT RESERVATION: SUCCESS</div>
                </div>
              </div>
            ) : (
              // Data Entry / Form
              <form onSubmit={handleInitiateTransmission} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs text-[#888888]">
                  <div>
                    <span className="block uppercase text-[9px]">Symmetric LP Node</span>
                    <span className="text-white font-bold">{selectedLPForContact.id}</span>
                  </div>
                  <div>
                    <span className="block uppercase text-[9px]">Minimum Target Allocation</span>
                    <span className="text-[#00FF66] font-bold">{formatCurrency(selectedLPForContact.ticketRange.min)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#888888] uppercase block">Acquisition Teaser Subject (Blinded Codename)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Project Cobalt - $1.2M EBITDA HVAC Acquisition Co-Invest"
                    value={teaserSubject}
                    onChange={(e) => setTeaserSubject(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222222] p-2.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#888888] uppercase block">Dossier Narrative / Structure Overview</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide a blinded overview. Mention deal size, current GP fund commitment, debt structure, and the target timeline for syndication lock."
                    value={teaserBody}
                    onChange={(e) => setTeaserBody(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222222] p-2.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>

                <div className="bg-[#111111] border border-[#222222] p-3 text-[10px] text-[#888888]">
                  🔒 <span className="text-white font-bold uppercase">Compliance Node Encryption Active:</span> By transmitting this packet, you represent that this teaser information represents a real or strictly blinded transaction. Communications conform to private syndication guidelines under SEC Rule 506(b) safe harbors. No public solicitation of securities is processed via this node.
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto text-xs font-bold px-6 py-3 bg-[#0EA5E9] text-[#050505] border border-[#0EA5E9] hover:bg-[#050505] hover:text-[#0EA5E9] hover:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] transition-all uppercase tracking-wider"
                  >
                    Initiate Payload Transmission
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}