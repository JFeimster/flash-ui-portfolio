import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// TYPE DEFINITIONS
// ==========================================
interface SavedDeal {
  id: string;
  codename: string;
  sector: 'SaaS' | 'Home Services' | 'Logistics' | 'Manufacturing';
  location: string;
  revenue: number;
  ebitda: number;
  asking: number;
  multiple: number;
  status: 'Initial Outreach' | 'CIM Review' | 'LOI Drafted' | 'Due Diligence';
  brokerName: string;
  brokerFirm: string;
}

interface BrokerMessage {
  id: string;
  broker: string;
  firm: string;
  avatarInitials: string;
  subject: string;
  timestamp: string;
  snippet: string;
  unread: boolean;
}

interface TerminalLog {
  timestamp: string;
  type: 'SYSTEM' | 'ALERT' | 'CONV' | 'METRIC';
  message: string;
}

// ==========================================
// MOCK INITIAL DATA
// ==========================================
const INITIAL_SAVED_DEALS: SavedDeal[] = [
  {
    id: "delta",
    codename: "Project Delta",
    sector: "Logistics",
    location: "Midwest Territory",
    revenue: 2400000,
    ebitda: 620000,
    asking: 1800000,
    multiple: 2.9,
    status: "Due Diligence",
    brokerName: "Marcus Vance",
    brokerFirm: "Aegis M&A"
  },
  {
    id: "hvac-nova",
    codename: "Project Nova",
    sector: "Home Services",
    location: "Franconia, VA",
    revenue: 3100000,
    ebitda: 810000,
    asking: 2600000,
    multiple: 3.2,
    status: "LOI Drafted",
    brokerName: "Sarah Jenkins",
    brokerFirm: "Apex Partners"
  },
  {
    id: "kestrel",
    codename: "Project Kestrel",
    sector: "SaaS",
    location: "100% Remote",
    revenue: 1200000,
    ebitda: 450000,
    asking: 1900000,
    multiple: 4.2,
    status: "CIM Review",
    brokerName: "Dave Miller",
    brokerFirm: "Frontier SaaS Advisors"
  }
];

const INITIAL_CONVERSATIONS: BrokerMessage[] = [
  {
    id: "msg-1",
    broker: "Marcus Vance",
    firm: "Aegis M&A",
    avatarInitials: "MV",
    subject: "RE: Project Delta Schedule Q & CapEx Schedule",
    timestamp: "14 mins ago",
    snippet: "Underwriter confirmed the personal guarantee requirement can be adjusted if standby note structural parameters match...",
    unread: true
  },
  {
    id: "msg-2",
    broker: "Sarah Jenkins",
    firm: "Apex Partners",
    avatarInitials: "SJ",
    subject: "HVAC Nova - Redacted Customer Concentration File",
    timestamp: "2 hours ago",
    snippet: "Attached is the structural breakdown of the top 5 commercial accounts. Let me know if you need any additional modeling variables.",
    unread: false
  },
  {
    id: "msg-3",
    broker: "Dave Miller",
    firm: "Frontier SaaS Advisors",
    avatarInitials: "DM",
    subject: "Project Kestrel Tech Due Diligence Availability",
    timestamp: "1 day ago",
    snippet: "The structural architecture audit is clean. Founder is open to a call this Thursday at 3 PM EST to review API structures.",
    unread: false
  }
];

const INITIAL_LOGS: TerminalLog[] = [
  { timestamp: "10:04:12", type: "SYSTEM", message: "SECURE TUNNEL RE-ESTABLISHED OVER ACQUIRE_SECURE_V3" },
  { timestamp: "10:04:15", type: "METRIC", message: "CALCULATED PORTFOLIO REBALANCING EFFECTIVE AVG MULTIPLE: 3.4x" },
  { timestamp: "10:05:01", type: "ALERT", message: "DISPATCHED TELEMETRY CRON FOR SAAS VERTICALS SUB-4.0x" },
  { timestamp: "10:05:32", type: "CONV", message: "NEW SECURE INBOUND PACKET FROM MARCUS VANCE [PROJECT DELTA]" }
];

export default function PipelineMetricsSummary() {
  // --- States ---
  const [watchlist, setWatchlist] = useState<SavedDeal[]>(INITIAL_SAVED_DEALS);
  const [conversations, setConversations] = useState<BrokerMessage[]>(INITIAL_CONVERSATIONS);
  const [logs, setLogs] = useState<TerminalLog[]>(INITIAL_LOGS);
  
  // Custom Alert Rules States
  const [alertMaxMultiple, setAlertMaxMultiple] = useState<number>(3.5);
  const [alertMinEbitda, setAlertMinEbitda] = useState<number>(500000);
  const [alertSector, setAlertSector] = useState<string>('SaaS');
  const [alertEmail, setAlertEmail] = useState<string>('investor@acquiremeta.com');
  const [activeAlertConfigs, setActiveAlertConfigs] = useState<Array<{id: string; label: string}>>([
    { id: '1', label: 'Home Services < 3.5x Multiple (Live)' },
    { id: '2', label: 'EBITDA > $600K Logistics (Live)' }
  ]);

  // UI States
  const [quickReplyText, setQuickReplyText] = useState<string>('');
  const [activeBrokerId, setActiveBrokerId] = useState<string>('msg-1');

  // --- Real-Time Simulation ---
  useEffect(() => {
    const logInterval = setInterval(() => {
      const systemMessages = [
        "SYSTEM: Synced secure cache pipeline across plaid protocols.",
        "ALERT: Automated cron matching system checked 12 domestic assets.",
        "METRIC: Adjusted EBITDA threshold criteria verified for user profile.",
        "SYSTEM: Keeping heartbeat active via TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384."
      ];
      const alertMessages = [
        `ALERT: Matches detected in automated trigger stack for threshold constraints.`,
        `ALERT: Notification pushed to target email relay: ${alertEmail}`
      ];
      const types: Array<'SYSTEM' | 'ALERT' | 'METRIC'> = ['SYSTEM', 'ALERT', 'METRIC'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      
      let finalMessage = "";
      if (chosenType === 'SYSTEM' || chosenType === 'METRIC') {
        finalMessage = systemMessages[Math.floor(Math.random() * systemMessages.length)];
      } else {
        finalMessage = alertMessages[Math.floor(Math.random() * alertMessages.length)];
      }

      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      setLogs(prev => [
        { timestamp: timeStr, type: chosenType, message: finalMessage },
        ...prev.slice(0, 14)
      ]);
    }, 9000);

    return () => clearInterval(logInterval);
  }, [alertEmail]);

  // --- Aggregated Stats Calculations ---
  const totalEbitda = useMemo(() => {
    return watchlist.reduce((acc, deal) => acc + deal.ebitda, 0);
  }, [watchlist]);

  const avgMultiple = useMemo(() => {
    if (watchlist.length === 0) return 0;
    const sum = watchlist.reduce((acc, deal) => acc + deal.multiple, 0);
    return parseFloat((sum / watchlist.length).toFixed(2));
  }, [watchlist]);

  const totalCapReq = useMemo(() => {
    // Simulated required capital stack based on 10% equity injection on asking valuations
    return watchlist.reduce((acc, deal) => acc + (deal.asking * 0.1), 0);
  }, [watchlist]);

  // --- Handlers ---
  const removeDeal = (id: string) => {
    setWatchlist(prev => prev.filter(deal => deal.id !== id));
    // Trigger terminal log
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [
      { timestamp: timeStr, type: 'SYSTEM', message: `WATCHLIST: Removed tracking handle for asset identifier: ${id}` },
      ...prev
    ]);
  };

  const handleUpdateStatus = (id: string, newStatus: SavedDeal['status']) => {
    setWatchlist(prev => prev.map(deal => {
      if (deal.id === id) {
        return { ...deal, status: newStatus };
      }
      return deal;
    }));
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [
      { timestamp: timeStr, type: 'SYSTEM', message: `WATCHLIST: Adjusted state of [${id}] to status: ${newStatus.toUpperCase()}` },
      ...prev
    ]);
  };

  const createAlertRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRuleLabel = `${alertSector} Sector < ${alertMaxMultiple}x / Min EBITDA $${(alertMinEbitda / 1000).toFixed(0)}K`;
    
    setActiveAlertConfigs(prev => [
      ...prev,
      { id: Date.now().toString(), label: newRuleLabel }
    ]);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [
      { timestamp: timeStr, type: 'ALERT', message: `REGISTERED AUTOMATED WEB-HOOK RULE: ${newRuleLabel} -> ${alertEmail}` },
      ...prev
    ]);
  };

  const deleteAlertRule = (id: string) => {
    setActiveAlertConfigs(prev => prev.filter(cfg => cfg.id !== id));
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [
      { timestamp: timeStr, type: 'ALERT', message: `REMOVED HOOK TRIGGER ENGINE IDENTIFIER ID: ${id}` },
      ...prev
    ]);
  };

  const activeBrokerMessage = useMemo(() => {
    return conversations.find(c => c.id === activeBrokerId);
  }, [conversations, activeBrokerId]);

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReplyText.trim() || !activeBrokerMessage) return;

    // Simulate appending a message transmission
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    
    // Clear unread indicator
    setConversations(prev => prev.map(c => {
      if (c.id === activeBrokerId) {
        return { ...c, unread: false, snippet: `You: ${quickReplyText}` };
      }
      return c;
    }));

    setLogs(prev => [
      { timestamp: timeStr, type: 'CONV', message: `DISPATCHED ENCRYPTED PACKET TO ${activeBrokerMessage.broker.toUpperCase()} [${activeBrokerMessage.firm.toUpperCase()}]` },
      ...prev
    ]);

    setQuickReplyText('');
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] min-h-screen font-sans border-t border-[#222222]">
      {/* 1. COMPONENT SUMMARY STATS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#222222] bg-[#080808]">
        <div className="p-6 border-r border-b md:border-b-0 border-[#222222] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none font-mono text-7xl select-none text-[#0EA5E9]">
            SUM
          </div>
          <span className="font-mono text-[9px] tracking-widest text-[#888] block uppercase">01 / TOTAL PIPELINE EBITDA</span>
          <div className="text-3xl font-bold tracking-tight font-mono text-[#00FF66] mt-2 flex items-baseline space-x-1">
            <span>${(totalEbitda / 1000000).toFixed(2)}M</span>
          </div>
          <span className="font-mono text-[9px] text-[#444] mt-1 block">AGGREGATE VERIFIED CASHFLOWS</span>
        </div>

        <div className="p-6 border-r border-b md:border-b-0 border-[#222222] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none font-mono text-7xl select-none text-[#0ea5e9]">
            MULT
          </div>
          <span className="font-mono text-[9px] tracking-widest text-[#888] block uppercase">02 / AVERAGE MULTIPLE</span>
          <div className="text-3xl font-bold tracking-tight font-mono text-[#0EA5E9] mt-2">
            {avgMultiple}x
          </div>
          <span className="font-mono text-[9px] text-[#444] mt-1 block">WEIGHTED BY ASKING PRICE</span>
        </div>

        <div className="p-6 border-r border-b md:border-b-0 border-[#222222] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none font-mono text-7xl select-none text-[#00FF66]">
            CAP
          </div>
          <span className="font-mono text-[9px] tracking-widest text-[#888] block uppercase">03 / EST. BUYER INJECTION</span>
          <div className="text-3xl font-bold tracking-tight font-mono text-[#F9F9F9] mt-2">
            ${(totalCapReq / 1000).toFixed(0)}K
          </div>
          <span className="font-mono text-[9px] text-[#444] mt-1 block">SIMULATED 10% EQUITY STACK</span>
        </div>

        <div className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none font-mono text-7xl select-none text-[#FF3333]">
            ACT
          </div>
          <span className="font-mono text-[9px] tracking-widest text-[#888] block uppercase">04 / SECURED WATCHLISTS</span>
          <div className="text-3xl font-bold tracking-tight font-mono text-white mt-2 flex items-baseline space-x-2">
            <span>{watchlist.length} Deals</span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
          </div>
          <span className="font-mono text-[9px] text-[#444] mt-1 block">ACTIVE DEALS UNDER WATCH</span>
        </div>
      </div>

      {/* 2. DENSE BENTO DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#222222]">
        
        {/* LEFT COLUMN: WATCHLIST & BROKER COMMUNICATIONS (7 cols) */}
        <div className="lg:col-span-7 border-r border-[#222222] divide-y divide-[#222222] bg-[#050505]">
          
          {/* Section: Watchlist Hub */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#00FF66]"></span>
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9]">WATCHLIST & TRANSACTION MILESTONES</h3>
              </div>
              <span className="font-mono text-[9px] text-[#666] tracking-widest uppercase">SECURE SHELL ADVISORY</span>
            </div>

            {watchlist.length === 0 ? (
              <div className="border border-dashed border-[#222222] p-8 text-center space-y-3">
                <p className="font-mono text-xs text-[#555]">/ NO DEALS REGISTERED ON CURRENT WATCHLIST /</p>
                <button 
                  onClick={() => setWatchlist(INITIAL_SAVED_DEALS)}
                  className="font-mono text-[10px] text-black bg-[#00FF66] px-4 py-2 uppercase hover:bg-white transition-all font-semibold"
                >
                  RE-INJECT SIMULATED ASSETS
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {watchlist.map((deal) => (
                  <div 
                    key={deal.id}
                    className="border border-[#222222] bg-[#080808] p-4 hover:border-[#0EA5E9] transition-all relative group"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                        <span className="font-mono text-[9px] text-[#0EA5E9] uppercase tracking-widest block">
                          {deal.sector} // {deal.location}
                        </span>
                        <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
                          {deal.codename}
                        </h4>
                      </div>
                      
                      {/* Status Dropdown/Selector */}
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[8px] text-[#666] uppercase">STAGE:</span>
                        <select 
                          value={deal.status}
                          onChange={(e) => handleUpdateStatus(deal.id, e.target.value as SavedDeal['status'])}
                          className="bg-black border border-[#222222] font-mono text-[10px] px-2.5 py-1 text-[#F9F9F9] focus:outline-none focus:border-[#00FF66] rounded-none cursor-pointer"
                        >
                          <option value="Initial Outreach">INITIAL OUTREACH</option>
                          <option value="CIM Review">CIM REVIEW</option>
                          <option value="LOI Drafted">LOI DRAFTED</option>
                          <option value="Due Diligence">DUE DILIGENCE</option>
                        </select>
                      </div>
                    </div>

                    {/* Detail Metrics */}
                    <div className="grid grid-cols-3 gap-2 bg-black/50 border-y border-[#111] py-2 mb-4">
                      <div>
                        <span className="font-mono text-[8px] text-[#444] uppercase block">EBITDA</span>
                        <span className="text-xs font-mono font-semibold text-[#00FF66]">${deal.ebitda.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[8px] text-[#444] uppercase block">ASKING</span>
                        <span className="text-xs font-mono font-semibold text-[#0EA5E9]">${deal.asking.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[8px] text-[#444] uppercase block">MULTIPLE</span>
                        <span className="text-xs font-mono font-semibold text-white">{deal.multiple}x</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-2 text-[#666] text-[10px]">
                        <svg className="w-3.5 h-3.5 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{deal.brokerName} ({deal.brokerFirm})</span>
                      </div>

                      <button 
                        onClick={() => removeDeal(deal.id)}
                        className="text-[#FF3333] hover:underline text-[9px] uppercase tracking-widest"
                      >
                        [ UNLINK DEAL ]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Broker Communications Portal */}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <span className="w-1.5 h-1.5 bg-[#0EA5E9]"></span>
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9]">SECURE BROKER COMMUNICATIONS</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Message List Panel (5 Cols) */}
              <div className="md:col-span-5 space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {conversations.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setActiveBrokerId(msg.id)}
                    className={`w-full text-left border p-3 block relative transition-all rounded-none ${
                      activeBrokerId === msg.id 
                        ? 'bg-[#090909] border-[#0EA5E9]' 
                        : 'bg-black border-[#222222] hover:border-[#444]'
                    }`}
                  >
                    {msg.unread && (
                      <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#00FF66] rounded-full animate-ping"></span>
                    )}
                    <div className="flex items-center space-x-2 mb-1.5">
                      <div className="w-6 h-6 bg-neutral-900 border border-[#222222] flex items-center justify-center font-mono text-[9px] text-[#0ea5e9]">
                        {msg.avatarInitials}
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-mono text-[10px] font-bold block text-white truncate">{msg.broker}</span>
                        <span className="font-mono text-[8px] text-[#555] block truncate uppercase">{msg.firm}</span>
                      </div>
                    </div>
                    <p className="font-mono text-[9px] text-slate-400 truncate mb-1">{msg.subject}</p>
                    <span className="font-mono text-[8px] text-[#444] block text-right">{msg.timestamp}</span>
                  </button>
                ))}
              </div>

              {/* Message Details & Reply Panel (7 Cols) */}
              <div className="md:col-span-7 bg-[#080808] border border-[#222222] p-4 flex flex-col justify-between">
                {activeBrokerMessage ? (
                  <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                    <div>
                      <div className="flex justify-between items-start border-b border-[#1a1a1a] pb-3 mb-3">
                        <div>
                          <span className="font-mono text-[8px] text-[#0EA5E9] uppercase block">{activeBrokerMessage.firm}</span>
                          <h4 className="font-mono text-[11px] font-bold text-[#F9F9F9] uppercase">{activeBrokerMessage.broker}</h4>
                        </div>
                        <span className="font-mono text-[8px] text-[#555]">{activeBrokerMessage.timestamp}</span>
                      </div>
                      <p className="font-mono text-[10px] text-[#888] leading-relaxed italic bg-black p-3 border border-[#111] mb-4">
                        "{activeBrokerMessage.snippet}"
                      </p>
                    </div>

                    <form onSubmit={sendReply} className="space-y-2 pt-2 border-t border-[#1a1a1a]">
                      <div className="relative">
                        <input 
                          type="text"
                          value={quickReplyText}
                          onChange={(e) => setQuickReplyText(e.target.value)}
                          placeholder="Type encrypted transmission..."
                          className="w-full h-10 bg-black border border-[#222222] px-3 font-mono text-[10px] text-white focus:outline-none focus:border-[#00FF66] placeholder-[#555] rounded-none"
                        />
                        <button 
                          type="submit"
                          className="absolute right-2 top-2 px-3 py-1 bg-[#0EA5E9]/10 border border-[#0ea5e9]/30 hover:bg-[#0EA5E9] hover:text-black font-mono text-[9px] transition-all uppercase"
                        >
                          Send
                        </button>
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-[#444]">
                        <span>AES-256 BROKER TRANSMISSION GATEWAY</span>
                        <span>ENTER TO SEND</span>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center font-mono text-xs text-[#444]">
                    NO CONVERSATION ACTIVATED
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ALERTS CONFIGURATION & REAL-TIME LOGGING (5 cols) */}
        <div className="lg:col-span-5 divide-y divide-[#222222] bg-[#050505]">
          
          {/* Section: Custom Alert Configurator */}
          <div className="p-6 bg-[#080808]/80">
            <div className="flex items-center space-x-2 mb-6">
              <span className="w-1.5 h-1.5 bg-[#FF3333]"></span>
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9]">TELEMETRY HOOK CONFIGURATOR</h3>
            </div>

            <form onSubmit={createAlertRule} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase text-[#888] tracking-widest">VERTICAL SECTOR</label>
                  <select 
                    value={alertSector}
                    onChange={(e) => setAlertSector(e.target.value)}
                    className="w-full h-10 bg-black border border-[#222222] rounded-none px-3 font-mono text-[10px] text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                  >
                    <option value="SaaS">SaaS & Digital</option>
                    <option value="Home Services">Home Services / HVAC</option>
                    <option value="Logistics">Logistics & Transport</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase text-[#888] tracking-widest">MAX EBITDA MULTIPLE</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      min="1.0"
                      max="10.0"
                      value={alertMaxMultiple}
                      onChange={(e) => setAlertMaxMultiple(parseFloat(e.target.value))}
                      className="w-full h-10 bg-black border border-[#222222] rounded-none px-3 font-mono text-[10px] text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                    />
                    <span className="absolute right-3 top-3 text-[9px] font-mono text-[#555]">MAX</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase text-[#888] tracking-widest">MIN ADJ. EBITDA ($)</label>
                  <input 
                    type="number" 
                    step="50000"
                    min="100000"
                    value={alertMinEbitda}
                    onChange={(e) => setAlertMinEbitda(parseInt(e.target.value))}
                    className="w-full h-10 bg-black border border-[#222222] rounded-none px-3 font-mono text-[10px] text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase text-[#888] tracking-widest">RELAY NOTIFICATION EMAIL</label>
                  <input 
                    type="email" 
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="investor@mailbox.net"
                    className="w-full h-10 bg-black border border-[#222222] rounded-none px-3 font-mono text-[10px] text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-11 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2"
              >
                <span>DEPLOY AUTOMATED PIPELINE HOOK</span>
                <span>[+]</span>
              </button>
            </form>

            {/* List of Active Rules */}
            <div className="mt-6 border-t border-[#222222] pt-4">
              <span className="font-mono text-[8px] uppercase text-[#555] tracking-widest block mb-2">RUNNING TRIGGER CONDITIONS</span>
              <div className="space-y-1.5">
                {activeAlertConfigs.map((cfg) => (
                  <div 
                    key={cfg.id}
                    className="bg-black border border-[#161616] p-2 flex justify-between items-center text-[10px] font-mono text-[#888]"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FF66]"></span>
                      <span>{cfg.label}</span>
                    </div>
                    <button 
                      onClick={() => deleteAlertRule(cfg.id)}
                      className="text-[#FF3333] hover:text-white px-1"
                      title="Deactivate Hook"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Live Terminal Logs Console */}
          <div className="p-6 bg-[#030303]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 bg-[#00FF66] rounded-full animate-ping"></span>
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9]">TELEMETRY RUNTIME CONSOLE</h3>
              </div>
              <span className="font-mono text-[8px] text-[#666]">SECURE PIPELINE SH-883</span>
            </div>

            {/* Console Log Interface */}
            <div className="bg-black border border-[#222222] p-4 font-mono text-[10px] h-[280px] overflow-y-auto space-y-2 select-text custom-terminal-scrollbar">
              {logs.map((log, idx) => {
                let badgeColor = "text-[#888]";
                if (log.type === "ALERT") badgeColor = "text-[#FF3333] font-bold";
                if (log.type === "METRIC") badgeColor = "text-[#0ea5e9]";
                if (log.type === "SYSTEM") badgeColor = "text-[#00FF66]";
                
                return (
                  <div key={idx} className="flex items-start space-x-2 hover:bg-neutral-900 py-0.5 px-1 leading-relaxed">
                    <span className="text-[#444] select-none shrink-0">[{log.timestamp}]</span>
                    <span className={`${badgeColor} shrink-0`}>[{log.type}]</span>
                    <span className="text-[#aaa] select-all break-all">{log.message}</span>
                  </div>
                );
              })}
              <div className="flex items-center space-x-2 animate-pulse pt-2 text-[#444]">
                <span>&gt;_</span>
                <span>SYSTEM LISTEN ENGINE CONTINUOUS HEARTBEAT ACTIVE...</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 text-[9px] font-mono text-[#555]">
              <span>ACTIVE SOCKET REFS: 1402/TCP</span>
              <button 
                onClick={() => setLogs([])}
                className="hover:text-white uppercase transition-colors"
              >
                [ CLEAR CONSOLE ]
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}