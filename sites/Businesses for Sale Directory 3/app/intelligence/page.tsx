import React from 'react';

const IntelligencePage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#C1FF00] selection:text-[#050505]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
        
        :root {
          --obsidian: #050505;
          --bone: #F5F5F0;
          --acid-green: #C1FF00;
          --oxidized-copper: #8E593E;
          --blood-orange: #FF3D00;
          --graphite: #1A1A1A;
        }

        .noise {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 9999;
        }

        .serif { font-family: 'Playfair Display', serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        
        .brutalist-border {
          border: 2px solid var(--graphite);
        }
        
        .report-card:hover {
          border-color: var(--bone);
        }

        .text-glow-green {
          text-shadow: 0 0 10px rgba(193, 255, 0, 0.3);
        }
      `}</style>

      <div className="noise" />

      {/* Navigation */}
      <nav className="sticky top-0 z-[100] flex justify-between items-center px-8 py-6 bg-[#050505] border-b-2 border-[#1A1A1A]">
        <a href="/" className="text-2xl font-black tracking-tighter uppercase">
          OXIDIZED<span className="text-[#8E593E]">LEDGER</span>
        </a>
        <div className="hidden md:flex gap-8 text-[0.7rem] font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-[#C1FF00] transition-colors">Intelligence</a>
          <a href="#" className="hover:text-[#C1FF00] transition-colors">Deal Flow</a>
          <a href="#" className="hover:text-[#C1FF00] transition-colors">The Terminal</a>
          <a href="#" className="hover:text-[#C1FF00] transition-colors">Library</a>
        </div>
        <div className="mono text-[0.7rem] text-[#C1FF00]">System: Secure // 03.24.24</div>
      </nav>

      {/* Hero Section / Featured Report */}
      <header className="px-8 pt-16 pb-24 border-b-2 border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <span className="mono text-[#8E593E] text-sm block mb-4 tracking-[0.3em]">/ / Q1 MARKET INTELLIGENCE REPORT</span>
          <h1 className="serif text-6xl md:text-8xl font-black mb-8 leading-[0.9] italic">
            The Copper <br/>Macro Strategy.
          </h1>
          
          <div className="grid md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-7">
              <p className="text-xl md:text-2xl text-[#888] leading-relaxed mb-8">
                An exhaustive autopsy of the 2024 small business acquisition landscape. From SBA 7(a) interest rate pivots to the aggressive rise of search-fund "roll-ups" in local services.
              </p>
              <div className="flex gap-4">
                <button className="bg-[#F5F5F0] text-[#050505] px-8 py-4 font-black uppercase text-sm hover:bg-[#C1FF00] transition-colors">
                  Read Full Report
                </button>
                <button className="border border-[#F5F5F0] px-8 py-4 font-black uppercase text-sm hover:bg-[#1A1A1A] transition-colors">
                  Download PDF
                </button>
              </div>
            </div>
            
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 bg-[#0F0F0F] border border-[#1A1A1A]">
                <span className="mono text-[#666] text-[0.6rem] block mb-2 uppercase">Median Multiple</span>
                <span className="mono text-2xl text-[#C1FF00] font-bold">3.24x</span>
              </div>
              <div className="p-6 bg-[#0F0F0F] border border-[#1A1A1A]">
                <span className="mono text-[#666] text-[0.6rem] block mb-2 uppercase">Cap Rate Avg.</span>
                <span className="mono text-2xl text-[#FF3D00] font-bold">14.8%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Grid of Intelligence */}
      <main className="px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Deep Dives</h2>
              <p className="mono text-[#666] text-sm">Proprietary analysis for the serious acquirer.</p>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-[2px] bg-[#C1FF00]"></div>
              <div className="w-4 h-[2px] bg-[#1A1A1A]"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Report Card 1 */}
            <div className="report-card group border-2 border-[#1A1A1A] p-8 bg-[#0F0F0F] flex flex-col transition-all duration-300">
              <span className="mono text-[#8E593E] text-[0.65rem] mb-6">#042 // FINANCING</span>
              <h3 className="serif text-3xl mb-6 italic leading-tight">Leveraging SBA 7(a) in a High-Rate Environment</h3>
              <p className="text-[#888] text-sm mb-8 flex-grow">
                A technical whitepaper on debt-service coverage ratios and negotiation tactics for seller financing when prime rates exceed 8%.
              </p>
              <div className="pt-6 border-t border-[#1A1A1A] flex justify-between items-center">
                <span className="mono text-[0.6rem] text-[#666]">12 MIN READ</span>
                <a href="#" className="mono text-[0.7rem] text-[#C1FF00] font-bold tracking-tighter">ACCESS FILE &rarr;</a>
              </div>
            </div>

            {/* Report Card 2 */}
            <div className="report-card group border-2 border-[#1A1A1A] p-8 bg-[#0F0F0F] flex flex-col transition-all duration-300">
              <span className="mono text-[#8E593E] text-[0.65rem] mb-6">#043 // CASE STUDY</span>
              <h3 className="serif text-3xl mb-6 italic leading-tight">The $40M HVAC Roll-Up Blueprint</h3>
              <p className="text-[#888] text-sm mb-8 flex-grow">
                How a private equity boutique consolidated 12 local HVAC operators in the Southeast. Operational synergies and exit strategies.
              </p>
              <div className="pt-6 border-t border-[#1A1A1A] flex justify-between items-center">
                <span className="mono text-[0.6rem] text-[#666]">24 MIN READ</span>
                <a href="#" className="mono text-[0.7rem] text-[#C1FF00] font-bold tracking-tighter">ACCESS FILE &rarr;</a>
              </div>
            </div>

            {/* Report Card 3 */}
            <div className="report-card group border-2 border-[#1A1A1A] p-8 bg-[#0F0F0F] flex flex-col transition-all duration-300">
              <span className="mono text-[#8E593E] text-[0.65rem] mb-6">#044 // TECH</span>
              <h3 className="serif text-3xl mb-6 italic leading-tight">Micro-SaaS Multiples: The 2024 Correction</h3>
              <p className="text-[#888] text-sm mb-8 flex-grow">
                Why valuation multiples for businesses under $500k SDE are compressing and how to spot undervalued assets in the mess.
              </p>
              <div className="pt-6 border-t border-[#1A1A1A] flex justify-between items-center">
                <span className="mono text-[0.6rem] text-[#666]">15 MIN READ</span>
                <a href="#" className="mono text-[0.7rem] text-[#C1FF00] font-bold tracking-tighter">ACCESS FILE &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Brutalist CTA Section */}
      <section className="bg-[#F5F5F0] text-[#050505] py-24 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-6">
              Subscribe to <br/>the ledger.
            </h2>
            <p className="mono font-bold text-sm tracking-tight opacity-70">
              Bi-weekly raw data exports and private deal-flow intelligence delivered directly to your terminal.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="EMAIL_ADDRESS@SECURE.HOST"
                className="bg-transparent border-b-4 border-[#050505] p-4 mono text-xl focus:outline-none placeholder-[#050505]/30"
              />
              <button className="bg-[#050505] text-[#F5F5F0] px-12 py-6 font-black uppercase text-xl hover:bg-[#8E593E] transition-colors">
                JOIN THE ELITE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-20 border-t-2 border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <a href="/" className="text-xl font-black tracking-tighter uppercase mb-6 block">
              OXIDIZED<span className="text-[#8E593E]">LEDGER</span>
            </a>
            <p className="mono text-[0.7rem] text-[#666] leading-relaxed max-w-sm">
              OXIDIZED LEDGER PROVIDES ASYMMETRIC INFORMATION FOR THE MODERN ACQUISITION ENTREPRENEUR. PRIVACY IS OUR PRIORITY. DATA IS OUR EDGE.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="mono text-[#C1FF00] text-[0.65rem] mb-4">RESOURCES</span>
            <a href="#" className="text-xs font-bold uppercase hover:text-[#8E593E]">Market Reports</a>
            <a href="#" className="text-xs font-bold uppercase hover:text-[#8E593E]">SBA Calculators</a>
            <a href="#" className="text-xs font-bold uppercase hover:text-[#8E593E]">Roll-up Strategy</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="mono text-[#C1FF00] text-[0.65rem] mb-4">LEGAL</span>
            <a href="#" className="text-xs font-bold uppercase hover:text-[#8E593E]">Privacy Policy</a>
            <a href="#" className="text-xs font-bold uppercase hover:text-[#8E593E]">Terms of Terminal</a>
            <a href="#" className="text-xs font-bold uppercase hover:text-[#8E593E]">Risk Disclosure</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#1A1A1A] flex justify-between items-center">
          <span className="mono text-[0.6rem] text-[#444] tracking-widest">© 2024 OXIDIZED LEDGER INC. // ALL RIGHTS RESERVED</span>
          <span className="mono text-[0.6rem] text-[#444] tracking-widest">ENCRYPTED CONNECTION</span>
        </div>
      </footer>
    </div>
  );
};

export default IntelligencePage;