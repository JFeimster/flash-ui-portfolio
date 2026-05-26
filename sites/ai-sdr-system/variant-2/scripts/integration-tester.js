/**
 * scripts/integration-tester.js
 * Workflow Automation Mapper & Integration Health Monitor
 * Part of Obsidian AI SDR Engine
 */

(function() {
    const mapperStyles = `
        .mapper-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(5, 5, 5, 0.9);
            backdrop-filter: blur(15px);
            z-index: 1000;
            display: none;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .mapper-overlay.active {
            display: flex;
            opacity: 1;
        }

        .mapper-window {
            width: 90%;
            max-width: 900px;
            background: #0a0a0a;
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            display: grid;
            grid-template-columns: 280px 1fr;
            overflow: hidden;
            box-shadow: 0 0 50px rgba(0,0,0,0.8);
        }

        .mapper-nav {
            padding: 2rem;
            border-right: 1px solid var(--glass-border);
            background: rgba(255, 255, 255, 0.02);
        }

        .mapper-content {
            padding: 2.5rem;
            max-height: 80vh;
            overflow-y: auto;
        }

        .integration-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .health-indicator {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.7rem;
            font-family: 'JetBrains Mono', monospace;
            margin-top: 10px;
        }

        .health-pulse {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4ade80;
        }

        .health-pulse.warning { background: #fbbf24; }
        .health-pulse.error { background: #ef4444; }

        .sequence-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .sequence-row:last-child { border: none; }

        .input-mini {
            width: 60px;
            background: #111;
            border: 1px solid var(--glass-border);
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'JetBrains Mono';
            font-size: 0.8rem;
            text-align: center;
        }

        .hook-id {
            color: var(--text-secondary);
            font-size: 0.65rem;
            font-family: 'JetBrains Mono';
            background: rgba(255,255,255,0.05);
            padding: 2px 6px;
            border-radius: 3px;
        }

        .btn-close-mapper {
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: none;
            border: 1px solid var(--glass-border);
            color: white;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.7rem;
        }
    `;

    const injectStyles = () => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = mapperStyles;
        document.head.appendChild(styleSheet);
    };

    const mapperHTML = `
        <div class="mapper-overlay" id="mapperOverlay">
            <button class="btn-close-mapper" onclick="closeWorkflowMapper()">ESC / CLOSE</button>
            <div class="mapper-window">
                <aside class="mapper-nav">
                    <h2 class="header-title">Integrations</h2>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div class="tool-tag" style="width: 100%; cursor: pointer;">GMAIL_API_v1</div>
                        <div class="tool-tag" style="width: 100%; cursor: pointer;">MAKE_WEBHOOK_02</div>
                        <div class="tool-tag" style="width: 100%; cursor: pointer;">NOTION_DB_PROD</div>
                        <div class="tool-tag" style="width: 100%; cursor: pointer;">APPS_SCRIPT_RELAY</div>
                    </div>
                </aside>
                <main class="mapper-content">
                    <section>
                        <h1 style="font-size: 1.1rem; margin-bottom: 1.5rem;">Workflow Automation Mapper</h1>
                        
                        <div class="integration-card">
                            <h3 class="step-name" style="margin-bottom: 0.2rem;">Send Logic (Step 06)</h3>
                            <p class="step-desc" style="margin-bottom: 1rem;">Primary SMTP & Google OAuth Routing</p>
                            <div class="sequence-row">
                                <span class="step-desc">Provider:</span>
                                <span class="hook-id">G-Workspace (Gmail)</span>
                                <span class="health-indicator" style="margin-left: auto;">
                                    <div class="health-pulse"></div> ACTIVE
                                </span>
                            </div>
                            <div class="sequence-row">
                                <span class="step-desc">Throttle:</span>
                                <input type="text" class="input-mini" value="45">
                                <span class="step-desc">seconds between sends</span>
                            </div>
                        </div>

                        <div class="integration-card">
                            <h3 class="step-name" style="margin-bottom: 0.2rem;">Follow-up Sequence (Step 07)</h3>
                            <p class="step-desc" style="margin-bottom: 1.5rem;">Automated thread management intervals.</p>
                            
                            <div class="sequence-row">
                                <span class="hook-id">F-UP 01</span>
                                <span class="step-desc">Wait</span>
                                <input type="text" class="input-mini" value="3">
                                <span class="step-desc">Days</span>
                                <span class="hook-id" style="margin-left: auto;">Template: T-A1</span>
                            </div>

                            <div class="sequence-row">
                                <span class="hook-id">F-UP 02</span>
                                <span class="step-desc">Wait</span>
                                <input type="text" class="input-mini" value="5">
                                <span class="step-desc">Days</span>
                                <span class="hook-id" style="margin-left: auto;">Template: T-A2</span>
                            </div>

                            <div class="sequence-row">
                                <span class="hook-id">F-UP 03</span>
                                <span class="step-desc">Wait</span>
                                <input type="text" class="input-mini" value="7">
                                <span class="step-desc">Days</span>
                                <span class="hook-id" style="margin-left: auto;">Template: T-A3</span>
                            </div>
                        </div>

                        <div class="integration-card" style="border-style: dashed;">
                            <h3 class="step-name" style="font-size: 0.75rem;">Apps Script Health</h3>
                            <div class="health-indicator">
                                <div class="health-pulse"></div>
                                <span class="step-desc">Trigger Hook: </span>
                                <span class="hook-id">https://script.google.com/macros/s/.../exec</span>
                            </div>
                            <div class="health-indicator" style="margin-top: 5px;">
                                <span class="step-desc">Last Ping: </span>
                                <span class="hook-id">200 OK - 14ms response</span>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    `;

    window.openWorkflowMapper = function() {
        document.getElementById('mapperOverlay').classList.add('active');
    };

    window.closeWorkflowMapper = function() {
        document.getElementById('mapperOverlay').classList.remove('active');
    };

    const init = () => {
        injectStyles();
        const container = document.createElement('div');
        container.innerHTML = mapperHTML;
        document.body.appendChild(container);

        // Bind to existing pipeline steps (6 and 7)
        const cards = document.querySelectorAll('.step-card');
        cards.forEach((card, index) => {
            if (index === 5 || index === 6) { // Step 06 and 07
                card.style.cursor = 'pointer';
                card.title = "Click to configure automation workflow";
                card.addEventListener('click', openWorkflowMapper);
            }
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeWorkflowMapper();
        });

        console.log("Obsidian Integration Mapper initialized. Monitoring steps 06 and 07.");
    };

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();