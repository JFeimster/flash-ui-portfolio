"use client";

import React, { useState } from 'react';

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('watch-list');
  const [message, setMessage] = useState('');

  const savedDeals = [
    { id: 1, title: "Precision HVAC & Cooling", location: "Austin, TX", price: 1200000, sde: 450000, status: "Active", nda: "Executed" },
    { id: 4, title: "Laundromat Portfolio (3 Units)", location: "Phoenix, AZ", price: 950000, sde: 220000, status: "Hot Deal", nda: "Pending Approval" },
    { id: 12, title: "Concrete Paving & Repair", location: "Denver, CO", price: 3100000, sde: 1100000, status: "Active", nda: "Not Started" }
  ];

  const messages = [
    { from: "System", time: "09:12:44", text: "Proof of Funds verified. Transaction limit updated to $5.0M." },
    { from: "B. Miller (Broker)", time: "10:05:12", text: "Re: Precision HVAC. Seller has reviewed your NDA. Access to data room granted." },
    { from: "B. Miller (Broker)", time: "10:05:45", text: "Note: There are 3 other LOIs expected by EOD Friday." }
  ];

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#C1FF00] selection:text-[#050505]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        
        :root {
          --acid-green: #C1FF00;
          --oxidized-copper: #8E593E;
          --blood-orange: #FF3D00;
          --graphite: #1A1A1A;
          --panel: #0F0F0F;
          --noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        body::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: var(--noise);
          opacity: 0.04;
          pointer-events: none;
          z-index: 9999;
        }

        .mono { font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050505; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1A1A1A; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--oxidized-copper); }
      `}</style>

      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 border-b-2 border-[#1A1A1A] sticky top-0 bg-[#050505] z-50">
        <a href="/" className="font-black text-2xl tracking-tighter flex items-center gap-2">
          OXIDIZED<span className="text-[#8E593E]">LEDGER</span>
        </a>
        <div className="flex gap-8">
          <a href="#" className="text-[0.8rem] font-bold uppercase tracking-widest hover:text-[#C1FF00]">Market</a>
          <a href="#" className="text-[0.8rem] font-bold uppercase tracking-widest text-[#C1FF00]">Terminal</a>
          <a href="#" className="text-[0.8rem] font-bold uppercase tracking-widest hover:text-[#C1FF00]">Financing</a>
        </div>
        <div className="mono text-[0.7rem] px-3 py-1 border border-[#C1FF00] text-[#C1FF00]">
          Verified Buyer: ID-88294
        </div>
      </nav>

      <main className="p-8 max-w-[1600px] mx-auto">
        {/* Header Stats */}
        <header className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-6">
            <span className="block text-[0.65rem] text-[#666] uppercase tracking-widest mb-2">Verified Liquid Capital</span>
            <span className="block mono text-2xl font-bold text-[#C1FF00]">$4,250,000</span>
          </div>
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-6">
            <span className="block text-[0.65rem] text-[#666] uppercase tracking-widest mb-2">Active NDAs</span>
            <span className="block mono text-2xl font-bold">12</span>
          </div>
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-6">
            <span className="block text-[0.65rem] text-[#666] uppercase tracking-widest mb-2">Saved Deals</span>
            <span className="block mono text-2xl font-bold">08</span>
          </div>
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-6">
            <span className="block text-[0.65rem] text-[#666] uppercase tracking-widest mb-2">System Status</span>
            <span className="flex items-center gap-2 mono text-sm text-[#C1FF00]">
              <span className="w-2 h-2 bg-[#C1FF00] rounded-full animate-pulse"></span> SECURE TERMINAL
            </span>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Command Tabs */}
          <div className="col-span-12 lg:col-span-8">
            <div className="flex gap-1 mb-6">
              {['watch-list', 'nda-tracker', 'pof-vault'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 mono text-[0.7rem] font-bold border-t-2 transition-all ${
                    activeTab === tab 
                    ? 'bg-[#0F0F0F] border-[#C1FF00] text-[#F5F5F0]' 
                    : 'bg-transparent border-transparent text-[#666] hover:text-[#F5F5F0]'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>

            <section className="bg-[#0F0F0F] border-2 border-[#1A1A1A] min-h-[600px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 mono text-[0.6rem] text-[#333]">
                MNTR_SESSION: B_88294_PRV
              </div>

              {activeTab === 'watch-list' && (
                <div className="p-8">
                  <div className="grid gap-4">
                    {savedDeals.map(deal => (
                      <div key={deal.id} className="border border-[#1A1A1A] hover:border-[#F5F5F0] bg-[#050505] p-6 flex flex-col md:flex-row justify-between items-center transition-all group">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="mono text-[0.65rem] text-[#8E593E] font-bold">{deal.location}</span>
                            {deal.status !== 'Active' && <span className="bg-[#FF3D00] text-[0.6rem] px-2 py-0.5 font-black uppercase">{deal.status}</span>}
                          </div>
                          <h3 className="text-xl font-black uppercase mb-4 tracking-tight">{deal.title}</h3>
                          <div className="flex gap-8">
                            <div>
                              <span className="block text-[0.6rem] text-[#666] uppercase mb-1">Price</span>
                              <span className="mono text-sm text-[#C1FF00] font-bold">{formatCurrency(deal.price)}</span>
                            </div>
                            <div>
                              <span className="block text-[0.6rem] text-[#666] uppercase mb-1">Cash Flow (SDE)</span>
                              <span className="mono text-sm font-bold">{formatCurrency(deal.sde)}</span>
                            </div>
                            <div>
                              <span className="block text-[0.6rem] text-[#666] uppercase mb-1">NDA Status</span>
                              <span className={`mono text-xs font-bold ${deal.nda === 'Executed' ? 'text-[#C1FF00]' : 'text-[#8E593E]'}`}>
                                {deal.nda}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 md:mt-0 flex gap-2 w-full md:w-auto">
                          <button className="flex-1 md:flex-none border border-[#F5F5F0] bg-[#F5F5F0] text-[#050505] px-6 py-3 mono text-[0.7rem] font-black hover:bg-transparent hover:text-[#F5F5F0] transition-colors">
                            DEAL ROOM
                          </button>
                          <button className="p-3 border border-[#1A1A1A] hover:border-[#FF3D00] text-[#FF3D00]">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'nda-tracker' && (
                <div className="p-8">
                   <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#1A1A1A] mono text-[0.65rem] text-[#666] text-left">
                          <th className="pb-4">ASSET NAME</th>
                          <th className="pb-4">BROKERAGE</th>
                          <th className="pb-4">SUBMITTED</th>
                          <th className="pb-4">STATUS</th>
                          <th className="pb-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="mono text-[0.75rem]">
                        {[
                          { name: "Precision HVAC", broker: "Miller & Co", date: "2024.03.12", status: "Executed", color: "#C1FF00" },
                          { name: "SaaS Logistics ERP", broker: "Quiet Light", date: "2024.03.10", status: "Pending", color: "#8E593E" },
                          { name: "Amazon FBA Pet", broker: "Empire Flippers", date: "2024.03.05", status: "Expired", color: "#FF3D00" }
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-[#1A1A1A]">
                            <td className="py-6 font-bold">{row.name}</td>
                            <td className="py-6 text-[#888]">{row.broker}</td>
                            <td className="py-6">{row.date}</td>
                            <td className="py-6" style={{ color: row.color }}>{row.status}</td>
                            <td className="py-6 text-right">
                              <button className="underline decoration-[#8E593E] hover:text-[#C1FF00]">VIEW DOC</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              )}

              {activeTab === 'pof-vault' && (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 border-2 border-[#1A1A1A] flex items-center justify-center mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C1FF00" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black uppercase mb-2">Proof of Funds Verification</h2>
                  <p className="text-[#666] max-w-md mb-8 text-sm">Upload certified bank statements or a letter from your financial institution to unlock institutional-grade listings.</p>
                  
                  <div className="w-full max-w-md border-2 border-dashed border-[#1A1A1A] p-12 hover:border-[#C1FF00] transition-colors cursor-pointer bg-[#050505] mb-6">
                    <span className="mono text-[0.7rem] font-bold text-[#888]">Drag & Drop Verification Files (PDF only)</span>
                  </div>
                  
                  <div className="flex gap-4 mono text-[0.65rem]">
                    <div className="px-4 py-2 bg-[#1A1A1A]">AES-256 ENCRYPTED</div>
                    <div className="px-4 py-2 bg-[#1A1A1A]">PRIVATE STORAGE</div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Secure Terminal Messaging */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#0F0F0F] border-2 border-[#1A1A1A] flex flex-col h-full min-h-[700px]">
              <div className="p-4 border-b-2 border-[#1A1A1A] flex justify-between items-center bg-[#050505]">
                <span className="mono text-xs font-black text-[#C1FF00]">SECURE COMM TERMINAL</span>
                <span className="mono text-[0.6rem] text-[#333]">LIVE_FEED_ENABLED</span>
              </div>
              
              {/* Chat Window */}
              <div className="flex-grow p-6 overflow-y-auto custom-scrollbar bg-[#050505]">
                {messages.map((msg, i) => (
                  <div key={i} className="mb-6 font-mono">
                    <div className="flex justify-between mb-1">
                      <span className={`text-[0.65rem] font-bold ${msg.from === 'System' ? 'text-[#8E593E]' : 'text-[#C1FF00]'}`}>
                        [{msg.from}]
                      </span>
                      <span className="text-[0.6rem] text-[#333]">{msg.time}</span>
                    </div>
                    <p className="text-[0.8rem] leading-relaxed text-[#F5F5F0] opacity-90">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t-2 border-[#1A1A1A] bg-[#0F0F0F]">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 bg-[#1A1A1A] mono text-[0.5rem] text-[#666]">TO: B. MILLER</span>
                    <span className="px-2 py-1 bg-[#1A1A1A] mono text-[0.5rem] text-[#666]">ENCRYPTED</span>
                  </div>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="TYPE MESSAGE TO BROKER..."
                    className="bg-transparent border border-[#1A1A1A] p-4 mono text-[0.8rem] focus:border-[#C1FF00] outline-none resize-none h-24 text-[#F5F5F0]"
                  />
                  <button className="w-full bg-[#C1FF00] text-[#050505] font-black mono text-[0.7rem] py-3 hover:bg-[#F5F5F0] transition-colors">
                    EXECUTE_SEND
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 p-8 border-t-2 border-[#1A1A1A] mono">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="text-[0.6rem] text-[#444] max-w-xl">
            S-TERM LOGGED FROM IP: 192.168.1.104. ALL COMMUNICATIONS ARE MONITORED FOR COMPLIANCE WITH THE BROKER-DEALER TRANSPARENCY ACT. 
            PRIVATE EQUITY FIRMS MAY REQUIRE ADDITIONAL POF BEFORE ISSUING CIM.
          </div>
          <div className="text-[0.6rem] text-[#8E593E] font-bold">
            &copy; 2024 OXIDIZED LEDGER INC // BUYER TERMINAL V2.4.1
          </div>
        </div>
      </footer>
    </div>
  );
}