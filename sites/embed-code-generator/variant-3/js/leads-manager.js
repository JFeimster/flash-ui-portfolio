const MOCK_LEADS = [
    { id: 'L-9021', name: 'Alex Rivera', email: 'alex.r@venturestack.io', source: 'wix_site_header', score: 88, date: '2023-10-24 14:22', status: 'High' },
    { id: 'L-9022', name: 'Sarah Chen', email: 'chen.design@gmail.com', source: 'partner_portal', score: 42, date: '2023-10-24 15:45', status: 'Review' },
    { id: 'L-9023', name: 'Marcus Knight', email: 'm.knight@knightcorp.co', source: 'blog_footer_cta', score: 95, date: '2023-10-25 09:10', status: 'High' },
    { id: 'L-9024', name: 'Jordan Smyth', email: 'jordan@smythdigital.com', source: 'wix_site_header', score: 12, date: '2023-10-25 11:30', status: 'Low' },
    { id: 'L-9025', name: 'Elena Rodriguez', email: 'elena@fintech-ops.net', source: 'email_campaign_v2', score: 76, date: '2023-10-26 16:05', status: 'High' }
];

class LeadsManager {
    constructor() {
        this.leads = [...MOCK_LEADS];
        this.filteredLeads = [...MOCK_LEADS];
        this.tableBody = document.getElementById('leadsTableBody');
        this.searchInput = document.getElementById('leadSearch');
        this.sourceFilter = document.getElementById('filterSource');
        this.exportBtn = document.getElementById('exportLeadsBtn');
        
        this.init();
    }

    init() {
        if (!this.tableBody) return;
        this.renderLeads();
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.filterLeads(e.target.value, this.sourceFilter.value));
        }
        if (this.sourceFilter) {
            this.sourceFilter.addEventListener('change', (e) => this.filterLeads(this.searchInput.value, e.target.value));
        }
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => this.exportToCSV());
        }
    }

    filterLeads(searchTerm, source) {
        const query = searchTerm.toLowerCase();
        this.filteredLeads = this.leads.filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(query) || lead.email.toLowerCase().includes(query);
            const matchesSource = source === 'all' || lead.source === source;
            return matchesSearch && matchesSource;
        });
        this.renderLeads();
    }

    getStatusColor(status) {
        switch(status.toLowerCase()) {
            case 'high': return '#39ff14';
            case 'review': return '#ffbd2e';
            case 'low': return '#ff5f56';
            default: return 'var(--text-muted)';
        }
    }

    updateStats() {
        const avgScore = Math.round(this.leads.reduce((acc, curr) => acc + curr.score, 0) / this.leads.length);
        const statsContainer = document.getElementById('leadStats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="label">Total Leads</span>
                    <span class="value">${this.leads.length}</span>
                </div>
                <div class="stat-item">
                    <span class="label">Avg Readiness</span>
                    <span class="value" style="color: var(--neon-blue)">${avgScore}%</span>
                </div>
            `;
        }
    }

    renderLeads() {
        if (!this.tableBody) return;
        
        if (this.filteredLeads.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-muted);">No leads matching your criteria.</td></tr>`;
            return;
        }

        this.tableBody.innerHTML = this.filteredLeads.map(lead => `
            <tr class="animate" style="border-bottom: 1px solid var(--border); transition: var(--transition);">
                <td style="padding: 1rem; font-family: 'JetBrains Mono'; font-size: 0.8rem; color: var(--text-muted);">${lead.id}</td>
                <td style="padding: 1rem;">
                    <div style="font-weight: 600;">${lead.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${lead.email}</div>
                </td>
                <td style="padding: 1rem;"><span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid var(--border);">${lead.source}</span></td>
                <td style="padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="flex: 1; height: 4px; background: var(--bg-deep); border-radius: 2px; width: 60px;">
                            <div style="width: ${lead.score}%; height: 100%; background: ${this.getStatusColor(lead.status)}; border-radius: 2px;"></div>
                        </div>
                        <span style="font-size: 0.8rem; font-weight: 600;">${lead.score}</span>
                    </div>
                </td>
                <td style="padding: 1rem; font-size: 0.8rem; color: var(--text-secondary);">${lead.date}</td>
                <td style="padding: 1rem; text-align: right;">
                    <button onclick="console.log('Viewing lead ${lead.id}')" style="background: transparent; border: 1px solid var(--border-bright); color: var(--text-primary); padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.7rem;">Details</button>
                </td>
            </tr>
        `).join('');
    }

    exportToCSV() {
        const headers = ['ID', 'Name', 'Email', 'Source', 'Score', 'Status', 'Date'];
        const rows = this.filteredLeads.map(l => [l.id, l.name, l.email, l.source, l.score, l.status, l.date]);
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `moonshine_leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Global Styles Injection for the Manager UI components
const style = document.createElement('style');
style.textContent = `
    .stat-item { background: var(--bg-surface); border: 1px solid var(--border); padding: 1rem; border-radius: 8px; flex: 1; }
    .stat-item .label { display: block; font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem; }
    .stat-item .value { font-size: 1.5rem; font-weight: 700; font-family: 'JetBrains Mono'; }
    #leadsTableBody tr:hover { background: rgba(255,255,255,0.02); }
`;
document.head.appendChild(style);

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.msLeadsManager = new LeadsManager();
});