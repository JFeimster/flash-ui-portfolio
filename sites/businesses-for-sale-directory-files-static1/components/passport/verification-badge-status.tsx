import React, { useState, useEffect } from 'react';

// Verification Status TypeScript Types
type PassportTier = 'UNVERIFIED' | 'TIER_III_CORE' | 'TIER_II_PREMIUM' | 'TIER_I_ELITE';

interface LogMessage {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function VerificationBadgeStatus() {
  // State variables for vetting flow
  const [plaidConnected, setPlaidConnected] = useState<boolean>(false);
  const [plaidBalance, setPlaidBalance] = useState<number>(350000);
  const [plaidLoading, setPlaidLoading] = useState<boolean>(false);

  const [pofUploaded, setPofUploaded] = useState<boolean>(false);
  const [pofFileName, setPofFileName] = useState<string>('');
  const [pofLoading, setPofLoading] = useState<boolean>(false);

  const [ndaSigned, setNdaSigned] = useState<boolean>(false);
  const [ndaName, setNdaName] = useState<string>('');
  const [ndaChecked, setNdaChecked] = useState<boolean>(false);

  const [tokenUnlocked, setTokenUnlocked] = useState<boolean>(false);
  const [generatingToken, setGeneratingToken] = useState<boolean>(false);
  const [tokenString, setTokenString] = useState<string>('LOCKED_NODE_X92');

  const [systemLogs, setSystemLogs] = useState<LogMessage[]>([
    { timestamp: '14:20:05', message: 'PASSPORT GATEWAY INITIALIZED. WAITING FOR CREDS...', type: 'info' }
  ]);

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // Helper to append diagnostic logs
  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    setSystemLogs(prev => [...prev, { timestamp, message, type }]);
  };

  // Calculate Buyer Passport Tier
  const getPassportTier = (): PassportTier => {
    if (!plaidConnected && !pofUploaded) return 'UNVERIFIED';
    const totalCap = (plaidConnected ? plaidBalance : 0) + (pofUploaded ? 1000000 : 0); // Simulated baseline plus bonus for upload
    if (totalCap >= 1500000) return 'TIER_I_ELITE';
    if (totalCap >= 750000) return 'TIER_II_PREMIUM';
    return 'TIER_III_CORE';
  };

  const currentTier = getPassportTier();

  // Simulated Plaid Connection
  const handleConnectPlaid = () => {
    setPlaidLoading(true);
    addLog('LAUNCHING SECURE PLAID LINK API PROTOCOL...', 'info');
    setTimeout(() => {
      setPlaidConnected(true);
      setPlaidLoading(false);
      addLog(`PLAID API: HANDSHAKE SUCCESSFUL. VERIFIED CURRENT BALANCE: ${formatCurrency(plaidBalance)}`, 'success');
    }, 1500);
  };

  // Simulated POF Upload
  const handlePofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPofLoading(true);
      addLog(`PARSING CRYPTOGRAPHIC PDF MANIFEST: ${file.name.toUpperCase()}`, 'info');
      setTimeout(() => {
        setPofUploaded(true);
        setPofFileName(file.name);
        setPofLoading(false);
        addLog(`ASSET PROOF DETECTED & METADATA VERIFIED successfully. (DRY-POWDER MATCH +$1.0M CAPACITY)`, 'success');
      }, 1800);
    }
  };

  // Dynamic Trigger when NDA is submitted
  const handleSignNda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ndaName.trim() || !ndaChecked) {
      addLog('NDA COMPLIANCE FAULT: LEGAL NAME AND CHECKBOX ARE REQUIRED', 'error');
      return;
    }
    setNdaSigned(true);
    addLog(`NDA STRUCTURAL BOND GENERATED & SIGNED BY [${ndaName.toUpperCase()}]`, 'success');
  };

  // Generate cryptographic access token
  const handleGenerateToken = () => {
    if (!plaidConnected && !pofUploaded) {
      addLog('TOKEN FAULT: LIQUIDITY PROOF MISSING. COMPLY WITH PLAID/POF PROTOCOLS.', 'error');
      return;
    }
    if (!ndaSigned) {
      addLog('TOKEN FAULT: UN-SIGNED GLOBAL NDA. PROGRAMMATIC SIGNATURE REQUIRED.', 'error');
      return;
    }

    setGeneratingToken(true);
    addLog('COMPILING SECURE CRYPTOGRAPHIC HASH NODE TOKEN...', 'info');

    setTimeout(() => {
      const generatedCode = `AM-TKN-${Math.floor(100000 + Math.random() * 900000)}-${currentTier.replace('_CORE','').replace('_PREMIUM','').replace('_ELITE','')}`;
      setTokenString(generatedCode);
      setTokenUnlocked(true);
      setGeneratingToken(false);
      addLog(`TERMINAL TOKEN SUCCESSFULLY ISSUED: [${generatedCode}] - ACCESS UNLOCKED.`, 'success');
    }, 2000);
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono border border-[#222222] w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 select-none">
      
      {/* 1. Header Banner */}
      <div className="border-b border-[#222222] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] text-[#0EA5E9] tracking-widest font-bold">
            <span className="w-2 h-2 bg-[#0EA5E9] animate-pulse inline-block"></span>
            <span>SECURE SYSTEM INTERACTION REQUIRED // SEC-GATEWAY v4.81</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-wider uppercase">
            Verified Buyer Passport <span className="text-[#00FF66]">&amp;</span> NDA Gateway
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#888888] uppercase font-semibold">TOKEN SYSTEM:</span>
          <span className={`text-[11px] px-3 py-1 border font-bold uppercase ${
            tokenUnlocked ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5' : 'border-[#FF3333] text-[#FF3333] bg-[#FF3333]/5 animate-pulse'
          }`}>
            {tokenUnlocked ? '■ TOKEN_UNLOCKED' : '□ SYSTEM_BLINDED'}
          </span>
        </div>
      </div>

      {/* 2. Passport Status Dashboard Bento Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Flow (Actions) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xs font-bold text-[#888888] uppercase tracking-wider">// COMPLIANCE STAGES</h2>

          {/* STAGE 1: Plaid Balance Linker */}
          <div className={`border p-4 bg-[#0a0a0a] transition-all duration-300 ${
            plaidConnected ? 'border-[#00FF66]/50' : 'border-[#222222] hover:border-[#0EA5E9]'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2 py-0.5 border ${
                  plaidConnected ? 'border-[#00FF66] text-[#000000] bg-[#00FF66]' : 'border-[#888888] text-[#888888]'
                }`}>01</span>
                <span className="text-xs font-bold uppercase tracking-wide">Plaid Liquidity Verification</span>
              </div>
              <span className={`text-[9px] font-bold ${plaidConnected ? 'text-[#00FF66]' : 'text-[#888888]'}`}>
                {plaidConnected ? '[VERIFIED]' : '[AWAITING DATA]'}
              </span>
            </div>

            {!plaidConnected ? (
              <div className="space-y-4">
                <p className="text-[11px] text-[#888888] leading-relaxed">
                  Establish connection to your operating or holding institution through simulated Plaid interface to instantly calculate dry-powder balance tiering.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-auto flex-grow">
                    <label className="text-[9px] text-[#888888] block uppercase mb-1">Simulated Liquidity Capital</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-[#888888]">$</span>
                      <input 
                        type="number" 
                        step="50000"
                        min="50000"
                        max="10000000"
                        value={plaidBalance}
                        onChange={(e) => setPlaidBalance(Number(e.target.value))}
                        className="w-full bg-[#050505] border border-[#222222] focus:border-[#0EA5E9] focus:outline-none text-xs text-[#F9F9F9] pl-7 pr-3 py-2 uppercase"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleConnectPlaid}
                    disabled={plaidLoading}
                    className="w-full sm:w-auto self-end text-xs text-[#000000] bg-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] font-bold px-5 py-2.5 uppercase tracking-wider transition-colors duration-200"
                  >
                    {plaidLoading ? 'CONNECTING...' : 'INITIALIZE PLAID PROTOCOL'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#111111] p-3 border border-[#222222] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>MOCK INSTITUTIONAL HOLDINGS: <span className="text-[#00FF66] font-bold">{formatCurrency(plaidBalance)}</span></span>
                </div>
                <button 
                  onClick={() => { setPlaidConnected(false); addLog('PLAID LINK RESET BY USER', 'warning'); }}
                  className="text-[9px] text-[#FF3333] hover:underline"
                >
                  [DISCONNECT]
                </button>
              </div>
            )}
          </div>

          {/* STAGE 2: Dry-Powder Proof of Funds PDF */}
          <div className={`border p-4 bg-[#0a0a0a] transition-all duration-300 ${
            pofUploaded ? 'border-[#00FF66]/50' : 'border-[#222222] hover:border-[#0EA5E9]'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2 py-0.5 border ${
                  pofUploaded ? 'border-[#00FF66] text-[#000000] bg-[#00FF66]' : 'border-[#888888] text-[#888888]'
                }`}>02</span>
                <span className="text-xs font-bold uppercase tracking-wide">Direct POF Document Upload</span>
              </div>
              <span className={`text-[9px] font-bold ${pofUploaded ? 'text-[#00FF66]' : 'text-[#888888]'}`}>
                {pofUploaded ? '[UPLOAD RECORDED]' : '[AWAITING ATTACHMENT]'}
              </span>
            </div>

            {!pofUploaded ? (
              <div className="space-y-4">
                <p className="text-[11px] text-[#888888] leading-relaxed">
                  For capital sizes matching high tier acquisitions (CIMs &gt;$2.5M asking), attach your firm's bank letter, LOI capacity memo, or brokerage statement.
                </p>
                <div className="relative border border-dashed border-[#222222] hover:border-[#0ea5e9] p-6 text-center cursor-pointer transition-colors">
                  <input 
                    type="file" 
                    accept=".pdf,.png,.jpg"
                    onChange={handlePofUpload}
                    disabled={pofLoading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <svg className="w-8 h-8 mx-auto text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-[10px] text-[#888888] uppercase">
                      {pofLoading ? 'DECRYPTING MANIFEST...' : 'DRAG & DROP SECURE PDF / IMAGES (MAX 12MB)'}
                    </p>
                    <p className="text-[9px] text-[#0EA5E9]">SECURE END-TO-END DOCUMENT ENCRYPTION ENFORCED</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#111111] p-3 border border-[#222222] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>PARSED DOCUMENT: <span className="text-[#0EA5E9] font-bold" x-text="pofFileName">{pofFileName}</span></span>
                </div>
                <button 
                  onClick={() => { setPofUploaded(false); setPofFileName(''); addLog('PROOF OF FUNDS REMOVED', 'warning'); }}
                  className="text-[9px] text-[#FF3333] hover:underline"
                >
                  [ERASE RECORD]
                </button>
              </div>
            )}
          </div>

          {/* STAGE 3: Programmatic Global NDA Signer */}
          <div className={`border p-4 bg-[#0a0a0a] transition-all duration-300 ${
            ndaSigned ? 'border-[#00FF66]/50' : 'border-[#222222] hover:border-[#0EA5E9]'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2 py-0.5 border ${
                  ndaSigned ? 'border-[#00FF66] text-[#000000] bg-[#00FF66]' : 'border-[#888888] text-[#888888]'
                }`}>03</span>
                <span className="text-xs font-bold uppercase tracking-wide">Programmatic Master NDA Contract</span>
              </div>
              <span className={`text-[9px] font-bold ${ndaSigned ? 'text-[#00FF66]' : 'text-[#888888]'}`}>
                {ndaSigned ? '[SIGNED & BOUND]' : '[AWAITING EXECUTION]'}
              </span>
            </div>

            {!ndaSigned ? (
              <form onSubmit={handleSignNda} className="space-y-4">
                {/* Scrollable NDA text box */}
                <div className="border border-[#222222] p-3 h-28 overflow-y-scroll bg-[#050505] text-[10px] text-[#888888] leading-relaxed space-y-2">
                  <p className="font-bold text-[#F9F9F9] uppercase">// STAGE II CONFIDENTIALITY & NON-DISCLOSURE PROTOCOL</p>
                  <p>
                    This bilateral regulatory agreement is active as of access token generation. The Recipient acknowledges and agrees that all corporate parameters, technical identities, cash flow profiles, and unblinded CIM assets related to Project Delta, Project Cobalt, Project Cipher, and alternative index pipelines are strictly proprietary and trade-secret structures.
                  </p>
                  <p>
                    Direct or indirect communication with operations, team personnel, vendors, or competitors of target acquisitions without direct systemic written consent from the originating Advisory Node represents direct violation, initiating legal remediation limits.
                  </p>
                  <p>
                    This agreement utilizes programmatic verification. Execution of signature below creates binding legal standing equivalent to traditional standard document authentication.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="ndaConfirm" 
                      checked={ndaChecked} 
                      onChange={(e) => setNdaChecked(e.target.checked)}
                      className="mt-0.5 mr-2 accent-[#00FF66]"
                    />
                    <label htmlFor="ndaConfirm" className="text-[10px] text-[#888888] uppercase leading-snug">
                      I have analyzed and fully agree to comply with the master programmatic non-disclosure parameters and transaction penalties.
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input 
                      type="text" 
                      placeholder="AUTHORIZED FULL LEGAL NAME (ELECTRONIC SIG)" 
                      value={ndaName}
                      onChange={(e) => setNdaName(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222222] focus:border-[#0EA5E9] focus:outline-none text-xs text-[#F9F9F9] p-2.5 uppercase font-mono tracking-wider"
                    />
                    <button 
                      type="submit"
                      className="w-full sm:w-auto text-xs text-[#050505] bg-[#0ea5e9] hover:bg-[#050505] hover:text-[#0ea5e9] border border-[#0ea5e9] font-bold px-6 py-2.5 uppercase whitespace-nowrap tracking-wider transition-all duration-150"
                    >
                      EXECUTE BOND SIG
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-[#111111] p-3 border border-[#222222] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#00FF66] font-bold flex items-center gap-2">
                    ✓ ELECTRONIC BOND ACTIVE
                  </span>
                  <span className="text-[9px] text-[#888888]">HASHCODE: {ndaName.length * 941 + 482}</span>
                </div>
                <div className="text-[10px] text-[#888888]">
                  BOUND BY LEGAL ID: <span className="text-[#F9F9F9] font-bold uppercase">{ndaName}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Live Token Generation & Visual Passport (Output Preview) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-[#888888] uppercase tracking-wider">// DYNAMIC BUYER PASSPORT</h2>

            {/* Passport Holographic Card Component */}
            <div className={`border-2 p-5 bg-gradient-to-br from-[#0c0c0c] to-[#050505] relative overflow-hidden transition-all duration-500 ${
              tokenUnlocked ? 'border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]' : 'border-[#222222]'
            }`}>
              {/* Scanline CRT overlay simulator */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]"></div>
              
              {/* Decorative Passport Elements */}
              <div className="flex justify-between items-start border-b border-[#222222] pb-4 mb-4">
                <div>
                  <div className="text-[8px] tracking-widest text-[#888888] uppercase">ACQUIRE_META GLOBAL NETWORKS</div>
                  <div className="text-sm font-bold tracking-wider text-[#F9F9F9] uppercase">BUYER PASSPORT DEFI</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-[#888888]">ISSUED SYSTEM PORT:</div>
                  <div className="text-[10px] font-bold text-[#0EA5E9]">NODE-918TX</div>
                </div>
              </div>

              {/* Holographic Avatar Box */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#111111] border border-[#222222] flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className={`w-8 h-8 rounded-full border-2 border-dashed ${
                    tokenUnlocked ? 'border-[#00FF66] animate-spin' : 'border-[#888888]'
                  } flex items-center justify-center`}>
                    <span className="text-[8px] text-[#888888]">AM</span>
                  </div>
                  <div className="text-[7px] text-[#888888] mt-1 uppercase font-bold">V-BIOMETRIC</div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="text-[8px] text-[#888888] uppercase">AUTHORIZED SEARCHER ID</div>
                  <div className="text-xs font-bold text-[#F9F9F9] uppercase">
                    {ndaSigned ? ndaName : 'ANONYMOUS_SEARCHER'}
                  </div>
                  <div className="text-[9px] text-[#888888]">
                    VERIFIED HOLDINGS: <span className="text-[#0EA5E9] font-bold">{plaidConnected ? formatCurrency(plaidBalance) : 'UNVERIFIED'}</span>
                  </div>
                </div>
              </div>

              {/* Status Columns */}
              <div className="grid grid-cols-2 gap-3 text-[10px] border-t border-b border-[#222222] py-3 mb-4 bg-[#080808] px-2">
                <div>
                  <span className="text-[#888888] block text-[8px] uppercase">PASSPORT STATUS TIER</span>
                  <span className={`font-bold uppercase ${
                    currentTier === 'TIER_I_ELITE' ? 'text-[#00FF66]' : currentTier === 'TIER_II_PREMIUM' ? 'text-[#0EA5E9]' : 'text-[#888888]'
                  }`}>{currentTier.replace(/_/g, ' ')}</span>
                </div>
                <div>
                  <span className="text-[#888888] block text-[8px] uppercase">NDA SECURITY BOND</span>
                  <span className={`font-bold uppercase ${ndaSigned ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                    {ndaSigned ? 'ACTIVE / EXECUTED' : 'AWAITING SIG'}
                  </span>
                </div>
              </div>

              {/* Generated Token Container inside card */}
              <div className="bg-[#050505] border border-[#222222] p-3 text-center relative">
                <span className="text-[7px] text-[#888888] absolute top-1 left-2 uppercase">TERMINAL ACCESS TOKEN</span>
                <span className={`text-[10px] uppercase block mt-2 tracking-widest font-mono font-bold ${
                  tokenUnlocked ? 'text-[#00FF66]' : 'text-[#FF3333]'
                }`}>
                  {generatingToken ? 'PROCESSING INTEGRATIONS...' : tokenString}
                </span>
              </div>
            </div>

            {/* Unlock Trigger Callout button */}
            {!tokenUnlocked ? (
              <button 
                onClick={handleGenerateToken}
                disabled={generatingToken}
                className={`w-full text-xs font-bold py-3 uppercase tracking-widest border transition-all duration-200 ${
                  (plaidConnected || pofUploaded) && ndaSigned
                    ? 'bg-[#00FF66] text-[#050505] border-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66]'
                    : 'bg-transparent text-[#888888] border-[#222222] cursor-not-allowed'
                }`}
              >
                {generatingToken ? 'COMPILING COMPLIANCE ENVELOPE...' : 'DECRYPT UNBLINDED ACCESS TOKEN'}
              </button>
            ) : (
              <div className="border border-[#00FF66] bg-[#00FF66]/5 p-3 text-center text-xs text-[#00FF66] uppercase animate-pulse">
                ✓ ALL CIM UNBLINDING PERMISSIONS UNLOCKED ON PRESET DOMAIN
              </div>
            )}
          </div>

          {/* Diagnostic Log Interface */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-3">
            <span className="text-[9px] text-[#888888] uppercase block mb-2">// SECURE NODE EVENT LOGS</span>
            <div className="space-y-1.5 h-20 overflow-y-auto text-[9px] font-mono leading-tight">
              {systemLogs.map((log, idx) => (
                <div key={idx} className="flex space-x-1.5 items-start">
                  <span className="text-[#888888]">{log.timestamp}</span>
                  <span className="text-blue-500 font-semibold">[DIAG]</span>
                  <span className={
                    log.type === 'success' ? 'text-[#00FF66]' :
                    log.type === 'warning' ? 'text-yellow-500' :
                    log.type === 'error' ? 'text-[#FF3333]' : 'text-[#F9F9F9]'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 3. SIMULATED UNBLINDED OUTPUT: Simulated CIM Vault Drawer */}
      {tokenUnlocked && (
        <div className="border border-[#00FF66] bg-[#00FF66]/5 p-5 space-y-4 animate-fadeIn transition-all duration-300">
          <div className="flex justify-between items-center border-b border-[#00FF66]/30 pb-3">
            <div className="space-y-1">
              <span className="text-[8px] text-[#00FF66] font-bold tracking-widest block uppercase">// CRYPTO ACCESS MATCHED: SUCCESS</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F9F9F9]">
                UNBLINDED ASSET SPECIFICATION (PROJECT COBALT DECLASSIFIED)
              </h3>
            </div>
            <span className="text-[10px] text-[#00FF66] bg-[#00FF66]/10 px-2.5 py-0.5 border border-[#00FF66]">CIM UNLOCKED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="border border-[#222222] p-3 bg-[#0c0c0c]">
              <span className="text-[8px] text-[#888888] uppercase block mb-1">UNBLINDED REGISTERED CORPORATE NAME</span>
              <span className="font-bold text-[#F9F9F9]">Texas Air Solutions Partners, LLC</span>
            </div>
            <div className="border border-[#222222] p-3 bg-[#0c0c0c]">
              <span className="text-[8px] text-[#888888] uppercase block mb-1">FOUNDER & CEO IDENTITY</span>
              <span className="font-bold text-[#F9F9F9]">Randall D. Sterling (Retiring Post-Close)</span>
            </div>
            <div className="border border-[#222222] p-3 bg-[#0c0c0c]">
              <span className="text-[8px] text-[#888888] uppercase block mb-1">FACILITY GEOGRAPHIC COORDINATE</span>
              <span className="font-bold text-[#F9F9F9]">Suite 400, North Loop West, Houston, TX</span>
            </div>
          </div>

          <div className="text-[10px] text-[#888888] flex items-center justify-between pt-2">
            <span>UNBLINDED DATA EXTRAS CACHED IN LOCAL BROWSING CONTEXT</span>
            <span className="text-[#0ea5e9] cursor-pointer hover:underline uppercase">[DOWNLOAD COMPLETE MEMORANDUM (PDF)]</span>
          </div>
        </div>
      )}

    </div>
  );
}