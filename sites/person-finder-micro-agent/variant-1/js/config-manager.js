const ConfigManager = {
    state: {
        sources: [
            { id: 'linkedin', name: 'LinkedIn Professional', enabled: true, icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
            { id: 'yelp', name: 'Yelp Local Business', enabled: true, icon: 'M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17h-2v-7h2v7zm0-8h-2v-2h2v2z' },
            { id: 'sos', name: 'Secretary of State', enabled: true, icon: 'M12 2l-10 4.47v2.53c0 5.53 3.84 10.74 10 12 6.16-1.26 10-6.47 10-12v-2.53l-10-4.47z' },
            { id: 'google', name: 'Google Dorking Engine', enabled: false, icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' }
        ],
        apiKeys: {
            google_search: '••••••••••••••••',
            hunter_io: '••••••••••••••••',
            pro_scraping: ''
        },
        keywords: ['Owner', 'Founder', 'President', 'Managing Director', 'Principal', 'CEO'],
        isConfigOpen: false
    },

    styles: `
        .config-overlay {
            position: absolute;
            inset: 0;
            background: var(--bg-card);
            z-index: 50;
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .config-header {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .config-body {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
        }

        .config-section-title {
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--text-dim);
            text-transform: uppercase;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .source-toggle-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .toggle-info { display: flex; align-items: center; gap: 12px; }
        .toggle-info svg { fill: var(--text-dim); width: 16px; }

        .switch {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 18px;
        }

        .switch input { opacity: 0; width: 0; height: 0; }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--border);
            transition: .3s;
            border-radius: 20px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 12px; width: 12px;
            left: 3px; bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }

        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(16px); }

        .config-input-group { margin-bottom: 16px; }
        .config-input-group label { display: block; font-size: 0.75rem; color: var(--text-dim); margin-bottom: 6px; }
        .config-input-group input, .config-input-group textarea {
            width: 100%;
            background: var(--input-bg);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 8px 10px;
            color: white;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
        }

        .keyword-tag-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            background: var(--input-bg);
            border: 1px solid var(--border);
            padding: 12px;
            border-radius: 6px;
        }

        .keyword-tag {
            background: rgba(59, 130, 246, 0.15);
            color: var(--primary);
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .btn-ghost {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-main);
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
        }

        .btn-save {
            background: var(--primary);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
        }
    `,

    init() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = this.styles;
        document.head.appendChild(styleSheet);
        this.injectSettingsButton();
    },

    injectSettingsButton() {
        const sidebar = document.querySelector('.sidebar');
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'btn-ghost';
        settingsBtn.style.marginTop = '10px';
        settingsBtn.style.width = '100%';
        settingsBtn.style.display = 'flex';
        settingsBtn.style.alignItems = 'center';
        settingsBtn.style.gap = '8px';
        settingsBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            Source Config
        `;
        settingsBtn.onclick = () => this.toggleConfig(true);
        sidebar.insertBefore(settingsBtn, sidebar.querySelector('.btn-start'));
    },

    toggleConfig(show) {
        if (show) {
            const mainPanel = document.querySelector('.main-panel');
            const overlay = document.createElement('div');
            overlay.className = 'config-overlay';
            overlay.id = 'config-manager-ui';
            overlay.innerHTML = this.render();
            mainPanel.appendChild(overlay);
        } else {
            document.getElementById('config-manager-ui')?.remove();
        }
    },

    render() {
        return `
            <div class="config-header">
                <div style="display:flex; align-items:center; gap:12px">
                    <span style="font-weight:700; font-size:1rem;">Agent Parameters</span>
                    <span class="step-badge">v2.4.0-STABLE</span>
                </div>
                <div style="display:flex; gap:10px">
                    <button class="btn-ghost" onclick="ConfigManager.toggleConfig(false)">Cancel</button>
                    <button class="btn-save" onclick="ConfigManager.toggleConfig(false)">Apply Changes</button>
                </div>
            </div>
            <div class="config-body">
                <div class="config-left">
                    <h3 class="config-section-title">Active Intelligence Sources</h3>
                    ${this.state.sources.map(s => `
                        <div class="source-toggle-card">
                            <div class="toggle-info">
                                <svg viewBox="0 0 24 24"><path d="${s.icon}"/></svg>
                                <span style="font-size:0.9rem">${s.name}</span>
                            </div>
                            <label class="switch">
                                <input type="checkbox" ${s.enabled ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    `).join('')}
                    
                    <div class="config-input-group" style="margin-top:24px">
                        <h3 class="config-section-title">Persona Keywords</h3>
                        <div class="keyword-tag-container">
                            ${this.state.keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('')}
                            <span style="color:var(--text-dim); font-size:0.75rem; padding: 2px 4px">+ Add New</span>
                        </div>
                    </div>
                </div>
                <div class="config-right">
                    <h3 class="config-section-title">Secure API Keys</h3>
                    <div class="config-input-group">
                        <label>Google Search Engine ID</label>
                        <input type="password" value="${this.state.apiKeys.google_search}">
                    </div>
                    <div class="config-input-group">
                        <label>Hunter.io (Email Verification)</label>
                        <input type="password" value="${this.state.apiKeys.hunter_io}">
                    </div>
                    <div class="config-input-group">
                        <label>Proxy Scraping Node</label>
                        <input type="text" placeholder="https://proxy.service:8080" value="${this.state.apiKeys.pro_scraping}">
                    </div>
                    <div class="config-input-group" style="margin-top:24px">
                        <h3 class="config-section-title">Search Pattern Override</h3>
                        <textarea rows="4" placeholder='[Business Name] + "at" + [Industry] + "owner"'></textarea>
                        <p style="font-size:0.65rem; color:var(--text-dim); margin-top:8px">Use liquid tags to define custom recursive search strings.</p>
                    </div>
                </div>
            </div>
        `;
    }
};

ConfigManager.init();