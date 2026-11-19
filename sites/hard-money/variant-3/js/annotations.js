// Collaborative Document Review Panel - PRISM LOGIC Integration
// File: js/annotations.js

(function () {
  // --- STATE MANAGEMENT ---
  const state = {
    isOpen: false,
    activeFileId: 'file-1',
    selectedTarget: 'General Workspace',
    activeTab: 'annotations', // 'annotations' | 'revisions'
    approvalStatus: 'PENDING SIGN-OFF', // 'PENDING SIGN-OFF' | 'UNDER REVIEW' | 'APPROVED' | 'REJECTED'
    files: {
      'file-1': {
        name: 'lender_agreement_v2.pdf',
        type: 'pdf',
        content: [
          { id: 'p1', text: '1. PRINCIPAL AND LIQUIDITY ACCORD: The direct capital provider agrees to maintain a minimum liquidity reservoir equivalent to 15% of the total aggregate underwriting limit specified in Section 4.2.' },
          { id: 'p2', text: '2. LOAN-TO-VALUE (LTV) RATIOS: Under no circumstances shall the standard maximum LTV ratio exceed 85.0% for residential redevelopment assets or 75.0% for commercial mixed-use developments.' },
          { id: 'p3', text: '3. INTEREST RATE INDEXING: Starting yields are calculated utilizing the dynamic Prism Spectral Matrix index + 420 basis points, subject to a minimum floor of 7.99% per annum.' },
          { id: 'p4', text: '4. SPEED OF DISBURSEMENT: The capital source represents and warrants that standard compliance and underwriting clearances shall be finalized within 5 business days of transaction initialization.' }
        ]
      },
      'file-2': {
        name: 'underwriting_rules.json',
        type: 'json',
        content: [
          { id: 'line-1', text: '{' },
          { id: 'line-2', text: '  "system_node": "PRISM-CORE-WEST",' },
          { id: 'line-3', text: '  "max_aggregate_ltv": 0.85,' },
          { id: 'line-4', text: '  "interest_floor_basis": 0.0799,' },
          { id: 'line-5', text: '  "auto_approve_tier_1": true,' },
          { id: 'line-6', text: '  "restricted_state_codes": ["AK", "HI", "SD"],' },
          { id: 'line-7', text: '  "audit_trigger_limit_usd": 15000000' },
          { id: 'line-8', text: '}' }
        ]
      },
      'file-3': {
        name: 'portfolio_matrix.csv',
        type: 'csv',
        headers: ['LID', 'Focus Asset', 'Max LTV', 'Starting Rate', 'Max Capital'],
        rows: [
          { id: 'row-1', data: ['L-101', 'Fix & Flip', '85%', '8.49%', '$12,500,000'] },
          { id: 'row-2', data: ['L-102', 'Commercial', '75%', '7.99%', '$35,000,000'] },
          { id: 'row-3', data: ['L-103', 'Bridge Loans', '80%', '8.99%', '$15,000,000'] },
          { id: 'row-4', data: ['L-104', 'Rental / DSCR', '90%', '9.25%', '$5,000,000'] }
        ]
      }
    },
    annotations: [
      {
        id: 'ann-1',
        fileId: 'file-1',
        targetId: 'p2',
        user: 'A. Vance (Risk Controller)',
        role: 'Risk Architect',
        text: 'Confirming if this threshold is compliant with standard sovereign baseline reserves.',
        status: 'Critical',
        timestamp: '10 mins ago'
      },
      {
        id: 'ann-2',
        fileId: 'file-1',
        targetId: 'p4',
        user: 'M. Ross (UW Lead)',
        role: 'Underwriter',
        text: 'Speed parameter successfully validated. 5 days matches current node transaction pipeline.',
        status: 'Resolved',
        timestamp: '2 hours ago'
      },
      {
        id: 'ann-3',
        fileId: 'file-2',
        targetId: 'line-6',
        user: 'E. Thorne (Legal Counsel)',
        role: 'Compliance',
        text: 'Hawaii (HI) state guidelines may require specific local notary declarations before direct deployment.',
        status: 'Pending',
        timestamp: '1 hour ago'
      },
      {
        id: 'ann-4',
        fileId: 'file-3',
        targetId: 'row-2',
        user: 'K. Patel (Capital Markets)',
        role: 'Partner',
        text: 'Obsidian Funding cap increased to $35M. Checked with internal treasury metrics.',
        status: 'Resolved',
        timestamp: 'Yesterday'
      }
    ],
    revisions: [
      { action: 'INITIALIZED WORKSPACE', details: 'Collaboration session synchronized.', user: 'SYSTEM', time: '4 hours ago' },
      { action: 'ANNOTATION DEPLOYED', details: 'A. Vance added comment on LTV metrics.', user: 'A. Vance', time: '10 mins ago' },
      { action: 'STATUS RE-INDEXED', details: 'Approval level set to PENDING SIGN-OFF.', user: 'SYSTEM', time: 'Just now' }
    ]
  };

  // --- DYNAMIC INJECTION OF WORKSPACE BUTTON & CSS ---
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .workspace-glow {
        box-shadow: 0 0 25px rgba(139, 92, 246, 0.15);
        border: 1px solid rgba(139, 92, 246, 0.25);
      }
      .workspace-grid-bg {
        background-size: 30px 30px;
        background-image: 
          linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
      }
    `;
    document.head.appendChild(style);
  }

  function injectWorkspaceButton() {
    // Find Header controls section to append the Workspace launcher
    const headerControls = document.querySelector('header .flex.items-center.space-x-3');
    if (!headerControls) return;

    // Create custom Workspace launcher
    const btn = document.createElement('button');
    btn.id = 'trigger-workspace-btn';
    btn.className = 'relative flex items-center space-x-2 bg-gradient-to-r from-prism-purple/20 to-prism-blue/20 hover:from-prism-purple/35 hover:to-prism-blue/35 text-white text-xs font-semibold py-2 px-4 rounded-lg border border-prism-purple/40 transition duration-300';
    btn.innerHTML = `
      <i data-lucide="layers" class="w-4 h-4 text-prism-purple animate-pulse"></i>
      <span>Review Workspace</span>
    `;
    btn.addEventListener('click', toggleWorkspace);

    // Insert before the last button (help circle)
    headerControls.insertBefore(btn, headerControls.lastElementChild);
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function injectWorkspaceOverlay() {
    if (document.getElementById('prism-workspace-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'prism-workspace-overlay';
    overlay.className = 'fixed inset-0 z-50 bg-prism-black/95 backdrop-blur-xl hidden flex-col font-sans text-slate-100 transition-all duration-300 opacity-0';
    
    // Construct the overlay structure
    overlay.innerHTML = `
      <!-- Workspace Header -->
      <header class="border-b border-white/10 bg-prism-charcoal/80 h-16 px-6 flex items-center justify-between sticky top-0 z-10">
        <div class="flex items-center space-x-4">
          <div class="relative w-8 h-8 flex items-center justify-center rainbow-border rounded-lg">
            <i data-lucide="layers" class="w-4 h-4 text-white"></i>
          </div>
          <div>
            <span class="font-mono text-[9px] text-prism-purple tracking-[0.3em] font-semibold block">PRISM LOGIC SECURE NODE</span>
            <h2 class="text-sm font-bold tracking-tight text-white flex items-center gap-2 uppercase">
              COLLABORATIVE DOCUMENT REVIEW PANEL <span class="text-[9px] bg-prism-purple/10 text-prism-purple px-1.5 py-0.5 rounded font-mono border border-prism-purple/20">LIVE-SYNC</span>
            </h2>
          </div>
        </div>

        <!-- Approval Action & Metadata -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
            <span class="text-[10px] font-mono text-white/40 uppercase">STATUS:</span>
            <span id="workspace-status-badge" class="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-prism-yellow/10 text-prism-yellow border border-prism-yellow/20">
              PENDING SIGN-OFF
            </span>
          </div>

          <!-- Close Panel -->
          <button id="close-workspace-btn" class="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </header>

      <!-- Main workspace split screen -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden workspace-grid-bg">
        
        <!-- Left Pane: File Viewer (Column 1-7) -->
        <div class="lg:col-span-7 flex flex-col border-r border-white/5 overflow-hidden">
          
          <!-- File selection ribbon -->
          <div class="bg-black/40 border-b border-white/5 p-3 flex items-center justify-between">
            <div class="flex items-center space-x-2" id="workspace-file-tabs">
              <!-- Rendered Dynamically -->
            </div>
            <div class="text-[10px] font-mono text-white/30 hidden md:block">
              // CLICK SEGMENTS TO MAP PRECISE ANNOTATIONS
            </div>
          </div>

          <!-- Live Preview Arena -->
          <div class="flex-1 p-6 overflow-y-auto" id="workspace-file-viewport">
            <!-- Active File Content Rendered Dynamically -->
          </div>

          <!-- Highlight Selection Indicator -->
          <div class="bg-prism-charcoal/80 border-t border-white/5 px-6 py-2.5 flex items-center justify-between text-xs font-mono">
            <div class="flex items-center space-x-2">
              <span class="w-1.5 h-1.5 rounded-full bg-prism-blue animate-ping"></span>
              <span class="text-white/40">MAPPED REFERENCE TARGET:</span>
              <span id="selected-target-label" class="text-prism-blue font-bold">General Workspace</span>
            </div>
            <button id="clear-target-btn" class="text-[10px] text-white/30 hover:text-white underline">
              Reset Focus
            </button>
          </div>
        </div>

        <!-- Right Pane: Collaboration Hub & Actions (Column 8-12) -->
        <div class="lg:col-span-5 flex flex-col overflow-hidden bg-prism-charcoal/30">
          
          <!-- Hub Tabs Header -->
          <div class="grid grid-cols-2 border-b border-white/5 text-center text-xs font-mono">
            <button id="tab-annotations-btn" class="py-3.5 border-b-2 font-bold transition focus:outline-none border-prism-purple text-prism-purple">
              ANNOTATIONS FEED
            </button>
            <button id="tab-revisions-btn" class="py-3.5 border-b-2 font-bold transition focus:outline-none border-transparent text-white/40 hover:text-white">
              REVISION LOG
            </button>
          </div>

          <!-- Feed Wrapper -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6" id="workspace-hub-feed">
            <!-- Dynamic Content based on selected tab -->
          </div>

          <!-- Footer Control Box: Form & Exporters -->
          <div class="p-6 bg-prism-black border-t border-white/5 space-y-4">
            
            <!-- Quick Annotation Formulation Form -->
            <form id="new-annotation-form" class="space-y-3">
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="block text-[10px] font-mono text-white/40 uppercase mb-1">MEMBER ASSIGNMENT</label>
                  <select id="ann-user-role" class="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-prism-purple">
                    <option value="Lead Auditor">Lead Auditor (Reviewer)</option>
                    <option value="Risk Controller">Risk Controller (Reviewer)</option>
                    <option value="Compliance Counsel">Compliance Counsel</option>
                    <option value="Direct Underwriter">Direct Underwriter</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-mono text-white/40 uppercase mb-1">PRIORITY PRIORITY</label>
                  <select id="ann-status" class="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-prism-purple">
                    <option value="Pending">Pending Audit</option>
                    <option value="Critical">Critical Patch</option>
                    <option value="Resolved">Pre-Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea id="ann-text" required placeholder="Inject comment mapped to target sector..." rows="2" class="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-prism-purple"></textarea>
              </div>

              <div class="flex items-center justify-between gap-3">
                <!-- System Action Checkboxes -->
                <div class="flex flex-col space-y-1">
                  <div class="flex items-center space-x-2">
                    <button type="button" id="toggle-approval-stage" class="px-2 py-1 text-[9px] font-mono font-bold tracking-wider rounded bg-prism-green/10 text-prism-green border border-prism-green/20 hover:bg-prism-green/20 transition">
                      CYCLE APPROVAL STATE
                    </button>
                  </div>
                </div>

                <button type="submit" class="bg-gradient-to-r from-prism-purple to-prism-blue text-white hover:brightness-110 px-4 py-2 rounded-lg border border-white/10 font-mono text-xs font-bold transition flex items-center space-x-1.5">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                  <span>INJECT COMMENT</span>
                </button>
              </div>
            </form>

            <!-- Export logs and tools utility bar -->
            <div class="flex items-center justify-between pt-4 border-t border-white/5 text-[11px] font-mono text-white/40">
              <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-prism-green status-pulse"></span>
                REVISION SYNC NODE: ACTIVE
              </span>
              <button id="export-log-btn" class="flex items-center space-x-1 bg-white/5 hover:bg-white/10 text-white hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition">
                <i data-lucide="download" class="w-3.5 h-3.5 text-prism-blue"></i>
                <span>EXPORT REVISION ARCHIVE</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    `;

    document.body.appendChild(overlay);

    // Attach DOM Action listeners
    document.getElementById('close-workspace-btn').addEventListener('click', toggleWorkspace);
    document.getElementById('clear-target-btn').addEventListener('click', () => setTarget('General Workspace'));
    document.getElementById('tab-annotations-btn').addEventListener('click', () => switchTab('annotations'));
    document.getElementById('tab-revisions-btn').addEventListener('click', () => switchTab('revisions'));
    document.getElementById('new-annotation-form').addEventListener('submit', handleAnnotationSubmit);
    document.getElementById('toggle-approval-stage').addEventListener('click', cycleApproval);
    document.getElementById('export-log-btn').addEventListener('click', exportRevisionLog);
  }

  // --- ACTIONS & HANDLERS ---
  function toggleWorkspace() {
    state.isOpen = !state.isOpen;
    const overlay = document.getElementById('prism-workspace-overlay');
    if (!overlay) return;

    if (state.isOpen) {
      overlay.classList.remove('hidden');
      setTimeout(() => {
        overlay.classList.add('opacity-100');
        overlay.classList.remove('opacity-0');
      }, 50);
      renderTabs();
      renderActiveFile();
      renderHubFeed();
    } else {
      overlay.classList.add('opacity-0');
      overlay.classList.remove('opacity-100');
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 300);
    }
  }

  function selectFile(fileId) {
    state.activeFileId = fileId;
    state.selectedTarget = 'General Workspace';
    renderTabs();
    renderActiveFile();
    renderHubFeed();
  }

  function setTarget(targetId) {
    state.selectedTarget = targetId;
    document.getElementById('selected-target-label').textContent = targetId;
    
    // Highlight elements visually
    document.querySelectorAll('[data-annotate-target]').forEach(el => {
      if (el.getAttribute('data-annotate-target') === targetId) {
        el.classList.add('border-prism-blue', 'bg-prism-blue/5');
      } else {
        el.classList.remove('border-prism-blue', 'bg-prism-blue/5');
      }
    });
  }

  function switchTab(tab) {
    state.activeTab = tab;
    const annBtn = document.getElementById('tab-annotations-btn');
    const revBtn = document.getElementById('tab-revisions-btn');

    if (tab === 'annotations') {
      annBtn.className = 'py-3.5 border-b-2 font-bold transition focus:outline-none border-prism-purple text-prism-purple';
      revBtn.className = 'py-3.5 border-b-2 font-bold transition focus:outline-none border-transparent text-white/40 hover:text-white';
    } else {
      annBtn.className = 'py-3.5 border-b-2 font-bold transition focus:outline-none border-transparent text-white/40 hover:text-white';
      revBtn.className = 'py-3.5 border-b-2 font-bold transition focus:outline-none border-prism-purple text-prism-purple';
    }
    renderHubFeed();
  }

  function cycleApproval() {
    const states = ['PENDING SIGN-OFF', 'UNDER REVIEW', 'APPROVED', 'REJECTED'];
    let idx = states.indexOf(state.approvalStatus);
    state.approvalStatus = states[(idx + 1) % states.length];

    // Update Revision logs
    state.revisions.unshift({
      action: 'APPROVAL LEVEL SHIFT',
      details: `Workspace status updated to: ${state.approvalStatus}`,
      user: 'SYSTEM NODE',
      time: 'Just now'
    });

    renderWorkspaceApprovalBadge();
    if (state.activeTab === 'revisions') {
      renderHubFeed();
    }
  }

  function renderWorkspaceApprovalBadge() {
    const badge = document.getElementById('workspace-status-badge');
    if (!badge) return;
    badge.textContent = state.approvalStatus;

    badge.className = 'text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border';
    if (state.approvalStatus === 'APPROVED') {
      badge.classList.add('bg-prism-green/10', 'text-prism-green', 'border-prism-green/20');
    } else if (state.approvalStatus === 'REJECTED') {
      badge.classList.add('bg-prism-red/10', 'text-prism-red', 'border-prism-red/20');
    } else if (state.approvalStatus === 'UNDER REVIEW') {
      badge.classList.add('bg-prism-blue/10', 'text-prism-blue', 'border-prism-blue/20');
    } else {
      badge.classList.add('bg-prism-yellow/10', 'text-prism-yellow', 'border-prism-yellow/20');
    }
  }

  function handleAnnotationSubmit(e) {
    e.preventDefault();
    const roleSelect = document.getElementById('ann-user-role');
    const statusSelect = document.getElementById('ann-status');
    const txtArea = document.getElementById('ann-text');

    const newAnn = {
      id: `ann-${Date.now()}`,
      fileId: state.activeFileId,
      targetId: state.selectedTarget,
      user: `Anonymous (${roleSelect.value})`,
      role: roleSelect.value,
      text: txtArea.value,
      status: statusSelect.value,
      timestamp: 'Just now'
    };

    state.annotations.unshift(newAnn);

    state.revisions.unshift({
      action: 'ANNOTATION DEPLOYED',
      details: `Added compliance review block tagged to sector [${state.selectedTarget}].`,
      user: 'User Node',
      time: 'Just now'
    });

    // Reset inputs
    txtArea.value = '';
    
    // Refresh components
    renderActiveFile();
    renderHubFeed();
  }

  function resolveAnnotation(id) {
    const ann = state.annotations.find(a => a.id === id);
    if (ann) {
      ann.status = ann.status === 'Resolved' ? 'Pending' : 'Resolved';
      
      state.revisions.unshift({
        action: 'STATUS RE-INDEXED',
        details: `Annotation [${ann.id}] modified status to [${ann.status}].`,
        user: 'Lead Auditor',
        time: 'Just now'
      });

      renderActiveFile();
      renderHubFeed();
    }
  }

  function exportRevisionLog() {
    const formattedData = {
      workspace: "PRISM SPECS WORKSPACE // ACTIVE HANDSHAKE REVIEW PROTOCOL",
      exportedAt: new Date().toISOString(),
      currentApprovalStatus: state.approvalStatus,
      annotations: state.annotations,
      revisions: state.revisions
    };

    const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prism-logic-review-log-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- RENDERING SUB-ELEMENTS ---
  function renderTabs() {
    const container = document.getElementById('workspace-file-tabs');
    if (!container) return;

    container.innerHTML = Object.keys(state.files).map(id => {
      const active = state.activeFileId === id;
      const file = state.files[id];
      let icon = 'file-text';
      if (file.type === 'json') icon = 'code';
      if (file.type === 'csv') icon = 'table';

      return `
        <button onclick="PrismWorkspace.selectFile('${id}')" class="flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition ${
          active 
            ? 'bg-prism-purple/15 text-white border-prism-purple/40 shadow-inner' 
            : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
        }">
          <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
          <span>${file.name}</span>
        </button>
      `;
    }).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderActiveFile() {
    const viewport = document.getElementById('workspace-file-viewport');
    if (!viewport) return;

    const file = state.files[state.activeFileId];
    viewport.innerHTML = '';

    if (file.type === 'pdf') {
      const container = document.createElement('div');
      container.className = 'space-y-4 font-sans text-sm max-w-2xl mx-auto';
      
      file.content.forEach(p => {
        const hasAnn = state.annotations.some(a => a.fileId === state.activeFileId && a.targetId === p.id);
        const selected = state.selectedTarget === p.id;
        
        container.innerHTML += `
          <div 
            data-annotate-target="${p.id}" 
            onclick="PrismWorkspace.setTarget('${p.id}')"
            class="group p-4 rounded-xl border transition-all cursor-pointer ${
              selected 
                ? 'border-prism-blue bg-prism-blue/5' 
                : 'border-white/5 bg-black/20 hover:border-white/10 hover:bg-black/30'
            }"
          >
            <div class="flex items-start justify-between">
              <p class="text-white/80 leading-relaxed text-xs sm:text-sm flex-1">${p.text}</p>
              <div class="ml-4 flex items-center space-x-1.5 pt-0.5">
                ${hasAnn ? `<span class="w-2 h-2 rounded-full bg-prism-red status-pulse"></span>` : ''}
                <i data-lucide="message-square" class="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition"></i>
              </div>
            </div>
          </div>
        `;
      });
      viewport.appendChild(container);

    } else if (file.type === 'json') {
      const container = document.createElement('div');
      container.className = 'font-mono text-xs bg-black/60 p-4 rounded-xl border border-white/5 max-w-2xl mx-auto space-y-1';
      
      file.content.forEach(line => {
        const hasAnn = state.annotations.some(a => a.fileId === state.activeFileId && a.targetId === line.id);
        const selected = state.selectedTarget === line.id;

        container.innerHTML += `
          <div 
            data-annotate-target="${line.id}"
            onclick="PrismWorkspace.setTarget('${line.id}')"
            class="flex items-center justify-between py-1 px-2 rounded cursor-pointer transition ${
              selected 
                ? 'bg-prism-blue/10 border-l-2 border-prism-blue' 
                : 'hover:bg-white/5'
            }"
          >
            <div class="flex items-center space-x-4">
              <span class="text-white/20 text-right w-6 select-none">${line.id.split('-')[1]}</span>
              <pre class="text-prism-green font-medium">${line.text}</pre>
            </div>
            ${hasAnn ? `<span class="w-1.5 h-1.5 rounded-full bg-prism-red"></span>` : ''}
          </div>
        `;
      });
      viewport.appendChild(container);

    } else if (file.type === 'csv') {
      const container = document.createElement('div');
      container.className = 'overflow-x-auto max-w-3xl mx-auto';
      
      let tableHtml = `
        <table class="w-full text-xs font-mono text-slate-300 border-collapse">
          <thead>
            <tr class="bg-black/60 border-b border-white/10 text-white/40 text-left">
              ${file.headers.map(h => `<th class="p-3 uppercase font-semibold tracking-wider">${h}</th>`).join('')}
              <th class="p-3 text-right">MAPPING</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
      `;

      file.rows.forEach(row => {
        const hasAnn = state.annotations.some(a => a.fileId === state.activeFileId && a.targetId === row.id);
        const selected = state.selectedTarget === row.id;

        tableHtml += `
          <tr 
            data-annotate-target="${row.id}"
            onclick="PrismWorkspace.setTarget('${row.id}')"
            class="cursor-pointer transition ${
              selected ? 'bg-prism-blue/15 text-white' : 'hover:bg-white/5'
            }"
          >
            ${row.data.map(val => `<td class="p-3 font-semibold">${val}</td>`).join('')}
            <td class="p-3 text-right">
              <div class="inline-flex items-center space-x-1.5">
                ${hasAnn ? `<span class="w-1.5 h-1.5 rounded-full bg-prism-red status-pulse"></span>` : ''}
                <i data-lucide="crosshair" class="w-3.5 h-3.5 text-white/30 hover:text-white transition"></i>
              </div>
            </td>
          </tr>
        `;
      });

      tableHtml += `</tbody></table>`;
      container.innerHTML = tableHtml;
      viewport.appendChild(container);
    }

    // Set visually defined target selector values
    document.getElementById('selected-target-label').textContent = state.selectedTarget;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderHubFeed() {
    const feed = document.getElementById('workspace-hub-feed');
    if (!feed) return;

    feed.innerHTML = '';

    if (state.activeTab === 'annotations') {
      // Filter annotations that match only the currently active file ID
      const filtered = state.annotations.filter(a => a.fileId === state.activeFileId);

      if (filtered.length === 0) {
        feed.innerHTML = `
          <div class="text-center py-10">
            <i data-lucide="info" class="w-8 h-8 text-white/20 mx-auto mb-3"></i>
            <p class="text-xs text-white/40">No localized annotations detected in active workspace.</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      filtered.forEach(ann => {
        const isResolved = ann.status === 'Resolved';
        const isCritical = ann.status === 'Critical';

        feed.innerHTML += `
          <div class="prism-glass p-4 rounded-xl border border-white/5 space-y-3 relative group">
            
            <!-- Target index badge top right -->
            <div class="absolute top-3 right-3 text-[9px] font-mono text-white/30">
              TARGET ID: [${ann.targetId}]
            </div>

            <!-- Profile context -->
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-prism-purple to-prism-blue flex items-center justify-center font-mono text-[10px] text-white font-bold">
                ${ann.user.charAt(0)}
              </div>
              <div>
                <div class="text-xs font-bold text-white">${ann.user}</div>
                <div class="text-[9px] font-mono uppercase tracking-wider text-prism-purple">${ann.role}</div>
              </div>
            </div>

            <!-- Text Content -->
            <p class="text-xs text-white/70 leading-relaxed">${ann.text}</p>

            <!-- Status action row -->
            <div class="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] font-mono">
              <span class="text-white/30">${ann.timestamp}</span>
              
              <div class="flex items-center space-x-2">
                <!-- Priority label -->
                <span class="px-2 py-0.5 rounded ${
                  isResolved 
                    ? 'bg-prism-green/10 text-prism-green border border-prism-green/15' 
                    : isCritical 
                    ? 'bg-prism-red/10 text-prism-red border border-prism-red/15'
                    : 'bg-prism-yellow/10 text-prism-yellow border border-prism-yellow/15'
                }">
                  ${ann.status}
                </span>

                <!-- Action Button -->
                <button onclick="PrismWorkspace.resolveAnnotation('${ann.id}')" class="text-white/40 hover:text-white hover:underline transition">
                  ${isResolved ? 'Reopen' : 'Mark Resolved'}
                </button>
              </div>
            </div>

          </div>
        `;
      });

    } else {
      // Render the Revision Logs
      if (state.revisions.length === 0) {
        feed.innerHTML = `<p class="text-xs text-white/40 text-center py-10">No modification histories verified on this node.</p>`;
        return;
      }

      state.revisions.forEach(rev => {
        feed.innerHTML += `
          <div class="flex space-x-4 text-xs font-mono">
            <div class="flex flex-col items-center">
              <div class="w-2 h-2 rounded-full bg-prism-purple"></div>
              <div class="flex-1 w-px bg-white/10 my-1"></div>
            </div>
            <div class="flex-1 pb-4">
              <div class="flex items-center justify-between text-white/40 text-[10px]">
                <span>${rev.time}</span>
                <span class="text-prism-purple">${rev.user}</span>
              </div>
              <div class="font-bold text-white mt-0.5">${rev.action}</div>
              <p class="text-[11px] text-white/50 mt-1 leading-relaxed">${rev.details}</p>
            </div>
          </div>
        `;
      });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- INITIALIZE INTEGRATION ---
  function init() {
    injectStyles();
    injectWorkspaceButton();
    injectWorkspaceOverlay();
    renderWorkspaceApprovalBadge();
  }

  // Expose Workspace state and trigger points to window object
  window.PrismWorkspace = {
    init,
    toggleWorkspace,
    selectFile,
    setTarget,
    switchTab,
    resolveAnnotation,
    cycleApproval
  };

  // Run automatically when DOM content is loaded
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();