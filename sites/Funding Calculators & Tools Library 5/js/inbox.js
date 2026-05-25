document.addEventListener("DOMContentLoaded", () => {
    // Inject Custom Neo-Brutalist Secure Inbox Styles
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
        :root {
            --inbox-success: #00ff66;
            --inbox-warning: #ffb700;
        }

        .secure-inbox-section {
            margin: 80px 0;
            border: var(--border-width) solid #fff;
            background: var(--surface);
            box-shadow: var(--brutal-shadow-cyan);
            position: relative;
            overflow: hidden;
        }

        .inbox-header {
            background: #000;
            padding: 30px;
            border-bottom: var(--border-width) solid #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .inbox-header-title {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .inbox-header-title h2 {
            font-size: clamp(24px, 4vw, 36px);
            font-weight: 900;
            text-transform: uppercase;
            font-family: 'Space Grotesk', sans-serif;
            color: #fff;
        }

        .inbox-badge {
            background: var(--accent-cyan);
            color: #000;
            padding: 6px 14px;
            font-size: 12px;
            font-weight: 900;
            border: 2px solid #fff;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 2px 2px 0px #fff;
        }

        .inbox-layout {
            display: grid;
            grid-template-columns: 320px 1fr;
            min-height: 650px;
            background: var(--bg);
        }

        /* Sidebar Threads */
        .inbox-sidebar {
            background: var(--surface);
            border-right: var(--border-width) solid #fff;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }

        .sidebar-search {
            padding: 15px;
            border-bottom: var(--border-width) solid #fff;
            background: rgba(255, 255, 255, 0.02);
        }

        .sidebar-search-input {
            width: 100%;
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 10px 15px;
            color: #fff;
            font-weight: 700;
            outline: none;
            font-size: 14px;
        }

        .threads-list {
            flex: 1;
            overflow-y: auto;
        }

        .thread-item {
            padding: 20px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            transition: all var(--transition-speed);
            position: relative;
        }

        .thread-item:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .thread-item.active {
            background: var(--surface-card);
            border-left: 6px solid var(--accent-magenta);
        }

        .thread-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .thread-tag {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            padding: 2px 6px;
            border: 1px solid #fff;
            background: #000;
        }

        .thread-tag.active { background: var(--accent-cyan); color: #000; }
        .thread-tag.pending { background: var(--accent-yellow); color: #000; }
        .thread-tag.completed { background: var(--inbox-success); color: #000; }

        .thread-time {
            font-size: 11px;
            color: var(--text-muted);
            font-weight: 700;
        }

        .thread-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 16px;
            font-weight: 800;
            text-transform: uppercase;
            color: #fff;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .thread-preview {
            font-size: 13px;
            color: var(--text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Messaging Panel */
        .inbox-chat {
            display: flex;
            flex-direction: column;
            background: var(--surface-card);
            position: relative;
        }

        .chat-info-bar {
            padding: 20px 30px;
            background: var(--surface);
            border-bottom: var(--border-width) solid #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
        }

        .chat-target-info h3 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 20px;
            font-weight: 900;
            text-transform: uppercase;
            color: #fff;
        }

        .chat-target-info p {
            font-size: 13px;
            color: var(--text-muted);
        }

        .security-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            color: var(--inbox-success);
            background: rgba(0, 255, 102, 0.1);
            padding: 6px 12px;
            border: 1px solid var(--inbox-success);
        }

        .chat-messages {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
            max-height: 450px;
        }

        .message-bubble {
            max-width: 75%;
            padding: 20px;
            border: var(--border-width) solid #fff;
            position: relative;
        }

        .message-bubble.incoming {
            align-self: flex-start;
            background: var(--surface);
            box-shadow: 4px 4px 0px #fff;
        }

        .message-bubble.outgoing {
            align-self: flex-end;
            background: var(--accent-magenta);
            color: #fff;
            box-shadow: 4px 4px 0px var(--accent-cyan);
        }

        .message-sender {
            font-weight: 900;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }

        .incoming .message-sender { color: var(--accent-cyan); }
        .outgoing .message-sender { color: var(--accent-yellow); }

        .message-text {
            font-size: 15px;
            line-height: 1.5;
            margin-bottom: 12px;
        }

        .message-time-status {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: var(--text-muted);
            font-weight: 700;
        }

        .outgoing .message-time-status {
            color: rgba(255, 255, 255, 0.8);
        }

        /* Attachments Styling */
        .attachment-box {
            margin-top: 15px;
            background: rgba(0, 0, 0, 0.3);
            border: 2px dashed #fff;
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }

        .attachment-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .attachment-icon {
            font-size: 28px;
            background: var(--surface-card);
            border: 1px solid #fff;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .attachment-details h4 {
            font-size: 14px;
            font-weight: 800;
            color: #fff;
            text-transform: uppercase;
        }

        .attachment-details p {
            font-size: 11px;
            color: var(--text-muted);
        }

        .attachment-actions {
            display: flex;
            gap: 10px;
        }

        .attachment-btn {
            background: var(--surface);
            color: #fff;
            border: 2px solid #fff;
            padding: 6px 12px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            cursor: pointer;
            transition: all var(--transition-speed);
        }

        .attachment-btn:hover {
            background: #fff;
            color: #000;
        }

        .attachment-btn.primary {
            background: var(--accent-cyan);
            color: #000;
        }

        .attachment-btn.primary:hover {
            background: #fff;
        }

        /* Chat Input */
        .chat-input-bar {
            padding: 20px 30px;
            background: var(--surface);
            border-top: var(--border-width) solid #fff;
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .chat-text-input {
            flex: 1;
            background: var(--surface-card);
            border: var(--border-width) solid #fff;
            padding: 15px 20px;
            font-size: 16px;
            font-weight: 700;
            color: #fff;
            outline: none;
        }

        .chat-text-input:focus {
            border-color: var(--accent-cyan);
        }

        .chat-action-btn {
            background: var(--surface-card);
            border: var(--border-width) solid #fff;
            color: #fff;
            width: 58px;
            height: 58px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            transition: all var(--transition-speed);
        }

        .chat-action-btn:hover {
            background: #fff;
            color: #000;
            transform: translateY(-2px);
        }

        .chat-send-btn {
            background: var(--accent-magenta);
            color: #fff;
            border: var(--border-width) solid #fff;
            padding: 0 30px;
            font-size: 16px;
            font-weight: 900;
            text-transform: uppercase;
            cursor: pointer;
            height: 58px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all var(--transition-speed);
            font-family: 'Space Grotesk', sans-serif;
            box-shadow: 4px 4px 0px #fff;
        }

        .chat-send-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #fff;
        }

        /* Dynamic Attachment Modal / Panel overlay */
        .secure-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(8px);
            z-index: 2000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .secure-modal.active {
            display: flex;
        }

        .modal-box {
            background: var(--surface);
            border: var(--border-width) solid #fff;
            width: 100%;
            max-width: 780px;
            box-shadow: var(--brutal-shadow-yellow);
            display: flex;
            flex-direction: column;
            max-height: 90vh;
        }

        .modal-header {
            padding: 20px 30px;
            background: #000;
            border-bottom: var(--border-width) solid #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-size: 20px;
            font-weight: 900;
            text-transform: uppercase;
            font-family: 'Space Grotesk', sans-serif;
            color: var(--accent-yellow);
        }

        .modal-close {
            background: var(--accent-magenta);
            color: #fff;
            border: 2px solid #fff;
            padding: 6px 12px;
            font-weight: 900;
            cursor: pointer;
            text-transform: uppercase;
        }

        .modal-content-grid {
            display: grid;
            grid-template-columns: 1fr 300px;
            overflow: hidden;
            flex: 1;
        }

        .preview-pane {
            padding: 30px;
            background: var(--bg);
            border-right: var(--border-width) solid #fff;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .preview-file-mock {
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 25px;
            text-align: center;
        }

        .preview-file-mock .doc-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .preview-text-block {
            text-align: left;
            font-size: 14px;
            line-height: 1.6;
            color: var(--text-muted);
            border-top: 1px dashed rgba(255,255,255,0.15);
            padding-top: 15px;
            margin-top: 15px;
            font-family: monospace;
        }

        .preview-receipts {
            background: rgba(0, 243, 255, 0.05);
            border: 1px solid var(--accent-cyan);
            padding: 15px;
        }

        .receipt-title {
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            color: var(--accent-cyan);
            margin-bottom: 8px;
        }

        .receipt-log {
            font-size: 12px;
            color: #fff;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Sidebar Comments */
        .comments-pane {
            display: flex;
            flex-direction: column;
            background: var(--surface);
            overflow: hidden;
        }

        .comments-header {
            padding: 15px 20px;
            border-bottom: 2px solid #fff;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 13px;
            background: rgba(255,255,255,0.02);
        }

        .comments-list {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .comment-item {
            background: var(--surface-card);
            border: 1px solid #fff;
            padding: 12px;
        }

        .comment-meta {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 6px;
        }

        .comment-user { color: var(--accent-magenta); }
        .comment-date { color: var(--text-muted); }

        .comment-body {
            font-size: 12px;
            line-height: 1.4;
            color: #fff;
        }

        .comment-input-area {
            padding: 15px;
            border-top: 2px solid #fff;
            display: flex;
            gap: 8px;
        }

        .comment-field {
            flex: 1;
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 8px 12px;
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            outline: none;
        }

        .comment-submit {
            background: var(--accent-cyan);
            color: #000;
            border: 2px solid #fff;
            font-weight: 900;
            font-size: 12px;
            padding: 0 12px;
            cursor: pointer;
            text-transform: uppercase;
        }

        /* Responsiveness adjustments for Inbox */
        @media (max-width: 900px) {
            .inbox-layout {
                grid-template-columns: 1fr;
            }
            .inbox-sidebar {
                border-right: none;
                border-bottom: var(--border-width) solid #fff;
                max-height: 250px;
            }
            .modal-content-grid {
                grid-template-columns: 1fr;
                overflow-y: auto;
            }
            .preview-pane {
                border-right: none;
                border-bottom: var(--border-width) solid #fff;
            }
        }
    `;
    document.head.appendChild(styleTag);

    // MOCK DATA SYSTEM FOR SECURE CHANNELS
    const inboxData = {
        activeThreadId: "thread-1",
        threads: [
            {
                id: "thread-1",
                title: "Underwriting & Tax Prep",
                category: "Underwriting",
                tagClass: "active",
                updatedTime: "10:24 AM",
                subText: "Underwriter uploaded March Bank Statement guidelines.",
                targetAnalyst: "Cassandra Vance (Senior Debt Underwriter)",
                messages: [
                    {
                        id: "m1",
                        sender: "System Automated",
                        text: "🔒 Secure AES-256 communications handshake established with commercial desk standard priority. Key negotiation verified.",
                        time: "09:00 AM",
                        type: "incoming"
                    },
                    {
                        id: "m2",
                        sender: "Cassandra Vance (Underwriter)",
                        text: "Welcome to your dedicated workspace portal. To finalise target parameters for the debt facility, I will need certified tax worksheets, schedule drafts, and latest corporate cash statements.",
                        time: "09:12 AM",
                        type: "incoming"
                    },
                    {
                        id: "m3",
                        sender: "You (Client)",
                        text: "Understood. I am compiling the Q1 bank statements. March returns look strong. Here is our initial summary ledger sheet for active accounts.",
                        time: "10:15 AM",
                        type: "outgoing",
                        attachment: {
                            id: "att-q1-ledger",
                            name: "Q1_Summary_Ledger_Certified.xlsx",
                            size: "2.4 MB",
                            icon: "📊",
                            description: "Primary corporate banking log highlighting raw inputs, daily balances, and invoice settlement pools for top commercial trade accounts.",
                            logs: [
                                "Uploaded by Client on Oct 24, 10:15 AM",
                                "Scanned & Verified by Security Node on Oct 24, 10:15 AM",
                                "Downloaded by Underwriter Vance on Oct 24, 10:20 AM"
                            ],
                            comments: [
                                { user: "Underwriter", date: "10:21 AM", body: "Ledger values check out against automated deposits. Excellent coverage ratio." },
                                { user: "You", date: "10:23 AM", body: "Perfect. Sending March breakdown shortly." }
                            ]
                        }
                    },
                    {
                        id: "m4",
                        sender: "Cassandra Vance (Underwriter)",
                        text: "Got the ledger file. Downloaded successfully and logged verified receipt parameters. Ready for March reports.",
                        time: "10:24 AM",
                        type: "incoming"
                    }
                ]
            },
            {
                id: "thread-2",
                title: "Equipment Lease Contract #4092",
                category: "Leasing Desk",
                tagClass: "pending",
                updatedTime: "Yesterday",
                subText: "Terms approved. Waiting for executed digital signature.",
                targetAnalyst: "Marcus Sterling (Senior Leasing Director)",
                messages: [
                    {
                        id: "m20",
                        sender: "Marcus Sterling",
                        text: "Drafting finished. Net ROI checks out. Find the official lease framework file below.",
                        time: "Yesterday, 3:45 PM",
                        type: "incoming",
                        attachment: {
                            id: "att-lease-draft",
                            name: "Lease_Contract_Payload_4092.pdf",
                            size: "4.8 MB",
                            icon: "📄",
                            description: "Formal transaction document highlighting equipment residual valuation metrics, monthly payment schedule, and depreciation write-offs.",
                            logs: [
                                "Generated by Automated System on Oct 23, 3:40 PM",
                                "Viewed by Client on Oct 23, 4:10 PM"
                            ],
                            comments: [
                                { user: "Broker", date: "Oct 23, 3:48 PM", body: "Rate locked at 6.8% for 48 months." }
                            ]
                        }
                    }
                ]
            },
            {
                id: "thread-3",
                title: "Merchant Cash Advance - True APR Check",
                category: "Advisory Desk",
                tagClass: "completed",
                updatedTime: "Oct 21",
                subText: "Factor conversion report generated.",
                targetAnalyst: "Fintech Advisory Engine",
                messages: [
                    {
                        id: "m30",
                        sender: "System Advisory Portal",
                        text: "We finished executing the calculation models matching your input factor metrics. Real APR yields 38.4% cost of capital.",
                        time: "Oct 21, 11:30 AM",
                        type: "incoming",
                        attachment: {
                            id: "att-apr-breakdown",
                            name: "APR_Cost_Report_Final.pdf",
                            size: "1.2 MB",
                            icon: "⚡",
                            description: "Visual matrix layout converting factor rates to annualized percentage rate equivalents. Outlines amortization curve.",
                            logs: [
                                "Generated by Engine on Oct 21, 11:30 AM",
                                "Downloaded by Client on Oct 21, 2:15 PM"
                            ],
                            comments: []
                        }
                    }
                ]
            }
        ]
    };

    // INJECT THE MAIN INTERACTION DOM MODULE
    const inboxSection = document.createElement("section");
    inboxSection.className = "secure-inbox-section wrapper";
    inboxSection.id = "secure-inbox-portal";

    inboxSection.innerHTML = `
        <div class="inbox-header">
            <div class="inbox-header-title">
                <h2>Client Secure Thread Portal</h2>
                <span class="inbox-badge">AES-256 E2EE Enabled</span>
            </div>
            <button class="btn-primary" id="btn-upload-trigger" style="font-size: 14px; padding: 12px 24px; box-shadow: 4px 4px 0px #fff;">
                📤 Transmit Secure File
            </button>
        </div>
        <div class="inbox-layout">
            <!-- SIDEBAR THREAD SWITCHER -->
            <div class="inbox-sidebar">
                <div class="sidebar-search">
                    <input type="text" id="thread-search" class="sidebar-search-input" placeholder="Search secure threads...">
                </div>
                <div class="threads-list" id="threads-container">
                    <!-- Dynamic Thread items will be rendered here -->
                </div>
            </div>

            <!-- MESSAGING CONTAINER -->
            <div class="inbox-chat">
                <div class="chat-info-bar">
                    <div class="chat-target-info">
                        <h3 id="active-chat-title">Secure Workspace</h3>
                        <p id="active-chat-sub">Underwriting communications channel</p>
                    </div>
                    <div class="security-badge">
                        🛡️ Secure Handshake Verified
                    </div>
                </div>

                <div class="chat-messages" id="chat-messages-container">
                    <!-- Dynamic Message items will be injected here -->
                </div>

                <!-- CHAT INPUT COMPONENT -->
                <div class="chat-input-bar">
                    <button class="chat-action-btn" id="chat-clip-btn" title="Add File Attachment">📎</button>
                    <input type="text" id="chat-msg-input" class="chat-text-input" placeholder="Send secure encrypted transmission update...">
                    <button class="chat-send-btn" id="chat-send-btn">
                        <span>Send</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- MOCK SECURE UPLOAD INPUT (Hidden) -->
        <input type="file" id="file-uploader-hidden" style="display: none;">
    `;

    // INSERT MODULE IN FRONT OF STRATEGY BANNER
    const targetAnchor = document.querySelector(".strategy-banner");
    if (targetAnchor) {
        targetAnchor.parentNode.insertBefore(inboxSection, targetAnchor);
    } else {
        // Fallback: Append to wrapper
        const fallbackWrapper = document.querySelector(".wrapper");
        if (fallbackWrapper) fallbackWrapper.appendChild(inboxSection);
    }

    // MODAL DIALOG PREVIEW ARCHITECTURE
    const previewModal = document.createElement("div");
    previewModal.className = "secure-modal";
    previewModal.id = "secure-preview-modal";
    previewModal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <div class="modal-title" id="preview-modal-title">Attachment View</div>
                <button class="modal-close" onclick="closeSecurePreview()">CLOSE [X]</button>
            </div>
            <div class="modal-content-grid">
                <!-- Preview area -->
                <div class="preview-pane">
                    <div class="preview-file-mock">
                        <div class="doc-icon" id="preview-icon">📊</div>
                        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 5px;" id="preview-filename">File_Name.pdf</h3>
                        <p style="font-size: 12px; color: var(--text-muted);" id="preview-filesize">2.4 MB</p>
                        <div class="preview-text-block" id="preview-mock-desc">
                            Decrypting payload details... Real-time analytical secure validation logged.
                        </div>
                    </div>
                    
                    <div class="preview-receipts">
                        <div class="receipt-title">Access Log & Read Receipts</div>
                        <div id="preview-receipts-container">
                            <!-- Receipt logs dynamic injection -->
                        </div>
                    </div>
                </div>
                
                <!-- Comment area -->
                <div class="comments-pane">
                    <div class="comments-header">Comments Matrix</div>
                    <div class="comments-list" id="preview-comments-container">
                        <!-- Dynamic comments -->
                    </div>
                    <div class="comment-input-area">
                        <input type="text" id="comment-add-input" class="comment-field" placeholder="Enter secure annotation...">
                        <button class="comment-submit" id="comment-submit-btn">Add</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(previewModal);

    // CORE EVENT ARCHITECTURE & DATA SYNCING
    const threadsContainer = document.getElementById("threads-container");
    const messagesContainer = document.getElementById("chat-messages-container");
    const activeChatTitle = document.getElementById("active-chat-title");
    const activeChatSub = document.getElementById("active-chat-sub");
    const searchInput = document.getElementById("thread-search");
    const chatMsgInput = document.getElementById("chat-msg-input");
    const chatSendBtn = document.getElementById("chat-send-btn");
    const fileUploaderHidden = document.getElementById("file-uploader-hidden");
    const chatClipBtn = document.getElementById("chat-clip-btn");
    const uploadTrigger = document.getElementById("btn-upload-trigger");

    let currentActivePreviewFile = null;

    // Switch Thread Function
    function renderThreads() {
        threadsContainer.innerHTML = "";
        const query = searchInput.value.toLowerCase();

        inboxData.threads.forEach(thread => {
            if (thread.title.toLowerCase().includes(query) || thread.category.toLowerCase().includes(query)) {
                const isActive = thread.id === inboxData.activeThreadId;
                const lastMsg = thread.messages[thread.messages.length - 1];
                const previewText = lastMsg ? lastMsg.text : "No messages";

                const item = document.createElement("div");
                item.className = `thread-item ${isActive ? 'active' : ''}`;
                item.onclick = () => switchThread(thread.id);

                item.innerHTML = `
                    <div class="thread-meta">
                        <span class="thread-tag ${thread.tagClass}">${thread.category}</span>
                        <span class="thread-time">${thread.updatedTime}</span>
                    </div>
                    <div class="thread-title">${thread.title}</div>
                    <div class="thread-preview">${previewText}</div>
                `;
                threadsContainer.appendChild(item);
            }
        });
    }

    function switchThread(threadId) {
        inboxData.activeThreadId = threadId;
        const thread = inboxData.threads.find(t => t.id === threadId);
        
        activeChatTitle.innerText = thread.title;
        activeChatSub.innerText = `Workspace Desk Assigned Analyst: ${thread.targetAnalyst}`;
        
        renderThreads();
        renderMessages();
    }

    function renderMessages() {
        messagesContainer.innerHTML = "";
        const thread = inboxData.threads.find(t => t.id === inboxData.activeThreadId);
        if (!thread) return;

        thread.messages.forEach(msg => {
            const bubble = document.createElement("div");
            bubble.className = `message-bubble ${msg.type}`;

            let attachmentHtml = "";
            if (msg.attachment) {
                attachmentHtml = `
                    <div class="attachment-box">
                        <div class="attachment-info">
                            <span class="attachment-icon">${msg.attachment.icon}</span>
                            <div class="attachment-details">
                                <h4>${msg.attachment.name}</h4>
                                <p>${msg.attachment.size} • Secured</p>
                            </div>
                        </div>
                        <div class="attachment-actions">
                            <button class="attachment-btn primary" onclick="viewAttachment('${msg.id}')">Preview & Annotate</button>
                            <button class="attachment-btn" onclick="simulateDownload('${msg.id}')">Download</button>
                        </div>
                    </div>
                `;
            }

            bubble.innerHTML = `
                <div class="message-sender">${msg.sender}</div>
                <div class="message-text">${msg.text}</div>
                ${attachmentHtml}
                <div class="message-time-status">
                    <span>${msg.time}</span>
                    <span>•</span>
                    <span style="color: var(--inbox-success);">✓ Verified</span>
                </div>
            `;
            messagesContainer.appendChild(bubble);
        });

        // Scroll messages to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Simulate sending an encrypted message
    function sendSecureMessage() {
        const text = chatMsgInput.value.trim();
        if (!text) return;

        const thread = inboxData.threads.find(t => t.id === inboxData.activeThreadId);
        if (!thread) return;

        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Push user message
        thread.messages.push({
            id: `msg-${Date.now()}`,
            sender: "You (Client)",
            text: text,
            time: timeNow,
            type: "outgoing"
        });

        chatMsgInput.value = "";
        renderMessages();
        renderThreads();

        // Simulate secure automated system reply with a delay
        setTimeout(() => {
            let responseText = "Transmission logged to verification blockchain. Document hash verified by automated analysis parser node.";
            if (text.toLowerCase().includes("ledger") || text.toLowerCase().includes("report")) {
                responseText = "Receipt of ledger data structure has been flagged for audit review queue. Our desk analyst has been pinged.";
            } else if (text.toLowerCase().includes("help") || text.toLowerCase().includes("broker")) {
                responseText = "Routing system dispatch message to regional credit desks. Stay on secure thread channel.";
            }

            thread.messages.push({
                id: `msg-${Date.now() + 1}`,
                sender: "System Security Node",
                text: responseText,
                time: timeNow,
                type: "incoming"
            });
            renderMessages();
            renderThreads();
        }, 1500);
    }

    // Modal view for secure attachments with inline comments
    window.viewAttachment = function(msgId) {
        const thread = inboxData.threads.find(t => t.id === inboxData.activeThreadId);
        const msg = thread.messages.find(m => m.id === msgId);
        if (!msg || !msg.attachment) return;

        currentActivePreviewFile = msg.attachment;

        document.getElementById("preview-modal-title").innerText = `SECURE ATTACHMENT PIPELINE: ${currentActivePreviewFile.name}`;
        document.getElementById("preview-filename").innerText = currentActivePreviewFile.name;
        document.getElementById("preview-filesize").innerText = currentActivePreviewFile.size;
        document.getElementById("preview-icon").innerText = currentActivePreviewFile.icon;
        document.getElementById("preview-mock-desc").innerText = currentActivePreviewFile.description;

        // Log client view receipt automatically
        const timeNow = new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const clientReceipt = `Opened by Client on ${timeNow}`;
        if (!currentActivePreviewFile.logs.some(log => log.includes("Opened by Client"))) {
            currentActivePreviewFile.logs.push(clientReceipt);
        }

        renderAttachmentReceipts();
        renderAttachmentComments();

        document.getElementById("secure-preview-modal").classList.add("active");
    };

    function renderAttachmentReceipts() {
        const container = document.getElementById("preview-receipts-container");
        container.innerHTML = "";
        currentActivePreviewFile.logs.forEach(log => {
            const el = document.createElement("div");
            el.className = "receipt-log";
            el.innerHTML = `🛡️ <span>${log}</span>`;
            container.appendChild(el);
        });
    }

    function renderAttachmentComments() {
        const container = document.getElementById("preview-comments-container");
        container.innerHTML = "";
        currentActivePreviewFile.comments.forEach(c => {
            const el = document.createElement("div");
            el.className = "comment-item";
            el.innerHTML = `
                <div class="comment-meta">
                    <span class="comment-user">${c.user}</span>
                    <span class="comment-date">${c.date}</span>
                </div>
                <div class="comment-body">${c.body}</div>
            `;
            container.appendChild(el);
        });
    }

    // Post a comment inline within the secure file preview
    document.getElementById("comment-submit-btn").addEventListener("click", () => {
        const input = document.getElementById("comment-add-input");
        const val = input.value.trim();
        if (!val || !currentActivePreviewFile) return;

        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        currentActivePreviewFile.comments.push({
            user: "You",
            date: timeNow,
            body: val
        });

        input.value = "";
        renderAttachmentComments();
    });

    window.closeSecurePreview = function() {
        document.getElementById("secure-preview-modal").classList.remove("active");
        currentActivePreviewFile = null;
    };

    // Simulate downloading files with live download notification receipts
    window.simulateDownload = function(msgId) {
        const thread = inboxData.threads.find(t => t.id === inboxData.activeThreadId);
        const msg = thread.messages.find(m => m.id === msgId);
        if (!msg || !msg.attachment) return;

        const timeNow = new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const logStr = `Downloaded by Client on ${timeNow}`;
        
        msg.attachment.logs.push(logStr);
        
        alert(`🔓 DECRYPT KEY INITIATED: Successfully parsed and downloaded "${msg.attachment.name}" to your workspace locally. Secured receipt logged.`);
        renderMessages();
    };

    // Simulated file transmitter trigger
    function initiateMockFileUpload(name, size, desc, icon) {
        const thread = inboxData.threads.find(t => t.id === inboxData.activeThreadId);
        if (!thread) return;

        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const logDate = new Date().toLocaleDateString() + ", " + timeNow;

        // Push new user message containing attachment
        thread.messages.push({
            id: `msg-${Date.now()}`,
            sender: "You (Client)",
            text: `Initiated E2EE upload of corporate payload: ${name}`,
            time: timeNow,
            type: "outgoing",
            attachment: {
                id: `att-${Date.now()}`,
                name: name,
                size: size,
                icon: icon,
                description: desc,
                logs: [
                    `Uploaded by Client on ${logDate}`,
                    `Scanned & Sanitised by Cloud-AV node on ${logDate}`
                ],
                comments: []
            }
        });

        renderMessages();
        renderThreads();
    }

    // Trigger mock selector files
    uploadTrigger.addEventListener("click", () => {
        const mockFiles = [
            { name: "DSCR_Report_Corporate_2024.xlsx", size: "3.2 MB", desc: "Detailed breakdown of debt service ratios, annual income forecasts, and operating statements audited by fintech tools.", icon: "📊" },
            { name: "Experian_Business_Credit_Audit.pdf", size: "1.8 MB", desc: "Experian SmartBusiness trade account profiles and on-time credit history details mapped dynamically.", icon: "📋" },
            { name: "Invoice_Factoring_Aged_Receivables.csv", size: "950 KB", desc: "Commercial debtor list with overdue indexes representing the invoice ledger available for immediate advancement.", icon: "🏢" }
        ];

        const filePick = mockFiles[Math.floor(Math.random() * mockFiles.length)];
        initiateMockFileUpload(filePick.name, filePick.size, filePick.desc, filePick.icon);
    });

    chatClipBtn.addEventListener("click", () => {
        uploadTrigger.click();
    });

    // Send button triggers
    chatSendBtn.addEventListener("click", sendSecureMessage);
    chatMsgInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendSecureMessage();
        }
    });

    searchInput.addEventListener("input", renderThreads);

    // Initial load
    switchThread("thread-1");
});