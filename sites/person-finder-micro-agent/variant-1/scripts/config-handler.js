/**
 * scripts/config-handler.js
 * Logic for managing Search Sources and Custom Logic Configuration
 */

const SearchConfig = {
    sources: [
        { id: 'domain', name: 'Domain Analysis', description: 'Parse headers & meta-tags', active: true },
        { id: 'hierarchy', name: 'Team Hierarchy', description: 'Scrape /about and /team pages', active: true },
        { id: 'linkedin', name: 'LinkedIn Insight', description: 'Cross-reference via Sales Nav', active: true },
        { id: 'google', name: 'Google Recursive', description: 'Advanced search operators', active: true },
        { id: 'sos', name: 'Secretary of State', description: 'Business registry lookup', active: true },
        { id: 'local', name: 'Local Intelligence', description: 'BBB, Yelp, and Directories', active: true }
    ],
    customDorks: [
        'site:linkedin.com/in "at {company}"',
        '"{company}" owner filetype:pdf'
    ],

    init() {
        this.injectStyles();
        this.addSettingsToggle();
        this.loadSettings();
        this.setupEventListeners();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .settings-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,0.85);
                backdrop-filter: blur(8px);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                padding: 40px;
            }
            .settings-modal {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 12px;
                width: 100%;
                max-width: 500px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            }
            .settings-header {
                padding: 18px 24px;
                border-bottom: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255,255,255,0.02);
            }
            .settings-body {
                padding: 24px;
                overflow-y: auto;
                max-height: 60vh;
            }
            .source-toggle-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: rgba(255,255,255,0.03);
                border: 1px solid var(--border);
                border-radius: 8px;
                margin-bottom: 8px;
                transition: border-color 0.2s;
            }
            .source-toggle-item:hover {
                border-color: var(--primary);
            }
            .toggle-switch {
                position: relative;
                width: 36px;
                height: 18px;
                background: #1f242d;
                border-radius: 20px;
                cursor: pointer;
                transition: background 0.3s;
                border: 1px solid var(--border);
            }
            .toggle-switch.active {
                background: var(--primary);
                border-color: var(--primary);
            }
            .toggle-switch::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                transition: transform 0.2s;
            }
            .toggle-switch.active::after {
                transform: translateX(18px);
            }
            .dork-tag {
                background: var(--input-bg);
                border: 1px solid var(--border);
                padding: 8px 12px;
                border-radius: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.7rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: var(--text-dim);
                margin-bottom: 6px;
            }
            .btn-close-settings {
                background: transparent;
                border: none;
                color: var(--text-dim);
                cursor: pointer;
                display: flex;
                align-items: center;
            }
            .settings-trigger {
                cursor: pointer;
                color: var(--text-dim);
                transition: color 0.2s;
                display: flex;
                align-items: center;
                margin-left: auto;
            }
            .settings-trigger:hover {
                color: var(--primary);
            }
            .section-label {
                font-size: 0.7rem;
                font-weight: 700;
                color: var(--text-dim);
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin: 20px 0 10px 0;
            }
        `;
        document.head.appendChild(style);
    },

    addSettingsToggle() {
        const headerBrand = document.querySelector('.header-brand');
        if (headerBrand) {
            const trigger = document.createElement('div');
            trigger.className = 'settings-trigger';
            trigger.title = "Configure Search Logic";
            trigger.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            `;
            trigger.onclick = () => this.toggleModal(true);
            headerBrand.appendChild(trigger);
            
            const overlay = document.createElement('div');
            overlay.className = 'settings-overlay';
            overlay.id = 'config-modal';
            overlay.innerHTML = `
                <div class="settings-modal">
                    <div class="settings-header">
                        <div style="font-weight:700; font-size:0.9rem">ENGINE CONFIGURATION</div>
                        <button class="btn-close-settings" id="close-config">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="settings-body">
                        <div class="section-label" style="margin-top:0">Search Modules</div>
                        <div id="sources-list"></div>
                        
                        <div class="section-label">Custom Search Logic</div>
                        <div id="dorks-list"></div>
                        <input type="text" id="new-dork" placeholder="Add custom operator (e.g. site:twitter.com)..." 
                            style="width:100%; background:var(--input-bg); border:1px solid var(--border); padding:10px; border-radius:6px; color:white; font-size:0.8rem; margin-top:8px; outline:none;">
                    </div>
                    <div style="padding: 16px 24px; border-top: 1px solid var(--border); background: rgba(0,0,0,0.2); display: flex; justify-content: flex-end;">
                        <button id="save-config" style="background:var(--primary); color:white; border:none; padding: 8px 24px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.85rem; box-shadow: 0 4px 10px var(--primary-glow)">Apply Changes</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    },

    setupEventListeners() {
        document.getElementById('close-config').onclick = () => this.toggleModal(false);
        document.getElementById('save-config').onclick = () => this.saveSettings();
        document.getElementById('new-dork').onkeypress = (e) => {
            if(e.key === 'Enter' && e.target.value.trim()) {
                this.customDorks.push(e.target.value.trim());
                e.target.value = '';
                this.renderDorks();
            }
        };
        window.onclick = (e) => {
            const modal = document.getElementById('config-modal');
            if (e.target === modal) this.toggleModal(false);
        };
    },

    toggleModal(show) {
        const modal = document.getElementById('config-modal');
        modal.style.display = show ? 'flex' : 'none';
        if(show) {
            this.renderSources();
            this.renderDorks();
        }
    },

    renderSources() {
        const container = document.getElementById('sources-list');
        container.innerHTML = this.sources.map(source => `
            <div class="source-toggle-item">
                <div>
                    <div style="font-size:0.8rem; font-weight:600;">${source.name}</div>
                    <div style="font-size:0.7rem; color:var(--text-dim);">${source.description}</div>
                </div>
                <div class="toggle-switch ${source.active ? 'active' : ''}" onclick="SearchConfig.toggleSource('${source.id}')"></div>
            </div>
        `).join('');
    },

    renderDorks() {
        const container = document.getElementById('dorks-list');
        container.innerHTML = this.customDorks.map((dork, i) => `
            <div class="dork-tag">
                <span>${dork}</span>
                <span style="cursor:pointer; color:var(--primary); font-size:1.1rem; padding-left:10px;" onclick="SearchConfig.removeDork(${i})">&times;</span>
            </div>
        `).join('');
    },

    toggleSource(id) {
        const source = this.sources.find(s => s.id === id);
        if (source) source.active = !source.active;
        this.renderSources();
    },

    removeDork(index) {
        this.customDorks.splice(index, 1);
        this.renderDorks();
    },

    saveSettings() {
        localStorage.setItem('finder_config_v2', JSON.stringify({
            sources: this.sources,
            dorks: this.customDorks
        }));
        this.toggleModal(false);
        
        // Visual feedback in terminal
        const terminal = document.querySelector('.log-terminal');
        if (terminal) {
            const line = document.createElement('div');
            line.className = 'log-line';
            line.style.color = 'var(--primary)';
            line.innerHTML = `> CONFIG UPDATED: ${this.sources.filter(s => s.active).length} modules online.`;
            terminal.prepend(line);
        }
    },

    loadSettings() {
        const saved = localStorage.getItem('finder_config_v2');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.sources = parsed.sources;
            this.customDorks = parsed.dorks;
        }
    }
};

SearchConfig.init();