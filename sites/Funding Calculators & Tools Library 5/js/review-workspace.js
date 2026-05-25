/**
 * js/review-workspace.js
 * Collaborative Review & Annotation Board for Fintech Resource Library
 * Designed with a high-contrast, Neo-Brutalist theme matching "Dynamic Edge".
 */

(function () {
    // Inject custom Neo-Brutalist Styles for the Review Workspace
    const styles = `
        /* Launcher Button */
        .review-board-launcher {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--accent-magenta, #ff0055);
            color: #fff;
            border: 3px solid #fff;
            padding: 16px 28px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 16px;
            letter-spacing: 1px;
            cursor: pointer;
            box-shadow: 6px 6px 0px #fff;
            z-index: 999;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: transform 0.1s, box-shadow 0.1s;
        }
        .review-board-launcher:hover {
            transform: translate(-3px, -3px);
            box-shadow: 9px 9px 0px #fff;
        }
        .review-board-launcher:active {
            transform: translate(3px, 3px);
            box-shadow: 0px 0px 0px;
        }
        .review-board-launcher .badge-count {
            background: #fff;
            color: #000;
            padding: 2px 8px;
            font-size: 12px;
            border: 2px solid #000;
        }

        /* Workspace Main Container */
        .review-workspace-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(11, 12, 16, 0.95);
            backdrop-filter: blur(8px);
            z-index: 2000;
            display: none;
            overflow-y: auto;
            padding: 30px;
            box-sizing: border-box;
            color: #fff;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .review-workspace-overlay.active {
            display: block;
        }

        .workspace-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--surface, #14161f);
            border: 3px solid #fff;
            padding: 24px 40px;
            box-shadow: 6px 6px 0px var(--accent-cyan, #00f3ff);
            margin-bottom: 30px;
        }
        .workspace-title-area h2 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 32px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .workspace-title-area p {
            color: var(--text-muted, #8e95ad);
            font-size: 15px;
        }

        .workspace-close-btn {
            background: var(--accent-magenta, #ff0055);
            color: #fff;
            border: 3px solid #fff;
            padding: 12px 24px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 4px 4px 0px #fff;
        }
        .workspace-close-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px;
        }

        /* 3-Column Document View Layout */
        .workspace-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin-bottom: 30px;
            align-items: start;
        }

        @media (max-width: 1200px) {
            .workspace-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Neo-Brutalist Document Cards */
        .doc-review-card {
            background: var(--surface, #14161f);
            border: 3px solid #fff;
            padding: 30px;
            position: relative;
            box-shadow: 6px 6px 0px rgba(255, 255, 255, 0.15);
            display: flex;
            flex-direction: column;
            min-height: 520px;
            transition: box-shadow 0.2s, transform 0.2s;
        }
        .doc-review-card.approved {
            border-color: var(--accent-cyan, #00f3ff);
            box-shadow: 6px 6px 0px var(--accent-cyan, #00f3ff);
        }
        .doc-review-card.rejected {
            border-color: var(--accent-magenta, #ff0055);
            box-shadow: 6px 6px 0px var(--accent-magenta, #ff0055);
        }
        .doc-review-card.revision {
            border-color: var(--accent-yellow, #ffee00);
            box-shadow: 6px 6px 0px var(--accent-yellow, #ffee00);
        }

        .doc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px dashed rgba(255,255,255,0.15);
            padding-bottom: 15px;
        }
        .doc-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 20px;
            font-weight: 800;
            text-transform: uppercase;
        }
        .doc-badge {
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            padding: 4px 10px;
            border: 2px solid #000;
            background: #fff;
            color: #000;
        }

        /* Content Viewer Area with Highlight Interaction */
        .doc-viewer-body {
            background: var(--surface-card, #1a1d29);
            border: 2px solid #fff;
            padding: 20px;
            font-size: 14px;
            line-height: 1.6;
            color: #d1d5db;
            height: 240px;
            overflow-y: auto;
            margin-bottom: 20px;
            position: relative;
            user-select: text;
        }
        .doc-viewer-body mark {
            background: var(--accent-yellow, #ffee00);
            color: #000;
            font-weight: 700;
            cursor: help;
            padding: 2px 4px;
        }
        .doc-viewer-body mark.cyan-hl {
            background: var(--accent-cyan, #00f3ff);
        }

        /* Annotation Bubble Context Helper */
        .highlight-helper-bubble {
            position: absolute;
            background: #fff;
            color: #000;
            border: 2px solid #000;
            padding: 6px 12px;
            font-weight: 800;
            font-size: 12px;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 3px 3px 0px var(--accent-cyan, #00f3ff);
            z-index: 2500;
            display: none;
        }

        /* Actions Bar */
        .doc-decision-bar {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .decision-label {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            color: var(--text-muted, #8e95ad);
            letter-spacing: 1.5px;
        }
        .decision-buttons {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }
        .decision-btn {
            background: var(--surface-card, #1a1d29);
            color: #fff;
            border: 2px solid #fff;
            padding: 10px 4px;
            font-size: 11px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.1s;
        }
        .decision-btn:hover {
            background: #fff;
            color: #000;
        }
        .decision-btn.active-approve {
            background: var(--accent-cyan, #00f3ff);
            color: #000;
            border-color: #fff;
            box-shadow: 2px 2px 0px #fff;
        }
        .decision-btn.active-reject {
            background: var(--accent-magenta, #ff0055);
            color: #fff;
            border-color: #fff;
            box-shadow: 2px 2px 0px #fff;
        }
        .decision-btn.active-revision {
            background: var(--accent-yellow, #ffee00);
            color: #000;
            border-color: #fff;
            box-shadow: 2px 2px 0px #fff;
        }

        /* Collaborative Review & Comments Hub Below Documents */
        .comments-section-board {
            background: var(--surface, #14161f);
            border: 3px solid #fff;
            padding: 40px;
            box-shadow: 6px 6px 0px var(--accent-yellow, #ffee00);
            display: grid;
            grid-template-columns: 2fr 1.2fr;
            gap: 40px;
        }
        @media (max-width: 900px) {
            .comments-section-board {
                grid-template-columns: 1fr;
            }
        }

        .comments-list-pane h3 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 24px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 25px;
            border-bottom: 2px solid #fff;
            padding-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .comments-flow {
            display: flex;
            flex-direction: column;
            gap: 20px;
            max-height: 400px;
            overflow-y: auto;
            padding-right: 15px;
        }
        .comment-node {
            background: var(--surface-card, #1a1d29);
            border: 2px solid #fff;
            padding: 20px;
            position: relative;
            box-shadow: 4px 4px 0px rgba(255,255,255,0.1);
        }
        .comment-node-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .user-tag {
            font-weight: 900;
            text-transform: uppercase;
            font-size: 13px;
            color: var(--accent-cyan, #00f3ff);
        }
        .doc-context-tag {
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 900;
            background: var(--accent-magenta, #ff0055);
            padding: 2px 8px;
            border: 1px solid #fff;
        }
        .comment-text {
            font-size: 14px;
            line-height: 1.5;
            color: #e5e7eb;
        }

        /* Comment Composer Form */
        .comment-form-pane h3 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 24px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 25px;
            border-bottom: 2px solid #fff;
            padding-bottom: 10px;
        }
        .form-row {
            margin-bottom: 20px;
        }
        .form-select, .form-textarea {
            width: 100%;
            background: var(--surface-card, #1a1d29);
            border: 2px solid #fff;
            color: #fff;
            padding: 12px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            outline: none;
        }
        .form-textarea {
            height: 120px;
            font-family: inherit;
            font-weight: 500;
            resize: none;
        }
        .form-select:focus, .form-textarea:focus {
            border-color: var(--accent-cyan, #00f3ff);
        }
        .post-comment-btn {
            background: var(--accent-cyan, #00f3ff);
            color: #000;
            border: 3px solid #fff;
            width: 100%;
            padding: 16px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 4px 4px 0px #fff;
            transition: all 0.1s;
        }
        .post-comment-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #fff;
        }
        .post-comment-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px;
        }
    `;

    // Inject styles into document head
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // Initial Simulated State Database
    const state = {
        documents: [
            {
                id: "doc-1",
                name: "Debt Schedule.csv",
                badge: "Financial Data",
                status: "revision", // approved, rejected, revision, pending
                content: `<b>Merchant Capital Debt Record (Current Period):</b><br>
                - Principal Outstandings: $115,400.00<br>
                - <mark class="cyan-hl" data-hl-id="1">Daily ACH Pull Rate: $1,250 / working day</mark><br>
                - Outstanding Factor Rate: 1.28x on balance.<br>
                - Expected Payoff Velocity: 84 Business Days Remaining.<br>
                - Sub-UCC Priority Flag: Second Position Lien registered under commercial ledger filings. Active holds detected. Please review factoring priority.`
            },
            {
                id: "doc-2",
                name: "MCA Factor Sheet.pdf",
                badge: "Term Specifications",
                status: "pending",
                content: `<b>Proposed Capital Advance Term Sheet:</b><br>
                - Gross Advance Limit: $85,000.00 Max<br>
                - Factor Rate Applied: 1.185x fixed scaling.<br>
                - <mark data-hl-id="2">Retainer Margin Rate: 15%</mark> stored on escrow accounts.<br>
                - Underwriter Margin Score: Tier 2. Approved on conditional validation of legal trade certificates. Daily tracking mechanics validated. Verification complete.`
            },
            {
                id: "doc-3",
                name: "Entity Certificate.png",
                badge: "Corporate Filings",
                status: "approved",
                content: `<b>Secretary of State - Active Entity Standing Verification:</b><br>
                - Legal Entity Code: DE-90412-A9<br>
                - Jurisdiction: Delaware Business Division<br>
                - Status: <mark class="cyan-hl" data-hl-id="3">GOOD STANDING (No Pending Tax Liens)</mark><br>
                - Principal Officer: Director of Operations authorized.<br>
                - Date of Incorporation: 03/14/2019. Annual report compliance logged successfully with no structural exceptions.`
            }
        ],
        comments: [
            {
                id: 1,
                author: "Sarah Jenkins (Senior Underwriter)",
                docName: "Debt Schedule.csv",
                text: "The ACH daily pull of $1,250 might restrict operational working capital margins. Let's look closely at weekly restructuring models."
            },
            {
                id: 2,
                author: "Mark R. (Risk Strategist)",
                docName: "MCA Factor Sheet.pdf",
                text: "The 15% retainer margin rate seems standard, but matches a sub-tier credit profile. Recommended adjustment to 12.5% if cash balances hold."
            },
            {
                id: 3,
                author: "David Vance (Partner)",
                docName: "Entity Certificate.png",
                text: "Delaware standing verified perfectly. No structural issues found here."
            }
        ]
    };

    // DOM Injections and Core Event Binding
    function init() {
        // Create Floating Board Launcher
        const launcher = document.createElement('button');
        launcher.className = 'review-board-launcher';
        launcher.innerHTML = `
            <span>⚡ Collab Board</span>
            <span class="badge-count" id="launcher-badge">3</span>
        `;
        document.body.appendChild(launcher);

        // Create Full-Screen Workspace Overlay
        const workspace = document.createElement('div');
        workspace.className = 'review-workspace-overlay';
        workspace.id = 'review-workspace';
        document.body.appendChild(workspace);

        // Overlay Backdrop Listener
        launcher.addEventListener('click', () => {
            workspace.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderWorkspace();
        });

        // Add Highlight Helper Bubble Elements to Body
        const bubble = document.createElement('div');
        bubble.className = 'highlight-helper-bubble';
        bubble.innerText = "Add Comment on Selection";
        document.body.appendChild(bubble);

        // Handle Text Highlight Interactivity inside Document Areas
        let currentSelectionText = "";
        let currentDocTarget = "";

        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText.length > 2) {
                // Determine if selection is inside a document viewer
                const range = selection.getRangeAt(0);
                const container = range.commonAncestorContainer;
                const docViewer = container.nodeType === 3 ? container.parentNode.closest('.doc-viewer-body') : container.closest('.doc-viewer-body');
                
                if (docViewer) {
                    currentSelectionText = selectedText;
                    currentDocTarget = docViewer.dataset.docName;
                    
                    // Display floating bubble near selection
                    const rect = range.getBoundingClientRect();
                    bubble.style.top = `${window.scrollY + rect.top - 40}px`;
                    bubble.style.left = `${window.scrollX + rect.left + (rect.width / 2) - 80}px`;
                    bubble.style.display = 'block';
                    return;
                }
            }
            bubble.style.display = 'none';
        });

        // Handle Floating Bubble Clicks
        bubble.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent text deselection
            const commentTextarea = document.getElementById('new-comment-text');
            const docSelector = document.getElementById('comment-doc-select');
            
            if (commentTextarea && docSelector) {
                docSelector.value = currentDocTarget;
                commentTextarea.value = `Highlighting: "${currentSelectionText}" — [Add critique here]`;
                commentTextarea.focus();
                // Select placeholder to override easily
                const index = commentTextarea.value.indexOf('[Add critique here]');
                if (index !== -1) {
                    commentTextarea.setSelectionRange(index, index + 19);
                }
            }
            bubble.style.display = 'none';
        });
    }

    // Build & Update Dynamic Elements of the Review Workspace
    function renderWorkspace() {
        const workspace = document.getElementById('review-workspace');
        if (!workspace) return;

        workspace.innerHTML = `
            <div class="workspace-header">
                <div class="workspace-title-area">
                    <h2>Collaborative Review Board</h2>
                    <p>Review standard asset verification folders, apply markers, highlight indicators, and set audit resolutions.</p>
                </div>
                <button class="workspace-close-btn" id="close-workspace-btn">Close Workspace [X]</button>
            </div>

            <!-- Documents Panel Grid -->
            <div class="workspace-grid" id="workspace-docs-grid"></div>

            <!-- Global Feedback and Audit Comments Dashboard -->
            <div class="comments-section-board">
                <div class="comments-list-pane">
                    <h3>
                        <span>Live Discussion Stream</span>
                        <span style="font-size: 14px; background: #fff; color: #000; padding: 2px 10px; border: 2px solid #000;" id="comments-counter">0 comments</span>
                    </h3>
                    <div class="comments-flow" id="comments-flow-container"></div>
                </div>

                <div class="comment-form-pane">
                    <h3>Add Annotation</h3>
                    <div class="form-row">
                        <label class="decision-label" style="display:block; margin-bottom:8px;">Target Document</label>
                        <select class="form-select" id="comment-doc-select"></select>
                    </div>
                    <div class="form-row">
                        <label class="decision-label" style="display:block; margin-bottom:8px;">Observations</label>
                        <textarea class="form-textarea" id="new-comment-text" placeholder="Write audit review, feedback, or verification remarks..."></textarea>
                    </div>
                    <button class="post-comment-btn" id="submit-comment-btn">Log Annotation Entry</button>
                </div>
            </div>
        `;

        // Bind Close Event
        document.getElementById('close-workspace-btn').addEventListener('click', () => {
            workspace.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Render Workspace Grid & Comments
        renderDocuments();
        renderComments();
        populateDocSelector();

        // Form Submission Event
        document.getElementById('submit-comment-btn').addEventListener('click', postComment);
    }

    // Render Individual Attachments & Document Viewers
    function renderDocuments() {
        const grid = document.getElementById('workspace-docs-grid');
        if (!grid) return;

        grid.innerHTML = "";
        state.documents.forEach(doc => {
            const card = document.createElement('div');
            card.className = `doc-review-card ${doc.status}`;
            card.id = `card-${doc.id}`;

            card.innerHTML = `
                <div class="doc-header">
                    <div>
                        <div class="doc-title">${doc.name}</div>
                        <div style="font-size: 11px; color: var(--text-muted, #8e95ad); margin-top: 4px;">Verified Asset Entry</div>
                    </div>
                    <span class="doc-badge">${doc.badge}</span>
                </div>
                <div class="doc-viewer-body" data-doc-name="${doc.name}">
                    ${doc.content}
                </div>
                <div class="doc-decision-bar">
                    <span class="decision-label">Audit Status Resolution</span>
                    <div class="decision-buttons">
                        <button class="decision-btn ${doc.status === 'approved' ? 'active-approve' : ''}" onclick="window.setDocStatus('${doc.id}', 'approved')">Approve</button>
                        <button class="decision-btn ${doc.status === 'rejected' ? 'active-reject' : ''}" onclick="window.setDocStatus('${doc.id}', 'rejected')">Reject</button>
                        <button class="decision-btn ${doc.status === 'revision' ? 'active-revision' : ''}" onclick="window.setDocStatus('${doc.id}', 'revision')">Revision</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        // Update launcher count
        const revisionOrPending = state.documents.filter(d => d.status === 'pending' || d.status === 'revision').length;
        const launcherBadge = document.getElementById('launcher-badge');
        if (launcherBadge) launcherBadge.innerText = revisionOrPending;
    }

    // Render Annotation Feed list
    function renderComments() {
        const container = document.getElementById('comments-flow-container');
        const counter = document.getElementById('comments-counter');
        if (!container) return;

        container.innerHTML = "";
        state.comments.forEach(comment => {
            const node = document.createElement('div');
            node.className = 'comment-node';
            node.innerHTML = `
                <div class="comment-node-meta">
                    <span class="user-tag">${comment.author}</span>
                    <span class="doc-context-tag">${comment.docName}</span>
                </div>
                <p class="comment-text">${comment.text}</p>
            `;
            container.appendChild(node);
        });

        if (counter) counter.innerText = `${state.comments.length} annotations`;
        container.scrollTop = container.scrollHeight;
    }

    // Populate dropdown selection inside form
    function populateDocSelector() {
        const select = document.getElementById('comment-doc-select');
        if (!select) return;

        select.innerHTML = "";
        state.documents.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.name;
            option.innerText = doc.name;
            select.appendChild(option);
        });
    }

    // Handle audit decision resolution state changes
    window.setDocStatus = function(docId, newStatus) {
        const doc = state.documents.find(d => d.id === docId);
        if (doc) {
            doc.status = newStatus;
            renderDocuments();
        }
    };

    // Post comment logic
    function postComment() {
        const docSelect = document.getElementById('comment-doc-select');
        const textInput = document.getElementById('new-comment-text');

        if (!textInput || !textInput.value.trim()) return;

        const newComment = {
            id: Date.now(),
            author: "External Auditor (Guest)",
            docName: docSelect.value,
            text: textInput.value.trim()
        };

        state.comments.push(newComment);
        textInput.value = "";
        renderComments();
    }

    // Handle initialization on window load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();