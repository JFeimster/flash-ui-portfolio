// UNIFIED ASSET & FILE EXPLORER COMPONENT
// Mounts directly to the main workspace and coordinates dynamic management of transaction-critical attachments.

(function () {
    // Inject Custom Styles for File Explorer
    const style = document.createElement('style');
    style.textContent = `
        .explorer-terminal-pulse {
            animation: terminal-pulse 2s infinite alternate;
        }
        @keyframes terminal-pulse {
            0% { opacity: 0.6; }
            100% { opacity: 1; text-shadow: 0 0 8px #00f0ff; }
        }
        .file-card-selected {
            border-color: #00f0ff !important;
            background: rgba(0, 240, 255, 0.04) !important;
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.1);
        }
    `;
    document.head.appendChild(style);

    // Initial Database of Attachments / Assets
    let attachments = [
        { id: 101, name: "executive-summary-apex.pdf", size: "4.2 MB", type: "pdf", category: "Financial", date: "2024-02-22", tags: ["Sponsor", "Underwriting"], previewUrl: "" },
        { id: 102, name: "sunset-blvd-appraisal-v4.pdf", size: "18.7 MB", type: "pdf", category: "Collateral", date: "2024-02-20", tags: ["Valuation", "Tier 1"], previewUrl: "" },
        { id: 103, name: "property-elevation-south.jpg", size: "3.4 MB", type: "image", category: "Collateral", date: "2024-02-19", tags: ["Media", "Site Inspection"], previewUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80" },
        { id: 104, name: "operating-agreement-joint-venture.docx", size: "1.1 MB", type: "doc", category: "Legal", date: "2024-02-18", tags: ["Entity Docs", "KYC"], previewUrl: "" },
        { id: 105, name: "pro-forma-stabilization-model.xlsx", size: "890 KB", type: "spreadsheet", category: "Financial", date: "2024-02-17", tags: ["Underwriting", "Yields"], previewUrl: "" },
        { id: 106, name: "loi-draft-signed-executed.pdf", size: "1.8 MB", type: "pdf", category: "Term Sheets", date: "2024-02-15", tags: ["Legal", "Executed"], previewUrl: "" },
        { id: 107, name: "phase-i-environmental-audit.pdf", size: "24.5 MB", type: "pdf", category: "Collateral", date: "2024-02-10", tags: ["Compliance", "Hazard Site"], previewUrl: "" },
        { id: 108, name: "primary-site-ingress-aerial.png", size: "5.1 MB", type: "image", category: "Collateral", date: "2024-02-08", tags: ["Media", "Site Inspection"], previewUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" }
    ];

    // Core Interaction State
    let state = {
        searchQuery: "",
        categoryFilter: "ALL",
        typeFilter: "ALL",
        sortBy: "date-desc",
        viewMode: "grid", // "grid" or "list"
        selectedIds: [],
        uploadProgress: null,
        activePreviewId: null
    };

    // Locate container to inject (Inject at the bottom of the core workspace container, before footer)
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    // Create Section Container
    const explorerSection = document.createElement('section');
    explorerSection.id = "asset-explorer-workspace";
    explorerSection.className = "mt-12 pt-12 border-t border-cyber-border/60 relative";
    
    // Inject Section Structure
    explorerSection.innerHTML = `
        <!-- HEADER MODULE -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-purple/30 bg-cyber-purple/5 mb-3 text-xs font-mono text-cyber-purple uppercase tracking-widest">
                    <span class="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-ping"></span>
                    Terminal Storage Gateway
                </div>
                <h2 class="text-3xl font-extrabold tracking-tight text-white leading-none">
                    UNIFIED ASSET & <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-cyber-emerald">FILE EXPLORER</span>
                </h2>
                <p class="text-slate-400 text-xs mt-1 font-mono uppercase tracking-wider">
                    DECRYPTED TRANSMISSIONS: <span id="explorer-telemetry-count" class="text-cyber-accent">8 Files</span> | CAPACITY: <span class="text-slate-200">59.6 MB / 500 MB SECURE NODE</span>
                </p>
            </div>

            <!-- VIEW MODE TOGGLES -->
            <div class="flex items-center gap-2 bg-black/40 border border-cyber-border p-1.5 rounded-lg">
                <button id="view-mode-grid-btn" class="p-1.5 rounded text-cyber-accent bg-cyber-accent/10 border border-cyber-accent/20 transition-all duration-150" title="Grid Layout">
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                </button>
                <button id="view-mode-list-btn" class="p-1.5 rounded text-slate-400 hover:text-cyber-accent hover:bg-cyber-accent/5 transition-all duration-150" title="List Layout">
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>
        </div>

        <!-- SEARCH, FILTERS & CONTROL PANEL -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div class="lg:col-span-3 bg-cyber-card border border-cyber-border p-5 rounded-xl flex flex-col gap-4 relative">
                <!-- Top Filter Row -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <!-- Text Filter -->
                    <div>
                        <label class="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Search Files</label>
                        <div class="relative">
                            <input id="explorer-search" type="text" placeholder="Filter by document name..." 
                                class="w-full bg-black/60 border border-cyber-border rounded-lg py-1.5 px-3 pl-8 text-xs text-slate-200 focus:outline-none focus:border-cyber-purple transition-all">
                            <svg class="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <!-- Category Filter -->
                    <div>
                        <label class="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Asset Classification</label>
                        <select id="explorer-category-filter" class="w-full bg-black/60 border border-cyber-border rounded-lg py-1.5 px-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-purple">
                            <option value="ALL">All Categories</option>
                            <option value="Financial">Financials & Underwriting</option>
                            <option value="Collateral">Collateral & Site Specs</option>
                            <option value="Legal">Legal & Corporate Entity</option>
                            <option value="Term Sheets">LOIs & Term Sheets</option>
                        </select>
                    </div>
                    <!-- Type Filter -->
                    <div>
                        <label class="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Extension Type</label>
                        <select id="explorer-type-filter" class="w-full bg-black/60 border border-cyber-border rounded-lg py-1.5 px-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-purple">
                            <option value="ALL">All Formats</option>
                            <option value="pdf">Adobe Document (PDF)</option>
                            <option value="image">Raster Image (JPG/PNG)</option>
                            <option value="doc">Word Document (DOCX)</option>
                            <option value="spreadsheet">Excel Workbook (XLSX)</option>
                        </select>
                    </div>
                </div>

                <!-- Sort & Batch Control Row -->
                <div class="pt-4 border-t border-cyber-border/40 flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-mono text-slate-500 uppercase">Sort Order:</span>
                        <select id="explorer-sort" class="bg-black/40 border border-cyber-border rounded px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyber-accent">
                            <option value="date-desc">Newest Uploaded First</option>
                            <option value="date-asc">Oldest Uploaded First</option>
                            <option value="name-asc">Alphabetical (A-Z)</option>
                            <option value="size-desc">Largest File Size</option>
                        </select>
                    </div>

                    <!-- Dynamic Bulk Action Widget -->
                    <div id="explorer-bulk-actions" class="hidden items-center gap-3">
                        <span class="text-[10px] font-mono text-cyber-purple uppercase tracking-wider">
                            <strong id="explorer-selected-count">0</strong> Selected File(s)
                        </span>
                        <div class="flex gap-1.5">
                            <button id="explorer-bulk-download" class="px-2 py-1 bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent hover:text-black transition-colors text-[10px] font-mono uppercase rounded">
                                Package ZIP
                            </button>
                            <button id="explorer-bulk-delete" class="px-2 py-1 bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-[10px] font-mono uppercase rounded">
                                Wipe Assets
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- UPLOAD ZONE (Interactive Drag & Drop) -->
            <div id="explorer-upload-zone" class="bg-gradient-to-br from-cyber-card to-black border-2 border-dashed border-cyber-border hover:border-cyber-purple/80 p-5 rounded-xl flex flex-col justify-center items-center text-center group cursor-pointer transition-all duration-300 relative overflow-hidden">
                <input type="file" id="explorer-file-input" class="hidden" multiple>
                <div class="absolute inset-0 bg-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                <svg class="w-8 h-8 text-slate-500 group-hover:text-cyber-purple transition-colors duration-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p class="text-xs font-mono font-bold text-slate-300 group-hover:text-white uppercase transition-colors">DRAG & DROP DEAL ASSETS</p>
                <p class="text-[10px] text-slate-500 mt-1 uppercase">OR CLICK TO TRANSMIT DIRECTLY</p>
                
                <!-- Micro-upload Simulation Progress -->
                <div id="explorer-upload-progress-container" class="hidden w-full mt-3 bg-black/80 p-2.5 rounded border border-cyber-purple/40 text-left font-mono text-[9px]">
                    <div class="flex justify-between text-cyber-purple mb-1">
                        <span class="explorer-terminal-pulse">UPLOADING...</span>
                        <span id="explorer-upload-pct">0%</span>
                    </div>
                    <div class="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div id="explorer-upload-bar" class="bg-cyber-purple h-full transition-all duration-200" style="width: 0%"></div>
                    </div>
                    <p id="explorer-upload-filename" class="text-slate-500 mt-1 truncate">file.pdf</p>
                </div>
            </div>
        </div>

        <!-- FILE VIEWER GRID / LIST -->
        <div id="explorer-items-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <!-- Rendered dynamically by javascript -->
        </div>

        <!-- DETAIL PREVIEW MODAL -->
        <div id="explorer-preview-modal" class="fixed inset-0 bg-black/90 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
            <div class="bg-cyber-card border border-cyber-accent w-full max-w-2xl p-6 rounded-xl relative edge-clip max-h-[90vh] overflow-y-auto">
                <!-- Glowing corner markers -->
                <div class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-accent"></div>
                <div class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-accent"></div>
                <div class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-accent"></div>
                <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-accent"></div>

                <div class="flex justify-between items-start mb-6 pb-4 border-b border-cyber-border">
                    <div>
                        <span id="preview-file-category" class="text-[10px] font-mono text-cyber-purple uppercase tracking-widest">Asset Class</span>
                        <h4 id="preview-file-title" class="text-xl font-bold text-slate-100">Document_Preview.pdf</h4>
                        <p id="preview-file-telemetry" class="text-xs font-mono text-slate-500 mt-1">Uploaded: 2024-02-14 | Format: PDF</p>
                    </div>
                    <button id="explorer-preview-close" class="text-slate-400 hover:text-white p-1 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Dynamic Preview Media Container -->
                <div class="bg-black/60 rounded-lg border border-cyber-border p-4 flex items-center justify-center min-h-[250px] relative overflow-hidden mb-6">
                    <div id="preview-media-wrapper" class="w-full h-full flex items-center justify-center">
                        <!-- Dynamic Media content loaded here -->
                    </div>
                </div>

                <!-- Tags & Operational Actions inside modal -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-cyber-border/60">
                    <div id="preview-file-tags" class="flex flex-wrap gap-1.5">
                        <!-- File tags rendered here -->
                    </div>
                    <div class="flex gap-2">
                        <button id="preview-action-download" class="flex-1 sm:flex-initial px-4 py-2 bg-cyber-accent hover:bg-cyan-400 text-black text-xs font-mono font-bold uppercase rounded transition-colors edge-clip">
                            Download Asset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    mainContainer.appendChild(explorerSection);

    // Grab Injected DOM nodes
    const itemsContainer = document.getElementById("explorer-items-container");
    const searchInput = document.getElementById("explorer-search");
    const categoryFilter = document.getElementById("explorer-category-filter");
    const typeFilter = document.getElementById("explorer-type-filter");
    const sortSelect = document.getElementById("explorer-sort");
    const telemetryCount = document.getElementById("explorer-telemetry-count");
    const gridViewBtn = document.getElementById("view-mode-grid-btn");
    const listViewBtn = document.getElementById("view-mode-list-btn");
    
    const dragZone = document.getElementById("explorer-upload-zone");
    const fileInput = document.getElementById("explorer-file-input");
    const uploadProgressCont = document.getElementById("explorer-upload-progress-container");
    const uploadPct = document.getElementById("explorer-upload-pct");
    const uploadBar = document.getElementById("explorer-upload-bar");
    const uploadFilename = document.getElementById("explorer-upload-filename");

    const bulkActionsBar = document.getElementById("explorer-bulk-actions");
    const bulkSelectedCount = document.getElementById("explorer-selected-count");
    const bulkDownloadBtn = document.getElementById("explorer-bulk-download");
    const bulkDeleteBtn = document.getElementById("explorer-bulk-delete");

    const previewModal = document.getElementById("explorer-preview-modal");
    const previewClose = document.getElementById("explorer-preview-close");
    const previewTitle = document.getElementById("preview-file-title");
    const previewCategory = document.getElementById("preview-file-category");
    const previewTelemetry = document.getElementById("preview-file-telemetry");
    const previewMediaWrapper = document.getElementById("preview-media-wrapper");
    const previewTags = document.getElementById("preview-file-tags");
    const previewDownload = document.getElementById("preview-action-download");

    // Initialize View & Event listeners
    renderFiles();

    searchInput.addEventListener("input", (e) => { state.searchQuery = e.target.value.toLowerCase(); renderFiles(); });
    categoryFilter.addEventListener("change", (e) => { state.categoryFilter = e.target.value; renderFiles(); });
    typeFilter.addEventListener("change", (e) => { state.typeFilter = e.target.value; renderFiles(); });
    sortSelect.addEventListener("change", (e) => { state.sortBy = e.target.value; renderFiles(); });

    gridViewBtn.addEventListener("click", () => { toggleViewMode("grid"); });
    listViewBtn.addEventListener("click", () => { toggleViewMode("list"); });

    // Drag-And-Drop Operations
    dragZone.addEventListener("click", () => fileInput.click());
    dragZone.addEventListener("dragover", (e) => { e.preventDefault(); dragZone.classList.add("border-cyber-accent"); });
    dragZone.addEventListener("dragleave", () => { dragZone.classList.remove("border-cyber-accent"); });
    dragZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dragZone.classList.remove("border-cyber-accent");
        if (e.dataTransfer.files.length > 0) {
            handleUploadedFiles(e.dataTransfer.files);
        }
    });
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleUploadedFiles(e.target.files);
        }
    });

    // Bulk Actions handlers
    bulkDownloadBtn.addEventListener("click", () => {
        alert(`SUCCESS: Packaging ${state.selectedIds.length} assets into secure ZIP node. Download starting.`);
        clearSelection();
    });
    bulkDeleteBtn.addEventListener("click", () => {
        if (confirm(`Wipe ${state.selectedIds.length} active files from local cache? This cannot be undone.`)) {
            attachments = attachments.filter(a => !state.selectedIds.includes(a.id));
            clearSelection();
            renderFiles();
        }
    });

    previewClose.addEventListener("click", closePreview);
    previewDownload.addEventListener("click", () => {
        alert(`SUCCESS: Initializing safe direct endpoint routing to fetch selected file asset.`);
    });

    // File list rendering logic
    function renderFiles() {
        itemsContainer.innerHTML = "";

        // Apply search, categories, extension format filters
        let filtered = attachments.filter(file => {
            const matchesSearch = file.name.toLowerCase().includes(state.searchQuery);
            const matchesCategory = state.categoryFilter === "ALL" || file.category === state.categoryFilter;
            const matchesType = state.typeFilter === "ALL" || file.type === state.typeFilter;
            return matchesSearch && matchesCategory && matchesType;
        });

        // Apply sorts
        filtered.sort((a, b) => {
            if (state.sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
            if (state.sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
            if (state.sortBy === "name-asc") return a.name.localeCompare(b.name);
            if (state.sortBy === "size-desc") {
                const parseSize = (sz) => {
                    const parsed = parseFloat(sz);
                    return sz.includes("MB") ? parsed * 1024 : parsed;
                };
                return parseSize(b.size) - parseSize(a.size);
            }
            return 0;
        });

        // Telemetry calculation
        telemetryCount.innerText = `${filtered.length} File${filtered.length !== 1 ? 's' : ''}`;

        if (filtered.length === 0) {
            itemsContainer.className = "col-span-full py-16 text-center border border-dashed border-cyber-border rounded-xl";
            itemsContainer.innerHTML = `
                <div class="max-w-xs mx-auto text-center">
                    <svg class="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2m0-10V6a2 2 0 012-2h2m0 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6"></path></svg>
                    <p class="font-mono text-xs text-slate-500 uppercase tracking-widest">Storage Cache Clean</p>
                    <p class="text-[11px] text-slate-600 mt-1">No file transmissions match the current filters.</p>
                </div>
            `;
            return;
        }

        // Apply View classes to Grid Container dynamically
        if (state.viewMode === "grid") {
            itemsContainer.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
        } else {
            itemsContainer.className = "flex flex-col gap-2";
        }

        filtered.forEach(file => {
            const card = document.createElement("div");
            const isSelected = state.selectedIds.includes(file.id);
            const typeIcon = getTypeIcon(file.type);
            
            // Format styling depending on view layout selected
            if (state.viewMode === "grid") {
                card.className = `bg-cyber-card border border-cyber-border hover:border-cyber-purple/60 p-4.5 rounded-xl transition-all duration-300 relative group flex flex-col justify-between edge-clip cursor-pointer ${isSelected ? 'file-card-selected' : ''}`;
                card.innerHTML = `
                    <div>
                        <div class="flex items-start justify-between mb-3">
                            <div class="p-2 bg-black/40 rounded border border-cyber-border/80 text-cyber-accent group-hover:text-cyber-purple transition-colors duration-200">
                                ${typeIcon}
                            </div>
                            <input type="checkbox" data-file-id="${file.id}" ${isSelected ? 'checked' : ''} class="explorer-checkbox rounded border-cyber-border bg-black text-cyber-accent focus:ring-0 cursor-pointer">
                        </div>

                        <h5 class="text-sm font-bold text-slate-200 group-hover:text-white transition-colors duration-200 truncate pr-4" title="${file.name}">${file.name}</h5>
                        <p class="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">${file.category} | ${file.size}</p>
                    </div>

                    <div class="mt-4 pt-3 border-t border-cyber-border/40 flex items-center justify-between">
                        <span class="text-[10px] font-mono text-slate-400 font-light">${file.date}</span>
                        <div class="flex gap-2">
                            <button onclick="event.stopPropagation(); window.explorerFunctions.openPreview(${file.id})" class="text-[10px] font-mono font-bold text-cyber-emerald hover:text-white uppercase tracking-wider transition-colors">
                                View
                            </button>
                            <button onclick="event.stopPropagation(); window.explorerFunctions.deleteFile(${file.id})" class="text-[10px] font-mono font-bold text-red-400 hover:text-red-300 uppercase tracking-wider transition-colors">
                                Wipe
                            </button>
                        </div>
                    </div>
                `;
            } else {
                // List Mode Row
                card.className = `bg-cyber-card border border-cyber-border hover:border-cyber-accent/60 p-3.5 rounded-lg transition-all duration-200 relative group flex items-center justify-between cursor-pointer ${isSelected ? 'file-card-selected' : ''}`;
                card.innerHTML = `
                    <div class="flex items-center gap-4.5 min-w-0 flex-1">
                        <input type="checkbox" data-file-id="${file.id}" ${isSelected ? 'checked' : ''} class="explorer-checkbox rounded border-cyber-border bg-black text-cyber-accent focus:ring-0 cursor-pointer">
                        
                        <div class="p-1.5 bg-black/40 rounded border border-cyber-border/80 text-cyber-accent">
                            ${typeIcon}
                        </div>
                        
                        <div class="min-w-0 flex-1">
                            <h5 class="text-sm font-bold text-slate-200 group-hover:text-white truncate" title="${file.name}">${file.name}</h5>
                            <p class="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Category: ${file.category} | Size: ${file.size} | Date: ${file.date}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-4 ml-4">
                        <button onclick="event.stopPropagation(); window.explorerFunctions.openPreview(${file.id})" class="text-xs font-mono font-bold text-cyber-emerald hover:text-white uppercase tracking-wider transition-colors">
                            Preview
                        </button>
                        <button onclick="event.stopPropagation(); window.explorerFunctions.deleteFile(${file.id})" class="text-xs font-mono font-bold text-red-400 hover:text-red-300 uppercase tracking-wider transition-colors">
                            Wipe
                        </button>
                    </div>
                `;
            }

            // Click listener for entire card to select/toggle
            card.addEventListener("click", (e) => {
                if (e.target.type === "checkbox") return; // Handled separately
                toggleSelect(file.id);
            });

            // Bind checkbox inside cards
            const chk = card.querySelector(".explorer-checkbox");
            chk.addEventListener("change", (e) => {
                e.stopPropagation();
                toggleSelect(file.id, e.target.checked);
            });

            itemsContainer.appendChild(card);
        });

        updateBulkActionsBar();
    }

    // SVG File Icon Helper
    function getTypeIcon(type) {
        if (type === "pdf") {
            return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`;
        }
        if (type === "image") {
            return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
        }
        if (type === "spreadsheet") {
            return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`;
        }
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`;
    }

    // State Select Actions
    function toggleSelect(id, forceValue = null) {
        const index = state.selectedIds.indexOf(id);
        const shouldSelect = forceValue !== null ? forceValue : index === -1;

        if (shouldSelect) {
            if (index === -1) state.selectedIds.push(id);
        } else {
            if (index !== -1) state.selectedIds.splice(index, 1);
        }

        renderFiles();
    }

    function clearSelection() {
        state.selectedIds = [];
        renderFiles();
    }

    function updateBulkActionsBar() {
        if (state.selectedIds.length > 0) {
            bulkActionsBar.classList.remove("hidden");
            bulkActionsBar.classList.add("flex");
            bulkSelectedCount.innerText = state.selectedIds.length;
        } else {
            bulkActionsBar.classList.add("hidden");
            bulkActionsBar.classList.remove("flex");
        }
    }

    // View toggle state logic
    function toggleViewMode(mode) {
        state.viewMode = mode;
        if (mode === "grid") {
            gridViewBtn.className = "p-1.5 rounded text-cyber-accent bg-cyber-accent/10 border border-cyber-accent/20 transition-all duration-150";
            listViewBtn.className = "p-1.5 rounded text-slate-400 hover:text-cyber-accent hover:bg-cyber-accent/5 transition-all duration-150";
        } else {
            listViewBtn.className = "p-1.5 rounded text-cyber-accent bg-cyber-accent/10 border border-cyber-accent/20 transition-all duration-150";
            gridViewBtn.className = "p-1.5 rounded text-slate-400 hover:text-cyber-accent hover:bg-cyber-accent/5 transition-all duration-150";
        }
        renderFiles();
    }

    // Drop Simulation Handlers
    function handleUploadedFiles(uploadedFiles) {
        if (uploadedFiles.length === 0) return;

        let index = 0;
        uploadProgressCont.classList.remove("hidden");

        const processNext = () => {
            if (index >= uploadedFiles.length) {
                // Done loading all dropped assets
                setTimeout(() => {
                    uploadProgressCont.classList.add("hidden");
                }, 800);
                return;
            }

            const currentFile = uploadedFiles[index];
            uploadFilename.innerText = currentFile.name;
            
            // Simulating progress
            let pct = 0;
            const interval = setInterval(() => {
                pct += 10;
                uploadPct.innerText = `${pct}%`;
                uploadBar.style.width = `${pct}%`;

                if (pct >= 100) {
                    clearInterval(interval);
                    
                    // Push to simulation database
                    const fileExt = currentFile.name.split('.').pop().toLowerCase();
                    const sizeMB = (currentFile.size / (1024 * 1024)).toFixed(1);
                    const formattedSize = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${(currentFile.size / 1024).toFixed(0)} KB`;

                    attachments.unshift({
                        id: Date.now() + index,
                        name: currentFile.name,
                        size: formattedSize,
                        type: fileExt === "xlsx" || fileExt === "xls" ? "spreadsheet" : (["png", "jpg", "jpeg"].includes(fileExt) ? "image" : (fileExt === "docx" || fileExt === "doc" ? "doc" : "pdf")),
                        category: "Financial",
                        date: new Date().toISOString().split('T')[0],
                        tags: ["Upload Node", "Encrypted"],
                        previewUrl: ["png", "jpg", "jpeg"].includes(fileExt) ? URL.createObjectURL(currentFile) : ""
                    });

                    renderFiles();
                    index++;
                    processNext();
                }
            }, 120);
        };

        processNext();
    }

    // Modal Operations
    function openPreview(id) {
        const file = attachments.find(a => a.id === id);
        if (!file) return;

        state.activePreviewId = id;
        previewTitle.innerText = file.name;
        previewCategory.innerText = `${file.category} Asset Core`;
        previewTelemetry.innerText = `Size payload: ${file.size} | Transmitted: ${file.date} | Cryptography: SHA-256`;

        // Render dynamic media preview based on item formatting
        previewMediaWrapper.innerHTML = "";
        if (file.type === "image" && file.previewUrl) {
            previewMediaWrapper.innerHTML = `<img src="${file.previewUrl}" alt="Media Resource Preview" class="max-h-[350px] object-contain rounded border border-cyber-border bg-slate-950">`;
        } else if (file.type === "pdf") {
            // High fidelity mock rendering representing simulated interactive document viewport layout
            previewMediaWrapper.innerHTML = `
                <div class="w-full p-6 text-left font-mono text-xs text-slate-400 space-y-4">
                    <div class="flex items-center gap-3 border-b border-cyber-border/40 pb-3">
                        <svg class="w-8 h-8 text-cyber-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <div>
                            <p class="text-white font-bold uppercase">PREVIEW GENERATED - ENCRYPTED SECURE VIEW</p>
                            <p class="text-[10px]">VERIFICATION KEY: ${Math.random().toString(16).substring(2, 10).toUpperCase()}</p>
                        </div>
                    </div>
                    <div class="space-y-2 text-[11px] leading-relaxed">
                        <p class="text-cyber-emerald">[DOCUMENT VALIDATED] Direct balance sheet underwriters have certified transaction viability metrics.</p>
                        <p>1. Execution pathways initialized. Loan structures proposed target maximum asset leverage ratios.</p>
                        <p>2. Collateral details verify optimal location placement within high-demand secondary core parameters.</p>
                        <p>3. Risk allocation margins adjusted safely within compliance structures of Tier 1 regional facilities.</p>
                    </div>
                    <div class="text-[10px] text-slate-600 italic">SYSTEM PORTAL - End of Document Handshake Stream.</div>
                </div>
            `;
        } else {
            // General doc mock placeholder screen
            previewMediaWrapper.innerHTML = `
                <div class="text-center p-8">
                    <svg class="w-12 h-12 text-cyber-purple mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <p class="font-mono text-xs text-slate-300 uppercase">Binary File Format Detected</p>
                    <p class="text-[10px] text-slate-500 mt-1 uppercase">Direct editing and rendering requires dynamic Office module integration.</p>
                </div>
            `;
        }

        // Render Tag Badges
        previewTags.innerHTML = "";
        file.tags.forEach(tag => {
            const tagBadge = document.createElement("span");
            tagBadge.className = "bg-black/40 text-cyber-accent border border-cyber-accent/30 px-2.5 py-0.5 rounded text-[10px] font-mono";
            tagBadge.innerText = tag;
            previewTags.appendChild(tagBadge);
        });

        previewModal.classList.remove("hidden");
    }

    function closePreview() {
        previewModal.classList.add("hidden");
        state.activePreviewId = null;
    }

    function deleteFile(id) {
        if (confirm("Confirm permanently wiping asset attachment from database cache?")) {
            attachments = attachments.filter(a => a.id !== id);
            state.selectedIds = state.selectedIds.filter(selId => selId !== id);
            renderFiles();
        }
    }

    // Expose Global Interaction Methods for Inline Event Listeners
    window.explorerFunctions = {
        openPreview,
        deleteFile
    };

})();