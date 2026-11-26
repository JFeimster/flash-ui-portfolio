document.addEventListener("DOMContentLoaded", () => {
    // 1. Target parent container to append the Consultation Desk
    const mainContainer = document.querySelector('.max-w-7xl');
    if (!mainContainer) return;

    // 2. State management
    let selectedAdvisor = null;
    let selectedDate = new Date().toISOString().split('T')[0];
    let selectedSlot = null;

    // 3. Define Advisor Data
    const advisors = [
        {
            id: 'path-a',
            name: 'Lyra Vance',
            role: 'SaaS RBF Optimization Lead',
            specialty: 'Path A (Revenue-Based)',
            avatar: '⚡',
            accent: 'neoMagenta',
            shadow: 'shadow-brutal-pink',
            capabilities: ['Micro-Drawdown Calibration', 'LTV/CAC Multiplier Audit', 'MRR Run-rate Validation'],
            bio: 'Formulated allocation models for 150+ high-growth SaaS protocols. Specializes in optimizing capital extraction without triggering valuation downgrades.',
            timeSlots: ['09:00 AM UTC', '11:30 AM UTC', '02:00 PM UTC', '04:30 PM UTC']
        },
        {
            id: 'path-b',
            name: 'Jaxson Sterling',
            role: 'Venture Debt Structural Architect',
            specialty: 'Path B (Growth Venture Debt)',
            avatar: '◆',
            accent: 'neoTeal',
            shadow: 'shadow-brutal-teal',
            capabilities: ['Covenant Insulation', 'Warrant Coverage Negotiation', 'Equity Tranche Structuring'],
            bio: 'Former risk officer for tier-one tech debt syndicates. Specializes in multi-million dollar venture capital integrations with strict non-dilution guards.',
            timeSlots: ['10:00 AM UTC', '01:00 PM UTC', '03:30 PM UTC', '05:00 PM UTC']
        },
        {
            id: 'path-c',
            name: 'Evelyn Thorne',
            role: 'Sovereign-Backed Compliance Officer',
            specialty: 'Path C (SBA 7(a) Term Loan)',
            avatar: '▲',
            accent: 'neoYellow',
            shadow: 'shadow-brutal-yellow',
            capabilities: ['Federal Auditing Shield', 'Personal Asset Guarantee Protection', 'Tax Record Extraction'],
            bio: '20+ years of institutional treasury operations. Translates complex federal compliance frameworks into executable capital pathways.',
            timeSlots: ['08:30 AM UTC', '11:00 AM UTC', '01:30 PM UTC', '03:00 PM UTC']
        }
    ];

    // 4. Inject Dynamic Section Container
    const deskSection = document.createElement('section');
    deskSection.id = 'advisor-consultation-desk';
    deskSection.className = 'mt-16 pt-12 border-t-4 border-black space-y-8';
    deskSection.innerHTML = `
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b-4 border-black">
            <div class="space-y-2">
                <div class="inline-flex items-center gap-2">
                    <span class="px-2.5 py-1 text-[10px] font-black bg-neoYellow text-black border-2 border-black uppercase tracking-wider shadow-brutal-white-sm">
                        SECURE ROUTING DESK
                    </span>
                    <span class="text-xs font-mono font-bold text-neoYellow">// EXPERT ACCESS LAYER</span>
                </div>
                <h2 class="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
                    CONSULTATION <span class="text-transparent bg-clip-text bg-gradient-to-r from-neoTeal to-neoLime">DESK</span>
                </h2>
                <p class="text-xs md:text-sm text-zinc-400 font-semibold max-w-xl">
                    Deploy your simulated variables directly into a live consultation pipeline. Book 1-on-1 sessions with system architects specialized in your chosen pathways.
                </p>
            </div>
            <div class="bg-black border-2 border-zinc-800 p-3 flex items-center gap-3">
                <span class="h-2 w-2 rounded-full bg-neoLime animate-pulse"></span>
                <span class="text-xs font-mono font-black text-zinc-400 uppercase tracking-widest">3 OPERATORS ONLINE & READY</span>
            </div>
        </div>

        <!-- Main Desk Layout (Split Screen) -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            <!-- Left Side: Interactive Advisor Roster -->
            <div class="xl:col-span-8 space-y-6" id="advisor-cards-container">
                <!-- Injected dynamically below -->
            </div>

            <!-- Right Side: Live Briefing Generator & Booking Panel -->
            <div class="xl:col-span-4 space-y-6">
                <!-- Dynamic Setup Form Briefing -->
                <div class="bg-brutalCard border-4 border-black p-6 shadow-brutal-white relative overflow-hidden flex flex-col justify-between min-h-[420px]">
                    <div class="absolute top-0 right-0 bg-neoMagenta text-black text-[9px] font-black px-2 py-0.5 border-b-2 border-l-2 border-black uppercase tracking-wider">
                        DIAGNOSTIC ENGINE
                    </div>
                    
                    <div class="space-y-4">
                        <h3 class="text-lg font-black text-white uppercase tracking-tight border-b-2 border-black pb-2">
                            PREP-FORM GENERATOR
                        </h3>
                        
                        <!-- Reactive User Capital Parameters -->
                        <div class="bg-black border-2 border-zinc-800 p-3 font-mono text-xs space-y-2">
                            <div class="flex justify-between">
                                <span class="text-zinc-500">REQUEST TARGET:</span>
                                <span class="text-neoYellow font-bold" id="brief-funding-amt">$0</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-zinc-500">LEVERAGE LEVEL:</span>
                                <span class="text-white font-bold" id="brief-leverage-rating">COMPUTING...</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-zinc-500">SYSTEM THRESHOLD:</span>
                                <span class="font-bold" id="brief-compliance-status">PENDING</span>
                            </div>
                        </div>

                        <!-- Interactive Questionnaire Checklist -->
                        <div class="space-y-2">
                            <span class="text-xs font-black text-zinc-400 uppercase tracking-wider block">Verifiable Core Criteria</span>
                            <div class="space-y-2 text-xs">
                                <label class="flex items-start gap-2.5 cursor-pointer select-none">
                                    <input type="checkbox" id="chk-api" checked class="mt-0.5 accent-neoTeal border-2 border-black h-4 w-4 bg-black rounded-none">
                                    <span class="text-zinc-300 font-semibold">Enable secure read-only core API metrics sync</span>
                                </label>
                                <label class="flex items-start gap-2.5 cursor-pointer select-none">
                                    <input type="checkbox" id="chk-guarantees" class="mt-0.5 accent-neoTeal border-2 border-black h-4 w-4 bg-black rounded-none">
                                    <span class="text-zinc-300 font-semibold">Agree to simulate non-disclosure data pipelines</span>
                                </label>
                            </div>
                        </div>

                        <div class="bg-zinc-950 p-3 border border-zinc-800 text-[11px] text-zinc-400 font-mono space-y-1.5" id="assessment-verdict">
                            <!-- Dynamic evaluation injection -->
                        </div>
                    </div>

                    <!-- Generate Button -->
                    <button id="btn-generate-brief" class="w-full mt-4 py-3 bg-neoLime hover:bg-black text-black hover:text-neoLime font-black text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150">
                        ⚡ BUILD SECURE BRIEFING DOSSIER
                    </button>
                </div>
            </div>

        </div>

        <!-- Injected Booking Modal -->
        <div id="booking-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
            <div class="bg-brutalCard border-4 border-black max-w-lg w-full p-6 shadow-brutal-pink relative space-y-6">
                <!-- Close Button -->
                <button id="close-modal" class="absolute top-4 right-4 bg-neoMagenta hover:bg-black text-black hover:text-neoMagenta font-black border-2 border-black h-8 w-8 flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                    ✖
                </button>
                
                <div class="space-y-2">
                    <span class="px-2 py-0.5 text-[9px] font-mono font-black bg-neoMagenta text-white border-2 border-black uppercase tracking-wider">
                        SYSTEM TERMINAL
                    </span>
                    <h3 class="text-2xl font-black text-white uppercase tracking-tight">
                        SCHEDULE ADVISOR DISPATCH
                    </h3>
                    <p class="text-xs text-zinc-400 font-bold">
                        Assign secure consultation block. Synchronizing with operator node.
                    </p>
                </div>

                <!-- Advisor Profile Preview -->
                <div class="bg-zinc-950 border-2 border-black p-4 flex items-center gap-4">
                    <span id="modal-advisor-avatar" class="text-3xl p-3 bg-black border-2 border-zinc-800 rounded-none">⚡</span>
                    <div>
                        <h4 id="modal-advisor-name" class="font-black text-white text-base">Advisor Name</h4>
                        <p id="modal-advisor-role" class="text-xs text-neoTeal font-bold">Specialist Role</p>
                    </div>
                </div>

                <!-- Date & Slot Selectors -->
                <div class="space-y-4">
                    <div class="space-y-1.5">
                        <label class="text-xs font-black text-zinc-400 uppercase tracking-wider block">Set Targeting Date</label>
                        <input type="date" id="booking-date" class="w-full bg-black border-2 border-zinc-700 text-white font-mono p-2 text-xs focus:outline-none focus:border-neoTeal rounded-none">
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-black text-zinc-400 uppercase tracking-wider block">Select Transmission Window</label>
                        <div id="slots-grid" class="grid grid-cols-2 gap-2">
                            <!-- Populated on advisor select -->
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <button id="btn-confirm-booking" class="w-full py-4 bg-neoTeal hover:bg-black text-black hover:text-neoTeal font-black text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                    COMMIT APPOINTMENT LOCK
                </button>
            </div>
        </div>

        <!-- Injected Dossier Download / View Modal -->
        <div id="dossier-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
            <div class="bg-black border-4 border-black max-w-2xl w-full p-6 shadow-brutal-lime relative space-y-6">
                <!-- Close Button -->
                <button id="close-dossier" class="absolute top-4 right-4 bg-neoLime hover:bg-black text-black hover:text-neoLime font-black border-2 border-black h-8 w-8 flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                    ✖
                </button>

                <div class="space-y-2">
                    <span class="px-2.5 py-1 text-xs font-mono font-black bg-neoLime text-black border-2 border-black uppercase tracking-wider">
                        DOSSIER EXECUTED // DECLASSIFIED
                    </span>
                    <h3 class="text-2xl font-black text-white uppercase tracking-tight">
                        SYSTEM PREP DOSSIER
                    </h3>
                </div>

                <textarea id="dossier-content" readonly class="w-full h-80 bg-zinc-950 border-2 border-zinc-800 text-neoLime p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed"></textarea>

                <div class="flex flex-col sm:flex-row gap-3">
                    <button id="btn-copy-dossier" class="flex-1 py-3 bg-neoLime hover:bg-zinc-900 text-black hover:text-neoLime font-black text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">
                        COPY DOSSIER TO CLIPBOARD
                    </button>
                    <button id="btn-close-dossier-panel" class="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-wider border-2 border-zinc-700">
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    `;

    mainContainer.appendChild(deskSection);

    // 5. Render Advisor Cards Dynamically
    const renderAdvisors = () => {
        const container = document.getElementById('advisor-cards-container');
        if (!container) return;

        container.innerHTML = advisors.map(adv => {
            const isPathA = adv.id === 'path-a';
            const isPathB = adv.id === 'path-b';
            const isPathC = adv.id === 'path-c';

            return `
                <div class="bg-brutalCard border-4 border-black p-6 ${adv.shadow} hover:-translate-y-1 transition-all duration-200 relative group flex flex-col justify-between gap-6">
                    <div class="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div class="flex items-start gap-4">
                            <!-- Advisor Indicator Emblem -->
                            <div class="h-14 w-14 shrink-0 flex items-center justify-center border-4 border-black font-black text-2xl font-mono shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]
                                ${isPathA ? 'bg-neoMagenta text-white' : ''}
                                ${isPathB ? 'bg-neoTeal text-black' : ''}
                                ${isPathC ? 'bg-neoYellow text-black' : ''}">
                                ${adv.avatar}
                            </div>
                            <div class="space-y-1">
                                <span class="text-[10px] font-mono font-black uppercase text-zinc-500 tracking-wider">
                                    ${adv.specialty}
                                </span>
                                <h3 class="text-xl font-black text-white uppercase tracking-tight group-hover:text-neoTeal transition-colors">
                                    ${adv.name}
                                </h3>
                                <p class="text-xs font-mono font-bold text-zinc-400">
                                    ${adv.role}
                                </p>
                            </div>
                        </div>

                        <!-- Badge -->
                        <span class="text-[9px] font-black px-2.5 py-1 bg-black border-2 border-zinc-800 uppercase tracking-widest text-zinc-400">
                            SPECIALIST APPROVED
                        </span>
                    </div>

                    <!-- Bio -->
                    <p class="text-xs text-zinc-300 leading-relaxed font-semibold">
                        ${adv.bio}
                    </p>

                    <!-- Technical Matrix Capabilities -->
                    <div class="space-y-2 border-t border-zinc-900 pt-4">
                        <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">CORE SYSTEM COMPLEMENTS:</span>
                        <div class="flex flex-wrap gap-2">
                            ${adv.capabilities.map(cap => `
                                <span class="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
                                    ● ${cap}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Dispatch Booking trigger button -->
                    <div class="pt-2">
                        <button data-advisor-id="${adv.id}" class="btn-book-advisor w-full py-3 bg-zinc-900 hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150">
                            REQUEST CONSULTATION WINDOW
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    };

    // 6. Set up Assessment and Metric Tracking
    const fundingSlider = document.getElementById('funding-slider');
    const briefAmt = document.getElementById('brief-funding-amt');
    const briefLeverage = document.getElementById('brief-leverage-rating');
    const briefCompliance = document.getElementById('brief-compliance-status');
    const assessmentVerdict = document.getElementById('assessment-verdict');

    const updateMetricsDisplay = () => {
        if (!fundingSlider) return;
        const value = parseInt(fundingSlider.value);
        
        // Update dossier template variables
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
        
        if (briefAmt) briefAmt.textContent = formatter.format(value);

        // Compute relative dynamic metrics
        let riskLevel = 'LOW';
        let thresholdColor = 'text-neoLime border-neoLime';
        let statusText = 'STANDARD RANGE APPROVED';
        let assessmentMsg = 'Current requested parameters are within normal enterprise thresholds.';

        if (value > 5000000) {
            riskLevel = 'EXTREME';
            thresholdColor = 'text-[#ff0055] border-[#ff0055]';
            statusText = 'HIGH CONTINGENT EXPOSURE';
            assessmentMsg = '<span class="text-[#ff0055] font-black">WARNING:</span> Request exceeds limits for Path A (RBF) and Path C (SBA). Venture Debt path negotiation suggested.';
        } else if (value > 2500000) {
            riskLevel = 'MEDIUM';
            thresholdColor = 'text-neoYellow border-neoYellow';
            statusText = 'COVENANT VERIFICATION REQUIRED';
            assessmentMsg = 'Balanced risk footprint. Leverage matches baseline capital parameters. Audit queues normal.';
        }

        if (briefLeverage) {
            briefLeverage.textContent = riskLevel;
            briefLeverage.className = `font-bold ${value > 5000000 ? 'text-[#ff0055]' : value > 2500000 ? 'text-neoYellow' : 'text-neoLime'}`;
        }

        if (briefCompliance) {
            briefCompliance.textContent = statusText;
            briefCompliance.className = `font-bold ${value > 5000000 ? 'text-[#ff0055]' : value > 2500000 ? 'text-neoYellow' : 'text-neoLime'}`;
        }

        if (assessmentVerdict) {
            assessmentVerdict.innerHTML = `
                <div class="flex items-center gap-1.5 font-bold mb-1">
                    <span class="w-1.5 h-1.5 rounded-full ${value > 5000000 ? 'bg-[#ff0055]' : value > 2500000 ? 'bg-neoYellow' : 'bg-neoLime'}"></span>
                    <span>ENGINE ASSESSMENTS:</span>
                </div>
                <p class="font-semibold text-zinc-400">${assessmentMsg}</p>
            `;
        }
    };

    // Listen directly to user capital selections on index.html
    if (fundingSlider) {
        fundingSlider.addEventListener('input', updateMetricsDisplay);
    }
    
    // Initial run
    updateMetricsDisplay();
    renderAdvisors();

    // 7. Modal Controls
    const bookingModal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalAdvisorAvatar = document.getElementById('modal-advisor-avatar');
    const modalAdvisorName = document.getElementById('modal-advisor-name');
    const modalAdvisorRole = document.getElementById('modal-advisor-role');
    const slotsGrid = document.getElementById('slots-grid');
    const bookingDateInput = document.getElementById('booking-date');
    const confirmBookingBtn = document.getElementById('btn-confirm-booking');

    // Handle Open Appointment Booking Modal
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.btn-book-advisor');
        if (!target) return;

        const advId = target.getAttribute('data-advisor-id');
        const adv = advisors.find(a => a.id === advId);
        if (!adv) return;

        selectedAdvisor = adv;
        selectedSlot = null;

        // Set advisor information in modal
        if (modalAdvisorName) modalAdvisorName.textContent = adv.name;
        if (modalAdvisorRole) modalAdvisorRole.textContent = adv.role;
        if (modalAdvisorAvatar) {
            modalAdvisorAvatar.textContent = adv.avatar;
            modalAdvisorAvatar.className = `text-3xl p-3 bg-black border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]`;
        }

        // Populating calendar slot buttons
        if (slotsGrid) {
            slotsGrid.innerHTML = adv.timeSlots.map(slot => `
                <button class="slot-btn py-2 border-2 border-black bg-zinc-900 hover:bg-neoTeal hover:text-black text-white text-xs font-mono font-bold transition-all" data-slot="${slot}">
                    ${slot}
                </button>
            `).join('');
        }

        // Show Modal
        if (bookingModal) {
            bookingModal.classList.remove('hidden');
            bookingModal.classList.add('flex');
        }
    });

    // Handle Slot selection inside Modal
    if (slotsGrid) {
        slotsGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.slot-btn');
            if (!btn) return;

            // Remove active classes from all
            document.querySelectorAll('.slot-btn').forEach(b => {
                b.classList.remove('bg-neoTeal', 'text-black');
                b.classList.add('bg-zinc-900', 'text-white');
            });

            // Set current
            btn.classList.remove('bg-zinc-900', 'text-white');
            btn.classList.add('bg-neoTeal', 'text-black');
            selectedSlot = btn.getAttribute('data-slot');
        });
    }

    // Modal Closes
    const closeModal = () => {
        if (bookingModal) {
            bookingModal.classList.remove('flex');
            bookingModal.classList.add('hidden');
        }
    };
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    // Confirm Appointment Lock
    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', () => {
            if (!selectedSlot) {
                alert("CRITICAL WARNING: No Transmission Window selected. Please highlight a slot first.");
                return;
            }

            const chosenDate = bookingDateInput ? bookingDateInput.value : selectedDate;
            
            // Simulating successful scheduler reservation block
            alert(`SYSTEM DISPATCH OK: Consultation initialized with ${selectedAdvisor.name}.\nDate: ${chosenDate}\nTime Window: ${selectedSlot}\nSecure workspace briefing loaded.`);
            closeModal();
        });
    }

    // 8. Dynamic Dossier Generator
    const btnGenerateBrief = document.getElementById('btn-generate-brief');
    const dossierModal = document.getElementById('dossier-modal');
    const closeDossierBtn = document.getElementById('close-dossier');
    const closeDossierPanelBtn = document.getElementById('btn-close-dossier-panel');
    const copyDossierBtn = document.getElementById('btn-copy-dossier');
    const dossierContent = document.getElementById('dossier-content');

    if (btnGenerateBrief) {
        btnGenerateBrief.addEventListener('click', () => {
            if (!fundingSlider) return;
            const fundingValue = parseInt(fundingSlider.value);
            const formattedVal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(fundingValue);

            const hasApiEnabled = document.getElementById('chk-api')?.checked ?? false;
            const hasAgreedNd = document.getElementById('chk-guarantees')?.checked ?? false;

            // Generate Markdown dynamic transcript template
            const doc = `=======================================================
NEO-FINANCIAL PROTOCOL // DOCK DOSSIER IDENTIFICATION v4.1
GENERATED: ${new Date().toUTCString()}
SECURITY CLASSIFICATION: CO-INTERNAL INTEL
=======================================================

[1] SIMULATED TRANSACTION METRICS
----------------------------------
* TARGETED ALLOCATION CAPITAL: ${formattedVal}
* RISK PARAMETER: ${fundingValue > 5000000 ? 'CRITICAL CEILING COMPLIANCE WARNING' : fundingValue > 2500000 ? 'ELEVATED AUDIT STAGE' : 'PASSTHROUGH SAFE'}
* SYSTEM EVAL STATUS: ${fundingValue > 5000000 ? 'SaaS & SBA EXCEEDED -> ARCHITECT DIRECTIVE APPLIED' : 'STANDARD CAP MATRIX SECURE'}

[2] INTEGRATION ACCESS PARAMETERS
----------------------------------
* CORE REAL-TIME API ACCESS: ${hasApiEnabled ? 'ACTIVE / AUTHORIZED' : 'INACTIVE / RESTRICTED'}
* SECURE SIMULATED PIPELINE COMPLIANCE: ${hasAgreedNd ? 'AUTHORIZED AGREED' : 'UNVERIFIED PENDING'}

[3] RECOMMENDATIONS & NEXT STEP STRUCTURING
----------------------------------
${fundingValue > 5000000 
  ? `CRITICAL COMPLIANCE STRATEGY: 
Your requested parameter exceeds standard non-dilutive parameters. 
Your consultation must prioritize Growth Venture Debt structural templates (Path B).
Prepare audit metrics, including complete standard Quality of Earnings matrix, cap table, and user cohorts.`
  : `OPTIMIZED TRACK STRATEGY:
Parameters fit within multiple dynamic channels. 
We advise deploying the SaaS Revenue-Based Track (Path A) first to preserve core equity sovereignty. 
Maintain manual compliance integration pipeline logs.`
}

=======================================================
SECURE COOP DESK ASSIGNMENT DIRECTIVE // TERMINAL LOG END`;

            if (dossierContent) dossierContent.value = doc;

            if (dossierModal) {
                dossierModal.classList.remove('hidden');
                dossierModal.classList.add('flex');
            }
        });
    }

    // Close Dossier Visualizer
    const closeDossierPanel = () => {
        if (dossierModal) {
            dossierModal.classList.remove('flex');
            dossierModal.classList.add('hidden');
        }
    };
    if (closeDossierBtn) closeDossierBtn.addEventListener('click', closeDossierPanel);
    if (closeDossierPanelBtn) closeDossierPanelBtn.addEventListener('click', closeDossierPanel);

    // Copy Dossier text parameters
    if (copyDossierBtn && dossierContent) {
        copyDossierBtn.addEventListener('click', () => {
            dossierContent.select();
            dossierContent.setSelectionRange(0, 99999); // mobile compatibility
            navigator.clipboard.writeText(dossierContent.value).then(() => {
                alert("DOSSIER COPIED TO LOCAL CLIPBOARD SYSTEM.");
            }).catch(err => {
                console.error('Failure executing clipboard pipeline write', err);
            });
        });
    }

});