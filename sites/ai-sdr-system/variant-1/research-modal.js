/**
 * Carbon Kinetic | Research Lab Modal
 * Part of Lead Discovery & Research Lab Interface
 */

(function() {
    const styles = `
        .ck-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: 'Inter', sans-serif;
        }

        .ck-modal-container {
            width: 90%;
            max-width: 1000px;
            height: 80vh;
            background: #0d0d0d;
            border: 1px solid #222;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 242, 255, 0.1);
            transform: scale(0.95);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ck-modal-overlay.active { opacity: 1; }
        .ck-modal-overlay.active .ck-modal-container { transform: scale(1); }

        .ck-modal-header {
            padding: 20px 30px;
            border-bottom: 1px solid #222;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #050505;
        }

        .ck-header-title {
            display: flex;
            flex-direction: column;
        }

        .ck-header-title h2 {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #00f2ff;
            margin: 0;
        }

        .ck-header-title span {
            font-size: 11px;
            color: #777;
            margin-top: 4px;
        }

        .ck-close-btn {
            background: transparent;
            border: 1px solid #333;
            color: #777;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }

        .ck-close-btn:hover {
            color: #fff;
            border-color: #555;
            background: rgba(255,255,255,0.05);
        }

        .ck-modal-body {
            flex: 1;
            display: grid;
            grid-template-columns: 380px 1fr;
            overflow: hidden;
        }

        /* Raw Data Stream */
        .ck-stream-panel {
            background: #050505;
            border-right: 1px solid #222;
            display: flex;
            flex-direction: column;
        }

        .ck-panel-label {
            padding: 12px 20px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #555;
            border-bottom: 1px solid #222;
            background: #0a0a0a;
            display: flex;
            justify-content: space-between;
        }

        .ck-raw-log {
            flex: 1;
            padding: 20px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: #00ff88;
            overflow-y: auto;
            line-height: 1.6;
        }

        .ck-log-item {
            margin-bottom: 4px;
            opacity: 0.8;
            word-break: break-all;
        }

        .ck-log-item.meta { color: #555; }
        .ck-log-item.hit { color: #00f2ff; }

        /* Prospect List */
        .ck-prospect-panel {
            padding: 0;
            display: flex;
            flex-direction: column;
            background: #0d0d0d;
        }

        .ck-prospect-grid {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
            align-content: start;
        }

        .ck-prospect-card {
            background: #050505;
            border: 1px solid #222;
            border-radius: 8px;
            padding: 16px;
            position: relative;
            transition: border-color 0.2s;
        }

        .ck-prospect-card:hover {
            border-color: #00f2ff55;
        }

        .ck-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }

        .ck-prospect-name {
            font-size: 13px;
            font-weight: 600;
            color: #fff;
        }

        .ck-prospect-title {
            font-size: 11px;
            color: #777;
            margin-top: 2px;
        }

        .ck-score-badge {
            background: rgba(0, 255, 136, 0.1);
            color: #00ff88;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 700;
            border: 1px solid rgba(0, 255, 136, 0.2);
        }

        .ck-tag-group {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .ck-tag {
            font-size: 9px;
            color: #555;
            background: #111;
            padding: 2px 6px;
            border-radius: 3px;
            text-transform: uppercase;
        }

        .ck-modal-footer {
            padding: 15px 30px;
            border-top: 1px solid #222;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #050505;
        }

        .ck-status-indicator {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 11px;
            color: #777;
        }

        .ck-pulse-dot {
            width: 8px;
            height: 8px;
            background: #00f2ff;
            border-radius: 50%;
            box-shadow: 0 0 10px #00f2ff;
            animation: ck-pulse 1.5s infinite;
        }

        @keyframes ck-pulse {
            0% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.3; transform: scale(0.8); }
        }

        .ck-primary-btn {
            background: #00f2ff;
            color: #000;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
        }

        .ck-primary-btn:hover {
            filter: brightness(1.1);
            box-shadow: 0 0 15px rgba(0, 242, 255, 0.4);
        }

        .ck-raw-log::-webkit-scrollbar, .ck-prospect-grid::-webkit-scrollbar {
            width: 4px;
        }
        .ck-raw-log::-webkit-scrollbar-thumb, .ck-prospect-grid::-webkit-scrollbar-thumb {
            background: #222;
        }
    `;

    const injectStyles = () => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    };

    const mockLogs = [
        { type: 'meta', msg: '> Initializing discover_node_v4.2' },
        { type: 'meta', msg: '> Targeting: Austin, TX | Fintech' },
        { type: 'hit', msg: '[FOUND] stripe.com API endpoint active' },
        { type: 'meta', msg: '> Scraping LinkedIn company profiles...' },
        { type: 'hit', msg: '[FOUND] 12 prospects at "PayFlow Austin"' },
        { type: 'meta', msg: '> Verifying email patterns: {f}{last}@...' },
        { type: 'hit', msg: '[VERIFIED] j.smith@payflow.io (Score: 98)' },
        { type: 'meta', msg: '> Scanning Series A funding database...' },
        { type: 'hit', msg: '[MATCH] NeoBank raised $14M - 2 days ago' },
        { type: 'meta', msg: '> Enrichment: Fetching CTO tech stack...' },
        { type: 'hit', msg: '[STACK] React, Node, AWS, Kubernetes' }
    ];

    const mockProspects = [
        { name: 'Sarah Chen', title: 'Head of Growth', company: 'NeoBank', score: '98', tags: ['Series A', 'High Intent'] },
        { name: 'Marcus Thorne', title: 'Founder', company: 'AustinPay', score: '94', tags: ['SaaS', 'Early Adopter'] },
        { name: 'Elena Rodriguez', title: 'CTO', company: 'ClearSettlement', score: '91', tags: ['Legacy Migration'] },
        { name: 'David Wu', title: 'VP Engineering', company: 'Flux Capital', score: '89', tags: ['Scaling Team'] }
    ];

    const createModal = () => {
        const overlay = document.createElement('div');
        overlay.className = 'ck-modal-overlay';
        
        overlay.innerHTML = `
            <div class="ck-modal-container">
                <div class="ck-modal-header">
                    <div class="ck-header-title">
                        <h2>Lead Discovery Lab</h2>
                        <span>Live Extraction & Qualification Pipeline</span>
                    </div>
                    <button class="ck-close-btn">ESC TO CLOSE</button>
                </div>
                <div class="ck-modal-body">
                    <div class="ck-stream-panel">
                        <div class="ck-panel-label">
                            <span>Raw Data Stream</span>
                            <span>NODE_01</span>
                        </div>
                        <div class="ck-raw-log" id="ck-log-container"></div>
                    </div>
                    <div class="ck-prospect-panel">
                        <div class="ck-panel-label">
                            <span>Qualified Prospects</span>
                            <span>Auto-Enriched</span>
                        </div>
                        <div class="ck-prospect-grid" id="ck-prospect-container"></div>
                    </div>
                </div>
                <div class="ck-modal-footer">
                    <div class="ck-status-indicator">
                        <div class="ck-pulse-dot"></div>
                        <span>Scraping 12 sources... 142 leads processed</span>
                    </div>
                    <button class="ck-primary-btn">Import All Qualified</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Functionality
        const logContainer = overlay.querySelector('#ck-log-container');
        const prospectContainer = overlay.querySelector('#ck-prospect-container');
        
        const addLog = (index = 0) => {
            if (index >= mockLogs.length) index = 0;
            const log = mockLogs[index];
            const div = document.createElement('div');
            div.className = `ck-log-item ${log.type}`;
            div.textContent = log.msg;
            logContainer.appendChild(div);
            logContainer.scrollTop = logContainer.scrollHeight;
            setTimeout(() => addLog(index + 1), 800 + Math.random() * 1000);
        };

        const renderProspects = () => {
            prospectContainer.innerHTML = mockProspects.map(p => `
                <div class="ck-prospect-card">
                    <div class="ck-card-header">
                        <div>
                            <div class="ck-prospect-name">${p.name}</div>
                            <div class="ck-prospect-title">${p.title} @ ${p.company}</div>
                        </div>
                        <div class="ck-score-badge">${p.score}%</div>
                    </div>
                    <div class="ck-tag-group">
                        ${p.tags.map(t => `<span class="ck-tag">${t}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        };

        // Events
        const close = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.querySelector('.ck-close-btn').onclick = close;
        overlay.onclick = (e) => { if(e.target === overlay) close(); };
        
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            renderProspects();
            addLog();
        });
    };

    // Public API
    window.CarbonKinetic = window.CarbonKinetic || {};
    window.CarbonKinetic.openResearchLab = () => {
        injectStyles();
        createModal();
    };

    // Auto-bind to launch button if it exists
    document.addEventListener('DOMContentLoaded', () => {
        const launchBtn = document.querySelector('.btn-launch');
        if (launchBtn) {
            launchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.CarbonKinetic.openResearchLab();
            });
        }
    });
})();