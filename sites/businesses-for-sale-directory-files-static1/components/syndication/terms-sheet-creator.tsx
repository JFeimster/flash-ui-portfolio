import React, { useState, useMemo } from 'react';

// Interfaces for State Management
interface LPProfile {
  id: string;
  name: string;
  type: 'Family Office' | 'HNI' | 'Micro-PE' | 'Syndicate';
  dryPowder: number;
  prefSectors: string[];
  ticketSize: string;
  location: string;
  verified: boolean;
  activeMatches: number;
}

export default function TermsSheetCreator() {
  // LP Directory State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedLP, setSelectedLP] = useState<LPProfile | null>(null);
  const [sentInquiries, setSentInquiries] = useState<string[]>([]);
  
  // Encrypted Messenger State
  const [messageLogs, setMessageLogs] = useState<Array<{ sender: 'SYSTEM' | 'YOU' | 'LP'; text: string; time: string }>>([
    { sender: 'SYSTEM', text: 'SECURE TUNNEL TERMINAL ONLINE. ENCRYPTION PROTOCOL [AES-256] ENGAGED.', time: '09:41:02' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Equity Waterfall Modeler State
  const [equityGap, setEquityGap] = useState<number>(1500000);
  const [gpCommitmentPercent, setGpCommitmentPercent] = useState<number>(10); // GP commitment e.g. 10%
  const [prefReturn, setPrefReturn] = useState<number>(8); // 8% Pref
  const [lpSplitAbovePref, setLpSplitAbovePref] = useState<number>(70); // LP gets 70% above pref
  const [simulatedExitProceeds, setSimulatedExitProceeds] = useState<number>(4500000); // Simulated exit distributions

  // Static LP Database
  const lpDatabase: LPProfile[] = [
    {
      id: 'LP-9082',
      name: 'Vektor Alpha Family Office',
      type: 'Family Office',
      dryPowder: 12500000,
      prefSectors: ['SaaS', 'Logistics'],
      ticketSize: '$500K - $1.5M',
      location: 'Zurich / Remote',
      verified: true,
      activeMatches: 4
    },
    {
      id: 'LP-4412',
      name: 'Dr. Evelyn Chen (HNW)',
      type: 'HNI',
      dryPowder: 4500000,
      prefSectors: ['HVAC', 'Manufacturing'],
      ticketSize: '$250K - $500K',
      location: 'Austin, TX',
      verified: true,
      activeMatches: 2
    },
    {
      id: 'LP-3109',
      name: 'Apex Syndicate Pool',
      type: 'Syndicate',
      dryPowder: 8000000,
      prefSectors: ['Home Services', 'HVAC'],
      ticketSize: '$100K - $750K',
      location: 'New York, NY',
      verified: true,
      activeMatches: 5
    },
    {
      id: 'LP-7704',
      name: 'Kodiak Micro-PE Fund II',
      type: 'Micro-PE',
      dryPowder: 22000000,
      prefSectors: ['Manufacturing', 'Logistics'],
      ticketSize: '$1M - $3M',
      location: 'Chicago, IL',
      verified: true,
      activeMatches: 3
    },
    {
      id: 'LP-5521',
      name: 'Sovereign Tech Operators',
      type: 'Syndicate',
      dryPowder: 6000000,
      prefSectors: ['SaaS'],
      ticketSize: '$150K - $400K',
      location: 'San Francisco, CA',
      verified: true,
      activeMatches: 1
    }
  ];

  // Calculations for Equity Distribution Modeler
  const gpCommitmentAmount = useMemo(() => {
    return Math.round(equityGap * (gpCommitmentPercent / 100));
  }, [equityGap, gpCommitmentPercent]);

  const lpCommitmentAmount = useMemo(() => {
    return Math.round(equityGap - gpCommitmentAmount);
  }, [equityGap, gpCommitmentAmount]);

  const waterfallCalculations = useMemo(() => {
    const totalContributed = equityGap;
    
    // Step 1: Return of Capital (Pro-rata)
    const gpCapitalReturn = Math.min(gpCommitmentAmount, simulatedExitProceeds * (gpCommitmentPercent / 100));
    const lpCapitalReturn = Math.min(lpCommitmentAmount, simulatedExitProceeds * ((100 - gpCommitmentPercent) / 100));
    const capitalReturnedTotal = gpCapitalReturn + lpCapitalReturn;
    
    const remainingProceedsAfterCapReturn = Math.max(0, simulatedExitProceeds - totalContributed);

    // Step 2: Preferred Return (Pro-rata based on capital split, standard assumption)
    const lpPrefReturnOwed = lpCommitmentAmount * (prefReturn / 100);
    const gpPrefReturnOwed = gpCommitmentAmount * (prefReturn / 100);
    
    const lpPrefPaid = Math.min(lpPrefReturnOwed, remainingProceedsAfterCapReturn * (lpCommitmentAmount / totalContributed));
    const gpPrefPaid = Math.min(gpPrefReturnOwed, remainingProceedsAfterCapReturn * (gpCommitmentAmount / totalContributed));
    const totalPrefPaid = lpPrefPaid + gpPrefPaid;
    
    const remainingProceedsAfterPref = Math.max(0, remainingProceedsAfterCapReturn - totalPrefPaid);

    // Step 3: Split Above Preferred Return (Promote)
    const lpPromotePaid = remainingProceedsAfterPref * (lpSplitAbovePref / 100);
    const gpPromotePaid = remainingProceedsAfterPref * ((100 - lpSplitAbovePref) / 100);

    // Totals
    const totalLpPayout = lpCapitalReturn + lpPrefPaid + lpPromotePaid;
    const totalGpPayout = gpCapitalReturn + gpPrefPaid + gpPromotePaid;

    const lpMultiple = lpCommitmentAmount > 0 ? (totalLpPayout / lpCommitmentAmount).toFixed(2) : '0.0';
    const gpMultiple = gpCommitmentAmount > 0 ? (totalGpPayout / gpCommitmentAmount).toFixed(2) : '0.0';

    return {
      gpCommitmentAmount,
      lpCommitmentAmount,
      gpCapitalReturn,
      lpCapitalReturn,
      gpPrefPaid,
      lpPrefPaid,
      gpPromotePaid,
      lpPromotePaid,
      totalLpPayout,
      totalGpPayout,
      lpMultiple,
      gpMultiple,
    };
  }, [equityGap, gpCommitmentPercent, prefReturn, lpSplitAbovePref, simulatedExitProceeds, gpCommitmentAmount, lpCommitmentAmount]);

  // Handle Search & Filter
  const filteredLPs = useMemo(() => {
    return lpDatabase.filter(lp => {
      const matchSearch = lp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lp.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSector = selectedSector === 'ALL' || lp.prefSectors.includes(selectedSector);
      return matchSearch && matchSector;
    });
  }, [searchTerm, selectedSector]);

  // Actions
  const handleSendInquiry = (lpId: string, lpName: string) => {
    if (sentInquiries.includes(lpId)) return;
    setSentInquiries([...sentInquiries, lpId]);
    
    // Log message simulation
    const timestamp = new Date().toLocaleTimeString();
    setMessageLogs(prev => [
      ...prev,
      { sender: 'YOU', text: `TRANSMISSION SENT: Requesting connection to secure node ${lpName} (${lpId}). Sent GP/LP Equity Waterfall structural simulation matrix.`, time: timestamp },
      { sender: 'SYSTEM', text: `HANDSHAKE APPLIED: Encrypted ledger tunnel built with ${lpName}. Waiting on secure LP private key key exchange.`, time: timestamp }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    setMessageLogs(prev => [
      ...prev,
      { sender: 'YOU', text: newMessage, time: timestamp }
    ]);
    setNewMessage('');

    // Simulated LP auto-response
    setTimeout(() => {
      const systemTimestamp = new Date().toLocaleTimeString();
      setMessageLogs(prev => [
        ...prev,
        { 
          sender: 'LP', 
          text: `DECRYPTED TRANSMISSION RECEIVED: Your structural simulation indicators look sound. Our investment committee expects DSCR minimum of 1.40x. Forward audited financials to confirm pipeline parameters.`, 
          time: systemTimestamp 
        }
      ]);
    }, 1500);
  };

  const formatCurrency = (val: number) => {
    return new Intl.FormatNumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="font-mono bg-[#050505] text-[#F9F9F9] min-h-screen p-4 md:p-6 flex flex-col space-y-6 antialiased selection:bg-[#00FF66] selection:text-[#050505]">
      
      {/* 1. COMPONENT MONITOR HEADER */}
      <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#0EA5E9] animate-pulse"></span>
            <span className="text-xs uppercase text-[#0EA5E9] font-bold tracking-widest">// ASSET SYNDICATION PROTOCOL</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold uppercase mt-1 tracking-tight">Co-Investor Equity Syndication Hub</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#888888]">
          <div className="bg-[#111111] px-2 py-1 border border-[#222222]">
            SECURE ROUTER: <span className="text-[#00FF66]">CONNECTED</span>
          </div>
          <div className="bg-[#111111] px-2 py-1 border border-[#222222]">
            VERIFIED LP LIQUIDITY: <span className="text-[#0EA5E9]">$53.0M DRY POWDER</span>
          </div>
        </div>
      </div>

      {/* 2. THREE-PANEL WORKING LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE CO-INVESTOR/LP DIRECTORY (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-3">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// LP Directory Network</span>
              <span className="text-[9px] text-[#00FF66] bg-[#00FF66]/10 px-1.5 py-0.5 border border-[#00FF66]/20">ACTIVE STREAM</span>
            </div>

            {/* Micro Filter Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-[#888888] uppercase block mb-1">Search LP Node</label>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="LOCATION / KEYWORD..." 
                  className="w-full bg-[#050505] border border-[#222222] p-2 text-xs focus:border-[#0EA5E9] focus:outline-none placeholder-[#888888] uppercase"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#888888] uppercase block mb-1">Preferred Sector</label>
                <select 
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] p-2 text-xs focus:border-[#0EA5E9] focus:outline-none text-[#F9F9F9] uppercase cursor-pointer"
                >
                  <option value="ALL">ALL SECTORS</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Logistics">Logistics</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Home Services">Home Services</option>
                </select>
              </div>
            </div>

            {/* LP Scrolled Directory */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredLPs.length === 0 ? (
                <div className="border border-[#FF3333] bg-[#0f0707] p-4 text-center text-xs text-[#FF3333]">
                  NO LPs MATCH THE SEARCH METRIC.
                </div>
              ) : (
                filteredLPs.map((lp) => (
                  <div 
                    key={lp.id} 
                    onClick={() => setSelectedLP(lp)}
                    className={`border p-3 transition-all duration-200 cursor-pointer ${
                      selectedLP?.id === lp.id 
                        ? 'border-[#0EA5E9] bg-[#0c0c0c] shadow-[0_0_10px_rgba(14,165,233,0.1)]' 
                        : 'border-[#222222] bg-[#080808] hover:border-[#888888]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-[#0EA5E9]" x-text="lp.id">{lp.id}</span>
                          <span className="text-xs font-bold">{lp.name}</span>
                        </div>
                        <span className="text-[9px] text-[#888888] uppercase block mt-1">{lp.type} • {lp.location}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-[#00FF66] block">{formatCurrency(lp.dryPowder)}</span>
                        <span className="text-[8px] text-[#888888] uppercase block">EST DRY POWDER</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {lp.prefSectors.map((s, idx) => (
                        <span key={idx} className="text-[8px] px-1.5 py-0.5 border border-[#222222] bg-[#050505] text-[#888888] uppercase font-bold">
                          {s}
                        </span>
                      ))}
                      <span className="text-[8px] ml-auto text-[#0EA5E9] font-bold">TICKET: {lp.ticketSize}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECURE COMMS PORTAL */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-3">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// Encrypted Direct Tunnel</span>
              <span className="text-[9px] text-[#00FF66] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] inline-block animate-ping"></span> SECURE-NET
              </span>
            </div>

            {/* Chat Messages Frame */}
            <div className="bg-[#050505] border border-[#222222] p-3 h-[200px] overflow-y-auto space-y-2 text-[11px]">
              {messageLogs.map((log, index) => (
                <div key={index} className="space-y-0.5 leading-relaxed">
                  <div className="flex justify-between text-[9px] text-[#888888]">
                    <span>
                      {log.sender === 'SYSTEM' && <span className="text-[#FF3333] font-bold">[SYS_LOG]</span>}
                      {log.sender === 'YOU' && <span className="text-[#0EA5E9] font-bold">[YOU]</span>}
                      {log.sender === 'LP' && <span className="text-[#00FF66] font-bold">[CO_INVESTOR_NODE]</span>}
                    </span>
                    <span>{log.time}</span>
                  </div>
                  <p className={log.sender === 'SYSTEM' ? 'text-[#888888] italic' : 'text-[#F9F9F9]'}>
                    {log.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="INPUT SECURE MSG TRANSMISSION..." 
                className="flex-grow bg-[#050505] border border-[#222222] p-2 text-xs focus:border-[#00FF66] focus:outline-none text-[#F9F9F9] placeholder-[#888888] uppercase"
              />
              <button 
                type="submit" 
                className="bg-[#00FF66] text-[#050505] font-bold px-4 text-xs hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] transition-colors"
              >
                SEND
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: GP/LP WATERFALL MODELER & VISUALIZER (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 md:p-6 space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#222222] pb-4 gap-2">
              <div>
                <span className="text-xs text-[#888888] uppercase tracking-wider">// Equity Allocation Modeler</span>
                <h2 className="text-base font-bold uppercase text-[#0EA5E9]">Waterfall Payout Simulator</h2>
              </div>
              <div className="text-[10px] text-[#888888]">
                GP/LP PROMOTIONS / PREF SYSTEM v1.2
              </div>
            </div>

            {/* Form Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Equity Gap Target */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888] uppercase">REQUIRED EQUITY GAP:</span>
                  <span className="text-[#0EA5E9] font-bold">{formatCurrency(equityGap)}</span>
                </div>
                <input 
                  type="range" 
                  min="500000" 
                  max="5000000" 
                  step="100000" 
                  value={equityGap}
                  onChange={(e) => setEquityGap(parseInt(e.target.value))}
                  className="w-full accent-[#0EA5E9]"
                  style={{ background: '#111111', height: '4px' }}
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>$500K</span>
                  <span>$5.0M</span>
                </div>
              </div>

              {/* GP Commitment Percent */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888] uppercase">GP CASH COMMITMENT (%):</span>
                  <span className="text-[#00FF66] font-bold">{gpCommitmentPercent}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="25" 
                  step="1" 
                  value={gpCommitmentPercent}
                  onChange={(e) => setGpCommitmentPercent(parseInt(e.target.value))}
                  className="w-full accent-[#00FF66]"
                  style={{ background: '#111111', height: '4px' }}
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>1% Min</span>
                  <span>25% Max</span>
                </div>
              </div>

              {/* Preferred Return % */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888] uppercase">LP PREFERRED RETURN (8% default):</span>
                  <span className="text-[#00FF66] font-bold">{prefReturn}%</span>
                </div>
                <input 
                  type="range" 
                  min="4" 
                  max="15" 
                  step="0.5" 
                  value={prefReturn}
                  onChange={(e) => setPrefReturn(parseFloat(e.target.value))}
                  className="w-full accent-[#00FF66]"
                  style={{ background: '#111111', height: '4px' }}
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>4%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* LP Split above Hurdle */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888] uppercase">LP PROMOTIONS SPLIT (AFTER PREF):</span>
                  <span className="text-[#0EA5E9] font-bold">{lpSplitAbovePref}% LP / {100 - lpSplitAbovePref}% GP</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="95" 
                  step="5" 
                  value={lpSplitAbovePref}
                  onChange={(e) => setLpSplitAbovePref(parseInt(e.target.value))}
                  className="w-full accent-[#0EA5E9]"
                  style={{ background: '#111111', height: '4px' }}
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>50% Split</span>
                  <span>95% (Hurdle Soft-Cap)</span>
                </div>
              </div>

            </div>

            {/* Simulated Exit Scenarios Multiplier */}
            <div className="bg-[#111111] p-4 border border-[#222222] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase text-[#888888] tracking-wider">// Simulated Exit Capital For Waterfall Model</span>
                <span className="text-xs font-bold text-[#0EA5E9]">{formatCurrency(simulatedExitProceeds)}</span>
              </div>
              <input 
                type="range" 
                min={equityGap} 
                max={equityGap * 5} 
                step="50000" 
                value={simulatedExitProceeds}
                onChange={(e) => setSimulatedExitProceeds(parseInt(e.target.value))}
                className="w-full accent-[#0EA5E9]"
                style={{ background: '#050505', height: '4px' }}
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>Return of Principal ({formatCurrency(equityGap)})</span>
                <span>5x Return ({formatCurrency(equityGap * 5)})</span>
              </div>
            </div>

            {/* RESULTS METRICS BAR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LP Results Block */}
              <div className="border border-[#222222] bg-[#0c0c0c] p-4 space-y-2 relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[10px] text-[#888888] tracking-widest font-bold">LP POOL</div>
                <div className="text-[10px] text-[#888888] uppercase">LP INVESTED CASH</div>
                <div className="text-lg font-bold text-[#F9F9F9]">{formatCurrency(waterfallCalculations.lpCommitmentAmount)}</div>
                
                <div className="pt-2 border-t border-[#222222]/50 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] text-[#888888] block">TOTAL RET:</span>
                    <span className="text-[#00FF66] font-bold">{formatCurrency(waterfallCalculations.totalLpPayout)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888888] block">MOIC MULTIPLE:</span>
                    <span className="text-[#00FF66] font-bold">{waterfallCalculations.lpMultiple}x</span>
                  </div>
                </div>
              </div>

              {/* GP Results Block */}
              <div className="border border-[#222222] bg-[#0c0c0c] p-4 space-y-2 relative overflow-hidden">
                <div className="absolute right-2 top-2 text-[10px] text-[#888888] tracking-widest font-bold">GP SEARCHER</div>
                <div className="text-[10px] text-[#888888] uppercase">GP SPONSOR CAPITAL</div>
                <div className="text-lg font-bold text-[#F9F9F9]">{formatCurrency(waterfallCalculations.gpCommitmentAmount)}</div>
                
                <div className="pt-2 border-t border-[#222222]/50 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] text-[#888888] block">TOTAL RET:</span>
                    <span className="text-[#0EA5E9] font-bold">{formatCurrency(waterfallCalculations.totalGpPayout)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888888] block">MOIC MULTIPLE:</span>
                    <span className="text-[#0EA5E9] font-bold">{waterfallCalculations.gpMultiple}x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WATERFALL VISUAL DIAGRAM */}
            <div className="border border-[#222222] bg-[#080808] p-4 space-y-4">
              <span className="text-xs uppercase text-[#888888] block tracking-widest">// STACKED DISTRIBUTION TIER GRAPH</span>
              
              <div className="space-y-3">
                {/* Tier 1: Capital Return */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#F9F9F9] font-bold">TIER 1: Return of Equity Capital</span>
                    <span className="text-[#888888]">{formatCurrency(waterfallCalculations.gpCapitalReturn + waterfallCalculations.lpCapitalReturn)} / {formatCurrency(equityGap)}</span>
                  </div>
                  <div className="w-full bg-[#111111] h-3 flex border border-[#222222]">
                    <div 
                      className="bg-[#0EA5E9]" 
                      style={{ width: `${(waterfallCalculations.lpCapitalReturn / equityGap) * 100}%` }}
                      title={`LP Cap Return: ${formatCurrency(waterfallCalculations.lpCapitalReturn)}`}
                    ></div>
                    <div 
                      className="bg-[#00FF66]" 
                      style={{ width: `${(waterfallCalculations.gpCapitalReturn / equityGap) * 100}%` }}
                      title={`GP Cap Return: ${formatCurrency(waterfallCalculations.gpCapitalReturn)}`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-[#888888]">
                    <span>LP Portion: {formatCurrency(waterfallCalculations.lpCapitalReturn)}</span>
                    <span>GP Portion: {formatCurrency(waterfallCalculations.gpCapitalReturn)}</span>
                  </div>
                </div>

                {/* Tier 2: Preferred Return */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#00FF66] font-bold">TIER 2: Preferred Return ({prefReturn}%)</span>
                    <span className="text-[#888888]">{formatCurrency(waterfallCalculations.gpPrefPaid + waterfallCalculations.lpPrefPaid)} Distributed</span>
                  </div>
                  <div className="w-full bg-[#111111] h-3 flex border border-[#222222]">
                    <div 
                      className="bg-[#00FF66]/70" 
                      style={{ 
                        width: `${Math.max(2, Math.min(100, ((waterfallCalculations.lpPrefPaid) / (waterfallCalculations.gpPrefPaid + waterfallCalculations.lpPrefPaid || 1)) * 100))}%` 
                      }}
                    ></div>
                    <div 
                      className="bg-[#0EA5E9]/70" 
                      style={{ 
                        width: `${Math.max(2, Math.min(100, ((waterfallCalculations.gpPrefPaid) / (waterfallCalculations.gpPrefPaid + waterfallCalculations.lpPrefPaid || 1)) * 100))}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-[#888888]">
                    <span>LP Paid: {formatCurrency(waterfallCalculations.lpPrefPaid)}</span>
                    <span>GP Paid: {formatCurrency(waterfallCalculations.gpPrefPaid)}</span>
                  </div>
                </div>

                {/* Tier 3: Promoting/Excess Common Split */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#0EA5E9] font-bold">TIER 3: Promotions Split ({lpSplitAbovePref}% LP / {100 - lpSplitAbovePref}% GP)</span>
                    <span className="text-[#888888]">{formatCurrency(waterfallCalculations.gpPromotePaid + waterfallCalculations.lpPromotePaid)} Remaining Split</span>
                  </div>
                  <div className="w-full bg-[#111111] h-3 flex border border-[#222222]">
                    <div 
                      className="bg-[#0EA5E9]" 
                      style={{ width: `${lpSplitAbovePref}%` }}
                    ></div>
                    <div 
                      className="bg-[#00FF66]" 
                      style={{ width: `${100 - lpSplitAbovePref}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-[#888888]">
                    <span>LP Share ({lpSplitAbovePref}%): {formatCurrency(waterfallCalculations.lpPromotePaid)}</span>
                    <span>GP Promote ({100 - lpSplitAbovePref}%): {formatCurrency(waterfallCalculations.gpPromotePaid)}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* SECTOR TARGET LP DETAILS PANEL */}
            {selectedLP ? (
              <div className="border border-[#0EA5E9] bg-[#0c0c0c]/80 p-4 space-y-4">
                <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                  <span className="text-xs text-[#0EA5E9] font-bold uppercase tracking-wider">// SELECTED CO-INVESTOR TARGET DISCLOSURE</span>
                  <button 
                    onClick={() => setSelectedLP(null)} 
                    className="text-[10px] text-[#888888] hover:text-[#FF3333] transition-colors"
                  >
                    [CLEAR SELECTION]
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] text-[#888888] block">FIRM NODE:</span>
                    <span className="font-bold text-[#F9F9F9]">{selectedLP.name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888888] block">STATED LIQUIDITY:</span>
                    <span className="font-bold text-[#00FF66]">{formatCurrency(selectedLP.dryPowder)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888888] block">TARGET TICKET:</span>
                    <span className="font-bold text-[#0EA5E9]">{selectedLP.ticketSize}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888888] block">GEOGRAPHIC NODE:</span>
                    <span className="font-bold text-[#F9F9F9]">{selectedLP.location}</span>
                  </div>
                </div>

                {/* Secure Syndication Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                  <p className="text-[10px] text-[#888888] max-w-md">
                    *Requesting secure link sends your currently customized Waterfall Equity distribution parameters automatically.
                  </p>
                  <button 
                    onClick={() => handleSendInquiry(selectedLP.id, selectedLP.name)}
                    disabled={sentInquiries.includes(selectedLP.id)}
                    className={`text-xs font-bold uppercase px-6 py-3 border transition-all duration-200 text-center ${
                      sentInquiries.includes(selectedLP.id)
                        ? 'border-[#222222] text-[#888888] bg-[#111111] cursor-not-allowed'
                        : 'border-[#00FF66] bg-[#00FF66] text-[#050505] hover:bg-[#050505] hover:text-[#00FF66] hover:shadow-[4px_4px_0px_0px_rgba(0,255,102,1)]'
                    }`}
                  >
                    {sentInquiries.includes(selectedLP.id) ? '✓ TRANSMISSION SENT' : 'REQUEST SECURE LINK & MODEL SHARE'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-[#222222] p-4 text-center text-xs text-[#888888]">
                CHOOSE AN LP CO-INVESTOR FROM THE DIRECTORY TO ENGAGE DIRECT TUNNEL COMMUNICATIONS & MATCH WATERFALL PARAMETERS
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}