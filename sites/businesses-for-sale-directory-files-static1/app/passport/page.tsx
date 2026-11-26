```tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

// Live Ticker Data
const TICKER_ITEMS = [
  { text: 'ACQUIRED: $1.2M EBITDA Manufacturing, Atlanta', color: 'text-boneWhite' },
  { text: 'UNDER CONTRACT: $450K SaaS, Remote', color: 'text-[#FF3333]' },
  { text: 'NEW LISTING: $800K HVAC, Franconia, VA', color: 'text-[#00FF66]' },
  { text: 'ACQUIRED: $3.1M EBITDA Distribution, Chicago', color: 'text-boneWhite' },
  { text: 'VALUATION SHIFT: Multiple baseline trends to 3.2x average', color: 'text-[#00FF66]' },
  { text: 'FINCEN-COMPLIANT: 256-bit buyer verification standard locked', color: 'text-[#0EA5E9]' },
];

export default function PassportPage() {
  // Navigation & Progress State
  const [profileName, setProfileName] = useState('Acquisition Partner LLC');
  const [targetSectors, setTargetSectors] = useState<string[]>(['SaaS', 'HVAC']);
  const [targetMinEbitda, setTargetMinEbitda] = useState('500000');
  
  // Plaid & POF State
  const [isPlaidConnecting, setIsPlaidConnecting] = useState(false);
  const [isPlaidConnected, setIsPlaidConnected] = useState(false);
  const [plaidBalance, setPlaidBalance] = useState<number | null>(null);
  
  const [isPofUploading, setIsPofUploading] = useState(false);
  const [pofFileName, setPofFileName] = useState<string | null>(null);
  const [pofAmount, setPofAmount] = useState('1250000');
  
  // Signature & NDA State
  const [ndaChecked1, setNdaChecked1] = useState(false);
  const [ndaChecked2, setNdaChecked2] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [isNdaSigned, setIsNdaSigned] = useState(false);
  const [ndaHash, setNdaHash] = useState('');

  // Decryption & Token State
  const [isDecryptingToken, setIsDecryptingToken] = useState(false);
  const [decryptionProgress, setDecryptionProgress] = useState(0);
  const [terminalToken, setTerminalToken] = useState<string | null>(null);

  // Terminal Console Logs State
  const [logs, setLogs] = useState<string[]>([
    '[13:02:44] PORTAL_INITIALIZED // ESTABLISHING SECURE CONNECTION TO ACQUIRE_META NODE...',
    '[13:02:45] COMPLIANCE SCHEME: FINCEN COMPLIANT REGISTRATION [ACTIVE]',
    '[13:02:46] SYSTEM: WAITING FOR BUYER CORRIDOR PROFILE DIAGNOSTICS...',
  ]);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Helper to append compliance logs
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // Industry Sector toggles
  const toggleSector = (sector: string) => {
    if (targetSectors.includes(sector)) {
      setTargetSectors(targetSectors.filter(s => s !== sector));
      addLog(`SECTOR MATRIX OUTFLOW: REMOVED [${sector.toUpperCase()}]`);
    } else {
      setTargetSectors([...targetSectors, sector]);
      addLog(`SECTOR MATRIX INFLOW: ADDED [${sector.toUpperCase()}]`);
    }
  };

  // Mock Plaid authentication flow
  const connectPlaidMock = () => {
    if (isPlaidConnected) return;
    setIsPlaidConnecting(true);
    addLog('PLAID LINK INITIATED: CONTACTING EXTERNAL FINANCIAL API CORE...');
    
    setTimeout(() => {
      setIsPlaidConnecting(false);
      setIsPlaidConnected(true);
      setPlaidBalance(1845000);
      addLog('PLAID SYNCHRONIZED: SUCCESSFUL OAUTH SECURE HANDSHAKE.');
      addLog('PLAID AUDIT REPORT: DETECTED SYSTEM LIQUIDITY OF $1,845,000 USD.');
    }, 1800);
  };

  // Mock POF upload
  const simulatePofUpload = () => {
    setIsPofUploading(true);
    addLog('PROOF_OF_FUNDS: COMPILING LOCAL SHA-256 DOCUMENT ENVELOPE...');
    
    setTimeout(() => {
      setIsPofUploading(false);
      setPofFileName('POF_SECURE_AMEX_DEC_2026.PDF');
      addLog('UPLOAD COMPLETED: "POF_SECURE_AMEX_DEC_2026.PDF" STRAPPED TO PROFILE INDEX.');
      addLog(`POF ATTRIBUTION AMOUNT: $${parseInt(pofAmount).toLocaleString()} CO-DEBT READINESS VALIDATED.`);
    }, 1500);
  };

  // Programmatic NDA Execution Signature
  const executeNDA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ndaChecked1 || !ndaChecked2 || !signatureName) {
      addLog('SYSTEM CRITICAL ERROR: SIGNATURE AND CLAUSES STAND PENDING.');
      return;
    }
    setIsNdaSigned(true);
    const hash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setNdaHash(hash);
    addLog(`NDA DIGITAL EXECUTION: COMPLIANT SYSTEM LOCKDOWN.`);
    addLog(`SECURE PROGRAMMATIC HASH: ${hash}`);
    addLog(`DECRYPTION MATRIX READINESS STANDBY...`);
  };

  // Decryption terminal simulation
  const decryptTerminalToken = () => {
    if (!isNdaSigned || (!isPlaidConnected && !pofFileName)) {
      addLog('DECRYPTION DECLINED: REQUIRES VERIFIED LIQUIDITY & EXECUTION HASH.');
      return;
    }
    setIsDecryptingToken(true);
    setDecryptionProgress(0);
    addLog('DECRYPTION PROTOCOL RE-ROUTE: GENERATING CRYPTOGRAPHIC SYSTEM HANDSHAKE...');

    const interval = setInterval(() => {
      setDecryptionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const finalToken = 'AQM-TOKEN-993-F82A-CIM-GATEWAY';
          setTerminalToken(finalToken);
          setIsDecryptingToken(false);
          addLog('DECRYPTION COMPLETED 100%. PRIVATE CIM CHANNELS NOW UNBLINDED.');
          addLog(`UNBLINDED TOKEN ACTIVE: ${finalToken}`);
          return 100;
        }
        addLog(`DECRYPTING NODES: INJECTING COMPLIANCE ENVELOPE [${prev + 20}%]`);
        return prev + 20;
      });
    }, 400);
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] min-h-screen flex flex-col antialiased font-mono selection:bg-[#00FF66] selection:text-[#050505]">
      {/* Dynamic Font and Style Loader */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />

      {/* Styled CRT Scanline and Infinite Marquee Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-image: radial-gradient(rgba(10, 10, 10, 0.8) 15%, transparent 80%);
        }
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: #111111;
          height: 4px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #00FF66;
          cursor: pointer;
          border-radius: 0px;
        }
      `}} />

      {/* 1. GLOBAL COMPLIANCE TICKER */}
      <header className="border-b border-[#222222] bg-[#050505] sticky top-0 z-40">
        <div className="overflow-hidden border-b border-[#222222] bg-[#0a0a0a] py-1 text-[10px] tracking-[0.2em] text-[#0EA5E9] uppercase">
          <div className="flex whitespace-nowrap animate-marquee">
            {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
              <span key={idx} className={`mx-4 ${item.color}`}>
                [{item.text}]
              </span>
            ))}
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#00FF66] animate-pulse"></div>
              <span className="text-lg font-bold tracking-wider text-[#F9F9F9]">
                ACQUIRE<span className="text-[#00FF66]">META</span>
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 border border-[#222222] text-[#888888] bg-[#0c0c0c] uppercase">
              Vetting Core v4.11 / Secured Gateway
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-[#888888] justify-center md:justify-end">
            <div>GATEWAY ACCESS CODE: <span className="text-[#00FF66] font-bold">BYPASS-77A</span></div>
            <div className="hidden sm:block">PASSPORT COMPLIANCE: <span className="text-[#0EA5E9]">AML / FINCEN LEVEL-3</span></div>
            <div className="border border-[#222222] px-2 py-1 bg-[#111111] text-[#F9F9F9] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] block animate-ping"></span>
              VERIFIED SECURE VAULT
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Compliance Vetting & Integration Steps (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Informative Top Banner */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 text-[9px] text-[#0ea5e9] bg-[#0c0c0c] border-l border-b border-[#222222] uppercase tracking-wider font-bold">
              Secure Channel
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-widest text-[#F9F9F9] uppercase mb-2">
              Verified Buyer Passport & Global NDA Gateway
            </h1>
            <p className="text-xs text-[#888888] leading-relaxed max-w-4xl">
              Access to confidential CIM books, private financials, and proprietary databases on AcquireMeta is gated behind standard liquidity verification and a programmatic NDA matrix. Execute the three steps below to generate your permanent cryptographically-signed terminal access passport.
            </p>
          </div>

          {/* STEP 1: Buy-Side Profile Diagnostics */}
          <section className="border border-[#222222] bg-[#0a0a0a] transition-colors duration-300 hover:border-[#0EA5E9]">
            <div className="border-b border-[#222222] p-4 bg-[#0c0c0c] flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-[#111111] border border-[#222222] text-[#0EA5E9]">
                  STEP 01
                </span>
                <h3 className="text-xs tracking-[0.15em] uppercase text-[#F9F9F9] font-bold">
                  BUYER MATRIX PROFILE
                </h3>
              </div>
              <span className="text-[10px] text-[#00FF66] font-bold">[READY]</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] text-[#888888] uppercase tracking-widest mb-2">
                  Acquisition Entity Name / Target Corporation
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => {
                    setProfileName(e.target.value);
                    addLog(`ENTITY MODIFICATION: REGISTERED NAME "${e.target.value}"`);
                  }}
                  className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-3 placeholder-[#888888] uppercase tracking-wider transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888888] uppercase tracking-widest mb-2">
                  Target Min Operating Cash Flow (EBITDA)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-xs text-[#888888]">$</span>
                  <input
                    type="number"
                    value={targetMinEbitda}
                    onChange={(e) => {
                      setTargetMinEbitda(e.target.value);
                      addLog(`METRIC PARADIGM SHIFT: PREFERRED EBITDA >= $${parseInt(e.target.value).toLocaleString()}`);
                    }}
                    className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-3 pl-7 uppercase tracking-wider transition-colors"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] text-[#888888] uppercase tracking-widest mb-3">
                  Sectors of Operational Focus (Multiselect Enabled)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['SaaS', 'HVAC', 'Manufacturing', 'Home Services', 'Logistics', 'Retail & Distribution'].map((sec) => {
                    const active = targetSectors.includes(sec);
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => toggleSector(sec)}
                        className={`text-xs px-3 py-2 border font-bold uppercase transition-all duration-150 ${
                          active
                            ? 'bg-[#00FF66] text-[#050505] border-[#00FF66]'
                            : 'bg-[#0c0c0c] text-[#F9F9F9] border-[#222222] hover:border-[#00FF66] hover:text-[#00FF66]'
                        }`}
                      >
                        {sec} {active ? '■' : '□'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* STEP 2: Proof of Funds (POF) or Plaid Asset Audit */}
          <section className="border border-[#222222] bg-[#0a0a0a] transition-colors duration-300 hover:border-[#0EA5E9]">
            <div className="border-b border-[#222222] p-4 bg-[#0c0c0c] flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-[#111111] border border-[#222222] text-[#0EA5E9]">
                  STEP 02
                </span>
                <h3 className="text-xs tracking-[0.15em] uppercase text-[#F9F9F9] font-bold">
                  LIQUID CAPITAL VERIFICATION PROTOCOL
                </h3>
              </div>
              <span className={`text-[10px] font-bold ${isPlaidConnected || pofFileName ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                {isPlaidConnected || pofFileName ? '[VERIFIED]' : '[AWAITING DATA]'}
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Option A: Connect Plaid */}
              <div className="border border-[#222222] bg-[#050505] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-[#0EA5E9] font-bold uppercase tracking-wider">// OPTION A</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20 font-bold uppercase">Automated</span>
                  </div>
                  <h4 className="text-xs text-[#F9F9F9] font-bold uppercase mb-2">
                    Connect Micro-Equity Ledger via Plaid
                  </h4>
                  <p className="text-[11px] text-[#888888] leading-relaxed mb-4">
                    Fastest path. Secure OAuth endpoint to sync dry-powder balance across designated operational deposit accounts.
                  </p>
                </div>

                <div>
                  {isPlaidConnected ? (
                    <div className="border border-[#00FF66] bg-[#00FF66]/5 p-3 text-center">
                      <span className="text-xs text-[#00FF66] font-bold block uppercase">
                        ✓ PLAID STATUS: AUDITED
                      </span>
                      <span className="text-[11px] text-[#888888] block mt-1">
                        Liquid Balance Available: <span className="text-white font-mono font-bold">${plaidBalance?.toLocaleString()}</span>
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={connectPlaidMock}
                      disabled={isPlaidConnecting}
                      className="w-full text-xs font-bold py-3 uppercase tracking-widest border border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-[#050505] transition-all bg-[#0c0c0c] disabled:opacity-50"
                    >
                      {isPlaidConnecting ? 'CONNECTING INTERFACE...' : 'SECURE PLAID HANDSHAKE [MOCK]'}
                    </button>
                  )}
                </div>
              </div>

              {/* Option B: Manual File Upload */}
              <div className="border border-[#222222] bg-[#050505] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-[#0EA5E9] font-bold uppercase tracking-wider">// OPTION B</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#888888]/10 text-[#888888] border border-[#222222] font-bold uppercase">Manual Review</span>
                  </div>
                  <h4 className="text-xs text-[#F9F9F9] font-bold uppercase mb-2">
                    Upload Proof of Funds / Broker Statements
                  </h4>
                  <p className="text-[11px] text-[#888888] leading-relaxed mb-4">
                    Attach bank declarations, uncalled LP capital certifications, or home equity certificates. Required target minimum:
                  </p>
                  
                  {/* Amount Configuration input */}
                  <div className="mb-4">
                    <label className="block text-[9px] text-[#888888] uppercase mb-1">Declared Dry Powder (USD)</label>
                    <input
                      type="number"
                      value={pofAmount}
                      onChange={(e) => setPofAmount(e.target.value)}
                      className="w-full bg-[#0c0c0c] border border-[#222222] text-[#F9F9F9] text-xs p-2 focus:outline-none focus:border-[#0EA5E9]"
                    />
                  </div>
                </div>

                <div>
                  {pofFileName ? (
                    <div className="border border-[#00FF66] bg-[#00FF66]/5 p-3 text-center">
                      <span className="text-xs text-[#00FF66] font-bold block uppercase truncate">
                        ✓ ATTACHED: {pofFileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPofFileName(null);
                          addLog('POF REMOVED: READY FOR NEW DOCUMENTATION INDEX.');
                        }}
                        className="text-[9px] text-[#FF3333] uppercase underline mt-2 hover:text-[#ff6666]"
                      >
                        Wipe Document
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={simulatePofUpload}
                      disabled={isPofUploading}
                      className="w-full text-xs font-bold py-3 uppercase tracking-widest border border-[#888888] text-[#888888] hover:border-[#F9F9F9] hover:text-[#F9F9F9] transition-all bg-[#0c0c0c] disabled:opacity-50"
                    >
                      {isPofUploading ? 'UPLOADING...' : 'UPLOAD BANK STATEMENT'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          </section>

          {/* STEP 3: Cryptographic Global NDA Agreement */}
          <section className="border border-[#222222] bg-[#0a0a0a] transition-colors duration-300 hover:border-[#0EA5E9]">
            <div className="border-b border-[#222222] p-4 bg-[#0c0c0c] flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-[#111111] border border-[#222222] text-[#0EA5E9]">
                  STEP 03
                </span>
                <h3 className="text-xs tracking-[0.15em] uppercase text-[#F9F9F9] font-bold">
                  PROGRAMMATIC NDA MUTUAL TERMS
                </h3>
              </div>
              <span className={`text-[10px] font-bold ${isNdaSigned ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                {isNdaSigned ? '[SIGNED]' : '[AWAITING EXECUTION]'}
              </span>
            </div>

            <div className="p-6 space-y-4">
              {/* Fake NDA Agreement Scroll Box */}
              <div className="h-40 overflow-y-scroll bg-[#050505] border border-[#222222] p-4 text-[10px] text-[#888888] space-y-3 leading-relaxed">
                <p className="font-bold text-boneWhite uppercase">// GLOBAL NON-DISCLOSURE & TRANSACTION DECORUM AGREEMENT (AQM-v4.2)</p>
                <p>
                  This unilateral and bilateral non-disclosure agreement governs the access of unblinded corporate CIM packets, geographic location indicators, exact operating employee count matrices, and specific proprietary databases compiled on the ACQUIRE_META private terminal interface.
                </p>
                <p>
                  1. **STRICT NON-DISCLOSURE MANDATE**: Under no circumstance is the Recipient permitted to contact the business ownership, operational workforce, vendors, direct clients, or competing local service agencies of the target listing without written authorization from the primary transaction advisor.
                </p>
                <p>
                  2. **EVIDENCE OF FUNDS VALIDITY**: The Recipient declares that any connected Plaid balances or uploaded bank indices represent real, unencumbered dry powder or usable commercial credit lines ready for buy-side allocation under standardized corporate transaction structures.
                </p>
                <p>
                  3. **BREACH REMEDIES**: In the event of a breach of the operational non-disclosure parameters detailed within, AcquireMeta reserves the absolute mandate to dissolve the Terminal Access Token, flag the entity registration index within our secure broker syndicate registry, and pursue applicable local state judicial remedies.
                </p>
              </div>

              {/* Form Interactivity */}
              <form onSubmit={executeNDA} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="flex items-start space-x-3 text-xs text-[#888888] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ndaChecked1}
                      onChange={(e) => setNdaChecked1(e.target.checked)}
                      disabled={isNdaSigned}
                      className="mt-0.5 rounded-none accent-[#00FF66] bg-[#050505] border-[#222222]"
                    />
                    <span>I agree to keep listing details, exact locations, and structural financials strictly confidential (No direct seller contact allowed).</span>
                  </label>
                  
                  <label className="flex items-start space-x-3 text-xs text-[#888888] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ndaChecked2}
                      onChange={(e) => setNdaChecked2(e.target.checked)}
                      disabled={isNdaSigned}
                      className="mt-0.5 rounded-none accent-[#00FF66] bg-[#050505] border-[#222222]"
                    />
                    <span>I declare that all proof of funds data represents authentic investment capacity for transaction processing.</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-2">
                  <div>
                    <label className="block text-[10px] text-[#888888] uppercase tracking-widest mb-1">
                      Digital Signature (Type Full Legal Name)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ALEXANDER CHEN"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      disabled={isNdaSigned}
                      className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:outline-none focus:border-[#00FF66] p-3 uppercase tracking-widest font-bold"
                    />
                  </div>

                  <div>
                    {isNdaSigned ? (
                      <div className="bg-[#00FF66]/10 border border-[#00FF66] text-[#00FF66] text-xs font-bold p-3 text-center uppercase tracking-widest">
                        ✓ NDA SUCCESSFULLY RECORDED
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full text-xs text-terminalBlack bg-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] font-bold py-3.5 px-6 transition-all duration-200 uppercase tracking-widest text-center"
                      >
                        Execute Programmatic NDA
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Cryptographic Token Core & Console Logs (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Decryption Portal Token Terminal */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-6 space-y-6 relative">
            <span className="text-[10px] text-[#888888] uppercase tracking-wider block">
              // CRYPTOGRAPHIC PASSPORT TOKEN DECODER
            </span>

            {/* Token Progress/Status Widget */}
            <div className="border border-[#222222] bg-[#050505] p-5 text-center space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#888888]">DECRYPTION READINESS:</span>
                <span className={isNdaSigned && (isPlaidConnected || pofFileName) ? 'text-[#00FF66] font-bold' : 'text-[#FF3333] font-bold'}>
                  {isNdaSigned && (isPlaidConnected || pofFileName) ? 'READY' : 'INCOMPLETE'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#111111] h-3 border border-[#222222] relative overflow-hidden">
                <div
                  className="bg-[#00FF66] h-full transition-all duration-300"
                  style={{ width: `${decryptionProgress}%` }}
                ></div>
              </div>

              {/* Terminal Token Visual output */}
              <div className="p-3 bg-[#0c0c0c] border border-[#222222] rounded-none">
                {terminalToken ? (
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#00FF66] block font-bold tracking-widest">
                      [ACCESS GRANTED]
                    </span>
                    <span className="text-xs font-bold text-white break-all block select-all cursor-pointer" title="Click to Select">
                      {terminalToken}
                    </span>
                    <span className="text-[8px] text-[#888888] block uppercase">
                      Pass token attached to verified ID session.
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-[#888888] tracking-widest block py-2">
                    [PASSPORT_LOCKED_0x00]
                  </span>
                )}
              </div>

              {/* Unlock Action */}
              {!terminalToken && (
                <button
                  type="button"
                  onClick={decryptTerminalToken}
                  disabled={isDecryptingToken || !isNdaSigned || (!isPlaidConnected && !pofFileName)}
                  className={`w-full text-xs font-bold py-3.5 uppercase tracking-widest transition-all duration-200 border ${
                    isNdaSigned && (isPlaidConnected || pofFileName)
                      ? 'bg-[#0ea5e9] text-black border-[#0ea5e9] hover:bg-[#050505] hover:text-[#0ea5e9]'
                      : 'bg-[#111111] text-[#888888] border-[#222222] cursor-not-allowed'
                  }`}
                >
                  {isDecryptingToken ? 'DECRYPTING NODES...' : 'DECRYPT ACCESS PASSPORT'}
                </button>
              )}

              {terminalToken && (
                <button
                  type="button"
                  onClick={() => alert('Access verified! Redirecting to unblinded operational deal terminals...')}
                  className="w-full text-xs font-bold py-3.5 bg-[#00FF66] text-[#050505] hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] uppercase tracking-widest transition-all duration-200"
                >
                  Enter Unblinded Terminal
                </button>
              )}
            </div>

            {/* Quick Passport Attributes List */}
            <div className="border border-[#222222] p-4 bg-[#050505] space-y-3 text-[11px]">
              <span className="text-[10px] text-[#888888] block uppercase tracking-wider">// PASSPORT SPECIFICATIONS</span>
              <div className="flex justify-between border-b border-[#111111] pb-1.5">
                <span className="text-[#888888]">AML/KYC Audit:</span>
                <span className="text-[#00FF66] font-bold">Standard Approved</span>
              </div>
              <div className="flex justify-between border-b border-[#111111] pb-1.5">
                <span className="text-[#888888]">Token Validity:</span>
                <span className="text-white">180 Days</span>
              </div>
              <div className="flex justify-between border-b border-[#111111] pb-1.5">
                <span className="text-[#888888]">CIM PDF Decrypt:</span>
                <span className={terminalToken ? 'text-[#00FF66]' : 'text-[#888888]'}>
                  {terminalToken ? 'ACTIVE' : 'LOCKED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888888]">Authorized Brokerage Network:</span>
                <span className="text-[#0ea5e9]">AcquireMeta Syndicate</span>
              </div>
            </div>
          </div>

          {/* Compliance Audit & Logs Terminal */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#888888] uppercase tracking-wider block">
                // SYSTEM RE-ROUTE COMMS LOGGER
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00FF66] block animate-ping"></span>
            </div>
            
            <div className="h-56 bg-[#050505] border border-[#222222] p-3 overflow-y-auto space-y-2 text-[10px] font-mono text-[#00FF66] scrollbar-thin">
              {logs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  <span className="text-[#888888] font-bold">&gt;&gt;</span> {log}
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>

            <div className="text-[9px] text-[#888888] leading-normal text-center">
              System protocol locks are verified using Plaid secure ledger balance verification structures and programmatic non-disclosure keys.
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER & TRUST SIGNALS */}
      <footer className="border-t border-[#222222] bg-[#030303] mt-12 py-8 px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Trust Network Icons Row */}
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-[#222222]">
            <div className="text-xs tracking-[0.2em] text-[#888888] uppercase font-mono">
              SECURE COMPLIANCE VETTING CORES
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8 items-center text-[10px] text-[#888888]">
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <svg className="w-4 h-4 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>FINCEN SECURE DATA COMPLIANT</span>
              </div>
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <svg className="w-4 h-4 text-[#0ea5e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>PLAID ENVELOPE HANDSHAKE (AES-256)</span>
              </div>
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <svg className="w-4 h-4 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438z" />
                </svg>
                <span>SBA PREFERRED ADVISORY PLATFORM</span>
              </div>
            </div>
          </div>

          {/* Legal Compliance Block */}
          <div className="text-[10px] text-[#888888] leading-relaxed max-w-7xl space-y-3 font-mono">
            <p className="uppercase tracking-wider text-boneWhite">// PRIVATE DATA AND CRYPTOGRAPHIC TERMINAL COMPLIANCE DISCLOSURE</p>
            <p>
              Disclaimer: The AcquireMeta Verified Buyer Passport is an operational standard to ensure that qualified corporate acquisitions are initiated with correct capital allocation buffers. This protocol is intended for preliminary dry-powder screening. Connected accounts, balances, and digital certificates are parsed with state-level secure validation rules and do not constitute a direct custody transfer or advisory guarantee.
            </p>
            <p>
              By accessing programmatic unblinded corporate CIM details, searchers assume absolute financial responsibility for strict non-disclosure mandates under local national legislation guidelines. Broker data is monitored for anomalies in search-to-acquisition flow vectors to protect our small business partners.
            </p>
            <div className="flex justify-between items-center text-[9px] text-[#888888] pt-4">
              <span>© 2026 ACQUIRE_META GLOBAL LTD. BUYER_PASSPORT REGISTRATION MODULE.</span>
              <span>DATA CONSTRAINTS SECURE [NODE: 928-PASSPORT]</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
```