(function () {
    // Inject Custom Styles for Settings UI Components
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Tab Routing & Display States */
        .core-app-view {
            transition: opacity 0.25s ease-in-out;
        }
        .hidden-view {
            display: none !important;
        }
        
        /* Neobrutalist Toggle Switch */
        .switch-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .brutal-switch {
            position: relative;
            display: inline-block;
            width: 52px;
            height: 28px;
        }
        .brutal-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .switch-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--bg-tertiary);
            border: 2.5px solid var(--border-color);
            transition: 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .switch-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 3px;
            background-color: var(--text-secondary);
            border: 1.5px solid #000;
            transition: 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .brutal-switch input:checked + .switch-slider {
            background-color: var(--accent-lime);
            border-color: #000;
            box-shadow: 2px 2px 0px #000;
        }
        .brutal-switch input:checked + .switch-slider:before {
            transform: translateX(22px);
            background-color: #000;
        }

        /* Settings Forms */
        .settings-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 32px;
            margin-top: 24px;
        }
        @media (max-width: 1024px) {
            .settings-grid {
                grid-template-columns: 1fr;
            }
        }
        .settings-card {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            padding: 32px;
            box-shadow: var(--brutal-shadow);
            position: relative;
        }
        .settings-card h3 {
            font-family: var(--font-display);
            font-size: 24px;
            text-transform: uppercase;
            margin-bottom: 24px;
            border-bottom: 2px dashed var(--border-color);
            padding-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .text-input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 20px;
        }
        .text-input-group label {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .settings-input {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 12px 16px;
            color: var(--text-primary);
            font-size: 14px;
            font-family: var(--font-sans);
            outline: none;
            transition: all 0.2s ease;
        }
        .settings-input:focus {
            border-color: var(--accent-cyan);
            box-shadow: 3px 3px 0px var(--accent-cyan);
        }
        .settings-select {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 12px 16px;
            color: var(--text-primary);
            font-size: 14px;
            outline: none;
            cursor: pointer;
            text-transform: uppercase;
            font-weight: 700;
        }
        .settings-select:focus {
            border-color: var(--accent-cyan);
        }

        /* Integration Provider Cards */
        .provider-row {
            border: 2px solid var(--border-color);
            background: var(--bg-tertiary);
            padding: 16px 20px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: border-color 0.2s ease;
        }
        .provider-row.connected {
            border-color: var(--accent-lime);
            box-shadow: 3px 3px 0px rgba(57, 255, 20, 0.15);
        }
        .provider-meta {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .provider-logo {
            font-size: 24px;
            width: 44px;
            height: 44px;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .provider-details h4 {
            font-family: var(--font-display);
            font-size: 16px;
            text-transform: uppercase;
            margin-bottom: 2px;
        }
        .provider-details p {
            font-size: 11px;
            color: var(--text-secondary);
        }
        
        /* Key Generator List */
        .key-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 12px 16px;
            margin-top: 12px;
            font-family: monospace;
            font-size: 13px;
        }
        .key-actions {
            display: flex;
            gap: 8px;
        }
        .mini-btn {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 4px 8px;
            cursor: pointer;
            text-transform: uppercase;
            font-size: 10px;
            font-family: var(--font-display);
            font-weight: 700;
        }
        .mini-btn:hover {
            border-color: var(--accent-magenta);
            color: var(--accent-magenta);
        }

        /* Live Indicator */
        .status-dot-active {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: var(--accent-lime);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--accent-lime);
        }
    `;
    document.head.appendChild(styleElement);

    // Initial Config State
    const settingsState = {
        maxFileSize: 125, // default MB
        backupIntegrations: {
            aws: { enabled: true, bucket: 'cf-attachment-vault', region: 'us-east-1' },
            gdrive: { enabled: false, folder: '/CoreFlowBackups' },
            onedrive: { enabled: false, path: '/Apps/CoreFlow' }
        },
        apiKeys: [
            { id: 'key_1', name: 'Salesforce Webhook Sync', prefix: 'cf_live_8f3a9d...', created: '2024-03-10' },
            { id: 'key_2', name: 'Internal Audit Daemon', prefix: 'cf_live_2c91b4...', created: '2024-04-01' }
        ]
    };

    // Inject "Admin Settings" to Navigation Header
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        const adminNavLink = document.createElement('a');
        adminNavLink.href = '#admin-settings';
        adminNavLink.className = 'nav-link';
        adminNavLink.id = 'nav-link-admin';
        adminNavLink.innerText = 'Admin Settings';
        navLinksContainer.appendChild(adminNavLink);
    }

    // Wrap Existing Main Core Engine Sections to enable Single Page Routing
    const appWrapper = document.createElement('div');
    appWrapper.className = 'core-app-view';
    appWrapper.id = 'calculators-view';

    const heroHeader = document.querySelector('header');
    const toolsLibrary = document.getElementById('tools-library');
    const strategySection = document.getElementById('strategy');
    const faqSection = document.getElementById('faq');

    // Move elements inside application wrapper
    if (heroHeader && heroHeader.parentNode) {
        heroHeader.parentNode.insertBefore(appWrapper, heroHeader);
        appWrapper.appendChild(heroHeader);
        if (toolsLibrary) appWrapper.appendChild(toolsLibrary);
        if (strategySection) appWrapper.appendChild(strategySection);
        if (faqSection) appWrapper.appendChild(faqSection);
    }

    // Create Admin Panel Section Element
    const adminPanel = document.createElement('section');
    adminPanel.className = 'tools-library-section core-app-view hidden-view';
    adminPanel.id = 'admin-settings-view';

    adminPanel.innerHTML = `
        <div class="section-headline">
            <div>
                <p style="text-transform: uppercase; font-size: 11px; font-weight: 800; color: var(--accent-magenta); letter-spacing: 2px;">Configuration Suite</p>
                <h2 style="margin-top: 5px;">Admin <span>Settings</span></h2>
            </div>
            <p style="color: var(--text-secondary); max-width: 450px; font-size: 14px; text-align: right;">
                Setup dynamic automatic secure attachments backing up to enterprise cloud storage. Configure security payload throttles and key access matrices.
            </p>
        </div>

        <div class="settings-grid">
            <!-- Left Panel: Integrations & Webhooks -->
            <div style="display: flex; flex-direction: column; gap: 32px;">
                <!-- Card 1: Cloud Storage Backups -->
                <div class="settings-card">
                    <h3>📁 Cloud Storage Backup Pipes</h3>
                    
                    <!-- AWS S3 -->
                    <div class="provider-row ${settingsState.backupIntegrations.aws.enabled ? 'connected' : ''}" id="prov-aws">
                        <div class="provider-meta">
                            <div class="provider-logo">☁️</div>
                            <div class="provider-details">
                                <h4>Amazon AWS S3 Bucket</h4>
                                <p id="prov-desc-aws">${settingsState.backupIntegrations.aws.enabled ? 'Connected to ' + settingsState.backupIntegrations.aws.bucket : 'Not configured'}</p>
                            </div>
                        </div>
                        <div class="switch-container">
                            <label class="brutal-switch">
                                <input type="checkbox" id="toggle-aws" ${settingsState.backupIntegrations.aws.enabled ? 'checked' : ''}>
                                <span class="switch-slider"></span>
                            </label>
                        </div>
                    </div>
                    <!-- AWS Expanded Settings Drawer -->
                    <div id="drawer-aws" style="padding: 0 20px 20px 20px; display: ${settingsState.backupIntegrations.aws.enabled ? 'block' : 'none'}; border-left: 2px dashed var(--border-color); margin-bottom: 24px;">
                        <div class="text-input-group">
                            <label>S3 Bucket Name</label>
                            <input type="text" class="settings-input" id="input-aws-bucket" value="${settingsState.backupIntegrations.aws.bucket}">
                        </div>
                        <div class="text-input-group">
                            <label>Region</label>
                            <select class="settings-select" id="input-aws-region">
                                <option value="us-east-1" selected>us-east-1 (N. Virginia)</option>
                                <option value="us-west-2">us-west-2 (Oregon)</option>
                                <option value="eu-west-1">eu-west-1 (Ireland)</option>
                            </select>
                        </div>
                        <button class="mini-btn" id="test-aws-btn" style="padding: 10px 16px;">⚡ Validate Connection</button>
                    </div>

                    <!-- Google Drive -->
                    <div class="provider-row ${settingsState.backupIntegrations.gdrive.enabled ? 'connected' : ''}" id="prov-gdrive">
                        <div class="provider-meta">
                            <div class="provider-logo">📁</div>
                            <div class="provider-details">
                                <h4>Google Drive API</h4>
                                <p id="prov-desc-gdrive">Automatic pipeline syncer for borrower files</p>
                            </div>
                        </div>
                        <div class="switch-container">
                            <label class="brutal-switch">
                                <input type="checkbox" id="toggle-gdrive" ${settingsState.backupIntegrations.gdrive.enabled ? 'checked' : ''}>
                                <span class="switch-slider"></span>
                            </label>
                        </div>
                    </div>
                    <!-- GDrive Drawer -->
                    <div id="drawer-gdrive" style="padding: 0 20px 20px 20px; display: ${settingsState.backupIntegrations.gdrive.enabled ? 'block' : 'none'}; border-left: 2px dashed var(--border-color); margin-bottom: 24px;">
                        <div class="text-input-group">
                            <label>Destination Folder Path</label>
                            <input type="text" class="settings-input" id="input-gdrive-folder" value="${settingsState.backupIntegrations.gdrive.folder}">
                        </div>
                        <button class="mini-btn" id="test-gdrive-btn" style="padding: 10px 16px;">⚡ Authenticate Google OAuth</button>
                    </div>

                    <!-- OneDrive -->
                    <div class="provider-row ${settingsState.backupIntegrations.onedrive.enabled ? 'connected' : ''}" id="prov-onedrive">
                        <div class="provider-meta">
                            <div class="provider-logo">🏢</div>
                            <div class="provider-details">
                                <h4>Microsoft OneDrive</h4>
                                <p id="prov-desc-onedrive">Corporate storage replication target</p>
                            </div>
                        </div>
                        <div class="switch-container">
                            <label class="brutal-switch">
                                <input type="checkbox" id="toggle-onedrive" ${settingsState.backupIntegrations.onedrive.enabled ? 'checked' : ''}>
                                <span class="switch-slider"></span>
                            </label>
                        </div>
                    </div>
                    <!-- OneDrive Drawer -->
                    <div id="drawer-onedrive" style="padding: 0 20px 20px 20px; display: ${settingsState.backupIntegrations.onedrive.enabled ? 'block' : 'none'}; border-left: 2px dashed var(--border-color); margin-bottom: 12px;">
                        <div class="text-input-group">
                            <label>SharePoint / OneDrive Sub-Directory</label>
                            <input type="text" class="settings-input" id="input-onedrive-path" value="${settingsState.backupIntegrations.onedrive.path}">
                        </div>
                        <button class="mini-btn" id="test-onedrive-btn" style="padding: 10px 16px;">⚡ Connect OneDrive Suite</button>
                    </div>
                </div>

                <!-- Card 2: Webhooks -->
                <div class="settings-card">
                    <h3>🔗 Outbound Real-time Webhooks</h3>
                    <div class="text-input-group">
                        <label>Callback Payload Endpoint URL</label>
                        <input type="url" class="settings-input" id="webhook-url" placeholder="https://api.yourdomain.com/v1/coreflow-webhook" value="https://webhooks.site/mock-coreflow-listener">
                    </div>
                    <div class="text-input-group">
                        <label>Active Content Events Trigger</label>
                        <select class="settings-select" id="webhook-event">
                            <option value="all">ALL: Every calculation & configuration change</option>
                            <option value="calc">Only manual borrower calculations triggers</option>
                            <option value="upload">Only attachment backup handshakes</option>
                        </select>
                    </div>
                    <button class="btn-action" id="save-webhook-btn" style="width: 100%; border: 2px solid #000; box-shadow: 3px 3px 0px #000;">Test & Deploy Callback Endpoint</button>
                </div>
            </div>

            <!-- Right Panel: System Controls & API Access -->
            <div style="display: flex; flex-direction: column; gap: 32px;">
                <!-- Card 3: Storage Throttling -->
                <div class="settings-card">
                    <h3>⚙️ Global Payload Limits</h3>
                    <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5;">
                        Restrict maximum file sizes allowed for dynamic document ingestion. Prevents storage exhaustion.
                    </p>
                    <div class="input-group">
                        <div class="input-label-container">
                            <span>Max File Attachment Allowed</span>
                            <span class="input-val" id="max-file-val">${settingsState.maxFileSize} MB</span>
                        </div>
                        <input type="range" min="10" max="1000" step="10" value="${settingsState.maxFileSize}" class="range-slider orange" id="max-file-slider">
                    </div>

                    <!-- Storage Cost Matrix Estimator -->
                    <div class="flow-graph-container" style="margin-top: 24px;">
                        <div class="flow-node-row">
                            <div class="flow-node highlight" style="width: 100%; font-size: 12px; padding: 12px;">
                                Calculated Daily Cap Capacity: <strong id="storage-est-day">12.5 GB / Day</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 4: API Key Access Manager -->
                <div class="settings-card">
                    <h3>🔑 Developer Secret Credentials</h3>
                    <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">
                        Generate authentic cryptographic authorization tokens to pipeline data streams securely.
                    </p>
                    
                    <div class="text-input-group">
                        <label>Key Identifier Name</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" class="settings-input" id="new-key-name" placeholder="E.g., HubSpot Sync Target" style="flex: 1;">
                            <button class="btn-action" id="generate-key-btn" style="padding: 12px 20px; font-size: 13px; border: 2px solid #000; box-shadow: 2px 2px 0px #000;">Forge Token</button>
                        </div>
                    </div>

                    <!-- Token Active Key Directory -->
                    <div style="margin-top: 24px;">
                        <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">Active Authorizations</h4>
                        <div id="api-keys-list">
                            <!-- Populated Dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insert Admin Panel Section View to Core Frame
    if (appWrapper.parentNode) {
        appWrapper.parentNode.insertBefore(adminPanel, appWrapper.nextSibling);
    }

    // Navigation Switch Logic
    function handleRouting() {
        const hash = window.location.hash;
        const allNavLinks = document.querySelectorAll('.nav-link');
        
        if (hash === '#admin-settings') {
            // Activate settings view
            appWrapper.classList.add('hidden-view');
            adminPanel.classList.remove('hidden-view');
            
            // Switch active visual menu highlights
            allNavLinks.forEach(link => link.classList.remove('active'));
            const adminBtn = document.getElementById('nav-link-admin');
            if (adminBtn) {
                adminBtn.style.color = 'var(--accent-magenta)';
                adminBtn.style.borderBottom = '2px solid var(--accent-magenta)';
            }
            
            if (typeof showNotification === 'function') {
                showNotification('ADMIN SECURE SYSTEM DASHBOARD CONFIGURED');
            }
        } else {
            // Default back to Core Flow Calculators App View
            adminPanel.classList.add('hidden-view');
            appWrapper.classList.remove('hidden-view');
            
            const adminBtn = document.getElementById('nav-link-admin');
            if (adminBtn) {
                adminBtn.style.color = '';
                adminBtn.style.borderBottom = '';
            }
        }
    }

    // Attach Navigation Listeners
    window.addEventListener('hashchange', handleRouting);
    window.addEventListener('load', handleRouting);

    // Dynamic Admin Panel Interactivity Controls
    const toggleAws = document.getElementById('toggle-aws');
    const drawerAws = document.getElementById('drawer-aws');
    const provAws = document.getElementById('prov-aws');
    const provDescAws = document.getElementById('prov-desc-aws');
    const inputAwsBucket = document.getElementById('input-aws-bucket');

    toggleAws.addEventListener('change', () => {
        const active = toggleAws.checked;
        settingsState.backupIntegrations.aws.enabled = active;
        drawerAws.style.display = active ? 'block' : 'none';
        if (active) {
            provAws.classList.add('connected');
            provDescAws.innerText = `Connected to ${inputAwsBucket.value}`;
            if (typeof showNotification === 'function') showNotification('AWS S3 Integration Activated');
        } else {
            provAws.classList.remove('connected');
            provDescAws.innerText = 'Not configured';
            if (typeof showNotification === 'function') showNotification('AWS S3 Pipeline Disabled');
        }
    });

    inputAwsBucket.addEventListener('input', (e) => {
        settingsState.backupIntegrations.aws.bucket = e.target.value;
        if (toggleAws.checked) {
            provDescAws.innerText = `Connected to ${e.target.value}`;
        }
    });

    const toggleGdrive = document.getElementById('toggle-gdrive');
    const drawerGdrive = document.getElementById('drawer-gdrive');
    const provGdrive = document.getElementById('prov-gdrive');
    const provDescGdrive = document.getElementById('prov-desc-gdrive');
    const inputGdriveFolder = document.getElementById('input-gdrive-folder');

    toggleGdrive.addEventListener('change', () => {
        const active = toggleGdrive.checked;
        settingsState.backupIntegrations.gdrive.enabled = active;
        drawerGdrive.style.display = active ? 'block' : 'none';
        if (active) {
            provGdrive.classList.add('connected');
            provDescGdrive.innerText = `Replicating files to ${inputGdriveFolder.value}`;
            if (typeof showNotification === 'function') showNotification('Google Drive Pipeline Injected');
        } else {
            provGdrive.classList.remove('connected');
            provDescGdrive.innerText = 'Automatic pipeline syncer for borrower files';
        }
    });

    inputGdriveFolder.addEventListener('input', (e) => {
        settingsState.backupIntegrations.gdrive.folder = e.target.value;
        if (toggleGdrive.checked) {
            provDescGdrive.innerText = `Replicating files to ${e.target.value}`;
        }
    });

    const toggleOnedrive = document.getElementById('toggle-onedrive');
    const drawerOnedrive = document.getElementById('drawer-onedrive');
    const provOnedrive = document.getElementById('prov-onedrive');
    const provDescOnedrive = document.getElementById('prov-desc-onedrive');
    const inputOnedrivePath = document.getElementById('input-onedrive-path');

    toggleOnedrive.addEventListener('change', () => {
        const active = toggleOnedrive.checked;
        settingsState.backupIntegrations.onedrive.enabled = active;
        drawerOnedrive.style.display = active ? 'block' : 'none';
        if (active) {
            provOnedrive.classList.add('connected');
            provDescOnedrive.innerText = `Linked: SharePoint${inputOnedrivePath.value}`;
            if (typeof showNotification === 'function') showNotification('Active Directory Connection Established');
        } else {
            provOnedrive.classList.remove('connected');
            provDescOnedrive.innerText = 'Corporate storage replication target';
        }
    });

    inputOnedrivePath.addEventListener('input', (e) => {
        settingsState.backupIntegrations.onedrive.path = e.target.value;
        if (toggleOnedrive.checked) {
            provDescOnedrive.innerText = `Linked: SharePoint${e.target.value}`;
        }
    });

    // Simulated Test Connection Actions
    document.getElementById('test-aws-btn').addEventListener('click', () => {
        if (typeof showNotification === 'function') {
            showNotification('Performing secure SSL Handshake to S3...');
            setTimeout(() => {
                showNotification('AWS Connection Verified: Bucket is readable');
            }, 1200);
        }
    });

    document.getElementById('test-gdrive-btn').addEventListener('click', () => {
        if (typeof showNotification === 'function') {
            showNotification('Directing to Google OAuth verification redirect mock...');
            setTimeout(() => {
                showNotification('Google Cloud authentication verified successfully');
            }, 1000);
        }
    });

    document.getElementById('test-onedrive-btn').addEventListener('click', () => {
        if (typeof showNotification === 'function') {
            showNotification('Requesting Tenant ID Active Handshake...');
            setTimeout(() => {
                showNotification('OneDrive Graph endpoint acknowledged connectivity');
            }, 1100);
        }
    });

    // Outbound Webhook Test Control
    const saveWebhookBtn = document.getElementById('save-webhook-btn');
    const webhookUrl = document.getElementById('webhook-url');
    saveWebhookBtn.addEventListener('click', () => {
        const url = webhookUrl.value;
        if (!url) {
            if (typeof showNotification === 'function') showNotification('Error: Invalid Webhook format.');
            return;
        }
        if (typeof showNotification === 'function') {
            showNotification(`Sending Mock calculation packet to endpoint...`);
            setTimeout(() => {
                showNotification(`Success! Webhook acknowledged with code 200 OK.`);
            }, 1500);
        }
    });

    // File Payload Dynamic Cost Calculator Matrix
    const maxFileSlider = document.getElementById('max-file-slider');
    const maxFileVal = document.getElementById('max-file-val');
    const storageEstDay = document.getElementById('storage-est-day');

    function calculateStorageEstimates(value) {
        settingsState.maxFileSize = value;
        maxFileVal.innerText = `${value} MB`;
        
        // Dynamic simulated calculations base usage
        const avgExpectedDailyPayload = (value * 0.12).toFixed(1);
        storageEstDay.innerText = `${avgExpectedDailyPayload} GB / Average Day`;
    }

    maxFileSlider.addEventListener('input', (e) => {
        calculateStorageEstimates(parseInt(e.target.value));
    });

    // Dynamic Secret Authorization Token Core Matrix Actions
    const apiKeysList = document.getElementById('api-keys-list');
    const generateKeyBtn = document.getElementById('generate-key-btn');
    const newKeyName = document.getElementById('new-key-name');

    function drawKeys() {
        apiKeysList.innerHTML = '';
        if (settingsState.apiKeys.length === 0) {
            apiKeysList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); font-size: 13px; margin-top: 12px; padding: 12px; border: 2px dashed var(--border-color);">No Active Developer Tokens found.</div>`;
            return;
        }

        settingsState.apiKeys.forEach(key => {
            const row = document.createElement('div');
            row.className = 'key-row';
            row.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span style="font-weight: 700; color: #fff; font-family: var(--font-sans); font-size: 13px;">${key.name}</span>
                    <span style="color: var(--accent-cyan); font-family: monospace;">${key.prefix}</span>
                    <span style="font-size: 9px; color: var(--text-secondary); text-transform: uppercase;">Generated ${key.created}</span>
                </div>
                <div class="key-actions">
                    <button class="mini-btn" data-action="copy" data-id="${key.id}">Copy</button>
                    <button class="mini-btn" data-action="delete" data-id="${key.id}" style="border-color: var(--accent-orange); color: var(--accent-orange);">Revoke</button>
                </div>
            `;
            apiKeysList.appendChild(row);
        });

        // Reconnect action events
        apiKeysList.querySelectorAll('[data-action="copy"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const matched = settingsState.apiKeys.find(k => k.id === id);
                if (matched) {
                    navigator.clipboard.writeText(`cf_secret_auth_token_full_mock_string_93208_cf_live_token_production`);
                    if (typeof showNotification === 'function') {
                        showNotification(`Copied Key: ${matched.name} token clipboard!`);
                    }
                }
            });
        });

        apiKeysList.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const matchedIndex = settingsState.apiKeys.findIndex(k => k.id === id);
                if (matchedIndex !== -1) {
                    const keyName = settingsState.apiKeys[matchedIndex].name;
                    settingsState.apiKeys.splice(matchedIndex, 1);
                    drawKeys();
                    if (typeof showNotification === 'function') {
                        showNotification(`Revoked authentication token access: ${keyName}`);
                    }
                }
            });
        });
    }

    // Handle token forge generation
    generateKeyBtn.addEventListener('click', () => {
        const name = newKeyName.value.trim();
        if (!name) {
            if (typeof showNotification === 'function') {
                showNotification('Error: Please enter a valid Token identifier name.');
            }
            return;
        }

        const generatedHex = Array.from({length: 6}, () => Math.floor(Math.random()*16).toString(16)).join('');
        const newKeyObj = {
            id: `key_${Date.now()}`,
            name: name,
            prefix: `cf_live_${generatedHex}...`,
            created: new Date().toISOString().split('T')[0]
        };

        settingsState.apiKeys.unshift(newKeyObj);
        newKeyName.value = '';
        drawKeys();

        if (typeof showNotification === 'function') {
            showNotification(`Forged Token: ${name} added live.`);
        }
    });

    // Execute Initial Page Elements Populate
    calculateStorageEstimates(settingsState.maxFileSize);
    drawKeys();
})();