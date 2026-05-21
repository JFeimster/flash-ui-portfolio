import React, { useState, useMemo } from 'react';
import { Copy, Mail, Linkedin, MessageSquare, User, Briefcase, FileText, CheckCircle } from 'lucide-react';

const ScriptPreview = () => {
  const [selectedCategory, setSelectedCategory] = useState('Email');
  const [selectedArchetype, setSelectedArchetype] = useState('CPA / Accountant');
  const [copied, setCopied] = useState(false);
  const [variables, setVariables] = useState({
    partnerName: 'Marcus Thorne',
    companyName: 'Thorne & Co',
    userName: 'Alex Moonshine'
  });

  const templates = [
    {
      id: 1,
      archetype: 'CPA / Accountant',
      channel: 'Email',
      title: 'The Tax Season Relief',
      content: "Hi {{partnerName}},\n\nI know {{companyName}} is deep in the trenches of tax season. I've been helping a few business owners recently who were looking for capital that doesn't complicate their balance sheet.\n\nWhen things settle down, I'd love to share how Moonshine Capital can provide non-dilutive funding for your clients who need growth capital but want to keep their equity intact.\n\nBest,\n{{userName}}"
    },
    {
      id: 2,
      archetype: 'Bank Manager',
      channel: 'LinkedIn',
      title: 'The "Turn-Down" Solution',
      content: "Hi {{partnerName}}, great connecting! I noticed you focus on commercial lending at {{companyName}}. I often work with companies that fall just outside traditional bank credit boxes (SBA/Conventional). \n\nI'd love to be a resource for any clients you have to turn down, so they stay loyal to you for their depository needs while we handle the bridge financing. Coffee next week?"
    },
    {
      id: 3,
      archetype: 'Business Broker',
      channel: 'SMS',
      title: 'Quick Closing Ping',
      content: "Hey {{partnerName}}, it's {{userName}}. Got a buyer looking at a deal similar to your listing at {{companyName}}. We can move fast on the debt side to ensure a 21-day close. You free for a 2-min sync?"
    },
    {
      id: 4,
      archetype: 'Real Estate Agent',
      channel: 'Email',
      title: 'CRE Leverage Strategy',
      content: "Hi {{partnerName}},\n\nI saw your listing for the industrial site. Many of my clients are looking for creative ways to leverage their equipment to fund the down payment on real estate like this.\n\nIf any of your prospective buyers are hitting a wall with their liquidity, let's chat about a hybrid funding structure.\n\nCheers,\n{{userName}}"
    }
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => t.channel === selectedCategory && t.archetype === selectedArchetype);
  }, [selectedCategory, selectedArchetype]);

  const replaceVariables = (text: string) => {
    return text
      .replace(/{{partnerName}}/g, variables.partnerName)
      .replace(/{{companyName}}/g, variables.companyName)
      .replace(/{{userName}}/g, variables.userName);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(replaceVariables(text));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-['Inter']">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#020617] p-8 rounded-2xl shadow-xl text-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#d4af37] text-[#020617] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">v2.0 Asset</span>
              <span className="text-slate-400 text-xs">Communication Library</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Outreach <span className="text-[#d4af37]">Template Library</span></h2>
            <p className="text-slate-400 max-w-md text-sm">High-conversion multi-channel scripts designed for professional referral archetypes.</p>
          </div>
          
          <div className="flex gap-1 bg-white/10 p-1.5 rounded-xl backdrop-blur-md border border-white/10">
            {['Email', 'LinkedIn', 'SMS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedCategory === cat 
                  ? 'bg-[#d4af37] text-[#020617] shadow-lg' 
                  : 'text-white hover:bg-white/5'
                }`}
              >
                {cat === 'Email' && <Mail size={14} />}
                {cat === 'LinkedIn' && <Linkedin size={14} />}
                {cat === 'SMS' && <MessageSquare size={14} />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Partner Archetype</h3>
              <div className="space-y-2">
                {['CPA / Accountant', 'Bank Manager', 'Business Broker', 'Real Estate Agent'].map((arch) => (
                  <button
                    key={arch}
                    onClick={() => setSelectedArchetype(arch)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center justify-between group ${
                      selectedArchetype === arch
                      ? 'border-[#d4af37] bg-amber-50/50 text-[#020617] font-bold'
                      : 'border-slate-100 hover:border-slate-200 text-slate-500'
                    }`}
                  >
                    {arch}
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedArchetype === arch ? 'bg-[#d4af37] ring-4 ring-amber-100' : 'bg-slate-200'}`}></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Autofill Variables</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Recipient Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      value={variables.partnerName}
                      onChange={(e) => setVariables({...variables, partnerName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Recipient Company</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      value={variables.companyName}
                      onChange={(e) => setVariables({...variables, companyName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template Display Area */}
          <div className="lg:col-span-8 space-y-6">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#020617] flex items-center justify-center text-[#d4af37]">
                        <FileText size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{template.title}</h4>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Active Template</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCopy(template.content)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
                        copied 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-[#d4af37] hover:bg-[#b8962e] text-[#020617]'
                      }`}
                    >
                      {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy Template'}
                    </button>
                  </div>
                  <div className="p-8">
                    <div className="relative group">
                      <div className="absolute -top-3 -left-3 px-2 py-1 bg-white border border-slate-200 text-[9px] font-black text-slate-400 rounded uppercase shadow-sm">Preview</div>
                      <div className="whitespace-pre-line text-slate-700 leading-relaxed font-serif italic text-lg bg-slate-50/50 p-8 rounded-2xl border border-dashed border-slate-200 group-hover:border-[#d4af37]/30 transition-colors">
                        {replaceVariables(template.content)}
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>)}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">Used by 14 Partners</span>
                      </div>
                      <div className="h-4 w-px bg-slate-200"></div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        Optimal for Morning Outreach
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-24 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="text-slate-200" size={40} />
                </div>
                <h3 className="text-slate-900 font-bold text-xl tracking-tight">No Templates Found</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">We don't have a template for this specific combination yet. Try a different channel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptPreview;