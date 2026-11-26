import React, { useState, useEffect } from 'react';

// Mock Micro-Industries list
const MICRO_INDUSTRIES = [
  { id: 'hvac', label: 'HVAC & Refrigeration', estCount: 840 },
  { id: 'cnc', label: 'Precision Machining / CNC', estCount: 312 },
  { id: 'commercial-landscaping', label: 'Commercial Landscaping', estCount: 1105 },
  { id: 'pest-control', label: 'Pest Control Services', estCount: 650 },
  { id: 'specialty-logistics', label: 'Cold Chain & Specialty Logistics', estCount: 218 },
  { id: 'msp', label: 'Managed IT Services (MSP)', estCount: 940 },
];

const TEMPLATES = [
  {
    id: 'succession',
    name: 'Direct Succession Inquiry (High Conversion)',
    subject: 'Inquiry regarding succession planning for {{Company}}',
    body: `Dear {{Owner_Name}},

I hope this message finds you well. I have been tracking the development of {{Company}} in the {{Geography}} market for several months and am highly impressed by your reputation in the {{Industry}} space.

I represent a private investment network focused on long-term stewardship. Unlike traditional private equity, our primary objective is to facilitate owner transition and preserve your local legacy, while providing you with clean liquidity.

We are actively seeking to deploy up to $3.5M in equity for an acquisition in this specific segment. If you have ever considered a succession event or a strategic partner, I would welcome a brief, confidential 10-minute call next Tuesday.

Respectfully,

[Your Name]
AcquireMeta Origination Desk`
  },
  {
    id: 'recap',
    name: 'Equity Recapitalization & Partnering Pitch',
    subject: 'Strategic Growth Capital & Partnership - {{Company}}',
    body: `Dear {{Owner_Name}},

We specialize in backing exceptional operators in the {{Industry}} sector who want to take "some chips off the table" while keeping a significant operational role. 

Our analysis indicates {{Company}} is positioned perfectly for regional consolidation. We can inject growth capital, streamline back-office systems, and secure bolt-on acquisitions to accelerate your footprint.

Would you be open to reviewing a structured recapitalization model? Let me know if you have availability this Thursday afternoon.

Regards,

[Your Name]
AcquireMeta Origination Desk`
  }
];

export default function OutboundCampaignWizard() {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState('hvac');
  const [geography, setGeography] = useState('Mid-Atlantic Region');
  const [minRevenue, setMinRevenue] = useState(1500000);
  const [maxRevenue, setMaxRevenue] = useState(6000000);
  const [selectedTemplateId, setSelectedTemplateId] = useState('succession');
  const [ownerNamePlaceholder, setOwnerNamePlaceholder] = useState('John Doe');
  const [companyNamePlaceholder, setCompanyNamePlaceholder] = useState('Apex Mechanical Solutions');
  const [deliveryMethod, setDeliveryMethod] = useState<'both' | 'physical' | 'email'>('both');
  const [cadence, setCadence] = useState<'rapid' | 'balanced' | 'conservative'>('balanced');
  const [estimatedLeads, setEstimatedLeads] = useState(140);
  const [campaignName, setCampaignName] = useState('PROJECT ORIGIN: MID-ATLANTIC HVAC');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);
  const [customBodyText, setCustomBodyText] = useState('');

  // Auto-calculate dynamic lead estimations based on sliders and filters
  useEffect(() => {
    const baseCount = MICRO_INDUSTRIES.find(i => i.id === selectedIndustry)?.estCount || 500;
    const geoMultiplier = geography.length > 0 ? 0.45 : 1.0;
    const revSpan = (maxRevenue - minRevenue) / 10000000;
    const calculated = Math.max(12, Math.round(baseCount * geoMultiplier * (revSpan + 0.2)));
    setEstimatedLeads(calculated);
  }, [selectedIndustry, geography, minRevenue, maxRevenue]);

  // Set default body text when template changes
  useEffect(() => {
    const template = TEMPLATES.find(t => t.id === selectedTemplateId);
    if (template) {
      setCustomBodyText(template.body);
    }
  }, [selectedTemplateId]);

  // Interpolate preview variables
  const getInterpolatedTemplate = (text: string) => {
    const selectedIndLabel = MICRO_INDUSTRIES.find(i => i.id === selectedIndustry)?.label || 'Specialty Services';
    return text
      .replace(/{{Owner_Name}}/g, ownerNamePlaceholder || '[Owner Name]')
      .replace(/{{Company}}/g, companyNamePlaceholder || '[Company Name]')
      .replace(/{{Geography}}/g, geography || '[Geography]')
      .replace(/{{Industry}}/g, selectedIndLabel);
  };

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
  const interpolatedSubject = getInterpolatedTemplate(selectedTemplate.subject);
  const interpolatedBody = getInterpolatedTemplate(customBodyText || selectedTemplate.body);

  const startDeploymentSimulation = () => {
    setIsDeploying(true);
    setDeploymentLog([]);
    const logs = [
      '>> INITIALIZING COMPLIANCE PROTOCOL SE-41...',
      '>> SCANNING ZIP CODES FOR ' + geography.toUpperCase() + '...',
      '>> CROSS-REFERENCING SECURED CORPORATION DATA REGISTRIES...',
      '>> FILTERING REVENUE LIMITS BETWEEN $' + (minRevenue/1000000).toFixed(1) + 'M AND $' + (maxRevenue/1000000).toFixed(1) + 'M...',
      `>> MATCHED ${estimatedLeads} PROFILES. VALIDATING DIRECT EMAIL ARCHITECTURE...`,
      '>> COMPILING MAIL MERGE SEQUENCING METADATA...',
      '>> PREPARING COMPLIANCE CHECK: NO ACTIVE RE-BROKER LISTINGS ENCOUNTERED...',
      '>> OUTBOUND ENGINE PIPELINE ARMED & INJECTED SUCCESSFULLY.'
    ];

    logs.forEach((logText, index) => {
      setTimeout(() => {
        setDeploymentLog(prev => [...prev, logText]);
        if (index === logs.length - 1) {
          setIsDeploying(false);
          setStep(4);
        }
      }, (index + 1) * 800);
    });
  };

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] border border-[#222222] font-sans flex flex-col md:flex-row min-h-[750px] relative">
      {/* LEFT CONTROL RAIL */}
      <div className="w-full md:w-[420px] bg-[#080808] border-b md:border-b-0 md:border-r border-[#222222] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-[#222222] pb-5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#00FF66] animate-pulse"></span>
              <span className="font-mono text-[9px] text-[#00FF66] tracking-widest uppercase">MODULE: OFF-MARKET ORIGINATION</span>
            </div>
            <h2 className="font-mono text-lg font-bold tracking-tight text-[#F9F9F9] mt-1">Campaign Builder</h2>
            <p className="font-mono text-[9px] text-[#666666] tracking-widest uppercase">PROPRIETARY PROSPECTING PORTAL</p>
          </div>

          {/* Stepper Wizard Indicator */}
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                disabled={isDeploying}
                className={`h-7 border font-mono text-[10px] tracking-wider uppercase transition-all flex items-center justify-center ${
                  step === s
                    ? 'border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66]'
                    : 'border-[#1a1a1a] bg-black text-[#555] hover:text-[#888]'
                }`}
              >
                0{s}
              </button>
            ))}
            <div
              className={`h-7 border font-mono text-[10px] tracking-wider uppercase flex items-center justify-center ${
                step === 4
                  ? 'border-[#0EA5E9] bg-[#0ea5e9]/10 text-[#0EA5E9]'
                  : 'border-[#1a1a1a] bg-black text-[#444]'
              }`}
            >
              DEPLOY
            </div>
          </div>

          {/* STEP 1: DEFINE AUDIENCE CRITERIA */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">01 / Micro-Industry Target</label>
                <div className="grid grid-cols-1 gap-1">
                  {MICRO_INDUSTRIES.map((ind) => (
                    <button
                      key={ind.id}
                      onClick={() => setSelectedIndustry(ind.id)}
                      className={`h-9 w-full border px-3 flex items-center justify-between text-xs font-mono transition-all text-left ${
                        selectedIndustry === ind.id
                          ? 'border-[#0ea5e9] bg-[#0ea5e9]/5 text-[#F9F9F9]'
                          : 'border-[#222] bg-black text-[#888] hover:border-[#444]'
                      }`}
                    >
                      <span>{ind.label}</span>
                      <span className="text-[10px] text-[#444] font-bold">~{ind.estCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">02 / Target Geography</label>
                <input
                  type="text"
                  value={geography}
                  onChange={(e) => setGeography(e.target.value)}
                  placeholder="e.g. Northeast Region, Sunbelt states"
                  className="w-full h-10 bg-black border border-[#222] px-3 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#00FF66] placeholder-[#444]"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {['Southeast', 'California', 'Pacific NW', 'Midwest Hub'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setGeography(preset)}
                      className="font-mono text-[8px] border border-[#222] bg-black text-[#666] hover:text-[#999] px-2 py-0.5"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-[#1a1a1a] pt-4">
                <div className="flex justify-between items-center font-mono text-[10px] text-[#888] tracking-widest uppercase">
                  <span>03 / Revenue Proxy Target</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-[#666] mb-1">
                      <span>MIN: ${(minRevenue / 1000000).toFixed(1)}M</span>
                      <span>MAX: ${(maxRevenue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="500000"
                        max="5000000"
                        step="500000"
                        value={minRevenue}
                        onChange={(e) => setMinRevenue(Number(e.target.value))}
                        className="w-1/2 h-1 bg-neutral-800 accent-[#00FF66] cursor-pointer"
                      />
                      <input
                        type="range"
                        min="5000000"
                        max="15000000"
                        step="1000000"
                        value={maxRevenue}
                        onChange={(e) => setMaxRevenue(Number(e.target.value))}
                        className="w-1/2 h-1 bg-neutral-800 accent-[#00FF66] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SEQUENCING & CADENCE */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">01 / Choose Lead Pitch Template</label>
                <div className="space-y-1">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplateId(t.id)}
                      className={`w-full border p-3 flex flex-col text-left transition-all ${
                        selectedTemplateId === t.id
                          ? 'border-[#0ea5e9] bg-[#0ea5e9]/5'
                          : 'border-[#222] bg-black text-[#888] hover:border-[#444]'
                      }`}
                    >
                      <span className="text-xs font-semibold font-mono text-[#F9F9F9]">{t.name}</span>
                      <span className="text-[10px] text-[#555] mt-1 font-mono line-clamp-1">{t.subject}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-[#1a1a1a] pt-4">
                <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">02 / Outreach Cadence Profile</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'rapid', label: 'Aggressive', desc: '4 steps / 14 days' },
                    { id: 'balanced', label: 'Balanced', desc: '3 steps / 28 days' },
                    { id: 'conservative', label: 'Focused Letter', desc: '1 step / 30 days' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCadence(c.id as any)}
                      className={`p-2 border font-mono text-center transition-all flex flex-col items-center justify-center ${
                        cadence === c.id
                          ? 'border-[#00FF66] bg-[#00FF66]/5 text-[#00FF66]'
                          : 'border-[#222] bg-black text-[#666] hover:border-[#444]'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{c.label}</span>
                      <span className="text-[8px] text-[#444] mt-0.5">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-[#1a1a1a] pt-4">
                <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">03 / Delivery Channels</label>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { id: 'both', label: 'Snail Mail Letter + Followup Direct Email' },
                    { id: 'physical', label: 'Direct Priority Physical Mail Only' },
                    { id: 'email', label: 'Verifiable Digital Email Only' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setDeliveryMethod(m.id as any)}
                      className={`h-9 w-full border px-3 flex items-center justify-between text-xs font-mono transition-all text-left ${
                        deliveryMethod === m.id
                          ? 'border-[#0ea5e9] bg-[#0ea5e9]/5 text-[#F9F9F9]'
                          : 'border-[#222] bg-black text-[#888] hover:border-[#444]'
                      }`}
                    >
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DISPATCH CONTROL PANE */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase text-[#888888] tracking-widest block">01 / Confirm Campaign Moniker</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full h-10 bg-black border border-[#222] px-3 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#00FF66]"
                />
              </div>

              <div className="border border-[#222] bg-black p-4 space-y-3">
                <h4 className="font-mono text-[10px] text-[#00FF66] tracking-wider uppercase">ORIGINATION SUMMARY ANALYSIS</h4>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#555]">Target Segment:</span>
                    <span className="text-[#ccc]">
                      {MICRO_INDUSTRIES.find(i => i.id === selectedIndustry)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555]">Qualified Leads:</span>
                    <span className="text-[#ccc]">{estimatedLeads} direct owners</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555]">Delivery Profile:</span>
                    <span className="text-[#ccc] uppercase">{deliveryMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555]">Cadence Strategy:</span>
                    <span className="text-[#0ea5e9] font-bold uppercase">{cadence}</span>
                  </div>
                </div>
                <div className="border-t border-[#1a1a1a] pt-3 flex justify-between items-center text-xs font-mono">
                  <span className="text-[#888] font-semibold">ESTIMATED COST:</span>
                  <span className="text-[#F9F9F9] font-bold">
                    ${deliveryMethod === 'email' ? (estimatedLeads * 0.5).toFixed(2) : (estimatedLeads * 2.45).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={startDeploymentSimulation}
                  disabled={isDeploying}
                  className="w-full h-12 border border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5 hover:bg-[#00FF66] hover:text-black font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] flex items-center justify-center space-x-2"
                >
                  {isDeploying ? (
                    <span className="animate-pulse">PARSING PIPELINE DATA...</span>
                  ) : (
                    <span>LAUNCH DEPLOYMENT SYSTEM</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LIVE DISPATCH ARCHIVE */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border border-[#00FF66]/20 bg-[#00FF66]/5 p-4 text-center space-y-2">
                <span className="font-mono text-[10px] text-[#00FF66] font-bold uppercase tracking-widest block">CAMPAIGN INITIALIZED SUCCESS</span>
                <p className="text-xs text-[#888] font-mono">Your outbound campaign is now structurally queued in the secure off-market database.</p>
              </div>

              <div className="bg-black border border-[#222] p-4 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#555]">JOB SYSTEM INDEX:</span>
                  <span className="text-[#fff]">#AQ-41092-B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">TOTAL OUTBOUNDS QUEUED:</span>
                  <span className="text-[#00FF66] font-bold">{estimatedLeads} Addresses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">EXPECTED INBOUND RESPONSE RATE:</span>
                  <span className="text-[#0EA5E9] font-bold">4.2% - 6.8%</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setCampaignName('NEW OUTBOUND CAMPAIGN PROJECT');
                }}
                className="w-full h-10 border border-[#222222] text-[#888] hover:text-[#fff] hover:border-[#444] font-mono text-xs uppercase"
              >
                CREATE ANOTHER PIPELINE
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Live Lead Counter Element */}
        <div className="mt-8 border-t border-[#222222] pt-5">
          <div className="bg-black p-4 border border-[#1a1a1a] flex justify-between items-center">
            <div>
              <p className="font-mono text-[8px] text-[#666]">ESTIMATED TARGET DENSITY</p>
              <p className="font-mono text-base font-bold text-[#00FF66]">{estimatedLeads} Leads</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[8px] text-[#555] block">CONFIDENCE THRESHOLD</span>
              <span className="text-[10px] font-mono text-[#0ea5e9]">98.2% VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PREVIEW & SIMULATION EXECUTOR */}
      <div className="flex-grow bg-[#050505] p-6 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Output Header */}
          <div className="flex justify-between items-center border-b border-[#222] pb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#0EA5E9] rounded-full"></span>
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9]">Live Origination Simulator</h3>
            </div>
            <div className="flex space-x-2">
              <span className="h-5 border border-[#222] bg-black px-2 py-0.5 font-mono text-[9px] text-[#444]">
                v1.12-MODEL
              </span>
            </div>
          </div>

          {/* Interactive Variables Tweak (Bento block) */}
          {step <= 2 && (
            <div className="bg-[#090909] border border-[#1a1a1a] p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-[#666] uppercase block">PREVIEW VARIABLE: {{Owner_Name}}</span>
                <input
                  type="text"
                  value={ownerNamePlaceholder}
                  onChange={(e) => setOwnerNamePlaceholder(e.target.value)}
                  className="w-full h-8 bg-black border border-[#222] px-2 text-xs font-mono text-[#F9F9F9]"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-[#666] uppercase block">PREVIEW VARIABLE: {{Company}}</span>
                <input
                  type="text"
                  value={companyNamePlaceholder}
                  onChange={(e) => setCompanyNamePlaceholder(e.target.value)}
                  className="w-full h-8 bg-black border border-[#222] px-2 text-xs font-mono text-[#F9F9F9]"
                  placeholder="Apex Machining Inc."
                />
              </div>
            </div>
          )}

          {/* Terminal Sandbox Screen */}
          <div className="bg-[#090909] border border-[#222222] font-mono text-xs leading-relaxed p-5 relative overflow-hidden h-[420px] flex flex-col justify-between">
            {/* Hologram Overlay Line effect */}
            <div className="absolute inset-x-0 h-px bg-[#00FF66]/5 top-0 animate-pulse"></div>

            {isDeploying ? (
              <div className="h-full flex flex-col justify-center space-y-3 p-4">
                <div className="flex items-center space-x-3 text-sm text-[#00FF66]">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#00FF66] animate-ping"></span>
                  <span className="font-bold">DEPLOYING COLD CAMPAIGN INTERFACE...</span>
                </div>
                <div className="space-y-1 text-[#666] text-[11px]">
                  {deploymentLog.map((log, i) => (
                    <p key={i} className={i === deploymentLog.length - 1 ? 'text-[#F9F9F9] font-semibold' : ''}>
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            ) : step === 4 ? (
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[#00FF66] border-b border-[#1a1a1a] pb-3">
                    <span>[✔]</span>
                    <span className="font-bold tracking-wider">PIPELINE SECURED & STREAMING LIVE</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-black p-3 border border-[#1a1a1a]">
                      <span className="text-[8px] text-[#555] block">DELIVERY</span>
                      <span className="text-[11px] text-[#ccc] uppercase font-bold">{deliveryMethod}</span>
                    </div>
                    <div className="bg-black p-3 border border-[#1a1a1a]">
                      <span className="text-[8px] text-[#555] block">SOCIALLY AUDITED</span>
                      <span className="text-[11px] text-[#0ea5e9] font-bold">100% PROFILES</span>
                    </div>
                    <div className="bg-black p-3 border border-[#1a1a1a]">
                      <span className="text-[8px] text-[#555] block">SNAIL MAIL DEPLOYED</span>
                      <span className="text-[11px] text-[#00FF66] font-bold">IN QUEUE</span>
                    </div>
                    <div className="bg-black p-3 border border-[#1a1a1a]">
                      <span className="text-[8px] text-[#555] block">NEXT RUN</span>
                      <span className="text-[11px] text-[#ccc]">TMRW 08:00 EST</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-[11px] text-[#666]">
                    <p className="text-[#00FF66]">● Mail merge records compiled successfully.</p>
                    <p>● Automated background legal compliance clearance executed.</p>
                    <p>● Direct phone verification available via export dashboard.</p>
                  </div>
                </div>
                <div className="border-t border-[#1a1a1a] pt-3 text-[10px] text-[#444] text-right">
                  DELETION POLICY: SH-256 AUTOMATIC PIPELINE SCRUB IN 90 DAYS
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between">
                <div>
                  {/* Subject preview */}
                  <div className="border-b border-[#1a1a1a] pb-3 mb-3">
                    <span className="text-[#555] mr-2">SUBJECT:</span>
                    <span className="text-[#00FF66] font-semibold">{interpolatedSubject}</span>
                  </div>

                  {/* Body text preview */}
                  <div className="overflow-y-auto max-h-[280px] pr-2 text-[#ccc] font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                    {interpolatedBody}
                  </div>
                </div>

                {/* Simulated Live Variable feedback info */}
                <div className="border-t border-[#1a1a1a] pt-3 flex flex-wrap justify-between items-center text-[10px] text-[#444]">
                  <span>INTERPOLATING 4 IN-MEMORY SYSTEM VARIABLES</span>
                  <span className="text-[#0EA5E9] font-bold">REAL-TIME SANDBOX</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Legal Warnings */}
        <div className="mt-6 border-t border-[#1a1a1a] pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] font-mono text-[#555]">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#FF3333]"></span>
            <span>SECURE MAIL-MERGE INTEGRATION ENGINE</span>
          </div>
          <span>COMPLIES WITH CAN-SPAM ACT GUIDELINES</span>
        </div>
      </div>
    </div>
  );
}