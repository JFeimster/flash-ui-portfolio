const leadDiscoveryLab = {
    leads: [
        { id: 1, name: "Sarah Chen", role: "VP Engineering", company: "Finflow", niche: "Fintech", signal: "Recent Series B funding", score: 98, status: "Verified" },
        { id: 2, name: "Marcus Thorne", role: "CTO", company: "SecureLedger", niche: "Blockchain", signal: "Expansion into Austin", score: 92, status: "Researching" },
        { id: 3, name: "Elena Rodriguez", role: "Founder", company: "PayPulse", niche: "Payments", signal: "Tech stack: Node/AWS", score: 87, status: "Verified" },
        { id: 4, name: "David Kim", role: "Head of Ops", company: "Vertex Labs", niche: "SaaS", signal: "Social signal: 'Scaling fast'", score: 74, status: "Queued" },
        { id: 5, name: "Julian Vane", role: "Product Lead", company: "Neo-Finance", niche: "Fintech", signal: "Direct API integration detected", score: 95, status: "Verified" }
    ],

    init() {
        this.injectStyles();
        this.render();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .research-lab {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 12px;
                margin-top: 5px;
                overflow: hidden;
                animation: fadeIn 0.8s ease-out;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }

            .lab-header {
                padding: 16px 20px;
                border-bottom: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255,255,255,0.01);
            }

            .lab-title {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: var(--text-main);
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .lab-title span { color: var(--accent); font-size: 18px; line-height: 0; }

            .table-container {
                width: 100%;
                overflow-x: auto;
            }

            .lead-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                text-align: left;
            }

            .lead-table th {
                padding: 12px 20px;
                color: var(--text-dim);
                text-transform: uppercase;
                font-size: 9px;
                letter-spacing: 1px;
                border-bottom: 1px solid var(--border);
                background: rgba(0,0,0,0.2);
                font-weight: 600;
            }

            .lead-table td {
                padding: 14px 20px;
                border-bottom: 1px solid var(--border);
                color: var(--text-main);
                vertical-align: middle;
                transition: var(--transition);
            }

            .lead-table tr:hover td {
                background: rgba(0, 242, 255, 0.02);
            }

            .lead-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .lead-name { font-weight: 600; color: #fff; font-size: 13px; }
            .lead-role { font-size: 11px; color: var(--text-dim); }

            .company-tag {
                display: inline-block;
                padding: 3px 8px;
                background: #000;
                border: 1px solid var(--border);
                border-radius: 4px;
                font-family: var(--font-mono);
                font-size: 10px;
                color: #fff;
            }

            .signal-pill {
                color: var(--accent);
                background: var(--accent-soft);
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 500;
                border: 1px solid rgba(0, 242, 255, 0.2);
            }

            .score-cell {
                font-family: var(--font-mono);
                font-weight: 700;
                color: var(--success);
            }

            .status-badge {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 10px;
                text-transform: uppercase;
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            .badge-dot-ui {
                width: 6px;
                height: 6px;
                border-radius: 50%;
            }

            .badge-dot-ui.verified { background: var(--success); box-shadow: 0 0 8px var(--success); }
            .badge-dot-ui.pending { background: #ffaa00; box-shadow: 0 0 8px #ffaa00; animation: pulse 2s infinite; }
            .badge-dot-ui.queued { background: var(--text-dim); }

            .btn-enrich {
                background: transparent;
                border: 1px solid var(--border);
                color: var(--text-dim);
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                transition: var(--transition);
            }

            .btn-enrich:hover {
                border-color: var(--accent);
                color: var(--accent);
                background: var(--accent-soft);
            }

            .scan-line {
                height: 1px;
                background: linear-gradient(90deg, transparent, var(--accent), transparent);
                width: 100%;
                position: absolute;
                top: 0;
                animation: scanMove 3s linear infinite;
                opacity: 0.3;
            }

            @keyframes scanMove {
                0% { top: 0; }
                100% { top: 100%; }
            }
        `;
        document.head.appendChild(style);
    },

    render() {
        const container = document.querySelector('.engine-console');
        if (!container) return;

        const labHtml = `
            <div class="research-lab" style="position: relative;">
                <div class="scan-line"></div>
                <div class="lab-header">
                    <div class="lab-title"><span>&middot;</span> Lead Discovery & Research Lab</div>
                    <div style="font-family: var(--font-mono); font-size: 9px; color: var(--text-dim); letter-spacing: 1px;">
                        STATUS: AGENT_ACTIVE // BUFF_SIZE: 512KB
                    </div>
                </div>
                <div class="table-container">
                    <table class="lead-table">
                        <thead>
                            <tr>
                                <th>Prospect Name</th>
                                <th>Organization</th>
                                <th>Discovery Signal</th>
                                <th>Intent</th>
                                <th>Workflow</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.leads.map(lead => `
                                <tr>
                                    <td>
                                        <div class="lead-info">
                                            <span class="lead-name">${lead.name}</span>
                                            <span class="lead-role">${lead.role}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="company-tag">${lead.company}</div>
                                        <div style="font-size: 9px; color: var(--text-dim); margin-top: 4px; text-transform: uppercase;">${lead.niche}</div>
                                    </td>
                                    <td>
                                        <span class="signal-pill">${lead.signal}</span>
                                    </td>
                                    <td>
                                        <span class="score-cell">${lead.score}%</span>
                                    </td>
                                    <td>
                                        <div class="status-badge">
                                            <span class="badge-dot-ui ${lead.status === 'Verified' ? 'verified' : lead.status === 'Researching' ? 'pending' : 'queued'}"></span>
                                            ${lead.status}
                                        </div>
                                    </td>
                                    <td>
                                        <button class="btn-enrich">Enrich</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', labHtml);
    }
};

// Auto-initialize component
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => leadDiscoveryLab.init());
} else {
    leadDiscoveryLab.init();
}