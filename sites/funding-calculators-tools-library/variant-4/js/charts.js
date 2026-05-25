(function() {
    // -------------------------------------------------------------
    // Style Injection for Link Tracking & Download Analytics Dashboard
    // -------------------------------------------------------------
    const styles = `
        /* Dashboard Container & Grid System */
        .analytics-container {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 32px;
            margin-top: 24px;
        }

        @media (max-width: 1150px) {
            .analytics-container {
                grid-template-columns: 1fr;
            }
        }

        /* Brutalist Panel Styling */
        .analytics-panel {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            box-shadow: var(--brutal-shadow);
            border-radius: 8px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            position: relative;
            overflow: hidden;
        }

        .panel-header-brutal {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px dashed var(--border-color);
            padding-bottom: 16px;
        }

        .panel-title-brutal {
            font-family: var(--font-display);
            font-size: 18px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Pulsing Online Badge */
        .live-pulse-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(57, 255, 20, 0.1);
            border: 1px solid var(--accent-lime);
            color: var(--accent-lime);
            font-size: 10px;
            font-weight: 800;
            padding: 4px 8px;
            text-transform: uppercase;
            font-family: var(--font-display);
        }

        .pulse-dot {
            width: 6px;
            height: 6px;
            background-color: var(--accent-lime);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--accent-lime);
            animation: pulse-glow 1.5s infinite alternate;
        }

        @keyframes pulse-glow {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1.2); opacity: 1; }
        }

        /* Secured Asset Ledger Table / List */
        .tracking-ledger {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 480px;
            overflow-y: auto;
            padding-right: 4px;
        }

        .ledger-item {
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            padding: 16px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            transition: all 0.2s ease;
        }

        .ledger-item:hover {
            border-color: var(--accent-cyan);
            transform: translateY(-2px);
        }

        .ledger-item.revoked {
            border-color: #3a1c24;
            opacity: 0.65;
            background: #110c12;
        }

        .ledger-info {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-grow: 1;
            min-width: 0;
        }

        .ledger-meta {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .file-name {
            font-family: var(--font-display);
            font-size: 15px;
            font-weight: 700;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .file-tag {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 2px 6px;
            border-radius: 20px;
            border: 1px solid;
        }

        .file-tag.pdf { color: var(--accent-orange); border-color: var(--accent-orange); background: rgba(255, 92, 0, 0.05); }
        .file-tag.xlsx { color: var(--accent-cyan); border-color: var(--accent-cyan); background: rgba(0, 240, 255, 0.05); }
        .file-tag.zip { color: var(--accent-magenta); border-color: var(--accent-magenta); background: rgba(255, 0, 122, 0.05); }

        .stat-badge-group {
            display: flex;
            gap: 8px;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-secondary);
        }

        .stat-pill {
            background: var(--bg-primary);
            padding: 2px 8px;
            border: 1px solid var(--border-color);
            border-radius: 3px;
        }

        .stat-pill span {
            color: var(--accent-cyan);
            font-weight: 700;
        }

        .revoked .stat-pill span {
            color: var(--text-secondary);
        }

        /* Revoke Toggle Button styling */
        .btn-revoke {
            background: transparent;
            color: var(--accent-magenta);
            border: 2px solid var(--accent-magenta);
            padding: 8px 14px;
            font-size: 11px;
            font-weight: 800;
            font-family: var(--font-display);
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
        }

        .btn-revoke:hover {
            background: var(--accent-magenta);
            color: #000;
            box-shadow: 3px 3px 0px #000;
        }

        .btn-reactivate {
            background: transparent;
            color: var(--accent-lime);
            border: 2px solid var(--accent-lime);
            padding: 8px 14px;
            font-size: 11px;
            font-weight: 800;
            font-family: var(--font-display);
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
        }

        .btn-reactivate:hover {
            background: var(--accent-lime);
            color: #000;
            box-shadow: 3px 3px 0px #000;
        }

        /* SVG Chart Container & Sparkline logic */
        .chart-box-wrapper {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            padding: 16px;
            border-radius: 4px;
            position: relative;
        }

        .svg-chart-element {
            width: 100%;
            height: 200px;
            display: block;
        }

        /* Geo Access Progress lists */
        .geo-hotspots {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .geo-bar-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .geo-bar-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .geo-bar-track {
            height: 8px;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }

        .geo-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-magenta));
            width: 0%;
            transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Secure Generator Input fields within module */
        .generator-form {
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            padding: 16px;
            border-radius: 4px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .gen-input {
            flex: 1;
            min-width: 180px;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 10px 14px;
            color: var(--text-primary);
            font-size: 13px;
            font-weight: 600;
            outline: none;
        }

        .gen-input:focus {
            border-color: var(--accent-cyan);
        }

        .gen-select {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 10px 14px;
            color: var(--text-primary);
            font-size: 13px;
            font-weight: 600;
            outline: none;
            cursor: pointer;
        }
        
        .gen-select:focus {
            border-color: var(--accent-cyan);
        }

        /* Global style adjustments for secondary metrics indicator */
        .stat-grid-metric {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        }

        .mini-stat-card {
            background: var(--bg-tertiary);
            border: 1px dashed var(--border-color);
            padding: 12px;
            border-radius: 4px;
            text-align: center;
        }

        .mini-stat-val {
            font-family: var(--font-display);
            font-size: 20px;
            font-weight: 700;
            color: var(--accent-cyan);
        }
        
        .mini-stat-val.magenta { color: var(--accent-magenta); }
        .mini-stat-val.lime { color: var(--accent-lime); }

        .mini-stat-lbl {
            font-size: 9px;
            text-transform: uppercase;
            color: var(--text-secondary);
            margin-top: 2px;
            letter-spacing: 0.5px;
        }
    `;

    // Inject styling directly into document head
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // -------------------------------------------------------------
    // Mock Database for Secure Dispatch Link Tracking
    // -------------------------------------------------------------
    let trackingDatabase = [
        { id: 'lnk-01', name: 'SBA-Term-Underwriting-Pack.pdf', type: 'pdf', clicks: 142, downloads: 89, active: true, created: '2024-10-12' },
        { id: 'lnk-02', name: 'Q3-Revenue-Recap-Audit.xlsx', type: 'xlsx', clicks: 310, downloads: 215, active: true, created: '2024-10-14' },
        { id: 'lnk-03', name: 'Merchant-Agreement-Stipulations.pdf', type: 'pdf', clicks: 68, downloads: 41, active: true, created: '2024-10-15' },
        { id: 'lnk-04', name: 'Equipment-Valuation-Assets.zip', type: 'zip', clicks: 195, downloads: 180, active: false, created: '2024-10-09' }
    ];

    let geoAccessStats = [
        { location: 'United States (East / NY)', requests: 430, percentage: 72 },
        { location: 'United Kingdom (London)', requests: 95, percentage: 16 },
        { location: 'Germany (Frankfurt)', requests: 48, percentage: 8 },
        { location: 'Canada (Toronto)', requests: 24, percentage: 4 }
    ];

    // Real-time timeline array for SVG chart (represents total active aggregate traffic hourly)
    let hourlyTimelineTraffic = [28, 45, 30, 85, 92, 60, 120, 150, 110, 185, 210, 245, 230, 290, 315];

    // -------------------------------------------------------------
    // UI Layout Assembly & Injected Section Construction
    // -------------------------------------------------------------
    const targetWorkspace = document.getElementById('tools-library');
    if (targetWorkspace) {
        // Build the new Link Tracking & Dispatch Audit Section
        const auditSection = document.createElement('section');
        auditSection.className = 'tools-library-section';
        auditSection.id = 'dispatch-audit-suite';
        auditSection.style.marginTop = '80px';
        auditSection.style.borderTop = '3px solid var(--border-color)';
        auditSection.style.paddingTop = '60px';

        auditSection.innerHTML = `
            <div class="section-headline">
                <div>
                    <p style="text-transform: uppercase; font-size: 11px; font-weight: 800; color: var(--accent-magenta); letter-spacing: 2px;">Asset Audits</p>
                    <h2 style="margin-top: 5px;">Link Tracking & <span>Security Dashboard</span></h2>
                </div>
                <p style="color: var(--text-secondary); max-width: 450px; font-size: 14px; text-align: right;">
                    Audit dispatch trails dynamically. View active link clicks, individual attachment downloads, geographical telemetry, and apply absolute revoking blocks instantly.
                </p>
            </div>

            <div class="analytics-container">
                
                <!-- Left Hand Column: Secured Asset Ledger Control Board -->
                <div class="analytics-panel">
                    <div class="panel-header-brutal">
                        <div class="panel-title-brutal">
                            🔐 Active Dispatch Ledger
                        </div>
                        <div class="live-pulse-badge">
                            <span class="pulse-dot"></span> Secure tracking active
                        </div>
                    </div>

                    <!-- Instant secure generation form -->
                    <div class="generator-form">
                        <input type="text" id="gen-file-name" class="gen-input" placeholder="New file payload name (e.g. Audit-Trail.pdf)...">
                        <select id="gen-file-type" class="gen-select">
                            <option value="pdf">.PDF</option>
                            <option value="xlsx">.XLSX</option>
                            <option value="zip">.ZIP</option>
                        </select>
                        <button id="btn-create-dispatch" class="btn-action" style="padding: 10px 18px; font-size: 11px; box-shadow: 2px 2px 0px #000;">Secure Dispatch</button>
                    </div>

                    <!-- Ledger list dynamically loaded -->
                    <div class="tracking-ledger" id="dispatch-ledger-target">
                        <!-- Dynamic content loaded via JS -->
                    </div>
                </div>

                <!-- Right Hand Column: Live Visualizer & Geo-Hotspot Progress Tracking -->
                <div class="analytics-panel">
                    <div class="panel-header-brutal">
                        <div class="panel-title-brutal">
                            📊 Real-Time Interaction Waveform
                        </div>
                        <span style="font-family: var(--font-display); font-size: 11px; font-weight: 800; color: var(--accent-cyan);">AGGR ACCESS RATE</span>
                    </div>

                    <!-- SVG interactive line chart visually mapped -->
                    <div class="chart-box-wrapper" id="svg-chart-container">
                        <!-- Chart generated via render loop -->
                    </div>

                    <div class="stat-grid-metric">
                        <div class="mini-stat-card">
                            <div class="mini-stat-val" id="mini-stat-clicks">715</div>
                            <div class="mini-stat-lbl">Aggr Clicks</div>
                        </div>
                        <div class="mini-stat-card">
                            <div class="mini-stat-val magenta" id="mini-stat-downloads">525</div>
                            <div class="mini-stat-lbl">Total Downloads</div>
                        </div>
                        <div class="mini-stat-card">
                            <div class="mini-stat-val lime" id="mini-stat-integrity">100%</div>
                            <div class="mini-stat-lbl">Dispatch Security</div>
                        </div>
                    </div>

                    <div class="panel-header-brutal" style="margin-top: 10px; border-bottom: 2px dashed var(--border-color); padding-bottom: 12px;">
                        <div class="panel-title-brutal" style="font-size: 15px;">
                            🌍 Geographical Telemetry Hotspots
                        </div>
                    </div>

                    <div class="geo-hotspots" id="geo-hotspots-target">
                        <!-- Geo bars generated via loop -->
                    </div>
                </div>

            </div>
        `;

        // Inject section before Strategy Banner
        const strategyBanner = document.getElementById('strategy');
        if (strategyBanner) {
            targetWorkspace.parentNode.insertBefore(auditSection, strategyBanner);
        } else {
            targetWorkspace.parentNode.appendChild(auditSection);
        }

        // Hook Interactive Events
        document.getElementById('btn-create-dispatch').addEventListener('click', handleCreateDispatch);
        
        // Initial Draw Loop
        renderLedgerTable();
        renderGeoHotspots();
        renderTrafficChart();
        updateAggregationCards();

        // Start real-time activity loop simulation (traffic fluctuations)
        setInterval(simulateLiveTraffic, 4500);
    }

    // -------------------------------------------------------------
    // Core Rendering Engine Logic
    // -------------------------------------------------------------

    // 1. Render Asset tracking list with controls
    function renderLedgerTable() {
        const target = document.getElementById('dispatch-ledger-target');
        if (!target) return;

        target.innerHTML = '';
        trackingDatabase.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `ledger-item ${item.active ? '' : 'revoked'}`;
            
            const actionButton = item.active 
                ? `<button class="btn-revoke" onclick="toggleLinkState('${item.id}')">Revoke Dispatch</button>` 
                : `<button class="btn-reactivate" onclick="toggleLinkState('${item.id}')">Reactivate</button>`;

            itemElement.innerHTML = `
                <div class="ledger-info">
                    <div class="ledger-meta">
                        <span class="file-name" title="${item.name}">${item.name}</span>
                        <span class="file-tag ${item.type}">${item.type}</span>
                        ${!item.active ? '<span class="file-tag" style="background: rgba(255,0,122,0.15); border-color: var(--accent-magenta); color: var(--accent-magenta);">BLOCKED</span>' : '<span class="file-tag" style="background: rgba(57,255,20,0.15); border-color: var(--accent-lime); color: var(--accent-lime);">ACTIVE TRACKING</span>'}
                    </div>
                    <div class="stat-badge-group">
                        <div class="stat-pill">Access hits: <span id="clicks-val-${item.id}">${item.clicks}</span></div>
                        <div class="stat-pill">Verified Downloads: <span id="downloads-val-${item.id}">${item.downloads}</span></div>
                    </div>
                </div>
                <div>
                    ${actionButton}
                </div>
            `;
            target.appendChild(itemElement);
        });
    }

    // 2. Render Geographical Progress Telemetry Bars
    function renderGeoHotspots() {
        const target = document.getElementById('geo-hotspots-target');
        if (!target) return;

        target.innerHTML = '';
        geoAccessStats.forEach(stat => {
            const row = document.createElement('div');
            row.className = 'geo-bar-item';
            row.innerHTML = `
                <div class="geo-bar-header">
                    <span>📍 ${stat.location}</span>
                    <span style="color: var(--accent-cyan); font-family: var(--font-display); font-weight: 700;">${stat.requests} accesses (${stat.percentage}%)</span>
                </div>
                <div class="geo-bar-track">
                    <div class="geo-bar-fill" style="width: ${stat.percentage}%;"></div>
                </div>
            `;
            target.appendChild(row);
        });
    }

    // 3. Render Custom SVG Neobrutalist Line Chart Graph
    function renderTrafficChart() {
        const container = document.getElementById('svg-chart-container');
        if (!container) return;

        const containerWidth = container.clientWidth || 500;
        const containerHeight = 200;
        const paddingLeft = 30;
        const paddingRight = 15;
        const paddingTop = 20;
        const paddingBottom = 20;

        const maxVal = Math.max(...hourlyTimelineTraffic) * 1.15;
        const pointsCount = hourlyTimelineTraffic.length;

        // Calculate visual points layout coordinates
        const stepX = (containerWidth - paddingLeft - paddingRight) / (pointsCount - 1);
        const scaleY = (containerHeight - paddingTop - paddingBottom) / maxVal;

        let pointsPathString = '';
        let areaPathString = `M ${paddingLeft} ${containerHeight - paddingBottom}`;

        const pointsList = [];

        hourlyTimelineTraffic.forEach((val, index) => {
            const x = paddingLeft + (index * stepX);
            const y = containerHeight - paddingBottom - (val * scaleY);
            pointsList.push({x, y});
            
            if (index === 0) {
                pointsPathString += `M ${x} ${y}`;
            } else {
                pointsPathString += ` L ${x} ${y}`;
            }
            areaPathString += ` L ${x} ${y}`;
        });

        areaPathString += ` L ${pointsList[pointsList.length - 1].x} ${containerHeight - paddingBottom} Z`;

        // Draw Brutalist grid lines inside SVG template
        let gridLines = '';
        const linesCount = 4;
        for (let i = 0; i <= linesCount; i++) {
            const yOffset = paddingTop + (i * (containerHeight - paddingTop - paddingBottom) / linesCount);
            gridLines += `<line x1="${paddingLeft}" y1="${yOffset}" x2="${containerWidth - paddingRight}" y2="${yOffset}" stroke="#1a2030" stroke-width="1.5" stroke-dasharray="4,4" />`;
        }

        // Generate glowing dots along tracking path
        let dotsSvg = '';
        pointsList.forEach((pt, index) => {
            if (index === pointsList.length - 1) { // Highlight ultimate tracking cursor
                dotsSvg += `
                    <circle cx="${pt.x}" cy="${pt.y}" r="6" fill="var(--accent-cyan)" stroke="#000" stroke-width="2" />
                    <circle cx="${pt.x}" cy="${pt.y}" r="12" fill="none" stroke="var(--accent-cyan)" stroke-width="1.5" opacity="0.5">
                        <animate attributeName="r" values="6;15;6" dur="2s" repeatCount="indefinite" />
                    </circle>
                `;
            } else if (index % 3 === 0) {
                dotsSvg += `<circle cx="${pt.x}" cy="${pt.y}" r="4" fill="var(--accent-magenta)" stroke="#000" stroke-width="1" />`;
            }
        });

        container.innerHTML = `
            <svg class="svg-chart-element" viewBox="0 0 ${containerWidth} ${containerHeight}" width="100%" height="200px">
                <defs>
                    <linearGradient id="chartGlowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--accent-cyan)" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="var(--accent-magenta)" stop-opacity="0.0"/>
                    </linearGradient>
                </defs>
                
                <!-- Horizontal guidelines -->
                ${gridLines}

                <!-- Subtle Area gradient -->
                <path d="${areaPathString}" fill="url(#chartGlowGradient)" />

                <!-- The primary glowing signal path -->
                <path d="${pointsPathString}" fill="none" stroke="var(--accent-cyan)" stroke-width="3" stroke-linecap="round" filter="drop-shadow(0px 0px 4px rgba(0,240,255,0.4))" />

                <!-- Dynamic elements mapped -->
                ${dotsSvg}
            </svg>
        `;
    }

    // 4. Update the aggregate metrics counters with accurate status rates
    function updateAggregationCards() {
        const totalClicks = trackingDatabase.reduce((sum, item) => sum + (item.active ? item.clicks : 0), 0);
        const totalDownloads = trackingDatabase.reduce((sum, item) => sum + (item.active ? item.downloads : 0), 0);
        
        const activeLinksCount = trackingDatabase.filter(item => item.active).length;
        const totalLinksCount = trackingDatabase.length;
        
        let integrityRate = 100;
        if (totalLinksCount > 0) {
            integrityRate = Math.round((activeLinksCount / totalLinksCount) * 100);
        }

        // DOM Update transitions
        animateValueChange('mini-stat-clicks', totalClicks);
        animateValueChange('mini-stat-downloads', totalDownloads);
        
        const integrityElement = document.getElementById('mini-stat-integrity');
        if (integrityElement) {
            integrityElement.innerText = `${integrityRate}%`;
            if (integrityRate < 60) {
                integrityElement.style.color = 'var(--accent-magenta)';
            } else if (integrityRate < 100) {
                integrityElement.style.color = 'var(--accent-orange)';
            } else {
                integrityElement.style.color = 'var(--accent-lime)';
            }
        }
    }

    // Helper: Smoothly iterate numeric values in UI
    function animateValueChange(elementId, targetVal) {
        const element = document.getElementById(elementId);
        if (!element) return;
        const startVal = parseInt(element.innerText.replace(/,/g, '')) || 0;
        if (startVal === targetVal) return;

        let current = startVal;
        const step = Math.ceil(Math.abs(targetVal - startVal) / 15) * (targetVal > startVal ? 1 : -1);
        
        const timer = setInterval(() => {
            current += step;
            if ((step > 0 && current >= targetVal) || (step < 0 && current <= targetVal)) {
                current = targetVal;
                clearInterval(timer);
            }
            element.innerText = current.toLocaleString();
        }, 30);
    }

    // -------------------------------------------------------------
    // Live Action Handlers
    // -------------------------------------------------------------

    // Handler to create a new secure dispatch link payload
    function handleCreateDispatch() {
        const fileInput = document.getElementById('gen-file-name');
        const typeSelect = document.getElementById('gen-file-type');
        if (!fileInput || !typeSelect) return;

        const name = fileInput.value.trim();
        if (!name) {
            triggerNotification('Please specify an asset payload target.');
            return;
        }

        const type = typeSelect.value;
        const newId = `lnk-${Date.now().toString().slice(-4)}`;

        const newLink = {
            id: newId,
            name: name.endsWith(`.${type}`) ? name : `${name}.${type}`,
            type: type,
            clicks: 0,
            downloads: 0,
            active: true,
            created: new Date().toISOString().split('T')[0]
        };

        // Push into local active database
        trackingDatabase.unshift(newLink);
        
        // Reset Inputs
        fileInput.value = '';

        // UI triggers
        renderLedgerTable();
        updateAggregationCards();
        triggerNotification(`Dispatch generated: ${newLink.name}`);
    }

    // Global hook for Revoke / Reactivate links controls
    window.toggleLinkState = function(id) {
        const index = trackingDatabase.findIndex(item => item.id === id);
        if (index === -1) return;

        const currentLink = trackingDatabase[index];
        currentLink.active = !currentLink.active;

        renderLedgerTable();
        updateAggregationCards();

        if (currentLink.active) {
            triggerNotification(`Reactivated audit tracking for payload.`);
        } else {
            triggerNotification(`REVOKED external payload token access!`);
        }
    };

    // Simulated Traffic Generator Interface (every few seconds)
    function simulateLiveTraffic() {
        let activeModified = false;

        trackingDatabase.forEach(item => {
            // Only update metrics if link is currently not revoked (security sandbox mechanism)
            if (item.active && Math.random() > 0.4) {
                const newClicks = Math.floor(Math.random() * 4) + 1;
                item.clicks += newClicks;
                
                if (Math.random() > 0.5) {
                    item.downloads += Math.floor(Math.random() * newClicks);
                }
                activeModified = true;
            }
        });

        if (activeModified) {
            // Push active live metrics to timeline
            const aggregateActiveClicks = trackingDatabase.reduce((sum, item) => sum + (item.active ? item.clicks : 0), 0);
            hourlyTimelineTraffic.push(Math.round(aggregateActiveClicks / 4) + Math.floor(Math.random() * 10));
            if (hourlyTimelineTraffic.length > 18) {
                hourlyTimelineTraffic.shift(); // keep visual horizon structured
            }

            // Distribute increments across geography points
            if (Math.random() > 0.5) {
                const geoIndex = Math.floor(Math.random() * geoAccessStats.length);
                geoAccessStats[geoIndex].requests += Math.floor(Math.random() * 3) + 1;
                
                // Recalculate percentages
                const totalRequests = geoAccessStats.reduce((sum, g) => sum + g.requests, 0);
                geoAccessStats.forEach(g => {
                    g.percentage = Math.round((g.requests / totalRequests) * 100);
                });
                renderGeoHotspots();
            }

            // Draw Updated Graphs
            renderLedgerTable();
            renderTrafficChart();
            updateAggregationCards();
        }
    }

    // Direct interface into core system's alert notification system (Toast integration check)
    function triggerNotification(msg) {
        const coreToast = document.getElementById('toast');
        const coreToastText = document.getElementById('toast-text');
        
        if (coreToast && coreToastText) {
            coreToastText.innerText = msg;
            coreToast.classList.add('visible');
            setTimeout(() => {
                coreToast.classList.remove('visible');
            }, 3000);
        } else {
            console.log(`[Dispatch Audits]: ${msg}`);
        }
    }

})();