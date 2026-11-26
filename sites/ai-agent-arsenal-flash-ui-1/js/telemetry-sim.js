/**
 * js/telemetry-sim.js
 * AI Agent Arsenal - Retro Cyberpunk Network Diagnostic Terminal & Telemetry Monitor
 * Created for Jason Feimster // AI Agent Arsenal
 */

(function () {
  // 1. DYNAMIC CSS INJECTION (Neo-Brutalist & Cyberpunk styles tailored to match global variables)
  const style = document.createElement('style');
  style.textContent = `
    .telemetry-panel-section {
      background: var(--carbon-black);
      border: 4px solid var(--off-white);
      box-shadow: var(--neo-shadow-cyan);
      padding: 2.5rem;
      margin-top: 4rem;
      margin-bottom: 5rem;
      position: relative;
    }

    .telemetry-panel-section::before {
      content: 'TELEMETRY';
      position: absolute;
      top: -15px;
      left: 20px;
      background: var(--cyan);
      color: var(--deep-black);
      font-family: 'Share Tech Mono', monospace;
      font-weight: 800;
      padding: 0.2rem 0.8rem;
      border: 2px solid var(--off-white);
      font-size: 0.85rem;
    }

    .telemetry-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .telemetry-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Diagnostics Monitor Grid */
    .telemetry-matrix {
      background: var(--deep-black);
      border: 3px solid var(--off-white);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .telemetry-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      align-items: center;
      border-bottom: 2px solid var(--graphite);
      padding-bottom: 0.8rem;
      font-family: 'Share Tech Mono', monospace;
    }

    .telemetry-row.header {
      border-bottom: 3px solid var(--off-white);
      color: var(--cyan);
      font-weight: bold;
      padding-bottom: 0.5rem;
    }

    .telemetry-name {
      font-weight: bold;
      color: var(--off-white);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .telemetry-status-badge {
      padding: 0.2rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 900;
      text-align: center;
      border: 1px solid var(--off-white);
      width: fit-content;
    }

    .telemetry-status-badge.live {
      background: var(--acid-green);
      color: var(--deep-black);
    }

    .telemetry-status-badge.prototype {
      background: var(--magenta);
      color: var(--off-white);
    }

    .telemetry-status-badge.update {
      background: var(--red);
      color: var(--off-white);
    }

    .telemetry-latency {
      color: var(--yellow);
    }

    .telemetry-ping-bar-container {
      width: 100%;
      height: 8px;
      background: var(--graphite);
      border: 1px solid var(--off-white);
      position: relative;
      overflow: hidden;
    }

    .telemetry-ping-bar-fill {
      height: 100%;
      background: var(--cyan);
      width: 0%;
      transition: width 0.3s ease;
    }

    /* Console Logs and Diagnostics Tools */
    .telemetry-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .telemetry-console {
      background: var(--deep-black);
      border: 3px solid var(--off-white);
      padding: 1.5rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.85rem;
      height: 250px;
      overflow-y: auto;
      box-shadow: inset 0 0 15px rgba(0, 229, 255, 0.15);
      color: var(--cyan);
    }

    .telemetry-console-line {
      margin-bottom: 0.4rem;
      line-height: 1.2;
    }

    .telemetry-console-line .prefix {
      color: var(--magenta);
    }

    .telemetry-console-line .warn {
      color: var(--red);
      font-weight: bold;
    }

    .telemetry-console-line .success {
      color: var(--acid-green);
    }

    .telemetry-controls {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .telemetry-btn {
      background: var(--graphite);
      color: var(--off-white);
      border: 3px solid var(--off-white);
      padding: 0.8rem 1rem;
      font-family: 'Share Tech Mono', monospace;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 0.85rem;
      cursor: pointer;
      box-shadow: 4px 4px 0px var(--magenta);
      transition: all 0.1s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .telemetry-btn:hover {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px var(--magenta);
      background: var(--deep-black);
    }

    .telemetry-btn.ping-all-btn {
      background: var(--cyan);
      color: var(--deep-black);
      box-shadow: 4px 4px 0px var(--yellow);
    }

    .telemetry-btn.ping-all-btn:hover {
      background: var(--yellow);
      box-shadow: 2px 2px 0px var(--cyan);
    }

    /* Failure Injection Overlay Banner */
    .dependency-fault-alert {
      background: var(--red);
      color: var(--off-white);
      border: 3px solid var(--off-white);
      padding: 1rem;
      font-family: 'Share Tech Mono', monospace;
      font-weight: bold;
      font-size: 0.9rem;
      display: none;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      box-shadow: 5px 5px 0px var(--deep-black);
      animation: alert-flash 1s infinite alternate;
    }

    @keyframes alert-flash {
      from { border-color: var(--off-white); }
      to { border-color: var(--yellow); }
    }
  `;
  document.head.appendChild(style);

  // 2. HELPER UTILITIES
  function getRandomLatency(min = 15, max = 220) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  // Fallback database if weaponsDatabase is undefined globally
  const fallbackDatabase = [
    { id: "ecom-forecast", name: "Ecom Cash Forecaster", platform: "Static App", status: "Live" },
    { id: "get-funding", name: "Get My Funding Offer", platform: "Vercel App", status: "Live" },
    { id: "pathfinder-gpt", name: "Pathfinder GPT", platform: "CustomGPT", status: "Live" },
    { id: "gemini-cash", name: "Real-Time Cash Flow", platform: "Gemini Gem", status: "Prototype" },
    { id: "goal-tracker", name: "Funding Goal Tracker", platform: "AI Studio App", status: "Live" },
    { id: "mrr-money", name: "MRR to Money GPT", platform: "CustomGPT", status: "Live" },
    { id: "vc-backup", name: "VC Backup Plan GPT", platform: "CustomGPT", status: "Prototype" },
    { id: "bizcredit", name: "BizCredit Builder GPT", platform: "CustomGPT", status: "Live" },
    { id: "stack-builder", name: "GPT Stack Builder", platform: "Prompt System", status: "Live" },
    { id: "flash-ui", name: "Flash UI Portfolio", platform: "Static App", status: "Needs Update" }
  ];

  const db = window.weaponsDatabase || fallbackDatabase;

  // 3. UI GENERATION
  const container = document.querySelector('.container');
  if (!container) return; // Safeguard if injected out of scope

  const telemetrySection = document.createElement('section');
  telemetrySection.id = 'telemetry-monitor';
  telemetrySection.className = 'telemetry-panel-section';

  // Section Header description Block
  const headerHTML = `
    <div class="section-header" style="--accent: var(--cyan); margin-bottom: 2rem;">
      <div class="section-eyebrow mono">LIVE AGENT TELEMETRY SYSTEM</div>
      <h2 class="section-title">Diagnostics Network Terminal</h2>
      <p class="section-subtitle">Real-time simulation matrix auditing transaction layers, latencies, and connectivity state logs across our active agent nodes.</p>
    </div>
  `;

  // Fault Warning Alert Bar
  const faultAlertHTML = `
    <div class="dependency-fault-alert" id="dependencyFaultAlert">
      <span style="font-size: 1.5rem;">⚠️</span>
      <div>
        <span class="mono" style="display: block;">[ CRITICAL ARSENAL STATUS INTERRUPT ]</span>
        <span style="font-weight: normal; font-size: 0.8rem;">A dependency node was disconnected. Simulated packets will return transmission drops and increased latency profiles.</span>
      </div>
    </div>
  `;

  // Monitor Grid Generation
  let matrixRowsHTML = `
    <div class="telemetry-row header">
      <div>DEPLOYED AGENT / WEAPON</div>
      <div>STATE</div>
      <div>LATENCY</div>
      <div>SIGNAL STRENGTH</div>
    </div>
  `;

  db.forEach((agent, index) => {
    let badgeClass = 'live';
    if (agent.status === 'Prototype') badgeClass = 'prototype';
    if (agent.status === 'Needs Update') badgeClass = 'update';

    matrixRowsHTML += `
      <div class="telemetry-row" id="telemetry-row-${agent.id || index}">
        <div class="telemetry-name mono">${agent.name}</div>
        <div>
          <span class="telemetry-status-badge ${badgeClass}">${agent.status.toUpperCase()}</span>
        </div>
        <div class="telemetry-latency mono" id="latency-${agent.id || index}">--- ms</div>
        <div>
          <div class="telemetry-ping-bar-container">
            <div class="telemetry-ping-bar-fill" id="pingbar-${agent.id || index}"></div>
          </div>
        </div>
      </div>
    `;
  });

  const layoutHTML = `
    ${headerHTML}
    ${faultAlertHTML}
    <div class="telemetry-grid">
      <div class="telemetry-matrix">
        ${matrixRowsHTML}
      </div>
      
      <div class="telemetry-sidebar">
        <div class="telemetry-console" id="telemetryConsole">
          <div class="telemetry-console-line"><span class="prefix">[${getTimestamp()}]</span> INITIALIZING ARSENAL MONITOR DAEMON v3.11...</div>
          <div class="telemetry-console-line"><span class="prefix">[${getTimestamp()}]</span> LISTENING ON SOCKET RX_PORT_443...</div>
          <div class="telemetry-console-line"><span class="prefix">[${getTimestamp()}]</span> ALL AUDIT SYSTEM INTERFACES STATUS: <span class="success">ONLINE</span></div>
        </div>
        
        <div class="telemetry-controls">
          <button class="telemetry-btn ping-all-btn" id="pingAllBtn">
            ⚡ PING ALL NODES
          </button>
          <button class="telemetry-btn" id="faultSimulatorBtn" style="color: var(--red);">
            🔴 SIMULATE FAULT
          </button>
        </div>
      </div>
    </div>
  `;

  telemetrySection.innerHTML = layoutHTML;

  // Insert Telemetry Matrix prior to the API Documentation Matrix section
  const apiDocumentationSection = document.getElementById('api-documentation');
  if (apiDocumentationSection) {
    container.insertBefore(telemetrySection, apiDocumentationSection);
  } else {
    // Fallback if UI structure differs
    container.appendChild(telemetrySection);
  }

  // 4. INTERACTION & SIMULATION LOGIC
  const consoleEl = document.getElementById('telemetryConsole');
  const pingAllBtn = document.getElementById('pingAllBtn');
  const faultSimulatorBtn = document.getElementById('faultSimulatorBtn');
  const faultAlert = document.getElementById('dependencyFaultAlert');

  let simulatedFaultActive = false;

  function printConsoleLog(message, type = 'normal') {
    const line = document.createElement('div');
    line.className = 'telemetry-console-line';
    let content = `<span class="prefix">[${getTimestamp()}]</span> `;
    
    if (type === 'warn') {
      content += `<span class="warn">${message}</span>`;
    } else if (type === 'success') {
      content += `<span class="success">${message}</span>`;
    } else {
      content += message;
    }
    
    line.innerHTML = content;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;

    // Constrain logs limit
    while (consoleEl.children.length > 25) {
      consoleEl.removeChild(consoleEl.firstChild);
    }
  }

  // Execute Ping simulation sequentially across each card
  function executePingAll() {
    printConsoleLog("DISPATCHING TELEMETRY PING BURST ON ALL REGISTERED ADAPTERS...", "normal");
    pingAllBtn.disabled = true;
    pingAllBtn.style.opacity = '0.5';
    pingAllBtn.style.cursor = 'not-allowed';

    let pingChain = Promise.resolve();

    db.forEach((agent, index) => {
      const agentId = agent.id || index;
      const rowId = `telemetry-row-${agentId}`;
      const latencyId = `latency-${agentId}`;
      const pingbarId = `pingbar-${agentId}`;

      const rowEl = document.getElementById(rowId);
      const latencyEl = document.getElementById(latencyId);
      const pingbarEl = document.getElementById(pingbarId);

      pingChain = pingChain.then(() => {
        return new Promise((resolve) => {
          // Highlight current ping node visually
          if (rowEl) rowEl.style.background = 'rgba(0, 229, 255, 0.05)';
          if (pingbarEl) pingbarEl.style.width = '30%';

          setTimeout(() => {
            let latencyVal = getRandomLatency(20, 150);
            
            // Inflate latency if simulated fault or main connection states are dropped
            let faultMultiplier = false;
            if (simulatedFaultActive) {
              latencyVal = getRandomLatency(180, 450);
              faultMultiplier = true;
            }

            // Check parent global state object if present
            if (window.connectionStates) {
              const hasGptOffline = !window.connectionStates.chatgpt && agent.chatgpt !== 'N/A';
              const hasNotionOffline = !window.connectionStates.notion && agent.notion !== 'N/A';
              const hasSupaOffline = !window.connectionStates.supabase && agent.supabase !== 'N/A';
              if (hasGptOffline || hasNotionOffline || hasSupaOffline) {
                latencyVal = getRandomLatency(350, 750);
                faultMultiplier = true;
              }
            }

            // Update DOM properties for the node
            if (latencyEl) {
              latencyEl.textContent = `${latencyVal} ms`;
              if (latencyVal > 300) {
                latencyEl.style.color = 'var(--red)';
              } else if (latencyVal > 150) {
                latencyEl.style.color = 'var(--yellow)';
              } else {
                latencyEl.style.color = 'var(--acid-green)';
              }
            }

            if (pingbarEl) {
              const percentage = Math.max(10, Math.min(100, Math.round((1 - latencyVal / 600) * 100)));
              pingbarEl.style.width = `${percentage}%`;
              if (latencyVal > 300) {
                pingbarEl.style.background = 'var(--red)';
              } else {
                pingbarEl.style.background = 'var(--cyan)';
              }
            }

            if (rowEl) rowEl.style.background = 'transparent';

            if (faultMultiplier) {
              printConsoleLog(`NODE: ${agent.name} -> TARGET RESIDUAL SLOWDOWN RESOLUTION (LATENCY: ${latencyVal}ms)`, "warn");
            } else {
              printConsoleLog(`NODE: ${agent.name} -> TRANSMISSION VERIFIED [OK] (LATENCY: ${latencyVal}ms)`, "success");
            }

            resolve();
          }, getRandomLatency(80, 250));
        });
      });
    });

    pingChain.then(() => {
      printConsoleLog("TELEMETRY SWEEP COMPLETED SUCCESSFULLY.", "success");
      pingAllBtn.disabled = false;
      pingAllBtn.style.opacity = '1';
      pingAllBtn.style.cursor = 'pointer';
    });
  }

  // Fault Toggle Controller
  function toggleSimulatedFault() {
    simulatedFaultActive = !simulatedFaultActive;
    
    if (simulatedFaultActive) {
      faultAlert.style.display = 'flex';
      faultSimulatorBtn.textContent = '🟢 RECTIFY FAULT';
      faultSimulatorBtn.style.color = 'var(--acid-green)';
      faultSimulatorBtn.style.boxShadow = '4px 4px 0px var(--red)';
      printConsoleLog("⚠️ DANGER: HIGH NOISE INJECTED INTO PACKET BUFFERS. SIMULATING NETWORK COLLISION STATE.", "warn");
    } else {
      faultAlert.style.display = 'none';
      faultSimulatorBtn.textContent = '🔴 SIMULATE FAULT';
      faultSimulatorBtn.style.color = 'var(--red)';
      faultSimulatorBtn.style.boxShadow = '4px 4px 0px var(--magenta)';
      printConsoleLog("SYSTEM RECOVERED: Clean line path simulated. Latency envelopes normalized.", "success");
    }

    // Automatically trigger ping refresh to show telemetry changes instantly
    executePingAll();
  }

  // Intercept the parent page's connection toggles to print warning logs directly in our custom console!
  const originalToggle = window.toggleDependencyConnection;
  if (typeof originalToggle === 'function') {
    window.toggleDependencyConnection = function (service) {
      originalToggle(service); // Execute original logic
      
      const isOnline = window.connectionStates[service];
      if (isOnline) {
        printConsoleLog(`INTEGRATED CONTEXT SIGNAL: Connection node '${service.toUpperCase()}' restored to network mesh.`, "success");
      } else {
        printConsoleLog(`CRITICAL DEVIATION: Central gateway connection node '${service.toUpperCase()}' went OFFLINE.`, "warn");
      }
      
      // Flash real-time updates directly on our network rows
      executePingAll();
    };
  }

  // BIND DOM EVENT LISTENERS
  pingAllBtn.addEventListener('click', executePingAll);
  faultSimulatorBtn.addEventListener('click', toggleSimulatedFault);

  // Auto-initiate first diagnostic run on launch loop
  setTimeout(() => {
    executePingAll();
  }, 1000);

})();
