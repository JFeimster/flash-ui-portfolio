// Asset Analytics & Storage Dashboard
// Designed to seamlessly integrate with Flow Lend Base UI

(function() {
  // Mock Database for Assets & Storage
  const INITIAL_FILES = [
    {
      id: "file-01",
      name: "Underwriting_Package_v4.pdf",
      size: 24.2, // MB
      type: "PDF Document",
      uploadedBy: "Alex Mercer",
      associatedLender: "Apex Bridge Private Capital",
      timestamp: "2 mins ago",
      downloads: 4,
      status: "Verified",
      color: "emerald"
    },
    {
      id: "file-02",
      name: "Property_Photos_HighRes.zip",
      size: 145.8, // MB
      type: "Archive Zip",
      uploadedBy: "Sarah Jenkins",
      associatedLender: "Lumina private Funding Group",
      timestamp: "1 hour ago",
      downloads: 2,
      status: "Scanned",
      color: "indigo"
    },
    {
      id: "file-03",
      name: "Rent_Roll_Commercial.xlsx",
      size: 1.2, // MB
      type: "Spreadsheet",
      uploadedBy: "Marcus Vance",
      associatedLender: "Veritas Commercial Trust",
      timestamp: "3 hours ago",
      downloads: 7,
      status: "Verified",
      color: "emerald"
    },
    {
      id: "file-04",
      name: "Tax_Returns_3Years.pdf",
      size: 18.5, // MB
      type: "PDF Document",
      uploadedBy: "Marcus Vance",
      associatedLender: "Veritas Commercial Trust",
      timestamp: "5 hours ago",
      downloads: 1,
      status: "Verified",
      color: "emerald"
    },
    {
      id: "file-05",
      name: "Phase_1_Environmental.pdf",
      size: 35.4, // MB
      type: "PDF Document",
      uploadedBy: "David Miller",
      associatedLender: "Titan Trust Real Estate",
      timestamp: "1 day ago",
      downloads: 0,
      status: "Pending",
      color: "amber"
    }
  ];

  const INITIAL_LOGS = [
    { id: 1, event: "Apex Bridge downloaded Underwriting_Package_v4.pdf", time: "Just now", type: "download" },
    { id: 2, event: "Security scan passed: Property_Photos_HighRes.zip", time: "1 hour ago", type: "scan" },
    { id: 3, event: "New attachment registered under Veritas Commercial Trust", time: "3 hours ago", type: "upload" },
    { id: 4, event: "File signature verified: Tax_Returns_3Years.pdf", time: "5 hours ago", type: "security" },
    { id: 5, event: "System automated audit: 5/5 assets matching active compliance", time: "12 hours ago", type: "system" }
  ];

  // Global Dashboard State
  let state = {
    files: [...INITIAL_FILES],
    logs: [...INITIAL_LOGS],
    totalCapacity: 500, // MB
    activeFilter: "All",
    searchQuery: "",
    originalMainContent: null
  };

  // Run initial hook when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboardIntegration);
  } else {
    initDashboardIntegration();
  }

  function initDashboardIntegration() {
    injectNavigationButton();
  }

  // Inject beautiful "Asset Storage" button in primary navigation bar
  function injectNavigationButton() {
    const navGroup = document.querySelector('header .max-w-7xl .flex.items-center.gap-3');
    if (!navGroup) return;

    // Create a new storage hub action button
    const storageBtn = document.createElement('button');
    storageBtn.id = "btn-toggle-dashboard";
    storageBtn.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:text-white border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all cursor-pointer";
    storageBtn.innerHTML = `
      <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
      Asset Analytics
    `;

    // Insert as the first element in the controls group
    navGroup.insertBefore(storageBtn, navGroup.firstChild);

    storageBtn.addEventListener('click', toggleDashboardView);
  }

  // Switch between Lender Directory and Storage Analytics Dashboard
  function toggleDashboardView() {
    const mainContainer = document.querySelector('main');
    const heroSection = document.querySelector('section');
    const storageBtn = document.getElementById('btn-toggle-dashboard');

    if (!mainContainer) return;

    // If already in dashboard view, return to original directory
    if (state.originalMainContent) {
      mainContainer.outerHTML = state.originalMainContent;
      if (heroSection) heroSection.classList.remove('hidden');
      state.originalMainContent = null;

      // Reset button style
      storageBtn.innerHTML = `
        <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        Asset Analytics
      `;
      storageBtn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-500');
      storageBtn.classList.add('text-emerald-400', 'border-emerald-500/30', 'bg-emerald-500/5');
      
      // Re-initialize state controls of original base UI
      if (window.initAssetButtons) window.initAssetButtons();
      if (window.initSlider) window.initSlider();
      if (window.initSearch) window.initSearch();
      if (window.initStateSelect) window.initStateSelect();
      if (window.initFastCheckboxes) window.initFastCheckboxes();
      if (window.renderLenders) window.renderLenders();
      return;
    }

    // Capture current view to restore later
    state.originalMainContent = mainContainer.outerHTML;
    if (heroSection) heroSection.classList.add('hidden');

    // Transform button to an exit action state
    storageBtn.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Lenders
    `;
    storageBtn.classList.remove('text-emerald-400', 'border-emerald-500/30', 'bg-emerald-500/5');
    storageBtn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-500');

    // Create high-fidelity dynamic dashboard container inside main space
    renderDashboardSkeleton(mainContainer);
    updateDashboardUI();
  }

  function renderDashboardSkeleton(targetContainer) {
    targetContainer.innerHTML = `
      <div class="space-y-6 pt-6">
        <!-- Top Status Bar / Header Overview -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold mb-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 node-pulse"></span>
              Secure File Underwriting Hub
            </div>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Attachment Storage & File Analytics</h1>
            <p class="text-slate-400 text-xs mt-1">Real-time usage distribution, instant security scanning logs, and pipeline document verification metrics.</p>
          </div>
          
          <div class="flex items-center gap-3">
            <button id="btn-simulate-upload" class="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-emerald-500/15 transition-all flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Simulate Upload
            </button>
            <button id="btn-purge-dashboard" class="px-3.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white border border-slate-800 bg-slate-900 rounded-lg hover:bg-slate-800 transition-all">
              Purge Logs
            </button>
          </div>
        </div>

        <!-- Analytical Analytics Counters Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Card 1: Storage Limit Dynamic -->
          <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-3">
            <div class="flex justify-between items-center text-xs text-slate-400">
              <span class="uppercase tracking-wider font-bold text-[10px]">Total Storage Used</span>
              <span id="capacity-percentage-label" class="text-emerald-400 font-mono font-bold">0%</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-baseline gap-1.5">
                <span id="label-used-mb" class="text-2xl font-extrabold text-white">0.0</span>
                <span class="text-xs text-slate-500 font-mono">/ <span id="label-total-mb">500</span> MB</span>
              </div>
              <div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div id="storage-progress-bar" class="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500" style="width: 0%"></div>
              </div>
            </div>
          </div>

          <!-- Card 2: Total Document Count -->
          <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
            <div class="text-xs text-slate-400 uppercase tracking-wider font-bold text-[10px]">Tracked Underwriting Files</div>
            <div class="mt-2 flex items-baseline justify-between">
              <span id="label-total-files" class="text-3xl font-extrabold text-white">0</span>
              <span class="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">All Secure</span>
            </div>
          </div>

          <!-- Card 3: Direct File Types Breakdown -->
          <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
            <div class="text-xs text-slate-400 uppercase tracking-wider font-bold text-[10px]">Average Document Size</div>
            <div class="mt-2 flex items-baseline justify-between">
              <span id="label-avg-file-size" class="text-3xl font-extrabold text-indigo-400">0.0 MB</span>
              <span class="text-[10px] text-slate-500 font-mono">Normalized</span>
            </div>
          </div>

          <!-- Card 4: Total Accesses / Downloads -->
          <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
            <div class="text-xs text-slate-400 uppercase tracking-wider font-bold text-[10px]">Underwriting Audits</div>
            <div class="mt-2 flex items-baseline justify-between">
              <span id="label-total-downloads" class="text-3xl font-extrabold text-white">0</span>
              <span class="text-[11px] text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded">Realtime</span>
            </div>
          </div>
        </div>

        <!-- Split Grid: Left (List & Search Controls), Right (Live Analytics Donut & Operations) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Managed Document Table Block -->
          <div class="lg:col-span-2 bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 class="font-bold text-sm text-white uppercase tracking-wider">Storage Repository</h3>
              
              <!-- Filter Options -->
              <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg">
                <button data-filter="All" class="btn-storage-filter px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors bg-indigo-500 text-white">All</button>
                <button data-filter="PDF Document" class="btn-storage-filter px-2.5 py-1 text-[10px] font-bold rounded-md text-slate-400 hover:text-white transition-colors">PDFs</button>
                <button data-filter="Archive Zip" class="btn-storage-filter px-2.5 py-1 text-[10px] font-bold rounded-md text-slate-400 hover:text-white transition-colors">Archives</button>
                <button data-filter="Spreadsheet" class="btn-storage-filter px-2.5 py-1 text-[10px] font-bold rounded-md text-slate-400 hover:text-white transition-colors">Sheets</button>
              </div>
            </div>

            <!-- Search Field -->
            <div class="relative">
              <input type="text" id="storage-search-input" placeholder="Search by document title or target lender..." class="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all">
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
            </div>

            <!-- File Listings Container -->
            <div class="space-y-2 max-h-[420px] overflow-y-auto no-scrollbar" id="file-listings-container">
              <!-- Dynamically populated files -->
            </div>
          </div>

          <!-- Right Sidebar: Interactive Donut & Activity Tracker -->
          <div class="space-y-6">
            <!-- Dynamic Vector Donut Chart visualization -->
            <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-4 flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-xs text-white uppercase tracking-wider">Space Distribution</h3>
                <span class="text-[10px] text-slate-500 font-mono">Dynamic Vectors</span>
              </div>

              <!-- Inline Dynamic SVG Chart -->
              <div class="flex items-center justify-center py-4 relative">
                <svg width="160" height="160" viewBox="0 0 160 160" class="transform -rotate-90">
                  <circle cx="80" cy="80" r="55" fill="transparent" stroke="#0f0f15" stroke-width="12"/>
                  <!-- Base Indigo segment -->
                  <circle id="donut-segment-indigo" cx="80" cy="80" r="55" fill="transparent" stroke="#6366f1" stroke-width="12" stroke-dasharray="345.5" stroke-dashoffset="345.5" class="transition-all duration-1000"/>
                  <!-- Base Emerald segment -->
                  <circle id="donut-segment-emerald" cx="80" cy="80" r="55" fill="transparent" stroke="#10b981" stroke-width="12" stroke-dasharray="345.5" stroke-dashoffset="345.5" class="transition-all duration-1000"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span id="donut-center-label" class="text-lg font-black text-white">0%</span>
                  <span class="text-[9px] text-slate-500 uppercase font-semibold">Allocated</span>
                </div>
              </div>

              <!-- Chart Legends -->
              <div class="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-900 pt-3">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span class="text-slate-400">PDFs / Zip Packages</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span class="text-slate-400">Spreadsheets</span>
                </div>
              </div>
            </div>

            <!-- Flow Underwriting Handshake Logs -->
            <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-xs text-white uppercase tracking-wider">Live System Logs</h3>
                <span class="flex h-2 w-2 rounded-full bg-emerald-400 node-pulse"></span>
              </div>
              <div class="space-y-3 text-[11px] max-h-[220px] overflow-y-auto no-scrollbar" id="logs-container">
                <!-- Log entries populates here -->
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    // Hook up dynamic interface events
    document.getElementById('btn-simulate-upload').addEventListener('click', simulateFileUploadAction);
    document.getElementById('btn-purge-dashboard').addEventListener('click', purgeSystemLogs);
    document.getElementById('storage-search-input').addEventListener('input', handleSearchChange);

    // Filter selectors implementation
    const filterButtons = document.querySelectorAll('.btn-storage-filter');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('bg-indigo-500', 'text-white'));
        filterButtons.forEach(b => b.classList.add('text-slate-400', 'hover:text-white'));
        btn.classList.add('bg-indigo-500', 'text-white');
        btn.classList.remove('text-slate-400', 'hover:text-white');

        state.activeFilter = btn.getAttribute('data-filter');
        updateDashboardUI();
      });
    });
  }

  // Core Render Updates Loop
  function updateDashboardUI() {
    renderFileItems();
    renderSystemLogs();
    calculateAndRenderMetrics();
  }

  function renderFileItems() {
    const listContainer = document.getElementById('file-listings-container');
    if (!listContainer) return;

    // Filter elements
    let filteredFiles = state.files.filter(file => {
      // Type matching
      if (state.activeFilter !== "All" && file.type !== state.activeFilter) return false;

      // Text query matching
      if (state.searchQuery) {
        const matchesName = file.name.toLowerCase().includes(state.searchQuery);
        const matchesLender = file.associatedLender.toLowerCase().includes(state.searchQuery);
        const matchesOwner = file.uploadedBy.toLowerCase().includes(state.searchQuery);
        if (!matchesName && !matchesLender && !matchesOwner) return false;
      }
      return true;
    });

    if (filteredFiles.length === 0) {
      listContainer.innerHTML = `
        <div class="text-center py-10 border border-dashed border-slate-800 rounded-lg">
          <p class="text-xs text-slate-500">No matching files stored in the analytics node.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filteredFiles.map(file => {
      let iconColorClass = "text-indigo-400 bg-indigo-500/10";
      let formatIcon = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      `;

      if (file.type === "Archive Zip") {
        iconColorClass = "text-amber-400 bg-amber-500/10";
        formatIcon = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        `;
      } else if (file.type === "Spreadsheet") {
        iconColorClass = "text-emerald-400 bg-emerald-500/10";
        formatIcon = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
      }

      return `
        <div class="bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg ${iconColorClass} flex items-center justify-center shrink-0">
              ${formatIcon}
            </div>
            <div>
              <h4 class="text-xs font-bold text-white max-w-[280px] truncate">${file.name}</h4>
              <div class="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                <span class="font-mono">${file.size} MB</span>
                <span>•</span>
                <span>Lender: <span class="text-indigo-400">${file.associatedLender}</span></span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between w-full sm:w-auto gap-4">
            <div class="text-right hidden md:block">
              <span class="text-[9px] text-slate-500 block uppercase">Uploaded By</span>
              <span class="text-[10px] font-semibold text-slate-300">${file.uploadedBy}</span>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="window.simulateFileDownload('${file.id}')" class="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors" title="Download Document">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button onclick="window.removeDashboardFile('${file.id}')" class="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded transition-colors" title="Delete Archive">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderSystemLogs() {
    const logsContainer = document.getElementById('logs-container');
    if (!logsContainer) return;

    if (state.logs.length === 0) {
      logsContainer.innerHTML = `
        <p class="text-xs text-slate-600 text-center py-4">Logs cleared.</p>
      `;
      return;
    }

    logsContainer.innerHTML = state.logs.map(log => `
      <div class="flex items-start gap-2 border-b border-slate-900/60 pb-2">
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0"></span>
        <div class="space-y-0.5">
          <p class="text-slate-300 leading-normal">${log.event}</p>
          <span class="text-[9px] text-slate-500 font-mono block">${log.time}</span>
        </div>
      </div>
    `).join('');
  }

  function calculateAndRenderMetrics() {
    // Calculative reductions
    const usedMB = parseFloat(state.files.reduce((acc, f) => acc + f.size, 0).toFixed(1));
    const totalFiles = state.files.length;
    const avgSize = totalFiles > 0 ? (usedMB / totalFiles).toFixed(1) : "0.0";
    const totalDowns = state.files.reduce((acc, f) => acc + f.downloads, 0);
    const capacityPercent = Math.min(Math.round((usedMB / state.totalCapacity) * 100), 100);

    // Update Counter values
    const usedMbLabel = document.getElementById('label-used-mb');
    const totalFilesLabel = document.getElementById('label-total-files');
    const avgSizeLabel = document.getElementById('label-avg-file-size');
    const totalDownsLabel = document.getElementById('label-total-downloads');
    const progressEl = document.getElementById('storage-progress-bar');
    const percentLabel = document.getElementById('capacity-percentage-label');

    if (usedMbLabel) usedMbLabel.textContent = usedMB.toLocaleString();
    if (totalFilesLabel) totalFilesLabel.textContent = totalFiles;
    if (avgSizeLabel) avgSizeLabel.textContent = `${avgSize} MB`;
    if (totalDownsLabel) totalDownsLabel.textContent = totalDowns;
    if (progressEl) progressEl.style.width = `${capacityPercent}%`;
    if (percentLabel) percentLabel.textContent = `${capacityPercent}%`;

    // Dynamic SVG Segment calculations for Circular Chart representation
    const totalCircumference = 345.5; // Calculated circle radius metric path
    const donutIndigo = document.getElementById('donut-segment-indigo');
    const donutEmerald = document.getElementById('donut-segment-emerald');
    const donutCenterText = document.getElementById('donut-center-label');

    if (donutIndigo && donutEmerald && donutCenterText) {
      // Calculate fraction ratios
      const zipPdfFiles = state.files.filter(f => f.type === "PDF Document" || f.type === "Archive Zip");
      const zipPdfTotalSize = zipPdfFiles.reduce((acc, f) => acc + f.size, 0);

      const sheetFiles = state.files.filter(f => f.type === "Spreadsheet");
      const sheetsTotalSize = sheetFiles.reduce((acc, f) => acc + f.size, 0);

      const zipPdfPercent = usedMB > 0 ? (zipPdfTotalSize / usedMB) : 0;
      const sheetsPercent = usedMB > 0 ? (sheetsTotalSize / usedMB) : 0;

      // Map percentages into Circle dash Array
      const allocatedDashPercent = (usedMB / state.totalCapacity);
      donutCenterText.textContent = `${capacityPercent}%`;

      const indigoStrokeVal = totalCircumference - (totalCircumference * allocatedDashPercent * zipPdfPercent);
      const emeraldStrokeVal = totalCircumference - (totalCircumference * allocatedDashPercent * sheetsPercent);

      // Render dash offset properties smoothly
      donutIndigo.style.strokeDashoffset = isNaN(indigoStrokeVal) ? totalCircumference : indigoStrokeVal;
      donutEmerald.style.strokeDashoffset = isNaN(emeraldStrokeVal) ? totalCircumference : emeraldStrokeVal;
    }
  }

  // Simulator: Simulate new file generation workflow
  function simulateFileUploadAction() {
    const randomLenders = [
      "Apex Bridge Private Capital",
      "Lumina private Funding Group",
      "Veritas Commercial Trust",
      "Vanguard Direct Private Credit",
      "Beacon Hill Private Credit"
    ];
    const documentNames = [
      "Escrow_Instruction_Complete.zip",
      "Environmental_Audit_Scope.pdf",
      "LIDAR_Property_Review_S7.pdf",
      "Borrower_Liquidity_Statements.xlsx",
      "Title_Deed_Verification_Final.pdf"
    ];
    const fileTypes = ["Archive Zip", "PDF Document", "PDF Document", "Spreadsheet", "PDF Document"];

    // Random choice generators
    const idx = Math.floor(Math.random() * documentNames.length);
    const chosenLender = randomLenders[Math.floor(Math.random() * randomLenders.length)];
    const randomSize = parseFloat((Math.random() * 45 + 2).toFixed(1));

    const newFile = {
      id: `file-sim-${Date.now()}`,
      name: documentNames[idx],
      size: randomSize,
      type: fileTypes[idx],
      uploadedBy: "Simulated Agent",
      associatedLender: chosenLender,
      timestamp: "Just now",
      downloads: 0,
      status: "Scanned",
      color: "indigo"
    };

    // Update state collections
    state.files.unshift(newFile);
    state.logs.unshift({
      id: Date.now(),
      event: `Direct file upload: ${newFile.name} (${newFile.size} MB) routed to secure node.`,
      time: "Just now",
      type: "upload"
    });

    updateDashboardUI();

    if (window.showToast) {
      window.showToast("File uploaded and scanned securely!");
    }
  }

  // Download simulation trigger
  window.simulateFileDownload = function(fileId) {
    const file = state.files.find(f => f.id === fileId);
    if (!file) return;

    file.downloads += 1;
    state.logs.unshift({
      id: Date.now(),
      event: `Simulated download action: ${file.name} checked out from node server.`,
      time: "Just now",
      type: "download"
    });

    updateDashboardUI();

    if (window.showToast) {
      window.showToast(`Downloading: ${file.name}`);
    }
  };

  // Remove elements simulation
  window.removeDashboardFile = function(fileId) {
    const fileIndex = state.files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;

    const file = state.files[fileIndex];
    state.files.splice(fileIndex, 1);

    state.logs.unshift({
      id: Date.now(),
      event: `File purged: Removed ${file.name} to free repository space.`,
      time: "Just now",
      type: "purge"
    });

    updateDashboardUI();

    if (window.showToast) {
      window.showToast("Attachment successfully deleted.");
    }
  };

  function purgeSystemLogs() {
    state.logs = [];
    updateDashboardUI();

    if (window.showToast) {
      window.showToast("Activity audit logs wiped successfully.");
    }
  }

  function handleSearchChange(e) {
    state.searchQuery = e.target.value.toLowerCase();
    renderFileItems();
  }

})();