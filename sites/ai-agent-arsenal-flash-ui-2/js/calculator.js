// THE WAR ROOM CALCULATOR (OPERATOR CASH FLOW SIMULATOR)
// Dynamic brutalist simulation module injected directly into the AI Agent Arsenal platform.

(() => {
    // 1. INJECT WAR ROOM STYLES
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        .war-room-section {
            background-color: var(--base-black);
            border-bottom: var(--border-width) solid var(--off-white);
            position: relative;
        }
        
        .war-room-grid {
            display: grid;
            grid-template-columns: 1fr 1.2fr 0.8fr;
            gap: 2rem;
            margin-top: 3rem;
        }

        @media (max-width: 1200px) {
            .war-room-grid {
                grid-template-columns: 1fr 1fr;
            }
        }

        @media (max-width: 800px) {
            .war-room-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Input Deck styling */
        .control-deck {
            background-color: var(--carbon-black);
            border: var(--border-width) solid var(--off-white);
            padding: 2rem;
            box-shadow: 8px 8px 0 var(--orange);
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .control-deck-title {
            color: var(--orange);
            border-bottom: 2px dashed var(--graphite);
            padding-bottom: 0.75rem;
            margin-bottom: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .input-group label {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            font-weight: bold;
            color: var(--off-white);
            display: flex;
            justify-content: space-between;
        }

        .input-group label span {
            color: var(--cyan);
        }

        .calc-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 8px;
            background: var(--graphite);
            outline: none;
            border: 1px solid var(--off-white);
        }

        .calc-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: var(--green);
            cursor: pointer;
            border: 2px solid var(--base-black);
            box-shadow: 2px 2px 0 var(--magenta);
        }

        .calc-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: var(--green);
            cursor: pointer;
            border: 2px solid var(--base-black);
            box-shadow: 2px 2px 0 var(--magenta);
        }

        .radio-switch-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
            border: 2px solid var(--off-white);
            background: var(--base-black);
            padding: 2px;
        }

        .radio-switch-label {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            text-align: center;
            padding: 6px;
            cursor: pointer;
            background: transparent;
            color: var(--off-white);
            transition: all 0.1s;
            user-select: none;
        }

        .radio-switch-container input[type="radio"] {
            display: none;
        }

        .radio-switch-container input[type="radio"]:checked + .radio-switch-label {
            background-color: var(--cyan);
            color: var(--base-black);
            font-weight: bold;
        }

        /* Matrix Display column */
        .matrix-display {
            background-color: var(--carbon-black);
            border: var(--border-width) solid var(--off-white);
            padding: 2rem;
            box-shadow: 8px 8px 0 var(--magenta);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .matrix-display-title {
            color: var(--magenta);
            border-bottom: 2px dashed var(--graphite);
            padding-bottom: 0.75rem;
            margin-bottom: 1.5rem;
        }

        .metric-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .metric-box {
            background: var(--graphite);
            border: 2px solid var(--graphite);
            padding: 1rem;
            position: relative;
        }

        .metric-box.highlight {
            border-color: var(--green);
        }

        .metric-box::before {
            content: "";
            position: absolute;
            top: 0; left: 0;
            width: 4px; height: 100%;
            background: var(--accent, var(--cyan));
        }

        .metric-name {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: rgba(244, 241, 232, 0.6);
            text-transform: uppercase;
        }

        .metric-val {
            font-size: 1.8rem;
            font-weight: 900;
            font-family: var(--font-mono);
            color: var(--off-white);
            margin-top: 5px;
            word-break: break-all;
        }

        .qualification-meter {
            border: 2px solid var(--off-white);
            background: var(--base-black);
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
        }

        .qual-score-container {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .qual-grade {
            font-size: 2.5rem;
            font-weight: 900;
            font-family: var(--font-mono);
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid currentColor;
            transform: rotate(-3deg);
        }

        .qual-grade.grade-a { color: var(--green); }
        .qual-grade.grade-b { color: var(--cyan); }
        .qual-grade.grade-c { color: var(--yellow); }
        .qual-grade.grade-d { color: var(--orange); }
        .qual-grade.grade-f { color: var(--red); }

        .qual-meta-desc {
            font-size: 0.85rem;
            color: rgba(244, 241, 232, 0.8);
        }

        /* Stress terminal column */
        .stress-terminal {
            background-color: var(--base-black);
            border: var(--border-width) solid var(--off-white);
            padding: 1.5rem;
            box-shadow: 8px 8px 0 var(--green);
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .stress-terminal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--graphite);
            padding-bottom: 0.5rem;
        }

        .stress-terminal-feed {
            background-color: var(--carbon-black);
            border: 1px solid var(--graphite);
            flex-grow: 1;
            min-height: 250px;
            max-height: 350px;
            overflow-y: auto;
            padding: 0.75rem;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .stress-line {
            line-height: 1.3;
        }

        .stress-line.log-info { color: rgba(244, 241, 232, 0.7); }
        .stress-line.log-warn { color: var(--yellow); }
        .stress-line.log-fail { color: var(--red); font-weight: bold; }
        .stress-line.log-pass { color: var(--green); font-weight: bold; }
        .stress-line.log-cmd { color: var(--cyan); }

        .stress-btn-trigger {
            width: 100%;
            text-align: center;
            font-family: var(--font-mono);
            font-size: 1rem;
            padding: 0.75rem;
            border: var(--border-width) solid var(--base-black);
            background-color: var(--green);
            color: var(--base-black);
            box-shadow: 4px 4px 0 var(--off-white);
            font-weight: 900;
            cursor: pointer;
            text-transform: uppercase;
            transition: all 0.15s;
        }

        .stress-btn-trigger:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0 var(--magenta);
        }

        .stress-btn-trigger:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 var(--cyan);
        }

        .stress-btn-trigger:disabled {
            background-color: var(--graphite);
            color: rgba(244, 241, 232, 0.3);
            box-shadow: none;
            cursor: not-allowed;
            transform: none;
        }
    `;
    document.head.appendChild(styleSheet);

    // 2. CREATE THE WAR ROOM SECTION MARKUP
    const warRoomSection = document.createElement("section");
    warRoomSection.id = "war-room";
    warRoomSection.className = "section-container war-room-section";
    warRoomSection.innerHTML = `
        <div class="section-header">
            <div class="section-title-wrap">
                <div class="section-pretitle mono-text">// OPERATIONAL COMBAT SIMULATION</div>
                <h2 class="section-title">The War Room Simulator</h2>
                <p class="section-subtitle">
                    Stress-test alternative funding instruments, calculate MRR scalability trajectories, and assess real debt load resilience using raw metrics.
                </p>
            </div>
            <div>
                <span class="p-badge p-magenta" style="padding: 6px 12px; font-size: 0.85rem;">CRITICAL CORE MODULE</span>
            </div>
        </div>

        <div class="war-room-grid">
            <!-- COLUMN 1: CONTROL INTAKE DECK -->
            <div class="control-deck">
                <div class="control-deck-title mono-text">
                    <span>[CONTROL DECK]</span>
                    <span style="font-size: 0.7rem; color: rgba(244,241,232,0.5)">PARAMS</span>
                </div>

                <!-- Simulation Mode Switcher -->
                <div class="input-group">
                    <label>SIMULATOR RUNMODE <span>[SELECT ACTIVE MODEL]</span></label>
                    <div class="radio-switch-container">
                        <input type="radio" id="mode-mca" name="sim-mode" value="mca" checked>
                        <label for="mode-mca" class="radio-switch-label">DEBT / MCA</label>
                        
                        <input type="radio" id="mode-mrr" name="sim-mode" value="mrr">
                        <label for="mode-mrr" class="radio-switch-label">MRR SCALER</label>
                        
                        <input type="radio" id="mode-lead" name="sim-mode" value="lead">
                        <label for="mode-lead" class="radio-switch-label">LEAD VALUATION</label>
                    </div>
                </div>

                <!-- Dynamic inputs based on mode selection -->
                <div id="dynamic-inputs-container">
                    <!-- Default: MCA Debt inputs -->
                </div>
            </div>

            <!-- COLUMN 2: METRIC MATRIX OUTPUT -->
            <div class="matrix-display">
                <div>
                    <div class="matrix-display-title mono-text">[CALCULATION MATRIX OUTPUTS]</div>
                    
                    <div id="dynamic-metrics-container">
                        <!-- Dynamic output fields matching input options -->
                    </div>
                </div>

                <div class="qualification-meter">
                    <div class="qual-score-container">
                        <div id="qual-grade-badge" class="qual-grade grade-b">B</div>
                        <div>
                            <div class="mono-text" style="font-weight: bold; font-size: 0.9rem; color: var(--green);">SYSTEM RATING</div>
                            <p id="qual-meta-text" class="qual-meta-desc">Optimal debt absorption parameters. Proceed safely.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- COLUMN 3: REALTIME ALGORITHMIC TERMINAL -->
            <div class="stress-terminal">
                <div class="stress-terminal-header">
                    <span class="mono-text" style="color: var(--green); font-weight: bold; font-size: 0.85rem;">[STRESS TERMINAL v1.2]</span>
                    <span class="status-dot"></span>
                </div>

                <div id="stress-terminal-feed" class="stress-terminal-feed">
                    <div class="stress-line log-info">&gt; SIMULATION UNIT INITIALIZED...</div>
                    <div class="stress-line log-info">&gt; WAITING FOR OPERATOR ACTION. SELECT CONFIGURATION AND RUN STRESS-TEST SEQUENCE.</div>
                </div>

                <button id="run-stress-test-btn" class="stress-btn-trigger">
                    Run Burn Stress Test
                </button>
            </div>
        </div>
    `;

    // 3. INJECT INTO DOM (Position it right before the use cases / shipping section)
    const containerSection = document.getElementById("directory");
    if (containerSection) {
        containerSection.parentNode.insertBefore(warRoomSection, containerSection.nextSibling);
    } else {
        // Fallback injection if layout changes
        document.body.insertBefore(warRoomSection, document.querySelector("footer"));
    }

    // 4. CORE SIMULATION ENGINE VARIABLES & DATA MODEL
    const inputsContainer = document.getElementById("dynamic-inputs-container");
    const metricsContainer = document.getElementById("dynamic-metrics-container");
    const terminalFeed = document.getElementById("stress-terminal-feed");
    const runTestBtn = document.getElementById("run-stress-test-btn");
    const qualGradeBadge = document.getElementById("qual-grade-badge");
    const qualMetaText = document.getElementById("qual-meta-text");

    const state = {
        mode: "mca", // mca, mrr, lead
        // MCA Params
        mcaCapital: 100000,
        mcaFactor: 1.15,
        mcaTerm: 6, // months
        mcaMonthlyRev: 50000,
        // MRR Params
        mrrCurrent: 20000,
        mrrGrowth: 15, // % monthly
        mrrChurn: 5, // % monthly
        mrrCAC: 1200,
        // Lead Valuation Params
        leadTraffic: 5000,
        leadConv: 2.5, // % conversion
        leadComm: 1500, // commission per close
        leadCloseRate: 10 // % closes
    };

    // Formatter helpers
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    const formatPercent = (val) => `${val.toFixed(1)}%`;

    // Static Template Elements
    const renderTemplates = {
        mca: {
            inputs: () => `
                <div class="input-group">
                    <label>FUNDING CAPITAL NEEDED <span id="val-mcaCapital">${formatCurrency(state.mcaCapital)}</span></label>
                    <input type="range" class="calc-slider" id="input-mcaCapital" min="10000" max="500000" step="5000" value="${state.mcaCapital}">
                </div>
                <div class="input-group">
                    <label>FACTOR RATE / TOTAL REPAY MULTIPLIER <span id="val-mcaFactor">${state.mcaFactor.toFixed(2)}x</span></label>
                    <input type="range" class="calc-slider" id="input-mcaFactor" min="1.05" max="1.45" step="0.01" value="${state.mcaFactor}">
                </div>
                <div class="input-group">
                    <label>PAYBACK MATURITY <span id="val-mcaTerm">${state.mcaTerm} MONTHS</span></label>
                    <input type="range" class="calc-slider" id="input-mcaTerm" min="3" max="18" step="1" value="${state.mcaTerm}">
                </div>
                <div class="input-group">
                    <label>HISTORICAL MONTHLY REVENUE <span id="val-mcaMonthlyRev">${formatCurrency(state.mcaMonthlyRev)}</span></label>
                    <input type="range" class="calc-slider" id="input-mcaMonthlyRev" min="10000" max="250000" step="5000" value="${state.mcaMonthlyRev}">
                </div>
            `,
            metrics: (calc) => `
                <div class="metric-row">
                    <div class="metric-box" style="--accent: var(--green);">
                        <div class="metric-name">Total Repay Obligation</div>
                        <div class="metric-val">${formatCurrency(calc.totalRepay)}</div>
                    </div>
                    <div class="metric-box" style="--accent: var(--orange);">
                        <div class="metric-name">Funding Cost (Interest)</div>
                        <div class="metric-val">${formatCurrency(calc.fundingCost)}</div>
                    </div>
                </div>
                <div class="metric-row">
                    <div class="metric-box" style="--accent: var(--cyan);">
                        <div class="metric-name">Estimated Daily Sweeps</div>
                        <div class="metric-val">${formatCurrency(calc.dailySweep)}</div>
                    </div>
                    <div class="metric-box" style="--accent: var(--magenta);">
                        <div class="metric-name">Equivalent APR Limit</div>
                        <div class="metric-val">${formatPercent(calc.equivalentApr)}</div>
                    </div>
                </div>
            `
        },
        mrr: {
            inputs: () => `
                <div class="input-group">
                    <label>CURRENT MONTHLY REC. REVENUE <span id="val-mrrCurrent">${formatCurrency(state.mrrCurrent)}</span></label>
                    <input type="range" class="calc-slider" id="input-mrrCurrent" min="2000" max="100000" step="1000" value="${state.mrrCurrent}">
                </div>
                <div class="input-group">
                    <label>ESTIMATED GROWTH RATE <span id="val-mrrGrowth">${state.mrrGrowth}%</span></label>
                    <input type="range" class="calc-slider" id="input-mrrGrowth" min="1" max="50" step="1" value="${state.mrrGrowth}">
                </div>
                <div class="input-group">
                    <label>AVERAGE MONTHLY CHURN RATE <span id="val-mrrChurn">${state.mrrChurn}%</span></label>
                    <input type="range" class="calc-slider" id="input-mrrChurn" min="0" max="25" step="0.5" value="${state.mrrChurn}">
                </div>
                <div class="input-group">
                    <label>CUSTOMER ACQUISITION COST (CAC) <span id="val-mrrCAC">${formatCurrency(state.mrrCAC)}</span></label>
                    <input type="range" class="calc-slider" id="input-mrrCAC" min="100" max="5000" step="50" value="${state.mrrCAC}">
                </div>
            `,
            metrics: (calc) => `
                <div class="metric-row">
                    <div class="metric-box" style="--accent: var(--green);">
                        <div class="metric-name">12-Month MRR Forecast</div>
                        <div class="metric-val">${formatCurrency(calc.mrrOneYear)}</div>
                    </div>
                    <div class="metric-box" style="--accent: var(--cyan);">
                        <div class="metric-name">Total Scaled ARR Profile</div>
                        <div class="metric-val">${formatCurrency(calc.arrOneYear)}</div>
                    </div>
                </div>
                <div class="metric-row">
                    <div class="metric-box" style="--accent: var(--magenta);">
                        <div class="metric-name">Net Growth Rate (Churn Adj)</div>
                        <div class="metric-val">${formatPercent(calc.netGrowth)}</div>
                    </div>
                    <div class="metric-box" style="--accent: var(--yellow);">
                        <div class="metric-name">LTV-to-CAC Ratio</div>
                        <div class="metric-val">${calc.ltvToCac.toFixed(2)}x</div>
                    </div>
                </div>
            `
        },
        lead: {
            inputs: () => `
                <div class="input-group">
                    <label>MONTHLY TARGET TRAFFIC <span id="val-leadTraffic">${state.leadTraffic.toLocaleString()}</span></label>
                    <input type="range" class="calc-slider" id="input-leadTraffic" min="500" max="50000" step="250" value="${state.leadTraffic}">
                </div>
                <div class="input-group">
                    <label>CONVERSION RATE TO LEAD <span id="val-leadConv">${state.leadConv}%</span></label>
                    <input type="range" class="calc-slider" id="input-leadConv" min="0.1" max="15" step="0.1" value="${state.leadConv}">
                </div>
                <div class="input-group">
                    <label>BROKER COMM. PER DEPLOYMENT <span id="val-leadComm">${formatCurrency(state.leadComm)}</span></label>
                    <input type="range" class="calc-slider" id="input-leadComm" min="200" max="10000" step="100" value="${state.leadComm}">
                </div>
                <div class="input-group">
                    <label>QUALIFIED CLOSE RATE <span id="val-leadCloseRate">${state.leadCloseRate}%</span></label>
                    <input type="range" class="calc-slider" id="input-leadCloseRate" min="1" max="50" step="1" value="${state.leadCloseRate}">
                </div>
            `,
            metrics: (calc) => `
                <div class="metric-row">
                    <div class="metric-box" style="--accent: var(--green);">
                        <div class="metric-name">Monthly Gross Leads</div>
                        <div class="metric-val">${calc.grossLeads.toLocaleString()}</div>
                    </div>
                    <div class="metric-box" style="--accent: var(--cyan);">
                        <div class="metric-name">Projected Sales Deals</div>
                        <div class="metric-val">${calc.projectedDeals.toLocaleString()}</div>
                    </div>
                </div>
                <div class="metric-row">
                    <div class="metric-box" style="--accent: var(--magenta);">
                        <div class="metric-name">Estimated Lead Value</div>
                        <div class="metric-val">${formatCurrency(calc.leadValue)}</div>
                    </div>
                    <div class="metric-box" style="--accent: var(--orange);">
                        <div class="metric-name">Monthly Funnel Pipeline</div>
                        <div class="metric-val">${formatCurrency(calc.monthlyRevenue)}</div>
                    </div>
                </div>
            `
        }
    };

    // 5. MATH ENGINE COMPUTATIONS
    function calculateMca() {
        const totalRepay = state.mcaCapital * state.mcaFactor;
        const fundingCost = totalRepay - state.mcaCapital;
        // Daily sweeps estimate (assuming 22 business days/month)
        const totalDays = state.mcaTerm * 22;
        const dailySweep = totalRepay / totalDays;
        
        // Approximate APR equivalent
        const costRate = fundingCost / state.mcaCapital;
        const termYears = state.mcaTerm / 12;
        const equivalentApr = (costRate / termYears) * 100;

        return { totalRepay, fundingCost, dailySweep, equivalentApr };
    }

    function calculateMrr() {
        const netGrowth = state.mrrGrowth - state.mrrChurn;
        // Compound growth calculation over 12 months
        let compound = state.mrrCurrent;
        const monthlyRate = netGrowth / 100;
        for (let i = 0; i < 12; i++) {
            compound *= (1 + monthlyRate);
        }
        const mrrOneYear = compound;
        const arrOneYear = compound * 12;

        // Arbitrary baseline ARPU (Avg revenue per account) to derive LTV
        const arpu = 150;
        const churnDec = state.mrrChurn / 100;
        const ltv = churnDec > 0 ? arpu / churnDec : arpu * 100;
        const ltvToCac = state.mrrCAC > 0 ? ltv / state.mrrCAC : 0;

        return { mrrOneYear, arrOneYear, netGrowth, ltvToCac };
    }

    function calculateLead() {
        const grossLeads = Math.round(state.leadTraffic * (state.leadConv / 100));
        const projectedDeals = Math.round(grossLeads * (state.leadCloseRate / 100));
        const monthlyRevenue = projectedDeals * state.leadComm;
        const leadValue = grossLeads > 0 ? monthlyRevenue / grossLeads : 0;

        return { grossLeads, projectedDeals, monthlyRevenue, leadValue };
    }

    // Dynamic Scoring Matrix to produce grades
    function evaluateScore(calc) {
        if (state.mode === "mca") {
            const monthlyRepayment = calc.dailySweep * 22;
            const debtToIncomeRatio = monthlyRepayment / state.mcaMonthlyRev;
            
            if (debtToIncomeRatio < 0.15 && state.mcaFactor <= 1.18) {
                return { grade: "A", class: "grade-a", text: "Optimal risk parameters. Clean leverage." };
            } else if (debtToIncomeRatio < 0.25 && state.mcaFactor <= 1.25) {
                return { grade: "B", class: "grade-b", text: "Profitable absorption potential. Proceed prudently." };
            } else if (debtToIncomeRatio < 0.35) {
                return { grade: "C", class: "grade-c", text: "Elevated cost of capital. Ensure direct ROI margins." };
            } else if (debtToIncomeRatio < 0.45) {
                return { grade: "D", class: "grade-d", text: "Warning: Heavy burn rate sweep. High default exposure." };
            } else {
                return { grade: "F", class: "grade-f", text: "CRITICAL: Debt service requirements exceed safe runway limit." };
            }
        } else if (state.mode === "mrr") {
            if (calc.netGrowth >= 15 && calc.ltvToCac >= 4) {
                return { grade: "A", class: "grade-a", text: "Top-tier SaaS architecture. Highly investable unit economics." };
            } else if (calc.netGrowth >= 5 && calc.ltvToCac >= 3) {
                return { grade: "B", class: "grade-b", text: "Stable recurring growth. Standard bootstrap profile." };
            } else if (calc.netGrowth > 0 && calc.ltvToCac >= 1.5) {
                return { grade: "C", class: "grade-c", text: "High CAC profile relative to lifecycle retention. Refactor funnel." };
            } else {
                return { grade: "F", class: "grade-f", text: "Negative net compounding. Leaking enterprise valuation. Urgent audit." };
            }
        } else { // lead mode
            if (calc.leadValue >= 150 && calc.monthlyRevenue >= 15000) {
                return { grade: "A", class: "grade-a", text: "Commanding lead gen margin. Exploit and scale source." };
            } else if (calc.leadValue >= 75) {
                return { grade: "B", class: "grade-b", text: "Healthy funnel conversion. Viable for paid ads." };
            } else if (calc.leadValue > 20) {
                return { grade: "C", class: "grade-c", text: "Low value pipeline. Increase close rate or raise commission terms." };
            } else {
                return { grade: "F", class: "grade-f", text: "Non-viable cost-per-lead ecosystem. Wasteful budget drift." };
            }
        }
    }

    // Main render router
    function updateSimulator() {
        let calc;
        if (state.mode === "mca") {
            calc = calculateMca();
        } else if (state.mode === "mrr") {
            calc = calculateMrr();
        } else {
            calc = calculateLead();
        }

        // Render dynamic metrics output column
        metricsContainer.innerHTML = renderTemplates[state.mode].metrics(calc);

        // Update Grade Assessment Panel
        const scoring = evaluateScore(calc);
        qualGradeBadge.textContent = scoring.grade;
        qualGradeBadge.className = `qual-grade ${scoring.class}`;
        qualMetaText.textContent = scoring.text;
    }

    function initControls() {
        inputsContainer.innerHTML = renderTemplates[state.mode].inputs();

        // Bind DOM events dynamically to all rendered sliders
        const sliders = inputsContainer.querySelectorAll(".calc-slider");
        sliders.forEach(slider => {
            slider.addEventListener("input", (e) => {
                const id = e.target.id.replace("input-", "");
                const valEl = document.getElementById(`val-${id}`);
                const value = parseFloat(e.target.value);
                
                // Save to local logic state
                state[id] = value;

                // Update text indicators inside label
                if (id.includes("Capital") || id.includes("Rev") || id.includes("CAC") || id.includes("Current") || id.includes("Comm")) {
                    valEl.textContent = formatCurrency(value);
                } else if (id.includes("Factor")) {
                    valEl.textContent = `${value.toFixed(2)}x`;
                } else if (id.includes("Term")) {
                    valEl.textContent = `${value} MONTHS`;
                } else if (id.includes("Growth") || id.includes("Churn") || id.includes("Conv") || id.includes("CloseRate")) {
                    valEl.textContent = `${value}%`;
                } else if (id.includes("Traffic")) {
                    valEl.textContent = value.toLocaleString();
                }

                updateSimulator();
            });
        });

        updateSimulator();
    }

    // Bind Radio controls for top-level Runmodes
    document.querySelectorAll('input[name="sim-mode"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            state.mode = e.target.value;
            
            // Log target mode switch to stress terminal
            addTerminalLine(`SWITCHED MODULE MODE TO: ${state.mode.toUpperCase()}`, "log-cmd");
            addTerminalLine(`Awaiting parameters calibration... Ready.`, "log-info");
            
            // Adjust stress test trigger button copy
            if (state.mode === "mca") runTestBtn.textContent = "Run Burn Stress Test";
            else if (state.mode === "mrr") runTestBtn.textContent = "Model Valuation Variance";
            else runTestBtn.textContent = "Stress Test Funnel Yield";

            initControls();
        });
    });

    // Write logs inside the tactical screen
    function addTerminalLine(text, cssClass = "log-info") {
        const line = document.createElement("div");
        line.className = `stress-line ${cssClass}`;
        line.textContent = `> ${text}`;
        terminalFeed.appendChild(line);
        terminalFeed.scrollTop = terminalFeed.scrollHeight;
    }

    // 6. STRESS SIMULATOR ALGORITHMIC ENGINE
    // Simulated day-by-day depletion stress test runs
    runTestBtn.addEventListener("click", () => {
        runTestBtn.disabled = true;
        terminalFeed.innerHTML = ""; // Clear feed
        addTerminalLine(`LAUNCHING PARAMETRIC CRUNCH ENGINE...`, "log-cmd");

        if (state.mode === "mca") {
            runMcaDepletionSimulation();
        } else if (state.mode === "mrr") {
            runMrrStochasticSimulation();
        } else {
            runLeadFunnelStressSimulation();
        }
    });

    function runMcaDepletionSimulation() {
        const calc = calculateMca();
        let daysPassed = 0;
        const totalDays = state.mcaTerm * 22;
        let cumulativePayback = 0;
        let totalRevenueGenerated = 0;
        let defaultFlag = false;

        addTerminalLine(`TARGET REPAY OBLIGATION: ${formatCurrency(calc.totalRepay)}`, "log-info");
        addTerminalLine(`CALCULATING DAILY HOLD-BACK ON VARIABLE REVENUE...`, "log-info");

        let intervalId = setInterval(() => {
            daysPassed += 4; // Run in chunks to speed up simulation visually
            if (daysPassed >= totalDays) {
                clearInterval(intervalId);
                runTestBtn.disabled = false;
                
                if (!defaultFlag) {
                    addTerminalLine(`[OK] COMPLETED FULL DEPOSITS LOOP RETENTION WITHOUT OVERRUNS.`, "log-pass");
                    addTerminalLine(`TOTAL LIQUID REVENUE GENERATED: ${formatCurrency(totalRevenueGenerated)}`, "log-pass");
                } else {
                    addTerminalLine(`[CRITICAL] SYSTEM TRIGGERED EMERGENCY WARNING: RUNWAY COLLAPSE.`, "log-fail");
                }
                return;
            }

            // Simulate day-by-day variable cash flow (with random deviation representing market conditions)
            const expectedDailyRev = state.mcaMonthlyRev / 22;
            const randomizedDailyRev = expectedDailyRev * (0.5 + Math.random() * 1.1); // -50% to +110%
            totalRevenueGenerated += randomizedDailyRev * 4;

            const dailyRepayContribution = calc.dailySweep * 4;
            cumulativePayback += dailyRepayContribution;

            // Simple safety margin analysis
            const currentDebtCoveragePercent = (dailyRepayContribution / (randomizedDailyRev * 4)) * 100;

            if (currentDebtCoveragePercent > 40) {
                addTerminalLine(`DAY ${daysPassed}: DAILY RATIO SURGED TO ${currentDebtCoveragePercent.toFixed(0)}%. CRITICAL OBLIGATION BURN DETECTED.`, "log-warn");
                defaultFlag = true;
            } else {
                addTerminalLine(`DAY ${daysPassed}: Repay sweep balance satisfactory. Pipeline health check green.`, "log-info");
            }
        }, 120);
    }

    function runMrrStochasticSimulation() {
        let monthsPassed = 0;
        let simulatedMrr = state.mrrCurrent;
        let simulatedCAC = state.mrrCAC;
        let defaultFlag = false;

        addTerminalLine(`STOCHASTIC RETENTION AND HIGH-CHURN EXPOSURE DRIFT RUNNING...`, "log-info");

        let intervalId = setInterval(() => {
            monthsPassed++;
            if (monthsPassed > 12) {
                clearInterval(intervalId);
                runTestBtn.disabled = false;
                if (!defaultFlag) {
                    addTerminalLine(`[STABLE] compound curve finished with clear capital appreciation.`, "log-pass");
                    addTerminalLine(`PRODUCES ESTIMATED ENTERPRISE VAL (4x Multiple): ${formatCurrency(simulatedMrr * 12 * 4)}`, "log-pass");
                } else {
                    addTerminalLine(`[FAIL] INSUFFICIENT UNIT MARGIN DURING EXPANSION CYCLE. REEVALUATE RETENTION BLUEPRINTS.`, "log-fail");
                }
                return;
            }

            // Randomize growth/churn deviations representing market churn events
            const churnDeviation = state.mrrChurn + (Math.random() * 8 - 4); // +/- 4% drift
            const growthDeviation = state.mrrGrowth + (Math.random() * 10 - 5); // +/- 5% drift
            
            const netComp = (growthDeviation - churnDeviation) / 100;
            simulatedMrr *= (1 + netComp);

            if (netComp < 0) {
                addTerminalLine(`MONTH ${monthsPassed}: CHURN SPARKED RETRACTION. NET GROWTH COLLAPSED TO ${formatPercent(netComp * 100)}.`, "log-warn");
                defaultFlag = true;
            } else {
                addTerminalLine(`MONTH ${monthsPassed}: COMPRESSED COMP GROWTH RETAINED AT ${formatPercent(netComp * 100)}. MRR AT ${formatCurrency(simulatedMrr)}.`, "log-info");
            }
        }, 200);
    }

    function runLeadFunnelStressSimulation() {
        const calc = calculateLead();
        let loopsRun = 0;
        let totalLostAdSpend = 0;
        let totalCommissionRevenue = 0;

        addTerminalLine(`DRAFTING SIMULATED CONVERSION DROP STRESS ANALYSIS...`, "log-info");
        addTerminalLine(`EVALUATING TRAFFIC VOLUME DRIFT WITH HIGH SENSITIVITY...`, "log-info");

        let intervalId = setInterval(() => {
            loopsRun++;
            if (loopsRun > 5) {
                clearInterval(intervalId);
                runTestBtn.disabled = false;
                const netYield = totalCommissionRevenue - totalLostAdSpend;

                if (netYield > 0) {
                    addTerminalLine(`[PROFITABLE] PIPELINE RETRACTED BUT CLOSED WITH POSITIVE SPREAD: ${formatCurrency(netYield)}`, "log-pass");
                } else {
                    addTerminalLine(`[DEFICIT] TRAFFIC DRIFT DESTROYED RETURN OBLIGATION. SPREAD ENDED IN NEGATIVE OUTFLOW: ${formatCurrency(netYield)}`, "log-fail");
                }
                return;
            }

            // Simulate high degradation of conversion or traffic
            const conversionDrop = state.leadConv * (0.3 + Math.random() * 0.5); // Dropped significantly
            const grossProjectedLeads = Math.round(state.leadTraffic * (conversionDrop / 100));
            const randomCloseRate = state.leadCloseRate * (0.4 + Math.random() * 0.5);
            const closedDeals = Math.round(grossProjectedLeads * (randomCloseRate / 100));

            const simulatedRevenue = closedDeals * state.leadComm;
            const simulatedAdSpend = state.leadTraffic * 0.75; // Hypothetical $0.75 CPC
            
            totalLostAdSpend += simulatedAdSpend;
            totalCommissionRevenue += simulatedRevenue;

            if (simulatedRevenue < simulatedAdSpend) {
                addTerminalLine(`RUN ${loopsRun}: CRITICAL CPA SURGED. Revenue ${formatCurrency(simulatedRevenue)} vs AdSpend Cost ${formatCurrency(simulatedAdSpend)}.`, "log-warn");
            } else {
                addTerminalLine(`RUN ${loopsRun}: Stable acquisition return. Margin of ${formatCurrency(simulatedRevenue - simulatedAdSpend)} maintained.`, "log-info");
            }
        }, 300);
    }

    // Init first render
    initControls();
})();