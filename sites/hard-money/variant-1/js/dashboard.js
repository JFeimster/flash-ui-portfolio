/**
 * Dynamic Edge | Workspace Activity & Storage Dashboard Core Logic
 * Integration for telemetry, multi-file handshakes, live metrics, and pinned pipelines.
 */

// Global Dashboard State
const DashboardState = {
    storage: {
        totalBytes: 5 * 1024 * 1024 * 1024, // 5 GB limit
        usedBytes: 3.82 * 1024 * 1024 * 1024, // 3.82 GB used
        breakdown: {
            underwriting: 1.8 * 1024 * 1024 * 1024,
            escrow: 1.2 * 1024 * 1024 * 1024,
            entityDocs: 0.82 * 1024 * 1024 * 1024
        }
    },
    uploads: [
        { id: "upl-101", name: "Apex_TermSheet_Executed.pdf", size: 2450000, type: "pdf", category: "underwriting", uploadedAt: "2023-11-20T14:32:00Z", secureHash: "SHA256: 8f9a...3c21" },
        { id: "upl-102", name: "Entity_LLC_OperatingAgreement.pdf", size: 12100000, type: "pdf", category: "entityDocs", uploadedAt: "2023-11-20T09:15:00Z", secureHash: "SHA256: 4b2e...991a" },
        { id: "upl-103", name: "Phase1_Environmental_Report.zip", size: 145000000, type: "zip", category: "underwriting", uploadedAt: "2023-11-19T17:45:00Z", secureHash: "SHA256: 7d1c...88ee" },
        { id: "upl-104", name: "Escrow_Instructions_TitleCommitment.pdf", size: 8400000, type: "pdf", category: "escrow", uploadedAt: "2023-11-18T11:02:00Z", secureHash: "SHA256: 1a9f...55bc" },
        { id: "upl-105", name: "Sponsor_Financial_Schedule.xlsx", size: 1850000, type: "xlsx", category: "underwriting", uploadedAt: "2023-11-17T15:20:00Z", secureHash: "SHA256: 9e2d...44fa" }
    ],
    pinnedProjects: [
        { id: "proj-1", name: "Silicon Valley Multifamily Bridge", lender: "Apex Velocity Capital", targetCapital: 12500000, status: "Term Sheet Signed", progress: 65, telemetryAlert: false },
        { id: "proj-2", name: "Austin SFR Portfolio Expansion", lender: "Pacific Rim Funding Group", targetCapital: 4200000, status: "Underwriting Phase", progress: 40, telemetryAlert: true },
        { id: "proj-3", name: "Phoenix Industrial Park Outlot", lender: "Emberstone Capital", targetCapital: 8900000, status: "Escrow Handshake", progress: 90, telemetryAlert: false }
    ],
    submissions: [
        {
            id: "sub-901",
            title: "Multi-File Package: Apex Underwriting",
            filesCount: 4,
            status: "UNDER_REVIEW", // APPROVED, UNDER_REVIEW, CRITICAL_HOLD
            lastActivity: "10 minutes ago",
            items: [
                { name: "Sponsor Balance Sheet", verified: true },
                { name: "3-Year Pro Forma", verified: true },
                { name: "Environmental Phase I", verified: false, pendingReview: true },
                { name: "Corporate Operating Agreement", verified: false, pendingReview: true }
            ]
        },
        {
            id: "sub-902",
            title: "Compliance Pack: Austin Escrow Wire",
            filesCount: 2,
            status: "APPROVED",
            lastActivity: "2 hours ago",
            items: [
                { name: "Wire Routing Authorization", verified: true },
                { name: "Certified Title Report", verified: true }
            ]
        },
        {
            id: "sub-903",
            title: "Pre-Development Pack: Vanguard Land",
            filesCount: 3,
            status: "CRITICAL_HOLD",
            lastActivity: "1 day ago",
            items: [
                { name: "Geotechnical Survey Map", verified: false, error: "Signature Missing" },
                { name: "Zoning Board Resolution Letter", verified: true },
                { name: "Site Plan Overlay Layout", verified: false, error: "Outdated File Version" }
            ]
        }
    ],
    filters: {
        fileCategory: "ALL",
        searchQuery: ""
    }
};

// Initialize Dashboard Functionality
function initDashboard() {
    renderStorageMetrics();
    renderRecentUploads();
    renderPinnedProjects();
    renderSubmissions();
    setupEventListeners();
    updateTelemetryStrip();
}

// Telemetry Metric String Formatter Helpers
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function updateTelemetryStrip() {
    const totalFiles = DashboardState.uploads.length;
    const alertCount = DashboardState.pinnedProjects.filter(p => p.telemetryAlert).length;
    console.log(`[Telemetry Sync] Data points active: ${totalFiles} Files. Submissions active. Alerts: ${alertCount}`);
}

// Render Core Telemetry and Storage UI
function renderStorageMetrics() {
    const container = document.getElementById("storage-metrics-container");
    if (!container) return;

    const usedText = formatBytes(DashboardState.storage.usedBytes, 2);
    const totalText = formatBytes(DashboardState.storage.totalBytes, 0);
    const percentage = ((DashboardState.storage.usedBytes / DashboardState.storage.totalBytes) * 100).toFixed(1);

    // Compute dynamic breakdowns for cyber progress rings or bars
    const uPct = ((DashboardState.storage.breakdown.underwriting / DashboardState.storage.totalBytes) * 100).toFixed(1);
    const ePct = ((DashboardState.storage.breakdown.escrow / DashboardState.storage.totalBytes) * 100).toFixed(1);
    const docPct = ((DashboardState.storage.breakdown.entityDocs / DashboardState.storage.totalBytes) * 100).toFixed(1);

    container.innerHTML = `
        <div class="bg-cyber-card border border-cyber-border p-6 rounded-xl relative overflow-hidden edge-clip">
            <div class="absolute top-0 right-0 w-32 h-32 bg-cyber-purple/5 rounded-full filter blur-2xl pointer-events-none"></div>
            
            <div class="flex items-center justify-between mb-4 border-b border-cyber-border/40 pb-3">
                <h3 class="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span class="w-1.5 h-3 bg-cyber-purple inline-block animate-pulse"></span>
                    Central Storage Vault
                </h3>
                <span class="text-xs font-mono text-cyber-purple font-bold">${percentage}% USED</span>
            </div>

            <!-- Large Progress Bar -->
            <div class="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-cyber-border p-[1px] mb-6">
                <div class="h-full bg-gradient-to-r from-cyber-purple via-blue-500 to-cyber-accent rounded-full shadow-[0_0_10px_rgba(189,0,255,0.5)] transition-all duration-500" style="width: ${percentage}%"></div>
            </div>

            <!-- Grid breakdown -->
            <div class="grid grid-cols-3 gap-4 font-mono text-xs">
                <div class="bg-black/20 p-2.5 border border-cyber-border/40 rounded">
                    <span class="block text-[9px] text-slate-500 uppercase">UNDERWRITING</span>
                    <span class="text-slate-200 font-bold block mt-1">${formatBytes(DashboardState.storage.breakdown.underwriting, 1)}</span>
                    <div class="w-full bg-black/60 h-1 mt-2 rounded-full overflow-hidden">
                        <div class="h-full bg-cyber-purple" style="width: ${uPct * (100/percentage)}%"></div>
                    </div>
                </div>
                <div class="bg-black/20 p-2.5 border border-cyber-border/40 rounded">
                    <span class="block text-[9px] text-slate-500 uppercase">ESCROW BUNDLES</span>
                    <span class="text-cyber-accent font-bold block mt-1">${formatBytes(DashboardState.storage.breakdown.escrow, 1)}</span>
                    <div class="w-full bg-black/60 h-1 mt-2 rounded-full overflow-hidden">
                        <div class="h-full bg-cyber-accent" style="width: ${ePct * (100/percentage)}%"></div>
                    </div>
                </div>
                <div class="bg-black/20 p-2.5 border border-cyber-border/40 rounded">
                    <span class="block text-[9px] text-slate-500 uppercase">ENTITY FILES</span>
                    <span class="text-cyber-emerald font-bold block mt-1">${formatBytes(DashboardState.storage.breakdown.entityDocs, 1)}</span>
                    <div class="w-full bg-black/60 h-1 mt-2 rounded-full overflow-hidden">
                        <div class="h-full bg-cyber-emerald" style="width: ${docPct * (100/percentage)}%"></div>
                    </div>
                </div>
            </div>

            <div class="mt-4 pt-3 border-t border-cyber-border/30 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Total Payload Space: <strong>${totalText}</strong></span>
                <span class="text-slate-500">Secure Protocol: TLS 1.3 / AES-256</span>
            </div>
        </div>
    `;
}

// Render Recent Uploads List
function renderRecentUploads() {
    const container = document.getElementById("recent-uploads-container");
    if (!container) return;

    let filtered = DashboardState.uploads.filter(file => {
        const matchesCategory = DashboardState.filters.fileCategory === "ALL" || file.category === DashboardState.filters.fileCategory;
        const matchesSearch = file.name.toLowerCase().includes(DashboardState.filters.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="py-12 text-center border border-dashed border-cyber-border rounded-xl">
                <p class="font-mono text-xs text-slate-500">NO SECURE UPLOADS MATCHING ACTIVE FILTERS</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(file => {
        const timeFormatted = new Date(file.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateFormatted = new Date(file.uploadedAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        // Category color coding
        let categoryColor = "text-cyber-purple border-cyber-purple/30 bg-cyber-purple/5";
        if (file.category === "escrow") categoryColor = "text-cyber-accent border-cyber-accent/30 bg-cyber-accent/5";
        if (file.category === "entityDocs") categoryColor = "text-cyber-emerald border-cyber-emerald/30 bg-cyber-emerald/5";

        // File icon based on type
        let fileIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`;
        if (file.type === "zip") {
            fileIcon = `<svg class="w-5 h-5 text-cyber-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>`;
        }

        return `
            <div class="bg-black/40 border border-cyber-border hover:border-cyber-accent/40 p-4 rounded-lg flex items-center justify-between gap-4 transition-all duration-200 group relative">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="p-2 bg-cyber-card border border-cyber-border/80 rounded group-hover:border-cyber-accent/30 transition-colors">
                        ${fileIcon}
                    </div>
                    <div class="min-w-0">
                        <span class="block text-sm font-bold text-slate-200 truncate group-hover:text-cyber-accent transition-colors">${file.name}</span>
                        <div class="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-slate-500">
                            <span>${formatBytes(file.size, 1)}</span>
                            <span>•</span>
                            <span class="truncate">${file.secureHash}</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-4 shrink-0 font-mono text-right">
                    <div>
                        <span class="inline-block border px-2 py-0.5 rounded text-[9px] uppercase font-bold ${categoryColor}">
                            ${file.category}
                        </span>
                        <span class="block text-[10px] text-slate-400 mt-1">${dateFormatted}, ${timeFormatted}</span>
                    </div>
                    <button onclick="deleteFile('${file.id}')" class="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded transition-all" title="Purge File From Vault">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// Render Pinned Projects Pipeline Grid
function renderPinnedProjects() {
    const container = document.getElementById("pinned-projects-container");
    if (!container) return;

    container.innerHTML = DashboardState.pinnedProjects.map(project => {
        const isAlert = project.telemetryAlert;
        const alertStatusHTML = isAlert 
            ? `<span class="flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded animate-pulse">
                <span class="h-1.5 w-1.5 rounded-full bg-red-400"></span> TELEMETRY DISCREPANCY
               </span>`
            : `<span class="text-[10px] text-cyber-emerald font-bold bg-cyber-emerald/10 border border-cyber-emerald/20 px-2 py-0.5 rounded">SYNC STATUS: OPTIMAL</span>`;

        return `
            <div class="bg-cyber-card border ${isAlert ? 'border-red-500/50' : 'border-cyber-border'} hover:border-cyber-accent/50 p-5 rounded-xl transition-all duration-300 relative group flex flex-col justify-between edge-clip">
                <div>
                    <!-- Top Status Strip -->
                    <div class="flex items-center justify-between mb-3 pb-3 border-b border-cyber-border/40">
                        <span class="text-[10px] font-mono text-cyber-purple tracking-widest uppercase">${project.lender}</span>
                        ${alertStatusHTML}
                    </div>

                    <!-- Project Title -->
                    <h4 class="text-base font-bold text-slate-100 group-hover:text-cyber-accent transition-colors duration-200 truncate">${project.name}</h4>
                    
                    <!-- Details & Target Capital -->
                    <div class="grid grid-cols-2 gap-2 mt-4 bg-black/40 p-2.5 rounded border border-cyber-border/40 text-xs font-mono">
                        <div>
                            <span class="text-[10px] text-slate-500 uppercase block">TARGET CAPITAL</span>
                            <span class="text-slate-200 font-bold">$${(project.targetCapital / 1000000).toFixed(2)}M</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 uppercase block">CLOSING MILESTONE</span>
                            <span class="text-cyber-accent font-bold truncate block">${project.status}</span>
                        </div>
                    </div>
                </div>

                <!-- Custom Progress Telemetry Bar -->
                <div class="mt-5">
                    <div class="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                        <span>HANDSHAKE PROGRESS</span>
                        <strong class="${isAlert ? 'text-red-400' : 'text-cyber-emerald'}">${project.progress}%</strong>
                    </div>
                    <div class="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-cyber-border/40">
                        <div class="h-full ${isAlert ? 'bg-red-500' : 'bg-cyber-emerald'} rounded-full" style="width: ${project.progress}%"></div>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-cyber-border/30 flex items-center justify-between">
                    <button onclick="toggleProjectAlert('${project.id}')" class="text-[10px] font-mono text-slate-400 hover:text-white transition-colors">
                        [ Simulate ${isAlert ? "Resolve" : "Flag"} ]
                    </button>
                    <button onclick="openProjectTelemetry('${project.id}')" class="text-xs font-mono text-cyber-accent hover:text-white flex items-center gap-1 transition-colors">
                        <span>Direct Terminal</span>
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// Render Submissions & Interactive Multi-File Status Flow
function renderSubmissions() {
    const container = document.getElementById("submissions-container");
    if (!container) return;

    container.innerHTML = DashboardState.submissions.map(sub => {
        let statusBadge = "";
        let borderOverride = "border-cyber-border";
        let titleColor = "text-slate-100";

        if (sub.status === "APPROVED") {
            statusBadge = `<span class="bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">APPROVED BY UNDERWRITER</span>`;
            borderOverride = "border-cyber-emerald/30";
        } else if (sub.status === "UNDER_REVIEW") {
            statusBadge = `<span class="bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">UNDER ACTIVE AUDIT</span>`;
            borderOverride = "border-cyber-accent/30";
        } else {
            statusBadge = `<span class="bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">COMPLIANCE CRITICAL HOLD</span>`;
            borderOverride = "border-red-500/30";
            titleColor = "text-red-200";
        }

        const itemsHTML = sub.items.map(item => {
            let itemStatus = "";
            if (item.verified) {
                itemStatus = `<span class="text-cyber-emerald text-xs font-mono flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                SECURE HANDSHAKE COMPLETE
                              </span>`;
            } else if (item.pendingReview) {
                itemStatus = `<span class="text-cyber-accent text-xs font-mono flex items-center gap-1 animate-pulse">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                PENDING TELEMETRY VERIFICATION
                              </span>`;
            } else {
                itemStatus = `<span class="text-red-400 text-xs font-mono flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                ERROR: ${item.error}
                              </span>`;
            }

            return `
                <div class="flex items-center justify-between p-2.5 bg-black/40 border border-cyber-border/40 rounded text-sm transition-all hover:bg-black/60">
                    <span class="font-mono text-xs text-slate-300">${item.name}</span>
                    ${itemStatus}
                </div>
            `;
        }).join("");

        return `
            <div class="bg-cyber-card border ${borderOverride} p-6 rounded-xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between edge-clip-reverse">
                <div>
                    <!-- Top Status Row -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <span class="h-2 w-2 rounded-full ${sub.status === 'APPROVED' ? 'bg-cyber-emerald' : sub.status === 'UNDER_REVIEW' ? 'bg-cyber-accent' : 'bg-red-400'}"></span>
                            <span class="text-xs font-mono text-slate-400 uppercase">SUBMISSION: ${sub.id}</span>
                        </div>
                        ${statusBadge}
                    </div>

                    <!-- Submission Title -->
                    <h3 class="text-base font-bold mb-1 ${titleColor}">${sub.title}</h3>
                    <p class="text-xs font-mono text-slate-500 mb-4">Pulse Status: Uploaded ${sub.lastActivity}</p>

                    <!-- Items List -->
                    <div class="space-y-2">
                        ${itemsHTML}
                    </div>
                </div>

                <!-- Simulation Controls bottom line -->
                <div class="mt-6 pt-4 border-t border-cyber-border/40 flex items-center justify-between gap-4">
                    <span class="text-[10px] font-mono text-slate-500">HANDSHAKE SECURITY PACK v2.1</span>
                    <div class="flex gap-2">
                        <button onclick="overrideSubmissionStatus('${sub.id}', 'APPROVED')" class="px-2 py-1 text-[10px] font-mono bg-cyber-emerald/10 hover:bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/20 rounded transition-all">
                            Approve Pass
                        </button>
                        <button onclick="overrideSubmissionStatus('${sub.id}', 'CRITICAL_HOLD')" class="px-2 py-1 text-[10px] font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded transition-all">
                            Flag Hold
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// Add UI Interactivity Event Listeners
function setupEventListeners() {
    // Search uploads box
    const searchInput = document.getElementById("dashboardSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            DashboardState.filters.searchQuery = e.target.value;
            renderRecentUploads();
        });
    }

    // Category selectors
    const catSelector = document.getElementById("categoryFilterSelector");
    if (catSelector) {
        catSelector.addEventListener("change", (e) => {
            DashboardState.filters.fileCategory = e.target.value;
            renderRecentUploads();
        });
    }
}

// Action Logic: Upload Simulation
function simulateFileUpload(fileName, fileSize, fileCategory) {
    if (!fileName) return;
    
    // Auto compute file parameters
    const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const fakeHash = "SHA256: " + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6);
    const mockFile = {
        id: "upl-" + (100 + DashboardState.uploads.length + 1),
        name: safeName,
        size: fileSize || Math.floor(Math.random() * 50000000) + 1000000, // randomized if not supplied
        type: safeName.split('.').pop() || "pdf",
        category: fileCategory || "underwriting",
        uploadedAt: new Date().toISOString(),
        secureHash: fakeHash
    };

    // Update state
    DashboardState.uploads.unshift(mockFile);
    DashboardState.storage.usedBytes += mockFile.size;

    // Direct breakdown adjustments
    if (mockFile.category in DashboardState.storage.breakdown) {
        DashboardState.storage.breakdown[mockFile.category] += mockFile.size;
    } else {
        DashboardState.storage.breakdown.underwriting += mockFile.size;
    }

    // Live redraw
    renderStorageMetrics();
    renderRecentUploads();
    updateTelemetryStrip();

    console.log(`[Vault Engine] Successfully registered new payload secure match: ${safeName}`);
}

// Action Logic: File Deletion
function deleteFile(fileId) {
    const fileIndex = DashboardState.uploads.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;

    const file = DashboardState.uploads[fileIndex];
    DashboardState.storage.usedBytes -= file.size;

    // Adjust specific breakdown metrics safely
    if (file.category in DashboardState.storage.breakdown) {
        DashboardState.storage.breakdown[file.category] = Math.max(0, DashboardState.storage.breakdown[file.category] - file.size);
    }

    // Remove file
    DashboardState.uploads.splice(fileIndex, 1);

    // Live UI updates
    renderStorageMetrics();
    renderRecentUploads();
    updateTelemetryStrip();
}

// Action Logic: Toggle project alert status
function toggleProjectAlert(projectId) {
    const project = DashboardState.pinnedProjects.find(p => p.id === projectId);
    if (project) {
        project.telemetryAlert = !project.telemetryAlert;
        renderPinnedProjects();
        updateTelemetryStrip();
    }
}

// Action Logic: Open terminal view for project
function openProjectTelemetry(projectId) {
    const project = DashboardState.pinnedProjects.find(p => p.id === projectId);
    if (project) {
        alert(`ACCESS TERMINAL RUNTIME: Establishing deep quantum socket link to verification database for project [${project.name}]. Standard Handshake status: ${project.progress}%.`);
    }
}

// Action Logic: Override review statuses for submission
function overrideSubmissionStatus(subId, newStatus) {
    const sub = DashboardState.submissions.find(s => s.id === subId);
    if (sub) {
        sub.status = newStatus;
        sub.lastActivity = "Just updated";
        renderSubmissions();
    }
}

// Export initialization globally for DOM hooks
window.DashboardState = DashboardState;
window.initDashboard = initDashboard;
window.simulateFileUpload = simulateFileUpload;
window.deleteFile = deleteFile;
window.toggleProjectAlert = toggleProjectAlert;
window.openProjectTelemetry = openProjectTelemetry;
window.overrideSubmissionStatus = overrideSubmissionStatus;

// Auto bootstrapping helper
document.addEventListener("DOMContentLoaded", () => {
    // Only bootstrap if the target containers are located (e.g. integration on the dashboard frame)
    if (document.getElementById("storage-metrics-container")) {
        initDashboard();
    }
});