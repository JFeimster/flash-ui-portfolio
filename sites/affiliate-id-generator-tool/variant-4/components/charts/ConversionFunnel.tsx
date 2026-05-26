import React from 'react';

const ConversionFunnel: React.FC = () => {
  const metrics = [
    { label: 'TOP OF FUNNEL', sub: 'NETWORK REACH', value: '1,204,921', rate: '100%', width: 'w-full' },
    { label: 'ENGAGEMENT', sub: 'REFERRAL CLICKS', value: '45,202', rate: '3.75%', width: 'w-[85%]' },
    { label: 'PROVISIONING', sub: 'IDENTIFIERS ISSUED', value: '892', rate: '1.97%', width: 'w-[70%]' },
    { label: 'DEPLOYMENT', sub: 'CAPITAL FUNDED', value: '$42.5M', rate: '14.2%', width: 'w-[55%]' },
  ];

  return (
    <div className="bento-card p-6 relative bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden font-['JetBrains_Mono'] transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-emerald-500"></div>
        <div className="absolute top-0 right-0 h-full w-[1px] bg-emerald-500"></div>
      </div>

      <div className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em]">Network Conversion</h3>
          </div>
          <p className="text-[10px] text-emerald-500/50 uppercase tracking-widest">Protocol: ROI-772 / Capital Flow</p>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-white/30 uppercase block">Yield Index</span>
          <span className="text-xl font-bold text-emerald-500 italic leading-none">94.2<span className="text-[10px] ml-1 opacity-50 font-normal">PTS</span></span>
        </div>
      </div>

      <div className="space-y-4 relative flex flex-col items-center">
        {metrics.map((m, i) => (
          <div key={i} className="group relative w-full flex flex-col items-center">
            <div 
              className={`${m.width} h-14 bg-gradient-to-r from-emerald-500/5 via-[#0c0c0c] to-transparent border-l-2 border-emerald-500/20 group-hover:border-emerald-500 group-hover:from-emerald-500/10 transition-all duration-500 px-4 flex items-center justify-between relative overflow-hidden`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}
            >
              <div className="flex flex-col z-10">
                <span className="text-[8px] text-emerald-500/60 uppercase font-bold tracking-tighter">{m.label}</span>
                <span className="text-[10px] text-white/80 uppercase tracking-widest">{m.sub}</span>
              </div>
              <div className="text-right flex items-center gap-6 z-10">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-400 font-mono">{m.value}</span>
                  <span className="text-[8px] text-white/20 uppercase font-mono">Unit.Vol</span>
                </div>
                <div className="w-14 h-9 border border-emerald-500/10 flex items-center justify-center bg-black/60 relative group-hover:border-emerald-500/40 transition-colors">
                   <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <span className="text-[10px] text-emerald-500 font-bold italic">{m.rate}</span>
                </div>
              </div>
            </div>
            {i < metrics.length - 1 && (
              <div className="h-4 w-[1px] bg-gradient-to-b from-emerald-500/40 to-transparent"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-emerald-500/10">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic flex items-center gap-2">
            <span className="w-1 h-1 bg-white/40 rounded-full animate-pulse"></span>
            Capital Source Attribution
          </h4>
          <span className="text-[9px] px-2 py-0.5 border border-emerald-500/20 text-emerald-500/60 bg-emerald-500/5">SYNC_ACTIVE</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_5px_#10b981]"></span>
                <span className="text-emerald-500 font-bold">BRK // BROKERS</span>
              </div>
              <span className="text-white">$28.1M</span>
            </div>
            <div className="h-[3px] w-full bg-[#111] relative">
              <div className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" style={{ width: '66%' }}></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white/20"></span>
                <span className="text-white/40 font-bold">AFF // AFFILIATES</span>
              </div>
              <span className="text-white">$14.4M</span>
            </div>
            <div className="h-[3px] w-full bg-[#111] relative">
              <div className="absolute top-0 left-0 h-full bg-white/20" style={{ width: '34%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center opacity-20">
        <div className="flex gap-1.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-4 h-[1px] bg-emerald-500"></div>
          ))}
        </div>
        <span className="text-[8px] font-bold tracking-[0.3em]">SECURE DATA STREAM // LND-88</span>
      </div>
    </div>
  );
};

export default ConversionFunnel;
