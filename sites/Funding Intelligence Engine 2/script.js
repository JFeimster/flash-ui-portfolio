// Embedded simulation JSON data structures matching requested design pattern:
    // borrower_archetypes.json, providers.json, products.json, routing_logic.json,
    // recommendation_weights.json, risk_flags.json, readiness_dimensions.json

    const borrower_archetypes = {
        "saas_series_a": {
            "name": "SaaS Platform (Series A)",
            "arr": 4500000,
            "mrr": 375000,
            "runway_months": 18,
            "dscr": 1.45,
            "ebitda": -250000,
            "readinessScore": 84,
            "risk_triggers": ["negative_ebitda", "elevated_cac_payback"],
            "dimensions": {
                "capital": 88,
                "capacity": 79,
                "collateral": 55,
                "character": 92,
                "conditions": 85
            },
            "verticals_config": {
                "wc_ltv": "N/A", "wc_apr": "8.4%",
                "ecom_mult": "N/A", "ecom_min": "N/A",
                "startup_lev": "3.5x ARR", "startup_warr": "0.15%",
                "equip_term": "48 M", "equip_amort": "Straight",
                "re_ltv": "N/A", "re_dscr": "N/A",
                "acq_dscr": "1.35x", "acq_lev": "2.8x"
            }
        },
        "ecom_scaleup": {
            "name": "E-Commerce Velocity Scaleup",
            "arr": 8200000,
            "mrr": 680000,
            "runway_months": 24,
            "dscr": 1.20,
            "ebitda": 150000,
            "readinessScore": 76,
            "risk_triggers": ["inventory_concentration", "supply_chain_exposure"],
            "dimensions": {
                "capital": 65,
                "capacity": 85,
                "collateral": 70,
                "character": 80,
                "conditions": 75
            },
            "verticals_config": {
                "wc_ltv": "1.25x Inventory", "wc_apr": "9.2%",
                "ecom_mult": "3.5x MRR", "ecom_min": "$100k",
                "startup_lev": "N/A", "startup_warr": "N/A",
                "equip_term": "36 M", "equip_amort": "Declining",
                "re_ltv": "N/A", "re_dscr": "N/A",
                "acq_dscr": "N/A", "acq_lev": "N/A"
            }
        },
        "heavy_logistics": {
            "name": "Apex Cargo & Logistics",
            "arr": 15400000,
            "mrr": 1280000,
            "runway_months": 48,
            "dscr": 2.15,
            "ebitda": 1250000,
            "readinessScore": 92,
            "risk_triggers": ["high_asset_maintenance"],
            "dimensions": {
                "capital": 95,
                "capacity": 94,
                "collateral": 98,
                "character": 90,
                "conditions": 82
            },
            "verticals_config": {
                "wc_ltv": "0.85x Accounts Rec", "wc_apr": "7.1%",
                "ecom_mult": "N/A", "ecom_min": "N/A",
                "startup_lev": "N/A", "startup_warr": "N/A",
                "equip_term": "72 M", "equip_amort": "Linear",
                "re_ltv": "75%", "re_dscr": "1.50x",
                "acq_dscr": "1.75x", "acq_lev": "3.2x"
            }
        },
        "mainstreet_med": {
            "name": "Core-Surgical Care Group",
            "arr": 3200000,
            "mrr": 266000,
            "runway_months": 60,
            "dscr": 1.80,
            "ebitda": 450000,
            "readinessScore": 88,
            "risk_triggers": [],
            "dimensions": {
                "capital": 85,
                "capacity": 90,
                "collateral": 80,
                "character": 95,
                "conditions": 90
            },
            "verticals_config": {
                "wc_ltv": "1.00x Rec", "wc_apr": "6.8%",
                "ecom_mult": "N/A", "ecom_min": "N/A",
                "startup_lev": "N/A", "startup_warr": "N/A",
                "equip_term": "60 M", "equip_amort": "Straight",
                "re_ltv": "80%", "re_dscr": "1.25x",
                "acq_dscr": "1.45x", "acq_lev": "2.5x"
            }
        }
    };

    const providers = [
        { "id": "p_valois_debt", "name": "Valois Credit Opportunities", "category": "Institutional Debt" },
        { "id": "p_vanguard", "name": "Vanguard Secured Lending", "category": "Asset-Backed Banking" },
        { "id": "p_apex_capital", "name": "Apex Velocity Finance", "category": "Growth Capital" }
    ];

    const products = [
        { "id": "prod_rev_debt", "name": "Revenue-Based Non-Dilutive Bond", "provider_id": "p_valois_debt" },
        { "id": "prod_venture_line", "name": "Venture Debt Runway Line", "provider_id": "p_valois_debt" },
        { "id": "prod_loc_secured", "name": "Asset-Backed Credit Facility", "provider_id": "p_vanguard" },
        { "id": "prod_growth_cash", "name": "Dynamic Working Capital Advance", "provider_id": "p_apex_capital" }
    ];

    const routing_logic = {
        "rules": [
            {
                "product_id": "prod_venture_line",
                "min_score": 80,
                "min_arr": 3000000,
                "max_leverage_arr_ratio": 0.45,
                "base_apr": "8.5%"
            },
            {
                "product_id": "prod_loc_secured",
                "min_score": 75,
                "min_dscr": 1.15,
                "max_leverage_arr_ratio": 0.35,
                "base_apr": "6.9%"
            },
            {
                "product_id": "prod_rev_debt",
                "min_score": 70,
                "min_arr": 1500000,
                "max_leverage_arr_ratio": 0.30,
                "base_apr": "9.2%"
            },
            {
                "product_id": "prod_growth_cash",
                "min_score": 65,
                "min_arr": 1000000,
                "max_leverage_arr_ratio": 0.25,
                "base_apr": "11.0%"
            }
        ]
    };

    const risk_flags = {
        "negative_ebitda": { "level": "Medium", "message": "EBITDA burn limits traditional cash-flow lending models." },
        "elevated_cac_payback": { "level": "Low", "message": "CAC Payback period exceeds target threshold metrics." },
        "inventory_concentration": { "level": "High", "message": "Supply node concentration poses operational pipeline threats." },
        "supply_chain_exposure": { "level": "Medium", "message": "Exposure to overseas customs clearances might restrict collateral validation." },
        "high_asset_maintenance": { "level": "Low", "message": "Capital expenditures forecast might impact debt servicing capability." }
    };

    const readiness_dimensions = {
        "capital": { "title": "Capital", "desc": "Equity-to-debt ratio" },
        "capacity": { "title": "Capacity", "desc": "Historical/expected runway & revenue" },
        "collateral": { "title": "Collateral", "desc": "Secured physical or IP assets" },
        "character": { "title": "Character", "desc": "Lender trust & executive history" },
        "conditions": { "title": "Conditions", "desc": "Market trends and macro risk vectors" }
    };

    // State Management
    let currentArchetypeKey = "saas_series_a";
    let whiteLabelModeActive = false;

    // Initialization
    window.onload = () => {
        // Build Archetype Switcher Select Dropdown options
        const select = document.getElementById("archetypeSelect");
        for (const [key, val] of Object.entries(borrower_archetypes)) {
            const opt = document.createElement("option");
            opt.value = key;
            opt.textContent = val.name;
            select.appendChild(opt);
        }

        loadArchetype(currentArchetypeKey);
        switchDebugTab('archetypes');
    };

    // Core Dynamic Rendering Engine
    function loadArchetype(key) {
        currentArchetypeKey = key;
        const arch = borrower_archetypes[key];

        // 1. Update Scorecard
        const targetScore = arch.readinessScore;
        updateScoreCircle(targetScore);

        // Update 5 Credit Dimensions
        const container = document.getElementById("dimensionsContainer");
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

        // 2. Compute Routing & Load Recommendations
        const recContainer = document.getElementById("pathRecommendationContainer");
        recContainer.innerHTML = "";

        // Dynamic Rule Matching Compilation Logic
        const matchedProducts = [];
        routing_logic.rules.forEach(rule => {
            let matches = true;
            if (targetScore < rule.min_score) matches = false;
            if (arch.arr < (rule.min_arr || 0)) matches = false;
            if (rule.min_dscr && arch.dscr < rule.min_dscr) matches = false;

            if (matches) {
                const productInfo = products.find(p => p.id === rule.product_id);
                const providerInfo = providers.find(p => p.id === productInfo.provider_id);
                
                // Determine confidence & max capacity leverage based on system formulas
                const leverageMax = Math.round(arch.arr * rule.max_leverage_arr_ratio);
                const confidence = targetScore > 85 ? "High Match" : "Moderate Match";
                const confClass = targetScore > 85 ? "conf-high" : "conf-medium";

                matchedProducts.push({
                    name: productInfo.name,
                    provider: providerInfo.name,
                    capacity: `$${(leverageMax / 1000000).toFixed(2)}M`,
                    apr: rule.base_apr,
                    confidence: confidence,
                    confClass: confClass
                });
            }
        });

        if (matchedProducts.length === 0) {
            recContainer.innerHTML = `<div class="path-row"><div class="path-title-text" style="color:var(--accent-rose);">No pre-qualified institutional facilities matching current routing rules.</div></div>`;
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

        // 3. Update Underwriting Risk Triggers
        const riskContainer = document.getElementById("riskFlagsContainer");
        riskContainer.innerHTML = "";
        
        if (arch.risk_triggers.length === 0) {
            riskContainer.innerHTML = `
                <div class="risk-item" style="background: rgba(16, 185, 129, 0.03); border-color: rgba(16, 185, 129, 0.1);">
                    <div class="risk-icon" style="color: var(--accent-emerald);">✓</div>
                    <div class="risk-details">
                        <div class="risk-title" style="color: var(--accent-emerald);">0 Active Risk Triggers</div>
                        <div class="risk-desc">Credit dimensions fall clean of system risk parameters.</div>
                    </div>
                </div>
            `;
        } else {
            arch.risk_triggers.forEach(trigger => {
                const spec = risk_flags[trigger];
                riskContainer.innerHTML += `
                    <div class="risk-item">
                        <div class="risk-icon">⚠️</div>
                        <div class="risk-details">
                            <div class="risk-title">${spec.level} Risk - ${trigger.toUpperCase().replace(/_/g, " ")}</div>
                            <div class="risk-desc">${spec.message}</div>
                        </div>
                    </div>
                `;
            });
        }

        // 4. Update Vertical Route Modules Stats
        for (const [vKey, val] of Object.entries(arch.verticals_config)) {
            const elem = document.getElementById(vKey);
            if (elem) {
                elem.textContent = val;
            }
        }

        // 5. Update White-Label Component Data
        const aggregatedLimitNum = Math.round(arch.arr * 0.45);
        document.getElementById("wlAggLimit").textContent = `$${(aggregatedLimitNum/1000000).toFixed(2)}M`;
        document.getElementById("wlClass").textContent = targetScore > 85 ? "Enterprise A+" : "Standard Tier-B";
        document.getElementById("wlCost").textContent = targetScore > 85 ? "6.85% (Weighted)" : "8.95% (Weighted)";
        document.getElementById("wlSelectedName").textContent = arch.name + " Secure Workspace";

        // Push current variables to the live Debug Console view if it's active
        updateConsoleOutput();
    }

    // Radial Score Progress Bar Animation Utility
    function updateScoreCircle(score) {
        const circle = document.getElementById("scoreValueArc");
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;

        // Animate counter
        const countDisplay = document.getElementById("scoreNumDisplay");
        let start = 0;
        const interval = setInterval(() => {
            if (start >= score) {
                clearInterval(interval);
                countDisplay.textContent = score;
            } else {
                start++;
                countDisplay.textContent = start;
            }
        }, 15);

        // Update Score Rating Category text
        const tierDisplay = document.getElementById("scoreTierDisplay");
        if (score >= 90) {
            tierDisplay.textContent = "Excellent Index";
            tierDisplay.style.color = "var(--accent-emerald)";
        } else if (score >= 80) {
            tierDisplay.textContent = "Premium Index";
            tierDisplay.style.color = "var(--accent-purple)";
        } else if (score >= 70) {
            tierDisplay.textContent = "Optimal Match";
            tierDisplay.style.color = "var(--accent-amber)";
        } else {
            tierDisplay.textContent = "Sub-Optimal";
            tierDisplay.style.color = "var(--accent-rose)";
        }
    }

    // Toggle White-Label View
    function toggleWhiteLabel() {
        whiteLabelModeActive = !whiteLabelModeActive;
        const body = document.body;
        const indicator = document.getElementById("whiteLabelIndicator");
        const wlComponent = document.getElementById("whiteLabelComponent");

        if (whiteLabelModeActive) {
            body.classList.add("white-label-mode");
            indicator.style.background = "var(--accent-emerald)";
            indicator.style.boxShadow = "0 0 8px var(--accent-emerald)";
            document.getElementById("whiteLabelText").textContent = "Public Secure Mode Active";
            
            // Transform brand parameters & public components visually to show bespoke styling
            document.getElementById("wlBrandTitle").textContent = "Beside Capital - Client Vault";
            document.getElementById("wlBrandSubtitle").textContent = "Syndicated Delivery Framework";
            document.getElementById("wlModeLabel").textContent = "Client Interface Active";
            wlComponent.style.border = "1px solid var(--accent-emerald)";
        } else {
            body.classList.remove("white-label-mode");
            indicator.style.background = "var(--accent-purple)";
            indicator.style.boxShadow = "0 0 8px var(--accent-purple)";
            document.getElementById("whiteLabelText").textContent = "White-Label Delivery";

            document.getElementById("wlBrandTitle").textContent = "VALOIS Partner Delivery Node";
            document.getElementById("wlBrandSubtitle").textContent = "Public Access Client Portal";
            document.getElementById("wlModeLabel").textContent = "Secure Client Vault";
            wlComponent.style.border = "1px dashed var(--border-muted)";
        }
    }

    // Partner Syndicated CTA Alert
    function triggerPartnerAction() {
        const arch = borrower_archetypes[currentArchetypeKey];
        const aggregateLimit = Math.round(arch.arr * 0.45);
        const code = `VALOIS-${Math.random().toString(36).substr(2, 6).toUpperCase()}-NODE-${arch.readinessScore}`;
        alert(`Syndicated Partner Payload Generated!\n\nReference: ${code}\nVerified Limit: $${(aggregateLimit/1000000).toFixed(2)}M\nSecurity Standard: SEC-256 compliant export token generated.`);
    }

    // Analyst Drawer Tabs & Debug Output Engine
    let activeDebugTab = "archetypes";

    function toggleDebugDrawer() {
        const drawer = document.getElementById("analystDrawer");
        drawer.classList.toggle("open");
    }

    function switchDebugTab(tabName) {
        activeDebugTab = tabName;
        const tabs = document.querySelectorAll(".debug-tab");
        tabs.forEach(tab => {
            tab.classList.remove("active");
            if (tab.innerText.includes(tabName) || (tabName === 'vercel' && tab.innerText.includes('Vercel'))) {
                tab.classList.add("active");
            }
        });
        updateConsoleOutput();
    }

    function updateConsoleOutput() {
        const output = document.getElementById("debugContent");
        
        if (activeDebugTab === "archetypes") {
            output.innerHTML = `
                <div style="color: #a1a1aa; margin-bottom: 12px;">// Loaded: borrower_archetypes.json - Representing borrower personas parameters</div>
                <pre style="color: #c084fc;">${JSON.stringify(borrower_archetypes, null, 2)}</pre>
            `;
        } else if (activeDebugTab === "providers") {
            output.innerHTML = `
                <div style="color: #a1a1aa; margin-bottom: 12px;">// Loaded: providers.json & products.json - Matched institutional channels</div>
                <pre style="color: #22d3ee;">${JSON.stringify({ providers, products }, null, 2)}</pre>
            `;
        } else if (activeDebugTab === "routing") {
            output.innerHTML = `
                <div style="color: #a1a1aa; margin-bottom: 12px;">// Loaded: routing_logic.json & recommendation_weights.json - Live underwriting triggers</div>
                <pre style="color: #34d399;">${JSON.stringify(routing_logic, null, 2)}</pre>
            `;
        } else if (activeDebugTab === "vercel") {
            output.innerHTML = `
                <div class="deployment-guide">
                    <h3 style="color: #f4f4f7; font-size: 14px; margin-bottom: 12px;">Deploy Valois Funding Intelligence to Vercel instantly</h3>
                    <p>To deploy this high-fidelity premium single page application directly on Vercel platform, use the following simple file layout framework:</p>
                    
                    <div class="code-block">
.
├── index.html       (Copy the entirety of this unified premium template)
├── package.json     (Minimal project metadata block)
└── vercel.json      (Deploy configurations routing file)
                    </div>

                    <h4 style="color: #f4f4f7; font-size: 12px; margin: 16px 0 8px 0;">Step 1: package.json Setup</h4>
                    <pre class="code-block">{
  "name": "valois-funding-intelligence",
  "version": "2.0.0",
  "scripts": {
    "start": "serve ."
  }
}</pre>

                    <h4 style="color: #f4f4f7; font-size: 12px; margin: 16px 0 8px 0;">Step 2: Install Vercel CLI & Deploy</h4>
                    <pre class="code-block">npm i -g vercel\nvercel deploy</pre>
                    <p style="color: var(--accent-emerald);">✔ Code compiles natively as a secure static web application requiring zero backend overhead.</p>
                </div>
            `;
        }
    }