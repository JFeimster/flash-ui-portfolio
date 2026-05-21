import React, { useState } from 'react';

const AssetDownloader: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'decks' | 'brand' | 'training' | 'guides'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    {
      id: 1,
      title: "Moonshine Capital Brand Kit",
      description: "Official logos, typography guidelines, and color palette for co-branded marketing.",
      category: "brand",
      type: "ZIP",
      size: "14.2 MB",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      )
    },
    {
      id: 2,
      title: "Affiliate Pitch Deck v2.4",
      description: "A high-conversion slide deck designed for sophisticated business brokers and consultants.",
      category: "decks",
      type: "PDF",
      size: "8.5 MB",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
      )
    },
    {
      id: 3,
      title: "Revenue-Based Funding 101",
      description: "Quick-start guide to explaining our core funding product to small business owners.",
      category: "guides",
      type: "PDF",
      size: "2.1 MB",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      )
    },
    {
      id: 4,
      title: "Broker Onboarding Session",
      description: "recorded training session covering underwriting criteria and submission portal use.",
      category: "training",
      type: "MP4",
      size: "145 MB",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
      )
    },
    {
      id: 5,
      title: "Submission Checklist",
      description: "Ensure faster approvals by including these 5 documents with every referral.",
      category: "guides",
      type: "PDF",
      size: "1.1 MB",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      )
    },
    {
      id: 6,
      title: "White Label Email Templates",
      description: "Ready-to-use email sequences for CPAs, Attorneys, and Equipment Dealers.",
      category: "brand",
      type: "DOCX",
      size: "0.8 MB",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><rect width="20" height="14" x="2" y="5" rx="2"/></svg>
      )
    }
  ];

  const filteredResources = resources.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif]">
      {/* Header Overlay */}
      <section className="bg-[#020617] text-white py-12 px-8 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#d4af37]"></div>
            <span className="text-[#d4af37] text-sm font-bold uppercase tracking-widest">Affiliate Resource Hub</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Empower Your <span className="text-[#d4af37]">Referral Engine.</span></h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            Access professional brand assets, compliant sales decks, and expert training materials 
            designed to help you close more funding deals.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-8 py-10">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex flex-wrap gap-2">
            {['all', 'decks', 'brand', 'training', 'guides'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                  activeTab === tab 
                  ? 'bg-[#0f172a] text-white shadow-lg' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#d4af37]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => (
            <div key={item.id} className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 rounded-lg text-[#020617] group-hover:bg-[#fef3c7] group-hover:text-[#d4af37] transition-colors">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-500 rounded">
                  {item.type} • {item.size}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-[#020617] mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#10b981] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-[#10b981] rounded-full"></span>
                  LATEST VERSION
                </span>
                <button className="flex items-center gap-2 text-sm font-bold text-[#d4af37] hover:text-[#b8962e] transition-colors">
                  Download
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="text-slate-300 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">No resources found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {/* Training Teaser */}
        <div className="mt-16 bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          <div className="p-10 md:w-1/2">
            <span className="inline-block bg-[#d4af37] text-[#020617] text-[10px] font-bold px-2 py-1 rounded mb-4">LIVE WORKSHOP</span>
            <h3 className="text-2xl font-bold text-white mb-4">Advanced Underwriting: Closing Complex Deals</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Join our Chief Underwriting Officer for a deep dive into reading high-level bank statements 
              and identifying opportunities in the construction and manufacturing sectors.
            </p>
            <button className="bg-white text-[#020617] font-bold px-6 py-3 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Schedule Training Session
            </button>
          </div>
          <div className="md:w-1/2 bg-gradient-to-br from-[#d4af37]/20 to-transparent relative min-h-[250px]">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center shadow-2xl animate-pulse cursor-pointer hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-10 text-slate-400 text-xs border-t border-slate-200">
        Confidential Moonshine Capital Partner Assets. For authorized affiliate use only.
      </footer>
    </div>
  );
};

export default AssetDownloader;
```