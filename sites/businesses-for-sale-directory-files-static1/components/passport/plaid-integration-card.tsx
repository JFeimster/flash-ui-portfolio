import React, { useState, useEffect, useRef } from 'react';

// Live Terminal Logging Helper
interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'system';
}

export default function PlaidIntegrationCard() {
  // Workflow States: 'CONNECT_BANK' | 'UPLOAD_POF' | 'SIGN_NDA' | 'ACCESS_GRANTED'
  const [activeStep, setActiveStep] = useState<'CONNECT_BANK' | 'UPLOAD_POF' | 'SIGN_NDA' | 'ACCESS_GRANTED'>('CONNECT_BANK');
  
  // Plaid States
  const [isConnected, setIsConnected] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [verifiedBalance, setVerifiedBalance] = useState<number>(0);
  const [isLinking, setIsLinking] = useState(false);

  // POF States
  const [pofUploaded, setPofUploaded] = useState(false);
  const [pofFileName, setPofFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [pofAmount, setPofAmount] = useState<string>('1500000'); // Default $1.5M

  // NDA States
  const [signerName, setSignerName] = useState('');
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureHash, setSignatureHash] = useState('');

  // Terminal Token Access States
  const [decryptionToken, setDecryptionToken] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Log Stream State
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '14:02:01', message: 'SYSTEM CORE INIT // PASSPORT GATEWAY SECURED', type: 'system' },
    { timestamp: '14:02:03', message: 'Awaiting buyer credential handshakes...', type: 'info' }
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of terminal console
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'system' = 'info') => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { timestamp, message, type }]);
  };

  // Mock Action: Plaid Link Handshake
  const handlePlaidLink = (bank: string) => {
    if (!bank) {
      addLog('ERR: BANK SELECTION NULL // CHOOSE NODE GATEWAY', 'warn');
      return;
    }
    setIsLinking(true);
    setSelectedBank(bank);
    addLog(`INITIALIZING PLAID PROTOCOL FOR [${bank.toUpperCase()}]`, 'info');
    
    setTimeout(() => {
      const mockBalance = bank === 'Silicon Valley Private' ? 3450000 : bank === 'Apex Clearing' ? 1820000 : 950000;
      setIsConnected(true);
      setVerifiedBalance(mockBalance);
      setIsLinking(false);
      addLog(`PLAID API: SECURE API CONNECTED TO ${bank.toUpperCase()}`, 'success');
      addLog(`AUDITED VERIFIED BALANCE: $${mockBalance.toLocaleString()} USD`, 'success');
      setActiveStep('UPLOAD_POF');
    }, 1800);
  };

  // Mock Action: POF Document Analysis
  const handlePOFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setPofFileName(file.name);
    addLog(`PROCESSING CRYPTOGRAPHIC METADATA FOR: ${file.name.toUpperCase()}`, 'info');

    setTimeout(() => {
      setPofUploaded(true);
      setIsUploading(false);
      addLog(`DRY POWDER PROOF OF FUNDS VERIFIED: $${parseInt(pofAmount).toLocaleString()}`, 'success');
      addLog(`CHECKSUM SIGNATURE RECORDED: MD5-${Math.random().toString(16).substring(2, 10).toUpperCase()}`, 'system');
      setActiveStep('SIGN_NDA');
    }, 2000);
  };

  // Mock Action: Programmatic NDA Signature
  const handleSignNDA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) {
      addLog('NDA VALIDATION FAILURE: SIGNER DECLARATION REQUIRED', 'warn');
      return;
    }
    if (!ndaAccepted) {
      addLog('NDA VALIDATION FAILURE: CLAUSE CONFIRMATION REQUIREMENT', 'warn');
      return;
    }

    setIsSigning(true);
    addLog(`COMPILING programMATIC NDA WITH SIGNATURE: ${signerName.toUpperCase()}`, 'info');

    setTimeout(() => {
      const hash = 'SHA256-' + Math.random().toString(36).substring(2, 15).toUpperCase() + Math.random().toString(36).substring(2, 15).toUpperCase();
      setSignatureHash(hash);
      setIsSigning(false);
      addLog(`NDA FULLY EXECUTED & SEALED // HASH ID: ${hash.substring(0, 16)}...`, 'success');
      setActiveStep('ACCESS_GRANTED');
      triggerTokenDecryption();
    }, 1500);
  };

  // Generate Token decryption visual
  const triggerTokenDecryption = () => {
    setIsDecrypting(true);
    addLog('DECRYPTING VERIFIED BUYER TERMINAL ACCESS TOKEN...', 'info');
    setTimeout(() => {
      const token = 'AQM-NET-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-2026';
      setDecryptionToken(token);
      setIsDecrypting(false);
      addLog(`GATEWAY KEY GENERATED: [${token}] // SYSTEM DECRYPT ENABLED`, 'success');
    }, 2500);
  };

  // Reset System Trigger
  const handleSystemReset = () => {
    setActiveStep('CONNECT_BANK');
    setIsConnected(false);
    setSelectedBank('');
    setVerifiedBalance(0);
    setPofUploaded(false);
    setPofFileName('');
    setSignerName('');
    setNdaAccepted(false);
    setSignatureHash('');
    setDecryptionToken('');
    setLogs([
      { timestamp: '14:02:01', message: 'SYSTEM RESET REQUESTED BY OPERATOR', type: 'warn' },
      { timestamp: '14:02:03', message: 'PASSPORT GATEWAY RE-INITIALIZED', type: 'system' }
    ]);
  };

  // Dynamic progress calculator
  const getProgressPercentage = () => {
    let score = 0;
    if (isConnected) score += 33;
    if (pofUploaded) score += 33;
    if (signatureHash) score += 34;
    return score;
  };

  return (
    <div className="font-mono text-[#F9F9F9] bg-[#050505] p-6 border border-[#222222] relative overflow-hidden max-w-6xl mx-auto my-8">
      
      {/* Decorative CRT Scanline & Grid Effect */}
      <div className="absolute inset-0 bg-radial-gradient(rgba(10,10,10,0.8)_15%,_transparent_80%) pointer-events-none z-0" />

      {/* Header Diagnostic Strip */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#222222] pb-4 mb-6 gap-2 z-10 relative">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#00FF66] animate-ping inline-block rounded-full"></span>
            <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[#F9F9F9]">
              BUYER PASSPORT VETTING & NDA MATRIX
            </h1>
          </div>
          <p className="text-[10px] text-[#888888] uppercase mt-1">
            VERIFIED LIQUIDITY HANDSHAKE // SECURE DECRYPT TOKEN PORTAL
          </p>
        </div>
        <div className="text-[10px] border border-[#222222] px-2 py-1 bg-[#111111] flex items-center space-x-2">
          <span className="text-[#888888]">SECURE GATEWAY NODE:</span>
          <span className="text-[#0EA5E9] font-bold">AQM-GATEWAY-TX-99</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT COLUMN: ACTIVE INTERACTIVE PORTAL STEPPERS */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          {/* Step Trackers */}
          <div className="grid grid-cols-4 gap-1 border-b border-[#222222] pb-4">
            {(['CONNECT_BANK', 'UPLOAD_POF', 'SIGN_NDA', 'ACCESS_GRANTED'] as const).map((step, idx) => {
              const titles = ['1. BANK LINK', '2. PROOF FUNDS', '3. DIGITAL NDA', '4. ACCESS CODE'];
              const isActive = activeStep === step;
              const isPast = 
                (step === 'CONNECT_BANK' && (isConnected || activeStep !== 'CONNECT_BANK')) ||
                (step === 'UPLOAD_POF' && (pofUploaded || (activeStep !== 'CONNECT_BANK' && activeStep !== 'UPLOAD_POF'))) ||
                (step === 'SIGN_NDA' && (signatureHash !== ''));
              
              return (
                <button
                  key={step}
                  disabled={step === 'ACCESS_GRANTED' && !signatureHash}
                  onClick={() => setActiveStep(step)}
                  className={`text-[9px] font-bold p-2 text-center border transition-all duration-150 ${
                    isActive 
                      ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5' 
                      : isPast 
                        ? 'border-[#0EA5E9] text-[#0EA5E9] bg-[#0EA5E9]/5' 
                        : 'border-[#222222] text-[#888888] hover:border-[#F9F9F9]/20'
                  }`}
                >
                  {titles[idx]}
                  {isPast && <span className="block text-[8px] text-[#00FF66]">✓ SECURED</span>}
                  {isActive && !isPast && <span className="block text-[8px] animate-pulse">■ PENDING</span>}
                  {!isActive && !isPast && <span className="block text-[8px]">□ LOCKED</span>}
                </button>
              );
            })}
          </div>

          {/* DYNAMIC CARD BODY BY STEP */}
          <div className="border border-[#222222] bg-[#0c0c0c] p-6 min-h-[380px] flex flex-col justify-between">
            
            {/* STEP 1: PLAID ACCOUNT LINK */}
            {activeStep === 'CONNECT_BANK' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#888888] uppercase tracking-widest">// SECURE LINK HANDSHAKE (PLAID)</span>
                  <span className="text-[10px] text-[#00FF66]">STEP 1 OF 3</span>
                </div>
                
                <p className="text-xs text-[#888888] leading-relaxed">
                  Connect liquid account balances programmatically via sandbox authentication to confirm dry powder capability without manual broker waitlines.
                </p>

                {isConnected ? (
                  <div className="border border-[#00FF66] bg-[#00FF66]/5 p-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#888888]">CONNECTED BANKING GATEWAY:</span>
                      <span className="text-[#00FF66] font-bold uppercase">{selectedBank}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#888888]">AUDITED LIQUID LIQUIDITY:</span>
                      <span className="text-[#F9F9F9] font-bold">${verifiedBalance.toLocaleString()} USD</span>
                    </div>
                    <div className="text-[10px] text-[#0EA5E9] border-t border-[#222222] pt-2">
                      Authentication confirmed via Plaid Developer Sandbox (Client Side).
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="block text-[10px] text-[#888888] uppercase mb-1">SELECT CORRIDOR GATEWAY BANK:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { name: 'Silicon Valley Private', detail: 'High Net Worth Tech Core' },
                        { name: 'Apex Clearing', detail: 'Brokerage & Fixed Assets' },
                        { name: 'Citadel Trust Network', detail: 'Offshore Sovereign Funds' }
                      ].map((bank) => (
                        <button
                          key={bank.name}
                          onClick={() => setSelectedBank(bank.name)}
                          className={`p-3 border text-left transition-all ${
                            selectedBank === bank.name 
                              ? 'border-[#0EA5E9] bg-[#0EA5E9]/5 text-[#0EA5E9]' 
                              : 'border-[#222222] bg-[#050505] hover:border-[#888888] text-xs'
                          }`}
                        >
                          <span className="block text-xs font-bold">{bank.name}</span>
                          <span className="block text-[8px] text-[#888888] mt-1">{bank.detail}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={isLinking || !selectedBank}
                      onClick={() => handlePlaidLink(selectedBank)}
                      className={`w-full text-center text-xs font-bold py-3 uppercase tracking-wider transition-all border ${
                        selectedBank
                          ? 'bg-[#00FF66] text-[#050505] border-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66]'
                          : 'bg-transparent text-[#888888] border-[#222222] cursor-not-allowed'
                      }`}
                    >
                      {isLinking ? 'ESTABLISHING HANDSHAKE PROTOCOLS...' : 'INITIATE PLAID SANDBOX LINK'}
                    </button>
                  </div>
                )}

                {isConnected && (
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setActiveStep('UPLOAD_POF')}
                      className="text-xs text-[#050505] bg-[#0EA5E9] border border-[#0EA5E9] hover:bg-transparent hover:text-[#0EA5E9] px-6 py-2.5 font-bold uppercase transition-all tracking-wider"
                    >
                      Proceed to Document Verification
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: PROOF OF FUNDS */}
            {activeStep === 'UPLOAD_POF' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#888888] uppercase tracking-widest">// PROOF OF FUNDS STATEMENT (POF)</span>
                  <span className="text-[10px] text-[#0EA5E9]">STEP 2 OF 3</span>
                </div>
                
                <p className="text-xs text-[#888888] leading-relaxed">
                  Supplement dynamic bank data feed by submitting an official POF statement. Required for structural compliance with broker advisory mandates.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-[#888888] uppercase mb-1">
                      EXPECTED INVESTMENT LEVEL DECLARATION (USD):
                    </label>
                    <select
                      value={pofAmount}
                      onChange={(e) => setPofAmount(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs p-3 focus:outline-none focus:border-[#00FF66]"
                    >
                      <option value="1500000">$1,500,000 Minimum Entry Limit</option>
                      <option value="3000000">$3,000,000 Medium Scale Allocation</option>
                      <option value="5000000">$5,000,000 Private Equity Limit</option>
                    </select>
                  </div>

                  <div className="border border-dashed border-[#222222] hover:border-[#0EA5E9] bg-[#050505] p-6 text-center transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg"
                      onChange={handlePOFUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    
                    <div className="space-y-2">
                      <svg className="w-8 h-8 text-[#888888] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {isUploading ? (
                        <p className="text-xs text-[#0EA5E9] animate-pulse font-bold">SHA-256 HASH VERIFICATION RUNNING...</p>
                      ) : pofUploaded ? (
                        <div className="space-y-1">
                          <p className="text-xs text-[#00FF66] font-bold">✓ DOCUMENT SECURED SUCCESSFULLY</p>
                          <p className="text-[10px] text-[#888888]">{pofFileName}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-[#F9F9F9] uppercase font-bold">DRAG & DROP SECURED FILE</p>
                          <p className="text-[9px] text-[#888888] mt-1">PDF, JPG, PNG (MAX 16MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {pofUploaded && (
                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={() => setActiveStep('CONNECT_BANK')}
                      className="text-xs text-[#888888] hover:text-[#F9F9F9] uppercase"
                    >
                      [← Back]
                    </button>
                    <button
                      onClick={() => setActiveStep('SIGN_NDA')}
                      className="text-xs text-[#050505] bg-[#00FF66] border border-[#00FF66] hover:bg-transparent hover:text-[#00FF66] px-6 py-2.5 font-bold uppercase transition-all tracking-wider"
                    >
                      Authorize Programmatic NDA
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: PROGRAMMATIC NDA SIGNING */}
            {activeStep === 'SIGN_NDA' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#888888] uppercase tracking-widest">// SECURED NON-DISCLOSURE PROTOCOL (NDA)</span>
                  <span className="text-[10px] text-[#00FF66]">STEP 3 OF 3</span>
                </div>

                {/* Term Contract Mock Window */}
                <div className="border border-[#222222] bg-[#050505] p-3 text-[10px] text-[#888888] h-32 overflow-y-auto space-y-2 leading-relaxed">
                  <p className="text-[#00FF66] font-bold">PROGRAMMATIC GLOBAL TRANS-BORDER NDA (v4.1)</p>
                  <p>
                    1. RESTRICTIONS ON DATA RECONSTRUCTION: The receiving target searcher covenants and warrants that any specific underlying financial statement, customer identification index, machine asset ledger, or regional operational coordinate disclosed by AcquireMeta will remain under absolute seal.
                  </p>
                  <p>
                    2. ANTI-CIRCUMVENTION STRATEGY: Under strict penalty of trans-continental private arbitration and systemic blacklisting, any target search group bypass of active registered intermediary representation is strictly prohibited.
                  </p>
                  <p>
                    3. LIQUIDATED DAMAGES CLAUSE: Violations of confidentiality boundaries will trigger automatic, liquid damage remedies capped under global commercial statutory limitations to the value of 15% of target enterprise value.
                  </p>
                </div>

                <form onSubmit={handleSignNDA} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-[#888888] uppercase mb-1">
                      ENTER LEGAL REPRESENTATIVE NAME (DIGITAL STAMP):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MARCUS AURELIUS DEV, GP"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      disabled={isSigning || !!signatureHash}
                      className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] focus:border-[#00FF66] focus:outline-none p-3 text-xs placeholder-[#888888] uppercase"
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="ndaConfirm"
                      checked={ndaAccepted}
                      onChange={(e) => setNdaAccepted(e.target.checked)}
                      disabled={isSigning || !!signatureHash}
                      className="mt-1 accent-[#00FF66] cursor-pointer"
                    />
                    <label htmlFor="ndaConfirm" className="text-[10px] text-[#888888] leading-tight uppercase cursor-pointer">
                      I accept the terms and enforce contractual liquidated damages against breach parameters outlined under multi-lateral protocol v4.1.
                    </label>
                  </div>

                  {!signatureHash ? (
                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveStep('UPLOAD_POF')}
                        className="text-xs text-[#888888] hover:text-[#F9F9F9] uppercase"
                      >
                        [← Back]
                      </button>
                      <button
                        type="submit"
                        disabled={isSigning || !ndaAccepted || !signerName}
                        className={`text-xs font-bold px-6 py-2.5 uppercase transition-all tracking-wider border ${
                          ndaAccepted && signerName
                            ? 'bg-[#00FF66] text-[#050505] border-[#00FF66] hover:bg-transparent hover:text-[#00FF66]'
                            : 'bg-transparent text-[#888888] border-[#222222] cursor-not-allowed'
                        }`}
                      >
                        {isSigning ? 'EXECUTING CONTRACT SIGNATURE...' : 'SIGN GLOBAL INTERMEDIARY NDA'}
                      </button>
                    </div>
                  ) : (
                    <div className="border border-[#00FF66] bg-[#00FF66]/5 p-3 text-center text-xs text-[#00FF66] font-bold">
                      ✓ CONTRACT DEPOSITED // SECURE PASS VALIDATED
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* STEP 4: ACCESS GRANTED TOKEN */}
            {activeStep === 'ACCESS_GRANTED' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#00FF66] uppercase tracking-widest">// SYSTEM ACCESS SECURED</span>
                  <span className="text-[10px] text-[#00FF66]">COMPLETE</span>
                </div>

                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 border-2 border-[#00FF66] border-t-transparent animate-spin rounded-full mx-auto" style={{ display: isDecrypting ? 'block' : 'none' }}></div>
                  
                  {!isDecrypting && decryptionToken && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="w-16 h-16 bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66] flex items-center justify-center mx-auto mb-2 text-2xl font-bold">
                        AQM
                      </div>
                      
                      <h3 className="text-sm font-bold text-[#F9F9F9] uppercase tracking-wider">
                        BUYER INTERMEDIARY ACCESS UNLOCKED
                      </h3>
                      
                      <div className="bg-[#050505] border border-[#222222] p-4 font-mono select-all cursor-pointer hover:border-[#0EA5E9] transition-all">
                        <span className="text-xs text-[#888888] block mb-1 uppercase text-center">// DECRYPTED ACCESS TOKEN</span>
                        <span className="text-md font-bold text-[#00FF66] tracking-widest block text-center">
                          {decryptionToken}
                        </span>
                      </div>

                      <p className="text-[10px] text-[#888888] max-w-md mx-auto leading-relaxed">
                        Use this token in your standard terminal CLI or click listings below to bypass initial teaser walls. Validated for matching acquisitions under $10M enterprise value.
                      </p>
                    </div>
                  )}

                  {isDecrypting && (
                    <p className="text-xs text-[#0EA5E9] animate-pulse">
                      AUTHENTICATING BANK & NDA HASH INTEGRATION WITH MAINNET NODE...
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-[#222222] pt-4">
                  <button
                    onClick={handleSystemReset}
                    className="text-[10px] text-[#FF3333] hover:underline uppercase"
                  >
                    [!] RESET PASSPORT STATE
                  </button>
                  <button
                    onClick={() => {
                      alert(`Token copied: ${decryptionToken}`);
                      addLog('OPERATOR ACTION: COPIED TOKEN TO LOCAL BOARD CLIPBOARD', 'info');
                    }}
                    disabled={!decryptionToken}
                    className="text-xs text-[#050505] bg-[#0EA5E9] border border-[#0EA5E9] hover:bg-transparent hover:text-[#0EA5E9] px-6 py-2 font-bold uppercase transition-all"
                  >
                    COPY SECRET TOKEN
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* DYNAMIC SYSTEM LOG CONSOLE */}
          <div className="border border-[#222222] bg-[#050505] p-3">
            <div className="flex justify-between items-center border-b border-[#222222] pb-1.5 mb-2">
              <span className="text-[10px] text-[#888888] uppercase tracking-widest">// SYSTEM FEED DIAGNOSTIC FEED</span>
              <span className="w-2 h-2 rounded-full bg-[#00FF66]"></span>
            </div>
            
            <div className="h-24 overflow-y-auto space-y-1 pr-2 text-[9px] font-mono scrollbar-thin">
              {logs.map((log, index) => (
                <div key={index} className="flex space-x-2 leading-relaxed">
                  <span className="text-[#888888] font-bold">[{log.timestamp}]</span>
                  <span className={
                    log.type === 'success' ? 'text-[#00FF66]' :
                    log.type === 'warn' ? 'text-[#FF3333]' :
                    log.type === 'system' ? 'text-[#0EA5E9]' : 'text-[#F9F9F9]'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: HIGH FIDELITY CRYPTOGRAPHIC PASSPORT PREVIEW */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Passport Visual Board */}
          <div className="border border-[#222222] bg-[#0a0a0a] relative overflow-hidden flex flex-col justify-between min-h-[500px]">
            
            {/* Hologram Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(14,165,233,0.03)_1px,_transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Top Passport Header */}
            <div className="border-b border-[#222222] bg-[#111111] p-4 flex justify-between items-center z-10">
              <div className="space-y-0.5">
                <span className="text-[9px] text-[#888888] uppercase tracking-wider">// ACQUIRE_META PASS</span>
                <h2 className="text-xs font-bold text-[#F9F9F9] tracking-wider uppercase">
                  BUYER SECURITY CARD
                </h2>
              </div>
              <span className={`text-[9px] border px-2 py-0.5 font-bold tracking-wider ${
                activeStep === 'ACCESS_GRANTED' 
                  ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5 animate-pulse' 
                  : 'border-[#FF3333] text-[#FF3333] bg-[#FF3333]/5'
              }`}>
                {activeStep === 'ACCESS_GRANTED' ? 'UNLOCKED / ACTIVE' : 'STAGE_UNVERIFIED'}
              </span>
            </div>

            {/* Passport Core Stats */}
            <div className="p-6 space-y-6 z-10">
              
              {/* Crypto Stamp Visual Block */}
              <div className="flex items-center space-x-4 border-b border-[#222222] pb-6">
                <div className="w-16 h-16 bg-[#111111] border border-[#222222] flex flex-col items-center justify-center p-2 text-center relative group">
                  <div className="absolute inset-0.5 border border-dashed border-[#888888]/20 group-hover:border-[#00FF66]/50 transition-colors"></div>
                  {activeStep === 'ACCESS_GRANTED' ? (
                    <svg className="w-10 h-10 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-[#FF3333] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#888888] block">CARD UNIQUE HASH:</span>
                  <span className="text-[10px] text-[#0EA5E9] font-bold tracking-widest block font-mono">
                    {signatureHash ? signatureHash.substring(0, 20) : 'AWAITING_VERIFIED_SIGNATURE'}
                  </span>
                  <span className="text-[9px] text-[#888888] block">REGISTRATION DATE: JAN-2026 // NODE: TX-99</span>
                </div>
              </div>

              {/* Verified Capital Balance Metrics */}
              <div className="space-y-4">
                <h3 className="text-[10px] text-[#888888] uppercase tracking-wider">// ACCOUNT LIQUIDITY DIAGNOSTICS</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-[#222222] bg-[#050505] p-3">
                    <span className="text-[8px] text-[#888888] block">VERIFIED PLAID BAL</span>
                    <span className="text-sm font-bold text-[#F9F9F9]">
                      {isConnected ? `$${verifiedBalance.toLocaleString()}` : '$0.00'}
                    </span>
                  </div>
                  <div className="border border-[#222222] bg-[#050505] p-3">
                    <span className="text-[8px] text-[#888888] block">POF ATTACHMENT</span>
                    <span className={`text-sm font-bold ${pofUploaded ? 'text-[#00FF66]' : 'text-[#888888]'}`}>
                      {pofUploaded ? `$${parseInt(pofAmount).toLocaleString()}` : 'NOT_LOADED'}
                    </span>
                  </div>
                </div>

                <div className="border border-[#222222] bg-[#050505] p-3 space-y-2">
                  <span className="text-[8px] text-[#888888] block uppercase">SIGNER IDENTITY & AUTHORITY:</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[#F9F9F9] font-bold">{signerName ? signerName.toUpperCase() : 'UNSIGNED'}</span>
                    <span className={`text-[8px] border px-1.5 py-0.5 font-bold ${signatureHash ? 'border-[#00FF66] text-[#00FF66]' : 'border-[#FF3333] text-[#FF3333]'}`}>
                      {signatureHash ? 'SEALED & BOUNDED' : 'UNVERIFIED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Gate Status */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#888888] uppercase">PASSPORT AUTH INTEGRITY:</span>
                  <span className="text-[#00FF66] font-bold">{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-[#111111] border border-[#222222] h-2.5">
                  <div 
                    className="h-full bg-[#00FF66] transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

            </div>

            {/* Bottom Cryptographic Security Signature Footer */}
            <div className="border-t border-[#222222] bg-[#111111] p-4 text-[9px] text-[#888888] leading-relaxed z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>* SYSTEM INTEGRATES COMPLIANCE MANDATES FROM MOONSHINE CAPITAL DIRECTORIES.</span>
              <span className="text-[#0EA5E9] font-bold uppercase tracking-wider font-mono">SECURE TRANS</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}