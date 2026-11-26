class FundingMatcherHub {
    constructor(containerSelector = '#funding-matcher-hub') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.activeTab = 'matcher'; // 'matcher' or 'scorecard'
        
        // Initial state for Matcher
        this.matcherState = {
            amount: 150000,
            useOfFunds: 'working_capital',
            industry: 'Retail',
            creditTier: 'excellent'
        };

        // Initial state for Scorecard
        this.scorecardState = {
            monthlyRevenue: 45000,
            timeInBusiness: 18,
            ficoScore: 680,
            existingDebt: 'no'
        };

        this.init();
    }

    init() {
        this.injectStyles();
        this.render();
        this.bindEvents();
        this.updateMatcherResults();
        this.updateScorecardResults();
    }

    injectStyles() {
        if (document.getElementById('matcher-custom-styles')) return;
        const style = document.createElement('style');
        style.id = 'matcher-custom-styles';
        style.textContent = `
            /* Brutalist Custom Range Slider Styling */
            .brutal-slider {
                -webkit-appearance: none;
                width: 100%;
                height: 12px;
                background: #1a1a1a;
                border: 2px solid #f4f3ef;
                outline: none;
            }
            .brutal-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 24px;
                height: 24px;
                background: #00ff66;
                border: 2px solid #0d0d0d;
                cursor: pointer;
                box-shadow: 2px 2px 0px 0px #ff5500;
                transition: transform 0.1s;
            }
            .brutal-slider::-webkit-slider-thumb:hover {
                transform: scale(1.1);
            }
            .brutal-slider::-moz-range-thumb {
                width: 24px;
                height: 24px;
                background: #00ff66;
                border: 2px solid #0d0d0d;
                cursor: pointer;
                box-shadow: 2px 2px 0px 0px #ff5500;
            }
            .text-glow-green {
                text-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
            }
            .text-glow-orange {
                text-shadow: 0 0 10px rgba(255, 85, 0, 0.5);
            }
        `;
        document.head.appendChild(style);
    }

    formatCurrency(val) {
        if (val >= 1000000) {
            return `$${(val / 1000000).toFixed(1)}M+`;
        }
        return `$${val.toLocaleString()}`;
    }

    render() {
        this.container.innerHTML = `
            <div class="w-full bg-matteBlack border-4 border-white p-6 md:p-10 shadow-[8px_8px_0px_0px_#f4f3ef] text-white">
                <!-- Workspace Header & Tab Bar -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-white pb-6 mb-8">
                    <div>
                        <span class="font-mono text-xs text-electricGreen font-black uppercase tracking-widest block mb-1">INTERACTIVE DESK TOOLKIT</span>
                        <h2 class="font-mono text-2xl md:text-3xl font-extrabold text-white">Funding Evaluation Workspace</h2>
                    </div>
                    
                    <!-- Tabs -->
                    <div class="flex border-2 border-white bg-graphiteGray p-1 w-full md:w-auto">
                        <button id="tab-matcher" class="flex-1 md:flex-none font-mono text-xs font-bold px-4 py-2.5 transition-all uppercase tracking-wider ${this.activeTab === 'matcher' ? 'bg-electricGreen text-black font-black' : 'text-chromeAccent hover:text-white'}">
                            1. Route Matcher
                        </button>
                        <button id="tab-scorecard" class="flex-1 md:flex-none font-mono text-xs font-bold px-4 py-2.5 transition-all uppercase tracking-wider ${this.activeTab === 'scorecard' ? 'bg-electricGreen text-black font-black' : 'text-chromeAccent hover:text-white'}">
                            2. Readiness Scorecard
                        </button>
                    </div>
                </div>

                <!-- Active View Space -->
                <div id="workspace-view">
                    <!-- Dynamic views injected here -->
                </div>
            </div>
        `;

        this.renderActiveView();
    }

    renderActiveView() {
        const viewContainer = this.container.querySelector('#workspace-view');
        
        if (this.activeTab === 'matcher') {
            viewContainer.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- Config Left Panel -->
                    <div class="lg:col-span-5 space-y-6 bg-graphiteGray/40 border-2 border-white/10 p-6">
                        <h3 class="font-mono font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center justify-between">
                            <span>Target Parameters</span>
                            <span class="text-xs font-normal text-chromeAccent">Real-time matching</span>
                        </h3>

                        <!-- Target Amount -->
                        <div>
                            <div class="flex justify-between font-mono text-xs mb-2">
                                <span class="text-chromeAccent uppercase font-bold">Funding Requirement</span>
                                <span class="text-electricGreen font-extrabold" id="matcher-amount-val">${this.formatCurrency(this.matcherState.amount)}</span>
                            </div>
                            <input type="range" id="matcher-amount" min="10000" max="1500000" step="10000" value="${this.matcherState.amount}" class="brutal-slider">
                            <div class="flex justify-between text-[10px] text-chromeAccent font-mono mt-1">
                                <span>$10k</span>
                                <span>$500k</span>
                                <span>$1M</span>
                                <span>$1.5M+</span>
                            </div>
                        </div>

                        <!-- Use of Funds -->
                        <div>
                            <label class="block font-mono text-xs text-chromeAccent uppercase font-bold mb-2">Primary Use of Funds</label>
                            <select id="matcher-use" class="w-full bg-graphiteGray border-2 border-white/20 focus:border-electricGreen text-white px-3 py-2.5 text-sm font-mono focus:outline-none transition-all">
                                <option value="working_capital" ${this.matcherState.useOfFunds === 'working_capital' ? 'selected' : ''}>Working Capital & Operational Expenses</option>
                                <option value="equipment" ${this.matcherState.useOfFunds === 'equipment' ? 'selected' : ''}>Equipment Acquisition & Leasing</option>
                                <option value="inventory" ${this.matcherState.useOfFunds === 'inventory' ? 'selected' : ''}>Bulk Inventory Purchases</option>
                                <option value="real_estate" ${this.matcherState.useOfFunds === 'real_estate' ? 'selected' : ''}>Commercial Real Estate/Bridging</option>
                                <option value="debt_refi" ${this.matcherState.useOfFunds === 'debt_refi' ? 'selected' : ''}>Consolidation & Refinancing</option>
                            </select>
                        </div>

                        <!-- Market Sector -->
                        <div>
                            <label class="block font-mono text-xs text-chromeAccent uppercase font-bold mb-2">Your Business Niche</label>
                            <select id="matcher-industry" class="w-full bg-graphiteGray border-2 border-white/20 focus:border-electricGreen text-white px-3 py-2.5 text-sm font-mono focus:outline-none transition-all">
                                <option value="Contractors" ${this.matcherState.industry === 'Contractors' ? 'selected' : ''}>Contracting & Construction Services</option>
                                <option value="Ecommerce" ${this.matcherState.industry === 'Ecommerce' ? 'selected' : ''}>E-commerce & SaaS Operations</option>
                                <option value="Real Estate" ${this.matcherState.industry === 'Real Estate' ? 'selected' : ''}>Real Estate Developers & Flippers</option>
                                <option value="Local Business" ${this.matcherState.industry === 'Local Business' ? 'selected' : ''}>Local Retail / Main Street Storefronts</option>
                                <option value="General" ${this.matcherState.industry === 'General' ? 'selected' : ''}>Other Professional/Wholesale Services</option>
                            </select>
                        </div>

                        <!-- Self-Reported Credit -->
                        <div>
                            <label class="block font-mono text-xs text-chromeAccent uppercase font-bold mb-2">Estimated FICO Profile</label>
                            <div class="grid grid-cols-3 gap-2">
                                <button data-credit="fair" class="credit-btn font-mono text-xs py-2 border-2 ${this.matcherState.creditTier === 'fair' ? 'bg-signalOrange text-white border-white' : 'border-white/20 hover:border-white/50'}">Fair (< 620)</button>
                                <button data-credit="good" class="credit-btn font-mono text-xs py-2 border-2 ${this.matcherState.creditTier === 'good' ? 'bg-cobaltBlue text-white border-white' : 'border-white/20 hover:border-white/50'}">Good (620-680)</button>
                                <button data-credit="excellent" class="credit-btn font-mono text-xs py-2 border-2 ${this.matcherState.creditTier === 'excellent' ? 'bg-electricGreen text-black font-bold border-white' : 'border-white/20 hover:border-white/50'}">Excellent (680+)</button>
                            </div>
                        </div>
                    </div>

                    <!-- Output Results Right Panel -->
                    <div class="lg:col-span-7 flex flex-col justify-between space-y-6">
                        <div>
                            <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                                <h3 class="font-mono font-bold text-lg text-white">Recommended Funding Lanes</h3>
                                <span class="font-mono text-xs text-electricGreen" id="match-count">0 program matches found</span>
                            </div>
                            <div id="matcher-results-container" class="space-y-4">
                                <!-- Program cards render dynamically here -->
                            </div>
                        </div>

                        <!-- System Footnote -->
                        <div class="p-4 bg-white/5 border border-white/10 text-xs text-chromeAccent leading-relaxed">
                            <span class="text-white font-bold block mb-1">PRO-TIP FOR OPERATORS:</span>
                            Selecting matched routes below syncs these filters directly to your signup request, optimizing review velocity by bypassing general desk queues.
                        </div>
                    </div>
                </div>
            `;
        } else {
            viewContainer.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- Config Left Panel -->
                    <div class="lg:col-span-5 space-y-6 bg-graphiteGray/40 border-2 border-white/10 p-6">
                        <h3 class="font-mono font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center justify-between">
                            <span>Pre-Qual Variables</span>
                            <span class="text-xs font-normal text-chromeAccent">Instant scorecard calculation</span>
                        </h3>

                        <!-- Monthly Revenue -->
                        <div>
                            <div class="flex justify-between font-mono text-xs mb-2">
                                <span class="text-chromeAccent uppercase font-bold">Monthly Bank Deposits</span>
                                <span class="text-electricGreen font-extrabold" id="scorecard-rev-val">${this.formatCurrency(this.scorecardState.monthlyRevenue)}</span>
                            </div>
                            <input type="range" id="scorecard-rev" min="5000" max="250000" step="5000" value="${this.scorecardState.monthlyRevenue}" class="brutal-slider">
                            <div class="flex justify-between text-[10px] text-chromeAccent font-mono mt-1">
                                <span>$5k</span>
                                <span>$50k</span>
                                <span>$150k</span>
                                <span>$250k+</span>
                            </div>
                        </div>

                        <!-- Time in Business -->
                        <div>
                            <div class="flex justify-between font-mono text-xs mb-2">
                                <span class="text-chromeAccent uppercase font-bold">Time Operating (Months)</span>
                                <span class="text-electricGreen font-extrabold" id="scorecard-time-val">${this.scorecardState.timeInBusiness} Months</span>
                            </div>
                            <input type="range" id="scorecard-time" min="0" max="60" step="1" value="${this.scorecardState.timeInBusiness}" class="brutal-slider">
                            <div class="flex justify-between text-[10px] text-chromeAccent font-mono mt-1">
                                <span>New Startup</span>
                                <span>1 Year</span>
                                <span>3 Years</span>
                                <span>5+ Years</span>
                            </div>
                        </div>

                        <!-- Credit Score Slider -->
                        <div>
                            <div class="flex justify-between font-mono text-xs mb-2">
                                <span class="text-chromeAccent uppercase font-bold">Precise Credit (FICO)</span>
                                <span class="text-electricGreen font-extrabold" id="scorecard-fico-val">${this.scorecardState.ficoScore}</span>
                            </div>
                            <input type="range" id="scorecard-fico" min="450" max="850" step="5" value="${this.scorecardState.ficoScore}" class="brutal-slider">
                            <div class="flex justify-between text-[10px] text-chromeAccent font-mono mt-1">
                                <span>450 (Challenged)</span>
                                <span>650 (Moderate)</span>
                                <span>850 (Prime)</span>
                            </div>
                        </div>

                        <!-- Existing Loans -->
                        <div>
                            <label class="block font-mono text-xs text-chromeAccent uppercase font-bold mb-2">Do you have active Merchant Cash Advances?</label>
                            <div class="grid grid-cols-2 gap-4">
                                <button data-debt="yes" class="debt-btn font-mono text-xs py-2.5 border-2 ${this.scorecardState.existingDebt === 'yes' ? 'bg-signalOrange text-white border-white' : 'border-white/20 hover:border-white/50'}">Yes, 1 or more</button>
                                <button data-debt="no" class="debt-btn font-mono text-xs py-2.5 border-2 ${this.scorecardState.existingDebt === 'no' ? 'bg-electricGreen text-black font-bold border-white' : 'border-white/20 hover:border-white/50'}">No Active Positions</button>
                            </div>
                        </div>
                    </div>

                    <!-- Output Score Right Panel -->
                    <div class="lg:col-span-7 bg-graphiteGray/20 border-2 border-white/10 p-6 flex flex-col justify-between">
                        <div>
                            <h3 class="font-mono font-bold text-lg text-white border-b border-white/10 pb-3 mb-6">Readiness Analysis</h3>
                            
                            <!-- Gauge Grid -->
                            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
                                <div class="md:col-span-5 flex flex-col items-center justify-center p-6 bg-matteBlack border-2 border-white/10 relative">
                                    <span class="font-mono text-xs text-chromeAccent uppercase tracking-widest absolute top-2">Score</span>
                                    <div class="text-4xl md:text-5xl font-mono font-black text-electricGreen text-glow-green mt-2" id="score-gauge-val">0</div>
                                    <span class="text-[10px] font-mono text-chromeAccent mt-1 uppercase" id="score-verdict">Evaluating</span>
                                </div>
                                
                                <div class="md:col-span-7 space-y-2">
                                    <h4 class="font-mono font-bold text-white text-sm" id="scorecard-summary-title">Processing metrics...</h4>
                                    <p class="text-xs text-chromeAccent leading-relaxed" id="scorecard-summary-desc">
                                        Adjust left inputs to dynamically compute platform funding capability metrics.
                                    </p>
                                </div>
                            </div>

                            <!-- Detailed Feedback Items -->
                            <div class="border-t border-white/10 pt-4">
                                <h4 class="font-mono text-xs font-bold text-white uppercase tracking-wider mb-3">Key Underwriting Flags</h4>
                                <div class="space-y-2 text-xs" id="scorecard-flags-list">
                                    <!-- Populated dynamically -->
                                </div>
                            </div>
                        </div>

                        <!-- Immediate Action Block -->
                        <div class="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 class="font-mono text-sm font-bold text-white">Pre-qualification status updated</h4>
                                <p class="text-xs text-chromeAccent">Submit these ready metrics to lock in underwriting desk status.</p>
                            </div>
                            <button id="scorecard-cta-btn" class="w-full sm:w-auto font-mono bg-electricGreen hover:bg-white text-black font-extrabold px-6 py-3 border-2 border-black shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:shadow-none transition-all duration-200 text-xs uppercase tracking-wider">
                                Lock-In Scorecard & Submit
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    bindEvents() {
        // Tab Triggers
        const tabMatcher = this.container.querySelector('#tab-matcher');
        const tabScorecard = this.container.querySelector('#tab-scorecard');

        if (tabMatcher && tabScorecard) {
            tabMatcher.addEventListener('click', () => {
                this.activeTab = 'matcher';
                this.render();
                this.bindEvents();
                this.updateMatcherResults();
            });
            tabScorecard.addEventListener('click', () => {
                this.activeTab = 'scorecard';
                this.render();
                this.bindEvents();
                this.updateScorecardResults();
            });
        }

        // Matcher Specific Bindings
        if (this.activeTab === 'matcher') {
            const amountInput = this.container.querySelector('#matcher-amount');
            const useSelect = this.container.querySelector('#matcher-use');
            const industrySelect = this.container.querySelector('#matcher-industry');
            const creditBtns = this.container.querySelectorAll('.credit-btn');

            if (amountInput) {
                amountInput.addEventListener('input', (e) => {
                    this.matcherState.amount = parseInt(e.target.value);
                    this.container.querySelector('#matcher-amount-val').innerText = this.formatCurrency(this.matcherState.amount);
                    this.updateMatcherResults();
                });
            }

            if (useSelect) {
                useSelect.addEventListener('change', (e) => {
                    this.matcherState.useOfFunds = e.target.value;
                    this.updateMatcherResults();
                });
            }

            if (industrySelect) {
                industrySelect.addEventListener('change', (e) => {
                    this.matcherState.industry = e.target.value;
                    this.updateMatcherResults();
                });
            }

            creditBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.matcherState.creditTier = e.target.getAttribute('data-credit');
                    creditBtns.forEach(b => {
                        b.classList.remove('bg-electricGreen', 'text-black', 'font-bold', 'bg-signalOrange', 'bg-cobaltBlue', 'text-white', 'border-white');
                        b.classList.add('border-white/20');
                    });
                    
                    const activeTier = this.matcherState.creditTier;
                    if (activeTier === 'fair') e.target.classList.add('bg-signalOrange', 'text-white', 'border-white');
                    if (activeTier === 'good') e.target.classList.add('bg-cobaltBlue', 'text-white', 'border-white');
                    if (activeTier === 'excellent') e.target.classList.add('bg-electricGreen', 'text-black', 'font-bold', 'border-white');

                    this.updateMatcherResults();
                });
            });
        }

        // Scorecard Specific Bindings
        if (this.activeTab === 'scorecard') {
            const revInput = this.container.querySelector('#scorecard-rev');
            const timeInput = this.container.querySelector('#scorecard-time');
            const ficoInput = this.container.querySelector('#scorecard-fico');
            const debtBtns = this.container.querySelectorAll('.debt-btn');
            const ctaBtn = this.container.querySelector('#scorecard-cta-btn');

            if (revInput) {
                revInput.addEventListener('input', (e) => {
                    this.scorecardState.monthlyRevenue = parseInt(e.target.value);
                    this.container.querySelector('#scorecard-rev-val').innerText = this.formatCurrency(this.scorecardState.monthlyRevenue);
                    this.updateScorecardResults();
                });
            }

            if (timeInput) {
                timeInput.addEventListener('input', (e) => {
                    this.scorecardState.timeInBusiness = parseInt(e.target.value);
                    this.container.querySelector('#scorecard-time-val').innerText = `${this.scorecardState.timeInBusiness} Months`;
                    this.updateScorecardResults();
                });
            }

            if (ficoInput) {
                ficoInput.addEventListener('input', (e) => {
                    this.scorecardState.ficoScore = parseInt(e.target.value);
                    this.container.querySelector('#scorecard-fico-val').innerText = this.scorecardState.ficoScore;
                    this.updateScorecardResults();
                });
            }

            debtBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.scorecardState.existingDebt = e.target.getAttribute('data-debt');
                    debtBtns.forEach(b => {
                        b.classList.remove('bg-electricGreen', 'text-black', 'font-bold', 'bg-signalOrange', 'text-white', 'border-white');
                        b.classList.add('border-white/20');
                    });

                    if (this.scorecardState.existingDebt === 'yes') {
                        e.target.classList.add('bg-signalOrange', 'text-white', 'border-white');
                    } else {
                        e.target.classList.add('bg-electricGreen', 'text-black', 'font-bold', 'border-white');
                    }
                    this.updateScorecardResults();
                });
            });

            if (ctaBtn) {
                ctaBtn.addEventListener('click', () => {
                    this.handleSubmitFromScorecard();
                });
            }
        }
    }

    updateMatcherResults() {
        const resultsContainer = this.container.querySelector('#matcher-results-container');
        if (!resultsContainer) return;

        const { amount, useOfFunds, industry, creditTier } = this.matcherState;

        // Base Available Lanes Definition
        const programs = [
            {
                name: "Revenue-Based Working Capital",
                channel: "Merchant Cash Advance",
                maxAmount: 500000,
                minFico: 500,
                minMonths: 3,
                term: "6 to 18 Months",
                apr: "Factor Rate 1.15+",
                desc: "Repayments match operational velocity directly. Ideal for high turnover merchants.",
                color: "electricGreen"
            },
            {
                name: "Business Line of Credit",
                channel: "Lines of Credit",
                maxAmount: 250000,
                minFico: 620,
                minMonths: 12,
                term: "Revolving 12-24 Mo",
                apr: "9.99% - 21.99% APR",
                desc: "Draw down emergency reserves on-demand. Only pay interest on outstanding balances.",
                color: "cobaltBlue"
            },
            {
                name: "SBA Express & 7(a) Core",
                channel: "SBA Funding",
                maxAmount: 1500000,
                minFico: 680,
                minMonths: 24,
                term: "5 to 10 Year Terms",
                apr: "Prime + 2.5% to 4.75%",
                desc: "Government-guaranteed long-term growth structures. Unbeatable cost of capital.",
                color: "electricGreen"
            },
            {
                name: "Equipment Lease Funding",
                channel: "Equipment Funding",
                maxAmount: 1000000,
                minFico: 580,
                minMonths: 6,
                term: "24 to 60 Months",
                apr: "5.5% - 15.0% Yield",
                desc: "Direct financing for mission-critical heavy machinery, tech arrays, or corporate vehicles.",
                color: "signalOrange"
            },
            {
                name: "Contractor Invoice Factoring",
                channel: "Working Capital",
                maxAmount: 2000000,
                minFico: 550,
                minMonths: 3,
                term: "Based on Net-Terms",
                apr: "1.5% - 3.0% Per Month",
                desc: "Trade slow outstanding construction client bills for instant 24-hour advance cash flow.",
                color: "signalOrange"
            }
        ];

        // Scoring algorithm calculating Match percentages based on state factors
        const matchedPrograms = programs.map(p => {
            let score = 90; // base score

            // Check absolute caps
            if (amount > p.maxAmount) score -= 30;
            
            // Credit Tier impacts
            if (creditTier === 'fair') {
                if (p.minFico >= 680) score -= 50;
                else if (p.minFico >= 620) score -= 25;
                else score += 5;
            } else if (creditTier === 'good') {
                if (p.minFico >= 680) score -= 20;
                else score += 10;
            } else if (creditTier === 'excellent') {
                score += 15;
            }

            // Industry optimization check
            if (industry === 'Contractors' && p.name.includes("Contractor")) score += 15;
            if (industry === 'Ecommerce' && p.channel.includes("Revenue")) score += 10;
            if (industry === 'Real Estate' && p.name.includes("SBA")) score -= 20; // SBA generally restricts passive investment properties

            // Use of funds matches
            if (useOfFunds === 'equipment' && p.name.includes("Equipment")) score += 20;
            if (useOfFunds === 'working_capital' && p.name.includes("Working Capital")) score += 15;

            // Cap matching percentage bounds
            const finalPercent = Math.min(Math.max(score, 15), 98);

            return {
                ...p,
                matchPercent: finalPercent
            };
        });

        // Sort program configurations by descending Match relevance
        matchedPrograms.sort((a, b) => b.matchPercent - a.matchPercent);

        // Render matching program configurations
        resultsContainer.innerHTML = '';
        this.container.querySelector('#match-count').innerText = `${matchedPrograms.filter(p => p.matchPercent > 50).length} Premium Matches Ready`;

        matchedPrograms.forEach(prog => {
            const isMatchHigh = prog.matchPercent >= 75;
            const accentBorder = isMatchHigh ? 'border-electricGreen' : 'border-white/10';
            const badgeBg = isMatchHigh ? 'bg-electricGreen/10 text-electricGreen border-electricGreen/30' : 'bg-white/5 text-chromeAccent border-white/10';

            const card = document.createElement('div');
            card.className = `p-4 md:p-5 bg-matteBlack border-2 ${accentBorder} relative hover:scale-[1.01] transition-all duration-150`;
            card.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h4 class="font-mono font-bold text-white text-base">${prog.name}</h4>
                            <span class="text-[10px] font-mono px-2 py-0.5 border ${badgeBg}">${prog.matchPercent}% Match</span>
                        </div>
                        <span class="text-xs text-chromeAccent font-mono uppercase">${prog.channel}</span>
                    </div>
                    <div class="text-right sm:text-right flex sm:flex-col justify-between w-full sm:w-auto text-xs font-mono">
                        <span class="text-white font-bold">${prog.term}</span>
                        <span class="text-chromeAccent">${prog.apr}</span>
                    </div>
                </div>
                <p class="text-xs text-chromeAccent/90 leading-relaxed mb-4">
                    ${prog.desc}
                </p>
                <div class="flex items-center justify-between pt-3 border-t border-white/10">
                    <span class="text-[10px] text-chromeAccent/60 font-mono uppercase">MOONSHINE ECOSYSTEM COMPLIANT</span>
                    <button data-program-name="${prog.name}" data-channel-name="${prog.channel}" class="start-review-btn font-mono text-xs text-black bg-electricGreen font-bold px-3.5 py-1.5 border border-black hover:bg-white transition-colors uppercase">
                        Select & Review →
                    </button>
                </div>
            `;
            resultsContainer.appendChild(card);
        });

        // Add dynamic CTA functionality to inject into submission form
        this.container.querySelectorAll('.start-review-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const program = e.target.getAttribute('data-program-name');
                const channel = e.target.getAttribute('data-channel-name');
                this.handleStartReview(program, channel);
            });
        });
    }

    updateScorecardResults() {
        const scoreVal = this.container.querySelector('#score-gauge-val');
        const verdictVal = this.container.querySelector('#score-verdict');
        const summaryTitle = this.container.querySelector('#scorecard-summary-title');
        const summaryDesc = this.container.querySelector('#scorecard-summary-desc');
        const flagsList = this.container.querySelector('#scorecard-flags-list');

        if (!scoreVal) return;

        const { monthlyRevenue, timeInBusiness, ficoScore, existingDebt } = this.scorecardState;

        // Perform programmatic underwriting assessment
        let calculatedScore = 40; // baseline

        // Revenue adjustments
        if (monthlyRevenue >= 100000) calculatedScore += 25;
        else if (monthlyRevenue >= 40000) calculatedScore += 15;
        else if (monthlyRevenue >= 15000) calculatedScore += 8;
        else calculatedScore -= 10;

        // Time in business adjustments
        if (timeInBusiness >= 24) calculatedScore += 20;
        else if (timeInBusiness >= 12) calculatedScore += 12;
        else if (timeInBusiness >= 6) calculatedScore += 5;
        else calculatedScore -= 15;

        // Credit metrics
        if (ficoScore >= 720) calculatedScore += 20;
        else if (ficoScore >= 640) calculatedScore += 10;
        else if (ficoScore >= 580) calculatedScore += 2;
        else calculatedScore -= 15;

        // Debt leverage factor
        if (existingDebt === 'yes') calculatedScore -= 15;
        else calculatedScore += 5;

        // Bound metrics standard
        const finalScore = Math.min(Math.max(calculatedScore, 10), 100);

        // Compute verdicts
        let verdict = "Challenged";
        let colorClass = "text-signalOrange";
        let verdictTitle = "Attention Required";
        let verdictDesc = "Key baseline compliance metrics (revenue or time in business) are tracking behind standard lender parameters. High-rate short term cash flow tools may remain accessible but structural limits apply.";

        if (finalScore >= 80) {
            verdict = "Excellent";
            colorClass = "text-electricGreen text-glow-green";
            verdictTitle = "Premium Direct Access Active";
            verdictDesc = "Your corporate profile reflects top-tier reliability. You meet all underwriting standards to unlock optimal interest rates, maximum leverage lines of credit, and low-rate SBA formats.";
        } else if (finalScore >= 60) {
            verdict = "Moderate";
            colorClass = "text-cobaltBlue";
            verdictTitle = "Standard Clearances Approved";
            verdictDesc = "Your operational status is healthy! Working capital routes are open. Lines of credit remain viable with standard secondary document reviews like asset lists or tax filings.";
        }

        // Output UI State Changes
        scoreVal.innerText = `${finalScore}`;
        scoreVal.className = `text-4xl md:text-5xl font-mono font-black ${colorClass} mt-2`;
        verdictVal.innerText = verdict;
        verdictVal.className = `text-[10px] font-mono mt-1 uppercase ${finalScore >= 80 ? 'text-electricGreen' : finalScore >= 60 ? 'text-cobaltBlue' : 'text-signalOrange'}`;
        summaryTitle.innerText = verdictTitle;
        summaryDesc.innerText = verdictDesc;

        // Compile Underwriting Flag Checks
        const flags = [];

        if (monthlyRevenue >= 15000) {
            flags.push({ ok: true, text: `Monthly volume ($${monthlyRevenue.toLocaleString()}) matches baseline direct processing guidelines.` });
        } else {
            flags.push({ ok: false, text: `Monthly volume ($${monthlyRevenue.toLocaleString()}) falls below target desk thresholds.` });
        }

        if (timeInBusiness >= 12) {
            flags.push({ ok: true, text: `Tenure threshold is met (>1 year operation history).` });
        } else {
            flags.push({ ok: false, text: `Tenure is classified as high risk (less than 12 months in operation).` });
        }

        if (ficoScore >= 620) {
            flags.push({ ok: true, text: `FICO score (${ficoScore}) guarantees multiple high-limit program pathways.` });
        } else {
            flags.push({ ok: false, text: `FICO score (${ficoScore}) requires supplemental merchant account balances.` });
        }

        if (existingDebt === 'no') {
            flags.push({ ok: true, text: `No active stacking MCA balances identified on ledger.` });
        } else {
            flags.push({ ok: false, text: `Active cash advance balance observed. May require a consolidation structure.` });
        }

        flagsList.innerHTML = flags.map(f => `
            <div class="flex items-start gap-2 ${f.ok ? 'text-white' : 'text-chromeAccent/80'}">
                <span class="${f.ok ? 'text-electricGreen' : 'text-signalOrange'} font-bold select-none">${f.ok ? '✓' : '⚡'}</span>
                <span>${f.text}</span>
            </div>
        `).join('');
    }

    handleStartReview(programName, channelName) {
        // Sync values to existing request form fields on the main page DOM
        this.syncInputsToMainForm(channelName);

        // Visual feedback to user before scroll action
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-20 right-4 z-50 bg-electricGreen text-black font-mono font-bold text-xs p-4 border-2 border-black shadow-[4px_4px_0px_#000] animate-bounce';
        notification.innerHTML = `Selected ${programName}! Syncing options...`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
            const targetElement = document.querySelector('#request-form');
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Briefly flash target element background highlight to establish clear feedback loop
                targetElement.classList.add('ring-4', 'ring-electricGreen');
                setTimeout(() => targetElement.classList.remove('ring-4', 'ring-electricGreen'), 1500);
            }
        }, 800);
    }

    handleSubmitFromScorecard() {
        const { monthlyRevenue, timeInBusiness, ficoScore } = this.scorecardState;
        
        // Approximate specialty category
        let optimalSpecialty = "Working Capital";
        if (ficoScore >= 680 && monthlyRevenue >= 30000) {
            optimalSpecialty = "SBA Funding";
        } else if (ficoScore >= 620) {
            optimalSpecialty = "Lines of Credit";
        }

        this.syncInputsToMainForm(optimalSpecialty);

        // Add pre-qual info directly into the bio textarea as metadata for custom submission
        const bioTextarea = document.querySelector('#request-form textarea');
        if (bioTextarea) {
            bioTextarea.value = `[System Evaluation Log: Pre-qual Scorecard Submitted. FICO: ${ficoScore}, Revenue: $${monthlyRevenue.toLocaleString()}/mo, Operating months: ${timeInBusiness}]. Real-time intake required.`;
        }

        const targetElement = document.querySelector('#request-form');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            targetElement.classList.add('ring-4', 'ring-electricGreen');
            setTimeout(() => targetElement.classList.remove('ring-4', 'ring-electricGreen'), 1500);
        }
    }

    syncInputsToMainForm(mappedSpecialty) {
        const primarySpecialtySelect = document.querySelector('#request-form select:nth-of-type(2)');
        const nicheMarketSelect = document.querySelector('#request-form select:nth-of-type(1)');

        // Target matching logic for specialty variables mapping back to base selectors
        if (primarySpecialtySelect) {
            const options = Array.from(primarySpecialtySelect.options);
            const matchingOption = options.find(opt => {
                const text = opt.text.toLowerCase();
                const val = opt.value.toLowerCase();
                const target = mappedSpecialty.toLowerCase();
                return text.includes(target) || val.includes(target) || target.includes(val);
            });
            if (matchingOption) {
                primarySpecialtySelect.value = matchingOption.value;
            }
        }

        // Sync Niche Selection if matching matcher state
        if (nicheMarketSelect && this.activeTab === 'matcher') {
            const industryVal = this.matcherState.industry;
            if (industryVal) {
                nicheMarketSelect.value = industryVal;
            }
        }
    }
}

// Global initialization mechanism on load
window.addEventListener('DOMContentLoaded', () => {
    // If a target mount div isn't manually set, we dynamically inject a slot right before the problem section
    let target = document.getElementById('funding-matcher-hub');
    if (!target) {
        const targetSection = document.getElementById('problem');
        if (targetSection) {
            const wrapper = document.createElement('section');
            wrapper.className = 'py-16 px-4 bg-matteBlack border-b border-white/10';
            wrapper.innerHTML = `
                <div class="max-w-7xl mx-auto">
                    <div id="funding-matcher-hub"></div>
                </div>
            `;
            targetSection.parentNode.insertBefore(wrapper, targetSection);
        }
    }

    new FundingMatcherHub('#funding-matcher-hub');
});