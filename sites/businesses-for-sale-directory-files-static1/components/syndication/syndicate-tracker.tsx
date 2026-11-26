import React, { useState, useMemo } from 'react';

// Interfaces
interface LP {
  id: string;
  alias: string;
  type: string;
  verifiedDryPowder: number;
  averageCheckSize: string;
  preferredSectors: string[];
  geography: string;
  matchScore: number; // Percentage
  status: 'ACTIVE' | 'DORMANT' | 'UNDER_NDA';
}

export default function SyndicateTracker() {
  // State for active view tab
  const [activeTab, setActiveTab] = useState<'directory' | 'waterfall' | 'messenger'>('waterfall');

  // LP Directory State
  const [lpSearch, setLpSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  // Safe Communication / Teaser Form State
  const [teaserFormData, setTeaserFormData] = useState({
    targetCodename: '',
    industrySector: '',
    ebitda: '',
    equityGapNeeded: '',
    debtSbaArranged: 'YES',
    briefTeaser: '',
  });
  const [teaserLogs, setTeaserLogs] = useState<string[]>([]);
  const [isSendingTeaser, setIsSendingTeaser] = useState(false);

  // Waterfall Modeler Inputs
  const [dealEquityGap, setDealEquityGap] = useState<number>(1500000); // Amount to raise
  const [gpCommitmentPercent, setGpCommitmentPercent] = useState<number>(10); // GP equity contribution %
  const [preferredReturnRate, setPreferredReturnRate] = useState<number>(8); // Annual Hurdle Rate %
  const [gpPromoteSplit, setGpPromoteSplit] = useState<number>(20); // GP split after hurdle %
  const [estimatedExitEquityVal, setEstimatedExitEquityVal] = useState<number>(4500000); // Exit equity value to distribute

  // Mock LPs
  const lps: LP[] = [
    {
      id: 'LP-9082',
      alias: 'Vanguard Family Office Delta',
      type: 'Single Family Office',
      verifiedDryPowder: 12500000,
      averageCheckSize: '$500K - $1.5M',
      preferredSectors: ['SaaS', 'Logistics', 'HVAC'],
      geography: 'Southeast US / Remote',
      matchScore: 98,
      status: 'ACTIVE',
    },
    {
      id: 'LP-4410',
      alias: 'Apex Micro-PE Fund II',
      type: 'Micro Fund',
      verifiedDryPowder: 24000000,
      averageCheckSize: '$1.0M - $3.0M',
      preferredSectors: ['Manufacturing', 'HVAC', 'B2B Services'],
      geography: 'Midwest / National',
      matchScore: 92,
      status: 'ACTIVE',
    },
    {
      id: 'LP-1192',
      alias: 'Ironwood Yield Trust',
      type: 'LP Consortium',
      verifiedDryPowder: 8000000,
      averageCheckSize: '$250K - $750K',
      preferredSectors: ['Logistics', 'Home Services'],
      geography: 'Texas Triangle',
      matchScore: 89,
      status: 'UNDER_NDA',
    },
    {
      id: 'LP-3049',
      alias: 'Cascade Capital Partners',
      type: 'Multi-Family Office',
      verifiedDryPowder: 45000000,
      averageCheckSize: '$2.0M - $5.0M',
      preferredSectors: ['Manufacturing', 'SaaS'],
      geography: 'Pacific Northwest',
      matchScore: 84,
      status: 'ACTIVE',
    },
    {
      id: 'LP-7761',
      alias: 'Onyx Search Backers Ltd',
      type: 'Search Fund LP',
      verifiedDryPowder: 6200000,
      averageCheckSize: '$200K - $600K',
      preferredSectors: ['Home Services', 'HVAC'],
      geography: 'East Coast US',
      matchScore: 76,
      status: 'DORMANT',
    },
  ];

  // Waterfall Calculation Logic
  const waterfallOutputs = useMemo(() => {
    // Total Equity Base
    const totalEquityFunded = dealEquityGap;
    const gpCapital = totalEquityFunded * (gpCommitmentPercent / 100);
    const lpCapital = totalEquityFunded * (1 - gpCommitmentPercent / 100);

    // Simulated Timeframe for pref return calculations (Assume exit after Year 5)
    const investmentPeriodYears = 5;

    // Standard cash distribution model of Exit Equity Value
    const cashRemaining = estimatedExitEquityVal;

    // Step 1: Capital Repayment (Pro-rata return of initial capital)
    const capRepayToGP = Math.min(gpCapital, cashRemaining * (gpCapital / totalEquityFunded));
    const capRepayToLP = Math.min(lpCapital, cashRemaining * (lpCapital / totalEquityFunded));
    let undistributedCash = Math.max(0, cashRemaining - (capRepayToGP + capRepayToLP));

    // Step 2: Preferred Return Tier (8% compounding or flat annual return over 5 years pro-rata)
    // Formula for flat aggregate return: Capital * Rate * Years
    const lpPrefReturnOwed = lpCapital * (preferredReturnRate / 100) * investmentPeriodYears;
    const gpPrefReturnOwed = gpCapital * (preferredReturnRate / 100) * investmentPeriodYears;

    const lpPrefPaid = Math.min(lpPrefReturnOwed, undistributedCash * (lpCapital / totalEquityFunded));
    const gpPrefPaid = Math.min(gpPrefReturnOwed, undistributedCash * (gpCapital / totalEquityFunded));
    undistributedCash = Math.max(0, undistributedCash - (lpPrefPaid + gpPrefPaid));

    // Step 3: Promote / Remaining Split (GP gets promote split, LP gets balance)
    // GP gets: Promote% + Pro-rata share of remaining
    const gpSplitPercentAfterHurdle = gpPromoteSplit + (gpCommitmentPercent * (1 - gpPromoteSplit / 100));
    const lpSplitPercentAfterHurdle = 100 - gpSplitPercentAfterHurdle;

    const gpPromotePaid = undistributedCash * (gpSplitPercentAfterHurdle / 100);
    const lpPromotePaid = undistributedCash * (lpSplitPercentAfterHurdle / 100);

    // Total Distributions
    const totalGPPayout = capRepayToGP + gpPrefPaid + gpPromotePaid;
    const totalLPPayout = capRepayToLP + lpPrefPaid + lpPromotePaid;

    // Multiple on Invested Capital (MOIC)
    const gpMoic = gpCapital > 0 ? totalGPPayout / gpCapital : 0;
    const lpMoic = lpCapital > 0 ? totalLPPayout / lpCapital : 0;
    const totalMoic = totalEquityFunded > 0 ? estimatedExitEquityVal / totalEquityFunded : 0;

    return {
      gpCapital,
      lpCapital,
      capRepayToGP,
      capRepayToLP,
      gpPrefPaid,
      lpPrefPaid,
      gpPromotePaid,
      lpPromotePaid,
      totalGPPayout,
      totalLPPayout,
      gpMoic,
      lpMoic,
      totalMoic,
    };
  }, [dealEquityGap, gpCommitmentPercent, preferredReturnRate, gpPromoteSplit, estimatedExitEquityVal]);

  // Handle teaser submissions
  const handleTeaserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teaserFormData.targetCodename || !teaserFormData.equityGapNeeded) {
      alert('SYSTEM ALERT: Missing critical metrics.');
      return;
    }
    setIsSendingTeaser(true);

    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString();
      const newLog = `[${timestamp}] PIPELINE DISPATCH: Teaser for ${teaserFormData.targetCodename} ($${teaserFormData.equityGapNeeded} LP GAP) transmitted successfully to verified regional nodes under cryptographic protocol.`;
      setTeaserLogs((prev) => [newLog, ...prev]);
      setIsSendingTeaser(false);
      // Reset
      setTeaserFormData({
        targetCodename: '',
        industrySector: '',
        ebitda: '',
        equityGapNeeded: '',
        debtSbaArranged: 'YES',
        briefTeaser: '',
      });
    }, 1200);
  };

  // Helper formatting values
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // LP Directory Filtering
  const filteredLPs = useMemo(() => {
    return lps.filter((lp) => {
      const matchesSearch =
        lp.alias.toLowerCase().includes(lpSearch.toLowerCase()) ||
        lp.type.toLowerCase().includes(lpSearch.toLowerCase()) ||
        lp.geography.toLowerCase().includes(lpSearch.toLowerCase());

      const matchesSector =
        selectedSector === 'ALL' || lp.preferredSectors.includes(selectedSector);

      return matchesSearch && matchesSector;
    });
  }, [lpSearch, selectedSector]);

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono p-4 md:p-6 border border-[#222222] space-y-6">
      {/* 1. Header & Terminal Metadata */}
      <div className="border-b border-[#222222] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#00FF66] animate-pulse rounded-none"></span>
            <span className="text-[10px] tracking-widest text-[#0EA5E9] uppercase font-bold">
              SYSTEM GATEWAY // SYNDICATION HUB
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-wider text-[#F9F9F9] uppercase mt-1">
            CO-INVESTOR EQUITY PORTAL
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] bg-[#111111] p-2 border border-[#222222]">
          <div>SECURE FEED: <span className="text-[#00FF66] font-bold">ESTABLISHED</span></div>
          <span className="text-[#222222]">|</span>
          <div>LP POOL DRY POWDER: <span className="text-[#0EA5E9] font-bold">$95.7M+</span></div>
          <span className="text-[#222222]">|</span>
          <div>CO-FUND LEVEL: <span className="text-[#00FF66] font-bold">GP-LOCKED</span></div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('waterfall')}
          className={`text-xs py-3 border transition-all duration-150 tracking-wider uppercase flex justify-between px-3 ${
            activeTab === 'waterfall'
              ? 'bg-[#00FF66] text-[#050505] font-bold border-[#00FF66]'
              : 'bg-[#111111] text-[#F9F9F9] border-[#222222] hover:border-[#00FF66] hover:text-[#00FF66]'
          }`}
        >
          <span>1. EQUITY WATERFALL MODEL</span>
          <span className="hidden sm:inline">[ACTIVE MODELER]</span>
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`text-xs py-3 border transition-all duration-150 tracking-wider uppercase flex justify-between px-3 ${
            activeTab === 'directory'
              ? 'bg-[#00FF66] text-[#050505] font-bold border-[#00FF66]'
              : 'bg-[#111111] text-[#F9F9F9] border-[#222222] hover:border-[#00FF66] hover:text-[#00FF66]'
          }`}
        >
          <span>2. VERIFIED LP DIRECTORY</span>
          <span className="hidden sm:inline">[VERIFIED DRY-POWDER]</span>
        </button>
        <button
          onClick={() => setActiveTab('messenger')}
          className={`text-xs py-3 border transition-all duration-150 tracking-wider uppercase flex justify-between px-3 ${
            activeTab === 'messenger'
              ? 'bg-[#00FF66] text-[#050505] font-bold border-[#00FF66]'
              : 'bg-[#111111] text-[#F9F9F9] border-[#222222] hover:border-[#00FF66] hover:text-[#00FF66]'
          }`}
        >
          <span>3. SECURE PIPELINE TX</span>
          <span className="hidden sm:inline">[COMMUNICATION NODE]</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: WATERFALL MODELER */}
      {activeTab === 'waterfall' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Modeler Inputs Panel */}
          <div className="lg:col-span-5 border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// DISTRIBUTION PARAMETERS</span>
              <span className="text-[10px] text-[#00FF66] font-bold">[REAL-TIME MODEL]</span>
            </div>

            {/* Parameter Input: Target LP Equity Requirement */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">REQUIRED LP EQUITY GAP:</span>
                <span className="text-[#0EA5E9] font-bold">{formatCurrency(dealEquityGap)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="100000"
                value={dealEquityGap}
                onChange={(e) => setDealEquityGap(Number(e.target.value))}
                className="w-full accent-[#0EA5E9] bg-[#111111]"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>$500K</span>
                <span>$5.0M Cap</span>
              </div>
            </div>

            {/* Parameter Input: GP Commitment % */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">GP CAPITAL CONTRIBUTION %:</span>
                <span className="text-[#00FF66] font-bold">{gpCommitmentPercent}%</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="25"
                step="2.5"
                value={gpCommitmentPercent}
                onChange={(e) => setGpCommitmentPercent(Number(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#111111]"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>2.5% (Sponsor Min)</span>
                <span>25% Max</span>
              </div>
            </div>

            {/* Parameter Input: Preferred Return (Hurdle) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">LP PREFERRED RETURN (ANNUAL):</span>
                <span className="text-[#00FF66] font-bold">{preferredReturnRate}%</span>
              </div>
              <input
                type="range"
                min="6"
                max="12"
                step="0.5"
                value={preferredReturnRate}
                onChange={(e) => setPreferredReturnRate(Number(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#111111]"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>6% Standard</span>
                <span>12% High Yield</span>
              </div>
            </div>

            {/* Parameter Input: GP Promote Split after Hurdle */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">GP PROMOTE SPLIT AFTER HURDLE:</span>
                <span className="text-[#0EA5E9] font-bold">{gpPromoteSplit}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={gpPromoteSplit}
                onChange={(e) => setGpPromoteSplit(Number(e.target.value))}
                className="w-full accent-[#0EA5E9] bg-[#111111]"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>10% Low Target</span>
                <span>50% Maximum Cap</span>
              </div>
            </div>

            {/* Parameter Input: Estimated Exit Valuation */}
            <div className="space-y-2 pt-2 border-t border-[#222222]">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">EST. EXIT EQUITY VALUE AT SALE (YEAR 5):</span>
                <span className="text-white font-bold">{formatCurrency(estimatedExitEquityVal)}</span>
              </div>
              <input
                type="range"
                min={dealEquityGap}
                max={dealEquityGap * 5}
                step="250000"
                value={estimatedExitEquityVal}
                onChange={(e) => setEstimatedExitEquityVal(Number(e.target.value))}
                className="w-full accent-white bg-[#111111]"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>Cost Basis (1.0x)</span>
                <span>5.0x Growth Target</span>
              </div>
            </div>

            {/* Core Calculations Note */}
            <div className="p-3 bg-[#111111] border border-[#222222] text-[10px] text-[#888888] space-y-1">
              <span className="text-white font-bold block uppercase">// STRUCTURAL MODEL ASSUMPTIONS</span>
              <p>Model aggregates standard pro-rata distributions for capital repayments prior to compounding the {preferredReturnRate}% preferred hurdle payout across an assumed 5-year lockup sequence.</p>
            </div>
          </div>

          {/* Outputs & Visualization Panel */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual Bar Graph of Equity Splits */}
            <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
              <span className="text-xs text-[#888888] uppercase block tracking-wider">// WATERFALL CAPITAL RECOUPMENT BREAKDOWN</span>
              
              {/* Funded Capital Stack */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#888888]">
                  <span>INITIAL CAPITAL CONTRIBUTIONS (100% CAPITAL STACK)</span>
                  <span>{formatCurrency(dealEquityGap)} Funded</span>
                </div>
                <div className="w-full bg-[#111111] h-6 flex border border-[#222222] overflow-hidden">
                  <div 
                    style={{ width: `${100 - gpCommitmentPercent}%` }}
                    className="h-full bg-[#0EA5E9] flex items-center justify-center text-[10px] font-bold text-black"
                  >
                    LP GAP: {100 - gpCommitmentPercent}%
                  </div>
                  <div 
                    style={{ width: `${gpCommitmentPercent}%` }}
                    className="h-full bg-[#00FF66] flex items-center justify-center text-[10px] font-bold text-black"
                  >
                    GP: {gpCommitmentPercent}%
                  </div>
                </div>
              </div>

              {/* Payout Distribution Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#888888]">
                  <span>PROJECTED EXIT PAYOUT ALLOCATION</span>
                  <span>{formatCurrency(estimatedExitEquityVal)} Total Exit Value</span>
                </div>
                <div className="w-full bg-[#111111] h-6 flex border border-[#222222] overflow-hidden">
                  {estimatedExitEquityVal > 0 ? (
                    <>
                      <div 
                        style={{ width: `${(waterfallOutputs.totalLPPayout / estimatedExitEquityVal) * 100}%` }}
                        className="h-full bg-[#0EA5E9]/80 border-r border-[#050505] flex items-center justify-center text-[10px] font-bold text-[#F9F9F9]"
                      >
                        LP: {((waterfallOutputs.totalLPPayout / estimatedExitEquityVal) * 100).toFixed(0)}%
                      </div>
                      <div 
                        style={{ width: `${(waterfallOutputs.totalGPPayout / estimatedExitEquityVal) * 100}%` }}
                        className="h-full bg-[#00FF66]/80 flex items-center justify-center text-[10px] font-bold text-black"
                      >
                        GP: {((waterfallOutputs.totalGPPayout / estimatedExitEquityVal) * 100).toFixed(0)}%
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#FF3333]">ZERO VALUE</div>
                  )}
                </div>
              </div>
            </div>

            {/* Waterfall Payout Numerical Ledgers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* GP Returns */}
              <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                  <span className="text-xs text-[#00FF66] font-bold">// GENERAL PARTNER PAYOUTS</span>
                  <span className="text-[10px] bg-[#00FF66]/10 text-[#00FF66] px-1 border border-[#00FF66]/20">GP STACK</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#888888]">GP Capital Contributed:</span>
                    <span className="text-white">{formatCurrency(waterfallOutputs.gpCapital)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888]">GP Return of Capital:</span>
                    <span className="text-white">{formatCurrency(waterfallOutputs.capRepayToGP)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888]">GP Pref Payout ({preferredReturnRate}% flat):</span>
                    <span className="text-white">{formatCurrency(waterfallOutputs.gpPrefPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888]">GP Promote Split Earned:</span>
                    <span className="text-[#00FF66] font-bold">+{formatCurrency(waterfallOutputs.gpPromotePaid)}</span>
                  </div>
                  <div className="border-t border-[#222222] pt-2 flex justify-between text-sm font-bold">
                    <span className="text-white">TOTAL GP OUTFLOW:</span>
                    <span className="text-[#00FF66]">{formatCurrency(waterfallOutputs.totalGPPayout)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#888888] pt-1 border-t border-dashed border-[#222222]">
                    <span>GP PROJECTED MOIC:</span>
                    <span className="text-white font-bold">{waterfallOutputs.gpMoic.toFixed(2)}x</span>
                  </div>
                </div>
              </div>

              {/* LP Returns */}
              <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                  <span className="text-xs text-[#0EA5E9] font-bold">// LIMITED PARTNER PAYOUTS</span>
                  <span className="text-[10px] bg-[#0EA5E9]/10 text-[#0EA5E9] px-1 border border-[#0EA5E9]/20">LP STACK</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#888888]">LP Capital Contributed:</span>
                    <span className="text-white">{formatCurrency(waterfallOutputs.lpCapital)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888]">LP Return of Capital:</span>
                    <span className="text-white">{formatCurrency(waterfallOutputs.capRepayToLP)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888]">LP Pref Payout ({preferredReturnRate}% flat):</span>
                    <span className="text-white">{formatCurrency(waterfallOutputs.lpPrefPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888]">LP Residual Split Earned:</span>
                    <span className="text-[#0EA5E9] font-bold">+{formatCurrency(waterfallOutputs.lpPromotePaid)}</span>
                  </div>
                  <div className="border-t border-[#222222] pt-2 flex justify-between text-sm font-bold">
                    <span className="text-white">TOTAL LP OUTFLOW:</span>
                    <span className="text-[#0EA5E9]">{formatCurrency(waterfallOutputs.totalLPPayout)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#888888] pt-1 border-t border-dashed border-[#222222]">
                    <span>LP PROJECTED MOIC:</span>
                    <span className="text-white font-bold">{waterfallOutputs.lpMoic.toFixed(2)}x</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Total Structural Overview Banner */}
            <div className="border border-[#222222] bg-[#111111] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-[#888888] block uppercase">PROJECTED OVERALL DEAL RETURN LEVEL</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-white">MOIC AVERAGE: {waterfallOutputs.totalMoic.toFixed(2)}x</span>
                  <span className={`text-[10px] px-2 py-0.5 border ${waterfallOutputs.totalMoic >= 2.0 ? 'border-[#00FF66] text-[#00FF66]' : 'border-[#0EA5E9] text-[#0EA5E9]'}`}>
                    {waterfallOutputs.totalMoic >= 2.0 ? 'HIGH ALPHA' : 'STANDARD PROFILE'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  alert(`STRUCTURE SAVED: GP Split ${gpCommitmentPercent}%, LP Split ${100 - gpCommitmentPercent}%, Hurdle ${preferredReturnRate}%. Model locked to current terminal board query.`);
                }}
                className="text-xs text-black bg-[#00FF66] hover:bg-black hover:text-[#00FF66] border border-[#00FF66] font-bold px-4 py-2 uppercase tracking-wider transition-colors"
              >
                Save Waterfall Structure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIED LP DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filters Row */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col md:flex-row justify-between gap-4">
            {/* Search */}
            <div className="flex-grow max-w-md relative">
              <input 
                type="text" 
                value={lpSearch}
                onChange={(e) => setLpSearch(e.target.value)}
                placeholder="Query verified capital LP alias..."
                className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-3 placeholder-[#888888] uppercase"
              />
              <span className="absolute right-3 top-3.5 text-[10px] text-[#888888]">CMD+F</span>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#888888] mr-2 uppercase">Preferred Sector:</span>
              {['ALL', 'SaaS', 'Manufacturing', 'HVAC', 'Home Services', 'Logistics'].map((sector) => (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`text-[10px] px-3 py-1.5 border transition-all duration-150 uppercase ${
                    selectedSector === sector
                      ? 'bg-[#00FF66] text-black border-[#00FF66] font-bold'
                      : 'border-[#222222] text-[#F9F9F9] hover:border-[#00FF66]'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          {/* LP List Table */}
          <div className="border border-[#222222] bg-[#0a0a0a] overflow-x-auto">
            <table className="w-full text-left text-xs uppercase min-w-[700px]">
              <thead>
                <tr className="border-b border-[#222222] bg-[#111111] text-[#888888]">
                  <th className="p-3 font-semibold">LP ALIAS / TYPE</th>
                  <th className="p-3 font-semibold">VERIFIED DRY POWDER</th>
                  <th className="p-3 font-semibold">EST. CHECK SIZE</th>
                  <th className="p-3 font-semibold">MATCH SCORE</th>
                  <th className="p-3 font-semibold">TARGET SECTORS</th>
                  <th className="p-3 font-semibold text-right">SECURE PIPELINE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {filteredLPs.map((lp) => (
                  <tr key={lp.id} className="hover:bg-[#111111]/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-none ${
                          lp.status === 'ACTIVE' 
                            ? 'bg-[#00FF66]' 
                            : lp.status === 'UNDER_NDA' 
                            ? 'bg-[#0EA5E9]' 
                            : 'bg-[#FF3333]'
                        }`}></span>
                        <div>
                          <div className="font-bold text-[#F9F9F9]">{lp.alias}</div>
                          <div className="text-[10px] text-[#888888]">{lp.type} • {lp.geography}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#00FF66] font-bold">
                      {formatCurrency(lp.verifiedDryPowder)}
                    </td>
                    <td className="p-3 text-[#0EA5E9]">
                      {lp.averageCheckSize}
                    </td>
                    <td className="p-3 font-bold">
                      {lp.matchScore}%
                    </td>
                    <td className="p-3 space-x-1">
                      {lp.preferredSectors.map((s) => (
                        <span key={s} className="border border-[#222222] px-1.5 py-0.5 text-[9px] bg-[#111111] text-[#888888]">
                          {s}
                        </span>
                      ))}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setActiveTab('messenger');
                          setTeaserFormData((prev) => ({
                            ...prev,
                            equityGapNeeded: lp.averageCheckSize.split(' - ')[0].replace('$', ''),
                          }));
                        }}
                        className="text-[10px] bg-transparent hover:bg-[#00FF66] hover:text-black border border-[#00FF66] text-[#00FF66] px-3 py-1.5 transition-all duration-150 uppercase tracking-widest font-bold"
                      >
                        Transmit Teaser
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SECURE COMMUNICATION PIPELINE */}
      {activeTab === 'messenger' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Dispatch Teaser Form */}
          <div className="lg:col-span-7 border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <div className="border-b border-[#222222] pb-2 flex justify-between items-center">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// INITIALIZE BLIND DEAL TELEMETRY</span>
              <span className="text-[10px] text-[#FF3333] font-bold">[NDA PROTOCOL COMPLIANT]</span>
            </div>

            <form onSubmit={handleTeaserSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#888888] uppercase mb-1">Target Deal Codename:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PROJECT COBALT"
                    value={teaserFormData.targetCodename}
                    onChange={(e) => setTeaserFormData({ ...teaserFormData, targetCodename: e.target.value })}
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-3 text-white uppercase placeholder-[#888888]"
                  />
                </div>
                <div>
                  <label className="block text-[#888888] uppercase mb-1">Sector Industry Node:</label>
                  <input
                    type="text"
                    placeholder="e.g. HIGH-ALPHA HVAC"
                    value={teaserFormData.industrySector}
                    onChange={(e) => setTeaserFormData({ ...teaserFormData, industrySector: e.target.value })}
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-3 text-white uppercase placeholder-[#888888]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#888888] uppercase mb-1">Verified EBITDA (TTM):</label>
                  <input
                    type="text"
                    placeholder="e.g. $1,200,000"
                    value={teaserFormData.ebitda}
                    onChange={(e) => setTeaserFormData({ ...teaserFormData, ebitda: e.target.value })}
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-3 text-white uppercase placeholder-[#888888]"
                  />
                </div>
                <div>
                  <label className="block text-[#888888] uppercase mb-1">Required LP Equity Gap:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $1,500,000"
                    value={teaserFormData.equityGapNeeded}
                    onChange={(e) => setTeaserFormData({ ...teaserFormData, equityGapNeeded: e.target.value })}
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-3 text-white uppercase placeholder-[#888888]"
                  />
                </div>
                <div>
                  <label className="block text-[#888888] uppercase mb-1">SBA Debt Lock Pre-Arranged?</label>
                  <select
                    value={teaserFormData.debtSbaArranged}
                    onChange={(e) => setTeaserFormData({ ...teaserFormData, debtSbaArranged: e.target.value })}
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-3 text-white uppercase"
                  >
                    <option value="YES">YES // DEBT SECURED</option>
                    <option value="NO">NO // DEBT IN REVIEW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#888888] uppercase mb-1">Blinded Deal Operational Teaser (Brief):</label>
                <textarea
                  rows={4}
                  placeholder="PROVIDE OPERATING REVENUE MODEL, STABILITY RATIOS, GEOGRAPHIC EDGE AND RETIRING OWNER MATRIX WITHOUT BLOWING DISCRETION NODES..."
                  value={teaserFormData.briefTeaser}
                  onChange={(e) => setTeaserFormData({ ...teaserFormData, briefTeaser: e.target.value })}
                  className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-3 text-white uppercase placeholder-[#888888] text-[11px] leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSendingTeaser}
                className="w-full text-xs text-black bg-[#00FF66] hover:bg-black hover:text-[#00FF66] border border-[#00FF66] font-bold py-3 transition-colors uppercase tracking-widest"
              >
                {isSendingTeaser ? 'TRANSMITTING DISPATCH SIGNALS...' : 'INITIALIZE SECURE PIPELINE TRANSMISSION'}
              </button>
            </form>
          </div>

          {/* Secure Telemetry & NDA Logs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-3">
              <span className="text-xs text-[#888888] uppercase block tracking-wider">// CRYPTOGRAPHIC PIPELINE STATUS</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#111111] p-3 border border-[#222222]">
                <div>NODE ID: <span className="text-[#0EA5E9] font-bold">PORT-982</span></div>
                <div>ENCRYPTION: <span className="text-[#00FF66] font-bold">AES-GCM-256</span></div>
                <div>FINCEN CHECKS: <span className="text-[#00FF66] font-bold">ACTIVE</span></div>
                <div>SEC COMPLIANT: <span className="text-[#00FF66] font-bold">YES</span></div>
              </div>
            </div>

            <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-3 flex-grow">
              <span className="text-xs text-[#888888] uppercase block tracking-wider">// PIPELINE ACTION LOGS</span>
              <div className="space-y-2 h-[200px] overflow-y-auto pr-2 custom-scroll text-[10px] font-mono leading-relaxed text-[#888888]">
                {teaserLogs.length === 0 ? (
                  <div className="text-center py-8 text-[#888888]">
                    SYSTEM TELEMETRY EMPTY. DISPATCH A TEASER TO RECORD LIVE PIPELINE LOGS.
                  </div>
                ) : (
                  teaserLogs.map((log, idx) => (
                    <div key={idx} className="p-2 border border-[#222222] bg-[#111111] text-white">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. Footer Legal compliance warnings */}
      <div className="border-t border-[#222222] pt-4 text-[9px] text-[#888888] space-y-2 leading-relaxed">
        <p className="uppercase text-white tracking-widest">// SECURED ACCREDITED SYSTEM RULES</p>
        <p>
          NOTICE: All active communications and distributions modeling parameters are governed strictly under Private Equity Syndication compliance parameters. General partners (searchers) assert compliance under SEC Section 4(a)(2) or SEC Rule 506(b)/506(c) parameters regarding accredited investor co-funding procedures. All LP entities listed above have completed verified dry-powder audits via Plaid institutional node validation.
        </p>
      </div>

    </div>
  );
}