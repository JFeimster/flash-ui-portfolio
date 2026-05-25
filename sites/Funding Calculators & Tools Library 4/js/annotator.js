/**
 * Core Flow - Document Preview & Feedback Hub Component
 * High-voltage Neobrutalist design integration
 */

(function () {
    // Inject Custom Styles for Document Preview & Feedback Hub
    const styles = `
        .annotator-section {
            max-width: 1440px;
            margin: 80px auto;
            padding: 0 40px;
        }

        @media (max-width: 768px) {
            .annotator-section {
                padding: 0 20px;
                margin: 40px auto;
            }
        }

        .annotator-header {
            border-bottom: 3px solid var(--border-color);
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 20px;
        }

        .annotator-header h2 {
            font-family: var(--font-display);
            font-size: 32px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .annotator-header h2 span {
            color: var(--accent-magenta);
        }

        .annotator-controls {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            padding: 16px;
            box-shadow: var(--brutal-shadow);
        }

        .tool-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            background: var(--bg-tertiary);
        }

        /* 3-Column Document Workspace */
        .document-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-bottom: 30px;
        }

        @media (max-width: 1024px) {
            .document-grid {
                grid-template-columns: 1fr;
            }
        }

        .document-card {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            border-radius: 4px;
            box-shadow: var(--brutal-shadow-hover);
            display: flex;
            flex-direction: column;
            height: 520px;
            position: relative;
            overflow: hidden;
            transition: border-color 0.2s ease;
        }

        .document-card:hover {
            border-color: var(--accent-cyan);
        }

        .document-title-bar {
            background: var(--bg-tertiary);
            padding: 12px 16px;
            border-bottom: 2px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .document-title {
            font-family: var(--font-display);
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-primary);
            letter-spacing: 1px;
        }

        .document-meta {
            font-size: 10px;
            color: var(--accent-cyan);
            font-weight: 700;
            text-transform: uppercase;
        }

        /* Document Canvas / Interactive area */
        .document-canvas {
            flex-grow: 1;
            padding: 20px;
            overflow-y: auto;
            position: relative;
            background: #111420;
            cursor: crosshair;
            user-select: none;
        }

        /* Standard document page mock themes */
        .doc-page-exec {
            color: #d1d5db;
            font-size: 12px;
            line-height: 1.6;
        }

        .doc-page-exec h4 {
            color: #fff;
            font-family: var(--font-display);
            font-size: 14px;
            margin-bottom: 12px;
            text-transform: uppercase;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 4px;
        }

        .doc-page-exec p {
            margin-bottom: 12px;
        }

        .doc-ledger-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            color: #9ca3af;
        }

        .doc-ledger-table th {
            text-align: left;
            border-bottom: 2px solid var(--border-color);
            padding: 6px;
            color: #f3f4f6;
            text-transform: uppercase;
        }

        .doc-ledger-table td {
            padding: 8px 6px;
            border-bottom: 1px solid #1e2638;
        }

        .doc-ledger-table tr.alert-row td {
            color: var(--accent-orange);
            background: rgba(255, 92, 0, 0.05);
        }

        .doc-chart-mock {
            border: 2px dashed var(--border-color);
            border-radius: 4px;
            padding: 15px;
            background: var(--bg-primary);
            margin-top: 10px;
        }

        .doc-chart-bar {
            height: 14px;
            background: var(--accent-magenta);
            margin-bottom: 8px;
            border: 1px solid #000;
            box-shadow: 1px 1px 0px #000;
            position: relative;
        }

        /* Sticky Annotation Nodes */
        .annotation-pin {
            position: absolute;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: 2px solid #000;
            box-shadow: 2px 2px 0px #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-display);
            font-weight: 800;
            font-size: 12px;
            color: #000;
            cursor: pointer;
            z-index: 10;
            transform: translate(-50%, -50%);
            transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .annotation-pin:hover {
            transform: translate(-50%, -50%) scale(1.2);
        }

        .annotation-pin.pin-cyan { background: var(--accent-cyan); }
        .annotation-pin.pin-orange { background: var(--accent-orange); }
        .annotation-pin.pin-magenta { background: var(--accent-magenta); }

        /* Floating Sticky Note Dialog inside Document viewport */
        .sticky-note-popup {
            position: absolute;
            background: var(--bg-tertiary);
            border: 2px solid var(--accent-cyan);
            padding: 12px;
            border-radius: 4px;
            box-shadow: 4px 4px 0px #000;
            width: 220px;
            z-index: 20;
            font-size: 11px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .sticky-note-popup.border-cyan { border-color: var(--accent-cyan); }
        .sticky-note-popup.border-orange { border-color: var(--accent-orange); }
        .sticky-note-popup.border-magenta { border-color: var(--accent-magenta); }

        .sticky-note-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 10px;
            color: var(--text-secondary);
        }

        .sticky-note-popup textarea {
            width: 100%;
            height: 50px;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 6px;
            font-size: 11px;
            resize: none;
            outline: none;
        }

        .sticky-note-popup textarea:focus {
            border-color: var(--accent-cyan);
        }

        .sticky-btn-group {
            display: flex;
            justify-content: space-between;
        }

        .sticky-action-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 4px 8px;
            font-size: 9px;
            cursor: pointer;
            text-transform: uppercase;
            font-weight: 700;
        }

        .sticky-action-btn:hover {
            border-color: var(--accent-magenta);
            color: var(--text-primary);
        }

        /* Sidebar / Global Comments & Execution Panel */
        .signoff-panel {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            box-shadow: var(--brutal-shadow);
            padding: 24px;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 30px;
        }

        @media (max-width: 768px) {
            .signoff-panel {
                grid-template-columns: 1fr;
            }
        }

        .panel-left {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .panel-right {
            border-left: 2px dashed var(--border-color);
            padding-left: 30px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 20px;
        }

        @media (max-width: 768px) {
            .panel-right {
                border-left: none;
                padding-left: 0;
                border-top: 2px dashed var(--border-color);
                padding-top: 20px;
            }
        }

        .panel-title {
            font-family: var(--font-display);
            font-size: 18px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-primary);
            margin-bottom: 10px;
        }

        .global-comments-feed {
            background: var(--bg-primary);
            border: 1.5px solid var(--border-color);
            height: 160px;
            overflow-y: auto;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .comment-node {
            font-size: 12px;
            border-bottom: 1px solid #1a202c;
            padding-bottom: 6px;
        }

        .comment-meta {
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--accent-cyan);
            margin-bottom: 2px;
        }

        /* Sign-off Action Elements */
        .signoff-status {
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: var(--font-display);
            font-weight: 800;
            text-transform: uppercase;
            font-size: 18px;
            color: var(--accent-orange);
            background: rgba(255, 92, 0, 0.05);
            padding: 12px;
            border: 1px solid var(--accent-orange);
        }

        .signoff-btns {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .btn-sign {
            width: 100%;
            text-align: center;
        }

        .btn-lime {
            background: var(--accent-lime);
            color: #000;
        }
        .btn-lime:hover {
            background: #fff;
        }

        .btn-orange {
            background: var(--accent-orange);
            color: #000;
        }
        .btn-orange:hover {
            background: #fff;
        }

        .btn-magenta {
            background: var(--accent-magenta);
            color: #000;
        }
        .btn-magenta:hover {
            background: #fff;
        }
    `;

    // Inject Styles to Document Head
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // Initial state storage for annotations
    let activeColor = 'cyan';
    let annotationCounter = 0;
    const annotationsList = [];

    // Inject Feedback Hub section before "Personalized Strategy Banner"
    function init() {
        const strategySection = document.getElementById('strategy');
        if (!strategySection) return;

        const container = document.createElement('section');
        container.className = 'annotator-section';
        container.id = 'document-preview-feedback-hub';

        container.innerHTML = `
            <div class="annotator-header">
                <div>
                    <p style="text-transform: uppercase; font-size: 11px; font-weight: 800; color: var(--accent-cyan); letter-spacing: 2px;">Asset Audit Workspace</p>
                    <h2 style="margin-top: 5px;">Document Preview & <span>Feedback Hub</span></h2>
                </div>
                <p style="color: var(--text-secondary); max-width: 480px; font-size: 14px;">
                    Review uploaded borrower attachments side-by-side. Point and click directly inside any page to plant high-voltage feedback nodes.
                </p>
            </div>

            <div class="annotator-controls">
                <div class="tool-indicator">
                    <span style="display:inline-block; width: 8px; height: 8px; border-radius:50%; background: var(--accent-lime);"></span>
                    Active Auditor Mode
                </div>
                <div style="display: flex; gap: 8px; align-items: center; margin-left: auto;">
                    <span style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-right: 8px;">Select Color Matrix:</span>
                    <button class="filter-btn active" id="btn-color-cyan" style="border-color: var(--accent-cyan); padding: 8px 12px; font-size: 11px;">Risk Alert</button>
                    <button class="filter-btn" id="btn-color-orange" style="border-color: var(--accent-orange); padding: 8px 12px; font-size: 11px;">Verify</button>
                    <button class="filter-btn" id="btn-color-magenta" style="border-color: var(--accent-magenta); padding: 8px 12px; font-size: 11px;">Revision Required</button>
                </div>
            </div>

            <!-- Workspace Side-by-Side View -->
            <div class="document-grid">
                
                <!-- Document 1: Exec Summary -->
                <div class="document-card">
                    <div class="document-title-bar">
                        <span class="document-title">1. Executive Summary & Use</span>
                        <span class="document-meta">PDF - Page 1</span>
                    </div>
                    <div class="document-canvas" id="canvas-doc1">
                        <div class="doc-page-exec">
                            <h4>I. Strategic Expansion Strategy</h4>
                            <p>Requesting capital facilitation to capture enterprise logistics infrastructure. Projections estimate a compounding 3.4x returns ratio relative to the equipment lease investment models.</p>
                            <h4>II. Immediate Cash Flow Allocations</h4>
                            <p>Vessel logistics systems acquisition: <b>$120,000</b>.<br>Operating reserve allocations: <b>$30,000</b>.</p>
                            <h4>III. Expected Amortization Buffer</h4>
                            <p>We anticipate utilizing baseline receivables backstops to insulate early payments during integration milestones. Expected DSCR metrics average 1.35x.</p>
                        </div>
                    </div>
                </div>

                <!-- Document 2: Bank Statement -->
                <div class="document-card">
                    <div class="document-title-bar">
                        <span class="document-title">2. 6-Month Ledger Statement</span>
                        <span class="document-meta">XLSX - Live Data</span>
                    </div>
                    <div class="document-canvas" id="canvas-doc2">
                        <table class="doc-ledger-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Ref ID</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>10/12/24</td>
                                    <td>ACH-849</td>
                                    <td style="color: var(--accent-lime);">+$12,400</td>
                                    <td>Deposit</td>
                                </tr>
                                <tr class="alert-row">
                                    <td>10/14/24</td>
                                    <td>FND-OUT</td>
                                    <td style="color: var(--accent-orange); font-weight:700;">-$4,200</td>
                                    <td>NSF/Return</td>
                                </tr>
                                <tr>
                                    <td>10/18/24</td>
                                    <td>MERCH-DEP</td>
                                    <td style="color: var(--accent-lime);">+$8,900</td>
                                    <td>Settlement</td>
                                </tr>
                                <tr>
                                    <td>10/22/24</td>
                                    <td>ACH-901</td>
                                    <td style="color: var(--accent-lime);">+$15,000</td>
                                    <td>Deposit</td>
                                </tr>
                                <tr class="alert-row">
                                    <td>10/25/24</td>
                                    <td>FND-OUT</td>
                                    <td style="color: var(--accent-orange); font-weight:700;">-$6,800</td>
                                    <td>Unauth Ret</td>
                                </tr>
                                <tr>
                                    <td>10/28/24</td>
                                    <td>MERCH-DEP</td>
                                    <td style="color: var(--accent-lime);">+$11,200</td>
                                    <td>Settlement</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Document 3: Merchant Processing Processing -->
                <div class="document-card">
                    <div class="document-title-bar">
                        <span class="document-title">3. Merchant Processing</span>
                        <span class="document-meta">Data Engine Plot</span>
                    </div>
                    <div class="document-canvas" id="canvas-doc3">
                        <div class="doc-page-exec">
                            <h4>Processing Volume Metrics</h4>
                            <p>Historical merchant settlements across primary active gateway profiles.</p>
                            <div class="doc-chart-mock">
                                <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 4px;">August Total: $140,000</div>
                                <div class="doc-chart-bar" style="width: 85%;"></div>
                                <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 4px;">September Total: $165,000</div>
                                <div class="doc-chart-bar" style="width: 98%; background: var(--accent-cyan);"></div>
                                <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 4px;">October Total: $110,000</div>
                                <div class="doc-chart-bar" style="width: 65%; background: var(--accent-orange);"></div>
                            </div>
                            <p style="margin-top: 15px; font-size: 11px; color: var(--text-secondary);">
                                Performance indices reflect a slight seasonal consolidation during Q3 transitions. Overall processing structures remain positive.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Global Auditing Decisions and Live Logs -->
            <div class="signoff-panel">
                <div class="panel-left">
                    <div class="panel-title">Active Feedback Timeline</div>
                    <div class="global-comments-feed" id="comments-timeline">
                        <div class="comment-node">
                            <div class="comment-meta">SYSTEM ANALYSIS • NOW</div>
                            Sandbox integrity matches. Waiting for physical risk markers from manual inspector nodes.
                        </div>
                    </div>
                    <div style="font-size: 11px; color: var(--text-secondary);">
                        * Dynamic document coordinates and feedback matrices auto-generate client-side instantly. Zero backend tracking.
                    </div>
                </div>

                <div class="panel-right">
                    <div>
                        <div class="panel-title">Underwriting Verdict</div>
                        <div class="signoff-status" id="signoff-status-box">
                            PENDING AUDIT NODES
                        </div>
                    </div>

                    <div class="signoff-btns">
                        <button class="btn-action btn-sign btn-lime" id="btn-approve">Approve & Sign Off</button>
                        <button class="btn-action btn-sign btn-orange" id="btn-revisions">Request Revisions</button>
                        <button class="btn-action btn-sign btn-magenta" id="btn-reject">Reject Underwriting</button>
                    </div>
                </div>
            </div>
        `;

        strategySection.parentNode.insertBefore(container, strategySection);

        // Add Active Interactive Listeners for Annotator Elements
        setupColorControls();
        setupCanvasListeners();
        setupSignoffActions();
    }

    // Color toggle selection matching active audit scope
    function setupColorControls() {
        const btnCyan = document.getElementById('btn-color-cyan');
        const btnOrange = document.getElementById('btn-color-orange');
        const btnMagenta = document.getElementById('btn-color-magenta');

        const buttons = [btnCyan, btnOrange, btnMagenta];

        function resetButtons() {
            buttons.forEach(btn => {
                if(btn) {
                    btn.classList.remove('active');
                    btn.style.boxShadow = 'none';
                    btn.style.background = 'var(--bg-tertiary)';
                    btn.style.color = 'var(--text-secondary)';
                }
            });
        }

        btnCyan.addEventListener('click', () => {
            resetButtons();
            btnCyan.classList.add('active');
            btnCyan.style.background = 'var(--accent-cyan)';
            btnCyan.style.color = '#000';
            btnCyan.style.boxShadow = '3px 3px 0px #000';
            activeColor = 'cyan';
        });

        btnOrange.addEventListener('click', () => {
            resetButtons();
            btnOrange.classList.add('active');
            btnOrange.style.background = 'var(--accent-orange)';
            btnOrange.style.color = '#000';
            btnOrange.style.boxShadow = '3px 3px 0px #000';
            activeColor = 'orange';
        });

        btnMagenta.addEventListener('click', () => {
            resetButtons();
            btnMagenta.classList.add('active');
            btnMagenta.style.background = 'var(--accent-magenta)';
            btnMagenta.style.color = '#000';
            btnMagenta.style.boxShadow = '3px 3px 0px #000';
            activeColor = 'magenta';
        });

        // Initialize Cyan defaults
        btnCyan.click();
    }

    // Canvas click detection & dynamic sticky element creations
    function setupCanvasListeners() {
        const canvases = ['canvas-doc1', 'canvas-doc2', 'canvas-doc3'];

        canvases.forEach((id, docIndex) => {
            const canvasEl = document.getElementById(id);
            if (!canvasEl) return;

            canvasEl.addEventListener('click', function (e) {
                // Prevent bubbling if user clicked an active element or the popup
                if (e.target !== canvasEl && !canvasEl.classList.contains('doc-page-exec') && !canvasEl.classList.contains('doc-ledger-table') && e.target.tagName !== 'TD' && e.target.tagName !== 'P' && e.target.tagName !== 'H4') {
                    return;
                }

                // Calculate relative click coordinates within canvas container
                const rect = canvasEl.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                createAnnotationNode(canvasEl, x, y, activeColor, docIndex + 1);
            });
        });
    }

    function createAnnotationNode(container, x, y, color, docNumber) {
        annotationCounter++;
        const currentId = annotationCounter;

        // Create numeric visual pin
        const pin = document.createElement('div');
        pin.className = `annotation-pin pin-${color}`;
        pin.style.left = `${x}px`;
        pin.style.top = `${y}px`;
        pin.innerText = currentId;
        pin.id = `pin-${currentId}`;

        // Create Neobrutalist editable sticky note popover window
        const popup = document.createElement('div');
        popup.className = `sticky-note-popup border-${color}`;
        popup.style.left = `${x + 15}px`;
        popup.style.top = `${y - 15}px`;
        popup.id = `popup-${currentId}`;

        const docTitleText = docNumber === 1 ? 'Exec Summary' : docNumber === 2 ? 'Ledger Block' : 'Merchant Plot';

        popup.innerHTML = `
            <div class="sticky-note-header">
                <span>Marker #${currentId}</span>
                <span>${docTitleText}</span>
            </div>
            <textarea placeholder="Write underwriting notes..."></textarea>
            <div class="sticky-btn-group">
                <button class="sticky-action-btn" id="save-note-${currentId}" style="color: var(--accent-cyan);">Save Note</button>
                <button class="sticky-action-btn" id="del-note-${currentId}" style="color: var(--accent-magenta);">Delete</button>
            </div>
        `;

        container.appendChild(pin);
        container.appendChild(popup);

        // Auto-focus on text area input
        const textarea = popup.querySelector('textarea');
        textarea.focus();

        // Handle Pin Drag/Re-position click interaction
        pin.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = popup.style.display !== 'none';
            popup.style.display = isOpen ? 'none' : 'flex';
        });

        // Add Save event loop
        const saveBtn = popup.querySelector(`#save-note-${currentId}`);
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const noteText = textarea.value.trim() || 'Unspecified audit flag registered';
            saveAnnotation(currentId, docTitleText, color, noteText);
            popup.style.display = 'none';
        });

        // Add Delete event loop
        const delBtn = popup.querySelector(`#del-note-${currentId}`);
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            pin.remove();
            popup.remove();
            removeAnnotation(currentId);
        });
    }

    // Register comments dynamically onto lower feed
    function saveAnnotation(id, source, color, text) {
        const commentsFeed = document.getElementById('comments-timeline');
        if (!commentsFeed) return;

        // Check if previously logged to avoid duplicate element insertions
        let existingNode = document.getElementById(`feed-node-${id}`);
        const tagLabel = color === 'cyan' ? 'RISK ALERT' : color === 'orange' ? 'VERIFICATION' : 'REVISION';

        if (existingNode) {
            existingNode.innerHTML = `
                <div class="comment-meta" style="color: var(--accent-${color});">Marker #${id} • ${source} • ${tagLabel}</div>
                "${text}"
            `;
        } else {
            const node = document.createElement('div');
            node.className = 'comment-node';
            node.id = `feed-node-${id}`;
            node.innerHTML = `
                <div class="comment-meta" style="color: var(--accent-${color});">Marker #${id} • ${source} • ${tagLabel}</div>
                "${text}"
            `;
            commentsFeed.prepend(node);
            
            // Notify system toast from baseline platform
            if (typeof window.showNotification === 'function') {
                window.showNotification(`Marker #${id} logged to audit ledger`);
            } else {
                const toastText = document.getElementById('toast-text');
                const toast = document.getElementById('toast');
                if (toast && toastText) {
                    toastText.innerText = `Marker #${id} logged to audit ledger`;
                    toast.classList.add('visible');
                    setTimeout(() => toast.classList.remove('visible'), 2500);
                }
            }
        }

        // Update active underwriting grade block
        updateUnderwritingStatus();
    }

    function removeAnnotation(id) {
        const existingNode = document.getElementById(`feed-node-${id}`);
        if (existingNode) {
            existingNode.remove();
        }
        updateUnderwritingStatus();
    }

    function updateUnderwritingStatus() {
        const statusBox = document.getElementById('signoff-status-box');
        if (!statusBox) return;

        const nodesCount = document.querySelectorAll('.comment-node').length;

        if (nodesCount === 1) {
            statusBox.innerText = 'INITIAL FLAGS DETECTED';
            statusBox.style.color = 'var(--accent-orange)';
            statusBox.style.borderColor = 'var(--accent-orange)';
            statusBox.style.background = 'rgba(255, 92, 0, 0.05)';
        } else if (nodesCount > 2) {
            statusBox.innerText = 'CRITICAL ATTENTION REQUIRED';
            statusBox.style.color = 'var(--accent-magenta)';
            statusBox.style.borderColor = 'var(--accent-magenta)';
            statusBox.style.background = 'rgba(255, 0, 122, 0.05)';
        } else {
            statusBox.innerText = 'PENDING AUDIT NODES';
            statusBox.style.color = 'var(--accent-cyan)';
            statusBox.style.borderColor = 'var(--accent-cyan)';
            statusBox.style.background = 'rgba(0, 240, 255, 0.05)';
        }
    }

    // Set Up Action Button Final Submissions
    function setupSignoffActions() {
        const approveBtn = document.getElementById('btn-approve');
        const revisionsBtn = document.getElementById('btn-revisions');
        const rejectBtn = document.getElementById('btn-reject');
        const statusBox = document.getElementById('signoff-status-box');

        approveBtn.addEventListener('click', () => {
            statusBox.innerText = 'UNDERWRITING SIGNED OFF & APPROVED';
            statusBox.style.color = 'var(--accent-lime)';
            statusBox.style.borderColor = 'var(--accent-lime)';
            statusBox.style.background = 'rgba(57, 255, 20, 0.05)';
            triggerSystemToast('VERDICT APPROVED • EXECUTING CAPITAL FUNDING');
        });

        revisionsBtn.addEventListener('click', () => {
            statusBox.innerText = 'REVISIONS REQUEST SENT TO ISSUER';
            statusBox.style.color = 'var(--accent-orange)';
            statusBox.style.borderColor = 'var(--accent-orange)';
            statusBox.style.background = 'rgba(255, 92, 0, 0.05)';
            triggerSystemToast('REVISIONS DISPATCHED • QUEUE PAUSED');
        });

        rejectBtn.addEventListener('click', () => {
            statusBox.innerText = 'SUBMISSION COLD-REJECTED';
            statusBox.style.color = 'var(--accent-magenta)';
            statusBox.style.borderColor = 'var(--accent-magenta)';
            statusBox.style.background = 'rgba(255, 0, 122, 0.05)';
            triggerSystemToast('PROPOSAL SHUTDOWN • BLACKLIST RECORDED');
        });
    }

    function triggerSystemToast(text) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(text);
        } else {
            const toastText = document.getElementById('toast-text');
            const toast = document.getElementById('toast');
            if (toast && toastText) {
                toastText.innerText = text;
                toast.classList.add('visible');
                setTimeout(() => toast.classList.remove('visible'), 3000);
            }
        }
    }

    // Kick off workspace construction
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();