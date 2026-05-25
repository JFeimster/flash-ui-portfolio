<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global SDR Command Center | Vector Aura</title>
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
            --warning: #f59e0b;
            --danger: #ef4444;
            --success: #10b981;
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
            --aura-1: rgba(139, 92, 246, 0.15);
            --aura-2: rgba(236, 72, 153, 0.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background-color: var(--bg-deep);
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
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

        .command-center {
            width: 100%;
            max-width: 1200px;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        /* Header Section */
        .glass-panel {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 32px;
        }

        .header-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
        }

        .title-group h1 {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(to right, #fff, var(--text-dim));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Configuration Bar */
        .config-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr) auto;
            gap: 16px;
            align-items: flex-end;
            padding: 20px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 16px;
            border: 1px solid var(--border);
        }

        .input-box label {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            color: var(--text-dim);
            margin-bottom: 8px;
            font-weight: 600;
        }

        .input-box input {
            width: 100%;
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--border);
            padding: 12px;
            border-radius: 10px;
            color: white;
            font-family: inherit;
        }

        .btn-launch {
            background: var(--primary);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            height: 42px;
            transition: 0.2s;
        }

        /* Quota Monitoring */
        .quota-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 20px;
        }

        .quota-card {
            padding: 24px;
        }

        .progress-container {
            margin-top: 16px;
            height: 8px;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            overflow: hidden;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            width: 68%;
            border-radius: 10px;
            box-shadow: 0 0 15px var(--primary);
        }

        /* Active Campaigns Table */
        .table-container {
            margin-top: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
        }

        th {
            text-align: left;
            font-size: 12px;
            color: var(--text-dim);
            padding: 12px;
            border-bottom: 1px solid var(--border);
        }

        td {
            padding: 16px 12px;
            border-bottom: 1px solid rgba(255,255,255,0.03);
            font-size: 14px;
        }

        .status-pill {
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
        }

        .status-active { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .status-paused { background: rgba(245, 158, 11, 0.1); color: var(--warning); }

        /* Quick Action Overrides */
        .overrides {
            display: flex;
            gap: 12px;
            padding-top: 24px;
            border-top: 1px solid var(--border);
        }

        .btn-override {
            flex: 1;
            padding: 14px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border);
            color: var(--text-main);
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-override:hover {
            background: rgba(255,255,255,0.08);
        }

        .btn-danger:hover {
            background: rgba(239, 68, 68, 0.1);
            border-color: var(--danger);
            color: var(--danger);
        }

        .stat-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 24px;
            margin-top: 4px;
        }
    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <main class="command-center">
        
        <!-- Orchestration Header -->
        <section class="glass-panel">
            <div class="header-main">
                <div class="title-group">
                    <h1>SDR Command Center</h1>
                    <p style="color: var(--text-dim); font-size: 14px; margin-top: 4px;">Global Outbound Orchestration Engine</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 11px; color: var(--text-dim); font-weight: 600;">SYSTEM UPTIME</div>
                    <div style="font-family: 'JetBrains Mono'; color: var(--success);">412:18:04</div>
                </div>
            </div>

            <div class="config-row">
                <div class="input-box">
                    <label>Target City</label>
                    <input type="text" placeholder="e.g. Austin, TX">
                </div>
                <div class="input-box">
                    <label>Market Niche</label>
                    <input type="text" placeholder="e.g. FinTech Series A">
                </div>
                <div class="input-box">
                    <label>Business Type</label>
                    <input type="text" placeholder="e.g. B2B SaaS">
                </div>
                <button class="btn-launch">Initialize Node</button>
            </div>
        </section>

        <!-- Quota & Metrics -->
        <section class="quota-grid">
            <div class="glass-panel quota-card">
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-size: 12px; color: var(--text-dim); font-weight: 600;">DAILY OUTREACH QUOTA</span>
                    <span style="font-size: 12px; color: var(--primary);">68% Complete</span>
                </div>
                <div class="stat-value">842 / 1,250</div>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                </div>
            </div>
            <div class="glass-panel quota-card">
                <span style="font-size: 12px; color: var(--text-dim); font-weight: 600;">ACTIVE NODES</span>
                <div class="stat-value">12</div>
                <div style="font-size: 11px; color: var(--success); margin-top: 8px;">● All systems nominal</div>
            </div>
            <div class="glass-panel quota-card">
                <span style="font-size: 12px; color: var(--text-dim); font-weight: 600;">EST. DELIVERABILITY</span>
                <div class="stat-value">98.4%</div>
                <div style="font-size: 11px; color: var(--text-dim); margin-top: 8px;">Across 4 sub-domains</div>
            </div>
        </section>

        <!-- Campaign Table -->
        <section class="glass-panel">
            <h2 style="font-size: 18px; margin-bottom: 16px;">Active Campaign Status</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>CAMPAIGN IDENTIFIER</th>
                            <th>TARGET NICHE</th>
                            <th>STATUS</th>
                            <th>SENT</th>
                            <th>REPLIES</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="font-weight: 600;">SF_SaaS_GenAI</td>
                            <td>Bay Area Founders</td>
                            <td><span class="status-pill status-active">ACTIVE</span></td>
                            <td style="font-family: 'JetBrains Mono';">241</td>
                            <td style="font-family: 'JetBrains Mono';">14</td>
                            <td><a href="#" style="color: var(--primary); font-size: 12px; text-decoration: none;">Inspect</a></td>
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">LDN_Fintech_V3</td>
                            <td>London B2B Ops</td>
                            <td><span class="status-pill status-active">ACTIVE</span></td>
                            <td style="font-family: 'JetBrains Mono';">189</td>
                            <td style="font-family: 'JetBrains Mono';">8</td>
                            <td><a href="#" style="color: var(--primary); font-size: 12px; text-decoration: none;">Inspect</a></td>
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">AUSTIN_Health</td>
                            <td>HealthTech C-Suite</td>
                            <td><span class="status-pill status-paused">PAUSED</span></td>
                            <td style="font-family: 'JetBrains Mono';">42</td>
                            <td style="font-family: 'JetBrains Mono';">1</td>
                            <td><a href="#" style="color: var(--primary); font-size: 12px; text-decoration: none;">Inspect</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Manual Overrides -->
            <div class="overrides" style="margin-top: 32px;">
                <button class="btn-override">
                    <span>⏸</span> Pause All Campaigns
                </button>
                <button class="btn-override">
                    <span>🔄</span> Refresh Proxy Rotations
                </button>
                <button class="btn-override">
                    <span>🧹</span> Flush Queue
                </button>
                <button class="btn-override btn-danger">
                    <span>🛑</span> EMERGENCY STOP
                </button>
            </div>
        </section>

    </main>

</body>
</html>