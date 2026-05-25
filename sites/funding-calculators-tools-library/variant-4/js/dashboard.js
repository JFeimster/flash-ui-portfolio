/**
 * CORE FLOW - Workspace Dashboard Module
 * Administrative hub for managing active folders, recent uploads, approval queues, and storage.
 */

(function() {
    // Inject module-specific styling matching Core Flow's Neobrutalist theme
    const styleId = 'core-flow-dashboard-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .dash-container {
                display: grid;
                grid-template-columns: 1fr;
                gap: 30px;
                max-width: 1440px;
                margin: 0 auto;
                padding: 20px;
            }
            @media (min-width: 1024px) {
                .dash-grid-main {
                    display: grid;
                    grid-template-columns: 1.3fr 0.7fr;
                    gap: 30px;
                }
            }
            .dash-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 20px;
            }
            .dash-card {
                background: var(--bg-secondary);
                border: 2px solid var(--border-color);
                border-radius: 4px;
                padding: 24px;
                box-shadow: 4px 4px 0px var(--border-color);
                transition: all 0.2s ease;
                position: relative;
            }
            .dash-card:hover {
                border-color: var(--accent-cyan);
                box-shadow: 6px 6px 0px var(--accent-cyan);
            }
            .dash-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 10px;
            }
            .dash-card-title {
                font-family: var(--font-display);
                font-size: 14px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--text-secondary);
            }
            .dash-metric {
                font-family: var(--font-display);
                font-size: 32px;
                font-weight: 800;
                color: var(--text-primary);
                line-height: 1;
            }
            .dash-badge-sm {
                font-size: 10px;
                padding: 3px 8px;
                font-weight: 800;
                border-radius: 20px;
                text-transform: uppercase;
                display: inline-block;
            }
            .badge-cyan { background: rgba(0, 240, 255, 0.1); color: var(--accent-cyan); border: 1px solid var(--accent-cyan); }
            .badge-magenta { background: rgba(255, 0, 122, 0.1); color: var(--accent-magenta); border: 1px solid var(--accent-magenta); }
            .badge-orange { background: rgba(255, 92, 0, 0.1); color: var(--accent-orange); border: 1px solid var(--accent-orange); }
            .badge-lime { background: rgba(57, 255, 20, 0.1); color: var(--accent-lime); border: 1px solid var(--accent-lime); }
            
            /* Custom Table/List System */
            .dash-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .dash-list-item {
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                padding: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: border-color 0.15s ease;
            }
            .dash-list-item:hover {
                border-color: var(--accent-magenta);
            }
            .dash-item-meta {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .dash-item-title {
                font-weight: 700;
                font-size: 14px;
                color: var(--text-primary);
                text-transform: uppercase;
            }
            .dash-item-sub {
                font-size: 11px;
                color: var(--text-secondary);
            }
            .dash-actions {
                display: flex;
                gap: 8px;
            }
            .dash-btn-xs {
                padding: 6px 12px;
                font-size: 10px;
                font-family: var(--font-display);
                font-weight: 700;
                text-transform: uppercase;
                border: 2px solid #000;
                box-shadow: 2px 2px 0px #000;
                cursor: pointer;
            }
            
            /* Storage bar visualizer */
            .storage-tracker {
                display: flex;
                height: 16px;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                overflow: hidden;
                margin: 14px 0;
            }
            .storage-segment {
                height: 100%;
                transition: width 0.3s ease;
            }
            .storage-legend {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                font-size: 11px;
                text-transform: uppercase;
                font-weight: 600;
            }
            .legend-item {
                display: flex;
                align-items: center;
                gap: 6px;
                color: var(--text-secondary);
            }
            .legend-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }

            /* Folder view styling */
            .folder-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 16px;
                margin-top: 15px;
            }
            .folder-box {
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                padding: 16px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.15s ease;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .folder-box:hover {
                border-color: var(--accent-orange);
                transform: translateY(-2px);
            }
            .folder-icon-wrapper {
                font-size: 24px;
                color: var(--accent-orange);
            }
        `;
        document.head.appendChild(style);
    }

    // Module State
    const state = {
        totalStorage: 1000, // in MB
        storageUsed: {
            documents: 240,
            simulations: 110,
            brokers: 95,
            backups: 180
        },
        folders: [
            { id: 'f1', name: 'MCA Calculations', count: 14, size: '42 MB', type: 'documents' },
            { id: 'f2', name: 'Compliance Audits', count: 8, size: '128 MB', type: 'documents' },
            { id: 'f3', name: 'Funder Templates', count: 22, size: '32 MB', type: 'brokers' },
            { id: 'f4', name: 'Exported Reports', count: 19, size: '85 MB', type: 'simulations' }
        ],
        pendingQueue: [
            { id: 'p1', name: 'High_Risk_Factor_Table.csv', size: '1.2 MB', requestedBy: 'Broker Alpha', type: 'CSV Document' },
            { id: 'p2', name: 'Enterprise_Funding_NDA.pdf', size: '4.8 MB', requestedBy: 'Advisory Team', type: 'PDF Contract' },
            { id: 'p3', name: 'DSCR_Model_2024.xls', size: '8.4 MB', requestedBy: 'Commercial Desk', type: 'Excel Spreadsheet' }
        ],
        recentUploads: [
            { id: 'r1', name: 'SBA_Readiness_Checklist.pdf', size: '850 KB', uploader: 'System Bot', time: '10m ago' },
            { id: 'r2', name: 'Merchant_Revenue_Stream.json', size: '2.1 MB', uploader: 'API Terminal 4', time: '1h ago' }
        ],
        liveBandwidth: 14.2 // Mock active metric
    };

    // Helper functions
    function formatBytes(mb) {
        return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb} MB`;
    }

    function getStorageSum() {
        return Object.values(state.storageUsed).reduce((a, b) => a + b, 0);
    }

    function updateLiveMetrics() {
        // Randomly adjust bandwidth and stats slightly for realism
        state.liveBandwidth = Math.max(2.5, +(state.liveBandwidth + (Math.random() * 2 - 1)).toFixed(1));
        const bandwidthEl = document.getElementById('dash-val-bandwidth');
        if (bandwidthEl) {
            bandwidthEl.textContent = `${state.liveBandwidth} Mbps`;
        }
    }

    // Global application notification dispatcher
    function triggerToast(message) {
        const nativeToast = document.getElementById('toast');
        const nativeText = document.getElementById('toast-text');
        if (nativeToast && nativeText) {
            nativeText.innerText = message;
            nativeToast.classList.add('visible');
            setTimeout(() => nativeToast.classList.remove('visible'), 3000);
        } else {
            console.log(`[CORE FLOW ADMIN] ${message}`);
        }
    }

    // Event Handlers
    function approveItem(id) {
        const index = state.pendingQueue.findIndex(p => p.id === id);
        if (index !== -1) {
            const item = state.pendingQueue[index];
            state.pendingQueue.splice(index, 1);
            
            // Add to uploads
            state.recentUploads.unshift({
                id: 'r_' + Date.now(),
                name: item.name,
                size: item.size,
                uploader: item.requestedBy,
                time: 'Just Now'
            });

            // Update storage size simulation values slightly
            state.storageUsed.documents += Math.floor(Math.random() * 5) + 2;

            renderDashboard();
            triggerToast(`APPROVED AND RETRIEVED: ${item.name}`);
        }
    }

    function rejectItem(id) {
        const index = state.pendingQueue.findIndex(p => p.id === id);
        if (index !== -1) {
            const item = state.pendingQueue[index];
            state.pendingQueue.splice(index, 1);
            renderDashboard();
            triggerToast(`DELETED FROM AUDIT FLOW: ${item.name}`);
        }
    }

    function createMockFolder() {
        const folderNames = ['Broker Contracts', 'Subprime Underwritings', 'Factoring Agreements', 'Corporate Disclosures', 'Equipment Lease Vault'];
        const randomName = folderNames[Math.floor(Math.random() * folderNames.length)] + ` [${Math.floor(Math.random() * 90) + 10}]`;
        
        state.folders.push({
            id: 'f_' + Date.now(),
            name: randomName,
            count: Math.floor(Math.random() * 25) + 1,
            size: `${Math.floor(Math.random() * 60) + 5} MB`,
            type: 'documents'
        });

        renderDashboard();
        triggerToast(`PROVISIONED ACTIVE DIRECTORY: ${randomName}`);
    }

    function simulateIncomingUpload() {
        const fileNames = ['Merchant_Statement_March.pdf', 'FICO_Analysis_v4.json', 'Revenue_Financing_Cap_Structure.xlsx', 'Funder_Payout_Matrix.csv'];
        const randomFile = fileNames[Math.floor(Math.random() * fileNames.length)];
        const sizeMb = Math.floor(Math.random() * 12) + 1;

        state.pendingQueue.unshift({
            id: 'p_' + Date.now(),
            name: randomFile,
            size: `${sizeMb} MB`,
            requestedBy: 'API Partner Webhook',
            type: 'System Upload'
        });

        renderDashboard();
        triggerToast(`INCOMING AUDIT REQUEST INGESTED: ${randomFile}`);
    }

    // Core Visual Builder / Renderer
    function renderDashboard() {
        const target = document.getElementById('workspace-dashboard');
        if (!target) return;

        const totalUsed = getStorageSum();
        const percentUsed = ((totalUsed / state.totalStorage) * 100).toFixed(1);

        const docPct = (state.storageUsed.documents / state.totalStorage) * 100;
        const simPct = (state.storageUsed.simulations / state.totalStorage) * 100;
        const broPct = (state.storageUsed.brokers / state.totalStorage) * 100;
        const bacPct = (state.storageUsed.backups / state.totalStorage) * 100;

        target.innerHTML = `
            <div class="dash-container">
                <!-- Administrative Dashboard Header Controls -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid var(--border-color); padding-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                    <div>
                        <p style="text-transform: uppercase; font-size: 11px; font-weight: 800; color: var(--accent-cyan); letter-spacing: 2px;">Administrator Interface</p>
                        <h2 style="font-family: var(--font-display); font-size: 32px; font-weight: 800; text-transform: uppercase; margin-top: 5px;">Workspace <span>Monitoring Node</span></h2>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn-action" id="dash-btn-simulate" style="padding: 10px 16px; font-size: 11px; box-shadow: 2px 2px 0 #000;">Ingest File Alert</button>
                        <button class="btn-white" id="dash-btn-folder" style="padding: 10px 16px; font-size: 11px; font-weight:700;">Create Folder</button>
                    </div>
                </div>

                <!-- 4 High Impact Counters Grid -->
                <div class="dash-stats-grid">
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <span class="dash-card-title">Bandwidth Ingest</span>
                            <span class="dash-badge-sm badge-cyan">Live Socket</span>
                        </div>
                        <div class="dash-metric text-glow-cyan" id="dash-val-bandwidth">${state.liveBandwidth} Mbps</div>
                    </div>
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <span class="dash-card-title">Storage Consumption</span>
                            <span class="dash-badge-sm badge-orange">${percentUsed}% Limit</span>
                        </div>
                        <div class="dash-metric text-glow-orange">${formatBytes(totalUsed)}</div>
                    </div>
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <span class="dash-card-title">Active Folder Paths</span>
                            <span class="dash-badge-sm badge-magenta">Nodes</span>
                        </div>
                        <div class="dash-metric text-glow-magenta">${state.folders.length}</div>
                    </div>
                    <div class="dash-card">
                        <div class="dash-card-header">
                            <span class="dash-card-title">Queue Checkpoints</span>
                            <span class="dash-badge-sm badge-lime" style="background:rgba(57,255,20,0.1); border-color:var(--accent-lime); color:var(--accent-lime);">${state.pendingQueue.length} Pending</span>
                        </div>
                        <div class="dash-metric" style="color: var(--accent-lime);">${state.pendingQueue.length}</div>
                    </div>
                </div>

                <!-- Main Layout Container Splits -->
                <div class="dash-grid-main">
                    
                    <!-- Left Column: Folders View and Pendings -->
                    <div style="display: flex; flex-direction: column; gap: 30px;">
                        
                        <!-- Folders System component -->
                        <div class="terminal-box">
                            <div class="terminal-header">
                                <div class="terminal-dots">
                                    <div class="dot active-1"></div>
                                    <div class="dot active-2"></div>
                                </div>
                                <div class="terminal-title">Active Folder Directories</div>
                            </div>
                            <div class="terminal-body" style="min-height: auto; padding: 20px;">
                                <div class="folder-grid">
                                    ${state.folders.map(folder => `
                                        <div class="folder-box" data-id="${folder.id}">
                                            <div class="folder-icon-wrapper">📁</div>
                                            <div style="font-family: var(--font-display); font-weight: 700; font-size: 13px; text-transform: uppercase; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                                                ${folder.name}
                                            </div>
                                            <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-secondary); text-transform: uppercase;">
                                                <span>${folder.count} files</span>
                                                <span>${folder.size}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Pending Approvals Checkpoints -->
                        <div class="terminal-box">
                            <div class="terminal-header">
                                <div class="terminal-dots">
                                    <div class="dot active-3"></div>
                                    <div class="dot active-1"></div>
                                </div>
                                <div class="terminal-title">Secured Audit Ingestion Queue</div>
                            </div>
                            <div class="terminal-body" style="min-height: auto; padding: 20px;">
                                ${state.pendingQueue.length === 0 ? `
                                    <div style="text-align: center; color: var(--text-secondary); font-size: 13px; padding: 40px 0; text-transform: uppercase; font-weight: 700; border: 1px dashed var(--border-color);">
                                        No pending documents await admin checkpoints.
                                    </div>
                                ` : `
                                    <div class="dash-list">
                                        ${state.pendingQueue.map(item => `
                                            <div class="dash-list-item">
                                                <div class="dash-item-meta">
                                                    <div class="dash-item-title">${item.name}</div>
                                                    <div class="dash-item-sub">Requestor: ${item.requestedBy} | Size: ${item.size} | Type: ${item.type}</div>
                                                </div>
                                                <div class="dash-actions">
                                                    <button class="dash-btn-xs" data-approve="${item.id}" style="background: var(--accent-lime); color: #000; border-color: #000;">Approve</button>
                                                    <button class="dash-btn-xs" data-reject="${item.id}" style="background: transparent; color: var(--accent-magenta); border-color: var(--accent-magenta); box-shadow: 2px 2px 0 var(--accent-magenta);">Reject</button>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Storage allocation and activity logs -->
                    <div style="display: flex; flex-direction: column; gap: 30px;">
                        
                        <!-- Dynamic Storage breakdown chart -->
                        <div class="terminal-box">
                            <div class="terminal-header">
                                <div class="terminal-title">Storage Breakdown Allocation</div>
                            </div>
                            <div class="terminal-body" style="min-height: auto; padding: 20px;">
                                <div style="font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--text-primary); text-transform: uppercase; display: flex; justify-content: space-between;">
                                    <span>${formatBytes(totalUsed)} Used</span>
                                    <span style="color: var(--text-secondary);">${formatBytes(state.totalStorage)} Max</span>
                                </div>
                                
                                <div class="storage-tracker">
                                    <div class="storage-segment" style="width: ${docPct}%; background: var(--accent-cyan);" title="Documents"></div>
                                    <div class="storage-segment" style="width: ${simPct}%; background: var(--accent-magenta);" title="Simulations"></div>
                                    <div class="storage-segment" style="width: ${broPct}%; background: var(--accent-orange);" title="Broker Splits"></div>
                                    <div class="storage-segment" style="width: ${bacPct}%; background: var(--border-hover);" title="Audit Backups"></div>
                                </div>

                                <div class="storage-legend">
                                    <div class="legend-item"><span class="legend-dot" style="background: var(--accent-cyan);"></span>Calculations (${formatBytes(state.storageUsed.documents)})</div>
                                    <div class="legend-item"><span class="legend-dot" style="background: var(--accent-magenta);"></span>Exported Logs (${formatBytes(state.storageUsed.simulations)})</div>
                                    <div class="legend-item"><span class="legend-dot" style="background: var(--accent-orange);"></span>Broker Splits (${formatBytes(state.storageUsed.brokers)})</div>
                                    <div class="legend-item"><span class="legend-dot" style="background: var(--border-hover);"></span>Firmware Backup (${formatBytes(state.storageUsed.backups)})</div>
                                </div>
                            </div>
                        </div>

                        <!-- Realtime transaction ledger (Recent uploads) -->
                        <div class="terminal-box">
                            <div class="terminal-header">
                                <div class="terminal-title">Recent Event Ledger</div>
                            </div>
                            <div class="terminal-body" style="min-height: auto; padding: 20px;">
                                <div class="dash-list">
                                    ${state.recentUploads.map(upload => `
                                        <div class="dash-list-item" style="padding: 10px; border-style: dashed;">
                                            <div class="dash-item-meta">
                                                <div style="font-weight: 700; font-size: 12px; color: var(--text-primary); text-transform: uppercase;">
                                                    ${upload.name}
                                                </div>
                                                <div class="dash-item-sub">By ${upload.uploader} | ${upload.size}</div>
                                            </div>
                                            <div style="font-size: 10px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">
                                                ${upload.time}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        // Bind Dynamic Action Events
        document.getElementById('dash-btn-simulate').addEventListener('click', simulateIncomingUpload);
        document.getElementById('dash-btn-folder').addEventListener('click', createMockFolder);

        // Bind Delegated list actions (approvals/rejections)
        target.querySelectorAll('[data-approve]').forEach(btn => {
            btn.addEventListener('click', (e) => approveItem(e.target.dataset.approve));
        });

        target.querySelectorAll('[data-reject]').forEach(btn => {
            btn.addEventListener('click', (e) => rejectItem(e.target.dataset.reject));
        });
    }

    // Auto-init dashboard if target element is found on window load
    window.addEventListener('load', () => {
        // Look for the dedicated dashboard container
        const exist = document.getElementById('workspace-dashboard');
        if (exist) {
            renderDashboard();
            setInterval(updateLiveMetrics, 4000); // Pulse dynamic data updates
        }
    });

    // Expose dashboard controller utilities globally to hook directly into CORE FLOW application actions
    window.CoreFlowDashboard = {
        state: state,
        render: renderDashboard,
        simulateIngestion: simulateIncomingUpload,
        addFolder: createMockFolder,
        notify: triggerToast
    };

})();