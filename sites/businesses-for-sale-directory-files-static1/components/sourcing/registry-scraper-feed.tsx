```tsx
import React, { useState, useEffect, useRef } from "react";

// Types
interface Lead {
  id: string;
  owner: string;
  company: string;
  industry: string;
  registrySource: string;
  revenueEst: string;
  ebitdaEst: string;
  email: string;
  phone: string;
  likelihoodScore: number; // AI score out of 100
  status: "UNTOUCHED" | "QUEUED" | "SENT" | "REPLIED" | "OPT_OUT";
}

interface ScrapeLog {
  id: string;
  timestamp: string;
  text: string;
  type: "info" | "success" | "warn" | "error";
}

export default function RegistryScraperFeed() {
  // --- STATE ---
  const [selectedRegistry, setSelectedRegistry] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeProgress, setScrapeProgress] = useState<number>(0);
  const [currentNode, setCurrentNode] = useState<string>("NODE-09A // WEST-TEXAS");
  const [cliInput, setCliInput] = useState<string>("");
  const [selectedPlaybook, setSelectedPlaybook] = useState<string>("SBA_CASH");
  const [minScore, setMinScore] = useState<number>(70);
  
  // Simulated stats
  const [stats, setStats] = useState({
    scrapedTotal: 3482,
    deliveredCount: 1409,
    repliedCount: 298,
    pipelineValue: 48200000, // Implied enterprise value
  });

  // Logs stream State
  const [logs, setLogs] = useState<ScrapeLog[]>([
    { id: "1", timestamp: "08:12:01", text: "SYSTEM DIAGNOSTICS: Sourcing engine operating within parameters.", type: "info" },
    { id: "2", timestamp: "08:12:04", text: "PROXY NETWORKS: 12 external nodes online and rotating. IP spoofing active.", type: "success" },
    { id: "3", timestamp: "08:12:30", text: "DATABASE SYNC: Plaid business registries matched with 98.4% consistency index.", type: "info" },
  ]);

  // Lead Database State
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "LD-9021",
      owner: "Richard Vance",
      company: "Vance HVAC Logistics Ltd",
      industry: "HVAC",
      registrySource: "Texas Commercial Registry",
      revenueEst: "$3.4M",
      ebitdaEst: "$850K",
      email: "r.vance@vancelogistics.com",
      phone: "+1 (817) 555-0182",
      likelihoodScore: 94,
      status: "UNTOUCHED",
    },
    {
      id: "LD-4412",
      owner: "Elena Rostova",
      company: "Rostov Precision Tooling & Mold",
      industry: "Manufacturing",
      registrySource: "Ohio Business Index",
      revenueEst: "$5.1M",
      ebitdaEst: "$1.2M",
      email: "elena@rostov-mfg.com",
      phone: "+1 (216) 555-8931",
      likelihoodScore: 89,
      status: "QUEUED",
    },
    {
      id: "LD-5109",
      owner: "Marcus Brody",
      company: "Brody Cold-Chain Express",
      industry: "Logistics",
      registrySource: "Georgia Freight Registry",
      revenueEst: "$2.9M",
      ebitdaEst: "$610K",
      email: "marcus@brodycoldchain.net",
      phone: "+1 (404) 555-7711",
      likelihoodScore: 78,
      status: "REPLIED",
    },
    {
      id: "LD-1104",
      owner: "Genevieve Dubois",
      company: "Dubois Mechanical & AC Systems",
      industry: "HVAC",
      registrySource: "Louisiana Secretary of State Office",
      revenueEst: "$1.8M",
      ebitdaEst: "$420K",
      email: "gdubois@duboisac.com",
      phone: "+1 (504) 555-0155",
      likelihoodScore: 91,
      status: "SENT",
    },
    {
      id: "LD-6632",
      owner: "Thomas Shelby",
      company: "Birmingham Metal Forging Co.",
      industry: "Manufacturing",
      registrySource: "Midwest Industry Alliance Archive",
      revenueEst: "$4.5M",
      ebitdaEst: "$980K",
      email: "t.shelby@birminghamforge.com",
      phone: "+1 (312) 555-3210",
      likelihoodScore: 84,
      status: "UNTOUCHED",
    },
    {
      id: "LD-8801",
      owner: "Sarah Jenkins",
      company: "Jenkins Warehousing Solutions",
      industry: "Logistics",
      registrySource: "Texas Commercial Registry",
      revenueEst: "$3.1M",
      ebitdaEst: "$590K",
      email: "sjenkins@jenkinswarehousing.com",
      phone: "+1 (214) 555-9011",
      likelihoodScore: 68,
      status: "UNTOUCHED",
    }
  ]);

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll console logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Playbooks templates dictionary
  const playbooks: Record<string, { subject: string; body: string }> = {
    SBA_CASH: {
      subject: "Acquisition interest: [Company] cash buyout modeling",
      body: "Hi [Owner],\n\nI was reviewing local [Industry] operations in your registry index. Our micro-PE fund, AcquireMeta, is looking to model a capital structures layout to acquire an operator in your region using pre-allocated SBA 7(a) funds and local liquid debt equity.\n\nWe estimate your enterprise value range with a multiple up to 4.2x EBITDA. Are you open to a strictly confidential, blinded operational call this week?\n\n- AcquireMeta Deal Sourcing Unit"
    },
    RETIRING_LOCAL: {
      subject: "Strictly Private: Legacy transition planning for [Company]",
      body: "Dear [Owner],\n\nI run a localized search fund backed by liquid legacy capital. We track high-yield registries and noticed your tenure. Our model is built specifically to protect your long-term local workforce and customer contracts post-transition.\n\nIf you have considered a strategic exit or are planning a phased retirement in the next 12 to 24 months, please let me know. We have direct escrow facilities ready for deployment.\n\nRespectfully,\n- Private Sourcing desk"
    },
    DIRECT_PARTNER: {
      subject: "Strategic consolidation: [Company] operations query",
      body: "Hello [Owner],\n\nWe represent a key consolidating operator looking to buy out active businesses in the [Industry] sector. Your location matches our geometric hub deployment.\n\nOur transaction frameworks guarantee quick execution (30-day due diligence) and cash close. Let me know if you would like to run your historical numbers through our risk-mitigated valuation model.\n\nBest,\nSourcing Lead, AcquireMeta Network"
    }
  };

  // Simulated Scraping Cycle
  const handleScrapeScan = () => {
    if (isScraping) return;
    setIsScraping(true);
    setScrapeProgress(0);

    // Initial log
    addLog("CRITICAL: Initializing off-market directory crawl process...", "info");
    
    const interval = setInterval(() => {
      setScrapeProgress((prev) => {
        const next = prev + 15;
        if (next >= 100) {
          clearInterval(interval);
          setIsScraping(false);
          
          // Inject a newly scraped off-market lead
          const newLead: Lead = {
            id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
            owner: "Jonathan Harker",
            company: "Transylvania Cold Logistics",
            industry: "Logistics",
            registrySource: "Regional Sourcing Crawler Node 9",
            revenueEst: "$3.9M",
            ebitdaEst: "$790K",
            email: "jharker@transylvanialogistics.com",
            phone: "+1 (972) 555-3342",
            likelihoodScore: 96,
            status: "UNTOUCHED",
          };

          setLeads((prevLeads) => [newLead, ...prevLeads]);
          setStats((prev) => ({
            ...prev,
            scrapedTotal: prev.scrapedTotal + 1,
            pipelineValue: prev.pipelineValue + 3200000,
          }));

          addLog(`SUCCESS: Found matching entry: "${newLead.company}" (EBITDA: ${newLead.ebitdaEst}). Locked and loaded to grid database.`, "success");
          return 100;
        }

        // Add periodic logs during scrape
        const logTemplates = [
          "CRAWLER: Querying corporate registers...",
          "DECRYPTOR: Circumventing rate limits using proxy rotation...",
          "AI_MODEL: Scoring responses probability index...",
          "VALIDATOR: Checking email MX record validity..."
        ];
        const randomLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
        addLog(randomLog, "info");

        return next;
      });
    }, 800);
  };

  const addLog = (text: string, type: "info" | "success" | "warn" | "error" = "info") => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [...prev, { id: Date.now().toString(), timestamp: time, text, type }]);
  };

  // CLI Command processor
  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const query = cliInput.toLowerCase().trim();
    addLog(`CMD> ${cliInput}`, "info");

    if (query === "help") {
      addLog("AVAILABLE SCRIPTER COMMANDS:\n - 'scrape': Trigger active crawler matrix.\n - 'flush': Empty temporary log system.\n - 'queue': Target all uncontacted operators above AI threshold.\n - 'status': Query system performance and proxy health.", "info");
    } else if (query === "scrape") {
      handleScrapeScan();
    } else if (query === "flush") {
      setLogs([]);
      addLog("Console log screen flushed.", "info");
    } else if (query === "queue") {
      const untouchedHighLeads = leads
        .filter((l) => l.status === "UNTOUCHED" && l.likelihoodScore >= minScore)
        .map((l) => l.id);
      
      setSelectedLeads((prev) => Array.from(new Set([...prev, ...untouchedHighLeads])));
      addLog(`SYSTEM: Queued ${untouchedHighLeads.length} leads matching AI minimum confidence filter [>${minScore}%]`, "success");
    } else if (query === "status") {
      addLog(`STATUS: Active node: ${currentNode}. Proxy pool: 98% operational capacity.`, "info");
    } else {
      addLog(`UNKNOWN SYSTEM CMD: "${cliInput}". Type 'help' to review authorized pipeline queries.`, "error");
    }
    setCliInput("");
  };

  // Mass action handlers
  const toggleSelectLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllLeads = () => {
    const filteredIds = filteredLeads.map((l) => l.id);
    if (selectedLeads.length === filteredIds.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredIds);
    }
  };

  const executeCampaignBatch = () => {
    if (selectedLeads.length === 0) {
      addLog("WARNING: Cannot initiate campaign. No target leads selected in dispatch matrix.", "warn");
      return;
    }

    addLog(`CAMPAIGN OUTBOUND: Executing playbook [${selectedPlaybook}] for ${selectedLeads.length} targets...`, "info");
    
    // Transition status to SENT
    setLeads((prev) =>
      prev.map((l) => {
        if (selectedLeads.includes(l.id)) {
          return { ...l, status: "SENT" };
        }
        return l;
      })
    );

    setStats((prev) => ({
      ...prev,
      deliveredCount: prev.deliveredCount + selectedLeads.length
    }));

    addLog(`SUCCESS: ${selectedLeads.length} automated sequences dispatched safely into regional outbound node queues.`, "success");
    setSelectedLeads([]);
  };

  // Filtering Logic
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegistry = selectedRegistry === "ALL" || lead.industry === selectedRegistry;
    const matchesScore = lead.likelihoodScore >= minScore;

    return matchesSearch && matchesRegistry && matchesScore;
  });

  const getReplacedTemplate = (lead: Lead) => {
    const template = playbooks[selectedPlaybook];
    if (!template) return { subject: "", body: "" };
    
    return {
      subject: template.subject.replace("[Company]", lead.company),
      body: template.body
        .replace("[Owner]", lead.owner)
        .replace("[Company]", lead.company)
        .replace("[Industry]", lead.industry)
    };
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono p-4 md:p-6 min-h-screen flex flex-col justify-between border border-[#222222] selection:bg-[#00FF66] selection:text-[#050505]">
      
      {/* 1. TOP INTERACTIVE META CONTROL BAR */}
      <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#00FF66] animate-ping rounded-full inline-block"></span>
            <span className="text-sm font-bold tracking-widest uppercase">PROPRIETARY DEAL REGISTRY SCRAPER // SOURCING CONSOLE</span>
          </div>
          <p className="text-[11px] text-[#888888] mt-1 uppercase">
            Programmatic off-market operator harvesting, email sequence scheduling, and CRM pipeline synchronization
          </p>
        </div>
        
        {/* Real-time system status counters */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="border border-[#222222] bg-[#111111] px-3 py-1.5">
            <span className="text-[#888888]">TOTAL CRAWLED: </span>
            <span className="text-[#00FF66] font-bold">{stats.scrapedTotal}</span>
          </div>
          <div className="border border-[#222222] bg-[#111111] px-3 py-1.5">
            <span className="text-[#888888]">DISPATCHED SEQUENCES: </span>
            <span className="text-[#0EA5E9] font-bold">{stats.deliveredCount}</span>
          </div>
          <div className="border border-[#222222] bg-[#111111] px-3 py-1.5">
            <span className="text-[#888888]">RESPONSE RATE: </span>
            <span className="text-[#00FF66] font-bold">
              {((stats.repliedCount / (stats.deliveredCount || 1)) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="border border-[#222222] bg-[#111111] px-3 py-1.5">
            <span className="text-[#888888]">HARVESTED EBITDA POOL: </span>
            <span className="text-[#0EA5E9] font-bold">${(stats.pipelineValue / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>

      {/* 2. DUAL WORKING GRID: LEFT CONTROL / RIGHT EXECUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT PANEL: Crawler setup, logs, custom commands, and templates */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* CRAWLER CONTROLLER & RUNTIME */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// Registry Scraping System</span>
              <span className="text-[10px] text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 border border-[#00FF66]/30">ACTIVE ENGINE</span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 border border-[#222222] bg-[#111111]">
                  <span className="text-[#888888] block text-[9px] uppercase">TARGET NODE CONFIGURATION</span>
                  <select 
                    value={currentNode} 
                    onChange={(e) => setCurrentNode(e.target.value)}
                    className="w-full bg-transparent text-[#00FF66] focus:outline-none uppercase font-mono mt-1"
                  >
                    <option value="NODE-09A // WEST-TEXAS" className="bg-[#050505]">NODE-09A // WEST-TEXAS</option>
                    <option value="NODE-14B // RUST-BELT" className="bg-[#050505]">NODE-14B // RUST-BELT</option>
                    <option value="NODE-03C // MID-ATLANTIC" className="bg-[#050505]">NODE-03C // MID-ATLANTIC</option>
                  </select>
                </div>

                <div className="p-2 border border-[#222222] bg-[#111111]">
                  <span className="text-[#888888] block text-[9px] uppercase">ROUTING CAPABILITY</span>
                  <span className="text-[#0EA5E9] font-bold block mt-1 uppercase">SBA 7a TARGET READY</span>
                </div>
              </div>

              {/* Crawl execution trigger */}
              <div>
                <button
                  onClick={handleScrapeScan}
                  disabled={isScraping}
                  className={`w-full py-3 text-xs uppercase font-bold tracking-widest border transition-all duration-150 ${
                    isScraping 
                      ? "bg-[#222222] text-[#888888] border-[#222222] cursor-not-allowed" 
                      : "bg-[#00FF66] text-[#050505] border-[#00FF66] hover:bg-transparent hover:text-[#00FF66] hover:shadow-[0_0_10px_rgba(0,255,102,0.3)]"
                  }`}
                >
                  {isScraping ? `CRAWLING DIRECTORIES (${scrapeProgress}%)` : "DEPLOY SCRAPER CRAWLERS"}
                </button>
                {isScraping && (
                  <div className="w-full bg-[#111111] h-1 border border-[#222222] mt-2">
                    <div className="bg-[#00FF66] h-full transition-all duration-300" style={{ width: `${scrapeProgress}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* REALTIME SYSTEM TERMINAL & SHELL */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col h-[280px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// Live Compilation Shell</span>
              <span className="text-[10px] text-[#0EA5E9] animate-pulse">STREAM_ON</span>
            </div>

            {/* Scrollable logs */}
            <div className="flex-grow bg-[#050505] border border-[#222222] p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 scrollbar-thin scrollbar-thumb-[#222222]">
              {logs.map((log) => (
                <div key={log.id} className="leading-relaxed">
                  <span className="text-[#888888] mr-2">[{log.timestamp}]</span>
                  <span 
                    className={
                      log.type === "success" ? "text-[#00FF66]" :
                      log.type === "warn" ? "text-[#0EA5E9]" :
                      log.type === "error" ? "text-[#FF3333] font-bold" : "text-[#F9F9F9]/80"
                    }
                  >
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            {/* Custom interactive text console input */}
            <form onSubmit={handleCliSubmit} className="mt-2 flex items-center border border-[#222222] bg-[#111111]">
              <span className="text-[#00FF66] px-2 text-xs">CMD&gt;</span>
              <input 
                type="text"
                value={cliInput}
                onChange={(e) => setCmd(cliInput, setCliInput(e.target.value))}
                placeholder="type 'help' for instructions..."
                className="w-full bg-transparent text-[#00FF66] focus:outline-none text-xs p-2 uppercase font-mono placeholder-[#888888]"
              />
              <button type="submit" className="hidden"></button>
            </form>
          </div>

          {/* OUTREACH PLAYBOOKS CONFIGURATION */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <span className="text-xs text-[#888888] uppercase tracking-wider block">// OUTBOUND SEQUENCE MATRIX</span>

            <div className="space-y-1.5">
              <template className="hidden" /> {/* Required for React static compile support */}
              {[
                { id: "SBA_CASH", label: "SBA 7(a) Direct Capital Introduction" },
                { id: "RETIRING_LOCAL", label: "Phased Succession Legacy Model" },
                { id: "DIRECT_PARTNER", label: "Fast Close Strategic Consolidation" }
              ].map((playbook) => (
                <button
                  key={playbook.id}
                  onClick={() => setSelectedPlaybook(playbook.id)}
                  className={`w-full text-left text-xs p-2.5 border transition-all ${
                    selectedPlaybook === playbook.id 
                      ? "bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]" 
                      : "bg-transparent text-[#F9F9F9] border-[#222222] hover:bg-[#111111] hover:text-[#0EA5E9] hover:border-[#0EA5E9]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{playbook.label}</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 border border-[#222222] bg-[#050505]">
                      {selectedPlaybook === playbook.id ? "ACTIVE" : "SELECT"}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Live Template preview */}
            <div className="bg-[#050505] border border-[#222222] p-3 text-[11px] text-[#888888] space-y-1 leading-relaxed">
              <span className="text-[#0EA5E9] font-bold block text-[9px] uppercase">
                TEMPLATE PREVIEW (SUBJECT: {playbooks[selectedPlaybook]?.subject})
              </span>
              <p className="whitespace-pre-line text-[#888888]/80 max-h-[140px] overflow-y-auto border-t border-[#222222] pt-2 mt-2">
                {playbooks[selectedPlaybook]?.body}
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Extracted registries lead directory & mass dispatch center */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* CONTROL MATRIX FOR DATABASE */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// HARVESTED DIRECTORIES & ACTIONS</span>
              
              {/* Filter registries vertical switcher */}
              <div className="flex flex-wrap gap-1.5">
                {["ALL", "HVAC", "Manufacturing", "Logistics"].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegistry(reg)}
                    className={`px-3 py-1 text-[10px] uppercase font-bold border ${
                      selectedRegistry === reg
                        ? "bg-[#00FF66] text-[#050505] border-[#00FF66]"
                        : "bg-[#111111] text-[#F9F9F9] border-[#222222] hover:bg-[#222222] hover:text-[#00FF66]"
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter inputs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Search leads */}
              <div>
                <span className="text-[10px] text-[#888888] block mb-1">CRAWLER DATA SEARCH Query</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by company, owner name, registry source..."
                  className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs p-2 focus:border-[#0EA5E9] focus:outline-none uppercase placeholder-[#888888] font-mono"
                />
              </div>

              {/* Threshold Likelihood slide */}
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-[#888888]">MIN AI RESPONSE SCORE:</span>
                  <span className="text-[#00FF66] font-bold">{minScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#111111]"
                />
              </div>

            </div>
          </div>

          {/* LEADS DATABASE GRID VIEW */}
          <div className="border border-[#222222] bg-[#0a0a0a] overflow-hidden flex flex-col flex-grow">
            
            {/* Header control */}
            <div className="p-3 border-b border-[#222222] bg-[#111111] flex justify-between items-center text-xs">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  onChange={toggleAllLeads}
                  checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                  className="accent-[#00FF66] cursor-pointer"
                />
                <span className="text-[#888888]">TARGET LISTING CODENAME ({filteredLeads.length} SECURED)</span>
              </div>
              <div className="text-[#0EA5E9] font-mono text-[11px]">
                {selectedLeads.length} INDEXES QUEUED FOR CAMPAIGN OUTBOX
              </div>
            </div>

            {/* Table or Cards depending on search size */}
            <div className="divide-y divide-[#222222] max-h-[480px] overflow-y-auto bg-[#050505] scrollbar-thin">
              {filteredLeads.length === 0 ? (
                <div className="p-8 text-center text-[#FF3333] text-xs font-mono uppercase">
                  ⚠️ ZERO VIABLE OPERATORS MATCH CURRENT CRITERIA INDEX SETTING
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className={`p-4 transition-all hover:bg-[#111111]/40 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center ${
                      selectedLeads.includes(lead.id) ? "bg-[#0EA5E9]/5 border-l-2 border-l-[#0EA5E9]" : ""
                    }`}
                  >
                    {/* Left Column info */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleSelectLead(lead.id)}
                        className="accent-[#00FF66] cursor-pointer mt-1"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] px-2 py-0.5 border border-[#222222] bg-[#111111] text-[#0EA5E9] font-mono">
                            {lead.id}
                          </span>
                          <h4 className="text-xs font-bold text-[#F9F9F9] uppercase">
                            {lead.company}
                          </h4>
                        </div>
                        <div className="text-[10px] text-[#888888] space-x-3">
                          <span>OWNER: <strong className="text-[#F9F9F9]">{lead.owner}</strong></span>
                          <span>|</span>
                          <span>REGISTRY: <strong className="text-[#F9F9F9]">{lead.registrySource}</strong></span>
                        </div>
                        <div className="text-[10px] text-[#888888] space-x-3">
                          <span>EMAIL: <span className="text-[#0EA5E9] font-mono underline">{lead.email}</span></span>
                          <span>|</span>
                          <span>VALUATION METRIC: <strong className="text-[#00FF66]">{lead.revenueEst} Rev / {lead.ebitdaEst} EBITDA</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right column: Badges and stats */}
                    <div className="flex flex-row md:flex-col items-end justify-between md:justify-center w-full md:w-auto gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] text-[#888888]">AI FIT:</span>
                        <span className={`text-[11px] font-bold ${lead.likelihoodScore >= 90 ? "text-[#00FF66]" : "text-[#0EA5E9]"}`}>
                          {lead.likelihoodScore}%
                        </span>
                      </div>

                      {/* Outbound queue State indicator */}
                      <span 
                        className={`text-[9px] uppercase px-2 py-0.5 border font-bold ${
                          lead.status === "UNTOUCHED" ? "border-[#222222] text-[#888888] bg-[#111111]" :
                          lead.status === "QUEUED" ? "border-[#0EA5E9] text-[#0EA5E9] bg-[#0EA5E9]/5" :
                          lead.status === "SENT" ? "border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5" :
                          "border-[#FF3333] text-[#FF3333] bg-[#FF3333]/5"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Mass dispatch controller */}
            <div className="p-4 border-t border-[#222222] bg-[#111111] flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-[10px] text-[#888888] max-w-sm text-center sm:text-left uppercase">
                * ALL CONSOLE CAMPAIGNS UNDERGO DELAY RANDOMIZATION THROUGH SECURE OUTBOX SERVERS TO BYPASS FILTERS.
              </span>
              <button
                onClick={executeCampaignBatch}
                disabled={selectedLeads.length === 0}
                className={`w-full sm:w-auto px-6 py-3 text-xs uppercase font-bold tracking-widest border transition-all duration-200 ${
                  selectedLeads.length === 0 
                    ? "bg-[#222222] text-[#888888] border-[#222222] cursor-not-allowed" 
                    : "bg-[#0EA5E9] text-[#050505] border-[#0EA5E9] hover:bg-transparent hover:text-[#0EA5E9] hover:shadow-[0_0_10px_rgba(14,165,233,0.3)]"
                }`}
              >
                DISPATCH AUTOMATED SEQUENCE ({selectedLeads.length})
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 3. UNDERGROUND COMPLIANCE DISCLAIMERS & TRUST DESKS */}
      <div className="border-t border-[#222222] mt-8 pt-6 pb-2 text-[10px] text-[#888888] space-y-2 uppercase leading-normal">
        <p className="text-[#F9F9F9] tracking-wider">// LOCAL REGISTRY CRAWL SYSTEM LEGALITIES</p>
        <p>
          NOTICE: All crawlers operates within localized registry compliance limits (FINCEN & State Register guidelines). Scraping rate triggers are dynamically throttled at 5 queries per second to prevent target system payload saturation. Leads aggregated represent off-market operators whose data is publicly recorded and indexed through private equity parsing heuristics.
        </p>
        <div className="flex justify-between items-center text-[9px] pt-2">
          <span>CODENAME SCRAPER COMPILATION ENGINE // ACQUIRE_META GLOBAL DESK</span>
          <span>STATION ID: [SEC-OUTBOX-9]</span>
        </div>
      </div>

    </div>
  );
}
```