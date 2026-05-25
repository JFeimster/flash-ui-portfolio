document.addEventListener('DOMContentLoaded', () => {
    injectAuditTrailCard();
    injectAuditTrailStyles();
});

// Dynamic Injection of the Audit Trail Utility Card in the Tools Grid
function injectAuditTrailCard() {
    const toolGrid = document.getElementById('toolGrid');
    if (!toolGrid) return;

    const card = document.createElement('div');
    card.className = 'tool-card';
    card.setAttribute('data-category', 'broker');
    card.innerHTML = `
        <div class="tool-icon">📜</div>
        <span class="tool-tag" style="background: var(--accent-cyan); color: #000;">Broker</span>
        <h3>Submission Audit Trail</h3>
        <p>Comprehensive transaction log showcasing document uploads, access histories, verification checkpoints, and multi-version updates.</p>
        <div class="tool-action" onclick="openAuditTrail()">View Ledger ↗</div>
    `;
    
    // Insert as the first element or append to the grid
    toolGrid.insertBefore(card, toolGrid.firstChild);
}

// Custom CSS styles optimized for Neo-Brutalist Ledger Design
function injectAuditTrailStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Audit Trail Specific Styling */
        .audit-control-header {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px dashed rgba(255, 255, 255, 0.15);
        }
        .audit-filter-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .audit-sub-btn {
            background: var(--surface-card);
            border: 2px solid #fff;
            color: #fff;
            padding: 8px 14px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            cursor: pointer;
            font-family: 'Space Grotesk', sans-serif;
            transition: all 0.15s;
        }
        .audit-sub-btn:hover, .audit-sub-btn.active {
            background: var(--accent-cyan);
            color: #000;
            box-shadow: 2px 2px 0px #fff;
        }
        .audit-sub-btn.active-magenta {
            background: var(--accent-magenta);
            color: #fff;
            box-shadow: 2px 2px 0px #fff;
        }
        .audit-sub-btn.active-yellow {
            background: var(--accent-yellow);
            color: #000;
            box-shadow: 2px 2px 0px #fff;
        }
        
        .timeline-container {
            position: relative;
            margin-top: 20px;
            padding-left: 20px;
            border-left: 3px dashed rgba(255, 255, 255, 0.2);
        }
        
        .timeline-item {
            position: relative;
            background: var(--surface-card);
            border: 2px solid #fff;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 4px 4px 0px rgba(255, 255, 255, 0.1);
            transition: all 0.2s;
        }
        .timeline-item:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px var(--accent-cyan);
        }
        
        .timeline-marker {
            position: absolute;
            left: -32px;
            top: 24px;
            width: 20px;
            height: 20px;
            background: var(--bg);
            border: 3px solid #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
        }
        .timeline-item.upload .timeline-marker { background: var(--accent-cyan); }
        .timeline-item.security .timeline-marker { background: var(--accent-yellow); }
        .timeline-item.access .timeline-marker { background: var(--accent-magenta); }
        .timeline-item.verification .timeline-marker { background: #00ff66; }
        
        .timeline-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 12px;
            font-size: 12px;
            font-weight: 800;
            font-family: 'Space Grotesk', sans-serif;
        }
        
        .timeline-tag {
            padding: 2px 8px;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 900;
            border: 1px solid #fff;
        }
        
        .timeline-title {
            font-size: 18px;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 8px;
            color: #fff;
            font-family: 'Space Grotesk', sans-serif;
            letter-spacing: -0.5px;
        }
        
        .timeline-desc {
            font-size: 14px;
            color: var(--text-muted);
            line-height: 1.5;
            margin-bottom: 15px;
        }
        
        .timeline-hash-row {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 12px;
            font-family: monospace;
            font-size: 11px;
            color: var(--accent-cyan);
            word-break: break-all;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .timeline-badge {
            font-size: 11px;
            font-weight: 900;
            background: #fff;
            color: #000;
            padding: 2px 6px;
            text-transform: uppercase;
        }
        
        .live-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--accent-yellow);
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 15px;
        }
        .pulse-dot {
            width: 8px;
            height: 8px;
            background: var(--accent-yellow);
            border-radius: 50%;
            animation: pulse-glow 1.5s infinite;
        }
        @keyframes pulse-glow {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.5; }
        }
        
        .add-simulation-banner {
            border: 2px solid var(--accent-magenta);
            background: rgba(255, 0, 85, 0.05);
            padding: 15px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
        }
    `;
    document.head.appendChild(style);
}

// Master Ledger Seed Data
const auditLedgerDatabase = [
    {
        id: "TXN-7402",
        timestamp: "2024-11-20 16:45:12",
        operator: "Sarah Jenkins (Broker #402)",
        action: "UPLOAD",
        category: "upload",
        target: "dscr_workbook_v3.xlsx",
        status: "SUCCESS",
        details: "Automated underwriting parse checks cleared. File successfully committed to repository cluster.",
        hash: "SHA256: 8f4c281e05d92e54bb3f721c56da93a29cbffb1e16c905b980aa8a6efb011d82"
    },
    {
        id: "TXN-7399",
        timestamp: "2024-11-20 14:12:05",
        operator: "Integrity Firewall System",
        action: "SECURITY SCAN",
        category: "security",
        target: "tax_return_2023.pdf",
        status: "PASSED",
        details: "Anti-malware sandbox scanning executed. Complete digital signature validates correct owner origin.",
        hash: "SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    {
        id: "TXN-7384",
        timestamp: "2024-11-19 11:30:44",
        operator: "Marcus Vance (Underwriting Dir)",
        action: "ACCESS VIEW",
        category: "access",
        target: "bank_statements_Q3.pdf",
        status: "ACCESSED",
        details: "Retrieved decryption tokens for compliance review. Access logged via secure gateway IP: 198.51.100.12.",
        hash: "AUDIT ID: ACCESS-TOKEN-40291-A"
    },
    {
        id: "TXN-7377",
        timestamp: "2024-11-19 09:15:00",
        operator: "Sarah Jenkins (Broker #402)",
        action: "VERSION UPGRADE",
        category: "upload",
        target: "dscr_workbook_v2.xlsx → dscr_workbook_v3.xlsx",
        status: "REPLACED",
        details: "Updated workbook parameters to match revised commercial leases. Previous transaction record preserved.",
        hash: "ARCHIVE HASH: d6a1b24c89012fefc34001a4e526bbffb1e16c905b980aa8e"
    },
    {
        id: "TXN-7361",
        timestamp: "2024-11-18 16:02:11",
        operator: "Commercial Bureau Engine",
        action: "VERIFICATION",
        category: "verification",
        target: "Secretary of State Certificate",
        status: "APPROVED",
        details: "Verified live entity status index with official state register databases. No liens recorded.",
        hash: "RECORD REF: SOS-CA-2024-81920A"
    },
    {
        id: "TXN-7344",
        timestamp: "2024-11-17 10:24:59",
        operator: "Marcus Vance (Underwriting Dir)",
        action: "ACCESS VIEW",
        category: "access",
        target: "merchant_processing_12M.csv",
        status: "ACCESSED",
        details: "Parsed transactional batch files to calculate daily credit card processing volumes.",
        hash: "AUDIT ID: ACCESS-TOKEN-40118-Z"
    }
];

let activeAuditFilter = 'all';
let currentLedgerData = [...auditLedgerDatabase];

// Open and Mount the dynamic timeline interface
function openAuditTrail() {
    const overlay = document.getElementById('calcOverlay');
    const backdrop = document.getElementById('backdrop');
    const calcName = document.getElementById('calcName');
    const calcBody = document.getElementById('calcBody');

    if (!overlay || !backdrop || !calcName || !calcBody) return;

    overlay.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    calcName.innerText = "Submission Audit Trail & History";
    
    calcBody.innerHTML = `
        <div class="live-indicator">
            <span class="pulse-dot"></span> SECURE TRANSACTION LEDGER LIVE
        </div>
        
        <div class="add-simulation-banner">
            <div style="max-width: 320px;">
                <h4 style="font-weight: 900; text-transform: uppercase; font-size: 13px; color: var(--accent-magenta);">Simulation Hub</h4>
                <p style="font-size: 11px; color: var(--text-muted); margin: 0;">Trigger visual event simulations to demonstrate real-time ledger response vectors.</p>
            </div>
            <button class="audit-sub-btn active-magenta" onclick="simulateNewEvent()">Simulate Upload Event ⚡</button>
        </div>

        <div class="audit-control-header">
            <label class="calc-label" style="margin: 0;">Search Ledger Log</label>
            <input type="text" id="auditSearch" class="calc-input" placeholder="Filter by operator, file, or hash..." oninput="renderAuditLedger()">
            
            <div class="audit-filter-row">
                <button class="audit-sub-btn active" id="btn-audit-all" onclick="filterAudit('all')">All Events</button>
                <button class="audit-sub-btn" id="btn-audit-upload" onclick="filterAudit('upload')">Uploads</button>
                <button class="audit-sub-btn" id="btn-audit-security" onclick="filterAudit('security')">Security Scan</button>
                <button class="audit-sub-btn" id="btn-audit-access" onclick="filterAudit('access')">Access Logs</button>
                <button class="audit-sub-btn" id="btn-audit-verification" onclick="filterAudit('verification')">Verifications</button>
            </div>
        </div>

        <div class="timeline-container" id="ledgerTimeline">
            <!-- Timeline elements will render here -->
        </div>
    `;

    renderAuditLedger();
}

// Logic to filter the active logs
function filterAudit(category) {
    activeAuditFilter = category;
    
    // Toggle active classes on filter buttons
    const buttons = document.querySelectorAll('.audit-filter-row .audit-sub-btn');
    buttons.forEach(btn => btn.classList.remove('active', 'active-magenta', 'active-yellow'));

    const activeBtn = document.getElementById(`btn-audit-${category}`);
    if (activeBtn) {
        if (category === 'upload') activeBtn.classList.add('active');
        else if (category === 'access') activeBtn.classList.add('active-magenta');
        else if (category === 'security') activeBtn.classList.add('active-yellow');
        else activeBtn.classList.add('active');
    }

    renderAuditLedger();
}

// Render the timeline ledger dynamically
function renderAuditLedger() {
    const timeline = document.getElementById('ledgerTimeline');
    const searchVal = document.getElementById('auditSearch')?.value.toLowerCase() || '';
    if (!timeline) return;

    let itemsHtml = '';

    const filtered = currentLedgerData.filter(item => {
        const matchesCategory = (activeAuditFilter === 'all' || item.category === activeAuditFilter);
        const matchesSearch = (
            item.operator.toLowerCase().includes(searchVal) ||
            item.target.toLowerCase().includes(searchVal) ||
            item.details.toLowerCase().includes(searchVal) ||
            item.hash.toLowerCase().includes(searchVal)
        );
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        timeline.innerHTML = `
            <div style="text-align: center; padding: 40px 0; color: var(--text-muted); font-weight: 800; font-family: 'Space Grotesk', sans-serif;">
                ❌ NO LEDGER ITEMS MATCH SEARCH PARAMS
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        let tagColor = 'var(--accent-cyan)';
        if (item.category === 'security') tagColor = 'var(--accent-yellow)';
        if (item.category === 'access') tagColor = 'var(--accent-magenta)';
        if (item.category === 'verification') tagColor = '#00ff66';

        itemsHtml += `
            <div class="timeline-item ${item.category}">
                <div class="timeline-marker"></div>
                <div class="timeline-meta">
                    <span style="color: ${tagColor};">${item.timestamp}</span>
                    <span class="timeline-tag" style="background: ${tagColor}; color: #000; border-color: ${tagColor}">${item.action}</span>
                </div>
                <div class="timeline-title">${item.target}</div>
                <div class="timeline-desc">
                    <strong>Actor:</strong> ${item.operator}<br>
                    <strong>Details:</strong> ${item.details}
                </div>
                <div class="timeline-hash-row">
                    <span>${item.hash}</span>
                    <span class="timeline-badge">${item.status}</span>
                </div>
            </div>
        `;
    });

    timeline.innerHTML = itemsHtml;
}

// Simulate new events happening in real-time
function simulateNewEvent() {
    const randomFunderNames = ["Marcus Vance (Underwriter)", "Compliance Bot", "Sarah Jenkins (Broker #402)", "Security Auditor v4"];
    const randomActionFiles = ["merchant_payout_history.csv", "kyc_regulatory_proof.pdf", "equipment_quote_v2.pdf", "commercial_lease_agreement.docx"];
    const hashes = [
        "SHA256: 2ac81ff48e24c2d3aef667df924e2b0c112d832d2c1e4c",
        "SHA256: bc229e108dca4a22c54ee9247ae3334ca29ffc129e1f2b",
        "SHA256: f1b91bc44c110294da1e6c388274712ca27be3a985a9ee"
    ];

    const randomName = randomFunderNames[Math.floor(Math.random() * randomFunderNames.length)];
    const randomFile = randomActionFiles[Math.floor(Math.random() * randomActionFiles.length)];
    const randomHash = hashes[Math.floor(Math.random() * hashes.length)];
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    const simulatedEvent = {
        id: "TXN-" + Math.floor(1000 + Math.random() * 9000),
        timestamp: timestamp,
        operator: randomName,
        action: "LIVE DEMO RECON",
        category: "upload",
        target: randomFile,
        status: "PROCESSED",
        details: "Live simulation trigger injected successfully. Visual audit stream state confirmed.",
        hash: randomHash
    };

    currentLedgerData.unshift(simulatedEvent);
    renderAuditLedger();
}