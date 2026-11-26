```tsx
import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface SavedDeal {
  id: string;
  codename: string;
  sector: string;
  revenue: number;
  ebitda: number;
  asking: number;
  multiple: number;
  location: string;
  brokerName: string;
  brokerFirm: string;
  ndaStatus: 'NOT_STARTED' | 'NDA_SENT' | 'NDA_EXECUTED' | 'CIM_RECEIVED';
  lastActivity: string;
  hasNewAlert: boolean;
}

interface BrokerMessage {
  id: string;
  dealId: string;
  dealCodename: string;
  brokerName: string;
  avatarInitials: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  secureChannel: string;
}

interface AlertConfig {
  id: string;
  label: string;
  active: boolean;
  value: string;
  category: 'sector' | 'financial' | 'compliance';
}

interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'SYSTEM' | 'ALERT' | 'SECURE' | 'BROKER';
  message: string;
}

// ==========================================
// MOCK DATA
// ==========================================

const INITIAL_SAVED_DEALS: SavedDeal[] = [
  {
    id: "delta",
    codename: "Project Delta — B2B Logistics Agency",
    sector: "Logistics",
    revenue: 2400000,
    ebitda: 620000,
    asking: 1800000,
    multiple: 2.9,
    location: "Midwest Territory",
    brokerName: "Marcus Vance",
    brokerFirm: "Apex Intermediaries",
    ndaStatus: "NDA_EXECUTED",
    lastActivity: "2 hours ago",
    hasNewAlert: true,
  },
  {
    id: "kestrel",
    codename: "Project Kestrel — Cloud Asset Management SaaS",
    sector: "SaaS",
    revenue: 1200000,
    ebitda: 450000,
    asking: 1900000,
    multiple: 4.2,
    location: "100% Remote",
    brokerName: "Sarah Stone",
    brokerFirm: "Vanguard Tech M&A",
    ndaStatus: "CIM_RECEIVED",
    lastActivity: "1 day ago",
    hasNewAlert: false,
  },
  {
    id: "hvac-nova",
    codename: "Project Nova — Regional HVAC & Infrastructure Service",
    sector: "Home Services",
    revenue: 3100000,
    ebitda: 810000,
    asking: 2600000,
    multiple: 3.2,
    location: "Franconia, VA",
    brokerName: "Jameson Croft",
    brokerFirm: "Blue Ridge Advisors",
    ndaStatus: "NDA_SENT",
    lastActivity: "3 days ago",
    hasNewAlert: false,
  },
  {
    id: "onyx",
    codename: "Project Onyx — Precision Component CNC Manufacturing",
    sector: "Manufacturing",
    revenue: 5800000,
    ebitda: 1200000,
    asking: 3800000,
    multiple: 3.1,
    location: "Atlanta Hub",
    brokerName: "Evelyn Reed",
    brokerFirm: "Cascade Partners",
    ndaStatus: "NDA_EXECUTED",
    lastActivity: "5 mins ago",
    hasNewAlert: true,
  }
];

const INITIAL_CONVERSATIONS: BrokerMessage[] = [
  {
    id: "msg-1",
    dealId: "onyx",
    dealCodename: "Project Onyx",
    brokerName: "Evelyn Reed",
    avatarInitials: "ER",
    lastMessage: "Cleaned tax returns for FY24 uploaded to secure virtual data room. Let me know when you've reviewed.",
    timestamp: "14:32:01 SEC",
    unread: true,
    secureChannel: "SH-883",
  },
  {
    id: "msg-2",
    dealId: "delta",
    dealCodename: "Project Delta",
    brokerName: "Marcus Vance",
    avatarInitials: "MV",
    lastMessage: "Sellers agreed to the 15% standby structured note. Next step is to align with the bank SBA rep.",
    timestamp: "11:15:40 SEC",
    unread: false,
    secureChannel: "SH-412",
  },
  {
    id: "msg-3",
    dealId: "kestrel",
    dealCodename: "Project Kestrel",
    brokerName: "Sarah Stone",
    avatarInitials: "SS",
    lastMessage: "Requested raw customer cohort retention data. Codebase assessment is scheduled for Tuesday.",
    timestamp: "YESTERDAY",
    unread: false,
    secureChannel: "SH-011",
  }
];

const INITIAL_ALERTS: AlertConfig[] = [
  { id: "alt-1", label: "MINIMUM EBITDA THRESHOLD", active: true, value: "$500,000+", category: "financial" },
  { id: "alt-2", label: "MAX MULTIPLE CAP", active: true, value: "3.5x Max", category: "financial" },
  { id: "alt-3", label: "PRECISION MANUFACTURING VERTICAL", active: true, value: "Manufacturing", category: "sector" },
  { id: "alt-4", label: "SBA 7(a) PRE-QUALIFIED FILTER", active: false, value: "Qualified Only", category: "compliance" },
  { id: "alt-5", label: "DIGITAL & SAAS CHANNELS", active: false, value: "SaaS / Digital", category: "sector" },
];

const INITIAL_LOGS: TerminalLog[] = [
  { id: "log-1", timestamp: "16:20:05", type: "SYSTEM", message: "SECURE CHANNEL INITIALIZED FOR BROKER HANDSHAKES" },
  { id: "log-2", timestamp: "16:21:40", type: "ALERT", message: "CRON RUN: SCANNING 14 ACTIVE INTERMEDIARY NETWORKS..." },
  { id: "log-3", timestamp: "16:21:42", type: "ALERT", message: "MATCH FOUND FOR PROJECT ONYX [MANUFACTURING - 3.1x]" },
  { id: "log-4", timestamp: "16:25:11", type: "BROKER", message: "SECURE DATAROOM ACCESS REFRESHED BY EVELYN REED" },
];

export default function SavedDealsGrid() {
  // State management
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>(INITIAL_SAVED_DEALS);
  const [conversations, setConversations] = useState<BrokerMessage[]>(INITIAL_CONVERSATIONS);
  const [alerts, setAlerts] = useState<AlertConfig[]>(INITIAL_ALERTS);
  const [logs, setLogs] = useState<TerminalLog[]>(INITIAL_LOGS);
  
  // Interactive inputs
  const [activeTab, setActiveTab] = useState<'WATCHLIST' | 'SECURE_COMMS'>('WATCHLIST');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [brokerMessageInput, setBrokerMessageInput] = useState("");
  const [activeBrokerId, setActiveBrokerId] = useState<string>("msg-1");
  const [filterText, setFilterText] = useState("");

  // Simulated live logging effect
  useEffect(() => {
    const messages = [
      "CRON CHECK: No new customer concentration breaches found in pipeline.",
      "ALERT PIPELINE: New listing registered: Project Aegis (HVAC, $1.1M EBITDA). Waiting for CIM.",
      "SECURE CORE: End-to-end encrypted connection verified for broker Sarah Stone.",
      "DATABASE SYNC: Watchlist valuation structures updated with latest SBA interest rates.",
      "METADATA CACHE: Recalculated post-debt SBA cash flows for all marked entities."
    ];
    
    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0];
      
      setLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp,
          type: Math.random() > 0.6 ? 'ALERT' : 'SYSTEM',
          message: randomMsg
        },
        ...prev.slice(0, 9) // Keep last 10 logs
      ]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Aggregation Calculations (Watchlist Metrics)
  const stats = useMemo(() => {
    if (savedDeals.length === 0) {
      return { totalEbitda: 0, avgMultiple: 0, totalValue: 0, activeCount: 0 };
    }
    const totalEbitda = savedDeals.reduce((sum, item) => sum + item.ebitda, 0);
    const totalAsking = savedDeals.reduce((sum, item) => sum + item.asking, 0);
    const avgMultiple = savedDeals.reduce((sum, item) => sum + item.multiple, 0) / savedDeals.length;
    return {
      totalEbitda,
      avgMultiple: parseFloat(avgMultiple.toFixed(2)),
      totalValue: totalAsking,
      activeCount: savedDeals.length
    };
  }, [savedDeals]);

  // Handle removing a deal from watchlist
  const handleRemoveDeal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedDeals(prev => prev.filter(deal => deal.id !== id));
    
    // Add terminal log
    const now = new Date();
    setLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: now.toTimeString().split(' ')[0],
        type: 'SYSTEM',
        message: `DEAL STATUS CHANGED: REMOVED RECORD FROM TRACKING SYSTEM`
      },
      ...prev
    ]);
  };

  // Toggle active alert criteria
  const handleToggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    
    const alertItem = alerts.find(a => a.id === id);
    if (alertItem) {
      const status = !alertItem.active ? 'ACTIVATED' : 'DEACTIVATED';
      const now = new Date();
      setLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: now.toTimeString().split(' ')[0],
          type: 'ALERT',
          message: `ALERT PROFILE MODIFIED: ${alertItem.label} -> ${status}`
        },
        ...prev
      ]);
    }
  };

  // Status badge style helper
  const getNdaStatusStyles = (status: SavedDeal['ndaStatus']) => {
    switch(status) {
      case 'NOT_STARTED':
        return 'border-[#FF3333]/30 text-[#FF3333] bg-[#FF3333]/5';
      case 'NDA_SENT':
        return 'border-[#0EA5E9]/30 text-[#0EA5E9] bg-[#0EA5E9]/5';
      case 'NDA_EXECUTED':
        return 'border-[#00FF66]/30 text-[#00FF66] bg-[#00FF66]/5';
      case 'CIM_RECEIVED':
        return 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/10 font-bold';
    }
  };

  const getNdaStatusLabel = (status: SavedDeal['ndaStatus']) => {
    return status.replace('_', ' ');
  };

  // Send a simulated message in broker portal
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brokerMessageInput.trim()) return;

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeBrokerId) {
        return {
          ...conv,
          lastMessage: brokerMessageInput,
          timestamp: "JUST NOW",
          unread: false
        };
      }
      return conv;
    }));

    // Log the transmission
    const activeConv = conversations.find(c => c.id === activeBrokerId);
    const now = new Date();
    setLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: now.toTimeString().split(' ')[0],
        type: 'SECURE',
        message: `MESSAGE ENCRYPTED & TRANSMITTED TO BROKER: ${activeConv?.brokerName || 'UNKNOWN'}`
      },
      ...prev
    ]);

    setBrokerMessageInput("");
  };

  // Filter deals based on search
  const filteredDeals = savedDeals.filter(deal => 
    deal.codename.toLowerCase().includes(filterText.toLowerCase()) || 
    deal.sector.toLowerCase().includes(filterText.toLowerCase())
  );

  const selectedBrokerConvo = conversations.find(c => c.id === activeBrokerId);

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] font-sans antialiased border border-[#222222]">
      
      {/* SECTION HEADER: CONTROL CENTRE BANNER */}
      <div className="border-b border-[#222222] bg-[#080808] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
            <span className="font-mono text-[10px] text-[#0ea5e9] tracking-widest uppercase">META OPERATIONS</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#F9F9F9] font-mono mt-1">
            DEAL FLOW COMMAND CENTER
          </h2>
          <p className="text-xs text-[#888] font-mono mt-0.5">Secure watchlist metrics, direct broker pipelines & custom trigger systems.</p>
        </div>

        {/* Action Tabs selector */}
        <div className="flex bg-[#0c0c0c] border border-[#222222] p-1 font-mono text-[11px] shrink-0">
          <button 
            onClick={() => setActiveTab('WATCHLIST')}
            className={`px-4 py-2 uppercase transition-all tracking-wider ${activeTab === 'WATCHLIST' ? 'bg-[#00FF66] text-black font-bold' : 'text-[#888] hover:text-[#F9F9F9]'}`}
          >
            Watchlist ({savedDeals.length})
          </button>
          <button 
            onClick={() => setActiveTab('SECURE_COMMS')}
            className={`px-4 py-2 uppercase transition-all tracking-wider flex items-center space-x-1.5 ${activeTab === 'SECURE_COMMS' ? 'bg-[#00FF66] text-black font-bold' : 'text-[#888] hover:text-[#F9F9F9]'}`}
          >
            <span>Secure Comms</span>
            {conversations.some(c => c.unread) && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF3333]"></span>
            )}
          </button>
        </div>
      </div>

      {/* AGGREGATED PORTFOLIO METRICS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#050505] border-b border-[#222222] divide-x divide-y lg:divide-y-0 divide-[#222222]">
        <div className="p-4 bg-gradient-to-br from-[#070707] to-black">
          <span className="font-mono text-[9px] text-[#666] tracking-widest block uppercase">COMBINED SAVED EBITDA</span>
          <span className="text-xl font-bold text-[#00FF66] tracking-wide font-mono block mt-1">
            ${(stats.totalEbitda / 1000000).toFixed(2)}M
          </span>
          <span className="font-mono text-[9px] text-[#444] block mt-0.5">Aggregated platforms capacity</span>
        </div>
        <div className="p-4 bg-gradient-to-br from-[#070707] to-black">
          <span className="font-mono text-[9px] text-[#666] tracking-widest block uppercase">PIPELINE CAPITAL VALUE</span>
          <span className="text-xl font-bold text-[#F9F9F9] tracking-wide font-mono block mt-1">
            ${(stats.totalValue / 1000000).toFixed(2)}M
          </span>
          <span className="font-mono text-[9px] text-[#444] block mt-0.5">Accumulated enterprise asking valuation</span>
        </div>
        <div className="p-4 bg-gradient-to-br from-[#070707] to-black">
          <span className="font-mono text-[9px] text-[#666] tracking-widest block uppercase">WEIGHTED AVERAGE MULTIPLE</span>
          <span className="text-xl font-bold text-[#0EA5E9] tracking-wide font-mono block mt-1">
            {stats.avgMultiple}x
          </span>
          <span className="font-mono text-[9px] text-[#444] block mt-0.5">Market benchmark benchmark: 3.25x</span>
        </div>
        <div className="p-4 bg-gradient-to-br from-[#070707] to-black">
          <span className="font-mono text-[9px] text-[#666] tracking-widest block uppercase">CRITICAL SYSTEM TASKS</span>
          <span className="text-xl font-bold text-[#FF3333] tracking-wide font-mono block mt-1 flex items-center space-x-1.5">
            <span>{savedDeals.filter(d => d.ndaStatus === 'NDA_SENT' || d.ndaStatus === 'NOT_STARTED').length} Pending</span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF3333] animate-ping"></span>
          </span>
          <span className="font-mono text-[9px] text-[#444] block mt-0.5">NDAs awaiting physical action</span>
        </div>
      </div>

      {/* CORE WORKSPACE CONTENT PANEL */}
      <div className="flex flex-col xl:flex-row w-full">
        
        {/* LEFT WORKSPACE PANEL (Active tab render space) */}
        <div className="flex-grow p-4 lg:p-6 border-b xl:border-b-0 xl:border-r border-[#222222] min-w-0">
          
          {activeTab === 'WATCHLIST' ? (
            <div className="space-y-6">
              
              {/* Filter controls & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9] flex items-center space-x-2">
                    <span>TRACKED PLATFORMS POOL</span>
                    <span className="text-[10px] text-[#888]">({filteredDeals.length} active logs)</span>
                  </h3>
                </div>
                {/* Micro Search filter */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Filter watchlist..." 
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-full sm:w-60 h-8 bg-black border border-[#222222] px-3 font-mono text-[11px] text-[#F9F9F9] placeholder-[#555] focus:outline-none focus:border-[#00FF66]"
                  />
                  {filterText && (
                    <button 
                      onClick={() => setFilterText("")}
                      className="absolute right-2.5 top-2 text-[#666] hover:text-[#FF3333] font-mono text-[10px]"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              {/* SAVED DEALS CARD SYSTEM */}
              {filteredDeals.length === 0 ? (
                <div className="h-64 border border-dashed border-[#222222] flex flex-col items-center justify-center p-8 space-y-3">
                  <span className="font-mono text-xs text-[#555] tracking-widest uppercase">/ PIPELINE REGISTER EMPTY OR FILTERED OUT /</span>
                  <p className="text-[11px] text-[#444] text-center font-mono max-w-sm">No items in database match "{filterText}". Add listings to watchlist from main feed to initialize terminal monitoring.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDeals.map(deal => {
                    const margin = ((deal.ebitda / deal.revenue) * 100).toFixed(1);
                    return (
                      <div 
                        key={deal.id}
                        className={`bg-[#080808] border p-5 hover:border-[#0EA5E9] transition-all relative group duration-300 ${deal.hasNewAlert ? 'border-[#00FF66]/30' : 'border-[#222222]'}`}
                      >
                        {deal.hasNewAlert && (
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00FF66] to-[#0ea5e9]"></div>
                        )}

                        {/* Card Header metadata */}
                        <div className="flex justify-between items-start gap-2 border-b border-[#181818] pb-3 mb-4">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[9px] text-[#0EA5E9] tracking-widest uppercase">{deal.sector} // {deal.location}</span>
                            <h4 className="text-sm font-bold text-[#F9F9F9] tracking-tight truncate max-w-[220px]">
                              {deal.codename.split('—')[0]}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            {deal.hasNewAlert && (
                              <span className="bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 font-mono text-[8px] px-1.5 py-0.5 uppercase tracking-tighter">
                                UPDATED
                              </span>
                            )}
                            <button 
                              onClick={(e) => handleRemoveDeal(deal.id, e)}
                              title="Delete from Watchlist"
                              className="text-[#555] hover:text-[#FF3333] border border-[#222] bg-black hover:border-[#FF3333]/30 p-1 transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Financial Metrics Stack */}
                        <div className="grid grid-cols-3 gap-1.5 mb-4">
                          <div className="bg-black border border-[#141414] p-2">
                            <span className="font-mono text-[8px] text-[#555] block uppercase">REVENUE</span>
                            <span className="text-[11px] font-bold text-[#F9F9F9] font-mono mt-0.5 block">${(deal.revenue/1000).toLocaleString()}k</span>
                          </div>
                          <div className="bg-black border border-[#141414] p-2">
                            <span className="font-mono text-[8px] text-[#555] block uppercase">EBITDA ({margin}%)</span>
                            <span className="text-[11px] font-bold text-[#00FF66] font-mono mt-0.5 block">${(deal.ebitda/1000).toLocaleString()}k</span>
                          </div>
                          <div className="bg-black border border-[#141414] p-2">
                            <span className="font-mono text-[8px] text-[#555] block uppercase">MULTIPLE</span>
                            <span className="text-[11px] font-bold text-[#0ea5e9] font-mono mt-0.5 block">{deal.multiple}x</span>
                          </div>
                        </div>

                        {/* Transaction / Intermediary tracking system */}
                        <div className="border-t border-[#181818] pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <div className="text-[8px] font-mono text-[#555] tracking-wider uppercase">BROKER ASSIGNED</div>
                            <div className="text-[11px] font-mono text-[#F9F9F9]">{deal.brokerName} <span className="text-[#666]">({deal.brokerFirm.split(' ')[0]})</span></div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-mono text-[#666]">STAGE:</span>
                            <span className={`font-mono text-[9px] px-2 py-0.5 border ${getNdaStatusStyles(deal.ndaStatus)}`}>
                              {getNdaStatusLabel(deal.ndaStatus)}
                            </span>
                          </div>
                        </div>

                        {/* Hover Quick Communication Link */}
                        <div className="mt-4 pt-3 border-t border-[#181818] flex justify-end">
                          <button 
                            onClick={() => {
                              // Find corresponding broker conversation ID
                              const convo = conversations.find(c => c.dealId === deal.id);
                              if (convo) {
                                setActiveBrokerId(convo.id);
                              }
                              setActiveTab('SECURE_COMMS');
                            }}
                            className="text-[9px] font-mono text-[#00FF66] hover:underline flex items-center space-x-1"
                          >
                            <span>OPEN SECURE INTERCOM LINK</span>
                            <span>→</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            
            /* SECURE COMMUNICATIONS SUB SYSTEM */
            <div className="space-y-6">
              
              <div className="border-b border-[#222222] pb-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9] flex items-center space-x-2">
                  <span>SECURE CHANNEL ENCRYPTED PIPELINES</span>
                  <span className="text-[10px] text-[#FF3333] tracking-normal">/ AES-256 HANDSHAKE /</span>
                </h3>
                <p className="text-[11px] text-[#666] font-mono mt-1">Direct broker interrogation logs & virtual data room coordination portals.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Intercom threads panel */}
                <div className="lg:col-span-1 space-y-2 border-r border-[#222222]/30 pr-0 lg:pr-4">
                  <div className="text-[9px] font-mono text-[#555] uppercase tracking-wider mb-2">ACTIVE CHANNELS</div>
                  {conversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveBrokerId(conv.id)}
                      className={`w-full text-left p-3 border font-mono transition-all ${conv.id === activeBrokerId ? 'bg-[#0a0a0a] border-[#0ea5e9] text-white' : 'bg-black border-[#222222] text-[#888] hover:border-[#444]'}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-[#0ea5e9]">{conv.secureChannel} // {conv.dealCodename}</span>
                        {conv.unread && (
                          <span className="w-1.5 h-1.5 bg-[#FF3333] rounded-full"></span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-[#F9F9F9] mt-1">{conv.brokerName}</div>
                      <p className="text-[10px] text-[#555] mt-1 truncate">{conv.lastMessage}</p>
                      <div className="text-[8px] text-[#444] mt-2 text-right">{conv.timestamp}</div>
                    </button>
                  ))}
                </div>

                {/* Secure Active Thread Console Chat window */}
                <div className="lg:col-span-2 space-y-4 flex flex-col justify-between h-[380px] bg-black border border-[#222222] p-4">
                  
                  {/* Top Bar info */}
                  <div className="border-b border-[#1a1a1a] pb-2 flex justify-between items-center text-xs font-mono">
                    <div>
                      <span className="text-[#888]">LINE: </span>
                      <span className="text-[#00FF66] font-bold">{selectedBrokerConvo?.secureChannel}</span>
                      <span className="mx-2 text-[#444]">|</span>
                      <span className="text-[#888]">REIP: </span>
                      <span className="text-[#F9F9F9]">{selectedBrokerConvo?.brokerName}</span>
                    </div>
                    <span className="text-[9px] text-[#00FF66] bg-[#00FF66]/5 px-2 py-0.5 border border-[#00FF66]/20">ACTIVE LINK</span>
                  </div>

                  {/* Message log history */}
                  <div className="flex-grow overflow-y-auto font-mono space-y-4 text-xs py-2 pr-1 select-text">
                    
                    {/* Intermediary Intro Block */}
                    <div className="text-center py-2 border-y border-[#111] text-[9px] text-[#444]">
                      SECURE TERMINAL CONNECTION CONFIGURED WITH {selectedBrokerConvo?.brokerName.toUpperCase()} @ {selectedBrokerConvo?.dealCodename.toUpperCase()}
                    </div>

                    {/* Left Message (Broker) */}
                    <div className="space-y-1 max-w-[85%]">
                      <div className="text-[9px] text-[#888]">{selectedBrokerConvo?.brokerName} // Intermediary</div>
                      <div className="bg-[#090909] border border-[#222] p-3 text-[#F9F9F9] leading-relaxed">
                        {selectedBrokerConvo?.lastMessage}
                      </div>
                      <div className="text-[8px] text-[#444]">{selectedBrokerConvo?.timestamp}</div>
                    </div>

                    {/* Simulated Right message (Investor Response confirmation) */}
                    <div className="space-y-1 max-w-[85%] ml-auto text-right">
                      <div className="text-[9px] text-[#0ea5e9]">SYSTEM USER (INVESTOR) // Encrypted</div>
                      <div className="bg-[#0c0c0c] border border-[#0ea5e9]/30 p-3 text-left text-[#F9F9F9] inline-block leading-relaxed">
                        Understood. Analyzing SBA leverage model structures first. I have calculated the debt ratios to reach ~3.14x DSCR targeting your standby seller requirements.
                      </div>
                      <div className="text-[8px] text-[#444]">TRANSMITTED OK</div>
                    </div>

                  </div>

                  {/* Input formulation footer form */}
                  <form onSubmit={handleSendMessage} className="border-t border-[#1a1a1a] pt-3 flex gap-2">
                    <input 
                      type="text"
                      placeholder="Type encrypted message pipeline package..."
                      value={brokerMessageInput}
                      onChange={(e) => setBrokerMessageInput(e.target.value)}
                      className="flex-grow h-10 bg-black border border-[#222222] px-3 font-mono text-xs text-[#F9F9F9] placeholder-[#444] focus:outline-none focus:border-[#00FF66]"
                    />
                    <button 
                      type="submit"
                      className="h-10 bg-[#00FF66] hover:bg-white text-black font-mono font-bold uppercase text-[10px] tracking-wider px-4 transition-all shrink-0"
                    >
                      SEND
                    </button>
                  </form>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* RIGHT SYSTEM PANEL (Alerts Configuration Terminal & Logging Feed) */}
        <aside className="w-full xl:w-[320px] bg-[#080808] p-4 lg:p-6 shrink-0 flex flex-col justify-between space-y-6">
          
          {/* Section 1: Email alert filter console configuration */}
          <div className="space-y-4">
            <div className="border-b border-[#222222] pb-4">
              <span className="font-mono text-[9px] text-[#888] uppercase tracking-wider block">ALERT REGISTRY RULES</span>
              <h4 className="text-sm font-bold font-mono tracking-tight mt-0.5">ALERT CRITERIA MATRIX</h4>
            </div>

            <p className="text-[10px] font-mono text-[#555] leading-relaxed">
              Define the triggers for real-time secure network broadcasts straight to registered communication relays.
            </p>

            {/* Config list switches */}
            <div className="space-y-1 font-mono text-xs">
              {alerts.map(alert => (
                <button
                  key={alert.id}
                  onClick={() => handleToggleAlert(alert.id)}
                  className={`w-full flex justify-between items-center p-2 border transition-all ${alert.active ? 'border-[#0ea5e9]/30 bg-[#0ea5e9]/5' : 'border-[#1a1a1a] bg-black opacity-60'}`}
                >
                  <div className="text-left">
                    <div className={`text-[9px] ${alert.active ? 'text-[#F9F9F9]' : 'text-[#666]'}`}>{alert.label}</div>
                    <span className="text-[8px] text-[#0ea5e9] tracking-widest">{alert.value}</span>
                  </div>
                  
                  {/* Custom checkbox switch indicator */}
                  <div className={`w-3 h-3 border flex items-center justify-center ${alert.active ? 'border-[#00FF66] bg-[#00FF66]/10' : 'border-[#444]'}`}>
                    {alert.active && (
                      <span className="w-1.5 h-1.5 bg-[#00FF66]"></span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Quick configuration buttons */}
            <div className="pt-2">
              <button 
                onClick={() => {
                  setAlerts(prev => prev.map(a => ({ ...a, active: true })));
                  const now = new Date();
                  setLogs(prev => [
                    { id: `log-${Date.now()}`, timestamp: now.toTimeString().split(' ')[0], type: 'SYSTEM', message: 'ALL ALERT MATRIX PATHWAYS SET TO TRUE' },
                    ...prev
                  ]);
                }}
                className="w-full h-8 border border-dashed border-[#222222] hover:border-[#0ea5e9] hover:text-[#0ea5e9] text-[#666] font-mono text-[9px] uppercase tracking-wider text-center flex items-center justify-center transition-all"
              >
                ENABLE ALL SYSTEM ALERT GATES
              </button>
            </div>
          </div>

          {/* Section 2: Logging feed terminal */}
          <div className="space-y-3 pt-6 border-t border-[#222222]">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] text-[#666] uppercase tracking-wider block">TERMINAL LOG FEED</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
            </div>

            {/* Virtual scrolling system logs */}
            <div className="bg-black border border-[#1a1a1a] p-3 h-44 overflow-y-auto font-mono text-[9px] space-y-2 select-text">
              {logs.map(log => {
                let colorClass = 'text-[#888]';
                if (log.type === 'ALERT') colorClass = 'text-[#FF3333]';
                if (log.type === 'SECURE') colorClass = 'text-[#00FF66]';
                if (log.type === 'BROKER') colorClass = 'text-[#0ea5e9]';

                return (
                  <div key={log.id} className="leading-normal flex items-start space-x-1 border-b border-[#0a0a0a] pb-1">
                    <span className="text-[#444] shrink-0 font-light">[{log.timestamp}]</span>
                    <span className={`font-semibold shrink-0 ${colorClass}`}>[{log.type}]</span>
                    <span className="text-[#888] break-all">{log.message}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center space-x-2 text-[8px] font-mono text-[#444]">
              <span className="inline-block w-1.5 h-1.5 bg-[#00FF66]"></span>
              <span>LISTENER DEPLOYED ON PORTS [883, 412, 011]</span>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
```