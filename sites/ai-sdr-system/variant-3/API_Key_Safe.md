<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Integration Health & API Safe | Vector Aura</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-deep: #030303;
            --card-bg: rgba(15, 15, 20, 0.7);
            --border: rgba(255, 255, 255, 0.08);
            --primary: #8b5cf6;
            --secondary: #ec4899;
            --accent: #06b6d4;
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
            --success: #10b981;
            --warning: #f59e0b;
            --error: #ef4444;
            --aura-1: rgba(139, 92, 246, 0.15);
            --aura-2: rgba(6, 182, 212, 0.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background-color: var(--bg-deep);
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
        }

        .aura-blob {
            position: fixed;
            width: 800px;
            height: 800px;
            border-radius: 50%;
            filter: blur(140px);
            z-index: -1;
            opacity: 0.4;
            pointer-events: none;
        }
        .aura-1 { top: -200px; right: -100px; background: var(--aura-1); }
        .aura-2 { bottom: -200px; left: -100px; background: var(--aura-2); }

        .dashboard-container {
            width: 100%;
            max-width: 1100px;
            background: var(--card-bg);
            backdrop-filter: blur(30px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
        }

        .nav-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border);
        }

        .nav-title h2 {
            font-size: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .nav-title span {
            color: var(--text-dim);
            font-size: 14px;
            font-weight: 400;
        }

        .security-badge {
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            color: var(--primary);
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        /* Integration Status Grid */
        .status-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }

        .status-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            padding: 24px;
            border-radius: 16px;
            transition: transform 0.3s ease;
        }

        .status-card:hover {
            border-color: rgba(255, 255, 255, 0.15);
            background: rgba(255, 255, 255, 0.04);
        }

        .card-head {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        }

        .card-head .label {
            font-size: 12px;
            color: var(--text-dim);
            font-weight: 600;
            text-transform: uppercase;
        }

        .indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        .indicator.online { background: var(--success); box-shadow: 0 0 10px var(--success); }
        .indicator.idle { background: var(--warning); }

        .card-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 20px;
            margin-bottom: 4px;
        }

        .card-subtext {
            font-size: 12px;
            color: var(--text-dim);
        }

        /* Logs Table */
        .logs-section {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
        }

        .logs-header {
            padding: 16px 24px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.01);
        }

        .logs-header h3 {
            font-size: 14px;
            font-weight: 600;
        }

        .table-wrapper {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        th {
            text-align: left;
            padding: 14px 24px;
            color: var(--text-dim);
            font-weight: 500;
            border-bottom: 1px solid var(--border);
            background: rgba(255, 255, 255, 0.01);
        }

        td {
            padding: 14px 24px;
            border-bottom: 1px solid var(--border);
            font-family: 'Inter', sans-serif;
        }

        .mono {
            font-family: 'JetBrains Mono', monospace;
            color: var(--accent);
            font-size: 12px;
        }

        .status-pill {
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
        }

        .pill-success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .pill-error { background: rgba(239, 68, 68, 0.1); color: var(--error); }

        /* API Key Safe Section */
        .key-safe {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .key-item {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            padding: 16px;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .key-info div:first-child {
            font-size: 11px;
            color: var(--text-dim);
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .key-info div:last-child {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            letter-spacing: 1px;
        }

        .btn-action {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: var(--text-main);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 11px;
            cursor: pointer;
            transition: 0.2s;
        }

        .btn-action:hover {
            background: var(--primary);
            border-color: var(--primary);
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <main class="dashboard-container">
        <nav class="nav-header">
            <div class="nav-title">
                <h2>Integration Control <span>/ API Health & Logs</span></h2>
            </div>
            <div class="security-badge">AES-256 Encrypted Storage</div>
        </nav>

        <section class="status-grid">
            <div class="status-card">
                <div class="card-head">
                    <span class="label">Make.com Webhooks</span>
                    <div class="indicator online"></div>
                </div>
                <div class="card-value">99.98%</div>
                <div class="card-subtext">Avg. Latency: 142ms</div>
            </div>
            <div class="status-card">
                <div class="card-head">
                    <span class="label">Google Scripts</span>
                    <div class="indicator online"></div>
                </div>
                <div class="card-value">Active</div>
                <div class="card-subtext">Last execution: 2m ago</div>
            </div>
            <div class="status-card">
                <div class="card-head">
                    <span class="label">OpenAI Usage</span>
                    <div class="indicator idle"></div>
                </div>
                <div class="card-value">$12.44</div>
                <div class="card-subtext">Current monthly tier</div>
            </div>
        </section>

        <section class="logs-section">
            <div class="logs-header">
                <h3>Execution History</h3>
                <div class="card-subtext">Auto-refreshing every 30s</div>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Operation</th>
                            <th>Execution ID</th>
                            <th>Latency</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>12:44:02 PM</td>
                            <td>Webhook: Send Email</td>
                            <td class="mono">mk_772x_09b</td>
                            <td>184ms</td>
                            <td><span class="status-pill pill-success">SUCCESS</span></td>
                        </tr>
                        <tr>
                            <td>12:42:15 PM</td>
                            <td>Script: Follow-up Logic</td>
                            <td class="mono">gas_991a_44c</td>
                            <td>1.2s</td>
                            <td><span class="status-pill pill-success">SUCCESS</span></td>
                        </tr>
                        <tr>
                            <td>12:40:01 PM</td>
                            <td>API: Lead Research</td>
                            <td class="mono">gpt_552q_11z</td>
                            <td>4.8s</td>
                            <td><span class="status-pill pill-error">TIMEOUT</span></td>
                        </tr>
                        <tr>
                            <td>12:38:44 PM</td>
                            <td>Webhook: CRM Sync</td>
                            <td class="mono">mk_118v_66p</td>
                            <td>92ms</td>
                            <td><span class="status-pill pill-success">SUCCESS</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="key-safe">
            <div class="key-item">
                <div class="key-info">
                    <div>Make.com API Key</div>
                    <div>••••••••••••4k92</div>
                </div>
                <button class="btn-action">Rotate Key</button>
            </div>
            <div class="key-item">
                <div class="key-info">
                    <div>Google OAuth Secret</div>
                    <div>••••••••••••88z1</div>
                </div>
                <button class="btn-action">Refresh</button>
            </div>
            <div class="key-item">
                <div class="key-info">
                    <div>OpenAI Primary</div>
                    <div>••••••••••••sk-0x</div>
                </div>
                <button class="btn-action">Rotate Key</button>
            </div>
            <div class="key-item">
                <div class="key-info">
                    <div>Notion Integration Token</div>
                    <div>••••••••••••nt_2</div>
                </div>
                <button class="btn-action">Verify</button>
            </div>
        </section>
    </main>

    <script>
        // Simulation of real-time log updates
        const tbody = document.querySelector('tbody');
        const operations = ['Webhook: Lead Inbound', 'Script: Qualifier', 'API: Tone Analysis', 'Webhook: Send'];
        const ids = ['mk_882', 'gas_119', 'gpt_443', 'mk_990'];

        setInterval(() => {
            const row = document.createElement('tr');
            const now = new Date().toLocaleTimeString();
            const op = operations[Math.floor(Math.random() * operations.length)];
            const id = ids[Math.floor(Math.random() * ids.length)] + Math.floor(Math.random() * 100) + 'x';
            
            row.innerHTML = `
                <td>${now}</td>
                <td>${op}</td>
                <td class="mono">${id}</td>
                <td>${Math.floor(Math.random() * 500)}ms</td>
                <td><span class="status-pill pill-success">SUCCESS</span></td>
            `;
            
            tbody.prepend(row);
            if(tbody.children.length > 8) tbody.lastElementChild.remove();
        }, 5000);
    </script>
</body>
</html>