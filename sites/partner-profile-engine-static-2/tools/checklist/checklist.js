/**
 * Moonshine Partner Profile Engine - Interactive Document Checklist & Client Prep Portal
 * File: tools/checklist/checklist.js
 * 
 * A dynamic, browser-ready component that assists loan applicants in organizing,
 * auditing, and formatting their financial documents before underwriting submission.
 */

(function () {
    // 1. Core Data Models
    const LOAN_TYPES = {
        revenue: {
            title: "Revenue-Based Financing",
            icon: "📊",
            desc: "Optimized for high-volume SaaS, Ecommerce, and transactional business operations.",
            docs: [
                {
                    id: "rev_bank_statements",
                    name: "6 Months Business Bank Statements",
                    rule: "Must upload complete PDF files. Web screenshots, excel exports, or cropped margins are auto-rejected.",
                    format: "PDF",
                    critical: true
                },
                {
                    id: "rev_ytd_pl",
                    name: "Year-to-Date Profit & Loss Statement",
                    rule: "Must be generated within the last 30 days. Preferably exported directly from QuickBooks or Xero.",
                    format: "PDF / XLSX",
                    critical: true
                },
                {
                    id: "rev_tax_return",
                    name: "Most Recent Federal Business Tax Return",
                    rule: "Include all schedules, K-1s, and corporate signing pages. Draft copies will halt underwriting.",
                    format: "PDF",
                    critical: true
                },
                {
                    id: "rev_merchant_processing",
                    name: "3 Months Merchant Processor Statements",
                    rule: "Only required if business operates via Stripe, Shopify, or alternative gateway pipelines.",
                    format: "PDF",
                    critical: false
                }
            ]
        },
        realestate: {
            title: "Real Estate Bridge & Portfolio",
            icon: "🏢",
            desc: "Calibrated for property flips, bridge lines, and asset-based construction models.",
            docs: [
                {
                    id: "re_purchase_contract",
                    name: "Signed Purchase & Sale Agreement",
                    rule: "Must clearly display all executed counters, amendments, and deposit escrow verification notes.",
                    format: "PDF",
                    critical: true
                },
                {
                    id: "re_rent_roll",
                    name: "Current Rent Roll & Lease Portfolios",
                    rule: "Ensure accurate deposit tracking and current lease end-dates for tenant validation.",
                    format: "PDF / XLSX",
                    critical: false
                },
                {
                    id: "re_entity_docs",
                    name: "Entity Formation & Operating Agreements",
                    rule: "Articles of Organization, EIN letters, and Certificate of Good Standing from state authority.",
                    format: "PDF",
                    critical: true
                },
                {
                    id: "re_valuation_report",
                    name: "Prior Appraisal or Property Valuation",
                    rule: "Recent professional valuation matrix or internal capital spreadsheets if available.",
                    format: "PDF",
                    critical: false
                },
                {
                    id: "re_personal_tax",
                    name: "Last 2 Years Personal Tax Returns",
                    rule: "For all major guarantors (>20% equity). Must include all individual schedules.",
                    format: "PDF",
                    critical: true
                }
            ]
        },
        equipment: {
            title: "Equipment & Asset Financing",
            icon: "🚚",
            desc: "Designed for commercial fleets, medical systems, and heavy industrial machinery.",
            docs: [
                {
                    id: "eq_vendor_invoice",
                    name: "Official Vendor Invoice & Quote Specs",
                    rule: "Must display precise itemized valuations, serial specs, and direct wire credentials.",
                    format: "PDF",
                    critical: true
                },
                {
                    id: "eq_bank_statements",
                    name: "3 Months Business Bank Statements",
                    rule: "Clean PDF bank files highlighting operational stability to offset the heavy machinery costs.",
                    format: "PDF",
                    critical: true
                },
                {
                    id: "eq_spec_sheet",
                    name: "Equipment Technical Specifications",
                    rule: "Manufacturer datasheet proving asset life expectancy and utility metrics for depreciation analysis.",
                    format: "PDF",
                    critical: false
                },
                {
                    id: "eq_resolution",
                    name: "Corporate Resolution to Lease",
                    rule: "Executed authorization indicating corporate board consent to bind equipment debt lines.",
                    format: "PDF",
                    critical: true
                }
            ]
        },
        lineofcredit: {
            title: "Secured & Unsecured Line of Credit",
            icon: "🔄",
            desc: "Fluid capital lines built for construction, seasonal payroll, and material acquisitions.",
            docs: [
                {
                    id: "loc_bank_statements",
                    name: "3 Months Business Bank Statements",
                    rule: "Underwriters look for clean balances with no repetitive non-sufficient funds (NSF) activity.",
                    format: "PDF",
                    critical: true
                },
                {
                    id: "loc_ar_aging",
                    name: "Accounts Receivable Aging Summary",
                    rule: "Broken down by 30, 60, and 90-day categories. Highlights capital viability.",
                    format: "PDF / XLSX",
                    critical: true
                },
                {
                    id: "loc_ap_aging",
                    name: "Accounts Payable Aging Summary",
                    rule: "Required alongside AR statements to verify immediate cash balance constraints.",
                    format: "PDF / XLSX",
                    critical: true
                },
                {
                    id: "loc_corporate_tax",
                    name: "Last Year Corporate Tax Return",
                    rule: "Full return ensuring legal and compliant operational filings are fully current.",
                    format: "PDF",
                    critical: true
                }
            ]
        }
    };

    const DOC_CATEGORIES = [
        { value: "BANK_STMT", label: "Bank Statement" },
        { value: "TAX_RETURN", label: "Federal Tax Return" },
        { value: "YTD_PL", label: "Profit & Loss (YTD)" },
        { value: "PURCHASE_AGMT", label: "Purchase & Sale Agreement" },
        { value: "EQUIP_QUOTE", label: "Equipment Quote/Invoice" },
        { value: "CORP_DOCS", label: "Entity / Corporate Docs" },
        { value: "AR_AGING", label: "Accounts Receivable Aging" }
    ];

    // 2. Inject CSS Styles Directly to Guarantee Neo-Brutalist Alignment
    const injectStyles = () => {
        if (document.getElementById("moonshine-checklist-styles")) return;

        const styleEl = document.createElement("style");
        styleEl.id = "moonshine-checklist-styles";
        styleEl.textContent = `
            .mc-wrapper {
                font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
                background-color: var(--bg-black, #08090A);
                color: var(--bone-white, #F5F5F7);
                border: 2px solid var(--chrome-border, #2D3139);
                padding: 2rem;
                position: relative;
                box-shadow: 4px 4px 0px 0px var(--chrome-border, #2D3139);
                max-width: 1000px;
                margin: 0 auto;
            }

            .mc-mono {
                font-family: var(--font-mono, 'JetBrains Mono', monospace);
            }

            .mc-header {
                border-bottom: 2px solid var(--chrome-border, #2D3139);
                padding-bottom: 1.5rem;
                margin-bottom: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                flex-wrap: wrap;
                gap: 1.5rem;
            }

            .mc-title-group h2 {
                font-size: 1.8rem;
                font-weight: 800;
                letter-spacing: -1px;
                margin-bottom: 0.5rem;
                color: var(--bone-white, #F5F5F7);
            }

            .mc-title-group h2 span {
                color: var(--electric-green, #00FF66);
            }

            .mc-title-group p {
                font-size: 0.9rem;
                color: var(--text-muted, #8E96A5);
                max-width: 600px;
            }

            .mc-control-panel {
                background: var(--bg-card, #14161D);
                border: 1px solid var(--chrome-border, #2D3139);
                padding: 1.25rem;
                margin-bottom: 2rem;
                display: flex;
                flex-wrap: wrap;
                gap: 1.5rem;
                justify-content: space-between;
                align-items: center;
            }

            .mc-selector-box {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .mc-selector-label {
                font-family: var(--font-mono, 'JetBrains Mono', monospace);
                font-size: 0.7rem;
                color: var(--text-muted, #8E96A5);
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .mc-select {
                background: var(--bg-black, #08090A);
                border: 1px solid var(--chrome-border-bright, #444B5A);
                color: var(--bone-white, #F5F5F7);
                padding: 0.6rem 1.2rem;
                font-family: var(--font-mono, 'JetBrains Mono', monospace);
                font-size: 0.85rem;
                outline: none;
                cursor: pointer;
                transition: border-color 0.2s;
            }

            .mc-select:focus {
                border-color: var(--electric-green, #00FF66);
            }

            .mc-progress-box {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 0.5rem;
                min-width: 200px;
            }

            .mc-progress-text {
                font-family: var(--font-mono, 'JetBrains Mono', monospace);
                font-size: 0.8rem;
                color: var(--electric-green, #00FF66);
                font-weight: 700;
            }

            .mc-progress-bar-bg {
                width: 100%;
                height: 8px;
                background: var(--graphite-gray, #1C1E24);
                border: 1px solid var(--chrome-border, #2D3139);
                position: relative;
            }

            .mc-progress-bar-fill {
                height: 100%;
                background: var(--electric-green, #00FF66);
                width: 0%;
                transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .mc-grid {
                display: grid;
                grid-template-columns: 1.4fr 1fr;
                gap: 2rem;
            }

            @media (max-width: 850px) {
                .mc-grid {
                    grid-template-columns: 1fr;
                }
            }

            .mc-checklist-card {
                background: var(--bg-matte, #0D0E11);
                border: 2px solid var(--chrome-border, #2D3139);
                padding: 1.5rem;
            }

            .mc-item {
                border-bottom: 1px solid var(--chrome-border, #2D3139);
                padding: 1.25rem 0;
                display: flex;
                gap: 1rem;
                align-items: flex-start;
                transition: background 0.2s;
            }

            .mc-item:last-child {
                border-bottom: none;
            }

            .mc-item.completed {
                opacity: 0.75;
            }

            .mc-checkbox-container {
                position: relative;
                display: block;
                width: 22px;
                height: 22px;
                cursor: pointer;
                user-select: none;
                margin-top: 2px;
            }

            .mc-checkbox-container input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
                height: 0;
                width: 0;
            }

            .mc-checkmark {
                position: absolute;
                top: 0;
                left: 0;
                height: 20px;
                width: 20px;
                background-color: var(--bg-black, #08090A);
                border: 2px solid var(--chrome-border-bright, #444B5A);
                transition: all 0.2s;
            }

            .mc-checkbox-container:hover input ~ .mc-checkmark {
                border-color: var(--electric-green, #00FF66);
            }

            .mc-checkbox-container input:checked ~ .mc-checkmark {
                background-color: var(--electric-green, #00FF66);
                border-color: var(--electric-green, #00FF66);
            }

            .mc-checkmark:after {
                content: "";
                position: absolute;
                display: none;
            }

            .mc-checkbox-container input:checked ~ .mc-checkmark:after {
                display: block;
            }

            .mc-checkbox-container .mc-checkmark:after {
                left: 6px;
                top: 2px;
                width: 4px;
                height: 9px;
                border: solid var(--bg-black, #08090A);
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }

            .mc-item-details {
                flex-grow: 1;
            }

            .mc-item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 1rem;
                margin-bottom: 0.35rem;
            }

            .mc-item-title {
                font-size: 1rem;
                font-weight: 700;
                color: var(--bone-white, #F5F5F7);
                transition: color 0.2s;
            }

            .mc-item.completed .mc-item-title {
                text-decoration: line-through;
                color: var(--text-muted, #8E96A5);
            }

            .mc-tag-group {
                display: flex;
                gap: 0.4rem;
                align-items: center;
            }

            .mc-badge {
                font-family: var(--font-mono, 'JetBrains Mono', monospace);
                font-size: 0.65rem;
                font-weight: 700;
                padding: 1px 6px;
                border: 1px solid var(--chrome-border, #2D3139);
                text-transform: uppercase;
            }

            .mc-badge-critical {
                background: rgba(255, 85, 0, 0.1);
                color: var(--signal-orange, #FF5500);
                border-color: var(--signal-orange, #FF5500);
            }

            .mc-badge-format {
                background: var(--graphite-gray, #1C1E24);
                color: var(--bone-white, #F5F5F7);
            }

            .mc-item-rule {
                font-size: 0.8rem;
                color: var(--text-muted, #8E96A5);
                line-height: 1.4;
            }

            /* Right-hand Toolkit panel */
            .mc-toolkit {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .mc-tool-card {
                background: var(--bg-card, #14161D);
                border: 2px solid var(--chrome-border, #2D3139);
                padding: 1.5rem;
                position: relative;
            }

            .mc-tool-card-title {
                font-family: var(--font-mono, 'JetBrains Mono', monospace);
                font-size: 0.85rem;
                font-weight: 700;
                color: var(--electric-green, #00FF66);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                border-bottom: 1px solid var(--chrome-border, #2D3139);
                padding-bottom: 0.5rem;
            }

            .mc-form-group {
                margin-bottom: 1rem;
            }

            .mc-form-group:last-child {
                margin-bottom: 0;
            }

            .mc-form-group label {
                display: block;
                font-family: var(--font-mono, 'JetBrains Mono', monospace);
                font-size: 0.7rem;
                color: var(--text-muted, #8E96A5);
                text-transform: uppercase;
                margin-bottom: 0.35rem;
            }

            .mc-input {
                width: 100%;
                background: var(--bg-black, #08090A);
                border: 1px solid var(--chrome-border, #2D3139);
                color: var(--bone-white, #F5F5F7);
                padding: 0.5rem 0.75rem;
                font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
                font-size: 0.85rem;
                outline: none;
                box-sizing: border-box;
                transition: border-color 0.2s;
            }

            .mc-input:focus {
                border-color: var(--electric-green, #00FF66);
            }

            .mc-naming-preview {
                background: var(--bg-black, #08090A);
                border: 1px dashed var(--chrome-border-bright, #444B5A);
                padding: 0.75rem;
                margin-top: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }

            .mc-preview-text {
                font-family: var(--font-mono, 'JetBrains Mono', monospace);
                font-size: 0.75rem;
                color: var(--bone-white, #F5F5F7);
                overflow-wrap: break-word;
                word-break: break-all;
                white-space: pre-wrap;
            }

            .mc-copy-btn {
                background: var(--electric-green, #00FF66);
                color: var(--bg-black, #08090A);
                border: none;
                font-family: var(--font-mono, 'JetBrains Mono', monospace);
                font-weight: 700;
                font-size: 0.75rem;
                padding: 0.35rem 0.75rem;
                cursor: pointer;
                transition: transform 0.1s, background-color 0.2s;
                white-space: nowrap;
            }

            .mc-copy-btn:active {
                transform: scale(0.95);
            }

            .mc-copy-btn.copied {
                background: var(--cobalt-blue, #0055FF);
                color: var(--bone-white, #F5F5F7);
            }

            .mc-audit-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .mc-audit-item {
                font-size: 0.8rem;
                color: var(--text-muted, #8E96A5);
                margin-bottom: 0.75rem;
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
            }

            .mc-audit-item:last-child {
                margin-bottom: 0;
            }

            .mc-audit-icon {
                color: var(--signal-orange, #FF5500);
                font-weight: bold;
            }

            .mc-reset-btn {
                background: transparent;
                border: 1px solid var(--chrome-border, #2D3139);
                color: var(--text-muted, #8E96A5);
                font-family: var(--font-mono, 'JetBrains Mono', monospace);
                font-size: 0.75rem;
                padding: 0.4rem 0.8rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .mc-reset-btn:hover {
                border-color: var(--signal-orange, #FF5500);
                color: var(--signal-orange, #FF5500);
                background: rgba(255, 85, 0, 0.05);
            }
        `;
        document.head.appendChild(styleEl);
    };

    // 3. UI Template Builders
    const buildHTML = () => {
        const typesOptions = Object.keys(LOAN_TYPES)
            .map(key => `<option value="${key}">${LOAN_TYPES[key].title}</option>`)
            .join("");

        const catOptions = DOC_CATEGORIES
            .map(cat => `<option value="${cat.value}">${cat.label}</option>`)
            .join("");

        return `
            <div class="mc-wrapper">
                <div class="mc-header">
                    <div class="mc-title-group">
                        <h2>Underwriting <span>Document Auditor</span></h2>
                        <p>Evaluate your document readiness, enforce clean naming structures, and confirm precise standards to secure high-tier capital pipelines instantly.</p>
                    </div>
                    <button class="mc-reset-btn" id="mc-reset">Reset Checklist</button>
                </div>

                <div class="mc-control-panel">
                    <div class="mc-selector-box">
                        <label class="mc-selector-label" for="mc-loan-select">Target Loan Profile</label>
                        <select id="mc-loan-select" class="mc-select">
                            ${typesOptions}
                        </select>
                    </div>
                    <div class="mc-progress-box">
                        <span class="mc-progress-text" id="mc-progress-label">0/0 Documents Prepared (0%)</span>
                        <div class="mc-progress-bar-bg">
                            <div class="mc-progress-bar-fill" id="mc-progress-bar"></div>
                        </div>
                    </div>
                </div>

                <div class="mc-grid">
                    <!-- Left Checklist Column -->
                    <div>
                        <div class="mc-checklist-card">
                            <h3 id="mc-type-title" class="mc-mono" style="font-size: 1.1rem; font-weight:700; margin-bottom:0.25rem; color: var(--electric-green);">Revenue-Based</h3>
                            <p id="mc-type-desc" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">Requirements spec loading...</p>
                            
                            <div id="mc-checklist-items">
                                <!-- Dynamic Items Go Here -->
                            </div>
                        </div>
                    </div>

                    <!-- Right Underwriter Guidelines & Standardizer -->
                    <div class="mc-toolkit">
                        <!-- Tool 1: Clean Naming Convention Tool -->
                        <div class="mc-tool-card">
                            <div class="mc-tool-card-title">
                                <span>🏷️</span> File Standardizer
                            </div>
                            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom:1rem; line-height: 1.4;">
                                Standardize your filenames before uploading to bypass pipeline filtering algorithms.
                            </p>
                            
                            <div class="mc-form-group">
                                <label for="mc-business-name">Business Name</label>
                                <input type="text" id="mc-business-name" class="mc-input" placeholder="e.g. ACME CORP" value="ACME CORP">
                            </div>

                            <div class="mc-form-group">
                                <label for="mc-doc-type">Document Classification</label>
                                <select id="mc-doc-type" class="mc-select" style="width: 100%;">
                                    ${catOptions}
                                </select>
                            </div>

                            <div class="mc-form-group">
                                <label for="mc-doc-period">Reporting Period</label>
                                <input type="text" id="mc-doc-period" class="mc-input" placeholder="e.g. Q3 2023 or DEC23" value="YTD 2023">
                            </div>

                            <div class="mc-naming-preview">
                                <div class="mc-preview-text" id="mc-name-preview">LOADING_FILE_NAME.PDF</div>
                                <button class="mc-copy-btn" id="mc-copy-filename">COPY</button>
                            </div>
                        </div>

                        <!-- Tool 2: Critical Rejection Factors -->
                        <div class="mc-tool-card">
                            <div class="mc-tool-card-title">
                                <span>⚠️</span> Underwriter Red Flags
                            </div>
                            <ul class="mc-audit-list">
                                <li class="mc-audit-item">
                                    <span class="mc-audit-icon">✕</span>
                                    <span><strong>File Security:</strong> Encrypted or password-protected files cannot be reviewed and are auto-rejected.</span>
                                </li>
                                <li class="mc-audit-item">
                                    <span class="mc-audit-icon">✕</span>
                                    <span><strong>Cropped Margins:</strong> Bank statements missing official transaction pages or border details fail visual audits.</span>
                                </li>
                                <li class="mc-audit-item">
                                    <span class="mc-audit-icon">✕</span>
                                    <span><strong>Transaction Gaps:</strong> Even days of gaps across bank cycles trigger secondary entity investigations.</span>
                                </li>
                                <li class="mc-audit-item">
                                    <span class="mc-audit-icon">✕</span>
                                    <span><strong>Draft Taxes:</strong> Unfiled or unsigned corporate tax documents stall secondary credit pulls.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    // 4. Component Controller State & Logic Management
    class ChecklistController {
        constructor(mountPoint) {
            this.container = mountPoint;
            this.activeType = "revenue";
            this.completedItems = {}; // Map of itemId -> boolean

            this.init();
        }

        init() {
            // Load state from LocalStorage if available
            this.loadState();

            // Inject styles & template
            injectStyles();
            this.container.innerHTML = buildHTML();

            // Cache DOM references
            this.loanSelect = document.getElementById("mc-loan-select");
            this.typeTitle = document.getElementById("mc-type-title");
            this.typeDesc = document.getElementById("mc-type-desc");
            this.checklistItemsContainer = document.getElementById("mc-checklist-items");
            this.progressBar = document.getElementById("mc-progress-bar");
            this.progressLabel = document.getElementById("mc-progress-label");
            
            // Name Standardizer components
            this.bizInput = document.getElementById("mc-business-name");
            this.docTypeSelect = document.getElementById("mc-doc-type");
            this.periodInput = document.getElementById("mc-doc-period");
            this.namePreview = document.getElementById("mc-name-preview");
            this.copyBtn = document.getElementById("mc-copy-filename");
            this.resetBtn = document.getElementById("mc-reset");

            // Setup listeners
            this.setupListeners();

            // Initial render
            this.render();
            this.updateNamingPreview();
        }

        loadState() {
            try {
                const storedType = localStorage.getItem("moonshine_checklist_loan_type");
                if (storedType && LOAN_TYPES[storedType]) {
                    this.activeType = storedType;
                }

                const storedProgress = localStorage.getItem("moonshine_checklist_completed");
                if (storedProgress) {
                    this.completedItems = JSON.parse(storedProgress);
                }
            } catch (err) {
                console.error("Failed to recover localStorage state:", err);
            }
        }

        saveState() {
            try {
                localStorage.setItem("moonshine_checklist_loan_type", this.activeType);
                localStorage.setItem("moonshine_checklist_completed", JSON.stringify(this.completedItems));
            } catch (err) {
                console.error("Failed to commit state to localStorage:", err);
            }
        }

        setupListeners() {
            // Change Active Loan Type Profile
            this.loanSelect.addEventListener("change", (e) => {
                this.activeType = e.target.value;
                this.saveState();
                this.render();
            });

            // Live Standardizer Engine Listeners
            const standardizerInputs = [this.bizInput, this.docTypeSelect, this.periodInput];
            standardizerInputs.forEach(el => {
                el.addEventListener("input", () => this.updateNamingPreview());
                el.addEventListener("change", () => this.updateNamingPreview());
            });

            // Copy standardized filename with visual status feedback
            this.copyBtn.addEventListener("click", () => {
                const textToCopy = this.namePreview.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    this.copyBtn.textContent = "COPIED";
                    this.copyBtn.classList.add("copied");
                    
                    // Show global toast alert if parent engine exposes it
                    if (typeof window.triggerToast === "function") {
                        window.triggerToast(`Copied standardized filename: ${textToCopy}`);
                    }

                    setTimeout(() => {
                        this.copyBtn.textContent = "COPY";
                        this.copyBtn.classList.remove("copied");
                    }, 2000);
                }).catch(err => {
                    console.error("Clipboard routing failed:", err);
                });
            });

            // Reset checklist state
            this.resetBtn.addEventListener("click", () => {
                if (confirm("Reset document tracking state back to empty?")) {
                    this.completedItems = {};
                    this.saveState();
                    this.render();
                    if (typeof window.triggerToast === "function") {
                        window.triggerToast("Document audit state cleared successfully.");
                    }
                }
            });
        }

        render() {
            const currentProfile = LOAN_TYPES[this.activeType];
            
            // Set active profile configuration
            this.loanSelect.value = this.activeType;
            this.typeTitle.textContent = `${currentProfile.icon} ${currentProfile.title}`;
            this.typeDesc.textContent = currentProfile.desc;

            // Render Checklist Cards
            this.checklistItemsContainer.innerHTML = "";
            currentProfile.docs.forEach(doc => {
                const isChecked = !!this.completedItems[doc.id];
                const itemDiv = document.createElement("div");
                itemDiv.className = `mc-item ${isChecked ? 'completed' : ''}`;
                itemDiv.id = `mc-node-${doc.id}`;

                itemDiv.innerHTML = `
                    <label class="mc-checkbox-container">
                        <input type="checkbox" id="check-${doc.id}" ${isChecked ? 'checked' : ''}>
                        <span class="mc-checkmark"></span>
                    </label>
                    <div class="mc-item-details">
                        <div class="mc-item-header">
                            <span class="mc-item-title">${doc.name}</span>
                            <div class="mc-tag-group">
                                ${doc.critical ? '<span class="mc-badge mc-badge-critical">Critical</span>' : ''}
                                <span class="mc-badge mc-badge-format">${doc.format}</span>
                            </div>
                        </div>
                        <p class="mc-item-rule">${doc.rule}</p>
                    </div>
                `;

                // Add direct change handler for custom checkboxes
                const checkbox = itemDiv.querySelector(`input[type="checkbox"]`);
                checkbox.addEventListener("change", (e) => {
                    this.completedItems[doc.id] = e.target.checked;
                    this.saveState();
                    
                    if (e.target.checked) {
                        itemDiv.classList.add("completed");
                        if (typeof window.triggerToast === "function") {
                            window.triggerToast(`Prepared: ${doc.name}`);
                        }
                    } else {
                        itemDiv.classList.remove("completed");
                    }
                    this.updateProgress();
                });

                this.checklistItemsContainer.appendChild(itemDiv);
            });

            // Calculate active progress metrics
            this.updateProgress();
        }

        updateProgress() {
            const currentProfile = LOAN_TYPES[this.activeType];
            const total = currentProfile.docs.length;
            let checkedCount = 0;

            currentProfile.docs.forEach(doc => {
                if (this.completedItems[doc.id]) {
                    checkedCount++;
                }
            });

            const percentage = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
            this.progressLabel.textContent = `${checkedCount}/${total} Documents Prepared (${percentage}%)`;
            this.progressBar.style.width = `${percentage}%`;

            if (percentage === 100) {
                this.progressLabel.style.color = "var(--electric-green)";
            } else {
                this.progressLabel.style.color = "";
            }
        }

        updateNamingPreview() {
            // Clean up formatting input strings to run cleanly as uppercase system assets
            const cleanBusiness = this.bizInput.value
                .trim()
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "_")
                .replace(/_+/g, "_");

            const selectedDoc = this.docTypeSelect.value;
            
            const cleanPeriod = this.periodInput.value
                .trim()
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "_")
                .replace(/_+/g, "_");

            const formattedBiz = cleanBusiness || "BIZ";
            const formattedPeriod = cleanPeriod || "PERIOD";

            this.namePreview.textContent = `${formattedBiz}_${selectedDoc}_${formattedPeriod}.PDF`;
        }
    }

    // 5. Instantiation and Export
    window.addEventListener("DOMContentLoaded", () => {
        // Find mounting target or fall back to spawning element in DOM automatically if none exists.
        let mountPoint = document.getElementById("moonshine-checklist-root");
        
        if (!mountPoint) {
            // Locate secondary container blocks from directory layout to insert gracefully
            const backupTargets = [
                document.getElementById("tools"), 
                document.getElementById("profiles"), 
                document.querySelector("main")
            ];
            
            for (let target of backupTargets) {
                if (target) {
                    mountPoint = document.createElement("section");
                    mountPoint.id = "moonshine-checklist-root";
                    mountPoint.style.borderTop = "1px solid var(--chrome-border)";
                    mountPoint.style.padding = "6rem 2rem";
                    mountPoint.className = "container";
                    
                    // Insert before target or append directly inside main container
                    if (target.tagName === "MAIN") {
                        target.appendChild(mountPoint);
                    } else {
                        target.parentNode.insertBefore(mountPoint, target.nextSibling);
                    }
                    break;
                }
            }
        }

        if (mountPoint) {
            window.MoonshineChecklistEngine = new ChecklistController(mountPoint);
        } else {
            console.warn("Moonshine Document Checklist Engine failed to locate a viable mounting node in target index document layout.");
        }
    });
})();