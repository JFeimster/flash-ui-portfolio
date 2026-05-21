"use client";

import React, { useState } from 'react';

export default function PartnerResources() {
  const [activeTab, setActiveTab] = useState('All');

  const resources = [
    {
      id: 1,
      title: "Moonshine Brand Kit",
      category: "Marketing",
      type: "ZIP",
      description: "High-resolution logos, font files, and color palette guidelines for professional co-branding.",
      icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    },
    {
      id: 2,
      title: "Bridge Loan Deck",
      category: "Pitch Decks",
      type: "PDF",
      description: "A 12-slide walkthrough of our bridge loan products specifically for business brokers.",
      icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    },
    {
      id: 3,
      title: "Underwriting 101",
      category: "Training",
      type: "Video",
      description: "Learn what our credit team looks for in a file to increase your client approval rates.",
      icon: <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    },
    {
      id: 4,
      title: "Product Cheat Sheet",
      category: "Sales Tools",
      type: "PDF",
      description: "One-page summary of terms, rates, and LTVs for all Moonshine Capital funding products.",
      icon: <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    },
    {
      id: 5,
      title: "CPA Referral Script",
      category: "Marketing",
      type: "DOCX",
      description: "Proven email and LinkedIn outreach templates for connecting with accounting firms.",
      icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    },
    {
      id: 6,
      title: "Compliance Guide",
      category: "Legal",
      type: "PDF",
      description: "Essential rules for marketing financial products and managing referral disclosures.",
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    }
  ];

  const categories = ["All", "Marketing", "Pitch Decks", "Training", "Sales Tools", "Legal"];

  const filteredResources = activeTab === 'All' 
    ? resources 
    : resources.filter(r => r.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif]">
      <style jsx global>{`
        :root {
          --navy-deep: #020617;
          --gold: #d4af37;
        }
        .hero-gradient {
          background: linear-gradient(135deg, #020617 0%, #1e293b 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-card {
          background: white;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1);
          border-color: var(--gold);
        }
        .btn-gold {
          background: var(--gold);
          color: #020617;
          font-weight: 600;
        }
      `}</style>

      {/* Hero Section */}
      <header className="hero-gradient text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Resource Hub</span>
            <span className="text-slate-400 text-sm font-medium">Affiliate Support</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Master the Art of <span className="text-[#d4af37]">Capital Raising.</span></h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            Everything you need to educate your referral partners and close more funding deals. Access brand assets, training materials, and pitch templates.
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center h-16 gap-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`text-sm font-bold uppercase tracking-wider whitespace-nowrap border-b-2 h-full transition-all ${
                activeTab === cat 
                ? "border-[#d4af37] text-slate-900" 
                : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="glass-card rounded-2xl p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-900 rounded-xl text-[#d4af37]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {resource.icon}
                  </svg>
                </div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                  {resource.type}
                </span>
              </div>
              
              <div className="mb-2">
                <span className="text-[#d4af37] text-[10px] font-bold uppercase tracking-widest">{resource.category}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{resource.title}</h3>
              </div>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                {resource.description}
              </p>

              <button className="flex items-center justify-center gap-2 w-full py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-lg hover:bg-slate-900 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Asset
              </button>
            </div>
          ))}
        </div>

        {/* Training CTA */}
        <section className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 md:flex justify-between items-center">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Request a Custom Training Session</h2>
              <p className="text-slate-400">Meeting with a high-value CPA firm? Our leadership team can join your call or provide a customized deck for your specific presentation.</p>
            </div>
            <button className="btn-gold px-10 py-4 rounded-xl mt-8 md:mt-0 shadow-lg hover:opacity-90 transition-all">
              Book Specialist
            </button>
          </div>
          {/* Abstract pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37] opacity-5 rounded-full -mr-20 -mt-20"></div>
        </section>
      </main>

      <footer className="text-center py-10 text-slate-400 text-sm border-t border-slate-200 bg-white mt-20">
        Moonshine Capital Partner Resources &copy; 2024. For internal affiliate use only.
      </footer>
    </div>
  );
}