import React, { useState, useEffect } from 'react';

// Interfaces for component state
interface SavedAsset {
  id: string;
  codename: string;
  sector: string;
  ebitda: number;
  multiple: number;
  asking: number;
  broker: string;
  status: 'NDA Sent' | 'CIM Review' | 'LOI Drafted' | 'Inactive';
}

interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'WARN' | 'SUCCESS' | 'CRITICAL';
  message: string;
}

export default function AlertThresholdForm() {
  // Mock Saved Assets State
  const [savedAssets, setSavedAssets] = useState<SavedAsset[]>([
    {
      id: "delta",
      codename: "Project Delta",
      sector: "Logistics",
      ebitda: 620000,
      multiple: 2.9,
      asking: 1800000,
      broker: "Moonshine Capital",
      status: "CIM Review"
    },
    {
      id: "kestrel",
      codename: "Project Kestrel",
      sector: "SaaS",
      ebitda: 450000,
      multiple: 4.2,
      asking: 1900000,
      broker: "Apex Mergers",
      status: "NDA Sent"
    },
    {
      id: "hvac-nova",
      codename: "Project Nova",
      sector: "Home Services",
      ebitda: 810000,
      multiple: 3.2,
      asking: 2600000,
      broker: "Capital Link LLC",
      status: "LOI Drafted"
    }
  ]);

  // Alert Threshold Parameters Form State
  const [alertConfig, setAlertConfig] = useState({
    maxMultiple: 3.5,
    minEbitda: 500000,
    targetSectors: ['SaaS', 'Home Services', 'Logistics'],
    alertEmail: 'pipeline@acquiremeta.secure',
    frequency: 'realtime', // 'realtime' | 'daily' | 'weekly'
    phoneAlerts: true,
    channelSecureId: 'SH-883'
  });

  // Broker outreach update helper
  const updateBrokerStatus = (id: string, newStatus: SavedAsset['status']) => {
    setSavedAssets(prev => prev.map(asset => {
      if (asset.id === id) {
        addLog('INFO', `Broker communication for ${asset.codename} marked as [${newStatus}]`);
        return { ...asset, status: newStatus };
      }
      return asset;
    }));
  };

  // Removing saved asset helper
  const removeAsset = (id: string, name: string) => {
    setSavedAssets(prev => prev.filter(asset => asset.id !== id));
    addLog('WARN', `Asset ${name} removed from live pipeline tracking`);
  };

  // Real-time terminal system log outputs
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>([
    { timestamp: '14:22:01', type: 'INFO', message: 'Securing pipeline gateway handshake...' },
    { timestamp: '14:22:15', type: 'SUCCESS', message: 'Gateway authenticated via encrypted broker tunnel.' },
    { timestamp: '14:23:00', type: 'INFO', message: 'Cron job initiated: Scanning 12 classified source directories.' }
  ]);

  const addLog = (type: LogEntry['type'], message: string) => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    setSystemLogs(prev => [
      ...prev,
      { timestamp, type, message }
    ].slice(-10)); // Keep only latest 10 logs for aesthetic spacing
  };

  // Automatically compute aggregated bento stats
  const totalPipelineEbitda = savedAssets.reduce((sum, item) => sum + item.ebitda, 0);
  const averageMultiple = savedAssets.length > 0 
    ? (savedAssets.reduce((sum, item) => sum + item.multiple, 0) / savedAssets.length).toFixed(2)
    : '0.00';
  const totalAskingCapital = savedAssets.reduce((sum, item) => sum + item.asking, 0);

  // Form Submission/Save simulation
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    addLog('SUCCESS', `Alert triggers updated. Target parameters: Max Mult ${alertConfig.maxMultiple}x, Min EBITDA $${alertConfig.minEbitda.toLocaleString()}`);
  };

  // Sector checkbox toggle
  const toggleSector = (sector: string) => {
    const current = [...alertConfig.targetSectors];
    const index = current.indexOf(sector);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(sector);
    }
    setAlertConfig(prev => ({ ...prev, targetSectors: current }));
  };

  return (
    <div className="bg-[#050505] text-[#F9F9F9] min-h-screen font-sans border-t border-[#222222] w-full max-w-[1600px] mx-auto p-4 lg:p-8 space-y-8">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#222222] pb-6">
        <div>
          <h2 className="font-mono text-sm uppercase tracking-widest text-[#F9F9F9] flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
            <span>INTELLIGENCE & CONFIGURATION CONTROL</span>
          </h2>
          <p className="text-xs text-[#666] mt-1 font-mono">
            Track aggregate positions, monitor broker milestones, and configure algorithmic deal matches.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] bg-[#111111] border border-[#222222] px-3 py-1.5 text-[#0EA5E9]">
          <span>SECURE SEC SH-883 GATEWAY ACTIVE</span>
        </div>
      </div>

      {/* TOP AGGREGATION BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-[#080808] border border-[#222222] p-5 relative overflow-hidden group">
          <div className="absolute right-2 top-2 font-mono text-[9px] text-[#222] group-hover:text-[#333] transition-colors select-none">M_01</div>
          <span className="font-mono text-[9px] text-[#666] uppercase block">TOTAL PIPELINE EBITDA</span>
          <span className="text-xl font-bold text-[#00FF66] font-mono tracking-wider block mt-1">
            ${totalPipelineEbitda.toLocaleString()}
          </span>
          <span className="font-mono text-[9px] text-[#444] block mt-1">Sum of active watched targets</span>
        </div>

        <div className="bg-[#080808] border border-[#222222] p-5 relative overflow-hidden group">
          <div className="absolute right-2 top-2 font-mono text-[9px] text-[#222] group-hover:text-[#333] transition-colors select-none">M_02</div>
          <span className="font-mono text-[9px] text-[#666] uppercase block">AVERAGE EBITDA MULTIPLE</span>
          <span className="text-xl font-bold text-[#0EA5E9] font-mono tracking-wider block mt-1">
            {averageMultiple}x
          </span>
          <span className="font-mono text-[9px] text-[#444] block mt-1">Normalized portfolio weight</span>
        </div>

        <div className="bg-[#080808] border border-[#222222] p-5 relative overflow-hidden group">
          <div className="absolute right-2 top-2 font-mono text-[9px] text-[#222] group-hover:text-[#333] transition-colors select-none">M_03</div>
          <span className="font-mono text-[9px] text-[#666] uppercase block">AGGREGATE BUYING CAPITAL</span>
          <span className="text-xl font-bold text-[#F9F9F9] font-mono tracking-wider block mt-1">
            ${totalAskingCapital.toLocaleString()}
          </span>
          <span className="font-mono text-[9px] text-[#444] block mt-1">Reflecting asking pricing values</span>
        </div>

        <div className="bg-[#080808] border border-[#222222] p-5 relative overflow-hidden group">
          <div className="absolute right-2 top-2 font-mono text-[9px] text-[#222] group-hover:text-[#333] transition-colors select-none">M_04</div>
          <span className="font-mono text-[9px] text-[#666] uppercase block">ACTIVE OUTREACHES</span>
          <span className="text-xl font-bold text-[#FF3333] font-mono tracking-wider block mt-1">
            {savedAssets.filter(a => a.status !== 'Inactive').length} / {savedAssets.length}
          </span>
          <span className="font-mono text-[9px] text-[#444] block mt-1">Outreach funnels initiated</span>
        </div>

      </div>

      {/* MAIN TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: WATCHED ASSETS & BROKER WORKFLOW STATUS (7 COLS) */}
        <section className="lg:col-span-7 space-y-8">
          
          <div className="border border-[#222222] bg-[#080808] p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#222222] pb-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9] flex items-center gap-2">
                <span>01 / PIPELINE & OUTREACH HUB</span>
              </h3>
              <span className="font-mono text-[10px] text-[#666]">
                COUNT: {savedAssets.length}
              </span>
            </div>

            {savedAssets.length === 0 ? (
              <div className="py-12 border border-dashed border-[#222] text-center font-mono text-xs text-[#555]">
                [ ZERO PIPELINE TARGETS IN STORAGE POOL ]
              </div>
            ) : (
              <div className="space-y-4">
                {savedAssets.map((asset) => (
                  <div key={asset.id} className="bg-black border border-[#1a1a1a] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#0EA5E9] transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#F9F9F9]">{asset.codename}</span>
                        <span className="font-mono text-[9px] bg-[#111] border border-[#222] px-1.5 py-0.5 text-[#888] uppercase">{asset.sector}</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#666]">
                        EBITDA: <span className="text-[#00FF66]">${asset.ebitda.toLocaleString()}</span> &nbsp;|&nbsp; 
                        Mult: <span className="text-[#0EA5E9]">{asset.multiple}x</span> &nbsp;|&nbsp; 
                        Broker: <span className="text-[#888]">{asset.broker}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Communications Dropdown Simulation */}
                      <div className="flex flex-col">
                        <label className="font-mono text-[8px] text-[#555] uppercase mb-1">FUNNEL STATE</label>
                        <select 
                          value={asset.status} 
                          onChange={(e) => updateBrokerStatus(asset.id, e.target.value as SavedAsset['status'])}
                          className="bg-[#0c0c0c] border border-[#222] text-xs font-mono text-[#F9F9F9] px-2 py-1 focus:outline-none focus:border-[#0ea5e9]"
                        >
                          <option value="NDA Sent">NDA Sent</option>
                          <option value="CIM Review">CIM Review</option>
                          <option value="LOI Drafted">LOI Drafted</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      {/* Remove item button */}
                      <button 
                        onClick={() => removeAsset(asset.id, asset.codename)}
                        className="p-2 border border-[#222] hover:border-[#FF3333] hover:text-[#FF3333] text-[#555] transition-all self-end"
                        title="Remove tracking"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* REAL TIME TERMINAL LOG SYSTEM WINDOW */}
          <div className="border border-[#222222] bg-black p-6 font-mono space-y-4 relative">
            <div className="absolute right-6 top-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
              <span className="text-[9px] text-[#00FF66]">LIVE TUNNEL FEED</span>
            </div>
            
            <h4 className="text-xs uppercase tracking-widest text-[#888888] border-b border-[#222] pb-2">
              02 / TERMINAL SUBSYSTEM TELEMETRY
            </h4>

            <div className="h-44 overflow-y-auto space-y-2 pr-2 text-xs leading-relaxed text-[#888888]">
              {systemLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 select-text">
                  <span className="text-[#444] shrink-0">[{log.timestamp}]</span>
                  <span className={`shrink-0 text-[10px] font-bold px-1 py-0.2 ${
                    log.type === 'SUCCESS' ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20' :
                    log.type === 'WARN' ? 'bg-[#FF3333]/10 text-[#FF3333] border border-[#FF3333]/20' :
                    log.type === 'CRITICAL' ? 'bg-[#FF3333] text-black font-bold' :
                    'bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-[#F9F9F9]">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: REAL-TIME CUSTOM ALERT CONFIGURATOR (5 COLS) */}
        <section className="lg:col-span-5">
          
          <div className="border border-[#222222] bg-[#080808] p-6 space-y-6">
            <div className="border-b border-[#222222] pb-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9]">
                03 / ALGORITHMIC RADAR ALERTS
              </h3>
              <p className="text-[11px] text-[#666] font-mono mt-1">Configure parameters to trigger real-time SMTP and secure dashboard flashes.</p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-6">
              
              {/* Max Multiple Input/Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#888] uppercase">A / UPPER MULTIPLE LIMIT</span>
                  <span className="text-[#0ea5e9] font-bold">{alertConfig.maxMultiple}x EBITDA</span>
                </div>
                <div className="relative py-2">
                  <input 
                    type="range" 
                    min="2.0" 
                    max="6.0" 
                    step="0.1" 
                    value={alertConfig.maxMultiple}
                    onChange={(e) => setAlertConfig(prev => ({ ...prev, maxMultiple: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-neutral-800 accent-[#0EA5E9] cursor-pointer appearance-none"
                  />
                  <div className="flex justify-between font-mono text-[9px] text-[#444] mt-1">
                    <span>2.0x</span>
                    <span>4.0x</span>
                    <span>6.0x</span>
                  </div>
                </div>
              </div>

              {/* Min EBITDA Filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#888] uppercase">B / FLOOR EBITDA CUTOFF</span>
                  <span className="text-[#00FF66] font-bold">${alertConfig.minEbitda.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    step="50000"
                    min="100000"
                    max="5000000"
                    value={alertConfig.minEbitda}
                    onChange={(e) => setAlertConfig(prev => ({ ...prev, minEbitda: parseInt(e.target.value) || 0 }))}
                    className="w-full h-11 bg-black border border-[#222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#00FF66] transition-colors"
                  />
                </div>
              </div>

              {/* Target Sectors Filter */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase text-[#888] tracking-widest block mb-2">C / SECTOR SEGMENTS ON MONITOR</label>
                <div className="grid grid-cols-2 gap-2">
                  {['SaaS', 'Home Services', 'Logistics', 'Manufacturing'].map((sec) => {
                    const isSelected = alertConfig.targetSectors.includes(sec);
                    return (
                      <button
                        type="button"
                        key={sec}
                        onClick={() => toggleSector(sec)}
                        className={`h-10 text-left px-3 border font-mono text-xs flex items-center justify-between transition-all ${
                          isSelected 
                            ? 'bg-black border-[#00FF66] text-[#00FF66]' 
                            : 'bg-black border-[#222] text-[#666] hover:border-[#444]'
                        }`}
                      >
                        <span>{sec}</span>
                        <span className="text-[9px]">{isSelected ? '✓' : '◦'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secure Channel ID & Email Delivery */}
              <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
                
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-[#888] tracking-widest block">D / SECURE LOG CHANNEL DESTINATION</label>
                  <input 
                    type="email" 
                    value={alertConfig.alertEmail}
                    onChange={(e) => setAlertConfig(prev => ({ ...prev, alertEmail: e.target.value }))}
                    className="w-full h-11 bg-black border border-[#222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0EA5E9]"
                    placeholder="destination@email.net"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase text-[#888] tracking-widest block">FREQUENCY</label>
                    <select 
                      value={alertConfig.frequency}
                      onChange={(e) => setAlertConfig(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full h-11 bg-black border border-[#222] rounded-none px-3 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#0ea5e9]"
                    >
                      <option value="realtime">REAL-TIME TELEMETRY</option>
                      <option value="daily">DAILY DIGEST</option>
                      <option value="weekly">WEEKLY SUM</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase text-[#888] tracking-widest block">TUNNEL ID</label>
                    <input 
                      type="text" 
                      value={alertConfig.channelSecureId}
                      onChange={(e) => setAlertConfig(prev => ({ ...prev, channelSecureId: e.target.value }))}
                      className="w-full h-11 bg-black border border-[#222] rounded-none px-4 text-xs font-mono text-[#666] focus:outline-none"
                      disabled
                    />
                  </div>
                </div>

              </div>

              {/* SAVE BUTTON */}
              <button 
                type="submit"
                className="w-full h-12 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-xs font-bold tracking-widest uppercase transition-all hover:shadow-[0_0_15px_rgba(0,255,102,0.2)]"
              >
                COMMIT CRITERIA ALERTS →
              </button>

            </form>
          </div>

        </section>

      </div>

    </div>
  );
}
