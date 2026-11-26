"use client";

import { useState, useEffect } from "react";

// MOCK DATA MATCHING BASE COMPONENT
const INITIAL_WATCHLIST = [
  {
    id: "delta",
    codename: "Project Delta",
    sector: "Logistics",
    revenue: 2400000,
    ebitda: 620000,
    asking: 1800000,
    multiple: 2.9,
    location: "Midwest Territory",
    status: "CIM RECEIVED",
    broker: "Sarah Jenkins",
    brokerFirm: "Moonshine Capital",
  },
  {
    id: "hvac-nova",
    codename: "Project Nova",
    sector: "Home Services",
    revenue: 3100000,
    ebitda: 810000,
    asking: 2600000,
    multiple: 3.2,
    location: "Franconia, VA",
    status: "ACTIVE INQUIRY",
    broker: "Gary Vance",
    brokerFirm: "Apex Brokerage",
  },
  {
    id: "kestrel",
    codename: "Project Kestrel",
    sector: "SaaS",
    revenue: 1200000,
    ebitda: 450000,
    asking: 1900000,
    multiple: 4.2,
    location: "100% Remote",
    status: "LOI PREPARATION",
    broker: "Alex Rivera",
    brokerFirm: "Vanguard Digital",
  }
];

const INITIAL_CONVERSATIONS = {
  "delta": [
    { sender: "broker", text: "Seller is willing to take a 10% standby seller note if SBA debt is approved.", time: "10:24 AM" },
    { sender: "user", text: "Excellent. What is the lease transition term for the central warehouse?", time: "10:31 AM" },
    { sender: "broker", text: "5 years initial + five-year option. Landlord is willing to assign the lease directly.", time: "10:45 AM" }
  ],
  "hvac-nova": [
    { sender: "broker", text: "Are you prepared to submit proof of funds before the site visit?", time: "Yesterday" },
    { sender: "user", text: "Yes, Plaid data verification is integrated. Sending secure credential link.", time: "Yesterday" }
  ],
  "kestrel": [
    { sender: "broker", text: "We have two other bids. Can you waive the legacy database audit contingency?", time: "2 days ago" },
    { sender: "user", text: "Negative. System transition risk requires standard 30-day technical validation.", time: "2 days ago" }
  ]
};

export default function DashboardPage() {
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);
  const [conversations, setConversations] = useState<Record<string, Array<{sender: string, text: string, time: string}>>>(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState("delta");
  const [replyText, setReplyText] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "SYS // SECURE SOCKET INITIALIZED ON PORT 883",
    "ALRT // PIPELINE SCANNER LISTENING ON SAAS/LOGISTICS/INFRASTRUCTURE",
    "SYNC // PLAID DATA FEED SECURED STATUS 200",
    "READY // MONITORING 3 ACTIVE ACQUISITION PATHWAYS"
  ]);

  // Alert Rule State
  const [alertSector, setAlertSector] = useState("SaaS");
  const [alertMinEbitda, setAlertMinEbitda] = useState(500000);
  const [alertMaxMultiple, setAlertMaxMultiple] = useState(3.5);
  const [activeAlerts, setActiveAlerts] = useState<Array<{sector: string, minEbitda: number, maxMultiple: number}>>([
    { sector: "Manufacturing", minEbitda: 750000, maxMultiple: 3.2 }
  ]);

  // Calculations
  const totalPipelineValue = watchlist.reduce((acc, item) => acc + item.asking, 0);
  const totalPipelineEbitda = watchlist.reduce((acc, item) => acc + item.ebitda, 0);
  const averageMultiple = watchlist.length > 0 
    ? (watchlist.reduce((acc, item) => acc + item.multiple, 0) / watchlist.length).toFixed(2)
    : "0.00";

  // Actions
  const removeWatchlistItem = (id: string) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
    addLog(`SYS // REMOVED PROJECT [${id.toUpperCase()}] FROM WATCHLIST`);
  };

  const addLog = (text: string) => {
    const time = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [`[${time}] ${text}`, ...prev.slice(0, 15)]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      sender: "user",
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));
    setReplyText("");
    addLog(`COMM // DISPATCHED SECURE MESSAGE TO BROKER ON CHAT ID [${activeChatId.toUpperCase()}]`);

    // Simulate auto Broker Reply
    setTimeout(() => {
      const responses = [
        "Transmission acknowledged. Reviewing with general counsel.",
        "Understood. Will provide update from client within 24 hours.",
        "Information uploaded to virtual data room (VDR)."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      const brokerMsg = {
        sender: "broker",
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setConversations(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), brokerMsg]
      }));
      addLog(`COMM // INBOUND ENCRYPTED RESPONSE RECEIVED ON [${activeChatId.toUpperCase()}]`);
    }, 2500);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert = { sector: alertSector, minEbitda: alertMinEbitda, maxMultiple: alertMaxMultiple };
    setActiveAlerts([newAlert, ...activeAlerts]);
    addLog(`SYS // CONFIG_ALERT_RULE: IF Sector == '${alertSector}' AND EBITDA >= $${alertMinEbitda.toLocaleString()} AND Multiple <= ${alertMaxMultiple}x`);
  };

  const deleteAlert = (index: number) => {
    setActiveAlerts(activeAlerts.filter((_, i) => i !== index));
    addLog(`SYS // DEACTIVATED CUSTOM ALERT FILTER AT INDEX [${index}]`);
  };

  const activeChat = watchlist.find(item => item.id === activeChatId) || watchlist[0];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F9F9F9] flex flex-col font-sans selection:bg-[#00FF66] selection:text-black">
      
      {/* GLOBAL TICKER HEADER */}
      <header className="w-full bg-[#090909] border-b border-[#222222] h-11 flex items-center overflow-hidden sticky top-0 z-50">
        <div className="bg-[#00FF66] text-black font-mono text-[10px] font-bold px-4 h-full flex items-center space-x-2 shrink-0 border-r border-[#222222] tracking-wider uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-black animate-ping"></span>
          <span>ADMIN INTERFACE</span>
        </div>
        
        <div className="relative w-full overflow-hidden h-full flex items-center font-mono text-[11px] text-[#888888] tracking-widest uppercase">
          <div className="flex whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
            <span className="mx-6 text-[#F9F9F9]"><span className="text-[#00FF66]">●</span> TOTAL PIPELINE: ${(totalPipelineValue/1000000).toFixed(2)}M VALUATION</span>
            <span className="mx-6 text-[#F9F9F9]"><span className="text-[#0EA5E9]">▲</span> AVG MULTIPLE: {averageMultiple}x</span>
            <span className="mx-6 text-[#F9F9F9]"><span className="text-[#FF3333]">■</span> SECURE CHANNEL STATUS: SH-883 ACTIVE</span>
            <span className="mx-6 text-[#F9F9F9]"><span className="text-[#00FF66]">●</span> TOTAL PIPELINE EBITDA: ${(totalPipelineEbitda/1000).toFixed(0)}K</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID CONTAINER */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto border-x border-[#222222] p-4 lg:p-8 space-y-6">
        
        {/* TOP COMMAND SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#222222] pb-6">
          <div>
            <h1 className="font-mono text-xl font-bold tracking-tight text-[#F9F9F9] flex items-center uppercase">
              ACQUIRE<span class="text-[#00FF66]">META</span> // COMMAND CENTER
            </h1>
            <p className="font-mono text-[9px] text-[#666666] tracking-widest uppercase mt-1">
              Live Investor Watchlist, Multi-variable SBA Amortizer & Broker Communications Pipeline
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-black px-4 py-2 border border-[#222222]">
            <span className="w-2 h-2 bg-[#00FF66] animate-pulse"></span>
            <span className="font-mono text-[10px] text-[#888] tracking-widest uppercase">DATA SYNCHRONIZATION ACTIVE</span>
          </div>
        </div>

        {/* 1. AGGREGATED METRICS BENTO BOX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#090909] border border-[#222222] p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#0EA5E9]/5 rounded-full blur-2xl"></div>
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-wider">TOTAL VALUE UNDER REVIEW</p>
            <p className="font-mono text-2xl font-bold text-[#F9F9F9] mt-2">${(totalPipelineValue).toLocaleString()}</p>
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#888]">
              <span>Active Assets: {watchlist.length}</span>
              <span className="text-[#0EA5E9]">▲ CAP_STACK_SBA_COMPLIANT</span>
            </div>
          </div>

          <div className="bg-[#090909] border border-[#222222] p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF66]/5 rounded-full blur-2xl"></div>
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-wider">TOTAL PIPELINE EBITDA</p>
            <p className="font-mono text-2xl font-bold text-[#00FF66] mt-2">${(totalPipelineEbitda).toLocaleString()}</p>
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#888]">
              <span>Avg Margin: {watchlist.length > 0 ? ((totalPipelineEbitda / watchlist.reduce((acc, x) => acc + x.revenue, 0)) * 100).toFixed(1) : "0"}%</span>
              <span className="text-[#00FF66]">● HIGH_CASHFLOW</span>
            </div>
          </div>

          <div className="bg-[#090909] border border-[#222222] p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-wider">WEIGHTED AVG MULTIPLE</p>
            <p className="font-mono text-2xl font-bold text-[#F9F9F9] mt-2">{averageMultiple}x</p>
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#888]">
              <span>Market standard: 3.5x - 4.2x</span>
              <span className="text-[#888]">■ UNDER_MARKET_AVG</span>
            </div>
          </div>

          <div className="bg-[#090909] border border-[#222222] p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF3333]/5 rounded-full blur-2xl"></div>
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-wider">SBA LEVERAGE CAPACITY</p>
            <p className="font-mono text-2xl font-bold text-[#0EA5E9] mt-2">80% MAX</p>
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#888]">
              <span>Simulated Cash Req: ${(totalPipelineValue * 0.1).toLocaleString()}</span>
              <span className="text-[#FF3333]">▲ Variable 11.25% Benchmark</span>
            </div>
          </div>
        </div>

        {/* 2. MAIN LAYOUT SECURE WATCHLIST & COMMUNICATIONS WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN 1 & 2: WATCHLIST & CRITICAL RISK MONITORS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* WATCHLIST CORE INTERFACE */}
            <div className="bg-[#090909] border border-[#222222]">
              <div className="border-b border-[#222222] px-6 py-4 flex justify-between items-center bg-[#0d0d0d]">
                <h2 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9] flex items-center space-x-2">
                  <span className="inline-block w-2 h-2 bg-[#0ea5e9]"></span>
                  <span>01 / PIPELINE & INVESTOR WATCHLIST</span>
                </h2>
                <span className="font-mono text-[10px] text-[#666] uppercase">Real-time valuation index</span>
              </div>

              {watchlist.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-[#555] border-b border-[#222222]">
                  [ SYSTEM EMPTY // NO SAVED ASSETS DETECTED IN WATCHLIST ]
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs text-[#888]">
                    <thead>
                      <tr className="border-b border-[#222222] text-[10px] uppercase text-[#666] bg-black">
                        <th className="py-3 px-4">Codename / Vertical</th>
                        <th className="py-3 px-4">Financial Core (Rev/Ebitda)</th>
                        <th className="py-3 px-4 text-right">Asking / Multiple</th>
                        <th className="py-3 px-4">Status / Pipeline Stage</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222222]">
                      {watchlist.map((item) => (
                        <tr key={item.id} className="hover:bg-black/50 transition-colors group">
                          <td className="py-4 px-4">
                            <span className="text-[#0EA5E9] font-bold block">{item.codename}</span>
                            <span className="text-[10px] text-[#555]">{item.sector} // {item.location}</span>
                          </td>
                          <td className="py-4 px-4 font-bold text-[#F9F9F9]">
                            <span>Rev: ${(item.revenue / 1000000).toFixed(1)}M</span>
                            <span className="block text-[#00FF66] text-[10px]">EBITDA: ${(item.ebitda/1000).toFixed(0)}K</span>
                          </td>
                          <td className="py-4 px-4 text-right font-bold">
                            <span className="text-[#00FF66] block">${(item.asking).toLocaleString()}</span>
                            <span className="text-[#888] text-[10px]">{item.multiple}x Mult.</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block bg-neutral-900 border border-[#222222] text-[9px] px-2.5 py-1 font-bold text-[#F9F9F9] tracking-wider uppercase">
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button 
                                onClick={() => {
                                  setActiveChatId(item.id);
                                  addLog(`SYS // SWAP CHAT WORKSPACE CONTEXT TO [${item.id.toUpperCase()}]`);
                                }}
                                className="px-2.5 py-1 bg-transparent border border-[#0ea5e9]/40 text-[#0ea5e9] hover:bg-[#0ea5e9]/10 text-[9px] uppercase tracking-wider font-semibold"
                                title="Contact Broker"
                              >
                                Secure Msg
                              </button>
                              <button 
                                onClick={() => removeWatchlistItem(item.id)}
                                className="p-1 border border-[#FF3333]/40 text-[#FF3333] hover:bg-[#FF3333]/10 text-[9px]"
                                title="Delete from watchlist"
                              >
                                [ X ]
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* REAL-TIME SYSTEM LOGS TERMINAL */}
            <div className="bg-[#090909] border border-[#222222]">
              <div className="border-b border-[#222222] px-6 py-4 flex justify-between items-center bg-[#0d0d0d]">
                <h2 className="font-mono text-xs uppercase tracking-widest text-[#00FF66] flex items-center space-x-2">
                  <span className="inline-block w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
                  <span>02 / SECURE ALERTS LOG & SYSTEM DISPATCH</span>
                </h2>
                <span className="font-mono text-[9px] text-[#666]">v3.11 CONFIG SHELL</span>
              </div>
              
              <div className="p-4 bg-black/90 font-mono text-[11px] text-[#00FF66] space-y-1.5 h-44 overflow-y-auto">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="flex items-start">
                    <span className="text-[#333] mr-2 shrink-0">&gt;</span>
                    <span className="leading-relaxed">{log}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLUMN 3: EMAIL TRIGGER RULES & SECURE CHAT */}
          <div className="space-y-6">

            {/* ALERT ENGINE & ALGORITHM */}
            <div className="bg-[#090909] border border-[#222222] p-5 space-y-4">
              <div className="border-b border-[#222222] pb-3">
                <span className="font-mono text-[10px] text-[#888] tracking-widest uppercase block">03 / ALERTING TRIGGERS</span>
                <h3 className="font-bold text-xs uppercase tracking-wide text-[#F9F9F9] mt-1">Configure Custom Email Triggers</h3>
              </div>

              <form onSubmit={handleCreateAlert} className="space-y-3">
                <div>
                  <label className="block font-mono text-[9px] uppercase text-[#666] tracking-wider mb-1">Target Sector</label>
                  <select 
                    value={alertSector}
                    onChange={(e) => setAlertSector(e.target.value)}
                    className="w-full bg-black border border-[#222] text-xs font-mono py-2 px-3 text-[#F9F9F9] focus:outline-none focus:border-[#00FF66] appearance-none"
                  >
                    <option value="SaaS">SaaS & Digital</option>
                    <option value="Home Services">Home Services / HVAC</option>
                    <option value="Logistics">Logistics & Transport</option>
                    <option value="Manufacturing">Precision Manufacturing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase text-[#666] tracking-wider mb-1">Min EBITDA Requirement</label>
                  <select 
                    value={alertMinEbitda}
                    onChange={(e) => setAlertMinEbitda(Number(e.target.value))}
                    className="w-full bg-black border border-[#222] text-xs font-mono py-2 px-3 text-[#F9F9F9] focus:outline-none focus:border-[#00FF66] appearance-none"
                  >
                    <option value="300000">$300k+ EBITDA</option>
                    <option value="500000">$500k+ EBITDA</option>
                    <option value="750000">$750k+ EBITDA</option>
                    <option value="1000000">$1M+ EBITDA</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center font-mono text-[9px] text-[#666] mb-1">
                    <span className="uppercase tracking-wider">Max Multiple Threshold</span>
                    <span className="text-[#00FF66] font-bold">{alertMaxMultiple}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.5" 
                    max="5.0" 
                    step="0.1" 
                    value={alertMaxMultiple}
                    onChange={(e) => setAlertMaxMultiple(Number(e.target.value))}
                    className="w-full h-1 bg-neutral-800 accent-[#00FF66] cursor-pointer"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-transparent border border-[#00FF66] text-[#00FF66] font-mono text-[10px] font-bold tracking-widest uppercase hover:bg-[#00FF66] hover:text-black transition-all hover:shadow-[0_0_10px_rgba(0,255,102,0.15)]"
                >
                  Compile Alert Rule & Sync
                </button>
              </form>

              {/* ACTIVE ALERT RULE FEED */}
              <div className="border-t border-[#222222] pt-4">
                <span className="font-mono text-[9px] uppercase text-[#666] block mb-2 tracking-widest">Active Dispatch Rules ({activeAlerts.length})</span>
                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {activeAlerts.map((alert, idx) => (
                    <div key={idx} className="bg-black border border-[#222222] p-2 flex justify-between items-center text-[10px] font-mono">
                      <div className="text-[#888]">
                        <span className="text-[#F9F9F9] font-bold">{alert.sector}</span>: 
                        <span className="block text-[9px] text-[#555]">EBITDA &gt;= ${(alert.minEbitda/1000).toFixed(0)}k | Max Multiple {alert.maxMultiple}x</span>
                      </div>
                      <button 
                        onClick={() => deleteAlert(idx)} 
                        className="text-[#FF3333] hover:underline px-1 text-[9px]"
                      >
                        REMOVE
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SECURE COMM CHAT FRAME */}
            <div className="bg-[#090909] border border-[#222222] flex flex-col h-[340px]">
              
              {/* Chat Title bar */}
              <div className="border-b border-[#222222] bg-[#0d0d0d] px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[8px] text-[#0ea5e9] tracking-widest uppercase block">SECURE SYSTEM COMPLIANT CHAT</span>
                  <span className="text-xs font-mono font-bold text-[#F9F9F9]">
                    {activeChat ? `${activeChat.codename} // Broker Liaison` : "LIAISON CONTEXT"}
                  </span>
                </div>
                <span className="w-1.5 h-1.5 bg-[#00FF66] rounded-full"></span>
              </div>

              {/* Chat messages */}
              <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-black/40">
                {activeChat && conversations[activeChat.id] ? (
                  conversations[activeChat.id].map((msg, i) => (
                    <div 
                      key={i} 
                      className={`max-w-[85%] flex flex-col space-y-1 ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                    >
                      <div 
                        className={`p-2.5 font-mono text-[11px] leading-relaxed border ${
                          msg.sender === "user" 
                            ? "bg-neutral-900 border-[#0ea5e9]/30 text-[#F9F9F9]" 
                            : "bg-[#090909] border-[#222] text-[#888]"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-[#555] font-mono">{msg.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-xs font-mono text-[#555]">
                    [ NO ACTIVE MESSAGES IN SYSTEM ]
                  </div>
                )}
              </div>

              {/* Chat input form */}
              <form onSubmit={handleSendMessage} className="border-t border-[#222222] p-2 flex gap-1 bg-black">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Enter encrypted response..."
                  className="flex-grow bg-[#090909] border border-[#222222] text-xs font-mono text-[#F9F9F9] placeholder-[#555] px-3 focus:outline-none focus:border-[#0ea5e9]"
                />
                <button 
                  type="submit" 
                  className="bg-[#0ea5e9] hover:bg-[#00ff66] hover:text-black font-mono text-[10px] text-black uppercase font-bold px-4 py-2 transition-all shrink-0"
                >
                  DISPATCH
                </button>
              </form>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER METRICS AND STATEMENTS */}
      <footer className="mt-auto w-full bg-[#080808] border-t border-[#222222]">
        <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-4xl space-y-1">
              <p className="font-mono text-[10px] text-[#666666] leading-relaxed">
                Advisory Protocol Disclaimer: Information tracked inside AcquireMeta Dashboard is protected under double-blind network filters. Past client results are simulation engines built for acquisition analysis under strict confidentiality agreements.
              </p>
              <p className="font-mono text-[9px] text-[#444444]">
                All data transmission uses secure terminal architecture SH-883.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0 font-mono text-[10px]">
              <span className="h-8 border border-[#222] bg-black px-3 py-1 flex items-center text-[#888] tracking-widest uppercase">
                SECURE ACCESS GRANTED
              </span>
              <span className="h-8 border border-[#222] bg-black px-3 py-1 flex items-center text-[#00FF66] tracking-widest uppercase">
                TERMINAL ONLINE
              </span>
            </div>
          </div>
          <div className="border-t border-[#111] pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-[#444]">
            <span>SYSTEM CONSOLE v3.11</span>
            <span>© 2026 ACQUIREMETA & MOONSHINE CAPITAL. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}