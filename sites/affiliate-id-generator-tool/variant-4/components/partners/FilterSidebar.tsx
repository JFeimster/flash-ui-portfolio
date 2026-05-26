import React from 'react';

const FilterSidebar: React.FC = () => {
  return (
    <aside className="w-full lg:w-80 flex flex-col gap-6">
      <div className="bento-card p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-6 bg-emerald-500"></div>
          <h2 className="text-lg font-bold uppercase tracking-wider italic">Filter Protocols</h2>
        </div>

        <div className="space-y-8">
          {/* Search Term */}
          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-[0.2em] opacity-50">
              Entity Search
            </label>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="UID / NAME / REGISTRY" 
                className="w-full bg-[#050505] border border-[#1a1a1a] p-3 text-xs text-emerald-500 focus:outline-none focus:border-emerald-500 transition-all font-mono"
              />
              <div className="absolute right-3 top-3 opacity-30 group-focus-within:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Partner Type */}
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-[0.2em] opacity-50">
              Partner Classification
            </label>
            <div className="space-y-2">
              {[
                { id: 'BRK', label: 'Brokerage' },
                { id: 'REF', label: 'Referral Node' },
                { id: 'AFF', label: 'Affiliate Branch' },
                { id: 'VND', label: 'Vendor Entity' }
              ].map((type) => (
                <label key={type.id} className="flex items-center justify-between group cursor-pointer border border-[#1a1a1a] p-3 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="appearance-none w-3 h-3 border border-[#1a1a1a] checked:bg-emerald-500 checked:border-emerald-500 transition-all rounded-none"
                    />
                    <span className="text-[11px] uppercase tracking-wider opacity-70 group-hover:opacity-100">{type.label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500/40 group-hover:text-emerald-500">[{type.id}]</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Select */}
          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-[0.2em] opacity-50">
              Operational Status
            </label>
            <select className="w-full bg-[#050505] border border-[#1a1a1a] p-3 text-xs text-emerald-500 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer">
              <option value="all">ALL_SYSTEMS_GO</option>
              <option value="active">ACTIVE_NODE</option>
              <option value="pending">PENDING_SYNC</option>
              <option value="flagged">SECURITY_FLAG</option>
              <option value="terminated">TERMINATED</option>
            </select>
          </div>

          {/* Registration Year */}
          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-[0.2em] opacity-50">
              Temporal Cycle
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['2021', '2022', '2023', '2024'].map((year) => (
                <button 
                  key={year}
                  className="border border-[#1a1a1a] py-2 text-[10px] uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 transition-all opacity-60 hover:opacity-100"
                >
                  CY-{year}
                </button>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 space-y-4">
            <button className="btn-execute w-full py-4 text-xs flex items-center justify-center gap-2 group">
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Datastream
            </button>
            
            <button className="w-full py-3 border border-[#1a1a1a] text-[10px] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:bg-red-500/10 hover:border-red-500/50 transition-all">
              Purge Filters
            </button>
          </div>
        </div>
      </div>

      {/* Meta Information Card */}
      <div className="bento-card p-4 border-emerald-500/10">
        <div className="flex justify-between items-start mb-4">
          <div className="text-[9px] uppercase tracking-tighter opacity-40">Network Load</div>
          <div className="text-[9px] text-emerald-500 font-bold">OPTIMAL</div>
        </div>
        <div className="h-1 w-full bg-[#1a1a1a] mb-2 overflow-hidden">
          <div className="h-full bg-emerald-500/40 w-1/3 animate-pulse"></div>
        </div>
        <div className="flex justify-between text-[8px] opacity-30 uppercase font-mono">
          <span>Buffer: 12ms</span>
          <span>Nodes: 1,402</span>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;