import React, { useState, useEffect } from 'react';

export default function PlaidIntegrationPortal() {
  const [plaidConnected, setPlaidConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [verifiedBalance, setVerifiedBalance] = useState<number | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [ndaSigned, setNdaSigned] = useState(false);
  const [ndaHash, setNdaHash] = useState('');
  const [step, setStep] = useState(1); // 1: POF, 2: NDA, 3: Unlocked
  const [logs, setLogs] = useState<string[]>([]);
  const [targetEbitda, setTargetEbitda] = useState('$500K - $1.5M');

  // Terminal logging simulator
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 5)]);
  };

  useEffect(() => {
    addLog('Awaiting pipeline handshake...');
  }, []);

  const simulatePlaidLink = () => {
    setIsConnecting(true);
    addLog('Initializing secure Plaid Link OAuth handshake...');
    
    setTimeout(() => {
      addLog('Connection established with SVB Private Cash Channel.');
      addLog('Scanning asset liquidity accounts...');
      
      setTimeout(() => {
        const randomPOF = Math.floor(Math.random() * 3200000) + 850000;
        setVerifiedBalance(randomPOF);
        setPlaidConnected(true);
        setIsConnecting(false);
        setStep(2);
        addLog(`POF Verified: $${randomPOF.toLocaleString()} cash equivalent asset pool.`);
        addLog('Transitioning to Digital NDA workflow...');
      }, 1200);
    }, 1500);
  };

  const generateNdaHash = (name: string) => {
    if (!name) return '';
    const hash = Array.from(name)
      .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
      .toString(16)
      .toUpperCase();
    return `NDA-SHA256-${hash}-2026`;
  };

  const signNda = () => {
    if (!buyerName.trim()) {
      addLog('ERR: Buyer signature string empty. Handshake refused.');
      return;
    }
    const signatureHash = generateNdaHash(buyerName);
    setNdaHash(signatureHash);
    setNdaSigned(true);
    addLog(`NDA Signed programmatically by: ${buyerName.toUpperCase()}`);
    addLog(`Generated Secure Hash: ${signatureHash}`);
    
    setTimeout(() => {
      setStep(3);
      addLog('CREDENTIALS VALIDATED. Secure pipeline decrypted.');
    }, 1000);
  };

  const resetPortal = () => {
    setPlaidConnected(false);
    setVerifiedBalance(null);
    setBuyerName('');
    setNdaSigned(false);
    setNdaHash('');
    setStep(1);
    setLogs([]);
    addLog('Pipeline reset. Dynamic authentication keys rotated.');
  };

  return (
    <div className="w-full max-w-lg bg-[#090909] border border-[#222222] text-[#F9F9F9] flex flex-col glow-copper font-sans">
      {/* Portal Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#222222] bg-[#0c0c0c]">
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-2 h-2 rounded-full ${step === 3 ? 'bg-[#00FF66] animate-pulse' : 'bg-[#0EA5E9]'}`}></span>
          <span className="font-mono text-[10px] tracking-widest uppercase font-bold">BUYER POF &amp; NDA COMPLIANCE</span>
        </div>
        <span className="font-mono text-[9px] text-[#666]">SECURE PIPELINE SH-883</span>
      </div>

      {/* Progress Bar Indicators */}
      <div className="grid grid-cols-3 border-b border-[#222222] font-mono text-[9px] text-center tracking-wider text-[#666]">
        <div className={`py-2 border-r border-[#222222] ${step === 1 ? 'text-[#0EA5E9] bg-black/40 font-bold' : step > 1 ? 'text-[#00FF66]' : ''}`}>
          01 / POF VERIFY
        </div>
        <div className={`py-2 border-r border-[#222222] ${step === 2 ? 'text-[#0EA5E9] bg-black/40 font-bold' : step > 2 ? 'text-[#00FF66]' : ''}`}>
          02 / DIGITAL NDA
        </div>
        <div className={`py-2 ${step === 3 ? 'text-[#00FF66] bg-black/40 font-bold' : ''}`}>
          03 / UNLOCKED STREAM
        </div>
      </div>

      {/* Main Interactive Interface Area */}
      <div className="p-5 space-y-6">
        
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-mono text-[11px] text-[#888] uppercase tracking-wider">SECURE PROOF OF FUNDS ROUTER</h4>
              <p className="text-xs text-[#888]">
                Unlock off-market deal profiles instantly. Connect your liquid operating accounts securely via Plaid to verify transaction bandwidth dynamically.
              </p>
            </div>

            {/* Simulated Bank Pre-Selection Badges */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-black border border-[#1a1a1a] p-2.5 flex justify-between items-center">
                <span className="text-stone-400">Target Range</span>
                <span className="text-[#0EA5E9] font-bold">1031 Ready</span>
              </div>
              <div className="bg-black border border-[#1a1a1a] p-2.5 flex justify-between items-center">
                <span className="text-stone-400">Min Capital</span>
                <span className="text-[#00FF66] font-bold">$250K Liquid</span>
              </div>
            </div>

            {/* Action Trigger button */}
            <button
              onClick={simulatePlaidLink}
              disabled={isConnecting}
              className={`w-full h-11 border font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-3 rounded-none ${
                isConnecting
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-wait'
                  : 'bg-transparent border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black hover:shadow-[0_0_15px_rgba(0,255,102,0.25)]'
              }`}
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>TUNNELING SECURE PORT...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <span>CONNECT COMPLIANT BANK DEPOSIT (PLAID)</span>
                </>
              )}
            </button>
            <p className="text-[9px] font-mono text-[#444] text-center leading-normal">
              256-bit encryption. Handled programmatically via Plaid API Sandbox keys. AcquireMeta never caches raw authentication tokens.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-mono text-[11px] text-[#00FF66] uppercase tracking-wider">LIQUID POF STATUS: CONFIRMED</h4>
                <span className="font-mono text-[11px] text-white bg-[#00FF66]/10 px-2 py-0.5 border border-[#00FF66]/20">
                  {verifiedBalance ? `$${verifiedBalance.toLocaleString()}` : ''}
                </span>
              </div>
              <p className="text-xs text-[#888]">
                Liquid profile validated. Prior to unlocking active codenames and target acquisition variables, execute the systemic confidentiality agreement.
              </p>
            </div>

            {/* Minimal Digital NDA Text Scroll Box */}
            <div className="h-24 overflow-y-auto bg-black border border-[#1a1a1a] p-3 text-[9px] font-mono text-stone-500 space-y-2 leading-relaxed">
              <p className="text-stone-300 font-bold text-[10px]">COVENANT OF NON-DISCLOSURE (ACQUIREMETA v3.11)</p>
              <p>1. The Receiver agrees to retain all information regarding simulated or real target codenames in strict operational secrecy.</p>
              <p>2. Direct approach to sellers, employees, raw material suppliers, or regional branch operators is strictly prohibited under liquidated damages terms.</p>
              <p>3. Information profiles provided constitute proprietary trade secrets of Moonshine Capital Capital networks.</p>
            </div>

            {/* Input and Sign Mechanism */}
            <div className="space-y-3">
              <div>
                <label className="font-mono text-[9px] text-[#666] uppercase tracking-wider block mb-1">02 / E-SIGN FULL LEGAL NAME</label>
                <input
                  type="text"
                  placeholder="EX: CHARLES SPENCER"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full h-10 bg-black border border-[#222] rounded-none px-3 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="nda-check"
                  checked={ndaSigned}
                  onChange={(e) => setNdaSigned(e.target.checked)}
                  className="bg-black border border-[#222222] text-[#00FF66] accent-[#00FF66]"
                />
                <label htmlFor="nda-check" className="font-mono text-[9px] text-[#888] cursor-pointer">
                  I accept standard pre-deal transactional representation protocols.
                </label>
              </div>

              <button
                onClick={signNda}
                disabled={!ndaSigned || !buyerName}
                className={`w-full h-11 border font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 rounded-none ${
                  ndaSigned && buyerName
                    ? 'bg-transparent border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                }`}
              >
                <span>EXECUTE BINDING AGREEMENT</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="border border-[#00FF66]/20 bg-[#00FF66]/5 p-4 space-y-3 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full border border-[#00FF66] flex items-center justify-center text-[#00FF66] font-mono text-sm font-bold animate-pulse">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#00FF66] font-bold">PIPELINE UNLOCKED DECRYPTED</h4>
                <p className="text-[10px] text-stone-400 font-mono">HASH: {ndaHash}</p>
              </div>
              <p className="text-xs text-[#888] max-w-xs leading-normal">
                Credentials authorized. You now have unrestricted access to real target names, proprietary CIM reports, and live debt structures across the AcquireMeta stream.
              </p>
            </div>

            <div className="bg-black p-3.5 border border-[#161616] flex flex-col justify-center space-y-1">
              <span className="font-mono text-[8px] text-[#555] uppercase block">ACTIVE BUYER CATEGORY</span>
              <span className="text-xs font-bold text-[#F9F9F9] tracking-wider font-mono">
                PLATINUM ACQUISITION ENTREPRENEUR
              </span>
            </div>

            <button
              onClick={resetPortal}
              className="w-full h-10 border border-[#FF3333]/30 text-[#FF3333] hover:border-[#FF3333] hover:bg-[#FF3333]/10 font-mono text-[10px] uppercase transition-all tracking-wider"
            >
              ROTATE SECURITY KEYS / DISCONNECT PORTAL
            </button>
          </div>
        )}

        {/* Real-Time Terminal Activity Logs */}
        <div className="border-t border-[#1a1a1a] pt-4 space-y-2">
          <div className="flex justify-between items-center text-[8px] font-mono text-[#666] tracking-widest">
            <span>REAL-TIME PIPELINE ACTIVITY LOG</span>
            <span className="text-[#00FF66] animate-pulse">● FEED SECURE</span>
          </div>
          <div className="bg-black p-3 border border-[#111] font-mono text-[9px] text-[#888] space-y-1.5 h-24 overflow-y-auto select-none">
            {logs.length === 0 ? (
              <p className="text-[#444] italic">Awaiting telemetry inputs...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex space-x-2">
                  <span className="text-[#0EA5E9]">&gt;</span>
                  <span className={log.includes('ERR:') ? 'text-[#FF3333]' : log.includes('Verified:') || log.includes('UNLOCKED') ? 'text-[#00FF66]' : ''}>
                    {log}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}