import React, { useState } from 'react';

export default function EarningsLedger() {
  const [earnings, setEarnings] = useState([
    { id: 101, date: '2023-12-01', dealName: 'Acme Manufacturing Expansion', source: 'Marcus Thorne', category: 'CPA', amount: 250000, commissionRate: 2, commission: 5000, status: 'Cleared' },
    { id: 102, date: '2023-12-15', dealName: 'Southwest Logistics Fleet', source: 'Sarah Jenkins', category: 'RE Agent', amount: 120000, commissionRate: 3, commission: 3600, status: 'Pending' },
    { id: 103, date: '2024-01-05', dealName: 'Blue Wave Dental Equipment', source: 'Equipment Direct', category: 'Dealer', amount: 85000, commissionRate: 5, commission: 4250, status: 'Processing' },
    { id: 104, date: '2024-01-12', dealName: 'Urban Coffee Co Inventory', source: 'Marcus Thorne', category: 'CPA', amount: 50000, commissionRate: 2, commission: 1000, status: 'Pending' },
    { id: 105, date: '2024-01-20', dealName: 'Horizon Tech Working Capital', source: 'Bank Manager Sam', category: 'Bank', amount: 500000, commissionRate: 1.5, commission: 7500, status: 'Cleared' },
  ]);

  const stats = {
    totalRevenue: earnings.reduce((sum, e) => sum + e.amount, 0),
    totalCommission: earnings.reduce((sum, e) => sum + e.commission, 0),
    pendingPayouts: earnings.filter(e => e.status !== 'Cleared').reduce((sum, e) => sum + e.commission, 0),
    clearedPayouts: earnings.filter(e => e.status === 'Cleared').reduce((sum, e) => sum + e.commission, 0)
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] text-slate-900">
      <style dangerouslySetInnerHTML={{ __html: `
        .hero-gradient { background: linear-gradient(135deg, #020617 0%, #1e293b 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .gold-text { color: #d4af37; }
        .bg-gold { background-color: #d4af37; }
        .border-gold { border-color: #d4af37; }
        .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
      `}} />

      {/* Header */}
      <header className="hero-gradient text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-500 text-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Financials</span>
              <span className="text-slate-400 text-sm">Commission Ledger v1.0</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Earnings & <span className="gold-text">Performance.</span></h1>
            <p className="text-slate-300 max-w-xl">
              Track deal flow, monitor your referral pipeline revenue, and manage payout schedules in real-time.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download Report
            </button>
            <button className="bg-gold text-slate-900 px-6 py-3 rounded-lg font-bold text-sm hover:scale-105 transition-all">
              Request Payout
            </button>
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <main className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue Generated</p>
            <h2 className="text-2xl font-black text-slate-900">${stats.totalRevenue.toLocaleString()}</h2>
            <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              +12.5% from last month
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gross Commissions</p>
            <h2 className="text-2xl font-black text-slate-900">${stats.totalCommission.toLocaleString()}</h2>
            <div className="mt-2 text-xs text-slate-400 font-medium">Lifetime network earnings</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Payouts</p>
            <h2 className="text-2xl font-black text-amber-600">${stats.pendingPayouts.toLocaleString()}</h2>
            <div className="mt-2 text-xs text-slate-400 font-medium">Estimated 3-5 business days</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 ring-2 ring-emerald-500/20">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cleared Commissions</p>
            <h2 className="text-2xl font-black text-emerald-600">${stats.clearedPayouts.toLocaleString()}</h2>
            <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Available for withdrawal
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 uppercase tracking-tighter">Deal Ledger & Commission History</h3>
            <div className="flex gap-2">
               <select className="text-xs font-bold border-slate-200 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-gold outline-none">
                  <option>All Time</option>
                  <option>Last 30 Days</option>
                  <option>Q4 2023</option>
               </select>
               <input type="text" placeholder="Search deals..." className="text-xs border-slate-200 rounded-md px-3 py-1.5 outline-none focus:border-gold" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-6 py-4 border-b">Date</th>
                  <th className="px-6 py-4 border-b">Funding Opportunity</th>
                  <th className="px-6 py-4 border-b">Referral Source</th>
                  <th className="px-6 py-4 border-b">Deal Size</th>
                  <th className="px-6 py-4 border-b">Rate</th>
                  <th className="px-6 py-4 border-b">Commission</th>
                  <th className="px-6 py-4 border-b text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {earnings.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                    <td className="px-6 py-5 text-slate-500 font-medium">{row.date}</td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{row.dealName}</p>
                      <p className="text-[10px] text-slate-400">ID: #{row.id}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {row.source.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">{row.source}</p>
                          <p className="text-[10px] text-slate-500">{row.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-900">${row.amount.toLocaleString()}</td>
                    <td className="px-6 py-5 text-slate-500">{row.commissionRate}%</td>
                    <td className="px-6 py-5 font-black text-slate-900">${row.commission.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        row.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700' : 
                        row.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50 text-center">
            <button className="text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-all">Load More Transaction Data</button>
          </div>
        </div>

        {/* Source Performance */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
             <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                Revenue Contribution by Source
             </h3>
             <div className="space-y-6">
                {[
                  { name: 'Marcus Thorne', amount: 300000, perc: 85, color: 'bg-gold' },
                  { name: 'Bank Manager Sam', amount: 500000, perc: 100, color: 'bg-slate-900' },
                  { name: 'Sarah Jenkins', amount: 120000, perc: 40, color: 'bg-emerald-500' },
                ].map((s, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-slate-700">{s.name}</span>
                      <span className="font-black text-slate-900">${s.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color}`} style={{ width: `${s.perc}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="bg-navy-deep rounded-2xl shadow-lg p-8 text-white flex flex-col justify-between" style={{ backgroundColor: '#020617' }}>
            <div>
              <h3 className="text-xl font-bold mb-4 gold-text">Network Quality Tip</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Referral sources from the <span className="text-white font-bold italic">CPA/Accountant</span> category currently have the highest conversion rate (18%) and an average deal size of $165k.
              </p>
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest">Projected Q1 Payout</p>
                <p className="text-3xl font-black">$12,850.00</p>
              </div>
            </div>
            <button className="w-full mt-8 border border-gold gold-text py-3 rounded-lg font-bold hover:bg-gold hover:text-navy-deep transition-all">
              Optimize Partner Network
            </button>
          </div>
        </section>
      </main>

      <footer className="text-center py-10 text-slate-400 text-sm border-t border-slate-200 bg-white">
        Moonshine Capital Commission Ledger &copy; 2024. All payouts subject to funder verification.
      </footer>
    </div>
  );
}