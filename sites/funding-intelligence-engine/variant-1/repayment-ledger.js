(function () {
    // 1. Inject Dynamic Styles matching the Base Component CSS vars
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
        /* View Toggle Utilities */
        .app-container.ledger-mode .dashboard-grid {
            display: none !important;
        }
        .app-container.ledger-mode .routes-section-title {
            display: none !important;
        }
        .app-container.ledger-mode .col-12:not(.ledger-container) {
            display: none !important;
        }
        
        /* Tab Button Styling */
        .header-tab-group {
            display: flex;
            background: rgba(0, 0, 0, 0.4);
            padding: 4px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            margin-right: 12px;
        }
        .header-tab-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-family: var(--font-sans);
            font-weight: 600;
            font-size: 13px;
            padding: 6px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: var(--transition-smooth);
        }
        .header-tab-btn.active {
            background: var(--bg-surface-elevated);
            color: var(--accent-cyan);
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.05);
        }

        /* Post-Funding Ledger Layout */
        .ledger-container {
            display: none;
            grid-template-columns: repeat(12, 1fr);
            gap: 20px;
            animation: fadeIn 0.4s ease-out;
        }
        .app-container.ledger-mode .ledger-container {
            display: grid !important;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Amortization Table design */
        .table-scroll-wrap {
            width: 100%;
            max-height: 290px;
            overflow-y: auto;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .amort-table {
            width: 100%;
            border-collapse: collapse;
            font-family: var(--font-mono);
            font-size: 12px;
            text-align: left;
        }
        .amort-table th {
            position: sticky;
            top: 0;
            background: rgba(10, 15, 30, 0.95);
            color: var(--text-secondary);
            font-weight: 600;
            padding: 10px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            text-transform: uppercase;
            font-size: 10px;
            z-index: 10;
        }
        .amort-table td {
            padding: 10px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            color: var(--text-primary);
        }
        .amort-table tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }
        .amort-table .paid-pill {
            background: rgba(16, 185, 129, 0.12);
            color: var(--accent-emerald);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .amort-table .pending-pill {
            background: rgba(245, 158, 11, 0.12);
            color: #f59e0b;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }

        /* Auto-Debit toggle container */
        .toggle-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 14px;
            border-radius: 10px;
            margin-top: 16px;
        }
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider-round {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(255, 255, 255, 0.1);
            transition: .3s;
            border-radius: 34px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .slider-round:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }
        input:checked + .slider-round {
            background-color: var(--accent-cyan);
            border-color: var(--accent-cyan);
        }
        input:checked + .slider-round:before {
            transform: translateX(20px);
        }

        /* Document Vault Style overrides */
        .vault-upload-zone {
            border: 1px dashed rgba(124, 58, 237, 0.3);
            background: rgba(124, 58, 237, 0.03);
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: var(--transition-smooth);
            margin-bottom: 16px;
        }
        .vault-upload-zone:hover {
            border-color: var(--accent-prism-violet);
            background: rgba(124, 58, 237, 0.06);
        }
        .vault-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(0, 0, 0, 0.2);
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.04);
            font-size: 12px;
            margin-top: 8px;
        }
        .vault-status-indicator {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-family: var(--font-mono);
        }

        /* Countdown Indicator Gauge */
        .eligibility-progress-box {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%);
            border: 1px solid rgba(16, 185, 129, 0.2);
            border-radius: 12px;
            padding: 18px;
            display: flex;
            gap: 16px;
            align-items: center;
            margin-top: 14px;
        }
        .radial-progress-svg {
            transform: rotate(-90deg);
            width: 70px;
            height: 70px;
        }
        .radial-bg {
            fill: none;
            stroke: rgba(255, 255, 255, 0.05);
            stroke-width: 6px;
        }
        .radial-fill {
            fill: none;
            stroke: var(--accent-emerald);
            stroke-width: 6px;
            stroke-linecap: round;
            stroke-dasharray: 201;
            stroke-dashoffset: 201;
            transition: stroke-dashoffset 1s ease-in-out;
        }
    `;
    document.head.appendChild(styleEl);

    // 2. Identify and setup structural integration points
    const appContainer = document.querySelector(".app-container");
    const globalControls = document.querySelector(".global-controls");
    const archetypeSelect = document.getElementById("archetypeSelect");

    // Create the navigation tabs inside the header
    const tabGroup = document.createElement("div");
    tabGroup.className = "header-tab-group";
    tabGroup.innerHTML = `
        <button class="header-tab-btn active" id="btnPrefunding">Pre-Funding Routing</button>
        <button class="header-tab-btn" id="btnPostfunding">Post-Funding Ledger</button>
    `;
    // Insert before global-controls' switch view button
    globalControls.insertBefore(tabGroup, globalControls.firstChild);

    // Create the Post-Funding Amortization & Ledger Dashboard Container
    const ledgerContainer = document.createElement("div");
    ledgerContainer.className = "col-12 ledger-container";
    ledgerContainer.innerHTML = `
        <!-- Left Column: Active Stream Summary & Auto Debit & Progress -->
        <div class="col-4" style="display: flex; flex-direction: column; gap: 20px;">
            
            <!-- Active Stream Details -->
            <div class="bento-card" style="padding: 24px;">
                <div class="card-header" style="margin-bottom: 16px;">
                    <div class="card-title-group">
                        <h2>Active Debt Facility</h2>
                        <p id="ledger-facility-subtitle">Institutional Bridge Allocation</p>
                    </div>
                    <span class="badge-status badge-status-prime" style="background: rgba(6,182,212,0.1); color: var(--accent-cyan);">ACTIVE FUNDED</span>
                </div>
                
                <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.04); margin-bottom: 16px;">
                    <div style="font-size: 11px; text-transform: uppercase; font-family: var(--font-mono); color: var(--text-muted);">Current Principal Debt</div>
                    <div style="font-size: 28px; font-weight: 800; color: var(--text-primary); margin: 4px 0;" id="ledger-facility-size">$2,500,000</div>
                    <div style="font-size: 11px; color: var(--accent-emerald); font-family: var(--font-mono); display: flex; justify-content: space-between;">
                        <span>Term Rate Yield: <strong id="ledger-facility-apr">8.45%</strong></span>
                        <span id="ledger-facility-maturity">36 Months</span>
                    </div>
                </div>

                <div class="toggle-box">
                    <div>
                        <div style="font-size: 13px; font-weight: 700;">Automatic ACH Debit</div>
                        <div style="font-size: 11px; color: var(--text-muted);">Conforms to NACHA standards</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="autoDebitToggle" checked onchange="toggleAutoDebitLog(this.checked)">
                        <span class="slider-round"></span>
                    </label>
                </div>

                <div style="margin-top: 16px; font-size: 12px; color: var(--text-secondary); line-height: 1.4;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span>Next Debit Date:</span>
                        <strong style="color: var(--text-primary); font-family: var(--font-mono);" id="ledger-next-debit">April 01, 2026</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Routing Bank Node:</span>
                        <strong style="color: var(--accent-cyan); font-family: var(--font-mono);">PLAID-SANDBOX // 2231</strong>
                    </div>
                </div>
            </div>

            <!-- Refinance Eligibility & Performance Countdown -->
            <div class="bento-card" style="padding: 24px;">
                <div class="card-header" style="margin-bottom: 12px;">
                    <div class="card-title-group">
                        <h2>Refinance Eligibility Matrix</h2>
                        <p>Historical Performance Underwriting</p>
                    </div>
                </div>
                <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
                    Achieving timely payment compliance unlocks automatic transition options to Tier-1 Prime lending protocols with variable rate step-downs of <strong>-1.50% APR</strong>.
                </p>

                <div class="eligibility-progress-box">
                    <svg class="radial-progress-svg">
                        <circle class="radial-bg" cx="35" cy="35" r="32"></circle>
                        <circle class="radial-fill" id="eligibilityRadial" cx="35" cy="35" r="32"></circle>
                    </svg>
                    <div>
                        <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">Payment Performance Track</div>
                        <div style="font-size: 16px; font-weight: 700; color: var(--text-primary);" id="eligibilityFraction">7 of 12 Timely Debits</div>
                        <div style="font-size: 11px; color: var(--accent-emerald); font-weight:600;" id="eligibilityRemaining">5 remaining periods to unlock</div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Middle Column: Dynamic Amortization Schedule & Prepayment slider -->
        <div class="col-8" style="display: flex; flex-direction: column; gap: 20px;">
            
            <div class="bento-card" style="padding: 24px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div class="card-header" style="margin-bottom: 12px;">
                        <div class="card-title-group">
                            <h2>Dynamic Facility Amortization Ledger</h2>
                            <p>Real-time Yield Calculation &amp; Prepayment Override</p>
                        </div>
                        <span id="interestSavedBadge" class="badge-status badge-status-prime" style="background: rgba(16,185,129,0.1); color: var(--accent-emerald); border-color: rgba(16,185,129,0.2);">Interest Saved: $0.00</span>
                    </div>

                    <!-- Dynamic Prepayment Slider -->
                    <div style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 14px 20px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 6px;">
                            <span>Monthly Prepayment Premium Principal Override</span>
                            <span id="prepayValueDisplay" style="color: var(--accent-cyan); font-weight:700;">$0.00 / mo</span>
                        </div>
                        <input type="range" class="custom-range" id="sliderPrepay" min="0" max="25000" step="1000" value="0" style="background: rgba(255,255,255,0.08); height:6px;">
                        <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-top: 4px;">
                            <span>Standard Minimum Due Only</span>
                            <span>+$25,000 Accelerated Principal</span>
                        </div>
                    </div>

                    <!-- Amortization Table Scroll Wrap -->
                    <div class="table-scroll-wrap">
                        <table class="amort-table">
                            <thead>
                                <tr>
                                    <th>Pmt #</th>
                                    <th>Due Date</th>
                                    <th>Principal Pmt</th>
                                    <th>Interest Paid</th>
                                    <th>Extra Principal</th>
                                    <th>Remaining Debt</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="amortTableBody">
                                <!-- Dynamically generated rows -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px;">
                    <div class="metric-matrix-card" style="padding: 10px;">
                        <span class="lbl">Lifetime Interest</span>
                        <div class="val" id="totalInterestVal" style="font-size: 15px;">$0.00</div>
                    </div>
                    <div class="metric-matrix-card" style="padding: 10px;">
                        <span class="lbl">Effective WACC</span>
                        <div class="val" id="effectiveWaccVal" style="font-size: 15px;">0.00%</div>
                    </div>
                    <div class="metric-matrix-card" style="padding: 10px;">
                        <span class="lbl">Total Term Cost</span>
                        <div class="val" id="totalPaymentVal" style="font-size: 15px;">$0.00</div>
                    </div>
                </div>
            </div>

            <!-- Bottom: Secure Covenant Document Vault -->
            <div class="bento-card" style="padding: 24px;">
                <div class="card-header" style="margin-bottom: 12px;">
                    <div class="card-title-group">
                        <h2>Secure Compliance Covenant Vault</h2>
                        <p>Underwriting Audits &amp; Monthly Deliverables Conformance</p>
                    </div>
                    <span class="badge-status" style="background: rgba(124, 58, 237, 0.15); color: var(--accent-prism-violet)">Secure AES-256 SEC Sandbox</span>
                </div>

                <div style="display: grid; grid-template-columns: 1.2fr 2fr; gap: 20px;">
                    <div class="vault-upload-zone" onclick="simulateVaultUpload()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:36px; height:36px; stroke: var(--accent-prism-violet); margin-bottom:8px; display:inline-block;">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <div style="font-size: 13px; font-weight:700; color: var(--text-primary);">Drag &amp; Drop Financials</div>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top:4px;">Supports secure PDF/JSON nodes</div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap: 8px;">
                        <div class="vault-item">
                            <span style="font-weight:600;">Monthly Ledger Statement (April 2026)</span>
                            <div class="vault-status-indicator" style="color: var(--accent-rose);">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                PENDING ACTION
                            </div>
                        </div>
                        <div class="vault-item">
                            <span style="font-weight:600;">SaaS MRR Integration Endpoint Audit</span>
                            <div class="vault-status-indicator" style="color: var(--accent-emerald);">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                COMPLIANT AUTO-VERIFIED
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    `;

    // Append our Ledger view right before the strict compliance footer
    const footerElement = document.querySelector("footer");
    appContainer.insertBefore(ledgerContainer, footerElement);

    // 3. Tab Switching Interactive Mechanism
    const btnPrefunding = document.getElementById("btnPrefunding");
    const btnPostfunding = document.getElementById("btnPostfunding");

    btnPrefunding.addEventListener("click", () => {
        btnPrefunding.classList.add("active");
        btnPostfunding.classList.remove("active");
        appContainer.classList.remove("ledger-mode");
        logLedgerTrace("Navigating back to Allocation Pre-Funding Engine View");
    });

    btnPostfunding.addEventListener("click", () => {
        btnPostfunding.classList.add("active");
        btnPrefunding.classList.remove("active");
        appContainer.classList.add("ledger-mode");
        // Trigger initial calculations
        calculateDynamicLedger();
        logLedgerTrace("Accessing Active Repayment Terminals & Live Audit Ledgers...");
    });

    // 4. Dynamic Live Amortization Logic Engine
    const prepaySlider = document.getElementById("sliderPrepay");
    const prepayValueDisplay = document.getElementById("prepayValueDisplay");

    prepaySlider.addEventListener("input", function() {
        const value = parseFloat(this.value);
        prepayValueDisplay.innerText = value === 0 ? "$0.00 / mo" : `+$${value.toLocaleString()} / mo`;
        calculateDynamicLedger();
    });

    // Run dynamic recalculations matching selected borrowers parameters
    function calculateDynamicLedger() {
        const archetype = archetypeSelect.value || "saas";
        const baseSpec = borrowerArchetypes[archetype];

        // Format raw metrics
        const principal = parseFloat(baseSpec.optAmount.replace(/[^0-9.]/g, ""));
        const rateRange = baseSpec.targetApr.split(" - ");
        // Midpoint APR calculation
        const apr = (parseFloat(rateRange[0]) + parseFloat(rateRange[1])) / 2 / 100;
        const totalMonths = parseInt(baseSpec.maturity.split(" ")[0]);

        const monthlyPrepayment = parseFloat(prepaySlider.value) || 0;

        // Populate left Summary card based on dynamic archetype profiles
        document.getElementById("ledger-facility-subtitle").innerText = `${baseSpec.rating} // Match Pathway`;
        document.getElementById("ledger-facility-size").innerText = baseSpec.optAmount;
        document.getElementById("ledger-facility-apr").innerText = `${(apr * 100).toFixed(2)}% APR`;
        document.getElementById("ledger-facility-maturity").innerText = baseSpec.maturity;

        // Calculate dynamic amortization table
        const amortTableBody = document.getElementById("amortTableBody");
        amortTableBody.innerHTML = "";

        let remainingBalance = principal;
        let monthlyInterestRate = apr / 12;
        // Standard Equated Monthly Installment (EMI) Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
        let standardEMI = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) / 
                            (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

        let totalInterestPaid = 0;
        let monthCounter = 0;
        let today = new Date();
        
        let hasSavedMonths = false;
        let standardTotalInterest = 0;

        // Calculate theoretical standard total interest for standard yield comparisons
        let tempBalance = principal;
        for (let i = 0; i < totalMonths; i++) {
            let tempInt = tempBalance * monthlyInterestRate;
            let tempPrin = standardEMI - tempInt;
            if (tempBalance < tempPrin) {
                standardTotalInterest += tempInt;
                break;
            }
            standardTotalInterest += tempInt;
            tempBalance -= tempPrin;
        }

        while (remainingBalance > 0.01 && monthCounter < 120) {
            monthCounter++;
            let interestPaid = remainingBalance * monthlyInterestRate;
            let principalPaid = standardEMI - interestPaid;

            // Apply accelerated prepayments
            let actualExtra = Math.min(monthlyPrepayment, remainingBalance - principalPaid);
            let actualPrincipalPaid = Math.min(principalPaid + actualExtra, remainingBalance);

            totalInterestPaid += interestPaid;
            remainingBalance -= actualPrincipalPaid;

            // Construct table row visual
            const row = document.createElement("tr");
            
            // Format dates moving forward
            let dueDate = new Date(today.getFullYear(), today.getMonth() + monthCounter, 1);
            let formattedDate = dueDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

            // Determine historical simulation status
            let statusMarkup = "";
            if (monthCounter <= 7) {
                statusMarkup = `<span class="paid-pill">AUTO-DEBIT COMPLIANT</span>`;
            } else {
                statusMarkup = `<span class="pending-pill">SCHEDULED</span>`;
            }

            row.innerHTML = `
                <td>${monthCounter}</td>
                <td>${formattedDate}</td>
                <td>$${(actualPrincipalPaid - actualExtra).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>$${interestPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td style="color: ${actualExtra > 0 ? "var(--accent-cyan)" : "var(--text-muted)"}">$${actualExtra.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td style="font-weight: 700;">$${Math.max(0, remainingBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>${statusMarkup}</td>
            `;

            amortTableBody.appendChild(row);
        }

        // Calculations for Dashboard Metric displays
        const interestSaved = Math.max(0, standardTotalInterest - totalInterestPaid);
        const totalTermCost = principal + totalInterestPaid;
        const effectiveWacc = (totalInterestPaid / principal) * (12 / monthCounter) * 100;

        document.getElementById("interestSavedBadge").innerText = `Accelerated Savings: $${interestSaved.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
        document.getElementById("totalInterestVal").innerText = `$${totalInterestPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById("effectiveWaccVal").innerText = `${effectiveWacc.toFixed(2)}%`;
        document.getElementById("totalPaymentVal").innerText = `$${totalTermCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

        // Refinance Eligibility Gauge Progress Updater
        // Compute payments completed versus target payments (e.g. 7 out of 12)
        const progressPercent = Math.min(100, (7 / 12) * 100);
        // Circle perimeter is 2 * PI * r (r=32) approx 201
        const strokeOffset = 201 - (201 * progressPercent) / 100;
        document.getElementById("eligibilityRadial").style.strokeDashoffset = strokeOffset;
    }

    // 5. Simulated Actions and Log Integration
    window.toggleAutoDebitLog = function(status) {
        if (status) {
            logLedgerTrace("ACH secure direct automated connection validated: Plaid status Active.");
        } else {
            logLedgerTrace("ACH automated systems decoupled. Alert: Account switching to self-pay portfolio schedules.", "var(--accent-rose)");
        }
    };

    window.simulateVaultUpload = function() {
        logLedgerTrace("Secure payload drag detected. Processing validation inside local browser environment...");
        setTimeout(() => {
            logLedgerTrace("Compliance package dynamic execution verification finished: Standard SEC file locked successfully.");
            alert("Sandbox File Upload Simulated successfully!\nPayload analyzed, structured validation metadata locked.");
        }, 1200);
    };

    function logLedgerTrace(message, hexColor) {
        // Safe access to primary telemetry terminal elements
        const term = document.getElementById("telemetryTerminal");
        if (!term) return;

        const timestamp = new Date().toLocaleTimeString();
        const line = document.createElement("div");
        line.className = "terminal-line";
        
        let customStyling = hexColor ? `style="color: ${hexColor}"` : 'class="accent"';
        line.innerHTML = `
            <span class="stamp">[${timestamp}]</span>
            <span ${customStyling}>${message}</span>
        `;
        term.appendChild(line);
        term.scrollTop = term.scrollHeight;
    }

    // Connect into main configuration change callbacks dynamically
    const originalOnChange = archetypeSelect.onchange;
    archetypeSelect.onchange = function(e) {
        if (typeof originalOnChange === 'function') {
            originalOnChange.call(this, e);
        }
        // Force update the ledger UI whenever a borrower archetype is switched
        calculateDynamicLedger();
    };

})();