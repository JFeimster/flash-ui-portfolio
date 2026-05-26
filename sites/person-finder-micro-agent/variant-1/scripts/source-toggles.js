/**
 * scripts/source-toggles.js
 * Logic for configuring search sources and priorities
 */

(function() {
    const style = document.createElement('style');
    style.textContent = `
        .settings-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 12, 16, 0.95);
            backdrop-filter: blur(8px);
            z-index: 100;
            display: none;
            padding: 40px;
            animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .settings-content {
            max-width: 600px;
            margin: 0 auto;
        }

        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 16px;
        }

        .source-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 32px;
        }

        .source-toggle-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--input-bg);
            border: 1px solid var(--border);
            padding: 12px 16px;
            border-radius: 8px;
            transition: border-color 0.2s;
        }

        .source-toggle-item:hover {
            border-color: var(--primary);
        }

        .toggle-info {
            display: flex;
            flex-direction: column;
        }

        .toggle-name {
            font-size: 0.9rem;
            font-weight: 600;
        }

        .toggle-meta {
            font-size: 0.75rem;
            color: var(--text-dim);
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 36px;
            height: 20px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #334155;
            transition: .4s;
            border-radius: 20px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: var(--primary);
        }

        input:checked + .slider:before {
            transform: translateX(16px);
        }

        .dork-section {
            margin-top: 24px;
        }

        .dork-input-wrapper {
            background: #000;
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            display: flex;
            gap: 8px;
        }

        .dork-input-wrapper input {
            background: transparent;
            border: none;
            color: var(--accent);
            flex-grow: 1;
            outline: none;
        }

        .btn-ghost {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-dim);
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.8rem;
        }

        .btn-ghost:hover {
            color: white;
            border-color: white;
        }

        .config-trigger {
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--border);
            color: var(--text-dim);
            padding: 10px;
            border-radius: 6px;
            margin-top: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 0.8rem;
            font-weight: 500;
            transition: all 0.2s;
        }

        .config-trigger:hover {
            background: rgba(255,255,255,0.1);
            color: white;
        }
    `;
    document.head.appendChild(style);

    const sources = [
        { id: 'domain', name: 'Domain Analysis', desc: 'Whois & Meta-Headers', active: true },
        { id: 'hierarchy', name: 'Team Hierarchy', desc: 'Web Scraping /About', active: true },
        { id: 'linkedin', name: 'LinkedIn API', desc: 'Company Insight Filters', active: true },
        { id: 'google', name: 'Recursive Google', desc: 'Advanced Dorking Logic', active: true },
        { id: 'sos', name: 'Secretary of State', desc: 'Official Business Registry', active: true },
        { id: 'local', name: 'Local Intelligence', desc: 'Directories & BBB', active: true }
    ];

    function init() {
        const sidebar = document.querySelector('.sidebar');
        const container = document.querySelector('.agent-container');

        // Add Configuration button to sidebar
        const configBtn = document.createElement('button');
        configBtn.className = 'config-trigger';
        configBtn.innerHTML = `
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Source Configuration
        `;
        
        // Insert before the start button
        const startBtn = document.querySelector('.btn-start');
        sidebar.insertBefore(configBtn, startBtn);

        // Create Overlay
        const overlay = document.createElement('div');
        overlay.className = 'settings-overlay';
        overlay.innerHTML = `
            <div class="settings-content">
                <div class="settings-header">
                    <h2 style="font-size: 1.25rem;">Search Logic Configuration</h2>
                    <button class="btn-ghost close-settings">Esc to Close</button>
                </div>
                
                <div class="source-grid">
                    ${sources.map(s => `
                        <div class="source-toggle-item">
                            <div class="toggle-info">
                                <span class="toggle-name">${s.name}</span>
                                <span class="toggle-meta">${s.desc}</span>
                            </div>
                            <label class="switch">
                                <input type="checkbox" ${s.active ? 'checked' : ''} data-id="${s.id}">
                                <span class="slider"></span>
                            </label>
                        </div>
                    `).join('')}
                </div>

                <div class="dork-section">
                    <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; display: block; margin-bottom: 8px;">
                        Custom Search Dork (Recursive Add-on)
                    </label>
                    <div class="dork-input-wrapper">
                        <span>></span>
                        <input type="text" placeholder='site:linkedin.com "CEO" "Acme"'>
                    </div>
                    <p style="font-size: 0.7rem; color: var(--text-dim); margin-top: 8px;">
                        Custom dorks are prioritized and executed during Step 04 (Google Recursive Search).
                    </p>
                </div>

                <div style="margin-top: 40px; display: flex; gap: 12px;">
                    <button class="btn-start close-settings" style="flex-grow: 1; margin-top: 0;">Apply & Save Changes</button>
                </div>
            </div>
        `;
        container.appendChild(overlay);

        // Event Listeners
        configBtn.addEventListener('click', () => {
            overlay.style.display = 'block';
        });

        overlay.querySelectorAll('.close-settings').forEach(btn => {
            btn.addEventListener('click', () => {
                overlay.style.display = 'none';
                updateSequenceList();
            });
        });

        // Handle toggles
        overlay.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const source = sources.find(s => s.id === id);
                if (source) source.active = e.target.checked;
            });
        });
    }

    function updateSequenceList() {
        const listItems = document.querySelectorAll('.sequence-item');
        sources.forEach((s, index) => {
            const item = listItems[index];
            if (item) {
                if (!s.active) {
                    item.style.opacity = '0.3';
                    item.style.filter = 'grayscale(1)';
                    const badge = item.querySelector('.step-badge');
                    if (badge) badge.textContent = 'Disabled';
                } else {
                    item.style.opacity = '1';
                    item.style.filter = 'none';
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();