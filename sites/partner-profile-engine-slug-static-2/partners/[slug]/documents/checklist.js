import React, { useState, useEffect, useCallback } from 'react';

// Document Definition Matrix
const DOCUMENTS_REGISTRY = {
  bank_statements_3: {
    id: 'bank_statements_3',
    name: '3 Months Bank Statements',
    description: 'Provide official PDF downloads of your primary business operating account. No scans or screenshots.',
    category: 'Financials',
    formats: ['.pdf'],
    maxSize: 15 * 1024 * 1024, // 15MB
  },
  bank_statements_6: {
    id: 'bank_statements_6',
    name: '6 Months Bank Statements',
    description: 'Extended transactional history required for advanced revenue-based assessment metrics.',
    category: 'Financials',
    formats: ['.pdf'],
    maxSize: 25 * 1024 * 1024,
  },
  ein_certificate: {
    id: 'ein_certificate',
    name: 'EIN Certificate (IRS CP575)',
    description: 'Official IRS documentation confirming your Employer Identification Number setup.',
    category: 'Identity',
    formats: ['.pdf', '.jpg', '.png'],
    maxSize: 5 * 1024 * 1024,
  },
  voided_check: {
    id: 'voided_check',
    name: 'Voided Business Check',
    description: 'Pre-printed business check matching your corporate registry name and address details.',
    category: 'Identity',
    formats: ['.pdf', '.jpg', '.png'],
    maxSize: 5 * 1024 * 1024,
  },
  merchant_statements: {
    id: 'merchant_statements',
    name: 'Merchant Processing Statements',
    description: 'Stripe, PayPal, or physical merchant processing reports showing daily/monthly settlements.',
    category: 'Merchant',
    formats: ['.pdf', '.csv'],
    maxSize: 10 * 1024 * 1024,
  },
  p_and_l: {
    id: 'p_and_l',
    name: 'YTD Profit & Loss Statement',
    description: 'Current year balance sheet and P&L ledger export from QuickBooks or certified CPA tool.',
    category: 'Financials',
    formats: ['.pdf', '.xlsx'],
    maxSize: 10 * 1024 * 1024,
  },
  equipment_quote: {
    id: 'equipment_quote',
    name: 'Equipment Purchase Quote / Invoice',
    description: 'Itemized vendor invoice outlining purchase specifications, serial arrays, and final acquisition price.',
    category: 'Collateral',
    formats: ['.pdf'],
    maxSize: 15 * 1024 * 1024,
  },
  tax_returns: {
    id: 'tax_returns',
    name: '2 Years Corporate Tax Returns',
    description: 'Complete signed federal tax filings (Form 1120 / 1120S / 1065) with all supplementary schedules.',
    category: 'Financials',
    formats: ['.pdf'],
    maxSize: 30 * 1024 * 1024,
  },
  pfs_form: {
    id: 'pfs_form',
    name: 'Personal Financial Statement (PFS)',
    description: 'SBA Form 413 or standard executive equivalent summarizing asset & liability metrics.',
    category: 'Underwriting',
    formats: ['.pdf'],
    maxSize: 5 * 1024 * 1024,
  },
  utility_bill: {
    id: 'utility_bill',
    name: 'Corporate Utility Bill',
    description: 'Active commercial electricity, gas, or broadband internet statement proving physical operations.',
    category: 'Identity',
    formats: ['.pdf', '.jpg', '.png'],
    maxSize: 5 * 1024 * 1024,
  },
  real_estate_contract: {
    id: 'real_estate_contract',
    name: 'Property Purchase & Appraisal',
    description: 'Fully executed purchase option contract plus certified property valuation files if completed.',
    category: 'Collateral',
    formats: ['.pdf'],
    maxSize: 50 * 1024 * 1024,
  },
  operating_agreement: {
    id: 'operating_agreement',
    name: 'Corporate Operating Agreement',
    description: 'Signed LLC agreement, corporate bylaws, or structural articles showing ownership distribution.',
    category: 'Identity',
    formats: ['.pdf'],
    maxSize: 15 * 1024 * 1024,
  },
  photo_id: {
    id: 'photo_id',
    name: "Valid Photo ID (Primary Signer)",
    description: "Clear colored capture of state-issued driver's license or federal passport. Non-expired.",
    category: 'Identity',
    formats: ['.jpg', '.png', '.pdf'],
    maxSize: 10 * 1024 * 1024,
  }
};

const LANE_MAPPING = {
  working_capital: {
    title: 'Working Capital',
    docs: ['bank_statements_3', 'ein_certificate', 'voided_check', 'photo_id']
  },
  revenue_based: {
    title: 'Revenue-Based Funding',
    docs: ['bank_statements_6', 'merchant_statements', 'p_and_l', 'photo_id']
  },
  equipment: {
    title: 'Equipment Financing',
    docs: ['equipment_quote', 'tax_returns', 'pfs_form', 'photo_id']
  },
  credit_prep: {
    title: 'Business Credit Prep',
    docs: ['ein_certificate', 'utility_bill', 'operating_agreement']
  },
  real_estate: {
    title: 'Real Estate Funding',
    docs: ['real_estate_contract', 'operating_agreement', 'tax_returns', 'photo_id']
  },
  ecommerce: {
    title: 'Ecommerce & Gig Funding',
    docs: ['merchant_statements', 'bank_statements_3', 'photo_id']
  }
};

export default function DocumentChecklistPortal() {
  const [partnerSlug, setPartnerSlug] = useState('[PARTNER_NAME]');
  const [selectedLanes, setSelectedLanes] = useState(['working_capital']);
  const [stagedFiles, setStagedFiles] = useState({});
  const [validationLog, setValidationLog] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, processing, success, error
  const [dragActive, setDragActive] = useState(null); // track which document card is target for drag
  const [overallProgress, setOverallProgress] = useState(0);

  // Dynamic Slug resolution
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const slugIndex = pathParts.indexOf('partners');
      if (slugIndex !== -1 && pathParts[slugIndex + 1]) {
        const slugStr = pathParts[slugIndex + 1];
        setPartnerSlug(slugStr.charAt(0).toUpperCase() + slugStr.slice(1));
      }
    }
  }, []);

  // Compute actual dynamic checklist requirements based on active lanes
  const getRequiredDocs = useCallback(() => {
    const requiredSet = new Set();
    selectedLanes.forEach(laneKey => {
      const laneConfig = LANE_MAPPING[laneKey];
      if (laneConfig) {
        laneConfig.docs.forEach(docId => requiredSet.add(docId));
      }
    });
    return Array.from(requiredSet).map(docId => DOCUMENTS_REGISTRY[docId]);
  }, [selectedLanes]);

  // Recalculate complete status progress metrics
  useEffect(() => {
    const required = getRequiredDocs();
    if (required.length === 0) {
      setOverallProgress(0);
      return;
    }
    const uploadedCount = required.filter(doc => stagedFiles[doc.id] && stagedFiles[doc.id].status === 'verified').length;
    setOverallProgress(Math.round((uploadedCount / required.length) * 100));
  }, [stagedFiles, getRequiredDocs]);

  // Toggle active analysis pipeline lanes
  const toggleLane = (laneKey) => {
    setSelectedLanes(prev => {
      if (prev.includes(laneKey)) {
        if (prev.length === 1) return prev; // Keep at least one active pipeline
        return prev.filter(k => k !== laneKey);
      } else {
        return [...prev, laneKey];
      }
    });
    addLog(`Pipeline modified. Dynamic underwriting requirements updated.`, 'info');
  };

  // Structured Logging engine
  const addLog = (message, type = 'system') => {
    const timestamp = new Date().toLocaleTimeString();
    setValidationLog(prev => [`[${timestamp}] [${type.toUpperCase()}] ${message}`, ...prev.slice(0, 18)]);
  };

  // Mock document parsing & sandbox evaluation engines
  const processFileVerification = (docId, fileName, fileSize) => {
    addLog(`Initiated sandbox upload for: ${fileName}`, 'system');
    
    setStagedFiles(prev => ({
      ...prev,
      [docId]: {
        name: fileName,
        size: fileSize,
        progress: 10,
        status: 'parsing',
        error: null
      }
    }));

    // Step 1: Simulated Secure Metadata Check
    setTimeout(() => {
      setStagedFiles(prev => {
        if (!prev[docId]) return prev;
        return {
          ...prev,
          [docId]: { ...prev[docId], progress: 45, status: 'scanning' }
        };
      });
      addLog(`File checksum validated: ${fileName} (${(fileSize / (1024 * 1024)).toFixed(2)} MB)`, 'secure');
    }, 800);

    // Step 2: Content Compliance Analysis
    setTimeout(() => {
      setStagedFiles(prev => {
        if (!prev[docId]) return prev;
        return {
          ...prev,
          [docId]: { ...prev[docId], progress: 80, status: 'ledger_analysis' }
        };
      });
      addLog(`Metadata signature matches compliant PDF framework guidelines. Parsing ledger entries.`, 'analyze');
    }, 1600);

    // Step 3: Local Node Verification complete
    setTimeout(() => {
      setStagedFiles(prev => {
        if (!prev[docId]) return prev;
        return {
          ...prev,
          [docId]: { ...prev[docId], progress: 100, status: 'verified' }
        };
      });
      addLog(`Document securely staged and verified: ${fileName}. Ready for Underwriting Desk.`, 'success');
    }, 2400);
  };

  // Standard Drag & Drop handlers
  const handleDrag = (e, docId) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(docId);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e, docId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndStage(docId, file);
    }
  };

  const handleFileSelect = (e, docId) => {
    if (e.target.files && e.target.files[0]) {
      validateAndStage(docId, e.target.files[0]);
    }
  };

  const validateAndStage = (docId, file) => {
    const registrySpec = DOCUMENTS_REGISTRY[docId];
    if (!registrySpec) return;

    // Check extensions
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!registrySpec.formats.includes(fileExt)) {
      addLog(`Validation Error: Invalid format for ${registrySpec.name}. Expected: ${registrySpec.formats.join(', ')}`, 'error');
      setStagedFiles(prev => ({
        ...prev,
        [docId]: {
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'error',
          error: `Incorrect extension type: ${fileExt}. Requires: ${registrySpec.formats.join(', ')}`
        }
      }));
      return;
    }

    // Check limits
    if (file.size > registrySpec.maxSize) {
      addLog(`Validation Error: Size overhead limits breached on ${registrySpec.name}.`, 'error');
      setStagedFiles(prev => ({
        ...prev,
        [docId]: {
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'error',
          error: `File exceeds capacity threshold of ${(registrySpec.maxSize / (1024 * 1024))}MB.`
        }
      }));
      return;
    }

    processFileVerification(docId, file.name, file.size);
  };

  const removeStagedFile = (docId) => {
    const fileMeta = stagedFiles[docId];
    setStagedFiles(prev => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
    if (fileMeta) {
      addLog(`Removed item from temporary staging bucket: ${fileMeta.name}`, 'system');
    }
  };

  // Submit complete documentation set to core nodes
  const submitPackToUnderwriting = () => {
    const required = getRequiredDocs();
    const incomplete = required.filter(doc => !stagedFiles[doc.id] || stagedFiles[doc.id].status !== 'verified');

    if (incomplete.length > 0) {
      addLog(`Submission rejected: You have ${incomplete.length} critical required compliance layers missing or unprocessed.`, 'error');
      alert(`Underwriting Protocol Error: Complete all verification stages before locking payload bundle.`);
      return;
    }

    setUploadStatus('processing');
    addLog(`Initiating secure SSL transmission handshake to Moonshine Cap mainframes...`, 'secure');

    setTimeout(() => {
      addLog(`Packing cryptographic payloads. Creating digital signatures...`, 'secure');
    }, 1000);

    setTimeout(() => {
      addLog(`Pushing package metrics directly to Partner desk node.`, 'secure');
    }, 2000);

    setTimeout(() => {
      setUploadStatus('success');
      addLog(`TRANSMISSION SECURE & CONFIRMED. Payload successfully parsed and staged on core desks.`, 'success');
    }, 3500);
  };

  const requiredDocs = getRequiredDocs();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F3EF] font-sans antialiased selection:bg-[#00E676] selection:text-[#0D0D0D]">
      {/* Dynamic Status bar mimicking original layout */}
      <div className="border-b border-[#1E1E1E] bg-[#0D0D0D] text-xs font-mono py-2 px-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2.5 h-2.5 bg-[#00E676] rounded-full relative after:absolute after:w-2 after:h-2 after:bg-[#00E676] after:rounded-full after:animate-ping after:top-0 after:left-0"></span>
            <span className="text-zinc-400 tracking-wider uppercase">PORTAL NODE // DOCUMENT MANAGER // <span className="text-white font-bold">{partnerSlug} CO-PILOT</span></span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>STAGING: {overallProgress}% SECURED</span>
          </div>
        </div>
      </div>

      {/* Header section */}
      <header className="bg-[#0D0D0D] border-b border-[#1E1E1E] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#F4F3EF] text-[#0D0D0D] px-3 py-1.5 font-display font-extrabold text-lg tracking-tighter uppercase border border-white shadow-[4px_4px_0px_0px_rgba(0,230,118,1)]">
                MOONSHINE <span className="text-[#00E676]">★</span> CAP
              </div>
              <span className="text-zinc-600 font-mono text-sm hidden sm:inline">/ / UNDERWRITING STAGING MATRIX</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Header Context Banner */}
      <section className="relative pt-10 pb-12 border-b border-[#1E1E1E] bg-gradient-to-b from-[#0D0D0D] to-[#121212] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1E1E1E] border border-zinc-800 text-zinc-400 text-xs font-mono px-3 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FF6D00]"></span>
            <span>SECURE COMMERCIAL PORTAL DIRECT TO HOST NODE</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-[#F4F3EF] tracking-tight leading-none mb-3">
            Secure Document Staging & Prep Portal
          </h1>
          <p className="text-zinc-400 text-md max-w-3xl leading-relaxed">
            Fast-track underwriting pipeline positioning. By staging required corporate documents locally on your client machine before transfer, we eliminate security leak vectors and accelerate pre-underwriting analysis pipelines.
          </p>
        </div>
      </section>

      {/* Main Dynamic Sandbox Interface */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dynamic Configuration Controls Left Panel */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Pipeline Configuration Selector Card */}
            <div className="bg-[#1E1E1E] border border-zinc-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-display font-extrabold text-lg text-[#F4F3EF] border-b border-zinc-800 pb-3 mb-4 uppercase tracking-tight">
                1. Select Target Lanes
              </h2>
              <p className="text-xs text-zinc-400 mb-4 font-mono leading-relaxed">
                Toggling dynamic lanes dynamically adjusts file requirements on the checklist in real time.
              </p>
              
              <div className="space-y-2.5">
                {Object.entries(LANE_MAPPING).map(([key, config]) => {
                  const isActive = selectedLanes.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleLane(key)}
                      className={`w-full text-left p-3.5 border transition-all duration-200 font-mono text-xs flex justify-between items-center ${
                        isActive
                          ? 'bg-zinc-900 border-[#00E676] text-white shadow-[2px_2px_0px_0px_rgba(0,230,118,1)]'
                          : 'bg-[#121212] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 border ${isActive ? 'bg-[#00E676] border-[#00E676]' : 'border-zinc-700 bg-transparent'}`}></span>
                        <span>{config.title}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">{config.docs.length} Files</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Interactive Verification Logger Console */}
            <div className="bg-[#1E1E1E] border border-zinc-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
                <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-[#F4F3EF]">
                  Real-time System Logs
                </h3>
                <span className="text-[10px] bg-zinc-900 px-2 py-0.5 border border-zinc-800 font-mono text-[#00E676] animate-pulse">
                  ONLINE
                </span>
              </div>
              <div className="bg-[#0D0D0D] p-3 rounded border border-zinc-800 h-64 overflow-y-auto font-mono text-[10px] space-y-1.5 scrollbar-thin">
                {validationLog.length === 0 ? (
                  <p className="text-zinc-600 italic">SYSTEM IDLE: Stage files to initiate metadata parser arrays...</p>
                ) : (
                  validationLog.map((log, index) => {
                    let logColor = 'text-zinc-400';
                    if (log.includes('[ERROR]')) logColor = 'text-red-500';
                    if (log.includes('[SUCCESS]')) logColor = 'text-[#00E676]';
                    if (log.includes('[SECURE]')) logColor = 'text-[#2979FF]';
                    if (log.includes('[ANALYZE]')) logColor = 'text-[#FF6D00]';
                    return (
                      <div key={index} className={`${logColor} leading-normal border-b border-zinc-900/30 pb-1`}>
                        {log}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-[9px] text-zinc-500 font-mono">CLIENT-SIDE SECURE VERIFICATION</p>
                <button
                  onClick={() => setValidationLog([])}
                  className="text-zinc-400 hover:text-white font-mono text-[9px] underline uppercase"
                >
                  Clear Console
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Document Checklist & Sandbox Right Panel */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Checklist Header bar with progress display */}
            <div className="bg-[#1E1E1E] border border-zinc-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-display font-extrabold text-xl text-[#F4F3EF]">
                  Dynamic Checklist Staging Area
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Showing {requiredDocs.length} requested components for active lanes.
                </p>
              </div>
              
              {/* Neobrutalist Progress Meter */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-full sm:w-48 bg-zinc-900 h-5 border border-zinc-800 p-0.5 relative">
                  <div 
                    className="bg-[#00E676] h-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-white uppercase mix-blend-difference">
                    {overallProgress}% COMPLETE
                  </span>
                </div>
              </div>
            </div>

            {/* Main Interactive Checklist Matrix */}
            <div className="space-y-4">
              {requiredDocs.map((docSpec) => {
                const staged = stagedFiles[docSpec.id];
                const isDragOverThisCard = dragActive === docSpec.id;

                return (
                  <div
                    key={docSpec.id}
                    className={`border-2 transition-all duration-200 bg-[#1E1E1E] ${
                      isDragOverThisCard 
                        ? 'border-[#00E676] bg-zinc-900/60 shadow-[4px_4px_0px_0px_rgba(0,230,118,1)]' 
                        : staged?.status === 'verified'
                        ? 'border-[#00E676]/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]'
                        : staged?.status === 'error'
                        ? 'border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,0.2)]'
                        : 'border-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                    onDragEnter={(e) => handleDrag(e, docSpec.id)}
                    onDragLeave={(e) => handleDrag(e, docSpec.id)}
                    onDragOver={(e) => handleDrag(e, docSpec.id)}
                    onDrop={(e) => handleDrop(e, docSpec.id)}
                  >
                    <div className="p-5 flex flex-col md:flex-row gap-5 items-stretch justify-between">
                      {/* Left Block: Description & Rules */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px] px-2 py-0.5 tracking-wider uppercase">
                            {docSpec.category}
                          </span>
                          <span className="text-zinc-500 font-mono text-[9px]">
                            Max Size: {(docSpec.maxSize / (1024 * 1024))}MB
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-base text-[#F4F3EF] flex items-center gap-2">
                          {docSpec.name}
                          {staged?.status === 'verified' && (
                            <span className="text-[#00E676] text-xs font-mono">✓ SECURED</span>
                          )}
                        </h3>
                        <p className="text-zinc-400 text-xs leading-relaxed max-w-xl">
                          {docSpec.description}
                        </p>
                        <div className="flex gap-1.5 pt-1">
                          {docSpec.formats.map(f => (
                            <span key={f} className="text-[10px] font-mono text-zinc-500 bg-black/30 border border-zinc-800 px-1.5 py-0.5">
                              {f.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Block: Sandbox File Handling */}
                      <div className="w-full md:w-72 flex flex-col justify-center">
                        {!staged ? (
                          // Interactive Dropzone Target State
                          <div className="border border-dashed border-zinc-700 bg-[#121212] p-4 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-zinc-500 transition-colors relative">
                            <input
                              type="file"
                              accept={docSpec.formats.join(',')}
                              onChange={(e) => handleFileSelect(e, docSpec.id)}
                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                            />
                            <svg className="w-6 h-6 text-zinc-500 mb-2 group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="font-mono text-[10px] text-zinc-400">
                              DRAG & DROP FILE
                            </p>
                            <p className="font-mono text-[9px] text-zinc-500 uppercase mt-0.5 decoration-dotted underline">
                              or click to browse
                            </p>
                          </div>
                        ) : (
                          // Active file processing & results panel
                          <div className="bg-[#0D0D0D] border border-zinc-800 p-4 space-y-3 relative overflow-hidden">
                            
                            {/* Visual background gradient for progress tracking */}
                            <div 
                              className="absolute left-0 top-0 bottom-0 bg-[#00E676]/5 transition-all duration-300"
                              style={{ width: `${staged.progress}%` }}
                            ></div>

                            <div className="relative z-10 space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <div className="truncate flex-1">
                                  <p className="font-mono text-xs text-white truncate" title={staged.name}>
                                    {staged.name}
                                  </p>
                                  <p className="font-mono text-[9px] text-zinc-500 uppercase">
                                    {(staged.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeStagedFile(docSpec.id)}
                                  className="text-zinc-500 hover:text-red-500 font-mono text-xs p-1"
                                  title="Remove Staged File"
                                >
                                  ✕
                                </button>
                              </div>

                              {/* Progress bar visual alignment */}
                              <div className="h-1 w-full bg-zinc-900 overflow-hidden rounded">
                                <div 
                                  className={`h-full transition-all duration-200 ${
                                    staged.status === 'error' ? 'bg-red-500' : 'bg-[#00E676]'
                                  }`}
                                  style={{ width: `${staged.progress}%` }}
                                ></div>
                              </div>

                              {/* Status Feedback Row */}
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                {staged.status === 'parsing' && (
                                  <span className="text-zinc-400 animate-pulse">PARSING LEDGER...</span>
                                )}
                                {staged.status === 'scanning' && (
                                  <span className="text-[#2979FF] animate-pulse">CRYPTOGRAPHIC CHECK...</span>
                                )}
                                {staged.status === 'ledger_analysis' && (
                                  <span className="text-[#FF6D00] animate-pulse font-bold">LEDGER QUALITY RUN...</span>
                                )}
                                {staged.status === 'verified' && (
                                  <span className="text-[#00E676] font-extrabold flex items-center gap-1">
                                    ★ STAGED SECURE
                                  </span>
                                )}
                                {staged.status === 'error' && (
                                  <span className="text-red-500 font-bold">CHECK ERROR</span>
                                )}
                                <span className="text-zinc-500">{staged.progress}%</span>
                              </div>

                              {/* Explicit Validation Error Block */}
                              {staged.error && (
                                <div className="bg-red-950/20 border border-red-900/50 p-2 text-[9px] text-red-400 font-mono leading-relaxed">
                                  {staged.error}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Secure Transmission Panel Bottom Container */}
            <div className="bg-gradient-to-r from-zinc-950 via-[#1E1E1E] to-zinc-950 border border-zinc-800 p-8 shadow-[4px_4px_0px_0px_rgba(41,121,255,1)] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#2979FF] rounded-full animate-pulse"></span>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#2979FF] font-bold">
                    Transmission Authorization
                  </p>
                </div>
                <h3 className="font-display font-extrabold text-lg text-white">
                  Stage & Authorize Underwriting Access
                </h3>
                <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                  Staging complete? Click direct transfer to lock the compiled compliance bundle and pass verification controls. Core underwriting desks will receive notification logs directly under verified Partner signatures.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {uploadStatus === 'idle' && (
                  <button
                    onClick={submitPackToUnderwriting}
                    disabled={overallProgress < 100}
                    className={`font-display font-extrabold px-8 py-4 text-center tracking-tight border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                      overallProgress === 100
                        ? 'bg-[#00E676] text-[#00100a] border-transparent hover:bg-black hover:text-[#00E676] hover:border-[#00E676] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] cursor-pointer'
                        : 'bg-zinc-800 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-50'
                    }`}
                  >
                    LOCK & TRANSMIT PACK
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </button>
                )}

                {uploadStatus === 'processing' && (
                  <button
                    disabled
                    className="bg-[#2979FF] text-white border-2 border-transparent font-display font-bold px-8 py-4 text-center cursor-wait flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  >
                    TRANSMITTING DATA PACK...
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>
                )}

                {uploadStatus === 'success' && (
                  <div className="bg-[#00E676] text-[#0d0d0d] font-display font-extrabold px-8 py-4 text-center flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    VERIFIED TRANSMISSION COMPLETE ★
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Compliance Block mimicking baseline layout styling */}
      <section className="py-8 bg-[#0D0D0D] border-t border-[#1E1E1E] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <p className="text-[10px] text-zinc-600 font-mono leading-relaxed uppercase tracking-wider">
            SECURE COMPLIANCE BLOCK: File processing operations occur purely inside local sandbox memory environments before cryptographic lock. All transmitted assets undergo secure socket transmission pipelines directly to dedicated tenant staging servers operating under rigorous military-grade security matrices. Staged profiles represent pre-underwriting evaluations only.
          </p>
        </div>
      </section>

      {/* Footer block matching layout */}
      <footer className="bg-[#0D0D0D] border-t border-[#1E1E1E] py-12 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-zinc-300 font-bold">Moonshine Capital Direct System Integrator</p>
            <p>All Rights Reserved. © {new Date().getFullYear()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-600">SECURITY RATING: AAA // COMPLIANT FIPS-140-2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}