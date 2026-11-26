(function() {
    // Create and inject custom CSS scoped specifically for the calculator to ensure neobrutalist animations
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .calc-range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 4px;
            background: #39FF14;
            border: 2px solid #0B0B0C;
            cursor: pointer;
            box-shadow: 2px 2px 0px #000;
            transition: transform 0.1s ease, background-color 0.1s ease;
        }
        .calc-range-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            background: #ffffff;
        }
        .calc-range-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 4px;
            background: #39FF14;
            border: 2px solid #0B0B0C;
            cursor: pointer;
            box-shadow: 2px 2px 0px #000;
            transition: transform 0.1s ease, background-color 0.1s ease;
        }
        .calc-range-slider::-moz-range-thumb:hover {
            transform: scale(1.15);
            background: #ffffff;
        }
        .calc-card-active {
            border-color: #39FF14 !important;
            box-shadow: 0 0 15px rgba(57, 255, 20, 0.15);
        }
        .calc-tab-active {
            background-color: #39FF14 !important;
            color: #0B0B0C !important;
            border-color: #0B0B0C !important;
        }
    `;
    document.head.appendChild(styleElement);

    // Main Calculator UI HTML Template
    const calculatorTemplate = `
        <div class="glass-panel rounded-2xl border border-glassBorder p-6 md:p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden bg-matteBlack/90">
            <!-- Decorative Tech Accents -->
            <div class="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-electricGreen/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cobaltBlue/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <!-- Top Header Inside Card -->
            <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-glassBorder mb-8 gap-4">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="w-2.5 h-2.5 rounded-full bg-electricGreen animate-pulse"></span>
                        <span class="text-[10px] font-mono tracking-widest text-electricGreen uppercase font-bold">MOONSHINE CORE ENGINE</span>
                    </div>
                    <h3 class="font-display font-extrabold text-2xl md:text-3xl text-white">Deal Flow & Economics Estimator</h3>
                </div>
                <div class="bg-graphiteGray/60 border border-glassBorder rounded px-4 py-2 flex items-center gap-3">
                    <span class="text-[10px] font-mono text-boneWhite/50 uppercase">Current Baseline Level:</span>
                    <span id="current-tier-badge" class="bg-electricGreen/15 text-electricGreen border border-electricGreen/30 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded">
                        Bronze Tier
                    </span>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- LEFT COLUMN: INPUT PARAMETERS (5 cols) -->
                <div class="lg:col-span-5 space-y-6">
                    <h4 class="font-display font-bold text-sm uppercase tracking-wider text-boneWhite/80 border-b border-glassBorder/50 pb-2">1. Client Financial Profile</h4>
                    
                    <!-- Parameter: Monthly Revenue -->
                    <div class="space-y-2">
                        <div class="flex justify-between items-center font-mono text-xs">
                            <label for="monthly-rev" class="text-boneWhite/70 uppercase">Monthly Revenue</label>
                            <span id="monthly-rev-val" class="text-white font-bold text-sm bg-graphiteGray px-2 py-0.5 rounded border border-glassBorder">$75,000</span>
                        </div>
                        <input type="range" id="monthly-rev" min="10000" max="1500000" step="5000" value="75000" 
                            class="calc-range-slider w-full h-1.5 bg-graphiteGray rounded-lg appearance-none cursor-pointer accent-electricGreen">
                        <div class="flex justify-between text-[9px] font-mono text-boneWhite/40">
                            <span>$10K</span>
                            <span>$500K</span>
                            <span>$1M</span>
                            <span>$1.5M+</span>
                        </div>
                    </div>

                    <!-- Parameter: Avg Daily Balance -->
                    <div class="space-y-2">
                        <div class="flex justify-between items-center font-mono text-xs">
                            <label for="avg-balance" class="text-boneWhite/70 uppercase">Avg Bank Balance</label>
                            <span id="avg-balance-val" class="text-white font-bold text-sm bg-graphiteGray px-2 py-0.5 rounded border border-glassBorder">$8,500</span>
                        </div>
                        <input type="range" id="avg-balance" min="500" max="250000" step="500" value="8500" 
                            class="calc-range-slider w-full h-1.5 bg-graphiteGray rounded-lg appearance-none cursor-pointer accent-electricGreen">
                        <div class="flex justify-between text-[9px] font-mono text-boneWhite/40">
                            <span>$500</span>
                            <span>$50K</span>
                            <span>$150K</span>
                            <span>$250K+</span>
                        </div>
                    </div>

                    <!-- Parameter Grid: Years in Business & Credit Score -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label for="years-biz" class="block font-mono text-xs text-boneWhite/70 uppercase">Time In Business</label>
                            <select id="years-biz" class="w-full bg-graphiteGray border border-glassBorder text-boneWhite text-xs rounded p-2.5 focus:border-electricGreen focus:ring-0 font-mono">
                                <option value="0.25">Under 6 Months</option>
                                <option value="0.5">6 - 11 Months</option>
                                <option value="1">1 - 2 Years</option>
                                <option value="2" selected>2+ Years</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label for="credit-score" class="block font-mono text-xs text-boneWhite/70 uppercase">FICO Score</label>
                            <select id="credit-score" class="w-full bg-graphiteGray border border-glassBorder text-boneWhite text-xs rounded p-2.5 focus:border-electricGreen focus:ring-0 font-mono">
                                <option value="720" selected>720+ Excellent</option>
                                <option value="660">650 - 719 Good</option>
                                <option value="600">600 - 649 Fair</option>
                                <option value="500">Under 600 Poor</option>
                            </select>
                        </div>
                    </div>

                    <!-- Parameter: Industry Type -->
                    <div class="space-y-2">
                        <label class="block font-mono text-xs text-boneWhite/70 uppercase">Primary Industry</label>
                        <div class="grid grid-cols-2 gap-2" id="industry-selector">
                            <button data-ind="retail" class="ind-btn bg-graphiteGray text-boneWhite hover:bg-white/5 border border-glassBorder px-3 py-2 rounded text-xs font-mono text-left uppercase transition-all duration-150 flex items-center justify-between">
                                <span>Retail / Hosp</span>
                                <span class="text-[9px] opacity-40">LOC</span>
                            </button>
                            <button data-ind="ecommerce" class="ind-btn bg-graphiteGray text-boneWhite hover:bg-white/5 border border-glassBorder px-3 py-2 rounded text-xs font-mono text-left uppercase transition-all duration-150 flex items-center justify-between">
                                <span>E-Commerce</span>
                                <span class="text-[9px] opacity-40">RBF</span>
                            </button>
                            <button data-ind="contractor" class="ind-btn bg-graphiteGray text-boneWhite hover:bg-white/5 border border-glassBorder px-3 py-2 rounded text-xs font-mono text-left uppercase transition-all duration-150 flex items-center justify-between">
                                <span>Contractor/B2B</span>
                                <span class="text-[9px] opacity-40">Factoring</span>
                            </button>
                            <button data-ind="realestate" class="ind-btn bg-graphiteGray text-boneWhite hover:bg-white/5 border border-glassBorder px-3 py-2 rounded text-xs font-mono text-left uppercase transition-all duration-150 flex items-center justify-between">
                                <span>Real Estate</span>
                                <span class="text-[9px] opacity-40">Bridge</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: RESULTS, MATRIX ROUTER, COMMISSION OUTS (7 cols) -->
                <div class="lg:col-span-7 flex flex-col justify-between space-y-6">
                    
                    <!-- Route Dynamic Matcher (Horizontal Tabs) -->
                    <div class="space-y-3">
                        <h4 class="font-display font-bold text-sm uppercase tracking-wider text-boneWhite/80 border-b border-glassBorder/50 pb-2 flex items-center justify-between">
                            <span>2. Real-Time Funding Desks</span>
                            <span class="text-[10px] font-mono text-boneWhite/40 normal-case">Select active desk to lock parameters</span>
                        </h4>
                        
                        <div class="grid grid-cols-3 gap-3" id="route-tabs">
                            <!-- SBA Tab -->
                            <button id="tab-sba" class="tab-btn p-3 bg-graphiteGray/40 border border-glassBorder rounded-lg transition-all text-left flex flex-col justify-between group h-24">
                                <div class="flex justify-between items-start w-full">
                                    <span class="text-[9px] font-mono text-cobaltBlue font-bold uppercase tracking-widest">SBA Program</span>
                                    <span id="badge-sba" class="text-[8px] font-mono px-1.5 py-0.5 rounded bg-glassBorder text-boneWhite/40 uppercase">Checking</span>
                                </div>
                                <div class="mt-2">
                                    <span id="title-sba" class="block text-white font-display font-bold text-xs group-hover:text-electricGreen">SBA 7(a) Term</span>
                                    <span id="fund-sba" class="block text-[11px] font-mono text-boneWhite/60 mt-0.5">Calculating...</span>
                                </div>
                            </button>

                            <!-- MCA Tab -->
                            <button id="tab-mca" class="tab-btn p-3 bg-graphiteGray/40 border border-glassBorder rounded-lg transition-all text-left flex flex-col justify-between group h-24">
                                <div class="flex justify-between items-start w-full">
                                    <span class="text-[9px] font-mono text-signalOrange font-bold uppercase tracking-widest">Revenue Capital</span>
                                    <span id="badge-mca" class="text-[8px] font-mono px-1.5 py-0.5 rounded bg-glassBorder text-boneWhite/40 uppercase">Checking</span>
                                </div>
                                <div class="mt-2">
                                    <span id="title-mca" class="block text-white font-display font-bold text-xs group-hover:text-electricGreen">RBF / MCA</span>
                                    <span id="fund-mca" class="block text-[11px] font-mono text-boneWhite/60 mt-0.5">Calculating...</span>
                                </div>
                            </button>

                            <!-- Factoring Tab -->
                            <button id="tab-factoring" class="tab-btn p-3 bg-graphiteGray/40 border border-glassBorder rounded-lg transition-all text-left flex flex-col justify-between group h-24">
                                <div class="flex justify-between items-start w-full">
                                    <span class="text-[9px] font-mono text-electricGreen font-bold uppercase tracking-widest">Asset Desk</span>
                                    <span id="badge-factoring" class="text-[8px] font-mono px-1.5 py-0.5 rounded bg-glassBorder text-boneWhite/40 uppercase">Checking</span>
                                </div>
                                <div class="mt-2">
                                    <span id="title-factoring" class="block text-white font-display font-bold text-xs group-hover:text-electricGreen">Invoice Factoring</span>
                                    <span id="fund-factoring" class="block text-[11px] font-mono text-boneWhite/60 mt-0.5">Calculating...</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Economics Output Board (Large Neobrutalist Panel) -->
                    <div class="bg-graphiteGray/30 rounded-xl border border-glassBorder p-5 space-y-4 relative overflow-hidden">
                        <div class="absolute top-2 right-2 text-[9px] font-mono text-boneWhite/20 uppercase tracking-widest">OUTPUT CONSOLE v2</div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Left Block: Approved Range -->
                            <div class="space-y-1 p-3 bg-matteBlack/50 rounded border border-glassBorder">
                                <span class="text-[10px] font-mono text-boneWhite/40 uppercase tracking-wider block">Estimated Funded Capital</span>
                                <span id="out-funding-amount" class="text-2xl md:text-3xl font-display font-extrabold text-white block">$0</span>
                                <span id="out-rate-metric" class="text-[10px] font-mono text-electricGreen block">Est. Rate: Checking...</span>
                            </div>

                            <!-- Right Block: Projected Earnings -->
                            <div class="space-y-1 p-3 bg-matteBlack/50 rounded border border-glassBorder/70 relative">
                                <div class="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-signalOrange animate-ping"></div>
                                <span class="text-[10px] font-mono text-boneWhite/40 uppercase tracking-wider block">Your Partner Commission</span>
                                <span id="out-payout-amount" class="text-2xl md:text-3xl font-display font-extrabold text-signalOrange block">$0</span>
                                <span id="out-percentage-rate" class="text-[10px] font-mono text-boneWhite/60 block">Based on 2.5% Base Contract</span>
                            </div>
                        </div>

                        <!-- Progress Bar & Tier Incentives Dynamic display -->
                        <div class="space-y-2 pt-2 border-t border-glassBorder/50">
                            <div class="flex justify-between items-center text-[10px] font-mono">
                                <span class="text-boneWhite/50 uppercase">Tier Acceleration Status:</span>
                                <span id="tier-progress-text" class="text-white">Gold Tier Active (+1.0% Bonus Applied)</span>
                            </div>
                            <div class="w-full bg-matteBlack h-2.5 rounded overflow-hidden p-[1px] border border-glassBorder">
                                <div id="tier-progress-bar" class="bg-gradient-to-r from-cobaltBlue via-signalOrange to-electricGreen h-full rounded transition-all duration-500" style="width: 45%"></div>
                            </div>
                            <div class="flex justify-between text-[8px] font-mono text-boneWhite/30">
                                <span>Bronze (1.5%)</span>
                                <span>Silver (2.0%)</span>
                                <span>Gold (3.0%)</span>
                                <span>Platinum (4.5%)</span>
                            </div>
                        </div>
                    </div>

                    <!-- Direct Submission Action Matrix -->
                    <div class="flex flex-col sm:flex-row items-center gap-4">
                        <div class="text-left w-full sm:w-auto">
                            <span class="block text-[10px] font-mono text-boneWhite/40 uppercase tracking-wider">Estimated Underwriting Duration:</span>
                            <span id="out-duration" class="block text-xs font-display font-bold text-white uppercase mt-0.5">Ready to Match Route</span>
                        </div>
                        <button id="btn-submit-routing" class="w-full sm:flex-1 relative group overflow-hidden bg-electricGreen hover:bg-white text-matteBlack font-display font-bold text-xs uppercase tracking-widest py-4 px-6 rounded transition-all duration-300 shadow-lg neo-glow-green border border-electricGreen hover:border-white">
                            <span class="relative z-10 flex items-center justify-center gap-2">
                                <span>Instantly Lock Route & Submit</span>
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `;

    // Active configuration variables inside state
    const state = {
        selectedIndustry: 'retail',
        selectedRoute: 'mca', // Default route selected on right side
        monthlyRevenue: 75000,
        averageBalance: 8500,
        yearsInBusiness: 2,
        creditScore: 720,
        routes: {
            sba: { eligible: false, amount: 0, rateDesc: '', duration: '', commissionPct: 2.0 },
            mca: { eligible: false, amount: 0, rateDesc: '', duration: '', commissionPct: 3.5 },
            factoring: { eligible: false, amount: 0, rateDesc: '', duration: '', commissionPct: 2.5 }
        }
    };

    // Helper functions
    function formatCurrency(number) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(number);
    }

    function calculateTiers(revenue) {
        // Dynamic Tier Threshold Logic based on Monthly Revenue
        let tierName = 'Bronze Tier';
        let bonusPct = 0;
        let progressPct = 0;

        if (revenue < 50000) {
            tierName = 'Bronze Tier (Base)';
            bonusPct = 0;
            progressPct = (revenue / 50000) * 100 * 0.25;
        } else if (revenue >= 50000 && revenue < 150000) {
            tierName = 'Silver Tier (+0.5%)';
            bonusPct = 0.5;
            progressPct = 25 + ((revenue - 50000) / 100000) * 100 * 0.25;
        } else if (revenue >= 150000 && revenue < 500000) {
            tierName = 'Gold Tier (+1.0%)';
            bonusPct = 1.0;
            progressPct = 50 + ((revenue - 150000) / 350000) * 100 * 0.25;
        } else {
            tierName = 'Platinum Tier (+1.5%)';
            bonusPct = 1.5;
            progressPct = 75 + Math.min(25, ((revenue - 500000) / 1000000) * 25);
        }

        return { tierName, bonusPct, progressPct };
    }

    function calculateRoutes() {
        // 1. SBA Eligibility & Amounts
        const sbaEligible = state.yearsInBusiness >= 2 && state.creditScore >= 660 && state.monthlyRevenue >= 35000;
        let sbaAmount = 0;
        if (sbaEligible) {
            // SBA leverages roughly up to 2.5 times Monthly Revenue
            sbaAmount = Math.min(5000000, state.monthlyRevenue * 2.5);
        }
        state.routes.sba = {
            eligible: sbaEligible,
            amount: sbaAmount,
            rateDesc: 'Est. Rate: Prime + 1.5% - 2.75%',
            duration: '21-45 Days Funding Cycle',
            commissionPct: 2.0
        };

        // 2. MCA / Revenue-Based Financing Eligibility & Amounts
        const mcaEligible = state.monthlyRevenue >= 10000 && state.creditScore >= 500;
        let mcaAmount = 0;
        if (mcaEligible) {
            // High revenue + solid bank balances increases approval parameters
            const balanceFactor = Math.min(1.5, Math.max(0.7, state.averageBalance / 15000));
            mcaAmount = Math.min(750000, state.monthlyRevenue * 1.35 * balanceFactor);
        }
        state.routes.mca = {
            eligible: mcaEligible,
            amount: mcaAmount,
            rateDesc: 'Est. Factor Rate: 1.15 - 1.35',
            duration: '24-48 Hour Intake Cycle',
            commissionPct: 3.5
        };

        // 3. Invoice Factoring Eligibility & Amounts
        const factoringEligible = state.monthlyRevenue >= 20000 && (state.selectedIndustry === 'contractor' || state.selectedIndustry === 'ecommerce');
        let factoringAmount = 0;
        if (factoringEligible) {
            // Derived from monthly volume parameters
            factoringAmount = state.monthlyRevenue * 1.75;
        }
        state.routes.factoring = {
            eligible: factoringEligible,
            amount: factoringAmount,
            rateDesc: 'Advance Rate: 85% - 92%',
            duration: '3-7 Days Desk Audit',
            commissionPct: 2.5
        };
    }

    function updateDOM() {
        // Output values next to sliders
        document.getElementById('monthly-rev-val').innerText = formatCurrency(state.monthlyRevenue);
        document.getElementById('avg-balance-val').innerText = formatCurrency(state.averageBalance);

        // Recalculate routes and economics
        calculateRoutes();

        // Check active elements on dynamic badge fields inside the route selectors
        // SBA display Update
        const badgeSba = document.getElementById('badge-sba');
        const fundSba = document.getElementById('fund-sba');
        const tabSba = document.getElementById('tab-sba');
        if (state.routes.sba.eligible) {
            badgeSba.innerText = 'ELIGIBLE';
            badgeSba.className = 'text-[8px] font-mono px-1.5 py-0.5 rounded bg-cobaltBlue/20 text-cobaltBlue border border-cobaltBlue/30 uppercase';
            fundSba.innerText = `Up to ${formatCurrency(state.routes.sba.amount)}`;
            tabSba.disabled = false;
            tabSba.classList.remove('opacity-40');
        } else {
            badgeSba.innerText = 'DECLINED';
            badgeSba.className = 'text-[8px] font-mono px-1.5 py-0.5 rounded bg-signalOrange/10 text-signalOrange border border-signalOrange/30 uppercase';
            fundSba.innerText = 'FICO/Biz Age Min';
            tabSba.classList.add('opacity-40');
            if (state.selectedRoute === 'sba') state.selectedRoute = 'mca'; // fallback logic
        }

        // MCA display Update
        const badgeMca = document.getElementById('badge-mca');
        const fundMca = document.getElementById('fund-mca');
        const tabMca = document.getElementById('tab-mca');
        if (state.routes.mca.eligible) {
            badgeMca.innerText = 'ELIGIBLE';
            badgeMca.className = 'text-[8px] font-mono px-1.5 py-0.5 rounded bg-signalOrange/20 text-signalOrange border border-signalOrange/30 uppercase';
            fundMca.innerText = `Up to ${formatCurrency(state.routes.mca.amount)}`;
            tabMca.disabled = false;
            tabMca.classList.remove('opacity-40');
        } else {
            badgeMca.innerText = 'DECLINED';
            badgeMca.className = 'text-[8px] font-mono px-1.5 py-0.5 rounded bg-signalOrange/10 text-signalOrange border border-signalOrange/30 uppercase';
            fundMca.innerText = 'Under $10k/mo Min';
            tabMca.classList.add('opacity-40');
            if (state.selectedRoute === 'mca') state.selectedRoute = 'factoring'; // fallback logic
        }

        // Factoring display Update
        const badgeFactoring = document.getElementById('badge-factoring');
        const fundFactoring = document.getElementById('fund-factoring');
        const tabFactoring = document.getElementById('tab-factoring');
        if (state.routes.factoring.eligible) {
            badgeFactoring.innerText = 'ELIGIBLE';
            badgeFactoring.className = 'text-[8px] font-mono px-1.5 py-0.5 rounded bg-electricGreen/20 text-electricGreen border border-electricGreen/30 uppercase';
            fundFactoring.innerText = `Up to ${formatCurrency(state.routes.factoring.amount)}`;
            tabFactoring.disabled = false;
            tabFactoring.classList.remove('opacity-40');
        } else {
            badgeFactoring.innerText = 'NOT SUITED';
            badgeFactoring.className = 'text-[8px] font-mono px-1.5 py-0.5 rounded bg-glassBorder text-boneWhite/30 uppercase';
            fundFactoring.innerText = 'Requires B2B Setup';
            tabFactoring.classList.add('opacity-40');
            if (state.selectedRoute === 'factoring') state.selectedRoute = 'mca'; // fallback logic
        }

        // Update selected route highlight style class
        ['sba', 'mca', 'factoring'].forEach(rt => {
            const tabElement = document.getElementById(`tab-${rt}`);
            if (state.selectedRoute === rt) {
                tabElement.classList.add('calc-card-active');
                tabElement.classList.remove('border-glassBorder');
            } else {
                tabElement.classList.remove('calc-card-active');
                tabElement.classList.add('border-glassBorder');
            }
        });

        // Current active parameters output display updates
        const selectedRouteData = state.routes[state.selectedRoute];
        const outFundingVal = document.getElementById('out-funding-amount');
        const outRateMetric = document.getElementById('out-rate-metric');
        const outDuration = document.getElementById('out-duration');

        if (selectedRouteData && selectedRouteData.eligible) {
            outFundingVal.innerText = formatCurrency(selectedRouteData.amount);
            outFundingVal.classList.remove('opacity-30');
            outRateMetric.innerText = selectedRouteData.rateDesc;
            outDuration.innerText = selectedRouteData.duration;
            outDuration.className = "block text-xs font-display font-bold text-electricGreen uppercase mt-0.5";

            // Calculate Commission Earnings
            const { tierName, bonusPct, progressPct } = calculateTiers(state.monthlyRevenue);
            const totalCommissionRate = selectedRouteData.commissionPct + bonusPct;
            const payoutEst = (selectedRouteData.amount * (totalCommissionRate / 100));

            document.getElementById('out-payout-amount').innerText = formatCurrency(payoutEst);
            document.getElementById('out-percentage-rate').innerText = `Payout Level: ${totalCommissionRate.toFixed(1)}% (${selectedRouteData.commissionPct}% base + ${bonusPct}% tier bonus)`;
            
            // Tier tracking graphics updates
            document.getElementById('current-tier-badge').innerText = tierName;
            document.getElementById('tier-progress-text').innerText = `${tierName} Active (Base Volume Calculated)`;
            document.getElementById('tier-progress-bar').style.width = `${progressPct}%`;
        } else {
            // System Fallback Screen state values
            outFundingVal.innerText = "$0.00";
            outFundingVal.classList.add('opacity-30');
            outRateMetric.innerText = "Current metrics below approval matrix";
            outDuration.innerText = "Select eligible profile metrics";
            outDuration.className = "block text-xs font-display font-bold text-signalOrange uppercase mt-0.5";
            document.getElementById('out-payout-amount').innerText = "$0.00";
            document.getElementById('out-percentage-rate').innerText = "Commission locked due to status eligibility limit";
        }
    }

    // Attach Interactive Event Listeners
    function attachListeners() {
        const monthlyRevSlider = document.getElementById('monthly-rev');
        const avgBalanceSlider = document.getElementById('avg-balance');
        const yearsBizSelect = document.getElementById('years-biz');
        const creditScoreSelect = document.getElementById('credit-score');

        monthlyRevSlider.addEventListener('input', (e) => {
            state.monthlyRevenue = parseInt(e.target.value);
            updateDOM();
        });

        avgBalanceSlider.addEventListener('input', (e) => {
            state.averageBalance = parseInt(e.target.value);
            updateDOM();
        });

        yearsBizSelect.addEventListener('change', (e) => {
            state.yearsInBusiness = parseFloat(e.target.value);
            updateDOM();
        });

        creditScoreSelect.addEventListener('change', (e) => {
            state.creditScore = parseInt(e.target.value);
            updateDOM();
        });

        // Industry Buttons Handler
        const industryButtons = document.querySelectorAll('#industry-selector .ind-btn');
        industryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const indType = btn.getAttribute('data-ind');
                state.selectedIndustry = indType;

                // Update styling selectors
                industryButtons.forEach(b => {
                    b.classList.remove('bg-electricGreen', 'text-matteBlack', 'border-black');
                    b.classList.add('bg-graphiteGray', 'text-boneWhite', 'border-glassBorder');
                });
                btn.classList.remove('bg-graphiteGray', 'text-boneWhite', 'border-glassBorder');
                btn.classList.add('bg-electricGreen', 'text-matteBlack', 'border-black');

                updateDOM();
            });
        });

        // Trigger default industry styling selection on initial load
        const defaultIndBtn = document.querySelector(`#industry-selector [data-ind="${state.selectedIndustry}"]`);
        if (defaultIndBtn) {
            defaultIndBtn.classList.remove('bg-graphiteGray', 'text-boneWhite', 'border-glassBorder');
            defaultIndBtn.classList.add('bg-electricGreen', 'text-matteBlack', 'border-black');
        }

        // Direct Desk Route Switcher Selection Click Handling
        ['sba', 'mca', 'factoring'].forEach(rt => {
            const tabBtn = document.getElementById(`tab-${rt}`);
            tabBtn.addEventListener('click', () => {
                if (state.routes[rt].eligible) {
                    state.selectedRoute = rt;
                    updateDOM();
                }
            });
        });

        // Trigger dynamic mock actions matching external systems
        const actionButtonSubmit = document.getElementById('btn-submit-routing');
        actionButtonSubmit.addEventListener('click', () => {
            const selectedRouteData = state.routes[state.selectedRoute];
            if (selectedRouteData && selectedRouteData.eligible) {
                const formattedAmt = formatCurrency(selectedRouteData.amount);
                alert(`Moonshine Engine Action:\nRoute Locked: /partners/underwriting/portal?route=${state.selectedRoute}&volume=${selectedRouteData.amount}\nParameters: FICO: ${state.creditScore}, Monthly Volume: ${formatCurrency(state.monthlyRevenue)}\nEstimates locked with standard tracking protocol.\n\nSimulated underwriting packet generated for immediate validation processing.`);
            } else {
                alert("Cannot generate packet: Please adjust parameters above approval limits for at least one dynamic desk.");
            }
        });
    }

    // Auto-Mount Logic onto DOM Container on Document Ready / Module Import
    function mountCalculator() {
        const mountPoint = document.getElementById('moonshine-calculator-app');
        if (mountPoint) {
            mountPoint.innerHTML = calculatorTemplate;
            attachListeners();
            updateDOM();
        } else {
            console.warn("Moonshine Engine: target selector div #moonshine-calculator-app was not found inside DOM context.");
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountCalculator);
    } else {
        mountCalculator();
    }

    // Export interface functions to Global Window if required by parent application scripts
    window.MoonshineFintechCalculator = {
        state: state,
        recalculate: function() {
            updateDOM();
        },
        updateInput: function(param, value) {
            if (state[param] !== undefined) {
                state[param] = value;
                updateDOM();
            }
        }
    };
})();