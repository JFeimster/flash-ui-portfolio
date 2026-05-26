import React, { useState, useEffect, useRef } from 'react';

const TerminalLogView: React.FC = () => {
  const [logs, setLogs] = useState([
    { id: 1, timestamp: '2024-05-20T10:30:01.442Z', level: 'INFO', node: 'LND-88', event: 'ID_ENGINE_INIT', latency: '4ms', details: 'Provisioning protocols loaded.' },
    { id: 2, timestamp: '2024-05-20T10:32:15.109Z', level: 'SEC', node: 'LND-88', event: 'AUTH_GATE_OPEN', latency: '12ms', details: 'Secure tunnel established for node LND-88.' },
    { id: 3, timestamp: '2024-05-20T10:45:22.881Z', level: 'EXEC', node: 'LND-88', event: 'PROVISION_START', latency: '8ms', details: 'Target: ALEXANDER THORNE [MC-BRK-AT24]' },
    { id: 4, timestamp: '2024-05-20T10:45:23.002Z', level: 'DB', node: 'SQL-01', event: 'COMMIT_SUCCESS', latency: '121ms', details: 'Record stored in partition 0x44A.' },
    { id: 5, timestamp: '2024-05-20T11:02:11.554Z', level: 'WARN', node: 'LND-88', event: 'RATE_LIMIT_NEAR', latency: '2ms', details: 'Burst traffic detected from source 192.168.1.1.' },
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const systemMetrics = [
    { label: 'API LATENCY', value: '42ms', status: 'optimal' },
    { label: 'NODE UPTIME', value: '99.99%', status: 'optimal' },
    { label: 'MEMORY LOAD', value: '14.2%', status: 'optimal' },
    { label: 'ENCRYPTION', value: 'AES-256', status: 'secure' },
  ];

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono',_monospace] p-4 md:p-8 relative overflow-hidden">
      <style>{`
        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
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
        .terminal-grid {
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
        .status-dot {
          height: 6px;
          width: 6px;
          background-color: #10b981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .btn-clip {
          clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
        }
      `}</style>
      
      <div className="scanline"></div>
      <div className="absolute inset-0 terminal-grid pointer-events-none"></div>

      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6 relative z-20">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">System Sentinel // Audit Vault</div>
          <h1 className="text-3xl font-bold italic tracking-wider">
            FORENSIC <span className="text-white">MONITOR</span>
          </h1>
          <div className="text-[10px] mt-2 text-emerald-500/60 font-light flex items-center gap-4">
            <span className="flex items-center gap-2"><span className="status-dot"></span> LIVE SYSTEM FEED</span>
            <span>ENCRYPTION: ACTIVE</span>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs opacity-40">INTERNAL SECURITY CLEARANCE</div>
          <div className="text-lg font-bold">LEVEL 4 ADMIN</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-20">
        {/* System Metrics */}
        <section className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          {systemMetrics.map((metric, i) => (
            <div key={i} className="bento-card p-4 border border-[#1a1a1a]">
              <div className="text-[10px] opacity-40 mb-1 uppercase tracking-widest">{metric.label}</div>
              <div className="text-xl font-bold text-white">{metric.value}</div>
              <div className="mt-2 w-full bg-[#1a1a1a] h-1">
                <div className="bg-emerald-500 h-full w-2/3 shadow-[0_0_10px_#10b981]"></div>
              </div>
            </div>
          ))}
        </section>

        {/* Real-time Technical Log */}
        <section className="lg:col-span-8">
          <div className="bento-card h-[600px] flex flex-col">
            <div className="p-4 border-b border-[#1a1a1a] flex justify-between items-center bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-4 bg-emerald-500"></div>
                <h2 className="text-xs font-bold uppercase tracking-widest">Technical Forensic Stream</h2>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1a1a1a]"></div>
                <div className="w-3 h-3 rounded-full bg-[#1a1a1a]"></div>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-emerald-900">
              {logs.map((log) => (
                <div key={log.id} className="text-[11px] font-mono leading-relaxed group">
                  <span className="opacity-30">[{log.timestamp}]</span>
                  <span className={`mx-2 font-bold ${
                    log.level === 'SEC' ? 'text-blue-400' : 
                    log.level === 'WARN' ? 'text-yellow-500' : 
                    log.level === 'EXEC' ? 'text-emerald-400' : 'text-white'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-emerald-600">@{log.node}</span>
                  <span className="mx-2 opacity-50">::</span>
                  <span className="text-emerald-100 group-hover:text-white transition-colors">{log.event}</span>
                  <span className="mx-2 opacity-30">—</span>
                  <span className="opacity-60 italic">{log.details}</span>
                  <span className="ml-2 text-[9px] px-1 bg-emerald-950 border border-emerald-900 text-emerald-500">{log.latency}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            <div className="p-4 border-t border-[#1a1a1a] bg-[#050505] flex gap-4">
              <input 
                type="text" 
                placeholder="EXECUTE DIRECT COMMAND..." 
                className="flex-grow bg-black border border-[#1a1a1a] text-[#10b981] text-xs p-2 focus:outline-none focus:border-emerald-500 transition-all"
              />
              <button className="btn-clip bg-emerald-500 text-black px-6 text-[10px] font-bold uppercase tracking-widest hover:brightness-110">
                Send
              </button>
            </div>
          </div>
        </section>

        {/* System Health & Nodes */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bento-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Active Security Nodes
            </h3>
            <div className="space-y-4">
              {[
                { name: 'LND-88 (PRIMARY)', region: 'US-EAST', load: '12%', status: 'ONLINE' },
                { name: 'SQL-01 (VAULT)', region: 'US-WEST', load: '4%', status: 'ONLINE' },
                { name: 'CDN-EDGE-04', region: 'EU-CENTRAL', load: '28%', status: 'STABLE' },
                { name: 'AUTH-GATEWAY', region: 'GLOBAL', load: '2%', status: 'ONLINE' },
              ].map((node, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] border-b border-[#1a1a1a] pb-2">
                  <div>
                    <div className="text-emerald-100 font-bold">{node.name}</div>
                    <div className="opacity-40">{node.region} // LOAD: {node.load}</div>
                  </div>
                  <div className="text-emerald-500 font-bold tracking-tighter">{node.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card p-5 bg-emerald-500/5 border-emerald-500/20">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-emerald-400">Export Audit Trail</h3>
            <p className="text-[10px] opacity-60 mb-4">Generate a signed forensic report of all provisioning events for the current epoch.</p>
            <button className="w-full py-3 border border-emerald-500 text-emerald-500 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all btn-clip">
              Generate PDF Archive
            </button>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-8 flex justify-between items-center opacity-30 text-[9px] uppercase tracking-[0.2em] relative z-20">
        <div>© 2024 MOONSHINE CAPITAL // SENTINEL DIVISION</div>
        <div>TERMINAL_SESSION: 0x882_44902</div>
      </footer>
    </div>
  );
};

export default TerminalLogView;