(function () {
    // -----------------------------------------------------------------
    // 1. STYLES INJECTION
    // Append cohesive style rules matching the base theme & white-label rules
    // -----------------------------------------------------------------
    const styles = `
        /* Lender Terminal Theme Variables */
        :root {
            --lender-amber: #f59e0b;
            --lender-glow-amber: rgba(245, 158, 11, 0.15);
            --lender-border: rgba(245, 158, 11, 0.25);
        }

        .white-label-mode {
            --lender-amber: #b45309;
            --lender-glow-amber: rgba(180, 83, 9, 0.05);
            --lender-border: rgba(120, 113, 108, 0.2);
        }

        /* Header Access Button styling */
        .btn-lender-portal {
            background: rgba(245, 158, 11, 0.07);
            border: 1px dashed var(--lender-border);
            padding: 8px 16px;
            border-radius: 8px;
            color: var(--lender-amber);
            font-size: 13px;
            font-weight: 700;
            font-family: var(--font-mono);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition-smooth);
        }

        .btn-lender-portal:hover {
            background: var(--lender-amber);
            color: #fff;
            box-shadow: 0 0 15px var(--lender-glow-amber);
            border-style: solid;
        }

        .btn-lender-portal .pulse-dot {
            width: 8px;
            height: 8px;
            background-color: var(--lender-amber);
            border-radius: 50%;
            animation: pulse-beacon 1.8s infinite;
        }
        @keyframes pulse-beacon {
            0% { transform: scale(0.8); opacity: 0.5; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
            70% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
            100% { transform: scale(0.8); opacity: 0.5; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }

        /* Grid Placement & Layout */
        .lender-panel-card {
            border: 1px solid var(--lender-border) !important;
            background: linear-gradient(180deg, rgba(15, 11, 5, 0.8) 0%, rgba(5, 5, 10, 0.95) 100%) !important;
        }
        .white-label-mode .lender-panel-card {
            background: #ffffff !important;
            border-color: var(--lender-border) !important;
        }

        .lender-grid-layout {
            display: grid;
            grid-template-columns: 1.2fr 1.5fr 1.3fr;
            gap: 20px;
            margin-top: 16px;
        }

        @media (max-width: 1100px) {
            .lender-grid-layout {
                grid-template-columns: 1fr;
            }
        }

        /* Left Column: Dossier Selection & Core KPIs */
        .dossier-card {
            background: rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition: var(--transition-smooth);
        }
        .white-label-mode .dossier-card {
            background: rgba(0,0,0,0.02);
            border-color: rgba(0,0,0,0.05);
        }

        .dossier-header-badge {
            font-family: var(--font-mono);
            font-size: 11px;
            background: rgba(245, 158, 11, 0.1);
            color: var(--lender-amber);
            padding: 2px 8px;
            border-radius: 4px;
            width: fit-content;
        }

        .kpi-compact-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }

        .kpi-compact-box {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 6px;
            padding: 8px;
        }
        .kpi-compact-box .lbl {
            font-size: 10px;
            color: var(--text-muted);
            text-transform: uppercase;
            font-family: var(--font-mono);
        }
        .kpi-compact-box .val {
            font-size: 13px;
            font-weight: 700;
            color: var(--text-primary);
        }

        /* Middle Column: Underwriting Summaries & Term Inputs */
        .underwriting-ai-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 12px;
        }
        .ai-pill {
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(255, 255, 255, 0.02);
            color: var(--text-secondary);
        }
        .ai-pill.positive {
            color: var(--accent-emerald);
            background: rgba(16, 185, 129, 0.08);
            border-color: rgba(16, 185, 129, 0.15);
        }

        .bid-submission-console {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(245, 158, 11, 0.15);
            border-radius: 12px;
            padding: 16px;
            margin-top: 16px;
        }
        .white-label-mode .bid-submission-console {
            background: rgba(0,0,0,0.01);
            border-color: var(--lender-border);
        }

        .bid-input-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 12px;
        }
        .bid-input-group label {
            font-size: 11px;
            font-family: var(--font-mono);
            color: var(--text-secondary);
            text-transform: uppercase;
        }
        .bid-numeric-wrapper {
            display: flex;
            align-items: center;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 6px;
            padding: 4px 8px;
        }
        .white-label-mode .bid-numeric-wrapper {
            background: #fff;
            border-color: rgba(0,0,0,0.15);
        }
        .bid-numeric-wrapper span {
            font-family: var(--font-mono);
            font-size: 13px;
            color: var(--text-muted);
        }
        .bid-numeric-wrapper input {
            background: transparent;
            border: none;
            color: var(--text-primary);
            font-family: var(--font-mono);
            font-weight: 700;
            width: 100%;
            outline: none;
            padding: 4px;
        }

        .btn-submit-bid {
            background: linear-gradient(90deg, #f59e0b, #d97706);
            color: #fff;
            width: 100%;
            border: none;
            border-radius: 8px;
            padding: 10px;
            font-weight: 700;
            cursor: pointer;
            text-transform: uppercase;
            font-size: 12px;
            transition: var(--transition-smooth);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
        }
        .btn-submit-bid:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(245, 158, 11, 0.4);
        }

        /* Right Column: Syndication Ledger */
        .syndication-ledger {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 380px;
            overflow-y: auto;
            padding-right: 4px;
        }

        .ledger-row {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            position: relative;
            transition: var(--transition-smooth);
        }
        .white-label-mode .ledger-row {
            background: rgba(0,0,0,0.01);
            border-color: rgba(0,0,0,0.06);
        }
        .ledger-row.is-user {
            border-color: var(--lender-amber);
            background: rgba(245, 158, 11, 0.05);
        }
        .ledger-row.is-user::before {
            content: "YOUR BID";
            position: absolute;
            top: -6px;
            right: 8px;
            background: var(--lender-amber);
            color: #fff;
            font-family: var(--font-mono);
            font-size: 8px;
            font-weight: 700;
            padding: 2px 5px;
            border-radius: 3px;
        }

        .ledger-row-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ledger-row-header span.institution {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-primary);
        }
        .ledger-row-header span.rank {
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--text-muted);
        }
        .ledger-metrics {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            font-family: var(--font-mono);
            color: var(--text-secondary);
        }
        .ledger-metrics span strong {
            color: var(--text-primary);
        }

        .ledger-covenants-badge {
            font-size: 9px;
            text-transform: uppercase;
            font-family: var(--font-mono);
            color: var(--text-muted);
            border-top: 1px solid rgba(255,255,255,0.03);
            padding-top: 4px;
            margin-top: 4px;
        }
    `;

    // Append standard and custom-lender style tags into HEAD
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // -----------------------------------------------------------------
    // 2. DOSSIER DATASTRUCTURES (Matches exact active borrower profiles)
    // -----------------------------------------------------------------
    const dossiers = {
        saas: {
            id: "DOSSIER-SaaS-9042",
            name: "Anonymized SaaS Scaleup",
            mrr: "$320,000",
            ltv_cac: "4.2x LTV/CAC",
            churn: "1.1% Net Monthly Churn",
            targetAmount: 3500000,
            underwritingSummary: "Outstanding recurring margins verified via programmatic API ledger analysis. Low historical volatility establishes high suitability index for senior debt positions.",
            pros: ["High Gross Profit (>78%)", "Stable Contract Cohorts", "Diversified Customer Base"],
            bids: [
                { institution: "Apex Credit Syndicate", amount: 3200000, apr: 8.5, covenants: "UCC-1 Filing on IP", ranking: 1 },
                { institution: "Aether Capital", amount: 3500000, apr: 9.8, covenants: "Cash Reserve Accounts", ranking: 2 }
            ]
        },
        ecom: {
            id: "DOSSIER-Ecom-1108",
            name: "Anonymized E-Commerce Brand",
            mrr: "$195,000",
            ltv_cac: "2.8x LTV/CAC",
            churn: "8.5x Annual Inventory Turn",
            targetAmount: 1200000,
            underwritingSummary: "Receivables-supported business models call for tight liquidity covenant profiles. Capital reserves are exposed to seasonal freight constraints, which warrant structured repayment schedules.",
            pros: ["Accelerated Inventory Velocity", "High ROAS (>3.1x)", "Immediate Realizable Liquidity"],
            bids: [
                { institution: "Aether VC Debt", amount: 1000000, apr: 10.5, covenants: "Weekly Revenue Sweep", ranking: 1 },
                { institution: "Prism Asset-Backed", amount: 1200000, apr: 11.2, covenants: "Lien on Inventory", ranking: 2 }
            ]
        },
        industrial: {
            id: "DOSSIER-Ind-7741",
            name: "Anonymized Heavy Machinery Inc",
            mrr: "$450,000",
            ltv_cac: "$12.4M Fixed Property Asset Base",
            churn: "1.65x Current DSCR Rating",
            targetAmount: 8500000,
            underwritingSummary: "Substantial physical collateral mitigates debt defaults. Underwriting matrices support long-term amortization schemes with UCC-1 machinery filings as the core covenant layer.",
            pros: ["Substantial Plant Assets", "Institutional Contracts", "Predictable Fixed Backlogs"],
            bids: [
                { institution: "Apex Institutional", amount: 8000000, apr: 6.8, covenants: "UCC-1 Equipment Filings", ranking: 1 },
                { institution: "Prism Private Debt", amount: 8500000, apr: 7.5, covenants: "Key Man Life Insurance", ranking: 2 }
            ]
        },
        realestate: {
            id: "DOSSIER-RE-2290",
            name: "Anonymized Office Portfolio",
            mrr: "$880,000",
            ltv_cac: "62% Debt to Stabilized Appraisal",
            churn: "94% Documented Occupancy Rate",
            targetAmount: 18000000,
            underwritingSummary: "Low localized real estate market volatility allows high debt limits. Fixed-interest-only periods are supported by long-term leases with Grade-A commercial tenants.",
            pros: ["Grade-A Anchored Tenancies", "Fixed Multi-Year Base Rents", "Favorable Submarket Indicators"],
            bids: [
                { institution: "Apex Institutional", amount: 17000000, apr: 5.75, covenants: "1st Position Deed of Trust", ranking: 1 },
                { institution: "Prism Private Debt", amount: 18000000, apr: 6.25, covenants: "Debt Service Coverage Reserve", ranking: 2 }
            ]
        },
        acquisition: {
            id: "DOSSIER-Acq-5531",
            name: "Anonymized Search LBO",
            mrr: "$510,000",
            ltv_cac: "$1.85M Post-Acquisition EBITDA",
            churn: "3.2x Total Leverage Target",
            targetAmount: 6500000,
            underwritingSummary: "Post-merger integration processes represent major risk milestones. Strong historical cash metrics warrant structural escrows and structured amortizations linked to target EBITDA margins.",
            pros: ["Substantial Target Margins", "Committed General Partners", "High Seller Transition Alignment"],
            bids: [
                { institution: "Aether Capital", amount: 6000000, apr: 8.25, covenants: "Cash Sweep Above 3.5x Leverage", ranking: 1 },
                { institution: "Apex Institutional", amount: 6500000, apr: 9.0, covenants: "Quarterly Financial Covenants", ranking: 2 }
            ]
        }
    };

    // -----------------------------------------------------------------
    // 3. SECURE INTERACTIVE REGISTRATION & INJECTION
    // Setup and display DOM structures dynamically in existing application
    // -----------------------------------------------------------------
    const initLenderPortal = () => {
        const appContainer = document.querySelector(".app-container");
        const dashboardGrid = document.querySelector(".dashboard-grid");
        const headerElement = document.querySelector("header");

        if (!appContainer || !dashboardGrid) return;

        // A. Append Secure Lender Access indicator inside main header control elements
        if (headerElement) {
            const controlsArea = headerElement.querySelector(".global-controls");
            if (controlsArea) {
                const headerBtn = document.createElement("button");
                headerBtn.className = "btn-lender-portal";
                headerBtn.innerHTML = `
                    <div class="pulse-dot"></div>
                    <span>Lender Syndicate Terminal</span>
                `;
                headerBtn.onclick = () => {
                    const targetEl = document.getElementById("lender-syndication-terminal");
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                        targetEl.classList.add("analyst-drawer"); // Visual glow pop
                        setTimeout(() => targetEl.classList.remove("analyst-drawer"), 2000);
                    }
                };
                // Insert before white label view toggle button
                controlsArea.insertBefore(headerBtn, controlsArea.lastElementChild);
            }
        }

        // B. Inject the Massive Lender Marketplace Panel inside the main bento-grid (prior to developers drawer)
        const partnerCtaCard = document.querySelector(".partner-cta-card");
        const lenderTerminalHTML = document.createElement("div");
        lenderTerminalHTML.className = "bento-card col-12 lender-panel-card";
        lenderTerminalHTML.id = "lender-syndication-terminal";
        lenderTerminalHTML.innerHTML = `
            <div class="card-header">
                <div class="card-title-group">
                    <h2 style="color: var(--lender-amber);">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="stroke: var(--lender-amber); display: inline; vertical-align: middle; margin-right: 6px;">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Lender Matching &amp; Competitive Syndication Hub
                    </h2>
                    <p>Secured Institutional Syndication Platform // Level-3 Clearance</p>
                </div>
                <span class="badge-status" style="background: rgba(245, 158, 11, 0.15); color: var(--lender-amber)">Syndicate Active</span>
            </div>

            <div class="lender-grid-layout">
                
                <!-- 1. Dossier Metrics Column -->
                <div>
                    <h4 style="font-size: 12px; text-transform: uppercase; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 8px;">Anonymized Dossier</h4>
                    <div class="dossier-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span id="dossierID" class="dossier-header-badge">DOSSIER-SaaS-9042</span>
                            <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);" id="dossierTypeName">SaaS Scaleup</span>
                        </div>
                        <h3 id="dossierBorrowerName" style="font-size: 15px; color: var(--text-primary);">Anonymized SaaS Scaleup</h3>
                        
                        <div class="kpi-compact-grid">
                            <div class="kpi-compact-box">
                                <span class="lbl">Baseline Revenue</span>
                                <div class="val" id="dossierKpiMRR">$320,000</div>
                            </div>
                            <div class="kpi-compact-box">
                                <span class="lbl">Leverage/Health</span>
                                <div class="val" id="dossierKpiLtv">4.2x LTV/CAC</div>
                            </div>
                            <div class="kpi-compact-box">
                                <span class="lbl">Stability Index</span>
                                <div class="val" id="dossierKpiChurn">1.1% Net Churn</div>
                            </div>
                            <div class="kpi-compact-box">
                                <span class="lbl">Target Funding</span>
                                <div class="val" id="dossierKpiTarget">$3,500,000</div>
                            </div>
                        </div>

                        <div style="margin-top: 4px;">
                            <span class="lbl" style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">Underwriting Pros</span>
                            <div id="dossierProsContainer" style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
                                <!-- Pros loaded dynamically -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. AI Underwriting Summary & Bid Placement -->
                <div>
                    <h4 style="font-size: 12px; text-transform: uppercase; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 8px;">Automated Risk Matrix Evaluation</h4>
                    <div class="underwriting-ai-pills">
                        <span class="ai-pill positive">API Ledger Authenticated</span>
                        <span class="ai-pill positive">Fraud Baseline Cleared</span>
                        <span class="ai-pill">Zero Prior Defaults</span>
                    </div>
                    <p id="underwritingAIText" style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
                        Outstanding recurring margins verified via programmatic API ledger analysis. Low historical volatility establishes high suitability index for senior debt positions.
                    </p>

                    <!-- Bid placement Form -->
                    <div class="bid-submission-console">
                        <h4 style="font-size: 12px; color: var(--text-primary); margin-bottom: 10px; font-family: var(--font-mono);">Submit Dynamic Term-Sheet Bid</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div class="bid-input-group">
                                <label>Facility Size</label>
                                <div class="bid-numeric-wrapper">
                                    <span>$</span>
                                    <input type="number" id="bidAmountInput" value="3500000" min="100000" step="50000">
                                </div>
                            </div>
                            <div class="bid-input-group">
                                <label>Target Yield (APR)</label>
                                <div class="bid-numeric-wrapper">
                                    <input type="number" id="bidAprInput" value="8.25" min="2" max="25" step="0.25">
                                    <span>%</span>
                                </div>
                            </div>
                        </div>
                        <div class="bid-input-group">
                            <label>Covenant Requirements</label>
                            <select id="bidCovenantInput" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 6px; color: var(--text-primary); font-family: var(--font-sans); font-size: 12px; outline: none; width: 100%;">
                                <option value="UCC-1 IP & Asset Filings">Standard UCC-1 IP &amp; Asset Filings</option>
                                <option value="Cash Sweep Threshold 15%">Monthly Excess Cash sweeps (15%)</option>
                                <option value="Guarantees + Cash Reserve">Director Guarantees &amp; Reserve Minimums</option>
                                <option value="Unconditional Senior Debt">Unconditional Senior Position Only</option>
                            </select>
                        </div>
                        <button class="btn-submit-bid" id="btnSubmitBidAction">
                            Place Competitive Syndicate Bid
                        </button>
                    </div>
                </div>

                <!-- 3. Dynamic Syndication Bid Ledger -->
                <div>
                    <h4 style="font-size: 12px; text-transform: uppercase; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 8px;">Active Competitive Ledger</h4>
                    <div class="syndication-ledger" id="syndicationLedgerList">
                        <!-- Dynamic Ledger Bids rendered here -->
                    </div>
                </div>

            </div>
        `;

        // Safely insert before the partner CTA block inside dashboard grid or app container
        if (partnerCtaCard) {
            dashboardGrid.insertBefore(lenderTerminalHTML, partnerCtaCard);
        } else {
            dashboardGrid.appendChild(lenderTerminalHTML);
        }

        // -----------------------------------------------------------------
        // 4. SYNCHRONIZATION & INTERACTION LOGIC
        // -----------------------------------------------------------------
        const archetypeDropdown = document.getElementById("archetypeSelect");
        
        // Storage of user-placed bids per dossier key to persist interaction
        const userBids = {};

        // Render the Selected Dossier inside Syndicate Marketplace
        const renderMarketplaceDossier = (key) => {
            const data = dossiers[key];
            if (!data) return;

            // Header information elements
            document.getElementById("dossierID").innerText = data.id;
            document.getElementById("dossierTypeName").innerText = key.toUpperCase();
            document.getElementById("dossierBorrowerName").innerText = data.name;

            // Core KPIs
            document.getElementById("dossierKpiMRR").innerText = data.mrr;
            document.getElementById("dossierKpiLtv").innerText = data.ltv_cac;
            document.getElementById("dossierKpiChurn").innerText = data.churn;
            document.getElementById("dossierKpiTarget").innerText = `$${data.targetAmount.toLocaleString()}`;

            // Underwriting summary text
            document.getElementById("underwritingAIText").innerText = data.underwritingSummary;

            // Standard bidding form inputs
            document.getElementById("bidAmountInput").value = data.targetAmount;
            document.getElementById("bidAprInput").value = (key === 'realestate') ? 6.0 : (key === 'industrial') ? 7.2 : 8.5;

            // Render absolute strengths bullets
            const prosContainer = document.getElementById("dossierProsContainer");
            prosContainer.innerHTML = "";
            data.pros.forEach(pro => {
                const bullet = document.createElement("div");
                bullet.style.cssText = "display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--accent-emerald);";
                bullet.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="stroke: var(--accent-emerald); width: 12px; height: 12px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ${pro}
                `;
                prosContainer.appendChild(bullet);
            });

            // Rebuild competitive bid ledger
            rebuildLedger(key);
        };

        // Render & Sort current bids including dynamic custom bid if present
        const rebuildLedger = (key) => {
            const ledgerList = document.getElementById("syndicationLedgerList");
            if (!ledgerList) return;

            ledgerList.innerHTML = "";
            const currentData = dossiers[key];
            
            // Build temporary ledger list array
            let activeBids = [...currentData.bids];

            // If user has actively bid on this archetype dossier, merge it
            if (userBids[key]) {
                activeBids.push(userBids[key]);
            }

            // Math sorting rule: lower APR and larger Facility amounts rank better!
            activeBids.sort((a, b) => {
                // If APR differs significantly, rate determines rank.
                if (a.apr !== b.apr) {
                    return a.apr - b.apr;
                }
                return b.amount - a.amount;
            });

            // Generate row HTML cards
            activeBids.forEach((bid, idx) => {
                const row = document.createElement("div");
                const isUser = (bid.isUser === true);
                row.className = `ledger-row ${isUser ? 'is-user' : ''}`;
                row.innerHTML = `
                    <div class="ledger-row-header">
                        <span class="institution">${bid.institution}</span>
                        <span class="rank">#${idx + 1} Best Term</span>
                    </div>
                    <div class="ledger-metrics">
                        <span>Limit: <strong>$${bid.amount.toLocaleString()}</strong></span>
                        <span>Rate: <strong>${bid.apr}% APR</strong></span>
                    </div>
                    <div class="ledger-covenants-badge">
                        Covs: ${bid.covenants}
                    </div>
                `;
                ledgerList.appendChild(row);
            });
        };

        // Bid Submission Handler Actions
        const handleBidSubmission = () => {
            const currentKey = archetypeDropdown.value;
            const amount = parseFloat(document.getElementById("bidAmountInput").value);
            const apr = parseFloat(document.getElementById("bidAprInput").value);
            const covenants = document.getElementById("bidCovenantInput").value;

            if (isNaN(amount) || isNaN(apr)) {
                alert("Please declare fully valid facility sizing & APR structures.");
                return;
            }

            // Record dynamic client bid state
            userBids[currentKey] = {
                institution: "Your Private Capital Syndicate",
                amount: amount,
                apr: apr,
                covenants: covenants,
                isUser: true
            };

            // Recalculate ledger list sorting paths
            rebuildLedger(currentKey);

            // Log Trace inside Terminal execute path in main module
            if (window.logTrace) {
                window.logTrace(`Institutional bid posted: $${amount.toLocaleString()} limit at ${apr}% APR under ${currentKey.toUpperCase()} dossiers.`);
            }

            // Trigger structural completion micro-alert
            alert(`Interactive bidding terms posted. Anonymized Match Ledger has recalculated current syndicate rank order.`);
        };

        // Attach submission actions
        document.getElementById("btnSubmitBidAction").addEventListener("click", handleBidSubmission);

        // Synchronize elements when user swaps archetypes
        const hookArchetypeSwapping = () => {
            if (archetypeDropdown) {
                // Capture original function to wrap additional triggers
                const originalLoad = window.loadArchetype;
                window.loadArchetype = (key) => {
                    // Call original calculations
                    if (originalLoad) originalLoad(key);
                    
                    // Sync our lender panel selection
                    renderMarketplaceDossier(key);
                    
                    // Trace action logs
                    if (window.logTrace) {
                        window.logTrace(`Marketplace indexing updated to ${key.toUpperCase()}`);
                    }
                };
            }
        };

        // Bootstrap elements initially
        hookArchetypeSwapping();
        renderMarketplaceDossier(archetypeDropdown ? archetypeDropdown.value : "saas");
    };

    // Initialize once page layout constructs are ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLenderPortal);
    } else {
        initLenderPortal();
    }
})();