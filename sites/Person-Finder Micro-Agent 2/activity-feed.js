const dashboardStyles = `
    .dashboard-overlay {
        padding: 32px;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 32px;
        animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }

    .metric-card {
        background: var(--bg-card);
        border: 1px solid var(--border-muted);
        padding: 20px;
        border-radius: var(--radius);
        position: relative;
        overflow: hidden;
    }

    .metric-card::after {
        content: "";
        position: absolute;
        top: 0; left: 0; width: 2px; height: 100%;
        background: var(--accent-primary);
    }

    .metric-label {
        font-family: var(--font-mono);
        font-size: 10px;
        color: var(--text-dim);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 8px;
        display: block;
    }

    .metric-value {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
        font-family: var(--font-mono);
    }

    .metric-trend {
        font-size: 11px;
        color: var(--accent-primary);
        margin-left: 8px;
    }

    .section-title {
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--text-muted);
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .section-title::after {
        content: "";
        flex-grow: 1;
        height: 1px;
        background: var(--border-muted);
    }

    .activity-feed {
        background: var(--bg-card);
        border: 1px solid var(--border-muted);
        border-radius: var(--radius);
        overflow: hidden;
    }

    .feed-item {
        padding: 14px 20px;
        border-bottom: 1px solid var(--border-muted);
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: var(--transition);
    }

    .feed-item:last-child { border-bottom: none; }
    .feed-item:hover { background: rgba(255,255,255,0.02); }

    .person-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .person-name {
        font-size: 13px;
        font-weight: 600;
        color: #fff;
    }

    .person-meta {
        font-size: 11px;
        color: var(--text-muted);
    }

    .source-tag {
        font-family: var(--font-mono);
        font-size: 9px;
        padding: 2px 6px;
        border-radius: 3px;
        background: rgba(255,255,255,0.05);
        color: var(--text-muted);
        border: 1px solid var(--border-muted);
    }

    .reliability-chart {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .source-row {
        display: grid;
        grid-template-columns: 100px 1fr 40px;
        align-items: center;
        gap: 16px;
    }

    .source-label {
        font-size: 12px;
        color: var(--text-main);
    }

    .progress-bar-bg {
        height: 4px;
        background: var(--border-muted);
        border-radius: 2px;
        overflow: hidden;
    }

    .progress-bar-fill {
        height: 100%;
        background: var(--accent-primary);
        box-shadow: 0 0 8px var(--accent-glow);
    }

    .percent-value {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--accent-primary);
        text-align: right;
    }
`;

const activityData = {
    metrics: [
        { label: 'Identified', value: '1,284', trend: '+12%' },
        { label: 'Accuracy', value: '94.2%', trend: '+0.4%' },
        { label: 'Avg Speed', value: '8.4s', trend: '-1.2s' }
    ],
    recent: [
        { name: 'Elena Rodriguez', title: 'Managing Director', company: 'Nexus Capital', source: 'SOS_RECORDS' },
        { name: 'Marcus Thorne', title: 'VP Operations', company: 'Global Logistics', source: 'LINKEDIN_API' },
        { name: 'Sarah Jenkins', title: 'Lead Designer', company: 'Aura Design', source: 'WEB_SCRAPER' },
        { name: 'David Cho', title: 'Founder', company: 'Zenith Tech', source: 'SOS_RECORDS' }
    ],
    sources: [
        { name: 'LinkedIn', score: 88 },
        { name: 'SOS Filings', score: 92 },
        { name: 'Web Meta', score: 64 },
        { name: 'Local Dir', score: 42 }
    ]
};

function renderDashboard() {
    const container = document.querySelector('.sequence-view');
    if (!container) return;

    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = dashboardStyles;
    document.head.appendChild(styleSheet);

    const dashboardHTML = `
        <div class="dashboard-overlay">
            <div class="metrics-grid">
                ${activityData.metrics.map(m => `
                    <div class="metric-card">
                        <span class="metric-label">${m.label}</span>
                        <div style="display: flex; align-items: baseline;">
                            <span class="metric-value">${m.value}</span>
                            <span class="metric-trend">${m.trend}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="feed-section">
                <div class="section-title">RECENT SUCCESSFUL EXTRACTIONS</div>
                <div class="activity-feed">
                    ${activityData.recent.map(item => `
                        <div class="feed-item">
                            <div class="person-info">
                                <span class="person-name">${item.name}</span>
                                <span class="person-meta">${item.title} @ ${item.company}</span>
                            </div>
                            <span class="source-tag">${item.source}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="analytics-section">
                <div class="section-title">DATA SOURCE RELIABILITY INDEX</div>
                <div class="reliability-chart">
                    ${activityData.sources.map(s => `
                        <div class="source-row">
                            <span class="source-label">${s.name}</span>
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: ${s.score}%"></div>
                            </div>
                            <span class="percent-value">${s.score}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Replace sequence content with dashboard
    container.innerHTML = `
        <div class="sequence-header">
            <div class="status-indicator">
                <div class="dot active"></div>
                <span>ANALYTICS ENGINE ONLINE</span>
            </div>
            <div class="status-indicator">
                <span style="color: var(--text-dim)">REFRESH: 500MS</span>
            </div>
        </div>
        ${dashboardHTML}
    `;
}

// Initialize when search is finished or via trigger
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchBtn.innerHTML = 'PROCESSING...';
            setTimeout(renderDashboard, 2500);
        });
    }
});