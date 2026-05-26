(function () {
    // 1. Inject Styles matching Base Component theme & white-label support
    const styles = `
        /* Onboarding Floating Trigger / Action styling */
        .btn-portal-launch {
            background: linear-gradient(135deg, var(--accent-purple), #ec4899);
            color: #fff !important;
            border: none;
            padding: 8px 16px;
            border-radius: 12px;
            font-family: var(--font-sans);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition-smooth);
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px var(--accent-purple-glow);
        }
        .btn-portal-launch:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
            filter: brightness(1.1);
        }

        /* Modal Overlay */
        .intake-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(3, 2, 7, 0.85);
            backdrop-filter: blur(16px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            padding: 20px;
        }
        .intake-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* Modal Box */
        .intake-modal {
            background: var(--bg-surface);
            border: 1px solid var(--border-muted);
            width: 100%;
            max-width: 960px;
            height: 640px;
            border-radius: 24px;
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.8);
            display: grid;
            grid-template-columns: 260px 1fr;
            overflow: hidden;
            transform: scale(0.95);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .intake-overlay.active .intake-modal {
            transform: scale(1);
        }

        /* Sidebar Progress Tracker */
        .intake-sidebar {
            background: var(--bg-surface-elevated);
            border-right: 1px solid var(--border-subtle);
            padding: 32px 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .intake-sidebar-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 32px;
        }
        .intake-sidebar-brand-ico {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, var(--accent-purple), #ec4899);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #fff;
            font-size: 11px;
        }
        .intake-sidebar-brand-txt {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--text-primary);
        }
        .intake-steps-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
            flex-grow: 1;
        }
        .intake-step-node {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            opacity: 0.5;
            transition: var(--transition-smooth);
        }
        .intake-step-node.active {
            opacity: 1;
        }
        .intake-step-node.completed {
            opacity: 0.8;
        }
        .intake-step-circle {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid var(--border-muted);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-mono);
            font-size: 10px;
            font-weight: 700;
            color: var(--text-secondary);
            background: var(--bg-base);
            transition: var(--transition-smooth);
        }
        .intake-step-node.active .intake-step-circle {
            border-color: var(--accent-purple);
            color: #fff;
            background: var(--accent-purple);
            box-shadow: 0 0 8px var(--accent-purple-glow);
        }
        .intake-step-node.completed .intake-step-circle {
            border-color: var(--accent-emerald);
            color: #fff;
            background: var(--accent-emerald);
        }
        .intake-step-lbl {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-secondary);
            transition: var(--transition-smooth);
        }
        .intake-step-node.active .intake-step-lbl {
            color: var(--text-primary);
        }
        .intake-step-node.completed .intake-step-lbl {
            color: var(--accent-emerald);
        }
        .intake-sidebar-footer {
            font-size: 10px;
            color: var(--text-muted);
            font-family: var(--font-mono);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* Workspace Panels */
        .intake-workspace {
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow-y: auto;
            position: relative;
        }
        .intake-panel {
            display: none;
            animation: fadeIn 0.3s ease-out forwards;
        }
        .intake-panel.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Panel Typography */
        .panel-title {
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.5px;
            color: var(--text-primary);
            margin-bottom: 8px;
        }
        .panel-subtitle {
            font-size: 13px;
            color: var(--text-secondary);
            margin-bottom: 24px;
            line-height: 1.5;
        }

        /* Form styling inside Panels */
        .intake-form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .intake-field-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .intake-field-group.full-width {
            grid-column: span 2;
        }
        .intake-label {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .intake-input {
            background: var(--bg-surface-elevated);
            border: 1px solid var(--border-muted);
            color: var(--text-primary);
            border-radius: 10px;
            padding: 10px 14px;
            font-family: var(--font-sans);
            font-size: 13px;
            transition: var(--transition-smooth);
            outline: none;
        }
        .intake-input:focus {
            border-color: var(--accent-purple);
            box-shadow: 0 0 0 2px var(--accent-purple-glow);
        }

        /* Simulated Plaid Component Style */
        .plaid-sync-container {
            border: 1px dashed var(--border-muted);
            border-radius: 14px;
            padding: 24px;
            text-align: center;
            background: rgba(255, 255, 255, 0.01);
            transition: var(--transition-smooth);
        }
        .plaid-sync-container.linked {
            border-color: var(--accent-emerald);
            background: rgba(16, 185, 129, 0.02);
        }
        .plaid-btn {
            background: #111;
            color: #fff;
            border: 1px solid #333;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition-smooth);
        }
        .plaid-btn:hover {
            background: #222;
            border-color: var(--accent-purple);
        }
        .plaid-status-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            background: var(--border-muted);
            color: var(--text-secondary);
            margin-top: 12px;
        }
        .plaid-status-pill.active {
            background: var(--accent-emerald-glow);
            color: var(--accent-emerald);
        }

        /* Simulated Upload & OCR Logger */
        .uploader-zone {
            border: 2px dashed var(--border-muted);
            border-radius: 14px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: var(--transition-smooth);
            margin-bottom: 16px;
        }
        .uploader-zone:hover {
            border-color: var(--accent-purple);
            background: var(--accent-purple-glow);
        }
        .uploader-zone-text {
            font-size: 12px;
            color: var(--text-secondary);
        }
        .ocr-logger-terminal {
            background: #020104;
            border: 1px solid var(--border-muted);
            border-radius: 10px;
            padding: 12px;
            font-family: var(--font-mono);
            font-size: 10px;
            color: #34d399;
            height: 140px;
            overflow-y: auto;
            text-align: left;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .ocr-log-line {
            line-height: 1.4;
        }
        .ocr-log-line.system {
            color: #a1a1aa;
        }
        .ocr-log-line.error {
            color: #ef4444;
        }

        /* Navigation Footers inside Workspace */
        .workspace-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 24px;
            border-top: 1px solid var(--border-subtle);
            padding-top: 18px;
        }
        .btn-prev {
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border-muted);
            border-radius: 10px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: var(--transition-smooth);
        }
        .btn-prev:hover {
            color: var(--text-primary);
            border-color: var(--text-secondary);
        }
        .btn-next {
            background: var(--accent-purple);
            color: #fff;
            border: none;
            border-radius: 10px;
            padding: 8px 18px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: var(--transition-smooth);
            box-shadow: 0 4px 12px var(--accent-purple-glow);
        }
        .btn-next:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
        }

        /* Success screen details */
        .secure-success-node {
            text-align: center;
            padding: 20px;
        }
        .secure-hash-block {
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-secondary);
            background: var(--bg-surface-elevated);
            padding: 10px;
            border-radius: 8px;
            border: 1px solid var(--border-subtle);
            word-break: break-all;
            margin: 14px auto;
            max-width: 420px;
        }
        .success-seal {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent-emerald);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            margin: 0 auto 16px auto;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        /* White Label overrides for our secure popup modal */
        body.white-label-mode .intake-modal {
            background: #ffffff;
            border-color: rgba(0,0,0,0.1);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
        }
        body.white-label-mode .intake-sidebar {
            background: #f4f4f5;
        }
        body.white-label-mode .intake-input {
            background: #fafafa;
        }
        body.white-label-mode .ocr-logger-terminal {
            background: #09090b;
            color: #10b981;
        }
    `;

    // 2. Inject CSS Style Block
    const styleEl = document.createElement("style");
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // 3. Inject "Apply Now / Document Safe" trigger into header if loaded
    const setupTrigger = () => {
        const controlsGroup = document.querySelector(".controls-group");
        if (controlsGroup) {
            // Check if button already exists
            if (document.getElementById("btnSecurePortal")) return;

            const portalBtn = document.createElement("button");
            portalBtn.id = "btnSecurePortal";
            portalBtn.className = "btn-portal-launch";
            portalBtn.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Secure Application Safe
            `;
            portalBtn.onclick = () => openIntakePortal();
            // Insert at the beginning of controls group
            controlsGroup.insertBefore(portalBtn, controlsGroup.firstChild);
        }
    };

    // 4. Onboarding state
    let activeStep = 1;
    let isPlaidConnected = false;
    let uploadedFiles = [];
    let ocrLogs = [
        "System initiated: Secure Cryptographic document pipeline initialized.",
        "Awaiting bank statement / corporate tax returns uploading parameters."
    ];

    // 5. Render Portal Modal HTML dynamically
    const renderPortalDOM = () => {
        // Destroy existing modal structure to ensure refresh
        const existingOverlay = document.getElementById("intakeOverlayContainer");
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement("div");
        overlay.id = "intakeOverlayContainer";
        overlay.className = "intake-overlay";

        overlay.innerHTML = `
            <div class="intake-modal" id="intakeModalWindow">
                <!-- Sidebar Progress -->
                <div class="intake-sidebar">
                    <div>
                        <div class="intake-sidebar-brand">
                            <div class="intake-sidebar-brand-ico">🛡️</div>
                            <div class="intake-sidebar-brand-txt">Valois Safe</div>
                        </div>
                        <div class="intake-steps-list">
                            <div class="intake-step-node active" id="nodeStep1" onclick="jumpToStep(1)">
                                <div class="intake-step-circle">01</div>
                                <span class="intake-step-lbl">Entity Profile</span>
                            </div>
                            <div class="intake-step-node" id="nodeStep2" onclick="jumpToStep(2)">
                                <div class="intake-step-circle">02</div>
                                <span class="intake-step-lbl">Secure Sync</span>
                            </div>
                            <div class="intake-step-node" id="nodeStep3" onclick="jumpToStep(3)">
                                <div class="intake-step-circle">03</div>
                                <span class="intake-step-lbl">Doc Validation</span>
                            </div>
                            <div class="intake-step-node" id="nodeStep4" onclick="jumpToStep(4)">
                                <div class="intake-step-circle">04</div>
                                <span class="intake-step-lbl">Vault Verification</span>
                            </div>
                        </div>
                    </div>
                    <div class="intake-sidebar-footer">
                        <span>● TLS 1.3 Active</span>
                        <span style="color: var(--accent-emerald);">● safe-harbor</span>
                    </div>
                </div>

                <!-- Main Workspaces -->
                <div class="intake-workspace">
                    
                    <!-- Panel 1: Profile -->
                    <div class="intake-panel active" id="panelStep1">
                        <h2 class="panel-title">Borrower Corporate Profile</h2>
                        <p class="panel-subtitle">Define structural credentials and parameters required to feed the target matched lending engines.</p>
                        
                        <div class="intake-form-grid">
                            <div class="intake-field-group">
                                <label class="intake-label">Legal Company Name</label>
                                <input type="text" class="intake-input" id="profileCompName" placeholder="e.g. Apex Cargo Corp">
                            </div>
                            <div class="intake-field-group">
                                <label class="intake-label">Corporate EIN</label>
                                <input type="text" class="intake-input" id="profileEIN" placeholder="XX-XXXXXXX" value="12-3456789">
                            </div>
                            <div class="intake-field-group">
                                <label class="intake-label">Estimated Allocation Ask</label>
                                <input type="text" class="intake-input" id="profileAsk" placeholder="e.g. $1,200,000">
                            </div>
                            <div class="intake-field-group">
                                <label class="intake-label">Primary Executive Officer</label>
                                <input type="text" class="intake-input" id="profileOfficer" placeholder="e.g. Sarah Connor">
                            </div>
                        </div>
                    </div>

                    <!-- Panel 2: Plaid Sync -->
                    <div class="intake-panel" id="panelStep2">
                        <h2 class="panel-title">Institutional Ledger Sync</h2>
                        <p class="panel-subtitle">Connect secure accounting nodes and banking channels dynamically. Verified credentials lock instantly for real-time risk index audits.</p>
                        
                        <div class="plaid-sync-container" id="plaidSyncBox">
                            <div style="font-size: 28px; margin-bottom: 8px;">🏦</div>
                            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 4px;" id="plaidTitle">Simulated Bank Link (Plaid Direct-Auth)</h3>
                            <p style="font-size: 11px; color: var(--text-secondary); max-width: 320px; margin: 0 auto 16px auto;" id="plaidDesc">
                                Directly integrate transactional ledger sheets safely under secure SSL v2 parameters without manual entry.
                            </p>
                            <button class="plaid-btn" id="btnConnectPlaid" onclick="triggerSimulatedPlaidLink()">
                                ⚡ Link Account Dynamic Engine
                            </button>
                            <br>
                            <div class="plaid-status-pill" id="plaidStatusBadge">Ledger Link Disconnected</div>
                        </div>
                    </div>

                    <!-- Panel 3: Document Uploads & Live OCR Terminal -->
                    <div class="intake-panel" id="panelStep3">
                        <h2 class="panel-title">Secure Document Safe Uploads</h2>
                        <p class="panel-subtitle">Provide Corporate Tax Returns (Form 1120-S) or last 3 months banking CSV/PDF reports to run active OCR validations.</p>
                        
                        <div class="uploader-zone" onclick="triggerFilePicker()">
                            <div style="font-size: 24px; margin-bottom: 4px;">📂</div>
                            <p class="uploader-zone-text"><strong>Click to drop or browse files</strong></p>
                            <span style="font-size: 10px; color: var(--text-muted);">PDF, XML, or CSV formats accepted (Max 24MB)</span>
                            <input type="file" id="onboardingFilePicker" style="display:none;" onchange="handleFileSelected(event)">
                        </div>

                        <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                            <span class="intake-label">Automated OCR Parser Logs</span>
                            <span style="font-family: var(--font-mono); font-size: 9px; color: var(--accent-emerald);">Engine Active</span>
                        </div>
                        <div class="ocr-logger-terminal" id="ocrTerminal">
                            <!-- Injected active parser logs -->
                        </div>
                    </div>

                    <!-- Panel 4: Cryptographic Vault Success -->
                    <div class="intake-panel" id="panelStep4">
                        <div class="secure-success-node">
                            <div class="success-seal">✓</div>
                            <h2 class="panel-title">Credentials Vaulted Successfully</h2>
                            <p class="panel-subtitle" style="max-width: 460px; margin: 0 auto 16px auto;">
                                Your corporate financial profiles, verification payloads, and risk dimensions logs have been compiled, processed and signed securely.
                            </p>
                            
                            <div style="text-align: left; max-width: 440px; margin: 0 auto;">
                                <span class="intake-label" style="text-align: center; display: block; margin-bottom: 4px;">Dynamic Cryptographic SHA-256 Node Signature</span>
                                <div class="secure-hash-block" id="cryptSigHash">
                                    Calculating cryptographic metadata profile node signature...
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Control actions footer -->
                    <div class="workspace-actions">
                        <button class="btn-prev" id="btnIntakePrev" onclick="moveStep(-1)">Back</button>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button class="btn-prev" onclick="closeIntakePortal()" style="border-color: transparent;">Close</button>
                            <button class="btn-next" id="btnIntakeNext" onclick="moveStep(1)">Continue</button>
                        </div>
                    </div>

                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Add close overlay event when user clicks the blurred backdrop
        overlay.onclick = (e) => {
            if (e.target === overlay) closeIntakePortal();
        };
    };

    // 6. Controller Functions for the Intake Portal Flow
    window.openIntakePortal = () => {
        renderPortalDOM();
        
        // Auto-populate from selected borrower_archetypes from parent environment!
        if (typeof window.borrower_archetypes !== "undefined" && typeof window.currentArchetypeKey !== "undefined") {
            const arch = window.borrower_archetypes[window.currentArchetypeKey];
            if (arch) {
                const compNameInput = document.getElementById("profileCompName");
                const askInput = document.getElementById("profileAsk");
                if (compNameInput) compNameInput.value = arch.name;
                if (askInput) {
                    const capacityNum = Math.round(arch.arr * 0.45);
                    askInput.value = `$${capacityNum.toLocaleString()}`;
                }
            }
        }

        const container = document.getElementById("intakeOverlayContainer");
        if (container) {
            container.classList.add("active");
        }
        activeStep = 1;
        updateStepUI();
    };

    window.closeIntakePortal = () => {
        const container = document.getElementById("intakeOverlayContainer");
        if (container) {
            container.classList.remove("active");
            // Clean up DOM after transitions
            setTimeout(() => {
                container.remove();
            }, 300);
        }
    };

    window.jumpToStep = (target) => {
        // Only allow jumping forward if prerequisite steps are completed or simulated
        if (target >= 1 && target <= 4) {
            activeStep = target;
            updateStepUI();
        }
    };

    window.moveStep = (direction) => {
        const target = activeStep + direction;
        if (target >= 1 && target <= 4) {
            activeStep = target;
            updateStepUI();
        } else if (target > 4) {
            // Submission simulated complete!
            closeIntakePortal();
            triggerMainIntegrationSuccessAlert();
        }
    };

    const updateStepUI = () => {
        // Activate correct panels
        for (let i = 1; i <= 4; i++) {
            const panel = document.getElementById(`panelStep${i}`);
            const node = document.getElementById(`nodeStep${i}`);
            
            if (panel) {
                if (i === activeStep) {
                    panel.classList.add("active");
                } else {
                    panel.classList.remove("active");
                }
            }

            if (node) {
                node.classList.remove("active", "completed");
                if (i === activeStep) {
                    node.classList.add("active");
                } else if (i < activeStep) {
                    node.classList.add("completed");
                }
            }
        }

        // Adjust Next button states
        const nextBtn = document.getElementById("btnIntakeNext");
        const prevBtn = document.getElementById("btnIntakePrev");

        if (prevBtn) {
            prevBtn.style.visibility = activeStep === 1 ? "hidden" : "visible";
        }

        if (nextBtn) {
            if (activeStep === 4) {
                nextBtn.textContent = "Finish & Return";
                nextBtn.style.background = "var(--accent-emerald)";
                nextBtn.style.boxShadow = "0 4px 12px var(--accent-emerald-glow)";
            } else {
                nextBtn.textContent = "Continue";
                nextBtn.style.background = "var(--accent-purple)";
                nextBtn.style.boxShadow = "0 4px 12px var(--accent-purple-glow)";
            }
        }

        // Handle specific Step load actions
        if (activeStep === 3) {
            renderOcrLogs();
        } else if (activeStep === 4) {
            generateCryptographicSignature();
        }
    };

    // 7. Step 2 Simulated Plaid Integration Link
    window.triggerSimulatedPlaidLink = () => {
        const title = document.getElementById("plaidTitle");
        const desc = document.getElementById("plaidDesc");
        const badge = document.getElementById("plaidStatusBadge");
        const box = document.getElementById("plaidSyncBox");
        const btn = document.getElementById("btnConnectPlaid");

        if (isPlaidConnected) return;

        btn.disabled = true;
        btn.textContent = "Negotiating secure handshake tunnel...";
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 25;
            btn.textContent = `Syncing accounts... ${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                isPlaidConnected = true;
                
                title.textContent = "Plaid Ledger Connection Active";
                desc.textContent = "Corporate balances, historical transaction flows and verification vectors verified by Vanguard Core Auth protocols.";
                badge.className = "plaid-status-pill active";
                badge.textContent = "✓ Securely Linked to Capital Account";
                box.classList.add("linked");
                btn.style.display = "none";
                
                // Add an OCR log entry for integration
                ocrLogs.push("[SYS-CONNECTOR] Plaid dynamic transactional balance sync verified.");
            }
        }, 400);
    };

    // 8. Step 3 Document Upload Simulation & OCR Logs Parser
    window.triggerFilePicker = () => {
        const picker = document.getElementById("onboardingFilePicker");
        if (picker) picker.click();
    };

    window.handleFileSelected = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fileName = files[0].name;
            uploadedFiles.push(fileName);
            
            // Append log steps in terminal simulation
            ocrLogs.push(`[OCR-CORE] Upload detected: ${fileName} (${(files[0].size/1024).toFixed(1)} KB)`);
            ocrLogs.push(`[OCR-CORE] Reading document blocks via safe OCR scanning core...`);
            
            setTimeout(() => {
                ocrLogs.push(`[OCR-EVAL] Parsed EIN matches target organization profile parameters.`);
                ocrLogs.push(`[OCR-EVAL] Bank deposits extraction success score: 99.4% (Confidence Tier-A)`);
                ocrLogs.push(`[OCR-EVAL] Form 1120-S detected: Cross-referencing net-operating income margins...`);
                renderOcrLogs();
            }, 600);
            
            renderOcrLogs();
        }
    };

    const renderOcrLogs = () => {
        const terminal = document.getElementById("ocrTerminal");
        if (!terminal) return;
        
        terminal.innerHTML = "";
        ocrLogs.forEach(log => {
            let logClass = "ocr-log-line";
            if (log.startsWith("[")) {
                logClass += " system";
            }
            if (log.includes("error") || log.includes("Error")) {
                logClass += " error";
            }
            terminal.innerHTML += `<div class="${logClass}">${log}</div>`;
        });
        
        // Auto scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    };

    // 9. Step 4 Cryptographic Vault Processing
    const generateCryptographicSignature = () => {
        const container = document.getElementById("cryptSigHash");
        if (!container) return;

        // Construct unique dynamic payload hash based on selected inputs or environment variables
        const nameVal = document.getElementById("profileCompName")?.value || "Anonymous Applicant";
        const askVal = document.getElementById("profileAsk")?.value || "$0.00";
        const timestamp = new Date().toISOString();
        const randSeed = Math.random().toString(36).substring(2, 10);
        
        const rawPayloadString = `${nameVal}|${askVal}|${timestamp}|${randSeed}|PLAID_CONNECTED:${isPlaidConnected}`;
        
        // Simulating SHA-256 signature output instantly
        let mockHash = "vls_";
        for (let i = 0; i < 48; i++) {
            mockHash += Math.floor(Math.random() * 16).toString(16);
        }
        
        setTimeout(() => {
            container.innerHTML = `
                <span style="color: var(--accent-purple); font-weight: 700;">VALOIS-PROD-SIG // </span>
                <span style="color: var(--text-primary);">${mockHash.toUpperCase()}</span>
                <div style="margin-top: 8px; font-size: 9px; color: var(--text-muted);">
                    Payload metadata: ${rawPayloadString}
                </div>
            `;
        }, 600);
    };

    const triggerMainIntegrationSuccessAlert = () => {
        // Trigger alert or enhance UI with dynamic integration complete logs
        const nameVal = document.getElementById("profileCompName")?.value || "Applicant";
        alert(`Intake Secure Document Submission Complete!\n\nPayload for ${nameVal} is now fully signed and integrated into the matching engine.`);
        
        // If loaded inside the broader Valois template environment, update existing state dynamically!
        if (typeof window.loadArchetype !== "undefined" && typeof window.currentArchetypeKey !== "undefined") {
            // Find current archetype to modify readiness score slightly or add visual cue
            const arch = window.borrower_archetypes[window.currentArchetypeKey];
            if (arch) {
                arch.readinessScore = Math.min(100, arch.readinessScore + 3); // Dynamic bump for uploading docs!
                window.loadArchetype(window.currentArchetypeKey);
            }
        }
    };

    // 10. Execute Initialization Setup
    setupTrigger();

    // Re-check periodically in case archetype switches or dynamically updates the controls bar
    setInterval(setupTrigger, 2000);

})();