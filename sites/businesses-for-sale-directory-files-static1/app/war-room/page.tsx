"use client";

import React, { useState, useEffect } from 'react';

// ==========================================
// TYPES & CONSTRAINTS
// ==========================================
interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: 'Financial' | 'Legal' | 'Operations' | 'SBA/Funding';
}

interface Deal {
  id: string;
  codename: string;
  industry: string;
  asking: number;
  ebitda: number;
  stage: 'LOI' | 'QOFE' | 'LEGAL' | 'CLOSING';
  risks: {
    customerConcentration: number; // 0-100
    workingCapitalGap: number; // 0-100
    keyManDependency: number; // 0-100
  };
  checklists: Task[];
  statusMessage: string;
}

const STAGES = [
  { id: 'LOI' as const, label: '01 // LETTER OF INTENT (LOI)', desc: 'Mutual signature & exclusivity locking' },
  { id: 'QOFE' as const, label: '02 // QUALITY OF EARNINGS (QOFE)', desc: 'Third-party forensic ledger analysis' },
  { id: 'LEGAL' as const, label: '03 // LEGAL & SCHEDULES', desc: 'Asset purchase agreements & covenants' },
  { id: 'CLOSING' as const, label: '04 // CLOSING & CAPITAL FLOW', desc: 'SBA wire dispersal & equity Escrow' },
];

export default function WarRoom() {
  // ==========================================
  // INITIAL SEED DATA
  // ==========================================
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 'DL-8902',
      codename: 'Project Delta',
      industry: 'B2B Logistics Agency',
      asking: 1800000,
      ebitda: 620000,
      stage: 'QOFE',
      risks: {
        customerConcentration: 75,
        workingCapitalGap: 40,
        keyManDependency: 30,
      },
      statusMessage: 'CPA analyzing tax reconciliation anomalies. Concentration audit active.',
      checklists: [
        { id: 't1', title: 'Validate last 3 years tax returns with IRS Form 4506-C', completed: true, category: 'Financial' },
        { id: 't2', title: 'Map top 3 customer contracts to billing history ledger', completed: false, category: 'Financial' },
        { id: 't3', title: 'Obtain general liability safety clearance logs', completed: false, category: 'Operations' },
        { id: 't4', title: 'Review key-man non-compete template terms', completed: true, category: 'Legal' },
      ]
    },
    {
      id: 'DL-4411',
      codename: 'Project Cobalt',
      industry: 'HVAC & Air Treatment Systems',
      asking: 3200000,
      ebitda: 950000,
      stage: 'LEGAL',
      risks: {
        customerConcentration: 15,
        workingCapitalGap: 80,
        keyManDependency: 65,
      },
      statusMessage: 'APA revision 4 in progress. Dispute regarding raw parts inventory valuation limits.',
      checklists: [
        { id: 'c1', title: 'Reconcile physical sheet metal inventory assets with balance sheet', completed: true, category: 'Financial' },
        { id: 'c2', title: 'Draft standard APA Exhibit B (Excluded Assets)', completed: true, category: 'Legal' },
        { id: 'c3', title: 'Establish 12-month transition consulting timeline with target seller', completed: false, category: 'Operations' },
        { id: 'c4', title: 'Submit SBA Form 1919 for partner entities', completed: false, category: 'SBA/Funding' },
      ]
    },
    {
      id: 'DL-5520',
      codename: 'Project Cipher',
      industry: 'SaaS Property Management Suite',
      asking: 1600000,
      ebitda: 420000,
      stage: 'CLOSING',
      risks: {
        customerConcentration: 10,
        workingCapitalGap: 20,
        keyManDependency: 90,
      },
      statusMessage: 'SBA 7a fund authorization complete. Escrow setup pending key handover.',
      checklists: [
        { id: 's1', title: 'Secure multi-sig GitHub repository ownership transfer protocol', completed: true, category: 'Operations' },
        { id: 's2', title: 'Confirm dynamic Stripe merchant gateway configuration migration', completed: true, category: 'Operations' },
        { id: 's3', title: 'Verify final escrow closing dispatch schedules & wiring rules', completed: true, category: 'SBA/Funding' },
        { id: 's4', title: 'Establish post-closing code review fallback warranty', completed: false, category: 'Legal' },
      ]
    },
    {
      id: 'DL-7109',
      codename: 'Project Horizon',
      industry: 'Precision Tooling & Molding Shop',
      asking: 4200000,
      ebitda: 1200000,
      stage: 'LOI',
      risks: {
        customerConcentration: 45,
        workingCapitalGap: 90,
        keyManDependency: 40,
      },
      statusMessage: 'LOI fully countersigned. Scheduled first plant floor operational checklist run.',
      checklists: [
        { id: 'h1', title: 'Verify machinery depreciation reports match physical equipment', completed: false, category: 'Financial' },
        { id: 'h2', title: 'Check environmental EPA compliance history reports', completed: false, category: 'Legal' },
        { id: 'h3', title: 'Assess CNC supervisor retention package guarantees', completed: false, category: 'Operations' },
      ]
    },
    {
      id: 'DL-1102',
      codename: 'Project Apex',
      industry: 'Multi-Unit Residential Landscaping',
      asking: 950000,
      ebitda: 380000,
      stage: 'LOI',
      risks: {
        customerConcentration: 35,
        workingCapitalGap: 50,
        keyManDependency: 25,
      },
      statusMessage: 'Pre-DD phase activated. Reviewing localized county HOA client agreements.',
      checklists: [
        { id: 'a1', title: 'Execute customer contract renewal audit', completed: true, category: 'Legal' },
        { id: 'a2', title: 'Confirm equipment commercial fleet titles and lean checks', completed: false, category: 'Operations' },
      ]
    }
  ]);

  const [selectedDealId, setSelectedDealId] = useState<string>('DL-8902');
  const [logs, setLogs] = useState<string[]>([
    'WAR_ROOM: System network online. Safe handshake protocol standard initialized.',
    'LOG_DEAL: Project Delta shifted to Quality of Earnings channel [SECURE_NODE: 402].',
    'LOG_RISK: Project Cobalt working capital gap flag exceeded standard warning buffer (+80%).',
    'AUDIT: CPA checklist synced live via secure credential terminal node.'
  ]);

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newChecklistCategory, setNewChecklistCategory] = useState<'Financial' | 'Legal' | 'Operations' | 'SBA/Funding'>('Financial');

  // ==========================================
  // HANDLERS & COMPUTED STATE
  // ==========================================
  const selectedDeal = deals.find(d => d.id === selectedDealId) || deals[0];

  const pushLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const moveDeal = (dealId: string, direction: 'forward' | 'backward') => {
    const pipeline: Deal['stage'][] = ['LOI', 'QOFE', 'LEGAL', 'CLOSING'];
    setDeals(prevDeals => prevDeals.map(deal => {
      if (deal.id !== dealId) return deal;
      const currentIndex = pipeline.indexOf(deal.stage);
      let nextIndex = currentIndex;
      if (direction === 'forward' && currentIndex < pipeline.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (direction === 'backward' && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }
      if (nextIndex !== currentIndex) {
        const nextStage = pipeline[nextIndex];
        pushLog(`PROJECT MOVEMENT: ${deal.codename} transitioned from [${deal.stage}] to [${nextStage}]`);
        return { ...deal, stage: nextStage };
      }
      return deal;
    }));
  };

  const toggleTask = (dealId: string, taskId: string) => {
    setDeals(prevDeals => prevDeals.map(deal => {
      if (deal.id !== dealId) return deal;
      const updatedChecklist = deal.checklists.map(task => {
        if (task.id !== taskId) return task;
        pushLog(`AUDIT CHECKLIST UPDATE: Task [${task.title}] set to ${!task.completed ? 'COMPLETED' : 'INCOMPLETE'}`);
        return { ...task, completed: !task.completed };
      });
      return { ...deal, checklists: updatedChecklist };
    }));
  };

  const updateRisk = (dealId: string, riskType: 'customerConcentration' | 'workingCapitalGap' | 'keyManDependency', value: number) => {
    setDeals(prevDeals => prevDeals.map(deal => {
      if (deal.id !== dealId) return deal;
      return {
        ...deal,
        risks: {
          ...deal.risks,
          [riskType]: value
        }
      };
    }));
  };

  const addChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistItem.trim()) return;
    setDeals(prevDeals => prevDeals.map(deal => {
      if (deal.id !== selectedDealId) return deal;
      const newItem: Task = {
        id: `custom-${Date.now()}`,
        title: newChecklistItem.trim(),
        completed: false,
        category: newChecklistCategory
      };
      pushLog(`TASK ADDED: [${newChecklistCategory}] ${newItem.title} injected into ${deal.codename}`);
      return {
        ...deal,
        checklists: [...deal.checklists, newItem]
      };
    }));
    setNewChecklistItem('');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // Quick stats calculations for overall pipeline health indicators
  const totalVolume = deals.reduce((acc, d) => acc + d.asking, 0);
  const averageRisk = Math.round(
    deals.reduce((acc, d) => acc + (d.risks.customerConcentration + d.risks.workingCapitalGap + d.risks.keyManDependency) / 3, 0) / deals.length
  );

  return (
    <div className="bg-[#050505] text-[#F9F9F9] min-h-screen font-mono flex flex-col selection:bg-[#00FF66] selection:text-[#050505] antialiased">
      
      {/* 1. STYLED CRT LINK / CSS INJECTION FOR THEME ACCURACY */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />

      {/* 2. TRANSACTION LOGS MARQUEE TICKER */}
      <div className="overflow-hidden border-b border-[#222222] bg-[#0a0a0a] py-1 text-[10px] tracking-[0.2em] text-[#0EA5E9] uppercase">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-8 text-[#00FF66]">[DUE DILIGENCE WAR ROOM ACTIVE // NODE: SECURE_7A]</span>
          <span className="mx-8">[AUDIT FREQUENCY: TTM AUDITING STANDARDS COMPLIANT]</span>
          <span className="mx-8 text-[#FF3333]">[WARNING: RISK INDEX CRITICAL IN PROJECT COBALT]</span>
          <span className="mx-8">[QOFE STATUS: FORENSIC LEDGER RECONCILIATION IN TRANSIT]</span>
          <span className="mx-8 text-[#00FF66]">[MERCHANT GATEWAY TRANSFERS: VERIFIED VALID]</span>
        </div>
      </div>

      {/* 3. CORE NAVIGATION HEADER */}
      <header className="border-b border-[#222222] bg-[#050505] sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#00FF66] animate-pulse"></div>
              <span className="text-lg font-bold tracking-wider text-[#F9F9F9]">
                ACQUIRE<span className="text-[#00FF66]">META</span>
              </span>
              <span className="text-xs text-[#888888]">/</span>
              <span className="text-xs text-[#0EA5E9] tracking-widest font-bold">WAR_ROOM v1.4</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 border border-[#222222] text-[#888888] bg-[#0c0c0c] uppercase md:inline-block hidden">
              Live Pipeline Diagnostics
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-[#888888] justify-center md:justify-end">
            <div>TOTAL SECURED PIPELINE VOLUME: <span className="text-[#0EA5E9] font-bold">{formatCurrency(totalVolume)}</span></div>
            <div className="border border-[#222222] px-2 py-1 bg-[#111111] text-[#F9F9F9] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] block animate-ping"></span>
              CPA AUDITING ENGINES READY
            </div>
          </div>
        </div>
      </header>

      {/* 4. WAR-ROOM DASHBOARD LAYOUT */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 md:px-6 py-6 space-y-6">
        
        {/* TOP LEVEL BENTO STATUS BOARD */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col justify-between">
            <span className="text-[10px] text-[#888888] block uppercase tracking-wider">// PIPELINE DENSITY</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#F9F9F9]">{deals.length}</span>
              <span className="text-xs text-[#888888]">Active Escrows/LOIs</span>
            </div>
            <p className="text-[9px] text-[#888888] mt-2">Continuous regulatory verification of baseline operational earnings.</p>
          </div>

          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col justify-between">
            <span className="text-[10px] text-[#888888] block uppercase tracking-wider">// AGGREGATE RISK LEVEL</span>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl font-bold text-[#FF3333]">{averageRisk}%</span>
              <div className="flex-grow bg-[#222] h-2">
                <div className="h-full bg-[#FF3333]" style={{ width: `${averageRisk}%` }}></div>
              </div>
            </div>
            <p className="text-[9px] text-[#888888] mt-2">Combined vector of Concentration, Key-man, and CapEx liability.</p>
          </div>

          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col justify-between">
            <span className="text-[10px] text-[#888888] block uppercase tracking-wider">// TOTAL CAPITAL COMMITTED</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#0EA5E9]">{formatCurrency(totalVolume)}</span>
            </div>
            <p className="text-[9px] text-[#888888] mt-2">Estimated leverage distribution utilizing SBA 7(a) 90% debt mechanisms.</p>
          </div>

          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col justify-between">
            <span className="text-[10px] text-[#888888] block uppercase tracking-wider">// STAGING STABILITY CONTROLLER</span>
            <div className="mt-2 flex items-center justify-between text-xs text-[#00FF66] font-bold">
              <span>SYSTEM FLOW LOCK</span>
              <span className="bg-[#00FF66]/10 px-2 py-0.5 border border-[#00FF66] text-[10px]">AUTO-SYNCED</span>
            </div>
            <p className="text-[9px] text-[#888888] mt-2">Automatic transaction audit alerts generated every 300 seconds.</p>
          </div>
        </section>

        {/* 5. THE HIGH-DENSITY KANBAN INTERFACE */}
        <section className="space-y-4">
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-[#F9F9F9] uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00FF66]"></span>
                Acquisitions Due Diligence Pipelines (Interactive Flow Chart)
              </h2>
              <p className="text-[10px] text-[#888888] mt-1">
                Relocate projects using operational stage commands. Select custom cards to audit checklists.
              </p>
            </div>
            <div className="text-[10px] text-[#888888] self-stretch sm:self-auto flex items-center justify-between gap-4">
              <span>SYSTEM ACTIVE</span>
              <span className="text-[#00FF66] font-bold">LIVE MATRIX CONNECT</span>
            </div>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {STAGES.map((stage) => {
              const stageDeals = deals.filter(d => d.stage === stage.id);
              return (
                <div key={stage.id} className="border border-[#222222] bg-[#0a0a0a] flex flex-col justify-between">
                  
                  {/* Column Header */}
                  <div className="border-b border-[#222222] p-3 bg-[#0c0c0c]">
                    <h3 className="text-xs font-bold text-[#0EA5E9] tracking-wider uppercase">{stage.label}</h3>
                    <p className="text-[9px] text-[#888888] mt-1 line-clamp-1">{stage.desc}</p>
                    <div className="mt-2 flex justify-between items-center text-[10px]">
                      <span className="text-[#888888]">DEAL QUANTITY:</span>
                      <span className="text-[#00FF66] font-bold">{stageDeals.length}</span>
                    </div>
                  </div>

                  {/* Deals in Stage Column Container */}
                  <div className="p-3 space-y-4 min-h-[360px] max-h-[600px] overflow-y-auto bg-[#050505] flex-grow">
                    {stageDeals.length === 0 ? (
                      <div className="border border-dashed border-[#222222] p-8 text-center text-[10px] text-[#888888] h-full flex items-center justify-center">
                        NO ACTIVE TARGETS IN STAGE
                      </div>
                    ) : (
                      stageDeals.map(deal => {
                        const totalTasks = deal.checklists.length;
                        const completedTasks = deal.checklists.filter(t => t.completed).length;
                        const pctDone = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                        const isSelected = selectedDealId === deal.id;

                        // Calculate average risk for layout coloring
                        const avgRisk = Math.round((deal.risks.customerConcentration + deal.risks.workingCapitalGap + deal.risks.keyManDependency) / 3);

                        return (
                          <div 
                            key={deal.id}
                            onClick={() => setSelectedDealId(deal.id)}
                            className={`border transition-all duration-150 p-3 cursor-pointer relative group flex flex-col justify-between ${
                              isSelected 
                                ? 'border-[#00FF66] bg-[#0d0d0d] shadow-[0_0_15px_rgba(0,255,102,0.1)]' 
                                : 'border-[#222222] bg-[#0a0a0a] hover:border-[#0EA5E9] hover:bg-[#070707]'
                            }`}
                          >
                            {/* Card Top Information */}
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-[9px] px-1.5 py-0.5 border border-[#222222] bg-[#111111] text-[#0EA5E9] font-bold">
                                  {deal.id}
                                </span>
                                <h4 className="text-xs font-bold text-[#F9F9F9] uppercase mt-2 group-hover:text-[#00FF66] transition-colors">
                                  {deal.codename}
                                </h4>
                                <p className="text-[10px] text-[#888888] truncate">{deal.industry}</p>
                              </div>
                              <span className="text-xs font-bold text-[#F9F9F9]">
                                {deal.asking >= 1000000 ? `${(deal.asking / 1000000).toFixed(1)}M` : `${(deal.asking / 1000).toFixed(0)}K`}
                              </span>
                            </div>

                            {/* Risk Alert Levels Indicators */}
                            <div className="grid grid-cols-3 gap-1 mt-3 py-1.5 border-t border-b border-[#222222] text-[8px] text-center">
                              <div>
                                <span className="text-[#888888] block uppercase">CONC</span>
                                <span className={`font-bold ${deal.risks.customerConcentration > 60 ? 'text-[#FF3333]' : 'text-[#888888]'}`}>
                                  {deal.risks.customerConcentration}%
                                </span>
                              </div>
                              <div>
                                <span className="text-[#888888] block uppercase">W/CAP</span>
                                <span className={`font-bold ${deal.risks.workingCapitalGap > 70 ? 'text-[#FF3333]' : 'text-[#888888]'}`}>
                                  {deal.risks.workingCapitalGap}%
                                </span>
                              </div>
                              <div>
                                <span className="text-[#888888] block uppercase">KEYMAN</span>
                                <span className={`font-bold ${deal.risks.keyManDependency > 60 ? 'text-[#FF3333]' : 'text-[#888888]'}`}>
                                  {deal.risks.keyManDependency}%
                                </span>
                              </div>
                            </div>

                            {/* DD Progression Bar */}
                            <div className="mt-3 space-y-1">
                              <div className="flex justify-between text-[9px] text-[#888888]">
                                <span>DD DRILLDOWN COMPLETE:</span>
                                <span className="text-[#00FF66] font-bold">{pctDone}%</span>
                              </div>
                              <div className="w-full bg-[#111111] h-1.5 border border-[#222222]">
                                <div className="h-full bg-[#00FF66]" style={{ width: `${pctDone}%` }}></div>
                              </div>
                            </div>

                            {/* Manual Movement Handlers - Perfect for a retro command terminal look */}
                            <div className="mt-4 pt-2.5 border-t border-[#222222] flex justify-between gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveDeal(deal.id, 'backward');
                                }}
                                disabled={deal.stage === 'LOI'}
                                className="text-[9px] px-2 py-1 border border-[#222222] text-[#888888] disabled:opacity-30 disabled:hover:bg-transparent hover:bg-[#111111] hover:text-[#0EA5E9] transition-colors"
                              >
                                [ ◀ REV ]
                              </button>
                              <span className="text-[9px] self-center text-center font-bold text-[#888888]">
                                PIPELINE SHIFT
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveDeal(deal.id, 'forward');
                                }}
                                disabled={deal.stage === 'CLOSING'}
                                className="text-[9px] px-2 py-1 border border-[#222222] text-[#888888] disabled:opacity-30 disabled:hover:bg-transparent hover:bg-[#111111] hover:text-[#00FF66] transition-colors"
                              >
                                [ FWD ▶ ]
                              </button>
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
        </section>

        {/* 6. DUAL INTERACTIVE WAR ROOM WORK BENCH (Checklist & Risks) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          
          {/* LEFT COLUMN: ACTIVE DEAL DRILL DOWN CHECKLIST & DIAGNOSTICS */}
          <div className="lg:col-span-7 border border-[#222222] bg-[#0a0a0a] p-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Selected Deal Banner header */}
              <div className="border-b border-[#222222] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-[#0EA5E9] font-bold tracking-widest block uppercase">
                    // WORKBENCH ANALYZING: {selectedDeal.id}
                  </span>
                  <h3 className="text-xl font-bold uppercase text-[#F9F9F9] tracking-wider mt-1">
                    {selectedDeal.codename} — {selectedDeal.industry}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#888888] uppercase">CURRENT STATUS POINT:</span>
                  <span className="text-[11px] font-bold border border-[#00FF66] text-[#00FF66] px-2 py-1 bg-[#00FF66]/5 uppercase">
                    {selectedDeal.stage} PHASE
                  </span>
                </div>
              </div>

              {/* Status Remarks */}
              <div className="p-3 border border-[#222222] bg-[#080808] text-xs text-[#888888] leading-relaxed flex items-center justify-between">
                <div>
                  <span className="text-[#00FF66] font-bold uppercase block text-[10px] mb-1">CPA REMARKS // LIVE DOSSIER:</span>
                  <span>"{selectedDeal.statusMessage}"</span>
                </div>
                <div className="hidden sm:block text-right shrink-0 ml-4">
                  <span className="text-[9px] block text-[#888888]">EBITDA LEVEL</span>
                  <span className="text-sm font-bold text-[#F9F9F9]">{formatCurrency(selectedDeal.ebitda)}</span>
                </div>
              </div>

              {/* Interactive Checklist Manager */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0EA5E9] tracking-widest uppercase">// CRITICAL DUE DILIGENCE MANDATES</span>
                  <span className="text-[10px] text-[#888888]">Click checkbox to toggle verification status</span>
                </div>

                <div className="space-y-2 border border-[#222222] p-4 bg-[#050505] max-h-[300px] overflow-y-auto">
                  {selectedDeal.checklists.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => toggleTask(selectedDeal.id, task.id)}
                      className="flex items-start gap-3 p-2 border border-[#111111] hover:border-[#222222] hover:bg-[#0a0a0a] cursor-pointer transition-colors"
                    >
                      <div className="pt-0.5">
                        <div className={`w-4 h-4 border flex items-center justify-center ${
                          task.completed 
                            ? 'border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66]' 
                            : 'border-[#222222] bg-transparent text-transparent'
                        }`}>
                          {task.completed && '✓'}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className={`text-xs ${task.completed ? 'line-through text-[#888888]' : 'text-[#F9F9F9]'}`}>
                          {task.title}
                        </p>
                        <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 border border-[#222222] text-[#888888] bg-[#111111] inline-block mt-1.5">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  ))}

                  {selectedDeal.checklists.length === 0 && (
                    <div className="text-center py-6 text-xs text-[#888888]">
                      Checklist database empty for this asset node. Inject custom directives below.
                    </div>
                  )}
                </div>
              </div>

              {/* Add Custom DD Directive Form */}
              <form onSubmit={addChecklistItem} className="border border-[#222222] p-3 bg-[#0a0a0a] space-y-3">
                <span className="text-[10px] text-[#888888] block uppercase tracking-wider">// Inject Custom Diligence Directive</span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="E.g., Query historical customer cohort attrition parameters..."
                    className="flex-grow bg-[#050505] border border-[#222222] text-xs p-2 text-[#F9F9F9] focus:outline-none focus:border-[#00FF66] font-mono"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newChecklistCategory}
                      onChange={(e) => setNewChecklistCategory(e.target.value as any)}
                      className="bg-[#050505] border border-[#222222] text-xs p-2 text-[#F9F9F9] focus:outline-none focus:border-[#00FF66] font-mono"
                    >
                      <option value="Financial">FINANCIAL</option>
                      <option value="Legal">LEGAL</option>
                      <option value="Operations">OPERATIONS</option>
                      <option value="SBA/Funding">SBA/FUNDING</option>
                    </select>
                    <button 
                      type="submit"
                      className="bg-[#00FF66] text-[#050505] hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] transition-colors font-bold text-xs px-4 py-2 uppercase"
                    >
                      Inject [ + ]
                    </button>
                  </div>
                </div>
              </form>

            </div>

            <div className="text-[10px] text-[#888888] border-t border-[#222222] pt-4 mt-6">
              * Verification checklists are cryptographically logs in the node system ledger and satisfy strict third party lending oversight rules.
            </div>
          </div>

          {/* RIGHT COLUMN: RISK CONTROLS & COMPILATION LOG CONSOLE */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Live Risk Parameter Controls */}
            <div className="border border-[#222222] bg-[#0a0a0a] p-6 space-y-6 flex-grow">
              <div className="flex justify-between items-center border-b border-[#222222] pb-4">
                <div>
                  <span className="text-[10px] text-[#FF3333] font-bold block">// RISK LEVEL COMPLIANCE MONITOR</span>
                  <h3 className="text-sm font-bold uppercase text-[#F9F9F9] tracking-wider mt-1">
                    Mitigation sliders: {selectedDeal.codename}
                  </h3>
                </div>
                <span className="text-[10px] text-[#888888] font-bold uppercase">DIAG-701</span>
              </div>

              <p className="text-[11px] text-[#888888] leading-relaxed">
                Tune the risk baseline after reviewing supplier profiles, banking histories and physical structures.
              </p>

              {/* Risk Slider 1: Customer Concentration */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888888]">CUSTOMER CONCENTRATION RISK:</span>
                  <span className={`font-bold ${selectedDeal.risks.customerConcentration > 60 ? 'text-[#FF3333]' : 'text-[#00FF66]'}`}>
                    {selectedDeal.risks.customerConcentration}% {selectedDeal.risks.customerConcentration > 60 ? '(HIGH WARNING)' : '(STABLE)'}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={selectedDeal.risks.customerConcentration}
                  onChange={(e) => updateRisk(selectedDeal.id, 'customerConcentration', parseInt(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#111111] h-1"
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>0% (Perfect Spread)</span>
                  <span>100% (Single Account Dependency)</span>
                </div>
              </div>

              {/* Risk Slider 2: Working Capital Gap */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888888]">WORKING CAPITAL GAP DEFICIT:</span>
                  <span className={`font-bold ${selectedDeal.risks.workingCapitalGap > 70 ? 'text-[#FF3333]' : 'text-[#00FF66]'}`}>
                    {selectedDeal.risks.workingCapitalGap}% {selectedDeal.risks.workingCapitalGap > 70 ? '(CRITICAL)' : '(NORMAL)'}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={selectedDeal.risks.workingCapitalGap}
                  onChange={(e) => updateRisk(selectedDeal.id, 'workingCapitalGap', parseInt(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#111111] h-1"
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>0% (Strong Cash reserves)</span>
                  <span>100% (High Off-season Burn Rate)</span>
                </div>
              </div>

              {/* Risk Slider 3: Key-Man Transition Dependencies */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888888]">KEY-MAN TRANSITION LOCKUP:</span>
                  <span className={`font-bold ${selectedDeal.risks.keyManDependency > 60 ? 'text-[#FF3333]' : 'text-[#0EA5E9]'}`}>
                    {selectedDeal.risks.keyManDependency}% {selectedDeal.risks.keyManDependency > 60 ? '(RETENTION ISSUES)' : '(MODERATE)'}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={selectedDeal.risks.keyManDependency}
                  onChange={(e) => updateRisk(selectedDeal.id, 'keyManDependency', parseInt(e.target.value))}
                  className="w-full accent-[#00FF66] bg-[#111111] h-1"
                />
                <div className="flex justify-between text-[9px] text-[#888888]">
                  <span>0% (Automated Operations)</span>
                  <span>100% (Sole Founder IP Lock)</span>
                </div>
              </div>

              {/* Live Risk Mitigation Summary advice */}
              <div className="border border-[#222222] p-3.5 bg-[#111111] text-[10px] space-y-2 text-[#888888]">
                <div className="text-[#F9F9F9] font-bold uppercase tracking-wider">// SYSTEM SUGGESTED ESCROW HEDGE</div>
                {selectedDeal.risks.customerConcentration > 50 && (
                  <p className="text-[#FF3333]">➔ SUGGESTED REMEDY: Integrate a minimum 15% purchase price earnout contingency based on customer retention margins over year 1.</p>
                )}
                {selectedDeal.risks.workingCapitalGap > 50 && (
                  <p className="text-[#0EA5E9]">➔ SUGGESTED REMEDY: Lock down a working capital baseline guarantee adjustment in APA Section 2.4. Target working capital reserve: $140,000.</p>
                )}
                {selectedDeal.risks.keyManDependency > 50 && (
                  <p className="text-[#00FF66]">➔ SUGGESTED REMEDY: Enforce a mandatory 180-day key-man advisory contract with 20% equity performance escrow lock.</p>
                )}
                {selectedDeal.risks.customerConcentration <= 50 && selectedDeal.risks.workingCapitalGap <= 50 && selectedDeal.risks.keyManDependency <= 50 && (
                  <p className="text-[#00FF66]">➔ Target risk is compliant with SBA Preferred Lending risk standards. Standard transition rules recommended.</p>
                )}
              </div>
            </div>

            {/* Live Terminal Log Console */}
            <div className="border border-[#222222] bg-[#050505] p-4 flex flex-col justify-between min-h-[180px] max-h-[250px]">
              <div>
                <div className="flex justify-between items-center mb-2 border-b border-[#222222] pb-2">
                  <span className="text-[10px] text-[#888888] font-bold uppercase">// LIVE SYSTEM DIALECTIC REGISTRY</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse"></span>
                    <span className="text-[8px] text-[#00FF66]">COMPILING SECURE</span>
                  </div>
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[140px] text-[9px] text-[#888888] font-mono leading-relaxed">
                  {logs.map((log, idx) => (
                    <div key={idx} className="truncate">
                      <span className="text-[#00FF66]">{`>`}</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* 7. SECURE ACQUISITION NETWORKS COMPLIANCE FOOTER */}
      <footer className="border-t border-[#222222] bg-[#030303] mt-12 py-8 px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-[#222222]">
            <div className="text-xs tracking-[0.2em] text-[#888888] uppercase font-mono">
              SECURE WAR ROOM TRANSIT CHANNELS
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8 items-center text-[10px] text-[#888888]">
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <span>FINCEN REGISTRY COMPLIANT</span>
              </div>
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <span>SBA SECURED CREDIT NODE</span>
              </div>
              <div className="flex items-center space-x-2 border border-[#222222] px-3 py-2 bg-[#111111]">
                <span>PLAID BANK DEBT API VERIFIED</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#888888] leading-relaxed max-w-7xl space-y-3 font-mono">
            <p className="uppercase tracking-wider text-[#F9F9F9]">// WAR ROOM COMPLIANCE STATEMENT</p>
            <p>
              This console provides high-density dynamic operational metrics modeled for structured due diligence exploration. Past auditing reports do not imply specific guarantees regarding bank credit underwriting. Task tracking targets are structural estimates based on standard multi-unit agency practices. No direct legal, financial brokerage, or formal CPA certification guarantees are generated in this active terminal network interface.
            </p>
            <div class="flex justify-between items-center text-[9px] text-[#888888] pt-4">
              <span>© 2026 ACQUIRE_META GLOBAL LTD. DEBT MODELING AND PIPELINE TERMINALS ACTIVE.</span>
              <span>NODE STATUS: SECURE [REGION: 899-TX]</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}