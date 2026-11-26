document.addEventListener('DOMContentLoaded', () => {
  // 1. Setup Injectable UI Styles
  const style = document.createElement('style');
  style.textContent = `
    .terminal-ticker {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #00f0ff;
    }
    .file-pill {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.2s ease;
    }
    .file-pill:hover {
      border-color: rgba(0, 240, 255, 0.3);
      background: rgba(0, 240, 255, 0.03);
    }
  `;
  document.head.appendChild(style);

  // 2. Inject Uploader Toggle Button into Header
  const headerActionDiv = document.querySelector('header .flex.items-center.space-x-3');
  if (headerActionDiv) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'toggle-transfer-composer';
    toggleBtn.className = 'relative flex items-center space-x-2 bg-gradient-to-r from-prism-red/15 to-prism-purple/15 hover:from-prism-red/25 hover:to-prism-purple/25 text-white text-xs font-semibold py-2 px-4 rounded-lg border border-prism-red/30 transition duration-300';
    toggleBtn.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-prism-red animate-ping"></span>
      <span>Secure Transfer Node</span>
    `;
    // Insert before the FAQ help button
    headerActionDiv.insertBefore(toggleBtn, headerActionDiv.lastElementChild);
  }

  // 3. Inject Composer Element above the main directory filters
  const mainElement = document.querySelector('main');
  if (mainElement) {
    const composerSection = document.createElement('section');
    composerSection.id = 'prism-transfer-composer';
    composerSection.className = 'hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 transition-all duration-500 ease-in-out';
    composerSection.innerHTML = `
      <div class="prism-glass p-6 rounded-2xl border border-prism-red/25 prism-glow-red relative overflow-hidden">
        
        <!-- Background accents -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-prism-red/5 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-prism-blue/5 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-prism-red/10 border border-prism-red/20 rounded-lg text-prism-red">
              <i data-lucide="shield-alert" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="text-[10px] font-mono tracking-widest text-prism-red uppercase block">Secure Data Transmission // Node v0.89</span>
              <h2 class="text-xl font-black text-white uppercase tracking-tight">Spectral Batch Transfer Composer</h2>
            </div>
          </div>
          <div class="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 font-mono text-[10px] text-white/50">
            <span>Payload Status:</span>
            <span id="composer-status-badge" class="text-prism-yellow font-bold uppercase">Staging</span>
          </div>
        </div>

        <!-- Composer Layout Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Column A: Dropzone & File List -->
          <div class="lg:col-span-7 space-y-4">
            
            <!-- Custom Dropzone -->
            <div id="dropzone-area" class="border-2 border-dashed border-white/10 hover:border-prism-red/40 bg-black/30 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative group">
              <input type="file" id="file-uploader-input" multiple class="absolute inset-0 opacity-0 cursor-pointer" />
              <div class="p-4 bg-white/5 rounded-full mb-3 text-white/60 group-hover:text-prism-red group-hover:bg-prism-red/10 transition duration-300">
                <i data-lucide="upload-cloud" class="w-8 h-8"></i>
              </div>
              <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-1">Drag & Drop Secure Assets</h4>
              <p class="text-[11px] text-white/40 font-mono mb-2">Maximum limits: Up to 7 attachments • Max 150MB total</p>
              <div class="px-2 py-0.5 bg-prism-red/10 text-prism-red text-[9px] font-mono rounded border border-prism-red/20">
                AES-256 Client-Side Refraction
              </div>
            </div>

            <!-- Staged Files Console -->
            <div class="space-y-2">
              <div class="flex items-center justify-between font-mono text-[10px]">
                <span class="text-white/40 uppercase tracking-wider">Staged Payloads (<span id="staged-count">0</span>/7)</span>
                <button id="clear-payload-btn" class="text-prism-red hover:underline uppercase text-[9px]">Wipe Payload</button>
              </div>
              
              <!-- Dynamically populated files container -->
              <div id="file-staging-list" class="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                <div class="text-center py-4 text-white/30 text-[11px] font-mono border border-white/5 rounded-xl bg-black/10">
                  // No secure files currently multiplexed
                </div>
              </div>
            </div>

          </div>

          <!-- Column B: Security, Timers, Recipients -->
          <div class="lg:col-span-5 space-y-4">
            
            <div class="bg-black/30 p-4 rounded-xl border border-white/5 space-y-4 text-xs">
              <div class="font-mono text-[10px] text-white/40 uppercase tracking-widest pb-2 border-b border-white/5">
                Refraction Handshake Parameters
              </div>

              <!-- Recipient list input -->
              <div class="space-y-1.5">
                <label class="block text-white/60 font-mono text-[10px] uppercase">Recipient Authorization matrix</label>
                <div class="flex gap-2">
                  <input type="email" id="recipient-input" placeholder="underwriting@prism.logic" class="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-prism-red text-xs">
                  <button id="add-recipient-btn" class="px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-mono text-white text-[11px]">ADD</button>
                </div>
                <!-- Recipient Pills -->
                <div id="recipient-pills-container" class="flex flex-wrap gap-1.5 pt-1">
                  <!-- Dynamic pills inject here -->
                </div>
              </div>

              <!-- Expiry & Password settings side by side -->
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="block text-white/60 font-mono text-[10px] uppercase">Node Self-Destruct</label>
                  <select id="transfer-expiry" class="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-prism-red text-xs cursor-pointer">
                    <option value="1h">1 Hour</option>
                    <option value="12h">12 Hours</option>
                    <option value="24h" selected>24 Hours</option>
                    <option value="3d">3 Days</option>
                    <option value="7d">7 Days</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-white/60 font-mono text-[10px] uppercase">Entropy Seal</label>
                  <div class="relative">
                    <input type="password" id="transfer-passphrase" placeholder="Encrypted Key" class="w-full bg-black/40 border border-white/10 rounded-lg p-2 pr-8 text-white focus:outline-none focus:border-prism-red text-xs">
                    <button id="toggle-passphrase-visibility" class="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
                      <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Terminal simulator logging state changes -->
              <div class="bg-black/80 rounded-lg p-3 border border-white/5 font-mono text-[9px] text-prism-red/80 space-y-0.5 max-h-[85px] overflow-hidden relative">
                <div class="absolute top-1 right-2 text-[8px] text-white/20">LIVE SPECTRAL FEED</div>
                <div id="terminal-log-container" class="space-y-0.5">
                  <div>[STABLE] SECURE TRANSFER INTERFACE ONLINE.</div>
                  <div>[STABLE] QUANTUM ENTROPY MATRICES CALIBRATED.</div>
                </div>
              </div>

              <!-- Compile Action Trigger -->
              <button id="compile-transfer-btn" class="w-full py-3 bg-gradient-to-r from-prism-red to-prism-purple text-white hover:brightness-110 font-bold uppercase tracking-widest rounded-lg border border-white/15 transition-all duration-300 font-mono text-[11px] flex items-center justify-center gap-2">
                <i data-lucide="cpu" class="w-4 h-4"></i>
                <span>Compile Encrypted Payload</span>
              </button>

            </div>

          </div>

        </div>

        <!-- Finalized Payload Result Panel (Hidden by default, overlays or inserts smoothly) -->
        <div id="transfer-result-panel" class="hidden mt-6 pt-6 border-t border-white/10 space-y-4">
          <div class="bg-prism-green/5 border border-prism-green/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center space-x-1.5">
                <span class="w-2 h-2 rounded-full bg-prism-green status-pulse"></span>
                <span class="text-[10px] font-mono uppercase text-prism-green font-bold">Secure Node Operational</span>
              </div>
              <h4 class="text-sm font-bold text-white uppercase tracking-tight">Spectral Link Successfully Distributed</h4>
              <p class="text-[11px] text-white/50 font-mono">Payload locked & encrypted inside network. Recipient notifications queued.</p>
            </div>
            
            <!-- Link Copy Control -->
            <div class="flex items-center gap-2 max-w-md w-full md:w-auto">
              <input type="text" id="generated-transfer-link" readonly value="https://prism.logic/transfer/tx_c489b01f9" class="bg-black/60 border border-white/10 rounded-lg p-2 text-[11px] text-prism-blue font-mono w-full md:w-72 focus:outline-none">
              <button id="copy-transfer-link-btn" class="px-3 py-2 bg-prism-blue/20 hover:bg-prism-blue/30 text-prism-blue border border-prism-blue/30 rounded-lg font-mono text-[11px] flex items-center gap-1">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                <span>COPY</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    // Inject before the main grid
    mainElement.parentNode.insertBefore(composerSection, mainElement);
  }

  // 4. Composer State & Logic
  let stagedFiles = [];
  let recipients = [];
  let passphraseVisible = false;

  const fileInput = document.getElementById('file-uploader-input');
  const fileStagingList = document.getElementById('file-staging-list');
  const stagedCountSpan = document.getElementById('staged-count');
  const clearPayloadBtn = document.getElementById('clear-payload-btn');
  const recipientInput = document.getElementById('recipient-input');
  const addRecipientBtn = document.getElementById('add-recipient-btn');
  const recipientContainer = document.getElementById('recipient-pills-container');
  const toggleTransferBtn = document.getElementById('toggle-transfer-composer');
  const composerSection = document.getElementById('prism-transfer-composer');
  const compileBtn = document.getElementById('compile-transfer-btn');
  const terminalLogContainer = document.getElementById('terminal-log-container');
  const resultPanel = document.getElementById('transfer-result-panel');
  const generatedLinkInput = document.getElementById('generated-transfer-link');
  const copyLinkBtn = document.getElementById('copy-transfer-link-btn');
  const togglePassphraseBtn = document.getElementById('toggle-passphrase-visibility');
  const passphraseInput = document.getElementById('transfer-passphrase');
  const composerStatusBadge = document.getElementById('composer-status-badge');
  const dropzoneArea = document.getElementById('dropzone-area');

  // Initialize Lucide icons on dynamic insertions
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Toggle Composer visibility
  if (toggleTransferBtn) {
    toggleTransferBtn.addEventListener('click', () => {
      composerSection.classList.toggle('hidden');
      if (!composerSection.classList.contains('hidden')) {
        composerSection.scrollIntoView({ behavior: 'smooth' });
        addTerminalLog("STAGING AREA MOUNTED. SEEDING LIGHTWAYS...");
      }
    });
  }

  // Log Simulator helper
  function addTerminalLog(message) {
    const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
    const newLog = document.createElement('div');
    newLog.className = 'text-white/40';
    newLog.innerHTML = `<span class="text-prism-red">[${timestamp}]</span> ${message}`;
    terminalLogContainer.appendChild(newLog);
    // Keep last 6 elements visible
    while (terminalLogContainer.children.length > 5) {
      terminalLogContainer.removeChild(terminalLogContainer.firstChild);
    }
  }

  // Staging Files list rendering
  function renderStagedFiles() {
    stagedCountSpan.textContent = stagedFiles.length;
    
    if (stagedFiles.length === 0) {
      fileStagingList.innerHTML = `
        <div class="text-center py-4 text-white/30 text-[11px] font-mono border border-white/5 rounded-xl bg-black/10">
          // No secure files currently multiplexed
        </div>
      `;
      composerStatusBadge.textContent = 'Staging';
      composerStatusBadge.className = 'text-prism-yellow font-bold uppercase';
      return;
    }

    composerStatusBadge.textContent = 'Ready to Encrypt';
    composerStatusBadge.className = 'text-prism-blue font-bold uppercase';

    fileStagingList.innerHTML = stagedFiles.map((file, idx) => `
      <div class="file-pill flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono">
        <div class="flex items-center space-x-2 truncate">
          <i data-lucide="file" class="w-4 h-4 text-prism-red shrink-0"></i>
          <span class="text-white truncate max-w-[200px] md:max-w-[350px]">${file.name}</span>
          <span class="text-[9px] text-white/30 shrink-0">(${formatBytes(file.size)})</span>
        </div>
        <button onclick="removeStagedFile(${idx})" class="p-1 hover:bg-white/10 rounded text-white/40 hover:text-prism-red">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Format dynamic file size
  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Expose global remove handler safely
  window.removeStagedFile = function(index) {
    const removedName = stagedFiles[index].name;
    stagedFiles.splice(index, 1);
    addTerminalLog(`EJECTED DATA VECTOR: ${removedName.substring(0, 15)}...`);
    renderStagedFiles();
  };

  // Handling file selections
  function handleFiles(files) {
    const totalFilesToAdd = Array.from(files);
    
    if (stagedFiles.length + totalFilesToAdd.length > 7) {
      alert("Spectral limits active: Strict payload allocation maximum is 7 direct attachments.");
      addTerminalLog("[ERROR] COMPOSER CAPACITY OVERFLOW BLOCKED.");
      return;
    }

    totalFilesToAdd.forEach(file => {
      stagedFiles.push({
        name: file.name,
        size: file.size
      });
      addTerminalLog(`STAGED PAYLOAD BLOCK: ${file.name.substring(0, 18)}...`);
    });

    renderStagedFiles();
  }

  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  // Drag & Drop visual highlights
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzoneArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzoneArea.classList.add('border-prism-red/70', 'bg-prism-red/5');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzoneArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzoneArea.classList.remove('border-prism-red/70', 'bg-prism-red/5');
    }, false);
  });

  dropzoneArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });

  // Clear All staged files
  clearPayloadBtn.addEventListener('click', () => {
    stagedFiles = [];
    addTerminalLog("PAYLOAD WIPED. ALL FLASH CHANNELS FLUSHED.");
    renderStagedFiles();
  });

  // Recipient tracking logic
  function renderRecipients() {
    recipientContainer.innerHTML = recipients.map((rec, idx) => `
      <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-prism-blue/15 border border-prism-blue/20 text-prism-blue text-[10px] font-mono">
        <span>${rec}</span>
        <button onclick="removeRecipient(${idx})" class="hover:text-white">&times;</button>
      </span>
    `).join('');
  }

  window.removeRecipient = function(index) {
    recipients.splice(index, 1);
    renderRecipients();
  };

  addRecipientBtn.addEventListener('click', () => {
    const email = recipientInput.value.trim();
    if (email && validateEmail(email)) {
      if (recipients.length >= 5) {
        alert("Maximum 5 recipients can be authorized simultaneously.");
        return;
      }
      recipients.push(email);
      recipientInput.value = '';
      renderRecipients();
      addTerminalLog(`AUTH RECIPIENT ADDED: ${email}`);
    } else {
      alert("Invalid decryption authority node address (Email check failed).");
    }
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Visibility toggle for password / Encryption passphrase
  togglePassphraseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    passphraseVisible = !passphraseVisible;
    passphraseInput.type = passphraseVisible ? 'text' : 'password';
    togglePassphraseBtn.innerHTML = passphraseVisible 
      ? `<i data-lucide="eye-off" class="w-3.5 h-3.5"></i>`
      : `<i data-lucide="eye" class="w-3.5 h-3.5"></i>`;
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // Generate / Compile Secure Transmission Link Simulator
  compileBtn.addEventListener('click', () => {
    if (stagedFiles.length === 0) {
      alert("Payload block is empty. Stage at least 1 secure file vector.");
      return;
    }

    addTerminalLog("INITIATING PACKET SEALING...");
    compileBtn.disabled = true;
    compileBtn.classList.add('opacity-50');
    compileBtn.innerHTML = `
      <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Bending Light Paths...</span>
    `;

    setTimeout(() => {
      addTerminalLog("FRAGMENTING PAYLOAD CHUNKS...");
    }, 600);

    setTimeout(() => {
      addTerminalLog("GENERATING SHAMIR SECRET SHARED KEYS...");
    }, 1200);

    setTimeout(() => {
      const expirationVal = document.getElementById('transfer-expiry').value;
      const keyHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const outputLink = `https://prism.logic/transfer/tx_${keyHex}`;
      
      generatedLinkInput.value = outputLink;
      resultPanel.classList.remove('hidden');
      
      addTerminalLog("PAYLOAD SEALED SUCCESS.");
      addTerminalLog(`EXPIRATION STACK REGISTERED: ${expirationVal}`);

      composerStatusBadge.textContent = 'Transmitting';
      composerStatusBadge.className = 'text-prism-green font-bold uppercase';

      compileBtn.disabled = false;
      compileBtn.classList.remove('opacity-50');
      compileBtn.innerHTML = `
        <i data-lucide="cpu" class="w-4 h-4"></i>
        <span>Compile Encrypted Payload</span>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }

      resultPanel.scrollIntoView({ behavior: 'smooth' });
    }, 2200);
  });

  // Copy transfer link interaction
  copyLinkBtn.addEventListener('click', () => {
    generatedLinkInput.select();
    generatedLinkInput.setSelectionRange(0, 99999); // Mobile compatibility
    navigator.clipboard.writeText(generatedLinkInput.value);
    
    const initialText = copyLinkBtn.innerHTML;
    copyLinkBtn.innerHTML = `
      <i data-lucide="check" class="w-3.5 h-3.5"></i>
      <span>COPIED</span>
    `;
    if (window.lucide) {
      window.lucide.createIcons();
    }

    setTimeout(() => {
      copyLinkBtn.innerHTML = initialText;
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }, 2000);
  });
});
