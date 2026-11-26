(function() {
  // Define default staging files (mock assets to make the Composer instantly interactive)
  let stagedFiles = [
    { id: "f-1", name: "Executive_Summary_Lumina_Trust.pdf", size: "4.8 MB", type: "pdf", status: "secured" },
    { id: "f-2", name: "Property_Photos_MultiFamily_CA.zip", size: "28.4 MB", type: "zip", status: "secured" },
    { id: "f-3", name: "Underwriting_Model_v2.4.xlsm", size: "8.9 MB", type: "excel", status: "secured" }
  ];
  
  const MAX_SLOTS = 7;
  let recipients = ["capital@prism.logic", "underwriting@lumina.trust"];
  let expirationTime = "24h";
  let isPasswordLocked = true;
  let currentPassword = generatePasskey();

  // Helper: Generates a high-entropy secure token string
  function generatePasskey() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let token = "PRISM-";
    for (let i = 0; i < 4; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
    token += "-";
    for (let i = 0; i < 4; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
    return token;
  }

  // Inject CSS Styles for extra animations & UI consistency
  const style = document.createElement('style');
  style.textContent = `
    .composer-scroll::-webkit-scrollbar {
      width: 4px;
    }
    .composer-scroll::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
    }
    .composer-scroll::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }
    .composer-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 240, 255, 0.3);
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    .scanner-glow::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 40%, rgba(0, 240, 255, 0.08) 50%, transparent 60%);
      animation: scanline 4s linear infinite;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  // Initialize DOM Components on load
  window.addEventListener('DOMContentLoaded', () => {
    injectComposerTrigger();
    injectComposerMarkup();
  });

  // Inject "Batch File Transfer" trigger button inside Header controls
  function injectComposerTrigger() {
    const headerControls = document.querySelector('header .flex.items-center.space-x-3');
    if (headerControls) {
      const transferBtn = document.createElement('button');
      transferBtn.className = 'relative flex items-center space-x-2 bg-gradient-to-r from-prism-blue/10 to-prism-purple/10 hover:from-prism-blue/20 hover:to-prism-purple/20 text-white text-xs font-semibold py-2 px-3.5 rounded-lg border border-prism-blue/30 transition duration-300';
      transferBtn.innerHTML = `
        <span class="w-1.5 h-1.5 rounded-full bg-prism-blue status-pulse"></span>
        <span class="font-mono tracking-wide">SECURE COMPOSER</span>
      `;
      transferBtn.onclick = openComposer;
      headerControls.insertBefore(transferBtn, headerControls.firstChild);
    }
  }

  // Inject full Composer dashboard markup into body
  function injectComposerMarkup() {
    const overlay = document.createElement('div');
    overlay.id = 'prism-composer-overlay';
    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-prism-black/95 backdrop-blur-xl hidden opacity-0 transition-opacity duration-300 scanner-glow';
    
    overlay.innerHTML = `
      <div class="prism-glass max-w-5xl w-full rounded-2xl border border-prism-blue/25 overflow-hidden flex flex-col h-[90vh] md:h-[80vh] shadow-2xl relative">
        <!-- Rainbow Header Bar -->
        <div class="h-1 w-full bg-gradient-to-r from-[#ff2e93] via-[#00f0ff] to-[#00ff87]"></div>

        <!-- Dashboard Top Navigation -->
        <div class="p-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-black/45">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-[9px] font-mono tracking-[0.3em] text-prism-blue font-semibold uppercase">NODE ACCESS SECURE // ENVELOPE SHARDING</span>
              <span class="text-[8px] bg-prism-green/10 text-prism-green px-1.5 py-0.5 rounded font-mono border border-prism-green/20">FIPS-140-3 ACTIVE</span>
            </div>
            <h2 class="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
              Batch File Transfer Composer
            </h2>
          </div>
          
          <div class="flex items-center space-x-3 w-full sm:w-auto">
            <button onclick="window.PrismComposer.resetComposer()" class="text-xs text-white/40 hover:text-white/80 font-mono transition">
              [ Reset ]
            </button>
            <button onclick="window.PrismComposer.closeComposer()" class="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Dashboard Workspace Grid -->
        <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          <!-- LEFT COLUMN: Staging Dock (7 File Limit) -->
          <div class="lg:col-span-7 p-6 overflow-y-auto composer-scroll border-r border-white/5 bg-prism-black/50 flex flex-col justify-between">
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-xs font-bold text-white uppercase tracking-wider font-mono">Attachment Payload Dock</h3>
                  <p class="text-[11px] text-white/40 font-mono">MAXIMUM STAGING: 7 SEGMENTED DATA SHARDS</p>
                </div>
                <div class="text-right">
                  <span id="staging-counter" class="text-xs font-mono font-bold text-prism-blue">3 / 7 SLOTS</span>
                </div>
              </div>

              <!-- Drag & Drop Zone -->
              <div id="drop-zone" class="border border-dashed border-white/10 hover:border-prism-blue/40 rounded-xl p-6 text-center bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer group">
                <i data-lucide="upload-cloud" class="w-8 h-8 mx-auto text-white/20 group-hover:text-prism-blue transition mb-2"></i>
                <p class="text-xs font-semibold text-white/80 group-hover:text-white">Drag & drop files or click to stage assets</p>
                <p class="text-[10px] text-white/30 font-mono mt-1">Accepts PDF, ZIP, XLSX, JPG, DWG up to 100MB per file</p>
                <input type="file" id="file-input" class="hidden" multiple>
              </div>

              <!-- Staged File Stack -->
              <div id="staged-stack" class="space-y-2.5">
                <!-- Dynamically Rendered Staged File Items -->
              </div>
            </div>

            <!-- Staging Guidelines / System Stats -->
            <div class="pt-6 mt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-white/30">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-prism-green animate-pulse"></span>
                <span>TOTAL WEIGHT: <strong id="total-weight-indicator" class="text-white/60">42.1 MB</strong></span>
              </div>
              <div>
                <span>STATUS: SECURE_STAGING_LOCK</span>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Secure Options & Link Generator -->
          <div class="lg:col-span-5 p-6 overflow-y-auto composer-scroll flex flex-col justify-between space-y-6 bg-prism-charcoal/20">
            
            <div class="space-y-5">
              
              <!-- SECTION 1: Recipient Matrix -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <i data-lucide="users" class="w-3.5 h-3.5 text-prism-blue"></i>
                  Recipient Matrix
                </label>
                <div class="space-y-2">
                  <div class="flex gap-2">
                    <input type="email" id="recipient-input" placeholder="Enter recipient email..." class="flex-1 bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-prism-blue">
                    <button onclick="window.PrismComposer.addRecipient()" class="bg-white/5 border border-white/10 text-white/80 hover:text-white px-3 py-2 rounded-lg text-xs font-mono transition">
                      +
                    </button>
                  </div>
                  <div id="recipient-chips" class="flex flex-wrap gap-1.5">
                    <!-- Dynamic chips -->
                  </div>
                </div>
              </div>

              <!-- SECTION 2: Expiration Timer Settings -->
              <div class="space-y-2 pt-3 border-t border-white/5">
                <label class="block text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <i data-lucide="clock" class="w-3.5 h-3.5 text-prism-yellow"></i>
                  Self-Destruct Matrix
                </label>
                <div class="grid grid-cols-4 gap-2">
                  <button onclick="window.PrismComposer.setExpiration('1h')" id="exp-1h" class="py-2 px-1 text-center font-mono text-[10px] rounded-lg border border-white/5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition">1 HR</button>
                  <button onclick="window.PrismComposer.setExpiration('12h')" id="exp-12h" class="py-2 px-1 text-center font-mono text-[10px] rounded-lg border border-white/5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition">12 HR</button>
                  <button onclick="window.PrismComposer.setExpiration('24h')" id="exp-24h" class="py-2 px-1 text-center font-mono text-[10px] rounded-lg border border-prism-yellow/30 bg-prism-yellow/10 text-prism-yellow font-semibold transition">24 HR</button>
                  <button onclick="window.PrismComposer.setExpiration('7d')" id="exp-7d" class="py-2 px-1 text-center font-mono text-[10px] rounded-lg border border-white/5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition">7 DAYS</button>
                </div>
              </div>

              <!-- SECTION 3: Password Encryption -->
              <div class="space-y-2 pt-3 border-t border-white/5">
                <div class="flex justify-between items-center">
                  <label class="block text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5 text-prism-green"></i>
                    Crypto Key Enforcer
                  </label>
                  <div class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="password-toggle" class="sr-only peer" checked onchange="window.PrismComposer.togglePasswordLock()">
                    <div class="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white/40 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-prism-green/20 peer-checked:after:bg-prism-green"></div>
                  </div>
                </div>

                <div id="password-input-container" class="space-y-1.5 transition duration-300">
                  <div class="relative">
                    <input type="text" id="passkey-input" value="${currentPassword}" class="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 pr-10 text-xs font-mono text-white tracking-widest focus:outline-none focus:border-prism-green">
                    <button onclick="window.PrismComposer.regenerateKey()" title="Regenerate high-entropy key" class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-prism-green">
                      <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                  <span class="text-[9px] font-mono text-white/30 block">Automatic military-grade encryption enforces passkey restriction on payload entry.</span>
                </div>
              </div>

            </div>

            <!-- SECTION 4: Generator Command Console & Link Panel -->
            <div class="space-y-4 pt-4 border-t border-white/5">
              <!-- Live Cryptographic Command Line Console (Hidden by default, shown during build) -->
              <div id="crypto-console" class="hidden p-3 rounded-lg bg-black/60 border border-prism-blue/20 text-[9px] font-mono text-prism-blue space-y-1 h-24 overflow-y-auto composer-scroll">
                <div class="flex items-center justify-between border-b border-prism-blue/10 pb-1 mb-1">
                  <span>// STAGE BUILD CONSOLE</span>
                  <span class="animate-pulse">● CRYPTO_ENGIN_ON</span>
                </div>
                <div id="console-logs">
                  <!-- Realtime appended operations logs -->
                </div>
              </div>

              <!-- Result Download Link Panel (Shown post generation) -->
              <div id="link-result-panel" class="hidden p-3 rounded-xl border border-prism-green/30 bg-prism-green/5 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-[9px] font-mono text-prism-green font-semibold uppercase tracking-wider flex items-center gap-1">
                    <i data-lucide="check-circle" class="w-3 h-3"></i> Package Dispatched Securely
                  </span>
                  <span class="text-[8px] font-mono text-white/40" id="result-expiration">EXPIRES IN: 24h</span>
                </div>
                
                <div class="flex gap-1.5">
                  <input type="text" id="result-link-input" readonly value="https://prism.logic/transfer/shd-773a-4ef8" class="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs font-mono text-white focus:outline-none select-all">
                  <button onclick="window.PrismComposer.copyResultLink()" class="px-3 bg-prism-green text-black font-semibold text-xs rounded-lg hover:brightness-110 transition flex items-center justify-center gap-1.5 font-mono">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                    <span>COPY</span>
                  </button>
                </div>
              </div>

              <!-- Main Secure Generate Button -->
              <button id="generate-trigger-btn" onclick="window.PrismComposer.generateTransferLink()" class="w-full relative overflow-hidden group py-3 rounded-lg bg-gradient-to-r from-prism-blue to-prism-purple text-white hover:brightness-110 font-bold uppercase tracking-widest font-mono text-xs border border-white/20 transition-all flex items-center justify-center gap-2">
                <i data-lucide="lock" class="w-4 h-4"></i>
                <span>Deploy Secure Envelope</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>`;

    document.body.appendChild(overlay);
    
    // Set up native drag-and-drop actions
    setupDragAndDrop();
    
    // Render starting state
    renderStagedFiles();
    renderRecipients();
    
    // Initialize Lucide Icons for dynamic content
    lucide.createIcons();
  }

  // Set up Drag & Drop file zone mechanics
  function setupDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());
      
      fileInput.addEventListener('change', (e) => {
        handleFileSelection(e.target.files);
      });

      // Highlight effects
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropZone.classList.add('border-prism-blue/60', 'bg-white/[0.05]');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropZone.classList.remove('border-prism-blue/60', 'bg-white/[0.05]');
        }, false);
      });

      dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        handleFileSelection(dt.files);
      });
    }
  }

  // Handle incoming file selections
  function handleFileSelection(files) {
    if (!files.length) return;
    
    for (let i = 0; i < files.length; i++) {
      if (stagedFiles.length >= MAX_SLOTS) {
        alert("System at maximum capacity limit. Exceeded maximum of 7 attachment slots.");
        break;
      }

      const file = files[i];
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      
      // Determine simulated extension type
      let type = "unknown";
      if (file.name.endsWith('.pdf')) type = "pdf";
      else if (file.name.endsWith('.zip') || file.name.endsWith('.rar') || file.name.endsWith('.7z')) type = "zip";
      else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xlsm') || file.name.endsWith('.xls')) type = "excel";
      else if (file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) type = "image";

      stagedFiles.push({
        id: `f-${Date.now()}-${i}`,
        name: file.name,
        size: sizeInMB,
        type: type,
        status: "processing"
      });
    }

    renderStagedFiles();
    
    // Simulate encryption sharding process for added items
    stagedFiles.forEach((file) => {
      if (file.status === "processing") {
        setTimeout(() => {
          file.status = "secured";
          renderStagedFiles();
        }, 1200);
      }
    });
  }

  // Render Attachment List
  function renderStagedFiles() {
    const stack = document.getElementById('staged-stack');
    const counter = document.getElementById('staging-counter');
    const weightIndicator = document.getElementById('total-weight-indicator');

    if (!stack) return;

    counter.textContent = `${stagedFiles.length} / ${MAX_SLOTS} SLOTS`;

    // Compute mock total weight dynamically
    let calculatedWeight = stagedFiles.reduce((acc, f) => {
      const val = parseFloat(f.size);
      return acc + (isNaN(val) ? 1.5 : val);
    }, 0).toFixed(1);
    weightIndicator.textContent = `${calculatedWeight} MB`;

    if (stagedFiles.length === 0) {
      stack.innerHTML = `
        <div class="text-center py-8 text-white/25 border border-white/5 bg-black/20 rounded-xl font-mono text-[11px] uppercase">
          [ Document Staging Grid Empty ]
        </div>
      `;
      return;
    }

    stack.innerHTML = stagedFiles.map((file) => {
      let icon = "file";
      let colorClass = "text-white/40";
      
      if (file.type === "pdf") { icon = "file-text"; colorClass = "text-prism-red"; }
      else if (file.type === "zip") { icon = "archive"; colorClass = "text-prism-blue"; }
      else if (file.type === "excel") { icon = "table"; colorClass = "text-prism-green"; }
      else if (file.type === "image") { icon = "image"; colorClass = "text-prism-yellow"; }

      return `
        <div class="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-3 group hover:border-white/10 transition">
          <div class="flex items-center space-x-3 overflow-hidden">
            <div class="p-2 rounded-lg bg-white/5 ${colorClass}">
              <i data-lucide="${icon}" class="w-4.5 h-4.5"></i>
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-semibold text-white truncate font-mono">${file.name}</p>
              <div class="flex items-center gap-2 text-[10px] font-mono text-white/40">
                <span>${file.size}</span>
                <span>•</span>
                ${file.status === "secured" ? `
                  <span class="text-prism-green uppercase tracking-wide flex items-center gap-1">
                    <span class="w-1 h-1 rounded-full bg-prism-green inline-block"></span> Secure Shard
                  </span>
                ` : `
                  <span class="text-prism-blue uppercase tracking-wide flex items-center gap-1 animate-pulse">
                    <span class="w-1 h-1 rounded-full bg-prism-blue inline-block"></span> Sharding...
                  </span>
                `}
              </div>
            </div>
          </div>

          <button onclick="window.PrismComposer.removeStagedFile('${file.id}')" class="p-1 rounded bg-white/5 hover:bg-prism-red/20 text-white/40 hover:text-prism-red transition opacity-0 group-hover:opacity-100">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `;
    }).join('');

    lucide.createIcons();
  }

  // Remove Staged File Node
  function removeStagedFile(id) {
    stagedFiles = stagedFiles.filter(f => f.id !== id);
    renderStagedFiles();
  }

  // Render Recipient Chips
  function renderRecipients() {
    const chipContainer = document.getElementById('recipient-chips');
    if (!chipContainer) return;

    if (recipients.length === 0) {
      chipContainer.innerHTML = `<span class="text-[10px] text-white/30 font-mono">[ Envelope restricted to public key lookup ]</span>`;
      return;
    }

    chipContainer.innerHTML = recipients.map((email, idx) => `
      <span class="inline-flex items-center space-x-1.5 px-2 py-1 bg-prism-blue/10 text-prism-blue text-[10px] font-mono border border-prism-blue/20 rounded">
        <span>${email}</span>
        <button onclick="window.PrismComposer.removeRecipient(${idx})" class="text-prism-blue/60 hover:text-white transition">×</button>
      </span>
    `).join('');
  }

  // Add a recipient validation & check
  function addRecipient() {
    const input = document.getElementById('recipient-input');
    if (!input) return;

    const email = input.value.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      alert("Invalid address sequence. Verification failure.");
      return;
    }

    if (recipients.includes(email)) return;

    recipients.push(email);
    input.value = '';
    renderRecipients();
  }

  // Remove Recipient
  function removeRecipient(index) {
    recipients.splice(index, 1);
    renderRecipients();
  }

  // Toggle Password Lock Box Visibilities
  function togglePasswordLock() {
    const isChecked = document.getElementById('password-toggle').checked;
    const container = document.getElementById('password-input-container');
    isPasswordLocked = isChecked;

    if (isChecked) {
      container.classList.remove('opacity-40', 'pointer-events-none');
    } else {
      container.classList.add('opacity-40', 'pointer-events-none');
    }
  }

  // Regenerate Passkey
  function regenerateKey() {
    currentPassword = generatePasskey();
    const input = document.getElementById('passkey-input');
    if (input) input.value = currentPassword;
  }

  // Set Expiration Matrix option state
  function setExpiration(val) {
    expirationTime = val;
    const ids = ['exp-1h', 'exp-12h', 'exp-24h', 'exp-7d'];
    ids.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        if (id === `exp-${val}`) {
          btn.className = "py-2 px-1 text-center font-mono text-[10px] rounded-lg border border-prism-yellow/30 bg-prism-yellow/10 text-prism-yellow font-semibold transition";
        } else {
          btn.className = "py-2 px-1 text-center font-mono text-[10px] rounded-lg border border-white/5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition";
        }
      }
    });
  }

  // Generate Transfer Link Execution
  function generateTransferLink() {
    if (stagedFiles.length === 0) {
      alert("No components configured for compilation. Populate staging dock.");
      return;
    }

    const consoleDiv = document.getElementById('crypto-console');
    const logsDiv = document.getElementById('console-logs');
    const linkPanel = document.getElementById('link-result-panel');
    const triggerBtn = document.getElementById('generate-trigger-btn');
    const expirationResult = document.getElementById('result-expiration');

    if (!consoleDiv || !logsDiv) return;

    // UI state prep
    consoleDiv.classList.remove('hidden');
    linkPanel.classList.add('hidden');
    triggerBtn.disabled = true;
    triggerBtn.classList.add('brightness-50', 'cursor-not-allowed');

    logsDiv.innerHTML = '';
    
    // Command line simulated sequence logs
    const logs = [
      `[PRISM.SECURE] Initiating pipeline for ${stagedFiles.length} file components...`,
      `[PRISM.SECURE] Sharding visual payload into localized blobs...`,
      isPasswordLocked ? `[PRISM.CRYPTO] Enforcing symmetric passkey restriction: ${currentPassword}` : `[PRISM.CRYPTO] Deploying unsecured link envelope...`,
      `[PRISM.SECURE] Syncing network payload to recipient grid matrix [${recipients.length || 'PUBLIC'}]`,
      `[PRISM.DESTRUCT] Arming decay timing matrix set to [${expirationTime.toUpperCase()}]...`,
      `[SUCCESS] Sharding completed. Symmetric token validated securely.`
    ];

    let currentLogIndex = 0;
    
    function printNextLog() {
      if (currentLogIndex < logs.length) {
        const item = document.createElement('div');
        item.textContent = logs[currentLogIndex];
        logsDiv.appendChild(item);
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
        currentLogIndex++;
        setTimeout(printNextLog, 450);
      } else {
        // Build completed link display
        setTimeout(() => {
          const generatedId = Math.random().toString(36).substring(2, 10);
          const linkInput = document.getElementById('result-link-input');
          if (linkInput) {
            linkInput.value = `https://prism.logic/xfer/shd-${generatedId}`;
          }
          
          if (expirationResult) {
            expirationResult.textContent = `EXPIRES IN: ${expirationTime.toUpperCase()}`;
          }

          consoleDiv.classList.add('hidden');
          linkPanel.classList.remove('hidden');
          triggerBtn.disabled = false;
          triggerBtn.classList.remove('brightness-50', 'cursor-not-allowed');
          lucide.createIcons();
        }, 300);
      }
    }

    printNextLog();
  }

  // Copy Result Link helper
  function copyResultLink() {
    const copyText = document.getElementById('result-link-input');
    if (copyText) {
      copyText.select();
      copyText.setSelectionRange(0, 99999); // mobile support
      navigator.clipboard.writeText(copyText.value);
      alert("Refraction transfer envelope copy verified!");
    }
  }

  // Clear / Reset entire staging Composer
  function resetComposer() {
    stagedFiles = [];
    recipients = [];
    isPasswordLocked = true;
    currentPassword = generatePasskey();
    expirationTime = "24h";

    const pwToggle = document.getElementById('password-toggle');
    if (pwToggle) pwToggle.checked = true;

    const pwInput = document.getElementById('passkey-input');
    if (pwInput) pwInput.value = currentPassword;

    const recipientInput = document.getElementById('recipient-input');
    if (recipientInput) recipientInput.value = '';

    const consoleDiv = document.getElementById('crypto-console');
    if (consoleDiv) consoleDiv.classList.add('hidden');

    const linkPanel = document.getElementById('link-result-panel');
    if (linkPanel) linkPanel.classList.add('hidden');

    togglePasswordLock();
    setExpiration('24h');
    renderStagedFiles();
    renderRecipients();
  }

  // Open/Close trigger interfaces
  function openComposer() {
    const overlay = document.getElementById('prism-composer-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      setTimeout(() => {
        overlay.classList.remove('opacity-0');
      }, 50);
    }
  }

  function closeComposer() {
    const overlay = document.getElementById('prism-composer-overlay');
    if (overlay) {
      overlay.classList.add('opacity-0');
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 300);
    }
  }

  // Export module functionality globally securely
  window.PrismComposer = {
    openComposer,
    closeComposer,
    removeStagedFile,
    addRecipient,
    removeRecipient,
    togglePasswordLock,
    regenerateKey,
    setExpiration,
    generateTransferLink,
    copyResultLink,
    resetComposer
  };

})();