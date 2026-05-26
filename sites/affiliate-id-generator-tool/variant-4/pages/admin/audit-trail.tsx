import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const AuditTrail = () => {
  const [currentTime, setCurrentTime] = useState('00:00:00');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const logs = [
    { timestamp: '2024-05-20 14:22:01', event: 'PROVISION_EXEC', actor: 'SYS_ADMIN_01', latency: '42ms', status: 'SUCCESS', id: 'MC-BRK-AX99', ip: '192.168.1.104' },
    { timestamp: '2024-05-20 14:15:55', event: 'ID_GEN_REQUEST', actor: 'NODE_LND_88', latency: '12ms', status: 'SUCCESS', id: 'MC-REF-LK24', ip: '45.12.88.2' },
    { timestamp: '2024-05-20 13:50:12', event: 'DB_SYNC_PRIMARY', actor: 'CRON_JOB', latency: '158ms', status: 'SUCCESS', id: 'N/A', ip: 'INTERNAL' },
    { timestamp: '2024-05-20 13:45:00', event: 'PROVISION_EXEC', actor: 'SYS_ADMIN_02', latency: '38ms', status: 'SUCCESS', id: 'MC-AFF-JR24', ip: '82.44.11.9' },
    { timestamp: '2024-05-20 12:30:11', event: 'AUTH_CHALLENGE', actor: 'SYS_ADMIN_01', latency: '5ms', status: 'VALIDATED', id: 'N/A', ip: '192.168.1.104' },
    { timestamp: '2024-05-20 11:12:44', event: 'PROVISION_EXEC', actor: 'SYS_ADMIN_01', latency: '45ms', status: 'SUCCESS', id: 'MC-VND-ER24', ip: '192.168.1.104' },
    { timestamp: '2024-05-20 10:05:19', event: 'ID_COLLISION_CHECK', actor: 'NODE_LND_88', latency: '8ms', status: 'CLEAR', id: 'MC-BRK-JC23', ip: '45.12.88.2' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 terminal-grid relative">
      <Head>
        <title>SYSTEM SENTINEL // AUDIT VAULT</title>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root {
          --emerald: #10b981;
          --black: #010101;
          --dark-gray: #0a0a0a;
          --border: #1a1a1a;
        }

        body {
          background-color: var(--black);
          color: var(--emerald);
          font-family: 'JetBrains Mono', monospace;
          overflow-x: hidden;
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

        .terminal-grid {
          background-image: radial-gradient(var(--border) 1px, transparent 1px);
          background-size: 30px 30px;
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

        .glitch-header {
          text-shadow: 2px 0 #000, -2px 0 #10b98122;
          letter-spacing: 0.2em;
        }

        .status-dot {
          height: 6px;
          width: 6px;
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

        .latency-bar {
          height: 4px;
          background: var(--border);
          position: relative;
          width: 100%;
        }

        .latency-fill {
          height: 100%;
          background: var(--emerald);
          box-shadow: 0 0 10px var(--emerald);
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--black); }
        ::-webkit-scrollbar-thumb { background: var(--border); }
        ::-webkit-scrollbar-thumb:hover { background: var(--emerald); }
      `}</style>

      <div className="scanline"></div>

      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6">
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Security Subsystem // 00-AUDIT</div>
          <h1 className="text-3xl md:text-4xl font-bold glitch-header italic uppercase">
            System <span className="text-white">Sentinel</span>
          </h1>
          <div className="text-[10px] mt-2 text-emerald-500/60 font-light flex items-center gap-4">
            <span>UPTIME: 1,442:12:09</span>
            <span className="flex items-center gap-2"><span className="status-dot"></span> ENCRYPTION ACTIVE</span>
            <span>VAULT_ID: MS-772-B</span>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs opacity-40 uppercase tracking-widest">Global Timestamp</div>
          <div className="text-2xl font-bold font-mono tracking-wider">{currentTime}</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Metric Cards */}
        <div className="lg:col-span-3 bento-card p-4">
          <div className="text-[10px] opacity-40 uppercase mb-2">API Latency (AVG)</div>
          <div className="text-2xl font-bold mb-3">24.5<span className="text-xs opacity-50 ml-1 text-white">MS</span></div>
          <div className="latency-bar">
            <div className="latency-fill w-1/4"></div>
          </div>
        </div>

        <div className="lg:col-span-3 bento-card p-4">
          <div className="text-[10px] opacity-40 uppercase mb-2">Throughput</div>
          <div className="text-2xl font-bold mb-3">892<span className="text-xs opacity-50 ml-1 text-white">REQ/H</span></div>
          <div className="flex gap-1 h-1 items-end">
            <div className="w-full bg-emerald-500/40 h-full"></div>
            <div className="w-full bg-emerald-500 h-1/2"></div>
            <div className="w-full bg-emerald-500 h-3/4"></div>
            <div className="w-full bg-emerald-500/20 h-full"></div>
            <div className="w-full bg-emerald-500 h-2/3"></div>
          </div>
        </div>

        <div className="lg:col-span-3 bento-card p-4">
          <div className="text-[10px] opacity-40 uppercase mb-2">Auth Breaches</div>
          <div className="text-2xl font-bold mb-3 text-white">00</div>
          <div className="text-[9px] text-emerald-500/50">FIREWALL STATUS: OPTIMAL</div>
        </div>

        <div className="lg:col-span-3 bento-card p-4">
          <div className="text-[10px] opacity-40 uppercase mb-2">Memory Load</div>
          <div className="text-2xl font-bold mb-3">12.8<span className="text-xs opacity-50 ml-1 text-white">GB</span></div>
          <div className="latency-bar">
            <div className="latency-fill w-[42%]"></div>
          </div>
        </div>

        {/* Audit Vault */}
        <section className="lg:col-span-9">
          <div className="bento-card p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-emerald-500"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider italic">Forensic Audit Trail</h2>
              </div>
              <div className="flex gap-4">
                <button className="text-[10px] border border-emerald-500/20 px-3 py-1 hover:bg-emerald-500 hover:text-black transition-all">EXPORT_CSV</button>
                <button className="text-[10px] border border-emerald-500/20 px-3 py-1 hover:bg-emerald-500 hover:text-black transition-all">REFRESH_VAULT</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-[#1a1a1a] opacity-50">
                    <th className="pb-4 font-normal uppercase tracking-[0.2em]">Timestamp</th>
                    <th className="pb-4 font-normal uppercase tracking-[0.2em]">Protocol/Event</th>
                    <th className="pb-4 font-normal uppercase tracking-[0.2em]">Actor</th>
                    <th className="pb-4 font-normal uppercase tracking-[0.2em]">Latency</th>
                    <th className="pb-4 font-normal uppercase tracking-[0.2em]">Result_ID</th>
                    <th className="pb-4 font-normal uppercase tracking-[0.2em]">Origin_IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {logs.map((log, index) => (
                    <tr key={index} className="hover:bg-emerald-500/5 transition-colors group">
                      <td className="py-4 opacity-40 group-hover:opacity-100">{log.timestamp}</td>
                      <td className="py-4 text-emerald-100 font-bold">{log.event}</td>
                      <td className="py-4 opacity-70">{log.actor}</td>
                      <td className="py-4 text-emerald-500">{log.latency}</td>
                      <td className="py-4 font-mono">{log.id}</td>
                      <td className="py-4 opacity-40 font-mono">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Security Config */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bento-card p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Vault Controls</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-white">Auto-Archive</div>
                  <div className="text-[9px] opacity-40 italic">Move logs to deep storage</div>
                </div>
                <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_var(--emerald)]"></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-white">Collision Check</div>
                  <div className="text-[9px] opacity-40 italic">Prevent duplicate ID gen</div>
                </div>
                <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_var(--emerald)]"></div>
                </div>
              </div>

              <div className="flex justify-between items-center opacity-40">
                <div>
                  <div className="text-[10px] text-white">Quantum Hash</div>
                  <div className="text-[9px] italic">Status: Unavailable</div>
                </div>
                <div className="w-8 h-4 bg-white/10 rounded-full relative">
                  <div className="absolute left-1 top-1 w-2 h-2 bg-white/20 rounded-full"></div>
                </div>
              </div>

              <button className="w-full bg-red-900/20 border border-red-500/40 text-red-500 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all">
                Wipe Local Cache
              </button>
            </div>
          </div>

          <div className="bento-card p-6 bg-emerald-500/5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">System Integrity</h3>
            <div className="text-4xl font-bold text-white mb-2">99.98%</div>
            <div className="text-[9px] opacity-60">Verified via SHA-512 protocol checks. All nodes synchronized.</div>
          </div>
        </section>

      </main>

      <footer className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#1a1a1a] flex justify-between text-[10px] opacity-30 uppercase tracking-[0.3em]">
        <div>Sentinel Build: 4.0.2-X</div>
        <div>Moonshine Capital Secure Network</div>
        <div>Access Level: Root</div>
      </footer>
    </div>
  );
};

export default AuditTrail;