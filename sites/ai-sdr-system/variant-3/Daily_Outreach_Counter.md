<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global SDR Command Center</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-deep: #030303;
            --card-bg: rgba(15, 15, 20, 0.8);
            --border: rgba(255, 255, 255, 0.08);
            --primary: #8b5cf6;
            --secondary: #ec4899;
            --accent: #06b6d4;
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
            --success: #10b981;
            --warning: #f59e0b;
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
            padding: 16px;
            display: flex;
            justify-content: center;
        }

        .command-center {
            width: 100%;
            max-width: 800px;
            background: var(--card-bg);
            backdrop-filter: blur(25px);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            position: relative;
            overflow: hidden;
        }

        .aura-mini {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            filter: blur(80px);
            z-index: -1;
            opacity: 0.3;
            top: -100px;
            right: -100px;
            background: var(--primary);
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .title-group h2 {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.01em;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .title-group p {
            font-size: 12px;
            color: var(--text-dim);
        }

        /* Outreach Counter Section */
        .outreach-display {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 24px;
            margin-bottom: 32px;
            background: rgba(255, 255, 255, 0.02);
            padding: 20px;
            border-radius: 16px;
            border: 1px solid var(--border);
        }

        .counter-main {
            text-align: center;
            border-right: 1px solid var(--border);
            padding-right: 20px;
        }

        .counter-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 42px;
            font-weight: 700;
            background: linear-gradient(to bottom, #fff, var(--primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .counter-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-dim);
            margin-top: 4px;
        }

        .quota-progress {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 12px;
        }

        .progress-bar-wrap {
            height: 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }

        .progress-fill {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            width: 48.2%;
            border-radius: 4px;
            transition: width 1s ease-in-out;
        }

        /* Campaign Status */
        .campaign-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            margin-bottom: 32px;
        }

        .campaign-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            padding: 12px 16px;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .campaign-info span {
            display: block;
            font-size: 13px;
            font-weight: 500;
        }

        .campaign-info small {
            font-size: 11px;
            color: var(--text-dim);
        }

        .status-pill {
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .status-pill.live { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .status-pill.paused { background: rgba(245, 158, 11, 0.1); color: var(--warning); }

        /* Override Inputs */
        .input-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 24px;
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .control-group label {
            font-size: 10px;
            font-weight: 600;
            color: var(--text-dim);
            text-transform: uppercase;
        }

        .control-input {
            background: #0a0a0c;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 10px;
            color: #fff;
            font-size: 13px;
            outline: none;
        }

        .control-input:focus {
            border-color: var(--primary);
        }

        /* Action Buttons */
        .actions {
            display: flex;
            gap: 12px;
        }

        .btn {
            flex: 1;
            padding: 12px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
            border: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
            border: none;
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-main);
        }

        .btn:hover {
            filter: brightness(1.2);
            transform: translateY(-1px);
        }

        .btn-danger {
            color: #ef4444;
            border-color: rgba(239, 68, 68, 0.2);
            background: rgba(239, 68, 68, 0.05);
        }

    </style>
</head>
<body>

    <div class="command-center">
        <div class="aura-mini"></div>
        
        <header>
            <div class="title-group">
                <h2>🛰️ SDR COMMAND CENTER</h2>
                <p>Global Orchestration Layer</p>
            </div>
            <div style="font-family: 'JetBrains Mono'; font-size: 11px; color: var(--accent);">
                SYSTEM_TIME: 14:42:01
            </div>
        </header>

        <section class="outreach-display">
            <div class="counter-main">
                <div class="counter-value" id="count">482</div>
                <div class="counter-label">Total Sent Today</div>
            </div>
            <div class="quota-progress">
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: var(--text-dim)">Daily Quota Progress</span>
                    <span style="font-weight: 600">48.2%</span>
                </div>
                <div class="progress-bar-wrap">
                    <div class="progress-fill"></div>
                </div>
                <div style="font-size: 11px; color: var(--text-dim); font-style: italic;">
                    Target: 1,000 / Day • Resetting in 9h 18m
                </div>
            </div>
        </section>

        <div class="campaign-grid">
            <div class="campaign-item">
                <div class="campaign-info">
                    <span>US_Fintech_SF</span>
                    <small>42 Leads Left</small>
                </div>
                <div class="status-pill live">Live</div>
            </div>
            <div class="campaign-item">
                <div class="campaign-info">
                    <span>UK_SaaS_Seed</span>
                    <small>0 Leads Left</small>
                </div>
                <div class="status-pill paused">Idle</div>
            </div>
        </div>

        <div class="input-row">
            <div class="control-group">
                <label>Active City</label>
                <input type="text" class="control-input" value="San Francisco">
            </div>
            <div class="control-group">
                <label>Niche Focus</label>
                <input type="text" class="control-input" value="B2B Fintech">
            </div>
            <div class="control-group">
                <label>Daily Quota</label>
                <input type="number" class="control-input" value="1000">
            </div>
        </div>

        <div class="actions">
            <button class="btn btn-secondary">🔄 Sync DB</button>
            <button class="btn btn-primary">🚀 Update Campaign</button>
            <button class="btn btn-danger">🛑 Kill Switch</button>
        </div>
    </div>

    <script>
        // Subtle counter increment simulation
        const countEl = document.getElementById('count');
        setInterval(() => {
            if(Math.random() > 0.8) {
                let current = parseInt(countEl.innerText);
                countEl.innerText = current + 1;
            }
        }, 5000);
    </script>
</body>
</html>