```tsx
import React, { useState } from 'react';

export default function VerificationStatusCard() {
  // Mock states for interactive terminal experience
  const [plaidConnected, setPlaidConnected] = useState(true);
  const [liquidAssets, setLiquidAssets] = useState(1850000);
  const [ndaSigned, setNdaSigned] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sigInput, setSigInput] = useState("A. VANCE");

  const refreshPlaid = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Randomly fluctuation simulation
      setLiquidAssets(prev => prev + (Math.random() > 0.5 ? 50000 : -30000));
      setIsRefreshing(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl bg-[#090909] border border-[#222222] text-[#F9F9F9] font-sans relative overflow-hidden selection:bg-[#00FF66] selection:text-black">
      {/* Decorative Top Accent Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#00FF66] via-[#0EA5E9] to-[#FF3333]"></div>

      {/* Terminal Header Section */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-[#222222] bg-[#0c0c0c]">
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-2 h-2 rounded-full ${plaidConnected && ndaSigned ? 'bg-[#00FF66] animate-pulse' : 'bg-[#FF3333]'} `}></span>
          <span className="font-mono text-[10px] tracking-widest text-[#888888] uppercase">
            BUYER PORTAL // VERIFICATION GATEWAY
          </span>
        </div>
        <div className="font-mono text-[9px] bg-[#111111] border border-[#222222] text-[#0EA5E9] px-2.5 py-0.5 rounded-none tracking-wider uppercase">
          SECURE SH-992
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 space-y-6">
        
        {/* Core Verification Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Box 1: Plaid Proof of Funds Status */}
          <div className="bg-black border border-[#1a1a1a] p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-[#555] tracking-widest block uppercase">
                  SECURE POF / LIQUIDITY
                </span>
                <span className="font-mono text-[8px] bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 px-1.5 py-0.5 uppercase">
                  PLAID ACTIVE
                </span>
              </div>
              <h4 className="text-xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-2">
                {isRefreshing ? (
                  <span className="text-[#888] animate-pulse">FETCHING DATA...</span>
                ) : (
                  `$${liquidAssets.toLocaleString()}`
                )}
              </h4>
              <p className="font-mono text-[9px] text-[#666] mt-1">
                Verified liquid cash, equities & credit reserves.
              </p>
            </div>

            <div className="pt-2 border-t border-[#111] flex items-center justify-between">
              <span className="font-mono text-[8px] text-[#444]">LAST SYNCED: 2 MINS AGO</span>
              <button 
                onClick={refreshPlaid}
                disabled={isRefreshing}
                className="font-mono text-[9px] text-[#0EA5E9] hover:text-[#00FF66] hover:underline uppercase transition-all disabled:text-[#444] disabled:no-underline"
              >
                {isRefreshing ? "[ RETRIEVING ]" : "[ SYNC POF ]"}
              </button>
            </div>
          </div>

          {/* Box 2: Master NDA Compliance */}
          <div className="bg-black border border-[#1a1a1a] p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-[#555] tracking-widest block uppercase">
                  COMPLIANCE PIPELINE
                </span>
                <span className={`font-mono text-[8px] px-1.5 py-0.5 uppercase ${ndaSigned ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20' : 'bg-[#FF3333]/10 text-[#FF3333] border border-[#FF3333]/20'}`}>
                  {ndaSigned ? 'NDA SIGNED' : 'NDA REQ.'}
                </span>
              </div>
              <h4 className="text-sm font-bold font-mono tracking-tight text-[#F9F9F9] mt-2.5 truncate">
                {ndaSigned ? 'GLOBAL MASTER CONTRACT-883' : 'PENDING SIGNATURE'}
              </h4>
              <p className="font-mono text-[9px] text-[#666] mt-1">
                Enables immediate, automated unlocking of blinded assets.
              </p>
            </div>

            <div className="pt-2 border-t border-[#111] flex items-center justify-between">
              <span className="font-mono text-[8px] text-[#444]">
                IP ADDRESS: {ndaSigned ? '198.162.0.25' : 'UNSECURED'}
              </span>
              <button 
                onClick={() => setNdaSigned(!ndaSigned)}
                className={`font-mono text-[9px] uppercase transition-all ${ndaSigned ? 'text-[#FF3333] hover:underline' : 'text-[#00FF66] hover:underline'}`}
              >
                {ndaSigned ? "[ REVOKE NDA ]" : "[ SIGN NDA ]"}
              </button>
            </div>
          </div>

        </div>

        {/* Verification Checklist */}
        <div className="space-y-3">
          <span className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">
            VERIFICATION CHECKLIST & COMPLIANCE STEPS
          </span>
          <div className="border border-[#222222] bg-black divide-y divide-[#111]">
            
            {/* Step 1 */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border border-[#222] bg-[#090909] flex items-center justify-center">
                  <span className="text-[#00FF66] font-mono text-[11px] font-bold">✔</span>
                </div>
                <div>
                  <h5 className="font-mono text-xs text-[#F9F9F9] font-medium">Verify Identity & SEC Clearance</h5>
                  <p className="font-mono text-[9px] text-[#555]">KYC/AML verification completed via secure micro-checks.</p>
                </div>
              </div>
              <span className="font-mono text-[9px] text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 border border-[#00FF66]/20">PASSED</span>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border border-[#222] bg-[#090909] flex items-center justify-center">
                  <span className={plaidConnected ? "text-[#00FF66] font-mono text-[11px] font-bold" : "text-[#FF3333] font-mono text-[11px] font-bold"}>
                    {plaidConnected ? '✔' : '○'}
                  </span>
                </div>
                <div>
                  <h5 className="font-mono text-xs text-[#F9F9F9] font-medium">Plaid Liquid Asset Connection</h5>
                  <p className="font-mono text-[9px] text-[#555]">Proof of funds linked securely for asset checks up to $5M.</p>
                </div>
              </div>
              <span className={`font-mono text-[9px] px-2 py-0.5 border ${plaidConnected ? 'text-[#00FF66] bg-[#00FF66]/10 border-[#00FF66]/20' : 'text-[#FF3333] bg-[#FF3333]/10 border-[#FF3333]/20'}`}>
                {plaidConnected ? 'CONNECTED' : 'ACTION REQ'}
              </span>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border border-[#222] bg-[#090909] flex items-center justify-center">
                  <span className={ndaSigned ? "text-[#00FF66] font-mono text-[11px] font-bold" : "text-[#FF3333] font-mono text-[11px] font-bold"}>
                    {ndaSigned ? '✔' : '○'}
                  </span>
                </div>
                <div>
                  <h5 className="font-mono text-xs text-[#F9F9F9] font-medium">Execute Programmatic Global NDA</h5>
                  <p className="font-mono text-[9px] text-[#555]">Digitally sign the multi-party secure confidentiality covenant.</p>
                </div>
              </div>
              <span className={`font-mono text-[9px] px-2 py-0.5 border ${ndaSigned ? 'text-[#00FF66] bg-[#00FF66]/10 border-[#00FF66]/20' : 'text-[#FF3333] bg-[#FF3333]/10 border-[#FF3333]/20'}`}>
                {ndaSigned ? 'SIGNED' : 'UNSIGNED'}
              </span>
            </div>

          </div>
        </div>

        {/* NDA Interactive Input Panel if unsigned */}
        {!ndaSigned && (
          <div className="bg-[#FF3333]/5 border border-[#FF3333]/20 p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-[#FF3333] inline-block animate-ping"></span>
              <span className="font-mono text-[9px] text-[#FF3333] font-bold uppercase tracking-wider">
                SIGNATURE REQUIRED TO VIEW SYSTEM CODENAMES
              </span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={sigInput}
                onChange={(e) => setSigInput(e.target.value.toUpperCase())}
                placeholder="TYPE NAME TO SIGN" 
                className="bg-black border border-[#222] rounded-none px-3 py-2 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#FF3333] flex-grow"
              />
              <button 
                onClick={() => setNdaSigned(true)}
                disabled={sigInput.trim().length === 0}
                className="bg-transparent border border-[#FF3333] hover:bg-[#FF3333] hover:text-black text-[#FF3333] px-4 font-mono text-xs transition-colors uppercase font-bold disabled:border-[#333] disabled:text-[#333] disabled:bg-transparent"
              >
                EXECUTE
              </button>
            </div>
            <p className="text-[9px] text-[#666] font-mono">
              By typing your name and executing, you verify legal binding to global acquisition confidentiality rules.
            </p>
          </div>
        )}

        {/* Safeguard Notice Block */}
        <div className="border border-[#1a1a1a] bg-[#080808] p-3.5 flex items-start space-x-3">
          <span className="text-[#0EA5E9] font-mono text-xs mt-0.5">ℹ</span>
          <div className="space-y-1">
            <h6 className="font-mono text-[10px] text-[#F9F9F9] uppercase font-bold tracking-wider">SECURE PIPELINE SAFEGUARD</h6>
            <p className="font-mono text-[9px] text-[#666] leading-relaxed">
              System credentials automatically lock after 30 minutes of operational inactivity. Live Plaid balances represent verified asset values for underwriting calculations and do not execute raw fund transfers.
            </p>
          </div>
        </div>

      </div>

      {/* Footer Info Action Row */}
      <div className="px-5 py-4 bg-[#0c0c0c] border-t border-[#222222] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <span className="font-mono text-[8px] text-[#444] uppercase tracking-widest">
          SBA PREFERRED PORTAL // BYLAWS SEC-8
        </span>
        <div className="flex space-x-4">
          <button className="font-mono text-[9px] text-[#888] hover:text-[#0EA5E9] transition-colors uppercase">
            [ DOWNLOAD AUDIT LOG ]
          </button>
          <button className="font-mono text-[9px] text-[#888] hover:text-[#00FF66] transition-colors uppercase">
            [ VIEW LEGAL COVENANT ]
          </button>
        </div>
      </div>
    </div>
  );
}
```