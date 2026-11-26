import React, { useState, useEffect, useRef } from 'react';

// Interfaces for our component state
interface TargetContact {
  id: string;
  ownerName: string;
  ownerFirst: string;
  ownerLast: string;
  companyName: string;
  city: string;
  county: string;
  state: string;
  ebitda: string;
  vertical: string;
}

interface ToneTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  channel: 'email' | 'letter';
}

export default function OutreachTemplateEditor() {
  // --- STATE ---
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'letter'>('email');
  const [selectedTone, setSelectedTone] = useState<string>('discreet');
  const [templateSubject, setTemplateSubject] = useState<string>(
    "Acquisition Inquiry: {{Company_Name}} Legacy Continuation"
  );
  const [templateBody, setTemplateBody] = useState<string>(
    "Dear {{Owner_Last_Name}},\n\nI hope this message finds you well. I have been analyzing the {{Vertical}} landscape across {{County}}, and the operational reputation of {{Company_Name}} stands out significantly.\n\nI am a private acquisition entrepreneur backed by a dedicated capital pool, seeking to acquire and personally operate a single established enterprise in the region. Unlike institutional private equity, my primary objective is to preserve your brand, retain your existing workforce, and build upon your life's work.\n\nOur financial parameters are structured to support clean, non-disruptive cash-out exits with a pre-qualified SBA 7(a) framework. If you have ever considered a succession plan or a discreet exit that protects what you have built, I would welcome a brief, confidential 10-minute call.\n\nAre you available for a introductory discussion next Tuesday morning?\n\nRespectfully,\n\n[Your Name]\nManaging Partner | Capital Partners"
  );

  // Audience Builder State
  const [targetCounty, setTargetCounty] = useState<string>("Gwinnett");
  const [targetState, setTargetState] = useState<string>("GA");
  const [targetVertical, setTargetVertical] = useState<string>("Manufacturing");
  const [minEbitda, setMinEbitda] = useState<number>(300000);
  const [maxEbitda, setMaxEbitda] = useState<number>(1500000);
  const [simulatedPoolSize, setSimulatedPoolSize] = useState<number>(42);

  // Active target for dynamic preview parsing
  const [activeTargetIndex, setActiveTargetIndex] = useState<number>(0);

  // Notification Alert state
  const [terminalAlert, setTerminalAlert] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Textarea Ref for tag insertion
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // --- MOCK DATA ---
  const targetMockPool: TargetContact[] = [
    {
      id: "tgt_001",
      ownerName: "William Vance",
      ownerFirst: "William",
      ownerLast: "Vance",
      companyName: "Vance Precision Tooling",
      city: "Duluth",
      county: "Gwinnett County",
      state: "GA",
      ebitda: "$820,000",
      vertical: "Manufacturing"
    },
    {
      id: "tgt_002",
      ownerName: "Sarah Jenkins",
      ownerFirst: "Sarah",
      ownerLast: "Jenkins",
      companyName: "Jenkins Commercial HVAC Solutions",
      city: "Franconia",
      county: "Fairfax County",
      state: "VA",
      ebitda: "$640,000",
      vertical: "HVAC"
    },
    {
      id: "tgt_003",
      ownerName: "Marcus Roy",
      ownerFirst: "Marcus",
      ownerLast: "Roy",
      companyName: "Apex Intermodal Freight",
      city: "Chicago",
      county: "Cook County",
      state: "IL",
      ebitda: "$1,150,000",
      vertical: "Logistics"
    },
    {
      id: "tgt_004",
      ownerName: "Darren Finch",
      ownerFirst: "Darren",
      ownerLast: "Finch",
      companyName: "Finch Residential Sewer & Main",
      city: "Austin",
      county: "Travis County",
      state: "TX",
      ebitda: "$480,000",
      vertical: "Home Services"
    }
  ];

  const toneTemplates: ToneTemplate[] = [
    {
      id: "discreet",
      name: "Discreet Legacy Succession",
      channel: "email",
      subject: "Acquisition Inquiry: {{Company_Name}} Legacy Continuation",
      body: "Dear {{Owner_Last_Name}},\n\nI hope this message finds you well. I have been analyzing the {{Vertical}} landscape across {{County}}, and the operational reputation of {{Company_Name}} stands out significantly.\n\nI am a private acquisition entrepreneur backed by a dedicated capital pool, seeking to acquire and personally operate a single established enterprise in the region. Unlike institutional private equity, my primary objective is to preserve your brand, retain your existing workforce, and build upon your life's work.\n\nOur financial parameters are structured to support clean, non-disruptive cash-out exits with a pre-qualified SBA 7(a) framework. If you have ever considered a succession plan or a discreet exit that protects what you have built, I would welcome a brief, confidential 10-minute call.\n\nAre you available for an introductory discussion next Tuesday morning?\n\nRespectfully,\n\n[Your Name]\nManaging Partner | Capital Partners"
    },
    {
      id: "broker_direct",
      name: "Direct Capital Sourcing",
      channel: "email",
      subject: "Proprietary Buyout Proposal: {{Company_Name}} ({{County}})",
      body: "Dear {{Owner_First_Name}},\n\nMy investment group tracks premium operations in the {{Vertical}} industry. Based on our proprietary county-level analysis of {{County}}, your company meets all of our operational benchmarks.\n\nWe are looking to deploy capital in businesses with stable adjusted cash flow. We are structured to offer a cash-dominant buyout transition and can work with you to craft custom post-closing employment, consulting, or complete walk-away terms.\n\nWe skip intermediary brokers, allowing us to transact with significantly less friction, shorter escrow times, and structured seller note mechanics. Let me know if you have any appetite for a discreet enterprise valuation call.\n\nBest regards,\n\n[Your Name]"
    },
    {
      id: "direct_mail_letter",
      name: "Formal Direct Mail Letter",
      channel: "letter",
      subject: "CONFIDENTIAL ACQUISITION INQUIRY",
      body: "Dear {{Owner_Name}},\n\nI am writing to you directly regarding your enterprise, {{Company_Name}}, based in {{City}}, {{State}}.\n\nWe specialize in acquisitions of local {{Vertical}} service firms in the region. We understand that selling a business is a deeply personal, once-in-a-lifetime decision. Our model offers seller-friendly transitions, including fully funded SBA 7(a) backed buyouts that ensure financial security for your family while keeping your legacy intact.\n\nIf you have considered retirement or transition planning over the next 12 to 24 months, please reach out to me directly at my personal priority line below.\n\nThis inquiry is strictly confidential. No brokers or third parties are involved.\n\nPersonal Phone: [Your Direct Number]\nSecure Email: [Your Direct Email]"
    }
  ];

  // Variables available to insert
  const availableTags = [
    { label: "Owner Name", token: "{{Owner_Name}}" },
    { label: "Owner First", token: "{{Owner_First_Name}}" },
    { label: "Owner Last", token: "{{Owner_Last_Name}}" },
    { label: "Company Name", token: "{{Company_Name}}" },
    { label: "City", token: "{{City}}" },
    { label: "County", token: "{{County}}" },
    { label: "State", token: "{{State}}" },
    { label: "Est. EBITDA", token: "{{EBITDA_Estimate}}" },
    { label: "Vertical Sector", token: "{{Vertical}}" }
  ];

  // --- ACTIONS & HANDLERS ---
  
  // Calculate simulated target pool based on inputs
  useEffect(() => {
    // Basic calculation simulation
    let count = Math.floor(
      (minEbitda / 10000) * 0.15 + 
      (targetCounty.length * 3.5) + 
      (targetVertical === "Manufacturing" ? 18 : 29)
    );
    if (count < 2) count = 2;
    if (count > 250) count = 250;
    setSimulatedPoolSize(count);
  }, [targetCounty, targetState, targetVertical, minEbitda, maxEbitda]);

  const handleToneChange = (toneId: string) => {
    setSelectedTone(toneId);
    const selected = toneTemplates.find(t => t.id === toneId);
    if (selected) {
      setTemplateSubject(selected.subject);
      setTemplateBody(selected.body);
      setSelectedChannel(selected.channel);
      triggerAlert(`Loaded tone layout: "${selected.name}"`, "info");
    }
  };

  const handleChannelChange = (channel: 'email' | 'letter') => {
    setSelectedChannel(channel);
    // Auto shift to an appropriate template
    const matched = toneTemplates.find(t => t.channel === channel);
    if (matched) {
      setSelectedTone(matched.id);
      setTemplateSubject(matched.subject);
      setTemplateBody(matched.body);
    }
    triggerAlert(`Switched channel parameters to: ${channel.toUpperCase()}`, "info");
  };

  const insertTag = (token: string) => {
    const textarea = bodyRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const currentText = templateBody;

    const newText = currentText.substring(0, startPos) + token + currentText.substring(endPos);
    setTemplateBody(newText);

    // Focus & reposition cursor after the inserted tag
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = startPos + token.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);

    triggerAlert(`Inserted placeholder token: ${token}`, "success");
  };

  // Helper function to dynamically parse tags for the preview panel
  const getParsedTemplate = (text: string, contact: TargetContact) => {
    if (!text) return "";
    return text
      .replace(/{{Owner_Name}}/g, contact.ownerName)
      .replace(/{{Owner_First_Name}}/g, contact.ownerFirst)
      .replace(/{{Owner_Last_Name}}/g, contact.ownerLast)
      .replace(/{{Company_Name}}/g, contact.companyName)
      .replace(/{{City}}/g, contact.city)
      .replace(/{{County}}/g, contact.county)
      .replace(/{{State}}/g, contact.state)
      .replace(/{{EBITDA_Estimate}}/g, contact.ebitda)
      .replace(/{{Vertical}}/g, contact.vertical);
  };

  const triggerAlert = (text: string, type: 'success' | 'info' | 'error') => {
    setTerminalAlert({ text, type });
    setTimeout(() => {
      setTerminalAlert(null);
    }, 4000);
  };

  const handleLaunchCampaign = () => {
    triggerAlert(`SUCCESS: Initiated outbound pipeline routing for ${simulatedPoolSize} audited targets. Tracking telemetry initiated.`, "success");
  };

  const formatCurrency = (val: number) => {
    return "$" + (val / 1000).toFixed(0) + "k";
  };

  return (
    <div className="w-full text-[#F9F9F9] font-sans antialiased bg-[#050505] p-6 space-y-6">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-[#222] bg-[#0c0c0c] p-6 relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00FF66]"></div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#00FF66] text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-tighter">OUTREACH DESK</span>
            <span className="text-[10px] font-mono text-[#0EA5E9] tracking-widest font-bold">OFF-MARKET SOURCE ENGINE v4.1</span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
            COLD OUTREACH & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F9F9] via-[#0EA5E9] to-[#00FF66]">PROSPECT SOURCE ENGINE</span>
          </h2>
          <p className="text-xs text-[#888] font-mono mt-0.5">Define target cohorts, craft structural direct solicitation templates, and preview real-time merges.</p>
        </div>

        {/* Live metrics indicator */}
        <div className="grid grid-cols-2 gap-px bg-[#222] font-mono text-xs w-full md:w-auto">
          <div className="bg-[#050505] p-3 px-4 border border-[#111]">
            <div class="text-[9px] text-[#888]">AUDITED TARGETS</div>
            <div class="text-base font-bold text-[#00FF66]" x-text="simulatedPoolSize">{simulatedPoolSize} Profiles</div>
          </div>
          <div class="bg-[#050505] p-3 px-4 border border-[#111]">
            <div class="text-[9px] text-[#888]">CHANNELS SECURED</div>
            <div class="text-base font-bold text-[#0EA5E9]">EMAIL & LETTER</div>
          </div>
        </div>
      </div>

      {/* FEEDBACK NOTIFICATION BAR */}
      {terminalAlert && (
        <div className={`border p-3 flex items-center justify-between font-mono text-xs transition-all duration-300 ${
          terminalAlert.type === 'success' ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66]' :
          terminalAlert.type === 'error' ? 'bg-[#FF3333]/10 border-[#FF3333] text-[#FF3333]' :
          'bg-[#0EA5E9]/10 border-[#0EA5E9] text-[#0EA5E9]'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="font-bold">[{terminalAlert.type.toUpperCase()}]</span>
            <span>{terminalAlert.text}</span>
          </div>
          <button onClick={() => setTerminalAlert(null)} className="text-[#888] hover:text-white font-bold ml-4">
            [X]
          </button>
        </div>
      )}

      {/* THREE-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUMN 1: TARGETING & AUDIENCE BUILDER (BENTO SIDEBAR) */}
        <div className="lg:col-span-3 bg-[#080808] border border-[#222] p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
                AUDIENCE SELECTOR
              </h3>
              <span className="text-[10px] text-[#888] font-mono">COHORT #205</span>
            </div>

            {/* State & County parameters */}
            <div className="space-y-3">
              <div>
                <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase mb-1">Target State Location</label>
                <select
                  value={targetState}
                  onChange={(e) => setTargetState(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222] text-xs font-mono text-white p-2.5 outline-none focus:border-[#0EA5E9]"
                >
                  <option value="GA">Georgia (GA)</option>
                  <option value="VA">Virginia (VA)</option>
                  <option value="IL">Illinois (IL)</option>
                  <option value="TX">Texas (TX)</option>
                  <option value="NY">New York (NY)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase mb-1">Target County</label>
                <input
                  type="text"
                  value={targetCounty}
                  onChange={(e) => setTargetCounty(e.target.value)}
                  placeholder="e.g. Gwinnett, Fairfax"
                  className="w-full bg-[#050505] border border-[#222] text-xs font-mono text-white p-2.5 placeholder:text-[#333] outline-none focus:border-[#0EA5E9]"
                />
              </div>
            </div>

            {/* Target Vertical & Industry Sectors */}
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-[#888] tracking-widest uppercase">Target Vertical Sector</label>
              <div className="grid grid-cols-2 gap-1.5">
                {["Manufacturing", "HVAC", "Logistics", "Home Services"].map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setTargetVertical(sector)}
                    className={`p-2 border font-mono text-[10px] tracking-wider transition-all text-left ${
                      targetVertical === sector
                        ? "bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66] font-bold"
                        : "bg-[#050505] border-[#222] text-[#888] hover:border-[#444] hover:text-[#F9F9F9]"
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>

            {/* EBITDA Slicing range */}
            <div className="space-y-3 bg-[#050505] p-3 border border-[#222]">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-[#888] tracking-widest uppercase">Min Adj. EBITDA</span>
                <span className="font-mono text-[11px] text-[#00FF66] font-bold">{formatCurrency(minEbitda)}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="50000"
                value={minEbitda}
                onChange={(e) => setMinEbitda(Number(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-[#444]">
                <span>$100K</span>
                <span>$1.0M</span>
                <span>$2.0M</span>
              </div>
            </div>

            {/* Verified criteria switches */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between p-2.5 bg-[#050505] border border-[#222] text-[10px] font-mono">
                <span className="text-[#888]">EXCLUDE PRIVATE EQUITY OWNED</span>
                <span className="text-[#00FF66] font-bold">[YES]</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#050505] border border-[#222] text-[10px] font-mono">
                <span className="text-[#888]">PLAID REVENUE VERIFIED</span>
                <span className="text-[#0ea5e9] font-bold">[ACTIVE]</span>
              </div>
            </div>
          </div>

          {/* Sourcing summary diagnostics */}
          <div className="border-t border-[#111] pt-4 space-y-3 text-xs font-mono">
            <div className="p-3 bg-[#FF3333]/10 border border-[#FF3333]/30">
              <div className="text-[9px] text-[#FF3333] font-bold tracking-wider uppercase">DELIVERY CONFIDENCE RATINGS</div>
              <p className="text-[10px] text-[#888] leading-tight mt-1">
                Local county databases verify active trade registration. Expected corporate delivery response rate: <span className="text-white font-bold">3.8% - 7.2%</span>.
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN 2: WORKSPACE & TEMPLATE BUILDER */}
        <div className="lg:col-span-5 bg-[#050505] border border-[#222] p-5 flex flex-col space-y-4">
          
          {/* Channel Selector and Preset Selector Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-3 border-b border-[#222] gap-3">
            <div className="flex space-x-1.5 bg-[#111] p-1 border border-[#222]">
              <button
                onClick={() => handleChannelChange('email')}
                className={`px-3 py-1 text-xs font-mono font-bold tracking-wider transition-all ${
                  selectedChannel === 'email'
                    ? 'bg-[#0EA5E9] text-black'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                EMAIL CHANNEL
              </button>
              <button
                onClick={() => handleChannelChange('letter')}
                className={`px-3 py-1 text-xs font-mono font-bold tracking-wider transition-all ${
                  selectedChannel === 'letter'
                    ? 'bg-[#0EA5E9] text-black'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                DIRECT MAIL
              </button>
            </div>

            <div className="w-full md:w-auto">
              <select
                value={selectedTone}
                onChange={(e) => handleToneChange(e.target.value)}
                className="bg-[#0c0c0c] border border-[#222] text-[11px] font-mono text-[#00FF66] p-1.5 focus:outline-none"
              >
                <option value="" disabled>-- Quick Preset Tone --</option>
                {toneTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Field (Only applies to Email type but shown as customizable header/title for letter too) */}
          <div className="space-y-1">
            <label className="block font-mono text-[9px] text-[#888] tracking-wider uppercase">
              {selectedChannel === 'email' ? 'Subject Line' : 'Envelope / Document Title Headline'}
            </label>
            <input
              type="text"
              value={templateSubject}
              onChange={(e) => setTemplateSubject(e.target.value)}
              className="w-full bg-[#080808] border border-[#222] text-xs font-mono text-[#0EA5E9] p-3 outline-none focus:border-[#0EA5E9]"
              placeholder="Template title structure..."
            />
          </div>

          {/* Variables Tag Injector Grid */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[9px] text-[#888] tracking-wider uppercase">INJECT DYNAMIC TELEMETRY TAG</label>
              <span className="text-[8px] text-[#888] font-mono">[CLICK TO INSERT]</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {availableTags.map((tag) => (
                <button
                  key={tag.token}
                  onClick={() => insertTag(tag.token)}
                  className="bg-[#0c0c0c] hover:bg-[#111] border border-[#222] hover:border-[#888] text-[9px] font-mono text-[#888] hover:text-white py-1.5 px-2 text-left truncate transition-all"
                  title={`Insert ${tag.token}`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template Body Editor */}
          <div className="space-y-1 flex-grow flex flex-col">
            <label className="block font-mono text-[9px] text-[#888] tracking-wider uppercase">OUTREACH CONSTITUTION COMPILER</label>
            <textarea
              ref={bodyRef}
              value={templateBody}
              onChange={(e) => setTemplateBody(e.target.value)}
              className="w-full flex-grow bg-[#080808] border border-[#222] text-xs font-mono text-[#F9F9F9] p-4 placeholder:text-[#333] outline-none focus:border-[#00FF66] font-normal leading-relaxed resize-none min-h-[350px]"
            />
          </div>

          {/* Reset and custom copy actions */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                setTemplateBody("");
                triggerAlert("Template wiped clean.", "info");
              }}
              className="text-[10px] font-mono text-[#FF3333] hover:underline uppercase tracking-wider"
            >
              [WIPE TEMPLATE]
            </button>
            <span className="text-[10px] font-mono text-[#444]">
              CHARS: {templateBody.length} | LINES: {templateBody.split('\n').length}
            </span>
          </div>
        </div>

        {/* COLUMN 3: TERMINAL LIVE PREVIEW & DISPATCH PANEL */}
        <div className="lg:col-span-4 bg-[#080808] border border-[#222] p-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4 flex-grow flex flex-col">
            
            {/* Live preview header & selector */}
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="font-mono text-xs font-bold tracking-wider text-[#00FF66] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#00FF66]"></span>
                LIVE COMPILED PREVIEW
              </h3>
              <div className="flex items-center space-x-1">
                <span className="text-[9px] font-mono text-[#888]">TEST TARGET:</span>
                <select
                  value={activeTargetIndex}
                  onChange={(e) => setActiveTargetIndex(Number(e.target.value))}
                  className="bg-[#050505] border border-[#222] text-[10px] font-mono text-white p-1"
                >
                  {targetMockPool.map((t, idx) => (
                    <option key={t.id} value={idx}>
                      {t.ownerLast} ({t.companyName.substring(0, 10)}...)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Compiled Preview Window with styled envelopes/headers */}
            <div className="bg-[#050505] border border-[#222] p-4 flex-grow font-mono text-xs overflow-y-auto max-h-[460px] space-y-3 relative">
              <div className="absolute top-2 right-2 text-[8px] text-[#444] tracking-widest font-bold uppercase select-none">
                SIMULATION SCREEN
              </div>

              {/* Envelope styling details */}
              <div className="border-b border-[#222] pb-2 text-[10px] text-[#888] space-y-1">
                <div>
                  <span className="text-white font-bold">FROM:</span> acquire@terminal-route.net
                </div>
                <div>
                  <span className="text-white font-bold">TO:</span> {targetMockPool[activeTargetIndex].ownerFirst.toLowerCase()}@{targetMockPool[activeTargetIndex].companyName.replace(/\s+/g, '').toLowerCase()}.com
                </div>
                <div>
                  <span className="text-[#0EA5E9] font-bold">SUBJECT:</span> {getParsedTemplate(templateSubject, targetMockPool[activeTargetIndex])}
                </div>
              </div>

              {/* Parsed message text */}
              <div className="whitespace-pre-wrap leading-relaxed text-[#F9F9F9]/95 text-[11px] pt-1">
                {getParsedTemplate(templateBody, targetMockPool[activeTargetIndex])}
              </div>
            </div>

            {/* Cost and metric assessment */}
            <div className="bg-[#0a0a0a] border border-[#222] p-4 space-y-3">
              <div className="text-[9px] font-mono text-[#888] uppercase tracking-widest">CAMPAIGN DISPATCH TELEMETRY</div>
              
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-black p-2 border border-[#111]">
                  <span className="text-[#888] block text-[9px]">OUTBOUND POOL:</span>
                  <span className="text-white font-bold">{simulatedPoolSize} Target Businesses</span>
                </div>
                <div className="bg-black p-2 border border-[#111]">
                  <span className="text-[#888] block text-[9px]">COST ASSESSMENT:</span>
                  <span className="text-[#00FF66] font-bold">
                    {selectedChannel === 'email' ? '0.00 CREDITS (UNLIMITED)' : `${(simulatedPoolSize * 0.85).toFixed(2)} CREDITS`}
                  </span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[#888] leading-tight">
                * Real-time county filters cross-reference USPS delivery databases to reduce bounced mail and deliver directly to owner-occupied home addresses.
              </div>
            </div>

          </div>

          {/* Big Launch Trigger */}
          <button
            onClick={handleLaunchCampaign}
            className="w-full bg-[#00FF66] text-black font-mono text-xs font-black py-4 tracking-widest hover:bg-[#F9F9F9] transition-all uppercase flex items-center justify-center space-x-2"
          >
            <span>ROUTE OUTBOUND SOURCING PIPELINE</span>
            <span>&rarr;</span>
          </button>

        </div>

      </div>

      {/* VERIFICATION BAR */}
      <div className="border border-[#222] bg-[#0c0c0c] p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
          <span className="inline-block w-2 h-2 bg-[#00FF66]"></span>
          <span>CAN-SPAM COMPLIANT</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
          <span className="inline-block w-2 h-2 bg-[#0EA5E9]"></span>
          <span>USPS ZIP-CODE VALIDATED</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
          <span className="inline-block w-2 h-2 bg-white"></span>
          <span>PROPRIETARY COHORTS ONLY</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
          <span className="inline-block w-2 h-2 bg-[#FF3333]"></span>
          <span>SECURE SEC-32 ROUTED</span>
        </div>
      </div>

    </div>
  );
}