```tsx
import React, { useState, useEffect, useMemo, useRef } from "react";

// Types
interface Lead {
  id: string;
  ownerName: string;
  businessName: string;
  industry: "HVAC" | "Manufacturing" | "Logistics";
  location: string;
  estEbitda: number;
  email: string;
  status: "UNTOUCHED" | "QUEUED" | "SENT" | "OPENED" | "REPLIED" | "BOUNCED";
}

interface TemplatePreset {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export default function TemplateEditor() {
  // Sector Registry State
  const [selectedIndustry, setSelectedIndustry] = useState<"ALL" | "HVAC" | "Manufacturing" | "Logistics">("ALL");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  
  // Sequence / Template States
  const [activeTemplateId, setActiveTemplateId] = useState<string>("succession");
  const [subjectText, setSubjectText] = useState("Acquisition Inquiry: Succession plans for {business_name}?");
  const [bodyText, setBodyText] = useState(
    "Hi {owner_name},\n\nI’ve been tracking specialized {industry_type} providers in the {location} area, and {business_name} stood out for your operational track record.\n\nWe are looking to deploy structural capital with an SBA-backed structure to transition a legacy platform with an estimated EBITDA profile of around {ebitda_estimate}.\n\nIf you have contemplated succession or looking to hand off operations over the next 12-24 months, let me know when you have 10 minutes for an encrypted terminal brief.\n\nBest regards,\n[Your Name]\nAcquireMeta Sourcing Protocol"
  );
  
  // Dispatch Command-Line State
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "// SYSTEM INITIALIZED: SECURE OUTREACH LINK ONLINE",
    "// READY TO TRANSMIT OFF-MARKET REGISTRY ACQUISITION PROPOSALS"
  ]);

  // Lead Registry Mock Database
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "LD-9021",
      ownerName: "Robert Vance",
      businessName: "Vance Refrigeration & HVAC",
      industry: "HVAC",
      location: "Scranton, PA",
      estEbitda: 450000,
      email: "r.vance@vancerefrig.net",
      status: "UNTOUCHED"
    },
    {
      id: "LD-4810",
      ownerName: "Helena Rostova",
      businessName: "Apex Logistics Carriers",
      industry: "Logistics",
      location: "Houston, TX",
      estEbitda: 980000,
      email: "h.rostova@apexcarriers.org",
      status: "UNTOUCHED"
    },
    {
      id: "LD-1102",
      ownerName: "Gene Kowalski",
      businessName: "Kowalski Precision Tooling",
      industry: "Manufacturing",
      location: "Grand Rapids, MI",
      estEbitda: 1200000,
      email: "g.kowalski@kowalskitooling.com",
      status: "UNTOUCHED"
    },
    {
      id: "LD-6631",
      ownerName: "Marcus Sterling",
      businessName: "Sterling Climate Logistics & Air Systems",
      industry: "HVAC",
      location: "Austin, TX",
      estEbitda: 610000,
      email: "m.sterling@sterlingclimate.com",
      status: "UNTOUCHED"
    },
    {
      id: "LD-7720",
      ownerName: "Devon Lane",
      businessName: "Lane Heavy Hauling Services",
      industry: "Logistics",
      location: "Atlanta, GA",
      estEbitda: 520000,
      email: "dlane@laneheavyhauling.com",
      status: "UNTOUCHED"
    },
    {
      id: "LD-3321",
      ownerName: "Patricia Wu",
      businessName: "Integrated Aerospace Components Inc.",
      industry: "Manufacturing",
      location: "Richmond, VA",
      estEbitda: 1550000,
      email: "p.wu@integratedaerospace.io",
      status: "UNTOUCHED"
    }
  ]);

  // Dynamic Template Presets
  const presets: TemplatePreset[] = [
    {
      id: "succession",
      name: "Succession & Legacy Inquiry",
      subject: "Acquisition Inquiry: Succession plans for {business_name}?",
      body: "Hi {owner_name},\n\nI’ve been tracking specialized {industry_type} providers in the {location} area, and {business_name} stood out for your operational track record.\n\nWe are looking to deploy structural capital with an SBA-backed structure to transition a legacy platform with an estimated EBITDA profile of around {ebitda_estimate}.\n\nIf you contemplated succession over the next 12-24 months, let me know when you have 10 minutes for an encrypted terminal brief.\n\nBest regards,\n[Your Name]\nAcquireMeta Sourcing Protocol"
    },
    {
      id: "quick-broker",
      name: "Proprietary Off-Market Quick Pitch",
      subject: "Partnership / Direct Buyout Strategy - {business_name}",
      body: "Hello {owner_name},\n\nMy private investment group is reviewing operators in the {industry_type} space specifically looking for solid operational bases in {location}.\n\nWe typically structure acquisitions with down payments targeting full asset protection for the principal owner. Let's arrange a 5-minute call to cross-reference our transaction requirements with {business_name}.\n\nSystem Logged,\n[Your Name]"
    },
    {
      id: "1031-exchange",
      name: "1031 Capital Relocation Offer",
      subject: "Reinvestment Allocations: Quick purchase of {business_name}",
      body: "Hi {owner_name},\n\nWe have a pool of liquid capital currently structured for reallocation into localized infrastructure within {location}.\n\nWe observed your strong presence in {industry_type} and want to initiate discussions regarding a complete enterprise sale of {business_name}.\n\nLet's map out a transition timeline.\n\nCordially,\n[Your Name]"
    }
  ];

  // Apply Selected Template Preset
  const handleSelectPreset = (id: string) => {
    const found = presets.find(p => p.id === id);
    if (found) {
      setActiveTemplateId(id);
      setSubjectText(found.subject);
      setBodyText(found.body);
      addLog(`// INJECTED TEMPLATE: [${found.name.toUpperCase()}]`);
    }
  };

  // Helper log generator
  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchInd = selectedIndustry === "ALL" || lead.industry === selectedIndustry;
      const matchReg = selectedRegion === "ALL" || lead.location.includes(selectedRegion);
      return matchInd && matchReg;
    });
  }, [leads, selectedIndustry, selectedRegion]);

  // Live Variable Compilation for first matching/selected lead
  const currentLeadPreview = filteredLeads[0] || leads[0];

  const compileTemplate = (text: string, lead: Lead) => {
    if (!lead) return text;
    return text
      .replace(/{owner_name}/g, lead.ownerName)
      .replace(/{business_name}/g, lead.businessName)
      .replace(/{industry_type}/g, lead.industry)
      .replace(/{location}/g, lead.location)
      .replace(/{ebitda_estimate}/g, new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(lead.estEbitda));
  };

  // Compiled Output Preview
  const previewSubject = compileTemplate(subjectText, currentLeadPreview);
  const previewBody = compileTemplate(bodyText, currentLeadPreview);

  // Stats Counters
  const campaignStats = useMemo(() => {
    const total = leads.length;
    const queued = leads.filter(l => l.status === "QUEUED").length;
    const sent = leads.filter(l => l.status === "SENT").length;
    const opened = leads.filter(l => l.status === "OPENED").length;
    const replied = leads.filter(l => l.status === "REPLIED").length;
    const responseRate = sent > 0 ? ((replied / sent) * 100).toFixed(1) : "0.0";
    return { total, queued, sent, opened, replied, responseRate };
  }, [leads]);

  // Terminal Auto-Scroll ref
  const terminalEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Run Programmatic Email Sequence simulation
  const startSequence = () => {
    if (isDispatching) return;
    
    // Mark matching leads as QUEUED
    setLeads(prev => prev.map(l => {
      const isTarget = selectedIndustry === "ALL" || l.industry === selectedIndustry;
      return isTarget && l.status === "UNTOUCHED" ? { ...l, status: "QUEUED" } : l;
    }));

    setIsDispatching(true);
    setDispatchProgress(0);
    addLog(`// LAUNCHING CAMPAIGN TRANSMISSION STATE`);
    addLog(`// SCANNING STACK... PREPARING DEPLOYMENT PROTOCOL`);
  };

  // Simulating the sequential dispatch cycle
  useEffect(() => {
    if (!isDispatching) return;

    const interval = setInterval(() => {
      setLeads(prev => {
        const queuedLeadIndex = prev.findIndex(l => l.status === "QUEUED");
        if (queuedLeadIndex === -1) {
          setIsDispatching(false);
          addLog(`// BATCH TRANSMISSION STACK COMPLETE. SECURE CONNECTION STANDBY.`);
          clearInterval(interval);
          return prev;
        }

        const updated = [...prev];
        const currentTarget = updated[queuedLeadIndex];
        
        // Randomly assign response statuses for simulation realistic outcomes
        const roll = Math.random();
        let finalStatus: "SENT" | "OPENED" | "REPLIED" | "BOUNCED" = "SENT";
        if (roll > 0.7) finalStatus = "REPLIED";
        else if (roll > 0.3) finalStatus = "OPENED";
        else if (roll < 0.08) finalStatus = "BOUNCED";

        updated[queuedLeadIndex] = { ...currentTarget, status: finalStatus };

        // Generate customized terminal logging output
        addLog(`DISPATCHING SMTP: Packet [${currentTarget.id}] to ${currentTarget.email}`);
        if (finalStatus === "REPLIED") {
          addLog(`>>> [INCOMING OUTREACH SIG]: ${currentTarget.ownerName} (${currentTarget.businessName}) responded with target interest!`);
        } else if (finalStatus === "BOUNCED") {
          addLog(`⚠️ [TRANSMISSION FAILURE]: SMTP Node rejection for ${currentTarget.email}`);
        } else {
          addLog(`>>> [ACK]: Packet reached target server successfully. STATUS: ${finalStatus}`);
        }

        return updated;
      });

      setDispatchProgress(prev => {
        const next = prev + (100 / Math.max(1, leads.filter(l => l.status === "QUEUED").length));
        return Math.min(next, 100);
      });

    }, 1800);

    return () => clearInterval(interval);
  }, [isDispatching, leads, selectedIndustry]);

  // Queue individual lead manually
  const toggleQueueLead = (id: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        const nextStatus = l.status === "UNTOUCHED" ? "QUEUED" : "UNTOUCHED";
        addLog(`// MANUAL TOGGLE [${l.id}]: ${nextStatus}`);
        return { ...l, status: nextStatus };
      }
      return l;
    }));
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono selection:bg-[#00FF66] selection:text-[#050505] min-h-screen flex flex-col antialiased">
      
      {/* 1. TOP SECURE SYSTEM MONITOR PANEL */}
      <header className="border-b border-[#222222] bg-[#050505] sticky top-0 z-40">
        <div className="overflow-hidden border-b border-[#222222] bg-[#0a0a0a] py-1 text-[10px] tracking-[0.2em] text-[#0EA5E9] uppercase">
          <div className="flex whitespace-nowrap justify-around animate-pulse">
            <span>[OUTREACH ENGINE ONLINE]</span>
            <span className="text-[#00FF66]">[ACTIVE PIPELINE: HVAC, LOGISTICS, MANUFACTURING]</span>
            <span>[COMPLIANT PROPRIETARY MERGER MATRIX]</span>
            <span className="text-[#FF3333]">[DO NOT COPY CODEBASE OUTSIDE TERMINAL NODES]</span>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#00FF66] animate-ping"></div>
              <span className="text-lg font-bold tracking-wider text-[#F9F9F9]">
                ACQUIRE<span className="text-[#00FF66]">META</span> // OUTREACH
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 border border-[#222222] text-[#888888] bg-[#0c0c0c] uppercase">
              NODE v1.89-ALPHA / PIPELINE DISPATCHER
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-[#888888] justify-center md:justify-end">
            <div>SMTP PORT: <span className="text-[#00FF66] font-bold">SECURE SSL [TLS 1.3]</span></div>
            <div className="border border-[#222222] px-2 py-1 bg-[#111111] text-[#F9F9F9] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] block animate-pulse"></span>
              REPLY RATE CORRIDOR: {campaignStats.responseRate}%
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN HUB INTERFACE COLLABORATIVE BENTO GRID */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: REGISTRY FILTERING & CAMPAIGN PIPELINE WATCH (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Diagnostic Metrics Matrix */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// PIPELINE METRIC STACK</span>
              <span className="text-[9px] text-[#00FF66]">[LIVE FEED]</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#050505] border border-[#222222] p-2 text-center">
                <div className="text-[9px] text-[#888888] uppercase">TOTAL</div>
                <div className="text-lg font-bold text-[#F9F9F9]">{campaignStats.total}</div>
              </div>
              <div className="bg-[#050505] border border-[#222222] p-2 text-center">
                <div className="text-[9px] text-[#888888] uppercase">QUEUED</div>
                <div className="text-lg font-bold text-[#0EA5E9]">{campaignStats.queued}</div>
              </div>
              <div className="bg-[#050505] border border-[#222222] p-2 text-center">
                <div className="text-[9px] text-[#888888] uppercase">REPLIED</div>
                <div className="text-lg font-bold text-[#00FF66]">{campaignStats.replied}</div>
              </div>
            </div>
          </div>

          {/* Sourcing Sector Controller */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// REGISTRY CLASSIFICATION</span>
              <span className="text-[9px] text-[#0EA5E9]">DIAG-99</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-[#888888] uppercase block">TARGET SECTOR MATRIX</label>
              <div className="grid grid-cols-2 gap-2">
                {(["ALL", "HVAC", "Manufacturing", "Logistics"] as const).map((ind) => (
                  <button
                    key={ind}
                    onClick={() => {
                      setSelectedIndustry(ind);
                      addLog(`// FILTER APPLIED: SECTOR [${ind}]`);
                    }}
                    className={`text-left text-xs p-2 border transition-all duration-150 uppercase flex justify-between items-center ${
                      selectedIndustry === ind
                        ? "bg-[#00FF66] text-[#050505] font-bold border-[#00FF66]"
                        : "bg-transparent text-[#F9F9F9] border-[#222222] hover:bg-[#111111] hover:text-[#00FF66] hover:border-[#00FF66]"
                    }`}
                  >
                    <span>{ind}</span>
                    <span className="text-[9px]">{selectedIndustry === ind ? "■" : "□"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] text-[#888888] uppercase block">REGIONAL FILTER</label>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  addLog(`// FILTER APPLIED: REGION [${e.target.value.toUpperCase()}]`);
                }}
                className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-2.5 uppercase font-mono tracking-wider"
              >
                <option value="ALL">ALL STATES / AREAS</option>
                <option value="PA">PENNSYLVANIA (PA)</option>
                <option value="TX">TEXAS (TX)</option>
                <option value="MI">MICHIGAN (MI)</option>
                <option value="GA">GEORGIA (GA)</option>
                <option value="VA">VIRGINIA (VA)</option>
              </select>
            </div>
          </div>

          {/* Active Target List Registry Panel */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex-grow flex flex-col space-y-3 min-h-[350px]">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs text-[#888888] uppercase tracking-wider">
                // ACTIVE TARGET SEGMENTS ({filteredLeads.length})
              </span>
              <span className="text-[10px] text-[#0EA5E9] font-semibold">CMD: STATUS</span>
            </div>

            <div className="space-y-2 flex-grow overflow-y-auto max-h-[450px] pr-1">
              {filteredLeads.length === 0 ? (
                <div className="text-center text-[#FF3333] text-xs py-12 border border-dashed border-[#FF3333]/30">
                  NO OFF-MARKET OPERATORS MATCH CRITERIA
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  let statusColor = "text-[#888888] border-[#222222]";
                  if (lead.status === "QUEUED") statusColor = "text-[#0EA5E9] border-[#0EA5E9] bg-[#0EA5E9]/5";
                  if (lead.status === "SENT") statusColor = "text-white border-white bg-white/5";
                  if (lead.status === "OPENED") statusColor = "text-yellow-400 border-yellow-400 bg-yellow-400/5";
                  if (lead.status === "REPLIED") statusColor = "text-[#00FF66] border-[#00FF66] bg-[#00FF66]/10";
                  if (lead.status === "BOUNCED") statusColor = "text-[#FF3333] border-[#FF3333] bg-[#FF3333]/5";

                  return (
                    <div 
                      key={lead.id}
                      className="border border-[#222222] bg-[#050505] p-3 space-y-2 hover:border-[#0EA5E9] transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-[#888888] block">{lead.id}</span>
                          <span className="text-xs font-bold text-[#F9F9F9] block truncate max-w-[200px]">
                            {lead.businessName}
                          </span>
                        </div>
                        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border font-semibold ${statusColor}`}>
                          {lead.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-[#888888]">
                        <span>{lead.location}</span>
                        <span className="text-[#00FF66] font-bold">
                          EBITDA: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(lead.estEbitda)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-[#222222]/50">
                        <span className="text-[9px] text-[#888888] truncate max-w-[140px]">{lead.email}</span>
                        <button
                          onClick={() => toggleQueueLead(lead.id)}
                          disabled={isDispatching}
                          className="text-[9px] border border-[#222222] px-2 py-0.5 text-[#0EA5E9] hover:border-[#00FF66] hover:text-[#00FF66] bg-[#0a0a0a] disabled:opacity-50"
                        >
                          {lead.status === "QUEUED" ? "UNQUEUE" : "QUEUE SEQ"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* MIDDLE & RIGHT COMBINED PANELS: OUTREACH ENGINE EDITOR & TERMINAL CLI (8 Cols) */}
        <section className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Preset Selector Bar */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4">
            <div className="text-xs text-[#888888] uppercase tracking-wider mb-3">
              // RECONNAISSANCE TEMPLATE FORMULAS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className={`p-3 border text-left flex flex-col justify-between transition-all ${
                    activeTemplateId === p.id
                      ? "border-[#00FF66] bg-[#050505] text-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.15)]"
                      : "border-[#222222] bg-[#0c0c0c] text-[#888888] hover:border-[#0EA5E9] hover:text-[#F9F9F9]"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">{p.name}</span>
                  <span className="text-[9px] block text-[#888888] mt-1.5 truncate">
                    {p.subject}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Template Splicer / Form Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Box: Splicer Inputs (7 Cols) */}
            <div className="lg:col-span-7 border border-[#222222] bg-[#0a0a0a] p-4 space-y-4 flex flex-col">
              <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                <span className="text-xs text-[#888888] uppercase tracking-wider">// CODE COMPOSER MATRIX</span>
                <span className="text-[9px] text-[#0EA5E9]">DYN_REPLACE: ON</span>
              </div>

              {/* Dynamic Tag Reference Guide */}
              <div className="bg-[#050505] border border-[#222222] p-2 text-[10px] text-[#888888] space-y-1">
                <span className="text-[#0EA5E9] uppercase block mb-1">Injectable Splicing Variables:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-[#222222] px-1 bg-[#111111] text-[#00FF66] font-bold">{"{owner_name}"}</span>
                  <span className="border border-[#222222] px-1 bg-[#111111] text-[#00FF66] font-bold">{"{business_name}"}</span>
                  <span className="border border-[#222222] px-1 bg-[#111111] text-[#00FF66] font-bold">{"{industry_type}"}</span>
                  <span className="border border-[#222222] px-1 bg-[#111111] text-[#00FF66] font-bold">{"{location}"}</span>
                  <span className="border border-[#222222] px-1 bg-[#111111] text-[#00FF66] font-bold">{"{ebitda_estimate}"}</span>
                </div>
              </div>

              {/* Subject Line */}
              <div className="space-y-1">
                <label className="text-[10px] text-[#888888] uppercase block">TRANSMISSION SUBJECT LINE</label>
                <input
                  type="text"
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-2.5 font-mono"
                  placeholder="Subject template..."
                />
              </div>

              {/* Body Text Editor */}
              <div className="space-y-1 flex-grow flex flex-col">
                <label className="text-[10px] text-[#888888] uppercase block">SEQUENTIAL MESSAGE TEMPLATE</label>
                <textarea
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  rows={12}
                  className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-3 font-mono flex-grow resize-none leading-relaxed"
                  placeholder="Draft your off-market campaign sequence parameters here..."
                />
              </div>
            </div>

            {/* Right Box: Compiled Telemetry Preview (5 Cols) */}
            <div className="lg:col-span-5 border border-[#222222] bg-[#0a0a0a] p-4 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-[#222222] pb-2 mb-3">
                  <span className="text-xs text-[#888888] uppercase tracking-wider">// COMPILED TELEMETRY PREVIEW</span>
                  <span className="text-[9px] text-[#00FF66]">[SECURE]</span>
                </div>

                <div className="bg-[#0c0c0c] border border-[#222222] p-2 mb-3 text-[10px]">
                  <span className="text-[#888888] block">TARGET NODE COMPILED FROM ACTIVE SELECTION:</span>
                  <span className="text-[#0EA5E9] font-bold uppercase">{currentLeadPreview?.businessName || "NONE DETECTED"}</span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed max-h-[400px] overflow-y-auto pr-1">
                  <div>
                    <span className="text-[9px] text-[#888888] uppercase block mb-1">TO IP / INBOX:</span>
                    <div className="bg-[#050505] border border-[#222222] p-2 text-[11px] text-[#888888] truncate">
                      {currentLeadPreview ? `"${currentLeadPreview.ownerName}" <${currentLeadPreview.email}>` : "[EMPTY MATRIX]"}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-[#888888] uppercase block mb-1">COMPILED SUBJECT:</span>
                    <div className="bg-[#050505] border border-[#222222] p-2 text-[11px] text-[#0EA5E9] font-bold">
                      {previewSubject || "[NO SUBJECT DECLARED]"}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-[#888888] uppercase block mb-1">COMPILED PROPOSAL DEPLOYMENT BODY:</span>
                    <div className="bg-[#050505] border border-[#222222] p-3 text-[11px] text-[#F9F9F9] whitespace-pre-wrap leading-relaxed">
                      {previewBody || "[NO BODY DECLARED]"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#222222]">
                <button
                  onClick={startSequence}
                  disabled={isDispatching || filteredLeads.filter(l => l.status === "UNTOUCHED" || l.status === "QUEUED").length === 0}
                  className="w-full text-xs text-[#050505] bg-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66] hover:shadow-[4px_4px_0px_0px_rgba(0,255,102,1)] border border-[#00FF66] font-bold py-3 transition-all duration-200 uppercase tracking-widest text-center disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isDispatching ? "DISPATCH SEQUENCE EXECUTING..." : "DEPLOY STRUCTURAL PIPELINE"}
                </button>
              </div>
            </div>

          </div>

          {/* 3. TERMINAL LOGS & SIMULATION CONSOLE (Bento Bottom-half) */}
          <div className="border border-[#222222] bg-[#050505] p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#222222] pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
                <span className="text-xs text-[#F9F9F9] font-bold uppercase tracking-wider">
                  SMTP PIPELINE DISPATCH CLI CONSOLE
                </span>
              </div>
              <div className="text-[10px] text-[#888888]">
                ACTIVE SMTP DISPATCH STATUS: {isDispatching ? "TRANSMITTING DATA" : "AWAITING USER COMMANDS"}
              </div>
            </div>

            {/* Simulated Sequence dispatch progress indicator */}
            {isDispatching && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-[#0EA5E9]">
                  <span>CONCENTRIC BATCH DISPATCH PERCENTAGE:</span>
                  <span>{Math.round(dispatchProgress)}% COMPLETE</span>
                </div>
                <div className="w-full bg-[#111111] h-1.5 border border-[#222222]">
                  <div className="h-full bg-[#00FF66] transition-all duration-300" style={{ width: `${dispatchProgress}%` }}></div>
                </div>
              </div>
            )}

            {/* Custom Terminal CLI Logs box */}
            <div className="bg-[#0a0a0a] border border-[#222222] p-4 h-48 overflow-y-auto font-mono text-xs space-y-1.5">
              {terminalLogs.map((log, index) => {
                let textClass = "text-[#888888]";
                if (log.includes(">>>")) textClass = "text-[#00FF66]";
                if (log.includes("SYSTEM")) textClass = "text-[#0EA5E9] font-semibold";
                if (log.includes("⚠️") || log.includes("FAILURE")) textClass = "text-[#FF3333]";

                return (
                  <div key={index} className={`${textClass} leading-relaxed`}>
                    {log}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* Trigger simulation controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center text-[10px] text-[#888888] pt-2">
              <div>
                *Note: Dispatch sequences execute simulated programmatic actions corresponding with FINCEN regulatory boundaries.
              </div>
              <button
                onClick={() => {
                  setLeads(prev => prev.map(l => ({ ...l, status: "UNTOUCHED" })));
                  setTerminalLogs([
                    "// STATE CONSOLE CLEARED: PIPELINE RESTORED TO BASE CONFIGURATION",
                    "// READY TO DISPATCH SECURE PROTOCOLS"
                  ]);
                  addLog("SYSTEM TRANSMISSION PROTOCOLS RESET SUCCESSFUL");
                }}
                className="border border-[#FF3333] text-[#FF3333] hover:bg-[#FF3333] hover:text-[#050505] px-3 py-1.5 transition-colors duration-150 uppercase"
              >
                Reset Pipeline State
              </button>
            </div>
          </div>

        </section>
      </main>

      {/* 4. COMPLIANCE & ACCREDITATION FOOTER */}
      <footer className="border-t border-[#222222] bg-[#030303] mt-12 py-8 px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-[#222222]">
            <div className="text-xs tracking-[0.2em] text-[#888888] uppercase font-mono">
              SECURE SMTP & CAMPAIGN DISPATCH INFRASTRUCTURE
            </div>
            <div className="flex flex-wrap gap-4 text-[10px] text-[#888888]">
              <span className="border border-[#222222] px-3 py-2 bg-[#111111]">
                CAN-SPAM COMPLIANCE INTEGRATION
              </span>
              <span className="border border-[#222222] px-3 py-2 bg-[#111111]">
                DKIM & SPF VERIFICATION LOGGED
              </span>
              <span className="border border-[#222222] px-3 py-2 bg-[#111111]">
                AES-256 COLD DISPATCH SYNDICATE
              </span>
            </div>
          </div>

          <div className="text-[10px] text-[#888888] leading-relaxed max-w-7xl space-y-3 font-mono">
            <p className="uppercase tracking-wider text-[#F9F9F9]">// COMPLIANCE DISCLAIMER & OUTREACH STATEMENT</p>
            <p>
              Underground outreach mechanics map simulated pipeline templates against proprietary, blinded contact registries for off-market validation. Any active transmission generated within this module runs via safe routing servers configured using test parameters.
            </p>
            <p>
              Searchers assume total responsibility for compliance with domestic regulations including but not limited to the CAN-SPAM Act of 2003, localized privacy ordinances, and industrial trade registry parameters. AcquireMeta provides the command framework strictly for structural transaction modeling.
            </p>
            <div className="flex justify-between items-center text-[9px] text-[#888888] pt-4">
              <span>© 2026 ACQUIRE_META GLOBAL LTD. OUTREACH ARCHITECTURE INC.</span>
              <span>NODE OUTLET: 994-VA</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
```