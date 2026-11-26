document.addEventListener('DOMContentLoaded', () => {
    // Premium Neobrutalist Theme Styles matching base template
    const STYLES = {
        input: "bg-[#1E1E1E] border-2 border-[#2C2C2C] focus:border-[#00E676] focus:outline-none text-[#F4F3EF] p-3.5 font-mono text-sm w-full transition-all focus:neo-shadow-green rounded-none",
        select: "bg-[#1E1E1E] border-2 border-[#2C2C2C] focus:border-[#00E676] focus:outline-none text-[#F4F3EF] p-3.5 font-mono text-sm w-full transition-all focus:neo-shadow-green appearance-none cursor-pointer rounded-none",
        label: "block font-mono text-xs text-zinc-400 uppercase tracking-widest mb-2",
        btnPrimary: "bg-[#00E676] text-[#0D0D0D] font-display font-extrabold px-6 py-4 border-2 border-transparent hover:bg-black hover:text-[#00E676] hover:border-[#00E676] transition-all duration-200 neo-shadow-white flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider",
        btnSecondary: "bg-transparent text-[#F4F3EF] border-2 border-zinc-700 hover:border-[#F4F3EF] font-display font-bold px-6 py-4 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider",
        cardOption: "bg-[#1E1E1E] border-2 border-[#2C2C2C] p-4 font-mono text-xs text-zinc-300 hover:border-[#00E676] cursor-pointer transition-all flex flex-col gap-2 relative rounded-none select-none",
        cardOptionActive: "bg-[#1E1E1E] border-2 border-[#00E676] p-4 font-mono text-xs text-white cursor-pointer transition-all flex flex-col gap-2 relative rounded-none neo-shadow-green select-none"
    };

    const STORAGE_KEY = 'moonshine_funding_app_state';

    // Application state containing complete metadata & processing variables
    let state = {
        currentStep: 1,
        totalSteps: 6,
        score: 0,
        data: {
            companyName: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            entityType: '',
            timeInBusiness: '',
            industry: '',
            monthlyRevenue: '',
            avgBalance: '',
            creditScore: '',
            fundingAmount: '',
            useOfFunds: '',
            timeline: '',
            hasBusinessBank: '',
            hasID: false,
            hasStatements: false,
            hasTaxCert: false,
            agreedToTerms: false
        }
    };

    // Load progress from local memory cache
    function loadCachedState() {
        try {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                state.data = { ...state.data, ...parsed };
            }
        } catch (e) {
            console.warn("Failed parsing cached application configuration.", e);
        }
    }

    // Save current user metrics locally
    function saveStateCache() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
        } catch (e) {
            console.error("Local storage allocation limit exceeded.", e);
        }
    }

    // Clean tracking metrics memory cache
    function resetApplication() {
        localStorage.removeItem(STORAGE_KEY);
        state.currentStep = 1;
        state.data = {
            companyName: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            entityType: '',
            timeInBusiness: '',
            industry: '',
            monthlyRevenue: '',
            avgBalance: '',
            creditScore: '',
            fundingAmount: '',
            useOfFunds: '',
            timeline: '',
            hasBusinessBank: '',
            hasID: false,
            hasStatements: false,
            hasTaxCert: false,
            agreedToTerms: false
        };
        renderWizard();
    }

    // Live algorithmic system evaluator (Readiness Indicator)
    function calculateDiagnostics() {
        let sc = 10; // baseline

        // Revenue checks
        if (state.data.monthlyRevenue === 'over50k') sc += 30;
        else if (state.data.monthlyRevenue === '10to50k') sc += 20;
        else if (state.data.monthlyRevenue === 'under10k') sc += 5;

        // Time in business checks
        if (state.data.timeInBusiness === 'over3y') sc += 20;
        else if (state.data.timeInBusiness === '1to3y') sc += 15;
        else if (state.data.timeInBusiness === '6to12m') sc += 10;
        else if (state.data.timeInBusiness === 'under6m') sc += 2;

        // Ledger structure
        if (state.data.hasBusinessBank === 'yes') sc += 20;
        else if (state.data.hasBusinessBank === 'no') sc -= 15;

        // Credit score weights
        if (state.data.creditScore === '720plus') sc += 10;
        else if (state.data.creditScore === '660to719') sc += 7;
        else if (state.data.creditScore === '600to659') sc += 3;

        // Document compliance
        if (state.data.hasStatements) sc += 5;
        if (state.data.hasID) sc += 3;
        if (state.data.hasTaxCert) sc += 2;

        state.score = Math.max(0, Math.min(100, sc));
        return state.score;
    }

    // Generates localized diagnostic labels based on operational weight
    function getDiagnosticFeedback() {
        const score = calculateDiagnostics();
        if (score >= 80) {
            return {
                grade: "TIER-A PREMIUM",
                color: "text-[#00E676] border-[#00E676]/40 bg-emerald-950/20",
                desc: "Highest matching tier. Ideal alignment parameters for fast working capital & strategic asset release pathways.",
                pulse: "bg-[#00E676]"
            };
        } else if (score >= 50) {
            return {
                grade: "VIABLE RETAIL MATCH",
                color: "text-[#2979FF] border-[#2979FF]/40 bg-blue-950/20",
                desc: "Balanced framework detected. Direct options feasible pending PDF ledger upload validation and verification.",
                pulse: "bg-[#2979FF]"
            };
        } else if (score >= 25) {
            return {
                grade: "CONDITIONAL PROFILE",
                color: "text-[#FF6D00] border-[#FF6D00]/40 bg-orange-950/20",
                desc: "Early matching structures detect vulnerabilities. Recommended setup: Focus on business credit optimization tracks first.",
                pulse: "bg-[#FF6D00]"
            };
        } else {
            return {
                grade: "NON-COMPLIANT NODE",
                color: "text-zinc-500 border-zinc-800 bg-zinc-900/40",
                desc: "Core parameters fall under commercial threshold criteria. Recommended setup: Initial consultation path targeting structure alignment.",
                pulse: "bg-zinc-600"
            };
        }
    }

    // Core application form validation
    function validateStep(step) {
        const d = state.data;
        if (step === 1) {
            if (!d.companyName.trim()) return "Company legal / trading identity is required.";
            if (!d.firstName.trim() || !d.lastName.trim()) return "Full authorized signee name is required.";
            if (!d.email.trim() || !d.email.includes('@')) return "A valid primary secure email domain is required.";
            if (!d.phone.trim() || d.phone.length < 7) return "A clean direct mobile ledger phone coordinate is required.";
        } else if (step === 2) {
            if (!d.entityType) return "Select corporate structural status to proceed.";
            if (!d.timeInBusiness) return "Select historical operation duration metrics.";
            if (!d.industry) return "Identify functional commercial industry parameters.";
        } else if (step === 3) {
            if (!d.monthlyRevenue) return "Select verified gross billing average parameters.";
            if (!d.avgBalance) return "Define standard daily account balance parameters.";
            if (!d.creditScore) return "Define credit index metric profile.";
        } else if (step === 4) {
            if (!d.fundingAmount) return "Identify capital deployment volume parameters.";
            if (!d.useOfFunds) return "Specify core utility profile deployment intent.";
            if (!d.timeline) return "Specify tactical deployment schedule target.";
        } else if (step === 5) {
            if (!d.hasBusinessBank) return "Specify checking account architecture compliance status.";
        } else if (step === 6) {
            if (!d.agreedToTerms) return "Authorized baseline policy consent required.";
        }
        return null;
    }

    // Main layout renderer
    function renderWizard() {
        const container = document.getElementById('funding-wizard-container');
        if (!container) return;

        const diag = getDiagnosticFeedback();
        const score = calculateDiagnostics();

        // Template scaffolding
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <!-- Left: Application Engine -->
                <div class="lg:col-span-8 bg-[#0D0D0D] border-2 border-[#2C2C2C] p-6 sm:p-10 neo-shadow-black flex flex-col justify-between">
                    <div>
                        <!-- Header tracker -->
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1E1E1E] pb-6 mb-8">
                            <div>
                                <p class="text-[10px] font-mono text-[#00E676] uppercase tracking-widest leading-none">APPLICATION PIPELINE NODE</p>
                                <h2 class="font-display font-black text-2xl text-[#F4F3EF] mt-1.5 uppercase">Funding Pre-Qualification</h2>
                            </div>
                            <div class="flex items-center gap-2 font-mono text-xs">
                                <span class="text-zinc-500">STAGE</span>
                                <span class="text-[#00E676] bg-[#1E1E1E] px-2.5 py-1 border border-zinc-800 font-bold">${state.currentStep} // ${state.totalSteps}</span>
                            </div>
                        </div>

                        <!-- Progress Bar Segment Grid -->
                        <div class="grid grid-cols-6 gap-2 mb-8">
                            ${Array.from({ length: state.totalSteps }).map((_, i) => {
                                const active = i + 1 <= state.currentStep;
                                const isCurrent = i + 1 === state.currentStep;
                                return `
                                    <div class="h-2 border transition-all duration-300 ${
                                        isCurrent ? 'bg-[#00E676] border-[#00E676] neo-shadow-green' : 
                                        active ? 'bg-[#1E1E1E] border-zinc-500' : 'bg-transparent border-zinc-800'
                                    }"></div>
                                `;
                            }).join('')}
                        </div>

                        <!-- Step Specific Inputs Form Wrapper -->
                        <div id="step-content-area" class="min-h-[300px]">
                            ${renderStepContent()}
                        </div>
                    </div>

                    <!-- Footer System Controls -->
                    <div class="border-t border-[#1E1E1E] pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div class="flex items-center gap-3 w-full sm:w-auto">
                            ${state.currentStep > 1 ? `
                                <button id="prev-step-btn" class="${STYLES.btnSecondary} w-full sm:w-auto">
                                    <svg class="w-4 h-4 rotate-180 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                                    RETRACT
                                </button>
                            ` : `
                                <button onclick="window.history.back()" class="${STYLES.btnSecondary} w-full sm:w-auto">
                                    CANCEL APPLICATION
                                </button>
                            `}
                        </div>
                        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
                            ${state.currentStep < state.totalSteps ? `
                                <button id="next-step-btn" class="${STYLES.btnPrimary} w-full sm:w-auto">
                                    PROCEED
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                                </button>
                            ` : `
                                <button id="submit-app-btn" class="${STYLES.btnPrimary} w-full sm:w-auto bg-[#00E676] text-black">
                                    TRANSMIT TO SECURE NODE
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                                </button>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Right: Interactive Underwriting Diagnostics -->
                <div class="lg:col-span-4 bg-[#1E1E1E] border-2 border-zinc-800 p-6 flex flex-col justify-between neo-shadow-black">
                    <div>
                        <div class="border-b border-zinc-800 pb-4 mb-6 flex justify-between items-center">
                            <h3 class="font-display font-bold text-sm text-white uppercase tracking-wider">LIVE CO-DIAGNOSTICS</h3>
                            <span class="inline-flex w-2.5 h-2.5 rounded-full status-pulse ${diag.pulse}"></span>
                        </div>

                        <!-- Meter score display -->
                        <div class="my-6 text-center py-6 bg-[#0D0D0D] border border-zinc-800 relative overflow-hidden">
                            <div class="absolute inset-0 bg-[radial-gradient(#2c2c2c_1px,transparent_1px)] [background-size:12px_12px] opacity-25"></div>
                            <p class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest relative z-10">UNDERWRITING SCORE</p>
                            <p class="font-display font-black text-5xl text-[#F4F3EF] mt-2 relative z-10">${score}<span class="text-xs text-[#00E676] font-mono">/100</span></p>
                            <div class="mt-3 inline-block px-3 py-1 border text-[10px] font-mono uppercase tracking-widest font-bold relative z-10 ${diag.color}">
                                ${diag.grade}
                            </div>
                        </div>

                        <p class="text-xs text-zinc-400 font-mono leading-relaxed mb-6">
                            ${diag.desc}
                        </p>

                        <!-- State console visualization -->
                        <div class="border-t border-zinc-800 pt-6 mt-6">
                            <p class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-3">CONSOLIDATED PACKAGE MEMORY</p>
                            <div class="bg-black p-4 border border-zinc-800 rounded-none font-mono text-[11px] text-emerald-400/90 overflow-hidden text-ellipsis whitespace-nowrap space-y-1.5 h-[200px] overflow-y-auto">
                                <div><span class="text-zinc-600">// METRICS PROFILE BUFFER</span></div>
                                <div><span class="text-zinc-500">company_id:</span> ${state.data.companyName || "null"}</div>
                                <div><span class="text-zinc-500">applicant:</span> ${state.data.firstName || "null"} ${state.data.lastName || "null"}</div>
                                <div><span class="text-zinc-500">entity_type:</span> ${state.data.entityType || "null"}</div>
                                <div><span class="text-zinc-500">term_history:</span> ${state.data.timeInBusiness || "null"}</div>
                                <div><span class="text-zinc-500">gross_revenue:</span> ${state.data.monthlyRevenue || "null"}</div>
                                <div><span class="text-zinc-500">estimated_ficos:</span> ${state.data.creditScore || "null"}</div>
                                <div><span class="text-zinc-500">target_volume:</span> ${state.data.fundingAmount || "null"}</div>
                                <div><span class="text-zinc-500">dep_purpose:</span> ${state.data.useOfFunds || "null"}</div>
                                <div><span class="text-zinc-500">corporate_bank_acct:</span> ${state.data.hasBusinessBank || "null"}</div>
                                <div><span class="text-zinc-500">statements_provided:</span> ${state.data.hasStatements ? "true" : "false"}</div>
                                <div><span class="text-zinc-500">photo_id_uploaded:</span> ${state.data.hasID ? "true" : "false"}</div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-zinc-800 pt-6 mt-6 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span>PORTAL ENCRYPT: AES-256</span>
                        <button onclick="resetApplicationState()" class="hover:text-[#00E676] transition-colors uppercase underline">RESET SESSION</button>
                    </div>
                </div>
            </div>
        `;

        bindWizardEvents();
    }

    // Step-by-Step form dynamic rendering definitions
    function renderStepContent() {
        const d = state.data;
        switch (state.currentStep) {
            case 1:
                return `
                    <div class="space-y-6">
                        <p class="text-xs text-zinc-400 font-mono uppercase tracking-widest mb-2">// 01: Core Authority Coordinates</p>
                        <div class="grid grid-cols-1 gap-5">
                            <div>
                                <label class="${STYLES.label}">Entity Registered Corporate / Trading Identity</label>
                                <input type="text" id="input-companyName" value="${d.companyName}" placeholder="e.g. Acme Logistics Group LLC" class="${STYLES.input}">
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label class="${STYLES.label}">First Name</label>
                                    <input type="text" id="input-firstName" value="${d.firstName}" placeholder="Authorized Executive" class="${STYLES.input}">
                                </div>
                                <div>
                                    <label class="${STYLES.label}">Last Name</label>
                                    <input type="text" id="input-lastName" value="${d.lastName}" placeholder="Executive Surname" class="${STYLES.input}">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label class="${STYLES.label}">Secure Business Email</label>
                                    <input type="email" id="input-email" value="${d.email}" placeholder="corp@domain.com" class="${STYLES.input}">
                                </div>
                                <div>
                                    <label class="${STYLES.label}">Direct Desk Direct / Mobile Line</label>
                                    <input type="tel" id="input-phone" value="${d.phone}" placeholder="000-000-0000" class="${STYLES.input}">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            case 2:
                return `
                    <div class="space-y-6">
                        <p class="text-xs text-zinc-400 font-mono uppercase tracking-widest mb-2">// 02: Structural Operational Profile</p>
                        <div class="space-y-5">
                            <div>
                                <label class="${STYLES.label}">Corporate Structure Identity</label>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    ${['LLC', 'S-Corp', 'C-Corp', 'Sole Prop'].map(type => `
                                        <div onclick="setStepData('entityType', '${type}')" class="${d.entityType === type ? STYLES.cardOptionActive : STYLES.cardOption}">
                                            <span class="font-bold">${type}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div>
                                <label class="${STYLES.label}">Time In Commercial Active Deployment</label>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    ${[
                                        { val: 'under6m', txt: '< 6 Months' },
                                        { val: '6to12m', txt: '6-12 Months' },
                                        { val: '1to3y', txt: '1-3 Years' },
                                        { val: 'over3y', txt: '3+ Years' }
                                    ].map(item => `
                                        <div onclick="setStepData('timeInBusiness', '${item.val}')" class="${d.timeInBusiness === item.val ? STYLES.cardOptionActive : STYLES.cardOption}">
                                            <span class="font-bold">${item.txt}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div>
                                <label class="${STYLES.label}">Sector/Industry Focus</label>
                                <select id="input-industry" class="${STYLES.select}">
                                    <option value="" disabled ${!d.industry ? 'selected' : ''}>-- SELECT INDUSTRY --</option>
                                    ${['Construction & Trade Contracting', 'E-commerce & Global Retail', 'Medical & Professional Healthcare', 'Manufacturing & Hard Logistics', 'B2B Professional Agency services', 'SAAS & Hardware Technology', 'Specialized Hospitality & Venues', 'Other / Real Estate Portfolio'].map(ind => `
                                        <option value="${ind}" ${d.industry === ind ? 'selected' : ''}>${ind}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                    </div>
                `;
            case 3:
                return `
                    <div class="space-y-6">
                        <p class="text-xs text-zinc-400 font-mono uppercase tracking-widest mb-2">// 03: Performance Ledger Diagnostics</p>
                        <div class="space-y-5">
                            <div>
                                <label class="${STYLES.label}">Estimated Monthly Gross Balance Flow</label>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    ${[
                                        { val: 'under10k', txt: 'Less than $10,000' },
                                        { val: '10to50k', txt: '$10,000 - $50,000' },
                                        { val: 'over50k', txt: 'Over $50,000' }
                                    ].map(item => `
                                        <div onclick="setStepData('monthlyRevenue', '${item.val}')" class="${d.monthlyRevenue === item.val ? STYLES.cardOptionActive : STYLES.cardOption}">
                                            <span class="font-bold">${item.txt}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div>
                                <label class="${STYLES.label}">Average Core Daily Checking Balance</label>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    ${[
                                        { val: 'under2k', txt: 'Under $2,500' },
                                        { val: '2to10k', txt: '$2,500 - $10,000' },
                                        { val: 'over10k', txt: 'Over $10,000' }
                                    ].map(item => `
                                        <div onclick="setStepData('avgBalance', '${item.val}')" class="${d.avgBalance === item.val ? STYLES.cardOptionActive : STYLES.cardOption}">
                                            <span class="font-bold">${item.txt}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div>
                                <label class="${STYLES.label}">Estimated Personal Fico Reference Grade</label>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    ${[
                                        { val: '720plus', txt: 'Excellent (720+)' },
                                        { val: '660to719', txt: 'Good (660-719)' },
                                        { val: '600to659', txt: 'Fair (600-659)' },
                                        { val: 'under600', txt: 'Poor (<600)' }
                                    ].map(item => `
                                        <div onclick="setStepData('creditScore', '${item.val}')" class="${d.creditScore === item.val ? STYLES.cardOptionActive : STYLES.cardOption}">
                                            <span class="font-bold text-[11px]">${item.txt}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            case 4:
                return `
                    <div class="space-y-6">
                        <p class="text-xs text-zinc-400 font-mono uppercase tracking-widest mb-2">// 04: Project Blueprint Target Specification</p>
                        <div class="space-y-5">
                            <div>
                                <label class="${STYLES.label}">Required Financial Deployment Volume</label>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    ${[
                                        { val: 'under25k', txt: 'Up to $25,000' },
                                        { val: '25to100k', txt: '$25,000 - $100k' },
                                        { val: '100to250k', txt: '$100k - $250k' },
                                        { val: 'over250k', txt: '$250k+' }
                                    ].map(item => `
                                        <div onclick="setStepData('fundingAmount', '${item.val}')" class="${d.fundingAmount === item.val ? STYLES.cardOptionActive : STYLES.cardOption}">
                                            <span class="font-bold text-[11px]">${item.txt}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div>
                                <label class="${STYLES.label}">Main Objective Focus Profile</label>
                                <select id="input-useOfFunds" class="${STYLES.select}">
                                    <option value="" disabled ${!d.useOfFunds ? 'selected' : ''}>-- SELECT INTENDED USE --</option>
                                    ${['Bulk Inventory Acq / Vendor Discounting', 'High Capacity Plant Gear & Tooling', 'Growth Scaling Campaigns & Hiring', 'Commercial Bridge Cashflow Gaps', 'Real Estate Project Bridge / Acquisition', 'Establishing EIN-Level Credit Structure'].map(use => `
                                        <option value="${use}" ${d.useOfFunds === use ? 'selected' : ''}>${use}</option>
                                    `).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="${STYLES.label}">Target Integration Timeline Parameters</label>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    ${[
                                        { val: 'now', txt: 'Urgent (Immediate)' },
                                        { val: 'month', txt: 'Within 30 Days' },
                                        { val: 'planning', txt: 'Planning Stage' }
                                    ].map(item => `
                                        <div onclick="setStepData('timeline', '${item.val}')" class="${d.timeline === item.val ? STYLES.cardOptionActive : STYLES.cardOption}">
                                            <span class="font-bold">${item.txt}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            case 5:
                return `
                    <div class="space-y-6">
                        <p class="text-xs text-zinc-400 font-mono uppercase tracking-widest mb-2">// 05: Core Underwriting Document Status Check</p>
                        <div class="space-y-6">
                            <div>
                                <label class="${STYLES.label}">Do you possess a corporate commercial checking account (non-personal)?</label>
                                <div class="grid grid-cols-2 gap-4">
                                    <button type="button" onclick="setStepData('hasBusinessBank', 'yes')" class="p-4 border-2 font-mono text-sm uppercase tracking-wider transition-all rounded-none ${d.hasBusinessBank === 'yes' ? 'bg-[#00E676]/10 border-[#00E676] text-white neo-shadow-green' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700'}">
                                        YES // BUSINESS CHECKING
                                    </button>
                                    <button type="button" onclick="setStepData('hasBusinessBank', 'no')" class="p-4 border-2 font-mono text-sm uppercase tracking-wider transition-all rounded-none ${d.hasBusinessBank === 'no' ? 'bg-red-950/20 border-red-500 text-red-400' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700'}">
                                        NO // PERSONAL ONLY
                                    </button>
                                </div>
                            </div>

                            <div class="bg-zinc-900/60 border border-zinc-800 p-5 mt-6">
                                <p class="font-mono text-xs text-zinc-300 uppercase tracking-wider mb-4">Simulated Secure Ledger Attachment</p>
                                <p class="text-[11px] text-zinc-500 font-mono leading-relaxed mb-4">
                                    Real-time secure file pipelines can be bypassed during diagnostic phases. Flag the items you have currently exportable to PDF:
                                </p>
                                
                                <div class="space-y-3 font-mono text-xs">
                                    <label class="flex items-center gap-3 p-3 bg-[#1E1E1E] border border-zinc-800 cursor-pointer select-none">
                                        <input type="checkbox" id="check-hasStatements" ${d.hasStatements ? 'checked' : ''} class="w-4 h-4 text-[#00E676] bg-black border-zinc-700 focus:ring-0 rounded-none">
                                        <span class="text-zinc-300">3 Months Corporate Checking Ledgers (PDF)</span>
                                    </label>
                                    <label class="flex items-center gap-3 p-3 bg-[#1E1E1E] border border-zinc-800 cursor-pointer select-none">
                                        <input type="checkbox" id="check-hasID" ${d.hasID ? 'checked' : ''} class="w-4 h-4 text-[#00E676] bg-black border-zinc-700 focus:ring-0 rounded-none">
                                        <span class="text-zinc-300">Valid Authorized Signee Photo Identification</span>
                                    </label>
                                    <label class="flex items-center gap-3 p-3 bg-[#1E1E1E] border border-zinc-800 cursor-pointer select-none">
                                        <input type="checkbox" id="check-hasTaxCert" ${d.hasTaxCert ? 'checked' : ''} class="w-4 h-4 text-[#00E676] bg-black border-zinc-700 focus:ring-0 rounded-none">
                                        <span class="text-zinc-300">Corporate EIN Registration Cert / Business License</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            case 6:
                return `
                    <div class="space-y-6">
                        <p class="text-xs text-zinc-400 font-mono uppercase tracking-widest mb-2">// 06: Verification & Complete Package Transmission</p>
                        <div class="bg-[#1E1E1E] border border-zinc-800 p-5 font-mono text-xs text-zinc-300 leading-relaxed space-y-4">
                            <div class="flex items-center gap-2 text-[#00E676] font-bold">
                                <span>[✔] METRICS AND PARAMETERS LOCKED</span>
                            </div>
                            <p>
                                Your pre-qualification diagnostics indicates a <span class="text-[#00E676] font-bold underline">${calculateDiagnostics()}/100</span> compliance score. By signing this configuration protocol, you authorization verification checks through selection nodes and match criteria engines powered by Moonshine Capital.
                            </p>
                            <p class="text-[10px] text-zinc-500">
                                COMPLIANCE MEMO: This transmission does not execute formal hard inquiries on standard credit reporting layers. Verification procedures are calculated via secondary metrics vectors.
                            </p>
                        </div>

                        <div class="space-y-3 pt-4">
                            <label class="flex items-start gap-3 p-4 bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-900/80 cursor-pointer select-none">
                                <input type="checkbox" id="check-agreedToTerms" ${d.agreedToTerms ? 'checked' : ''} class="w-4 h-4 text-[#00E676] bg-black border-zinc-700 focus:ring-0 rounded-none mt-0.5">
                                <span class="font-mono text-[11px] text-zinc-400 leading-relaxed">
                                    I certify that I am the authorized executive representative of this corporate legal entity. I authorize Moonshine Capital and partner affiliates to verify files and provide programmatic program matchmaking structures.
                                </span>
                            </label>
                        </div>
                    </div>
                `;
            default:
                return ``;
        }
    }

    // Capture state modifications
    window.setStepData = function(metric, value) {
        state.data[metric] = value;
        saveStateCache();
        renderWizard();
    };

    // Clean execution reset helper
    window.resetApplicationState = function() {
        if (confirm("Proceed with resetting active evaluation memory caches?")) {
            resetApplication();
        }
    };

    // Events and input field data capture bindings
    function bindWizardEvents() {
        const d = state.data;

        // Step 1 input monitors
        const cName = document.getElementById('input-companyName');
        if (cName) cName.addEventListener('input', (e) => { d.companyName = e.target.value; saveStateCache(); });
        
        const fName = document.getElementById('input-firstName');
        if (fName) fName.addEventListener('input', (e) => { d.firstName = e.target.value; saveStateCache(); });

        const lName = document.getElementById('input-lastName');
        if (lName) lName.addEventListener('input', (e) => { d.lastName = e.target.value; saveStateCache(); });

        const email = document.getElementById('input-email');
        if (email) email.addEventListener('input', (e) => { d.email = e.target.value; saveStateCache(); });

        const phone = document.getElementById('input-phone');
        if (phone) phone.addEventListener('input', (e) => { d.phone = e.target.value; saveStateCache(); });

        // Step 2 input monitors
        const ind = document.getElementById('input-industry');
        if (ind) ind.addEventListener('change', (e) => { d.industry = e.target.value; saveStateCache(); renderWizard(); });

        // Step 4 input monitors
        const use = document.getElementById('input-useOfFunds');
        if (use) use.addEventListener('change', (e) => { d.useOfFunds = e.target.value; saveStateCache(); renderWizard(); });

        // Step 5 input monitors
        const sCh = document.getElementById('check-hasStatements');
        if (sCh) sCh.addEventListener('change', (e) => { d.hasStatements = e.target.checked; saveStateCache(); renderWizard(); });

        const idCh = document.getElementById('check-hasID');
        if (idCh) idCh.addEventListener('change', (e) => { d.hasID = e.target.checked; saveStateCache(); renderWizard(); });

        const txCh = document.getElementById('check-hasTaxCert');
        if (txCh) txCh.addEventListener('change', (e) => { d.hasTaxCert = e.target.checked; saveStateCache(); renderWizard(); });

        // Step 6 input monitors
        const trmCh = document.getElementById('check-agreedToTerms');
        if (trmCh) trmCh.addEventListener('change', (e) => { d.agreedToTerms = e.target.checked; saveStateCache(); renderWizard(); });

        // Step transition controllers
        const nextBtn = document.getElementById('next-step-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const err = validateStep(state.currentStep);
                if (err) {
                    alert(`VALIDATION CRITERIA EXCEPTION:\n\n${err}`);
                    return;
                }
                state.currentStep++;
                renderWizard();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        const prevBtn = document.getElementById('prev-step-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                state.currentStep--;
                renderWizard();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Final payload compilation & submission handler
        const submitBtn = document.getElementById('submit-app-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const err = validateStep(6);
                if (err) {
                    alert(`VALIDATION CRITERIA EXCEPTION:\n\n${err}`);
                    return;
                }

                // Simulate compilation and API processing packaging
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    TRANSMITTING METRICS SECTOR...
                `;

                setTimeout(() => {
                    // Inject success template interface
                    const container = document.getElementById('funding-wizard-container');
                    if (container) {
                        container.innerHTML = `
                            <div class="max-w-2xl mx-auto bg-[#0D0D0D] border-4 border-[#00E676] p-8 text-center neo-shadow-white py-12 relative overflow-hidden">
                                <div class="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                                <div class="relative z-10 space-y-6">
                                    <div class="w-16 h-16 bg-[#1E1E1E] border border-zinc-800 mx-auto flex items-center justify-center text-[#00E676]">
                                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                    </div>
                                    <p class="font-mono text-xs text-[#00E676] uppercase tracking-widest leading-none">NODE HANDSHAKE SUCCESSFUL</p>
                                    <h2 class="font-display font-black text-3xl uppercase tracking-tight text-[#F4F3EF]">Application Received</h2>
                                    <p class="text-zinc-400 font-mono text-xs leading-relaxed max-w-lg mx-auto">
                                        Your deployment profile has been securely compiled, tagged with verification indexes, and piped into the partner intake system. Secure diagnostic code generated: <span class="text-white font-bold font-mono">MC-${Math.floor(100000 + Math.random() * 900000)}</span>.
                                    </p>
                                    
                                    <div class="border-t border-zinc-800 pt-6 mt-6">
                                        <p class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Estimated Underwriting Call queue</p>
                                        <div class="inline-flex items-center gap-2 bg-[#1E1E1E] border border-zinc-800 text-[#F4F3EF] text-xs font-mono px-4 py-2">
                                            <span class="inline-block w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                                            <span>QUEUE POSITION: NEXT IN BOUNDS (15-30 MIN EST.)</span>
                                        </div>
                                    </div>

                                    <div class="pt-6">
                                        <button onclick="window.location.reload()" class="${STYLES.btnPrimary} mx-auto">
                                            Return to Portal Node
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    localStorage.removeItem(STORAGE_KEY);
                }, 2000);
            });
        }
    }

    // Initial load parameters and validation pipeline startup
    loadCachedState();
    renderWizard();
});