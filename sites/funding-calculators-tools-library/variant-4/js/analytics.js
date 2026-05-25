(function () {
    // Inject Custom Styles for Link Tracking & Download Analytics Dashboard
    const styles = `
        .analytics-dashboard-section {
            max-width: 1440px;
            margin: 80px auto;
            padding: 0 40px;
        }
        @media (max-width: 768px) {
            .analytics-dashboard-section {
                padding: 0 20px;
                margin: 40px auto;
            }
        }
        .analytics-grid {
            display: grid;
            grid-template-columns: 1.3fr 0.7fr;
            gap: 30px;
        }
        @media (max-width: 1024px) {
            .analytics-grid {
                grid-template-columns: 1fr;
            }
        }
        /* Dashboard Container Components */
        .analytics-card {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            box-shadow: var(--brutal-shadow);
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 30px;
        }
        .analytics-card-title {
            font-family: var(--font-display);
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-primary);
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 12px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .analytics-card-title span.badge {
            font-size: 11px;
            background: var(--accent-magenta);
            color: #000;
            padding: 4px 10px;
            border: 2px solid #000;
            box-shadow: var(--brutal-shadow-hover);
        }
        /* Top Mini Stats Bar */
        .stats-stripe {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-stripe-box {
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            padding: 18px;
            box-shadow: var(--brutal-shadow-hover);
            border-radius: 4px;
            position: relative;
            overflow: hidden;
        }
        .stat-stripe-box::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: var(--border-color);
        }
        .stat-stripe-box.cyan::after { background: var(--accent-cyan); }
        .stat-stripe-box.magenta::after { background: var(--accent-magenta); }
        .stat-stripe-box.orange::after { background: var(--accent-orange); }
        .stat-stripe-box.lime::after { background: #39ff14; }

        .stat-stripe-val {
            font-family: var(--font-display);
            font-size: 32px;
            font-weight: 800;
            line-height: 1;
        }
        .stat-stripe-label {
            font-size: 11px;
            text-transform: uppercase;
            color: var(--text-secondary);
            font-weight: 700;
            letter-spacing: 1px;
            margin-top: 6px;
        }
        /* Interactive Table Styling */
        .analytics-table-wrapper {
            overflow-x: auto;
        }
        .analytics-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }
        .analytics-table th {
            background: var(--bg-tertiary);
            border-bottom: 3px solid var(--border-color);
            padding: 12px 16px;
            font-family: var(--font-display);
            font-size: 11px;
            text-transform: uppercase;
            color: var(--text-secondary);
            letter-spacing: 1px;
        }
        .analytics-table td {
            padding: 16px;
            border-bottom: 1px solid var(--border-color);
            font-size: 13px;
            vertical-align: middle;
        }
        .analytics-table tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }
        .filename-cell {
            font-weight: 700;
            color: var(--text-primary);
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .filename-cell span.size {
            font-size: 10px;
            color: var(--text-secondary);
            font-weight: normal;
        }
        .link-hash {
            font-family: monospace;
            background: var(--bg-tertiary);
            color: var(--accent-cyan);
            border: 1px solid var(--border-color);
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
        }
        .link-hash.revoked {
            text-decoration: line-through;
            color: var(--text-secondary);
            opacity: 0.6;
        }
        /* Dynamic Geolocations Display */
        .geo-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .geo-pill {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            font-size: 10px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
            color: var(--text-secondary);
        }
        .geo-pill span.count {
            color: var(--accent-orange);
            margin-left: 2px;
        }
        /* Revoke Toggle Switch */
        .revoke-toggle {
            cursor: pointer;
            border: 2px solid #000;
            box-shadow: 2px 2px 0px #000;
            font-weight: 800;
            font-size: 11px;
            padding: 6px 12px;
            text-transform: uppercase;
            font-family: var(--font-display);
            transition: all 0.1s ease;
            display: inline-block;
        }
        .revoke-toggle.active {
            background: var(--accent-magenta);
            color: #000;
        }
        .revoke-toggle.revoked {
            background: var(--bg-tertiary);
            color: var(--text-secondary);
            border-color: var(--border-color);
            box-shadow: none;
        }
        /* Security Log Stream Terminal */
        .log-terminal {
            background: #050608;
            border: 2px solid var(--border-color);
            border-radius: 4px;
            font-family: monospace;
            padding: 16px;
            height: 240px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 11px;
            color: #39ff14; /* Lime terminal color */
        }
        .log-line {
            line-height: 1.4;
            border-left: 2px solid transparent;
            padding-left: 8px;
        }
        .log-line.allowed { border-color: var(--accent-cyan); }
        .log-line.blocked { border-color: var(--accent-magenta); color: var(--accent-magenta); }
        .log-line.system { border-color: var(--accent-orange); color: var(--accent-orange); }

        /* Generator Box Customization */
        .gen-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .gen-input {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 12px;
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 600;
            outline: none;
            width: 100%;
        }
        .gen-input:focus {
            border-color: var(--accent-magenta);
        }
        .simulate-row-btn {
            background: var(--accent-cyan);
            color: #000;
            font-weight: 800;
            font-size: 10px;
            padding: 4px 8px;
            border: 1px solid #000;
            cursor: pointer;
            text-transform: uppercase;
            font-family: var(--font-display);
            box-shadow: 1px 1px 0px #000;
            transition: all 0.1s;
        }
        .simulate-row-btn:hover {
            transform: translate(1px, 1px);
            box-shadow: none;
        }
    `;

    // Initialize mock database for link security tracking
    let activeSecLinks = [
        { id: 'lnk-1', filename: 'Core_Funding_Strategy_2024.pdf', size: '4.2 MB', hash: 'cf-902a1', downloads: 87, active: true, geo: { US: 52, CA: 21, GB: 14 } },
        { id: 'lnk-2', filename: 'Q3_Broker_Fee_Schedules.xlsx', size: '1.8 MB', hash: 'bf-411c9', downloads: 142, active: true, geo: { US: 90, DE: 32, SG: 20 } },
        { id: 'lnk-3', filename: 'SBA_Microloan_Guidelines.pdf', size: '5.1 MB', hash: 'sl-302x8', downloads: 19, active: false, geo: { US: 15, AU: 4 } }
    ];

    const countriesList = ['US', 'CA', 'GB', 'DE', 'SG', 'AU', 'FR', 'JP'];

    // Inject Styles into Head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Render HTML Framework dynamically
    const dashboardSection = document.createElement('section');
    dashboardSection.id = 'security-analytics';
    dashboardSection.className = 'analytics-dashboard-section';

    dashboardSection.innerHTML = `
        <div class="section-headline">
            <div>
                <p style="text-transform: uppercase; font-size: 11px; font-weight: 800; color: var(--accent-cyan); letter-spacing: 2px;">Real-Time Shield</p>
                <h2 style="margin-top: 5px;">Secure Link <span>Analytics</span></h2>
            </div>
            <p style="color: var(--text-secondary); max-width: 450px; font-size: 14px; text-align: right;">
                Track attachment access vectors, audit geographic downloads, and execute instant programmatic revoking controls.
            </p>
        </div>

        <!-- Metric Stripe -->
        <div class="stats-stripe">
            <div class="stat-stripe-box cyan">
                <div class="stat-stripe-val text-glow-cyan" id="track-stat-active">2</div>
                <div class="stat-stripe-label">Active Secure Links</div>
            </div>
            <div class="stat-stripe-box orange">
                <div class="stat-stripe-val text-glow-orange" id="track-stat-downloads">248</div>
                <div class="stat-stripe-label">Total Downloads Audit</div>
            </div>
            <div class="stat-stripe-box magenta">
                <div class="stat-stripe-val text-glow-magenta" id="track-stat-revoked">1</div>
                <div class="stat-stripe-label">Revoked Corridors</div>
            </div>
            <div class="stat-stripe-box lime">
                <div class="stat-stripe-val" id="track-stat-health" style="color: #39ff14; text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);">100%</div>
                <div class="stat-stripe-label">Audited Corridor Safety</div>
            </div>
        </div>

        <!-- Main Analytics Workspace Grid -->
        <div class="analytics-grid">
            
            <!-- Link Access Controls Column -->
            <div class="analytics-card">
                <div class="analytics-card-title">
                    Active Share Link Matrix
                    <span class="badge">SECURED VIA AES-256</span>
                </div>
                
                <div class="analytics-table-wrapper">
                    <table class="analytics-table">
                        <thead>
                            <tr>
                                <th style="width: 30%;">Document Attachment</th>
                                <th style="width: 20%;">Secure Corridor</th>
                                <th style="width: 15%;">Downloads</th>
                                <th style="width: 20%;">Geographical Geo-Audit</th>
                                <th style="width: 15%; text-align: right;">Authorization</th>
                            </tr>
                        </thead>
                        <tbody id="sec-links-tbody">
                            <!-- Dynamic Row Injection -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Terminal and Generator Sidebar -->
            <div style="display: flex; flex-direction: column; gap: 30px;">
                
                <!-- Attachment Secure Link Generator -->
                <div class="analytics-card" style="margin-bottom: 0;">
                    <div class="analytics-card-title">Generate Audit Link</div>
                    <form class="gen-form" id="secure-link-generator-form">
                        <div>
                            <label style="display:block; font-size:11px; text-transform:uppercase; color:var(--text-secondary); margin-bottom:6px; font-weight:700;">Document/Attachment Title</label>
                            <input type="text" id="input-filename" class="gen-input" placeholder="e.g. Q4_Expansion_Deck.pdf" required>
                        </div>
                        <div>
                            <label style="display:block; font-size:11px; text-transform:uppercase; color:var(--text-secondary); margin-bottom:6px; font-weight:700;">Est. Asset Footprint</label>
                            <input type="text" id="input-size" class="gen-input" placeholder="e.g. 3.5 MB" required>
                        </div>
                        <button type="submit" class="btn-action" style="width: 100%; border-radius: 0; box-shadow: 4px 4px 0px #000; text-align: center;">Inject Secure Corridor</button>
                    </form>
                </div>

                <!-- Event Log Console Stream -->
                <div class="analytics-card" style="margin-bottom: 0;">
                    <div class="analytics-card-title" style="margin-bottom: 12px;">Active Security Event Stream</div>
                    <div class="log-terminal" id="sec-log-stream">
                        <!-- Terminal stream fills in dynamically -->
                    </div>
                </div>

            </div>
        </div>
    `;

    // Inject Dashboard into page cleanly before the strategy banner
    const targetSection = document.getElementById('strategy');
    if (targetSection) {
        targetSection.parentNode.insertBefore(dashboardSection, targetSection);
    } else {
        // Fallback injection before footer
        const mainFooter = document.querySelector('footer');
        if (mainFooter) {
            mainFooter.parentNode.insertBefore(dashboardSection, mainFooter);
        }
    }

    // Capture Local Components
    const tbody = document.getElementById('sec-links-tbody');
    const generatorForm = document.getElementById('secure-link-generator-form');
    const logStream = document.getElementById('sec-log-stream');

    const statActive = document.getElementById('track-stat-active');
    const statDownloads = document.getElementById('track-stat-downloads');
    const statRevoked = document.getElementById('track-stat-revoked');
    const statHealth = document.getElementById('track-stat-health');

    // Notification proxy wrapper checking standard components
    function triggerNotification(text) {
        if (window.showNotification) {
            window.showNotification(text);
        } else {
            const toastEl = document.getElementById('toast');
            const toastTextEl = document.getElementById('toast-text');
            if (toastEl && toastTextEl) {
                toastTextEl.innerText = text;
                toastEl.classList.add('visible');
                setTimeout(() => toastEl.classList.remove('visible'), 3000);
            }
        }
    }

    // Stream logger helper
    function appendLog(message, type = 'allowed') {
        const time = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.innerText = `[${time}] ${message}`;
        logStream.prepend(line);
        // keep logs tidy to avoid terminal overflowing memory
        if (logStream.children.length > 30) {
            logStream.removeChild(logStream.lastChild);
        }
    }

    // Refresh core statistics displays
    function updateMetrics() {
        const activeCount = activeSecLinks.filter(l => l.active).length;
        const revokedCount = activeSecLinks.filter(l => !l.active).length;
        const totalDl = activeSecLinks.reduce((sum, l) => sum + l.downloads, 0);

        statActive.innerText = activeCount;
        statDownloads.innerText = totalDl;
        statRevoked.innerText = revokedCount;

        const healthRatio = activeSecLinks.length > 0 
            ? Math.round((activeCount / activeSecLinks.length) * 100) 
            : 100;
        statHealth.innerText = `${healthRatio}%`;
    }

    // Toggle Link security status dynamically
    window.toggleSecureLink = function (id) {
        const item = activeSecLinks.find(l => l.id === id);
        if (!item) return;

        item.active = !item.active;
        if (!item.active) {
            appendLog(`SECURE CORRIDOR "${item.hash.toUpperCase()}" REVOKED PERMANENTLY BY OPERATOR`, 'blocked');
            triggerNotification(`Revoked Access Corridor: ${item.hash}`);
        } else {
            appendLog(`SECURE CORRIDOR "${item.hash.toUpperCase()}" RE-AUTHORIZED`, 'system');
            triggerNotification(`Re-authorized Corridor: ${item.hash}`);
        }

        renderRows();
        updateMetrics();
    };

    // Simulate link clicks for real-time visualization data
    window.simulateLinkAccess = function (id) {
        const item = activeSecLinks.find(l => l.id === id);
        if (!item) return;

        if (!item.active) {
            appendLog(`BLOCKED ACCESS ATTEMPT to revoked corridor ${item.hash} from Tokyo, JP`, 'blocked');
            triggerNotification(`Threat Blocked: Revoked Link Owed`);
            return;
        }

        // Randomize location
        const randomCountry = countriesList[Math.floor(Math.random() * countriesList.length)];
        item.downloads += 1;
        item.geo[randomCountry] = (item.geo[randomCountry] || 0) + 1;

        appendLog(`Asset Corridor "${item.hash}" downloaded from ${randomCountry}. Authorization: GRANTED`, 'allowed');
        triggerNotification(`Simulator: Link ${item.hash} Accessed`);

        renderRows();
        updateMetrics();
    };

    // Dynamic renderer logic matching neobrutalist designs
    function renderRows() {
        tbody.innerHTML = '';
        activeSecLinks.forEach(link => {
            const tr = document.createElement('tr');

            // Construct geo pills strings
            const geoHtml = Object.entries(link.geo)
                .map(([country, cnt]) => `<span class="geo-pill">${country}<span class="count">${cnt}</span></span>`)
                .join('');

            tr.innerHTML = `
                <td>
                    <div class="filename-cell">
                        ${link.filename}
                        <span class="size">${link.size}</span>
                    </div>
                </td>
                <td>
                    <span class="link-hash ${link.active ? '' : 'revoked'}">${link.hash}</span>
                    ${link.active ? `<button class="simulate-row-btn" onclick="simulateLinkAccess('${link.id}')" style="margin-left:8px;">Access</button>` : ''}
                </td>
                <td style="font-weight: 700; font-family: var(--font-display); font-size: 15px;">
                    ${link.downloads}
                </td>
                <td>
                    <div class="geo-pills">
                        ${geoHtml}
                    </div>
                </td>
                <td style="text-align: right;">
                    <div class="revoke-toggle ${link.active ? 'active' : 'revoked'}" onclick="toggleSecureLink('${link.id}')">
                        ${link.active ? 'Active' : 'Revoked'}
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Handle Generation Action Intercept
    generatorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const filename = document.getElementById('input-filename').value.trim();
        const size = document.getElementById('input-size').value.trim();
        if (!filename || !size) return;

        // Form unique custom corridor key identifiers
        const keyHash = Math.random().toString(36).substring(2, 7);
        const uniqueId = `lnk-${Date.now()}`;

        const newLink = {
            id: uniqueId,
            filename: filename,
            size: size,
            hash: `cf-${keyHash}`,
            downloads: 0,
            active: true,
            geo: {}
        };

        activeSecLinks.push(newLink);
        appendLog(`INITIALIZED SECURE SHIELD FOR ASSET: "${filename}" -> Allocated Key Corridor: ${newLink.hash}`, 'system');
        triggerNotification(`Secured: ${newLink.hash}`);

        // Reset forms cleanly
        generatorForm.reset();

        renderRows();
        updateMetrics();
    });

    // Run Initial Setups
    renderRows();
    updateMetrics();
    appendLog("Secure Dynamic Link Monitoring Shield Engine initialized... Status: OPERATIONAL", "system");
})();