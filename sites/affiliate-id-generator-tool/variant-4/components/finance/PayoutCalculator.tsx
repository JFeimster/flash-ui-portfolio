import React, { useState, useEffect } from 'react';

const PayoutCalculator: React.FC = () => {
  const [partnerId, setPartnerId] = useState('');
  const [volume, setVolume] = useState<number>(0);
  const [rate, setRate] = useState<number>(5);
  const [taxVerified, setTaxVerified] = useState(false);
  const [ledger, setLedger] = useState([
    { id: 'TX-9901', partner: 'MC-BRK-AT24', amount: 1250.00, date: '2024-05-10', status: 'SETTLED' },
    { id: 'TX-9842', partner: 'MC-REF-SJ23', amount: 450.25, date: '2024-05-08', status: 'SETTLED' },
    { id: 'TX-9711', partner: 'MC-AFF-MV24', amount: 3200.00, date: '2024-05-01', status: 'SETTLED' }
  ]);

  const commission = (volume * (rate / 100));
  const taxWithholding = taxVerified ? 0 : commission * 0.24;
  const netPayout = commission - taxWithholding;

  const handleAuthorize = () => {
    if (!partnerId || volume <= 0) return;
    
    const newEntry = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      partner: partnerId.toUpperCase(),
      amount: netPayout,
      date: new Date().toISOString().split('T')[0],
      status: 'DISBURSED'
    };

    setLedger([newEntry, ...ledger]);
    setVolume(0);
    setPartnerId('');
  };

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono'] p-4 md:p-8 relative overflow-hidden terminal-grid-bg">
      <style>{`
        .terminal-grid-bg {
          background-image: radial-gradient(#1a1a1a 1px, transparent 1px);
          background-size: 30px 30px;
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
          clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
          transition: all 0.3s ease;
        }
        .btn-disburse:hover:not(:disabled) {
          filter: brightness(1.2);
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
        }
        .btn-disburse:disabled {
          background: #1a1a1a;
          color: #333;
          cursor: not-allowed;
        }
        input, select {
          background: #050505 !important;
          border: 1px solid #1a1a1a !important;
          color: #10b981 !important;
        }
        input:focus {
          outline: none !important;
          border-color: #10b981 !important;
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
      `}</style>
      
      <div className="scanline"></div>

      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Financial Protocol // SET-882</div>
          <h1 className="text-3xl font-bold italic tracking-tighter">
            SETTLEMENT <span className="text-white">LEDGER</span>
          </h1>
        </div>
        <div className="text-right">
          <div className="text-[10px] opacity-40">LIQUIDITY ENGINE</div>
          <div className="text-sm font-bold text-white">SYSTEM READY</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calculator Section */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bento-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-[#10b981]"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest">Payout Params</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase mb-2 opacity-60">Partner ID</label>
                <input 
                  type="text" 
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  placeholder="MC-XXX-XXXX" 
                  className="w-full p-3 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase mb-2 opacity-60">Settlement Volume (USD)</label>
                <input 
                  type="number" 
                  value={volume || ''}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  placeholder="0.00" 
                  className="w-full p-3 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase mb-2 opacity-60">Commission Rate (%)</label>
                <select 
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full p-3 text-xs"
                >
                  <option value={1}>1.0% [Tier 4]</option>
                  <option value={3}>3.0% [Tier 3]</option>
                  <option value={5}>5.0% [Tier 2]</option>
                  <option value={10}>10.0% [Tier 1]</option>
                  <option value={15}>15.0% [Elite]</option>
                </select>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-[#1a1a1a]">
                <label className="text-[10px] uppercase opacity-60">Tax Compliance (W9/W8)</label>
                <button 
                  onClick={() => setTaxVerified(!taxVerified)}
                  className={`px-3 py-1 text-[10px] border ${taxVerified ? 'border-[#10b981] bg-[#10b981]/10 text-[#10b981]' : 'border-red-900 bg-red-900/10 text-red-500'}`}
                >
                  {taxVerified ? 'VERIFIED' : 'PENDING'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Breakdown Section */}
        <section className="lg:col-span-8">
          <div className="bento-card p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-white"></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">Disbursement Authorization</h2>
              </div>
              <div className="text-[10px] text-[#10b981] animate-pulse">● CALCULATION LIVE</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border border-[#1a1a1a] p-4 bg-[#050505]">
                <div className="text-[9px] uppercase opacity-40 mb-1">Gross Commission</div>
                <div className="text-xl font-bold">${commission.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
              <div className="border border-[#1a1a1a] p-4 bg-[#050505]">
                <div className="text-[9px] uppercase opacity-40 mb-1">Tax Withholding</div>
                <div className="text-xl font-bold text-red-500">-${taxWithholding.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
              <div className="border border-[#10b981]/30 p-4 bg-[#10b981]/5">
                <div className="text-[9px] uppercase text-[#10b981] mb-1">Net Settlement</div>
                <div className="text-xl font-bold text-white">${netPayout.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
            </div>

            <div className="mt-auto">
              <button 
                onClick={handleAuthorize}
                disabled={!partnerId || volume <= 0}
                className="btn-disburse w-full py-5 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Authorize Disbursement Protocol
              </button>
            </div>
          </div>
        </section>

        {/* Ledger Table */}
        <section className="lg:col-span-12">
          <div className="bento-card p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-[#10b981]"></div>
                <h2 className="text-sm font-bold uppercase tracking-widest">Active Settlement Ledger</h2>
              </div>
              <div className="text-[10px] opacity-40">AUTO-REFRESH: 30S</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-[#1a1a1a] opacity-50">
                    <th className="pb-4 font-normal uppercase tracking-widest">Tx ID</th>
                    <th className="pb-4 font-normal uppercase tracking-widest">Partner Node</th>
                    <th className="pb-4 font-normal uppercase tracking-widest">Settlement Date</th>
                    <th className="pb-4 font-normal uppercase tracking-widest">Amount</th>
                    <th className="pb-4 font-normal uppercase tracking-widest">Authorization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {ledger.map((entry, idx) => (
                    <tr key={idx} className="group hover:bg-[#10b981]/5 transition-colors">
                      <td className="py-4 text-white font-bold">{entry.id}</td>
                      <td className="py-4 text-[#10b981]">{entry.partner}</td>
                      <td className="py-4 opacity-60">{entry.date}</td>
                      <td className="py-4 text-white font-mono">${entry.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-[9px] border ${entry.status === 'SETTLED' ? 'border-[#10b981]/30 text-[#10b981]/70' : 'border-[#10b981] bg-[#10b981]/20 text-[#10b981]'}`}>
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="max-w-7xl mx-auto mt-8 flex justify-between items-center opacity-30 text-[9px] uppercase tracking-widest">
        <span>Terminal: LND-88-SETTLE</span>
        <span>Secure Financial Node // Encrypted</span>
      </footer>
    </div>
  );
};

export default PayoutCalculator;