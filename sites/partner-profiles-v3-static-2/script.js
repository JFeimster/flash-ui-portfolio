document.getElementById('footer-year').textContent = new Date().getFullYear();

        // Simulator Demo Dataset
        const simulatorData = {
            contractor: {
                name: "Marcus Vance",
                avatar: "MV",
                title: "Heavy Infrastructure Advisor",
                bio: "Direct lines to structural working equipment credit, invoice factoring paths, and immediate municipal payroll credit allocations.",
                slug: "moonshine.cap/desk/marcus-vance",
                tags: ["SBA 7(a) Lines", "AR Factoring", "Municipal Payroll Bonds"],
                ctaHeader: "Initialize Heavy Equipment Review",
                ctaSub: "Route parameters: SBA 7(a) Fast Track processing rules.",
                token: "M_ATTR_VANCE_HVY"
            },
            realestate: {
                name: "Silas Sterling",
                avatar: "SS",
                title: "Asset Development Specialist",
                bio: "Executing private bridge options, acquisition capital routes, and fast fix-and-flip financial packaging for verified operators.",
                slug: "moonshine.cap/desk/silas-sterling",
                tags: ["Commercial Bridge", "Fix & Flip Hard Cash", "Rehab Allocations"],
                ctaHeader: "Submit Property Asset Profile",
                ctaSub: "Route parameters: High-volume fix/flip asset guidelines.",
                token: "SS_ATTRIB_PROP"
            },
            ecommerce: {
                name: "Evelyn Thorne",
                avatar: "ET",
                title: "Ecommerce Velocity Director",
                bio: "Direct channel routing configurations targeting multichannel digital brands. Integrates direct sync advances with zero physical assets collateral requirements.",
                slug: "moonshine.cap/desk/evelyn-thorne",
                tags: ["Revenue Advances", "Inventory Scaling", "DSP Operations Setup"],
                ctaHeader: "Sync Store Channels to Underwrite",
                ctaSub: "Route parameters: High-velocity brand direct assessment paths.",
                token: "ET_ATTRIB_REVD"
            }
        };

        // Switch simulator content
        let activeSimLayout = "contractor";
        function switchSimulator(layoutKey) {
            activeSimLayout = layoutKey;
            
            // UI button status updates
            document.querySelectorAll('.sim-toggle-btn').forEach(btn => btn.classList.remove('active'));
            if (layoutKey === 'contractor') document.getElementById('btn-sim-contractor').classList.add('active');
            if (layoutKey === 'realestate') document.getElementById('btn-sim-realestate').classList.add('active');
            if (layoutKey === 'ecommerce') document.getElementById('btn-sim-ecommerce').classList.add('active');

            // Apply fields updates
            const data = simulatorData[layoutKey];
            document.getElementById('sim-display-slug').textContent = data.slug;
            document.getElementById('sim-avatar').textContent = data.avatar;
            document.getElementById('sim-name').textContent = data.name;
            document.getElementById('sim-title').textContent = data.title;
            document.getElementById('sim-bio').textContent = data.bio;
            document.getElementById('sim-cta-header').textContent = data.ctaHeader;
            document.getElementById('sim-routing-token').textContent = data.token;

            // Render tag array
            const tagsBox = document.getElementById('sim-tags');
            tagsBox.innerHTML = '';
            data.tags.forEach((tag, idx) => {
                const span = document.createElement('span');
                span.style.background = idx === 0 ? "rgba(0,255,102,0.1)" : "rgba(255,255,255,0.05)";
                span.style.border = idx === 0 ? "1px solid var(--electric-green)" : "1px solid rgba(255,255,255,0.15)";
                span.style.padding = "4px 8px";
                span.style.fontSize = "0.7rem";
                span.style.fontFamily = "var(--font-mono)";
                span.style.color = idx === 0 ? "var(--electric-green)" : "var(--chrome-accent)";
                span.textContent = tag;
                tagsBox.appendChild(span);
            });
        }

        // Fast simulator direct activator from directory grid list
        function activateDemoInSimulator(layoutKey) {
            switchSimulator(layoutKey);
            document.getElementById('simulator-section').scrollIntoView({ behavior: 'smooth' });
        }

        // Copy simulator URL to clipboard
        function copySimulatorUrl() {
            const currentSlug = simulatorData[activeSimLayout].slug;
            navigator.clipboard.writeText(`https://${currentSlug}`).then(() => {
                alert(`Successfully Copied Desk URL: https://${currentSlug}`);
            });
        }

        // Dynamic Lead review simulator inside desk workspace frame
        function runSimulatedLeadSubmission() {
            const partnerToken = simulatorData[activeSimLayout].token;
            const currentName = simulatorData[activeSimLayout].name;
            
            alert(`Initializing lead verification framework targeting ${currentName}.\nMetrics attribute safely to token: ${partnerToken}`);
            
            // Automatically log deployment activity inside the live runtime API log
            const logBox = document.getElementById('api-execution-log');
            const now = new Date().toLocaleTimeString();
            logBox.innerHTML = `[${now}] <span style="color:var(--electric-green);">[POST SUCCESS]</span> Routing Review submit package via Desk attribution tracking. Redirecting to central underwriting triage...<br>` + logBox.innerHTML;
        }

        // Copy directory specific portal address helper
        function copyDeskLink(slug, btnElement) {
            const url = `https://moonshine.cap/partners/${slug}/index.html`;
            navigator.clipboard.writeText(url).then(() => {
                const originalColor = btnElement.style.color;
                btnElement.style.color = "var(--signal-orange)";
                setTimeout(() => btnElement.style.color = originalColor, 1000);
                alert(`Copied Static Workspace URL directly to Clipboard:\n${url}`);
            });
        }

        // Directory instant search and filters
        let directoryActiveTag = "all";
        function executeDirectorySearch() {
            const query = document.getElementById('dir-search-input').value.toLowerCase();
            const cards = document.querySelectorAll('.neo-partner-card');

            cards.forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                const tags = card.getAttribute('data-tags');
                
                const matchesSearch = name.includes(query) || tags.toLowerCase().includes(query);
                const matchesTag = (directoryActiveTag === 'all') || tags.toLowerCase().includes(directoryActiveTag.toLowerCase());

                if (matchesSearch && matchesTag) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function filterDirectoryByTag(tagName, btnElement) {
            directoryActiveTag = tagName;
            
            // Adjust active CSS status on controls buttons
            document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
            btnElement.classList.add('active');

            executeDirectorySearch();
        }

        // AI System Actions: Trigger AI Copywriting for Partner Bios
        function triggerAICopywriter() {
            const rawBio = document.getElementById('ai-raw-bio').value;
            const specialties = document.getElementById('ai-specialties').value;
            const niche = document.getElementById('ai-niche').value;
            const voiceStyle = document.getElementById('ai-style').value;
            const termContent = document.getElementById('terminal-content');
            const termStatus = document.getElementById('terminal-job-status');

            termStatus.textContent = "⚡ RUNNING BIO GENERATOR ENGINE...";
            termContent.textContent = "Processing raw intake matrices...\nExecuting context optimization protocols...";

            setTimeout(() => {
                const formattedName = rawBio.includes("amara") ? "Amara Vance" : "Verified Funding Director";
                const responseBio = `
### PROFESSIONAL BIO SUMMARY [CONVERSION OPTIMIZED]
**Specialist Name:** ${formattedName}
**Niche Core Alignment:** ${niche}
**Voice Configuration Tone:** ${voiceStyle}

"${formattedName} is an elite Partner Portfolio Specialist delivering ${specialties}. Backed by over a decade of targeted structural corporate development experience, she bridges the gap for critical entities seeking specialized deployment channels. Her primary operational objective remains assisting early organizations with tier 1/2 commercial credit alignment directly to bypass personal guarantee liabilities."

### CTA DESK WORKSPACE RECOMMENDATION:
"Initialize early credit prep diagnostics directly below. Build your entity file to verify compatibility structures."`;

                termContent.textContent = responseBio.trim();
                termStatus.textContent = "⚡ BIO GENERATED SUCCESSFULLY [ACTIVE]";
                document.getElementById('terminal-tokens').textContent = "412";
            }, 1200);
        }

        // AI System Actions: Dynamic Referral Asset Generator
        function triggerAIAssets() {
            const specialties = document.getElementById('ai-specialties').value;
            const niche = document.getElementById('ai-niche').value;
            const termContent = document.getElementById('terminal-content');
            const termStatus = document.getElementById('terminal-job-status');

            termStatus.textContent = "⚡ COMPILING ASSET OUTREACH SCRIPTS...";
            termContent.textContent = "Matching financial specialties with outreach pathways...\nFormulating target scripts...";

            setTimeout(() => {
                const emailScript = `
--- EMAIL OUTREACH SCRIPT ---
Subject: Bypassing corporate personal guarantee restrictions for ${niche} entities

Dear [Business Owner],

Most startup organizations remain severely limited in raw liquidity parameters due to personal guarantee liabilities. As an elite director specializing in ${specialties}, we build structural corporate vendor files to secure autonomous funding desks.

Determine your corporate compliance score directly at our active funding portal:
https://moonshine.cap/desk/amara-vance

Best regards,
Amara Vance
---
                `;

                const socialScript = `
--- SOCIAL OUTREACH ASSET (LINKEDIN/X) ---
🚀 Pre-revenue and early startup entities often get locked out of critical tier-1 capital structures due to restrictive personal guarantee regulations.

We build autonomous, high-grade vendor credit profiles designed to carry funding volume independently.

Secure your readiness calculation in seconds:
👉 https://moonshine.cap/desk/amara-vance
---
                `;

                const smsScript = `
--- SMS OUTREACH PATHWAY ---
Hey [First Name], early corporate credit is simple to structure when you bypass standard personal guarantee rules. Let's build your file. Calculate your score in 60s at moonshine.cap/desk/amara-vance
                `;

                termContent.textContent = (emailScript + socialScript + smsScript).trim();
                termStatus.textContent = "⚡ CAMPAIGN PORTFOLIO OUTREACH KIT READY";
                document.getElementById('terminal-tokens').textContent = "780";
            }, 1500);
        }

        function copyTerminalOutput() {
            const text = document.getElementById('terminal-content').textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert("Terminal content copied to clipboard!");
            });
        }

        // Webhook Simulator Actions
        function simulateWebhookExecution(endpoint) {
            const logBox = document.getElementById('api-execution-log');
            const now = new Date().toLocaleTimeString();
            
            if (endpoint === 'deploy-partner') {
                logBox.innerHTML = `[${now}] <span style="color:var(--signal-orange);">[POST REQUEST]</span> Invoking /api/deploy-partner API trigger...<br>` + logBox.innerHTML;
                setTimeout(() => {
                    const successTime = new Date().toLocaleTimeString();
                    logBox.innerHTML = `[${successTime}] <span style="color:var(--electric-green);">[COMMIT TRIGGERED]</span> Auth handshake validation success. Initialized GitHub Actions run ID #742918491.<br>` + logBox.innerHTML;
                    logBox.innerHTML = `[${successTime}] <span style="color:var(--electric-green);">[PAGE DEPLOYED]</span> Static index generated: /partners/amara-vance/index.html written successfully inside Repo directory tree.<br>` + logBox.innerHTML;
                }, 1000);
            } else {
                logBox.innerHTML = `[${now}] <span style="color:var(--cobalt-blue);">[POST REQUEST]</span> Routing Lead application via /api/lead-routing CRM service...<br>` + logBox.innerHTML;
                setTimeout(() => {
                    const successTime = new Date().toLocaleTimeString();
                    logBox.innerHTML = `[${successTime}] <span style="color:var(--electric-green);">[CRM SYNCED]</span> Attributed matching score successfully to Partner Token: SS_ATTRIB_PROP.<br>` + logBox.innerHTML;
                    logBox.innerHTML = `[${successTime}] <span style="color:var(--electric-green);">[CRM DELIVERED]</span> Lead attributes: { Company: "Sterling Properties LLC", Requested: "$250k" } compiled inside Moonshine central database logs.<br>` + logBox.innerHTML;
                }, 1200);
            }
        }

        function clearApiLogs() {
            document.getElementById('api-execution-log').innerHTML = "[Ready] Select an API simulation trigger above to see log parameters.";
        }

        // Three-Tier Architecture Stack Viewer
        const architectureTiers = {
            1: {
                title: "ROUTE MAP: STATIC HTML CORES",
                badge: "FASTEST EDGE",
                description: "Each workspace is initialized as an ultra-compact HTML asset containing fully modular diagnostic parameters, running on the user's browser runtime. Requires zero live DB connections for display.",
                delay: "0ms (Static Client Side)",
                diag: `
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="text-align: center; width: 30%;">
                            <span style="font-size: 0.7rem; color: var(--chrome-accent); display: block;">LOCAL STORAGE</span>
                            <div style="height: 6px; background: var(--cobalt-blue); border-radius: 4px; margin-top: 4px;"></div>
                        </div>
                        <div style="font-size: 1.2rem; color: var(--electric-green);">➔</div>
                        <div style="text-align: center; width: 30%;">
                            <span style="font-size: 0.7rem; color: var(--electric-green); display: block;">VERCEL EDGE</span>
                            <div style="height: 6px; background: var(--electric-green); border-radius: 4px; margin-top: 4px;"></div>
                        </div>
                        <div style="font-size: 1.2rem; color: var(--electric-green);">➔</div>
                        <div style="text-align: center; width: 30%;">
                            <span style="font-size: 0.7rem; color: var(--chrome-accent); display: block;">CLIENT PORTAL</span>
                            <div style="height: 6px; background: var(--bone-white); border-radius: 4px; margin-top: 4px;"></div>
                        </div>
                    </div>
                `
            },
            2: {
                title: "ROUTE MAP: NO-CODE OPS AUTOMATION",
                badge: "AUTOMATION ENGINE",
                description: "Connect intake forms directly to Google Sheets, Notion directories, and dispatch real-time Slack/Tally triage pipeline alerts to keep operations moving without deployment friction.",
                delay: "85ms (API Router Pipeline)",
                diag: `
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="text-align: center; width: 30%;">
                            <span style="font-size: 0.7rem; color: var(--chrome-accent); display: block;">TALLY/WEBHOOK</span>
                            <div style="height: 6px; background: var(--signal-orange); border-radius: 4px; margin-top: 4px;"></div>
                        </div>
                        <div style="font-size: 1.2rem; color: var(--electric-green);">➔</div>
                        <div style="text-align: center; width: 30%;">
                            <span style="font-size: 0.7rem; color: var(--cobalt-blue); display: block;">GOOGLE SHEETS API</span>
                            <div style="height: 6px; background: var(--cobalt-blue); border-radius: 4px; margin-top: 4px;"></div>
                        </div>
                        <div style="font-size: 1.2rem; color: var(--electric-green);">➔</div>
                        <div style="text-align: center; width: 30%;">
                            <span style="font-size: 0.7rem; color: var(--chrome-accent); display: block;">SLACK CHANNELS</span>
                            <div style="height: 6px; background: var(--bone-white); border-radius: 4px; margin-top: 4px;"></div>
                        </div>
                    </div>
                `
            },
            3: {
                title: "ROUTE MAP: FIREBASE SECURE PORTAL",
                badge: "UPCOMING DASHBOARD",
                description: "Upgrade dynamic parameters to a full-fledged authentication secure layer. Features real-time state ledger syncs, commission telemetry indicators, and client verification status monitoring.",
                delay: "12ms (Real-time DB stream)",
                diag: `
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="text-align: center; width: 30%;">
                            <span style="font-size: 0.7rem; color: var(--chrome-accent); display: block;">FIREBASE AUTH</span>
                            <div style="height: 6px; background: var(--electric-green); border-radius: 4px; margin-top: 4px;"></div>
                        </div>
                        <div style="font-size: 1.2rem; color: var(--electric-green);">➔</div>
                        <div style="text-align: center; width: 30%;">
                            <span style="font-size: 0.7rem; color: var(--signal-orange); display: block;">FIRESTORE DB</span>
                            <div style="height: 6px; background: var(--signal-orange); border-radius: 4px; margin-top: 4px;"></div>
                        </div>
                        <div style="font-size: 1.2rem; color: var(--electric-green);">➔</div>
                        <div style="text-align: center; width: 30%;">
                            <span style="font-size: 0.7rem; color: var(--chrome-accent); display: block;">LEDGER DASHBOARD</span>
                            <div style="height: 6px; background: var(--cobalt-blue); border-radius: 4px; margin-top: 4px;"></div>
                        </div>
                    </div>
                `
            }
        };

        function switchArchitectureTier(tierNum) {
            // Remove active classes
            document.querySelectorAll('.stack-step-card').forEach(card => card.classList.remove('active'));
            document.getElementById(`arch-card-${tierNum}`).classList.add('active');

            // Render view state data
            const data = architectureTiers[tierNum];
            document.getElementById('arch-tier-title').textContent = data.title;
            document.getElementById('arch-tier-badge').textContent = data.badge;
            document.getElementById('arch-tier-description').textContent = data.description;
            document.getElementById('arch-delay').textContent = data.delay;
            document.getElementById('arch-diagram-box').innerHTML = data.diag;
        }