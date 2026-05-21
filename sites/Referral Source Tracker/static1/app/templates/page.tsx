import React, { useState } from 'react';

const OutreachLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeChannel, setActiveChannel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    "All", "CPA/Accountant", "Bank Manager", "Business Broker", "Real Estate Agent", "Equipment Dealer"
  ];

  const channels = ["All", "Email", "LinkedIn", "Phone/SMS"];

  const templates = [
    {
      id: 1,
      title: "The Mutual Client Value-Add",
      archetype: "CPA/Accountant",
      channel: "Email",
      subject: "Helping [Client Name] with capital options",
      content: "Hi [Partner Name],\n\nI’m reaching out because I know you handle the tax strategy for [Client Name/Industry]. We recently helped a similar firm secure [Amount] in non-dilutive funding to cover their tax liabilities and growth capital without hitting their personal credit.\n\nI’d love to see if we can provide similar value to your other clients while keeping you in the loop on their financial health. Do you have 10 minutes for a brief introduction this week?\n\nBest,\n[Your Name]",
      tags: ["High Conversion", "Value-First"]
    },
    {
      id: 2,
      title: "The 'Bank Turn-Down' Lifeline",
      archetype: "Bank Manager",
      channel: "LinkedIn",
      subject: "Resource for your non-boxable deals",
      content: "Hi [Partner Name], I noticed you’re leading the commercial team at [Bank Name]. I know how tough it is to tell a good client 'no' when they don't fit the traditional lending box.\n\nAt Moonshine Capital, we specialize in the deals banks usually turn down (Bridge, MCA, Asset-based). I’d love to be the person you refer those clients to so they stay capitalized and eventually grow back into bankable customers for you.\n\nOpen to a quick sync?",
      tags: ["Strategic", "B2B"]
    },
    {
      id: 3,
      title: "Fast-Close Equipment Intro",
      archetype: "Equipment Dealer",
      channel: "Phone/SMS",
      subject: "N/A",
      content: "Hey [Partner Name], it's [Your Name] from Moonshine. Just wanted to let you know we've streamlined our equipment financing for [Industry] this month. If you have a buyer on the fence because of a down payment or credit, send them my way—we can usually get an approval in 4 hours. Let's get your inventory moving!",
      tags: ["Urgent", "Direct"]
    },
    {
      id: 4,
      title: "Post-Event Follow Up",
      archetype: "Business Broker",
      channel: "Email",
      subject: "Great meeting you at [Event Name]",
      content: "Hi [Partner Name],\n\nIt was great connecting at [Event Name] yesterday. I was intrigued by the listings you mentioned in the [Industry] sector.\n\nSpeed to close is everything in brokerage. I can provide your buyers with pre-approval letters in 24 hours to give your sellers more confidence in the deal. \n\nLet’s grab coffee next Tuesday to discuss a formal referral arrangement?\n\nCheers,\n[Your Name]",
      tags: ["Networking", "Follow-up"]
    },
    {
      id: 5,
      title: "The 'Tax Season' Relief",
      archetype: "CPA/Accountant",
      channel: "LinkedIn",
      content: "Hi [Partner Name], hope tax season is treating you well. I’m seeing a lot of business owners looking for working capital right now to manage their Q2 growth while paying down their tax obligations. We have some creative interest-only options that might help your clients keep their cash flow steady. Worth a quick chat?",
      tags: ["Seasonal", "Soft Sell"]
    }
  ];

  const filteredTemplates = templates.filter(t => {
    const matchesCat = activeCategory === 'All' || t.archetype === activeCategory;
    const matchesChan = activeChannel === 'All' || t.channel === activeChannel;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesChan && matchesSearch;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Template copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] text-slate-800">
      {/* Hero Section */}
      <header className="bg-[#020617] text-white py-12 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#d4af37] text-[#020617] px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Library</span>
            <span className="text-slate-400 text-sm">Scripts & Outreach</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The Outreach <span className="text-[#d4af37]">Template Library</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            High-converting communication scripts tailored for every referral archetype. 
            Copy, personalize, and build your network.
          </p>
        </div>
      </header>

      {/* Filters Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-500 font-bold text-xs uppercase mr-2">Archetype:</span>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat ? 'bg-[#020617] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full lg:w-64 focus:ring-2 focus:ring-[#d4af37] outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-bold text-xs uppercase mr-2">Channel:</span>
            <div className="flex gap-2">
              {channels.map(chan => (
                <button 
                  key={chan}
                  onClick={() => setActiveChannel(chan)}
                  className={`text-xs font-bold px-3 py-1 rounded border transition-all ${
                    activeChannel === chan ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/5' : 'border-slate-200 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {chan}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto p-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                      {template.channel}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-amber-50 text-[#d4af37] px-2 py-0.5 rounded">
                      {template.archetype}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 leading-tight">{template.title}</h3>
                </div>
                <button 
                  onClick={() => copyToClipboard(template.content)}
                  className="p-2 text-slate-400 hover:text-[#d4af37] transition-colors"
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
              
              <div className="p-5 bg-slate-50/50 flex-grow">
                {template.subject !== "N/A" && (
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Subject Line</span>
                    <p className="text-sm font-medium text-slate-700 italic border-l-2 border-[#d4af37] pl-3">{template.subject}</p>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Message Body</span>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {template.content.split(/(\[.*?\])/).map((part, i) => 
                      part.startsWith('[') ? <span key={i} className="text-[#d4af37] font-bold">{part}</span> : part
                    )}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-1">
                  {template.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold text-slate-400 px-1.5 py-0.5 border border-slate-200 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button 
                   onClick={() => copyToClipboard(template.content)}
                   className="text-xs font-bold text-[#020617] hover:underline"
                >
                  Copy Text
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No templates found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm">
          Moonshine Capital Outreach Library &copy; 2024. <br />
          Always customize your placeholders before hitting send.
        </p>
      </footer>

      <style jsx global>{`
        body {
          background-color: #f8fafc;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .grid > div {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default OutreachLibrary;