import React, { useState, useEffect, useRef } from 'react';

// Custom Type Definitions
type VerificationLog = {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
};

type SimulatedCim = {
  id: string;
  codename: string;
  industry: string;
  askingPrice: string;
  ebitda: string;
  confidentialDetails: string;
};

export default function NdaDigitalSignature() {
  // Connection / Passport States
  const [plaidStatus, setPlaidStatus] = useState<'unlinked' | 'syncing' | 'verified'>('unlinked');
  const [plaidBalance, setPlaidBalance] = useState<number>(0);
  const [plaidInstitution, setPlaidInstitution] = useState<string>('');
  
  // POF State
  const [pofFile, setPofFile] = useState<{ name: string; size: string; amount: number } | null>(null);
  const [pofUploading, setPofUploading] = useState(false);
  const [pofProgress, setPofProgress] = useState(0);

  // NDA State
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [hasCheckedTerms, setHasCheckedTerms] = useState(false);
  const [isNdaSubmitted, setIsNdaSubmitted] = useState(false);
  const [ndaSignatureDate, setNdaSignatureDate] = useState('');

  // Cryptographic Lock State
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Terminal Logs
  const [logs, setLogs] = useState<VerificationLog[]>([
    { timestamp: '14:22:01', message: 'PASSPORT SECURITY MODULE INITIALIZED.', type: 'info' },
    { timestamp: '14:22:03', message: 'AWAITING USER IDENTITY MATRIX SYNC.', type: 'warn' },
  ]);

  // CIM Access State
  const [selectedCim, setSelectedCim] = useState<string | null>(null);

  // DOM Refs
  const ndaContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { timestamp: time, message: message.toUpperCase(), type }]);
  };

  // Plaid Sync Simulation
  const handleConnectPlaid = (institution: string) => {
    setPlaidStatus('syncing');
    addLog(`INITIATING PLAID HANDSHAKE FOR ${institution}...`, 'info');
    
    setTimeout(() => {
      addLog('ESTABLISHING SECURE API TUNNEL...', 'info');
    }, 600);

    setTimeout(() => {
      const balance = institution === 'Morgan Stanley' ? 3850000 : 1650000;
      setPlaidStatus('verified');
      setPlaidBalance(balance);
      setPlaidInstitution(institution);
      addLog(`PLAID VERIFIED: INSTITUTION=${institution} // BALANCE=$${balance.toLocaleString()}`, 'success');
    }, 2000);
  };

  // POF Upload Simulation
  const handlePofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPofUploading(true);
      setPofProgress(0);
      addLog(`UPLOADING DRY-POWDER PROOF OF FUNDS: ${file.name}`, 'info');

      const interval = setInterval(() => {
        setPofProgress((old) => {
          if (old >= 100) {
            clearInterval(interval);
            return 100;
          }
          return old + 20;
        });
      }, 250);

      setTimeout(() => {
        setPofFile({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          amount: plaidBalance > 0 ? plaidBalance + 500000 : 2500000,
        });
        setPofUploading(false);
        addLog(`ASSET BALANCE DOCUMENTATION ARCHIVED. AUDIT PASS.`, 'success');
      }, 1500);
    }
  };

  // Track NDA read completion
  const handleNdaScroll = () => {
    const el = ndaContainerRef.current;
    if (el) {
      const threshold = 15;
      const reachedBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      if (reachedBottom && !scrolledToBottom) {
        setScrolledToBottom(true);
        addLog('NDA DOCUMENTATION FULLY READ. SIGNATURE TRACK LOCK ENABLED.', 'info');
      }
    }
  };

  // Sign NDA
  const handleSignNda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName || !hasCheckedTerms || !scrolledToBottom) return;

    setIsNdaSubmitted(true);
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    setNdaSignatureDate(dateStr);
    addLog(`NDA DIGITAL SIGNATURE APPLIED: IP_STAMP=192.168.1.104 // BY=${signerName}`, 'success');
  };

  // Programmatic Key Generation Process
  const handleGenerateAccessToken = () => {
    setIsGeneratingToken(true);
    addLog('COMPILING SECURE CRYPTOGRAPHIC TOKEN...', 'info');
    
    setTimeout(() => { addLog('VERIFYING PlAID KYC COMPLIANCE CHECKS...', 'info'); }, 600);
    setTimeout(() => { addLog('COMPILING DIGITAL SIGNATURE CERTIFICATE...', 'info'); }, 1200);
    setTimeout(() => { addLog('GENERATING ACCESS RIGHTS ON THE SHADOW-LEDGER...', 'info'); }, 1800);

    setTimeout(() => {
      const token = `AQM-PASSPORT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setAccessToken(token);
      setIsGeneratingToken(false);
      addLog(`TERMINAL ACCESS TOKEN DEPLOYED: ${token}`, 'success');
    }, 2400);
  };

  // Copy token helper
  const copyToClipboard = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      setCopiedToken(true);
      addLog('TOKEN COPIED TO LOCAL CLIPBOARD', 'info');
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  // Simulated unblinded listings unlocked by token
  const unblindedCims: SimulatedCim[] = [
    {
      id: 'DL-8902',
      codename: 'Project Delta',
      industry: 'B2B Logistics Agency',
      askingPrice: '$1,800,000',
      ebitda: '$620,000',
      confidentialDetails: 'UNBLINDED LEGAL ENTITY: Nexus Logistics Solutions LLC. Headquartered in Savannah, Georgia. Key customer account (35%) is confirmed as Georgia-Pacific with a contract active through Q4 2028.'
    },
    {
      id: 'DL-4411',
      codename: 'Project Cobalt',
      industry: 'HVAC & Air Treatment Systems',
      askingPrice: '$3,200,000',
      ebitda: '$950,000',
      confidentialDetails: 'UNBLINDED LEGAL ENTITY: Tri-County Industrial Thermal Services. Dallas-Fort Worth main maintenance facilities fully included under deed. Primary recurring accounts cover 42 distribution centers.'
    },
    {
      id: 'DL-5520',
      codename: 'Project Cipher',
      industry: 'SaaS Property Management Suite',
      askingPrice: '$1,600,000',
      ebitda: '$420,000',
      confidentialDetails: 'UNBLINDED LEGAL ENTITY: KeyGate Technologies Inc. Registered in Delaware. Sole IP includes proprietary smart-lock firmware integration protocols.'
    }
  ];

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono min-h-screen border border-[#222222] p-4 md:p-8 flex flex-col gap-8 relative select-none">
      
      {/* Visual Scanline Effect overlay */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient(rgba(10,10,10,0.8)_15%,_transparent_80%)" />

      {/* HEADER SECTION */}
      <div className="border-b border-[#222222] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#0EA5E9]">SECURE ONBOARDING TERMINAL v2.84</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight uppercase mt-1">
            VERIFIED BUYER <span className="text-[#00FF66]">PASSPORT</span> & GATEWAY
          </h1>
        </div>
        <div className="text-right flex flex-col gap-1 items-end">
          <span className="text-[10px] px-2.5 py-1 bg-[#111111] border border-[#222222] text-[#888888] uppercase">
            STATUS: <span className={accessToken ? 'text-[#00FF66] font-bold' : 'text-[#FF3333]'}>{accessToken ? 'SECURED // PRIVILEGED ACCESS' : 'PENDING CREDENTIALING'}</span>
          </span>
          {accessToken && (
            <span className="text-[9px] text-[#00FF66] animate-pulse">CRYPTOGRAPHIC SESSION SECURED</span>
          )}
        </div>
      </div>

      {/* CORE GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

        {/* LEFT COLUMN: CRITERIA SUB-TASKS (Col: 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* STEP 1: PLAID LIQUIDITY INTEGRATION */}
          <div className={`border p-5 bg-[#0a0a0a] transition-all duration-300 ${plaidStatus === 'verified' ? 'border-[#00FF66]/40' : 'border-[#222222] hover:border-[#0EA5E9]/50'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] text-[#888888] uppercase block">// STEP 01</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F9F9F9]">LIQUIDITY VERIFICATION VIA PLAID</h2>
              </div>
              <span className={`text-[10px] px-2 py-0.5 font-bold border ${plaidStatus === 'verified' ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66]' : plaidStatus === 'syncing' ? 'bg-[#0EA5E9]/10 border-[#0EA5E9] text-[#0EA5E9]' : 'bg-[#111111] border-[#222222] text-[#888888]'}`}>
                {plaidStatus === 'verified' ? 'CONNECTED' : plaidStatus === 'syncing' ? 'CONNECTING...' : 'DISCONNECTED'}
              </span>
            </div>

            {plaidStatus === 'unlinked' && (
              <div className="space-y-4">
                <p className="text-xs text-[#888888] leading-relaxed">
                  Connect mock liquidity index securely to instantly bypass manual document auditing times. We require a minimum of $500,000 in active cash/equivalent reserve positions.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleConnectPlaid('Morgan Stanley Private Reserve')}
                    className="border border-[#222222] bg-[#111111] text-[#F9F9F9] text-xs py-2.5 px-4 uppercase hover:border-[#00FF66] hover:text-[#00FF66] transition-all flex items-center justify-center gap-2"
                  >
                    <span>🏦 Connect Morgan Stanley</span>
                  </button>
                  <button
                    onClick={() => handleConnectPlaid('Fidelity Asset Management')}
                    className="border border-[#222222] bg-[#111111] text-[#F9F9F9] text-xs py-2.5 px-4 uppercase hover:border-[#00FF66] hover:text-[#00FF66] transition-all flex items-center justify-center gap-2"
                  >
                    <span>💼 Connect Fidelity Hub</span>
                  </button>
                </div>
              </div>
            )}

            {plaidStatus === 'syncing' && (
              <div className="py-6 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-t-[#00FF66] border-[#222222] rounded-full animate-spin"></div>
                <span className="text-[10px] uppercase text-[#0EA5E9] tracking-widest animate-pulse">Syncing Secure Plaid Credentials...</span>
              </div>
            )}

            {plaidStatus === 'verified' && (
              <div className="bg-[#111111] border border-[#222222] p-4 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase block">INSTITUTION FEED:</span>
                  <span className="text-xs font-bold text-[#F9F9F9] uppercase">{plaidInstitution}</span>
                </div>
                <div className="space-y-1 text-right md:text-right text-left">
                  <span className="text-[10px] text-[#888888] uppercase block">AUDITED CAPITAL RESERVES:</span>
                  <span className="text-sm font-bold text-[#00FF66]">${plaidBalance.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: PROOF OF FUNDS (POF) ATTACHMENT */}
          <div className={`border p-5 bg-[#0a0a0a] transition-all duration-300 ${pofFile ? 'border-[#00FF66]/40' : 'border-[#222222] hover:border-[#0EA5E9]/50'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] text-[#888888] uppercase block">// STEP 02</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F9F9F9]">DRY-POWDER CERTIFICATION</h2>
              </div>
              <span className={`text-[10px] px-2 py-0.5 font-bold border ${pofFile ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66]' : 'bg-[#111111] border-[#222222] text-[#888888]'}`}>
                {pofFile ? 'VERIFIED' : 'AWAITING DOCS'}
              </span>
            </div>

            <p className="text-xs text-[#888888] leading-relaxed mb-4">
              If Plaid fails to fetch complete wealth segments, submit a validated bank letter, CPA certification, or active term sheet representation.
            </p>

            {/* Drag & Drop Simulation Panel */}
            {!pofFile && !pofUploading && (
              <div className="border border-dashed border-[#222222] hover:border-[#0EA5E9] bg-[#111111] p-6 text-center transition-colors relative cursor-pointer group">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePofUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <svg className="w-8 h-8 text-[#888888] group-hover:text-[#0EA5E9] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-xs text-[#F9F9F9] block group-hover:text-[#0EA5E9]">Click to browse or drop certified statement (PDF)</span>
                <span className="text-[10px] text-[#888888] mt-1 block">Maximum size limit: 15MB</span>
              </div>
            )}

            {/* Upload Loader */}
            {pofUploading && (
              <div className="border border-[#222222] bg-[#111111] p-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#888888] uppercase">Uploading Document...</span>
                  <span className="text-[#0EA5E9] font-bold">{pofProgress}%</span>
                </div>
                <div className="w-full bg-[#050505] h-1.5 border border-[#222222]">
                  <div className="bg-[#0EA5E9] h-full transition-all duration-300" style={{ width: `${pofProgress}%` }}></div>
                </div>
              </div>
            )}

            {/* Successfully Uploaded State */}
            {pofFile && (
              <div className="bg-[#111111] border border-[#222222] p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-10 border border-[#00FF66] bg-[#050505] text-[#00FF66] text-[8px] flex items-center justify-center font-bold">
                    PDF
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#F9F9F9] block uppercase truncate max-w-[200px]">{pofFile.name}</span>
                    <span className="text-[10px] text-[#888888] uppercase">{pofFile.size} // AUDITED SUCCESSFULLY</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPofFile(null);
                    addLog('POF DOCUMENT ARCHIVE CLEARED BY USER REQUEST.', 'warn');
                  }}
                  className="text-xs text-[#FF3333] hover:underline uppercase"
                >
                  [DELETE]
                </button>
              </div>
            )}
          </div>

          {/* STEP 3: PROGRAMMATIC PROGRAMMATIC NDA SIGNATURE */}
          <div className={`border p-5 bg-[#0a0a0a] transition-all duration-300 ${isNdaSubmitted ? 'border-[#00FF66]/40' : 'border-[#222222] hover:border-[#0EA5E9]/50'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] text-[#888888] uppercase block">// STEP 03</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F9F9F9]">GLOBAL MUTUAL NON-DISCLOSURE PROTOCOL (MNDA)</h2>
              </div>
              <span className={`text-[10px] px-2 py-0.5 font-bold border ${isNdaSubmitted ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66]' : 'bg-[#111111] border-[#222222] text-[#888888]'}`}>
                {isNdaSubmitted ? 'SIGNED' : 'AWAITING SIGNATURE'}
              </span>
            </div>

            {/* NDA Viewer Box */}
            <div className="border border-[#222222] bg-[#050505] p-4 mb-4">
              <div
                ref={ndaContainerRef}
                onScroll={handleNdaScroll}
                className="max-h-[160px] overflow-y-auto text-[11px] leading-relaxed text-[#888888] space-y-3 pr-2"
              >
                <p className="text-xs text-[#F9F9F9] font-bold uppercase tracking-wider">
                  MUTUAL NON-DISCLOSURE AGREEMENT — SECTION 1.0 (PROPRIETARY DATA SHIELD)
                </p>
                <p>
                  This Mutual Non-Disclosure Agreement is entered into by and between the verified user of the AcquireMeta Platform ("Recipient" or "Searcher") and Moonshine Capital / AcquireMeta ("Disclosing Party") to govern the exchange of non-public confidential information.
                </p>
                <p>
                  1. <strong>Definition of Confidential Information.</strong> Confidential Information shall refer to any and all financial projections, operational strategies, unblinded legal entity names, supplier locations, customer contract lengths, and structural models compiled within Confidential Information Memorandums (CIMs).
                </p>
                <p>
                  2. <strong>Protection of Information.</strong> Recipient agrees to hold and maintain the Confidential Information in the strictest confidence. Such information shall not be duplicated, broadcasted, shared with third-party brokers, or used to bypass or disintermediate the seller or brokers representing target listing assets.
                </p>
                <p>
                  3. <strong>Programmatic Tracking & Penalties.</strong> Any unauthorized leak or download of unblinded company assets tracked through specialized terminal access tokens will trigger automated security auditing alerts and subsequent liability procedures up to the statutory limit of $500,000 per violation.
                </p>
                <p className="text-[#00FF66] font-bold">
                  [REACH THE END OF AGREEMENT TO AUTHORIZE COMPLIANCE CONTROLS]
                </p>
              </div>
            </div>

            {/* Interactive Signature Panel */}
            {!isNdaSubmitted ? (
              <form onSubmit={handleSignNda} className="space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
                  <div className="flex-grow space-y-1.5">
                    <label className="text-[10px] text-[#888888] uppercase block">Legal Signatory Full Name:</label>
                    <input
                      type="text"
                      required
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="e.g. MARCUS DEVONSHIRE"
                      className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none text-xs text-[#F9F9F9] p-3 uppercase font-mono placeholder-[#888888]"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        disabled={!scrolledToBottom}
                        checked={hasCheckedTerms}
                        onChange={(e) => setHasCheckedTerms(e.target.checked)}
                        className="accent-[#00FF66] border-[#222222] bg-[#050505] w-4 h-4 rounded-none cursor-pointer"
                      />
                      <span className="text-[10px] text-[#888888] uppercase">
                        {scrolledToBottom ? 'I Accept Terms' : 'Scroll Down to Accept'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Hand-write style cursive preview box */}
                {signerName && (
                  <div className="border border-[#222222] bg-[#111111]/30 p-3 flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[8px] text-[#888888] uppercase block">CRIMSON-SHIELD SIGNATURE PREVIEW:</span>
                      <span className="font-serif italic text-base text-[#00FF66] tracking-wide">
                        {signerName}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#888888]">DIGITAL HASH VERIFIED</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!scrolledToBottom || !signerName || !hasCheckedTerms}
                  className={`w-full text-xs py-3 px-6 font-bold uppercase tracking-widest text-center transition-all border ${
                    scrolledToBottom && signerName && hasCheckedTerms
                      ? 'bg-[#00FF66] text-[#050505] border-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66]'
                      : 'bg-[#111111] text-[#888888] border-[#222222] cursor-not-allowed'
                  }`}
                >
                  EXECUTE PROGRAMMATIC NDA AGREEMENT
                </button>
              </form>
            ) : (
              <div className="bg-[#111111] border border-[#222222] p-4 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between text-xs gap-1">
                  <div>
                    <span className="text-[#888888] uppercase">SIGNATORY AUTH:</span>{' '}
                    <span className="text-[#F9F9F9] font-bold">{signerName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#888888] uppercase">TIMESTAMP:</span>{' '}
                    <span className="text-[#0EA5E9] font-bold">{ndaSignatureDate}</span>
                  </div>
                </div>
                <div className="text-[10px] text-[#00FF66] border-t border-[#222222]/60 pt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#00FF66] rounded-full"></span>
                  CONTRACT EXECUTED SECURELY ON METAVERSE COMPLIANCE LEDGER.
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: PASSPORT TELEMETRY & CIM DECRYPTER (Col: 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* REALTIME SYSTEM DIAGNOSTICS LOG */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// COMPLIANCE DIAG-LOGGER</span>
              <span className="text-[9px] text-[#00FF66] animate-pulse">[SECURE STACK]</span>
            </div>
            <div className="bg-[#050505] border border-[#222222] p-3 text-[10px] space-y-2 h-[120px] overflow-y-auto font-mono scrollbar-none">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-[#888888]">{log.timestamp}</span>
                  <span
                    className={
                      log.type === 'success'
                        ? 'text-[#00FF66]'
                        : log.type === 'warn'
                        ? 'text-[#FF3333]'
                        : 'text-[#0EA5E9]'
                    }
                  >
                    [{log.type.toUpperCase()}] {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TOKEN GENERATOR PANEL */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-[#888888] uppercase block">// SECURITY HUB</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#F9F9F9]">GATEWAY CREDENTIAL ENVELOPE</h3>
              </div>
            </div>

            <p className="text-xs text-[#888888] leading-relaxed">
              Once you have successfully linked your capital reserves (Plaid or manual POF) and executed the programmatic NDA, the terminal will authorize cryptographic token generation.
            </p>

            {/* Progress Status Bar */}
            <div className="space-y-2 bg-[#111111] p-4 border border-[#222222]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#888888] uppercase">Onboarding Checklist:</span>
                <span className="text-xs font-bold text-[#F9F9F9]">
                  {[plaidStatus === 'verified' || pofFile, isNdaSubmitted].filter(Boolean).length} / 2 Complete
                </span>
              </div>
              <div className="flex gap-1">
                <div className={`h-1.5 flex-1 ${plaidStatus === 'verified' || pofFile ? 'bg-[#00FF66]' : 'bg-[#222222]'}`}></div>
                <div className={`h-1.5 flex-1 ${isNdaSubmitted ? 'bg-[#00FF66]' : 'bg-[#222222]'}`}></div>
              </div>
            </div>

            {/* Token Action Button */}
            {!accessToken ? (
              <button
                disabled={!( (plaidStatus === 'verified' || pofFile) && isNdaSubmitted) || isGeneratingToken}
                onClick={handleGenerateAccessToken}
                className={`w-full py-4 px-6 text-xs font-bold uppercase tracking-widest text-center border transition-all duration-200 ${
                  (plaidStatus === 'verified' || pofFile) && isNdaSubmitted && !isGeneratingToken
                    ? 'bg-[#0EA5E9] text-[#050505] border-[#0EA5E9] hover:bg-[#050505] hover:text-[#0EA5E9] hover:shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]'
                    : 'bg-[#111111] text-[#888888] border-[#222222] cursor-not-allowed'
                }`}
              >
                {isGeneratingToken ? 'GENERATING SECURE TOKEN...' : 'COMPILE TERMINAL ACCESS TOKEN'}
              </button>
            ) : (
              <div className="border border-[#00FF66]/30 bg-[#00FF66]/5 p-4 space-y-4">
                <div>
                  <span className="text-[9px] text-[#00FF66] uppercase block font-bold">// SECURE ACCESS GRANTED</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-[#F9F9F9] bg-[#050505] border border-[#222222] p-2.5 flex-grow font-mono text-center tracking-wider">
                      {accessToken}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="border border-[#222222] bg-[#111111] hover:border-[#00FF66] hover:text-[#00FF66] p-2.5 text-xs uppercase text-[#888888] transition-colors"
                      title="Copy Key"
                    >
                      {copiedToken ? '✓' : 'COPY'}
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-[#888888] leading-relaxed">
                  Your cryptographic session remains active for 24 hours. Use this token to execute immediate unblinding queries on target CIM documents below.
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC CIM DECRYPTER SECTION */}
          {accessToken && (
            <div className="border border-[#00FF66]/40 bg-[#0a0a0a] p-5 flex flex-col gap-4 animate-fade-in">
              <div>
                <span className="text-[10px] text-[#00FF66] uppercase block font-bold">// PRIVILEGED PORTAL DETECTED</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#F9F9F9]">UNBLINDED ASSET DECRYPTER</h3>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-[#888888] uppercase block">Select Target CIM to Unblind:</span>
                <div className="grid grid-cols-1 gap-2">
                  {unblindedCims.map((cim) => (
                    <button
                      key={cim.id}
                      onClick={() => setSelectedCim(cim.id === selectedCim ? null : cim.id)}
                      className={`text-left p-3 border transition-all text-xs flex justify-between items-center ${
                        selectedCim === cim.id
                          ? 'border-[#00FF66] bg-[#111111] text-[#00FF66]'
                          : 'border-[#222222] hover:border-[#0EA5E9] bg-[#050505]'
                      }`}
                    >
                      <div>
                        <span className="font-bold uppercase tracking-wider block">{cim.codename}</span>
                        <span className="text-[10px] text-[#888888] uppercase">{cim.industry}</span>
                      </div>
                      <span className="text-[10px] text-[#888888]">
                        {selectedCim === cim.id ? '[-] COLLAPSE' : '[+] UNMASK'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Decrypted Details Modal/Box inside container */}
              {selectedCim && (
                <div className="border border-[#00FF66] bg-[#050505] p-4 space-y-3 animate-pulse">
                  <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                    <span className="text-[10px] text-[#00FF66] uppercase font-bold">DECRYPTING LEGAL DATA ENVELOPE...</span>
                    <span className="text-[9px] text-[#888888]">KEY: PROXIMAL APPROVED</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[#888888] uppercase">UNMASKED ENTITY:</span>{' '}
                      <p className="text-[#F9F9F9] leading-relaxed mt-1 bg-[#111111] p-3 border border-[#222222]">
                        {unblindedCims.find((c) => c.id === selectedCim)?.confidentialDetails}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* SECURE PLAIDS LOGOS / COMPLIANCE FOOTER */}
      <div className="border-t border-[#222222] pt-6 mt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-[#888888]">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5 border border-[#222222] px-2 py-1 bg-[#111111]">
            <span className="w-1.5 h-1.5 bg-[#00FF66] rounded-full"></span>
            <span>SECURE KYC CERTIFIED</span>
          </div>
          <div className="flex items-center gap-1.5 border border-[#222222] px-2 py-1 bg-[#111111]">
            <span className="w-1.5 h-1.5 bg-[#0EA5E9] rounded-full"></span>
            <span>SHADOW-LEDGER SYNCHRONIZED</span>
          </div>
        </div>
        <div>
          <span>RE-AUTH TIMELIMIT PROXIMA: 23h 59m 59s</span>
        </div>
      </div>

    </div>
  );
}