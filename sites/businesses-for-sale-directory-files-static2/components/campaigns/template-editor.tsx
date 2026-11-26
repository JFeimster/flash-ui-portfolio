import React, { useState, useEffect } from 'react';

// Interfaces
interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'Direct Mail' | 'Cold Email';
  cadenceStep: number;
}

interface TargetSegment {
  industry: string;
  geography: string;
  minRevenue: number;
  maxAgeOfOwner: number;
}

export default function CampaignTemplateEditor() {
  // Pre-configured templates
  const DEFAULT_TEMPLATES: Template[] = [
    {
      id: 'direct-buyout',
      name: 'Direct Owner Buyout Proposal (Direct Mail)',
      type: 'Direct Mail',
      cadenceStep: 1,
      subject: 'Strictly Confidential: Acquisition Inquiry - {{Company_Name}}',
      body: `Dear {{Owner_Name}},\n\nI hope this letter finds you well. I have been active in the {{Target_Industry}} landscape across the {{Target_City}} area for some time, and have long admired what you have built at {{Company_Name}}.\n\nI am not a broker, nor am I representing a massive private equity firm looking to strip down your team. I am an individual investor backed by Moonshine Capital with dedicated capital pre-approved under SBA 7(a) frameworks to acquire and personally operate a premium enterprise in this sector.\n\nMy research indicates {{Company_Name}} aligns perfectly with my investment criteria. I am structured to offer a straightforward transaction:\n- Capital structure supported by non-dilutive, verified cash allocations\n- Flexible transition timeline (up to 12 months transition if preferred)\n- Legacy protection for your local staff and brand identity\n\nIf you have ever considered what a liquidity event or transition might look like, I would welcome a brief, completely confidential call. I am happy to execute an NDA prior to any dialogue.\n\nCould we coordinate a brief 10-minute introduction next Tuesday?\n\nSincerely,\n\nLead Acquisition Principal\nAcquireMeta Origination Network`
    },
    {
      id: 'partnership-sba',
      name: 'Legacy Partnership & Growth Recapitalization',
      type: 'Cold Email',
      cadenceStep: 2,
      subject: 'Strategic Partnership Inquiry: Transition Planning for {{Company_Name}}',
      body: `Hi {{Owner_Name}},\n\nFollowing up on my previous correspondence. I wanted to reach out regarding your operational footprint in the {{Target_Industry}} sector near {{Target_City}}.\n\nWith current macroeconomic indicators favoring localized consolidations, my investment group is actively targeting sound operations generating substantial cash flow. Our underwriting models indicate {{Company_Name}} possesses deep operational defensibility.\n\nWe are willing to structure a highly customized buyout:\n- 100% equity buyouts or structured majority recapitalizations\n- Up to 25% standby seller notes yielding preferred returns\n- Immediate earn-out structures to maximize value on enterprise exit\n\nPlease let me know if you would like to run a custom valuation simulation via our secure portal. I can send over our secure transaction NDA anytime.\n\nBest regards,\n\nLead Acquisition Principal\nAcquireMeta Capital Partners`
    },
    {
      id: 'broker-disintermediation',
      name: 'Off-Market Direct Outreach (Light Touch)',
      type: 'Cold Email',
      cadenceStep: 1,
      subject: 'Confidential exploration - {{Company_Name}} asset parameters',
      body: `Hello {{Owner_Name}},\n\nI represent a private transaction syndicate looking to acquire high-performing {{Target_Industry}} enterprises specifically inside the {{Target_City}} geography. We prioritize direct, off-market conversations to bypass traditional brokerage transaction frictions.\n\nYour operation at {{Company_Name}} fits our active search profile. If you have immediate or mid-term transition plans, let's explore if a mutual match exists. Our typical deal sizes run between $1M and $5M in enterprise value.\n\nAll disclosures are executed under institutional grade non-disclosure protocols.\n\nAre you available for a brief introductory call this week?\n\nSincerely,\n\nTransaction Coordinator\nAcquireMeta Group`
    }
  ];

  const MERGE_TAGS = [
    { tag: '{{Owner_Name}}', desc: 'Owner / Principal Name', fallback: 'Business Owner' },
    { tag: '{{Company_Name}}', desc: 'Target Business Legal Name', fallback: 'your company' },
    { tag: '{{Target_Industry}}', desc: 'Target Micro-Industry', fallback: 'local business' },
    { tag: '{{Target_City}}', desc: 'Metropolitan/State Area', fallback: 'the region' },
    { tag: '{{Est_EBITDA}}', desc: 'Estimated EBITDA Estimate', fallback: 'highly profitable levels' }
  ];

  const MICRO_INDUSTRIES = [
    { value: 'Precision Manufacturing', count: 184 },
    { value: 'HVAC & Plumbing Services', count: 312 },
    { value: '3PL & Regional Logistics', count: 145 },
    { value: 'B2B SaaS & Tech Infrastructures', count: 98 },
    { value: 'Specialty Trade Contractors', count: 240 }
  ];

  const GEOGRAPHIES = [
    { name: 'Midwest Metro Hubs', count: 210 },
    { name: 'Southeast Growth Corridor', count: 345 },
    { name: 'Mid-Atlantic Infrastructure Belt', count: 188 },
    { name: 'West Coast Micro-Logistics', count: 110 }
  ];

  // Component State
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(DEFAULT_TEMPLATES[0]);
  const [editorSubject, setEditorSubject] = useState<string>(DEFAULT_TEMPLATES[0].subject);
  const [editorBody, setEditorBody] = useState<string>(DEFAULT_TEMPLATES[0].body);
  const [targetIndustry, setTargetIndustry] = useState<string>('HVAC & Plumbing Services');
  const [targetGeography, setTargetGeography] = useState<string>('Southeast Growth Corridor');
  const [campaignName, setCampaignName] = useState<string>('Southeast HVAC Off-Market Outreach');
  const [estimatedEbitda, setEstimatedEbitda] = useState<string>('$650,000');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const [customVariables, setCustomVariables] = useState({
    Owner_Name: 'Johnathan Miller',
    Company_Name: 'Apex Thermal Systems LLC',
    Target_Industry: 'HVAC & Facility Maintenance',
    Target_City: 'Atlanta Metro Hub',
    Est_EBITDA: '$650k'
  });

  // Keep editor state in sync when selected template changes
  const handleTemplateChange = (templateId: string) => {
    const template = DEFAULT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setEditorSubject(template.subject);
      setEditorBody(template.body);
    }
  };

  // Helper to insert tag at current selection or just append
  const insertMergeTag = (tag: string) => {
    // Basic appending helper for static presentation
    setEditorBody(prev => prev + ' ' + tag);
  };

  // Live variable replacement parser
  const renderPreview = (text: string) => {
    let output = text;
    output = output.replace(/\{\{Owner_Name\}\}/g, customVariables.Owner_Name || 'Johnathan Miller');
    output = output.replace(/\{\{Company_Name\}\}/g, customVariables.Company_Name || 'Apex Thermal Systems LLC');
    output = output.replace(/\{\{Target_Industry\}\}/g, targetIndustry || 'HVAC & Facility Maintenance');
    output = output.replace(/\{\{Target_City\}\}/g, targetGeography || 'Atlanta Metro Hub');
    output = output.replace(/\{\{Est_EBITDA\}\}/g, estimatedEbitda || '$650,000');
    return output;
  };

  // Simulate Campaign Deploy Sequence
  const handleDeployCampaign = () => {
    setIsDeploying(true);
    setDeploymentStatus('ESTABLISHING SECURE CONNECTION...');
    setTimeout(() => {
      setDeploymentStatus('VALIDATING DATA LEADS VIA PLAID/FINCEN...');
      setTimeout(() => {
        setDeploymentStatus('PARSING DELIVERABILITY OPTIMIZATIONS...');
        setTimeout(() => {
          setDeploymentStatus('CAMPAIGN DEPLOYED: 345 ACTIVE TARGETS IN ROTATION.');
          setTimeout(() => {
            setIsDeploying(false);
          }, 3000);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  // Dynamic targeting reach estimation logic
  const getReachEstimation = () => {
    const indCount = MICRO_INDUSTRIES.find(i => i.value === targetIndustry)?.count || 100;
    const geoCount = GEOGRAPHIES.find(g => g.name === targetGeography)?.count || 100;
    return Math.round((indCount * geoCount) / 125);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#F9F9F9] font-sans antialiased terminal-grid">
      {/* 1. COMPONENT HEADER BAR */}
      <div className="bg-[#090909] border-b border-[#222222] h-12 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00FF66]">ORIGINATION ENGINE</span>
          <span className="text-[#333]">|</span>
          <span className="font-mono text-[10px] text-[#888] uppercase tracking-widest">OFF-MARKET SEQUENCE INTERFACE v4.0</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono text-[#555]">
          <span>STATUS:</span>
          <span className="text-[#0EA5E9] font-bold">READY FOR DISPATCH</span>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-grow flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto border-x border-[#222222]">
        
        {/* LEFT RAIL: TARGET CONSTRAINTS & GEO PANEL */}
        <aside className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-[#222222] bg-[#080808] p-6 shrink-0 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="border-b border-[#222222] pb-4">
              <h2 className="font-mono text-sm font-bold tracking-tight text-[#F9F9F9] uppercase">
                01 / TARGETING CONFIGURATION
              </h2>
              <p className="font-mono text-[9px] text-[#666666] tracking-widest uppercase mt-1">Configure search parameters</p>
            </div>

            {/* Campaign Name Input */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest">CAMPAIGN SYSTEM IDENTIFIER</label>
              <input 
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full h-11 bg-black border border-[#222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#00FF66]"
                placeholder="Enter campaign identifier..."
              />
            </div>

            {/* Micro Industry Selection */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest">MICRO-INDUSTRY VERTICAL</label>
              <select 
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                className="w-full h-11 bg-black border border-[#222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
              >
                {MICRO_INDUSTRIES.map(ind => (
                  <option key={ind.value} value={ind.value}>{ind.value} ({ind.count} sources)</option>
                ))}
              </select>
            </div>

            {/* Geography Cluster Selection */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest">GEOGRAPHY CLUSTER</label>
              <select 
                value={targetGeography}
                onChange={(e) => setTargetGeography(e.target.value)}
                className="w-full h-11 bg-black border border-[#222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
              >
                {GEOGRAPHIES.map(geo => (
                  <option key={geo.name} value={geo.name}>{geo.name}</option>
                ))}
              </select>
            </div>

            {/* Owner/EBITDA Threshold Simulators */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between font-mono text-[10px] uppercase text-[#888888] tracking-widest">
                <span>MIN TARGET EBITDA</span>
                <span className="text-[#00FF66] font-bold">{estimatedEbitda}</span>
              </div>
              <div className="relative">
                <input 
                  type="range" 
                  min="300000" 
                  max="2000000" 
                  step="50000" 
                  value={parseInt(estimatedEbitda.replace(/[^0-9]/g, '')) || 500000}
                  className="w-full h-1 bg-neutral-800 accent-[#00FF66] cursor-pointer appearance-none rounded-none"
                  onChange={(e) => {
                    const formatted = '$' + parseInt(e.target.value).toLocaleString();
                    setEstimatedEbitda(formatted);
                  }}
                />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-[#444]">
                <span>$300K</span>
                <span>$1.0M</span>
                <span>$2.0M+</span>
              </div>
            </div>

            {/* Variables Real-time Testing Values Drawer */}
            <div className="space-y-3 bg-black/60 p-4 border border-[#1a1a1a]">
              <span className="font-mono text-[9px] text-[#0EA5E9] tracking-widest uppercase block">PREVIEW VARIABLE OVERRIDES</span>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[9px] font-mono text-[#555] block">OWNER NAME</label>
                  <input 
                    type="text" 
                    value={customVariables.Owner_Name}
                    onChange={(e) => setCustomVariables({...customVariables, Owner_Name: e.target.value})}
                    className="w-full bg-transparent border-b border-[#222] focus:border-[#0ea5e9] py-0.5 font-mono text-[#F9F9F9] focus:outline-none text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-[#555] block">COMPANY NAME</label>
                  <input 
                    type="text" 
                    value={customVariables.Company_Name}
                    onChange={(e) => setCustomVariables({...customVariables, Company_Name: e.target.value})}
                    className="w-full bg-transparent border-b border-[#222] focus:border-[#0ea5e9] py-0.5 font-mono text-[#F9F9F9] focus:outline-none text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* META METRIC SYSTEM SUMMARY */}
          <div className="border-t border-[#222222] pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black p-3.5 border border-[#161616]">
                <p className="font-mono text-[8px] text-[#666]">ESTIMATED REACH</p>
                <p className="font-mono text-base font-bold text-[#F9F9F9]">{getReachEstimation()} Owners</p>
              </div>
              <div className="bg-black p-3.5 border border-[#161616]">
                <p className="font-mono text-[8px] text-[#666]">EST. ENGAGEMENT</p>
                <p className="font-mono text-base font-bold text-[#00FF66]">18.4% — 22%</p>
              </div>
            </div>
            <div className="bg-[#00ff66]/5 border border-[#00ff66]/15 p-3 flex items-center space-x-2 text-[10px] font-mono text-[#00FF66]">
              <span className="inline-block w-1.5 h-1.5 bg-[#00FF66] rounded-full animate-pulse"></span>
              <span>SBA PRE-QUALIFICATION ASSUMPTIONS ACTIVE</span>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: TEMPLATE COMPOSER & ACTIONS */}
        <section className="flex-grow p-6 lg:p-8 space-y-6 bg-[#050505] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            {/* Header / Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#222222] pb-6">
              <div>
                <h2 className="font-mono text-sm uppercase tracking-widest text-[#F9F9F9] flex items-center space-x-2">
                  <span>02 / OUTBOUND SEQUENCE TEMPLATE EDITOR</span>
                </h2>
                <p className="text-xs text-[#666] mt-1 font-mono">Select outreach pattern and tweak core narrative variables.</p>
              </div>
              
              {/* Template Selector dropdown */}
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] text-[#555]">TEMPLATE:</span>
                <select 
                  value={selectedTemplate.id}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="bg-black border border-[#222222] px-3 py-1.5 text-xs text-[#F9F9F9] font-mono focus:outline-none focus:border-[#00FF66] rounded-none"
                >
                  {DEFAULT_TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cadence Steps Header Navigation */}
            <div className="flex space-x-1 border-b border-[#222] pb-1">
              <button className="px-4 py-2 bg-black border-t-2 border-[#00FF66] border-x border-[#222] text-xs font-mono text-[#00FF66]">
                STEP 1: INITIAL OUTREACH ({selectedTemplate.type.toUpperCase()})
              </button>
              <button className="px-4 py-2 hover:bg-[#0c0c0c] text-xs font-mono text-[#444] hover:text-[#888] transition-colors">
                STEP 2: FOLLOW-UP (AUTO-EMAIL)
              </button>
              <button className="px-4 py-2 text-xs font-mono text-[#333] cursor-not-allowed">
                STEP 3: SECURE PORTAL DEBUT
              </button>
            </div>

            {/* Merge Tag Injector Panel */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider block">QUICK INJECT DYNAMIC FIELD TAGS</span>
              <div className="flex flex-wrap gap-1.5">
                {MERGE_TAGS.map(tagItem => (
                  <button
                    key={tagItem.tag}
                    onClick={() => insertMergeTag(tagItem.tag)}
                    className="h-8 bg-black border border-[#222] hover:border-[#0EA5E9] text-[#F9F9F9] font-mono text-[10px] px-3 flex items-center space-x-1.5 transition-all"
                    title={tagItem.desc}
                  >
                    <span className="text-[#0EA5E9]">+</span>
                    <span>{tagItem.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Workspace */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase text-[#666] tracking-widest block">SUBJECT LINE / HEADER INDEX</label>
                <input 
                  type="text" 
                  value={editorSubject}
                  onChange={(e) => setEditorSubject(e.target.value)}
                  className="w-full h-11 bg-[#090909] border border-[#222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#00FF66]"
                  placeholder="Enter Subject..."
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase text-[#666] tracking-widest block">NARRATIVE BODY</label>
                <textarea 
                  rows={14}
                  value={editorBody}
                  onChange={(e) => setEditorBody(e.target.value)}
                  className="w-full bg-[#080808] border border-[#222] p-4 text-xs font-mono text-[#DDD] leading-relaxed focus:outline-none focus:border-[#00FF66] rounded-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger Console */}
          <div className="pt-6 border-t border-[#1a1a1a] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[#888] tracking-widest block">DELIVERY CADENCE CONFIG</span>
              <p className="text-[11px] text-[#555] font-mono leading-tight">
                Sequencing engine simulates natural delay distribution cycles to avoid spam filters.
              </p>
            </div>

            <div className="flex space-x-2 shrink-0">
              <button 
                onClick={() => {
                  setEditorSubject(selectedTemplate.subject);
                  setEditorBody(selectedTemplate.body);
                }}
                className="px-4 h-12 bg-neutral-900 border border-[#222222] font-mono text-xs text-[#888] hover:text-[#F9F9F9] hover:bg-neutral-800 transition-all uppercase"
              >
                RESET TEMPLATE
              </button>
              
              <button 
                onClick={handleDeployCampaign}
                disabled={isDeploying}
                className="px-6 h-12 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-xs font-bold tracking-widest uppercase transition-all hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] min-w-[200px]"
              >
                {isDeploying ? 'DISPATCHING...' : 'DISPATCH OUTBOUND PIPELINE'}
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT RAIL: REAL-TIME OUTPUT SIMULATION PREVIEW */}
        <aside className="w-full lg:w-[420px] bg-[#070707] p-6 lg:p-8 flex flex-col justify-between shrink-0 border-t lg:border-t-0 lg:border-l border-[#222222]">
          <div className="space-y-6">
            <div className="border-b border-[#222222] pb-4 flex justify-between items-center">
              <div>
                <h3 className="font-mono text-sm font-bold tracking-tight text-[#F9F9F9] uppercase">
                  03 / REAL-TIME PARSED PREVIEW
                </h3>
                <p className="font-mono text-[9px] text-[#666666] tracking-widest uppercase mt-1">Live system compiled view</p>
              </div>
              <span className="font-mono text-[8px] bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20 px-2 py-0.5 tracking-widest uppercase">
                {selectedTemplate.type}
              </span>
            </div>

            {/* Live Render Document Box */}
            <div className="bg-black border border-[#222] p-5 space-y-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] relative">
              
              {/* Paper Watermark details */}
              <div className="absolute right-3 top-3 opacity-10 pointer-events-none select-none text-right font-mono text-[9px] text-white">
                <div>ACQUIREMETA SECURE</div>
                <div>ORIGINATION PROTOCOL</div>
                <div>MD5#998-111</div>
              </div>

              {/* simulated recipient metadata */}
              <div className="border-b border-[#111] pb-3 text-[11px] space-y-1 font-mono text-[#555]">
                <div className="flex justify-between">
                  <span>SENDER:</span>
                  <span className="text-[#F9F9F9]">AcquireMeta Pipeline System (Verified Buyer Portfolio)</span>
                </div>
                <div className="flex justify-between">
                  <span>TARGET:</span>
                  <span className="text-[#0EA5E9] font-semibold">{customVariables.Owner_Name} &lt;{customVariables.Company_Name}&gt;</span>
                </div>
                <div className="flex justify-between">
                  <span>LOCATION:</span>
                  <span className="text-[#F9F9F9]">{targetGeography}</span>
                </div>
                <div className="flex justify-between">
                  <span>EST. SIZE:</span>
                  <span className="text-[#00FF66] font-semibold">{estimatedEbitda} EBITDA Base</span>
                </div>
              </div>

              {/* Rendered output letter block */}
              <div className="space-y-3 font-mono text-[11px] text-[#CCCCCC] leading-relaxed">
                <div className="text-white font-bold border-b border-[#161616] pb-2 text-[12px]">
                  <span className="text-[#555] mr-1">SUBJECT:</span>
                  {renderPreview(editorSubject)}
                </div>
                <div className="whitespace-pre-line py-2 text-[#b5b5b5]">
                  {renderPreview(editorBody)}
                </div>
              </div>

              {/* Security Audit Footnote */}
              <div className="border-t border-[#111] pt-3 flex justify-between text-[9px] font-mono text-[#444]">
                <span>ENCRYPTION SYSTEM: AES-256</span>
                <span>SECURE DELIVERABILITY ENVELOPE</span>
              </div>
            </div>
          </div>

          {/* SIMULATION STATE NOTICES */}
          <div className="mt-8 space-y-4">
            {isDeploying ? (
              <div className="bg-black border border-[#FF3333] p-4 font-mono text-xs space-y-2 glow-toxic">
                <div className="flex items-center space-x-2 text-[#FF3333]">
                  <span className="inline-block w-2.5 h-2.5 bg-[#FF3333] animate-ping rounded-full"></span>
                  <span className="font-bold tracking-wider">SYSTEM DISPATCH ACTIVE</span>
                </div>
                <p className="text-[#888] text-[10px] leading-relaxed">
                  {deploymentStatus}
                </p>
              </div>
            ) : (
              <div className="bg-black border border-[#222222] p-4 font-mono text-[10px] text-[#666] space-y-2">
                <span className="text-[#888] font-bold block">✓ VERIFICATION PROTOCOLS ACTIVE</span>
                <p className="leading-relaxed">
                  This dispatch template utilizes pre-approved SBA templates vetted for transaction security and high response deliverability rates. Individual state rules and licensing laws apply for asset classes.
                </p>
              </div>
            )}

            {/* Plaid and Trust Badges */}
            <div className="flex gap-1">
              <span className="flex-grow border border-[#222] bg-black py-2 text-center font-mono text-[8px] text-[#444] tracking-wider uppercase">
                PLAID DATA SECURED
              </span>
              <span className="flex-grow border border-[#222] bg-black py-2 text-center font-mono text-[8px] text-[#444] tracking-wider uppercase">
                SBA PRE-QUAL PRESETS
              </span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}