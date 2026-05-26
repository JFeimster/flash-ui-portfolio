const dashboardStats = {
    metrics: {
        totalIdentified: 1422,
        successRate: "89.4%",
        avgSearchTime: "4.2s",
        activeNodes: 12
    },
    sources: [
        { name: "LinkedIn Graph", value: 85, color: "#00ff88" },
        { name: "Secretary of State", value: 62, color: "#707070" },
        { name: "Website Scraping", value: 48, color: "#404040" },
        { name: "BBB / Local Dir", value: 22, color: "#222222" }
    ],
    recentHits: [
        { name: "Marcus Thorne", role: "CEO", company: "Nexus Systems", time: "2m ago" },
        { name: "Elena Rodriguez", role: "Founder", company: "Veridian Lab", time: "14m ago" },
        { name: "Sarah Jenkins", role: "Lead Designer", company: "Aura Studio", time: "28m ago" }
    ]
};

function injectDashboardStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .stats-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(5, 5, 5, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            display: none;
            padding: 40px;
            overflow-y: auto;
        }

        .stats-grid {
            max-width: 1100px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border-muted);
            padding: 24px;
            border-radius: 8px;
        }

        .stat-label {
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: var(--accent-primary);
        }

        .dashboard-main {
            grid-column: span 3;
            background: var(--bg-card);
            border: 1px solid var(--border-muted);
            border-radius: 12px;
            padding: 32px;
            margin-top: 20px;
        }

        .dashboard-side {
            grid-column: span 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 20px;
        }

        .source-bar-container {
            margin-top: 20px;
        }

        .source-row {
            margin-bottom: 16px;
        }

        .source-info {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            margin-bottom: 6px;
        }

        .bar-bg {
            height: 4px;
            background: #1a1a1a;
            border-radius: 2px;
            overflow: hidden;
        }

        .bar-fill {
            height: 100%;
            transition: width 1.5s ease-out;
        }

        .recent-hit-item {
            padding: 12px 0;
            border-bottom: 1px solid var(--border-muted);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .recent-hit-item:last-child { border: none; }

        .hit-name { font-size: 14px; font-weight: 600; color: #fff; }
        .hit-meta { font-size: 12px; color: var(--text-muted); }
        .hit-time { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); }

        .close-dashboard {
            position: absolute;
            top: 40px;
            right: 40px;
            background: transparent;
            border: 1px solid var(--border-muted);
            color: var(--text-muted);
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-family: var(--font-mono);
            font-size: 12px;
        }

        .close-dashboard:hover { border-color: var(--accent-primary); color: #fff; }
    `;
    document.head.appendChild(style);
}

function renderDashboard() {
    const container = document.createElement('div');
    container.id = 'agent-dashboard';
    container.className = 'stats-overlay';
    
    container.innerHTML = `
        <button class="close-dashboard" onclick="document.getElementById('agent-dashboard').style.display='none'">ESC_CLOSE</button>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Identified Contacts</div>
                <div class="stat-value">${dashboardStats.metrics.totalIdentified}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Avg Success Rate</div>
                <div class="stat-value">${dashboardStats.metrics.successRate}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Processing Speed</div>
                <div class="stat-value">${dashboardStats.metrics.avgSearchTime}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Active Nodes</div>
                <div class="stat-value">${dashboardStats.metrics.activeNodes}</div>
            </div>

            <div class="dashboard-main">
                <h2 style="font-size: 18px; margin-bottom: 24px;">Source Reliability Index</h2>
                <div class="source-bar-container">
                    ${dashboardStats.sources.map(s => `
                        <div class="source-row">
                            <div class="source-info">
                                <span>${s.name}</span>
                                <span style="color: ${s.color}">${s.value}%</span>
                            </div>
                            <div class="bar-bg">
                                <div class="bar-fill" style="width: ${s.value}%; background: ${s.color}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="dashboard-side">
                <div class="stat-card" style="flex-grow: 1;">
                    <h3 style="font-size: 14px; margin-bottom: 16px; color: var(--text-muted);">RECENT_SUCCESS_LOG</h3>
                    ${dashboardStats.recentHits.map(hit => `
                        <div class="recent-hit-item">
                            <div>
                                <div class="hit-name">${hit.name}</div>
                                <div class="hit-meta">${hit.role} @ ${hit.company}</div>
                            </div>
                            <div class="hit-time">${hit.time}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(container);
}

// Add toggle button to the main sidebar
function addDashboardToggle() {
    const sidebar = document.querySelector('.input-sidebar');
    if (sidebar) {
        const btn = document.createElement('button');
        btn.innerHTML = 'VIEW ANALYTICS';
        btn.style.width = '100%';
        btn.style.marginTop = '12px';
        btn.style.background = 'transparent';
        btn.style.border = '1px solid var(--border-muted)';
        btn.style.color = 'var(--text-muted)';
        btn.style.padding = '10px';
        btn.style.borderRadius = '8px';
        btn.style.fontSize = '11px';
        btn.style.fontFamily = 'var(--font-mono)';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'var(--transition)';
        
        btn.onmouseover = () => btn.style.borderColor = 'var(--accent-primary)';
        btn.onmouseout = () => btn.style.borderColor = 'var(--border-muted)';
        btn.onclick = () => document.getElementById('agent-dashboard').style.display = 'block';
        
        sidebar.appendChild(btn);
    }
}

// Initialize
injectDashboardStyles();
renderDashboard();
addDashboardToggle();

// Listen for ESC key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('agent-dashboard').style.display = 'none';
    }
});