`use client';

import React, { useState, useEffect } from 'react';

export default function BuyerProfilePage() {
  // Terminal Clock State
  const [currentTime, setCurrentTime] = useState('12:00:00');

  // Thesis State
  const [buyerName, setBuyerName] = useState('Acquisition Partners, LLC');
  const [targetMinEbitda, setTargetMinEbitda] = useState(300000);
  const [targetMaxEbitda, setTargetMaxEbitda] = useState(1500000);
  const [maxMultiple, setMaxMultiple] = useState(3.5);
  const [investmentThesis, setInvestmentThesis] = useState(
    'Seeking high-margin B2B service firms or logistics providers in the midwest and southeast. Target companies must feature stable core management and minimal customer concentration.'
  );
  
  // Selected Verticals
  const allVerticals = ['Logistics', 'SaaS', 'Manufacturing', 'HVAC', 'Home Services', 'Medical Tech'];
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>(['Logistics', 'HVAC']);

  // Plaid Simulator States
  const [plaidState, setPlaidState] = useState<'idle' | 'connecting' | 'verifying' | 'connected'>('idle');
  const [verifiedBalance, setVerifiedBalance] = useState(0);
  const [selectedBank, setSelectedBank] = useState('Apex Chase Premium Reserve');
  const [cryptographicProof, setCryptographicProof] = useState('');

  // Accreditation Checkbox States
  const [selectedAccreditation, setSelectedAccreditation] = useState<number[]>([1]);
  const accreditationCriteria = [
    { id: 1, text: "Individual net worth, or joint net worth with spouse, exceeding $1,000,000 (excluding primary residence)." },
    { id: 2, text: "Individual income exceeding $200,000 in each of the two most recent years (or $300,000 jointly)." },
    { id: 3, text: "Holding in good standing certain professional certifications, designations, or credentials (Series 7, 65, or 82)." },
    { id: 4, text: "Entity with total assets exceeding $5,000,000, not formed for the specific purpose of acquiring the securities." }
  ];

  // NDA Pre-Signature State
  const [digitalSignature, setDigitalSignature] = useState('');
  const [isNdaAutoSigned, setIsNdaAutoSigned] = useState(true);

  // Terminal Activity Feed Logs
  const [logs, setLogs] = useState<string[]>([
    '[SYS_INIT] Secure Buyer Vault channel initialized.',
    '[SECURITY] Active monitoring active. Operator ID #ETA-7922.',
  ]);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Log Helper
  const addLog = (message: string) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [`[${timeStr}] ${message}`, ...prev]);
  };

  // Plaid Simulation trigger
  const runPlaidSimulation = () => {
    if (plaidState === 'connected') {
      setPlaidState('idle');
      setVerifiedBalance(0);
      setCryptographicProof('');
      addLog('[PLAID_RESET] Bank credentials and linked balances successfully wiped from local stack.');
      return;
    }

    setPlaidState('connecting');
    addLog('[PLAID_API] Routing request payload to Plaid authentication servers...');
    
    setTimeout(() => {
      setPlaidState('verifying');
      addLog(`[PLAID_API] Connected to ${selectedBank}. Querying liquid cash accounts...`);
      
      setTimeout(() => {
        setPlaidState('connected');
        setVerifiedBalance(1740000);
        const proofHash = "SHA256-" + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
        setCryptographicProof(proofHash);
        addLog(`[VERIFICATION_ENGINE] Success. Verified balance of $1.74M liquid reserves. Cryptographic Proof token generated.`);
      }, 1800);
    }, 1200);
  };

  const toggleVertical = (v: string) => {
    if (selectedVerticals.includes(v)) {
      setSelectedVerticals(selectedVerticals.filter(item => item !== v));
      addLog(`[THESIS_UPDATE] Removed sector: ${v.toUpperCase()}`);
    } else {
      setSelectedVerticals([...selectedVerticals, v]);
      addLog(`[THESIS_UPDATE] Added sector: ${v.toUpperCase()}`);
    }
  };

  const toggleAccreditation = (id: number) => {
    if (selectedAccreditation.includes(id)) {
      setSelectedAccreditation(selectedAccreditation.filter(item => item !== id));
      addLog(`[ACCREDITATION] Rescinded qualification parameter: Criterion #${id}`);
    } else {
      setSelectedAccreditation([...selectedAccreditation, id]);
      addLog(`[ACCREDITATION] Self-certified qualification parameter: Criterion #${id}`);
    }
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] selection:bg-[#00FF66] selection:text-black min-h-screen font-sans antialiased flex flex-col overflow-x-hidden">
      
      {/* Dynamic Style Injection for base elements matching terminal design */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #0EA5E9;
        }
        .glow-green {
          box-shadow: 0 0 15px rgba(0, 255, 102, 0.15);
        }
        .glow-teal {
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.15);
        }
        * {
          border-radius: 0px !important;
        }
      `}} />

      {/* 1. GLOBAL TERMINAL HEADER */}
      <header className="w-full bg-black border-b border-[#222] z-50 sticky top-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#111] text-[10px] font-mono tracking-widest text-[#888]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-[#0ea5e9] font-semibold">
              <span className="inline-block w-2 h-2 mr-2 bg-[#0ea5e9] animate-pulse"></span>
              BUYER ENCRYPTION PROTOCOL: AES-256 SECURED
            </span>
            <span className="hidden md:inline text-[#222]">|</span>
            <span className="hidden md:inline">SYSTEM STATUS: FULLY COMPLIANT</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>EST: <span className="text-white font-mono">{currentTime}</span></span>
            <span className="text-[#00FF66]">OPR: #ETA-7922</span>
          </div>
        </div>

        {/* Master Branding Banner */}
        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#050505] via-[#090909] to-[#050505]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#0ea5e9] text-black text-[10px] font-mono font-black px-1.5 py-0.5 tracking-tighter">SECURE BUYER VAULT</span>
              <span className="text-[10px] font-mono text-[#00FF66] tracking-widest font-bold">VERIFICATION PROTOCOL v3.09</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
              VERIFIED BUYER TERMINAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F9F9] via-[#0EA5E9] to-[#00FF66]">& PROOF OF FUNDS VAULT</span>
            </h1>
            <p class="text-xs text-[#888] font-mono mt-0.5">Cryptographically lock your financial resources & thesis parameter specs for automated NDA-access clearance.</p>
          </div>

          {/* Core Pipeline Status Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#222] w-full md:w-auto text-left font-mono">
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div class="text-[9px] text-[#888]">POF STATUS</div>
              <div className={`text-xs font-bold ${plaidState === 'connected' ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                {plaidState === 'connected' ? 'VERIFIED [OK]' : 'UNVERIFIED'}
              </div>
            </div>
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div class="text-[9px] text-[#888]">LIQUID VAULT VALUE</div>
              <div className="text-xs font-bold text-[#F9F9F9]">
                ${(verifiedBalance / 1000000).toFixed(2)}M USD
              </div>
            </div>
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div class="text-[9px] text-[#888]">ACCREDITATION</div>
              <div className="text-xs font-bold text-[#0ea5e9]">
                {selectedAccreditation.length > 0 ? 'CERTIFIED' : 'PENDING'}
              </div>
            </div>
            <div className="bg-[#0c0c0c] p-2 px-3">
              <div class="text-[9px] text-[#888]">NDA PRE-AUTO</div>
              <div className={`text-xs font-bold ${isNdaAutoSigned && digitalSignature ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                {isNdaAutoSigned && digitalSignature ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. CORE PORTAL GRID */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#222]">
        
        {/* SIDEBAR / PLAID PORTAL - COL SPAN 4 */}
        <aside className="lg:col-span-4 bg-[#080808] border-r border-[#222] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
                PLAID INTEGRATION PROTOCOL
              </h2>
              <p className="text-[10px] text-[#666] font-mono mt-1">Simulate real-time institutional queries to build high-leverage buyer credibility instantly.</p>
            </div>

            {/* Select Bank */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Select Financial Institution</label>
              <select 
                value={selectedBank}
                onChange={(e) => {
                  setSelectedBank(e.target.value);
                  addLog(`[BANK_SELECTION] Switched routing focus to ${e.target.value}`);
                }}
                disabled={plaidState !== 'idle'}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-[#F9F9F9] p-3 focus:outline-none transition-all disabled:opacity-50"
              >
                <option value="Apex Chase Premium Reserve">Apex Chase Premium Reserve</option>
                <option value="Morgan Stanley Institutional Vault">Morgan Stanley Institutional Vault</option>
                <option value="Goldman Sachs Private Client">Goldman Sachs Private Client</option>
                <option value="SBA Preferred Depositary Corp">SBA Preferred Depositary Corp</option>
              </select>
            </div>

            {/* Action Frame */}
            <div className="bg-[#050505] border border-[#222] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#888] uppercase">Plaid State Status</span>
                <span className={`font-mono text-[10px] px-1.5 py-0.5 font-bold ${
                  plaidState === 'connected' ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30' :
                  plaidState === 'verifying' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/30 animate-pulse' :
                  plaidState === 'connecting' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}>
                  {plaidState.toUpperCase()}
                </span>
              </div>

              {/* Progress and indicators */}
              {plaidState === 'idle' && (
                <p className="text-xs font-mono text-[#888] leading-relaxed">
                  No verified proof of funds attached. Linking your liquid assets increases NDA acceptance rate by &gt;94%.
                </p>
              )}

              {plaidState === 'connecting' && (
                <div className="space-y-2">
                  <div className="w-full bg-[#111] h-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full animate-pulse" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-[10px] font-mono text-amber-400">Authenticating secured API handshakes...</p>
                </div>
              )}

              {plaidState === 'verifying' && (
                <div className="space-y-2">
                  <div className="w-full bg-[#111] h-1.5 overflow-hidden">
                    <div className="bg-[#0ea5e9] h-full animate-pulse" style={{ width: '80%' }}></div>
                  </div>
                  <p className="text-[10px] font-mono text-[#0ea5e9]">Retrieving liquid asset statements from linked ledger accounts...</p>
                </div>
              )}

              {plaidState === 'connected' && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#00FF66]/5 border border-[#00FF66]/20 font-mono">
                    <div className="text-[9px] text-[#00FF66] font-bold">TOTAL VERIFIED CAPITAL</div>
                    <div className="text-xl font-bold text-white mt-1">$1,740,000.00</div>
                    <div className="text-[8px] text-[#666] mt-1">LIQUID RESERVE TYPE: DEPOSIT ACCOUNT</div>
                  </div>

                  <div className="text-[9px] font-mono text-[#555] space-y-1">
                    <div className="truncate">PROOF TOKEN: <span className="text-[#888]">{cryptographicProof}</span></div>
                    <div>VERIFICATION AGENT: MOONSHINE CAPITAL VAULT INTEGRITY SERVICE</div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={runPlaidSimulation}
                className={`w-full py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all border ${
                  plaidState === 'connected'
                    ? 'bg-red-950/20 text-[#FF3333] border-[#FF3333]/30 hover:bg-red-950/40'
                    : 'bg-[#00FF66] text-black border-[#00FF66] hover:bg-[#F9F9F9] hover:border-white'
                }`}
              >
                {plaidState === 'connected' ? 'Wipe Linked Balance Credentials' : 'Connect Institution Vault'}
              </button>
            </div>

            {/* Strategic Leverage Callout */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-400 space-y-1">
              <span className="text-[#0ea5e9] font-bold">PRO-TIP:</span>
              <p className="leading-normal text-neutral-500">
                LBO Sellers demand pre-authorized POF validation prior to releasing custom operational telemetry. Standardize your balance to lock down priority deal slots.
              </p>
            </div>
          </div>

          {/* Secure Audit Footer */}
          <div className="pt-6 border-t border-[#1a1a1a] hidden lg:block space-y-2">
            <div className="text-[9px] font-mono text-[#444] tracking-widest uppercase">VAULT PROTOCOLS COMPLIANCE</div>
            <div className="flex gap-2 text-[8px] font-mono text-neutral-600">
              <span>FCRA: COMSPEC-9</span>
              <span>•</span>
              <span>KYC: SECURE_LEVEL_3</span>
            </div>
          </div>
        </aside>

        {/* COMPREHENSIVE PARAMETER EDIT - COL SPAN 5 */}
        <section className="lg:col-span-5 bg-[#050505] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#00FF66] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#00FF66]"></span>
                INVESTMENT THESIS & CRITERIA
              </h2>
              <p className="text-[10px] text-[#666] font-mono mt-1">Specify target acquisition parameters so matching pipeline matches instantly pass to priority desk.</p>
            </div>

            {/* Buyer Profile Name */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Acquisition Entity / Buyer Name</label>
              <input 
                type="text" 
                value={buyerName}
                onChange={(e) => {
                  setBuyerName(e.target.value);
                  addLog(`[THESIS_UPDATE] Adjusted Entity Designation to "${e.target.value}"`);
                }}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#00FF66] focus:ring-0 text-xs font-mono text-white p-3 outline-none transition-all"
                placeholder="Enterprise Capital LLC"
              />
            </div>

            {/* Target EBITDA Range */}
            <div className="space-y-3 bg-[#0a0a0a] p-4 border border-[#222]">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[10px] text-[#888] tracking-widest uppercase">Target EBITDA Range</label>
                <span className="font-mono text-xs text-[#00FF66] font-bold">
                  ${(targetMinEbitda / 1000).toFixed(0)}K - ${(targetMaxEbitda / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono text-[#555] block mb-1">MINIMUM EBITDA</span>
                  <input 
                    type="number"
                    value={targetMinEbitda}
                    step={50000}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTargetMinEbitda(val);
                      addLog(`[THESIS_UPDATE] Min EBITDA set to $${val.toLocaleString()}`);
                    }}
                    className="w-full bg-black border border-[#222] text-xs font-mono text-white p-2 outline-none"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#555] block mb-1">MAXIMUM EBITDA</span>
                  <input 
                    type="number"
                    value={targetMaxEbitda}
                    step={100000}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTargetMaxEbitda(val);
                      addLog(`[THESIS_UPDATE] Max EBITDA set to $${val.toLocaleString()}`);
                    }}
                    className="w-full bg-black border border-[#222] text-xs font-mono text-white p-2 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Max Valuation Multiple slider */}
            <div className="space-y-3 bg-[#0a0a0a] p-4 border border-[#222]">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[10px] text-[#888] tracking-widest uppercase">Max Acquisition Multiple</label>
                <span className="font-mono text-xs text-[#0EA5E9] font-bold">{maxMultiple}x EBITDA</span>
              </div>
              <input 
                type="range" 
                min="1.5" 
                max="6.0" 
                step="0.1" 
                value={maxMultiple}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMaxMultiple(val);
                  addLog(`[THESIS_UPDATE] Adjusted multiple tolerance limits: ${val}x`);
                }}
                className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-neutral-600">
                <span>1.5x</span>
                <span>3.75x</span>
                <span>6.0x</span>
              </div>
            </div>

            {/* Target Verticals Multi-Select */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Target Industry Sectors</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {allVerticals.map((v) => {
                  const active = selectedVerticals.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleVertical(v)}
                      className={`font-mono text-[10px] py-2 border tracking-wider text-center transition-all ${
                        active 
                          ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66] font-bold' 
                          : 'bg-[#0a0a0a] border-[#222] text-[#888] hover:border-[#444] hover:text-[#F9F9F9]'
                      }`}
                    >
                      {v.toUpperCase()} {active ? '[X]' : '[+]'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Investment Thesis Statement Text Box */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase font-semibold">Narrative Acquisition Thesis</label>
              <textarea
                value={investmentThesis}
                onChange={(e) => setInvestmentThesis(e.target.value)}
                rows={4}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#00FF66] text-xs font-mono text-white p-3 outline-none resize-none leading-relaxed"
                placeholder="Describe your operational capability, deal structure preferences, equity sources, and value-add vectors."
              />
            </div>

          </div>

          <div className="border-t border-[#1a1a1a] pt-4 flex justify-between items-center text-[10px] font-mono text-[#666]">
            <span>PARAMETERS SYNCHRONIZED</span>
            <span className="text-[#00FF66]">AUTO-LOCK ON SAVE</span>
          </div>
        </section>

        {/* ACCREDITATION & NDA PRE-SIGN MODULE - COL SPAN 3 */}
        <aside className="lg:col-span-3 bg-[#080808] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Section Header */}
            <div className="border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#FF3333] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#FF3333]"></span>
                ACCREDITATION & SECURITY
              </h2>
              <p className="text-[10px] text-[#666] font-mono mt-1">Verify investor certification criteria rules to satisfy federal micro-PE standards.</p>
            </div>

            {/* Accredited Criteria Choices */}
            <div className="space-y-3">
              <span className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Self-Certification Category (Rule 501)</span>
              
              <div className="space-y-2">
                {accreditationCriteria.map((c) => {
                  const selected = selectedAccreditation.includes(c.id);
                  return (
                    <div 
                      key={c.id}
                      onClick={() => toggleAccreditation(c.id)}
                      className={`p-2.5 border text-[10px] font-mono cursor-pointer transition-all leading-normal ${
                        selected 
                          ? 'bg-[#FF3333]/10 border-[#FF3333] text-white' 
                          : 'bg-black border-[#222] text-[#888] hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`w-2.5 h-2.5 inline-block ${selected ? 'bg-[#FF3333]' : 'bg-neutral-800'}`}></span>
                        <span className={`font-bold ${selected ? 'text-[#FF3333]' : 'text-[#666]'}`}>CRITERION 501(a)({c.id})</span>
                      </div>
                      <p className="text-[9px] text-[#888] pl-4">{c.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instant NDA Pre-Signature Framework */}
            <div className="space-y-3 bg-[#050505] border border-[#222] p-4">
              <span className="block font-mono text-[10px] text-[#0ea5e9] tracking-widest uppercase font-bold">AUTOMATED NDA EXECUTION</span>
              
              <p className="text-[10px] text-[#888] font-mono leading-relaxed">
                By entering your digital signature below, you authorize the vault to pre-execute confidential non-disclosure agreements with target deal brokers instantly on telemetry request.
              </p>

              <div>
                <label className="block font-mono text-[9px] text-[#555] uppercase mb-1">Electronic Signature Pad</label>
                <input
                  type="text"
                  value={digitalSignature}
                  onChange={(e) => {
                    setDigitalSignature(e.target.value);
                    if (e.target.value.trim() !== '') {
                      addLog(`[NDA_SIGNATURE] Security authorization updated: "${e.target.value}"`);
                    }
                  }}
                  className="w-full bg-black border border-[#222] focus:border-[#0ea5e9] text-xs font-mono text-white p-2.5 tracking-widest uppercase outline-none"
                  placeholder="TYPE FULL LEGAL NAME"
                />
              </div>

              {/* NDA Auto Execution Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[9px] text-[#888] uppercase">Auto-release Access</span>
                <button 
                  type="button"
                  onClick={() => {
                    setIsNdaAutoSigned(!isNdaAutoSigned);
                    addLog(`[NDA_AUTO_RELEASE] Auto-release set to ${!isNdaAutoSigned}`);
                  }}
                  className="text-[9px] font-mono font-bold px-2 py-1 border transition-all"
                  style={{
                    backgroundColor: isNdaAutoSigned ? 'rgba(0, 255, 102, 0.1)' : 'transparent',
                    borderColor: isNdaAutoSigned ? '#00FF66' : '#222',
                    color: isNdaAutoSigned ? '#00FF66' : '#666'
                  }}
                >
                  {isNdaAutoSigned ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

          </div>

          {/* Secure Transmission status */}
          <div className="p-3 bg-red-950/10 border border-[#FF3333]/30">
            <div className="text-[9px] font-mono text-[#FF3333] font-bold tracking-wider">SECURE LEGAL COGNIZANCE</div>
            <p className="text-[9px] text-[#888] font-mono leading-tight mt-1">
              Entering false accreditation status or simulated POF records violates deal desk framework conditions. Fully audited proof checks are executed prior to final LOI processing.
            </p>
          </div>
        </aside>

      </main>

      {/* 3. LIVE TERMINAL LOGS & FINAL ACTION BANNER */}
      <section className="bg-black border-b border-[#222] p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Verification Activity Feed */}
        <div className="md:col-span-8 space-y-2">
          <div className="flex justify-between items-center border-b border-[#222] pb-2">
            <span className="font-mono text-[10px] text-[#0EA5E9] tracking-widest font-bold flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-[#0EA5E9] animate-pulse"></span>
              LIVE SECURE VERIFICATION FEED & CRYPTO SYSTEM LOGS
            </span>
            <button 
              onClick={() => {
                setLogs(['[SYS_CLEARED] Local session log stack wiped.']);
              }} 
              className="text-[8px] font-mono text-[#FF3333] hover:underline"
            >
              CLEAR STACK LOGS
            </button>
          </div>

          {/* Render Logs */}
          <div className="bg-[#050505] border border-[#1a1a1a] p-3 h-32 overflow-y-auto font-mono text-[10px] space-y-1.5 text-neutral-400">
            {logs.map((log, idx) => {
              let color = 'text-[#888]';
              if (log.includes('[PLAID_SUCCESS]') || log.includes('[VERIFICATION_ENGINE]')) color = 'text-[#00FF66]';
              if (log.includes('[PLAID_API]') || log.includes('[BANK_SELECTION]')) color = 'text-[#0EA5E9]';
              if (log.includes('[SECURITY]') || log.includes('[SECURITY_SHIELD]')) color = 'text-[#FF3333]';
              return (
                <div key={idx} className={`${color} leading-relaxed`}>
                  {log}
                </div>
              );
            })}
          </div>
        </div>

        {/* Master Action Trigger Card */}
        <div className="md:col-span-4 bg-[#080808] border-2 border-[#0ea5e9] p-4 flex flex-col justify-between relative glow-teal">
          <div className="absolute top-0 right-0 bg-[#0ea5e9] text-black font-mono text-[8px] px-1 font-bold">
            LOCK PROTOCOL
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold text-white tracking-wide">LOCK CRYPTO BUYER PASSPORT</h3>
            <p className="text-[10px] text-[#888] font-mono mt-1 leading-normal">
              Encrypt your liquid verification balances, compliance declarations, and investment thesis metrics into an active immutable dealer profile.
            </p>
          </div>

          <button
            onClick={() => {
              if (!buyerName || !digitalSignature) {
                alert("Please complete the Buyer Designation and Digital Signature properties first.");
                return;
              }
              addLog(`[PASSPORT_LOCKED] Generated locked buyer certificate: SHA-256 Verified.`);
              alert(`Verified Buyer Passport Cryptographically Locked!\nVerification Token: ${cryptographicProof || 'SHA-TOKEN-PENDING'}\nYour credentials have been securely stored in the Underground Terminal.`);
            }}
            className="w-full bg-[#0ea5e9] hover:bg-[#F9F9F9] hover:text-black transition-all font-mono text-[10px] font-bold text-black py-3.5 mt-4 text-center tracking-widest uppercase"
          >
            Generate Immutable Buyer Passport &rarr;
          </button>
        </div>

      </section>

      {/* 4. COMPLIANCE DISCLAIMERS & REGULATORY ALIGNMENTS */}
      <footer className="bg-black mt-auto">
        
        {/* Compliance Integration Strip */}
        <div className="px-6 py-4 border-b border-[#222] grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66] rounded-none"></span>
            <span>PLAID PARTNER CERTIFIED</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#0EA5E9] rounded-none"></span>
            <span>SEC REGULATION D ADVISORY</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-white rounded-none"></span>
            <span>FINCEN AML AUDITED</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#FF3333] rounded-none"></span>
            <span>SHA-256 DECRYPT SHIELDED</span>
          </div>
        </div>

        {/* Legal Disclaimers */}
        <div className="max-w-7xl mx-auto px-6 py-8 text-[11px] font-mono text-[#888] leading-relaxed space-y-4">
          <p>
            <span className="text-[#F9F9F9] font-bold">Disclaimer for Verification Portal:</span> All bank connection pathways executed on this domain are strictly simulated mock sequences powered by Plaid-compliant protocol configurations. No real monetary transactions or permanent credentials are saved within our public registers. Buyer certifications are executed strictly to demonstrate workflow design models under federal Section 501 rule-compliance algorithms.
          </p>
          <div className="flex justify-between items-center text-[9px] text-neutral-600 border-t border-[#111] pt-4">
            <span>&copy; {new Date().getFullYear()} ACQUIRE-NET TERMINAL, LLC. ALL BUYER PASSPORTS ARE SUBJECT TO REG-D MANDATES.</span>
            <span className="hover:underline cursor-pointer hover:text-white">SYS-INTEGRITY STACK v3.09</span>
          </div>
        </div>
      </footer>

    </div>
  );
}