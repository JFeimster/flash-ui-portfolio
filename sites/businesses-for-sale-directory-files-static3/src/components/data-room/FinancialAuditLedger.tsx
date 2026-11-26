import React, { useState, useEffect, useMemo, useRef } from 'react';

// Strict terminal styling injected globally
const CustomStyleTag = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    * {
      border-radius: 0px !important;
    }
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    ::-webkit-scrollbar-track {
      background: #050505;
    }
    ::-webkit-scrollbar-thumb {
      background: #222;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #0ea5e9;
    }
    .text-glow-green {
      text-shadow: 0 0 8px rgba(0, 255, 102, 0.4);
    }
    .text-glow-blue {
      text-shadow: 0 0 8px rgba(14, 165, 233, 0.4);
    }
    .terminal-bg {
      background-color: #050505;
    }
  `}} />
);

interface AddBackItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  description: string;
  enabled: boolean;
}

interface DocumentItem {
  id: string;
  name: string;
  category: string;
  size: string;
  hash: string;
  encrypted: boolean;
  decryptProgress: number; // 0 to 100
  decrypted: boolean;
}

interface EmployeeNode {
  id: string;
  title: string;
  redactedName: string;
  realName: string;
  salary: number;
  tenure: string;
  department: string;
  cleared: boolean;
  subordinates?: EmployeeNode[];
}

interface AuditLog {
  timestamp: string;
  operator: string;
  action: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

export default function FinancialAuditLedger() {
  // Available premium projects for simulation
  const [activeListing, setActiveListing] = useState<'DELTA' | 'TITAN'>('DELTA');
  
  // Custom interactive keys
  const [securityKey, setSecurityKey] = useState<string>('ETA-7922-SECURE');
  const [accessGranted, setAccessGranted] = useState<boolean>(true);
  const [logs, setLogs] = useState<AuditLog[]>([
    { timestamp: '12:04:10', operator: '#ETA-7922', action: 'CLEAN ROOM HANDSHAKE COMPLETED', status: 'SUCCESS' },
    { timestamp: '12:04:12', operator: '#ETA-7922', action: 'ESTABLISHED ENCRYPTED TUNNEL TO SECURE VAULT', status: 'SUCCESS' },
    { timestamp: '12:04:15', operator: '#ETA-7922', action: 'LOADED ADJUSTED EBITDA LEDGERS FOR SECTOR 1031', status: 'SUCCESS' },
  ]);

  // Reconciliation items list
  const [addBacksDelta, setAddBacksDelta] = useState<AddBackItem[]>([
    { id: 'ab1', name: "Owner's Primary Discretionary Salary", category: 'Management Compensation', amount: 180000, description: "Normalized replacement manager salary modeled at $80,000. Net add-back of $100,000.", enabled: true },
    { id: 'ab2', name: 'Personal Auto & Corporate Travel Excess', category: 'Travel & Lifestyle', amount: 24500, description: "Personal vehicles and non-essential travel funded through trade accounts.", enabled: true },
    { id: 'ab3', name: 'Non-Recurring Legal Settlements (IP Dispute)', category: 'Exceptional Items', amount: 45000, description: "One-time lawsuit settlement with previous regional competitor.", enabled: true },
    { id: 'ab4', name: 'Excess Rent Paid to Related Sister Entity', category: 'Real Estate Premium', amount: 38500, description: "Excess lease payment above Fair Market Rent value. Lease to be normalized post-transaction.", enabled: false },
    { id: 'ab5', name: 'Discretionary R&D Tech Experimentation', category: 'Discretionary Ops', amount: 12000, description: "Experimental back-office database prototype that was discontinued.", enabled: false },
  ]);

  const [addBacksTitan, setAddBacksTitan] = useState<AddBackItem[]>([
    { id: 'ab201', name: "Owner's Direct Consulting Fee Allocation", category: 'Management Compensation', amount: 250000, description: "Consulting fees paid directly to primary shareholder's holding LLC.", enabled: true },
    { id: 'ab202', name: 'Discretionary R&D Tooling Sub-Licenses', category: 'Exceptional Items', amount: 110000, description: "One-off tooling licenses purchased specifically for prototype defense contractor.", enabled: true },
    { id: 'ab203', name: 'Redundant Back-Office System Software Fees', category: 'Systems Optimization', amount: 35000, description: "Legacy CRM licenses currently active but entirely redundant post-consolidation.", enabled: true },
    { id: 'ab204', name: 'Excess Fleet Freight Insurance Surcharges', category: 'Operations Adjustments', amount: 105000, description: "Temporary hazard premium due to one high-liability shipment that concluded Q4.", enabled: false },
  ]);

  // Reported Base Tax Net Income
  const baseTaxNetIncome = activeListing === 'DELTA' ? 320000 : 650000;
  const currentAddBacks = activeListing === 'DELTA' ? addBacksDelta : addBacksTitan;
  
  // Document Room Simulation
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: 'doc1', name: '2023_IRS_Form_1120S_Redacted.pdf', category: 'Federal Tax Returns', size: '2.4 MB', hash: 'SHA256:7b51e04a...', encrypted: true, decryptProgress: 0, decrypted: false },
    { id: 'doc2', name: 'Quality_of_Earnings_Phase1_ExecutiveSummary.pdf', category: 'QofE Diligence', size: '4.8 MB', hash: 'SHA256:39f88d2c...', encrypted: true, decryptProgress: 0, decrypted: false },
    { id: 'doc3', name: 'Customer_Revenue_Concentration_Matrix_2024.xlsx', category: 'Client Operations', size: '1.2 MB', hash: 'SHA256:91cae38b...', encrypted: true, decryptProgress: 0, decrypted: false },
    { id: 'doc4', name: 'W2_Summary_And_Benefits_Structure_Sanitized.pdf', category: 'Human Capital', size: '940 KB', hash: 'SHA256:fb452c9d...', encrypted: true, decryptProgress: 0, decrypted: false },
  ]);

  // Org Tree Data
  const [orgTreeDelta, setOrgTreeDelta] = useState<EmployeeNode>({
    id: 'e1',
    title: 'Managing General Director',
    redactedName: 'OPERATOR ALPHA [REDACTED]',
    realName: 'Harrison Vance Vance',
    salary: 220000,
    tenure: '10 Years (Founder)',
    department: 'Executive Governance',
    cleared: false,
    subordinates: [
      {
        id: 'e2',
        title: 'VP of Logistics & Fleet Ops',
        redactedName: 'OPERATOR BETA [REDACTED]',
        realName: 'Marcus Lindstrom',
        salary: 115000,
        tenure: '6 Years',
        department: 'Operations',
        cleared: false,
        subordinates: [
          { id: 'e3', title: 'Lead Fleet Maintenance Technician', redactedName: 'OPERATOR KAPPA [REDACTED]', realName: 'Devon Miller', salary: 82000, tenure: '5 Years', department: 'Operations', cleared: false },
          { id: 'e4', title: 'Dispatch Supervisor & Routing Lead', redactedName: 'OPERATOR LAMBDA [REDACTED]', realName: 'Sarah Kowalski', salary: 74000, tenure: '4 Years', department: 'Operations', cleared: false }
        ]
      },
      {
        id: 'e5',
        title: 'Key Client Account Director',
        redactedName: 'OPERATOR GAMMA [REDACTED]',
        realName: 'Elena Rostova',
        salary: 95000,
        tenure: '3.5 Years',
        department: 'Accounts & Client Retention',
        cleared: false,
        subordinates: [
          { id: 'e6', title: 'Senior Account Executive', redactedName: 'OPERATOR SIGMA [REDACTED]', realName: 'Tariq Al-Fayed', salary: 58000, tenure: '2 Years', department: 'Accounts', cleared: false }
        ]
      }
    ]
  });

  const [orgTreeTitan, setOrgTreeTitan] = useState<EmployeeNode>({
    id: 'et1',
    title: 'Chief Executive Officer',
    redactedName: 'DIRECTOR TITAN [REDACTED]',
    realName: 'Gwendolyn Stone',
    salary: 310000,
    tenure: '8 Years',
    department: 'Executive Governance',
    cleared: false,
    subordinates: [
      {
        id: 'et2',
        title: 'Director of Tooling Engineering',
        redactedName: 'CHIEF TECH [REDACTED]',
        realName: 'Albert Chen',
        salary: 165000,
        tenure: '7 Years',
        department: 'Research & Prototyping',
        cleared: false,
        subordinates: [
          { id: 'et3', title: 'Senior CNC Lathe Operator', redactedName: 'TECH ALPHA [REDACTED]', realName: 'John Kowalczyk', salary: 95000, tenure: '4 Years', department: 'Manufacturing', cleared: false }
        ]
      }
    ]
  });

  const activeOrgTree = activeListing === 'DELTA' ? orgTreeDelta : orgTreeTitan;

  // Add a new log helper
  const addLog = (action: string, status: 'SUCCESS' | 'WARNING' | 'ALERT' = 'SUCCESS') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [...prev, { timestamp: timeStr, operator: `#ETA-7922`, action, status }]);
  };

  // Toggle add-back and record to audit log
  const handleToggleAddBack = (id: string, name: string, amount: number, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    
    if (activeListing === 'DELTA') {
      setAddBacksDelta(prev => prev.map(item => item.id === id ? { ...item, enabled: updatedStatus } : item));
    } else {
      setAddBacksTitan(prev => prev.map(item => item.id === id ? { ...item, enabled: updatedStatus } : item));
    }

    addLog(
      `${updatedStatus ? 'ADDED' : 'REMOVED'} QofE RECONCILIATION VALUE: "${name}" (${updatedStatus ? '+' : '-'}$${amount.toLocaleString()})`,
      updatedStatus ? 'SUCCESS' : 'WARNING'
    );
  };

  // Calculated Adjusted EBITDA
  const adjustedEbitda = useMemo(() => {
    const sumEnabledAddbacks = currentAddBacks
      .filter(item => item.enabled)
      .reduce((sum, item) => sum + item.amount, 0);
    return baseTaxNetIncome + sumEnabledAddbacks;
  }, [baseTaxNetIncome, currentAddBacks]);

  // Decryption Simulator
  const handleDecryptDoc = (docId: string, docName: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId && !doc.decrypted && doc.decryptProgress === 0) {
        // Start simulated intervals
        addLog(`INITIALIZED SHA-256 PARSING HANDSHAKE FOR: ${docName}`, 'WARNING');
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setDocuments(curr => curr.map(d => {
            if (d.id === docId) {
              if (progress >= 100) {
                clearInterval(interval);
                addLog(`DECRYPTION KEY VERIFIED: ${docName} SECURED IN MEMORY STATE`, 'SUCCESS');
                return { ...d, decryptProgress: 100, decrypted: true };
              }
              return { ...d, decryptProgress: progress };
            }
            return d;
          }));
        }, 150);
        return { ...doc, decryptProgress: 1 };
      }
      return doc;
    }));
  };

  // Node Decrypt Request Simulator
  const toggleEmployeeClearance = (nodeId: string, currentCleared: boolean, redactedName: string) => {
    const setNodeCleared = (node: EmployeeNode): EmployeeNode => {
      if (node.id === nodeId) {
        const nextState = !currentCleared;
        addLog(`${nextState ? 'DECRYPTED' : 'RE-MASKED'} SENSITIVE ORG-DATA FOR: ${redactedName}`, nextState ? 'SUCCESS' : 'WARNING');
        return { ...node, cleared: nextState };
      }
      if (node.subordinates) {
        return { ...node, subordinates: node.subordinates.map(setNodeCleared) };
      }
      return node;
    };

    if (activeListing === 'DELTA') {
      setOrgTreeDelta(prev => setNodeCleared(prev));
    } else {
      setOrgTreeTitan(prev => setNodeCleared(prev));
    }
  };

  // Log auto-scroll box
  const terminalLogsEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (terminalLogsEndRef.current) {
      terminalLogsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="terminal-bg text-[#F9F9F9] min-h-screen p-4 md:p-8 flex flex-col font-mono selection:bg-[#00FF66] selection:text-black">
      <CustomStyleTag />

      {/* HEADER SECTION */}
      <div className="border border-[#222] bg-[#0c0c0c] p-4 md:p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#FF3333] text-black text-[9px] font-bold px-1.5 py-0.5 tracking-tighter">SECURE CLEAN ROOM V.09</span>
            <span className="text-[10px] text-[#0EA5E9] tracking-widest font-bold">SHA-256 CRYPTO-SEALED</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#F9F9F9] mt-1.5">
            FINANCIAL UNDERWRITING <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F9F9] via-[#0EA5E9] to-[#00FF66]">& QUALITY OF EARNINGS</span> VAULT
          </h2>
          <p className="text-xs text-[#888] mt-1 leading-relaxed">
            Authorized for Operator: <span className="text-[#0ea5e9]">#ETA-7922</span>. Live audit tracing actively records all interaction variables to compliance ledger.
          </p>
        </div>

        {/* Listings Switcher */}
        <div className="flex items-center space-x-1.5 bg-black border border-[#222] p-1.5 w-full md:w-auto">
          <button 
            onClick={() => {
              setActiveListing('DELTA');
              addLog("CLEAN ROOM FOCUS CHANGED TO: PROJECT DELTA (Logistics)", "SUCCESS");
            }}
            className={`px-3 py-1.5 text-xs font-bold transition-all uppercase flex-1 md:flex-none ${activeListing === 'DELTA' ? 'bg-[#00FF66] text-black' : 'bg-transparent text-[#888] hover:text-white'}`}
          >
            PROJECT DELTA [Logistics]
          </button>
          <button 
            onClick={() => {
              setActiveListing('TITAN');
              addLog("CLEAN ROOM FOCUS CHANGED TO: PROJECT TITAN (Manufacturing)", "SUCCESS");
            }}
            className={`px-3 py-1.5 text-xs font-bold transition-all uppercase flex-1 md:flex-none ${activeListing === 'TITAN' ? 'bg-[#00FF66] text-black' : 'bg-transparent text-[#888] hover:text-white'}`}
          >
            PROJECT TITAN [Mfg.]
          </button>
        </div>
      </div>

      {/* CORE UNDERWRITING GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-grow">
        
        {/* LEFT COLUMN: ACTIVE CONTROL ROOM & DOCUMENT VAULT (4-span) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Vault Status */}
          <div className="border border-[#222] bg-[#080808] p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#0ea5e9]"></div>
            <div className="flex justify-between items-center border-b border-[#222] pb-3 mb-4">
              <span className="text-xs text-[#0ea5e9] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#0ea5e9] inline-block"></span>
                DILIGENCE ENVELOPE CONTROLS
              </span>
              <span className="text-[9px] text-[#00FF66] tracking-widest font-bold blink">[SECURE]</span>
            </div>

            <div className="space-y-4">
              {/* Dynamic Status Display */}
              <div className="bg-black p-3.5 border border-[#222] space-y-2">
                <div className="text-[10px] text-[#888] uppercase tracking-wider">Target Listing Identity</div>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-white tracking-tight">{activeListing === 'DELTA' ? 'PROJECT DELTA' : 'PROJECT TITAN'}</span>
                  <span className="text-xs text-[#888]">{activeListing === 'DELTA' ? 'Southeast Logistics' : 'Midwest Tooling'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#111] text-[10px]">
                  <div>
                    <span className="text-[#888] block">Audited Year</span>
                    <span className="font-semibold text-[#0ea5e9]">FY 2023 RECON</span>
                  </div>
                  <div>
                    <span className="text-[#888] block">Integrity Index</span>
                    <span className="font-semibold text-[#00FF66]">Grade A (Excellent)</span>
                  </div>
                </div>
              </div>

              {/* Secure Session Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#888] tracking-widest uppercase block">Operator Crypt-Key Bypass</label>
                <div className="flex">
                  <input 
                    type="text" 
                    value={securityKey}
                    onChange={(e) => {
                      setSecurityKey(e.target.value);
                      if(e.target.value.trim() === '') {
                        setAccessGranted(false);
                      } else {
                        setAccessGranted(true);
                      }
                    }}
                    placeholder="Enter security override token..."
                    className="flex-grow bg-black border border-[#222] focus:border-[#0EA5E9] focus:outline-none text-xs text-white p-2 placeholder:text-[#444]"
                  />
                  <div className="bg-[#111] border-y border-r border-[#222] px-3 flex items-center justify-center text-[10px] text-[#00FF66]">
                    VERIFIED
                  </div>
                </div>
                <p className="text-[9px] text-neutral-500">Security bypass key unlocks redacted personnel trees on physical node interaction.</p>
              </div>
            </div>
          </div>

          {/* SECURED DOCUMENT PORTAL */}
          <div className="border border-[#222] bg-[#080808] p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#0ea5e9]"></div>
            <div className="flex justify-between items-center border-b border-[#222] pb-3 mb-4">
              <span className="text-xs text-[#0ea5e9] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#0ea5e9] inline-block"></span>
                ENCRYPTED DOCUMENT ROOM
              </span>
              <span className="text-[10px] text-[#888]" x-text="documents.length">{documents.length} Files</span>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className={`border p-3 transition-all ${doc.decrypted ? 'border-[#0ea5e9]/40 bg-[#0ea5e9]/5' : 'border-[#222] bg-[#040404]'}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <div className="text-[9px] font-semibold text-[#888] tracking-wider uppercase px-1 py-0.5 bg-black border border-[#222] inline-block">
                        {doc.category}
                      </div>
                      <h4 className="text-xs font-bold text-[#F9F9F9] tracking-tight">{doc.name}</h4>
                      <p className="text-[9px] text-[#444] font-mono leading-none">{doc.size} | {doc.hash}</p>
                    </div>

                    <div className="flex-shrink-0">
                      {doc.decrypted ? (
                        <span className="text-[9px] font-bold text-[#00FF66] border border-[#00FF66]/30 px-1.5 py-0.5 bg-[#00FF66]/10">
                          DECRYPTED
                        </span>
                      ) : doc.decryptProgress > 0 ? (
                        <span className="text-[9px] font-bold text-yellow-500 animate-pulse border border-yellow-500/30 px-1.5 py-0.5 bg-yellow-500/10">
                          {doc.decryptProgress}%
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleDecryptDoc(doc.id, doc.name)}
                          className="text-[9px] font-bold bg-[#0ea5e9] text-black hover:bg-[#00FF66] hover:text-black transition-all px-2.5 py-1"
                        >
                          DECRYPT
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  {doc.decryptProgress > 0 && !doc.decrypted && (
                    <div className="w-full bg-[#111] h-1 mt-2.5 overflow-hidden">
                      <div className="bg-yellow-500 h-full transition-all duration-150" style={{ width: `${doc.decryptProgress}%` }}></div>
                    </div>
                  )}

                  {/* Action Link when decrypted */}
                  {doc.decrypted && (
                    <div className="mt-2.5 pt-2 border-t border-[#0ea5e9]/20 flex justify-between items-center">
                      <span className="text-[10px] text-[#00FF66] flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        DOWNLOAD DECRYPTED LINK SECURE
                      </span>
                      <button 
                        onClick={() => {
                          addLog(`DOWNLOAD INITIATED FOR SECURE DOCUMENT FILE: ${doc.name}`, 'SUCCESS');
                          alert(`Simulated system download payload for: ${doc.name}\nLocal Storage handoff completed.`);
                        }}
                        className="text-[9px] hover:underline text-[#0ea5e9] font-bold"
                      >
                        [LAUNCH REPORT]
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MIDDLE COLUMN: QUALITY OF EARNINGS LEDGER & BRIDGE ENGINE (5-span) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Bridge Engine & Dynamic Recs */}
          <div className="border border-[#222] bg-[#080808] p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00ff66]"></div>
            
            <div className="flex justify-between items-center border-b border-[#222] pb-3 mb-4">
              <span className="text-xs text-[#00FF66] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#00FF66] inline-block"></span>
                QOFE ADJUSTED RECONCILIATION LEDGER
              </span>
              <span className="text-[10px] text-[#888]">FY2023 TAX RECON</span>
            </div>

            <p className="text-xs text-[#888] leading-relaxed mb-4">
              Tax returns frequently optimize for high write-offs. Clean room parameters below let underwriting analysts simulate the QofE adjusted run-rate EBITDA. Toggle adjustments.
            </p>

            {/* Reported Net Income Row */}
            <div className="bg-black border border-[#222] p-4 flex justify-between items-center mb-4">
              <div>
                <span className="text-[9px] text-[#888] uppercase tracking-wider block">REPORTED TAX RETURN NET INCOME</span>
                <span className="text-xs text-[#888]">Form 1120S Line 21 Standard reported taxable basis</span>
              </div>
              <span className="text-base font-bold text-white tracking-tight">${baseTaxNetIncome.toLocaleString()}</span>
            </div>

            {/* Reconciliation Checklist */}
            <div className="space-y-2 mb-4">
              <div className="text-[10px] text-[#888] uppercase tracking-widest px-1">Add-back Adjustments (Diligence Reconciled)</div>
              
              {currentAddBacks.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleToggleAddBack(item.id, item.name, item.amount, item.enabled)}
                  className={`border p-3 cursor-pointer transition-all flex justify-between items-start gap-4 ${item.enabled ? 'border-[#00ff66]/30 bg-[#00ff66]/5 hover:bg-[#00ff66]/10' : 'border-[#222] bg-transparent hover:border-[#444]'}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 border flex items-center justify-center text-[8px] font-bold ${item.enabled ? 'border-[#00ff66] bg-[#00ff66] text-black' : 'border-[#444]'}`}>
                        {item.enabled ? '✓' : ''}
                      </span>
                      <span className={`text-[11px] font-bold tracking-tight ${item.enabled ? 'text-[#00FF66]' : 'text-[#888]'}`}>{item.name}</span>
                    </div>
                    <p className="text-[10px] text-[#666] leading-snug pl-4">{item.description}</p>
                    <span className="text-[8px] bg-black text-[#888] px-1.5 py-0.5 border border-[#222] uppercase tracking-wider inline-block ml-4">
                      {item.category}
                    </span>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-bold font-mono tracking-tight ${item.enabled ? 'text-[#00FF66] text-glow-green' : 'text-neutral-600'}`}>
                      +${item.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Bridge Chart Visualization */}
            <div className="bg-black border border-[#222] p-4 space-y-3">
              <div className="flex justify-between items-center text-[10px] text-[#888] uppercase tracking-wider">
                <span>EBITDA Bridge Visualizer</span>
                <span className="text-[#00ff66] font-bold">Adj. EBITDA Target Multiplier: ~3.1x Asking</span>
              </div>

              {/* Progress bars showing transition */}
              <div className="space-y-2">
                {/* Reported Income Bar */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-neutral-400">Tax Net Income Basis</span>
                    <span className="text-neutral-400">${baseTaxNetIncome.toLocaleString()} ({Math.round((baseTaxNetIncome/adjustedEbitda)*100)}%)</span>
                  </div>
                  <div className="w-full bg-[#111] h-2">
                    <div className="bg-[#888] h-full" style={{ width: `${(baseTaxNetIncome/adjustedEbitda)*100}%` }}></div>
                  </div>
                </div>

                {/* Add-backs sum */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#00ff66]">Validated Adjustments Total</span>
                    <span className="text-[#00ff66]">
                      +${(adjustedEbitda - baseTaxNetIncome).toLocaleString()} ({Math.round(((adjustedEbitda - baseTaxNetIncome)/adjustedEbitda)*100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#111] h-2">
                    <div className="bg-[#00ff66] h-full" style={{ width: `${((adjustedEbitda - baseTaxNetIncome)/adjustedEbitda)*100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#222] pt-3 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#888] uppercase tracking-wider block">ADJUSTED RUN-RATE EBITDA</span>
                  <span className="text-[9px] text-[#444] font-mono leading-none">Aggregated with active overrides</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#00FF66] tracking-tight text-glow-green">${adjustedEbitda.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: PERSONNEL ORG TREE & LIVE AUDIT LEDGER (3-span) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Redacted Org Tree */}
          <div className="border border-[#222] bg-[#080808] p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF3333]"></div>
            
            <div className="flex justify-between items-center border-b border-[#222] pb-3 mb-4">
              <span className="text-xs text-[#FF3333] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#FF3333] inline-block"></span>
                REDACTED ORG STRUCTURE
              </span>
              <span className="text-[9px] text-[#888]">KEY ASSETS DECRYPT</span>
            </div>

            <p className="text-[11px] text-[#888] leading-normal mb-4">
              Core employees represent system dependency. Select nodes below with active Crypt-Key bypass configured to test for key-man dependencies.
            </p>

            {/* Tree Rendering Box */}
            <div className="space-y-4 font-mono">
              
              {/* Recursive Org Component */}
              {(() => {
                const renderNode = (node: EmployeeNode, depth = 0) => {
                  return (
                    <div key={node.id} className="space-y-1.5" style={{ marginLeft: `${depth * 10}px` }}>
                      <div 
                        onClick={() => toggleEmployeeClearance(node.id, node.cleared, node.redactedName)}
                        className={`border p-2.5 cursor-pointer transition-all ${node.cleared ? 'border-[#0ea5e9]/40 bg-[#0ea5e9]/5' : 'border-[#222] bg-black hover:border-neutral-500'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] bg-neutral-900 border border-neutral-700 px-1 py-0.5 text-neutral-400 block tracking-tight uppercase max-w-max mb-1.5">
                              {node.title}
                            </span>
                            
                            {/* Decrypted vs Redacted Name */}
                            {node.cleared ? (
                              <h5 className="text-xs font-bold text-[#0ea5e9] tracking-tight">{node.realName}</h5>
                            ) : (
                              <h5 className="text-xs font-bold text-neutral-500 line-through bg-neutral-950 px-1 select-none">{node.redactedName}</h5>
                            )}

                            <div className="flex gap-2 text-[8px] text-[#888] mt-1.5">
                              <span>Tenure: <strong className="text-white">{node.tenure}</strong></span>
                              <span>•</span>
                              <span>Dept: <strong className="text-white">{node.department}</strong></span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-semibold text-white block">
                              {node.cleared ? `$${node.salary.toLocaleString()}/yr` : '$[HIDDEN]'}
                            </span>
                            <span className={`text-[8px] block mt-1 uppercase font-bold tracking-widest ${node.cleared ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                              {node.cleared ? '[UNLOCKED]' : '[REDACTED]'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {node.subordinates && node.subordinates.map(sub => (
                        <div key={sub.id} className="relative pl-2.5">
                          {/* visual connection line */}
                          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#222]"></div>
                          {renderNode(sub, depth + 1)}
                        </div>
                      ))}
                    </div>
                  );
                };

                return renderNode(activeOrgTree);
              })()}

            </div>
          </div>

          {/* Interactive Live Audit Ledger (Bottom right) */}
          <div className="border border-[#222] bg-[#0c0c0c] p-4 font-mono">
            <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-3">
              <span className="text-[10px] text-[#0ea5e9] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-2.5 bg-[#0ea5e9] inline-block animate-pulse"></span>
                ACTIVE LOGICAL AUDIT LEDGER
              </span>
              <span className="text-[8px] text-[#888] uppercase tracking-widest">REAL-TIME CONSOLE</span>
            </div>

            {/* Scrollable output */}
            <div className="h-32 overflow-y-auto text-[9px] space-y-2 pr-1.5 scrollbar">
              {logs.map((log, index) => (
                <div key={index} className="leading-normal border-b border-neutral-900 pb-1.5">
                  <div className="flex justify-between text-[8px] text-neutral-600">
                    <span>{log.timestamp} | OPERATOR: {log.operator}</span>
                    <span className={log.status === 'SUCCESS' ? 'text-[#00ff66]' : log.status === 'WARNING' ? 'text-yellow-500' : 'text-[#ff3333]'}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-neutral-400 mt-0.5">{log.action}</p>
                </div>
              ))}
              <div ref={terminalLogsEndRef} />
            </div>

            <div className="mt-3 pt-2.5 border-t border-neutral-900 flex justify-between items-center text-[9px] text-[#555]">
              <span>SYSTEM TRACE STATUS: VERIFIED</span>
              <span>DELAY: 0.00ms</span>
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM DISCLAIMERS */}
      <div className="mt-8 border-t border-[#222] pt-4 text-center">
        <p className="text-[10px] text-[#555] font-mono leading-relaxed max-w-4xl mx-auto">
          SYSTEM COMPLIANCE WARNING: Any unauthorized decryption attempts, manual modification of variables, or key tampering triggers instant system lock. Access coordinates logged under FinCEN Rule 31.
        </p>
      </div>

    </div>
  );
}
