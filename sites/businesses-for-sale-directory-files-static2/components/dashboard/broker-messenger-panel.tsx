import React, { useState, useEffect, useRef } from "react";

// Types
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
}

interface BrokerMessage {
  id: string;
  sender: "user" | "broker";
  timestamp: string;
  text: string;
}

interface BrokerChat {
  brokerName: string;
  projectName: string;
  avatarColor: string;
  status: "Active" | "Pending CIM" | "Under Review";
  messages: BrokerMessage[];
}

interface TerminalLog {
  timestamp: string;
  type: "SYSTEM" | "ALERT ENGINE" | "SMTP TUNNEL" | "SECURE SHELL";
  message: string;
}

interface AlertConfig {
  id: string;
  vertical: string;
  maxMultiple: number;
  minEbitda: number;
  email: string;
  status: "ACTIVE" | "PAUSED";
}

export default function BrokerMessengerPanel() {
  // 1. WATCHLIST STATE (Dynamic Aggregation)
  const [watchlist, setWatchlist] = useState<SavedDeal[]>([
    {
      id: "delta",
      codename: "Project Delta",
      sector: "Logistics",
      revenue: 2400000,
      ebitda: 620000,
      asking: 1800000,
      multiple: 2.9,
      location: "Midwest",
      brokerName: "Dan Vance",
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
      brokerName: "Sarah Lin",
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
      brokerName: "Marcus Webb",
    },
  ]);

  // 2. CHAT HUB STATE
  const [chats, setChats] = useState<Record<string, BrokerChat>>({
    "Dan Vance": {
      brokerName: "Dan Vance",
      projectName: "Project Delta (Logistics)",
      avatarColor: "#00FF66",
      status: "Active",
      messages: [
        { id: "1", sender: "broker", timestamp: "10:14 AM", text: "Welcome to the Project Delta node. Secure pipeline verified." },
        { id: "2", sender: "user", timestamp: "10:15 AM", text: "Thanks Dan. Has the seller completed the 3rd party QA audit yet?" },
        { id: "3", sender: "broker", timestamp: "10:18 AM", text: "Yes, final reporting is staging inside our secure room. Please review the updated SBA structure." },
      ],
    },
    "Sarah Lin": {
      brokerName: "Sarah Lin",
      projectName: "Project Nova (HVAC)",
      avatarColor: "#0EA5E9",
      status: "Pending CIM",
      messages: [
        { id: "1", sender: "broker", timestamp: "Yesterday", text: "Hi, I received your verification payload. I need the signed NDA before opening CIM assets." },
        { id: "2", sender: "user", timestamp: "Yesterday", text: "Sent over through Plaid secure vault. Let me know when approved." },
        { id: "3", sender: "broker", timestamp: "09:05 AM", text: "NDA processed. CIM release scheduled for 13:00 EST today." },
      ],
    },
    "Marcus Webb": {
      brokerName: "Marcus Webb",
      projectName: "Project Kestrel (SaaS)",
      avatarColor: "#FF3333",
      status: "Under Review",
      messages: [
        { id: "1", sender: "broker", timestamp: "2 days ago", text: "Regarding Project Kestrel: Single-person key-man code risk is covered under transition advisory." },
        { id: "2", sender: "user", timestamp: "2 days ago", text: "Excellent, we would require a 12-month technical support warranty clause in the APA." },
      ],
    },
  });

  const [activeBroker, setActiveBroker] = useState<string>("Dan Vance");
  const [typedMessage, setTypedMessage] = useState<string>("");

  // 3. SYSTEM TERMINAL ALERTS LOGS STATE
  const [logs, setLogs] = useState<TerminalLog[]>([
    { timestamp: "14:22:05", type: "SYSTEM", message: "Secure Shell Pipeline SH-883 Active on port 443" },
    { timestamp: "14:22:18", type: "ALERT ENGINE", message: "Scanning database records for custom criteria: Multiples < 3.5x" },
    { timestamp: "14:23:01", type: "SMTP TUNNEL", message: "Dispatched automated warning to principal@investor.meta" },
    { timestamp: "14:25:40", type: "ALERT ENGINE", message: "New matching asset indexed: [Project Onyx Precision CNC]" },
  ]);

  // 4. CUSTOM DISPATCH ALERTS CONFIG
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([
    { id: "1", vertical: "SaaS", maxMultiple: 4.5, minEbitda: 400000, email: "alert-stream@meta.io", status: "ACTIVE" },
    { id: "2", vertical: "Home Services", maxMultiple: 3.5, minEbitda: 750000, email: "alert-stream@meta.io", status: "ACTIVE" },
  ]);

  const [newVertical, setNewVertical] = useState<string>("SaaS");
  const [newMaxMultiple, setNewMaxMultiple] = useState<number>(3.5);
  const [newMinEbitda, setNewMinEbitda] = useState<number>(500000);
  const [newEmail, setNewEmail] = useState<string>("principal@meta.io");

  // Chat message container auto-scroller reference
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeBroker]);

  // Dynamic Metrics Aggregation
  const totalPipelineEbitda = watchlist.reduce((sum, item) => sum + item.ebitda, 0);
  const totalPipelineAsking = watchlist.reduce((sum, item) => sum + item.asking, 0);
  const weightedAvgMultiple = watchlist.length > 0 
    ? parseFloat((watchlist.reduce((sum, item) => sum + (item.multiple * item.ebitda), 0) / totalPipelineEbitda).toFixed(2))
    : 0;

  // Actions
  const handleRemoveFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
    addTerminalLog("SYSTEM", `Asset removed from internal Watchlist: [${id.toUpperCase()}]`);
  };

  const addTerminalLog = (type: TerminalLog["type"], message: string) => {
    const now = new Date();
    const ts = now.toTimeString().split(' ')[0];
    setLogs(prev => [...prev, { timestamp: ts, type, message }]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: BrokerMessage = {
      id: Date.now().toString(),
      sender: "user",
      timestamp,
      text: typedMessage
    };

    // Update messages for current active broker
    setChats(prev => {
      const updatedChat = { ...prev[activeBroker] };
      updatedChat.messages = [...updatedChat.messages, userMsg];
      return { ...prev, [activeBroker]: updatedChat };
    });

    const userQuery = typedMessage;
    setTypedMessage("");

    // Simulate system action logging
    addTerminalLog("SECURE SHELL", `Dispatched secure encrypted transport package to broker: [${activeBroker}]`);

    // Trigger Simulated Broker Response
    setTimeout(() => {
      const responses: Record<string, string[]> = {
        "Dan Vance": [
          "Acknowledged. That parameter aligns with our SBA packaging parameters. I will unlock the staging folder for you.",
          "Confirmed. I'm verifying the escrow accounts now. Keep safe connection active.",
          "Our legal desk is looking into that structural APA provision. Standby."
        ],
        "Sarah Lin": [
          "Thank you for the update. Let me verify the credentials with our local escrow portal.",
          "Got it. We will present your offer criteria to the partners this afternoon.",
          "I have noted your request. Let's touch base tomorrow morning to finalize the standby notes."
        ],
        "Marcus Webb": [
          "That is correct. Let me run this through the technical lead and I'll push update into our workspace.",
          "Acknowledged. Understood perfectly.",
          "We are pushing the revision package to the shared terminal database right now."
        ]
      };

      const brokerPool = responses[activeBroker] || ["Message received. Secure line active."];
      const selectedResponse = brokerPool[Math.floor(Math.random() * brokerPool.length)];

      const brokerMsg: BrokerMessage = {
        id: (Date.now() + 1).toString(),
        sender: "broker",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: selectedResponse
      };

      setChats(prev => {
        const updatedChat = { ...prev[activeBroker] };
        updatedChat.messages = [...updatedChat.messages, brokerMsg];
        return { ...prev, [activeBroker]: updatedChat };
      });

      addTerminalLog("SYSTEM", `Inbound message packet authenticated from Broker: [${activeBroker}]`);
    }, 1500);
  };

  const handleAddAlertConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const newConfig: AlertConfig = {
      id: Date.now().toString(),
      vertical: newVertical,
      maxMultiple: newMaxMultiple,
      minEbitda: newMinEbitda,
      email: newEmail,
      status: "ACTIVE"
    };

    setAlertConfigs(prev => [...prev, newConfig]);
    addTerminalLog("SYSTEM", `New Dynamic Trigger Registered: [${newVertical}] Max ${newMaxMultiple}x Multiple.`);
    addTerminalLog("ALERT ENGINE", `Scanning background matrices for ${newVertical} listings matching conditions.`);
  };

  const handleToggleAlertStatus = (id: string) => {
    setAlertConfigs(prev => prev.map(config => {
      if (config.id === id) {
        const nextStatus = config.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
        addTerminalLog("SYSTEM", `Trigger ID #${id} status shifted to: [${nextStatus}]`);
        return { ...config, status: nextStatus };
      }
      return config;
    }));
  };

  const handleRemoveAlert = (id: string) => {
    setAlertConfigs(prev => prev.filter(config => config.id !== id));
    addTerminalLog("SYSTEM", `Trigger ID #${id} purged from system config.`);
  };

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] min-h-screen p-4 lg:p-8 font-sans flex flex-col space-y-8 border-t border-[#222222]">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#222222] pb-6 gap-4">
        <div>
          <h2 className="font-mono text-sm uppercase tracking-widest text-[#F9F9F9] flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#0EA5E9] animate-pulse"></span>
            <span>SECURE WATCHLIST & COMMUNICATIONS TERMINAL</span>
          </h2>
          <p className="text-xs text-[#666] mt-1 font-mono">
            Integrative command panel for asset tracking, active broker conversations, and automated alert engines.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="font-mono text-[10px] bg-black border border-[#222] px-3 py-1.5 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] inline-block animate-ping"></span>
            <span className="text-[#888]">PROXY ID:</span>
            <span className="text-[#00FF66]">SH-883_SECURE</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: WATCHLIST & REAL-TIME PIPELINE AGGREGATES (XL: col-span-5) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* A. BENTO PIPELINE METRICS CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-black p-4 border border-[#222222] flex flex-col justify-between">
              <span className="font-mono text-[8px] text-[#666] uppercase block tracking-wider">AGGREGATE PIPELINE VALUE</span>
              <div className="mt-2">
                <span className="text-lg font-bold text-[#F9F9F9] tracking-wider font-mono">
                  ${(totalPipelineAsking / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-[#888] block font-mono">Asking Price Accum</span>
              </div>
            </div>

            <div className="bg-black p-4 border border-[#222222] flex flex-col justify-between">
              <span className="font-mono text-[8px] text-[#666] uppercase block tracking-wider">TOTAL SAVED EBITDA</span>
              <div className="mt-2">
                <span className="text-lg font-bold text-[#00FF66] tracking-wider font-mono">
                  ${(totalPipelineEbitda / 1000).toFixed(0)}K
                </span>
                <span className="text-[10px] text-[#888] block font-mono">Accumulated Cash Flow</span>
              </div>
            </div>

            <div className="bg-black p-4 border border-[#222222] flex flex-col justify-between">
              <span className="font-mono text-[8px] text-[#666] uppercase block tracking-wider">WEIGHTED AVG MULTIPLE</span>
              <div className="mt-2">
                <span className="text-lg font-bold text-[#0EA5E9] tracking-wider font-mono">
                  {weightedAvgMultiple > 0 ? `${weightedAvgMultiple}x` : "0.0x"}
                </span>
                <span className="text-[10px] text-[#888] block font-mono">EBITDA Weighted Index</span>
              </div>
            </div>
          </div>

          {/* B. ACTIVE INVESTOR WATCHLIST LISTING */}
          <div className="bg-[#090909] border border-[#222222] p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
              <h3 className="font-mono text-[10px] text-[#888] uppercase tracking-wider">
                01 / TARGET WATCHLIST INDEX ({watchlist.length})
              </h3>
              <span className="text-[9px] font-mono text-[#666]">STAGED IN REAL-TIME</span>
            </div>

            {watchlist.length === 0 ? (
              <div className="h-32 border border-dashed border-[#222] flex flex-col items-center justify-center p-4">
                <span className="font-mono text-[10px] text-[#555] uppercase">/ No active deals saved in watchlist /</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {watchlist.map((deal) => (
                  <div 
                    key={deal.id} 
                    className="bg-black border border-[#161616] p-3.5 hover:border-[#0ea5e9]/50 transition-all flex justify-between items-center group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#F9F9F9]">{deal.codename}</span>
                        <span className="bg-[#222] text-[#888] font-mono text-[8px] px-1.5 py-0.5 uppercase">
                          {deal.sector}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] text-[#555]">
                        EBITDA: <span className="text-[#00FF66] font-semibold">${deal.ebitda.toLocaleString()}</span> | Multiple: <span className="text-[#0EA5E9] font-semibold">{deal.multiple}x</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setActiveBroker(deal.brokerName)}
                        className="h-8 border border-[#222] hover:border-[#0EA5E9] hover:text-[#0EA5E9] font-mono text-[9px] px-2.5 uppercase transition-all flex items-center space-x-1"
                        title={`Open chat with ${deal.brokerName}`}
                      >
                        <span>CHAT</span>
                      </button>
                      <button 
                        onClick={() => handleRemoveFromWatchlist(deal.id)}
                        className="h-8 w-8 border border-[#222] hover:border-[#FF3333] hover:text-[#FF3333] text-[#555] font-mono text-xs flex items-center justify-center transition-all"
                        title="Remove from Watchlist"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* C. SYSTEM DYNAMIC DISPATCH FORM */}
          <div className="bg-[#090909] border border-[#222222] p-5 space-y-4">
            <div className="border-b border-[#1a1a1a] pb-3">
              <h3 className="font-mono text-[10px] text-[#888] uppercase tracking-wider">
                02 / CONFIG DISPATCH ALERTS RULE ENGINE
              </h3>
            </div>

            <form onSubmit={handleAddAlertConfig} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-[#888] uppercase tracking-wider">SECTOR VERTICAL</label>
                  <select 
                    value={newVertical}
                    onChange={(e) => setNewVertical(e.target.value)}
                    className="w-full h-9 bg-black border border-[#222] text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9] px-2"
                  >
                    <option value="SaaS">SaaS & Digital</option>
                    <option value="Home Services">Home Services / HVAC</option>
                    <option value="Logistics">Logistics & Transport</option>
                    <option value="Manufacturing">Precision Manufacturing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-[#888] uppercase tracking-wider flex justify-between">
                    <span>MAX MULTIPLE</span>
                    <span className="text-[#00FF66] font-bold">{newMaxMultiple}x</span>
                  </label>
                  <div className="h-9 flex items-center bg-black border border-[#222] px-2">
                    <input 
                      type="range" 
                      min="2.0" 
                      max="5.0" 
                      step="0.1"
                      value={newMaxMultiple}
                      onChange={(e) => setNewMaxMultiple(parseFloat(e.target.value))}
                      className="w-full accent-[#00FF66] bg-neutral-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-[#888] uppercase tracking-wider">MIN ADJUSTED EBITDA</label>
                  <select
                    value={newMinEbitda}
                    onChange={(e) => setNewMinEbitda(parseInt(e.target.value))}
                    className="w-full h-9 bg-black border border-[#222] text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9] px-2"
                  >
                    <option value={300000}>$300,000+ EBITDA</option>
                    <option value={500000}>$500,000+ EBITDA</option>
                    <option value={750000}>$750,000+ EBITDA</option>
                    <option value={1000000}>$1,000,000+ EBITDA</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-[#888] uppercase tracking-wider">DISPATCH EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="alert-stream@meta.io"
                    className="w-full h-9 bg-black border border-[#222] px-2 text-xs font-mono text-[#F9F9F9] placeholder-[#444] focus:outline-none focus:border-[#0EA5E9]"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-10 border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-[10px] font-semibold tracking-wider uppercase transition-colors"
              >
                ACTIVATE DISPATCH RULE
              </button>
            </form>

            {/* List current active triggers */}
            <div className="border-t border-[#1a1a1a] pt-4 space-y-2">
              <span className="font-mono text-[8px] text-[#555] uppercase tracking-wider block">ACTIVE TRIGGERS STACK:</span>
              
              {alertConfigs.map((config) => (
                <div key={config.id} className="bg-black border border-[#161616] p-2.5 flex items-center justify-between text-[10px] font-mono">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${config.status === "ACTIVE" ? "bg-[#00FF66]" : "bg-[#FF3333] animate-pulse"}`}></span>
                      <span className="text-[#F9F9F9] font-bold">{config.vertical}</span>
                      <span className="text-[#666]">({config.maxMultiple}x max)</span>
                    </div>
                    <p className="text-[#555] text-[9px]">{config.email} | Min: ${(config.minEbitda / 1000)}k</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleToggleAlertStatus(config.id)}
                      className={`h-6 px-1.5 border border-[#222] hover:border-[#0EA5E9] text-[8px] uppercase tracking-tighter ${config.status === "ACTIVE" ? "text-gray-400" : "text-[#FF3333]"}`}
                    >
                      {config.status === "ACTIVE" ? "PAUSE" : "RESUME"}
                    </button>
                    <button 
                      onClick={() => handleRemoveAlert(config.id)}
                      className="h-6 w-6 border border-[#222] hover:border-[#FF3333] text-gray-400 text-[9px]"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE BROKER CHAT TERMINAL (XL: col-span-7) */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* THE MAIN MESSAGING NODE */}
          <div className="bg-[#090909] border border-[#222222] flex flex-col h-[520px]">
            
            {/* A. Chat Header */}
            <div className="p-4 border-b border-[#222222] bg-[#0c0c0c] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span 
                  className="w-8 h-8 flex items-center justify-center font-mono font-bold text-black text-xs" 
                  style={{ backgroundColor: chats[activeBroker]?.avatarColor || "#00FF66" }}
                >
                  {activeBroker.split(" ").map(n => n[0]).join("")}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-[#F9F9F9]">{activeBroker}</span>
                    <span className="bg-[#111] border border-[#222] text-[#888] font-mono text-[8px] px-1.5 py-0.5">
                      {chats[activeBroker]?.status}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-[#666] uppercase block">
                    CONNECTED LISTING: {chats[activeBroker]?.projectName}
                  </span>
                </div>
              </div>

              {/* Secure Channel Badge */}
              <div className="hidden sm:flex items-center space-x-2 text-[10px] font-mono text-[#555]">
                <span className="inline-block w-1.5 h-1.5 bg-[#00FF66]"></span>
                <span>SECURE DECRYPT ACTIVE</span>
              </div>
            </div>

            {/* B. Conversations Selector Bar */}
            <div className="flex border-b border-[#222222] bg-black">
              {Object.keys(chats).map((bName) => {
                const isSelected = activeBroker === bName;
                return (
                  <button 
                    key={bName}
                    onClick={() => setActiveBroker(bName)}
                    className={`flex-grow sm:flex-initial px-4 py-2.5 font-mono text-[10px] uppercase border-r border-[#222222] text-center sm:text-left transition-all ${
                      isSelected ? "bg-[#090909] text-[#00FF66] border-b-2 border-b-[#00FF66]" : "text-[#666] hover:text-[#888]"
                    }`}
                  >
                    {bName.split(" ")[0]}
                  </button>
                );
              })}
            </div>

            {/* C. Message Flow Pane */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-black/40 text-xs font-mono">
              {chats[activeBroker]?.messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center space-x-2 text-[8px] text-[#555] mb-1">
                      <span>{isUser ? "YOU" : `BROKER // ${activeBroker.toUpperCase()}`}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div 
                      className={`max-w-[85%] p-3.5 border text-xs leading-relaxed ${
                        isUser 
                          ? "bg-[#0ea5e9]/5 border-[#0ea5e9]/30 text-[#F9F9F9]" 
                          : "bg-neutral-900/60 border-[#222222] text-[#F9F9F9]"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* D. Message Input Controls */}
            <div className="p-4 border-t border-[#222222] bg-[#0c0c0c]">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder={`Send secure command to ${activeBroker}...`} 
                  className="flex-grow h-11 bg-black border border-[#222] px-4 text-xs font-mono text-[#F9F9F9] placeholder-[#444] focus:outline-none focus:border-[#00FF66]"
                />
                <button 
                  type="submit"
                  className="px-6 h-11 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
                >
                  SEND COMMAND
                </button>
              </form>
            </div>
          </div>

          {/* REAL-TIME SYSTEM TERMINAL LOGGING CONSOLE */}
          <div className="bg-black border border-[#222222] p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#161616] pb-3">
              <h3 className="font-mono text-[10px] text-[#888] uppercase tracking-wider flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#FF3333] inline-block rounded-full animate-ping"></span>
                <span>03 / LIVE TERMINAL PROCESS LOGGER (ACQUIREMETA v3.11)</span>
              </h3>
              <button 
                onClick={() => setLogs([])}
                className="font-mono text-[9px] uppercase text-[#FF3333] hover:underline"
              >
                RESET STREAM
              </button>
            </div>

            <div className="bg-[#030303] p-4 font-mono text-[10px] text-[#666] space-y-1 max-h-[140px] overflow-y-auto border border-[#111] select-none">
              {logs.map((log, index) => {
                let color = "text-[#888]";
                if (log.type === "SYSTEM") color = "text-[#F9F9F9]";
                if (log.type === "ALERT ENGINE") color = "text-[#0ea5e9]";
                if (log.type === "SMTP TUNNEL") color = "text-[#00FF66]";
                if (log.type === "SECURE SHELL") color = "text-[#FF3333]";

                return (
                  <div key={index} className="flex space-x-2 border-b border-[#090909] pb-0.5 leading-relaxed">
                    <span className="text-[#333] shrink-0">[{log.timestamp}]</span>
                    <span className={`${color} font-bold shrink-0`}>[{log.type}]</span>
                    <span className="text-[#888] break-all">{log.message}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}