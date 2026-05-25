/**
 * THE TERMINAL DASHBOARD // User Preferences & Command Center
 * Integration for ACQUISITION INDEX
 */

(function() {
    // 1. STATE MANAGEMENT
    const PREFS_KEY = 'terminal_user_prefs';
    const OUTREACH_KEY = 'terminal_outreach_log';

    let userPrefs = JSON.parse(localStorage.getItem(PREFS_KEY)) || {
        theme: 'obsidian',
        refreshRate: 5000,
        notifications: true,
        riskTolerance: 'medium',
        targetMultiples: [2.0, 4.0]
    };

    let brokerOutreach = JSON.parse(localStorage.getItem(OUTREACH_KEY)) || [
        { id: 1, dealId: 1, status: 'NDA Signed', lastContact: '2023-10-24', notes: 'Waiting on CIM' },
        { id: 2, dealId: 3, status: 'Inquiry Sent', lastContact: '2023-10-25', notes: 'Follow up Monday' }
    ];

    // 2. STYLES INJECTION
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        #terminal-dashboard {
            background: var(--obsidian);
            border-top: var(--border-width) solid var(--bone);
            margin-top: 4rem;
            display: grid;
            grid-template-columns: 350px 1fr;
            min-height: 600px;
        }

        .dashboard-sidebar {
            border-right: 1px solid var(--graphite);
            padding: 2rem;
            background: rgba(20, 20, 20, 0.5);
        }

        .dashboard-main {
            padding: 0;
            display: flex;
            flex-direction: column;
        }

        .ticker-wrap {
            width: 100%;
            overflow: hidden;
            background: var(--graphite);
            border-bottom: 1px solid var(--bone);
            padding: 10px 0;
            white-space: nowrap;
        }

        .ticker-move {
            display: inline-block;
            animation: ticker 30s linear infinite;
        }

        .ticker-item {
            display: inline-block;
            padding: 0 2rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            color: var(--acid-green);
        }

        @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        .outreach-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.8rem;
        }

        .outreach-table th {
            text-align: left;
            padding: 1rem;
            border-bottom: 1px solid var(--graphite);
            color: var(--copper);
            font-family: 'JetBrains Mono';
            text-transform: uppercase;
        }

        .outreach-table td {
            padding: 1rem;
            border-bottom: 1px solid var(--graphite);
        }

        .status-pill {
            padding: 2px 6px;
            font-weight: 700;
            font-size: 0.65rem;
            text-transform: uppercase;
            background: var(--bone);
            color: var(--obsidian);
        }

        .status-nda { background: var(--acid-green); }
        .status-inquiry { background: var(--copper); }

        .price-drop-alert {
            background: rgba(255, 61, 0, 0.1);
            border: 1px solid var(--blood-orange);
            padding: 1rem;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .panel-header {
            padding: 1.5rem 2rem;
            border-bottom: 1px solid var(--graphite);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .density-high { font-size: 0.75rem !important; }
    `;
    document.head.appendChild(styleSheet);

    // 3. UI GENERATION
    function createDashboard() {
        const existingContainer = document.getElementById('saved-listings');
        if (!existingContainer) return;

        // Replace the simple saved items with the full command center
        const parent = existingContainer.parentElement;
        parent.innerHTML = `
            <div class="mono" style="padding: 2rem 2rem 0; color: var(--acid-green);">[ ACCESSING COMMAND_CENTER_V2.0 ]</div>
            <div id="terminal-dashboard">
                <aside class="dashboard-sidebar">
                    <h3 class="mono" style="margin-bottom: 2rem;">Watchlist Alpha</h3>
                    <div id="dashboard-watchlist"></div>
                    
                    <h3 class="mono" style="margin-top: 3rem; margin-bottom: 1rem;">Price Alerts</h3>
                    <div id="price-alerts-container">
                        <div class="price-drop-alert">
                            <div>
                                <div class="mono" style="font-size: 0.6rem; color: var(--blood-orange);">PRICE DROP - 12%</div>
                                <div style="font-weight: 700;">SaaS Content Tool</div>
                            </div>
                            <div class="mono">$132K</div>
                        </div>
                    </div>
                </aside>

                <main class="dashboard-main">
                    <div class="ticker-wrap">
                        <div class="ticker-move" id="deal-ticker">
                            <!-- Injected by JS -->
                        </div>
                    </div>

                    <div class="panel-header">
                        <h3 class="mono">Active Broker Outreach</h3>
                        <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.6rem;" onclick="window.dashboard.addOutreach()">+ Log Outreach</button>
                    </div>

                    <div style="padding: 1rem; flex: 1; overflow-y: auto;">
                        <table class="outreach-table">
                            <thead>
                                <tr>
                                    <th>Target Asset</th>
                                    <th>Status</th>
                                    <th>Last Contact</th>
                                    <th>Notes</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="outreach-body"></tbody>
                        </table>
                    </div>
                </main>
            </div>
        `;

        renderDashboardContent();
        initTicker();
    }

    function renderDashboardContent() {
        // Render Watchlist
        const watchlistContainer = document.getElementById('dashboard-watchlist');
        const savedData = DEALS.filter(d => savedIds.includes(d.id));
        
        if (savedData.length === 0) {
            watchlistContainer.innerHTML = '<div class="mono" style="opacity: 0.5;">No active monitors.</div>';
        } else {
            watchlistContainer.innerHTML = savedData.map(deal => `
                <div style="padding: 1rem 0; border-bottom: 1px solid var(--graphite);">
                    <div class="mono" style="font-size: 0.6rem; color: var(--copper);">${deal.industry}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700;">${deal.title}</span>
                        <span class="mono" style="color: var(--acid-green);">${formatCurrency(deal.asking)}</span>
                    </div>
                </div>
            `).join('');
        }

        // Render Outreach
        const outreachBody = document.getElementById('outreach-body');
        outreachBody.innerHTML = brokerOutreach.map(entry => {
            const deal = DEALS.find(d => d.id === entry.dealId) || { title: 'Unknown Asset' };
            return `
                <tr>
                    <td><div style="font-weight: 700;">${deal.title}</div><div class="mono" style="font-size: 0.6rem;">ID: ${entry.dealId}</div></td>
                    <td><span class="status-pill ${entry.status === 'NDA Signed' ? 'status-nda' : 'status-inquiry'}">${entry.status}</span></td>
                    <td class="mono">${entry.lastContact}</td>
                    <td style="color: var(--copper); font-size: 0.75rem;">${entry.notes}</td>
                    <td><button class="mono" style="background: none; border: none; color: var(--bone); cursor: pointer;" onclick="window.dashboard.updateStatus(${entry.id})">[ EDIT ]</button></td>
                </tr>
            `;
        }).join('');
    }

    function initTicker() {
        const ticker = document.getElementById('deal-ticker');
        const tickerContent = DEALS.map(d => `
            <span class="ticker-item">NEW LISTING: ${d.title} // ${formatCurrency(d.asking)} // SDE: ${formatCurrency(d.sde)} // MULTIPLE: ${d.multiple}</span>
            <span class="ticker-item" style="color: var(--bone)">|</span>
        `).join('');
        
        // Double it for seamless loop
        ticker.innerHTML = tickerContent + tickerContent;
    }

    // 4. PUBLIC API
    window.dashboard = {
        init: createDashboard,
        addOutreach: () => {
            const dealId = prompt("Enter Deal ID to track:");
            if (!dealId) return;
            const newEntry = {
                id: Date.now(),
                dealId: parseInt(dealId),
                status: 'Inquiry Sent',
                lastContact: new Date().toISOString().split('T')[0],
                notes: 'Initial contact'
            };
            brokerOutreach.push(newEntry);
            localStorage.setItem(OUTREACH_KEY, JSON.stringify(brokerOutreach));
            renderDashboardContent();
        },
        updateStatus: (id) => {
            const entry = brokerOutreach.find(e => e.id === id);
            const newStatus = prompt("Update status (Inquiry Sent, NDA Signed, LOI, DD, Closed):", entry.status);
            if (newStatus) {
                entry.status = newStatus;
                localStorage.setItem(OUTREACH_KEY, JSON.stringify(brokerOutreach));
                renderDashboardContent();
            }
        }
    };

    // 5. BOOTSTRAP
    // Wait for the main script to load DEALS and savedIds
    setTimeout(() => {
        window.dashboard.init();
        
        // Intercept the original toggleSave to refresh our dashboard
        const originalToggleSave = window.toggleSave;
        window.toggleSave = function(id) {
            originalToggleSave(id);
            renderDashboardContent();
        };
    }, 100);

})();