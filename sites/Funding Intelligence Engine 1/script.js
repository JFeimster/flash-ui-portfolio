// Embedded memory-based borrower archetypes datasets mimicking borrower_archetypes.json
    const borrowerArchetypes = {
        saas: {
            score: 825,
            rating: "Super Prime Tier",
            category: "Excellent",
            dimensions: { liquidity: 92, leverage: 45, growth: 96, collateral: 20, cashFlow: 88 },
            recommendedPath: "SaaS Recurring Revenue Bridge",
            optAmount: "$3,500,000",
            targetApr: "8.2% - 10.0%",
            maturity: "36 Months",
            assessment: "The SaaS recurring business model exhibits low systemic volatility with superior gross margins. Capital allocation is optimized for immediate deployment into sales acquisition channels with minimum asset-backed collateralization requirements.",
            riskFlags: ["No tangible physical assets available for lien", "Underlying model relies on non-provable contract longevity"]
        },
        ecom: {
            score: 715,
            rating: "Prime Tier",
            category: "Good",
            dimensions: { liquidity: 78, leverage: 62, growth: 89, collateral: 55, cashFlow: 70 },
            recommendedPath: "E-Commerce Stock & Ads",
            optAmount: "$1,200,000",
            targetApr: "9.1% - 11.5%",
            maturity: "18 Months",
            assessment: "Seasonal inventories introduce cash flow variance. Dynamic allocation engines recommend receivables financing over longer structural debt profiles. Scale operations into high product turnover cycles.",
            riskFlags: ["Seasonal sales cycles compromise stable cash coverage ratios", "Supply chain concentration risk in non-domestic vectors"]
        },
        industrial: {
            score: 690,
            rating: "Standard Tier",
            category: "Fair",
            dimensions: { liquidity: 45, leverage: 80, growth: 38, collateral: 95, cashFlow: 65 },
            recommendedPath: "Equipment Financing Lease",
            optAmount: "$8,500,000",
            targetApr: "6.2% - 7.8%",
            maturity: "60 Months",
            assessment: "Low growth vector backed by massive fixed assets. Underwriting indicates highly favorable term structures when physical assets are secured under formal UCC-1 filings.",
            riskFlags: ["Highly leveraged debt portfolio limits additional cash revolvers", "Growth velocity below key industry benchmarks"]
        },
        realestate: {
            score: 790,
            rating: "Prime Tier",
            category: "Excellent",
            dimensions: { liquidity: 60, leverage: 72, growth: 50, collateral: 98, cashFlow: 82 },
            recommendedPath: "Commercial Property Debt",
            optAmount: "$18,000,000",
            targetApr: "5.5% - 7.0%",
            maturity: "120 Months",
            assessment: "Optimal collateralization mitigates cash flow variability. Recommend locking fixed rates to hedge against macroeconomic capital yield volatility.",
            riskFlags: ["Real estate values vulnerable to commercial district adjustments", "Longer capital amortizations reduce immediate liquidity levels"]
        },
        acquisition: {
            score: 755,
            rating: "Prime Tier",
            category: "Good",
            dimensions: { liquidity: 70, leverage: 65, growth: 72, collateral: 48, cashFlow: 80 },
            recommendedPath: "Acquisition & M&A Leveraged",
            optAmount: "$6,500,000",
            targetApr: "7.8% - 9.5%",
            maturity: "48 Months",
            assessment: "Strong acquisition target cash flows support leverage debt. Structural allocation models warrant institutional credit parameters and operational escrow protections.",
            riskFlags: ["Integration of target entity introduces transitional risk", "Higher leverage required post-transaction execution"]
        }
    };

    // User interactive weight states mimicking recommendation_weights.json
    let currentWeights = {
        liquidity: 1.0,
        growth: 1.0,
        collateral: 1.0
    };

    let activeArchetype = "saas";
    let isWhiteLabelActive = false;

    // Load data structures dynamically and update presentation layer
    function loadArchetype(key) {
        activeArchetype = key;
        const profile = borrowerArchetypes[key];
        
        // Log to simulated trace debugger
        logTrace(`Switching baseline profile parameters: ${key.toUpperCase()}`);
        logTrace(`Profile score recalculation starting...`);

        runDynamicCalculations();
    }

    // Weight Adjustment Handler
    function adjustEngineWeight(dimension, val) {
        currentWeights[dimension] = parseFloat(val);
        document.getElementById(`w${dimension.charAt(0).toUpperCase() + dimension.slice(1)}Val`).innerText = val;
        
        logTrace(`Updating logic parameters: dynamic weight '${dimension}' modified to ${val}`);
        runDynamicCalculations();
    }

    // Interactive Math Calculation Engine Simulation
    function runDynamicCalculations() {
        const base = borrowerArchetypes[activeArchetype];
        
        // Compute dynamically modified score based on interactive weights
        let totalWeight = currentWeights.liquidity + currentWeights.growth + currentWeights.collateral;
        let weightedVariance = 
            ((base.dimensions.liquidity * currentWeights.liquidity) +
            (base.dimensions.growth * currentWeights.growth) +
            (base.dimensions.collateral * currentWeights.collateral)) / totalWeight;
        
        // Dynamic simulated scorecard adjustments
        let finalScore = Math.round((base.score * 0.7) + (weightedVariance * 3));
        if (finalScore > 1000) finalScore = 1000;
        if (finalScore < 300) finalScore = 300;

        // Dynamic match scores computed for the 6 vertical categories based on baseline and weight biases
        const wcMatch = Math.min(100, Math.round(base.dimensions.liquidity * 0.6 + base.dimensions.cashFlow * 0.4 + (currentWeights.liquidity - 1.0) * 10));
        const ecomMatch = Math.min(100, Math.round(base.dimensions.growth * 0.5 + base.dimensions.liquidity * 0.5 + (currentWeights.growth - 1.0) * 12));
        const startupMatch = Math.min(100, Math.round(base.dimensions.growth * 0.8 + base.dimensions.liquidity * 0.2 + (currentWeights.growth - 1.0) * 15 - (currentWeights.collateral - 1.0) * 10));
        const equipMatch = Math.min(100, Math.round(base.dimensions.collateral * 0.9 + (currentWeights.collateral - 1.0) * 15));
        const reMatch = Math.min(100, Math.round(base.dimensions.collateral * 0.85 + base.dimensions.cashFlow * 0.15 + (currentWeights.collateral - 1.0) * 10));
        const acqMatch = Math.min(100, Math.round(base.dimensions.cashFlow * 0.6 + base.dimensions.leverage * 0.4 + (currentWeights.liquidity - 1.0) * 8));

        // UI Updates - Core Scorecard Dial
        document.getElementById("scoreValueText").innerText = finalScore;
        
        // Compute dashoffset for SVG Circle meter (perimeter is ~565)
        const offset = 565 - (565 * (finalScore / 1000));
        document.getElementById("meterFillCircle").style.strokeDashoffset = offset;

        // Determine Category Label based on new dynamic calculations
        let dynamicCategory = "Standard";
        let badgeClass = "badge-status";
        if (finalScore >= 800) {
            dynamicCategory = "Super Prime";
            badgeClass = "badge-status badge-status-prime";
        } else if (finalScore >= 700) {
            dynamicCategory = "Prime Tier";
            badgeClass = "badge-status badge-status-prime";
        } else {
            dynamicCategory = "Subprime / Watchlist";
            badgeClass = "badge-status";
            document.getElementById("scoreRatingBadge").style.color = "var(--accent-rose)";
        }
        document.getElementById("scoreCategoryText").innerText = dynamicCategory;
        document.getElementById("scoreRatingBadge").innerText = dynamicCategory;
        document.getElementById("scoreRatingBadge").className = badgeClass;

        // Update dimension metrics visual meters
        updateMetricMeter("liquidity", base.dimensions.liquidity);
        updateMetricMeter("leverage", base.dimensions.leverage);
        updateMetricMeter("growth", base.dimensions.growth);
        updateMetricMeter("collateral", base.dimensions.collateral);
        updateMetricMeter("cashFlow", base.dimensions.cashFlow);

        // Update recommendation text details
        document.getElementById("recommendedPathTitle").innerText = base.recommendedPath;
        document.getElementById("optSizingVal").innerText = base.optAmount;
        document.getElementById("targetAprVal").innerText = base.targetApr;
        document.getElementById("maturityVal").innerText = base.maturity;
        document.getElementById("assessmentNotesText").innerText = base.assessment;

        // Set dynamic match indicator badges in real-time
        setMatchPill("wc", wcMatch);
        setMatchPill("ecom", ecomMatch);
        setMatchPill("startup", startupMatch);
        setMatchPill("equip", equipMatch);
        setMatchPill("re", reMatch);
        setMatchPill("acq", acqMatch);

        // Update compliance risk flags list dynamically
        const riskListElement = document.getElementById("riskFlagsList");
        riskListElement.innerHTML = "";
        if (base.riskFlags && base.riskFlags.length > 0) {
            base.riskFlags.forEach(flag => {
                const flagElement = document.createElement("div");
                flagElement.className = "risk-flag-pill";
                flagElement.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="stroke: var(--accent-rose);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    ${flag}
                `;
                riskListElement.appendChild(flagElement);
            });
        } else {
            riskListElement.innerHTML = `
                <div class="risk-flag-pill safe">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="stroke: var(--accent-emerald);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Baseline Audit Verified Secure
                </div>
            `;
        }

        logTrace(`Dynamic Engine recalculation complete. Output Score: ${finalScore}. Best match target: ${base.recommendedPath}.`);
    }

    function updateMetricMeter(id, value) {
        document.getElementById(`${id}Val`).innerText = `${value}/100`;
        document.getElementById(`${id}Bar`).style.width = `${value}%`;
    }

    function setMatchPill(prefix, matchVal) {
        const pill = document.getElementById(`${prefix}-match-pill`);
        pill.innerText = `${matchVal}% Match`;
        
        pill.className = "route-match-badge";
        if (matchVal >= 80) {
            pill.classList.add("match-high");
        } else if (matchVal >= 50) {
            pill.classList.add("match-medium");
        } else {
            pill.classList.add("match-low");
        }
    }

    // Interactive trace log functions
    function logTrace(message) {
        const term = document.getElementById("telemetryTerminal");
        const timestamp = new Date().toLocaleTimeString();
        
        const line = document.createElement("div");
        line.className = "terminal-line";
        
        let customStylingClass = "";
        if (message.includes("complete")) {
            customStylingClass = "success";
        } else if (message.includes("recalculation") || message.includes("modified")) {
            customStylingClass = "accent";
        }

        line.innerHTML = `
            <span class="stamp">[${timestamp}]</span>
            <span class="${customStylingClass}">${message}</span>
        `;
        term.appendChild(line);
        term.scrollTop = term.scrollHeight;
    }

    // Toggle Between Full Operator View and White-Labeled Client Presentation
    function toggleWhiteLabelView() {
        isWhiteLabelActive = !isWhiteLabelActive;
        const bodyEl = document.body;
        const analystEl = document.getElementById("analystPanel");
        const toggleText = document.getElementById("toggleText");

        if (isWhiteLabelActive) {
            bodyEl.classList.add("white-label-mode");
            analystEl.style.display = "none";
            toggleText.innerText = "Switch to Operator Terminal";
            logTrace("Enabling White-Label presentation environment...");
        } else {
            bodyEl.classList.remove("white-label-mode");
            analystEl.style.display = "block";
            toggleText.innerText = "Switch to White-Label View";
            logTrace("Restoring complete multi-dimensional operator view...");
        }
    }

    function shareWhiteLabelLink() {
        alert("Sharable customer link generated!\nAll debug widgets and operational metrics weight controllers have been filtered out dynamically.");
    }

    // Specification Tab Navigation switches
    function switchSpecTab(tabId, el) {
        // Toggle tab highlights
        const buttons = el.parentNode.querySelectorAll(".tab-btn");
        buttons.forEach(btn => btn.classList.remove("active"));
        el.classList.add("active");

        // Toggle content containers
        const parent = el.parentNode.parentNode;
        const contentPanes = parent.querySelectorAll(".tab-content");
        contentPanes.forEach(pane => pane.classList.remove("active"));
        document.getElementById(tabId).classList.add("active");
    }

    // Initialize application on page load
    window.onload = function() {
        runDynamicCalculations();
    }