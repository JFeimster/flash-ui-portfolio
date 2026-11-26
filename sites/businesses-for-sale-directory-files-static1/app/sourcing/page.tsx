```tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

// --- CUSTOM STYLES & CRT EFFECTS AS INLINE CSS ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

  .font-mono-terminal {
    font-family: 'Space Mono', monospace;
  }

  .terminal-bg {
    background-color: #050505;
    background-image: radial-gradient(rgba(10, 10, 10, 0.85) 15%, transparent 80%);
  }

  @keyframes marquee {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
  }

  .animate-marquee-slow {
    animation: marquee 45s linear infinite;
  }

  .animate-marquee-slow:hover {
    animation-play-state: paused;
  }

  /* Custom high-tech scrollbars */
  .custom-scroll::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: #050505;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background: #222222;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #00FF66;
  }

  /* CRT Scanline Effect */
  .scanline-overlay::before {
    content: " ";
    display: block;
    position: fixed;
    top: 0; left: 0; bottom: 0; right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: 9999;
    background-size: 100% 4px, 6px 100%;
    pointer-events: none;
  }
`;

// --- INTERFACES & MOCK REGISTRY DATABASE ---
interface OwnerRegistryRecord {
  id: string;
  businessName: string;
  industry: string;
  ownerName: string;
  ownerAge: number;
  location: string;
  estimatedRevenue: number;
  estimatedEbitda: number;
  contactChannels: ("Email" | "Direct Mail" | "Phone")[];
  successionRisk: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  outreachAttempts: number;
  pipelineStatus: "UNTOUCHED" | "QUEUED" | "SENT" | "RESPONSED" | "WARM_LEAD" | "LOI_NEGOTIATION";
  confidenceScore: number; // calculated score based on owner age / business type
}

const INITIAL_REGISTRY: OwnerRegistryRecord[] = [
  {
    id: "REG-9912",
    businessName: "Cascade Tool & Precision Moldings",
    industry: "Manufacturing",
    ownerName: "Donald 'Donnie' Vance",
    ownerAge: 69,
    location: "Grand Rapids, MI",
    estimatedRevenue: 4800000,
    estimatedEbitda: 1100000,
    contactChannels: ["Email", "Direct Mail"],
    successionRisk: "CRITICAL",
    outreachAttempts: 0,
    pipelineStatus: "UNTOUCHED",
    confidenceScore: 94,
  },
  {
    id: "REG-4420",
    businessName: "Tri-State HVAC & Mechanical Services",
    industry: "HVAC",
    ownerName: "Robert & Shirley Vance",
    ownerAge: 64,
    location: "Columbus, OH",
    estimatedRevenue: 3400000,
    estimatedEbitda: 780000,
    contactChannels: ["Email", "Phone"],
    successionRisk: "HIGH",
    outreachAttempts: 1,
    pipelineStatus: "UNTOUCHED",
    confidenceScore: 88,
  },
  {
    id: "REG-1044",
    businessName: "Northeast Logistics Express Corp",
    industry: "Logistics",
    ownerName: "Frank Bialystock",
    ownerAge: 71,
    location: "Scranton, PA",
    estimatedRevenue: 6200000,
    estimatedEbitda: 1400000,
    contactChannels: ["Direct Mail"],
    successionRisk: "CRITICAL",
    outreachAttempts: 0,
    pipelineStatus: "UNTOUCHED",
    confidenceScore: 96,
  },
  {
    id: "REG-8089",
    businessName: "Apex Sheet Metal & Welders",
    industry: "Manufacturing",
    ownerName: "Gary S. Mitchell",
    ownerAge: 58,
    location: "Milwaukee, WI",
    estimatedRevenue: 2800000,
    estimatedEbitda: 550000,
    contactChannels: ["Email", "Phone", "Direct Mail"],
    successionRisk: "MODERATE",
    outreachAttempts: 2,
    pipelineStatus: "RESPONSED",
    confidenceScore: 72,
  },
  {
    id: "REG-2311",
    businessName: "Glacier Industrial Refrigeration Services",
    industry: "HVAC",
    ownerName: "Kenneth G. Archer",
    ownerAge: 67,
    location: "Indianapolis, IN",
    estimatedRevenue: 3100000,
    estimatedEbitda: 690000,
    contactChannels: ["Email"],
    successionRisk: "HIGH",
    outreachAttempts: 0,
    pipelineStatus: "UNTOUCHED",
    confidenceScore: 85,
  },
  {
    id: "REG-7650",
    businessName: "Vanguard Warehousing & Intermodal",
    industry: "Logistics",
    ownerName: "Marcus Thorne",
    ownerAge: 62,
    location: "Savannah, GA",
    estimatedRevenue: 7500000,
    estimatedEbitda: 1800000,
    contactChannels: ["Direct Mail", "Phone"],
    successionRisk: "MODERATE",
    outreachAttempts: 3,
    pipelineStatus: "WARM_LEAD",
    confidenceScore: 79,
  },
  {
    id: "REG-3042",
    businessName: "Pioneer Machining Solutions",
    industry: "Manufacturing",
    ownerName: "Leland Stanford",
    ownerAge: 73,
    location: "Erie, PA",
    estimatedRevenue: 1900000,
    estimatedEbitda: 410000,
    contactChannels: ["Email", "Direct Mail"],
    successionRisk: "CRITICAL",
    outreachAttempts: 0,
    pipelineStatus: "UNTOUCHED",
    confidenceScore: 97,
  },
  {
    id: "REG-5561",
    businessName: "Northstar Air Distribution Systems",
    industry: "HVAC",
    ownerName: "Genevieve Dubois",
    ownerAge: 66,
    location: "Duluth, MN",
    estimatedRevenue: 2200000,
    estimatedEbitda: 480000,
    contactChannels: ["Email"],
    successionRisk: "HIGH",
    outreachAttempts: 1,
    pipelineStatus: "SENT",
    confidenceScore: 83,
  },
];

// Preset Outreach Templates
const PRESET_TEMPLATES = [
  {
    id: "temp-retirement",
    name: "Retirement Succession Inquiry",
    subject: "Strategic Succession Request - Private Inquiry re: {{business_name}}",
    body: "Dear {{owner_name}},\n\nI have been studying the independent {{industry}} sector in {{location}} for several quarters, and your operational history at {{business_name}} has consistently stood out. Our private investment group focuses on providing clean, non-disruptive exits specifically for founders seeking transition or retirement without listing through brokers.\n\nWe structure transitions with 100% local job retention. I would appreciate a direct, confidential 10-minute briefing call next Tuesday.\n\nRespectfully,\nSenior Sourcing Partner // AcquireMeta Network",
  },
  {
    id: "temp-direct",
    name: "Direct Capitalization / Cash Out Offer",
    subject: "Unlisted Asset Acquisition Interest: {{business_name}}",
    body: "Dear {{owner_name}},\n\nThis is a formal inquiry regarding the operational structure of {{business_name}} in {{location}}. Our network currently holds pre-allocated SBA 7(a) acquisition liquidity targeted at the local {{industry}} market.\n\nIf you have evaluated succession frameworks or transition liquidations for late this fiscal cycle, we can structure a highly confidential, non-binding initial LOI inside of 14 operating days.\n\nBest Regards,\nSourcing Systems Controller // AcquireMeta Node-TX",
  },
  {
    id: "temp-direct-mail",
    name: "Physical Letter Copy (Direct Mail Blueprint)",
    subject: "[CONFIDENTIAL COURIER DESPATCH]",
    body: "RE: PRIVATE LIQUIDITY DIRECTIVE // {{business_name}}\n\nTO: {{owner_name}}\n\nThis communication serves as notification that our acquisition mandate has flagged your geographical footprint in {{location}} for proprietary capital allocation. We understand that specialized {{industry}} setups represent critical local infrastructure. We specialize in buying businesses with no natural family successors.\n\nCall our recorded private terminal wire to authorize next step dossier routing.",
  },
];

export default function SourcingPage() {
  // --- STATE SYSTEM ---
  const [registry, setRegistry] = useState<OwnerRegistryRecord[]>(INITIAL_REGISTRY);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("ALL");
  const [selectedRisk, setSelectedRisk] = useState<string>("ALL");
  const [minEbitda, setMinEbitda] = useState<number>(300000);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Selection pipeline
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  
  // Sequences state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("temp-retirement");
  const [customSubject, setCustomSubject] = useState<string>("");
  const [customBody, setCustomBody] = useState<string>("");

  // Simulated Programmatic execution terminal
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "// SYSTEM REBOOT COMPLETED.",
    "// PROPRIETARY OUTREACH SUBSYSTEM CONNECTED ON PORT 8092...",
    "// ACTIVE MAIL PROXIES VERIFIED: [USA-EAST-SMTP, USA-CENTRAL-RELAY]",
    "// READY TO ENERGIZE programmatic sourcing sequences.",
  ]);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [transmissionProgress, setTransmissionProgress] = useState<number>(0);
  
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Set initial template state on mount or template change
  useEffect(() => {
    const matched = PRESET_TEMPLATES.find(t => t.id === selectedTemplateId);
    if (matched) {
      setCustomSubject(matched.subject);
      setCustomBody(matched.body);
    }
  }, [selectedTemplateId]);

  // Keep console scrolled down
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);

  // --- FILTERED DATA LOGIC ---
  const filteredRegistry = useMemo(() => {
    return registry.filter(r => {
      const matchIndustry = selectedIndustry === "ALL" || r.industry === selectedIndustry;
      const matchRisk = selectedRisk === "ALL" || r.successionRisk === selectedRisk;
      const matchEbitda = r.estimatedEbitda >= minEbitda;
      const matchSearch = r.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchIndustry && matchRisk && matchEbitda && matchSearch;
    });
  }, [registry, selectedIndustry, selectedRisk, minEbitda, searchTerm]);

  // --- HANDLERS ---
  const toggleSelectRecord = (id: string) => {
    setSelectedRecordIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredRegistry.map(r => r.id);
    setSelectedRecordIds(filteredIds);
  };

  const clearSelection = () => {
    setSelectedRecordIds([]);
  };

  // Run simulated programmatic transmission sequences
  const executeSequence = () => {
    if (selectedRecordIds.length === 0) {
      setConsoleLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ⚠️ ERROR: Transmission aborted. No target records selected.`
      ]);
      return;
    }

    setIsTransmitting(true);
    setTransmissionProgress(0);
    
    setConsoleLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ⚡ COMMAND EXECUTED: Launching campaign targeting ${selectedRecordIds.length} locations...`,
      `[SMTP] Preheating mail nodes and compiling templates for target queue...`
    ]);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < selectedRecordIds.length) {
        const targetId = selectedRecordIds[currentIndex];
        const record = registry.find(r => r.id === targetId);
        
        if (record) {
          // Process string interpolations
          let personalizedSubject = customSubject
            .replace("{{business_name}}", record.businessName)
            .replace("{{owner_name}}", record.ownerName)
            .replace("{{industry}}", record.industry)
            .replace("{{location}}", record.location);

          setConsoleLogs(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] Dispatching payload to ID: ${record.id} (${record.ownerName})`,
            ` => SUBJECT: "${personalizedSubject.slice(0, 45)}..."`,
            ` => CHANNELS ACTIVE: ${record.contactChannels.join(" + ")}`,
            ` => STATUS: [SUCCESSFULLY SENT]`
          ]);

          // Update record state to reflect it's queued/sent
          setRegistry(prev => prev.map(item => {
            if (item.id === targetId) {
              return {
                ...item,
                outreachAttempts: item.outreachAttempts + 1,
                pipelineStatus: "SENT" as const
              };
            }
            return item;
          }));
        }

        currentIndex++;
        setTransmissionProgress(Math.round((currentIndex / selectedRecordIds.length) * 100));
      } else {
        clearInterval(interval);
        setIsTransmitting(false);
        setConsoleLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] 🎉 TRANSMISSION PIPELINE DRAINED: ${selectedRecordIds.length} sequences active. Monitoring callbacks via SMTP Webhooks...`
        ]);
        setSelectedRecordIds([]); // clear out queue after finish
      }
    }, 1500);
  };

  // Update pipeline state manually for demo
  const promoteStatus = (id: string, nextStatus: OwnerRegistryRecord["pipelineStatus"]) => {
    setRegistry(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, pipelineStatus: nextStatus };
      }
      return item;
    }));
    setConsoleLogs(prev => [
      ...prev,
      `[INFO] Record ${id} status shifted to ${nextStatus}`
    ]);
  };

  // Calculated totals for metrics visualizer
  const metrics = useMemo(() => {
    const totalOutreach = registry.reduce((sum, item) => sum + item.outreachAttempts, 0);
    const sentCount = registry.filter(r => r.pipelineStatus === "SENT").length;
    const responseCount = registry.filter(r => ["RESPONSED", "WARM_LEAD", "LOI_NEGOTIATION"].includes(r.pipelineStatus)).length;
    const responseRate = totalOutreach > 0 ? ((responseCount / (totalOutreach)) * 100).toFixed(1) : "0.0";
    const criticalVulnerability = registry.filter(r => r.successionRisk === "CRITICAL").length;

    return {
      totalOutreach,
      sentCount,
      responseCount,
      responseRate,
      criticalVulnerability
    };
  }, [registry]);

  return (
    <div className="terminal-bg min-h-screen text-[#F9F9F9] font-mono-terminal selection:bg-[#00FF66] selection:text-[#050505] flex flex-col justify-between antialiased relative scanline-overlay">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* 1. GLOBAL HEADER & ACTIVE RE-ROUTING TICKER */}
      <header className="border-b border-[#222222] bg-[#050505] sticky top-0 z-40">
        <div className="overflow-hidden border-b border-[#222222] bg-[#0a0a0a] py-1 text-[10px] tracking-[0.2em] text-[#0EA5E9] uppercase">
          <div className="flex whitespace-nowrap animate-marquee-slow">
            <span className="mx-4">[SYSTEM FEED: CRITICAL RETIREMENT SOURCING PIPELINE ENGAGED]</span>
            <span className="mx-4 text-[#00FF66]">[SUCCESS: LOI DRAFT TRANSMITTED TO HVAC FOUNDER IN CINCINNATI]</span>
            <span className="mx-4 text-[#FF3333]">[WARN: 38 OFF-MARKET RECORDS FLAG SECURE EXCLUSIVITY PERIODS]</span>
            <span className="mx-4">[OUTREACH PROXIES ONLINE: 100.0% CONVERSION LATENCY GUARANTEE]</span>
            {/* Loop Repeat */}
            <span className="mx-4">[SYSTEM FEED: CRITICAL RETIREMENT SOURCING PIPELINE ENGAGED]</span>
            <span className="mx-4 text-[#00FF66]">[SUCCESS: LOI DRAFT TRANSMITTED TO HVAC FOUNDER IN CINCINNATI]</span>
            <span className="mx-4 text-[#FF3333]">[WARN: 38 OFF-MARKET RECORDS FLAG SECURE EXCLUSIVITY PERIODS]</span>
            <span className="mx-4">[OUTREACH PROXIES ONLINE: 100.0% CONVERSION LATENCY GUARANTEE]</span>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#00FF66] animate-pulse"></div>
              <span className="text-lg font-bold tracking-wider text-[#F9F9F9]">
                ACQUIRE<span className="text-[#00FF66]">META</span> // <span className="text-[#0EA5E9]">OUTREACH</span>
              </span>
            </div>
            <span className="text-[9px] px-2 py-0.5 border border-[#222222] text-[#888888] bg-[#0c0c0c] uppercase">
              CMD-CENTER v3.44 / SECURE OUTREACH
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-[#888888] justify-center md:justify-end">
            <div>SOURCING FLOW: <span className="text-[#00FF66] font-bold">SMTP NODES LOCKED</span></div>
            <div>STRIKE RATE: <span className="text-[#0EA5E9] font-bold">{metrics.responseRate}% RESP</span></div>
            <div className="border border-[#222222] px-2 py-1 bg-[#111111] text-[#F9F9F9] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] block animate-ping"></span>
              PROSPECT MATRIX: {registry.length} IN DB
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 md:px-6 py-6 flex flex-col lg:grid lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: FILTERS & SOURCING PIPELINE CRITERIA */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// TARGET REGISTRY SEARCH</span>
              <span className="text-[9px] text-[#00FF66]">[ACTIVE]</span>
            </div>

            {/* Keyword search */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#888888] uppercase">Owner, Company or City</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Query Registry..."
                className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-2 placeholder-[#888888] uppercase font-mono tracking-wider"
              />
            </div>

            {/* Industry Selector */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#888888] uppercase block">Industry Sector Matrix</span>
              <div className="grid grid-cols-2 gap-1.5">
                {["ALL", "HVAC", "Manufacturing", "Logistics"].map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`text-[10px] p-1.5 border text-center transition-all ${
                      selectedIndustry === ind
                        ? "bg-[#00FF66] text-[#050505] font-bold border-[#00FF66]"
                        : "bg-transparent text-[#F9F9F9] border-[#222222] hover:bg-[#111111] hover:text-[#00FF66]"
                    }`}
                  >
                    {ind.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Succession Risk filter */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#888888] uppercase block">Succession Risk Level</span>
              <div className="grid grid-cols-2 gap-1.5">
                {["ALL", "CRITICAL", "HIGH", "MODERATE"].map((rsk) => (
                  <button
                    key={rsk}
                    onClick={() => setSelectedRisk(rsk)}
                    className={`text-[10px] p-1.5 border text-center transition-all ${
                      selectedRisk === rsk
                        ? "bg-[#0EA5E9] text-[#050505] font-bold border-[#0EA5E9]"
                        : "bg-transparent text-[#F9F9F9] border-[#222222] hover:bg-[#111111] hover:text-[#0EA5E9]"
                    }`}
                  >
                    {rsk}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum estimated EBITDA */}
            <div className="space-y-2 pt-2 border-t border-[#222222]">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">MIN EST. EBITDA:</span>
                <span className="text-[#00FF66] font-bold">
                  ${(minEbitda / 1000).toFixed(0)}K
                </span>
              </div>
              <input
                type="range"
                min="300000"
                max="1500000"
                step="50000"
                value={minEbitda}
                onChange={(e) => setMinEbitda(Number(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#111111]"
              />
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>$300K</span>
                <span>$1.5M</span>
              </div>
            </div>
          </div>

          {/* PIPELINE STRIKE METRICS */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <span className="text-xs text-[#888888] uppercase tracking-wider block border-b border-[#222222] pb-2">
              // TELEMETRY METRIC FEED
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#050505] border border-[#222222] p-2">
                <span className="text-[9px] text-[#888888] block">OUTREACH EXEC</span>
                <span className="text-lg font-bold text-[#F9F9F9]">{metrics.totalOutreach}</span>
              </div>
              <div className="bg-[#050505] border border-[#222222] p-2">
                <span className="text-[9px] text-[#888888] block">CRIT VULNERABLE</span>
                <span className="text-lg font-bold text-[#FF3333]">{metrics.criticalVulnerability}</span>
              </div>
              <div className="bg-[#050505] border border-[#222222] p-2">
                <span className="text-[9px] text-[#888888] block">ACTIVE PIPES</span>
                <span className="text-lg font-bold text-[#0EA5E9]">{metrics.sentCount}</span>
              </div>
              <div className="bg-[#050505] border border-[#222222] p-2">
                <span className="text-[9px] text-[#888888] block">RESPONSE RATE</span>
                <span className="text-lg font-bold text-[#00FF66]">{metrics.responseRate}%</span>
              </div>
            </div>
          </div>

          {/* TELEPHONE TERMINAL PROTOCOL EXPLANATION */}
          <div className="border border-[#222222] bg-[#0c0c0c] p-3 text-[10px] text-[#888888] leading-relaxed">
            <span className="text-[#00FF66] font-bold">PROGRAMMATIC DISCOVERY MANUAL:</span> Selected records will be initialized for multi-channel automated drip sequencing. Real-time logging of transmissions will occur in the Outreach Control panel.
          </div>
        </aside>

        {/* MIDDLE COLUMN: ACTIVE OFF-MARKET REGISTRY RECORD STREAM */}
        <section className="lg:col-span-5 space-y-4 flex flex-col">
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs text-[#888888] uppercase block">OFF-MARKET OWNER REGISTRY (UNLISTED)</span>
              <span className="text-[10px] text-[#00FF66]">
                MATCH CAPACITY: {filteredRegistry.length} LEADS RETRIEVED
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAllFiltered}
                className="text-[10px] px-2 py-1 bg-[#111111] border border-[#222222] text-[#F9F9F9] hover:border-[#00FF66] uppercase"
              >
                SELECT ALL
              </button>
              <button
                onClick={clearSelection}
                className="text-[10px] px-2 py-1 bg-[#111111] border border-[#222222] text-[#FF3333] hover:border-[#FF3333] uppercase"
              >
                CLEAR
              </button>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto custom-scroll flex-grow pr-1 max-h-[75vh]">
            {filteredRegistry.length === 0 ? (
              <div className="border border-[#FF3333] bg-[#0f0707] p-8 text-center space-y-2">
                <div className="text-[#FF3333] font-bold text-sm">NO GEOGRAPHIC / INDUSTRIAL MATCHES</div>
                <p className="text-[11px] text-[#888888] max-w-sm mx-auto">
                  Adjust standard criteria matrices or lower your EBITDA thresholds to engage offline nodes.
                </p>
              </div>
            ) : (
              filteredRegistry.map((record) => {
                const isSelected = selectedRecordIds.includes(record.id);
                return (
                  <div
                    key={record.id}
                    className={`border transition-all duration-200 ${
                      isSelected
                        ? "border-[#00FF66] bg-[#050c07]"
                        : "border-[#222222] bg-[#0a0a0a] hover:border-[#0EA5E9]"
                    }`}
                  >
                    {/* Header bar of record */}
                    <div className="border-b border-[#222222] p-3 flex justify-between items-center bg-[#0d0d0d]">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRecord(record.id)}
                          className="w-3.5 h-3.5 accent-[#00FF66] cursor-pointer bg-[#050505] border border-[#222222]"
                        />
                        <span className="text-[10px] bg-[#111111] border border-[#222222] px-1.5 py-0.5 text-[#0EA5E9] font-bold">
                          {record.id}
                        </span>
                        <span className="text-xs font-bold text-[#F9F9F9] tracking-wider uppercase">
                          {record.businessName}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 font-bold border ${
                          record.successionRisk === "CRITICAL"
                            ? "border-[#FF3333] text-[#FF3333] bg-[#FF3333]/5 animate-pulse"
                            : record.successionRisk === "HIGH"
                            ? "border-orange-500 text-orange-500 bg-orange-500/5"
                            : "border-yellow-500 text-yellow-500 bg-yellow-500/5"
                        }`}
                      >
                        {record.successionRisk} RISK
                      </span>
                    </div>

                    {/* Content Matrix of record */}
                    <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[9px] text-[#888888] block">FOUNDER / OWNER</span>
                        <span className="font-bold text-[#F9F9F9]">
                          {record.ownerName} ({record.ownerAge} y/o)
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#888888] block">EST. REVENUE / EBITDA</span>
                        <span className="font-bold text-[#F9F9F9]">
                          ${(record.estimatedRevenue / 1000000).toFixed(1)}M /{" "}
                          <span className="text-[#00FF66]">
                            ${(record.estimatedEbitda / 1000).toFixed(0)}K
                          </span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#888888] block">LOCATION SECURE</span>
                        <span className="text-[#888888]">{record.location}</span>
                      </div>
                    </div>

                    {/* Footer bar with tracking and state manipulation */}
                    <div className="border-t border-[#222222] p-2 bg-[#050505] flex flex-wrap items-center justify-between gap-2 text-[10px]">
                      <div className="flex items-center space-x-2 text-[#888888]">
                        <span>OUTREACH CHANNELS:</span>
                        {record.contactChannels.map((ch) => (
                          <span
                            key={ch}
                            className="text-[9px] px-1 bg-[#111111] border border-[#222222] text-[#0EA5E9]"
                          >
                            {ch.toUpperCase()}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[#888888]">STATUS:</span>
                        <span
                          className={`font-bold uppercase ${
                            record.pipelineStatus === "WARM_LEAD"
                              ? "text-[#00FF66]"
                              : record.pipelineStatus === "SENT"
                              ? "text-[#0EA5E9]"
                              : record.pipelineStatus === "RESPONSED"
                              ? "text-orange-400"
                              : "text-[#888888]"
                          }`}
                        >
                          {record.pipelineStatus}
                        </span>

                        {/* Status Promoters */}
                        {record.pipelineStatus === "UNTOUCHED" && (
                          <button
                            onClick={() => promoteStatus(record.id, "SENT")}
                            className="text-[9px] px-1 bg-[#111111] border border-[#222222] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-[#050505]"
                          >
                            → QUEUE
                          </button>
                        )}
                        {record.pipelineStatus === "SENT" && (
                          <button
                            onClick={() => promoteStatus(record.id, "RESPONSED")}
                            className="text-[9px] px-1 bg-[#111111] border border-[#222222] text-[#00FF66] hover:bg-[#00FF66] hover:text-[#050505]"
                          >
                            → SIMULATE RESPONSE
                          </button>
                        )}
                        {record.pipelineStatus === "RESPONSED" && (
                          <button
                            onClick={() => promoteStatus(record.id, "WARM_LEAD")}
                            className="text-[9px] px-1 bg-[#111111] border border-[#222222] text-amber-400 hover:bg-amber-400 hover:text-[#050505]"
                          >
                            → FLAG WARM
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: OUTREACH CONTROL MATRIX & COMMAND LINE */}
        <aside className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* SOURCING TEMPLATE SELECTION & CUSTOMIZER */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// CAMPAIGN UTILITY WRITER</span>
              <span className="text-[10px] text-[#0EA5E9]">NODE PRESETS</span>
            </div>

            {/* Selector buttons */}
            <div className="flex flex-col space-y-1">
              {PRESET_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`text-[10px] text-left p-2 border transition-all ${
                    selectedTemplateId === t.id
                      ? "bg-[#0EA5E9] text-[#050505] font-bold border-[#0EA5E9]"
                      : "bg-[#050505] text-[#888888] border-[#222222] hover:bg-[#111111] hover:text-[#F9F9F9]"
                  }`}
                >
                  {t.name.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Subject Customizer */}
            <div className="space-y-1">
              <label className="text-[9px] text-[#888888] uppercase block">Subject line blueprint</label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs p-2 focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            {/* Template Body */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-[#888888]">
                <span>MESSAGE BODY</span>
                <span>VARS: {"{{owner_name}}"}, {"{{business_name}}"}</span>
              </div>
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={5}
                className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-[11px] p-2 focus:outline-none focus:border-[#0EA5E9] resize-none"
              />
            </div>
          </div>

          {/* TELEMETRY DISPATCH CONSOLE */}
          <div className="border border-[#222222] bg-[#050505] flex-grow flex flex-col justify-between h-[300px] lg:h-auto min-h-[250px]">
            {/* Console Header */}
            <div className="border-b border-[#222222] bg-[#0d0d0d] p-3 flex justify-between items-center text-[10px]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
                <span className="text-[#00FF66] font-bold uppercase">// PROGRAMMATIC CLI LOG</span>
              </div>
              <button
                onClick={() => setConsoleLogs(["// TELEMETRY CLEARED.", "// SYSTEM IDLE"])}
                className="text-[9px] text-[#888888] border border-[#222222] px-1 hover:text-[#FF3333] hover:border-[#FF3333]"
              >
                CLEAR CONSOLE
              </button>
            </div>

            {/* Console Outputs */}
            <div className="p-3 overflow-y-auto custom-scroll flex-grow font-mono-terminal text-[10px] text-[#00FF66] space-y-1.5 max-h-[350px]">
              {consoleLogs.map((log, index) => (
                <div key={index} className="leading-relaxed whitespace-pre-wrap">
                  {log}
                </div>
              ))}
              <div ref={consoleBottomRef} />
            </div>

            {/* Execution / Transmission bar */}
            <div className="border-t border-[#222222] p-3 bg-[#0a0a0a] space-y-3">
              {isTransmitting && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-[#888888]">
                    <span>SENDING LIQUIDITY SEQUENCE DISPATCHES...</span>
                    <span>{transmissionProgress}%</span>
                  </div>
                  <div className="w-full bg-[#222] h-1.5">
                    <div
                      className="h-full bg-[#00FF66]"
                      style={{ width: `${transmissionProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <div className="text-[10px] text-[#888888]">
                  TARGET QUEUE: <span className="text-[#00FF66] font-bold">{selectedRecordIds.length}</span> SELECTED
                </div>

                <button
                  onClick={executeSequence}
                  disabled={isTransmitting}
                  className={`text-[11px] font-bold px-4 py-2 border transition-all uppercase ${
                    selectedRecordIds.length > 0 && !isTransmitting
                      ? "text-[#050505] bg-[#00FF66] border-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66] hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                      : "text-[#888888] border-[#222222] cursor-not-allowed bg-transparent"
                  }`}
                >
                  {isTransmitting ? "TRANSMITTING..." : "ENGAGE COLD OUTREACH"}
                </button>
              </div>
            </div>
          </div>

        </aside>
      </main>

      {/* FOOTER & REGISTRATION LEGALESE */}
      <footer className="border-t border-[#222222] bg-[#030303] mt-12 py-8 px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-[#222222]">
            <div className="text-xs tracking-[0.2em] text-[#888888] uppercase">
              OUTREACH PLATFORM PROTOCOLS
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8 items-center text-[10px] text-[#888888]">
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <svg className="w-4 h-4 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>SMTP CAN-SPAM COMPLIANCY VERIFIED</span>
              </div>
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <svg className="w-4 h-4 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>REGIONAL INDUSTRY REGISTRY SYNCED</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#888888] leading-relaxed max-w-7xl space-y-3">
            <p className="uppercase tracking-wider text-[#F9F9F9]">// OUTREACH RISK COMPLIANCE NOTICE</p>
            <p>
              Programmatic outbound operations rendered within this interface simulate secure, unlisted, proprietary outreach sequences. Searchers and users are individually responsible for ensuring any communications distributed conform directly with local jurisdiction mandates, business practice standards, CAN-SPAM specifications, and target state business communications policies.
            </p>
            <div className="flex justify-between items-center text-[9px] text-[#888888] pt-4">
              <span>© 2026 ACQUIRE_META OUTREACH NETWORKS. ALL PROXIES ONLINE.</span>
              <span>TERMINAL NODE SOURCE: [SECURE_TX]</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
```