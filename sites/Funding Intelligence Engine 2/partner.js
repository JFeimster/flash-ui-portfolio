/**
 * VALOIS // Funding Intelligence Engine
 * Partner & Broker Workspace Extension (partner.js)
 * 
 * Part of White-Label Partner & Broker Portal: A dedicated workspace for broker-dealers, 
 * CPAs, and marketing affiliates to manage referred clients, customize white-labeled 
 * borrower portal styles, view co-branded domains, and track commission/conversion pipelines.
 */

(function () {
    // 1. Core State & Mock Databases
    const state = {
        activeTab: 'pipeline', // 'pipeline', 'customizer', 'commission', 'integration'
        isBrokerModeActive: false,
        coBranding: {
            brandName: 'Apex Advisory',
            subdomain: 'apex.valois.capital',
            primaryColor: '#10b981', // Emerald default for Apex
            accentColor: '#3b82f6',
            tierSelection: 'Enterprise A+',
            logoLetter: 'A'
        },
        referrals: [
            { id: 'REF-8891', client: 'Nexus Biotech Group', date: '2025-02-12', volume: 4500000, status: 'Funded', commission: 67500, estPayDate: 'Paid' },
            { id: 'REF-7422', client: 'Horizon SaaS Labs', date: '2025-02-14', volume: 2200000, status: 'Approved', commission: 33000, estPayDate: '2025-03-01' },
            { id: 'REF-3011', client: 'Omni Logistics Inc.', date: '2025-02-18', volume: 8500000, status: 'Underwriting', commission: 127500, estPayDate: 'TBD' },
            { id: 'REF-1090', client: 'Kona Coffee Roasters', date: '2025-02-20', volume: 650000, status: 'Submitted', commission: 9750, estPayDate: 'TBD' }
        ],
        commissionRate: 0.015, // 1.5% referral payout
        originalDashboardHTML: null
    };

    // Inject Custom Styles for Partner Dashboard
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .btn-partner-mode {
                background: linear-gradient(135deg, var(--accent-purple), #6366f1);
                color: #ffffff !important;
                border: none !important;
                font-weight: 700 !important;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
            }
            .btn-partner-mode:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
            }
            .partner-container {
                display: flex;
                flex-direction: column;
                gap: 24px;
                animation: fadeIn 0.4s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .partner-header-panel {
                background: linear-gradient(135deg, rgba(16, 8, 30, 0.8), rgba(6, 5, 10, 0.95));
                border: 1px solid var(--border-active);
                border-radius: 16px;
                padding: 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 16px;
            }
            .partner-meta-info {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .partner-badge-live {
                background: rgba(16, 185, 129, 0.15);
                border: 1px solid var(--accent-emerald);
                color: var(--accent-emerald);
                font-family: var(--font-mono);
                font-size: 11px;
                padding: 4px 10px;
                border-radius: 20px;
                width: fit-content;
            }
            .partner-nav {
                display: flex;
                gap: 8px;
                background: var(--bg-surface-elevated);
                padding: 6px;
                border-radius: 12px;
                border: 1px solid var(--border-muted);
            }
            .partner-nav-btn {
                background: transparent;
                border: none;
                color: var(--text-secondary);
                padding: 8px 16px;
                border-radius: 8px;
                font-family: var(--font-sans);
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition-smooth);
            }
            .partner-nav-btn.active {
                background: var(--bg-base);
                color: var(--text-primary);
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            }
            .partner-grid {
                display: grid;
                grid-template-columns: repeat(12, 1fr);
                gap: 20px;
            }
            .partner-card {
                background: var(--bg-surface);
                border: 1px solid var(--border-muted);
                border-radius: 16px;
                padding: 24px;
                position: relative;
            }
            .col-8 { grid-column: span 8; }
            .col-4 { grid-column: span 4; }
            .col-12 { grid-column: span 12; }
            
            /* Data Table Styling */
            .partner-table-wrap {
                overflow-x: auto;
                margin-top: 16px;
            }
            .partner-table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
                font-size: 13px;
            }
            .partner-table th {
                color: var(--text-muted);
                font-family: var(--font-mono);
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                padding: 12px 16px;
                border-bottom: 1px solid var(--border-muted);
            }
            .partner-table td {
                padding: 16px;
                border-bottom: 1px solid var(--border-subtle);
                color: var(--text-primary);
            }
            .partner-table tr:hover td {
                background: var(--bg-surface-elevated);
            }
            .status-badge {
                padding: 4px 8px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                display: inline-block;
            }
            .status-funded { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.2); }
            .status-approved { background: rgba(139, 92, 246, 0.1); color: var(--accent-purple); border: 1px solid rgba(139, 92, 246, 0.2); }
            .status-underwriting { background: rgba(245, 158, 11, 0.1); color: var(--accent-amber); border: 1px solid rgba(245, 158, 11, 0.2); }
            .status-submitted { background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); border: 1px solid var(--border-muted); }

            /* WL Customizer Form */
            .wl-customizer-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .form-row {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .form-row label {
                font-size: 11px;
                font-family: var(--font-mono);
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .form-input {
                background: var(--bg-surface-elevated);
                border: 1px solid var(--border-muted);
                border-radius: 10px;
                color: var(--text-primary);
                padding: 10px 14px;
                font-size: 13px;
                outline: none;
                font-family: var(--font-sans);
                transition: var(--transition-smooth);
            }
            .form-input:focus {
                border-color: var(--accent-purple);
            }
            .color-picker-group {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .color-box {
                width: 38px;
                height: 38px;
                border-radius: 8px;
                border: 1px solid var(--border-muted);
                cursor: pointer;
                background: none;
                padding: 0;
            }
            
            /* WL Live Preview */
            .partner-preview-frame {
                background: var(--bg-base);
                border: 1px solid var(--border-active);
                border-radius: 12px;
                padding: 20px;
                margin-top: 12px;
            }
            .partner-preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--border-subtle);
                padding-bottom: 12px;
                margin-bottom: 12px;
            }
            .co-branded-logo-sim {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 700;
                font-size: 13px;
            }
            .co-branded-logo-sim .logo-box {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 11px;
            }

            /* Metric Highlight Cards */
            .metric-cards-strip {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
            }
            .partner-metric-card {
                background: var(--bg-surface-elevated);
                border: 1px solid var(--border-subtle);
                border-radius: 12px;
                padding: 16px;
            }

            /* Embedded code panel */
            .embed-block {
                background: #020104;
                border: 1px solid var(--border-muted);
                padding: 14px;
                border-radius: 8px;
                color: #a1a1aa;
                font-family: var(--font-mono);
                font-size: 11px;
                white-space: pre-wrap;
                margin-top: 8px;
                display: block;
            }

            /* Responsive tweaks */
            @media (max-width: 1024px) {
                .col-8, .col-4 { grid-column: span 12; }
                .metric-cards-strip { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 600px) {
                .metric-cards-strip { grid-template-columns: 1fr; }
            }
        `;
        document.head.appendChild(style);
    };

    // Inject Global Portal Access Trigger inside Header
    const injectHeaderControl = () => {
        const controlsGroup = document.querySelector('.controls-group');
        if (!controlsGroup) return;

        // Create partner workspace toggle button
        const btn = document.createElement('button');
        btn.className = 'btn-toggle btn-partner-mode';
        btn.id = 'togglePartnerWorkspaceBtn';
        btn.innerHTML = `
            <div class="indicator" style="background: #10b981; box-shadow: 0 0 8px #10b981;"></div>
            <span>Broker Portal</span>
        `;
        btn.onclick = togglePartnerWorkspace;

        controlsGroup.insertBefore(btn, controlsGroup.firstChild);
    };

    // Main Toggle Handler to switch dashboard modes safely
    const togglePartnerWorkspace = () => {
        state.isBrokerModeActive = !state.isBrokerModeActive;
        const mainContainer = document.querySelector('.bento-grid');
        const triggerBtn = document.getElementById('togglePartnerWorkspaceBtn');

        if (state.isBrokerModeActive) {
            // Backup baseline HTML content
            if (!state.originalDashboardHTML) {
                state.originalDashboardHTML = mainContainer.innerHTML;
            }
            // Transition trigger state
            triggerBtn.innerHTML = `
                <div class="indicator" style="background: #ec4899; box-shadow: 0 0 8px #ec4899;"></div>
                <span>Borrower Mode</span>
            `;
            triggerBtn.classList.remove('btn-partner-mode');
            renderPartnerPortalWorkspace(mainContainer);
        } else {
            // Restore baseline HTML content
            triggerBtn.innerHTML = `
                <div class="indicator" style="background: #10b981; box-shadow: 0 0 8px #10b981;"></div>
                <span>Broker Portal</span>
            `;
            triggerBtn.classList.add('btn-partner-mode');
            mainContainer.innerHTML = state.originalDashboardHTML;
            // Re-bind dynamic baseline controls
            if (typeof loadArchetype === 'function') {
                loadArchetype(document.getElementById('archetypeSelect').value || 'saas_series_a');
            }
        }
    };

    // Render Portal Workspace Layout inside main container
    const renderPartnerPortalWorkspace = (container) => {
        container.innerHTML = `
            <div class="partner-container col-12">
                <!-- Portal Top Summary Area -->
                <div class="partner-header-panel">
                    <div class="partner-meta-info">
                        <span class="partner-badge-live">CO-BRANDED ACTIVE SEED NODE</span>
                        <h2 style="font-size: 20px; font-weight: 700;">Partner & Affiliate Workspace</h2>
                        <p style="font-size: 12px; color: var(--text-secondary);">Direct syndicate portal for managing custom brand aesthetics, checking referral commissions, and routing deal flow.</p>
                    </div>
                    <div class="partner-nav">
                        <button class="partner-nav-btn ${state.activeTab === 'pipeline' ? 'active' : ''}" onclick="window.ValoisPartner.switchTab('pipeline')">Client Pipeline</button>
                        <button class="partner-nav-btn ${state.activeTab === 'customizer' ? 'active' : ''}" onclick="window.ValoisPartner.switchTab('customizer')">White-Label Styles</button>
                        <button class="partner-nav-btn ${state.activeTab === 'commission' ? 'active' : ''}" onclick="window.ValoisPartner.switchTab('commission')">Commissions</button>
                        <button class="partner-nav-btn ${state.activeTab === 'integration' ? 'active' : ''}" onclick="window.ValoisPartner.switchTab('integration')">API Integration</button>
                    </div>
                </div>

                <!-- Dynamic Tab Contents Area -->
                <div class="partner-grid" id="partnerDynamicGrid">
                    <!-- Dynamic rendering outputs inside here -->
                </div>
            </div>
        `;
        renderTabContent();
    };

    // Dynamic Tab Renderer
    const renderTabContent = () => {
        const dynamicArea = document.getElementById('partnerDynamicGrid');
        if (!dynamicArea) return;

        if (state.activeTab === 'pipeline') {
            dynamicArea.innerHTML = `
                <!-- Pipeline Metric Stats -->
                <div class="col-12 metric-cards-strip">
                    <div class="partner-metric-card">
                        <div class="v-stat-lbl">Active Referrals</div>
                        <div class="v-stat-val" style="font-size: 22px; margin-top: 6px; color: var(--text-primary);">${state.referrals.length} Clients</div>
                    </div>
                    <div class="partner-metric-card">
                        <div class="v-stat-lbl">Aggregate Sourced Volume</div>
                        <div class="v-stat-val" style="font-size: 22px; margin-top: 6px; color: var(--accent-purple);">$15.85M</div>
                    </div>
                    <div class="partner-metric-card">
                        <div class="v-stat-lbl">Converted / Funded Rate</div>
                        <div class="v-stat-val" style="font-size: 22px; margin-top: 6px; color: var(--accent-emerald);">50.0%</div>
                    </div>
                    <div class="partner-metric-card">
                        <div class="v-stat-lbl">Total Sourced Commission</div>
                        <div class="v-stat-val" style="font-size: 22px; margin-top: 6px; color: var(--accent-purple);">$237,750</div>
                    </div>
                </div>

                <!-- Live Referrals Table -->
                <div class="partner-card col-12">
                    <div class="card-header" style="margin-bottom: 12px;">
                        <div class="card-title-group">
                            <div class="card-label">Sourced Deals</div>
                            <div class="card-title">Active Borrower Pipelines</div>
                        </div>
                        <button class="partner-btn" style="padding: 6px 14px; font-size: 11px;" onclick="window.ValoisPartner.addNewMockReferral()">+ Register Client</button>
                    </div>
                    <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 12px;">Real-time update of compliance processing, underwriter valuations, and matching capital indices of syndicate leads.</p>
                    
                    <div class="partner-table-wrap">
                        <table class="partner-table">
                            <thead>
                                <tr>
                                    <th>Client ID</th>
                                    <th>Corporate Name</th>
                                    <th>Submission Date</th>
                                    <th>Required Capacity</th>
                                    <th>Syndicate Status</th>
                                    <th>Origination Fee (1.5%)</th>
                                    <th>Settlement Payout</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.referrals.map(ref => `
                                    <tr>
                                        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-purple);">${ref.id}</td>
                                        <td style="font-weight: 600;">${ref.client}</td>
                                        <td>${ref.date}</td>
                                        <td style="font-family: var(--font-mono);">$${(ref.volume/1000000).toFixed(2)}M</td>
                                        <td><span class="status-badge status-${ref.status.toLowerCase()}">${ref.status}</span></td>
                                        <td style="font-family: var(--font-mono); color: var(--accent-emerald); font-weight:600;">$${ref.commission.toLocaleString()}</td>
                                        <td style="font-family: var(--font-mono); font-size: 12px;">${ref.estPayDate}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else if (state.activeTab === 'customizer') {
            dynamicArea.innerHTML = `
                <!-- White-label Setup Forms -->
                <div class="partner-card col-4">
                    <div class="card-header">
                        <div class="card-title-group">
                            <div class="card-label">Co-Brand Customizer</div>
                            <div class="card-title">Brand Variables</div>
                        </div>
                    </div>
                    <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 16px;">Customize styling targets below. These parameters rewrite CSS and layout configurations on public domains.</p>
                    
                    <div class="wl-customizer-form">
                        <div class="form-row">
                            <label>White-Label Brand Title</label>
                            <input class="form-input" id="wlFormBrandName" type="text" value="${state.coBranding.brandName}" oninput="window.ValoisPartner.updateWLConfig('brandName', this.value)">
                        </div>
                        <div class="form-row">
                            <label>Dedicated Co-Brand Domain</label>
                            <input class="form-input" id="wlFormDomain" type="text" style="font-family: var(--font-mono);" value="${state.coBranding.subdomain}" oninput="window.ValoisPartner.updateWLConfig('subdomain', this.value)">
                        </div>
                        <div class="form-row">
                            <label>Default Logo Character</label>
                            <input class="form-input" id="wlFormLogo" maxlength="1" type="text" style="text-align: center; font-weight: bold;" value="${state.coBranding.logoLetter}" oninput="window.ValoisPartner.updateWLConfig('logoLetter', this.value)">
                        </div>
                        <div class="form-row">
                            <label>Primary Theme Color Override</label>
                            <div class="color-picker-group">
                                <input type="color" class="color-box" value="${state.coBranding.primaryColor}" oninput="window.ValoisPartner.updateWLConfig('primaryColor', this.value)">
                                <span style="font-family: var(--font-mono); font-size: 12px;" id="primaryHexLabel">${state.coBranding.primaryColor}</span>
                            </div>
                        </div>
                        <div class="form-row">
                            <label>Accent Secondary Color Override</label>
                            <div class="color-picker-group">
                                <input type="color" class="color-box" value="${state.coBranding.accentColor}" oninput="window.ValoisPartner.updateWLConfig('accentColor', this.value)">
                                <span style="font-family: var(--font-mono); font-size: 12px;" id="accentHexLabel">${state.coBranding.accentColor}</span>
                            </div>
                        </div>
                        <div class="form-row" style="margin-top: 10px;">
                            <button class="partner-btn" onclick="window.ValoisPartner.applyThemeGlobal()">Apply Custom Aesthetic Live</button>
                        </div>
                    </div>
                </div>

                <!-- Real-time Live Public Workspace simulator preview -->
                <div class="partner-card col-8">
                    <div class="card-header">
                        <div class="card-title-group">
                            <div class="card-label">Live Workspace Simulation Preview</div>
                            <div class="card-title">Co-Branded Secure Workspace</div>
                        </div>
                        <span class="partner-badge-live" style="background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); color:#60a5fa;">SECURE SANDBOX</span>
                    </div>
                    <p style="font-size:11px; color: var(--text-secondary); margin-bottom: 12px;">This sandbox visualizes exactly how borrower-facing entities preview under your branded white-label portal nodes.</p>

                    <!-- Mock Client Portal Preview Element -->
                    <div class="partner-preview-frame">
                        <div class="partner-preview-header">
                            <div class="co-branded-logo-sim">
                                <div class="logo-box" id="previewLogoBox" style="background: linear-gradient(135deg, ${state.coBranding.primaryColor}, ${state.coBranding.accentColor})">${state.coBranding.logoLetter}</div>
                                <span id="previewBrandName">${state.coBranding.brandName}</span>
                            </div>
                            <span class="preview-badge" style="font-size: 9px;" id="previewDomainSim">${state.coBranding.subdomain}</span>
                        </div>

                        <div class="preview-pane" style="background: var(--bg-surface); padding: 14px; border: 1px solid var(--border-subtle); border-radius: 8px;">
                            <div class="preview-header" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px; margin-bottom: 10px;">
                                <span style="font-size: 12px; font-weight: 600;">Borrower Dashboard Workspace</span>
                                <span class="preview-badge" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); font-size:9px;">Tier-A Fully Verified</span>
                            </div>
                            <div class="preview-body-content">
                                <div class="preview-value-blocks" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                    <div class="val-block" style="background: var(--bg-surface-elevated); padding: 8px;">
                                        <div class="v-stat-lbl">Aggregate Limit</div>
                                        <div class="v-stat-val" style="font-size: 13px; margin-top: 4px;">$4.50M</div>
                                    </div>
                                    <div class="val-block" style="background: var(--bg-surface-elevated); padding: 8px;">
                                        <div class="v-stat-lbl">Assessment</div>
                                        <div class="v-stat-val" style="font-size: 13px; margin-top: 4px; color: ${state.coBranding.primaryColor};" id="previewWLTier">Standard Tier-A</div>
                                    </div>
                                    <div class="val-block" style="background: var(--bg-surface-elevated); padding: 8px;">
                                        <div class="v-stat-lbl">Weighted APR</div>
                                        <div class="v-stat-val" style="font-size: 13px; margin-top: 4px;">6.85% (Weighted)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 12px; font-size: 10px; color: var(--text-muted); text-align: center;">
                            Powered by Valois Intelligent Syndicate Routing Protocol. Private & Secure.
                        </div>
                    </div>
                </div>
            `;
        } else if (state.activeTab === 'commission') {
            dynamicArea.innerHTML = `
                <!-- Commission Tracking Hub -->
                <div class="partner-card col-4" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div class="card-header">
                            <div class="card-title-group">
                                <div class="card-label">Origination Payout Settings</div>
                                <div class="card-title">Sourced Allocation Yield</div>
                            </div>
                        </div>
                        <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">Our broker partner commission pool triggers a 1.5% origination settlement on finalized capital disbursements.</p>
                        
                        <div style="background: var(--bg-surface-elevated); padding: 16px; border-radius: 12px; border: 1px solid var(--border-subtle); margin-bottom: 16px;">
                            <div class="v-stat-lbl">Your Active Commission Multiplier</div>
                            <div style="font-family: var(--font-mono); font-size: 28px; font-weight: 700; color: var(--accent-emerald); margin-top: 4px;">1.50 %</div>
                            <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Base partner bracket tier. Next bracket: 1.75% at $25M Aggregate Volume.</div>
                        </div>
                    </div>
                    
                    <button class="partner-btn" onclick="alert('Payout Ledger generated & dispatched to linked financial routing system.')">Request Commission payout</button>
                </div>

                <!-- Ledger list of Settled/TBD payouts -->
                <div class="partner-card col-8">
                    <div class="card-header">
                        <div class="card-title-group">
                            <div class="card-label">Secured Settlements Ledger</div>
                            <div class="card-title">Earnings Distribution & Pay Dates</div>
                        </div>
                    </div>
                    <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 12px;">Review current earnings, processed payment rails, and estimated direct deposit distribution cycles.</p>

                    <div class="partner-table-wrap">
                        <table class="partner-table">
                            <thead>
                                <tr>
                                    <th>Ref ID</th>
                                    <th>Matched Client Name</th>
                                    <th>Funded Amount</th>
                                    <th>Net Payout Rate</th>
                                    <th>Commission Earned</th>
                                    <th>Payout Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.referrals.map(ref => `
                                    <tr>
                                        <td style="font-family: var(--font-mono);">${ref.id}</td>
                                        <td style="font-weight: 600;">${ref.client}</td>
                                        <td style="font-family: var(--font-mono);">$${ref.volume.toLocaleString()}</td>
                                        <td style="font-family: var(--font-mono);">1.50%</td>
                                        <td style="font-family: var(--font-mono); color: var(--accent-emerald); font-weight:600;">$${ref.commission.toLocaleString()}</td>
                                        <td>
                                            <span class="preview-badge" style="background: ${ref.estPayDate === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; color: ${ref.estPayDate === 'Paid' ? 'var(--accent-emerald)' : 'var(--accent-amber)'}; font-size: 10px;">
                                                ${ref.estPayDate === 'Paid' ? 'Paid & Dispatched' : 'Pending: ' + ref.estPayDate}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else if (state.activeTab === 'integration') {
            dynamicArea.innerHTML = `
                <!-- API Integration Workspace -->
                <div class="partner-card col-5">
                    <div class="card-header">
                        <div class="card-title-group">
                            <div class="card-label">Developer Integrations</div>
                            <div class="card-title">Portal APIs & Key Tokens</div>
                        </div>
                    </div>
                    <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 16px;">Programmatically inject client applications and trigger underwriting models using automated endpoints.</p>

                    <div class="wl-customizer-form">
                        <div class="form-row">
                            <label>Your Live Node Key Token</label>
                            <input class="form-input" style="font-family: var(--font-mono); font-size: 11px;" value="valois_live_node_pk_88019x3228aefbc771" readonly>
                        </div>
                        <div class="form-row">
                            <label>Default Direct Webhook URL</label>
                            <input class="form-input" style="font-family: var(--font-mono); font-size: 11px;" value="https://api.valois.capital/v1/node/callback" readonly>
                        </div>
                        <div class="form-row" style="margin-top: 10px;">
                            <button class="partner-btn" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-muted); color: var(--text-primary);" onclick="alert('API Secret reset request initiated.')">Reset Key Tokens</button>
                        </div>
                    </div>
                </div>

                <!-- Embedding Guide & Widgets Code Block -->
                <div class="partner-card col-7">
                    <div class="card-header">
                        <div class="card-title-group">
                            <div class="card-label">White-Label Embedded Snippet</div>
                            <div class="card-title">Lead Capture iframe Generator</div>
                        </div>
                    </div>
                    <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 12px;">Integrate our dynamic Funding Readiness Widget directly into your broker corporate landing page to auto-tag prospects with your Node ID.</p>
                    
                    <div class="v-stat-lbl" style="margin-top: 14px;">HTML Embedded Target Script</div>
                    <code class="embed-block">&lt;!-- Valois White-Label Lead Capture Widget --&gt;
&lt;iframe 
    src="https://secure.valois.capital/widget?node_key=88019x322&brand=${encodeURIComponent(state.coBranding.brandName)}&primary=${encodeURIComponent(state.coBranding.primaryColor)}" 
    width="100%" 
    height="650px" 
    frameborder="0" 
    class="valois-secured-node-iframe"&gt;
&lt;/iframe&gt;</code>
                </div>
            `;
        }
    };

    // 2. Global Event Exposure APIs
    window.ValoisPartner = {
        switchTab: (tabName) => {
            state.activeTab = tabName;
            renderPartnerPortalWorkspace(document.querySelector('.bento-grid'));
        },
        updateWLConfig: (property, value) => {
            state.coBranding[property] = value;
            
            // Dynamic sync values on live sandboxed previews
            const brandDisplay = document.getElementById('previewBrandName');
            const logoBox = document.getElementById('previewLogoBox');
            const domainSim = document.getElementById('previewDomainSim');

            if (brandDisplay) brandDisplay.textContent = state.coBranding.brandName;
            if (logoBox) {
                logoBox.textContent = state.coBranding.logoLetter;
                logoBox.style.background = `linear-gradient(135deg, ${state.coBranding.primaryColor}, ${state.coBranding.accentColor})`;
            }
            if (domainSim) domainSim.textContent = state.coBranding.subdomain;

            // Update HEX labels on Customizer
            const primaryHex = document.getElementById('primaryHexLabel');
            const accentHex = document.getElementById('accentHexLabel');
            if (primaryHex) primaryHex.textContent = state.coBranding.primaryColor;
            if (accentHex) accentHex.textContent = state.coBranding.accentColor;
        },
        applyThemeGlobal: () => {
            // Apply live co-branding rules dynamically to parent UI baseline components!
            const root = document.documentElement;
            root.style.setProperty('--accent-purple', state.coBranding.primaryColor);
            root.style.setProperty('--accent-purple-glow', state.coBranding.primaryColor + '20'); // append opacity
            
            // Update co-branded partner cards in background
            const wlComponent = document.getElementById('whiteLabelComponent');
            if (wlComponent) {
                wlComponent.style.borderColor = state.coBranding.primaryColor;
                document.getElementById('wlBrandTitle').textContent = `${state.coBranding.brandName} - Secure Vault`;
                document.getElementById('wlBrandSubtitle').textContent = `${state.coBranding.subdomain}`;
                document.getElementById('wlModeLabel').textContent = "Syndicate Co-Branding Override Active";
                document.getElementById('wlSelectedName').textContent = `Syndicated Underwriting Pipeline via ${state.coBranding.brandName}`;
            }

            alert(`Co-Branded parameters pushed successfully!\nTheme and variable configurations mapped to node: ${state.coBranding.subdomain}`);
        },
        addNewMockReferral: () => {
            const name = prompt("Enter Sourced Borrower Corporate Name:");
            if (!name) return;
            const volStr = prompt("Enter Funding Capacity Required (e.g. 5000000):", "2500000");
            const vol = parseInt(volStr) || 2500000;

            const randomId = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
            const today = new Date().toISOString().split('T')[0];
            const commission = Math.round(vol * state.commissionRate);

            state.referrals.unshift({
                id: randomId,
                client: name,
                date: today,
                volume: vol,
                status: 'Submitted',
                commission: commission,
                estPayDate: 'TBD'
            });

            // Re-render
            renderTabContent();
        }
    };

    // 3. Document Initialization Entry
    const init = () => {
        injectStyles();
        injectHeaderControl();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();