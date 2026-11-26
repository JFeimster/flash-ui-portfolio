(function() {
  // 1. Dynamic CSS Injection for specialized Vault layouts (Neo-Brutalist & Cyberpunk)
  const style = document.createElement('style');
  style.textContent = `
    .vault-section {
      background: var(--carbon-black);
      border: 4px solid var(--off-white);
      box-shadow: var(--neo-shadow-cyan);
      padding: 3rem 2rem;
      margin-bottom: 5rem;
      position: relative;
    }
    .vault-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 2.5rem;
      margin-top: 2rem;
    }
    @media (max-width: 1024px) {
      .vault-grid {
        grid-template-columns: 1fr;
      }
    }
    .vault-controls {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .prompt-selector-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .prompt-selector-label {
      font-size: 0.8rem;
      color: var(--cyan);
      font-weight: bold;
    }
    .vault-tabs {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .vault-tab {
      background: var(--graphite);
      border: 3px solid var(--off-white);
      color: var(--off-white);
      padding: 1rem;
      font-family: 'Share Tech Mono', monospace;
      font-weight: bold;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .vault-tab:hover {
      background: var(--off-white);
      color: var(--deep-black);
    }
    .vault-tab.active {
      background: var(--cyan);
      color: var(--deep-black);
      box-shadow: 4px 4px 0px var(--magenta);
    }
    .vault-tab-meta {
      font-size: 0.7rem;
      opacity: 0.8;
      border: 1px solid currentColor;
      padding: 0.1rem 0.4rem;
    }
    .variables-panel {
      border: 3px solid var(--off-white);
      background: var(--deep-black);
      padding: 1.5rem;
      position: relative;
    }
    .variables-title {
      font-size: 0.9rem;
      color: var(--yellow);
      margin-bottom: 1.2rem;
      border-bottom: 2px dashed var(--graphite);
      padding-bottom: 0.5rem;
    }
    .variables-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .variable-field-grp {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .variable-field-grp label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      color: var(--magenta);
      font-weight: bold;
    }
    .variable-input {
      background: var(--carbon-black);
      border: 2px solid var(--off-white);
      color: var(--off-white);
      padding: 0.6rem;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.1s ease;
    }
    .variable-input:focus {
      border-color: var(--cyan);
    }
    .vault-viewer {
      background: var(--graphite);
      border: 3px solid var(--off-white);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .viewer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .viewer-display {
      background: var(--deep-black);
      border: 2px solid var(--off-white);
      padding: 1.5rem;
      font-family: 'Share Tech Mono', monospace;
      color: var(--acid-green);
      font-size: 0.85rem;
      overflow-y: auto;
      height: 380px;
      white-space: pre-wrap;
      margin-bottom: 1.5rem;
      line-height: 1.5;
      box-shadow: inset 0 0 15px rgba(182, 255, 0, 0.1);
    }
    .viewer-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .viewer-meta-box {
      background: var(--deep-black);
      border: 1px solid var(--graphite);
      padding: 0.5rem;
      text-align: center;
    }
    .viewer-meta-label {
      font-size: 0.65rem;
      color: #888;
      text-transform: uppercase;
    }
    .viewer-meta-val {
      font-size: 0.9rem;
      color: var(--off-white);
      font-weight: bold;
    }
    .btn-vault-copy {
      width: 100%;
      background: var(--magenta);
      color: var(--off-white);
      border: 3px solid var(--off-white);
      padding: 1rem;
      font-weight: 800;
      font-size: 1.1rem;
      cursor: pointer;
      text-transform: uppercase;
      box-shadow: 4px 4px 0px var(--yellow);
      transition: all 0.1s ease;
    }
    .btn-vault-copy:hover {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px var(--yellow);
      background: var(--off-white);
      color: var(--deep-black);
    }
  `;
  document.head.appendChild(style);

  // 2. Prompt Database Configurations
  const promptDatabase = [
    {
      id: "sba-auditor",
      title: "SBA Underwriter Auditor",
      target: "CustomGPT Prompt",
      template: `# ROLE: SBA UNDERWRITER & LOAN RISK AUDITOR
Target Entity Name: {{COMPANY_NAME}}
Monthly Operational Cash flow: {{MONTHLY_REVENUE}}
Focus Industry Sector: {{INDUSTRIES}}

You are an institutional risk underwriter reviewing loan files for qualification criteria based strictly on SBA 7(a) guidelines.

## CORE DIRECTIVES:
1. Cross-reference the core business model in sector [{{INDUSTRIES}}] against high-risk business databases.
2. Flag if stated monthly inflows [{{MONTHLY_REVENUE}}] suggest a DSCR below 1.25 when serviced under standard market variables.
3. Formulate a comprehensive response detailing exact credit repair guidelines or leverage corrections.

## OUTPUT SPECIFICATIONS:
- Respond in cold, analytical, structured Markdown.
- Provide a finalized "INDICATIVE UNDERWRITING RATING" scored strictly from 1 (Denied) to 10 (Sovereign Quality).
- Highlight critical remediation tactics under "# OPERATOR REMEDIAL PROTOCOLS".`,
      placeholders: [
        { key: "{{COMPANY_NAME}}", label: "Company Name", default: "Alpha Syndicate LLC" },
        { key: "{{MONTHLY_REVENUE}}", label: "Monthly Revenue ($)", default: "115,000" },
        { key: "{{INDUSTRIES}}", label: "Industry Sector", default: "B2B SaaS / Commerce Logistics" }
      ]
    },
    {
      id: "gemini-lead-gate",
      title: "Gemini Lead Qualification Gem",
      target: "Gemini Gem Prompt",
      template: `# INSTRUCTIONS FOR THE OPERATOR'S LEAD GATEKEEPER
System Routing Endpoint: {{CRM_INTEGRATION}}
Primary Flagged Value Asset: {{PRODUCT_OFFERING}}
Absolute System Disqualifier: {{DISQUALIFIERS}}

Your sole command is to process incoming customer messages, evaluate purchase readiness, and filter out low-intent users before CRM database injection.

## LOGICAL STEPS:
1. Parse client inquiry context looking for intentions towards buying [{{PRODUCT_OFFERING}}].
2. Audit queries for the presence of hard exclusions such as [{{DISQUALIFIERS}}].
3. Format output packages matching JSON parameters ready for integration endpoint [{{CRM_INTEGRATION}}].

## DISPOSAL ROUTE:
- If positive: Route to Active Pipeline with "INTENT: ACUTE".
- If exclusions found: Immediately terminate processing and label "MUTED".`,
      placeholders: [
        { key: "{{CRM_INTEGRATION}}", label: "CRM Routing Endpoint", default: "/api/v1/tally-lead-sync" },
        { key: "{{PRODUCT_OFFERING}}", label: "Product Offering", default: "Commercial Financing Engine" },
        { key: "{{DISQUALIFIERS}}", label: "Absolute Disqualifiers", default: "unincorporated, zero revenue, credit repair" }
      ]
    },
    {
      id: "runway-warning",
      title: "Runway & Inventory Forecast System",
      target: "AI Studio / API System",
      template: `# SYSTEM ENGINE INSTRUCTIONS: FORECASTING WARNING LOGIC
Minimum Operations Safety Buffer: {{CASH_BUFFER_DAYS}} Days
Supply Chain Turnaround Lag: {{INVENTORY_LEAD_TIME}} Days
Primary Client Growth Funnel: {{MARKET_CHANNEL}}

You are a cold financial logic processor. You accept monthly overhead indices and compute dynamic runway stress levels under adverse distribution states.

## CALCULATIONS MATRIX:
- Map current reserves against safety parameter [{{CASH_BUFFER_DAYS}} Days].
- Compensate for potential production interruptions of [{{INVENTORY_LEAD_TIME}} Days] in primary models.
- Predict capital erosion points if channel conversion rates on [{{MARKET_CHANNEL}}] drop by up to 45%.

## FORMAT CONSTRAINTS:
Output structured, parseable JSON only. No prose, no meta explanations. Code blocks must comply strictly with operational parsing targets.`,
      placeholders: [
        { key: "{{CASH_BUFFER_DAYS}}", label: "Min Reserve Buffer (Days)", default: "90" },
        { key: "{{INVENTORY_LEAD_TIME}}", label: "Inventory Lead Time (Days)", default: "45" },
        { key: "{{MARKET_CHANNEL}}", label: "Primary Ad Channel", default: "Meta Ads / Cold Outreach" }
      ]
    }
  ];

  let activePromptIndex = 0;
  const userVariables = {};

  // 3. Initialize Variables Object with default values
  function initDefaultVariables() {
    promptDatabase.forEach((p, index) => {
      userVariables[index] = {};
      p.placeholders.forEach(pl => {
        userVariables[index][pl.key] = pl.default;
      });
    });
  }

  // Helper helper to write to existing terminal console if accessible
  function logToMainConsole(msg, prefix = "VAULT") {
    if (typeof window.addConsoleLine === "function") {
      window.addConsoleLine(msg, prefix);
    } else {
      console.log(`[${prefix}] ${msg}`);
    }
  }

  // 4. Dom Creation & Insertion
  function createVaultUI() {
    const parentContainer = document.querySelector('.container');
    const siblingAnchor = document.getElementById('api-documentation');

    if (!parentContainer) return;

    const section = document.createElement('section');
    section.id = 'prompt-vault';
    section.className = 'vault-section';

    section.innerHTML = `
      <div class="section-header" style="--accent: var(--cyan); margin-bottom: 2rem;">
        <div class="section-eyebrow mono">OPERATOR CONFIGURATIONS</div>
        <h2 class="section-title">The System Prompt Vault</h2>
        <p class="section-subtitle">A brutalist micro-repository of markdown system configurations built for high-performance deployment. Inject operating metrics dynamically and copy systems directly.</p>
      </div>

      <div class="vault-grid">
        <!-- Controls Column -->
        <div class="vault-controls">
          <div class="prompt-selector-wrapper">
            <span class="prompt-selector-label mono">> CHOOSE_TARGET_SYSTEM_ARCHITECTURE:</span>
            <div class="vault-tabs" id="vaultTabsContainer"></div>
          </div>

          <div class="variables-panel">
            <div class="variables-title mono">[ LIVE VARIABLE PARAMETERS ]</div>
            <div class="variables-grid" id="variablesGridContainer"></div>
          </div>
        </div>

        <!-- Monospace Monolithic Display Column -->
        <div class="vault-viewer">
          <div>
            <div class="viewer-header">
              <span class="mono" style="color: var(--cyan); font-weight: bold; font-size: 0.8rem;">COMPILED_SYSTEM_INSTRUCTIONS</span>
              <span class="mono" style="color: #666; font-size: 0.7rem;">MARKDOWN FORMAT</span>
            </div>
            
            <div class="viewer-display" id="compiledPromptDisplay"></div>

            <div class="viewer-meta-grid">
              <div class="viewer-meta-box">
                <div class="viewer-meta-label mono">Characters</div>
                <div class="viewer-meta-val mono" id="charCounter">0</div>
              </div>
              <div class="viewer-meta-box">
                <div class="viewer-meta-label mono">Placeholder Count</div>
                <div class="viewer-meta-val mono" id="placeholderCounter">0</div>
              </div>
            </div>
          </div>

          <button class="btn-vault-copy mono" id="copyPromptBtn">COPY COMPILED PROMPT SYSTEM</button>
        </div>
      </div>
    `;

    if (siblingAnchor) {
      parentContainer.insertBefore(section, siblingAnchor);
    } else {
      parentContainer.appendChild(section);
    }
  }

  // 5. Render Prompt Selection Tabs
  function renderTabs() {
    const container = document.getElementById('vaultTabsContainer');
    if (!container) return;
    container.innerHTML = '';

    promptDatabase.forEach((prompt, index) => {
      const tab = document.createElement('button');
      tab.className = `vault-tab ${index === activePromptIndex ? 'active' : ''}`;
      tab.innerHTML = `
        <span>${prompt.title}</span>
        <span class="vault-tab-meta mono">${prompt.target}</span>
      `;
      tab.addEventListener('click', () => {
        activePromptIndex = index;
        renderTabs();
        renderVariables();
        compileAndDisplay();
        logToMainConsole(`Switched active prompt model to: [${prompt.title}]`);
      });
      container.appendChild(tab);
    });
  }

  // 6. Render Parameter Variable Input Blocks
  function renderVariables() {
    const container = document.getElementById('variablesGridContainer');
    if (!container) return;
    container.innerHTML = '';

    const currentPrompt = promptDatabase[activePromptIndex];
    currentPrompt.placeholders.forEach(pl => {
      const fieldGrp = document.createElement('div');
      fieldGrp.className = 'variable-field-grp';

      const label = document.createElement('label');
      label.className = 'mono';
      label.textContent = `${pl.label} (${pl.key})`;

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'variable-input';
      input.value = userVariables[activePromptIndex][pl.key] || pl.default;
      input.addEventListener('input', (e) => {
        userVariables[activePromptIndex][pl.key] = e.target.value;
        compileAndDisplay();
      });

      fieldGrp.appendChild(label);
      fieldGrp.appendChild(input);
      container.appendChild(fieldGrp);
    });
  }

  // 7. Compile Markdown with current variable modifications & update UI elements
  function compileAndDisplay() {
    const displayElement = document.getElementById('compiledPromptDisplay');
    const charCounter = document.getElementById('charCounter');
    const placeholderCounter = document.getElementById('placeholderCounter');

    if (!displayElement) return;

    const currentPrompt = promptDatabase[activePromptIndex];
    let compiledText = currentPrompt.template;

    currentPrompt.placeholders.forEach(pl => {
      const userVal = userVariables[activePromptIndex][pl.key] || pl.default;
      // Global replace logic
      compiledText = compiledText.split(pl.key).join(userVal);
    });

    displayElement.textContent = compiledText;
    charCounter.textContent = compiledText.length;
    placeholderCounter.textContent = currentPrompt.placeholders.length;
  }

  // 8. Clipboard Copy Execution
  function handleVaultCopy() {
    const displayElement = document.getElementById('compiledPromptDisplay');
    if (!displayElement) return;

    const rawText = displayElement.textContent;
    navigator.clipboard.writeText(rawText).then(() => {
      logToMainConsole("COGNITIVE ARSENAL SUCCESS: Prompt System copied to clipboards.");
      
      // Temporary button state styling notification
      const btn = document.getElementById('copyPromptBtn');
      const originalText = btn.textContent;
      btn.textContent = "COPIED SUCCESSFULLY!";
      btn.style.backgroundColor = "var(--acid-green)";
      btn.style.color = "var(--deep-black)";
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
      }, 1500);

    }).catch(err => {
      logToMainConsole("VAULT EXCEPTION: Clipboard write failed.", "ERROR");
    });
  }

  // 9. Document Loaded Execution Routing
  window.addEventListener('DOMContentLoaded', () => {
    initDefaultVariables();
    createVaultUI();
    renderTabs();
    renderVariables();
    compileAndDisplay();

    // Attach listener to persistent copy button trigger
    const copyBtn = document.getElementById('copyPromptBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', handleVaultCopy);
    }
  });

})();