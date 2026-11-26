```tsx
import React, { useState, useMemo, useEffect } from "react";

// Types
interface RegionData {
  id: string;
  name: string;
  states: string[];
  baseLeads: number;
  multiplier: number;
  coordinates: { x: number; y: number }[];
  center: { x: number; y: number };
}

interface MicroIndustry {
  id: string;
  name: string;
  category: "SaaS" | "Home Services" | "Logistics" | "Manufacturing";
  leadCount: number;
}

interface CampaignLog {
  timestamp: string;
  type: "info" | "warning" | "success" | "system";
  message: string;
}

// Mock Data matching AcquireMeta Terminal Aesthetic
const STRATEGIC_REGIONS: RegionData[] = [
  {
    id: "reg-ne",
    name: "NORTHEAST CORRIDOR",
    states: ["NY", "PA", "NJ", "MA", "CT"],
    baseLeads: 1420,
    multiplier: 1.25,
    center: { x: 420, y: 130 },
    coordinates: [
      { x: 380, y: 110 }, { x: 440, y: 110 }, { x: 460, y: 140 }, 
      { x: 420, y: 170 }, { x: 380, y: 150 }
    ]
  },
  {
    id: "reg-se",
    name: "SOUTHEAST SUNBELT",
    states: ["FL", "GA", "NC", "SC", "AL"],
    baseLeads: 1950,
    multiplier: 1.1,
    center: { x: 370, y: 260 },
    coordinates: [
      { x: 340, y: 200 }, { x: 400, y: 200 }, { x: 430, y: 280 }, 
      { x: 370, y: 290 }, { x: 320, y: 240 }
    ]
  },
  {
    id: "reg-mw",
    name: "MIDWEST INDUSTRIAL HEARTLAND",
    states: ["IL", "OH", "MI", "IN", "WI"],
    baseLeads: 2240,
    multiplier: 0.95,
    center: { x: 310, y: 130 },
    coordinates: [
      { x: 270, y: 100 }, { x: 360, y: 100 }, { x: 370, y: 160 }, 
      { x: 280, y: 160 }, { x: 260, y: 120 }
    ]
  },
  {
    id: "reg-tx",
    name: "TEXAS TRIANGLE",
    states: ["TX", "OK", "LA"],
    baseLeads: 1810,
    multiplier: 1.15,
    center: { x: 230, y: 250 },
    coordinates: [
      { x: 180, y: 210 }, { x: 270, y: 210 }, { x: 280, y: 280 }, 
      { x: 210, y: 290 }, { x: 170, y: 250 }
    ]
  },
  {
    id: "reg-wc",
    name: "PACIFIC & WEST COAST",
    states: ["CA", "WA", "OR", "NV"],
    baseLeads: 1670,
    multiplier: 1.3,
    center: { x: 70, y: 150 },
    coordinates: [
      { x: 30, y: 60 }, { x: 100, y: 60 }, { x: 110, y: 210 }, 
      { x: 50, y: 240 }, { x: 30, y: 150 }
    ]
  }
];

const MICRO_INDUSTRIES: MicroIndustry[] = [
  { id: "ind-hvac", name: "Commercial HVAC & Refrigeration", category: "Home Services", leadCount: 420 },
  { id: "ind-cnc", name: "Precision CNC Machining", category: "Manufacturing", leadCount: 310 },
  { id: "ind-3pl", name: "Specialized 3PL & Cold Storage", category: "Logistics", leadCount: 280 },
  { id: "ind-saas", name: "Enterprise Asset Tracking SaaS", category: "SaaS", leadCount: 190 },
  { id: "ind-die", name: "Tool & Die Cast Prototyping", category: "Manufacturing", leadCount: 150 },
  { id: "ind-elec", name: "High-Voltage Grid Contractors", category: "Home Services", leadCount: 240 },
  { id: "ind-last", name: "Intermodal Last-Mile Distribution", category: "Logistics", leadCount: 350 }
];

export default function GeographicTargetingMap() {
  // Targeting States
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["reg-mw", "reg-tx"]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(["ind-cnc", "ind-3pl"]);
  const [minEbitda, setMinEbitda] = useState<number>(350000);
  const [maxMultiple, setMaxMultiple] = useState<number>(4.0);
  
  // Sequence Config
  const [outreachType, setOutreachType] = useState<"letters" | "hybrid" | "digital">("hybrid");
  const [appendMobile, setAppendMobile] = useState<boolean>(true);
  const [cadenceDays, setCadenceDays] = useState<number>(21);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [logs, setLogs] = useState<CampaignLog[]>([
    { timestamp: "09:41:02", type: "system", message: "Initialize Geo-Targeting Pipeline v3.11 build 88..." },
    { timestamp: "09:41:05", type: "info", message: "Awaiting wireframe region vector validation." }
  ]);

  // Handle active region toggles
  const handleToggleRegion = (id: string) => {
    if (selectedRegions.includes(id)) {
      setSelectedRegions(selectedRegions.filter(r => r !== id));
      addLog("info", `De-selected region profile: ${id.toUpperCase()}`);
    } else {
      setSelectedRegions([...selectedRegions, id]);
      addLog("success", `Locked target sector coordinates: ${id.toUpperCase()}`);
    }
  };

  // Handle active industry toggles
  const handleToggleIndustry = (id: string) => {
    if (selectedIndustries.includes(id)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== id));
    } else {
      setSelectedIndustries([...selectedIndustries, id]);
      addLog("info", `Appended micro-segment target rule: ${id.toUpperCase()}`);
    }
  };

  // Helper logger
  const addLog = (type: CampaignLog["type"], message: string) => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs(prev => [{ timestamp: time, type, message }, ...prev].slice(0, 8));
  };

  // Live Calculations (Simulated Financial Logic matching terminal theme)
  const stats = useMemo(() => {
    if (selectedRegions.length === 0 || selectedIndustries.length === 0) {
      return { totalLeads: 0, estimatedOwners: 0, monthlyBudget: 0, responseRate: 0 };
    }

    // Calculate baseline
    let regionFactor = selectedRegions.reduce((acc, rId) => {
      const reg = STRATEGIC_REGIONS.find(r => r.id === rId);
      return acc + (reg ? reg.baseLeads * reg.multiplier : 0);
    }, 0);

    let industryFactor = selectedIndustries.reduce((acc, iId) => {
      const ind = MICRO_INDUSTRIES.find(i => i.id === iId);
      return acc + (ind ? ind.leadCount : 100);
    }, 0);

    // Filter curves based on EBITDA threshold and valuation multiple limits
    const ebitdaSqueeze = minEbitda > 750000 ? 0.45 : minEbitda > 500000 ? 0.75 : 1.0;
    const multipleSqueeze = maxMultiple < 3.0 ? 0.6 : maxMultiple < 4.0 ? 0.85 : 1.0;

    const baseRaw = Math.round((regionFactor + industryFactor) * 0.12 * ebitdaSqueeze * multipleSqueeze);
    const totalLeads = Math.max(12, baseRaw);
    const estimatedOwners = Math.round(totalLeads * (appendMobile ? 0.94 : 0.65));

    // Pricing estimation matching real-world print/digital direct sequence
    const costPerLead = outreachType === "letters" ? 4.80 : outreachType === "hybrid" ? 6.50 : 2.10;
    const monthlyBudget = Math.round(totalLeads * costPerLead * (30 / cadenceDays));
    const responseRate = outreachType === "letters" ? 4.2 : outreachType === "hybrid" ? 6.8 : 2.5;

    return {
      totalLeads,
      estimatedOwners,
      monthlyBudget,
      responseRate
    };
  }, [selectedRegions, selectedIndustries, minEbitda, maxMultiple, outreachType, appendMobile, cadenceDays]);

  // Simulated deployment routine
  const triggerDeploy = () => {
    if (stats.totalLeads === 0) {
      addLog("warning", "Deployment rejected: Zero leads in target envelope.");
      return;
    }
    setIsDeploying(true);
    addLog("warning", "INITIATING SECURE DEAL-SOURCE STACK...");
    
    setTimeout(() => {
      addLog("success", `Appended ${stats.estimatedOwners} targeted direct owners to sequencers.`);
    }, 800);

    setTimeout(() => {
      addLog("system", `System dispatched verification protocols to SEC of State registers.`);
      setIsDeploying(false);
    }, 1800);
  };

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] font-sans border border-[#222222] glow-toxic">
      
      {/* Module Title / Terminal Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#222222] bg-[#090909]">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 bg-[#00FF66] inline-block animate-pulse"></span>
          <div>
            <h3 className="font-mono text-xs font-bold tracking-widest uppercase">
              GEOGRAPHIC SOURCE INTERFACE // OFF-MARKET ORIGINATION
            </h3>
            <p className="text-[10px] text-[#666666] font-mono uppercase tracking-tight">
              Micro-target off-market business infrastructure owners directly
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 font-mono text-[10px] text-[#888]">
          <span className="border border-[#222222] px-2 py-0.5 bg-[#080808]">SECURE CHANNEL SH-909</span>
          <span className="text-[#00FF66]">CONNECTED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT COLUMN: Targeting Filter Controls */}
        <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-[#222222] bg-[#070707] space-y-6">
          
          {/* Micro Industry Tag Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest">
                01 / TARGET MICRO-INDUSTRIES
              </label>
              <button 
                onClick={() => { setSelectedIndustries([]); addLog("warning", "Cleared micro-industry tags."); }}
                className="font-mono text-[9px] uppercase text-[#FF3333] hover:underline"
              >
                CLEAR
              </button>
            </div>
            
            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
              {MICRO_INDUSTRIES.map((ind) => {
                const active = selectedIndustries.includes(ind.id);
                return (
                  <button
                    key={ind.id}
                    onClick={() => handleToggleIndustry(ind.id)}
                    className={`w-full text-left px-3 py-2 text-xs font-mono flex justify-between items-center transition-all border ${
                      active 
                        ? "bg-[#0ea5e9]/10 border-[#0EA5E9] text-[#F9F9F9]" 
                        : "bg-black border-[#222222] text-[#888] hover:border-[#444]"
                    }`}
                  >
                    <span>{ind.name}</span>
                    <span className={`text-[9px] font-bold ${active ? "text-[#00FF66]" : "text-[#444]"}`}>
                      {active ? "[X]" : `+${ind.leadCount}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deal Criteria Filters */}
          <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
            <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">
              02 / FINANCIAL DRILL-DOWN
            </label>
            
            {/* Slider EBITDA */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#888]">Min Adj. EBITDA:</span>
                <span className="text-[#00FF66] font-bold">${minEbitda.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="150000" 
                max="1500000" 
                step="50000"
                value={minEbitda}
                onChange={(e) => {
                  setMinEbitda(Number(e.target.value));
                  addLog("info", `Recalibrated target floor EBITDA: $${Number(e.target.value).toLocaleString()}`);
                }}
                className="w-full h-1 bg-neutral-800 accent-[#00FF66] cursor-pointer appearance-none rounded-none"
              />
              <div className="flex justify-between font-mono text-[8px] text-[#444]">
                <span>$150k</span>
                <span>$750k</span>
                <span>$1.5M+</span>
              </div>
            </div>

            {/* Slider Max Multiple */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#888]">Max Implied Valuation Multiple:</span>
                <span className="text-[#0EA5E9] font-bold">{maxMultiple.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="2.0" 
                max="5.0" 
                step="0.1"
                value={maxMultiple}
                onChange={(e) => {
                  setMaxMultiple(Number(e.target.value));
                  addLog("info", `Locked max target multiple limit: ${Number(e.target.value).toFixed(1)}x`);
                }}
                className="w-full h-1 bg-neutral-800 accent-[#0EA5E9] cursor-pointer appearance-none rounded-none"
              />
              <div className="flex justify-between font-mono text-[8px] text-[#444]">
                <span>2.0x</span>
                <span>3.5x</span>
                <span>5.0x</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="pt-4 border-t border-[#1a1a1a] space-y-2 bg-[#090909] p-3 border border-[#1c1c1c]">
            <p className="font-mono text-[8px] text-[#666] uppercase">Active Targeting Envelopes</p>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#888]">Regions Active:</span>
              <span className="text-[#F9F9F9] font-bold">{selectedRegions.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#888]">Micro-Niches Selected:</span>
              <span className="text-[#F9F9F9] font-bold">{selectedIndustries.length}</span>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Interactive US Regional Vector Map */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">
              03 / STRATEGIC REGION SELECTOR (VECTOR OVERLAY)
            </span>
            <p className="text-xs text-[#666666] font-mono">
              Click individual target zones on wireframe matrix to engage regional outreach servers.
            </p>
          </div>

          {/* Map Container Area */}
          <div className="relative w-full aspect-[4/3] bg-black border border-[#1a1a1a] flex items-center justify-center overflow-hidden">
            
            {/* Grid Overlay for Cyber / Hacker Vibe */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:20px_20px] opacity-45 pointer-events-none" />
            
            {/* Interactive Vector SVG US Map (Simplified stylized representation) */}
            <svg 
              viewBox="0 0 500 330" 
              className="w-full h-full relative z-10 transition-all"
            >
              {/* Regional polygons */}
              {STRATEGIC_REGIONS.map((reg) => {
                const active = selectedRegions.includes(reg.id);
                // Convert array of objects to svg points format
                const pointsStr = reg.coordinates.map(p => `${p.x},${p.y}`).join(" ");

                return (
                  <g 
                    key={reg.id}
                    onClick={() => handleToggleRegion(reg.id)}
                    className="cursor-pointer group"
                  >
                    <polygon
                      points={pointsStr}
                      className={`transition-all duration-300 ${
                        active 
                          ? "fill-[#00ff66]/10 stroke-[#00FF66] stroke-2 animate-pulse-subtle" 
                          : "fill-neutral-900/40 stroke-neutral-800 stroke-[1.5px] hover:fill-[#0ea5e9]/5 hover:stroke-[#0EA5E9]"
                      }`}
                    />
                    
                    {/* Glowing pulse indicator in center of active regions */}
                    {active && (
                      <g transform={`translate(${reg.center.x}, ${reg.center.y})`}>
                        <circle r="6" className="fill-[#00FF66] opacity-30 animate-ping" />
                        <circle r="3.5" className="fill-[#00FF66]" />
                      </g>
                    )}

                    {/* Passive regional marker */}
                    {!active && (
                      <circle 
                        cx={reg.center.x} 
                        cy={reg.center.y} 
                        r="3.5" 
                        className="fill-neutral-700 group-hover:fill-[#0EA5E9] transition-colors" 
                      />
                    )}
                  </g>
                );
              })}

              {/* Graphical State abbreviation labels inside map */}
              {STRATEGIC_REGIONS.map((reg) => {
                const active = selectedRegions.includes(reg.id);
                return (
                  <text
                    key={`lbl-${reg.id}`}
                    x={reg.center.x}
                    y={reg.center.y - 12}
                    className={`font-mono text-[9px] font-bold tracking-tighter text-center pointer-events-none ${
                      active ? "fill-[#00FF66]" : "fill-[#666] group-hover:fill-[#0EA5E9]"
                    }`}
                    textAnchor="middle"
                  >
                    {reg.states.slice(0, 3).join(" | ")}
                  </text>
                );
              })}
            </svg>

            {/* Simulated Live Connection Tag */}
            <div className="absolute top-3 left-3 bg-[#090909] border border-[#222] px-2 py-1 text-[8px] font-mono text-[#888] flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-[#0EA5E9] rounded-full inline-block animate-ping"></span>
              <span>STATE DATABASE PIPELINES ONLINE</span>
            </div>

            {/* Quick Helper Legend */}
            <div className="absolute bottom-3 right-3 flex space-x-4 text-[9px] font-mono text-[#555]">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 border border-[#00FF66] bg-[#00ff66]/10 inline-block"></span>
                <span>Active Target</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-neutral-900 border border-neutral-800 inline-block"></span>
                <span>Inactive Area</span>
              </div>
            </div>

          </div>

          {/* Regional Details Table Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            {STRATEGIC_REGIONS.map((reg) => {
              const active = selectedRegions.includes(reg.id);
              return (
                <button
                  key={`btn-geo-${reg.id}`}
                  onClick={() => handleToggleRegion(reg.id)}
                  className={`p-2 border font-mono text-left transition-all ${
                    active 
                      ? "border-[#00FF66] bg-[#00FF66]/5" 
                      : "border-[#222222] bg-black hover:border-neutral-700"
                  }`}
                >
                  <p className={`text-[8px] uppercase tracking-tight block ${active ? "text-[#00FF66]" : "text-[#555]"}`}>
                    {reg.name.split(" ")[0]}
                  </p>
                  <span className="text-[10px] font-bold text-[#F9F9F9] block mt-0.5">
                    {reg.states.join(", ")}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Sequence Blueprint Configuration */}
        <div className="lg:col-span-3 p-6 border-t lg:border-t-0 lg:border-l border-[#222222] bg-[#070707] flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">
                04 / OUTBOUND DISPATCH PROTOCOL
              </span>
              <p className="text-xs text-[#666] font-mono leading-relaxed">
                Configure touch points to construct physical non-binding solicitation campaigns.
              </p>
            </div>

            {/* Campaign Outbound Channel Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#555] uppercase tracking-wider block">Sequence Channel:</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => { setOutreachType("letters"); addLog("info", "Sequence set to high-touch letters."); }}
                  className={`py-1.5 font-mono text-[9px] uppercase border transition-all ${
                    outreachType === "letters" ? "border-[#0EA5E9] bg-[#0ea5e9]/10 text-[#F9F9F9]" : "border-[#222] bg-black text-[#666]"
                  }`}
                >
                  Letters
                </button>
                <button
                  onClick={() => { setOutreachType("hybrid"); addLog("info", "Sequence optimized for Hybrid touch."); }}
                  className={`py-1.5 font-mono text-[9px] uppercase border transition-all ${
                    outreachType === "hybrid" ? "border-[#0ea5e9] bg-[#0ea5e9]/20 text-[#0ea5e9]" : "border-[#222] bg-black text-[#666]"
                  }`}
                >
                  Hybrid
                </button>
                <button
                  onClick={() => { setOutreachType("digital"); addLog("info", "Sequence optimized for Digital CRM direct."); }}
                  className={`py-1.5 font-mono text-[9px] uppercase border transition-all ${
                    outreachType === "digital" ? "border-[#0EA5E9] bg-[#0ea5e9]/10 text-[#F9F9F9]" : "border-[#222] bg-black text-[#666]"
                  }`}
                >
                  Digital
                </button>
              </div>
            </div>

            {/* Owners mobile lookup toggle */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono text-[#555] uppercase tracking-wider">
                  APPEND OWNER CELL NUMBERS
                </label>
                <button 
                  onClick={() => {
                    setAppendMobile(!appendMobile);
                    addLog("info", `Appended owner contact query optimization toggled ${!appendMobile ? "ON" : "OFF"}.`);
                  }}
                  className={`w-10 h-5 border transition-all flex items-center p-0.5 rounded-none ${
                    appendMobile ? "border-[#00FF66] bg-[#00FF66]/10 justify-end" : "border-[#222] bg-black justify-start"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 ${appendMobile ? "bg-[#00FF66]" : "bg-[#444]"} inline-block`} />
                </button>
              </div>
              <p className="text-[9px] font-mono text-[#555] leading-tight">
                Runs entities through LexisNexis / ZoomInfo compliance tunnels to extract direct contact lines.
              </p>
            </div>

            {/* Sequence Cadence */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#888]">Touchpoint Cadence Rate:</span>
                <span className="text-[#0EA5E9] font-bold">Every {cadenceDays} Days</span>
              </div>
              <input 
                type="range" 
                min="14" 
                max="45" 
                step="7"
                value={cadenceDays}
                onChange={(e) => setCadenceDays(Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 accent-[#0EA5E9] cursor-pointer appearance-none rounded-none"
              />
            </div>
          </div>

          {/* Core Metrics Engine Output Block */}
          <div className="bg-[#090909] border border-[#222222] p-4 space-y-4">
            <span className="font-mono text-[8px] text-[#00FF66] tracking-widest uppercase block">
              LIVE SEQUENCE PROJECTION
            </span>
            
            <div className="space-y-2.5">
              <div className="flex justify-between items-center border-b border-[#181818] pb-1.5">
                <span className="text-[10px] font-mono text-[#666]">STATED ENTITY LEADS:</span>
                <span className="text-sm font-semibold font-mono text-[#F9F9F9]">{stats.totalLeads}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#181818] pb-1.5">
                <span className="text-[10px] font-mono text-[#666]">VERIFIED OWNERS:</span>
                <span className="text-sm font-semibold font-mono text-[#00FF66]">{stats.estimatedOwners}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#181818] pb-1.5">
                <span className="text-[10px] font-mono text-[#666]">EST. RESPONSE RATE:</span>
                <span className="text-sm font-semibold font-mono text-[#0EA5E9]">{stats.responseRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-[#666]">EST. MONTHLY COST:</span>
                <span className="text-sm font-semibold font-mono text-[#FF3333]">${stats.monthlyBudget}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER: Interactive Telemetry logs and Deployment trigger */}
      <div className="bg-[#090909] border-t border-[#222222] p-4 flex flex-col md:flex-row items-stretch justify-between gap-4">
        
        {/* Live system logs ticker */}
        <div className="flex-grow bg-black border border-[#1c1c1c] p-3 font-mono text-[10px] space-y-1 max-h-[75px] overflow-y-auto">
          {logs.map((log, index) => {
            const typeColor = 
              log.type === "success" ? "text-[#00FF66]" :
              log.type === "warning" ? "text-[#FF3333]" :
              log.type === "info" ? "text-[#0EA5E9]" : "text-[#666]";

            return (
              <div key={index} className="flex space-x-2 leading-tight">
                <span className="text-[#444] shrink-0">[{log.timestamp}]</span>
                <span className={`${typeColor} shrink-0`}>●</span>
                <span className="text-[#888]">{log.message}</span>
              </div>
            );
          })}
        </div>

        {/* Action Button Trigger */}
        <div className="md:w-[280px] shrink-0 flex items-stretch">
          <button
            onClick={triggerDeploy}
            disabled={isDeploying || stats.totalLeads === 0}
            className={`w-full py-4 text-xs font-mono font-bold uppercase tracking-widest transition-all flex flex-col justify-center items-center gap-1.5 ${
              isDeploying 
                ? "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
                : stats.totalLeads === 0
                  ? "bg-transparent text-neutral-600 border border-[#222] cursor-not-allowed"
                  : "bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]"
            }`}
          >
            <span>{isDeploying ? "DISPATCHING PROTOCOLS..." : "DEPLOY CAMPAIGN RUNTIME"}</span>
            <span className="text-[8px] font-normal tracking-tight">
              {stats.totalLeads > 0 ? `Targeting ${stats.totalLeads} Entities` : "Select Regions & Niches"}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
}
```