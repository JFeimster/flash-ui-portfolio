import React, { useState, useMemo } from 'react';

// Types
interface Prospect {
  id: string;
  companyName: string;
  ownerName: string;
  industry: string;
  county: string;
  state: string;
  estRevenue: string;
  estEbitda: string;
  estEmployees: number;
  confidenceScore: number;
  outreachStatus: 'Uncontacted' | 'Emailed' | 'Mailed' | 'Responded' | 'Disqualified';
  lastContacted: string;
  address: string;
}

interface CampaignTemplate {
  id: string;
  name: string;
  type: 'Email' | 'Direct Mail';
  subject: string;
  body: string;
}

export default function ProspectCardGrid() {
  // Mock Prospects Database
  const [prospects, setProspects] = useState<Prospect[]>([
    {
      id: "PR-8021",
      companyName: "Metro Atlanta HVAC Solutions",
      ownerName: "Marcus Vance",
      industry: "HVAC",
      county: "Cobb County",
      state: "GA",
      estRevenue: "$2.8M",
      estEbitda: "$550K",
      estEmployees: 18,
      confidenceScore: 94,
      outreachStatus: "Uncontacted",
      lastContacted: "N/A",
      address: "1405 Powers Ferry Rd, Marietta, GA 30067"
    },
    {
      id: "PR-4402",
      companyName: "Precision Metal Works Corp",
      ownerName: "Helen Sterling",
      industry: "Manufacturing",
      county: "Cook County",
      state: "IL",
      estRevenue: "$5.4M",
      estEbitda: "$1.1M",
      estEmployees: 34,
      confidenceScore: 88,
      outreachStatus: "Emailed",
      lastContacted: "2023-11-10",
      address: "2200 W Grand Ave, Chicago, IL 60612"
    },
    {
      id: "PR-3119",
      companyName: "Tri-State Logistics & Storage",
      ownerName: "Robert 'Bob' Chen",
      industry: "Logistics",
      county: "Hudson County",
      state: "NJ",
      estRevenue: "$4.1M",
      estEbitda: "$780K",
      estEmployees: 22,
      confidenceScore: 91,
      outreachStatus: "Mailed",
      lastContacted: "2023-11-14",
      address: "85 Route 440, Jersey City, NJ 07305"
    },
    {
      id: "PR-1092",
      companyName: "Apex plumbing & Drain Group",
      ownerName: "Thomas Kincaid",
      industry: "Home Services",
      county: "Travis County",
      state: "TX",
      estRevenue: "$1.9M",
      estEbitda: "$380K",
      estEmployees: 12,
      confidenceScore: 82,
      outreachStatus: "Responded",
      lastContacted: "2023-11-15",
      address: "810 Barton Springs Rd, Austin, TX 78704"
    },
    {
      id: "PR-5620",
      companyName: "Northwest Specialty Glass & Mirror",
      ownerName: "Gary Oldman Jr.",
      industry: "Manufacturing",
      county: "King County",
      state: "WA",
      estRevenue: "$3.2M",
      estEbitda: "$620K",
      estEmployees: 19,
      confidenceScore: 96,
      outreachStatus: "Uncontacted",
      lastContacted: "N/A",
      address: "1515 Westlake Ave N, Seattle, WA 98109"
    },
    {
      id: "PR-9931",
      companyName: "Summit Route Systems",
      ownerName: "Genevieve Durand",
      industry: "Logistics",
      county: "Fulton County",
      state: "GA",
      estRevenue: "$2.6M",
      estEbitda: "$490K",
      estEmployees: 15,
      confidenceScore: 79,
      outreachStatus: "Disqualified",
      lastContacted: "2023-10-01",
      address: "3350 Peachtree Rd NE, Atlanta, GA 30326"
    }
  ]);

  // Mock Outreach Templates
  const [templates] = useState<CampaignTemplate[]>([
    {
      id: "TMP-01",
      name: "Acquisition Entrepreneur - Proprietary Pitch",
      type: "Email",
      subject: "Inquiry from local operator regarding {{companyName}}",
      body: "Hi {{ownerName}},\n\nI am an experienced business operator looking to personally acquire and run a service/manufacturing firm in {{county}}.\n\nI have committed equity capital and standard bank pre-approvals ready. Unlike broker-led auctions, I am looking for a direct transaction which preserves your legacy and crew.\n\nAre you open to a confidential 10-minute introductory call next Tuesday?"
    },
    {
      id: "TMP-02",
      name: "Direct Mail - High-Trust Physical Letter",
      type: "Direct Mail",
      subject: "CONFIDENTIAL INTEREST ENVELOPE",
      body: "Dear {{ownerName}},\n\nI am writing to you directly regarding your operations at {{companyName}} in {{county}}.\n\nAs an independent searcher, I have highlighted your business due to its reputation for craftsmanship and high reliability score (Est: {{estEmployees}} personnel). I have a regional LBO model structured for a 100% equity transition or structured buyout.\n\nIf you have ever contemplated succession options, please call my private line at (555) 231-9011. Your identity remains completely secure."
    }
  ]);

  // Selected state for active prospect details / preview
  const [selectedProspectId, setSelectedProspectId] = useState<string>("PR-8021");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("TMP-01");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [minEbitda, setMinEbitda] = useState<number>(0);

  // Bulk Sequence State
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Terminal initiated.",
    "[DATA] Sourced 6 local county tax registries.",
    "[OUTREACH] Connected to direct-mail printing API."
  ]);

  // Fetch unique industries
  const industries = useMemo(() => {
    return ["ALL", ...Array.from(new Set(prospects.map(p => p.industry)))];
  }, [prospects]);

  // Derived Selected Prospect
  const selectedProspect = useMemo(() => {
    return prospects.find(p => p.id === selectedProspectId) || prospects[0];
  }, [prospects, selectedProspectId]);

  // Derived Template
  const selectedTemplate = useMemo(() => {
    return templates.find(t => t.id === selectedTemplateId) || templates[0];
  }, [templates, selectedTemplateId]);

  // Parsed template live-preview logic
  const livePreviewText = useMemo(() => {
    if (!selectedProspect || !selectedTemplate) return "";
    return selectedTemplate.body
      .replace(/{{ownerName}}/g, selectedProspect.ownerName)
      .replace(/{{companyName}}/g, selectedProspect.companyName)
      .replace(/{{county}}/g, `${selectedProspect.county}, ${selectedProspect.state}`)
      .replace(/{{estEmployees}}/g, selectedProspect.estEmployees.toString())
      .replace(/{{estEbitda}}/g, selectedProspect.estEbitda);
  }, [selectedProspect, selectedTemplate]);

  // Filtering Logic
  const filteredProspects = useMemo(() => {
    return prospects.filter(p => {
      const matchesSearch = 
        p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.county.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIndustry = selectedIndustry === "ALL" || p.industry === selectedIndustry;
      const matchesStatus = selectedStatus === "ALL" || p.outreachStatus === selectedStatus;
      
      // Parse numeric EBITDA value (e.g. "$550K" -> 550)
      const numericEbitda = parseInt(p.estEbitda.replace(/[^0-9]/g, '')) * 1000;
      const matchesEbitda = numericEbitda >= minEbitda;

      return matchesSearch && matchesIndustry && matchesStatus && matchesEbitda;
    });
  }, [prospects, searchQuery, selectedIndustry, selectedStatus, minEbitda]);

  // Toggle selection for bulk actions
  const toggleSelectProspect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProspects.includes(id)) {
      setSelectedProspects(selectedProspects.filter(pId => pId !== id));
    } else {
      setSelectedProspects([...selectedProspects, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProspects.length === filteredProspects.length) {
      setSelectedProspects([]);
    } else {
      setSelectedProspects(filteredProspects.map(p => p.id));
    }
  };

  // Launch outreach action simulation
  const triggerOutreach = (prospectId: string, type: 'Email' | 'Direct Mail') => {
    setProspects(prev => prev.map(p => {
      if (p.id === prospectId) {
        return {
          ...p,
          outreachStatus: type === 'Email' ? 'Emailed' : 'Mailed',
          lastContacted: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));

    const dateStr = new Date().toLocaleTimeString();
    const targeted = prospects.find(p => p.id === prospectId);
    setLogs(prev => [
      `[${dateStr}] [OUTREACH] Sourced queue: Triggered ${type} to ${targeted?.ownerName} (${targeted?.companyName})`,
      ...prev
    ]);
  };

  const triggerBulkOutreach = () => {
    if (selectedProspects.length === 0) return;
    const type = selectedTemplate.type;
    
    setProspects(prev => prev.map(p => {
      if (selectedProspects.includes(p.id)) {
        return {
          ...p,
          outreachStatus: type === 'Email' ? 'Emailed' : 'Mailed',
          lastContacted: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));

    const dateStr = new Date().toLocaleTimeString();
    setLogs(prev => [
      `[${dateStr}] [BULK] Executed ${type} sequence for ${selectedProspects.length} targets. API print queue updated.`,
      ...prev
    ]);
    setSelectedProspects([]);
  };

  return (
    <div className="flex-grow grid grid-cols-1 xl:grid-cols-12 gap-0 border-b border-[#222] min-h-[85vh] text-[#F9F9F9] font-sans antialiased bg-[#050505]">
      
      {/* LEFT: CRITERIA BUILDER & REAL-TIME DISPATCH LOG (3 columns) */}
      <aside className="xl:col-span-3 bg-[#080808] border-r border-[#222] p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <h2 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
              <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
              ORIGINATION FILTER
            </h2>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedIndustry("ALL");
                setSelectedStatus("ALL");
                setMinEbitda(0);
              }}
              className="font-mono text-[9px] text-[#FF3333] hover:underline uppercase tracking-widest"
            >
              CLEAR CRITERIA
            </button>
          </div>

          {/* Sourcing Location Search */}
          <div className="space-y-2">
            <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">County or Entity Search</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Cobb, Cook, Travis..."
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] focus:ring-0 text-xs font-mono text-white p-3 pr-8 placeholder:text-[#444] outline-none transition-all rounded-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Industry Selection */}
          <div className="space-y-2">
            <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Target Vertical</label>
            <div className="flex flex-col gap-1">
              {industries.map((ind) => (
                <button 
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)} 
                  className={`w-full flex items-center justify-between p-2.5 font-mono text-[11px] border tracking-wider transition-all text-left rounded-none`}
                  style={{ borderRadius: '0px' }}
                  className={selectedIndustry === ind 
                    ? 'bg-[#0ea5e9]/10 border-[#0EA5E9] text-[#0EA5E9] font-bold p-2.5 text-[11px] font-mono border text-left' 
                    : 'bg-[#050505] border-[#222] text-[#888] hover:border-[#444] hover:text-[#F9F9F9] p-2.5 text-[11px] font-mono border text-left'
                  }
                >
                  <span>{ind.toUpperCase()}</span>
                  <span className="text-[9px]">{selectedIndustry === ind ? '[ACTIVE]' : '[+]'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Minimum EBITDA Capacity Selector */}
          <div className="space-y-3 bg-[#0a0a0a] p-3 border border-[#222]">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[10px] text-[#888] tracking-widest uppercase">Min Est. EBITDA</label>
              <span className="font-mono text-xs text-[#00FF66] font-bold">
                {minEbitda === 0 ? "Any volume" : `$${(minEbitda / 1000).toFixed(0)}K`}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1000000" 
              step="100000" 
              value={minEbitda}
              onChange={(e) => setMinEbitda(Number(e.target.value))}
              className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
            />
            <div className="flex justify-between text-[8px] font-mono text-neutral-600">
              <span>$0</span>
              <span>$500K</span>
              <span>$1.0M</span>
            </div>
          </div>

          {/* Lead Status Filter */}
          <div className="space-y-2">
            <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Outreach Stage</label>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-[#F9F9F9] p-3 focus:outline-none transition-all rounded-none"
              style={{ borderRadius: '0px' }}
            >
              <option value="ALL">All Contact Stages</option>
              <option value="Uncontacted">Uncontacted (Cold)</option>
              <option value="Emailed">Email Sequence Initiated</option>
              <option value="Mailed">Direct Mail Dispatched</option>
              <option value="Responded">Inbound Response Received</option>
              <option value="Disqualified">Disqualified Prospect</option>
            </select>
          </div>
        </div>

        {/* Real-time Dispatch Console Log */}
        <div className="pt-6 border-t border-[#1a1a1a] space-y-3">
          <div className="p-3 bg-black border border-[#222]">
            <div className="text-[9px] font-mono text-[#00FF66] font-bold tracking-wider flex items-center justify-between">
              <span>TERMINAL TELEMETRY LOG</span>
              <span className="inline-block w-2 h-2 bg-[#00FF66] animate-pulse"></span>
            </div>
            <div className="mt-2 h-28 overflow-y-auto font-mono text-[9px] text-[#888] space-y-1.5 leading-tight scrollbar-thin">
              {logs.map((log, index) => (
                <div key={index} className="border-b border-neutral-900/50 pb-1 break-words">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER: DYNAMIC OFF-MARKET CARDS GRID (5 columns) */}
      <section className="xl:col-span-5 bg-[#050505] p-6 flex flex-col space-y-6">
        {/* Header & Control Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#222] pb-4">
          <div>
            <h2 className="font-mono text-sm font-bold text-[#F9F9F9] tracking-tight flex items-center gap-2">
              Sourced Targets ({filteredProspects.length} Matches)
            </h2>
            <p className="text-xs text-[#888] font-mono">Select off-market entities for custom sequencing</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSelectAll}
              className="text-[10px] font-mono bg-[#111] border border-[#222] px-2.5 py-1.5 text-white hover:border-[#444] transition-all"
            >
              {selectedProspects.length === filteredProspects.length ? 'Deselect All' : 'Select All Listed'}
            </button>
          </div>
        </div>

        {/* Bulk Action Alert Strip */}
        {selectedProspects.length > 0 && (
          <div className="bg-[#0ea5e9]/10 border border-[#0EA5E9] p-3.5 flex items-center justify-between animate-fadeIn">
            <span className="font-mono text-[11px] text-[#0ea5e9]">
              [BULK STAGING] {selectedProspects.length} off-market entities locked. Ready for <span className="underline font-bold" x-text="selectedTemplate.type">{selectedTemplate.type}</span> blast.
            </span>
            <button 
              onClick={triggerBulkOutreach}
              className="bg-[#0EA5E9] text-black font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-wider hover:bg-white transition-all"
            >
              Commit Sequence
            </button>
          </div>
        )}

        {/* Card Stream Grid */}
        <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[62vh] pr-2">
          {filteredProspects.map((prospect) => {
            const isSelected = selectedProspectId === prospect.id;
            const isBulkChecked = selectedProspects.includes(prospect.id);
            
            return (
              <div 
                key={prospect.id}
                onClick={() => setSelectedProspectId(prospect.id)}
                className={`group border transition-all duration-300 relative p-4 flex flex-col justify-between cursor-pointer ${
                  isSelected 
                    ? 'border-[#0EA5E9] bg-[#0ea5e9]/5' 
                    : 'border-[#222] bg-[#080808] hover:border-[#444]'
                }`}
                style={{ borderRadius: '0px' }}
              >
                {/* Active selection border line overlay */}
                <div className={`absolute top-0 left-0 w-full h-[2px] ${isSelected ? 'bg-[#0EA5E9]' : 'bg-transparent'}`}></div>

                {/* Card Header metadata */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Checkbox trigger for bulk outreach */}
                    <button
                      onClick={(e) => toggleSelectProspect(prospect.id, e)}
                      className={`w-4 h-4 border flex items-center justify-center transition-all ${
                        isBulkChecked ? 'border-[#00FF66] bg-[#00FF66]/20' : 'border-[#444] hover:border-[#0EA5E9]'
                      }`}
                      style={{ borderRadius: '0px' }}
                    >
                      {isBulkChecked && <span className="w-2 h-2 bg-[#00FF66]"></span>}
                    </button>
                    <div>
                      <span className="bg-[#111] border border-[#222] px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider text-[#888] mr-2">
                        {prospect.id}
                      </span>
                      <span className="text-[10px] text-[#0EA5E9] font-mono tracking-wider font-semibold uppercase">
                        {prospect.industry}
                      </span>
                    </div>
                  </div>

                  {/* Operational Quality Score badge */}
                  <div className="text-right">
                    <div className="text-[8px] text-[#444] font-mono uppercase">Confidence Score</div>
                    <div className="text-xs font-mono font-bold text-[#00FF66]">{prospect.confidenceScore}%</div>
                  </div>
                </div>

                {/* Company Name & Owner */}
                <div className="my-2.5">
                  <h3 className="font-mono text-sm font-bold text-[#F9F9F9] group-hover:text-[#00FF66] transition-colors">
                    {prospect.companyName}
                  </h3>
                  <div className="text-[11px] font-mono text-[#888] mt-1 flex items-center justify-between">
                    <span>Owner: {prospect.ownerName}</span>
                    <span className="text-white/60 text-[10px]">{prospect.county}, {prospect.state}</span>
                  </div>
                </div>

                {/* Financial Pillars (Revenue, Est EBITDA, Employee Density) */}
                <div className="grid grid-cols-3 gap-px bg-[#222] border border-[#222] font-mono text-center my-2">
                  <div className="bg-black p-1.5">
                    <div className="text-[8px] text-[#888]">EST REVENUE</div>
                    <div className="text-[10px] font-semibold text-white">{prospect.estRevenue}</div>
                  </div>
                  <div className="bg-black p-1.5">
                    <div className="text-[8px] text-[#888]">EST EBITDA</div>
                    <div className="text-[10px] font-semibold text-[#00FF66]">{prospect.estEbitda}</div>
                  </div>
                  <div className="bg-black p-1.5">
                    <div className="text-[8px] text-[#888]">STAFF SIZE</div>
                    <div className="text-[10px] font-semibold text-[#0ea5e9]">{prospect.estEmployees} FTE</div>
                  </div>
                </div>

                {/* Status Indicator Bar */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#111]">
                  <div className="flex items-center space-x-2 text-[9px] font-mono">
                    <span className="text-[#888]">STATUS:</span>
                    <span className={`font-bold px-1.5 py-0.5 ${
                      prospect.outreachStatus === 'Uncontacted' ? 'bg-[#222] text-white' :
                      prospect.outreachStatus === 'Emailed' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0ea5e9]/20' :
                      prospect.outreachStatus === 'Mailed' ? 'bg-[#854d0e]/10 text-yellow-500 border border-yellow-500/20' :
                      prospect.outreachStatus === 'Responded' ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00ff66]/20 font-black' :
                      'bg-red-950/20 text-[#FF3333]'
                    }`}>
                      {prospect.outreachStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-neutral-500">
                    Last Contact: {prospect.lastContacted}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProspects.length === 0 && (
            <div className="border border-dashed border-[#222] p-12 text-center">
              <div className="text-[#FF3333] font-mono text-xs font-bold tracking-widest uppercase">
                ZERO PROSPECTS MATCH CRITERIA
              </div>
              <p className="text-xs text-[#888] font-mono mt-2">
                Expand your EBITDA parameters, check spelling, or select an alternative geographic query.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* RIGHT: OUTREACH CUSTOMIZER & LIVE PREVIEW DESK (4 columns) */}
      <section className="xl:col-span-4 bg-[#080808] border-l border-[#222] p-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-[#222] pb-3">
            <h2 className="font-mono text-xs font-bold tracking-wider text-[#00FF66] flex items-center gap-2">
              <span className="inline-block w-1.5 h-3 bg-[#00FF66]"></span>
              OUTREACH PERSISTENCE DESK
            </h2>
            <p className="text-xs text-[#888] font-mono mt-0.5">Automated variables binding preview tool</p>
          </div>

          {/* Quick Stats Panel */}
          <div className="grid grid-cols-2 gap-px bg-[#222] text-left font-mono text-xs">
            <div className="bg-[#050505] p-3">
              <div className="text-[8px] text-[#888]">CAMPAIGN CHANNELS</div>
              <div className="text-xs font-bold text-[#0EA5E9] mt-1">DIRECT MAIL & EMAIL</div>
            </div>
            <div className="bg-[#050505] p-3">
              <div className="text-[8px] text-[#888]">SUCCESS MATRIX (CR)</div>
              <div className="text-xs font-bold text-[#00FF66] mt-1">~18.4% RESPONSE</div>
            </div>
          </div>

          {/* Active Template Selector */}
          <div className="space-y-2">
            <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Outreach Template</label>
            <div className="space-y-2">
              {templates.map((temp) => (
                <button
                  key={temp.id}
                  onClick={() => setSelectedTemplateId(temp.id)}
                  className={`w-full p-3 border font-mono text-left transition-all relative ${
                    selectedTemplateId === temp.id 
                      ? 'bg-[#00ff66]/5 border-[#00FF66] text-white' 
                      : 'bg-[#050505] border-[#222] text-[#888] hover:border-[#444]'
                  }`}
                  style={{ borderRadius: '0px' }}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold">{temp.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 ${temp.type === 'Email' ? 'bg-[#0ea5e9]/20 text-[#0ea5e9]' : 'bg-[#eab308]/20 text-yellow-500'}`}>
                      {temp.type.toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Spliced Code/Live Output Frame */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Compiled Dynamic Message</label>
              <span className="text-[9px] font-mono text-[#00FF66]">[STAGED PROSPECT: {selectedProspect?.id}]</span>
            </div>

            <div className="border border-[#222] bg-[#050505] p-4 font-mono text-xs text-[#F9F9F9]/90 space-y-3 leading-relaxed relative min-h-[16rem]">
              <div className="absolute top-2 right-2 text-[8px] bg-[#111] px-1.5 py-0.5 text-[#888] border border-[#222]">
                PREVIEW ONLY
              </div>
              <div>
                <span className="text-[#888] block text-[10px] uppercase border-b border-[#222] pb-1.5 mb-2">
                  {selectedTemplate?.type === 'Email' ? `Subject: ${selectedTemplate.subject.replace('{{companyName}}', selectedProspect?.companyName || '')}` : `Cover Class: Direct Letter`}
                </span>
                <p className="whitespace-pre-line text-[11px] leading-relaxed">
                  {livePreviewText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch Action Panel */}
        <div className="pt-6 border-t border-[#222] space-y-4 bg-[#0a0a0a] p-4 mt-6">
          <div className="text-[10px] font-mono text-[#888] leading-tight space-y-1">
            <div className="flex justify-between">
              <span>Selected Entity:</span>
              <span className="text-white font-bold">{selectedProspect?.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span>Owner Node:</span>
              <span className="text-white">{selectedProspect?.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Target Coordinates:</span>
              <span className="text-[#0ea5e9]">{selectedProspect?.county}, {selectedProspect?.state}</span>
            </div>
          </div>

          {selectedProspect && (
            <button 
              onClick={() => triggerOutreach(selectedProspect.id, selectedTemplate.type)}
              className="w-full bg-[#00FF66] text-black font-mono text-xs font-bold py-3.5 tracking-widest hover:bg-white transition-all uppercase flex items-center justify-center space-x-2"
              style={{ borderRadius: '0px' }}
            >
              <span>Transmit {selectedTemplate.type === 'Email' ? 'Email Pipeline' : 'Direct Mail Letter'}</span>
              <span>&rarr;</span>
            </button>
          )}
        </div>
      </section>

    </div>
  );
}