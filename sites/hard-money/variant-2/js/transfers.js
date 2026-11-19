(function() {
  // Mock Data for Secure Link Transfers
  let transfersDatabase = [
    {
      id: "tx-a9b2",
      name: "104 Pinehurst Ave - Underwriting Package",
      files: ["Executive_Summary.pdf", "Rehab_Budget_v4.xlsx", "Property_Valuation.pdf"],
      size: "14.2 MB",
      created: "2 days ago",
      expires: "In 5 days",
      passwordProtected: true,
      password: "apex-exclusive",
      downloads: 18,
      status: "Active",
      token: "flow_sec_a9b2f8",
      analytics: [
        { user: "Apex Bridge Private Capital", event: "File Downloaded (Rehab_Budget_v4.xlsx)", time: "2 hours ago", ip: "182.12.9.2", location: "CA" },
        { user: "Apex Bridge Private Capital", event: "Package Accessed", time: "2 hours ago", ip: "182.12.9.2", location: "CA" },
        { user: "Lumina private Funding", event: "Package Accessed", time: "1 day ago", ip: "74.112.5.31", location: "NY" }
      ]
    },
    {
      id: "tx-c7d4",
      name: "Commercial Plaza Phase II - Appraisal & Phase 1",
      files: ["Phase_I_Environmental_Report.pdf", "Appraisal_Sovereign_Plaza.pdf"],
      size: "48.7 MB",
      created: "5 days ago",
      expires: "Expired",
      passwordProtected: false,
      downloads: 32,
      status: "Expired",
      token: "flow_sec_c7d4e2",
      analytics: [
        { user: "Veritas Commercial Trust", event: "File Downloaded (All Files)", time: "3 days ago", ip: "98.14.220.104", location: "FL" },
        { user: "Titan Trust Finance", event: "Package Accessed", time: "4 days ago", ip: "162.210.192.8", location: "TX" }
      ]
    }
  ];

  // Initialize the Transfer Manager Section and Navigation
  function initTransferManager() {
    // Inject Tab Navigation into Header or before main container
    const header = document.querySelector('header');
    if (!header) return;

    // Find the button area in header to inject toggle
    const navRight = header.querySelector('.flex.items-center.gap-3');
    if (navRight) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'toggle-transfers-tab';
      toggleBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:text-white border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex items-center gap-1.5';
      toggleBtn.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2" />
        </svg>
        Secure Share Panel
      `;
      navRight.insertBefore(toggleBtn, navRight.firstChild);

      toggleBtn.addEventListener('click', () => {
        toggleViews();
      });
    }

    // Build the Transfer Manager HTML Interface Container
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    const transfersSection = document.createElement('section');
    transfersSection.id = 'secure-transfers-section';
    transfersSection.className = 'hidden space-y-8 animate-[fadeIn_0.3s_ease-out]';
    transfersSection.innerHTML = `
      <!-- Back Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800/80 rounded-xl p-5">
        <div>
          <span class="text-emerald-400 text-xs font-bold uppercase tracking-wider">Secure Deal Link & Transfer Manager</span>
          <h2 class="text-xl font-extrabold text-white mt-1">Manage Direct-to-Lender File Bundles</h2>
          <p class="text-slate-400 text-xs mt-0.5">Generate password-protected, tracked packages for underwriters. Bypasses brokers, counts reads, secures deal data.</p>
        </div>
        <button id="back-to-directory" class="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Lender Directory
        </button>
      </div>

      <!-- Main Transfers Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left: Create Transfer Bundle -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-5 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 class="font-bold text-sm text-white uppercase tracking-wider">Generate Secure Deal Link</h3>
            </div>

            <form id="create-transfer-form" class="space-y-4">
              <!-- Bundle Name -->
              <div class="space-y-1.5">
                <label class="text-xs text-slate-400 font-medium">Deal Package Name</label>
                <input type="text" id="tx-name" required placeholder="e.g., 240 Hillside Multi-Family Proforma" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors">
              </div>

              <!-- Attachment Selector (Simulation) -->
              <div class="space-y-2">
                <label class="text-xs text-slate-400 font-medium">Select Documents to Pack</label>
                <div class="bg-slate-900/60 rounded-lg border border-slate-850 p-3 space-y-2.5">
                  <label class="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" name="tx-files" value="Executive_Summary.pdf" checked class="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950">
                    <span class="flex-1">Executive_Summary.pdf</span>
                    <span class="text-[10px] text-slate-500 font-mono">1.4 MB</span>
                  </label>
                  <label class="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" name="tx-files" value="Rehab_Budget_Estimator.xlsx" checked class="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950">
                    <span class="flex-1">Rehab_Budget_Estimator.xlsx</span>
                    <span class="text-[10px] text-slate-500 font-mono">2.8 MB</span>
                  </label>
                  <label class="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" name="tx-files" value="As_Is_Appraisal_Report.pdf" class="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950">
                    <span class="flex-1">As_Is_Appraisal_Report.pdf</span>
                    <span class="text-[10px] text-slate-500 font-mono">18.5 MB</span>
                  </label>
                  <label class="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" name="tx-files" value="Entity_Organization_Docs.zip" class="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950">
                    <span class="flex-1">Entity_Organization_Docs.zip</span>
                    <span class="text-[10px] text-slate-500 font-mono">8.1 MB</span>
                  </label>
                </div>
              </div>

              <!-- Expiration Option -->
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="text-xs text-slate-400 font-medium">Expiry Window</label>
                  <select id="tx-expiry" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors">
                    <option value="In 24 Hours">24 Hours</option>
                    <option value="In 3 Days">3 Days</option>
                    <option value="In 7 Days" selected>7 Days</option>
                    <option value="In 30 Days">30 Days</option>
                  </select>
                </div>
                <!-- Size display -->
                <div class="space-y-1.5">
                  <label class="text-xs text-slate-400 font-medium">Simulated Size</label>
                  <div class="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-400 font-mono flex items-center justify-between">
                    <span>Selected:</span>
                    <span id="tx-size-indicator" class="text-white font-bold">4.2 MB</span>
                  </div>
                </div>
              </div>

              <!-- Security: Password Toggle -->
              <div class="space-y-2.5 pt-1">
                <label class="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span class="font-medium text-slate-400">Require Access Password</span>
                  <input type="checkbox" id="tx-password-toggle" class="w-3.5 h-3.5 rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-emerald-500">
                </label>
                <div id="tx-password-field" class="hidden animate-[fadeIn_0.15s_ease-out]">
                  <input type="text" id="tx-password" placeholder="Define passcode, e.g., secret-deal" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors">
                </div>
              </div>

              <!-- Submit/Generate -->
              <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Secure and Generate Link
              </button>
            </form>
          </div>

          <!-- Mini Stats Tracker widget -->
          <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-4">
            <h4 class="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 node-pulse"></span>
              Live Link Metrics
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-center">
                <span class="text-[10px] text-slate-500 uppercase block">Active Secure Links</span>
                <span id="stat-active-links" class="text-xl font-extrabold text-white mt-1 block">1</span>
              </div>
              <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-center">
                <span class="text-[10px] text-slate-500 uppercase block">Document Fetches</span>
                <span id="stat-total-downloads" class="text-xl font-extrabold text-emerald-400 mt-1 block">50</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Active Packages & Analytics Tracker -->
        <div class="lg:col-span-7 space-y-6">
          <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-sm text-white uppercase tracking-wider">Active Secure Transfer Links</h4>
                <span id="transfers-count" class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">2 Packages</span>
              </div>
              <span class="text-[11px] text-slate-500">Auto-refresh active</span>
            </div>

            <!-- List Container -->
            <div id="active-transfers-list" class="space-y-4">
              <!-- Dynamically rendered -->
            </div>
          </div>

          <!-- Interaction Live Activity Log -->
          <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-4">
            <h4 class="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Lender Audit Trail (Analytics Logs)
            </h4>
            <div class="bg-slate-900/40 rounded-lg border border-slate-850 p-2 overflow-hidden">
              <div id="analytics-log-container" class="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar text-xs">
                <!-- Log feed injected dynamic -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    mainContainer.appendChild(transfersSection);

    // Event listeners inside the newly added section
    document.getElementById('back-to-directory').addEventListener('click', toggleViews);
    document.getElementById('create-transfer-form').addEventListener('submit', handleCreateTransfer);
    document.getElementById('tx-password-toggle').addEventListener('change', (e) => {
      const field = document.getElementById('tx-password-field');
      if (e.target.checked) {
        field.classList.remove('hidden');
      } else {
        field.classList.add('hidden');
      }
    });

    // Handle interactive dynamic sizing calculation
    const checkboxes = document.querySelectorAll('input[name="tx-files"]');
    checkboxes.forEach(chk => {
      chk.addEventListener('change', recalculateSimulatedSize);
    });

    // Populate the transfers views on start
    renderTransfers();
  }

  // Recalculate estimated file package size simulation
  function recalculateSimulatedSize() {
    let size = 0.0;
    const items = document.querySelectorAll('input[name="tx-files"]:checked');
    items.forEach(el => {
      const parent = el.closest('label');
      const textVal = parent.querySelector('.font-mono').textContent;
      size += parseFloat(textVal);
    });
    document.getElementById('tx-size-indicator').textContent = size.toFixed(1) + ' MB';
  }

  // Switch display between original main contents and Secure Transfer Manager content
  function toggleViews() {
    const mainDirWrapper = document.querySelector('main > div.grid');
    const heroSec = document.querySelector('section.relative');
    const transfersPanel = document.getElementById('secure-transfers-section');
    const toggleBtn = document.getElementById('toggle-transfers-tab');

    if (!transfersPanel) return;

    if (transfersPanel.classList.contains('hidden')) {
      // Show Transfers View
      transfersPanel.classList.remove('hidden');
      if (mainDirWrapper) mainDirWrapper.classList.add('hidden');
      if (heroSec) heroSec.classList.add('hidden');
      if (toggleBtn) {
        toggleBtn.innerHTML = `
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Direct Directory
        `;
        toggleBtn.classList.remove('text-emerald-400', 'border-emerald-500/30', 'bg-emerald-500/5', 'hover:bg-emerald-500/10');
        toggleBtn.classList.add('text-indigo-400', 'border-indigo-500/30', 'bg-indigo-500/5', 'hover:bg-indigo-500/10');
      }
      renderTransfers();
    } else {
      // Show Directory View
      transfersPanel.classList.add('hidden');
      if (mainDirWrapper) mainDirWrapper.classList.remove('hidden');
      if (heroSec) heroSec.classList.remove('hidden');
      if (toggleBtn) {
        toggleBtn.innerHTML = `
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2" />
          </svg>
          Secure Share Panel
        `;
        toggleBtn.classList.add('text-emerald-400', 'border-emerald-500/30', 'bg-emerald-500/5', 'hover:bg-emerald-500/10');
        toggleBtn.classList.remove('text-indigo-400', 'border-indigo-500/30', 'bg-indigo-500/5', 'hover:bg-indigo-500/10');
      }
    }
  }

  // Handle Form Submission for Creating a New Secure Link
  function handleCreateTransfer(event) {
    event.preventDefault();

    const nameInput = document.getElementById('tx-name');
    const expirySelect = document.getElementById('tx-expiry');
    const passwordToggle = document.getElementById('tx-password-toggle');
    const passwordInput = document.getElementById('tx-password');

    const selectedFileElements = document.querySelectorAll('input[name="tx-files"]:checked');
    if (selectedFileElements.length === 0) {
      alert("Please check at least one attachment file before packaging.");
      return;
    }

    const fileNames = Array.from(selectedFileElements).map(el => el.value);
    const mockId = "tx-" + Math.random().toString(36).substr(2, 4);
    const mockToken = "flow_sec_" + Math.random().toString(36).substr(2, 6);

    const isPasswordProtected = passwordToggle.checked;
    const passwordValue = isPasswordProtected ? passwordInput.value || "default-secret" : "";

    const newBundle = {
      id: mockId,
      name: nameInput.value,
      files: fileNames,
      size: document.getElementById('tx-size-indicator').textContent,
      created: "Just now",
      expires: expirySelect.value,
      passwordProtected: isPasswordProtected,
      password: passwordValue,
      downloads: 0,
      status: "Active",
      token: mockToken,
      analytics: [
        { user: "System", event: "Secure Direct Link Generated", time: "Just now", ip: "Your IP (Host)", location: "Local" }
      ]
    };

    transfersDatabase.unshift(newBundle);

    // Reset Form Input Parameters
    nameInput.value = "";
    passwordToggle.checked = false;
    passwordInput.value = "";
    document.getElementById('tx-password-field').classList.add('hidden');

    // Notify user with elegant toast system
    showToastNotification("Secure deal bundle created and locked.");

    // Refresh rendering
    renderTransfers();
  }

  // Copy-to-Clipboard logic for simulated access link
  window.copySecureTransferLink = function(token, btnElement) {
    const mockURL = `https://flowlend.com/secure/sh/${token}`;
    navigator.clipboard.writeText(mockURL).then(() => {
      // Visual feedback in action button
      const origText = btnElement.innerHTML;
      btnElement.className = "px-2.5 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase rounded flex items-center gap-1 transition-all";
      btnElement.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg> Copied!
      `;
      setTimeout(() => {
        btnElement.className = "px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/20 transition-all flex items-center gap-1";
        btnElement.innerHTML = origText;
      }, 2000);
      showToastNotification("Secured deal link copied to clipboard.");
    });
  }

  // Revoke/Delete link action
  window.revokeSecureLink = function(id) {
    const target = transfersDatabase.find(t => t.id === id);
    if (!target) return;

    if (target.status === "Expired" || target.status === "Revoked") {
      // Remove entirely
      transfersDatabase = transfersDatabase.filter(t => t.id !== id);
      showToastNotification("Transfer record cleared.");
    } else {
      // Change status to Revoked
      target.status = "Revoked";
      target.expires = "Revoked Access";
      target.analytics.unshift({ user: "Security Core", event: "Route Revoked by Owner", time: "Just now", ip: "-", location: "-" });
      showToastNotification("Lender access link revoked instantly.");
    }
    renderTransfers();
  }

  // Toast helper aligned with main window trigger
  function showToastNotification(message) {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.querySelector("h5").textContent = message;
      toast.querySelector("p").textContent = "Direct protection layer active & logged.";
      toast.classList.remove("translate-y-20", "opacity-0");
      setTimeout(() => {
        toast.classList.add("translate-y-20", "opacity-0");
      }, 3500);
    }
  }

  // Render both Transfer Active List and Audit Trail logs
  function renderTransfers() {
    const activeList = document.getElementById('active-transfers-list');
    const logContainer = document.getElementById('analytics-log-container');
    const transfersCounter = document.getElementById('transfers-count');
    const statActiveLinks = document.getElementById('stat-active-links');
    const statTotalDownloads = document.getElementById('stat-total-downloads');

    if (!activeList || !logContainer) return;

    // Calculate quick dynamic statistics
    let activeCount = 0;
    let sumDownloads = 0;
    transfersDatabase.forEach(item => {
      if (item.status === 'Active') activeCount++;
      sumDownloads += item.downloads;
    });

    if (transfersCounter) transfersCounter.textContent = `${transfersDatabase.length} Package(s)`;
    if (statActiveLinks) statActiveLinks.textContent = activeCount;
    if (statTotalDownloads) statTotalDownloads.textContent = sumDownloads;

    // 1. Populate the list of transfer items
    activeList.innerHTML = transfersDatabase.map(tx => {
      const isExpired = tx.status === "Expired";
      const isRevoked = tx.status === "Revoked";
      const isActive = tx.status === "Active";

      let statusBadge = "";
      if (isActive) {
        statusBadge = `<span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-bold text-emerald-400 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 node-pulse"></span>Active Link</span>`;
      } else if (isExpired) {
        statusBadge = `<span class="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-500">Expired</span>`;
      } else {
        statusBadge = `<span class="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold text-rose-400">Revoked</span>`;
      }

      return `
        <div class="bg-slate-950 border ${isActive ? 'border-slate-800/80 hover:border-emerald-500/20' : 'border-slate-900'} rounded-xl p-4.5 space-y-3.5 transition-all duration-300 relative group">
          <!-- Top Row Header inside Card -->
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <h5 class="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">${tx.name}</h5>
              <div class="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400">
                <span>Created: ${tx.created}</span>
                <span class="text-slate-600">•</span>
                <span>Size: <strong class="text-slate-300 font-mono">${tx.size}</strong></span>
              </div>
            </div>
            ${statusBadge}
          </div>

          <!-- Files and Expiration Metadata Panel -->
          <div class="bg-slate-900/40 border border-slate-900 rounded-lg p-2.5 space-y-1.5 text-xs">
            <div class="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-900 pb-1.5 mb-1.5">
              <span>Attached Documents:</span>
              <span class="text-slate-400">${tx.files.length} Files</span>
            </div>
            <div class="flex flex-col gap-1">
              ${tx.files.map(file => `
                <div class="flex items-center gap-1.5 text-slate-300">
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>${file}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Interaction Footer Area inside Card -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-900/60 text-xs">
            <div class="flex items-center gap-3 text-slate-400">
              <span class="flex items-center gap-1 font-mono">
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Downloads: <strong class="text-white">${tx.downloads}</strong>
              </span>
              <span class="text-slate-600">•</span>
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Security: 
                <strong class="${tx.passwordProtected ? 'text-emerald-400' : 'text-slate-500'} font-medium">
                  ${tx.passwordProtected ? 'Pass-locked' : 'None'}
                </strong>
              </span>
            </div>

            <div class="flex items-center gap-2">
              ${isActive ? `
                <button onclick="copySecureTransferLink('${tx.token}', this)" class="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/20 transition-all flex items-center gap-1">
                  Copy Secured Link
                </button>
              ` : ''}
              <button onclick="revokeSecureLink('${tx.id}')" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded border border-slate-850 transition-all">
                ${isActive ? 'Revoke' : 'Delete Log'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // 2. Populate the live audit trail / event log
    let allLogs = [];
    transfersDatabase.forEach(tx => {
      tx.analytics.forEach(log => {
        allLogs.push({
          bundleName: tx.name,
          ...log
        });
      });
    });

    // Sort by chronological logic
    logContainer.innerHTML = allLogs.map(log => {
      let eventIcon = "";
      if (log.event.includes("Downloaded")) {
        eventIcon = `<span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>`;
      } else if (log.event.includes("Accessed")) {
        eventIcon = `<span class="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>`;
      } else {
        eventIcon = `<span class="w-2 h-2 rounded-full bg-slate-600 inline-block"></span>`;
      }

      return `
        <div class="flex items-start justify-between gap-3 p-2 rounded hover:bg-slate-900/60 transition-colors border-b border-slate-900/40">
          <div class="flex items-start gap-2 max-w-[80%]">
            <div class="pt-1">${eventIcon}</div>
            <div>
              <div class="text-white font-medium">${log.user}</div>
              <div class="text-[10px] text-slate-400">${log.event}</div>
              <div class="text-[9px] text-slate-500 mt-0.5">${log.bundleName}</div>
            </div>
          </div>
          <div class="text-right text-[10px]">
            <span class="text-slate-400 block">${log.time}</span>
            <span class="text-slate-500 font-mono text-[9px] mt-0.5 block">${log.location ? `${log.location} • ` : ''}${log.ip}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Automatic simulation engine for live link tracking
  function initSimulationRunner() {
    setInterval(() => {
      // Find active transfer packages
      const actives = transfersDatabase.filter(t => t.status === "Active");
      if (actives.length === 0) return;

      // Select random transfer bundle
      const targetBundle = actives[Math.floor(Math.random() * actives.length)];

      // Choose simulation scenario
      const scenarios = [
        { user: "Apex Bridge Private Capital", event: "Package Accessed", ip: "182.12.9.2", location: "CA" },
        { user: "Lumina private Funding", event: `File Downloaded (${targetBundle.files[0]})`, ip: "74.112.5.31", location: "NY" },
        { user: "Veritas Commercial Trust", event: "Package Accessed (Attempt Refused - Bad Passcode)", ip: "98.14.220.104", location: "FL" },
        { user: "Vanguard Direct Private Credit", event: `File Downloaded (${targetBundle.files[targetBundle.files.length - 1]})`, ip: "207.46.13.52", location: "IL" }
      ];

      const sim = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      // Inject simulated audit details into database element
      targetBundle.downloads += sim.event.includes("Downloaded") ? 1 : 0;
      targetBundle.analytics.unshift({
        user: sim.user,
        event: sim.event,
        time: "Just now",
        ip: sim.ip,
        location: sim.location
      });

      // Keep only top 20 logs
      if (targetBundle.analytics.length > 20) {
        targetBundle.analytics.pop();
      }

      // Check if transfers panel interface is active to update dynamically
      const transfersPanel = document.getElementById('secure-transfers-section');
      if (transfersPanel && !transfersPanel.classList.contains('hidden')) {
        renderTransfers();
        // Subtle animation flare inside live log wrapper
        const logContainer = document.getElementById('analytics-log-container');
        if (logContainer && logContainer.firstElementChild) {
          logContainer.firstElementChild.classList.add('bg-emerald-500/10', 'animate-pulse');
          setTimeout(() => {
            if (logContainer.firstElementChild) {
              logContainer.firstElementChild.classList.remove('bg-emerald-500/10', 'animate-pulse');
            }
          }, 2000);
        }
      }
    }, 15000); // Trigger random audit event every 15 seconds
  }

  // Initialize inside execution thread safely
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTransferManager();
      initSimulationRunner();
    });
  } else {
    initTransferManager();
    initSimulationRunner();
  }
})();