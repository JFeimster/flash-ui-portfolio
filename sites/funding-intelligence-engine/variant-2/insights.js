(function () {
    // 1. Inject Visual Styles to support Macro Analytics layout
    const styleElement = document.createElement("style");
    styleElement.textContent = `
        .col-insights-header {
            grid-column: span 12;
            margin-top: 24px;
            border-bottom: 1px solid var(--border-subtle);
            padding-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .insights-header-meta {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .col-insights-left {
            grid-column: span 7;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .col-insights-right {
            grid-column: span 5;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .timeframe-pill-container {
            display: flex;
            background: var(--bg-surface-elevated);
            padding: 3px;
            border-radius: 20px;
            border: 1px solid var(--border-muted);
            gap: 4px;
        }
        .timeframe-pill {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-family: var(--font-sans);
            font-size: 11px;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 16px;
            cursor: pointer;
            transition: var(--transition-smooth);
        }
        .timeframe-pill.active {
            background: var(--accent-purple);
            color: #fff;
        }
        .analytics-meta-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 16px;
        }
        .analytics-stat-card {
            background: var(--bg-surface-elevated);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: 14px;
            transition: var(--transition-smooth);
        }
        .analytics-stat-card:hover {
            border-color: var(--border-active);
        }
        .analytics-stat-val {
            font-family: var(--font-mono);
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
            margin-top: 4px;
        }
        .analytics-stat-change {
            font-size: 10px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-top: 4px;
        }
        .change-up { color: var(--accent-emerald); }
        .change-down { color: var(--accent-rose); }

        /* SVG Chart Interactivity */
        .chart-tooltip {
            position: absolute;
            background: rgba(10, 8, 19, 0.95);
            border: 1px solid var(--border-active);
            color: var(--text-primary);
            font-family: var(--font-mono);
            font-size: 10px;
            padding: 6px 10px;
            border-radius: 6px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.15s ease;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        body.white-label-mode .chart-tooltip {
            background: rgba(255, 255, 255, 0.98);
            color: #000;
            border: 1px solid var(--border-muted);
        }
        .chart-svg-interactive {
            overflow: visible;
            cursor: crosshair;
        }
        .chart-point {
            transition: r 0.2s ease, fill 0.2s ease;
        }
        .chart-point:hover {
            r: 6px;
            fill: var(--text-primary);
        }
        .vertical-row-bars {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }
        .vertical-bar-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .vertical-bar-header {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            font-weight: 600;
        }
        .vertical-bar-track {
            height: 8px;
            background: var(--border-muted);
            border-radius: 4px;
            display: flex;
            overflow: hidden;
        }
        .vertical-bar-fill-allocated {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-purple), #ec4899);
            border-radius: 4px 0 0 4px;
            transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .vertical-bar-fill-deployed {
            height: 100%;
            background: var(--accent-emerald);
            opacity: 0.85;
            border-radius: 0 4px 4px 0;
            transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .chart-legend {
            display: flex;
            gap: 16px;
            margin-top: 12px;
            font-size: 11px;
        }
        .legend-indicator {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .legend-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        
        @media (max-width: 1024px) {
            .col-insights-left, .col-insights-right {
                grid-column: span 12;
            }
        }
    `;
    document.head.appendChild(styleElement);

    // 2. High-fidelity Historical Portfolio & Dynamic Rates Datastore
    const insightsData = {
        timeframes: {
            "30D": {
                aggregateLiquidity: "$142.8M",
                avgSuccessRate: "93.4%",
                defaultRate: "0.12%",
                averageSpread: "+2.45%",
                volumeTrend: "+8.2%",
                successTrend: "+0.4%",
                defaultTrend: "-0.02%",
                spreads: [5.2, 5.4, 5.8, 6.1, 6.5, 6.9, 7.4],
                verticals: {
                    wc: { allocated: 38, deployed: 32, success: 96 },
                    ecom: { allocated: 25, deployed: 18, success: 89 },
                    startup: { allocated: 45, deployed: 38, success: 82 },
                    equip: { allocated: 30, deployed: 27, success: 95 },
                    re: { allocated: 60, deployed: 48, success: 91 },
                    acq: { allocated: 50, deployed: 41, success: 88 }
                }
            },
            "180D": {
                aggregateLiquidity: "$824.5M",
                avgSuccessRate: "91.8%",
                defaultRate: "0.19%",
                averageSpread: "+2.68%",
                volumeTrend: "+18.4%",
                successTrend: "+1.2%",
                defaultTrend: "+0.01%",
                spreads: [5.1, 5.3, 5.7, 6.3, 6.7, 7.2, 7.8],
                verticals: {
                    wc: { allocated: 220, deployed: 198, success: 94 },
                    ecom: { allocated: 150, deployed: 135, success: 91 },
                    startup: { allocated: 260, deployed: 210, success: 85 },
                    equip: { allocated: 180, deployed: 162, success: 93 },
                    re: { allocated: 340, deployed: 310, success: 89 },
                    acq: { allocated: 290, deployed: 250, success: 87 }
                }
            },
            "YTD": {
                aggregateLiquidity: "$1.48B",
                avgSuccessRate: "92.1%",
                defaultRate: "0.16%",
                averageSpread: "+2.55%",
                volumeTrend: "+34.1%",
                successTrend: "+1.9%",
                defaultTrend: "-0.05%",
                spreads: [5.0, 5.2, 5.6, 6.2, 6.6, 7.1, 7.6],
                verticals: {
                    wc: { allocated: 390, deployed: 355, success: 95 },
                    ecom: { allocated: 280, deployed: 240, success: 90 },
                    startup: { allocated: 410, deployed: 350, success: 86 },
                    equip: { allocated: 290, deployed: 265, success: 94 },
                    re: { allocated: 580, deployed: 520, success: 90 },
                    acq: { allocated: 480, deployed: 410, success: 88 }
                }
            }
        },
        terms: ["1M", "3M", "6M", "1Y", "2Y", "3Y", "5Y"]
    };

    let activeTimeframe = "30D";

    // Create Tooltip DOM Element
    const tooltip = document.createElement("div");
    tooltip.className = "chart-tooltip";
    document.body.appendChild(tooltip);

    // 3. Dynamic DOM Generation
    function buildInsightsDashboard() {
        // Find suitable anchor point inside bento-grid
        const bentoGrid = document.querySelector(".bento-grid");
        if (!bentoGrid) return;

        // Ensure we don't double inject
        if (document.getElementById("insights-anchor-header")) return;

        // 3a. Segment Header (Span 12)
        const headerDiv = document.createElement("div");
        headerDiv.id = "insights-anchor-header";
        headerDiv.className = "col-insights-header";
        headerDiv.innerHTML = `
            <div class="card-title-group">
                <div class="insights-header-meta">
                    <div class="card-label" style="margin-bottom:0;">Macro Yield & Liquidity Feed</div>
                    <span class="brand-tag">Safe Harbor Live v1.8</span>
                </div>
                <h3 style="font-size: 18px; font-weight: 600; margin-top: 4px;">Platform Portfolio Analytics</h3>
            </div>
            <div class="timeframe-pill-container">
                <button class="timeframe-pill active" data-tf="30D">Trailing 30D</button>
                <button class="timeframe-pill" data-tf="180D">Trailing 180D</button>
                <button class="timeframe-pill" data-tf="YTD">YTD Performance</button>
            </div>
        `;

        // 3b. Left Panel (Span 7) - Dynamic Volume Indicators & Capital Depth Progress Bars
        const leftCard = document.createElement("div");
        leftCard.className = "bento-card col-insights-left";
        leftCard.innerHTML = `
            <div class="card-header" style="margin-bottom: 12px;">
                <div class="card-title-group">
                    <div class="card-label">Syndicated Depth</div>
                    <div class="card-title">Vertical Capital Allocation Matrix</div>
                </div>
                <span class="preview-badge" style="color: var(--accent-purple);">Dynamic Capacity</span>
            </div>

            <div class="analytics-meta-grid">
                <div class="analytics-stat-card">
                    <div class="v-stat-lbl">Aggregate Liquidity</div>
                    <div class="analytics-stat-val" id="stat-agg-liq">--</div>
                    <div class="analytics-stat-change change-up" id="stat-agg-liq-change">--</div>
                </div>
                <div class="analytics-stat-card">
                    <div class="v-stat-lbl">Platform Success Rate</div>
                    <div class="analytics-stat-val" id="stat-success">--</div>
                    <div class="analytics-stat-change change-up" id="stat-success-change">--</div>
                </div>
                <div class="analytics-stat-card">
                    <div class="v-stat-lbl">Portfolio Default Yield</div>
                    <div class="analytics-stat-val" id="stat-default">--</div>
                    <div class="analytics-stat-change change-down" id="stat-default-change">--</div>
                </div>
            </div>

            <div class="vertical-row-bars" id="verticalBarsContainer">
                <!-- Programmatically generated bars represent Allocated vs Deployed Capital -->
            </div>

            <div class="chart-legend">
                <div class="legend-indicator">
                    <div class="legend-dot" style="background: linear-gradient(90deg, var(--accent-purple), #ec4899);"></div>
                    <span style="font-size:10px; color:var(--text-secondary);">Allocated Target ($M)</span>
                </div>
                <div class="legend-indicator">
                    <div class="legend-dot" style="background: var(--accent-emerald);"></div>
                    <span style="font-size:10px; color:var(--text-secondary);">Active Deployed Liquidity ($M)</span>
                </div>
            </div>
        `;

        // 3c. Right Panel (Span 5) - Real-time Interest Rate Yield Curve Spreads
        const rightCard = document.createElement("div");
        rightCard.className = "bento-card col-insights-right";
        rightCard.innerHTML = `
            <div class="card-header" style="margin-bottom: 12px;">
                <div class="card-title-group">
                    <div class="card-label">SOFR + Spread Curve</div>
                    <div class="card-title">Indicative Cost Yield Curve</div>
                </div>
                <span class="preview-badge" style="color: var(--accent-amber);" id="spreadAvgBadge">--</span>
            </div>
            
            <p class="vertical-desc" style="margin-top: -8px; margin-bottom: 16px;">
                Secured Benchmark Index representation tracking real-time SOFR index rate variance and pricing optimization ranges.
            </p>

            <div id="yieldCurveContainer" style="position:relative; width:100%; height:180px;">
                <!-- Real-time SVG Graph generated -->
            </div>

            <div style="display:flex; justify-content:space-between; margin-top:12px; border-top:1px solid var(--border-subtle); padding-top:12px;">
                <div class="v-stat">
                    <span class="v-stat-lbl" style="font-size:9px;">Pricing Baseline</span>
                    <span class="v-stat-val" style="font-size:12px; color:var(--accent-purple);">SOFR Reference</span>
                </div>
                <div class="v-stat" style="text-align: right;">
                    <span class="v-stat-lbl" style="font-size:9px;">Last Updated</span>
                    <span class="v-stat-val" id="curveTickTimer" style="font-size:11px; font-family:var(--font-mono); color:var(--text-secondary);">Real-time</span>
                </div>
            </div>
        `;

        // Insertion Logic: Insert directly above the "Vertical Funding Modules" Header
        const targetSection = document.querySelector(".verticals-header");
        if (targetSection) {
            bentoGrid.insertBefore(headerDiv, targetSection);
            bentoGrid.insertBefore(leftCard, targetSection);
            bentoGrid.insertBefore(rightCard, targetSection);
        }

        // Add Click Listeners on Timeframe Toggles
        headerDiv.querySelectorAll(".timeframe-pill").forEach(pill => {
            pill.addEventListener("click", (e) => {
                headerDiv.querySelectorAll(".timeframe-pill").forEach(p => p.classList.remove("active"));
                e.target.classList.add("active");
                activeTimeframe = e.target.getAttribute("data-tf");
                updateInsightsUI();
            });
        });
    }

    // 4. Interface Synchronizer
    function updateInsightsUI() {
        const tfData = insightsData.timeframes[activeTimeframe];
        if (!tfData) return;

        // Set Text values
        document.getElementById("stat-agg-liq").textContent = tfData.aggregateLiquidity;
        document.getElementById("stat-agg-liq-change").innerHTML = `▲ ${tfData.volumeTrend}`;
        
        document.getElementById("stat-success").textContent = tfData.avgSuccessRate;
        document.getElementById("stat-success-change").innerHTML = `▲ ${tfData.successTrend}`;

        document.getElementById("stat-default").textContent = tfData.defaultRate;
        document.getElementById("stat-default-change").innerHTML = `▼ ${tfData.defaultTrend}`;

        document.getElementById("spreadAvgBadge").textContent = `Mean Cost: ${tfData.averageSpread}`;

        // Render Vertical bars dynamically
        const barsContainer = document.getElementById("verticalBarsContainer");
        if (barsContainer) {
            barsContainer.innerHTML = "";
            const vNames = {
                wc: "Working Capital",
                ecom: "E-commerce Revenue",
                startup: "Startup / Venture Debt",
                equip: "Asset-Backed Equipment",
                re: "Commercial Real Estate",
                acq: "Acquisition Financing"
            };

            for (const [key, val] of Object.entries(tfData.verticals)) {
                // Calculate percentage ratios
                const maxAllocated = Math.max(...Object.values(tfData.verticals).map(v => v.allocated));
                const allocatedWidth = (val.allocated / maxAllocated) * 60; // scale bars to leave space
                const deployedWidth = (val.deployed / val.allocated) * 100;

                barsContainer.innerHTML += `
                    <div class="vertical-bar-item">
                        <div class="vertical-bar-header">
                            <span style="color: var(--text-primary);">${vNames[key]}</span>
                            <span style="font-family: var(--font-mono); color: var(--text-secondary);">
                                Allocated: $${val.allocated}M <span style="color:var(--accent-emerald);">[${val.success}% Match]</span>
                            </span>
                        </div>
                        <div class="vertical-bar-track">
                            <div class="vertical-bar-fill-allocated" style="width: ${allocatedWidth}%;">
                                <div class="vertical-bar-fill-deployed" style="width: ${deployedWidth}%;"></div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // Draw Interactive Pricing Curve Graph
        drawPricingYieldCurve();
    }

    // 5. SVG Yield Curve Drawing & Interactivity Engine
    function drawPricingYieldCurve() {
        const container = document.getElementById("yieldCurveContainer");
        if (!container) return;

        const tfData = insightsData.timeframes[activeTimeframe];
        const width = container.clientWidth || 320;
        const height = 180;
        const padding = { top: 20, right: 20, bottom: 30, left: 35 };

        // Scale functions
        const terms = insightsData.terms;
        const minRate = 4.0;
        const maxRate = 9.0;

        const getX = (index) => padding.left + (index / (terms.length - 1)) * (width - padding.left - padding.right);
        const getY = (rate) => padding.top + ((maxRate - rate) / (maxRate - minRate)) * (height - padding.top - padding.bottom);

        // Map data points
        const points = tfData.spreads.map((rate, index) => {
            return { x: getX(index), y: getY(rate), term: terms[index], rate: rate };
        });

        // Construct SVG String programmatically
        let svgLines = "";
        let pathD = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            pathD += ` L ${points[i].x} ${points[i].y}`;
        }

        // Subtly filled area under pricing curve
        let areaD = `${pathD} L ${points[points.length-1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

        // Horizontal Gridlines and left axis ticks
        for (let rate = minRate; rate <= maxRate; rate += 1.0) {
            const yPos = getY(rate);
            svgLines += `
                <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="var(--border-subtle)" stroke-width="1" />
                <text x="${padding.left - 8}" y="${yPos + 4}" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="9" text-anchor="end">${rate.toFixed(1)}%</text>
            `;
        }

        // X Axis Term Labels
        points.forEach(pt => {
            svgLines += `
                <text x="${pt.x}" y="${height - padding.bottom + 16}" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">${pt.term}</text>
            `;
        });

        // Dynamic points
        let pointElements = "";
        points.forEach((pt, index) => {
            pointElements += `
                <circle class="chart-point" cx="${pt.x}" cy="${pt.y}" r="4" fill="var(--accent-purple)" stroke="var(--bg-surface)" stroke-width="1.5" data-index="${index}" />
            `;
        });

        container.innerHTML = `
            <svg class="chart-svg-interactive" width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="var(--accent-purple)" stop-opacity="0.25" />
                        <stop offset="100%" stop-color="var(--accent-purple)" stop-opacity="0.0" />
                    </linearGradient>
                </defs>
                ${svgLines}
                <path d="${areaD}" fill="url(#areaGradient)" />
                <path d="${pathD}" fill="none" stroke="var(--accent-purple)" stroke-width="2.5" stroke-linecap="round" />
                ${pointElements}
            </svg>
        `;

        // Add interactive tracking features on coordinates
        const svgElement = container.querySelector(".chart-svg-interactive");
        svgElement.addEventListener("mousemove", (e) => {
            const rect = svgElement.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            
            // Find closest index point
            let closestPt = points[0];
            let minDist = Math.abs(mouseX - points[0].x);

            points.forEach(pt => {
                const dist = Math.abs(mouseX - pt.x);
                if (dist < minDist) {
                    minDist = dist;
                    closestPt = pt;
                }
            });

            // Update Tooltip Position & Data
            tooltip.style.opacity = "1";
            tooltip.style.left = `${e.pageX + 12}px`;
            tooltip.style.top = `${e.pageY - 28}px`;
            tooltip.innerHTML = `Term: <strong>${closestPt.term}</strong><br/>Rate: <span style="color:var(--accent-purple); font-weight:700;">${closestPt.rate.toFixed(2)}%</span>`;
            
            // Visually highlight dot
            svgElement.querySelectorAll("circle").forEach(circle => {
                if (parseFloat(circle.getAttribute("cx")) === closestPt.x) {
                    circle.setAttribute("r", "6");
                    circle.setAttribute("fill", "var(--text-primary)");
                } else {
                    circle.setAttribute("r", "4");
                    circle.setAttribute("fill", "var(--accent-purple)");
                }
            });
        });

        svgElement.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0";
            svgElement.querySelectorAll("circle").forEach(circle => {
                circle.setAttribute("r", "4");
                circle.setAttribute("fill", "var(--accent-purple)");
            });
        });
    }

    // 6. Live Simulation Micro-Ticks to mimic premium live pricing feeds
    let tickCounter = 0;
    function startYieldCurveSimulation() {
        setInterval(() => {
            const tfData = insightsData.timeframes[activeTimeframe];
            if (tfData) {
                // Randomly fluctuate spreads inside standard volatility models
                tfData.spreads = tfData.spreads.map(rate => {
                    const fluctuation = (Math.random() - 0.5) * 0.08;
                    const result = rate + fluctuation;
                    // Cap rates
                    return Math.max(4.0, Math.min(10.0, result));
                });

                tickCounter++;
                const timerLabel = document.getElementById("curveTickTimer");
                if (timerLabel) {
                    timerLabel.textContent = `Live Tick #${tickCounter} (Secured)`;
                }

                drawPricingYieldCurve();
            }
        }, 5000); // Shift pricing matrix slightly every 5s
    }

    // 7. Initializer hook on runtime
    function initialize() {
        buildInsightsDashboard();
        updateInsightsUI();
        startYieldCurveSimulation();
    }

    // Verify DOM Readiness and Load
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();
