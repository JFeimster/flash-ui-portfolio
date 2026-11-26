import React, { useState, useEffect } from 'react';

// Interfaces for Sourcing and Campaign CRM Engine
interface Prospect {
  id: string;
  companyName: string;
  ownerName: string;
  industry: string;
  county: string;
  state: string;
  estimatedRevenue: string;
  estimatedEbitda: string;
  estimatedSde: string;
  ownerAgeEstimate: number;
  lastActiveDate: string;
  outreachStage: 'UNCONTACTED' | 'EMAIL_SENT' | 'MAIL_DISPATCHED' | 'RESPONDED' | 'NDA_STAGE' | 'DEAD';
  verifiedContact: {
    email: string;
    phone: string;
    physicalAddress: string;
  };
  selectionWeight: number; // 0-100 score for ETA acquisition compatibility
}

interface CampaignLog {
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  message: string;
}

export default function CampaignPipeline() {
  // Navigation / Tab state
  const [activeTab, setActiveTab] = useState<'finder' | 'builder' | 'pipeline' | 'console'>('finder');

  // Search/Filter State
  const [targetState, setTargetState] = useState<string>('VA');
  const [targetCounty, setTargetCounty] = useState<string>('Fairfax');
  const [targetIndustry, setTargetIndustry] = useState<string>('HVAC');
  const [minEbitda, setMinEbitda] = useState<number>(300000);
  const [maxEbitda, setMaxEbitda] = useState<number>(1500000);
  const [transitionRiskOnly, setTransitionRiskOnly] = useState<boolean>(true);

  // Campaign template states
  const [selectedChannel, setSelectedChannel] = useState<'EMAIL' | 'DIRECT_MAIL'>('EMAIL');
  const [emailSubject, setEmailSubject] = useState<string>('Proprietary Interest: Confidential Acquisition Proposal — {{CompanyName}}');
  const [templateBody, setTemplateBody] = useState<string>(
    "Dear {{OwnerName}},\n\nI am an individual acquisition entrepreneur funded by a select group of family offices. I've been studying the {{Industry}} footprint in {{County}} County and am highly impressed by the reputation you've built at {{CompanyName}}.\n\nWe structure high-leverage transactions that preserve founder legacies, offering transition timelines from 3 to 12 months. Our models support SBA 7(a) amortization and significant cash-at-close. If you have ever considered a succession event, I would appreciate a 15-minute confidential call.\n\nRespectfully,\nAlex Mercer\nManaging Partner, Apex Capital Partners"
  );

  // Mock Database of Off-Market Prospects
  const [prospects, setProspects] = useState<Prospect[]>([
    {
      id: "PR-9081",
      companyName: "Fairfax Mechanical & Cooling Services",
      ownerName: "Arthur Vance",
      industry: "HVAC",
      county: "Fairfax",
      state: "VA",
      estimatedRevenue: "$2.8M",
      estimatedEbitda: "$620K",
      estimatedSde: "$710K",
      ownerAgeEstimate: 66,
      lastActiveDate: "2024-02-14",
      outreachStage: "UNCONTACTED",
      verifiedContact: {
        email: "a.vance@fairfaxmechanical.com",
        phone: "(703) 555-0192",
        physicalAddress: "8402 Tyco Rd, Vienna, VA 22182"
      },
      selectionWeight: 89
    },
    {
      id: "PR-3104",
      companyName: "Nova Precision Logistics Solutions",
      ownerName: "Robert 'Bob' Chen",
      industry: "Logistics",
      county: "Fairfax",
      state: "VA",
      estimatedRevenue: "$4.1M",
      estimatedEbitda: "$850K",
      estimatedSde: "$920K",
      ownerAgeEstimate: 62,
      lastActiveDate: "2024-01-29",
      outreachStage: "EMAIL_SENT",
      verifiedContact: {
        email: "bchen@novaprecisionlog.com",
        phone: "(703) 555-8831",
        physicalAddress: "11250 Roger Bacon Dr, Reston, VA 20190"
      },
      selectionWeight: 94
    },
    {
      id: "PR-7741",
      companyName: "Arlington Plumbing Grid Corp",
      ownerName: "Gary Miller",
      industry: "Home Services",
      county: "Arlington",
      state: "VA",
      estimatedRevenue: "$1.9M",
      estimatedEbitda: "$410K",
      estimatedSde: "$480K",
      ownerAgeEstimate: 71,
      lastActiveDate: "2024-02-10",
      outreachStage: "RESPONDED",
      verifiedContact: {
        email: "gmiller@arlplumbing.net",
        phone: "(703) 555-4001",
        physicalAddress: "3100 Columbia Pike, Arlington, VA 22204"
      },
      selectionWeight: 97
    },
    {
      id: "PR-4521",
      companyName: "Loudoun Industrial Air Systems",
      ownerName: "Thomas Henderson",
      industry: "HVAC",
      county: "Loudoun",
      state: "VA",
      estimatedRevenue: "$3.4M",
      estimatedEbitda: "$790K",
      estimatedSde: "$820K",
      ownerAgeEstimate: 58,
      lastActiveDate: "2024-02-01",
      outreachStage: "UNCONTACTED",
      verifiedContact: {
        email: "t.henderson@loudounair.com",
        phone: "(571) 555-1212",
        physicalAddress: "22821 Silverbrook Center Dr, Sterling, VA 20166"
      },
      selectionWeight: 78
    },
    {
      id: "PR-1192",
      companyName: "Vienna Air Control Corp",
      ownerName: "Marcus Brody",
      industry: "HVAC",
      county: "Fairfax",
      state: "VA",
      estimatedRevenue: "$1.7M",
      estimatedEbitda: "$380K",
      estimatedSde: "$420K",
      ownerAgeEstimate: 68,
      lastActiveDate: "2024-02-18",
      outreachStage: "MAIL_DISPATCHED",
      verifiedContact: {
        email: "m.brody@viennaair.com",
        phone: "(703) 555-9011",
        physicalAddress: "205 Maple Ave W, Vienna, VA 22180"
      },
      selectionWeight: 85
    }
  ]);

  // Selected prospects state for campaign queuing
  const [selectedProspectIds, setSelectedProspectIds] = useState<string[]>(["PR-9081", "PR-4521"]);

  // Interactive Live Console Log entries
  const [logs, setLogs] = useState<CampaignLog[]>([
    { timestamp: "14:22:01", type: "INFO", message: "Off-market county tax records scraped. 24 new candidate records parsed." },
    { timestamp: "14:22:05", type: "SUCCESS", message: "Owner contact data verified via SHA-256 Plaid & ZoomInfo micro-lookups." },
    { timestamp: "14:25:10", type: "INFO", message: "System idle. Ready to deploy targeted mail/email templates." }
  ]);

  // Stats Counters
  const [isMining, setIsMining] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Time ticker
  const [currentTime, setCurrentTime] = useState<string>("14:25:32");
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT', message: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [{ timestamp, type, message }, ...prev].slice(0, 40));
  };

  // Simulate County Scrape / Mining operation
  const triggerScrapeSimulation = () => {
    setIsMining(true);
    addLog("INFO", `Querying ${targetState} county database (Focus: ${targetCounty} County / Sector: ${targetIndustry})...`);
    
    setTimeout(() => {
      // Add a simulated new lead to the list
      const newLead: Prospect = {
        id: `PR-${Math.floor(1000 + Math.random() * 9000)}`,
        companyName: `${targetCounty} ${targetIndustry} Enterprises`,
        ownerName: "Donald 'Don' Higgins",
        industry: targetIndustry,
        county: targetCounty,
        state: targetState,
        estimatedRevenue: "$2.5M",
        estimatedEbitda: "$520K",
        estimatedSde: "$590K",
        ownerAgeEstimate: 69,
        lastActiveDate: new Date().toISOString().split('T')[0],
        outreachStage: "UNCONTACTED",
        verifiedContact: {
          email: "dhiggins@novaoutsource.com",
          phone: "(703) 555-1982",
          physicalAddress: "9100 Leesburg Pike, Herndon, VA 20170"
        },
        selectionWeight: 92
      };

      setProspects(prev => [newLead, ...prev]);
      setIsMining(false);
      addLog("SUCCESS", `Mining operation completed. Dynamic SDE/EBITDA models matched: ${newLead.companyName} (${newLead.estimatedEbitda} SDE) Added.`);
    }, 2000);
  };

  // Simulate Bulk Deployment of direct mail or email
  const triggerOutreachDeployment = () => {
    if (selectedProspectIds.length === 0) {
      addLog("WARNING", "Outreach failed: No verified targets checked in the pipeline.");
      return;
    }
    
    setIsDeploying(true);
    addLog("INFO", `Initiating secure dispatch protocol via ${selectedChannel} for ${selectedProspectIds.length} target companies...`);

    setTimeout(() => {
      setProspects(prev => prev.map(p => {
        if (selectedProspectIds.includes(p.id)) {
          return {
            ...p,
            outreachStage: selectedChannel === 'EMAIL' ? 'EMAIL_SENT' : 'MAIL_DISPATCHED'
          };
        }
        return p;
      }));
      
      setIsDeploying(false);
      addLog("SUCCESS", `Transmission confirmed. ${selectedProspectIds.length} custom messages injected into active sequential campaign.`);
      setSelectedProspectIds([]);
    }, 1800);
  };

  const toggleSelectProspect = (id: string) => {
    if (selectedProspectIds.includes(id)) {
      setSelectedProspectIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedProspectIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] border border-[#222] overflow-hidden flex flex-col font-sans w-full max-w-7xl mx-auto">
      {/* 1. COMPONENT CONTROL SUB-HEADER */}
      <div className="bg-black border-b border-[#222] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#00FF66] text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-tighter">OFF-MARKET COMPLIANT</span>
            <span className="text-[10px] font-mono text-[#0EA5E9] tracking-widest font-bold">OUTBOUND DEPLOYMENT MATRIX</span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-white mt-1">
            ETA OFF-MARKET <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F9F9] via-[#0EA5E9] to-[#00FF66]">SOURCING ENGINE</span>
          </h2>
        </div>

        {/* Localized Live stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#222] text-left font-mono text-xs w-full md:w-auto">
          <div className="bg-[#0c0c0c] p-2 px-3">
            <div className="text-[9px] text-[#888]">TOTAL IN SYSTEM</div>
            <div className="text-sm font-bold text-[#F9F9F9]">{prospects.length} targets</div>
          </div>
          <div className="bg-[#0c0c0c] p-2 px-3">
            <div className="text-[9px] text-[#888]">AVG ACQ WEIGHT</div>
            <div className="text-sm font-bold text-[#00FF66]">88.4 / 100</div>
          </div>
          <div className="bg-[#0c0c0c] p-2 px-3">
            <div className="text-[9px] text-[#888]">REPLY RATE SDE</div>
            <div className="text-sm font-bold text-[#0EA5E9]">14.2%</div>
          </div>
          <div className="bg-[#0c0c0c] p-2 px-3">
            <div className="text-[9px] text-[#888]">SELECTED SYSTEM</div>
            <div className="text-sm font-bold text-[#FF3333]">{selectedProspectIds.length} queued</div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex bg-[#080808] border-b border-[#222] text-xs font-mono">
        <button 
          onClick={() => setActiveTab('finder')}
          className={`px-5 py-3 border-r border-[#222] flex items-center gap-2 tracking-wider uppercase transition-all ${activeTab === 'finder' ? 'bg-[#050505] text-[#0ea5e9] border-t-2 border-t-[#0ea5e9] font-bold' : 'text-[#888] hover:text-white'}`}
        >
          <span className="w-1.5 h-1.5 bg-[#0ea5e9]"></span>
          1. County Filter & Miner
        </button>
        <button 
          onClick={() => setActiveTab('builder')}
          className={`px-5 py-3 border-r border-[#222] flex items-center gap-2 tracking-wider uppercase transition-all ${activeTab === 'builder' ? 'bg-[#050505] text-[#00FF66] border-t-2 border-t-[#00FF66] font-bold' : 'text-[#888] hover:text-white'}`}
        >
          <span className="w-1.5 h-1.5 bg-[#00FF66]"></span>
          2. Campaign & Creative Architect
        </button>
        <button 
          onClick={() => setActiveTab('pipeline')}
          className={`px-5 py-3 border-r border-[#222] flex items-center gap-2 tracking-wider uppercase transition-all ${activeTab === 'pipeline' ? 'bg-[#050505] text-[#FF3333] border-t-2 border-t-[#FF3333] font-bold' : 'text-[#888] hover:text-white'}`}
        >
          <span className="w-1.5 h-1.5 bg-[#FF3333]"></span>
          3. Sourcing CRM Grid
        </button>
        <button 
          onClick={() => setActiveTab('console')}
          className={`px-5 py-3 border-r border-[#222] flex items-center gap-2 tracking-wider uppercase transition-all ${activeTab === 'console' ? 'bg-[#050505] text-yellow-500 border-t-2 border-t-yellow-500 font-bold' : 'text-[#888] hover:text-white'}`}
        >
          <span className="w-1.5 h-1.5 bg-yellow-500"></span>
          Live API Logs
        </button>
      </div>

      {/* 3. WORKSPACE SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT INSIGHTS / FILTERS (Common Across Sourcing Engine) */}
        <aside className="lg:col-span-4 bg-[#080808] border-r border-[#222] p-5 space-y-5">
          
          <div className="border-b border-[#222] pb-3">
            <h3 className="font-mono text-[10px] font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
              <span class="inline-block w-1 h-2 bg-[#0EA5E9]"></span>
              SEARCH PARAMETERS
            </h3>
          </div>

          <div className="space-y-4">
            {/* Geographic Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-mono text-[9px] text-[#888] uppercase">Target State</label>
                <select 
                  value={targetState}
                  onChange={(e) => setTargetState(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none"
                >
                  <option value="VA">Virginia (VA)</option>
                  <option value="NC">North Carolina (NC)</option>
                  <option value="GA">Georgia (GA)</option>
                  <option value="TX">Texas (TX)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[9px] text-[#888] uppercase">County/City Hub</label>
                <input 
                  type="text" 
                  value={targetCounty}
                  onChange={(e) => setTargetCounty(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none"
                  placeholder="Fairfax"
                />
              </div>
            </div>

            {/* Sector / Industry Selector */}
            <div className="space-y-1">
              <label className="block font-mono text-[9px] text-[#888] uppercase">Target Industrial Sector</label>
              <select 
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-[#F9F9F9] p-2.5 focus:outline-none"
              >
                <option value="HVAC">HVAC & Mechanical</option>
                <option value="Logistics">Specialty Logistics / Freight</option>
                <option value="Home Services">Plumbing & Home Services</option>
                <option value="SaaS">Micro-B2B SaaS</option>
              </select>
            </div>

            {/* SDE/EBITDA Range Filters */}
            <div className="space-y-2 bg-[#050505] p-3 border border-[#222]">
              <span className="block font-mono text-[9px] text-[#888] uppercase">Target EBITDA Range</span>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#00FF66]">${(minEbitda/1000).toFixed(0)}K</span>
                <span className="text-[#888]">&harr;</span>
                <span className="text-[#0ea5e9]">${(maxEbitda/1000).toFixed(0)}K</span>
              </div>
              <input 
                type="range" 
                min="100000" 
                max="2000000" 
                step="50000" 
                value={maxEbitda}
                onChange={(e) => setMaxEbitda(Number(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
              />
              <p className="text-[8px] font-mono text-neutral-600">Calculated on average tax asset multipliers for structural 1031 / SBA viability.</p>
            </div>

            {/* Structural Transition Filters */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-[#050505] border border-[#222]">
                <span className="font-mono text-[9px] text-[#888] uppercase">Transition Age Focus (Age &gt; 60)</span>
                <button 
                  onClick={() => setTransitionRiskOnly(!transitionRiskOnly)}
                  className="w-10 h-5 border transition-colors flex items-center px-1"
                  style={{ borderColor: transitionRiskOnly ? '#00FF66' : '#222', backgroundColor: transitionRiskOnly ? 'rgba(0, 255, 102, 0.1)' : 'black' }}
                >
                  <span className="w-3 h-3 bg-[#00FF66]" style={{ marginLeft: transitionRiskOnly ? 'auto' : '0px' }}></span>
                </button>
              </div>
            </div>

            {/* Trigger County Scrape Button */}
            <button 
              onClick={triggerScrapeSimulation}
              disabled={isMining}
              className={`w-full py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 ${isMining ? 'bg-[#222] text-[#888] cursor-not-allowed' : 'bg-[#0ea5e9] text-black hover:bg-[#F9F9F9]'}`}
              style={{ borderRadius: '0px' }}
            >
              {isMining ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-t-transparent border-[#888] animate-spin"></span>
                  <span>SCRAPING COUNTY TAX MATRIX...</span>
                </>
              ) : (
                <>
                  <span>RUN PROPRIETARY SCRAPER</span>
                  <span>&rarr;</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="pt-4 border-t border-[#1a1a1a] space-y-2">
            <span className="block font-mono text-[9px] text-[#888] uppercase tracking-wider">Outbound Metrics</span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#050505] p-2 border border-[#222] font-mono">
                <div className="text-[8px] text-[#888]">DISPATCH LIMIT</div>
                <div className="text-xs font-semibold text-[#00FF66]">1,500/Mo</div>
              </div>
              <div className="bg-[#050505] p-2 border border-[#222] font-mono">
                <div className="text-[8px] text-[#888]">SUCCESS RATE</div>
                <div className="text-xs font-semibold text-[#0ea5e9]">3.4x Market</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="lg:col-span-8 p-6 space-y-6 min-h-[500px]">
          
          {/* TAB 1: COUNTY FILTER & MINER */}
          {activeTab === 'finder' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#222] pb-2">
                <div>
                  <h3 className="font-mono text-xs font-bold tracking-wider text-[#0ea5e9] uppercase">Verified Sourcing Scrape Targets</h3>
                  <p className="text-[11px] text-[#888] font-mono">Select candidates to populate into sequence pipelines.</p>
                </div>
                <span className="text-xs font-mono text-[#00FF66]">[Ready to Campaign]</span>
              </div>

              {/* Targets List (Filtered View) */}
              <div className="space-y-3">
                {prospects.map((p) => {
                  const isChecked = selectedProspectIds.includes(p.id);
                  return (
                    <div 
                      key={p.id}
                      className="bg-[#080808] border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                      style={{ borderColor: isChecked ? '#0ea5e9' : '#222' }}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Custom Checkbox */}
                        <button 
                          onClick={() => toggleSelectProspect(p.id)}
                          className="w-5 h-5 border flex items-center justify-center transition-all mt-1"
                          style={{ borderColor: isChecked ? '#0ea5e9' : '#333', backgroundColor: isChecked ? 'rgba(14, 165, 233, 0.15)' : 'transparent' }}
                        >
                          {isChecked && <div className="w-2.5 h-2.5 bg-[#0ea5e9]"></div>}
                        </button>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono text-[#888]">{p.id}</span>
                            <span className="text-xs font-mono text-[#00FF66] font-semibold">[{p.selectionWeight}/100 ETA Score]</span>
                          </div>
                          <h4 className="text-sm font-bold font-mono text-white mt-0.5">{p.companyName}</h4>
                          <p className="text-xs text-[#888] font-mono mt-0.5">
                            Owner: <span className="text-white">{p.ownerName}</span> ({p.ownerAgeEstimate} y/o) &bull; County: <span className="text-white">{p.county}, {p.state}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end text-left md:text-right space-y-1 font-mono">
                        <div className="text-xs text-[#888]">
                          Est. Revenue: <span className="text-white font-semibold">{p.estimatedRevenue}</span>
                        </div>
                        <div className="text-xs text-[#888]">
                          Est. SDE: <span className="text-[#0ea5e9] font-semibold">{p.estimatedSde}</span>
                        </div>
                        <div className="text-[10px] text-[#888] bg-[#111] px-2 py-0.5 border border-[#222] inline-block uppercase">
                          Stage: {p.outreachStage.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar for Finder */}
              <div className="p-4 bg-[#080808] border border-[#222] flex flex-col md:flex-row justify-between items-center gap-4">
                <span className="text-xs font-mono text-[#888]">
                  Selected <span className="text-white font-bold">{selectedProspectIds.length}</span> out of {prospects.length} total candidates.
                </span>
                <button 
                  onClick={() => setActiveTab('builder')}
                  className="px-5 py-2.5 bg-[#00FF66] text-black font-mono text-xs font-bold tracking-wider uppercase hover:bg-white transition-all"
                  style={{ borderRadius: '0px' }}
                >
                  Step 2: Design Campaign Template &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPAIGN & CREATIVE ARCHITECT */}
          {activeTab === 'builder' && (
            <div className="space-y-5">
              <div className="border-b border-[#222] pb-2">
                <h3 className="font-mono text-xs font-bold tracking-wider text-[#00FF66] uppercase">Channel Deployment Selection & Template Engine</h3>
                <p className="text-[11px] text-[#888] font-mono">Variables allowed: <code className="text-[#0ea5e9] font-bold">{"{{OwnerName}}"}</code>, <code className="text-[#00FF66] font-bold">{"{{CompanyName}}"}</code>, <code className="text-purple-400 font-bold">{"{{County}}"}</code>, <code className="text-yellow-500 font-bold">{"{{Industry}}"}</code></p>
              </div>

              {/* Channel Selector Pills */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setSelectedChannel('EMAIL')}
                  className="p-4 border transition-all text-left flex flex-col justify-between"
                  style={{ borderColor: selectedChannel === 'EMAIL' ? '#00FF66' : '#222', backgroundColor: selectedChannel === 'EMAIL' ? 'rgba(0, 255, 102, 0.05)' : 'transparent' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">SMTP VERIFIED COLD EMAIL</span>
                    <span className="w-3 h-3 rounded-none bg-[#00FF66]" style={{ opacity: selectedChannel === 'EMAIL' ? 1 : 0.2 }}></span>
                  </div>
                  <p className="text-[10px] text-[#888] font-mono mt-2">Zero-bounce, automated sending with integrated SPF/DKIM validation.</p>
                </button>

                <button 
                  onClick={() => setSelectedChannel('DIRECT_MAIL')}
                  className="p-4 border transition-all text-left flex flex-col justify-between"
                  style={{ borderColor: selectedChannel === 'DIRECT_MAIL' ? '#0ea5e9' : '#222', backgroundColor: selectedChannel === 'DIRECT_MAIL' ? 'rgba(14, 165, 233, 0.05)' : 'transparent' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">AUTOMATED DIRECT PHYSICAL MAIL</span>
                    <span className="w-3 h-3 rounded-none bg-[#0ea5e9]" style={{ opacity: selectedChannel === 'DIRECT_MAIL' ? 1 : 0.2 }}></span>
                  </div>
                  <p className="text-[10px] text-[#888] font-mono mt-2">Lump-sum direct mail targeting physical commercial addresses.</p>
                </button>
              </div>

              {/* Template Editor Block */}
              <div className="space-y-3 bg-[#080808] p-4 border border-[#222]">
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-[#888] uppercase">Email Subject / Mail Header Line</label>
                  <input 
                    type="text" 
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none"
                    placeholder="Subject Header Line"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-[#888] uppercase">Outreach Template Body</label>
                  <textarea 
                    rows={8}
                    value={templateBody}
                    onChange={(e) => setTemplateBody(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2.5 outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Outbound Dispatch Confirm Block */}
              <div className="bg-black border border-[#FF3333]/30 p-4 space-y-3">
                <h4 className="font-mono text-xs font-bold text-[#FF3333] tracking-wider uppercase">[CRITICAL OUTBOUND DEPLOYMENT ACTION]</h4>
                <p className="text-xs text-[#888] font-mono leading-relaxed">
                  You are preparing to dispatch a live sequence to <span className="text-[#00FF66] font-bold">{selectedProspectIds.length} checked target companies</span>. This operation complies strictly with state-level successorship solicitation legal structures.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs font-mono text-neutral-400">Queue Status: {selectedProspectIds.length} target records locked</span>
                  <button 
                    onClick={triggerOutreachDeployment}
                    disabled={isDeploying}
                    className={`w-full md:w-auto px-6 py-3 font-mono text-xs font-bold uppercase transition-all tracking-wider ${isDeploying ? 'bg-[#222] text-[#888]' : 'bg-[#FF3333] hover:bg-white text-white hover:text-black'}`}
                    style={{ borderRadius: '0px' }}
                  >
                    {isDeploying ? 'DISPATCHING LIVE SEQUENCE...' : 'FIRE INTERACTIVE OUTBOUND CAMPAIGN'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CRM PIPELINE GRID */}
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="border-b border-[#222] pb-2">
                <h3 className="font-mono text-xs font-bold tracking-wider text-[#FF3333] uppercase">Sourcing Pipeline / Direct Negotiation CRM</h3>
                <p className="text-[11px] text-[#888] font-mono">Interactive tracking of owner communications and NDA successions.</p>
              </div>

              {/* Dynamic CRM Board */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Column 1: Uncontacted/Queued */}
                <div className="bg-[#080808] border border-[#222] p-3 flex flex-col space-y-3">
                  <div className="border-b border-[#222] pb-1 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-[#888] uppercase">1. Targeted & Scraped</span>
                    <span className="text-[#0ea5e9]">({prospects.filter(p => p.outreachStage === 'UNCONTACTED').length})</span>
                  </div>
                  <div className="space-y-2 overflow-y-auto max-h-[300px]">
                    {prospects.filter(p => p.outreachStage === 'UNCONTACTED').map(p => (
                      <div key={p.id} className="bg-black p-2.5 border border-[#222] space-y-1">
                        <span className="text-[9px] font-mono text-gray-500">{p.id}</span>
                        <div className="text-xs font-bold font-mono text-white truncate">{p.companyName}</div>
                        <div className="text-[10px] text-[#888] font-mono">SDE: <span className="text-[#00FF66] font-bold">{p.estimatedSde}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Active Sourcing */}
                <div className="bg-[#080808] border border-[#222] p-3 flex flex-col space-y-3">
                  <div className="border-b border-[#222] pb-1 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-[#00FF66] uppercase">2. Active Sequences</span>
                    <span className="text-[#00FF66]">({prospects.filter(p => p.outreachStage === 'EMAIL_SENT' || p.outreachStage === 'MAIL_DISPATCHED').length})</span>
                  </div>
                  <div className="space-y-2 overflow-y-auto max-h-[300px]">
                    {prospects.filter(p => p.outreachStage === 'EMAIL_SENT' || p.outreachStage === 'MAIL_DISPATCHED').map(p => (
                      <div key={p.id} className="bg-black p-2.5 border border-[#222] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-gray-500">{p.id}</span>
                          <span className="text-[8px] bg-blue-900/40 text-[#0ea5e9] px-1 font-mono">OUTGOING</span>
                        </div>
                        <div className="text-xs font-bold font-mono text-white truncate">{p.companyName}</div>
                        <div className="text-[10px] text-[#888] font-mono">SDE: <span className="text-[#0ea5e9] font-bold">{p.estimatedSde}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Response / NDA Stage */}
                <div className="bg-[#080808] border border-[#222] p-3 flex flex-col space-y-3">
                  <div className="border-b border-[#222] pb-1 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-yellow-500 uppercase">3. Hot Leads & NDA</span>
                    <span className="text-yellow-500">({prospects.filter(p => p.outreachStage === 'RESPONDED' || p.outreachStage === 'NDA_STAGE').length})</span>
                  </div>
                  <div className="space-y-2 overflow-y-auto max-h-[300px]">
                    {prospects.filter(p => p.outreachStage === 'RESPONDED' || p.outreachStage === 'NDA_STAGE').map(p => (
                      <div key={p.id} className="bg-black p-2.5 border border-[#FF3333] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-[#FF3333] font-bold">HOT RESPONSE</span>
                          <span className="text-[9px] font-mono text-[#00FF66]">{p.ownerAgeEstimate} y/o</span>
                        </div>
                        <div className="text-xs font-bold font-mono text-white truncate">{p.companyName}</div>
                        <p className="text-[10px] text-gray-400 font-mono">Owner ready to call. Preserving transition terms.</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: LIVE CONSOLE LOGS */}
          {activeTab === 'console' && (
            <div className="space-y-4">
              <div className="border-b border-[#222] pb-2 flex justify-between items-center">
                <div>
                  <h3 className="font-mono text-xs font-bold tracking-wider text-yellow-500 uppercase">Live Sourcing API Stream</h3>
                  <p className="text-[11px] text-[#888] font-mono">Historical logging of automated outreach calls and Plaid database checks.</p>
                </div>
                <button 
                  onClick={() => setLogs([])}
                  className="text-[9px] font-mono text-[#FF3333] hover:underline"
                >
                  CLEAR LOG CONSOLE [X]
                </button>
              </div>

              {/* Dynamic Console Emulation View */}
              <div className="bg-[#020202] border border-[#222] p-4 h-64 overflow-y-auto font-mono text-xs space-y-2">
                {logs.length === 0 ? (
                  <p className="text-[#888] italic">No active logs in transmission.</p>
                ) : (
                  logs.map((log, index) => {
                    let color = 'text-[#888]';
                    if (log.type === 'SUCCESS') color = 'text-[#00FF66]';
                    if (log.type === 'WARNING') color = 'text-[#FF3333]';
                    if (log.type === 'ALERT') color = 'text-yellow-500';

                    return (
                      <div key={index} className="flex space-x-2">
                        <span className="text-neutral-700">[{log.timestamp}]</span>
                        <span className={`${color} font-bold`}>[{log.type}]</span>
                        <span className="text-[#F9F9F9]">{log.message}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 4. STRUCTURAL TRANSACTION ADVANTAGES & FOOTER */}
      <footer className="bg-black border-t border-[#222] p-4 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-neutral-500">
        <div>
          <span>SECURE OPERATOR PIPELINE PROTOCOL: <span className="text-[#0EA5E9] font-bold">SECTOR-1031 COMPLIANT</span></span>
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <span>PLAID DATA VERIFIED</span>
          <span className="text-[#222]">|</span>
          <span>SYSTEM TIME: <span className="text-[#00FF66]">{currentTime}</span></span>
        </div>
      </footer>
    </div>
  );
}