"use client";

import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// TYPES & MOCK DATA DEFINITIONS
// ==========================================

interface Template {
  id: string;
  name: string;
  tone: string;
  subject: string;
  body: string;
}

interface Campaign {
  id: string;
  name: string;
  sector: string;
  region: string;
  volume: number;
  responseRate: number;
  replies: number;
  status: 'ACTIVE' | 'QUEUED' | 'PAUSED' | 'COMPLETED';
  dateCreated: string;
}

const OUTBOUND_TEMPLATES: Template[] = [
  {
    id: "succession-direct",
    name: "The Safe Succession Offer",
    tone: "Legacy Preservation & High Trust",
    subject: "Proprietary Interest: Securing the Future of [Company_Name]",
    body: "Dear [Owner_Last_Name],\n\nMy name is [Buyer_Name], and I am a direct, unfunded searcher focusing entirely on [Target_Sector] platforms in [Target_Region]. Unlike institutional private equity firms, my objective is to personally step in, operating your business daily and safeguarding the legacy you've spent decades building.\n\nWe have analyzed the business profile of [Company_Name] and believe your operational standards represent an exceptional fit. We are prepared to structure an acquisition utilizing a significant seller-favorable equity structure, including immediate cash injection and structured transition security.\n\nI would welcome a confidential, 10-minute introductory phone call next Tuesday at 2:00 PM EST to explore your timeline. No brokers, no public listings—just a direct owner-to-owner conversation.\n\nRespectfully,\n\n[Buyer_Name]\nAcquireMeta Syndicate Platform"
  },
  {
    id: "digital-modernization",
    name: "The Digital Modernization Appeal",
    tone: "Growth & Optimization Post-Acquisition",
    subject: "Growth Capital & Acquisition Partnership — [Company_Name]",
    body: "Dear [Owner_Last_Name],\n\nI hope this direct line finds you well. I run an private investment group focused on modernizing legacy [Target_Sector] services throughout [Target_Region]. \n\nWe specialize in taking strong, reputation-driven operations like [Company_Name] and injecting modern workflow automation, digital customer acquisition channels, and capital backing to scale performance. We are looking to acquire one flagship platform this quarter where the owner is looking to either transition out completely or stay on in a well-capitalized leadership capacity.\n\nOur structures are flexible, leveraging SBA 7(a) ready capitalization to ensure clean, fast closings with minimal disruption to your local crew. \n\nAre you open to a brief, confidential consultation regarding your long-term transition options?\n\nSincerely,\n\n[Buyer_Name]\nManaging Partner, AcquireMeta Outbound"
  },
  {
    id: "fast-rollup",
    name: "The Unlisted Cash Offer Protocol",
    tone: "Speed, Aggression & Clean Exit",
    subject: "Unlisted Acquisition Inquiry: [Target_Sector] / [Target_Region]",
    body: "Owner of [Company_Name],\n\nWe represent a pool of qualified capital actively deployment-ready for off-market [Target_Sector] platforms in [Target_Region] with verified EBITDA between $400k and $1.5M.\n\nWe bypassed commercial broker networks to target your business directly. Because we are looking to deploy capital before next quarter, we are offering highly streamlined due diligence timelines (under 30 days) and standard cash-at-close structures for founders who prefer to skip the lengthy listing process.\n\nIf you have considered a strategic exit within the next 6 to 12 months, let's schedule an immediate call to exchange terms. All discussions are protected under secure multi-party NDAs.\n\nRegards,\n\n[Buyer_Name]\nAcquisition Desk // ACQUIREMETA"
  }
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-001",
    name: "Project Sunbelt HVAC",
    sector: "Home Services / HVAC",
    region: "Southeast Coast",
    volume: 450,
    responseRate: 4.8,
    replies: 22,
    status: "ACTIVE",
    dateCreated: "2026-02-14"
  },
  {
    id: "camp-002",
    name: "Midwest Component Machining",
    sector: "Precision Manufacturing",
    region: "Great Lakes Region",
    volume: 180,
    responseRate: 6.1,
    replies: 11,
    status: "ACTIVE",
    dateCreated: "2026-02-10"
  },
  {
    id: "camp-003",
    name: "Appalachian Roofing & Fleet",
    sector: "Logistics & Transport",
    region: "Mid-Atlantic Corridor",
    volume: 320,
    responseRate: 3.4,
    replies: 11,
    status: "PAUSED",
    dateCreated: "2026-01-28"
  }
];

// ==========================================
// CORE REACT COMPONENT
// ==========================================

export default function CampaignsPage() {
  // 1. STATE VARIABLES
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [selectedSector, setSelectedSector] = useState<string>("SaaS");
  const [selectedRegion, setSelectedRegion] = useState<string>("Midwest Territory");
  const [targetVolume, setTargetVolume] = useState<number>(350);
  const [outreachType, setOutreachType] = useState<'letter' | 'multi' | 'premium'>('letter');
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("succession-direct");
  const [customSubject, setCustomSubject] = useState<string>("");
  const [customBody, setCustomBody] = useState<string>("");
  const [buyerName, setBuyerName] = useState<string>("Alex Mercer");
  
  // Terminal Logs State
  const [logs, setLogs] = useState<string[]>([
    "SYSTEM READY // WAITING FOR PARMS DEPLOYMENT...",
    "SECURE OUTBOUND PORT FORWARD ACTIVE ON PORT-8092"
  ]);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStep, setDeploymentStep] = useState<number>(0);

  // 2. RETRIEVE CURRENT TEMPLATE & HANDLE CUSTOMIZATIONS
  const currentTemplate = useMemo(() => {
    return OUTBOUND_TEMPLATES.find(t => t.id === selectedTemplateId) || OUTBOUND_TEMPLATES[0];
  }, [selectedTemplateId]);

  // Sync custom body when template, sector, region or buyer changes
  useEffect(() => {
    if (currentTemplate) {
      let subjectStr = currentTemplate.subject
        .replace("[Company_Name]", "Apex Enterprise Systems")
        .replace("[Target_Sector]", selectedSector)
        .replace("[Target_Region]", selectedRegion);

      let bodyStr = currentTemplate.body
        .replace(/\[Owner_Last_Name\]/g, "Hamilton")
        .replace(/\[Company_Name\]/g, "Apex Enterprise Systems")
        .replace(/\[Target_Sector\]/g, selectedSector)
        .replace(/\[Target_Region\]/g, selectedRegion)
        .replace(/\[Buyer_Name\]/g, buyerName);

      setCustomSubject(subjectStr);
      setCustomBody(bodyStr);
    }
  }, [currentTemplate, selectedSector, selectedRegion, buyerName]);

  // 3. CAMPAIGN MATH ESTIMATOR LOGIC
  const mathEstimator = useMemo(() => {
    let costPerLead = 1.85; // base cost of high-quality personalized letter
    if (outreachType === 'multi') costPerLead = 3.20; // letter + secure email + follow-up
    if (outreachType === 'premium') costPerLead = 5.50; // plaid verified data + high-grade executive package

    const totalCost = targetVolume * costPerLead;
    
    // Response rates scale based on quality selection
    let estResponseRate = 4.2; 
    if (outreachType === 'multi') estResponseRate = 5.8;
    if (outreachType === 'premium') estResponseRate = 8.4;

    const estReplies = Math.round(targetVolume * (estResponseRate / 100));
    
    // Average off-market target EBITDA is around $650,000. 
    // Typical conversion to LOI of replied leads is ~8%.
    const estPipelineEbitda = Math.round(estReplies * 0.08 * 650000);

    return {
      costPerLead,
      totalCost,
      estResponseRate,
      estReplies,
      estPipelineEbitda
    };
  }, [targetVolume, outreachType]);

  // 4. SIMULATED TERMINAL PIPELINE RUNNER
  const triggerCampaignDeployment = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeploymentStep(1);
    
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] INITIATING TARGETED OUTBOUND ORIGINATION PIPELINE...`,
      ...prev
    ]);
  };

  useEffect(() => {
    if (!isDeploying) return;

    const steps = [
      {
        text: `[DATAPOOL] Scraping secure corporate registries for [Target_Sector] in [Target_Region]...`,
        delay: 1200
      },
      {
        text: `[ENRICHMENT] Pulling tax records & matching verified LLC executive ownership contact coordinates...`,
        delay: 2400
      },
      {
        text: `[MATH MODEL] Computing optimal SBA loan capacity for detected assets in pool...`,
        delay: 3600
      },
      {
        text: `[GENERATING] Tailoring dynamic outreach sequences utilizing Template: "${currentTemplate.name}"...`,
        delay: 4800
      },
      {
        text: `[SUCCESS] Secure dispatch channel initialized! Queueing ${targetVolume} physical dynamic packets.`,
        delay: 6000
      }
    ];

    const currentStepIndex = deploymentStep - 1;
    if (currentStepIndex >= steps.length) {
      // Complete execution and append to real campaigns array
      setIsDeploying(false);
      setDeploymentStep(0);
      
      const newCampaign: Campaign = {
        id: `camp-${Date.now().toString().slice(-3)}`,
        name: `Project ${selectedRegion.split(' ')[0]} ${selectedSector}`,
        sector: selectedSector,
        region: selectedRegion,
        volume: targetVolume,
        responseRate: mathEstimator.estResponseRate,
        replies: 0,
        status: 'QUEUED',
        dateCreated: new Date().toISOString().split('T')[0]
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      setLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ✔ PIPELINE SUCCESSFULLY ENGAGED AND DEPLOYED OUT TO QUEUE.`,
        ...prev
      ]);
      return;
    }

    const timer = setTimeout(() => {
      const stepMsg = steps[currentStepIndex].text
        .replace("[Target_Sector]", selectedSector)
        .replace("[Target_Region]", selectedRegion);

      setLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ${stepMsg}`,
        ...prev
      ]);
      setDeploymentStep(prev => prev + 1);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isDeploying, deploymentStep, selectedSector, selectedRegion, currentTemplate, targetVolume, mathEstimator]);

  const clearTerminalLogs = () => {
    setLogs(["TERMINAL CONSOLE RESET // STATUS ACTIVE"]);
  };

  return (
    <div className="font-sans bg-[#050505] text-[#F9F9F9] selection:bg-[#00FF66] selection:text-black min-h-screen flex flex-col overflow-x-hidden">
      
      {/* 1. GLOBAL MARQUEE TICKER HEADER */}
      <header className="w-full bg-[#090909] border-b border-[#222222] h-11 flex items-center overflow-hidden sticky top-0 z-50">
        <div className="bg-[#00FF66] text-black font-mono text-[10px] font-bold px-4 h-full flex items-center space-x-2 shrink-0 border-r border-[#222222] tracking-wider uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-black animate-ping"></span>
          <span>ORIGINATION ENGINE</span>
        </div>
        
        <div className="relative w-full overflow-hidden h-full flex items-center font-mono text-[11px] text-[#888888] tracking-widest uppercase">
          <div className="flex whitespace-nowrap animate-[marquee_45s_linear_infinite]">
            <span className="mx-6 text-[#F9F9F9]"><span className="text-[#00FF66]">●</span> OUTBOUND ACTIVE: 1,420 OWNERS REACHED IN Q1</span>
            <span className="mx-6 text-[#F9F9F9]"><span className="text-[#0EA5E9]">▲</span> HIGHEST RESPONSE: HVAC / GEORGIA (+6.8% REPLIES)</span>
            <span className="mx-6 text-[#F9F9F9]"><span className="text-[#FF3333]">■</span> COMPLIANCE METRIC: FINCEN-SAFE SAFEGUARD CHECK PASSED</span>
            <span className="mx-6 text-[#F9F9F9]"><span className="text-[#00FF66]">●</span> SOURCE YIELD: OFF-MARKET PIPELINE AVERAGE LOI MULTIPLE IS 2.85x</span>
            <span className="mx-6 text-[#F9F9F9]"><span className="text-[#0EA5E9]">▲</span> ENRICHMENT LEVEL: PLATINUM PLAID-VERIFIED INTRODUCED</span>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-grow flex flex-col xl:flex-row w-full max-w-[1600px] mx-auto border-x border-[#222222]">
        
        {/* 2. LEFT RAIL: PARAMETER DEFINITIONS & STRUCTURAL SLIDERS */}
        <aside className="w-full xl:w-[380px] border-b xl:border-b-0 xl:border-r border-[#222222] bg-[#080808] p-6 shrink-0 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Branding & Scope */}
            <div className="border-b border-[#222222] pb-5">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xl font-bold tracking-tight text-[#F9F9F9]">
                  OUTBOUND<span className="text-[#00FF66]">BUILDER</span>
                </span>
                <span className="text-[9px] font-mono text-[#00FF66] border border-[#00FF66]/20 bg-[#00FF66]/5 px-1.5 py-0.5">V3.5</span>
              </div>
              <p className="font-mono text-[9px] text-[#666666] tracking-widest uppercase mt-1">
                COGNITIVE PROPRIETARY DIRECT ORIGINATION SYSTEM
              </p>
            </div>

            {/* Target Micro-Industry Pill Matrix */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">01 / TARGET SEGMENT</label>
              <div className="grid grid-cols-2 gap-1.5">
                {["SaaS", "Home Services", "Logistics", "Manufacturing"].map((sector) => {
                  const isActive = selectedSector === sector;
                  return (
                    <button
                      key={sector}
                      onClick={() => setSelectedSector(sector)}
                      className={`h-10 text-xs font-mono px-3 flex items-center justify-between border transition-all ${
                        isActive 
                          ? 'border-[#00FF66] text-[#00FF66] bg-black/50' 
                          : 'border-[#222222] text-[#888888] hover:border-[#0EA5E9] hover:text-[#F9F9F9]'
                      }`}
                    >
                      <span>{sector}</span>
                      <span className={`text-[8px] ${isActive ? 'text-[#00FF66]' : 'text-[#444444]'}`}>●</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Geography Core Dropdown */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">02 / GEOGRAPHIC BASIN</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full h-11 bg-black border border-[#222222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%23888888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpolyline points="6 9 12 15 18 9"%3E%3C/polyline%3E%3C/svg%3E')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center'
                }}
              >
                <option value="Midwest Territory">Midwest Territory (OH, IN, MI, IL)</option>
                <option value="Southeast Coast">Southeast Coast (FL, GA, NC, SC)</option>
                <option value="Texas Triangle">Texas Triangle (TX Regional Hubs)</option>
                <option value="Pacific Northwest">Pacific Northwest (WA, OR, ID)</option>
                <option value="Northeast Corridor">Northeast Corridor (NY, PA, NJ, MA)</option>
              </select>
            </div>

            {/* Target Outreach Lead Volume Slider */}
            <div className="space-y-3">
              <div className="flex justify-between font-mono text-[10px] uppercase text-[#888888] tracking-widest">
                <span>03 / CAMPAIGN OUTFLOW</span>
                <span className="text-[#00FF66] font-bold">{targetVolume} Targets</span>
              </div>
              <div className="relative py-2">
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="50"
                  value={targetVolume}
                  onChange={(e) => setTargetVolume(parseInt(e.target.value))}
                  className="w-full h-1 bg-neutral-800 accent-[#00FF66] cursor-pointer appearance-none rounded-none"
                />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-[#444]">
                <span>50</span>
                <span>750</span>
                <span>1,500</span>
              </div>
            </div>

            {/* Outreach Type Specification */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">04 / DISPATCH METHODOLOGY</label>
              <div className="space-y-1.5">
                {[
                  { id: 'letter', label: '1st Class Personal Letter', cost: '$1.85 / Target' },
                  { id: 'multi', label: 'Multi-Channel Direct Sequence', cost: '$3.20 / Target' },
                  { id: 'premium', label: 'Plaid Verified + HNW Packet', cost: '$5.50 / Target' },
                ].map((type) => {
                  const isActive = outreachType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setOutreachType(type.id as any)}
                      className={`w-full h-11 px-4 border text-left flex items-center justify-between text-xs font-mono transition-all ${
                        isActive 
                          ? 'border-[#0EA5E9] text-[#F9F9F9] bg-[#0ea5e9]/5' 
                          : 'border-[#222222] text-[#888888] hover:border-[#0EA5E9]'
                      }`}
                    >
                      <span>{type.label}</span>
                      <span className="text-[10px] text-[#00FF66]">{type.cost}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buyer/Searcher Name Input */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">05 / SENDER DEPLOYMENT PROFILE</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Sender Profile Name..."
                className="w-full h-11 bg-black border border-[#222222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#00FF66] placeholder-[#444]"
              />
            </div>

          </div>

          {/* Math Projections Dashboard */}
          <div className="mt-8 border-t border-[#222222] pt-6 space-y-4">
            <h4 className="font-mono text-[10px] uppercase text-[#888888] tracking-widest">SIMULATED CONVERSION METRICS</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black p-3.5 border border-[#161616]">
                <p className="font-mono text-[8px] text-[#666666] uppercase">EST. OUTLAY COST</p>
                <p className="font-mono text-sm font-bold text-[#F9F9F9]">${mathEstimator.totalCost.toLocaleString()}</p>
              </div>
              <div className="bg-black p-3.5 border border-[#161616]">
                <p className="font-mono text-[8px] text-[#666666] uppercase">EST. REPLIES ({mathEstimator.estResponseRate}%)</p>
                <p className="font-mono text-sm font-bold text-[#00FF66]">{mathEstimator.estReplies} Owners</p>
              </div>
            </div>
            <div className="bg-black/80 border border-[#222222] p-3 flex flex-col justify-center">
              <span className="font-mono text-[8px] text-[#0ea5e9] tracking-widest uppercase block">POTENTIAL EBITDA PIPELINE</span>
              <span className="text-lg font-bold text-[#0ea5e9] tracking-tight">${mathEstimator.estPipelineEbitda.toLocaleString()}</span>
              <span className="font-mono text-[8px] text-[#555555] uppercase mt-1">Based on standard 8% LOI acquisition conversion</span>
            </div>
          </div>

        </aside>

        {/* 3. CENTER WORKSPACE: DYNAMIC TEMPLATE DESIGNER & LIVE PREVIEW */}
        <section className="flex-grow p-4 lg:p-8 space-y-6 bg-[#050505]">
          
          {/* Header Workspace Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222222] pb-6">
            <div>
              <h2 class="font-mono text-sm uppercase tracking-widest text-[#F9F9F9] flex items-center space-x-2">
                <span>SEQUENCE EDITOR & COMPOSER</span>
                <span className="text-[10px] text-[#888888]">/ (CONFIDENTIAL OWNER OUTREACH)</span>
              </h2>
              <p className="text-xs text-[#666666] mt-1 font-mono">Tailor highly structured physical letters engineered to generate off-market pipeline responses.</p>
            </div>
            
            <div className="flex items-center space-x-3 text-xs font-mono text-[#888888]">
              <span>OUTBOUND FORMULA:</span>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="bg-black border border-[#222222] px-3 py-1.5 text-xs text-[#F9F9F9] focus:outline-none rounded-none cursor-pointer"
              >
                {OUTBOUND_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Composer Interface Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Live Interactive Copy Input Controls */}
            <div className="space-y-4">
              <div className="bg-[#090909] border border-[#222222] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
                  <span className="font-mono text-[10px] text-[#888888] uppercase tracking-wider">01 // TARGET METADATA ENRICHMENT VALUES</span>
                  <span className="text-[9px] font-mono text-[#0ea5e9]">VERIFIED DATA ACTIVE</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="bg-black p-2.5 border border-[#161616] space-y-1">
                    <span className="text-[#555555] text-[9px] block">TARGET LEADER</span>
                    <span className="text-[#F9F9F9] font-bold">Mr. Hamilton</span>
                  </div>
                  <div className="bg-black p-2.5 border border-[#161616] space-y-1">
                    <span className="text-[#555555] text-[9px] block">TARGET ENTITY</span>
                    <span className="text-[#F9F9F9] font-bold">Apex Enterprise Systems</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="font-mono text-[10px] text-[#888888] uppercase block">Subject Header Composition</label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full bg-black border border-[#222222] p-3 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[10px] text-[#888888] uppercase block">Outbound Message Body Copy</label>
                    <span className="font-mono text-[9px] text-[#555555]">{customBody.length} Characters</span>
                  </div>
                  <textarea
                    rows={12}
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    className="w-full bg-black border border-[#222222] p-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9] leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Beautiful Executive Letter Live Preview */}
            <div className="space-y-4">
              <div className="relative bg-[#090909] border border-[#222222] p-6 lg:p-8 min-h-[500px] flex flex-col justify-between shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                
                {/* Decorative Technical Overlay grid */}
                <div className="absolute inset-0 pointer-events-none opacity-5 border border-dashed border-[#00FF66] m-4"></div>

                {/* Technical Header details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-[#222222] pb-4">
                    <div>
                      <h4 className="font-mono text-xs font-bold text-[#F9F9F9] tracking-tight">ACQUIREMETA SECURE OUTBOUND PACKET</h4>
                      <p className="font-mono text-[8px] text-[#666666] tracking-widest uppercase mt-0.5">FORMULA CLASSIFIED DISPATCH // LEVEL 03 SECURITY</p>
                    </div>
                    <span className="font-mono text-[9px] text-[#00FF66] bg-[#00FF66]/10 border border-[#00FF66]/30 px-2 py-0.5">
                      PHYSICAL PRINT PREVIEW
                    </span>
                  </div>

                  {/* Envelope metadata */}
                  <div className="font-mono text-[10px] text-[#666666] space-y-1">
                    <div><span className="text-[#888888] font-bold">FROM:</span> {buyerName} // ORIGINATION HUB</div>
                    <div><span className="text-[#888888] font-bold">TO:</span> Mr. Hamilton, CEO of Apex Enterprise Systems</div>
                    <div><span className="text-[#888888] font-bold">REGION:</span> {selectedRegion} Delivery Buffer Pool</div>
                  </div>

                  {/* Dynamic Letter Body */}
                  <div className="pt-4 border-t border-[#1a1a1a]">
                    <p className="font-mono text-[11px] text-[#00FF66] font-bold mb-3">SUBJECT: {customSubject}</p>
                    <p className="text-xs text-[#888888] leading-relaxed whitespace-pre-wrap font-sans">
                      {customBody}
                    </p>
                  </div>
                </div>

                {/* Bottom Trust Sign-off Stamp */}
                <div className="mt-8 pt-4 border-t border-[#222222] flex justify-between items-center text-[10px] font-mono text-[#555555]">
                  <span>STAMP: [ ACQUIREMETA PRE-LOI ENVELOPE PROTOCOL ]</span>
                  <span className="text-[#FF3333]">CONFIDENTIAL // SECURE TRANSITION</span>
                </div>

              </div>
            </div>

          </div>

          {/* 4. TERMINAL PIPELINE INTEGRATION & ACTION ENGINE */}
          <div className="bg-[#090909] border border-[#222222] p-5 space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#FF3333] tracking-widest uppercase flex items-center space-x-1.5">
                  <span className="inline-block w-2 h-2 bg-[#FF3333] rounded-full animate-pulse"></span>
                  <span>CAMPAIGN DISPATCH CONTROL MATRIX</span>
                </span>
                <p className="text-xs text-[#888888] font-mono">Verify target filters are locked and estimated cost yields fit criteria before initiating direct mail prints.</p>
              </div>

              <div className="flex space-x-2 w-full md:w-auto">
                <button
                  onClick={triggerCampaignDeployment}
                  disabled={isDeploying}
                  className={`flex-grow md:flex-initial h-12 px-6 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isDeploying
                      ? 'bg-neutral-900 border border-neutral-800 text-neutral-600 cursor-not-allowed'
                      : 'bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                  }`}
                >
                  <span>{isDeploying ? 'DEPLOYING SEQUENCE...' : 'LAUNCH OUTBOUND CAMPAIGN SEQUENCE'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Terminal Live Command Log Dashboard */}
            <div className="bg-black border border-[#1c1c1c] p-4 font-mono text-[11px] leading-relaxed relative">
              <div className="flex justify-between items-center border-b border-[#1c1c1c] pb-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-1.5 h-1.5 bg-[#0EA5E9]"></span>
                  <span className="text-[#888888] font-bold text-[10px]">REAL-TIME PIPELINE LOG CONSOLE</span>
                </div>
                <button 
                  onClick={clearTerminalLogs}
                  className="text-[9px] text-[#FF3333] hover:underline uppercase"
                >
                  Clear Console Log
                </button>
              </div>

              {/* Console Feed Output */}
              <div className="h-28 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
                {logs.map((log, index) => {
                  let textClass = "text-[#666666]";
                  if (log.includes("[SUCCESS]")) textClass = "text-[#00FF66] font-bold";
                  if (log.includes("[DATAPOOL]") || log.includes("[ENRICHMENT]")) textClass = "text-[#0EA5E9]";
                  if (log.includes("✔")) textClass = "text-[#00FF66]";
                  
                  return (
                    <div key={index} className={`${textClass} transition-all duration-200`}>
                      &gt; {log}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 5. ACTIVE COMPLETED CAMPAIGNS PIPELINE LIST */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9] flex items-center space-x-2">
              <span className="inline-block w-1.5 h-1.5 bg-[#00FF66]"></span>
              <span>LIVE ORIGINATION MONITOR (ACTIVE OUTBOUND PIPELINES)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {campaigns.map((camp) => {
                const isActive = camp.status === 'ACTIVE';
                const isQueued = camp.status === 'QUEUED';
                
                return (
                  <div 
                    key={camp.id}
                    className="bg-[#090909] border border-[#222222] p-5 flex flex-col justify-between hover:border-[#0EA5E9] transition-all group duration-300 relative"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 flex items-center space-x-1.5">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#00FF66] animate-pulse' : isQueued ? 'bg-[#0EA5E9]' : 'bg-[#FF3333]'}`}></span>
                      <span className={`font-mono text-[9px] uppercase font-bold ${isActive ? 'text-[#00FF66]' : isQueued ? 'text-[#0EA5E9]' : 'text-[#FF3333]'}`}>
                        {camp.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-[#0EA5E9] tracking-widest uppercase">{camp.sector} // {camp.region}</span>
                        <h4 className="text-sm font-bold text-[#F9F9F9] tracking-tight group-hover:text-white">{camp.name}</h4>
                      </div>

                      {/* Mini Metric Grid */}
                      <div className="grid grid-cols-3 gap-1.5 border-t border-[#1a1a1a] pt-3 font-mono">
                        <div className="bg-black p-2 border border-[#161616]">
                          <span className="text-[8px] text-[#555555] block">SENT</span>
                          <span className="text-xs font-bold text-[#F9F9F9]">{camp.volume}</span>
                        </div>
                        <div className="bg-black p-2 border border-[#161616]">
                          <span className="text-[8px] text-[#555555] block">RESP %</span>
                          <span className="text-xs font-bold text-[#00FF66]">{camp.responseRate}%</span>
                        </div>
                        <div className="bg-black p-2 border border-[#161616]">
                          <span className="text-[8px] text-[#555555] block">REPLIES</span>
                          <span className="text-xs font-bold text-[#0EA5E9]">{camp.replies}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex justify-between items-center text-[9px] font-mono text-[#444444]">
                      <span>CREATED: {camp.dateCreated}</span>
                      <span className="text-[#888888] hover:text-[#0ea5e9] cursor-pointer hover:underline transition-colors">[ MANAGE SEQUENCE ]</span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </section>

      </main>

      {/* 6. COMPLIANCE & RISK DISCLAIMERS FOOTER */}
      <footer className="mt-auto w-full bg-[#080808] border-t border-[#222222]">
        <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Disclaimer & SEC compliance details */}
            <div className="max-w-4xl space-y-2">
              <p className="font-mono text-[10px] text-[#666666] leading-relaxed">
                Disclaimer: AcquireMeta Outbound Campaign systems operate strictly as a technology pipeline supporting direct off-market deal searchers and independent sponsors. Direct outreach activities must comply with CAN-SPAM, local direct mail protocols, and state level LLC privacy matrices.
              </p>
              <p className="font-mono text-[9px] text-[#444444]">
                The estimated metrics and pipeline EBITDA models are proprietary algorithmic simulations. Actual conversion rates, letter open percentages, and LOI conversion variables depend highly on local conditions, industry trends, and specific seller transition requirements.
              </p>
            </div>

            {/* Compliance verification Badges */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <span className="h-9 border border-[#222222] bg-black px-3 py-1.5 flex items-center font-mono text-[10px] text-[#888888] tracking-widest uppercase">
                FINCEN COMPLIANT
              </span>
              <span className="h-9 border border-[#222222] bg-black px-3 py-1.5 flex items-center font-mono text-[10px] text-[#888888] tracking-widest uppercase">
                COGNITIVE ENRICHED
              </span>
              <span className="h-9 border border-[#222222] bg-black px-3 py-1.5 flex items-center font-mono text-[10px] text-[#888888] tracking-widest uppercase">
                SBA COMPATIBLE DESIGNS
              </span>
            </div>
          </div>
          
          <div className="border-t border-[#111111] pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-[#444444]">
            <span>OUTBOUND ORIGINATION GATEWAY SECURE CHANNEL OUT-002</span>
            <span>© 2026 ACQUIREMETA & MOONSHINE CAPITAL CAPITAL. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}