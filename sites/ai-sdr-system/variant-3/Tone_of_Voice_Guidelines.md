<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tone of Voice Guidelines | AI Messaging Lab</title>
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
            padding: 20px;
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
        .aura-1 { top: -200px; right: -100px; background: var(--aura-1); animation: drift 20s infinite alternate; }
        .aura-2 { bottom: -200px; left: -100px; background: var(--aura-2); animation: drift 25s infinite alternate-reverse; }

        @keyframes drift {
            from { transform: translate(0, 0) scale(1); }
            to { transform: translate(-50px, 100px) scale(1.1); }
        }

        .sdr-container {
            width: 100%;
            max-width: 1100px;
            background: var(--card-bg);
            backdrop-filter: blur(25px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border);
        }

        .header-title h1 {
            font-size: 22px;
            font-weight: 700;
            background: linear-gradient(to right, #fff, var(--text-dim));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .breadcrumb {
            font-size: 12px;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
            display: block;
        }

        .lab-grid {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 32px;
        }

        .section-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Editor Styles */
        .editor-box {
            background: var(--code-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }

        .editor-label {
            font-size: 11px;
            color: var(--text-dim);
            margin-bottom: 12px;
            display: block;
        }

        .code-area {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #e2e8f0;
            width: 100%;
            background: transparent;
            border: none;
            resize: none;
            outline: none;
            min-height: 180px;
        }

        /* Tone Controls */
        .tone-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }

        .slider-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .slider-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
        }

        input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            background: var(--primary);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px var(--primary);
        }

        /* Variable Mapping */
        .var-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }

        .var-chip {
            background: rgba(6, 182, 212, 0.1);
            border: 1px solid rgba(6, 182, 212, 0.2);
            color: var(--accent);
            padding: 4px 10px;
            border-radius: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            cursor: pointer;
            transition: 0.2s;
        }

        .var-chip:hover {
            background: rgba(6, 182, 212, 0.2);
            transform: translateY(-1px);
        }

        /* Sidebar Cards */
        .sidebar-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .sidebar-card h4 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        .preview-text {
            font-size: 13px;
            color: var(--text-dim);
            line-height: 1.5;
            font-style: italic;
        }

        .btn-save {
            width: 100%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            border: none;
            padding: 14px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            margin-top: 10px;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .status-pill {
            font-size: 10px;
            padding: 2px 8px;
            border-radius: 4px;
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            margin-left: 8px;
        }
    </style>
</head>
<body>

    <div class="aura-blob aura-1"></div>
    <div class="aura-blob aura-2"></div>

    <main class="sdr-container">
        <header class="header">
            <div>
                <span class="breadcrumb">AI Messaging & Prompt Lab / Phase 4</span>
                <h1>Tone of Voice Guidelines</h1>
            </div>
            <div style="text-align: right;">
                <span style="font-size: 12px; color: var(--text-dim);">Active Model</span>
                <div style="font-size: 14px; font-weight: 500;">GPT-4o-Turbo <span class="status-pill">Ready</span></div>
            </div>
        </header>

        <div class="lab-grid">
            <section>
                <div class="section-label">
                    <span>✨</span> Personalization System Prompt
                </div>
                <div class="editor-box">
                    <span class="editor-label">SYSTEM_ROLE_INSTRUCTIONS</span>
                    <textarea class="code-area">You are an elite SDR specializing in {{niche}}. 
Your goal is to draft a short, 2-sentence email that links the prospect's recent activity in {{city}} with our {{business_type}} solution.

Tone constraints:
- No "I hope this finds you well"
- 0% marketing fluff
- Casual but authoritative
- Focus on the {{pain_point}}</textarea>
                </div>

                <div class="section-label">
                    <span>📝</span> Draft Template (Gmail Integration)
                </div>
                <div class="editor-box">
                    <span class="editor-label">EMAIL_BODY_V1</span>
                    <textarea class="code-area">Subject: Quick question re: {{company}}'s expansion

Hi {{first_name}},

Saw your recent post about {{activity}}. Given you're scaling in {{city}}, wondered if you've hit the {{pain_point}} wall yet?

We're helping {{niche}} teams automate this with {{product_feature}}. Worth a 2-min chat?

Best,
{{sender_name}}</textarea>
                </div>

                <div class="tone-controls">
                    <div class="slider-group">
                        <div class="slider-header">
                            <span>Formal</span>
                            <span>Casual</span>
                        </div>
                        <input type="range" min="1" max="100" value="85">
                    </div>
                    <div class="slider-group">
                        <div class="slider-header">
                            <span>Concise</span>
                            <span>Detailed</span>
                        </div>
                        <input type="range" min="1" max="100" value="15">
                    </div>
                </div>
            </section>

            <aside>
                <div class="sidebar-card">
                    <div class="section-label" style="color: var(--accent);">Dynamic Variables</div>
                    <p style="font-size: 12px; color: var(--text-dim); margin-bottom: 12px;">Mapped from Make.com & Notion</p>
                    <div class="var-list">
                        <div class="var-chip">{{first_name}}</div>
                        <div class="var-chip">{{company}}</div>
                        <div class="var-chip">{{city}}</div>
                        <div class="var-chip">{{niche}}</div>
                        <div class="var-chip">{{pain_point}}</div>
                        <div class="var-chip">{{activity}}</div>
                        <div class="var-chip">{{product_feature}}</div>
                    </div>
                </div>

                <div class="sidebar-card">
                    <h4>Live Generation Preview</h4>
                    <div class="preview-text">
                        "Hi Sarah, Saw your recent post about the SF Fintech mixer. Given you're scaling in San Francisco, wondered if you've hit the lead-gen wall yet?..."
                    </div>
                </div>

                <div class="sidebar-card">
                    <h4>Global Constraints</h4>
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; margin-bottom: 10px;">
                        <input type="checkbox" checked style="accent-color: var(--primary);"> Disable emojis
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                        <input type="checkbox" checked style="accent-color: var(--primary);"> Auto-detect local time
                    </label>
                </div>

                <button class="btn-save">Sync to Pipeline</button>
                <p style="text-align: center; font-size: 11px; color: var(--text-dim); margin-top: 12px;">
                    Last synced: 2 mins ago
                </p>
            </aside>
        </div>
    </main>

</body>
</html>