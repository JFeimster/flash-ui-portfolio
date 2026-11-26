// PRISM LOGIC // Workspace & Transfer Dashboard Engine v2.4
// Centralized state, interactive data visualizers, and simulation engines

(function() {
  // --- MOCK DATABASE STATE ---
  const CONFIG = {
    totalStorage: 15.0, // GB
    initialUsedStorage: 4.28, // GB
    maxFilesAllowed: 250,
  };

  let state = {
    usedStorage: CONFIG.initialUsedStorage,
    activeTransfers: [
      {
        id: "TRX-401",
        name: "Lumina_Trust_NY_Portfolio_Underwriting.zip",
        size: "342.8 MB",
        progress: 68,
        speed: "14.2 MB/s",
        eta: "8s",
        recipient: "Lumina Trust Direct",
        status: "transmitting",
        type: "archive"
      },
      {
        id: "TRX-402",
        name: "Apex_Prism_CA_Multifamily_Appraisal.pdf",
        size: "48.5 MB",
        progress: 92,
        speed: "8.1 MB/s",
        eta: "1s",
        recipient: "Apex Prism Capital",
        status: "transmitting",
        type: "document"
      },
      {
        id: "TRX-403",
        name: "Obsidian_TX_Industrial_Capital_Stack.xlsx",
        size: "12.4 MB",
        progress: 100,
        speed: "0.0 MB/s",
        eta: "Complete",
        recipient: "Obsidian Funding Group",
        status: "completed",
        type: "spreadsheet"
      }
    ],
    bundles: [
      {
        id: "BND-902",
        name: "CA Commercial Rehab Package",
        filesCount: 14,
        totalSize: "1.2 GB",
        created: "2 hours ago",
        status: "Active",
        downloads: 24,
        security: "AES-256",
        expiration: "12 days left"
      },
      {
        id: "BND-901",
        name: "Texas Multi-Family Expansion Stack",
        filesCount: 8,
        totalSize: "450.2 MB",
        created: "1 day ago",
        status: "Active",
        downloads: 12,
        security: "Spectral Key",
        expiration: "28 days left"
      },
      {
        id: "BND-900",
        name: "Florida Residential Portfolio Audit",
        filesCount: 22,
        totalSize: "2.1 GB",
        created: "5 days ago",
        status: "Archived",
        downloads: 89,
        security: "Multi-Factor",
        expiration: "Expired"
      }
    ],
    activities: [
      {
        id: "ACT-501",
        user: "Apex Prism Capital (Underwriting Node)",
        action: "downloaded",
        item: "CA_Multifamily_Appraisal.pdf",
        timestamp: "Just now",
        statusColor: "text-prism-green"
      },
      {
        id: "ACT-502",
        user: "Lumina Trust Direct",
        action: "previewed",
        item: "NY_Portfolio_Underwriting.zip (Manifest)",
        timestamp: "3 minutes ago",
        statusColor: "text-prism-blue"
      },
      {
        id: "ACT-503",
        user: "Obsidian Funding Group",
        action: "unlocked",
        item: "TX_Industrial_Capital_Stack.xlsx",
        timestamp: "12 minutes ago",
        statusColor: "text-prism-yellow"
      },
      {
        id: "ACT-504",
        user: "Vertex Credit Trust",
        action: "failed security handshake",
        item: "Proprietary_Rehab_Matrix.xlsx",
        timestamp: "1 hour ago",
        statusColor: "text-prism-red"
      }
    ]
  };

  // --- COMPONENT RENDER ENGINE ---
  function initDashboard() {
    const root = document.getElementById('prism-dashboard-root');
    if (!root) {
      console.warn("PRISM Core: '#prism-dashboard-root' not found in DOM. Dynamic generation initiated on placeholder or fallbacks.");
      return;
    }

    // Build layout skeleton inside container
    root.className = "space-y-8 w-full max-w-7xl mx-auto py-2 px-1";
    root.innerHTML = `
      <!-- TOP STATUS ROW: STORAGE & DATA MODES -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Storage Capacity Monitor (Left) -->
        <div class="lg:col-span-4 prism-glass p-6 rounded-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div class="absolute top-0 right-0 p-3 font-mono text-[9px] text-white/10">// SECTOR_ALLOC_METRIC</div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono tracking-widest text-prism-blue uppercase font-bold">Storage Core</span>
              <span class="text-[10px] font-mono bg-prism-blue/10 text-prism-blue px-2 py-0.5 rounded border border-prism-blue/20">Secured</span>
            </div>
            
            <div>
              <div class="flex items-baseline space-x-1.5">
                <span id="storage-used-val" class="text-3xl font-black text-white font-mono">4.28</span>
                <span class="text-white/40 text-xs font-mono">/ 15.00 GB USED</span>
              </div>
              <p class="text-white/50 text-xs mt-1 leading-relaxed">Encrypted cloud indexing for rapid underwriter transmissions.</p>
            </div>
            
            <!-- Dynamic Storage Bar -->
            <div class="space-y-2">
              <div class="w-full bg-black/40 h-2 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div id="storage-progress-bar" class="h-full bg-gradient-to-r from-prism-blue to-prism-purple rounded-full transition-all duration-1000" style="width: 28.5%;"></div>
              </div>
              <div class="flex justify-between text-[10px] font-mono text-white/40">
                <span>SYSTEM HEALTH: NOMINAL</span>
                <span id="storage-percent-label">28.5% CAPACITY</span>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-white/5 mt-4 flex items-center justify-between text-xs font-mono">
            <span class="text-white/40">BANDWIDTH LIMIT</span>
            <span class="text-prism-green font-bold">UNLIMITED / DIRECT</span>
          </div>
        </div>

        <!-- Transfer Network Modulation Live Canvas (Right) -->
        <div class="lg:col-span-8 prism-glass p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div class="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-black/60 px-3 py-1 rounded-full border border-white/10">
            <span class="w-1.5 h-1.5 rounded-full bg-prism-blue animate-ping"></span>
            <span class="text-[9px] font-mono text-white/60 uppercase tracking-widest">Spectral Transmission Stream</span>
          </div>

          <div class="space-y-2 z-10 relative pointer-events-none mb-4">
            <span class="text-[10px] font-mono tracking-widest text-prism-red uppercase font-bold">Secure Routing Hub</span>
            <h3 class="text-lg font-bold text-white tracking-tight uppercase">Data Handshake Visualizer</h3>
            <p class="text-white/50 text-xs max-w-md">Real-time light pulse modulation representing verified file routing to designated underwriting endpoints.</p>
          </div>

          <div class="h-[120px] relative w-full border border-white/5 bg-black/30 rounded-xl overflow-hidden mb-4">
            <canvas id="transferNetworkCanvas" class="absolute inset-0 w-full h-full"></canvas>
          </div>

          <div class="flex items-center justify-between text-[10px] font-mono text-white/40 z-10 relative">
            <div>NODE CORRELATION MATRIX [S-401 -> APEX]</div>
            <div class="text-prism-blue">FLOW METRICS DETECTED: 22.3 MB/s</div>
          </div>
        </div>

      </div>

      <!-- MAIN MIDDLE GRID: ACTIVE TRANSFERS & LIVE ACTIVTY FEED -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Active File Transmissions (Left) -->
        <div class="lg:col-span-7 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-prism-blue status-pulse"></span>
              <h3 class="text-sm font-bold uppercase tracking-wider font-mono text-white">Active Transmissions</h3>
            </div>
            <button id="btn-trigger-upload" class="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono transition flex items-center gap-1.5">
              <span>+ STAGE NEW FILE</span>
            </button>
          </div>

          <div id="active-transfers-container" class="space-y-4">
            <!-- Rendered via JS -->
          </div>
        </div>

        <!-- Live Recipient Feed (Right) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-prism-yellow"></span>
              <h3 class="text-sm font-bold uppercase tracking-wider font-mono text-white">Handshake Activity Feed</h3>
            </div>
            <span class="text-[10px] font-mono text-white/30 uppercase">Live Updates</span>
          </div>

          <div class="prism-glass p-5 rounded-2xl border border-white/10 relative overflow-hidden">
            <div id="live-feed-container" class="space-y-4 max-h-[365px] overflow-y-auto pr-1">
              <!-- Rendered via JS -->
            </div>
          </div>
        </div>

      </div>

      <!-- RECENT BUNDLES & SECURE ASSET WRAPPERS -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-prism-purple"></span>
            <h3 class="text-sm font-bold uppercase tracking-wider font-mono text-white">Active Attachment Bundles</h3>
          </div>
          <span class="text-[10px] font-mono text-white/30">Total: 3 Indexes</span>
        </div>

        <div id="bundles-grid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Rendered via JS -->
        </div>
      </div>
    `;

    // Hook listeners
    document.getElementById('btn-trigger-upload').addEventListener('click', stageNewMockFile);

    // Initial Sub-renders
    renderActiveTransfers();
    renderLiveFeed();
    renderBundles();
    updateStorageEngine();

    // Start live simulation loop
    startSimulation();

    // Initialize the canvas network visualizer
    initNetworkCanvas();
  }

  // --- DYNAMIC SUB-RENDERERS ---

  function renderActiveTransfers() {
    const container = document.getElementById('active-transfers-container');
    if (!container) return;

    if (state.activeTransfers.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 bg-prism-charcoal/40 rounded-2xl border border-white/5 p-6">
          <p class="text-xs text-white/40 font-mono">// NO ACTIVE TRANSMISSIONS PRESENT</p>
        </div>
      `;
      return;
    }

    container.innerHTML = state.activeTransfers.map(t => {
      const isComplete = t.progress >= 100;
      const progressPercentStr = t.progress.toFixed(0) + '%';
      
      let typeIcon = "file";
      if (t.type === "archive") typeIcon = "package";
      if (t.type === "document") typeIcon = "file-text";
      if (t.type === "spreadsheet") typeIcon = "table";

      return `
        <div class="prism-glass p-5 rounded-2xl relative overflow-hidden transition-all duration-300 border border-white/10 hover:border-white/20">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div class="flex items-start space-x-3.5 min-w-0 flex-1">
              <div class="p-2.5 rounded-lg bg-white/5 text-prism-blue border border-white/10 flex-shrink-0">
                <span class="font-mono text-xs uppercase font-bold text-center block w-6">${t.type.slice(0, 3)}</span>
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="text-xs font-bold text-white truncate uppercase font-mono">${t.name}</h4>
                <div class="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[10px] font-mono text-white/40">
                  <span>SIZE: ${t.size}</span>
                  <span>RECIPIENT: <strong class="text-white/70">${t.recipient}</strong></span>
                </div>
              </div>
            </div>

            <!-- Specs & Progress Block -->
            <div class="w-full md:w-auto flex flex-col md:items-end justify-between gap-1.5 flex-shrink-0">
              <div class="flex justify-between md:justify-end items-center gap-3 text-[10px] font-mono">
                ${isComplete ? `
                  <span class="text-prism-green font-bold">// SECURED NODE HANDSHAKE</span>
                ` : `
                  <span class="text-white/40">SPEED: <strong class="text-white/80">${t.speed}</strong></span>
                  <span class="text-white/40">ETA: <strong class="text-prism-blue">${t.eta}</strong></span>
                `}
                <span class="text-white font-bold ml-1">${progressPercentStr}</span>
              </div>

              <!-- Bar indicators -->
              <div class="w-full md:w-48 bg-black/40 h-1.5 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div class="h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-prism-green' : 'bg-prism-blue'}" style="width: ${t.progress}%;"></div>
              </div>
            </div>

            <!-- Action Controllers -->
            <div class="flex items-center justify-end space-x-2 border-t border-white/5 md:border-t-0 pt-2 md:pt-0">
              ${isComplete ? `
                <button onclick="PrismDashboard.archiveTransfer('${t.id}')" class="p-1.5 rounded bg-white/5 border border-white/10 text-white/60 hover:text-white text-[10px] font-mono tracking-wider uppercase">
                  Archive
                </button>
              ` : `
                <button onclick="PrismDashboard.cancelTransfer('${t.id}')" class="p-1.5 rounded bg-prism-red/10 border border-prism-red/20 text-prism-red hover:bg-prism-red/20 text-[10px] font-mono tracking-wider uppercase">
                  Abort
                </button>
              `}
            </div>

          </div>
        </div>
      `;
    }).join('');
  }

  function renderLiveFeed() {
    const container = document.getElementById('live-feed-container');
    if (!container) return;

    container.innerHTML = state.activities.map(act => `
      <div class="flex items-start space-x-3 text-xs border-b border-white/5 pb-3 last:border-0 last:pb-0 font-mono">
        <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 status-pulse bg-prism-blue"></span>
        <div class="flex-1 min-w-0">
          <p class="text-white/80 leading-relaxed text-[11px]">
            <span class="text-white font-bold">${act.user}</span> 
            <span class="text-white/40 font-light italic">${act.action}</span> 
            <span class="text-prism-blue font-semibold">${act.item}</span>
          </p>
          <span class="text-[9px] text-white/30 block mt-0.5">${act.timestamp}</span>
        </div>
      </div>
    `).join('');
  }

  function renderBundles() {
    const grid = document.getElementById('bundles-grid');
    if (!grid) return;

    grid.innerHTML = state.bundles.map(b => {
      const isExpired = b.expiration === "Expired";
      return `
        <div class="prism-glass p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] border border-white/10 hover:border-prism-purple/30">
          
          <div class="absolute top-0 right-0 p-3 font-mono text-[9px] text-white/15">
            ${b.id}
          </div>

          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <span class="text-[9px] bg-prism-purple/10 border border-prism-purple/20 text-prism-purple px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                ${b.security} Protocol
              </span>
              <span class="text-[9px] bg-white/5 border border-white/5 text-white/50 px-1.5 py-0.5 rounded font-mono">
                ${b.filesCount} Files
              </span>
            </div>

            <div>
              <h4 class="text-xs font-bold text-white uppercase tracking-tight font-mono">${b.name}</h4>
              <p class="text-[11px] font-mono text-white/40 mt-1">TOTAL SPACE INDEXED: ${b.totalSize}</p>
            </div>

            <!-- Bundle Metadata Metrics -->
            <div class="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 font-mono text-[10px]">
              <div>
                <span class="text-white/30 block">TRANSMISSIONS</span>
                <span class="font-bold text-white text-xs">${b.downloads} Nodes</span>
              </div>
              <div>
                <span class="text-white/30 block">LIFESPAN MATRIX</span>
                <span class="font-bold ${isExpired ? 'text-prism-red' : 'text-prism-green'} text-xs">${b.expiration}</span>
              </div>
            </div>
          </div>

          <div class="pt-5 mt-4 border-t border-white/5 flex gap-2">
            <button onclick="PrismDashboard.generateBundleLink('${b.id}')" class="flex-1 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] py-2 rounded-lg border border-white/10 transition uppercase">
              Handshake URL
            </button>
            <button onclick="PrismDashboard.inspectBundle('${b.id}')" class="px-3 bg-prism-purple/10 hover:bg-prism-purple/20 text-prism-purple font-mono text-[10px] py-2 rounded-lg border border-prism-purple/20 transition uppercase">
              Inspect
            </button>
          </div>

        </div>
      `;
    }).join('');
  }

  function updateStorageEngine() {
    const storageUsedVal = document.getElementById('storage-used-val');
    const storageBar = document.getElementById('storage-progress-bar');
    const storagePercentLabel = document.getElementById('storage-percent-label');

    if (!storageUsedVal || !storageBar || !storagePercentLabel) return;

    const percentUsed = (state.usedStorage / CONFIG.totalStorage) * 100;
    
    storageUsedVal.textContent = state.usedStorage.toFixed(2);
    storagePercentLabel.textContent = percentUsed.toFixed(1) + "% CAPACITY";
    storageBar.style.width = percentUsed.toFixed(1) + "%";
  }

  // --- ACTIONS & UTILITIES ---

  window.PrismDashboard = {
    cancelTransfer: function(id) {
      state.activeTransfers = state.activeTransfers.filter(t => t.id !== id);
      renderActiveTransfers();
      addActivityLog("System protocol aborted transmission sequence.", `TransID ${id}`, "text-prism-red");
    },
    
    archiveTransfer: function(id) {
      const match = state.activeTransfers.find(t => t.id === id);
      if (match) {
        // Increment Storage
        const estimatedSizeGb = parseFloat(match.size) / 1024; // assume MB
        state.usedStorage += estimatedSizeGb;
        if (state.usedStorage > CONFIG.totalStorage) {
          state.usedStorage = CONFIG.totalStorage;
        }
        
        // Add to active bundles
        const newBundle = {
          id: `BND-${900 + state.bundles.length + 1}`,
          name: match.name.replace(/\.[^/.]+$/, ""),
          filesCount: 1,
          totalSize: match.size,
          created: "Just now",
          status: "Active",
          downloads: 0,
          security: "SHA-512 Hash",
          expiration: "30 days left"
        };
        state.bundles.unshift(newBundle);
        
        // Remove transfer
        state.activeTransfers = state.activeTransfers.filter(t => t.id !== id);
        
        renderActiveTransfers();
        renderBundles();
        updateStorageEngine();
        
        addActivityLog(`System Node`, `archived file array into index directory`, "text-prism-blue");
      }
    },

    generateBundleLink: function(id) {
      alert(`PRISM SECURE TUNNEL GENERATED:\nhttps://prism.logic/handshake-portal?sec_token=bnd_${id}_${Math.random().toString(36).substring(4)}`);
    },

    inspectBundle: function(id) {
      const bundle = state.bundles.find(b => b.id === id);
      if (bundle) {
        alert(`INDEX DETAILS - ID: ${bundle.id}\nPackage Focus: ${bundle.name}\nTotal Footprint: ${bundle.totalSize}\nHandshake Access Matrix: ${bundle.security}`);
      }
    }
  };

  function addActivityLog(user, action, statusColor = "text-prism-blue", item = "") {
    const newAct = {
      id: `ACT-${500 + state.activities.length + 1}`,
      user: user,
      action: action,
      item: item,
      timestamp: "Just now",
      statusColor: statusColor
    };
    state.activities.unshift(newAct);
    // keep stack clean
    if (state.activities.length > 15) {
      state.activities.pop();
    }
    renderLiveFeed();
  }

  function stageNewMockFile() {
    const files = [
      { name: "Sovereign_Industrial_LTV_Report.pdf", size: "18.2 MB", recipient: "Obsidian Funding Group", type: "document" },
      { name: "Vertex_FixFlip_Asset_Verification.xlsx", size: "8.4 MB", recipient: "Vertex Credit Trust", type: "spreadsheet" },
      { name: "Core_Redev_Draw_Milestone_Archive.zip", size: "512.6 MB", recipient: "Horizon Construction Finance", type: "archive" }
    ];

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const newTxId = `TRX-${400 + state.activeTransfers.length + 1}`;
    
    // Check if duplicate already active
    if (state.activeTransfers.some(t => t.name === randomFile.name)) {
      alert("Encryption Engine Warning: System already running verification sequence on identical hash array.");
      return;
    }

    state.activeTransfers.unshift({
      id: newTxId,
      name: randomFile.name,
      size: randomFile.size,
      progress: 0,
      speed: "12.5 MB/s",
      eta: "Calculating...",
      recipient: randomFile.recipient,
      status: "transmitting",
      type: randomFile.type
    });

    renderActiveTransfers();
    addActivityLog(`Local Server Terminal`, `staged transmission queue for`, "text-prism-yellow", randomFile.name);
  }

  // --- LIVE PROGRESS SIMULATION LOOP ---
  function startSimulation() {
    setInterval(() => {
      let changed = false;

      // Update transfer progress
      state.activeTransfers.forEach(t => {
        if (t.progress < 100) {
          const inc = Math.floor(Math.random() * 8) + 4;
          t.progress += inc;
          if (t.progress >= 100) {
            t.progress = 100;
            t.speed = "0.0 MB/s";
            t.eta = "Complete";
            addActivityLog(t.recipient, `validated total integrity sequence for`, "text-prism-green", t.name);
          } else {
            // Randomize speed/eta fluctuation slightly
            const floatSpeed = (8.0 + Math.random() * 8.0).toFixed(1);
            t.speed = `${floatSpeed} MB/s`;
            
            const totalMb = parseFloat(t.size);
            const remainingMb = totalMb * (1 - (t.progress / 100));
            const estSeconds = Math.ceil(remainingMb / parseFloat(floatSpeed));
            t.eta = estSeconds > 0 ? `${estSeconds}s` : "1s";
          }
          changed = true;
        }
      });

      if (changed) {
        renderActiveTransfers();
      }

      // Occassionally trigger simulated incoming node activity from lenders
      if (Math.random() < 0.12) {
        const randomLenders = [
          "Apex Prism Capital Node [CA]",
          "Lumina Trust Underwriter [NY]",
          "Obsidian Funding Node [TX]",
          "Vertex Credit Handshake Gateway [CO]",
          "Delta Real Estate Yield Node"
        ];
        const randomActions = [
          "downloaded", "unlocked secure envelope", "verified hash block", "previewed assets"
        ];
        const randomItems = [
          "CA_Multifamily_Appraisal.pdf",
          "NY_Portfolio_Underwriting.zip",
          "TX_Industrial_Stack.xlsx",
          "Sovereign_Industrial_LTV_Report.pdf",
          "Proprietary_Rehab_Matrix.xlsx"
        ];

        const rLender = randomLenders[Math.floor(Math.random() * randomLenders.length)];
        const rAction = randomActions[Math.floor(Math.random() * randomActions.length)];
        const rItem = randomItems[Math.floor(Math.random() * randomItems.length)];

        addActivityLog(rLender, rAction, "text-prism-blue", rItem);
      }

    }, 2800);
  }

  // --- CANVAS VISUALIZER CODE ---
  function initNetworkCanvas() {
    const canvas = document.getElementById('transferNetworkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Node objects representing server & destination points
    const hubNode = { x: canvas.width * 0.15, y: canvas.height * 0.5, radius: 6, label: "LOCAL SYSTEM HASH" };
    
    const targets = [
      { x: canvas.width * 0.5, y: canvas.height * 0.25, radius: 4, label: "LUMINA_NODE", active: true },
      { x: canvas.width * 0.5, y: canvas.height * 0.75, radius: 4, label: "APEX_NODE", active: true },
      { x: canvas.width * 0.85, y: canvas.height * 0.5, radius: 5, label: "OBSIDIAN_CORE", active: false }
    ];

    let pulses = [];

    // Trigger secure beam pulses periodically
    setInterval(() => {
      targets.forEach((target, index) => {
        pulses.push({
          progress: 0,
          speed: 0.012 + Math.random() * 0.008,
          from: hubNode,
          to: target,
          color: index % 2 === 0 ? '#00f0ff' : '#8b5cf6'
        });
      });
    }, 1800);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Canvas background details
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Draw vector connector paths
      targets.forEach(target => {
        ctx.beginPath();
        ctx.moveTo(hubNode.x, hubNode.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw local Hub node
      ctx.beginPath();
      ctx.arc(hubNode.x, hubNode.y, hubNode.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#ff2e93";
      ctx.shadowColor = "#ff2e93";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw targets
      targets.forEach(target => {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fillStyle = target.active ? "#00ff87" : "#ffde43";
        ctx.shadowColor = target.active ? "#00ff87" : "#ffde43";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label metrics
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillText(target.label, target.x - 20, target.y - 10);
      });

      // Draw moving beam transmission pulses
      pulses.forEach((p, index) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          pulses.splice(index, 1);
          return;
        }

        const currentX = p.from.x + (p.to.x - p.from.x) * p.progress;
        const currentY = p.from.y + (p.to.y - p.from.y) * p.progress;

        // Light point
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  // Self Initialization on load
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }

})();