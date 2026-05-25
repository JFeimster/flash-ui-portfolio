(function() {
    // 1. Inject Stylesheets dynamically into the document head
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* High-Voltage Neobrutalist Wizard Styles */
        .coreflow-wizard-launcher {
            position: fixed;
            bottom: 30px;
            left: 30px;
            z-index: 999;
            background: var(--accent-magenta);
            color: #000;
            border: 3px solid #000;
            padding: 14px 24px;
            font-family: var(--font-display);
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 6px 6px 0px #000;
            transition: all 0.1s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .coreflow-wizard-launcher:hover {
            box-shadow: 2px 2px 0px #000;
            transform: translate(4px, 4px);
            background: #fff;
        }

        .coreflow-wizard-launcher .pulse-dot {
            width: 10px;
            height: 10px;
            background: #000;
            border-radius: 50%;
            animation: cf-wizard-pulse 1s infinite alternate;
        }

        @keyframes cf-wizard-pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1.2); opacity: 1; }
        }

        /* Modal Overlay backdrop */
        .cf-wizard-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(8, 9, 13, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            padding: 20px;
            overflow-y: auto;
        }

        .cf-wizard-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* Core Card Container */
        .cf-wizard-card {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            box-shadow: var(--brutal-shadow);
            width: 100%;
            max-width: 850px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            overflow: hidden;
            transform: scale(0.95);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cf-wizard-overlay.active .cf-wizard-card {
            transform: scale(1);
        }

        /* Term Header Style matching terminal visualizer */
        .cf-wizard-header {
            background: var(--bg-tertiary);
            padding: 16px 24px;
            border-bottom: 2px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cf-wizard-close {
            background: transparent;
            border: 2px solid var(--border-color);
            color: var(--text-secondary);
            font-size: 20px;
            line-height: 1;
            padding: 4px 10px;
            cursor: pointer;
            font-weight: 700;
            font-family: var(--font-display);
        }

        .cf-wizard-close:hover {
            color: var(--accent-magenta);
            border-color: var(--accent-magenta);
            background: rgba(255, 0, 122, 0.05);
        }

        /* Progress Steps Timeline tracker */
        .cf-wizard-steps {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            border-bottom: 2px solid var(--border-color);
            background: var(--bg-primary);
        }

        .cf-step-tab {
            padding: 14px 20px;
            text-align: center;
            font-family: var(--font-display);
            font-size: 11px;
            font-weight: 800;
            color: var(--text-secondary);
            border-right: 1.5px solid var(--border-color);
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
        }

        .cf-step-tab:last-child {
            border-right: none;
        }

        .cf-step-tab.active {
            color: var(--accent-cyan);
            background: var(--bg-secondary);
        }

        .cf-step-tab.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 4px;
            background: var(--accent-cyan);
        }

        .cf-step-tab.completed {
            color: var(--accent-lime);
        }

        /* Form Wizard Layout Panels */
        .cf-wizard-body {
            padding: 32px;
            overflow-y: auto;
            flex-grow: 1;
        }

        .cf-wizard-panel {
            display: none;
            flex-direction: column;
            gap: 24px;
        }

        .cf-wizard-panel.active {
            display: flex;
        }

        /* Generic Ingestion Input Styling */
        .cf-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 600px) {
            .cf-form-row {
                grid-template-columns: 1fr;
            }
        }

        .cf-field-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .cf-label {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: var(--text-secondary);
            letter-spacing: 1px;
        }

        .cf-input, .cf-select {
            width: 100%;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            color: var(--text-primary);
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
            outline: none;
            transition: all 0.2s ease;
        }

        .cf-input:focus, .cf-select:focus {
            border-color: var(--accent-magenta);
            box-shadow: 0 0 10px rgba(255, 0, 122, 0.15);
        }

        /* Attachment Vault Upload Slot Container */
        .cf-upload-vault {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .cf-upload-slot {
            background: var(--bg-tertiary);
            border: 2px dashed var(--border-color);
            padding: 20px;
            display: grid;
            grid-template-columns: 50px 1fr auto;
            align-items: center;
            gap: 20px;
            position: relative;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .cf-upload-slot:hover {
            border-color: var(--accent-cyan);
            background: rgba(0, 240, 255, 0.02);
        }

        .cf-upload-slot.dragover {
            border-color: var(--accent-lime);
            background: rgba(57, 255, 20, 0.05);
        }

        .cf-slot-icon {
            font-size: 24px;
            width: 44px;
            height: 44px;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cf-slot-meta {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .cf-slot-title {
            font-family: var(--font-display);
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
        }

        .cf-slot-desc {
            font-size: 11px;
            color: var(--text-secondary);
        }

        .cf-status-badge {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            padding: 6px 12px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .cf-status-badge.scanning {
            color: var(--accent-orange);
            border-color: var(--accent-orange);
        }

        .cf-status-badge.verified {
            color: var(--accent-lime);
            border-color: var(--accent-lime);
            text-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
        }

        .cf-status-badge.error {
            color: var(--accent-magenta);
            border-color: var(--accent-magenta);
        }

        /* Animated Malware scanner loading bar overlay */
        .cf-scan-track {
            height: 3px;
            background: var(--bg-primary);
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            overflow: hidden;
            display: none;
        }

        .cf-scan-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--accent-orange), var(--accent-lime));
        }

        /* Panel 3: Seal Integrity Dashboard Summary */
        .cf-summary-console {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 20px;
            font-family: monospace;
            color: var(--accent-cyan);
            font-size: 12px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 250px;
            overflow-y: auto;
            border-radius: 4px;
        }

        .cf-summary-line {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed var(--border-color);
            padding-bottom: 6px;
        }

        .cf-summary-val {
            color: var(--text-primary);
            font-weight: bold;
        }

        /* Action Nav Footer in modal */
        .cf-wizard-footer {
            padding: 20px 32px;
            border-top: 2px solid var(--border-color);
            background: var(--bg-tertiary);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Verification validation errors warnings */
        .cf-warning-banner {
            background: rgba(255, 92, 0, 0.1);
            border: 1px solid var(--accent-orange);
            color: var(--accent-orange);
            font-size: 12px;
            padding: 12px 16px;
            font-weight: 600;
            display: none;
        }

        /* Terminal Seal Animation success */
        .cf-terminal-seal-box {
            text-align: center;
            padding: 40px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        .cf-seal-stamp {
            width: 80px;
            height: 80px;
            background: var(--accent-lime);
            color: #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: 900;
            box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
            border: 3px solid #000;
        }
    `;
    document.head.appendChild(styleElement);

    // 2. State Management for Dossier Wizard Ingestion Engine
    const wizardState = {
        currentStep: 1,
        dossierDetails: {
            identifier: '',
            fundingGoal: '',
            classification: 'LLC',
            sector: 'technology'
        },
        attachments: {
            bank_statements: { file: null, status: 'Awaiting Statement Upload', sha256: null },
            tax_filings: { file: null, status: 'Awaiting Tax Return Upload', sha256: null },
            incorporation_charter: { file: null, status: 'Awaiting Corporate Doc Upload', sha256: null }
        }
    };

    // Helper: Simulated cryptographic generation
    function generateMockSHA256() {
        const chars = '0123456789abcdef';
        let result = 'cf_hash_';
        for (let i = 0; i < 28; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    // Initialize UI Elements
    function initWizard() {
        // Construct Floating Ingest Launcher Button
        const launcher = document.createElement('button');
        launcher.className = 'coreflow-wizard-launcher';
        launcher.innerHTML = `<span class="pulse-dot"></span> Initiate Dossier Engine`;
        document.body.appendChild(launcher);

        // Construct Full Ingestion Portal Modal Overlay Markup
        const overlay = document.createElement('div');
        overlay.className = 'cf-wizard-overlay';
        overlay.id = 'cfWizardOverlay';
        overlay.innerHTML = `
            <div class="cf-wizard-card">
                <!-- Terminal Header -->
                <div class="cf-wizard-header">
                    <div class="terminal-dots">
                        <span class="dot active-1"></span>
                        <span class="dot active-2"></span>
                        <span class="dot active-3"></span>
                    </div>
                    <div class="terminal-title">DOSSIER INGESTION ENGINE - SECURE PORTAL v4.2</div>
                    <button class="cf-wizard-close" id="cfCloseWizard">&times;</button>
                </div>

                <!-- Step Tracker Timeline -->
                <div class="cf-wizard-steps">
                    <div class="cf-step-tab active" id="cfTab-1">01. Parameters</div>
                    <div class="cf-step-tab" id="cfTab-2">02. Attachment Vault</div>
                    <div class="cf-step-tab" id="cfTab-3">03. Integrity Seal</div>
                </div>

                <!-- Form Body -->
                <div class="cf-wizard-body">
                    <div class="cf-warning-banner" id="cfWarningBox"></div>

                    <!-- Step 1: Dossier Details Panel -->
                    <div class="cf-wizard-panel active" id="cfPanel-1">
                        <div style="border-left: 3px solid var(--accent-magenta); padding-left: 14px;">
                            <h3 style="font-family: var(--font-display); text-transform: uppercase; font-size: 18px; margin-bottom: 6px;">Dossier Parameters</h3>
                            <p style="font-size: 13px; color: var(--text-secondary);">Declare identity validation profiles and project metadata structures before seeding financial documents.</p>
                        </div>

                        <div class="cf-form-row">
                            <div class="cf-field-group">
                                <label class="cf-label">Project Identifier / Legal Name</label>
                                <input type="text" class="cf-input" id="cfInputName" placeholder="e.g. COREFLOW FINTECH VENTURES LLC">
                            </div>
                            <div class="cf-field-group">
                                <label class="cf-label">Target Liquidity Runway ($)</label>
                                <input type="number" class="cf-input" id="cfInputFunding" placeholder="e.g. 250000">
                            </div>
                        </div>

                        <div class="cf-form-row">
                            <div class="cf-field-group">
                                <label class="cf-label">Entity Classification</label>
                                <select class="cf-select" id="cfSelectClass">
                                    <option value="LLC">LLC (Limited Liability Corp)</option>
                                    <option value="C-Corp">C-Corporation (State Registrar)</option>
                                    <option value="S-Corp">S-Corporation Option</option>
                                    <option value="Partnership">GP / LP General Partnership</option>
                                </select>
                            </div>
                            <div class="cf-field-group">
                                <label class="cf-label">Operational Segment Vertical</label>
                                <select class="cf-select" id="cfSelectSector">
                                    <option value="technology">SaaS & Technology Infrastructure</option>
                                    <option value="logistics">Logistics, Supply Chain & Transport</option>
                                    <option value="realestate">Commercial Development & Leasing</option>
                                    <option value="manufacturing">Precision CNC & Assembly Output</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Ingestion File Vault (3 Attachments) -->
                    <div class="cf-wizard-panel" id="cfPanel-2">
                        <div style="border-left: 3px solid var(--accent-cyan); padding-left: 14px; margin-bottom: 10px;">
                            <h3 style="font-family: var(--font-display); text-transform: uppercase; font-size: 18px; margin-bottom: 6px;">Attachment Vault Ingestion</h3>
                            <p style="font-size: 13px; color: var(--text-secondary);">Drop three core validation proofs. Automated sandbox diagnostics compile signature checksums and confirm security integrity.</p>
                        </div>

                        <div class="cf-upload-vault">
                            <!-- Slot 1: Bank Statement -->
                            <div class="cf-upload-slot" id="slot-bank_statements" data-type="bank_statements">
                                <input type="file" style="display:none;" id="file-bank_statements" accept=".pdf,.csv,.xlsx">
                                <div class="cf-slot-icon">📊</div>
                                <div class="cf-slot-meta">
                                    <div class="cf-slot-title">Bank Statement Proof</div>
                                    <div class="cf-slot-desc" id="desc-bank_statements">Primary institutional ledger accounts. (Max 15MB .PDF / .XLSX / .CSV)</div>
                                </div>
                                <div class="cf-status-badge" id="badge-bank_statements">Awaiting Upload</div>
                                <div class="cf-scan-track" id="track-bank_statements"><div class="cf-scan-bar" id="bar-bank_statements"></div></div>
                            </div>

                            <!-- Slot 2: Corporate Tax Filings -->
                            <div class="cf-upload-slot" id="slot-tax_filings" data-type="tax_filings">
                                <input type="file" style="display:none;" id="file-tax_filings" accept=".pdf">
                                <div class="cf-slot-icon">🏛️</div>
                                <div class="cf-slot-meta">
                                    <div class="cf-slot-title">Federal Tax Filing Document</div>
                                    <div class="cf-slot-desc" id="desc-tax_filings">Consolidated business tax declaration records. (Max 15MB .PDF)</div>
                                </div>
                                <div class="cf-status-badge" id="badge-tax_filings">Awaiting Upload</div>
                                <div class="cf-scan-track" id="track-tax_filings"><div class="cf-scan-bar" id="bar-tax_filings"></div></div>
                            </div>

                            <!-- Slot 3: Operational Charter/Ledger -->
                            <div class="cf-upload-slot" id="slot-incorporation_charter" data-type="incorporation_charter">
                                <input type="file" style="display:none;" id="file-incorporation_charter" accept=".pdf">
                                <div class="cf-slot-icon">📜</div>
                                <div class="cf-slot-meta">
                                    <div class="cf-slot-title">Operational Charter / Entity Ledger</div>
                                    <div class="cf-slot-desc" id="desc-incorporation_charter">Active certificates of status or business operating agreement. (Max 15MB .PDF)</div>
                                </div>
                                <div class="cf-status-badge" id="badge-incorporation_charter">Awaiting Upload</div>
                                <div class="cf-scan-track" id="track-incorporation_charter"><div class="cf-scan-bar" id="bar-incorporation_charter"></div></div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Integrity Summary -->
                    <div class="cf-wizard-panel" id="cfPanel-3">
                        <div style="border-left: 3px solid var(--accent-lime); padding-left: 14px;">
                            <h3 style="font-family: var(--font-display); text-transform: uppercase; font-size: 18px; margin-bottom: 6px;">Dossier Cryptographic Seal</h3>
                            <p style="font-size: 13px; color: var(--text-secondary);">Verify validation states. Once confirmed, finalize compiling system configurations to write secure system parameters.</p>
                        </div>

                        <div class="cf-summary-console" id="cfConsoleOutput">
                            <!-- Populated dynamically via JS -->
                        </div>
                    </div>

                    <!-- Success State Output Panel -->
                    <div class="cf-wizard-panel" id="cfPanel-Success">
                        <div class="cf-terminal-seal-box">
                            <div class="cf-seal-stamp">✓</div>
                            <h2 style="font-family: var(--font-display); font-size: 26px; text-transform: uppercase;">Dossier Sealed Successfully</h2>
                            <p style="font-size: 14px; color: var(--text-secondary); max-width: 550px; margin: 0 auto; line-height: 1.6;">
                                Security ledger confirmed. Your project metadata parameters and 3 validation attachments have been encapsulated, indexed, and formatted for processing.
                            </p>
                            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 14px; font-family: monospace; font-size: 12px; color: var(--accent-cyan); width: 100%; max-width: 480px; text-transform: uppercase;">
                                Ref ID: <span id="cfSuccessRefId" style="color: #fff; font-weight: bold;">CORE-CF-WAITING</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Operations Control Navigation -->
                <div class="cf-wizard-footer" id="cfWizardFooter">
                    <button class="btn-white" id="cfBtnBack" style="display:none; padding: 10px 20px; font-size: 12px;">Back Module</button>
                    <div></div> <!-- spacer -->
                    <button class="btn-action" id="cfBtnNext" style="padding: 10px 24px; font-size: 12px;">Next Step &rarr;</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Bind DOM Interactive Control Handlers
        launcher.addEventListener('click', () => {
            overlay.classList.add('active');
            if (typeof showNotification === 'function') {
                showNotification("Initiating Secure Dossier Ingest Engine");
            }
        });

        document.getElementById('cfCloseWizard').addEventListener('click', () => {
            overlay.classList.remove('active');
        });

        // Setup File Upload Interactions (Both Click & Drag/Drop for all 3 slots)
        setupFileSlot('bank_statements');
        setupFileSlot('tax_filings');
        setupFileSlot('incorporation_charter');

        // Navigation Actions
        document.getElementById('cfBtnNext').addEventListener('click', navigateNext);
        document.getElementById('cfBtnBack').addEventListener('click', navigateBack);
    }

    // Configures drag/drop + select input triggers
    function setupFileSlot(slotKey) {
        const slotEl = document.getElementById(`slot-${slotKey}`);
        const inputEl = document.getElementById(`file-${slotKey}`);

        slotEl.addEventListener('click', () => {
            // Only trigger click if not currently scanning/uploaded
            if (!wizardState.attachments[slotKey].file) {
                inputEl.click();
            }
        });

        // Drag handlers
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
            const file = e.dataTransfer.files[0];
            if (file) handleFileSelection(slotKey, file);
        });

        inputEl.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleFileSelection(slotKey, file);
        });
    }

    // Runs mock virus scanning algorithm + validates file metrics
    function handleFileSelection(slotKey, file) {
        const badge = document.getElementById(`badge-${slotKey}`);
        const desc = document.getElementById(`desc-${slotKey}`);
        const track = document.getElementById(`track-${slotKey}`);
        const bar = document.getElementById(`bar-${slotKey}`);
        const warning = document.getElementById('cfWarningBox');

        warning.style.display = 'none';

        // Size validation
        const maxBytes = 15 * 1024 * 1024; // 15MB
        if (file.size > maxBytes) {
            badge.innerText = "Error size";
            badge.className = "cf-status-badge error";
            desc.innerText = `Ingest rejected: File size exceeds legal parameters. Limit 15MB.`;
            return;
        }

        // Update UI State for scan initiation
        wizardState.attachments[slotKey].file = file;
        badge.innerText = "Scanning...";
        badge.className = "cf-status-badge scanning";
        track.style.display = 'block';
        bar.style.width = '0%';

        // Simulate Progressive Scanning Signatures
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            bar.style.width = `${progress}%`;

            if (progress === 30) {
                desc.innerText = `Analyzing layout headers & metadata sectors...`;
            } else if (progress === 65) {
                desc.innerText = `Analyzing heuristics for deep validation threat profiles...`;
            } else if (progress === 90) {
                desc.innerText = `Finalizing SHA-256 validation checksum hashes...`;
            }

            if (progress >= 100) {
                clearInterval(interval);
                
                // Set state status values
                const hashValue = generateMockSHA256();
                wizardState.attachments[slotKey].status = 'Clean / Verified';
                wizardState.attachments[slotKey].sha256 = hashValue;

                badge.innerText = "Verified Safe";
                badge.className = "cf-status-badge verified";
                desc.innerHTML = `<strong>File ingested:</strong> ${file.name} | Integrity: <span style="font-family: monospace; color: var(--accent-cyan); font-size:10px;">${hashValue}</span>`;
                track.style.display = 'none';
                
                if (typeof showNotification === 'function') {
                    showNotification(`Attachment verification secured: ${file.name}`);
                }
            }
        }, 80);
    }

    // Step verification checks
    function validateStep(step) {
        const warning = document.getElementById('cfWarningBox');
        warning.style.display = 'none';

        if (step === 1) {
            const name = document.getElementById('cfInputName').value.trim();
            const funding = document.getElementById('cfInputFunding').value.trim();
            if (!name || !funding) {
                warning.innerText = "VALIDATION DEFICIT: Legal entity name identity and capitalization boundaries must be declared.";
                warning.style.display = 'block';
                return false;
            }
            wizardState.dossierDetails.identifier = name;
            wizardState.dossierDetails.fundingGoal = funding;
            wizardState.dossierDetails.classification = document.getElementById('cfSelectClass').value;
            wizardState.dossierDetails.sector = document.getElementById('cfSelectSector').value;
        } else if (step === 2) {
            // Must have all three uploaded
            const att = wizardState.attachments;
            if (!att.bank_statements.sha256 || !att.tax_filings.sha256 || !att.incorporation_charter.sha256) {
                warning.innerText = "INTEGRITY FAULT: Complete submission requires validation matching records across all 3 key parameters.";
                warning.style.display = 'block';
                return false;
            }
        }
        return true;
    }

    // Generates compiled integrity ledger code for review
    function renderIntegrityConsole() {
        const consoleOutput = document.getElementById('cfConsoleOutput');
        const state = wizardState;
        
        consoleOutput.innerHTML = `
            <div class="cf-summary-line">
                <span>[Dossier Identifier]</span>
                <span class="cf-summary-val">${state.dossierDetails.identifier}</span>
            </div>
            <div class="cf-summary-line">
                <span>[Financial Parameter Target]</span>
                <span class="cf-summary-val">$${parseFloat(state.dossierDetails.fundingGoal).toLocaleString()}</span>
            </div>
            <div class="cf-summary-line">
                <span>[Entity Legal Status Class]</span>
                <span class="cf-summary-val">${state.dossierDetails.classification}</span>
            </div>
            <div class="cf-summary-line">
                <span>[Operational Segment]</span>
                <span class="cf-summary-val">${state.dossierDetails.sector.toUpperCase()}</span>
            </div>
            <div class="cf-summary-line">
                <span>[Bank Ledger Checksum SHA-256]</span>
                <span class="cf-summary-val" style="color:var(--accent-magenta); font-family:monospace;">${state.attachments.bank_statements.sha256}</span>
            </div>
            <div class="cf-summary-line">
                <span>[Tax Dossier Signature SHA-256]</span>
                <span class="cf-summary-val" style="color:var(--accent-magenta); font-family:monospace;">${state.attachments.tax_filings.sha256}</span>
            </div>
            <div class="cf-summary-line">
                <span>[Charter Agreement Checksum SHA-256]</span>
                <span class="cf-summary-val" style="color:var(--accent-magenta); font-family:monospace;">${state.attachments.incorporation_charter.sha256}</span>
            </div>
            <div style="color: var(--accent-lime); margin-top: 10px; font-weight: bold; text-align: center;">
                STATUS: ENVELOPE SEAL READY. PRESS "COMPILE & SUBMIT".
            </div>
        `;
    }

    // Workflow forward execution step
    function navigateNext() {
        if (!validateStep(wizardState.currentStep)) return;

        if (wizardState.currentStep === 1) {
            setStepState(2);
        } else if (wizardState.currentStep === 2) {
            renderIntegrityConsole();
            setStepState(3);
        } else if (wizardState.currentStep === 3) {
            // Process seal compiling
            executeDossierSeal();
        }
    }

    // Workflow back module execution step
    function navigateBack() {
        if (wizardState.currentStep === 2) {
            setStepState(1);
        } else if (wizardState.currentStep === 3) {
            setStepState(2);
        }
    }

    // Manages active views and layouts
    function setStepState(step) {
        wizardState.currentStep = step;

        // Hide warning
        document.getElementById('cfWarningBox').style.display = 'none';

        // Tabs progress updates
        for (let i = 1; i <= 3; i++) {
            const tab = document.getElementById(`cfTab-${i}`);
            const panel = document.getElementById(`cfPanel-${i}`);

            tab.className = 'cf-step-tab';
            panel.classList.remove('active');

            if (i < step) {
                tab.classList.add('completed');
            } else if (i === step) {
                tab.classList.add('active');
                panel.classList.add('active');
            }
        }

        // Footer buttons state
        const backBtn = document.getElementById('cfBtnBack');
        const nextBtn = document.getElementById('cfBtnNext');

        if (step === 1) {
            backBtn.style.display = 'none';
            nextBtn.innerText = "Next Step &rarr;";
        } else if (step === 2) {
            backBtn.style.display = 'block';
            nextBtn.innerText = "Compile & Verify &rarr;";
        } else if (step === 3) {
            backBtn.style.display = 'block';
            nextBtn.innerText = "Seal & Submit Ingest ✓";
            nextBtn.style.background = 'var(--accent-lime)';
        }
    }

    // Compiles secure system output final submission
    function executeDossierSeal() {
        const nextBtn = document.getElementById('cfBtnNext');
        const backBtn = document.getElementById('cfBtnBack');
        const wizardFooter = document.getElementById('cfWizardFooter');
        
        nextBtn.disabled = true;
        nextBtn.innerText = "Sealing Integrity Layers...";
        
        setTimeout(() => {
            // Create random Dossier ID
            const randomDossierId = `CORE-DOS-${Math.floor(1000 + Math.random() * 9000)}-${wizardState.dossierDetails.classification}`;
            
            document.getElementById('cfSuccessRefId').innerText = randomDossierId;
            
            // Render success page
            document.getElementById('cfPanel-3').classList.remove('active');
            document.getElementById('cfPanel-Success').classList.add('active');
            
            // Hide control nav footer
            wizardFooter.style.display = 'none';

            // Mark timeline completely safe
            document.getElementById('cfTab-3').classList.remove('active');
            document.getElementById('cfTab-3').classList.add('completed');

            if (typeof showNotification === 'function') {
                showNotification(`Dossier locked & sealed: ${randomDossierId}`);
            }
        }, 1500);
    }

    // Auto-run engine initialization sequence
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initWizard();
    } else {
        document.addEventListener('DOMContentLoaded', initWizard);
    }
})();