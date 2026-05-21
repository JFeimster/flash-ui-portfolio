/**
 * connection-manager.js
 * Carbon Kinetic | Integration & API Hub Controller
 */

(function() {
    const style = document.createElement('style');
    style.textContent = `
        .conn-manager-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: none;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .conn-manager-overlay.active {
            display: flex;
            opacity: 1;
        }

        .conn-card {
            background: var(--surface);
            border: 1px solid var(--border);
            width: 90%;
            max-width: 850px;
            max-height: 90vh;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 0 50px rgba(0,0,0,0.5), 0 0 20px var(--accent-soft);
        }

        .conn-header {
            padding: 24px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255,255,255,0.02);
        }

        .conn-header h2 {
            font-size: 16px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--accent);
        }

        .close-conn {
            background: transparent;
            border: none;
            color: var(--text-dim);
            cursor: pointer;
            font-size: 20px;
            transition: var(--transition);
        }

        .close-conn:hover { color: #fff; }

        .conn-body {
            padding: 24px;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .integration-tile {
            background: #000;
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            transition: var(--transition);
        }

        .integration-tile:hover {
            border-color: var(--accent-soft);
            background: #050505;
        }

        .tile-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .tile-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .tile-icon {
            width: 32px;
            height: 32px;
            filter: invert(1);
        }

        .tile-meta h3 {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
        }

        .tile-meta p {
            font-size: 11px;
            color: var(--text-dim);
        }

        .badge {
            font-size: 9px;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge.active { background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent-soft); }
        .badge.off { background: rgba(255,255,255,0.05); color: var(--text-dim); border: 1px solid var(--border); }

        .api-input-wrap {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .api-input-wrap label {
            font-size: 9px;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .api-input {
            background: #0a0a0a;
            border: 1px solid var(--border);
            padding: 8px 12px;
            border-radius: 4px;
            color: var(--accent);
            font-family: var(--font-mono);
            font-size: 11px;
            width: 100%;
        }

        .conn-footer {
            padding: 20px 24px;
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            background: rgba(255,255,255,0.01);
        }

        .btn-secondary {
            background: transparent;
            color: var(--text-dim);
            border: 1px solid var(--border);
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 600;
        }

        .btn-primary {
            background: var(--accent);
            color: #000;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
        }

        @media (max-width: 768px) {
            .conn-body { grid-template-columns: 1fr; }
        }
    `;
    document.head.appendChild(style);

    const connections = [
        { id: 'openai', name: 'OpenAI GPT-4o', desc: 'Core reasoning & lead personalization', icon: 'https://cdn.worldvectorlogo.com/logos/openai-2.svg', status: 'active', key: 'sk-••••7a2b' },
        { id: 'gemini', name: 'Google Gemini 1.5', desc: 'Multimodal research engine', icon: 'https://cdn.worldvectorlogo.com/logos/google-gemini-icon.svg', status: 'active', key: 'AIza••••99x0' },
        { id: 'notion', name: 'Notion API', desc: 'CRM database & lead storage', icon: 'https://cdn.worldvectorlogo.com/logos/notion-2.svg', status: 'active', key: 'secret_••••f81' },
        { id: 'gmail', name: 'Gmail Workspace', desc: 'SMTP & IMAP outreach delivery', icon: 'https://cdn.worldvectorlogo.com/logos/gmail-icon.svg', status: 'active', key: 'auth_token_ready' },
        { id: 'appsscript', name: 'Apps Script', desc: 'Custom workflow automation', icon: 'https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png', status: 'off', key: '' },
        { id: 'anthropic', name: 'Anthropic Claude', desc: 'Long-context research analysis', icon: 'https://cdn.worldvectorlogo.com/logos/anthropic-icon.svg', status: 'off', key: '' }
    ];

    const createHub = () => {
        const overlay = document.createElement('div');
        overlay.className = 'conn-manager-overlay';
        overlay.id = 'integrationHub';

        const tilesHTML = connections.map(conn => `
            <div class="integration-tile">
                <div class="tile-top">
                    <div class="tile-info">
                        <img src="${conn.icon}" class="tile-icon">
                        <div class="tile-meta">
                            <h3>${conn.name}</h3>
                            <p>${conn.desc}</p>
                        </div>
                    </div>
                    <span class="badge ${conn.status}">${conn.status === 'active' ? 'Connected' : 'Offline'}</span>
                </div>
                <div class="api-input-wrap">
                    <label>${conn.id === 'gmail' ? 'Auth Status' : 'API Key / Secret'}</label>
                    <input type="password" class="api-input" value="${conn.key}" placeholder="${conn.status === 'off' ? 'Enter key...' : ''}">
                </div>
            </div>
        `).join('');

        overlay.innerHTML = `
            <div class="conn-card">
                <div class="conn-header">
                    <h2>Integration & API Hub</h2>
                    <button class="close-conn" onclick="document.getElementById('integrationHub').classList.remove('active')">&times;</button>
                </div>
                <div class="conn-body">
                    ${tilesHTML}
                </div>
                <div class="conn-footer">
                    <button class="btn-secondary" onclick="document.getElementById('integrationHub').classList.remove('active')">Cancel</button>
                    <button class="btn-primary" onclick="alert('Configuration saved to encrypted storage.')">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    };

    const attachTrigger = () => {
        const intBar = document.querySelector('.integrations');
        if (intBar) {
            intBar.style.cursor = 'pointer';
            intBar.title = 'Click to manage integrations';
            intBar.addEventListener('click', () => {
                document.getElementById('integrationHub').classList.add('active');
            });
        }
    };

    // Initialize
    createHub();
    attachTrigger();

    // Export toggle for global use
    window.toggleIntegrationHub = () => {
        const hub = document.getElementById('integrationHub');
        hub.classList.toggle('active');
    };
})();