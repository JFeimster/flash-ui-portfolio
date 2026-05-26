/**
 * Moonshine Capital | Leads Management & Export SDK
 * Optimized for Static Deployment
 */

const LEADS_MOCK_DATA = [
    { name: "Sarah Jenkins", email: "s.jenkins@techflow.io", widget: "Funding Readiness", source: "blog-sidebar", date: "2023-10-24 14:20", status: "Qualified" },
    { name: "Marcus Thorne", email: "m.thorne@vanguard.dev", widget: "Route Matcher", source: "partner-footer", date: "2023-10-24 11:05", status: "New" },
    { name: "Elena Rodriguez", email: "elena.rod@growthlabs.com", widget: "Funding Readiness", source: "direct-link", date: "2023-10-23 16:45", status: "Contacted" },
    { name: "David Chen", email: "dchen@nexusventures.co", widget: "CTA Button", source: "navbar-apply", date: "2023-10-23 09:12", status: "Qualified" },
    { name: "Aisha Khan", email: "akhan@innovate.biz", widget: "Document Checklist", source: "resource-page", date: "2023-10-22 18:30", status: "New" },
    { name: "Oliver Smith", email: "osmith@fintech-solutions.uk", widget: "Commission Estimator", source: "affiliate-dashboard", date: "2023-10-22 13:15", status: "Closed" }
];

const LeadsManager = {
    currentLeads: [...LEADS_MOCK_DATA],

    init() {
        this.injectStyles();
        this.renderLayout();
        this.bindEvents();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .leads-wrapper {
                margin-top: 3rem;
                animation: fadeIn 0.5s ease-out;
            }
            .leads-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            .leads-controls {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            .search-input-wrapper {
                position: relative;
                flex-grow: 1;
            }
            .search-input-wrapper i {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-dim);
            }
            #leadsSearch {
                padding-left: 2.5rem;
            }
            .leads-table-container {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 12px;
                overflow: hidden;
            }
            .leads-table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
                font-size: 0.9rem;
            }
            .leads-table th {
                background: rgba(48, 54, 61, 0.5);
                color: var(--neon-blue);
                font-weight: 600;
                text-transform: uppercase;
                font-size: 0.75rem;
                letter-spacing: 1px;
                padding: 1rem;
                border-bottom: 1px solid var(--border);
            }
            .leads-table td {
                padding: 1rem;
                border-bottom: 1px solid var(--border);
                color: var(--text-main);
            }
            .leads-table tr:last-child td {
                border-bottom: none;
            }
            .leads-table tr:hover {
                background: rgba(0, 242, 255, 0.02);
            }
            .source-tag {
                font-family: var(--font-mono);
                font-size: 0.75rem;
                background: var(--bg-input);
                color: var(--neon-green);
                padding: 2px 6px;
                border-radius: 4px;
            }
            .status-badge {
                font-size: 0.7rem;
                font-weight: 700;
                padding: 4px 8px;
                border-radius: 20px;
                text-transform: uppercase;
            }
            .status-New { background: rgba(0, 242, 255, 0.1); color: var(--neon-blue); border: 1px solid var(--neon-blue); }
            .status-Qualified { background: rgba(0, 255, 157, 0.1); color: var(--neon-green); border: 1px solid var(--neon-green); }
            .status-Contacted { background: rgba(255, 255, 255, 0.05); color: var(--text-dim); border: 1px solid var(--border); }
            .status-Closed { background: rgba(139, 148, 158, 0.2); color: var(--text-main); }
            
            .btn-export {
                display: flex;
                align-items: center;
                gap: 8px;
                background: transparent;
                border: 1px solid var(--neon-green);
                color: var(--neon-green);
                padding: 0.75rem 1.25rem;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .btn-export:hover {
                background: var(--neon-green);
                color: var(--bg-deep);
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    },

    renderLayout() {
        const container = document.querySelector('.container') || document.body;
        const section = document.createElement('section');
        section.className = 'leads-wrapper';
        section.innerHTML = `
            <div class="leads-header">
                <div class="panel-title" style="margin-bottom:0">Partner Lead Management</div>
                <button class="btn-export" id="btnExport">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Export to CSV
                </button>
            </div>
            
            <div class="leads-controls">
                <div class="search-input-wrapper">
                    <input type="text" id="leadsSearch" placeholder="Search by name, email, or tracking source...">
                </div>
            </div>

            <div class="leads-table-container">
                <table class="leads-table">
                    <thead>
                        <tr>
                            <th>Lead Name</th>
                            <th>Contact Info</th>
                            <th>Widget Type</th>
                            <th>Source Metadata</th>
                            <th>Captured At</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="leadsBody">
                        <!-- Rows injected here -->
                    </tbody>
                </table>
            </div>
        `;
        container.appendChild(section);
        this.renderRows(this.currentLeads);
    },

    renderRows(data) {
        const body = document.getElementById('leadsBody');
        if (data.length === 0) {
            body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 3rem; color: var(--text-dim);">No leads found matching your criteria.</td></tr>`;
            return;
        }

        body.innerHTML = data.map(lead => `
            <tr>
                <td style="font-weight:600">${lead.name}</td>
                <td style="color:var(--text-dim)">${lead.email}</td>
                <td>${lead.widget}</td>
                <td><span class="source-tag">${lead.source}</span></td>
                <td style="font-family:var(--font-mono); font-size: 0.8rem;">${lead.date}</td>
                <td><span class="status-badge status-${lead.status}">${lead.status}</span></td>
            </tr>
        `).join('');
    },

    bindEvents() {
        const searchInput = document.getElementById('leadsSearch');
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = LEADS_MOCK_DATA.filter(l => 
                l.name.toLowerCase().includes(term) || 
                l.email.toLowerCase().includes(term) || 
                l.source.toLowerCase().includes(term)
            );
            this.currentLeads = filtered;
            this.renderRows(filtered);
        });

        document.getElementById('btnExport').addEventListener('click', () => this.exportCSV());
    },

    exportCSV() {
        const headers = ["Name", "Email", "Widget", "Source", "Date", "Status"];
        const rows = this.currentLeads.map(l => [
            `"${l.name}"`,
            `"${l.email}"`,
            `"${l.widget}"`,
            `"${l.source}"`,
            `"${l.date}"`,
            `"${l.status}"`
        ].join(","));
        
        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute("href", url);
        link.setAttribute("download", `moonshine_leads_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (window.showToast) window.showToast("CSV Export Started");
    }
};

// Auto-initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LeadsManager.init());
} else {
    LeadsManager.init();
}