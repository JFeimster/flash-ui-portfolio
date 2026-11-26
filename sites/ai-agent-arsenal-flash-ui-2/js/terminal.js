document.addEventListener("DOMContentLoaded", () => {
    // 1. INJECT COMMAND CENTER TERMINAL STYLES
    const style = document.createElement("style");
    style.textContent = `
        /* Telemetry & Command Center Grid Layout */
        .telemetry-section {
            background-color: var(--base-black);
            border-bottom: var(--border-width) solid var(--off-white);
            position: relative;
        }

        /* Ticker Tape Styling */
        .ticker-wrap {
            width: 100%;
            background-color: var(--green);
            color: var(--base-black);
            overflow: hidden;
            border-bottom: var(--border-width) solid var(--off-white);
            font-family: var(--font-mono);
            font-size: 0.9rem;
            font-weight: 900;
            padding: 8px 0;
            white-space: nowrap;
            display: flex;
            align-items: center;
        }

        .ticker-track {
            display: inline-flex;
            animation: ticker-scroll 35s linear infinite;
        }

        .ticker-item {
            display: inline-flex;
            align-items: center;
            padding: 0 2rem;
        }

        .ticker-item span {
            margin-right: 8px;
        }

        .trend-up { color: var(--base-black); font-weight: 900; }
        .trend-down { color: var(--red); font-weight: 900; }

        @keyframes ticker-scroll {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
        }

        /* Grid Configuration */
        .telemetry-grid {
            display: grid;
            grid-template-columns: 1.1fr 1.3fr 1.6fr;
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }

        @media (max-width: 1100px) {
            .telemetry-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Brutalist Modules */
        .telemetry-card {
            background-color: var(--carbon-black);
            border: var(--border-width) solid var(--off-white);
            padding: 1.5rem;
            box-shadow: 6px 6px 0 var(--magenta);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 480px;
        }

        .telemetry-card.card-cyan { box-shadow: 6px 6px 0 var(--cyan); }
        .telemetry-card.card-yellow { box-shadow: 6px 6px 0 var(--yellow); }

        .telemetry-header {
            border-bottom: 2px solid var(--graphite);
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .telemetry-header h3 {
            font-size: 1.25rem;
            font-family: var(--font-sans);
            color: var(--off-white);
        }

        .telemetry-header .panel-indicator {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            padding: 2px 6px;
            border: 1px solid var(--off-white);
        }

        /* Module 1: API Latency Indicators */
        .latency-container {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            flex-grow: 1;
        }

        .latency-row {
            background-color: var(--graphite);
            border: 1px solid rgba(244, 241, 232, 0.15);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .latency-meta {
            display: flex;
            justify-content: space-between;
            font-family: var(--font-mono);
            font-size: 0.85rem;
        }

        .latency-name {
            font-weight: bold;
            color: var(--off-white);
        }

        .latency-val {
            font-weight: bold;
        }

        .latency-bar-bg {
            height: 12px;
            background-color: rgba(5, 5, 5, 0.7);
            border: 1px solid var(--off-white);
            position: relative;
            overflow: hidden;
        }

        .latency-bar-fill {
            height: 100%;
            width: 50%;
            transition: width 0.3s ease, background-color 0.3s ease;
        }

        /* Module 2: Agent Execution Queue */
        .queue-wrapper {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 340px;
            overflow-y: hidden;
            position: relative;
        }

        .queue-item {
            background-color: var(--graphite);
            border-left: 4px solid var(--cyan);
            padding: 10px 12px;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            display: flex;
            flex-direction: column;
            gap: 4px;
            animation: slide-in-top 0.25s ease-out;
        }

        .queue-item.status-complete { border-left-color: var(--green); }
        .queue-item.status-executing { border-left-color: var(--yellow); }
        .queue-item.status-routing { border-left-color: var(--magenta); }
        .queue-item.status-stalled { border-left-color: var(--red); }

        .queue-row-top {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
        }

        .queue-thread { color: var(--off-white); }
        .queue-status { text-transform: uppercase; }

        .queue-action {
            color: rgba(244, 241, 232, 0.7);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        @keyframes slide-in-top {
            0% { transform: translateY(-10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }

        /* Module 3: Console Terminal CLI */
        .cli-terminal {
            background-color: rgba(5, 5, 5, 0.95);
            border: 1px solid var(--off-white);
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--off-white);
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
        }

        .cli-output {
            padding: 1rem;
            overflow-y: auto;
            max-height: 300px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-grow: 1;
        }

        .cli-line {
            line-height: 1.4;
            word-break: break-all;
        }

        .cli-line.system { color: var(--cyan); }
        .cli-line.success { color: var(--green); }
        .cli-line.warning { color: var(--yellow); }
        .cli-line.error { color: var(--red); }
        .cli-line.input { color: rgba(244, 241, 232, 0.5); }

        .cli-input-area {
            border-top: 1px dashed var(--graphite);
            padding: 10px;
            display: flex;
            align-items: center;
            background-color: var(--carbon-black);
        }

        .cli-prompt {
            color: var(--green);
            margin-right: 8px;
            font-weight: bold;
            user-select: none;
        }

        .cli-input-field {
            background: transparent;
            border: none;
            outline: none;
            color: var(--off-white);
            font-family: var(--font-mono);
            font-size: 0.85rem;
            width: 100%;
        }

        /* Scrollbar aesthetics */
        .cli-output::-webkit-scrollbar, .queue-wrapper::-webkit-scrollbar {
            width: 4px;
        }
        .cli-output::-webkit-scrollbar-thumb {
            background-color: var(--graphite);
        }
    `;
    document.head.appendChild(style);

    // 2. INJECT DOM HTML BETWEEN HERO AND PORTFOLIO DIRECTORY
    const heroSection = document.querySelector(".hero");
    if (!heroSection) return;

    const telemetrySection = document.createElement("section");
    telemetrySection.id = "telemetry-terminal";
    telemetrySection.className = "telemetry-section";

    telemetrySection.innerHTML = `
        <!-- FINTECH TREND TICKER -->
        <div class="ticker-wrap">
            <div class="ticker-track" id="ticker-track">
                <!-- Repeated dynamically for infinite scroll -->
            </div>
        </div>

        <!-- MAIN GRID CONTAINERS -->
        <div class="telemetry-grid">
            
            <!-- LATENCY MONITOR -->
            <div class="telemetry-card card-cyan">
                <div class="telemetry-header">
                    <h3 class="mono-text">API Latency Matrix</h3>
                    <div class="panel-indicator mono-text" style="color: var(--cyan); border-color: var(--cyan);">LIVE FEED</div>
                </div>
                <div class="latency-container" id="latency-container">
                    <!-- Dynamic Latency Rows -->
                </div>
                <div style="font-size: 0.75rem; color: rgba(244, 241, 232, 0.4); font-family: var(--font-mono); margin-top: 1rem; border-top: 1px dashed var(--graphite); padding-top: 0.75rem;">
                    [SYSTEM_INFO]: Multi-channel routing optimization engine running. Checks run every 1.5s.
                </div>
            </div>

            <!-- ACTIVE EXECUTIONS QUEUE -->
            <div class="telemetry-card">
                <div class="telemetry-header">
                    <h3 class="mono-text">Active Agent Queue</h3>
                    <div class="panel-indicator mono-text" style="color: var(--magenta); border-color: var(--magenta);">MONITORED</div>
                </div>
                <div class="queue-wrapper" id="queue-wrapper">
                    <!-- Dynamic Queue items will render here -->
                </div>
                <div style="font-size: 0.75rem; color: rgba(244, 241, 232, 0.4); font-family: var(--font-mono); margin-top: 1rem; border-top: 1px dashed var(--graphite); padding-top: 0.75rem;">
                    [QUEUE_LOAD]: <span id="queue-load-text">0/12 threads active</span>. Dispatched jobs scale automatically.
                </div>
            </div>

            <!-- COMMAND CENTER TERMINAL CLI -->
            <div class="telemetry-card card-yellow">
                <div class="telemetry-header">
                    <h3 class="mono-text">Command Console</h3>
                    <div class="panel-indicator mono-text" style="color: var(--yellow); border-color: var(--yellow);">CONSOLE v1.0b</div>
                </div>
                <div class="cli-terminal">
                    <div class="cli-output" id="cli-output">
                        <div class="cli-line system">[INIT] Establishing secure tunnel connection to Operator HQ...</div>
                        <div class="cli-line success">[OK] Telemetry engine established. Key authorized.</div>
                        <div class="cli-line warning">[WARN] Type /help to view command matrix parameters.</div>
                    </div>
                    <div class="cli-input-area">
                        <span class="cli-prompt">OPERATOR@ARSENAL:~$</span>
                        <input type="text" class="cli-input-field" id="cli-input" placeholder="Inject directives..." autocomplete="off">
                    </div>
                </div>
            </div>

        </div>
    `;

    // Append after Hero Section
    heroSection.after(telemetrySection);

    // 3. ENGINE VARIABLES & ASSETS
    const tickerTrack = document.getElementById("ticker-track");
    const latencyContainer = document.getElementById("latency-container");
    const queueWrapper = document.getElementById("queue-wrapper");
    const queueLoadText = document.getElementById("queue-load-text");
    const cliOutput = document.getElementById("cli-output");
    const cliInput = document.getElementById("cli-input");

    const marketsData = [
        { name: "MCA_INTEREST_INDEX", val: "11.8%", trend: "up" },
        { name: "SBA_7A_AVG", val: "9.2%", trend: "down" },
        { name: "VC_ACCEL_VOLUME", val: "419M", trend: "up" },
        { name: "BOE_REVENUE_RATIO", val: "1.04", trend: "up" },
        { name: "US_BIZ_RELIABILITY", val: "94.2%", trend: "down" },
        { name: "BTC_USD_OPERATIONAL", val: "96,140", trend: "up" },
        { name: "ETH_CONVERSION", val: "3.24%", trend: "up" },
        { name: "GAS_FEE_LIMIT", val: "1.02gwei", trend: "down" }
    ];

    const platforms = [
        { name: "OpenAI gpt-4o", id: "openai", min: 280, max: 590, color: "var(--cyan)" },
        { name: "Gemini 1.5 Pro", id: "gemini", min: 140, max: 240, color: "var(--yellow)" },
        { name: "Claude 3.5 Sonnet", id: "anthropic", min: 380, max: 850, color: "var(--magenta)" },
        { name: "DeepSeek Coder", id: "deepseek", min: 180, max: 410, color: "var(--green)" }
    ];

    const agentActions = [
        { text: "Computing Cash Flow predictions...", status: "executing" },
        { text: "Scanning financial logs...", status: "routing" },
        { text: "Executing SBA checklist audit...", status: "complete" },
        { text: "Generating Dun & Bradstreet instructions...", status: "routing" },
        { text: "Checking valuation matrices (MRR)...", status: "complete" },
        { text: "Resolving lead routing fallback addresses...", status: "stalled" },
        { text: "Injecting instructions context matrix...", status: "executing" }
    ];

    // 4. TICKER LOADER
    function loadTicker() {
        const doubleData = [...marketsData, ...marketsData]; // Duplicate for seamless looping CSS animation
        tickerTrack.innerHTML = doubleData.map(item => `
            <div class="ticker-item">
                <span>${item.name}:</span>
                <span class="${item.trend === 'up' ? 'trend-up' : 'trend-down'}">
                    ${item.val} ${item.trend === 'up' ? '▲' : '▼'}
                </span>
            </div>
        `).join('');
    }

    // Fluctuate stats
    function updateTickerFluctuations() {
        marketsData.forEach(item => {
            if (Math.random() > 0.6) {
                const numeric = parseFloat(item.val);
                if (!isNaN(numeric)) {
                    const delta = (Math.random() * 0.4 - 0.2);
                    const newVal = (numeric + delta).toFixed(2);
                    item.val = newVal + (item.val.includes('%') ? '%' : '');
                    item.trend = delta >= 0 ? 'up' : 'down';
                }
            }
        });
        loadTicker();
    }

    // 5. LATENCY CONTROLLER
    function initLatencyMatrix() {
        latencyContainer.innerHTML = platforms.map(p => `
            <div class="latency-row" id="latency-row-${p.id}">
                <div class="latency-meta">
                    <span class="latency-name">${p.name}</span>
                    <span class="latency-val" id="latency-val-${p.id}" style="color: ${p.color};">Testing...</span>
                </div>
                <div class="latency-bar-bg">
                    <div class="latency-bar-fill" id="latency-bar-${p.id}" style="width: 0%; background-color: ${p.color};"></div>
                </div>
            </div>
        `).join('');
    }

    function refreshLatencies() {
        platforms.forEach(p => {
            const currentLatency = Math.floor(Math.random() * (p.max - p.min) + p.min);
            const percent = Math.min(100, Math.floor((currentLatency / 1000) * 100));
            const valEl = document.getElementById(`latency-val-${p.id}`);
            const barEl = document.getElementById(`latency-bar-${p.id}`);
            
            if (valEl && barEl) {
                valEl.textContent = `${currentLatency}ms`;
                barEl.style.width = `${percent}%`;

                // Handle visual warnings for high latency
                if (currentLatency > 650) {
                    valEl.style.color = "var(--red)";
                } else {
                    valEl.style.color = p.color;
                }
            }
        });
    }

    // 6. ACTIVE EXECUTION QUEUE CONTROLLER
    let threadsCount = 0;
    
    function addQueueItem() {
        const threadId = `#TH-${Math.floor(Math.random() * 8000 + 1000)}`;
        const action = agentActions[Math.floor(Math.random() * agentActions.length)];
        
        const queueItem = document.createElement("div");
        queueItem.className = `queue-item status-${action.status}`;
        queueItem.innerHTML = `
            <div class="queue-row-top">
                <span class="queue-thread">${threadId}</span>
                <span class="queue-status" style="color: ${getStatusColor(action.status)};">${action.status}</span>
            </div>
            <div class="queue-action">${action.text}</div>
        `;
        
        queueWrapper.prepend(queueItem);
        threadsCount++;
        updateQueueMetadata();

        // Keep maximum queue visual length bounded
        if (queueWrapper.children.length > 5) {
            queueWrapper.removeChild(queueWrapper.lastElementChild);
            threadsCount = Math.max(0, threadsCount - 1);
        }
    }

    function getStatusColor(status) {
        if (status === 'complete') return 'var(--green)';
        if (status === 'executing') return 'var(--yellow)';
        if (status === 'routing') return 'var(--magenta)';
        return 'var(--red)';
    }

    function updateQueueMetadata() {
        queueLoadText.textContent = `${threadsCount}/12 threads active`;
        if (threadsCount >= 4) {
            queueLoadText.style.color = "var(--yellow)";
        } else {
            queueLoadText.style.color = "var(--cyan)";
        }
    }

    // Initialize initial queue items
    for (let i = 0; i < 4; i++) {
        addQueueItem();
    }

    // 7. INTERACTIVE TERMINAL CLI ENGINE
    function outputLine(text, type = 'system') {
        const line = document.createElement("div");
        line.className = `cli-line ${type}`;
        line.textContent = `> ${text}`;
        cliOutput.appendChild(line);
        cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    cliInput.addEventListener("keydown", (e) => {
        if (e.key === 'Enter') {
            const rawCmd = cliInput.value.trim();
            cliInput.value = "";

            if (!rawCmd) return;

            outputLine(`operator@arsenal:~$ ${rawCmd}`, 'input');
            processCommand(rawCmd);
        }
    });

    function processCommand(rawInput) {
        const parts = rawInput.toLowerCase().split(' ');
        const cmd = parts[0];
        const arg = parts.slice(1).join(' ');

        switch (cmd) {
            case 'help':
            case '?':
                outputLine("AVAILABLE SECURE ROUTINES:", "system");
                outputLine("  /status             - Verify integrity parameters of the active network.");
                outputLine("  /ping               - Query latency metrics for interconnected platforms.");
                outputLine("  /deploy [agent_name]- Forcibly queue automated agent workflow routing.");
                outputLine("  /clear              - Wipe active terminal context feed clean.");
                outputLine("  /panic              - Trigger artificial high-yield payload warnings.");
                break;
            case '/status':
                outputLine("NETWORK CAPABILITY SCORE: OPTIMAL", "success");
                outputLine(`ACTIVE PIPELINES: ${threadsCount} active agent cores loaded.`, "success");
                outputLine("MCA API GATEWAY STATUS: AUTHORIZED (v2.01)", "success");
                break;
            case '/ping':
                outputLine("Pinging edge servers on dynamic API matrix paths...", "warning");
                setTimeout(() => {
                    refreshLatencies();
                    outputLine("Edge nodes responded cleanly. Grid metrics refreshed.", "success");
                }, 800);
                break;
            case '/deploy':
                if (!arg) {
                    outputLine("ERROR: Command require target payload parameter. Ex: /deploy BusinessCreditPro", "error");
                } else {
                    outputLine(`Spinning up dynamic sandboxed environment for execution: ${arg.toUpperCase()}...`, "warning");
                    setTimeout(() => {
                        const customItem = document.createElement("div");
                        customItem.className = `queue-item status-executing`;
                        customItem.innerHTML = `
                            <div class="queue-row-top">
                                <span class="queue-thread">#TH-${Math.floor(Math.random()*9000 + 1000)}</span>
                                <span class="queue-status" style="color: var(--yellow);">Executing</span>
                            </div>
                            <div class="queue-action">Triggered by operator override: ${arg}</div>
                        `;
                        queueWrapper.prepend(customItem);
                        threadsCount++;
                        updateQueueMetadata();
                        outputLine(`Successfully injected workflow context core for: [${arg.toUpperCase()}].`, "success");
                    }, 600);
                }
                break;
            case '/clear':
                cliOutput.innerHTML = `<div class="cli-line warning">[SYSTEM WARNING] Console memory wiped clean. Logs retained off-site.</div>`;
                break;
            case '/panic':
                outputLine("WARNING: RE-ROUTING CRITICAL PROCESSES OVER SECURITY NETWORKS!", "error");
                outputLine("Simulating high-load operational pressure points...", "error");
                platforms.forEach(p => {
                    p.max += 600; // Artificially blow up latencies
                });
                refreshLatencies();
                break;
            default:
                outputLine(`CRITICAL: Input directive '${cmd}' is unrecognized. Use /help for matrix instructions.`, "error");
        }
    }

    // 8. INITIALIZE TIMERS & FEED LOOPERS
    loadTicker();
    initLatencyMatrix();
    refreshLatencies();

    // Constant updates simulation
    setInterval(updateTickerFluctuations, 5000); // Fluctuate ticker rates
    setInterval(refreshLatencies, 2500); // Fluctuate API latencies
    setInterval(() => {
        if (Math.random() > 0.4) {
            addQueueItem(); // Mimic dynamic client dispatch activity
        }
    }, 4500);
});
