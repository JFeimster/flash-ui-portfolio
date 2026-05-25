import React, { useState, useMemo } from 'react';

interface Partner {
  id: string;
  name: string;
  company: string;
  type: 'BRK' | 'REF' | 'AFF' | 'VND';
  status: 'ACTIVE' | 'STANDBY' | 'TERMINATED';
  regYear: string;
  performance: number;
  lastActivity: string;
}

const PartnerDataGrid: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const partners: Partner[] = [
    { id: 'MC-BRK-AT24', name: 'Alexander Thorne', company: 'Thorne Equities', type: 'BRK', status: 'ACTIVE', regYear: '2024', performance: 94.2, lastActivity: '2023-05-12' },
    { id: 'MC-REF-SJ23', name: 'Sarah Jenkins', company: 'Direct Flow LLC', type: 'REF', status: 'ACTIVE', regYear: '2023', performance: 88.5, lastActivity: '2023-11-20' },
    { id: 'MC-AFF-MV24', name: 'Marcus Vane', company: 'Vane Global', type: 'AFF', status: 'STANDBY', regYear: '2024', performance: 42.1, lastActivity: '2024-01-05' },
    { id: 'MC-VND-ER24', name: 'Elena Rossi', company: 'Rossi Systems', type: 'VND', status: 'ACTIVE', regYear: '2024', performance: 99.8, lastActivity: '2024-02-18' },
    { id: 'MC-BRK-JC23', name: 'Julian Chen', company: 'Summit Capital', type: 'BRK', status: 'TERMINATED', regYear: '2023', performance: 12.4, lastActivity: '2023-09-30' },
    { id: 'MC-AFF-KL24', name: 'Kira Laurent', company: 'Laurent Logistics', type: 'AFF', status: 'ACTIVE', regYear: '2024', performance: 76.3, lastActivity: '2024-04-01' },
  ];

  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const matchType = filterType === 'ALL' || p.type === filterType;
      const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.company.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [filterType, filterStatus, searchTerm]);

  return (
    <div className="w-full space-y-6 font-['JetBrains_Mono'] text-[#10b981]">
      <style>{`
        .bento-card {
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid #1a1a1a;
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
          background: #10b981;
          transition: height 0.3s ease;
        }
        .bento-card:hover::before {
          height: 100%;
        }
        .status-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .btn-drill {
          clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
        }
      `}</style>

      {/* Control Panel */}
      <div className="bento-card p-6 border-b-2 border-emerald-500/20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tighter uppercase italic">Portfolio Manager</h2>
            <p className="text-[10px] opacity-50 uppercase tracking-widest">Network Lifecycle Registry // R-99</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:w-auto">
            <div>
              <label className="block text-[9px] uppercase mb-1 opacity-60">Search Protocol</label>
              <input 
                type="text" 
                placeholder="ID / NAME / ENTITY"
                className="bg-[#050505] border border-[#1a1a1a] text-[#10b981] p-2 text-xs w-full focus:outline-none focus:border-[#10b981] transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase mb-1 opacity-60">Classification</label>
              <select 
                className="bg-[#050505] border border-[#1a1a1a] text-[#10b981] p-2 text-xs w-full focus:outline-none focus:border-[#10b981]"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">ALL TYPES</option>
                <option value="BRK">BROKER [BRK]</option>
                <option value="REF">REFERRAL [REF]</option>
                <option value="AFF">AFFILIATE [AFF]</option>
                <option value="VND">VENDOR [VND]</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] uppercase mb-1 opacity-60">Operational Status</label>
              <select 
                className="bg-[#050505] border border-[#1a1a1a] text-[#10b981] p-2 text-xs w-full focus:outline-none focus:border-[#10b981]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">ALL STATUS</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="STANDBY">STANDBY</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                <th className="p-4 text-[10px] uppercase tracking-widest opacity-40 font-medium">Entity / ID</th>
                <th className="p-4 text-[10px] uppercase tracking-widest opacity-40 font-medium">Type</th>
                <th className="p-4 text-[10px] uppercase tracking-widest opacity-40 font-medium">Performance Index</th>
                <th className="p-4 text-[10px] uppercase tracking-widest opacity-40 font-medium">Lifecycle Stage</th>
                <th className="p-4 text-[10px] uppercase tracking-widest opacity-40 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-emerald-500/5 transition-colors group">
                  <td className="p-4">
                    <div className="text-sm font-bold text-emerald-50 group-hover:text-white transition-colors">{partner.name}</div>
                    <div className="text-[10px] opacity-50 flex items-center gap-2">
                      <span className="text-emerald-500">{partner.id}</span>
                      <span className="h-1 w-1 bg-[#1a1a1a] rounded-full"></span>
                      <span>{partner.company}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] px-2 py-0.5 border border-emerald-900 bg-emerald-900/10 text-emerald-400">
                      {partner.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="w-full max-w-[120px] bg-[#1a1a1a] h-1 rounded-full overflow-hidden mb-1">
                      <div 
                        className={`h-full ${partner.performance > 80 ? 'bg-emerald-500' : partner.performance > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${partner.performance}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] font-bold">{partner.performance}% EFFICIENCY</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full status-pulse ${
                        partner.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                        partner.status === 'STANDBY' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        {partner.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="btn-drill bg-[#10b981] text-[#010101] text-[10px] font-black px-4 py-1.5 uppercase hover:brightness-125 transition-all active:scale-95">
                      Drill Down
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPartners.length === 0 && (
            <div className="p-12 text-center text-emerald-500/30 text-xs uppercase tracking-widest italic">
              No matching entities found in current sector.
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Nodes', val: partners.length },
          { label: 'Active Channels', val: partners.filter(p => p.status === 'ACTIVE').length },
          { label: 'Avg Efficiency', val: '72.2%' },
          { label: 'System Load', val: '0.04ms' }
        ].map((stat, i) => (
          <div key={i} className="bento-card p-3 border-l-2 border-emerald-500/40">
            <div className="text-[8px] uppercase opacity-40 mb-1">{stat.label}</div>
            <div className="text-sm font-bold text-emerald-100 italic">{stat.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerDataGrid;