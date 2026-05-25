/**
 * Core Flow - Document & Attachment Vault
 * Client-Side Vault Engine with Instant Sorting, Filtering, and Batch Operations
 * Designed with High-Voltage Neobrutalist Aesthetic matching the Base Component
 */

(function () {
    // 1. DYNAMIC CSS STYLE INJECTION (To preserve the high-octane Neobrutalist theme)
    const vaultStyles = `
        /* Document Vault Layout Styles */
        .vault-section {
            max-width: 1440px;
            margin: 40px auto;
            padding: 0 40px;
            display: none; /* Controlled by navigation router */
            animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .vault-grid-layout {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 30px;
            margin-top: 30px;
        }

        @media (max-width: 1024px) {
            .vault-grid-layout {
                grid-template-columns: 1fr;
            }
        }

        /* Sidebar Filters */
        .vault-sidebar {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            box-shadow: var(--brutal-shadow);
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            height: fit-content;
        }

        .sidebar-title {
            font-family: var(--font-display);
            text-transform: uppercase;
            font-size: 18px;
            font-weight: 800;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 12px;
            color: var(--accent-cyan);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .filter-label {
            font-size: 12px;
            text-transform: uppercase;
            color: var(--text-secondary);
            font-weight: 700;
            letter-spacing: 1px;
        }

        /* Brutalist Checkboxes */
        .brutal-checkbox-label {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            color: var(--text-primary);
            user-select: none;
        }

        .brutal-checkbox {
            appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid var(--border-color);
            background: var(--bg-primary);
            cursor: pointer;
            position: relative;
            transition: all 0.1s ease;
        }

        .brutal-checkbox:checked {
            background: var(--accent-orange);
            border-color: #000;
            box-shadow: 2px 2px 0px #000;
        }

        .brutal-checkbox:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #000;
            font-weight: 900;
            font-size: 11px;
        }

        /* Tag Cloud Filter */
        .tag-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .vault-tag-btn {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.1s ease;
        }

        .vault-tag-btn:hover {
            border-color: var(--accent-magenta);
            color: var(--text-primary);
        }

        .vault-tag-btn.selected {
            background: var(--accent-magenta);
            color: #000;
            border-color: #000;
            box-shadow: 2px 2px 0px #000;
        }

        /* Main Viewport Header */
        .vault-viewport {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .vault-action-bar {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            box-shadow: var(--brutal-shadow);
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }

        .batch-controls {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .batch-indicator {
            font-family: var(--font-display);
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-secondary);
        }

        .batch-indicator span {
            color: var(--accent-cyan);
        }

        /* Drop Zone */
        .upload-dropzone {
            background: var(--bg-secondary);
            border: 2px dashed var(--border-color);
            padding: 30px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        }

        .upload-dropzone:hover, .upload-dropzone.dragover {
            border-color: var(--accent-cyan);
            background: var(--bg-tertiary);
        }

        .upload-dropzone h4 {
            font-family: var(--font-display);
            text-transform: uppercase;
            font-size: 16px;
            margin-bottom: 8px;
            color: var(--text-primary);
        }

        .upload-dropzone p {
            font-size: 12px;
            color: var(--text-secondary);
        }

        /* Document Display Options */
        .display-toggle-btn {
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            color: var(--text-primary);
            padding: 8px 12px;
            font-weight: 700;
            cursor: pointer;
            font-size: 12px;
            text-transform: uppercase;
        }

        .display-toggle-btn.active {
            background: var(--accent-cyan);
            color: #000;
            border-color: #000;
        }

        /* Document List & Cards */
        .document-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            transition: all 0.2s ease;
        }

        .document-container.list-mode {
            grid-template-columns: 1fr;
        }

        .doc-card {
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            box-shadow: 4px 4px 0px var(--border-color);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            position: relative;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .doc-card:hover {
            transform: translate(-2px, -2px);
            border-color: var(--accent-orange);
            box-shadow: 6px 6px 0px var(--accent-orange);
        }

        .doc-card.selected {
            background: var(--bg-tertiary);
            border-color: var(--accent-cyan);
            box-shadow: 6px 6px 0px var(--accent-cyan);
        }

        .doc-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .doc-icon-wrapper {
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 800;
            border: 2px solid #000;
            box-shadow: 2px 2px 0px #000;
        }

        /* Custom Colors by Extension */
        .ext-pdf { background: var(--accent-magenta); color: #000; }
        .ext-xls { background: var(--accent-lime); color: #000; }
        .ext-csv { background: var(--accent-lime); color: #000; }
        .ext-docx { background: var(--accent-cyan); color: #000; }
        .ext-generic { background: var(--text-secondary); color: #000; }

        .doc-title-area {
            flex-grow: 1;
            margin-left: 12px;
            max-width: calc(100% - 70px);
        }

        .doc-name {
            font-family: var(--font-display);
            font-size: 15px;
            font-weight: 700;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--text-primary);
        }

        .doc-meta {
            font-size: 11px;
            color: var(--text-secondary);
            margin-top: 2px;
            font-weight: 600;
        }

        .doc-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .doc-tag-badge {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 2px 6px;
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
        }

        .doc-footer {
            border-top: 1px solid var(--border-color);
            padding-top: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* List Mode Layout Restructuring */
        .document-container.list-mode .doc-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px;
            gap: 20px;
        }

        .document-container.list-mode .doc-card .doc-footer {
            border-top: none;
            padding-top: 0;
            flex-shrink: 0;
        }

        .document-container.list-mode .doc-card .doc-tags {
            display: none; /* Hide tags in compact list mode to keep pristine shape */
        }

        /* Interactive Vault Stats Panel */
        .vault-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 20px;
        }

        @media (max-width: 768px) {
            .vault-stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        /* Simulated download progress */
        .progress-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(8, 9, 13, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 12px;
            z-index: 10;
        }

        .progress-bar-container {
            width: 80%;
            height: 8px;
            background: var(--bg-tertiary);
            border: 1.5px solid var(--border-color);
            border-radius: 4px;
            overflow: hidden;
        }

        .progress-bar-fill {
            height: 100%;
            width: 0%;
            background: var(--accent-lime);
            box-shadow: 0 0 10px var(--accent-lime);
            transition: width 0.1s linear;
        }
    `;

    // 2. STAGE MOUNTING LOGIC & NAVIGATION LINK
    const styleSheet = document.createElement("style");
    styleSheet.innerText = vaultStyles;
    document.head.appendChild(styleSheet);

    // Inject "Vault Archive" link to navigation dynamically
    const navLinksContainer = document.querySelector(".nav-links");
    if (navLinksContainer) {
        const vaultNavBtn = document.createElement("a");
        vaultNavBtn.href = "#vault-archive";
        vaultNavBtn.className = "nav-link";
        vaultNavBtn.id = "nav-vault-link";
        vaultNavBtn.innerText = "Vault Archive";
        navLinksContainer.appendChild(vaultNavBtn);
    }

    // Capture main elements for router swapping
    const mainHeader = document.querySelector("header");
    const mainWorkspace = document.getElementById("tools-library");
    const strategySection = document.getElementById("strategy");

    // Dynamic state databases for files
    let vaultDocuments = [
        { id: "doc-1", name: "mca-statements-q2.pdf", extension: "pdf", sizeBytes: 4404019, date: "2024-04-15", category: "borrower", tags: ["MCA", "Bank Statements"], selected: false },
        { id: "doc-2", name: "tax-return-2023.pdf", extension: "pdf", sizeBytes: 13421772, date: "2024-03-10", category: "borrower", tags: ["Tax Returns", "IRS"], selected: false },
        { id: "doc-3", name: "dscr-calculator-results.csv", extension: "csv", sizeBytes: 145408, date: "2024-06-02", category: "borrower", tags: ["Real Estate", "DSCR"], selected: false },
        { id: "doc-4", name: "broker-agreement-v4.docx", extension: "docx", sizeBytes: 1153433, date: "2024-05-18", category: "broker", tags: ["Agreement", "Commission"], selected: false },
        { id: "doc-5", name: "credit-experian-report.pdf", extension: "pdf", sizeBytes: 2516582, date: "2024-06-11", category: "readiness", tags: ["Credit", "FICO"], selected: false },
        { id: "doc-6", name: "ach-authorization-form.pdf", extension: "pdf", sizeBytes: 839680, date: "2024-01-29", category: "borrower", tags: ["ACH", "Payment"], selected: false },
        { id: "doc-7", name: "equipment-roi-summary.xlsx", extension: "xls", sizeBytes: 1887436, date: "2024-02-14", category: "borrower", tags: ["Equipment", "ROI"], selected: false },
        { id: "doc-8", name: "merchants-liability-audit.pdf", extension: "pdf", sizeBytes: 5347737, date: "2024-05-03", category: "readiness", tags: ["Audit", "Risk"], selected: false }
    ];

    let currentFilters = {
        searchTerm: "",
        categories: ["borrower", "broker", "readiness"],
        extensions: ["pdf", "xls", "csv", "docx"],
        maxSizeMB: 15,
        selectedTags: []
    };

    let displayMode = "grid"; // or 'list'

    // Create container for the Document & Attachment Vault
    const vaultSection = document.createElement("section");
    vaultSection.className = "vault-section";
    vaultSection.id = "vault-archive";
    vaultSection.innerHTML = `
        <div class="section-headline" style="border-bottom: 3px solid var(--border-color); padding-bottom: 20px;">
            <div>
                <p style="text-transform: uppercase; font-size: 11px; font-weight: 800; color: var(--accent-magenta); letter-spacing: 2px;">SECURE DIGITAL STORAGE</p>
                <h2 style="margin-top: 5px; font-family: var(--font-display); font-size: 32px; font-weight: 800; text-transform: uppercase;">DOCUMENT & ATTACHMENT <span>VAULT</span></h2>
            </div>
            <p style="color: var(--text-secondary); max-width: 450px; font-size: 14px; text-align: right;">
                Centralized client-side vault directory for analyzing risk profiles, factoring setups, and tax data. Zero database tracking.
            </p>
        </div>

        <!-- STATS HEADER PANEL -->
        <div class="vault-stats-grid">
            <div class="stat-box">
                <div class="stat-val text-glow-cyan" id="vault-stat-count">0</div>
                <div class="stat-label">Total Files</div>
            </div>
            <div class="stat-box">
                <div class="stat-val text-glow-orange" id="vault-stat-size">0 MB</div>
                <div class="stat-label">Total Encrypted Volume</div>
            </div>
            <div class="stat-box">
                <div class="stat-val text-glow-magenta" id="vault-stat-selected">0</div>
                <div class="stat-label">Selected Elements</div>
            </div>
            <div class="stat-box">
                <div class="stat-val" style="color: var(--accent-lime); text-shadow: 0 0 10px rgba(57,255,20,0.5);" id="vault-stat-queue">Client-Side</div>
                <div class="stat-label">Security Protocol</div>
            </div>
        </div>

        <div class="vault-grid-layout">
            <!-- SIDEBAR FILTERS -->
            <div class="vault-sidebar">
                <div class="sidebar-title">
                    <span>Engine Filters</span>
                    <button id="btn-reset-filters" style="background: none; border: none; color: var(--accent-magenta); font-size: 11px; font-weight: 700; cursor: pointer; text-transform: uppercase;">Clear</button>
                </div>

                <!-- Category Group -->
                <div class="filter-group">
                    <span class="filter-label">Module Categories</span>
                    <label class="brutal-checkbox-label">
                        <input type="checkbox" class="brutal-checkbox filter-category" value="borrower" checked>
                        <span>Borrower</span>
                    </label>
                    <label class="brutal-checkbox-label">
                        <input type="checkbox" class="brutal-checkbox filter-category" value="broker" checked>
                        <span>Broker</span>
                    </label>
                    <label class="brutal-checkbox-label">
                        <input type="checkbox" class="brutal-checkbox filter-category" value="readiness" checked>
                        <span>Readiness</span>
                    </label>
                </div>

                <!-- Extension Group -->
                <div class="filter-group">
                    <span class="filter-label">File Extension</span>
                    <label class="brutal-checkbox-label">
                        <input type="checkbox" class="brutal-checkbox filter-extension" value="pdf" checked>
                        <span>PDF Document</span>
                    </label>
                    <label class="brutal-checkbox-label">
                        <input type="checkbox" class="brutal-checkbox filter-extension" value="xls" checked>
                        <span>Excel Spreadsheet</span>
                    </label>
                    <label class="brutal-checkbox-label">
                        <input type="checkbox" class="brutal-checkbox filter-extension" value="csv" checked>
                        <span>CSV Matrix</span>
                    </label>
                    <label class="brutal-checkbox-label">
                        <input type="checkbox" class="brutal-checkbox filter-extension" value="docx" checked>
                        <span>Word File</span>
                    </label>
                </div>

                <!-- Size Slider -->
                <div class="filter-group">
                    <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 11px; text-transform: uppercase;">
                        <span class="filter-label">Maximum File Size</span>
                        <span id="label-max-size" style="color: var(--accent-cyan);">15 MB</span>
                    </div>
                    <input type="range" min="1" max="15" step="0.5" value="15" class="range-slider" id="filter-size-slider">
                </div>

                <!-- Tag Cloud Multi-Select -->
                <div class="filter-group">
                    <span class="filter-label">Dynamic Index Tags</span>
                    <div class="tag-cloud" id="vault-tag-cloud">
                        <!-- Populated programmatically -->
                    </div>
                </div>
            </div>

            <!-- MAIN WORKSPACE CONTAINER -->
            <div class="vault-viewport">
                <!-- Action bar / Query line -->
                <div class="vault-action-bar">
                    <div class="search-wrapper" style="margin-bottom: 0; flex-grow: 1;">
                        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="color: var(--text-secondary);">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                        </svg>
                        <input type="text" id="vault-search" class="search-input" placeholder="Query files by name, type, identifier...">
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <button class="display-toggle-btn active" id="toggle-grid">Grid</button>
                        <button class="display-toggle-btn" id="toggle-list">List</button>
                    </div>
                </div>

                <!-- DRAG & DROP SIMULATED UPLINK ZONE -->
                <div class="upload-dropzone" id="vault-dropzone">
                    <div id="dropzone-default-view">
                        <h4>Drop verification documents here to stage analysis</h4>
                        <p>Simulates file metadata parsing, security scans, and custom tag indexing (Supports PDF, XLS, CSV, DOCX)</p>
                    </div>
                    <!-- Hidden mock file generator on click -->
                    <input type="file" id="file-uploader-hidden" style="display: none;" multiple>
                </div>

                <!-- Selected Items Bulk Toolbar -->
                <div class="vault-action-bar" id="batch-toolbar" style="display: none; border-color: var(--accent-cyan); background: rgba(0, 240, 255, 0.05); animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
                    <div class="batch-controls">
                        <div class="batch-indicator">Active Queue: <span id="batch-selected-count">0</span> items selected</div>
                    </div>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <button class="btn-white" id="batch-deselect" style="padding: 8px 16px; font-size: 11px;">Deselect All</button>
                        <button class="btn-action" id="batch-download" style="padding: 8px 16px; font-size: 11px; box-shadow: 2px 2px 0 #000;">Batch Secure Download</button>
                    </div>
                </div>

                <!-- Interactive Document Card Target -->
                <div class="document-container" id="vault-document-container">
                    <!-- Populated dynamically via JS engine -->
                </div>
            </div>
        </div>
    `;

    // Append Vault section to target parent node (sibling to primary tools workspace)
    if (mainWorkspace && mainWorkspace.parentNode) {
        mainWorkspace.parentNode.insertBefore(vaultSection, mainWorkspace);
    }

    // 3. EVENT ROUTING LOGIC (SPA Navigation Engine)
    function handleNavigationRouter() {
        const hash = window.location.hash;

        if (hash === "#vault-archive") {
            // Hide alternative modules
            if (mainHeader) mainHeader.style.display = "none";
            if (mainWorkspace) mainWorkspace.style.display = "none";
            if (strategySection) strategySection.style.display = "none";

            // Unveil the vault system
            vaultSection.style.display = "block";

            // Set link states
            document.querySelectorAll(".nav-link").forEach(lnk => lnk.classList.remove("active"));
            const vaultLink = document.getElementById("nav-vault-link");
            if (vaultLink) vaultLink.style.borderBottom = "2px solid var(--accent-cyan)";

            // Build dynamic controls
            renderVaultTags();
            updateVaultDisplay();
        } else {
            // Reset Core Flow views
            if (mainHeader) mainHeader.style.display = "grid";
            if (mainWorkspace) mainWorkspace.style.display = "block";
            if (strategySection) strategySection.style.display = "block";

            // Hide the vault layer
            vaultSection.style.display = "none";

            const vaultLink = document.getElementById("nav-vault-link");
            if (vaultLink) vaultLink.style.borderBottom = "2px solid transparent";
        }
    }

    window.addEventListener("hashchange", handleNavigationRouter);
    window.addEventListener("load", handleNavigationRouter);

    // 4. VAULT FILTERS & LOGICAL CONTROLS
    function getFileExtensionIcon(ext) {
        switch (ext.toLowerCase()) {
            case "pdf": return { label: "PDF", class: "ext-pdf" };
            case "xls":
            case "xlsx": return { label: "XLS", class: "ext-xls" };
            case "csv": return { label: "CSV", class: "ext-csv" };
            case "docx":
            case "doc": return { label: "DOC", class: "ext-docx" };
            default: return { label: "FILE", class: "ext-generic" };
        }
    }

    function bytesToSize(bytes) {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes === 0) return "0 Byte";
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    }

    // Render tag cloud in the sidebar dynamically from current files dataset
    function renderVaultTags() {
        const tagCloud = document.getElementById("vault-tag-cloud");
        if (!tagCloud) return;

        // Collect all distinct tags
        const allTags = new Set();
        vaultDocuments.forEach(doc => {
            if (doc.tags) doc.tags.forEach(t => allTags.add(t));
        });

        tagCloud.innerHTML = "";
        allTags.forEach(tag => {
            const isSelected = currentFilters.selectedTags.includes(tag);
            const btn = document.createElement("button");
            btn.className = `vault-tag-btn ${isSelected ? "selected" : ""}`;
            btn.innerText = tag;
            btn.addEventListener("click", () => {
                if (currentFilters.selectedTags.includes(tag)) {
                    currentFilters.selectedTags = currentFilters.selectedTags.filter(t => t !== tag);
                } else {
                    currentFilters.selectedTags.push(tag);
                }
                btn.classList.toggle("selected");
                updateVaultDisplay();
            });
            tagCloud.appendChild(btn);
        });
    }

    // High fidelity data updates and rendering loop
    function updateVaultDisplay() {
        const docContainer = document.getElementById("vault-document-container");
        if (!docContainer) return;

        // Apply filters
        const filteredDocs = vaultDocuments.filter(doc => {
            // Search
            const matchesSearch = doc.name.toLowerCase().includes(currentFilters.searchTerm) || 
                                 doc.tags.some(t => t.toLowerCase().includes(currentFilters.searchTerm));
            
            // Category check
            const matchesCategory = currentFilters.categories.includes(doc.category);

            // Extension check
            const matchesExt = currentFilters.extensions.includes(doc.extension);

            // Size limit check
            const sizeInMB = doc.sizeBytes / (1024 * 1024);
            const matchesSize = sizeInMB <= currentFilters.maxSizeMB;

            // Tags multi-selection check
            const matchesTags = currentFilters.selectedTags.length === 0 || 
                               currentFilters.selectedTags.every(t => doc.tags.includes(t));

            return matchesSearch && matchesCategory && matchesExt && matchesSize && matchesTags;
        });

        // Compute metrics
        const totalVolumeBytes = vaultDocuments.reduce((acc, curr) => acc + curr.sizeBytes, 0);
        const selectedDocs = vaultDocuments.filter(d => d.selected);

        document.getElementById("vault-stat-count").innerText = filteredDocs.length;
        document.getElementById("vault-stat-size").innerText = bytesToSize(totalVolumeBytes);
        document.getElementById("vault-stat-selected").innerText = selectedDocs.length;

        // Toggle bulk action bar
        const batchToolbar = document.getElementById("batch-toolbar");
        if (selectedDocs.length > 0) {
            batchToolbar.style.display = "flex";
            document.getElementById("batch-selected-count").innerText = selectedDocs.length;
        } else {
            batchToolbar.style.display = "none";
        }

        // Adjust presentation layout class
        if (displayMode === "list") {
            docContainer.className = "document-container list-mode";
        } else {
            docContainer.className = "document-container";
        }

        // Render Cards
        docContainer.innerHTML = "";
        if (filteredDocs.length === 0) {
            docContainer.innerHTML = `
                <div style="grid-column: 1 / -1; background: var(--bg-secondary); border: 2px dashed var(--border-color); padding: 60px; text-align: center; color: var(--text-secondary); font-weight: 700;">
                    NO DOCUMENTS MATCH ACTIVE CRITERIA OR MATRIX SPECIFICATIONS
                </div>
            `;
            return;
        }

        filteredDocs.forEach(doc => {
            const extStyle = getFileExtensionIcon(doc.extension);
            const sizeStr = bytesToSize(doc.sizeBytes);
            const docElement = document.createElement("div");
            docElement.className = `doc-card ${doc.selected ? "selected" : ""}`;
            docElement.setAttribute("data-id", doc.id);

            // Content Setup
            docElement.innerHTML = `
                <div class="doc-header">
                    <div style="display: flex; align-items: center; max-width: calc(100% - 30px);">
                        <div class="doc-icon-wrapper ${extStyle.class}">${extStyle.label}</div>
                        <div class="doc-title-area">
                            <div class="doc-name" title="${doc.name}">${doc.name}</div>
                            <div class="doc-meta">${sizeStr} &bull; ${doc.date}</div>
                        </div>
                    </div>
                    <input type="checkbox" class="brutal-checkbox" style="margin: 0; pointer-events: none;" ${doc.selected ? "checked" : ""}>
                </div>
                <div class="doc-tags">
                    ${doc.tags.map(t => `<span class="doc-tag-badge">${t}</span>`).join("")}
                </div>
                <div class="doc-footer">
                    <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--accent-orange);">${doc.category}</span>
                    <span class="action-text" style="font-size: 11px; font-weight:700; color: var(--accent-cyan);">Retrieve &darr;</span>
                </div>
            `;

            // Toggle card selections
            docElement.addEventListener("click", (e) => {
                // If retrieve text was explicitly clicked, trigger direct download simulation
                if (e.target.closest(".action-text")) {
                    e.stopPropagation();
                    simulateSingleDownload(doc);
                    return;
                }

                // Normal card highlight toggle
                doc.selected = !doc.selected;
                docElement.classList.toggle("selected");
                const checkbox = docElement.querySelector('.brutal-checkbox');
                if (checkbox) checkbox.checked = doc.selected;
                updateVaultDisplay();
            });

            docContainer.appendChild(docElement);
        });
    }

    // Simulated downloads logic (with fancy client side visual progression overlays)
    function simulateSingleDownload(doc) {
        const card = document.querySelector(`.doc-card[data-id="${doc.id}"]`);
        if (!card || card.querySelector(".progress-overlay")) return;

        const overlay = document.createElement("div");
        overlay.className = "progress-overlay";
        overlay.innerHTML = `
            <div style="font-size: 11px; color: var(--accent-cyan); font-weight:800; font-family: var(--font-display);">DECRYPTING CHUNKS...</div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill"></div>
            </div>
        `;
        card.appendChild(overlay);

        const fill = overlay.querySelector(".progress-bar-fill");
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 25) + 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                fill.style.width = "100%";
                setTimeout(() => {
                    overlay.remove();
                    showNotification(`Secured download finished: ${doc.name}`);
                }, 300);
            } else {
                fill.style.width = `${progress}%`;
            }
        }, 120);
    }

    // 5. REGULAR BINDINGS & EVENT LISTENERS
    document.addEventListener("DOMContentLoaded", () => {
        // Search Filter trigger
        const vSearch = document.getElementById("vault-search");
        if (vSearch) {
            vSearch.addEventListener("input", (e) => {
                currentFilters.searchTerm = e.target.value.toLowerCase();
                updateVaultDisplay();
            });
        }

        // Layout Toggle actions
        const btnGrid = document.getElementById("toggle-grid");
        const btnList = document.getElementById("toggle-list");
        if (btnGrid && btnList) {
            btnGrid.addEventListener("click", () => {
                displayMode = "grid";
                btnGrid.classList.add("active");
                btnList.classList.remove("active");
                updateVaultDisplay();
            });
            btnList.addEventListener("click", () => {
                displayMode = "list";
                btnList.classList.add("active");
                btnGrid.classList.remove("active");
                updateVaultDisplay();
            });
        }

        // Sidebar check boxes binding
        document.querySelectorAll(".filter-category").forEach(box => {
            box.addEventListener("change", () => {
                const checked = Array.from(document.querySelectorAll(".filter-category:checked")).map(b => b.value);
                currentFilters.categories = checked;
                updateVaultDisplay();
            });
        });

        document.querySelectorAll(".filter-extension").forEach(box => {
            box.addEventListener("change", () => {
                const checked = Array.from(document.querySelectorAll(".filter-extension:checked")).map(b => b.value);
                currentFilters.extensions = checked;
                updateVaultDisplay();
            });
        });

        // Size slider binding
        const sizeSlider = document.getElementById("filter-size-slider");
        const sizeLabel = document.getElementById("label-max-size");
        if (sizeSlider && sizeLabel) {
            sizeSlider.addEventListener("input", (e) => {
                const val = parseFloat(e.target.value);
                sizeLabel.innerText = `${val} MB`;
                currentFilters.maxSizeMB = val;
                updateVaultDisplay();
            });
        }

        // Reset Filter Action
        const resetBtn = document.getElementById("btn-reset-filters");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                currentFilters.searchTerm = "";
                currentFilters.categories = ["borrower", "broker", "readiness"];
                currentFilters.extensions = ["pdf", "xls", "csv", "docx"];
                currentFilters.maxSizeMB = 15;
                currentFilters.selectedTags = [];

                if (vSearch) vSearch.value = "";
                if (sizeSlider) sizeSlider.value = 15;
                if (sizeLabel) sizeLabel.innerText = "15 MB";

                document.querySelectorAll(".filter-category, .filter-extension").forEach(box => box.checked = true);
                document.querySelectorAll(".vault-tag-btn").forEach(b => b.classList.remove("selected"));

                updateVaultDisplay();
                showNotification("Vault Filter Configuration Cleared");
            });
        }

        // Drag & Drop simulator zones
        const dropzone = document.getElementById("vault-dropzone");
        const fileUploaderHidden = document.getElementById("file-uploader-hidden");

        if (dropzone && fileUploaderHidden) {
            dropzone.addEventListener("click", () => {
                fileUploaderHidden.click();
            });

            dropzone.addEventListener("dragover", (e) => {
                e.preventDefault();
                dropzone.classList.add("dragover");
            });

            dropzone.addEventListener("dragleave", () => {
                dropzone.classList.remove("dragover");
            });

            dropzone.addEventListener("drop", (e) => {
                e.preventDefault();
                dropzone.classList.remove("dragover");
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    processUploadedFiles(e.dataTransfer.files);
                }
            });

            fileUploaderHidden.addEventListener("change", (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    processUploadedFiles(e.target.files);
                }
            });
        }

        // Dynamic multi file upload simulation
        function processUploadedFiles(files) {
            let processedCount = 0;
            Array.from(files).forEach((f) => {
                const name = f.name.toLowerCase();
                const ext = name.split(".").pop();
                
                // Construct file model
                const matchedCategory = "borrower";
                const mockNewDoc = {
                    id: `doc-${Date.now()}-${Math.random()}`,
                    name: f.name,
                    extension: ext || "pdf",
                    sizeBytes: f.size || 5242880,
                    date: new Date().toISOString().split("T")[0],
                    category: matchedCategory,
                    tags: ["Uploaded", "Analyzed"],
                    selected: false
                };

                vaultDocuments.unshift(mockNewDoc);
                processedCount++;
            });

            showNotification(`Secured upload simulation finished: +${processedCount} elements added`);
            renderVaultTags();
            updateVaultDisplay();
        }

        // Batch download trigger simulation
        const batchDeselectBtn = document.getElementById("batch-deselect");
        const batchDownloadBtn = document.getElementById("batch-download");

        if (batchDeselectBtn) {
            batchDeselectBtn.addEventListener("click", () => {
                vaultDocuments.forEach(d => d.selected = false);
                updateVaultDisplay();
            });
        }

        if (batchDownloadBtn) {
            batchDownloadBtn.addEventListener("click", () => {
                const selectedList = vaultDocuments.filter(d => d.selected);
                if (selectedList.length === 0) return;

                // Create full viewport loading visual
                const fullOverlay = document.createElement("div");
                fullOverlay.style.position = "fixed";
                fullOverlay.style.top = "0";
                fullOverlay.style.left = "0";
                fullOverlay.style.width = "100%";
                fullOverlay.style.height = "100%";
                fullOverlay.style.background = "rgba(0,0,0,0.85)";
                fullOverlay.style.zIndex = "2000";
                fullOverlay.style.display = "flex";
                fullOverlay.style.flexDirection = "column";
                fullOverlay.style.justifyContent = "center";
                fullOverlay.style.alignItems = "center";
                fullOverlay.style.gap = "20px";
                fullOverlay.style.fontFamily = "var(--font-display)";

                fullOverlay.innerHTML = `
                    <div style="font-size: 24px; font-weight: 800; text-transform: uppercase; color: var(--accent-cyan); letter-spacing: 2px;">
                        ESTABLISHING SECURED SYNC STREAM
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary); text-transform: uppercase;">
                        Packaging ${selectedList.length} files inside AES-256 local bundle...
                    </div>
                    <div class="progress-bar-container" style="width: 400px; max-width: 90%;">
                        <div class="progress-bar-fill" id="full-sync-fill"></div>
                    </div>
                `;

                document.body.appendChild(fullOverlay);

                const fill = fullOverlay.querySelector("#full-sync-fill");
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.floor(Math.random() * 15) + 5;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        fill.style.width = "100%";
                        setTimeout(() => {
                            fullOverlay.remove();
                            // Deselect everything
                            vaultDocuments.forEach(d => d.selected = false);
                            updateVaultDisplay();
                            showNotification(`Secure ZIP downloaded successfully (${selectedList.length} files included)`);
                        }, 500);
                    } else {
                        fill.style.width = `${progress}%`;
                    }
                }, 100);
            });
        }
    });

    // Fire Initial state update
    if (window.location.hash === "#vault-archive") {
        handleNavigationRouter();
    }
})();