import React, { useState, useMemo } from 'react';

// Types & Interfaces
interface ChecklistItem {
  id: string;
  category: 'Financial' | 'Legal' | 'Operations' | 'Lending';
  task: string;
  assignedTo: 'Advisor' | 'Legal Counsel' | 'Lender' | 'Buyer';
  status: 'pending' | 'in_review' | 'verified' | 'flagged';
  critical: boolean;
  dueDate: string;
}

interface DocumentFile {
  id: string;
  name: string;
  category: string;
  size: string;
  status: 'Encrypted' | 'Verified' | 'Pending Review' | 'Flagged';
  uploadedBy: string;
  uploadedAt: string;
  securityHash: string;
}

interface CollabMessage {
  id: string;
  sender: string;
  role: 'ADVISOR' | 'LEGAL' | 'LENDER' | 'BUYER';
  text: string;
  timestamp: string;
  secureChannel: boolean;
}

interface DealDetails {
  id: string;
  codename: string;
  loiValue: string;
  targetClosing: string;
  escrowAgent: string;
  secHandshake: string;
}

export default function DiligenceChecklist() {
  // Mock Deal Context
  const [activeDeal, setActiveDeal] = useState<DealDetails>({
    id: 'nova',
    codename: 'PROJECT NOVA',
    loiValue: '$2,600,000',
    targetClosing: 'OCT 24, 2026',
    escrowAgent: 'Aegis Title & Escrow Corp',
    secHandshake: 'SHA256::7e8a9f23...b420'
  });

  // State Management
  const [activeTab, setActiveTab] = useState<'checklist' | 'vault' | 'collab'>('checklist');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  
  // Interactive Checklist State
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', category: 'Financial', task: '3 Years Certified Tax Returns Audit', assignedTo: 'Buyer', status: 'verified', critical: true, dueDate: '09/15/2026' },
    { id: '2', category: 'Financial', task: 'Interim Year-to-Date P&L & Balance Sheet Reconciliation', assignedTo: 'Advisor', status: 'in_review', critical: true, dueDate: '09/18/2026' },
    { id: '3', category: 'Financial', task: 'Quality of Earnings (QofE) Report Issuance', assignedTo: 'Advisor', status: 'pending', critical: true, dueDate: '10/01/2026' },
    { id: '4', category: 'Legal', task: 'Review of Articles of Incorporation & Corporate Bylaws', assignedTo: 'Legal Counsel', status: 'verified', critical: false, dueDate: '09/20/2026' },
    { id: '5', category: 'Legal', task: 'Customer Concentration Assessment & Major Client Agreements', assignedTo: 'Legal Counsel', status: 'flagged', critical: true, dueDate: '09/22/2026' },
    { id: '6', category: 'Operations', task: 'Full Capital Equipment Inventory & Appraisal Report', assignedTo: 'Buyer', status: 'verified', critical: false, dueDate: '09/25/2026' },
    { id: '7', category: 'Operations', task: 'Site Lease Assumption Authorization & EPA Clearances', assignedTo: 'Buyer', status: 'pending', critical: false, dueDate: '10/05/2026' },
    { id: '8', category: 'Lending', task: 'SBA Form 1919 submission and Personal Financial Statement (PFS)', assignedTo: 'Buyer', status: 'in_review', critical: true, dueDate: '09/14/2026' },
    { id: '9', category: 'Lending', task: 'Lender Underwriting Authorization & Credit Committee Clearance', assignedTo: 'Lender', status: 'pending', critical: true, dueDate: '10/10/2026' },
  ]);

  // Secure Document Vault State
  const [documents, setDocuments] = useState<DocumentFile[]>([
    { id: 'doc-1', name: 'FY23-25_Tax_Returns_Corporate_Executed.pdf', category: 'Financial', size: '14.2 MB', status: 'Verified', uploadedBy: 'S. Vance (Advisor)', uploadedAt: '2026-09-01 14:32', securityHash: 'fc81...38e1' },
    { id: 'doc-2', name: 'Interim_Q2_2026_YTD_Financials.xlsx', category: 'Financial', size: '4.8 MB', status: 'Pending Review', uploadedBy: 'S. Vance (Advisor)', uploadedAt: '2026-09-10 09:11', securityHash: '2e90...ab4c' },
    { id: 'doc-3', name: 'Executed_LOI_Project_Nova_Signed.pdf', category: 'Legal', size: '2.1 MB', status: 'Verified', uploadedBy: 'M. Chen (Legal)', uploadedAt: '2026-08-28 11:05', securityHash: '739e...92ff' },
    { id: 'doc-4', name: 'Aegis_Escrow_Agreement_Draft_V2.pdf', category: 'Legal', size: '1.9 MB', status: 'Pending Review', uploadedBy: 'M. Chen (Legal)', uploadedAt: '2026-09-11 16:45', securityHash: '8a11...ef21' },
    { id: 'doc-5', name: 'Equipment_Registry_Valuation_Report.pdf', category: 'Operations', size: '22.4 MB', status: 'Verified', uploadedBy: 'A. Miller (Buyer)', uploadedAt: '2026-09-04 15:20', securityHash: 'd3ee...3312' },
    { id: 'doc-6', name: 'Major_Customer_Contracts_Combined.pdf', category: 'Legal', size: '18.1 MB', status: 'Flagged', uploadedBy: 'S. Vance (Advisor)', uploadedAt: '2026-09-02 10:04', securityHash: 'fa22...cd56' },
  ]);

  // Secure Collaboration State
  const [messages, setMessages] = useState<CollabMessage[]>([
    { id: 'm1', sender: 'Sarah Vance', role: 'ADVISOR', text: 'I have uploaded the reconciled Interim YTD spreadsheets to the Vault. Ready for legal assessment.', timestamp: '10:14 AM', secureChannel: true },
    { id: 'm2', sender: 'Mark Chen', role: 'LEGAL', text: 'On it, Sarah. Note that Project Nova has a critical customer representing 38% of total revenue. Working on verifying their contract assignment clause.', timestamp: '10:31 AM', secureChannel: true },
    { id: 'm3', sender: 'Dave Sterling', role: 'LENDER', text: 'SBA Underwriting will require the final QofE analysis before we can issue final Credit Committee approval. Mark, let me know when you clear the key client contract.', timestamp: '11:02 AM', secureChannel: true },
  ]);

  const [newMessage, setNewMessage] = useState('');

  // Calculations for Diligence Health Metrics
  const metrics = useMemo(() => {
    const total = checklist.length;
    const verified = checklist.filter(item => item.status === 'verified').length;
    const pending = checklist.filter(item => item.status === 'pending').length;
    const inReview = checklist.filter(item => item.status === 'in_review').length;
    const flagged = checklist.filter(item => item.status === 'flagged').length;
    
    const progressPercent = total > 0 ? Math.round((verified / total) * 100) : 0;
    const criticalRemaining = checklist.filter(item => item.critical && item.status !== 'verified').length;

    return { total, verified, pending, inReview, flagged, progressPercent, criticalRemaining };
  }, [checklist]);

  // Handler Actions
  const handleToggleStatus = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const statusOrder: ('pending' | 'in_review' | 'verified' | 'flagged')[] = ['pending', 'in_review', 'verified', 'flagged'];
        const nextIndex = (statusOrder.indexOf(item.status) + 1) % statusOrder.length;
        return { ...item, status: statusOrder[nextIndex] };
      }
      return item;
    }));
  };

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg: CollabMessage = {
      id: `m-${Date.now()}`,
      sender: 'Lead Underwriter (You)',
      role: 'BUYER',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      secureChannel: true,
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newDoc: DocumentFile = {
        id: `doc-${Date.now()}`,
        name: file.name,
        category: 'Unclassified',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'Pending Review',
        uploadedBy: 'Lead Underwriter (You)',
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        securityHash: Math.random().toString(16).substr(2, 4) + '...' + Math.random().toString(16).substr(2, 4),
      };
      setDocuments(prev => [newDoc, ...prev]);
    }
  };

  // Filtered Checklist / Document Lists
  const filteredChecklist = useMemo(() => {
    return checklist.filter(item => {
      const matchesSearch = item.task.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [checklist, searchQuery, categoryFilter]);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, categoryFilter]);

  return (
    <div className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] font-sans overflow-hidden">
      
      {/* VDR ACTIVE DEAL HEADER BANNER */}
      <div className="bg-[#090909] border-b border-[#222222] p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
            <span className="font-mono text-[10px] uppercase text-[#0EA5E9] tracking-widest font-bold">SECURE UNDERWRITING DECK &amp; VDR V2.4</span>
          </div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
            {activeDeal.codename} <span className="text-neutral-500">//</span> {activeDeal.loiValue} LOI
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Maturity: <span className="text-[#00FF66]">{activeDeal.targetClosing}</span> | Escrow: {activeDeal.escrowAgent}
          </p>
        </div>

        {/* Security Parameters Badging */}
        <div className="bg-black border border-[#222222] p-4 font-mono text-[10px] space-y-1.5 w-full lg:w-auto min-w-[280px]">
          <div className="flex justify-between">
            <span className="text-neutral-500">HANDSHAKE SIGNATURE:</span>
            <span className="text-[#0EA5E9] font-bold text-right">{activeDeal.secHandshake}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">ENCRYPTION PROTOCOL:</span>
            <span className="text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 border border-[#00FF66]/20 font-bold uppercase">AES-256-GCM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">CONNECTED DELEGATES:</span>
            <span className="text-[#F9F9F9]">Sarah (Adv), Mark (Legal), Dave (Lender)</span>
          </div>
        </div>
      </div>

      {/* DILIGENCE HEALTH GAUGES (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-[#222222] bg-black">
        {/* Progress Tracker */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-[#222222] flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] text-neutral-500 block uppercase tracking-wider">01 / TOTAL DILIGENCE PROGRESS</span>
            <h3 className="text-3xl font-bold font-mono text-[#00FF66] mt-2">{metrics.progressPercent}%</h3>
          </div>
          <div className="w-full bg-neutral-900 h-1.5 rounded-none mt-4 overflow-hidden relative border border-[#222]">
            <div 
              className="bg-[#00FF66] h-full transition-all duration-500" 
              style={{ width: `${metrics.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Underwriting Blockers */}
        <div className="p-6 border-b md:border-b-0 lg:border-r border-[#222222] flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] text-neutral-500 block uppercase tracking-wider">02 / UNRESOLVED FLAG WARNINGS</span>
            <h3 className="text-3xl font-bold font-mono text-[#FF3333] mt-2">
              {metrics.flagged} {metrics.flagged > 0 ? 'ACTIVE' : 'NONE'}
            </h3>
          </div>
          <span className="font-mono text-[9px] text-neutral-400 mt-4 block">
            Requires legal amendment or advisory mitigation.
          </span>
        </div>

        {/* Critical Targets */}
        <div className="p-6 border-b md:border-r border-[#222222] flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] text-neutral-500 block uppercase tracking-wider">03 / CRITICAL LOI DEADLINES</span>
            <h3 className="text-3xl font-bold font-mono text-[#0EA5E9] mt-2">{metrics.criticalRemaining} PENDING</h3>
          </div>
          <span className="font-mono text-[9px] text-[#0ea5e9] mt-4 block">
            Must complete before target close cycle.
          </span>
        </div>

        {/* Secured Vault Density */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] text-neutral-500 block uppercase tracking-wider">04 / VAULT REPOSITORY DENSITY</span>
            <h3 className="text-3xl font-bold font-mono text-[#F9F9F9] mt-2">{documents.length} FILES</h3>
          </div>
          <span className="font-mono text-[9px] text-neutral-400 mt-4 block">
            Plaid & Financial Integrations Validated
          </span>
        </div>
      </div>

      {/* FILTER & CONTROL BAR */}
      <div className="bg-[#080808] border-b border-[#222222] p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Workspace Nav Tabs */}
        <div className="flex bg-black border border-[#222222] p-1 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`flex-grow md:flex-none px-6 py-2 font-mono text-xs font-bold uppercase transition-all ${activeTab === 'checklist' ? 'bg-[#0EA5E9] text-black' : 'text-neutral-400 hover:text-[#F9F9F9]'}`}
          >
            Diligence Checklist
          </button>
          <button 
            onClick={() => setActiveTab('vault')}
            className={`flex-grow md:flex-none px-6 py-2 font-mono text-xs font-bold uppercase transition-all ${activeTab === 'vault' ? 'bg-[#0EA5E9] text-black' : 'text-neutral-400 hover:text-[#F9F9F9]'}`}
          >
            Secure Document Vault
          </button>
          <button 
            onClick={() => setActiveTab('collab')}
            className={`flex-grow md:flex-none px-6 py-2 font-mono text-xs font-bold uppercase transition-all ${activeTab === 'collab' ? 'bg-[#0EA5E9] text-black' : 'text-neutral-400 hover:text-[#F9F9F9]'}`}
          >
            Encryption Collab Stream ({messages.length})
          </button>
        </div>

        {/* Search & Category Inputs */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 items-stretch sm:items-center">
          <input 
            type="text" 
            placeholder="Search diligence items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black border border-[#222222] px-4 py-2 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9] placeholder-neutral-600 rounded-none w-full sm:w-56"
          />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-black border border-[#222222] px-3 py-2 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9] rounded-none cursor-pointer"
          >
            <option value="ALL">All Sectors</option>
            <option value="Financial">Financial</option>
            <option value="Legal">Legal</option>
            <option value="Operations">Operations</option>
            <option value="Lending">Lending Package</option>
          </select>
        </div>
      </div>

      {/* CORE WORKSPACE CONTENT */}
      <div className="bg-[#050505] min-h-[500px]">
        
        {/* TAB 1: DILIGENCE CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#222222] bg-[#090909] text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th className="p-4 pl-6">Core Verification Task</th>
                  <th className="p-4">Sector</th>
                  <th className="p-4">Assignee</th>
                  <th className="p-4">Maturity Date</th>
                  <th className="p-4">Priority Status</th>
                  <th className="p-4 text-right pr-6">Checklist Verification Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredChecklist.map((item) => (
                  <tr key={item.id} className="border-b border-[#222222]/60 hover:bg-[#080808] transition-all group">
                    {/* Task Title & Critical Signifier */}
                    <td className="p-4 pl-6 max-w-sm">
                      <div className="flex items-center space-x-2">
                        {item.critical && (
                          <span className="bg-[#FF3333]/15 text-[#FF3333] border border-[#FF3333]/30 text-[8px] font-bold px-1.5 py-0.5 uppercase flex items-center space-x-1 shrink-0">
                            <span className="w-1.5 h-1.5 bg-[#FF3333] inline-block animate-ping rounded-full"></span>
                            <span>CRITICAL</span>
                          </span>
                        )}
                        <span className="text-[#F9F9F9] font-medium tracking-tight group-hover:text-white">{item.task}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="text-neutral-400 text-[10px] uppercase">{item.category}</span>
                    </td>

                    {/* Delegate / Assignee */}
                    <td className="p-4 text-[#0EA5E9]">
                      <span className="border border-[#0ea5e9]/20 bg-[#0ea5e9]/5 px-2 py-0.5 rounded-none font-bold uppercase text-[9px]">
                        {item.assignedTo}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="p-4 text-neutral-400">
                      {item.dueDate}
                    </td>

                    {/* Priority / Critical Tag */}
                    <td className="p-4">
                      <span className={item.critical ? 'text-[#FF3333]' : 'text-neutral-500'}>
                        {item.critical ? 'BLOCKER / LOI' : 'ROUTINE'}
                      </span>
                    </td>

                    {/* Toggle Interactive Status Trigger */}
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => handleToggleStatus(item.id)}
                        className="inline-flex items-center space-x-2 focus:outline-none select-none"
                      >
                        {item.status === 'verified' && (
                          <span className="bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-[10px] font-bold px-3 py-1 font-mono hover:bg-[#00FF66] hover:text-black transition-all">
                            [ ● SECURE / VERIFIED ]
                          </span>
                        )}
                        {item.status === 'in_review' && (
                          <span className="bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9] text-[10px] font-bold px-3 py-1 font-mono hover:bg-[#0EA5E9] hover:text-black transition-all animate-pulse">
                            [ ▲ IN AUDIT REVIEW ]
                          </span>
                        )}
                        {item.status === 'pending' && (
                          <span className="bg-neutral-950 border border-[#222222] text-neutral-500 text-[10px] font-bold px-3 py-1 font-mono hover:border-neutral-500 hover:text-[#F9F9F9] transition-all">
                            [ ○ PENDING DOCUMENT ]
                          </span>
                        )}
                        {item.status === 'flagged' && (
                          <span className="bg-[#FF3333]/10 border border-[#FF3333]/30 text-[#FF3333] text-[10px] font-bold px-3 py-1 font-mono hover:bg-[#FF3333] hover:text-black transition-all">
                            [ ■ MITIGATION FLAGGED ]
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: SECURE DOCUMENT VAULT */}
        {activeTab === 'vault' && (
          <div className="p-6 space-y-6">
            
            {/* Direct Upload Simulator */}
            <div className="border border-dashed border-[#222222] bg-[#080808] p-8 text-center flex flex-col items-center justify-center space-y-3 hover:border-[#0EA5E9] transition-all">
              <svg className="w-8 h-8 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="space-y-1">
                <p className="font-mono text-xs text-[#F9F9F9] font-semibold">SECURE TRANSACTION FILE REPOSITORY</p>
                <p className="font-mono text-[10px] text-neutral-500">Drag files here to queue AES-256 secure pipeline or select standard load.</p>
              </div>
              <label className="inline-block bg-black border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-[10px] font-bold px-4 py-2 hover:shadow-[0_0_10px_rgba(0,255,102,0.2)] cursor-pointer transition-all uppercase">
                LOAD ASSET DOCUMENTATION
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            {/* Document Listing */}
            <div className="border border-[#222222] bg-black">
              <div className="p-4 border-b border-[#222222] bg-[#090909] flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase text-neutral-400">Vault Assets: Verified In-Network Cryptographic Files</span>
                <span className="font-mono text-[9px] bg-neutral-900 border border-[#222] px-2 py-0.5 text-[#00FF66]">ALL NODES ENCRYPTED</span>
              </div>

              <div className="divide-y divide-[#222222]">
                {filteredDocs.map((doc) => (
                  <div key={doc.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#080808] transition-all">
                    
                    {/* Doc Title & Info */}
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[9px] bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20 px-1.5 py-0.5 uppercase tracking-wider">{doc.category}</span>
                        <span className="font-mono text-xs text-[#F9F9F9] font-semibold break-all">{doc.name}</span>
                      </div>
                      <p className="font-mono text-[9px] text-neutral-500">
                        Uploaded by: {doc.uploadedBy} | Secure Hash: <span className="font-bold text-[#F9F9F9]">{doc.securityHash}</span> | Date: {doc.uploadedAt}
                      </p>
                    </div>

                    {/* Size & Encrypted Verification Tags */}
                    <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                      <span className="font-mono text-xs text-neutral-400">{doc.size}</span>
                      
                      {doc.status === 'Verified' && (
                        <span className="bg-[#00FF66]/15 border border-[#00FF66]/30 text-[#00FF66] font-mono text-[9px] px-2.5 py-1">SECURED &amp; VERIFIED</span>
                      )}
                      {doc.status === 'Pending Review' && (
                        <span className="bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 text-[#0EA5E9] font-mono text-[9px] px-2.5 py-1 animate-pulse">PENDING AUDITING</span>
                      )}
                      {doc.status === 'Flagged' && (
                        <span className="bg-[#FF3333]/15 border border-[#FF3333]/30 text-[#FF3333] font-mono text-[9px] px-2.5 py-1">BLOCKER DETECTED</span>
                      )}

                      {/* Download Hook (Simulated) */}
                      <button className="p-2 border border-[#222] bg-[#090909] hover:border-[#0EA5E9] transition-all">
                        <svg className="w-3.5 h-3.5 text-neutral-400 hover:text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ENCRYPTION COLLAB STREAM */}
        {activeTab === 'collab' && (
          <div className="p-6 space-y-6">
            
            <div className="border border-[#222222] bg-black flex flex-col h-[500px]">
              {/* Terminal Secure Badge */}
              <div className="p-4 border-b border-[#222222] bg-[#0c0c0c] flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-2.5 h-2.5 bg-[#00FF66] rounded-full animate-ping"></span>
                  <span className="font-mono text-[10px] text-[#F9F9F9] tracking-wider uppercase">VDR SECURE ENCRYPTED ROOM CHAT</span>
                </div>
                <span className="font-mono text-[9px] text-[#888]">KEY AGENT PIPELINE: SECURE-SH-24</span>
              </div>

              {/* Chat Feed */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="border border-[#1a1a1a] bg-[#080808] p-3.5 font-mono">
                    <div className="flex justify-between items-center mb-1.5 border-b border-[#1a1a1a] pb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase ${
                          msg.role === 'ADVISOR' ? 'bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20' :
                          msg.role === 'LEGAL' ? 'bg-[#FF3333]/10 text-[#FF3333] border border-[#FF3333]/20' :
                          msg.role === 'LENDER' ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20' :
                          'bg-neutral-800 text-neutral-300'
                        }`}>
                          {msg.role}
                        </span>
                        <span className="text-xs font-bold text-[#F9F9F9]">{msg.sender}</span>
                      </div>
                      <span className="text-[9px] text-neutral-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">{msg.text}</p>
                    
                    {msg.secureChannel && (
                      <div className="mt-2 pt-1.5 border-t border-[#111] flex items-center space-x-1.5 text-[8px] text-neutral-500 uppercase">
                        <span className="w-1.5 h-1.5 bg-[#00FF66] rounded-full"></span>
                        <span>END-TO-END ENCRYPTED DECK CHIP VIA SH-24</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Message Entry Formulation */}
              <form onSubmit={handleAddMessage} className="p-4 border-t border-[#222222] bg-[#0a0a0a] flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Formulate secure advisory transmission... Type message and press ENTER"
                  className="flex-grow bg-black border border-[#222] px-4 py-3 text-xs font-mono text-[#F9F9F9] placeholder-neutral-600 focus:outline-none focus:border-[#0EA5E9] rounded-none"
                />
                <button 
                  type="submit"
                  className="bg-transparent border border-[#00FF66] text-[#00FF66] px-6 py-3 font-mono text-xs font-bold uppercase hover:bg-[#00FF66] hover:text-black transition-all"
                >
                  TRANSMIT
                </button>
              </form>
            </div>

            {/* Disclaimer under collab */}
            <p className="font-mono text-[9px] text-neutral-600 leading-tight">
              NOTICE: All discussions held in the Encryption Collab Stream are permanently archived onto secure cryptographic transaction logs for regulatory SBA underwriting submission audits.
            </p>

          </div>
        )}

      </div>

      {/* FOOTER METRICS AND SECURITY ADVISORY STATUS */}
      <div className="bg-[#090909] border-t border-[#222222] px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-neutral-500 gap-2">
        <span>SECURITY ENFORCED UNDER ADVISORY NETWORK SH-883</span>
        <span className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00FF66]"></span>
          <span className="text-[#00FF66] font-bold">ALL DILIGENCE VAULT INFRASTRUCTURE CRYPTOGRAPHICALLY SECURED</span>
        </span>
      </div>

    </div>
  );
}