<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lead Intelligence | Qualification Criteria</title>
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
            width: 600px;
            height: 600px;
            border-radius: 50%;
            filter: blur(120px);
            z-index: -1;
            opacity: 0.4;
            pointer-events: none;
        }
        .aura-1 { top: -100px; left: -100px; background: var(--aura-1); }
        .aura-2 { bottom: -100px; right: -100px; background: var(--aura-2); }

        .database-container {
            width: 100%;
            max-width: 1000px;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 32px;
        }

        .breadcrumb {
            display: flex;
            gap: 8px;
            font-size: 12px;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: -16px;
        }

        .lead-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
        }

        .lead-info h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .lead-meta {
            display: flex;
            gap: 12px;
        }

        .tag {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            color: var(--text-dim);
        }

        .tag.blue { border-color: var(--accent); color: var(--accent); }
        .tag.purple { border-color: var(--primary); color: var(--primary); }

        .grid-layout {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 32px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-dim);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* AI Research Block */
        .research-panel {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px;
        }

        .ai-note {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #cbd5e1;
        }

        .ai-note span { color: var(--primary); }

        .insight-card {
            margin-top: 20px;
            padding: 16px;
            background: rgba(139, 92, 246, 0.05);
            border-left: 2px solid var(--primary);
            border-radius: 0 8px 8px 0;
        }

        /* Checklist Styles */
        .checklist-panel {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .check-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            padding: 16px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 14px;
            transition: 0.2s;
            cursor: pointer;
        }

        .check-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--text-dim);
        }

        .checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid var(--border);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.2s;
        }

        .check-item.done .checkbox {
            background: var(--success);
            border-color: var(--success);
        }

        .check-item.done .checkbox::after {
            content: '✓';
            color: white;
            font-size: 12px;
            font-weight: 800;
        }

        .check-label {
            font-size: 14px;
            font-weight: 500;
        }

        .check-item.done .check-label {
            color: var(--text-dim);
            text-decoration: line-through;
        }

        .status-pill {
            margin-left: auto;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
        }

        .pipeline-status {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 100px;
            width: fit-content;
        }

        .step-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--primary);
            box-shadow: 0 0 10px var(--primary);
        }
    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <main class="database-container">
        <nav class="breadcrumb">
            SDR Engine / Lead Database / <span style="color: var(--text-main)">Qualification Check</span>
        </nav>

        <header class="lead-header">
            <div class="lead-info">
                <div class="pipeline-status" style="margin-bottom: 16px;">
                    <div class="step-indicator"></div>
                    <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em;">PHASE: QUALIFICATION</span>
                </div>
                <h1>Sarah Chen</h1>
                <div class="lead-meta">
                    <span class="tag">CTO @ Nexus Logic</span>
                    <span class="tag blue">Niche: B2B Fintech</span>
                    <span class="tag purple">Series B Startup</span>
                </div>
            </div>
            <div class="lead-score" style="text-align: right;">
                <span style="color: var(--text-dim); font-size: 12px;">Lead Quality Score</span>
                <h2 style="font-family: 'JetBrains Mono'; color: var(--accent);">8.4/10</h2>
            </div>
        </header>

        <div class="grid-layout">
            <section>
                <h3 class="section-title">
                    <span>✨</span> AI RESEARCH SUMMARY (GEMINI-PRO)
                </h3>
                <div class="research-panel">
                    <div class="ai-note">
                        [SYSTEM_LOG]: Fetching LinkedIn profile & Recent News...<br>
                        [SUCCESS]: Sarah Chen recently announced <span>Nexus Logic's expansion</span> into the European market. <br><br>
                        - Currently managing a team of 45 engineers.<br>
                        - Technical Stack identified: <span>Kubernetes, Go, AWS, Snowflake</span>.<br>
                        - Pain Point detected: Recent interview mentioned "challenges in scaling cross-border compliance logic".<br>
                        - Intent Signal: High. Actively hiring for Compliance Engineers.
                    </div>
                    <div class="insight-card">
                        <p style="font-size: 13px; font-weight: 600; color: var(--primary); margin-bottom: 4px;">Angle Identified:</p>
                        <p style="font-size: 13px; color: var(--text-main);">Position our compliance-automation module as the "Force Multiplier" for her current hiring gap in EMEA.</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 class="section-title">
                    <span>⚖️</span> CRITERIA CHECKLIST
                </h3>
                <div class="checklist-panel">
                    <div class="check-item done">
                        <div class="checkbox"></div>
                        <span class="check-label">ICP Fit: Financial Infrastructure</span>
                        <span class="status-pill">MATCH</span>
                    </div>
                    <div class="check-item done">
                        <div class="checkbox"></div>
                        <span class="check-label">Authority: C-Level / VP</span>
                        <span class="status-pill">VERIFIED</span>
                    </div>
                    <div class="check-item">
                        <div class="checkbox"></div>
                        <span class="check-label">Budget Signal (Series B+)</span>
                    </div>
                    <div class="check-item">
                        <div class="checkbox"></div>
                        <span class="check-label">Timeline: Next 3 Months</span>
                    </div>
                    <div class="check-item">
                        <div class="checkbox"></div>
                        <span class="check-label">Decision Power Mapped</span>
                    </div>
                </div>

                <div style="margin-top: 32px; padding: 20px; border: 1px dashed var(--border); border-radius: 16px;">
                    <p style="font-size: 12px; color: var(--text-dim); margin-bottom: 12px;">Next Step Recommendation:</p>
                    <button style="width: 100%; background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; padding: 12px; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; font-size: 13px;">Generate Personalized Draft</button>
                </div>
            </section>
        </div>
    </main>

    <script>
        document.querySelectorAll('.check-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('done');
            });
        });
    </script>
</body>
</html><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lead Intelligence | Qualification Criteria</title>
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
            width: 600px;
            height: 600px;
            border-radius: 50%;
            filter: blur(120px);
            z-index: -1;
            opacity: 0.4;
            pointer-events: none;
        }
        .aura-1 { top: -100px; left: -100px; background: var(--aura-1); }
        .aura-2 { bottom: -100px; right: -100px; background: var(--aura-2); }

        .database-container {
            width: 100%;
            max-width: 1000px;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 32px;
        }

        .breadcrumb {
            display: flex;
            gap: 8px;
            font-size: 12px;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: -16px;
        }

        .lead-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
        }

        .lead-info h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .lead-meta {
            display: flex;
            gap: 12px;
        }

        .tag {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            color: var(--text-dim);
        }

        .tag.blue { border-color: var(--accent); color: var(--accent); }
        .tag.purple { border-color: var(--primary); color: var(--primary); }

        .grid-layout {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 32px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-dim);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* AI Research Block */
        .research-panel {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px;
        }

        .ai-note {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #cbd5e1;
        }

        .ai-note span { color: var(--primary); }

        .insight-card {
            margin-top: 20px;
            padding: 16px;
            background: rgba(139, 92, 246, 0.05);
            border-left: 2px solid var(--primary);
            border-radius: 0 8px 8px 0;
        }

        /* Checklist Styles */
        .checklist-panel {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .check-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            padding: 16px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 14px;
            transition: 0.2s;
            cursor: pointer;
        }

        .check-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--text-dim);
        }

        .checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid var(--border);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.2s;
        }

        .check-item.done .checkbox {
            background: var(--success);
            border-color: var(--success);
        }

        .check-item.done .checkbox::after {
            content: '✓';
            color: white;
            font-size: 12px;
            font-weight: 800;
        }

        .check-label {
            font-size: 14px;
            font-weight: 500;
        }

        .check-item.done .check-label {
            color: var(--text-dim);
            text-decoration: line-through;
        }

        .status-pill {
            margin-left: auto;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
        }

        .pipeline-status {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 100px;
            width: fit-content;
        }

        .step-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--primary);
            box-shadow: 0 0 10px var(--primary);
        }
    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <main class="database-container">
        <nav class="breadcrumb">
            SDR Engine / Lead Database / <span style="color: var(--text-main)">Qualification Check</span>
        </nav>

        <header class="lead-header">
            <div class="lead-info">
                <div class="pipeline-status" style="margin-bottom: 16px;">
                    <div class="step-indicator"></div>
                    <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em;">PHASE: QUALIFICATION</span>
                </div>
                <h1>Sarah Chen</h1>
                <div class="lead-meta">
                    <span class="tag">CTO @ Nexus Logic</span>
                    <span class="tag blue">Niche: B2B Fintech</span>
                    <span class="tag purple">Series B Startup</span>
                </div>
            </div>
            <div class="lead-score" style="text-align: right;">
                <span style="color: var(--text-dim); font-size: 12px;">Lead Quality Score</span>
                <h2 style="font-family: 'JetBrains Mono'; color: var(--accent);">8.4/10</h2>
            </div>
        </header>

        <div class="grid-layout">
            <section>
                <h3 class="section-title">
                    <span>✨</span> AI RESEARCH SUMMARY (GEMINI-PRO)
                </h3>
                <div class="research-panel">
                    <div class="ai-note">
                        [SYSTEM_LOG]: Fetching LinkedIn profile & Recent News...<br>
                        [SUCCESS]: Sarah Chen recently announced <span>Nexus Logic's expansion</span> into the European market. <br><br>
                        - Currently managing a team of 45 engineers.<br>
                        - Technical Stack identified: <span>Kubernetes, Go, AWS, Snowflake</span>.<br>
                        - Pain Point detected: Recent interview mentioned "challenges in scaling cross-border compliance logic".<br>
                        - Intent Signal: High. Actively hiring for Compliance Engineers.
                    </div>
                    <div class="insight-card">
                        <p style="font-size: 13px; font-weight: 600; color: var(--primary); margin-bottom: 4px;">Angle Identified:</p>
                        <p style="font-size: 13px; color: var(--text-main);">Position our compliance-automation module as the "Force Multiplier" for her current hiring gap in EMEA.</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 class="section-title">
                    <span>⚖️</span> CRITERIA CHECKLIST
                </h3>
                <div class="checklist-panel">
                    <div class="check-item done">
                        <div class="checkbox"></div>
                        <span class="check-label">ICP Fit: Financial Infrastructure</span>
                        <span class="status-pill">MATCH</span>
                    </div>
                    <div class="check-item done">
                        <div class="checkbox"></div>
                        <span class="check-label">Authority: C-Level / VP</span>
                        <span class="status-pill">VERIFIED</span>
                    </div>
                    <div class="check-item">
                        <div class="checkbox"></div>
                        <span class="check-label">Budget Signal (Series B+)</span>
                    </div>
                    <div class="check-item">
                        <div class="checkbox"></div>
                        <span class="check-label">Timeline: Next 3 Months</span>
                    </div>
                    <div class="check-item">
                        <div class="checkbox"></div>
                        <span class="check-label">Decision Power Mapped</span>
                    </div>
                </div>

                <div style="margin-top: 32px; padding: 20px; border: 1px dashed var(--border); border-radius: 16px;">
                    <p style="font-size: 12px; color: var(--text-dim); margin-bottom: 12px;">Next Step Recommendation:</p>
                    <button style="width: 100%; background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; padding: 12px; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; font-size: 13px;">Generate Personalized Draft</button>
                </div>
            </section>
        </div>
    </main>

    <script>
        document.querySelectorAll('.check-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('done');
            });
        });
    </script>
</body>
</html>