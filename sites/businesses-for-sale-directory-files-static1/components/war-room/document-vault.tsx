import React, { useState, useMemo } from 'react';

// Custom Interfaces matching the Terminal data structures
interface Deal {
  id: string;
  codename: string;
  industry: string;
  concentrationRisk: number; // % of revenue in top customer
  workingCapitalTarget: number; // USD Target
  workingCapitalActual: number; // USD Actual
  keyManMonths: number; // Transition period offered
  totalEbitda: number;
}

interface Task {
  id: string;
  title: string;
  stage: 'LOI' | 'QOFE' | 'LEGAL' | 'CLOSING';
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  owner: string;
  completed: boolean;
  riskType: 'concentration' | 'working_capital' | 'key_man' | 'general';
}

interface DocNode {
  id: string;
  name: string;
  category: 'FINANCIAL' | 'LEGAL' | 'OPERATIONS' | 'TAX' | 'CREDIT';
  size: string;
  hash: string;
  verified: boolean;
  isVerifying?: boolean;
}

export default function DocumentVaultAndWarRoom() {
  // Preset Active Deals from the main terminal pool
  const DEALS: Deal[] = [
    {
      id: 'DL-8902',
      codename: 'Project Delta',
      industry: 'B2B Logistics Agency',
      concentrationRisk: 35,
      workingCapitalTarget: 400000,
      workingCapitalActual: 385000,
      keyManMonths: 12,
      totalEbitda: 620000,
    },
    {
      id: 'DL-4411',
      codename: 'Project Cobalt',
      industry: 'HVAC & Air Treatment Systems',
      concentrationRisk: 8,
      workingCapitalTarget: 250000,
      workingCapitalActual: 265000,
      keyManMonths: 18,
      totalEbitda: 950000,
    },
    {
      id: 'DL-5520',
      codename: 'Project Cipher',
      industry: 'SaaS Property Management',
      concentrationRisk: 4,
      workingCapitalTarget: 100000,
      workingCapitalActual: 950000,
      keyManMonths: 6,
      totalEbitda: 420000,
    },
    {
      id: 'DL-7109',
      codename: 'Project Horizon',
      industry: 'Precision Tooling Shop',
      concentrationRisk: 42,
      workingCapitalTarget: 600000,
      workingCapitalActual: 480000,
      keyManMonths: 24,
      totalEbitda: 1200000,
    },
  ];

  // System Task Pipeline State
  const INITIAL_TASKS: Task[] = [
    { id: 'TSK-101', title: 'Execute Letter of Intent (LOI) with escrow rider', stage: 'LOI', priority: 'CRITICAL', owner: 'M. Vance', completed: true, riskType: 'general' },
    { id: 'TSK-102', title: 'Audit 3-year trailing bank deposit reconciliations', stage: 'QOFE', priority: 'CRITICAL', owner: 'R. Kincaid', completed: false, riskType: 'working_capital' },
    { id: 'TSK-103', title: 'Verify customer concentration clawback clause in APA draft', stage: 'LEGAL', priority: 'HIGH', owner: 'H. Stone', completed: false, riskType: 'concentration' },
    { id: 'TSK-104', title: 'Verify key-man 12-month employment contract schedule', stage: 'LEGAL', priority: 'HIGH', owner: 'H. Stone', completed: false, riskType: 'key_man' },
    { id: 'TSK-105', title: 'Finalize working capital peg and adjustments timeline', stage: 'QOFE', priority: 'NORMAL', owner: 'R. Kincaid', completed: false, riskType: 'working_capital' },
    { id: 'TSK-106', title: 'Filing Certificate of Good Standing (Delaware state node)', stage: 'CLOSING', priority: 'NORMAL', owner: 'M. Vance', completed: false, riskType: 'general' },
    { id: 'TSK-107', title: 'Review major commercial lease transition terms', stage: 'LEGAL', priority: 'NORMAL', owner: 'H. Stone', completed: true, riskType: 'general' },
    { id: 'TSK-108', title: 'Confirm SBA equity injection bank wire pathways', stage: 'CLOSING', priority: 'CRITICAL', owner: 'M. Vance', completed: false, riskType: 'general' },
  ];

  // Document Vault Nodes
  const INITIAL_DOCS: DocNode[] = [
    { id: 'DOC-501', name: 'QofE_Preliminary_Report_v2.pdf', category: 'FINANCIAL', size: '12.4 MB', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', verified: true },
    { id: 'DOC-502', name: 'APA_Executed_Draft_Clean.docx', category: 'LEGAL', size: '4.8 MB', hash: '8f3c723f6d7a4b0c1e8f9a2b5d4c3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d', verified: true },
    { id: 'DOC-503', name: 'Top_10_Customer_Material_Agreements.zip', category: 'OPERATIONS', size: '42.1 MB', hash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b', verified: false },
    { id: 'DOC-504', name: 'Tax_Returns_Form_1120S_3Y_IRS_Stamped.pdf', category: 'TAX', size: '18.9 MB', hash: 'f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2', verified: true },
    { id: 'DOC-505', name: 'Interim_SBA_Debt_Commitment_Letter.pdf', category: 'CREDIT', size: '2.1 MB', hash: '2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c', verified: false },
  ];

  // App States
  const [selectedDealId, setSelectedDealId] = useState<string>('DL-8902');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [docs, setDocs] = useState<DocNode[]>(INITIAL_DOCS);
  const [logConsole, setLogConsole] = useState<string[]>([
    'SYSTEM INIT // WAR ROOM DEPLOYED SUCCESSFULLY',
    'CONNECTED SECURE SHA-256 VAULT GATEWAY',
    'MONITORING ACQUISITION DRILL DOWN PIPELINE...'
  ]);

  // Input states for dynamic additions
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStage, setNewTaskStage] = useState<Task['stage']>('LOI');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('NORMAL');
  const [newTaskRisk, setNewTaskRisk] = useState<Task['riskType']>('general');

  // Simulated drag-and-drop file upload progress
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Active Deal Computed state
  const activeDeal = useMemo(() => {
    return DEALS.find(d => d.id === selectedDealId) || DEALS[0];
  }, [selectedDealId, DEALS]);

  // Push messages into custom simulated console
  const logAction = (msg: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogConsole(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 15)]);
  };

  // Switch Active Deal context
  const handleDealChange = (id: string) => {
    setSelectedDealId(id);
    logAction(`CONTEXT SWITCH: LOADED SYSTEM DATASET FOR [${id}]`);
  };

  // Toggle Task Completion State
  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedState = !t.completed;
          logAction(`TASK STATUS UPDATE: [${taskId}] marked ${updatedState ? 'VERIFIED' : 'PENDING'}`);
          return { ...t, completed: updatedState };
        }
        return t;
      })
    );
  };

  // Create new task dynamic injector
  const createNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newId = `TSK-${Math.floor(100 + Math.random() * 900)}`;
    const freshTask: Task = {
      id: newId,
      title: newTaskTitle.trim(),
      stage: newTaskStage,
      priority: newTaskPriority,
      owner: 'CMD USER',
      completed: false,
      riskType: newTaskRisk
    };

    setTasks(prev => [...prev, freshTask]);
    logAction(`PIPELINE TASK ADDED: [${newId}] - ${freshTask.title}`);
    setNewTaskTitle('');
  };

  // Trigger simulated Sha-256 Vault Verification
  const verifyDocHash = (docId: string) => {
    setDocs(prev =>
      prev.map(d => {
        if (d.id === docId) {
          logAction(`SHA-256 INTEGRITY START: HASH_CHECKING [${d.name}]`);
          return { ...d, isVerifying: true };
        }
        return d;
      })
    );

    setTimeout(() => {
      setDocs(prev =>
        prev.map(d => {
          if (d.id === docId) {
            logAction(`SHA-256 INTEGRITY SUCCESS: DOCUMENT MATCHED TRUSTED ANCHOR [${d.id}]`);
            return { ...d, verified: true, isVerifying: false };
          }
          return d;
        })
      );
    }, 1200);
  };

  // Upload simulation handler
  const simulateUpload = () => {
    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);
    logAction('INITIALIZING PARALLEL MULTI-PART FILE STREAM...');

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const mockDoc: DocNode = {
              id: `DOC-${Math.floor(600 + Math.random() * 99)}`,
              name: `uploaded_audit_ledger_${Date.now().toString().slice(-4)}.xlsx`,
              category: 'FINANCIAL',
              size: '4.2 MB',
              hash: '4a5e6f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e',
              verified: false
            };
            setDocs(prevDocs => [...prevDocs, mockDoc]);
            setIsUploading(false);
            logAction(`STREAM RECEIVED: File "${mockDoc.name}" locked into structural block vault.`);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  // Drag and Drop simulation trigger
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    simulateUpload();
  };

  // Risk Rating Computation based on Deal & Task items remaining
  const customerConcentrationRiskRating = useMemo(() => {
    const isCritical = activeDeal.concentrationRisk > 30;
    const mitigatedTasks = tasks.filter(t => t.riskType === 'concentration' && t.completed).length;
    const totalRiskTasks = tasks.filter(t => t.riskType === 'concentration').length;
    const mitigationPercent = totalRiskTasks > 0 ? (mitigatedTasks / totalRiskTasks) * 100 : 100;

    return {
      percentage: activeDeal.concentrationRisk,
      isCritical,
      mitigationPercent,
      statusText: isCritical && mitigationPercent < 50 ? 'UNMITIGATED CONCENTRATION EXPOSURE' : 'STABILIZED PIPELINE RISK'
    };
  }, [activeDeal, tasks]);

  const workingCapitalGap = useMemo(() => {
    const gap = activeDeal.workingCapitalTarget - activeDeal.workingCapitalActual;
    const isUnder = gap > 0;
    return {
      gap,
      isUnder,
      target: activeDeal.workingCapitalTarget,
      actual: activeDeal.workingCapitalActual
    };
  }, [activeDeal]);

  const transitionSafetyIndex = useMemo(() => {
    // Standard safety metric based on transitional backup commitment
    const months = activeDeal.keyManMonths;
    if (months >= 18) return { rating: 'EXCELLENT', color: 'text-[#00FF66]', percent: 95 };
    if (months >= 12) return { rating: 'ADEQUATE', color: 'text-[#0EA5E9]', percent: 75 };
    return { rating: 'CRITICAL / SHORT', color: 'text-[#FF3333]', percent: 45 };
  }, [activeDeal]);

  return (
    <div className="bg-[#050505] text-[#F9F9F9] min-h-screen font-mono flex flex-col antialiased selection:bg-[#00FF66] selection:text-[#050505] p-4 md:p-6 lg:p-8 space-y-6">
      
      {/* 1. SECTION TOP NAV HEADER */}
      <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#00FF66] animate-pulse"></span>
            <span className="text-xs text-[#888888] tracking-widest uppercase">// SECURE WAR ROOM DIALOGUE</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold uppercase tracking-wider text-[#F9F9F9]">
            Due Diligence War Room <span className="text-[#0EA5E9]">&</span> Document Vault
          </h1>
        </div>

        {/* Real-time selector & connection indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] text-[#888888] uppercase">Deal Pipeline Focus:</span>
          <div className="relative">
            <select
              value={selectedDealId}
              onChange={(e) => handleDealChange(e.target.value)}
              className="bg-[#111111] border border-[#222222] text-[#00FF66] text-xs px-3 py-1.5 focus:border-[#00FF66] focus:outline-none uppercase font-mono tracking-widest cursor-pointer"
            >
              {DEALS.map(d => (
                <option key={d.id} value={d.id} className="bg-[#050505]">
                  {d.id} : {d.codename}
                </option>
              ))}
            </select>
          </div>
          <div className="border border-[#222222] px-2 py-1 bg-[#111111] text-[10px] text-[#00FF66] font-bold">
            AES-256 STATE: ACTIVE
          </div>
        </div>
      </div>

      {/* 2. THREE-PANEL HIGH DENSITY RISK DIAGNOSTIC BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Risk Column 1: Customer Concentration */}
        <div className={`border p-4 bg-[#0a0a0a] flex flex-col justify-between ${customerConcentrationRiskRating.isCritical ? 'border-[#FF3333]' : 'border-[#222222]'}`}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-[#888888] uppercase tracking-wider">01 // Concentration Exposure</span>
            <span className={`text-[9px] px-1.5 py-0.5 border font-bold ${customerConcentrationRiskRating.isCritical ? 'border-[#FF3333] text-[#FF3333] bg-[#FF3333]/5' : 'border-[#222222] text-[#888888]'}`}>
              {customerConcentrationRiskRating.isCritical ? 'CRITICAL METRIC' : 'NORMAL RANGE'}
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-bold tracking-tight ${customerConcentrationRiskRating.isCritical ? 'text-[#FF3333]' : 'text-[#00FF66]'}`}>
                {customerConcentrationRiskRating.percentage}%
              </span>
              <span className="text-xs text-[#888888]">Gross Operational Revenue</span>
            </div>
            <p className="text-[10px] text-[#888888] mt-1 leading-relaxed">
              Target concentration limits are &lt;15%. Active transaction risks need contractual indemnifications or earn-out protections.
            </p>
          </div>
          <div className="border-t border-[#222222] pt-2 mt-1">
            <div className="flex justify-between text-[9px] text-[#888888] mb-1">
              <span>LEGAL CLAUSE MITIGATION STATUS:</span>
              <span className="text-[#F9F9F9] font-bold">{Math.round(customerConcentrationRiskRating.mitigationPercent)}% RESOLVED</span>
            </div>
            <div className="w-full bg-[#111111] h-1">
              <div 
                className={`h-full ${customerConcentrationRiskRating.isCritical ? 'bg-[#FF3333]' : 'bg-[#00FF66]'}`} 
                style={{ width: `${customerConcentrationRiskRating.mitigationPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Risk Column 2: Working Capital PEG Audit */}
        <div className="border border-[#222222] p-4 bg-[#0a0a0a] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-[#888888] uppercase tracking-wider">02 // Working Capital Peg Gap</span>
            <span className="text-[9px] px-1.5 py-0.5 border border-[#222222] text-[#0EA5E9] bg-[#0EA5E9]/5 font-bold">
              AUDITED BASELINE
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-bold tracking-tight ${workingCapitalGap.isUnder ? 'text-[#FF3333]' : 'text-[#00FF66]'}`}>
                {workingCapitalGap.gap > 0 ? `-$${(workingCapitalGap.gap / 1000).toFixed(0)}K` : `+$${(Math.abs(workingCapitalGap.gap) / 1000).toFixed(0)}K`}
              </span>
              <span className="text-xs text-[#888888]">Deficit vs Target Baseline</span>
            </div>
            <p className="text-[10px] text-[#888888] mt-1 leading-relaxed">
              Target: <span className="text-[#F9F9F9]">${workingCapitalGap.target.toLocaleString()}</span> | Actual Net Assets: <span className="text-[#F9F9F9]">${workingCapitalGap.actual.toLocaleString()}</span>. 
              {workingCapitalGap.isUnder ? ' Seller must leave adjustment credit at legal closing.' : ' Buffer satisfies operational safety index.'}
            </p>
          </div>
          <div className="border-t border-[#222222] pt-2 mt-1">
            <div className="flex justify-between text-[9px] text-[#888888] mb-1">
              <span>TARGET PEG COVERAGE:</span>
              <span className="text-[#0EA5E9] font-bold">
                {Math.min(100, Math.round((workingCapitalGap.actual / workingCapitalGap.target) * 100))}%
              </span>
            </div>
            <div className="w-full bg-[#111111] h-1">
              <div 
                className="h-full bg-[#0EA5E9]" 
                style={{ width: `${Math.min(100, (workingCapitalGap.actual / workingCapitalGap.target) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Risk Column 3: Key-Man Transition Risks */}
        <div className="border border-[#222222] p-4 bg-[#0a0a0a] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-[#888888] uppercase tracking-wider">03 // Seller Transition Buffer</span>
            <span className={`text-[9px] px-1.5 py-0.5 border border-[#222222] font-bold ${transitionSafetyIndex.color}`}>
              {transitionSafetyIndex.rating}
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-bold tracking-tight ${transitionSafetyIndex.color}`}>
                {activeDeal.keyManMonths} MONTHS
              </span>
              <span className="text-xs text-[#888888]">Post-Close Handoff Period</span>
            </div>
            <p className="text-[10px] text-[#888888] mt-1 leading-relaxed">
              Provides operational stability during critical customer renewals and onboarding of incoming search team executives.
            </p>
          </div>
          <div className="border-t border-[#222222] pt-2 mt-1">
            <div className="flex justify-between text-[9px] text-[#888888] mb-1">
              <span>OPERATIONAL PERSISTENCE SECURITY INDEX:</span>
              <span className="text-[#F9F9F9] font-bold">{transitionSafetyIndex.percent}%</span>
            </div>
            <div className="w-full bg-[#111111] h-1">
              <div 
                className={`h-full ${activeDeal.keyManMonths >= 12 ? 'bg-[#00FF66]' : 'bg-[#FF3333]'}`} 
                style={{ width: `${transitionSafetyIndex.percent}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. DENSE KANBAN BOARD & ADD TASK FORM */}
      <div className="border border-[#222222] bg-[#0a0a0a]">
        
        {/* Kanban Section Header */}
        <div className="border-b border-[#222222] bg-[#0c0c0c] p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-[#0EA5E9] font-bold uppercase tracking-wider">// PIPELINE TASK MATRIX</span>
            <h2 className="text-sm font-bold uppercase text-[#F9F9F9]">DUE DILIGENCE WAR ROOM PIPELINE</h2>
          </div>

          {/* Quick Task Injector Form */}
          <form onSubmit={createNewTask} className="w-full lg:w-auto flex flex-wrap items-center gap-2">
            <input 
              type="text" 
              placeholder="Inject new technical task..." 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs px-3 py-1.5 focus:border-[#00FF66] focus:outline-none placeholder-[#888888] flex-grow sm:flex-none sm:w-64"
            />
            
            <select
              value={newTaskStage}
              onChange={(e) => setNewTaskStage(e.target.value as Task['stage'])}
              className="bg-[#050505] border border-[#222222] text-[#888888] text-xs px-2 py-1.5 focus:border-[#00FF66] focus:outline-none uppercase"
            >
              <option value="LOI">LOI</option>
              <option value="QOFE">QofE</option>
              <option value="LEGAL">Legal</option>
              <option value="CLOSING">Closing</option>
            </select>

            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
              className="bg-[#050505] border border-[#222222] text-[#888888] text-xs px-2 py-1.5 focus:border-[#00FF66] focus:outline-none uppercase"
            >
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="NORMAL">Normal</option>
            </select>

            <select
              value={newTaskRisk}
              onChange={(e) => setNewTaskRisk(e.target.value as Task['riskType'])}
              className="bg-[#050505] border border-[#222222] text-[#888888] text-xs px-2 py-1.5 focus:border-[#00FF66] focus:outline-none uppercase"
            >
              <option value="general">No Association</option>
              <option value="concentration">Concentration Risk</option>
              <option value="working_capital">Working Cap Risk</option>
              <option value="key_man">Key-Man Risk</option>
            </select>

            <button 
              type="submit" 
              className="bg-[#00FF66] text-[#050505] hover:bg-transparent hover:text-[#00FF66] border border-[#00FF66] font-bold text-xs px-4 py-1.5 uppercase transition-all duration-150"
            >
              + Add Node
            </button>
          </form>
        </div>

        {/* 4-Column Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#222222]">
          
          {/* Column A: Letter of Intent (LOI) */}
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider">[1] LETTER OF INTENT (LOI)</span>
              <span className="text-[10px] text-[#888888]">
                {tasks.filter(t => t.stage === 'LOI' && t.completed).length} / {tasks.filter(t => t.stage === 'LOI').length} Done
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.filter(t => t.stage === 'LOI').map(task => (
                <div 
                  key={task.id} 
                  className={`border p-3 bg-[#050505] relative transition-all duration-150 hover:border-[#0EA5E9] ${task.completed ? 'opacity-60 border-[#222222]' : 'border-[#222222]'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] px-1.5 py-0.5 border border-[#222222] text-[#888888] bg-[#111111]" x-text="task.id">{task.id}</span>
                    <span className={`text-[9px] uppercase tracking-widest px-1 font-bold ${
                      task.priority === 'CRITICAL' ? 'text-[#FF3333]' : task.priority === 'HIGH' ? 'text-[#0EA5E9]' : 'text-[#888888]'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <h4 className={`text-xs ${task.completed ? 'line-through text-[#888888]' : 'text-[#F9F9F9]'}`}>{task.title}</h4>
                  
                  {/* Task Metadata Indicator tags */}
                  {task.riskType !== 'general' && (
                    <div className="mt-2 text-[8px] uppercase tracking-wider text-[#0EA5E9]">
                      ⚠ linked to: {task.riskType.replace('_', ' ')}
                    </div>
                  )}

                  <div className="border-t border-[#111111] pt-2 mt-3 flex justify-between items-center">
                    <span className="text-[9px] text-[#888888]">OWNER: {task.owner}</span>
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`text-[9px] uppercase px-2 py-0.5 border ${
                        task.completed ? 'border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/10' : 'border-[#222222] text-[#888888] hover:border-[#00FF66] hover:text-[#00FF66]'
                      }`}
                    >
                      {task.completed ? '■ DONE' : '□ VERIFY'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Quality of Earnings (QofE) */}
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider">[2] QUALITY OF EARNINGS</span>
              <span className="text-[10px] text-[#888888]">
                {tasks.filter(t => t.stage === 'QOFE' && t.completed).length} / {tasks.filter(t => t.stage === 'QOFE').length} Done
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.filter(t => t.stage === 'QOFE').map(task => (
                <div 
                  key={task.id} 
                  className={`border p-3 bg-[#050505] relative transition-all duration-150 hover:border-[#0EA5E9] ${task.completed ? 'opacity-60 border-[#222222]' : 'border-[#222222]'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] px-1.5 py-0.5 border border-[#222222] text-[#888888] bg-[#111111]">{task.id}</span>
                    <span className={`text-[9px] uppercase tracking-widest px-1 font-bold ${
                      task.priority === 'CRITICAL' ? 'text-[#FF3333]' : task.priority === 'HIGH' ? 'text-[#0EA5E9]' : 'text-[#888888]'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <h4 className={`text-xs ${task.completed ? 'line-through text-[#888888]' : 'text-[#F9F9F9]'}`}>{task.title}</h4>
                  
                  {task.riskType !== 'general' && (
                    <div className="mt-2 text-[8px] uppercase tracking-wider text-[#0EA5E9]">
                      ⚠ linked to: {task.riskType.replace('_', ' ')}
                    </div>
                  )}

                  <div className="border-t border-[#111111] pt-2 mt-3 flex justify-between items-center">
                    <span className="text-[9px] text-[#888888]">OWNER: {task.owner}</span>
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`text-[9px] uppercase px-2 py-0.5 border ${
                        task.completed ? 'border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/10' : 'border-[#222222] text-[#888888] hover:border-[#00FF66] hover:text-[#00FF66]'
                      }`}
                    >
                      {task.completed ? '■ DONE' : '□ VERIFY'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column C: Legal / Asset Purchase Agreement (APA) */}
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider">[3] LEGAL / APA DESIGN</span>
              <span className="text-[10px] text-[#888888]">
                {tasks.filter(t => t.stage === 'LEGAL' && t.completed).length} / {tasks.filter(t => t.stage === 'LEGAL').length} Done
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.filter(t => t.stage === 'LEGAL').map(task => (
                <div 
                  key={task.id} 
                  className={`border p-3 bg-[#050505] relative transition-all duration-150 hover:border-[#0EA5E9] ${task.completed ? 'opacity-60 border-[#222222]' : 'border-[#222222]'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] px-1.5 py-0.5 border border-[#222222] text-[#888888] bg-[#111111]">{task.id}</span>
                    <span className={`text-[9px] uppercase tracking-widest px-1 font-bold ${
                      task.priority === 'CRITICAL' ? 'text-[#FF3333]' : task.priority === 'HIGH' ? 'text-[#0EA5E9]' : 'text-[#888888]'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <h4 className={`text-xs ${task.completed ? 'line-through text-[#888888]' : 'text-[#F9F9F9]'}`}>{task.title}</h4>
                  
                  {task.riskType !== 'general' && (
                    <div className="mt-2 text-[8px] uppercase tracking-wider text-[#0EA5E9]">
                      ⚠ linked to: {task.riskType.replace('_', ' ')}
                    </div>
                  )}

                  <div className="border-t border-[#111111] pt-2 mt-3 flex justify-between items-center">
                    <span className="text-[9px] text-[#888888]">OWNER: {task.owner}</span>
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`text-[9px] uppercase px-2 py-0.5 border ${
                        task.completed ? 'border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/10' : 'border-[#222222] text-[#888888] hover:border-[#00FF66] hover:text-[#00FF66]'
                      }`}
                    >
                      {task.completed ? '■ DONE' : '□ VERIFY'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column D: Closing / Escrow Operations */}
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs font-bold text-[#F9F9F9] uppercase tracking-wider">[4] CLOSING CHECKLIST</span>
              <span className="text-[10px] text-[#888888]">
                {tasks.filter(t => t.stage === 'CLOSING' && t.completed).length} / {tasks.filter(t => t.stage === 'CLOSING').length} Done
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.filter(t => t.stage === 'CLOSING').map(task => (
                <div 
                  key={task.id} 
                  className={`border p-3 bg-[#050505] relative transition-all duration-150 hover:border-[#0EA5E9] ${task.completed ? 'opacity-60 border-[#222222]' : 'border-[#222222]'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] px-1.5 py-0.5 border border-[#222222] text-[#888888] bg-[#111111]">{task.id}</span>
                    <span className={`text-[9px] uppercase tracking-widest px-1 font-bold ${
                      task.priority === 'CRITICAL' ? 'text-[#FF3333]' : task.priority === 'HIGH' ? 'text-[#0EA5E9]' : 'text-[#888888]'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <h4 className={`text-xs ${task.completed ? 'line-through text-[#888888]' : 'text-[#F9F9F9]'}`}>{task.title}</h4>
                  
                  {task.riskType !== 'general' && (
                    <div className="mt-2 text-[8px] uppercase tracking-wider text-[#0EA5E9]">
                      ⚠ linked to: {task.riskType.replace('_', ' ')}
                    </div>
                  )}

                  <div className="border-t border-[#111111] pt-2 mt-3 flex justify-between items-center">
                    <span className="text-[9px] text-[#888888]">OWNER: {task.owner}</span>
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`text-[9px] uppercase px-2 py-0.5 border ${
                        task.completed ? 'border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/10' : 'border-[#222222] text-[#888888] hover:border-[#00FF66] hover:text-[#00FF66]'
                      }`}
                    >
                      {task.completed ? '■ DONE' : '□ VERIFY'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. DUAL COLUMN LOWER CORE: DOCUMENT VAULT & SYSTEM CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Secure SHA-256 Vault Indexer (Col span 7) */}
        <div className="lg:col-span-7 border border-[#222222] bg-[#0a0a0a] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="border-b border-[#222222] p-4 flex justify-between items-center bg-[#0c0c0c]">
              <div className="space-y-1">
                <span className="text-[10px] text-[#00FF66] font-bold uppercase tracking-wider">// SHA-256 ENCRYPTED ARCHIVE</span>
                <h3 className="text-sm font-bold uppercase text-[#F9F9F9]">DUE DILIGENCE DOCUMENT VAULT</h3>
              </div>
              <span className="text-[9px] px-2 py-0.5 border border-[#222222] text-[#888888] bg-[#050505]">
                INDEX NODES: {docs.length} SECURE
              </span>
            </div>

            {/* Drag & Drop Upload Simulator Zone */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={simulateUpload}
              className="border-b border-[#222222] border-dashed border-spacing-4 bg-[#080808] p-6 text-center cursor-pointer hover:bg-[#0c0c0c] transition-all duration-150 flex flex-col items-center justify-center space-y-2 group"
            >
              <div className="w-10 h-10 border border-[#222222] group-hover:border-[#00FF66] flex items-center justify-center bg-[#050505]">
                {isUploading ? (
                  <span className="text-[#00FF66] text-xs font-bold animate-pulse">▲</span>
                ) : (
                  <svg className="w-5 h-5 text-[#888888] group-hover:text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-xs text-[#F9F9F9] uppercase tracking-wider block group-hover:text-[#00FF66]">
                  {isUploading ? 'STREAMS COMMITTED // UPLOADING...' : 'DRAG & DROP DUE DILIGENCE ASSETS'}
                </span>
                <span className="text-[10px] text-[#888888] block mt-1">
                  Supports .PDF, .XLSX, .ZIP, and financial ledger CSV packages
                </span>
              </div>

              {/* Uploading progress bar */}
              {isUploading && (
                <div className="w-full max-w-xs bg-[#111111] h-1.5 border border-[#222222] mt-2 relative">
                  <div 
                    className="bg-[#00FF66] h-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Document Index Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#222222] bg-[#0c0c0c] text-[9px] text-[#888888] uppercase tracking-wider">
                    <th className="p-3">FILE DATA NAME</th>
                    <th className="p-3">DEAL GROUP</th>
                    <th className="p-3">SIZE</th>
                    <th className="p-3 text-right">HASH SIGNATURE / INTEGRITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222] text-xs">
                  {docs.map(doc => (
                    <tr key={doc.id} className="hover:bg-[#111111]/40 transition-colors">
                      <td className="p-3 font-semibold text-[#F9F9F9]">
                        <div className="flex items-center space-x-2">
                          <span className={`w-1.5 h-1.5 rounded-none ${
                            doc.category === 'FINANCIAL' ? 'bg-[#00FF66]' :
                            doc.category === 'LEGAL' ? 'bg-[#0EA5E9]' :
                            doc.category === 'TAX' ? 'bg-[#FF3333]' : 'bg-[#888888]'
                          }`}></span>
                          <span>{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] px-1.5 py-0.5 border border-[#222222] text-[#888888] bg-[#111111]">
                          {doc.category}
                        </span>
                      </td>
                      <td className="p-3 text-[#888888]">{doc.size}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <code className="text-[9px] text-[#888888] max-w-[120px] truncate block font-mono">
                            {doc.hash}
                          </code>
                          {doc.verified ? (
                            <span className="text-[9px] text-[#00FF66] border border-[#00FF66]/20 bg-[#00FF66]/5 px-1 font-bold">
                              ✓ PASS
                            </span>
                          ) : (
                            <button
                              onClick={() => verifyDocHash(doc.id)}
                              disabled={doc.isVerifying}
                              className="text-[9px] border border-[#FF3333] hover:bg-[#FF3333] hover:text-[#050505] text-[#FF3333] px-2 py-0.5 transition-colors font-bold"
                            >
                              {doc.isVerifying ? 'VERIFYING...' : '⚔ VERIFY'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer Legal Callout */}
          <div className="p-4 bg-[#070707] border-t border-[#222222] text-[9px] text-[#888888] leading-relaxed">
            * All document storage indexes correspond with strict plaid, escrow, and certified capital accounting parameters. Hash signatures are evaluated under local SHA-256 transaction integrity schemas.
          </div>
        </div>

        {/* Right Side: Operational Log Console & Live Indicators (Col span 5) */}
        <div className="lg:col-span-5 border border-[#222222] bg-[#0a0a0a] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="border-b border-[#222222] p-4 bg-[#0c0c0c]">
              <span className="text-[10px] text-[#FF3333] font-bold uppercase tracking-wider block">// REAL-TIME SUBSYSTEM METRIC LOGS</span>
              <h3 className="text-sm font-bold uppercase text-[#F9F9F9] mt-0.5">WAR ROOM TERMINAL CONSOLE</h3>
            </div>

            {/* Diagnostics Stats Bar */}
            <div className="p-4 grid grid-cols-2 gap-4 border-b border-[#222222] bg-[#080808]">
              <div className="p-3 border border-[#222222] bg-[#050505]">
                <span className="text-[9px] text-[#888888] block uppercase">COMPLETED CHECKS</span>
                <span className="text-base font-bold text-[#00FF66]">
                  {tasks.filter(t => t.completed).length} / {tasks.length}
                </span>
              </div>
              <div className="p-3 border border-[#222222] bg-[#050505]">
                <span className="text-[9px] text-[#888888] block uppercase">PENDING RISK FLAGGED</span>
                <span className="text-base font-bold text-[#FF3333]">
                  {tasks.filter(t => !t.completed && t.riskType !== 'general').length} Critical
                </span>
              </div>
            </div>

            {/* The Live Feed terminal box */}
            <div className="p-4 font-mono text-xs space-y-2 h-[260px] overflow-y-auto">
              {logConsole.map((log, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-[#00FF66]">&gt;&gt;</span>
                  <span className={`${index === 0 ? 'text-[#00FF66] font-bold' : 'text-[#888888]'}`}>{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Clear logs trigger */}
          <div className="p-4 border-t border-[#222222] bg-[#0c0c0c] flex items-center justify-between">
            <span className="text-[9px] text-[#888888]">INTEGRATED DIAGNOSTIC MODULE V1.08</span>
            <button 
              onClick={() => {
                setLogConsole(['SYSTEM CONSOLE CLEANSED // LISTENING FOR PIPELINE SIGNALS...']);
              }}
              className="text-[9px] border border-[#222222] text-[#888888] hover:border-[#FF3333] hover:text-[#FF3333] px-2.5 py-1 uppercase font-bold transition-all duration-150"
            >
              Clear Buffer
            </button>
          </div>

        </div>

      </div>

      {/* 5. FOOTER COMPLIANCE & ESCROW STAGE SIGNALS */}
      <div className="border border-[#222222] bg-[#0a0a0a] p-4 text-[10px] text-[#888888] leading-relaxed flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[#F9F9F9] uppercase tracking-wider block font-bold mb-1">// DUE DILIGENCE PIPELINE REGULATORY AUDIT</span>
          Past due diligence task validations do not represent standard legal execution certainty. All escrow accounts, APA drafts, and capital asset verification markers are provided strictly as dynamic simulations for transaction models.
        </div>
        <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111] shrink-0 text-right">
          <span className="w-2 h-2 rounded-full bg-[#00FF66] inline-block animate-ping"></span>
          <span className="text-[#00FF66] font-bold">SECURE PIPELINE DISPATCH READY</span>
        </div>
      </div>

    </div>
  );
}