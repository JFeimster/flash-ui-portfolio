/**
 * FLOW LEND Premium Bulk Metadata & Permission Editor Module
 * Designed to provide a spreadsheet-like interactive experience
 * matching the visual language of the Flow Lend base component.
 */

(function () {
  // 1. Mock Attachment Dataset
  let ATTACHMENTS = [
    {
      id: "doc-101",
      name: "Apex_CA_Underwriting_Summary_v3",
      ext: ".pdf",
      category: "Underwriting",
      tags: ["High-Priority", "CA-Deal", "Apex"],
      permission: "Underwriters Only",
      size: "2.4 MB",
      uploadedBy: "Alex M. (Analyst)"
    },
    {
      id: "doc-102",
      name: "Veritas_FL_TaxReturns_2023_Combined",
      ext: ".pdf",
      category: "Financials",
      tags: ["Tax-Docs", "Veritas", "Verified"],
      permission: "Restricted",
      size: "14.8 MB",
      uploadedBy: "Sarah T. (Underwriting)"
    },
    {
      id: "doc-103",
      name: "Lumina_AZ_Commercial_Appraisal_Draft",
      ext: ".docx",
      category: "Property Info",
      tags: ["Appraisal", "AZ-Deal", "Draft"],
      permission: "Internal Only",
      size: "8.1 MB",
      uploadedBy: "System Flow Engine"
    },
    {
      id: "doc-104",
      name: "Summit_TX_Corporate_Resolution_Executed",
      ext: ".pdf",
      category: "Entity Setup",
      tags: ["Legal", "Summit", "TX-Deal"],
      permission: "Public",
      size: "1.1 MB",
      uploadedBy: "Legal Portal"
    },
    {
      id: "doc-105",
      name: "Vanguard_National_LOI_Template_Standard",
      ext: ".pdf",
      category: "Legal",
      tags: ["Template", "Standard-LOI"],
      permission: "Internal Only",
      size: "450 KB",
      uploadedBy: "Admin Template Sync"
    },
    {
      id: "doc-106",
      name: "Beacon_Hill_Title_Insurance_Commitment_Prelim",
      ext: ".pdf",
      category: "Property Info",
      tags: ["Title", "Beacon-Hill", "Prelim"],
      permission: "Underwriters Only",
      size: "4.2 MB",
      uploadedBy: "Title Desk Express"
    }
  ];

  // Store initial state for revert actions
  let INITIAL_STATE = JSON.parse(JSON.stringify(ATTACHMENTS));
  let selectedRowIds = new Set();

  // 2. Inject CSS Styles Dynamically
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .bulk-modal-active {
      overflow: hidden !important;
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
    .sheet-input:focus, .sheet-select:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.4);
    }
  `;
  document.head.appendChild(styleEl);

  // 3. Inject Launch Trigger Button Into Header
  document.addEventListener("DOMContentLoaded", () => {
    // Locate the navigation button group in the header
    const navBtnGroup = document.querySelector("header .flex.items-center.gap-3");
    if (navBtnGroup) {
      const editorTriggerBtn = document.createElement("button");
      editorTriggerBtn.type = "button";
      editorTriggerBtn.className = "hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:text-white border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all cursor-pointer shadow-lg shadow-emerald-500/5";
      editorTriggerBtn.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Bulk Doc Editor
      `;
      editorTriggerBtn.addEventListener("click", openBulkEditor);
      navBtnGroup.insertBefore(editorTriggerBtn, navBtnGroup.firstChild);
    }
    
    // Inject the actual Modal structure into body
    createBulkEditorModal();
  });

  // 4. Create UI Modal Element
  function createBulkEditorModal() {
    const modalMarkup = `
      <div id="bulk-editor-overlay" class="hidden fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl shadow-2xl relative flex flex-col my-8 h-[85vh] max-h-[900px]">
          <!-- Top Accent Light Glow -->
          <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Modal Header -->
          <div class="p-6 border-b border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 bg-slate-900/50 backdrop-blur-sm rounded-t-2xl">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/20">Power Utility v1.0</span>
                <span class="text-xs text-slate-500 font-mono">Attachment Grid Connection</span>
              </div>
              <h3 class="text-2xl font-extrabold text-white">Bulk Deal Metadata & Access Editor</h3>
              <p class="text-xs text-slate-400">Perform real-time multi-document renaming, program classifications, tag modifications, and security updates.</p>
            </div>
            
            <button onclick="closeBulkEditor()" class="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition-all self-end sm:self-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Batch Operations Toolbar (Floating Controller) -->
          <div class="bg-slate-950/90 border-b border-slate-800 p-4 px-6 grid grid-cols-1 xl:grid-cols-4 gap-4 items-center relative z-10">
            <div class="flex items-center gap-2 xl:col-span-1">
              <div class="w-2.5 h-2.5 rounded-full bg-indigo-500 node-pulse shrink-0"></div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-300">Batch Control Action:</span>
              <span id="selected-count-badge" class="ml-1 text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">0 Selected</span>
            </div>

            <!-- Operational Batch Controllers -->
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-2.5 xl:col-span-3 w-full">
              <!-- Prefix/Suffix Action -->
              <div class="relative">
                <input type="text" id="batch-rename-input" placeholder="Add File Name Prefix..." class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500">
                <button onclick="applyBatchPrefix()" class="absolute right-1 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-1 text-[9px] font-bold rounded uppercase tracking-wider transition-colors">Apply</button>
              </div>

              <!-- Batch Category -->
              <div>
                <select id="batch-category-select" onchange="applyBatchCategory(this.value)" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option value="" disabled selected>Batch Category</option>
                  <option value="Underwriting">Underwriting</option>
                  <option value="Financials">Financials</option>
                  <option value="Property Info">Property Info</option>
                  <option value="Entity Setup">Entity Setup</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>

              <!-- Batch Tags Addition -->
              <div class="relative">
                <input type="text" id="batch-tag-input" placeholder="Add comma-split tags..." class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500">
                <button onclick="applyBatchTags()" class="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600/80 hover:bg-indigo-600 text-white px-1.5 py-1 text-[9px] font-bold rounded uppercase tracking-wider transition-colors">Append</button>
              </div>

              <!-- Batch Permissions -->
              <div>
                <select id="batch-permission-select" onchange="applyBatchPermission(this.value)" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option value="" disabled selected>Batch Permission</option>
                  <option value="Public">Public</option>
                  <option value="Internal Only">Internal Only</option>
                  <option value="Underwriters Only">Underwriters Only</option>
                  <option value="Restricted">Restricted</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Spreadsheet Editable Layout Container -->
          <div class="flex-1 overflow-auto custom-scrollbar p-6 bg-slate-950/30">
            <div class="min-w-[900px]">
              <!-- Grid Header Column Labels -->
              <div class="grid grid-cols-12 gap-3 text-left font-bold text-[10px] text-slate-500 tracking-wider uppercase border-b border-slate-800 pb-3 mb-1 px-4">
                <div class="col-span-1 flex items-center justify-center">
                  <input type="checkbox" id="header-select-all" onclick="toggleSelectAllRows(this.checked)" class="w-3.5 h-3.5 rounded bg-slate-900 border-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 cursor-pointer">
                </div>
                <div class="col-span-4">File Base Name (Editable)</div>
                <div class="col-span-2">Program Category</div>
                <div class="col-span-2">Tags (Pills / Comma-separated)</div>
                <div class="col-span-2">Access Permissions</div>
                <div class="col-span-1 text-right">Metrics</div>
              </div>

              <!-- Dynamic Interactive Rows -->
              <div id="bulk-sheet-body" class="space-y-1.5 mt-2">
                <!-- Injected via JavaScript render function -->
              </div>
            </div>
          </div>

          <!-- Bottom Footer Controllers -->
          <div class="p-6 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div class="flex items-center gap-3">
              <button onclick="revertAllEdits()" class="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all border border-slate-800 cursor-pointer">
                Revert Setup
              </button>
              <button onclick="generateRandomDocRow()" class="px-4 py-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all border border-indigo-500/20 cursor-pointer">
                + Append Simulated File
              </button>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button onclick="closeBulkEditor()" class="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer">
                Cancel
              </button>
              <button onclick="saveAllBulkChanges()" class="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Commit Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const container = document.createElement("div");
    container.innerHTML = modalMarkup;
    document.body.appendChild(container);
  }

  // 5. Open & Close Modal Controller Functions
  window.openBulkEditor = function () {
    const overlay = document.getElementById("bulk-editor-overlay");
    if (overlay) {
      overlay.classList.remove("hidden");
      document.documentElement.classList.add("bulk-modal-active");
      renderSpreadsheet();
      updateSelectedRowBadge();
    }
  };

  window.closeBulkEditor = function () {
    const overlay = document.getElementById("bulk-editor-overlay");
    if (overlay) {
      overlay.classList.add("hidden");
      document.documentElement.classList.remove("bulk-modal-active");
    }
  };

  // 6. Primary Render Logic
  function renderSpreadsheet() {
    const sheetBody = document.getElementById("bulk-sheet-body");
    if (!sheetBody) return;

    sheetBody.innerHTML = ATTACHMENTS.map((doc, idx) => {
      const isChecked = selectedRowIds.has(doc.id);
      
      // Determine badge color for categories
      let catBadgeClass = "bg-slate-900 border-slate-800 text-slate-300";
      if (doc.category === "Underwriting") catBadgeClass = "bg-indigo-950/40 border-indigo-500/20 text-indigo-300";
      else if (doc.category === "Financials") catBadgeClass = "bg-emerald-950/40 border-emerald-500/20 text-emerald-300";
      else if (doc.category === "Property Info") catBadgeClass = "bg-amber-950/40 border-amber-500/20 text-amber-300";
      else if (doc.category === "Entity Setup") catBadgeClass = "bg-purple-950/40 border-purple-500/20 text-purple-300";
      else if (doc.category === "Legal") catBadgeClass = "bg-rose-950/40 border-rose-500/20 text-rose-300";

      // Access permission styling
      let permTextClass = "text-slate-400";
      if (doc.permission === "Restricted") permTextClass = "text-red-400 font-bold";
      else if (doc.permission === "Underwriters Only") permTextClass = "text-indigo-400 font-bold";
      else if (doc.permission === "Public") permTextClass = "text-emerald-400";

      // Generate Row Layout
      return `
        <div id="row-${doc.id}" class="grid grid-cols-12 gap-3 items-center py-2 px-4 rounded-xl border border-slate-800/60 bg-slate-950/40 hover:bg-slate-900/30 transition-all ${isChecked ? 'bg-indigo-500/5 border-indigo-500/20' : ''}">
          <!-- Checkbox Column -->
          <div class="col-span-1 flex items-center justify-center">
            <input type="checkbox" data-id="${doc.id}" ${isChecked ? 'checked' : ''} onchange="toggleRowSelection('${doc.id}', this.checked)" class="row-selector w-3.5 h-3.5 rounded bg-slate-900 border-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 cursor-pointer">
          </div>

          <!-- File Base Name (With inline input editing) -->
          <div class="col-span-4 flex items-center gap-2">
            <div class="relative w-full">
              <input type="text" value="${doc.name}" onkeyup="updateDocField('${doc.id}', 'name', this.value)" class="sheet-input w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded px-2 py-1 text-xs text-slate-200 transition-colors placeholder-slate-500">
              <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">${doc.ext}</span>
            </div>
          </div>

          <!-- Program Category (Interactive Select) -->
          <div class="col-span-2">
            <div class="relative">
              <select onchange="updateDocField('${doc.id}', 'category', this.value); renderSpreadsheet();" class="sheet-select w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded p-1 text-xs text-slate-300 cursor-pointer appearance-none">
                <option value="Underwriting" ${doc.category === 'Underwriting' ? 'selected' : ''}>Underwriting</option>
                <option value="Financials" ${doc.category === 'Financials' ? 'selected' : ''}>Financials</option>
                <option value="Property Info" ${doc.category === 'Property Info' ? 'selected' : ''}>Property Info</option>
                <option value="Entity Setup" ${doc.category === 'Entity Setup' ? 'selected' : ''}>Entity Setup</option>
                <option value="Legal" ${doc.category === 'Legal' ? 'selected' : ''}>Legal</option>
              </select>
              <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none w-1.5 h-1.5 rounded-full ${doc.category === 'Underwriting' ? 'bg-indigo-400' : doc.category === 'Financials' ? 'bg-emerald-400' : 'bg-slate-500'}"></div>
            </div>
          </div>

          <!-- Tags Multi-Pill System -->
          <div class="col-span-2">
            <input type="text" value="${doc.tags.join(', ')}" onkeyup="updateDocTags('${doc.id}', this.value)" placeholder="Split tags by comma..." class="sheet-input w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded px-2 py-1 text-xs text-indigo-300 font-mono transition-colors placeholder-slate-600">
          </div>

          <!-- Permissions Select Option -->
          <div class="col-span-2">
            <select onchange="updateDocField('${doc.id}', 'permission', this.value)" class="sheet-select w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded p-1 text-xs ${permTextClass} cursor-pointer">
              <option value="Public" ${doc.permission === 'Public' ? 'selected' : ''}>🔓 Public Access</option>
              <option value="Internal Only" ${doc.permission === 'Internal Only' ? 'selected' : ''}>🔒 Internal Only</option>
              <option value="Underwriters Only" ${doc.permission === 'Underwriters Only' ? 'selected' : ''}>⚡ Underwriters</option>
              <option value="Restricted" ${doc.permission === 'Restricted' ? 'selected' : ''}>🛑 Restricted Access</option>
            </select>
          </div>

          <!-- Document Specifications Metric Metadata -->
          <div class="col-span-1 text-right text-[11px] text-slate-500 space-y-0.5">
            <span class="block text-slate-300 font-mono">${doc.size}</span>
            <span class="block text-[9px] text-slate-500 truncate" title="Uploaded by: ${doc.uploadedBy}">${doc.uploadedBy}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // 7. Event Updates / Handlers on Fields
  window.updateDocField = function (id, field, val) {
    const doc = ATTACHMENTS.find(d => d.id === id);
    if (doc) {
      doc[field] = val;
    }
  };

  window.updateDocTags = function (id, tagString) {
    const doc = ATTACHMENTS.find(d => d.id === id);
    if (doc) {
      // Split by commas, trim excess whitespaces, filter out empty elements
      doc.tags = tagString.split(",").map(t => t.trim()).filter(Boolean);
    }
  };

  // 8. Row Selection Mechanisms
  window.toggleRowSelection = function (id, checked) {
    const rowElement = document.getElementById(`row-${id}`);
    if (checked) {
      selectedRowIds.add(id);
      rowElement?.classList.add("bg-indigo-500/5", "border-indigo-500/20");
    } else {
      selectedRowIds.delete(id);
      rowElement?.classList.remove("bg-indigo-500/5", "border-indigo-500/20");
    }
    updateSelectedRowBadge();
    updateHeaderCheckboxState();
  };

  window.toggleSelectAllRows = function (checked) {
    selectedRowIds.clear();
    const selectors = document.querySelectorAll(".row-selector");
    selectors.forEach(sel => {
      sel.checked = checked;
      const id = sel.getAttribute("data-id");
      if (checked) {
        selectedRowIds.add(id);
      }
    });
    renderSpreadsheet();
    updateSelectedRowBadge();
  };

  function updateSelectedRowBadge() {
    const badge = document.getElementById("selected-count-badge");
    if (badge) {
      badge.textContent = `${selectedRowIds.size} Selected`;
    }
  }

  function updateHeaderCheckboxState() {
    const headerCheckbox = document.getElementById("header-select-all");
    if (headerCheckbox) {
      headerCheckbox.checked = selectedRowIds.size === ATTACHMENTS.length && ATTACHMENTS.length > 0;
    }
  }

  // 9. Batch Controller Executions
  window.applyBatchPrefix = function () {
    const input = document.getElementById("batch-rename-input");
    const prefix = input ? input.value.trim() : "";
    
    if (!prefix) {
      triggerEditorToast("Please type a valid prefix first");
      return;
    }
    if (selectedRowIds.size === 0) {
      triggerEditorToast("No files selected for batch renaming");
      return;
    }

    ATTACHMENTS.forEach(doc => {
      if (selectedRowIds.has(doc.id)) {
        doc.name = prefix + doc.name;
      }
    });

    renderSpreadsheet();
    if (input) input.value = "";
    triggerEditorToast(`Applied prefix "${prefix}" to ${selectedRowIds.size} files`);
  };

  window.applyBatchCategory = function (category) {
    if (!category) return;
    if (selectedRowIds.size === 0) {
      triggerEditorToast("No files selected for category update");
      return;
    }

    ATTACHMENTS.forEach(doc => {
      if (selectedRowIds.has(doc.id)) {
        doc.category = category;
      }
    });

    renderSpreadsheet();
    // Reset selector value
    document.getElementById("batch-category-select").value = "";
    triggerEditorToast(`Assigned Category "${category}" to ${selectedRowIds.size} files`);
  };

  window.applyBatchTags = function () {
    const input = document.getElementById("batch-tag-input");
    const tagString = input ? input.value.trim() : "";

    if (!tagString) {
      triggerEditorToast("Please type tag values (comma-separated)");
      return;
    }
    if (selectedRowIds.size === 0) {
      triggerEditorToast("Select files to append tags to");
      return;
    }

    const newTags = tagString.split(",").map(t => t.trim()).filter(Boolean);

    ATTACHMENTS.forEach(doc => {
      if (selectedRowIds.has(doc.id)) {
        // Append unique tags
        doc.tags = Array.from(new Set([...doc.tags, ...newTags]));
      }
    });

    renderSpreadsheet();
    if (input) input.value = "";
    triggerEditorToast(`Appended tags to ${selectedRowIds.size} files`);
  };

  window.applyBatchPermission = function (permission) {
    if (!permission) return;
    if (selectedRowIds.size === 0) {
      triggerEditorToast("No files selected for permission updates");
      return;
    }

    ATTACHMENTS.forEach(doc => {
      if (selectedRowIds.has(doc.id)) {
        doc.permission = permission;
      }
    });

    renderSpreadsheet();
    document.getElementById("batch-permission-select").value = "";
    triggerEditorToast(`Updated permission to "${permission}" for ${selectedRowIds.size} files`);
  };

  // 10. Revert State Operation
  window.revertAllEdits = function () {
    ATTACHMENTS = JSON.parse(JSON.stringify(INITIAL_STATE));
    selectedRowIds.clear();
    renderSpreadsheet();
    updateSelectedRowBadge();
    updateHeaderCheckboxState();
    triggerEditorToast("Reset all spreadsheet variables to original state");
  };

  // 11. Append Simulated File
  window.generateRandomDocRow = function () {
    const fileOptions = [
      { name: "Apex_CA_LTV_Analysis", ext: ".xlsx", cat: "Underwriting", size: "1.8 MB" },
      { name: "Lumina_AZ_Hazard_Policy", ext: ".pdf", cat: "Property Info", size: "3.2 MB" },
      { name: "Summit_TX_LLC_Operating_Agreement", ext: ".pdf", cat: "Entity Setup", size: "2.5 MB" },
      { name: "Veritas_FL_Profit_And_Loss_Statement_Q3", ext: ".xlsx", cat: "Financials", size: "4.1 MB" },
      { name: "National_Vanguard_Broker_Commission_Form", ext: ".pdf", cat: "Legal", size: "900 KB" }
    ];

    const pick = fileOptions[Math.floor(Math.random() * fileOptions.length)];
    const uniqueId = "doc-" + Date.now();
    const newDoc = {
      id: uniqueId,
      name: `${pick.name}_Simulated_${Math.floor(100 + Math.random() * 900)}`,
      ext: pick.ext,
      category: pick.cat,
      tags: ["Simulated", "Draft"],
      permission: "Internal Only",
      size: pick.size,
      uploadedBy: "Admin Simulated Input"
    };

    ATTACHMENTS.push(newDoc);
    renderSpreadsheet();
    triggerEditorToast(`Appended random document: ${newDoc.name}`);
  };

  // 12. Save All Changes Function
  window.saveAllBulkChanges = function () {
    // Process commit and save back to original baseline state
    INITIAL_STATE = JSON.parse(JSON.stringify(ATTACHMENTS));
    
    // Create a gorgeous simulate loading animation
    const overlay = document.getElementById("bulk-editor-overlay");
    const container = overlay.querySelector('.max-w-6xl');
    
    container.classList.add("opacity-30", "pointer-events-none");
    
    setTimeout(() => {
      container.classList.remove("opacity-30", "pointer-events-none");
      closeBulkEditor();
      
      // Try to hook into base toast system
      if (typeof window.showToast === "function") {
        window.showToast("All document changes permanently committed!");
      } else {
        alert("Success: Metadata changes committed successfully!");
      }
    }, 1200);
  };

  // Helper Toast for immediate modal workspace feedback
  function triggerEditorToast(msg) {
    if (typeof window.showToast === "function") {
      window.showToast(msg);
    } else {
      // Inline Fallback Toast
      let inlineToast = document.getElementById("bulk-inline-toast");
      if (!inlineToast) {
        inlineToast = document.createElement("div");
        inlineToast.id = "bulk-inline-toast";
        inlineToast.className = "fixed bottom-5 left-5 z-[60] bg-slate-900 border border-emerald-500/30 text-white rounded-lg px-4 py-3 shadow-2xl max-w-sm flex items-center gap-2 transition-all duration-300";
        document.body.appendChild(inlineToast);
      }
      inlineToast.innerHTML = `
        <div class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs">✓</div>
        <p class="text-xs text-slate-300 font-medium">${msg}</p>
      `;
      inlineToast.style.opacity = "1";
      setTimeout(() => {
        inlineToast.style.opacity = "0";
      }, 3000);
    }
  }

})();