(function() {
    function init() {
        const container = document.querySelector('.max-w-7xl');
        if (!container) return;

        // Prevent double initialization
        if (document.getElementById('brutal-simulator-root')) return;

        // Injected Styles for custom slider styling consistency
        const style = document.createElement('style');
        style.innerHTML = `
            .sim-stripe-accent {
                background-color: #000;
                background-image: repeating-linear-gradient(
                    -45deg,
                    #000,
                    #000 6px,
                    #39ff14 6px,
                    #39ff14 12px
                );
            }
        `;
        document.head.appendChild(style);

        // Build Simulator Section Wrapper
        const simContainer = document.createElement('div');
        simContainer.id = 'brutal-simulator-root';
        simContainer.className = "space-y-8 mt-16 pt-12 border-t-4 border-black";

        // HTML Layout matching the core design system
        simContainer.innerHTML = `
            <!-- Module Title Block -->
            <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                <div class="space-y-2">
                    <div class="inline-flex items-center gap-2">
                        <span class="px-3 py-1 text-xs font-black bg-neoYellow text-black border-2 border-black uppercase tracking-wider shadow-brutal-white-sm">
                            MODULE // 02
                        </span>
                        <span class="text-xs font-mono font-bold text-neoYellow">INTERACTIVE CALCULATION ENGINE</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
                        COST & <span class="text-transparent bg-clip-text bg-gradient-to-r from-neoLime via-neoTeal to-neoYellow underline decoration-4 decoration-white">DILUTION SIMULATOR</span>
                    </h2>
                    <p class="text-sm text-zinc-400 max-w-2xl font-semibold leading-relaxed">
                        Contrast the long-term impact of Venture Capital equity financing against non-dilutive Growth Debt. Calibrate terminal outcomes instantly.
                    </p>
                </div>
                <div class="text-xs font-mono text-zinc-500 font-bold tracking-widest border-2 border-zinc-800 p-2.5 bg-zinc-950 uppercase shrink-0">
                    Calculations: Stochastic VC Model v1.9
                </div>
            </div>

            <!-- Main Interface Grid -->
            <div class="border-4 border-black bg-black p-1 shadow-brutal-pink">
                <!-- Inner Module Title bar -->
                <div class="bg-neoLime text-black p-4 border-b-4 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span class="font-black uppercase text-sm tracking-widest">[ SIMULATION SYSTEM ENGAGED ]</span>
                    <span class="text-xs font-mono font-bold bg-black text-neoLime px-2 py-0.5 border border-black">LIVE LINK SYNCED</span>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-black">
                    <!-- Left Column: Input Panel -->
                    <div class="lg:col-span-5 bg-brutalDark p-6 space-y-6 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
                        <h3 class="text-xs font-black uppercase tracking-widest text-zinc-400 font-mono pb-2 border-b border-zinc-800 flex items-center gap-2">
                            <span class="w-2.5 h-2.5 bg-neoLime border border-black rounded-full"></span>
                            Adjust Core Assumptions
                        </h3>

                        <!-- Slider 1: Valuation -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-end">
                                <span class="text-xs font-black text-white uppercase tracking-wider">Enterprise Valuation</span>
                                <span id="sim-val-display" class="text-xl font-black text-neoYellow font-mono">$10,000,000</span>
                            </div>
                            <input 
                                type="range" 
                                id="sim-val-slider" 
                                min="2000000" 
                                max="100000000" 
                                step="1000000" 
                                value="15000000" 
                                class="w-full h-3 bg-black border-2 border-zinc-800 appearance-none cursor-pointer focus:outline-none"
                            >
                            <div class="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
                                <span>$2.0M (Pre)</span>
                                <span>$100.0M Max</span>
                            </div>
                        </div>

                        <!-- Slider 2: Equity Round Size -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-end">
                                <span class="text-xs font-black text-white uppercase tracking-wider">Target Equity Round</span>
                                <span id="sim-eq-display" class="text-xl font-black text-neoMagenta font-mono">$2,000,000</span>
                            </div>
                            <input 
                                type="range" 
                                id="sim-eq-slider" 
                                min="250000" 
                                max="25000000" 
                                step="250000" 
                                value="3000000" 
                                class="w-full h-3 bg-black border-2 border-zinc-800 appearance-none cursor-pointer focus:outline-none"
                            >
                            <div class="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
                                <span>$250K Target</span>
                                <span>$25.0M Cap</span>
                            </div>
                        </div>

                        <!-- Slider 3: Debt Allocation (Connected to main site slider) -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-end">
                                <span class="text-xs font-black text-white uppercase tracking-wider">Alternative Debt Size</span>
                                <span id="sim-debt-display" class="text-xl font-black text-neoTeal font-mono">$2,500,000</span>
                            </div>
                            <input 
                                type="range" 
                                id="sim-debt-slider" 
                                min="250000" 
                                max="10000000" 
                                step="250000" 
                                value="2500000" 
                                class="w-full h-3 bg-black border-2 border-zinc-800 appearance-none cursor-pointer focus:outline-none"
                            >
                            <div class="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
                                <span>$250K Start</span>
                                <span>$10.0M Max</span>
                            </div>
                        </div>

                        <!-- Slider 4: Revenue Growth -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-end">
                                <span class="text-xs font-black text-white uppercase tracking-wider">Projected Growth Rate</span>
                                <span id="sim-growth-display" class="text-xl font-black text-neoLime font-mono">60%</span>
                            </div>
                            <input 
                                type="range" 
                                id="sim-growth-slider" 
                                min="10" 
                                max="200" 
                                step="5" 
                                value="60" 
                                class="w-full h-3 bg-black border-2 border-zinc-800 appearance-none cursor-pointer focus:outline-none"
                            >
                            <div class="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
                                <span>10% Steady</span>
                                <span>200% Hyper</span>
                            </div>
                        </div>

                        <!-- Mini Hazard Stripe Alert Box -->
                        <div class="border-2 border-black p-4 bg-zinc-950 flex gap-3 relative overflow-hidden">
                            <div class="absolute left-0 top-0 bottom-0 w-2 sim-stripe-accent"></div>
                            <div class="pl-2 space-y-1">
                                <span class="text-xs font-black text-neoLime uppercase tracking-wider block font-mono">INTEGRATION SYNC ACTIVE</span>
                                <p class="text-[11px] text-zinc-400 font-bold leading-normal">
                                    Moving the Alternative Debt controller above modifies the core calculator on the primary table synchronously.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Visualization Panel -->
                    <div class="lg:col-span-7 bg-brutalCard p-6 flex flex-col justify-between space-y-6">
                        <!-- Key Output Metrics -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <!-- Metric 1 -->
                            <div class="border-4 border-black bg-black p-4 shadow-brutal-pink relative overflow-hidden">
                                <span class="absolute top-1 right-2 text-[8px] font-mono font-black text-zinc-700">VC TRACK</span>
                                <span class="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">VC Round Dilution</span>
                                <span id="val-vc-dilution" class="text-3xl font-black text-neoMagenta font-mono block mt-1">16.7%</span>
                                <span class="text-[9px] text-zinc-500 font-bold uppercase mt-1 block">Ownership Liquidation</span>
                            </div>
                            <!-- Metric 2 -->
                            <div class="border-4 border-black bg-black p-4 shadow-brutal-teal relative overflow-hidden">
                                <span class="absolute top-1 right-2 text-[8px] font-mono font-black text-zinc-700">DEBT COV</span>
                                <span class="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">Warrant Dilution</span>
                                <span id="val-debt-dilution" class="text-3xl font-black text-neoTeal font-mono block mt-1">0.17%</span>
                                <span class="text-[9px] text-zinc-500 font-bold uppercase mt-1 block">Anti-dilutive Protection</span>
                            </div>
                            <!-- Metric 3 -->
                            <div class="border-4 border-black bg-black p-4 shadow-brutal-lime relative overflow-hidden">
                                <span class="absolute top-1 right-2 text-[8px] font-mono font-black text-zinc-700">DELTA</span>
                                <span class="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">Dilution Value Saved</span>
                                <span id="val-saved-worth" class="text-3xl font-black text-neoLime font-mono block mt-1">$2,480,000</span>
                                <span class="text-[9px] text-zinc-500 font-bold uppercase mt-1 block">Equity Value Retained</span>
                            </div>
                        </div>

                        <!-- Trajectory Visualizer -->
                        <div class="border-4 border-black bg-zinc-950 p-4 space-y-4 flex-1 flex flex-col justify-between min-h-[250px]">
                            <div class="flex justify-between items-center pb-2 border-b-2 border-black">
                                <span class="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                                    <span class="w-2.5 h-2.5 bg-neoMagenta border border-black rounded-full animate-pulse"></span>
                                    Repayment vs dilution trajectory
                                </span>
                                <span class="text-[9px] font-mono font-black text-zinc-400 bg-zinc-900 px-2 py-0.5 border border-black">
                                    12-MONTH HORIZON
                                </span>
                            </div>

                            <!-- Dynamic SVG / HTML Brutalist Chart representation -->
                            <div class="relative flex-1 w-full flex items-end justify-between px-2 pt-6 min-h-[160px]">
                                <!-- Horizontal Background Grid Grid -->
                                <div class="absolute inset-x-0 bottom-4 top-0 flex flex-col justify-between pointer-events-none opacity-20">
                                    <div class="border-t border-dashed border-zinc-600 w-full"></div>
                                    <div class="border-t border-dashed border-zinc-600 w-full"></div>
                                    <div class="border-t border-dashed border-zinc-600 w-full"></div>
                                    <div class="border-t border-dashed border-zinc-600 w-full"></div>
                                </div>

                                <!-- Chart bars wrapper -->
                                <div id="sim-chart-bars" class="absolute inset-0 flex items-end justify-between px-4 pb-2 pt-6 z-10">
                                    <!-- Populated dynamically via JS -->
                                </div>
                            </div>

                            <!-- Chart Legend -->
                            <div class="flex flex-wrap justify-center gap-6 pt-3 border-t border-zinc-900 text-[10px] font-mono font-bold">
                                <div class="flex items-center gap-2">
                                    <span class="w-3.5 h-3.5 bg-neoMagenta border border-black inline-block"></span>
                                    <span class="text-zinc-400 uppercase">VC Path (Dilution Line)</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="w-3.5 h-3.5 bg-neoTeal border border-black inline-block"></span>
                                    <span class="text-zinc-400 uppercase">Venture Debt (Cash Cost)</span>
                                </div>
                            </div>
                        </div>

                        <!-- Context Summary Box -->
                        <div class="text-xs text-zinc-300 font-semibold leading-relaxed bg-black p-4 border-2 border-black relative">
                            <span class="absolute -top-3 left-4 px-2 py-0.5 bg-neoTeal text-black text-[9px] font-black uppercase border-2 border-black tracking-wider">
                                EXECUTION PERSPECTIVE
                            </span>
                            By utilizing <span class="text-neoTeal font-black">Growth Venture Debt</span> instead of dilution-heavy <span class="text-neoMagenta font-black">VC Capital</span>, your founders retain an additional <span id="summary-savings-percentage" class="text-neoLime font-black">16.5%</span> of total enterprise ownership. At termination, this preserves over <span id="summary-savings-value" class="text-neoLime font-black">$2.48M</span> in liquid assets.
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert simulator into DOM before the target grid cards block
        const grids = container.querySelectorAll('.grid');
        const targetGrid = grids[grids.length - 1]; // Visual footer grid
        if (targetGrid) {
            container.insertBefore(simContainer, targetGrid);
        } else {
            container.appendChild(simContainer);
        }

        // Element Selectors
        const simValSlider = document.getElementById('sim-val-slider');
        const simEqSlider = document.getElementById('sim-eq-slider');
        const simDebtSlider = document.getElementById('sim-debt-slider');
        const simGrowthSlider = document.getElementById('sim-growth-slider');

        const displayVal = document.getElementById('sim-val-display');
        const displayEq = document.getElementById('sim-eq-display');
        const displayDebt = document.getElementById('sim-debt-display');
        const displayGrowth = document.getElementById('sim-growth-display');

        const outVcDilution = document.getElementById('val-vc-dilution');
        const outDebtDilution = document.getElementById('val-debt-dilution');
        const outSavedWorth = document.getElementById('val-saved-worth');

        const chartBars = document.getElementById('sim-chart-bars');
        const summarySavingsPercentage = document.getElementById('summary-savings-percentage');
        const summarySavingsValue = document.getElementById('summary-savings-value');

        // Main web app references
        const mainSlider = document.getElementById('funding-slider');

        const formatCurrency = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });

        function updateSimulator() {
            const val = parseFloat(simValSlider.value);
            const eq = parseFloat(simEqSlider.value);
            const debt = parseFloat(simDebtSlider.value);
            const growth = parseFloat(simGrowthSlider.value) / 100;

            // Update Input Displays
            displayVal.textContent = formatCurrency.format(val);
            displayEq.textContent = formatCurrency.format(eq);
            displayDebt.textContent = formatCurrency.format(debt);
            displayGrowth.textContent = `${Math.round(growth * 100)}%`;

            // VC post-money dilution calculation
            const postMoneyVal = val + eq;
            const vcDilution = (eq / postMoneyVal) * 100;

            // Debt warrant dilution calculations (standard 1% warrant coverage proxy)
            const warrantCoverage = 0.01; 
            const warrantValue = debt * warrantCoverage;
            const debtDilution = (warrantValue / val) * 100;

            // Value Saved calculation
            const savedPct = Math.max(0, vcDilution - debtDilution);
            const savedWorth = (savedPct / 100) * val;

            // Assign stats
            outVcDilution.textContent = `${vcDilution.toFixed(1)}%`;
            outDebtDilution.textContent = `${debtDilution.toFixed(2)}%`;
            outSavedWorth.textContent = formatCurrency.format(savedWorth);

            summarySavingsPercentage.textContent = `${savedPct.toFixed(1)}%`;
            summarySavingsValue.textContent = formatCurrency.format(savedWorth);

            // Synchronize with the main page RBF engine slider if values mismatch
            if (mainSlider && parseInt(mainSlider.value) !== parseInt(debt)) {
                mainSlider.value = debt;
                mainSlider.dispatchEvent(new Event('input'));
            }

            // Generate Repayment Chart Columns (12 Months)
            let barsHtml = '';
            for (let i = 1; i <= 12; i++) {
                // Calculate monthly payment: decreasing principal + dynamic growth-risk interest rate
                const principalMonthly = debt / 12;
                const baseInterestRate = 0.11; // 11% basic rate
                const riskInterestAdjuster = growth * 0.015; // compound growth factor risk
                const dynamicInterestRate = baseInterestRate + riskInterestAdjuster;
                const outstandingPrincipal = debt - (principalMonthly * (i - 1));
                const monthlyInterest = (outstandingPrincipal * dynamicInterestRate) / 12;
                const monthlyPaymentTotal = principalMonthly + monthlyInterest;

                // Scaling parameters
                const maxRepaymentBound = (10000000 / 12) + (10000000 * 0.15) / 12; 
                const scaleRepaymentH = Math.min(100, (monthlyPaymentTotal / maxRepaymentBound) * 100);
                const scaleDilutionH = Math.min(100, (vcDilution / 50) * 100); // 50% max dilution boundary

                barsHtml += `
                    <div class="flex flex-col items-center justify-end h-full w-[7%] group relative">
                        <!-- Brutalist Custom Tooltip -->
                        <div class="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                            <div class="bg-black text-white text-[9px] font-mono border-2 border-neoLime p-2 whitespace-nowrap shadow-brutal-white-sm">
                                <div class="text-neoMagenta font-black">VC Dilution: ${vcDilution.toFixed(1)}%</div>
                                <div class="text-neoTeal font-black">Repayment: ${formatCurrency.format(monthlyPaymentTotal)}</div>
                                <div class="text-[7px] text-zinc-500 uppercase mt-0.5">Month ${i} Target</div>
                            </div>
                            <div class="w-2 h-2 bg-black border-r-2 border-b-2 border-neoLime transform rotate-45 -mt-1.5"></div>
                        </div>

                        <!-- Combined Graphic Columns -->
                        <div class="w-full flex items-end justify-center gap-[3px] h-full">
                            <!-- VC Dilution Height Bar (Magenta) -->
                            <div class="w-1/2 bg-neoMagenta border border-black hover:bg-white transition-all duration-150" style="height: ${scaleDilutionH}%"></div>
                            <!-- Debt Capital Cost (Teal) -->
                            <div class="w-1/2 bg-neoTeal border border-black hover:bg-white transition-all duration-150" style="height: ${scaleRepaymentH}%"></div>
                        </div>

                        <!-- Month Stamp -->
                        <span class="text-[8px] font-mono font-black text-zinc-500 mt-2">M${i}</span>
                    </div>
                `;
            }
            chartBars.innerHTML = barsHtml;
        }

        // Setup Event Listeners for Simulator Controls
        simValSlider.addEventListener('input', updateSimulator);
        simEqSlider.addEventListener('input', updateSimulator);
        simDebtSlider.addEventListener('input', updateSimulator);
        simGrowthSlider.addEventListener('input', updateSimulator);

        // Bind outer main slider changes to simulator seamlessly
        if (mainSlider) {
            mainSlider.addEventListener('input', (e) => {
                if (parseInt(simDebtSlider.value) !== parseInt(e.target.value)) {
                    simDebtSlider.value = e.target.value;
                    updateSimulator();
                }
            });
        }

        // Prime execution
        updateSimulator();
    }

    // Direct Bootloader
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();