// TACTICAL PLAYBOOKS MODULE - ADDITION TO AI AGENT ARSENAL
// DESIGN PATHWAY: BRUTALIST GRID, TIMING-BASED FILTER ENGINE, DEPLOYABLE RAW LOG TERMINALS

(function() {
    // Dynamic CSS Injection to maintain visual alignment with Base UI Component
    const styleElement = document.createElement("style");
    styleElement.textContent = `
        .playbooks-section {
            background-color: var(--base-black);
            border-bottom: var(--border-width) solid var(--off-white);
            padding: 6rem 2rem;
            position: relative;
        }
        
        .playbook-header-box {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 4rem;
            gap: 2rem;
            flex-wrap: wrap;
        }

        .playbook-intro-wrap {
            max-width: 800px;
        }

        .playbook-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2.5rem;
        }

        .playbook-card {
            background-color: var(--carbon-black);
            border: var(--border-width) solid var(--off-white);
            padding: 2.5rem;
            box-shadow: 8px 8px 0 var(--graphite);
            transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
            position: relative;
        }

        .playbook-card:hover {
            transform: translate(-4px, -4px);
            box-shadow: 12px 12px 0 var(--accent-playbook, var(--magenta));
        }

        .playbook-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 10px;
        }

        .playbook-badge-row {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .time-badge {
            background-color: var(--base-black);
            color: var(--yellow);
            border: 2px solid var(--yellow);
            font-family: var(--font-mono);
            font-size: 0.8rem;
            padding: 2px 10px;
            font-weight: bold;
        }

        .difficulty-badge {
            background-color: var(--base-black);
            color: var(--cyan);
            border: 2px solid var(--cyan);
            font-family: var(--font-mono);
            font-size: 0.8rem;
            padding: 2px 10px;
            font-weight: bold;
        }

        .playbook-title {
            font-size: clamp(1.8rem, 3vw, 2.4rem);
            margin-bottom: 1rem;
            line-height: 1.1;
        }

        .playbook-desc {
            color: rgba(244, 241, 232, 0.8);
            font-size: 1.1rem;
            margin-bottom: 2rem;
            line-height: 1.5;
        }

        /* Console-Style Step Accordeon */
        .terminal-accord {
            border: 2px solid var(--graphite);
            background-color: var(--base-black);
            margin-top: 1.5rem;
            display: none;
        }

        .terminal-accord.active {
            display: block;
            animation: consoleScan 0.2s ease-out;
        }

        @keyframes consoleScan {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .terminal-header-bar {
            background-color: var(--graphite);
            padding: 0.75rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--graphite);
        }

        .terminal-dot-wrap {
            display: flex;
            gap: 6px;
        }

        .terminal-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: var(--red);
        }
        .terminal-dot:nth-child(2) { background-color: var(--yellow); }
        .terminal-dot:nth-child(3) { background-color: var(--green); }

        .terminal-step-container {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .step-block {
            border-left: 4px solid var(--accent-playbook, var(--magenta));
            padding-left: 1.5rem;
            position: relative;
        }

        .step-num {
            font-family: var(--font-mono);
            font-size: 1rem;
            color: var(--accent-playbook, var(--magenta));
            font-weight: bold;
            display: block;
            margin-bottom: 0.5rem;
        }

        .step-title {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }

        .step-desc {
            color: rgba(244, 241, 232, 0.75);
            font-size: 0.95rem;
            line-height: 1.5;
        }

        /* Brutalist Code Block */
        .playbook-code-terminal {
            background-color: #020202;
            border: 1px solid var(--graphite);
            padding: 1.25rem;
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--green);
            overflow-x: auto;
            margin-top: 1rem;
            position: relative;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .copy-code-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--graphite);
            color: var(--off-white);
            border: 1px solid var(--off-white);
            font-family: var(--font-mono);
            font-size: 0.7rem;
            padding: 3px 8px;
            cursor: pointer;
            text-transform: uppercase;
        }

        .copy-code-btn:hover {
            background: var(--green);
            color: var(--base-black);
            border-color: var(--green);
        }

        /* Toggle Buttons */
        .btn-playbook-trigger {
            background-color: var(--off-white);
            color: var(--base-black);
            border: 2px solid var(--base-black);
            padding: 0.8rem 1.5rem;
            font-family: var(--font-mono);
            font-weight: 900;
            cursor: pointer;
            text-transform: uppercase;
            box-shadow: 4px 4px 0 var(--accent-playbook, var(--magenta));
            transition: all 0.1s;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .btn-playbook-trigger:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0 var(--accent-playbook, var(--magenta));
        }

        .btn-playbook-trigger:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 var(--accent-playbook, var(--magenta));
        }

        .playbook-filter-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            background-color: var(--graphite);
            border: var(--border-width) solid var(--off-white);
            padding: 1.5rem;
            box-shadow: 6px 6px 0 var(--cyan);
            margin-bottom: 3rem;
        }

        .playbook-filter-label {
            width: 100%;
            font-family: var(--font-mono);
            color: var(--cyan);
            font-size: 0.85rem;
            margin-bottom: 0.8rem;
            text-transform: uppercase;
            font-weight: bold;
        }

        .playbook-tag-wrap {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 1.5rem;
        }

        .playbook-tag {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: rgba(244, 241, 232, 0.5);
            background-color: rgba(23, 24, 33, 0.5);
            border: 1px solid var(--graphite);
            padding: 2px 8px;
        }
    `;
    document.head.appendChild(styleElement);

    // Tactical Operator Intel Manual Dataset
    const playbooks = [
        {
            id: "PB-01",
            title: "LINKING CUSTOMGPTS TO MAKE.COM WEBHOOKS",
            desc: "Direct route user conversations, document inputs, or strategic leads straight into active Make.com scenario pathways. Bypasses third-party app delays to fire webhook payloads instantly.",
            time: 10, // minutes
            difficulty: "MEDIUM",
            category: "Integration",
            accentColor: "var(--magenta)",
            tags: ["Make.com", "CustomGPT", "Webhooks", "REST-API"],
            steps: [
                {
                    num: "01",
                    title: "Deploy Active Webhook Gateway",
                    desc: "In Make.com, establish a 'Custom Webhook' module. Copy the unique webhook hook URL. Do not configure parameters manually—your GPT payload will dynamically map properties during runtime API call."
                },
                {
                    num: "02",
                    title: "Synthesize Custom GPT Actions Schema",
                    desc: "Inject this precise OpenAPI structured schema into your CustomGPT's Action matrix. Replace client placeholder URLs with your active Make.com webhook URL.",
                    code: `{\n  "openapi": "3.1.0",\n  "info": {\n    "title": "Make Webhook Route",\n    "version": "1.0.0"\n  },\n  "paths": {\n    "/": {\n      "post": {\n        "operationId": "triggerWebhook",\n        "requestBody": {\n          "required": true,\n          "content": {\n            "application/json": {\n              "schema": {\n                "type": "object",\n                "properties": {\n                  "operator_name": { "type": "string" },\n                  "lead_metrics": { "type": "string" }\n                },\n                "required": ["operator_name", "lead_metrics"]\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}`
                },
                {
                    num: "03",
                    title: "Impose Strict Prompt System Instructions",
                    desc: "Instruct the GPT behavior rule: 'Whenever user generates key metrics or submits diagnostic parameters, instantly execute triggerWebhook action without requesting permission. Silent transport only.'"
                }
            ]
        },
        {
            id: "PB-02",
            title: "WHITE-LABELING GEMINI API FOR LOCAL BUSINESSES",
            desc: "Construct offline-ready, lightning-fast lead portals or calculator systems powered by Google's Deep Context models. Package system prompts directly inside single static HTML modules with secure client payloads.",
            time: 20, // minutes
            difficulty: "EASY",
            accentColor: "var(--yellow)",
            tags: ["Gemini API", "HTML5", "Vercel", "Local SEO"],
            steps: [
                {
                    num: "01",
                    title: "Initialize Secure API Key Channel",
                    desc: "Navigate to Google AI Studio. Generate an operational API Key. For production environments, restrict origin domain names to safeguard unauthorized quota drains."
                },
                {
                    num: "02",
                    title: "Implement High-Performance Fetch Client",
                    desc: "Deploy client-side fetch modules using direct REST endpoints, utilizing Gemini's low-latency models for sub-second responses.",
                    code: `async function generateGeminiResponse(userPrompt) {\n  const API_KEY = 'YOUR_SECRET_KEY';\n  const endpoint = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${API_KEY}\`;\n\n  const response = await fetch(endpoint, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({\n      systemInstruction: { parts: [{ text: "Act as an expert local business workflow optimizer." }] },\n      contents: [{ parts: [{ text: userPrompt }] }]\n    })\n  });\n  const data = await response.json();\n  return data.candidates[0].content.parts[0].text;\n}`
                },
                {
                    num: "03",
                    title: "Enforce Content & Brand Guidelines",
                    desc: "Bind system instructions to reject competitive name checking, prohibit off-topic questions, and format answers exclusively as actionable checklists."
                }
            ]
        },
        {
            id: "PB-03",
            title: "BYPASSING API RATE LIMITS SAFELY",
            desc: "Construct persistent execution loops that handle heavy traffic volumes without crashing. Implements automated exponential jitter strategies and cross-provider hot-failovers.",
            time: 5, // minutes
            difficulty: "HARD",
            accentColor: "var(--cyan)",
            tags: ["Fault-Tolerance", "Failover", "NodeJS", "Reliability"],
            steps: [
                {
                    num: "01",
                    title: "Implement Mathematical Backoff with Jitter",
                    desc: "Do not request immediately upon receiving 429 status code. Wait for exponentially increasing duration added with random milliseconds (jitter) to prevent localized DDOS patterns."
                },
                {
                    num: "02",
                    title: "Configure Dual-Provider Switcher",
                    desc: "Establish structured fallback rules. If primary OpenAI engine generates persistent errors, route raw prompts instantly to fallback Google Gemini APIs.",
                    code: `async function robustAIServiceCall(promptPayload) {\n  try {\n    return await executePrimaryOpenAI(promptPayload);\n  } catch (error) {\n    if (error.status === 429) {\n      console.warn("PRIMARY OVERFLOW DETECTED. ACTIVATING AUXILIARY GEMINI ROUTE...");\n      return await executeSecondaryGemini(promptPayload);\n    }\n    throw error;\n  }\n}`
                },
                {
                    num: "03",
                    title: "Setup Token Buffer Monitor",
                    desc: "Monitor current requests and set localized timing barriers that pause outgoing executions before triggering system exceptions."
                }
            ]
        }
    ];

    // Find ideal injection point: Just before 'USE CASES: BUILT FOR PEOPLE WHO ACTUALLY SHIP' section
    const documentBody = document.body;
    const targetSection = document.querySelector('section[style*="base-black"]') || document.querySelector('.cta-strip') || document.body.lastElementChild;

    // Create playbooks container section
    const playbooksSection = document.createElement("section");
    playbooksSection.id = "tactical-playbooks";
    playbooksSection.className = "playbooks-section";

    playbooksSection.innerHTML = `
        <div style="max-width: 1400px; margin: 0 auto;">
            
            <div class="playbook-header-box">
                <div class="playbook-intro-wrap">
                    <div class="section-pretitle mono-text">// COLD START MANUALS</div>
                    <h2 class="section-title" style="font-size: clamp(2.5rem, 5vw, 4rem); line-height: 0.9; margin-bottom: 1rem;">
                        Tactical Playbooks
                    </h2>
                    <p class="section-subtitle" style="font-size: 1.15rem; color: rgba(244, 241, 232, 0.75);">
                        Zero-bloat execution blueprints for deploying autonomous operations, pipeline webhooks, and rate-resistant pipelines in less than 30 minutes.
                    </p>
                </div>
            </div>

            <!-- Quick execution filter deck -->
            <div class="playbook-filter-tabs">
                <div class="playbook-filter-label">FAST-FILTER BY TIME TO DEPLOY:</div>
                <button class="filter-btn active" data-time-filter="all">ALL MANUALS</button>
                <button class="filter-btn" data-time-filter="short">&lt; 10 MINS</button>
                <button class="filter-btn" data-time-filter="medium">10 - 20 MINS</button>
                <button class="filter-btn" data-time-filter="hard">DIFFICULT / ENTERPRISE</button>
            </div>

            <!-- Playbook Grid -->
            <div class="playbook-grid" id="playbooks-engine-grid"></div>

        </div>
    `;

    // Insert to DOM safely
    targetSection.parentNode.insertBefore(playbooksSection, targetSection);

    const engineGrid = document.getElementById("playbooks-engine-grid");
    const filterTabs = playbooksSection.querySelectorAll(".playbook-filter-tabs .filter-btn");

    let activeFilter = "all";

    // Core execution & rendering logic
    function renderPlaybooks() {
        engineGrid.innerHTML = "";

        const filtered = playbooks.filter(pb => {
            if (activeFilter === "all") return true;
            if (activeFilter === "short") return pb.time <= 10;
            if (activeFilter === "medium") return pb.time > 10 && pb.time <= 20;
            if (activeFilter === "hard") return pb.difficulty === "HARD";
            return true;
        });

        filtered.forEach(pb => {
            const card = document.createElement("div");
            card.className = "playbook-card";
            card.style.setProperty("--accent-playbook", pb.accentColor);

            // Construct Tags
            let tagsHTML = "";
            pb.tags.forEach(t => {
                tagsHTML += `<span class="playbook-tag">${t}</span>`;
            });

            // Construct steps
            let stepsHTML = "";
            pb.steps.forEach(s => {
                let codeHTML = "";
                if (s.code) {
                    codeHTML = `
                        <div class="playbook-code-terminal">
                            <button class="copy-code-btn" onclick="navigator.clipboard.writeText(\`${s.code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`); this.innerText='COPIED!'; setTimeout(() => this.innerText='COPY', 1500)">COPY</button>
                            <code>${escapeHTML(s.code)}</code>
                        </div>
                    `;
                }

                stepsHTML += `
                    <div class="step-block">
                        <span class="step-num">[STEP ${s.num}]</span>
                        <h4 class="step-title">${s.title}</h4>
                        <p class="step-desc">${s.desc}</p>
                        ${codeHTML}
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="playbook-top">
                    <div class="playbook-badge-row">
                        <span class="time-badge">⚡ ${pb.time} MIN DEPLOY</span>
                        <span class="difficulty-badge">LVL: ${pb.difficulty}</span>
                    </div>
                    <span class="mono-text" style="color: ${pb.accentColor}; font-weight: bold;">${pb.id}</span>
                </div>

                <h3 class="playbook-title">${pb.title}</h3>
                <p class="playbook-desc">${pb.desc}</p>
                
                <div class="playbook-tag-wrap">
                    ${tagsHTML}
                </div>

                <button class="btn-playbook-trigger" id="trigger-${pb.id}">
                    <span>Initialize Playbook Intel</span>
                    <span style="font-family: monospace;">+</span>
                </button>

                <!-- Accordion Terminal output details -->
                <div class="terminal-accord" id="accord-${pb.id}">
                    <div class="terminal-header-bar">
                        <div class="terminal-dot-wrap">
                            <span class="terminal-dot"></span>
                            <span class="terminal-dot"></span>
                            <span class="terminal-dot"></span>
                        </div>
                        <span class="mono-text" style="font-size: 0.75rem; color: var(--off-white); opacity: 0.7;">OPERATIONAL PROTOCOL TERMINAL</span>
                    </div>
                    <div class="terminal-step-container">
                        ${stepsHTML}
                    </div>
                </div>
            `;

            engineGrid.appendChild(card);

            // Accordion interactions
            const triggerBtn = card.querySelector(`#trigger-${pb.id}`);
            const targetAccord = card.querySelector(`#accord-${pb.id}`);

            triggerBtn.addEventListener("click", () => {
                const isActive = targetAccord.classList.contains("active");
                if (isActive) {
                    targetAccord.classList.remove("active");
                    triggerBtn.querySelector("span:last-child").textContent = "+";
                    triggerBtn.style.backgroundColor = "var(--off-white)";
                    triggerBtn.style.color = "var(--base-black)";
                } else {
                    targetAccord.classList.add("active");
                    triggerBtn.querySelector("span:last-child").textContent = "-";
                    triggerBtn.style.backgroundColor = pb.accentColor;
                    triggerBtn.style.color = "var(--base-black)";
                }
            });
        });
    }

    // HTML sanitizer utility for code tags
    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Assign Tab Filter listeners
    filterTabs.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterTabs.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            activeFilter = e.target.getAttribute("data-time-filter");
            renderPlaybooks();
        });
    });

    // Run Initial Load
    renderPlaybooks();
})();