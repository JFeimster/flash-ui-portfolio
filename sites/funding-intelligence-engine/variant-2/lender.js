(function() {
    // 1. Dynamic CSS Injection to maintain unified design system
    const styles = `
        /* Lender UI Styles */
        .btn-lender {
            background: linear-gradient(135deg, var(--accent-purple), #6366f1);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.1);
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
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .btn-lender:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
            filter: brightness(1.1);
        }

        .btn-lender.active {
            background: var(--bg-surface-elevated);
            border: 1px solid var(--accent-emerald);
            color: var(--accent-emerald);
            box-shadow: 0 0 12px var(--accent-emerald-glow);
        }

        .lender-grid {
            display: none;
            grid-template-columns: repeat(12, 1fr);
            gap: 20px;
        }

        body.lender-mode .bento-grid {
            display: none !important;
        }

        body.lender-mode .lender-grid {
            display: grid !important;
        }

        /* Bento cards updates for Lender Console */
        .col-lender-sidebar {
            grid-column: span 4;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .col-lender-main {
            grid-column: span 8;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        /* Filter Controls & Lists */
        .mandate-filter-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 14px;
        }

        .mandate-label {
            font-size: 11px;
            color: var(--text-secondary);
            font-weight: 500;
            display: flex;
            justify-content: space-between;
        }

        .mandate-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: var(--border-muted);
            outline: none;
            transition: var(--transition-smooth);
        }

        .mandate-slider::-webkit-slider-thumb {
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

        .mandate-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }

        /* Pipeline styling */
        .pipeline-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .pipeline-item {
            background: var(--bg-surface-elevated);
            border: 1px solid var(--border-subtle);
            border-radius: 10px;
            padding: 12px 16px;
            cursor: pointer;
            transition: var(--transition-smooth);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .pipeline-item:hover, .pipeline-item.active {
            border-color: var(--accent-purple);
            background: rgba(139, 92, 246, 0.03);
            transform: translateX(4px);
        }

        .pipeline-item.active {
            border-left: 3px solid var(--accent-purple);
        }

        .pipeline-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .pipeline-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
        }

        .pipeline-meta {
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--text-secondary);
        }

        .auction-badge {
            font-family: var(--font-mono);
            font-size: 10px;
            font-weight: 600;
            background: rgba(245, 158, 11, 0.1);
            color: var(--accent-amber);
            border: 1px solid rgba(245, 158, 11, 0.2);
            padding: 2px 8px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .auction-badge.active-green {
            background: var(--accent-emerald-glow);
            color: var(--accent-emerald);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        /* Term Sheet auction configurator */
        .bento-card.term-sheet-builder {
            border: 1px solid rgba(139, 92, 246, 0.2);
            background: linear-gradient(180deg, var(--bg-surface) 0%, rgba(13, 11, 26, 0.8) 100%);
        }

        .term-inputs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 24px;
        }

        .input-box {
            background: var(--bg-surface-elevated);
            border: 1px solid var(--border-muted);
            border-radius: 10px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .input-box-label {
            font-size: 10px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }

        .input-box-value-container {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
        }

        .input-box-value {
            font-family: var(--font-mono);
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
            background: transparent;
            border: none;
            outline: none;
            width: 100%;
        }

        .input-box-suffix {
            font-size: 12px;
            color: var(--text-muted);
            font-weight: 600;
        }

        .summary-metric-bar {
            background: rgba(255, 255, 255, 0.02);
            border-top: 1px solid var(--border-subtle);
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .summary-metric {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .summary-metric-lbl {
            font-size: 9px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .summary-metric-val {
            font-family: var(--font-mono);
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
        }

        /* Order book style transaction ledger */
        .ledger-container {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid var(--border-subtle);
            background: rgba(0, 0, 0, 0.15);
            border-radius: 10px;
            font-family: var(--font-mono);
            font-size: 11px;
            display: flex;
            flex-direction: column;
        }

        .ledger-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 12px;
            border-bottom: 1px solid var(--border-subtle);
        }

        .ledger-row:nth-child(even) {
            background: rgba(255, 255, 255, 0.01);
        }

        .ledger-row.success-flash {
            animation: highlight-green 2s ease-out;
        }

        @keyframes highlight-green {
            0% { background: rgba(16, 185, 129, 0.2); }
            100% { background: transparent; }
        }

        .ledger-time {
            color: var(--text-muted);
        }

        .ledger-msg {
            color: var(--text-secondary);
            flex-grow: 1;
            padding-left: 12px;
        }

        .ledger-val {
            color: var(--accent-purple);
            font-weight: 600;
        }

        /* White label theme support for lender */
        body.white-label-mode .btn-lender {
            background: linear-gradient(135deg, var(--accent-purple), #4f46e5);
            color: #fff;
        }
        body.white-label-mode .pipeline-item.active {
            background: #f5f3ff;
            border-left-color: var(--accent-purple);
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // 2. Mock Data for Anonymized Lender Dashboard Pipelines
    const anonymizedPipelines = {
        "saas_series_a": {
            "id": "saas_series_a",
            "alias": "Project Horizon // SaaS Enterprise",
            "industry": "Business Software",
            "arr": "$4.50M ARR",
            "metrics": "18m Runway • 1.45x DSCR",
            "highestBid": { "amount": 1600000, "rate": 8.2, "warrants": 0.1, "fee": 1.0 },
            "bidsCount": 4,
            "timeLeft": "03h 41m 19s",
            "rating": "Tier A",
            "underwritingSummary": "Aggregated recurring revenue yields robust debt service capacity. Mitigated churn factors support venture debt structures."
        },
        "ecom_scaleup": {
            "id": "ecom_scaleup",
            "alias": "Project Phoenix // DTC Velocity",
            "industry": "E-Commerce Logistics",
            "arr": "$8.20M ARR",
            "metrics": "24m Runway • 1.20x DSCR",
            "highestBid": { "amount": 2200000, "rate": 9.0, "warrants": 0.0, "fee": 1.5 },
            "bidsCount": 7,
            "timeLeft": "01h 12m 45s",
            "rating": "Tier B+",
            "underwritingSummary": "High operational transaction scale. Strong recurring cohort curves balanced by elevated supply-chain risk buffers."
        },
        "heavy_logistics": {
            "id": "heavy_logistics",
            "alias": "Project Atlas // Global Logistics",
            "industry": "Industrial & Freight",
            "arr": "$15.40M ARR",
            "metrics": "48m Runway • 2.15x DSCR",
            "highestBid": { "amount": 5500000, "rate": 6.8, "warrants": 0.0, "fee": 0.75 },
            "bidsCount": 3,
            "timeLeft": "08h 22m 04s",
            "rating": "Tier A++",
            "underwritingSummary": "Asset-backed balance sheet with high coverage multipliers. Excellent debt capability. Standard equipment/warehouse financing profile."
        },
        "mainstreet_med": {
            "id": "mainstreet_med",
            "alias": "Project Vitalis // Surgical Care",
            "industry": "Healthcare Providers",
            "arr": "$3.20M ARR",
            "metrics": "60m Runway • 1.80x DSCR",
            "highestBid": { "amount": 1200000, "rate": 6.5, "warrants": 0.0, "fee": 0.5 },
            "bidsCount": 2,
            "timeLeft": "14h 05m 51s",
            "rating": "Tier A-",
            "underwritingSummary": "Consistent, anti-cyclical revenue profile with strong underlying professional character score. Low volatility risk matrix."
        }
    };

    const simulatedCompetitors = [
        "Vanguard Strategic Debt Fund",
        "Apex Velocity Opportunities",
        "Apex Multi-Asset Trust",
        "Bespoke Private Credit VI",
        "Venture Yield Core Fund"
    ];

    // Current State
    let selectedPipelineKey = "saas_series_a";
    let mandateFilterMinTicket = 1000000;
    let bidsHistory = [
        { time: "10:14:22", fund: "Vanguard Credit", limit: "$1.50M", rate: "8.4%", warrants: "0.15%" },
        { time: "10:30:15", fund: "Apex Velocity", limit: "$1.40M", rate: "8.1%", warrants: "None" },
        { time: "11:02:49", fund: "Bespoke Capital", limit: "$1.60M", rate: "8.2%", warrants: "0.10%" }
    ];

    // 3. Inject Toggle Elements into Main Header Controls Group
    const controlsGroup = document.querySelector('.controls-group');
    if (controlsGroup) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn-lender';
        toggleBtn.id = 'lenderConsoleToggle';
        toggleBtn.innerHTML = `<span>⚖️</span> Lender Matchmaker`;
        toggleBtn.onclick = toggleLenderMode;
        controlsGroup.insertBefore(toggleBtn, controlsGroup.firstChild);
    }

    // 4. Construct the Complete Lender Auction Platform Grid DOM
    const appContainer = document.querySelector('.app-container');
    const lenderGrid = document.createElement('div');
    lenderGrid.className = 'lender-grid';
    lenderGrid.id = 'lenderAuctionContainer';

    lenderGrid.innerHTML = `
        <!-- Left Column: Pipeline & Mandate Filters (Col 4) -->
        <div class="col-lender-sidebar">
            
            <!-- Mandate Filters Card -->
            <div class="bento-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <div class="card-label">Mandate Allocation</div>
                        <div class="card-title">Investment Filters</div>
                    </div>
                    <span class="preview-badge" style="color: var(--accent-purple);">Dynamic Matches</span>
                </div>
                
                <p class="vertical-desc" style="margin-bottom: 14px;">Define capital concentration limits and risk tolerance models to isolate compatible syndicates.</p>
                
                <div class="mandate-filter-group">
                    <div class="mandate-label">
                        <span>Minimum Ticket Size</span>
                        <span id="lblMinTicket" style="font-family: var(--font-mono); color: var(--accent-purple); font-weight: 600;">$1.0M</span>
                    </div>
                    <input type="range" class="mandate-slider" id="sliderMinTicket" min="500000" max="5000000" step="100000" value="1000000" oninput="updateFilters(this.value)">
                </div>

                <div class="mandate-filter-group" style="margin-top: 8px;">
                    <div class="mandate-label">
                        <span>Target Risk Classification</span>
                    </div>
                    <select class="select-archetype" style="width: 100%; margin-top: 4px;" id="lenderRiskSelect" onchange="runFilterRecomputation()">
                        <option value="ALL">Show All Risk Profile Levels</option>
                        <option value="TIERA">Tier-A Prime Portfolio Only</option>
                        <option value="TIERB">Include High-Yield Tier-B</option>
                    </select>
                </div>
            </div>

            <!-- Anonymized Pipelines Card -->
            <div class="bento-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <div class="card-label">Anonymized Underwriting Nodes</div>
                        <div class="card-title">Active Auctions</div>
                    </div>
                </div>
                <div class="pipeline-list" id="pipelineContainer">
                    <!-- Loaded programmatically -->
                </div>
            </div>
        </div>

        <!-- Right Column: Interactive Bid Desk (Col 8) -->
        <div class="col-lender-main">
            
            <!-- Bid Configurator Block -->
            <div class="bento-card term-sheet-builder">
                <div class="card-header">
                    <div class="card-title-group">
                        <div class="card-label" id="auctionTargetLabel">BORROWER NODE // SAAS PLATFORM</div>
                        <div class="card-title" id="auctionTargetTitle">Structured Debt Configurator</div>
                    </div>
                    <div class="auction-badge active-green" id="auctionCountdownBadge">
                        <span>⏳</span> <span id="auctionCountdownText">03h 41m 19s remaining</span>
                    </div>
                </div>

                <p class="vertical-desc" style="margin-bottom: 20px; color: var(--text-primary);" id="auctionUnderwritingSummary">
                    Aggregate recurring revenue yields robust debt service capacity. Mitigated churn factors support venture debt structures.
                </p>

                <!-- Inputs Grid -->
                <div class="term-inputs-grid">
                    <div class="input-box">
                        <span class="input-box-label">Proposed Credit Limit</span>
                        <div class="input-box-value-container">
                            <input type="number" class="input-box-value" id="bidLimit" value="2000000" step="50000" oninput="recalculateBiddingMetrics()">
                            <span class="input-box-suffix">USD</span>
                        </div>
                    </div>
                    <div class="input-box">
                        <span class="input-box-label">Indicative Interest Rate</span>
                        <div class="input-box-value-container">
                            <input type="number" class="input-box-value" id="bidRate" value="7.9" step="0.1" oninput="recalculateBiddingMetrics()">
                            <span class="input-box-suffix">% APR</span>
                        </div>
                    </div>
                    <div class="input-box">
                        <span class="input-box-label">Warrant Coverage Cap</span>
                        <div class="input-box-value-container">
                            <input type="number" class="input-box-value" id="bidWarrants" value="0.10" step="0.05" oninput="recalculateBiddingMetrics()">
                            <span class="input-box-suffix">% COVER</span>
                        </div>
                    </div>
                    <div class="input-box">
                        <span class="input-box-label">Origination Processing Fee</span>
                        <div class="input-box-value-container">
                            <input type="number" class="input-box-value" id="bidFee" value="1.0" step="0.1" oninput="recalculateBiddingMetrics()">
                            <span class="input-box-suffix">% FEE</span>
                        </div>
                    </div>
                </div>

                <!-- Live Computed Analysis Metrics -->
                <div class="summary-metric-bar">
                    <div class="summary-metric">
                        <span class="summary-metric-lbl">Weighted Yield (Projected)</span>
                        <span class="summary-metric-val" style="color: var(--accent-emerald);" id="metricYield">8.15%</span>
                    </div>
                    <div class="summary-metric">
                        <span class="summary-metric-lbl">Liquidity LTV Lever</span>
                        <span class="summary-metric-val" id="metricLtvLever">0.44x</span>
                    </div>
                    <div class="summary-metric">
                        <span class="summary-metric-lbl">Collateral Multiplier</span>
                        <span class="summary-metric-val" id="metricCollateral">1.82x Coverage</span>
                    </div>
                    <div class="summary-metric">
                        <span class="summary-metric-lbl">Total Indicative Capital Cost</span>
                        <span class="summary-metric-val" id="metricTotInterest">$158,000 / year</span>
                    </div>
                </div>

                <!-- Submit Action Panel -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-emerald); display:inline-block; box-shadow: 0 0 6px var(--accent-emerald);"></span>
                        <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-secondary);" id="highBidStatusMessage">Current high bid is $1.60M at 8.2%</span>
                    </div>
                    <button class="partner-btn" style="background: linear-gradient(135deg, var(--accent-purple), #ec4899); color:#fff;" onclick="submitLenderBid()">
                        Transmit Competitive Term Sheet
                    </button>
                </div>
            </div>

            <!-- Ledger Card (Order Book style transactions) -->
            <div class="bento-card">
                <div class="card-header" style="margin-bottom: 12px;">
                    <div class="card-title-group">
                        <div class="card-label">Syndicate Stream Ledger</div>
                        <div class="card-title">Real-time Auction Activity Ledger</div>
                    </div>
                    <span class="preview-badge">Live System Feed</span>
                </div>
                
                <p class="vertical-desc" style="margin-bottom: 12px;">Cryptographic ledger tracks live counter-proposals in real-time. Submissions are hashed and signed on confirmation.</p>

                <div class="ledger-container" id="ledgerLogsContainer">
                    <!-- Dynamically populated rows -->
                </div>
            </div>
        </div>
    `;

    if (appContainer) {
        // Insert Lender Grid after the original Bento grid
        const originalGrid = document.querySelector('.bento-grid');
        appContainer.insertBefore(lenderGrid, originalGrid.nextSibling);
    }

    // 5. Switch Engine (Lender mode active toggle logic)
    function toggleLenderMode() {
        const body = document.body;
        const toggleBtn = document.getElementById('lenderConsoleToggle');
        body.classList.toggle('lender-mode');

        if (body.classList.contains('lender-mode')) {
            toggleBtn.classList.add('active');
            toggleBtn.innerHTML = `<span>📊</span> Borrower Analytics`;
            // Ensure first load renders active structures cleanly
            renderLenderPipeline();
            renderLedger();
            recalculateBiddingMetrics();
            startAuctionSimulations();
        } else {
            toggleBtn.classList.remove('active');
            toggleBtn.innerHTML = `<span>⚖️</span> Lender Matchmaker`;
            stopAuctionSimulations();
        }
    }

    // Update filter parameters dynamically
    window.updateFilters = function(val) {
        mandateFilterMinTicket = val;
        document.getElementById('lblMinTicket').textContent = `$${(val / 1000000).toFixed(1)}M`;
        runFilterRecomputation();
    };

    window.runFilterRecomputation = function() {
        renderLenderPipeline();
    };

    // Render active auction list matches
    function renderLenderPipeline() {
        const pipelineContainer = document.getElementById('pipelineContainer');
        if (!pipelineContainer) return;

        pipelineContainer.innerHTML = '';
        const riskSelect = document.getElementById('lenderRiskSelect');
        const selectedRiskFilter = riskSelect ? riskSelect.value : "ALL";

        Object.values(anonymizedPipelines).forEach(node => {
            // Apply filtering mechanics
            // 1. Min Ticket check: (we check if target's max capacity fits close to minimum ticket)
            const capacityFactorVal = selectedRiskFilter === "TIERA" ? 90 : 60;
            const meetsRisk = selectedRiskFilter === "ALL" || 
                              (selectedRiskFilter === "TIERA" && (node.rating.includes("Tier A") || node.rating.includes("A++"))) ||
                              (selectedRiskFilter === "TIERB" && node.rating.includes("Tier B"));

            // Parse default approximate ticket target from high bid value
            if (node.highestBid.amount >= mandateFilterMinTicket && meetsRisk) {
                const isActive = node.id === selectedPipelineKey ? "active" : "";
                pipelineContainer.innerHTML += `
                    <div class="pipeline-item ${isActive}" onclick="selectPipelineItem('${node.id}')">
                        <div class="pipeline-info">
                            <span class="pipeline-name">${node.alias}</span>
                            <span class="pipeline-meta">${node.arr} • ${node.rating}</span>
                        </div>
                        <div class="auction-badge ${isActive ? 'active-green' : ''}">
                            <span>⚖️</span> ${node.bidsCount} Bids
                        </div>
                    </div>
                `;
            }
        });

        if (pipelineContainer.innerHTML === '') {
            pipelineContainer.innerHTML = `<div class="vertical-desc" style="text-align:center; padding:20px;">Zero matched mandates. Adjust threshold requirements.</div>`;
        }
    }

    // Select active underwriting target
    window.selectPipelineItem = function(key) {
        selectedPipelineKey = key;
        renderLenderPipeline();

        const node = anonymizedPipelines[key];
        if (!node) return;

        // Update Labels & Descriptions
        document.getElementById('auctionTargetLabel').textContent = `BORROWER NODE // ${node.industry.toUpperCase()}`;
        document.getElementById('auctionTargetTitle').textContent = node.alias;
        document.getElementById('auctionCountdownText').textContent = `${node.timeLeft} remaining`;
        document.getElementById('auctionUnderwritingSummary').textContent = node.underwritingSummary;

        // Auto Prefill with competitive parameters slightly beating highest bid
        const suggestedLimit = node.highestBid.amount + 100000;
        const suggestedRate = Math.max(5.5, node.highestBid.rate - 0.2).toFixed(1);
        const suggestedWarrants = node.highestBid.warrants;
        const suggestedFee = node.highestBid.fee;

        document.getElementById('bidLimit').value = suggestedLimit;
        document.getElementById('bidRate').value = suggestedRate;
        document.getElementById('bidWarrants').value = suggestedWarrants;
        document.getElementById('bidFee').value = suggestedFee;

        document.getElementById('highBidStatusMessage').textContent = `Highest current bid: $${(node.highestBid.amount/1000000).toFixed(2)}M @ ${node.highestBid.rate}%`;

        recalculateBiddingMetrics();
    };

    // Dynamic yield calculations for underwriting bid
    window.recalculateBiddingMetrics = function() {
        const limitVal = parseFloat(document.getElementById('bidLimit').value) || 0;
        const rateVal = parseFloat(document.getElementById('bidRate').value) || 0;
        const warrantsVal = parseFloat(document.getElementById('bidWarrants').value) || 0;
        const feeVal = parseFloat(document.getElementById('bidFee').value) || 0;

        // Financial Yield Simulator Math formulas
        const amortBaseFactor = 1.05; // standard cost multiplier model
        const yieldValue = rateVal + (feeVal / 3) + (warrantsVal * 1.5);
        const projectedInterest = Math.round((limitVal * (rateVal/100)));
        const dynamicLtvValue = (limitVal / 4800000).toFixed(2); // relative factor

        // Inject live computations
        document.getElementById('metricYield').textContent = `${yieldValue.toFixed(2)}%`;
        document.getElementById('metricLtvLever').textContent = `${dynamicLtvValue}x Leverage`;
        document.getElementById('metricCollateral').textContent = `${(1.9 - dynamicLtvValue).toFixed(2)}x Coverage`;
        document.getElementById('metricTotInterest').textContent = `$${projectedInterest.toLocaleString()} / yr`;
    };

    // Submitting Bids directly into live session ledger
    window.submitLenderBid = function() {
        const limitVal = parseFloat(document.getElementById('bidLimit').value) || 0;
        const rateVal = parseFloat(document.getElementById('bidRate').value) || 0;
        const warrantsVal = parseFloat(document.getElementById('bidWarrants').value) || 0;
        const feeVal = parseFloat(document.getElementById('bidFee').value) || 0;

        const node = anonymizedPipelines[selectedPipelineKey];
        if (!node) return;

        // Check if competitive requirements are realistically matched
        if (limitVal <= 0 || rateVal <= 0) {
            alert("Error: Please provide valid non-zero pricing specifications.");
            return;
        }

        // Generate unique crypt-hash metadata representation
        const hToken = Math.random().toString(36).substr(2, 6).toUpperCase();
        const timeNow = new Date().toLocaleTimeString();

        // Increment dynamic internal counts
        node.bidsCount++;
        node.highestBid = { amount: limitVal, rate: rateVal, warrants: warrantsVal, fee: feeVal };

        // Post into ledger historical view
        const bidOutputStr = `$${(limitVal/1000000).toFixed(2)}M @ ${rateVal}% APR (FEE: ${feeVal}%)`;
        bidsHistory.unshift({
            time: timeNow,
            fund: `Your Fund [Hash: #TX-${hToken}]`,
            limit: `$${(limitVal/1000000).toFixed(2)}M`,
            rate: `${rateVal}%`,
            warrants: warrantsVal > 0 ? `${warrantsVal.toFixed(2)}%` : "None"
        });

        // Trigger visual success feedbacks
        renderLenderPipeline();
        renderLedger();
        
        // Highlight top element row cleanly
        const firstRow = document.querySelector('.ledger-row');
        if (firstRow) {
            firstRow.classList.add('success-flash');
        }

        document.getElementById('highBidStatusMessage').textContent = `Your offer of ${bidOutputStr} leads the auction.`;
        alert(`Bespoke Term Sheet Transmitted!\n\nPayload Verified securely and recorded with transaction checksum TX-${hToken}.\nYour yield parameters have been adjusted live within the matched syndicate module.`);
    };

    // Generate output ledger feed
    function renderLedger() {
        const ledgerLogsContainer = document.getElementById('ledgerLogsContainer');
        if (!ledgerLogsContainer) return;

        ledgerLogsContainer.innerHTML = '';
        bidsHistory.forEach(item => {
            ledgerLogsContainer.innerHTML += `
                <div class="ledger-row">
                    <span class="ledger-time">[${item.time}]</span>
                    <span class="ledger-msg">${item.fund} proposed bid</span>
                    <span class="ledger-val">${item.limit} • ${item.rate} APR • ${item.warrants} Warrants</span>
                </div>
            `;
        });
    }

    // Simulated competitive bidding bot activity intervals
    let auctionBotInterval;

    function startAuctionSimulations() {
        if (auctionBotInterval) clearInterval(auctionBotInterval);

        // Simulate incoming competing funds term sheet submissions every 14 seconds
        auctionBotInterval = setInterval(() => {
            const pipelineKeys = Object.keys(anonymizedPipelines);
            const randomKey = pipelineKeys[Math.floor(Math.random() * pipelineKeys.length)];
            const targetNode = anonymizedPipelines[randomKey];
            const randomFund = simulatedCompetitors[Math.floor(Math.random() * simulatedCompetitors.length)];

            if (targetNode) {
                // Adjust a slightly better random counteroffer
                const incrementAmount = Math.floor(Math.random() * 3 + 1) * 50000;
                const newBidLimit = targetNode.highestBid.amount + incrementAmount;
                const newRate = parseFloat((targetNode.highestBid.rate - (Math.random() * 0.2)).toFixed(1));
                const timeNow = new Date().toLocaleTimeString();

                targetNode.highestBid.amount = newBidLimit;
                targetNode.highestBid.rate = newRate;
                targetNode.bidsCount++;

                // Append into master history stack
                bidsHistory.unshift({
                    time: timeNow,
                    fund: randomFund,
                    limit: `$${(newBidLimit/1000000).toFixed(2)}M`,
                    rate: `${newRate.toFixed(1)}%`,
                    warrants: targetNode.highestBid.warrants > 0 ? `${targetNode.highestBid.warrants.toFixed(2)}%` : "None"
                });

                // Shrink stack size to keep memory sleek
                if (bidsHistory.length > 30) bidsHistory.pop();

                // Re-render views seamlessly to show pulsing activity elements
                renderLenderPipeline();
                renderLedger();

                // If currently actively viewing, update inputs silently
                if (selectedPipelineKey === randomKey) {
                    document.getElementById('highBidStatusMessage').textContent = `Highest current bid: $${(newBidLimit/1000000).toFixed(2)}M @ ${newRate}%`;
                }
            }
        }, 14000);
    }

    function stopAuctionSimulations() {
        if (auctionBotInterval) {
            clearInterval(auctionBotInterval);
        }
    }

    // Dynamic timer updates
    setInterval(() => {
        if (!document.body.classList.contains('lender-mode')) return;
        
        Object.values(anonymizedPipelines).forEach(node => {
            // Parse countdown segments
            const parts = node.timeLeft.split(' ');
            let h = parseInt(parts[0]);
            let m = parseInt(parts[1]);
            let s = parseInt(parts[2]);

            s--;
            if (s < 0) {
                s = 59;
                m--;
                if (m < 0) {
                    m = 59;
                    h--;
                    if (h < 0) {
                        h = 23; // resets dummy timeline
                    }
                }
            }

            const pad = num => String(num).padStart(2, '0');
            node.timeLeft = `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
        });

        // Update display text dynamically
        const countdownEl = document.getElementById('auctionCountdownText');
        const activeNode = anonymizedPipelines[selectedPipelineKey];
        if (countdownEl && activeNode) {
            countdownEl.textContent = `${activeNode.timeLeft} remaining`;
        }
    }, 1000);

})();