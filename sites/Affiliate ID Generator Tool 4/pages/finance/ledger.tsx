import React, { useState, useEffect } from 'react';

const LedgerPage = () => {
  const [authorizedId, setAuthorizedId] = useState<string | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState([
    { id: 'TX-99021', partnerId: 'MC-BRK-AT24', amount: 12500.00, commission: 12, status: 'PENDING', taxDoc: 'VERIFIED' },
    { id: 'TX-99022', partnerId: 'MC-REF-SJ23', amount: 8400.50, commission: 5, status: 'PAID', taxDoc: 'VERIFIED' },
    { id: 'TX-99023', partnerId: 'MC-AFF-MV24', amount: 21000.00, commission: 8, status: 'AUTHORIZED', taxDoc: 'PENDING' },
    { id: 'TX-99024', partnerId: 'MC-VND-ER24', amount: 4500.00, commission: 15, status: 'PENDING', taxDoc: 'VERIFIED' },
    { id: 'TX-99025', partnerId: 'MC-BRK-JC23', amount: 15600.00, commission: 10, status: 'PAID', taxDoc: 'VERIFIED' },
  ]);

  const totalPayable = ledgerEntries
    .filter(e => e.status !== 'PAID')
    .reduce((acc, curr) => acc + (curr.amount * (curr.commission / 100)), 0);

  const handleAuthorize = (id: string) => {
    setAuthorizedId(id);
    setTimeout(() => {
      setLedgerEntries(prev => prev.map(entry => 
        entry.id === id ? { ...entry, status: 'AUTHORIZED' } : entry
      ));
      setAuthorizedId(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono'] p-4 md:p-8 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .terminal-grid {
          background-image: radial-gradient(#1a1a1a 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .scanline {
          width: 100%;
          height: 100px;
          z-index: 10;
          background: linear-gradient(0deg, rgba(16, 185, 129, 0) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(16, 185, 129, 0) 100%);
          opacity: 0.1;
          position: absolute;
          bottom: 100%;
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
        }
        .bento-card {
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid #1a1a1a;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bento-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 0%;
          background: #10b981;
          transition: height 0.3s ease;
        }
        .bento-card:hover::before {
          height: 100%;
        }
        .btn-execute {
          background: #10b981;
          color: #010101;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
        }
        .status-dot {
          height: 6px;
          width: 6px;
          background-color: #10b981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}} />
      
      <div className="terminal-grid absolute inset-0 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Financial Protocol // 77-X2</div>
            <h1 className="text-3xl md:text-4xl font-bold italic tracking-tighter">
              SETTLEMENT <span className="text-white">LEDGER</span>
            </h1>
            <div className="text-[10px] mt-2 text-emerald-500/60 font-light flex items-center gap-4">
              <span>NODE: FIN-LND-01</span>
              <span className="flex items-center gap-2"><span className="status-dot"></span> ENGINE OPERATIONAL</span>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs opacity-40">COMMISSION DISBURSEMENT INTERFACE</div>
            <div className="text-lg font-bold text-white">SYS.REF: 0x882A</div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Statistics Bar */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bento-card p-4">
              <div className="text-[10px] uppercase opacity-50 mb-1">Total Payable Assets</div>
              <div className="text-2xl font-bold text-white">${totalPayable.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
            <div className="bento-card p-4">
              <div className="text-[10px] uppercase opacity-50 mb-1">Pending Authorizations</div>
              <div className="text-2xl font-bold text-emerald-500">
                {ledgerEntries.filter(e => e.status === 'PENDING').length} <span className="text-xs opacity-50 font-normal">UNITS</span>
              </div>
            </div>
            <div className="bento-card p-4">
              <div className="text-[10px] uppercase opacity-50 mb-1">Tax Compliance Index</div>
              <div className="text-2xl font-bold text-white">94.2%</div>
            </div>
          </div>

          {/* Main Ledger */}
          <section className="lg:col-span-8">
            <div className="bento-card p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-emerald-500"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider">Transaction Matrix</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1a1a1a] opacity-50">
                      <th className="pb-3 font-normal uppercase">Ref ID</th>
                      <th className="pb-3 font-normal uppercase">Partner ID</th>
                      <th className="pb-3 font-normal uppercase text-right">Volume</th>
                      <th className="pb-3 font-normal uppercase text-center">Comm %</th>
                      <th className="pb-3 font-normal uppercase">Tax</th>
                      <th className="pb-3 font-normal uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {ledgerEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-emerald-500/5 transition-colors">
                        <td className="py-4 font-bold text-white opacity-80">{entry.id}</td>
                        <td className="py-4 text-emerald-500">{entry.partnerId}</td>
                        <td className="py-4 text-right">${entry.amount.toLocaleString()}</td>
                        <td className="py-4 text-center">{entry.commission}%</td>
                        <td className="py-4">
                          <span className={`text-[9px] px-1.5 py-0.5 border ${entry.taxDoc === 'VERIFIED' ? 'border-emerald-500/30 text-emerald-500' : 'border-yellow-500/30 text-yellow-500'}`}>
                            {entry.taxDoc}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {entry.status === 'PAID' ? (
                            <span className="text-[10px] opacity-40">DISBURSED</span>
                          ) : entry.status === 'AUTHORIZED' ? (
                            <span className="text-[10px] text-white animate-pulse">SETTLING...</span>
                          ) : (
                            <button 
                              onClick={() => handleAuthorize(entry.id)}
                              disabled={authorizedId === entry.id}
                              className="text-[10px] bg-emerald-500/10 border border-emerald-500/40 px-2 py-1 hover:bg-emerald-500 hover:text-black transition-all"
                            >
                              {authorizedId === entry.id ? 'WAIT' : 'AUTHORIZE'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Disbursement Controls */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bento-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-white"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-white">Disbursement</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-black/50 border border-[#1a1a1a] p-4 rounded">
                  <div className="text-[10px] uppercase opacity-60 mb-2">Settlement Protocol</div>
                  <select className="w-full bg-[#050505] border border-[#1a1a1a] p-2 text-xs focus:border-emerald-500 outline-none">
                    <option>Standard T+2 ACH</option>
                    <option>Instant Wire (Fee Applies)</option>
                    <option>Crypto Settlement (USDT)</option>
                  </select>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase opacity-60">Authorize Batch</span>
                    <span className="text-[10px] text-emerald-500">READY</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-4">
                    ${totalPayable.toFixed(2)}
                  </div>
                  <button className="btn-execute w-full py-3 text-xs flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Commit Disbursement
                  </button>
                </div>
              </div>
            </div>

            <div className="bento-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-emerald-500"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider">Compliance</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-[#1a1a1a] pb-2">
                  <span className="opacity-60">W-9 Forms</span>
                  <span className="text-emerald-500">12/14</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-[#1a1a1a] pb-2">
                  <span className="opacity-60">1099 Exports</span>
                  <span className="text-white">READY</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-[#1a1a1a] pb-2">
                  <span className="opacity-60">Audit Trail</span>
                  <span className="text-emerald-500">ENCRYPTED</span>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Logs */}
          <section className="lg:col-span-12">
            <div className="bg-[#050505] border border-[#1a1a1a] p-3 font-mono text-[10px] uppercase tracking-widest flex justify-between">
              <span className="opacity-40">System Log Stream</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                LIVE FEED
              </span>
            </div>
            <div className="bg-black border-x border-b border-[#1a1a1a] p-4 h-32 overflow-y-auto text-[10px] space-y-1 opacity-60">
              <p>[08:44:21] SECURE CONNECTION ESTABLISHED WITH TREASURY NODE...</p>
              <p>[08:44:22] VERIFYING PARTNER MC-BRK-AT24 FOR PENDING SETTLEMENT...</p>
              <p className="text-white">[08:44:23] WARNING: PARTNER MC-AFF-MV24 TAX DOCUMENTATION EXPIRED</p>
              <p>[08:44:25] RE-CALCULATING COMMISSION OVERFLOW FOR Q2...</p>
              <p>[08:44:28] IDLE - WAITING FOR OPERATOR AUTHORIZATION...</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LedgerPage;