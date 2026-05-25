/**
 * PIPELINE-MANAGER.JS
 * Part of Personal Deal Flow Command for OXIDIZED LEDGER
 */

(function() {
    // 1. Dashboard State
    const state = {
        pipeline: [
            { id: 1, title: "Precision HVAC", stage: "reviewing", price: "$1.2M" },
            { id: 5, title: "Logistics SaaS (ERP)", stage: "due-diligence", price: "$2.4M" },
            { id: 12, title: "Concrete Paving & Repair", stage: "loi-sent", price: "$3.1M" }
        ],
        notes: [
            { id: 1, timestamp: "10:42:01", text: "Broker call: Verified 3yr SDE history." },
            { id: 2, timestamp: "14:15:33", text: "SaaS churn rate confirmed at 2.4% monthly." }
        ],
        alerts: [
            { type: "MATCH", msg: "New listing matches 'Local Service' + 'TX' filter.", time: "2h ago" },
            { type: "PRICE", msg: "Price Drop: Shopify Brand now $750k.", time: "5h ago" }
        ]
    };

    // 2. Inject Styles
    const styles = `
        #dashboardContainer {
            display: none;
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }

        .db-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 3rem;
            border-bottom: 2px solid var(--bone);
            padding-bottom: 1rem;
        }

        .db-grid {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 2rem;
        }

        /* Kanban Styles */
        .kanban-board {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }

        .kanban-col {
            background: var(--panel);
            border: 1px solid var(--graphite);
            padding: 1.5rem;
            min-height: 600px;
        }

        .kanban-title {
            font-family: 'JetBrains Mono';
            font-size: 0.8rem;
            color: var(--oxidized-copper);
            text-transform: uppercase;
            margin-bottom: 1.5rem;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid var(--graphite);
            padding-bottom: 0.5rem;
        }

        .kanban-card {
            background: var(--obsidian);
            border: 1px solid var(--graphite);
            padding: 1rem;
            margin-bottom: 1rem;
            position: relative;
        }

        .kanban-card h4 {
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }

        .kanban-card .price {
            color: var(--acid-green);
            font-family: 'JetBrains Mono';
            font-size: 0.8rem;
        }

        .kanban-actions {
            margin-top: 1rem;
            display: flex;
            gap: 0.5rem;
        }

        .move-btn {
            background: transparent;
            border: 1px solid #333;
            color: #666;
            font-size: 0.6rem;
            padding: 0.2rem 0.4rem;
            cursor: pointer;
            text-transform: uppercase;
        }

        .move-btn:hover { border-color: var(--bone); color: var(--bone); }

        /* Alert Feed */
        .alert-feed {
            background: var(--panel);
            border: 1px solid var(--graphite);
            padding: 1.5rem;
        }

        .alert-item {
            padding: 1rem 0;
            border-bottom: 1px solid #1a1a1a;
        }

        .alert-type {
            font-family: 'JetBrains Mono';
            font-size: 0.6rem;
            color: var(--blood-orange);
            display: block;
        }

        .alert-msg { font-size: 0.75rem; margin: 0.25rem 0; color: #888; }
        .alert-time { font-size: 0.6rem; color: #444; }

        /* Terminal */
        .notes-terminal {
            grid-column: 1 / -1;
            background: #000;
            border: 1px solid #222;
            padding: 1.5rem;
            font-family: 'JetBrains Mono', monospace;
            margin-top: 2rem;
        }

        .terminal-header {
            color: var(--acid-green);
            font-size: 0.7rem;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
        }

        .terminal-log {
            height: 150px;
            overflow-y: auto;
            color: #55ff55;
            font-size: 0.8rem;
            margin-bottom: 1rem;
        }

        .log-entry { margin-bottom: 0.4rem; }
        .log-ts { color: #226622; margin-right: 10px; }

        .terminal-input-wrap {
            display: flex;
            gap: 10px;
            border-top: 1px solid #111;
            padding-top: 1rem;
        }

        .terminal-input-wrap span { color: var(--acid-green); }

        #noteInput {
            background: transparent;
            border: none;
            color: var(--bone);
            flex-grow: 1;
            font-family: 'JetBrains Mono';
            outline: none;
        }

        .active-view-btn { color: var(--acid-green) !important; }
    `;

    // 3. Inject DOM Elements
    function init() {
        // Add Dashboard link to Nav
        const navLinks = document.querySelector('.nav-links');
        const dbToggle = document.createElement('a');
        dbToggle.href = "#";
        dbToggle.id = "toggleDashboard";
        dbToggle.innerText = "Command Dashboard";
        navLinks.prepend(dbToggle);

        // Create Container
        const main = document.createElement('div');
        main.id = "dashboardContainer";
        document.body.insertBefore(main, document.querySelector('.cta-strip'));

        // Inject Styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Listeners
        dbToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleView();
        });

        renderDashboard();
    }

    function toggleView() {
        const sections = ['hero', 'category-rail', 'filter-bar', 'listings-container'];
        const db = document.getElementById('dashboardContainer');
        const isDbVisible = db.style.display === 'block';

        sections.forEach(id => {
            const el = id === 'listings-container' ? document.getElementById('listingsGrid') : document.querySelector('.' + id);
            if (el) el.style.display = isDbVisible ? 'grid' : 'none';
            if (id === 'hero' && el) el.style.display = isDbVisible ? 'block' : 'none';
            if (id === 'category-rail' && el) el.style.display = isDbVisible ? 'flex' : 'none';
            if (id === 'filter-bar' && el) el.style.display = isDbVisible ? 'flex' : 'none';
        });

        db.style.display = isDbVisible ? 'none' : 'block';
        document.getElementById('toggleDashboard').classList.toggle('active-view-btn');
    }

    function renderDashboard() {
        const db = document.getElementById('dashboardContainer');
        db.innerHTML = `
            <div class="db-header">
                <div>
                    <span class="mono" style="color: var(--oxidized-copper); font-size: 0.7rem;">/ / USER_COMMAND_CENTER</span>
                    <h2 style="font-size: 2.5rem; font-weight: 900; text-transform: uppercase;">Personal Deal Flow</h2>
                </div>
                <div class="mono" style="font-size: 0.7rem; color: #444;">Last Updated: ${new Date().toLocaleTimeString()}</div>
            </div>

            <div class="db-grid">
                <div class="kanban-board">
                    <div class="kanban-col" id="col-reviewing">
                        <div class="kanban-title"><span>Reviewing</span> <span id="count-reviewing">0</span></div>
                        <div class="kanban-cards"></div>
                    </div>
                    <div class="kanban-col" id="col-due-diligence">
                        <div class="kanban-title"><span>Due Diligence</span> <span id="count-due-diligence">0</span></div>
                        <div class="kanban-cards"></div>
                    </div>
                    <div class="kanban-col" id="col-loi-sent">
                        <div class="kanban-title"><span>LOI Sent</span> <span id="count-loi-sent">0</span></div>
                        <div class="kanban-cards"></div>
                    </div>
                </div>

                <div class="alert-feed">
                    <h3 class="mono" style="font-size: 0.8rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--graphite); padding-bottom: 0.5rem;">Alert Feed</h3>
                    <div id="alertContainer"></div>
                </div>

                <div class="notes-terminal">
                    <div class="terminal-header">
                        <span>DEAL_NOTES_TERMINAL_V1.04</span>
                        <span>[SESSION: ACTIVE]</span>
                    </div>
                    <div class="terminal-log" id="terminalLog"></div>
                    <div class="terminal-input-wrap">
                        <span>></span>
                        <input type="text" id="noteInput" placeholder="Enter findings, broker notes, or due diligence flags..." autocomplete="off">
                    </div>
                </div>
            </div>
        `;

        updateKanban();
        updateAlerts();
        updateLogs();

        // Terminal logic
        const input = document.getElementById('noteInput');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                state.notes.push({
                    id: Date.now(),
                    timestamp: new Date().toLocaleTimeString('en-GB'),
                    text: input.value
                });
                input.value = '';
                updateLogs();
            }
        });
    }

    function updateKanban() {
        const stages = ['reviewing', 'due-diligence', 'loi-sent'];
        stages.forEach(stage => {
            const container = document.querySelector(`#col-${stage} .kanban-cards`);
            const countEl = document.getElementById(`count-${stage}`);
            const items = state.pipeline.filter(i => i.stage === stage);
            
            countEl.innerText = items.length;
            container.innerHTML = items.map(item => `
                <div class="kanban-card">
                    <h4>${item.title}</h4>
                    <span class="price">${item.price}</span>
                    <div class="kanban-actions">
                        <button class="move-btn" onclick="window.moveDeal(${item.id}, 'prev')"><</button>
                        <button class="move-btn" onclick="window.moveDeal(${item.id}, 'next')">></button>
                    </div>
                </div>
            `).join('');
        });
    }

    window.moveDeal = (id, dir) => {
        const stages = ['reviewing', 'due-diligence', 'loi-sent'];
        const deal = state.pipeline.find(d => d.id === id);
        let idx = stages.indexOf(deal.stage);
        
        if (dir === 'next' && idx < 2) idx++;
        if (dir === 'prev' && idx > 0) idx--;
        
        deal.stage = stages[idx];
        updateKanban();
    };

    function updateAlerts() {
        const container = document.getElementById('alertContainer');
        container.innerHTML = state.alerts.map(a => `
            <div class="alert-item">
                <span class="alert-type">${a.type}</span>
                <p class="alert-msg">${a.msg}</p>
                <span class="alert-time">${a.time}</span>
            </div>
        `).join('');
    }

    function updateLogs() {
        const log = document.getElementById('terminalLog');
        log.innerHTML = state.notes.map(n => `
            <div class="log-entry">
                <span class="log-ts">[${n.timestamp}]</span>
                <span class="log-text">${n.text}</span>
            </div>
        `).join('');
        log.scrollTop = log.scrollHeight;
    }

    // Initialize on load
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();