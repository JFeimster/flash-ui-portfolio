(function() {
    // 1. Inject styling overrides for Finder controls to maintain extreme Brutalist aesthetics
    const style = document.createElement('style');
    style.textContent = `
        .finder-range {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 12px;
            background: #000000;
            border: 2px solid #27272a;
            outline: none;
        }
        .finder-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #00f0ff;
            border: 2px solid #000000;
            box-shadow: 2px 2px 0px 0px #000000;
            cursor: pointer;
            border-radius: 0;
            transition: transform 0.1s ease, background-color 0.1s ease;
        }
        .finder-range::-webkit-slider-thumb:active {
            transform: scale(1.15);
            background: #ff007a;
        }
        @keyframes brutalPulse {
            0%, 100% { border-color: #000000; box-shadow: 6px 6px 0px 0px #00f0ff; }
            50% { border-color: #ff007a; box-shadow: 10px 10px 0px 0px #ff007a; }
        }
        .focused-path {
            animation: brutalPulse 1.5s infinite;
        }
    `;
    document.head.appendChild(style);

    // 2. State & Constants
    const STATE = {
        arr: 1500000,       // Default $1.5M ARR
        runway: 14,         // Default 14 Months
        age: 24,            // Default 24 Months (2 years)
        capital: 2500000    // Tied to existing main funding slider
    };

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });

    // 3. UI Template Generation
    const finderHTML = `
        <div class="relative overflow-hidden bg-black border-4 border-black p-6 md:p-8 shadow-brutal-pink space-y-6">
            <!-- Neon Warning Header Accent -->
            <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-neoMagenta via-neoTeal to-neoLime"></div>
            
            <!-- Dashboard Title / Mode Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-zinc-800">
                <div class="space-y-1">
                    <div class="inline-flex items-center gap-2">
                        <span class="px-2 py-0.5 bg-neoYellow text-black font-black text-[10px] tracking-wider uppercase border border-black">
                            DECISION SYS v2.5
                        </span>
                        <span class="w-2 h-2 bg-neoMagenta rounded-full animate-pulse"></span>
                    </div>
                    <h3 class="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                        ELIGIBILITY MATCHING ENGINE
                    </h3>
                </div>
                <div class="text-left md:text-right font-mono text-xs text-zinc-400">
                    STATUS: <span class="text-neoLime font-black uppercase">ANALYZING PORTFOLIO VITALS</span>
                </div>
            </div>

            <!-- Inputs Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <!-- Input 1: ARR -->
                <div class="bg-zinc-900/50 p-4 border-2 border-zinc-800 space-y-3">
                    <div class="flex justify-between items-center">
                        <label class="text-xs font-black text-zinc-300 uppercase tracking-wider">ANNUAL RECURRING REV (ARR)</label>
                        <span id="finder-arr-badge" class="font-mono text-xs font-black text-neoTeal bg-black px-2 py-0.5 border border-zinc-800">$1.5M</span>
                    </div>
                    <input type="range" id="finder-arr" min="100000" max="15000000" step="100000" value="1500000" class="finder-range">
                    <div class="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
                        <span>$100K</span>
                        <span>$15M</span>
                    </div>
                </div>

                <!-- Input 2: RUNWAY -->
                <div class="bg-zinc-900/50 p-4 border-2 border-zinc-800 space-y-3">
                    <div class="flex justify-between items-center">
                        <label class="text-xs font-black text-zinc-300 uppercase tracking-wider">CASH RUNWAY</label>
                        <span id="finder-runway-badge" class="font-mono text-xs font-black text-neoMagenta bg-black px-2 py-0.5 border border-zinc-800">14 Mos</span>
                    </div>
                    <input type="range" id="finder-runway" min="1" max="36" step="1" value="14" class="finder-range">
                    <div class="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
                        <span>1 MO</span>
                        <span>36+ MOS</span>
                    </div>
                </div>

                <!-- Input 3: BUSINESS AGE -->
                <div class="bg-zinc-900/50 p-4 border-2 border-zinc-800 space-y-3">
                    <div class="flex justify-between items-center">
                        <label class="text-xs font-black text-zinc-300 uppercase tracking-wider">OPERATIONAL AGE</label>
                        <span id="finder-age-badge" class="font-mono text-xs font-black text-neoLime bg-black px-2 py-0.5 border border-zinc-800">2 Yrs</span>
                    </div>
                    <input type="range" id="finder-age" min="1" max="60" step="1" value="24" class="finder-range">
                    <div class="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
                        <span>1 MO</span>
                        <span>5 YRS+</span>
                    </div>
                </div>

                <!-- Input 4: SYNCED TARGET CAPITAL -->
                <div class="bg-zinc-900/50 p-4 border-2 border-zinc-800 space-y-3">
                    <div class="flex justify-between items-center">
                        <label class="text-xs font-black text-zinc-300 uppercase tracking-wider">TARGET CAPITAL</label>
                        <span id="finder-capital-badge" class="font-mono text-xs font-black text-neoYellow bg-black px-2 py-0.5 border border-zinc-800">$2.5M</span>
                    </div>
                    <input type="range" id="finder-capital" min="250000" max="10000000" step="250000" value="2500000" class="finder-range">
                    <div class="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
                        <span>$250K</span>
                        <span>$10M</span>
                    </div>
                </div>

            </div>

            <!-- Live Match Evaluation Matrix Panel -->
            <div class="space-y-4">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-black uppercase text-zinc-400 font-mono">[ REAL-TIME MATCH COEFFICIENTS ]</span>
                    <div class="h-[2px] flex-1 bg-zinc-800"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <!-- Path A Real-time Match -->
                    <div id="card-match-a" class="border-2 border-black bg-zinc-950 p-5 space-y-4 transition-all duration-200">
                        <div class="flex justify-between items-start">
                            <span class="text-xs font-mono font-black text-neoMagenta">PATH // A (RBF)</span>
                            <span id="score-badge-a" class="font-black text-xs px-2 py-0.5 bg-neoMagenta text-black border border-black">--%</span>
                        </div>
                        <div class="space-y-1">
                            <h4 class="text-lg font-black text-white uppercase tracking-tight">SaaS Revenue-Based</h4>
                            <p class="text-[11px] text-zinc-400 font-semibold leading-normal">Optimized for recurrent SaaS dynamics with direct operational API match metrics.</p>
                        </div>
                        
                        <!-- Mini Checklist Vitals -->
                        <div class="space-y-1.5 text-xs font-mono text-zinc-300 pt-1 border-t border-zinc-900">
                            <div class="flex items-center gap-2" id="chk-a-arr">
                                <span class="indicator">●</span> <span>ARR &gt; $100K</span>
                            </div>
                            <div class="flex items-center gap-2" id="chk-a-age">
                                <span class="indicator">●</span> <span>Age &gt; 6 months</span>
                            </div>
                            <div class="flex items-center gap-2" id="chk-a-cap">
                                <span class="indicator">●</span> <span>Cap &le; $5M limit</span>
                            </div>
                        </div>

                        <button id="focus-path-a" class="w-full py-2 bg-neoMagenta hover:bg-black hover:text-neoMagenta text-black font-black text-xs uppercase tracking-wider border-2 border-black transition-all">
                            LOCK & VIEW DETAILS
                        </button>
                    </div>

                    <!-- Path B Real-time Match -->
                    <div id="card-match-b" class="border-2 border-black bg-zinc-950 p-5 space-y-4 transition-all duration-200">
                        <div class="flex justify-between items-start">
                            <span class="text-xs font-mono font-black text-neoTeal">PATH // B (Venture Debt)</span>
                            <span id="score-badge-b" class="font-black text-xs px-2 py-0.5 bg-neoTeal text-black border border-black">--%</span>
                        </div>
                        <div class="space-y-1">
                            <h4 class="text-lg font-black text-white uppercase tracking-tight">Growth Venture Debt</h4>
                            <p class="text-[11px] text-zinc-400 font-semibold leading-normal">Optimized to preserve founder equity, linked directly to operational runways.</p>
                        </div>

                        <!-- Mini Checklist Vitals -->
                        <div class="space-y-1.5 text-xs font-mono text-zinc-300 pt-1 border-t border-zinc-900">
                            <div class="flex items-center gap-2" id="chk-b-arr">
                                <span class="indicator">●</span> <span>ARR &gt; $500K</span>
                            </div>
                            <div class="flex items-center gap-2" id="chk-b-runway">
                                <span class="indicator">●</span> <span>Runway &gt; 6 Mos</span>
                            </div>
                            <div class="flex items-center gap-2" id="chk-b-age">
                                <span class="indicator">●</span> <span>Age &gt; 12 months</span>
                            </div>
                        </div>

                        <button id="focus-path-b" class="w-full py-2 bg-neoTeal hover:bg-black hover:text-neoTeal text-black font-black text-xs uppercase tracking-wider border-2 border-black transition-all">
                            LOCK & VIEW DETAILS
                        </button>
                    </div>

                    <!-- Path C Real-time Match -->
                    <div id="card-match-c" class="border-2 border-black bg-zinc-950 p-5 space-y-4 transition-all duration-200">
                        <div class="flex justify-between items-start">
                            <span class="text-xs font-mono font-black text-neoYellow">PATH // C (SBA Term)</span>
                            <span id="score-badge-c" class="font-black text-xs px-2 py-0.5 bg-neoYellow text-black border border-black">--%</span>
                        </div>
                        <div class="space-y-1">
                            <h4 class="text-lg font-black text-white uppercase tracking-tight">SBA 7(a) Term Loan</h4>
                            <p class="text-[11px] text-zinc-400 font-semibold leading-normal">Rigid regulatory alignment, requiring mature operating profiles & strict compliance.</p>
                        </div>

                        <!-- Mini Checklist Vitals -->
                        <div class="space-y-1.5 text-xs font-mono text-zinc-300 pt-1 border-t border-zinc-900">
                            <div class="flex items-center gap-2" id="chk-c-arr">
                                <span class="indicator">●</span> <span>ARR &gt; $200K</span>
                            </div>
                            <div class="flex items-center gap-2" id="chk-c-age">
                                <span class="indicator">●</span> <span>Age &gt; 24 Mos (2 Yrs)</span>
                            </div>
                            <div class="flex items-center gap-2" id="chk-c-cap">
                                <span class="indicator">●</span> <span>Cap &le; $5M limit</span>
                            </div>
                        </div>

                        <button id="focus-path-c" class="w-full py-2 bg-neoYellow hover:bg-black hover:text-neoYellow text-black font-black text-xs uppercase tracking-wider border-2 border-black transition-all">
                            LOCK & VIEW DETAILS
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `;

    // 4. Initialization & Mounting
    function init() {
        const targetContainer = document.querySelector('.max-w-7xl');
        if (!targetContainer) return;

        // Create a wrapper div to integrate into the grid flow nicely
        const finderWrapper = document.createElement('div');
        finderWrapper.id = "funding-finder-dashboard";
        finderWrapper.className = "w-full space-y-6";
        finderWrapper.innerHTML = finderHTML;

        // Insert before the Comparison Matrix Table
        const tableContainer = document.querySelector('.overflow-x-auto');
        if (tableContainer) {
            targetContainer.insertBefore(finderWrapper, tableContainer);
        } else {
            targetContainer.appendChild(finderWrapper);
        }

        // Bind events
        bindEvents();
        // Initial match computation
        evaluateMatches();
    }

    // 5. DOM Event Binding
    function bindEvents() {
        // Finder sliders
        const arrSlider = document.getElementById('finder-arr');
        const runwaySlider = document.getElementById('finder-runway');
        const ageSlider = document.getElementById('finder-age');
        const capitalSlider = document.getElementById('finder-capital');

        // External main slider
        const mainSlider = document.getElementById('funding-slider');

        // Synchronize finder and main funding sliders
        if (mainSlider) {
            mainSlider.addEventListener('input', (e) => {
                if (capitalSlider) {
                    capitalSlider.value = e.target.value;
                    STATE.capital = parseInt(e.target.value, 10);
                    updateBadge('finder-capital-badge', formatter.format(STATE.capital));
                    evaluateMatches();
                }
            });
        }

        arrSlider.addEventListener('input', (e) => {
            STATE.arr = parseInt(e.target.value, 10);
            const formatted = STATE.arr >= 1000000 ? `$${(STATE.arr / 1000000).toFixed(1)}M` : formatter.format(STATE.arr);
            updateBadge('finder-arr-badge', formatted);
            evaluateMatches();
        });

        runwaySlider.addEventListener('input', (e) => {
            STATE.runway = parseInt(e.target.value, 10);
            updateBadge('finder-runway-badge', `${STATE.runway} Mos`);
            evaluateMatches();
        });

        ageSlider.addEventListener('input', (e) => {
            STATE.age = parseInt(e.target.value, 10);
            const years = (STATE.age / 12).toFixed(1);
            updateBadge('finder-age-badge', `${years} Yr${years === '1.0' ? '' : 's'}`);
            evaluateMatches();
        });

        capitalSlider.addEventListener('input', (e) => {
            STATE.capital = parseInt(e.target.value, 10);
            updateBadge('finder-capital-badge', formatter.format(STATE.capital));
            
            // Sync up with main document slider
            if (mainSlider) {
                mainSlider.value = STATE.capital;
                // Trigger the core page's update functions dynamically
                mainSlider.dispatchEvent(new Event('input'));
            }
            evaluateMatches();
        });

        // Path Scroll & Highlights
        document.getElementById('focus-path-a').addEventListener('click', () => focusMatrixColumn('cap-col-a'));
        document.getElementById('focus-path-b').addEventListener('click', () => focusMatrixColumn('cap-col-b'));
        document.getElementById('focus-path-c').addEventListener('click', () => focusMatrixColumn('cap-col-c'));
    }

    function updateBadge(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    // 6. Matching Logic & Scoring Core
    function evaluateMatches() {
        const { arr, runway, age, capital } = STATE;

        // --- PATH A MATCH EVAL ---
        let matchA = true;
        let scoreA = 0;
        let checksA = { arr: false, age: false, cap: false };

        if (arr >= 100000) checksA.arr = true;
        if (age >= 6) checksA.age = true;
        if (capital <= 5000000) checksA.cap = true;

        if (checksA.arr && checksA.age && checksA.cap) {
            // High efficiency score logic: dynamic based on capital vs ARR ratios
            const ratio = capital / arr;
            if (ratio <= 1.0) scoreA = 95;
            else if (ratio <= 2.0) scoreA = 75;
            else scoreA = 45;
        } else {
            matchA = false;
        }
        updateChecklist('chk-a-arr', checksA.arr);
        updateChecklist('chk-a-age', checksA.age);
        updateChecklist('chk-a-cap', checksA.cap);
        renderMatchResults('card-match-a', 'score-badge-a', matchA, scoreA, '#ff007a');

        // --- PATH B MATCH EVAL ---
        let matchB = true;
        let scoreB = 0;
        let checksB = { arr: false, runway: false, age: false };

        if (arr >= 500000) checksB.arr = true;
        if (runway >= 6) checksB.runway = true;
        if (age >= 12) checksB.age = true;

        if (checksB.arr && checksB.runway && checksB.age) {
            // Match score favors longer runways & solid capital base
            scoreB = Math.min(100, Math.round(50 + (runway * 1.2) + (arr / 300000)));
        } else {
            matchB = false;
        }
        updateChecklist('chk-b-arr', checksB.arr);
        updateChecklist('chk-b-runway', checksB.runway);
        updateChecklist('chk-b-age', checksB.age);
        renderMatchResults('card-match-b', 'score-badge-b', matchB, scoreB, '#00f0ff');

        // --- PATH C MATCH EVAL ---
        let matchC = true;
        let scoreC = 0;
        let checksC = { arr: false, age: false, cap: false };

        if (arr >= 200000) checksC.arr = true;
        if (age >= 24) checksC.age = true;
        if (capital <= 5000000) checksC.cap = true;

        if (checksC.arr && checksC.age && checksC.cap) {
            // SBA loans love maturity & conservative ratios
            const ratio = capital / arr;
            scoreC = Math.min(100, Math.round(40 + (age / 1.5) + (ratio < 1.5 ? 25 : 5)));
        } else {
            matchC = false;
        }
        updateChecklist('chk-c-arr', checksC.arr);
        updateChecklist('chk-c-age', checksC.age);
        updateChecklist('chk-c-cap', checksC.cap);
        renderMatchResults('card-match-c', 'score-badge-c', matchC, scoreC, '#fffb00');
    }

    // 7. Dynamic UI State Updaters
    function updateChecklist(elementId, passed) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const indicator = el.querySelector('.indicator');
        if (passed) {
            indicator.textContent = '✓';
            indicator.className = 'indicator text-neoLime font-black mr-1';
            el.className = 'flex items-center gap-2 text-zinc-300 font-bold';
        } else {
            indicator.textContent = '✗';
            indicator.className = 'indicator text-[#ff0055] font-black mr-1';
            el.className = 'flex items-center gap-2 text-zinc-500 line-through decoration-[#ff0055] decoration-2';
        }
    }

    function renderMatchResults(cardId, badgeId, isEligible, score, colorHex) {
        const card = document.getElementById(cardId);
        const badge = document.getElementById(badgeId);
        if (!card || !badge) return;

        if (isEligible) {
            badge.textContent = `${score}% MATCH`;
            badge.style.backgroundColor = colorHex;
            badge.style.color = '#000000';
            card.style.borderColor = colorHex;
            card.style.opacity = '1';
        } else {
            badge.textContent = 'INELIGIBLE';
            badge.style.backgroundColor = '#ff0055';
            badge.style.color = '#ffffff';
            card.style.borderColor = '#1f1f2e';
            card.style.opacity = '0.65';
        }
    }

    // 8. Focus Matrix Scroll Assist
    function focusMatrixColumn(colId) {
        const col = document.getElementById(colId);
        if (!col) return;

        // Smoothly bring the matrix into context
        col.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Apply a visual brutalist focus flash sequence
        col.classList.add('focused-path');
        setTimeout(() => {
            col.classList.remove('focused-path');
        }, 3000);
    }

    // Let Engine Mount
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();