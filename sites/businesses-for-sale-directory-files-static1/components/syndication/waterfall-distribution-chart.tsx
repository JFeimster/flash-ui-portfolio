import React, { useState, useMemo } from 'react';

// Define TS Types for clean state management
interface LPInvestor {
  id: string;
  name: string;
  type: string;
  dryPowder: number;
  ticketRange: string;
  focusSectors: string[];
  status: 'ONLINE' | 'STANDBY' | 'ENGAGED';
}

export default function WaterfallDistributionChart() {
  // --- STATE FOR WATERFALL SIMULATOR ---
  const [totalDealSize, setTotalDealSize] = useState<number>(3500000);
  const [gpEquityPercent, setGpEquityPercent] = useState<number>(10); // GP (Searcher) Equity
  const [preferredReturn, setPreferredReturn] = useState<number>(8.0); // Preferred Return %
  const [promotePercent, setPromotePercent] = useState<number>(20); // GP Carry / Promote after Pref
  const [totalDistributableCash, setTotalDistributableCash] = useState<number>(1200000); // Exit / Yield to distribute

  // --- SAFE CHAT CONSOLE LOGS ---
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'SYS_ALERT', text: 'Secure encryption node activated. TLS 1.3 handshake successful.', time: '14:22:01' },
    { sender: 'CO_INVESTOR_89', text: 'Reviewing your Project Delta logistics deck. Can you run the exit distribution with a 10% preferred return hurdle?', time: '14:24:18' }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  // --- LP DRY-POWDER DIRECTORY ---
  const initialLps: LPInvestor[] = [
    { id: 'LP-3392', name: 'Aether Capital Family Office', type: 'SFO', dryPowder: 12500000, ticketRange: '$500K - $1.5M', focusSectors: ['Logistics', 'HVAC'], status: 'ONLINE' },
    { id: 'LP-0881', name: 'Ironwood Search Partners', type: 'Fund of Funds', dryPowder: 22000000, ticketRange: '$1M - $3.0M', focusSectors: ['SaaS', 'Manufacturing'], status: 'ENGAGED' },
    { id: 'LP-7761', name: 'Vanguard Legacy Trust', type: 'MFO', dryPowder: 8000000, ticketRange: '$250K - $750K', focusSectors: ['Home Services', 'HVAC'], status: 'STANDBY' },
    { id: 'LP-2041', name: 'Blackwood Syndicates', type: 'HNW Network', dryPowder: 15000000, ticketRange: '$500K - $2.0M', focusSectors: ['Logistics', 'SaaS'], status: 'ONLINE' }
  ];

  const [lps] = useState<LPInvestor[]>(initialLps);
  const [selectedLp, setSelectedLp] = useState<LPInvestor | null>(null);

  // --- COMPUTED SYNDICATION VALUES ---
  const equityGap = useMemo(() => {
    // Assume 35% of Total Deal Size is Equity Gap needed, rest is Debt/SBA.
    return Math.round(totalDealSize * 0.35);
  }, [totalDealSize]);

  const gpCapital = useMemo(() => {
    return Math.round(equityGap * (gpEquityPercent / 100));
  }, [equityGap, gpEquityPercent]);

  const lpCapital = useMemo(() => {
    return Math.round(equityGap - gpCapital);
  }, [equityGap, gpCapital]);

  // --- WATERFALL MATHEMATICAL ENGINE ---
  const waterfallDistribution = useMemo(() => {
    // Tier 1: Preferred Return Distribution (Pro-Rata to original capital contributions)
    const totalPrefRequired = Math.round(equityGap * (preferredReturn / 100));
    const lpPrefRequired = Math.round(lpCapital * (preferredReturn / 100));
    const gpPrefRequired = Math.round(gpCapital * (preferredReturn / 100));

    let lpTier1Payout = 0;
    let gpTier1Payout = 0;
    let remainingCash = totalDistributableCash;

    if (remainingCash >= totalPrefRequired) {
      lpTier1Payout = lpPrefRequired;
      gpTier1Payout = gpPrefRequired;
      remainingCash -= totalPrefRequired;
    } else {
      // Scale pro-rata if cash is less than the preferred return hurdle
      const lpProRataShare = lpCapital / equityGap;
      const gpProRataShare = gpCapital / equityGap;
      lpTier1Payout = Math.round(remainingCash * lpProRataShare);
      gpTier1Payout = Math.round(remainingCash * gpProRataShare);
      remainingCash = 0;
    }

    // Tier 2: Split with Promote (GP receives their promote% plus pro-rata share, LP receives balance)
    let lpTier2Payout = 0;
    let gpTier2Payout = 0;

    if (remainingCash > 0) {
      // GP Promoted Carry is carved out, balance distributed pro-rata or according to promote target splits
      // GP Total Share = GP Promote % + GP Equity Share of remaining balance
      const gpPromoteCash = remainingCash * (promotePercent / 100);
      const remainingAfterPromote = remainingCash - gpPromoteCash;

      const lpProRataShare = lpCapital / equityGap;
      const gpProRataShare = gpCapital / equityGap;

      lpTier2Payout = Math.round(remainingAfterPromote * lpProRataShare);
      gpTier2Payout = Math.round(gpPromoteCash + (remainingAfterPromote * gpProRataShare));
    }

    const totalLpPayout = lpTier1Payout + lpTier2Payout;
    const totalGpPayout = gpTier1Payout + gpTier2Payout;

    // Multiples
    const lpMultiple = lpCapital > 0 ? (totalLpPayout / lpCapital).toFixed(2) : '0.00';
    const gpMultiple = gpCapital > 0 ? (totalGpPayout / gpCapital).toFixed(2) : '0.00';

    return {
      lpTier1Payout,
      gpTier1Payout,
      lpTier2Payout,
      gpTier2Payout,
      totalLpPayout,
      totalGpPayout,
      lpMultiple,
      gpMultiple,
      remainingCash
    };
  }, [equityGap, lpCapital, gpCapital, preferredReturn, promotePercent, totalDistributableCash]);

  // --- HANDLERS ---
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const timeString = new Date().toTimeString().split(' ')[0];
    setMessages((prev) => [
      ...prev,
      { sender: 'USER_SEARCHER', text: inputMessage, time: timeString }
    ]);
    setInputMessage('');

    // Simulated reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'CO_INVESTOR_89',
          text: 'Acknowledged. Running calculations against our LP hurdle framework.',
          time: new Date().toTimeString().split(' ')[0]
        }
      ]);
    }, 1200);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono border border-[#222222] p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* 1. COMPONENT SYSTEM TITLE BAR */}
      <div className="border-b border-[#222222] pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#0EA5E9] font-bold tracking-widest">// CO-INVESTOR EQUITY SYNDICATION HUB</span>
          <h1 className="text-xl font-bold tracking-wider uppercase text-[#F9F9F9] flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
            GP / LP Waterfall Distribution Modeler
          </h1>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#888888]">
          <div className="bg-[#111111] px-2.5 py-1 border border-[#222222]">
            SECURED GAP POOL: <span className="text-[#00FF66]">$1.2M+</span>
          </div>
          <div className="bg-[#111111] px-2.5 py-1 border border-[#222222]">
            VERIFIED LPs: <span className="text-[#0EA5E9]">48 ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: CONTROLS & PARAMS (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-6">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// Structural Inputs</span>
              <span className="text-[9px] text-[#00FF66]">[LIVE AMORTIZATION]</span>
            </div>

            {/* Total Deal Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">TARGET DEAL SIZE:</span>
                <span className="text-[#F9F9F9] font-bold">{formatCurrency(totalDealSize)}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="10000000"
                step="250000"
                value={totalDealSize}
                onChange={(e) => setTotalDealSize(Number(e.target.value))}
                className="w-full accent-[#00FF66] h-1 bg-[#111111] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>$1.0M</span>
                <span className="text-[#0EA5E9]">Gap: {formatCurrency(equityGap)} (35%)</span>
                <span>$10M</span>
              </div>
            </div>

            {/* GP Equity Commitment */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">GP COMMITMENT (%):</span>
                <span className="text-[#00FF66] font-bold">{gpEquityPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="2.5"
                value={gpEquityPercent}
                onChange={(e) => setGpEquityPercent(Number(e.target.value))}
                className="w-full accent-[#00FF66] h-1 bg-[#111111] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>5% Min</span>
                <span className="text-[#0EA5E9]">GP Cap: {formatCurrency(gpCapital)}</span>
                <span>30% Max</span>
              </div>
            </div>

            {/* Preferred Return Hurdle */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">PREFERRED RETURN (LP HURDLE):</span>
                <span className="text-[#0EA5E9] font-bold">{preferredReturn.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="15.0"
                step="0.5"
                value={preferredReturn}
                onChange={(e) => setPreferredReturn(Number(e.target.value))}
                className="w-full accent-[#0EA5E9] h-1 bg-[#111111] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>5.0%</span>
                <span>15.0%</span>
              </div>
            </div>

            {/* Promote (GP Carry) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">GP PROMOTE (CARRY OVER PREF):</span>
                <span className="text-[#00FF66] font-bold">{promotePercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={promotePercent}
                onChange={(e) => setPromotePercent(Number(e.target.value))}
                className="w-full accent-[#00FF66] h-1 bg-[#111111] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>10% Promote</span>
                <span>40% Promote</span>
              </div>
            </div>

            {/* Total Distributable Capital */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">DISTRIBUTABLE CAPITAL (EXIT/YIELD):</span>
                <span className="text-[#FF3333] font-bold">{formatCurrency(totalDistributableCash)}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="3000000"
                step="100000"
                value={totalDistributableCash}
                onChange={(e) => setTotalDistributableCash(Number(e.target.value))}
                className="w-full accent-[#FF3333] h-1 bg-[#111111] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>$200K</span>
                <span>$3.0M Exit Pool</span>
              </div>
            </div>
          </div>

          {/* QUICK CAPITALIZATION SUMMARY CARD */}
          <div className="border border-[#222222] bg-[#111111] p-4 text-xs space-y-3">
            <span className="text-xs text-[#888888] uppercase tracking-wider block">// Core Cap Table Ratios</span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-[#050505] p-2 border border-[#222222]">
                <span className="text-[10px] text-[#888888] block">LP CAPITAL REQ</span>
                <span className="font-bold text-[#F9F9F9]">{formatCurrency(lpCapital)}</span>
              </div>
              <div className="bg-[#050505] p-2 border border-[#222222]">
                <span className="text-[10px] text-[#888888] block">GP CONTRIBUTION</span>
                <span className="font-bold text-[#F9F9F9]">{formatCurrency(gpCapital)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: WATERFALL VISUALIZER & SPLITS (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-6">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// Distribution Visualizer Matrix</span>
              <span className="text-[9px] text-[#0EA5E9]">SECURE CALC V2.4</span>
            </div>

            {/* DYNAMIC WATERFALL DISTRIBUTION STACKED BAR CHART */}
            <div className="space-y-4">
              <div className="text-[10px] text-[#888888] uppercase">Interactive Cash Allocation Stack:</div>
              <div className="h-10 bg-[#111111] border border-[#222222] flex overflow-hidden">
                {/* LP Total share */}
                {waterfallDistribution.totalLpPayout > 0 && (
                  <div
                    style={{ width: `${(waterfallDistribution.totalLpPayout / totalDistributableCash) * 100}%` }}
                    className="bg-[#0EA5E9] h-full flex items-center justify-center text-[10px] font-bold text-[#050505] transition-all duration-300 relative group"
                  >
                    <span>LP: {((waterfallDistribution.totalLpPayout / totalDistributableCash) * 100).toFixed(0)}%</span>
                  </div>
                )}
                {/* GP Total share */}
                {waterfallDistribution.totalGpPayout > 0 && (
                  <div
                    style={{ width: `${(waterfallDistribution.totalGpPayout / totalDistributableCash) * 100}%` }}
                    className="bg-[#00FF66] h-full flex items-center justify-center text-[10px] font-bold text-[#050505] transition-all duration-300 relative group"
                  >
                    <span>GP: {((waterfallDistribution.totalGpPayout / totalDistributableCash) * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-[10px] text-[#888888]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#0EA5E9] inline-block"></span>
                  <span>LP Return Share ({formatCurrency(waterfallDistribution.totalLpPayout)})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#00FF66] inline-block"></span>
                  <span>GP Return Share ({formatCurrency(waterfallDistribution.totalGpPayout)})</span>
                </div>
              </div>
            </div>

            {/* BREAKDOWN BY HURDLE TIER */}
            <div className="space-y-3 pt-2">
              <span className="text-xs text-[#888888] uppercase block">// Hurdle Payout Metrics</span>
              
              {/* Hurdle 1 Row */}
              <div className="border border-[#222222] bg-[#0c0c0c] p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#F9F9F9] font-bold">TIER 1: PREFERRED RETURN ({preferredReturn.toFixed(1)}%)</span>
                  <span className="text-[#0EA5E9]">Up to {formatCurrency(Math.round(equityGap * (preferredReturn / 100)))}</span>
                </div>
                <div className="grid grid-cols-2 text-[10px] text-[#888888]">
                  <div>LP Payout: <span className="text-[#F9F9F9]">{formatCurrency(waterfallDistribution.lpTier1Payout)}</span></div>
                  <div>GP Payout: <span className="text-[#F9F9F9]">{formatCurrency(waterfallDistribution.gpTier1Payout)}</span></div>
                </div>
              </div>

              {/* Hurdle 2 Row */}
              <div className="border border-[#222222] bg-[#0c0c0c] p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#F9F9F9] font-bold">TIER 2: SPLIT & PROMOTE (GP gets {promotePercent}%)</span>
                  <span className="text-[#00FF66]">Above Preference Return Limit</span>
                </div>
                <div className="grid grid-cols-2 text-[10px] text-[#888888]">
                  <div>LP Payout: <span className="text-[#F9F9F9]">{formatCurrency(waterfallDistribution.lpTier2Payout)}</span></div>
                  <div>GP Payout: <span className="text-[#F9F9F9]">{formatCurrency(waterfallDistribution.gpTier2Payout)}</span></div>
                </div>
              </div>
            </div>

            {/* PERFORMANCE ANALYSIS OUTCOMES */}
            <div className="grid grid-cols-2 gap-4 border-t border-[#222222] pt-4">
              <div className="bg-[#111111] p-3 border border-[#222222]">
                <span className="text-[10px] text-[#888888] block">CO-INVESTOR (LP) MULTIPLE</span>
                <span className="text-lg font-bold text-[#0EA5E9] tracking-tight">{waterfallDistribution.lpMultiple}x</span>
                <span className="text-[9px] text-[#888888] block">ROI Multiple On Equity Cap</span>
              </div>
              <div className="bg-[#111111] p-3 border border-[#222222]">
                <span className="text-[10px] text-[#888888] block">SEARCHER (GP) MULTIPLE</span>
                <span className="text-lg font-bold text-[#00FF66] tracking-tight">{waterfallDistribution.gpMultiple}x</span>
                <span className="text-[9px] text-[#888888] block">Boosted by Promote / Carry Structure</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: LP DIRECTORY & SAFELINK COMMUNICATIONS (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* LP CO-INVESTOR MATCH DIRECTORY */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <span className="text-xs text-[#888888] uppercase block">// Verified LP Directory</span>
            <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
              {lps.map((lp) => (
                <div
                  key={lp.id}
                  onClick={() => setSelectedLp(lp)}
                  className={`p-2.5 border text-left cursor-pointer transition-all duration-150 ${
                    selectedLp?.id === lp.id
                      ? 'border-[#0EA5E9] bg-[#0c0c0c]'
                      : 'border-[#222222] hover:border-[#00FF66] bg-[#050505]'
                  }`}
                >
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-[#F9F9F9] truncate max-w-[150px]">{lp.name}</span>
                    <span className={`text-[9px] px-1 ${
                      lp.status === 'ONLINE' ? 'text-[#00FF66] bg-[#00FF66]/10' :
                      lp.status === 'ENGAGED' ? 'text-[#0EA5E9] bg-[#0EA5E9]/10' : 'text-[#888888] bg-[#111111]'
                    }`}>
                      {lp.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#888888] mt-1">
                    <span>Dry Powder: {formatCurrency(lp.dryPowder)}</span>
                    <span className="text-white">{lp.type}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* SELECTION REMARKS */}
            {selectedLp && (
              <div className="border border-[#0EA5E9]/30 bg-[#0c0c0c] p-2.5 text-[10px] space-y-1.5">
                <div className="text-[#0EA5E9] font-bold">// SELECTION SYNDICATION MEMO</div>
                <div>Focus: <span className="text-white">{selectedLp.focusSectors.join(', ')}</span></div>
                <div>Ticket size: <span className="text-[#00FF66] font-bold">{selectedLp.ticketRange}</span></div>
                <button
                  onClick={() => {
                    const timeString = new Date().toTimeString().split(' ')[0];
                    setMessages((prev) => [
                      ...prev,
                      { sender: 'USER_SEARCHER', text: `Initiated direct safe dialogue with ${selectedLp.name}`, time: timeString }
                    ]);
                  }}
                  className="w-full mt-2 text-center text-[9px] font-bold py-1 bg-[#0EA5E9] text-[#050505] hover:bg-white transition-colors uppercase tracking-widest"
                >
                  Initiate Secure Communication Link
                </button>
              </div>
            )}
          </div>

          {/* SAFELINK SECURE ENCRYPTED COMMS */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col space-y-4">
            <span className="text-xs text-[#888888] uppercase block">// SafeLink Secure Terminal (Blinded)</span>
            
            <div className="h-[140px] border border-[#222222] bg-[#050505] p-2 text-[10px] space-y-2 overflow-y-auto">
              {messages.map((m, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[9px]">
                    <span className={m.sender === 'SYS_ALERT' ? 'text-[#FF3333]' : m.sender === 'USER_SEARCHER' ? 'text-[#00FF66]' : 'text-[#0EA5E9]'}>
                      [{m.sender}]
                    </span>
                    <span className="text-[#888888]">{m.time}</span>
                  </div>
                  <p className="text-[#F9F9F9] leading-tight break-words">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Secure terminal input..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow bg-[#050505] border border-[#222222] text-xs p-2 text-white placeholder-[#888888] focus:outline-none focus:border-[#00FF66] uppercase font-mono"
              />
              <button
                type="submit"
                className="bg-[#00FF66] text-[#050505] px-3 font-bold text-xs hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] transition-all"
              >
                SEND
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* 3. SYNDICATION PROCESS NOTES / WARNINGS */}
      <div className="border-t border-[#222222] pt-4 text-[9px] text-[#888888] flex flex-col sm:flex-row justify-between gap-4">
        <span>* Syndication simulations are models based on standard private equity distribution waterfalls and do not promise guaranteed exits.</span>
        <span className="text-[#0EA5E9] font-bold">SECURE NODE SYNDICATION // MODEL: WA-09</span>
      </div>

    </div>
  );
}