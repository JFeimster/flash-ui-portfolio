// Collaborative Document Review Panel - Core Controller & Interface Injection
// Designed specifically to integrate with the PRISM LOGIC system styling and workflow matrices.

(function () {
  // Mock State Management
  const state = {
    activeDoc: 'term-sheet',
    documents: {
      'term-sheet': {
        name: 'Underwriting_Term_Sheet_v2.4.txt',
        type: 'text',
        content: `===================================================================
PRISM PRIVATE CREDIT CAPITAL // SECURED DEBT INSTRUMENT v2.4
===================================================================

PROJECT REFERENCE: MULTI-FAMILY ACQUISITION & REHAB MATRIX
CUSTODIAN OF REVENUE: APEX PRISM CAPITAL
TARGET ASSET: 448 NEON HORIZON BLVD, LAS VEGAS, NV

1. PRINCIPAL LOAN DATA
-------------------------------------------------------------------
1.1 MAXIMUM ACQUISITION LTV: 85.00% of appraised value.
1.2 PROPOSED LOAN AMOUNT: $8,450,000 (Direct Allocation Portfolio)
1.3 STARTING INTEREST RATE: 8.49% Per Annum (Floating adjusted to SOFR)
1.4 ORIGINATION FEE: 1.50 Points payable at physical close.
1.5 SPONSOR EQUITY CONTRIBUTION: Minimum 15.00% cash liquidity.

2. DISBURSEMENT CONDITIONS & INSPECTIONS
-------------------------------------------------------------------
2.1 Initial capital allocation of $5,200,000 disbursed at day 0.
2.2 Progress draws for construction/rehab released in 5 stages.
2.3 Dynamic verification checks required for each capital draw.
2.4 No prepayment penalties applied after month 6 of service.

3. COVENANTS AND DEFAULT RATIOS
-------------------------------------------------------------------
3.1 Minimum debt service coverage ratio (DSCR) requirement: 1.20x.
3.2 Capital reserve maintenance of 6 months interest buffer.
3.3 Appraisal values must align with the spectral baseline indexing models.`
      },
      'blueprint': {
        name: 'Property_Appraisal_Map_v3.svg',
        type: 'map',
        url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80'
      },
      'ltv-matrix': {
        name: 'LTV_Financial_Spectrum.json',
        type: 'matrix',
        data: [
          { category: "Acquisition Limit", value: "85%", risk: "Low", trigger: "Auto-Approved" },
          { category: "Rehab Stage 1 Draw", value: "$1,250,000", risk: "Medium", trigger: "Inspection Clear" },
          { category: "Rehab Stage 2 Draw", value: "$950,000", risk: "Medium", trigger: "Architect Sign-off" },
          { category: "Exit Refinance Buffer", value: "72.4% LTV", risk: "Low", trigger: "Market Indexing" },
          { category: "Sponsor Equity Lock", value: "15.0%", risk: "High", trigger: "Capital Call Proof" }
        ]
      }
    },
    annotations: [
      { id: 1, docId: 'term-sheet', author: 'Sponsor Lead', text: 'Confirming if the 1.50 Points origination fee can be rolled into the loan balance.', line: 12, resolved: false, timestamp: '14 mins ago' },
      { id: 2, docId: 'blueprint', author: 'Principal Surveyor', text: 'Ensure the main structural core matches the safety offset specifications.', x: 42, y: 35, resolved: false, timestamp: '8 mins ago' },
      { id: 3, docId: 'ltv-matrix', author: 'Risk Desk v4', text: 'Verify if the Exit Refinance threshold drops if interest rates exceed 11%.', row: 3, resolved: true, timestamp: '1 hour ago' }
    ],
    approvalStatus: 'under-review', // 'under-review' | 'approved' | 'revision-required'
    history: [
      { action: 'Session Initialized', user: 'System Node', time: '1 hr ago', color: 'text-prism-blue' },
      { action: 'Approved financial matrix formulas', user: 'Risk Desk v4', time: '42 mins ago', color: 'text-prism-green' },
      { action: 'Added appraisal document review point', user: 'Principal Surveyor', time: '8 mins ago', color: 'text-prism-red' }
    ]
  };

  // Inject UI Components
  function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      .prism-blueprint-grid {
        background-size: 20px 20px;
        background-image: 
          linear-gradient(to right, rgba(0, 240, 255, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 240, 255, 0.08) 1px, transparent 1px);
      }
      .prism-highlight-line:hover {
        background: rgba(139, 92, 246, 0.15);
        cursor: pointer;
      }
      .prism-badge-active {
        box-shadow: 0 0 12px currentColor;
      }
    `;
    document.head.appendChild(style);
  }

  function renderCollaborativeSection() {
    // Find injection slot right before footer
    const footer = document.querySelector('footer');
    if (!footer) return;

    const section = document.createElement('section');
    section.id = 'prism-review-workspace';
    section.className = 'border-t border-white/5 bg-prism-charcoal/50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden';
    
    // Aesthetic background glows
    section.innerHTML = `
      <div class="absolute top-[20%] left-[-5%] w-[30%] h-[40%] bg-prism-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] bg-prism-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto space-y-8 relative z-10">
        
        <!-- Section Header -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div class="space-y-2">
            <div class="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <span class="w-2 h-2 rounded-full bg-prism-purple status-pulse"></span>
              <span class="text-[10px] font-mono tracking-widest text-white/80 uppercase">Secured Handshake Workspace</span>
            </div>
            <h2 class="text-3xl font-black text-white uppercase tracking-tight">
              Underwriting <span class="text-transparent bg-clip-text bg-gradient-to-r from-prism-blue via-prism-purple to-prism-red">Collaboration Lab</span>
            </h2>
            <p class="text-white/60 text-xs md:text-sm">
              Real-time multi-party document review workspace. Inspect asset structures, draft parameters, resolve issues, and register physical consensus.
            </p>
          </div>

          <!-- Master Approval Status Controller -->
          <div class="prism-glass p-4 rounded-xl border border-white/10 flex flex-wrap items-center gap-4">
            <span class="text-[10px] font-mono text-white/40 uppercase tracking-widest block lg:inline">Consensus Matrix:</span>
            
            <div class="flex items-center space-x-2">
              <button id="btn-status-review" onclick="window.PrismReview.updateStatus('under-review')" class="px-3 py-1.5 rounded text-xs font-mono border transition flex items-center space-x-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-prism-yellow"></span>
                <span>Reviewing</span>
              </button>
              <button id="btn-status-approved" onclick="window.PrismReview.updateStatus('approved')" class="px-3 py-1.5 rounded text-xs font-mono border transition flex items-center space-x-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-prism-green"></span>
                <span>Approve Document</span>
              </button>
              <button id="btn-status-revision" onclick="window.PrismReview.updateStatus('revision-required')" class="px-3 py-1.5 rounded text-xs font-mono border transition flex items-center space-x-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-prism-red"></span>
                <span>Flag Revise</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Split Screen Workspace Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- LEFT DOCK: Interactive Viewer (7 Columns) -->
          <div class="lg:col-span-7 flex flex-col space-y-4">
            
            <!-- Tab Controls -->
            <div class="flex items-center justify-between bg-black/40 p-1.5 rounded-xl border border-white/5">
              <div class="flex items-center space-x-1">
                <button id="tab-term-sheet" onclick="window.PrismReview.switchDoc('term-sheet')" class="px-3 py-2 rounded-lg text-xs font-mono transition">
                  Underwriting_Terms.txt
                </button>
                <button id="tab-blueprint" onclick="window.PrismReview.switchDoc('blueprint')" class="px-3 py-2 rounded-lg text-xs font-mono transition">
                  Property_Blueprint.svg
                </button>
                <button id="tab-ltv-matrix" onclick="window.PrismReview.switchDoc('ltv-matrix')" class="px-3 py-2 rounded-lg text-xs font-mono transition">
                  LTV_Spectrum.json
                </button>
              </div>
              <div class="text-[10px] font-mono text-white/40 pr-3 hidden sm:block">
                // SECURE WORKSPACE
              </div>
            </div>

            <!-- Viewer Window -->
            <div id="prism-viewer-window" class="prism-glass rounded-2xl border border-white/10 min-h-[420px] max-h-[550px] overflow-y-auto relative flex flex-col">
              <!-- Rendered programmatically -->
            </div>

            <!-- Interactive Helper Prompt -->
            <div id="viewer-action-hint" class="text-[10px] font-mono text-white/40 flex items-center space-x-2 px-2">
              <span class="w-1.5 h-1.5 bg-prism-blue rounded-full animate-pulse"></span>
              <span id="hint-text">Select any line on the term sheet to pin an analytical annotation instantly.</span>
            </div>

          </div>

          <!-- RIGHT DOCK: Collaborative Board & History (5 Columns) -->
          <div class="lg:col-span-5 flex flex-col space-y-6">
            
            <!-- Annotations Panel -->
            <div class="prism-glass rounded-2xl border border-white/10 p-5 flex flex-col h-[280px]">
              <div class="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                <div class="flex items-center space-x-2">
                  <i data-lucide="message-square" class="w-4 h-4 text-prism-purple"></i>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-white">Interactive Annotations (<span id="annotation-count">0</span>)</h3>
                </div>
                <button onclick="window.PrismReview.exportReviewLog()" class="text-[10px] text-prism-blue font-mono hover:underline flex items-center space-x-1">
                  <i data-lucide="download" class="w-3 h-3"></i>
                  <span>Export Log</span>
                </button>
              </div>

              <!-- Annotation Container List -->
              <div id="annotation-list" class="flex-1 overflow-y-auto space-y-3 pr-1">
                <!-- Rendered programmatically -->
              </div>
              
              <!-- Annotation Form Trigger -->
              <div id="annotation-form-wrap" class="mt-3 pt-3 border-t border-white/5 hidden">
                <form id="prism-annotation-form" onsubmit="window.PrismReview.submitAnnotation(event)" class="flex gap-2">
                  <input type="text" id="annotation-input-text" placeholder="Write annotation parameter..." required class="flex-1 bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-prism-purple">
                  <button type="submit" class="bg-prism-purple text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:brightness-110">
                    PIN
                  </button>
                </form>
              </div>
            </div>

            <!-- Real-time Handshake Activity Feed -->
            <div class="prism-glass rounded-2xl border border-white/10 p-5 flex flex-col h-[200px]">
              <div class="flex items-center space-x-2 border-b border-white/5 pb-3 mb-3">
                <i data-lucide="activity" class="w-4 h-4 text-prism-blue"></i>
                <h3 class="text-xs font-bold uppercase tracking-wider text-white">Live Consensus Feed</h3>
              </div>
              <div id="collaboration-history" class="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono text-[11px]">
                <!-- Rendered programmatically -->
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    footer.parentNode.insertBefore(section, footer);
  }

  // Master UI Rendering Routines
  function renderDocument() {
    const windowEl = document.getElementById('prism-viewer-window');
    const hintEl = document.getElementById('hint-text');
    if (!windowEl) return;

    // Clear and reset viewer state
    windowEl.innerHTML = '';
    
    // Switch Active Tab Styling
    ['term-sheet', 'blueprint', 'ltv-matrix'].forEach(docId => {
      const tab = document.getElementById(`tab-${docId}`);
      if (tab) {
        if (docId === state.activeDoc) {
          tab.className = 'px-3 py-2 rounded-lg text-xs font-mono bg-prism-purple/20 text-prism-purple border border-prism-purple/30 font-bold';
        } else {
          tab.className = 'px-3 py-2 rounded-lg text-xs font-mono text-white/55 hover:text-white hover:bg-white/5 transition';
        }
      }
    });

    const activeObj = state.documents[state.activeDoc];

    if (activeObj.type === 'text') {
      hintEl.textContent = 'Select any line inside the Term Sheet to pin an analytical annotation directly.';
      const pre = document.createElement('pre');
      pre.className = 'p-6 text-xs text-white/80 font-mono leading-relaxed overflow-x-auto';
      
      const lines = activeObj.content.split('\n');
      pre.innerHTML = lines.map((line, idx) => {
        // Check if any active annotation references this line
        const hasAnn = state.annotations.some(ann => ann.docId === 'term-sheet' && ann.line === idx && !ann.resolved);
        const annBadge = hasAnn ? `<span class="inline-block w-2 h-2 rounded-full bg-prism-purple mr-1.5 status-pulse" title="Active Pin"></span>` : '';
        return `<div class="prism-highlight-line px-2 py-0.5 rounded flex items-center" onclick="window.PrismReview.prepareAnnotation(${idx})">${annBadge}<span class="text-white/20 select-none mr-4 w-6 inline-block">${idx + 1}</span>${escapeHTML(line)}</div>`;
      }).join('');
      
      windowEl.appendChild(pre);

    } else if (activeObj.type === 'map') {
      hintEl.textContent = 'Click anywhere on the visual blueprint diagram to place a localized comment pin.';
      
      const container = document.createElement('div');
      container.className = 'relative w-full h-full min-h-[400px] flex items-center justify-center prism-blueprint-grid overflow-hidden cursor-crosshair';
      container.id = 'blueprint-interactive-canvas';
      container.onclick = (e) => {
        const rect = container.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        window.PrismReview.prepareBlueprintAnnotation(x, y);
      };

      // Underlying blueprint layout visual overlay
      container.innerHTML = `
        <img src="${activeObj.url}" class="absolute inset-0 w-full h-full object-cover opacity-35 select-none pointer-events-none" />
        <div class="absolute inset-0 bg-gradient-to-t from-prism-charcoal via-transparent to-transparent pointer-events-none"></div>
        <div id="blueprint-annotations-layer" class="absolute inset-0 pointer-events-none"></div>
      `;

      windowEl.appendChild(container);
      renderBlueprintPins();

    } else if (activeObj.type === 'matrix') {
      hintEl.textContent = 'Explore the algorithmic model calculations below. Click any cell to note points.';
      
      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'p-6 overflow-x-auto w-full';
      
      let html = `
        <table class="w-full text-left font-mono text-xs text-white/80">
          <thead>
            <tr class="border-b border-white/10 pb-3 text-white/55">
              <th class="py-2.5">FACTOR CATEGORY</th>
              <th class="py-2.5">VALUE</th>
              <th class="py-2.5">RISK SCORE</th>
              <th class="py-2.5">AUTOMATED PATH</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
      `;

      activeObj.data.forEach((row, rIdx) => {
        const hasAnn = state.annotations.some(ann => ann.docId === 'ltv-matrix' && ann.row === rIdx && !ann.resolved);
        const highlight = hasAnn ? 'bg-prism-purple/5' : 'hover:bg-white/5';
        html += `
          <tr class="transition-colors ${highlight} cursor-pointer" onclick="window.PrismReview.prepareMatrixAnnotation(${rIdx})">
            <td class="py-3 font-semibold text-white flex items-center">
              ${hasAnn ? `<span class="w-1.5 h-1.5 rounded-full bg-prism-purple mr-2 status-pulse"></span>` : ''}
              ${row.category}
            </td>
            <td class="py-3 text-prism-blue font-bold">${row.value}</td>
            <td class="py-3">
              <span class="px-2 py-0.5 rounded text-[10px] ${row.risk === 'High' ? 'bg-prism-red/20 text-prism-red border border-prism-red/30' : row.risk === 'Medium' ? 'bg-prism-yellow/20 text-prism-yellow border border-prism-yellow/30' : 'bg-prism-green/20 text-prism-green border border-prism-green/30'}">
                ${row.risk}
              </span>
            </td>
            <td class="py-3 text-white/40">${row.trigger}</td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      tableWrapper.innerHTML = html;
      windowEl.appendChild(tableWrapper);
    }

    // Refresh lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderBlueprintPins() {
    const layer = document.getElementById('blueprint-annotations-layer');
    if (!layer) return;

    layer.innerHTML = '';
    state.annotations.forEach(ann => {
      if (ann.docId === 'blueprint' && ann.x !== undefined && ann.y !== undefined) {
        const pin = document.createElement('div');
        pin.style.left = `${ann.x}%`;
        pin.style.top = `${ann.y}%`;
        pin.style.transform = 'translate(-50%, -50%)';
        
        const pinColor = ann.resolved ? 'bg-white/30 text-white/50' : 'bg-prism-purple text-white status-pulse';
        
        pin.className = `absolute w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg pointer-events-auto cursor-pointer ${pinColor}`;
        pin.title = `${ann.author}: ${ann.text}`;
        pin.textContent = ann.id;
        
        pin.onclick = (e) => {
          e.stopPropagation();
          highlightAnnotation(ann.id);
        };

        layer.appendChild(pin);
      }
    });
  }

  function renderAnnotations() {
    const listEl = document.getElementById('annotation-list');
    const countEl = document.getElementById('annotation-count');
    if (!listEl) return;

    // Filter relevant annotations
    const currentList = state.annotations.filter(ann => ann.docId === state.activeDoc);
    countEl.textContent = currentList.length;

    if (currentList.length === 0) {
      listEl.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center p-4">
          <i data-lucide="sparkles" class="w-8 h-8 text-white/10 mb-2"></i>
          <p class="text-xs text-white/40">No parameter annotations registered on this document tier yet.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    listEl.innerHTML = currentList.map(ann => `
      <div id="ann-card-${ann.id}" class="p-3 rounded-xl border transition-all ${ann.resolved ? 'bg-black/20 border-white/5 opacity-55' : 'bg-white/5 border-white/10 hover:border-prism-purple/40'}">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center space-x-1.5 font-mono text-[10px]">
            <span class="text-white/80 font-bold">${ann.author}</span>
            <span class="text-white/30">•</span>
            <span class="text-white/40">${ann.timestamp}</span>
            <span class="text-white/30">•</span>
            <span class="text-prism-blue font-semibold">
              ${ann.line !== undefined ? `Line ${ann.line + 1}` : ann.row !== undefined ? `Row ${ann.row + 1}` : `Pin #${ann.id}`}
            </span>
          </div>
          <div class="flex items-center space-x-1">
            ${ann.resolved ? `
              <span class="text-[9px] font-mono text-prism-green uppercase bg-prism-green/10 px-1.5 py-0.5 rounded">RESOLVED</span>
            ` : `
              <button onclick="window.PrismReview.resolveAnnotation(${ann.id})" class="text-[9px] font-mono text-white/50 hover:text-prism-green uppercase hover:bg-white/5 px-1.5 py-0.5 rounded transition">
                Resolve
              </button>
            `}
          </div>
        </div>
        <p class="text-xs text-white/80 leading-relaxed">${escapeHTML(ann.text)}</p>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  function renderHistory() {
    const historyEl = document.getElementById('collaboration-history');
    if (!historyEl) return;

    historyEl.innerHTML = state.history.map(item => `
      <div class="flex items-start justify-between space-x-2 border-b border-white/5 pb-1.5">
        <div class="flex items-center space-x-2">
          <span class="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          <div>
            <span class="${item.color} font-semibold">${item.action}</span>
            <span class="text-white/30 text-[10px]">by ${item.user}</span>
          </div>
        </div>
        <span class="text-white/30 text-[9px] whitespace-nowrap">${item.time}</span>
      </div>
    `).join('');
  }

  function renderStatusControls() {
    const buttons = {
      'under-review': document.getElementById('btn-status-review'),
      'approved': document.getElementById('btn-status-approved'),
      'revision-required': document.getElementById('btn-status-revision')
    };

    Object.keys(buttons).forEach(key => {
      const btn = buttons[key];
      if (!btn) return;

      if (key === state.approvalStatus) {
        if (key === 'approved') {
          btn.className = 'px-3 py-1.5 rounded text-xs font-mono border border-prism-green/60 bg-prism-green/20 text-prism-green font-bold prism-badge-active';
        } else if (key === 'revision-required') {
          btn.className = 'px-3 py-1.5 rounded text-xs font-mono border border-prism-red/60 bg-prism-red/20 text-prism-red font-bold prism-badge-active';
        } else {
          btn.className = 'px-3 py-1.5 rounded text-xs font-mono border border-prism-yellow/60 bg-prism-yellow/20 text-prism-yellow font-bold prism-badge-active';
        }
      } else {
        btn.className = 'px-3 py-1.5 rounded text-xs font-mono border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition';
      }
    });
  }

  // Interactive UI Callbacks
  function highlightAnnotation(id) {
    const card = document.getElementById(`ann-card-${id}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      card.classList.add('ring-1', 'ring-prism-purple');
      setTimeout(() => {
        card.classList.remove('ring-1', 'ring-prism-purple');
      }, 2000);
    }
  }

  // Helper Utilities
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Core Global Actions API
  window.PrismReview = {
    switchDoc: function (docId) {
      state.activeDoc = docId;
      document.getElementById('annotation-form-wrap').classList.add('hidden');
      renderDocument();
      renderAnnotations();
    },

    updateStatus: function (status) {
      state.approvalStatus = status;
      
      let actionLabel = '';
      let logColor = '';
      if (status === 'approved') {
        actionLabel = 'Voted Consensus: Document APPROVED';
        logColor = 'text-prism-green';
      } else if (status === 'revision-required') {
        actionLabel = 'Dispatched Revision Flag';
        logColor = 'text-prism-red';
      } else {
        actionLabel = 'Reverted state to Active Underwriting';
        logColor = 'text-prism-yellow';
      }

      state.history.unshift({
        action: actionLabel,
        user: 'External Underwriter',
        time: 'Just now',
        color: logColor
      });

      renderStatusControls();
      renderHistory();
    },

    prepareAnnotation: function (lineIndex) {
      this.pendingAnnotation = {
        docId: 'term-sheet',
        line: lineIndex
      };
      const wrap = document.getElementById('annotation-form-wrap');
      wrap.classList.remove('hidden');
      document.getElementById('annotation-input-text').focus();
      document.getElementById('annotation-input-text').placeholder = `Pin annotation to Line ${lineIndex + 1}...`;
    },

    prepareBlueprintAnnotation: function (x, y) {
      this.pendingAnnotation = {
        docId: 'blueprint',
        x: x,
        y: y
      };
      
      // Render temporary pointer on layer
      renderBlueprintPins();
      const layer = document.getElementById('blueprint-annotations-layer');
      if (layer) {
        const tempPin = document.createElement('div');
        tempPin.style.left = `${x}%`;
        tempPin.style.top = `${y}%`;
        tempPin.style.transform = 'translate(-50%, -50%)';
        tempPin.className = 'absolute w-5 h-5 rounded-full border border-prism-blue bg-prism-blue/20 flex items-center justify-center text-[10px] text-prism-blue font-bold status-pulse';
        tempPin.textContent = '+';
        layer.appendChild(tempPin);
      }

      const wrap = document.getElementById('annotation-form-wrap');
      wrap.classList.remove('hidden');
      document.getElementById('annotation-input-text').focus();
      document.getElementById('annotation-input-text').placeholder = `Pin spatial coordinates [X:${x} Y:${y}]...`;
    },

    prepareMatrixAnnotation: function (rowIndex) {
      this.pendingAnnotation = {
        docId: 'ltv-matrix',
        row: rowIndex
      };
      const wrap = document.getElementById('annotation-form-wrap');
      wrap.classList.remove('hidden');
      document.getElementById('annotation-input-text').focus();
      document.getElementById('annotation-input-text').placeholder = `Pin note to metrics row ${rowIndex + 1}...`;
    },

    submitAnnotation: function (e) {
      e.preventDefault();
      const textInput = document.getElementById('annotation-input-text');
      if (!textInput || !this.pendingAnnotation) return;

      const newAnn = {
        id: state.annotations.length + 1,
        docId: this.pendingAnnotation.docId,
        author: 'Syndicate Guest',
        text: textInput.value,
        timestamp: 'Just now',
        resolved: false,
        line: this.pendingAnnotation.line,
        row: this.pendingAnnotation.row,
        x: this.pendingAnnotation.x,
        y: this.pendingAnnotation.y
      };

      state.annotations.push(newAnn);
      
      // Update history log
      state.history.unshift({
        action: `Pinned annotation point #${newAnn.id}`,
        user: 'Syndicate Guest',
        time: 'Just now',
        color: 'text-prism-purple'
      });

      // Clear input fields and form container
      textInput.value = '';
      document.getElementById('annotation-form-wrap').classList.add('hidden');
      this.pendingAnnotation = null;

      // Render fresh visual updates
      renderDocument();
      renderAnnotations();
      renderHistory();
    },

    resolveAnnotation: function (id) {
      const ann = state.annotations.find(a => a.id === id);
      if (ann) {
        ann.resolved = true;
        
        state.history.unshift({
          action: `Resolved annotation review point #${id}`,
          user: 'Sponsor Lead',
          time: 'Just now',
          color: 'text-prism-green'
        });

        renderDocument();
        renderAnnotations();
        renderHistory();
      }
    },

    exportReviewLog: function () {
      const header = "===================================================================\r\nPRISM LOGIC SYSTEM INTERFACE - COLLABORATIVE CONSENSUS LOG\r\n===================================================================\r\n";
      const statusLine = `CURRENT APPROVAL STATE: ${state.approvalStatus.toUpperCase()}\r\n`;
      const timeLine = `TIMESTAMP: ${new Date().toISOString()}\r\n\r\n`;
      
      let body = "REGISTERED ANNOTATIONS MATRIX:\r\n-------------------------------------------------------------------\r\n";
      state.annotations.forEach(ann => {
        const docRef = state.documents[ann.docId].name;
        const locator = ann.line !== undefined ? `Line ${ann.line + 1}` : ann.row !== undefined ? `Row ${ann.row + 1}` : `Coordinates [X:${ann.x}% Y:${ann.y}%]`;
        body += `[ID: ${ann.id}] [Doc: ${docRef}] [At: ${locator}] [By: ${ann.author}] [Status: ${ann.resolved ? 'RESOLVED' : 'OPEN'}]\r\n`;
        body += `Comment: ${ann.text}\r\n\r\n`;
      });

      body += "SYSTEM TIMELINE DEPLOYMENT FEED:\r\n-------------------------------------------------------------------\r\n";
      state.history.forEach(item => {
        body += `[${item.time}] ${item.action} (${item.user})\r\n`;
      });

      const fullOutput = header + statusLine + timeLine + body;
      
      // Generate secure local document download trigger
      const blob = new Blob([fullOutput], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PRISM_COLLAB_REVIEW_LOG_${state.activeDoc.toUpperCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Safe Initialization execution on DOM Loaded event
  document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    renderCollaborativeSection();
    renderDocument();
    renderAnnotations();
    renderHistory();
    renderStatusControls();
  });

})();