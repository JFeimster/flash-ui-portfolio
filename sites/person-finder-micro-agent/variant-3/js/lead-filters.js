/**
 * Prism Scan | Lead Management Vault
 * Logic for filtering, tagging, and visualizing identified contacts.
 */

const LeadVault = (() => {
    let leads = [
        { id: 1, name: "Sarah Jenkins", role: "Director of Operations", company: "Acme Dynamics", industry: "Logistics", location: "Austin, TX", source: "LinkedIn", priority: "High", timestamp: "2023-10-24" },
        { id: 2, name: "Marcus Thorne", role: "Chief Architect", company: "Nexus Tech", industry: "SaaS", location: "San Francisco, CA", source: "SOS Registry", priority: "Medium", timestamp: "2023-10-25" },
        { id: 3, name: "Elena Rodriguez", role: "VP of Sales", company: "Global Flux", industry: "Finance", location: "New York, NY", source: "Team Directory", priority: "Critical", timestamp: "2023-10-26" },
        { id: 4, name: "David Chen", role: "Founding Partner", company: "Summit Ventures", industry: "Finance", location: "Austin, TX", source: "LinkedIn", priority: "Low", timestamp: "2023-10-26" }
    ];

    let activeFilter = {
        industry: 'All',
        geography: 'All'
    };

    const styles = `
        .vault-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(5, 7, 10, 0.95);
            z-index: 1000;
            display: none;
            padding: 40px;
            overflow-y: auto;
        }

        .vault-container {
            max-width: 1100px;
            margin: 0 auto;
        }

        .vault-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 32px;
            border-bottom: 1px solid rgba(0, 242, 255, 0.2);
            padding-bottom: 20px;
        }

        .vault-title h2 {
            font-family: 'JetBrains Mono', monospace;
            color: var(--accent-cyan);
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 4px;
        }

        .filter-bar {
            display: flex;
            gap: 20px;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .vault-select {
            background: #0f141c;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-main);
            padding: 8px 12px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            outline: none;
        }

        .lead-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
        }

        .lead-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 20px;
            position: relative;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .lead-card:hover {
            border-color: var(--accent-magenta);
            transform: translateY(-2px);
        }

        .lead-priority {
            position: absolute;
            top: 10px;
            right: 10px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 9px;
            padding: 2px 6px;
            border: 1px solid;
            text-transform: uppercase;
        }

        .prio-High { color: var(--accent-magenta); border-color: var(--accent-magenta); }
        .prio-Medium { color: var(--accent-cyan); border-color: var(--accent-cyan); }
        .prio-Low { color: var(--text-dim); border-color: var(--text-dim); }
        .prio-Critical { color: var(--accent-lime); border-color: var(--accent-lime); }

        .lead-name {
            display: block;
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 4px;
        }

        .lead-meta {
            font-size: 12px;
            color: var(--text-dim);
            margin-bottom: 12px;
            display: block;
        }

        .lead-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 16px;
        }

        .tag {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            padding: 3px 8px;
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-main);
        }

        .tag.source {
            color: var(--accent-cyan);
            border-left: 2px solid var(--accent-cyan);
        }

        .close-vault {
            position: fixed;
            top: 20px;
            right: 20px;
            background: none;
            border: 1px solid var(--text-dim);
            color: var(--text-dim);
            cursor: pointer;
            padding: 5px 10px;
            font-family: 'JetBrains Mono', monospace;
        }

        .close-vault:hover {
            color: white;
            border-color: white;
        }
    `;

    function injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    function init() {
        injectStyles();
        createUI();
    }

    function createUI() {
        const overlay = document.createElement('div');
        overlay.id = 'vaultOverlay';
        overlay.className = 'vault-overlay';
        
        overlay.innerHTML = `
            <button class="close-vault" onclick="LeadVault.toggle(false)">ESC // CLOSE</button>
            <div class="vault-container">
                <header class="vault-header">
                    <div class="vault-title">
                        <h2>Lead Management Vault</h2>
                        <span style="font-family:'JetBrains Mono'; font-size: 11px; color: var(--text-dim);">Centralized Intel Repository</span>
                    </div>
                    <div class="filter-bar">
                        <div class="filter-group">
                            <label class="panel-label">Industry</label>
                            <select class="vault-select" id="filterIndustry" onchange="LeadVault.updateFilters()">
                                <option>All</option>
                                <option>Logistics</option>
                                <option>SaaS</option>
                                <option>Finance</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="panel-label">Geography</label>
                            <select class="vault-select" id="filterGeo" onchange="LeadVault.updateFilters()">
                                <option>All</option>
                                <option>Austin, TX</option>
                                <option>San Francisco, CA</option>
                                <option>New York, NY</option>
                            </select>
                        </div>
                    </div>
                </header>
                <div class="lead-grid" id="leadGrid"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        renderLeads();
    }

    function renderLeads() {
        const grid = document.getElementById('leadGrid');
        const filtered = leads.filter(l => {
            const indMatch = activeFilter.industry === 'All' || l.industry === activeFilter.industry;
            const geoMatch = activeFilter.geography === 'All' || l.location === activeFilter.geography;
            return indMatch && geoMatch;
        });

        grid.innerHTML = filtered.map(lead => `
            <div class="lead-card">
                <span class="lead-priority prio-${lead.priority}">${lead.priority}</span>
                <span class="lead-name">${lead.name}</span>
                <span class="lead-meta">${lead.role} @ ${lead.company}</span>
                <div class="lead-tags">
                    <span class="tag">${lead.industry}</span>
                    <span class="tag">${lead.location}</span>
                    <span class="tag source">SRC: ${lead.source}</span>
                </div>
            </div>
        `).join('');
    }

    function updateFilters() {
        activeFilter.industry = document.getElementById('filterIndustry').value;
        activeFilter.geography = document.getElementById('filterGeo').value;
        renderLeads();
    }

    function toggle(show) {
        document.getElementById('vaultOverlay').style.display = show ? 'block' : 'none';
    }

    function addLead(newLead) {
        leads.unshift({...newLead, id: Date.now()});
        renderLeads();
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', init);

    return {
        toggle,
        updateFilters,
        addLead
    };
})();

// Attach to global for button access
window.LeadVault = LeadVault;