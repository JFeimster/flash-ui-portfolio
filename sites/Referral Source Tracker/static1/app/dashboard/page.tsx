import React from 'react';

export default function AnalyticsDashboard() {
  const performanceData = [
    { category: 'CPA/Accountant', volume: '$1.2M', deals: 14, conversion: '24%', trend: '+12%', color: 'bg-emerald-500' },
    { category: 'Business Broker', volume: '$2.8M', deals: 8, conversion: '32%', trend: '+5%', color: 'bg-gold-500' },
    { category: 'Real Estate Agent', volume: '$450K', deals: 22, conversion: '12%', trend: '-2%', color: 'bg-amber-500' },
    { category: 'Bank Manager', volume: '$920K', deals: 5, conversion: '45%', trend: '+18%', color: 'bg-indigo-500' },
    { category: 'Equipment Dealer', volume: '$680K', deals: 11, conversion: '19%', trend: '+8%', color: 'bg-sky-500' },
  ];

  const topPartners = [
    { name: "Marcus Thorne", niche: "CPA", volume: "$840k", score: 98 },
    { name: "Elena Rodriguez", niche: "Broker", volume: "$720k", score: 94 },
    { name: "Julian Vane", niche: "Banker", volume: "$510k", score: 89 },
    { name: "Sarah Jenkins", niche: "Real Estate", volume: "$320k", score: 82 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-[#020617] text-white py-10 px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 bg-[#d4af37] rounded-full animate-pulse"></div>
              <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Live Ecosystem Analytics</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Performance <span className="text-[#d4af37]">Dashboard</span></h1>
            <p className="text-slate-400 mt-2 max-w-xl">Deep-dive into referral conversion metrics, niche productivity, and capital deployment velocity across your partner network.</p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all">Download Report</button>
            <a href="/" className="bg-[#d4af37] hover:bg-[#b8962e] text-[#020617] px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Tracker
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 -mt-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Deal Volume', val: '$6,050,000', sub: '+14.2% vs last month', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
            { label: 'Avg. Conversion Rate', val: '22.4%', sub: 'High: Bank Managers (45%)', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
            { label: 'Active Partners', val: '48', sub: '82% engagement rate', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
            { label: 'Network Yield', val: '$126k', sub: 'Revenue per referral source', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <svg className="text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d={kpi.icon}/></svg>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">LIVE</span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{kpi.val}</h3>
              <p className="text-xs text-slate-400 mt-2">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Heat Map Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Niche Productivity Heat Map</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-200"></span> LOW</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><span className="w-2 h-2 rounded-full bg-[#d4af37]"></span> PEAK</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {performanceData.map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-sm font-bold text-slate-700">{item.category}</span>
                        <span className="ml-2 text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{item.deals} Deals Closed</span>
                      </div>
                      <span className={`text-xs font-bold ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{item.trend}</span>
                    </div>
                    <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-[#d4af37] opacity-80 rounded-full transition-all duration-1000 group-hover:opacity-100"
                        style={{ width: `${(parseInt(item.volume.replace('$', '').replace('M', '')) / 3) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[10px] font-bold text-slate-400">VOLUME: {item.volume}</span>
                      <span className="text-[10px] font-bold text-slate-900">CONVERSION: {item.conversion}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-7 gap-1 h-12">
                {[20, 35, 65, 40, 85, 95, 70].map((h, i) => (
                  <div key={i} className="bg-[#020617]/5 rounded-sm flex items-end">
                    <div className="w-full bg-[#d4af37]/20 border-t-2 border-[#d4af37] rounded-sm" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          {/* Top Referrers & Quality Index */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Top Referral Partners
              </h3>
              <div className="space-y-4">
                {topPartners.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-[#d4af37]/30 hover:bg-slate-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#020617] text-[#d4af37] flex items-center justify-center font-bold text-xs border border-white/10">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{p.niche} • {p.volume} Volume</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-900">{p.score}</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Score</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                View All Partners
              </button>
            </div>

            <div className="bg-[#020617] rounded-2xl shadow-lg border border-white/5 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <h3 className="font-bold text-[#d4af37] mb-1">Lead Velocity</h3>
                <p className="text-2xl font-black mb-1">8.4 Days</p>
                <p className="text-xs text-slate-400 leading-tight">Average time from referral to initial funding offer. That's 15% faster than Q3.</p>
                <div className="mt-4 flex gap-1">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= 8 ? 'bg-[#d4af37]' : 'bg-white/10'}`}></div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-12 text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">Moonshine Capital • Quantitative Partner Analysis • v2.4.0</p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}