(function() {
  // Inject Custom Styles to Match Neo-Brutalist Theme
  const styles = document.createElement('style');
  styles.textContent = `
    #sandbox-hub .section-header {
      --accent: var(--orange);
    }
    .sandbox-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 2rem;
      margin-bottom: 4rem;
    }
    @media (max-width: 1024px) {
      .sandbox-grid {
        grid-template-columns: 1fr;
      }
    }
    .sandbox-pane-left {
      background: var(--carbon-black);
      border: 4px solid var(--off-white);
      padding: 2rem;
      box-shadow: var(--neo-shadow-orange);
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }
    .sandbox-pane-right {
      background: var(--graphite);
      border: 4px solid var(--off-white);
      padding: 2rem;
      box-shadow: var(--neo-shadow-black);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sandbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .sandbox-group label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.8rem;
      color: var(--orange);
      font-weight: bold;
      text-transform: uppercase;
    }
    .sandbox-field {
      background: var(--deep-black);
      border: 2px solid var(--off-white);
      color: var(--off-white);
      padding: 0.8rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      outline: none;
    }
    .sandbox-field:focus {
      border-color: var(--orange);
    }
    .sandbox-field-mono {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.85rem;
    }
    .sandbox-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    @media (max-width: 600px) {
      .sandbox-row-2 {
        grid-template-columns: 1fr;
      }
    }
    .sandbox-tab-bar {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid var(--off-white);
      padding-bottom: 0.5rem;
      flex-wrap: wrap;
    }
    .sandbox-tab-btn {
      background: transparent;
      border: 2px solid var(--off-white);
      color: var(--off-white);
      padding: 0.5rem 1rem;
      font-family: 'Share Tech Mono', monospace;
      font-weight: bold;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.15s ease;
    }
    .sandbox-tab-btn.active {
      background: var(--orange);
      color: var(--deep-black);
      box-shadow: 2px 2px 0px var(--cyan);
    }
    .sandbox-console {
      background: var(--deep-black);
      border: 2px solid var(--off-white);
      padding: 1rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.85rem;
      height: 340px;
      overflow-y: auto;
      white-space: pre-wrap;
      margin-bottom: 1rem;
    }
    .sandbox-console.yaml-theme {
      color: var(--cyan);
    }
    .sandbox-console.pr-theme {
      color: var(--yellow);
    }
    .sandbox-console.tester-theme {
      color: var(--acid-green);
    }
    .sandbox-checkbox-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      background: var(--deep-black);
      border: 2px solid var(--off-white);
      padding: 0.8rem;
    }
    .sandbox-checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.80rem;
      color: var(--off-white);
      cursor: pointer;
    }
    .sandbox-checkbox-label input {
      accent-color: var(--orange);
      width: 16px;
      height: 16px;
    }
  `;
  document.head.appendChild(styles);

  // Locate the Main Container
  const container = document.querySelector('.container');
  if (!container) return;

  // Create the Sandbox HTML Block
  const sandboxSection = document.createElement('section');
  sandboxSection.id = 'sandbox-hub';
  sandboxSection.style.marginBottom = '6rem';

  sandboxSection.innerHTML = `
    <div class="section-header">
      <div class="section-eyebrow mono">TACTICAL SANDBOX & SUBMISSION HUB</div>
      <h2 class="section-title">Configure, Test, and Package</h2>
      <p class="section-subtitle">A terminal-styled interactive playground where operators can design system prompts, preview YAML manifests, run sandbox simulations, and package custom PR submissions directly.</p>
    </div>

    <div class="sandbox-grid">
      <!-- LEFT PANE: CONFIGURATION & SIMULATOR INPUTS -->
      <div class="sandbox-pane-left">
        <div class="corner-tag mono" style="background: var(--orange); color: var(--deep-black);">SANDBOX CONFIGURATOR</div>

        <div class="sandbox-row-2">
          <div class="sandbox-group">
            <label>Agent System ID</label>
            <input type="text" id="sbAgentId" class="sandbox-field sandbox-field-mono" value="tactical_advisor_01">
          </div>
          <div class="sandbox-group">
            <label>Agent Display Name</label>
            <input type="text" id="sbAgentName" class="sandbox-field" value="Tactical Advisor Pro">
          </div>
        </div>

        <div class="sandbox-row-2">
          <div class="sandbox-group">
            <label>Platform Target</label>
            <select id="sbPlatform" class="sandbox-field" style="background: var(--deep-black); cursor:pointer;">
              <option value="CustomGPT">CustomGPT</option>
              <option value="Gemini Gem">Gemini Gem</option>
              <option value="AI Studio App">AI Studio App</option>
              <option value="Static App">Static App</option>
              <option value="Prompt System">Prompt System</option>
            </select>
          </div>
          <div class="sandbox-group">
            <label>Weapon Category</label>
            <select id="sbCategory" class="sandbox-field" style="background: var(--deep-black); cursor:pointer;">
              <option value="Funding & Capital">Funding & Capital</option>
              <option value="Cash Flow">Cash Flow</option>
              <option value="Business Credit">Business Credit</option>
              <option value="Founder Ops">Founder Ops</option>
            </select>
          </div>
        </div>

        <div class="sandbox-row-2">
          <div class="sandbox-group">
            <label>Target Accent Color</label>
            <select id="sbColor" class="sandbox-field" style="background: var(--deep-black); cursor:pointer;">
              <option value="var(--cyan)">Cyan Accent</option>
              <option value="var(--acid-green)">Acid Green Accent</option>
              <option value="var(--magenta)">Magenta Accent</option>
              <option value="var(--orange)" selected>Orange Accent</option>
              <option value="var(--yellow)">Yellow Accent</option>
              <option value="var(--blue)">Blue Accent</option>
            </select>
          </div>
          <div class="sandbox-group">
            <label>Operator Guild Handle (GitHub)</label>
            <input type="text" id="sbAuthor" class="sandbox-field sandbox-field-mono" value="operator-one">
          </div>
        </div>

        <div class="sandbox-group">
          <label>Operational Weapon Description</label>
          <textarea id="sbDesc" class="sandbox-field" rows="2" style="resize: none;">Automated strategic mapping agent built to run calculations of alternative capital terms and structure dynamic workflows.</textarea>
        </div>

        <div class="sandbox-group">
          <label>System Instructions (Core Rules Matrix)</label>
          <textarea id="sbRules" class="sandbox-field sandbox-field-mono" rows="3" style="resize: vertical;">You are a strict underwriter. Output logical structures. Always verify Debt-to-Revenue and penalize over-leverage patterns.</textarea>
        </div>

        <div class="sandbox-group">
          <label>Active Dependency Interfaces</label>
          <div class="sandbox-checkbox-row">
            <label class="sandbox-checkbox-label">
              <input type="checkbox" id="sbDepGPT" checked> GPT Core
            </label>
            <label class="sandbox-checkbox-label">
              <input type="checkbox" id="sbDepNotion"> Notion DB
            </label>
            <label class="sandbox-checkbox-label">
              <input type="checkbox" id="sbDepSupa"> Supabase
            </label>
          </div>
        </div>

        <div class="sandbox-group" style="margin-top: 0.5rem; border-top: 2px dashed var(--off-white); padding-top: 1rem;">
          <label style="color: var(--cyan);">Simulation Test Input</label>
          <input type="text" id="sbTestPrompt" class="sandbox-field" value="What metrics flag automatic rejection?">
        </div>

        <div class="terminal-action-bar" style="gap: 1rem; flex-wrap: wrap;">
          <button class="terminal-btn terminal-btn-trigger mono" onclick="runSandboxSimulation()" style="flex: 1; background: var(--acid-green); color: var(--deep-black); border-color: var(--deep-black);">EXECUTE COGNITIVE PIPELINE</button>
          <button class="terminal-btn mono" onclick="injectIntoLocalDatabase()" style="flex: 1; background: var(--blue); color: var(--off-white); border-color: var(--off-white);">COMPILE & INJECT LOCAL</button>
        </div>
      </div>

      <!-- RIGHT PANE: OUTPUT INTERFACES (TABS) -->
      <div class="sandbox-pane-right">
        <div>
          <div class="sandbox-tab-bar">
            <button class="sandbox-tab-btn active" id="tabManifest" onclick="switchSandboxTab('manifest')">YAML MANIFEST</button>
            <button class="sandbox-tab-btn" id="tabPR" onclick="switchSandboxTab('pr')">GITHUB PR TEMPLATE</button>
            <button class="sandbox-tab-btn" id="tabConsole" onclick="switchSandboxTab('console')">SANDBOX CONSOLE</button>
          </div>

          <!-- Sandbox Display Windows -->
          <div id="sandboxOutputManifest" class="sandbox-console yaml-theme">Loading manifest data...</div>
          <div id="sandboxOutputPR" class="sandbox-console pr-theme" style="display:none;">Loading PR template...</div>
          <div id="sandboxOutputConsole" class="sandbox-console tester-theme" style="display:none;">READY FOR SYSTEM EXECUTION LOGS...</div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="terminal-btn payload-btn-copy mono" onclick="copySandboxActivePayload()" style="flex: 1;">COPY ACTIVE STREAM</button>
          <button class="terminal-btn mono" onclick="dispatchToGithubRepo()" style="flex: 1; background: var(--yellow); color: var(--deep-black);">OPEN SUBMISSION GATE</button>
        </div>
      </div>
    </div>
  `;

  // Inject Sandbox into the UI container before the Directory section
  const directorySection = document.getElementById('directory');
  if (directorySection) {
    container.insertBefore(sandboxSection, directorySection);
  } else {
    container.appendChild(sandboxSection);
  }

  // Active state management
  let activeSandboxTab = 'manifest';

  // Global Sandbox Functions Attached to window
  window.switchSandboxTab = function(tabKey) {
    activeSandboxTab = tabKey;
    const btnManifest = document.getElementById('tabManifest');
    const btnPR = document.getElementById('tabPR');
    const btnConsole = document.getElementById('tabConsole');

    const outManifest = document.getElementById('sandboxOutputManifest');
    const outPR = document.getElementById('sandboxOutputPR');
    const outConsole = document.getElementById('sandboxOutputConsole');

    btnManifest.classList.remove('active');
    btnPR.classList.remove('active');
    btnConsole.classList.remove('active');

    outManifest.style.display = 'none';
    outPR.style.display = 'none';
    outConsole.style.display = 'none';

    if (tabKey === 'manifest') {
      btnManifest.classList.add('active');
      outManifest.style.display = 'block';
    } else if (tabKey === 'pr') {
      btnPR.classList.add('active');
      outPR.style.display = 'block';
    } else if (tabKey === 'console') {
      btnConsole.classList.add('active');
      outConsole.style.display = 'block';
    }
  };

  // Compile YAML Manifest Schema
  function compileYamlSchema() {
    const id = document.getElementById('sbAgentId').value || 'tactical_advisor_01';
    const name = document.getElementById('sbAgentName').value || 'Tactical Advisor Pro';
    const platform = document.getElementById('sbPlatform').value;
    const category = document.getElementById('sbCategory').value;
    const color = document.getElementById('sbColor').value;
    const author = document.getElementById('sbAuthor').value || 'operator-one';
    const desc = document.getElementById('sbDesc').value || '';
    const rules = document.getElementById('sbRules').value || '';

    const depGPT = document.getElementById('sbDepGPT').checked ? 'READY' : 'N/A';
    const depNotion = document.getElementById('sbDepNotion').checked ? 'READY' : 'N/A';
    const depSupa = document.getElementById('sbDepSupa').checked ? 'READY' : 'N/A';

    return `id: "${id}"
name: "${name}"
platform: "${platform}"
category: "${category}"
tag: "${category}"
status: "Live"
description: "${desc.replace(/"/g, '\\"')}"
color: "${color}"
launchUrl: "#"
repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal"
dependencies:
  chatgpt: "${depGPT}"
  notion: "${depNotion}"
  supabase: "${depSupa}"
system_rules: |
  ${rules.split('\n').join('\n  ')}`;
  }

  // Compile PR Markdown template
  function compilePRTemplate() {
    const name = document.getElementById('sbAgentName').value || 'Tactical Advisor Pro';
    const category = document.getElementById('sbCategory').value;
    const platform = document.getElementById('sbPlatform').value;
    const author = document.getElementById('sbAuthor').value || 'operator-one';
    const desc = document.getElementById('sbDesc').value || '';
    const yaml = compileYamlSchema();

    return `### 🚀 Custom Weapon Registry Submission: ${name}

**Category:** ${category}
**Platform:** ${platform}
**Author:** @${author}

#### Operational Utility Description
${desc}

#### Compiled System Manifest
\`\`\`yaml
${yaml}
\`\`\``;
  }

  // Dynamic Live-compiler updates when typing inside any parameter input
  const liveInputs = ['sbAgentId', 'sbAgentName', 'sbPlatform', 'sbCategory', 'sbColor', 'sbAuthor', 'sbDesc', 'sbRules', 'sbDepGPT', 'sbDepNotion', 'sbDepSupa'];
  liveInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateSandboxDisplays);
      el.addEventListener('change', updateSandboxDisplays);
    }
  });

  function updateSandboxDisplays() {
    document.getElementById('sandboxOutputManifest').textContent = compileYamlSchema();
    document.getElementById('sandboxOutputPR').textContent = compilePRTemplate();
  }

  // Run Sandbox simulation log output
  window.runSandboxSimulation = function() {
    window.switchSandboxTab('console');
    const consoleOut = document.getElementById('sandboxOutputConsole');
    const promptValue = document.getElementById('sbTestPrompt').value || 'System check';
    const agentName = document.getElementById('sbAgentName').value || 'Tactical Advisor Pro';
    const rules = document.getElementById('sbRules').value || 'Always perform strict verification checks.';

    consoleOut.innerHTML = ``;
    
    // Console Stream simulation helper
    function streamLine(text, delay) {
      setTimeout(() => {
        const span = document.createElement('div');
        span.innerHTML = text;
        consoleOut.appendChild(span);
        consoleOut.scrollTop = consoleOut.scrollHeight;
      }, delay);
    }

    streamLine(`[SANDBOX INITIALIZED] BOOTING COGNITIVE RUNTIME...`, 0);
    streamLine(`[CONFIG] Target Node: ${agentName}`, 400);
    streamLine(`[CONFIG] System Prompt Matrix parsed (${rules.length} characters loaded)`, 800);
    streamLine(`[API] Dispatching payload stream...`, 1200);
    streamLine(`[API] Content: "${promptValue}"`, 1400);
    streamLine(`[RUNTIME] Core executing parameters...`, 1800);

    // Mock highly tailored outputs based on actual input configurations
    setTimeout(() => {
      let outputText = ``;
      if (rules.toLowerCase().includes('underwriter') || rules.toLowerCase().includes('verification')) {
        outputText = `[SYSTEM OUT] REJECTION FLAGS CONFIRMED:
• Debt-to-Revenue ratios exceeding 45% flag systemic operational warning.
• Active cash balances representing under 1.5x monthly debt service requirements route directly to manual rejection.`;
      } else {
        outputText = `[SYSTEM OUT] COMPREHENSIVE RESPONSE STRUCTURE:
• Evaluated active inputs against custom system prompt matrix.
• Action-oriented strategies aligned inside local workflow pipelines successfully.`;
      }

      streamLine(`<span style="color: var(--magenta);">[SIMULATION OUTPUT STREAM]</span><br>${outputText}`, 2200);
      streamLine(`[RUNTIME] Execution success in 540ms. Prompt tokens: ${Math.round(rules.length / 4)}, Completion: 180.`, 2600);

      // Write execution log to master console too!
      if (typeof window.addConsoleLine === 'function') {
        window.addConsoleLine(`Sandbox simulation completed successfully for [${agentName}].`, "SANDBOX");
      }
    }, 1000);
  };

  // Inject Compiled Weapon Dynamically Into the Main Live Arsenal Grid!
  window.injectIntoLocalDatabase = function() {
    const id = document.getElementById('sbAgentId').value || 'tactical_advisor_01';
    const name = document.getElementById('sbAgentName').value || 'Tactical Advisor Pro';
    const platform = document.getElementById('sbPlatform').value;
    const category = document.getElementById('sbCategory').value;
    const color = document.getElementById('sbColor').value;
    const desc = document.getElementById('sbDesc').value || '';

    const depGPT = document.getElementById('sbDepGPT').checked ? 'READY' : 'N/A';
    const depNotion = document.getElementById('sbDepNotion').checked ? 'READY' : 'N/A';
    const depSupa = document.getElementById('sbDepSupa').checked ? 'READY' : 'N/A';

    // Build the dynamic object structure matching the original database
    const localWeapon = {
      id: id,
      name: name,
      platform: platform,
      category: category,
      tag: category,
      status: "Live",
      description: desc,
      color: color,
      launchUrl: "#",
      repoUrl: "https://github.com/jasonfeimster/ai-agent-arsenal",
      chatgpt: depGPT,
      notion: depNotion,
      supabase: depSupa
    };

    // Check if global array exists and prepend our new prototype
    if (window.weaponsDatabase && Array.isArray(window.weaponsDatabase)) {
      // Avoid duplicate injections
      const existingIdx = window.weaponsDatabase.findIndex(w => w.id === localWeapon.id);
      if (existingIdx !== -1) {
        window.weaponsDatabase[existingIdx] = localWeapon;
      } else {
        window.weaponsDatabase.unshift(localWeapon);
      }

      // Re-trigger global render pipeline
      if (typeof window.renderArmory === 'function') {
        window.renderArmory();
        if (typeof window.addConsoleLine === 'function') {
          window.addConsoleLine(`LOCAL INJECTION SUCCESS: [${name}] fully compiled and injected into UI layout matrix.`, "SANDBOX");
        }
        
        // Highlight active status card pulse animation triggers
        window.location.hash = "#directory";
      }
    } else {
      console.warn("Global database array 'weaponsDatabase' not found on current screen scope.");
    }
  };

  // Copy current active tab output data
  window.copySandboxActivePayload = function() {
    let copyText = '';
    if (activeSandboxTab === 'manifest') {
      copyText = compileYamlSchema();
    } else if (activeSandboxTab === 'pr') {
      copyText = compilePRTemplate();
    } else {
      copyText = document.getElementById('sandboxOutputConsole').textContent;
    }

    navigator.clipboard.writeText(copyText).then(() => {
      if (typeof window.addConsoleLine === 'function') {
        window.addConsoleLine(`Sandbox Clipboard success: Copied ${activeSandboxTab.toUpperCase()} buffer payload.`, "SANDBOX");
      }
    }).catch(err => {
      console.error("Clipboard copy operation raised error: ", err);
    });
  };

  // Dispatch direct submission gate action to main Github repo
  window.dispatchToGithubRepo = function() {
    const author = document.getElementById('sbAuthor').value || 'operator-one';
    const name = document.getElementById('sbAgentName').value || 'Tactical-Advisor';
    const title = `New Weapon Entry: ${name} by @${author}`;
    const body = encodeURIComponent(compilePRTemplate());
    
    // Construct dynamic prefilled GitHub issue / PR target template URL
    const targetUrl = `https://github.com/jasonfeimster/ai-agent-arsenal/issues/new?title=${encodeURIComponent(title)}&body=${body}`;
    window.open(targetUrl, '_blank');
    
    if (typeof window.addConsoleLine === 'function') {
      window.addConsoleLine(`DISPATCHED SUBMISSION HANDSHAKE EVENT. Opening direct registration gate on GitHub repository.`, "GITHUB");
    }
  };

  // Initial Content Compiling Trigger
  updateSandboxDisplays();
})();