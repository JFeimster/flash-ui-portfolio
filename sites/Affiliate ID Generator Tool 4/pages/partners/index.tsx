import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ExternalLink, 
  Activity, 
  Shield, 
  Users, 
  BarChart3,
  MoreVertical,
  ArrowUpRight,
  Zap,
  Globe
} from 'lucide-react';

const PartnerPortfolioManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activePartner, setActivePartner] = useState(null);

  const partners = [
    { id: 'MC-BRK-AT24', name: 'Alexander Thorne', entity: 'Thorne Equities', type: 'BRK', status: 'ACTIVE', registered: '2024-05-12', performance: 88, volume: '$1.2M', region: 'NA' },
    { id: 'MC-REF-SJ23', name: 'Sarah Jenkins', entity: 'Direct Flow LLC', type: 'REF', status: 'ACTIVE', registered: '2023-11-20', performance: 94, volume: '$450K', region: 'EU' },
    { id: 'MC-AFF-MV24', name: 'Marcus Vane', entity: 'Vane Global', type: 'AFF', status: 'SUSPENDED', registered: '2024-01-05', performance: 12, volume: '$0', region: 'ASIA' },
    { id: 'MC-VND-ER24', name: 'Elena Rossi', entity: 'Rossi Systems', type: 'VND', status: 'ACTIVE', registered: '2024-02-18', performance: 76, volume: '$2.1M', region: 'EU' },
    { id: 'MC-BRK-JC23', name: 'Julian Chen', entity: 'Summit Capital', type: 'BRK', status: 'ACTIVE', registered: '2023-09-30', performance: 91, volume: '$3.4M', region: 'NA' },
    { id: 'MC-REF-KL24', name: 'Kira Laurent', entity: 'Laurent & Co', type: 'REF', status: 'PROVISIONED', registered: '2024-06-01', performance: 0, volume: '$0', region: 'EU' },
  ];

  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'ALL' || p.type === selectedType;
      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedType, selectedStatus]);

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono'] p-4 md:p-8 relative overflow-hidden">
      <Head>
        <title>Portfolio Manager // Moonshine Capital</title>
      </Head>

      <style jsx global>{`
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
          position: fixed;
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
        .bento-card:hover::before { height: 100%; }
        .btn-action {
          background: var(--emerald);
          color: var(--black);
          clip-path: polygon(0 0, 92% 0, 100% 25%, 100% 100%, 8% 100%, 0 75%);
        }
        .status-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--black); }
        ::-webkit-scrollbar-thumb { background: var(--border); }
        ::-webkit-scrollbar-thumb:hover { background: var(--emerald); }
      `}</style>

      <div className="scanline"></div>
      <div className="terminal-grid fixed inset-0 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1a1a1a] pb-6 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Portfolio Management System</div>
            <h1 className="text-3xl font-bold italic tracking-tighter">
              PARTNER <span className="text-white">REGISTRY</span>
            </h1>
            <div className="text-[10px] mt-2 text-emerald-500/60 font-light flex items-center gap-4">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full status-pulse shadow-[0_0_8px_var(--emerald)]"></div> SYSTEM ONLINE</span>
              <span>ENTITIES: {partners.length}</span>
              <span>UPLINK: SECURE</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-action px-6 py-2 text-xs font-bold uppercase tracking-widest hover:brightness-125 transition-all">
              Export Manifest
            </button>
          </div>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Nodes', val: '84%', icon: Activity },
            { label: 'Network Volume', val: '$7.4M', icon: BarChart3 },
            { label: 'Security Level', val: 'Level 4', icon: Shield },
            { label: 'Provisioned', val: '12', icon: Users },
          ].map((stat, i) => (
            <div key={i} className="bento-card p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase opacity-40">{stat.label}</div>
                <div className="text-xl font-bold text-white">{stat.val}</div>
              </div>
              <stat.icon className="w-5 h-5 opacity-20" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bento-card p-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input 
                  type="text" 
                  placeholder="SEARCH BY IDENTIFIER OR NAME..." 
                  className="w-full bg-[#050505] border border-[#1a1a1a] p-2 pl-10 text-xs focus:border-emerald-500 outline-none transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="bg-[#050505] border border-[#1a1a1a] p-2 text-[10px] uppercase outline-none focus:border-emerald-500"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="ALL">All Types</option>
                  <option value="BRK">Broker</option>
                  <option value="REF">Referral</option>
                  <option value="AFF">Affiliate</option>
                  <option value="VND">Vendor</option>
                </select>
                <select 
                  className="bg-[#050505] border border-[#1a1a1a] p-2 text-[10px] uppercase outline-none focus:border-emerald-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PROVISIONED">Provisioned</option>
                </select>
              </div>
            </div>

            <div className="bento-card overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-emerald-500/5 opacity-70">
                    <th className="p-4 font-normal uppercase tracking-widest">Identifier</th>
                    <th className="p-4 font-normal uppercase tracking-widest">Entity Name</th>
                    <th className="p-4 font-normal uppercase tracking-widest">Status</th>
                    <th className="p-4 font-normal uppercase tracking-widest text-right">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {filteredPartners.map((p) => (
                    <tr 
                      key={p.id} 
                      onClick={() => setActivePartner(p)}
                      className={`cursor-pointer transition-colors hover:bg-emerald-500/5 group ${activePartner?.id === p.id ? 'bg-emerald-500/10' : ''}`}
                    >
                      <td className="p-4 font-bold tracking-tighter">{p.id}</td>
                      <td className="p-4">
                        <div className="text-emerald-100">{p.name}</div>
                        <div className="text-[10px] opacity-40">{p.entity}</div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[9px] px-2 py-0.5 border ${
                          p.status === 'ACTIVE' ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/5' :
                          p.status === 'SUSPENDED' ? 'border-red-500/40 text-red-500 bg-red-500/5' :
                          'border-blue-500/40 text-blue-500 bg-blue-500/5'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${p.performance}%` }}></div>
                          </div>
                          <span className="text-white">{p.performance}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPartners.length === 0 && (
                <div className="p-12 text-center opacity-40 text-xs italic uppercase">No matching entities found in database.</div>
              )}
            </div>
          </div>

          {/* Drill-down Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bento-card p-6 h-full min-h-[400px]">
              {activePartner ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] uppercase text-emerald-500 font-bold mb-1">Entity Details // {activePartner.id}</div>
                      <h2 className="text-2xl font-bold text-white tracking-tighter italic uppercase">{activePartner.name}</h2>
                    </div>
                    <button className="p-2 border border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#050505] p-3 border border-[#1a1a1a]">
                      <div className="text-[9px] uppercase opacity-40 mb-1">Total Volume</div>
                      <div className="text-lg font-bold">{activePartner.volume}</div>
                    </div>
                    <div className="bg-[#050505] p-3 border border-[#1a1a1a]">
                      <div className="text-[9px] uppercase opacity-40 mb-1">Global Region</div>
                      <div className="text-lg font-bold flex items-center gap-2"><Globe className="w-3 h-3 text-emerald-500" /> {activePartner.region}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[10px] uppercase opacity-40 border-b border-[#1a1a1a] pb-1">Activity Log</div>
                    {[
                      { msg: 'System check-in successful', time: '2h ago' },
                      { msg: 'Volume threshold reached', time: '1d ago' },
                      { msg: 'Lifecycle state: ACTIVE', time: '5d ago' },
                    ].map((log, i) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <span className="opacity-80 flex items-center gap-2"><Zap className="w-2.5 h-2.5 text-yellow-500" /> {log.msg}</span>
                        <span className="opacity-30">{log.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[#1a1a1a]">
                    <div className="text-[10px] uppercase opacity-40 mb-4 italic">Management Protocols</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="text-[10px] font-bold uppercase py-2 border border-[#1a1a1a] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all">Suspend Node</button>
                      <button className="text-[10px] font-bold uppercase py-2 border border-[#1a1a1a] hover:bg-emerald-500/10 transition-all">Edit Metadata</button>
                      <button className="col-span-2 text-[10px] font-bold uppercase py-3 bg-[#111] border border-[#1a1a1a] hover:border-emerald-500 transition-all flex items-center justify-center gap-2">
                        Open Full Dossier <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                  <Activity className="w-12 h-12" />
                  <div className="text-center">
                    <div className="text-xs uppercase font-bold">Select Entity</div>
                    <div className="text-[10px] uppercase tracking-widest">For deep scan diagnostics</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <footer className="mt-12 pt-6 border-t border-[#1a1a1a] flex justify-between items-center text-[9px] opacity-30 uppercase tracking-[0.2em]">
          <div>Moonshine Capital // Core Management 4.0.2</div>
          <div className="flex gap-4">
            <span>Lat: 40.7128° N</span>
            <span>Lon: 74.0060° W</span>
            <span className="text-emerald-500 opacity-100">Encrypted Session</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PartnerPortfolioManager;