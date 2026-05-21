import React, { useState } from 'react';
import { Search, Mail, Linkedin, MessageSquare, Copy, Edit3, User, Building, FileText, Calendar, CheckCircle, Share2 } from 'lucide-react';

const TemplateEditor = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [variables, setVariables] = useState({
    partnerName: 'Marcus',
    companyName: 'Thorne & Co Accountants',
    myService: 'non-dilutive business funding',
    actionDate: 'this Thursday',
    recentContext: 'your recent post about tax credits'
  });

  const templates = [
    {
      id: 1,
      title: "The Bank Manager Intro",
      category: "Bank Manager",
      channel: "Email",
      subject: "Supporting your non-conforming loan requests",
      body: "Hi {{partnerName}},\n\nI hope your week is going well at {{companyName}}. I'm reaching out because I specialize in {{myService}} for businesses that might not fit the traditional bank lending box right now.\n\nI’d love to be a resource for you when a client's file is strong but doesn't meet the current bank criteria. Would you be open to a 10-minute chat {{actionDate}} to see if I can help you save more deals?\n\nBest regards,\n[Your Name]\nMoonshine Capital"
    },
    {
      id: 2,
      title: "Accountant Value-Add",
      category: "CPA/Accountant",
      channel: "Email",
      subject: "Capital options for your {{companyName}} clients",
      body: "Hi {{partnerName}},\n\nSince you're deep in the numbers for {{companyName}} clients, I wanted to reach out regarding {{myService}}. Many of our mutual contacts are looking for growth capital that doesn't dilute their equity.\n\nI've helped several firms recently secure funding based on their receivables. If any of your clients are planning expansions for next quarter, I'd love to chat. How does {{actionDate}} look for a brief intro?\n\nBest,\n[Your Name]"
    },
    {
      id: 3,
      title: "The Broker 'Speed to Close'",
      category: "Business Broker",
      channel: "LinkedIn",
      body: "Hi {{partnerName}}! I saw {{recentContext}} and thought of our recent success with business acquisition capital. I specialize in {{myService}} and help brokers at {{companyName}} close deals faster by providing bridge funding where traditional SBA might lag. Let's connect!"
    },
    {
      id: 4,
      title: "Equipment Dealer Referral",
      category: "Equipment Dealer",
      channel: "SMS",
      body: "Hey {{partnerName}}, it's [Your Name] from Moonshine. I have a client looking at gear from {{companyName}}. They need creative {{myService}} to move fast. Do you have 5 mins {{actionDate}} to sync up on how I can help your customers close more sales?"
    }
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const getProcessedBody = (body: string) => {
    let text = body;
    text = text.replace(/{{partnerName}}/g, variables.partnerName || '[Partner Name]');
    text = text.replace(/{{companyName}}/g, variables.companyName || '[Company Name]');
    text = text.replace(/{{myService}}/g, variables.myService || '[My Service]');
    text = text.replace(/{{actionDate}}/g, variables.actionDate || '[Action Date]');
    text = text.replace(/{{recentContext}}/g, variables.recentContext || '[Recent Context]');
    return text;
  };

  const copyToClipboard = () => {
    const text = getProcessedBody(currentTemplate.body);
    navigator.clipboard.writeText(text);
    alert("Template content copied to clipboard!");
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[750px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl font-sans">
      {/* Sidebar: Library */}
      <aside className="w-full lg:w-80 bg-slate-900 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#d4af37] rounded flex items-center justify-center">
              <Share2 className="w-5 h-5 text-slate-900" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Outreach Library</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search archetypes..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border-none rounded-lg text-sm text-slate-300 focus:ring-1 focus:ring-[#d4af37] placeholder-slate-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplateId(t.id)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                selectedTemplateId === t.id 
                ? 'bg-[#d4af37] shadow-lg shadow-yellow-900/20' 
                : 'hover:bg-slate-800 border border-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTemplateId === t.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {t.category}
                </span>
                <div className={`${selectedTemplateId === t.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {t.channel === 'Email' && <Mail className="w-3.5 h-3.5" />}
                  {t.channel === 'LinkedIn' && <Linkedin className="w-3.5 h-3.5" />}
                  {t.channel === 'SMS' && <MessageSquare className="w-3.5 h-3.5" />}
                </div>
              </div>
              <h4 className={`text-sm font-bold leading-tight ${selectedTemplateId === t.id ? 'text-slate-900' : 'text-slate-300'}`}>
                {t.title}
              </h4>
            </button>
          ))}
        </div>

        <div className="p-6 bg-slate-950 border-t border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 text-center">System Status</p>
          <div className="flex justify-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> CRM Sync Active
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border border-slate-200">
                {currentTemplate.channel}
              </span>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">{currentTemplate.title}</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium italic">Adjust the partner details to auto-fill the script below.</p>
          </div>
          <button 
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-[#d4af37] px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-xl active:scale-95 group"
          >
            <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Copy for {currentTemplate.channel}
          </button>
        </div>

        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
          {/* Variable Inputs Panel */}
          <div className="xl:w-80 p-6 border-b xl:border-b-0 xl:border-r border-slate-100 bg-slate-50/50 overflow-y-auto">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Edit3 className="w-3 h-3" /> 
              Dynamic Fields
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Partner Name
                </label>
                <input 
                  type="text" 
                  value={variables.partnerName}
                  onChange={(e) => handleVariableChange('partnerName', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:border-[#d4af37] focus:ring-2 focus:ring-amber-50 outline-none transition-all shadow-sm"
                  placeholder="e.g. Marcus"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> Company Name
                </label>
                <input 
                  type="text" 
                  value={variables.companyName}
                  onChange={(e) => handleVariableChange('companyName', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:border-[#d4af37] focus:ring-2 focus:ring-amber-50 outline-none transition-all shadow-sm"
                  placeholder="e.g. Thorne & Co"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Your Service Focus
                </label>
                <input 
                  type="text" 
                  value={variables.myService}
                  onChange={(e) => handleVariableChange('myService', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:border-[#d4af37] focus:ring-2 focus:ring-amber-50 outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Meeting Suggestion
                </label>
                <input 
                  type="text" 
                  value={variables.actionDate}
                  onChange={(e) => handleVariableChange('actionDate', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:border-[#d4af37] focus:ring-2 focus:ring-amber-50 outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <Share2 className="w-3.5 h-3.5 text-slate-400" /> Personalized Context
                </label>
                <textarea 
                  value={variables.recentContext}
                  onChange={(e) => handleVariableChange('recentContext', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:border-[#d4af37] focus:ring-2 focus:ring-amber-50 outline-none transition-all shadow-sm h-20 resize-none"
                  placeholder="e.g. your post about equipment ROI"
                />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 p-6 lg:p-10 flex flex-col bg-white overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                Live Preview & Personalization
              </h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3 text-emerald-500" /> AI-CHECKED
                </span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col border border-slate-200 rounded-2xl bg-white shadow-inner overflow-hidden relative group">
              {currentTemplate.subject && (
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex gap-4">
                  <span className="text-slate-400 font-bold text-xs uppercase w-16">Subject:</span>
                  <span className="text-slate-900 font-bold text-sm tracking-tight">{getProcessedBody(currentTemplate.subject)}</span>
                </div>
              )}
              <div className="flex-1 p-8 overflow-y-auto font-mono text-sm leading-relaxed text-slate-700">
                <div className="whitespace-pre-wrap">
                  {getProcessedBody(currentTemplate.body)}
                </div>
              </div>
              {/* Variable Overlay Highlighter (Visual Decoration) */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-[#fef3c7] text-[#92400e] text-[8px] px-1.5 py-0.5 rounded font-black border border-amber-200">VARIABLE INJECTION ACTIVE</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Response Rate</p>
                <p className="text-xl font-black text-emerald-900">42%</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Tone Analysis</p>
                <p className="text-xl font-black text-blue-900">Professional</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Word Count</p>
                <p className="text-xl font-black text-amber-900">{getProcessedBody(currentTemplate.body).split(' ').length} Words</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplateEditor;