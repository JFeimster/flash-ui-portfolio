(function () {
    // 1. Inject Premium Custom Styling for Underwriter Cockpit
    const styles = `
        /* Underwriter Drawer Cockpit styling */
        .underwriter-cockpit-panel {
            position: fixed;
            top: 0;
            right: -500px;
            width: 480px;
            height: 100vh;
            background: rgba(10, 8, 19, 0.96);
            backdrop-filter: blur(25px);
            border-left: 1px solid var(--border-active);
            box-shadow: -10px 0 40px rgba(0, 0, 0, 0.8);
            z-index: 1001;
            transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            color: var(--text-primary);
            font-family: var(--font-sans);
        }

        .underwriter-cockpit-panel.open {
            right: 0;
        }

        .cockpit-header {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-muted);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(17, 14, 32, 0.5);
        }

        .cockpit-title-group {
            display: flex;
            flex-direction: column;
        }

        .cockpit-label {
            font-family: var(--font-mono);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--accent-rose);
            font-weight: 700;
        }

        .cockpit-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
        }

        .cockpit-close-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 20px;
            cursor: pointer;
            transition: var(--transition-smooth);
        }

        .cockpit-close-btn:hover {
            color: var(--accent-rose);
        }

        .cockpit-body {
            flex-grow: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .cockpit-section {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .cockpit-section-title {
            font-family: var(--font-mono);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-secondary);
            border-bottom: 1px solid var(--border-subtle);
            padding-bottom: 6px;
            margin-bottom: 4px;
        }

        /* Calibration Weights Grid */
        .calibration-grid {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .calibration-row {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .calibration-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }

        .calibration-name {
            font-weight: 500;
            color: var(--text-primary);
        }

        .calibration-val-badge {
            font-family: var(--font-mono);
            background: var(--bg-surface-elevated);
            color: var(--accent-purple);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            border: 1px solid var(--border-subtle);
        }

        .calibration-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: var(--border-muted);
            outline: none;
            transition: background .15s ease-in-out;
        }

        .calibration-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--accent-purple);
            cursor: pointer;
            box-shadow: 0 0 8px var(--accent-purple);
            transition: var(--transition-smooth);
        }

        .calibration-slider::-webkit-slider-thumb:hover {
            transform: scale(1.3);
        }

        /* Preset Fast Actions */
        .presets-wrapper {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }

        .preset-btn {
            background: var(--bg-surface-elevated);
            border: 1px solid var(--border-muted);
            color: var(--text-secondary);
            font-family: var(--font-sans);
            font-size: 11px;
            font-weight: 600;
            padding: 8px 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: var(--transition-smooth);
            text-align: center;
        }

        .preset-btn:hover {
            border-color: var(--accent-purple);
            color: var(--text-primary);
            background: var(--accent-purple-glow);
        }

        .preset-btn.active {
            background: var(--accent-purple);
            color: #fff;
            border-color: var(--accent-purple);
            box-shadow: 0 4px 12px var(--accent-purple-glow);
        }

        /* Risk Flags Overrides */
        .override-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .override-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 14px;
            background: var(--bg-surface-elevated);
            border-radius: 8px;
            border: 1px solid var(--border-subtle);
        }

        .override-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .override-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-primary);
        }

        .override-badge {
            font-family: var(--font-mono);
            font-size: 9px;
            color: var(--text-muted);
            text-transform: uppercase;
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 36px;
            height: 20px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider-round {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--border-muted);
            transition: .3s;
            border-radius: 20px;
        }

        .slider-round:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: var(--text-primary);
            transition: .3s;
            border-radius: 50%;
        }

        input:checked + .slider-round {
            background-color: var(--accent-rose);
        }

        input:checked + .slider-round:before {
            transform: translateX(16px);
        }

        /* Macroeconomic Stress Simulator */
        .stress-box {
            background: rgba(239, 68, 68, 0.03);
            border: 1px dashed rgba(239, 68, 68, 0.2);
            padding: 14px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .stress-select {
            background: var(--bg-surface);
            border: 1px solid var(--border-muted);
            color: var(--text-primary);
            font-family: var(--font-sans);
            font-size: 12px;
            padding: 8px 12px;
            border-radius: 8px;
            outline: none;
            width: 100%;
            cursor: pointer;
        }

        .stress-indicators {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .stress-indicator-card {
            background: var(--bg-surface);
            padding: 8px 10px;
            border-radius: 6px;
            border: 1px solid var(--border-subtle);
            font-size: 11px;
            display: flex;
            justify-content: space-between;
        }

        /* Dynamic Decision Audit Terminal */
        .audit-terminal {
            background: #020105;
            border: 1px solid var(--border-subtle);
            border-radius: 10px;
            padding: 12px;
            font-family: var(--font-mono);
            font-size: 11px;
            color: #34d399;
            height: 140px;
            overflow-y: auto;
            white-space: pre-wrap;
            line-height: 1.5;
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.8);
        }

        .terminal-line {
            margin-bottom: 4px;
        }

        .terminal-pass { color: #10b981; }
        .terminal-warn { color: var(--accent-amber); }
        .terminal-fail { color: var(--accent-rose); }
        .terminal-system { color: #60a5fa; }

        /* Trigger Button inside existing top bar */
        .btn-cockpit {
            background: var(--bg-surface-elevated);
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: var(--text-primary);
            font-family: var(--font-sans);
            font-size: 12px;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition-smooth);
        }

        .btn-cockpit:hover {
            border-color: var(--accent-rose);
            background: rgba(239, 68, 68, 0.05);
        }

        .btn-cockpit .indicator-red {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent-rose);
            box-shadow: 0 0 8px var(--accent-rose);
            animation: pulse-red 2s infinite;
        }

        @keyframes pulse-red {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        /* White Label override adjustments */
        body.white-label-mode .underwriter-cockpit-panel {
            background: #ffffff;
            border-left: 1px solid var(--border-muted);
            box-shadow: -10px 0 40px rgba(0, 0, 0, 0.05);
            color: var(--text-primary);
        }
        body.white-label-mode .underwriter-cockpit-panel .audit-terminal {
            background: #f4f4f5;
            color: #047857;
            box-shadow: none;
        }
    `;

    // Inject styles into document head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 2. State & Calibration Multipliers
    let userWeights = {
        capital: 1.0,
        capacity: 1.0,
        collateral: 1.0,
        character: 1.0,
        conditions: 1.0
    };

    let activeBypasses = {
        negative_ebitda: false,
        elevated_cac_payback: false,
        inventory_concentration: false,
        supply_chain_exposure: false,
        high_asset_maintenance: false
    };

    let stressScenario = 'baseline'; // baseline, hike, crunch, recession
    let stressModifiers = {
        rateAdd: 0.0,      // Add directly to APR
        capMult: 1.0,      // Multiply maximum calculated limits
        scorePenalty: 0    // Direct deduction to calculated index
    };

    // 3. Create and Inject the Right-side Cockpit Drawer DOM
    const drawerHtml = `
        <div class="underwriter-cockpit-panel" id="riskCockpitPanel">
            <div class="cockpit-header">
                <div class="cockpit-title-group">
                    <span class="cockpit-label">Analytical Overlay</span>
                    <span class="cockpit-title">Underwriter Risk Cockpit</span>
                </div>
                <button class="cockpit-close-btn" onclick="toggleCockpit()">&times;</button>
            </div>
            
            <div class="cockpit-body">
                <!-- Weight Presets -->
                <div class="cockpit-section">
                    <span class="cockpit-section-title">Calibration Presets</span>
                    <div class="presets-wrapper">
                        <button class="preset-btn active" id="preset-neutral" onclick="applyPreset('neutral')">Equal Weight</button>
                        <button class="preset-btn" id="preset-asset" onclick="applyPreset('asset')">Collateral Heavy</button>
                        <button class="preset-btn" id="preset-flow" onclick="applyPreset('flow')">Capacity Bound</button>
                    </div>
                </div>

                <!-- Custom Weight Calibrator -->
                <div class="cockpit-section">
                    <span class="cockpit-section-title">5 Cs Scorecard Tuning</span>
                    <div class="calibration-grid">
                        <div class="calibration-row">
                            <div class="calibration-meta">
                                <span class="calibration-name">Capital Leverage</span>
                                <span class="calibration-val-badge" id="lbl-w-capital">1.0x</span>
                            </div>
                            <input type="range" class="calibration-slider" id="slide-w-capital" min="0" max="3" step="0.1" value="1.0" oninput="adjustWeight('capital', this.value)">
                        </div>
                        <div class="calibration-row">
                            <div class="calibration-meta">
                                <span class="calibration-name">Capacity Flow</span>
                                <span class="calibration-val-badge" id="lbl-w-capacity">1.0x</span>
                            </div>
                            <input type="range" class="calibration-slider" id="slide-w-capacity" min="0" max="3" step="0.1" value="1.0" oninput="adjustWeight('capacity', this.value)">
                        </div>
                        <div class="calibration-row">
                            <div class="calibration-meta">
                                <span class="calibration-name">Collateral Security</span>
                                <span class="calibration-val-badge" id="lbl-w-collateral">1.0x</span>
                            </div>
                            <input type="range" class="calibration-slider" id="slide-w-collateral" min="0" max="3" step="0.1" value="1.0" oninput="adjustWeight('collateral', this.value)">
                        </div>
                        <div class="calibration-row">
                            <div class="calibration-meta">
                                <span class="calibration-name">Character Profile</span>
                                <span class="calibration-val-badge" id="lbl-w-character">1.0x</span>
                            </div>
                            <input type="range" class="calibration-slider" id="slide-w-character" min="0" max="3" step="0.1" value="1.0" oninput="adjustWeight('character', this.value)">
                        </div>
                        <div class="calibration-row">
                            <div class="calibration-meta">
                                <span class="calibration-name">Macro Conditions</span>
                                <span class="calibration-val-badge" id="lbl-w-conditions">1.0x</span>
                            </div>
                            <input type="range" class="calibration-slider" id="slide-w-conditions" min="0" max="3" step="0.1" value="1.0" oninput="adjustWeight('conditions', this.value)">
                        </div>
                    </div>
                </div>

                <!-- Live Risk Bypasses -->
                <div class="cockpit-section">
                    <span class="cockpit-section-title">Underwriting Rule Overrides</span>
                    <div class="override-grid">
                        <div class="override-item">
                            <div class="override-info">
                                <span class="override-title">Bypass EBITDA Burn Gate</span>
                                <span class="override-badge">negative_ebitda</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="bypass-negative_ebitda" onchange="toggleBypass('negative_ebitda', this.checked)">
                                <span class="slider-round"></span>
                            </label>
                        </div>
                        <div class="override-item">
                            <div class="override-info">
                                <span class="override-title">Ignore Node Concentration</span>
                                <span class="override-badge">inventory_concentration</span>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="bypass-inventory_concentration" onchange="toggleBypass('inventory_concentration', this.checked)">
                                <span class="slider-round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Macro Stress Simulator -->
                <div class="cockpit-section">
                    <span class="cockpit-section-title">Macro Stress Simulation Engine</span>
                    <div class="stress-box">
                        <select class="stress-select" id="stressScenarioSelect" onchange="triggerStressScenario(this.value)">
                            <option value="baseline">Baseline Corridor (SEC Normal)</option>
                            <option value="hike">Fed Rate Expansion (+300bps Shock)</option>
                            <option value="crunch">Interbank Liquidity Squeeze (-25% Cap)</option>
                            <option value="recession">Severe Stagflationary Headwind</option>
                        </select>
                        <div class="stress-indicators">
                            <div class="stress-indicator-card">
                                <span style="color: var(--text-muted)">Cost Drag</span>
                                <span style="font-weight:700;" id="stress-indicator-rate">+0.00%</span>
                            </div>
                            <div class="stress-indicator-card">
                                <span style="color: var(--text-muted)">Cap Cap</span>
                                <span style="font-weight:700;" id="stress-indicator-limit">100%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Live Evaluation Tree Logs -->
                <div class="cockpit-section">
                    <span class="cockpit-section-title">Real-Time Routing Decision Log</span>
                    <div class="audit-terminal" id="cockpitTerminal">
                        <!-- Instantly logs evaluation decisions -->
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inject drawer to body
    const div = document.createElement('div');
    div.innerHTML = drawerHtml;
    document.body.appendChild(div);

    // 4. Inject Risk Cockpit button into page Header bar
    const controlsGroup = document.querySelector('.controls-group');
    if (controlsGroup) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn-cockpit';
        toggleBtn.id = 'riskCockpitToggleBtn';
        toggleBtn.onclick = toggleCockpit;
        toggleBtn.innerHTML = `
            <div class="indicator-red"></div>
            <span>Risk Command Center</span>
        `;
        controlsGroup.insertBefore(toggleBtn, controlsGroup.firstChild);
    }

    // 5. Drawer visibility controller
    window.toggleCockpit = function () {
        const panel = document.getElementById("riskCockpitPanel");
        panel.classList.toggle("open");
        writeLog("[SYSTEM] Initiated analytical underwriter session.", "system");
    };

    // 6. Output to internal Cockpit custom terminal logging tool
    function writeLog(text, type = "normal") {
        const term = document.getElementById("cockpitTerminal");
        if (!term) return;
        const line = document.createElement("div");
        line.className = `terminal-line terminal-${type}`;
        line.innerText = `[${new Date().toLocaleTimeString()}] ${text}`;
        term.appendChild(line);
        term.scrollTop = term.scrollHeight;
    }

    // 7. Preset Selection Handler
    window.applyPreset = function (preset) {
        const buttons = document.querySelectorAll(".preset-btn");
        buttons.forEach(btn => btn.classList.remove("active"));
        document.getElementById(`preset-${preset}`).classList.add("active");

        if (preset === 'neutral') {
            userWeights = { capital: 1.0, capacity: 1.0, collateral: 1.0, character: 1.0, conditions: 1.0 };
        } else if (preset === 'asset') {
            userWeights = { capital: 0.5, capacity: 0.5, collateral: 2.2, character: 0.8, conditions: 1.0 };
            writeLog("[CALIBRATION] Optimized weights toward asset security dimensions.", "system");
        } else if (preset === 'flow') {
            userWeights = { capital: 0.5, capacity: 2.5, collateral: 0.3, character: 1.2, conditions: 1.0 };
            writeLog("[CALIBRATION] Focused matching heuristics strictly onto recurring capacity.", "system");
        }

        // Apply visual updates back onto the ranges
        for (const [key, val] of Object.entries(userWeights)) {
            document.getElementById(`slide-w-${key}`).value = val;
            document.getElementById(`lbl-w-${key}`).textContent = `${val.toFixed(1)}x`;
        }

        recomputeEngine();
    };

    // Slider adjust handler
    window.adjustWeight = function (dimension, val) {
        userWeights[dimension] = parseFloat(val);
        document.getElementById(`lbl-w-${dimension}`).textContent = `${parseFloat(val).toFixed(1)}x`;
        
        // Remove preset selection if slider changes manually
        document.querySelectorAll(".presets-wrapper .preset-btn").forEach(btn => btn.classList.remove("active"));
        recomputeEngine();
    };

    // Bypass controller toggler
    window.toggleBypass = function (key, state) {
        activeBypasses[key] = state;
        writeLog(`[BYPASS OVERRIDE] Rule matching status for '${key}' updated to ${state ? 'BYPASSED' : 'ENFORCED'}.`, state ? "warn" : "normal");
        recomputeEngine();
    };

    // Trigger Macro Scenario Shock presets
    window.triggerStressScenario = function (val) {
        stressScenario = val;
        const rateIndicator = document.getElementById("stress-indicator-rate");
        const limitIndicator = document.getElementById("stress-indicator-limit");

        if (val === 'baseline') {
            stressModifiers = { rateAdd: 0.0, capMult: 1.0, scorePenalty: 0 };
            rateIndicator.textContent = "+0.00%";
            limitIndicator.textContent = "100%";
            writeLog("[STRESS SIM] Returned matrix metrics corridor to standard baseline parameters.", "system");
        } else if (val === 'hike') {
            stressModifiers = { rateAdd: 3.0, capMult: 0.9, scorePenalty: 4 };
            rateIndicator.textContent = "+3.00%";
            limitIndicator.textContent = "90% Cap";
            writeLog("[STRESS SIM] Loaded rate expansion shock. Baseline underwriting APRs penalized (+300bps drag).", "warn");
        } else if (val === 'crunch') {
            stressModifiers = { rateAdd: 1.2, capMult: 0.7, scorePenalty: 8 };
            rateIndicator.textContent = "+1.20%";
            limitIndicator.textContent = "70% Cap";
            writeLog("[STRESS SIM] Initiated interbank liquidity squeeze stress. Institutional caps restricted to 70% threshold.", "warn");
        } else if (val === 'recession') {
            stressModifiers = { rateAdd: 4.5, capMult: 0.55, scorePenalty: 15 };
            rateIndicator.textContent = "+4.50%";
            limitIndicator.textContent = "55% Cap";
            writeLog("[STRESS SIM] CRITICAL: Severe stagflationary headwinds applied. Combined rating degradation implemented (-15 Points).", "fail");
        }

        recomputeEngine();
    };

    // 8. Re-map the baseline rendering code dynamically
    // Save original loading routine so we can patch or wrap around it
    const originalLoadArchetype = window.loadArchetype;

    window.loadArchetype = function (key) {
        currentArchetypeKey = key;
        const arch = borrower_archetypes[key];
        if (!arch) return;

        writeLog(`[AUDIT] Assessing borrower profile: '${arch.name}'`, "system");

        // Compute dynamically recalibrated weighted Readiness Index score
        const numer = 
            (arch.dimensions.capital * userWeights.capital) +
            (arch.dimensions.capacity * userWeights.capacity) +
            (arch.dimensions.collateral * userWeights.collateral) +
            (arch.dimensions.character * userWeights.character) +
            (arch.dimensions.conditions * userWeights.conditions);

        const denom = 
            userWeights.capital + 
            userWeights.capacity + 
            userWeights.collateral + 
            userWeights.character + 
            userWeights.conditions;

        let dynamicScore = Math.min(100, Math.round(numer / (denom || 1)));
        
        // Apply stress index penalties
        if (stressModifiers.scorePenalty > 0) {
            dynamicScore = Math.max(0, dynamicScore - stressModifiers.scorePenalty);
            writeLog(`[EVAL] Score reduced by ${stressModifiers.scorePenalty} pts due to macro conditions shock.`, "warn");
        }

        // Render readiness score circle
        updateScoreCircle(dynamicScore);

        // Populate and update the 5 C credit dimensions in main UI
        const container = document.getElementById("dimensionsContainer");
        if (container) {
            container.innerHTML = "";
            for (const [dimKey, val] of Object.entries(arch.dimensions)) {
                const labelMeta = readiness_dimensions[dimKey];
                container.innerHTML += `
                    <div class="dimension-item">
                        <div class="dimension-meta">
                            <span class="dimension-name">${labelMeta.title}</span>
                            <span class="dimension-val">${val}%</span>
                        </div>
                        <div class="dimension-bar-bg">
                            <div class="dimension-bar-fill" style="width: ${val}%;"></div>
                        </div>
                    </div>
                `;
            }
        }

        // Dynamically recalculate matched channels based on stress-modified routing formulas
        const recContainer = document.getElementById("pathRecommendationContainer");
        if (recContainer) {
            recContainer.innerHTML = "";
            const matchedProducts = [];

            routing_logic.rules.forEach(rule => {
                let matches = true;
                let failReason = "";

                // Evaluate standard score hurdles
                if (dynamicScore < rule.min_score) {
                    matches = false;
                    failReason = `Score index of ${dynamicScore} falls below target requirement hurdle of ${rule.min_score}.`;
                }
                
                // Evaluate assets & capacity requirements
                if (arch.arr < (rule.min_arr || 0)) {
                    matches = false;
                    failReason = `Revenue capacity of $${(arch.arr/1000000).toFixed(2)}M is lower than matching barrier.`;
                }

                if (rule.min_dscr && arch.dscr < rule.min_dscr) {
                    matches = false;
                    failReason = `DSCR rating constraint metrics out of alignment boundaries.`;
                }

                if (matches) {
                    const productInfo = products.find(p => p.id === rule.product_id);
                    const providerInfo = providers.find(p => p.id === productInfo.provider_id);
                    
                    // Determine rate calculation factoring stress testing scenarios
                    const baseAprNum = parseFloat(rule.base_apr.replace("%", ""));
                    const dynamicApr = (baseAprNum + stressModifiers.rateAdd).toFixed(2) + "%";

                    // Determine max limits dynamically adjusted
                    const leverageMax = Math.round(arch.arr * rule.max_leverage_arr_ratio * stressModifiers.capMult);
                    const confidence = dynamicScore > 85 ? "High Match" : "Moderate Match";
                    const confClass = dynamicScore > 85 ? "conf-high" : "conf-medium";

                    matchedProducts.push({
                        name: productInfo.name,
                        provider: providerInfo.name,
                        capacity: `$${(leverageMax / 1000000).toFixed(2)}M`,
                        apr: dynamicApr,
                        confidence: confidence,
                        confClass: confClass
                    });

                    writeLog(`[ROUTE PASS] Verified compatibility match verified for dynamic route: '${productInfo.name}'`, "pass");
                } else {
                    const productInfo = products.find(p => p.id === rule.product_id);
                    writeLog(`[ROUTE FAIL] Excluded channel '${productInfo.name}' due to constraints logic: ${failReason}`, "fail");
                }
            });

            if (matchedProducts.length === 0) {
                recContainer.innerHTML = `
                    <div class="path-row">
                        <div class="path-title-text" style="color:var(--accent-rose);">No pre-qualified institutional facilities matching current routing rules. Consider enabling bypass overrides in Cockpit.</div>
                    </div>`;
            } else {
                matchedProducts.forEach(prod => {
                    recContainer.innerHTML += `
                        <div class="path-row">
                            <div class="path-meta-primary">
                                <span class="path-title-text">${prod.name}</span>
                                <span class="path-provider">${prod.provider}</span>
                            </div>
                            <div class="path-metric">
                                <span class="path-metric-lbl">Max Capacity</span>
                                <span class="path-metric-val">${prod.capacity}</span>
                            </div>
                            <div class="path-metric">
                                <span class="path-metric-lbl">Indicative Cost</span>
                                <span class="path-metric-val" style="color: var(--accent-purple);">${prod.apr}</span>
                            </div>
                            <div class="path-metric">
                                <span class="path-metric-lbl">System Confidence</span>
                                <span class="${prod.confClass} confidence-pill">${prod.confidence}</span>
                            </div>
                            <div class="action-icon">→</div>
                        </div>
                    `;
                });
            }
        }

        // Construct Risk flags panel checks dynamically
        const riskContainer = document.getElementById("riskFlagsContainer");
        if (riskContainer) {
            riskContainer.innerHTML = "";
            
            // Build dynamically active risk list, stripping out bypassed risk flags
            const actualTriggers = arch.risk_triggers.filter(t => !activeBypasses[t]);
            const bypassedTriggersCount = arch.risk_triggers.length - actualTriggers.length;

            if (bypassedTriggersCount > 0) {
                writeLog(`[EVAL] Bypassed and bypassed ${bypassedTriggersCount} trigger constraints based on analyst input overrides.`, "warn");
            }

            if (actualTriggers.length === 0) {
                riskContainer.innerHTML = `
                    <div class="risk-item" style="background: rgba(16, 185, 129, 0.03); border-color: rgba(16, 185, 129, 0.1);">
                        <div class="risk-icon" style="color: var(--accent-emerald);">✓</div>
                        <div class="risk-details">
                            <div class="risk-title" style="color: var(--accent-emerald);">0 Active Underwriting Triggers</div>
                            <div class="risk-desc">Credit evaluation parameters fall fully inside secure, clean tolerance corridors.</div>
                        </div>
                    </div>
                `;
            } else {
                actualTriggers.forEach(trigger => {
                    const spec = risk_flags[trigger];
                    riskContainer.innerHTML += `
                        <div class="risk-item">
                            <div class="risk-icon">⚠️</div>
                            <div class="risk-details">
                                <div class="risk-title">${spec.level} Underwriting Alert - ${trigger.toUpperCase().replace(/_/g, " ")}</div>
                                <div class="risk-desc">${spec.message}</div>
                            </div>
                        </div>
                    `;
                });
            }
        }

        // Apply visual modifications onto Verticals route configurations
        for (const [vKey, val] of Object.entries(arch.verticals_config)) {
            const elem = document.getElementById(vKey);
            if (elem) {
                elem.textContent = val;
            }
        }

        // Update the white-label client view interface
        const baseLimit = Math.round(arch.arr * 0.45 * stressModifiers.capMult);
        const aggLimitEl = document.getElementById("wlAggLimit");
        if (aggLimitEl) {
            aggLimitEl.textContent = `$${(baseLimit / 1000000).toFixed(2)}M`;
        }
        
        const wlClassEl = document.getElementById("wlClass");
        if (wlClassEl) {
            wlClassEl.textContent = dynamicScore > 85 ? "Enterprise A+" : "Standard Tier-B";
        }

        const wlCostEl = document.getElementById("wlCost");
        if (wlCostEl) {
            const calculatedCostNum = dynamicScore > 85 ? (6.85 + stressModifiers.rateAdd) : (8.95 + stressModifiers.rateAdd);
            wlCostEl.textContent = calculatedCostNum.toFixed(2) + "% (Weighted)";
        }

        const wlSelEl = document.getElementById("wlSelectedName");
        if (wlSelEl) {
            wlSelEl.textContent = arch.name + " Safe Portal";
        }

        updateConsoleOutput();
    };

    // Helper method to re-run the updated computation pipeline on demand
    function recomputeEngine() {
        if (window.currentArchetypeKey) {
            window.loadArchetype(window.currentArchetypeKey);
        }
    }

    // Run first baseline calibration initialization
    writeLog("[SYSTEM] Underwriter calibration interface fully connected to FIE core.", "system");
})();