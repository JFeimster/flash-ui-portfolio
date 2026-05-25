'use client';

import React, { useState } from 'react';

const BuyerIdentity = () => {
  const [activeTab, setActiveTab] = useState('watchlist');

  const watchlist = [
    { id: 1, title: "Precision HVAC & Cooling", price: "$1.2M", sde: "$450K", multiple: "2.6x", status: "Active" },
    { id: 5, title: "Logistics SaaS (ERP)", price: "$2.4M", sde: "$600K", multiple: "4.0x", status: "LOI Submitted" },
    { id: 12, title: "Concrete Paving & Repair", price: "$3.1M", sde: "$1.1M", multiple: "2.8x", status: "Due Diligence" }
  ];

  const ndas = [
    { business: "Medical Cleaning Contract", broker: "Pacific M&A", status: "EXECUTED", date: "2024-05-12" },
    { business: "Shopify Home Decor Brand", broker: "Quiet Light", status: "PENDING SIGNATURE", date: "2024-05-14" },
    { business: "Amazon FBA - Pet Supplies", broker: "Empire Flippers", status: "UNDER REVIEW", date: "2024-05-15" }
  ];

  const messages = [
    { sender: "B. ROGERS (BROKER)", time: "14:22:05", msg: "Seller has reviewed your POF. Moving to Phase 2." },
    { sender: "SYSTEM", time: "11:05:12", msg: "NDA for 'Logistics SaaS' has been countersigned." },
    { sender: "J. SMITH (ATTORNEY)", time: "09:15:44", msg: "Drafting the asset purchase agreement now." }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans p-4 md:p-8 relative overflow-hidden">
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[9999]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <header className="border-b-2 border-[#1A1A1A] pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="font-mono text-[#8E593E] text-xs font-bold tracking-widest uppercase">/ / BUYER_COMMAND_CENTER_V.2.4</span>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mt-2">OPERATOR<br/>TERMINAL</h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C1FF00] rounded-sm flex items-center justify-center text-[#050505]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#666] uppercase leading-none">POF Status</p>
              <p className="font-mono text-[#C1FF00] font-bold text-sm tracking-wider uppercase">VERIFIED: $4.5M</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <button 
            onClick={() => setActiveTab('watchlist')}
            className={`w-full text-left p-4 font-mono text-xs font-bold tracking-widest uppercase border-2 transition-all ${activeTab === 'watchlist' ? 'bg-[#F5F5F0] text-[#050505] border-[#F5F5F0]' : 'bg-transparent text-[#666] border-[#1A1A1A] hover:border-[#F5F5F0]'}`}>
            [ 01 ] WATCHLIST
          </button>
          <button 
            onClick={() => setActiveTab('nda')}
            className={`w-full text-left p-4 font-mono text-xs font-bold tracking-widest uppercase border-2 transition-all ${activeTab === 'nda' ? 'bg-[#F5F5F0] text-[#050505] border-[#F5F5F0]' : 'bg-transparent text-[#666] border-[#1A1A1A] hover:border-[#F5F5F0]'}`}>
            [ 02 ] NDA PIPELINE
          </button>
          <button 
            onClick={() => setActiveTab('vault')}
            className={`w-full text-left p-4 font-mono text-xs font-bold tracking-widest uppercase border-2 transition-all ${activeTab === 'vault' ? 'bg-[#F5F5F0] text-[#050505] border-[#F5F5F0]' : 'bg-transparent text-[#666] border-[#1A1A1A] hover:border-[#F5F5F0]'}`}>
            [ 03 ] VERIFICATION VAULT
          </button>
          
          <div className="mt-12 bg-[#0F0F0F] border border-[#1A1A1A] p-6">
            <h3 className="font-mono text-[10px] text-[#8E593E] font-black uppercase mb-4 tracking-widest">Buyer Identity</h3>
            <p className="text-xl font-black uppercase leading-tight mb-2">Alpha Acquisition Corp</p>
            <p className="text-xs text-[#666] leading-relaxed mb-6 font-mono">Precision M&A vehicle targeting EBITDA $500k-$1.5M in Texas.</p>
            <button className="w-full py-2 border border-[#F5F5F0] text-[#F5F5F0] text-[10px] font-bold uppercase hover:bg-[#F5F5F0] hover:text-[#050505] transition-colors">Edit Profile</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-6 border-2 border-[#1A1A1A] bg-[#0F0F0F] min-h-[600px] flex flex-col">
          
          {activeTab === 'watchlist' && (
            <div className="p-6">
              <h2 className="font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-3">
                Watchlist <span className="text-xs font-mono text-[#C1FF00] bg-[#1A1A1A] px-2 py-1">{watchlist.length} Assets</span>
              </h2>
              <div className="space-y-4">
                {watchlist.map(item => (
                  <div key={item.id} className="border border-[#1A1A1A] p-4 hover:border-[#C1FF00] transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[#8E593E] font-mono text-[10px] font-bold uppercase tracking-widest">Asset #{item.id}</span>
                        <h4 className="text-lg font-black uppercase tracking-tight">{item.title}</h4>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 ${item.status === 'Active' ? 'bg-[#C1FF00] text-[#050505]' : 'bg-[#FF3D00] text-[#F5F5F0]'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t border-[#1A1A1A] pt-4">
                      <div><p className="text-[9px] text-[#666] uppercase font-bold">Asking Price</p><p className="font-mono text-sm">{item.price}</p></div>
                      <div><p className="text-[9px] text-[#666] uppercase font-bold">Cash Flow</p><p className="font-mono text-sm">{item.sde}</p></div>
                      <div><p className="text-[9px] text-[#666] uppercase font-bold">Multiple</p><p className="font-mono text-sm">{item.multiple}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nda' && (
            <div className="p-6">
              <h2 className="font-black text-2xl uppercase tracking-tight mb-6">Legal Pipeline</h2>
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-[#666]">
                    <th className="pb-4 font-bold uppercase">Business</th>
                    <th className="pb-4 font-bold uppercase">Broker</th>
                    <th className="pb-4 font-bold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {ndas.map((nda, i) => (
                    <tr key={i} className="hover:bg-[#1A1A1A]/50 transition-colors">
                      <td className="py-4 font-bold text-[#F5F5F0] uppercase">{nda.business}</td>
                      <td className="py-4 text-[#888]">{nda.broker}</td>
                      <td className={`py-4 font-bold ${nda.status === 'EXECUTED' ? 'text-[#C1FF00]' : 'text-[#FF3D00]'}`}>
                        {nda.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="p-12 flex flex-col items-center justify-center text-center h-full">
              <div className="w-20 h-20 border-2 border-[#C1FF00] flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C1FF00" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h2 className="text-3xl font-black uppercase mb-2">Secure Verification Vault</h2>
              <p className="text-[#666] max-w-sm mb-8 text-sm">Your Proof of Funds and personal financials are encrypted and shared only with verified sellers upon your approval.</p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="border border-[#1A1A1A] p-4 text-left">
                  <p className="font-mono text-[9px] text-[#666] uppercase mb-1">Last Update</p>
                  <p className="font-mono text-xs">2024-04-20</p>
                </div>
                <div className="border border-[#1A1A1A] p-4 text-left">
                  <p className="font-mono text-[9px] text-[#666] uppercase mb-1">Exposure</p>
                  <p className="font-mono text-xs">4 Active Brokers</p>
                </div>
              </div>
              <button className="mt-8 bg-[#F5F5F0] text-[#050505] px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-[#C1FF00] transition-colors">Update Documents</button>
            </div>
          )}
        </div>

        {/* Bloomberg-Style Messaging Interface */}
        <div className="lg:col-span-3 border-2 border-[#1A1A1A] bg-[#050505] flex flex-col overflow-hidden h-[600px]">
          <div className="p-4 bg-[#1A1A1A] flex justify-between items-center border-b border-[#333]">
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase">/ / SECURE_MSG</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-[#C1FF00] rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-6">
            {messages.map((m, i) => (
              <div key={i} className="font-mono text-[11px] leading-tight">
                <div className="flex justify-between text-[#555] mb-1">
                  <span>{m.sender}</span>
                  <span>{m.time}</span>
                </div>
                <p className="text-[#888] group-hover:text-[#F5F5F0] transition-colors">
                  <span className="text-[#C1FF00] mr-2">&gt;</span>
                  {m.msg}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#1A1A1A] bg-[#0F0F0F]">
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                placeholder="TYPE MESSAGE..."
                className="bg-[#050505] border border-[#333] flex-grow p-2 font-mono text-[10px] text-[#F5F5F0] outline-none focus:border-[#C1FF00]"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] text-[#444]">AES-256 ENCRYPTED</span>
              <button className="text-[#C1FF00] font-mono text-[10px] font-bold uppercase hover:underline">Transmit &gt;</button>
            </div>
          </div>
        </div>

      </div>

      <footer className="mt-12 pt-6 border-t border-[#1A1A1A] flex justify-between items-center">
        <div className="flex gap-8">
          <div><p className="font-mono text-[9px] text-[#444] uppercase">Uptime</p><p className="font-mono text-[11px]">99.998%</p></div>
          <div><p className="font-mono text-[9px] text-[#444] uppercase">Latency</p><p className="font-mono text-[11px]">14ms</p></div>
          <div><p className="font-mono text-[9px] text-[#444] uppercase">Market</p><p className="font-mono text-[11px] text-[#C1FF00]">OPEN</p></div>
        </div>
        <p className="font-mono text-[9px] text-[#444]">&copy; 2024 OXIDIZED LEDGER // BUYER TERMINAL ACCESS GRANTED</p>
      </footer>
    </div>
  );
};

export default BuyerIdentity;
'

```