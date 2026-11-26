```tsx
import React, { useState, useEffect } from 'react';

// Interfaces for component states
interface BuyerProfile {
  fullName: string;
  firmName: string;
  email: string;
  phone: string;
  maxBudget: number;
  selectedSectors: string[];
}

export default function NdaSignSheet({ 
  isOpen = true, 
  onClose,
  onVerificationComplete 
}: { 
  isOpen?: boolean; 
  onClose?: () => void;
  onVerificationComplete?: (data: { verifiedPof: number; ndaHash: string }) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Step 1: Profile State
  const [profile, setProfile] = useState<BuyerProfile>({
    fullName: '',
    firmName: '',
    email: '',
    phone: '',
    maxBudget: 1500000,
    selectedSectors: []
  });

  // Step 2: Plaid Simulation States
  const [plaidState, setPlaidState] = useState<'idle' | 'connecting' | 'verifying' | 'connected'>('idle');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [verifiedBalance, setVerifiedBalance] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState<string>('JPMorgan Chase Private Client');

  // Step 3: NDA State
  const [sigText, setSigText] = useState('');
  const [hasScrolledNda, setHasScrolledNda] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('');

  // Step 4: Final Verification Credentials
  const [secureToken, setSecureToken] = useState('');

  // Format currencies helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Sector Toggle
  const toggleSector = (sector: string) => {
    setProfile(prev => {
      const active = prev.selectedSectors.includes(sector);
      return {
        ...prev,
        selectedSectors: active 
          ? prev.selectedSectors.filter(s => s !== sector)
          : [...prev.selectedSectors, sector]
      };
    });
  };

  // Plaid Handshake Console Simulation
  const triggerPlaidLink = () => {
    setPlaidState('connecting');
    setConsoleLogs([]);
    
    const logs = [
      'INITIALIZING ENCRYPTED HANDSHAKE LINK VIA PORT 443...',
      'ESTABLISHING SECURE CREDENTIAL ROUTING TUNNEL...',
      'RESOLVING PARTNER PLATFORM API ENDPOINTS [PLAID_SECURE_TOKEN]...',
      'AUTHORIZING MULTI-FACTOR ACCOUNT PERMISSION HANDSHAKE...',
      'RETRIEVING REAL-TIME LEDGER VERIFICATION VALUES...',
      'APPLYING LIQUID RISK WEIGHT AND DEBT CAPACITY HAIRCUTS...',
      'GENERATING PROOF OF FUNDS CERTIFICATE...'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
        if (index === logs.length - 1) {
          setPlaidState('verifying');
          setTimeout(() => {
            // Match dynamic balance slightly above search budget to simulate healthy capital stack
            const balanceMock = profile.maxBudget * (0.2 + Math.random() * 0.3); 
            setVerifiedBalance(Math.max(250000, Math.round(balanceMock)));
            setPlaidState('connected');
          }, 1200);
        }
      }, (index + 1) * 600);
    });
  };

  // Generate Unique Compliance Hash
  const generateCryptographicSignature = () => {
    setIsSigning(true);
    setTimeout(() => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = 'AM-NDA-';
      for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) result += '-';
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      setGeneratedHash(result);
      
      const tokenChars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let token = 'SEC_KEY_';
      for (let i = 0; i < 24; i++) {
        token += tokenChars.charAt(Math.floor(Math.random() * tokenChars.length));
      }
      setSecureToken(token);
      setIsSigning(false);
      setStep(4);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-opacity">
      {/* Sidebar Sliding Panel Container */}
      <div className="w-full max-w-[580px] bg-[#070707] border-l border-[#222222] h-full flex flex-col justify-between overflow-hidden shadow-2xl relative glow-toxic">
        
        {/* Terminal Header */}
        <div className="px-6 py-4 border-b border-[#222222] bg-[#0a0a0a] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#00FF66] rounded-full animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9]">
              COMPLIANCE &amp; VERIFICATION SYSTEM
            </span>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-[#666666] hover:text-[#FF3333] font-mono text-[11px] uppercase tracking-wider transition-colors border border-[#222222] px-2.5 py-1 bg-black hover:border-[#FF3333]"
            >
              [ CLOSE_ESC ]
            </button>
          )}
        </div>

        {/* Top Progress Tracker */}
        <div className="grid grid-cols-4 border-b border-[#111111] bg-black font-mono text-[9px] tracking-widest">
          {[
            { n: '01', l: 'PROFILE' },
            { n: '02', l: 'PLAID_POF' },
            { n: '03', l: 'E-NDA' },
            { n: '04', l: 'DECRYPT' }
          ].map((s, idx) => {
            const currentStep = idx + 1;
            const isCompleted = step > currentStep;
            const isActive = step === currentStep;
            return (
              <div 
                key={s.n}
                className={`py-3 px-2 text-center border-r border-[#151515] last:border-r-0 flex flex-col items-center justify-center space-y-1 transition-all ${
                  isActive 
                    ? 'bg-[#090909] text-[#00FF66] border-b-2 border-b-[#00FF66]' 
                    : isCompleted 
                      ? 'text-[#0EA5E9]' 
                      : 'text-[#444444]'
                }`}
              >
                <span>{s.n} // {s.l}</span>
                <span className="text-[7px]">
                  {isCompleted ? '● COMPLETE' : isActive ? '▲ ACTIVE' : '○ PENDING'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#070707] relative">
          
          {/* STEP 1: IDENTITY & BUYER SEARCH PARAMETERS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-l-2 border-[#0EA5E9] pl-4 py-1 space-y-1">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#0EA5E9]">STEP 01 // BUYER PROFILE DEFINITION</h4>
                <p className="text-xs text-[#888888]">Establish structural entity ownership and pipeline allocation limits.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-mono text-[9px] text-[#888888] uppercase tracking-wider">FULL NAME (PRIMARY PRINCIPAL)</label>
                    <input 
                      type="text" 
                      value={profile.fullName}
                      onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      placeholder="e.g. Marcus Vance"
                      className="w-full h-11 bg-black border border-[#222222] text-xs font-mono text-white px-4 focus:outline-none focus:border-[#00FF66] transition-colors placeholder-[#444]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-[9px] text-[#888888] uppercase tracking-wider">ACQUISITION ENTITY OR SPV</label>
                    <input 
                      type="text" 
                      value={profile.firmName}
                      onChange={(e) => setProfile({...profile, firmName: e.target.value})}
                      placeholder="e.g. Vance Capital Partners LLC"
                      className="w-full h-11 bg-black border border-[#222222] text-xs font-mono text-white px-4 focus:outline-none focus:border-[#00FF66] transition-colors placeholder-[#444]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-mono text-[9px] text-[#888888] uppercase tracking-wider">SECURE CORPORATE EMAIL</label>
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      placeholder="mvance@vancecap.com"
                      className="w-full h-11 bg-black border border-[#222222] text-xs font-mono text-white px-4 focus:outline-none focus:border-[#00FF66] transition-colors placeholder-[#444]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-[9px] text-[#888888] uppercase tracking-wider">PHONE LINK</label>
                    <input 
                      type="tel" 
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="+1 (555) 234-5678"
                      className="w-full h-11 bg-black border border-[#222222] text-xs font-mono text-white px-4 focus:outline-none focus:border-[#00FF66] transition-colors placeholder-[#444]"
                    />
                  </div>
                </div>

                {/* TARGET MAXIMUM TRANSACTION SIZE */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between font-mono text-[10px] uppercase text-[#888888] tracking-widest">
                    <span>TARGET ACQUISITION BUDGET</span>
                    <span className="text-[#00FF66] font-bold">{formatCurrency(profile.maxBudget)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="250000" 
                    max="10000000" 
                    step="250000"
                    value={profile.maxBudget}
                    onChange={(e) => setProfile({...profile, maxBudget: Number(e.target.value)})}
                    className="w-full h-1 bg-neutral-900 accent-[#00FF66] cursor-pointer appearance-none"
                  />
                  <div className="flex justify-between font-mono text-[8px] text-[#444444]">
                    <span>$250K (Lower Middle Market)</span>
                    <span>$10.0M (Mid-Market Scale)</span>
                  </div>
                </div>

                {/* TARGET NICHE SEGMENTS */}
                <div className="space-y-2 pt-2">
                  <label className="block font-mono text-[9px] text-[#888888] uppercase tracking-wider">PREFERRED TARGET SECTORS (SELECT ALL APPLICABLE)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['SaaS', 'Home Services', 'Logistics', 'Manufacturing'].map((sector) => {
                      const isActive = profile.selectedSectors.includes(sector);
                      return (
                        <button
                          key={sector}
                          onClick={() => toggleSector(sector)}
                          className={`h-11 border px-4 font-mono text-xs flex items-center justify-between transition-all ${
                            isActive 
                              ? 'bg-[#00ff66]/5 border-[#00FF66] text-white' 
                              : 'bg-black border-[#222222] text-[#888888] hover:border-[#666666]'
                          }`}
                        >
                          <span>{sector}</span>
                          <span className={`text-[9px] ${isActive ? 'text-[#00FF66]' : 'text-[#222222]'}`}>
                            {isActive ? '● ACTIVE' : '○ OFF'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4">
                <button
                  disabled={!profile.fullName || !profile.email || !profile.firmName}
                  onClick={() => setStep(2)}
                  className="w-full h-12 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black transition-colors font-mono text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#00FF66]"
                >
                  ESTABLISH ATTRIBUTES &amp; CONTRIBUTE POF →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PLAID ASSETS INTEGRATION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-l-2 border-[#0EA5E9] pl-4 py-1 space-y-1">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#0EA5E9]">STEP 02 // FINANCIAL ATTRIBUTION VERIFICATION</h4>
                <p className="text-xs text-[#888888]">Link active capital stores via Plaid secure API protocol. No login details are retained.</p>
              </div>

              {plaidState === 'idle' && (
                <div className="bg-black border border-[#222222] p-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-mono text-xs text-white uppercase tracking-wider">PLAID SECURE PORTAL DEPLOYMENT</h5>
                    <p className="text-[11px] text-[#666666] max-w-sm mx-auto leading-relaxed">
                      To confirm execution readiness, link checking, savings, or private equity reserves. Must verify at least 15% of your target budget.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <select 
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full h-11 bg-[#090909] border border-[#222222] text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9] px-4"
                    >
                      <option>JPMorgan Chase Private Client</option>
                      <option>Bank of America Premium Yield</option>
                      <option>SVB Private Bank Asset Store</option>
                      <option>Fidelity Investment Brokerage</option>
                      <option>Wells Fargo Institutional Cash</option>
                    </select>

                    <button
                      onClick={triggerPlaidLink}
                      className="w-full h-11 bg-[#0EA5E9] hover:bg-[#00FF66] hover:text-black transition-colors font-mono text-xs text-black font-semibold uppercase tracking-wider"
                    >
                      INITIALIZE SECURE PORTAL HANDSHAKE
                    </button>
                  </div>
                </div>
              )}

              {(plaidState === 'connecting' || plaidState === 'verifying') && (
                <div className="bg-black border border-[#222222] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#00FF66] animate-pulse">▲ ESTABLISHING SECURE PIPELINE...</span>
                    <span className="w-4 h-4 border-2 border-t-[#00FF66] border-r-transparent border-b-[#00FF66] border-l-transparent rounded-full animate-spin"></span>
                  </div>
                  
                  {/* Fake Console Output */}
                  <div className="bg-[#050505] p-3 border border-[#111111] font-mono text-[9px] text-[#888888] space-y-1 max-h-[160px] overflow-y-auto">
                    {consoleLogs.map((log, i) => (
                      <div key={i} className="leading-relaxed">
                        <span className="text-[#0EA5E9]">&gt;</span> {log}
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Progress indicator */}
                  <div className="h-1 bg-neutral-900 w-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 bottom-0 bg-[#00FF66] animate-[shimmer_2s_infinite] w-2/3"></div>
                  </div>
                </div>
              )}

              {plaidState === 'connected' && (
                <div className="space-y-6">
                  {/* Success Attributed Status Badge */}
                  <div className="bg-[#00ff66]/5 border border-[#00FF66] p-5 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 bg-[#00FF66] rounded-full"></span>
                      <h5 className="font-mono text-xs text-[#00FF66] uppercase tracking-wider">
                        PROOF OF FUNDS STRUCTURALLY ACCREDITED
                      </h5>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-[#00ff66]/10 pt-3">
                      <div>
                        <span className="block font-mono text-[8px] text-[#666]">CONNECTED ENTITY</span>
                        <span className="text-xs font-mono text-white block truncate">{selectedBank}</span>
                      </div>
                      <div>
                        <span className="block font-mono text-[8px] text-[#666]">VERIFIABLE BALANCE (POF)</span>
                        <span className="text-xs font-mono text-[#00FF66] font-bold block">
                          {formatCurrency(verifiedBalance)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Analysis of buying power limits */}
                  <div className="bg-black border border-[#222222] p-4 font-mono text-[10px] space-y-2 text-[#888888]">
                    <div className="flex justify-between">
                      <span>STATED BUDGET CONSTRAINT:</span>
                      <span className="text-white">{formatCurrency(profile.maxBudget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MINIMUM REQUIREMENT (15% DEPOSIT CAPACITY):</span>
                      <span className="text-white">{formatCurrency(profile.maxBudget * 0.15)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#111] pt-2">
                      <span>VERIFIED CAPACITY ADEQUACY:</span>
                      {verifiedBalance >= profile.maxBudget * 0.15 ? (
                        <span className="text-[#00FF66] font-bold">[ OK / SYSTEM VERIFIED ]</span>
                      ) : (
                        <span className="text-[#FF3333] font-bold">[ MARGINAL EXPOSURE ]</span>
                      )}
                    </div>
                  </div>

                  {/* Proceed Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPlaidState('idle')}
                      className="px-4 h-12 bg-neutral-900 border border-[#222222] font-mono text-xs text-[#888888] hover:text-[#F9F9F9] transition-colors"
                    >
                      RE-LINK
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-grow h-12 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black transition-colors font-mono text-xs font-bold uppercase tracking-widest"
                    >
                      ADVANCE TO DIGITAL NDA SIGNING →
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 3: DIGITALLY BINDING NDA FORM */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-l-2 border-[#0EA5E9] pl-4 py-1 space-y-1">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#0EA5E9]">STEP 03 // BINDING MUTUAL CONFIDENTIALITY COVENANT</h4>
                <p className="text-xs text-[#888888]">Review structured, programmatic disclosure guidelines before pipeline decryption keys publish.</p>
              </div>

              {/* Scrollable Legal Document Box */}
              <div 
                onScroll={(e) => {
                  const target = e.currentTarget;
                  if (target.scrollHeight - target.scrollTop <= target.clientHeight + 40) {
                    setHasScrolledNda(true);
                  }
                }}
                className="h-44 overflow-y-auto bg-black border border-[#222222] p-4 text-[10px] font-mono text-[#777777] space-y-4 leading-relaxed"
              >
                <div className="text-center font-bold text-white border-b border-[#222222] pb-2 uppercase tracking-wider">
                  MUTUAL NON-DISCLOSURE AGREEMENT (v5.04-SECURE)
                </div>
                <p>
                  This Mutual Non-Disclosure Agreement (the "Agreement") is hereby entered into force and effect on this exact timestamp by and between <strong>Moonshine Capital &amp; AcquireMeta Secure Networks</strong> ("Discloser") and the individual entity declaring attributes, identified as <strong>{profile.fullName || '[DECLARANT]'}</strong> representing <strong>{profile.firmName || '[DECLARED ENTITY]'}</strong> ("Recipient").
                </p>
                <p>
                  1. <span className="text-white">Confidential Information.</span> Confidential Information refers to any proprietary asset details, revenue models, blinded project codenames (such as Project Delta, Project Kestrel), customer retention vectors, geographical structures, or SBA modeling constraints disclosed during the active diligence sequence.
                </p>
                <p>
                  2. <span className="text-white">Non-Use and Non-Disclosure.</span> Recipient agrees to restrict access to any discovered transaction characteristics solely to key financial partners, transactional counsel, and qualified underwriting institutions, and shall not bypass discloser directly to attempt contact with target operations or employees.
                </p>
                <p>
                  3. <span className="text-white">Account Verification Integrity.</span> Recipient agrees that capital holdings verified through Plaid APIs represent active operating assets belonging to the signatory or affiliates, with no material encumbrances impeding transactional authority.
                </p>
                <div className="border-t border-[#1a1a1a] pt-2 text-[8px] text-[#555555]">
                  [ SYSTEM HASH SIGNATURE IDENTIFIER: INTEGRATED SECURE TUNNEL ACCREDITED ]
                </div>
              </div>

              {/* Interaction Warning */}
              {!hasScrolledNda && (
                <div className="text-center py-1 bg-[#FF3333]/5 border border-[#FF3333]/20 font-mono text-[9px] text-[#FF3333]">
                  ▲ CONFIRM FULL DOCUMENT SCROLL TO ENABLE ELECTRONIC SIGNATURE
                </div>
              )}

              {/* Signature Terminal Pad */}
              <div className={`space-y-4 transition-opacity duration-300 ${hasScrolledNda ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <div className="space-y-2">
                  <label className="block font-mono text-[9px] text-[#888888] uppercase tracking-wider">
                    TYPE SECURE SIGNATURE FOR HASH BINDING
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={sigText}
                      disabled={!hasScrolledNda}
                      onChange={(e) => setSigText(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full h-11 bg-black border border-[#222222] text-xs font-mono text-white px-4 focus:outline-none focus:border-[#00FF66] transition-colors placeholder-[#444]"
                    />
                    {sigText && (
                      <span className="absolute right-3 top-3 text-[10px] text-[#00FF66] font-mono italic">
                        [ Electronically Scripted ]
                      </span>
                    )}
                  </div>
                </div>

                {/* Live rendering of cryptographic sign representation */}
                {sigText && (
                  <div className="bg-black border border-[#222222] p-4 text-center relative overflow-hidden flex flex-col items-center justify-center space-y-1">
                    <span className="font-mono text-[7px] text-[#444444] uppercase tracking-widest absolute top-2 left-3">LIVE CRYPTO-PREVIEW</span>
                    <p className="font-mono text-lg font-extrabold text-[#00FF66] tracking-widest italic pt-2">
                      /{sigText}/
                    </p>
                    <p className="font-mono text-[8px] text-[#666666]">
                      IP ROOTED: 198.162.0.11 // TIMESTAMP: {new Date().toISOString()}
                    </p>
                  </div>
                )}

                {/* Consent Check */}
                <div className="flex items-start space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    disabled={!sigText}
                    className="mt-0.5 accent-[#00FF66]"
                  />
                  <label htmlFor="consent" className="font-mono text-[9px] text-[#888888] leading-relaxed cursor-pointer select-none">
                    I represent that I have direct execution authority for <strong>{profile.firmName || 'the declared company'}</strong> and agree that this digital execution constitutes a legally binding document.
                  </label>
                </div>

                {/* Final action */}
                <button
                  disabled={!sigText || isSigning}
                  onClick={generateCryptographicSignature}
                  className="w-full h-12 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black transition-colors font-mono text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#00FF66]"
                >
                  {isSigning ? 'AUTHORIZING COVENANT HASH PROTOCOL...' : 'EXECUTE AGREEMENT & DECRYPT PIPELINE'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ACCESS DECLASSIFIED - SECURE CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-6 text-center py-4">
              
              {/* Giant Verified Shield Graphic */}
              <div className="mx-auto w-16 h-16 rounded-full bg-[#00ff66]/10 border border-[#00FF66] flex items-center justify-center animate-bounce">
                <svg className="w-8 h-8 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>

              <div className="space-y-2">
                <h4 className="font-mono text-sm font-bold text-white uppercase tracking-widest">
                  DECRYPTION COMPLIANCE CODENAME REVEALED
                </h4>
                <p className="text-xs text-[#888888] max-w-sm mx-auto leading-relaxed">
                  Authentication parameters linked successfully. Blinded corporate directories and private folders have been decrypted for your profile level.
                </p>
              </div>

              {/* Dynamic Secure Passport Dashboard */}
              <div className="bg-black border border-[#222222] p-5 text-left font-mono text-[10px] space-y-3 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10 font-bold text-[#00ff66] text-3xl select-none">
                  SECURE
                </div>
                
                <div className="border-b border-[#151515] pb-2 text-[8px] text-[#555555] tracking-widest uppercase">
                  VERIFIED BUYER METADATA PASS
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[#555555] text-[8px]">VERIFIED PRINCIPAL:</span>
                    <span className="text-white block truncate">{profile.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-[#555555] text-[8px]">FIRM ID:</span>
                    <span className="text-white block truncate">{profile.firmName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[#555555] text-[8px]">POF COMPLIANCE LEVEL:</span>
                    <span className="text-[#00FF66] font-bold block">
                      {formatCurrency(verifiedBalance)} LIQUID
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#555555] text-[8px]">NDA HASH KEY:</span>
                    <span className="text-[#0EA5E9] font-bold block select-all truncate">
                      {generatedHash}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#151515] pt-2">
                  <span className="block text-[#555555] text-[8px]">SECURE PIPELINE TOKEN:</span>
                  <span className="text-xs text-[#666666] block select-all font-semibold tracking-tight break-all">
                    {secureToken}
                  </span>
                </div>
              </div>

              {/* Decrypted Pipeline Highlights Preview */}
              <div className="space-y-2 text-left">
                <span className="font-mono text-[9px] text-[#888888] uppercase tracking-wider block">UNLOCKED DEAL CHANNELS</span>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between items-center bg-[#00ff66]/5 border border-[#00ff66]/10 p-2.5">
                    <span className="text-white font-bold">PROJECT NOVA</span>
                    <span className="text-[8px] bg-[#00ff66]/15 text-[#00FF66] px-1.5 py-0.5">UNLOCKED - $2.6M ASK</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0ea5e9]/5 border border-[#0ea5e9]/10 p-2.5">
                    <span className="text-white font-bold">PROJECT DELTA</span>
                    <span className="text-[8px] bg-[#0ea5e9]/15 text-[#0EA5E9] px-1.5 py-0.5">UNLOCKED - $1.8M ASK</span>
                  </div>
                </div>
              </div>

              {/* Confirm Finish Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onVerificationComplete) {
                      onVerificationComplete({
                        verifiedPof: verifiedBalance,
                        ndaHash: generatedHash
                      });
                    }
                    if (onClose) onClose();
                  }}
                  className="w-full h-12 bg-[#00FF66] hover:bg-white text-black font-semibold transition-colors font-mono text-xs uppercase tracking-widest"
                >
                  RETURN TO ACTIVE DEAL STREAM INTERFACE
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer Regulatory Assurance */}
        <div className="px-6 py-4 border-t border-[#222222] bg-[#080808] text-center font-mono text-[8px] text-[#444444] space-y-1">
          <p>MUTUAL SECURE GATEWAY DESIGNED EXCLUSIVELY FOR QUALIFIED ACQUISITION ENTREPRENEURS.</p>
          <p>PROTECTED UNDER SECURE SHELL PROTOCOL WITH AES-256 END-TO-END LEDGER ENCRYPTION.</p>
        </div>

      </div>
    </div>
  );
}
```