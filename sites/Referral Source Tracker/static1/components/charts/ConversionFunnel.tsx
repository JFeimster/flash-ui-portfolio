import React from 'react';

const ConversionFunnel = () => {
  const funnelData = [
    { stage: 'Identified', count: 142, conversion: '100%', color: 'bg-slate-700' },
    { stage: 'Contacted', count: 88, conversion: '62%', color: 'bg-slate-600' },
    { stage: 'Meeting Set', count: 42, conversion: '47%', color: 'bg-amber-600' },
    { stage: 'Active Partner', count: 18, conversion: '43%', color: 'bg-emerald-600' },
  ];

  const nicheProductivity = [
    { niche: 'CPAs', volume: '$2.4M', deals: 14, heat: 'bg-emerald-500' },
    { niche: 'Biz Brokers', volume: '$1.8M', deals: 9, heat: 'bg-emerald-400' },
    { niche: 'Bankers', volume: '$950k', deals: 5, heat: 'bg-amber-500' },
    { niche: 'Real Estate', volume: '$420k', deals: 3, heat: 'bg-amber-400' },
    { niche: 'Equip. Dealers', volume: '$120k', deals: 1, heat: 'bg-slate-400' },
    { niche: 'Consultants', volume: '$0', deals: 0, heat: 'bg-slate-300' },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-xl border border-slate-200">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Referral Ecosystem</h3>
          <p className="text-sm text-slate-500">Performance across conversion stages and professional niches</p>
        </div>
        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> High</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Low</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Conversion Funnel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Pipeline Velocity</h4>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12.5% vs Last Mo</span>
          </div>
          
          <div className="relative pt-2">
            {funnelData.map((item, index) => (
              <div key={item.stage} className="relative mb-2 group">
                <div 
                  className={`${item.color} h-12 flex items-center justify-between px-4 rounded-lg transition-all duration-300 group-hover:brightness-110`}
                  style={{ width: `${100 - (index * 12)}%`, marginLeft: `${index * 6}%` }}
                >
                  <span className="text-white text-xs font-bold truncate">{item.stage}</span>
                  <span className="text-white/80 text-xs font-medium">{item.count}</span>
                </div>
                {index < funnelData.length - 1 && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500">↓ {item.conversion}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Niche Productivity Heat Map */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Niche Productivity Heat Map</h4>
          <div className="grid grid-cols-2 gap-3">
            {nicheProductivity.map((item) => (
              <div key={item.niche} className="flex flex-col p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-default">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-700">{item.niche}</span>
                  <div className={`w-3 h-3 rounded-full ${item.heat} shadow-sm shadow-inner`}></div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Volume</p>
                    <p className="text-sm font-black text-slate-900">{item.volume}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Deals</p>
                    <p className="text-sm font-black text-slate-900">{item.deals}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
        <div className="text-center border-r border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Avg Deal Size</p>
          <p className="text-lg font-bold text-[#d4af37]">$168,400</p>
        </div>
        <div className="text-center border-r border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Cycle Time</p>
          <p className="text-lg font-bold text-slate-800">22 Days</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Top Source</p>
          <p className="text-lg font-bold text-emerald-600">CPA Network</p>
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnel;