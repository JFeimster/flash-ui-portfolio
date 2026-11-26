import React, { useState, useEffect } from 'react';

// Interfaces for structured data
interface Adjustment {
  id: string;
  label: string;
  value: number;
  category: 'Owner Comp' | 'Personal Expense' | 'One-Time Cost' | 'Synergies' | 'Market Rent';
  description: string;
  active: boolean;
}

interface OrgNode {
  id: string;
  role: string;
  codename: string;
  salary: number;
  tenure: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  retained: boolean;
  subordinates?: OrgNode[];
}

interface DocumentFile {
  id: string;
  name: string;
  category: 'Tax' | 'Financials' | 'Legal' | 'Operational';
  fileSize: string;
  encryptedHash: string;
  downloadCount: number;
}

interface AuditEvent {
  timestamp: string;
  operatorId: string;
  action: string;
  ip: string;
  status: 'SUCCESS' | 'WARNING' | 'DECRYPTED';
}

export default function QofEBridgeChart() {
  // Current Time State (matching system clock style)
  const [currentTime, setCurrentTime] = useState('12:00:00');
  
  // Interactive QofE Adjustments State
  const [reportedEbitda] = useState(620000);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([
    { id: 'adj-1', label: 'Excess Owner Salary Normalization', value: 140000, category: 'Owner Comp', description: 'Replaced working owner with general manager market salary of $85k.', active: true },
    { id: 'adj-2', label: 'Discretionary Personal Auto & Travel', value: 28500, category: 'Personal Expense', description: 'Owner personal vehicle leases and discretionary travel booked through business.', active: true },
    { id: 'adj-3', label: 'One-Time ERP Software Transition', value: 45000, category: 'One-Time Cost', description: 'Non-recurring capital outlay for proprietary CRM migration in FY23.', active: true },
    { id: 'adj-4', label: 'Above-Market Warehouse Lease Adjustment', value: -32000, category: 'Market Rent', description: 'Deduction: Current lease is above standard local comps; will renew lower post-close.', active: false },
    { id: 'adj-5', label: 'Redundant Post-Acquisition Admin Synergy', value: 65000, category: 'Synergies', description: 'Integration synergy eliminating third-party remote billing software duplicate service.', active: false },
  ]);

  // Tax Reconciliation Inputs
  const [taxNetIncome, setTaxNetIncome] = useState(480000);
  const [taxDepreciation, setTaxDepreciation] = useState(55000);
  const [taxAmortization, setTaxAmortization] = useState(12000);
  const [taxInterest, setTaxInterest] = useState(24000);
  const [taxNonDeductible, setTaxNonDeductible] = useState(8500);

  // Selected Org Node State
  const [selectedNode, setSelectedNode] = useState<string | null>('node-owner');

  // Encryption Portal Search / Category
  const [docCategory, setDocCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Realtime Live Audit Log state
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([
    { timestamp: '12:00:15', operatorId: '#ETA-7922', action: 'DECRYPT_FILE: FY23_QofE_Bridge_Ledger.pdf', ip: '184.22.109.81', status: 'DECRYPTED' },
    { timestamp: '12:01:42', operatorId: '#ETA-7922', action: 'QUERY_TAX_RECONCILIATION: Form 1120S vs Books', ip: '184.22.109.81', status: 'SUCCESS' },
    { timestamp: '12:03:02', operatorId: '#ETA-7922', action: 'ACCESS_REDACTED_ORG_TREE: Leaf Level Node Trigger', ip: '184.22.109.81', status: 'SUCCESS' },
  ]);

  // Clock tick effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Log action simulator helper
  const addAuditLog = (action: string, status: 'SUCCESS' | 'WARNING' | 'DECRYPTED' = 'SUCCESS') => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const newLog: AuditEvent = {
      timestamp,
      operatorId: '#ETA-7922',
      action,
      ip: '184.22.109.81',
      status
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 9)]);
  };

  // Dynamic QofE calculations
  const toggleAdjustment = (id: string) => {
    setAdjustments(prev => prev.map(adj => {
      if (adj.id === id) {
        const nextState = !adj.active;
        addAuditLog(`${nextState ? 'ENABLE' : 'DISABLE'}_QofE_ADJUSTMENT: ${adj.label}`, 'SUCCESS');
        return { ...adj, active: nextState };
      }
      return adj;
    }));
  };

  const getActiveAdjustmentsSum = () => {
    return adjustments
      .filter(adj => adj.active)
      .reduce((sum, adj) => sum + adj.value, 0);
  };

  const getAdjustedEbitda = () => {
    return reportedEbitda + getActiveAdjustmentsSum();
  };

  // Document Database
  const documents: DocumentFile[] = [
    { id: 'doc-1', name: 'FY23 Phase 1 Quality of Earnings (QofE) Report.pdf', category: 'Financials', fileSize: '4.8 MB', encryptedHash: 'SHA256: 8a4c8f...9e21', downloadCount: 14 },
    { id: 'doc-2', name: 'Form 1120S Tax Returns (3 Year Consolidated)_REDACTED.pdf', category: 'Tax', fileSize: '12.4 MB', encryptedHash: 'SHA256: 3d11b2...239a', downloadCount: 8 },
    { id: 'doc-3', name: 'Redacted Customer Concentration Master Ledger.xlsx', category: 'Operational', fileSize: '1.2 MB', encryptedHash: 'SHA256: f1aa2d...e001', downloadCount: 22 },
    { id: 'doc-4', name: 'Vendor Master SLA Agreement & Contingency Schedule.pdf', category: 'Legal', fileSize: '3.1 MB', encryptedHash: 'SHA256: c3b2a8...7b8c', downloadCount: 5 },
    { id: 'doc-5', name: 'Facility Sub-Lease Appraisal & Est. Rent Normalization Study.pdf', category: 'Financials', fileSize: '1.9 MB', encryptedHash: 'SHA256: 4eef33...33aa', downloadCount: 2 }
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesCat = docCategory === 'ALL' || doc.category === docCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Derived Tax Book Reconciliation
  const calculatedTaxEbitda = taxNetIncome + taxDepreciation + taxAmortization + taxInterest + taxNonDeductible;

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-sans antialiased border border-[#222] min-h-screen flex flex-col p-4 md:p-8 space-y-8 select-none">
      
      {/* 1. SECTION HEADER BRANDING */}
      <div className="border-b border-[#222] pb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#0EA5E9] text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-tighter">SECURE CLEAN ROOM</span>
            <span className="text-[10px] font-mono text-[#00FF66] tracking-widest font-bold">V-UNDERWRITE v4.12</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-[#F9F9F9] mt-1 uppercase">
            Financial Underwriting Vault <span className="text-[#0EA5E9]">&</span> Real-Time QofE Desk
          </h1>
          <p className="text-xs text-[#888] font-mono mt-0.5">Simulated secure clean-room for deep diligence verification of PROJECT DELTA.</p>
        </div>

        {/* Security Parameters Display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[#222] text-left font-mono text-[10px] w-full lg:w-auto">
          <div className="bg-[#0c0c0c] p-2 px-3">
            <span className="block text-[#888] text-[8px] uppercase">Audit Logging</span>
            <span className="text-[#00FF66] font-bold">ACTIVE (SHA-256)</span>
          </div>
          <div className="bg-[#0c0c0c] p-2 px-3">
            <span className="block text-[#888] text-[8px] uppercase">Active Session</span>
            <span className="text-[#0EA5E9]" x-text="currentTime">{currentTime}</span>
          </div>
          <div className="bg-[#0c0c0c] p-2 px-3 col-span-2 sm:col-span-1">
            <span className="block text-[#888] text-[8px] uppercase">Vault Integrity</span>
            <span className="text-white">99.998% SECURE</span>
          </div>
        </div>
      </div>

      {/* 2. THREE-PANEL CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: INTERACTIVE QofE BRIDGE CHART & RECONCILIATIONS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          
          {/* A. Dynamic Quality of Earnings (QofE) Reconciliations Block */}
          <div className="bg-[#080808] border border-[#222] p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#00FF66] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#00FF66]"></span>
                QUALITY OF EARNINGS (QofE) EBITDA RECONCILIATION BRIDGE
              </h2>
              <span className="text-[10px] font-mono text-[#888] bg-[#111] px-2 py-0.5 border border-[#222]">
                SIMULATED MODEL
              </span>
            </div>

            {/* Simulated Waterfall Chart */}
            <div className="bg-black p-4 border border-[#111] space-y-6">
              <div className="text-[10px] font-mono text-[#888] tracking-wider uppercase mb-2">Adjusted EBITDA Waterfall Projection</div>
              
              <div className="relative h-48 flex items-end justify-between px-2 pt-6">
                
                {/* Visual Grid Lines */}
                <div className="absolute inset-x-0 top-1/4 border-t border-[#1a1a1a] border-dashed"></div>
                <div className="absolute inset-x-0 top-2/4 border-t border-[#1a1a1a] border-dashed"></div>
                <div className="absolute inset-x-0 top-3/4 border-t border-[#1a1a1a] border-dashed"></div>

                {/* Bar 1: Base Reported EBITDA */}
                <div className="flex flex-col items-center flex-1 z-10">
                  <span className="text-[10px] font-mono text-white mb-1">${(reportedEbitda / 1000).toFixed(0)}K</span>
                  <div className="w-12 bg-white/40 border border-white/60 hover:bg-white/50 transition-colors" style={{ height: '70px' }}></div>
                  <span className="text-[8px] font-mono text-neutral-500 mt-2 text-center uppercase tracking-tighter leading-tight">Reported<br/>EBITDA</span>
                </div>

                {/* Intermediate Adjustment Bars */}
                {adjustments.map((adj, idx) => {
                  const isActive = adj.active;
                  const isPositive = adj.value > 0;
                  const heightVal = Math.max(10, Math.min(80, Math.abs(adj.value) / 2000));
                  
                  return (
                    <div key={adj.id} className="flex flex-col items-center flex-1 z-10 transition-opacity duration-300" style={{ opacity: isActive ? 1 : 0.25 }}>
                      <span className={`text-[10px] font-mono mb-1 ${isPositive ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                        {isPositive ? '+' : ''}${(adj.value / 1000).toFixed(1)}K
                      </span>
                      <div 
                        onClick={() => toggleAdjustment(adj.id)}
                        className={`w-12 border cursor-pointer transition-all duration-150 hover:scale-105 ${
                          isPositive 
                            ? 'bg-[#00FF66]/20 border-[#00FF66]/60 hover:bg-[#00FF66]/30' 
                            : 'bg-[#FF3333]/20 border-[#FF3333]/60 hover:bg-[#FF3333]/30'
                        }`} 
                        style={{ height: `${heightVal}px` }}
                        title={`${adj.label}: Click to toggle`}
                      ></div>
                      <span className="text-[8px] font-mono text-neutral-500 mt-2 text-center uppercase tracking-tighter leading-tight">
                        ADJ #{idx + 1}
                      </span>
                    </div>
                  );
                })}

                {/* Bar 3: Adjusted EBITDA (Final result) */}
                <div className="flex flex-col items-center flex-1 z-10">
                  <span className="text-[10px] font-mono text-[#00FF66] font-bold mb-1">${(getAdjustedEbitda() / 1000).toFixed(1)}K</span>
                  <div className="w-12 bg-[#00FF66]/30 border-2 border-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.15)]" style={{ height: `${(getAdjustedEbitda() / 620000) * 70}px` }}></div>
                  <span className="text-[8px] font-mono text-[#00FF66] font-bold mt-2 text-center uppercase tracking-tighter leading-tight">Adjusted<br/>QofE</span>
                </div>

              </div>

              {/* Dynamic Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#222] border border-[#222]">
                <div className="bg-[#050505] p-3 text-center">
                  <span className="block text-[8px] font-mono text-neutral-500 uppercase">BASE DECLARED RUN-RATE</span>
                  <span className="text-sm font-mono text-white font-bold">${reportedEbitda.toLocaleString()}</span>
                </div>
                <div className="bg-[#050505] p-3 text-center">
                  <span className="block text-[8px] font-mono text-neutral-500 uppercase">ACTIVE EBITDA ADD-BACKS</span>
                  <span className="text-sm font-mono text-[#0EA5E9] font-bold">
                    {getActiveAdjustmentsSum() >= 0 ? '+' : ''}${getActiveAdjustmentsSum().toLocaleString()}
                  </span>
                </div>
                <div className="bg-[#050505] p-3 text-center bg-gradient-to-r from-black via-[#080c08] to-black">
                  <span className="block text-[8px] font-mono text-[#00FF66] font-bold uppercase">ADJUSTED QofE EBITDA</span>
                  <span className="text-sm font-mono text-[#00FF66] font-black">${getAdjustedEbitda().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Add-back Selection Checkbox Mechanics */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-[#888] tracking-widest uppercase">Include / Exclude Reconciliation Levers</div>
              <div className="space-y-1.5">
                {adjustments.map(adj => (
                  <div 
                    key={adj.id} 
                    onClick={() => toggleAdjustment(adj.id)}
                    className={`flex items-start justify-between p-3 border cursor-pointer transition-all ${
                      adj.active 
                        ? 'border-[#0ea5e9]/40 bg-[#0ea5e9]/5 text-white' 
                        : 'border-[#222] bg-[#050505] text-[#888] hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3 max-w-[80%]">
                      <div className="mt-0.5">
                        <div className={`w-3.5 h-3.5 border flex items-center justify-center ${adj.active ? 'border-[#0EA5E9] bg-[#0EA5E9]' : 'border-neutral-700 bg-black'}`}>
                          {adj.active && <span className="text-[9px] text-black font-black">✓</span>}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold block">{adj.label}</span>
                        <p className="text-[10px] font-mono text-neutral-500 mt-0.5 leading-tight">{adj.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold block ${adj.value > 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                        {adj.value > 0 ? '+' : ''}${adj.value.toLocaleString()}
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-neutral-600 block uppercase mt-0.5">{adj.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* B. TAX RETURN RECONCILIATION INTEGRATION */}
          <div className="bg-[#080808] border border-[#222] p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#0ea5e9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0ea5e9]"></span>
                TAX RETURN TO FINANCIAL BOOK RECONCILIATION
              </h2>
              <span className="text-[9px] font-mono text-neutral-500 uppercase">FORM 1120S VERIFIED SEC-179</span>
            </div>

            <p className="text-[11px] font-mono text-[#888] leading-relaxed">
              Standardized adjustments mapping reported Federal tax return line items to structural business management books. Verify non-deductible items.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              
              <div className="bg-black p-2.5 border border-[#222]">
                <label className="block text-[8px] font-mono text-[#888] uppercase mb-1">Tax Ordinary Income</label>
                <input 
                  type="number" 
                  value={taxNetIncome}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTaxNetIncome(val);
                    addAuditLog(`UPDATE_TAX_NET_INCOME: $${val.toLocaleString()}`, 'SUCCESS');
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2 focus:outline-none"
                />
              </div>

              <div className="bg-black p-2.5 border border-[#222]">
                <label className="block text-[8px] font-mono text-[#888] uppercase mb-1">Add: Depreciation</label>
                <input 
                  type="number" 
                  value={taxDepreciation}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTaxDepreciation(val);
                    addAuditLog(`UPDATE_TAX_DEPRECIATION: $${val.toLocaleString()}`, 'SUCCESS');
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2 focus:outline-none"
                />
              </div>

              <div className="bg-black p-2.5 border border-[#222]">
                <label className="block text-[8px] font-mono text-[#888] uppercase mb-1">Add: Amortization</label>
                <input 
                  type="number" 
                  value={taxAmortization}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTaxAmortization(val);
                    addAuditLog(`UPDATE_TAX_AMORTIZATION: $${val.toLocaleString()}`, 'SUCCESS');
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2 focus:outline-none"
                />
              </div>

              <div className="bg-black p-2.5 border border-[#222]">
                <label className="block text-[8px] font-mono text-[#888] uppercase mb-1">Add: Interest Expense</label>
                <input 
                  type="number" 
                  value={taxInterest}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTaxInterest(val);
                    addAuditLog(`UPDATE_TAX_INTEREST: $${val.toLocaleString()}`, 'SUCCESS');
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2 focus:outline-none"
                />
              </div>

              <div className="bg-black p-2.5 border border-[#222]">
                <label className="block text-[8px] font-mono text-[#888] uppercase mb-1">Non-Deductibles</label>
                <input 
                  type="number" 
                  value={taxNonDeductible}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTaxNonDeductible(val);
                    addAuditLog(`UPDATE_TAX_NON_DEDUCTIBLE: $${val.toLocaleString()}`, 'SUCCESS');
                  }}
                  className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2 focus:outline-none"
                />
              </div>

            </div>

            <div className="bg-black p-4 border border-[#222] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs text-neutral-400">
                Calculated Reconciliation EBITDA based on inputs above:
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-mono text-xl text-[#0ea5e9] font-black">${calculatedTaxEbitda.toLocaleString()}</span>
                <span className="text-[10px] font-mono bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 px-2 py-0.5 uppercase">
                  RECONCILED TO MANAGEMENT BOOKS
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: ORG TREE & ENCRYPTED PORTAL WITH LOGS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* C. REDACTED EMPLOYEE ORG TREE */}
          <div className="bg-[#080808] border border-[#222] p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#FF3333] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#FF3333]"></span>
                REDACTED EMPLOYEE ORGANIZATIONAL TREE
              </h2>
              <span className="text-[9px] font-mono text-red-400 font-bold bg-[#FF3333]/10 px-1.5 py-0.5 border border-[#FF3333]/20 uppercase">
                CONFIDENTIAL
              </span>
            </div>

            <p className="text-[11px] font-mono text-[#888] leading-relaxed">
              Click individual nodes to examine operational risk vectors, compensation structures, and post-sale retention parameters.
            </p>

            {/* Tree Layout Structure */}
            <div className="bg-black p-4 border border-[#111] space-y-4">
              
              {/* Level 1: Root Node */}
              <div className="flex justify-center">
                <button 
                  onClick={() => { setSelectedNode('node-owner'); addAuditLog('SELECT_ORG_NODE: Owner/CEO', 'SUCCESS'); }}
                  className={`px-4 py-2 text-center font-mono text-xs border transition-all ${
                    selectedNode === 'node-owner' 
                      ? 'border-[#FF3333] bg-[#FF3333]/10 text-[#FF3333] font-bold' 
                      : 'border-[#222] text-[#888] hover:border-neutral-500'
                  }`}
                >
                  <span className="block text-[8px] text-neutral-500">LEVEL 1 - FOUNDER</span>
                  [REDACTED - CEO]
                  <span className="block text-[9px] text-[#00FF66] mt-0.5">$185k Base</span>
                </button>
              </div>

              {/* Vertical Branch Lines */}
              <div className="flex justify-center -my-2">
                <div className="w-px h-6 bg-[#222]"></div>
              </div>

              {/* Horizontal Branch Connector & Level 2 Nodes */}
              <div className="relative border-t border-[#222] pt-4 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { setSelectedNode('node-ops'); addAuditLog('SELECT_ORG_NODE: Ops Manager', 'SUCCESS'); }}
                  className={`px-2 py-1.5 text-center font-mono text-xs border transition-all ${
                    selectedNode === 'node-ops' 
                      ? 'border-[#0EA5E9] bg-[#0EA5E9]/10 text-[#0EA5E9] font-bold' 
                      : 'border-[#222] text-[#888] hover:border-neutral-500'
                  }`}
                >
                  <span className="block text-[8px] text-neutral-500">LEVEL 2 - MANAGING</span>
                  [REDACTED - OPS DIR]
                  <span className="block text-[8px] text-neutral-600 mt-0.5">Tenure: 4.8 Years</span>
                </button>

                <button 
                  onClick={() => { setSelectedNode('node-tech'); addAuditLog('SELECT_ORG_NODE: Tech Lead', 'SUCCESS'); }}
                  className={`px-2 py-1.5 text-center font-mono text-xs border transition-all ${
                    selectedNode === 'node-tech' 
                      ? 'border-[#0ea5e9] bg-[#0ea5e9]/10 text-[#0ea5e9] font-bold' 
                      : 'border-[#222] text-[#888] hover:border-neutral-500'
                  }`}
                >
                  <span className="block text-[8px] text-neutral-500">LEVEL 2 - TECHNICAL</span>
                  [REDACTED - LEAD DEV]
                  <span className="block text-[8px] text-neutral-600 mt-0.5">Key Person Risk</span>
                </button>
              </div>

              {/* Vertical Branch Lines Down */}
              <div className="flex justify-around px-12 -my-2">
                <div className="w-px h-6 bg-[#222]"></div>
                <div className="w-px h-6 bg-[#222]"></div>
              </div>

              {/* Level 3: Ground Staff */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="border border-dashed border-[#222] p-2 text-center">
                  <span className="block text-[8px] font-mono text-neutral-600">LEVEL 3 - BACKOFFICE</span>
                  <span className="text-[10px] font-mono text-neutral-500">[REDACTED (x2 Staff)]</span>
                </div>
                <div className="border border-dashed border-[#222] p-2 text-center">
                  <span className="block text-[8px] font-mono text-neutral-600">LEVEL 3 - LOGISTICS TECHS</span>
                  <span className="text-[10px] font-mono text-neutral-500">[REDACTED (x5 Crew)]</span>
                </div>
              </div>

            </div>

            {/* Selected Node Details Desk */}
            <div className="bg-black border border-[#222] p-4 font-mono space-y-3">
              <span className="text-[9px] text-[#888] uppercase tracking-wider block border-b border-[#222] pb-1">
                Security Profile & Compensation Metrics
              </span>
              
              {selectedNode === 'node-owner' && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span>Designation:</span> <span className="text-white font-bold">Founder / Executive President</span></div>
                  <div className="flex justify-between"><span>Annual Comp:</span> <span className="text-[#00FF66]">$185,000 + Distribution</span></div>
                  <div className="flex justify-between"><span>Replacement GM Cost:</span> <span className="text-[#0EA5E9]">$85,000 (Accounted in QofE)</span></div>
                  <div className="flex justify-between"><span>Post-Sale Transition:</span> <span className="text-white">12 Months Dedicated Agreement</span></div>
                  <div className="flex justify-between"><span>Key Person Risk:</span> <span className="text-[#FF3333] font-bold">CRITICAL / EXTREME</span></div>
                </div>
              )}

              {selectedNode === 'node-ops' && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span>Designation:</span> <span className="text-white font-bold">Operations Director / Hub Mgr</span></div>
                  <div className="flex justify-between"><span>Annual Comp:</span> <span className="text-[#00FF66]">$92,000 (Fully W2-loaded)</span></div>
                  <div className="flex justify-between"><span>Incentive Structure:</span> <span className="text-white">Quarterly Performance Bonus</span></div>
                  <div className="flex justify-between"><span>Pre-Sale Tenure:</span> <span className="text-[#0EA5E9]">4.8 Years In-Office</span></div>
                  <div className="flex justify-between"><span>Post-Sale Retention:</span> <span className="text-[#00FF66] font-bold">STAYING / SIGNED NDA</span></div>
                  <div className="flex justify-between"><span>Key Person Risk:</span> <span className="text-[#0EA5E9] font-bold">LOW (Well Documented SOPs)</span></div>
                </div>
              )}

              {selectedNode === 'node-tech' && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span>Designation:</span> <span className="text-white font-bold">Lead Dispatch Systems Engineer</span></div>
                  <div className="flex justify-between"><span>Annual Comp:</span> <span className="text-[#00FF66]">$110,000 (W2 Contracted)</span></div>
                  <div className="flex justify-between"><span>Pre-Sale Tenure:</span> <span className="text-white">3.1 Years Remote</span></div>
                  <div className="flex justify-between"><span>Transition Protocol:</span> <span className="text-amber-500 font-semibold">Requires Retention Clause</span></div>
                  <div className="flex justify-between"><span>Key Person Risk:</span> <span className="text-amber-500 font-bold">MEDIUM / HIGH</span></div>
                </div>
              )}
            </div>

          </div>

          {/* D. ENCRYPTED DATA PORTAL & REALTIME LOGS */}
          <div className="bg-[#080808] border border-[#222] p-6 space-y-4">
            
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
                <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
                ENCRYPTED DOCUMENT VAULT PORTAL
              </h2>
              <span className="text-[9px] font-mono text-[#0EA5E9] bg-[#0ea5e9]/10 px-2 py-0.5 border border-[#0ea5e9]/20 uppercase">
                AES-256
              </span>
            </div>

            {/* Live Filter Controls */}
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'Financials', 'Tax', 'Legal', 'Operational'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setDocCategory(cat); addAuditLog(`FILTER_VAULT_CATEGORY: ${cat}`, 'SUCCESS'); }}
                  className={`px-2 py-1 text-[9px] font-mono border transition-all ${
                    docCategory === cat 
                      ? 'border-[#0ea5e9] bg-[#0ea5e9]/10 text-[#0ea5e9] font-bold' 
                      : 'border-[#222] text-neutral-500 hover:border-neutral-700'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Simple Search */}
            <input 
              type="text"
              placeholder="Search secure documents..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                addAuditLog(`QUERY_VAULT_SEARCH: "${e.target.value}"`, 'SUCCESS');
              }}
              className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-[11px] font-mono text-white p-2 placeholder:text-neutral-700 outline-none"
            />

            {/* Document List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredDocs.map(doc => (
                <div key={doc.id} className="bg-black p-3 border border-[#222] hover:border-[#0EA5E9] transition-all group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-mono text-[#0EA5E9] block uppercase tracking-wider">{doc.category}</span>
                      <span className="text-xs font-mono font-bold text-white group-hover:text-[#0EA5E9] transition-colors line-clamp-1">{doc.name}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-[#111] flex justify-between items-center text-[9px] font-mono text-neutral-500">
                    <span>{doc.fileSize}</span>
                    <span>{doc.encryptedHash}</span>
                  </div>

                  <button 
                    onClick={() => {
                      alert(`Decrypting ${doc.name} and logging operator access authorization.`);
                      addAuditLog(`DECRYPT_AND_DOWNLOAD_FILE: ${doc.name}`, 'DECRYPTED');
                    }}
                    className="w-full mt-2 bg-[#111] border border-[#222] hover:bg-[#0EA5E9] hover:text-black hover:border-[#0EA5E9] py-1.5 text-center font-mono text-[9px] tracking-wider uppercase transition-all"
                  >
                    REQUEST DECRYPTION KEY
                  </button>
                </div>
              ))}

              {filteredDocs.length === 0 && (
                <div className="border border-dashed border-[#222] py-8 text-center">
                  <p className="text-[10px] font-mono text-neutral-600 uppercase">No matching files found inside vault.</p>
                </div>
              )}
            </div>

            {/* Audit Log tracking visual panel */}
            <div className="pt-2 border-t border-[#222]">
              <span className="text-[8px] font-mono tracking-widest text-[#FF3333] font-bold block mb-1.5">
                [LIVE OPERATOR COMPLIANCE AUDIT LOGS]
              </span>
              <div className="bg-black border border-[#222] p-2.5 h-36 overflow-y-auto font-mono text-[9px] space-y-1.5">
                {auditLogs.map((log, index) => (
                  <div key={index} className="flex items-start justify-between border-b border-[#111] pb-1">
                    <span className="text-neutral-500 shrink-0">[{log.timestamp}]</span>
                    <span className={`px-1.5 truncate max-w-[60%] ${
                      log.status === 'DECRYPTED' ? 'text-[#FF3333] font-bold' : 'text-neutral-400'
                    }`}>
                      {log.action}
                    </span>
                    <span className={`text-[8px] font-bold shrink-0 ${
                      log.status === 'DECRYPTED' ? 'text-[#FF3333]' : 'text-[#00FF66]'
                    }`}>
                      [{log.status}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3. FINAL COMPLIANCE STITCH */}
      <div className="bg-[#080808] border border-[#222] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-[10px] font-mono text-neutral-500">
          <span className="inline-block w-2 h-2 bg-[#00FF66]"></span>
          <span>SECURE AUDIT PIPELINE CONNECTED — ALL DISCLOSURES ENFORCED UNDER THE SECURITIES ACT OF 1933</span>
        </div>
        <button 
          onClick={() => {
            alert('Compiling comprehensive QofE Bridge report package...');
            addAuditLog('COMPILE_COMPLETE_DILIGENCE_REPORT: Project Delta Vault', 'SUCCESS');
          }}
          className="bg-[#00FF66] hover:bg-white text-black font-mono text-xs font-bold px-4 py-2.5 tracking-wider uppercase transition-all"
        >
          GENERATE CERTIFIED UNDERWRITING BUNDLE
        </button>
      </div>

    </div>
  );
}