// ==========================================================================
// MOONSHINE PARTNER PROFILE ENGINE - AFFILIATE RESOURCE HUB & LINK BUILDER
// FILE: resources/generator.js
// DESCRIPTION: Interactive tactical panel injecting link-generating utilities,
//              dynamic swipe copy vaults, and a local-storage checklist tool.
// ==========================================================================

(function() {
    // Wait for DOM to load to inject and setup elements
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAffiliateOps);
    } else {
        initializeAffiliateOps();
    }

    // Default Configuration States
    let state = {
        partnerName: 'Devon Streeter',
        affiliateSlug: 'streeter-desk',
        targetNode: 'desk',
        utmSource: 'linkedin',
        utmMedium: 'social',
        utmCampaign: 'q1-outreach',
        dailyProgress: [false, false, false, false, false]
    };

    // Node destinations mapped to path structures
    const destinationNodes = {
        desk: { label: 'Primary Partner Desk', path: '/partners/[SLUG]/index.html' },
        intake: { label: 'Rapid Intake Application', path: '/partners/[SLUG]/index.html#request-form' },
        scorecard: { label: 'Readiness Scorecard Engine', path: '/partners/[SLUG]/index.html#tools' },
        matcher: { label: 'Capital Route Matcher', path: '/partners/[SLUG]/index.html#tools' }
    };

    // Pre-configured high-converting marketing swipe templates
    const swipeTemplates = [
        {
            id: 'swipe-cpa',
            category: 'CPA & Advisor Alliance Outreach',
            type: 'Email Template',
            subject: 'Strategic Capital Alignment for Your Clients',
            body: `Hi [CPA_NAME],\n\nMany of our clients are navigating complex capital needs this quarter, and generic borrowing programs offer very little clarity. \n\nI have deployed an authorized static funding desk powered by Moonshine Capital. You and your clients can instantly pre-screen documents and evaluate alternative structures directly here:\n\n👉 [GENERATED_URL]\n\nOur system maps fitness for SBA structures, revenue-based finance, and invoice facilities before formal files are pushed. Let's arrange a quick 10-minute brief on how we can streamline this for your balance sheet advisory.\n\nBest regards,\n[PARTNER_NAME]\nMoonshine Funding Desk Strategist`
        },
        {
            id: 'swipe-linkedin',
            category: 'B2B Authority Play',
            type: 'LinkedIn Post',
            subject: 'The Death of Naked Referral Links',
            body: `Most affiliate systems expect consultants to build professional alliances using raw, ugly tracking links.\n\nIt feels cheap, leaks brand trust, and creates immense friction when clients need to upload highly sensitive banking files.\n\nThat is why I launched a dedicated, high-integrity Funding Desk. It is a complete diagnostic console featuring active capital matches, document checklist guardrails, and real-time underwriting rules in one link:\n\n🚀 Access my Desk: [GENERATED_URL]\n\nIf you are a CPA, broker, or agency operator routing client deal flow, stop sending cold form links. Let’s build real operators. \n\n#Fintech #BusinessFunding #AlternativeFinance #MoonshineCapital`
        },
        {
            id: 'swipe-text',
            category: 'Rapid Mobile Prequalification',
            type: 'SMS / Direct Message',
            subject: 'Instant pre-flight access',
            body: `Hey [CLIENT_NAME], here is the dedicated link to my Moonshine Funding Desk: [GENERATED_URL] -- you can run the Readiness Scorecard and see the exact document list we need for underwriting in 2 minutes.`
        }
    ];

    // Persisted tracker items (Daily 5)
    const trackerTasks = [
        "Reach out to 5 local business CPAs / Bookkeepers using Swipe Copy",
        "Publish your personalized static Desk URL on your B2B profiles",
        "Pre-screen a target deal using the interactive Underwriting Checklist",
        "Log dynamic tracking UTMs for an active email campaign",
        "Monitor your local pipeline routing parameters inside the system"
    ];

    function initializeAffiliateOps() {
        // Hydrate state from localStorage if available
        const savedState = localStorage.getItem('moonshine_ops_state');
        if (savedState) {
            try {
                state = { ...state, ...JSON.parse(savedState) };
            } catch (e) {
                console.warn("Failed to parse persisted state", e);
            }
        }

        // Build and Inject Tactical Dashboard Modal Component
        injectModalDOM();
        
        // Intercept global trigger function of base system
        window.simulateToolLaunch = function(toolName) {
            if (toolName === 'Campaign Link Builder' || toolName === 'Referral Partner Kit' || toolName === 'Daily 5 Tracker') {
                openTacticalOps(toolName);
            } else {
                // Fallback custom execution logic
                if (typeof window.triggerToast === 'function') {
                    window.triggerToast('LAUNCHING TOOL', `Initializing default sandbox module for "${toolName}"`, 'border-brand-green');
                }
            }
        };

        // Attach event handlers
        setupEventHandlers();
        
        // Initial Rendering Updates
        updateGeneratedLink();
        renderSwipes();
        renderTracker();
    }

    function injectModalDOM() {
        if (document.getElementById('tactical-ops-modal')) return;

        const modalMarkup = `
        <div id="tactical-ops-modal" class="fixed inset-0 bg-brand-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300">
            <div class="relative bg-brand-darkGray border-2 border-brand-borderGray shadow-[8px_8px_0px_rgba(0,0,0,1)] w-full max-w-4xl h-[90vh] md:h-[80vh] flex flex-col text-brand-bone overflow-hidden">
                
                <!-- Tactical Modal Header -->
                <div class="bg-brand-black border-b-2 border-brand-borderGray p-4 flex justify-between items-center shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="bg-brand-orange p-1 px-2 border border-brand-black text-brand-black font-mono font-bold text-xs tracking-tighter">
                            MS//ATC
                        </div>
                        <div>
                            <h2 class="font-bold text-sm tracking-wide uppercase block">Affiliate Tactical Command</h2>
                            <span class="text-[9px] font-mono text-zinc-500 block tracking-widest uppercase -mt-0.5">OPS PANEL // ENGINE_V1.08_BUILD</span>
                        </div>
                    </div>
                    <button id="close-ops-modal" class="bg-brand-graphite hover:bg-brand-orange text-brand-bone hover:text-brand-black border border-brand-borderGray p-2 px-3 font-mono text-xs transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-1">
                        [ ESC // CLOSE ]
                    </button>
                </div>

                <!-- Telemetry Status Ribbon -->
                <div class="w-full bg-brand-graphite/40 border-b border-brand-borderGray py-1 px-4 text-[9px] font-mono flex justify-between items-center text-zinc-400 shrink-0">
                    <div class="flex items-center space-x-3">
                        <span class="flex items-center space-x-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
                            <span class="text-brand-orange font-bold">LINK LAYER INITIALIZED</span>
                        </span>
                        <span>|</span>
                        <span>NODE_DEST: STATIC_ROUTE_RESOLVER</span>
                    </div>
                    <div class="hidden sm:block">STATUS: SECURE TRACKING PIPELINE</div>
                </div>

                <!-- Main Layout (Sidebar Tabs + Content Workspace) -->
                <div class="flex flex-col md:flex-row flex-1 overflow-hidden">
                    
                    <!-- Sidebar Navigation -->
                    <div class="w-full md:w-60 bg-brand-black/40 border-b md:border-b-0 md:border-r border-brand-borderGray flex md:flex-col shrink-0 overflow-x-auto no-scrollbar">
                        <button data-tab="tab-link-builder" class="ops-tab-btn flex-1 md:flex-initial text-left p-3.5 px-4 font-mono text-xs font-bold border-r md:border-r-0 md:border-b border-brand-borderGray text-brand-green bg-brand-green/5 flex items-center space-x-2">
                            <span>// 01 //</span> <span>LINK BUILDER</span>
                        </button>
                        <button data-tab="tab-swipe-vault" class="ops-tab-btn flex-1 md:flex-initial text-left p-3.5 px-4 font-mono text-xs font-bold border-r md:border-r-0 md:border-b border-brand-borderGray text-zinc-400 hover:text-brand-bone flex items-center space-x-2">
                            <span>// 02 //</span> <span>SWIPE VAULT</span>
                        </button>
                        <button data-tab="tab-daily-tracker" class="ops-tab-btn flex-1 md:flex-initial text-left p-3.5 px-4 font-mono text-xs font-bold md:border-b border-brand-borderGray text-zinc-400 hover:text-brand-bone flex items-center space-x-2">
                            <span>// 03 //</span> <span>DAILY 5 TRACKER</span>
                        </button>
                    </div>

                    <!-- Main Dashboard Area -->
                    <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                        
                        <!-- TAB 1: Link Builder Workspace -->
                        <div id="tab-link-builder" class="ops-tab-content space-y-6">
                            <div class="bg-brand-black/30 p-4 border border-brand-borderGray">
                                <h3 class="font-bold text-sm text-brand-bone font-mono uppercase tracking-wider text-brand-green mb-1">Campaign Link Builder Utility</h3>
                                <p class="text-xs text-zinc-400 font-sans leading-relaxed">
                                    Input your personalized slug and diagnostic parameters to output tracking-ready static URL links.
                                </p>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">Your Affiliate Slug</label>
                                    <input type="text" id="builder-slug" value="${state.affiliateSlug}" class="w-full bg-brand-black border border-brand-borderGray p-2.5 text-xs text-brand-bone font-mono focus:outline-none focus:border-brand-green">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">Your Partner Name</label>
                                    <input type="text" id="builder-name" value="${state.partnerName}" class="w-full bg-brand-black border border-brand-borderGray p-2.5 text-xs text-brand-bone font-mono focus:outline-none focus:border-brand-green">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">Target Destination Node</label>
                                    <select id="builder-target" class="w-full bg-brand-black border border-brand-borderGray p-2.5 text-xs text-brand-bone font-mono focus:outline-none focus:border-brand-green">
                                        <option value="desk">Primary Partner Desk (Bio & Focus)</option>
                                        <option value="intake">Rapid Intake Form (Action Page)</option>
                                        <option value="scorecard">Readiness Scorecard (Diagnostic Tool)</option>
                                        <option value="matcher">Funding Route Matcher (Calculator)</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">Campaign Source (utm_source)</label>
                                    <input type="text" id="builder-source" value="${state.utmSource}" placeholder="linkedin, email, cpa" class="w-full bg-brand-black border border-brand-borderGray p-2.5 text-xs text-brand-bone font-mono focus:outline-none focus:border-brand-green">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">Campaign Medium (utm_medium)</label>
                                    <input type="text" id="builder-medium" value="${state.utmMedium}" placeholder="social, newsletter, referral" class="w-full bg-brand-black border border-brand-borderGray p-2.5 text-xs text-brand-bone font-mono focus:outline-none focus:border-brand-green">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">Campaign Name (utm_campaign)</label>
                                    <input type="text" id="builder-campaign" value="${state.utmCampaign}" placeholder="q1-outreach" class="w-full bg-brand-black border border-brand-borderGray p-2.5 text-xs text-brand-bone font-mono focus:outline-none focus:border-brand-green">
                                </div>
                            </div>

                            <!-- Generated Link Output Panel -->
                            <div class="border-2 border-brand-borderGray bg-brand-black p-4 space-y-3">
                                <span class="block text-[10px] font-mono text-brand-orange uppercase tracking-wider font-bold">// COMPILED ATTRIBUTION LINK</span>
                                <div class="flex flex-col sm:flex-row gap-2">
                                    <div id="generated-link-display" class="flex-1 bg-brand-darkGray border border-brand-borderGray p-3 font-mono text-[11px] text-brand-green break-all select-all flex items-center min-h-[38px]">
                                        Generating...
                                    </div>
                                    <button id="copy-generated-link" class="bg-brand-green hover:bg-[#00e55c] text-brand-black font-mono text-xs font-bold px-5 py-2.5 border border-brand-black shadow-[3px_3px_0px_#1E1E22] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1E1E22] shrink-0 transition-all uppercase">
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- TAB 2: Swipe Copy Vault Workspace -->
                        <div id="tab-swipe-vault" class="ops-tab-content space-y-6 hidden">
                            <div class="bg-brand-black/30 p-4 border border-brand-borderGray">
                                <h3 class="font-bold text-sm text-brand-bone font-mono uppercase tracking-wider text-brand-blue mb-1">Brand Assets & Outreach Swipe Copy</h3>
                                <p class="text-xs text-zinc-400 font-sans leading-relaxed">
                                    Copy pre-drafted marketing collateral optimized for B2B alliances and borrower conversion. Links are dynamically updated with your active parameters.
                                </p>
                            </div>

                            <div id="swipes-container" class="space-y-4">
                                <!-- Swipe cards injected dynamically -->
                            </div>
                        </div>

                        <!-- TAB 3: Daily 5 Outreach Tracker Workspace -->
                        <div id="tab-daily-tracker" class="ops-tab-content space-y-6 hidden">
                            <div class="bg-brand-black/30 p-4 border border-brand-borderGray flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h3 class="font-bold text-sm text-brand-bone font-mono uppercase tracking-wider text-brand-orange mb-1">Daily 5 High-Leverage Habit Loop</h3>
                                    <p class="text-xs text-zinc-400 font-sans leading-relaxed">
                                        Commit to active networking blocks daily to scale your deal pipeline telemetry.
                                    </p>
                                </div>
                                <div class="bg-brand-black border border-brand-borderGray p-2 px-3 text-center min-w-[100px] shrink-0">
                                    <span class="block text-[8px] font-mono text-zinc-500">TODAY'S SCORE</span>
                                    <span id="tracker-score" class="font-mono text-xl font-bold text-brand-green">0 / 5</span>
                                </div>
                            </div>

                            <!-- Live Neo Progress Bar -->
                            <div class="h-4 bg-brand-black border border-brand-borderGray p-0.5 relative">
                                <div id="tracker-progress-bar" class="h-full bg-brand-green transition-all duration-300" style="width: 0%;"></div>
                            </div>

                            <div id="tracker-list" class="space-y-3">
                                <!-- Tasks injected dynamically -->
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Footer Console Panel -->
                <div class="bg-brand-black border-t border-brand-borderGray p-3.5 px-4 flex justify-between items-center text-[9px] font-mono text-zinc-500 shrink-0">
                    <span>ENGINE COMPILE STAT: PRODUCTION_READY</span>
                    <span>MOONSHINE CORE SYSTEM // V1.08</span>
                </div>

            </div>
        </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalMarkup;
        document.body.appendChild(tempDiv.firstElementChild);
    }

    function setupEventHandlers() {
        const modal = document.getElementById('tactical-ops-modal');
        const closeBtn = document.getElementById('close-ops-modal');
        const copyBtn = document.getElementById('copy-generated-link');
        
        // Tab Buttons Navigation
        const tabButtons = document.querySelectorAll('.ops-tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Toggle active tab classes
                tabButtons.forEach(b => {
                    b.classList.remove('text-brand-green', 'text-brand-blue', 'text-brand-orange', 'bg-brand-green/5', 'bg-brand-blue/5', 'bg-brand-orange/5');
                    b.classList.add('text-zinc-400');
                });

                // Assign decorative focus colors based on active tab
                if (targetTab === 'tab-link-builder') {
                    btn.classList.add('text-brand-green', 'bg-brand-green/5');
                } else if (targetTab === 'tab-swipe-vault') {
                    btn.classList.add('text-brand-blue', 'bg-brand-blue/5');
                } else if (targetTab === 'tab-daily-tracker') {
                    btn.classList.add('text-brand-orange', 'bg-brand-orange/5');
                }
                btn.classList.remove('text-zinc-400');

                // Toggle workspaces
                document.querySelectorAll('.ops-tab-content').forEach(content => {
                    content.classList.add('hidden');
                });
                document.getElementById(targetTab).classList.remove('hidden');
            });
        });

        // Close Modal Event Triggers
        closeBtn.addEventListener('click', closeTacticalOps);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeTacticalOps();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('opacity-0')) {
                closeTacticalOps();
            }
        });

        // Event listener hooks for dynamic Link Generation calculations
        const inputs = ['builder-slug', 'builder-name', 'builder-target', 'builder-source', 'builder-medium', 'builder-campaign'];
        inputs.forEach(id => {
            const inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.addEventListener('input', () => {
                    updateStateFromInputs();
                    updateGeneratedLink();
                    renderSwipes();
                });
            }
        });

        // Copy dynamic URL to Clipboard
        copyBtn.addEventListener('click', () => {
            const linkText = document.getElementById('generated-link-display').innerText;
            navigator.clipboard.writeText(linkText).then(() => {
                if (typeof window.triggerToast === 'function') {
                    window.triggerToast('ATTRIBUTION COPY SUCCESSFUL', 'Your custom track-parameter link has been copied.', 'border-brand-green');
                }
            }).catch(() => {
                if (typeof window.triggerToast === 'function') {
                    window.triggerToast('ATTRIBUTION PATH', linkText, 'border-brand-orange');
                }
            });
        });
    }

    function openTacticalOps(originTool) {
        const modal = document.getElementById('tactical-ops-modal');
        modal.classList.remove('opacity-0', 'pointer-events-none');
        
        // Auto-switch tabs depending on tool triggered
        let tabToTrigger = 'tab-link-builder';
        if (originTool === 'Referral Partner Kit') tabToTrigger = 'tab-swipe-vault';
        if (originTool === 'Daily 5 Tracker') tabToTrigger = 'tab-daily-tracker';

        const activeTabBtn = document.querySelector(`.ops-tab-btn[data-tab="${tabToTrigger}"]`);
        if (activeTabBtn) activeTabBtn.click();

        if (typeof window.triggerToast === 'function') {
            window.triggerToast('TACTICAL DEPLOYMENT', `Opened console for: ${originTool}`, 'border-brand-green');
        }
    }

    function closeTacticalOps() {
        const modal = document.getElementById('tactical-ops-modal');
        modal.classList.add('opacity-0', 'pointer-events-none');
    }

    function updateStateFromInputs() {
        state.affiliateSlug = document.getElementById('builder-slug').value.trim() || 'partner';
        state.partnerName = document.getElementById('builder-name').value.trim() || 'Partner Desk';
        state.targetNode = document.getElementById('builder-target').value;
        state.utmSource = document.getElementById('builder-source').value.trim();
        state.utmMedium = document.getElementById('builder-medium').value.trim();
        state.utmCampaign = document.getElementById('builder-campaign').value.trim();

        // Save current active state parameters
        localStorage.setItem('moonshine_ops_state', JSON.stringify(state));
    }

    function generateURL() {
        const origin = window.location.origin;
        const nodeInfo = destinationNodes[state.targetNode] || destinationNodes['desk'];
        
        let path = nodeInfo.path.replace('[SLUG]', state.affiliateSlug);
        let trackingUrl = `${origin}${path}`;

        // Inject tracking parameters
        const params = [];
        if (state.utmSource) params.push(`utm_source=${encodeURIComponent(state.utmSource)}`);
        if (state.utmMedium) params.push(`utm_medium=${encodeURIComponent(state.utmMedium)}`);
        if (state.utmCampaign) params.push(`utm_campaign=${encodeURIComponent(state.utmCampaign)}`);

        if (params.length > 0) {
            // Check if path has hash or anchor link structures to inject queries correctly
            if (trackingUrl.includes('#')) {
                const parts = trackingUrl.split('#');
                trackingUrl = `${parts[0]}?${params.join('&')}#${parts[1]}`;
            } else {
                trackingUrl = `${trackingUrl}?${params.join('&')}`;
            }
        }

        return trackingUrl;
    }

    function updateGeneratedLink() {
        const display = document.getElementById('generated-link-display');
        if (display) {
            display.innerText = generateURL();
        }
    }

    function renderSwipes() {
        const container = document.getElementById('swipes-container');
        if (!container) return;

        const activeUrl = generateURL();
        container.innerHTML = '';

        swipeTemplates.forEach(tpl => {
            // Replace dynamic token values in body
            let compiledBody = tpl.body
                .replace(/\[GENERATED_URL\]/g, activeUrl)
                .replace(/\[PARTNER_NAME\]/g, state.partnerName)
                .replace(/\[CPA_NAME\]/g, 'Partner Advisor')
                .replace(/\[CLIENT_NAME\]/g, 'Valued Client');

            const swipeCard = document.createElement('div');
            swipeCard.className = 'bg-brand-black border border-brand-borderGray p-4 flex flex-col justify-between space-y-3 relative';
            swipeCard.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <span class="font-mono text-[8px] text-brand-blue uppercase tracking-wider block">${tpl.category}</span>
                        <h4 class="font-bold text-xs text-brand-bone tracking-wide mt-0.5">${tpl.type}: ${tpl.subject}</h4>
                    </div>
                    <span class="text-[9px] font-mono text-zinc-600">ID: ${tpl.id}</span>
                </div>
                <div class="relative">
                    <textarea readonly class="w-full h-32 bg-brand-darkGray border border-brand-borderGray p-2.5 font-mono text-[10px] text-zinc-400 focus:outline-none resize-none select-all scrollbar-thin">${compiledBody}</textarea>
                </div>
                <div class="flex justify-end pt-1">
                    <button class="copy-swipe-btn px-4 py-1.5 bg-brand-graphite hover:bg-brand-blue text-brand-bone hover:text-white font-mono text-[10px] uppercase border border-brand-borderGray tracking-wider transition-colors" data-clipboard-text="${encodeURIComponent(compiledBody)}">
                        Copy Swipe Copy
                    </button>
                </div>
            `;
            container.appendChild(swipeCard);
        });

        // Attach Swipe copy triggers
        container.querySelectorAll('.copy-swipe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const textToCopy = decodeURIComponent(e.target.getAttribute('data-clipboard-text'));
                navigator.clipboard.writeText(textToCopy).then(() => {
                    if (typeof window.triggerToast === 'function') {
                        window.triggerToast('SWIPE COPIED', 'Template loaded with active UTM parameters.', 'border-brand-blue');
                    }
                });
            });
        });
    }

    function renderTracker() {
        const listContainer = document.getElementById('tracker-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        let completedCount = 0;

        trackerTasks.forEach((task, idx) => {
            const isCompleted = state.dailyProgress[idx] || false;
            if (isCompleted) completedCount++;

            const item = document.createElement('div');
            item.className = `border p-3.5 flex items-center justify-between transition-colors ${isCompleted ? 'bg-brand-green/5 border-brand-green/40' : 'bg-brand-black border-brand-borderGray'}`;
            item.innerHTML = `
                <div class="flex items-center space-x-3">
                    <input type="checkbox" ${isCompleted ? 'checked' : ''} class="task-checkbox accent-brand-green h-4 w-4 bg-brand-black border border-brand-borderGray focus:ring-0" data-index="${idx}">
                    <span class="text-xs ${isCompleted ? 'text-brand-bone line-through decoration-brand-green/40' : 'text-zinc-300'}">${task}</span>
                </div>
                <span class="font-mono text-[8px] ${isCompleted ? 'text-brand-green' : 'text-zinc-600'}">${isCompleted ? 'COMPLETE' : 'PENDING'}</span>
            `;
            listContainer.appendChild(item);
        });

        // Update score and progress visualization structures
        const scoreDisplay = document.getElementById('tracker-score');
        const progressBar = document.getElementById('tracker-progress-bar');
        
        if (scoreDisplay) scoreDisplay.innerText = `${completedCount} / 5`;
        if (progressBar) progressBar.style.width = `${(completedCount / 5) * 100}%`;

        // Bind Checkbox events
        listContainer.querySelectorAll('.task-checkbox').forEach(box => {
            box.addEventListener('change', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                state.dailyProgress[idx] = e.target.checked;
                localStorage.setItem('moonshine_ops_state', JSON.stringify(state));
                
                renderTracker();

                // Fire high-performance celebration toast on completion loops
                const totalCompleted = state.dailyProgress.filter(Boolean).length;
                if (totalCompleted === 5) {
                    if (typeof window.triggerToast === 'function') {
                        window.triggerToast('DAILY OBJECTIVE REACHED', 'Five out of five pipeline habits completed today. Operator level peak.', 'border-brand-green');
                    }
                } else if (e.target.checked) {
                    if (typeof window.triggerToast === 'function') {
                        window.triggerToast('HABIT LOGGED', 'Task marked as completed. Routing progress data.', 'border-brand-orange');
                    }
                }
            });
        });
    }

})();
