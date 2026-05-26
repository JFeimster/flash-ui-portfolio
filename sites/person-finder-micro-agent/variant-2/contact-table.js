const style = `
    :root {
        --bg-base: #050505;
        --bg-surface: #0d0d0d;
        --bg-card: #141414;
        --border-muted: #222222;
        --accent-primary: #00ff88;
        --accent-glow: rgba(0, 255, 136, 0.15);
        --text-main: #e0e0e0;
        --text-muted: #707070;
        --text-dim: #404040;
        --font-mono: 'JetBrains Mono', monospace;
        --font-sans: 'Inter', sans-serif;
    }

    .lead-directory {
        background: var(--bg-surface);
        border: 1px solid var(--border-muted);
        border-radius: 12px;
        color: var(--text-main);
        font-family: var(--font-sans);
        max-width: 1200px;
        margin: 40px auto;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .directory-header {
        padding: 32px;
        border-bottom: 1px solid var(--border-muted);
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        background: linear-gradient(to bottom, #0d0d0d, #080808);
    }

    .header-info h2 {
        font-size: 24px;
        font-weight: 600;
        letter-spacing: -0.02em;
        margin-bottom: 4px;
    }

    .header-info p {
        color: var(--text-muted);
        font-size: 14px;
    }

    .export-btn {
        background: transparent;
        border: 1px solid var(--accent-primary);
        color: var(--accent-primary);
        padding: 8px 16px;
        border-radius: 6px;
        font-family: var(--font-mono);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .export-btn:hover {
        background: var(--accent-glow);
        box-shadow: 0 0 15px var(--accent-glow);
    }

    .filter-bar {
        padding: 20px 32px;
        background: var(--bg-base);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        border-bottom: 1px solid var(--border-muted);
    }

    .filter-group label {
        display: block;
        font-family: var(--font-mono);
        font-size: 10px;
        color: var(--text-dim);
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    .filter-input {
        width: 100%;
        background: var(--bg-surface);
        border: 1px solid var(--border-muted);
        border-radius: 6px;
        padding: 10px 12px;
        color: #fff;
        font-size: 13px;
        outline: none;
    }

    .filter-input:focus {
        border-color: var(--accent-primary);
    }

    .table-container {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
        text-align: left;
    }

    th {
        font-family: var(--font-mono);
        font-size: 11px;
        text-transform: uppercase;
        color: var(--text-dim);
        padding: 16px 32px;
        border-bottom: 1px solid var(--border-muted);
        letter-spacing: 0.05em;
    }

    td {
        padding: 16px 32px;
        border-bottom: 1px solid var(--border-muted);
        color: var(--text-main);
    }

    tr:hover td {
        background: rgba(255,255,255,0.02);
    }

    .role-badge {
        font-family: var(--font-mono);
        font-size: 11px;
        background: #1a1a1a;
        padding: 2px 8px;
        border-radius: 4px;
        color: var(--text-muted);
    }

    .industry-tag {
        color: var(--accent-primary);
        font-size: 12px;
    }

    .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
        background: var(--accent-primary);
    }

    .empty-state {
        padding: 60px;
        text-align: center;
        color: var(--text-dim);
        font-family: var(--font-mono);
    }
`;

const INITIAL_DATA = [
    { name: 'Sarah Jenkins', role: 'Lead Designer', company: 'Aura Design Studio', location: 'Brooklyn, NY', industry: 'Interior Design', email: 's.jenkins@auradesign.io' },
    { name: 'Marcus Chen', role: 'Founder', company: 'Nexus Tech', location: 'Austin, TX', industry: 'SaaS', email: 'm.chen@nexustech.io' },
    { name: 'Elena Rodriguez', role: 'Managing Director', company: 'Veridian Group', location: 'Miami, FL', industry: 'Real Estate', email: 'elena@veridian.com' },
    { name: 'David Park', role: 'CEO', company: 'Spark Analytics', location: 'San Francisco, CA', industry: 'Data Science', email: 'dpark@spark.ai' },
    { name: 'Julian Thorne', role: 'Operations Manager', company: 'Iron & Oak', location: 'Portland, OR', industry: 'Manufacturing', email: 'j.thorne@ironoak.co' }
];

class ContactTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = [...INITIAL_DATA];
        this.filters = { industry: '', role: '', location: '' };
        
        this.init();
    }

    init() {
        this.injectStyles();
        this.render();
    }

    injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = style;
        document.head.appendChild(styleSheet);
    }

    handleFilter(key, value) {
        this.filters[key] = value.toLowerCase();
        this.renderTableBody();
    }

    getFilteredData() {
        return this.data.filter(item => {
            return (item.industry.toLowerCase().includes(this.filters.industry) &&
                    item.role.toLowerCase().includes(this.filters.role) &&
                    item.location.toLowerCase().includes(this.filters.location));
        });
    }

    exportCSV() {
        const filtered = this.getFilteredData();
        const headers = ['Name', 'Role', 'Company', 'Location', 'Industry', 'Email'];
        const rows = filtered.map(i => [i.name, i.role, i.company, i.location, i.industry, i.email].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "person_finder_leads.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    renderTableBody() {
        const tbody = this.container.querySelector('tbody');
        const filtered = this.getFilteredData();

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No matching leads found in repository.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center;">
                        <span class="status-dot"></span>
                        <div>
                            <div style="font-weight: 600;">${item.name}</div>
                            <div style="font-size: 11px; color: var(--text-dim);">${item.email}</div>
                        </div>
                    </div>
                </td>
                <td><span class="role-badge">${item.role}</span></td>
                <td>${item.company}</td>
                <td style="color: var(--text-muted)">${item.location}</td>
                <td><span class="industry-tag">${item.industry}</span></td>
            </tr>
        `).join('');
    }

    render() {
        this.container.innerHTML = `
            <div class="lead-directory">
                <header class="directory-header">
                    <div class="header-info">
                        <h2>Lead Repository</h2>
                        <p>Centralized database of contacts discovered via deep-scan agent.</p>
                    </div>
                    <button class="export-btn" id="exportBtn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        EXPORT CSV
                    </button>
                </header>

                <div class="filter-bar">
                    <div class="filter-group">
                        <label>Industry</label>
                        <input type="text" class="filter-input" placeholder="Filter industry..." id="filterIndustry">
                    </div>
                    <div class="filter-group">
                        <label>Role</label>
                        <input type="text" class="filter-input" placeholder="Founder, Director..." id="filterRole">
                    </div>
                    <div class="filter-group">
                        <label>Location</label>
                        <input type="text" class="filter-input" placeholder="City or State..." id="filterLocation">
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Contact Name</th>
                                <th>Role</th>
                                <th>Company</th>
                                <th>Location</th>
                                <th>Industry</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `;

        // Event Listeners
        this.container.querySelector('#filterIndustry').addEventListener('input', (e) => this.handleFilter('industry', e.target.value));
        this.container.querySelector('#filterRole').addEventListener('input', (e) => this.handleFilter('role', e.target.value));
        this.container.querySelector('#filterLocation').addEventListener('input', (e) => this.handleFilter('location', e.target.value));
        this.container.querySelector('#exportBtn').addEventListener('click', () => this.exportCSV());

        this.renderTableBody();
    }
}

// Initialize on load if container exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('lead-management-app')) {
        new ContactTable('lead-management-app');
    }
});