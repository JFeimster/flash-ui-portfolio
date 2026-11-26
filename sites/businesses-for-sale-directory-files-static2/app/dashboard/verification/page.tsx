`use client`;

import React, { useState, useEffect } from 'react';

// Simulated baseline deals that will be unblinded upon full verification
const BLINDED_DEALS = [
    { id: "delta", code: "PROJECT DELTA", unblinded: "Delta Logistics Corp", sector: "Logistics", ebitda: "$620,000", multiple: "2.9x", location: "Midwest Territory" },
    { id: "kestrel", code: "PROJECT KESTREL", unblinded: "Kestrel Asset Tracker SaaS", sector: "SaaS", ebitda: "$450,000", multiple: "4.2x", location: "100% Remote" },
    { id: "hvac-nova", code: "PROJECT NOVA", unblinded: "Nova HVAC Partners LLC", sector: "Home Services", ebitda: "$810,000", multiple: "3.2x", location: "Franconia, VA" },
];

export default function VerificationPortal() {
    // Portal states
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [plaidConnected, setPlaidConnected] = useState(false);
    const [isPlaidConnecting, setIsPlaidConnecting] = useState(false);
    const [verifiedBalance, setVerifiedBalance] = useState<number | null>(null);
    const [activeVerificationTab, setActiveVerificationTab] = useState<'plaid' | 'manual'>('plaid');
    const [manualDocName, setManualDocName] = useState('');
    
    // Search Criteria state
    const [targetEbitdaMin, setTargetEbitdaMin] = useState(400000);
    const [targetMultipleMax, setTargetMultipleMax] = useState(3.5);
    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
    
    // NDA states
    const [legalName, setLegalName] = useState('');
    const [signTitle, setSignTitle] = useState('Managing Partner');
    const [isSigning, setIsSigning] = useState(false);
    const [cryptoSignature, setCryptoSignature] = useState('');
    const [ndaSigned, setNdaSigned] = useState(false);

    // Terminal Logging
    const [logs, setLogs] = useState<{ id: string; text: string; type: 'system' | 'success' | 'warn' | 'info' }[]>([
        { id: '1', text: 'ACQUIRE_META COMPLIANCE SHELL READY', type: 'system' },
        { id: '2', text: 'SECURE SESSION INITIALIZED AT PORT 443', type: 'info' },
        { id: '3', text: 'AWAITING BUYER PROOF OF FUNDS (POF) DEPLOYMENT...', type: 'warn' }
    ]);

    const addLog = (text: string, type: 'system' | 'success' | 'warn' | 'info' = 'info') => {
        setLogs(prev => [...prev, { id: Date.now().toString(), text: `[${new Date().toLocaleTimeString()}] ${text}`, type }]);
    };

    // Auto-scroll logs container
    useEffect(() => {
        const consoleEl = document.getElementById('terminal-console');
        if (consoleEl) {
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }
    }, [logs]);

    // Handle Plaid Verification Simulation
    const handlePlaidConnect = () => {
        setIsPlaidConnecting(true);
        addLog('CONNECTING TO PLAID SECURE LINK...', 'system');
        
        setTimeout(() => {
            addLog('PLAID INSTITUTION DIRECTORY INSTANTIATED. SELECTING PREFERRED ASSET CORES...', 'info');
            
            setTimeout(() => {
                const balance = 1850000;
                setVerifiedBalance(balance);
                setPlaidConnected(true);
                setIsPlaidConnecting(false);
                addLog(`PLAID API: SECURE TRANSACTION LOG COMPLETED WITH BALANCE: $${balance.toLocaleString()}`, 'success');
                addLog('PROOF OF FUNDS VERIFIED. CLEARANCE LEVEL LEVEL-2 ASSIGNED.', 'success');
                setStep(2);
                addLog('AWAITING UPDATE ON BUYER ACQUISITION FILTER GRID...', 'warn');
            }, 1200);
        }, 800);
    };

    // Handle Manual Statement Submission
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualDocName) return;
        addLog(`UPLOADING MANUAL STATEMENT: ${manualDocName.toUpperCase()}`, 'info');
        addLog('DOCUMENT ROUTED TO MANUAL AUDIT STREAM. PRIORITY REVIEW QUEUE TRIGGERED.', 'warn');
        setTimeout(() => {
            setVerifiedBalance(750000);
            setPlaidConnected(true);
            setStep(2);
            addLog('PRE-COMPLIANCE CONDITIONAL APPROVAL ACQUIRED: $750,000 POF.', 'success');
        }, 1000);
    };

    // Toggle target sectors
    const toggleSector = (sector: string) => {
        if (selectedSectors.includes(sector)) {
            setSelectedSectors(prev => prev.filter(s => s !== sector));
            addLog(`DE-SELECTING TARGET CLASSIFICATION: ${sector.toUpperCase()}`, 'info');
        } else {
            setSelectedSectors(prev => [...prev, sector]);
            addLog(`TARGET CLASSIFICATION ADDED: ${sector.toUpperCase()}`, 'info');
        }
    };

    // Save Search Parameters
    const saveSearchCriteria = () => {
        addLog(`ACQUISITION PARAMETERS LOCKED IN: MIN EBITDA: $${targetEbitdaMin.toLocaleString()} // MAX MULTIPLE: ${targetMultipleMax}x`, 'success');
        if (selectedSectors.length > 0) {
            addLog(`REGISTERED SECTOR FOCUS: [${selectedSectors.join(', ')}]`, 'info');
        }
        setStep(3);
        addLog('AWAITING PROGRAMMATIC MASTER NDA DIGITAL DEPLOYMENT...', 'warn');
    };

    // Programmatic NDA Execution
    const executeNDA = (e: React.FormEvent) => {
        e.preventDefault();
        if (!legalName || !signTitle) {
            addLog('NDA COMPLIANCE ERROR: LEGAL SIGNATURE BLOCKS MANDATORY.', 'warn');
            return;
        }

        setIsSigning(true);
        addLog('COMPILING SECURE INTEGRATION METADATA FOR BINDING MASTER NDA...', 'info');

        setTimeout(() => {
            const simulatedHash = 'SHA256::' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
            setCryptoSignature(simulatedHash);
            setNdaSigned(true);
            setIsSigning(false);
            setStep(4);
            addLog(`NDA FULLY EXECUTED. HASH CONTRACT IDENTIFIER: ${simulatedHash}`, 'success');
            addLog('ACQUIRE_META UNDERGROUND UNLOCKED. CLASS L3 ACCESS IN EFFECT.', 'success');
        }, 1500);
    };

    return (
        <div className="bg-[#050505] text-[#F9F9F9] min-h-screen font-sans flex flex-col selection:bg-[#00FF66] selection:text-black">
            
            {/* Live Ticker Header */}
            <header className="w-full bg-[#090909] border-b border-[#222222] h-11 flex items-center overflow-hidden shrink-0">
                <div className="bg-[#FF3333] text-black font-mono text-[10px] font-bold px-4 h-full flex items-center space-x-2 shrink-0 border-r border-[#222222] tracking-wider uppercase">
                    <span className="inline-block w-2 h-2 rounded-full bg-black animate-ping"></span>
                    <span>SECURE PROVING GROUNDS</span>
                </div>
                <div className="w-full overflow-hidden h-full flex items-center font-mono text-[11px] text-[#888888] tracking-widest uppercase">
                    <div className="flex whitespace-nowrap space-x-12 px-6">
                        <span>● INTEGRITY STATUS: ENCRYPTED END-TO-END</span>
                        <span>▲ ACTIVE BUYERS VERIFIED IN LAST 24H: 147</span>
                        <span>■ PLAID PIPELINE: CONSTANT</span>
                        <span>● SEC COMPLIANT ASSET ACQUISITIONS ONLY</span>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-grow grid grid-cols-1 xl:grid-cols-12 max-w-[1600px] w-full mx-auto border-x border-[#222222] bg-[#050505]">
                
                {/* Left Panel: Programmatic Progress Status (4 Columns) */}
                <aside className="xl:col-span-4 border-b xl:border-b-0 xl:border-r border-[#222222] bg-[#080808] p-6 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="border-b border-[#222222] pb-6">
                            <h1 className="font-mono text-xl font-bold tracking-tight text-[#F9F9F9]">
                                VERIFICATION<span className="text-[#00FF66]">.SH</span>
                            </h1>
                            <p className="font-mono text-[9px] text-[#666666] tracking-widest uppercase mt-1">
                                SECURE REGISTRATION & POF ROUTING PROTOCOL
                            </p>
                        </div>

                        {/* Progress Stepper Widgets */}
                        <div className="space-y-3">
                            {/* Step 1 Badge */}
                            <div className={`p-4 border ${step === 1 ? 'border-[#0EA5E9] bg-gradient-to-r from-[#0ea5e9]/5 to-transparent' : 'border-[#222222]'} transition-all`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] text-[#888888] tracking-widest">01 / PROOF OF FUNDS (POF)</span>
                                    {plaidConnected ? (
                                        <span className="font-mono text-[10px] text-[#00FF66] font-bold">VERIFIED</span>
                                    ) : (
                                        <span className="font-mono text-[10px] text-[#FF3333] animate-pulse">PENDING</span>
                                    )}
                                </div>
                                <p className="text-xs font-semibold mt-1 text-[#F9F9F9]">Connect Brokerage/Bank Via Plaid</p>
                                {verifiedBalance !== null && (
                                    <div className="mt-2 text-xs font-mono text-[#00FF66]">
                                        Verified Reserve: ${verifiedBalance.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {/* Step 2 Badge */}
                            <div className={`p-4 border ${step === 2 ? 'border-[#0EA5E9] bg-gradient-to-r from-[#0ea5e9]/5 to-transparent' : 'border-[#222222]'} transition-all`}>
                                <span className="font-mono text-[10px] text-[#888888] tracking-widest block">02 / BUYER FILTERS</span>
                                <p className="text-xs font-semibold mt-1 text-[#F9F9F9]">Establish Sector & EBITDA Limits</p>
                                {selectedSectors.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {selectedSectors.map(s => (
                                            <span key={s} className="bg-[#222] text-[#F9F9F9] font-mono text-[8px] px-1.5 py-0.5 border border-[#333]">
                                                {s.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Step 3 Badge */}
                            <div className={`p-4 border ${step === 3 ? 'border-[#0EA5E9] bg-gradient-to-r from-[#0ea5e9]/5 to-transparent' : 'border-[#222222]'} transition-all`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] text-[#888888] tracking-widest">03 / PROGRAMMATIC NDA</span>
                                    {ndaSigned ? (
                                        <span className="font-mono text-[10px] text-[#00FF66] font-bold">SIGNED</span>
                                    ) : (
                                        <span className="font-mono text-[10px] text-[#666]">UNEXECUTED</span>
                                    )}
                                </div>
                                <p className="text-xs font-semibold mt-1 text-[#F9F9F9]">Secure Cryptographic Master Signature</p>
                            </div>

                            {/* Step 4 Badge */}
                            <div className={`p-4 border ${step === 4 ? 'border-[#00FF66] bg-[#00ff66]/5' : 'border-[#222222]'} transition-all`}>
                                <span className="font-mono text-[10px] text-[#888888] tracking-widest block">04 / SECURE UNLOCKED PIPELINE</span>
                                <p className="text-xs font-semibold mt-1 text-[#F9F9F9]">Classified Deal Cryptography Decrypted</p>
                            </div>
                        </div>
                    </div>

                    {/* Left Panel Footer Metadata */}
                    <div className="mt-8 border-t border-[#222222] pt-6 space-y-4">
                        <div className="bg-black p-3.5 border border-[#1a1a1a] flex justify-between items-center">
                            <div>
                                <p className="font-mono text-[8px] text-[#666]">CLEARANCE GRADE</p>
                                <p className="font-mono text-xs font-bold text-[#F9F9F9]">
                                    {step === 4 ? 'SECURE GRADE L3' : 'UNASSIGNED LEVEL'}
                                </p>
                            </div>
                            <span className={`w-3.5 h-3.5 ${step === 4 ? 'bg-[#00FF66] animate-pulse shadow-[0_0_10px_rgba(0,255,102,0.5)]' : 'bg-[#FF3333]'} inline-block`}></span>
                        </div>
                    </div>
                </aside>

                {/* Center Panel: Primary Workspaces (8 Columns) */}
                <section className="xl:col-span-8 p-6 lg:p-8 flex flex-col justify-between space-y-8 bg-[#050505]">
                    
                    {/* Header Stream & Actions */}
                    <div className="border-b border-[#222222] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="font-mono text-sm uppercase tracking-widest text-[#F9F9F9] flex items-center space-x-2">
                                <span>SECURE PIPELINE CLEARANCE PORTAL</span>
                            </h2>
                            <p className="text-xs text-[#666] mt-1 font-mono">
                                Systematically validating buyer assets and executing legal binding safeguards in under 2 minutes.
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="font-mono text-[10px] text-[#888]">STRICT REQUIREMENT:</span>
                            <span className="text-[10px] font-mono text-[#00FF66] border border-[#00FF66]/20 bg-[#00FF66]/10 px-2.5 py-0.5 uppercase tracking-wider">SEC APPROVED</span>
                        </div>
                    </div>

                    {/* Active Step Panel Component Area */}
                    <div className="flex-grow py-4">
                        {step === 1 && (
                            <div className="space-y-6 max-w-xl">
                                <div>
                                    <h3 className="font-mono text-xs text-[#0ea5e9] uppercase tracking-wider">STEP 01 / LIQUID CAPITAL ASSET PROOF</h3>
                                    <p className="text-sm font-semibold mt-1">Select verification pathway to prove liquid acquisition reserve capacity.</p>
                                    <p className="text-xs text-[#666] mt-1 font-mono">Minimum recommended threshold: $400,000 liquid capital.</p>
                                </div>

                                {/* Tab Selector */}
                                <div className="grid grid-cols-2 gap-1 border-b border-[#222]">
                                    <button 
                                        onClick={() => setActiveVerificationTab('plaid')}
                                        className={`pb-2.5 text-xs font-mono tracking-wider ${activeVerificationTab === 'plaid' ? 'border-b-2 border-[#00FF66] text-[#00FF66]' : 'text-[#666] hover:text-[#fff]'}`}
                                    >
                                        PLAID SECURE CONNECT (RECOMMENDED)
                                    </button>
                                    <button 
                                        onClick={() => setActiveVerificationTab('manual')}
                                        className={`pb-2.5 text-xs font-mono tracking-wider ${activeVerificationTab === 'manual' ? 'border-b-2 border-[#00FF66] text-[#00FF66]' : 'text-[#666] hover:text-[#fff]'}`}
                                    >
                                        MANUAL FILE STATEMENT
                                    </button>
                                </div>

                                {activeVerificationTab === 'plaid' ? (
                                    <div className="border border-[#222] bg-[#080808] p-6 space-y-6">
                                        <div className="flex items-start space-x-3">
                                            <span className="inline-block bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 font-mono text-[10px] px-2.5 py-1">REAL-TIME API</span>
                                            <p className="text-xs text-[#888] font-mono leading-relaxed">
                                                Plinking your brokerage account dynamically aggregates liquidity vectors instantly. No documents stored. Unlocks deal streams immediately.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={handlePlaidConnect}
                                            disabled={isPlaidConnecting}
                                            className="w-full h-12 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-xs font-bold tracking-widest uppercase transition-all hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] flex items-center justify-center space-x-2"
                                        >
                                            {isPlaidConnecting ? (
                                                <span className="animate-pulse">CONNECTING SECURE ENDPOINT...</span>
                                            ) : (
                                                <span>INSTANT POF CONNECT VIA PLAID API</span>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleManualSubmit} className="border border-[#222] bg-[#080808] p-6 space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="font-mono text-[9px] uppercase text-[#888888] tracking-widest">STATEMENT DESCRIPTION / BROKERAGE FIRM</label>
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="e.g. Fidelity Brokerage Statement (Q3)" 
                                                value={manualDocName}
                                                onChange={(e) => setManualDocName(e.target.value)}
                                                className="w-full h-11 bg-black border border-[#222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] placeholder-[#555] focus:outline-none focus:border-[#00FF66]"
                                            />
                                        </div>
                                        <div className="border-2 border-dashed border-[#222] p-6 text-center">
                                            <span className="font-mono text-[9px] uppercase text-[#666] tracking-widest block mb-2">Drag and drop or select file for ingestion</span>
                                            <span className="font-mono text-[9px] text-[#444] block">PDF, PNG, JPG (MAX 24MB)</span>
                                        </div>
                                        <button 
                                            type="submit"
                                            className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 border border-[#222222] font-mono text-xs text-[#F9F9F9] tracking-wider uppercase transition-all"
                                        >
                                            SUBMIT DOCUMENT FOR AUDIT ENGINE
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 max-w-xl">
                                <div>
                                    <h3 className="font-mono text-xs text-[#0ea5e9] uppercase tracking-wider">STEP 02 / ACQUISITION SEGMENTATION CRITERIA</h3>
                                    <p className="text-sm font-semibold mt-1">Refine target parameters to map to optimized deal structures in real-time.</p>
                                </div>

                                <div className="space-y-6 border border-[#222] bg-[#080808] p-6">
                                    
                                    {/* Sector Selectors */}
                                    <div className="space-y-2">
                                        <label className="font-mono text-[9px] uppercase text-[#888888] tracking-widest block">TARGET VERTICALS (CHOOSE AT LEAST ONE)</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['SaaS', 'Home Services', 'Logistics', 'Manufacturing'].map((sec) => (
                                                <button
                                                    key={sec}
                                                    type="button"
                                                    onClick={() => toggleSector(sec)}
                                                    className={`h-11 border text-xs font-mono px-4 flex items-center justify-between transition-all ${selectedSectors.includes(sec) ? 'border-[#0ea5e9] text-[#0ea5e9] bg-[#0ea5e9]/5' : 'border-[#222] text-[#888] hover:border-[#444]'}`}
                                                >
                                                    <span>{sec}</span>
                                                    <span>{selectedSectors.includes(sec) ? '●' : '○'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cashflow Sliders */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center font-mono text-[9px] text-[#888888] tracking-widest">
                                            <span>MINIMUM EBITDA TARGET</span>
                                            <span className="text-[#00FF66] font-bold">${targetEbitdaMin.toLocaleString()}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="200000" 
                                            max="1500000" 
                                            step="50000" 
                                            value={targetEbitdaMin}
                                            onChange={(e) => setTargetEbitdaMin(parseInt(e.target.value))}
                                            className="w-full h-1 bg-neutral-800 accent-[#00FF66] cursor-pointer appearance-none rounded-none"
                                        />
                                        <div className="flex justify-between text-[8px] font-mono text-[#555]">
                                            <span>$200K EBITDA</span>
                                            <span>$1.5M EBITDA</span>
                                        </div>
                                    </div>

                                    {/* Max Multiple Input */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center font-mono text-[9px] text-[#888888] tracking-widest">
                                            <span>MAX MULTIPLE COGNIZANT LIMIT</span>
                                            <span className="text-[#0ea5e9] font-bold">{targetMultipleMax}x</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="2.0" 
                                            max="5.0" 
                                            step="0.1" 
                                            value={targetMultipleMax}
                                            onChange={(e) => setTargetMultipleMax(parseFloat(e.target.value))}
                                            className="w-full h-1 bg-neutral-800 accent-[#0ea5e9] cursor-pointer appearance-none rounded-none"
                                        />
                                        <div className="flex justify-between text-[8px] font-mono text-[#555]">
                                            <span>2.0x Multiple</span>
                                            <span>5.0x Multiple</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={saveSearchCriteria}
                                        className="w-full h-12 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-xs font-bold tracking-widest uppercase transition-all"
                                    >
                                        LOCK FILTER SPECIFICATIONS
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 max-w-xl">
                                <div>
                                    <h3 className="font-mono text-xs text-[#0ea5e9] uppercase tracking-wider">STEP 03 / PROGRAMMATIC BINDING NDA AGREEMENT</h3>
                                    <p className="text-sm font-semibold mt-1">This agreement governs transaction anonymity & classified corporate structure integrity.</p>
                                </div>

                                <div className="border border-[#222] bg-[#080808] p-5 space-y-4">
                                    <div className="bg-black p-4 border border-[#1a1a1a] h-40 overflow-y-auto font-mono text-[10px] text-[#888] leading-relaxed space-y-3">
                                        <p className="text-[#00FF66] font-bold">MUTUAL NON-DISCLOSURE PROTOCOL v3.99</p>
                                        <p>
                                            The Disclosing Party plans to disclose certain proprietary transaction details (the &quot;Confidential Information&quot;) to the recipient for the sole purpose of assessing business acquisitions.
                                        </p>
                                        <p>
                                            1. Maintenance of Anonymity: Recipient agrees that all codenames, physical operational sites, and financial metrics are classified and must not be disseminated outside of professional advisory pools.
                                        </p>
                                        <p>
                                            2. Structural Damage Clawbacks: Breach of operational confidentiality will trigger liquidation damages calculated upon the average premium transaction metrics.
                                        </p>
                                        <p>
                                            3. Term: This agreement shall remain active for three (3) calendar years from date of cryptographic logging.
                                        </p>
                                    </div>

                                    <form onSubmit={executeNDA} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="font-mono text-[9px] uppercase text-[#888888] tracking-widest block">FULL LEGAL NAME</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    value={legalName}
                                                    onChange={(e) => setLegalName(e.target.value)}
                                                    placeholder="e.g. Sterling Hunt" 
                                                    className="w-full h-11 bg-black border border-[#222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#00FF66]"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="font-mono text-[9px] uppercase text-[#888888] tracking-widest block">SIGNING CAPACITY / TITLE</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    value={signTitle}
                                                    onChange={(e) => setSignTitle(e.target.value)}
                                                    placeholder="Managing Director" 
                                                    className="w-full h-11 bg-black border border-[#222] rounded-none px-4 text-xs font-mono text-[#F9F9F9] focus:outline-none focus:border-[#00FF66]"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 py-2">
                                            <input 
                                                type="checkbox" 
                                                required
                                                id="agree"
                                                className="w-4 h-4 accent-[#00FF66] bg-black border border-[#222]"
                                            />
                                            <label htmlFor="agree" className="text-xs text-[#888] font-mono">
                                                I authorize cryptographic signing as a binding digital standard.
                                            </label>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isSigning}
                                            className="w-full h-12 bg-transparent border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-mono text-xs font-bold tracking-widest uppercase transition-all"
                                        >
                                            {isSigning ? 'EXECUTING SIGNATURE...' : 'SIGN MASTER NDA AND UNLOCK DEALFLOW'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 max-w-2xl">
                                <div className="border border-[#00FF66]/20 bg-[#00FF66]/5 p-6 space-y-2">
                                    <div className="flex items-center space-x-2 text-[#00FF66]">
                                        <span className="w-2.5 h-2.5 bg-[#00FF66] rounded-full inline-block animate-ping"></span>
                                        <h3 className="font-mono text-xs font-bold uppercase tracking-widest">TRANSACTION ARCHIVE UNLOCKED</h3>
                                    </div>
                                    <p className="text-sm font-semibold text-[#F9F9F9]">Your L3 Security Status allows immediate exposure of blinded asset entities.</p>
                                    <div className="font-mono text-[9px] text-[#888] space-y-1">
                                        <p>SHA-256 DIGITAL ID: {cryptoSignature}</p>
                                        <p>VERIFIED RESERVE LIMIT: ${verifiedBalance?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-mono text-[10px] text-[#888] uppercase tracking-widest">UNBLINDED ASSET MATCHES:</h4>
                                    <div className="space-y-3">
                                        {BLINDED_DEALS.map((deal) => (
                                            <div key={deal.id} className="border border-[#222] bg-[#090909] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#0EA5E9] transition-all">
                                                <div>
                                                    <span className="font-mono text-[9px] text-[#0EA5E9] uppercase tracking-widest">{deal.sector} // {deal.location}</span>
                                                    <h5 className="text-sm font-bold text-[#F9F9F9] mt-0.5">{deal.unblinded}</h5>
                                                    <p className="text-xs text-[#666] font-mono mt-1">Ref ID: {deal.id.toUpperCase()} // EBITDA: {deal.ebitda} ({deal.multiple})</p>
                                                </div>
                                                <button 
                                                    onClick={() => addLog(`EXPLICIT REQUEST ROUTED TO CIM SHELL FOR ${deal.unblinded.toUpperCase()}`, 'success')}
                                                    className="h-10 border border-[#00FF66] text-[#00FF66] font-mono text-[10px] px-4 hover:bg-[#00FF66] hover:text-black transition-all uppercase"
                                                >
                                                    DOWNLOAD SECURE CIM
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Operational Console Output (Terminal Log Interface) */}
                    <div className="border border-[#222222] bg-[#030303] flex flex-col h-48">
                        {/* Console Header */}
                        <div className="bg-[#090909] border-b border-[#222222] px-4 py-2 flex justify-between items-center shrink-0">
                            <span className="font-mono text-[9px] text-[#888] tracking-widest">CONSOLE LOG // COMPLIANCE SHELL OUTPUT</span>
                            <span className="font-mono text-[8px] text-[#00FF66] bg-[#00FF66]/10 px-1.5 py-0.5 uppercase">SYSTEM STREAM OK</span>
                        </div>
                        {/* Logs body */}
                        <div id="terminal-console" className="p-4 overflow-y-auto space-y-1.5 font-mono text-[10px] flex-grow leading-normal">
                            {logs.map((log) => {
                                let colorClass = 'text-[#888]';
                                if (log.type === 'system') colorClass = 'text-[#0EA5E9]';
                                if (log.type === 'success') colorClass = 'text-[#00FF66]';
                                if (log.type === 'warn') colorClass = 'text-[#FF3333]';
                                return (
                                    <div key={log.id} className={colorClass}>
                                        {log.text}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </section>
            </main>

            {/* Global Compliance Footer */}
            <footer className="w-full bg-[#080808] border-t border-[#222222] mt-auto">
                <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="max-w-4xl space-y-1">
                            <p className="font-mono text-[9px] text-[#666666] leading-relaxed">
                                Disclaimer: Under mutual cryptographic signature protocols, all disclosures logged are legally recognized under national digital execution standards. Simulated transaction indexes do not replace strict securities filings.
                            </p>
                            <p className="font-mono text-[8px] text-[#444444]">
                                SECURITY CLASSIFICATION: CLASS III DATA ACCESS GRANTED SPECIFICALLY TO AUTHORIZED ENTITY HOLDER ONLY.
                            </p>
                        </div>
                        <div className="flex space-x-2 shrink-0">
                            <span className="h-8 border border-[#222] bg-black px-3 py-1.5 flex items-center font-mono text-[8px] text-[#888] uppercase tracking-wider">
                                PLAID SHIELD CONNECTED
                            </span>
                            <span className="h-8 border border-[#222] bg-black px-3 py-1.5 flex items-center font-mono text-[8px] text-[#888] uppercase tracking-wider">
                                FINCEN DECRYPT VERIFIED
                            </span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
