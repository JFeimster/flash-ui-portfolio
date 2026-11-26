import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Mock database matching partner slugs to contextual variables
const PARTNERS_DATABASE = {
  'default': {
    name: 'Partner',
    company: 'Moonshine Network',
    email: 'funding@moonshinecap.com',
    accentColor: '#00E676',
    appLink: '#',
    bookLink: '#'
  }
};

export default function ReadinessScorecard() {
  const router = useRouter();
  const { slug } = router.query;
  const partnerSlug = typeof slug === 'string' ? slug.toLowerCase() : 'default';
  const partner = PARTNERS_DATABASE[partnerSlug] || {
    name: slug ? slug.toUpperCase().replace('-', ' ') : 'Network Partner',
    company: 'Moonshine Network',
    email: `funding@moonshinecap.com`,
    accentColor: '#00E676',
    appLink: '#',
    bookLink: '#'
  };

  // State for interactive inputs
  const [creditScore, setCreditScore] = useState('620-679');
  const [monthlyRevenue, setMonthlyRevenue] = useState('25k-50k');
  const [businessAge, setBusinessAge] = useState('1-2years');
  const [bankAccount, setBankAccount] = useState('yes');
  const [existingDebt, setExistingDebt] = useState('minor');

  // Computed states
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState({ label: '', color: '', shadow: '', bg: '', border: '' });
  const [tips, setTips] = useState([]);
  const [programs, setPrograms] = useState([]);

  // Recalculate scorecard in real-time
  useEffect(() => {
    let currentScore = 0;
    const activeTips = [];
    const activePrograms = [];

    // Credit score weighting
    if (creditScore === 'under550') {
      currentScore += 5;
      activeTips.push({
        priority: 'HIGH',
        text: 'Review corporate credit building programs (EIN Only) to bypass low personal credit hurdles.',
        type: 'credit'
      });
    } else if (creditScore === '550-619') {
      currentScore += 12;
      activeTips.push({
        priority: 'MEDIUM',
        text: 'Improve credit to 620+ to unlock highly competitive commercial rate indexes.',
        type: 'credit'
      });
    } else if (creditScore === '620-679') {
      currentScore += 20;
    } else if (creditScore === '680-719') {
      currentScore += 26;
    } else if (creditScore === '720plus') {
      currentScore += 30;
    }

    // Revenue weighting
    if (monthlyRevenue === 'under10k') {
      currentScore += 5;
      activeTips.push({
        priority: 'HIGH',
        text: 'Many working capital lanes require $10,000+ monthly run rates. Focus on invoice factoring or micro-advances.',
        type: 'revenue'
      });
    } else if (monthlyRevenue === '10k-25k') {
      currentScore += 15;
    } else if (monthlyRevenue === '25k-50k') {
      currentScore += 22;
    } else if (monthlyRevenue === '50k-100k') {
      currentScore += 30;
    } else if (monthlyRevenue === '100kplus') {
      currentScore += 35;
    }

    // Business age weighting
    if (businessAge === 'under6months') {
      currentScore += 5;
      activeTips.push({
        priority: 'CRITICAL',
        text: 'Most premium institutional lenders mandate 6+ months operations. Consider business credit prep paths.',
        type: 'age'
      });
    } else if (businessAge === '6-12months') {
      currentScore += 12;
      activeTips.push({
        priority: 'MEDIUM',
        text: 'Reaching the 1-year operational milestone automatically unlocks higher funding limits.',
        type: 'age'
      });
    } else if (businessAge === '1-2years') {
      currentScore += 20;
    } else if (businessAge === '2yearsplus') {
      currentScore += 25;
    }

    // Bank Account validation
    if (bankAccount === 'yes') {
      currentScore += 10;
    } else {
      activeTips.push({
        priority: 'CRITICAL',
        text: 'Open a business banking account immediately. Standard personal ledger accounts do not pass audit gates.',
        type: 'compliance'
      });
    }

    // Debt weighting
    if (existingDebt === 'heavy') {
      currentScore -= 10;
      activeTips.push({
        priority: 'MEDIUM',
        text: 'High daily/weekly balance pulls detected. Look into dynamic consolidation or bridge refinance tools.',
        type: 'debt'
      });
    } else if (existingDebt === 'minor') {
      currentScore -= 3;
    }

    // Floor and ceiling
    const finalScore = Math.max(0, Math.min(100, currentScore));
    setScore(finalScore);

    // Determine Status Profile
    if (finalScore < 40) {
      setStatus({
        label: 'CRITICAL POSITIONING',
        color: 'text-orange-500',
        shadow: 'shadow-[4px_4px_0px_0px_#FF6D00]',
        bg: 'bg-orange-950/20',
        border: 'border-orange-500/40'
      });
    } else if (finalScore < 70) {
      setStatus({
        label: 'MODERATE VIABILITY',
        color: 'text-blue-400',
        shadow: 'shadow-[4px_4px_0px_0px_#2979FF]',
        bg: 'bg-blue-950/20',
        border: 'border-blue-400/40'
      });
    } else {
      setStatus({
        label: 'HIGH COMPLIANCE STANDING',
        color: 'text-[#00E676]',
        shadow: 'shadow-[4px_4px_0px_0px_#00E676]',
        bg: 'bg-emerald-950/20',
        border: 'border-emerald-500/40'
      });
    }

    // Route calculation logic to available programs
    if (finalScore >= 70) {
      activePrograms.push(
        { title: 'Working Capital Priority Lane', rate: 'Prime', speed: '24-48 Hours', desc: 'Secure optimal growth capacity based on your flawless operational metrics.' },
        { title: 'Revenue-Based Funding (RBF)', rate: 'Highly Flexible', speed: '24 Hours', desc: 'Dynamic payment cycles mapped continuously to actual daily deposit health.' }
      );
    }
    if (businessAge !== 'under6months' && creditScore !== 'under550') {
      activePrograms.push(
        { title: 'Heavy Machinery & Asset Finance', rate: 'Structured', speed: '2-5 Days', desc: 'Utilize equipment purchases directly as the core collateral base.' }
      );
    }
    if (finalScore < 55 || creditScore === 'under550' || bankAccount === 'no') {
      activePrograms.push(
        { title: 'Business Credit Profile Builder', rate: 'Fixed Program', speed: '90-Day Setup', desc: 'Systematically establish corporate identities separate from your personal assets.' }
      );
    }

    setTips(activeTips);
    setPrograms(activePrograms);
  }, [creditScore, monthlyRevenue, businessAge, bankAccount, existingDebt]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F3EF] font-sans selection:bg-[#00E676] selection:text-[#0D0D0D] antialiased pb-24">
      
      {/* Dynamic Header Status Bar */}
      <div className="border-b border-[#1E1E1E] bg-[#0D0D0D] text-xs font-mono py-2.5 px-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-[#00E676] rounded-full animate-ping"></span>
            <span className="text-zinc-400 uppercase tracking-wider">
              PORTAL NODE: <span className="text-white font-bold">{partner.company} // {partner.name}</span>
            </span>
          </div>
          <span className="text-zinc-400 hidden sm:inline uppercase">SYSTEM MODULE // READINESS EVALUATION</span>
        </div>
      </div>

      {/* Hero Header */}
      <header className="bg-[#0D0D0D] border-b border-[#1E1E1E] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-mono text-[#00E676] tracking-widest uppercase">DIAGNOSTIC ENGINES</span>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                Funding Readiness Scorecard
              </h1>
            </div>
            <a 
              href={`/partners/${partnerSlug}`} 
              className="text-xs font-mono uppercase bg-[#1E1E1E] border border-zinc-800 px-4 py-2 hover:border-[#00E676] hover:text-[#00E676] transition-colors"
            >
              ← Back to Partner Hub
            </a>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive Input Controls (Neobrutalist styling) */}
          <section className="lg:col-span-7 space-y-8">
            <div className="bg-[#1E1E1E] border-2 border-[#F4F3EF] p-6 sm:p-8 shadow-[4px_4px_0px_0px_#F4F3EF]">
              <h2 className="text-lg font-display font-extrabold text-white uppercase tracking-wider border-b border-zinc-800 pb-3 mb-6">
                Step 1: Input Operational Parameters
              </h2>
              
              <div className="space-y-6">
                
                {/* 1. Credit Score Bands */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono tracking-widest text-zinc-400 uppercase">
                    Personal Credit Rating (FICO Band)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { key: 'under550', label: '< 550' },
                      { key: '550-619', label: '550 - 619' },
                      { key: '620-679', label: '620 - 679' },
                      { key: '680-719', label: '680 - 719' },
                      { key: '720plus', label: '720+' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setCreditScore(item.key)}
                        className={`py-3 px-1 text-xs font-mono border-2 transition-all text-center ${
                          creditScore === item.key 
                            ? 'bg-[#00E676] border-[#00E676] text-black font-extrabold shadow-[2px_2px_0px_0px_#F4F3EF]' 
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Monthly Revenue Run Rate */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono tracking-widest text-zinc-400 uppercase">
                    Average Monthly Gross Receipts
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {[
                      { key: 'under10k', label: 'Under $10k' },
                      { key: '10k-25k', label: '$10k - $25k' },
                      { key: '25k-50k', label: '$25k - $50k' },
                      { key: '50k-100k', label: '$50k - $100k' },
                      { key: '100kplus', label: 'Over $100k' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setMonthlyRevenue(item.key)}
                        className={`py-3 px-2 text-xs font-mono border-2 transition-all text-center ${
                          monthlyRevenue === item.key 
                            ? 'bg-[#2979FF] border-[#2979FF] text-white font-extrabold shadow-[2px_2px_0px_0px_#F4F3EF]' 
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Duration of Operations */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono tracking-widest text-zinc-400 uppercase">
                    Time Registered / In Business
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'under6months', label: 'Startup (< 6 mo)' },
                      { key: '6-12months', label: '6 - 12 Months' },
                      { key: '1-2years', label: '1 - 2 Years' },
                      { key: '2yearsplus', label: 'Established (2+ Yrs)' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setBusinessAge(item.key)}
                        className={`py-3 px-2 text-xs font-mono border-2 transition-all text-center ${
                          businessAge === item.key 
                            ? 'bg-[#FF6D00] border-[#FF6D00] text-black font-extrabold shadow-[2px_2px_0px_0px_#F4F3EF]' 
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Two Column Section for Compliance and Debt */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
                  
                  {/* 4. Corporate Banking Check */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono tracking-widest text-zinc-400 uppercase">
                      Dedicated Business Checking Account?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setBankAccount('yes')}
                        className={`py-3 text-xs font-mono border-2 transition-all ${
                          bankAccount === 'yes'
                            ? 'bg-[#00E676] border-[#00E676] text-black font-bold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        YES [ACTIVE]
                      </button>
                      <button
                        onClick={() => setBankAccount('no')}
                        className={`py-3 text-xs font-mono border-2 transition-all ${
                          bankAccount === 'no'
                            ? 'bg-red-600 border-red-600 text-white font-bold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        NO [PERSONAL]
                      </button>
                    </div>
                  </div>

                  {/* 5. Existing Debt Load */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono tracking-widest text-zinc-400 uppercase">
                      Existing Lending / Advances Outstanding
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'none', label: 'None' },
                        { key: 'minor', label: '1 Position' },
                        { key: 'heavy', label: '2+ Positions' }
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setExistingDebt(item.key)}
                          className={`py-3 text-xs font-mono border-2 transition-all text-center ${
                            existingDebt === item.key 
                              ? 'bg-[#F4F3EF] border-[#F4F3EF] text-black font-bold' 
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Dynamic Advice Panel */}
            <div className="bg-[#1E1E1E] border border-zinc-800 p-6">
              <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase mb-4 border-b border-zinc-800 pb-2">
                Prioritized Compliance & Optimization Tips
              </h3>
              {tips.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/20 border border-emerald-500/30 text-[#00E676] text-xs font-mono">
                  <span className="text-lg">✓</span>
                  <span>Perfect baseline checklist configuration! No critical warnings or high-friction triggers observed.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {tips.map((tip, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 border text-xs font-mono flex gap-4 items-start ${
                        tip.priority === 'CRITICAL' || tip.priority === 'HIGH'
                          ? 'bg-orange-950/20 border-orange-500/30 text-orange-400' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        tip.priority === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {tip.priority}
                      </span>
                      <p className="leading-relaxed">{tip.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Real-Time Scoring Outputs */}
          <section className="lg:col-span-5 space-y-8">
            
            {/* Giant Metric Card */}
            <div className={`bg-zinc-950 border-2 border-zinc-800 p-8 ${status.shadow} transition-all duration-300`}>
              <div className="text-center">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                  CALCULATED HEALTH RATING
                </span>
                
                {/* Giant Number Dial */}
                <div className="relative inline-flex items-center justify-center my-6">
                  <div className="text-7xl sm:text-8xl font-display font-black tracking-tighter text-white">
                    {score}
                  </div>
                  <div className="text-xl sm:text-2xl font-mono text-zinc-500 ml-1 font-bold">/100</div>
                </div>

                <div className={`py-2 px-4 rounded text-xs font-mono font-bold tracking-widest inline-block ${status.color} ${status.bg} border ${status.border}`}>
                  {status.label}
                </div>
              </div>

              {/* Graphical Segment Scale */}
              <div className="mt-8 pt-6 border-t border-zinc-800 space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
                  <span>Critical Risk</span>
                  <span>Moderate</span>
                  <span>Qualified</span>
                </div>
                <div className="h-4 bg-zinc-900 border border-zinc-800 p-0.5 flex">
                  <div 
                    style={{ width: `${score}%` }} 
                    className="h-full bg-gradient-to-r from-orange-500 via-[#2979FF] to-[#00E676] transition-all duration-500 ease-out"
                  ></div>
                </div>
              </div>

              {/* Core Call to Action */}
              <div className="mt-8 space-y-3">
                <a 
                  href={partner.appLink}
                  className="w-full bg-[#00E676] text-[#0D0D0D] block py-4 text-center font-display font-black tracking-tight text-sm hover:bg-[#F4F3EF] transition-all border border-transparent shadow-[3px_3px_0px_0px_#FFFFFF]"
                >
                  PROCEED TO DIRECT FUNDING DESK
                </a>
                <a 
                  href={partner.bookLink}
                  className="w-full bg-transparent border border-zinc-700 text-[#F4F3EF] hover:border-white hover:text-white block py-3 text-center font-display font-bold tracking-tight text-xs transition-colors"
                >
                  BOOK 1-ON-1 DIAGNOSTIC DISCUSSION
                </a>
              </div>
            </div>

            {/* Targeted Program Fitment Lists */}
            <div className="bg-[#1E1E1E] border border-zinc-800 p-6">
              <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase mb-4 border-b border-zinc-800 pb-2">
                Calculated Compatible Capital Pathways
              </h3>
              
              <div className="space-y-4">
                {programs.map((prog, idx) => (
                  <div key={idx} className="bg-zinc-950 p-4 border border-zinc-900 hover:border-zinc-800 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-display font-extrabold text-white">{prog.title}</h4>
                      <span className="text-[10px] font-mono bg-[#1e1e1e] border border-zinc-800 text-[#00E676] px-1.5 py-0.5 rounded uppercase">
                        {prog.speed}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">ESTIMATED RATE RATIO: {prog.rate}</p>
                    <p className="text-xs text-zinc-300 mt-2 leading-relaxed font-sans">{prog.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </section>

        </div>
      </main>

      {/* Disclaimers & Regulatory Notices */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 border-t border-zinc-800 pt-8">
        <p className="text-[10px] text-zinc-600 font-mono leading-relaxed uppercase tracking-wide">
          CALCULATION NOTICE: The calculated health score provided here represents a dynamic evaluation based on self-reported operational criteria only. It is not an offer to fund, a commitment of terms, nor a credit decision under legal standards. Actual deployment rates, limits, structural terms, and program matches require absolute verification of PDF balance ledgers, bank transactions, and standard corporate entity checks.
        </p>
      </footer>

    </div>
  );
}
