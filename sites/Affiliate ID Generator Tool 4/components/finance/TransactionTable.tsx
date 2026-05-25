import React, { useState } from 'react';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([
    { id: 'MC-BRK-AT24', name: 'Alexander Thorne', volume: 1250000, rate: 1.5, taxStatus: 'VERIFIED', status: 'PENDING' },
    { id: 'MC-REF-SJ23', name: 'Sarah Jenkins', volume: 450000, rate: 0.5, taxStatus: 'VERIFIED', status: 'AUTHORIZED' },
    { id: 'MC-AFF-MV24', name: 'Marcus Vane', volume: 890000, rate: 1.25, taxStatus: 'MISSING', status: 'HOLD' },
    { id: 'MC-VND-ER24', name: 'Elena Rossi', volume: 2100000, rate: 2.0, taxStatus: 'VERIFIED', status: 'PENDING' },
    { id: 'MC-BRK-JC23', name: 'Julian Chen', volume: 675000, rate: 1.5, taxStatus: 'VERIFIED', status: 'DISBURSED' },
  ]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono',monospace] p-4 md:p-8 relative overflow-hidden">
      <style>{`
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
        .btn-disburse {
          background: #10b981;
          color: #010101;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
        }
        .btn-disburse:hover {
          filter: brightness(1.2);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
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
      `}</style>

      <div className="scanline"></div>
      <div className="absolute inset-0 terminal-grid pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6">
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Financial Protocol // 77-FIX</div>
            <h1 className="text-3xl md:text-4xl font-bold italic tracking-wider">
              SETTLEMENT <span className="text-white">LEDGER</span>
            </h1>
            <div className="text-[10px] mt-2 text-emerald-500/60 font-light flex items-center gap-4">
              <span>LEDGER ACTIVE</span>
              <span className="flex items-center gap-2"><span className="status-dot"></span> SYNCED TO MAINNET</span>
              <span>BATCH: #772-X</span>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs opacity-40 uppercase">Commission Engine</div>
            <div className="text-lg font-bold">V.2.1-STABLE</div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Volume', value: '$5,365,000', color: 'text-white' },
            { label: 'Owed Commission', value: '$63,225', color: 'text-emerald-400' },
            { label: 'Next Batch Date', value: '2024-06-01', color: 'text-white' },
            { label: 'Pending Docs', value: '01 WARNING', color: 'text-yellow-500' }
          ].map((stat, i) => (
            <div key={i} className="bento-card p-4 bg-black/40">
              <div className="text-[9px] uppercase opacity-40 mb-1">{stat.label}</div>
              <div className={`text-xl font-bold tracking-tighter ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Ledger Table */}
        <section className="bento-card overflow-hidden">
          <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-center bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-emerald-500"></div>
              <h2 className="text-lg font-bold uppercase tracking-widest">Transaction Matrix</h2>
            </div>
            <div className="flex gap-4">
               <input 
                type="text" 
                placeholder="SEARCH PARTNER ID..." 
                className="bg-[#050505] border border-[#1a1a1a] text-[10px] px-4 py-2 focus:border-emerald-500 focus:outline-none transition-all w-64 uppercase"
               />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-black/40">
                  <th className="p-4 text-[10px] uppercase tracking-widest opacity-40">Partner Identifier</th>
                  <th className="p-4 text-[10px] uppercase tracking-widest opacity-40 text-right">Gross Volume</th>
                  <th className="p-4 text-[10px] uppercase tracking-widest opacity-40 text-center">Rate</th>
                  <th className="p-4 text-[10px] uppercase tracking-widest opacity-40 text-right">Commission</th>
                  <th className="p-4 text-[10px] uppercase tracking-widest opacity-40 text-center">Tax Status</th>
                  <th className="p-4 text-[10px] uppercase tracking-widest opacity-40 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {transactions.map((tx, idx) => {
                  const comm = (tx.volume * tx.rate) / 100;
                  return (
                    <tr key={idx} className="hover:bg-emerald-500/5 transition-colors group">
                      <td className="p-4">
                        <div className="text-white font-bold text-sm">{tx.id}</div>
                        <div className="text-[10px] opacity-40">{tx.name}</div>
                      </td>
                      <td className="p-4 text-right text-emerald-100/80 font-mono text-sm">
                        {formatCurrency(tx.volume)}
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[10px] bg-[#1a1a1a] px-2 py-1 rounded border border-emerald-900/30">
                          {tx.rate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4 text-right text-emerald-400 font-bold">
                        {formatCurrency(comm)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[9px] font-bold px-2 py-0.5 border ${
                          tx.taxStatus === 'VERIFIED' 
                            ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10' 
                            : 'border-red-500/40 text-red-500 bg-red-500/10'
                        }`}>
                          {tx.taxStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {tx.status === 'DISBURSED' ? (
                          <span className="text-[10px] opacity-30 italic">COMPLETE</span>
                        ) : (
                          <button className="btn-disburse px-4 py-2 text-[10px]">
                            {tx.status === 'HOLD' ? 'RELEASE' : 'AUTHORIZE'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#1a1a1a] bg-black/40 flex justify-between items-center">
            <div className="text-[10px] opacity-40">
              SHOWING {transactions.length} ACTIVE ENTRIES IN CURRENT BUFFER
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-[#1a1a1a] hover:border-emerald-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button className="p-2 border border-[#1a1a1a] hover:border-emerald-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-2 italic"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> SYSTEM READY</span>
            <span className="opacity-40">|</span>
            <span className="hover:text-white cursor-pointer transition-colors">EXPORT_CSV.EXE</span>
            <span className="hover:text-white cursor-pointer transition-colors">AUDIT_LOG.LOG</span>
          </div>
          <div className="text-[10px] uppercase tracking-tighter">
            Authorized Personnel Only // Moonshine Financial Services 2024
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;