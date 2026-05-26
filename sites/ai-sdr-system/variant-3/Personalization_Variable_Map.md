<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Lab | Vector Aura</title>
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
            --code-bg: #0f172a;
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
            display: flex;
            align-items: center;
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
            opacity: 0.5;
            pointer-events: none;
        }
        .aura-1 { top: -100px; right: -100px; background: var(--aura-1); animation: drift 20s infinite alternate; }
        .aura-2 { bottom: -100px; left: -100px; background: var(--aura-2); animation: drift 25s infinite alternate-reverse; }

        @keyframes drift {
            from { transform: translate(0, 0) scale(1); }
            to { transform: translate(-100px, 50px) scale(1.1); }
        }

        .lab-container {
            width: 100%;
            max-width: 1100px;
            background: var(--card-bg);
            backdrop-filter: blur(24px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
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
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.02em;
            background: linear-gradient(to right, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .header-title p {
            color: var(--text-dim);
            font-size: 14px;
            margin-top: 4px;
        }

        .badge-lab {
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            color: var(--primary);
            padding: 6px 16px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .grid-layout {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 32px;
        }

        /* Variable Map Styling */
        .section-label {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .variable-table {
            width: 100%;
            border-collapse: collapse;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--border);
        }

        .variable-table th {
            text-align: left;
            padding: 12px 16px;
            font-size: 11px;
            color: var(--text-dim);
            border-bottom: 1px solid var(--border);
            background: rgba(255, 255, 255, 0.03);
        }

        .variable-table td {
            padding: 14px 16px;
            font-size: 13px;
            border-bottom: 1px solid var(--border);
        }

        .var-tag {
            font-family: 'JetBrains Mono', monospace;
            color: var(--accent);
            background: rgba(6, 182, 212, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
        }

        /* Prompt Editor Styling */
        .prompt-editor {
            background: var(--code-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px;
            margin-top: 32px;
            position: relative;
        }

        .prompt-editor textarea {
            width: 100%;
            height: 180px;
            background: transparent;
            border: none;
            color: #e2e8f0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            line-height: 1.6;
            resize: none;
            outline: none;
        }

        .editor-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 16px;
        }

        /* Persona Sidebar */
        .persona-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .persona-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .tone-pill {
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 600;
            background: var(--secondary);
            color: white;
        }

        .niche-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.2s;
            margin-bottom: 4px;
        }

        .niche-item:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .niche-item.active {
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .btn-small {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: var(--text-main);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
        }

        .btn-primary {
            background: var(--primary);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
        }

        .logic-gate {
            color: var(--secondary);
            font-weight: 600;
            font-family: 'JetBrains Mono', monospace;
        }
    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <main class="lab-container">
        <header class="header">
            <div class="header-title">
                <h1>AI Messaging & Prompt Lab</h1>
                <p>Personalization variables and tone-of-voice configuration</p>
            </div>
            <div class="badge-lab">Vector Engine v2.4</div>
        </header>

        <div class="grid-layout">
            <div class="main-content">
                <section>
                    <div class="section-label">
                        <span>Dynamic Variable Map</span>
                    </div>
                    <table class="variable-table">
                        <thead>
                            <tr>
                                <th>Variable</th>
                                <th>Source Logic</th>
                                <th>Fallback Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="var-tag">{{first_name}}</span></td>
                                <td>CRM Contacts > First Name</td>
                                <td style="color: var(--text-dim);">"there"</td>
                            </tr>
                            <tr>
                                <td><span class="var-tag">{{company_focus}}</span></td>
                                <td>LinkedIn Scraping > About Section</td>
                                <td style="color: var(--text-dim);">"your company"</td>
                            </tr>
                            <tr>
                                <td><span class="var-tag">{{recent_post}}</span></td>
                                <td>Twitter API > Last 30 Days</td>
                                <td style="color: var(--text-dim);">[Skip Segment]</td>
                            </tr>
                            <tr>
                                <td><span class="var-tag">{{city_weather}}</span></td>
                                <td>OpenWeather API > Prospect Location</td>
                                <td style="color: var(--text-dim);">"the weather"</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section class="prompt-editor">
                    <div class="section-label" style="color: var(--primary);">
                        <span>System Prompt: Persona Definition</span>
                    </div>
                    <textarea spellcheck="false">
You are an expert SDR specializing in B2B SaaS. 
Tone: Conversational, peer-to-peer, data-driven. 
Constraint: No fluff. No "I hope this email finds you well." 

If {{company_focus}} includes "AI", emphasize technical efficiency. 
If {{recent_post}} is about "Scaling", pivot to infrastructure ROI.

Structure:
1. Observation (based on {{recent_post}})
2. The Gap (industry problem)
3. The Bridge (Vector Aura)
4. Low-friction CTA</textarea>
                    <div class="editor-actions">
                        <button class="btn-small">Reset to Default</button>
                        <button class="btn-primary">Update System Prompt</button>
                    </div>
                </section>
            </div>

            <aside class="sidebar">
                <div class="section-label">Active Niches</div>
                
                <div class="persona-card">
                    <div class="persona-header">
                        <span style="font-weight: 600;">SaaS Founders</span>
                        <span class="tone-pill">Direct</span>
                    </div>
                    <p style="font-size: 12px; color: var(--text-dim); line-height: 1.4;">Focus on time-saving and automated growth hacks.</p>
                </div>

                <div class="niche-list">
                    <div class="niche-item active">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent);"></div>
                        <span style="font-size: 13px;">B2B Fintech</span>
                    </div>
                    <div class="niche-item">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: transparent; border: 1px solid var(--border);"></div>
                        <span style="font-size: 13px;">E-commerce Ops</span>
                    </div>
                    <div class="niche-item">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: transparent; border: 1px solid var(--border);"></div>
                        <span style="font-size: 13px;">VC / Private Equity</span>
                    </div>
                </div>

                <div class="section-label" style="margin-top: 32px;">Logic Gates</div>
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; padding: 16px;">
                    <p style="font-size: 12px; font-family: 'JetBrains Mono'; margin-bottom: 8px;">
                        <span class="logic-gate">IF</span> reply_sentiment <span style="color: var(--accent);">==</span> "OOF" 
                    </p>
                    <p style="font-size: 12px; font-family: 'JetBrains Mono'; color: var(--text-dim);">
                        <span class="logic-gate">THEN</span> trigger_seq("Holiday_Followup")
                    </p>
                </div>
            </aside>
        </div>
    </main>

    <script>
        // Simple interactivity for niche selection
        const niches = document.querySelectorAll('.niche-item');
        niches.forEach(niche => {
            niche.addEventListener('click', () => {
                niches.forEach(n => n.classList.remove('active'));
                niche.classList.add('active');
            });
        });
    </script>
</body>
</html>