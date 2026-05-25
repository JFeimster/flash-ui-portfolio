import React, { useState, useEffect } from 'react';

const SentinelAuditVault = () => {
  const [timestamp, setTimestamp] = useState('');
  const [latency, setLatency] = useState('24ms');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toISOString().replace('T', ' ').substring(0, 19));
      setLatency(`${Math.floor(Math.random() * (45 - 18) + 18)}ms`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const systemMetrics = [
    { label: 'CPU LOAD', value: '14.2%', color: 'bg-emerald-500' },
    { label: 'MEM ALLOC', value: '1.2GB', color: 'bg-emerald-500' },
    { label: 'IOPS', value: '4.8k', color: 'bg-emerald-500' },
    { label: 'NODE UPTIME', value: '1,240H', color: 'bg-emerald-500' }
  ];

  const forensicLogs = [
    { id: 'MC-BRK-AT24', action: 'PROVISION_SUCCESS', ip: '192.168.1.104', hash: '8f2a...e911', latency: '22ms' },
    { id: 'MC-REF-SJ23', action: 'VAULT_ACCESS', ip: '10.0.4.22', hash: '41cb...a012', latency: '18ms' },
    { id: 'SYSTEM', action: 'DB_SYNC_COMPLETE', ip: 'LOCAL_HOST', hash: '992a...ff01', latency: '4ms' },
    { id: 'MC-AFF-MV24', action: 'PROVISION_SUCCESS', ip: '72.14.21.90', hash: 'bb12...33d2', latency: '31ms' },
    { id: 'UNKNOWN', action: 'AUTH_CHALLENGE', ip: '45.122.1.2', hash: 'ERR_09', latency: '104ms' },
  ];

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono',monospace] p-4 md:p-8 relative overflow-hidden">
      {/* Background Grid & Scanline */}
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="scanline"></div>

      <style jsx global>{`
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
      `}</style>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10 border-b border-[#1a1a1a] pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.5em] text-emerald-500/50 mb-1">Security Sub-Protocol // VAULT</div>
          <h1 className="text-3xl font-bold tracking-tighter italic">
            SYSTEM <span className="text-white">SENTINEL</span>
          </h1>
          <div className="flex gap-4 mt-2 text-[10px]">
            <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-pulse shadow-[0_0_8px_#10b981]"></span> 
                ENCRYPTION: AES-256-GCM
            </span>
            <span className="opacity-40 tracking-widest">LOCAL_TIME: {timestamp}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] opacity-40">API LATENCY MONITOR</div>
          <div className="text-xl font-bold font-mono">{latency}</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Stats: Hardware Telemetry */}
        {systemMetrics.map((metric, idx) => (
          <div key={idx} className="lg:col-span-3 bento-card p-4">
            <div className="text-[10px] uppercase opacity-50 mb-1">{metric.label}</div>
            <div className="text-2xl font-bold text-white flex items-center justify-between">
              {metric.value}
              <div className="h-1 w-12 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className={`h-full ${metric.color} w-3/4`}></div>
              </div>
            </div>
          </div>
        ))}

        {/* Left: Forensic Audit Trail */}
        <section className="lg:col-span-8 space-y-6">
          <div className="bento-card p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-emerald-500"></div>
                <h2 className="text-lg font-bold uppercase tracking-widest">Forensic Audit Trail</h2>
              </div>
              <button className="text-[10px] border border-[#1a1a1a] px-3 py-1 hover:bg-emerald-500/10 transition-colors">EXPORT_LOGS</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1a1a1a] opacity-50">
                    <th className="pb-4 font-normal uppercase tracking-widest">Entity/ID</th>
                    <th className="pb-4 font-normal uppercase tracking-widest">Action Protocol</th>
                    <th className="pb-4 font-normal uppercase tracking-widest">Source IP</th>
                    <th className="pb-4 font-normal uppercase tracking-widest">Lat.</th>
                    <th className="pb-4 font-normal uppercase tracking-widest text-right">Auth Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {forensicLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-emerald-500/5 transition-colors group">
                      <td className="py-4 text-emerald-100 font-bold tracking-tight">{log.id}</td>
                      <td className="py-4">
                        <span className={`text-[9px] px-2 py-0.5 rounded-sm ${log.action.includes('ERR') ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 opacity-60 font-mono">{log.ip}</td>
                      <td className="py-4 opacity-60">{log.latency}</td>
                      <td className="py-4 text-right font-mono opacity-40 group-hover:opacity-100 transition-opacity">{log.hash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right: System Config & Health */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bento-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-white"></div>
              <h2 className="text-lg font-bold uppercase tracking-widest text-white">Security Overrides</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Strict ID Validation', enabled: true },
                { name: 'API Rate Limiting', enabled: true },
                { name: 'Forensic Shadowing', enabled: false },
                { name: 'Global Provisioning Lock', enabled: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-[#1a1a1a] bg-black/40">
                  <span className="text-[11px] uppercase tracking-wider">{item.name}</span>
                  <div className={`w-8 h-4 relative cursor-pointer ${item.enabled ? 'bg-emerald-500/40' : 'bg-[#1a1a1a]'}`}>
                    <div className={`absolute top-1 w-2 h-2 transition-all ${item.enabled ? 'right-1 bg-emerald-500' : 'left-1 bg-gray-600'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card p-6 bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
            <div className="text-[10px] uppercase opacity-40 mb-4">Node Distribution</div>
            <div className="space-y-3">
                <div className="flex justify-between text-[10px]">
                    <span>LND-NORTH</span>
                    <span className="text-emerald-400">OPERATIONAL</span>
                </div>
                <div className="w-full h-1 bg-[#1a1a1a]">
                    <div className="h-full bg-emerald-500 w-[92%]"></div>
                </div>
                <div className="flex justify-between text-[10px] pt-2">
                    <span>LND-SOUTH</span>
                    <span className="text-emerald-400">OPERATIONAL</span>
                </div>
                <div className="w-full h-1 bg-[#1a1a1a]">
                    <div className="h-full bg-emerald-500 w-[88%]"></div>
                </div>
                <div className="flex justify-between text-[10px] pt-2">
                    <span>VAULT-SYNC</span>
                    <span className="text-orange-500">SYNCING...</span>
                </div>
                <div className="w-full h-1 bg-[#1a1a1a]">
                    <div className="h-full bg-orange-500 w-[45%] animate-pulse"></div>
                </div>
            </div>
          </div>
        </section>

        {/* Bottom Bar: System Ticker */}
        <footer className="lg:col-span-12 bento-card py-2 px-6 flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-6 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
            <span className="text-[9px] uppercase tracking-[0.3em] opacity-40">System Core Stable</span>
            <span className="text-[9px] uppercase tracking-[0.3em] opacity-40">All Provisions Logged</span>
            <span className="text-[9px] uppercase tracking-[0.3em] opacity-40">ID Generator: Online</span>
            <span className="text-[9px] uppercase tracking-[0.3em] opacity-40">Encryption Layer: ACTIVE</span>
            <span className="text-[9px] uppercase tracking-[0.3em] opacity-40">Sentinel Status: NOMINAL</span>
          </div>
        </footer>
      </main>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default SentinelAuditVault;
```