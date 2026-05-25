(function() {
    // 1. Inject CSS Styles to matching BASE COMPONENT design system (Cobalt / Violet / Cyan)
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Onboarding Wizard Portal Styles */
        .onboarding-trigger-btn {
            background: linear-gradient(90deg, rgba(6, 182, 212, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%);
            border: 1px solid var(--accent-cyan);
            color: var(--accent-cyan);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition-smooth);
            font-family: var(--font-sans);
        }
        .onboarding-trigger-btn:hover {
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
            background: linear-gradient(90deg, rgba(6, 182, 212, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%);
            transform: translateY(-1px);
        }
        .onboarding-trigger-btn svg {
            width: 16px;
            height: 16px;
            stroke: var(--accent-cyan);
        }

        /* Fullscreen Overlay Drawer */
        .onboarding-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(3, 5, 10, 0.85);
            backdrop-filter: blur(20px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .onboarding-overlay.active {
            opacity: 1;
            pointer-events: all;
        }

        /* White Label Override for Overlay */
        .white-label-mode .onboarding-overlay {
            background: rgba(250, 250, 249, 0.85);
        }

        .onboarding-modal {
            background: var(--bg-surface-elevated);
            border: 1px solid var(--border-glow-primary);
            width: 90%;
            max-width: 850px;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            display: grid;
            grid-template-columns: 260px 1fr;
            overflow: hidden;
            height: 600px;
            transform: scale(0.95) translateY(10px);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: var(--font-sans);
            color: var(--text-primary);
        }
        .onboarding-overlay.active .onboarding-modal {
            transform: scale(1) translateY(0);
        }

        /* Sidebar Navigation within Modal */
        .onboarding-sidebar {
            background: rgba(0, 0, 0, 0.25);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            padding: 30px 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .white-label-mode .onboarding-sidebar {
            background: rgba(0, 0, 0, 0.03);
            border-right: 1px solid rgba(0, 0, 0, 0.05);
        }

        .sidebar-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 40px;
        }
        .sidebar-brand-logo {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, var(--accent-cobalt), var(--accent-cyan));
            border-radius: 6px;
            transform: rotate(45deg);
        }

        .step-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        .step-item {
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0.4;
            transition: var(--transition-smooth);
        }
        .step-item.active {
            opacity: 1;
        }
        .step-item.completed {
            opacity: 0.8;
        }
        .step-indicator {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid var(--text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-family: var(--font-mono);
            font-weight: 700;
            background: rgba(0,0,0,0.2);
            transition: var(--transition-smooth);
        }
        .step-item.active .step-indicator {
            border-color: var(--accent-cyan);
            color: var(--accent-cyan);
            box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
        }
        .step-item.completed .step-indicator {
            border-color: var(--accent-emerald);
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent-emerald);
        }
        .step-title {
            font-size: 13px;
            font-weight: 700;
        }
        .step-desc {
            font-size: 10px;
            color: var(--text-muted);
            display: block;
        }

        /* Content Area Panels */
        .onboarding-main {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 40px;
            height: 100%;
            overflow-y: auto;
            position: relative;
        }
        .onboarding-pane {
            display: none;
            animation: paneFadeIn 0.3s ease-out forwards;
        }
        .onboarding-pane.active {
            display: block;
        }

        @keyframes paneFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Step 1: Form Inputs */
        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-top: 20px;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .form-group.col-span-2 {
            grid-column: span 2;
        }
        .form-label {
            font-size: 11px;
            font-weight: 700;
            font-family: var(--font-mono);
            text-transform: uppercase;
            color: var(--text-secondary);
            letter-spacing: 0.5px;
        }
        .form-input, .form-select {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 10px 14px;
            font-family: var(--font-sans);
            color: var(--text-primary);
            font-size: 13px;
            outline: none;
            transition: var(--transition-smooth);
        }
        .form-input:focus, .form-select:focus {
            border-color: var(--accent-cyan);
            box-shadow: 0 0 10px rgba(6, 182, 212, 0.15);
            background: rgba(0, 0, 0, 0.4);
        }
        .white-label-mode .form-input, .white-label-mode .form-select {
            background: #fff;
            border-color: rgba(0, 0, 0, 0.1);
            color: var(--text-primary);
        }

        /* Step 2: Live Account Integrations */
        .integration-matrix {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 20px;
        }
        .integration-item {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: var(--transition-smooth);
        }
        .integration-item:hover {
            border-color: rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.04);
        }
        .white-label-mode .integration-item {
            background: rgba(0, 0, 0, 0.02);
            border-color: rgba(0, 0, 0, 0.05);
        }
        .integration-meta {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .integration-logo-box {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-family: var(--font-mono);
            font-size: 14px;
        }
        .bg-plaid { background: rgba(6, 182, 212, 0.1); color: var(--accent-cyan); border: 1px solid rgba(6, 182, 212, 0.2); }
        .bg-stripe { background: rgba(37, 99, 235, 0.1); color: var(--accent-cobalt); border: 1px solid rgba(37, 99, 235, 0.2); }
        .bg-qb { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.2); }

        .integration-info h5 {
            font-size: 13px;
            font-weight: 700;
        }
        .integration-info p {
            font-size: 11px;
            color: var(--text-secondary);
        }
        .integration-status-pill {
            font-size: 10px;
            font-family: var(--font-mono);
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .status-unlinked { background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.08); }
        .status-syncing { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }
        .status-linked { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); border: 1px solid rgba(16,185,129,0.2); }

        .integration-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            padding: 6px 12px;
            font-size: 11px;
            font-weight: 700;
            border-radius: 6px;
            cursor: pointer;
            transition: var(--transition-smooth);
            font-family: var(--font-mono);
            text-transform: uppercase;
        }
        .integration-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: var(--accent-cyan);
        }

        /* Micro Telemetry Logger within Integrations */
        .sync-terminal {
            background: #020306;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 8px;
            padding: 10px;
            font-family: var(--font-mono);
            font-size: 10px;
            color: #a8b2c2;
            height: 70px;
            overflow-y: auto;
            margin-top: 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        /* Step 3: Performance Metrics Slider Preview */
        .metric-cards-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-top: 20px;
        }
        .metric-card-input {
            background: rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .white-label-mode .metric-card-input {
            background: #fff;
            border-color: rgba(0,0,0,0.05);
        }
        .metric-card-input-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .metric-card-input-header span {
            font-size: 11px;
            color: var(--text-secondary);
            font-family: var(--font-mono);
        }
        .metric-card-input-val-box {
            font-size: 18px;
            font-weight: 700;
            color: var(--accent-cyan);
            font-family: var(--font-mono);
        }

        /* Step 4: Verification Checklist */
        .verification-checklist {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 20px;
        }
        .checklist-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: rgba(255,255,255,0.01);
            border: 1px solid rgba(255,255,255,0.03);
            border-radius: 8px;
        }
        .checklist-circle {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid var(--text-muted);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: transparent;
            transition: var(--transition-smooth);
        }
        .checklist-item.verified .checklist-circle {
            border-color: var(--accent-emerald);
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent-emerald);
        }

        /* Navigation Button Bars */
        .onboarding-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 20px;
            margin-top: 20px;
        }
        .white-label-mode .onboarding-footer {
            border-top: 1px solid rgba(0,0,0,0.05);
        }
        .btn-modal-action {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition-smooth);
            text-transform: uppercase;
            font-family: var(--font-mono);
        }
        .btn-modal-action:hover {
            background: rgba(255,255,255,0.12);
        }
        .btn-modal-primary {
            background: linear-gradient(90deg, var(--accent-cobalt), var(--accent-cyan));
            color: #fff;
            border: none;
            box-shadow: 0 4px 15px rgba(6, 182, 212, 0.2);
        }
        .btn-modal-primary:hover {
            box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
            transform: translateY(-1px);
        }
        .btn-modal-primary:disabled {
            opacity: 0.3;
            cursor: not-allowed;
            pointer-events: none;
        }

        .close-onboarding-modal-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 20px;
            transition: var(--transition-smooth);
        }
        .close-onboarding-modal-btn:hover {
            color: var(--text-primary);
        }
    `;
    document.head.appendChild(styleElement);

    // 2. Insert Onboarding Trigger directly in Header global controls area
    const globalControls = document.querySelector('.global-controls');
    if (globalControls) {
        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'onboarding-trigger-btn';
        triggerBtn.id = 'triggerOnboardingBtn';
        triggerBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 5v14M5 12h14"/>
            </svg>
            New Borrower Intake
        `;
        // Insert right before the white-label switcher
        globalControls.insertBefore(triggerBtn, globalControls.lastElementChild);
    }

    // 3. Create and Append the Full Intake Wizard overlay
    const overlayDiv = document.createElement('div');
    overlayDiv.className = 'onboarding-overlay';
    overlayDiv.id = 'onboardingOverlay';

    overlayDiv.innerHTML = `
        <div class="onboarding-modal">
            <button class="close-onboarding-modal-btn" id="closeOnboardingBtn">&times;</button>
            
            <!-- Left Navigation Sidebar -->
            <div class="onboarding-sidebar">
                <div>
                    <div class="sidebar-brand">
                        <div class="sidebar-brand-logo"></div>
                        <div style="font-family: var(--font-sans); font-weight: 800; font-size: 14px; letter-spacing: -0.2px;">
                            PRISM INTAKE
                        </div>
                    </div>
                    <div class="step-list">
                        <div class="step-item active" id="stepIndicator-1">
                            <div class="step-indicator">01</div>
                            <div>
                                <span class="step-title">Company Profile</span>
                                <span class="step-desc">Core registration</span>
                            </div>
                        </div>
                        <div class="step-item" id="stepIndicator-2">
                            <div class="step-indicator">02</div>
                            <div>
                                <span class="step-title">Financial Sync</span>
                                <span class="step-desc">Secure ledger API</span>
                            </div>
                        </div>
                        <div class="step-item" id="stepIndicator-3">
                            <div class="step-indicator">03</div>
                            <div>
                                <span class="step-title">Metric Review</span>
                                <span class="step-desc">Fine-tune indexes</span>
                            </div>
                        </div>
                        <div class="step-item" id="stepIndicator-4">
                            <div class="step-indicator">04</div>
                            <div>
                                <span class="step-title">Risk Audit Check</span>
                                <span class="step-desc">Submit to engine</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted);">
                    AES-GCM-256 SECURED PORTAL
                </div>
            </div>

            <!-- Right Content Panels -->
            <div class="onboarding-main">
                <div class="onboarding-panes-container">
                    
                    <!-- PANE 1: Company Profile -->
                    <div class="onboarding-pane active" id="pane-1">
                        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">Establish Borrower Identity</h3>
                        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 24px;">
                            Configure target entity base metadata mapping profiles inside the intelligence routing hub.
                        </p>
                        
                        <div class="form-grid">
                            <div class="form-group col-span-2">
                                <label class="form-label">Corporate Entity Name</label>
                                <input type="text" class="form-input" id="obCompanyName" placeholder="e.g. Apex Hyperion Technologies Corp">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Sector Class / Archetype</label>
                                <select class="form-select" id="obArchetypeSelect">
                                    <option value="saas">SaaS / Subscription Recurring Model</option>
                                    <option value="ecom">E-Commerce Merchant Ecosystem</option>
                                    <option value="industrial">Heavy Manufacturing &amp; Logistics</option>
                                    <option value="realestate">Commercial Property Asset Development</option>
                                    <option value="acquisition">LBO / Sponsor-Backed Acquisition Search</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Jurisdiction Region</label>
                                <select class="form-select" id="obRegion">
                                    <option value="us">United States (Delaware C-Corp)</option>
                                    <option value="uk">United Kingdom (Ltd)</option>
                                    <option value="ca">Canada (Federal Corp)</option>
                                    <option value="eu">European Union Zone</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- PANE 2: Live Integrations -->
                    <div class="onboarding-pane" id="pane-2">
                        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">Establish Real-Time Capital Sync</h3>
                        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 20px;">
                            Securely link merchant, banking, and general ledger instances to compute dynamic underwriting parameters.
                        </p>
                        
                        <div class="integration-matrix">
                            <div class="integration-item">
                                <div class="integration-meta">
                                    <div class="integration-logo-box bg-plaid">PL</div>
                                    <div class="integration-info">
                                        <h5>Plaid OpenBanking</h5>
                                        <p>Checking accounts &amp; direct operational reserves.</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span class="integration-status-pill status-unlinked" id="statusPlaid">Unlinked</span>
                                    <button class="integration-btn" onclick="PrismOnboarding.syncNode('Plaid')">Link Bank</button>
                                </div>
                            </div>

                            <div class="integration-item">
                                <div class="integration-meta">
                                    <div class="integration-logo-box bg-stripe">ST</div>
                                    <div class="integration-info">
                                        <h5>Stripe Revenue Protocol</h5>
                                        <p>Live billing transaction feeds and merchant volume indexes.</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span class="integration-status-pill status-unlinked" id="statusStripe">Unlinked</span>
                                    <button class="integration-btn" onclick="PrismOnboarding.syncNode('Stripe')">Link Billing</button>
                                </div>
                            </div>

                            <div class="integration-item">
                                <div class="integration-meta">
                                    <div class="integration-logo-box bg-qb">QB</div>
                                    <div class="integration-info">
                                        <h5>QuickBooks Accounting API</h5>
                                        <p>Audit trail logs, dynamic Balance Sheet &amp; General Ledgers.</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span class="integration-status-pill status-unlinked" id="statusQB">Unlinked</span>
                                    <button class="integration-btn" onclick="PrismOnboarding.syncNode('QB')">Link Books</button>
                                </div>
                            </div>
                        </div>

                        <!-- Real-time syncing console feed -->
                        <div class="sync-terminal" id="obTerminal">
                            <div>Ready to initialize security handshake parameters...</div>
                        </div>
                    </div>

                    <!-- PANE 3: Fine-Tune Metrics -->
                    <div class="onboarding-pane" id="pane-3">
                        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">Audit Ingested Ledger Metrics</h3>
                        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 16px;">
                            Values generated dynamically via synchronized ledger endpoints. Overwrite variables manually if needed.
                        </p>
                        
                        <div class="metric-cards-container">
                            <div class="metric-card-input">
                                <div class="metric-card-input-header">
                                    <span>Ingested Annual MRR</span>
                                    <div class="metric-card-input-val-box" id="obMrrText">$1,200,000</div>
                                </div>
                                <input type="range" class="custom-range" id="obMrrSlider" min="100000" max="5000000" step="50000" value="1200000" oninput="PrismOnboarding.updateMetricVal('Mrr', this.value)">
                            </div>

                            <div class="metric-card-input">
                                <div class="metric-card-input-header">
                                    <span>Working Cash Reserves</span>
                                    <div class="metric-card-input-val-box" id="obCashText">$250,000</div>
                                </div>
                                <input type="range" class="custom-range" id="obCashSlider" min="10000" max="1000000" step="10000" value="250000" oninput="PrismOnboarding.updateMetricVal('Cash', this.value)">
                            </div>

                            <div class="metric-card-input">
                                <div class="metric-card-input-header">
                                    <span>Senior Debt Multiplier</span>
                                    <div class="metric-card-input-val-box" id="obDebtText">1.2x</div>
                                </div>
                                <input type="range" class="custom-range" id="obDebtSlider" min="0" max="5" step="0.1" value="1.2" oninput="PrismOnboarding.updateMetricVal('Debt', this.value)">
                            </div>

                            <div class="metric-card-input">
                                <div class="metric-card-input-header">
                                    <span>Fixed Assets Valuation</span>
                                    <div class="metric-card-input-val-box" id="obAssetsText">$50,000</div>
                                </div>
                                <input type="range" class="custom-range" id="obAssetsSlider" min="0" max="1000000" step="10000" value="50000" oninput="PrismOnboarding.updateMetricVal('Assets', this.value)">
                            </div>
                        </div>
                    </div>

                    <!-- PANE 4: Audit Verification Checklist & Submittal -->
                    <div class="onboarding-pane" id="pane-4">
                        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">Pre-Flight Risk Audit Verification</h3>
                        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 20px;">
                            We have completed security audits of all open nodes. Review the pre-approval compliance checks before compiling raw data.
                        </p>
                        
                        <div class="verification-checklist">
                            <div class="checklist-item verified" id="chk-1">
                                <div class="checklist-circle">&#10003;</div>
                                <div>
                                    <span style="font-size: 13px; font-weight: 700; display: block;">Delaware Corporate Registry Verified</span>
                                    <span style="font-size: 10px; color: var(--text-secondary);">Validated status parameters directly with SEC data structures.</span>
                                </div>
                            </div>
                            <div class="checklist-item" id="chk-2">
                                <div class="checklist-circle">&#10003;</div>
                                <div>
                                    <span style="font-size: 13px; font-weight: 700; display: block;">Encrypted Endpoint Key Generated</span>
                                    <span style="font-size: 10px; color: var(--text-secondary);">Secure tunnel handshakes successfully negotiated.</span>
                                </div>
                            </div>
                            <div class="checklist-item" id="chk-3">
                                <div class="checklist-circle">&#10003;</div>
                                <div>
                                    <span style="font-size: 13px; font-weight: 700; display: block;">Debt Service Coverage Assessment Complete</span>
                                    <span style="font-size: 10px; color: var(--text-secondary);">Calculated leverage baseline within institutional constraints.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Step Footer Navigation Actions -->
                <div class="onboarding-footer">
                    <button class="btn-modal-action" id="obBackBtn" style="visibility: hidden;">Previous Step</button>
                    <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);" id="obStepCount">
                        STEP 1 OF 4
                    </div>
                    <button class="btn-modal-action btn-modal-primary" id="obNextBtn">Next Step</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlayDiv);

    // 4. Wizard Onboarding Logic State Machine
    const PrismOnboarding = {
        currentStep: 1,
        companyData: {
            name: '',
            archetype: 'saas',
            region: 'us',
            mrr: 1200000,
            cash: 250000,
            debt: 1.2,
            assets: 50000,
            linkedNodes: { Plaid: false, Stripe: false, QB: false }
        },

        init() {
            // Register interaction listeners
            document.getElementById('triggerOnboardingBtn').addEventListener('click', () => this.toggleModal(true));
            document.getElementById('closeOnboardingBtn').addEventListener('click', () => this.toggleModal(false));
            document.getElementById('obNextBtn').addEventListener('click', () => this.nextStep());
            document.getElementById('obBackBtn').addEventListener('click', () => this.prevStep());
            
            // Sync values to preset dropdown mappings
            document.getElementById('obArchetypeSelect').addEventListener('change', (e) => {
                this.companyData.archetype = e.target.value;
                this.syncArchetypePresets(e.target.value);
            });
        },

        toggleModal(open) {
            const overlay = document.getElementById('onboardingOverlay');
            if (open) {
                overlay.classList.add('active');
                this.currentStep = 1;
                this.updateUI();
                this.logTerminal("Ingress terminal active. Please provide base operational data.");
            } else {
                overlay.classList.remove('active');
            }
        },

        syncArchetypePresets(archetype) {
            // Apply corresponding realistic baseline metrics per industry archetype
            if (archetype === 'saas') {
                this.updateSlider('Mrr', 1800000);
                this.updateSlider('Cash', 450000);
                this.updateSlider('Debt', 0.8);
                this.updateSlider('Assets', 25000);
            } else if (archetype === 'ecom') {
                this.updateSlider('Mrr', 850000);
                this.updateSlider('Cash', 180000);
                this.updateSlider('Debt', 1.5);
                this.updateSlider('Assets', 200000);
            } else if (archetype === 'industrial') {
                this.updateSlider('Mrr', 2500000);
                this.updateSlider('Cash', 350000);
                this.updateSlider('Debt', 2.8);
                this.updateSlider('Assets', 950000);
            } else if (archetype === 'realestate') {
                this.updateSlider('Mrr', 4000000);
                this.updateSlider('Cash', 800000);
                this.updateSlider('Debt', 3.5);
                this.updateSlider('Assets', 2500000);
            } else if (archetype === 'acquisition') {
                this.updateSlider('Mrr', 1500000);
                this.updateSlider('Cash', 300000);
                this.updateSlider('Debt', 2.0);
                this.updateSlider('Assets', 150000);
            }
        },

        updateSlider(type, value) {
            const slider = document.getElementById(`ob${type}Slider`);
            if (slider) {
                slider.value = value;
                this.updateMetricVal(type, value);
            }
        },

        updateMetricVal(type, val) {
            let numericVal = parseFloat(val);
            if (type === 'Mrr') {
                document.getElementById('obMrrText').innerText = '$' + numericVal.toLocaleString();
                this.companyData.mrr = numericVal;
            } else if (type === 'Cash') {
                document.getElementById('obCashText').innerText = '$' + numericVal.toLocaleString();
                this.companyData.cash = numericVal;
            } else if (type === 'Debt') {
                document.getElementById('obDebtText').innerText = numericVal.toFixed(1) + 'x';
                this.companyData.debt = numericVal;
            } else if (type === 'Assets') {
                document.getElementById('obAssetsText').innerText = '$' + numericVal.toLocaleString();
                this.companyData.assets = numericVal;
            }
        },

        syncNode(nodeName) {
            const statusPill = document.getElementById(`status${nodeName}`);
            const term = document.getElementById('obTerminal');
            
            this.logTerminal(`Negotiating standard Handshake with ${nodeName}...`);
            statusPill.innerText = "Syncing";
            statusPill.className = "integration-status-pill status-syncing";

            setTimeout(() => {
                this.logTerminal(`Channel Secured. Injecting schema from ${nodeName}...`);
                this.companyData.linkedNodes[nodeName] = true;
                statusPill.innerText = "Linked";
                statusPill.className = "integration-status-pill status-linked";
                
                // Add positive checkmark to Checklist step
                this.verifyChecklistItem();
            }, 1200);
        },

        verifyChecklistItem() {
            // Dynamically check if at least one node is verified
            const connectedCount = Object.values(this.companyData.linkedNodes).filter(v => v).length;
            const chk2 = document.getElementById('chk-2');
            const chk3 = document.getElementById('chk-3');
            
            if (connectedCount >= 1) {
                chk2.classList.add('verified');
            }
            if (connectedCount >= 2) {
                chk3.classList.add('verified');
            }
        },

        logTerminal(message) {
            const term = document.getElementById('obTerminal');
            if (term) {
                const line = document.createElement('div');
                line.style.display = 'flex';
                line.style.gap = '8px';
                line.innerHTML = `
                    <span style="color: var(--accent-cyan); font-weight: 700;">&gt;</span>
                    <span>${message}</span>
                `;
                term.appendChild(line);
                term.scrollTop = term.scrollHeight;
            }
        },

        nextStep() {
            if (this.currentStep < 4) {
                this.currentStep++;
                this.updateUI();
            } else {
                // Final submission workflow
                this.compileAndApplyOnboarding();
            }
        },

        prevStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
                this.updateUI();
            }
        },

        updateUI() {
            // Update Active Pane Panels
            for (let i = 1; i <= 4; i++) {
                const pane = document.getElementById(`pane-${i}`);
                const indicator = document.getElementById(`stepIndicator-${i}`);
                
                if (pane && indicator) {
                    if (i === this.currentStep) {
                        pane.classList.add('active');
                        indicator.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                        indicator.classList.remove('active');
                    }
                    
                    if (i < this.currentStep) {
                        indicator.classList.add('completed');
                    } else {
                        indicator.classList.remove('completed');
                    }
                }
            }

            // Button label updates
            const nextBtn = document.getElementById('obNextBtn');
            const backBtn = document.getElementById('obBackBtn');
            const stepCountText = document.getElementById('obStepCount');

            stepCountText.innerText = `STEP ${this.currentStep} OF 4`;

            if (this.currentStep === 1) {
                backBtn.style.visibility = 'hidden';
                nextBtn.innerText = "Next Step";
            } else {
                backBtn.style.visibility = 'visible';
                if (this.currentStep === 4) {
                    nextBtn.innerText = "Complete Onboarding";
                } else {
                    nextBtn.innerText = "Next Step";
                }
            }
        },

        compileAndApplyOnboarding() {
            // Update baseline components in real-time
            const companyNameVal = document.getElementById('obCompanyName').value || "Apex Growth Entity";
            const targetArchetype = this.companyData.archetype;
            
            // Inject into telemetry logs on Parent page
            if (typeof logTrace === 'function') {
                logTrace(`INCOMING SECURED PIPELINE DATA: Received ledger variables for ${companyNameVal}.`);
                logTrace(`Calculating custom rating matrices for Sector: ${targetArchetype.toUpperCase()}`);
            }

            // Construct new simulated archetype profile dynamic metrics
            const baseline = borrowerArchetypes[targetArchetype] || borrowerArchetypes.saas;
            
            // Map the intake wizard slider configurations to update the UI
            const scoreMultiplier = this.companyData.mrr > 2000000 ? 1.05 : 0.95;
            baseline.score = Math.min(1000, Math.round(baseline.score * scoreMultiplier));
            
            // Map dimension attributes based on metric tuning
            baseline.dimensions.liquidity = Math.min(100, Math.round((this.companyData.cash / 500000) * 100));
            baseline.dimensions.leverage = Math.min(100, Math.round((this.companyData.debt / 5) * 100));
            baseline.dimensions.collateral = Math.min(100, Math.round((this.companyData.assets / 1000000) * 100));

            // Overwrite dropdown selector index inside the BASE COMPONENT
            const archetypeSelect = document.getElementById('archetypeSelect');
            if (archetypeSelect) {
                archetypeSelect.value = targetArchetype;
            }

            // Sync with main core routing logic execution
            if (typeof runDynamicCalculations === 'function') {
                runDynamicCalculations();
            }

            // Visually alert user of success
            alert(`ONBOARDING SECURED!\nEntity "${companyNameVal}" synced. Check main terminal metrics.`);
            this.toggleModal(false);
        }
    };

    // Expose utility handles
    window.PrismOnboarding = PrismOnboarding;

    // Run Initialization Routine
    PrismOnboarding.init();
})();