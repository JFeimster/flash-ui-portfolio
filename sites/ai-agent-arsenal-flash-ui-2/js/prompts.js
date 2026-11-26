const promptArmamentData = {
    templates: [
        {
            id: "T1",
            name: "MCA & Capital Prospect Qualifier",
            category: "Funding & Capital",
            description: "Structured system engine to qualify merchants, calculate estimated loan suitability, and map risk limits.",
            parameters: [
                { key: "NICHE", label: "Target Business Niche", default: "E-commerce & SaaS Merchants", placeholder: "e.g., Heavy Construction, Retail" },
                { key: "LEAD_MAGNET_TYPE", label: "Lead Diagnostic Tool", default: "Cash Runway Audit", placeholder: "e.g., MCA Cost Calculator" },
                { key: "FOLLOW_UP_ACTION", label: "Primary Goal Routing", default: "Direct Funding Offer API", placeholder: "e.g., Soft Credit Pull Schedule" }
            ],
            rawPrompt: `<system_instructions>
  <role_identity>
    You are the Tactical MCA Lead Qualification Engine. Your sole directive is to parse prospective borrowers in the [NICHE] space and determine their operational leverage suitability.
  </role_identity>
  
  <context_boundaries>
    <restricted_topics>
      Never guarantee absolute capital approval. Never estimate APR or payback rates with binding certainty.
    </restricted_topics>
    <mandatory_inputs>
      Monthly revenue logs, business age, current outstanding ledger burdens, and target use of capital.
    </mandatory_inputs>
  </context_boundaries>

  <rules_of_engagement>
    1. Assess the borrower metrics through the lens of a [LEAD_MAGNET_TYPE] diagnostic.
    2. Format analysis briefs strictly in brutalist, scannable markdown tables.
    3. Conclude every evaluation by routing the user to the [FOLLOW_UP_ACTION] gateway.
  </rules_of_engagement>
</system_instructions>`
        },
        {
            id: "T2",
            name: "The Runway Guardian",
            category: "Cash Flow",
            description: "High-yield system prompt enforcing multi-turn reasoning loops over raw overhead reports.",
            parameters: [
                { key: "BUSINESS_TYPE", label: "Operational Type", default: "High-Volume Shopify Brand", placeholder: "e.g., B2B Wholesale Distributor" },
                { key: "PRIMARY_METRIC", label: "Critical Risk Metric", default: "Burn-Rate Index", placeholder: "e.g., Days Sales Outstanding (DSO)" },
                { key: "ALERT_THRESHOLD", label: "Tolerance Threshold (%)", default: "15", placeholder: "e.g., 20" }
            ],
            rawPrompt: `<system_instructions>
  <role_identity>
    You are the Runway Guardian, a specialized cash flow sentinel guarding [BUSINESS_TYPE] operations from unexpected insolvency.
  </role_identity>
  
  <analytical_sequence>
    1. Read and tokenize raw CSV bank ledgers, isolating structural overhead anomalies.
    2. Monitor [PRIMARY_METRIC] metrics with high frequency.
    3. Trigger a "CODE RED" advisory if burn deviation surpasses [ALERT_THRESHOLD]%.
  </analytical_sequence>

  <system_output_protocol>
    Generate a structural recovery strategy emphasizing immediate debt consolidation and operational asset liquidations. Avoid conversational pleasantries. Give me raw math.
  </system_output_protocol>
</system_instructions>`
        },
        {
            id: "T3",
            name: "Strict OpenAPI Schema Architect",
            category: "Prompt System",
            description: "Enforces raw, functional OpenAPI schema compliance from disorganized API descriptions.",
            parameters: [
                { key: "API_ENDPOINT", label: "Target Platform API", default: "https://api.arsenal.finance/v1/deals", placeholder: "e.g., Plaid Integration Sandbox" },
                { key: "AUTH_TYPE", label: "Security Schema", default: "Bearer JWT Authentication", placeholder: "e.g., OAuth2 Implicit Grant" },
                { key: "ERROR_HANDLING_PRIORITY", label: "Fail-Safe Protocol", default: "Graceful Fallback Cache Routing", placeholder: "e.g., Hard Reject with Diagnostic Payload" }
            ],
            rawPrompt: `<system_instructions>
  <role_identity>
    You are the Schema Architect, a code construction micro-agent dedicated to outputting bulletproof OpenAPI YAML specifications.
  </role_identity>
  
  <endpoint_mapping>
    Ensure payload configurations align exactly with the schema at [API_ENDPOINT].
    Configure auth headers utilizing [AUTH_TYPE] configurations strictly.
  </endpoint_mapping>

  <error_handling>
    Whenever payload delivery errors or schema mismatches occur, trigger the [ERROR_HANDLING_PRIORITY] sequence in the output block.
  </error_handling>

  <output_rules>
    No markdown introduction blocks, no conversation, no meta-commentary. Output raw YAML/JSON instructions directly inside structured bounds.
  </output_rules>
</system_instructions>`
        }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Styles dynamically matching parent theme
    const styleElement = document.createElement("style");
    styleElement.textContent = `
        .prompt-section {
            background-color: var(--base-black);
            border-top: var(--border-width) solid var(--off-white);
            border-bottom: var(--border-width) solid var(--off-white);
            padding: 6rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }

        .prompt-grid {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 3rem;
            margin-top: 3rem;
        }

        @media (max-width: 1024px) {
            .prompt-grid {
                grid-template-columns: 1fr;
            }
        }

        .armament-control-panel {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .armament-card {
            background-color: var(--carbon-black);
            border: var(--border-width) solid var(--off-white);
            padding: 1.5rem;
            box-shadow: 6px 6px 0 var(--graphite);
        }

        .armament-title {
            color: var(--yellow);
            font-size: 1.4rem;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .param-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1.5rem;
            border-top: 2px dashed var(--graphite);
            padding-top: 1.5rem;
        }

        .param-field {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .param-label {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--cyan);
            text-transform: uppercase;
            font-weight: bold;
        }

        .param-input {
            background-color: var(--base-black);
            border: 2px solid var(--off-white);
            color: var(--off-white);
            padding: 0.6rem;
            font-family: var(--font-sans);
            font-size: 0.95rem;
            outline: none;
            transition: all 0.15s;
        }

        .param-input:focus {
            border-color: var(--green);
            background-color: rgba(182, 255, 0, 0.05);
            box-shadow: 3px 3px 0 var(--magenta);
        }

        /* Diagnostic Flow Diagram */
        .diag-wrapper {
            background: var(--carbon-black);
            border: var(--border-width) solid var(--off-white);
            padding: 1.5rem;
            box-shadow: 6px 6px 0 var(--magenta);
        }

        .diag-header {
            font-family: var(--font-mono);
            color: var(--magenta);
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .diag-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            font-family: var(--font-mono);
            font-size: 0.75rem;
            text-align: center;
        }

        .diag-node {
            background: var(--graphite);
            border: 2px solid var(--graphite);
            padding: 10px 5px;
            color: rgba(244, 241, 232, 0.6);
            transition: all 0.2s ease;
        }

        .diag-node.active {
            border-color: var(--green);
            color: var(--green);
            box-shadow: 0 0 10px rgba(182, 255, 0, 0.3);
            font-weight: bold;
        }

        .diag-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--cyan);
            font-weight: bold;
        }

        /* Preview Area */
        .armament-preview-panel {
            background-color: var(--carbon-black);
            border: var(--border-width) solid var(--off-white);
            padding: 2rem;
            box-shadow: 8px 8px 0 var(--cyan);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
        }

        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--graphite);
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
        }

        .preview-box {
            background-color: var(--base-black);
            border: 2px solid var(--graphite);
            padding: 1.5rem;
            color: var(--green);
            font-family: var(--font-mono);
            font-size: 0.9rem;
            line-height: 1.5;
            white-space: pre-wrap;
            overflow-x: auto;
            max-height: 500px;
            overflow-y: auto;
            position: relative;
        }

        .template-btn-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 1rem;
        }

        @media (max-width: 600px) {
            .template-btn-grid {
                grid-template-columns: 1fr;
            }
        }

        .t-selector-btn {
            background-color: var(--graphite);
            color: var(--off-white);
            border: 2px solid var(--off-white);
            padding: 0.75rem 1rem;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.15s;
            text-align: left;
        }

        .t-selector-btn:hover {
            background-color: var(--off-white);
            color: var(--base-black);
        }

        .t-selector-btn.active {
            background-color: var(--magenta);
            color: var(--base-black);
            border-color: var(--magenta);
            box-shadow: 3px 3px 0 var(--cyan);
        }

        .xml-tag {
            color: var(--cyan);
        }

        .xml-content {
            color: var(--off-white);
        }
        
        .pulse-glow {
            animation: border-glow-pulse 1.5s infinite alternate;
        }

        @keyframes border-glow-pulse {
            from { border-color: var(--off-white); }
            to { border-color: var(--green); }
        }
    `;
    document.head.appendChild(styleElement);

    // 2. Build DOM Section for "Prompt Armament"
    const targetSection = document.querySelector(".section-container[style*='background-color: var(--base-black)']");
    const newSection = document.createElement("section");
    newSection.className = "prompt-section";
    newSection.id = "prompt-armament";
    newSection.innerHTML = `
        <div class="section-header">
            <div class="section-title-wrap">
                <div class="section-pretitle mono-text">// COLD START DIRECTIVES</div>
                <h2 class="section-title">The Prompt Armament</h2>
                <p class="section-subtitle">
                    System Blueprint & Variable Injection Engine. Synthesize precise XML system prompts directly into clipboard arrays with instantaneous custom target embedding.
                </p>
            </div>
        </div>

        <div class="template-btn-grid" id="t-btn-container"></div>

        <div class="prompt-grid">
            <!-- Parameter Panel -->
            <div class="armament-control-panel">
                <div class="armament-card">
                    <div class="armament-title mono-text">
                        <span>[PARAMETER DEPLOYMENT]</span>
                        <span id="active-category-badge" class="p-badge p-customgpt" style="font-size:0.7rem">SBA PREP</span>
                    </div>
                    <p style="font-size:0.9rem; color: rgba(244, 241, 232, 0.7); line-height: 1.4;">
                        Synthesize your niche credentials directly into the prompt matrix below. Inputs dynamically build XML bounds to contain agent deviation.
                    </p>
                    <div class="param-group" id="param-fields-wrapper"></div>
                </div>

                <!-- Live System Architecture Flow Diagram -->
                <div class="diag-wrapper">
                    <div class="diag-header">
                        <span>[CORE ARCHITECTURE DEPLOYMENT]</span>
                        <span style="color: var(--green)">ACTIVE FLOW</span>
                    </div>
                    <div class="diag-grid">
                        <div class="diag-node active" id="node-user">USER INPUT</div>
                        <div class="diag-arrow">&gt;</div>
                        <div class="diag-node active" id="node-xml">XML SHIELD</div>
                        <div class="diag-arrow">&gt;</div>
                        <div class="diag-node active" id="node-inject">VARIABLE ENG</div>
                        <div class="diag-arrow">&gt;</div>
                        <div class="diag-node active" id="node-target">TARGET SYSTEM</div>
                    </div>
                </div>
            </div>

            <!-- Preview Panel -->
            <div class="armament-preview-panel">
                <div>
                    <div class="preview-header">
                        <span class="mono-text" style="color: var(--cyan); font-weight: bold;">[XML CODE SHIELD WRAPPER]</span>
                        <span class="mono-text" style="color: rgba(244, 241, 232, 0.4); font-size: 0.8rem;" id="prompt-char-count">CHARS: 0</span>
                    </div>
                    <div class="preview-box" id="prompt-output-box"></div>
                </div>
                
                <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                    <button class="btn-brutal" id="btn-copy-prompt" style="background-color: var(--green); box-shadow: 4px 4px 0 var(--magenta); width: 100%; justify-content: center;">
                        Copy Directive to Clipboard
                    </button>
                </div>
            </div>
        </div>
    `;

    // Insert section into page dynamically
    if (targetSection) {
        targetSection.parentNode.insertBefore(newSection, targetSection);
    } else {
        document.body.appendChild(newSection);
    }

    // 3. Engine Functionality & Core States
    let activeTemplateIndex = 0;
    const currentParams = {};

    const tBtnContainer = document.getElementById("t-btn-container");
    const paramWrapper = document.getElementById("param-fields-wrapper");
    const outputBox = document.getElementById("prompt-output-box");
    const charCountLabel = document.getElementById("prompt-char-count");
    const activeCategoryBadge = document.getElementById("active-category-badge");
    const btnCopy = document.getElementById("btn-copy-prompt");

    // Initialize template selectors
    promptArmamentData.templates.forEach((t, index) => {
        const btn = document.createElement("button");
        btn.className = `t-selector-btn ${index === 0 ? "active" : ""}`;
        btn.setAttribute("data-index", index);
        btn.innerHTML = `
            <div style="font-size: 0.75rem; color: var(--cyan); margin-bottom: 2px;">MODEL DIRECTIVE ${t.id}</div>
            <div style="text-transform: uppercase;">${t.name}</div>
        `;
        tBtnContainer.appendChild(btn);
    });

    // Handle template changes
    tBtnContainer.addEventListener("click", (e) => {
        const targetBtn = e.target.closest(".t-selector-btn");
        if (!targetBtn) return;

        tBtnContainer.querySelectorAll(".t-selector-btn").forEach(b => b.classList.remove("active"));
        targetBtn.classList.add("active");

        activeTemplateIndex = parseInt(targetBtn.getAttribute("data-index"), 10);
        loadActiveTemplate();
    });

    // Populate variable fields & default state values
    function loadActiveTemplate() {
        const currentTemplate = promptArmamentData.templates[activeTemplateIndex];
        
        // Update category badge styling dynamically
        activeCategoryBadge.textContent = currentTemplate.category;
        if (currentTemplate.category.includes("Capital")) {
            activeCategoryBadge.className = "p-badge p-customgpt";
        } else if (currentTemplate.category.includes("Cash")) {
            activeCategoryBadge.className = "p-badge p-studio";
        } else {
            activeCategoryBadge.className = "p-badge p-prompt";
        }

        // Reset parameters database with current defaults
        paramWrapper.innerHTML = "";
        currentTemplate.parameters.forEach(p => {
            currentParams[p.key] = p.default;

            const fieldDiv = document.createElement("div");
            fieldDiv.className = "param-field";
            fieldDiv.innerHTML = `
                <label class="param-label">${p.label}</label>
                <input type="text" class="param-input" data-key="${p.key}" value="${p.default}" placeholder="${p.placeholder}">
            `;
            paramWrapper.appendChild(fieldDiv);
        });

        // Set up fresh flow highlights
        const nodeInject = document.getElementById("node-inject");
        if (nodeInject) {
            nodeInject.classList.remove("active");
            setTimeout(() => nodeInject.classList.add("active"), 100);
        }

        renderSynthesizedPrompt();
    }

    // Capture parameter inputs on runtime
    paramWrapper.addEventListener("input", (e) => {
        if (!e.target.classList.contains("param-input")) return;
        const key = e.target.getAttribute("data-key");
        currentParams[key] = e.target.value.trim() !== "" ? e.target.value : `[${key}]`;
        
        // Dynamic border glow pulse on user parameter injection
        const nodeInject = document.getElementById("node-inject");
        if (nodeInject) {
            nodeInject.style.borderColor = "var(--yellow)";
            nodeInject.style.boxShadow = "0 0 15px var(--yellow)";
            setTimeout(() => {
                nodeInject.style.borderColor = "";
                nodeInject.style.boxShadow = "";
            }, 300);
        }
        
        renderSynthesizedPrompt();
    });

    // Render logic to assemble text blocks with colorized markup highlight features
    function renderSynthesizedPrompt() {
        const currentTemplate = promptArmamentData.templates[activeTemplateIndex];
        let compiledStr = currentTemplate.rawPrompt;

        // Perform programmatic replacement
        for (const [key, value] of Object.entries(currentParams)) {
            const pattern = new RegExp(`\\[${key}\\]`, "g");
            compiledStr = compiledStr.replace(pattern, value);
        }

        // Build syntax coloring
        const processedHtml = compiledStr
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/(&lt;\/?[a-zA-Z_0-9]+&gt;)/g, '<span class="xml-tag">$1</span>');

        outputBox.innerHTML = processedHtml;
        charCountLabel.textContent = `CHARS: ${compiledStr.length}`;
    }

    // Click to copy functionality
    btnCopy.addEventListener("click", () => {
        const currentTemplate = promptArmamentData.templates[activeTemplateIndex];
        let rawToCopy = currentTemplate.rawPrompt;

        // Retrieve raw interpolation
        for (const [key, value] of Object.entries(currentParams)) {
            const pattern = new RegExp(`\\[${key}\\]`, "g");
            rawToCopy = rawToCopy.replace(pattern, value);
        }

        navigator.clipboard.writeText(rawToCopy).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = "DIRECTIVE COPIED // BUFFER READY";
            btnCopy.style.backgroundColor = "var(--cyan)";
            btnCopy.style.boxShadow = "4px 4px 0 var(--yellow)";

            // Flash output interface border
            outputBox.style.borderColor = "var(--cyan)";

            setTimeout(() => {
                btnCopy.textContent = originalText;
                btnCopy.style.backgroundColor = "var(--green)";
                btnCopy.style.boxShadow = "4px 4px 0 var(--magenta)";
                outputBox.style.borderColor = "var(--graphite)";
            }, 2000);
        }).catch(err => {
            console.error("System pipeline error copying payload: ", err);
        });
    });

    // Run first initialization load
    loadActiveTemplate();
});
