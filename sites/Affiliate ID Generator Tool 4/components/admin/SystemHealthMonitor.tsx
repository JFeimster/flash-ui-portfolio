import React, { useState, useEffect } from 'react';

const SystemHealthMonitor = () => {
  const [latency, setLatency] = useState(42);
  const [uptime, setUptime] = useState('99.998%');
  const [logs, setLogs] = useState([
    { id: 'LOG-8821', action: 'ID_GENERATE', status: 'SUCCESS', latency: '12ms', actor: 'NODE-LND-88', timestamp: '2024-05-20 14:22:01' },
    { id: 'LOG-8820', action: 'SECURE_AUTH', status: 'SUCCESS', latency: '4ms', actor: 'ROOT_ADMIN', timestamp: '2024-05-20 14:15:33' },
    { id: 'LOG-8819', action: 'DATABASE_SYNC', status: 'SUCCESS', latency: '145ms', actor: 'SYS_DAEMON', timestamp: '2024-05-20 14:10:00' },
    { id: 'LOG-8818', action: 'ID_GENERATE', status: 'WARNING', latency: '89ms', actor: 'NODE-LND-88', timestamp: '2024-05-20 13:55:12' },
    { id: 'LOG-8817', action: 'FAIL_LOGIN', status: 'CRITICAL', latency: '2ms', actor: 'IP_192.168.1.1', timestamp: '2024-05-20 13:42:05' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(12, Math.min(150, prev + (Math.random() * 20 - 10))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono'] p-4 md:p-8 relative overflow-hidden">
      <style>{`
        .terminal-grid {
          background-image: radial-gradient(#1a1a1a 1px, transparent 1px);
          background-size: 30px 30px;
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
        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
        }
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
        .status-dot {
          height: 8px;
          width: 8px;
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
        .btn-action {
          clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
        }
      `}</style>

      <div className="terminal-grid absolute inset-0 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">System Sentinel // Audit Vault</div>
            <h1 className="text-3xl font-bold italic tracking-tighter">HEALTH_<span className="text-white">MONITOR</span></h1>
          </div>
          <div className="text-right">
            <div className="text-[10px] opacity-40 uppercase">Global Node Status</div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="status-dot"></span> OPERATIONAL
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Metrics Overview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bento-card p-6">
              <h3 className="text-xs uppercase opacity-50 mb-4 tracking-widest">Core Infrastructure</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">API Latency</span>
                  <span className={`text-xl font-bold ${latency > 100 ? 'text-red-500' : 'text-emerald-400'}`}>
                    {Math.round(latency)}ms
                  </span>
                </div>
                <div className="w-full bg-[#1a1a1a] h-1">
                  <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(latency / 150) * 100}%` }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">System Uptime</span>
                  <span className="text-white font-bold">{uptime}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm opacity-80">Node Load</span>
                  <span className="text-sm">0.44 / 1.00</span>
                </div>
              </div>
            </div>

            <div className="bento-card p-6 border-emerald-900/30">
              <h3 className="text-xs uppercase opacity-50 mb-4 tracking-widest">Security Protocols</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px]">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  ENCRYPTION: AES-256-GCM
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  DDoS PROTECTION: ACTIVE
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  MFA OVERRIDE: DISABLED
                </div>
              </div>
              <button className="btn-action mt-6 w-full py-2 bg-white text-black text-[10px] font-bold uppercase tracking-tighter hover:bg-emerald-500 transition-colors">
                Initiate Lockdown
              </button>
            </div>
          </div>

          {/* Forensic Audit Trail */}
          <div className="lg:col-span-8">
            <div className="bento-card p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-emerald-500"></div>
                  <h2 className="text-lg font-bold uppercase tracking-wider">Forensic Audit Trail</h2>
                </div>
                <div className="text-[10px] opacity-40">REAL-TIME FEED</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-[#1a1a1a] opacity-50">
                      <th className="pb-3 font-normal uppercase">Event ID</th>
                      <th className="pb-3 font-normal uppercase">Action</th>
                      <th className="pb-3 font-normal uppercase">Actor</th>
                      <th className="pb-3 font-normal uppercase text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {logs.map((log) => (
                      <tr key={log.id} className="group hover:bg-emerald-500/5 transition-colors">
                        <td className="py-4 text-emerald-100/70 font-mono">{log.id}</td>
                        <td className="py-4">
                          <div className="text-emerald-500 font-bold">{log.action}</div>
                          <div className="text-[9px] opacity-30">{log.timestamp}</div>
                        </td>
                        <td className="py-4 opacity-60 italic">{log.actor}</td>
                        <td className="py-4 text-right">
                          <span className={`px-2 py-1 border text-[9px] ${
                            log.status === 'SUCCESS' ? 'border-emerald-500/30 text-emerald-500' :
                            log.status === 'WARNING' ? 'border-yellow-500/30 text-yellow-500' :
                            'border-red-500/30 text-red-500 bg-red-500/10'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#1a1a1a] flex justify-between items-center">
                <div className="text-[9px] opacity-40">SHA-256 HASH: 8f92...c01a</div>
                <button className="text-emerald-500 text-[10px] uppercase font-bold hover:underline">
                  Download Full Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;