import React, { useState, useEffect, useRef } from 'react';

// Live Terminal Feed Logs generator
const INITIAL_LOGS = [
  "[SYS] INITIALIZING SECURE PROTOCOL PROTO-1031 COMPLIANT...",
  "[SYS] FINCEN ANTI-MONEY LAUNDERING DATABASE CONNECTION ONLINE",
  "[SECURE] READY TO AUTHORIZE CERTIFIED TRANSACTION PARAMETERS"
];

const PRESET_INSTITUTIONS = [
  { id: 'chase', name: 'J.P. Morgan Chase Private Client', liquidity: 1450000 },
  { id: 'fidelity', name: 'Fidelity Brokerage Account', liquidity: 850000 },
  { id: 'svb', name: 'SVB Premium Private Banking', liquidity: 2100000 },
  { id: 'boa', name: 'Merrill Edge Wealth Management', liquidity: 620000 }
];

export default function NdaAutoSigner() {
  // App states
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const [thesisText, setThesisText] = useState(
    "Acquiring high-leverage industrial services, HVAC, or specialty B2B logistics firms in the Atlantic corridor. Target criteria: $400k-$1.2M stable EBITDA with at least 80% recurring maintenance contracts."
  );
  const [targetEbitda, setTargetEbitda] = useState("500000");
  const [buyerCategory, setBuyerCategory] = useState("Micro-PE Syndicate");
  const [accreditedStatus, setAccreditedStatus] = useState({
    netWorth: false,
    income: false,
    professional: false
  });

  // Plaid connection mock state
  const [isPlaidConnecting, setIsPlaidConnecting] = useState(false);
  const [selectedInst, setSelectedInst] = useState('');
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const [plaidLinked, setPlaidLinked] = useState(false);
  const [verifiedBalance, setVerifiedBalance] = useState(0);
  const [linkedBankName, setLinkedBankName] = useState('');

  // Signature States
  const [legalName, setLegalName] = useState('');
  const [esignLocked, setEsignLocked] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);

  // Time ticks
  const [currentTime, setCurrentTime] = useState('12:00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 15)]);
  };

  const handlePlaidLink = (instId: string) => {
    const inst = PRESET_INSTITUTIONS.find(i => i.id === instId);
    if (!inst) return;
    
    setIsPlaidConnecting(true);
    addLog(`INITIALIZING PLAID OAUTH BRIDGE FOR: ${inst.name.toUpperCase()}...`);
    
    setTimeout(() => {
      setPlaidLinked(true);
      setVerifiedBalance(inst.liquidity);
      setLinkedBankName(inst.name);
      setIsPlaidConnecting(false);
      setShowPlaidModal(false);
      addLog(`PLAID SECURE FEED MATCHED. TOKENS RETRIEVED SECURELY.`);
      addLog(`CERTIFIED POF ACQUIRED: $${(inst.liquidity / 1000000).toFixed(2)}M IN LIQUID RESERVES.`);
    }, 1800);
  };

  const unlinkPlaid = () => {
    setPlaidLinked(false);
    setVerifiedBalance(0);
    setLinkedBankName('');
    addLog(`SECURITY PROTOCOL: PLAID TOKEN SCRUBBED FROM TERMINAL CACHE.`);
  };

  const handleLockSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName.trim() || !agreementChecked) {
      addLog(`[WARN] CANNOT LOCK SIGNATURE: LEGAL NAME AND AGREEMENT MANDATORY.`);
      return;
    }

    // Generate simulated SHA-256 security hash
    const mockHash = "SHA256-" + Array.from({length: 32}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('').toUpperCase();

    setEsignLocked(true);
    setGeneratedHash(mockHash);
    addLog(`SECURE IDENTITY VALIDATION COMPLETED FOR: ${legalName.toUpperCase()}`);
    addLog(`GENERATE MASTER AUTO-NDA CREDENTIAL: ${mockHash}`);
  };

  const unlockSignature = () => {
    setEsignLocked(false);
    setGeneratedHash('');
    addLog(`MASTER AUTO-NDA CREDENTIAL REVOKED. DATA DE-CLASSIFIED.`);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const isProfileComplete = () => {
    return plaidLinked && esignLocked && Object.values(accreditedStatus).some(Boolean);
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] min-h-screen font-sans border-t border-[#222]">
      
      {/* LOCAL STATUS TOP BAR */}
      <div className="bg-black border-b border-[#222] px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono tracking-widest text-[#888]">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-[#0ea5e9] font-bold">
            <span className="inline-block w-2 h-2 mr-2 bg-[#0ea5e9] animate-pulse rounded-none"></span>
            VAULT STATUS: SECURE CONNECTION ACTIVE
          </span>
          <span className="text-[#222]">|</span>
          <span>ROUTING ID: #ACQ-POF-9021</span>
          <span className="text-[#222]">|</span>
          <span className="text-[#00FF66] font-bold">SHA-256 SECURED CRYPTO VAULT</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>REALTIME CLOCK: <span className="text-white font-bold">{currentTime}</span></span>
          <span className="text-[#FF3333] font-bold">AUTO-NDA ENGINE READY</span>
        </div>
      </div>

      {/* CORE PORTAL GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-0 border-b border-[#222]">
        
        {/* LEFT COLUMN: CRITERIA & ACCREDITATION Self-Cert (Width: 4/12) */}
        <section className="xl:col-span-4 bg-[#080808] border-r border-[#222] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="border-b border-[#222] pb-3">
              <span className="text-[#0ea5e9] text-[9px] font-mono font-bold tracking-widest bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 px-2 py-0.5">DOSSIER FILE #8441A</span>
              <h2 className="font-mono text-base font-bold text-white mt-2 flex items-center gap-2">
                <span className="inline-block w-1.5 h-3.5 bg-[#0ea5e9]"></span>
                INVESTOR PROFILE & THESIS
              </h2>
            </div>

            {/* Buyer classification */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Acquisition Vehicle Class</label>
              <select 
                value={buyerCategory} 
                onChange={(e) => {
                  setBuyerCategory(e.target.value);
                  addLog(`CHANGED ACQUISITION CLASSIFICATION TO: ${e.target.value.toUpperCase()}`);
                }}
                disabled={esignLocked}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-white p-3 focus:outline-none transition-all rounded-none disabled:opacity-50"
              >
                <option value="Micro-PE Syndicate">Micro-PE Syndicate / HoldCo</option>
                <option value="Individual Searcher (SBA-focused)">Individual Searcher (SBA-focused)</option>
                <option value="Corporate / Strategic Competitor">Corporate / Strategic Competitor</option>
                <option value="Family Office (Direct Investment)">Family Office (Direct Investment)</option>
              </select>
            </div>

            {/* Target EBITDA size */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Target Base EBITDA Capacity</label>
              <div className="relative">
                <select 
                  value={targetEbitda} 
                  onChange={(e) => {
                    setTargetEbitda(e.target.value);
                    addLog(`UPDATED SYSTEM INVESTMENT THRESHOLD: $${parseInt(e.target.value)/1000}K+ EBITDA`);
                  }}
                  disabled={esignLocked}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-white p-3 focus:outline-none transition-all rounded-none disabled:opacity-50"
                >
                  <option value="300000">$300K+ EBITDA</option>
                  <option value="500000">$500K+ EBITDA</option>
                  <option value="750000">$750K+ EBITDA</option>
                  <option value="1000000">$1.0M+ EBITDA</option>
                </select>
              </div>
            </div>

            {/* Thesis Statement */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[10px] text-[#888] tracking-widest uppercase">Target Sector Strategy</label>
                <span className="text-[9px] font-mono text-[#888]" x-text="thesisText.length"></span>
              </div>
              <textarea 
                value={thesisText}
                onChange={(e) => setThesisText(e.target.value)}
                disabled={esignLocked}
                rows={5}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-white p-3 outline-none resize-none transition-all rounded-none leading-relaxed disabled:opacity-50"
                placeholder="Describe your target sectors, geography, size thresholds..."
              />
            </div>

            {/* Accreditation Self-Certification Matrix */}
            <div className="space-y-3 bg-[#0a0a0a] p-4 border border-[#222]">
              <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#FF3333] font-bold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span>ACCREDITED INVESTOR CERTIFICATION</span>
              </div>
              <p className="text-[10px] font-mono text-[#888] leading-tight">
                Self-certify your SEC regulatory accreditation threshold. Select all parameters that apply:
              </p>

              <div className="space-y-2 pt-2">
                <label className="flex items-start space-x-3 cursor-pointer text-xs font-mono text-[#888] hover:text-[#F9F9F9]">
                  <input 
                    type="checkbox" 
                    checked={accreditedStatus.netWorth}
                    onChange={(e) => {
                      setAccreditedStatus({...accreditedStatus, netWorth: e.target.checked});
                      addLog(`ACCREDITATION: INDIVIDUAL NET WORTH VERIFICATION PARAMETER SET TO: ${e.target.checked}`);
                    }}
                    disabled={esignLocked}
                    className="mt-0.5 h-3 w-3 bg-[#050505] border border-[#222] checked:bg-[#0ea5e9] checked:border-transparent text-[#0ea5e9] focus:ring-0 rounded-none cursor-pointer"
                  />
                  <span className="leading-tight">Individual Net Worth exceeds $1,000,000 (excluding primary residence).</span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer text-xs font-mono text-[#888] hover:text-[#F9F9F9]">
                  <input 
                    type="checkbox" 
                    checked={accreditedStatus.income}
                    onChange={(e) => {
                      setAccreditedStatus({...accreditedStatus, income: e.target.checked});
                      addLog(`ACCREDITATION: ANNUAL INCOME VERIFICATION PARAMETER SET TO: ${e.target.checked}`);
                    }}
                    disabled={esignLocked}
                    className="mt-0.5 h-3 w-3 bg-[#050505] border border-[#222] checked:bg-[#0ea5e9] checked:border-transparent text-[#0ea5e9] focus:ring-0 rounded-none cursor-pointer"
                  />
                  <span className="leading-tight">Individual Income exceeds $200k (or $300k combined) for preceding two fiscal years.</span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer text-xs font-mono text-[#888] hover:text-[#F9F9F9]">
                  <input 
                    type="checkbox" 
                    checked={accreditedStatus.professional}
                    onChange={(e) => {
                      setAccreditedStatus({...accreditedStatus, professional: e.target.checked});
                      addLog(`ACCREDITATION: REQUISITE PROFESSIONAL LICENSE PARAMETER SET TO: ${e.target.checked}`);
                    }}
                    disabled={esignLocked}
                    className="mt-0.5 h-3 w-3 bg-[#050505] border border-[#222] checked:bg-[#0ea5e9] checked:border-transparent text-[#0ea5e9] focus:ring-0 rounded-none cursor-pointer"
                  />
                  <span className="leading-tight">Hold active financial credentials (Series 7, 65, or 82 certification).</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#222] hidden xl:block">
            <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">SEC COMPLIANCE NOTICE</div>
            <p className="text-[10px] text-neutral-500 font-mono leading-tight mt-1">
              Providing false certification parameters on formal investment profiles violates Title 18 of the United States Code and may invalidate active Deal Flow Access rights.
            </p>
          </div>
        </section>

        {/* CENTER COLUMN: PLAID DEPOSITS VAULT & AUTO-NDA SYSTEM (Width: 5/12) */}
        <section className="xl:col-span-5 bg-[#050505] p-6 flex flex-col justify-between space-y-6">
          
          {/* Section 1: Liquid Capital & Plaid Integration */}
          <div className="space-y-4">
            <div className="border-b border-[#222] pb-3 flex justify-between items-center">
              <div>
                <span className="text-[#00FF66] text-[9px] font-mono font-bold tracking-widest bg-[#00FF66]/10 border border-[#00FF66]/20 px-2 py-0.5">PLAID FEED LEVEL 4</span>
                <h2 className="font-mono text-base font-bold text-white mt-2 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-3.5 bg-[#00FF66]"></span>
                  PROOF OF FUNDS (POF) INTEGRATED VAULT
                </h2>
              </div>
            </div>

            <p className="text-xs text-[#888] font-mono leading-relaxed">
              Automated institutional balance verification engine. Rather than uploading static sensitive bank statements, securely verify real-time available transactional liquidity through Sandbox Plaid endpoints.
            </p>

            {/* PLAID NOT CONNECTED STAT */}
            {!plaidLinked ? (
              <div className="border-2 border-dashed border-[#222] p-8 text-center flex flex-col items-center justify-center space-y-4 bg-black/40">
                <div className="w-12 h-12 bg-[#222] flex items-center justify-center border border-[#333]">
                  <svg className="w-6 h-6 text-[#888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">No Certified Capital Feed Linked</h3>
                  <p className="text-[10px] text-[#888] font-mono mt-1 max-w-sm">
                    Link checking, brokerage, or custodial capital reserves to obtain pre-authorized status on premium pipeline assets.
                  </p>
                </div>

                <button 
                  onClick={() => setShowPlaidModal(true)}
                  className="bg-[#00FF66] text-black font-mono text-[10px] font-bold tracking-widest uppercase px-5 py-3 hover:bg-white transition-all"
                >
                  [ CONNECT SECURE PLAID FEED ]
                </button>
              </div>
            ) : (
              /* PLAID CONNECTED SUCCESS CARD */
              <div className="border border-[#00FF66] bg-[#00FF66]/5 p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#00FF66] text-black text-[9px] font-mono font-black px-2 py-0.5">
                  SECURE LIVE LINK
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#00FF66]/10 border border-[#00FF66]/40 flex items-center justify-center text-[#00FF66] shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] font-mono text-[#00FF66] uppercase tracking-widest font-black">Verified Asset Statement Certificate</div>
                    <h3 className="text-sm font-mono font-bold text-white uppercase leading-none">{linkedBankName}</h3>
                    <div className="text-xl font-bold text-[#00FF66] font-mono pt-1">
                      {formatCurrency(verifiedBalance)}
                    </div>
                    <p className="text-[9px] text-[#888] font-mono">
                      Feed Token Timestamp: <span className="text-white">RE-VERIFIED TODAY</span> (STABLE FEED)
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#00FF66]/10 flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#888]">TRANSACTION INDEX ID: <span className="text-white">PLD-MD91-0029X</span></span>
                  <button 
                    onClick={unlinkPlaid}
                    className="text-[9px] font-mono text-[#FF3333] hover:underline"
                  >
                    DISCONNECT FEED
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Master NDA Structural Execution Mechanics */}
          <div className="space-y-3 bg-[#0a0a0a] border border-[#222] p-5">
            <span className="text-xs font-mono font-bold text-[#F9F9F9] tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#0ea5e9]"></span>
              MASTER NDA PRE-AUTHORIZATION MATRIX
            </span>
            <p className="text-[11px] text-[#888] font-mono leading-relaxed">
              By authorizing the system cryptographic signature, you initiate standard bilateral non-disclosure parameters for any vetted deals you inspect in the Underground Deal Flow Terminal. This unlocks immediate download capacities on confidential offering memorandums.
            </p>
            <div className="border-t border-[#222] pt-3 text-[10px] text-[#888] font-mono leading-tight space-y-1.5">
              <p className="flex justify-between"><span>GOVERNING DECREE:</span> <span className="text-white">DELAWARE CHANCERY SYSTEM</span></p>
              <p className="flex justify-between"><span>TERMS OF RETENTION:</span> <span className="text-white">24 MONTHS NON-DISCLOSURE</span></p>
              <p className="flex justify-between"><span>PERMITTED RECIPIENTS:</span> <span className="text-white">PE FIRM MEMBERS / DIRECT DEBT PARTNERS</span></p>
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: SECURITY SIGNATURE ENGINE & TELEMETRY FEEDS (Width: 3/12) */}
        <section className="xl:col-span-3 bg-[#0c0c0c] p-6 flex flex-col justify-between space-y-6">
          
          {/* CRYPTOGRAPHIC SIGNATURE GENERATOR */}
          <div className="space-y-5">
            <div className="border-b border-[#222] pb-3">
              <span className="text-[#FF3333] text-[9px] font-mono font-bold tracking-widest bg-[#FF3333]/10 border border-[#FF3333]/20 px-2 py-0.5">AUTO-NDA COMPLIANCE ENGINE</span>
              <h2 className="font-mono text-base font-bold text-white mt-2 flex items-center gap-2">
                <span className="inline-block w-1.5 h-3.5 bg-[#FF3333]"></span>
                ESIGN SIGNATURE SECURE PAD
              </h2>
            </div>

            {!esignLocked ? (
              <form onSubmit={handleLockSignature} className="space-y-4">
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">E-Sign Authorized Legal Representative</label>
                  <input 
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="Enter legal full name..."
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#FF3333] text-xs font-mono text-white p-3 placeholder:text-neutral-700 outline-none transition-all rounded-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={agreementChecked}
                      onChange={(e) => setAgreementChecked(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 bg-[#050505] border border-[#222] checked:bg-[#FF3333] checked:border-transparent text-[#FF3333] focus:ring-0 rounded-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-[#888] leading-tight select-none">
                      I agree to authorize bilateral NDA parameters. My entered name serves as an enforceable signature validating confidentiality.
                    </span>
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#FF3333] hover:bg-white text-black font-mono text-xs font-bold py-3.5 tracking-widest uppercase transition-all rounded-none flex items-center justify-center space-x-2"
                >
                  <span>LOCK SECURE AUTOGRAPH</span>
                  <span>&rarr;</span>
                </button>
              </form>
            ) : (
              /* SIGNATURE LOCKED STATE W/ CREDENTIAL DETAILS */
              <div className="space-y-4">
                <div className="border border-[#FF3333] bg-[#FF3333]/5 p-4 text-center space-y-3">
                  <div className="text-[9px] font-mono text-[#FF3333] uppercase tracking-widest font-bold">CRYPTO SIGNATURE IS ENFORCED</div>
                  
                  <div className="border-y border-[#FF3333]/20 py-2.5">
                    <div className="text-lg font-mono font-bold text-white tracking-widest uppercase">
                      / {legalName} /
                    </div>
                    <div className="text-[9px] font-mono text-neutral-500 tracking-wider mt-0.5">
                      AUTHORIZED SIGNATORY REPRESENTATIVE
                    </div>
                  </div>

                  <div className="space-y-1 text-[9px] font-mono text-[#888] text-left">
                    <div className="break-all">HASH: <span className="text-white">{generatedHash}</span></div>
                    <div>ENFORCEMENT IP: <span className="text-white">162.24.91.801 (SIMULATED)</span></div>
                    <div>COMPLIANCE STATUS: <span className="text-[#00FF66] font-bold">SECURE BINDING ACTIVE</span></div>
                  </div>

                  <button 
                    onClick={unlockSignature}
                    className="w-full border border-[#FF3333]/30 hover:border-[#FF3333] text-[#FF3333] text-[9px] font-mono py-2 tracking-widest uppercase transition-all"
                  >
                    REVOKE &amp; REMOVE SIGNATURE
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* REALTIME TRANSACTION TERMINAL FEED LOGS */}
          <div className="space-y-3 pt-6 border-t border-[#1a1a1a]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-[#888] tracking-widest uppercase">SECURE PORTAL AUDIT LOG</span>
              <span className="w-1.5 h-1.5 bg-[#00FF66] rounded-none animate-pulse"></span>
            </div>
            
            <div className="h-[140px] overflow-y-auto bg-black border border-[#222] p-3 text-[9px] font-mono text-[#888] space-y-1.5 leading-snug">
              {logs.map((log, index) => (
                <div key={index} className="text-left font-mono">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </section>

      </div>

      {/* PORTAL COMPLETION CONTROL CENTER */}
      <div className="p-6 bg-[#0a0a0a] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start space-x-3.5">
          <div className="p-2 border border-[#222] bg-black shrink-0">
            {isProfileComplete() ? (
              <span className="inline-block w-6 h-6 bg-[#00FF66] rounded-none text-black flex items-center justify-center font-bold text-xs">
                ✓
              </span>
            ) : (
              <span className="inline-block w-6 h-6 bg-[#FF3333]/10 text-[#FF3333] border border-[#FF3333]/30 rounded-none flex items-center justify-center font-mono text-xs font-bold">
                !
              </span>
            )}
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {isProfileComplete() ? "INTEGRATED PRO-TIER QUALIFIED CREDENTIALS COMPLETED" : "ACQUISITION ENTREPRENEUR DOSSIER PROFILE PENDING AUTHORIZATION"}
            </h4>
            <p className="text-[11px] text-[#888] font-mono leading-relaxed mt-0.5">
              {isProfileComplete() 
                ? "Your Plaid Liquid Capital balance and master digital signature are fully verified. You have instant access to all premium assets without deal-by-deal submission gates." 
                : "Complete both the Secure Plaid POF link and lock your bilateral digital signature to enable 1-click automatic NDA access across all listings."
              }
            </p>
          </div>
        </div>

        <div>
          {isProfileComplete() ? (
            <button 
              onClick={() => alert("Redirecting to Premium Underground Terminal Pipeline with pre-authorized access codes...")}
              className="w-full md:w-auto bg-[#00FF66] text-black font-mono text-xs font-bold px-8 py-4 tracking-widest hover:bg-[#F9F9F9] transition-all uppercase"
            >
              ACCESS ALL DEALS INSTANTLY &rarr;
            </button>
          ) : (
            <button 
              disabled
              className="w-full md:w-auto bg-[#222] text-[#888] font-mono text-xs font-bold px-8 py-4 tracking-widest uppercase cursor-not-allowed border border-[#333]"
            >
              PENDING PROFILE COMPLETION
            </button>
          )}
        </div>
      </div>

      {/* SECURE INSTITUTION LINKING PLAID OVERLAY MODAL */}
      {showPlaidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#050505] border-2 border-[#00FF66] w-full max-w-md flex flex-col overflow-hidden relative">
            <div className="bg-[#00FF66] h-1 w-full"></div>
            
            <div className="p-6 border-b border-[#222] bg-[#0a0a0a] flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono text-black bg-[#00FF66] px-1.5 py-0.5 font-bold tracking-widest uppercase">PLAID SANDBOX CONNECTOR</span>
                <h3 className="text-base font-bold font-mono tracking-tight text-white mt-1.5">CHOOSE SECURE DEPOSITORY</h3>
              </div>
              <button 
                onClick={() => setShowPlaidModal(false)}
                className="text-[#888] hover:text-white font-mono text-xs border border-[#222] px-2 py-1"
              >
                [X] CLOSE
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-[11px] font-mono text-[#888] leading-tight">
                Select your pre-funded capital sandbox account below to authorize simulated credential transfer to our Verified Buyer Vault:
              </p>

              {isPlaidConnecting ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-8 h-8 border-2 border-t-transparent border-[#00FF66] animate-spin rounded-none"></div>
                  <div className="text-[10px] font-mono text-[#00FF66] animate-pulse tracking-widest uppercase">
                    ESTABLISHING ENCRYPTED PLAID HANDSHAKE...
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {PRESET_INSTITUTIONS.map((inst) => (
                    <button
                      key={inst.id}
                      onClick={() => handlePlaidLink(inst.id)}
                      className="w-full flex items-center justify-between p-3 border border-[#222] hover:border-[#00FF66] bg-black hover:bg-[#00FF66]/5 text-left font-mono transition-all group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#00FF66]">{inst.name}</div>
                        <div className="text-[9px] text-[#888]">Simulated Capital Account Verification</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#00FF66]">{formatCurrency(inst.liquidity)}</div>
                        <div className="text-[8px] text-[#888] tracking-widest">[ SELECT ]</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#222] bg-[#0a0a0a] text-center">
              <span className="text-[9px] font-mono text-[#888] leading-tight">
                SECURE AES-256 BANK GRADE END-TO-END PLAID CONNECTIVITY PROTOCOL
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}