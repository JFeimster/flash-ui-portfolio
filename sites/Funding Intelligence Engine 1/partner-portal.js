(function() {
    // 1. Dynamic CSS Injection to maintain matching aesthetic framework
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Developer Portal & Embed Console Overlay Styles */
        .dev-portal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(3, 5, 10, 0.85);
            backdrop-filter: blur(20px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dev-portal-backdrop.active {
            opacity: 1;
            pointer-events: all;
        }

        .dev-portal-window {
            width: 90%;
            max-width: 1100px;
            height: 85vh;
            background: var(--bg-surface-elevated);
            border: 1px solid var(--accent-prism-violet);
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(124, 58, 237, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.95);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dev-portal-backdrop.active .dev-portal-window {
            transform: scale(1);
        }

        /* Portal Header Layout */
        .dev-portal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 30px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .dev-portal-title h2 {
            font-size: 18px;
            font-weight: 800;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .dev-portal-title p {
            font-size: 11px;
            color: var(--accent-cyan);
            font-family: var(--font-mono);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 2px;
        }

        .dev-portal-close {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-secondary);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition-smooth);
        }

        .dev-portal-close:hover {
            background: var(--accent-rose);
            color: white;
            border-color: var(--accent-rose);
        }

        /* Tabs Interface */
        .dev-portal-body {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .dev-portal-sidebar {
            width: 240px;
            background: rgba(0, 0, 0, 0.15);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            padding: 20px 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .dev-sidebar-btn {
            background: none;
            border: 1px solid transparent;
            border-radius: 8px;
            color: var(--text-secondary);
            font-family: var(--font-sans);
            font-weight: 600;
            font-size: 13px;
            padding: 12px 16px;
            cursor: pointer;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: var(--transition-smooth);
        }

        .dev-sidebar-btn svg {
            width: 16px;
            height: 16px;
            stroke-width: 2px;
            stroke: var(--text-muted);
            transition: var(--transition-smooth);
        }

        .dev-sidebar-btn.active {
            background: rgba(124, 58, 237, 0.15);
            border-color: rgba(124, 58, 237, 0.3);
            color: var(--text-primary);
        }

        .dev-sidebar-btn.active svg {
            stroke: var(--accent-cyan);
        }

        .dev-sidebar-btn:hover:not(.active) {
            background: rgba(255, 255, 255, 0.03);
            color: var(--text-primary);
        }

        .dev-portal-main-pane {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            background: rgba(0,0,0,0.05);
        }

        .dev-section {
            display: none;
            flex-direction: column;
            gap: 24px;
            height: 100%;
        }

        .dev-section.active {
            display: flex;
        }

        /* Common Elements inside Panels */
        .dev-pane-title-group h3 {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
        }

        .dev-pane-title-group p {
            font-size: 13px;
            color: var(--text-secondary);
        }

        /* Credentials Layout styles */
        .dev-credentials-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .dev-key-card {
            background: rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .dev-key-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .dev-key-tag {
            font-family: var(--font-mono);
            font-size: 10px;
            font-weight: 700;
            background: rgba(6, 182, 212, 0.12);
            color: var(--accent-cyan);
            border: 1px solid rgba(6, 182, 212, 0.2);
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }

        .dev-key-field {
            display: flex;
            gap: 10px;
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            padding: 4px 12px;
            align-items: center;
        }

        .dev-key-input {
            flex: 1;
            background: transparent;
            border: none;
            color: var(--text-primary);
            font-family: var(--font-mono);
            font-size: 13px;
            outline: none;
            padding: 8px 0;
            letter-spacing: 0.5px;
        }

        .dev-btn-action {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: var(--text-primary);
            padding: 8px 14px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: var(--transition-smooth);
        }

        .dev-btn-action:hover {
            background: var(--accent-cobalt);
            border-color: var(--accent-cobalt);
        }

        /* API Explorer Sandbox */
        .api-explorer-split {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 24px;
            align-items: stretch;
        }

        @media (max-width: 900px) {
            .api-explorer-split {
                grid-template-columns: 1fr;
            }
        }

        .api-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .api-input-wrap {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .api-input-wrap label {
            font-size: 11px;
            font-family: var(--font-mono);
            color: var(--text-secondary);
            text-transform: uppercase;
        }

        .api-select, .api-text-input {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            color: var(--text-primary);
            padding: 10px 14px;
            font-size: 13px;
            outline: none;
            font-family: var(--font-sans);
        }

        .api-select option {
            background-color: #0b0f19;
            color: white;
        }

        .api-select:focus, .api-text-input:focus {
            border-color: var(--accent-cyan);
        }

        .api-terminal-view {
            background: #020408;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .api-terminal-header {
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding: 10px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .api-terminal-tab {
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--accent-cyan);
        }

        .api-terminal-body {
            flex: 1;
            padding: 16px;
            margin: 0;
            overflow-y: auto;
            max-height: 380px;
        }

        .api-terminal-body code {
            font-family: var(--font-mono);
            font-size: 11px;
            line-height: 1.5;
            color: #38bdf8;
            white-space: pre-wrap;
            display: block;
        }

        /* Embed Generator Panel */
        .embed-config-split {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 24px;
        }

        @media (max-width: 900px) {
            .embed-config-split {
                grid-template-columns: 1fr;
            }
        }

        .embed-preview-box {
            background: rgba(0,0,0,0.2);
            border: 1px dashed rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            min-height: 250px;
        }

        .embed-preview-placeholder {
            text-align: center;
            color: var(--text-muted);
            font-size: 12px;
        }

        .embed-preview-placeholder svg {
            width: 48px;
            height: 48px;
            stroke: var(--text-muted);
            margin-bottom: 12px;
            opacity: 0.5;
        }

        /* Live Webhook Monitoring Feed */
        .webhook-monitor-log {
            background: #020306;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px;
            height: 320px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .webhook-item {
            font-family: var(--font-mono);
            font-size: 11px;
            line-height: 1.5;
            padding: 8px 12px;
            background: rgba(255,255,255,0.02);
            border-left: 3px solid var(--accent-prism-violet);
            border-radius: 4px;
            animation: slide-in-log 0.25s ease-out;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .webhook-item.event-sucess {
            border-left-color: var(--accent-emerald);
        }

        .webhook-meta {
            display: flex;
            justify-content: space-between;
            color: var(--text-secondary);
        }

        .webhook-payload {
            color: #cbd5e1;
            white-space: pre-wrap;
        }

        @keyframes slide-in-log {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Floating console launcher style matching bottom corner button */
        .btn-portal-launcher {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: linear-gradient(135deg, var(--accent-cobalt), var(--accent-prism-violet));
            border: 1px solid rgba(255,255,255,0.15);
            color: white;
            border-radius: 50px;
            padding: 12px 24px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
            z-index: 999;
            transition: var(--transition-smooth);
        }

        .btn-portal-launcher:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(124, 58, 237, 0.6);
        }

        .scope-checkbox-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 6px;
        }

        .scope-option {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: var(--text-secondary);
            cursor: pointer;
        }

        .scope-option input {
            accent-color: var(--accent-prism-violet);
        }
    `;
    document.head.appendChild(styleElement);

    // 2. DOM Generation: Developer Portal Overlay Markup
    const overlayMarkup = `
        <div class="dev-portal-backdrop" id="devPortalBackdrop">
            <div class="dev-portal-window">
                <div class="dev-portal-header">
                    <div class="dev-portal-title">
                        <h2>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-prism-violet)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="3" x2="9" y2="21"></line>
                            </svg>
                            Partner API & Embed Console
                        </h2>
                        <p>Enterprise Analytics Integration Matrix</p>
                    </div>
                    <button class="dev-portal-close" id="btnCloseDevPortal" title="Close Console">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                <div class="dev-portal-body">
                    <!-- Left Navigation -->
                    <div class="dev-portal-sidebar">
                        <button class="dev-sidebar-btn active" data-target="panel-credentials">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            API Credentials
                        </button>
                        <button class="dev-sidebar-btn" data-target="panel-endpoints">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            Endpoint Explorer
                        </button>
                        <button class="dev-sidebar-btn" data-target="panel-embed">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                            Embeddable Widgets
                        </button>
                        <button class="dev-sidebar-btn" data-target="panel-webhooks">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                            Webhook Stream
                        </button>
                    </div>

                    <!-- Main Dynamic Panels -->
                    <div class="dev-portal-main-pane">
                        
                        <!-- Panel: API Credentials -->
                        <div class="dev-section active" id="panel-credentials">
                            <div class="dev-pane-title-group">
                                <h3>API Authentication Parameters</h3>
                                <p>Authenticate requests sent to our underwriting decision matching APIs. Secure keys matching production endpoints.</p>
                            </div>
                            
                            <div class="dev-credentials-grid">
                                <div class="dev-key-card">
                                    <div class="dev-key-header">
                                        <div style="font-weight:700; font-size:14px; color:var(--text-primary);">Publishable Integration Key</div>
                                        <span class="dev-key-tag">pk_live</span>
                                    </div>
                                    <div class="dev-key-field">
                                        <input type="text" class="dev-key-input" id="devPublishableKey" value="pk_live_2026_prism_9f81a74dce54e3" readonly>
                                        <button class="dev-btn-action" onclick="navigator.clipboard.writeText(document.getElementById('devPublishableKey').value); alert('Publishable key copied to clipboard!')">Copy</button>
                                    </div>
                                    <p style="font-size:11px; color:var(--text-muted); margin-top:-8px;">Used for client-side routing telemetry and secure iframe events.</p>
                                </div>

                                <div class="dev-key-card">
                                    <div class="dev-key-header">
                                        <div style="font-weight:700; font-size:14px; color:var(--text-primary);">Secret Gateway Key</div>
                                        <span class="dev-key-tag" style="background:rgba(244,63,94,0.1); color:var(--accent-rose); border-color:rgba(244,63,94,0.2);">sk_live</span>
                                    </div>
                                    <div class="dev-key-field">
                                        <input type="password" class="dev-key-input" id="devSecretKey" value="sk_live_2026_prism_38bc3a6a9df8e1ff83bdcc2840" readonly>
                                        <button class="dev-btn-action" id="btnRevealSecret">Reveal</button>
                                        <button class="dev-btn-action" id="btnRotateSecret">Roll Key</button>
                                    </div>
                                    <p style="font-size:11px; color:var(--text-muted); margin-top:-8px;">Use only inside server-side environments to trigger algorithmic route requests.</p>
                                </div>

                                <div class="dev-key-card">
                                    <div style="font-weight:700; font-size:14px; color:var(--text-primary);">Gateway Scope Permissions</div>
                                    <div class="scope-checkbox-grid">
                                        <label class="scope-option"><input type="checkbox" checked disabled> routing:calculate</label>
                                        <label class="scope-option"><input type="checkbox" checked disabled> underwriting:read</label>
                                        <label class="scope-option"><input type="checkbox" checked> leads:write</label>
                                        <label class="scope-option"><input type="checkbox" checked> webhooks:configure</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Panel: Endpoints Explorer -->
                        <div class="dev-section" id="panel-endpoints">
                            <div class="dev-pane-title-group">
                                <h3>Routing Engine API Sandbox</h3>
                                <p>Simulate querying our decision matrix and routing engine pipeline using live sandbox parameters.</p>
                            </div>

                            <div class="api-explorer-split">
                                <div class="api-form">
                                    <div class="api-input-wrap">
                                        <label>Borrower Profile Benchmark</label>
                                        <select class="api-select" id="apiSelectArchetype">
                                            <option value="saas">SaaS Scaleup</option>
                                            <option value="ecom">E-Commerce Titan</option>
                                            <option value="industrial">Heavy Manufacturing</option>
                                            <option value="realestate">Commercial RE Asset Class</option>
                                            <option value="acquisition">LBO Search Fund</option>
                                        </select>
                                    </div>

                                    <div class="api-input-wrap">
                                        <label>Required Sizing Request ($)</label>
                                        <input type="number" class="api-text-input" id="apiInputSizing" value="2500000">
                                    </div>

                                    <div class="api-input-wrap">
                                        <label>Calculated Liquidity Score Weight</label>
                                        <input type="range" class="custom-range" id="apiInputLiquidity" min="0" max="2" step="0.1" value="1.0">
                                    </div>

                                    <div class="api-input-wrap">
                                        <label>Calculated Growth Weight</label>
                                        <input type="range" class="custom-range" id="apiInputGrowth" min="0" max="2" step="0.1" value="1.0">
                                    </div>

                                    <button class="action-button" id="btnExecuteSandbox" style="background:var(--accent-prism-violet); border-color:var(--accent-prism-violet);">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        Execute Query Request
                                    </button>
                                </div>

                                <div class="api-terminal-view">
                                    <div class="api-terminal-header">
                                        <span class="api-terminal-tab">POST /v1/routing/calculate</span>
                                        <button class="dev-btn-action" style="padding:4px 8px; font-size:10px;" id="btnCopySandboxResponse">Copy JSON</button>
                                    </div>
                                    <pre class="api-terminal-body"><code id="apiSandboxResponse">/* Execute target query parameters on left side to monitor live endpoint pipeline mapping. */</code></pre>
                                </div>
                            </div>
                        </div>

                        <!-- Panel: Embeddable Widgets -->
                        <div class="dev-section" id="panel-embed">
                            <div class="dev-pane-title-group">
                                <h3>IFrame Embed Configurator</h3>
                                <p>Deploy white-label secure eligibility wizard flow elements directly into your partner web portals.</p>
                            </div>

                            <div class="embed-config-split">
                                <div class="api-form">
                                    <div class="api-input-wrap">
                                        <label>Pre-Selected Benchmark</label>
                                        <select class="api-select" id="embedDefaultArchetype">
                                            <option value="saas">SaaS Scaleup View</option>
                                            <option value="ecom">E-Commerce Flow</option>
                                            <option value="industrial">Industrial Asset Class</option>
                                        </select>
                                    </div>

                                    <div class="api-input-wrap">
                                        <label>UI Theme Frame</label>
                                        <select class="api-select" id="embedTheme">
                                            <option value="dark">Prism Dark Palette</option>
                                            <option value="white-label">Alternative White-Label</option>
                                        </select>
                                    </div>

                                    <div class="api-input-wrap">
                                        <label>IFrame Target Width</label>
                                        <input type="text" class="api-text-input" id="embedWidth" value="100%">
                                    </div>

                                    <div class="api-input-wrap">
                                        <label>IFrame Target Height</label>
                                        <input type="text" class="api-text-input" id="embedHeight" value="650px">
                                    </div>
                                </div>

                                <div style="display:flex; flex-direction:column; gap:16px;">
                                    <div class="api-terminal-view">
                                        <div class="api-terminal-header">
                                            <span class="api-terminal-tab">Embed Secure Markup</span>
                                            <button class="dev-btn-action" style="padding:4px 8px; font-size:10px;" id="btnCopyEmbedSnippet">Copy Snippet</button>
                                        </div>
                                        <pre class="api-terminal-body" style="max-height:120px;"><code id="embedSnippetCode" style="color:var(--accent-emerald);">...</code></pre>
                                    </div>

                                    <div class="embed-preview-box">
                                        <div class="embed-preview-placeholder">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                                            <p>Live Embedded Flow Preview Simulator active</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Panel: Webhooks Monitoring -->
                        <div class="dev-section" id="panel-webhooks">
                            <div class="dev-pane-title-group">
                                <h3>Affiliate Referral Webhook Monitor</h3>
                                <p>Live developer simulation tracking post-underwriting lead conversions and matched capital payouts.</p>
                            </div>

                            <div class="webhook-monitor-log" id="webhookStreamLog">
                                <div class="webhook-item">
                                    <div class="webhook-meta">
                                        <span>SYSTEM CONFIG</span>
                                        <span>STANDBY LOGS</span>
                                    </div>
                                    <div class="webhook-payload">Webhook ingestion gateway listening on production webhook URL: https://api.yourdomain.com/webhooks/prism-referral</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        
        <button class="btn-portal-launcher" id="btnDevPortalLauncher">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            Developer Console
        </button>
    `;

    // 3. Mount overlay inside document body dynamically
    const portalWrapper = document.createElement('div');
    portalWrapper.innerHTML = overlayMarkup;
    document.body.appendChild(portalWrapper);

    // 4. Cache DOM Elements
    const backdrop = document.getElementById('devPortalBackdrop');
    const btnLauncher = document.getElementById('btnDevPortalLauncher');
    const btnClose = document.getElementById('btnCloseDevPortal');
    const sidebarButtons = document.querySelectorAll('.dev-sidebar-btn');
    const sectionPanels = document.querySelectorAll('.dev-section');

    const btnRevealSecret = document.getElementById('btnRevealSecret');
    const inpSecretKey = document.getElementById('devSecretKey');
    const btnRotateSecret = document.getElementById('btnRotateSecret');

    const apiSelectArchetype = document.getElementById('apiSelectArchetype');
    const apiInputSizing = document.getElementById('apiInputSizing');
    const apiInputLiquidity = document.getElementById('apiInputLiquidity');
    const apiInputGrowth = document.getElementById('apiInputGrowth');
    const btnExecuteSandbox = document.getElementById('btnExecuteSandbox');
    const codeSandboxResponse = document.getElementById('apiSandboxResponse');
    const btnCopySandboxResponse = document.getElementById('btnCopySandboxResponse');

    const embedDefaultArchetype = document.getElementById('embedDefaultArchetype');
    const embedTheme = document.getElementById('embedTheme');
    const embedWidth = document.getElementById('embedWidth');
    const embedHeight = document.getElementById('embedHeight');
    const codeEmbedSnippet = document.getElementById('embedSnippetCode');
    const btnCopyEmbedSnippet = document.getElementById('btnCopyEmbedSnippet');

    const webhookStreamLog = document.getElementById('webhookStreamLog');

    // 5. System Interactivity Handlers
    
    // Open Dev Portal View
    function openDevPortal(targetTabId = 'panel-credentials') {
        backdrop.classList.add('active');
        
        // Find corresponding sidebar tab and click it
        const matchingBtn = document.querySelector(`.dev-sidebar-btn[data-target="${targetTabId}"]`);
        if (matchingBtn) {
            matchingBtn.click();
        }
    }

    // Close Dev Portal View
    function closeDevPortal() {
        backdrop.classList.remove('active');
    }

    btnLauncher.addEventListener('click', () => openDevPortal('panel-credentials'));
    btnClose.addEventListener('click', closeDevPortal);

    // Override existing base UI hooks with Dev Portal triggers dynamically
    window.addEventListener('DOMContentLoaded', () => {
        // Intercept primary White label export actions and link to embed configurator
        window.shareWhiteLabelLink = function() {
            openDevPortal('panel-embed');
        };

        // Intercept lender integration CTA bank connection button to dev keys
        const ctaBtn = document.querySelector('.partner-cta-card .partner-action-btn');
        if (ctaBtn) {
            ctaBtn.onclick = function(e) {
                e.preventDefault();
                openDevPortal('panel-credentials');
            };
        }
    });

    // Sidebar tab navigation selection routing
    sidebarButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sidebarButtons.forEach(b => b.classList.remove('active'));
            sectionPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });

    // Panel 1: Credentials controls 
    let isRevealed = false;
    btnRevealSecret.addEventListener('click', () => {
        isRevealed = !isRevealed;
        inpSecretKey.type = isRevealed ? 'text' : 'password';
        btnRevealSecret.textContent = isRevealed ? 'Hide' : 'Reveal';
    });

    btnRotateSecret.addEventListener('click', () => {
        if (confirm('Are you absolutely sure you want to rotate the secret gateway credentials key? Real-time server flows active inside integrated gateways will cease validation paths immediately.')) {
            const hex = Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');
            inpSecretKey.value = `sk_live_2026_prism_${hex.substring(0, 22)}`;
            alert('Secret token parameters rotated safely. Ensure you instantly update environment structures.');
        }
    });

    // Panel 2: Underwriting decision playground simulation engine logic
    const sandboxArchetypes = {
        saas: { score: 825, rating: "Super Prime", path: "SaaS Recurring Revenue Bridge", apr: "8.2%", limit: "$3,500,000" },
        ecom: { score: 715, rating: "Prime", path: "E-Commerce Stock & Ads", apr: "9.5%", limit: "$1,250,000" },
        industrial: { score: 690, rating: "Standard", path: "Equipment Financing Lease", apr: "6.8%", limit: "$8,500,000" },
        realestate: { score: 790, rating: "Prime", path: "Commercial Property Debt", apr: "5.8%", limit: "$18,000,000" },
        acquisition: { score: 755, rating: "Prime", path: "Acquisition Leveraged Credit", apr: "8.5%", limit: "$6,500,000" }
    };

    function runSandboxSimulation() {
        const selected = apiSelectArchetype.value;
        const baseline = sandboxArchetypes[selected];
        const multiplier = (parseFloat(apiInputLiquidity.value) + parseFloat(apiInputGrowth.value)) / 2.0;
        
        let adjustedScore = Math.min(1000, Math.round(baseline.score * (0.85 + (multiplier * 0.15))));
        let status = adjustedScore >= 800 ? "SUPER_PRIME" : (adjustedScore >= 700 ? "PRIME" : "STANDARD_TIER");
        
        const outputPayload = {
            status: "success",
            timestamp: new Date().toISOString(),
            query_metrics: {
                target_archetype: selected,
                requested_sizing_limit: parseInt(apiInputSizing.value),
                computed_weights: {
                    liquidity_modifier: parseFloat(apiInputLiquidity.value),
                    growth_modifier: parseFloat(apiInputGrowth.value)
                }
            },
            routing_decision_matrix: {
                quantitative_score_assessment: adjustedScore,
                risk_tier_classification: status,
                underwriting_match_strategy: baseline.path,
                optimal_apr_yield_projection: baseline.apr,
                authorized_securitization_limit: baseline.limit
            },
            api_compliance_headers: {
                sandbox_mode: true,
                regulatory_rule_matches: ["UCC-1_FILING_OPTIONAL", "RECURRING_CONTRACT_VERIFIED"]
            }
        };

        codeSandboxResponse.textContent = JSON.stringify(outputPayload, null, 2);
    }

    btnExecuteSandbox.addEventListener('click', runSandboxSimulation);
    btnCopySandboxResponse.addEventListener('click', () => {
        navigator.clipboard.writeText(codeSandboxResponse.textContent);
        alert('Simulation response copied safely.');
    });

    // Panel 3: Embed builder engine logic
    function generateEmbedSnippet() {
        const archetype = embedDefaultArchetype.value;
        const theme = embedTheme.value;
        const width = embedWidth.value;
        const height = embedHeight.value;

        const codeSnippet = `<iframe src="https://engine.prismdebt.com/embed?archetype=${archetype}&theme=${theme}" width="${width}" height="${height}" style="border: 1px solid var(--accent-prism-violet); border-radius: 16px; background: #03050a; box-shadow: 0 8px 30px rgba(0,0,0,0.5);" allow="payment; financial-data"></iframe>`;
        codeEmbedSnippet.textContent = codeSnippet;
    }

    [embedDefaultArchetype, embedTheme, embedWidth, embedHeight].forEach(element => {
        element.addEventListener('input', generateEmbedSnippet);
    });

    btnCopyEmbedSnippet.addEventListener('click', () => {
        navigator.clipboard.writeText(codeEmbedSnippet.textContent);
        alert('Iframe embed block successfully copied.');
    });

    // Panel 4: Webhook log simulation
    const webhookEventTemplates = [
        {
            event: "referral.lead_created",
            data: () => ({
                lead_id: "lead_9f7c" + Math.floor(1000 + Math.random()*9000),
                borrower_name: ["Enterprise Logistics Inc", "VaporWear Apparel", "Apex Capital Holdings", "SaaSflow Services"][Math.floor(Math.random() * 4)],
                archetype: ["saas", "ecom", "industrial", "realestate"][Math.floor(Math.random() * 4)],
                status: "evaluation"
            })
        },
        {
            event: "routing.matched",
            data: () => ({
                lead_id: "lead_9f7c" + Math.floor(1000 + Math.random()*9000),
                score_generated: Math.floor(650 + Math.random() * 300),
                recommended_route: ["SaaS Revenue Bridge", "Working Capital Revolver", "Equipment Lease"][Math.floor(Math.random() * 3)],
                apr_locked: (7.2 + Math.random() * 5).toFixed(2) + "%"
            })
        },
        {
            event: "funding.converted",
            data: () => ({
                lead_id: "lead_9f7c" + Math.floor(1000 + Math.random()*9000),
                conversion_amount: "$" + (500000 + Math.floor(Math.random() * 4500000)).toLocaleString(),
                affiliate_payout_earned: "$" + (5000 + Math.floor(Math.random() * 25000)).toLocaleString()
            })
        }
    ];

    function injectLiveWebhookItem() {
        const template = webhookEventTemplates[Math.floor(Math.random() * webhookEventTemplates.length)];
        const isSuccess = template.event === "funding.converted";

        const webhookElement = document.createElement('div');
        webhookElement.className = `webhook-item ${isSuccess ? 'event-sucess' : ''}`;
        
        const timestamp = new Date().toLocaleTimeString();
        const payload = template.data();

        webhookElement.innerHTML = `
            <div class="webhook-meta">
                <span style="font-weight:700; color:${isSuccess ? 'var(--accent-emerald)' : 'var(--accent-prism-violet)'};">${template.event.toUpperCase()}</span>
                <span>${timestamp}</span>
            </div>
            <div class="webhook-payload">${JSON.stringify(payload)}</div>
        `;

        webhookStreamLog.prepend(webhookElement);

        // Max item list pruning to maintain DOM lightness
        if (webhookStreamLog.children.length > 25) {
            webhookStreamLog.removeChild(webhookStreamLog.lastChild);
        }
    }

    // Interval stream trigger
    setInterval(injectLiveWebhookItem, 6000);

    // Initial systems activation
    generateEmbedSnippet();
    runSandboxSimulation();
})();