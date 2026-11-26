import React, { useState, useMemo } from 'react';

// ==========================================
// INTERFACES & TYPES
// ==========================================
interface Task {
  id: string;
  label: string;
  completed: boolean;
  phase: 'LOI' | 'QOFE' | 'LEGAL' | 'CLOSE';
  assignedTo: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface DealDiligence {
  id: string;
  codename: string;
  industry: string;
  revenue: number;
  ebitda: number;
  asking: number;
  location: string;
  
  // Dynamic Risk States
  customerConcentration: number; // % of revenue from top customer
  workingCapitalTarget: number;  // $ target
  workingCapitalActual: number;  // $ actual
  keyManRiskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  keyManContractSigned: boolean;
  
  // Checklists
  tasks: Task[];
}

// ==========================================
// SAMPLE INITIAL DATA (Matching Base Component)
// ==========================================
const INITIAL_DEALS_DILIGENCE: DealDiligence[] = [
  {
    id: 'DL-8902',
    codename: 'Project Delta',
    industry: 'B2B Logistics Agency',
    revenue: 2400000,
    ebitda: 620000,
    asking: 1800000,
    location: 'Southeast Regional',
    customerConcentration: 35,
    workingCapitalTarget: 220000,
    workingCapitalActual: 185000,
    keyManRiskLevel: 'HIGH',
    keyManContractSigned: false,
    tasks: [
      { id: 't1', label: 'Verify 36 months audited balance sheets', completed: true, phase: 'LOI', assignedTo: 'Financial Team', urgency: 'HIGH' },
      { id: 't2', label: 'Execute Phase I Environmental Assessment', completed: true, phase: 'LOI', assignedTo: 'Legal Dept', urgency: 'LOW' },
      { id: 't3', label: 'Validate 35% Customer concentration contract provisions', completed: false, phase: 'QOFE', assignedTo: 'Lead Counsel', urgency: 'HIGH' },
      { id: 't4', label: 'Perform independent QofE EBITDA adjustment walk', completed: false, phase: 'QOFE', assignedTo: 'Audit Partner', urgency: 'HIGH' },
      { id: 't5', label: 'Draft Employment Agreement for VP of Logistics', completed: false, phase: 'LEGAL', assignedTo: 'HR Advisory', urgency: 'MEDIUM' },
      { id: 't6', label: 'Finalize net working capital (NWC) peg definition', completed: false, phase: 'CLOSE', assignedTo: 'Deal Lead', urgency: 'MEDIUM' },
    ]
  },
  {
    id: 'DL-4411',
    codename: 'Project Cobalt',
    industry: 'HVAC & Air Treatment Systems',
    revenue: 3800000,
    ebitda: 950000,
    asking: 3200000,
    location: 'Texas Triangle Corridor',
    customerConcentration: 12,
    workingCapitalTarget: 450000,
    workingCapitalActual: 462000,
    keyManRiskLevel: 'MEDIUM',
    keyManContractSigned: true,
    tasks: [
      { id: 't11', label: 'Reconcile QuickBooks data with structural bank deposits', completed: true, phase: 'LOI', assignedTo: 'Financial Team', urgency: 'HIGH' },
      { id: 't12', label: 'Verify physical asset count (HVAC vehicles and inventory)', completed: true, phase: 'LOI', assignedTo: 'Operational Rep', urgency: 'MEDIUM' },
      { id: 't13', label: 'Perform customer cohort annual retention auditing', completed: true, phase: 'QOFE', assignedTo: 'Audit Partner', urgency: 'HIGH' },
      { id: 't14', label: 'Review non-compete agreements for operational managers', completed: false, phase: 'LEGAL', assignedTo: 'Lead Counsel', urgency: 'HIGH' },
      { id: 't15', label: 'Setup escrow account and target fund disbursement protocols', completed: false, phase: 'CLOSE', assignedTo: 'Bank Rep', urgency: 'HIGH' },
    ]
  },
  {
    id: 'DL-5520',
    codename: 'Project Cipher',
    industry: 'SaaS Property Management Suite',
    revenue: 1100000,
    ebitda: 420000,
    asking: 1600000,
    location: 'Remote-First Architecture',
    customerConcentration: 8,
    workingCapitalTarget: 50000,
    workingCapitalActual: 48000,
    keyManRiskLevel: 'LOW',
    keyManContractSigned: true,
    tasks: [
      { id: 't21', label: 'Execute IP Assignment agreement audit', completed: true, phase: 'LOI', assignedTo: 'IP Legal', urgency: 'HIGH' },
      { id: 't22', label: 'Validate AWS & Server operational billing logs', completed: true, phase: 'LOI', assignedTo: 'Tech Advisory', urgency: 'MEDIUM' },
      { id: 't23', label: 'Verify developer transition consulting agreements', completed: true, phase: 'QOFE', assignedTo: 'Deal Lead', urgency: 'MEDIUM' },
      { id: 't24', label: 'Draft final software custody escrow deposit agreement', completed: false, phase: 'LEGAL', assignedTo: 'Lead Counsel', urgency: 'HIGH' },
      { id: 't25', label: 'Authorize domain/DNS transfer keys to holding company', completed: false, phase: 'CLOSE', assignedTo: 'Tech Advisory', urgency: 'HIGH' },
    ]
  }
];

export default function DueDiligenceChecklist() {
  const [deals, setDeals] = useState<DealDiligence[]>(INITIAL_DEALS_DILIGENCE);
  const [selectedDealId, setSelectedDealId] = useState<string>('DL-8902');
  const [activeTab, setActiveTab] = useState<'BOARD' | 'RISK_MATRIX'>('BOARD');
  
  // Task addition form state
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState<'LOI' | 'QOFE' | 'LEGAL' | 'CLOSE'>('LOI');
  const [newTaskUrgency, setNewTaskUrgency] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Analyst');

  // Find currently active deal
  const activeDeal = useMemo(() => {
    return deals.find(d => d.id === selectedDealId) || deals[0];
  }, [deals, selectedDealId]);

  // Helper formatting currencies
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Toggle state of a specific checklist item
  const handleToggleTask = (taskId: string) => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === activeDeal.id) {
        return {
          ...deal,
          tasks: deal.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return deal;
    }));
  };

  // Remove a task
  const handleRemoveTask = (taskId: string) => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === activeDeal.id) {
        return {
          ...deal,
          tasks: deal.tasks.filter(t => t.id !== taskId)
        };
      }
      return deal;
    }));
  };

  // Create new task dynamically
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskLabel.trim()) return;

    const newTask: Task = {
      id: `t-dyn-${Date.now()}`,
      label: newTaskLabel,
      completed: false,
      phase: newTaskPhase,
      assignedTo: newTaskAssignee,
      urgency: newTaskUrgency
    };

    setDeals(prev => prev.map(deal => {
      if (deal.id === activeDeal.id) {
        return {
          ...deal,
          tasks: [...deal.tasks, newTask]
        };
      }
      return deal;
    }));

    setNewTaskLabel('');
  };

  // Dynamically update risk values
  const handleUpdateConcentration = (val: number) => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === activeDeal.id) {
        return { ...deal, customerConcentration: val };
      }
      return deal;
    }));
  };

  const handleUpdateWorkingCapitalActual = (val: number) => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === activeDeal.id) {
        return { ...deal, workingCapitalActual: val };
      }
      return deal;
    }));
  };

  const handleToggleKeyManContract = () => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === activeDeal.id) {
        return { ...deal, keyManContractSigned: !deal.keyManContractSigned };
      }
      return deal;
    }));
  };

  const handleUpdateKeyManRisk = (val: 'HIGH' | 'MEDIUM' | 'LOW') => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === activeDeal.id) {
        return { ...deal, keyManRiskLevel: val };
      }
      return deal;
    }));
  };

  // Calculations for active deal risk levels and metrics
  const phaseProgress = useMemo(() => {
    const total = activeDeal.tasks.length;
    if (total === 0) return 0;
    const completed = activeDeal.tasks.filter(t => t.completed).length;
    return Math.round((completed / total) * 100);
  }, [activeDeal]);

  // Working Capital Gap Calculation
  const workingCapitalGap = activeDeal.workingCapitalTarget - activeDeal.workingCapitalActual;
  const isWcDeficit = workingCapitalGap > 0;

  // Real-time calculated overall deal danger index
  const dynamicDangerScore = useMemo(() => {
    let score = 20; // base score
    if (activeDeal.customerConcentration > 30) score += 30;
    if (activeDeal.customerConcentration > 15 && activeDeal.customerConcentration <= 30) score += 15;
    if (isWcDeficit) score += 20;
    if (activeDeal.keyManRiskLevel === 'HIGH') score += 20;
    if (activeDeal.keyManRiskLevel === 'MEDIUM') score += 10;
    if (!activeDeal.keyManContractSigned) score += 15;
    return Math.min(score, 100);
  }, [activeDeal, isWcDeficit]);

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono border border-[#222222] overflow-hidden">
      
      {/* 1. COMPONENT TERMINAL BANNER */}
      <div className="border-b border-[#222222] bg-[#0c0c0c] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#FF3333] animate-pulse rounded-none"></span>
            <span className="text-xs text-[#888888] tracking-[0.2em] uppercase">// SYSTEM WAR_ROOM DIRECTORY</span>
          </div>
          <h1 className="text-lg font-bold tracking-wider text-[#F9F9F9] mt-1">
            DUE DILIGENCE ANALYTICAL KANBAN
          </h1>
        </div>
        
        {/* Active Selector for deals in transit */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-[#888888] uppercase hidden sm:inline">SELECT CODENAME:</span>
          <div className="flex space-x-1 border border-[#222222] p-1 bg-[#050505]">
            {deals.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDealId(d.id)}
                className={`text-[11px] px-2.5 py-1 tracking-wider uppercase transition-colors duration-150 ${
                  selectedDealId === d.id
                    ? 'bg-[#0EA5E9] text-[#050505] font-bold'
                    : 'text-[#888888] hover:text-[#00FF66] hover:bg-[#111111]'
                }`}
              >
                {d.codename}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. OVERVIEW METRICS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#222222] bg-[#080808]">
        <div className="p-4 border-r border-[#222222]">
          <span className="text-[9px] text-[#888888] block uppercase">ASSET REVENUE / EBITDA</span>
          <span className="text-sm font-bold text-[#F9F9F9] block mt-0.5">
            {formatCurrency(activeDeal.revenue)} / <span className="text-[#00FF66]">{formatCurrency(activeDeal.ebitda)}</span>
          </span>
        </div>
        <div className="p-4 border-r border-[#222222]">
          <span className="text-[9px] text-[#888888] block uppercase">AUDIT STAGE PROGRESS</span>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex-1 bg-[#222222] h-2">
              <div 
                className="h-full bg-[#00FF66] transition-all duration-300" 
                style={{ width: `${phaseProgress}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-[#00FF66]">{phaseProgress}%</span>
          </div>
        </div>
        <div className="p-4 border-r border-[#222222]">
          <span className="text-[9px] text-[#888888] block uppercase">DANGER COEFFICIENT</span>
          <span className={`text-sm font-bold block mt-0.5 ${
            dynamicDangerScore >= 70 ? 'text-[#FF3333]' : dynamicDangerScore >= 40 ? 'text-[#0EA5E9]' : 'text-[#00FF66]'
          }`}>
            {dynamicDangerScore} / 100 {dynamicDangerScore >= 70 ? '▲ CRITICAL' : '▼ SECURE'}
          </span>
        </div>
        <div className="p-4 bg-[#0a0a0a] flex flex-col justify-center">
          <span className="text-[9px] text-[#888888] block uppercase">ESCROW BASE CURRENCY</span>
          <span className="text-[11px] font-bold text-[#0EA5E9] mt-0.5 uppercase">
            {activeDeal.location} • TARGET USD
          </span>
        </div>
      </div>

      {/* VIEW TABS SELECTOR */}
      <div className="flex border-b border-[#222222] bg-[#050505]">
        <button
          onClick={() => setActiveTab('BOARD')}
          className={`flex items-center space-x-2 px-6 py-3 border-r border-[#222222] text-xs font-bold uppercase transition-colors duration-150 ${
            activeTab === 'BOARD' ? 'bg-[#111111] text-[#00FF66] border-b-2 border-b-[#00FF66]' : 'text-[#888888] hover:text-[#F9F9F9]'
          }`}
        >
          <span>📋</span>
          <span>Pipeline & Checklists</span>
        </button>
        <button
          onClick={() => setActiveTab('RISK_MATRIX')}
          className={`flex items-center space-x-2 px-6 py-3 border-r border-[#222222] text-xs font-bold uppercase transition-colors duration-150 ${
            activeTab === 'RISK_MATRIX' ? 'bg-[#111111] text-[#FF3333] border-b-2 border-b-[#FF3333]' : 'text-[#888888] hover:text-[#F9F9F9]'
          }`}
        >
          <span>⚡</span>
          <span>Risk Telemetry Controls</span>
        </button>
      </div>

      {/* 3. WORKING WORKSPACE CONTENT */}
      <div className="p-4 md:p-6">
        {activeTab === 'BOARD' ? (
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* KANBAN BOARDS (9 cols on xl screens) */}
            <div className="xl:col-span-9 space-y-6">
              
              {/* Dynamic Grid of Phases */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* PHASE 1: LOI SIGNED */}
                <div className="border border-[#222222] bg-[#0a0a0a] flex flex-col min-h-[350px]">
                  <div className="border-b border-[#222222] p-3 bg-[#0c0c0c] flex justify-between items-center">
                    <span className="text-xs font-bold text-[#0EA5E9]">01 // LOI INITIAL</span>
                    <span className="text-[10px] bg-[#111111] px-1.5 py-0.5 border border-[#222222] text-[#888888]">
                      {activeDeal.tasks.filter(t => t.phase === 'LOI').length} Tasks
                    </span>
                  </div>
                  
                  <div className="p-3 flex-grow space-y-2">
                    {activeDeal.tasks.filter(t => t.phase === 'LOI').map(task => (
                      <div 
                        key={task.id} 
                        className={`p-3 border transition-all duration-150 ${
                          task.completed 
                            ? 'border-[#222222] bg-[#080808] opacity-60' 
                            : 'border-[#222222] hover:border-[#0EA5E9] bg-[#0e0e0e]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <label className="flex items-start space-x-2 cursor-pointer flex-1 text-[11px] leading-relaxed">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => handleToggleTask(task.id)}
                              className="mt-0.5 accent-[#00FF66] border-[#222222]" 
                            />
                            <span className={task.completed ? 'line-through text-[#888888]' : 'text-[#F9F9F9]'}>
                              {task.label}
                            </span>
                          </label>
                          <button 
                            onClick={() => handleRemoveTask(task.id)}
                            className="text-[#FF3333] hover:text-[#F9F9F9] text-[10px] ml-1 transition-colors"
                            title="Purge Task"
                          >
                            ×
                          </button>
                        </div>
                        
                        <div className="mt-2.5 pt-1.5 border-t border-[#1a1a1a] flex justify-between items-center text-[9px] text-[#888888]">
                          <span className="uppercase">{task.assignedTo}</span>
                          <span className={`px-1 font-bold ${
                            task.urgency === 'HIGH' ? 'text-[#FF3333]' : task.urgency === 'MEDIUM' ? 'text-[#0EA5E9]' : 'text-[#888888]'
                          }`}>
                            {task.urgency}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {activeDeal.tasks.filter(t => t.phase === 'LOI').length === 0 && (
                      <div className="text-center py-6 text-[10px] text-[#888888] uppercase italic">No tasks in phase</div>
                    )}
                  </div>
                </div>

                {/* PHASE 2: FINANCIAL QOFE */}
                <div className="border border-[#222222] bg-[#0a0a0a] flex flex-col min-h-[350px]">
                  <div className="border-b border-[#222222] p-3 bg-[#0c0c0c] flex justify-between items-center">
                    <span className="text-xs font-bold text-[#00FF66]">02 // QOFE AUDIT</span>
                    <span className="text-[10px] bg-[#111111] px-1.5 py-0.5 border border-[#222222] text-[#888888]">
                      {activeDeal.tasks.filter(t => t.phase === 'QOFE').length} Tasks
                    </span>
                  </div>

                  <div className="p-3 flex-grow space-y-2">
                    {activeDeal.tasks.filter(t => t.phase === 'QOFE').map(task => (
                      <div 
                        key={task.id} 
                        className={`p-3 border transition-all duration-150 ${
                          task.completed 
                            ? 'border-[#222222] bg-[#080808] opacity-60' 
                            : 'border-[#222222] hover:border-[#00FF66] bg-[#0e0e0e]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <label className="flex items-start space-x-2 cursor-pointer flex-1 text-[11px] leading-relaxed">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => handleToggleTask(task.id)}
                              className="mt-0.5 accent-[#00FF66]" 
                            />
                            <span className={task.completed ? 'line-through text-[#888888]' : 'text-[#F9F9F9]'}>
                              {task.label}
                            </span>
                          </label>
                          <button 
                            onClick={() => handleRemoveTask(task.id)}
                            className="text-[#FF3333] hover:text-[#F9F9F9] text-[10px] ml-1 transition-colors"
                            title="Purge Task"
                          >
                            ×
                          </button>
                        </div>

                        <div className="mt-2.5 pt-1.5 border-t border-[#1a1a1a] flex justify-between items-center text-[9px] text-[#888888]">
                          <span className="uppercase">{task.assignedTo}</span>
                          <span className={`px-1 font-bold ${
                            task.urgency === 'HIGH' ? 'text-[#FF3333]' : task.urgency === 'MEDIUM' ? 'text-[#0EA5E9]' : 'text-[#888888]'
                          }`}>
                            {task.urgency}
                          </span>
                        </div>
                      </div>
                    ))}

                    {activeDeal.tasks.filter(t => t.phase === 'QOFE').length === 0 && (
                      <div className="text-center py-6 text-[10px] text-[#888888] uppercase italic">No tasks in phase</div>
                    )}
                  </div>
                </div>

                {/* PHASE 3: LEGAL & TRANSITION */}
                <div className="border border-[#222222] bg-[#0a0a0a] flex flex-col min-h-[350px]">
                  <div className="border-b border-[#222222] p-3 bg-[#0c0c0c] flex justify-between items-center">
                    <span className="text-xs font-bold text-[#0EA5E9]">03 // LEGAL STACKS</span>
                    <span className="text-[10px] bg-[#111111] px-1.5 py-0.5 border border-[#222222] text-[#888888]">
                      {activeDeal.tasks.filter(t => t.phase === 'LEGAL').length} Tasks
                    </span>
                  </div>

                  <div className="p-3 flex-grow space-y-2">
                    {activeDeal.tasks.filter(t => t.phase === 'LEGAL').map(task => (
                      <div 
                        key={task.id} 
                        className={`p-3 border transition-all duration-150 ${
                          task.completed 
                            ? 'border-[#222222] bg-[#080808] opacity-60' 
                            : 'border-[#222222] hover:border-[#0EA5E9] bg-[#0e0e0e]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <label className="flex items-start space-x-2 cursor-pointer flex-1 text-[11px] leading-relaxed">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => handleToggleTask(task.id)}
                              className="mt-0.5 accent-[#00FF66]" 
                            />
                            <span className={task.completed ? 'line-through text-[#888888]' : 'text-[#F9F9F9]'}>
                              {task.label}
                            </span>
                          </label>
                          <button 
                            onClick={() => handleRemoveTask(task.id)}
                            className="text-[#FF3333] hover:text-[#F9F9F9] text-[10px] ml-1 transition-colors"
                            title="Purge Task"
                          >
                            ×
                          </button>
                        </div>

                        <div className="mt-2.5 pt-1.5 border-t border-[#1a1a1a] flex justify-between items-center text-[9px] text-[#888888]">
                          <span className="uppercase">{task.assignedTo}</span>
                          <span className={`px-1 font-bold ${
                            task.urgency === 'HIGH' ? 'text-[#FF3333]' : task.urgency === 'MEDIUM' ? 'text-[#0EA5E9]' : 'text-[#888888]'
                          }`}>
                            {task.urgency}
                          </span>
                        </div>
                      </div>
                    ))}

                    {activeDeal.tasks.filter(t => t.phase === 'LEGAL').length === 0 && (
                      <div className="text-center py-6 text-[10px] text-[#888888] uppercase italic">No tasks in phase</div>
                    )}
                  </div>
                </div>

                {/* PHASE 4: CLOSING PREP */}
                <div className="border border-[#222222] bg-[#0a0a0a] flex flex-col min-h-[350px]">
                  <div className="border-b border-[#222222] p-3 bg-[#0c0c0c] flex justify-between items-center">
                    <span className="text-xs font-bold text-[#FF3333]">04 // CLOSING STEP</span>
                    <span className="text-[10px] bg-[#111111] px-1.5 py-0.5 border border-[#222222] text-[#888888]">
                      {activeDeal.tasks.filter(t => t.phase === 'CLOSE').length} Tasks
                    </span>
                  </div>

                  <div className="p-3 flex-grow space-y-2">
                    {activeDeal.tasks.filter(t => t.phase === 'CLOSE').map(task => (
                      <div 
                        key={task.id} 
                        className={`p-3 border transition-all duration-150 ${
                          task.completed 
                            ? 'border-[#222222] bg-[#080808] opacity-60' 
                            : 'border-[#222222] hover:border-[#FF3333] bg-[#0e0e0e]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <label className="flex items-start space-x-2 cursor-pointer flex-1 text-[11px] leading-relaxed">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => handleToggleTask(task.id)}
                              className="mt-0.5 accent-[#00FF66]" 
                            />
                            <span className={task.completed ? 'line-through text-[#888888]' : 'text-[#F9F9F9]'}>
                              {task.label}
                            </span>
                          </label>
                          <button 
                            onClick={() => handleRemoveTask(task.id)}
                            className="text-[#FF3333] hover:text-[#F9F9F9] text-[10px] ml-1 transition-colors"
                            title="Purge Task"
                          >
                            ×
                          </button>
                        </div>

                        <div className="mt-2.5 pt-1.5 border-t border-[#1a1a1a] flex justify-between items-center text-[9px] text-[#888888]">
                          <span className="uppercase">{task.assignedTo}</span>
                          <span className={`px-1 font-bold ${
                            task.urgency === 'HIGH' ? 'text-[#FF3333]' : task.urgency === 'MEDIUM' ? 'text-[#0EA5E9]' : 'text-[#888888]'
                          }`}>
                            {task.urgency}
                          </span>
                        </div>
                      </div>
                    ))}

                    {activeDeal.tasks.filter(t => t.phase === 'CLOSE').length === 0 && (
                      <div className="text-center py-6 text-[10px] text-[#888888] uppercase italic">No tasks in phase</div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* QUICK FORM TASK INJECTOR (3 cols on xl screens) */}
            <div className="xl:col-span-3 space-y-6">
              
              <div className="border border-[#222222] bg-[#0a0a0a] p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-[#888888] uppercase tracking-wider">// Inject Pipeline Task</span>
                  <span className="text-[9px] text-[#00FF66] font-bold">[ONLINE]</span>
                </div>

                <form onSubmit={handleAddTask} className="space-y-4">
                  
                  {/* Task Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#888888] uppercase block">Task Description / Standard:</label>
                    <input 
                      type="text" 
                      value={newTaskLabel}
                      onChange={e => setNewTaskLabel(e.target.value)}
                      placeholder="e.g. Audit tax clearings..."
                      className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs p-2.5 focus:border-[#00FF66] focus:outline-none uppercase"
                    />
                  </div>

                  {/* Assignee */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#888888] uppercase block">Assign Operational Lead:</label>
                    <input 
                      type="text" 
                      value={newTaskAssignee}
                      onChange={e => setNewTaskAssignee(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs p-2.5 focus:border-[#00FF66] focus:outline-none uppercase"
                    />
                  </div>

                  {/* Dropdowns side-by-side */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#888888] uppercase block">Target Phase:</label>
                      <select 
                        value={newTaskPhase}
                        onChange={e => setNewTaskPhase(e.target.value as any)}
                        className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs p-2 focus:border-[#00FF66] focus:outline-none uppercase"
                      >
                        <option value="LOI">01 LOI</option>
                        <option value="QOFE">02 QofE</option>
                        <option value="LEGAL">03 Legal</option>
                        <option value="CLOSE">04 Close</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[#888888] uppercase block">Priority Matrix:</label>
                      <select 
                        value={newTaskUrgency}
                        onChange={e => setNewTaskUrgency(e.target.value as any)}
                        className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs p-2 focus:border-[#00FF66] focus:outline-none uppercase"
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Injector */}
                  <button 
                    type="submit"
                    className="w-full text-xs text-[#050505] bg-[#00FF66] hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] font-bold p-3 transition-all duration-150 uppercase tracking-widest text-center"
                  >
                    + Append Task Node
                  </button>
                </form>
              </div>

              {/* LIVE TACTICAL REMARK BOARD */}
              <div className="border border-[#222222] bg-[#0c0c0c] p-4 text-[11px] leading-relaxed space-y-3">
                <span className="text-xs text-[#888888] uppercase block tracking-wider">// System Compliance Alert</span>
                <p className="text-[#888888]">
                  Tasks linked inside these phases represent critical structural contingencies for banking underwriters. Ensure <span className="text-[#0EA5E9]">QofE adjustments</span> align with Plaid database locks before advancing past Step 02.
                </p>
                <div className="border-t border-[#222222] pt-2 text-[10px] text-[#00FF66]">
                  Active Lock Status: <span className="font-bold">SECURED</span>
                </div>
              </div>

            </div>

          </div>

        ) : (
          
          /* ==========================================
             ⚡ TAB 2: RISK TELEMETRY CONTROLS
             ========================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls Inputs (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Box Header */}
              <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-6">
                <div>
                  <span className="text-xs text-[#888888] uppercase tracking-wider block">// ADJUST AUDIT RISK BOUNDARIES</span>
                  <p className="text-[11px] text-[#888888] mt-1 leading-relaxed">
                    Slide dynamic operational coefficients to model stress tests against customer retention, working capital deficits, and structural transition periods.
                  </p>
                </div>

                {/* Risk Slide 1: Customer Concentration */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#888888] uppercase">Customer Concentration:</span>
                    <span className={`font-bold ${activeDeal.customerConcentration > 30 ? 'text-[#FF3333]' : 'text-[#00FF66]'}`}>
                      {activeDeal.customerConcentration}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="65" 
                    step="1" 
                    value={activeDeal.customerConcentration}
                    onChange={(e) => handleUpdateConcentration(parseInt(e.target.value))}
                    className="w-full accent-[#00FF66] bg-[#111111] h-1"
                  />
                  <div className="flex justify-between text-[9px] text-[#888888]">
                    <span>5% (Diversified)</span>
                    <span>65% (Heavy Risk)</span>
                  </div>
                </div>

                {/* Risk Slide 2: Working Capital actual adjustment */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#888888] uppercase">Net Working Capital (Current):</span>
                    <span className="text-[#0EA5E9] font-bold">
                      {formatCurrency(activeDeal.workingCapitalActual)}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={Math.max(20000, activeDeal.workingCapitalTarget - 150000)} 
                    max={activeDeal.workingCapitalTarget + 100000} 
                    step="5000" 
                    value={activeDeal.workingCapitalActual}
                    onChange={(e) => handleUpdateWorkingCapitalActual(parseInt(e.target.value))}
                    className="w-full accent-[#0EA5E9] bg-[#111111] h-1"
                  />
                  <div className="flex justify-between text-[9px] text-[#888888]">
                    <span>Target Target: {formatCurrency(activeDeal.workingCapitalTarget)}</span>
                    <span>Actual capital flow adjustment</span>
                  </div>
                </div>

                {/* Risk Choice 3: Key-Man Transition Risks */}
                <div className="space-y-3 pt-2 border-t border-[#222222]">
                  <span className="text-[10px] text-[#888888] uppercase block">Transition Controls & Key-Man Contracts:</span>
                  
                  {/* Transition Risk Priority toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#888888]">Inherent Risk Tier:</span>
                    <div className="flex space-x-1">
                      {(['LOW', 'MEDIUM', 'HIGH'] as const).map(tier => (
                        <button
                          key={tier}
                          onClick={() => handleUpdateKeyManRisk(tier)}
                          className={`text-[9px] px-2 py-0.5 border uppercase ${
                            activeDeal.keyManRiskLevel === tier
                              ? 'bg-[#FF3333] text-[#050505] font-bold border-[#FF3333]'
                              : 'border-[#222222] text-[#888888] hover:text-[#F9F9F9]'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Handshake contract signed checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#888888]">12-Month Stay-on Bonus Committed:</span>
                    <button
                      onClick={handleToggleKeyManContract}
                      className={`text-[10px] px-3 py-1 border font-bold uppercase transition-all ${
                        activeDeal.keyManContractSigned
                          ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5'
                          : 'border-[#FF3333] text-[#FF3333] bg-[#FF3333]/5'
                      }`}
                    >
                      {activeDeal.keyManContractSigned ? '✓ EXECUTED' : '⚠️ OUTSTANDING'}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Telemetry Readouts (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-6">
                <span className="text-xs text-[#0EA5E9] uppercase tracking-wider block">// SIMULATED RADAR ANALYSIS</span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Concentration Impact Card */}
                  <div className="border border-[#222222] bg-[#080808] p-4 space-y-2">
                    <span className="text-[9px] text-[#888888] uppercase block">Customer Concentration Audit</span>
                    <div className="text-lg font-bold text-[#F9F9F9]">
                      {activeDeal.customerConcentration}% concentration
                    </div>
                    {activeDeal.customerConcentration > 30 ? (
                      <div className="text-[11px] text-[#FF3333] uppercase font-bold">
                        🚨 RED WARNING: Exceeds standard SBA 30% advisory ceiling. Risk of sudden cash drop post-transition.
                      </div>
                    ) : (
                      <div className="text-[11px] text-[#00FF66] uppercase">
                        ✓ SECURE: Customer distribution within stable, bankable threshold profiles.
                      </div>
                    )}
                  </div>

                  {/* Capital Peg Deficit Card */}
                  <div className="border border-[#222222] bg-[#080808] p-4 space-y-2">
                    <span className="text-[9px] text-[#888888] uppercase block">Working Capital Target Balance</span>
                    <div className="text-lg font-bold text-[#F9F9F9]">
                      Gap: {isWcDeficit ? '-' : '+'}{formatCurrency(Math.abs(workingCapitalGap))}
                    </div>
                    {isWcDeficit ? (
                      <div className="text-[11px] text-[#FF3333] uppercase font-bold">
                        ⚠️ DEFICIT: Capital buffer falls short of peg target. Retain {formatCurrency(workingCapitalGap)} in closing escrow.
                      </div>
                    ) : (
                      <div className="text-[11px] text-[#00FF66] uppercase">
                        ✓ SURPLUS: Capital surplus of {formatCurrency(Math.abs(workingCapitalGap))} to be reimbursed to target seller.
                      </div>
                    )}
                  </div>

                </div>

                {/* Key Man Legal Status Assessment */}
                <div className="border border-[#222222] p-4 bg-[#0c0c0c] space-y-2">
                  <span className="text-[9px] text-[#888888] uppercase block">Key Man & Operations Handoff Risk Assessment</span>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-bold px-2 py-0.5 border ${
                      activeDeal.keyManRiskLevel === 'HIGH' ? 'border-[#FF3333] text-[#FF3333]' : 'border-[#0EA5E9] text-[#0EA5E9]'
                    }`}>
                      RISK TIER: {activeDeal.keyManRiskLevel}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 border ${
                      activeDeal.keyManContractSigned ? 'border-[#00FF66] text-[#00FF66]' : 'border-[#FF3333] text-[#FF3333]'
                    }`}>
                      CONTRACT SIGNED: {activeDeal.keyManContractSigned ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#888888] leading-relaxed">
                    {activeDeal.keyManRiskLevel === 'HIGH' && !activeDeal.keyManContractSigned ? (
                      <span className="text-[#FF3333] font-bold">Critical Action Needed: Seller retains heavy proprietary operational control. Deal is at risk of complete post-closing technical failure without immediate executive transition execution contracts.</span>
                    ) : (
                      <span className="text-[#888888]">Moderate handoff profile. Ensure transition timeline schedules stay strictly monitored prior to wire deployment protocols.</span>
                    )}
                  </p>
                </div>

                {/* Simulated Deal Pricing Matrix Adjustment recommendation */}
                <div className="border-t border-[#222222] pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-[#888888] uppercase block">RECOMMENDED ACQUISITION PRICE (ADJUSTED)</span>
                    <span className="text-xl font-bold text-[#0EA5E9]">
                      {formatCurrency(
                        activeDeal.asking - 
                        (activeDeal.customerConcentration > 30 ? (activeDeal.asking * 0.15) : 0) - 
                        (isWcDeficit ? workingCapitalGap : 0)
                      )}
                    </span>
                  </div>
                  <button 
                    onClick={() => alert(`Risk Adjustment matrices calculated! Applying structured claw-back escrow values to LOI schedules for ${activeDeal.codename}`)}
                    className="text-xs text-[#050505] bg-[#0EA5E9] hover:bg-[#050505] hover:text-[#0EA5E9] border border-[#0EA5E9] font-bold px-5 py-3 transition-colors uppercase tracking-wider"
                  >
                    Lock Adjusted Valuation Price
                  </button>
                </div>

              </div>

            </div>

          </div>

        )}
      </div>

    </div>
  );
}
