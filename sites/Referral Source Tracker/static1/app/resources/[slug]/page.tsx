import React from 'react';

export default function ResourceDetail({ params }: { params: { slug: string } }) {
  // Mock logic to determine dynamic content based on the URL slug
  const getResourceData = (slug: string) => {
    const resources: Record<string, { title: string; subtitle: string; category: string; color: string; duration: string }> = {
      'pitch-decks': {
        title: 'Master Pitch Decks',
        subtitle: 'Investor-ready presentations for high-ticket capital placement and referral partner meetings.',
        category: 'Sales Collateral',
        color: '#d4af37',
        duration: '12-Page Deck'
      },
      'brand-guidelines': {
        title: 'Brand Identity Vault',
        subtitle: 'Official Moonshine Capital assets, including logos, typography, and professional color palettes.',
        category: 'Marketing',
        color: '#10b981',
        duration: 'ZIP Archive'
      },
      'product-training': {
        title: 'Funding Deep-Dives',
        subtitle: 'A technical masterclass on bridge loans, receivables financing, and SBA alternative products.',
        category: 'Partner Training',
        color: '#d4af37',
        duration: '18m Video'
      },
      'broker-outreach': {
        title: 'Broker Success Kit',
        subtitle: 'Templates and communication strategies for effectively approaching Business Brokers and CPAs.',
        category: 'Outreach',
        color: '#fef3c7',
        duration: 'Toolkit'
      }
    };
    return resources[slug] || resources['pitch-decks'];
  };

  const resource = getResourceData(params.slug);

  return (
    <div className="bg-[#020617] min-h-screen text-slate-300 font-['Inter',sans-serif] selection:bg-[#d4af37] selection:text-[#020617]">
      {/* Background Decorative Element */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#d4af37] opacity-[0.03] blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      
      {/* Sub-Navigation */}
      <nav className="border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#d4af37] transform rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#020617] rotate-[-45deg]"></div>
            </div>
            <span className="text-white font-bold tracking-tight text-xs uppercase group cursor-default">
              Partner Hub <span className="text-slate-600 mx-2">/</span> <span className="text-[#d4af37]">{resource.category}</span>
            </span>
          </div>
          <button onClick={() => window.history.back()} className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Return to Hub
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[#d4af37]/20">
                LOCKED ASSET
              </span>
              <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                VERIFIED PARTNERS ONLY
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {resource.title}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl font-light italic">
              "{resource.subtitle}"
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl flex items-center gap-4 min-w-[280px]">
              <div className="w-12 h-12 bg-[#d4af37] text-[#020617] rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Download</p>
                <p className="text-sm font-bold text-white uppercase tracking-tighter">Full Resource Pack</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Visual/Player Section */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative aspect-video rounded-3xl bg-slate-900 overflow-hidden border border-white/10 group shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-24 h-24 bg-[#d4af37] rounded-full flex items-center justify-center text-[#020617] shadow-[0_0_50px_rgba(212,175,55,0.3)] hover:scale-110 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
              </div>

              <div className="absolute bottom-8 left-8 flex items-center gap-4">
                <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded border border-white/10 text-[10px] font-bold text-white uppercase">
                  {resource.duration}
                </div>
                <p className="text-white font-bold text-lg uppercase tracking-wider">Preview Resource</p>
              </div>
            </div>

            <section>
              <h3 className="text-white text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#d4af37]"></span>
                Included Files
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Executive_Brief_2024.pdf', size: '4.2MB', label: 'PDF' },
                  { name: 'Moonshine_Product_Rate_Card.xlsx', size: '1.8MB', label: 'DATA' },
                  { name: 'Compliance_Disclosure_v4.pdf', size: '0.5MB', label: 'LEGAL' },
                  { name: 'Referral_Outreach_Guide.docx', size: '2.1MB', label: 'DOCX' }
                ].map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-[#d4af37]/30 transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0f172a] rounded flex items-center justify-center text-[#d4af37] border border-white/10 group-hover:bg-[#d4af37] group-hover:text-[#020617] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm tracking-tight">{file.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{file.size} • {file.label}</p>
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 group-hover:text-white transition-colors"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-b from-[#0f172a] to-transparent border border-white/10 rounded-3xl p-8 shadow-xl">
              <h4 className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] mb-6">Expert Context</h4>
              <p className="text-slate-300 leading-relaxed mb-8 italic font-light">
                "When meeting with CPAs, focus on Section 1.4 of this deck. They care about how capital placement affects their clients' tax liabilities. Use the included spreadsheet to model the after-tax cost of debt for them."
              </p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-8">
                <div className="w-12 h-12 bg-slate-800 rounded-full border-2 border-[#d4af37] p-1">
                  <div className="w-full h-full bg-[#020617] rounded-full"></div>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Julian Vance</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Senior Funding Officer</p>
                </div>
              </div>
            </div>

            <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
              </div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-tighter">Compliance Status</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                All materials in this folder are pre-approved by Legal for direct distribution to potential referral partners. No modification allowed.
              </p>
              <div className="flex items-center gap-2 text-[#10b981] text-[10px] font-black uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Approved Oct 2024
              </div>
            </div>

            <div className="p-8 border border-white/5 rounded-3xl text-center">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">Need Custom Assets?</p>
              <button className="w-full py-4 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-[#020617] transition-all">
                Request Co-Branding
              </button>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <p className="text-[10px] font-medium tracking-[0.2em] text-slate-400">
            © 2024 MOONSHINE CAPITAL INVESTMENTS LLC | FOR AUTHORIZED PARTNERS ONLY
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-[#d4af37] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Contact Support</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Legal Vault</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
```