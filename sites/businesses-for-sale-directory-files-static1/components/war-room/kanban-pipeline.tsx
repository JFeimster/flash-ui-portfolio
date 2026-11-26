import React, { useState, useMemo } from 'react';

// ==========================================
// TYPE DEFINITIONS
// ==========================================
type Stage = 'loi' | 'qofe' | 'legal' | 'closing';

type RiskCategory = 'concentration' | 'working_capital' | 'key_man' | 'financial' | 'legal';

interface Task {
  id: string;
  title: string;
  description: string;
  stage: Stage;
  riskCategory: RiskCategory;
  riskScore: number; // 0 to 100
  assignedTo: string;
  status: 'blocked' | 'in_progress' | 'verified';
  mitigationPlan?: string;
}

interface Deal {
  id: string;
  codename: string;
  industry: string;
  multiple: number;
  ebitda: number;
  asking: number;
}

interface SystemLog {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

// ==========================================
// SEED DATA
// ==========================================
const DEALS: Deal[] = [
  {
    id: 'DL-8902',
    codename: 'Project Delta',
    industry: 'B2B Logistics Agency',
    multiple: 2.9,
    ebitda: 620000,
    asking: 1800000,
  },
  {
    id: 'DL-4411',
    codename: 'Project Cobalt',
    industry: 'HVAC & Air Treatment Systems',
    multiple: 3.4,
    ebitda: 950000,
    asking: 3200000,
  },
  {
    id: 'DL-5520',
    codename: 'Project Cipher',
    industry: 'SaaS Property Management Suite',
    multiple: 3.8,
    ebitda: 420000,
    asking: 1600000,
  },
];

const INITIAL_TASKS: Record<string, Task[]> = {
  'DL-8902': [
    {
      id: 'TSK-8902-1',
      title: 'Analyze 35% Customer Concentration',
      description: 'Audit top 3 accounts to identify term risks and contractual lock-in windows.',
      stage: 'qofe',
      riskCategory: 'concentration',
      riskScore: 85,
      assignedTo: 'Lead Underwriter',
      status: 'in_progress',
      mitigationPlan: 'Draft post-closing volume agreement templates with key client representatives.',
    },
    {
      id: 'TSK-8902-2',
      title: 'LOI Binding Exclusivity Execution',
      description: 'Complete signatures on dual-party binding letter of intent with 45-day lookback.',
      stage: 'loi',
      riskCategory: 'legal',
      riskScore: 12,
      assignedTo: 'M&A Attorney',
      status: 'verified',
    },
    {
      id: 'TSK-8902-3',
      title: 'Working Capital Target Formulation',
      description: 'Review 12-month trailing averages to finalize baseline net working capital requirements.',
      stage: 'qofe',
      riskCategory: 'working_capital',
      riskScore: 45,
      assignedTo: 'Forensic CPA',
      status: 'blocked',
      mitigationPlan: 'Seller seasonal shipping balances are currently missing for Nov-Dec operational window.',
    },
    {
      id: 'TSK-8902-4',
      title: 'Key-Man Contingency Contract',
      description: 'Draft the 12-month management transition roadmap with senior logistics director.',
      stage: 'legal',
      riskCategory: 'key_man',
      riskScore: 70,
      assignedTo: 'M&A Attorney',
      status: 'in_progress',
    },
  ],
  'DL-4411': [
    {
      id: 'TSK-4411-1',
      title: 'Verify Recurring Maintenance Contracts',
      description: 'Audit 92% recurring service agreements in commercial logistics corridors.',
      stage: 'qofe',
      riskCategory: 'financial',
      riskScore: 30,
      assignedTo: 'Forensic CPA',
      status: 'in_progress',
    },
    {
      id: 'TSK-4411-2',
      title: 'Active Recruitment Pipeline Setup',
      description: 'Mitigate localized labor shortages by engineering active trade-school recruitment pathways.',
      stage: 'legal',
      riskCategory: 'key_man',
      riskScore: 65,
      assignedTo: 'Lead Underwriter',
      status: 'blocked',
      mitigationPlan: 'Local trade board approvals require regional certification registry update.',
    },
    {
      id: 'TSK-4411-3',
      title: 'SBA Final Underwriting Authorization',
      description: 'Submit verified real-estate appraisal to SBA preferred advisory network desk.',
      stage: 'closing',
      riskCategory: 'legal',
      riskScore: 20,
      assignedTo: 'SBA Officer',
      status: 'in_progress',
    },
  ],
  'DL-5520': [
    {
      id: 'TSK-5520-1',
      title: 'Verify Code Repository & Tech Stack',
      description: 'Initiate blackbox penetration test on automated server pipelines.',
      stage: 'qofe',
      riskCategory: 'financial',
      riskScore: 18,
      assignedTo: 'DevSecOps Operative',
      status: 'verified',
    },
    {
      id: 'TSK-5520-2',
      title: 'Proprietary Database Transition Guide',
      description: 'Structure comprehensive handoff schedules for complex multi-tenant database logic.',
      stage: 'legal',
      riskCategory: 'key_man',
      riskScore: 92,
      assignedTo: 'Lead Underwriter',
      status: 'blocked',
      mitigationPlan: 'Single founder holds master keys; transfer to multi-sig system mandatory before closing.',
    },
  ],
};

const STAGES: { id: Stage; label: string; description: string }[] = [
  { id: 'loi', label: '1. LOI SECURED', description: 'Letter of Intent finalized & executed' },
  { id: 'qofe', label: '2. QOFE AUDITING', description: 'Quality of Earnings & forensic accounting' },
  { id: 'legal', label: '3. STRUCTURAL LEGAL', description: 'PSA, transition design & insurance' },
  { id: 'closing', label: '4. CLOSING CHECKLIST', description: 'Funding, Escrow & SBA release' },
];

export default function KanbanPipeline() {
  const [selectedDealId, setSelectedDealId] = useState<string>('DL-8902');
  const [tasks, setTasks] = useState<Record<string, Task[]>>(INITIAL_TASKS);
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Create / Edit Task Modal state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<RiskCategory>('concentration');
  const [newTaskStage, setNewTaskStage] = useState<Stage>('loi');
  const [newTaskRiskScore, setNewTaskRiskScore] = useState<number>(50);
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [newTaskMitigation, setNewTaskMitigation] = useState('');

  // Selected task diagnostic terminal view
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  // Live Terminal Logs
  const [logs, setLogs] = useState<SystemLog[]>([
    { timestamp: '09:41:02', message: 'Diligence pipeline synchronized with primary SBA network node.', type: 'info' },
    { timestamp: '11:15:34', message: 'Project Delta structural audit: key-man risk identified (70% index).', type: 'warning' },
  ]);

  const addLog = (message: string, type: 'info' | 'warning' | 'success') => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [{ timestamp, message, type }, ...prev].slice(0, 5));
  };

  // Memoized calculations
  const activeDeal = useMemo(() => {
    return DEALS.find((d) => d.id === selectedDealId) || DEALS[0];
  }, [selectedDealId]);

  const activeTasks = useMemo(() => {
    return tasks[selectedDealId] || [];
  }, [tasks, selectedDealId]);

  const filteredTasks = useMemo(() => {
    return activeTasks.filter((task) => {
      const matchCategory = selectedCategory === 'ALL' || task.riskCategory === selectedCategory;
      const matchSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeTasks, selectedCategory, searchQuery]);

  // Task Handlers
  const handleMoveStage = (taskId: string, targetStage: Stage) => {
    setTasks((prev) => {
      const updated = { ...prev };
      updated[selectedDealId] = updated[selectedDealId].map((task) => {
        if (task.id === taskId) {
          addLog(`Task [${task.id}] structural stage moved to [${targetStage.toUpperCase()}].`, 'info');
          const updatedTask = { ...task, stage: targetStage };
          if (viewingTask?.id === taskId) {
            setViewingTask(updatedTask);
          }
          return updatedTask;
        }
        return task;
      });
      return updated;
    });
  };

  const handleUpdateStatus = (taskId: string, status: 'blocked' | 'in_progress' | 'verified') => {
    setTasks((prev) => {
      const updated = { ...prev };
      updated[selectedDealId] = updated[selectedDealId].map((task) => {
        if (task.id === taskId) {
          addLog(`Task [${task.id}] execution flag shifted to [${status.toUpperCase()}].`, status === 'blocked' ? 'warning' : 'success');
          const updatedTask = { ...task, status };
          if (viewingTask?.id === taskId) {
            setViewingTask(updatedTask);
          }
          return updatedTask;
        }
        return task;
      });
      return updated;
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newId = `TSK-${selectedDealId.split('-')[1]}-${Math.floor(100 + Math.random() * 900)}`;
    const createdTask: Task = {
      id: newId,
      title: newTaskTitle,
      description: newTaskDesc,
      stage: newTaskStage,
      riskCategory: newTaskCategory,
      riskScore: newTaskRiskScore,
      assignedTo: newTaskAssignedTo || 'Unassigned',
      status: 'in_progress',
      mitigationPlan: newTaskMitigation.trim() ? newTaskMitigation : undefined,
    };

    setTasks((prev) => {
      const updated = { ...prev };
      updated[selectedDealId] = [createdTask, ...(updated[selectedDealId] || [])];
      return updated;
    });

    addLog(`Dossier entry initialized: [${newId}] - "${newTaskTitle}"`, 'success');
    setIsNewTaskModalOpen(false);
    
    // Reset form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskCategory('concentration');
    setNewTaskStage('loi');
    setNewTaskRiskScore(50);
    setNewTaskAssignedTo('');
    setNewTaskMitigation('');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => {
      const updated = { ...prev };
      updated[selectedDealId] = updated[selectedDealId].filter((t) => t.id !== taskId);
      return updated;
    });
    addLog(`Task [${taskId}] decommissioned from local database.`, 'warning');
    if (viewingTask?.id === taskId) {
      setViewingTask(null);
    }
  };

  // Risk Diagnostics Summary
  const riskAverages = useMemo(() => {
    if (activeTasks.length === 0) return { avg: 0, highCount: 0 };
    const sum = activeTasks.reduce((acc, t) => acc + t.riskScore, 0);
    const high = activeTasks.filter((t) => t.riskScore >= 70).length;
    return {
      avg: Math.round(sum / activeTasks.length),
      highCount: high,
    };
  }, [activeTasks]);

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono p-4 md:p-6 min-h-screen flex flex-col justify-between selection:bg-[#00FF66] selection:text-[#050505]">
      
      {/* SECTION HEADER: WAR ROOM PIPELINE */}
      <div className="border border-[#222222] bg-[#0a0a0a] p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
            <h1 className="text-sm md:text-base font-bold tracking-[0.15em] uppercase text-[#F9F9F9]">
              DILIGENCE WAR ROOM & SECURE PIPELINE
            </h1>
          </div>
          <p className="text-[10px] text-[#888888] uppercase mt-1 tracking-wider">
            SBA 7(A) ALIGNED UNDERWRITING MATRIX & RISK DE-CONCENTRATION SYSTEM
          </p>
        </div>

        {/* Selected Deal Switchboard */}
        <div className="flex items-center space-x-2 bg-[#050505] border border-[#222222] p-1.5 self-start md:self-auto">
          <span className="text-[10px] text-[#888888] px-2 uppercase">SELECT TARGET:</span>
          {DEALS.map((deal) => (
            <button
              key={deal.id}
              onClick={() => {
                setSelectedDealId(deal.id);
                setViewingTask(null);
                addLog(`Switched surveillance context to [${deal.codename}].`, 'info');
              }}
              className={`text-[10px] px-3 py-1 font-bold border transition-all uppercase ${
                selectedDealId === deal.id
                  ? 'bg-[#00FF66] text-[#050505] border-[#00FF66]'
                  : 'bg-transparent text-[#888888] border-transparent hover:border-[#222222] hover:text-[#F9F9F9]'
              }`}
            >
              {deal.codename}
            </button>
          ))}
        </div>
      </div>

      {/* CORE PIPELINE DASHBOARD METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="border border-[#222222] bg-[#080808] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-[#888888] uppercase">CODENAME // VERTICAL</span>
          <span className="text-sm font-bold text-[#0EA5E9] mt-1 uppercase">
            {activeDeal.codename} — {activeDeal.industry}
          </span>
        </div>
        <div className="border border-[#222222] bg-[#080808] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-[#888888] uppercase">SBA STRUCTURE BASIS</span>
          <span className="text-sm font-bold text-[#F9F9F9] mt-1">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(activeDeal.asking)} ({activeDeal.multiple}x EBITDA)
          </span>
        </div>
        <div className="border border-[#222222] bg-[#080808] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-[#888888] uppercase">CONGESTION PROFILE</span>
          <span className="text-sm font-bold text-[#00FF66] mt-1 flex items-center space-x-1.5">
            <span>{activeTasks.length} ACTIVE ENTRIES</span>
            <span className="text-[10px] text-[#888888]">({activeTasks.filter(t => t.status === 'blocked').length} BLOCKED)</span>
          </span>
        </div>
        <div className="border border-[#222222] bg-[#080808] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-[#888888] uppercase">RISK INDEX CONVERGENCE</span>
          <span className={`text-sm font-bold mt-1 ${riskAverages.avg >= 70 ? 'text-[#FF3333]' : 'text-[#00FF66]'}`}>
            {riskAverages.avg}% CRITICAL RATING ({riskAverages.highCount} RED-LINE THREATS)
          </span>
        </div>
      </div>

      {/* SYSTEM CONTROLS BAR */}
      <div className="border border-[#222222] bg-[#0a0a0a] p-4 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="FILTER BY OPERATIVE OR BRIEF..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none p-2.5 placeholder-[#888888] uppercase font-mono tracking-wider transition-colors"
          />
          <div className="absolute right-3 top-2.5 text-[9px] text-[#888888] pointer-events-none">SEARCH_MODE</div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] text-[#888888] mr-2 uppercase">RISK MATRICES:</span>
          {(['ALL', 'concentration', 'working_capital', 'key_man', 'financial', 'legal'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[9px] px-2.5 py-1.5 border uppercase font-bold tracking-wider transition-all duration-150 ${
                selectedCategory === cat
                  ? 'bg-[#0EA5E9] text-[#050505] border-[#0EA5E9]'
                  : 'bg-transparent text-[#888888] border-[#222222] hover:text-[#0EA5E9] hover:border-[#0EA5E9]'
              }`}
            >
              {cat === 'ALL' ? 'ALL RISKS' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Action Inject Task */}
        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="bg-[#00FF66] text-[#050505] border border-[#00FF66] font-bold text-xs uppercase px-4 py-2.5 hover:bg-[#050505] hover:text-[#00FF66] transition-all duration-200 tracking-wider flex items-center justify-center space-x-2 shadow-[2px_2px_0px_0px_rgba(0,255,102,0.3)]"
        >
          <span>[+] INJECT NEW PIPELINE ENTRY</span>
        </button>
      </div>

      {/* KANBAN BOARD WRAPPER */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start mb-6">
        {STAGES.map((stage) => {
          const stageTasks = filteredTasks.filter((t) => t.stage === stage.id);

          return (
            <div
              key={stage.id}
              className="border border-[#222222] bg-[#080808] flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="border-b border-[#222222] bg-[#0c0c0c] p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F9F9F9] tracking-wider uppercase">
                    {stage.label}
                  </span>
                  <span className="text-[10px] font-bold text-[#0EA5E9] px-1.5 py-0.5 bg-[#050505] border border-[#222222]">
                    {stageTasks.length}
                  </span>
                </div>
                <span className="text-[9px] text-[#888888] uppercase mt-1 leading-normal">
                  {stage.description}
                </span>
              </div>

              {/* Column Cards Stream */}
              <div className="p-3 space-y-3 flex-grow overflow-y-auto max-h-[650px] bg-[#050505]/40">
                {stageTasks.length === 0 ? (
                  <div className="h-28 border border-dashed border-[#222222] flex flex-col items-center justify-center text-center p-4">
                    <span className="text-[10px] text-[#888888] uppercase font-bold">STAGE VACANT</span>
                    <span className="text-[8px] text-[#888888] uppercase mt-1">No active structural hurdles</span>
                  </div>
                ) : (
                  stageTasks.map((task) => {
                    const statusColor =
                      task.status === 'blocked'
                        ? 'border-[#FF3333]'
                        : task.status === 'verified'
                        ? 'border-[#00FF66]'
                        : 'border-[#222222]';

                    const threatColorText =
                      task.riskScore >= 70
                        ? 'text-[#FF3333]'
                        : task.riskScore >= 40
                        ? 'text-[#0EA5E9]'
                        : 'text-[#00FF66]';

                    return (
                      <div
                        key={task.id}
                        onClick={() => setViewingTask(task)}
                        className={`border ${statusColor} bg-[#0c0c0c] p-3 hover:border-[#0EA5E9] cursor-pointer transition-all duration-150 relative group ${
                          viewingTask?.id === task.id ? 'shadow-[0_0_10px_rgba(14,165,233,0.15)] border-[#0EA5E9]' : ''
                        }`}
                      >
                        {/* Task Card Header */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-[#888888] px-1 bg-[#050505] border border-[#222222]">
                            {task.id}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${threatColorText}`}>
                            {task.riskScore}% RISK
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="text-xs font-bold text-[#F9F9F9] group-hover:text-[#0EA5E9] transition-colors uppercase leading-tight mb-1">
                          {task.title}
                        </h4>
                        <p className="text-[10px] text-[#888888] line-clamp-2 leading-relaxed mb-3">
                          {task.description}
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#222222]">
                          <span className="text-[8px] px-1.5 py-0.5 border border-[#222222] text-[#888888] uppercase bg-[#050505] tracking-wide">
                            {task.riskCategory.replace('_', ' ')}
                          </span>
                          <span className="text-[8px] px-1.5 py-0.5 border border-[#222222] text-[#888888] uppercase bg-[#050505] tracking-wide ml-auto">
                            {task.assignedTo}
                          </span>
                        </div>

                        {/* Quick Action Navigation in Card Footer */}
                        <div className="mt-3 pt-2 border-t border-[#222222] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[8px] text-[#00FF66] uppercase">OPEN DIAGNOSTICS</span>
                          <div className="flex items-center space-x-1">
                            {STAGES.map((s) => {
                              if (s.id === task.stage) return null;
                              return (
                                <button
                                  key={s.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveStage(task.id, s.id);
                                  }}
                                  title={`Shift to ${s.label}`}
                                  className="text-[8px] px-1 bg-[#050505] border border-[#222222] hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
                                >
                                  {s.id === 'loi' ? '1' : s.id === 'qofe' ? '2' : s.id === 'legal' ? '3' : '4'}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DOUBLE-COLUMN DIAGNOSTICS PORTAL / WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* Left Side: Diagnostic Panel */}
        <div className="lg:col-span-8 border border-[#222222] bg-[#0a0a0a] p-4">
          <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-4">
            <span className="text-xs font-bold text-[#0EA5E9] tracking-wider uppercase">// CONSOLE DIAGNOSTIC REPORT</span>
            <span className="text-[9px] text-[#00FF66] animate-pulse">ACTIVE SECURE_LINK</span>
          </div>

          {viewingTask ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#222222] pb-3">
                <div>
                  <span className="text-[10px] text-[#888888] font-bold" x-text="'TASK: ' + viewingTask.id">
                    LOG ENTRY: {viewingTask.id}
                  </span>
                  <h3 className="text-base font-bold text-[#F9F9F9] uppercase mt-0.5">{viewingTask.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-[#888888] uppercase">STATUS INDICATOR:</span>
                  <select
                    value={viewingTask.status}
                    onChange={(e) => handleUpdateStatus(viewingTask.id, e.target.value as any)}
                    className="bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs p-1 focus:border-[#00FF66] focus:outline-none uppercase font-mono font-bold"
                  >
                    <option value="in_progress">⚙️ IN PROGRESS</option>
                    <option value="blocked">⚠️ BLOCKED (THREAT)</option>
                    <option value="verified">✅ VERIFIED (CLEAR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-[#222222] bg-[#050505] p-3">
                  <span className="text-[9px] text-[#888888] uppercase">RISK INDEX</span>
                  <span className={`text-base font-bold block mt-1 ${viewingTask.riskScore >= 70 ? 'text-[#FF3333]' : 'text-[#00FF66]'}`}>
                    {viewingTask.riskScore} / 100
                  </span>
                </div>
                <div className="border border-[#222222] bg-[#050505] p-3">
                  <span className="text-[9px] text-[#888888] uppercase">OPERATIVE ASSIGNED</span>
                  <span className="text-xs font-bold text-[#0EA5E9] block mt-1 uppercase">
                    {viewingTask.assignedTo}
                  </span>
                </div>
                <div className="border border-[#222222] bg-[#050505] p-3">
                  <span className="text-[9px] text-[#888888] uppercase">PIPELINE MILESTONE</span>
                  <span className="text-xs font-bold text-[#F9F9F9] block mt-1 uppercase">
                    {STAGES.find((s) => s.id === viewingTask.stage)?.label || viewingTask.stage}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-[#888888] uppercase block">// INVESTIGATION DOSSIER</span>
                <p className="text-xs text-[#F9F9F9]/80 leading-relaxed bg-[#050505] border border-[#222222] p-3 uppercase font-mono">
                  {viewingTask.description}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-[#888888] uppercase block">// DE-RISK & CONTINGENCY STRUCTURAL PLAN</span>
                {viewingTask.mitigationPlan ? (
                  <p className="text-xs text-[#00FF66]/90 leading-relaxed bg-[#00FF66]/5 border border-[#00FF66]/30 p-3 uppercase">
                    {viewingTask.mitigationPlan}
                  </p>
                ) : (
                  <div className="text-xs text-[#888888] bg-[#050505] border border-[#222222] p-3 border-dashed uppercase">
                    No dedicated mitigation policy registered. Standard legal warranties default to escrow protection.
                  </div>
                )}
              </div>

              {/* Action Buttons inside diagnostics */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#222222]">
                <div className="flex items-center space-x-1">
                  <span className="text-[9px] text-[#888888] uppercase mr-2">SHUTTLE STAGE:</span>
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleMoveStage(viewingTask.id, s.id)}
                      className={`text-[9px] px-2.5 py-1 border transition-all ${
                        viewingTask.stage === s.id
                          ? 'bg-[#00FF66] text-[#050505] border-[#00FF66] font-bold'
                          : 'bg-[#050505] text-[#888888] border-[#222222] hover:border-[#0EA5E9] hover:text-[#0EA5E9]'
                      }`}
                    >
                      {s.id.toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleDeleteTask(viewingTask.id)}
                  className="text-[10px] text-[#FF3333] border border-[#FF3333] px-3 py-1 hover:bg-[#FF3333] hover:text-[#050505] transition-all font-bold uppercase"
                >
                  [DECOMMISSION THREAD]
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center border border-dashed border-[#222222] p-6 bg-[#050505]/40">
              <div className="w-8 h-8 rounded-full border border-[#222222] flex items-center justify-center text-[#888888] mb-3">
                🔎
              </div>
              <h4 className="text-xs font-bold uppercase text-[#888888] tracking-widest">DIAGNOSTIC CORE OFFLINE</h4>
              <p className="text-[10px] text-[#888888] uppercase mt-1 max-w-sm">
                Select any active pipeline entry above to query internal parameters, risk ratings, and mitigations.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Log Stream */}
        <div className="lg:col-span-4 border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <span className="text-xs font-bold text-[#FF3333] tracking-wider uppercase">// SYSTEM TELEMETRY STREAM</span>
              <span className="text-[9px] text-[#888888]">NODE_489X_WAR_ROOM</span>
            </div>

            {/* Realtime Event Stream logs */}
            <div className="space-y-3">
              {logs.map((log, index) => {
                const color =
                  log.type === 'warning'
                    ? 'text-[#FF3333]'
                    : log.type === 'success'
                    ? 'text-[#00FF66]'
                    : 'text-[#0EA5E9]';

                return (
                  <div key={index} className="text-[10px] font-mono leading-relaxed uppercase border-b border-[#111111] pb-2">
                    <span className="text-[#888888] mr-2">[{log.timestamp}]</span>
                    <span className={color}>{log.message}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#222222] bg-darkMuted text-[9px] text-[#888888] space-y-2">
            <span className="text-[#F9F9F9] uppercase font-bold block">// PLANNED UNDERWRITING THRESHOLDS</span>
            <p className="leading-relaxed">
              Standard regulatory guidance requires a Debt Service Coverage Ratio (DSCR) above 1.25x to authorize transactional pool drawdowns. Highlighted risks must possess registered remediation blueprints before legal closure checks can execute.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL WINDOW: TASK CREATION ENGINE */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#050505]/95 backdrop-blur-sm"
            onClick={() => setIsNewTaskModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-lg border border-[#222222] bg-[#0a0a0a] text-[#F9F9F9] p-6 space-y-4 z-10 font-mono">
            <div className="border-b border-[#222222] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-[#0EA5E9] font-bold uppercase">SECURE DATABASE ENTRY</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F9F9F9]">
                  INJECT PIPELINE RISK TASK
                </h2>
              </div>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="border border-[#222222] text-[#888888] hover:border-[#FF3333] hover:text-[#FF3333] px-2 py-1 text-[9px] uppercase transition-colors"
              >
                [ESC] CANCEL
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-[#888888] uppercase block">Task Summary / Header</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AUDIT 1031 COMPATIBILITY STRUCTURES"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] p-2 focus:border-[#00FF66] focus:outline-none uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#888888] uppercase block">Investigation Briefing</label>
                <textarea
                  required
                  rows={3}
                  placeholder="PROVIDE OPERATIONAL STEPS AND RISK DETAILS..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] p-2 focus:border-[#00FF66] focus:outline-none uppercase font-mono"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#888888] uppercase block">Risk Matrix Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as RiskCategory)}
                    className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] p-2 focus:border-[#00FF66] focus:outline-none uppercase font-mono"
                  >
                    <option value="concentration">CUSTOMER CONCENTRATION</option>
                    <option value="working_capital">WORKING CAPITAL</option>
                    <option value="key_man">KEY-MAN TRANSITION</option>
                    <option value="financial">FINANCIAL AUDIT</option>
                    <option value="legal">LEGAL CLOSING</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#888888] uppercase block">Initial Stage Target</label>
                  <select
                    value={newTaskStage}
                    onChange={(e) => setNewTaskStage(e.target.value as Stage)}
                    className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] p-2 focus:border-[#00FF66] focus:outline-none uppercase font-mono"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#888888]">
                    <label className="uppercase">THREAT INDEX</label>
                    <span className="font-bold text-[#00FF66]">{newTaskRiskScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={newTaskRiskScore}
                    onChange={(e) => setNewTaskRiskScore(parseInt(e.target.value))}
                    className="w-full accent-[#00FF66] bg-[#050505]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#888888] uppercase block">Assigned Operative</label>
                  <input
                    type="text"
                    placeholder="e.g. M&A ATTORNEY"
                    value={newTaskAssignedTo}
                    onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] p-2 focus:border-[#00FF66] focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#888888] uppercase block">Mitigation Blueprint (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="IF DETECTED, DESCRIBE CORRECTIVE ACTIONS..."
                  value={newTaskMitigation}
                  onChange={(e) => setNewTaskMitigation(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] p-2 focus:border-[#00FF66] focus:outline-none uppercase font-mono"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-[#222222] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="text-xs text-[#888888] hover:text-[#F9F9F9] px-4 py-2"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  className="bg-[#00FF66] text-[#050505] border border-[#00FF66] font-bold px-5 py-2 uppercase hover:bg-[#050505] hover:text-[#00FF66] transition-colors"
                >
                  COMPILE & INJECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}