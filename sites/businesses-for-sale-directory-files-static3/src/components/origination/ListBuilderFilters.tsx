import React, { useState, useEffect, useMemo } from 'react';

// Mock database for regional sourcing metrics
const INDUSTRIES = [
  { code: '5084', name: 'Industrial Machinery & Equipment', count: 1420 },
  { code: '1711', name: 'Plumbing, Heating & Air-Conditioning', count: 2840 },
  { code: '4213', name: 'Trucking & Over-the-Road Logistics', count: 980 },
  { code: '7372', name: 'Prepackaged Software & SaaS', count: 1150 },
  { code: '8071', name: 'Medical & Dental Laboratories', count: 640 },
  { code: '3441', name: 'Fabricated Structural Metal Tooling', count: 530 },
  { code: '7382', name: 'Security Systems Services & Integration', count: 410 }
];

const STATES_AND_COUNTIES = [
  { state: 'TX', counties: ['Harris County', 'Dallas County', 'Tarrant County', 'Bexar County'] },
  { state: 'CA', counties: ['Orange County', 'Los Angeles County', 'San Diego County', 'Santa Clara County'] },
  { state: 'FL', counties: ['Miami-Dade County', 'Hillsborough County', 'Orange County', 'Broward County'] },
  { state: 'VA', counties: ['Fairfax County', 'Loudoun County', 'Henrico County', 'Prince William County'] },
  { state: 'IL', counties: ['Cook County', 'DuPage County', 'Lake County', 'Will County'] }
];

const TEMPLATES = [
  {
    id: 'retirement',
    name: 'RETIREMENT EXIT / LEGACY PROTECTION ANGLE',
    subject: 'Inquiry regarding the future transition of [Company_Name]',
    body: 'Dear [Owner_Last_Name],\n\nI am an independent acquisition operator backed by family office capital, looking to directly acquire and personally run a service enterprise in [County_Name]. Unlike institutional PE buyers, my focus is legacy preservation and team retention. If you have considered transition or succession planning, I would welcome a confidential 10-minute briefing.'
  },
  {
    id: 'recapitalization',
    name: 'GROWTH PARTNERSHIP & RECAPITALIZATION ALLIANCE',
    subject: 'Strategic expansion partnership proposal: [Company_Name]',
    body: 'Hello [Owner_First_Name],\n\nWe track industrial operators in the [State_Name] region with strong local market density. Our team provides non-hostile capital injections alongside structural recapitalization frameworks. We would like to model your current operational scale against our regional dispatch systems.'
  },
  {
    id: 'direct_mail',
    name: 'DIRECT MAIL: GOLD-ENVELOPE PRIVATE OPERATOR INQUIRY',
    subject: 'Handwritten Letter Blueprint (Postcard & Formal Letter option)',
    body: '[Owner_First_Name] [Owner_Last_Name]\n[Street_Address], [City_Name]\n\nRE: PRIVATE INTEREST IN [Company_Name]\n\nDear [Owner_First_Name],\n\nI am writing to you directly from my desk. I live in the area and respect the brand you built. I am looking to step in as a long-term steward of one local firm. If you are open to a cash transaction with structural flexibility to mitigate capital gains, let’s schedule a brief call.'
  }
];

export default function ListBuilderFilters() {
  // Sourcing Filters state
  const [selectedState, setSelectedState] = useState('TX');
  const [selectedCounties, setSelectedCounties] = useState<string[]>(['Harris County']);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(['1711']);
  const [revenueMin, setRevenueMin] = useState<number>(1500000);
  const [revenueMax, setRevenueMax] = useState<number>(10000000);
  const [employeeMin, setEmployeeMin] = useState<number>(10);
  const [employeeMax, setEmployeeMax] = useState<number>(75);
  const [excludePeBacked, setExcludePeBacked] = useState<boolean>(true);
  const [onlyOwnerOperated, setOnlyOwnerOperated] = useState<boolean>(true);

  // Outreach configuration state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('retirement');
  const [campaignChannels, setCampaignChannels] = useState<string[]>(['email', 'direct_mail']);
  const [cadenceDelayDays, setCadenceDelayDays] = useState<number>(7);
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customBody, setCustomBody] = useState<string>('');

  // Diagnostic system variables
  const [isSimulatingLoad, setIsSimulatingLoad] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'SYSTEM INITIALIZED: Off-Market Direct Sourcing Engine Active.',
    'SECURE CONNECTION ESTABLISHED TO SECTOR-1031 COMPLIANCE GRID.'
  ]);

  // Set default subject and body when template changes
  useEffect(() => {
    const template = TEMPLATES.find(t => t.id === selectedTemplateId);
    if (template) {
      setCustomSubject(template.subject);
      setCustomBody(template.body);
    }
  }, [selectedTemplateId]);

  // Add system log entry helper
  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setSystemLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 8)]);
  };

  // Toggle selected items in array lists
  const toggleCounty = (county: string) => {
    if (selectedCounties.includes(county)) {
      setSelectedCounties(prev => prev.filter(c => c !== county));
      addLog(`REMOVED GEOGRAPHIC ANCHOR: ${county}`);
    } else {
      setSelectedCounties(prev => [...prev, county]);
      addLog(`ADDED GEOGRAPHIC ANCHOR: ${county}`);
    }
  };

  const toggleIndustry = (code: string) => {
    if (selectedIndustries.includes(code)) {
      setSelectedIndustries(prev => prev.filter(i => i !== code));
      addLog(`DE-SELECTED INDUSTRIAL SECTOR: SIC ${code}`);
    } else {
      setSelectedIndustries(prev => [...prev, code]);
      addLog(`TARGETED INDUSTRIAL SECTOR: SIC ${code}`);
    }
  };

  const toggleChannel = (channel: string) => {
    if (campaignChannels.includes(channel)) {
      setCampaignChannels(prev => prev.filter(c => c !== channel));
    } else {
      setCampaignChannels(prev => [...prev, channel]);
    }
  };

  // Handle State Change
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const countiesForState = STATES_AND_COUNTIES.find(s => s.state === state)?.counties || [];
    setSelectedCounties([countiesForState[0]]);
    addLog(`ROUTING GEOGRAPHIC DATABASE SECTOR TO: ${state}`);
  };

  // Simulated algorithm computing active targets matching criteria
  const estimatedTargetsCount = useMemo(() => {
    let base = 0;
    selectedIndustries.forEach(indCode => {
      const ind = INDUSTRIES.find(i => i.code === indCode);
      if (ind) base += ind.count;
    });

    if (base === 0) return 0;

    // Apply multiplier based on geographic selections
    const stateCounties = STATES_AND_COUNTIES.find(s => s.state === selectedState)?.counties.length || 1;
    const geoRatio = selectedCounties.length / stateCounties;
    let computed = Math.floor(base * geoRatio * 0.18);

    // Apply revenue/employee limits
    const scaleRatio = (revenueMax - revenueMin) / 15000000;
    computed = Math.floor(computed * Math.max(0.2, Math.min(1.0, scaleRatio)));

    if (excludePeBacked) computed = Math.floor(computed * 0.92);
    if (onlyOwnerOperated) computed = Math.floor(computed * 0.76);

    return Math.max(8, computed);
  }, [
    selectedState,
    selectedCounties,
    selectedIndustries,
    revenueMin,
    revenueMax,
    excludePeBacked,
    onlyOwnerOperated
  ]);

  // Initiate simulation action
  const handleGenerateSequence = () => {
    if (isSimulatingLoad) return;
    setIsSimulatingLoad(true);
    setGenerationProgress(1);
    addLog(`INITIATED PIPELINE EXPORT FOR ${estimatedTargetsCount} TARGETS...`);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulatingLoad(false);
          addLog(`SUCCESS: ${estimatedTargetsCount} DIRECT OUTREACH PROFILES CONSTRUCTED.`);
          addLog(`COMMENCING PRE-FLIGHT AUTHENTICATION ON EXPORT PACK.`);
          return 100;
        }
        const step = Math.floor(Math.random() * 20) + 10;
        const next = Math.min(100, prev + step);
        if (next < 100) {
          addLog(`SOURCING PROSPECTS: PROGRESS STATE ${next}%...`);
        }
        return next;
      });
    }, 400);
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-sans antialiased border-t border-[#222]">
      
      {/* 1. SECTION COMPONENT TITLE BAR */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#080808] via-[#050505] to-[#080808] border-b border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#00FF66] text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-tight uppercase">SYSTEM PRO-ACTIVE</span>
            <span className="text-[10px] font-mono text-[#0EA5E9] tracking-widest font-bold">OUTREACH ORIGINATION ENGINE</span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
            OFF-MARKET <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] to-[#0EA5E9]">PROSPECT LIST BUILDER</span>
          </h2>
          <p className="text-xs text-[#888] font-mono">Bypass premium broker fees. Source owner details directly and automate highly-personalized acquisition inquiries.</p>
        </div>

        {/* Counter Display widget */}
        <div className="bg-[#0c0c0c] border border-[#222] px-4 py-3 font-mono text-left min-w-[200px] flex justify-between items-center relative overflow-hidden">
          <div className="absolute right-0 bottom-0 text-[40px] leading-none text-neutral-900 font-extrabold select-none z-0">
            ETA
          </div>
          <div className="relative z-10">
            <div className="text-[9px] text-[#888] tracking-widest uppercase">ESTIMATED PROSPECT COUNT</div>
            <div className="text-xl font-black text-[#00FF66] tracking-tighter" style={{ textShadow: '0 0 10px rgba(0,255,102,0.2)' }}>
              {estimatedTargetsCount} MATCHES
            </div>
          </div>
          <div className="w-2.5 h-2.5 bg-[#00FF66] animate-pulse relative z-10 rounded-none"></div>
        </div>
      </div>

      {/* 2. CORE INTERFACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#222]">
        
        {/* LEFT COLUMN: FILTERS & TARGET PARAMS (7 Cols) */}
        <div className="lg:col-span-7 bg-[#050505] p-6 border-r border-[#222] space-y-6">
          
          {/* Section Subtitle */}
          <div className="flex items-center space-x-2 border-b border-[#222] pb-2">
            <span className="bg-[#0EA5E9] w-1.5 h-3.5 inline-block"></span>
            <h3 className="font-mono text-xs font-bold tracking-widest uppercase text-white">STEP 1: DEFINE TARGET PROFILE CRITERIA</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Geo Targeting Box */}
            <div className="space-y-4 border border-[#222] p-4 bg-[#080808]">
              <span className="text-[10px] font-mono text-[#0EA5E9] tracking-wider font-bold block uppercase border-b border-[#111] pb-1.5">
                Geographic Anchor Region
              </span>
              
              <div className="space-y-3">
                {/* State selector row */}
                <div>
                  <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase mb-1">State Sector</label>
                  <div className="grid grid-cols-5 gap-1 font-mono text-xs">
                    {STATES_AND_COUNTIES.map(sc => (
                      <button
                        key={sc.state}
                        onClick={() => handleStateChange(sc.state)}
                        className={`py-1.5 border text-center transition-all ${
                          selectedState === sc.state
                            ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] font-bold'
                            : 'bg-black border-[#222] text-[#888] hover:border-[#444] hover:text-white'
                        }`}
                        style={{ borderRadius: '0px !important' }}
                      >
                        {sc.state}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counties Checklist */}
                <div>
                  <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase mb-1">
                    County Isolation Zones (Multi-Select)
                  </label>
                  <div className="bg-black border border-[#222] p-2 space-y-1 max-h-[140px] overflow-y-auto">
                    {(STATES_AND_COUNTIES.find(s => s.state === selectedState)?.counties || []).map(county => {
                      const active = selectedCounties.includes(county);
                      return (
                        <button
                          key={county}
                          onClick={() => toggleCounty(county)}
                          className={`w-full text-left font-mono text-[10px] p-1 px-2 border transition-all flex items-center justify-between ${
                            active
                              ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66] font-bold'
                              : 'bg-transparent border-transparent text-[#888] hover:text-white hover:bg-[#111]'
                          }`}
                          style={{ borderRadius: '0px !important' }}
                        >
                          <span>{county}</span>
                          <span className="text-[9px] font-bold">{active ? '[ACTIVE]' : '[+]'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Scale & Ownership Filters */}
            <div className="space-y-4 border border-[#222] p-4 bg-[#080808] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#0ea5e9] tracking-wider font-bold block uppercase border-b border-[#111] pb-1.5 mb-3">
                  Ownership & Entity Structure
                </span>

                <div className="space-y-2">
                  {/* Private Equity exclusion */}
                  <button
                    onClick={() => {
                      setExcludePeBacked(!excludePeBacked);
                      addLog(`EXCLUDE PE-BACKED ENTITIES: ${!excludePeBacked ? 'ON' : 'OFF'}`);
                    }}
                    className={`w-full p-2.5 border text-left font-mono text-[11px] transition-all flex items-center justify-between ${
                      excludePeBacked
                        ? 'bg-[#FF3333]/10 border-[#FF3333] text-[#FF3333] font-bold'
                        : 'bg-black border-[#222] text-[#888] hover:border-[#444]'
                    }`}
                    style={{ borderRadius: '0px !important' }}
                  >
                    <span>EXCLUDE KNOWN PE-BACKED STORES</span>
                    <span className="text-[9px]">{excludePeBacked ? '[ISOLATED]' : '[OFF]'}</span>
                  </button>

                  {/* Owner Operated toggle */}
                  <button
                    onClick={() => {
                      setOnlyOwnerOperated(!onlyOwnerOperated);
                      addLog(`ISOLATE OWNER-OPERATED ENTERPRISES: ${!onlyOwnerOperated ? 'ON' : 'OFF'}`);
                    }}
                    className={`w-full p-2.5 border text-left font-mono text-[11px] transition-all flex items-center justify-between ${
                      onlyOwnerOperated
                        ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66] font-bold'
                        : 'bg-black border-[#222] text-[#888] hover:border-[#444]'
                    }`}
                    style={{ borderRadius: '0px !important' }}
                  >
                    <span>TARGET OWNER-OPERATED ONLY</span>
                    <span className="text-[9px]">{onlyOwnerOperated ? '[ISOLATED]' : '[OFF]'}</span>
                  </button>
                </div>
              </div>

              {/* API and Plaid Sync status message */}
              <div className="bg-black/40 border border-[#222] p-2 mt-2">
                <p className="text-[9px] font-mono text-[#888] leading-tight">
                  <span className="text-white font-bold">PLAID & EXXON API SYNCED:</span> Prospect data enriched with regional business license, registration, and active tax liens files.
                </p>
              </div>
            </div>
          </div>

          {/* SIC Verticals Grid selection */}
          <div className="space-y-3">
            <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">
              Target Industry Verticals & SIC Classifications (Multi-Select)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1">
              {INDUSTRIES.map(ind => {
                const active = selectedIndustries.includes(ind.code);
                return (
                  <button
                    key={ind.code}
                    onClick={() => toggleIndustry(ind.code)}
                    className={`p-2.5 border text-left font-mono text-[11px] tracking-wider transition-all flex items-start justify-between gap-4 ${
                      active
                        ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66] font-bold'
                        : 'bg-black border-[#222] text-[#888] hover:border-[#444] hover:text-[#F9F9F9]'
                    }`}
                    style={{ borderRadius: '0px !important' }}
                  >
                    <div>
                      <span className="text-[9px] text-white/50 block font-normal">SIC {ind.code}</span>
                      <span className="line-clamp-1">{ind.name}</span>
                    </div>
                    <span className="text-[9px] mt-0.5 whitespace-nowrap">{active ? '[ACTIVE]' : '[+]'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Revenue and headcount sliding metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0a0a0a] p-4 border border-[#222]">
            
            {/* Revenue Slider Range inputs */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#888] tracking-widest uppercase">Est. Annual Revenue Range</span>
                <span className="font-mono text-[10px] text-[#00FF66] font-bold">
                  {(revenueMin / 1000000).toFixed(1)}M - {(revenueMax / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[8px] text-neutral-600 font-mono block">MIN REVENUE THRESHOLD</span>
                  <input
                    type="range"
                    min="500000"
                    max="5000000"
                    step="500000"
                    value={revenueMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val < revenueMax) {
                        setRevenueMin(val);
                        addLog(`UPDATED MIN REVENUE FLOOR: $${(val / 1000000).toFixed(1)}M`);
                      }
                    }}
                    className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[8px] text-neutral-600 font-mono block">MAX REVENUE CEILING</span>
                  <input
                    type="range"
                    min="6000000"
                    max="30000000"
                    step="1000000"
                    value={revenueMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > revenueMin) {
                        setRevenueMax(val);
                        addLog(`UPDATED MAX REVENUE CEILING: $${(val / 1000000).toFixed(1)}M`);
                      }
                    }}
                    className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Headcount metrics */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#888] tracking-widest uppercase">Headcount Threshold</span>
                <span className="font-mono text-[10px] text-[#0EA5E9] font-bold">
                  {employeeMin} - {employeeMax} FTEs
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[8px] text-neutral-600 font-mono block">MIN STAFF LIMIT</span>
                  <input
                    type="range"
                    min="3"
                    max="25"
                    step="1"
                    value={employeeMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val < employeeMax) {
                        setEmployeeMin(val);
                        addLog(`UPDATED MIN FTE LIMIT: ${val}`);
                      }
                    }}
                    className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[8px] text-neutral-600 font-mono block">MAX STAFF LIMIT</span>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    step="5"
                    value={employeeMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > employeeMin) {
                        setEmployeeMax(val);
                        addLog(`UPDATED MAX FTE LIMIT: ${val}`);
                      }
                    }}
                    className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: OUTREACH CAMPAIGN COMPOSER (5 Cols) */}
        <div className="lg:col-span-5 bg-[#080808] p-6 flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            {/* Section Subtitle */}
            <div className="flex items-center space-x-2 border-b border-[#222] pb-2">
              <span className="bg-[#00FF66] w-1.5 h-3.5 inline-block"></span>
              <h3 className="font-mono text-xs font-bold tracking-widest uppercase text-white">STEP 2: OUTREACH CADENCE CONFIG</h3>
            </div>

            {/* Template Selector dropdown */}
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase">OUTREACH ANGLE TEMPLATE</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value);
                  addLog(`CHANGED CAMPAIGN TEMPLATE: ${e.target.value.toUpperCase()}`);
                }}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-[#F9F9F9] p-3 focus:outline-none transition-all"
                style={{ borderRadius: '0px !important' }}
              >
                {TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Subject preview box */}
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase">Dynamic Subject Line / Letter Heading</label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-white p-3 placeholder:text-[#444] outline-none transition-all"
                style={{ borderRadius: '0px !important' }}
                placeholder="Dynamic Campaign Heading..."
              />
            </div>

            {/* Message Body composer */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase">Outreach Core Text Blueprint</label>
                <span className="font-mono text-[8px] text-[#FF3333]">DYN-TAGS READY</span>
              </div>
              <textarea
                rows={6}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-[#F9F9F9] p-3 outline-none transition-all leading-relaxed resize-none"
                style={{ borderRadius: '0px !important' }}
                placeholder="Enter personalized transition text..."
              />
              <div className="flex flex-wrap gap-1">
                {['[Company_Name]', '[Owner_Last_Name]', '[County_Name]', '[State_Name]'].map(tag => (
                  <span
                    key={tag}
                    onClick={() => {
                      setCustomBody(prev => prev + ' ' + tag);
                      addLog(`INSERTED TAG TOKEN: ${tag}`);
                    }}
                    className="text-[9px] font-mono font-semibold bg-[#111] text-[#0ea5e9] border border-[#222] px-1.5 py-0.5 cursor-pointer hover:bg-[#0ea5e9]/10 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Multi-channel routing selections */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase mb-1.5">Outreach Channels</label>
                <div className="space-y-1">
                  <button
                    onClick={() => toggleChannel('email')}
                    className={`w-full text-left font-mono text-[10px] p-2 border transition-all flex items-center justify-between ${
                      campaignChannels.includes('email')
                        ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9]'
                        : 'bg-black border-[#222] text-[#444]'
                    }`}
                    style={{ borderRadius: '0px !important' }}
                  >
                    <span>CO-PILOT COLD EMAIL</span>
                    <span>{campaignChannels.includes('email') ? '[ON]' : '[OFF]'}</span>
                  </button>

                  <button
                    onClick={() => toggleChannel('direct_mail')}
                    className={`w-full text-left font-mono text-[10px] p-2 border transition-all flex items-center justify-between ${
                      campaignChannels.includes('direct_mail')
                        ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9]'
                        : 'bg-black border-[#222] text-[#444]'
                    }`}
                    style={{ borderRadius: '0px !important' }}
                  >
                    <span>DIRECT MAIL (POSTAL)</span>
                    <span>{campaignChannels.includes('direct_mail') ? '[ON]' : '[OFF]'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase mb-1.5">Follow-Up Delay</label>
                <div className="relative">
                  <select
                    value={cadenceDelayDays}
                    onChange={(e) => {
                      setCadenceDelayDays(Number(e.target.value));
                      addLog(`CADENCE FOLLOW-UP DELAY CONFIGURED TO ${e.target.value} DAYS`);
                    }}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-[#F9F9F9] p-2 pr-6 focus:outline-none transition-all"
                    style={{ borderRadius: '0px !important' }}
                  >
                    <option value="5">5 Days Post-Send</option>
                    <option value="7">7 Days Post-Send</option>
                    <option value="10">10 Days Post-Send</option>
                    <option value="14">14 Days Post-Send</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Execution Panel */}
          <div className="space-y-4">
            
            {/* Real-time generating progress bar */}
            {isSimulatingLoad && (
              <div className="space-y-1 bg-black p-3 border border-[#00FF66]/30">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#00FF66] animate-pulse">SOURCING CONTACT DETAILS...</span>
                  <span className="text-[#00FF66]" x-text="generationProgress">{generationProgress}%</span>
                </div>
                <div className="w-full bg-[#222] h-1.5">
                  <div
                    className="bg-[#00FF66] h-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Giant Action Trigger CTA Button */}
            <button
              onClick={handleGenerateSequence}
              disabled={isSimulatingLoad || estimatedTargetsCount === 0}
              className={`w-full py-4 text-center font-mono text-xs font-extrabold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 border-2 ${
                isSimulatingLoad || estimatedTargetsCount === 0
                  ? 'bg-[#111] text-neutral-600 border-[#222] cursor-not-allowed'
                  : 'bg-[#00FF66] text-black border-[#00FF66] hover:bg-[#F9F9F9] hover:border-[#F9F9F9]'
              }`}
              style={{ borderRadius: '0px !important' }}
            >
              <span>{isSimulatingLoad ? 'GENERATING SOURCE SYSTEM PACK' : 'PUSH PIPELINE TO OUTREACH DIRECTORY'}</span>
              <span>&rarr;</span>
            </button>

          </div>

        </div>

      </div>

      {/* 3. TERMINAL DIAGNOSTIC SYSTEM LOGS FOOTER */}
      <div className="bg-[#050505] p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-b border-[#222]">
        
        {/* Live Diagnostics Log */}
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#0EA5E9] font-bold">
            <span className="inline-block w-2 h-2 bg-[#0ea5e9] animate-pulse"></span>
            <span>SYSTEM LOG OUTPUT FEED: ACTIVE SOURCE_LOG</span>
          </div>
          <div className="bg-black border border-[#222] p-4 font-mono text-[10px] text-neutral-400 space-y-1 h-[120px] overflow-y-auto">
            {systemLogs.map((log, index) => (
              <div
                key={index}
                className={index === 0 ? 'text-[#00FF66]' : 'text-neutral-500'}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Pre-Flight Statistics Grid */}
        <div className="md:col-span-4 space-y-2">
          <span className="font-mono text-[10px] text-[#888] tracking-widest uppercase block">PRE-FLIGHT DIAGNOSTICS</span>
          <div className="grid grid-cols-2 gap-px bg-[#222] border border-[#222] font-mono text-[10px]">
            <div className="bg-[#0c0c0c] p-2.5">
              <span className="text-neutral-500 block">TOTAL CREDITS IN PLAY:</span>
              <span className="font-bold text-white">4,281 / 5,000</span>
            </div>
            <div className="bg-[#0c0c0c] p-2.5">
              <span className="text-neutral-500 block">ENRICHED DATA RATE:</span>
              <span className="font-bold text-[#00FF66]">98.4% CERTIFIED</span>
            </div>
            <div className="bg-[#0c0c0c] p-2.5">
              <span className="text-neutral-500 block">EST. POSTAL POSTAGE:</span>
              <span className="font-bold text-[#0ea5e9]">${(estimatedTargetsCount * 1.15).toFixed(2)}</span>
            </div>
            <div className="bg-[#0c0c0c] p-2.5">
              <span className="text-neutral-500 block">EST. OPEN REPLY RATE:</span>
              <span className="font-bold text-[#FF3333]">3.4% - 6.8%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}