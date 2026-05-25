(function () {
    // 1. STATE MANAGEMENT
    const vaultState = {
        currentFolder: 'All',
        selectedFiles: [],
        searchQuery: '',
        filterProject: 'All',
        filterType: 'All',
        folders: ['All', 'Underwriting Docs', 'Legal & UCC', 'Bank Statements', 'Executed Agreements'],
        projects: ['All', 'Alpha Real Estate', 'Beta MCA Advance', 'Gamma Equipment Lease', 'Delta Factoring Line'],
        types: ['All', 'PDF', 'XLSX', 'DOCX', 'PNG', 'ZIP'],
        files: [
            { id: 1, name: 'bank_statements_2023_q4.pdf', folder: 'Bank Statements', type: 'PDF', size: '4.2 MB', project: 'Delta Factoring Line', date: '2023-10-12' },
            { id: 2, name: 'dscr_projections_v3.xlsx', folder: 'Underwriting Docs', type: 'XLSX', size: '1.8 MB', project: 'Alpha Real Estate', date: '2023-11-03' },
            { id: 3, name: 'ucc1_filing_executed.pdf', folder: 'Legal & UCC', type: 'PDF', size: '850 KB', project: 'Beta MCA Advance', date: '2024-01-15' },
            { id: 4, name: 'incorporation_certificate.pdf', folder: 'Legal & UCC', type: 'PDF', size: '2.1 MB', project: 'Delta Factoring Line', date: '2024-01-22' },
            { id: 5, name: 'equipment_invoice_stamped.png', folder: 'Underwriting Docs', type: 'PNG', size: '5.4 MB', project: 'Gamma Equipment Lease', date: '2024-02-10' },
            { id: 6, name: 'broker_agreement_final.pdf', folder: 'Executed Agreements', type: 'PDF', size: '1.2 MB', project: 'Beta MCA Advance', date: '2024-02-18' },
            { id: 7, name: 'merchant_cash_flow_model.xlsx', folder: 'Underwriting Docs', type: 'XLSX', size: '3.1 MB', project: 'Beta MCA Advance', date: '2024-02-25' }
        ]
    };

    // 2. INJECT CSS FOR NEO-BRUTALIST VAULT MODULE
    const cssStyles = `
        /* Document Vault Layout Styles */
        .vault-modal {
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            max-width: 950px;
            height: 100vh;
            background: #14161f;
            border-left: 3px solid #fff;
            box-shadow: -20px 0px 0px rgba(0,0,0,0.8);
            z-index: 1001;
            transform: translateX(110%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
            padding: 40px;
            color: #fff;
            display: flex;
            flex-direction: column;
        }

        .vault-modal.active {
            transform: translateX(0);
        }

        .vault-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #fff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .vault-title {
            font-size: 28px;
            font-weight: 900;
            text-transform: uppercase;
            font-family: 'Space Grotesk', sans-serif;
            color: var(--accent-cyan);
            letter-spacing: -1px;
        }

        .vault-container {
            display: grid;
            grid-template-columns: 240px 1fr;
            gap: 30px;
            flex-grow: 1;
        }

        /* Sidebar Styling */
        .vault-sidebar {
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .folder-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .folder-item {
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 12px 16px;
            cursor: pointer;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 0.5px;
            transition: all var(--transition-speed);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .folder-item:hover {
            transform: translate(-2px, -2px);
            box-shadow: 4px 4px 0px var(--accent-cyan);
        }

        .folder-item.active {
            background: var(--accent-cyan);
            color: #000;
            box-shadow: 4px 4px 0px #fff;
        }

        .folder-item .folder-count {
            font-family: monospace;
            font-size: 11px;
            background: rgba(255,255,255,0.15);
            padding: 2px 6px;
            border-radius: 2px;
            border: 1px solid #fff;
        }

        .folder-item.active .folder-count {
            background: rgba(0, 0, 0, 0.1);
            border-color: #000;
        }

        /* New Folder Input Tool */
        .new-folder-box {
            border: 2px dashed rgba(255,255,255,0.3);
            padding: 15px;
            background: rgba(255, 255, 255, 0.02);
        }

        .new-folder-input {
            width: 100%;
            background: #000;
            border: 2px solid #fff;
            color: #fff;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 10px;
            outline: none;
        }

        .new-folder-btn {
            background: var(--accent-magenta);
            color: #fff;
            border: 2px solid #fff;
            width: 100%;
            padding: 8px;
            cursor: pointer;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            box-shadow: 3px 3px 0px #fff;
        }

        .new-folder-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px;
        }

        /* Main Content Panel */
        .vault-main {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        /* Search & Filter Toolbar */
        .vault-toolbar {
            display: grid;
            grid-template-columns: 1fr auto auto;
            gap: 15px;
        }

        .vault-select {
            background: var(--surface-card);
            border: 2px solid #fff;
            color: #fff;
            padding: 12px;
            font-weight: 800;
            font-size: 13px;
            outline: none;
            cursor: pointer;
            text-transform: uppercase;
        }

        /* File List Table */
        .file-list-card {
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 20px;
            box-shadow: 6px 6px 0px var(--accent-yellow);
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            min-height: 380px;
        }

        .file-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        .file-table th {
            text-transform: uppercase;
            font-size: 12px;
            color: var(--text-muted);
            padding: 12px 10px;
            border-bottom: 2px solid #fff;
            letter-spacing: 1px;
        }

        .file-table td {
            padding: 14px 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 14px;
            font-weight: 700;
        }

        .file-row:hover {
            background: rgba(255,255,255,0.03);
        }

        .file-row.selected {
            background: rgba(0, 243, 255, 0.05);
        }

        /* Document Action Elements */
        .vault-actions-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 2px solid #fff;
            background: #000;
            padding: 20px;
            box-shadow: 6px 6px 0px var(--accent-magenta);
            margin-top: 10px;
        }

        .selected-counter {
            font-weight: 900;
            font-size: 15px;
            text-transform: uppercase;
            color: var(--accent-yellow);
        }

        .zip-compile-btn {
            background: var(--accent-cyan);
            color: #000;
            border: 2px solid #fff;
            padding: 12px 24px;
            font-weight: 900;
            cursor: pointer;
            text-transform: uppercase;
            font-size: 14px;
            box-shadow: 4px 4px 0px #fff;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .zip-compile-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #fff;
        }

        .zip-compile-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px;
        }

        /* Upload Simulation Dropzone */
        .vault-upload-zone {
            border: 2px dashed var(--accent-yellow);
            background: rgba(255, 238, 0, 0.02);
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 20px;
        }

        .vault-upload-zone:hover {
            background: rgba(255, 238, 0, 0.05);
            border-color: #fff;
        }

        .upload-text {
            font-weight: 800;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 1px;
            color: #fff;
        }

        .upload-sub {
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 5px;
        }

        /* ZIP Progress Animation Overlays */
        .zip-progress-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(11, 12, 16, 0.95);
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
        }

        .zip-bar-container {
            width: 100%;
            max-width: 400px;
            height: 30px;
            border: 3px solid #fff;
            background: #000;
            position: relative;
            margin: 20px 0;
            box-shadow: 6px 6px 0px var(--accent-magenta);
        }

        .zip-progress-fill {
            height: 100%;
            width: 0%;
            background: var(--accent-cyan);
            transition: width 0.08s linear;
        }

        .zip-status-text {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 18px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Custom Checkbox integration */
        .vault-checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #fff;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 11px;
            user-select: none;
            background: #000;
        }

        .vault-checkbox.checked {
            background: var(--accent-magenta);
            color: #fff;
        }

        /* General Badge for categories in table */
        .vault-tag {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 900;
            padding: 2px 8px;
            border: 1px solid #000;
            color: #000;
            display: inline-block;
        }

        .tag-blue { background: var(--accent-cyan); }
        .tag-magenta { background: var(--accent-magenta); color: #fff; }
        .tag-yellow { background: var(--accent-yellow); }

        @media (max-width: 900px) {
            .vault-container {
                grid-template-columns: 1fr;
            }
            .vault-toolbar {
                grid-template-columns: 1fr;
            }
        }
    `;

    // 3. INJECT CARD & ELEMENTS TO PAGE DOM
    function injectUI() {
        // Add dynamic CSS style Block
        const styleSheet = document.createElement("style");
        styleSheet.innerText = cssStyles;
        document.head.appendChild(styleSheet);

        // Inject Card inside existing Grid list
        const grid = document.getElementById('toolGrid');
        if (grid) {
            const vaultCard = document.createElement('div');
            vaultCard.className = 'tool-card';
            vaultCard.setAttribute('data-category', 'readiness');
            vaultCard.innerHTML = `
                <div class="tool-icon">📁</div>
                <span class="tool-tag" style="background: var(--accent-magenta); color:#fff;">Vault</span>
                <h3>Document & File Vault</h3>
                <p>Centralized document management. Filter attachments, manage folders, and compile ZIP batches.</p>
                <div class="tool-action" id="open-vault-trigger">Open Vault & Archive ↗</div>
            `;
            grid.insertBefore(vaultCard, grid.firstChild);

            // Bind Launcher action
            document.getElementById('open-vault-trigger').addEventListener('click', openVault);
        }

        // Setup Document Vault Modal HTML Structure
        const vaultModal = document.createElement('div');
        vaultModal.id = 'vaultOverlay';
        vaultModal.className = 'vault-modal';
        vaultModal.innerHTML = `
            <div class="vault-header">
                <div class="vault-title">⚡ DOCUMENT LIBRARY & ARCHIVE VAULT</div>
                <button class="close-calc" id="close-vault-btn">CLOSE [X]</button>
            </div>

            <!-- DRAG & DROP UPLOAD SIMULATOR -->
            <div class="vault-upload-zone" id="vaultUploadZone">
                <div class="upload-text">DRAG & DROP NEW FINANCIAL ATTACHMENT OR CLIck HERE</div>
                <div class="upload-sub">Supports PDF, XLSX, DOCX, PNG (Max 15MB) - Instantly classified into active folders</div>
            </div>

            <div class="vault-container">
                <!-- SIDEBAR - FOLDERS -->
                <div class="vault-sidebar">
                    <div class="calc-label" style="font-size: 12px; margin-bottom: -15px;">CATEGORIES / FOLDERS</div>
                    <div class="folder-list" id="folderListContainer"></div>

                    <!-- CREATE VIRTUAL FOLDER BOX -->
                    <div class="new-folder-box">
                        <div class="calc-label" style="font-size: 10px; margin-bottom: 5px;">Add New Virtual Folder</div>
                        <input type="text" id="newFolderInput" class="new-folder-input" placeholder="E.G. TAX AUDITS 2024">
                        <button class="new-folder-btn" id="newFolderBtn">Create Directory</button>
                    </div>
                </div>

                <!-- MAIN WORKSPACE -->
                <div class="vault-main">
                    <!-- SEARCH & FILTERS -->
                    <div class="vault-toolbar">
                        <div class="search-container" style="min-width: unset; flex: 1;">
                            <input type="text" id="vaultSearchInput" class="search-input" style="padding: 14px 14px 14px 45px; font-size: 15px;" placeholder="Filter files by name...">
                        </div>
                        <select id="vaultProjectSelect" class="vault-select"></select>
                        <select id="vaultTypeSelect" class="vault-select"></select>
                    </div>

                    <!-- FILES DATA-GRID TABLE -->
                    <div class="file-list-card" id="fileListPanel">
                        <table class="file-table">
                            <thead>
                                <tr>
                                    <th style="width: 40px;"><div class="vault-checkbox" id="selectAllCheckbox"></div></th>
                                    <th>File Attachment Name</th>
                                    <th>Linked Parameter Profile</th>
                                    <th>Format</th>
                                    <th>Size</th>
                                    <th style="text-align: right;">Action</th>
                                </tr>
                            </thead>
                            <tbody id="fileTableBody"></tbody>
                        </table>
                    </div>

                    <!-- MASS DOWNLOAD & ACTION TIER -->
                    <div class="vault-actions-bar">
                        <div class="selected-counter" id="selectedCounter">0 ATTACHMENTS SELECTED FOR COMPILE</div>
                        <button class="zip-compile-btn" id="zipCompileBtn">
                            <span>Compile Downloader ZIP</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(vaultModal);

        // Bind interactive event structures
        document.getElementById('close-vault-btn').addEventListener('click', closeVault);
        document.getElementById('selectAllCheckbox').addEventListener('click', toggleSelectAll);
        document.getElementById('newFolderBtn').addEventListener('click', addNewFolder);
        document.getElementById('vaultSearchInput').addEventListener('input', updateFilters);
        document.getElementById('vaultProjectSelect').addEventListener('change', updateFilters);
        document.getElementById('vaultTypeSelect').addEventListener('change', updateFilters);
        document.getElementById('zipCompileBtn').addEventListener('click', compileSelectedZip);

        // Bind File Drop Simulator trigger
        document.getElementById('vaultUploadZone').addEventListener('click', () => {
            simulateFileUpload();
        });
    }

    // 4. RENDERING FUNCTIONS
    function renderFolders() {
        const container = document.getElementById('folderListContainer');
        container.innerHTML = '';

        vaultState.folders.forEach(folder => {
            const count = folder === 'All' 
                ? vaultState.files.length 
                : vaultState.files.filter(f => f.folder === folder).length;

            const activeClass = vaultState.currentFolder === folder ? 'active' : '';
            container.innerHTML += `
                <div class="folder-item ${activeClass}" onclick="window.setVaultFolder('${folder}')">
                    <span>📁 ${folder}</span>
                    <span class="folder-count">${count}</span>
                </div>
            `;
        });
    }

    function renderFilterDropdowns() {
        const pSelect = document.getElementById('vaultProjectSelect');
        const tSelect = document.getElementById('vaultTypeSelect');

        pSelect.innerHTML = '';
        vaultState.projects.forEach(proj => {
            pSelect.innerHTML += `<option value="${proj}">${proj === 'All' ? 'ALL PROFILE LINKS' : proj}</option>`;
        });

        tSelect.innerHTML = '';
        vaultState.types.forEach(type => {
            tSelect.innerHTML += `<option value="${type}">${type === 'All' ? 'ALL FORMATS' : type + ' FILE'}</option>`;
        });
    }

    function renderFilesTable() {
        const tbody = document.getElementById('fileTableBody');
        tbody.innerHTML = '';

        // Apply visual and logical filters
        const filtered = vaultState.files.filter(file => {
            const matchesFolder = vaultState.currentFolder === 'All' || file.folder === vaultState.currentFolder;
            const matchesProject = vaultState.filterProject === 'All' || file.project === vaultState.filterProject;
            const matchesType = vaultState.filterType === 'All' || file.type === vaultState.filterType;
            const matchesSearch = file.name.toLowerCase().includes(vaultState.searchQuery.toLowerCase());

            return matchesFolder && matchesProject && matchesType && matchesSearch;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px 0;">No attachments matched active archive queries.</td></tr>`;
            return;
        }

        filtered.forEach(file => {
            const isSelected = vaultState.selectedFiles.includes(file.id);
            const checkClass = isSelected ? 'checked' : '';
            const rowClass = isSelected ? 'selected' : '';

            // Format tags visually
            let formatTagClass = 'tag-blue';
            if (file.type === 'PDF') formatTagClass = 'tag-magenta';
            if (file.type === 'XLSX') formatTagClass = 'tag-yellow';

            tbody.innerHTML += `
                <tr class="file-row ${rowClass}">
                    <td>
                        <div class="vault-checkbox ${checkClass}" onclick="window.toggleFileSelection(${file.id})">
                            ${isSelected ? '✔' : ''}
                        </div>
                    </td>
                    <td>
                        <div style="font-weight: 800; color: #fff;">${file.name}</div>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top: 3px;">Uploaded: ${file.date} | Category: ${file.folder}</div>
                    </td>
                    <td><span class="vault-tag tag-blue" style="font-size: 10px;">${file.project}</span></td>
                    <td><span class="vault-tag ${formatTagClass}">${file.type}</span></td>
                    <td style="font-family: monospace; font-size: 12px; color: var(--text-muted);">${file.size}</td>
                    <td style="text-align: right;">
                        <a href="#" class="tool-action" style="padding: 6px 12px; font-size: 11px;" onclick="window.downloadSingleMockFile('${file.name}')">GET ↗</a>
                    </td>
                </tr>
            `;
        });

        updateMassActionBar();
    }

    function updateMassActionBar() {
        const count = vaultState.selectedFiles.length;
        document.getElementById('selectedCounter').innerText = `${count} ATTACHMENT${count !== 1 ? 'S' : ''} SELECTED FOR COMPILING`;

        const selectAll = document.getElementById('selectAllCheckbox');
        const activeFilterFiles = getFilteredFileIds();
        const allSelected = activeFilterFiles.length > 0 && activeFilterFiles.every(id => vaultState.selectedFiles.includes(id));

        if (allSelected) {
            selectAll.classList.add('checked');
            selectAll.innerText = '✔';
        } else {
            selectAll.classList.remove('checked');
            selectAll.innerText = '';
        }
    }

    function getFilteredFileIds() {
        return vaultState.files.filter(file => {
            const matchesFolder = vaultState.currentFolder === 'All' || file.folder === vaultState.currentFolder;
            const matchesProject = vaultState.filterProject === 'All' || file.project === vaultState.filterProject;
            const matchesType = vaultState.filterType === 'All' || file.type === vaultState.filterType;
            const matchesSearch = file.name.toLowerCase().includes(vaultState.searchQuery.toLowerCase());
            return matchesFolder && matchesProject && matchesType && matchesSearch;
        }).map(file => file.id);
    }

    // 5. EVENT CONTROLLERS
    function openVault() {
        document.getElementById('vaultOverlay').classList.add('active');
        document.getElementById('backdrop').classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Render current data
        renderFolders();
        renderFilterDropdowns();
        renderFilesTable();
    }

    function closeVault() {
        document.getElementById('vaultOverlay').classList.remove('active');
        document.getElementById('backdrop').classList.remove('active');
        document.body.style.overflow = '';
    }

    window.setVaultFolder = function(folder) {
        vaultState.currentFolder = folder;
        renderFolders();
        renderFilesTable();
    };

    window.toggleFileSelection = function(id) {
        const idx = vaultState.selectedFiles.indexOf(id);
        if (idx > -1) {
            vaultState.selectedFiles.splice(idx, 1);
        } else {
            vaultState.selectedFiles.push(id);
        }
        renderFilesTable();
    };

    function toggleSelectAll() {
        const filteredIds = getFilteredFileIds();
        const allSelected = filteredIds.every(id => vaultState.selectedFiles.includes(id));

        if (allSelected) {
            // Deselect all within current filter
            vaultState.selectedFiles = vaultState.selectedFiles.filter(id => !filteredIds.includes(id));
        } else {
            // Select all current filtered items
            filteredIds.forEach(id => {
                if (!vaultState.selectedFiles.includes(id)) {
                    vaultState.selectedFiles.push(id);
                }
            });
        }
        renderFilesTable();
    }

    function addNewFolder() {
        const input = document.getElementById('newFolderInput');
        const name = input.value.trim();
        if (name && !vaultState.folders.includes(name)) {
            vaultState.folders.push(name);
            input.value = '';
            renderFolders();
        }
    }

    function updateFilters() {
        vaultState.searchQuery = document.getElementById('vaultSearchInput').value;
        vaultState.filterProject = document.getElementById('vaultProjectSelect').value;
        vaultState.filterType = document.getElementById('vaultTypeSelect').value;
        renderFilesTable();
    }

    // 6. SIMULATIONS & INTERACTIONS
    function simulateFileUpload() {
        const fileNames = [
            { name: 'lease_agreement_signed.pdf', format: 'PDF', size: '1.4 MB' },
            { name: 'd&b_credit_report.pdf', format: 'PDF', size: '2.8 MB' },
            { name: 'corporate_tax_returns_2022.pdf', format: 'PDF', size: '6.5 MB' },
            { name: 'bank_reconciliations_jan.xlsx', format: 'XLSX', size: '1.1 MB' }
        ];

        const picked = fileNames[Math.floor(Math.random() * fileNames.length)];
        
        // Prevent duplicates
        const exists = vaultState.files.some(f => f.name === picked.name);
        const uniqueName = exists ? `${Date.now()}_${picked.name}` : picked.name;

        const newFile = {
            id: vaultState.files.length + 1,
            name: uniqueName,
            folder: vaultState.currentFolder !== 'All' ? vaultState.currentFolder : 'Underwriting Docs',
            type: picked.format,
            size: picked.size,
            project: vaultState.filterProject !== 'All' ? vaultState.filterProject : 'Alpha Real Estate',
            date: new Date().toISOString().split('T')[0]
        };

        // Instantly push to simulation state array
        vaultState.files.unshift(newFile);
        
        // Show success visual feedback on upload block
        const zone = document.getElementById('vaultUploadZone');
        const origText = zone.innerHTML;
        zone.style.borderColor = 'var(--accent-cyan)';
        zone.innerHTML = `
            <div class="upload-text" style="color: var(--accent-cyan);">⚡ FILE SUCCESSFULLY INGESTED & ARCHIVED</div>
            <div class="upload-sub" style="color: #fff;">${uniqueName} (${picked.size}) mapped to "${newFile.folder}" directory</div>
        `;

        setTimeout(() => {
            zone.style.borderColor = '';
            zone.innerHTML = origText;
        }, 3500);

        renderFolders();
        renderFilesTable();
    }

    window.downloadSingleMockFile = function(fileName) {
        alert(`Downloading file directly from secure storage: ${fileName}`);
    };

    function compileSelectedZip() {
        if (vaultState.selectedFiles.length === 0) {
            alert('Please select at least one document to compile ZIP.');
            return;
        }

        // Create overlay container
        const modal = document.getElementById('fileListPanel');
        const progressOverlay = document.createElement('div');
        progressOverlay.className = 'zip-progress-overlay';
        progressOverlay.innerHTML = `
            <div class="zip-status-text" id="zipProgressTitle">COMPILING CHANNELS...</div>
            <div class="zip-bar-container">
                <div class="zip-progress-fill" id="zipProgressFill"></div>
            </div>
            <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-family: monospace;" id="zipFileTracker">Preparing archive catalog</div>
        `;
        modal.appendChild(progressOverlay);

        let progress = 0;
        const totalSelected = vaultState.selectedFiles.length;
        const interval = setInterval(() => {
            progress += 5;
            if (progress <= 100) {
                document.getElementById('zipProgressFill').style.width = `${progress}%`;
                
                // Simulate log progression files
                const fileIdx = Math.min(Math.floor((progress / 100) * totalSelected), totalSelected - 1);
                const fileObj = vaultState.files.find(f => f.id === vaultState.selectedFiles[fileIdx]);
                if (fileObj) {
                    document.getElementById('zipProgressTitle').innerText = 'PACKAGING SECURE VAULT METRICS';
                    document.getElementById('zipFileTracker').innerText = `Injecting: ${fileObj.name} (${fileObj.size})`;
                }
            } else {
                clearInterval(interval);
                document.getElementById('zipProgressTitle').innerText = 'COMPLETED SUCCESS!';
                document.getElementById('zipFileTracker').innerText = `FINTECH_EXPORT_VAULT_${Date.now().toString().slice(-6)}.zip successfully outputted`;
                
                setTimeout(() => {
                    progressOverlay.remove();
                    alert(`ZIP compiled successfully. Simulated download for "FINTECH_EXPORT_VAULT_${Date.now().toString().slice(-6)}.zip" initialized containing ${totalSelected} files.`);
                    vaultState.selectedFiles = [];
                    renderFilesTable();
                }, 1000);
            }
        }, 120);
    }

    // Initialize module on page load
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        injectUI();
    } else {
        document.addEventListener('DOMContentLoaded', injectUI);
    }

    // Expose close actions globally so backdrop click hooks clean up properly
    window.closeVault = closeVault;
    window.openVault = openVault;
})();