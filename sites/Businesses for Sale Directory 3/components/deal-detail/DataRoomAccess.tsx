import React, { useState } from 'react';

const DataRoomAccess = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const dealData = {
    id: "DX-9902",
    title: "Precision HVAC & Cooling",
    valuation: "$1,200,000",
    sde: "$450,000",
    multiple: "2.6x",
    location: "Austin, TX",
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans p-4 md:p-8 selection:bg-[#C1FF00] selection:text-[#050505]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        
        :root {
          --obsidian: #050505;
          --bone: #F5F5F0;
          --acid-green: #C1FF00;
          --oxidized-copper: #8E593E;
          --blood-orange: #FF3D00;
          --graphite: #1A1A1A;
        }

        .brutal-border {
          border: 2px solid var(--graphite);
        }

        .mono {
          font-family: 'JetBrains Mono', monospace;
        }

        .noise {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 9999;
        }
      `}</style>

      <div className="noise" />

      {/* Header Section */}
      <header className="mb-12 border-b-2 border-[#1A1A1A] pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="mono text-[#8E593E] text-sm mb-2 block">/ / ASSET_ID: {dealData.id}</span>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter">
              TEAR SHEET: <br />
              <span className="text-[#C1FF00]">{dealData.title}</span>
            </h1>
          </div>
          <div className="text-right">
            <div className="mono text-xs text-[#666] mb-1">DATA UPDATED</div>
            <div className="mono text-sm uppercase">2024-10-24 14:02:11 UTC</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Financials & Charts */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-[#0F0F0F] brutal-border p-6">
            <h2 className="mono text-xs font-bold text-[#888] mb-6 uppercase tracking-widest border-b border-[#1A1A1A] pb-2">Financial Performance</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Asking Price", val: dealData.valuation, color: "var(--bone)" },
                { label: "Annual SDE", val: dealData.sde, color: "var(--acid-green)" },
                { label: "Revenue Multiple", val: dealData.multiple, color: "var(--bone)" },
                { label: "Equity Required", val: "$120,000", color: "var(--oxidized-copper)" },
              ].map((m, i) => (
                <div key={i} className="bg-[#050505] p-4 brutal-border">
                  <span className="block mono text-[10px] text-[#555] uppercase mb-1">{m.label}</span>
                  <span className="text-xl font-black mono" style={{ color: m.color }}>{m.val}</span>
                </div>
              ))}
            </div>

            {/* Financial Chart Placeholder */}
            <div className="h-64 bg-[#050505] brutal-border relative flex items-end justify-between p-4 gap-2">
              {[60, 45, 80, 55, 90, 75, 95, 100].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className="w-full bg-[#1A1A1A] group-hover:bg-[#C1FF00] transition-all duration-300" 
                    style={{ height: `${h}%` }}
                  />
                  <span className="absolute -top-6 left-0 mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                    ${(h * 10).toFixed(0)}K
                  </span>
                </div>
              ))}
              <div className="absolute top-4 left-4 mono text-[10px] text-[#444]">REVENUE TREND (TTM)</div>
            </div>
          </section>

          {/* SWOT Analysis Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-0 brutal-border bg-[#1A1A1A]">
            <div className="bg-[#0F0F0F] p-6 border-r-2 border-b-2 border-[#1A1A1A]">
              <h3 className="mono text-[#C1FF00] text-sm font-bold mb-4">STRENGTHS</h3>
              <ul className="space-y-2 mono text-xs text-[#AAA]">
                <li>+ 82% RECURRING MAINTENANCE CONTRACTS</li>
                <li>+ PROPRIETARY DISPATCH ALGORITHM</li>
                <li>+ DOMINANT LOCAL SEO FOOTPRINT (RANK 1)</li>
              </ul>
            </div>
            <div className="bg-[#0F0F0F] p-6 border-b-2 border-[#1A1A1A]">
              <h3 className="mono text-[#FF3D00] text-sm font-bold mb-4">WEAKNESSES</h3>
              <ul className="space-y-2 mono text-xs text-[#AAA]">
                <li>- OWNER HANDLES HIGH-LEVEL QUOTING</li>
                <li>- AGING FLEET (3 VEHICLES NEED REPLACEMENT)</li>
                <li>- CONCENTRATED SERVICE RADIUS</li>
              </ul>
            </div>
            <div className="bg-[#0F0F0F] p-6 border-r-2 border-[#1A1A1A]">
              <h3 className="mono text-[#8E593E] text-sm font-bold mb-4">OPPORTUNITIES</h3>
              <ul className="space-y-2 mono text-xs text-[#AAA]">
                <li>&gt; EXPANSION INTO ADJACENT COUNTY</li>
                <li>&gt; COMMERCIAL REFRIGERATION VERTICAL</li>
                <li>&gt; SOLAR INSTALLATION PARTNERSHIPS</li>
              </ul>
            </div>
            <div className="bg-[#0F0F0F] p-6">
              <h3 className="mono text-[#FF3D00] text-sm font-bold mb-4">THREATS</h3>
              <ul className="space-y-2 mono text-xs text-[#AAA]">
                <li>! PE-BACKED CONSOLIDATOR AGGRESSION</li>
                <li>! LABOR SHORTAGE (JOURNEYMEN)</li>
                <li>! RISING COMP COSTS (REGIONAL)</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Right Column: Risk & Data Room */}
        <div className="lg:col-span-4 space-y-8">
          {/* Risk Module */}
          <section className="bg-[#0F0F0F] brutal-border p-6 border-l-4 border-[#FF3D00]">
            <h2 className="mono text-xs font-bold text-[#FF3D00] mb-4 uppercase tracking-widest">Risk Assessment</h2>
            <div className="space-y-4">
              <div className="bg-[#050505] p-3 brutal-border border-[#FF3D00]">
                <div className="flex justify-between items-center mb-2">
                  <span className="mono text-[10px] uppercase">Owner Dependency</span>
                  <span className="bg-[#FF3D00] text-[#F5F5F0] text-[10px] px-2 font-bold uppercase">Critical</span>
                </div>
                <div className="h-1 bg-[#1A1A1A]">
                  <div className="h-full bg-[#FF3D00] w-[85%]"></div>
                </div>
              </div>
              <div className="bg-[#050505] p-3 brutal-border border-[#1A1A1A]">
                <div className="flex justify-between items-center mb-2">
                  <span className="mono text-[10px] uppercase">Market Volatility</span>
                  <span className="bg-[#8E593E] text-[#F5F5F0] text-[10px] px-2 font-bold uppercase">Moderate</span>
                </div>
                <div className="h-1 bg-[#1A1A1A]">
                  <div className="h-full bg-[#8E593E] w-[40%]"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Secure Data Room Access */}
          <section className="bg-[#F5F5F0] text-[#050505] p-8 brutal-border relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-black uppercase leading-none mb-4">Secure Data Room</h2>
              <p className="mono text-xs font-bold mb-6 text-[#555]">SENSITIVE FINANCIALS & CUSTOMER CONCENTRATION REPORTS REQUIRE VERIFIED CLEARANCE.</p>
              
              {!isVerified ? (
                <div className="space-y-4">
                  <div>
                    <label className="mono text-[10px] uppercase font-black block mb-2">Access Key</label>
                    <input 
                      type="password" 
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full bg-transparent border-2 border-[#050505] p-3 mono focus:outline-none focus:bg-[#C1FF00] transition-colors"
                    />
                  </div>
                  <button 
                    onClick={() => setIsVerified(true)}
                    className="w-full bg-[#050505] text-[#F5F5F0] p-4 font-black uppercase text-sm hover:bg-[#8E593E] transition-colors active:scale-95"
                  >
                    Request Entry
                  </button>
                  <p className="text-[10px] mono text-center opacity-60 uppercase">Identity verification required by broker.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white p-3 brutal-border flex justify-between items-center">
                    <span className="mono text-xs font-bold">2023_TAX_RETURNS.PDF</span>
                    <span className="text-[#C1FF00] bg-[#050505] px-2 text-[10px] mono">SECURE</span>
                  </div>
                  <div className="bg-white p-3 brutal-border flex justify-between items-center opacity-50">
                    <span className="mono text-xs font-bold">CUSTOMER_LIST_FULL.XLSX</span>
                    <span className="text-[#FF3D00] bg-[#050505] px-2 text-[10px] mono">LOCKED</span>
                  </div>
                  <button className="w-full border-2 border-[#050505] p-3 mono text-xs font-bold mt-4 uppercase">Download All (NDA Encrypted)</button>
                </div>
              )}
            </div>
            {/* Background design element */}
            <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 pointer-events-none">
              <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
              </svg>
            </div>
          </section>

          {/* Broker Note */}
          <div className="bg-[#1A1A1A] p-4 brutal-border">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#C1FF00] shrink-0" />
              <div>
                <span className="mono text-[10px] text-[#666] uppercase block">Assigned Analyst</span>
                <span className="text-sm font-bold uppercase">Marcus Thorne</span>
                <p className="mono text-[10px] text-[#888] mt-2 italic">"This asset is priced for a quick close. The seller is retiring and prioritizing clean deal structures over absolute top-dollar."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 border-t-2 border-[#1A1A1A] pt-8 pb-12 flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-md">
          <p className="mono text-[10px] text-[#444] uppercase leading-relaxed">
            CONFIDENTIALITY NOTICE: ACCESS TO THIS DATA ROOM IS LOGGED VIA IP: 192.168.1.1. UNAUTHORIZED SHARING OF PROPRIETARY FINANCIALS IS SUBJECT TO LEGAL ACTION UNDER THE SIGNED NDA.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-4 text-center min-w-[120px]">
            <span className="block mono text-[10px] text-[#555]">SYSTEM STATUS</span>
            <span className="mono text-xs text-[#C1FF00] font-bold uppercase">Encrypted</span>
          </div>
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-4 text-center min-w-[120px]">
            <span className="block mono text-[10px] text-[#555]">SESSION</span>
            <span className="mono text-xs text-[#8E593E] font-bold uppercase">00:44:12</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataRoomAccess;