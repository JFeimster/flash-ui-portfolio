(function () {
    // 1. DYNAMIC CSS STYLES FOR THE ANALYST SUITE
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        /* Analyst Suite Layout & Scaffolding */
        .analyst-suite-wrapper {
            margin-top: 32px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 32px;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .analyst-suite-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding-bottom: 16px;
        }

        .analyst-suite-title h2 {
            font-size: 20px;
            font-weight: 800;
            color: var(--text-primary);
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .analyst-suite-title h2::before {
            content: '';
            display: inline-block;
            width: 12px;
            height: 12px;
            background: var(--accent-prism-violet);
            border-radius: 3px;
            box-shadow: 0 0 10px var(--accent-prism-violet);
        }

        .analyst-suite-title p {
            font-size: 12px;
            color: var(--text-muted);
            font-family: var(--font-mono);
            text-transform: uppercase;
            margin-top: 4px;
        }

        .analyst-grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr 1fr;
            gap: 24px;
        }

        @media (max-width: 1200px) {
            .analyst-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Simulator Interactive Control Elements */
        .simulator-controls-card {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .policy-group-box {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px;
        }

        .policy-group-title {
            font-size: 11px;
            font-family: var(--font-mono);
            color: var(--accent-prism-violet);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 14px;
            font-weight: 700;
        }

        .slider-control-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 14px;
        }

        .slider-control-item:last-child {
            margin-bottom: 0;
        }

        .slider-header {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            font-family: var(--font-mono);
        }

        .slider-header .lbl {
            color: var(--text-secondary);
        }

        .slider-header .val {
            color: var(--accent-cyan);
            font-weight: 700;
        }

        .analyst-input-range {
            -webkit-appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: rgba(255, 255, 255, 0.08);
            outline: none;
        }

        .analyst-input-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--accent-prism-violet);
            cursor: pointer;
            box-shadow: 0 0 8px var(--accent-prism-violet);
            transition: var(--transition-smooth);
        }

        .analyst-input-range::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }

        /* Ledger Table Comparative Panel */
        .ledger-panel-card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .ledger-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .ledger-table th {
            text-align: left;
            padding: 10px;
            font-size: 11px;
            font-family: var(--font-mono);
            color: var(--text-muted);
            text-transform: uppercase;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ledger-table td {
            padding: 12px 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            vertical-align: middle;
        }

        .ledger-table tr:hover td {
            background: rgba(255, 255, 255, 0.01);
        }

        .profile-name-cell {
            font-weight: 700;
            color: var(--text-primary);
        }

        .profile-type-sub {
            font-size: 10px;
            color: var(--text-muted);
            display: block;
            font-family: var(--font-mono);
        }

        .score-comparison-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-family: var(--font-mono);
            font-weight: 700;
        }

        .score-comparison-pill .base-num {
            color: var(--text-muted);
            text-decoration: line-through;
            font-size: 11px;
        }

        .score-comparison-pill .sim-num {
            color: var(--text-primary);
        }

        .delta-badge {
            font-size: 10px;
            font-family: var(--font-mono);
            padding: 2px 5px;
            border-radius: 4px;
            font-weight: 700;
        }

        .delta-up {
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent-emerald);
        }

        .delta-down {
            background: rgba(244, 63, 94, 0.1);
            color: var(--accent-rose);
        }

        .delta-neutral {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-muted);
        }

        .tier-shift-indicator {
            font-size: 11px;
            font-family: var(--font-mono);
        }

        .tier-stable {
            color: var(--text-secondary);
        }

        .tier-upgraded {
            color: var(--accent-emerald);
            font-weight: 700;
        }

        .tier-downgraded {
            color: var(--accent-rose);
            font-weight: 700;
        }

        /* SVG Visualization & Live Config Panel */
        .analytics-visual-card {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .svg-chart-container {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px;
            height: 180px;
            position: relative;
        }

        .svg-chart-axes {
            position: absolute;
            bottom: 30px;
            left: 10px;
            right: 10px;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
        }

        .chart-bar-group-wrapper {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            height: calc(100% - 30px);
            padding: 0 10px;
        }

        .chart-column {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: 14%;
        }

        .bars-side-by-side {
            display: flex;
            gap: 4px;
            align-items: flex-end;
            height: 110px;
            width: 100%;
        }

        .bar-single {
            flex: 1;
            border-radius: 2px 2px 0 0;
            transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }

        .bar-single.base {
            background: rgba(37, 99, 235, 0.4);
            border: 1px solid rgba(37, 99, 235, 0.6);
        }

        .bar-single.sim {
            background: var(--accent-prism-violet);
            box-shadow: 0 0 10px rgba(124, 58, 237, 0.3);
            border: 1px solid var(--accent-prism-violet);
        }

        .chart-column-label {
            font-size: 9px;
            font-family: var(--font-mono);
            color: var(--text-muted);
            text-transform: uppercase;
        }

        /* Key Performance Matrix indicators */
        .sim-meta-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .stat-capsule {
            background: rgba(0,0,0,0.15);
            border: 1px solid rgba(255,255,255,0.03);
            border-radius: 8px;
            padding: 10px;
            text-align: center;
        }

        .stat-capsule .lbl {
            font-size: 10px;
            font-family: var(--font-mono);
            color: var(--text-muted);
            text-transform: uppercase;
            display: block;
            margin-bottom: 4px;
        }

        .stat-capsule .val {
            font-size: 16px;
            font-weight: 700;
            font-family: var(--font-mono);
        }

        /* Action bar & Config Output Drawer */
        .config-exporter-wrap {
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .config-code-preview {
            max-height: 100px;
            overflow-y: auto;
            background: #020306;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 6px;
            padding: 10px;
            font-family: var(--font-mono);
            font-size: 10px;
            color: #a8b2c2;
            white-space: pre-wrap;
        }

        .action-button-group {
            display: flex;
            gap: 10px;
        }

        .btn-action-primary {
            flex: 1;
            background: linear-gradient(90deg, var(--accent-prism-violet), var(--accent-cobalt));
            border: none;
            color: #fff;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition-smooth);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .btn-action-primary:hover {
            box-shadow: 0 0 15px rgba(124, 58, 237, 0.4);
            transform: translateY(-1px);
        }

        .btn-action-secondary {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: var(--text-primary);
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition-smooth);
        }

        .btn-action-secondary:hover {
            background: rgba(255,255,255,0.1);
        }

        /* White Label Overrides inside Analyst Dashboard */
        .white-label-mode .analyst-suite-wrapper {
            border-top-color: rgba(0, 0, 0, 0.1);
        }
        .white-label-mode .analyst-suite-header {
            border-bottom-color: rgba(0, 0, 0, 0.1);
        }
        .white-label-mode .policy-group-box, 
        .white-label-mode .svg-chart-container,
        .white-label-mode .stat-capsule {
            background: #fff;
            border-color: rgba(120, 113, 108, 0.15);
        }
        .white-label-mode .config-code-preview {
            background: #f5f5f4;
            border-color: rgba(120, 113, 108, 0.15);
            color: #1c1917;
        }
    `;
    document.head.appendChild(styleSheet);

    // 2. BACKING SIMULATION STATE ENGINE
    const SimulationEngine = {
        // Current running simulation modifiers
        rules: {
            liquidityWeight: 1.0,
            growthWeight: 1.0,
            collateralWeight: 1.0,
            leverageWeight: 1.0,
            cashflowWeight: 1.0,

            // Core policy ceilings and floors
            liquidityFloor: 40,
            leverageCeiling: 85,

            // Flag penalties applied dynamically to underlying risk checks
            physicalAssetsPenalty: 60,
            volatilityPenalty: 40,
            acquisitionTransitionalPenalty: 50,

            // Target Tiers
            superPrimeThreshold: 800,
            primeThreshold: 700
        },

        // Mirror baseline dataset to keep system self-contained & high-fidelity
        archetypes: {
            saas: {
                name: "SaaS Scaleup",
                sub: "High Velocity MRR",
                baseScore: 825,
                dimensions: { liquidity: 92, leverage: 45, growth: 96, collateral: 20, cashFlow: 88 },
                hasPhysicalAssetsRisk: true,
                hasVolatilityRisk: false,
                hasAcqRisk: false
            },
            ecom: {
                name: "E-Commerce Titan",
                sub: "High Inventory Turn",
                baseScore: 715,
                dimensions: { liquidity: 78, leverage: 62, growth: 89, collateral: 55, cashFlow: 70 },
                hasPhysicalAssetsRisk: false,
                hasVolatilityRisk: true,
                hasAcqRisk: false
            },
            industrial: {
                name: "Heavy Manufacturing",
                sub: "Asset Rich Structures",
                baseScore: 690,
                dimensions: { liquidity: 45, leverage: 80, growth: 38, collateral: 95, cashFlow: 65 },
                hasPhysicalAssetsRisk: false,
                hasVolatilityRisk: false,
                hasAcqRisk: false
            },
            realestate: {
                name: "Commercial RE Asset Class",
                sub: "Collateral Anchor Portfolio",
                baseScore: 790,
                dimensions: { liquidity: 60, leverage: 72, growth: 50, collateral: 98, cashFlow: 82 },
                hasPhysicalAssetsRisk: false,
                hasVolatilityRisk: false,
                hasAcqRisk: false
            },
            acquisition: {
                name: "LBO Search Fund",
                sub: "EBITDA Yield Target",
                baseScore: 755,
                dimensions: { liquidity: 70, leverage: 65, growth: 72, collateral: 48, cashFlow: 80 },
                hasPhysicalAssetsRisk: false,
                hasVolatilityRisk: false,
                hasAcqRisk: true
            }
        },

        // Calculates baseline scores without policy tuning (standard calibration)
        calculateBaselineScore(key) {
            return this.archetypes[key].baseScore;
        },

        // Generates dynamic calculations for simulated risk framework overrides
        calculateSimulatedScore(key) {
            const data = this.archetypes[key];
            const r = this.rules;

            // Apply interactive weight multipliers to dimensions
            const num = (data.dimensions.liquidity * r.liquidityWeight) +
                        (data.dimensions.growth * r.growthWeight) +
                        (data.dimensions.collateral * r.collateralWeight) +
                        (data.dimensions.leverage * r.leverageWeight) +
                        (data.dimensions.cashFlow * r.cashflowWeight);

            const den = r.liquidityWeight + r.growthWeight + r.collateralWeight + r.leverageWeight + r.cashflowWeight;
            const weightedAverage = num / (den || 1);

            // Shift baseline slightly corresponding with structural weight variances
            let finalScore = Math.round((data.baseScore * 0.65) + (weightedAverage * 3.5 * 0.35));

            // Dynamic rule penalties applied from scenario variables
            if (data.hasPhysicalAssetsRisk) {
                finalScore -= Math.round(r.physicalAssetsPenalty * 0.7);
            }
            if (data.hasVolatilityRisk) {
                finalScore -= Math.round(r.volatilityPenalty * 0.7);
            }
            if (data.hasAcqRisk) {
                finalScore -= Math.round(r.acquisitionTransitionalPenalty * 0.7);
            }

            // Absolute floor & ceilings constraints checks
            if (data.dimensions.liquidity < r.liquidityFloor) {
                finalScore -= 45; // Automatic liquidity floor violation penalty
            }
            if (data.dimensions.leverage > r.leverageCeiling) {
                finalScore -= 60; // Over-leverage risk penalty
            }

            return Math.max(300, Math.min(1000, finalScore));
        },

        // Maps final calculated scores back to regulatory thresholds
        getTier(score) {
            if (score >= this.rules.superPrimeThreshold) return "Super Prime";
            if (score >= this.rules.primeThreshold) return "Prime";
            return "Subprime";
        }
    };

    // 3. UI GENERATION AND INJECTION WORKFLOW
    function initAnalystSuite() {
        const targetContainer = document.querySelector(".app-container");
        if (!targetContainer) return;

        // Render administrative Scenario Framework
        const suiteSection = document.createElement("section");
        suiteSection.id = "analystPolicySuite";
        suiteSection.className = "analyst-suite-wrapper";

        suiteSection.innerHTML = `
            <div class="analyst-suite-header">
                <div class="analyst-suite-title">
                    <h2>Analyst Policy Manager &amp; Scenario Simulator</h2>
                    <p>Internal Risk Modeling &amp; Underwriting Calibration Engine</p>
                </div>
                <div style="font-size: 11px; font-family: var(--font-mono); color: var(--accent-cyan); background: rgba(6, 182, 212, 0.08); padding: 6px 12px; border: 1px solid rgba(6,182,212,0.2); border-radius: 6px;">
                    SANDBOX ACTIVE: Policy Simulation Mode
                </div>
            </div>

            <div class="analyst-grid">
                
                <!-- COLUMN 1: INTERACTIVE SIMULATOR CONTROLS -->
                <div class="bento-card simulator-controls-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h2>Policy Weight Drivers</h2>
                            <p>Calibration Multipliers</p>
                        </div>
                    </div>

                    <!-- Interactive Weights Stack -->
                    <div class="policy-group-box">
                        <div class="policy-group-title">Dynamic Weighted Criteria</div>
                        
                        <div class="slider-control-item">
                            <div class="slider-header">
                                <span class="lbl">Liquidity Ratio Weight</span>
                                <span class="val" id="lbl-weight-liq">1.0</span>
                            </div>
                            <input type="range" class="analyst-input-range" id="input-weight-liq" min="0" max="2" step="0.1" value="1.0">
                        </div>

                        <div class="slider-control-item">
                            <div class="slider-header">
                                <span class="lbl">Velocity Growth Weight</span>
                                <span class="val" id="lbl-weight-growth">1.0</span>
                            </div>
                            <input type="range" class="analyst-input-range" id="input-weight-growth" min="0" max="2" step="0.1" value="1.0">
                        </div>

                        <div class="slider-control-item">
                            <div class="slider-header">
                                <span class="lbl">Asset Protection Weight</span>
                                <span class="val" id="lbl-weight-collateral">1.0</span>
                            </div>
                            <input type="range" class="analyst-input-range" id="input-weight-collateral" min="0" max="2" step="0.1" value="1.0">
                        </div>

                        <div class="slider-control-item">
                            <div class="slider-header">
                                <span class="lbl">Leverage Multiplier Weight</span>
                                <span class="val" id="lbl-weight-leverage">1.0</span>
                            </div>
                            <input type="range" class="analyst-input-range" id="input-weight-leverage" min="0" max="2" step="0.1" value="1.0">
                        </div>

                        <div class="slider-control-item">
                            <div class="slider-header">
                                <span class="lbl">EBITDA Cashflow Weight</span>
                                <span class="val" id="lbl-weight-cashflow">1.0</span>
                            </div>
                            <input type="range" class="analyst-input-range" id="input-weight-cashflow" min="0" max="2" step="0.1" value="1.0">
                        </div>
                    </div>

                    <!-- Hard Limits and Risk Flags Penalty Adjusters -->
                    <div class="policy-group-box">
                        <div class="policy-group-title">Exception Parameters &amp; Thresholds</div>
                        
                        <div class="slider-control-item">
                            <div class="slider-header">
                                <span class="lbl">Liquidity Floor Policy limit</span>
                                <span class="val" id="lbl-floor-liq">40%</span>
                            </div>
                            <input type="range" class="analyst-input-range" id="input-floor-liq" min="10" max="60" step="5" value="40">
                        </div>

                        <div class="slider-control-item">
                            <div class="slider-header">
                                <span class="lbl">Leverage Ceiling Limit</span>
                                <span class="val" id="lbl-ceil-lev">85%</span>
                            </div>
                            <input type="range" class="analyst-input-range" id="input-ceil-lev" min="50" max="95" step="5" value="85">
                        </div>

                        <div class="slider-control-item">
                            <div class="slider-header">
                                <span class="lbl">Asset Lien Exclusion Penalty</span>
                                <span class="val" id="lbl-penalty-assets">-60 pts</span>
                            </div>
                            <input type="range" class="analyst-input-range" id="input-penalty-assets" min="10" max="150" step="5" value="60">
                        </div>
                    </div>
                </div>

                <!-- COLUMN 2: REAL-TIME COMPARATIVE PIPELINE LEDGER -->
                <div class="bento-card ledger-panel-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h2>Comparative Portfolio Ledger</h2>
                            <p>Simultaneous Core Target Simulations</p>
                        </div>
                    </div>

                    <table class="ledger-table">
                        <thead>
                            <tr>
                                <th>Borrower Profile</th>
                                <th>Base Score</th>
                                <th>Sim Score</th>
                                <th>Variance</th>
                                <th>Approval Tier Shift</th>
                            </tr>
                        </thead>
                        <tbody id="ledger-table-body">
                            <!-- Dynamic Simulation row bindings executed by renderLoop -->
                        </tbody>
                    </table>

                    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; margin-top: 14px; display: flex; align-items: center; gap: 10px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-cyan); flex-shrink:0;">
                            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <p style="font-size: 11px; line-height: 1.4; color: var(--text-secondary);">
                            Any modification of custom weights or exclusion thresholds recalculates simulated risk vectors immediately across the entire portfolio spectrum.
                        </p>
                    </div>
                </div>

                <!-- COLUMN 3: ANALYTICS VISUALS & CONFIG EXPORTER -->
                <div class="bento-card analytics-visual-card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h2>Delta Distribution</h2>
                            <p>Visual Target Score Variance</p>
                        </div>
                    </div>

                    <!-- Inline dynamic Charting component -->
                    <div class="svg-chart-container" id="simulation-chart">
                        <div class="svg-chart-axes"></div>
                        <div class="chart-bar-group-wrapper" id="chart-bars-container">
                            <!-- Chart column nodes populated dynamically -->
                        </div>
                    </div>

                    <!-- Macro System KPI parameters -->
                    <div class="sim-meta-stats">
                        <div class="stat-capsule">
                            <span class="lbl">Avg Index Shift</span>
                            <span class="val" id="stat-avg-shift">-0.0%</span>
                        </div>
                        <div class="stat-capsule">
                            <span class="lbl">Tier Shift Event</span>
                            <span class="val" id="stat-tier-events">0 Profiles</span>
                        </div>
                    </div>

                    <!-- Dynamic JSON Exporter Section -->
                    <div class="config-exporter-wrap">
                        <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-secondary); text-transform: uppercase;">Exported Weight Parameters</span>
                        <div class="config-code-preview" id="config-json-preview">
                            <!-- Live generated recommendation_weights.json preview -->
                        </div>
                        <div class="action-button-group">
                            <button class="btn-action-primary" id="btn-export-weights">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Save config.json
                            </button>
                            <button class="btn-action-secondary" id="btn-reset-rules">Reset Rules</button>
                        </div>
                    </div>
                </div>

            </div>
        `;

        // Append workspace element below Base Component main framework
        targetContainer.appendChild(suiteSection);

        // Append Scenario suite navigation toggle to Header global-controls
        const globalHeaderControls = document.querySelector(".global-controls");
        if (globalHeaderControls) {
            const toggleButton = document.createElement("button");
            toggleButton.className = "btn-toggle-view";
            toggleButton.style.borderColor = "var(--accent-prism-violet)";
            toggleButton.id = "btnToggleAnalystSuiteWorkspace";
            toggleButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="stroke: var(--accent-prism-violet)">
                    <rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect>
                </svg>
                <span>Analyst Scenario Suite</span>
            `;

            // Prepends to header controls
            globalHeaderControls.insertBefore(toggleButton, globalHeaderControls.firstChild);

            // Toggle scroll dynamic actions
            toggleButton.addEventListener("click", () => {
                const workspace = document.getElementById("analystPolicySuite");
                if (workspace) {
                    workspace.scrollIntoView({ behavior: "smooth", block: "start" });
                    
                    // Add micro glow accent effect briefly
                    workspace.style.boxShadow = "0 0 30px rgba(124, 58, 237, 0.25)";
                    setTimeout(() => {
                        workspace.style.boxShadow = "";
                    }, 1200);
                }
            });
        }

        // Attach event listeners and run baseline evaluation loops
        bindEvents();
        runSimulationLoop();
    }

    // 4. EVENT CONTROLLER REGISTRATION
    function bindEvents() {
        const sliders = [
            { el: "input-weight-liq", state: "liquidityWeight", display: "lbl-weight-liq", suffix: "" },
            { el: "input-weight-growth", state: "growthWeight", display: "lbl-weight-growth", suffix: "" },
            { el: "input-weight-collateral", state: "collateralWeight", display: "lbl-weight-collateral", suffix: "" },
            { el: "input-weight-leverage", state: "leverageWeight", display: "lbl-weight-leverage", suffix: "" },
            { el: "input-weight-cashflow", state: "cashflowWeight", display: "lbl-weight-cashflow", suffix: "" },
            { el: "input-floor-liq", state: "liquidityFloor", display: "lbl-floor-liq", suffix: "%" },
            { el: "input-ceil-lev", state: "leverageCeiling", display: "lbl-ceil-lev", suffix: "%" },
            { el: "input-penalty-assets", state: "physicalAssetsPenalty", display: "lbl-penalty-assets", suffix: " pts" }
        ];

        sliders.forEach(slider => {
            const el = document.getElementById(slider.el);
            if (el) {
                el.addEventListener("input", (e) => {
                    const val = parseFloat(e.target.value);
                    SimulationEngine.rules[slider.state] = val;
                    
                    // Update value display indicators
                    const display = document.getElementById(slider.display);
                    if (display) display.innerText = `${val}${slider.suffix}`;

                    // Re-calculate simulation matrix paths
                    runSimulationLoop();
                });
            }
        });

        // Config export file triggers
        const btnExport = document.getElementById("btn-export-weights");
        if (btnExport) {
            btnExport.addEventListener("click", () => {
                const configStr = generateJsonConfig();
                const blob = new Blob([configStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement("a");
                link.href = url;
                link.download = "recommendation_weights.json";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                alert("Configuration File 'recommendation_weights.json' successfully generated and downloaded.");
            });
        }

        // Resets policy sandbox inputs to target configurations values
        const btnReset = document.getElementById("btn-reset-rules");
        if (btnReset) {
            btnReset.addEventListener("click", () => {
                SimulationEngine.rules = {
                    liquidityWeight: 1.0,
                    growthWeight: 1.0,
                    collateralWeight: 1.0,
                    leverageWeight: 1.0,
                    cashflowWeight: 1.0,
                    liquidityFloor: 40,
                    leverageCeiling: 85,
                    physicalAssetsPenalty: 60,
                    volatilityPenalty: 40,
                    acquisitionTransitionalPenalty: 50,
                    superPrimeThreshold: 800,
                    primeThreshold: 700
                };

                // Sync UI elements state
                document.getElementById("input-weight-liq").value = 1.0;
                document.getElementById("lbl-weight-liq").innerText = "1.0";
                document.getElementById("input-weight-growth").value = 1.0;
                document.getElementById("lbl-weight-growth").innerText = "1.0";
                document.getElementById("input-weight-collateral").value = 1.0;
                document.getElementById("lbl-weight-collateral").innerText = "1.0";
                document.getElementById("input-weight-leverage").value = 1.0;
                document.getElementById("lbl-weight-leverage").innerText = "1.0";
                document.getElementById("input-weight-cashflow").value = 1.0;
                document.getElementById("lbl-weight-cashflow").innerText = "1.0";

                document.getElementById("input-floor-liq").value = 40;
                document.getElementById("lbl-floor-liq").innerText = "40%";
                document.getElementById("input-ceil-lev").value = 85;
                document.getElementById("lbl-ceil-lev").innerText = "85%";
                document.getElementById("input-penalty-assets").value = 60;
                document.getElementById("lbl-penalty-assets").innerText = "-60 pts";

                runSimulationLoop();
            });
        }
    }

    // 5. SIMULATION CALCULATION ENGINE LOOPS
    function runSimulationLoop() {
        const keys = Object.keys(SimulationEngine.archetypes);
        const tableBody = document.getElementById("ledger-table-body");
        const chartContainer = document.getElementById("chart-bars-container");

        if (!tableBody || !chartContainer) return;

        // Clear dynamic table entries and charts before re-rendering
        tableBody.innerHTML = "";
        chartContainer.innerHTML = "";

        let scoreDeltaSum = 0;
        let tierShiftsCounter = 0;

        keys.forEach(key => {
            const data = SimulationEngine.archetypes[key];
            const baseScore = SimulationEngine.calculateBaselineScore(key);
            const simScore = SimulationEngine.calculateSimulatedScore(key);

            const baseTier = SimulationEngine.getTier(baseScore);
            const simTier = SimulationEngine.getTier(simScore);

            const delta = simScore - baseScore;
            scoreDeltaSum += delta;

            // Classify regulatory Approval variance
            let tierShiftHtml = "";
            if (baseTier === simTier) {
                tierShiftHtml = `<span class="tier-shift-indicator tier-stable">Stable (${simTier})</span>`;
            } else {
                tierShiftsCounter++;
                const isUpgrade = (baseTier === "Subprime" && (simTier === "Prime" || simTier === "Super Prime")) || 
                                  (baseTier === "Prime" && simTier === "Super Prime");
                if (isUpgrade) {
                    tierShiftHtml = `<span class="tier-shift-indicator tier-upgraded">Upgraded ↗ ${simTier}</span>`;
                } else {
                    tierShiftHtml = `<span class="tier-shift-indicator tier-downgraded">Downgraded ↘ ${simTier}</span>`;
                }
            }

            // Build Row Elements
            const deltaClass = delta > 0 ? "delta-up" : (delta < 0 ? "delta-down" : "delta-neutral");
            const deltaSign = delta > 0 ? `+${delta}` : `${delta}`;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <span class="profile-name-cell">${data.name}</span>
                    <span class="profile-type-sub">${data.sub}</span>
                </td>
                <td><span style="font-family: var(--font-mono); font-weight:600; color: var(--text-muted);">${baseScore}</span></td>
                <td><span style="font-family: var(--font-mono); font-weight:700; color: var(--text-primary);">${simScore}</span></td>
                <td><span class="delta-badge ${deltaClass}">${deltaSign}</span></td>
                <td>${tierShiftHtml}</td>
            `;
            tableBody.appendChild(row);

            // Populate side-by-side Charting variables
            const chartCol = document.createElement("div");
            chartCol.className = "chart-column";

            // Scaling score range (300 - 1000) inside 110px bar maximum constraints
            const scaleHeight = (score) => {
                const clamped = Math.max(300, Math.min(1000, score)) - 300;
                return Math.round((clamped / 700) * 100);
            };

            const baseHeight = scaleHeight(baseScore);
            const simHeight = scaleHeight(simScore);

            chartCol.innerHTML = `
                <div class="bars-side-by-side">
                    <div class="bar-single base" style="height: ${baseHeight}px;" title="Baseline: ${baseScore}"></div>
                    <div class="bar-single sim" style="height: ${simHeight}px;" title="Simulated: ${simScore}"></div>
                </div>
                <span class="chart-column-label">${key.toUpperCase()}</span>
            `;
            chartContainer.appendChild(chartCol);
        });

        // Global KPI evaluations
        const averageDelta = (scoreDeltaSum / keys.length).toFixed(1);
        const avgShiftDisplay = document.getElementById("stat-avg-shift");
        if (avgShiftDisplay) {
            avgShiftDisplay.innerText = `${averageDelta > 0 ? '+' : ''}${averageDelta} pts`;
            avgShiftDisplay.className = averageDelta > 0 ? "val delta-up" : (averageDelta < 0 ? "val delta-down" : "val");
        }

        const shiftsDisplay = document.getElementById("stat-tier-events");
        if (shiftsDisplay) {
            shiftsDisplay.innerText = `${tierShiftsCounter} Profile${tierShiftsCounter !== 1 ? 's' : ''}`;
            shiftsDisplay.style.color = tierShiftsCounter > 0 ? "var(--accent-prism-violet)" : "var(--text-secondary)";
        }

        // Output weights parameters dynamically to code view panel
        const codePreview = document.getElementById("config-json-preview");
        if (codePreview) {
            codePreview.innerText = generateJsonConfig();
        }
    }

    // Generates formatted configurations configuration payload structure
    function generateJsonConfig() {
        const r = SimulationEngine.rules;
        const configOutput = {
            metadata: {
                engine: "Prism Dynamic Routing Matrix Rules",
                version: "2.4.0-AnalystSimulation",
                last_calculated: new Date().toISOString()
            },
            recommendation_weights: {
                dimension_weight_matrix: {
                    liquidity: r.liquidityWeight,
                    growth: r.growthWeight,
                    collateral: r.collateralWeight,
                    leverage: r.leverageWeight,
                    cash_flow: r.cashflowWeight
                },
                policy_exception_ceilings: {
                    liquidity_floor: r.liquidityFloor,
                    leverage_ceiling: r.leverageCeiling
                },
                severity_risk_penalties: {
                    missing_collateral_premium: r.physicalAssetsPenalty,
                    structural_volatility_ceiling: r.volatilityPenalty,
                    m_and_a_leverage_premium: r.acquisitionTransitionalPenalty
                },
                credit_score_boundaries: {
                    super_prime: r.superPrimeThreshold,
                    prime: r.primeThreshold
                }
            }
        };
        return JSON.stringify(configOutput, null, 2);
    }

    // 6. INITIALIZATION SEQUENCE
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAnalystSuite);
    } else {
        initAnalystSuite();
    }
})();