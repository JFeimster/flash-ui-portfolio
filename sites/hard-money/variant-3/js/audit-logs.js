```javascript
/**
 * PRISM LOGIC // Transfer Security & Audit Logs Dashboard Add-on
 * Comprehensive compliance portal for tracking, audit trails, and data sovereignty.
 */

(function () {
  // --- STATE MANAGEMENT ---
  const state = {
    activeView: 'directory', // 'directory' | 'security'
    auditLogs: [
      {
        id: "TX-9081",
        timestamp: "2026-03-31 10:24:15",
        attachment: "Apex-LTV-Underwriting-Guidelines.pdf",
        lender: "Apex Prism Capital",
        ipAddress: "184.22.109.5",
        location: "San Jose, CA (USA)",
        action: "DOWNLOADED",
        securityStatus: "SECURE",
        statusColor: "text-prism-green"
      },
      {
        id: "TX-9080",
        timestamp: "2026-03-31 09:12:02",
        attachment: "Obsidian-Balance-Sheet-Matrix.xlsx",
        lender: "Obsidian Funding Group",
        ipAddress: "74.125.19.147",
        location: "Austin, TX (USA)",
        action: "DECRYPT_VIEWED",
        securityStatus: "SECURE",
        statusColor: "text-prism-green"
      },
      {
        id: "TX-9079",
        timestamp: "2026-03-30 22:45:11",
        attachment: "Apex-LTV-Underwriting-Guidelines.pdf",
        lender: "Apex Prism Capital",
        ipAddress: "198.51.100.42",
        location: "Zürich (CHE)",
        action: "BLOCKED_GEO_RESTRICTION",
        securityStatus: "THREAT_PREVENTED",
        statusColor: "text-prism-red"
      },
      {
        id: "TX-9078",
        timestamp: "2026-03-30 18:31:54",
        attachment: "Lumina-Trust-Speed-Sheet.pdf",
        lender: "Lumina Trust Direct",
        ipAddress: "203.0.113.88",
        location: "Miami, FL (USA)",
        action: "DOWNLOADED",
        securityStatus: "SECURE",
        statusColor: "text-prism-green"
      },
      {
        id: "TX-9077",
        timestamp: "2026-03-30 14:15:33",
        attachment: "Spectrum-DSCR-Guidelines-V4.pdf",
        lender: "Spectrum Capital Partners",
        ipAddress: "198.51.100.12",
        location: "New York, NY (USA)",
        action: "REVOCATION_TRIGGERED",
        securityStatus: "ACCESS_TERMINATED",
        statusColor: "text-prism-yellow"
      },
      {
        id: "TX-9076",
        timestamp: "2026-03-29 11:04:12",
        attachment: "Vertex-Rehab-Milestone-Checklist.docx",
        lender: "Vertex Credit Trust",
        ipAddress: "66.249.66.1",
        location: "Denver, CO (USA)",
        action: "DECRYPT_VIEWED",
        securityStatus: "SECURE",
        statusColor: "text-prism-green"
      }
    ],
    sharedAssets: [
      {
        id: "SH-401",
        name: "Apex-LTV-Underwriting-Guidelines.pdf",
        lenderName: "Apex Prism Capital",
        size: "4.2 MB",
        downloadCount: 142,
        expiration: "2026-06-30",
        active: true
      },
      {
        id: "SH-402",
        name: "Obsidian-Balance-Sheet-Matrix.xlsx",
        lenderName: "Obsidian Funding Group",
        size: "12.8 MB",
        downloadCount: 89,
        expiration: "2026-05-15",
        active: true
      },
      {
        id: "SH-403",
        name: "Lumina-Trust-Speed-Sheet.pdf",
        lenderName: "Lumina Trust Direct",
        size: "1.5 MB",
        downloadCount: 201,
        expiration: "2026-04-30",
        active: true
      },
      {
        id: "SH-404",
        name: "Spectrum-DSCR-Guidelines-V4.pdf",
        lenderName: "Spectrum Capital Partners",
        size: "3.1 MB",
        downloadCount: 54,
        expiration: "2026-04-10",
        active: false
      }
    ],
    mapNodes: [
      { x: 180, y: 110, name: "Zürich Endpoint", ping: true, color: '#ff2e93' },
      { x: 100, y: 130, name: "San Jose Access", ping: false, color: '#00f0ff' },
      { x: 120, y: 155, name: "Austin Target", ping: false, color: '#00ff87' },
      { x: 140, y: 145, name: "Miami Relay", ping: false, color: '#ffde43' },
      { x: 135, y: 125, name: "New York Hub", ping: false, color: '#8b5cf6' }
    ]
  };

  // --- INITIALIZATION ---
  function init() {
    injectNavigationTabs();
    createSecurityDashboardView();
    setupEventListeners();
    renderSecurityDashboard();
  }

  // Inject a high-tech view toggler inside the `<main>` element, preceding normal content
  function injectNavigationTabs() {
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    // Control bar html
    const tabContainer = document.createElement('div');
    tabContainer.className = 'flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4 font-mono text-xs';
    tabContainer.innerHTML = `
      <div class="flex items-center space-x-2 bg-black/40 p-1 rounded-xl border border-white/5">
        <button id="btn-show-directory" class="px-4 py-2 rounded-lg bg-prism-blue/15 text-prism-blue border border-prism-blue/30 font-semibold tracking-wider uppercase transition-all duration-300">
          // 01 : CAPITAL INDEX
        </button>
        <button id="btn-show-security" class="px-4 py-2 rounded-lg text-white/50 border border-transparent hover:text-white hover:bg-white/5 tracking-wider uppercase transition-all duration-300 flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-prism-red status-pulse"></span>
          // 02 : SECURITY & COMPLIANCE
        </button>
      </div>
      <div class="flex items-center space-x-3 bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-[10px] text-white/40 tracking-wider">
        <span>SECURITY NODE STATUS:</span>
        <span class="text-prism-green font-bold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-prism-green animate-pulse"></span>
          MIL-SPEC ENCRYPTED
        </span>
      </div>
    `;

    mainContainer.insertBefore(tabContainer, mainContainer.firstChild);
  }

  // Construct the main container for the compliance board (initially hidden)
  function createSecurityDashboardView() {
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    const securitySection = document.createElement('div');
    securitySection.id = 'security-portal-view';
    securitySection.className = 'hidden space-y-8 animate-fade-in';

    securitySection.innerHTML = `
      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="prism-glass p-5 rounded-2xl relative overflow-hidden border border-white/5">
          <span class="text-[9px] font-mono text-white/40 block uppercase">SYSTEM SOVEREIGNTY</span>
          <span class="text-2xl font-black text-white block mt-1">100% PASS</span>
          <span class="text-[10px] font-mono text-prism-green block mt-2">Zero unverified endpoints detected</span>
        </div>
        <div class="prism-glass p-5 rounded-2xl relative overflow-hidden border border-white/5">
          <span class="text-[9px] font-mono text-white/40 block uppercase">ACTIVE ATTACHMENT KEYS</span>
          <span id="stat-active-keys" class="text-2xl font-black text-prism-blue block mt-1">3/4</span>
          <span class="text-[10px] font-mono text-white/50 block mt-2">Revocation trigger operational</span>
        </div>
        <div class="prism-glass p-5 rounded-2xl relative overflow-hidden border border-white/5">
          <span class="text-[9px] font-mono text-white/40 block uppercase">COMPLIANCE TRANSFERS</span>
          <span class="text-2xl font-black text-prism-green block mt-1">484 HANDSHAKES</span>
          <span class="text-[10px] font-mono text-white/50 block mt-2">Underwriting packages verified</span>
        </div>
        <div class="prism-glass p-5 rounded-2xl relative overflow-hidden border border-white/5">
          <span class="text-[9px] font-mono text-white/40 block uppercase">BLOCKED ATTEMPTS</span>
          <span class="text-2xl font-black text-prism-red block mt-1">1 DETECTED</span>
          <span class="text-[10px] font-mono text-prism-red block mt-2">Zürich Geo-fence violation</span>
        </div>
      </div>

      <!-- Core Grid Split -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left Column: Manage Shares & Live Auditing -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- Attachment Permission Matrix -->
          <div class="prism-glass p-6 rounded-2xl border border-white/10">
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="text-[10px] font-mono tracking-widest text-prism-blue uppercase">Access Controls</span>
                <h3 class="text-lg font-bold text-white uppercase tracking-tight">Active Underwriting Attachments</h3>
              </div>
              <span class="text-xs text-white/40 font-mono">Permission Handlers</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr class="border-b border-white/5 text-white/40">
                    <th class="pb-3 font-medium">DOCUMENT / ATTACHMENT</th>
                    <th class="pb-3 font-medium">LENDER SOURCE</th>
                    <th class="pb-3 font-medium">TOTAL PULLS</th>
                    <th class="pb-3 font-medium">EXPIRATION</th>
                    <th class="pb-3 font-medium text-right">SHARING PERMISSION</th>
                  </tr>
                </thead>
                <tbody id="attachment-matrix-body" class="divide-y divide-white/5">
                  <!-- Rendered dynamically -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Log Console -->
          <div class="prism-glass p-6 rounded-2xl border border-white/10">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span class="text-[10px] font-mono tracking-widest text-prism-red uppercase font-semibold">Real-Time Auditing</span>
                <h3 class="text-lg font-bold text-white uppercase tracking-tight">Access & Handshake Logs</h3>
              </div>
              <div class="flex items-center space-x-2">
                <input 
                  type="text" 
                  id="security-search-input" 
                  placeholder="Filter by IP, doc name, or status..." 
                  class="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-prism-red w-48 transition"
                />
                <button id="btn-export-logs" class="bg-white/5 border border-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition">
                  <i data-lucide="download" class="w-3.5 h-3.5"></i> Export
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse font-mono text-[11px] leading-normal">
                <thead>
                  <tr class="border-b border-white/5 text-white/40 uppercase">
                    <th class="pb-3 font-medium">TRANS_ID</th>
                    <th class="pb-3 font-medium">TIMESTAMP</th>
                    <th class="pb-3 font-medium">CLIENT ADDR (IP)</th>
                    <th class="pb-3 font-medium">GEOLOCATION</th>
                    <th class="pb-3 font-medium">COMPLIANCE STATE</th>
                    <th class="pb-3 font-medium">ACTION MATRIX</th>
                  </tr>
                </thead>
                <tbody id="audit-logs-body" class="divide-y divide-white/5">
                  <!-- Rendered dynamically -->
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Right Column: Geographic Maps & System Config -->
        <div class="lg:col-span-4 space-y-8">
          
          <!-- Cyber Geo-Fence Visualizer -->
          <div class="prism-glass p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div class="mb-4">
              <span class="text-[10px] font-mono tracking-widest text-prism-green uppercase">Spectral Geo-Fence</span>
              <h3 class="text-base font-bold text-white uppercase tracking-tight">Active Handshake Map</h3>
              <p class="text-white/40 text-[10px] mt-1 leading-relaxed">
                Real-time connection mapping. Nodes highlight global handshakes and prohibited territorial access attempts.
              </p>
            </div>

            <!-- Interactive Geo-Fence Map Canvas -->
            <div class="relative h-[220px] bg-black/50 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center">
              <canvas id="geofence-map-canvas" class="absolute inset-0 w-full h-full pointer-events-auto"></canvas>
              
              <!-- Map Legend Overlay -->
              <div class="absolute bottom-3 left-3 bg-black/80 border border-white/5 p-2 rounded-lg text-[9px] font-mono space-y-1">
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-prism-green"></span>
                  <span class="text-white/60">AUTHORIZED REGION</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-prism-red"></span>
                  <span class="text-white/60">RESTRICTED REGION</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuration and Threat Center -->
          <div class="prism-glass p-6 rounded-2xl border border-white/10 space-y-4">
            <div>
              <span class="text-[10px] font-mono tracking-widest text-prism-yellow uppercase">Security Protocols</span>
              <h3 class="text-base font-bold text-white uppercase tracking-tight">Underwriter Shield Matrix</h3>
            </div>

            <div class="space-y-3 font-mono text-xs">
              <div class="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <span class="text-white block font-bold">MIL-SPEC ENCRYPTION</span>
                  <span class="text-[9px] text-white/40">Force absolute AES-256 for assets</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div class="w-8 h-4 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-prism-green"></div>
                </label>
              </div>

              <div class="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <span class="text-white block font-bold">FOREIGN IP LOCKDOWN</span>
                  <span class="text-[9px] text-white/40">Enforce rigid US territory limits</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div class="w-8 h-4 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-prism-green"></div>
                </label>
              </div>

              <div class="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <span class="text-white block font-bold">DYNAMIC EXPIRATION</span>
                  <span class="text-[9px] text-white/40">Wipe access keys within 7 days</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer">
                  <div class="w-8 h-4 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-prism-green"></div>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    mainContainer.appendChild(securitySection);
  }

  // --- EVENTS & HANDLERS ---
  function setupEventListeners() {
    const btnShowDirectory = document.getElementById('btn-show-directory');
    const btnShowSecurity = document.getElementById('btn-show-security');
    const searchSecurityInput = document.getElementById('security-search-input');
    const btnExportLogs = document.getElementById('btn-export-logs');

    if (btnShowDirectory && btnShowSecurity) {
      btnShowDirectory.addEventListener('click', () => switchView('directory'));
      btnShowSecurity.addEventListener('click', () => switchView('security'));
    }

    if (searchSecurityInput) {
      searchSecurityInput.addEventListener('input', () => {
        renderAuditLogs(searchSecurityInput.value);
      });
    }

    if (btnExportLogs) {
      btnExportLogs.addEventListener('click', () => {
        const jsonContent = JSON.stringify(state.auditLogs, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonContent);
        
        const exportFileDefaultName = `prism_compliance_audit_${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      });
    }
  }

  function switchView(viewName) {
    if (state.activeView === viewName) return;
    state.activeView = viewName;

    const btnShowDirectory = document.getElementById('btn-show-directory');
    const btnShowSecurity = document.getElementById('btn-show-security');
    
    // Grid controls for original directory dashboard elements
    const ribbon = document.querySelector('.prism-glass.p-5.rounded-2xl.border.border-white\\/10.mb-8');
    const lendersGrid = document.getElementById('lendersGrid');
    const emptyState = document.getElementById('emptyState');
    const heroSection = document.querySelector('section');
    const faqSection = document.getElementById('faqSection');

    const securityPortalView = document.getElementById('security-portal-view');

    if (viewName === 'security') {
      // Deactivate directory controls styling
      btnShowDirectory.className = 'px-4 py-2 rounded-lg text-white/50 border border-transparent hover:text-white hover:bg-white/5 tracking-wider uppercase transition-all duration-300';
      btnShowSecurity.className = 'px-4 py-2 rounded-lg bg-prism-red/15 text-prism-red border border-prism-red/30 font-semibold tracking-wider uppercase transition-all duration-300';

      // Hide Directory Components
      if (ribbon) ribbon.classList.add('hidden');
      if (lendersGrid) lendersGrid.classList.add('hidden');
      if (emptyState) emptyState.classList.add('hidden');
      if (heroSection) heroSection.classList.add('hidden');
      if (faqSection) faqSection.classList.add('hidden');

      // Show Security View
      if (securityPortalView) {
        securityPortalView.classList.remove('hidden');
        renderSecurityDashboard();
      }
    } else {
      // Activate Directory controls styling
      btnShowDirectory.className = 'px-4 py-2 rounded-lg bg-prism-blue/15 text-prism-blue border border-prism-blue/30 font-semibold tracking-wider uppercase transition-all duration-300';
      btnShowSecurity.className = 'px-4 py-2 rounded-lg text-white/50 border border-transparent hover:text-white hover:bg-white/5 tracking-wider uppercase transition-all duration-300';

      // Show Directory Components
      if (ribbon) ribbon.classList.remove('hidden');
      if (lendersGrid) lendersGrid.classList.remove('hidden');
      if (heroSection) heroSection.classList.remove('hidden');
      
      // Call standard filter check
      if (typeof window.filterLenders === 'function') {
        window.filterLenders();
      }

      // Hide Security View
      if (securityPortalView) {
        securityPortalView.classList.add('hidden');
      }
    }
  }

  // Toggle active permission states dynamically
  window.toggleAttachmentKey = function(assetId) {
    const asset = state.sharedAssets.find(a => a.id === assetId);
    if (!asset) return;

    asset.active = !asset.active;

    // Trigger compliance audit entry
    const newLogId = `TX-${Math.floor(Math.random() * 1000) + 9000}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    const newLog = {
      id: newLogId,
      timestamp: timestamp,
      attachment: asset.name,
      lender: asset.lenderName,
      ipAddress: "127.0.0.1 (SYSTEM)",
      location: "Handshake Portal Node",
      action: asset.active ? "PERMISSION_REINSTATED" : "REVOCATION_TRIGGERED",
      securityStatus: asset.active ? "SECURE" : "ACCESS_TERMINATED",
      statusColor: asset.active ? "text-prism-green" : "text-prism-yellow"
    };

    state.auditLogs.unshift(newLog);

    // Re-render
    renderSecurityDashboard();
  };

  // --- RENDERING HANDLERS ---
  function renderSecurityDashboard() {
    renderAttachmentMatrix();
    renderAuditLogs();
    renderStatSummaries();
    initializeGeofenceMap();
  }

  function renderStatSummaries() {
    const activeCountElement = document.getElementById('stat-active-keys');
    if (!activeCountElement) return;

    const total = state.sharedAssets.length;
    const active = state.sharedAssets.filter(a => a.active).length;
    activeCountElement.textContent = `${active}/${total}`;
  }

  function renderAttachmentMatrix() {
    const tableBody = document.getElementById('attachment-matrix-body');
    if (!tableBody) return;

    tableBody.innerHTML = state.sharedAssets.map(asset => `
      <tr class="hover:bg-white/[0.02] transition-colors">
        <td class="py-4 font-semibold text-white flex items-center gap-2">
          <i data-lucide="file-text" class="w-4 h-4 text-white/40"></i>
          <span>${asset.name}</span>
          <span class="text-[9px] text-white/40 font-mono">(${asset.size})</span>
        </td>
        <td class="py-4 text-white/70">${asset.lenderName}</td>
        <td class="py-4 text-white/50">${asset.downloadCount} downloads</td>
        <td class="py-4 text-white/50">${asset.expiration}</td>
        <td class="py-4 text-right">
          <button 
            onclick="toggleAttachmentKey('${asset.id}')" 
            class="px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider font-mono uppercase transition-all duration-300 ${
              asset.active 
                ? 'bg-prism-green/10 border-prism-green/30 text-prism-green hover:bg-prism-green/20' 
                : 'bg-prism-red/10 border-prism-red/30 text-prism-red hover:bg-prism-red/20'
            }"
          >
            ${asset.active ? '● Access Active' : '○ KEY REVOKED'}
          </button>
        </td>
      </tr>
    `).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderAuditLogs(filterQuery = '') {
    const tableBody = document.getElementById('audit-logs-body');
    if (!tableBody) return;

    const filteredLogs = state.auditLogs.filter(log => {
      const query = filterQuery.toLowerCase().trim();
      return !query || 
        log.id.toLowerCase().includes(query) ||
        log.attachment.toLowerCase().includes(query) ||
        log.lender.toLowerCase().includes(query) ||
        log.ipAddress.toLowerCase().includes(query) ||
        log.location.toLowerCase().includes(query) ||
        log.securityStatus.toLowerCase().includes(query);
    });

    tableBody.innerHTML = filteredLogs.map(log => `
      <tr class="hover:bg-white/[0.02] transition-colors">
        <td class="py-3 text-white/40 font-mono">${log.id}</td>
        <td class="py-3 text-white/60">${log.timestamp}</td>
        <td class="py-3 text-white font-semibold">${log.ipAddress}</td>
        <td class="py-3 text-white/50">${log.location}</td>
        <td class="py-3 ${log.statusColor} font-bold tracking-widest uppercase">${log.securityStatus}</td>
        <td class="py-3 text-right">
          <span class="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-white/70 text-[10px]">
            ${log.action}
          </span>
        </td>
      </tr>
    `).join('');
  }

  // --- CANVA GEOLOCATION SIMULATOR ---
  function initializeGeofenceMap() {
    const mapCanvas = document.getElementById('geofence-map-canvas');
    if (!mapCanvas) return;

    const ctx = mapCanvas.getContext('2d');
    
    // Fit canvas sizing inside parent block container
    mapCanvas.width = mapCanvas.parentElement.clientWidth;
    mapCanvas.height = mapCanvas.parentElement.clientHeight;

    function drawInteractiveMap() {
      ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

      // Render schematic background tracking grid pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 15;
      for (let x = 0; x < mapCanvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, mapCanvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < mapCanvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(mapCanvas.width, y);
        ctx.stroke();
      }

      // Drawing target secure node (Prism Central)
      const centralNode = { x: mapCanvas.width * 0.45, y: mapCanvas.height * 0.55 };

      ctx.beginPath();
      ctx.arc(centralNode.x, centralNode.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#00f0ff";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connecting active access requests from simulated world regions
      state.mapNodes.forEach(node => {
        const pulseRatio = node.ping ? Math.sin(Date.now() * 0.005) * 6 + 6 : 4;
        
        // Draw connection beam line
        ctx.beginPath();
        ctx.moveTo(centralNode.x, centralNode.y);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = node.ping ? "rgba(255, 46, 147, 0.2)" : "rgba(0, 240, 255, 0.15)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Target client terminal dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Pulse ring around target
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRatio, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Terminal labels
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "8px 'JetBrains Mono'";
        ctx.fillText(node.name, node.x + 8, node.y + 3);
      });

      // Secure Node Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px 'JetBrains Mono'";
      ctx.fillText("SECURE INDEX NODE", centralNode.x - 45, centralNode.y - 12);

      requestAnimationFrame(drawInteractiveMap);
    }

    drawInteractiveMap();
  }

  // --- INIT BOOTSTRAP ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```