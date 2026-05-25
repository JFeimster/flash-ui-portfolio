// COLLABORATIVE REVIEW & ANNOTATION BOARD ENGINE
// Self-contained neo-brutalist interactive module for fintech compliance review

(function() {
    // Inject custom CSS styling specifically for the collaborative workspace board
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Collaboration Board Styles */
        :root {
            --collab-primary: #00f3ff;
            --collab-accent: #ff0055;
            --collab-warning: #ffee00;
            --collab-bg: #0b0c10;
            --collab-surface: #14161f;
            --collab-card: #1a1d29;
            --collab-border: 3px solid #ffffff;
            --collab-shadow: 6px 6px 0px #ffffff;
        }

        /* Floating workspace launcher */
        .collab-launcher {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 999;
            background: var(--collab-accent);
            color: #fff;
            border: var(--collab-border);
            padding: 15px 25px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            font-size: 16px;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 6px 6px 0px #fff;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: transform 0.1s, box-shadow 0.1s;
        }

        .collab-launcher:hover {
            transform: translate(-2px, -2px);
            box-shadow: 8px 8px 0px #fff;
        }

        .collab-launcher:active {
            transform: translate(4px, 4px);
            box-shadow: 0px 0px 0px;
        }

        /* Fullscreen Workspace Overlay */
        .collab-workspace {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(11, 12, 16, 0.98);
            z-index: 1001;
            display: none;
            flex-direction: column;
            font-family: 'Plus Jakarta Sans', sans-serif;
            padding: 20px;
            box-sizing: border-box;
            overflow: hidden;
        }

        .collab-workspace.active {
            display: flex;
        }

        /* Top Control Bar */
        .collab-topbar {
            background: var(--collab-surface);
            border: var(--collab-border);
            box-shadow: 4px 4px 0px var(--collab-primary);
            padding: 15px 30px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
        }

        .collab-brand {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .collab-badge {
            background: var(--collab-warning);
            color: #000;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            text-transform: uppercase;
            padding: 4px 10px;
            border: 2px solid #000;
            font-size: 12px;
        }

        .collab-title {
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            font-size: 20px;
            letter-spacing: -0.5px;
            color: #fff;
            text-transform: uppercase;
        }

        .collab-global-status {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .global-stat-box {
            background: var(--collab-card);
            border: 2px solid #fff;
            padding: 5px 12px;
            font-size: 13px;
            font-weight: 700;
        }

        .global-stat-box span {
            color: var(--collab-primary);
        }

        .collab-close-btn {
            background: var(--collab-accent);
            color: #fff;
            border: 2px solid #fff;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            padding: 8px 16px;
            cursor: pointer;
            text-transform: uppercase;
            box-shadow: 3px 3px 0px #fff;
        }

        .collab-close-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px;
        }

        /* Workspace Grid (3 Columns + Sidebar) */
        .collab-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr) 350px;
            gap: 20px;
            flex-grow: 1;
            height: calc(100vh - 120px);
            overflow: hidden;
        }

        /* Column Component Cards */
        .collab-col {
            background: var(--collab-surface);
            border: var(--collab-border);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: var(--collab-shadow);
            position: relative;
        }

        .collab-col-header {
            background: #000;
            padding: 15px;
            border-bottom: var(--collab-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .collab-col-title {
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #fff;
        }

        /* File Status Badges inside columns */
        .file-status-select {
            background: var(--collab-card);
            color: #fff;
            border: 2px solid #fff;
            font-weight: 800;
            font-size: 11px;
            text-transform: uppercase;
            padding: 4px 8px;
            cursor: pointer;
            outline: none;
        }

        .file-status-select.approved { border-color: var(--collab-primary); color: var(--collab-primary); }
        .file-status-select.rejected { border-color: var(--collab-accent); color: var(--collab-accent); }
        .file-status-select.revision { border-color: var(--collab-warning); color: var(--collab-warning); }

        /* Column Content Body */
        .collab-col-body {
            padding: 20px;
            overflow-y: auto;
            flex-grow: 1;
            font-size: 14px;
            line-height: 1.5;
            color: #e0e4f0;
        }

        /* Custom Content types inside panels */
        .doc-text-block {
            margin-bottom: 15px;
            position: relative;
            padding: 8px;
            border-left: 2px solid rgba(255,255,255,0.1);
            transition: background 0.2s;
        }

        .doc-text-block:hover {
            background: rgba(255, 255, 255, 0.03);
        }

        /* Highlight feature indicators */
        .highlightable {
            cursor: pointer;
            position: relative;
        }

        .highlightable:hover::after {
            content: 'Click to Highlight';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--collab-accent);
            color: #fff;
            font-size: 10px;
            padding: 2px 6px;
            font-weight: 800;
            text-transform: uppercase;
            white-space: nowrap;
            border: 1px solid #fff;
            z-index: 10;
        }

        .highlighted-text {
            background: rgba(255, 0, 85, 0.3);
            border-bottom: 2px dashed var(--collab-accent);
        }

        .highlighted-text.cyan {
            background: rgba(0, 243, 255, 0.3);
            border-bottom: 2px dashed var(--collab-primary);
        }

        /* Sheet grid layout mock */
        .sheet-table {
            width: 100%;
            border-collapse: collapse;
            font-family: monospace;
            font-size: 12px;
        }

        .sheet-table th, .sheet-table td {
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 8px;
            text-align: left;
        }

        .sheet-table th {
            background: var(--collab-card);
            color: var(--collab-primary);
            text-transform: uppercase;
        }

        .sheet-row-interactive {
            cursor: pointer;
        }

        .sheet-row-interactive:hover {
            background: rgba(0, 243, 255, 0.1);
        }

        /* Graphical Exposure block mock */
        .exposure-chart-mock {
            border: 2px dashed rgba(255,255,255,0.2);
            padding: 20px;
            background: rgba(0,0,0,0.3);
            text-align: center;
            margin-bottom: 20px;
        }

        .exposure-bar-container {
            display: flex;
            align-items: flex-end;
            gap: 8px;
            height: 120px;
            margin: 20px 0;
            border-bottom: 2px solid #fff;
            padding-bottom: 5px;
        }

        .exposure-bar {
            flex: 1;
            background: var(--collab-primary);
            transition: height 0.3s;
            position: relative;
            cursor: pointer;
        }

        .exposure-bar:hover {
            background: var(--collab-warning);
        }

        .exposure-bar::after {
            content: attr(data-value);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 9px;
            color: #fff;
            font-weight: bold;
        }

        /* Sidebar: Comment Engine Feed */
        .collab-sidebar {
            background: var(--collab-surface);
            border: var(--collab-border);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 6px 6px 0px var(--collab-warning);
        }

        .sidebar-header {
            background: #000;
            padding: 15px;
            border-bottom: var(--collab-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .sidebar-title {
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            color: var(--collab-warning);
        }

        .comment-feed {
            flex-grow: 1;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .comment-bubble {
            background: var(--collab-card);
            border: 2px solid #fff;
            padding: 12px;
            font-size: 13px;
            position: relative;
            transition: transform 0.2s;
        }

        .comment-bubble:hover {
            transform: translateX(-3px);
        }

        .comment-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .comment-author {
            color: var(--collab-primary);
        }

        .comment-tag {
            color: var(--collab-accent);
            background: rgba(255, 0, 85, 0.1);
            padding: 1px 5px;
            border: 1px solid var(--collab-accent);
        }

        .comment-text {
            color: #ffffff;
            line-height: 1.4;
        }

        /* Comment form dynamic entry styling */
        .comment-form {
            padding: 15px;
            border-top: var(--collab-border);
            background: var(--collab-card);
        }

        .comment-form-group {
            margin-bottom: 10px;
        }

        .comment-select {
            width: 100%;
            background: var(--collab-surface);
            color: #fff;
            border: 2px solid #fff;
            padding: 8px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
            outline: none;
        }

        .comment-input {
            width: 100%;
            background: var(--collab-surface);
            color: #fff;
            border: 2px solid #fff;
            padding: 10px;
            font-size: 13px;
            font-family: inherit;
            outline: none;
            resize: none;
            height: 60px;
        }

        .comment-input:focus {
            border-color: var(--collab-primary);
        }

        .comment-submit-btn {
            width: 100%;
            background: var(--collab-primary);
            color: #000;
            border: 2px solid #fff;
            padding: 10px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 3px 3px 0px #fff;
        }

        .comment-submit-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px;
        }

        @media (max-width: 1200px) {
            .collab-grid {
                grid-template-columns: 1fr;
                overflow-y: auto;
                height: auto;
            }
            .collab-col {
                height: 400px;
            }
            .collab-sidebar {
                height: 500px;
            }
        }
    `;
    document.head.appendChild(styleElement);

    // Initial Mock State Data
    const state = {
        statuses: {
            attA: "revision",
            attB: "approved",
            attC: "revision"
        },
        comments: [
            { id: 1, author: "Lead Audit", target: "ATT-A (Merchant Agreement)", text: "Verify clause 4.2 repayment rates align with state MCA caps." },
            { id: 2, author: "Compliance Desk", target: "ATT-B (Underwriting Excel)", text: "Revenue cap limits approved based on monthly averages." },
            { id: 3, author: "Risk Officer", target: "ATT-C (Exposure Assessment)", text: "Risk index values elevated on week 3 projection vectors." }
        ]
    };

    // Construct DOM workspace elements dynamically
    function init() {
        // 1. Create Floating Activator Button
        const launchBtn = document.createElement('button');
        launchBtn.className = 'collab-launcher';
        launchBtn.innerHTML = `
            <span>📋 Audit & Compliance Board</span>
            <span class="collab-badge" id="collab-unread-badge">3 Files Loaded</span>
        `;
        document.body.appendChild(launchBtn);

        // 2. Create Workspace Overlay Frame
        const workspace = document.createElement('div');
        workspace.className = 'collab-workspace';
        workspace.id = 'collabWorkspace';

        workspace.innerHTML = `
            <!-- Top Controls -->
            <div class="collab-topbar">
                <div class="collab-brand">
                    <span class="collab-badge">COLLABORATIVE CONTEXT</span>
                    <span class="collab-title">Audit Review Panel</span>
                </div>
                <div class="collab-global-status">
                    <div class="global-stat-box">APPROVED: <span id="global-count-approved">1</span></div>
                    <div class="global-stat-box">REVISIONS: <span id="global-count-revision">2</span></div>
                    <button class="collab-close-btn" id="closeCollabBtn">Close Audit Panel [X]</button>
                </div>
            </div>

            <!-- Workspace Matrix Columns -->
            <div class="collab-grid">
                <!-- Attachment A: Merchant Agreement Text -->
                <div class="collab-col" id="col-attA">
                    <div class="collab-col-header">
                        <span class="collab-col-title">📄 ATT-A: Merchant Agreement</span>
                        <select class="file-status-select revision" data-file="attA" id="status-attA">
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="revision" selected>Needs Revision</option>
                        </select>
                    </div>
                    <div class="collab-col-body">
                        <div class="doc-text-block highlightable" data-target="ATT-A (Merchant Agreement)">
                            <strong style="color:var(--collab-warning)">CLAUSE 1.1: Advance Structure</strong><br>
                            The funder agrees to purchase $100,000 of future receivables for an absolute purchase price payment of $85,000 based on standard operations.
                        </div>
                        <div class="doc-text-block highlightable" data-target="ATT-A (Merchant Agreement)">
                            <strong style="color:var(--collab-warning)">CLAUSE 4.2: True Daily Splits</strong><br>
                            The merchant shall permit daily ACH bank collection matching 15% of gross operational revenue, computed weekly on average cash flows.
                        </div>
                        <div class="doc-text-block highlightable" data-target="ATT-A (Merchant Agreement)">
                            <strong>CLAUSE 9.4: Recourse Definitions</strong><br>
                            This transactions acts as non-recourse asset factoring and does not establish a standard bank debt instrument.
                        </div>
                        <p style="font-size: 11px; color: #8e95ad; margin-top: 20px;">💡 Click any paragraph clause above to highlight and generate a targeted audit thread instantly.</p>
                    </div>
                </div>

                <!-- Attachment B: Underwriting Financial Grid -->
                <div class="collab-col" id="col-attB">
                    <div class="collab-col-header">
                        <span class="collab-col-title">📊 ATT-B: Underwriting Model</span>
                        <select class="file-status-select approved" data-file="attB" id="status-attB">
                            <option value="approved" selected>Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="revision">Needs Revision</option>
                        </select>
                    </div>
                    <div class="collab-col-body">
                        <p style="margin-bottom: 15px;">Target Underwriting Projections Matrix:</p>
                        <table class="sheet-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="sheet-row-interactive" data-target="ATT-B (Underwriting Excel)" data-ref="Monthly Sales">
                                    <td>Est. Monthly Sales</td>
                                    <td>$84,500.00</td>
                                    <td style="color: var(--collab-primary)">OK</td>
                                </tr>
                                <tr class="sheet-row-interactive" data-target="ATT-B (Underwriting Excel)" data-ref="Reserve Ratio">
                                    <td>Target Reserve Ratio</td>
                                    <td>8.50%</td>
                                    <td style="color: var(--collab-primary)">OK</td>
                                </tr>
                                <tr class="sheet-row-interactive" data-target="ATT-B (Underwriting Excel)" data-ref="Debt Load">
                                    <td>Debt-Service Coverage</td>
                                    <td>1.38x</td>
                                    <td style="color: var(--collab-primary)">OK</td>
                                </tr>
                                <tr class="sheet-row-interactive" data-target="ATT-B (Underwriting Excel)" data-ref="Est Yield">
                                    <td>Expected Margin Yield</td>
                                    <td>22.4%</td>
                                    <td style="color: var(--collab-warning)">Review</td>
                                </tr>
                            </tbody>
                        </table>
                        <p style="font-size: 11px; color: #8e95ad; margin-top: 20px;">💡 Click individual spreadsheet rows to highlight indicators for compliance team inspection.</p>
                    </div>
                </div>

                <!-- Attachment C: Risk Assessment Exposure Visuals -->
                <div class="collab-col" id="col-attC">
                    <div class="collab-col-header">
                        <span class="collab-col-title">⚡ ATT-C: Risk Vectors</span>
                        <select class="file-status-select revision" data-file="attC" id="status-attC">
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="revision" selected>Needs Revision</option>
                        </select>
                    </div>
                    <div class="collab-col-body">
                        <div class="exposure-chart-mock">
                            <p style="font-size:12px; margin-bottom:10px; font-weight: bold;">WEEKLY EXPOSURE FORECASTS</p>
                            <div class="exposure-bar-container">
                                <div class="exposure-bar" data-value="14%" style="height: 30px;" data-target="ATT-C (Risk Vectors)" data-week="Wk 1"></div>
                                <div class="exposure-bar" data-value="32%" style="height: 60px;" data-target="ATT-C (Risk Vectors)" data-week="Wk 2"></div>
                                <div class="exposure-bar" data-value="68%" style="height: 110px;" data-target="ATT-C (Risk Vectors)" data-week="Wk 3"></div>
                                <div class="exposure-bar" data-value="45%" style="height: 80px;" data-target="ATT-C (Risk Vectors)" data-week="Wk 4"></div>
                            </div>
                            <p style="font-size: 11px; color: var(--collab-warning)">Interactive high-risk peaks detected (Week 3)</p>
                        </div>
                        <p style="font-size: 11px; color: #8e95ad;">💡 Click visual index bars above to link compliance annotations immediately to the forecasting periods.</p>
                    </div>
                </div>

                <!-- Right Sidebar: Interactive Annotation Feed -->
                <div class="collab-sidebar">
                    <div class="sidebar-header">
                        <span class="sidebar-title">💬 Compliance Log</span>
                    </div>
                    <div class="comment-feed" id="commentFeed">
                        <!-- Injected dynamically -->
                    </div>
                    
                    <!-- New Annotation Submission Form -->
                    <div class="comment-form">
                        <div class="comment-form-group">
                            <label class="calc-label" style="font-size: 11px; margin-bottom: 5px;">Reference target</label>
                            <select class="comment-select" id="commentTarget">
                                <option value="ATT-A (Merchant Agreement)">ATT-A (Merchant Agreement)</option>
                                <option value="ATT-B (Underwriting Excel)">ATT-B (Underwriting Excel)</option>
                                <option value="ATT-C (Risk Vectors)">ATT-C (Risk Vectors)</option>
                            </select>
                        </div>
                        <div class="comment-form-group">
                            <label class="calc-label" style="font-size: 11px; margin-bottom: 5px;">Observation / Revision Notes</label>
                            <textarea class="comment-input" id="commentText" placeholder="State compliance objection, parameter update, or validation log..."></textarea>
                        </div>
                        <button class="comment-submit-btn" id="submitCommentBtn">Append Annotation ➔</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(workspace);

        // Bind Launch Actions
        launchBtn.addEventListener('click', () => {
            workspace.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderComments();
            updateGlobalScores();
        });

        document.getElementById('closeCollabBtn').addEventListener('click', () => {
            workspace.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Initialize Internal Actions
        bindInternalEvents();
    }

    // Handle user inputs, selection highlights, and reactive stats
    function bindInternalEvents() {
        // Dropdown Status Change Events
        document.querySelectorAll('.file-status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const file = e.target.dataset.file;
                const status = e.target.value;
                
                // Update CSS styling
                e.target.className = `file-status-select ${status}`;
                state.statuses[file] = status;

                // Create alert dynamic comment log entry
                addAnnotationSystemLog(file, status);
                updateGlobalScores();
            });
        });

        // Highlight Attachment A Clauses
        document.querySelectorAll('.doc-text-block.highlightable').forEach(block => {
            block.addEventListener('click', () => {
                block.classList.toggle('highlighted-text');
                const targetName = block.dataset.target;
                const clauseTitle = block.querySelector('strong') ? block.querySelector('strong').innerText : "General Section";
                
                // Pre-fill target in annotation form
                const targetSelector = document.getElementById('commentTarget');
                targetSelector.value = targetName;
                
                // Highlight focus input
                const textInput = document.getElementById('commentText');
                textInput.value = `[Ref ${clauseTitle}]: Checked compliance logic. `;
                textInput.focus();
            });
        });

        // Highlight Attachment B (Excel cells)
        document.querySelectorAll('.sheet-row-interactive').forEach(row => {
            row.addEventListener('click', () => {
                row.style.background = 'rgba(0, 243, 255, 0.2)';
                const ref = row.dataset.ref;
                const targetName = row.dataset.target;

                const targetSelector = document.getElementById('commentTarget');
                targetSelector.value = targetName;

                const textInput = document.getElementById('commentText');
                textInput.value = `[Ref ${ref}]: Underwriting metrics parameters validation. `;
                textInput.focus();
            });
        });

        // Highlight Attachment C Visual Vectors
        document.querySelectorAll('.exposure-bar').forEach(bar => {
            bar.addEventListener('click', () => {
                bar.style.background = 'var(--collab-accent)';
                const week = bar.dataset.week;
                const value = bar.dataset.value;
                const targetName = bar.dataset.target;

                const targetSelector = document.getElementById('commentTarget');
                targetSelector.value = targetName;

                const textInput = document.getElementById('commentText');
                textInput.value = `[Ref Peak ${week} (${value})]: Verification of exposure anomalies. `;
                textInput.focus();
            });
        });

        // Comment submission process
        document.getElementById('submitCommentBtn').addEventListener('click', () => {
            const target = document.getElementById('commentTarget').value;
            const text = document.getElementById('commentText').value.trim();

            if (text === "") return;

            // Append to array state
            state.comments.push({
                id: Date.now(),
                author: "Funder Reviewer",
                target: target,
                text: text
            });

            // Reset Input
            document.getElementById('commentText').value = "";

            // Render Updates
            renderComments();
        });
    }

    // Append standard operational log message on status switches
    function addAnnotationSystemLog(file, status) {
        let label = file === "attA" ? "ATT-A (Merchant Agreement)" : file === "attB" ? "ATT-B (Underwriting Excel)" : "ATT-C (Risk Vectors)";
        let statusString = status.toUpperCase();
        
        state.comments.push({
            id: Date.now(),
            author: "System Engine",
            target: label,
            text: `Document validation status changed to [${statusString}] during collaborative session.`
        });
        renderComments();
    }

    // Refresh Sidebar Feed based on comments state
    function renderComments() {
        const feed = document.getElementById('commentFeed');
        feed.innerHTML = "";

        state.comments.forEach(comment => {
            const bubble = document.createElement('div');
            bubble.className = 'comment-bubble';
            bubble.innerHTML = `
                <div class="comment-meta">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-tag">${comment.target}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            `;
            feed.appendChild(bubble);
        });

        // Auto Scroll to latest comment
        feed.scrollTop = feed.scrollHeight;
    }

    // Calculate dynamic scores of complete workspace status parameters
    function updateGlobalScores() {
        let approvedCount = 0;
        let revisionCount = 0;

        Object.values(state.statuses).forEach(v => {
            if (v === 'approved') approvedCount++;
            else revisionCount++;
        });

        document.getElementById('global-count-approved').innerText = approvedCount;
        document.getElementById('global-count-revision').innerText = revisionCount;
        
        // Update Floating Badges on standard interface
        const unreadBadge = document.getElementById('collab-unread-badge');
        if (unreadBadge) {
            unreadBadge.innerText = `${revisionCount} Action Items Required`;
            unreadBadge.style.background = revisionCount > 0 ? 'var(--collab-accent)' : 'var(--collab-primary)';
            unreadBadge.style.color = '#fff';
        }
    }

    // Start loading board on initial screen parse
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();