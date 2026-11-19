(function () {
  // Inject custom stylesheet for the annotation board
  const style = document.createElement("style");
  style.innerHTML = `
    .annotated-doc-viewport {
      background-size: 20px 20px;
      background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #0f0f15;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #252538;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #6366f1;
    }
    @keyframes pinPulse {
      0% { transform: scale(0.9); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 15px rgba(99,102,241,0.6); }
      100% { transform: scale(0.9); opacity: 0.5; }
    }
    .pulsing-pin {
      animation: pinPulse 2s infinite ease-in-out;
    }
  `;
  document.head.appendChild(style);

  // Simulated Attachments Data (7 premium files for underwriting flow)
  const ATTACHMENTS = [
    {
      id: "att-1",
      name: "Commercial Valuation Appraisal",
      filename: "Appraisal_Report_450k.pdf",
      category: "Valuation",
      fileSize: "14.2 MB",
      uploader: "S. Miller (Appraiser)",
      timestamp: "2 hours ago",
      status: "Approved",
      progress: 100,
      docType: "valuation",
      annotations: [
        { id: "p1", x: 25, y: 35, author: "Marcus Vance", text: "Verified comparable sales on 4th Avenue. Valuation is highly accurate for the micro-market.", timestamp: "1h ago", type: "approved" },
        { id: "p2", x: 68, y: 72, author: "Lydia Stark", text: "Verify local zoning guidelines regarding the set-back ratio outlined in Section 4.", timestamp: "30m ago", type: "general" }
      ]
    },
    {
      id: "att-2",
      name: "Preliminary Title Commitment",
      filename: "Title_Commitment_Schedule_A.pdf",
      category: "Legal & Title",
      fileSize: "4.8 MB",
      uploader: "Fidelity Title Group",
      timestamp: "5 hours ago",
      status: "Pending Review",
      progress: 60,
      docType: "title",
      annotations: [
        { id: "p3", x: 45, y: 22, author: "Marcus Vance", text: "Outstanding utility easement on eastern parcel boundary needs title clearance letter.", timestamp: "4h ago", type: "flagged" }
      ]
    },
    {
      id: "att-3",
      name: "Borrower PFS & Credit File",
      filename: "Credit_Summary_Confidential.pdf",
      category: "Borrower Financials",
      fileSize: "8.1 MB",
      uploader: "Apex Brokerage",
      timestamp: "1 day ago",
      status: "Flagged",
      progress: 45,
      docType: "credit",
      annotations: [
        { id: "p4", x: 15, y: 55, author: "David Cho (Risk)", text: "Verify liquidity profile; current checking reserves seem leveraged. Request updated bank statement.", timestamp: "18h ago", type: "flagged" },
        { id: "p5", x: 80, y: 15, author: "Lydia Stark", text: "FICO score confirmed at 742 across major bureaus.", timestamp: "12h ago", type: "approved" }
      ]
    },
    {
      id: "att-4",
      name: "Phase I Environmental Report",
      filename: "Phase_I_Environmental_Assoc.pdf",
      category: "Compliance",
      fileSize: "18.5 MB",
      uploader: "Envirotech Engineering",
      timestamp: "2 days ago",
      status: "Approved",
      progress: 100,
      docType: "environmental",
      annotations: [
        { id: "p6", x: 50, y: 48, author: "Marcus Vance", text: "No recognized environmental conditions (RECs) found. Excellent site status.", timestamp: "1d ago", type: "approved" }
      ]
    },
    {
      id: "att-5",
      name: "Itemized Rehab Budget (SOW)",
      filename: "Rehab_Schedule_Spreadsheet.xlsx",
      category: "Construction",
      fileSize: "2.4 MB",
      uploader: "Redline Contracting LLC",
      timestamp: "3 days ago",
      status: "Pending Review",
      progress: 75,
      docType: "construction",
      annotations: [
        { id: "p7", x: 30, y: 65, author: "David Cho (Risk)", text: "Contingency line item is only 5%. Increase to 10% to secure final draw reserve allocation.", timestamp: "2d ago", type: "flagged" }
      ]
    },
    {
      id: "att-6",
      name: "LLC Operating Agreement",
      filename: "Entity_Operating_Agreement_Signed.pdf",
      category: "Corporate",
      fileSize: "3.1 MB",
      uploader: "Apex Brokerage",
      timestamp: "4 days ago",
      status: "Approved",
      progress: 100,
      docType: "corporate",
      annotations: []
    },
    {
      id: "att-7",
      name: "Executed Purchase Agreement",
      filename: "PSA_Executed_400k.pdf",
      category: "Legal & Title",
      fileSize: "6.7 MB",
      uploader: "Apex Brokerage",
      timestamp: "4 days ago",
      status: "Approved",
      progress: 100,
      docType: "legal",
      annotations: [
        { id: "p8", x: 75, y: 80, author: "Marcus Vance", text: "Closing extension option executed. Valid until end of next quarter.", timestamp: "3d ago", type: "approved" }
      ]
    }
  ];

  // Core application state
  let currentAttachmentId = "att-1";
  let activeAnnotations = JSON.parse(JSON.stringify(ATTACHMENTS)); // Deep copy to modify in runtime
  let currentFilter = "All";

  // Create workspace UI layout components
  function buildWorkspaceMarkup() {
    const activeDoc = activeAnnotations.find(a => a.id === currentAttachmentId);
    
    return `
      <!-- Workspace Full Screen Overlay Container -->
      <div id="collaboration-board" class="hidden fixed inset-0 z-50 bg-[#07070a]/98 backdrop-blur-xl flex flex-col font-sans text-slate-100">
        
        <!-- Top Board Header -->
        <header class="h-16 border-b border-slate-800/80 bg-slate-950 px-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-bold text-white tracking-tight uppercase">Attachment Underwriting Board</h2>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase">Live Collaboration Sync</span>
              </div>
              <p class="text-[10px] text-slate-400">Preview multi-source collateral files, drop pins, and approve elements</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="hidden md:flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400">
              <span class="flex h-2 w-2 rounded-full bg-emerald-400 node-pulse"></span>
              <span>Reviewing Portfolio:</span>
              <span class="text-white font-mono font-bold">7 / 7 Secured</span>
            </div>
            
            <button id="close-workspace-btn" class="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              Exit Review Board
            </button>
          </div>
        </header>

        <!-- Main Workspace Split Screen Layout -->
        <div class="flex-1 flex overflow-hidden">
          
          <!-- Column 1: Attachment Drawer (Left) -->
          <aside class="w-80 border-r border-slate-800/80 bg-slate-950 flex flex-col">
            <!-- Filter Actions Header -->
            <div class="p-4 border-b border-slate-800/60 space-y-3">
              <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                <span>Deal File Pipeline</span>
                <span class="text-indigo-400">7 Attachments</span>
              </div>
              <div class="grid grid-cols-3 gap-1 bg-slate-900 p-0.5 rounded-md border border-slate-800">
                <button onclick="window.setReviewFilter('All')" id="filter-all" class="review-f-btn text-[9px] py-1 rounded font-bold text-white bg-indigo-600 transition-colors">All</button>
                <button onclick="window.setReviewFilter('Pending Review')" id="filter-pending" class="review-f-btn text-[9px] py-1 rounded font-bold text-slate-400 hover:text-white transition-colors">Pending</button>
                <button onclick="window.setReviewFilter('Flagged')" id="filter-flagged" class="review-f-btn text-[9px] py-1 rounded font-bold text-slate-400 hover:text-white transition-colors">Flagged</button>
              </div>
            </div>

            <!-- Attachment List (Scrollable) -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2" id="attachment-list-container">
              <!-- Rendered Dynamically -->
            </div>

            <!-- Aggregate Status Block -->
            <div class="p-4 border-t border-slate-800/60 bg-slate-950 space-y-3">
              <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Aggregate Review Completion</span>
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-mono">
                  <span class="text-slate-400">Portfolio Status</span>
                  <span class="text-emerald-400 font-bold" id="aggregate-pct">82% Completed</span>
                </div>
                <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div id="aggregate-progress-bar" class="bg-gradient-to-r from-indigo-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500" style="width: 82%;"></div>
                </div>
              </div>
            </div>
          </aside>

          <!-- Column 2: Document Interaction Preview Viewport (Center) -->
          <main class="flex-1 bg-slate-900/60 flex flex-col relative overflow-hidden">
            <!-- Floating helper hint -->
            <div class="absolute top-4 left-4 z-10 bg-slate-950/90 border border-indigo-500/30 rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg shadow-indigo-500/5">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span class="text-[10px] text-slate-300">Click anywhere inside the document preview window to drop feedback annotations</span>
            </div>

            <!-- Document preview header info bar -->
            <div class="h-12 border-b border-slate-800/60 bg-slate-950/40 px-6 flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs">
                <span class="text-slate-400 font-bold uppercase tracking-wider">Active File:</span>
                <span id="preview-active-name" class="text-white font-medium">Appraisal_Report_450k.pdf</span>
                <span id="preview-active-size" class="text-[10px] text-slate-500 font-mono">(14.2 MB)</span>
              </div>
              <div class="flex items-center gap-3">
                <button onclick="window.saveActiveFileState('Approved')" class="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider rounded transition-all">
                  Approve File
                </button>
                <button onclick="window.saveActiveFileState('Flagged')" class="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider rounded transition-all">
                  Flag File
                </button>
              </div>
            </div>

            <!-- Interactive Viewport Canvas/Grid -->
            <div class="flex-1 overflow-auto p-8 flex items-center justify-center custom-scrollbar">
              <div id="annotated-doc-viewport" class="annotated-doc-viewport relative w-full max-w-2xl aspect-[4/3] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col p-6 transition-all cursor-crosshair">
                <!-- Pin overlay container -->
                <div id="pin-overlay-canvas" class="absolute inset-0 z-20 overflow-hidden rounded-2xl">
                  <!-- Injected Interactive pin dots -->
                </div>

                <!-- Abstracted Content depending on file type -->
                <div class="w-full h-full flex flex-col justify-between select-none" id="preview-doc-content">
                  <!-- Dynamically rendered visual mock content structure -->
                </div>
              </div>
            </div>
          </main>

          <!-- Column 3: Discussion Board & Action Checklist (Right) -->
          <aside class="w-80 border-l border-slate-800/80 bg-slate-950 flex flex-col">
            <div class="p-4 border-b border-slate-800/60">
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">Review Board Comments</h3>
              <p class="text-[10px] text-slate-400 mt-1">Live threaded annotations dropped on selected blueprints and files</p>
            </div>

            <!-- Scrollable Comments/Annotations Stream -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4" id="board-comments-container">
              <!-- Rendered dynamic components -->
            </div>

            <!-- Direct Comment Submission input form -->
            <div class="p-4 border-t border-slate-800/60 bg-slate-950">
              <form id="comment-board-form" onsubmit="window.submitQuickBoardComment(event)" class="space-y-2">
                <div class="flex justify-between items-center text-[10px] text-slate-400">
                  <span>New Discussion Note</span>
                  <span class="text-indigo-400 font-mono font-bold" id="pin-pending-loc">Target Pin: Center</span>
                </div>
                <textarea id="comment-board-text" required placeholder="Type instructions or feedback point here..." class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none h-20"></textarea>
                <div class="grid grid-cols-2 gap-2">
                  <select id="comment-board-type" class="bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-indigo-500">
                    <option value="general">Info (Blue)</option>
                    <option value="approved">Approved (Emerald)</option>
                    <option value="flagged">Attention (Rose)</option>
                  </select>
                  <button type="submit" class="py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all">
                    Insert Pin Note
                  </button>
                </div>
              </form>
            </div>
          </aside>

        </div>
      </div>
    `;
  }

  // Inject Collaboration Button into the header of Base Component
  function injectDealRoomTrigger() {
    const headerDiv = document.querySelector("header .max-w-7xl div.flex.items-center.gap-3");
    if (!headerDiv) return;

    const actionBtn = document.createElement("button");
    actionBtn.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:text-white border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all";
    actionBtn.innerHTML = `
      <svg class="w-3.5 h-3.5 text-emerald-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
      </svg>
      <span>Underwriting Room</span>
    `;
    actionBtn.addEventListener("click", () => {
      openCollaborationBoard();
    });

    headerDiv.prepend(actionBtn);

    // Also link "Initiate Underwriting Handshake" and "Connect Flow" elements
    document.addEventListener("click", (e) => {
      const target = e.target.closest("button");
      if (target && target.innerText.includes("Underwriting Handshake")) {
        // Delay open for visual effect
        setTimeout(() => {
          openCollaborationBoard();
        }, 100);
      }
    });
  }

  // Opens visual Collaboration Overlay Board
  function openCollaborationBoard() {
    const board = document.getElementById("collaboration-board");
    if (board) {
      board.classList.remove("hidden");
      renderWorkspace();
    }
  }

  // Closes Overlay Board
  function closeCollaborationBoard() {
    const board = document.getElementById("collaboration-board");
    if (board) {
      board.classList.add("hidden");
    }
  }

  // Core render coordinator
  function renderWorkspace() {
    renderAttachmentList();
    renderDocPreview();
    renderCommentsPanel();
    updateAggregateCompletion();
  }

  // Calculates and displays the global portfolio review status
  function updateAggregateCompletion() {
    const approvedCount = activeAnnotations.filter(a => a.status === "Approved").length;
    const totalCount = activeAnnotations.length;
    const percentage = Math.round((approvedCount / totalCount) * 100);

    const label = document.getElementById("aggregate-pct");
    const bar = document.getElementById("aggregate-progress-bar");
    if (label && bar) {
      label.textContent = `${percentage}% Approved`;
      bar.style.width = `${percentage}%`;
    }
  }

  // Left panel sidebar listing render function
  function renderAttachmentList() {
    const container = document.getElementById("attachment-list-container");
    if (!container) return;

    let filtered = activeAnnotations;
    if (currentFilter !== "All") {
      filtered = activeAnnotations.filter(a => a.status === currentFilter);
    }

    container.innerHTML = filtered.map(att => {
      const isSelected = att.id === currentAttachmentId;
      const statusColors = {
        "Approved": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        "Pending Review": "bg-amber-500/10 text-amber-400 border-amber-500/20",
        "Flagged": "bg-rose-500/10 text-rose-400 border-rose-500/20"
      };

      return `
        <div onclick="window.switchAttachment('${att.id}')" class="p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
          isSelected 
            ? "bg-indigo-500/5 border-indigo-500/40 shadow-lg shadow-indigo-500/5" 
            : "bg-slate-900/50 border-slate-800 hover:bg-slate-900"
        }">
          <div class="flex items-start justify-between gap-1.5">
            <div class="space-y-0.5">
              <span class="text-[8px] text-slate-500 font-bold uppercase tracking-wider">${att.category}</span>
              <h4 class="text-xs font-bold text-white leading-tight ${isSelected ? "text-indigo-400" : ""}">${att.name}</h4>
              <p class="text-[10px] text-slate-400 font-mono">${att.filename}</p>
            </div>
            <span class="text-[8px] px-1.5 py-0.5 rounded-full border font-semibold ${statusColors[att.status]}">
              ${att.status}
            </span>
          </div>

          <div class="mt-3 flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-800/60 pt-2.5">
            <span>Size: ${att.fileSize}</span>
            <span class="flex items-center gap-1">
              <svg class="w-2.5 h-2.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ${att.annotations.length} Pins
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Switch Active File trigger
  window.switchAttachment = function (id) {
    currentAttachmentId = id;
    // Reset any temporary click variables
    window.tempPinLoc = { x: 50, y: 50 };
    document.getElementById("pin-pending-loc").textContent = "Target Pin: Center";
    renderWorkspace();
  };

  // Switch Drawer Filter Status toggle
  window.setReviewFilter = function (filter) {
    currentFilter = filter;
    
    // Toggle active tab buttons
    document.querySelectorAll(".review-f-btn").forEach(btn => {
      btn.classList.remove("bg-indigo-600", "text-white");
      btn.classList.add("text-slate-400");
    });
    
    const activeBtnMap = {
      "All": "filter-all",
      "Pending Review": "filter-pending",
      "Flagged": "filter-flagged"
    };
    
    const activeBtn = document.getElementById(activeBtnMap[filter]);
    if (activeBtn) {
      activeBtn.classList.remove("text-slate-400");
      activeBtn.classList.add("bg-indigo-600", "text-white");
    }

    renderAttachmentList();
  };

  // Interactive Document Viewport Render
  function renderDocPreview() {
    const activeDoc = activeAnnotations.find(a => a.id === currentAttachmentId);
    if (!activeDoc) return;

    // Update Top Info Bar Values
    document.getElementById("preview-active-name").textContent = activeDoc.filename;
    document.getElementById("preview-active-size").textContent = `(${activeDoc.fileSize})`;

    // Generate Document content layout template
    const previewContainer = document.getElementById("preview-doc-content");
    previewContainer.innerHTML = buildMockDocVisuals(activeDoc.docType);

    // Position existing pins
    const canvas = document.getElementById("pin-overlay-canvas");
    canvas.innerHTML = activeDoc.annotations.map(pin => {
      const pinColors = {
        "approved": "bg-emerald-500 border-emerald-400",
        "flagged": "bg-rose-500 border-rose-400",
        "general": "bg-indigo-500 border-indigo-400"
      };

      return `
        <button 
          onclick="window.selectPinId(event, '${pin.id}')"
          class="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-[9px] font-extrabold text-white pulsing-pin cursor-pointer transition-all hover:scale-125 z-30 ${pinColors[pin.type || 'general']}"
          style="left: ${pin.x}%; top: ${pin.y}%;"
        >
          !
        </button>
      `;
    }).join('');
  }

  // Setup click tracker to place visual pins
  window.tempPinLoc = { x: 50, y: 50 }; // default
  
  // Set window-level event listener for viewport interaction
  document.addEventListener("click", (e) => {
    const canvas = document.getElementById("pin-overlay-canvas");
    if (!canvas) return;

    // Check if click was indeed inside canvas
    const rect = canvas.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      // Calculate percentage inside viewport container
      const xPercent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const yPercent = Math.round(((e.clientY - rect.top) / rect.height) * 100);

      // Save click coordinate point
      window.tempPinLoc = { x: xPercent, y: yPercent };

      // Update feedback labeling helper
      document.getElementById("pin-pending-loc").textContent = `Target Pin: X ${xPercent}% / Y ${yPercent}%`;

      // Render temporary visual drop pin indicator
      let tempPin = document.getElementById("temp-pin-indicator");
      if (!tempPin) {
        tempPin = document.createElement("div");
        tempPin.id = "temp-pin-indicator";
        tempPin.className = "absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-dashed border-indigo-400 bg-indigo-500/30 animate-pulse pointer-events-none z-30";
        canvas.appendChild(tempPin);
      }
      tempPin.style.left = `${xPercent}%`;
      tempPin.style.top = `${yPercent}%`;
    }
  });

  // Action callback to highlight a pin's discussion thread on click
  window.selectPinId = function (e, pinId) {
    e.stopPropagation(); // Avoid triggering fresh canvas pin drop
    const targetElement = document.getElementById(`comment-card-${pinId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetElement.classList.add("ring-2", "ring-indigo-500");
      setTimeout(() => {
        targetElement.classList.remove("ring-2", "ring-indigo-500");
      }, 1500);
    }
  };

  // Submit Comments via board input
  window.submitQuickBoardComment = function (e) {
    e.preventDefault();
    const activeDoc = activeAnnotations.find(a => a.id === currentAttachmentId);
    if (!activeDoc) return;

    const textInput = document.getElementById("comment-board-text");
    const typeSelect = document.getElementById("comment-board-type");

    if (!textInput.value.trim()) return;

    // Build fresh annotation pin schema
    const newPin = {
      id: "pin-" + Date.now(),
      x: window.tempPinLoc.x,
      y: window.tempPinLoc.y,
      author: "Marcus Vance (You)",
      text: textInput.value.trim(),
      timestamp: "Just now",
      type: typeSelect.value
    };

    activeDoc.annotations.push(newPin);
    
    // Reset Form Input Parameters
    textInput.value = "";
    const tempPin = document.getElementById("temp-pin-indicator");
    if (tempPin) tempPin.remove();
    window.tempPinLoc = { x: 50, y: 50 }; // reset to center
    document.getElementById("pin-pending-loc").textContent = "Target Pin: Center";

    // Re-render Board UI components
    renderWorkspace();

    // Trigger toast notification
    if (window.showToast) {
      window.showToast("Feedback annotation pin deployed successfully!");
    }
  };

  // Change Approval Workflow State of File
  window.saveActiveFileState = function (newStatus) {
    const activeDoc = activeAnnotations.find(a => a.id === currentAttachmentId);
    if (!activeDoc) return;

    activeDoc.status = newStatus;
    renderWorkspace();
    
    if (window.showToast) {
      window.showToast(`Document status updated to: ${newStatus}`);
    }
  };

  // Right side panel comments list renderer
  function renderCommentsPanel() {
    const container = document.getElementById("board-comments-container");
    if (!container) return;

    const activeDoc = activeAnnotations.find(a => a.id === currentAttachmentId);
    if (!activeDoc || activeDoc.annotations.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 px-4 space-y-3">
          <div class="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h5 class="text-xs font-bold text-white">No discussion logs dropped</h5>
            <p class="text-[10px] text-slate-500 mt-0.5">Click directly into the document structure workspace on the left to locate a pinpoint annotation</p>
          </div>
        </div>
      `;
      return;
    }

    const typeIcons = {
      "approved": `<span class="w-2 h-2 rounded-full bg-emerald-500"></span>`,
      "flagged": `<span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>`,
      "general": `<span class="w-2 h-2 rounded-full bg-indigo-500"></span>`
    };

    container.innerHTML = activeDoc.annotations.map(pin => {
      return `
        <div id="comment-card-${pin.id}" class="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 hover:bg-slate-900 transition-all">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs">
              ${typeIcons[pin.type] || typeIcons.general}
              <span class="font-bold text-white">${pin.author}</span>
            </div>
            <span class="text-[9px] font-mono text-slate-500">${pin.timestamp}</span>
          </div>

          <p class="text-xs text-slate-300 leading-relaxed">${pin.text}</p>

          <div class="flex items-center justify-between border-t border-slate-800/60 pt-2 text-[9px] text-slate-500">
            <span>Coordinate: Pin (X: ${pin.x}%, Y: ${pin.y}%)</span>
            <button onclick="window.resolvePin('${activeDoc.id}', '${pin.id}')" class="text-indigo-400 hover:text-white transition-colors">Resolve Issue</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Actions to remove or archive comment flags
  window.resolvePin = function (docId, pinId) {
    const doc = activeAnnotations.find(a => a.id === docId);
    if (!doc) return;

    doc.annotations = doc.annotations.filter(p => p.id !== pinId);
    renderWorkspace();

    if (window.showToast) {
      window.showToast("Annotation pin resolved.");
    }
  };

  // Helper Mock document visual structures
  function buildMockDocVisuals(type) {
    if (type === "valuation") {
      return `
        <div class="flex-1 flex flex-col justify-between">
          <div class="flex justify-between border-b border-slate-800/50 pb-4">
            <div>
              <span class="text-[10px] text-indigo-400 font-mono tracking-wider font-bold block uppercase">Appraisal Certification Matrix</span>
              <h4 class="text-lg font-bold text-white mt-1">450,000 USD Consolidated Valuation</h4>
            </div>
            <div class="text-right">
              <span class="text-[9px] text-slate-500 block uppercase">Appraiser ID</span>
              <span class="text-xs font-mono text-slate-300">#AX-9943</span>
            </div>
          </div>

          <!-- Graphic Schematic Mock -->
          <div class="my-6 grid grid-cols-2 gap-4">
            <div class="bg-slate-900/40 border border-slate-800 p-3 rounded-lg flex items-center justify-center flex-col text-center space-y-1">
              <span class="text-[9px] text-slate-500 uppercase">Primary Sales Comparison</span>
              <div class="text-base font-bold text-emerald-400 font-mono">$452,500</div>
              <p class="text-[9px] text-slate-400">Derived from 4 nearby tract sales</p>
            </div>
            <div class="bg-slate-900/40 border border-slate-800 p-3 rounded-lg flex items-center justify-center flex-col text-center space-y-1">
              <span class="text-[9px] text-slate-500 uppercase">Cost Reconstruction</span>
              <div class="text-base font-bold text-indigo-400 font-mono">$448,000</div>
              <p class="text-[9px] text-slate-400">Adjusted depreciation schedule applied</p>
            </div>
          </div>

          <!-- Small Table details -->
          <div class="border-t border-slate-800/50 pt-4 text-xs space-y-1.5 text-slate-400">
            <div class="flex justify-between"><span>Tract Lot Size:</span> <span class="text-white font-mono">11,400 sq.ft.</span></div>
            <div class="flex justify-between"><span>Gross Living Area:</span> <span class="text-white font-mono">2,150 sq.ft.</span></div>
            <div class="flex justify-between"><span>Physical Condition Grade:</span> <span class="text-emerald-400 font-bold uppercase">Class A-</span></div>
          </div>
        </div>
      `;
    }

    if (type === "title") {
      return `
        <div class="flex-1 flex flex-col justify-between">
          <div class="flex justify-between border-b border-slate-800/50 pb-4">
            <div>
              <span class="text-[10px] text-amber-400 font-mono tracking-wider font-bold block uppercase">Preliminary Schedule A</span>
              <h4 class="text-base font-bold text-white mt-1">Title Commitment & Deed Report</h4>
            </div>
          </div>

          <div class="my-4 bg-slate-900/20 border border-slate-800 rounded-lg p-4 space-y-2">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span class="text-xs text-slate-300">Vestee owner: <strong class="text-white">Jackson Heights LLC</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
              <span class="text-xs text-slate-300">Outstanding Item: <strong class="text-white">Easement #432-B (Utilities)</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span class="text-xs text-slate-300">Outstanding Liens: <strong class="text-emerald-400">None Disclosed</strong></span>
            </div>
          </div>

          <p class="text-[10px] text-slate-500 leading-relaxed">
            Commitment is subject to customary closing terms and execution of standard affidavits by seller at closing window.
          </p>
        </div>
      `;
    }

    if (type === "credit") {
      return `
        <div class="flex-1 flex flex-col justify-between">
          <div class="flex justify-between border-b border-slate-800/50 pb-4">
            <div>
              <span class="text-[10px] text-indigo-400 font-mono tracking-wider font-bold block uppercase">Borrower Credit Risk Assessment</span>
              <h4 class="text-base font-bold text-white mt-1">FICO Multi-Bureau Evaluation Summary</h4>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 my-4">
            <div class="bg-slate-900/50 p-2.5 rounded-lg text-center border border-slate-800">
              <span class="text-[8px] text-slate-500 block uppercase">Equifax</span>
              <span class="text-base font-bold text-emerald-400 font-mono">742</span>
            </div>
            <div class="bg-slate-900/50 p-2.5 rounded-lg text-center border border-slate-800">
              <span class="text-[8px] text-slate-500 block uppercase">Experian</span>
              <span class="text-base font-bold text-emerald-400 font-mono">738</span>
            </div>
            <div class="bg-slate-900/50 p-2.5 rounded-lg text-center border border-slate-800">
              <span class="text-[8px] text-slate-500 block uppercase">TransUnion</span>
              <span class="text-base font-bold text-indigo-400 font-mono">746</span>
            </div>
          </div>

          <div class="border-t border-slate-800/50 pt-3 text-xs space-y-1 text-slate-400">
            <div class="flex justify-between"><span>Net Worth:</span> <span class="text-white font-mono">$1.84 Million</span></div>
            <div class="flex justify-between"><span>Verifiable Liquid Cash:</span> <span class="text-rose-400 font-mono">$142,000 (Action Required)</span></div>
            <div class="flex justify-between"><span>Bankruptcy Registry:</span> <span class="text-emerald-400 font-bold uppercase">Clear</span></div>
          </div>
        </div>
      `;
    }

    // Default general template for environmental, construction, etc.
    return `
      <div class="flex-1 flex flex-col justify-between">
        <div class="flex justify-between border-b border-slate-800/50 pb-4">
          <div>
            <span class="text-[10px] text-indigo-400 font-mono tracking-wider font-bold block uppercase">Regulatory & Compliance Filing</span>
            <h4 class="text-base font-bold text-white mt-1">Direct Operational Attachment Packet</h4>
          </div>
        </div>

        <div class="my-6 space-y-3">
          <div class="h-2 w-2/3 bg-slate-800 rounded"></div>
          <div class="h-2 w-5/6 bg-slate-800 rounded"></div>
          <div class="h-2 w-1/2 bg-slate-800 rounded"></div>
          <div class="h-2 w-3/4 bg-slate-800 rounded"></div>
        </div>

        <div class="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-400">Verification Hash Code:</span>
          <span class="font-mono text-indigo-400">SHA-256::7e4a19b2</span>
        </div>
      </div>
    `;
  }

  // App initialization function
  function init() {
    // 1. Inject visually rich elements into body
    const bodyWorkspaceDiv = document.createElement("div");
    bodyWorkspaceDiv.innerHTML = buildWorkspaceMarkup();
    document.body.appendChild(bodyWorkspaceDiv);

    // 2. Setup standard listener to close workspace
    const closeBtn = document.getElementById("close-workspace-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        closeCollaborationBoard();
      });
    }

    // 3. Setup header triggers
    injectDealRoomTrigger();
  }

  // Kickstart after loaded DOM elements are configured
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
