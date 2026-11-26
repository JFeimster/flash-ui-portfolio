/**
 * Moonshine Partner Profile Engine - Funding Route Matcher Tool
 * Version: 1.1.2_TACTICAL
 * File: tools/matcher/matcher.js
 * 
 * High-fidelity, neobrutalist interactive qualification tool.
 * Guides prospective business owners through dynamic validation criteria
 * and calculates precise funding matches with localized partner attribution.
 */

(function () {
    // 1. STABLE PARTNER DIRECTORY DEFINITIONS (Matches Base Engine Spec)
    const PARTNERS = {
        'darwin-hanneman': { name: 'Darwin Hanneman', id: 'DN-04', role: 'Local Business Funding Partner', focus: 'Main Street & SBA' },
        'amanda-sterling': { name: 'Amanda Sterling', id: 'AS-09', role: 'Ecommerce Funding Specialist', focus: 'Revenue-Based' },
        'jackson-vance': { name: 'Jackson Vance', id: 'JV-22', role: 'Contractor Funding Partner', focus: 'Invoice & Trades' },
        'helena-rostova': { name: 'Helena Rostova', id: 'HR-71', role: 'Real Estate Investor Partner', focus: 'CRE & Bridge Debt' },
        'tyler-oconnell': { name: 'Tyler O\'Connell', id: 'TO-14', role: 'Business Credit Prep Partner', focus: 'Unsecured Lines' },
        'jordan-blake': { name: 'Jordan Blake', id: 'JB-56', role: 'Online Wholesale Specialist', focus: 'Inventory Advances' },
        'devon-streeter': { name: 'Devon Streeter', id: 'DS-01', role: 'Authorized Funding Desk', focus: 'SBA & Revenue Matched' }
    };

    // 2. FUNDING PROGRAM SCHEMA
    const PROGRAMS = [
        {
            code: 'SBA-7A',
            name: 'SBA 7(a) Bridge Premium',
            type: 'Institutional Term Debt',
            minScore: 680,
            minTimeInBiz: 24, // months
            minRevenue: 25000, // monthly
            matchWeight: 0.95,
            accentColor: '#004BFF', // brand blue
            checklist: ['3 Yrs Tax Returns', 'P&L Statement', 'Debt Schedule', 'FICO > 680'],
            description: 'Government backed program optimized for long-term real estate acquisition, refinancing, or major corporate acquisitions.'
        },
        {
            code: 'REV-FIN',
            name: 'Dynamic Revenue-Based Capital',
            type: 'Non-Dilutive Growth Funding',
            minScore: 600,
            minTimeInBiz: 6,
            minRevenue: 15000,
            matchWeight: 0.90,
            accentColor: '#00FF66', // brand green
            checklist: ['6 Months Bank Docs', 'Linked Shopify/Stripe/Processor', 'Active Merchant ID'],
            description: 'Scale marketing, purchase inventory, or cover operating runs without strict personal credit underwriting hurdles.'
        },
        {
            code: 'MCA-RAPID',
            name: 'Tactical Merchant Cash Advance',
            type: 'Working Capital Advance',
            minScore: 500,
            minTimeInBiz: 3,
            minRevenue: 10000,
            matchWeight: 0.85,
            accentColor: '#FF5500', // brand orange
            checklist: ['3 Months Bank Docs', 'ID Verification', 'Voided Business Check'],
            description: 'High-speed cash liquidity based on historical debit/credit sales cycles. Deployed within 24-48 business hours.'
        },
        {
            code: 'INVOICE-FACT',
            name: 'Invoice Factoring & A/R Lines',
            type: 'Accounts Receivable Leverage',
            minScore: 580,
            minTimeInBiz: 1,
            minRevenue: 20000,
            matchWeight: 0.88,
            accentColor: '#E5E5E5', // brand chrome
            checklist: ['A/R Aging Ledger', 'Outstanding Invoices', 'Commercial Debtor List'],
            description: 'Transform unpaid corporate customer invoices into instant liquidity. Underwritten primarily on debtor strength.'
        }
    ];

    // 3. CORE STATE ENGINE
    let state = {
        step: 0,
        partner: null,
        inputs: {
            revenue: 0,
            credit: 0,
            timeInBiz: 0,
            industry: '',
            useCase: ''
        },
        results: []
    };

    // Extract dynamic partner context from execution parameters
    function resolvePartner() {
        const urlParams = new URLSearchParams(window.location.search);
        let partnerSlug = urlParams.get('partner') || urlParams.get('ref') || 'devon-streeter';
        partnerSlug = partnerSlug.toLowerCase();
        state.partner = PARTNERS[partnerSlug] || PARTNERS['devon-streeter'];
    }

    // Dynamic styles injecting to ensure pixel-perfect neobrutalist presentation
    function injectStyles() {
        if (document.getElementById('moonshine-matcher-styles')) return;
        const styles = document.createElement('style');
        styles.id = 'moonshine-matcher-styles';
        styles.textContent = `
            .matcher-input-btn {
                background: #121214;
                color: #F3F3F3;
                border: 2px solid #2A2A30;
                box-shadow: 4px 4px 0px #1E1E22;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .matcher-input-btn:hover, .matcher-input-btn.selected {
                border-color: #00FF66;
                color: #00FF66;
                box-shadow: 4px 4px 0px rgba(0, 255, 102, 0.2);
                transform: translate(-1px, -1px);
            }
            .matcher-input-btn.selected {
                background: rgba(0, 255, 102, 0.04);
            }
            .step-node.active {
                background: #00FF66;
                color: #0A0A0C;
                border-color: #00FF66;
            }
            .glow-pulse {
                box-shadow: 0 0 15px rgba(0, 255, 102, 0.15);
            }
        `;
        document.head.appendChild(styles);
    }

    // Main layout framework HTML template
    function buildSkeleton() {
        return `
            <div class="relative bg-brand-darkGray border-2 border-brand-borderGray p-6 shadow-[8px_8px_0px_#1E1E22] max-w-2xl mx-auto font-sans text-brand-bone overflow-hidden">
                <!-- Telemetry Header -->
                <div class="flex justify-between items-center border-b border-brand-borderGray pb-3 mb-6">
                    <div class="flex items-center space-x-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse"></span>
                        <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">DIAGNOSTIC ENGINE: v1.1 // MATCH MATRIX</span>
                    </div>
                    <div class="text-[9px] font-mono bg-brand-graphite px-2 py-0.5 border border-brand-borderGray text-zinc-400">
                        REF_ID: <span class="text-brand-green uppercase font-bold" id="telemetry-ref">${state.partner.id}</span>
                    </div>
                </div>

                <!-- Active Step Visual Bar -->
                <div class="flex items-center space-x-2 mb-6" id="progress-bar">
                    <div class="step-node w-6 h-6 rounded-none border border-brand-borderGray flex items-center justify-center font-mono text-xs text-zinc-500 font-bold active" data-step="0">1</div>
                    <div class="h-0.5 flex-1 bg-brand-borderGray"></div>
                    <div class="step-node w-6 h-6 rounded-none border border-brand-borderGray flex items-center justify-center font-mono text-xs text-zinc-500 font-bold" data-step="1">2</div>
                    <div class="h-0.5 flex-1 bg-brand-borderGray"></div>
                    <div class="step-node w-6 h-6 rounded-none border border-brand-borderGray flex items-center justify-center font-mono text-xs text-zinc-500 font-bold" data-step="2">3</div>
                    <div class="h-0.5 flex-1 bg-brand-borderGray"></div>
                    <div class="step-node w-6 h-6 rounded-none border border-brand-borderGray flex items-center justify-center font-mono text-xs text-zinc-500 font-bold" data-step="3">4</div>
                </div>

                <!-- Attribution Sub-Header -->
                <div class="bg-brand-black border border-brand-borderGray p-3 mb-6 flex items-center justify-between text-xs font-mono">
                    <div>
                        <span class="text-[9px] text-zinc-500 block uppercase">Routing Partner Desk</span>
                        <span class="text-brand-bone font-bold">${state.partner.name}</span>
                        <span class="text-zinc-500 mx-2">|</span>
                        <span class="text-brand-green font-bold text-[10px]">${state.partner.role.toUpperCase()}</span>
                    </div>
                    <span class="hidden sm:inline-block text-[8px] text-zinc-600 uppercase">Secure Link Matcher</span>
                </div>

                <!-- Dynamic Step Content Portal -->
                <div id="matcher-step-portal" class="min-h-[220px] transition-all duration-300">
                    <!-- Steps will inject here dynamically -->
                </div>

                <!-- Navigation Controls Footer -->
                <div class="flex justify-between items-center border-t border-brand-borderGray pt-4 mt-6">
                    <button id="matcher-back-btn" class="px-4 py-2 bg-brand-graphite border border-brand-borderGray text-xs font-mono uppercase text-zinc-400 hover:text-brand-bone disabled:opacity-50 disabled:pointer-events-none">
                        &lt;// Back
                    </button>
                    <div id="matcher-indicator" class="text-[9px] font-mono text-zinc-500">
                        STEP <span id="current-step-indicator">1</span> OF 4
                    </div>
                    <button id="matcher-next-btn" class="px-6 py-2 bg-brand-green border border-brand-black text-brand-black text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:pointer-events-none">
                        Next //&gt;
                    </button>
                </div>
            </div>
        `;
    }

    // Render logic for specific step configurations
    function renderStep() {
        const portal = document.getElementById('matcher-step-portal');
        if (!portal) return;

        // Sync visual tracking progress states
        document.querySelectorAll('.step-node').forEach((node, idx) => {
            if (idx <= state.step) {
                node.classList.add('active', 'bg-brand-green', 'text-brand-black', 'border-brand-green');
                node.classList.remove('text-zinc-500', 'border-brand-borderGray');
            } else {
                node.classList.remove('active', 'bg-brand-green', 'text-brand-black', 'border-brand-green');
                node.classList.add('text-zinc-500', 'border-brand-borderGray');
            }
        });

        // Sync Next/Back button operational states
        const nextBtn = document.getElementById('matcher-next-btn');
        const backBtn = document.getElementById('matcher-back-btn');
        const indicator = document.getElementById('matcher-indicator');
        const currentStepInd = document.getElementById('current-step-indicator');

        if (state.step === 0) {
            backBtn.disabled = true;
        } else {
            backBtn.disabled = false;
        }

        if (state.step > 3) {
            nextBtn.classList.add('hidden');
            backBtn.classList.add('hidden');
            indicator.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            backBtn.classList.remove('hidden');
            indicator.classList.remove('hidden');
            currentStepInd.innerText = state.step + 1;
        }

        // Check if next step should be locked based on lack of answer
        validateStepState();

        // Render Step HTML content
        let html = '';
        switch (state.step) {
            case 0:
                html = `
                    <div class="space-y-4">
                        <div>
                            <span class="text-xs font-mono text-brand-orange uppercase">// STAGE 01</span>
                            <h3 class="text-xl font-bold uppercase tracking-tight text-brand-bone">Average Monthly Gross Revenue</h3>
                            <p class="text-xs text-zinc-400 font-sans">Underwriting requires precise volume routing metrics. Choose your nearest band.</p>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.revenue === 5000 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('revenue', 5000)">
                                <div class="text-[9px] text-zinc-500">BAND A</div>
                                <div class="font-bold text-sm text-brand-bone">Under $10,000 / mo</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.revenue === 12000 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('revenue', 12000)">
                                <div class="text-[9px] text-zinc-500">BAND B</div>
                                <div class="font-bold text-sm text-brand-bone">$10,000 - $25,000 / mo</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.revenue === 40000 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('revenue', 40000)">
                                <div class="text-[9px] text-zinc-500">BAND C</div>
                                <div class="font-bold text-sm text-brand-bone">$25,000 - $75,000 / mo</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.revenue === 100000 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('revenue', 100000)">
                                <div class="text-[9px] text-zinc-500">BAND D</div>
                                <div class="font-bold text-sm text-brand-bone">$75,000+ / mo</div>
                            </button>
                        </div>
                    </div>
                `;
                break;
            case 1:
                html = `
                    <div class="space-y-4">
                        <div>
                            <span class="text-xs font-mono text-brand-blue uppercase">// STAGE 02</span>
                            <h3 class="text-xl font-bold uppercase tracking-tight text-brand-bone">Estimated Personal Credit Score</h3>
                            <p class="text-xs text-zinc-400 font-sans">SBA pathways evaluate structural FICO rankings. Alt-funding options require soft pulls only.</p>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.credit === 550 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('credit', 550)">
                                <div class="text-[9px] text-zinc-500">SUBPRIME CLASS</div>
                                <div class="font-bold text-sm text-brand-bone">Under 600 (Fair / Poor)</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.credit === 620 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('credit', 620)">
                                <div class="text-[9px] text-zinc-500">MIDGRADE CLASS</div>
                                <div class="font-bold text-sm text-brand-bone">600 - 660 (Average)</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.credit === 690 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('credit', 690)">
                                <div class="text-[9px] text-zinc-500">PRIME CLASS</div>
                                <div class="font-bold text-sm text-brand-bone">660 - 720 (Good)</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.credit === 750 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('credit', 750)">
                                <div class="text-[9px] text-zinc-500">ELITE CLASS</div>
                                <div class="font-bold text-sm text-brand-bone">720+ (Excellent)</div>
                            </button>
                        </div>
                    </div>
                `;
                break;
            case 2:
                html = `
                    <div class="space-y-4">
                        <div>
                            <span class="text-xs font-mono text-brand-green uppercase">// STAGE 03</span>
                            <h3 class="text-xl font-bold uppercase tracking-tight text-brand-bone">Years Registered Operating in Business</h3>
                            <p class="text-xs text-zinc-400 font-sans">Entity validation criteria relies heavily on structural age milestones.</p>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.timeInBiz === 2 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('timeInBiz', 2)">
                                <div class="text-[9px] text-zinc-500">EARLY VENTURE</div>
                                <div class="font-bold text-sm text-brand-bone">Under 6 Months</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.timeInBiz === 8 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('timeInBiz', 8)">
                                <div class="text-[9px] text-zinc-500">MILITARY PHASE</div>
                                <div class="font-bold text-sm text-brand-bone">6 - 12 Months</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.timeInBiz === 18 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('timeInBiz', 18)">
                                <div class="text-[9px] text-zinc-500">PROVEN TRACK</div>
                                <div class="font-bold text-sm text-brand-bone">1 - 2 Years</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.timeInBiz === 36 ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('timeInBiz', 36)">
                                <div class="text-[9px] text-zinc-500">ESTABLISHED ROOT</div>
                                <div class="font-bold text-sm text-brand-bone">2+ Years</div>
                            </button>
                        </div>
                    </div>
                `;
                break;
            case 3:
                html = `
                    <div class="space-y-4">
                        <div>
                            <span class="text-xs font-mono text-brand-chrome uppercase">// STAGE 04</span>
                            <h3 class="text-xl font-bold uppercase tracking-tight text-brand-bone">Target Capital deployment Target</h3>
                            <p class="text-xs text-zinc-400 font-sans">Identify what primary allocation framework matches this requirement.</p>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.useCase === 'inventory' ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('useCase', 'inventory')">
                                <div class="text-[9px] text-zinc-500">TRADE PROCUREMENT</div>
                                <div class="font-bold text-sm text-brand-bone">Inventory & Supply run</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.useCase === 'realestate' ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('useCase', 'realestate')">
                                <div class="text-[9px] text-zinc-500">CRE ACQUISITION</div>
                                <div class="font-bold text-sm text-brand-bone">Real estate Development / Flip</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.useCase === 'workingcapital' ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('useCase', 'workingcapital')">
                                <div class="text-[9px] text-zinc-500">LIQUID RUNWAY</div>
                                <div class="font-bold text-sm text-brand-bone">General Operating Capital</div>
                            </button>
                            <button class="matcher-input-btn p-3.5 text-left font-mono text-xs ${state.inputs.useCase === 'construction' ? 'selected' : ''}" onclick="window.MoonshineMatcher.setVal('useCase', 'construction')">
                                <div class="text-[9px] text-zinc-500">PROJECT BRIDGING</div>
                                <div class="font-bold text-sm text-brand-bone">Outstanding Client Invoices</div>
                            </button>
                        </div>
                    </div>
                `;
                break;
            case 4:
                // Compile evaluation algorithm results
                calculateMatches();
                html = buildResultsHTML();
                break;
        }

        portal.innerHTML = html;
    }

    // Evaluate step parameters to lock Next button navigation
    function validateStepState() {
        const nextBtn = document.getElementById('matcher-next-btn');
        if (!nextBtn) return;

        let isValid = false;
        switch (state.step) {
            case 0:
                isValid = state.inputs.revenue > 0;
                break;
            case 1:
                isValid = state.inputs.credit > 0;
                break;
            case 2:
                isValid = state.inputs.timeInBiz > 0;
                break;
            case 3:
                isValid = state.inputs.useCase !== '';
                break;
            default:
                isValid = true;
        }

        nextBtn.disabled = !isValid;
    }

    // Matching Algorithm
    function calculateMatches() {
        state.results = PROGRAMS.map(program => {
            let score = 100;

            // Credit validation logic impact
            if (state.inputs.credit < program.minScore) {
                const diff = program.minScore - state.inputs.credit;
                score -= diff * 0.45; // Steep penalty for drop off below absolute floor parameters
            } else {
                score += (state.inputs.credit - program.minScore) * 0.1; // Marginal premium for tier margins
            }

            // Monthly Revenue impact
            if (state.inputs.revenue < program.minRevenue) {
                const ratio = state.inputs.revenue / program.minRevenue;
                score *= ratio * 0.85;
            } else {
                score += 5;
            }

            // Time in business validation
            if (state.inputs.timeInBiz < program.minTimeInBiz) {
                score -= (program.minTimeInBiz - state.inputs.timeInBiz) * 2.5;
            } else {
                score += 3;
            }

            // Use case optimization bonuses
            if (program.code === 'SBA-7A' && state.inputs.useCase === 'realestate') {
                score += 15;
            }
            if (program.code === 'REV-FIN' && state.inputs.useCase === 'inventory') {
                score += 12;
            }
            if (program.code === 'INVOICE-FACT' && state.inputs.useCase === 'construction') {
                score += 18;
            }
            if (program.code === 'MCA-RAPID' && state.inputs.useCase === 'workingcapital') {
                score += 8;
            }

            // Normalization bound limits
            score = Math.round(Math.min(100, Math.max(0, score)));

            return {
                ...program,
                compatibility: score
            };
        }).sort((a, b) => b.compatibility - a.compatibility);
    }

    // Compile tactical neobrutalist presentation screen for computed matches
    function buildResultsHTML() {
        const topMatch = state.results[0];
        const secondaryMatches = state.results.slice(1);

        return `
            <div class="space-y-6">
                <!-- Highlighted Top Match Header -->
                <div class="border-2 border-brand-green bg-brand-green/5 p-4 relative">
                    <span class="absolute -top-3 right-4 bg-brand-green text-brand-black text-[9px] font-mono font-bold px-2 py-0.5 border border-brand-black">TOP COMPATIBILITY MATCH</span>
                    
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <span class="text-[10px] font-mono text-brand-green uppercase tracking-wider">${topMatch.type}</span>
                            <h3 class="text-2xl font-bold uppercase tracking-tight text-brand-bone">${topMatch.name}</h3>
                        </div>
                        <div class="text-right">
                            <span class="text-[9px] text-zinc-500 font-mono block">COMPATIBILITY</span>
                            <span class="text-2xl font-bold text-brand-green font-mono">${topMatch.compatibility}%</span>
                        </div>
                    </div>

                    <p class="text-xs text-zinc-400 font-sans leading-relaxed mb-4">${topMatch.description}</p>

                    <!-- Embedded checklist matrix -->
                    <div class="border-t border-brand-borderGray pt-3">
                        <span class="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Required Verification Checklist:</span>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] font-mono text-zinc-400">
                            ${topMatch.checklist.map(item => `
                                <div class="flex items-center space-x-1.5">
                                    <span class="text-brand-green font-bold">✓</span>
                                    <span>${item}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Secondary Matches Dashboard Grid -->
                <div>
                    <h4 class="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">Alternative Programs Evaluated:</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        ${secondaryMatches.map(prog => `
                            <div class="bg-brand-black border border-brand-borderGray p-3 flex flex-col justify-between">
                                <div>
                                    <div class="flex justify-between items-start mb-1">
                                        <span class="text-[8px] font-mono text-zinc-500 uppercase block">${prog.code}</span>
                                        <span class="text-[11px] font-bold font-mono" style="color: ${prog.compatibility > 60 ? '#00FF66' : '#FF5500'}">${prog.compatibility}%</span>
                                    </div>
                                    <h5 class="text-xs font-bold uppercase text-brand-bone leading-tight">${prog.name}</h5>
                                </div>
                                <span class="text-[8px] font-mono text-zinc-600 uppercase mt-4 block">${prog.type}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Strategic Intent Call-to-action button wrapper -->
                <div class="bg-brand-black border-2 border-brand-borderGray p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="space-y-1">
                        <span class="text-[10px] font-mono text-brand-orange uppercase block">// UNDERWRITING ROUTE LOCKED</span>
                        <p class="text-xs text-zinc-400">Initiate quick pre-screen sequence with Devon Streeter's dedicated team.</p>
                    </div>
                    <button onclick="window.MoonshineMatcher.submitIntent('${topMatch.name}')" class="w-full sm:w-auto px-6 py-3 bg-brand-green text-brand-black text-xs font-mono font-bold uppercase shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-[#00e55c] transition-all border border-brand-black whitespace-nowrap">
                        Route Pre-Screen Request &gt;
                    </button>
                </div>
            </div>
        `;
    }

    // Export internal values global interface controller
    window.MoonshineMatcher = {
        setVal: function (field, value) {
            state.inputs[field] = value;
            renderStep();
        },
        submitIntent: function (matchName) {
            // Trigger customized local parent page communication toast message safely
            const ev = new CustomEvent('moonshine_matcher_intent', {
                detail: {
                    program: matchName,
                    partner: state.partner,
                    inputs: state.inputs
                }
            });
            window.dispatchEvent(ev);

            // Trigger global base-page notification alert context
            if (typeof window.triggerToast === 'function') {
                window.triggerToast(
                    'PORTAL TRANSMISSION INITIATED',
                    `Routing dynamic configuration context to /partners/${state.partner.id}/intake-gate...`,
                    'border-brand-green'
                );
            } else {
                alert(`Direct Match Submission successful! Underwriter Desk routing match: ${matchName} via Partner ID: ${state.partner.id}`);
            }
        }
    };

    // Initialize root lifecycle executions
    function init() {
        const root = document.getElementById('moonshine-matcher-root');
        if (!root) return;

        resolvePartner();
        injectStyles();
        root.innerHTML = buildSkeleton();
        renderStep();

        // Bind interactive event loops
        document.getElementById('matcher-next-btn').addEventListener('click', function () {
            if (state.step <= 4) {
                state.step++;
                renderStep();
            }
        });

        document.getElementById('matcher-back-btn').addEventListener('click', function () {
            if (state.step > 0) {
                state.step--;
                renderStep();
            }
        });
    }

    // Defer initialization to ready states safely
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();