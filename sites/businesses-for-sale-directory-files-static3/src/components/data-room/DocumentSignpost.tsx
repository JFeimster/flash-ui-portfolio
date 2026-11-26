import React, { useState, useEffect } from 'react';

// Interfaces for structured data
interface AddBack {
  id: string;
  name: string;
  amount: number;
  category: 'Owner Comp' | 'Discretionary' | 'One-Time' | 'Synergies';
  description: string;
  verified: boolean;
}

interface TaxReconciliationLine {
  item: string;
  quickbooks: number;
  taxReturn: number;
  variance: number;
  note: string;
}

interface OrgNode {
  id: string;
  role: string;
  department: string;
  compensation: string;
  yearsOfService: number;
  retentionRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  keyManDependency: boolean;
}

interface SecureDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  classification: 'CONFIDENTIAL' | 'PROPRIETARY' | 'RESTRICTED';
  decrypted: boolean;
}

interface AuditLogEntry {
  timestamp: string;
  action: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
  operator: string;
}

export default function DocumentSignpost() {
  // Active state
  const [selectedDeal, setSelectedDeal] = useState<'DELTA' | 'HYDRO' | 'APEX'>('DELTA');
  const [activeTab, setActiveTab] = useState<'qofe' | 'tax' | 'org' | 'vault'>('qofe');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(100);
  const [isVerifying, setIsVerifying] = useState(false);

  // Auditing Engine Simulated Logs
  const [logs, setLogs] = useState<AuditLogEntry[]>([
    { timestamp: '12:04:01', action: 'OPERATOR #ETA-7922 INITIALIZED DATA ROOM SESSION', status: 'SUCCESS', operator: 'ETA-7922' },
    { timestamp: '12:04:05', action: 'SECURE HANDSHAKE COMPLETED FOR PROJECT PIPELINES', status: 'SUCCESS', operator: 'SYS-SEC' },
  ]);

  const addLog = (action: string, status: 'SUCCESS' | 'WARNING' | 'ALERT') => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [
      { timestamp: time, action, status, operator: 'ETA-7922' },
      ...prev,
    ]);
  };

  // Live QofE Dynamic Addback Checklist
  const [addBacks, setAddBacks] = useState<Record<'DELTA' | 'HYDRO' | 'APEX', AddBack[]>>({
    DELTA: [
      { id: '1', name: 'Owner Replacement Salary Normalization', amount: 145000, category: 'Owner Comp', description: 'Adjustment to market-rate CEO replacement salary.', verified: true },
      { id: '2', name: 'Personal Luxury Vehicle Lease & Insurance', amount: 32000, category: 'Discretionary', description: 'Company-covered personal Tesla Model S lease.', verified: true },
      { id: '3', name: 'Non-Recurring Warehousing Software Migration', amount: 48000, category: 'One-Time', description: 'Legacy server cleanup cost completed in Q2.', verified: true },
      { id: '4', name: 'Discretionary Executive Discretionary Bonus', amount: 75000, category: 'Owner Comp', description: 'Discretionary cash distribution paid out.', verified: false },
    ],
    HYDRO: [
      { id: '1', name: 'Excess Rent Paid to Affiliate Holding LLC', amount: 110000, category: 'Synergies', description: 'Adjustment to bring affiliate rent to fair market value.', verified: true },
      { id: '2', name: 'One-time Legal Fees (Patent Defense)', amount: 65000, category: 'One-Time', description: 'Defended specialized compressor valve patent.', verified: true },
      { id: '3', name: 'Non-operational Family Travel Expenses', amount: 42000, category: 'Discretionary', description: 'Owner family annual convention personal extensions.', verified: false },
    ],
    APEX: [
      { id: '1', name: 'Normalized AWS Server Infrastructure Post-Acquisition', amount: 180000, category: 'Synergies', description: 'Calculated savings utilizing acquirer premium enterprise contract.', verified: false },
      { id: '2', name: 'Redundant Back-Office Bookkeeping Automation', amount: 55000, category: 'Synergies', description: 'Transitioning in-house administrative staff to automated systems.', verified: true },
      { id: '3', name: 'Owner Personal Health Insurance & HSA Plan', amount: 28000, category: 'Discretionary', description: 'Company paid premiums for immediate family members.', verified: true },
    ],
  });

  const [activeAddBacks, setActiveAddBacks] = useState<string[]>(['1', '2', '3']);

  // Tax return reconciliation data
  const taxReconciliation: Record<'DELTA' | 'HYDRO' | 'APEX', TaxReconciliationLine[]> = {
    DELTA: [
      { item: 'Gross Receipts / Revenues', quickbooks: 2450000, taxReturn: 2410000, variance: -40000, note: 'Timing difference of year-end billing cycle (Cash vs Accrual)' },
      { item: 'Officer Compensation', quickbooks: 250000, taxReturn: 250000, variance: 0, note: 'Direct match with Schedule K-1 allocation' },
      { item: 'Interest Expenses & Financing', quickbooks: 18500, taxReturn: 18500, variance: 0, note: 'SBA financing preparatory balance sheet item' },
      { item: 'Depreciation & Section 179', quickbooks: 95000, taxReturn: 112000, variance: 17000, note: 'Accelerated tax depreciation write-off discrepancy' },
    ],
    HYDRO: [
      { item: 'Gross Receipts / Revenues', quickbooks: 3100000, taxReturn: 3100000, variance: 0, note: 'Perfect integration matching ledger' },
      { item: 'Subcontractor Costs (Form 1099)', quickbooks: 820000, taxReturn: 805000, variance: -15000, note: 'Unfiled contractor 1099 dispute under review' },
      { item: 'Travel & Discretionary Entertainment', quickbooks: 54000, taxReturn: 32000, variance: -22000, note: 'Disallowed tax deductibility write-down applied' },
    ],
    APEX: [
      { item: 'Gross Receipts / Revenues (SaaS ARR)', quickbooks: 1200000, taxReturn: 1200000, variance: 0, note: 'Matches Stripe payout balance log' },
      { item: 'R&D Tax Credits claimed', quickbooks: 0, taxReturn: 45000, variance: 45000, note: 'Offset directly against payroll taxes under Sec. 41' },
      { item: 'Marketing & Ad Spend', quickbooks: 340000, taxReturn: 340000, variance: 0, note: 'Matches Facebook & Google Ad invoice reports' },
    ],
  };

  // Redacted Employee Database
  const employeeOrgTree: Record<'DELTA' | 'HYDRO' | 'APEX', OrgNode[]> = {
    DELTA: [
      { id: 'EMP-01', role: 'VP of Dispatch Operations (Key Leader)', department: 'Logistics Control', compensation: '$115,000 + Bonus', yearsOfService: 7, retentionRisk: 'MEDIUM', keyManDependency: true },
      { id: 'EMP-02', role: 'Lead Fleet Maintenance Specialist', department: 'Maintenance Depot', compensation: '$85,000 Base', yearsOfService: 5, retentionRisk: 'LOW', keyManDependency: false },
      { id: 'EMP-03', role: 'Head of Accounts & Regional Logistics Sales', department: 'Enterprise Sales', compensation: '$75,000 + Comm', yearsOfService: 4, retentionRisk: 'HIGH', keyManDependency: true },
      { id: 'EMP-04', role: 'Senior Route Optimization Engineer', department: 'Systems Analytics', compensation: '$95,000 Base', yearsOfService: 3, retentionRisk: 'LOW', keyManDependency: false },
    ],
    HYDRO: [
      { id: 'EMP-11', role: 'Operations Manager & Master Electrician', department: 'Service Deployment', compensation: '$140,000 Base', yearsOfService: 12, retentionRisk: 'HIGH', keyManDependency: true },
      { id: 'EMP-12', role: 'Senior HVAC Field Installer Team Lead', department: 'Field Operations', compensation: '$95,000 Base', yearsOfService: 8, retentionRisk: 'LOW', keyManDependency: false },
      { id: 'EMP-13', role: 'Client Dispatch & Customer Care Lead', department: 'Client Relations', compensation: '$62,000 Base', yearsOfService: 6, retentionRisk: 'MEDIUM', keyManDependency: false },
    ],
    APEX: [
      { id: 'EMP-21', role: 'Senior Backend Engineer (System Architect)', department: 'Software Engineering', compensation: '$165,000 Base', yearsOfService: 4, retentionRisk: 'HIGH', keyManDependency: true },
      { id: 'EMP-22', role: 'Full Stack Engineer & Customer Support', department: 'Software Engineering', compensation: '$110,000 Base', yearsOfService: 2, retentionRisk: 'LOW', keyManDependency: false },
      { id: 'EMP-23', role: 'Product Growth Specialist', department: 'Growth & Marketing', compensation: '$90,000 Base', yearsOfService: 1, retentionRisk: 'MEDIUM', keyManDependency: false },
    ],
  };

  // Secure Documents
  const vaultDocuments: Record<'DELTA' | 'HYDRO' | 'APEX', SecureDocument[]> = {
    DELTA: [
      { id: 'DOC-D1', name: 'Comprehensive Quality of Earnings Report (QofE) - FY23.pdf', type: 'PDF Document', size: '14.2 MB', classification: 'CONFIDENTIAL', decrypted: false },
      { id: 'DOC-D2', name: 'Certified Corporate Tax Returns 1120S (3-Yr Unified).pdf', type: 'PDF Document', size: '28.1 MB', classification: 'CONFIDENTIAL', decrypted: false },
      { id: 'DOC-D3', name: 'Carrier Logistics Route Concentration Agreement.pdf', type: 'PDF Document', size: '4.8 MB', classification: 'PROPRIETARY', decrypted: false },
      { id: 'DOC-D4', name: 'W2 Employee Payroll Detail Breakdown.xlsx', type: 'Spreadsheet', size: '1.2 MB', classification: 'RESTRICTED', decrypted: false },
    ],
    HYDRO: [
      { id: 'DOC-H1', name: 'QofE Bridge Analysis - Commercial HVAC Master LLC.pdf', type: 'PDF Document', size: '8.4 MB', classification: 'CONFIDENTIAL', decrypted: false },
      { id: 'DOC-H2', name: 'Form 1065 US Partnership Tax Filings 2021-2023.pdf', type: 'PDF Document', size: '19.2 MB', classification: 'CONFIDENTIAL', decrypted: false },
      { id: 'DOC-H3', name: 'HVAC Inventory Assessment & Asset Ledger.pdf', type: 'PDF Document', size: '11.5 MB', classification: 'PROPRIETARY', decrypted: false },
    ],
    APEX: [
      { id: 'DOC-A1', name: 'SaaS Cohort Retention Analysis & Stripe Logs.xlsx', type: 'Spreadsheet', size: '34.6 MB', classification: 'RESTRICTED', decrypted: false },
      { id: 'DOC-A2', name: 'Corporate IP Registry & Software Repository Audit.pdf', type: 'PDF Document', size: '5.1 MB', classification: 'PROPRIETARY', decrypted: false },
    ],
  };

  const handleToggleAddback = (id: string) => {
    let updated;
    if (activeAddBacks.includes(id)) {
      updated = activeAddBacks.filter((item) => item !== id);
      addLog(`REMOVED ADDBACK #${id} FROM WORKING EBITDA CALCULATOR`, 'WARNING');
    } else {
      updated = [...activeAddBacks, id];
      addLog(`APPLIED ADDBACK #${id} TO WORKING EBITDA CALCULATOR`, 'SUCCESS');
    }
    setActiveAddBacks(updated);
  };

  // Calculations for interactive QofE
  const getFinancialBasics = () => {
    switch (selectedDeal) {
      case 'DELTA':
        return { baseEbitda: 320000, asking: 1850000 };
      case 'HYDRO':
        return { baseEbitda: 563000, asking: 2200000 };
      case 'APEX':
        return { baseEbitda: 187000, asking: 1980000 };
    }
  };

  const { baseEbitda, asking } = getFinancialBasics();

  // Dynamic EBITDA calculations
  const selectedAddbacksList = addBacks[selectedDeal];
  const activeAmount = selectedAddbacksList
    .filter((ab) => activeAddBacks.includes(ab.id))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const adjustedEbitda = baseEbitda + activeAmount;
  const impliedMultiple = asking / adjustedEbitda;

  // Handle Decryption simulation
  const handleDecryptAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decryptionKey) return;

    setIsDecrypting(true);
    addLog(`INITIATED VAULT DECRYPTION WITH KEY: ***${decryptionKey.substring(0, 3)}***`, 'WARNING');

    setTimeout(() => {
      if (decryptionKey.toUpperCase() === 'ACQUIRE-SECURE-99' || decryptionKey.toUpperCase() === 'ADMIN' || decryptionKey.length >= 4) {
        setIsAuthorized(true);
        setIsDecrypting(false);
        addLog('ACCESS GRANTED: PRIVATE CIM UNDERWRITING ENVELOPE UNLOCKED', 'SUCCESS');
      } else {
        setIsAuthorized(false);
        setIsDecrypting(false);
        addLog('DECRYPTION FAILURE: UNSANCTIONED TERMINAL ACCESS SIGNATURE DETECTED', 'ALERT');
        alert('DECRYPTION ERROR: INVALID DECRYPTION PASSKEY');
      }
    }, 1500);
  };

  const runReconcileCheck = () => {
    setIsVerifying(true);
    setVerificationProgress(0);
    addLog('RUNNING TRANSACTION RECONCILIATION CORRELATION RUN', 'WARNING');

    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVerifying(false);
          addLog('RECONCILIATION CORRELATION ENGINE: 100% AUDITED. ZERO CRITICAL SPREAD DEVIATIONS.', 'SUCCESS');
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  useEffect(() => {
    // Reset checked addbacks for each listing selection to look realistic
    const initialAddbacks = addBacks[selectedDeal].map((ab) => ab.id);
    setActiveAddBacks(initialAddbacks);
    addLog(`SWITCHED TERMINAL VIEWPORT TO listing: PROJECT ${selectedDeal}`, 'SUCCESS');
  }, [selectedDeal]);

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] font-sans antialiased border border-[#222]">
      {/* 1. Header / Secure Clean Room Status Bar */}
      <div className="bg-[#0c0c0c] border-b border-[#222] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#FF3333] text-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-tighter">SECURE UNDERWRITING VAULT</span>
            <span className="text-[10px] font-mono text-[#00FF66] tracking-widest font-bold">MIL-SPEC AES-256</span>
          </div>
          <h2 className="text-lg font-bold font-mono tracking-tight text-[#F9F9F9] mt-1">
            SECURE CIM DATA ROOM &amp; QUALITY OF EARNINGS ANALYZER
          </h2>
        </div>

        {/* Listing Selection Selector */}
        <div className="flex items-center bg-black border border-[#222] p-1">
          <span className="text-[10px] font-mono text-[#888] px-2 uppercase">CHOOSE PIPELINE:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setSelectedDeal('DELTA')}
              className={`px-3 py-1 font-mono text-xs font-bold transition-all ${
                selectedDeal === 'DELTA'
                  ? 'bg-[#00FF66] text-black'
                  : 'bg-[#111] text-[#888] hover:text-white'
              }`}
            >
              PROJECT DELTA
            </button>
            <button
              onClick={() => setSelectedDeal('HYDRO')}
              className={`px-3 py-1 font-mono text-xs font-bold transition-all ${
                selectedDeal === 'HYDRO'
                  ? 'bg-[#0EA5E9] text-black'
                  : 'bg-[#111] text-[#888] hover:text-white'
              }`}
            >
              PROJECT HYDRO
            </button>
            <button
              onClick={() => setSelectedDeal('APEX')}
              className={`px-3 py-1 font-mono text-xs font-bold transition-all ${
                selectedDeal === 'APEX'
                  ? 'bg-[#FF3333] text-white'
                  : 'bg-[#111] text-[#888] hover:text-white'
              }`}
            >
              PROJECT APEX
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top-Tier Interactive Financial Summary Widget */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#222] border-b border-[#222]">
        <div className="bg-[#050505] p-4 font-mono">
          <div className="text-[10px] text-[#888]">ASKING VALUATION</div>
          <div className="text-xl font-bold text-white mt-1">
            ${(asking / 1000000).toFixed(2)}M
          </div>
          <div className="text-[9px] text-[#444] mt-0.5">ESTIMATED VALUATION BASIS</div>
        </div>
        <div className="bg-[#050505] p-4 font-mono">
          <div className="text-[10px] text-[#888]">BASE SELLER EBITDA</div>
          <div className="text-xl font-bold text-[#FF3333] mt-1">
            ${(baseEbitda / 1000).toFixed(0)}K
          </div>
          <div className="text-[9px] text-[#444] mt-0.5">PRIOR TO ADDICTIONS &amp; SYNERGIES</div>
        </div>
        <div className="bg-[#050505] p-4 font-mono">
          <div className="text-[10px] text-[#888]">ADJUSTED QofE EBITDA</div>
          <div className="text-xl font-bold text-[#00FF66] mt-1">
            ${(adjustedEbitda / 1000).toFixed(0)}K
          </div>
          <div className="text-[9px] text-[#00FF66] mt-0.5 font-bold">
            +{((activeAmount / baseEbitda) * 100).toFixed(1)}% RECONCILED ADD-BACKS
          </div>
        </div>
        <div className="bg-[#050505] p-4 font-mono">
          <div className="text-[10px] text-[#888]">IMPLIED MULTIPLE</div>
          <div className="text-xl font-bold text-[#0EA5E9] mt-1">
            {impliedMultiple.toFixed(2)}x
          </div>
          <div className="text-[9px] text-[#888] mt-0.5">
            REDUCED FROM {(asking / baseEbitda).toFixed(2)}x ORIGINAL
          </div>
        </div>
      </div>

      {/* 3. Main Interface Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[500px]">
        {/* Left Rail Navigation Controls */}
        <div className="lg:col-span-3 bg-[#080808] border-r border-[#222] p-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="block font-mono text-[9px] text-[#888] tracking-widest uppercase mb-2">
              UNDERWRITING CATEGORIES
            </span>

            {/* Menu Buttons */}
            <button
              onClick={() => setActiveTab('qofe')}
              className={`w-full text-left p-3 font-mono text-xs flex items-center justify-between transition-all ${
                activeTab === 'qofe'
                  ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]'
                  : 'bg-black text-[#888] border border-[#111] hover:text-white'
              }`}
            >
              <span>[1] QofE ADJUSTED BRIDGE</span>
              <span>&rarr;</span>
            </button>

            <button
              onClick={() => setActiveTab('tax')}
              className={`w-full text-left p-3 font-mono text-xs flex items-center justify-between transition-all ${
                activeTab === 'tax'
                  ? 'bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]'
                  : 'bg-black text-[#888] border border-[#111] hover:text-white'
              }`}
            >
              <span>[2] TAX RECONCILIATIONS</span>
              <span>&rarr;</span>
            </button>

            <button
              onClick={() => setActiveTab('org')}
              className={`w-full text-left p-3 font-mono text-xs flex items-center justify-between transition-all ${
                activeTab === 'org'
                  ? 'bg-purple-950/20 text-purple-400 border border-purple-500/50'
                  : 'bg-black text-[#888] border border-[#111] hover:text-white'
              }`}
            >
              <span>[3] REDACTED ORG TREE</span>
              <span>&rarr;</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`w-full text-left p-3 font-mono text-xs flex items-center justify-between transition-all ${
                activeTab === 'vault'
                  ? 'bg-[#FF3333]/10 text-[#FF3333] border border-[#FF3333]'
                  : 'bg-black text-[#888] border border-[#111] hover:text-white'
              }`}
            >
              <span>[4] SECURE DOCUMENT VAULT</span>
              <span className="bg-[#FF3333] text-black text-[9px] font-bold px-1 py-0.2">KEY</span>
            </button>
          </div>

          {/* Quick Terminal Integrity Checklist */}
          <div className="mt-8 pt-4 border-t border-[#222] space-y-3 font-mono">
            <span className="text-[9px] text-[#888] tracking-widest uppercase block">
              SYSTEM INTEGRITY CHECKS
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-[#00FF66]">
                <span>&bull; BANK FEEDS VERIFIED</span>
                <span>[OK]</span>
              </div>
              <div className="flex items-center justify-between text-[#00FF66]">
                <span>&bull; W2 REGISTER AUDITED</span>
                <span>[100%]</span>
              </div>
              <div className="flex items-center justify-between text-[#0EA5E9]">
                <span>&bull; 1120S TAX CORRELATION</span>
                <span>[SECURE]</span>
              </div>
              <div className="flex items-center justify-between text-[#FF3333]">
                <span>&bull; CIM ACCESS LOGS DETECTED</span>
                <span>[3 ACTIVE]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Area */}
        <div className="lg:col-span-9 bg-[#050505] p-6 flex flex-col justify-between">
          
          {/* TAB 1: QofE Bridge */}
          {activeTab === 'qofe' && (
            <div className="space-y-6">
              <div className="border-b border-[#222] pb-3">
                <h3 className="font-mono text-sm font-bold text-[#00FF66] tracking-wider uppercase">
                  Quality of Earnings Addback Reconciliation Model
                </h3>
                <p className="text-xs text-[#888] font-mono mt-1">
                  Adjust corporate EBITDA calculations live by selecting/omitting verified owner discretionary add-backs.
                </p>
              </div>

              {/* Dynamic Simulated Bridge Chart */}
              <div className="bg-black border border-[#222] p-4 space-y-4">
                <span className="text-[10px] font-mono text-[#888] tracking-widest block uppercase">
                  Adjusted EBITDA Bridge Visualization
                </span>

                <div className="space-y-3">
                  {/* Base Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#888]">Baseline Ledger EBITDA:</span>
                      <span className="text-white">${(baseEbitda / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full bg-[#111] h-3 border border-[#222]">
                      <div className="bg-[#FF3333] h-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  {/* Add-backs segment */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#00FF66]">Active Reconciled Add-backs:</span>
                      <span className="text-[#00FF66]">+${(activeAmount / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full bg-[#111] h-3 border border-[#222]">
                      <div className="bg-[#00FF66] h-full" style={{ width: `${Math.min((activeAmount / baseEbitda) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Combined total */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-[#0EA5E9]">Projected Adjusted EBITDA:</span>
                      <span className="text-[#0EA5E9]">${(adjustedEbitda / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full bg-[#111] h-4 border border-[#222]">
                      <div className="bg-gradient-to-r from-[#FF3333] to-[#00FF66] h-full" style={{ width: `${Math.min((adjustedEbitda / 1000000) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active list checklist */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-[#888] tracking-widest block uppercase">
                  Interactive Add-back Ledger Items
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {addBacks[selectedDeal].map((ab) => (
                    <div
                      key={ab.id}
                      onClick={() => handleToggleAddback(ab.id)}
                      className={`p-3 border cursor-pointer font-mono transition-all flex flex-col justify-between ${
                        activeAddBacks.includes(ab.id)
                          ? 'border-[#00FF66] bg-[#00FF66]/5'
                          : 'border-[#222] bg-black hover:border-[#444]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-[#888] bg-[#111] border border-[#222] px-1 py-0.2">
                            {ab.category}
                          </span>
                          <span className={`text-[9px] ${activeAddBacks.includes(ab.id) ? 'text-[#00FF66]' : 'text-neutral-500'}`}>
                            {activeAddBacks.includes(ab.id) ? '[SELECTED]' : '[EXCLUDED]'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug">{ab.name}</h4>
                        <p className="text-[10px] text-neutral-400 mt-1 leading-normal">{ab.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#222]/50">
                        <span className="text-xs font-bold text-[#00FF66]">+${ab.amount.toLocaleString()}</span>
                        {ab.verified ? (
                          <span className="text-[8px] bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/30 px-1">CPA VERIFIED</span>
                        ) : (
                          <span className="text-[8px] bg-[#FF3333]/10 text-[#FF3333] border border-[#FF3333]/30 px-1">ESTIMATED</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Tax Reconciliation */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              <div className="border-b border-[#222] pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <h3 className="font-mono text-sm font-bold text-[#0ea5e9] tracking-wider uppercase">
                    Tax Return vs. Internal Books (Variance Matrix)
                  </h3>
                  <p className="text-xs text-[#888] font-mono mt-1">
                    Compare Form 1120S schedules directly to the internal general ledgers.
                  </p>
                </div>

                <button
                  onClick={runReconcileCheck}
                  disabled={isVerifying}
                  className="px-3 py-1 bg-[#0ea5e9]/10 hover:bg-[#0ea5e9]/20 text-[#0ea5e9] border border-[#0ea5e9] font-mono text-xs font-semibold uppercase tracking-wider"
                >
                  {isVerifying ? 'CALCULATING VARIANCES...' : 'RUN INTEGRITY CHECK'}
                </button>
              </div>

              {/* Progress Indicator */}
              {isVerifying && (
                <div className="bg-black border border-[#222] p-3 font-mono space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Reconciliation Matrix Scanner: Active</span>
                    <span className="text-[#0ea5e9]">{verificationProgress}%</span>
                  </div>
                  <div className="w-full bg-[#111] h-2">
                    <div className="bg-[#0ea5e9] h-full" style={{ width: `${verificationProgress}%` }}></div>
                  </div>
                </div>
              )}

              {/* Data Table */}
              <div className="overflow-x-auto border border-[#222]">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0c0c0c] border-b border-[#222] text-[#888]">
                      <th className="p-3">LINE RECONCILIATION OBJECT</th>
                      <th className="p-3 text-right">INTERNAL LEDGER</th>
                      <th className="p-3 text-right">FORM 1120S SCHEDULE</th>
                      <th className="p-3 text-right">VARIANCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxReconciliation[selectedDeal].map((line, idx) => (
                      <React.Fragment key={idx}>
                        <tr className="border-b border-[#111] hover:bg-[#0c0c0c]/50">
                          <td className="p-3 font-bold text-white">{line.item}</td>
                          <td className="p-3 text-right text-white font-semibold">${line.quickbooks.toLocaleString()}</td>
                          <td className="p-3 text-right text-white font-semibold">${line.taxReturn.toLocaleString()}</td>
                          <td className={`p-3 text-right font-bold ${line.variance === 0 ? 'text-[#00FF66]' : 'text-[#FF3333]'}`}>
                            {line.variance > 0 ? `+$${line.variance.toLocaleString()}` : line.variance < 0 ? `-$${Math.abs(line.variance).toLocaleString()}` : '$0'}
                          </td>
                        </tr>
                        <tr className="bg-[#080808]/40 border-b border-[#222]">
                          <td colSpan={4} className="p-2.5 px-3 text-[10px] text-neutral-400 font-mono italic">
                            <span className="text-[#0ea5e9] font-bold uppercase not-italic mr-1.5">[CPA MEMO]:</span>
                            {line.note}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-[#222] text-[11px] font-mono leading-relaxed text-[#888]">
                <span className="text-[#0ea5e9] font-bold block mb-1">AUDIT MECHANICS OVERVIEW</span>
                Differences between the tax return schedules and QuickBooks ledger entries occur normally due to depreciation write-offs (Form 4562) and Cash-to-Accrual adjustments. Any structural variations exceeding 2% are systematically flagged in this clean room portal.
              </div>
            </div>
          )}

          {/* TAB 3: Redacted Org Tree */}
          {activeTab === 'org' && (
            <div className="space-y-6">
              <div className="border-b border-[#222] pb-3">
                <h3 className="font-mono text-sm font-bold text-purple-400 tracking-wider uppercase">
                  Redacted Employee Hierarchy &amp; Retention Analytics
                </h3>
                <p className="text-xs text-[#888] font-mono mt-1">
                  Visualize key-man dependencies, operational staffing structure, and post-close flight risks. Names redacted for security.
                </p>
              </div>

              {/* Redacted tree simulation */}
              <div className="bg-black border border-[#222] p-4 font-mono space-y-4">
                <span className="text-[10px] text-purple-400 tracking-widest block uppercase">
                  ACTIVE MANAGEMENT ORG MAP
                </span>

                <div className="space-y-4">
                  {employeeOrgTree[selectedDeal].map((emp) => (
                    <div key={emp.id} className="border border-purple-950 bg-purple-950/5 p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-purple-900/50 text-purple-300 font-mono text-[9px] px-1.5 py-0.2 border border-purple-700/40">
                            {emp.id}
                          </span>
                          <span className="text-xs font-bold text-white">{emp.role}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-1">
                          DEPT: <span className="text-white">{emp.department}</span> | TENURE: <span className="text-white">{emp.yearsOfService} Years</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {emp.keyManDependency && (
                          <span className="text-[9px] font-mono bg-[#FF3333]/10 text-[#FF3333] border border-[#FF3333]/30 px-1.5 py-0.2">
                            KEY MAN RISK
                          </span>
                        )}
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${
                          emp.retentionRisk === 'LOW'
                            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'
                            : emp.retentionRisk === 'MEDIUM'
                            ? 'bg-amber-950/30 text-amber-400 border-amber-900/50'
                            : 'bg-red-950/30 text-red-400 border-red-900/50'
                        }`}>
                          RISK: {emp.retentionRisk}
                        </span>
                        <div className="text-xs font-mono text-right font-bold text-[#00FF66] bg-[#0c0c0c] border border-[#222] px-2 py-1">
                          {emp.compensation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-purple-950/5 border border-purple-900/20 text-[11px] font-mono leading-relaxed text-neutral-400">
                <span className="text-purple-400 font-bold block mb-1">REQUISITE DE-CONCENTRATION PROTOCOL</span>
                For personnel labeled with <span className="text-[#FF3333] font-bold">KEY MAN RISK</span>, it is recommended that the buyer secure a minimum of 90-days structured onboarding transition consulting terms and post-acquisition employment performance earn-out milestones inside the final Definitive Purchase Agreement (DPA).
              </div>
            </div>
          )}

          {/* TAB 4: Secure Vault / Encrypted Document Area */}
          {activeTab === 'vault' && (
            <div className="space-y-6">
              <div className="border-b border-[#222] pb-3">
                <h3 className="font-mono text-sm font-bold text-[#FF3333] tracking-wider uppercase">
                  Encrypted File Room &amp; Transaction Vault
                </h3>
                <p className="text-xs text-[#888] font-mono mt-1">
                  Access restricted legal assets, complete tax binders, and the official Confidential Information Memorandum (CIM).
                </p>
              </div>

              {/* Decryption Controller */}
              {!isAuthorized ? (
                <div className="border border-[#FF3333]/30 bg-[#FF3333]/5 p-6 space-y-4">
                  <div className="flex items-start space-x-3 text-[#FF3333]">
                    <span className="font-mono text-sm font-bold">[VAULT ENCRYPTED]</span>
                    <p className="text-xs font-mono leading-relaxed text-[#F9F9F9]">
                      Access to these underwriting assets is bound by active Non-Disclosure Agreements (NDA). Enter your terminal Operator Access Key to execute file decryption protocols.
                    </p>
                  </div>

                  <form onSubmit={handleDecryptAttempt} className="flex flex-col md:flex-row items-stretch gap-2">
                    <input
                      type="password"
                      placeholder="ENTER SECURE ACCESS PASSKEY (e.g. ACQUIRE-SECURE-99)"
                      value={decryptionKey}
                      onChange={(e) => setDecryptionKey(e.target.value)}
                      className="bg-black border border-[#222] text-xs font-mono text-white p-3 flex-grow outline-none focus:border-[#FF3333] placeholder:text-[#444]"
                    />
                    <button
                      type="submit"
                      disabled={isDecrypting}
                      className="bg-[#FF3333] text-black font-mono text-xs font-bold px-6 py-3 tracking-widest hover:bg-white hover:text-black transition-all uppercase"
                    >
                      {isDecrypting ? 'DECRYPTING...' : 'UNLOCK VAULT'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="border border-[#00FF66]/30 bg-[#00FF66]/5 p-4 flex justify-between items-center font-mono">
                  <div className="text-xs">
                    <span className="text-[#00FF66] font-bold">[VAULT FULLY UNLOCKED]</span> SECURED SESSION ID: #ETA-7922-DATA-VAULT
                  </div>
                  <button
                    onClick={() => {
                      setIsAuthorized(false);
                      setDecryptionKey('');
                      addLog('TERMINATED PRIVATE DATA VAULT DECRYPTION CONSOLE', 'WARNING');
                    }}
                    className="text-xs bg-[#FF3333] text-black px-2 py-1 font-bold"
                  >
                    LOCK PORTAL
                  </button>
                </div>
              )}

              {/* List of files */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#888] tracking-widest block uppercase">
                  VAULT INDEX FOR LISTING: PROJECT {selectedDeal}
                </span>

                <div className="space-y-2">
                  {vaultDocuments[selectedDeal].map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3.5 border font-mono flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-all ${
                        isAuthorized ? 'bg-black border-[#222] hover:border-[#444]' : 'bg-[#080808] border-[#222] opacity-60'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 border ${isAuthorized ? 'border-[#0ea5e9] text-[#0ea5e9]' : 'border-neutral-800 text-neutral-600'}`}>
                          {doc.type === 'Spreadsheet' ? 'XLSX' : 'PDF'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{isAuthorized ? doc.name : '*********************************************************'}</span>
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            SIZE: {doc.size} | LEVEL: <span className="text-[#FF3333] font-bold">{doc.classification}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        disabled={!isAuthorized}
                        onClick={() => {
                          addLog(`DOWNLOAD REQUEST CONFLICT APPROVED FOR FILE: ${doc.name}`, 'SUCCESS');
                          alert(`Simulating secure payload download: ${doc.name}`);
                        }}
                        className={`px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider uppercase transition-all ${
                          isAuthorized
                            ? 'bg-[#00FF66] text-black hover:bg-white'
                            : 'bg-[#111] text-[#444] border border-neutral-900 cursor-not-allowed'
                        }`}
                      >
                        {isAuthorized ? 'DOWNLOAD DECRYPTED' : 'LOCKED'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Live Audited Console Session Output Tracker */}
          <div className="mt-8 pt-4 border-t border-[#222] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-[#FF3333] tracking-widest uppercase font-bold">
                DATA ROOM OPERATOR ACCESS LOGS (LIVE SECURE AUDITING)
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
            </div>

            <div className="bg-black border border-[#222] p-3 max-h-24 overflow-y-auto font-mono text-[10px] space-y-1 scrollbar-thin">
              {logs.map((log, index) => (
                <div key={index} className="flex justify-between text-neutral-400">
                  <div className="space-x-2">
                    <span className="text-[#888]">[{log.timestamp}]</span>
                    <span className={log.status === 'SUCCESS' ? 'text-[#00FF66]' : log.status === 'ALERT' ? 'text-[#FF3333]' : 'text-[#0EA5E9]'}>
                      {log.action}
                    </span>
                  </div>
                  <span className="text-neutral-600 font-bold">{log.operator}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}