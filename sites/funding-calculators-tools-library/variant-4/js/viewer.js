(function() {
    // Inject Custom Styles to Match Neobrutalist Theme
    const viewerStyles = `
        .viewer-hub-section {
            max-width: 1440px;
            margin: 80px auto;
            padding: 0 40px;
        }
        @media (max-width: 768px) {
            .viewer-hub-section {
                padding: 0 20px;
                margin: 40px auto;
            }
        }
        
        .viewer-workspace {
            display: grid;
            grid-template-columns: 1.4fr 0.6fr;
            gap: 30px;
            margin-top: 30px;
        }
        @media (max-width: 1200px) {
            .viewer-workspace {
                grid-template-columns: 1fr;
            }
        }

        .viewer-controls-bar {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: var(--brutal-shadow-hover);
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .viewer-layout-toggle {
            display: flex;
            gap: 8px;
        }

        .viewer-layout-btn {
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            color: var(--text-secondary);
            font-family: var(--font-display);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 11px;
            padding: 8px 14px;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .viewer-layout-btn.active {
            background: var(--accent-cyan);
            color: #000;
            border-color: #000;
            box-shadow: 2px 2px 0px #000;
        }

        .doc-tabs-container {
            display: flex;
            gap: 10px;
        }

        .doc-tab {
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            color: var(--text-secondary);
            font-family: var(--font-display);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 12px;
            padding: 10px 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.15s ease;
        }

        .doc-tab:hover {
            border-color: var(--accent-orange);
            color: var(--text-primary);
        }

        .doc-tab.active {
            background: var(--accent-orange);
            color: #000;
            border-color: #000;
            box-shadow: 3px 3px 0px #000;
        }

        .doc-tab-badge {
            background: rgba(0, 0, 0, 0.15);
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 20px;
        }

        /* Document Display Matrix */
        .documents-stage {
            background: #0d0f17;
            border: 3px solid var(--border-color);
            min-height: 620px;
            box-shadow: var(--brutal-shadow);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .stage-viewmode-tabbed .document-container {
            display: none;
            flex: 1;
        }

        .stage-viewmode-tabbed .document-container.active {
            display: flex;
            flex-direction: column;
        }

        .stage-viewmode-sidebyside {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 3px;
            background: var(--border-color);
        }

        @media (max-width: 900px) {
            .stage-viewmode-sidebyside {
                grid-template-columns: 1fr;
            }
        }

        .stage-viewmode-sidebyside .document-container {
            display: flex;
            flex-direction: column;
            background: #0d0f17;
            min-height: 600px;
        }

        .doc-header-strip {
            background: var(--bg-tertiary);
            border-bottom: 2px solid var(--border-color);
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .doc-title-text {
            font-family: var(--font-display);
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .doc-canvas {
            flex: 1;
            padding: 30px;
            position: relative;
            overflow-y: auto;
            user-select: none;
            cursor: crosshair;
        }

        .doc-canvas::after {
            content: 'CLICK ANYWHERE ON DOCUMENT TO ADD STICKY ANNOTATION';
            position: absolute;
            bottom: 12px;
            right: 15px;
            font-size: 9px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.2);
            letter-spacing: 1px;
            pointer-events: none;
        }

        /* Previews design */
        .preview-funding-app {
            color: var(--text-primary);
            font-size: 13px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .preview-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .preview-field {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            padding: 12px;
            border-radius: 4px;
        }

        .field-lbl {
            font-size: 10px;
            text-transform: uppercase;
            color: var(--text-secondary);
            margin-bottom: 4px;
            font-weight: 700;
        }

        .field-val {
            font-weight: 600;
            font-family: var(--font-display);
            color: var(--accent-cyan);
        }

        /* Document 2 Bank statements mockup */
        .preview-bank-ledger {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }

        .preview-bank-ledger th {
            text-align: left;
            padding: 8px;
            background: var(--bg-secondary);
            border-bottom: 2px solid var(--border-color);
            color: var(--text-secondary);
            text-transform: uppercase;
            font-size: 10px;
        }

        .preview-bank-ledger td {
            padding: 10px 8px;
            border-bottom: 1px solid var(--border-color);
        }

        .ledger-credit {
            color: var(--accent-lime);
            font-weight: 700;
        }

        .ledger-debit {
            color: var(--accent-magenta);
            font-weight: 600;
        }

        /* Document 3 legal contract clauses */
        .preview-clause {
            background: var(--bg-secondary);
            border-left: 3px solid var(--accent-magenta);
            padding: 12px 16px;
            margin-bottom: 15px;
            font-size: 12.5px;
            line-height: 1.6;
        }

        .clause-title {
            font-family: var(--font-display);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 12px;
            color: #fff;
            margin-bottom: 6px;
        }

        /* Dynamic Sticky Notes */
        .sticky-annotation-pin {
            position: absolute;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--accent-magenta);
            color: #000;
            border: 2px solid #000;
            box-shadow: 2px 2px 0 #000;
            font-family: var(--font-display);
            font-weight: 900;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .sticky-annotation-pin:hover {
            transform: scale(1.2);
        }

        .sticky-annotation-pin.color-cyan { background: var(--accent-cyan); }
        .sticky-annotation-pin.color-orange { background: var(--accent-orange); }
        .sticky-annotation-pin.color-lime { background: var(--accent-lime); }
        .sticky-annotation-pin.color-magenta { background: var(--accent-magenta); }

        /* Dialog input modal */
        .annotation-popover-dialog {
            position: absolute;
            background: var(--bg-tertiary);
            border: 3px solid #000;
            box-shadow: 6px 6px 0px #000;
            padding: 16px;
            width: 260px;
            z-index: 99;
            border-radius: 4px;
        }

        .popover-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 6px;
        }

        .popover-title {
            font-family: var(--font-display);
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            color: var(--accent-orange);
        }

        .popover-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 16px;
            cursor: pointer;
        }

        .popover-close:hover { color: #fff; }

        .popover-textarea {
            width: 100%;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            color: #fff;
            padding: 8px;
            font-size: 12px;
            resize: none;
            height: 60px;
            margin-bottom: 10px;
            outline: none;
        }

        .popover-textarea:focus {
            border-color: var(--accent-cyan);
        }

        .popover-color-selectors {
            display: flex;
            gap: 6px;
            margin-bottom: 12px;
        }

        .popover-color-dot {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid transparent;
        }

        .popover-color-dot.active {
            border-color: #fff;
            transform: scale(1.1);
        }

        /* Sidebar Control Center */
        .viewer-sidebar {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            box-shadow: var(--brutal-shadow);
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .sidebar-section-title {
            font-family: var(--font-display);
            font-weight: 800;
            text-transform: uppercase;
            font-size: 15px;
            color: var(--text-primary);
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .sidebar-log-container {
            max-height: 220px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .log-item {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            padding: 10px;
            border-radius: 4px;
            position: relative;
            transition: all 0.2s ease;
        }

        .log-item:hover {
            border-color: var(--accent-cyan);
        }

        .log-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .log-badge {
            font-family: var(--font-display);
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 2px 6px;
            border-radius: 2px;
        }

        .log-text {
            font-size: 12px;
            color: var(--text-primary);
            line-height: 1.4;
        }

        .log-delete-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: var(--accent-magenta);
            font-weight: bold;
            cursor: pointer;
            font-size: 11px;
            text-transform: uppercase;
        }

        /* Digital Sign Off Matrix */
        .signoff-matrix {
            background: var(--bg-tertiary);
            border: 2px dashed var(--border-color);
            padding: 16px;
            border-radius: 4px;
        }

        .signature-field {
            width: 100%;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            color: var(--text-primary);
            padding: 12px;
            font-family: 'Space Grotesk', sans-serif;
            text-transform: uppercase;
            font-size: 14px;
            font-weight: bold;
            outline: none;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }

        .signature-field:focus {
            border-color: var(--accent-lime);
        }

        .signature-preview {
            background: #fff;
            color: #000;
            padding: 16px;
            border-radius: 4px;
            font-family: 'Brush Script MT', 'Courier New', cursive, sans-serif;
            font-size: 24px;
            text-align: center;
            min-height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #000;
            box-shadow: 3px 3px 0px var(--accent-lime);
            margin-bottom: 14px;
        }

        .signoff-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .btn-decision {
            font-family: var(--font-display);
            font-weight: 800;
            text-transform: uppercase;
            font-size: 12px;
            padding: 12px;
            cursor: pointer;
            border: 2px solid #000;
            transition: all 0.1s ease;
            text-align: center;
        }

        .btn-decision.approve {
            background: var(--accent-lime);
            color: #000;
            box-shadow: 3px 3px 0px #000;
        }

        .btn-decision.approve:hover {
            box-shadow: 1px 1px 0px #000;
            transform: translate(2px, 2px);
        }

        .btn-decision.reject {
            background: var(--accent-magenta);
            color: #000;
            box-shadow: 3px 3px 0px #000;
        }

        .btn-decision.reject:hover {
            box-shadow: 1px 1px 0px #000;
            transform: translate(2px, 2px);
        }

        .verification-badge-container {
            border: 2px solid var(--accent-lime);
            background: rgba(57, 255, 20, 0.05);
            padding: 14px;
            text-align: center;
            border-radius: 4px;
            font-family: var(--font-display);
            font-weight: 700;
            text-transform: uppercase;
            color: var(--accent-lime);
            font-size: 12px;
            letter-spacing: 1px;
            display: none;
        }
    `;

    // Append standard stylesheet
    const styleEl = document.createElement('style');
    styleEl.innerHTML = viewerStyles;
    document.head.appendChild(styleEl);

    // Dynamic Database State for Document Hub
    let documentState = {
        activeTab: 'app', // 'app', 'statements', 'agreement'
        viewMode: 'tabbed', // 'tabbed', 'sidebyside'
        selectedPinColor: 'magenta',
        annotations: [
            { id: 1, docId: 'app', x: 25, y: 35, text: 'Confirm primary business address matches bank filings.', color: 'cyan' },
            { id: 2, docId: 'statements', x: 75, y: 15, text: 'Identify source of high-volume wire deposit.', color: 'orange' },
            { id: 3, docId: 'agreement', x: 45, y: 65, text: 'Double check penalty terms compliance limits.', color: 'magenta' }
        ],
        signedBy: '',
        status: 'PENDING ASSIGNMENT'
    };

    // Main HTML Workspace Template builder
    const renderViewerHub = () => {
        const targetSection = document.getElementById('strategy');
        if (!targetSection) return;

        const viewerSection = document.createElement('section');
        viewerSection.className = 'viewer-hub-section';
        viewerSection.id = 'document-viewer-hub';

        viewerSection.innerHTML = `
            <div class="section-headline">
                <div>
                    <p style="text-transform: uppercase; font-size: 11px; font-weight: 800; color: var(--accent-cyan); letter-spacing: 2px;">Verification Hub</p>
                    <h2 style="margin-top: 5px;">Document Preview & <span>Feedback Hub</span></h2>
                </div>
                <p style="color: var(--text-secondary); max-width: 500px; font-size: 14px; text-align: right;">
                    Audit uploaded funding attachments side-by-side. Drop interactive annotations on coordinates, track items, and issue dynamic digital decisions.
                </p>
            </div>

            <div class="viewer-controls-bar">
                <div class="doc-tabs-container" id="docTabsContainer">
                    <button class="doc-tab active" data-doc="app">
                        📁 Application <span class="doc-tab-badge" id="badge-app">0</span>
                    </button>
                    <button class="doc-tab" data-doc="statements">
                        📊 Statements <span class="doc-tab-badge" id="badge-statements">0</span>
                    </button>
                    <button class="doc-tab" data-doc="agreement">
                        ⚖️ Agreement Draft <span class="doc-tab-badge" id="badge-agreement">0</span>
                    </button>
                </div>

                <div class="viewer-layout-toggle">
                    <button class="viewer-layout-btn active" id="layout-tabbed">Focus Tabbed</button>
                    <button class="viewer-layout-btn" id="layout-sidebyside">Side-By-Side (3 Column)</button>
                </div>
            </div>

            <div class="viewer-workspace">
                <!-- Visualizer documents viewport -->
                <div class="documents-stage stage-viewmode-tabbed" id="documentsStage">
                    
                    <!-- Document 1: Core Application -->
                    <div class="document-container active" data-doc-id="app">
                        <div class="doc-header-strip">
                            <span class="doc-title-text"><span style="color: var(--accent-cyan);">●</span> Core_Funding_App_v4.pdf</span>
                            <span style="font-size: 10px; font-weight: 800; color: var(--text-secondary);">CONFIDENTIAL</span>
                        </div>
                        <div class="doc-canvas" data-canvas-id="app" id="canvas-app">
                            <div class="preview-funding-app">
                                <div class="preview-grid-2">
                                    <div class="preview-field">
                                        <div class="field-lbl">Legal Entity Name</div>
                                        <div class="field-val">Apex Global Logistics LLC</div>
                                    </div>
                                    <div class="preview-field">
                                        <div class="field-lbl">Request Capital Amount</div>
                                        <div class="field-val" style="color: var(--accent-orange);">$250,000 USD</div>
                                    </div>
                                </div>
                                <div class="preview-grid-2">
                                    <div class="preview-field">
                                        <div class="field-lbl">Primary Tax ID (EIN)</div>
                                        <div class="field-val">XX-XXX8941</div>
                                    </div>
                                    <div class="preview-field">
                                        <div class="field-lbl">Federal Jurisdiction State</div>
                                        <div class="field-val">Delaware (DE)</div>
                                    </div>
                                </div>
                                <div class="preview-field">
                                    <div class="field-lbl">Executive Summary Statement</div>
                                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-top: 5px;">
                                        Apex Global requires $250k working capital to settle immediate shipping container port tariffs. Funding will clear freight lines to unlock $1.2M locked revenue pipeline.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Document 2: Bank Statement visual ledger -->
                    <div class="document-container" data-doc-id="statements">
                        <div class="doc-header-strip">
                            <span class="doc-title-text"><span style="color: var(--accent-orange);">●</span> Bank_Statements_Q3.csv</span>
                            <span style="font-size: 10px; font-weight: 800; color: var(--text-secondary);">CHASE UTILITY LOG</span>
                        </div>
                        <div class="doc-canvas" data-canvas-id="statements" id="canvas-statements">
                            <table class="preview-bank-ledger">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Type</th>
                                        <th>Volume Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>10/12/23</td>
                                        <td>ACH Dep Apex Cargo Line</td>
                                        <td>Credit</td>
                                        <td class="ledger-credit">+$45,200.00</td>
                                    </tr>
                                    <tr>
                                        <td>10/14/23</td>
                                        <td>Wire Out Port Auth Authority</td>
                                        <td>Debit</td>
                                        <td class="ledger-debit">-$12,450.00</td>
                                    </tr>
                                    <tr>
                                        <td>10/15/23</td>
                                        <td>Merchant Daily Repayment F1</td>
                                        <td>Debit</td>
                                        <td class="ledger-debit">-$1,180.00</td>
                                    </tr>
                                    <tr>
                                        <td>10/18/23</td>
                                        <td>Federal Tax Pay S10</td>
                                        <td>Debit</td>
                                        <td class="ledger-debit">-$5,600.00</td>
                                    </tr>
                                    <tr>
                                        <td>10/20/23</td>
                                        <td>Acq Lockbox Inflow Terminal</td>
                                        <td>Credit</td>
                                        <td class="ledger-credit">+$85,000.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Document 3: Contract Clauses -->
                    <div class="document-container" data-doc-id="agreement">
                        <div class="doc-header-strip">
                            <span class="doc-title-text"><span style="color: var(--accent-magenta);">●</span> Merchant_Agreement_Draft.pdf</span>
                            <span style="font-size: 10px; font-weight: 800; color: var(--text-secondary);">LEGAL CORE DRAFT</span>
                        </div>
                        <div class="doc-canvas" data-canvas-id="agreement" id="canvas-agreement">
                            <div class="preview-clause">
                                <div class="clause-title">Clause 1.1: Recourse Factor Rate Allocation</div>
                                <p style="font-size: 11.5px; color: var(--text-secondary);">
                                    Merchant agrees to factor future receipts at a constant 1.15x multiple. Total absolute payment liability represents $287,500 based on standard metrics.
                                </p>
                            </div>
                            <div class="preview-clause">
                                <div class="clause-title">Clause 1.2: Automatic Periodic Ledger Settling</div>
                                <p style="font-size: 11.5px; color: var(--text-secondary);">
                                    Daily clearing runs occur via automated clearing house (ACH) network protocols. Merchant agrees to guarantee operational ledger reserve buffer values.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Annotation & Decision Sidebar Tracker -->
                <div class="viewer-sidebar">
                    <div>
                        <div class="sidebar-section-title">
                            <span>Status Panel</span>
                            <span style="font-size: 11px; color: var(--accent-orange);" id="viewer-status-badge">PENDING AUDIT</span>
                        </div>
                        <p style="font-size: 12px; color: var(--text-secondary); margin-top: 10px; line-height: 1.5;">
                            Review documents in order. Add location specific annotations for audit logs.
                        </p>
                    </div>

                    <div>
                        <div class="sidebar-section-title">
                            <span>Annotations Log</span>
                            <span style="font-size: 11px; color: var(--accent-cyan);" id="pins-counter">0</span>
                        </div>
                        <div class="sidebar-log-container" id="annotationsLog">
                            <!-- Populated Dynamically -->
                        </div>
                    </div>

                    <!-- Decision Pad -->
                    <div class="signoff-matrix">
                        <div class="sidebar-section-title" style="border: none; padding-bottom: 0; margin-bottom: 12px;">
                            <span>Digital Sign Off</span>
                        </div>
                        
                        <div id="signoff-form">
                            <input type="text" id="signatureInput" class="signature-field" placeholder="Type name to sign off...">
                            <div class="signature-preview" id="sigPreview">SIGNATURE PREVIEW</div>
                            
                            <div class="signoff-actions">
                                <button class="btn-decision approve" id="btnApprove">Sign Off</button>
                                <button class="btn-decision reject" id="btnReject">Reject</button>
                            </div>
                        </div>

                        <div class="verification-badge-container" id="verifiedStatusBadge">
                            <span>✓ SECURE SIGN OFF CAPTURED</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert before Strategy Banner
        targetSection.parentNode.insertBefore(viewerSection, targetSection);
    };

    // Render Pin coordinates dynamically on Document Canvas
    const drawPins = () => {
        const canvases = document.querySelectorAll('.doc-canvas');
        canvases.forEach(canvas => {
            const docId = canvas.getAttribute('data-canvas-id');
            
            // Clear current rendered pins (leave background elements untouched)
            canvas.querySelectorAll('.sticky-annotation-pin').forEach(pin => pin.remove());

            // Retrieve coordinates for this docId
            const matches = documentState.annotations.filter(ann => ann.docId === docId);
            
            // Only draw pins relevant to display mode logic
            const container = canvas.closest('.document-container');
            const isVisible = container.classList.contains('active') || documentState.viewMode === 'sidebyside';

            if (isVisible) {
                matches.forEach((ann, index) => {
                    const pin = document.createElement('div');
                    pin.className = `sticky-annotation-pin color-${ann.color || 'magenta'}`;
                    pin.style.left = `${ann.x}%`;
                    pin.style.top = `${ann.y}%`;
                    pin.innerText = index + 1;
                    pin.title = ann.text;
                    
                    // Stop event propagation to avoid triggering click on coordinates layer
                    pin.addEventListener('click', (e) => {
                        e.stopPropagation();
                        focusAnnotationItem(ann.id);
                    });

                    canvas.appendChild(pin);
                });
            }
        });

        // Update indicators
        updateStats();
    };

    // Update global status log metrics & document counters
    const updateStats = () => {
        // Doc-specific counts
        ['app', 'statements', 'agreement'].forEach(key => {
            const count = documentState.annotations.filter(a => a.docId === key).length;
            const badge = document.getElementById(`badge-${key}`);
            if (badge) badge.innerText = count;
        });

        // Pins tracker
        const counter = document.getElementById('pins-counter');
        if (counter) counter.innerText = `${documentState.annotations.length} items`;

        // Render Sidebar logger list
        const logContainer = document.getElementById('annotationsLog');
        if (!logContainer) return;

        if (documentState.annotations.length === 0) {
            logContainer.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); padding: 20px 0; font-size: 12px;">
                    No annotations dropped. Click document canvas to add notes.
                </div>
            `;
            return;
        }

        logContainer.innerHTML = '';
        documentState.annotations.forEach((ann, index) => {
            const item = document.createElement('div');
            item.className = 'log-item';
            item.setAttribute('data-ann-id', ann.id);

            const displayDocName = ann.docId === 'app' ? 'App' : ann.docId === 'statements' ? 'Statements' : 'Agreement';

            item.innerHTML = `
                <div class="log-header">
                    <span class="log-badge" style="background: var(--accent-${ann.color}); color: #000;">
                        #${index + 1} - ${displayDocName}
                    </span>
                    <button class="log-delete-btn" onclick="deleteAnnotation(${ann.id}, event)">Remove</button>
                </div>
                <div class="log-text">${ann.text}</div>
            `;

            logContainer.appendChild(item);
        });
    };

    // Focus annotation and trigger high visual feedback
    const focusAnnotationItem = (id) => {
        const item = document.querySelector(`.log-item[data-ann-id="${id}"]`);
        if (item) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            item.style.borderColor = 'var(--accent-lime)';
            setTimeout(() => {
                item.style.borderColor = 'var(--border-color)';
            }, 1500);
        }
    };

    // Global deletion scope helper
    window.deleteAnnotation = (id, event) => {
        if (event) event.stopPropagation();
        documentState.annotations = documentState.annotations.filter(ann => ann.id !== id);
        drawPins();
    };

    // Trigger Popover to allow direct custom entries
    const handleCanvasClick = (e, canvasId) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

        // Remove any open dialogs first
        document.querySelectorAll('.annotation-popover-dialog').forEach(el => el.remove());

        const dialog = document.createElement('div');
        dialog.className = 'annotation-popover-dialog';
        dialog.style.left = `${xPercent}%`;
        dialog.style.top = `${yPercent}%`;

        dialog.innerHTML = `
            <div class="popover-header">
                <span class="popover-title">Create Annotation Pin</span>
                <button class="popover-close" id="btnPopoverClose">×</button>
            </div>
            <textarea class="popover-textarea" id="popoverText" placeholder="Enter audit review query..."></textarea>
            
            <div class="popover-color-selectors">
                <div class="popover-color-dot active" data-color="magenta" style="background: var(--accent-magenta);"></div>
                <div class="popover-color-dot" data-color="cyan" style="background: var(--accent-cyan);"></div>
                <div class="popover-color-dot" data-color="orange" style="background: var(--accent-orange);"></div>
                <div class="popover-color-dot" data-color="lime" style="background: var(--accent-lime);"></div>
            </div>

            <button class="btn-decision approve" id="btnPopoverSave" style="width: 100%; padding: 8px; font-size: 11px;">Save Coordinate Pin</button>
        `;

        // Handle Popover Color selection
        dialog.querySelectorAll('.popover-color-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                dialog.querySelectorAll('.popover-color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                documentState.selectedPinColor = dot.getAttribute('data-color');
            });
        });

        // Close Popover action
        dialog.querySelector('#btnPopoverClose').addEventListener('click', (ev) => {
            ev.stopPropagation();
            dialog.remove();
        });

        // Save Custom Pin action
        dialog.querySelector('#btnPopoverSave').addEventListener('click', (ev) => {
            ev.stopPropagation();
            const textValue = dialog.querySelector('#popoverText').value.trim();
            if (!textValue) return;

            const newAnn = {
                id: Date.now(),
                docId: canvasId,
                x: xPercent,
                y: yPercent,
                text: textValue,
                color: documentState.selectedPinColor
            };

            documentState.annotations.push(newAnn);
            dialog.remove();
            drawPins();
            
            if (window.showNotification) {
                window.showNotification("Pin saved at coordinate matrix");
            }
        });

        // Prevent immediate canvas propagation triggers
        dialog.addEventListener('click', (ev) => ev.stopPropagation());

        e.currentTarget.appendChild(dialog);
    };

    // Attach Event Handlers
    const setupListeners = () => {
        // Document Tab Switching logic
        const tabs = document.querySelectorAll('.doc-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (documentState.viewMode === 'sidebyside') return; // disabled in side-by-side mode

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetDocId = tab.getAttribute('data-doc');
                documentState.activeTab = targetDocId;

                const containers = document.querySelectorAll('.document-container');
                containers.forEach(container => {
                    if (container.getAttribute('data-doc-id') === targetDocId) {
                        container.classList.add('active');
                    } else {
                        container.classList.remove('active');
                    }
                });

                drawPins();
            });
        });

        // Focus Tabbed Layout Trigger
        document.getElementById('layout-tabbed').addEventListener('click', (e) => {
            document.querySelectorAll('.viewer-layout-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const stage = document.getElementById('documentsStage');
            stage.className = 'documents-stage stage-viewmode-tabbed';
            documentState.viewMode = 'tabbed';

            // re-trigger active tab
            document.querySelector(`.doc-tab[data-doc="${documentState.activeTab}"]`).click();
            drawPins();
        });

        // Side-by-Side Layout Trigger
        document.getElementById('layout-sidebyside').addEventListener('click', (e) => {
            document.querySelectorAll('.viewer-layout-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const stage = document.getElementById('documentsStage');
            stage.className = 'documents-stage stage-viewmode-sidebyside';
            documentState.viewMode = 'sidebyside';

            // Set all active visually
            document.querySelectorAll('.document-container').forEach(c => c.classList.add('active'));
            drawPins();
        });

        // Click on canvas to drop markers
        document.querySelectorAll('.doc-canvas').forEach(canvas => {
            canvas.addEventListener('click', (e) => {
                const canvasId = canvas.getAttribute('data-canvas-id');
                handleCanvasClick(e, canvasId);
            });
        });

        // Typing dynamic Signature preview
        const signatureInput = document.getElementById('signatureInput');
        const sigPreview = document.getElementById('sigPreview');
        if (signatureInput && sigPreview) {
            signatureInput.addEventListener('input', (e) => {
                const text = e.target.value.trim();
                documentState.signedBy = text;
                sigPreview.innerText = text ? text : 'SIGNATURE PREVIEW';
            });
        }

        // Decision Button actions
        const btnApprove = document.getElementById('btnApprove');
        const btnReject = document.getElementById('btnReject');
        const statusBadge = document.getElementById('viewer-status-badge');

        if (btnApprove) {
            btnApprove.addEventListener('click', () => {
                if (!documentState.signedBy) {
                    alert('Please type signature name sequence to sign off validation.');
                    return;
                }
                documentState.status = 'VERIFIED SECURE';
                if (statusBadge) {
                    statusBadge.innerText = 'VERIFIED';
                    statusBadge.style.color = 'var(--accent-lime)';
                }
                document.getElementById('signoff-form').style.display = 'none';
                document.getElementById('verifiedStatusBadge').style.display = 'block';

                if (window.showNotification) {
                    window.showNotification("Document Submission Secured!");
                }
            });
        }

        if (btnReject) {
            btnReject.addEventListener('click', () => {
                const reason = prompt('Specify rejection failure criteria:');
                if (!reason) return;

                documentState.status = 'REJECTED';
                if (statusBadge) {
                    statusBadge.innerText = 'REJECTED';
                    statusBadge.style.color = 'var(--accent-magenta)';
                }

                if (window.showNotification) {
                    window.showNotification("Document package marked as Rejected");
                }
            });
        }
    };

    // Auto load sequence on DOMContentLoaded
    const init = () => {
        renderViewerHub();
        setupListeners();
        drawPins();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();