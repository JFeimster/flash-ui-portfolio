// Dynamic Edge Workspace Rules & Integration Settings Engine
// Controls limits, virus scanning, cloud mappings, and storage quotas

const WorkspaceSettings = (() => {
    // Current application state
    const state = {
        maxDealCapacity: 7500000,
        quotaTotalGb: 5000,
        quotaUsedGb: 1248.4,
        virusScanActive: true,
        quarantineAction: 'isolate', // isolate | delete | flag
        syncFrequency: 15, // minutes
        integrations: {
            gdrive: { connected: true, account: 'ops@dynamicedge.cap', lastSync: '3 mins ago' },
            dropbox: { connected: false, account: null, lastSync: 'Never' },
            box: { connected: true, account: 'audit-vault@dynamicedge.cap', lastSync: '12 hours ago' }
        },
        logs: [
            { time: "14:22:01", event: "Virus scan completed on deal_pack_91.zip. 0 threats detected." },
            { time: "12:05:40", event: "Auto-synced 14 deal records to AWS S3 Bucket." },
            { time: "09:15:22", event: "Workspace Limit adjusted to $7.50M max cap." }
        ]
    };

    // Inject settings elements when DOM is ready
    function init() {
        injectTriggerButton();
        injectSettingsModal();
        bindEvents();
        updateUI();
    }

    // Injects the trigger button on the bottom left corner
    function injectTriggerButton() {
        const btn = document.createElement('div');
        btn.id = 'workspaceSettingsTrigger';
        btn.className = 'fixed bottom-6 left-6 z-40';
        btn.innerHTML = `
            <button onclick="WorkspaceSettings.openModal()" class="flex items-center gap-2 px-4 py-2.5 bg-[#0e131f]/90 border border-[#1e293b] hover:border-[#00f0ff] text-slate-300 hover:text-[#00f0ff] rounded-lg transition-all duration-300 shadow-lg backdrop-blur-md font-mono text-xs tracking-wider edge-clip">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
                </span>
                <span>WORKSPACE CONFIG</span>
            </button>
        `;
        document.body.appendChild(btn);
    }

    // Injects the interactive modal for Workspace settings
    function injectSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'workspaceSettingsModal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4 transition-all duration-300';
        modal.innerHTML = `
            <div class="bg-[#0e131f] border border-[#00f0ff]/60 w-full max-w-4xl p-6 rounded-xl relative edge-clip-reverse max-h-[90vh] overflow-y-auto">
                <div class="absolute top-0 right-12 w-24 h-1 bg-gradient-to-r from-[#00f0ff] via-[#bd00ff] to-[#05ffc4]"></div>
                
                <!-- Header -->
                <div class="flex justify-between items-start mb-6 pb-4 border-b border-[#1e293b]">
                    <div>
                        <h3 class="font-mono text-lg text-[#00f0ff] uppercase flex items-center gap-2">
                            <span class="w-1.5 h-4 bg-[#00f0ff] inline-block animate-pulse"></span>
                            Workspace Security & Integrations Portal
                        </h3>
                        <p class="text-slate-400 text-xs font-mono mt-1">Configure active upload screening parameters and storage distribution.</p>
                    </div>
                    <button onclick="WorkspaceSettings.closeModal()" class="text-slate-400 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <!-- Left Column: Quota & Scan Rules -->
                    <div class="space-y-6">
                        <!-- Rule 1: Capital & Space Allocations -->
                        <div class="bg-black/40 border border-[#1e293b] p-4 rounded-lg">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-mono text-[#00f0ff] uppercase tracking-wider">Storage Allocation Control</span>
                                <span class="text-xs font-mono text-[#05ffc4]" id="quotaPercent">0% Used</span>
                            </div>
                            
                            <div class="mb-4">
                                <div class="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-mono">
                                    <span>Workspace Quota Limit:</span>
                                    <strong id="quotaLabel" class="text-white">5,000 GB</strong>
                                </div>
                                <input id="settingsQuotaSlider" type="range" min="2000" max="10000" step="500" value="5000" 
                                    oninput="WorkspaceSettings.updateQuota(this.value)"
                                    class="w-full h-1 bg-[#1e293b] rounded-lg appearance-none cursor-pointer slider-thumb-custom">
                                <div class="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                                    <span>2.0 TB Min</span>
                                    <span>Current: <span id="currentStorageUsedText">1,248.4 GB</span></span>
                                    <span>10.0 TB Max</span>
                                </div>
                            </div>

                            <div class="w-full bg-[#1e293b]/50 rounded-full h-1.5 overflow-hidden">
                                <div id="quotaProgressBar" class="bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] h-1.5 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                        </div>

                        <!-- Rule 2: Automatic Virus Scanning & Security -->
                        <div class="bg-black/40 border border-[#1e293b] p-4 rounded-lg space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-mono text-[#bd00ff] uppercase tracking-wider">Intrusion Guard & Malware Shield</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="virusScanToggle" onchange="WorkspaceSettings.toggleVirusScan(this.checked)" class="sr-only peer">
                                    <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#05ffc4]"></div>
                                </label>
                            </div>

                            <p class="text-[11px] text-slate-400 leading-relaxed font-light">
                                Scans all external documents, certificates, and financial portfolios instantly during file drop. Blocks corrupted PDFs or payloads.
                            </p>

                            <div class="grid grid-cols-2 gap-3 pt-2">
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-500 uppercase mb-1">Threat Response Action</label>
                                    <select id="securityActionSelect" onchange="WorkspaceSettings.updateSecurityAction(this.value)" class="w-full bg-black border border-[#1e293b] rounded py-1 px-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#bd00ff]">
                                        <option value="isolate">Isolate Quarantine</option>
                                        <option value="delete">Auto Purge Hazard</option>
                                        <option value="flag">Flag & Continue</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-500 uppercase mb-1">Max Transaction Benchmark</label>
                                    <select id="maxDealBenchmark" onchange="WorkspaceSettings.updateDealLimit(this.value)" class="w-full bg-black border border-[#1e293b] rounded py-1 px-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#bd00ff]">
                                        <option value="2500000">$2.50M Cap Limit</option>
                                        <option value="5000000">$5.00M Cap Limit</option>
                                        <option value="7500000" selected>$7.50M Cap Limit</option>
                                        <option value="10000000">$10.0M Max Limit</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Right Column: Cloud Integrations & Logs -->
                    <div class="space-y-6">
                        <!-- Cloud Drives Integration List -->
                        <div class="bg-black/40 border border-[#1e293b] p-4 rounded-lg">
                            <span class="block text-xs font-mono text-[#05ffc4] uppercase tracking-wider mb-4">Mapped Cloud Directories</span>
                            
                            <div class="space-y-3">
                                <!-- Google Drive -->
                                <div class="flex items-center justify-between p-2.5 rounded border border-[#1e293b]/60 bg-black/20">
                                    <div class="flex items-center gap-2">
                                        <span class="text-base">🤖</span>
                                        <div>
                                            <span class="block text-xs font-bold text-slate-200">Google Drive Bridge</span>
                                            <span class="block text-[10px] text-slate-500 font-mono" id="gdriveStatus">Connecting...</span>
                                        </div>
                                    </div>
                                    <button onclick="WorkspaceSettings.toggleCloud('gdrive')" id="gdriveBtn" class="px-3 py-1 text-[10px] font-mono font-bold rounded uppercase border transition-colors"></button>
                                </div>

                                <!-- Dropbox -->
                                <div class="flex items-center justify-between p-2.5 rounded border border-[#1e293b]/60 bg-black/20">
                                    <div class="flex items-center gap-2">
                                        <span class="text-base">📦</span>
                                        <div>
                                            <span class="block text-xs font-bold text-slate-200">Dropbox Business</span>
                                            <span class="block text-[10px] text-slate-500 font-mono" id="dropboxStatus">Disconnected</span>
                                        </div>
                                    </div>
                                    <button onclick="WorkspaceSettings.toggleCloud('dropbox')" id="dropboxBtn" class="px-3 py-1 text-[10px] font-mono font-bold rounded uppercase border transition-colors"></button>
                                </div>

                                <!-- Box -->
                                <div class="flex items-center justify-between p-2.5 rounded border border-[#1e293b]/60 bg-black/20">
                                    <div class="flex items-center gap-2">
                                        <span class="text-base">📁</span>
                                        <div>
                                            <span class="block text-xs font-bold text-slate-200">Box Secure Sync</span>
                                            <span class="block text-[10px] text-slate-500 font-mono" id="boxStatus">Connecting...</span>
                                        </div>
                                    </div>
                                    <button onclick="WorkspaceSettings.toggleCloud('box')" id="boxBtn" class="px-3 py-1 text-[10px] font-mono font-bold rounded uppercase border transition-colors"></button>
                                </div>
                            </div>
                        </div>

                        <!-- Realtime Telemetry/Audit Logs -->
                        <div class="bg-black/40 border border-[#1e293b] p-4 rounded-lg">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-xs font-mono text-[#00f0ff] uppercase">Security Audit Log</span>
                                <span class="text-[9px] font-mono text-[#05ffc4] animate-pulse">STREAM ACTIVE</span>
                            </div>
                            <div id="settingsTelemetryLogs" class="space-y-1.5 max-h-[105px] overflow-y-auto font-mono text-[10px] text-slate-400">
                                <!-- Populated dynamically -->
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Footer Operations -->
                <div class="mt-8 pt-4 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span class="text-[10px] font-mono text-slate-500">Workspace Hash: <strong class="text-slate-300">WSH-992-DE-INT</strong></span>
                    <div class="flex gap-3">
                        <button onclick="WorkspaceSettings.closeModal()" class="border border-[#1e293b] text-slate-300 hover:border-[#bd00ff] hover:text-[#bd00ff] px-5 py-2 text-xs font-mono rounded transition-colors">
                            Close Console
                        </button>
                        <button onclick="WorkspaceSettings.saveSettings()" class="edge-clip bg-[#00f0ff] hover:bg-cyan-400 text-black px-6 py-2 text-xs font-bold uppercase transition-all">
                            Commit Workspace Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

    // Bind UI element interactions
    function bindEvents() {
        document.getElementById('virusScanToggle').checked = state.virusScanActive;
        document.getElementById('securityActionSelect').value = state.quarantineAction;
        document.getElementById('maxDealBenchmark').value = state.maxDealCapacity;
    }

    // Refresh display inputs based on current state parameters
    function updateUI() {
        // Quota calculations
        const percentage = ((state.quotaUsedGb / state.quotaTotalGb) * 100).toFixed(1);
        document.getElementById('quotaPercent').innerText = `${percentage}% Space Used`;
        document.getElementById('quotaLabel').innerText = `${state.quotaTotalGb.toLocaleString()} GB`;
        document.getElementById('currentStorageUsedText').innerText = `${state.quotaUsedGb.toLocaleString()} GB`;
        document.getElementById('quotaProgressBar').style.width = `${percentage}%`;

        // Update Cloud Integrations
        updateIntegrationStatus('gdrive', 'gdriveStatus', 'gdriveBtn');
        updateIntegrationStatus('dropbox', 'dropboxStatus', 'dropboxBtn');
        updateIntegrationStatus('box', 'boxStatus', 'boxBtn');

        // Render Telemetry audit logs
        const logContainer = document.getElementById('settingsTelemetryLogs');
        if (logContainer) {
            logContainer.innerHTML = state.logs.map(log => `
                <div class="flex gap-2 border-b border-[#1e293b]/30 pb-1">
                    <span class="text-slate-500">[${log.time}]</span>
                    <span class="text-slate-300">${log.event}</span>
                </div>
            `).join('');
        }
    }

    // Helper: Integration bridge status
    function updateIntegrationStatus(driveKey, statusSpanId, actionBtnId) {
        const item = state.integrations[driveKey];
        const span = document.getElementById(statusSpanId);
        const btn = document.getElementById(actionBtnId);

        if (!span || !btn) return;

        if (item.connected) {
            span.innerText = `Connected: ${item.account} | Sync: ${item.lastSync}`;
            span.className = "block text-[10px] text-[#05ffc4] font-mono";
            btn.innerText = "Disconnect";
            btn.className = "px-3 py-1 text-[10px] font-mono font-bold rounded uppercase bg-red-950/20 text-red-400 border-red-900/40 hover:bg-red-900/20";
        } else {
            span.innerText = "Connection Inactive (Storage Bypassed)";
            span.className = "block text-[10px] text-slate-500 font-mono";
            btn.innerText = "Authorize Link";
            btn.className = "px-3 py-1 text-[10px] font-mono font-bold rounded uppercase bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30 hover:bg-[#00f0ff]/20";
        }
    }

    // Event Handler: Toggle Cloud status mapping
    function toggleCloud(driveKey) {
        const item = state.integrations[driveKey];
        if (item.connected) {
            item.connected = false;
            item.account = null;
            item.lastSync = 'Never';
            addLog(`Unlinked ${driveKey.toUpperCase()} from Workspace Cloud Gateway.`);
        } else {
            // Simulate link prompt success
            item.connected = true;
            item.account = driveKey === 'dropbox' ? 'corp-files@dynamicedge.cap' : 'ops@dynamicedge.cap';
            item.lastSync = 'Connected Just Now';
            addLog(`Established live OAuth handshake mapping with ${driveKey.toUpperCase()}.`);
        }
        updateUI();
    }

    // Event Handler: Slider update
    function updateQuota(value) {
        state.quotaTotalGb = parseInt(value);
        updateUI();
    }

    // Event Handler: Auto Threat scan toggle status
    function toggleVirusScan(isActive) {
        state.virusScanActive = isActive;
        addLog(`Upload Antivirus scanning turned ${isActive ? 'ON' : 'OFF'}.`);
        updateUI();
    }

    // Event Handler: Action adjustments
    function updateSecurityAction(val) {
        state.quarantineAction = val;
        addLog(`System intrusion hazard posture updated to: ${val.toUpperCase()}`);
        updateUI();
    }

    // Event Handler: Max financial benchmark
    function updateDealLimit(val) {
        state.maxDealCapacity = parseInt(val);
        addLog(`Workspace allocation cap threshold set to $${(state.maxDealCapacity / 1000000).toFixed(2)}M.`);
        updateUI();
    }

    // Push events to the secure system logs queue
    function addLog(message) {
        const now = new Date();
        const timeStr = `${now.toTimeString().split(' ')[0]}`;
        state.logs.unshift({ time: timeStr, event: message });
        if (state.logs.length > 5) state.logs.pop();
    }

    // Form Commit actions
    function saveSettings() {
        alert("WORKSPACE TELEMETRY: Settings locked in. Node deployment metrics matching baseline synchronization.");
        closeModal();
    }

    // Modal Control wrappers
    function openModal() {
        document.getElementById('workspaceSettingsModal').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('workspaceSettingsModal').classList.add('hidden');
    }

    // Auto load setup
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API handles
    return {
        openModal,
        closeModal,
        updateQuota,
        toggleVirusScan,
        updateSecurityAction,
        updateDealLimit,
        toggleCloud,
        saveSettings
    };
})();
