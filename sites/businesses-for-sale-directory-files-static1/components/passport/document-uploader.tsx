import React, { useState, useEffect, useRef } from 'react';

export default function VerifiedBuyerPassport() {
  // Verification States
  const [plaidState, setPlaidState] = useState<'idle' | 'linking' | 'connected'>('idle');
  const [mockBalance, setMockBalance] = useState<number | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>('');
  
  const [pofState, setPofState] = useState<'idle' | 'uploading' | 'verified'>('idle');
  const [pofFileName, setPofFileName] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [signerName, setSignerName] = useState<string>('');
  const [ndaAgreed, setNdaAgreed] = useState<boolean>(false);
  const [ndaSigned, setNdaSigned] = useState<boolean>(false);

  // Terminal Authorization Flow States
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<number>(0);
  const [authLogs, setAuthLogs] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const banks = [
    { name: 'SVB Private / First Republic Deck', minBal: 1250000 },
    { name: 'Chase Private Client Terminal', minBal: 3500000 },
    { name: 'Morgan Stanley Wealth Node', minBal: 5000000 },
    { name: 'Brex Treasury Endpoint', minBal: 850000 }
  ];

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [authLogs]);

  // Connect Plaid simulation
  const handlePlaidConnect = (bankName: string, balance: number) => {
    setPlaidState('linking');
    setSelectedBank(bankName);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setPlaidState('connected');
        setMockBalance(balance);
      }
    }, 150);
  };

  // Simulating POF Document scan
  const handlePofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPofFileName(file.name);
      setPofState('uploading');
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPofState('verified');
            return 100;
          }
          return prev + 20;
        });
      }, 200);
    }
  };

  const handleSignNda = (e: React.FormEvent) => {
    e.preventDefault();
    if (signerName.trim().length > 2 && ndaAgreed) {
      setNdaSigned(true);
    }
  };

  // Cryptographic Access Code Generator
  const runTokenGeneration = () => {
    if (plaidState !== 'connected' || pofState !== 'verified' || !ndaSigned) return;

    setIsAuthorizing(true);
    setAuthStep(0);
    setAuthLogs([]);

    const simulationLogs = [
      '>> CONNECTING TO ACQUIRE_META GLOBAL LEDGER...',
      '>> PINGING INSTITUTIONAL NODE: ' + selectedBank.toUpperCase(),
      `>> ASSERTING LIQUID ASSETS: $${mockBalance?.toLocaleString()} USD [STATUS: AUTHENTICATED]`,
      '>> SCRUBBING METADATA FOR POF DOCUMENT: ' + pofFileName.toUpperCase(),
      '>> CRYPTOGRAPHIC SIGNATURE MATCHED FOR DELEGATE: ' + signerName.toUpperCase(),
      '>> EXECUTING HEURISTIC RISK & COMPLIANCE ASSESSMENT...',
      '>> ZERO-KNOWLEDGE PROOF INJECTED SUCCESSFULLY.',
      '>> ISSUING CRYPTOGRAPHIC PASSPORT TOKEN [LEVEL-4]...',
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < simulationLogs.length) {
        setAuthLogs((prev) => [...prev, simulationLogs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        // Generate Token
        const randomHex = Array.from({ length: 5 }, () =>
          Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0')
        ).join('-');
        setAccessToken(`AQM-TK-${randomHex}-L4`);
        setIsAuthorizing(false);
      }
    }, 600);
  };

  const isFormComplete = plaidState === 'connected' && pofState === 'verified' && ndaSigned;

  return (
    <div className="bg-[#050505] text-[#F9F9F9] border border-[#222222] font-mono p-4 md:p-8 max-w-5xl mx-auto my-6 relative overflow-hidden">
      {/* Decorative Scanner Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF66] opacity-30 animate-pulse"></div>

      {/* Header */}
      <div className="border-b border-[#222222] pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00FF66] text-xs font-bold uppercase tracking-widest mb-1">
            <span className="w-2 h-2 bg-[#00FF66] animate-ping inline-block rounded-full"></span>
            COMPLIANCE PORTAL // ACCESS SECURITY SECURE_LINE
          </div>
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-[#F9F9F9]">
            Verified Buyer Passport & NDA Gateway
          </h1>
        </div>
        <div className="text-right">
          <span className="text-[10px] px-2 py-1 border border-[#222222] bg-[#111111] text-[#888888]">
            SECURITY CLEARANCE: <span className="text-[#0EA5E9]">L4 UNRESTRICTED</span>
          </span>
        </div>
      </div>

      {/* Gateway Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left Columns - Interactive Inputs */}
        <div className="lg:col-span-8 space-y-6">

          {/* Step 1: Plaid Simulation */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-5 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">
                [STEP 01] Link Verified Capital Accounts
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                plaidState === 'connected' ? 'border-[#00FF66] text-[#00FF66] bg-[#00ff66]/5' : 'border-[#222222] text-[#888888]'
              }`}>
                {plaidState === 'connected' ? '● VERIFIED' : '○ DISCONNECTED'}
              </span>
            </div>

            {plaidState === 'idle' && (
              <div className="space-y-4">
                <p className="text-xs text-[#888888] leading-relaxed">
                  Establish live structural validation of unencumbered dry-powder funds through secure zero-knowledge asset verification API. Select a target liquidity threshold vault:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {banks.map((bank) => (
                    <button
                      key={bank.name}
                      onClick={() => handlePlaidConnect(bank.name, bank.minBal)}
                      className="border border-[#222222] bg-[#050505] p-3 text-left hover:border-[#00FF66] transition-all duration-150 group"
                    >
                      <div className="text-xs font-bold group-hover:text-[#00FF66] transition-colors">{bank.name}</div>
                      <div className="text-[10px] text-[#888888] mt-1">Est. Liquidity: ${bank.minBal.toLocaleString()}+</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {plaidState === 'linking' && (
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-2 border-t-[#00FF66] border-[#222222] rounded-full animate-spin"></div>
                <span className="text-xs text-[#00FF66] tracking-widest uppercase animate-pulse">
                  Querying Encrypted API Ledger...
                </span>
              </div>
            )}

            {plaidState === 'connected' && (
              <div className="bg-[#111111]/40 border border-[#00FF66]/20 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] text-[#888888] block">CONNECTED INSTITUTION</span>
                  <span className="text-xs text-[#F9F9F9] font-bold uppercase">{selectedBank}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] text-[#888888] block">VERIFIED BALANCE CAPACITY</span>
                  <span className="text-sm text-[#00FF66] font-bold">
                    ${mockBalance?.toLocaleString()} USD
                  </span>
                </div>
                <button
                  onClick={() => { setPlaidState('idle'); setMockBalance(null); }}
                  className="text-[9px] text-[#FF3333] border border-[#FF3333]/30 px-2 py-1 hover:bg-[#FF3333]/10"
                >
                  DISCONNECT
                </button>
              </div>
            )}
          </div>

          {/* Step 2: POF Upload */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-5 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">
                [STEP 02] Upload Proof of Funds (POF) Dossier
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                pofState === 'verified' ? 'border-[#00FF66] text-[#00FF66] bg-[#00ff66]/5' : 'border-[#222222] text-[#888888]'
              }`}>
                {pofState === 'verified' ? '● VERIFIED' : '○ PENDING FILE'}
              </span>
            </div>

            {pofState === 'idle' && (
              <div className="border border-dashed border-[#222222] p-6 text-center hover:border-[#0EA5E9] transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg"
                  onChange={handlePofUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <svg className="w-8 h-8 mx-auto text-[#888888] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs text-[#F9F9F9] font-bold block mb-1">DRAG & DROP SECURE DOCUMENT</span>
                <span className="text-[10px] text-[#888888] block">PDF, PNG, JPG accepted (Max 25MB)</span>
              </div>
            )}

            {pofState === 'uploading' && (
              <div className="space-y-3 py-4">
                <div className="flex justify-between text-xs text-[#888888]">
                  <span>Analyzing document integrity...</span>
                  <span className="text-[#00FF66]">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#111111] h-1.5 overflow-hidden border border-[#222222]">
                  <div className="bg-[#00FF66] h-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            {pofState === 'verified' && (
              <div className="bg-[#111111]/40 border border-[#00FF66]/20 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-[#222222] bg-[#050505]">
                    <svg className="w-6 h-6 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#888888] block">SECURE CLOUD FILE</span>
                    <span className="text-xs text-[#F9F9F9] font-bold break-all">{pofFileName}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setPofState('idle'); setPofFileName(''); }}
                  className="text-[9px] text-[#FF3333] border border-[#FF3333]/30 px-2 py-1 hover:bg-[#FF3333]/10"
                >
                  REMOVE
                </button>
              </div>
            )}
          </div>

          {/* Step 3: Global Programmatic NDA */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-5 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">
                [STEP 03] Execution of Global Platform-wide NDA
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                ndaSigned ? 'border-[#00FF66] text-[#00FF66] bg-[#00ff66]/5' : 'border-[#222222] text-[#888888]'
              }`}>
                {ndaSigned ? '● EXECUTED' : '○ NOT SIGNED'}
              </span>
            </div>

            <div className="space-y-4">
              {/* Terms Console Window */}
              <div className="h-28 border border-[#222222] bg-[#050505] p-3 overflow-y-auto text-[10px] text-[#888888] leading-relaxed space-y-2 select-none">
                <p className="font-bold text-[#F9F9F9]">SECTION 1.0: DEFINITION OF CONFIDENTIAL DATA</p>
                <p>
                  All proprietary information, codenames, localized financials, client listings, vendor identities, and system logic disclosed on the AcquireMeta Terminal represent trade secrets. Receiver pledges not to bypass, circumvent, or target unblinded operations.
                </p>
                <p className="font-bold text-[#F9F9F9]">SECTION 2.0: ENFORCEMENT & COMPLIANCE</p>
                <p>
                  Any unauthorized duplication or dissemination triggers localized liquidation damages amounting to $250,000 per structural breach event under international jurisdiction frameworks.
                </p>
              </div>

              {!ndaSigned ? (
                <form onSubmit={handleSignNda} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-[#888888] block mb-1">FULL LEGAL SIGNATURE</label>
                      <input
                        type="text"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="Type Legal Representative Name"
                        className="w-full bg-[#050505] border border-[#222222] text-xs p-3 text-white focus:border-[#00FF66] focus:outline-none uppercase"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-start gap-2 text-[10px] text-[#888888] cursor-pointer select-none pb-2">
                        <input
                          type="checkbox"
                          checked={ndaAgreed}
                          onChange={(e) => setNdaAgreed(e.target.checked)}
                          className="mt-0.5 accent-[#00FF66] rounded border-[#222222] bg-black"
                          required
                        />
                        <span>
                          I agree to standard digital signature mechanics & programmatic compliance binding.
                        </span>
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!signerName.trim() || !ndaAgreed}
                    className="w-full py-2.5 text-xs font-bold border border-[#00FF66] text-[#00FF66] bg-[#00ff66]/5 hover:bg-[#00FF66] hover:text-black transition-all duration-200 uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Lock Digital Execution Signal
                  </button>
                </form>
              ) : (
                <div className="bg-[#111111]/40 border border-[#00FF66]/20 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <span className="text-[10px] text-[#888888] block">LEGAL CO-SIGNER</span>
                    <span className="text-xs text-[#F9F9F9] font-bold uppercase">{signerName}</span>
                  </div>
                  <div className="sm:text-right mt-2 sm:mt-0">
                    <span className="text-[10px] text-[#888888] block">TIMESTAMP RECORD</span>
                    <span className="text-xs text-[#00FF66] font-mono">DIGITAL_SIG_UTC_CONNECTED</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Columns - Diagnostics & Access Token Card */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          
          {/* Status Diagnostic Card */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-5 flex-grow flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider block mb-3">// PASSPORT PROGRESS</span>
              
              <ul className="space-y-3 text-[11px] mb-6">
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${plaidState === 'connected' ? 'bg-[#00FF66]' : 'bg-[#FF3333]'}`}></span>
                  <span className={plaidState === 'connected' ? 'text-[#F9F9F9]' : 'text-[#888888]'}>VERIFIED PLAID BALANCES</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${pofState === 'verified' ? 'bg-[#00FF66]' : 'bg-[#FF3333]'}`}></span>
                  <span className={pofState === 'verified' ? 'text-[#F9F9F9]' : 'text-[#888888]'}>DRY-POWDER POF ATTACHED</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${ndaSigned ? 'bg-[#00FF66]' : 'bg-[#FF3333]'}`}></span>
                  <span className={ndaSigned ? 'text-[#F9F9F9]' : 'text-[#888888]'}>GLOBAL PLATFORM NDA</span>
                </li>
              </ul>

              {/* Action Trigger */}
              <button
                onClick={runTokenGeneration}
                disabled={!isFormComplete || isAuthorizing || !!accessToken}
                className={`w-full text-xs font-bold py-4 text-center border uppercase tracking-widest transition-all duration-200 ${
                  isFormComplete && !accessToken
                    ? 'border-[#00FF66] text-[#00FF66] bg-[#00ff66]/10 hover:shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                    : 'border-[#222222] text-[#888888] bg-transparent cursor-not-allowed'
                }`}
              >
                {isAuthorizing ? 'DECRYPTING SECURE MATRIX...' : 'GENERATE ACCESS TOKEN'}
              </button>
            </div>

            {/* Simulated Logs Output */}
            {(authLogs.length > 0 || isAuthorizing) && (
              <div className="mt-4 border border-[#222222] bg-[#050505] p-3">
                <div className="flex justify-between text-[9px] text-[#888888] uppercase mb-2 border-b border-[#222222] pb-1">
                  <span>SYSTEM FEED LOGS</span>
                  <span className="text-[#00FF66] animate-pulse">SYNCING</span>
                </div>
                <div 
                  ref={logContainerRef}
                  className="h-28 overflow-y-auto text-[9px] text-[#00FF66] space-y-1 font-mono scrollbar-none"
                >
                  {authLogs.map((log, index) => (
                    <div key={index} className="leading-tight">{log}</div>
                  ))}
                  {isAuthorizing && (
                    <div className="animate-pulse">_</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Unlocked Token Node Card */}
          {accessToken && (
            <div className="border border-[#00FF66] bg-[#00FF66]/5 p-5 relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 right-0 text-[8px] bg-[#00FF66] text-black px-1.5 font-bold uppercase tracking-wider">
                COMPLIANCE PASSED
              </div>
              <span className="text-[10px] text-[#00FF66] font-bold block mb-1">
                ★ TERMINAL ACCESS TOKEN
              </span>
              <p className="text-[10px] text-[#888888] mb-3 leading-relaxed">
                Copy and save this cryptographic verification token to instantly unlock unblinded CIM details.
              </p>
              <div className="bg-black border border-[#222222] p-3 select-all text-xs text-[#F9F9F9] font-bold font-mono tracking-wider break-all text-center">
                {accessToken}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Disclaimers */}
      <div className="border-t border-[#222222] pt-4 text-[9px] text-[#888888] flex flex-col sm:flex-row justify-between items-center gap-3">
        <span>*Platfom NDAs apply programmatically across all integrated and future transactions.</span>
        <span className="text-[#0EA5E9]">SECURE END-TO-END PLAIN-DATA MATRIX</span>
      </div>
    </div>
  );
}