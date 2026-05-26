<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversion Funnel Report | Vector Aura</title>
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
            --aura-1: rgba(139, 92, 246, 0.15);
            --aura-2: rgba(6, 182, 212, 0.15);
            --success: #10b981;
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
        .aura-1 { top: -200px; right: -100px; background: var(--aura-1); animation: drift 25s infinite alternate; }
        .aura-2 { bottom: -200px; left: -100px; background: var(--aura-2); animation: drift 30s infinite alternate-reverse; }

        @keyframes drift {
            from { transform: translate(0, 0) rotate(0deg); }
            to { transform: translate(-100px, 100px) rotate(20deg); }
        }

        .report-container {
            width: 100%;
            max-width: 1100px;
            background: var(--card-bg);
            backdrop-filter: blur(30px);
            border: 1px solid var(--border);
            border-radius: 32px;
            padding: 48px;
            box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);
        }

        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 48px;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border);
        }

        .report-title h2 {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--primary);
            margin-bottom: 8px;
        }

        .report-title h1 {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(to right, #fff, var(--text-dim));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .date-range {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            color: var(--text-dim);
            background: rgba(255, 255, 255, 0.05);
            padding: 8px 16px;
            border-radius: 8px;
        }

        /* Funnel Visualization */
        .funnel-wrapper {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 60px;
        }

        .funnel-step {
            display: grid;
            grid-template-columns: 180px 1fr 120px;
            align-items: center;
            gap: 24px;
        }

        .funnel-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-dim);
        }

        .funnel-bar-container {
            height: 44px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--border);
            position: relative;
        }

        .funnel-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            border-radius: 0 6px 6px 0;
            transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1);
            position: relative;
        }

        .funnel-bar::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(rgba(255,255,255,0.1), transparent);
        }

        .funnel-value {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
            text-align: right;
            color: var(--text-main);
        }

        /* Stats Grid */
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-bottom: 48px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            padding: 24px;
            border-radius: 20px;
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-4px);
        }

        .stat-card .label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: var(--text-dim);
            margin-bottom: 16px;
        }

        .stat-card .value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .stat-card .trend {
            font-size: 12px;
            color: var(--success);
            display: flex;
            align-items: center;
            gap: 4px;
        }

        /* Correlation Table */
        .correlation-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 24px;
        }

        .correlation-table th {
            text-align: left;
            padding: 16px;
            font-size: 11px;
            text-transform: uppercase;
            color: var(--text-dim);
            border-bottom: 1px solid var(--border);
        }

        .correlation-table td {
            padding: 20px 16px;
            font-size: 14px;
            border-bottom: 1px solid var(--border);
        }

        .niche-tag {
            background: rgba(139, 92, 246, 0.1);
            color: var(--primary);
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
        }

        .roi-positive {
            color: var(--success);
            font-weight: 600;
        }

        .notion-sync-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: #fff;
            color: #000;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            margin-top: 40px;
        }

        @media (max-width: 768px) {
            .analytics-grid { grid-template-columns: 1fr; }
            .funnel-step { grid-template-columns: 1fr 1fr; }
            .funnel-label { grid-row: 1; }
            .funnel-value { grid-row: 1; text-align: right; }
            .funnel-bar-container { grid-column: span 2; }
        }
    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <main class="report-container">
        <header class="report-header">
            <div class="report-title">
                <h2>Analytics Stage</h2>
                <h1>Conversion Funnel Report</h1>
            </div>
            <div class="date-range">
                Last 30 Days: Oct 01 - Oct 31
            </div>
        </header>

        <section class="funnel-wrapper">
            <div class="funnel-step">
                <div class="funnel-label">Total Leads Found</div>
                <div class="funnel-bar-container">
                    <div class="funnel-bar" style="width: 100%;"></div>
                </div>
                <div class="funnel-value">2,840</div>
            </div>
            <div class="funnel-step">
                <div class="funnel-label">Emails Sent</div>
                <div class="funnel-bar-container">
                    <div class="funnel-bar" style="width: 85%;"></div>
                </div>
                <div class="funnel-value">2,414</div>
            </div>
            <div class="funnel-step">
                <div class="funnel-label">Opened (Gmail)</div>
                <div class="funnel-bar-container">
                    <div class="funnel-bar" style="width: 58%;"></div>
                </div>
                <div class="funnel-value">1,647</div>
            </div>
            <div class="funnel-step">
                <div class="funnel-label">Positive Replies</div>
                <div class="funnel-bar-container">
                    <div class="funnel-bar" style="width: 12%;"></div>
                </div>
                <div class="funnel-value">341</div>
            </div>
            <div class="funnel-step">
                <div class="funnel-label">Meetings Booked</div>
                <div class="funnel-bar-container">
                    <div class="funnel-bar" style="width: 4%;"></div>
                </div>
                <div class="funnel-value">114</div>
            </div>
        </section>

        <section class="analytics-grid">
            <div class="stat-card">
                <div class="label">Average Response Rate</div>
                <div class="value">14.1%</div>
                <div class="trend">↑ 2.4% vs prev. month</div>
            </div>
            <div class="stat-card">
                <div class="label">Cost Per Meeting</div>
                <div class="value">$42.10</div>
                <div class="trend">↓ $5.20 efficiency gain</div>
            </div>
            <div class="stat-card">
                <div class="label">Pipeline Generated</div>
                <div class="value">$284.5k</div>
                <div class="trend">↑ 18% month-over-month</div>
            </div>
        </section>

        <section>
            <h3 style="font-size: 16px; margin-bottom: 20px;">Input Correlation (Niche Performance)</h3>
            <table class="correlation-table">
                <thead>
                    <tr>
                        <th>Market Niche</th>
                        <th>Efficiency</th>
                        <th>Reply Rate</th>
                        <th>ROI Ratio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="niche-tag">SaaS Founders</span></td>
                        <td>High</td>
                        <td style="font-family: 'JetBrains Mono';">18.2%</td>
                        <td class="roi-positive">12.4x</td>
                    </tr>
                    <tr>
                        <td><span class="niche-tag">B2B Fintech</span></td>
                        <td>Medium</td>
                        <td style="font-family: 'JetBrains Mono';">9.5%</td>
                        <td class="roi-positive">8.1x</td>
                    </tr>
                    <tr>
                        <td><span class="niche-tag">E-commerce Ops</span></td>
                        <td>Very High</td>
                        <td style="font-family: 'JetBrains Mono';">22.4%</td>
                        <td class="roi-positive">15.2x</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <div class="notion-sync-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.459 4.208c.746-.606 1.706-.941 2.72-.941h10.421c.513 0 .997.234 1.312.631l2.459 3.094c.15.188.229.422.229.663v11.124c0 1.104-.896 2-2 2h-14.41c-1.104 0-2-.896-2-2v-11.124c0-.241.079-.475.229-.663l1.04-1.785zm1.541 1.792v11.5h12v-11.5h-12zm2 2h8v2h-8v-2zm0 4h8v2h-8v-2zm0 4h5v2h-5v-2z"/>
            </svg>
            SYNCED WITH NOTION CRM
        </div>
    </main>

    <script>
        // Trigger bar animations on load
        window.addEventListener('DOMContentLoaded', () => {
            const bars = document.querySelectorAll('.funnel-bar');
            bars.forEach(bar => {
                const targetWidth = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            });
        });
    </script>
</body>
</html>
```