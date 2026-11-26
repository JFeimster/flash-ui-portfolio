// Dynamic Dataset of Tactical AI Tools in Jason's Arsenal
        const arsenalTools = [
            {
                id: "01",
                name: "Ecommerce Cash Flow Forecaster",
                platform: "AI Studio App",
                category: "Cash Flow",
                description: "Inject raw transaction logs and get visual cash runway predictions, inventory restocking milestones, and marketing budget limits without complex formulas.",
                status: "Live",
                accentColor: "var(--green)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["forecasting", "runway", "ecommerce", "finance", "google"]
            },
            {
                id: "02",
                name: "Get My Funding Offer",
                platform: "Static App",
                category: "Funding & Capital",
                description: "Tactical lead magnet routing. Dynamic engine gathers operator metrics, builds credit score estimates, and links directly to custom funding alternatives.",
                status: "Live",
                accentColor: "var(--orange)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["calculator", "lead-generation", "mca", "alternative-funding"]
            },
            {
                id: "03",
                name: "Funding Pathfinder GPT",
                platform: "CustomGPT",
                category: "Funding & Capital",
                description: "Guides founders through complex capital stacks. Understands MCA loans, SBA parameters, VC term sheets, and non-dilutive financing with instant diagnostic scoring.",
                status: "Live",
                accentColor: "var(--blue)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["chatgpt", "sba", "advisory", "cap-stack"]
            },
            {
                id: "04",
                name: "Real-Time Cash Flow Analyzer",
                platform: "Vercel App",
                category: "Cash Flow",
                description: "Integrate directly with banking APIs to construct real-time visual dashboards that measure daily operational overhead and track burn rate dynamically.",
                status: "Prototype",
                accentColor: "var(--magenta)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["api", "dashboard", "charts", "daily-burn"]
            },
            {
                id: "05",
                name: "Funding Goal Tracker",
                platform: "Gemini Gem",
                category: "Funding & Capital",
                description: "An interactive Gem that processes operational data to lay out optimal roadmaps for obtaining specific SBA limits and alternative lines of credit.",
                status: "Live",
                accentColor: "var(--yellow)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["gemini", "checklist", "sba-prep", "planning"]
            },
            {
                id: "06",
                name: "MRR to Money GPT",
                platform: "CustomGPT",
                category: "Ecommerce Finance",
                description: "Converts monthly recurring revenue projections into tactical valuation profiles. Formulates exact parameters for revenue-based funding options instantly.",
                status: "Live",
                accentColor: "var(--cyan)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["chatgpt", "mrr", "valuation", "revenue-based-funding"]
            },
            {
                id: "07",
                name: "VC Backup Plan GPT",
                platform: "CustomGPT",
                category: "Founder Ops",
                description: "If your VC funding stalls, trigger this agent to construct rapid-fire alternative bootstrap pipelines, structured MCA strategies, and asset loans.",
                status: "Live",
                accentColor: "var(--blue)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["chatgpt", "bootstrap", "emergency-capital", "mca"]
            },
            {
                id: "08",
                name: "BizCredit Builder GPT",
                platform: "Gemini Gem",
                category: "Business Credit",
                description: "Construct Dun & Bradstreet profiles, sequence credit lines, and build vendor-tier lines of credit to insulate your personal guarantee.",
                status: "Prototype",
                accentColor: "var(--magenta)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["gemini", "duns", "corporate-credit", "vendor-tiers"]
            },
            {
                id: "09",
                name: "GPT Stack Builder",
                platform: "Prompt System",
                category: "Prompt Systems",
                description: "The meta prompt kit. Build CustomGPT instruction pipelines, API schemas, and context constraints programmatically with zero waste.",
                status: "Live",
                accentColor: "var(--green)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["instructions", "metaprompt", "developer-utility"]
            },
            {
                id: "10",
                name: "Flash UI Portfolio",
                platform: "Static App",
                category: "Affiliate Growth",
                description: "No-code portfolio framework to showcase custom tools, calculate metrics, and generate high-intent affiliate leads for loan products.",
                status: "Live",
                accentColor: "var(--cyan)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["tailwind", "no-code-lead-mag", "webflow-alternative"]
            },
            {
                id: "11",
                name: "Chaos Mitigation Bot",
                platform: "AI Studio App",
                category: "Founder Ops",
                description: "Converts disorganized Slack transcripts and raw brainstorm voice notes into structured task tickets, actionable SOP templates, and roadmap timelines.",
                status: "Prototype",
                accentColor: "var(--yellow)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["google", "transcripts", "ops", "sop"]
            },
            {
                id: "12",
                name: "Affiliate Pipeline Generator",
                platform: "Prompt System",
                category: "Affiliate Growth",
                description: "Prompt sequence optimized to draft contextual, highly persuasive newsletters that guide sub-affiliates to tactical business funding signups.",
                status: "Live",
                accentColor: "var(--orange)",
                launchUrl: "#",
                codeUrl: "#",
                meta: ["email", "copywriting", "lead-gen", "sub-affiliates"]
            }
        ];

        document.addEventListener("DOMContentLoaded", () => {
            // Setup dynamic copyright year
            document.getElementById("current-year").textContent = new Date().getFullYear();

            const grid = document.getElementById("directory-grid");
            const searchInput = document.getElementById("directory-search");
            const filterContainer = document.getElementById("filter-container");

            let currentFilter = "all";
            let currentSearchTerm = "";

            // Dynamic card renderer
            function renderDirectory() {
                // Clear previous grid contents
                grid.innerHTML = "";

                // Filter items
                const filteredTools = arsenalTools.filter(tool => {
                    const matchesSearch = 
                        tool.name.toLowerCase().includes(currentSearchTerm) ||
                        tool.description.toLowerCase().includes(currentSearchTerm) ||
                        tool.platform.toLowerCase().includes(currentSearchTerm) ||
                        tool.category.toLowerCase().includes(currentSearchTerm) ||
                        tool.meta.some(tag => tag.toLowerCase().includes(currentSearchTerm));

                    if (currentFilter === "all") {
                        return matchesSearch;
                    }

                    // Check if filter matches platform OR category
                    const matchesFilter = 
                        tool.platform.toLowerCase() === currentFilter.toLowerCase() ||
                        tool.category.toLowerCase() === currentFilter.toLowerCase();

                    return matchesFilter && matchesSearch;
                });

                if (filteredTools.length === 0) {
                    grid.innerHTML = `
                        <div class="empty-state">
                            <h3>[!] CRITICAL WARNING: ZERO MATCHING LOGS</h3>
                            <p>No weapons matching "${currentSearchTerm}" found on system channel "${currentFilter.toUpperCase()}". Check your spelling parameters.</p>
                        </div>
                    `;
                    return;
                }

                // Render matching weapons
                filteredTools.forEach(tool => {
                    const card = document.createElement("div");
                    card.className = "weapon-card";
                    card.style.setProperty("--accent-card", tool.accentColor);
                    
                    // Set up dynamic platform styles
                    let pClass = "p-static";
                    if (tool.platform.includes("CustomGPT")) pClass = "p-customgpt";
                    else if (tool.platform.includes("Gemini Gem")) pClass = "p-gemini";
                    else if (tool.platform.includes("AI Studio")) pClass = "p-studio";
                    else if (tool.platform.includes("Vercel")) pClass = "p-vercel";
                    else if (tool.platform.includes("Prompt")) pClass = "p-prompt";

                    // Set up status badges
                    const sClass = tool.status === "Live" ? "s-live" : "s-prototype";

                    card.innerHTML = `
                        <div>
                            <div class="card-top">
                                <div class="card-meta-wrap">
                                    <span class="p-badge ${pClass}">${tool.platform}</span>
                                    <span class="s-badge ${sClass}">${tool.status}</span>
                                </div>
                                <span class="mono-text" style="color: ${tool.accentColor};">[${tool.id}]</span>
                            </div>
                            <h3 class="card-title">${tool.name}</h3>
                            <p class="card-desc">${tool.description}</p>
                        </div>
                        <div class="card-footer">
                            <a href="${tool.launchUrl}" class="card-btn primary-action">Execute Tool</a>
                            <a href="${tool.codeUrl}" class="card-btn">View Code</a>
                        </div>
                    `;
                    grid.appendChild(card);
                });
            }

            // Search trigger with simple input handler
            searchInput.addEventListener("input", (e) => {
                currentSearchTerm = e.target.value.toLowerCase().trim();
                renderDirectory();
            });

            // Filter tab switcher
            filterContainer.addEventListener("click", (e) => {
                if (!e.target.classList.contains("filter-btn")) return;

                // Toggle active class representation
                filterContainer.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
                e.target.classList.add("active");

                currentFilter = e.target.getAttribute("data-filter");
                renderDirectory();
            });

            // Run initial population
            renderDirectory();

            // Right-side dynamic simulator logic for terminal visual lookups
            const termFeed = document.getElementById("terminal-feed");
            const activePromptText = document.getElementById("terminal-dynamic-text");
            const simulationInputs = [
                "fetch_stats --source github --live",
                "deploy_agent_v2 --force --verbose",
                "audit_mca_calculator_schema",
                "pipeline_build --target gemini-pro",
                "clean_prompt_vectors --optimize"
            ];
            
            const simulationLogs = [
                ["Updating cache indices...", "14 agents loaded perfectly.", "Status: Live ready."],
                ["Injecting parameters...", "Compiling custom actions...", "Agent deployed cleanly."],
                ["Parsing D&B APIs...", "D-U-N-S verification bypassed.", "Credit tier updated."],
                ["Initializing Gemini Engine...", "Setting up context limit (2M tokens)...", "Gemini synced."],
                ["Normalizing instructions...", "Removed 14 fluffy adjectives.", "Vector pipeline clean."]
            ];

            let textIndex = 0;
            let logIndex = 0;

            function runTerminalSimulation() {
                // Change simulated command text
                const currentCommand = simulationInputs[textIndex];
                activePromptText.textContent = "";
                
                // Mimic dynamic typewriter
                let charIdx = 0;
                function type() {
                    if (charIdx < currentCommand.length) {
                        activePromptText.textContent += currentCommand.charAt(charIdx);
                        charIdx++;
                        setTimeout(type, 80);
                    } else {
                        // Complete typing command: push dynamic simulation logs into terminal feed
                        setTimeout(() => {
                            const logs = simulationLogs[logIndex];
                            logs.forEach((log, index) => {
                                setTimeout(() => {
                                    const newLine = document.createElement("div");
                                    newLine.className = "terminal-line output";
                                    newLine.textContent = `> ${log}`;
                                    termFeed.appendChild(newLine);
                                    
                                    // auto-scroll
                                    termFeed.scrollTop = termFeed.scrollHeight;
                                }, index * 300);
                            });

                            // Prepare setup pointers for subsequent commands
                            textIndex = (textIndex + 1) % simulationInputs.length;
                            logIndex = (logIndex + 1) % simulationLogs.length;

                            // Recursively execute loop cleanly after buffer period
                            setTimeout(runTerminalSimulation, 3500);
                        }, 500);
                    }
                }
                setTimeout(type, 1000);
            }

            // Initialize command matrix terminal loop
            runTerminalSimulation();

            // Sizzling Easter Egg: log message for the inspection geeks
            console.log(
                "%cAI AGENT ARSENAL %c- OPERATOR MODE ENABLED.",
                "color: #B6FF00; font-family: monospace; font-size: 16px; font-weight: bold; background: #050505; padding: 4px;",
                "color: #00E5FF; font-family: monospace; font-size: 14px; background: #050505; padding: 4px;"
            );
            console.log(
                "%cWelcome Jason Feimster. System loaded cleanly. Ready to deploy CustomGPT frameworks.",
                "color: #F4F1E8; font-family: monospace;"
            );
        });