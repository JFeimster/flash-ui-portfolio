/**
 * THE TERMINAL DASHBOARD: FEED & OUTREACH MODULE
 * Personal buyer's command center logic.
 */

(function() {
    // --- Dashboard State ---
    const MOCK_OUTREACH = [
        { id: 101, deal: "HVAC Operator (Austin)", status: "NDA SIGNED", lastContact: "2023-10-24", broker: "BayState M&A" },
        { id: 102, deal: "Shopify SaaS Tool", status: "DUE DILIGENCE", lastContact: "2023-10-25", broker: "Quiet Light" },
        { id: 103, deal: "Laundromat Portfolio", status: "CONTACTED", lastContact: "2023-10-22", broker: "First Choice" },
        { id: 104, deal: "FedEx Route (Atlanta)", status: "LOI SENT", lastContact: "2023-10-26", broker: "Route Consultant" }
    ];

    const FEED_ALERTS = [
        "[14:02] PRICE DROP: Asset #209 (Digital Agency) -15%",
        "[13:45] NEW LISTING: Multi-Unit HVAC (Phoenix) $2.1M",
        "[13:12] ALERT: High Volume Activity on 'SaaS Content Tool'",
        "[12:50] SYSTEM: 4 New SBA-eligible deals detected",
        "[12:30] PRICE DROP: Laundromat Portfolio (Chicago) -> $795k",
        "[11:15] NEW LISTING: Managed IT Services (Remote) $4.5M",
        "[10:05] ALERT: Broker 'Quiet Light' added 3 listings"
    ];

    // --- Styles ---
    const dashboardStyles = `
        #terminal-ticker-container {
            width: 100%;
            background: var(--graphite);
            border-bottom: 1px solid var(--acid-green);
            overflow: hidden;
            white-space: nowrap;
            padding: 8px 0;
            position: sticky;
            top: 72px;
            z-index: 95;
        }

        .ticker-wrap {
            display: inline-block;
            animation: ticker-scroll 40s linear infinite;
        }

        .ticker-item {
            display: inline-block;
            padding: 0 2rem;
            color: var(--acid-green);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            letter-spacing: 0.05em;
        }

        @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        .dashboard-overlay {
            position: fixed;
            inset: 0;
            background: var(--obsidian);
            z-index: 200;
            display: none;
            padding: 2rem;
            overflow-y: auto;
        }

        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--bone);
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }

        .density-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }

        .data-panel {
            border: 1px solid var(--graphite);
            background: rgba(20, 20, 20, 0.5);
            padding: 1.5rem;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
        }

        .data-table th {
            text-align: left;
            padding: 12px;
            color: var(--copper);
            border-bottom: 1px solid var(--graphite);
            text-transform: uppercase;
        }

        .data-table td {
            padding: 12px;
            border-bottom: 1px solid var(--graphite);
        }

        .status-pill {
            padding: 2px 6px;
            font-size: 0.65rem;
            font-weight: 700;
            background: var(--graphite);
        }

        .status-nda { color: var(--acid-green); border: 1px solid var(--acid-green); }
        .status-dd { color: #00E5FF; border: 1px solid #00E5FF; }
        .status-loi { color: var(--blood-orange); border: 1px solid var(--blood-orange); }

        .price-drop-card {
            display: flex;
            justify-content: space-between;
            padding: 1rem;
            border-left: 3px solid var(--blood-orange);
            background: var(--graphite);
            margin-bottom: 0.5rem;
        }

        .dash-toggle {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--acid-green);
            color: var(--obsidian);
            padding: 1rem;
            font-weight: 900;
            font-family: 'JetBrains Mono';
            border: none;
            z-index: 300;
            cursor: pointer;
            box-shadow: 5px 5px 0 var(--blood-orange);
        }

        .close-dash {
            background: none;
            border: 1px solid var(--bone);
            color: var(--bone);
            padding: 0.5rem 1rem;
            cursor: pointer;
        }
    `;

    // --- Component Logic ---
    function init() {
        // Inject Styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = dashboardStyles;
        document.head.appendChild(styleSheet);

        // Create Ticker
        renderTicker();

        // Create Dashboard Overlay
        renderDashboardOverlay();

        // Add Toggle Button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'dash-toggle';
        toggleBtn.innerHTML = 'TERMINAL DASHBOARD [ALT+D]';
        toggleBtn.onclick = toggleDashboard;
        document.body.appendChild(toggleBtn);

        // Keyboard Shortcut
        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'd') toggleDashboard();
        });
    }

    function renderTicker() {
        const tickerContainer = document.createElement('div');
        tickerContainer.id = 'terminal-ticker-container';
        
        const wrap = document.createElement('div');
        wrap.className = 'ticker-wrap';
        
        // Double the content for seamless loop
        const content = FEED_ALERTS.concat(FEED_ALERTS).map(text => 
            `<span class="ticker-item">${text}</span>`
        ).join('');
        
        wrap.innerHTML = content;
        tickerContainer.appendChild(wrap);
        
        // Insert after nav
        const nav = document.querySelector('nav');
        nav.parentNode.insertBefore(tickerContainer, nav.nextSibling);
    }

    function renderDashboardOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'dashboard-overlay';
        overlay.className = 'dashboard-overlay';
        
        overlay.innerHTML = `
            <div class="dashboard-header">
                <div>
                    <div class="mono" style="color: var(--acid-green)">SYSTEM STATUS: OPERATIONAL</div>
                    <h2 style="font-size: 2rem;">BUYER COMMAND CENTER</h2>
                </div>
                <button class="close-dash mono" onclick="document.getElementById('dashboard-overlay').style.display='none'">[ESC] CLOSE TERMINAL</button>
            </div>

            <div class="density-grid">
                <div class="data-panel">
                    <h3 class="mono" style="margin-bottom: 1.5rem; color: var(--bone);">Active Outreach Pipeline</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Deal ID</th>
                                <th>Target Asset</th>
                                <th>Status</th>
                                <th>Brokerage</th>
                                <th>Last Pulse</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${MOCK_OUTREACH.map(o => `
                                <tr>
                                    <td style="color: var(--copper);">#${o.id}</td>
                                    <td style="font-weight:700;">${o.deal}</td>
                                    <td><span class="status-pill ${getStatusClass(o.status)}">${o.status}</span></td>
                                    <td>${o.broker}</td>
                                    <td>${o.lastContact}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="data-panel">
                    <h3 class="mono" style="margin-bottom: 1.5rem; color: var(--blood-orange);">Price Monitoring</h3>
                    <div class="price-drop-monitor">
                        <div class="price-drop-card">
                            <div>
                                <div class="mono" style="font-size: 0.6rem;">Digital Agency</div>
                                <div style="text-decoration: line-through; color: var(--copper); font-size: 0.8rem;">$600,000</div>
                                <div style="font-weight: 900; color: var(--acid-green);">$510,000</div>
                            </div>
                            <div class="mono" style="color: var(--blood-orange);">-15%</div>
                        </div>
                        <div class="price-drop-card">
                            <div>
                                <div class="mono" style="font-size: 0.6rem;">Laundromat Portfolio</div>
                                <div style="text-decoration: line-through; color: var(--copper); font-size: 0.8rem;">$850,000</div>
                                <div style="font-weight: 900; color: var(--acid-green);">$795,000</div>
                            </div>
                            <div class="mono" style="color: var(--blood-orange);">-6.4%</div>
                        </div>
                    </div>

                    <h3 class="mono" style="margin: 2rem 0 1rem; color: var(--bone);">Watchlist Heatmap</h3>
                    <div style="height: 150px; background: linear-gradient(45deg, #141414 25%, #0a0a0a 25%, #0a0a0a 50%, #141414 50%, #141414 75%, #0a0a0a 75%, #0a0a0a 100%); background-size: 20px 20px; border: 1px solid var(--graphite); display: flex; align-items: center; justify-content: center;">
                        <span class="mono" style="color: var(--copper); font-size: 0.6rem;">Data Visualizer Offline - Connect API</span>
                    </div>
                </div>
            </div>

            <div class="data-panel" style="margin-top: 2rem;">
                <h3 class="mono" style="margin-bottom: 1rem;">Recent Terminal Logs</h3>
                <div class="mono" style="font-size: 0.7rem; color: #666; line-height: 1.6;">
                    > ${new Date().toISOString()} - Session Initialized...<br>
                    > Tracking 128 active search criteria...<br>
                    > Filtering junk leads... (88% filtered)<br>
                    > Monitoring SBA rate fluctuations... CURRENT: 10.25%<br>
                    > ${FEED_ALERTS[0]}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    function getStatusClass(status) {
        if (status.includes('NDA')) return 'status-nda';
        if (status.includes('DUE')) return 'status-dd';
        if (status.includes('LOI')) return 'status-loi';
        return '';
    }

    function toggleDashboard() {
        const overlay = document.getElementById('dashboard-overlay');
        const isVisible = overlay.style.display === 'block';
        overlay.style.display = isVisible ? 'none' : 'block';
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();