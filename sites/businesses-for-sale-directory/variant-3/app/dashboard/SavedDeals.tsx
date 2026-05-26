'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Clock, 
  FileText, 
  ArrowUpRight, 
  Lock, 
  ChevronRight,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const SavedDeals = () => {
  const [activeChat, setActiveChat] = useState(1);

  const savedDeals = [
    { id: 1, title: "Precision HVAC & Cooling", industry: "Local Service", sde: 450000, price: 1200000, status: "Active", nda: "Countersigned" },
    { id: 5, title: "Logistics SaaS (ERP)", industry: "SaaS", sde: 600000, price: 2400000, status: "Active", nda: "Pending Review" },
    { id: 12, title: "Concrete Paving & Repair", industry: "Local Service", sde: 1100000, price: 3100000, status: "In Diligence", nda: "Countersigned" }
  ];

  const ndaTrackers = [
    { id: 101, deal: "Precision HVAC", step: 3, total: 3, label: "Executed", color: "var(--acid-green)" },
    { id: 102, deal: "Logistics SaaS", step: 1, total: 3, label: "Under Review", color: "var(--oxidized-copper)" },
    { id: 103, deal: "Pet Supplies FBA", step: 0, total: 3, label: "Awaiting Signature", color: "var(--blood-orange)" }
  ];

  const messages = [
    { id: 1, sender: "Broker - Marcus V.", time: "14:02", text: "Seller has uploaded the 2023 Tax Returns to the data room. Please confirm receipt.", type: "received" },
    { id: 2, sender: "SYSTEM", time: "14:05", text: "POF VERIFIED: Your liquidity profile was shared with the seller.", type: "system" },
    { id: 3, sender: "You", time: "14:15", text: "Acknowledged. We are reviewing the add-backs on Schedule C now.", type: "sent" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#C1FF00] selection:text-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        
        :root {
          --obsidian: #050505;
          --bone: #F5F5F0;
          --acid-green: #C1FF00;
          --oxidized-copper: #8E593E;
          --blood-orange: #FF3D00;
          --graphite: #1A1A1A;
          --panel: #0F0F0F;
        }

        .noise-bg {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 9999;
        }

        .mono { font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--obsidian); }
        ::-webkit-scrollbar-thumb { background: var(--graphite); }
      `}</style>

      <div className="noise-bg" />

      {/* Navigation Header */}
      <nav className="border-b-2 border-[#1A1A1A] p-6 sticky top-0 bg-[#050505] z-50 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <a href="/" className="font-[900] text-2xl tracking-tighter uppercase">
            OXIDIZED<span className="text-[#8E593E]">LEDGER</span>
          </a>
          <div className="hidden md:flex gap-6">
            <a href="#" className="mono text-[0.7rem] font-bold text-[#F5F5F0] hover:text-[#C1FF00]">Marketplace</a>
            <a href="#" className="mono text-[0.7rem] font-bold text-[#C1FF00]">Command Center</a>
            <a href="#" className="mono text-[0.7rem] font-bold text-[#F5F5F0]">Financing</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="mono text-[0.6rem] text-[#666]">Access Tier</div>
            <div className="mono text-[0.7rem] text-[#C1FF00]">Institutional Premium</div>
          </div>
          <div className="w-10 h-10 bg-[#1A1A1A] border border-[#8E593E] flex items-center justify-center">
            <ShieldCheck size={20} className="text-[#8E593E]" />
          </div>
        </div>
      </nav>

      <main className="p-6 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* Left Column: Watchlist & NDAs */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* Header Section */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="mono text-[0.7rem] text-[#8E593E] tracking-widest">/ / BUYER_PORTAL / COMMAND_CENTER</span>
              <h1 className="text-5xl font-[900] uppercase tracking-tighter mt-2">Active Pipeline</h1>
            </div>
            <div className="flex gap-2">
              <div className="bg-[#0F0F0F] border border-[#1A1A1A] px-4 py-2 flex items-center gap-3">
                <span className="mono text-[0.6rem] text-[#666]">Total Value</span>
                <span className="mono text-xl text-[#C1FF00]">$6.7M</span>
              </div>
            </div>
          </div>

          {/* Saved Deals List */}
          <div className="bg-[#0F0F0F] border-2 border-[#1A1A1A]">
            <div className="border-b-2 border-[#1A1A1A] p-4 flex justify-between items-center bg-[#050505]">
              <h3 className="mono text-sm font-bold flex items-center gap-2">
                <Clock size={16} className="text-[#8E593E]" /> Watchlist
              </h3>
              <Search size={14} className="text-[#666]" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
                    <th className="p-4 mono text-[0.6rem] text-[#666]">Asset Name</th>
                    <th className="p-4 mono text-[0.6rem] text-[#666]">SDE (Cash Flow)</th>
                    <th className="p-4 mono text-[0.6rem] text-[#666]">Asking Price</th>
                    <th className="p-4 mono text-[0.6rem] text-[#666]">NDA Status</th>
                    <th className="p-4 mono text-[0.6rem] text-[#666]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {savedDeals.map(deal => (
                    <tr key={deal.id} className="border-b border-[#1A1A1A] hover:bg-[#111] transition-colors group">
                      <td className="p-4">
                        <div className="font-bold uppercase text-sm group-hover:text-[#C1FF00]">{deal.title}</div>
                        <div className="mono text-[0.6rem] text-[#666]">{deal.industry}</div>
                      </td>
                      <td className="p-4 mono font-bold text-[#C1FF00]">${deal.sde.toLocaleString()}</td>
                      <td className="p-4 mono text-[#F5F5F0]">${deal.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`mono text-[0.6rem] px-2 py-1 ${deal.nda === 'Countersigned' ? 'bg-[#C1FF00] text-black' : 'bg-[#1A1A1A] text-[#8E593E]'}`}>
                          {deal.nda}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="border border-[#F5F5F0] p-2 hover:bg-[#F5F5F0] hover:text-black transition-all">
                          <ArrowUpRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NDA Progress & Vault */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0F0F0F] border-2 border-[#1A1A1A] p-6">
              <h3 className="mono text-sm font-bold mb-6 flex items-center gap-2">
                <FileText size={16} className="text-[#8E593E]" /> NDA Tracker
              </h3>
              <div className="space-y-6">
                {ndaTrackers.map(track => (
                  <div key={track.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="mono text-[0.7rem] font-bold">{track.deal}</span>
                      <span className="mono text-[0.6rem]" style={{ color: track.color }}>{track.label}</span>
                    </div>
                    <div className="h-1 bg-[#1A1A1A] flex">
                      {[...Array(track.total)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 ${i < track.step ? 'bg-[#C1FF00]' : i === track.step ? 'bg-[#8E593E]' : 'bg-[#1A1A1A]'} mr-[2px]`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0F0F0F] border-2 border-[#1A1A1A] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lock size={80} />
              </div>
              <h3 className="mono text-sm font-bold mb-6 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#8E593E]" /> Verification Vault
              </h3>
              <div className="space-y-4">
                <div className="bg-[#050505] border border-[#1A1A1A] p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="mono text-[0.6rem] text-[#666]">Proof of Funds</span>
                    <span className="mono text-[0.6rem] text-[#C1FF00]">Verified</span>
                  </div>
                  <div className="mono text-lg font-bold">$2,500,000.00</div>
                  <div className="mono text-[0.5rem] text-[#444] mt-1">Ref ID: OX-99283-FND</div>
                </div>
                <div className="bg-[#050505] border border-[#1A1A1A] p-4 opacity-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="mono text-[0.6rem] text-[#666]">SBA Prequalification</span>
                    <span className="mono text-[0.6rem] text-[#8E593E]">Pending Update</span>
                  </div>
                  <div className="mono text-lg font-bold">In Review</div>
                </div>
                <button className="w-full border border-[#8E593E] text-[#8E593E] mono text-[0.7rem] py-3 hover:bg-[#8E593E] hover:text-[#F5F5F0] transition-all">
                  Upload New Statements
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bloomberg Chat Interface */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-[#0F0F0F] border-2 border-[#1A1A1A] h-full flex flex-col min-h-[600px]">
            <div className="p-4 border-b-2 border-[#1A1A1A] bg-[#0A0A0A] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#C1FF00] rounded-full animate-pulse" />
                <h3 className="mono text-sm font-bold">Terminal Messenger</h3>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 border border-[#1A1A1A] flex items-center justify-center cursor-pointer hover:bg-[#1A1A1A]">
                  <span className="mono text-[0.6rem]">_</span>
                </div>
                <div className="w-6 h-6 border border-[#1A1A1A] flex items-center justify-center cursor-pointer hover:bg-[#1A1A1A]">
                  <span className="mono text-[0.6rem]">×</span>
                </div>
              </div>
            </div>
            
            {/* Broker List Select */}
            <div className="bg-[#050505] border-b border-[#1A1A1A] p-2 flex gap-2 overflow-x-auto">
              <button className="bg-[#1A1A1A] border border-[#C1FF00] px-3 py-1 mono text-[0.6rem] text-[#C1FF00] whitespace-nowrap">
                M. VANCE (BROKER)
              </button>
              <button className="bg-transparent border border-[#1A1A1A] px-3 py-1 mono text-[0.6rem] text-[#666] whitespace-nowrap">
                L. CHEN (FINANCE)
              </button>
              <button className="bg-transparent border border-[#1A1A1A] px-3 py-1 mono text-[0.6rem] text-[#666] whitespace-nowrap">
                D. ROSS (ESCROW)
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[0.75rem]">
              <div className="text-center py-2 opacity-30 text-[0.6rem] mono tracking-widest">
                --- SECURE ENCRYPTED SESSION START ---
              </div>
              
              {messages.map(msg => (
                <div key={msg.id} className={`${msg.type === 'system' ? 'bg-[#1A1A1A]/50 p-2 border-l-2 border-[#8E593E]' : ''}`}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`font-bold ${
                      msg.type === 'sent' ? 'text-[#C1FF00]' : 
                      msg.type === 'system' ? 'text-[#8E593E]' : 'text-[#F5F5F0]'
                    }`}>
                      {msg.sender}:
                    </span>
                    <span className="text-[0.6rem] text-[#444]">{msg.time}</span>
                  </div>
                  <div className={`${msg.type === 'system' ? 'text-[#8E593E]' : 'text-[#aaa]'} leading-relaxed`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#050505] border-t-2 border-[#1A1A1A]">
              <div className="relative">
                <textarea 
                  className="w-full bg-[#0F0F0F] border border-[#1A1A1A] p-3 mono text-[0.7rem] text-[#C1FF00] focus:outline-none focus:border-[#C1FF00] resize-none h-24 placeholder:text-[#333]"
                  placeholder="EXECUTE MESSAGE..."
                />
                <button className="absolute bottom-3 right-3 bg-[#C1FF00] text-black px-4 py-1 mono text-[0.7rem] font-bold hover:bg-transparent hover:text-[#C1FF00] border border-[#C1FF00] transition-all">
                  SEND
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex gap-4">
                  <span className="mono text-[0.5rem] text-[#444] cursor-pointer hover:text-[#F5F5F0]">/ATTACH_FILE</span>
                  <span className="mono text-[0.5rem] text-[#444] cursor-pointer hover:text-[#F5F5F0]">/SET_PRIORITY</span>
                </div>
                <span className="mono text-[0.5rem] text-[#C1FF00]">CONNECTION: STABLE</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      <footer className="mt-12 p-8 border-t-2 border-[#1A1A1A] flex justify-between items-center opacity-50">
        <div className="mono text-[0.6rem]">
          SESSION_TOKEN: 0x82...E921 | ENCRYPTION: AES-256-GCM
        </div>
        <div className="mono text-[0.6rem]">
          © 2024 OXIDIZED LEDGER INC. / COMMAND_CENTER_V2
        </div>
      </footer>
    </div>
  );
};

export default SavedDeals;

'
```