<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monthly ROI Summary | Vector Aura</title>
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
            to { transform: translate(150px, 100px) rotate(30deg); }
        }

        .roi-container {
            width: 100%;
            max-width: 1100px;
            background: var(--card-bg);
            backdrop-filter: blur(24px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
        }

        .header-title h1 {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(to right, #fff, var(--text-dim));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .date-badge {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            padding: 8px 16px;
            border-radius: 10px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            color: var(--accent);
        }

        /* Top Level Metrics */
        .metrics-summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }

        .metric-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            padding: 24px;
            border-radius: 20px;
            transition: transform 0.3s ease;
        }

        .metric-card:hover {
            border-color: rgba(139, 92, 246, 0.3);
            background: rgba(255, 255, 255, 0.04);
        }

        .metric-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-dim);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .metric-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .metric-trend {
            font-size: 12px;
            color: var(--success);
            display: flex;
            align-items: center;
            gap: 4px;
        }

        /* Correlation Table (Notion Style) */
        .notion-table-wrap {
            margin-top: 20px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
        }

        .table-header {
            padding: 16px 24px;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .table-header h3 {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-main);
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
            padding: 16px 24px;
            border-bottom: 1px solid var(--border);
            color: var(--text-main);
        }

        tr:last-child td { border-bottom: none; }

        tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }

        .tag {
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
        }

        .tag-blue { background: rgba(6, 182, 212, 0.15); color: var(--accent); }
        .tag-purple { background: rgba(139, 92, 246, 0.15); color: var(--primary); }
        .tag-pink { background: rgba(236, 72, 153, 0.15); color: var(--secondary); }

        .bar-container {
            width: 100px;
            height: 6px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            overflow: hidden;
            display: inline-block;
            vertical-align: middle;
            margin-right: 8px;
        }

        .bar-fill {
            height: 100%;
            background: var(--primary);
            border-radius: 10px;
        }

        /* Analytics Footer */
        .analytics-footer {
            margin-top: 32px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        .insight-box {
            background: linear-gradient(145deg, rgba(139, 92, 246, 0.05), transparent);
            border: 1px solid var(--border);
            padding: 20px;
            border-radius: 16px;
        }

        .insight-box h4 {
            font-size: 12px;
            color: var(--primary);
            text-transform: uppercase;
            margin-bottom: 12px;
        }

        .insight-box p {
            font-size: 14px;
            line-height: 1.6;
            color: var(--text-dim);
        }

    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <main class="roi-container">
        <header class="header">
            <div class="header-title">
                <h1>Monthly ROI Summary</h1>
                <p style="color: var(--text-dim); font-size: 14px; margin-top: 4px;">Gmail & CRM Integrated Performance Data</p>
            </div>
            <div class="date-badge">OCTOBER 2023 // ANALYZE PHASE</div>
        </header>

        <section class="metrics-summary">
            <div class="metric-card">
                <div class="metric-label">Avg. Open Rate</div>
                <div class="metric-value">68.4%</div>
                <div class="metric-trend">↑ 4.2% vs last month</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Response Velocity</div>
                <div class="metric-value">4.2h</div>
                <div class="metric-trend">↓ 12% faster</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Meetings Booked</div>
                <div class="metric-value">52</div>
                <div class="metric-trend">↑ 8 new this week</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Projected ROI</div>
                <div class="metric-value">12.4x</div>
                <div class="metric-trend" style="color: var(--accent);">Target: 10.0x</div>
            </div>
        </section>

        <section class="notion-table-wrap">
            <div class="table-header">
                <h3>Campaign Correlation Matrix</h3>
                <div style="font-size: 12px; color: var(--text-dim);">Linked to: <u>Master Outreach DB</u></div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Niche / Segment</th>
                        <th>Status</th>
                        <th>Engagement</th>
                        <th>Qualified Leads</th>
                        <th>Cost/Meeting</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>SaaS Founders (Series A)</strong></td>
                        <td><span class="tag tag-blue">High Intent</span></td>
                        <td>
                            <div class="bar-container"><div class="bar-fill" style="width: 82%;"></div></div>
                            82%
                        </td>
                        <td>18</td>
                        <td style="font-family: 'JetBrains Mono';">$142.00</td>
                    </tr>
                    <tr>
                        <td><strong>Fintech Lead Gen</strong></td>
                        <td><span class="tag tag-purple">Scaling</span></td>
                        <td>
                            <div class="bar-container"><div class="bar-fill" style="width: 54%; background: var(--secondary);"></div></div>
                            54%
                        </td>
                        <td>12</td>
                        <td style="font-family: 'JetBrains Mono';">$210.50</td>
                    </tr>
                    <tr>
                        <td><strong>Web3 Infrastructure</strong></td>
                        <td><span class="tag tag-pink">Testing</span></td>
                        <td>
                            <div class="bar-container"><div class="bar-fill" style="width: 31%; background: var(--accent);"></div></div>
                            31%
                        </td>
                        <td>4</td>
                        <td style="font-family: 'JetBrains Mono';">$480.00</td>
                    </tr>
                    <tr>
                        <td><strong>AI Automation Agencies</strong></td>
                        <td><span class="tag tag-blue">High Intent</span></td>
                        <td>
                            <div class="bar-container"><div class="bar-fill" style="width: 91%;"></div></div>
                            91%
                        </td>
                        <td>14</td>
                        <td style="font-family: 'JetBrains Mono';">$98.20</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="analytics-footer">
            <div class="insight-box">
                <h4>Vector Intelligence</h4>
                <p>Campaigns targeting "San Francisco" show 22% higher response rates when personalized with local weather or event data. Scaling suggested for Series A founders segment.</p>
            </div>
            <div class="insight-box" style="background: linear-gradient(145deg, rgba(6, 182, 212, 0.05), transparent);">
                <h4>Action Required</h4>
                <p>Web3 Infrastructure niche is underperforming. Recommend pivot to Layer 2 protocols or pausing spend to re-allocate to AI Automation segment.</p>
            </div>
        </section>
    </main>

</body>
</html><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monthly ROI Summary | Vector Aura</title>
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
            to { transform: translate(150px, 100px) rotate(30deg); }
        }

        .roi-container {
            width: 100%;
            max-width: 1100px;
            background: var(--card-bg);
            backdrop-filter: blur(24px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
        }

        .header-title h1 {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(to right, #fff, var(--text-dim));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .date-badge {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            padding: 8px 16px;
            border-radius: 10px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            color: var(--accent);
        }

        /* Top Level Metrics */
        .metrics-summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }

        .metric-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            padding: 24px;
            border-radius: 20px;
            transition: transform 0.3s ease;
        }

        .metric-card:hover {
            border-color: rgba(139, 92, 246, 0.3);
            background: rgba(255, 255, 255, 0.04);
        }

        .metric-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-dim);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .metric-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .metric-trend {
            font-size: 12px;
            color: var(--success);
            display: flex;
            align-items: center;
            gap: 4px;
        }

        /* Correlation Table (Notion Style) */
        .notion-table-wrap {
            margin-top: 20px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
        }

        .table-header {
            padding: 16px 24px;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .table-header h3 {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-main);
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
            padding: 16px 24px;
            border-bottom: 1px solid var(--border);
            color: var(--text-main);
        }

        tr:last-child td { border-bottom: none; }

        tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }

        .tag {
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
        }

        .tag-blue { background: rgba(6, 182, 212, 0.15); color: var(--accent); }
        .tag-purple { background: rgba(139, 92, 246, 0.15); color: var(--primary); }
        .tag-pink { background: rgba(236, 72, 153, 0.15); color: var(--secondary); }

        .bar-container {
            width: 100px;
            height: 6px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            overflow: hidden;
            display: inline-block;
            vertical-align: middle;
            margin-right: 8px;
        }

        .bar-fill {
            height: 100%;
            background: var(--primary);
            border-radius: 10px;
        }

        /* Analytics Footer */
        .analytics-footer {
            margin-top: 32px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        .insight-box {
            background: linear-gradient(145deg, rgba(139, 92, 246, 0.05), transparent);
            border: 1px solid var(--border);
            padding: 20px;
            border-radius: 16px;
        }

        .insight-box h4 {
            font-size: 12px;
            color: var(--primary);
            text-transform: uppercase;
            margin-bottom: 12px;
        }

        .insight-box p {
            font-size: 14px;
            line-height: 1.6;
            color: var(--text-dim);
        }

    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <main class="roi-container">
        <header class="header">
            <div class="header-title">
                <h1>Monthly ROI Summary</h1>
                <p style="color: var(--text-dim); font-size: 14px; margin-top: 4px;">Gmail & CRM Integrated Performance Data</p>
            </div>
            <div class="date-badge">OCTOBER 2023 // ANALYZE PHASE</div>
        </header>

        <section class="metrics-summary">
            <div class="metric-card">
                <div class="metric-label">Avg. Open Rate</div>
                <div class="metric-value">68.4%</div>
                <div class="metric-trend">↑ 4.2% vs last month</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Response Velocity</div>
                <div class="metric-value">4.2h</div>
                <div class="metric-trend">↓ 12% faster</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Meetings Booked</div>
                <div class="metric-value">52</div>
                <div class="metric-trend">↑ 8 new this week</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Projected ROI</div>
                <div class="metric-value">12.4x</div>
                <div class="metric-trend" style="color: var(--accent);">Target: 10.0x</div>
            </div>
        </section>

        <section class="notion-table-wrap">
            <div class="table-header">
                <h3>Campaign Correlation Matrix</h3>
                <div style="font-size: 12px; color: var(--text-dim);">Linked to: <u>Master Outreach DB</u></div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Niche / Segment</th>
                        <th>Status</th>
                        <th>Engagement</th>
                        <th>Qualified Leads</th>
                        <th>Cost/Meeting</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>SaaS Founders (Series A)</strong></td>
                        <td><span class="tag tag-blue">High Intent</span></td>
                        <td>
                            <div class="bar-container"><div class="bar-fill" style="width: 82%;"></div></div>
                            82%
                        </td>
                        <td>18</td>
                        <td style="font-family: 'JetBrains Mono';">$142.00</td>
                    </tr>
                    <tr>
                        <td><strong>Fintech Lead Gen</strong></td>
                        <td><span class="tag tag-purple">Scaling</span></td>
                        <td>
                            <div class="bar-container"><div class="bar-fill" style="width: 54%; background: var(--secondary);"></div></div>
                            54%
                        </td>
                        <td>12</td>
                        <td style="font-family: 'JetBrains Mono';">$210.50</td>
                    </tr>
                    <tr>
                        <td><strong>Web3 Infrastructure</strong></td>
                        <td><span class="tag tag-pink">Testing</span></td>
                        <td>
                            <div class="bar-container"><div class="bar-fill" style="width: 31%; background: var(--accent);"></div></div>
                            31%
                        </td>
                        <td>4</td>
                        <td style="font-family: 'JetBrains Mono';">$480.00</td>
                    </tr>
                    <tr>
                        <td><strong>AI Automation Agencies</strong></td>
                        <td><span class="tag tag-blue">High Intent</span></td>
                        <td>
                            <div class="bar-container"><div class="bar-fill" style="width: 91%;"></div></div>
                            91%
                        </td>
                        <td>14</td>
                        <td style="font-family: 'JetBrains Mono';">$98.20</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="analytics-footer">
            <div class="insight-box">
                <h4>Vector Intelligence</h4>
                <p>Campaigns targeting "San Francisco" show 22% higher response rates when personalized with local weather or event data. Scaling suggested for Series A founders segment.</p>
            </div>
            <div class="insight-box" style="background: linear-gradient(145deg, rgba(6, 182, 212, 0.05), transparent);">
                <h4>Action Required</h4>
                <p>Web3 Infrastructure niche is underperforming. Recommend pivot to Layer 2 protocols or pausing spend to re-allocate to AI Automation segment.</p>
            </div>
        </section>
    </main>

</body>
</html>