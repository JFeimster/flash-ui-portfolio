'use client';

import React, { useState } from 'react';
import { Shield, MessageSquare, Clock, FileCheck, Lock, ChevronRight, Send, AlertTriangle } from 'lucide-react';

interface DealNDA {
  id: string;
  businessName: string;
  status: 'PENDING' | 'SIGNED' | 'VERIFYING' | 'EXECUTED';
  broker: string;
  lastUpdated: string;
  actionRequired: boolean;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export default function NDATracker() {
  const [activeChat, setActiveChat] = useState("Precision HVAC");
  const [messageInput, setMessageInput] = useState("");

  const ndas: DealNDA[] = [
    { id: '001', businessName: 'Precision HVAC & Cooling', status: 'EXECUTED', broker: 'Alpine Mergers', lastUpdated: '2H AGO', actionRequired: false },
    { id: '002', businessName: 'Logistics SaaS (ERP)', status: 'VERIFYING', broker: 'Quiet Light', lastUpdated: '5H AGO', actionRequired: true },
    { id: '003', businessName: 'Laundromat Portfolio', status: 'PENDING', broker: 'LocalBiz Brokers', lastUpdated: '1D AGO', actionRequired: false },
    { id: '004', businessName: 'Concrete Paving & Repair', status: 'SIGNED', broker: 'Industry Giants', lastUpdated: '3D AGO', actionRequired: false },
  ];

  const messages: Message[] = [
    { id: 1, sender: "SYSTEM", text: "SECURE CHANNEL ESTABLISHED", timestamp: "09:00", isAdmin: true },
    { id: 2, sender: "BROKER_ALPINEM", text: "Received your POF. It's currently being verified by our compliance team.", timestamp: "09:12", isAdmin: false },
    { id: 3, sender: "BUYER_0x8821", text: "Understood. What is the expected turnaround for the full CIM?", timestamp: "10:05", isAdmin: false },
    { id: 4, sender: "BROKER_ALPINEM", text: "Usually 24 hours. The seller is sensitive about employee confidentiality.", timestamp: "10:10", isAdmin: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXECUTED': return 'text-[#C1FF00]';
      case 'VERIFYING': return 'text-[#FF3D00]';
      case 'PENDING': return 'text-[#8E593E]';
      default: return 'text-[#F5F5F0]';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#C1FF00] selection:text-[#050505] p-4 md:p-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-2 border-[#1A1A1A] pb-6 gap-4">
        <div>
          <h2 className="font-mono text-[#8E593E] text-xs tracking-widest mb-2 uppercase">/ / COMMAND_CENTER / BUYER_PORTAL</h2>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Deal Flow Terminal</h1>
        </div>
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-4 flex gap-6">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#666] uppercase">POF Verification</span>
            <span className="font-mono text-[#C1FF00] flex items-center gap-2 text-sm uppercase font-bold">
              <Lock size={12} /> Vault Verified
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#666] uppercase">Active Search</span>
            <span className="font-mono text-[#F5F5F0] text-sm uppercase font-bold">04 Acquisitions</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* NDA & Watchlist Section */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <FileCheck size={16} className="text-[#C1FF00]" /> NDA Status Tracker
              </h3>
              <span className="text-[10px] bg-[#1A1A1A] px-2 py-1 text-[#666] font-mono">LATEST UPDATE: 14:02 UTC</span>
            </div>
            
            <div className="space-y-3">
              {ndas.map((nda) => (
                <div key={nda.id} className="group bg-[#0F0F0F] border-2 border-[#1A1A1A] p-4 flex items-center justify-between hover:border-[#F5F5F0] transition-all cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#8E593E] font-bold uppercase mb-1">{nda.broker}</span>
                    <h4 className="font-bold text-lg uppercase tracking-tight">{nda.businessName}</h4>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <span className="block font-mono text-[10px] text-[#666] uppercase">Status</span>
                      <span className={`font-mono text-xs font-bold uppercase ${getStatusColor(nda.status)}`}>
                        {nda.status}
                      </span>
                    </div>
                    {nda.actionRequired ? (
                      <div className="bg-[#FF3D00] p-2 animate-pulse">
                        <AlertTriangle size={16} className="text-[#F5F5F0]" />
                      </div>
                    ) : (
                      <ChevronRight size={20} className="text-[#333] group-hover:text-[#C1FF00]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Assets / Watchlist */}
          <div className="border-t-2 border-[#1A1A1A] pt-8">
            <h3 className="font-mono text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Clock size={16} className="text-[#8E593E]" /> Saved for Review
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Specialty Coffee Roastery", price: "$550K", cashflow: "$140K" },
                { name: "Mobile Auto Franchise", price: "$275K", cashflow: "$110K" }
              ].map((item, i) => (
                <div key={i} className="bg-[#0F0F0F] border border-[#1A1A1A] p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 bg-[#1A1A1A] text-[8px] text-[#666] font-mono">SAVE_ID: 0{i+9}</div>
                  <h5 className="font-bold text-sm uppercase mb-2">{item.name}</h5>
                  <div className="flex justify-between font-mono text-xs italic">
                    <span className="text-[#C1FF00]">{item.price}</span>
                    <span className="text-[#666]">SDE: {item.cashflow}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messaging Interface (Bloomberg Style) */}
        <div className="lg:col-span-5 flex flex-col h-[700px] border-2 border-[#1A1A1A] bg-[#0A0A0A]">
          {/* Messenger Header */}
          <div className="p-4 border-b-2 border-[#1A1A1A] bg-[#0F0F0F] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#C1FF00] animate-pulse"></div>
              <div>
                <h3 className="font-mono text-xs font-black uppercase text-[#F5F5F0]">SECURE_MSG // {activeChat}</h3>
                <p className="text-[10px] text-[#666] font-mono uppercase tracking-tighter italic">End-to-End Encrypted Node: 192.88.1.0</p>
              </div>
            </div>
            <Shield size={18} className="text-[#666]" />
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[#1A1A1A]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isAdmin ? 'items-center' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-mono text-[10px] font-bold ${msg.isAdmin ? 'text-[#C1FF00]' : 'text-[#8E593E]'}`}>
                    {msg.sender}
                  </span>
                  <span className="font-mono text-[9px] text-[#333] italic">{msg.timestamp}</span>
                </div>
                <div className={`
                  p-3 text-xs font-mono leading-relaxed max-w-[85%]
                  ${msg.isAdmin ? 'bg-[#1A1A1A] text-[#C1FF00] border-l-2 border-[#C1FF00] italic' : 'bg-[#0F0F0F] border border-[#1A1A1A] text-[#F5F5F0]'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t-2 border-[#1A1A1A] bg-[#0F0F0F]">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="TYPE SECURE COMMAND..." 
                className="flex-1 bg-[#050505] border border-[#1A1A1A] p-3 font-mono text-xs text-[#C1FF00] focus:outline-none focus:border-[#F5F5F0] placeholder-[#333]"
              />
              <button className="bg-[#F5F5F0] text-[#050505] px-4 py-2 hover:bg-[#C1FF00] transition-colors">
                <Send size={18} />
              </button>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-[8px] font-mono text-[#444] uppercase tracking-widest">Awaiting broker response...</span>
              <span className="text-[8px] font-mono text-[#444] uppercase tracking-widest">Press Enter to Send</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #1A1A1A;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #C1FF00;
        }
      `}</style>
    </div>
  );
}
'