import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Terminal, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  AlertTriangle, 
  Play, 
  Pause, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  Sliders, 
  ChevronDown, 
  Plus, 
  Filter, 
  Search, 
  X, 
  User, 
  FileText, 
  Activity,
  Maximize2
} from 'lucide-react';

// Types for Sourcing & Outreach Engine
interface Lead {
  id: string;
  ownerName: string;
  businessName: string;
  industry: string;
  region: string;
  estimatedRevenue: number;
  estimatedEbitda: number;
  phone: string;
  email: string;
  mailingAddress: string;
  sequenceStatus: 'IDLE' | 'ENROLLED' | 'RESPONSIVE' | 'MEETING_PENDING' | 'BOUNCED' | 'OPTED_OUT';
  activeChannel: 'EMAIL' | 'DIRECT_MAIL' | 'COLD_CALL' | 'NONE';
  lastActivityDate: string;
  sequenceProgress: number; // 0 to 100%
  historicalConfidence: number; // calculated response score %
}

interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'OUTBOUND';
  message: string;
}

export default function OutreachTrackerTable() {
  // Initial Mock Data from Regional Registries
  const initialLeads: Lead[] = [
    {
      id: "REG-HVC-4091",
      ownerName: "Arthur Vance",
      businessName: "Vance Commercial HVAC & Refrigeration",
      industry: "HVAC",
      region: "Mid-Atlantic Corridor",
      estimatedRevenue: 4200000,
      estimatedEbitda: 980000,
      phone: "+1 (555) 302-9921",
      email: "a.vance@vancecommercialhvac.com",
      mailingAddress: "1404 Industrial Blvd, Suite D, Frederick, MD",
      sequenceStatus: "RESPONSIVE",
      activeChannel: "EMAIL",
      lastActivityDate: "2026-02-14 10:42",
      sequenceProgress: 75,
      historicalConfidence: 91
    },
    {
      id: "REG-MFG-8812",
      ownerName: "Helena Rostova",
      businessName: "Precision Tooling & Molding Corp",
      industry: "Manufacturing",
      region: "Ohio Rust Belt",
      estimatedRevenue: 6800000,
      estimatedEbitda: 1450000,
      phone: "+1 (555) 812-4432",
      email: "h.rostova@precisiontoolingcorp.com",
      mailingAddress: "402 Foundry Way, Toledo, OH",
      sequenceStatus: "ENROLLED",
      activeChannel: "DIRECT_MAIL",
      lastActivityDate: "2026-02-13 16:11",
      sequenceProgress: 25,
      historicalConfidence: 74
    },
    {
      id: "REG-LOG-3301",
      ownerName: "Marcus Sterling",
      businessName: "Sterling Tri-State Logistics Inc.",
      industry: "Logistics",
      region: "Southeast Distribution Network",
      estimatedRevenue: 5100000,
      estimatedEbitda: 1100000,
      phone: "+1 (555) 901-2287",
      email: "m.sterling@sterlingtristate.com",
      mailingAddress: "90 Depot Access Road, Savannah, GA",
      sequenceStatus: "IDLE",
      activeChannel: "NONE",
      lastActivityDate: "Never",
      sequenceProgress: 0,
      historicalConfidence: 82
    },
    {
      id: "REG-HVC-5221",
      ownerName: "Gary Miller",
      businessName: "Miller Thermal Services",
      industry: "HVAC",
      region: "Texas Triangle Corridor",
      estimatedRevenue: 2900000,
      estimatedEbitda: 550000,
      phone: "+1 (555) 713-8899",
      email: "gary@millerthermalservices.com",
      mailingAddress: "883 North Interstate 35, Austin, TX",
      sequenceStatus: "MEETING_PENDING",
      activeChannel: "COLD_CALL",
      lastActivityDate: "2026-02-15 09:00",
      sequenceProgress: 100,
      historicalConfidence: 96
    },
    {
      id: "REG-LOG-4410",
      ownerName: "Patricia Chen",
      businessName: "Apex Cold Chain Logistics",
      industry: "Logistics",
      region: "Midwest Rust Belt",
      estimatedRevenue: 8400000,
      estimatedEbitda: 1950000,
      phone: "+1 (555) 312-7741",
      email: "pchen@apexcoldchain.com",
      mailingAddress: "2200 Frostline Avenue, Des Moines, IA",
      sequenceStatus: "BOUNCED",
      activeChannel: "EMAIL",
      lastActivityDate: "2026-02-10 11:22",
      sequenceProgress: 10,
      historicalConfidence: 45
    },
    {
      id: "REG-MFG-9102",
      ownerName: "Franklin Boyd",
      businessName: "Boyd Specialty Castings & Foundries",
      industry: "Manufacturing",
      region: "Southeast Distribution Network",
      estimatedRevenue: 7200000,
      estimatedEbitda: 1320000,
      phone: "+1 (555) 423-1105",
      email: "fboyd@boydcastings.com",
      mailingAddress: "788 Ironwood Industrial Dr, Birmingham, AL",
      sequenceStatus: "OPTED_OUT",
      activeChannel: "EMAIL",
      lastActivityDate: "2026-02-11 14:30",
      sequenceProgress: 40,
      historicalConfidence: 21
    },
    {
      id: "REG-HVC-1090",
      ownerName: "Dave & Brenda Collins",
      businessName: "Collins Air & Heating Systems Co.",
      industry: "HVAC",
      region: "Ohio Rust Belt",
      estimatedRevenue: 3400000,
      estimatedEbitda: 610000,
      phone: "+1 (555) 419-5050",
      email: "dave@collinsairheating.com",
      mailingAddress: "110 Sandusky St, Sandusky, OH",
      sequenceStatus: "ENROLLED",
      activeChannel: "DIRECT_MAIL",
      lastActivityDate: "2026-02-14 08:30",
      sequenceProgress: 50,
      historicalConfidence: 87
    }
  ];

  // States
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<TerminalLog[]>([
    { id: '1', timestamp: '10:40:12', type: 'INFO', message: 'OUTREACH COMMAND SYSTEM ONLINE. Secure node [489-TX] mapped.' },
    { id: '2', timestamp: '10:40:15', type: 'INFO', message: 'Programmatic SMTP relays validated for [cold-email@acquiremeta.com].' },
    { id: '3', timestamp: '10:41:00', type: 'INFO', message: 'Regional industry registries synced: [HVAC: 148, MFG: 310, LOG: 89] local directories loaded.' }
  ]);
  const [bulkSequenceTemplate, setBulkSequenceTemplate] = useState('Alpha-6: Off-Market Direct Buyout');
  const [newLeadModal, setNewLeadModal] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    ownerName: '',
    businessName: '',
    industry: 'HVAC',
    region: 'Mid-Atlantic Corridor',
    estimatedRevenue: 3000000,
    estimatedEbitda: 500000,
    phone: '',
    email: '',
    mailingAddress: '',
    sequenceStatus: 'IDLE',
    activeChannel: 'NONE',
    lastActivityDate: 'Never',
    sequenceProgress: 0,
    historicalConfidence: 80
  });

  // Automatically scroll logs
  const logsEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Helper log addition
  const addLog = (message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'OUTBOUND' = 'INFO') => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    setLogs(prev => [...prev, {
      id: Math.random().toString(),
      timestamp,
      type,
      message
    }]);
  };

  // Filter Logistics
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = l.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchIndustry = industryFilter === 'ALL' || l.industry === industryFilter;
      const matchStatus = statusFilter === 'ALL' || l.sequenceStatus === statusFilter;
      const matchChannel = channelFilter === 'ALL' || l.activeChannel === channelFilter;
      return matchSearch && matchIndustry && matchStatus && matchChannel;
    });
  }, [leads, searchQuery, industryFilter, statusFilter, channelFilter]);

  // Select Row handlers
  const handleSelectLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  // Launch Sequence simulation
  const handleLaunchSequence = (leadId: string, channel: 'EMAIL' | 'DIRECT_MAIL' | 'COLD_CALL') => {
    addLog(`Command initialized: Starting pipeline sequence to ${leadId} via ${channel}...`, 'INFO');
    
    // Simulate API pipeline dispatch
    setTimeout(() => {
      setLeads(prev => prev.map(lead => {
        if (lead.id === leadId) {
          addLog(`Sequence dispatch success: Envelope deployed / SMTP handshaked for ${lead.businessName}`, 'SUCCESS');
          return {
            ...lead,
            sequenceStatus: 'ENROLLED',
            activeChannel: channel,
            sequenceProgress: 15,
            lastActivityDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return lead;
      }));
    }, 1200);
  };

  // Bulk enrollment handler
  const handleBulkEnrollment = () => {
    if (selectedLeads.length === 0) {
      addLog(`ERR: No operational matrices selected for bulk execution. Flag rows first.`, 'ERROR');
      return;
    }
    
    setIsSimulating(true);
    addLog(`[CRITICAL DISPATCH] Initializing batch campaign pipeline: ${selectedLeads.length} nodes via template [${bulkSequenceTemplate}]...`, 'WARNING');
    
    let counter = 0;
    const interval = setInterval(() => {
      if (counter < selectedLeads.length) {
        const targetId = selectedLeads[counter];
        const targetLead = leads.find(l => l.id === targetId);
        
        if (targetLead) {
          setLeads(prev => prev.map(l => {
            if (l.id === targetId) {
              return {
                ...l,
                sequenceStatus: 'ENROLLED',
                activeChannel: 'EMAIL',
                sequenceProgress: 10,
                lastActivityDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
              };
            }
            return l;
          }));
          addLog(`[ENROLLED] Sourced Target: ${targetLead.businessName} (Owner: ${targetLead.ownerName}) synced successfully.`, 'OUTBOUND');
        }
        counter++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        addLog(`Campaign [${bulkSequenceTemplate}] completely executed over ${selectedLeads.length} regional directories.`, 'SUCCESS');
        setSelectedLeads([]);
      }
    }, 800);
  };

  // Reset demo records
  const handleResetRegistry = () => {
    setLeads(initialLeads);
    setSelectedLeads([]);
    addLog("System clean reset complete. Standard off-market target registry restored.", "INFO");
  };

  // Handle new off market lead entry
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `REG-${newLead.industry?.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fresh: Lead = {
      id,
      ownerName: newLead.ownerName || 'Unknown Owner',
      businessName: newLead.businessName || 'Proprietary Acquisition Target',
      industry: newLead.industry || 'HVAC',
      region: newLead.region || 'Mid-Atlantic Corridor',
      estimatedRevenue: Number(newLead.estimatedRevenue) || 2000000,
      estimatedEbitda: Number(newLead.estimatedEbitda) || 400000,
      phone: newLead.phone || 'N/A',
      email: newLead.email || 'N/A',
      mailingAddress: newLead.mailingAddress || 'N/A',
      sequenceStatus: 'IDLE',
      activeChannel: 'NONE',
      lastActivityDate: 'Never',
      sequenceProgress: 0,
      historicalConfidence: Math.floor(60 + Math.random() * 35)
    };

    setLeads([fresh, ...leads]);
    setNewLeadModal(false);
    addLog(`Successfully cataloged new off-market directory: ${fresh.id} (${fresh.businessName})`, 'SUCCESS');
  };

  // Status Badge Colors helpers
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'RESPONSIVE': return 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5';
      case 'MEETING_PENDING': return 'border-[#0EA5E9] text-[#0EA5E9] bg-[#0EA5E9]/5';
      case 'ENROLLED': return 'border-yellow-500 text-yellow-500 bg-yellow-500/5';
      case 'BOUNCED': return 'border-[#FF3333] text-[#FF3333] bg-[#FF3333]/5';
      case 'OPTED_OUT': return 'border-[#888888] text-[#888888] bg-[#888888]/5';
      default: return 'border-[#222222] text-[#888888] bg-transparent';
    }
  };

  // Formatting helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="font-mono bg-[#050505] text-[#F9F9F9] min-h-screen p-4 md:p-6 border border-[#222222] relative selection:bg-[#00FF66] selection:text-[#050505]">
      
      {/* Decorative Scanline Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(10,10,10,0.4)_15%,transparent_80%)]"></div>

      {/* COMPONENT HEADER CONTAINER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 pb-6 border-b border-[#222222]">
        <div>
          <div className="flex items-center space-x-2 text-[10px] text-[#0EA5E9] font-bold tracking-widest uppercase mb-1">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>// PROPRIETARY SOURCING PIPELINE</span>
            <span className="text-[#888888]">|</span>
            <span className="text-[#00FF66]">SECURE CAMPAIGN HUB</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight uppercase">
            OFF-MARKET REGISTRY & <span className="text-[#00FF66]">OUTREACH COMMANDER</span>
          </h1>
          <p className="text-xs text-[#888888] mt-1 max-w-3xl leading-relaxed">
            Execute cold outreach sequences targeting regional industry operations. Run multi-channel cadences (Email, Direct Mail, Cold Ring) to extract off-market equity directories before brokers capture deal flow listings.
          </p>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full xl:w-auto text-[11px]">
          <div className="border border-[#222222] bg-[#0a0a0a] p-2 min-w-[120px]">
            <span className="text-[#888888] block text-[9px] uppercase">Registry Targets</span>
            <span className="text-base font-bold text-[#F9F9F9]" x-text="leads.length">{leads.length}</span>
          </div>
          <div className="border border-[#222222] bg-[#0a0a0a] p-2 min-w-[120px]">
            <span className="text-[#888888] block text-[9px] uppercase">Enrolled Outbound</span>
            <span className="text-base font-bold text-[#0EA5E9]">{leads.filter(l => l.sequenceStatus === 'ENROLLED' || l.sequenceStatus === 'RESPONSIVE').length}</span>
          </div>
          <div className="border border-[#222222] bg-[#0a0a0a] p-2 min-w-[120px]">
            <span className="text-[#888888] block text-[9px] uppercase">Meetings Secured</span>
            <span className="text-base font-bold text-[#00FF66]">{leads.filter(l => l.sequenceStatus === 'MEETING_PENDING').length}</span>
          </div>
          <div className="border border-[#222222] bg-[#0a0a0a] p-2 min-w-[120px]">
            <span className="text-[#888888] block text-[9px] uppercase">Sourced Base</span>
            <span className="text-base font-bold text-yellow-500">
              {formatCurrency(leads.reduce((acc, current) => acc + current.estimatedRevenue, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* WORKING INTERACTIVE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: FILTERS, TABLE, BULK CONTROLS */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* CONTROL BAR: Filter parameters & search */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col space-y-4">
            
            <div className="flex flex-col md:flex-row justify-between gap-4">
              {/* Search Query field */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-[#888888] pointer-events-none" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH RECS: OWNER, ZIP, CODENAME..." 
                  className="w-full bg-[#050505] border border-[#222222] text-[#F9F9F9] text-xs focus:border-[#00FF66] focus:outline-none pl-10 pr-4 py-3 placeholder-[#888888] uppercase font-mono tracking-wider transition-all"
                />
              </div>

              {/* Action Triggers */}
              <div className="flex gap-2 justify-between md:justify-end">
                <button 
                  onClick={() => setNewLeadModal(true)}
                  className="bg-[#00FF66] text-[#050505] hover:bg-[#050505] hover:text-[#00FF66] border border-[#00FF66] text-xs font-bold px-4 py-2 uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Scribe Off-Market Unit</span>
                </button>
                <button 
                  onClick={handleResetRegistry}
                  className="border border-[#222222] text-[#888888] hover:border-[#FF3333] hover:text-[#FF3333] bg-transparent text-xs font-bold px-3 py-2 uppercase flex items-center gap-1.5 transition-all"
                  title="Reset registries"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Flush</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Pill Matrices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#222222]">
              
              {/* Sector Selection */}
              <div>
                <label className="text-[9px] text-[#888888] block mb-1 uppercase tracking-wider">// Industry Matrix</label>
                <select 
                  value={industryFilter} 
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] text-xs py-2 px-2 focus:border-[#00FF66] focus:outline-none font-mono text-[#F9F9F9]"
                >
                  <option value="ALL">ALL SECTORS (COMBINED)</option>
                  <option value="HVAC">HVAC & THERMAL SYSTEMS</option>
                  <option value="Logistics">LOGISTICS & COLD CHAIN</option>
                  <option value="Manufacturing">MANUFACTURING & FOUNDRY</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-[9px] text-[#888888] block mb-1 uppercase tracking-wider">// Outreach Pipeline Stage</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] text-xs py-2 px-2 focus:border-[#00FF66] focus:outline-none font-mono text-[#F9F9F9]"
                >
                  <option value="ALL">ALL CADENCE STAGES</option>
                  <option value="IDLE">IDLE / CLEAN DIRECTORY</option>
                  <option value="ENROLLED">ENROLLED IN SEQUENCE</option>
                  <option value="RESPONSIVE">INTERACTIVE / RESPONSIVE</option>
                  <option value="MEETING_PENDING">MEETING SET / NDA PENDING</option>
                  <option value="BOUNCED">BOUNCED / STALE CONTACT</option>
                  <option value="OPTED_OUT">DNC / OPTED OUT</option>
                </select>
              </div>

              {/* Outreach Channel */}
              <div>
                <label className="text-[9px] text-[#888888] block mb-1 uppercase tracking-wider">// System Media Channel</label>
                <select 
                  value={channelFilter} 
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222222] text-xs py-2 px-2 focus:border-[#00FF66] focus:outline-none font-mono text-[#F9F9F9]"
                >
                  <option value="ALL">ALL CHANNELS</option>
                  <option value="EMAIL">SMTP COLD EMAIL</option>
                  <option value="DIRECT_MAIL">COURIER DIRECT MAIL</option>
                  <option value="COLD_CALL">TELE-VOIP DIALER</option>
                  <option value="NONE">UNASSIDED</option>
                </select>
              </div>

            </div>

          </div>

          {/* BULK EXECUTION COMMAND TERMINAL CARD */}
          <div className="border border-[#222222] bg-[#0c0c0c] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                <span className="text-xs font-bold text-yellow-500 uppercase">// SEQUENCER BULK DISPATCH CORES</span>
              </div>
              <p className="text-[10px] text-[#888888]">
                Select listings in the table below to enroll targets simultaneously into specialized automated outreach.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Template selector */}
              <select 
                value={bulkSequenceTemplate}
                onChange={(e) => setBulkSequenceTemplate(e.target.value)}
                className="bg-[#050505] border border-[#222222] text-xs py-2 px-3 text-[#F9F9F9] font-mono focus:border-yellow-500 focus:outline-none"
              >
                <option value="Alpha-6: Off-Market Direct Buyout">Alpha-6: Owner Retiring Buyout</option>
                <option value="Beta-3: Direct Mail Courier Asset">Beta-3: Direct Mail Physical Catalog</option>
                <option value="Delta-Recruiting: Talent Expansion">Delta-M&A: JV Acquisition Partnership</option>
              </select>

              <button
                onClick={handleBulkEnrollment}
                disabled={isSimulating || selectedLeads.length === 0}
                className={`text-xs font-bold px-4 py-2 border transition-all uppercase flex items-center gap-2 ${
                  selectedLeads.length > 0 
                    ? 'bg-yellow-500 text-[#050505] hover:bg-transparent hover:text-yellow-500 border-yellow-500 cursor-pointer' 
                    : 'bg-transparent text-[#888888] border-[#222222] cursor-not-allowed'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Inject {selectedLeads.length} Targets</span>
              </button>
            </div>
          </div>

          {/* MAIN REGISTRY TABLE VIEW */}
          <div className="border border-[#222222] bg-[#0a0a0a] overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[800px]">
              
              {/* Header */}
              <thead>
                <tr className="border-b border-[#222222] bg-[#0c0c0c] text-[#888888] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                      className="accent-[#00FF66] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Registry ID / Target</th>
                  <th className="py-3 px-4">Owner Profile</th>
                  <th className="py-3 px-4">Est. Financials</th>
                  <th className="py-3 px-4">Channel Status</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4 text-right">Cadence Progress</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-[#222222]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[#FF3333] font-bold uppercase bg-[#0d0707]/30">
                      ⚠️ Zero Regional Registry Matrices Matches Query constraints.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isRowSelected = selectedLeads.includes(lead.id);
                    return (
                      <tr 
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`hover:bg-[#0c0c0c] transition-all cursor-pointer ${
                          isRowSelected ? 'bg-[#0ea5e9]/5 text-white' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox"
                            checked={isRowSelected}
                            onChange={() => handleSelectLead(lead.id)}
                            className="accent-[#0ea5e9] cursor-pointer"
                          />
                        </td>

                        {/* ID & Business Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] px-1.5 py-0.5 border border-[#222222] bg-[#070707] text-[#0EA5E9] font-semibold">{lead.id}</span>
                            <span className="text-[10px] text-[#888888] uppercase">{lead.industry}</span>
                          </div>
                          <div className="font-bold text-[#F9F9F9] mt-1 text-xs tracking-tight">{lead.businessName}</div>
                          <div className="text-[10px] text-[#888888] mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#0EA5E9]" />
                            <span>{lead.region}</span>
                          </div>
                        </td>

                        {/* Owner / Contact info */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-xs text-[#F9F9F9] flex items-center gap-1">
                            <User className="w-3 h-3 text-[#888888]" />
                            <span>{lead.ownerName}</span>
                          </div>
                          <div className="text-[10px] text-[#888888] mt-1 truncate max-w-[200px]">{lead.email}</div>
                          <div className="text-[10px] text-[#888888]">{lead.phone}</div>
                        </td>

                        {/* Financial Parameters */}
                        <td className="py-4 px-4">
                          <div className="text-[11px]">
                            <span className="text-[#888888]">REV:</span> <span className="font-bold">{formatCurrency(lead.estimatedRevenue)}</span>
                          </div>
                          <div className="text-[11px] text-[#00FF66] mt-0.5">
                            <span className="text-[#888888]">EBITDA:</span> <span className="font-bold">{formatCurrency(lead.estimatedEbitda)}</span>
                          </div>
                        </td>

                        {/* Channel Indicator Badge */}
                        <td className="py-4 px-4">
                          <div className={`px-2 py-1 text-[9px] uppercase border font-bold text-center inline-block ${getStatusStyle(lead.sequenceStatus)}`}>
                            {lead.sequenceStatus}
                          </div>
                          <div className="text-[9px] text-[#888888] mt-1.5 uppercase flex items-center gap-1.5">
                            {lead.activeChannel === 'EMAIL' && <Mail className="w-3.5 h-3.5 text-[#0EA5E9]" />}
                            {lead.activeChannel === 'DIRECT_MAIL' && <FileText className="w-3.5 h-3.5 text-yellow-500" />}
                            {lead.activeChannel === 'COLD_CALL' && <Phone className="w-3.5 h-3.5 text-[#00FF66]" />}
                            <span>CHANNEL: {lead.activeChannel}</span>
                          </div>
                        </td>

                        {/* Response confidence percentage score */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-[#111] h-1.5 border border-[#222]">
                              <div 
                                className={`h-full ${lead.historicalConfidence > 80 ? 'bg-[#00FF66]' : lead.historicalConfidence > 50 ? 'bg-[#0EA5E9]' : 'bg-[#FF3333]'}`}
                                style={{ width: `${lead.historicalConfidence}%` }}
                              ></div>
                            </div>
                            <span className="text-[11px] font-bold">{lead.historicalConfidence}%</span>
                          </div>
                        </td>

                        {/* Sequence Progress Bar */}
                        <td className="py-4 px-4 text-right">
                          <div className="text-xs font-semibold text-[#F9F9F9]">{lead.sequenceProgress}%</div>
                          <div className="text-[9px] text-[#888888] mt-1">LAST LOG: {lead.lastActivityDate}</div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
          </div>

        </div>

        {/* RIGHT COLUMN: DRILL-DOWN PANEL & REAL-TIME DISPATCH LOG */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* DOSSIER PANEL CARD */}
          <div className="border border-[#222222] bg-[#0a0a0a] p-4 flex flex-col space-y-4 relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#222222]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#00FF66]"></span>
                <span className="text-xs font-bold uppercase tracking-wider">// TARGET INTEL DOSSIER</span>
              </div>
              <span className="text-[9px] text-[#888888] uppercase">[IDLE STATE]</span>
            </div>

            {selectedLead ? (
              <div className="space-y-4">
                {/* Micro Metadata */}
                <div>
                  <span className="text-[9px] text-[#888888] uppercase block">Assigned Directory Identifier</span>
                  <div className="text-base font-bold text-[#0ea5e9] flex items-center justify-between">
                    <span>{selectedLead.id}</span>
                    <span className="text-xs text-[#00FF66] border border-[#00FF66] px-1 py-0.5 text-[9px] uppercase">{selectedLead.industry}</span>
                  </div>
                </div>

                {/* Company and Owner */}
                <div className="bg-[#050505] p-3 border border-[#222222] space-y-2">
                  <div>
                    <span className="text-[9px] text-[#888888] block uppercase">Company Entity Name</span>
                    <span className="text-xs font-bold text-[#F9F9F9] block">{selectedLead.businessName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888888] block uppercase">Proprietor Name</span>
                    <span className="text-xs font-bold text-[#00FF66]">{selectedLead.ownerName}</span>
                  </div>
                </div>

                {/* Contacts Block */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#888888] text-[10px] uppercase">Registry Physical:</span>
                    <span className="text-[#F9F9F9] truncate max-w-[200px] text-right" title={selectedLead.mailingAddress}>{selectedLead.mailingAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888] text-[10px] uppercase">SMTP Mail:</span>
                    <span className="text-[#0EA5E9] font-bold">{selectedLead.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888] text-[10px] uppercase">Comms Phone Line:</span>
                    <span className="text-[#F9F9F9]">{selectedLead.phone}</span>
                  </div>
                </div>

                {/* Sourcing Financials Metric */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-[#0d0d0d] p-2 border border-[#222222]">
                    <span className="text-[9px] text-[#888888] uppercase block">Est Revenue (TTM)</span>
                    <span className="text-xs font-bold text-white">{formatCurrency(selectedLead.estimatedRevenue)}</span>
                  </div>
                  <div className="bg-[#0d0d0d] p-2 border border-[#222222]">
                    <span className="text-[9px] text-[#888888] uppercase block">Est EBITDA (Margin)</span>
                    <span className="text-xs font-bold text-[#00FF66]">{formatCurrency(selectedLead.estimatedEbitda)}</span>
                  </div>
                </div>

                {/* Individual Launch Pad */}
                <div className="pt-2 border-t border-[#222222] space-y-2">
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block">// ENGAGE TARGET DIRECTLY</span>
                  
                  <div className="grid grid-cols-3 gap-1">
                    <button 
                      onClick={() => handleLaunchSequence(selectedLead.id, 'EMAIL')}
                      className="text-[10px] bg-transparent hover:bg-[#0EA5E9] hover:text-[#050505] text-[#0EA5E9] font-bold py-2 border border-[#0EA5E9] transition-all uppercase flex flex-col items-center justify-center gap-1"
                    >
                      <Mail className="w-4.5 h-4.5" />
                      <span>SMTP</span>
                    </button>
                    <button 
                      onClick={() => handleLaunchSequence(selectedLead.id, 'DIRECT_MAIL')}
                      className="text-[10px] bg-transparent hover:bg-yellow-500 hover:text-[#050505] text-yellow-500 font-bold py-2 border border-yellow-500 transition-all uppercase flex flex-col items-center justify-center gap-1"
                    >
                      <FileText className="w-4.5 h-4.5" />
                      <span>POSTAL</span>
                    </button>
                    <button 
                      onClick={() => handleLaunchSequence(selectedLead.id, 'COLD_CALL')}
                      className="text-[10px] bg-transparent hover:bg-[#00FF66] hover:text-[#050505] text-[#00FF66] font-bold py-2 border border-[#00FF66] transition-all uppercase flex flex-col items-center justify-center gap-1"
                    >
                      <Phone className="w-4.5 h-4.5" />
                      <span>VOIP CALL</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-[#888888] space-y-2 border border-dashed border-[#222222]">
                <Terminal className="w-8 h-8 mx-auto text-[#222222]" />
                <p className="text-[11px] uppercase tracking-wider">No Target Directory Node Highlighted</p>
                <p className="text-[9px] text-[#888888] max-w-xs mx-auto px-4">
                  Select a registry target inside the command pipeline grid to retrieve full corporate financials, ownership contacts, and engage individual SMTP sequences.
                </p>
              </div>
            )}
          </div>

          {/* REALTIME PROGRAMMATIC DISPATCH ENGINE LOG (Terminal Look) */}
          <div className="border border-[#222222] bg-[#050505] flex flex-col h-72">
            
            {/* Terminal Top header */}
            <div className="border-b border-[#222222] bg-[#0a0a0a] px-3 py-2 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#00FF66] animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-widest text-[#00FF66] uppercase">OUTREACH_DIAGNOSTICS_LOG.SYS</span>
              </div>
              <span className="text-[9px] text-[#888888]">NODE: 489-TX</span>
            </div>

            {/* Scrollable logs */}
            <div className="flex-1 overflow-y-auto p-3 text-[10px] space-y-1.5 font-mono select-none">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-1">
                  <span className="text-[#888888] flex-shrink-0">[{log.timestamp}]</span>
                  
                  {log.type === 'INFO' && <span className="text-[#0EA5E9] font-bold flex-shrink-0">[INFO]</span>}
                  {log.type === 'SUCCESS' && <span className="text-[#00FF66] font-bold flex-shrink-0">[DISPATCH]</span>}
                  {log.type === 'WARNING' && <span className="text-yellow-500 font-bold flex-shrink-0">[CAMPAIGN]</span>}
                  {log.type === 'ERROR' && <span className="text-[#FF3333] font-bold flex-shrink-0">[ALERT]</span>}
                  {log.type === 'OUTBOUND' && <span className="text-[#00FF66] font-bold flex-shrink-0">» SENT</span>}

                  <span className="text-[#F9F9F9] ml-1 leading-normal">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Simulated Input Prompt */}
            <div className="border-t border-[#222222] bg-[#0c0c0c] px-3 py-1.5 text-[9px] flex items-center justify-between text-[#888888]">
              <span className="animate-pulse text-[#00FF66] font-bold">bash-5.1$ _</span>
              <span>SYSTEM DISPATCH IDLE / ONLINE</span>
            </div>
          </div>

        </div>

      </div>

      {/* NEW LEAD MODAL POPUP */}
      {newLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div 
            className="w-full max-w-xl border border-[#222222] bg-[#0a0a0a] text-[#F9F9F9] p-6 space-y-4 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-[#222222] pb-3 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-[#0EA5E9] font-bold uppercase">// SCRIBE PROPRIETARY SOURCED UNIT</span>
                <h2 className="text-base font-bold uppercase tracking-wider">OFF-MARKET REGISTRY COMPILATION</h2>
              </div>
              <button 
                onClick={() => setNewLeadModal(false)}
                className="border border-[#222222] text-[#888888] hover:border-[#FF3333] hover:text-[#FF3333] p-1.5 text-[10px] uppercase transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              
              {/* Row 1: Company & Owner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#888888] uppercase block text-[9px]">Owner/Proprietor Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newLead.ownerName}
                    onChange={(e) => setNewLead({ ...newLead, ownerName: e.target.value })}
                    placeholder="E.G. CHARLES REDFORD" 
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-2.5 text-white placeholder-[#888888]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#888888] uppercase block text-[9px]">Company Entity Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newLead.businessName}
                    onChange={(e) => setNewLead({ ...newLead, businessName: e.target.value })}
                    placeholder="E.G. REDFORD INDUSTRIAL TRUCKING" 
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-2.5 text-white placeholder-[#888888]"
                  />
                </div>
              </div>

              {/* Row 2: Industry & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#888888] uppercase block text-[9px]">Sourcing Core Industry</label>
                  <select 
                    value={newLead.industry}
                    onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-2.5 text-white"
                  >
                    <option value="HVAC">HVAC & THERMAL SERVICES</option>
                    <option value="Logistics">LOGISTICS & COLD CHAIN</option>
                    <option value="Manufacturing">MANUFACTURING & FOUNDRY</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[#888888] uppercase block text-[9px]">Corridor Region</label>
                  <select 
                    value={newLead.region}
                    onChange={(e) => setNewLead({ ...newLead, region: e.target.value })}
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-2.5 text-white"
                  >
                    <option value="Mid-Atlantic Corridor">Mid-Atlantic Corridor</option>
                    <option value="Ohio Rust Belt">Ohio Rust Belt</option>
                    <option value="Texas Triangle Corridor">Texas Triangle Corridor</option>
                    <option value="Southeast Distribution Network">Southeast Distribution Network</option>
                    <option value="Midwest Rust Belt">Midwest Rust Belt</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Revenues & EBITDA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#888888] uppercase block text-[9px]">Estimated Revenue (TTM) *</label>
                  <input 
                    type="number" 
                    required
                    value={newLead.estimatedRevenue}
                    onChange={(e) => setNewLead({ ...newLead, estimatedRevenue: Number(e.target.value) })}
                    placeholder="4000000" 
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-2.5 text-white placeholder-[#888888]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#888888] uppercase block text-[9px]">Estimated Operating EBITDA *</label>
                  <input 
                    type="number" 
                    required
                    value={newLead.estimatedEbitda}
                    onChange={(e) => setNewLead({ ...newLead, estimatedEbitda: Number(e.target.value) })}
                    placeholder="800000" 
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-2.5 text-white placeholder-[#888888]"
                  />
                </div>
              </div>

              {/* Row 4: Contacts & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[#888888] uppercase block text-[9px]">Owner SMTP Mail</label>
                  <input 
                    type="email" 
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="owner@domain.com" 
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-2.5 text-white placeholder-[#888888]"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[#888888] uppercase block text-[9px]">Owner Direct Telephone</label>
                  <input 
                    type="text" 
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567" 
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-2.5 text-white placeholder-[#888888]"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[#888888] uppercase block text-[9px]">Registry physical Postal</label>
                  <input 
                    type="text" 
                    value={newLead.mailingAddress}
                    onChange={(e) => setNewLead({ ...newLead, mailingAddress: e.target.value })}
                    placeholder="Street, City, State" 
                    className="w-full bg-[#050505] border border-[#222222] focus:border-[#00FF66] focus:outline-none p-2.5 text-white placeholder-[#888888]"
                  />
                </div>
              </div>

              {/* Warning notification */}
              <div className="border border-[#222222] bg-[#0c0c0c] p-3 text-[10px] text-[#888888] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p>
                  * By filing this off-market target directory, you authorize the dynamic campaign sequencer to queue programmatic cold mail integrations. Verify compliance parameters inside your regulatory boundaries before launching mail vectors.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#222222]">
                <button 
                  type="button"
                  onClick={() => setNewLeadModal(false)}
                  className="px-4 py-2 border border-[#222222] hover:border-[#FF3333] hover:text-[#FF3333] uppercase text-xs text-[#888888] transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#00FF66] text-[#050505] hover:bg-transparent hover:text-[#00FF66] border border-[#00FF66] font-bold uppercase text-xs transition-all"
                >
                  Write to Registry Index
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}