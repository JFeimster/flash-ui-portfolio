/**
 * Moonshine Capital Partners - Partner Operator Dashboard & Static Database Manager
 * File: operator/admin.js
 * 
 * A self-contained, client-side Administrative Console designed to manage,
 * validate, edit, and export partner profiles ('partners.json').
 * Injectable into any HTML page with a <div id="admin-dashboard"></div> element,
 * or runs as a full-page override if loaded onto an empty page.
 */

(function () {
    // 1. Core State & Mock Data Fallbacks
    const DEFAULT_PARTNERS = [
        {
            id: "marcus-vance",
            name: "Marcus Vance",
            niche: "Contractor Funding Partner",
            avatar: "MV",
            bio: "Expert in working capital lines, payroll-driven bridge facilities, and structural asset funding programs built specifically for general commercial contractors.",
            specialties: ["SBA 7(a)", "Real Estate", "Lines of Credit"],
            primaryRoute: "SBA 7(a) & Line of Credit",
            targetClients: "Commercial Subcontractors",
            avgCloseTime: "7-14 Business Days",
            pipelineDirected: 24500000,
            fastCloseTarget: "12 Days",
            status: "approved",
            updatedAt: new Date().toISOString()
        },
        {
            id: "evelyn-thorne",
            name: "Evelyn Thorne",
            niche: "Ecommerce Scaling Specialist",
            avatar: "ET",
            bio: "Focused on lightning-fast revenue-based financing structures designed for multichannel sellers on Amazon, Shopify, and TikTok Shop platforms.",
            specialties: ["Revenue", "SBA 7(a)"],
            primaryRoute: "Revenue Financing",
            targetClients: "High-Velocity Brands",
            avgCloseTime: "24-48 Hours",
            pipelineDirected: 18200000,
            fastCloseTarget: "48 Hours",
            status: "approved",
            updatedAt: new Date().toISOString()
        },
        {
            id: "silas-sterling",
            name: "Silas Sterling",
            niche: "Real Estate Funding Specialist",
            avatar: "SS",
            bio: "Delivering bridge solutions, rehab allocations, and fast hard-money paths for residential fix-and-flip operators and portfolio developers.",
            specialties: ["Real Estate", "Bridge Loans"],
            primaryRoute: "Commercial Asset Backed",
            targetClients: "Property Developers",
            avgCloseTime: "5-10 Business Days",
            pipelineDirected: 31900000,
            fastCloseTarget: "7 Days",
            status: "approved",
            updatedAt: new Date().toISOString()
        },
        {
            id: "amara-vance",
            name: "Amara Vance",
            niche: "Corporate Credit Strategist",
            avatar: "AV",
            bio: "Prepares pre-revenue entities and structured LLCs to build high-grade tier 1/2 profiles that bypass heavy personal guarantee liabilities.",
            specialties: ["Credit Prep", "SBA 7(a)"],
            primaryRoute: "Business Credit Builder",
            targetClients: "Startups & SMBs",
            avgCloseTime: "30-60 Days",
            pipelineDirected: 8400000,
            fastCloseTarget: "30 Days",
            status: "approved",
            updatedAt: new Date().toISOString()
        },
        {
            id: "raymond-finch",
            name: "Raymond Finch",
            niche: "Main Street Funding Partner",
            avatar: "RF",
            bio: "Serving local healthcare facilities, professional offices, automotive centers, and long-standing brick-and-mortar storefront configurations.",
            specialties: ["SBA 7(a)", "Revenue"],
            primaryRoute: "SBA 7(a) & Equipment",
            targetClients: "Brick-&-Mortar Retail",
            avgCloseTime: "3-7 Business Days",
            pipelineDirected: 14200000,
            fastCloseTarget: "5 Days",
            status: "pending",
            updatedAt: new Date().toISOString()
        }
    ];

    let state = {
        partners: [],
        filterStatus: "all",
        searchQuery: "",
        editingId: null,
        logs: [],
        isDeploying: false
    };

    // 2. Custom Dashboard Styles
    const cssStyles = `
        :root {
            --matte-black: #0B0F17;
            --deep-gray: #121824;
            --graphite: #1E293B;
            --bone-white: #F9FAF1;
            --electric-green: #00FF66;
            --signal-orange: #FF5722;
            --cobalt-blue: #2563EB;
            --chrome-accent: #9CA3AF;
            --glass-bg: rgba(18, 24, 36, 0.75);
            --glass-border: rgba(255, 255, 255, 0.08);
            --neon-glow: 0 0 20px rgba(0, 255, 102, 0.25);
            --font-sans: 'Plus Jakarta Sans', sans-serif;
            --font-space: 'Space Grotesk', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        #admin-root {
            background-color: var(--matte-black);
            color: var(--bone-white);
            font-family: var(--font-sans);
            min-height: 100vh;
            padding: 40px 24px;
            box-sizing: border-box;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(0, 255, 102, 0.03) 0%, transparent 50%),
                linear-gradient(rgba(18, 24, 36, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(18, 24, 36, 0.3) 1px, transparent 1px);
            background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
        }

        .adm-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .adm-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--glass-border);
            padding-bottom: 24px;
            margin-bottom: 32px;
        }

        .adm-brand {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .adm-logo {
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, var(--electric-green), var(--cobalt-blue));
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-family: var(--font-space);
            color: var(--matte-black);
            box-shadow: var(--neon-glow);
            font-size: 1.4rem;
        }

        .adm-title h1 {
            font-family: var(--font-space);
            font-size: 1.75rem;
            font-weight: 700;
            letter-spacing: -0.02em;
        }

        .adm-title span {
            color: var(--electric-green);
        }

        .adm-title p {
            font-size: 0.85rem;
            color: var(--chrome-accent);
            font-family: var(--font-mono);
            margin-top: 4px;
        }

        /* Metrics */
        .adm-metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }

        .adm-metric-card {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .adm-metric-card h4 {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--chrome-accent);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .adm-metric-card .value {
            font-family: var(--font-space);
            font-size: 2.25rem;
            font-weight: 700;
            margin-top: 12px;
            color: var(--bone-white);
        }

        .adm-metric-card .subtext {
            font-size: 0.75rem;
            color: var(--chrome-accent);
            margin-top: 6px;
        }

        /* Main Workspace split */
        .adm-layout-grid {
            display: grid;
            grid-template-columns: 1.6fr 1fr;
            gap: 32px;
        }

        @media (max-width: 1024px) {
            .adm-layout-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Glass Panel */
        .adm-panel {
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 28px;
            margin-bottom: 24px;
        }

        .adm-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .adm-panel-title {
            font-family: var(--font-space);
            font-size: 1.25rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Buttons & Forms */
        .adm-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            font-family: var(--font-space);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.05em;
            text-decoration: none;
            border-radius: 4px;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
        }

        .adm-btn-primary {
            background-color: var(--electric-green);
            color: var(--matte-black);
            box-shadow: 3px 3px 0px 0px rgba(0, 255, 102, 0.2);
        }

        .adm-btn-primary:hover {
            transform: translate(-1px, -1px);
            box-shadow: 4px 4px 0px 0px var(--electric-green);
        }

        .adm-btn-secondary {
            background-color: transparent;
            color: var(--bone-white);
            border: 1.5px solid var(--bone-white);
        }

        .adm-btn-secondary:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }

        .adm-btn-danger {
            background-color: rgba(255, 87, 34, 0.1);
            color: var(--signal-orange);
            border: 1.5px solid var(--signal-orange);
        }

        .adm-btn-danger:hover {
            background-color: var(--signal-orange);
            color: var(--bone-white);
        }

        /* Search / Controls */
        .adm-controls-row {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            flex-wrap: wrap;
        }

        .adm-search {
            flex-grow: 1;
            position: relative;
        }

        .adm-search input {
            width: 100%;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid var(--glass-border);
            padding: 12px 16px 12px 40px;
            border-radius: 6px;
            color: var(--bone-white);
            font-family: var(--font-sans);
            font-size: 0.9rem;
            outline: none;
        }

        .adm-search input:focus {
            border-color: var(--electric-green);
        }

        .adm-search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--chrome-accent);
            pointer-events: none;
        }

        .adm-filter-group {
            display: flex;
            gap: 6px;
        }

        .adm-filter-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            color: var(--chrome-accent);
            padding: 10px 14px;
            border-radius: 6px;
            font-family: var(--font-space);
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
        }

        .adm-filter-btn.active {
            background: var(--electric-green);
            color: var(--matte-black);
            border-color: var(--electric-green);
        }

        /* Partner Table/List */
        .adm-table {
            width: 100%;
            border-collapse: collapse;
        }

        .adm-table th {
            text-align: left;
            padding: 14px 16px;
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--chrome-accent);
            border-bottom: 2px solid var(--glass-border);
            text-transform: uppercase;
        }

        .adm-table td {
            padding: 18px 16px;
            border-bottom: 1px solid var(--glass-border);
            vertical-align: middle;
        }

        .adm-table tr:hover {
            background: rgba(255, 255, 255, 0.01);
        }

        .adm-partner-meta {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .adm-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--cobalt-blue), var(--electric-green));
            color: var(--matte-black);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-family: var(--font-space);
            font-size: 0.95rem;
        }

        .adm-name {
            font-weight: 700;
            font-family: var(--font-space);
            font-size: 1rem;
        }

        .adm-niche {
            font-size: 0.75rem;
            color: var(--chrome-accent);
            margin-top: 2px;
        }

        .adm-tag {
            display: inline-block;
            font-family: var(--font-mono);
            font-size: 0.65rem;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }

        .adm-tag-verified {
            background: rgba(0, 255, 102, 0.1);
            color: var(--electric-green);
            border: 1.5px solid rgba(0, 255, 102, 0.2);
        }

        .adm-tag-pending {
            background: rgba(255, 87, 34, 0.1);
            color: var(--signal-orange);
            border: 1.5px solid rgba(255, 87, 34, 0.2);
        }

        .adm-actions-cell {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }

        /* JSON Export & Log Engine Visualizers */
        .adm-code-block {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid var(--glass-border);
            border-radius: 6px;
            padding: 16px;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: #A7F3D0;
            height: 280px;
            overflow-y: auto;
            white-space: pre-wrap;
            position: relative;
        }

        .adm-code-copy {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            color: var(--bone-white);
            font-size: 0.7rem;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
        }

        .adm-console {
            background: #06090F;
            border: 1px solid var(--glass-border);
            border-radius: 6px;
            padding: 16px;
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--chrome-accent);
            height: 200px;
            overflow-y: auto;
        }

        .adm-console-line {
            margin-bottom: 6px;
            line-height: 1.4;
        }

        .adm-console-line.success {
            color: var(--electric-green);
        }

        .adm-console-line.warning {
            color: var(--signal-orange);
        }

        .adm-console-line.info {
            color: var(--cobalt-blue);
        }

        /* Modals */
        .adm-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(6, 9, 15, 0.9);
            z-index: 1000;
            display: none;
            justify-content: center;
            align-items: center;
            padding: 24px;
            backdrop-filter: blur(8px);
        }

        .adm-modal-card {
            background: var(--matte-black);
            border: 2px solid var(--electric-green);
            border-radius: 8px;
            width: 100%;
            max-width: 650px;
            box-shadow: var(--neon-glow);
            padding: 32px;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }

        .adm-modal-close {
            position: absolute;
            top: 24px;
            right: 24px;
            background: none;
            border: none;
            color: var(--bone-white);
            font-size: 1.5rem;
            cursor: pointer;
        }

        .adm-form-group {
            margin-bottom: 18px;
        }

        .adm-form-group label {
            display: block;
            font-family: var(--font-space);
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 6px;
            color: var(--bone-white);
        }

        .adm-form-group input, 
        .adm-form-group select, 
        .adm-form-group textarea {
            width: 100%;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid var(--glass-border);
            padding: 10px 14px;
            border-radius: 6px;
            color: var(--bone-white);
            font-family: var(--font-sans);
            font-size: 0.9rem;
            box-sizing: border-box;
        }

        .adm-form-group input:focus, 
        .adm-form-group select:focus, 
        .adm-form-group textarea:focus {
            border-color: var(--electric-green);
            outline: none;
        }

        .adm-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
    `;

    // 3. UI Template Generator
    const dashboardTemplate = `
        <div id="admin-root">
            <div class="adm-container">
                <!-- Header -->
                <header class="adm-header">
                    <div class="adm-brand">
                        <div class="adm-logo">M</div>
                        <div class="adm-title">
                            <h1>Moonshine<span>Partners</span></h1>
                            <p>OPERATOR NETWORK ENGINE // SYSTEM PANEL v2.1</p>
                        </div>
                    </div>
                    <div>
                        <button class="adm-btn adm-btn-primary" id="btn-add-partner">
                            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4v16m-8-8h16"></path></svg>
                            Add Partner Profile
                        </button>
                    </div>
                </header>

                <!-- Metrics Dashboard Row -->
                <div class="adm-metrics-grid">
                    <div class="adm-metric-card">
                        <h4>Total Network Directors</h4>
                        <div class="value" id="metric-total">0</div>
                        <div class="subtext">Active public URLs</div>
                    </div>
                    <div class="adm-metric-card">
                        <h4>Pending Verification</h4>
                        <div class="value" id="metric-pending" style="color: var(--signal-orange);">0</div>
                        <div class="subtext">Review queue listings</div>
                    </div>
                    <div class="adm-metric-card">
                        <h4>Total Directed Pipeline</h4>
                        <div class="value" id="metric-pipeline" style="color: var(--electric-green);">$0M</div>
                        <div class="subtext">Aggregated tracking value</div>
                    </div>
                    <div class="adm-metric-card">
                        <h4>System Synchronizations</h4>
                        <div class="value" style="color: var(--cobalt-blue);">LOCAL</div>
                        <div class="subtext">Saved in operator browser storage</div>
                    </div>
                </div>

                <!-- Main Layout -->
                <div class="adm-layout-grid">
                    <!-- Left: Profile Directory List -->
                    <div class="adm-panel">
                        <div class="adm-panel-header">
                            <h3 class="adm-panel-title">
                                <svg width="20" height="20" fill="none" stroke="var(--electric-green)" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m12-10a4 4 0 1 0-8-8 4 4 0 0 0 8 8zm6 0h6m-3-3v6"></path></svg>
                                Managed Partner Profiles
                            </h3>
                        </div>

                        <!-- Table Controls -->
                        <div class="adm-controls-row">
                            <div class="adm-search">
                                <svg class="adm-search-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
                                <input type="text" id="inp-search" placeholder="Filter by strategist name, specialty tag...">
                            </div>
                            <div class="adm-filter-group">
                                <button class="adm-filter-btn active" data-filter="all">All</button>
                                <button class="adm-filter-btn" data-filter="approved">Verified</button>
                                <button class="adm-filter-btn" data-filter="pending">Pending</button>
                            </div>
                        </div>

                        <!-- Data List Table -->
                        <div style="overflow-x: auto;">
                            <table class="adm-table">
                                <thead>
                                    <tr>
                                        <th>Strategist Target</th>
                                        <th>Route Route Match</th>
                                        <th>Validation</th>
                                        <th style="text-align: right;">Console Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="partner-rows-container">
                                    <!-- Dynamic rows loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Right Column: Database Generation Panel & Logs -->
                    <div>
                        <!-- JSON Generation -->
                        <div class="adm-panel">
                            <div class="adm-panel-header">
                                <h3 class="adm-panel-title">
                                    <svg width="20" height="20" fill="none" stroke="var(--cobalt-blue)" stroke-width="2" viewBox="0 0 24 24"><path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"></path></svg>
                                    Dynamic Static Configuration
                                </h3>
                                <div style="display: flex; gap: 8px;">
                                    <button class="adm-btn adm-btn-secondary" style="padding: 6px 12px; font-size:0.75rem;" id="btn-copy-json">Copy JSON</button>
                                    <button class="adm-btn adm-btn-primary" style="padding: 6px 12px; font-size:0.75rem;" id="btn-deploy">Deploy Build</button>
                                </div>
                            </div>
                            <p style="color: var(--chrome-accent); font-size: 0.8rem; margin-bottom: 16px;">This configures the directory list of your index interface. Save this output directly into your system's 'partners.json' workspace configuration.</p>
                            <div class="adm-code-block" id="json-block">
                                <!-- Dynamic JSON Output -->
                            </div>
                        </div>

                        <!-- Deployment Logging Console -->
                        <div class="adm-panel">
                            <div class="adm-panel-header">
                                <h3 class="adm-panel-title">
                                    <svg width="20" height="20" fill="none" stroke="var(--signal-orange)" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83M12 12m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0z"></path></svg>
                                    Operational Log Output
                                </h3>
                                <button class="adm-btn adm-btn-secondary" style="padding: 6px 12px; font-size: 0.7rem;" id="btn-clear-console">Clear Console</button>
                            </div>
                            <div class="adm-console" id="console-output">
                                <!-- Realtime actions listed here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div class="adm-modal-overlay" id="editor-modal">
            <div class="adm-modal-card">
                <button class="adm-modal-close" id="btn-close-modal">✕</button>
                <h3 id="modal-title" style="font-family: var(--font-space); font-size: 1.5rem; margin-bottom: 24px; color: var(--electric-green);">Add Partner Profile Configuration</h3>
                <form id="partner-form">
                    <div class="adm-form-row">
                        <div class="adm-form-group">
                            <label>Strategist Full Name</label>
                            <input type="text" id="p-name" placeholder="Darwin Hanneman" required>
                        </div>
                        <div class="adm-form-group">
                            <label>Unique Link Slug ID</label>
                            <input type="text" id="p-id" placeholder="darwin-hanneman" required>
                        </div>
                    </div>

                    <div class="adm-form-row">
                        <div class="adm-form-group">
                            <label>Designated Title / Niche</label>
                            <input type="text" id="p-niche" placeholder="Elite Capital Director" required>
                        </div>
                        <div class="adm-form-group">
                            <label>Underwriting Status Verification</label>
                            <select id="p-status">
                                <option value="approved">Approved & Verified</option>
                                <option value="pending">Pending Validation</option>
                            </select>
                        </div>
                    </div>

                    <div class="adm-form-group">
                        <label>Public Profile Bio Brief</label>
                        <textarea id="p-bio" rows="3" placeholder="Describe funding capabilities, broker network connections, or industry alignment..." required></textarea>
                    </div>

                    <div class="adm-form-row">
                        <div class="adm-form-group">
                            <label>Specialty Focus Areas (Comma separated)</label>
                            <input type="text" id="p-specialties" placeholder="SBA 7(a), Bridge Loans, Revolving Credit">
                        </div>
                        <div class="adm-form-group">
                            <label>Primary Capital Route Option</label>
                            <input type="text" id="p-route" placeholder="Commercial Asset Backed" required>
                        </div>
                    </div>

                    <div class="adm-form-row">
                        <div class="adm-form-group">
                            <label>Target Audience/Niche</label>
                            <input type="text" id="p-target" placeholder="Property Developers" required>
                        </div>
                        <div class="adm-form-group">
                            <label>Average Deployment Turnaround</label>
                            <input type="text" id="p-close" placeholder="5-10 Business Days" required>
                        </div>
                    </div>

                    <div class="adm-form-row">
                        <div class="adm-form-group">
                            <label>Total Pipeline Directed Target ($)</label>
                            <input type="number" id="p-pipeline" placeholder="42800000" value="0">
                        </div>
                        <div class="adm-form-group">
                            <label>Fast Close Target Guarantee Window</label>
                            <input type="text" id="p-target-close" placeholder="48 Hours" required>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
                        <button type="button" class="adm-btn adm-btn-secondary" id="btn-cancel-modal">Cancel Workspace</button>
                        <button type="submit" class="adm-btn adm-btn-primary">Save Settings Configuration</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // 4. Utility Functions
    function generateAvatar(name) {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'MP';
    }

    function formatCurrency(num) {
        if (num >= 1.0e+6) return `$${(num / 1.0e+6).toFixed(1)}M`;
        if (num >= 1.0e+3) return `$${(num / 1.0e+3).toFixed(1)}K`;
        return `$${num}`;
    }

    function writeLog(message, type = "info") {
        const timestamp = new Date().toLocaleTimeString();
        state.logs.unshift({ timestamp, message, type });
        renderLogs();
    }

    // 5. Data Interactions & Persistence
    function loadStorage() {
        try {
            const data = localStorage.getItem("moonshine_partners_db");
            if (data) {
                state.partners = JSON.parse(data);
                writeLog("Loaded partner configurations from localStorage database cache.", "success");
            } else {
                state.partners = [...DEFAULT_PARTNERS];
                localStorage.setItem("moonshine_partners_db", JSON.stringify(state.partners));
                writeLog("No cache detected. Initialized static system default partners.", "info");
            }
        } catch (e) {
            state.partners = [...DEFAULT_PARTNERS];
            writeLog("Database state extraction error. Loaded default sandbox state.", "warning");
        }
    }

    function persistStorage() {
        localStorage.setItem("moonshine_partners_db", JSON.stringify(state.partners));
        renderJSONOutput();
        renderMetrics();
    }

    // 6. UI Render Core Engines
    function renderMetrics() {
        const total = state.partners.length;
        const pending = state.partners.filter(p => p.status === 'pending').length;
        const pipelineVal = state.partners.reduce((acc, curr) => acc + (Number(curr.pipelineDirected) || 0), 0);

        document.getElementById('metric-total').textContent = total;
        document.getElementById('metric-pending').textContent = pending;
        document.getElementById('metric-pipeline').textContent = formatCurrency(pipelineVal);
    }

    function renderJSONOutput() {
        const cleanedJSON = state.partners.map(p => {
            const copy = { ...p };
            delete copy.updatedAt; // Strip runtime administrative dates for clean production distribution
            return copy;
        });
        const container = document.getElementById('json-block');
        container.innerHTML = `
            <button class="adm-code-copy" id="btn-inner-copy">Copy Payload</button>
            <code style="display:block;">${JSON.stringify(cleanedJSON, null, 4)}</code>
        `;
        document.getElementById('btn-inner-copy').addEventListener('click', copyJSONToClipboard);
    }

    function renderLogs() {
        const consoleEl = document.getElementById('console-output');
        if (!consoleEl) return;
        consoleEl.innerHTML = state.logs.map(log => `
            <div class="adm-console-line ${log.type}">
                [${log.timestamp}] [SYSTEM]: ${log.message}
            </div>
        `).join('');
    }

    function renderPartnerRows() {
        const container = document.getElementById('partner-rows-container');
        if (!container) return;

        const filtered = state.partners.filter(p => {
            // Search Query Filter
            const searchLower = state.searchQuery.toLowerCase();
            const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                                  p.niche.toLowerCase().includes(searchLower) ||
                                  p.specialties.some(s => s.toLowerCase().includes(searchLower));
            
            // Validation Status Filter
            if (state.filterStatus === "all") return matchesSearch;
            return matchesSearch && p.status === state.filterStatus;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--chrome-accent); padding: 40px 0;">No active partner records match search criteria.</td></tr>`;
            return;
        }

        container.innerHTML = filtered.map(p => `
            <tr>
                <td>
                    <div class="adm-partner-meta">
                        <div class="adm-avatar">${p.avatar || generateAvatar(p.name)}</div>
                        <div>
                            <div class="adm-name">${p.name}</div>
                            <div class="adm-niche">${p.niche}</div>
                        </div>
                    </div>
                </td>
                <td style="font-family: var(--font-space); font-size: 0.9rem; font-weight: 500;">
                    ${p.primaryRoute}
                </td>
                <td>
                    <span class="adm-tag ${p.status === 'approved' ? 'adm-tag-verified' : 'adm-tag-pending'}">
                        ${p.status === 'approved' ? 'Verified' : 'Pending'}
                    </span>
                </td>
                <td>
                    <div class="adm-actions-cell">
                        <button class="adm-btn adm-btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="window.MoonshineAdmin.editPartner('${p.id}')">
                            Edit
                        </button>
                        <button class="adm-btn ${p.status === 'approved' ? 'adm-btn-secondary' : 'adm-btn-primary'}" style="padding: 6px 12px; font-size: 0.75rem; border-color: transparent;" onclick="window.MoonshineAdmin.toggleStatus('${p.id}')">
                            ${p.status === 'approved' ? 'Deverify' : 'Verify'}
                        </button>
                        <button class="adm-btn adm-btn-danger" style="padding: 6px 12px; font-size: 0.75rem;" onclick="window.MoonshineAdmin.deletePartner('${p.id}')">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 7. Event Handlers
    function handleSearch(e) {
        state.searchQuery = e.target.value;
        renderPartnerRows();
    }

    function handleFilterChange(e) {
        const btn = e.target.closest('.adm-filter-btn');
        if (!btn) return;

        document.querySelectorAll('.adm-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.filterStatus = btn.getAttribute('data-filter');
        renderPartnerRows();
        writeLog(`Updated system layout directory display validation filter: ${state.filterStatus.toUpperCase()}`, "info");
    }

    function openModal(partnerId = null) {
        const modal = document.getElementById('editor-modal');
        const form = document.getElementById('partner-form');
        const title = document.getElementById('modal-title');
        
        form.reset();
        
        if (partnerId) {
            state.editingId = partnerId;
            title.textContent = "Modify Partner Console Configurations";
            const partner = state.partners.find(p => p.id === partnerId);
            if (partner) {
                document.getElementById('p-name').value = partner.name;
                document.getElementById('p-id').value = partner.id;
                document.getElementById('p-id').disabled = true; // Block mutation of core identity slugs
                document.getElementById('p-niche').value = partner.niche;
                document.getElementById('p-status').value = partner.status;
                document.getElementById('p-bio').value = partner.bio;
                document.getElementById('p-specialties').value = partner.specialties.join(', ');
                document.getElementById('p-route').value = partner.primaryRoute;
                document.getElementById('p-target').value = partner.targetClients;
                document.getElementById('p-close').value = partner.avgCloseTime;
                document.getElementById('p-pipeline').value = partner.pipelineDirected || 0;
                document.getElementById('p-target-close').value = partner.fastCloseTarget || "48 Hours";
            }
        } else {
            state.editingId = null;
            title.textContent = "Create New Partner Portal Space";
            document.getElementById('p-id').disabled = false;
        }

        modal.style.display = 'flex';
    }

    function closeModal() {
        document.getElementById('editor-modal').style.display = 'none';
        state.editingId = null;
    }

    function handleSavePartner(e) {
        e.preventDefault();

        const idValue = document.getElementById('p-id').value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
        const nameValue = document.getElementById('p-name').value.trim();
        const specs = document.getElementById('p-specialties').value.split(',').map(s => s.trim()).filter(Boolean);

        const payload = {
            id: idValue,
            name: nameValue,
            avatar: generateAvatar(nameValue),
            niche: document.getElementById('p-niche').value.trim(),
            status: document.getElementById('p-status').value,
            bio: document.getElementById('p-bio').value.trim(),
            specialties: specs,
            primaryRoute: document.getElementById('p-route').value.trim(),
            targetClients: document.getElementById('p-target').value.trim(),
            avgCloseTime: document.getElementById('p-close').value.trim(),
            pipelineDirected: parseInt(document.getElementById('p-pipeline').value) || 0,
            fastCloseTarget: document.getElementById('p-target-close').value.trim(),
            updatedAt: new Date().toISOString()
        };

        if (state.editingId) {
            // Update Partner Configuration
            const index = state.partners.findIndex(p => p.id === state.editingId);
            if (index !== -1) {
                state.partners[index] = payload;
                writeLog(`Successfully adjusted settings metrics for operator: ${nameValue} (ID: ${idValue})`, "success");
            }
        } else {
            // Check for collision
            if (state.partners.some(p => p.id === idValue)) {
                writeLog(`CRITICAL ERR: Collision encountered. ID '${idValue}' already exists. Use unique slug paths.`, "warning");
                alert(`Error: A partner profile with slug '${idValue}' already exists inside the active configuration.`);
                return;
            }
            state.partners.push(payload);
            writeLog(`Pushed new partner space workspace onto runtime static pipeline: ${nameValue} (ID: ${idValue})`, "success");
        }

        persistStorage();
        renderPartnerRows();
        closeModal();
    }

    function toggleStatus(partnerId) {
        const partner = state.partners.find(p => p.id === partnerId);
        if (partner) {
            partner.status = partner.status === 'approved' ? 'pending' : 'approved';
            writeLog(`Flipped system validation status for [${partner.name}] to: ${partner.status.toUpperCase()}`, "info");
            persistStorage();
            renderPartnerRows();
        }
    }

    function deletePartner(partnerId) {
        const partner = state.partners.find(p => p.id === partnerId);
        if (!partner) return;

        const confirmCheck = confirm(`Confirm complete configuration erasure of Strategist: ${partner.name}? This will sever public paths under /partners/${partner.id}/`);
        if (confirmCheck) {
            state.partners = state.partners.filter(p => p.id !== partnerId);
            writeLog(`Evicted active directory profile configuration: ${partner.name} (ID: ${partnerId})`, "warning");
            persistStorage();
            renderPartnerRows();
        }
    }

    function copyJSONToClipboard() {
        const jsonText = JSON.stringify(state.partners.map(p => {
            const clean = { ...p };
            delete clean.updatedAt;
            return clean;
        }), null, 4);

        navigator.clipboard.writeText(jsonText).then(() => {
            writeLog("System index array JSON payload copied onto local operating system clipboard.", "success");
            const btn = document.getElementById('btn-copy-json');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = "COPIED!";
                setTimeout(() => btn.textContent = originalText, 1500);
            }
        }).catch(err => {
            writeLog("ERR: Local browser block prevented sandbox system clipboard hook access.", "warning");
        });
    }

    function clearConsoleLogs() {
        state.logs = [];
        writeLog("Operator runtime environment diagnostic logs wiped.", "info");
    }

    function triggerMockDeploy() {
        if (state.isDeploying) return;
        state.isDeploying = true;
        const btn = document.getElementById('btn-deploy');
        btn.textContent = "DEPLOYING...";
        btn.style.opacity = '0.5';

        writeLog("Triggering Automated Deploy Hook pipeline...", "info");
        
        setTimeout(() => {
            writeLog("Synchronizing updated state payload static variables [partners.json]...", "info");
        }, 1000);

        setTimeout(() => {
            writeLog("Initializing edge static compile pipeline on cloud Vercel network modules...", "info");
        }, 2200);

        setTimeout(() => {
            writeLog("CDN distribution cache cleared! Dynamic directory listings are now live in public workspace folders.", "success");
            btn.textContent = "DEPLOY BUILD";
            btn.style.opacity = '1';
            state.isDeploying = false;
        }, 3800);
    }

    // 8. Bootstrap Engine Initialization
    function initialize() {
        // Find or create admin application mounting anchor
        let mountPoint = document.getElementById('admin-dashboard');
        if (!mountPoint) {
            // Create full-override wrapper context
            mountPoint = document.createElement('div');
            mountPoint.id = 'admin-dashboard';
            document.body.innerHTML = '';
            document.body.appendChild(mountPoint);
        }

        // Apply Stylesheet Rules
        const styleTag = document.createElement('style');
        styleTag.innerHTML = cssStyles;
        document.head.appendChild(styleTag);

        // Inject App Templates
        mountPoint.innerHTML = dashboardTemplate;

        // Populate Default / Cache Database Indexes
        loadStorage();

        // Hook Main UI Event Handlers
        document.getElementById('btn-add-partner').addEventListener('click', () => openModal());
        document.getElementById('btn-close-modal').addEventListener('click', closeModal);
        document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
        document.getElementById('partner-form').addEventListener('submit', handleSavePartner);
        document.getElementById('inp-search').addEventListener('keyup', handleSearch);
        document.querySelector('.adm-filter-group').addEventListener('click', handleFilterChange);
        document.getElementById('btn-copy-json').addEventListener('click', copyJSONToClipboard);
        document.getElementById('btn-deploy').addEventListener('click', triggerMockDeploy);
        document.getElementById('btn-clear-console').addEventListener('click', clearConsoleLogs);

        // Run Initial Visual Updates
        renderMetrics();
        renderPartnerRows();
        renderJSONOutput();
        writeLog("Moonshine Capital Partners operational index console boot routine success.", "success");
    }

    // Export secure globally-available hooks for DOM dynamic bindings
    window.MoonshineAdmin = {
        editPartner: openModal,
        toggleStatus: toggleStatus,
        deletePartner: deletePartner
    };

    // Initialize on ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();