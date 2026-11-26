/**
 * PRISM LOGIC // SECURE RECIPIENT ACCESS & ZIP PORTAL ENGINE
 * Version: v2.4.1-SECURE
 * Dynamic high-performance client-side encryption, packaging and download manager.
 */

(function () {
  const JSZIP_CDN = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
  let jsZipLoaded = false;

  // Mock secure document package for hard money underwriting
  const SECURE_DOCUMENTS = [
    {
      id: "DOC-001",
      name: "Prism_Logic_Direct_Underwriting_Guidelines.pdf",
      size: 1420500, // 1.4 MB
      type: "application/pdf",
      mime: "application/pdf",
      category: "GUIDELINES",
      securityHash: "sha256-8f3b20c9...",
      content: "PRISM LOGIC DIRECT CAPITAL UNDERWRITING MANIFESTO. MAX LTV 85%. DSCR MIN 1.20."
    },
    {
      id: "DOC-002",
      name: "Capital_Allocation_Matrix_v2.4.xlsx",
      size: 2840100, // 2.8 MB
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      mime: "application/octet-stream",
      category: "SPREADSHEET",
      securityHash: "sha256-4a1e90b2...",
      content: "PRISM INDEX RATIO MATRICES: RATE=7.99-12.0%, LTV=65-90%, VOLUME_YTD=$4.82B"
    },
    {
      id: "DOC-003",
      name: "Secured_Handshake_Private_Key.json",
      size: 4120, // 4.1 KB
      type: "application/json",
      mime: "application/json",
      category: "SECURITY_KEY",
      securityHash: "sha256-ff2e93b0...",
      content: JSON.stringify({ node: "PRISM-NOD-942", token_type: "Bearer OTP", spectral_refraction: "1.54 LTV" }, null, 2)
    }
  ];

  // Global State Tracker
  const PortalState = {
    isAuthenticated: false,
    otpSent: false,
    otpCode: "7749", // Mock OTP
    files: [...SECURE_DOCUMENTS],
    selectedFiles: new Set(SECURE_DOCUMENTS.map(f => f.id)),
    isDownloading: false,
    downloadProgress: 0,
    terminalLogs: []
  };

  // Dynamically load JSZip dependency
  function loadJSZip() {
    return new Promise((resolve, reject) => {
      if (window.JSZip) {
        jsZipLoaded = true;
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = JSZIP_CDN;
      script.onload = () => {
        jsZipLoaded = true;
        addLog("SYSTEM", "Decryption library JSZip linked successfully.");
        resolve();
      };
      script.onerror = () => {
        addLog("ERROR", "Failed to link cryptographic package manager.");
        reject(new Error("JSZip load failure"));
      };
      document.head.appendChild(script);
    });
  }

  // System Terminal Logging
  function addLog(type, message) {
    const timestamp = new Date().toISOString().split("T")[1].substring(0, 8);
    const prefix = `[${timestamp}] [${type}]`;
    const logEntry = `${prefix} ${message}`;
    PortalState.terminalLogs.push(logEntry);
    if (PortalState.terminalLogs.length > 50) PortalState.terminalLogs.shift();
    
    // Dispatch event for UI updates
    const logEvent = new CustomEvent("prism-log-update", { detail: { logs: PortalState.terminalLogs, latest: logEntry } });
    document.dispatchEvent(logEvent);

    // Dynamic auto-scroll terminal if it exists
    const consoleEl = document.getElementById("prism-terminal-console");
    if (consoleEl) {
      const isScrolledToBottom = consoleEl.scrollHeight - consoleEl.clientHeight <= consoleEl.scrollTop + 1;
      const logSpan = document.createElement("div");
      logSpan.className = type === "ERROR" ? "text-prism-red" : type === "SUCCESS" ? "text-prism-green" : type === "WARN" ? "text-prism-yellow" : "text-white/60";
      logSpan.textContent = logEntry;
      consoleEl.appendChild(logSpan);
      if (isScrolledToBottom) {
        consoleEl.scrollTop = consoleEl.scrollHeight;
      }
    }
  }

  // Authenticate / Validate OTP Token
  window.verifyPrismToken = function (enteredToken) {
    addLog("SECURITY", "Initiating handshake sequence...");
    
    if (enteredToken.trim() === PortalState.otpCode || enteredToken.trim().toUpperCase() === "PRISM-DEMO") {
      PortalState.isAuthenticated = true;
      addLog("SUCCESS", "Identity cryptographically validated. Authorization Level: RECIPIENT.");
      renderPortalUI();
      return true;
    } else {
      addLog("ERROR", "Invalid verification credentials. Access handshake dropped.");
      return false;
    }
  };

  window.sendPrismOTP = function (contactVal) {
    if (!contactVal) {
      addLog("WARN", "Invalid destination node. Cannot dispatch OTP.");
      return false;
    }
    PortalState.otpSent = true;
    addLog("SECURITY", `Generated spectral passcode [${PortalState.otpCode}] and dispatched to node [${contactVal}].`);
    renderPortalUI();
    return true;
  };

  // Format File Size
  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // Toggle selection state of package files
  window.togglePrismFile = function (fileId) {
    if (PortalState.selectedFiles.has(fileId)) {
      if (PortalState.selectedFiles.size > 1) {
        PortalState.selectedFiles.delete(fileId);
        addLog("SYSTEM", `Excluded document ID: ${fileId}`);
      } else {
        addLog("WARN", "At least one document must remain selected to bundle archive.");
      }
    } else {
      PortalState.selectedFiles.add(fileId);
      addLog("SYSTEM", `Included document ID: ${fileId}`);
    }
    renderPortalUI();
  };

  // Helper to trigger direct single download
  window.downloadIndividualFile = function (fileId) {
    const file = PortalState.files.find(f => f.id === fileId);
    if (!file) return;

    addLog("DECRYPT", `Unpacking stream for ${file.name}`);
    const blob = new Blob([file.content], { type: file.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog("SUCCESS", `Individual download completed for ${file.name}`);
  };

  // Build high-efficiency local ZIP Archive
  window.generateSecureZip = async function () {
    if (PortalState.isDownloading) return;
    if (PortalState.selectedFiles.size === 0) {
      addLog("WARN", "Operation canceled: Empty payload criteria.");
      return;
    }

    PortalState.isDownloading = true;
    PortalState.downloadProgress = 0;
    renderPortalUI();

    addLog("ZIPPER", "Assembling secure zip compiler pipelines...");
    
    try {
      await loadJSZip();
      
      const zip = new JSZip();
      const selectedList = PortalState.files.filter(f => PortalState.selectedFiles.has(f.id));
      
      addLog("ZIPPER", `Compressing and packaging ${selectedList.length} files...`);

      selectedList.forEach((file) => {
        zip.file(file.name, file.content);
        addLog("ZIPPER", `Packed: ${file.name} [CRC-32 Hash verified]`);
      });

      addLog("DECRYPT", "Decrypting transport layers and generating binary stream...");
      
      const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
        PortalState.downloadProgress = Math.round(metadata.percent);
        const progressBar = document.getElementById("prism-zip-progress-bar");
        const progressText = document.getElementById("prism-zip-progress-text");
        if (progressBar) progressBar.style.width = `${PortalState.downloadProgress}%`;
        if (progressText) progressText.textContent = `${PortalState.downloadProgress}%`;
      });

      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PRISM_SECURE_PACKAGE_${Date.now().toString().slice(-6)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addLog("SUCCESS", "Secure ZIP Archive decrypted and downloaded successfully.");
    } catch (err) {
      addLog("ERROR", `Compilation interrupted: ${err.message}`);
    } finally {
      PortalState.isDownloading = false;
      PortalState.downloadProgress = 100;
      setTimeout(() => {
        if (!PortalState.isDownloading) {
          PortalState.downloadProgress = 0;
          renderPortalUI();
        }
      }, 3000);
    }
  };

  // Render Engine: Dynamically build layout matching the PRISM Directory theme
  function renderPortalUI() {
    const mountPoint = document.getElementById("prism-secure-portal-root");
    if (!mountPoint) return;

    // Inject Base Layout Styles & Classes if not present
    if (!document.getElementById("prism-portal-styles")) {
      const styles = document.createElement("style");
      styles.id = "prism-portal-styles";
      styles.textContent = `
        .terminal-scroll::-webkit-scrollbar { width: 4px; }
        .terminal-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .terminal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `;
      document.head.appendChild(styles);
    }

    let innerHTML = "";

    if (!PortalState.isAuthenticated) {
      // SECURE AUTHENTICATION SCREEN
      innerHTML = `
        <div class="prism-glass p-8 rounded-2xl border border-prism-blue/30 max-w-lg w-full mx-auto relative overflow-hidden my-8 shadow-2xl">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-prism-red via-prism-blue to-prism-green"></div>
          
          <div class="space-y-6">
            <div class="text-center">
              <span class="text-[9px] font-mono tracking-[0.3em] text-prism-blue uppercase block">PRISM SECURE ENCLAVE</span>
              <h2 class="text-2xl font-black tracking-tight text-white uppercase mt-1">Recipient Attachment Portal</h2>
              <p class="text-xs text-white/50 mt-2">A secure point-to-point interface to preview and bundle shared underwriting manifests.</p>
            </div>

            ${!PortalState.otpSent ? `
              <!-- Step 1: Input target node to receive dynamic security pass -->
              <div class="space-y-4">
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-mono text-white/40 uppercase tracking-widest">Recipient Contact Node</label>
                  <input type="text" id="prism-node-contact" placeholder="Enter phone number or node routing email..." class="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-prism-blue focus:ring-1 focus:ring-prism-blue transition">
                </div>
                <button onclick="window.sendPrismOTP(document.getElementById('prism-node-contact').value)" class="w-full bg-gradient-to-r from-prism-blue/20 to-prism-purple/20 hover:from-prism-blue/30 hover:to-prism-purple/30 text-white font-mono uppercase tracking-widest text-xs py-3 rounded-xl border border-prism-blue/40 transition">
                  Generate Secure Handshake Key
                </button>
                <div class="text-[10px] text-center text-white/30 font-mono">
                  DEMO PASS: Enter any value & use OTP <span class="text-prism-yellow font-bold">7749</span> or code <span class="text-prism-blue font-bold">PRISM-DEMO</span>
                </div>
              </div>
            ` : `
              <!-- Step 2: Validate OTP -->
              <div class="space-y-4">
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-mono text-white/40 uppercase tracking-widest">Spectral Security OTP</label>
                  <div class="relative">
                    <input type="password" id="prism-otp-input" placeholder="••••" maxlength="12" class="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-center text-lg tracking-widest font-mono text-prism-yellow placeholder-white/20 focus:outline-none focus:border-prism-yellow focus:ring-1 focus:ring-prism-yellow transition">
                  </div>
                </div>
                <button onclick="window.verifyPrismToken(document.getElementById('prism-otp-input').value)" class="w-full bg-gradient-to-r from-prism-yellow/20 to-prism-red/20 hover:from-prism-yellow/30 hover:to-prism-red/30 text-white font-mono uppercase tracking-widest text-xs py-3 rounded-xl border border-prism-yellow/40 transition">
                  Decrypt & Handshake Access
                </button>
                <div class="flex items-center justify-between text-[10px] font-mono">
                  <button onclick="PortalState.otpSent = false; renderPortalUI();" class="text-white/40 hover:text-white transition">← Reset Node Address</button>
                  <span class="text-prism-green status-pulse px-2 py-0.5 rounded bg-prism-green/5 border border-prism-green/20">OTP ACTIVE</span>
                </div>
              </div>
            `}

            <!-- Real-time feedback terminal window -->
            <div class="border border-white/5 bg-black/80 rounded-xl p-3 font-mono text-[9px] text-white/50 space-y-1">
              <div class="text-[10px] text-white/70 border-b border-white/5 pb-1 mb-1 flex items-center justify-between">
                <span>// TUNNEL METRIC FEED</span>
                <span class="w-1.5 h-1.5 rounded-full bg-prism-red animate-ping"></span>
              </div>
              <div id="prism-terminal-console" class="h-20 overflow-y-auto terminal-scroll space-y-0.5">
                ${PortalState.terminalLogs.map(log => {
                  let cl = "text-white/60";
                  if (log.includes("[ERROR]")) cl = "text-prism-red";
                  if (log.includes("[SUCCESS]")) cl = "text-prism-green";
                  if (log.includes("[WARN]")) cl = "text-prism-yellow";
                  return `<div class="${cl}">${log}</div>`;
                }).join('')}
              </div>
            </div>

          </div>
        </div>
      `;
    } else {
      // AUTHORIZED RECIPIENT PORTAL SCREEN
      innerHTML = `
        <div class="prism-glass p-6 md:p-8 rounded-2xl border border-white/10 max-w-5xl w-full mx-auto relative overflow-hidden my-8 shadow-2xl">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-prism-blue via-prism-purple to-prism-green"></div>
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- LHS: Manifest Information and File Selector -->
            <div class="lg:col-span-7 space-y-6">
              <div>
                <div class="inline-flex items-center space-x-2 bg-prism-blue/10 border border-prism-blue/20 px-3 py-1 rounded-full mb-3">
                  <span class="w-2 h-2 rounded-full bg-prism-green status-pulse"></span>
                  <span class="text-[9px] font-mono tracking-widest text-prism-blue uppercase">Connection Secure // Direct Balance Capital</span>
                </div>
                <h2 class="text-2xl font-black text-white uppercase tracking-tight">Underwriting Documentation Package</h2>
                <p class="text-xs text-white/60 mt-1">Review, selectively toggle, or decrypt-and-compile documents directly into a local zip folder.</p>
              </div>

              <!-- Message from underwriting source -->
              <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-white/80 space-y-2">
                <span class="font-mono text-[9px] text-prism-blue block">// TRANSMISSION MEMO FROM PRISM Direct Node</span>
                <p class="italic leading-relaxed">"Attached are the active capital parameters, private direct criteria grids, and cryptographic keys needed to secure instant high-leverage positions."</p>
              </div>

              <!-- Live Interactive Document Table -->
              <div class="space-y-3">
                <h3 class="text-xs font-bold text-white uppercase tracking-wider font-mono">// Package Inclusions</h3>
                <div class="space-y-2">
                  ${PortalState.files.map(file => {
                    const isSelected = PortalState.selectedFiles.has(file.id);
                    return `
                      <div class="flex items-center justify-between p-3.5 rounded-xl border transition ${
                        isSelected ? "bg-prism-blue/5 border-prism-blue/30" : "bg-black/20 border-white/5 opacity-60"
                      }">
                        <div class="flex items-start space-x-3 max-w-[70%]">
                          <input type="checkbox" ${isSelected ? "checked" : ""} onclick="window.togglePrismFile('${file.id}')" class="mt-1 rounded accent-prism-blue cursor-pointer">
                          <div>
                            <span class="text-xs font-bold text-white block truncate">${file.name}</span>
                            <span class="text-[9px] font-mono text-white/40 uppercase block mt-0.5">${file.category} — ${formatBytes(file.size)}</span>
                          </div>
                        </div>
                        <button onclick="window.downloadIndividualFile('${file.id}')" class="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-prism-blue text-white/70 hover:text-prism-blue transition text-[10px] font-mono flex items-center space-x-1">
                          <span>Decrypt File</span>
                        </button>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <!-- RHS: Actions Panel & Diagnostic Logging Console -->
            <div class="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <!-- Download Pipeline controls -->
              <div class="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-6">
                <div>
                  <span class="text-[9px] font-mono tracking-widest text-white/40 uppercase block">ZIP Compiler</span>
                  <h3 class="text-base font-bold text-white uppercase tracking-tight">Decentralized Archiving</h3>
                </div>

                <!-- Progress indicator if compressing -->
                ${PortalState.isDownloading || PortalState.downloadProgress > 0 ? `
                  <div class="space-y-2">
                    <div class="flex justify-between font-mono text-[10px]">
                      <span class="text-white/60">Compiling Zip Structure...</span>
                      <span id="prism-zip-progress-text" class="text-prism-green font-bold">${PortalState.downloadProgress}%</span>
                    </div>
                    <div class="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div id="prism-zip-progress-bar" class="bg-gradient-to-r from-prism-blue to-prism-green h-full transition-all duration-150" style="width: ${PortalState.downloadProgress}%"></div>
                    </div>
                  </div>
                ` : `
                  <div class="space-y-1 text-xs text-white/50">
                    <div class="flex justify-between font-mono text-[10px]">
                      <span>Target Count:</span>
                      <span class="text-white font-bold">${PortalState.selectedFiles.size} of ${PortalState.files.length}</span>
                    </div>
                    <div class="flex justify-between font-mono text-[10px]">
                      <span>Compression Preset:</span>
                      <span class="text-white font-bold">Deflate L9 (Optimized)</span>
                    </div>
                  </div>
                `}

                <button onclick="window.generateSecureZip()" ${PortalState.isDownloading ? "disabled" : ""} class="w-full relative overflow-hidden bg-gradient-to-r from-prism-blue to-prism-purple text-white font-mono uppercase tracking-widest text-xs py-4 rounded-xl border border-white/20 transition-all font-semibold hover:brightness-110 flex items-center justify-center space-x-2">
                  <span>Compile and Export Bundle ZIP</span>
                </button>
              </div>

              <!-- Embedded Terminal Console Logs -->
              <div class="border border-white/5 bg-black/80 rounded-2xl p-4 font-mono text-[10px] text-white/50 space-y-2 flex-1 flex flex-col justify-between min-h-[220px]">
                <div class="text-[10px] text-white/70 border-b border-white/5 pb-2 flex items-center justify-between">
                  <span>// LIVE DECRYPTION LOGGER</span>
                  <span class="flex items-center space-x-1.5">
                    <span class="w-2 h-2 rounded-full bg-prism-green animate-pulse"></span>
                    <span class="text-[8px] uppercase tracking-wider text-prism-green">STREAMING LOGS</span>
                  </span>
                </div>
                <div id="prism-terminal-console" class="h-[180px] overflow-y-auto terminal-scroll space-y-1 pr-1 flex-1">
                  ${PortalState.terminalLogs.map(log => {
                    let cl = "text-white/60";
                    if (log.includes("[ERROR]")) cl = "text-prism-red";
                    if (log.includes("[SUCCESS]")) cl = "text-prism-green";
                    if (log.includes("[WARN]")) cl = "text-prism-yellow";
                    return `<div class="${cl}">${log}</div>`;
                  }).join('')}
                </div>
                <button onclick="PortalState.isAuthenticated = false; renderPortalUI();" class="text-left text-[9px] text-white/30 hover:text-prism-red transition uppercase tracking-wider mt-2 pt-2 border-t border-white/5 block">
                  [X] Reset Security Connection / Logout
                </button>
              </div>

            </div>
          </div>
        </div>
      `;
    }

    mountPoint.innerHTML = innerHTML;

    // Scroll diagnostics to bottom
    const consoleEl = document.getElementById("prism-terminal-console");
    if (consoleEl) consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  // Automatic initiation on window mount
  window.addEventListener("DOMContentLoaded", () => {
    addLog("SYSTEM", "Secure Handshake Tunnel Node Initialized.");
    renderPortalUI();
  });

  // Re-export interface for dynamic dynamic integration
  window.PrismPortalState = PortalState;
  window.renderPortalUI = renderPortalUI;
})();