/**
 * MOONSHINE CAPITAL PARTNERS - INTEGRATION ADDITION
 * FILE: js/lead-handler.js
 * PURPOSE: High-Speed Lead Submission & Pipeline Tracker with Neo-Brutalist Kanban Engine.
 */

(function () {
    // 1. CSS Styles Dynamic Injection matching Neo-Brutalist/Prism Logic Aesthetic
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        /* Kanban Layout */
        .kanban-grid {
            display: grid;
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 1.5rem;
        }
        @media (min-width: 640px) {
            .kanban-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
            .kanban-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }

        .kanban-col {
            border: 4px solid #000000;
            background-color: #ffffff;
            box-shadow: 6px 6px 0px 0px #000000;
            display: flex;
            flex-direction: column;
            min-height: 380px;
        }

        .kanban-col-header {
            border-bottom: 4px solid #000000;
            padding: 0.75rem;
            font-family: 'Syne', sans-serif;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 0.875rem;
            letter-spacing: 0.05em;
        }

        .kanban-card-container {
            padding: 0.75rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            background-color: #fafafa;
            background-image: radial-gradient(#000000 10%, transparent 10%);
            background-size: 6px 6px;
        }

        /* Lead Card Styling */
        .lead-card {
            border: 4px solid #000000;
            background-color: #ffffff;
            padding: 0.75rem;
            position: relative;
            box-shadow: 4px 4px 0px 0px #000000;
            transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .lead-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px 0px #000000;
        }

        /* Console styling */
        .terminal-console {
            background-color: #000000;
            color: #E2FF00;
            font-family: monospace;
            font-size: 0.75rem;
            padding: 0.75rem;
            border: 4px solid #000000;
            box-shadow: 4px 4px 0px 0px #FF0055;
            max-height: 120px;
            overflow-y: auto;
        }

        /* Input alerts */
        .validation-indicator {
            font-family: monospace;
            font-size: 0.7rem;
            font-weight: bold;
            text-transform: uppercase;
            padding: 2px 6px;
            margin-top: 4px;
            display: inline-block;
            border: 2px solid #000000;
        }

        .val-valid {
            background-color: #E2FF00;
            color: #000000;
        }

        .val-invalid {
            background-color: #FF0055;
            color: #ffffff;
        }
    `;
    document.head.appendChild(styleElement);

    // 2. Application Pipeline Ingestion State
    let leadsList = [
        { id: 101, name: "BRUTUS ROTH LLC", email: "B.ROTH@ROTHCORP.COM", capital: "$5M - $20M", status: "submitted", date: "JUST NOW" },
        { id: 102, name: "VANDERBILT CO-LTD", email: "OFFICE@VANDERBILT.IO", capital: "$20M+", status: "pitching", date: "2 HOURS AGO" },
        { id: 103, name: "APEX ENERGY LINK", email: "PIPELINE@APEX.ENERGY", capital: "$1M - $5M", status: "closed-won", date: "1 DAY AGO" },
        { id: 104, name: "KRYPTON REALTY", email: "ACQUISITIONS@KRYPTON.CO", capital: "$500K - $1M", status: "disqualified", date: "3 DAYS AGO" }
    ];

    // Status Column Config
    const columnsConfig = {
        "submitted": { title: "01 // SUBMITTED", headerBg: "#E2FF00", text: "#000000" },
        "pitching": { title: "02 // PITCHING", headerBg: "#FF0055", text: "#ffffff" },
        "closed-won": { title: "03 // CLOSED-WON", headerBg: "#000000", text: "#E2FF00" },
        "disqualified": { title: "04 // DISQUALIFIED", headerBg: "#e5e7eb", text: "#4b5563" }
    };

    // Initialize DOM Injections once document has loaded
    document.addEventListener("DOMContentLoaded", () => {
        const step3Panel = document.getElementById("step-panel-3");
        if (!step3Panel) return;

        // Enhance Step 3 Form Inputs with dynamic feedback boxes
        enhanceInputValidation();

        // Inject the Kanban Pipeline Interface into Step 3
        injectKanbanInterface(step3Panel);

        // Render standard mock leads
        renderPipelineKanban();

        // Override original submit logic to integrate live state insertion
        overrideSubmitAction();
    });

    /**
     * Intercept and append live validation cues directly underneath input triggers
     */
    function enhanceInputValidation() {
        const nameInput = document.getElementById("lead-name");
        const emailInput = document.getElementById("lead-email");

        if (nameInput) {
            const nameFeedback = document.createElement("div");
            nameFeedback.id = "name-validation-msg";
            nameFeedback.className = "validation-indicator val-invalid";
            nameFeedback.innerText = "❌ STANDBY: WAITING FOR COMPLIANT CODENAME";
            nameInput.parentNode.appendChild(nameFeedback);

            nameInput.addEventListener("input", () => {
                const val = nameInput.value.trim().toUpperCase();
                if (val.length >= 3) {
                    nameFeedback.className = "validation-indicator val-valid";
                    nameFeedback.innerText = "✅ CODENAME STRUCTURE ACCEPTEABLE";
                } else {
                    nameFeedback.className = "validation-indicator val-invalid";
                    nameFeedback.innerText = "❌ REJECTED: CODENAME TOO SHORT (MIN 3 CHARS)";
                }
            });
        }

        if (emailInput) {
            const emailFeedback = document.createElement("div");
            emailFeedback.id = "email-validation-msg";
            emailFeedback.className = "validation-indicator val-invalid";
            emailFeedback.innerText = "❌ STANDBY: TARGET CORRESPONDENCE MISSING";
            emailInput.parentNode.appendChild(emailFeedback);

            emailInput.addEventListener("input", () => {
                const val = emailInput.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(val)) {
                    emailFeedback.className = "validation-indicator val-valid";
                    emailFeedback.innerText = "✅ EMAIL ADDRESS DOMAIN VERIFIED";
                } else {
                    emailFeedback.className = "validation-indicator val-invalid";
                    emailFeedback.innerText = "❌ ERROR: INVALID CAPITAL LINK ROUTING ADDR";
                }
            });
        }
    }

    /**
     * Injects the Kanban layout engine directly inside Step 3
     */
    function injectKanbanInterface(parentPanel) {
        // Find existing submit/navigation footer row
        const footerRow = parentPanel.querySelector(".border-t-4");

        // Create Kanban Wrapper block
        const kanbanWrapper = document.createElement("div");
        kanbanWrapper.className = "mt-8 pt-8 border-t-4 border-dashed border-gray-400";
        kanbanWrapper.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                    <span class="text-xs font-black bg-black text-white px-2 py-0.5 uppercase tracking-widest inline-block">
                        PIPELINE ENGINE BOARD
                    </span>
                    <h3 class="text-2xl font-black uppercase mt-1">AFFILIATE PORTAL KANBAN</h3>
                </div>
                <div class="text-xs font-mono font-bold bg-white text-black p-1.5 brutalist-border">
                    ENGINES LOGGED: <span id="pipeline-count-badge" class="font-black text-[#FF0055]">4</span> ACTIVE
                </div>
            </div>

            <!-- Dynamic Board -->
            <div class="kanban-grid mb-6" id="kanban-board-container"></div>

            <!-- Realtime Logging Feed Console -->
            <div class="mb-2 flex items-center justify-between">
                <span class="text-xs font-black uppercase tracking-wider">// SYSTEM CONTROL TERMINAL FEED:</span>
                <button onclick="window.clearPipelineLogs()" class="text-[10px] font-bold uppercase underline hover:text-[#FF0055]">Flush Logs</button>
            </div>
            <div class="terminal-console mb-6" id="system-terminal-log">
                &gt; INITIALIZING MOONSHINE CAPITAL INTEGRATION DISPATCH LEDGER...<br>
                &gt; CONNECTION SECURED. PIPELINE ENGINE v3.4 ON standby...
            </div>
        `;

        // Inject right above footer row
        if (footerRow) {
            parentPanel.insertBefore(kanbanWrapper, footerRow);
        } else {
            parentPanel.appendChild(kanbanWrapper);
        }

        // Global function reference helper for log clearance
        window.clearPipelineLogs = () => {
            const term = document.getElementById("system-terminal-log");
            if (term) term.innerHTML = `&gt; SYSTEM FLUSH COMPLETED. LISTENING FOR NEW EVENT DATA...`;
        };
    }

    /**
     * Builds and renders cards in appropriate state columns
     */
    function renderPipelineKanban() {
        const board = document.getElementById("kanban-board-container");
        if (!board) return;

        board.innerHTML = "";
        
        // Counter setup
        const counterBadge = document.getElementById("pipeline-count-badge");
        if (counterBadge) {
            counterBadge.innerText = leadsList.length;
        }

        // Render each structural column
        Object.keys(columnsConfig).forEach(colKey => {
            const config = columnsConfig[colKey];
            const colLeads = leadsList.filter(lead => lead.status === colKey);

            const colDiv = document.createElement("div");
            colDiv.className = "kanban-col";
            colDiv.innerHTML = `
                <div class="kanban-col-header" style="background-color: ${config.headerBg}; color: ${config.text}">
                    ${config.title} (<span class="font-black">${colLeads.length}</span>)
                </div>
                <div class="kanban-card-container" id="col-drop-${colKey}"></div>
            `;

            board.appendChild(colDiv);
            const container = colDiv.querySelector(`#col-drop-${colKey}`);

            // Populate cards inside column
            colLeads.forEach(lead => {
                const card = document.createElement("div");
                card.className = "lead-card";
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-1 gap-1">
                        <span class="text-[9px] font-mono bg-black text-[#E2FF00] px-1 font-bold">${lead.capital}</span>
                        <span class="text-[9px] font-mono text-gray-500 font-bold">${lead.date}</span>
                    </div>
                    <h4 class="text-xs font-black uppercase tracking-tight truncate mb-0.5">${lead.name}</h4>
                    <p class="text-[9px] font-bold text-gray-600 truncate mb-2">${lead.email}</p>
                    
                    <!-- Dynamic State Progression Controller -->
                    <div class="flex items-center justify-between border-t border-black pt-2 mt-1">
                        <button onclick="window.shiftPipelineLead(${lead.id}, 'prev')" class="px-1.5 py-0.5 bg-gray-100 text-black text-[10px] font-black brutalist-border border-2 hover:bg-black hover:text-white" title="Move Back">
                            ←
                        </button>
                        <span class="text-[8px] font-mono font-extrabold uppercase text-gray-400">STATE CONTROL</span>
                        <div class="flex gap-1">
                            <button onclick="window.disqualifyPipelineLead(${lead.id})" class="px-1.5 py-0.5 bg-white text-[#FF0055] text-[10px] font-black brutalist-border border-2 hover:bg-[#FF0055] hover:text-white" title="Disqualify Pipeline Entity">
                                ❌
                            </button>
                            <button onclick="window.shiftPipelineLead(${lead.id}, 'next')" class="px-1.5 py-0.5 bg-black text-[#E2FF00] text-[10px] font-black brutalist-border border-2 hover:bg-[#E2FF00] hover:text-black" title="Progress Forward">
                                →
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        });
    }

    /**
     * Logic for shifting lead states across the columns
     */
    window.shiftPipelineLead = (leadId, direction) => {
        const leadIndex = leadsList.findIndex(l => l.id === leadId);
        if (leadIndex === -1) return;

        const lead = leadsList[leadIndex];
        const stateSequence = ["submitted", "pitching", "closed-won"];
        let currentIdx = stateSequence.indexOf(lead.status);

        // If card was in disqualified state, return to cycle
        if (lead.status === "disqualified") {
            lead.status = "submitted";
            logTerminalEvent(`SYSTEM RESTORED DISQUALIFIED ASSET: "${lead.name}" -> RETURNED TO [SUBMITTED].`);
            renderPipelineKanban();
            return;
        }

        if (direction === "next" && currentIdx < stateSequence.length - 1) {
            lead.status = stateSequence[currentIdx + 1];
            logTerminalEvent(`STATE DISPATCH SUCCESSFUL: "${lead.name}" ADVANCED TO [${lead.status.toUpperCase()}].`);
        } else if (direction === "prev" && currentIdx > 0) {
            lead.status = stateSequence[currentIdx - 1];
            logTerminalEvent(`STATE BACKTRACK EXECUTED: "${lead.name}" REGRESSED BACK TO [${lead.status.toUpperCase()}].`);
        } else {
            logTerminalEvent(`⚠️ BOUNDS EXCEEDED: CANNOT SHIFT STATE BEYOND RANGE LIMITS.`);
        }

        renderPipelineKanban();
    };

    /**
     * Instantly shift lead status straight to "disqualified"
     */
    window.disqualifyPipelineLead = (leadId) => {
        const lead = leadsList.find(l => l.id === leadId);
        if (!lead) return;

        lead.status = "disqualified";
        logTerminalEvent(`❌ COMPLIANCE INTERVENE: ASSET "${lead.name}" DECLARED DISQUALIFIED PARAGRAPH-4.`);
        renderPipelineKanban();
    };

    /**
     * Adds an execution trace line into our visual terminal logger
     */
    function logTerminalEvent(message) {
        const consoleEl = document.getElementById("system-terminal-log");
        if (consoleEl) {
            const timeStamp = new Date().toLocaleTimeString();
            consoleEl.innerHTML += `<br>&gt; [${timeStamp}] ${message}`;
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }
    }

    /**
     * Validates form inputs inline prior to form submission processing
     */
    function validateLeadForm() {
        const nameInput = document.getElementById("lead-name");
        const emailInput = document.getElementById("lead-email");

        const nameVal = nameInput ? nameInput.value.trim() : "";
        const emailVal = emailInput ? emailInput.value.trim() : "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return nameVal.length >= 3 && emailRegex.test(emailVal);
    }

    /**
     * Reset standard validation markers back to starting point
     */
    function resetValidationIndicators() {
        const nameFeedback = document.getElementById("name-validation-msg");
        const emailFeedback = document.getElementById("email-validation-msg");
        if (nameFeedback) {
            nameFeedback.className = "validation-indicator val-invalid";
            nameFeedback.innerText = "❌ STANDBY: WAITING FOR COMPLIANT CODENAME";
        }
        if (emailFeedback) {
            emailFeedback.className = "validation-indicator val-invalid";
            emailFeedback.innerText = "❌ STANDBY: TARGET CORRESPONDENCE MISSING";
        }
    }

    /**
     * Intercept primary action handler button to append and execute pipeline state modifications
     */
    function overrideSubmitAction() {
        // Check if global state triggers are accessible, then bind integration action
        window.submitLeadAndContinue = function () {
            const nameInput = document.getElementById("lead-name");
            const emailInput = document.getElementById("lead-email");

            const leadName = nameInput ? nameInput.value.trim().toUpperCase() : "";
            const leadEmail = emailInput ? emailInput.value.trim().toUpperCase() : "";

            if (!validateLeadForm()) {
                logTerminalEvent("⚠️ PIPELINE REJECTED: CRITICAL FIELD ERROR IN DISPATCH.");
                alert("INPUT MISMATCH ERROR: PLEASE POPULATE MANDATORY FIELDS PRIOR TO ROUTING PIPELINE TESTING.");
                return;
            }

            // Push fresh tracking entity instance
            const newLead = {
                id: Date.now(),
                name: leadName,
                email: leadEmail,
                capital: window.selectedCapital || "$500K - $1M",
                status: "submitted",
                date: "JUST NOW"
            };

            leadsList.unshift(newLead);
            renderPipelineKanban();

            logTerminalEvent(`✅ SUCCESS: INGESTED NEW CONVERSION ENTITY "${leadName}" INTO PROTOCOL.`);
            alert(`[SIMULATION PIPELINE SUCCESSFUL]\nCLIENT: ${newLead.name}\nIDENTIFIER TARGET: ${window.affiliateId || 'ALPHA_PARTNER'}\nCAPITAL DEPTH: ${newLead.capital}\nSTATUS: SENT TO UNDERWRITERS`);

            // Flush inputs
            if (nameInput) nameInput.value = "";
            if (emailInput) emailInput.value = "";
            resetValidationIndicators();

            // Proceed to training step module
            goToStep(4);
        };
    }
})();