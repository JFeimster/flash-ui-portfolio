/**
 * PRISM LOGIC // SECURE DOCUMENT EXCHANGE & PORTAL HANDLER
 * Core Module for Recipient Authentication, Metadata Decryption, and File Downloader
 */

(function () {
  'use strict';

  // --- STATE SYSTEM ---
  const PORTAL_STATE = {
    isAuthenticated: false,
    isDecrypting: false,
    otpRequested: false,
    correctToken: 'PRISM-77A-92X',
    correctOtp: '793140',
    failedAttempts: 0,
    selectedFiles: new Set(),
    senderInfo: {
      name: "Alex Mercer",
      role: "Lead Capital Underwriter",
      organization: "Prism Logic Structured Credit",
      nodeHash: "0x8F2e...A19d",
      message: "Please review the locked structural underwrite templates, property appraisal matrices, and the direct balance-sheet term sheet for the multi-family development proposal in CA. Funding clearance is dependent on verified document signing.",
      sharedAt: "Oct 24, 2024 - 14:32 UTC"
    },
    files: [
      {
        id: "doc-01",
        name: "Lumina_MultiFamily_TermSheet_v4.2.pdf",
        type: "pdf",
        size: "2.4 MB",
        rawSize: 2516582,
        classification: "CONFIDENTIAL / DIRECT FUNDING",
        hash: "SHA256: 8a4c81...2b9d",
        status: "LOCKED"
      },
      {
        id: "doc-02",
        name: "PhaseI_Environmental_Appraisal_CA.pdf",
        type: "pdf",
        size: "14.8 MB",
        rawSize: 15518924,
        classification: "RESTRICTED",
        hash: "SHA256: d9e102...fa5e",
        status: "LOCKED"
      },
      {
        id: "doc-03",
        name: "Property_Valuation_Sensitivities.xlsx",
        type: "excel",
        size: "1.9 MB",
        rawSize: 1992294,
        classification: "PROPRIETARY STRATEGY",
        hash: "SHA256: c3b91a...331c",
        status: "LOCKED"
      },
      {
        id: "doc-04",
        name: "Underwriting_PreChecklist_Escrow.pdf",
        type: "pdf",
        size: "820 KB",
        rawSize: 839680,
        classification: "STANDARD WORKFLOW",
        hash: "SHA256: e8120c...bc89",
        status: "LOCKED"
      }
    ]
  };

  // --- INITIALIZATION HANDLER ---
  window.addEventListener('DOMContentLoaded', () => {
    injectPortalTrigger();
    checkUrlParams();
  });

  // --- UI INJECTION & PORTAL TRIGGERS ---
  function injectPortalTrigger() {
    // Append Portal alert button in Header Action Controls
    const actionControls = document.querySelector('header .flex.items-center.space-x-3');
    if (actionControls) {
      const portalBtn = document.createElement('button');
      portalBtn.id = 'portal-toggle-btn';
      portalBtn.className = 'p-2 rounded-lg bg-prism-blue/10 border border-prism-blue/20 text-prism-blue hover:text-white hover:bg-prism-blue/20 transition relative group';
      portalBtn.title = 'Secure Recipient Access Portal';
      portalBtn.innerHTML = `
        <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-prism-red animate-ping"></span>
        <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-prism-red"></span>
        <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      `;
      portalBtn.onclick = toggleSecurePortal;
      actionControls.insertBefore(portalBtn, actionControls.firstChild);
    }

    // Append dynamic secure notification toast
    const toast = document.createElement('div');
    toast.id = 'prism-portal-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 prism-glass p-4 rounded-xl border border-prism-blue/30 shadow-2xl transition-all duration-500 translate-y-20 opacity-0 pointer-events-none max-w-sm';
    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="p-2 bg-prism-blue/10 rounded-lg text-prism-blue">
          <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="space-y-1">
          <span class="font-mono text-[9px] text-prism-blue tracking-widest uppercase block">SECURE TRANSCEIVER ACTIVE</span>
          <p class="text-xs font-bold text-white uppercase">4 Secured Underwriting Files Shared</p>
          <p class="text-[11px] text-white/50 leading-tight">Sender: Alex Mercer (Structured Credit node)</p>
          <button onclick="PrismAuthPortal.openPortal()" class="mt-2 text-[10px] text-prism-green font-mono uppercase hover:underline flex items-center space-x-1">
            <span>Access Vault</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(toast);

    // Show toast after delay
    setTimeout(() => {
      toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 2500);
  }

  // Auto detect if token passed in URL hash/search params
  function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('secure_token');
    if (token) {
      toggleSecurePortal();
      const tokenInput = document.getElementById('portal-token-input');
      if (tokenInput) {
        tokenInput.value = token;
        handleTokenValidation();
      }
    }
  }

  // --- WINDOW MOUNT FOR GLOBAL EVENT HOOKS ---
  window.PrismAuthPortal = {
    openPortal: () => {
      toggleSecurePortal();
    },
    closePortal: () => {
      const overlay = document.getElementById('prism-secure-portal-overlay');
      if (overlay) {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => overlay.remove(), 400);
      }
    },
    requestOtp: () => {
      requestMockOtp();
    },
    verifyAuth: (e) => {
      e.preventDefault();
      handleTokenValidation();
    },
    toggleFileSelection: (id) => {
      if (PORTAL_STATE.selectedFiles.has(id)) {
        PORTAL_STATE.selectedFiles.delete(id);
      } else {
        PORTAL_STATE.selectedFiles.add(id);
      }
      updateDownloadActionState();
    },
    toggleSelectAllFiles: (checked) => {
      PORTAL_STATE.files.forEach(f => {
        const checkbox = document.getElementById(`cb-${f.id}`);
        if (checkbox) checkbox.checked = checked;
        if (checked) {
          PORTAL_STATE.selectedFiles.add(f.id);
        } else {
          PORTAL_STATE.selectedFiles.clear();
        }
      });
      updateDownloadActionState();
    },
    downloadSingleFile: (id) => {
      triggerDownloadSimulation([id]);
    },
    downloadSelectedBundle: () => {
      if (PORTAL_STATE.selectedFiles.size === 0) return;
      triggerDownloadSimulation(Array.from(PORTAL_STATE.selectedFiles));
    }
  };

  // --- RENDER SECURE OVERLAY VIEW ---
  function toggleSecurePortal() {
    // Hide toast if open
    const toast = document.getElementById('prism-portal-toast');
    if (toast) toast.classList.add('opacity-0', 'translate-y-20');

    // Create or locate container overlay
    let overlay = document.getElementById('prism-secure-portal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'prism-secure-portal-overlay';
      overlay.className = 'fixed inset-0 z-50 bg-prism-black/95 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-400 ease-out overflow-y-auto';
      document.body.appendChild(overlay);
    }
    overlay.classList.remove('opacity-0', 'pointer-events-none');

    renderPortalContent(overlay);
  }

  function renderPortalContent(container) {
    if (!PORTAL_STATE.isAuthenticated) {
      // Render LOCK screen view
      container.innerHTML = `
        <div class="max-w-md w-full prism-glass rounded-2xl border border-prism-blue/30 overflow-hidden relative shadow-2xl p-6 md:p-8 space-y-6">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-prism-blue via-prism-purple to-prism-red"></div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-prism-red animate-pulse"></span>
              <span class="font-mono text-xs text-prism-red uppercase tracking-widest font-bold">SECURE CHANNEL NODE</span>
            </div>
            <button onclick="PrismAuthPortal.closePortal()" class="p-1 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="text-center space-y-2">
            <h2 class="text-2xl font-black text-white uppercase tracking-tight">Decryption Gate</h2>
            <p class="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
              Unlock access to verified institutional capital data packages. Input symmetric access code or prompt OTP validation matrix.
            </p>
          </div>

          <!-- Auth Forms Container -->
          <form onsubmit="PrismAuthPortal.verifyAuth(event)" id="secure-gate-form" class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-[10px] text-white/40 font-mono uppercase tracking-wider">SECURE PASSCODE / DIRECT TOKEN</label>
              <div class="relative">
                <input 
                  type="text" 
                  id="portal-token-input" 
                  placeholder="e.g. PRISM-77A-92X" 
                  class="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-24 text-sm text-white font-mono placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-prism-blue focus:border-prism-blue transition"
                >
                <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  <button type="button" onclick="PrismAuthPortal.requestOtp()" class="bg-prism-blue/15 hover:bg-prism-blue/25 text-prism-blue text-[10px] font-mono font-semibold py-1.5 px-2.5 rounded-lg border border-prism-blue/30 transition">
                    GET OTP
                  </button>
                </div>
              </div>
            </div>

            <div id="otp-field-container" class="space-y-1.5 hidden transition-all duration-300">
              <label class="block text-[10px] text-prism-yellow font-mono uppercase tracking-wider">SMS / SYSTEM OTP CHALLENGE</label>
              <input 
                type="text" 
                id="portal-otp-input" 
                placeholder="INPUT 6-DIGIT VERIFICATION MATRIX" 
                maxlength="6"
                class="w-full bg-black/50 border border-prism-yellow/30 rounded-xl py-3 px-4 text-sm text-white font-mono placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-prism-yellow focus:border-prism-yellow transition text-center tracking-[0.4em]"
              >
            </div>

            <div id="auth-error-output" class="text-prism-red font-mono text-[10px] hidden text-center uppercase tracking-wide animate-pulse"></div>

            <button type="submit" id="auth-submit-btn" class="w-full bg-gradient-to-r from-prism-blue/20 to-prism-purple/20 hover:from-prism-blue/35 hover:to-prism-purple/35 text-white py-3 px-4 rounded-xl border border-prism-blue/40 font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-prism-blue/5">
              VERIFY LOGIC & DECRYPT ATTACHMENTS
            </button>
          </form>

          <div class="border-t border-white/5 pt-4 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>GATEWAY IPS: SECURE_REFRACT_01</span>
            <span>NODE_ENCRYPT: AES-GCM-256</span>
          </div>
        </div>
      `;
    } else {
      // Render AUTHENTICATED vault interface
      renderVaultView(container);
    }
  }

  // --- OTP DISPATCH SIMULATOR ---
  function requestMockOtp() {
    PORTAL_STATE.otpRequested = true;
    const otpContainer = document.getElementById('otp-field-container');
    const tokenInput = document.getElementById('portal-token-input');
    const errorOutput = document.getElementById('auth-error-output');

    if (otpContainer) {
      otpContainer.classList.remove('hidden');
    }

    // Populate helper suggestion or dispatch alert
    alert(`SECURE COMMUNICATIONS NODE: Verification payload sent. Simulated Code: ${PORTAL_STATE.correctOtp}`);
    
    // Auto-fill input for seamless static flow
    const otpInput = document.getElementById('portal-otp-input');
    if (otpInput) otpInput.value = PORTAL_STATE.correctOtp;
  }

  // --- TOKEN AND OTP VALIDATION MATRICES ---
  function handleTokenValidation() {
    const tokenVal = document.getElementById('portal-token-input').value.trim();
    const otpVal = document.getElementById('portal-otp-input') ? document.getElementById('portal-otp-input').value.trim() : '';
    const errorOutput = document.getElementById('auth-error-output');
    const submitBtn = document.getElementById('auth-submit-btn');

    // Simple evaluation
    const matchesToken = tokenVal === PORTAL_STATE.correctToken;
    const matchesOtp = PORTAL_STATE.correctOtp === otpVal;

    if (matchesToken || matchesOtp) {
      // Initiate visual decrypt cycle
      triggerDecryptionPhase();
    } else {
      PORTAL_STATE.failedAttempts++;
      errorOutput.textContent = `CRITICAL DECRYPTION COLLISION [${PORTAL_STATE.failedAttempts} / 3]`;
      errorOutput.classList.remove('hidden');
      
      // Auto assist if they fail twice to help with static UX
      if (PORTAL_STATE.failedAttempts >= 2) {
        errorOutput.innerHTML = `DECRYPTION KEY HINT: Try code <strong class="text-white">${PORTAL_STATE.correctToken}</strong> or request OTP.`;
      }
    }
  }

  // --- PHYSICAL RAY DECRYPTION VISUAL SEQUENCE ---
  function triggerDecryptionPhase() {
    PORTAL_STATE.isDecrypting = true;
    const form = document.getElementById('secure-gate-form');
    if (!form) return;

    // Replace inputs with visual processing matrix
    form.innerHTML = `
      <div class="space-y-4 py-6">
        <div class="flex flex-col items-center justify-center space-y-4">
          <div class="relative w-16 h-16 flex items-center justify-center">
            <!-- Loading prism effect -->
            <div class="absolute inset-0 rounded-full border-2 border-dashed border-prism-blue animate-spin"></div>
            <svg class="w-6 h-6 text-prism-blue animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V9a5 5 0 00-9.794-1.879m14.441 2.11a13.978 13.978 0 01-1.127 3.045m-4.305-10.1c.75-.115 1.517-.174 2.296-.174a13.935 13.935 0 013.946.57m-10.4 11.2a10.003 10.003 0 01-3.67-3.672m13.67 3.672A10.004 10.004 0 0122 13v-2c0-2.224-1.084-4.2-2.768-5.46M12 11V9a5 5 0 00-4.794-4.879m0 0a5 5 0 019.588 0" />
            </svg>
          </div>
          <div class="space-y-1 w-full text-center">
            <span class="text-[10px] font-mono text-prism-green tracking-widest uppercase block animate-pulse">// INTEGRITY CHECKSUM VERIFIED</span>
            <div id="decrypt-console-output" class="font-mono text-[9px] text-white/40 h-8 overflow-hidden block"></div>
          </div>
        </div>
      </div>
    `;

    const consoleOutputs = [
      "// CONNECTING TUNNEL ROUTER [IP: 147.12.8.2]",
      "// PARSING PUBLIC QUANTUM HANDSHAKE...",
      "// INITIATING CHRONICLE SYMMETRIC CIPHER...",
      "// ROTATING DISPERSION COEFFICIENTS...",
      "// DECRYPTING BINARY PACKAGE METADATA...",
      "// METADATA VERIFIED SUCCESSFULLY // ACCESS GRANTED."
    ];

    let currentLog = 0;
    const outputDiv = document.getElementById('decrypt-console-output');

    function logNext() {
      if (currentLog < consoleOutputs.length) {
        outputDiv.innerHTML = `<span class="text-white">${consoleOutputs[currentLog]}</span>`;
        currentLog++;
        setTimeout(logNext, 550);
      } else {
        PORTAL_STATE.isAuthenticated = true;
        PORTAL_STATE.isDecrypting = false;
        // Re-render complete safe-room
        const container = document.getElementById('prism-secure-portal-overlay');
        renderVaultView(container);
      }
    }
    logNext();
  }

  // --- VAULT INTERFACE RENDER ---
  function renderVaultView(container) {
    if (!container) return;

    // Populate all selected files initially
    PORTAL_STATE.files.forEach(f => PORTAL_STATE.selectedFiles.add(f.id));

    container.innerHTML = `
      <div class="max-w-5xl w-full prism-glass rounded-2xl border border-prism-green/30 overflow-hidden relative shadow-2xl flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5 my-4">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-prism-green via-prism-blue to-prism-yellow"></div>
        
        <!-- Left Side: Encrypted Communications Message Log -->
        <div class="p-6 lg:p-8 lg:w-5/12 flex flex-col justify-between space-y-6">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-prism-green status-pulse"></span>
                <span class="font-mono text-[10px] text-prism-green uppercase tracking-widest font-bold">DECRYPTED SAFE ACCESS</span>
              </div>
              <button onclick="PrismAuthPortal.closePortal()" class="lg:hidden p-1 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Profile Info Card -->
            <div class="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
              <span class="text-[9px] font-mono text-prism-blue uppercase block tracking-wider">SECURED ORIGINAL SENDER</span>
              <div>
                <h4 class="text-base font-bold text-white leading-tight">${PORTAL_STATE.senderInfo.name}</h4>
                <p class="text-xs text-white/50">${PORTAL_STATE.senderInfo.role}</p>
                <p class="text-[10px] text-white/30 font-mono italic">${PORTAL_STATE.senderInfo.organization}</p>
              </div>
              <div class="pt-2 border-t border-white/5 flex justify-between text-[9px] font-mono text-white/40">
                <span>NODE: ${PORTAL_STATE.senderInfo.nodeHash}</span>
                <span>${PORTAL_STATE.senderInfo.sharedAt}</span>
              </div>
            </div>

            <!-- Message Block -->
            <div class="space-y-2">
              <span class="text-[9px] font-mono text-white/40 uppercase block tracking-wider">MEMO & PROTOCOLS STATEMENT</span>
              <div class="p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-white/80 leading-relaxed font-sans max-h-48 overflow-y-auto">
                ${PORTAL_STATE.senderInfo.message}
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-white/5 space-y-2 hidden lg:block">
            <div class="flex items-center space-x-2 text-[10px] font-mono text-white/40">
              <svg class="w-4 h-4 text-prism-green" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span>Verified TLS Handshake Active</span>
            </div>
            <p class="text-[9px] font-mono text-white/30">Downloads are logged and hash verified via blockchain verification metrics.</p>
          </div>
        </div>

        <!-- Right Side: Interactive Attachments Manager -->
        <div class="p-6 lg:p-8 lg:w-7/12 flex flex-col justify-between space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[9px] font-mono text-white/40 uppercase block tracking-wider">FILES IN CRYPTO-ENVELOPE</span>
              <h3 class="text-lg font-bold text-white uppercase tracking-tight">Attachment Index</h3>
            </div>
            <button onclick="PrismAuthPortal.closePortal()" class="hidden lg:block p-1 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition">
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Attachments Table -->
          <div class="space-y-2">
            <!-- Header actions -->
            <div class="flex items-center justify-between px-3 text-[10px] font-mono text-white/40">
              <div class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="select-all-files" 
                  checked 
                  onchange="PrismAuthPortal.toggleSelectAllFiles(this.checked)"
                  class="rounded accent-prism-green bg-black/40 border-white/10 cursor-pointer"
                >
                <label for="select-all-files" class="cursor-pointer hover:text-white transition uppercase">Select All</label>
              </div>
              <span class="uppercase">HASH / VERIFICATION CHECKSUM</span>
            </div>

            <!-- List of files -->
            <div class="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              ${PORTAL_STATE.files.map(f => `
                <div class="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-between transition group">
                  <div class="flex items-center space-x-3 min-w-0">
                    <input 
                      type="checkbox" 
                      id="cb-${f.id}" 
                      checked
                      onchange="PrismAuthPortal.toggleFileSelection('${f.id}')"
                      class="rounded accent-prism-green bg-black/40 border-white/10 cursor-pointer"
                    >
                    <div class="p-2 bg-black/30 rounded-lg text-white/60 group-hover:text-prism-blue transition">
                      ${f.type === 'pdf' ? `
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                      ` : `
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      `}
                    </div>
                    <div class="min-w-0">
                      <span class="text-xs font-bold text-white block truncate uppercase tracking-wide">${f.name}</span>
                      <span class="text-[9px] font-mono text-white/40 flex items-center space-x-2">
                        <span>${f.size}</span>
                        <span>&bull;</span>
                        <span class="text-[8px] bg-white/5 px-1 py-0.5 rounded text-white/50">${f.classification}</span>
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center space-x-3">
                    <span class="hidden md:inline font-mono text-[9px] text-white/30 truncate max-w-[120px]" title="${f.hash}">
                      ${f.hash}
                    </span>
                    <button onclick="PrismAuthPortal.downloadSingleFile('${f.id}')" class="p-1.5 rounded-lg bg-black/20 text-white/60 hover:text-white hover:bg-prism-blue/20 transition" title="Download File">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Master Action Controls -->
          <div class="pt-4 border-t border-white/5 space-y-4">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span class="text-[10px] font-mono text-white/40 uppercase text-center sm:text-left">
                SELECTED: <strong id="selected-files-count" class="text-prism-green">${PORTAL_STATE.selectedFiles.size}</strong> FILE(S) READY FOR PROCESSING
              </span>
              
              <div id="bundle-progress-container" class="hidden w-full sm:w-48 bg-black/40 rounded-full h-2 relative overflow-hidden border border-white/5">
                <div id="bundle-progress-bar" class="bg-gradient-to-r from-prism-blue to-prism-green h-full w-0 transition-all duration-300"></div>
              </div>
            </div>

            <button 
              id="bundle-download-btn"
              onclick="PrismAuthPortal.downloadSelectedBundle()" 
              class="w-full relative py-3.5 px-6 rounded-xl rainbow-border text-xs font-mono font-bold uppercase tracking-widest text-white hover:brightness-110 transition flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4 text-prism-blue animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" /></svg>
              <span>COMPILE & BUNDLE DECRYPTED TAR.ZIP</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- DYNAMIC SELECTION METRICS STATE RECONCILER ---
  function updateDownloadActionState() {
    const countEl = document.getElementById('selected-files-count');
    const bundleBtn = document.getElementById('bundle-download-btn');
    const selectAllCheckbox = document.getElementById('select-all-files');
    
    if (countEl) countEl.textContent = PORTAL_STATE.selectedFiles.size;
    
    if (bundleBtn) {
      if (PORTAL_STATE.selectedFiles.size === 0) {
        bundleBtn.setAttribute('disabled', 'true');
        bundleBtn.className = 'w-full py-3.5 px-6 rounded-xl bg-white/5 text-white/25 border border-white/5 font-mono text-xs font-bold uppercase tracking-widest cursor-not-allowed';
      } else {
        bundleBtn.removeAttribute('disabled');
        bundleBtn.className = 'w-full relative py-3.5 px-6 rounded-xl rainbow-border text-xs font-mono font-bold uppercase tracking-widest text-white hover:brightness-110 transition flex items-center justify-center space-x-2';
      }
    }

    if (selectAllCheckbox) {
      selectAllCheckbox.checked = PORTAL_STATE.selectedFiles.size === PORTAL_STATE.files.length;
    }
  }

  // --- COMPILATION & ZIP SIMULATOR HANDLER ---
  function triggerDownloadSimulation(fileIds) {
    const btn = document.getElementById('bundle-download-btn');
    const progressContainer = document.getElementById('bundle-progress-container');
    const progressBar = document.getElementById('bundle-progress-bar');
    
    if (btn) btn.classList.add('pointer-events-none', 'brightness-50');
    if (progressContainer) progressContainer.classList.remove('hidden');

    let percent = 0;
    const isSingle = fileIds.length === 1;
    const targetFiles = PORTAL_STATE.files.filter(f => fileIds.includes(f.id));
    
    const interval = setInterval(() => {
      percent += 8;
      if (progressBar) progressBar.style.width = `${Math.min(percent, 100)}%`;
      
      if (percent >= 100) {
        clearInterval(interval);
        
        // Hide progress
        setTimeout(() => {
          if (progressContainer) progressContainer.classList.add('hidden');
          if (progressBar) progressBar.style.width = '0%';
          if (btn) btn.classList.remove('pointer-events-none', 'brightness-50');
          
          // Dispatch fake dynamic client side payload
          const payloadMeta = {
            generationNode: "Prism Logic Cryptographic Node Alpha",
            timestamp: new Date().toISOString(),
            filesAssembled: targetFiles.map(f => ({ name: f.name, hash: f.hash, classification: f.classification }))
          };
          
          const filename = isSingle ? targetFiles[0].name : "Prism_Assembled_CapitalBundle.zip";
          dispatchPayload(filename, JSON.stringify(payloadMeta, null, 2));
        }, 500);
      }
    }, 120);
  }

  // --- DYNAMIC CLIENT FILE DISPATCH ---
  function dispatchPayload(filename, dataString) {
    const blob = new Blob([dataString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + ".prism"; // Appended prism encryption node structure
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Dynamic success feedback alert toast inline
    const toast = document.createElement('div');
    toast.className = 'fixed top-6 right-6 z-50 bg-prism-green/20 backdrop-blur-md p-4 rounded-xl border border-prism-green/40 shadow-2xl transition-all duration-500 transform translate-y-0 text-xs font-mono text-white flex items-center space-x-3';
    toast.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-prism-green status-pulse"></span>
      <span>PAYLOAD DOWNLOADED: ${filename}.prism Verified.</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-[-20px]');
      setTimeout(() => toast.remove(), 1000);
    }, 4000);
  }

})();