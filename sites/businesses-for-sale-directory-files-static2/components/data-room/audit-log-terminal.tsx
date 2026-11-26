```tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';

// Interfaces for Audit Log Engine
interface AuditLog {
  id: string;
  timestamp: string;
  category: 'ACCESS' | 'DOCUMENT' | 'UNDERWRITING' | 'LEGAL' | 'COMPLIANCE';
  actor: string;
  action: string;
  target: string;
  ip: string;
  hash: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL' | 'INFO';
  diligencePhase: string;
}

interface ActiveCollaborator {
  id: string;
  name: string;
  role: string;
  agency: string;
  status: 'ACTIVE' | 'IDLE' | 'OFFLINE';
  secureToken: string;
}

export default function AuditLogTerminal() {
  // Mock Data: Secure VDR Active Members
  const [collaborators] = useState<ActiveCollaborator[]>([
    { id: '1', name: 'Marcus Vance', role: 'Lead Underwriter', agency: 'Apex SBA Funding', status: 'ACTIVE', secureToken: 'SBA-992-TX' },
    { id: '2', name: 'Sophia Chen', role: 'M&A Counsel', agency: 'Kirkland Partners LLC', status: 'ACTIVE', secureToken: 'LEGAL-044-NY' },
    { id: '3', name: 'Devon Keats', role: 'Buy-Side Sponsor', agency: 'AcquireMeta (You)', status: 'ACTIVE', secureToken: 'ACQ-311-MAIN' },
    { id: '4', name: 'Elias Thorne', role: 'Seller Representative', agency: 'Thorne Logistics Hub', status: 'IDLE', secureToken: 'SELL-801-MW' },
  ]);

  // Initial Audit Logs
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: "log-1",
      timestamp: "2026-03-31T14:45:21Z",
      category: "DOCUMENT",
      actor: "Sophia Chen (M&A Counsel)",
      action: "Uploaded Final LOI Execution Copy Schedule A",
      target: "Project_Delta_Executed_LOI_v4.pdf",
      ip: "107.23.44.102",
      hash: "8ae09f61b0c966a6a12b21c43b90df71efc5b78f99e8d1234a49c25679901ad4",
      status: "SUCCESS",
      diligencePhase: "LOI Executed"
    },
    {
      id: "log-2",
      timestamp: "2026-03-31T14:41:05Z",
      category: "UNDERWRITING",
      actor: "Marcus Vance (SBA Underwriter)",
      action: "Authorized Pre-Underwriting Debt Capacity Analysis",
      target: "P&L Statements (FY22-FY25)",
      ip: "198.162.2.45",
      hash: "ca83a123f11a43b22101e4a2e58a2d3345a31b22e1a2f90a90df123493dfaa91",
      status: "INFO",
      diligencePhase: "SBA Debt Sizing"
    },
    {
      id: "log-3",
      timestamp: "2026-03-31T14:38:12Z",
      category: "ACCESS",
      actor: "Elias Thorne (Seller Rep)",
      action: "Decrypted VDR Folder Access Protocol",
      target: "Corporate Tax Returns (Form 1120S)",
      ip: "74.125.19.147",
      hash: "4f8a129d2b2c3a3b4f5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
      status: "SUCCESS",
      diligencePhase: "Quality of Earnings"
    },
    {
      id: "log-4",
      timestamp: "2026-03-31T14:22:50Z",
      category: "COMPLIANCE",
      actor: "Security Engine (System Audit)",
      action: "Detected Unregistered Access Attempt (Geographic Drift)",
      target: "Secure Tunnel Route IP: 185.220.101.4",
      ip: "185.220.101.4",
      hash: "b6f8a3c4d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5",
      status: "CRITICAL",
      diligencePhase: "System Firewall"
    },
    {
      id: "log-5",
      timestamp: "2026-03-31T13:05:14Z",
      category: "LEGAL",
      actor: "Sophia Chen (M&A Counsel)",
      action: "Revised Non-Compete Geographical Bounds Draft",
      target: "Restructured_Bylaws_Ex10.2.docx",
      ip: "107.23.44.102",
      hash: "cf31a20b0c966a6a12b21c43b90df71efc5b78f99e8d1234a49c25679901ad89",
      status: "WARNING",
      diligencePhase: "Definitive Agreement"
    },
    {
      id: "log-6",
      timestamp: "2026-03-31T11:58:32Z",
      category: "DOCUMENT",
      actor: "Devon Keats (Acquirer)",
      action: "Modified SBA Equity Injection Allocation Matrix",
      target: "Project_Delta_Capital_Stack_Model.xlsx",
      ip: "192.168.10.12",
      hash: "d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8",
      status: "SUCCESS",
      diligencePhase: "LOI Executed"
    }
  ]);

  // Terminal & VDR States
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cmdInput, setCmdInput] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(logs[0]);
  const [isSecureTunnelActive, setIsSecureTunnelActive] = useState<boolean>(true);
  const [logDetailsOpen, setLogDetailsOpen] = useState<boolean>(true);

  // Auto-Scroll Terminal Ref
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Generate Simulated Action Log on interval
  useEffect(() => {
    const actions = [
      { actor: "Marcus Vance (SBA Underwriter)", action: "Requested clarifying schedule C line 14 deductions", target: "Tax_Returns_Clarification.pdf", category: "UNDERWRITING" as const, status: "INFO" as const },
      { actor: "Elias Thorne (Seller Rep)", action: "Uploaded verified physical inventory list (Schedule B)", target: "Inventory_Valuation_Audit.csv", category: "DOCUMENT" as const, status: "SUCCESS" as const },
      { actor: "System Audit", action: "Completed SHA-256 validation of multi-site operations data", target: "Facility_Appraisal_Report_V3.pdf", category: "COMPLIANCE" as const, status: "SUCCESS" as const },
      { actor: "Sophia Chen (M&A Counsel)", action: "Edited post-closing accounts receivable working capital target", target: "Purchase_Agreement_Draft_Clean.docx", category: "LEGAL" as const, status: "WARNING" as const }
    ];

    const interval = setInterval(() => {
      if (!isSecureTunnelActive) return;

      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomIP = `192.168.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
      const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: randomAction.category,
        actor: randomAction.actor,
        action: randomAction.action,
        target: randomAction.target,
        ip: randomIP,
        hash: randomHash,
        status: randomAction.status,
        diligencePhase: "Diligence Phase 2"
      };

      setLogs(prev => [newLog, ...prev]);
    }, 25000); // add a new log every 25 seconds for dynamic terminal feel

    return () => clearInterval(interval);
  }, [isSecureTunnelActive]);

  // Handle manual terminal commands
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const input = cmdInput.trim();
    setCmdInput('');

    // Handle interactive mock commands
    let mockResponseLog: AuditLog;

    if (input.toLowerCase() === 'help') {
      mockResponseLog = {
        id: `cmd-help-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "COMPLIANCE",
        actor: "System Shell Interface",
        action: "COMMAND EXECUTION: HELP [Avail: /upload, /audit, /lock, /clear]",
        target: "System Help Matrix",
        ip: "127.0.0.1",
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status: "INFO",
        diligencePhase: "Console Utilities"
      };
    } else if (input.startsWith('/upload')) {
      const fileName = input.split(' ')[1] || 'unnamed_document.pdf';
      mockResponseLog = {
        id: `cmd-upload-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "DOCUMENT",
        actor: "Devon Keats (Acquirer)",
        action: `MANUAL FORCE UPLOAD: ${fileName}`,
        target: fileName,
        ip: "192.168.10.12",
        hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: "SUCCESS",
        diligencePhase: "VDR Ingestion"
      };
    } else if (input.toLowerCase() === '/lock') {
      setIsSecureTunnelActive(false);
      mockResponseLog = {
        id: `cmd-lock-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "COMPLIANCE",
        actor: "Security Engine (Kill-Switch)",
        action: "VDR LOG ARCHIVE LOCKED. AUTO-STREAM DISABLED.",
        target: "Virtual Data Room Tunnel Lockout",
        ip: "127.0.0.1",
        hash: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        status: "CRITICAL",
        diligencePhase: "Incident Protocol"
      };
    } else if (input.toLowerCase() === '/unlock') {
      setIsSecureTunnelActive(true);
      mockResponseLog = {
        id: `cmd-unlock-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "COMPLIANCE",
        actor: "Security Engine (Auth)",
        action: "VDR LOG ARCHIVE ENCRYPTED TUNNEL SECURED. AUTO-STREAM RESTORED.",
        target: "Virtual Data Room Tunnel Re-establish",
        ip: "127.0.0.1",
        hash: "0000000000000000000000000000000000000000000000000000000000000000",
        status: "SUCCESS",
        diligencePhase: "Authentication"
      };
    } else {
      // General entry
      mockResponseLog = {
        id: `cmd-msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "LEGAL",
        actor: "Devon Keats (Acquirer)",
        action: `Secured Communication: "${input}"`,
        target: "VDR Secured Multi-Party Feed",
        ip: "192.168.10.12",
        hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: "SUCCESS",
        diligencePhase: "Acquisitions Collaboration"
      };
    }

    setLogs(prev => [mockResponseLog, ...prev]);
    setSelectedLog(mockResponseLog);
  };

  // Filter logs based on query and selected filter
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
      const matchesSearch = log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            log.diligencePhase.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [logs, selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] border border-[#222222] font-sans flex flex-col glow-copper overflow-hidden">
      {/* 1. Header: VDR Security Controls */}
      <div className="border-b border-[#222222] bg-[#090909] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#FF3333] inline-block opacity-70"></span>
            <span className="w-3 h-3 rounded-full bg-[#EAB308] inline-block opacity-70"></span>
            <span className="w-3 h-3 rounded-full bg-[#00FF66] inline-block opacity-70"></span>
          </div>
          <div className="h-5 w-px bg-[#222]"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] uppercase text-[#0EA5E9] tracking-widest font-bold">SECURE CHANNEL // AUDIT LOG V2.0</span>
              <span className={`inline-block w-2 h-2 rounded-full ${isSecureTunnelActive ? 'bg-[#00FF66] animate-pulse' : 'bg-[#FF3333]'}`}></span>
            </div>
            <h2 className="text-sm font-mono tracking-tight font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>PROJECT DELTA</span>
              <span className="text-[#888] font-normal text-xs">/ Underwriting VDR Cryptographic Ledger</span>
            </h2>
          </div>
        </div>

        {/* Security Tunnel Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-black border border-[#1b1b1b] px-3 py-1 flex items-center space-x-2 font-mono text-[10px] tracking-wide text-[#888]">
            <span>HASH PROTOCOL:</span>
            <span className="text-[#00FF66] font-bold">SHA-256</span>
          </div>
          <div className="bg-black border border-[#1b1b1b] px-3 py-1 flex items-center space-x-2 font-mono text-[10px] tracking-wide text-[#888]">
            <span>TUNNEL STATUS:</span>
            <span className={isSecureTunnelActive ? "text-[#00FF66] font-bold" : "text-[#FF3333] font-bold"}>
              {isSecureTunnelActive ? "ENCRYPTED" : "LOCKED"}
            </span>
          </div>
          <button 
            onClick={() => setIsSecureTunnelActive(!isSecureTunnelActive)}
            className={`border px-3 py-1 font-mono text-[10px] font-bold transition-all ${
              isSecureTunnelActive 
                ? 'border-[#FF3333] text-[#FF3333] hover:bg-[#FF3333]/10' 
                : 'border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/10'
            }`}
          >
            {isSecureTunnelActive ? '[ FORCE SHUTDOWN ]' : '[ INITIALIZE TUNNEL ]'}
          </button>
        </div>
      </div>

      {/* 2. Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
        
        {/* Left Column (3/12): VDR Directory & Active Collaborators */}
        <div className="lg:col-span-3 border-r border-[#222222] bg-[#080808] p-4 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* VDR Targets Info Box */}
            <div className="bg-black border border-[#1b1b1b] p-3 space-y-2">
              <p className="font-mono text-[8px] text-[#666] tracking-widest uppercase">TRANSACTION OVERVIEW</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888]">TARGET DESTRUCT:</span>
                  <span className="text-[#F9F9F9]">PROJECT DELTA</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888]">EST. TRANSACTION:</span>
                  <span className="text-[#00FF66]">$1,800,000</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888]">STAGE / PHASE:</span>
                  <span className="text-[#0EA5E9] font-semibold">LOI // DUE DILIGENCE</span>
                </div>
              </div>
            </div>

            {/* Active Secure Signatures Directory */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-[9px] uppercase text-[#888] tracking-widest font-bold">VDR ACCESS SHELL DIRECTORY</h3>
                <span className="font-mono text-[8px] text-[#00FF66]">{collaborators.filter(c => c.status === 'ACTIVE').length} / {collaborators.length} ACTIVE</span>
              </div>
              <div className="space-y-1.5">
                {collaborators.map((member) => (
                  <div key={member.id} className="bg-black/40 border border-[#1b1b1b] p-2 hover:border-[#2a2a2a] transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F9F9F9]">{member.name}</span>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        member.status === 'ACTIVE' ? 'bg-[#00FF66]' : 'bg-[#666]'
                      }`}></span>
                    </div>
                    <div className="flex justify-between items-center font-mono text-[8px] text-[#666] mt-1">
                      <span>{member.role} ({member.agency})</span>
                      <span className="text-[#0EA5E9] font-bold">{member.secureToken}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Diligence Directory Tree */}
            <div className="space-y-2">
              <h3 className="font-mono text-[9px] uppercase text-[#888] tracking-widest font-bold">LOCKBOX ARTIFACT SHEETS</h3>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between text-[#888] p-1.5 bg-black/20 hover:text-white cursor-pointer transition-colors border-l-2 border-[#00FF66]">
                  <span className="truncate">📁 Section A: Executed LOI Files</span>
                  <span className="text-[#00FF66] text-[10px]">VERIFIED</span>
                </div>
                <div className="flex items-center justify-between text-[#888] p-1.5 bg-black/20 hover:text-white cursor-pointer transition-colors border-l-2 border-[#0EA5E9]">
                  <span className="truncate">📁 Section B: Quality of Earnings</span>
                  <span className="text-[#0EA5E9] text-[10px]">PROGRESS</span>
                </div>
                <div className="flex items-center justify-between text-[#888] p-1.5 bg-black/20 hover:text-white cursor-pointer transition-colors border-l-2 border-[#FF3333]">
                  <span className="truncate">📁 Section C: Facility & Equipment</span>
                  <span className="text-[#FF3333] text-[10px]">PENDING</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1b1b1b] pt-4 space-y-2">
            <div className="flex items-center justify-between text-[9px] font-mono text-[#555]">
              <span>LEDGER STICKER ID</span>
              <span className="text-white">DLT-992-SECURE</span>
            </div>
            <div className="h-1.5 bg-neutral-900 overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-0 bg-[#00FF66] w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Center / Main Column (6/12): Live Terminal Audit Logs */}
        <div className="lg:col-span-6 border-r border-[#222222] bg-[#050505] flex flex-col justify-between">
          
          {/* Internal Terminal Controls Header */}
          <div className="p-3 border-b border-[#222222] bg-[#080808] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {['ALL', 'DOCUMENT', 'UNDERWRITING', 'ACCESS', 'LEGAL', 'COMPLIANCE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 font-mono text-[8px] border transition-all uppercase ${
                    selectedCategory === cat 
                      ? 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]' 
                      : 'border-[#222] text-[#888] hover:border-[#444] hover:text-[#F9F9F9]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search within Audit Stream */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="GREP FILTER STREAM..."
                className="bg-black border border-[#222] px-2.5 py-1 text-[9px] font-mono text-[#F9F9F9] placeholder-[#444] focus:outline-none focus:border-[#0EA5E9] w-full sm:w-44"
              />
            </div>
          </div>

          {/* Audit Stream Logs Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[500px]">
            {filteredLogs.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#222] p-6 text-center space-y-3">
                <span className="text-[#FF3333] text-xl font-mono">⚠️</span>
                <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider">
                  / NO ACTIVE TRANSACTION MATCHES IN GREP PIPELINE /
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                  className="font-mono text-[9px] bg-[#00FF66] text-black px-3 py-1.5 hover:bg-white transition-all font-bold"
                >
                  CLEAR TRANSACTION FILTERS
                </button>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isSelected = selectedLog?.id === log.id;
                
                // Color mapping for status indicator
                let statusColor = 'text-[#00FF66]';
                let bgIndicator = 'bg-[#00FF66]';
                if (log.status === 'WARNING') {
                  statusColor = 'text-yellow-400';
                  bgIndicator = 'bg-yellow-400';
                } else if (log.status === 'CRITICAL') {
                  statusColor = 'text-[#FF3333]';
                  bgIndicator = 'bg-[#FF3333]';
                } else if (log.status === 'INFO') {
                  statusColor = 'text-[#0EA5E9]';
                  bgIndicator = 'bg-[#0EA5E9]';
                }

                return (
                  <div
                    key={log.id}
                    onClick={() => {
                      setSelectedLog(log);
                      setLogDetailsOpen(true);
                    }}
                    className={`p-3 border cursor-pointer transition-all duration-150 relative group ${
                      isSelected 
                        ? 'bg-[#090909] border-[#0ea5e9]' 
                        : 'bg-black/30 border-[#1a1a1a] hover:border-[#333]'
                    }`}
                  >
                    {/* Timestamp & Category */}
                    <div className="flex items-center justify-between text-[8px] font-mono text-[#666] mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-block w-1.5 h-1.5 ${bgIndicator}`}></span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className="text-[#333]">|</span>
                        <span className="text-[#0EA5E9] font-bold">[{log.category}]</span>
                      </div>
                      <span className="font-mono truncate max-w-[120px]">{log.diligencePhase}</span>
                    </div>

                    {/* Action & Target */}
                    <div className="text-xs font-mono font-medium text-[#F9F9F9] tracking-tight group-hover:text-white">
                      {log.action}
                    </div>

                    <div className="text-[10px] font-mono text-[#888] mt-1 flex items-center justify-between">
                      <span className="truncate max-w-[300px] text-zinc-400">Target: {log.target}</span>
                      <span className="font-bold text-[9px] font-mono text-zinc-500">{log.ip}</span>
                    </div>

                    {/* SHA Cryptographic signature trailer line */}
                    <div className="mt-2 pt-1.5 border-t border-dashed border-[#1b1b1b] flex items-center justify-between text-[8px] font-mono text-[#444]">
                      <span className="truncate">SIG: {log.hash}</span>
                      <span className={`${statusColor} font-bold`}>{log.status}</span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Manual Console Command Input Shell */}
          <form onSubmit={handleCommandSubmit} className="border-t border-[#222222] bg-black p-3 flex items-center space-x-2">
            <span className="font-mono text-xs text-[#00FF66] select-none font-bold shrink-0">$ SECURE CMD &gt;</span>
            <input
              type="text"
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              placeholder="Inject manual signature / action (Type '/help' for operational codes)"
              className="flex-1 bg-transparent text-xs font-mono text-[#F9F9F9] placeholder-[#444] focus:outline-none focus:ring-0 py-1"
            />
            <button
              type="submit"
              className="bg-transparent border border-[#222] text-[#888] px-3 py-1 font-mono text-[9px] hover:border-[#00FF66] hover:text-[#00FF66] transition-colors"
            >
              EXECUTE
            </button>
          </form>
        </div>

        {/* Right Column (3/12): Detailed Cryptographic Signatures Inspect */}
        <div className="lg:col-span-3 bg-[#080808] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-4">
              <h3 className="font-mono text-[9px] uppercase text-[#888] tracking-widest font-bold">METADATA INSPECTION</h3>
              <span className="font-mono text-[8px] bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20 px-1.5 py-0.5">X-RAY ADVISORY</span>
            </div>

            {selectedLog ? (
              <div className="space-y-4 text-xs font-mono">
                {/* ID & Categorization */}
                <div className="bg-black border border-[#1b1b1b] p-3 space-y-1.5">
                  <div className="text-[9px] text-[#666]">LEDGER TRANSACTION ID</div>
                  <div className="text-white text-[11px] select-all font-semibold font-mono">{selectedLog.id}</div>
                </div>

                {/* Actor & Authorization Identity */}
                <div className="space-y-1">
                  <div className="text-[9px] text-[#666]">AUTHORIZED OPERATOR</div>
                  <div className="text-[#F9F9F9] font-semibold">{selectedLog.actor}</div>
                </div>

                {/* Scope Target */}
                <div className="space-y-1">
                  <div className="text-[9px] text-[#666]">DILIGENCE TARGET SCOPE</div>
                  <div className="text-[#0EA5E9] font-medium break-all">{selectedLog.target}</div>
                </div>

                {/* Specific Event Description */}
                <div className="space-y-1">
                  <div className="text-[9px] text-[#666]">SYSTEM CLASSIFIED ACTION</div>
                  <p className="text-[#888] leading-normal leading-relaxed text-[11px]">
                    {selectedLog.action}. Verified and committed directly within the SBA lending due diligence framework for transaction approval flow.
                  </p>
                </div>

                {/* Cryptographic SHA Integrity Box */}
                <div className="bg-[#00FF66]/5 border border-[#00FF66]/20 p-3 space-y-2">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-[#00FF66] font-bold">CRYPTO SECURITY INTEGRITY</span>
                    <span className="text-[#666]">SHA-256</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 break-all bg-black p-2 border border-[#222] leading-tight select-all">
                    {selectedLog.hash}
                  </div>
                  <div className="flex items-center justify-between text-[8px] text-[#666]">
                    <span>STATUS: {selectedLog.status}</span>
                    <span>ROUTE IP: {selectedLog.ip}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center border border-dashed border-[#222] p-4 text-center">
                <span className="font-mono text-[9px] text-[#555] uppercase tracking-widest">
                  SELECT A LEDGER TRANSACTION KEY TO DECRYPT SECURE METADATA
                </span>
              </div>
            )}
          </div>

          {/* Underwriting Safety Alerts */}
          <div className="mt-6 border-t border-[#1b1b1b] pt-4 space-y-3">
            <span className="font-mono text-[9px] text-[#FF3333] tracking-widest uppercase flex items-center space-x-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-[#FF3333] rounded-full animate-ping"></span>
              <span>DILIGENCE LOCKBOX RULES</span>
            </span>
            <p className="text-[10px] text-[#888] font-mono leading-relaxed">
              All artifact updates are synchronized securely with SBA Preferred Advisory networks. Unauthorized document modifications will trigger compliance alerts instantly.
            </p>
            <div className="bg-[#FF3333]/5 border border-[#FF3333]/15 p-2.5 flex items-center space-x-2">
              <span className="text-[#FF3333] font-mono text-xs">🔒</span>
              <span className="text-[8px] font-mono text-[#999] leading-tight">
                Any drift in file signature hashes triggers legal review requirements on LOI terms.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Footer Stats Grid */}
      <div className="bg-black border-t border-[#222222] p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border-r border-[#222222] pr-4">
          <span className="font-mono text-[8px] text-[#666] uppercase block">TOTAL DILIGENCE LOGS</span>
          <span className="text-sm font-semibold font-mono text-white">{logs.length} TRANSACTION ENTRIES</span>
        </div>
        <div className="border-r border-[#222222] px-4">
          <span className="font-mono text-[8px] text-[#666] uppercase block">CRITICAL THREAT TRIGGERS</span>
          <span className="text-sm font-semibold font-mono text-[#FF3333]">01 FLAG RESOLVED</span>
        </div>
        <div className="border-r border-[#222222] px-4">
          <span className="font-mono text-[8px] text-[#666] uppercase block">SECURE SYSTEM HASHES</span>
          <span className="text-sm font-semibold font-mono text-[#00FF66]">100% VERIFIED</span>
        </div>
        <div className="pl-4">
          <span className="font-mono text-[8px] text-[#666] uppercase block">VDR COMPLIANCE INDEX</span>
          <span className="text-sm font-semibold font-mono text-[#0EA5E9]">SECURED SH-883</span>
        </div>
      </div>
    </div>
  );
}
```