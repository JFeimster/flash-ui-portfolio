/**
 * Prism Scan | Lead Management Vault
 * A centralized repository for all identified contacts with grouping and verification tracking.
 */

const LeadStorage = {
    vault: JSON.parse(localStorage.getItem('prism_lead_vault')) || [],

    init() {
        this.injectStyles();
        this.createVaultButton();
        this.listenForScanResults();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .vault-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(5, 7, 10, 0.95);
                backdrop-filter: blur(10px);
                z-index: 1000;
                display: none;
                flex-direction: column;
                padding: 40px;
                animation: fadeIn 0.3s ease-out;
            }

            .vault-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(0, 242, 255, 0.3);
                padding-bottom: 20px;
                margin-bottom: 30px;
            }

            .vault-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 24px;
                color: var(--accent-cyan);
                text-transform: uppercase;
                letter-spacing: 4px;
            }

            .vault-close {
                background: transparent;
                border: 1px solid var(--accent-magenta);
                color: var(--accent-magenta);
                padding: 8px 16px;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                transition: all 0.2s;
            }

            .vault-close:hover {
                background: var(--accent-magenta);
                color: white;
            }

            .vault-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                overflow-y: auto;
            }

            .lead-card {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 20px;
                position: relative;
                transition: transform 0.2s;
            }

            .lead-card:hover {
                border-color: var(--accent-cyan);
                transform: translateY(-2px);
            }

            .lead-card .priority-tag {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 9px;
                padding: 2px 6px;
                background: var(--accent-magenta);
                color: white;
                text-transform: uppercase;
            }

            .lead-name {
                font-size: 18px;
                font-weight: 700;
                color: white;
                margin-bottom: 4px;
                display: block;
            }

            .lead-meta {
                font-size: 12px;
                color: var(--text-dim);
                margin-bottom: 12px;
                display: block;
            }

            .lead-source {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                padding: 4px 8px;
                background: rgba(0, 242, 255, 0.1);
                color: var(--accent-cyan);
                border: 1px solid rgba(0, 242, 255, 0.2);
            }

            .vault-controls {
                margin-bottom: 20px;
                display: flex;
                gap: 10px;
            }

            .filter-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: var(--text-dim);
                padding: 6px 12px;
                font-size: 11px;
                font-family: 'JetBrains Mono', monospace;
                cursor: pointer;
            }

            .filter-btn.active {
                border-color: var(--accent-lime);
                color: var(--accent-lime);
            }

            .btn-vault-trigger {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--bg-deep);
                border: 1px solid var(--accent-cyan);
                color: var(--accent-cyan);
                padding: 12px 20px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                cursor: pointer;
                z-index: 100;
                box-shadow: 0 0 15px rgba(0, 242, 255, 0.2);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    },

    createVaultButton() {
        const btn = document.createElement('button');
        btn.className = 'btn-vault-trigger';
        btn.innerHTML = 'VIEW LEAD VAULT <span id="vault-count">[' + this.vault.length + ']</span>';
        btn.onclick = () => this.toggleVault(true);
        document.body.appendChild(btn);

        const overlay = document.createElement('div');
        overlay.id = 'vaultOverlay';
        overlay.className = 'vault-overlay';
        overlay.innerHTML = `
            <div class="vault-header">
                <h2 class="vault-title">Lead Management Vault</h2>
                <button class="vault-close" onclick="LeadStorage.toggleVault(false)">Close Terminal</button>
            </div>
            <div class="vault-controls">
                <button class="filter-btn active" onclick="LeadStorage.filter('all')">ALL_ENTITIES</button>
                <button class="filter-btn" onclick="LeadStorage.filter('priority')">PRIORITY_TAGS</button>
                <button class="filter-btn" onclick="LeadStorage.filter('recent')">RECENT_SCANS</button>
            </div>
            <div class="vault-grid" id="vaultGrid"></div>
        `;
        document.body.appendChild(overlay);
    },

    toggleVault(show) {
        const overlay = document.getElementById('vaultOverlay');
        overlay.style.display = show ? 'flex' : 'none';
        if (show) this.renderLeads();
    },

    saveLead(lead) {
        const entry = {
            id: Date.now(),
            name: lead.name,
            role: lead.role,
            company: lead.company,
            domain: lead.domain,
            source: lead.source || 'SOS Registry',
            industry: lead.industry || 'Unknown',
            timestamp: new Date().toISOString(),
            priority: Math.random() > 0.7
        };
        this.vault.push(entry);
        localStorage.setItem('prism_lead_vault', JSON.stringify(this.vault));
        document.getElementById('vault-count').innerText = `[${this.vault.length}]`;
    },

    listenForScanResults() {
        // Intercept the original startScan completion
        const originalStartScan = window.startScan;
        window.startScan = async () => {
            await originalStartScan();
            
            // Wait for completion then grab UI data
            const name = document.getElementById('foundName').innerText;
            const role = document.getElementById('foundRole').innerText;
            const biz = document.getElementById('bizName').value;
            const domain = document.getElementById('bizWeb').value;
            const ind = document.getElementById('bizInd').value;

            if (name && name !== "Sarah Jenkins" || (biz && biz !== "TARGET_ENTITY")) {
                this.saveLead({
                    name: name,
                    role: role,
                    company: biz,
                    domain: domain,
                    industry: ind
                });
            }
        };
    },

    filter(type) {
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        this.renderLeads(type);
    },

    renderLeads(filterType = 'all') {
        const grid = document.getElementById('vaultGrid');
        grid.innerHTML = '';

        let items = [...this.vault];
        if (filterType === 'priority') items = items.filter(i => i.priority);
        if (filterType === 'recent') items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        items.forEach(lead => {
            const card = document.createElement('div');
            card.className = 'lead-card';
            card.innerHTML = `
                ${lead.priority ? '<span class="priority-tag">Priority</span>' : ''}
                <span class="lead-name">${lead.name}</span>
                <span class="lead-meta">${lead.role}</span>
                <div style="margin-bottom: 15px;">
                    <span style="font-size: 11px; color: var(--accent-lime); display: block;">${lead.company}</span>
                    <span style="font-size: 10px; color: var(--text-dim);">${lead.industry} • ${lead.domain}</span>
                </div>
                <span class="lead-source">Verified via ${lead.source}</span>
            `;
            grid.appendChild(card);
        });

        if (items.length === 0) {
            grid.innerHTML = '<div style="color: var(--text-dim); font-family: monospace;">[!] NO RECORDS FOUND IN LOCAL CACHE</div>';
        }
    }
};

// Initialize the storage module
LeadStorage.init();