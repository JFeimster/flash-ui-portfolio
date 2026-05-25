// Core Flow Fintech Utility - Multi-Step Submission Wizard & Dossier Generator
// Incorporates a 3-attachment secure uploader with active malware-scanning simulations

(function() {
    // 1. Inject Neobrutalist Styles for the Multi-Step Wizard Modal
    const style = document.createElement('style');
    style.innerHTML = `
        /* Wizard Modal Backdrop */
        .wizard-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(8, 9, 13, 0.9);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .wizard-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* Container Frame */
        .wizard-container {
            width: 100%;
            max-width: 800px;
            background: var(--bg-secondary);
            border: 4px solid var(--border-color);
            box-shadow: 12px 12px 0px #000000;
            border-radius: 0px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.95);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            max-height: 90vh;
        }

        .wizard-overlay.active .wizard-container {
            transform: scale(1);
        }

        /* Header */
        .wizard-header {
            background: var(--bg-tertiary);
            padding: 24px;
            border-bottom: 4px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .wizard-title {
            font-family: var(--font-display);
            font-size: 22px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .wizard-close {
            background: transparent;
            border: 2px solid var(--border-color);
            color: var(--text-secondary);
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-family: var(--font-display);
            cursor: pointer;
            transition: all 0.1s ease;
        }

        .wizard-close:hover {
            background: var(--accent-magenta);
            color: #000;
            border-color: #000;
            box-shadow: 2px 2px 0px #000;
        }

        /* Progress Steps Bar */
        .wizard-steps-bar {
            background: var(--bg-primary);
            border-bottom: 2px solid var(--border-color);
            display: grid;
            grid-template-columns: repeat(4, 1fr);
        }

        .wizard-step-tab {
            padding: 14px;
            text-align: center;
            font-family: var(--font-display);
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-secondary);
            border-right: 2px solid var(--border-color);
            position: relative;
            background: var(--bg-primary);
        }

        .wizard-step-tab:last-child {
            border-right: none;
        }

        .wizard-step-tab.completed {
            color: var(--accent-lime);
            background: rgba(57, 255, 20, 0.03);
        }

        .wizard-step-tab.active {
            color: var(--accent-cyan);
            background: var(--bg-tertiary);
        }

        .wizard-step-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: var(--accent-cyan);
        }

        /* Wizard Content Areas */
        .wizard-body {
            padding: 32px;
            overflow-y: auto;
            flex-grow: 1;
            background: var(--bg-secondary);
        }

        .wizard-step-panel {
            display: none;
            animation: fadeInStep 0.25s ease forwards;
        }

        .wizard-step-panel.active {
            display: block;
        }

        @keyframes fadeInStep {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Form styling */
        .wizard-form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 640px) {
            .wizard-form-grid {
                grid-template-columns: 1fr;
            }
        }

        .wizard-label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-secondary);
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }

        .wizard-input, .wizard-select {
            width: 100%;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            outline: none;
            transition: border-color 0.2s;
        }

        .wizard-input:focus, .wizard-select:focus {
            border-color: var(--accent-cyan);
        }

        .wizard-select option {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }

        /* 3-Attachment Uploader Layout */
        .uploader-system {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .upload-slot {
            background: var(--bg-tertiary);
            border: 2px dashed var(--border-color);
            padding: 20px;
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: 20px;
            position: relative;
            transition: all 0.2s ease;
        }

        @media (max-width: 640px) {
            .upload-slot {
                grid-template-columns: 1fr;
                text-align: center;
                justify-items: center;
            }
        }

        .upload-slot.dragover {
            border-color: var(--accent-cyan);
            background: rgba(0, 240, 255, 0.03);
        }

        .upload-slot.success {
            border-color: var(--accent-lime);
            border-style: solid;
        }

        .upload-slot-icon {
            font-size: 28px;
            width: 56px;
            height: 56px;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .upload-slot.success .upload-slot-icon {
            border-color: var(--accent-lime);
            color: var(--accent-lime);
        }

        .upload-slot-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .upload-slot-title {
            font-family: var(--font-display);
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-primary);
        }

        .upload-slot-desc {
            font-size: 11px;
            color: var(--text-secondary);
        }

        .upload-btn-trigger {
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            color: var(--text-primary);
            padding: 8px 16px;
            font-family: var(--font-display);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.1s ease;
        }

        .upload-btn-trigger:hover {
            border-color: var(--accent-cyan);
            color: var(--accent-cyan);
        }

        /* Security Scanning Status Console */
        .scanner-console {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            padding: 8px 12px;
            font-family: monospace;
            font-size: 11px;
            color: var(--text-secondary);
            display: none;
            flex-direction: column;
            gap: 2px;
            margin-top: 10px;
            width: 100%;
            grid-column: span 3;
            border-left: 3px solid var(--accent-orange);
        }

        .scanner-console.scanning {
            display: flex;
            animation: blinker 1s linear infinite;
        }

        @keyframes blinker {
            50% { border-left-color: transparent; }
        }

        .scanner-bar {
            width: 100%;
            height: 4px;
            background: var(--border-color);
            position: relative;
            margin-top: 6px;
            overflow: hidden;
        }

        .scanner-progress {
            width: 0%;
            height: 100%;
            background: var(--accent-orange);
            transition: width 0.1s linear;
        }

        .scanner-status-text {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Footer Controllers */
        .wizard-footer {
            background: var(--bg-tertiary);
            padding: 24px 32px;
            border-top: 4px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .wizard-btn-prev {
            background: transparent;
            color: var(--text-primary);
            border: 2px solid var(--border-color);
            padding: 12px 24px;
            font-family: var(--font-display);
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.1s ease;
        }

        .wizard-btn-prev:hover {
            border-color: var(--accent-magenta);
            color: var(--accent-magenta);
        }

        .wizard-btn-prev:disabled {
            opacity: 0.3;
            cursor: not-allowed;
            border-color: var(--border-color);
            color: var(--text-secondary);
        }

        /* Summary Dossier Grid */
        .summary-dossier {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .dossier-header-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px dashed var(--border-color);
            padding-bottom: 12px;
            margin-bottom: 4px;
        }

        .dossier-id {
            font-family: var(--font-display);
            font-weight: 800;
            color: var(--accent-cyan);
            font-size: 14px;
        }

        .dossier-item {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
        }

        .dossier-key {
            color: var(--text-secondary);
            text-transform: uppercase;
            font-weight: 600;
        }

        .dossier-val {
            color: var(--text-primary);
            font-weight: 700;
            text-align: right;
        }

        .success-checkmark {
            color: var(--accent-lime);
            font-size: 54px;
            text-align: center;
            margin-bottom: 12px;
        }
    `;
    document.head.appendChild(style);

    // 2. Build and Append Wizard HTML structure into document.body
    const wizardModal = document.createElement('div');
    wizardModal.className = 'wizard-overlay';
    wizardModal.id = 'coreflow-wizard-modal';

    wizardModal.innerHTML = `
        <div class="wizard-container">
            <div class="wizard-header">
                <div class="wizard-title">
                    <span style="background: var(--accent-cyan); color:#000; padding:2px 8px; font-weight:900;">CF</span>
                    Initiate Case Dossier
                </div>
                <button class="wizard-close" id="wizard-close-btn">&times;</button>
            </div>

            <!-- Progression Tracking Steps -->
            <div class="wizard-steps-bar">
                <div class="wizard-step-tab active" data-step="1">1. PROFILE</div>
                <div class="wizard-step-tab" data-step="2">2. METRICS</div>
                <div class="wizard-step-tab" data-step="3">3. DOCUMENTS</div>
                <div class="wizard-step-tab" data-step="4">4. DOSSIER</div>
            </div>

            <div class="wizard-body">
                <!-- Step 1 Panel: Case Profile -->
                <div class="wizard-step-panel active" data-step="1">
                    <h3 style="font-family: var(--font-display); margin-bottom: 16px; text-transform: uppercase; color: var(--accent-cyan);">Dossier Base Profile</h3>
                    <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 24px; line-height: 1.5;">Enter legal organizational identifiers to map standard structural profiles across our indexing filters.</p>
                    
                    <div class="wizard-form-grid">
                        <div>
                            <label class="wizard-label">Legal Business Name</label>
                            <input type="text" id="wz-biz-name" class="wizard-input" placeholder="e.g. Apex Global Systems LLC">
                        </div>
                        <div>
                            <label class="wizard-label">Entity Structure</label>
                            <select id="wz-entity-type" class="wizard-select">
                                <option value="LLC">Limited Liability Company (LLC)</option>
                                <option value="C-Corp">C-Corporation</option>
                                <option value="S-Corp">S-Corporation</option>
                                <option value="Sole-Prop">Sole Proprietorship</option>
                            </select>
                        </div>
                        <div>
                            <label class="wizard-label">Capital Destination Target</label>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span id="wz-target-val" style="color: var(--accent-cyan); font-family: var(--font-display); font-weight: 700;">$150,000</span>
                            </div>
                            <input type="range" min="25000" max="2500000" step="25000" value="150000" class="range-slider" id="wz-target-slider">
                        </div>
                        <div>
                            <label class="wizard-label">Primary Funding Purpose</label>
                            <select id="wz-purpose" class="wizard-select">
                                <option value="Working Capital">Working Capital</option>
                                <option value="Equipment Acquisition">Equipment Acquisition</option>
                                <option value="Accounts Receivable Expansion">AR Expansion</option>
                                <option value="Real Estate Leverage">Real Estate Leverage</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Step 2 Panel: Core Metrics Verification -->
                <div class="wizard-step-panel" data-step="2">
                    <h3 style="font-family: var(--font-display); margin-bottom: 16px; text-transform: uppercase; color: var(--accent-orange);">Verified Core Metrics</h3>
                    <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 24px; line-height: 1.5;">Index baseline thresholds required to run client-side algorithmic eligibility conversions.</p>

                    <div class="wizard-form-grid">
                        <div>
                            <label class="wizard-label">Time in Business (Years)</label>
                            <select id="wz-time-biz" class="wizard-select">
                                <option value="Under 1 year">Under 1 Year</option>
                                <option value="1-3 Years">1 - 3 Years</option>
                                <option value="3+ Years">3+ Years</option>
                            </select>
                        </div>
                        <div>
                            <label class="wizard-label">Avg. Gross Monthly Revenue</label>
                            <select id="wz-revenue" class="wizard-select">
                                <option value="$10k - $25k">$10,000 - $25,000</option>
                                <option value="$25k - $100k">$25,000 - $100,000</option>
                                <option value="$100k - $250k">$100,000 - $250,000</option>
                                <option value="$250k+">$250,000+</option>
                            </select>
                        </div>
                        <div>
                            <label class="wizard-label">Current Owner Credit Range (FICO)</label>
                            <select id="wz-fico" class="wizard-select">
                                <option value="Excellent (720+)">Excellent (720+)</option>
                                <option value="Good (660-719)">Good (660-719)</option>
                                <option value="Fair (600-659)">Fair (600-659)</option>
                                <option value="Subprime (<600)">Subprime (< 600)</option>
                            </select>
                        </div>
                        <div>
                            <label class="wizard-label">Active Outstanding Debt (Monthly Payments)</label>
                            <input type="text" id="wz-debt" class="wizard-input" placeholder="e.g. $2,500" value="$0">
                        </div>
                    </div>
                </div>

                <!-- Step 3 Panel: Secure Document Uploader (3-Attachment) -->
                <div class="wizard-step-panel" data-step="3">
                    <h3 style="font-family: var(--font-display); margin-bottom: 8px; text-transform: uppercase; color: var(--accent-magenta);">Encrypted Document Locker</h3>
                    <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 20px; line-height: 1.5;">
                        Acknowledge core validation protocols. All modules run client-side sandbox validation including structural MIME inspection and active malware detection sweeps.
                    </p>

                    <div class="uploader-system">
                        <!-- Slot 1: Bank Statements -->
                        <div class="upload-slot" id="slot-bank" data-filetype="pdf">
                            <div class="upload-slot-icon">🏦</div>
                            <div class="upload-slot-info">
                                <span class="upload-slot-title">Bank Statements (PDF Format)</span>
                                <span class="upload-slot-desc" id="slot-bank-desc">Upload past 3 months bank histories (Max size: 10MB)</span>
                            </div>
                            <button class="upload-btn-trigger" data-slot="bank">Browse</button>
                            <input type="file" id="input-bank" accept="application/pdf" style="display: none;">
                            
                            <div class="scanner-console" id="console-bank">
                                <div class="scanner-status-text">
                                    <span id="scan-text-bank">MIME Handshake Active...</span>
                                    <span id="scan-pct-bank">0%</span>
                                </div>
                                <div class="scanner-bar"><div class="scanner-progress" id="progress-bank"></div></div>
                            </div>
                        </div>

                        <!-- Slot 2: P&L / Tax Statement -->
                        <div class="upload-slot" id="slot-tax" data-filetype="pdf">
                            <div class="upload-slot-icon">📉</div>
                            <div class="upload-slot-info">
                                <span class="upload-slot-title">Year-To-Date Profit & Loss (PDF Format)</span>
                                <span class="upload-slot-desc" id="slot-tax-desc">Operational P&L statements or corporate returns (Max size: 10MB)</span>
                            </div>
                            <button class="upload-btn-trigger" data-slot="tax">Browse</button>
                            <input type="file" id="input-tax" accept="application/pdf" style="display: none;">

                            <div class="scanner-console" id="console-tax">
                                <div class="scanner-status-text">
                                    <span id="scan-text-tax">MIME Handshake Active...</span>
                                    <span id="scan-pct-tax">0%</span>
                                </div>
                                <div class="scanner-bar"><div class="scanner-progress" id="progress-tax"></div></div>
                            </div>
                        </div>

                        <!-- Slot 3: Corporate Identity/License -->
                        <div class="upload-slot" id="slot-id" data-filetype="pdf,jpg,png">
                            <div class="upload-slot-icon">🪪</div>
                            <div class="upload-slot-info">
                                <span class="upload-slot-title">Authorized Corporate ID / EIN Certificate</span>
                                <span class="upload-slot-desc" id="slot-id-desc">Clear image or documentation verifying authority status (Max size: 5MB)</span>
                            </div>
                            <button class="upload-btn-trigger" data-slot="id">Browse</button>
                            <input type="file" id="input-id" accept="application/pdf,image/jpeg,image/png" style="display: none;">

                            <div class="scanner-console" id="console-id">
                                <div class="scanner-status-text">
                                    <span id="scan-text-id">MIME Handshake Active...</span>
                                    <span id="scan-pct-id">0%</span>
                                </div>
                                <div class="scanner-bar"><div class="scanner-progress" id="progress-id"></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 4 Panel: Review & Dossier Summary -->
                <div class="wizard-step-panel" data-step="4">
                    <div id="wz-complete-layout" style="display:none;">
                        <div class="success-checkmark">✓</div>
                        <h3 style="font-family: var(--font-display); text-align:center; margin-bottom: 8px; text-transform: uppercase; color: var(--accent-lime);">Dossier Secured & Transmitted</h3>
                        <p style="color: var(--text-secondary); text-align:center; font-size: 13px; margin-bottom: 24px; line-height: 1.5;">
                            Calculation index models matching database successfully bound. A copy of local dossier hashes has been simulated below.
                        </p>
                    </div>

                    <div id="wz-summary-layout">
                        <h3 style="font-family: var(--font-display); margin-bottom: 12px; text-transform: uppercase; color: var(--text-primary);">Dossier Package Review</h3>
                        <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 20px; line-height: 1.5;">Verify output targets below before final index commit verification.</p>
                    </div>

                    <div class="summary-dossier">
                        <div class="dossier-header-row">
                            <span style="font-size: 11px; text-transform: uppercase; font-weight:800; color: var(--text-secondary);">Core Index Code</span>
                            <span class="dossier-id" id="dossier-id-val">GENERATING...</span>
                        </div>
                        <div class="dossier-item">
                            <span class="dossier-key">Business:</span>
                            <span class="dossier-val" id="sum-biz">-</span>
                        </div>
                        <div class="dossier-item">
                            <span class="dossier-key">Entity type:</span>
                            <span class="dossier-val" id="sum-entity">-</span>
                        </div>
                        <div class="dossier-item">
                            <span class="dossier-key">Target Capital:</span>
                            <span class="dossier-val" id="sum-target">-</span>
                        </div>
                        <div class="dossier-item">
                            <span class="dossier-key">Time In Business:</span>
                            <span class="dossier-val" id="sum-time">-</span>
                        </div>
                        <div class="dossier-item">
                            <span class="dossier-key">Avg Revenue Range:</span>
                            <span class="dossier-val" id="sum-revenue">-</span>
                        </div>
                        <div class="dossier-item">
                            <span class="dossier-key">Mime/File Lock:</span>
                            <span class="dossier-val" id="sum-files" style="color: var(--accent-orange);">0 of 3 Uploaded</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Buttons -->
            <div class="wizard-footer">
                <button class="wizard-btn-prev" id="wz-btn-prev" disabled>Back</button>
                <button class="btn-action" id="wz-btn-next" style="padding: 12px 28px; box-shadow: 4px 4px 0px #000;">Proceed</button>
            </div>
        </div>
    `;
    document.body.appendChild(wizardModal);

    // 3. Application State & Interaction Logic
    let currentStep = 1;
    const totalSteps = 4;
    const filesUploaded = { bank: null, tax: null, id: null };
    const filesScanning = { bank: false, tax: false, id: false };

    // Elements
    const targetSlider = document.getElementById('wz-target-slider');
    const targetVal = document.getElementById('wz-target-val');
    const closeBtn = document.getElementById('wizard-close-btn');
    const btnNext = document.getElementById('wz-btn-next');
    const btnPrev = document.getElementById('wz-btn-prev');

    // Display Slider Value Change
    targetSlider.addEventListener('input', (e) => {
        targetVal.innerText = `$${parseInt(e.target.value).toLocaleString()}`;
    });

    // Toggle Modal State
    function toggleWizard(show) {
        if (show) {
            wizardModal.classList.add('active');
            updateStepView();
        } else {
            wizardModal.classList.remove('active');
        }
    }

    // Connect Intercept triggers to custom page elements
    function setupInterceptors() {
        // Target buttons like "Talk to a Strategist" to trigger wizard modal
        const strategistBtns = document.querySelectorAll('a[href*="mailto:strategy@coreflow.example.com"]');
        strategistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleWizard(true);
            });
        });

        // Add optional extra action items
        const launchBtn = document.querySelector('.nav-header .btn-action');
        if (launchBtn) {
            launchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleWizard(true);
            });
        }
    }

    // Step Rendering logic
    function updateStepView() {
        // Render Active Panels
        document.querySelectorAll('.wizard-step-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.querySelector(`.wizard-step-panel[data-step="${currentStep}"]`).classList.add('active');

        // Render Tabs Active/Progress states
        document.querySelectorAll('.wizard-step-tab').forEach(tab => {
            const stepNum = parseInt(tab.dataset.step);
            tab.className = 'wizard-step-tab';
            if (stepNum === currentStep) {
                tab.classList.add('active');
            } else if (stepNum < currentStep) {
                tab.classList.add('completed');
            }
        });

        // Toggle back buttons
        btnPrev.disabled = (currentStep === 1);

        // Adjust Next Action Label & state checks
        if (currentStep === 3) {
            btnNext.innerText = 'Run Risk Engine';
            validateStepThreeButton();
        } else if (currentStep === totalSteps) {
            const activeComplete = document.getElementById('wz-complete-layout').style.display === 'block';
            btnNext.innerText = activeComplete ? 'Close Sandbox' : 'Authorize Indexing';
            btnNext.disabled = false;
        } else {
            btnNext.innerText = 'Proceed';
            btnNext.disabled = false;
        }

        if (currentStep === 4) {
            compileDossierData();
        }
    }

    // 4. Multi-Step Form Validations
    function validateStepThreeButton() {
        // Step 3 requires at least one core document fully uploaded and malware scanned to proceed.
        const anyUploaded = Object.values(filesUploaded).some(f => f !== null);
        const anyActiveScan = Object.values(filesScanning).some(s => s === true);
        
        btnNext.disabled = !anyUploaded || anyActiveScan;
    }

    // Generate random mock tracking ID
    function generateDossierHash() {
        const seg1 = Math.floor(Math.random() * 9000 + 1000);
        const seg2 = Math.floor(Math.random() * 9000 + 1000);
        return `CORE-FLOW-${seg1}-${seg2}`;
    }

    // Compile values onto final confirmation tab
    function compileDossierData() {
        const bizName = document.getElementById('wz-biz-name').value || 'Apex Dynamic Holdings';
        const entity = document.getElementById('wz-entity-type').value;
        const target = targetVal.innerText;
        const timeBiz = document.getElementById('wz-time-biz').value;
        const rev = document.getElementById('wz-revenue').value;

        document.getElementById('sum-biz').innerText = bizName;
        document.getElementById('sum-entity').innerText = entity;
        document.getElementById('sum-target').innerText = target;
        document.getElementById('sum-time').innerText = timeBiz;
        document.getElementById('sum-revenue').innerText = rev;

        // Hash code assignment
        if (document.getElementById('dossier-id-val').innerText === 'GENERATING...') {
            document.getElementById('dossier-id-val').innerText = generateDossierHash();
        }

        // Count file structures
        const count = Object.values(filesUploaded).filter(f => f !== null).length;
        const fileLabel = document.getElementById('sum-files');
        fileLabel.innerText = `${count} of 3 Safe Files Lock`;
        if (count === 3) {
            fileLabel.style.color = 'var(--accent-lime)';
        } else if (count > 0) {
            fileLabel.style.color = 'var(--accent-cyan)';
        } else {
            fileLabel.style.color = 'var(--accent-orange)';
        }
    }

    // Core Step Control Engine Navigation
    btnNext.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepView();
        } else {
            // Processing step 4 Submit action
            const completeLayout = document.getElementById('wz-complete-layout');
            const summaryLayout = document.getElementById('wz-summary-layout');
            
            if (completeLayout.style.display === 'block') {
                // If already complete, next click closes the modal
                toggleWizard(false);
            } else {
                // Trigger transition animation to complete
                completeLayout.style.display = 'block';
                summaryLayout.style.display = 'none';
                btnNext.innerText = 'Close Sandbox';
                
                // Show floating notification on main application wrapper
                if (window.showNotification) {
                    window.showNotification('Dossier Committed Client-Side Successfully');
                }
            }
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepView();
        }
    });

    closeBtn.addEventListener('click', () => toggleWizard(false));

    // Close on backdrop overlay click
    wizardModal.addEventListener('click', (e) => {
        if (e.target === wizardModal) {
            toggleWizard(false);
        }
    });

    // 5. Encrypted File Locker Logic with Malware Scanning Engine Simulators
    function registerUploadSlot(slotId) {
        const slotEl = document.getElementById(`slot-${slotId}`);
        const inputEl = document.getElementById(`input-${slotId}`);
        const btnEl = slotEl.querySelector('.upload-btn-trigger');

        btnEl.addEventListener('click', () => inputEl.click());

        inputEl.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                processFileSelection(slotId, e.target.files[0]);
            }
        });

        // Add drag & drop event integrations
        slotEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            slotEl.classList.add('dragover');
        });

        slotEl.addEventListener('dragleave', () => {
            slotEl.classList.remove('dragover');
        });

        slotEl.addEventListener('drop', (e) => {
            e.preventDefault();
            slotEl.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                processFileSelection(slotId, e.dataTransfer.files[0]);
            }
        });
    }

    function processFileSelection(slotId, file) {
        const slotEl = document.getElementById(`slot-${slotId}`);
        const descEl = document.getElementById(`slot-${slotId}-desc`);
        
        // Instant Validation: limit parameters
        const maxSize = slotId === 'id' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
        const validTypes = slotId === 'id' ? ['application/pdf', 'image/jpeg', 'image/png'] : ['application/pdf'];

        if (!validTypes.includes(file.type)) {
            descEl.innerText = 'INVALID FORMAT. MUST USE TARGET LOCK FILE-TYPE CONVERSIONS';
            descEl.style.color = 'var(--accent-magenta)';
            return;
        }

        if (file.size > maxSize) {
            descEl.innerText = 'OVERSIZE EXCEPTION. LIMIT EXCEEDS STRUCTURAL MAX ALLOCATION.';
            descEl.style.color = 'var(--accent-magenta)';
            return;
        }

        // Lock file payload state
        filesUploaded[slotId] = file;
        filesScanning[slotId] = true;
        validateStepThreeButton();

        // Run security visualization module
        simulateSecurityShield(slotId, file.name);
    }

    function simulateSecurityShield(slotId, filename) {
        const consoleEl = document.getElementById(`console-${slotId}`);
        const progressEl = document.getElementById(`progress-${slotId}`);
        const textEl = document.getElementById(`scan-text-${slotId}`);
        const pctEl = document.getElementById(`scan-pct-${slotId}`);
        const slotEl = document.getElementById(`slot-${slotId}`);
        const descEl = document.getElementById(`slot-${slotId}-desc`);

        // Display Console block
        consoleEl.style.display = 'flex';
        progressEl.style.width = '0%';
        
        let progress = 0;
        const scanSteps = [
            'MIME Check Initiated...',
            'Executing Bitwise MD5 signature scans...',
            'Executing structural signature match...',
            'Checking sandbox logic boundaries...',
            'MALWARE STATUS: SECURE'
        ];

        const interval = setInterval(() => {
            progress += 10;
            progressEl.style.width = `${progress}%`;
            pctEl.innerText = `${progress}%`;

            const currentMsgIndex = Math.min(Math.floor(progress / 25), scanSteps.length - 1);
            textEl.innerText = scanSteps[currentMsgIndex];

            if (progress >= 100) {
                clearInterval(interval);
                
                // Clear active scanning flags
                filesScanning[slotId] = false;
                
                // Set Secure Verified Layout
                slotEl.classList.add('success');
                descEl.innerText = `Verified: ${filename} (LOCK SAFE)`;
                descEl.style.color = 'var(--accent-lime)';
                consoleEl.style.display = 'none';

                // Re-evaluate eligibility block values
                validateStepThreeButton();
            }
        }, 300);
    }

    // 6. Initialization Sequence Hook-up
    window.addEventListener('load', () => {
        setupInterceptors();
        registerUploadSlot('bank');
        registerUploadSlot('tax');
        registerUploadSlot('id');
    });

    // Expose Global Module Controllers
    window.CoreFlowWizard = {
        open: () => toggleWizard(true),
        close: () => toggleWizard(false)
    };
})();