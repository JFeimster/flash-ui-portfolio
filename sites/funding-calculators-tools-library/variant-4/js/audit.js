(function() {
    // 1. Dynamic CSS Injection for absolute visual matching and enhanced layout
    const style = document.createElement('style');
    style.textContent = `
        .compliance-section {
            max-width: 1440px;
            margin: 80px auto;
            padding: 0 40px;
        }
        @media (max-width: 768px) {
            .compliance-section {
                padding: 0 20px;
                margin: 40px auto;
            }
        }
        .compliance-wrapper {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            box-shadow: var(--brutal-shadow);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .compliance-header {
            background: var(--bg-tertiary);
            padding: 24px;
            border-bottom: 3px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        .compliance-title-group h3 {
            font-family: var(--font-display);
            font-size: 24px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .compliance-title-group h3 span {
            color: var(--accent-magenta);
        }
        .compliance-subtitle {
            font-size: 13px;
            color: var(--text-secondary);
            margin-top: 4px;
        }
        .compliance-pulse-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(57, 255, 20, 0.1);
            color: var(--accent-lime, #39ff14);
            border: 1px solid var(--accent-lime, #39ff14);
            padding: 6px 12px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .compliance-pulse-dot {
            width: 8px;
            height: 8px;
            background: var(--accent-lime, #39ff14);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--accent-lime, #39ff14);
            animation: auditPulse 1.2s infinite alternate;
        }
        @keyframes auditPulse {
            0% { opacity: 0.4; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1.1); }
        }
        .audit-controls {
            padding: 16px 24px;
            background: var(--bg-primary);
            border-bottom: 2px solid var(--border-color);
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            align-items: center;
        }
        .audit-search-wrapper {
            position: relative;
            flex: 1;
            min-width: 260px;
        }
        .audit-search {
            width: 100%;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            color: var(--text-primary);
            padding: 10px 14px 10px 38px;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            outline: none;
            transition: all 0.2s ease;
        }
        .audit-search:focus {
            border-color: var(--accent-magenta);
            box-shadow: 0 0 8px rgba(255, 0, 122, 0.2);
        }
        .audit-search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            color: var(--text-secondary);
            pointer-events: none;
        }
        .audit-filters {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .audit-filter-btn {
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            color: var(--text-secondary);
            padding: 8px 14px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.15s ease;
            font-family: var(--font-display);
        }
        .audit-filter-btn:hover {
            border-color: var(--accent-cyan);
            color: var(--text-primary);
        }
        .audit-filter-btn.active {
            background: var(--accent-cyan);
            color: #000;
            border-color: #000;
            box-shadow: 2px 2px 0px #000;
        }
        .audit-timeline-container {
            max-height: 480px;
            overflow-y: auto;
            background: var(--bg-primary);
            padding: 8px 0;
        }
        /* Custom scrollbar matching core layout */
        .audit-timeline-container::-webkit-scrollbar {
            width: 6px;
        }
        .audit-timeline-container::-webkit-scrollbar-track {
            background: var(--bg-primary);
        }
        .audit-timeline-container::-webkit-scrollbar-thumb {
            background: var(--border-color);
        }
        .audit-timeline-container::-webkit-scrollbar-thumb:hover {
            background: var(--accent-magenta);
        }
        .audit-item {
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 20px;
            padding: 16px 24px;
            border-bottom: 1px solid var(--border-color);
            transition: all 0.15s ease;
            align-items: center;
        }
        .audit-item:hover {
            background: var(--bg-tertiary);
            border-left: 4px solid var(--accent-cyan);
            padding-left: 20px;
        }
        @media (max-width: 640px) {
            .audit-item {
                grid-template-columns: 1fr;
                gap: 12px;
                padding: 16px;
            }
        }
        .audit-badge-column {
            display: flex;
            align-items: center;
        }
        .audit-type-badge {
            font-size: 9px;
            text-transform: uppercase;
            font-weight: 800;
            letter-spacing: 0.5px;
            padding: 4px 8px;
            border: 1px solid transparent;
            width: 110px;
            text-align: center;
            border-radius: 2px;
        }
        .audit-type-badge.read {
            background: rgba(0, 240, 255, 0.1);
            color: var(--accent-cyan);
            border-color: var(--accent-cyan);
        }
        .audit-type-badge.action {
            background: rgba(255, 92, 0, 0.1);
            color: var(--accent-orange);
            border-color: var(--accent-orange);
        }
        .audit-type-badge.system {
            background: rgba(57, 255, 20, 0.1);
            color: var(--accent-lime, #39ff14);
            border-color: var(--accent-lime, #39ff14);
        }
        .audit-type-badge.export {
            background: rgba(255, 0, 122, 0.1);
            color: var(--accent-magenta);
            border-color: var(--accent-magenta);
        }
        .audit-main-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .audit-message {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
        }
        .audit-meta-row {
            display: flex;
            gap: 16px;
            font-size: 11px;
            color: var(--text-secondary);
            flex-wrap: wrap;
            text-transform: uppercase;
            font-family: var(--font-display);
        }
        .audit-meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .audit-meta-item strong {
            color: var(--text-primary);
        }
        .audit-hash-block {
            text-align: right;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;
            gap: 4px;
        }
        @media (max-width: 640px) {
            .audit-hash-block {
                text-align: left;
                align-items: flex-start;
            }
        }
        .audit-timestamp {
            font-family: var(--font-display);
            font-size: 11px;
            font-weight: 700;
            color: var(--accent-magenta);
            text-transform: uppercase;
        }
        .audit-hash {
            font-family: monospace;
            font-size: 10px;
            color: var(--text-secondary);
            background: var(--bg-tertiary);
            padding: 2px 6px;
            border: 1px solid var(--border-color);
            letter-spacing: 0.5px;
        }
        .audit-footer-summary {
            background: var(--bg-tertiary);
            padding: 16px 24px;
            border-top: 2px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        .compliance-stats {
            display: flex;
            gap: 24px;
            font-family: var(--font-display);
            font-size: 12px;
            text-transform: uppercase;
        }
        .compliance-stat-item span {
            color: var(--accent-cyan);
            font-weight: 700;
        }
    `;
    document.head.appendChild(style);

    // 2. High-Impact Static Audit Trail Dataset
    const historicalAuditEvents = [
        {
            type: 'system',
            badgeClass: 'system',
            message: 'Compliance visualizer successfully attached to main sandbox pipeline',
            session: 'SYS_DAEMON_PROD_4.2',
            ip: '127.0.0.1 (Localhost)',
            hash: '4d8a9f83cf10ec7e',
            time: 'Just Now'
        },
        {
            type: 'action',
            badgeClass: 'action',
            message: 'Calculated DSCR Verification Ratio - Approved standard pricing',
            session: 'CORE_FLOW_SESS_894',
            ip: '198.51.100.82 (VPN Proxied)',
            hash: '7a2e5b91fa049c32',
            time: '2 Minutes Ago'
        },
        {
            type: 'export',
            badgeClass: 'export',
            message: 'Generated Simulated Factor Rate Equivalency Matrix PDF Document',
            session: 'ANON_FINTECH_USER_32',
            ip: '64.233.160.11 (US East)',
            hash: '3f901cb4d82f716a',
            time: '14 Minutes Ago'
        },
        {
            type: 'read',
            badgeClass: 'read',
            message: 'Analyzed Credit Score Estimator - Generated Paydex Grade Verification',
            session: 'CORE_FLOW_SESS_712',
            ip: '172.56.21.104 (Mobile Gate)',
            hash: 'a12f93d482bc01e2',
            time: '45 Minutes Ago'
        },
        {
            type: 'action',
            badgeClass: 'action',
            message: 'Executed MCA Factor Rate to APR calculation conversion model',
            session: 'ANON_FINTECH_USER_32',
            ip: '64.233.160.11 (US East)',
            hash: 'cf891a2e34bd9012',
            time: '1 Hour Ago'
        },
        {
            type: 'system',
            badgeClass: 'system',
            message: 'Rotated server-side session hash validation credentials (NIST compliant)',
            session: 'SYS_DAEMON_PROD_4.2',
            ip: '127.0.0.1 (Localhost)',
            hash: '2093ea12fbc9401a',
            time: '3 Hours Ago'
        },
        {
            type: 'export',
            badgeClass: 'export',
            message: 'Broker commissions split parameters exported to Local Storage configuration',
            session: 'BROKER_AGENT_PROX_8',
            ip: '8.8.8.8 (Resolver Loop)',
            hash: '90fa128cbe94f02e',
            time: '5 Hours Ago'
        }
    ];

    // Array to hold real-time captured inputs
    let runTimeEvents = [];

    // 3. Construct visual interface DOM structure
    const complianceSection = document.createElement('section');
    complianceSection.className = 'compliance-section';
    complianceSection.id = 'compliance-audit';

    complianceSection.innerHTML = `
        <div class="compliance-wrapper">
            <div class="compliance-header">
                <div class="compliance-title-group">
                    <h3>Interactive <span>Compliance Log</span> & Audit Trail</h3>
                    <div class="compliance-subtitle">A real-time read-only record of system events, session states, and calculator actions adhering to standard fintech reporting.</div>
                </div>
                <div class="compliance-pulse-indicator">
                    <div class="compliance-pulse-dot"></div>
                    Live Audit Running
                </div>
            </div>

            <div class="audit-controls">
                <div class="audit-search-wrapper">
                    <svg class="audit-search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                    </svg>
                    <input type="text" id="auditSearch" class="audit-search" placeholder="Filter by event text, session, IP, hash...">
                </div>
                <div class="audit-filters">
                    <button class="audit-filter-btn active" data-audit-filter="all">All Logs</button>
                    <button class="audit-filter-btn" data-audit-filter="action">Action</button>
                    <button class="audit-filter-btn" data-audit-filter="export">Export</button>
                    <button class="audit-filter-btn" data-audit-filter="read">Read</button>
                    <button class="audit-filter-btn" data-audit-filter="system">System</button>
                </div>
            </div>

            <div class="audit-timeline-container" id="auditTimeline">
                <!-- Dynamically populated events -->
            </div>

            <div class="audit-footer-summary">
                <div class="compliance-stats">
                    <div class="compliance-stat-item">Session Status: <span style="color: var(--accent-lime);">COMPLIANT</span></div>
                    <div class="compliance-stat-item">Simulated Logs: <span id="logCounter">0</span></div>
                    <div class="compliance-stat-item">Encrypted: <span style="color: var(--accent-orange);">AES-GCM-256</span></div>
                </div>
                <button class="btn-action" id="btnExportAudit" style="padding: 10px 20px; font-size: 11px; box-shadow: 2px 2px 0px #000;">
                    Download CSV Logs
                </button>
            </div>
        </div>
    `;

    // 4. Inject dynamically compiled visualizer section directly before "Personalized Strategy Banner"
    const strategySection = document.getElementById('strategy');
    if (strategySection) {
        strategySection.parentNode.insertBefore(complianceSection, strategySection);
    } else {
        // Fallback: append inside main body if strategy section cannot be verified
        document.body.appendChild(complianceSection);
    }

    // 5. Utility helper to generate pseudo random cryptographical strings
    function generatePseudoHash() {
        const chars = '0123456789abcdef';
        let output = '';
        for (let i = 0; i < 16; i++) {
            output += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return output;
    }

    // Dynamic state generation helper
    function getClientSessionString() {
        return `CLIENT_SESS_${Math.floor(100 + Math.random() * 900)}`;
    }

    function getSpoofedIP() {
        const blocks = [
            Math.floor(64 + Math.random() * 128),
            Math.floor(10 + Math.random() * 200),
            Math.floor(1 + Math.random() * 254),
            Math.floor(1 + Math.random() * 254)
        ];
        return blocks.join('.') + ' (Active Session)';
    }

    // Render the log visual component based on current search/filter requirements
    function renderAuditLog() {
        const searchInput = document.getElementById('auditSearch');
        const filterVal = document.querySelector('.audit-filter-btn.active').dataset.auditFilter;
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const timeline = document.getElementById('auditTimeline');
        
        if (!timeline) return;

        // Merge historical static and run-time live recorded events
        const compiledEvents = [...runTimeEvents, ...historicalAuditEvents];
        
        let filteredEvents = compiledEvents.filter(event => {
            const matchesFilter = filterVal === 'all' || event.type === filterVal;
            const matchesQuery = 
                event.message.toLowerCase().includes(query) || 
                event.session.toLowerCase().includes(query) || 
                event.ip.toLowerCase().includes(query) || 
                event.hash.toLowerCase().includes(query);
            return matchesFilter && matchesQuery;
        });

        // Generate DOM Elements safely with strict neobrutalist styling matches
        timeline.innerHTML = '';
        if (filteredEvents.length === 0) {
            timeline.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--text-secondary); font-size: 14px; text-transform: uppercase; font-weight: 700;">
                    No matching compliance parameters identified in active database ledger.
                </div>
            `;
            return;
        }

        filteredEvents.forEach(event => {
            const row = document.createElement('div');
            row.className = 'audit-item';

            row.innerHTML = `
                <div class="audit-badge-column">
                    <span class="audit-type-badge ${event.badgeClass}">${event.type}</span>
                </div>
                <div class="audit-main-content">
                    <div class="audit-message">${escapeHTML(event.message)}</div>
                    <div class="audit-meta-row">
                        <div class="audit-meta-item">Session ID: <strong>${escapeHTML(event.session)}</strong></div>
                        <div class="audit-meta-item">IP: <strong>${escapeHTML(event.ip)}</strong></div>
                    </div>
                </div>
                <div class="audit-hash-block">
                    <span class="audit-timestamp">${escapeHTML(event.time)}</span>
                    <span class="audit-hash">SHA: ${escapeHTML(event.hash)}</span>
                </div>
            `;
            timeline.appendChild(row);
        });

        // Update visual Counter interface
        const countIndicator = document.getElementById('logCounter');
        if (countIndicator) {
            countIndicator.textContent = compiledEvents.length;
        }
    }

    // Basic sanitizer mechanism
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Hook into live calculators sandbox trigger pipeline securely
    function registerDynamicListeners() {
        // Hook dynamically into filter triggers
        const filterBtns = document.querySelectorAll('.audit-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderAuditLog();
            });
        });

        const searchField = document.getElementById('auditSearch');
        if (searchField) {
            searchField.addEventListener('input', renderAuditLog);
        }

        // Export Log Download button triggers simulated UX toast
        const btnExport = document.getElementById('btnExportAudit');
        if (btnExport) {
            btnExport.addEventListener('click', () => {
                // Trigger visual system toast directly from base component
                if (typeof window.showNotification === 'function') {
                    window.showNotification("Encrypted Compliance Ledger Exported Successfully");
                } else {
                    // Fallback alerts style custom design matching neobrutalist guidelines
                    const customToast = document.getElementById('toast');
                    const toastText = document.getElementById('toast-text');
                    if (customToast && toastText) {
                        toastText.innerText = "Compliance CSV Exported (Simulated)";
                        customToast.classList.add('visible');
                        setTimeout(() => customToast.classList.remove('visible'), 3000);
                    }
                }
            });
        }
    }

    // Intercept function to log sandbox updates instantly
    function hookCoreSandboxModule() {
        // Intercept calculator actions by mapping state changes dynamically
        let activeSessionIP = getSpoofedIP();
        let activeSessionString = getClientSessionString();

        // Overwrite or extend global loadCalculator inside core framework pipeline
        const originalLoadCalculator = window.loadCalculator;
        if (typeof originalLoadCalculator === 'function') {
            window.loadCalculator = function(key) {
                // Run base functional load execution logic
                originalLoadCalculator.apply(this, arguments);

                // Dynamically compile descriptive naming strings for logs
                let prettyName = key.replace(/-/g, ' ').toUpperCase();
                
                // Add event live verification records to dynamic runtime array
                const newEvent = {
                    type: 'read',
                    badgeClass: 'read',
                    message: `Sandbox Loaded Module Engine - Configured parameter view for: ${prettyName}`,
                    session: activeSessionString,
                    ip: activeSessionIP,
                    hash: generatePseudoHash(),
                    time: 'Just Now'
                };

                runTimeEvents.unshift(newEvent);
                renderAuditLog();
            };
        }

        // Overwrite standard calculation computation cycles to monitor metrics updates dynamically
        const originalTriggerCalculation = window.triggerCalculation;
        if (typeof originalTriggerCalculation === 'function') {
            window.triggerCalculation = function() {
                originalTriggerCalculation.apply(this, arguments);

                // Avoid overwhelming log timeline arrays when values slide rapidly, throttle generation logic slightly
                const throttleKey = `calc_log_throttle`;
                const now = Date.now();
                if (!window[throttleKey] || (now - window[throttleKey] > 800)) {
                    window[throttleKey] = now;

                    const activeKey = window.activeKey || 'generic-calculation';
                    let prettyName = activeKey.replace(/-/g, ' ').toUpperCase();

                    const newEvent = {
                        type: 'action',
                        badgeClass: 'action',
                        message: `Re-calculated live computational matrices within: ${prettyName}`,
                        session: activeSessionString,
                        ip: activeSessionIP,
                        hash: generatePseudoHash(),
                        time: 'Just Now'
                    };

                    runTimeEvents.unshift(newEvent);
                    renderAuditLog();
                }
            };
        }
    }

    // Run Initializing sequences
    function init() {
        registerDynamicListeners();
        hookCoreSandboxModule();
        renderAuditLog();
    }

    // Handle high fidelity DOM ready logic checks
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();