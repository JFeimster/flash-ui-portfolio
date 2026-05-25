// Dynamic Client Workspace Dashboard Integration
// Designed for a high-contrast Neo-Brutalist fintech UI

(function() {
    // 1. Inject Neo-Brutalist styles for the Workspace Dashboard
    const style = document.createElement('style');
    style.textContent = `
        .workspace-portal-btn {
            background: var(--accent-cyan) !important;
            color: #000 !important;
            border: var(--border-width) solid #fff !important;
            box-shadow: 4px 4px 0px #fff !important;
            font-weight: 900 !important;
        }
        .workspace-portal-btn.active {
            background: var(--accent-magenta) !important;
            color: #fff !important;
            box-shadow: 4px 4px 0px #fff !important;
        }
        
        /* Dashboard Container */
        .dashboard-container {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 30px;
            margin-top: 30px;
            animation: fadeInWorkspace 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeInWorkspace {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Metrics Card */
        .workspace-card {
            background: var(--surface);
            border: var(--border-width) solid #fff;
            padding: 30px;
            box-shadow: var(--brutal-shadow-yellow);
            position: relative;
            margin-bottom: 30px;
        }

        .workspace-card.cyan-shadow {
            box-shadow: var(--brutal-shadow-cyan);
        }

        .workspace-card.magenta-shadow {
            box-shadow: var(--brutal-shadow-magenta);
        }

        .workspace-header-badge {
            display: inline-block;
            background: var(--accent-yellow);
            color: #000;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            border: 2px solid #000;
            margin-bottom: 15px;
            font-family: 'Space Grotesk', sans-serif;
        }

        .workspace-title {
            font-size: 28px;
            font-weight: 900;
            text-transform: uppercase;
            font-family: 'Space Grotesk', sans-serif;
            margin-bottom: 20px;
            letter-spacing: -0.5px;
        }

        /* Storage Metrics Display */
        .storage-progress-container {
            background: var(--surface-card);
            border: 2px solid #fff;
            height: 36px;
            position: relative;
            margin-bottom: 15px;
            overflow: hidden;
            box-shadow: inset 3px 3px 0px rgba(0,0,0,0.5);
        }

        .storage-progress-bar {
            height: 100%;
            background: var(--accent-cyan);
            width: 32.4%; /* Calculated initial */
            transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .storage-text-metrics {
            display: flex;
            justify-content: space-between;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 14px;
            letter-spacing: 0.5px;
        }

        .metric-highlight {
            color: var(--accent-cyan);
        }

        /* Drag & Drop Upload Zone */
        .upload-zone {
            border: 3px dashed var(--accent-cyan);
            background: rgba(0, 243, 255, 0.02);
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.15s ease;
            position: relative;
        }

        .upload-zone:hover, .upload-zone.dragover {
            background: rgba(0, 243, 255, 0.08);
            border-style: solid;
        }

        .upload-zone-icon {
            font-size: 40px;
            margin-bottom: 15px;
        }

        .upload-zone-text {
            font-weight: 800;
            font-size: 16px;
            text-transform: uppercase;
            font-family: 'Space Grotesk', sans-serif;
            margin-bottom: 8px;
        }

        .upload-zone-subtext {
            font-size: 12px;
            color: var(--text-muted);
        }

        /* Hidden standard input */
        #workspace-file-input {
            display: none;
        }

        /* Live upload progression */
        .upload-progress-item {
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 15px;
            margin-top: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: 'Space Grotesk', sans-serif;
        }

        .upload-details {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .upload-details .name {
            font-weight: 800;
            font-size: 14px;
            text-transform: uppercase;
        }

        .upload-details .status {
            font-size: 11px;
            color: var(--accent-cyan);
            font-weight: 900;
        }

        .upload-cancel-btn {
            background: var(--accent-magenta);
            color: #fff;
            border: 2px solid #fff;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 900;
            cursor: pointer;
        }

        /* Files feed grid/list */
        .files-feed {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
        }

        .file-feed-item {
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.15s, box-shadow 0.15s;
        }

        .file-feed-item:hover {
            transform: translate(-3px, -3px);
            box-shadow: 6px 6px 0px var(--accent-cyan);
        }

        .file-info-block {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .file-type-badge {
            width: 44px;
            height: 44px;
            background: #000;
            border: 2px solid #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 900;
            color: var(--accent-yellow);
        }

        .file-text-meta h4 {
            font-size: 15px;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 4px;
            font-family: 'Space Grotesk', sans-serif;
        }

        .file-text-meta p {
            font-size: 12px;
            color: var(--text-muted);
        }

        .file-actions {
            display: flex;
            gap: 10px;
        }

        .file-action-btn {
            background: #000;
            border: 2px solid #fff;
            color: #fff;
            padding: 8px 14px;
            cursor: pointer;
            font-weight: 800;
            font-size: 12px;
            text-transform: uppercase;
            font-family: 'Space Grotesk', sans-serif;
            transition: all 0.1s;
        }

        .file-action-btn:hover {
            background: var(--accent-cyan);
            color: #000;
        }

        .file-action-btn.delete-btn:hover {
            background: var(--accent-magenta);
            color: #fff;
        }

        /* Secure Folder Grid */
        .folder-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .folder-card {
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 15px;
            cursor: pointer;
            transition: all 0.15s;
        }

        .folder-card:hover {
            transform: translate(-3px, -3px);
            box-shadow: 6px 6px 0px var(--accent-yellow);
            border-color: var(--accent-yellow);
        }

        .folder-icon {
            font-size: 24px;
        }

        .folder-details h5 {
            font-size: 14px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 2px;
            font-family: 'Space Grotesk', sans-serif;
        }

        .folder-details p {
            font-size: 11px;
            color: var(--text-muted);
        }

        /* Real-time Toast Notifications */
        .workspace-toast-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1010;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .workspace-toast {
            background: #000;
            color: #fff;
            border: var(--border-width) solid #fff;
            padding: 20px 25px;
            box-shadow: var(--brutal-shadow-magenta);
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 15px;
            animation: toastSlideIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes toastSlideIn {
            from { transform: translateX(120%); }
            to { transform: translateX(0); }
        }

        @media (max-width: 950px) {
            .dashboard-container {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Setup Toast Notification Engine
    const toastContainer = document.createElement('div');
    toastContainer.className = 'workspace-toast-container';
    document.body.appendChild(toastContainer);

    function showWorkspaceToast(message, type = 'magenta') {
        const toast = document.createElement('div');
        toast.className = 'workspace-toast';
        if (type === 'cyan') toast.style.boxShadow = 'var(--brutal-shadow-cyan)';
        if (type === 'yellow') toast.style.boxShadow = 'var(--brutal-shadow-yellow)';
        
        toast.innerHTML = `
            <span>⚡</span>
            <div>${message}</div>
        `;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlideIn 0.25s reverse forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 3500);
    }

    // 3. Mock Database Configuration
    const state = {
        totalSpaceBytes: 5 * 1024 * 1024 * 1024, // 5 GB
        files: [
            { id: 1, name: "LOAN_AGREEMENT_SIGNED_FINAL.pdf", size: 1.4 * 1024 * 1024, type: "PDF", date: "2 Hours ago", category: "legal" },
            { id: 2, name: "TAX_RETURNS_3_YEARS_MOCK.zip", size: 12.8 * 1024 * 1024, type: "ZIP", date: "Yesterday", category: "financial" },
            { id: 3, name: "BANK_STATEMENTS_L3M.pdf", size: 4.2 * 1024 * 1024, type: "PDF", date: "3 Days ago", category: "financial" }
        ],
        activeUploads: []
    };

    // Calculate dynamic usage metrics
    function getUsedSpace() {
        let total = state.files.reduce((acc, f) => acc + f.size, 0);
        state.activeUploads.forEach(u => {
            total += u.size * (u.progress / 100);
        });
        return total;
    }

    // 4. Dom Nodes Rendering Engine
    function renderWorkspaceView() {
        const gridContainer = document.getElementById('toolGrid');
        if (!gridContainer) return;

        const usedBytes = getUsedSpace();
        const usedPercent = ((usedBytes / state.totalSpaceBytes) * 100).toFixed(1);
        const usedGB = (usedBytes / (1024 * 1024 * 1024)).toFixed(3);
        const totalGB = (state.totalSpaceBytes / (1024 * 1024 * 1024)).toFixed(0);

        let filesHtml = state.files.map(file => `
            <div class="file-feed-item" data-id="${file.id}">
                <div class="file-info-block">
                    <div class="file-type-badge">${file.type}</div>
                    <div class="file-text-meta">
                        <h4>${file.name}</h4>
                        <p>${(file.size / (1024 * 1024)).toFixed(1)} MB • ${file.date}</p>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="file-action-btn" onclick="window.WorkspaceDashboard.downloadFile(${file.id})">Download</button>
                    <button class="file-action-btn delete-btn" onclick="window.WorkspaceDashboard.deleteFile(${file.id})">Delete</button>
                </div>
            </div>
        `).join('');

        if (state.files.length === 0) {
            filesHtml = `
                <div style="text-align: center; padding: 40px; border: 2px dashed rgba(255,255,255,0.15); color: var(--text-muted); font-weight: 800; text-transform: uppercase;">
                    No secure files found. Drag & drop parameters above to securely transmit.
                </div>
            `;
        }

        const activeUploadsHtml = state.activeUploads.map(upload => `
            <div class="upload-progress-item">
                <div class="upload-details">
                    <span class="name">${upload.name}</span>
                    <span class="status">UPLOADING... ${upload.progress}%</span>
                </div>
                <button class="upload-cancel-btn" onclick="window.WorkspaceDashboard.cancelUpload('${upload.id}')">CANCEL [X]</button>
            </div>
        `).join('');

        const dashboardHTML = `
            <div class="dashboard-container">
                <!-- Main upload stream & historical files -->
                <div class="dashboard-main">
                    <div class="workspace-card cyan-shadow">
                        <span class="workspace-header-badge">Transit Vault</span>
                        <h2 class="workspace-title">Secure Parameter Ingestion</h2>
                        <div class="upload-zone" id="workspace-drop-zone" onclick="document.getElementById('workspace-file-input').click()">
                            <div class="upload-zone-icon">📥</div>
                            <div class="upload-zone-text">DRAG & DROP SECURE WORKSPACE FILES HERE</div>
                            <div class="upload-zone-subtext">Supports PDF, ZIP, CSV, XLSX, PNG (MAX 500MB) • Fully End-to-End Encrypted</div>
                            <input type="file" id="workspace-file-input" multiple onchange="window.WorkspaceDashboard.handleFileSelect(event)">
                        </div>
                        <div id="workspace-upload-progress-container">
                            ${activeUploadsHtml}
                        </div>
                    </div>

                    <div class="workspace-card yellow-shadow">
                        <span class="workspace-header-badge">Active Repository</span>
                        <h2 class="workspace-title">Secure Transmission History</h2>
                        <div class="files-feed">
                            ${filesHtml}
                        </div>
                    </div>
                </div>

                <!-- Sidebar directory & storage indices -->
                <div class="dashboard-sidebar">
                    <div class="workspace-card magenta-shadow">
                        <span class="workspace-header-badge">Allocation</span>
                        <h2 class="workspace-title">Metrics Space</h2>
                        
                        <div class="storage-progress-container">
                            <div class="storage-progress-bar" id="workspace-storage-bar" style="width: ${usedPercent}%"></div>
                        </div>
                        <div class="storage-text-metrics">
                            <span>USED: <span class="metric-highlight">${usedPercent}%</span></span>
                            <span>${usedGB} / ${totalGB} GB</span>
                        </div>
                    </div>

                    <div class="workspace-card">
                        <span class="workspace-header-badge">Shared Nodes</span>
                        <h2 class="workspace-title">Workspace Folders</h2>
                        <div class="folder-grid">
                            <div class="folder-card" onclick="window.WorkspaceDashboard.openFolder('Underwriting Documents')">
                                <span class="folder-icon">📁</span>
                                <div class="folder-details">
                                    <h5>Underwriting Docs</h5>
                                    <p>Shared with Analyst Team</p>
                                </div>
                            </div>
                            <div class="folder-card" onclick="window.WorkspaceDashboard.openFolder('Merchant Processing statements')">
                                <span class="folder-icon">📁</span>
                                <div class="folder-details">
                                    <h5>Escrow Holdings</h5>
                                    <p>Read-Only Priority Access</p>
                                </div>
                            </div>
                            <div class="folder-card" onclick="window.WorkspaceDashboard.openFolder('Broker Commission Schedules')">
                                <span class="folder-icon">📁</span>
                                <div class="folder-details">
                                    <h5>Broker Contracts</h5>
                                    <p>Shared with Affiliate Direct</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Swap the existing grid with the Workspace Dashboard
        gridContainer.innerHTML = dashboardHTML;
        gridContainer.style.display = 'block';

        // Setup Drag and Drop Listeners
        const dropZone = document.getElementById('workspace-drop-zone');
        if (dropZone) {
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    dropZone.classList.add('dragover');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    dropZone.classList.remove('dragover');
                }, false);
            });

            dropZone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                window.WorkspaceDashboard.handleFiles(files);
            }, false);
        }
    }

    // 5. Interface Control Functions
    window.WorkspaceDashboard = {
        active: false,

        togglePortal: function() {
            const btn = document.getElementById('workspace-toggle-btn');
            if (!this.active) {
                this.active = true;
                btn.classList.add('active');
                btn.textContent = '📊 RETURN TO CALCULATORS';
                
                // Hide search/filtering bar search logic so standard list filters don't break our custom grid render
                const controls = document.querySelector('.controls-wrapper');
                if (controls) {
                    // Cache standard filters to easily return
                    this.savedFilterHtml = controls.innerHTML;
                    controls.innerHTML = `
                        <div class="filter-bar" style="justify-content: space-between;">
                            <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 900; font-size: 20px; text-transform: uppercase;">
                                SECURE CLIENT WORKSPACE <span style="color: var(--accent-cyan);">// ID: #DX-9902</span>
                            </div>
                            <button class="filter-btn active workspace-portal-btn" onclick="window.WorkspaceDashboard.togglePortal()">DISCONNECT WORKSPACE</button>
                        </div>
                    `;
                }
                
                // Save original tools layout
                const gridContainer = document.getElementById('toolGrid');
                this.savedGridHtml = gridContainer.innerHTML;
                this.savedGridStyle = gridContainer.style.display;

                renderWorkspaceView();
                showWorkspaceToast("CLIENT PORTAL CONNECTED: SECURE END-TO-END ACTIVE", "cyan");
            } else {
                this.active = false;
                btn.classList.remove('active');
                btn.textContent = '🔒 CLIENT WORKSPACE';
                
                // Restore controls
                const controls = document.querySelector('.controls-wrapper');
                if (controls && this.savedFilterHtml) {
                    controls.innerHTML = this.savedFilterHtml;
                    // re-wire standard filters
                    setTimeout(() => {
                        window.location.reload(); // Quick reset matching original architecture bindings
                    }, 100);
                }
            }
        },

        handleFileSelect: function(event) {
            const files = event.target.files;
            this.handleFiles(files);
        },

        handleFiles: function(files) {
            Array.from(files).forEach(file => {
                const uploadId = Math.random().toString(36).substring(2, 9);
                const mockUpload = {
                    id: uploadId,
                    name: file.name.toUpperCase(),
                    size: file.size,
                    progress: 0,
                    intervalId: null
                };

                state.activeUploads.push(mockUpload);
                renderWorkspaceView();

                // Start Mock Upload progression
                mockUpload.intervalId = setInterval(() => {
                    const upload = state.activeUploads.find(u => u.id === uploadId);
                    if (upload) {
                        upload.progress += Math.floor(Math.random() * 15) + 5;
                        if (upload.progress >= 100) {
                            upload.progress = 100;
                            clearInterval(upload.intervalId);
                            
                            // Convert to complete file
                            state.activeUploads = state.activeUploads.filter(u => u.id !== uploadId);
                            
                            // Determine Extension
                            const ext = upload.name.split('.').pop() || 'PDF';
                            state.files.unshift({
                                id: Date.now(),
                                name: upload.name,
                                size: upload.size,
                                type: ext.substring(0, 4),
                                date: "Just now",
                                category: "financial"
                            });

                            showWorkspaceToast(`SECURE TRANSMISSION COMPLETE: ${upload.name}`, "yellow");
                        }
                        renderWorkspaceView();
                    }
                }, 250);
            });
        },

        cancelUpload: function(id) {
            const upload = state.activeUploads.find(u => u.id === id);
            if (upload) {
                clearInterval(upload.intervalId);
                state.activeUploads = state.activeUploads.filter(u => u.id !== id);
                renderWorkspaceView();
                showWorkspaceToast("UPLOAD CANCELED", "magenta");
            }
        },

        deleteFile: function(id) {
            const file = state.files.find(f => f.id === id);
            state.files = state.files.filter(f => f.id !== id);
            renderWorkspaceView();
            if (file) {
                showWorkspaceToast(`PURGED: ${file.name}`, "magenta");
            }
        },

        downloadFile: function(id) {
            const file = state.files.find(f => f.id === id);
            if (file) {
                showWorkspaceToast(`RETRIEVING ENCRYPTED BYTES: ${file.name}`, "cyan");
                
                // Simulating browser download prompt
                setTimeout(() => {
                    const tempElement = document.createElement('a');
                    tempElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Mock Secure Byte Stream for: ${file.name}`));
                    tempElement.setAttribute('download', file.name);
                    tempElement.style.display = 'none';
                    document.body.appendChild(tempElement);
                    tempElement.click();
                    document.body.removeChild(tempElement);
                }, 1000);
            }
        },

        openFolder: function(name) {
            showWorkspaceToast(`ACCESSING SHARED DIRECTORY: ${name.toUpperCase()}`, "yellow");
        }
    };

    // 6. Append secure workspace button dynamically into target visual slots
    function initializeWorkspaceHook() {
        const filterBar = document.querySelector('.filter-bar');
        if (filterBar) {
            const portalBtn = document.createElement('button');
            portalBtn.className = 'filter-btn workspace-portal-btn';
            portalBtn.id = 'workspace-toggle-btn';
            portalBtn.innerHTML = '🔒 SECURE CLIENT PORTAL';
            portalBtn.onclick = function() { window.WorkspaceDashboard.togglePortal(); };
            filterBar.appendChild(portalBtn);
        }
    }

    // Try starting immediately or wait for DOM contents
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWorkspaceHook);
    } else {
        initializeWorkspaceHook();
    }
})();