import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const PerformanceAnalytics = () => {
  const [glitchText, setGlitchText] = useState('SYSTEM OPERATIONAL');
  
  const performanceData = [
    { name: '00:00', capital: 4000, conversion: 2.4 },
    { name: '04:00', capital: 3000, conversion: 1.8 },
    { name: '08:00', capital: 2000, conversion: 3.9 },
    { name: '12:00', capital: 2780, conversion: 4.8 },
    { name: '16:00', capital: 1890, conversion: 5.2 },
    { name: '20:00', capital: 2390, conversion: 6.1 },
    { name: '23:59', capital: 3490, conversion: 4.3 },
  ];

  const distributionData = [
    { name: 'BRK', value: 450, color: '#10b981' },
    { name: 'AFF', value: 300, color: '#059669' },
    { name: 'REF', value: 150, color: '#064e3b' },
    { name: 'VND', value: 100, color: '#022c22' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050505] border border-[#1a1a1a] p-3 font-mono text-[10px]">
          <p className="text-emerald-500 mb-1">{`TIMESTAMP: ${label}`}</p>
          <p className="text-white">{`CAPITAL: $${payload[0].value.toLocaleString()}`}</p>
          <p className="text-emerald-300">{`CONV: ${payload[1]?.value || 0}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono',monospace] p-4 md:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="scanline fixed top-0 left-0 w-full h-[100px] z-50 pointer-events-none opacity-10"
           style={{ background: 'linear-gradient(0deg, rgba(16, 185, 129, 0) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(16, 185, 129, 0) 100%)', animation: 'scanline 8s linear infinite' }}></div>
      
      <style>{`
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        .bento-card { background: rgba(10, 10, 10, 0.8); border: 1px solid #1a1a1a; position: relative; overflow: hidden; }
        .bento-card::before { content: ""; position: absolute; top: 0; left: 0; width: 2px; height: 0%; background: #10b981; transition: height 0.3s ease; }
        .bento-card:hover::before { height: 100%; }
        .glitch-header { text-shadow: 2px 0 #000, -2px 0 #10b98122; letter-spacing: 0.2em; }
        .recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line { stroke: #1a1a1a; }
      `}</style>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6 relative z-10">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Network Analytics // NODE: LND-88</div>
          <h1 className="text-3xl md:text-4xl font-bold glitch-header italic uppercase text-white">
            ROI <span className="text-emerald-500">PROJECTION</span>
          </h1>
          <div className="text-[10px] mt-2 text-emerald-500/60 font-light flex items-center gap-4">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span> LIVE DATAFEED</span>
            <span>UPLINK: STABLE</span>
            <span>ENCRYPTION: AES-256</span>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs opacity-40">PERFORMANCE TERMINAL</div>
          <div className="text-lg font-bold">V.4.0.2-BETA</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Metric Cards */}
        <div className="lg:col-span-3 bento-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase opacity-50 mb-4">Total Capital Inflow</div>
          <div>
            <div className="text-4xl font-bold text-white tracking-tighter">$1.24M</div>
            <div className="text-[10px] text-emerald-500 mt-1">+14.2% FROM PREV_CYCLE</div>
          </div>
          <div className="mt-8 h-1 bg-[#1a1a1a] w-full relative">
            <div className="absolute top-0 left-0 h-full bg-emerald-500 w-[72%]"></div>
          </div>
        </div>

        <div className="lg:col-span-3 bento-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase opacity-50 mb-4">Avg. Conversion Rate</div>
          <div>
            <div className="text-4xl font-bold text-white tracking-tighter">8.42%</div>
            <div className="text-[10px] text-emerald-500 mt-1">OPTIMIZED THRESHOLD</div>
          </div>
          <div className="mt-8 flex gap-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`h-4 w-full ${i < 9 ? 'bg-emerald-500/40' : 'bg-[#1a1a1a]'}`}></div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bento-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase opacity-50 mb-4">Active Provisions</div>
          <div>
            <div className="text-4xl font-bold text-white tracking-tighter">142</div>
            <div className="text-[10px] text-emerald-500 mt-1">GLOBAL PARTNER NODES</div>
          </div>
          <div className="mt-8 text-[10px] flex justify-between opacity-50">
            <span>SYNC_LEVEL</span>
            <span>99.9%</span>
          </div>
        </div>

        <div className="lg:col-span-3 bento-card p-6 flex flex-col justify-between border-emerald-500/30">
          <div className="text-[10px] uppercase opacity-50 mb-4">System ROI</div>
          <div>
            <div className="text-4xl font-bold text-emerald-500 tracking-tighter">x4.2</div>
            <div className="text-[10px] text-white/60 mt-1">CAPITAL EFFICIENCY</div>
          </div>
          <div className="mt-8 flex items-center gap-2">
             <span className="text-[10px] animate-pulse">●</span>
             <span className="text-[10px] uppercase tracking-widest">Calculated Real-time</span>
          </div>
        </div>

        {/* Main Chart */}
        <section className="lg:col-span-8 bento-card p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-emerald-500"></div>
              <h2 className="text-lg font-bold uppercase tracking-wider">Capital Velocity vs. Conversion</h2>
            </div>
            <div className="flex gap-4 text-[10px] uppercase tracking-tighter opacity-60">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500"></div> Capital</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-white"></div> Conversion</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="capital" stroke="#10b981" fillOpacity={1} fill="url(#colorCapital)" strokeWidth={2} />
                <Line type="monotone" dataKey="conversion" stroke="#ffffff" strokeWidth={2} dot={{ r: 4, fill: '#010101', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Side Chart: Partner Distribution */}
        <section className="lg:col-span-4 bento-card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-6 bg-emerald-500"></div>
            <h2 className="text-lg font-bold uppercase tracking-wider">Entity Distribution</h2>
          </div>
          <div className="flex-grow flex items-center justify-center relative">
            <div className="absolute text-center">
              <div className="text-[10px] uppercase opacity-50">Total Node</div>
              <div className="text-2xl font-bold">1,000</div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {distributionData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ backgroundColor: item.color }}></div>
                  <span className="opacity-60">{item.name} [PROVISION_TYPE]</span>
                </div>
                <span className="font-bold text-white">{item.value} UNITS</span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Bar: Real-time logs */}
        <section className="lg:col-span-12 bento-card p-4 bg-[#050505] border-dashed border-emerald-500/20">
          <div className="flex items-center gap-6 overflow-hidden whitespace-nowrap text-[10px] font-mono">
            <span className="text-emerald-500 font-bold shrink-0">TERMINAL_LOG &gt;</span>
            <div className="animate-marquee flex gap-8">
              <span className="opacity-40">[14:02:11] NEW_PARTNER_SYNC: MC-BRK-AX92 INITIATED</span>
              <span className="opacity-40">[14:02:45] CAPITAL_RESERVE_UPDATE: +$42,000.00 FROM NODE_AFF_22</span>
              <span className="opacity-40">[14:03:01] CONVERSION_SPIKE: REGION_NA DETECTED (7.8% &gt; 9.2%)</span>
              <span className="opacity-40">[14:03:12] ENCRYPTION_ROTATION: SUCCESSFUL</span>
              <span className="opacity-40">[14:04:00] REVENUE_SHARE_DISTRIBUTED: $12,400.00 TO 4 NODES</span>
            </div>
          </div>
        </section>

      </main>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PerformanceAnalytics;