import React, { useState, useEffect, useMemo, useRef } from 'react';

// Custom Type Definitions for Sourcing Engine
interface Lead {
  id: string;
  companyName: string;
  industry: 'HVAC' | 'Manufacturing' | 'Logistics';
  location: string;
  ownerName: string;
  revenueEst: string;
  ebitdaEst: string;
  email: string;
  phone: string;
  status: 'UNTOUCHED' | 'QUEUED' | 'SENT' | 'RESPONDED' | 'DND';
  matchScore: number; // 1-100 proprietary score
}

export default function MetricBentoGrid() {
  // Sourcing database of off-market private entities
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'L-4401',
      companyName: 'Legacy Thermal & Air',
      industry: 'HVAC',
      location: 'Southeast Regional (Georgia)',
      ownerName: 'James L. Vance',
      revenueEst: '$3,400,000',
      ebitdaEst: '$820,000',
      email: 'j.vance@legacythermal.io',
      phone: '+1 (404) 555-8901',
      status: 'UNTOUCHED',
      matchScore: 94,
    },
    {
      id: 'L-9812',
      companyName: 'Precision Lathe & Tooling Corp',
      industry: 'Manufacturing',
      location: 'Midwest Rust Belt (Ohio)',
      ownerName: 'Gerhardt Miller',
      revenueEst: '$5,800,000',
      ebitdaEst: '$1,250,000',
      email: 'gmiller@prectoolohio.com',
      phone: '+1 (216) 555-0144',
      status: 'SENT',
      matchScore: 89,
    },
    {
      id: 'L-2209',
      companyName: 'Apex Route Logistics LLC',
      industry: 'Logistics',
      location: 'Texas Triangle Corridor',
      ownerName: 'Maritza Garza',
      revenueEst: '$4,100,000',
      ebitdaEst: '$950,000',
      email: 'm.garza@apexroutelogistics.com',
      phone: '+1 (713) 555-3211',
      status: 'RESPONDED',
      matchScore: 97,
    },
    {
      id: 'L-5511',
      companyName: 'Tri-County Cooling Systems',
      industry: 'HVAC',
      location: 'Southeast Regional (Florida)',
      ownerName: 'Ronald K. Baker',
      revenueEst: '$2,100,000',
      ebitdaEst: '$480,000',
      email: 'ronbaker@tricooling.net',
      phone: '+1 (954) 555-6677',
      status: 'QUEUED',
      matchScore: 81,
    },
    {
      id: 'L-7740',
      companyName: 'Vanguard Aerospace Castings',
      industry: 'Manufacturing',
      location: 'Midwest Rust Belt (Indiana)',
      ownerName: 'Arthur Vance Jr.',
      revenueEst: '$7,200,000',
      ebitdaEst: '$1,650,000',
      email: 'avance@vanguardcastings.com',
      phone: '+1 (317) 555-4009',
      status: 'UNTOUCHED',
      matchScore: 91,
    },
    {
      id: 'L-1102',
      companyName: 'Cross-Country Freightways',
      industry: 'Logistics',
      location: 'Texas Triangle (Dallas)',
      ownerName: 'Clint Eastwood III',
      revenueEst: '$8,900,000',
      ebitdaEst: '$2,100,000',
      email: 'c.eastwood@ccfreightways.com',
      phone: '+1 (214) 555-7711',
      status: 'DND',
      matchScore: 74,
    },
    {
      id: 'L-3049',
      companyName: 'Blue Ridge Precision Fabricators',
      industry: 'Manufacturing',
      location: 'Southeast Regional (NC)',
      ownerName: 'Deborah Miller-Hines',
      revenueEst: '$4,900,000',
      ebitdaEst: '$1,100,000',
      email: 'dmiller@blueridgefab.com',
      phone: '+1 (704) 555-2244',
      status: 'QUEUED',
      matchScore: 95,
    }
  ]);

  // Terminal & filter parameters
  const [industryFilter, setIndustryFilter] = useState<'ALL' | 'HVAC' | 'Manufacturing' | 'Logistics'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNTOUCHED' | 'QUEUED' | 'SENT' | 'RESPONDED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYSTEM INITIALIZED: PROP_DEAL_SOURCING_ENGINE v2.09',
    'REGISTRY CONNECTED: US_EAST_MIDWEST_OFF_MARKET_INDEX_V4',
    'SECURITY TOKEN STATUS: ENCRYPTED // Plaid API Live',
    'READY FOR SEQUENCING COMMANDS.'
  ]);

  // Email / Mail template configuration variables
  const [currentTemplateSubject, setCurrentTemplateSubject] = useState(
    'Acquisition Inquiry: Confidential Partnership Offer'
  );
  const [currentTemplateBody, setCurrentTemplateBody] = useState(
    'Hi {OwnerName},\n\nI am with a private search group backed by $15M in SBA liquidity. We represent a committed family office looking to acquire a high-performing {Industry} business in the {Location} area.\n\nWe have analyzed {CompanyName} from public directories and believe your operational profile is exceptional. Our typical structure guarantees full transition continuity and 90% liquidity at close.\n\nAre you open to a brief 10-minute confidential discussion next week?'
  );

  const [activeSequenceIndex, setActiveSequenceIndex] = useState<number | null>(null);
  const [isProcessingCampaign, setIsProcessingCampaign] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the mini command log inside the terminal box
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Calculated Metrics for the Bento Grid Headers
  const metrics = useMemo(() => {
    const total = leads.length;
    const contacted = leads.filter(l => l.status === 'SENT' || l.status === 'RESPONDED').length;
    const responded = leads.filter(l => l.status === 'RESPONDED').length;
    const responseRate = contacted > 0 ? ((responded / contacted) * 100).toFixed(1) : '0.0';
    const queued = leads.filter(l => l.status === 'QUEUED').length;
    const pipelineEbitda = leads
      .filter(l => l.status !== 'DND')
      .reduce((acc, current) => {
        const valueStr = current.ebitdaEst.replace(/[^0-9]/g, '');
        return acc + parseInt(valueStr, 10);
      }, 0);

    return {
      total,
      contacted,
      responded,
      responseRate,
      queued,
      pipelineEbitda: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(pipelineEbitda)
    };
  }, [leads]);

  // Filtered Leads implementation
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchSearch =
        lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchIndustry = industryFilter === 'ALL' || lead.industry === industryFilter;
      const matchStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      return matchSearch && matchIndustry && matchStatus;
    });
  }, [leads, searchQuery, industryFilter, statusFilter]);

  // Execute manual simulation command in local terminal line
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toUpperCase();
    let response = '';

    if (cmd === 'HELP') {
      response = 'SYSTEM CMD OPTIONS: /SCAN (Locate target metadata), /SEND-ALL (Initialize programmatic queue), /CLEAR (Reset logs), /STATUS (View active pipeline parameters).';
    } else if (cmd === '/SCAN') {
      response = `SCANNING ENGINE: Found ${leads.length} available targets. Current filters: [Ind: ${industryFilter}] [Stat: ${statusFilter}]`;
    } else if (cmd === '/CLEAR') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else if (cmd === '/STATUS') {
      response = `PIPELINE RECOVERY STATUS: ${metrics.contacted} sent, ${metrics.responded} responses recorded. System conversion baseline: ${metrics.responseRate}%.`;
    } else if (cmd === '/SEND-ALL') {
      triggerOutreachSequence();
      response = 'SEQUENCER INITIATED: Launching threads to queued targets.';
    } else {
      response = `UNKNOWN COMMAND: "${cmd}". Input "HELP" for parameters matrix.`;
    }

    setTerminalLogs(prev => [...prev, `> ${terminalInput}`, `[SYS_REP]: ${response}`]);
    setTerminalInput('');
  };

  // Launch simulated sequences for target owners in high-velocity blocks
  const triggerOutreachSequence = () => {
    const queuedTargets = leads.filter(l => l.status === 'QUEUED' || l.status === 'UNTOUCHED');
    if (queuedTargets.length === 0) {
      setTerminalLogs(prev => [...prev, 'ERROR: NO ELIGIBLE TARGETS DETECTED IN SEND QUEUE. ADD MORE REGISTRY TARGETS.']);
      return;
    }

    setIsProcessingCampaign(true);
    setTerminalLogs(prev => [...prev, `INITIALIZING MASS ENGINE OUTREACH FOR ${queuedTargets.length} TARGETS...`]);

    let delay = 0;
    queuedTargets.forEach((target, idx) => {
      delay += 1200; // staggered delay simulation
      setTimeout(() => {
        setLeads(current =>
          current.map(l => {
            if (l.id === target.id) {
              return { ...l, status: 'SENT' };
            }
            return l;
          })
        );
        setTerminalLogs(prev => [
          ...prev,
          `[TRANSMITTED]: Email successfully routed to ${target.ownerName} (${target.companyName}) -> Status Updated.`
        ]);

        if (idx === queuedTargets.length - 1) {
          setIsProcessingCampaign(false);
          setTerminalLogs(prev => [...prev, 'OUTREACH SEQUENCE COMPLETE: All queued records updated. Monitor pipeline metrics.']);
        }
      }, delay);
    });
  };

  // Trigger individual direct email dispatch simulator
  const dispatchSingleLead = (id: string) => {
    const target = leads.find(l => l.id === id);
    if (!target) return;

    setTerminalLogs(prev => [...prev, `DIAG-DISPATCH [${target.id}]: Forcing sequence payload...`]);
    setTimeout(() => {
      setLeads(current =>
        current.map(l => {
          if (l.id === id) {
            return { ...l, status: l.status === 'UNTOUCHED' || l.status === 'QUEUED' ? 'SENT' : l.status };
          }
          return l;
        })
      );
      setTerminalLogs(prev => [
        ...prev,
        `[SUCCESS]: Outreach completed to ${target.ownerName} - Payload structure utilized successfully.`
      ]);
    }, 600);
  };

  // Quick reset for structural simulation
  const resetSimulation = () => {
    setLeads([
      {
        id: 'L-4401',
        companyName: 'Legacy Thermal & Air',
        industry: 'HVAC',
        location: 'Southeast Regional (Georgia)',
        ownerName: 'James L. Vance',
        revenueEst: '$3,400,000',
        ebitdaEst: '$820,000',
        email: 'j.vance@legacythermal.io',
        phone: '+1 (404) 555-8901',
        status: 'UNTOUCHED',
        matchScore: 94,
      },
      {
        id: 'L-9812',
        companyName: 'Precision Lathe & Tooling Corp',
        industry: 'Manufacturing',
        location: 'Midwest Rust Belt (Ohio)',
        ownerName: 'Gerhardt Miller',
        revenueEst: '$5,800,000',
        ebitdaEst: '$1,250,000',
        email: 'gmiller@prectoolohio.com',
        phone: '+1 (216) 555-0144',
        status: 'SENT',
        matchScore: 89,
      },
      {
        id: 'L-2209',
        companyName: 'Apex Route Logistics LLC',
        industry: 'Logistics',
        location: 'Texas Triangle Corridor',
        ownerName: 'Maritza Garza',
        revenueEst: '$4,100,000',
        ebitdaEst: '$950,000',
        email: 'm.garza@apexroutelogistics.com',
        phone: '+1 (713) 555-3211',
        status: 'RESPONDED',
        matchScore: 97,
      },
      {
        id: 'L-5511',
        companyName: 'Tri-County Cooling Systems',
        industry: 'HVAC',
        location: 'Southeast Regional (Florida)',
        ownerName: 'Ronald K. Baker',
        revenueEst: '$2,100,000',
        ebitdaEst: '$480,000',
        email: 'ronbaker@tricooling.net',
        phone: '+1 (954) 555-6677',
        status: 'QUEUED',
        matchScore: 81,
      },
      {
        id: 'L-7740',
        companyName: 'Vanguard Aerospace Castings',
        industry: 'Manufacturing',
        location: 'Midwest Rust Belt (Indiana)',
        ownerName: 'Arthur Vance Jr.',
        revenueEst: '$7,200,000',
        ebitdaEst: '$1,650,000',
        email: 'avance@vanguardcastings.com',
        phone: '+1 (317) 555-4009',
        status: 'UNTOUCHED',
        matchScore: 91,
      },
      {
        id: 'L-1102',
        companyName: 'Cross-Country Freightways',
        industry: 'Logistics',
        location: 'Texas Triangle (Dallas)',
        ownerName: 'Clint Eastwood III',
        revenueEst: '$8,900,000',
        ebitdaEst: '$2,100,000',
        email: 'c.eastwood@ccfreightways.com',
        phone: '+1 (214) 555-7711',
        status: 'DND',
        matchScore: 74,
      },
      {
        id: 'L-3049',
        companyName: 'Blue Ridge Precision Fabricators',
        industry: 'Manufacturing',
        location: 'Southeast Regional (NC)',
        ownerName: 'Deborah Miller-Hines',
        revenueEst: '$4,900,000',
        ebitdaEst: '$1,100,000',
        email: 'dmiller@blueridgefab.com',
        phone: '+1 (704) 555-2244',
        status: 'QUEUED',
        matchScore: 95,
      }
    ]);
    setTerminalLogs([
      'SYSTEM RESET INITIALIZED...',
      'DATABASE AND ACTIVE RUNTIMES LOADED.',
      'READY FOR COMMANDS.'
    ]);
  };

  return (
    <div className="bg-terminalBlack text-boneWhite font-mono antialiased w-full p-4 md:p-6 space-y-6">
      
      {/* 1. DASHBOARD HEADER & CONTEXT STATUS */}
      <div className="border border-borderGray bg-[#0a0a0a] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-acidGreen uppercase tracking-widest font-bold">
            <span className="w-2.5 h-2.5 bg-acidGreen block animate-pulse"></span>
            <span>// PROPRIETARY SOURCING & OUTREACH ENGINE</span>
          </div>
          <p className="text-[10px] text-lightMuted mt-1 uppercase tracking-wider">
            Active Registry Node: US-METRO-SOUTHWELL // Programmatic Cold Email & Mail Matrix
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={resetSimulation}
            className="text-[10px] border border-borderGray px-2.5 py-1.5 hover:border-warningCrimson hover:text-warningCrimson transition-colors bg-darkMuted uppercase"
          >
            [↻ RESET SYSTEM]
          </button>
          <span className="text-[10px] border border-borderGray px-2.5 py-1.5 text-copperTeal bg-darkMuted uppercase">
            SBA Liquidity Buffer: $15M
          </span>
        </div>
      </div>

      {/* 2. MAIN BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* BENTO PILL 1: PIPELINE NUMERICAL METRICS PANEL */}
        <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="border border-borderGray bg-[#080808] p-4 flex flex-col justify-between">
            <span className="text-[9px] text-lightMuted uppercase block mb-2">// TOTAL PIPELINE IDENTIFIED</span>
            <div>
              <span className="text-3xl font-bold text-boneWhite tracking-tight">{metrics.total}</span>
              <span className="text-[10px] text-lightMuted block mt-1">Verified Registries</span>
            </div>
          </div>

          <div className="border border-borderGray bg-[#080808] p-4 flex flex-col justify-between">
            <span className="text-[9px] text-lightMuted uppercase block mb-2">// SEQUENCE QUEUED</span>
            <div>
              <span className="text-3xl font-bold text-copperTeal tracking-tight">{metrics.queued}</span>
              <span className="text-[10px] text-lightMuted block mt-1">Pending Payload Delivery</span>
            </div>
          </div>

          <div className="border border-borderGray bg-[#080808] p-4 flex flex-col justify-between">
            <span className="text-[9px] text-lightMuted uppercase block mb-2">// CONTACTED TARGETS</span>
            <div>
              <span className="text-3xl font-bold text-acidGreen tracking-tight">
                {metrics.contacted}
              </span>
              <span className="text-[10px] text-lightMuted block mt-1">Transmission Established</span>
            </div>
          </div>

          <div className="border border-borderGray bg-[#080808] p-4 flex flex-col justify-between">
            <span className="text-[9px] text-lightMuted uppercase block mb-2">// VERIFIED RESPONSE RATE</span>
            <div>
              <span className="text-3xl font-bold text-warningCrimson tracking-tight">
                {metrics.responseRate}%
              </span>
              <span className="text-[10px] text-lightMuted block mt-1">
                {metrics.responded} / {metrics.contacted} Engagements
              </span>
            </div>
          </div>

        </div>

        {/* BENTO PILL 2: PIPELINE ASSET CAPITALIZATION */}
        <div className="md:col-span-4 border border-borderGray bg-[#0a0a0a] p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-lightMuted uppercase">// SUMMED OFF-MARKET OPERATIONAL EBITDA</span>
              <span className="text-[8px] bg-acidGreen/10 text-acidGreen px-1 border border-acidGreen/20">LIVE</span>
            </div>
            <span className="text-2xl font-bold text-acidGreen tracking-tight block">
              {metrics.pipelineEbitda}
            </span>
          </div>
          <p className="text-[10px] text-lightMuted mt-2 leading-relaxed">
            AGGREGATED EBITDA FROM UNTOUCHED & QUEUED PROSPECTS EXCLUDING DECLARED DO-NOT-DISTURB (DND) SEGMENTS.
          </p>
        </div>

        {/* BENTO PILL 3: FILTER MATRIX & LIVE QUERY */}
        <div className="md:col-span-4 border border-borderGray bg-[#0a0a0a] p-4 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-borderGray">
            <span className="text-xs font-bold text-boneWhite uppercase tracking-wider">// SELECTION PARAMETERS</span>
            <span className="text-[9px] text-copperTeal">[FILTER_SYS]</span>
          </div>

          {/* Quick Query Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-[9px] text-lightMuted uppercase block mb-1">REGISTRY QUERY SEARCH</label>
              <input 
                type="text"
                placeholder="Search owner, co, or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-terminalBlack border border-borderGray text-boneWhite text-[11px] p-2 focus:border-acidGreen focus:outline-none uppercase placeholder-lightMuted font-mono"
              />
            </div>

            {/* Selector matrix */}
            <div>
              <label className="text-[9px] text-lightMuted uppercase block mb-1">INDUSTRY MATRIX</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['ALL', 'HVAC', 'Manufacturing', 'Logistics'] as const).map(ind => (
                  <button
                    key={ind}
                    onClick={() => setIndustryFilter(ind)}
                    className={`text-[10px] text-left p-1.5 border uppercase transition-all duration-150 ${
                      industryFilter === ind 
                        ? 'bg-acidGreen text-terminalBlack font-bold border-acidGreen'
                        : 'bg-transparent text-boneWhite border-borderGray hover:border-acidGreen hover:text-acidGreen'
                    }`}
                  >
                    • {ind}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[9px] text-lightMuted uppercase block mb-1">STATUS ROUTE STATE</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['ALL', 'UNTOUCHED', 'QUEUED', 'SENT', 'RESPONDED'] as const).map(stat => (
                  <button
                    key={stat}
                    onClick={() => setStatusFilter(stat)}
                    className={`text-[10px] text-left p-1.5 border uppercase transition-all duration-150 ${
                      statusFilter === stat 
                        ? 'bg-copperTeal text-terminalBlack font-bold border-copperTeal'
                        : 'bg-transparent text-boneWhite border-borderGray hover:border-copperTeal hover:text-copperTeal'
                    }`}
                  >
                    □ {stat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BENTO PILL 4: TEMPLATE PAYLOAD STRUCTURER */}
        <div className="md:col-span-8 border border-borderGray bg-[#0a0a0a] p-4 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-borderGray">
            <span className="text-xs font-bold text-boneWhite uppercase tracking-wider">// PAYLOAD METRICS & SEQUENCER TEMPLATE</span>
            <span className="text-[9px] text-warningCrimson">[AMPLITUDE CONFIG]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 space-y-3">
              <div>
                <label className="text-[9px] text-lightMuted block mb-1">SUBJECT PROTOCOL</label>
                <input 
                  type="text"
                  value={currentTemplateSubject}
                  onChange={(e) => setCurrentTemplateSubject(e.target.value)}
                  className="w-full bg-terminalBlack border border-borderGray text-boneWhite text-[11px] p-2 focus:border-copperTeal focus:outline-none placeholder-lightMuted font-mono"
                />
              </div>

              <div className="border border-borderGray p-2.5 bg-darkMuted text-[10px] text-lightMuted space-y-1.5">
                <div className="font-bold text-boneWhite uppercase mb-1">// DYNAMIC PAYLOAD SYNTAX:</div>
                <div><span className="text-acidGreen font-bold">{'{OwnerName}'}</span> : Target proprietor direct name</div>
                <div><span className="text-acidGreen font-bold">{'{CompanyName}'}</span> : Registered corporate trade style</div>
                <div><span className="text-acidGreen font-bold">{'{Industry}'}</span> : Niche registry market sector</div>
                <div><span className="text-acidGreen font-bold">{'{Location}'}</span> : Target localized trade area</div>
              </div>
            </div>

            <div className="md:col-span-7">
              <label className="text-[9px] text-lightMuted block mb-1">BODY TEMPLATE PAYLOAD</label>
              <textarea 
                rows={6}
                value={currentTemplateBody}
                onChange={(e) => setCurrentTemplateBody(e.target.value)}
                className="w-full bg-terminalBlack border border-borderGray text-boneWhite text-[11px] p-2 focus:border-copperTeal focus:outline-none placeholder-lightMuted font-mono resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-borderGray gap-2 w-full">
            <span className="text-[10px] text-lightMuted">
              *Sequencer runs via high-authority proxy servers matching direct search domains.
            </span>
            <button 
              onClick={triggerOutreachSequence}
              disabled={isProcessingCampaign}
              className={`w-full sm:w-auto text-[10px] font-bold px-4 py-2 border uppercase tracking-widest text-center transition-all ${
                isProcessingCampaign 
                  ? 'border-lightMuted text-lightMuted bg-darkMuted cursor-not-allowed'
                  : 'bg-acidGreen text-terminalBlack border-acidGreen hover:bg-terminalBlack hover:text-acidGreen hover:shadow-[4px_4px_0px_0px_rgba(0,255,102,1)]'
              }`}
            >
              {isProcessingCampaign ? 'EXECUTING PAYLOAD TRANSMISSION...' : 'EXECUTE SEQUENCER RUN (/SEND-ALL)'}
            </button>
          </div>
        </div>

        {/* BENTO PILL 5: THE REGISTRY TARGET PIPELINE MATRIX (THE CORE DATA ROW SHEET) */}
        <div className="md:col-span-12 border border-borderGray bg-[#0a0a0a] overflow-hidden">
          
          <div className="border-b border-borderGray bg-[#0c0c0c] px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-boneWhite">
              // OFF-MARKET REGISTRY COMPILATION — FOUND {filteredLeads.length} VIABLE MATCHES
            </span>
            <span className="text-[9px] text-lightMuted">
              Double click any entry path to verify direct-mail logs.
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs font-mono min-w-[900px]">
              <thead>
                <tr className="border-b border-borderGray text-lightMuted uppercase text-[10px] bg-[#050505]">
                  <th className="p-3 w-20">ID</th>
                  <th className="p-3 w-48">Target Entity</th>
                  <th className="p-3 w-32">Sector / Registry</th>
                  <th className="p-3 w-40">Geographic Node</th>
                  <th className="p-3 w-36">Proprietor</th>
                  <th className="p-3 w-24 text-right">EBITDA (Est)</th>
                  <th className="p-3 w-28 text-center">Score</th>
                  <th className="p-3 w-32 text-center">Protocol State</th>
                  <th className="p-3 w-24 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderGray bg-[#080808]">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-darkMuted/60 transition-colors duration-100 group"
                  >
                    {/* ID Badge */}
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-darkMuted border border-borderGray text-copperTeal">
                        {lead.id}
                      </span>
                    </td>

                    {/* Company and Info */}
                    <td className="p-3">
                      <div className="font-bold text-boneWhite">{lead.companyName}</div>
                      <div className="text-[10px] text-lightMuted mt-0.5">{lead.email}</div>
                    </td>

                    {/* Sector Badge */}
                    <td className="p-3">
                      <span className="text-[9px] border border-borderGray px-2 py-0.5 bg-[#0c0c0c] text-lightMuted">
                        {lead.industry}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="p-3 text-[11px] text-lightMuted">
                      {lead.location}
                    </td>

                    {/* Owner */}
                    <td className="p-3">
                      <div className="font-bold text-boneWhite">{lead.ownerName}</div>
                      <div className="text-[10px] text-lightMuted mt-0.5">{lead.phone}</div>
                    </td>

                    {/* Est EBITDA */}
                    <td className="p-3 text-right text-acidGreen font-bold">
                      {lead.ebitdaEst}
                    </td>

                    {/* Score Bar Meter */}
                    <td className="p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-16 bg-[#222] h-1.5">
                          <div 
                            className="h-full bg-acidGreen" 
                            style={{ width: `${lead.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-boneWhite font-bold">{lead.matchScore}%</span>
                      </div>
                    </td>

                    {/* Protocol State Tag */}
                    <td className="p-3 text-center">
                      <span 
                        className={`text-[9px] uppercase tracking-wider px-2 py-1 border font-bold ${
                          lead.status === 'RESPONDED'
                            ? 'border-acidGreen text-acidGreen bg-acidGreen/5 animate-pulse'
                            : lead.status === 'SENT'
                            ? 'border-copperTeal text-copperTeal bg-copperTeal/5'
                            : lead.status === 'QUEUED'
                            ? 'border-yellow-500 text-yellow-500 bg-yellow-500/5'
                            : lead.status === 'DND'
                            ? 'border-warningCrimson text-warningCrimson bg-warningCrimson/5'
                            : 'border-borderGray text-lightMuted'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    {/* Individual Payload Action */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => dispatchSingleLead(lead.id)}
                        disabled={lead.status === 'DND'}
                        className={`text-[9px] font-bold px-2 py-1 border transition-all ${
                          lead.status === 'DND'
                            ? 'border-borderGray text-lightMuted cursor-not-allowed opacity-50'
                            : 'border-acidGreen text-acidGreen hover:bg-acidGreen hover:text-terminalBlack'
                        }`}
                      >
                        FORCE [⚡]
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-warningCrimson">
                      [⚠️ FILTER WARNING]: ZERO REGISTRY MATCHES DETECTED FOR SPECIFIED QUERY BOUNDARIES.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* BENTO PILL 6: DIAGNOSTIC INTERACTIVE TERMINAL LOG BOX */}
        <div className="md:col-span-12 border border-borderGray bg-[#050505]">
          
          <div className="border-b border-borderGray bg-[#080808] px-4 py-2 flex justify-between items-center text-[10px]">
            <span className="text-lightMuted font-bold">// INTERACTIVE OUTREACH DIAGNOSTIC LOG FEED</span>
            <span className="text-acidGreen">[ONLINE // INPUT ENABLED]</span>
          </div>

          <div className="p-4 space-y-2 max-h-[180px] overflow-y-auto font-mono text-[11px] text-lightMuted scrollbar-thin">
            {terminalLogs.map((log, index) => {
              const isRep = log.startsWith('[SYS_REP]');
              const isTransmit = log.startsWith('[TRANSMITTED]') || log.startsWith('[SUCCESS]');
              const isCmd = log.startsWith('>');
              const isError = log.startsWith('ERROR');

              let textClass = 'text-boneWhite/90';
              if (isRep) textClass = 'text-copperTeal';
              if (isTransmit) textClass = 'text-acidGreen';
              if (isCmd) textClass = 'text-yellow-500';
              if (isError) textClass = 'text-warningCrimson';

              return (
                <div key={index} className={`leading-relaxed whitespace-pre-wrap ${textClass}`}>
                  {log}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          <form onSubmit={handleTerminalSubmit} className="border-t border-borderGray flex bg-terminalBlack">
            <span className="p-3 text-acidGreen text-xs select-none">{'>'}</span>
            <input 
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Input system command (e.g. HELP, /SCAN, /STATUS, /SEND-ALL)..."
              className="w-full bg-transparent border-0 text-boneWhite text-xs focus:ring-0 focus:outline-none p-3 placeholder-lightMuted uppercase tracking-wider font-mono"
            />
            <button 
              type="submit"
              className="border-l border-borderGray px-4 bg-darkMuted text-[10px] text-lightMuted hover:text-acidGreen transition-colors uppercase font-bold"
            >
              Execute
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}