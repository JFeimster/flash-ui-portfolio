import React, { useState, useEffect } from 'react';

const Payouts = () => {
  const [authorizedAmount, setAuthorizedAmount] = useState<string>('');
  const [partnerId, setPartnerId] = useState<string>('');
  const [settlementLogs, setSettlementLogs] = useState([
    { id: 'SET-99021', partner: 'MC-BRK-AT24', amount: 4500.00, tax: 'W9-VERIFIED', status: 'SETTLED', date: '2024-05-18' },
    { id: 'SET-99025', partner: 'MC-REF-SJ23', amount: 1250.50, tax: 'W9-VERIFIED', status: 'PENDING', date: '2024-05-19' },
    { id: 'SET-99028', partner: 'MC-AFF-MV24', amount: 890.00, tax: 'PENDING', status: 'HOLD', date: '2024-05-20' },
  ]);

  const executeDisbursement = () => {
    if (!authorizedAmount || !partnerId) return;
    
    const newEntry = {
      id: `SET-${Math.floor(Math.random() * 100000)}`,
      partner: partnerId,
      amount: parseFloat(authorizedAmount),
      tax: 'W9-VERIFIED',
      status: 'AUTHORIZED',
      date: new Date().toISOString().split('T')[0]
    };
    
    setSettlementLogs([newEntry, ...settlementLogs]);
    setAuthorizedAmount('');
    setPartnerId('');
  };

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono',monospace] p-4 md:p-8 relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --emerald: #10b981;
          --black: #010101;
          --dark-gray: #0a0a0a;
          --border: #1a1a1a;
        }

        .terminal-grid {
          background-image: radial-gradient(var(--border) 1px, transparent 1px);
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
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        .bento-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 0%;
          background: var(--emerald);
          transition: height 0.3s ease;
        }

        .bento-card:hover::before {
          height: 100%;
        }

        .btn-execute {
          background: var(--emerald);
          color: var(--black);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
        }

        .btn-execute:hover {
          filter: brightness(1.2);
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
        }

        .status-dot {
          height: 6px;
          width: 6px;
          background-color: var(--emerald);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px var(--emerald);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        input, select {
          background: #050505 !important;
          border: 1px solid var(--border) !important;
          color: var(--emerald) !important;
          outline: none !important;
        }

        input:focus {
          border-color: var(--emerald) !important;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
        }
      `}} />

      <div className="scanline"></div>
      <div className="terminal-grid absolute inset-0 pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6 relative z-20">
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Financial Protocol // 77-X</div>
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tighter">
            COMMISSION <span className="text-white">LEDGER</span>
          </h1>
          <div className="text-[10px] mt-2 text-emerald-500/60 font-light flex items-center gap-4">
            <span>NODE: SETTLE-01</span>
            <span className="flex items-center gap-2"><span className="status-dot"></span> LEDGER LIVE</span>
            <span>LIQUIDITY: OPTIMAL</span>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs opacity-40">SETTLEMENT INTERFACE</div>
          <div className="text-lg font-bold">V.2.1.0-SECURE</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-20">
        
        {/* Top Stats Overview */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Pending Settlement', val: '$14,205.50', color: 'text-emerald-500' },
            { label: 'Authorized Today', val: '$6,400.00', color: 'text-white' },
            { label: 'Avg Payout Cycle', val: '4.2 DAYS', color: 'text-emerald-500' },
            { label: 'Tax Compliance', val: '98.2%', color: 'text-emerald-500' }
          ].map((stat, i) => (
            <div key={i} className="bento-card p-4 border-l-4 border-l-emerald-500">
              <div className="text-[10px] uppercase opacity-50 mb-1">{stat.label}</div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.val}</div>
            </div>
          ))}
        </div>

        {/* Left: Disbursement Authorization */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bento-card p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-emerald-500"></div>
              <h2 className="text-lg font-bold uppercase tracking-wider">Authorize Payout</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase mb-2 opacity-60">Target Partner ID</label>
                <input 
                  type="text" 
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value.toUpperCase())}
                  placeholder="MC-XXX-XXXX" 
                  className="w-full p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase mb-2 opacity-60">Gross Amount (USD)</label>
                <input 
                  type="number" 
                  value={authorizedAmount}
                  onChange={(e) => setAuthorizedAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase mb-2 opacity-60">Settlement Type</label>
                <select className="w-full p-3 text-sm">
                  <option>COMMISSION_FEE</option>
                  <option>REFERRAL_BONUS</option>
                  <option>RECURRING_RESIDUAL</option>
                  <option>ADJUSTMENT_CREDIT</option>
                </select>
              </div>

              <div className="p-3 border border-emerald-500/10 bg-emerald-500/5 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] opacity-60 uppercase">Tax Withholding (Est)</span>
                  <span className="text-xs font-bold text-white">$0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] opacity-60 uppercase">Net Disbursement</span>
                  <span className="text-xs font-bold text-emerald-500">${authorizedAmount || '0.00'}</span>
                </div>
              </div>

              <button 
                onClick={executeDisbursement}
                className="btn-execute w-full py-4 mt-2 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Execute Disbursement
              </button>
            </div>
          </div>
        </section>

        {/* Right: Ledger View */}
        <section className="lg:col-span-8">
          <div className="bento-card p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-white"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-white">Settlement History</h2>
              </div>
              <div className="flex gap-2">
                <button className="text-[10px] px-3 py-1 border border-border hover:border-emerald-500 transition-colors uppercase">Export CSV</button>
                <button className="text-[10px] px-3 py-1 border border-border hover:border-emerald-500 transition-colors uppercase">Filter</button>
              </div>
            </div>

            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1a1a1a] opacity-50">
                    <th className="pb-3 font-normal uppercase tracking-widest">Settlement ID</th>
                    <th className="pb-3 font-normal uppercase tracking-widest">Partner</th>
                    <th className="pb-3 font-normal uppercase tracking-widest">Amount</th>
                    <th className="pb-3 font-normal uppercase tracking-widest">Tax Doc</th>
                    <th className="pb-3 font-normal uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {settlementLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-emerald-500/5 transition-colors group">
                      <td className="py-4 font-bold text-white opacity-80 group-hover:opacity-100">{log.id}</td>
                      <td className="py-4 text-emerald-500">{log.partner}</td>
                      <td className="py-4 font-bold text-emerald-100">${log.amount.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`text-[9px] px-2 py-0.5 border ${log.tax === 'PENDING' ? 'border-yellow-500/40 text-yellow-500' : 'border-emerald-500/40 text-emerald-500'}`}>
                          {log.tax}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'SETTLED' ? 'bg-emerald-500' : log.status === 'HOLD' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                          <span className="opacity-60">{log.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#1a1a1a] flex justify-between items-center text-[10px] opacity-40">
              <span>SHOWING {settlementLogs.length} RECENT TRANSACTIONS</span>
              <span className="cursor-pointer hover:text-emerald-500 transition-colors uppercase tracking-widest">Load Full Archive →</span>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="lg:col-span-12 text-center py-8">
          <div className="text-[10px] opacity-30 uppercase tracking-[0.5em]">
            Security Notice: All disbursements are logged and subject to KYC/AML audit protocols.
          </div>
        </section>
      </main>
    </div>
  );
};

export default Payouts;