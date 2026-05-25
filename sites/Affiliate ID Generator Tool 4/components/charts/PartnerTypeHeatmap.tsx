import React, { useState, useEffect } from 'react';

const PartnerTypeHeatmap = () => {
  const [hoveredCell, setHoveredCell] = useState<{ type: string; day: number; value: number } | null>(null);

  const partnerTypes = ['BRK', 'REF', 'AFF', 'VND'];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  // Simulated high-density performance data (Conversion Rates %)
  const generateData = () => {
    return partnerTypes.map(type => 
      days.map(() => Math.floor(Math.random() * 45) + 55) // High performers 55-100%
    );
  };

  const data = generateData();

  const getIntensity = (val: number) => {
    if (val > 90) return 'bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
    if (val > 80) return 'bg-emerald-500 opacity-90';
    if (val > 70) return 'bg-emerald-600 opacity-70';
    if (val > 60) return 'bg-emerald-700 opacity-50';
    return 'bg-emerald-900 opacity-30';
  };

  return (
    <div className="bento-card p-6 bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden font-['JetBrains_Mono',_monospace]">
      <style dangerouslySetInnerHTML={{ __html: `
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
        .matrix-cell {
            transition: all 0.2s ease;
            clip-path: polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%);
        }
        .matrix-cell:hover {
            transform: scale(1.1);
            z-index: 10;
        }
      `}} />

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-6 bg-emerald-500"></div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-emerald-500">Network Performance Analytics</h2>
          </div>
          <p className="text-[10px] text-emerald-500/40 uppercase tracking-widest">Protocol: ROI_CONVERSION_MATRIX_V4</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-emerald-500/60 uppercase">System Status</div>
          <div className="flex items-center gap-2 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <span className="text-xs text-white font-bold">LIVE FEED</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Heatmap */}
        <div className="lg:col-span-3">
          <div className="flex mb-4">
            <div className="w-16"></div>
            <div className="flex-1 flex justify-around">
              {days.map(day => (
                <span key={day} className="text-[9px] text-emerald-500/50 font-bold">{day}</span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {partnerTypes.map((type, typeIdx) => (
              <div key={type} className="flex items-center group">
                <div className="w-16 text-[10px] font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {type} //
                </div>
                <div className="flex-1 flex justify-between gap-2">
                  {data[typeIdx].map((val, dayIdx) => (
                    <div
                      key={`${type}-${dayIdx}`}
                      onMouseEnter={() => setHoveredCell({ type, day: dayIdx, value: val })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`matrix-cell flex-1 h-10 ${getIntensity(val)} cursor-crosshair border border-black/20`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6 bg-black/40 p-4 border border-[#1a1a1a] relative">
          <div className="absolute top-0 right-0 p-1">
             <svg className="w-4 h-4 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          
          <div>
            <div className="text-[10px] uppercase text-emerald-500/60 mb-1">Target Threshold</div>
            <div className="text-xl font-bold text-white italic">82.4%</div>
            <div className="w-full bg-[#1a1a1a] h-1 mt-2">
              <div className="bg-emerald-500 h-full w-[82.4%]"></div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1a1a1a]">
            <div className="text-[10px] uppercase text-emerald-500/60 mb-3">Live Inspector</div>
            {hoveredCell ? (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-200">
                <div className="flex justify-between">
                  <span className="text-[10px] text-emerald-500/40">NODE:</span>
                  <span className="text-[10px] text-white">{hoveredCell.type}-{days[hoveredCell.day]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-emerald-500/40">CONV:</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{hoveredCell.value}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-emerald-500/40">ROI:</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{(hoveredCell.value * 1.4).toFixed(1)}x</span>
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-emerald-500/20 italic">Awaiting cursor input...</div>
            )}
          </div>

          <div className="pt-4 border-t border-[#1a1a1a]">
             <div className="text-[10px] uppercase text-emerald-500/60 mb-2">Dominant Entity</div>
             <div className="text-xs font-bold text-emerald-400 tracking-tighter">MC-BRK-NODE-PRIMARY</div>
             <div className="text-[9px] opacity-40 mt-1 uppercase italic">Generating 64% of total capital</div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[#1a1a1a] pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-900 opacity-30"></div>
            <span className="text-[9px] uppercase opacity-40">Dormant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500"></div>
            <span className="text-[9px] uppercase opacity-40">Optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[9px] uppercase opacity-40">Peak Output</span>
          </div>
        </div>
        <div className="text-[9px] text-emerald-500/40 font-bold tracking-[0.2em]">
          DATA_SYNC_SUCCESSFUL_//_ID:00912
        </div>
      </div>
    </div>
  );
};

export default PartnerTypeHeatmap;