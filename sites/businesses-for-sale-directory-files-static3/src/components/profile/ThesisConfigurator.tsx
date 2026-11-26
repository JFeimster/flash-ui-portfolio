import React, { useState, useEffect } from 'react';

interface ThesisData {
  sectors: string[];
  minEbitda: number;
  maxMultiple: number;
  locations: string[];
  customThesis: string;
}

export default function ThesisConfigurator() {
  // 1. Core Profile & State
  const [thesis, setThesis] = useState<ThesisData>({
    sectors: ['Logistics', 'SaaS'],
    minEbitda: 500000,
    maxMultiple: 3.5,
    locations: ['Southeast', 'Midwest', 'Remote'],
    customThesis: 'Acquiring service-based B2B businesses with recurring revenue profiles and under-optimized digital marketing channels.'
  });

  const [accreditedStatus, setAccreditedStatus] = useState<boolean>(false);
  const [exchange1031Ready, setExchange1031Ready] = useState<boolean>(false);
  const [digitalSignature, setDigitalSignature] = useState<string>('');
  const [autoNda, setAutoNda] = useState<boolean>(false);

  // 2. Simulated Plaid / Proof of Funds Vault State
  const [plaidState, setPlaidState] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [verifiedBalance, setVerifiedBalance] = useState<number>(0);
  const [verificationTime, setVerificationTime] = useState<string>('');

  // 3. UI/UX interactivity states
  const [selectedSectorInput, setSelectedSectorInput] = useState<string>('');
  const [selectedLocationInput, setSelectedLocationInput] = useState<string>('');
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'SYSTEM INITIALIZATION: SECURE CONNECTION ACTIVE',
    'OP_ID #ETA-7922 VERIFIED ON SECTOR-1031 PROTOCOLS'
  ]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setSystemLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 5)]);
  };

  // Plaid Mock Connection Trigger
  const handlePlaidConnect = () => {
    setPlaidState('connecting');
    addLog('INITIATING SECURE PLAID LINK API PROTOCOL...');
    
    setTimeout(() => {
      setPlaidState('connected');
      setVerifiedBalance(2450000); // Mock liquid verification
      const timeStr = new Date().toLocaleDateString() + ' ' + new Date().toTimeString().split(' ')[0];
      setVerificationTime(timeStr);
      addLog('PLAID COMPLIANT TOKEN ASSIGNED. LIQUID ASSETS VERIFIED: $2.45M');
    }, 2200);
  };

  // Helper formatting
  const formatCurrency = (num: number) => {
    if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return '$' + (num / 1000).toFixed(0) + 'K';
    return '$' + num;
  };

  // Calculate Thesis Strength Metric
  const calculateCompleteness = () => {
    let score = 0;
    if (thesis.sectors.length > 0) score += 20;
    if (thesis.customThesis.length > 20) score += 20;
    if (plaidState === 'connected') score += 30;
    if (accreditedStatus) score += 15;
    if (digitalSignature.trim().length > 2) score += 15;
    return score;
  };

  const completeness = calculateCompleteness();

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] font-sans antialiased border border-[#222] selection:bg-[#00FF66] selection:text-black">
      {/* 1. COMPONENT HEADER / PROTOCOL STATS */}
      <div className="border-b border-[#222] bg-[#0a0a0a] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#00FF66] text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-tighter">VAULT VERIFIED</span>
            <span className="text-[10px] font-mono text-[#0EA5E9] tracking-widest font-bold">SECURE PORTAL V2.9</span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
            BUYER THESIS & POF VAULT
          </h2>
          <p className="text-xs text-[#888] font-mono">
            Self-certify credentials, lock down target ranges, and auto-authenticate instant NDAs.
          </p>
        </div>

        {/* Global Verification Scorecard */}
        <div className="flex items-center gap-4 bg-black border border-[#222] p-3 w-full md:w-auto">
          <div className="font-mono text-left">
            <div className="text-[9px] text-[#888] tracking-wider uppercase">PROFILE POWER</div>
            <div className={`text-base font-bold ${completeness >= 80 ? 'text-[#00FF66]' : completeness >= 50 ? 'text-[#0EA5E9]' : 'text-[#FF3333]'}`}>
              {completeness}% RATED
            </div>
          </div>
          <div className="w-20 bg-[#111] h-2 relative">
            <div 
              className={`h-full transition-all duration-500 ${completeness >= 80 ? 'bg-[#00FF66]' : completeness >= 50 ? 'bg-[#0EA5E9]' : 'bg-[#FF3333]'}`} 
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT COLUMN: CRITERIA & INVESTMENT THESIS CONFIGURATOR (7 Cols) */}
        <div className="lg:col-span-7 border-r border-[#222] p-6 space-y-6">
          <div>
            <h3 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2 uppercase border-b border-[#222] pb-2 mb-4">
              <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
              1. MANDATE & PARAMETER SCOPE
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* EBITDA slider / selector */}
              <div className="space-y-2 bg-[#0a0a0a] p-4 border border-[#222]">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] text-[#888] tracking-widest uppercase">MINIMUM TARGET EBITDA</label>
                  <span className="font-mono text-xs text-[#00FF66] font-bold">{formatCurrency(thesis.minEbitda)}</span>
                </div>
                <input 
                  type="range" 
                  min="250000" 
                  max="2000000" 
                  step="50000" 
                  value={thesis.minEbitda}
                  onChange={(e) => {
                    setThesis({ ...thesis, minEbitda: parseInt(e.target.value) });
                    addLog(`UPDATED MIN EBITDA TARGET TO ${formatCurrency(parseInt(e.target.value))}`);
                  }}
                  className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-neutral-600">
                  <span>$250K</span>
                  <span>$1.1M</span>
                  <span>$2.0M+</span>
                </div>
              </div>

              {/* Max Multiple target */}
              <div className="space-y-2 bg-[#0a0a0a] p-4 border border-[#222]">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] text-[#888] tracking-widest uppercase">MAX EBITDA MULTIPLE</label>
                  <span className="font-mono text-xs text-[#0EA5E9] font-bold">{thesis.maxMultiple.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="2.0" 
                  max="6.0" 
                  step="0.1" 
                  value={thesis.maxMultiple}
                  onChange={(e) => {
                    setThesis({ ...thesis, maxMultiple: parseFloat(e.target.value) });
                    addLog(`UPDATED MAX MULTIPLE LIMIT TO ${parseFloat(e.target.value).toFixed(1)}x`);
                  }}
                  className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-neutral-600">
                  <span>2.0x</span>
                  <span>4.0x</span>
                  <span>6.0x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Tag Arrays for Sectors and Geographies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Verticals */}
            <div className="space-y-3">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Target Sectors / Verticals</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. HVAC, Logistics, Defense"
                  value={selectedSectorInput}
                  onChange={(e) => setSelectedSectorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && selectedSectorInput.trim()) {
                      e.preventDefault();
                      if (!thesis.sectors.includes(selectedSectorInput.trim())) {
                        setThesis({ ...thesis, sectors: [...thesis.sectors, selectedSectorInput.trim()] });
                        addLog(`ADDED TARGET SECTOR: ${selectedSectorInput.trim()}`);
                      }
                      setSelectedSectorInput('');
                    }
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2 placeholder:text-[#444] outline-none"
                />
                <button 
                  onClick={() => {
                    if (selectedSectorInput.trim() && !thesis.sectors.includes(selectedSectorInput.trim())) {
                      setThesis({ ...thesis, sectors: [...thesis.sectors, selectedSectorInput.trim()] });
                      addLog(`ADDED TARGET SECTOR: ${selectedSectorInput.trim()}`);
                      setSelectedSectorInput('');
                    }
                  }}
                  className="border border-[#222] bg-[#0a0a0a] px-3 text-xs font-mono text-[#888] hover:text-[#00FF66] hover:border-[#00FF66]"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {thesis.sectors.map((sector) => (
                  <span 
                    key={sector} 
                    className="inline-flex items-center gap-1.5 text-[9px] font-mono font-semibold px-2 py-0.5 bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20"
                  >
                    {sector.toUpperCase()}
                    <button 
                      onClick={() => {
                        setThesis({ ...thesis, sectors: thesis.sectors.filter(s => s !== sector) });
                        addLog(`REMOVED TARGET SECTOR: ${sector}`);
                      }}
                      className="hover:text-[#FF3333] font-bold text-[10px]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Target Locations */}
            <div className="space-y-3">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Target Geography Hubs</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Remote, Texas, East Coast"
                  value={selectedLocationInput}
                  onChange={(e) => setSelectedLocationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && selectedLocationInput.trim()) {
                      e.preventDefault();
                      if (!thesis.locations.includes(selectedLocationInput.trim())) {
                        setThesis({ ...thesis, locations: [...thesis.locations, selectedLocationInput.trim()] });
                        addLog(`ADDED GEOGRAPHIC HUB: ${selectedLocationInput.trim()}`);
                      }
                      setSelectedLocationInput('');
                    }
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2 placeholder:text-[#444] outline-none"
                />
                <button 
                  onClick={() => {
                    if (selectedLocationInput.trim() && !thesis.locations.includes(selectedLocationInput.trim())) {
                      setThesis({ ...thesis, locations: [...thesis.locations, selectedLocationInput.trim()] });
                      addLog(`ADDED GEOGRAPHIC HUB: ${selectedLocationInput.trim()}`);
                      setSelectedLocationInput('');
                    }
                  }}
                  className="border border-[#222] bg-[#0a0a0a] px-3 text-xs font-mono text-[#888] hover:text-[#00FF66] hover:border-[#00FF66]"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {thesis.locations.map((loc) => (
                  <span 
                    key={loc} 
                    className="inline-flex items-center gap-1.5 text-[9px] font-mono font-semibold px-2 py-0.5 bg-neutral-900 text-neutral-300 border border-neutral-800"
                  >
                    {loc.toUpperCase()}
                    <button 
                      onClick={() => {
                        setThesis({ ...thesis, locations: thesis.locations.filter(l => l !== loc) });
                        addLog(`REMOVED GEOGRAPHIC HUB: ${loc}`);
                      }}
                      className="hover:text-[#FF3333] font-bold text-[10px]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Written Investment Thesis Statement */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Executive Thesis Statement</label>
              <span className="text-[9px] font-mono text-[#888]">{thesis.customThesis.length} chars</span>
            </div>
            <textarea 
              rows={4}
              value={thesis.customThesis}
              onChange={(e) => setThesis({ ...thesis, customThesis: e.target.value })}
              placeholder="Detail your strategic operating experience, roll-up plans, transition strategy, or exact acquisition mandate details here..."
              className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-3 placeholder:text-[#444] outline-none leading-relaxed"
            />
          </div>

          {/* Automatic NDA Signature Engine Config */}
          <div className="p-4 bg-[#0a0a0a] border border-[#222] space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#00FF66] tracking-wider font-bold block">ACQUIRE-NET NDA INSTANT RUNTIME</span>
                <p className="text-[10px] text-[#888] font-mono leading-tight mt-1">
                  Securely auto-sign structural NDAs on proprietary deals matching all parameters under {thesis.maxMultiple}x EBITDA.
                </p>
              </div>
              <button 
                onClick={() => {
                  setAutoNda(!autoNda);
                  addLog(`AUTOMATIC NDA RUNTIME ENGINE STATUS: ${!autoNda ? 'ENABLED' : 'DISABLED'}`);
                }}
                className={`w-12 h-6 border transition-all flex items-center px-1 shrink-0`}
                className={`${autoNda ? 'bg-[#00FF66]/20 border-[#00FF66] justify-end' : 'bg-black border-[#222] justify-start'} w-12 h-6 border transition-all flex items-center px-1`}
              >
                <span className={`w-4 h-4 ${autoNda ? 'bg-[#00FF66]' : 'bg-[#444]'}`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROOF OF FUNDS VAULT (Plaid Integration) & SELF CERT (5 Cols) */}
        <div className="lg:col-span-5 p-6 space-y-6 flex flex-col justify-between bg-[#080808]">
          
          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-xs font-bold tracking-wider text-[#00FF66] flex items-center gap-2 uppercase border-b border-[#222] pb-2 mb-4">
                <span className="inline-block w-1.5 h-3 bg-[#00FF66]"></span>
                2. LIQUID POF VAULT (PLAID SIM)
              </h3>

              {/* Plaid Visual Container */}
              <div className="border border-[#222] p-5 bg-black relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-neutral-800">
                  SECURE API LINK V42
                </div>

                {plaidState === 'idle' && (
                  <div className="space-y-4 text-center py-6">
                    <div className="inline-block p-3 bg-neutral-900 border border-neutral-800 text-neutral-400">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-mono text-xs font-bold text-white">PLAID VERIFICATION GATEWAY</h4>
                      <p className="text-[10px] text-[#888] font-mono max-w-xs mx-auto">
                        Instantly sync liquid bank assets, US Treasury holdings, or active line of credit letters. No credit impact.
                      </p>
                    </div>
                    <button 
                      onClick={handlePlaidConnect}
                      className="w-full bg-[#00FF66] text-black font-mono text-xs font-bold py-3 hover:bg-white transition-all uppercase tracking-wider"
                    >
                      CONNECT INSTANT PLAID POF
                    </button>
                  </div>
                )}

                {plaidState === 'connecting' && (
                  <div className="space-y-4 text-center py-8">
                    <div className="w-10 h-10 border-2 border-t-[#00FF66] border-r-transparent border-b-[#00FF66] border-l-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="space-y-1">
                      <h4 className="font-mono text-xs font-bold text-[#00FF66] tracking-widest animate-pulse">ESTABLISHING TUNNEL...</h4>
                      <p className="text-[9px] text-[#888] font-mono">
                        Validating financial assets through encrypted Plaid network protocol.
                      </p>
                    </div>
                  </div>
                )}

                {plaidState === 'connected' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 bg-[#00FF66] block animate-pulse"></span>
                        <span className="text-[10px] font-mono font-bold text-[#00FF66]">SECURE BANK FED LINKED</span>
                      </div>
                      <button 
                        onClick={() => {
                          setPlaidState('idle');
                          setVerifiedBalance(0);
                          addLog('TERMINATED PLAID FEED DISPATCH CONNECTION');
                        }}
                        className="text-[9px] font-mono text-[#FF3333] hover:underline"
                      >
                        DISCONNECT
                      </button>
                    </div>

                    <div className="bg-neutral-950 p-4 border border-neutral-900 text-center">
                      <div className="text-[9px] text-neutral-500 font-mono tracking-widest uppercase">TOTAL VERIFIED LIQUIDITY</div>
                      <div className="text-2xl font-bold font-mono text-[#00FF66] mt-1">
                        {formatCurrency(verifiedBalance)}
                      </div>
                      <div className="text-[8px] text-neutral-600 font-mono mt-2">
                        COMPLIANCE CERTIFICATION RE-RUN ON: {verificationTime}
                      </div>
                    </div>

                    <div className="text-[9px] font-mono text-neutral-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Synced Entities:</span> <span className="text-white">US Brokerage Block & Cash Pool</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Plaid API Signature:</span> <span className="text-white font-mono text-[8px]">SH-901-PXX-91</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Accredited Certification Checkbox Group */}
            <div className="space-y-3">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">3. SELF-CERTIFICATIONS</label>
              
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setAccreditedStatus(!accreditedStatus);
                    addLog(`ACCREDITED STATUS CHECK: ${!accreditedStatus ? 'TRUE' : 'FALSE'}`);
                  }}
                  className="w-full flex items-start gap-3 p-3 bg-black border border-[#222] hover:border-neutral-700 transition-all text-left"
                >
                  <div className={`w-4 h-4 border shrink-0 mt-0.5 flex items-center justify-center ${accreditedStatus ? 'border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66]' : 'border-[#444]'}`}>
                    {accreditedStatus && <span className="text-xs">✓</span>}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">Accredited Investor Status</span>
                    <span className="text-[10px] font-mono text-[#888] leading-tight block mt-0.5">
                      I certify assets exceed $1M (excluding primary residence) or household income exceeded $300K over last 24 months.
                    </span>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setExchange1031Ready(!exchange1031Ready);
                    addLog(`1031 EXCHANGE CAPABILITY CHECK: ${!exchange1031Ready ? 'TRUE' : 'FALSE'}`);
                  }}
                  className="w-full flex items-start gap-3 p-3 bg-black border border-[#222] hover:border-neutral-700 transition-all text-left"
                >
                  <div className={`w-4 h-4 border shrink-0 mt-0.5 flex items-center justify-center ${exchange1031Ready ? 'border-[#0EA5E9] bg-[#0EA5E9]/10 text-[#0EA5E9]' : 'border-[#444]'}`}>
                    {exchange1031Ready && <span className="text-xs">✓</span>}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">1031 Exchange Ready</span>
                    <span className="text-[10px] font-mono text-[#888] leading-tight block mt-0.5">
                      I have active 1031 Exchange proceeds requiring capital deployment inside standard regulatory time restrictions.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Digital Signature */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Digital Attestation Signature</label>
              <input 
                type="text" 
                placeholder="Type your legal name to verify"
                value={digitalSignature}
                onChange={(e) => setDigitalSignature(e.target.value)}
                className="w-full bg-black border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-3 placeholder:text-[#444] outline-none"
              />
              <p className="text-[8px] font-mono text-neutral-600 leading-tight">
                Binding agreement: Any information stated under our proof of funds protocol matches legal assets verifiable on-demand.
              </p>
            </div>
          </div>

          {/* SYSTEM LOGS CONSOLE */}
          <div className="border-t border-[#222] pt-6 mt-6 space-y-2">
            <div className="text-[9px] font-mono text-[#FF3333] font-bold tracking-wider">LIVE SECURE RUNTIME LOGS:</div>
            <div className="bg-black p-3 border border-neutral-900 font-mono text-[9px] space-y-1.5 min-h-[90px] max-h-[90px] overflow-y-auto">
              {systemLogs.map((log, index) => (
                <div key={index} className="text-neutral-500 leading-tight">
                  <span className="text-[#00FF66]">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER ACTION PANEL */}
      <div className="p-6 border-t border-[#222] bg-[#0a0a0a] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[10px] font-mono text-[#888] text-center md:text-left">
          <span>OPERATOR KEY: </span>
          <span className="text-[#0EA5E9]">{digitalSignature.toUpperCase() || 'UNVERIFIED'}</span>
          <span className="mx-2 text-[#222]">|</span>
          <span>LIQUID TARGET: </span>
          <span className="text-[#00FF66]">{plaidState === 'connected' ? formatCurrency(verifiedBalance) : 'UNAUTHENTICATED'}</span>
        </div>
        
        <button 
          onClick={() => {
            if (!digitalSignature.trim()) {
              alert('ATTENTION Required: Legal Signature missing from attestation profile console.');
              return;
            }
            alert('CRITICAL SECURE UPLOAD SECURED: Buyer profile, verified liquidity indicators, and sector targets locked into automated matching engines.');
            addLog('MANDATE EXECUTED. TRANSMITTING CONFIDENTIAL PROFILES TO SYSTEM OPERATOR.');
          }}
          className="w-full md:w-auto bg-[#00FF66] text-black font-mono text-xs font-bold px-6 py-4 tracking-widest hover:bg-[#F9F9F9] transition-all uppercase"
        >
          Lock Profile & Establish Priority Flow
        </button>
      </div>
    </div>
  );
}