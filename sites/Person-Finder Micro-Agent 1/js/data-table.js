/**
 * js/data-table.js
 * Lead Repository: Centralized database view for identified personnel
 * Built for Person-Finder Micro-Agent v2.4
 */

const LeadRepository = (function() {
    // Mock Data Store
    const leads = [
        { id: 1, name: "Sarah Jenkins", role: "Operations Director", company: "Acme Corp", reliability: "High", source: "LinkedIn", email: "s.jenkins@acme.com", phone: "+1 (555) 102-3948" },
        { id: 2, name: "Marcus Thorne", role: "Founder", company: "Thorne Digital", reliability: "High", source: "SOS Registry", email: "marcus@thornedigital.io", phone: "+1 (555) 992-1102" },
        { id: 3, name: "Elena Rodriguez", role: "Finance Manager", company: "Nexus Logistics", reliability: "Medium", source: "Google Dorking", email: "e.rodriguez@nexus.log", phone: "+1 (555) 304-2291" },
        { id: 4, name: "David Chen", role: "Manager", company: "Chen & Sons", reliability: "Low", source: "Yelp/Chamber", email: "d.chen@gmail.com", phone: "+1 (555) 882-3301" },
        { id: 5, name: "Julian Vane", role: "Founder", company: "Vane Software", reliability: "High", source: "LinkedIn", email: "julian@vane.dev", phone: "+1 (555) 441-0092" },
        { id: 6, name: "Anita K. Smith", role: "Finance", company: "Global Fin", reliability: "Medium", source: "Company Website", email: "asmith@globalfin.com", phone: "+1 (555) 771-8821" },
        { id: 7, name: "Robert Fox", role: "Manager", company: "Fox Industrials", reliability: "High", source: "SOS Registry", email: "r.fox@fox-ind.com", phone: "+1 (555) 121-3434" }
    ];

    let state = {
        search: '',
        role: 'All',
        reliability: 'All'
    };

    const injectStyles = () => {
        if (document.getElementById('lead-repo-styles')) return;
        const style = document.createElement('style');
        style.id = 'lead-repo-styles';
        style.innerHTML = `
            .repo-wrapper {
                height: 100%;
                display: flex;
                flex-direction: column;
                background: var(--bg-card);
                color: var(--text-main);
                font-family: 'Inter', sans-serif;
            }
            .repo-header {
                padding: 20px 24px;
                border-bottom: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.01);
            }
            .repo-title-area h2 {
                font-size: 1.1rem;
                font-weight: 700;
                margin-bottom: 4px;
            }
            .repo-title-area p {
                font-size: 0.75rem;
                color: var(--text-dim);
            }
            .repo-controls {
                padding: 16px 24px;
                display: flex;
                gap: 12px;
                align-items: center;
                background: rgba(0, 0, 0, 0.1);
                border-bottom: 1px solid var(--border);
            }
            .repo-search {
                background: var(--input-bg);
                border: 1px solid var(--border);
                border-radius: 6px;
                padding: 8px 12px;
                color: white;
                font-size: 0.85rem;
                width: 240px;
            }
            .repo-select {
                background: var(--input-bg);
                border: 1px solid var(--border);
                border-radius: 6px;
                padding: 8px 12px;
                color: var(--text-main);
                font-size: 0.85rem;
                cursor: pointer;
            }
            .repo-table-container {
                flex-grow: 1;
                overflow-y: auto;
            }
            .repo-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.85rem;
            }
            .repo-table th {
                position: sticky;
                top: 0;
                background: var(--bg-card);
                padding: 12px 20px;
                text-align: left;
                font-size: 0.7rem;
                font-weight: 700;
                color: var(--text-dim);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                border-bottom: 1px solid var(--border);
                z-index: 10;
            }
            .repo-table td {
                padding: 14px 20px;
                border-bottom: 1px solid var(--border);
            }
            .repo-table tr:hover {
                background: rgba(59, 130, 246, 0.04);
            }
            .rel-badge {
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 0.7rem;
                font-family: 'JetBrains Mono', monospace;
                font-weight: 500;
            }
            .rel-High { background: rgba(16, 185, 129, 0.15); color: var(--accent); }
            .rel-Medium { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
            .rel-Low { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
            
            .btn-bulk-export {
                background: var(--primary);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .btn-bulk-export:hover { filter: brightness(1.1); }
            .mono-text { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-dim); }
        `;
        document.head.appendChild(style);
    };

    const filterData = () => {
        return leads.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(state.search.toLowerCase()) || 
                                 item.company.toLowerCase().includes(state.search.toLowerCase());
            const matchesRole = state.role === 'All' || item.role.includes(state.role);
            const matchesRel = state.reliability === 'All' || item.reliability === state.reliability;
            return matchesSearch && matchesRole && matchesRel;
        });
    };

    const renderTableRows = () => {
        const filtered = filterData();
        return filtered.map(lead => `
            <tr>
                <td style="font-weight: 600;">${lead.name}</td>
                <td><span style="color: var(--primary)">${lead.role}</span></td>
                <td>${lead.company}</td>
                <td><span class="rel-badge rel-${lead.reliability}">${lead.reliability}</span></td>
                <td class="mono-text">${lead.source}</td>
                <td class="mono-text">${lead.email}</td>
                <td>
                    <button style="background:transparent; border:1px solid var(--border); color:var(--text-dim); border-radius:4px; padding:4px 8px; font-size:0.7rem; cursor:pointer;">Push to CRM</button>
                </td>
            </tr>
        `).join('');
    };

    const updateView = () => {
        const tbody = document.getElementById('repo-tbody');
        if (tbody) tbody.innerHTML = renderTableRows();
    };

    const exportToCSV = () => {
        const filtered = filterData();
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Name,Role,Company,Reliability,Source,Email,Phone\n"
            + filtered.map(l => `${l.name},${l.role},${l.company},${l.reliability},${l.source},${l.email},${l.phone}`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "lead_repository_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        init: (containerElement) => {
            if (!containerElement) return;
            injectStyles();
            
            containerElement.innerHTML = `
                <div class="repo-wrapper">
                    <div class="repo-header">
                        <div class="repo-title-area">
                            <h2>Lead Repository</h2>
                            <p>Global database of verified decision makers and company contacts.</p>
                        </div>
                        <button class="btn-bulk-export" id="exportBtn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4m4-10l5 5 5-5m-5 5V3"/></svg>
                            Bulk Export
                        </button>
                    </div>

                    <div class="repo-controls">
                        <input type="text" class="repo-search" placeholder="Filter by name or company..." id="repoSearch">
                        <select class="repo-select" id="roleSelect">
                            <option value="All">All Roles</option>
                            <option value="Founder">Founders</option>
                            <option value="Finance">Finance</option>
                            <option value="Manager">Managers</option>
                        </select>
                        <select class="repo-select" id="relSelect">
                            <option value="All">Any Reliability</option>
                            <option value="High">High Confidence</option>
                            <option value="Medium">Medium Confidence</option>
                            <option value="Low">Low Confidence</option>
                        </select>
                    </div>

                    <div class="repo-table-container">
                        <table class="repo-table">
                            <thead>
                                <tr>
                                    <th>Personnel</th>
                                    <th>Role</th>
                                    <th>Organization</th>
                                    <th>Reliability</th>
                                    <th>Source</th>
                                    <th>Contact Detail</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="repo-tbody">
                                ${renderTableRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            // Event Listeners
            document.getElementById('repoSearch').addEventListener('input', (e) => {
                state.search = e.target.value;
                updateView();
            });

            document.getElementById('roleSelect').addEventListener('change', (e) => {
                state.role = e.target.value;
                updateView();
            });

            document.getElementById('relSelect').addEventListener('change', (e) => {
                state.reliability = e.target.value;
                updateView();
            });

            document.getElementById('exportBtn').addEventListener('click', exportToCSV);
        }
    };
})();

// To use this in the Main Workspace:
// LeadRepository.init(document.querySelector('.workspace'));