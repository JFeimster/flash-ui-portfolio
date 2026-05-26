/**
 * Dashboard Controller for Lead Management
 * Manages the centralized hub for business entities and search metrics.
 */

const DashboardState = {
    leads: [
        { id: 1, name: 'Sarah Jenkins', title: 'Operations Director', company: 'Acme Corp', industry: 'SaaS', status: 'Verified', date: '2023-10-24' },
        { id: 2, name: 'Michael Chen', title: 'Managing Partner', company: 'Nexus Logistics', industry: 'Shipping', status: 'Pending', date: '2023-10-25' },
        { id: 3, name: 'Elena Rodriguez', title: 'CEO', company: 'Solaris Energy', industry: 'Renewables', status: 'Verified', date: '2023-10-25' },
        { id: 4, name: 'David Vane', title: 'Lead Engineer', company: 'Vane Dynamics', industry: 'Manufacturing', status: 'Processing', date: '2023-10-26' }
    ],
    filter: 'all',
    isDashboardView: false
};

class LeadDashboard {
    constructor() {
        this.container = document.querySelector('.main-panel');
        this.init();
    }

    init() {
        this.injectDashboardStyles();
        this.addNavigationTab();
        this.bindEvents();
    }

    injectDashboardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .dashboard-overlay {
                padding: 24px;
                background: var(--bg-dark);
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 24px;
                animation: fadeIn 0.3s ease-out;
            }

            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
            }

            .metric-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                padding: 16px;
                border-radius: 8px;
            }

            .metric-value {
                font-size: 1.5rem;
                font-weight: 700;
                font-family: 'JetBrains Mono', monospace;
                color: var(--primary);
            }

            .metric-label {
                font-size: 0.7rem;
                color: var(--text-dim);
                text-transform: uppercase;
                margin-top: 4px;
            }

            .dashboard-table {
                width: 100%;
                border-collapse: collapse;
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 8px;
                overflow: hidden;
            }

            .dashboard-table th {
                text-align: left;
                padding: 12px 16px;
                background: rgba(255,255,255,0.03);
                font-size: 0.75rem;
                color: var(--text-dim);
                border-bottom: 1px solid var(--border);
            }

            .dashboard-table td {
                padding: 12px 16px;
                font-size: 0.85rem;
                border-bottom: 1px solid var(--border);
            }

            .status-pill {
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 0.7rem;
                font-weight: 600;
            }

            .status-verified { background: rgba(16, 185, 129, 0.1); color: var(--accent); }
            .status-pending { background: rgba(59, 130, 246, 0.1); color: var(--primary); }
            .status-processing { background: rgba(255, 255, 255, 0.05); color: var(--text-dim); }

            .dashboard-actions {
                display: flex;
                gap: 12px;
                margin-bottom: 8px;
            }

            .view-toggle-btn {
                background: transparent;
                border: 1px solid var(--border);
                color: var(--text-dim);
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.2s;
            }

            .view-toggle-btn.active {
                background: var(--primary);
                color: white;
                border-color: var(--primary);
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    addNavigationTab() {
        const sidebar = document.querySelector('.sidebar');
        const navContainer = document.createElement('div');
        navContainer.className = 'input-group';
        navContainer.style.marginTop = '20px';
        navContainer.innerHTML = `
            <label>Navigation</label>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <button class="view-toggle-btn active" id="btn-finder">Micro-Agent Search</button>
                <button class="view-toggle-btn" id="btn-dashboard">Lead Dashboard</button>
            </div>
        `;
        sidebar.insertBefore(navContainer, sidebar.querySelector('.btn-start'));
    }

    bindEvents() {
        document.getElementById('btn-finder').addEventListener('click', () => this.switchView('finder'));
        document.getElementById('btn-dashboard').addEventListener('click', () => this.switchView('dashboard'));
        
        const startBtn = document.querySelector('.btn-start');
        startBtn.addEventListener('click', () => {
            startBtn.innerHTML = '<span class="cursor"></span> SEARCHING...';
            startBtn.style.opacity = '0.7';
            setTimeout(() => {
                startBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Initialize Search';
                startBtn.style.opacity = '1';
            }, 2000);
        });
    }

    switchView(view) {
        const finderBtn = document.getElementById('btn-finder');
        const dashBtn = document.getElementById('btn-dashboard');
        
        if (view === 'dashboard') {
            finderBtn.classList.remove('active');
            dashBtn.classList.add('active');
            this.renderDashboard();
        } else {
            dashBtn.classList.remove('active');
            finderBtn.classList.add('active');
            location.reload(); // Simplest way to restore the original complex HTML structure
        }
    }

    renderDashboard() {
        const verifiedCount = DashboardState.leads.filter(l => l.status === 'Verified').length;
        const pendingCount = DashboardState.leads.filter(l => l.status === 'Pending').length;

        this.container.innerHTML = `
            <div class="status-bar">
                <div class="status-indicator">
                    <div class="pulse" style="background: var(--primary)"></div>
                    <span>DASHBOARD: <span style="color:var(--text-main)">LEAD MANAGEMENT HUB</span></span>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-dim); font-family: 'JetBrains Mono'">
                    ENTITIES: ${DashboardState.leads.length} | SYNC: ACTIVE
                </div>
            </div>
            <div class="dashboard-overlay">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value">${DashboardState.leads.length}</div>
                        <div class="metric-label">Total Leads</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" style="color:var(--accent)">${verifiedCount}</div>
                        <div class="metric-label">Verified Contact</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" style="color:var(--primary)">${pendingCount}</div>
                        <div class="metric-label">Pending Verification</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" style="color:var(--text-dim)">94%</div>
                        <div class="metric-label">Agent Accuracy</div>
                    </div>
                </div>

                <div class="dashboard-actions">
                    <button class="view-toggle-btn" style="font-size:0.7rem">Bulk Export CSV</button>
                    <button class="view-toggle-btn" style="font-size:0.7rem">Filter: All Industries</button>
                    <button class="view-toggle-btn" style="font-size:0.7rem; margin-left:auto">Sync with CRM</button>
                </div>

                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Contact Name</th>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Industry</th>
                            <th>Status</th>
                            <th>Date Found</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${DashboardState.leads.map(lead => `
                            <tr>
                                <td style="font-weight:600">${lead.name}</td>
                                <td style="color:var(--primary)">${lead.title}</td>
                                <td>${lead.company}</td>
                                <td style="color:var(--text-dim)">${lead.industry}</td>
                                <td><span class="status-pill status-${lead.status.toLowerCase()}">${lead.status}</span></td>
                                <td style="font-family:'JetBrains Mono'; font-size:0.75rem">${lead.date}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}

// Initialize the dashboard controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.LeadManager = new LeadDashboard();
});