class LeadTracker {
    constructor() {
        this.leads = [
            { id: 1, name: "Alex Rivera", source: "Funding Readiness Score", status: "Funded", commission: "$1,250.00", date: "2023-10-12" },
            { id: 2, name: "Jordan Smith", source: "Funding Route Matcher", status: "In Review", commission: "$0.00", date: "2023-10-14" },
            { id: 3, name: "Sarah Chen", source: "Application CTA", status: "Approved", commission: "$850.00", date: "2023-10-15" },
            { id: 4, name: "Marcus Thorne", source: "Funding Readiness Score", status: "Declined", commission: "$0.00", date: "2023-10-16" },
            { id: 5, name: "Elena Gilbert", source: "Partner Profile Card", status: "Funded", commission: "$2,100.00", date: "2023-10-18" }
        ];
        this.initStyles();
    }

    initStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tracker-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(5, 7, 10, 0.9);
                backdrop-filter: blur(8px);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .tracker-modal {
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                width: 90%;
                max-width: 1000px;
                max-height: 80vh;
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                overflow: hidden;
            }
            .tracker-header {
                padding: 24px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .tracker-controls {
                padding: 16px 24px;
                background: rgba(255,255,255,0.02);
                display: flex;
                gap: 16px;
                border-bottom: 1px solid var(--border-color);
            }
            .tracker-search {
                flex: 1;
                background: var(--bg-input);
                border: 1px solid var(--border-color);
                padding: 10px 16px;
                border-radius: 6px;
                color: var(--text-main);
                font-family: inherit;
            }
            .tracker-filter {
                width: 200px;
                background: var(--bg-input);
                border: 1px solid var(--border-color);
                padding: 10px;
                border-radius: 6px;
                color: var(--text-main);
            }
            .tracker-content {
                flex: 1;
                overflow-y: auto;
                padding: 0;
            }
            .lead-table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
            }
            .lead-table th {
                position: sticky;
                top: 0;
                background: var(--bg-card);
                padding: 16px 24px;
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--text-dim);
                border-bottom: 1px solid var(--border-color);
            }
            .lead-table td {
                padding: 16px 24px;
                border-bottom: 1px solid var(--border-color);
                font-size: 0.9rem;
            }
            .lead-table tr:hover {
                background: rgba(255,255,255,0.02);
            }
            .badge {
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
            }
            .badge-funded { background: rgba(57, 255, 20, 0.1); color: var(--accent-green); }
            .badge-review { background: rgba(0, 242, 255, 0.1); color: var(--accent-blue); }
            .badge-declined { background: rgba(255, 50, 50, 0.1); color: #ff3232; }
            .badge-approved { background: rgba(255, 255, 255, 0.1); color: #fff; }
            
            .commission-val {
                font-family: 'JetBrains Mono', monospace;
                color: var(--accent-green);
                font-weight: 500;
            }
            .close-tracker {
                background: transparent;
                border: none;
                color: var(--text-dim);
                cursor: pointer;
                font-size: 1.5rem;
            }
            .close-tracker:hover { color: #fff; }
        `;
        document.head.appendChild(style);
    }

    render(containerId = 'config-start') {
        const overlay = document.createElement('div');
        overlay.className = 'tracker-overlay';
        overlay.id = 'leadTrackerModal';
        
        overlay.innerHTML = `
            <div class="tracker-modal">
                <div class="tracker-header">
                    <div>
                        <h2 style="margin:0; font-size: 1.5rem;">Lead & Application Tracker</h2>
                        <p style="color: var(--text-dim); font-size: 0.85rem; margin-top: 4px;">Track conversions and partner commissions in real-time.</p>
                    </div>
                    <button class="close-tracker" onclick="document.getElementById('leadTrackerModal').style.opacity='0'; setTimeout(()=>document.getElementById('leadTrackerModal').remove(), 300)">&times;</button>
                </div>
                <div class="tracker-controls">
                    <input type="text" class="tracker-search" placeholder="Search by lead name or ID..." id="leadSearch">
                    <select class="tracker-filter" id="statusFilter">
                        <option value="all">All Statuses</option>
                        <option value="Funded">Funded</option>
                        <option value="In Review">In Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
                    </select>
                </div>
                <div class="tracker-content">
                    <table class="lead-table">
                        <thead>
                            <tr>
                                <th>Lead Name</th>
                                <th>Source Widget</th>
                                <th>Status</th>
                                <th>Commission</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody id="leadTableBody">
                            ${this.generateRows(this.leads)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        
        // Trigger animation
        setTimeout(() => overlay.style.opacity = '1', 10);

        // Attach Events
        document.getElementById('leadSearch').addEventListener('input', (e) => this.filterLeads());
        document.getElementById('statusFilter').addEventListener('change', (e) => this.filterLeads());
    }

    generateRows(data) {
        if (data.length === 0) return `<tr><td colspan="5" style="text-align:center; color:var(--text-dim); padding: 40px;">No leads found matching your criteria.</td></tr>`;
        
        return data.map(lead => `
            <tr>
                <td style="font-weight: 600;">${lead.name}</td>
                <td style="color: var(--text-dim); font-size: 0.8rem;">${lead.source}</td>
                <td><span class="badge badge-${this.getStatusClass(lead.status)}">${lead.status}</span></td>
                <td class="commission-val">${lead.commission}</td>
                <td style="color: var(--text-dim); font-size: 0.8rem;">${lead.date}</td>
            </tr>
        `).join('');
    }

    getStatusClass(status) {
        const s = status.toLowerCase();
        if (s.includes('funded')) return 'funded';
        if (s.includes('review')) return 'review';
        if (s.includes('declined')) return 'declined';
        return 'approved';
    }

    filterLeads() {
        const searchTerm = document.getElementById('leadSearch').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        
        const filtered = this.leads.filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        document.getElementById('leadTableBody').innerHTML = this.generateRows(filtered);
    }
}

// Global function to trigger the tracker
window.openLeadTracker = () => {
    const tracker = new LeadTracker();
    tracker.render();
};