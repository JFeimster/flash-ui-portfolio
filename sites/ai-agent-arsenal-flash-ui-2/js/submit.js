// Inject styling specifically optimized for The Weapon Forge submission section
const forgeStyles = `
    .forge-section {
        background-color: var(--base-black);
        border-bottom: var(--border-width) solid var(--off-white);
    }

    .forge-layout {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 3rem;
    }

    @media (max-width: 1024px) {
        .forge-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
    }

    /* Form Styles */
    .forge-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .forge-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .forge-label {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: var(--cyan);
        text-transform: uppercase;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .forge-required {
        color: var(--red);
        font-size: 0.75rem;
    }

    .forge-input, .forge-select, .forge-textarea {
        background-color: var(--carbon-black);
        border: var(--border-width) solid var(--off-white);
        color: var(--off-white);
        padding: 0.8rem 1rem;
        font-family: var(--font-sans);
        font-size: 1rem;
        font-weight: 700;
        outline: none;
        transition: all 0.15s;
    }

    .forge-input:focus, .forge-select:focus, .forge-textarea:focus {
        border-color: var(--green);
        box-shadow: 4px 4px 0 var(--magenta);
        transform: translate(-2px, -2px);
    }

    .forge-textarea {
        resize: vertical;
        min-height: 100px;
        font-family: var(--font-sans);
    }

    .forge-textarea.mono-input {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: var(--green);
    }

    .forge-grid-2col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    @media (max-width: 640px) {
        .forge-grid-2col {
            grid-template-columns: 1fr;
        }
    }

    /* Validation Terminal Panel */
    .forge-monitor {
        border: var(--border-width) solid var(--off-white);
        background: var(--carbon-black);
        padding: 1.5rem;
        box-shadow: 10px 10px 0 var(--yellow);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        position: -webkit-sticky;
        position: sticky;
        top: 100px;
        align-self: start;
    }

    .forge-preview-title {
        font-family: var(--font-mono);
        color: var(--yellow);
        font-size: 1rem;
        font-weight: bold;
        border-bottom: 2px dashed var(--graphite);
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .compliance-checklist {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .compliance-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: rgba(244, 241, 232, 0.6);
    }

    .compliance-item.passed {
        color: var(--green);
    }

    .compliance-item.failed {
        color: var(--red);
    }

    .compliance-icon {
        font-weight: bold;
    }

    /* Output Section */
    .forge-outputs {
        grid-column: 1 / -1;
        border: var(--border-width) solid var(--off-white);
        background-color: var(--graphite);
        padding: 2rem;
        box-shadow: 8px 8px 0 var(--magenta);
        display: none;
    }

    .forge-outputs.active {
        display: block;
        animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .output-panes {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-top: 1.5rem;
    }

    @media (max-width: 992px) {
        .output-panes {
            grid-template-columns: 1fr;
        }
    }

    .output-pane {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .output-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .output-title {
        font-family: var(--font-mono);
        font-size: 1rem;
        color: var(--cyan);
        font-weight: bold;
    }

    .code-box {
        background-color: var(--base-black);
        border: 2px solid var(--off-white);
        padding: 1rem;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--off-white);
        overflow-x: auto;
        max-height: 350px;
        white-space: pre-wrap;
        word-break: break-all;
    }

    .success-alert {
        background-color: rgba(182, 255, 0, 0.1);
        border: 2px solid var(--green);
        color: var(--green);
        padding: 1rem;
        font-family: var(--font-mono);
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 12px;
    }
`;

// Define core validation rules matching standard guidelines
const RULES = {
    problemSolved: {
        text: "RULE I: Must resolve a specific user hurdle (not generic theoretical ideas).",
        check: (desc) => desc.length > 30 && !/\b(revolutionary|disruptive|synergy|next-gen|futuristic)\b/i.test(desc)
    },
    goalCTA: {
        text: "RULE II: Requires a clear actionable end goal / target outcome.",
        check: (url, action) => url.trim().length > 0 && action.trim().length > 0
    },
    assetPrompt: {
        text: "RULE III: Core prompt details must be non-empty and operational.",
        check: (prompt) => prompt.trim().split(/\s+/).length >= 10
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Submit Styles
    const styleEl = document.createElement("style");
    styleEl.innerHTML = forgeStyles;
    document.head.appendChild(styleEl);

    // 2. Build Submission Elements dynamically inside a new section
    const forgeSection = document.createElement("section");
    forgeSection.id = "forge";
    forgeSection.className = "section-container forge-section";
    
    forgeSection.innerHTML = `
        <div class="section-header">
            <div class="section-title-wrap">
                <div class="section-pretitle mono-text">// CODENAME: WEAPON FORGE</div>
                <h2 class="section-title">The Weapon Forge</h2>
                <p class="section-subtitle">
                    Construct and parameterize a new tool. Run systemic diagnostics, compliance validations, and instantly compile pull-request-ready Markdown & structured JSON arrays.
                </p>
            </div>
        </div>

        <div class="forge-layout">
            <!-- LEFT INPUT COCKPIT -->
            <form class="forge-form" id="forge-form" onsubmit="return false;">
                <div class="forge-grid-2col">
                    <div class="forge-group">
                        <label class="forge-label">Weapon Name <span class="forge-required">*</span></label>
                        <input type="text" id="tool-name" class="forge-input" placeholder="e.g. SBA Qualification Engine" required>
                    </div>
                    <div class="forge-group">
                        <label class="forge-label">Platform Matrix <span class="forge-required">*</span></label>
                        <select id="tool-platform" class="forge-select" required>
                            <option value="CustomGPT">CustomGPT</option>
                            <option value="Gemini Gem">Gemini Gem</option>
                            <option value="AI Studio App">AI Studio App</option>
                            <option value="Static App">Static App</option>
                            <option value="Prompt System">Prompt System</option>
                            <option value="Vercel App">Vercel App</option>
                        </select>
                    </div>
                </div>

                <div class="forge-grid-2col">
                    <div class="forge-group">
                        <label class="forge-label">Use Case Category <span class="forge-required">*</span></label>
                        <select id="tool-category" class="forge-select" required>
                            <option value="Funding & Capital">Funding & Capital</option>
                            <option value="Cash Flow">Cash Flow</option>
                            <option value="Business Credit">Business Credit</option>
                            <option value="Ecommerce Finance">Ecommerce Finance</option>
                            <option value="Affiliate Growth">Affiliate Growth</option>
                            <option value="Founder Ops">Founder Ops</option>
                            <option value="Prompt Systems">Prompt Systems</option>
                        </select>
                    </div>
                    <div class="forge-group">
                        <label class="forge-label">System Operator Status <span class="forge-required">*</span></label>
                        <select id="tool-status" class="forge-select" required>
                            <option value="Live">Live (Production Ready)</option>
                            <option value="Prototype">Prototype (Field Testing)</option>
                        </select>
                    </div>
                </div>

                <div class="forge-group">
                    <label class="forge-label">
                        Short Objective / Tactical Use Case <span class="forge-required">*</span>
                        <span id="char-count" style="font-size:0.75rem; color:var(--magenta);">0/200 chars</span>
                    </label>
                    <textarea id="tool-desc" class="forge-textarea" placeholder="Describe the concrete, real-world operational problem this agent solves. Avoid fluff, buzzwords, or marketing fog." maxlength="200" required></textarea>
                </div>

                <div class="forge-grid-2col">
                    <div class="forge-group">
                        <label class="forge-label">Launch Target URL <span class="forge-required">*</span></label>
                        <input type="url" id="tool-launch" class="forge-input" placeholder="https://..." required>
                    </div>
                    <div class="forge-group">
                        <label class="forge-label">Code Base / Repo Target URL <span class="forge-required">*</span></label>
                        <input type="url" id="tool-code" class="forge-input" placeholder="https://github.com/... or #" required>
                    </div>
                </div>

                <div class="forge-grid-2col">
                    <div class="forge-group">
                        <label class="forge-label">Primary Interactive Call To Action <span class="forge-required">*</span></label>
                        <input type="text" id="tool-cta" class="forge-input" placeholder="e.g. Launch Tool, Execute Agent" required>
                    </div>
                    <div class="forge-group">
                        <label class="forge-label">Vector Tags (Comma Delimited)</label>
                        <input type="text" id="tool-meta" class="forge-input" placeholder="e.g. lead-gen, sba-math, calc">
                    </div>
                </div>

                <div class="forge-group">
                    <label class="forge-label">Core System Directive / Command Prompts <span class="forge-required">*</span></label>
                    <textarea id="tool-prompt" class="forge-textarea mono-input" placeholder="Paste the operational prompts, instructional constraints, or system logic definitions here..." required></textarea>
                </div>

                <div>
                    <button type="button" id="btn-forge-run" class="btn-brutal" style="background-color: var(--green); box-shadow: 5px 5px 0 var(--magenta); width:100%; justify-content:center; padding:1rem;">
                        [⚡] Run System Diagnostic & Compile Weapon
                    </button>
                </div>
            </form>

            <!-- RIGHT SYSTEM PANEL / LIVE MONITOR -->
            <div class="forge-monitor">
                <div>
                    <div class="forge-preview-title">// REAL-TIME FIELD PREVIEW</div>
                    <div id="forge-card-container">
                        <!-- Live preview card will inject here -->
                    </div>
                </div>

                <div>
                    <div class="forge-preview-title">// COMPLIANCE CHECKLIST</div>
                    <div class="compliance-checklist" id="compliance-checklist">
                        <div class="compliance-item" id="chk-problem">
                            <span class="compliance-icon">[-]</span> <span class="compliance-text">${RULES.problemSolved.text}</span>
                        </div>
                        <div class="compliance-item" id="chk-cta">
                            <span class="compliance-icon">[-]</span> <span class="compliance-text">${RULES.goalCTA.text}</span>
                        </div>
                        <div class="compliance-item" id="chk-prompt">
                            <span class="compliance-icon">[-]</span> <span class="compliance-text">${RULES.assetPrompt.text}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- COMPILATION OUTPUT PANEL -->
            <div class="forge-outputs" id="forge-outputs">
                <div class="success-alert">
                    <div style="font-size: 1.5rem;">[✔]</div>
                    <div>
                        <strong>DIAGNOSTIC CRITERIA MET.</strong> Compilation complete. Copy the payloads below and integrate them into your environment or directly into a Github PR to update the Arsenal.
                    </div>
                </div>

                <div class="output-panes">
                    <!-- JSON PAYLOAD -->
                    <div class="output-pane">
                        <div class="output-header">
                            <span class="output-title">[01] STRUCTURED JSON ARRAY ELEMENT</span>
                            <button class="btn-brutal" id="btn-copy-json" style="font-size:0.75rem; padding: 0.3rem 0.6rem; box-shadow: 2px 2px 0 var(--cyan);">Copy Payload</button>
                        </div>
                        <div class="code-box" id="json-output"></div>
                    </div>

                    <!-- MARKDOWN CONTENT -->
                    <div class="output-pane">
                        <div class="output-header">
                            <span class="output-title">[02] PULL REQUEST MARKDOWN BLOCK</span>
                            <button class="btn-brutal" id="btn-copy-md" style="font-size:0.75rem; padding: 0.3rem 0.6rem; box-shadow: 2px 2px 0 var(--yellow);">Copy Payload</button>
                        </div>
                        <div class="code-box" id="md-output"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 3. Insert newly generated Section right before footer element
    const footerElement = document.querySelector("footer");
    if (footerElement) {
        document.body.insertBefore(forgeSection, footerElement);
    } else {
        document.body.appendChild(forgeSection);
    }

    // --- Interactive Interface Logic ---
    const toolName = document.getElementById("tool-name");
    const toolPlatform = document.getElementById("tool-platform");
    const toolCategory = document.getElementById("tool-category");
    const toolStatus = document.getElementById("tool-status");
    const toolDesc = document.getElementById("tool-desc");
    const toolLaunch = document.getElementById("tool-launch");
    const toolCode = document.getElementById("tool-code");
    const toolCTA = document.getElementById("tool-cta");
    const toolMeta = document.getElementById("tool-meta");
    const toolPrompt = document.getElementById("tool-prompt");
    const charCount = document.getElementById("char-count");

    const cardContainer = document.getElementById("forge-card-container");
    const outputsSection = document.getElementById("forge-outputs");
    const btnForgeRun = document.getElementById("btn-forge-run");

    // Dynamic color picker matching platform mappings
    function getPlatformMeta(platform) {
        switch (platform) {
            case "CustomGPT": return { color: "var(--blue)", cssClass: "p-customgpt" };
            case "Gemini Gem": return { color: "var(--yellow)", cssClass: "p-gemini" };
            case "AI Studio App": return { color: "var(--green)", cssClass: "p-studio" };
            case "Vercel App": return { color: "var(--magenta)", cssClass: "p-vercel" };
            case "Prompt System": return { color: "var(--green)", cssClass: "p-prompt" };
            default: return { color: "var(--cyan)", cssClass: "p-static" };
        }
    }

    // Dynamic Live Preview updates
    function updateLivePreview() {
        const name = toolName.value || "SYSTEM WEAPON CODENAME";
        const platform = toolPlatform.value;
        const status = toolStatus.value;
        const desc = toolDesc.value || "Awaiting target description inputs. Describe the operational capabilities and concrete metrics built into this agent...";
        const action = toolCTA.value || "Execute Action";
        
        const platMeta = getPlatformMeta(platform);
        const sClass = status === "Live" ? "s-live" : "s-prototype";

        cardContainer.innerHTML = `
            <div class="weapon-card" style="--accent-card: ${platMeta.color}; transform: none !important; box-shadow: 4px 4px 0 var(--graphite);">
                <div>
                    <div class="card-top">
                        <div class="card-meta-wrap">
                            <span class="p-badge ${platMeta.cssClass}">${platform}</span>
                            <span class="s-badge ${sClass}">${status}</span>
                        </div>
                        <span class="mono-text" style="color: ${platMeta.color}">[PX]</span>
                    </div>
                    <h3 class="card-title">${name}</h3>
                    <p class="card-desc">${desc}</p>
                </div>
                <div class="card-footer">
                    <a href="#" class="card-btn primary-action" onclick="return false;">${action}</a>
                    <a href="#" class="card-btn" onclick="return false;">View Code</a>
                </div>
            </div>
        `;

        // Update Char limit live indicator
        const len = toolDesc.value.length;
        charCount.textContent = `${len}/200 chars`;
        if (len >= 180) {
            charCount.style.color = "var(--red)";
        } else {
            charCount.style.color = "var(--magenta)";
        }

        // Live Compliance Auditing
        auditCompliance();
    }

    function auditCompliance() {
        // Rule I: No fluff and reasonable size description
        const problemValid = RULES.problemSolved.check(toolDesc.value);
        updateRuleUI("chk-problem", problemValid);

        // Rule II: Launch and CTA targets exist
        const ctaValid = RULES.goalCTA.check(toolLaunch.value, toolCTA.value);
        updateRuleUI("chk-cta", ctaValid);

        // Rule III: Substantial Prompt Matrix
        const promptValid = RULES.assetPrompt.check(toolPrompt.value);
        updateRuleUI("chk-prompt", promptValid);

        return problemValid && ctaValid && promptValid;
    }

    function updateRuleUI(elementId, isValid) {
        const el = document.getElementById(elementId);
        const icon = el.querySelector(".compliance-icon");
        if (isValid) {
            el.className = "compliance-item passed";
            icon.textContent = "[✔]";
        } else {
            el.className = "compliance-item failed";
            icon.textContent = "[X]";
        }
    }

    // Event hooks for instant validation visual updates
    [toolName, toolPlatform, toolCategory, toolStatus, toolDesc, toolLaunch, toolCode, toolCTA, toolMeta, toolPrompt].forEach(el => {
        el.addEventListener("input", updateLivePreview);
        el.addEventListener("change", updateLivePreview);
    });

    // Run core engine synthesis
    btnForgeRun.addEventListener("click", () => {
        // Trigger default browser form validations
        const form = document.getElementById("forge-form");
        if (!form.reportValidity()) {
            return;
        }

        // Run compliance checks strictly
        const isCompliant = auditCompliance();
        if (!isCompliant) {
            alert("[!] CRITICAL DIRECTIVE FAILURE: The current parameters violate AI Arsenal rules. Correct items highlighted in red before forging output matrices.");
            return;
        }

        // Generate JSON Array element payload
        const parsedMeta = toolMeta.value.split(",")
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length > 0);

        const jsonElement = {
            id: "NEW",
            name: toolName.value,
            platform: toolPlatform.value,
            category: toolCategory.value,
            description: toolDesc.value,
            status: toolStatus.value,
            accentColor: getPlatformMeta(toolPlatform.value).color,
            launchUrl: toolLaunch.value,
            codeUrl: toolCode.value,
            meta: parsedMeta
        };

        const markdownElement = `### [${toolPlatform.value}] ${toolName.value}

**Category:** ${toolCategory.value}  
**Status:** \`${toolStatus.value.toUpperCase()}\`  
**Description:** ${toolDesc.value}  

#### ⚔️ Core Operational Protocol & Instructions
\`\`\`markdown
${toolPrompt.value}
\`\`\`

#### ⚡ Tactical Connections
- **Launch Target:** [${toolCTA.value}](${toolLaunch.value})
- **Repo / Source:** [View Code](${toolCode.value})
- **Metadata Tags:** ${parsedMeta.map(m => `\`${m}\``).join(", ") || "None"}
`;

        // Render inputs in panels
        document.getElementById("json-output").textContent = JSON.stringify(jsonElement, null, 4);
        document.getElementById("md-output").textContent = markdownElement;

        // Display compiled fields
        outputsSection.classList.add("active");
        outputsSection.scrollIntoView({ behavior: "smooth" });
    });

    // Copy handlers
    function copyElementText(elId, button) {
        const text = document.getElementById(elId).textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = "COPIED TO SYSTEM!";
            button.style.backgroundColor = "var(--green)";
            button.style.color = "var(--base-black)";
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = "";
                button.style.color = "";
            }, 2000);
        });
    }

    document.getElementById("btn-copy-json").addEventListener("click", (e) => {
        copyElementText("json-output", e.target);
    });

    document.getElementById("btn-copy-md").addEventListener("click", (e) => {
        copyElementText("md-output", e.target);
    });

    // Run initial rendering
    updateLivePreview();
});