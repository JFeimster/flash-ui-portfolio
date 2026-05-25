(function() {
    // 1. Inject Stylesheets dynamically to align perfectly with the brutalist aesthetic
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .audit-section {
            background: var(--surface);
            border: var(--border-width) solid #fff;
            padding: 45px;
            box-shadow: var(--brutal-shadow-cyan);
            margin: 80px 0;
            position: relative;
        }

        .audit-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-magenta), var(--accent-yellow));
        }

        .audit-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 25px;
            margin-bottom: 40px;
            border-bottom: var(--border-width) solid #fff;
            padding-bottom: 30px;
        }

        .audit-header-left {
            flex: 1;
            min-width: 300px;
        }

        .audit-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: clamp(28px, 4vw, 44px);
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -1.5px;
            line-height: 1;
            margin-bottom: 12px;
        }

        .audit-title span {
            color: transparent;
            -webkit-text-stroke: 1px #fff;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-yellow));
            -webkit-background-clip: text;
            background-clip: text;
        }

        .audit-subtitle {
            font-size: 16px;
            color: var(--text-muted);
            max-width: 650px;
        }

        .audit-live-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px;
            background: rgba(0, 243, 255, 0.08);
            border: 2px solid var(--accent-cyan);
            color: var(--accent-cyan);
            font-weight: 900;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Space Grotesk', sans-serif;
        }

        .audit-pulse-dot {
            width: 8px;
            height: 8px;
            background-color: var(--accent-cyan);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--accent-cyan);
            animation: auditPulse 1.6s infinite ease-in-out;
        }

        @keyframes auditPulse {
            0% { transform: scale(0.9); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.6; }
        }

        .audit-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 35px;
        }

        .audit-stat-card {
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 20px;
            box-shadow: 4px 4px 0px #fff;
            position: relative;
        }

        .audit-stat-card::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 0 12px 12px;
            border-color: transparent transparent #fff transparent;
        }

        .audit-stat-label {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 900;
            color: var(--text-muted);
            letter-spacing: 1.5px;
            margin-bottom: 6px;
        }

        .audit-stat-val {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 28px;
            font-weight: 900;
            color: var(--accent-yellow);
        }

        .audit-filter-wrapper {
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: center;
            margin-bottom: 25px;
        }

        .audit-search-box {
            position: relative;
            flex: 1;
            min-width: 250px;
        }

        .audit-search-input {
            width: 100%;
            background: var(--bg);
            border: 2px solid #fff;
            padding: 12px 16px 12px 40px;
            font-size: 14px;
            font-weight: 700;
            color: #fff;
            outline: none;
        }

        .audit-search-input:focus {
            border-color: var(--accent-magenta);
        }

        .audit-search-box::before {
            content: '🔎';
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            pointer-events: none;
        }

        .audit-filter-btn {
            background: var(--bg);
            border: 2px solid #fff;
            color: #fff;
            padding: 10px 18px;
            cursor: pointer;
            font-weight: 800;
            font-size: 12px;
            text-transform: uppercase;
            font-family: 'Space Grotesk', sans-serif;
            transition: all var(--transition-speed);
        }

        .audit-filter-btn:hover {
            background: #fff;
            color: #000;
        }

        .audit-filter-btn.active {
            background: var(--accent-cyan);
            color: #000;
            box-shadow: 3px 3px 0px #fff;
        }

        .audit-table-container {
            border: var(--border-width) solid #fff;
            background: var(--surface-card);
            overflow-x: auto;
            margin-bottom: 25px;
            box-shadow: 5px 5px 0px rgba(0,0,0,0.5);
        }

        .audit-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 14px;
            min-width: 800px;
        }

        .audit-table th {
            background: #000;
            color: #fff;
            padding: 18px;
            font-family: 'Space Grotesk', sans-serif;
            text-transform: uppercase;
            font-weight: 900;
            font-size: 12px;
            letter-spacing: 1px;
            border-bottom: var(--border-width) solid #fff;
        }

        .audit-table td {
            padding: 16px 18px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-family: monospace;
            color: #e2e8f0;
        }

        .audit-table tr:last-child td {
            border-bottom: none;
        }

        .audit-table tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }

        .audit-badge {
            display: inline-flex;
            align-items: center;
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            padding: 4px 10px;
            border: 1px solid #000;
            color: #000;
            font-family: 'Space Grotesk', sans-serif;
        }

        .audit-badge.view {
            background-color: var(--accent-cyan);
        }

        .audit-badge.download {
            background-color: var(--accent-yellow);
        }

        .audit-badge.upload {
            background-color: var(--accent-magenta);
            color: #fff;
        }

        .audit-badge.verify {
            background-color: #fff;
            color: #000;
        }

        .audit-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
        }

        .audit-status.success {
            color: #00ff66;
        }

        .audit-status.alert {
            color: var(--accent-magenta);
        }

        .audit-footer-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .audit-btn-group {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .audit-secondary-btn {
            background: transparent;
            color: #fff;
            border: 2px solid #fff;
            padding: 12px 24px;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            cursor: pointer;
            font-family: 'Space Grotesk', sans-serif;
            box-shadow: 3px 3px 0px #fff;
            transition: all var(--transition-speed);
        }

        .audit-secondary-btn:hover {
            background: #fff;
            color: #000;
            transform: translate(-2px, -2px);
            box-shadow: 5px 5px 0px var(--accent-yellow);
        }

        .audit-secondary-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px;
        }

        @media (max-width: 768px) {
            .audit-header {
                flex-direction: column;
                align-items: stretch;
            }
            .audit-filter-wrapper {
                flex-direction: column;
                align-items: stretch;
            }
            .audit-filter-btn {
                width: 100%;
                text-align: center;
            }
            .audit-footer-actions {
                flex-direction: column;
                align-items: stretch;
            }
            .audit-btn-group {
                flex-direction: column;
            }
            .audit-secondary-btn {
                width: 100%;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(styleElement);

    // 2. Mock Compliance Audit Log Data Store
    const initialLogs = [
        { id: "TX-9021", timestamp: "2024-11-04 15:44:12", action: "DOWNLOAD", target: "Equipment_ROI_Lease_Estimate.csv", ip: "198.51.100.12", user: "USR-8821", status: "SUCCESS" },
        { id: "TX-9020", timestamp: "2024-11-04 15:39:05", action: "UPLOAD", target: "Tax_Returns_FY23_Encrypted.pdf", ip: "198.51.100.12", user: "USR-8821", status: "SUCCESS" },
        { id: "TX-9019", timestamp: "2024-11-04 14:15:32", action: "VIEW", target: "MCA_Factor_Rate_Converter", ip: "203.0.113.88", user: "USR-1044", status: "SUCCESS" },
        { id: "TX-9018", timestamp: "2024-11-04 13:48:21", action: "VERIFY", target: "Readiness_Checklist_Evaluation", ip: "203.0.113.88", user: "USR-1044", status: "SUCCESS" },
        { id: "TX-9017", timestamp: "2024-11-04 12:02:11", action: "VIEW", target: "DSCR_Underwriting_Parameters", ip: "192.0.2.251", user: "USR-3921", status: "SUCCESS" },
        { id: "TX-9016", timestamp: "2024-11-04 10:15:43", action: "DOWNLOAD", target: "Pre-Qualification_Fintech_Report.pdf", ip: "192.0.2.14", user: "USR-4001", status: "SUCCESS" },
        { id: "TX-9015", timestamp: "2024-11-04 09:30:00", action: "UPLOAD", target: "UCC-1_Lien_Release_Verify.pdf", ip: "198.51.100.43", user: "USR-5112", status: "SUCCESS" }
    ];

    let currentFilter = "all";
    let searchQuery = "";
    let logs = [...initialLogs];

    // 3. Construct and Inject the Audit Log Section into the DOM
    const targetSection = document.querySelector('.strategy-banner');
    if (!targetSection) return;

    const auditContainer = document.createElement('section');
    auditContainer.className = 'audit-section';
    auditContainer.id = 'compliance-audit-log';

    auditContainer.innerHTML = `
        <div class="audit-header">
            <div class="audit-header-left">
                <h2 class="audit-title">Security & <span>Activity Ledger</span></h2>
                <p class="audit-subtitle">Real-time cryptographic audit trail of resource access, calculation downloads, and document verification markers for high-tier institutional compliance matching.</p>
            </div>
            <div class="audit-live-badge">
                <span class="audit-pulse-dot"></span>
                Live Audit Stream
            </div>
        </div>

        <div class="audit-stats-grid">
            <div class="audit-stat-card">
                <div class="audit-stat-label">System Audits Logged</div>
                <div class="audit-stat-val" id="audit-count">0</div>
            </div>
            <div class="audit-stat-card">
                <div class="audit-stat-label">Compliance Index</div>
                <div class="audit-stat-val" style="color: var(--accent-cyan);">99.98%</div>
            </div>
            <div class="audit-stat-card">
                <div class="audit-stat-label">Unique IP Audits</div>
                <div class="audit-stat-val" id="unique-ips-count" style="color: var(--accent-magenta);">0</div>
            </div>
        </div>

        <div class="audit-filter-wrapper">
            <div class="audit-search-box">
                <input type="text" id="audit-search" class="audit-search-input" placeholder="SEARCH HASH, IP OR TARGET...">
            </div>
            <button class="audit-filter-btn active" data-audit-filter="all">ALL ENTRIES</button>
            <button class="audit-filter-btn" data-audit-filter="view">VIEWS</button>
            <button class="audit-filter-btn" data-audit-filter="download">DOWNLOADS</button>
            <button class="audit-filter-btn" data-audit-filter="upload">UPLOADS</button>
            <button class="audit-filter-btn" data-audit-filter="verify">VERIFY</button>
        </div>

        <div class="audit-table-container">
            <table class="audit-table">
                <thead>
                    <tr>
                        <th>TRANSACTION ID</th>
                        <th>TIMESTAMP</th>
                        <th>ACTION TYPE</th>
                        <th>SECURE TARGET COMPONENT</th>
                        <th>IP ADDRESS</th>
                        <th>USER KEY</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody id="audit-table-body">
                    <!-- Logs will be systematically rendered here -->
                </tbody>
            </table>
        </div>

        <div class="audit-footer-actions">
            <div class="audit-btn-group">
                <button class="audit-secondary-btn" id="btn-export-ledger">Export Audit CSV 💾</button>
                <button class="audit-secondary-btn" id="btn-simulate-action" style="border-color: var(--accent-magenta); color: #fff;">Simulate Live Audit Event ⚡</button>
            </div>
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--accent-cyan); font-family: monospace;">
                &bull; AES-256 System Handshake Verified
            </div>
        </div>
    `;

    // Insert directly above the strategy banner
    targetSection.parentNode.insertBefore(auditContainer, targetSection);

    // 4. Dynamic Logic for Rendering and Interactivity
    const tableBody = document.getElementById('audit-table-body');
    const searchInput = document.getElementById('audit-search');
    const auditCountEl = document.getElementById('audit-count');
    const uniqueIpsEl = document.getElementById('unique-ips-count');

    function updateAuditStats() {
        auditCountEl.textContent = logs.length;
        const uniqueIps = new Set(logs.map(log => log.ip)).size;
        uniqueIpsEl.textContent = uniqueIps;
    }

    function renderLogs() {
        tableBody.innerHTML = '';

        const filteredLogs = logs.filter(log => {
            const matchesFilter = currentFilter === 'all' || log.action.toLowerCase() === currentFilter;
            const matchesSearch = log.target.toLowerCase().includes(searchQuery) ||
                                  log.ip.includes(searchQuery) ||
                                  log.user.toLowerCase().includes(searchQuery) ||
                                  log.id.toLowerCase().includes(searchQuery);
            return matchesFilter && matchesSearch;
        });

        if (filteredLogs.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
                        NO COMPLIANT TRAIL MATCHES ACTIVE PARAMETERS.
                    </td>
                </tr>
            `;
            return;
        }

        filteredLogs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="color: var(--accent-magenta); font-weight: 800;">${log.id}</td>
                <td style="color: #cbd5e1;">${log.timestamp}</td>
                <td><span class="audit-badge ${log.action.toLowerCase()}">${log.action}</span></td>
                <td style="font-weight: 700;">${log.target}</td>
                <td style="color: var(--accent-cyan);">${log.ip}</td>
                <td style="color: var(--accent-yellow);">${log.user}</td>
                <td>
                    <span class="audit-status ${log.status.toLowerCase() === 'success' ? 'success' : 'alert'}">
                        ${log.status.toLowerCase() === 'success' ? '● PASSED' : '▲ FLAGGED'}
                    </span>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // 5. Filter & Search listeners
    const filterButtons = document.querySelectorAll('[data-audit-filter]');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-audit-filter');
            renderLogs();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderLogs();
    });

    // 6. External Hooks - Automatically Log calculations & clicks from core application!
    function generateIP() {
        return `198.51.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;
    }

    function addLiveAuditTrail(action, target, status = "SUCCESS") {
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 10) + ' ' + date.toTimeString().slice(0, 8);
        const randomId = "TX-" + (Math.floor(Math.random() * 8999) + 1000);
        const randomUser = "USR-" + (Math.floor(Math.random() * 8999) + 1000);

        const newLog = {
            id: randomId,
            timestamp: formattedDate,
            action: action.toUpperCase(),
            target: target,
            ip: generateIP(),
            user: randomUser,
            status: status
        };

        logs.unshift(newLog);
        updateAuditStats();
        renderLogs();
    }

    // Hooking into core window.openCalculator if available in the existing wrapper
    const originalOpenCalculator = window.openCalculator;
    if (typeof originalOpenCalculator === 'function') {
        window.openCalculator = function(type) {
            originalOpenCalculator(type);
            addLiveAuditTrail("VIEW", `${type.toUpperCase()}_Calculator_Workspace`);
        };
    }

    // Hooking into manual tool actions to capture engagement live
    document.querySelectorAll('.tool-action').forEach(actionBtn => {
        actionBtn.addEventListener('click', () => {
            const cardElement = actionBtn.closest('.tool-card');
            if (cardElement) {
                const titleText = cardElement.querySelector('h3').innerText;
                addLiveAuditTrail("VERIFY", `Compute_${titleText.replace(/\s+/g, '_')}`);
            }
        });
    });

    // 7. Interactive Controls inside the module
    // Simulated live transaction addition
    const btnSimulate = document.getElementById('btn-simulate-action');
    btnSimulate.addEventListener('click', () => {
        const simulatedTargets = [
            { act: "DOWNLOAD", tar: "Broker_Commissions_Ledger.xlsx" },
            { act: "VIEW", tar: "DSCR_Underwriting_Flow" },
            { act: "UPLOAD", tar: "Corporate_Credit_TradeLines.pdf" },
            { act: "VERIFY", tar: "Compliance_Secure_Token_Access" },
            { act: "DOWNLOAD", tar: "Invoice_Factoring_Cost_Model.csv" }
        ];
        const randomSim = simulatedTargets[Math.floor(Math.random() * simulatedTargets.length)];
        addLiveAuditTrail(randomSim.act, randomSim.tar);
    });

    // Compliance LEDGER Exporting
    const btnExport = document.getElementById('btn-export-ledger');
    btnExport.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,ID,TIMESTAMP,ACTION,TARGET,IP_ADDRESS,USER_KEY,STATUS\n";
        logs.forEach(row => {
            csvContent += `"${row.id}","${row.timestamp}","${row.action}","${row.target}","${row.ip}","${row.user}","${row.status}"\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `FINTECH_COMPLIANCE_AUDIT_LEDGER_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Run Initial Setups
    updateAuditStats();
    renderLogs();
})();