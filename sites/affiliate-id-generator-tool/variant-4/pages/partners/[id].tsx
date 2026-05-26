import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PartnerPortfolioManager = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState('overview');
  const [isCopied, setIsCopied] = useState(false);

  // Mock data for the specific partner
  const partnerData = {
    id: id || "MC-BRK-AT24",
    name: "Alexander Thorne",
    company: "Thorne Equities",
    type: "Broker [BRK]",
    status: "ACTIVE",
    email: "a.thorne@thorne-equities.io",
    joined: "2024-05-12",
    volume: "$4.2M",
    conversion: "12.4%",
    nodes: 8,
    lastActivity: "2024-05-20 14:22:01 UTC"
  };

  const copyId = () => {
    navigator.clipboard.writeText(partnerData.id.toString());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono',_monospace] p-4 md:p-8 relative overflow-hidden selection:bg-emerald-500/30">
      <Head>
        <title>Portfolio Manager // {partnerData.id}</title>
        <style>{`
          :root {
            --emerald: #10b981;
            --black: #010101;
            --dark-gray: #0a0a0a;
            --border: #1a1a1a;
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

          .terminal-grid {
            background-image: radial-gradient(var(--border) 1px, transparent 1px);
            background-size: 30px 30px;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
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

          .bento-card:hover::before {
            height: 100%;
          }

          .btn-action {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--emerald);
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
            text-transform: uppercase;
            transition: all 0.2s ease;
            clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
          }

          .btn-action:hover {
            background: var(--emerald);
            color: var(--black);
            border-color: var(--emerald);
          }

          .status-dot {
            height: 8px;
            width: 8px;
            background-color: var(--emerald);
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 8px var(--emerald);
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }

          .glitch-header {
            text-shadow: 2px 0 #000, -2px 0 #10b98122;
            letter-spacing: 0.1em;
          }

          .tab-active {
            border-bottom: 2px solid var(--emerald);
            color: white;
          }
        `}</style>
      </Head>

      <div className="terminal-grid"></div>
      <div className="scanline"></div>

      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6 relative z-20">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1 flex items-center gap-2">
            <span className="cursor-pointer hover:text-emerald-400" onClick={() => window.history.back()}>NETWORK</span> // 
            <span>PORTFOLIO_MANAGER</span> // 
            <span className="text-white">{partnerData.id}</span>
          </div>
          <h1 className="text-3xl font-bold glitch-header italic uppercase">
            ENTITY <span className="text-white">DOSSIER</span>
          </h1>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-[10px] opacity-40 mb-1">SYSTEM_UPTIME: 142:09:55</div>
          <div className="flex gap-4">
             <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 flex items-center gap-2">
                <span className="status-dot"></span> SECURE CONNECTION
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-20">
        
        {/* Left: Metadata Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bento-card p-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500"></div>
                <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[9px] uppercase opacity-40 block">Full Identity</label>
                <div className="text-sm font-bold text-white">{partnerData.name}</div>
              </div>
              <div>
                <label className="text-[9px] uppercase opacity-40 block">Entity Name</label>
                <div className="text-sm text-emerald-400">{partnerData.company}</div>
              </div>
              <div>
                <label className="text-[9px] uppercase opacity-40 block">Mission ID</label>
                <div className="flex items-center justify-between group">
                  <code className="text-xs">{partnerData.id}</code>
                  <button onClick={copyId} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                  </button>
                </div>
                {isCopied && <span className="text-[8px] text-white">COPIED</span>}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-500/10 space-y-2">
              <button className="btn-action w-full text-left">Update Parameters</button>
              <button className="btn-action w-full text-left">Suspend Access</button>
              <button className="btn-action w-full text-left text-red-500 border-red-900/30 hover:bg-red-500">Purge Entity</button>
            </div>
          </div>
        </aside>

        {/* Right: Detailed Analytics & Performance */}
        <section className="lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bento-card p-4">
              <div className="text-[10px] uppercase opacity-40 mb-1">Lifetime Volume</div>
              <div className="text-2xl font-bold text-white tracking-tighter">{partnerData.volume}</div>
              <div className="text-[9px] text-emerald-500 mt-1">↑ 14.2% FROM PREV QUARTER</div>
            </div>
            <div className="bento-card p-4">
              <div className="text-[10px] uppercase opacity-40 mb-1">Conversion Ratio</div>
              <div className="text-2xl font-bold text-white tracking-tighter">{partnerData.conversion}</div>
              <div className="w-full bg-emerald-500/10 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{width: '12.4%'}}></div>
              </div>
            </div>
            <div className="bento-card p-4">
              <div className="text-[10px] uppercase opacity-40 mb-1">Node Connectivity</div>
              <div className="text-2xl font-bold text-white tracking-tighter">{partnerData.nodes} <span className="text-sm opacity-30">Active</span></div>
              <div className="text-[9px] opacity-40 mt-1 italic">ENCRYPTED LND-88 NODES</div>
            </div>
          </div>

          <div className="bento-card flex flex-col min-h-[400px]">
            <div className="flex border-b border-[#1a1a1a]">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-[10px] uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'tab-active' : 'opacity-40 hover:opacity-100'}`}
              >
                Performance_Log
              </button>
              <button 
                onClick={() => setActiveTab('metadata')}
                className={`px-6 py-4 text-[10px] uppercase tracking-widest transition-all ${activeTab === 'metadata' ? 'tab-active' : 'opacity-40 hover:opacity-100'}`}
              >
                Metadata_Drilldown
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-6 py-4 text-[10px] uppercase tracking-widest transition-all ${activeTab === 'history' ? 'tab-active' : 'opacity-40 hover:opacity-100'}`}
              >
                Audit_History
              </button>
            </div>

            <div className="p-6 flex-grow">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-l-2 border-emerald-500 pl-4 py-2 bg-emerald-500/5">
                    <div>
                      <div className="text-[10px] opacity-50 uppercase">Current Protocol</div>
                      <div className="text-sm font-bold">Standard Broker Tier-1</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] opacity-50 uppercase">Commission</div>
                      <div className="text-sm font-bold">2.5%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-emerald-500/10 p-4">
                      <div className="text-[10px] opacity-40 uppercase mb-2">Registration Matrix</div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span>Provision Date:</span> <span className="text-white">{partnerData.joined}</span></div>
                        <div className="flex justify-between"><span>Partner Type:</span> <span className="text-white">{partnerData.type}</span></div>
                        <div className="flex justify-between"><span>Status:</span> <span className="text-emerald-400">ACTIVE</span></div>
                      </div>
                    </div>
                    <div className="border border-emerald-500/10 p-4">
                      <div className="text-[10px] opacity-40 uppercase mb-2">Network Health</div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span>Sync Level:</span> <span className="text-white">99.8%</span></div>
                        <div className="flex justify-between"><span>Auth Level:</span> <span className="text-white">Level-4</span></div>
                        <div className="flex justify-between"><span>Secure Mail:</span> <span className="text-white">Verified</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white border-b border-emerald-500/20 pb-2">LEGAL_PARAMETERS</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] opacity-40 block">TIN/EIN</label>
                        <div className="text-sm">XX-XXX4920</div>
                      </div>
                      <div>
                        <label className="text-[9px] opacity-40 block">JURISDICTION</label>
                        <div className="text-sm uppercase">Delaware, USA</div>
                      </div>
                      <div>
                        <label className="text-[9px] opacity-40 block">COMPLIANCE_STATUS</label>
                        <div className="text-xs px-2 py-1 bg-white/5 inline-block text-white">KYC_VERIFIED</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white border-b border-emerald-500/20 pb-2">COMM_PROTOCOLS</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] opacity-40 block">SECURE_EMAIL</label>
                        <div className="text-sm italic">{partnerData.email}</div>
                      </div>
                      <div>
                        <label className="text-[9px] opacity-40 block">ENCRYPTION_KEY</label>
                        <div className="text-[10px] font-mono break-all opacity-60">rsa_4096_74d9e921-2f3b-4c12-8822</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-emerald-500/10 opacity-50">
                        <th className="pb-3 uppercase font-normal">Timestamp</th>
                        <th className="pb-3 uppercase font-normal">Action_Type</th>
                        <th className="pb-3 uppercase font-normal">Origin_Node</th>
                        <th className="pb-3 uppercase font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="py-3 text-emerald-100/60">2024-05-20 14:22</td>
                        <td className="py-3 text-white">LOGIN_SUCCESS</td>
                        <td className="py-3 opacity-40">192.168.1.104</td>
                        <td className="py-3"><span className="text-[9px] border border-emerald-500/20 px-1 text-emerald-500">OK</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 text-emerald-100/60">2024-05-19 09:15</td>
                        <td className="py-3 text-white">CONTRACT_SIGNED</td>
                        <td className="py-3 opacity-40">DOCU_SIGN_EXT</td>
                        <td className="py-3"><span className="text-[9px] border border-emerald-500/20 px-1 text-emerald-500">OK</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 text-emerald-100/60">2024-05-12 11:00</td>
                        <td className="py-3 text-white">INITIAL_PROVISIONING</td>
                        <td className="py-3 opacity-40">INTERNAL_NODE_01</td>
                        <td className="py-3"><span className="text-[9px] border border-emerald-500/20 px-1 text-emerald-500">OK</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#1a1a1a] bg-black/50 flex justify-between items-center text-[10px]">
              <span className="opacity-40 italic">LAST_SYNC: {partnerData.lastActivity}</span>
              <div className="flex gap-4">
                <span className="hover:text-white cursor-pointer transition-colors">EXPORT_CSV</span>
                <span className="hover:text-white cursor-pointer transition-colors">GENERATE_PDF</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 border-t border-[#1a1a1a] pt-6 flex justify-between text-[10px] opacity-30 relative z-20">
        <div>MOONSHINE CAPITAL // LIQUIDITY PROVISIONING SYSTEM</div>
        <div>STRICTLY CONFIDENTIAL // LEVEL 4 CLEARANCE REQUIRED</div>
      </footer>
    </div>
  );
};

export default PartnerPortfolioManager;