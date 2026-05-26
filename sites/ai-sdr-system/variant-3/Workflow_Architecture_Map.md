<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workflow Architecture Map | Vector Aura</title>
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
            --success: #10b981;
            --warning: #f59e0b;
            --error: #ef4444;
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
            --aura-1: rgba(139, 92, 246, 0.15);
            --aura-2: rgba(6, 182, 212, 0.15);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-deep);
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
            min-height: 100vh;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
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
        .aura-1 { top: -200px; right: -100px; background: var(--aura-1); animation: drift 25s infinite alternate; }
        .aura-2 { bottom: -200px; left: -100px; background: var(--aura-2); animation: drift 30s infinite alternate-reverse; }

        @keyframes drift {
            from { transform: translate(0, 0) rotate(0deg); }
            to { transform: translate(150px, 100px) rotate(15deg); }
        }

        .container {
            width: 100%;
            max-width: 1200px;
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 24px;
        }

        .main-panel {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 32px;
            display: flex;
            flex-direction: column;
            gap: 32px;
        }

        .side-panel {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        /* Header Styles */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
        }

        .header h1 {
            font-size: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .header .status-indicator {
            font-size: 12px;
            font-weight: 600;
            color: var(--success);
            background: rgba(16, 185, 129, 0.1);
            padding: 4px 12px;
            border-radius: 100px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .pulse-dot {
            width: 6px;
            height: 6px;
            background: var(--success);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
        }

        /* Workflow Map (The Visualizer) */
        .workflow-viz {
            position: relative;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border);
            border-radius: 16px;
            height: 300px;
            padding: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
        }

        .viz-line {
            position: absolute;
            top: 50%;
            left: 10%;
            width: 80%;
            height: 1px;
            background: linear-gradient(90deg, var(--accent), var(--primary), var(--secondary));
            z-index: 1;
        }

        .viz-node {
            position: relative;
            z-index: 2;
            width: 60px;
            height: 60px;
            background: #0f172a;
            border: 1px solid var(--border);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .viz-node::after {
            content: attr(data-label);
            position: absolute;
            bottom: -30px;
            font-size: 10px;
            color: var(--text-dim);
            white-space: nowrap;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .viz-node.active {
            border-color: var(--accent);
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
        }

        /* Logs Table */
        .log-container {
            flex-grow: 1;
        }

        .log-header {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-dim);
            margin-bottom: 16px;
            text-transform: uppercase;
        }

        .log-table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
        }

        .log-table th {
            text-align: left;
            padding: 12px;
            color: var(--text-dim);
            border-bottom: 1px solid var(--border);
            font-weight: 500;
        }

        .log-table td {
            padding: 12px;
            border-bottom: 1px solid var(--border);
            color: var(--text-main);
        }

        .status-tag {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
        }

        .tag-success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .tag-warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }

        /* API Health Cards */
        .health-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            padding: 20px;
            border-radius: 16px;
            backdrop-filter: blur(10px);
        }

        .health-card h4 {
            font-size: 12px;
            color: var(--text-dim);
            margin-bottom: 12px;
            text-transform: uppercase;
        }

        .api-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 13px;
        }

        .latency-bar {
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.05);
            border-radius: 2px;
            margin-top: 4px;
            overflow: hidden;
        }

        .latency-fill {
            height: 100%;
            background: var(--accent);
            width: 75%;
        }

        /* Script Execution Stats */
        .execution-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .stat-box {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            padding: 16px;
            border-radius: 12px;
        }

        .stat-box span {
            display: block;
            font-size: 10px;
            color: var(--text-dim);
            margin-bottom: 4px;
        }

        .stat-box strong {
            font-family: 'JetBrains Mono', monospace;
            font-size: 18px;
            color: var(--text-main);
        }

        .flow-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            top: 50%;
            left: 10%;
            z-index: 3;
            transform: translateY(-50%);
            box-shadow: 0 0 10px #fff;
            animation: flow 4s infinite linear;
        }

        @keyframes flow {
            0% { left: 10%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { left: 90%; opacity: 0; }
        }
    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <div class="container">
        <main class="main-panel">
            <header class="header">
                <h1>
                    <svg class="icon" viewBox="0 0 24 24" width="20" height="20" stroke="var(--primary)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    Automation Architecture Map
                </h1>
                <div class="status-indicator">
                    <div class="pulse-dot"></div>
                    WEBHOOKS LIVE
                </div>
            </header>

            <section class="workflow-viz">
                <div class="viz-line"></div>
                <div class="flow-particle"></div>
                
                <div class="viz-node active" data-label="Make.com Trigger">⚡</div>
                <div class="viz-node" data-label="App Script Parser">⚙️</div>
                <div class="viz-node" data-label="Gmail API (Send)">✉️</div>
                <div class="viz-node" data-label="CRM Follow-up">🔄</div>
                <div class="viz-node" data-label="Success Log">📊</div>
            </section>

            <section class="log-container">
                <div class="log-header">Real-time Execution Logs (Make.com + Google Apps Script)</div>
                <table class="log-table">
                    <thead>
                        <tr>
                            <th>TIMESTAMP</th>
                            <th>OPERATION</th>
                            <th>SCENARIO ID</th>
                            <th>LATENCY</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody id="log-body">
                        <tr>
                            <td>14:22:01</td>
                            <td>POST /webhook/outbound</td>
                            <td>MK-92831</td>
                            <td>124ms</td>
                            <td><span class="status-tag tag-success">EXECUTED</span></td>
                        </tr>
                        <tr>
                            <td>14:21:45</td>
                            <td>SCRIPT: sendDraft()</td>
                            <td>GAS-MAIN</td>
                            <td>892ms</td>
                            <td><span class="status-tag tag-success">SUCCESS</span></td>
                        </tr>
                        <tr>
                            <td>14:18:12</td>
                            <td>GET /gmail/v1/threads</td>
                            <td>API-GML</td>
                            <td>310ms</td>
                            <td><span class="status-tag tag-success">200 OK</span></td>
                        </tr>
                        <tr>
                            <td>14:15:33</td>
                            <td>SCRIPT: checkFollowUp()</td>
                            <td>GAS-CRON</td>
                            <td>1.2s</td>
                            <td><span class="status-tag tag-warning">RETRY</span></td>
                        </tr>
                        <tr>
                            <td>14:12:04</td>
                            <td>POST /notion/v1/update</td>
                            <td>MK-00122</td>
                            <td>245ms</td>
                            <td><span class="status-tag tag-success">SYNCED</span></td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </main>

        <aside class="side-panel">
            <section class="health-card">
                <h4>API Connectivity</h4>
                <div class="api-row">
                    <span>Make.com Webhook</span>
                    <span style="color: var(--success)">Stable</span>
                </div>
                <div class="latency-bar"><div class="latency-fill" style="width: 95%;"></div></div>
                
                <div class="api-row" style="margin-top: 16px;">
                    <span>Google Apps Script</span>
                    <span style="color: var(--success)">Online</span>
                </div>
                <div class="latency-bar"><div class="latency-fill" style="width: 82%; background: var(--primary);"></div></div>

                <div class="api-row" style="margin-top: 16px;">
                    <span>Notion Integration</span>
                    <span style="color: var(--success)">Active</span>
                </div>
                <div class="latency-bar"><div class="latency-fill" style="width: 70%; background: var(--secondary);"></div></div>
            </section>

            <section class="execution-stats">
                <div class="stat-box">
                    <span>24h Success</span>
                    <strong>99.8%</strong>
                </div>
                <div class="stat-box">
                    <span>Avg Latency</span>
                    <strong>342ms</strong>
                </div>
                <div class="stat-box">
                    <span>Queue Depth</span>
                    <strong>0</strong>
                </div>
                <div class="stat-box">
                    <span>Errors</span>
                    <strong>2</strong>
                </div>
            </section>

            <section class="health-card">
                <h4>Recent Triggers</h4>
                <div style="font-size: 11px; font-family: 'JetBrains Mono'; line-height: 1.6; color: var(--text-dim);">
                    <div style="color: var(--accent)">> Trigger: New Lead Qualified</div>
                    <div>> Action: Construct Draft (GAS)</div>
                    <div>> Result: Thread created 0x9f2..</div>
                    <div style="color: var(--secondary); margin-top: 8px;">> Trigger: 48h No Reply</div>
                    <div>> Action: Follow-up 1 Sent</div>
                    <div>> Status: 202 Accepted</div>
                </div>
            </section>
        </aside>
    </div>

    <script>
        // Simulate real-time log updates
        const logBody = document.getElementById('log-body');
        const operations = ['POST /webhook/outbound', 'SCRIPT: sendDraft()', 'GET /notion/pages', 'API: SyncCRM'];
        const ids = ['MK-92831', 'GAS-MAIN', 'NTN-CORE', 'API-GML'];

        function addLog() {
            const row = document.createElement('tr');
            const now = new Date();
            const time = now.getHours().toString().padStart(2, '0') + ':' + 
                         now.getMinutes().toString().padStart(2, '0') + ':' + 
                         now.getSeconds().toString().padStart(2, '0');
            
            row.innerHTML = `
                <td>${time}</td>
                <td>${operations[Math.floor(Math.random()*operations.length)]}</td>
                <td>${ids[Math.floor(Math.random()*ids.length)]}</td>
                <td>${Math.floor(Math.random()*500 + 100)}ms</td>
                <td><span class="status-tag tag-success">ACTIVE</span></td>
            `;
            
            logBody.prepend(row);
            if (logBody.children.length > 8) {
                logBody.removeChild(logBody.lastChild);
            }
        }

        setInterval(addLog, 4500);
    </script>
</body>
</html><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workflow Architecture Map | Vector Aura</title>
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
            --success: #10b981;
            --warning: #f59e0b;
            --error: #ef4444;
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
            --aura-1: rgba(139, 92, 246, 0.15);
            --aura-2: rgba(6, 182, 212, 0.15);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-deep);
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
            min-height: 100vh;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
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
        .aura-1 { top: -200px; right: -100px; background: var(--aura-1); animation: drift 25s infinite alternate; }
        .aura-2 { bottom: -200px; left: -100px; background: var(--aura-2); animation: drift 30s infinite alternate-reverse; }

        @keyframes drift {
            from { transform: translate(0, 0) rotate(0deg); }
            to { transform: translate(150px, 100px) rotate(15deg); }
        }

        .container {
            width: 100%;
            max-width: 1200px;
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 24px;
        }

        .main-panel {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 32px;
            display: flex;
            flex-direction: column;
            gap: 32px;
        }

        .side-panel {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        /* Header Styles */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
        }

        .header h1 {
            font-size: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .header .status-indicator {
            font-size: 12px;
            font-weight: 600;
            color: var(--success);
            background: rgba(16, 185, 129, 0.1);
            padding: 4px 12px;
            border-radius: 100px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .pulse-dot {
            width: 6px;
            height: 6px;
            background: var(--success);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
        }

        /* Workflow Map (The Visualizer) */
        .workflow-viz {
            position: relative;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border);
            border-radius: 16px;
            height: 300px;
            padding: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
        }

        .viz-line {
            position: absolute;
            top: 50%;
            left: 10%;
            width: 80%;
            height: 1px;
            background: linear-gradient(90deg, var(--accent), var(--primary), var(--secondary));
            z-index: 1;
        }

        .viz-node {
            position: relative;
            z-index: 2;
            width: 60px;
            height: 60px;
            background: #0f172a;
            border: 1px solid var(--border);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .viz-node::after {
            content: attr(data-label);
            position: absolute;
            bottom: -30px;
            font-size: 10px;
            color: var(--text-dim);
            white-space: nowrap;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .viz-node.active {
            border-color: var(--accent);
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
        }

        /* Logs Table */
        .log-container {
            flex-grow: 1;
        }

        .log-header {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-dim);
            margin-bottom: 16px;
            text-transform: uppercase;
        }

        .log-table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
        }

        .log-table th {
            text-align: left;
            padding: 12px;
            color: var(--text-dim);
            border-bottom: 1px solid var(--border);
            font-weight: 500;
        }

        .log-table td {
            padding: 12px;
            border-bottom: 1px solid var(--border);
            color: var(--text-main);
        }

        .status-tag {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
        }

        .tag-success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .tag-warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }

        /* API Health Cards */
        .health-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            padding: 20px;
            border-radius: 16px;
            backdrop-filter: blur(10px);
        }

        .health-card h4 {
            font-size: 12px;
            color: var(--text-dim);
            margin-bottom: 12px;
            text-transform: uppercase;
        }

        .api-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 13px;
        }

        .latency-bar {
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.05);
            border-radius: 2px;
            margin-top: 4px;
            overflow: hidden;
        }

        .latency-fill {
            height: 100%;
            background: var(--accent);
            width: 75%;
        }

        /* Script Execution Stats */
        .execution-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .stat-box {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            padding: 16px;
            border-radius: 12px;
        }

        .stat-box span {
            display: block;
            font-size: 10px;
            color: var(--text-dim);
            margin-bottom: 4px;
        }

        .stat-box strong {
            font-family: 'JetBrains Mono', monospace;
            font-size: 18px;
            color: var(--text-main);
        }

        .flow-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            top: 50%;
            left: 10%;
            z-index: 3;
            transform: translateY(-50%);
            box-shadow: 0 0 10px #fff;
            animation: flow 4s infinite linear;
        }

        @keyframes flow {
            0% { left: 10%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { left: 90%; opacity: 0; }
        }
    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <div class="container">
        <main class="main-panel">
            <header class="header">
                <h1>
                    <svg class="icon" viewBox="0 0 24 24" width="20" height="20" stroke="var(--primary)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    Automation Architecture Map
                </h1>
                <div class="status-indicator">
                    <div class="pulse-dot"></div>
                    WEBHOOKS LIVE
                </div>
            </header>

            <section class="workflow-viz">
                <div class="viz-line"></div>
                <div class="flow-particle"></div>
                
                <div class="viz-node active" data-label="Make.com Trigger">⚡</div>
                <div class="viz-node" data-label="App Script Parser">⚙️</div>
                <div class="viz-node" data-label="Gmail API (Send)">✉️</div>
                <div class="viz-node" data-label="CRM Follow-up">🔄</div>
                <div class="viz-node" data-label="Success Log">📊</div>
            </section>

            <section class="log-container">
                <div class="log-header">Real-time Execution Logs (Make.com + Google Apps Script)</div>
                <table class="log-table">
                    <thead>
                        <tr>
                            <th>TIMESTAMP</th>
                            <th>OPERATION</th>
                            <th>SCENARIO ID</th>
                            <th>LATENCY</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody id="log-body">
                        <tr>
                            <td>14:22:01</td>
                            <td>POST /webhook/outbound</td>
                            <td>MK-92831</td>
                            <td>124ms</td>
                            <td><span class="status-tag tag-success">EXECUTED</span></td>
                        </tr>
                        <tr>
                            <td>14:21:45</td>
                            <td>SCRIPT: sendDraft()</td>
                            <td>GAS-MAIN</td>
                            <td>892ms</td>
                            <td><span class="status-tag tag-success">SUCCESS</span></td>
                        </tr>
                        <tr>
                            <td>14:18:12</td>
                            <td>GET /gmail/v1/threads</td>
                            <td>API-GML</td>
                            <td>310ms</td>
                            <td><span class="status-tag tag-success">200 OK</span></td>
                        </tr>
                        <tr>
                            <td>14:15:33</td>
                            <td>SCRIPT: checkFollowUp()</td>
                            <td>GAS-CRON</td>
                            <td>1.2s</td>
                            <td><span class="status-tag tag-warning">RETRY</span></td>
                        </tr>
                        <tr>
                            <td>14:12:04</td>
                            <td>POST /notion/v1/update</td>
                            <td>MK-00122</td>
                            <td>245ms</td>
                            <td><span class="status-tag tag-success">SYNCED</span></td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </main>

        <aside class="side-panel">
            <section class="health-card">
                <h4>API Connectivity</h4>
                <div class="api-row">
                    <span>Make.com Webhook</span>
                    <span style="color: var(--success)">Stable</span>
                </div>
                <div class="latency-bar"><div class="latency-fill" style="width: 95%;"></div></div>
                
                <div class="api-row" style="margin-top: 16px;">
                    <span>Google Apps Script</span>
                    <span style="color: var(--success)">Online</span>
                </div>
                <div class="latency-bar"><div class="latency-fill" style="width: 82%; background: var(--primary);"></div></div>

                <div class="api-row" style="margin-top: 16px;">
                    <span>Notion Integration</span>
                    <span style="color: var(--success)">Active</span>
                </div>
                <div class="latency-bar"><div class="latency-fill" style="width: 70%; background: var(--secondary);"></div></div>
            </section>

            <section class="execution-stats">
                <div class="stat-box">
                    <span>24h Success</span>
                    <strong>99.8%</strong>
                </div>
                <div class="stat-box">
                    <span>Avg Latency</span>
                    <strong>342ms</strong>
                </div>
                <div class="stat-box">
                    <span>Queue Depth</span>
                    <strong>0</strong>
                </div>
                <div class="stat-box">
                    <span>Errors</span>
                    <strong>2</strong>
                </div>
            </section>

            <section class="health-card">
                <h4>Recent Triggers</h4>
                <div style="font-size: 11px; font-family: 'JetBrains Mono'; line-height: 1.6; color: var(--text-dim);">
                    <div style="color: var(--accent)">> Trigger: New Lead Qualified</div>
                    <div>> Action: Construct Draft (GAS)</div>
                    <div>> Result: Thread created 0x9f2..</div>
                    <div style="color: var(--secondary); margin-top: 8px;">> Trigger: 48h No Reply</div>
                    <div>> Action: Follow-up 1 Sent</div>
                    <div>> Status: 202 Accepted</div>
                </div>
            </section>
        </aside>
    </div>

    <script>
        // Simulate real-time log updates
        const logBody = document.getElementById('log-body');
        const operations = ['POST /webhook/outbound', 'SCRIPT: sendDraft()', 'GET /notion/pages', 'API: SyncCRM'];
        const ids = ['MK-92831', 'GAS-MAIN', 'NTN-CORE', 'API-GML'];

        function addLog() {
            const row = document.createElement('tr');
            const now = new Date();
            const time = now.getHours().toString().padStart(2, '0') + ':' + 
                         now.getMinutes().toString().padStart(2, '0') + ':' + 
                         now.getSeconds().toString().padStart(2, '0');
            
            row.innerHTML = `
                <td>${time}</td>
                <td>${operations[Math.floor(Math.random()*operations.length)]}</td>
                <td>${ids[Math.floor(Math.random()*ids.length)]}</td>
                <td>${Math.floor(Math.random()*500 + 100)}ms</td>
                <td><span class="status-tag tag-success">ACTIVE</span></td>
            `;
            
            logBody.prepend(row);
            if (logBody.children.length > 8) {
                logBody.removeChild(logBody.lastChild);
            }
        }

        setInterval(addLog, 4500);
    </script>
</body>
</html>