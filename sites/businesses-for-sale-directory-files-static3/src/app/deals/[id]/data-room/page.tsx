```tsx
'use client';

import React, { useState, useEffect } from 'react';

interface Adjustment {
  id: string;
  name: string;
  amount: number;
  type: 'addback' | 'deduction';
  category: string;
  checked: boolean;
  notes: string;
}

interface AuditLog {
  timestamp: string;
  event: string;
  operator: string;
  ip: string;
  hash: string;
}

export default function DataRoomPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Safe dynamic parameters resolution
  const resolvedParams = React.use ? React.use(params as Promise<{ id: string }>) : (params as { id: string });
  const dealId = (resolvedParams?.id || 'PROJECT-DELTA').toUpperCase().replace('-', ' ');

  // Live Clock
  const [currentTime, setCurrentTime] = useState('12:00:00');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Workspace Tabs
  const [activeTab, setActiveTab] = useState<'recon' | 'qofe' | 'org' | 'vault'>('recon');

  // Interactive Tax Return & EBITDA Reconciler State
  const [baseNetIncome, setBaseNetIncome] = useState<number>(384500);
  const [askingPrice] = useState<number>(1850000);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([
    { id: '1', name: 'Seller Discretionary Officer Compensation', amount: 150000, type: 'addback', category: 'W2 Add-back', checked: true, notes: 'Owner market replacement rate modeled at $75k. Net addback is surplus compensation.' },
    { id: '2', name: 'Personal Auto Lease & Insurance Expense', amount: 18500, type: 'addback', category: 'Travel/Auto', checked: true, notes: 'Non-operating vehicle lease and auto-related travel cards.' },
    { id: '3', name: 'One-time ERP Migration & Cloud Implementation', amount: 42000, type: 'addback', category: 'CapEx/SaaS', checked: false, notes: 'Transition to automated inventory system completed Q3 2023.' },
    { id: '4', name: 'Non-operating Patent Litigation Settlement', amount: 25000, type: 'addback', category: 'Legal', checked: true, notes: 'Dispute over geographic trademark settled with prejudice.' },
    { id: '5', name: 'Unrealized Post-Close Staff Synergies', amount: 65000, type: 'addback', category: 'HR Optimization', checked: false, notes: 'Redundant dispatch role following buyer technology assimilation.' },
    { id: '6', name: 'Estimated Capital Expenditure Requirement', amount: 35000, type: 'deduction', category: 'Maintenance CapEx', checked: false, notes: 'Routine fleet diagnostic hardware updates projected for Q2.' }
  ]);

  // Document Vault State
  const [decryptedFiles, setDecryptedFiles] = useState<string[]>([]);
  const [decryptingFileId, setDecryptingFileId] = useState<string | null>(null);
  const [decryptionProgress, setDecryptionProgress] = useState(0);

  // Simulated live audit log tracking searcher interactions
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { timestamp: '12:04:12', event: 'CLEAN ROOM INTERFACE INITIALIZED', operator: 'SYS_DAEMON', ip: '108.162.19.41', hash: 'e3b0c442...' },
    { timestamp: '12:04:15', event: 'DECRYPTION KEY EXCHANGE - COMPLIANT WITH SECTOR-1031', operator: 'ID-7922', ip: '108.162.19.41', hash: 'f87a31b4...' },
    { timestamp: '12:05:01', event: 'INITIALIZED CIM RECONCILER MODULE', operator: 'ID-7922', ip: '108.162.19.41', hash: '8e2d44a2...' }
  ]);

  // Add event to audit log helper
  const addAuditLog = (event: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    const newLog: AuditLog = {
      timestamp: time,
      event: event,
      operator: 'ID-7922',
      ip: '108.162.19.41',
      hash: Math.random().toString(16).substring(2, 10) + '...'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Toggle adjustment handler
  const handleToggleAdjustment = (id: string) => {
    const target = adjustments.find(a => a.id === id);
    if (!target) return;
    const nextChecked = !target.checked;
    
    setAdjustments(adjustments.map(adj => adj.id === id ? { ...adj, checked: nextChecked } : adj));
    addAuditLog(`TOGGLED ADJUSTMENT: [${target.name}] -> ${nextChecked ? 'ENABLED' : 'DISABLED'}`);
  };

  // Custom Adjustment Generator
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customType, setCustomType] = useState<'addback' | 'deduction'>('addback');
  const [customCategory, setCustomCategory] = useState('Miscellaneous');

  const handleAddCustomAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customAmount) return;
    const amountVal = parseFloat(customAmount);
    if (isNaN(amountVal)) return;

    const newAdj: Adjustment = {
      id: Date.now().toString(),
      name: customName,
      amount: amountVal,
      type: customType,
      category: customCategory,
      checked: true,
      notes: 'User defined ad-hoc underwriting adjustment.'
    };

    setAdjustments([...adjustments, newAdj]);
    addAuditLog(`INJECTED USER ADD-BACK: [${customName}] - $${amountVal.toLocaleString()}`);
    setCustomName('');
    setCustomAmount('');
  };

  // Dynamic Math Calculations
  const calculatedEbitda = adjustments.reduce((acc, curr) => {
    if (!curr.checked) return acc;
    if (curr.type === 'addback') {
      return acc + curr.amount;
    } else {
      return acc - curr.amount;
    }
  }, baseNetIncome);

  const impliedMultiple = askingPrice / calculatedEbitda;

  // File Decryption Simulated Loop
  const triggerDecryption = (fileName: string, fileId: string) => {
    if (decryptedFiles.includes(fileId) || decryptingFileId) return;

    setDecryptingFileId(fileId);
    setDecryptionProgress(0);
    addAuditLog(`INITIATED DECRYPTION PROTOCOL FOR [${fileName}]`);

    const interval = setInterval(() => {
      setDecryptionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDecryptedFiles((prevDecrypted) => [...prevDecrypted, fileId]);
          setDecryptingFileId(null);
          addAuditLog(`DECRYPTION COMPLETED & VERIFIED: [${fileName}] SHA-256 MATCHED`);
          return 0;
        }
        return prev + 25;
      });
    }, 150);
  };

  // Formatting utility
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F9F9F9] font-sans antialiased flex flex-col selection:bg-[#00FF66] selection:text-black">
      {/* Forcing strictly hard corners matching original project layout */}
      <style dangerouslySetInnerHTML={{__html: `
        * { border-radius: 0px !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #222; }
        ::-webkit-scrollbar-thumb:hover { background: #0EA5E9; }
      `}} />

      {/* 1. TOP GLOBAL DECRYPTION TICKER BAR */}
      <header className="w-full bg-black border-b border-[#222] z-50 sticky top-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#111] text-[10px] font-mono tracking-widest text-[#888]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-[#0EA5E9] font-semibold">
              <span className="inline-block w-2 h-2 mr-2 bg-[#0EA5E9] animate-pulse"></span>
              CIM CLEAN ROOM SESSION: ENCRYPTED PORTAL ACTIVE
            </span>
            <span className="hidden md:inline text-[#222]">|</span>
            <span className="hidden md:inline">AUDIT CAPTURED ON ACTION</span>
            <span className="hidden md:inline text-[#222]">|</span>
            <span className="hidden md:inline text-[#FF3333]">WARNING: ALL DOWNLOADS WATERMARKED WITH PUBLIC IP</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>SECURE CLOCK: <span className="text-white font-bold">{currentTime}</span></span>
            <span className="text-[#00FF66]">OPERATOR: #ETA-7922</span>
          </div>
        </div>

        {/* Master Branding Row */}
        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#050505] via-[#090909] to-[#050505]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#0EA5E9] text-black text-[10px] font-mono font-black px-1.5 py-0.5 tracking-tighter">DATA VAULT</span>
              <span className="text-[10px] font-mono text-[#00FF66] tracking-widest font-bold">SECURE UNDERWRITING LEVEL-3</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
              {dealId} <span className="text-[#0EA5E9]">&rarr;</span> SECURE UNDERWRITING VAULT
            </h1>
            <p className="text-xs text-[#888] font-mono mt-0.5">Interactive Quality of Earnings Audit & Verified Due Diligence Room.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a 
              href="/"
              className="border border-[#222] hover:border-[#444] text-[#888] hover:text-[#F9F9F9] font-mono text-xs px-4 py-2.5 transition-all text-center"
            >
              &larr; BACK TO TERMINAL
            </a>
            <button 
              onClick={() => {
                addAuditLog("INITIATED MASTER DATA PACK DOWNLOAD REQUEST");
                alert("Master Underwriting Package requested. Encryption authorization logged to audit chain.");
              }}
              className="bg-[#00FF66] text-black font-mono text-xs font-bold px-4 py-2.5 hover:bg-white transition-all"
            >
              REQUEST OFFLINE EXCEL STACK
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#222]">
        
        {/* LEFT RAIL: Document Inventory Index */}
        <aside className="lg:col-span-3 bg-[#080808] border-r border-[#222] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
                VERIFIED INDEX V2.1
              </h2>
              <p className="text-[10px] text-[#444] font-mono uppercase mt-1">Audit status: Clean Certification</p>
            </div>

            {/* Document List */}
            <div className="space-y-3">
              <label className="block font-mono text-[10px] text-[#888] tracking-widest uppercase">Verified Dossiers</label>
              
              <div className="space-y-2">
                {[
                  { id: 'cim', title: 'Comprehensive Information Memo', size: '14.2 MB', ext: 'PDF' },
                  { id: 'tax', title: 'Tax Returns (2021-2023) - Verified IRS', size: '28.5 MB', ext: 'PDF' },
                  { id: 'qofe_xls', title: 'QofE Underlying Reconciliation Model', size: '4.8 MB', ext: 'XLSX' },
                  { id: 'org_tree', title: 'Redacted W2 Org-Structure Matrix', size: '1.2 MB', ext: 'PDF' },
                  { id: 'leases', title: 'Commercial Real Estate Lease Agreements', size: '8.9 MB', ext: 'PDF' },
                ].map((file) => {
                  const isDecrypted = decryptedFiles.includes(file.id);
                  const isDecrypting = decryptingFileId === file.id;

                  return (
                    <div 
                      key={file.id} 
                      className={`p-3 border font-mono transition-all relative ${
                        isDecrypted 
                          ? 'border-[#00FF66]/40 bg-[#00FF66]/5' 
                          : 'border-[#222] bg-[#050505]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[8px] px-1 py-0.2 font-bold ${
                            file.ext === 'XLSX' ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'bg-[#0EA5E9]/20 text-[#0EA5E9]'
                          }`}>{file.ext}</span>
                          <h4 className="text-[11px] text-white font-bold mt-1 leading-snug">{file.title}</h4>
                          <span className="text-[9px] text-[#444] block mt-0.5">{file.size} • SHA-256 Auth Verified</span>
                        </div>
                      </div>

                      {/* Action trigger button */}
                      <div className="mt-3">
                        {isDecrypted ? (
                          <div className="flex space-x-2">
                            <span className="text-[9px] text-[#00FF66] font-bold flex items-center gap-1 bg-[#00FF66]/10 px-2 py-1 w-full">
                              <span className="inline-block w-1.5 h-1.5 bg-[#00FF66] animate-pulse"></span>
                              DECRYPTED
                            </span>
                            <button 
                              onClick={() => {
                                addAuditLog(`OPENED SECURE PDF VIEWER FOR [${file.title}]`);
                                alert(`Viewing secure sandbox browser for: ${file.title}`);
                              }}
                              className="text-[9px] bg-[#0EA5E9] hover:bg-[#F9F9F9] text-black font-bold px-2 py-1 transition-all"
                            >
                              OPEN
                            </button>
                          </div>
                        ) : isDecrypting ? (
                          <div className="w-full bg-[#111] border border-[#222] h-6 relative overflow-hidden flex items-center justify-center">
                            <div 
                              className="absolute top-0 left-0 bottom-0 bg-[#0EA5E9]/20 transition-all duration-150"
                              style={{ width: `${decryptionProgress}%` }}
                            ></div>
                            <span className="text-[9px] font-bold text-[#0EA5E9] z-10 animate-pulse">
                              DECRYPTING {decryptionProgress}%
                            </span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => triggerDecryption(file.title, file.id)}
                            className="w-full border border-[#222] hover:border-[#0EA5E9] hover:text-[#0EA5E9] text-[#888] text-[10px] py-1 transition-all bg-[#0a0a0a] uppercase tracking-wider"
                          >
                            Decrypt Vault File
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Lock / Purge Clean Room */}
            <div className="p-3 bg-red-950/10 border border-[#FF3333]/30 font-mono text-center">
              <div className="text-[9px] text-[#FF3333] font-bold tracking-wider">SECURE EMERGENCY PURGE</div>
              <p className="text-[9px] text-[#888] mt-1 leading-relaxed">
                Immediately drops connection, revokes local cache, and wipes decryption authorization keys instantly.
              </p>
              <button 
                onClick={() => {
                  setDecryptedFiles([]);
                  addAuditLog("EMERGENCY PURGE INITIATED - REVOKED ALL LOCAL KEYS");
                  alert("Session Wiped. All security keys purged from cache.");
                }}
                className="mt-2.5 w-full bg-[#FF3333]/20 hover:bg-[#FF3333] hover:text-white border border-[#FF3333] text-[#FF3333] text-[9px] py-1.5 font-bold transition-all uppercase tracking-widest"
              >
                EXECUTE PURGE
              </button>
            </div>
          </div>

          <div className="border-t border-[#1a1a1a] pt-4 text-[9px] font-mono text-[#444] space-y-1">
            <div>GATEWAY PROTOCOL: TLS_AES_256_GCM</div>
            <div>COMPLIANCE ID: SEC-1031-ETA</div>
            <div>VERIFICATION IP: 108.162.19.41</div>
          </div>
        </aside>

        {/* CENTER INTERACTIVE WORKSPACE */}
        <section className="lg:col-span-9 bg-[#050505] p-6 flex flex-col space-y-6">
          
          {/* Internal Navigation Tabs */}
          <div className="flex flex-wrap border-b border-[#222]">
            <button 
              onClick={() => { setActiveTab('recon'); addAuditLog("SWITCHED TAB TO: RECONCILER"); }}
              className={`px-4 py-3 font-mono text-xs tracking-wider transition-all border-t border-r ${
                activeTab === 'recon' 
                  ? 'border-[#0EA5E9] text-[#0EA5E9] bg-[#0a0a0a] font-bold border-l border-l-[#222]' 
                  : 'border-[#222] text-[#888] hover:text-[#F9F9F9] hover:bg-[#0a0a0a]'
              }`}
            >
              1. TAX RECON & EBITDA RECONCILER
            </button>
            <button 
              onClick={() => { setActiveTab('qofe'); addAuditLog("SWITCHED TAB TO: QOFE BRIDGE"); }}
              className={`px-4 py-3 font-mono text-xs tracking-wider transition-all border-t border-r ${
                activeTab === 'qofe' 
                  ? 'border-[#0EA5E9] text-[#0EA5E9] bg-[#0a0a0a] font-bold' 
                  : 'border-[#222] text-[#888] hover:text-[#F9F9F9] hover:bg-[#0a0a0a]'
              }`}
            >
              2. QofE ADJUSTMENT BRIDGE
            </button>
            <button 
              onClick={() => { setActiveTab('org'); addAuditLog("SWITCHED TAB TO: REDACTED ORG TREE"); }}
              className={`px-4 py-3 font-mono text-xs tracking-wider transition-all border-t border-r ${
                activeTab === 'org' 
                  ? 'border-[#0EA5E9] text-[#0EA5E9] bg-[#0a0a0a] font-bold' 
                  : 'border-[#222] text-[#888] hover:text-[#F9F9F9] hover:bg-[#0a0a0a]'
              }`}
            >
              3. REDACTED ORG TREE
            </button>
          </div>

          {/* TAB 1: TAX RECON & FINANCIAL RECONCILER */}
          {activeTab === 'recon' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Dynamic Live Calculations Banner */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#222] border border-[#222] font-mono">
                <div className="bg-[#0c0c0c] p-4 text-center">
                  <span className="block text-[8px] text-[#888] tracking-widest uppercase">Base Net Tax Income</span>
                  <div className="text-sm font-bold text-white mt-1">
                    {formatCurrency(baseNetIncome)}
                  </div>
                </div>
                <div className="bg-[#0c0c0c] p-4 text-center">
                  <span className="block text-[8px] text-[#888] tracking-widest uppercase">Verified Adjusted EBITDA</span>
                  <div className="text-base font-bold text-[#00FF66] mt-1">
                    {formatCurrency(calculatedEbitda)}
                  </div>
                </div>
                <div className="bg-[#0c0c0c] p-4 text-center">
                  <span className="block text-[8px] text-[#888] tracking-widest uppercase">Implied Enterprise Multiple</span>
                  <div className="text-base font-bold text-[#0EA5E9] mt-1">
                    {impliedMultiple.toFixed(2)}x
                  </div>
                </div>
                <div className="bg-[#0c0c0c] p-4 text-center">
                  <span className="block text-[8px] text-[#888] tracking-widest uppercase">Implied Asking Price</span>
                  <div className="text-sm font-bold text-[#FF3333] mt-1">
                    {formatCurrency(askingPrice)}
                  </div>
                </div>
              </div>

              {/* Interactive adjustments table */}
              <div className="border border-[#222]">
                <div className="p-3 bg-[#0a0a0a] border-b border-[#222] flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-[#0EA5E9]">UNDERWRITING LEDGER & RECONCILIATION KEYS</span>
                  <span className="text-[10px] font-mono text-[#888] uppercase">Interactive Simulator</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[#222] bg-[#0c0c0c] text-[#888]">
                        <th className="p-3 text-[10px] font-normal tracking-wider uppercase">Applied</th>
                        <th className="p-3 text-[10px] font-normal tracking-wider uppercase">Adjustment Item Description</th>
                        <th className="p-3 text-[10px] font-normal tracking-wider uppercase">Category</th>
                        <th className="p-3 text-[10px] font-normal tracking-wider uppercase">Type</th>
                        <th className="p-3 text-[10px] font-normal tracking-wider uppercase text-right">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111]">
                      {adjustments.map((adj) => (
                        <tr 
                          key={adj.id} 
                          onClick={() => handleToggleAdjustment(adj.id)}
                          className={`hover:bg-[#0c0c0c]/80 cursor-pointer transition-colors ${
                            adj.checked ? 'bg-[#080808]' : 'opacity-40'
                          }`}
                        >
                          <td className="p-3">
                            <div className="flex items-center">
                              <span className={`w-3.5 h-3.5 border flex items-center justify-center mr-2 ${
                                adj.checked ? 'border-[#00FF66] bg-[#00FF66]/20' : 'border-[#444]'
                              }`}>
                                {adj.checked && <span className="w-1.5 h-1.5 bg-[#00FF66]"></span>}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-white font-bold block">{adj.name}</span>
                            <span className="text-[10px] text-[#888] mt-0.5 block">{adj.notes}</span>
                          </td>
                          <td className="p-3 text-[#888]">{adj.category}</td>
                          <td className="p-3">
                            <span className={`text-[9px] px-1.5 py-0.5 tracking-wider font-bold ${
                              adj.type === 'addback' ? 'bg-[#00FF66]/10 text-[#00FF66]' : 'bg-[#FF3333]/10 text-[#FF3333]'
                            }`}>
                              {adj.type.toUpperCase()}
                            </span>
                          </td>
                          <td className={`p-3 text-right font-bold ${
                            adj.type === 'addback' ? 'text-[#00FF66]' : 'text-[#FF3333]'
                          }`}>
                            {adj.type === 'addback' ? '+' : '-'}{formatCurrency(adj.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Custom Adjustment Form */}
              <div className="border border-[#222] p-4 bg-[#080808]">
                <h4 className="font-mono text-xs font-bold text-[#F9F9F9] tracking-wider uppercase mb-3">
                  Inject Pro-Forma Adjustment Option
                </h4>
                <form onSubmit={handleAddCustomAdjustment} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[9px] text-[#888] font-mono tracking-widest uppercase mb-1">Adjustment Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Non-recurring legal fees"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] text-xs font-mono text-white p-2 placeholder:text-[#444] outline-none focus:border-[#0EA5E9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-[#888] font-mono tracking-widest uppercase mb-1">Amount ($)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] text-xs font-mono text-white p-2 placeholder:text-[#444] outline-none focus:border-[#0EA5E9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-[#888] font-mono tracking-widest uppercase mb-1">Adjustment Type</label>
                    <select 
                      value={customType} 
                      onChange={(e) => setCustomType(e.target.value as 'addback' | 'deduction')}
                      className="w-full bg-[#050505] border border-[#222] text-xs font-mono text-white p-2 outline-none focus:border-[#0EA5E9]"
                    >
                      <option value="addback">ADD-BACK (+)</option>
                      <option value="deduction">DEDUCTION (-)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="submit" 
                      className="w-full bg-[#0EA5E9] hover:bg-white text-black font-mono text-xs font-bold py-2 px-4 transition-all uppercase"
                    >
                      Inject Add-back
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* TAB 2: QUALITY OF EARNINGS BRIDGE CHART */}
          {activeTab === 'qofe' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="border border-[#222] p-4 bg-[#080808]">
                <h3 className="font-mono text-xs font-bold text-[#0EA5E9] tracking-widest uppercase mb-1">Quality of Earnings Walk & Multiple Bridge</h3>
                <p className="text-xs text-[#888] font-mono">Simulated reconciliation sequence demonstrating systemic transition from Base Net Income to Adjusted EBITDA.</p>
              </div>

              {/* Visual Quality of Earnings Walk Stack */}
              <div className="border border-[#222] p-6 space-y-6 bg-[#0a0a0a]">
                <div className="space-y-4">
                  
                  {/* Base Bar */}
                  <div>
                    <div className="flex justify-between font-mono text-xs mb-1">
                      <span>1. Tax Return Reported Net Income</span>
                      <span className="font-bold text-white">{formatCurrency(baseNetIncome)}</span>
                    </div>
                    <div className="w-full bg-[#111] h-3">
                      <div className="bg-[#888] h-full" style={{ width: `${(baseNetIncome / calculatedEbitda) * 100}%` }}></div>
                    </div>
                  </div>

                  {/* Addback items loop */}
                  {adjustments.filter(a => a.checked).map((adj) => {
                    const adjustmentPercentage = (adj.amount / calculatedEbitda) * 100;
                    return (
                      <div key={adj.id}>
                        <div className="flex justify-between font-mono text-xs mb-1">
                          <span className="text-[#888]">
                            &rarr; Plus: {adj.name} <span className="text-[10px] text-[#444]">({adj.category})</span>
                          </span>
                          <span className={`font-bold ${adj.type === 'addback' ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                            {adj.type === 'addback' ? '+' : '-'}{formatCurrency(adj.amount)}
                          </span>
                        </div>
                        <div className="w-full bg-[#111] h-2">
                          <div 
                            className={`h-full ${adj.type === 'addback' ? 'bg-[#00FF66]/60' : 'bg-[#FF3333]/60'}`} 
                            style={{ width: `${Math.min(100, adjustmentPercentage)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Calculated End State */}
                  <div className="pt-4 border-t border-[#222]">
                    <div className="flex justify-between font-mono text-sm mb-1">
                      <span className="text-[#0EA5E9] font-bold">2. Verified Adjusted QofE EBITDA</span>
                      <span className="font-extrabold text-[#00FF66]">{formatCurrency(calculatedEbitda)}</span>
                    </div>
                    <div className="w-full bg-[#111] h-4">
                      <div className="bg-[#00FF66] h-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Advisory note */}
              <div className="p-4 bg-red-950/10 border border-[#FF3333]/30 text-xs font-mono text-[#888] leading-relaxed">
                <span className="text-[#FF3333] font-bold">UNDERWRITER ADVISORY:</span> Adjusting the add-backs affects the final multiple. 
                A multiple variance of more than <span className="text-white font-bold">0.5x</span> can represent substantial risk discrepancy 
                relative to the industry benchmark standard of <span className="text-[#0EA5E9]">3.15x</span>.
              </div>

            </div>
          )}

          {/* TAB 3: REDACTED ORG TREE */}
          {activeTab === 'org' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="border border-[#222] p-4 bg-[#080808]">
                <h3 className="font-mono text-xs font-bold text-[#0EA5E9] tracking-widest uppercase mb-1">Blinded Employee Hierarchy & Operations Infrastructure</h3>
                <p className="text-xs text-[#888] font-mono">Structural breakdown of roles and tenures. Salaries and identifiers have been masked for legal preservation.</p>
              </div>

              {/* Org Tree Map (Simulated Terminal Tree structure) */}
              <div className="border border-[#222] p-6 bg-[#0a0a0a] font-mono text-xs leading-relaxed overflow-x-auto">
                <div className="text-white font-bold">[ROOT DIRECTORY] • CURRENT OPERATING TRUSTEES</div>
                
                <div className="mt-4 space-y-4 text-[#888]">
                  <div>
                    <div className="text-white font-semibold">└── General Manager / Chief of Logistics (Owner)</div>
                    <div className="pl-6 text-[10px] text-[#444]">
                      Tenure: 12 Years | Compensation: <span className="text-[#FF3333] blur-[3px]">CONFIDENTIAL</span> (See add-back Compensations)
                    </div>
                    
                    <div className="pl-6 mt-2 space-y-3">
                      <div>
                        <div className="text-[#0EA5E9]">├── Ops Node 01: Fleet Operations & Dispatch Manager</div>
                        <div className="pl-6 text-[10px] text-[#444]">
                          Tenure: 4 Years | Direct Reports: 12 Drivers | Compensation: $72,500/yr (Base) + Performance Bonus
                        </div>
                        
                        <div className="pl-6 mt-1 text-[#666]">
                          <div>├── [Blinded Driver Group - Redacted Sector A] (6 Crew members)</div>
                          <div>└── [Blinded Driver Group - Redacted Sector B] (6 Crew members)</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[#0EA5E9]">├── Ops Node 02: Fleet Maintenance & Onsite Supervisor</div>
                        <div className="pl-6 text-[10px] text-[#444]">
                          Tenure: 7 Years | Lead mechanic certification | Compensation: $68,000/yr (Base)
                        </div>
                        <div className="pl-6 mt-1 text-[#666]">
                          └── Apprentice Tech / Shop Support (1 Crew member)
                        </div>
                      </div>

                      <div>
                        <div className="text-[#0EA5E9]">└── Ops Node 03: Lead Finance Administrator & Billing Coordinator</div>
                        <div className="pl-6 text-[10px] text-[#444]">
                          Tenure: 3.5 Years | Fully remote structure in place | Compensation: $52,000/yr
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Simulated Interaction to download raw payroll details */}
                <div className="mt-6 pt-6 border-t border-[#222] flex justify-between items-center">
                  <span className="text-[10px] text-[#444]">AUTHORIZED OPERATORS CAN UNLOCK PRE-CLOSE PAYROLL LEDGER</span>
                  <button 
                    onClick={() => {
                      addAuditLog("REQUESTED REVEAL OF BLINDED ORG TREE COMPENSATIONS");
                      alert("Compensations unmask requested. Security logs updated with high severity audit marker.");
                    }}
                    className="border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/10 text-[10px] px-3 py-1.5 font-mono uppercase font-bold"
                  >
                    Request Unmasked Ledger Access
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: DIRECT SECURE VAULT LOGS / META */}
          <div className="border border-[#222]">
            <div className="p-3 bg-[#0a0a0a] border-b border-[#222] flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-[#FF3333] flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-[#FF3333] animate-pulse"></span>
                LIVE GATEWAY AUDIT SYSTEM LOG (AUTO-GENERATED)
              </span>
              <span className="text-[9px] text-[#888]">TRACKING CURRENT SESSION</span>
            </div>

            <div className="p-4 bg-black font-mono text-[10px] text-[#888] space-y-1 max-h-48 overflow-y-auto">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="flex flex-col md:flex-row justify-between border-b border-[#111] pb-1">
                  <span className="text-[#00FF66]">
                    [{log.timestamp}] - {log.event}
                  </span>
                  <div className="flex space-x-2 text-right">
                    <span>IP: {log.ip}</span>
                    <span className="text-white/40">SHA-256: {log.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      {/* FOOTER & TRUST BAR */}
      <footer className="bg-black border-t border-[#222] mt-auto">
        <div className="px-6 py-4 border-b border-[#222] grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66]"></span>
            <span>DATA LOCK CERTIFIED</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#0EA5E9]"></span>
            <span>FINCEN REGULATORY AUDITED</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-white"></span>
            <span>SECURE TERMINATION ACTIVE</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-white/50">
            <span className="inline-block w-2.5 h-2.5 bg-[#FF3333]"></span>
            <span>SHA-256 HANDSHAKE VALID</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 text-[11px] font-mono text-[#888] leading-relaxed space-y-4">
          <p>
            <span className="text-[#F9F9F9] font-bold">Audit and Privacy Notice:</span> All access keys, calculations, and interactions in this CIM Data Room are logged live. Any modifications in the interactive reconcilers are calculated dynamically in local sandbox session scopes and do not alter official SEC filing histories. Unauthorized distribution of information in this vault is strictly prosecutable under legal compliance frameworks.
          </p>
          <div className="flex justify-between items-center text-[9px] text-neutral-600 border-t border-[#111] pt-4">
            <span>&copy; {new Date().getFullYear()} ACQUIRE-NET DATA VAULT SYSTEMS. ALL PROTOCOLS RECORDED.</span>
            <span>CLEAN-ROOM VERSION V2.14-SECURE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
```