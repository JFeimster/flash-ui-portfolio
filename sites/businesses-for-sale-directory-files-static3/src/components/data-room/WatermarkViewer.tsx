import React, { useState, useEffect, useMemo } from 'react';

// Secure CIM Data Room & Financial Underwriting Vault: WatermarkViewer Component
export default function WatermarkViewer() {
  // --- STATE ---
  const [operatorId, setOperatorId] = useState('ETA-7922');
  const [clientIp, setClientIp] = useState('192.168.42.201');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.12);
  const [watermarkAngle, setWatermarkAngle] = useState(-25);
  const [activeDoc, setActiveDoc] = useState<'CIM' | 'TAX_RECON' | 'QOFE_BRIDGE' | 'ORG_TREE'>('CIM');
  
  // Decryption validation key for the org tree
  const [orgDecrypted, setOrgDecrypted] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showCodeError, setShowCodeError] = useState(false);

  // Reconciliation add-backs state
  const [addbacks, setAddbacks] = useState({
    sellerSalary: true,
    personalAuto: true,
    oneTimeConsulting: false,
    intercompanyLicense: true,
    nonCashAmortization: false,
  });

  // Dynamic Audit Log state
  const [logs, setLogs] = useState<Array<{ id: string; time: string; msg: string; type: 'INFO' | 'WARN' | 'SECURE' }>>([
    { id: '1', time: '14:20:05', msg: 'Operator session initialized.', type: 'INFO' },
    { id: '2', time: '14:20:06', msg: 'SHA-256 handshake complete with FINCEN Hub.', type: 'SECURE' },
    { id: '3', time: '14:20:07', msg: 'Watermark grid generated with Operator ID and system IP.', type: 'INFO' },
  ]);

  // --- LOGGERS ---
  const pushLog = (msg: string, type: 'INFO' | 'WARN' | 'SECURE' = 'INFO') => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [
      { id: Date.now().toString(), time: timestamp, msg, type },
      ...prev,
    ]);
  };

  // --- CALCULATED VALUES (Tax Reconciliation) ---
  const baseNetIncome = 450000;
  const askingPrice = 1850000;
  const addbackValues = {
    sellerSalary: 120000,
    personalAuto: 250000,
    oneTimeConsulting: 35000,
    intercompanyLicense: 18000,
    nonCashAmortization: 42000,
  };

  const calculatedEbitda = useMemo(() => {
    let total = baseNetIncome;
    if (addbacks.sellerSalary) total += addbackValues.sellerSalary;
    if (addbacks.personalAuto) total += addbackValues.personalAuto;
    if (addbacks.oneTimeConsulting) total += addbackValues.oneTimeConsulting;
    if (addbacks.intercompanyLicense) total += addbackValues.intercompanyLicense;
    if (addbacks.nonCashAmortization) total += addbackValues.nonCashAmortization;
    return total;
  }, [addbacks]);

  const calculatedMultiple = useMemo(() => {
    return (askingPrice / calculatedEbitda).toFixed(2);
  }, [calculatedEbitda]);

  // Handle active document change
  const handleDocChange = (doc: 'CIM' | 'TAX_RECON' | 'QOFE_BRIDGE' | 'ORG_TREE') => {
    setActiveDoc(doc);
    pushLog(`Switched view to asset file: [${doc}]`, 'INFO');
  };

  // Toggle addbacks
  const handleAddbackToggle = (key: keyof typeof addbacks) => {
    setAddbacks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      pushLog(`Re-calculating addbacks: ${key} set to ${next[key]}`, 'INFO');
      return next;
    });
  };

  // Decrypt Org Chart Action
  const triggerDecryptionAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === '9924') {
      setOrgDecrypted(true);
      setShowCodeError(false);
      pushLog('SECURITY OVERRIDE DETECTED: Decrypted organizational tree names.', 'SECURE');
    } else {
      setShowCodeError(true);
      pushLog('INVALID DECRYPTION ATTEMPT: Incorrect override token submitted.', 'WARN');
    }
  };

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] font-sans antialiased border border-[#222]">
      {/* Strict Reset for Hard Edges inside this container */}
      <style dangerouslySetInnerHTML={{__html: `
        .vdr-container * {
          border-radius: 0px !important;
        }
        .vdr-grid-bg {
          background-image: radial-gradient(#111 1px, transparent 1px);
          background-size: 16px 16px;
        }
      `}} />

      <div className="vdr-container flex flex-col min-h-[750px]">
        {/* SECTION HEADER */}
        <div className="px-6 py-4 bg-[#0a0a0a] border-b border-[#222] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#FF3333] text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-tighter">SECURE CLEAN ROOM</span>
              <span className="text-[10px] font-mono text-[#0EA5E9] tracking-widest font-bold">VDR PORTAL v4.11</span>
            </div>
            <h2 className="text-xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1 uppercase">
              Underwriting Vault &amp; Asset Verification
            </h2>
            <p className="text-xs text-[#888] font-mono mt-0.5">
              Live tax reconciliation tools, dynamic watermark overlays, and automated searcher activity logs.
            </p>
          </div>

          {/* Core Portal Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#222] w-full md:w-auto text-left font-mono text-[10px]">
            <div className="bg-[#050505] p-2 px-3">
              <span className="text-[#888] block text-[8px]">ASKING PRICE</span>
              <span className="font-bold text-white">$1.85M</span>
            </div>
            <div className="bg-[#050505] p-2 px-3">
              <span className="text-[#888] block text-[8px]">ADJUSTED EBITDA</span>
              <span className="font-bold text-[#00FF66]">${(calculatedEbitda / 1000).toFixed(0)}K</span>
            </div>
            <div className="bg-[#050505] p-2 px-3">
              <span className="text-[#888] block text-[8px]">IMPLIED MULTIPLE</span>
              <span className="font-bold text-[#0EA5E9]">{calculatedMultiple}x</span>
            </div>
          </div>
        </div>

        {/* WORKSPACE LAYOUT */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#222]">
          
          {/* LEFT SIDEBAR: Document Picker, Watermark Settings, Reconciler */}
          <aside className="lg:col-span-4 bg-[#080808] border-r border-[#222] p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Document File Selector */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Select Underwriting Asset</label>
                <div className="space-y-1">
                  <button 
                    onClick={() => handleDocChange('CIM')}
                    className={`w-full flex items-center justify-between p-3 font-mono text-xs border tracking-wider transition-all text-left ${
                      activeDoc === 'CIM' ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] font-bold' : 'bg-[#050505] border-[#222] text-[#888] hover:border-[#444] hover:text-[#F9F9F9]'
                    }`}
                  >
                    <span>CIM_Draft_v4_Redacted.pdf</span>
                    <span className="text-[10px] text-white/50">[3.4 MB]</span>
                  </button>

                  <button 
                    onClick={() => handleDocChange('TAX_RECON')}
                    className={`w-full flex items-center justify-between p-3 font-mono text-xs border tracking-wider transition-all text-left ${
                      activeDoc === 'TAX_RECON' ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] font-bold' : 'bg-[#050505] border-[#222] text-[#888] hover:border-[#444] hover:text-[#F9F9F9]'
                    }`}
                  >
                    <span>Form_1120S_AddBack_Matrix.xlsx</span>
                    <span className="text-[10px] text-[#00FF66]">[Interactive]</span>
                  </button>

                  <button 
                    onClick={() => handleDocChange('QOFE_BRIDGE')}
                    className={`w-full flex items-center justify-between p-3 font-mono text-xs border tracking-wider transition-all text-left ${
                      activeDoc === 'QOFE_BRIDGE' ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] font-bold' : 'bg-[#050505] border-[#222] text-[#888] hover:border-[#444] hover:text-[#F9F9F9]'
                    }`}
                  >
                    <span>Quality_of_Earnings_Bridge.svg</span>
                    <span className="text-[10px] text-white/50">[Waterfall]</span>
                  </button>

                  <button 
                    onClick={() => handleDocChange('ORG_TREE')}
                    className={`w-full flex items-center justify-between p-3 font-mono text-xs border tracking-wider transition-all text-left ${
                      activeDoc === 'ORG_TREE' ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] font-bold' : 'bg-[#050505] border-[#222] text-[#888] hover:border-[#444] hover:text-[#F9F9F9]'
                    }`}
                  >
                    <span>Redacted_Personnel_OrgTree.map</span>
                    <span className="text-[10px] text-[#FF3333]">[REDACTED]</span>
                  </button>
                </div>
              </div>

              {/* Watermark Dynamic Customizer */}
              <div className="space-y-4 bg-[#0a0a0a] p-4 border border-[#222]">
                <div className="border-b border-[#222] pb-2">
                  <h3 className="font-mono text-[10px] font-bold text-[#0EA5E9] tracking-wider uppercase flex items-center gap-2">
                    <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
                    Dynamic Watermark Grid
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] text-[#888] tracking-widest uppercase">Operator Key</label>
                    <input 
                      type="text" 
                      value={operatorId}
                      onChange={(e) => { setOperatorId(e.target.value.toUpperCase()); pushLog(`Updated Watermark Operator ID: ${e.target.value}`, 'INFO'); }}
                      className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white px-2 py-1.5 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] text-[#888] tracking-widest uppercase">IP Tracker</label>
                    <input 
                      type="text" 
                      value={clientIp}
                      onChange={(e) => { setClientIp(e.target.value); pushLog(`Updated Watermark Track IP: ${e.target.value}`, 'INFO'); }}
                      className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white px-2 py-1.5 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between font-mono text-[8px] text-[#888] uppercase">
                    <span>Grid Opacity</span>
                    <span className="text-[#00FF66] font-bold">{(watermarkOpacity * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.02" 
                    max="0.4" 
                    step="0.01" 
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[8px] text-[#888] uppercase">
                    <span>Angle Distortion</span>
                    <span className="text-[#0EA5E9] font-bold">{watermarkAngle}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="-90" 
                    max="90" 
                    step="5" 
                    value={watermarkAngle}
                    onChange={(e) => setWatermarkAngle(parseInt(e.target.value))}
                    className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
                  />
                </div>
              </div>

              {/* Addbacks Config (Tax Reconciliation Side Widget) */}
              {activeDoc === 'TAX_RECON' && (
                <div className="space-y-3 bg-[#0a0a0a] p-4 border border-[#00FF66]/20 animate-pulse-fast">
                  <div className="border-b border-[#222] pb-2">
                    <h3 className="font-mono text-[10px] font-bold text-[#00FF66] tracking-wider uppercase">
                      Underwriter Add-Back Toggles
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-mono text-white/80 cursor-pointer">
                      <span>Owner Discretionary Salary</span>
                      <input 
                        type="checkbox" 
                        checked={addbacks.sellerSalary}
                        onChange={() => handleAddbackToggle('sellerSalary')}
                        className="accent-[#00FF66]"
                      />
                    </label>
                    <label className="flex items-center justify-between text-xs font-mono text-white/80 cursor-pointer">
                      <span>Personal Auto (Lease/Ins)</span>
                      <input 
                        type="checkbox" 
                        checked={addbacks.personalAuto}
                        onChange={() => handleAddbackToggle('personalAuto')}
                        className="accent-[#00FF66]"
                      />
                    </label>
                    <label className="flex items-center justify-between text-xs font-mono text-white/80 cursor-pointer">
                      <span>One-Time System Migration</span>
                      <input 
                        type="checkbox" 
                        checked={addbacks.oneTimeConsulting}
                        onChange={() => handleAddbackToggle('oneTimeConsulting')}
                        className="accent-[#00FF66]"
                      />
                    </label>
                    <label className="flex items-center justify-between text-xs font-mono text-white/80 cursor-pointer">
                      <span>Intercompany IP Royalty</span>
                      <input 
                        type="checkbox" 
                        checked={addbacks.intercompanyLicense}
                        onChange={() => handleAddbackToggle('intercompanyLicense')}
                        className="accent-[#00FF66]"
                      />
                    </label>
                    <label className="flex items-center justify-between text-xs font-mono text-white/80 cursor-pointer">
                      <span>Non-Cash Depreciation</span>
                      <input 
                        type="checkbox" 
                        checked={addbacks.nonCashAmortization}
                        onChange={() => handleAddbackToggle('nonCashAmortization')}
                        className="accent-[#00FF66]"
                      />
                    </label>
                  </div>
                </div>
              )}

            </div>

            {/* Quick Warning / Legal Box */}
            <div className="p-3 bg-[#FF3333]/10 border border-[#FF3333]/30">
              <div className="text-[9px] font-mono text-[#FF3333] font-bold tracking-wider">SECURE CLEAN ROOM ENFORCEMENT</div>
              <p className="text-[10px] text-[#888] font-mono leading-tight mt-1">
                Any unauthorized screenshots, scraping, or code decryption attempts will instantly trigger alert protocols mapped to security ID: <span className="text-[#0EA5E9] font-bold">{operatorId}</span>.
              </p>
            </div>
          </aside>

          {/* CENTER PANEL: Document Canvas with Realtime Watermark Grid */}
          <section className="lg:col-span-8 bg-[#0c0c0c] p-6 relative overflow-hidden flex flex-col justify-between vdr-grid-bg">
            
            {/* Dynamic Watermark Overlay Layer */}
            <div 
              className="absolute inset-0 pointer-events-none select-none overflow-hidden z-10"
              style={{ opacity: watermarkOpacity }}
            >
              <div 
                className="grid grid-cols-3 gap-y-24 gap-x-12 w-[180%] h-[180%] -left-1/3 -top-1/3 font-mono text-[9px] font-bold text-center uppercase whitespace-nowrap"
                style={{ transform: `rotate(${watermarkAngle}deg)` }}
              >
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="text-[#0EA5E9]">
                    {operatorId} // {clientIp} <br/>
                    <span className="text-white">SYS_SECURE_REDACTED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Rendered View Area */}
            <div className="z-20 w-full flex-grow flex flex-col justify-start">
              
              {/* INTERACTIVE VIEW 1: CIM */}
              {activeDoc === 'CIM' && (
                <div className="bg-[#050505] border border-[#222] p-8 space-y-6 flex-grow">
                  <div className="border-b border-[#222] pb-4 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-[#0ea5e9] tracking-widest block uppercase">DOCUMENT VIEWER // CIM_DRAFT_V4.PDF</span>
                      <h3 className="text-lg font-bold font-mono text-white mt-1">CONFIDENTIAL ASSET OVERVIEW</h3>
                    </div>
                    <span className="text-[10px] font-mono bg-[#111] px-2 py-1 border border-[#222] text-yellow-500">Page 1 of 12</span>
                  </div>

                  <div className="space-y-4 font-mono text-xs text-[#888] leading-relaxed">
                    <p>
                      The company is a highly automated enterprise, offering <span className="relative group text-[#F9F9F9] bg-[#222] px-1 hover:bg-[#00FF66] hover:text-black transition-colors cursor-help">██████████████████<span className="absolute hidden group-hover:block bottom-full left-0 bg-[#050505] border border-[#00FF66] text-[#00FF66] text-[10px] p-2 whitespace-nowrap z-50">[REDACTED: PRIMARY NICHE LOGISTICS]</span></span> operating across premium shipping channels. Established dispatch systems allow operators to drive gross margins well exceeding trade standards.
                    </p>
                    <p>
                      Seller and ownership interests require immediate transition support owing to personal retirement schedules. Current operational framework maintains <span className="bg-[#222] px-1 text-white">15 commercial logistics technicians</span> running dynamic routes across the mid-atlantic corridor.
                    </p>

                    <div className="bg-black/50 p-4 border border-[#222] space-y-3">
                      <span className="text-[10px] font-bold text-[#0ea5e9] block uppercase tracking-wider">Key Redacted Metrics Available upon LOI</span>
                      <ul className="space-y-1 text-[11px]">
                        <li className="flex justify-between"><span>Target Entity HQ:</span> <span className="text-[#FF3333] font-bold">█████████, VA</span></li>
                        <li className="flex justify-between"><span>Contracted Accounts (Active):</span> <span className="text-white font-bold">42 Operational Nodes</span></li>
                        <li className="flex justify-between"><span>Owner Hours of Operation:</span> <span className="text-white font-bold">&lt; 15 Hours Weekly</span></li>
                      </ul>
                    </div>

                    <p>
                      Transition protocols involve the deployment of integrated technology transfer agreements. Technology Stack includes modern proprietary software to automatically route and invoice clients, avoiding common manual booking errors.
                    </p>
                  </div>
                </div>
              )}

              {/* INTERACTIVE VIEW 2: TAX RECONCILIATION */}
              {activeDoc === 'TAX_RECON' && (
                <div className="bg-[#050505] border border-[#00FF66]/20 p-8 space-y-6 flex-grow">
                  <div className="border-b border-[#222] pb-4 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-[#00FF66] tracking-widest block uppercase">TAX RECONCILIATION &amp; EBITDA BRIDGING PORTAL</span>
                      <h3 className="text-lg font-bold font-mono text-white mt-1">Consolidated Add-Back Adjustments</h3>
                    </div>
                    <span className="text-[10px] font-mono bg-[#111] px-2 py-1 border border-[#222] text-[#00FF66]">Dynamic Sandbox Mode</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border border-[#222]">
                      <thead>
                        <tr className="bg-[#111] border-b border-[#222] text-[#888]">
                          <th className="p-3">FINANCIAL LINE ITEMS</th>
                          <th className="p-3 text-right">UNAUDITED TAX VALUE</th>
                          <th className="p-3 text-right">ADD-BACK STATUS</th>
                          <th className="p-3 text-right text-white">ADJUSTED RUN-RATE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222]">
                        <tr>
                          <td className="p-3 font-semibold text-white">Net Income (S-Corp Form 1120S)</td>
                          <td className="p-3 text-right">$450,000</td>
                          <td className="p-3 text-right text-[#888]">- Base -</td>
                          <td className="p-3 text-right font-bold text-white">$450,000</td>
                        </tr>
                        <tr className={addbacks.sellerSalary ? 'bg-[#00FF66]/5' : ''}>
                          <td className="p-3">Seller Discretionary Salary</td>
                          <td className="p-3 text-right">$120,000</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleAddbackToggle('sellerSalary')} className={`px-2 py-0.5 text-[9px] font-bold ${addbacks.sellerSalary ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30' : 'bg-transparent border border-[#333] text-[#444]'}`}>
                              {addbacks.sellerSalary ? 'APPLIED' : 'OVAL'}
                            </button>
                          </td>
                          <td className="p-3 text-right font-bold text-[#00FF66]">{addbacks.sellerSalary ? '+$120,000' : '$0'}</td>
                        </tr>
                        <tr className={addbacks.personalAuto ? 'bg-[#00FF66]/5' : ''}>
                          <td className="p-3">Personal Vehicle &amp; Insurance</td>
                          <td className="p-3 text-right">$25,000</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleAddbackToggle('personalAuto')} className={`px-2 py-0.5 text-[9px] font-bold ${addbacks.personalAuto ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30' : 'bg-transparent border border-[#333] text-[#444]'}`}>
                              {addbacks.personalAuto ? 'APPLIED' : 'OVAL'}
                            </button>
                          </td>
                          <td className="p-3 text-right font-bold text-[#00FF66]">{addbacks.personalAuto ? '+$25,000' : '$0'}</td>
                        </tr>
                        <tr className={addbacks.oneTimeConsulting ? 'bg-[#00FF66]/5' : ''}>
                          <td className="p-3">One-Time Server Migration Costs</td>
                          <td className="p-3 text-right">$35,000</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleAddbackToggle('oneTimeConsulting')} className={`px-2 py-0.5 text-[9px] font-bold ${addbacks.oneTimeConsulting ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30' : 'bg-transparent border border-[#333] text-[#444]'}`}>
                              {addbacks.oneTimeConsulting ? 'APPLIED' : 'OVAL'}
                            </button>
                          </td>
                          <td className="p-3 text-right font-bold text-[#00FF66]">{addbacks.oneTimeConsulting ? '+$35,000' : '$0'}</td>
                        </tr>
                        <tr className={addbacks.intercompanyLicense ? 'bg-[#00FF66]/5' : ''}>
                          <td className="p-3">Intercompany IP Royalty Payment</td>
                          <td className="p-3 text-right">$18,000</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleAddbackToggle('intercompanyLicense')} className={`px-2 py-0.5 text-[9px] font-bold ${addbacks.intercompanyLicense ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30' : 'bg-transparent border border-[#333] text-[#444]'}`}>
                              {addbacks.intercompanyLicense ? 'APPLIED' : 'OVAL'}
                            </button>
                          </td>
                          <td className="p-3 text-right font-bold text-[#00FF66]">{addbacks.intercompanyLicense ? '+$18,000' : '$0'}</td>
                        </tr>
                        <tr className={addbacks.nonCashAmortization ? 'bg-[#00FF66]/5' : ''}>
                          <td className="p-3">Non-Cash Asset Amortization</td>
                          <td className="p-3 text-right">$42,000</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleAddbackToggle('nonCashAmortization')} className={`px-2 py-0.5 text-[9px] font-bold ${addbacks.nonCashAmortization ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30' : 'bg-transparent border border-[#333] text-[#444]'}`}>
                              {addbacks.nonCashAmortization ? 'APPLIED' : 'OVAL'}
                            </button>
                          </td>
                          <td className="p-3 text-right font-bold text-[#00FF66]">{addbacks.nonCashAmortization ? '+$42,000' : '$0'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-[#111] p-4 border border-[#222] flex flex-col md:flex-row justify-between items-center text-xs font-mono">
                    <span className="text-[#888]">ADJUSTED TRANSACTION REVENUE RUN-RATE:</span>
                    <span className="text-[#00FF66] font-extrabold text-sm">${(calculatedEbitda / 1000).toFixed(0)}K EBITDA ({calculatedMultiple}x Ask Multiplier)</span>
                  </div>
                </div>
              )}

              {/* INTERACTIVE VIEW 3: QofE BRIDGE CHART */}
              {activeDoc === 'QOFE_BRIDGE' && (
                <div className="bg-[#050505] border border-[#222] p-8 space-y-6 flex-grow">
                  <div className="border-b border-[#222] pb-4">
                    <span className="text-[10px] font-mono text-[#0ea5e9] tracking-widest block uppercase">QOFE QUALITY OF EARNINGS BRIDGE</span>
                    <h3 className="text-lg font-bold font-mono text-white mt-1">EBITDA Adjustments Bridge Waterfall Diagram</h3>
                  </div>

                  <p className="text-xs text-[#888] font-mono leading-relaxed">
                    Waterfall rendering illustrating standard deviations from initial Net Income reporting mechanisms up through verified Quality of Earnings adjustment projections.
                  </p>

                  <div className="pt-6 space-y-4">
                    {/* Step 1: Base Net Income */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-white">1. Core Net Income Tax Declaration</span>
                        <span className="text-[#888]">$450,000 Base</span>
                      </div>
                      <div className="w-full bg-[#111] h-3">
                        <div className="bg-[#888] h-full" style={{ width: '55%' }}></div>
                      </div>
                    </div>

                    {/* Step 2: Underwriter Verified Adjusted EBITDA */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-[#00FF66] font-bold">2. Underwriter Adjusted EBITDA Reconciliations</span>
                        <span className="text-[#00FF66] font-bold">${(calculatedEbitda).toLocaleString()} Approved Adjustments</span>
                      </div>
                      <div className="w-full bg-[#111] h-3">
                        <div className="bg-[#00FF66] h-full" style={{ width: `${Math.min(100, (calculatedEbitda / 800000) * 100)}%` }}></div>
                      </div>
                    </div>

                    {/* Step 3: Implied Asking Valuation Target */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-[#0ea5e9] font-bold">3. Implied Asking Valuation Leverage Range</span>
                        <span className="text-[#0ea5e9] font-bold">$1,850,000 Target Ask</span>
                      </div>
                      <div className="w-full bg-[#111] h-3">
                        <div className="bg-[#0ea5e9] h-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0c0c0c] border border-[#222] p-4 text-[10px] font-mono text-neutral-400 space-y-2">
                    <div className="font-bold text-white uppercase">[AUDITOR OPINION EXCERPT]</div>
                    <p className="leading-relaxed">
                      "Financial models track a strong cash converting cycle. Recurring revenue streams from regional freight agreements support an intrinsic base value structure consistent with multi-regional trade groups."
                    </p>
                  </div>
                </div>
              )}

              {/* INTERACTIVE VIEW 4: REDACTED ORG TREE */}
              {activeDoc === 'ORG_TREE' && (
                <div className="bg-[#050505] border border-[#FF3333]/20 p-8 space-y-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="border-b border-[#222] pb-4 flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-[#FF3333] tracking-widest block uppercase">DECRYPTION TERMINAL // ORG_TREE.MAP</span>
                        <h3 className="text-lg font-bold font-mono text-white mt-1">Redacted Operational Staff Structure</h3>
                      </div>
                      <span className="text-[10px] font-mono bg-[#111] px-2 py-1 border border-[#FF3333]/30 text-[#FF3333] animate-pulse">LEVEL 3 HIGHLY CLASSIFIED</span>
                    </div>

                    {/* Org Map Nodes */}
                    <div className="pt-6 space-y-4 font-mono text-xs">
                      {/* Node Level 1 (Executive) */}
                      <div className="border border-[#222] p-3 bg-[#0a0a0a]">
                        <div className="flex justify-between text-[10px] text-[#888] pb-1">
                          <span>ROLE: PRESIDENT / OWNER FOUNDER</span>
                          <span>TENURE: 8 YEARS // COMP: $120,000</span>
                        </div>
                        <div className="text-sm font-bold flex items-center space-x-2">
                          <span className="text-[#888]">NAME:</span>
                          {orgDecrypted ? (
                            <span className="text-[#00FF66] font-extrabold font-mono tracking-wide">STANLEY G. HARVARD</span>
                          ) : (
                            <span className="bg-[#FF3333] text-black text-[9px] px-1 font-black">██████ ███████ [CIPHER LOCKED]</span>
                          )}
                        </div>
                      </div>

                      {/* Connection line */}
                      <div className="w-px h-4 bg-[#222] mx-8"></div>

                      {/* Node Level 2 (Operations Direct Report) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-[#222] p-3 bg-[#0a0a0a]">
                          <div className="flex justify-between text-[10px] text-[#888] pb-1">
                            <span>ROLE: GENERAL MANAGER (LOGISTICS)</span>
                            <span>TENURE: 5 YEARS // COMP: $95,000</span>
                          </div>
                          <div className="text-sm font-bold flex items-center space-x-2">
                            <span className="text-[#888]">NAME:</span>
                            {orgDecrypted ? (
                              <span className="text-[#0ea5e9] font-bold font-mono">DOROTHY M. VASQUEZ</span>
                            ) : (
                              <span className="bg-[#FF3333] text-black text-[9px] px-1 font-black">███████ ███████ [CIPHER LOCKED]</span>
                            )}
                          </div>
                        </div>

                        <div className="border border-[#222] p-3 bg-[#0a0a0a]">
                          <div className="flex justify-between text-[10px] text-[#888] pb-1">
                            <span>ROLE: HEAD OF TECH INTEGRATIONS</span>
                            <span>TENURE: 3 YEARS // COMP: $85,000</span>
                          </div>
                          <div className="text-sm font-bold flex items-center space-x-2">
                            <span className="text-[#888]">NAME:</span>
                            {orgDecrypted ? (
                              <span className="text-[#0ea5e9] font-bold font-mono">MARCUS REID (CONTRACTED)</span>
                            ) : (
                              <span className="bg-[#FF3333] text-black text-[9px] px-1 font-black">██████ ████ [CIPHER LOCKED]</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decryption Form Console */}
                  {!orgDecrypted ? (
                    <div className="mt-8 border border-dashed border-[#FF3333]/30 p-4 bg-red-950/10 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#FF3333] font-extrabold tracking-widest">[IDENTITY OVERRIDE DECRYPT MODULE]</span>
                        <span className="text-[#888] hover:underline cursor-help" title="Input temporary override key shown on broker ledger">
                          TEMP MASTER KEY: <span className="text-[#00FF66] font-bold underline">9924</span>
                        </span>
                      </div>
                      <form onSubmit={triggerDecryptionAttempt} className="flex gap-2">
                        <input 
                          type="password" 
                          placeholder="ENTER 4-DIGIT CRYPTO OVERRIDE TOKEN"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="flex-grow bg-[#050505] border border-[#FF3333]/30 focus:border-[#FF3333] p-2 text-xs font-mono tracking-widest text-[#FF3333] placeholder:text-neutral-700 outline-none"
                        />
                        <button 
                          type="submit"
                          className="bg-[#FF3333] hover:bg-white hover:text-black text-black font-mono font-bold text-xs px-4 py-2 transition-all"
                        >
                          DECRYPT NODE
                        </button>
                      </form>
                      {showCodeError && (
                        <p className="text-[9px] font-mono text-[#FF3333] animate-pulse">
                          * EXCEPTION DETECTED: ACCESS DENIED. VERIFY CRYPTOGRAPHIC KEY METRIC.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-8 border border-[#00FF66] p-4 bg-[#00FF66]/10 text-xs font-mono text-center">
                      <span className="text-[#00FF66] font-bold block uppercase">[SECURITY CLEARANCE APPLIED]</span>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Decrypt logs generated. Physical personnel record identities are recorded in active SEC transaction log under operator signature: <span className="text-white underline">{operatorId}</span>.
                      </p>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Bottom Panel controls: Simulate actions to affect logs */}
            <div className="z-20 mt-6 pt-4 border-t border-[#222] flex flex-wrap justify-between items-center gap-3 bg-[#0a0a0a] p-3 text-xs font-mono">
              <span className="text-neutral-500">ASSET LOG CODE: {operatorId}-{activeDoc}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => pushLog(`Triggered manual data integrity sweep on [${activeDoc}]. Code zero discrepancies detected.`, 'INFO')}
                  className="px-3 py-1 bg-black hover:bg-[#111] text-[#888] hover:text-white border border-[#222] transition-all text-[10px]"
                >
                  INTEGRITY SCAN
                </button>
                <button 
                  onClick={() => {
                    const status = activeDoc === 'TAX_RECON' ? 'interactive configuration' : 'static read state';
                    pushLog(`Generated system cryptographic PDF certificate for operator [${operatorId}]. SHA-1 generated.`, 'SECURE');
                    alert(`Secure certificate requested for Active Asset file [${activeDoc}]`);
                  }}
                  className="px-3 py-1 bg-[#0ea5e9]/10 hover:bg-[#0ea5e9]/20 text-[#0ea5e9] border border-[#0ea5e9]/30 hover:border-[#0ea5e9] transition-all text-[10px]"
                >
                  CERTIFY TRANSCRIPTION
                </button>
              </div>
            </div>

          </section>

        </div>

        {/* BOTTOM REAL-TIME AUDIT LOGS (Tracks searcher interactions) */}
        <footer className="bg-black p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#111] pb-2">
            <h3 className="font-mono text-[10px] font-bold text-[#FF3333] tracking-wider uppercase flex items-center gap-2">
              <span className="inline-block w-1.5 h-3 bg-[#FF3333] animate-pulse"></span>
              REALTIME SEARCHER AUDIT SECURE FEED
            </h3>
            <span className="font-mono text-[9px] text-[#888]">COMPLIANT INTRUSION VERIFICATION AGENT</span>
          </div>

          <div className="h-[96px] overflow-y-auto font-mono text-[10px] space-y-1 bg-[#050505] p-3 border border-[#222]">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-2">
                <span className="text-neutral-600">[{log.time}]</span>
                <span className={
                  log.type === 'SECURE' ? 'text-[#00FF66]' :
                  log.type === 'WARN' ? 'text-[#FF3333] font-bold' :
                  'text-[#888]'
                }>
                  {log.type === 'SECURE' ? '[SECURE HANDSHAKE]' :
                   log.type === 'WARN' ? '[WARNING EVENT]' :
                   '[SYSTEM INFO]'}
                </span>
                <span className="text-white/80">{log.msg}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-neutral-500 pt-2 gap-2 border-t border-[#111]">
            <span>AUTHORIZED PERSONNEL ACCESS REGISTER REQUISITION #VDR-1031</span>
            <span className="text-[#0EA5E9] cursor-pointer hover:underline" onClick={() => { setLogs([]); pushLog('Cleared console log stream.', 'INFO'); }}>
              RESET SECURITY TERM CONSOLE [C]
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}