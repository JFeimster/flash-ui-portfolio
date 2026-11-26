import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Workflow, 
  DollarSign, 
  AlertTriangle, 
  CheckSquare, 
  Activity, 
  Terminal, 
  Layers, 
  FileText, 
  ArrowRight,
  RefreshCw,
  Clock,
  Briefcase,
  Lock,
  Compass
} from 'lucide-react';

// Deal Type Definition matching Base Component Domain
interface DiligenceDeal {
  id: string;
  codename: string;
  industry: string;
  vertical: string;
  asking: number;
  ebitda: number;
  stage: 'LOI_SIGNED' | 'QOFE_AUDIT' | 'LEGAL_CHECKLIST' | 'CLOSING_PREP';
  risks: {
    customerConcentration: number; // 0 - 100 percentage
    workingCapitalGap: number;     // 0 - 100 percentage
    keyManDependency: number;      // 0 - 100 percentage
    integrationComplexity: number;  // 0 - 100 percentage
    regulatoryExposure: number;    // 0 - 100 percentage
  };
  workingCapitalTarget: number;
  actualWorkingCapital: number;
  keyManMonthsTransition: number;
  largestClientShare: number;
  tasks: { id: string; name: string; completed: boolean; category: 'financial' | 'legal' | 'ops' }[];
}

const INITIAL_DEALS: DiligenceDeal[] = [
  {
    id: 'DL-8902',
    codename: 'Project Delta',
    industry: 'B2B Logistics Agency',
    vertical: 'Logistics',
    asking: 1800000,
    ebitda: 620000,
    stage: 'QOFE_AUDIT',
    risks: {
      customerConcentration: 75,
      workingCapitalGap: 40,
      keyManDependency: 50,
      integrationComplexity: 30,
      regulatoryExposure: 55,
    },
    workingCapitalTarget: 150000,
    actualWorkingCapital: 110000,
    keyManMonthsTransition: 6,
    largestClientShare: 35,
    tasks: [
      { id: 'T-1', name: 'Verify TTM ledger matching bank deposits', completed: true, category: 'financial' },
      { id: 'T-2', name: 'Verify key customer contracts assignability', completed: false, category: 'legal' },
      { id: 'T-3', name: 'Operational audit of dispatch pipeline tech', completed: false, category: 'ops' },
    ]
  },
  {
    id: 'DL-4411',
    codename: 'Project Cobalt',
    industry: 'HVAC & Air Treatment Systems',
    vertical: 'HVAC',
    asking: 3200000,
    ebitda: 950000,
    stage: 'LEGAL_CHECKLIST',
    risks: {
      customerConcentration: 20,
      workingCapitalGap: 65,
      keyManDependency: 85,
      integrationComplexity: 45,
      regulatoryExposure: 25,
    },
    workingCapitalTarget: 280000,
    actualWorkingCapital: 195000,
    keyManMonthsTransition: 12,
    largestClientShare: 8,
    tasks: [
      { id: 'T-4', name: 'Review standard 12-month owner transition covenant', completed: true, category: 'ops' },
      { id: 'T-5', name: 'SBA Preferred Network legal pre-screening', completed: true, category: 'legal' },
      { id: 'T-6', name: 'Verify environmental liabilities for shop site', completed: false, category: 'legal' },
      { id: 'T-7', name: 'Audit working capital trend lines over 24 months', completed: false, category: 'financial' },
    ]
  },
  {
    id: 'DL-5520',
    codename: 'Project Cipher',
    industry: 'SaaS Property Management Suite',
    vertical: 'SaaS',
    asking: 1600000,
    ebitda: 420000,
    stage: 'LOI_SIGNED',
    risks: {
      customerConcentration: 15,
      workingCapitalGap: 20,
      keyManDependency: 90,
      integrationComplexity: 80,
      regulatoryExposure: 40,
    },
    workingCapitalTarget: 45000,
    actualWorkingCapital: 42000,
    keyManMonthsTransition: 3,
    largestClientShare: 4,
    tasks: [
      { id: 'T-8', name: 'Execute Phase-1 clean code architecture audit', completed: false, category: 'ops' },
      { id: 'T-9', name: 'Verify churn statistics against stripe API logs', completed: false, category: 'financial' },
      { id: 'T-10', name: 'Draft IP assignment deeds for software core', completed: false, category: 'legal' },
    ]
  },
  {
    id: 'DL-7109',
    codename: 'Project Horizon',
    industry: 'Precision Tooling & Molding Shop',
    vertical: 'Manufacturing',
    asking: 4200000,
    ebitda: 1200000,
    stage: 'CLOSING_PREP',
    risks: {
      customerConcentration: 45,
      workingCapitalGap: 50,
      keyManDependency: 60,
      integrationComplexity: 70,
      regulatoryExposure: 75,
    },
    workingCapitalTarget: 450000,
    actualWorkingCapital: 465000,
    keyManMonthsTransition: 18,
    largestClientShare: 22,
    tasks: [
      { id: 'T-11', name: 'Appraise machine tooling asset values independently', completed: true, category: 'financial' },
      { id: 'T-12', name: 'Secure DoD ITAR compliance status verification', completed: true, category: 'legal' },
      { id: 'T-13', name: 'Confirm primary energy grid operational costs buffer', completed: true, category: 'ops' },
      { id: 'T-14', name: 'Finalize escrow documentation and allocation split', completed: false, category: 'financial' },
    ]
  }
];

export default function RiskExposureRadar() {
  const [deals, setDeals] = useState<DiligenceDeal[]>(INITIAL_DEALS);
  const [selectedDealId, setSelectedDealId] = useState<string>('DL-8902');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYS: Risk exposure telemetry modules initialized.',
    'SECURE: Connection mapped to Plaid API & SBA 7(a) compliance nodes.',
    'DIAG: Radar matrices ready for deep deal stress modeling.'
  ]);

  // Selected Deal context
  const selectedDeal = useMemo(() => {
    return deals.find(d => d.id === selectedDealId) || deals[0];
  }, [deals, selectedDealId]);

  // Calculations & UI models
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 8)]);
  };

  // Drag and Drop Pipeline transition simulation
  const transitionStage = (dealId: string, direction: 'forward' | 'backward') => {
    const stages: DiligenceDeal['stage'][] = ['LOI_SIGNED', 'QOFE_AUDIT', 'LEGAL_CHECKLIST', 'CLOSING_PREP'];
    setDeals(prevDeals => {
      return prevDeals.map(d => {
        if (d.id === dealId) {
          const currentIndex = stages.indexOf(d.stage);
          let nextIndex = currentIndex + (direction === 'forward' ? 1 : -1);
          if (nextIndex >= 0 && nextIndex < stages.length) {
            const nextStage = stages[nextIndex];
            addLog(`TRANSITIONED: ${d.codename} migrated to stage [${nextStage}]`);
            return { ...d, stage: nextStage };
          }
        }
        return d;
      });
    });
  };

  // Risk Sliders Live Handlers
  const handleRiskChange = (key: keyof DiligenceDeal['risks'], value: number) => {
    setDeals(prevDeals => {
      return prevDeals.map(d => {
        if (d.id === selectedDeal.id) {
          return {
            ...d,
            risks: {
              ...d.risks,
              [key]: value
            }
          };
        }
        return d;
      });
    });
  };

  // Live Task completion handler
  const toggleTask = (taskId: string) => {
    setDeals(prevDeals => {
      return prevDeals.map(d => {
        if (d.id === selectedDeal.id) {
          const updatedTasks = d.tasks.map(t => {
            if (t.id === taskId) {
              const nextState = !t.completed;
              addLog(`TASK MODIFIED: ${t.name} status flag -> ${nextState ? 'SOLVED' : 'PENDING'}`);
              return { ...t, completed: nextState };
            }
            return t;
          });
          return { ...d, tasks: updatedTasks };
        }
        return d;
      });
    });
  };

  // Compute calculated metrics live
  const calculateRiskMetrics = (deal: DiligenceDeal) => {
    // Valuation haircut is dynamically modeled on risk weights
    // Highest risks: Customer Concentration + Key-Man Dependency
    const baseVal = deal.asking;
    const concentrationImpact = (deal.risks.customerConcentration / 100) * 0.15; // up to 15% discount
    const keyManImpact = (deal.risks.keyManDependency / 100) * 0.12;           // up to 12% discount
    const workingCapitalRisk = (Math.max(0, deal.workingCapitalTarget - deal.actualWorkingCapital) / deal.workingCapitalTarget) * 0.10; // up to 10% target gap discount

    const totalDiscountRate = concentrationImpact + keyManImpact + workingCapitalRisk;
    const valuationDiscount = Math.round(baseVal * totalDiscountRate);
    const riskAdjustedValuation = baseVal - valuationDiscount;

    const pipelineProgress = Math.round((deal.tasks.filter(t => t.completed).length / deal.tasks.length) * 100) || 0;

    return {
      discountPercent: (totalDiscountRate * 100).toFixed(1),
      valuationDiscount,
      riskAdjustedValuation,
      pipelineProgress
    };
  };

  const selectedMetrics = useMemo(() => {
    return calculateRiskMetrics(selectedDeal);
  }, [selectedDeal]);

  // Compute overall health status for current deal
  const dealHealthScore = useMemo(() => {
    const r = selectedDeal.risks;
    const avgRisk = (r.customerConcentration + r.workingCapitalGap + r.keyManDependency + r.integrationComplexity + r.regulatoryExposure) / 5;
    return Math.round(100 - avgRisk);
  }, [selectedDeal]);

  // Generate radar coordinate points for rendering custom tactical radar grid
  const radarPoints = useMemo(() => {
    const keys: (keyof DiligenceDeal['risks'])[] = [
      'customerConcentration',
      'workingCapitalGap',
      'keyManDependency',
      'integrationComplexity',
      'regulatoryExposure'
    ];
    const centerX = 120;
    const centerY = 120;
    const radius = 90;

    return keys.map((key, i) => {
      const value = selectedDeal.risks[key];
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const amount = value / 100;
      const x = centerX + radius * amount * Math.cos(angle);
      const y = centerY + radius * amount * Math.sin(angle);
      return { x, y, label: key, angle };
    });
  }, [selectedDeal]);

  // Generate SVG polygon points string
  const radarPolygonPointsStr = radarPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-[#050505] text-[#F9F9F9] font-mono border border-[#222222] p-4 md:p-6 rounded-none space-y-6 max-w-[1600px] mx-auto min-h-screen flex flex-col justify-between selection:bg-[#00FF66] selection:text-[#050505]">
      
      {/* 1. COMPONENT TITLE BAR & TELEMETRY INDEX */}
      <div className="border-b border-[#222222] pb-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-2.5 h-2.5 bg-[#FF3333] animate-ping rounded-full"></div>
            <span className="text-xs text-[#0EA5E9] font-bold tracking-[0.2em] uppercase">// DUE DILIGENCE WAR ROOM v1.2B</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F9F9F9] uppercase">
            RISK EXPOSURE RADAR & PIPELINE
          </h1>
        </div>

        {/* Real-time system diagnostics */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#888888] w-full lg:w-auto">
          <div className="border border-[#222222] bg-[#111111] px-3 py-1.5 flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>GLOBAL AUDIT STATUS: <strong className="text-[#00FF66]">SECURE</strong></span>
          </div>
          <div className="border border-[#222222] bg-[#111111] px-3 py-1.5 flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>LOI EXPOSURE CAP: <strong className="text-[#0EA5E9]">$15.4M</strong></span>
          </div>
        </div>
      </div>

      {/* 2. TOP TRADING KPIs PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-[#222222] bg-[#0c0c0c] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#888888] uppercase block tracking-wider">// SELECTED CODENAME</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#F9F9F9]">{selectedDeal.codename}</span>
            <span className="text-xs text-[#0EA5E9] px-2 py-0.5 border border-[#222222] bg-[#111111]" style={{ textTransform: 'uppercase' }}>{selectedDeal.id}</span>
          </div>
        </div>

        <div className="border border-[#222222] bg-[#0c0c0c] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#888888] uppercase block tracking-wider">// ASKING VALUATION BASE</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#0EA5E9]">{formatCurrency(selectedDeal.asking)}</span>
            <span className="text-xs text-[#888888]">EBITDA: {formatCurrency(selectedDeal.ebitda)}</span>
          </div>
        </div>

        <div className="border border-[#222222] bg-[#0c0c0c] p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#888888] uppercase block tracking-wider">// RISK HAIRCUT DISCOUNT</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#FF3333]">-{selectedMetrics.discountPercent}%</span>
            <span className="text-xs text-[#888888]">{formatCurrency(selectedMetrics.valuationDiscount)} loss model</span>
          </div>
        </div>

        <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#00FF66]/5 rounded-full blur-2xl pointer-events-none"></div>
          <span className="text-[10px] text-[#888888] uppercase block tracking-wider">// RISK-ADJUSTED OFFER CAP</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#00FF66]">{formatCurrency(selectedMetrics.riskAdjustedValuation)}</span>
            <span className="text-xs text-[#00FF66] font-bold">FEASIBLE</span>
          </div>
        </div>
      </div>

      {/* 3. CORE TWO-COLUMN ACTION BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: ACTIVE DEALS PIPELINE BOARD (Col Span 7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex justify-between items-center">
            <span className="text-xs text-[#888888] uppercase tracking-wider">// PIPELINE INTERACTIVE STAGES</span>
            <span className="text-[9px] text-[#0ea5e9] bg-[#0ea5e9]/10 px-2 py-0.5 border border-[#0ea5e9]/20 font-bold uppercase">SBA Real-time tracker</span>
          </div>

          {/* Kanban / Pipeline Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Stage: LOI Issued */}
            <div className="border border-[#222222] bg-[#080808] p-3 flex flex-col space-y-3 min-h-[340px]">
              <div className="border-b border-[#222222] pb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#F9F9F9]">1. LOI EXECUTED</span>
                <span className="text-[9px] bg-[#222222] px-1.5 text-[#888888]">STG</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {deals.filter(d => d.stage === 'LOI_SIGNED').map(deal => (
                  <div 
                    key={deal.id}
                    onClick={() => setSelectedDealId(deal.id)}
                    className={`border p-2.5 cursor-pointer transition-all duration-150 ${selectedDealId === deal.id ? 'border-[#00FF66] bg-[#00FF66]/5 shadow-[0_0_10px_rgba(0,255,102,0.1)]' : 'border-[#222222] bg-[#0c0c0c] hover:border-[#888888]'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-[#F9F9F9]">{deal.codename}</span>
                      <span className="text-[9px] text-[#0EA5E9]">{deal.id}</span>
                    </div>
                    <div className="text-[10px] text-[#888888] mt-1 uppercase tracking-tighter truncate">{deal.industry}</div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-[10px] text-[#00FF66]">{formatCurrency(deal.asking)}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); transitionStage(deal.id, 'forward'); }}
                        className="text-[9px] bg-[#111111] border border-[#222222] px-1.5 py-0.5 text-[#888888] hover:text-[#00FF66] hover:border-[#00FF66] flex items-center gap-1"
                      >
                        NEXT <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage: QofE Audit */}
            <div className="border border-[#222222] bg-[#080808] p-3 flex flex-col space-y-3 min-h-[340px]">
              <div className="border-b border-[#222222] pb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#0EA5E9]">2. QofE AUDIT</span>
                <span className="text-[9px] bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9] px-1.5">LIVE</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {deals.filter(d => d.stage === 'QOFE_AUDIT').map(deal => (
                  <div 
                    key={deal.id}
                    onClick={() => setSelectedDealId(deal.id)}
                    className={`border p-2.5 cursor-pointer transition-all duration-150 ${selectedDealId === deal.id ? 'border-[#00FF66] bg-[#00FF66]/5 shadow-[0_0_10px_rgba(0,255,102,0.1)]' : 'border-[#222222] bg-[#0c0c0c] hover:border-[#888888]'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-[#F9F9F9]">{deal.codename}</span>
                      <span className="text-[9px] text-[#0EA5E9]">{deal.id}</span>
                    </div>
                    <div className="text-[10px] text-[#888888] mt-1 uppercase tracking-tighter truncate">{deal.industry}</div>
                    <div className="mt-3 flex justify-between items-center gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); transitionStage(deal.id, 'backward'); }}
                        className="text-[9px] bg-[#111111] border border-[#222222] px-1 py-0.5 text-[#888888] hover:text-[#FF3333]"
                      >
                        BACK
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); transitionStage(deal.id, 'forward'); }}
                        className="text-[9px] bg-[#111111] border border-[#222222] px-1 py-0.5 text-[#888888] hover:text-[#00FF66] hover:border-[#00FF66] flex items-center gap-1"
                      >
                        NEXT <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage: Legal Closing Checklist */}
            <div className="border border-[#222222] bg-[#080808] p-3 flex flex-col space-y-3 min-h-[340px]">
              <div className="border-b border-[#222222] pb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#FF3333]">3. LEGAL INDEX</span>
                <span className="text-[9px] bg-[#FF3333]/10 border border-[#FF3333]/30 text-[#FF3333] px-1.5">RISK</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {deals.filter(d => d.stage === 'LEGAL_CHECKLIST').map(deal => (
                  <div 
                    key={deal.id}
                    onClick={() => setSelectedDealId(deal.id)}
                    className={`border p-2.5 cursor-pointer transition-all duration-150 ${selectedDealId === deal.id ? 'border-[#00FF66] bg-[#00FF66]/5 shadow-[0_0_10px_rgba(0,255,102,0.1)]' : 'border-[#222222] bg-[#0c0c0c] hover:border-[#888888]'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-[#F9F9F9]">{deal.codename}</span>
                      <span className="text-[9px] text-[#0EA5E9]">{deal.id}</span>
                    </div>
                    <div className="text-[10px] text-[#888888] mt-1 uppercase tracking-tighter truncate">{deal.industry}</div>
                    <div className="mt-3 flex justify-between items-center gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); transitionStage(deal.id, 'backward'); }}
                        className="text-[9px] bg-[#111111] border border-[#222222] px-1 py-0.5 text-[#888888] hover:text-[#FF3333]"
                      >
                        BACK
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); transitionStage(deal.id, 'forward'); }}
                        className="text-[9px] bg-[#111111] border border-[#222222] px-1 py-0.5 text-[#888888] hover:text-[#00FF66] hover:border-[#00FF66] flex items-center gap-1"
                      >
                        NEXT <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage: Closing Prep */}
            <div className="border border-[#222222] bg-[#080808] p-3 flex flex-col space-y-3 min-h-[340px]">
              <div className="border-b border-[#222222] pb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#00FF66]">4. CLOSING PREP</span>
                <span className="text-[9px] bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] px-1.5">FINAL</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {deals.filter(d => d.stage === 'CLOSING_PREP').map(deal => (
                  <div 
                    key={deal.id}
                    onClick={() => setSelectedDealId(deal.id)}
                    className={`border p-2.5 cursor-pointer transition-all duration-150 ${selectedDealId === deal.id ? 'border-[#00FF66] bg-[#00FF66]/5 shadow-[0_0_10px_rgba(0,255,102,0.1)]' : 'border-[#222222] bg-[#0c0c0c] hover:border-[#888888]'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-[#F9F9F9]">{deal.codename}</span>
                      <span className="text-[9px] text-[#0EA5E9]">{deal.id}</span>
                    </div>
                    <div className="text-[10px] text-[#888888] mt-1 uppercase tracking-tighter truncate">{deal.industry}</div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-[#00FF66]">95% OK</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); transitionStage(deal.id, 'backward'); }}
                        className="text-[9px] bg-[#111111] border border-[#222222] px-1.5 py-0.5 text-[#888888] hover:text-[#FF3333]"
                      >
                        BACK
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* DILIGENCE TASK AUDIT CHECKLIST FOR SELECTED DEAL */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2">
              <span className="text-xs font-bold text-[#F9F9F9] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#0EA5E9]" />
                STAGE CHECKS: {selectedDeal.codename} ({selectedMetrics.pipelineProgress}% COMPLETE)
              </span>
              <span className="text-[10px] text-[#888888]">AUDITED LIVE</span>
            </div>

            <div className="space-y-2">
              {selectedDeal.tasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center justify-between border border-[#222222] bg-[#080808] p-2.5 cursor-pointer hover:border-[#00FF66] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      readOnly
                      className="accent-[#00FF66] rounded-none bg-black border-[#222222] h-4 w-4"
                    />
                    <span className={`text-xs ${task.completed ? 'line-through text-[#888888]' : 'text-[#F9F9F9]'}`}>
                      {task.name}
                    </span>
                  </div>
                  <span className={`text-[9px] border px-2 py-0.5 uppercase ${
                    task.category === 'financial' ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5' : 
                    task.category === 'legal' ? 'border-[#0EA5E9] text-[#0EA5E9] bg-[#0EA5E9]/5' : 
                    'border-[#888888] text-[#888888]'
                  }`}>
                    {task.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RISK RADAR DIAGNOSTICS & MULTI-SLIDERS (Col Span 5) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Tactical Radar Display Frame */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col items-center justify-between">
            <div className="w-full flex justify-between items-center mb-3">
              <span className="text-xs text-[#888888] uppercase tracking-wider">// DYNAMIC RISK EXPOSURE PROFILE</span>
              <span className="text-[10px] text-[#FF3333] font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                HEALTH INDEX: {dealHealthScore}/100
              </span>
            </div>

            {/* SVG Visualizer Radar Screen */}
            <div className="relative w-[240px] h-[240px] border border-[#222222] bg-[#050505] flex items-center justify-center p-2">
              
              {/* Scanlines / Radar Circular Grids */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[180px] h-[180px] rounded-full border border-[#222222]/60 border-dashed"></div>
                <div className="w-[120px] h-[120px] rounded-full border border-[#222222]/40 border-dashed"></div>
                <div className="w-[60px] h-[60px] rounded-full border border-[#222222]/20 border-dashed"></div>
                {/* Sector crosslines */}
                <div className="absolute w-[180px] h-[1px] bg-[#222222]/40"></div>
                <div className="absolute h-[180px] w-[1px] bg-[#222222]/40"></div>
              </div>

              {/* Vector Radar Plotting Area */}
              <svg className="w-full h-full relative z-10" viewBox="0 0 24 24 24">
                {/* Outlines of dynamic polygons */}
                <polygon 
                  points={radarPolygonPointsStr}
                  fill="rgba(0, 255, 102, 0.15)"
                  stroke="#00FF66"
                  strokeWidth="1.5"
                />

                {/* Plot points details */}
                {radarPoints.map((point, index) => (
                  <g key={index}>
                    <line 
                      x1="120" 
                      y1="120" 
                      x2={120 + 90 * Math.cos(point.angle)} 
                      y2={120 + 90 * Math.sin(point.angle)} 
                      stroke="#222222" 
                      strokeWidth="0.75"
                    />
                    <circle 
                      cx={point.x} 
                      cy={point.y} 
                      r="4" 
                      fill="#FF3333" 
                      stroke="#050505"
                      strokeWidth="1.5"
                    />
                  </g>
                ))}
              </svg>

              {/* Mini Indicators mapped overlay */}
              <div className="absolute left-2 bottom-2 text-[8px] text-[#888888] flex flex-col space-y-0.5">
                <span>[CN] CUSTOMER CONC.</span>
                <span>[WC] WORKING CAP</span>
                <span>[KM] KEY MAN DEP.</span>
                <span>[IC] COMPL. INDEX</span>
                <span>[RE] REG EXPOSURE</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-5 text-[9px] text-center text-[#888888] border-t border-[#222222] pt-3 mt-3">
              <div>CC: <strong className="text-white block">{selectedDeal.risks.customerConcentration}%</strong></div>
              <div>WC: <strong className="text-white block">{selectedDeal.risks.workingCapitalGap}%</strong></div>
              <div>KM: <strong className="text-white block">{selectedDeal.risks.keyManDependency}%</strong></div>
              <div>IC: <strong className="text-white block">{selectedDeal.risks.integrationComplexity}%</strong></div>
              <div>RE: <strong className="text-white block">{selectedDeal.risks.regulatoryExposure}%</strong></div>
            </div>
          </div>

          {/* Live Stress-Test Calibration Controls */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 space-y-4">
            <span className="text-xs text-[#888888] uppercase block tracking-wider">// REAL-TIME CRITICAL RISK MODELERS</span>
            
            {/* Risk Control Row: Customer Concentration */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888] flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  CUSTOMER CONCENTRATION:
                </span>
                <span className={selectedDeal.risks.customerConcentration > 50 ? 'text-[#FF3333] font-bold' : 'text-[#00FF66]'} >
                  {selectedDeal.risks.customerConcentration}%
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={selectedDeal.risks.customerConcentration}
                onChange={(e) => handleRiskChange('customerConcentration', parseInt(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#111111]"
              />
              <div className="text-[9px] text-[#888888] flex justify-between">
                <span>Safe Limit (&lt;15%)</span>
                <span>Severe Concentration Risk</span>
              </div>
            </div>

            {/* Risk Control Row: Working Capital Peg Buffer */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888] flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  WORKING CAPITAL GAP MODEL:
                </span>
                <span className="text-[#0EA5E9] font-bold">
                  {selectedDeal.risks.workingCapitalGap}%
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={selectedDeal.risks.workingCapitalGap}
                onChange={(e) => handleRiskChange('workingCapitalGap', parseInt(e.target.value))}
                className="w-full accent-[#0EA5E9] bg-[#111111]"
              />
              <div className="text-[9px] text-[#888888] flex justify-between">
                <span>Balanced peg target</span>
                <span>Critical funding deficiency</span>
              </div>
            </div>

            {/* Risk Control Row: Key-Man Handover Penalty */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  KEY-MAN HANDOVER DEPENDENCY:
                </span>
                <span className={selectedDeal.risks.keyManDependency > 70 ? 'text-[#FF3333] font-bold' : 'text-[#00FF66]'}>
                  {selectedDeal.risks.keyManDependency}%
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={selectedDeal.risks.keyManDependency}
                onChange={(e) => handleRiskChange('keyManDependency', parseInt(e.target.value))}
                className="w-full accent-[#00FF66] bg-[#111111]"
              />
              <div className="text-[9px] text-[#888888] flex justify-between">
                <span>Passive Management Tier</span>
                <span>Active Founder Dependency</span>
              </div>
            </div>

            {/* Critical Risk Warnings Callout */}
            <div className="border border-[#FF3333]/20 bg-[#FF3333]/5 p-3 flex gap-3 items-start">
              <AlertTriangle className="w-4 h-4 text-[#FF3333] shrink-0 mt-0.5" />
              <div className="text-[10px] text-[#888888] space-y-1">
                <span className="text-[#FF3333] font-bold block">TACTICAL SYSTEM WARNING</span>
                {selectedDeal.risks.customerConcentration > 50 && (
                  <p>• Concentration of {selectedDeal.risks.customerConcentration}% triggers mandatory SBA loan guarantee reserve penalty.</p>
                )}
                {selectedDeal.risks.keyManDependency > 60 && (
                  <p>• Key-man dependency requires minimum 12-month standby seller note rollover.</p>
                )}
                {selectedDeal.risks.customerConcentration <= 50 && selectedDeal.risks.keyManDependency <= 60 && (
                  <p>• All audited risks are balanced inside normal transactional parameters.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4. REAL-TIME AUDIT TELEMETRY LOGS TERMINAL (Footer Feed) */}
      <div className="border border-[#222222] bg-[#0c0c0c] p-4 flex flex-col space-y-3 mt-6">
        <div className="flex justify-between items-center border-b border-[#222222] pb-2">
          <span className="text-xs text-[#00FF66] font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            LIVE SECURITY AUDITING TELEMETRY LOG_STREAM
          </span>
          <span className="text-[9px] text-[#888888]">SECURE NETWORK ENCRYPTED</span>
        </div>

        <div className="space-y-1 h-[90px] overflow-y-auto pr-2">
          {terminalLogs.map((log, index) => (
            <div 
              key={index} 
              className={`text-[10px] font-mono leading-relaxed ${
                log.includes('WARNING') || log.includes('RISK') ? 'text-[#FF3333]' : 
                log.includes('TRANSITIONED') || log.includes('TASK') ? 'text-[#0EA5E9]' : 
                'text-[#888888]'
              }`}
            >
              &gt; {log}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-[#222222] pt-3 text-[10px]">
          <div className="text-[#888888] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] block animate-ping"></span>
            ACTIVE BUYERS LINKED: <strong className="text-[#F9F9F9]">1,482</strong> | PORT ID: <strong className="text-[#F9F9F9]">NODE: 489-TX</strong>
          </div>
          <button 
            onClick={() => {
              addLog('RESET: Telemetry structures recalibrated to standard parameters.');
              setDeals(INITIAL_DEALS);
            }}
            className="text-[10px] text-[#FF3333] hover:text-[#00FF66] transition-colors border border-[#222222] hover:border-[#00FF66] px-3 py-1 bg-black flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            RE-CALIBRATE EXPOSURE MODELS
          </button>
        </div>
      </div>

    </div>
  );
}