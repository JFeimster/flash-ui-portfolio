"use client";

import React, { useState, useEffect } from "react";

// Mock database of high-probability off-market business targets (sourced via county registry & municipal datasets)
const INITIAL_PROSPECTS = [
  {
    id: "prospect-1",
    company: "Atlanta Precision Grinding Inc.",
    owner: "Marcus Vance",
    established: 1994,
    tenure: 30,
    employees: 18,
    estimatedRevenue: "$2.8M - $3.4M",
    estimatedEbitda: "$650,000",
    county: "Gwinnett County, GA",
    sector: "Machining & Tooling",
    phone: "(770) 555-0142",
    address: "1408 Industrial Pkwy, Norcross, GA",
    likelihoodScore: 94, // Selling likelihood
    outreachHistory: 0,
    flagged: false,
  },
  {
    id: "prospect-2",
    company: "Vanguard Hydronics & Boiler Co.",
    owner: "Arthur Pendelton",
    established: 1989,
    tenure: 35,
    employees: 24,
    estimatedRevenue: "$4.1M - $4.9M",
    estimatedEbitda: "$920,000",
    county: "Fairfax County, VA",
    sector: "HVAC & Mechanical",
    phone: "(703) 555-0198",
    address: "812 Terminal Rd, Lorton, VA",
    likelihoodScore: 89,
    outreachHistory: 1,
    flagged: false,
  },
  {
    id: "prospect-3",
    company: "North Star Specialty Glass LLC",
    owner: "Elena Rostova",
    established: 2003,
    tenure: 21,
    employees: 12,
    estimatedRevenue: "$1.5M - $2.0M",
    estimatedEbitda: "$380,000",
    county: "Cook County, IL",
    sector: "Specialty Subcontractor",
    phone: "(312) 555-0129",
    address: "2204 N Western Ave, Chicago, IL",
    likelihoodScore: 82,
    outreachHistory: 0,
    flagged: false,
  },
  {
    id: "prospect-4",
    company: "Apex Container & Pallet Logistix",
    owner: "Gary Thompson",
    established: 1998,
    tenure: 26,
    employees: 31,
    estimatedRevenue: "$5.8M - $6.5M",
    estimatedEbitda: "$1,120,000",
    county: "Harris County, TX",
    sector: "Logistics & Freight",
    phone: "(713) 555-0177",
    address: "10500 Port Rd, Houston, TX",
    likelihoodScore: 78,
    outreachHistory: 3,
    flagged: false,
  },
  {
    id: "prospect-5",
    company: "Metro Route Sanitation Systems",
    owner: "Harold 'Skip' Miller",
    established: 1991,
    tenure: 33,
    employees: 15,
    estimatedRevenue: "$2.2M - $2.6M",
    estimatedEbitda: "$510,000",
    county: "Gwinnett County, GA",
    sector: "Waste & Sanitation",
    phone: "(678) 555-0115",
    address: "330 Old Peachtree Rd, Suwanee, GA",
    likelihoodScore: 91,
    outreachHistory: 0,
    flagged: false,
  },
  {
    id: "prospect-6",
    company: "Desert Valley Mechanical & Piping",
    owner: "Roger K. Vance",
    established: 1995,
    tenure: 29,
    employees: 29,
    estimatedRevenue: "$4.5M - $5.2M",
    estimatedEbitda: "$1,050,000",
    county: "Maricopa County, AZ",
    sector: "HVAC & Mechanical",
    phone: "(602) 555-0204",
    address: "4110 S 16th St, Phoenix, AZ",
    likelihoodScore: 85,
    outreachHistory: 1,
    flagged: false,
  },
];

const SECTORS = ["ALL", "Machining & Tooling", "HVAC & Mechanical", "Specialty Subcontractor", "Logistics & Freight", "Waste & Sanitation"];
const COUNTIES = ["ALL", "Gwinnett County, GA", "Fairfax County, VA", "Cook County, IL", "Harris County, TX", "Maricopa County, AZ"];

export default function OriginationTerminal() {
  const [prospects, setProspects] = useState(INITIAL_PROSPECTS);
  const [selectedSector, setSelectedSector] = useState("ALL");
  const [selectedCounty, setSelectedCounty] = useState("ALL");
  const [minTenure, setMinTenure] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sourcing list selected for sequence dispatch
  const [selectedProspectIds, setSelectedProspectIds] = useState<string[]>([]);
  const [activeTemplateType, setActiveTemplateType] = useState<"direct_mail" | "cold_email" | "phone_script">("direct_mail");
  
  // Customization variables
  const [customBrokerCode, setCustomBrokerCode] = useState("ETA-7922");
  const [buyerCapGroup, setBuyerCapGroup] = useState("Acquisition Advisory Partners");
  const [leadSourceType, setLeadSourceType] = useState("direct");

  // Terminal stats
  const [currentTime, setCurrentTime] = useState("12:00:00");
  const [isCompiling, setIsCompiling] = useState(false);
  const [progressLog, setProgressLog] = useState<string[]>([]);

  // Selected single preview prospect
  const [previewProspect, setPreviewProspect] = useState<typeof INITIAL_PROSPECTS[0] | null>(INITIAL_PROSPECTS[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(" ")[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter prospects
  const filteredProspects = prospects.filter((p) => {
    const matchesSector = selectedSector === "ALL" || p.sector === selectedSector;
    const matchesCounty = selectedCounty === "ALL" || p.county === selectedCounty;
    const matchesTenure = p.tenure >= minTenure;
    const matchesSearch =
      searchQuery === "" ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.county.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSector && matchesCounty && matchesTenure && matchesSearch;
  });

  // Toggle list selection
  const handleToggleSelectProspect = (id: string) => {
    if (selectedProspectIds.includes(id)) {
      setSelectedProspectIds(selectedProspectIds.filter((item) => item !== id));
    } else {
      setSelectedProspectIds([...selectedProspectIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProspectIds.length === filteredProspects.length) {
      setSelectedProspectIds([]);
    } else {
      setSelectedProspectIds(filteredProspects.map((p) => p.id));
    }
  };

  // Compile Sourcing Run (Simulated visual loading)
  const triggerSourcingRun = () => {
    setIsCompiling(true);
    setProgressLog([]);
    const steps = [
      "Connecting to county assessor database systems...",
      "Analyzing business licensing renewal files...",
      "Filtering active records of private entities with > 20 years corporate tenure...",
      "Parsing estimated EBITDA thresholds based on industry employee ratios...",
      "Origination complete. Target metrics successfully projected.",
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setProgressLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (index === steps.length - 1) {
          setIsCompiling(false);
        }
      }, (index + 1) * 600);
    });
  };

  // Get active outreach templates with variables interpolated
  const getOutreachTemplate = (p: typeof INITIAL_PROSPECTS[0]) => {
    if (!p) return { subject: "", body: "" };

    switch (activeTemplateType) {
      case "cold_email":
        return {
          subject: `Acquisition Inquiry / Confidential Interest: ${p.company}`,
          body: `Dear ${p.owner},\n\nI hope this brief note finds you well. I represent ${buyerCapGroup}, a private enterprise group actively seeking to invest in or acquire high-quality ${p.sector} firms within ${p.county}.\n\nWe tracked corporate registrations and noted your robust multi-decade tenure. We are cash-backed, have pre-arranged debt channels to execute transactions with zero disruption, and are seeking a direct, confidential principal-to-principal dialogue.\n\nWe are not cold-calling brokers. Would you be open to a strictly private, 10-minute briefing next Tuesday to discuss succession options?\n\nSincerely,\nPrincipal Officer\nRef ID: ${customBrokerCode}`,
        };
      case "phone_script":
        return {
          subject: `Outbound Verification Blueprint`,
          body: `[SPOKEN SCRIPT - COLD INITIATION]\n\n"Hello ${p.owner}, this is direct representation calling on behalf of ${buyerCapGroup}.\n\nWe specialize in structural acquisitions of industrial systems in ${p.county}. We’ve flagged ${p.company} as a premier asset matching our local service expansion.\n\nWe are prepared to present a non-binding letter of intent (LOI) to acquire the business under seller-friendly conditions. Can we schedule an off-site lunch meeting next week to align parameters, or should I coordinate with your corporate legal entity directly?"`,
        };
      case "direct_mail":
      default:
        return {
          subject: `DIRECT MAIL SEQUENCE - HIGH RESOLUTION ENVELOPE`,
          body: `CONFIDENTIAL CORRESPONDENCE FOR: ${p.owner.toUpperCase()}\nPHYSICAL ADDRESS: ${p.address}\n\nRE: PRIVATE INTEREST IN ${p.company.toUpperCase()}\n\nDear ${p.owner},\n\nI am writing to you directly from ${buyerCapGroup}. We operate structured capital reserves targeting private acquisitions specifically within the ${p.sector} space.\n\nOur records specify that you have steered ${p.company} successfully for ${p.tenure} consecutive years. We seek to act as the next long-term steward of your company, preserving your legacy, brand, and workforce while engineering a clean liquidity exit for you.\n\nPROPOSAL HIGHLIGHTS:\n- 100% Cash at Close capabilities (non-reliant on traditional lengthy bank underwriting)\n- Highly flexible transitional phase-out structures (6 to 24 month transition support)\n- Preservation of local operating presence in ${p.county}\n\nPlease contact our dedicated terminal secure desk at ${p.phone} or email operator direct at info@acquire-terminal.net.\n\nSecured Operator Reference: #${customBrokerCode}`,
        };
    }
  };

  const previewText = previewProspect ? getOutreachTemplate(previewProspect) : { subject: "", body: "" };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] min-h-screen flex flex-col font-sans select-none">
      
      {/* GLOBAL ZERO-RADIUS INJECTOR */}
      <style dangerouslySetInnerHTML={{__html: `* { border-radius: 0px !important; }` }} />

      {/* 1. STATUS HEADER */}
      <header className="w-full bg-black border-b border-[#222] sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#111] text-[10px] font-mono tracking-widest text-[#888]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-[#00FF66] font-semibold">
              <span className="inline-block w-2 h-2 mr-2 bg-[#00FF66] animate-pulse"></span>
              PROACTIVE ORIGINATION CONSOLE: SECURED
            </span>
            <span className="hidden md:inline text-[#222]">|</span>
            <span className="hidden md:inline">DESKTOP ENGINE: ACTIVE</span>
            <span className="hidden md:inline text-[#222]">|</span>
            <span className="hidden md:inline">SYSTEM: SECTOR-1031 COMPLIANT</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>SYS CLOCK: <span className="text-white">{currentTime}</span></span>
            <span className="text-[#0EA5E9]">OP ID: #{customBrokerCode}</span>
          </div>
        </div>

        {/* Brand Banner */}
        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#050505] via-[#0c0c0c] to-[#050505]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#0EA5E9] text-black text-[10px] font-mono font-black px-1.5 py-0.5 tracking-tighter">OFF-MARKET ENGINE</span>
              <span className="text-[10px] font-mono text-[#00FF66] tracking-widest font-bold">ALPHA V3.1</span>
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
              PROPRIETARY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F9F9] via-[#0EA5E9] to-[#00FF66]">DEAL SOURCING</span> TERMINAL
            </h1>
            <p class="text-xs text-[#888] font-mono mt-0.5">Automated county Assessor & licensing extraction pipeline. Target business owners directly.</p>
          </div>

          {/* Core Pipeline Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#222] w-full md:w-auto text-left font-mono text-xs">
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div class="text-[9px] text-[#888]">TOTAL IN SYSTEM</div>
              <div className="font-bold text-[#F9F9F9]">4,821 Leads</div>
            </div>
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div class="text-[9px] text-[#888]">TARGETS IDENTIFIED</div>
              <div className="font-bold text-[#00FF66]" x-text="filteredProspects.length">{filteredProspects.length} Units</div>
            </div>
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div class="text-[9px] text-[#888]">SELECTED DISPATCH</div>
              <div className="font-bold text-[#0EA5E9]">{selectedProspectIds.length} Selected</div>
            </div>
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div class="text-[9px] text-[#888]">AVG ACQ. MULTIPLE</div>
              <div className="font-bold text-[#FF3333]">2.8x - 3.2x</div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#222]">
        
        {/* 2. LEFT RAIL: PARAMETERS & FILTERS */}
        <aside className="lg:col-span-3 bg-[#080808] border-r border-[#222] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
                EXTRACTION FILTERS
              </h2>
              <button 
                onClick={() => {
                  setSelectedSector("ALL");
                  setSelectedCounty("ALL");
                  setMinTenure(20);
                  setSearchQuery("");
                }} 
                className="font-mono text-[9px] text-[#FF3333] hover:underline uppercase tracking-widest"
              >
                RESET FILTERS
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Prospect Keyword / Owner</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Vance, Atlanta, HVAC..."
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] focus:ring-0 text-xs font-mono text-white p-3 pr-8 placeholder:text-[#444] outline-none transition-all"
                />
              </div>
            </div>

            {/* Sector Selector */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Target Sector Group</label>
              <div className="space-y-1">
                {SECTORS.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={`w-full flex items-center justify-between p-2.5 font-mono text-[11px] border tracking-wider transition-all text-left ${
                      selectedSector === sector 
                        ? "bg-[#0EA5E9]/10 border-[#0EA5E9] text-[#0EA5E9] font-bold" 
                        : "bg-[#050505] border-[#222] text-[#888] hover:border-[#444] hover:text-[#F9F9F9]"
                    }`}
                  >
                    <span>{sector}</span>
                    <span className="text-[9px]">{selectedSector === sector ? "[ACTIVE]" : "[+]"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target County Registry Selector */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">County Registry Jurisdiction</label>
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-[#F9F9F9] p-3 focus:outline-none transition-all"
              >
                {COUNTIES.map((county) => (
                  <option key={county} value={county}>{county === "ALL" ? "All Counties" : county}</option>
                ))}
              </select>
            </div>

            {/* Minimum Corporate Tenure */}
            <div className="space-y-3 bg-[#0a0a0a] p-3 border border-[#222]">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[10px] text-[#888] tracking-widest uppercase">Min Owner Tenure</label>
                <span className="font-mono text-xs text-[#00FF66] font-bold">{minTenure} Years</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                step="1" 
                value={minTenure}
                onChange={(e) => setMinTenure(parseInt(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-neutral-600">
                <span>5 Years (Low probability)</span>
                <span>40 Years (Ultra transition candidate)</span>
              </div>
            </div>

            {/* Campaign Sender Settings */}
            <div className="space-y-4 bg-black p-4 border border-[#222] text-xs font-mono">
              <span className="text-[9px] text-[#0EA5E9] font-bold tracking-widest block border-b border-[#222] pb-1.5 uppercase">
                CAMPAIGN SENDING PROFILE
              </span>
              <div className="space-y-2">
                <div>
                  <label className="text-[9px] text-[#888]">REPRESENTING ACQUISITION GROUP</label>
                  <input
                    type="text"
                    value={buyerCapGroup}
                    onChange={(e) => setBuyerCapGroup(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222] text-xs p-2 text-white outline-none mt-1 focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-[#888]">SECURED RECIPIENT AGENT KEY</label>
                  <input
                    type="text"
                    value={customBrokerCode}
                    onChange={(e) => setCustomBrokerCode(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222] text-xs p-2 text-white outline-none mt-1 focus:border-[#0EA5E9]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Compile Sourcing Run Terminal trigger */}
          <div className="pt-4 border-t border-[#1a1a1a] space-y-2">
            <button
              onClick={triggerSourcingRun}
              className="w-full bg-[#00FF66] text-black text-xs font-mono font-bold tracking-widest uppercase py-3 hover:bg-[#F9F9F9] transition-all"
            >
              RUN SOURCING PIPELINE
            </button>
            <p className="text-[9px] text-[#888] font-mono leading-normal text-center">
              Compiles public assessor databases with private data APIs.
            </p>
          </div>
        </aside>

        {/* 3. CENTER COLUMN: PROSPECT STREAM */}
        <section className="lg:col-span-5 bg-[#050505] border-r border-[#222] p-6 flex flex-col space-y-6 overflow-y-auto max-h-[85vh]">
          
          <div className="flex justify-between items-center border-b border-[#222] pb-4">
            <div>
              <h2 className="font-mono text-sm font-bold text-[#F9F9F9] tracking-tight">CONFIDENTIAL OFF-MARKET TARGETS</h2>
              <p className="text-xs text-[#888] font-mono">Unlisted businesses with high succession profile</p>
            </div>
            <button
              onClick={handleSelectAll}
              className="text-[10px] font-mono border border-[#333] px-2 py-1 bg-black text-[#888] hover:text-white"
            >
              {selectedProspectIds.length === filteredProspects.length ? "DESELECT ALL" : "SELECT ALL FILTERED"}
            </button>
          </div>

          {/* Sourcing compiling monitor simulation */}
          {isCompiling && (
            <div className="bg-[#0c0c0c] border border-[#0ea5e9]/50 p-4 font-mono text-[10px] text-left space-y-1">
              <span className="text-[#0ea5e9] font-bold block animate-pulse">[PROCESSING SOURCING QUEUE]</span>
              {progressLog.map((log, index) => (
                <div key={index} className="text-[#888]">{log}</div>
              ))}
            </div>
          )}

          {/* Prospect List */}
          <div className="space-y-4">
            {filteredProspects.length > 0 ? (
              filteredProspects.map((p) => {
                const isSelected = selectedProspectIds.includes(p.id);
                const isCurrentPreview = previewProspect?.id === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setPreviewProspect(p)}
                    className={`border p-4 transition-all relative cursor-pointer flex flex-col justify-between ${
                      isCurrentPreview 
                        ? "bg-[#0ea5e9]/5 border-[#0ea5e9] glow-teal" 
                        : "bg-[#080808] border-[#222] hover:border-[#444]"
                    }`}
                  >
                    {/* Top Meta info */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-mono px-2 py-0.5 bg-[#111] text-[#0EA5E9] border border-[#222]">
                            {p.sector}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-red-950/20 text-[#FF3333] border border-red-900/40">
                            LIKELIHOOD: {p.likelihoodScore}%
                          </span>
                        </div>
                        <h3 className="font-mono text-sm font-bold text-white tracking-tight mt-1.5 hover:text-[#00FF66]">
                          {p.company}
                        </h3>
                        <p className="text-[11px] font-mono text-[#888]">
                          Owner: <span className="text-white">{p.owner}</span> | Tenure: <span className="text-[#00FF66] font-bold">{p.tenure} Years</span>
                        </p>
                      </div>

                      {/* Select Checkbox Indicator */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelectProspect(p.id);
                        }}
                        className={`w-5 h-5 border font-mono text-[9px] font-bold flex items-center justify-center transition-all ${
                          isSelected 
                            ? "border-[#00FF66] bg-[#00FF66]/20 text-[#00FF66]" 
                            : "border-[#333] bg-[#050505] text-[#444] hover:border-[#555]"
                        }`}
                      >
                        {isSelected ? "X" : ""}
                      </button>
                    </div>

                    {/* Target Quick Stats grid */}
                    <div className="grid grid-cols-3 gap-px bg-[#222] border border-[#222] font-mono text-center text-[10px] mt-4">
                      <div className="bg-black py-1.5 text-[#888]">
                        REV: <span className="text-white font-semibold">{p.estimatedRevenue.split(" ")[0]}</span>
                      </div>
                      <div className="bg-black py-1.5 text-[#888]">
                        EST. EBITDA: <span className="text-[#00FF66] font-semibold">{p.estimatedEbitda}</span>
                      </div>
                      <div className="bg-black py-1.5 text-[#888]">
                        EMPLOYEES: <span className="text-[#0ea5e9] font-semibold">{p.employees}</span>
                      </div>
                    </div>

                    {/* Bottom jurisdiction line */}
                    <div className="flex justify-between items-center mt-3 text-[9px] font-mono text-[#555]">
                      <span>REGISTRY: {p.county.toUpperCase()}</span>
                      <span className="text-white/40">PREVIEW SCRIPT &rarr;</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="border border-dashed border-[#222] p-12 text-center font-mono">
                <span className="text-[#FF3333] text-xs font-bold block">NO MATCHING TARGETS</span>
                <p className="text-[11px] text-[#888] mt-2">Modify the parameters or select "All Counties" to unlock additional prospects.</p>
              </div>
            )}
          </div>
        </section>

        {/* 4. RIGHT COLUMN: MULTI-CHANNEL OUTREACH DESK */}
        <section className="lg:col-span-4 bg-[#050505] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            <div className="border-b border-[#222] pb-4">
              <span className="bg-[#00FF66] text-black text-[9px] font-mono font-bold px-1.5 py-0.5 tracking-tighter">OUTREACH DESK</span>
              <h2 className="font-mono text-sm font-bold text-[#F9F9F9] tracking-tight mt-1">
                CAMPAIGN GENERATOR & SEQUENCE BUILDER
              </h2>
              <p className="text-xs text-[#888] font-mono">Deploy multi-channel sequences to selected unlisted owners.</p>
            </div>

            {/* Selected Prospect Detail Header */}
            {previewProspect ? (
              <div className="p-4 bg-[#080808] border border-[#222] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#888]">ACTIVE OUTREACH FOCUS</span>
                  <span className="text-[10px] font-mono text-[#0ea5e9] font-bold" x-text="previewProspect.id">
                    ID: {previewProspect.id.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-mono text-sm font-bold text-white">{previewProspect.company}</h4>
                  <p className="text-[11px] font-mono text-[#888] mt-0.5">
                    Registered to <span className="text-white font-semibold">{previewProspect.owner}</span> since {previewProspect.established}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="bg-black p-2 border border-[#222]">
                    <div className="text-[#888]">JURISDICTION</div>
                    <div className="text-white mt-0.5">{previewProspect.county}</div>
                  </div>
                  <div className="bg-black p-2 border border-[#222]">
                    <div className="text-[#888]">SECURED DESK TEL</div>
                    <div className="text-[#00FF66] mt-0.5">{previewProspect.phone}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#080808] border border-[#222] text-center text-xs font-mono text-[#888]">
                Select any prospect from the stream to generate outreach.
              </div>
            )}

            {/* Template Selector Channel Tabs */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Select Campaign Channel</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setActiveTemplateType("direct_mail")}
                  className={`py-2 px-1 font-mono text-[10px] border tracking-wider transition-all uppercase ${
                    activeTemplateType === "direct_mail"
                      ? "bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] font-bold"
                      : "bg-[#050505] border-[#222] text-[#888] hover:border-[#444]"
                  }`}
                >
                  [1] DIRECT MAIL
                </button>
                <button
                  onClick={() => setActiveTemplateType("cold_email")}
                  className={`py-2 px-1 font-mono text-[10px] border tracking-wider transition-all uppercase ${
                    activeTemplateType === "cold_email"
                      ? "bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] font-bold"
                      : "bg-[#050505] border-[#222] text-[#888] hover:border-[#444]"
                  }`}
                >
                  [2] COLD EMAIL
                </button>
                <button
                  onClick={() => setActiveTemplateType("phone_script")}
                  className={`py-2 px-1 font-mono text-[10px] border tracking-wider transition-all uppercase ${
                    activeTemplateType === "phone_script"
                      ? "bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] font-bold"
                      : "bg-[#050505] border-[#222] text-[#888] hover:border-[#444]"
                  }`}
                >
                  [3] CALL SCRIPT
                </button>
              </div>
            </div>

            {/* Generated Template Preview Pane */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#888]">
                <span>CONFIDENTIAL TEMPLATE PREVIEW</span>
                <span className="text-[#00FF66] font-bold">PRE-COMPILING ON-THE-FLY</span>
              </div>
              <div className="bg-black border border-[#222] p-4 text-xs font-mono text-[#F9F9F9] space-y-4">
                <div className="border-b border-[#222] pb-2">
                  <span className="text-[#888] text-[9px] block">SUBJECT / REFERENCE HEADER:</span>
                  <span className="text-[#0ea5e9] font-semibold">{previewText.subject}</span>
                </div>
                <div>
                  <span className="text-[#888] text-[9px] block mb-1">LETTER BODY:</span>
                  <pre className="whitespace-pre-wrap leading-relaxed text-[11px] text-[#F9F9F9]/90 max-h-[180px] overflow-y-auto pr-2">
                    {previewText.body}
                  </pre>
                </div>
              </div>
            </div>

            {/* Variable Mapping indicators */}
            <div className="bg-[#0c0c0c] border border-[#222] p-3 flex flex-wrap gap-2 items-center justify-between text-[9px] font-mono text-[#888]">
              <span>ACTIVE INJECTION CODES:</span>
              <div className="flex gap-1.5 flex-wrap">
                <span className="bg-[#111] px-1.5 py-0.5 text-white border border-[#222]">Owner_Name</span>
                <span className="bg-[#111] px-1.5 py-0.5 text-white border border-[#222]">Company_Name</span>
                <span className="bg-[#111] px-1.5 py-0.5 text-white border border-[#222]">Tenure</span>
                <span className="bg-[#111] px-1.5 py-0.5 text-[#00FF66] border border-[#222]">Agent_Ref</span>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="space-y-3 pt-6 border-t border-[#1a1a1a]">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#888]">TARGET RECIPIENTS:</span>
              <span className="text-[#0ea5e9] font-bold">{selectedProspectIds.length} PROSPECTS READY</span>
            </div>
            
            <button
              onClick={() => {
                if (selectedProspectIds.length === 0) {
                  alert("ERROR: Please select at least one prospect to queue sequence.");
                  return;
                }
                alert(`SUCCESS: Queued ${selectedProspectIds.length} outreach sequences for dispatch via SHA-256 secure channel. Reference ID: ${customBrokerCode}`);
              }}
              className="w-full bg-[#0EA5E9] hover:bg-[#00FF66] hover:text-black py-4 font-mono text-xs font-bold text-center tracking-widest uppercase transition-all"
            >
              LAUNCH OUTREACH SEQUENCE ({selectedProspectIds.length})
            </button>
            
            <div className="flex justify-between items-center text-[9px] font-mono text-[#555]">
              <span>OUTBOUND GATEWAY: TWILIO/PLAID API</span>
              <span className="underline hover:text-white cursor-pointer" onClick={() => alert("Downloading formatted CSV...")}>
                EXPORT SEQUENCE CSV
              </span>
            </div>
          </div>
        </section>

      </main>

      {/* 5. LEGAL COMPLIANCE & VERIFICATION FOOTER */}
      <footer className="bg-black border-t border-[#222] mt-auto">
        
        {/* Verification badges */}
        <div className="px-6 py-4 border-b border-[#222] grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66]"></span>
            <span>SECURE MAIL-ROOM INTEGRATED</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#0EA5E9]"></span>
            <span>CAN-SPAM ACT COMPLIANT</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-white"></span>
            <span>REAL-TIME DEEDS ACCESSED</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#FF3333]"></span>
            <span>PROPRIETARY SCORE MODEL v3.1</span>
          </div>
        </div>

        {/* Legal Disclaimer block */}
        <div className="max-w-7xl mx-auto px-6 py-8 text-[11px] font-mono text-[#888] leading-relaxed space-y-4">
          <p>
            <span className="text-[#F9F9F9] font-bold">Disclaimer:</span> Sourcing logs, company metrics, ownership records, and simulated contact frameworks are generated using local county assessment filings and high-probability marketing models. Sourced records are intended purely for search fund exploration, broker inquiries, and micro-PE origination. All outreach campaigns compiled through this system must adhere to state legislation, CAN-SPAM direct-mail compliance protocols, and proper corporate representation practices.
          </p>
          <div className="flex justify-between items-center text-[9px] text-neutral-600 border-t border-[#111] pt-4">
            <span>&copy; {new Date().getFullYear()} ACQUIRE-NET TERMINAL LLC. SYSTEM DESIGN RECORDED.</span>
            <span className="hover:underline cursor-pointer hover:text-white">OUTBOUND ENGINE LOG v1.99</span>
          </div>
        </div>
      </footer>
    </div>
  );
}