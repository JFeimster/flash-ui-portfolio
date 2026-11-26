import React, { useState, useMemo, useEffect } from 'react';

interface DealVertical {
  name: string;
  selected: boolean;
}

export default function SbaPrequelStatusCard() {
  // 1. STATE MANAGEMENT FOR THE TERMINAL PROFILE
  const [operatorId, setOperatorId] = useState<string>('#ETA-7922');
  const [investmentThesis, setInvestmentThesis] = useState<string>(
    'Acquiring standard HVAC or recurring B2B logistics firms with stable enterprise service relationships in the Mid-Atlantic zone. Targeting $500k–$1.5M EBITDA with modern tech enablement potential.'
  );
  
  // Plaid Sim States
  const [isPlaidLinked, setIsPlaidLinked] = useState<boolean>(true);
  const [verifiedBalance, setVerifiedBalance] = useState<number>(350000); // Default $350K verified POF
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('JUST NOW');

  // Accredited Investor Certification
  const [isAccredited, setIsAccredited] = useState<boolean>(true);
  const [hasCompletedAutoNda, setHasCompletedAutoNda] = useState<boolean>(true);
  const [cryptoSignature, setCryptoSignature] = useState<string>('0x9C8F...3A09');

  // Acquisition Parameters
  const [targetEbitdaMin, setTargetEbitdaMin] = useState<number>(300000);
  const [targetMultipleMax, setTargetMultipleMax] = useState<number>(3.5);

  // Core Verticals
  const [verticals, setVerticals] = useState<DealVertical[]>([
    { name: 'Logistics', selected: true },
    { name: 'HVAC', selected: true },
    { name: 'SaaS', selected: false },
    { name: 'Manufacturing', selected: true },
    { name: 'Home Services', selected: false },
  ]);

  // 2. DYNAMIC CALCULATION ENGINE (Standard SBA 10% Equity Rule)
  // Max transaction capacity based on verified POF cash balance assuming standard 10% equity injection.
  const calculatedLeverageCapacity = useMemo(() => {
    if (!isPlaidLinked) return 0;
    return verifiedBalance / 0.10;
  }, [isPlaidLinked, verifiedBalance]);

  // Max estimated SBA debt guarantee structure (75% of total acquisition price)
  const maxSbaDebtFacility = useMemo(() => {
    return calculatedLeverageCapacity * 0.75;
  }, [calculatedLeverageCapacity]);

  // Seller Financing allocation simulation (15% of total acquisition price)
  const simulatedSellerNote = useMemo(() => {
    return calculatedLeverageCapacity * 0.15;
  }, [calculatedLeverageCapacity]);

  // Interactive Triggers
  const simulatePlaidSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // Simulate random fluctuations of cash verification
      const variance = (Math.random() - 0.5) * 50000;
      setVerifiedBalance((prev) => Math.max(100000, Math.round(prev + variance)));
      setIsSyncing(false);
      
      const now = new Date();
      setLastSyncTime(now.toTimeString().split(' ')[0] + ' UTC');
      // Update signature hash for security realism
      setCryptoSignature('0x' + Math.random().toString(16).substr(2, 8).toUpperCase() + '...' + Math.random().toString(16).substr(2, 4).toUpperCase());
    }, 1200);
  };

  const toggleVertical = (index: number) => {
    const updated = [...verticals];
    updated[index].selected = !updated[index].selected;
    setVerticals(updated);
  };

  const handleNdaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setHasCompletedAutoNda(checked);
    if (checked) {
      setCryptoSignature('0x' + Math.round(Math.random() * 100000).toString(16).toUpperCase() + '...F892');
    } else {
      setCryptoSignature('DE-AUTHORIZED');
    }
  };

  return (
    <div className="bg-[#080808] border border-[#222] font-sans text-[#F9F9F9] w-full max-w-5xl mx-auto flex flex-col md:flex-row relative">
      
      {/* Strict Square Edges Indicator Accent (matches root css override) */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[#0EA5E9] glow-teal"></div>

      {/* LEFT RAIL: POF Vault & Verification Mechanism */}
      <div className="md:w-5/12 p-6 border-r border-[#222] flex flex-col justify-between bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="space-y-6">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
            <h3 className="font-mono text-xs font-bold tracking-widest text-[#0EA5E9] flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-[#0EA5E9]"></span>
              VERIFIED BUYER VAULT
            </h3>
            <span className="font-mono text-[9px] text-[#888] tracking-widest uppercase">
              STATUS: <span className="text-[#00FF66] font-semibold">AUTHORIZED</span>
            </span>
          </div>

          {/* Secure Operator Registry */}
          <div className="grid grid-cols-2 gap-4 bg-[#0d0d0d] p-3 border border-[#222]">
            <div>
              <div className="text-[8px] font-mono text-[#888] tracking-wider uppercase">Operator Tag</div>
              <input 
                type="text" 
                value={operatorId} 
                onChange={(e) => setOperatorId(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-white outline-none w-full border-b border-transparent focus:border-[#0EA5E9] py-0.5"
              />
            </div>
            <div>
              <div className="text-[8px] font-mono text-[#888] tracking-wider uppercase">Accredited Status</div>
              <button 
                onClick={() => setIsAccredited(!isAccredited)} 
                className="text-xs font-mono text-left font-bold transition-all focus:outline-none"
                style={{ color: isAccredited ? '#00FF66' : '#FF3333' }}
              >
                {isAccredited ? '[✓] ACCREDITED' : '[X] SELF-CERTIFY'}
              </button>
            </div>
          </div>

          {/* Plaid Sim Integration Widget */}
          <div className="space-y-3 bg-black/60 p-4 border border-[#222] relative">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#00FF66] animate-pulse"></span>
                <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-widest">Plaid Direct Sync</span>
              </div>
              <span className="text-[8px] font-mono text-neutral-600 uppercase">SYS SECURE (SHA-256)</span>
            </div>

            <div className="p-3 bg-[#0a0a0a] border border-[#222] flex items-center justify-between">
              <div>
                <span className="text-[8px] font-mono text-[#888] block">VERIFIED LIQUID ASSETS (USD)</span>
                {isPlaidLinked ? (
                  <span className="text-xl font-mono font-black text-[#00FF66]">
                    ${verifiedBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </span>
                ) : (
                  <span className="text-sm font-mono font-bold text-neutral-600">[VAULT DE-LINKED]</span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[8px] font-mono text-neutral-500 block">LAST CALIBRATION</span>
                <span className="text-[9px] font-mono text-neutral-400" x-text="lastSyncTime">{lastSyncTime}</span>
              </div>
            </div>

            {/* Plaid Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
              <button 
                onClick={simulatePlaidSync}
                disabled={isSyncing || !isPlaidLinked}
                className="w-full bg-[#111] hover:bg-[#0EA5E9] hover:text-black border border-[#222] py-2 transition-all font-bold tracking-widest uppercase disabled:opacity-50"
              >
                {isSyncing ? 'SYNCING...' : 'RE-CALIBRATE'}
              </button>
              <button 
                onClick={() => setIsPlaidLinked(!isPlaidLinked)}
                className="w-full bg-black hover:border-[#FF3333] hover:text-[#FF3333] border border-[#222] py-2 transition-all text-neutral-400 font-bold tracking-widest uppercase"
              >
                {isPlaidLinked ? 'DISCONNECT' : 'LINK PLAID'}
              </button>
            </div>
          </div>

          {/* Verification & Auto-NDA parameters */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-start space-x-2 bg-[#0d0d0d] border border-[#222] p-3">
              <input 
                id="nda-checkbox"
                type="checkbox" 
                checked={hasCompletedAutoNda} 
                onChange={handleNdaChange}
                className="accent-[#00FF66] mt-0.5 cursor-pointer rounded-none border-[#222]"
              />
              <label htmlFor="nda-checkbox" className="text-[10px] text-[#888] leading-tight select-none cursor-pointer">
                Authorize <span className="text-white font-semibold">Instant Secure Auto-NDA Submission</span> across matching premium list requests.
              </label>
            </div>

            <div className="flex justify-between items-center text-[9px] text-[#444] px-1 font-mono">
              <span>NDA SIGNATURE HASH:</span>
              <span className="text-[#0EA5E9] font-bold tracking-widest select-all">{cryptoSignature}</span>
            </div>
          </div>

        </div>

        {/* Security Warning Footnote */}
        <div className="pt-6 border-t border-[#1a1a1a] mt-6">
          <div className="p-3 bg-red-950/10 border border-[#FF3333]/30">
            <span className="text-[8px] font-mono text-[#FF3333] font-bold tracking-widest block uppercase">CRITICAL FRAUD PROTECTION</span>
            <p className="text-[9px] text-[#888] font-mono leading-tight mt-1">
              Federal law mandates verified proof of funds prior to exposing sensitive financial books. Simulated connections utilize secured test environments to establish operational compliance protocols.
            </p>
          </div>
        </div>

      </div>

      {/* RIGHT RAIL: Target Parameters & Simulated Acquisition Leverage */}
      <div className="md:w-7/12 p-6 flex flex-col justify-between bg-[#050505]">
        
        <div className="space-y-6">
          
          {/* Main Title & Thesis Entry */}
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#00FF66] text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-tight uppercase">M&amp;A STRATEGY MATRIX</span>
              <span className="text-[9px] font-mono text-neutral-600">PREV-SEC v3.1</span>
            </div>
            <h2 className="text-xl font-bold font-mono tracking-tight text-white mt-1.5">
              INVESTMENT THESIS &amp; PORTAL PROFILE
            </h2>
          </div>

          {/* Investment Thesis Input Area */}
          <div className="space-y-2">
            <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase">Target Investment Mandate</label>
            <textarea 
              value={investmentThesis} 
              onChange={(e) => setInvestmentThesis(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-3 h-20 outline-none resize-none transition-all placeholder:text-[#444]"
              placeholder="Provide a clear search strategy to instantly map corresponding pre-vetted deal profiles..."
            />
          </div>

          {/* Target Financial Parameters Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Min EBITDA Target */}
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase">Target Min EBITDA Volume</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-neutral-600">$</span>
                <input 
                  type="number" 
                  step="50000"
                  min="0"
                  value={targetEbitdaMin} 
                  onChange={(e) => setTargetEbitdaMin(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-white p-3 pl-7 outline-none"
                />
              </div>
            </div>

            {/* Max EBITDA Multiple target */}
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase">Maximum EBITDA Multiple</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1" 
                  min="1.0"
                  max="10.0"
                  value={targetMultipleMax} 
                  onChange={(e) => setTargetMultipleMax(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-white p-3 pr-8 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-neutral-600">x</span>
              </div>
            </div>

          </div>

          {/* Target Verticals Selection Grid */}
          <div className="space-y-2">
            <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase">Preferred Sectors &amp; Verticals</label>
            <div className="flex flex-wrap gap-2">
              {verticals.map((vert, idx) => (
                <button
                  key={vert.name}
                  onClick={() => toggleVertical(idx)}
                  className="font-mono text-xs px-3 py-1.5 border transition-all text-left uppercase"
                  style={{
                    backgroundColor: vert.selected ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                    borderColor: vert.selected ? '#0EA5E9' : '#222',
                    color: vert.selected ? '#0EA5E9' : '#888',
                  }}
                >
                  {vert.name} {vert.selected ? '[✓]' : '[+]'}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Levered Acquisition Capacity Projection */}
          <div className="space-y-3 bg-[#0a0a0a] p-4 border border-[#222] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00FF66]"></div>
            
            <div className="pl-2">
              <span className="text-[10px] font-mono text-[#00FF66] font-bold tracking-wider uppercase block">
                MAX LEVERED TRANSACTION CAPACITY (SBA 7a PROJECTION)
              </span>
              
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-mono font-black text-white">
                  ${calculatedLeverageCapacity.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Est. Buying Power</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#222] border border-[#222] text-center font-mono mt-3">
              <div className="bg-black p-2.5">
                <div className="text-[8px] text-[#888]">REQUIRED EQUITY DOWN (10%)</div>
                <div className="text-xs font-bold text-white">
                  ${isPlaidLinked ? verifiedBalance.toLocaleString('en-US') : '0'}
                </div>
              </div>
              <div className="bg-black p-2.5">
                <div className="text-[8px] text-[#888]">EST. MAX SBA LOAN (75%)</div>
                <div className="text-xs font-bold text-[#0ea5e9]">
                  ${maxSbaDebtFacility.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="bg-black p-2.5">
                <div className="text-[8px] text-[#888]">SIMULATED SELLER NOTE (15%)</div>
                <div className="text-xs font-bold text-[#00FF66]">
                  ${simulatedSellerNote.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Sync Status Bottom Trigger CTA */}
        <div className="mt-6 border-t border-[#1a1a1a] pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[9px] font-mono text-neutral-500 text-center sm:text-left leading-snug">
            SBA PRE-APPROVAL RATING STRENGTH:<br/>
            <span className="text-[#00FF66] font-bold">OPTIMIZED (GRADE AA)</span> BASED ON VERIFIED POF
          </div>
          
          <button 
            onClick={() => alert(`Verification Data Synced with Active Deal Stream under Signature Hash: ${cryptoSignature}`)}
            className="w-full sm:w-auto bg-[#00FF66] text-black font-mono text-xs font-bold px-5 py-3 tracking-widest hover:bg-white transition-all uppercase"
          >
            PUBLISH PROFILE TO DEALSTREAM &rarr;
          </button>
        </div>

      </div>

    </div>
  );
}