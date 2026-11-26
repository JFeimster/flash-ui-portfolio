(function () {
    // 1. DATA STRUCTURES FOR MARKETING RESOURCES & TEMPLATES
    const resourceData = {
        partnerName: "Elite Operator",
        partnerSlug: "partner-portal",
        trackingUrl: window.location.origin + "/partners/partner-portal/index.html",
        subId: "",
        source: "linkedin",
        campaign: "spring_scale",
        
        emailTemplates: [
            {
                id: "email-warm-intro",
                title: "Warm Introduction (CPAs & Advisors)",
                category: "Email Swipe",
                subject: "Direct commercial funding desk for [Client Name]",
                description: "Perfect for sending to client advisors, accountants, or bookkeeping partners looking to source fast liquidity routes.",
                body: "Hi [First Name],\n\nI hope you're having a productive week. Many of the business owners and operators we advise are currently navigating cash-flow bottlenecks or looking for acquisition capital to scale production.\n\nTo streamline this, I’ve set up a dedicated commercial funding desk backed by the underwriting parameters of Moonshine Capital. We can route, pre-qualify, and fund deals ranging from $20k up to $5M+ across MCA, Revenue-Based Financing, and Bridge loans.\n\nYou can review our exact funding criteria, checklist, and launch a fast qualification review directly through my digital desk here:\n{TRACKING_URL}\n\nLet me know if you have a client portfolio scenario you'd like us to audit this week.\n\nBest regards,\n\n{PARTNER_NAME}"
            },
            {
                id: "email-rbf-angle",
                title: "Revenue-Based Funding (Fast Action)",
                category: "Email Swipe",
                subject: "Non-dilutive working capital option for [Company Name]",
                description: "Targeted at tech, SaaS, high-volume e-commerce, or retail brands looking to scale inventory without diluting equity.",
                body: "Hey [First Name],\n\nQuick question: Are you planning to raise equity or secure dilutive capital for your inventory run this quarter?\n\nBefore you give up cap table percentage points, we have a structured non-dilutive alternative. Through our direct partnership engine with Moonshine, we are providing capital advances based on your trailing monthly revenue metrics.\n\n- No board seats, no equity dilution\n- Fast qualification based on 6 months of bank data\n- Flexible payback mapped directly to daily/weekly merchant sales\n\nYou can calculate your rough metrics and check eligibility parameters directly at my terminal:\n{TRACKING_URL}\n\nLet’s schedule a brief call if this aligns with your growth timeline.\n\nCheers,\n\n{PARTNER_NAME}"
            },
            {
                id: "email-contractor-bridge",
                title: "Equipment & Contractor Cash Flow",
                category: "Email Swipe",
                subject: "Unlocking trade cash flow / invoice liquidity",
                description: "Highly effective for builders, trade specialists, or service companies with significant account receivables backlog.",
                body: "Hello [First Name],\n\nIn the contracting space, mobilization costs can choke highly profitable backlogs. I wanted to share a fast liquidity resource we are running for project managers and general contractors.\n\nWe provide rapid equipment financing and accounts receivable factoring lines designed to bridge the gap between Mobilization and Draw payments.\n\nWe’ve put together a dynamic document checklist so your team knows exactly what paperwork is required to secure terms in 48 hours:\n{TRACKING_URL}\n\nTake a look and run your numbers inside our match engine.\n\nSincerely,\n\n{PARTNER_NAME}"
            }
        ],

        socialSwipes: [
            {
                id: "social-li-framework",
                title: "LinkedIn: The Hidden Cost of Naked Referral Links",
                category: "Social Swipe",
                description: "An authority-building long-form post positioning you as a professional funding desk.",
                body: "Stop sending naked affiliate links to high-value commercial clients. 🛑\n\nWhen a business owner needs $250k in expansion capital, they aren't going to upload sensitive tax returns or corporate bank logs through a sketchy, unbranded redirect link.\n\nThey need structured trust, clear criteria, and operational context.\n\nThat’s why I just launched my private Funding Desk powered directly by Moonshine Capital underwriting parameters. Within 5 minutes, clients can evaluate eligibility, configure their document packs, and route files directly into the premium liquidity line.\n\nIf you're an operator looking to scale equipment, unlock invoice values, or capture non-dilutive growth funds this quarter, let’s run your numbers.\n\nExplore my secure desk here: {TRACKING_URL}\n\n#CommercialFinance #WorkingCapital #Fintech #AlternativeLending"
            },
            {
                id: "social-x-teaser",
                title: "X (Twitter): Fast Non-Dilutive Fuel Thread",
                category: "Social Swipe",
                description: "Short, punchy teaser highlighting rapid turnaround times.",
                body: "1/ Cash flow is the ultimate operational leverage. But giving up equity for inventory rounds is a major trap. \n\nHere is how to secure up to $5M in non-dilutive capital in under 72 hours without pitch decks or VC board meetings. 👇\n\n2/ Moonshine Capital matches your trailing merchant/subscription revenue parameters with direct liquidity. If you've been operating for >1 year with clear bank deposits, you are already pre-qualified. \n\n3/ I set up a fully self-guided eligibility terminal. Check your criteria and generate a custom submission checklist instantly: {TRACKING_URL}"
            }
        ],

        marketingBanners: [
            {
                id: "banner-1",
                title: "Digital Display Badge (Green Accent)",
                type: "SVG Dynamic",
                description: "Live-rendered vector badge featuring your customized partner tracking parameters."
            },
            {
                id: "banner-2",
                title: "Dark Luxe Promo Card (Chrome Accent)",
                type: "SVG Dynamic",
                description: "Luxe social banner optimized for LinkedIn sharing or email newsletter integration."
            }
        ]
    };

    // 2. HELPER TO GENERATE LIVE TRACKING LINKS
    function getGeneratedLink() {
        const base = resourceData.trackingUrl;
        const url = new URL(base);
        if (resourceData.subId) url.searchParams.set("subId", resourceData.subId);
        if (resourceData.source) url.searchParams.set("utm_source", resourceData.source);
        if (resourceData.campaign) url.searchParams.set("utm_campaign", resourceData.campaign);
        return url.toString();
    }

    // 3. TOAST SYSTEM FOR HIGH-END UI FEEDBACK
    function showToast(message, type = "success") {
        const container = document.getElementById("hub-toast-container") || createToastContainer();
        const toast = document.createElement("div");
        toast.className = `glass-panel px-4 py-3 rounded border font-mono text-xs flex items-center justify-between gap-4 transition-all duration-300 transform translate-y-2 opacity-0 shadow-lg`;
        
        if (type === "success") {
            toast.className += " border-electricGreen text-electricGreen bg-matteBlack/90 neo-glow-green";
        } else if (type === "info") {
            toast.className += " border-cobaltBlue text-cobaltBlue bg-matteBlack/90";
        } else {
            toast.className += " border-signalOrange text-signalOrange bg-matteBlack/90";
        }

        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full ${type === 'success' ? 'bg-electricGreen' : 'bg-signalOrange'} animate-pulse"></span>
                <span>${message}</span>
            </div>
            <button class="text-white/40 hover:text-white font-bold">&times;</button>
        `;

        container.appendChild(toast);
        
        // Remove on click
        toast.querySelector('button').addEventListener('click', () => toast.remove());

        // Animate in
        setTimeout(() => {
            toast.classList.remove("translate-y-2", "opacity-0");
        }, 10);

        // Auto remove
        setTimeout(() => {
            toast.classList.add("translate-y-2", "opacity-0");
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function createToastContainer() {
        const container = document.createElement("div");
        container.id = "hub-toast-container";
        container.className = "fixed bottom-6 right-6 z-[1000] flex flex-col gap-2 max-w-sm w-full pointer-events-auto";
        document.body.appendChild(container);
        return container;
    }

    // 4. MAIN HUB INTERACTIVE TEMPLATE RENDERER
    function renderHubDashboard() {
        const modalId = "moonshine-resource-hub-modal";
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement("div");
            modal.id = modalId;
            modal.className = "fixed inset-0 z-50 overflow-y-auto bg-matteBlack/95 backdrop-blur-md flex justify-center p-4 sm:p-6 md:p-10 hidden";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="w-full max-w-7xl glass-panel rounded-2xl border border-glassBorder shadow-2xl flex flex-col overflow-hidden max-h-[90vh] bg-matteBlack relative">
                
                <!-- Chrome Header Styling -->
                <div class="border-b border-glassBorder px-6 py-4 flex items-center justify-between bg-graphiteGray/40 relative">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-gradient-to-tr from-signalOrange via-matteBlack to-electricGreen p-[1px]">
                            <div class="w-full h-full bg-matteBlack rounded-lg flex items-center justify-center font-display font-black text-xs text-electricGreen">
                                M
                            </div>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h2 class="font-display font-extrabold text-base sm:text-lg tracking-tight text-white">REFERRAL RESOURCE HUB & SWAG KIT</h2>
                                <span class="bg-electricGreen/15 text-electricGreen border border-electricGreen/30 text-[9px] font-mono uppercase px-2 py-0.5 rounded tracking-widest">v1.1 Active</span>
                            </div>
                            <p class="text-[10px] font-mono text-boneWhite/40 uppercase tracking-widest">Tactical Swipe Files, Tracking Engines & Promotional Banners</p>
                        </div>
                    </div>
                    <button id="close-hub-btn" class="w-8 h-8 rounded-full border border-glassBorder hover:border-signalOrange text-boneWhite/60 hover:text-signalOrange flex items-center justify-center transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <!-- Main Layout Container: Left config controls, Right Dynamic Output panel -->
                <div class="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
                    
                    <!-- LEFT COLUMN: CONTROLS & LINK GENERATOR -->
                    <div class="lg:col-span-4 border-r border-glassBorder p-6 space-y-6 bg-graphiteGray/20">
                        <div class="space-y-2">
                            <span class="text-electricGreen font-mono text-[10px] uppercase tracking-widest block">// STEP 1: CONFIGURE PARAMS</span>
                            <h3 class="font-display font-bold text-white text-sm uppercase tracking-wider">Dynamic Desk Parameters</h3>
                            <p class="text-xs text-boneWhite/50 leading-relaxed">Customize your partner branding. All email swipes and marketing assets update their links in real-time below.</p>
                        </div>

                        <!-- Param Inputs -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-[10px] font-mono text-boneWhite/50 uppercase tracking-wider mb-1.5">Partner Branding Name</label>
                                <input type="text" id="hub-input-partner-name" value="${resourceData.partnerName}" class="w-full bg-matteBlack border border-glassBorder text-xs text-boneWhite px-3.5 py-2.5 rounded font-mono focus:border-electricGreen focus:ring-1 focus:ring-electricGreen outline-none transition-all">
                            </div>
                            
                            <div>
                                <label class="block text-[10px] font-mono text-boneWhite/50 uppercase tracking-wider mb-1.5">Custom Referral ID (subId)</label>
                                <input type="text" id="hub-input-subid" value="${resourceData.subId}" placeholder="e.g. partner_321" class="w-full bg-matteBlack border border-glassBorder text-xs text-boneWhite px-3.5 py-2.5 rounded font-mono focus:border-electricGreen focus:ring-1 focus:ring-electricGreen outline-none transition-all">
                            </div>

                            <div>
                                <label class="block text-[10px] font-mono text-boneWhite/50 uppercase tracking-wider mb-1.5">Traffic Source (utm_source)</label>
                                <select id="hub-input-source" class="w-full bg-matteBlack border border-glassBorder text-xs text-boneWhite px-3.5 py-2.5 rounded font-mono focus:border-electricGreen focus:ring-1 focus:ring-electricGreen outline-none transition-all">
                                    <option value="linkedin" ${resourceData.source === "linkedin" ? "selected" : ""}>LinkedIn</option>
                                    <option value="email" ${resourceData.source === "email" ? "selected" : ""}>Email Campaign</option>
                                    <option value="twitter" ${resourceData.source === "twitter" ? "selected" : ""}>Twitter/X</option>
                                    <option value="newsletter" ${resourceData.source === "newsletter" ? "selected" : ""}>Newsletter</option>
                                    <option value="referral" ${resourceData.source === "referral" ? "selected" : ""}>Client Intro</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-[10px] font-mono text-boneWhite/50 uppercase tracking-wider mb-1.5">Campaign Slug (utm_campaign)</label>
                                <input type="text" id="hub-input-campaign" value="${resourceData.campaign}" placeholder="e.g. spring_scale" class="w-full bg-matteBlack border border-glassBorder text-xs text-boneWhite px-3.5 py-2.5 rounded font-mono focus:border-electricGreen focus:ring-1 focus:ring-electricGreen outline-none transition-all">
                            </div>
                        </div>

                        <!-- Dynamic Link Render Box -->
                        <div class="pt-4 border-t border-glassBorder space-y-3">
                            <span class="text-cobaltBlue font-mono text-[10px] uppercase tracking-widest block">// YOUR UNIQUE CAMPAIGN URL</span>
                            <div class="p-3 bg-matteBlack rounded border border-glassBorder relative group overflow-hidden">
                                <div class="text-[10px] font-mono break-all text-boneWhite/90 pr-8" id="hub-live-url-display">
                                    ${getGeneratedLink()}
                                </div>
                                <button id="hub-copy-live-url-btn" class="absolute right-2.5 top-2.5 text-white/40 hover:text-electricGreen transition-colors" title="Copy Custom URL">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                </button>
                            </div>
                            <button id="hub-test-link-btn" class="w-full bg-glassBorder hover:bg-white/15 text-white py-2 rounded text-[10px] font-mono uppercase border border-white/5 tracking-wider transition-all">
                                Open link in new tab ↗
                            </button>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: DYNAMIC TABS & RESOURCE VIEWER -->
                    <div class="lg:col-span-8 p-6 flex flex-col space-y-6">
                        
                        <!-- Navigation Tabs inside Hub -->
                        <div class="flex flex-wrap border-b border-glassBorder pb-1.5 gap-2">
                            <button data-hub-tab="emails" class="hub-tab-btn active px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all duration-200 border-electricGreen text-electricGreen bg-electricGreen/5">
                                Email Swipes
                            </button>
                            <button data-hub-tab="socials" class="hub-tab-btn px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all duration-200 border-glassBorder text-boneWhite/60 hover:text-white">
                                Social Posts
                            </button>
                            <button data-hub-tab="banners" class="hub-tab-btn px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all duration-200 border-glassBorder text-boneWhite/60 hover:text-white">
                                Custom Swag Banners
                            </button>
                            <button data-hub-tab="assets" class="hub-tab-btn px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all duration-200 border-glassBorder text-boneWhite/60 hover:text-white">
                                Decks & Compliance
                            </button>
                        </div>

                        <!-- SEARCH WITHIN HUB -->
                        <div class="flex items-center gap-3 bg-graphiteGray/30 px-3 py-2 rounded border border-glassBorder">
                            <svg class="w-4 h-4 text-boneWhite/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input type="text" id="hub-search-input" placeholder="Search resources, titles, categories..." class="bg-transparent border-none text-xs text-boneWhite/80 outline-none w-full font-mono placeholder-boneWhite/30">
                        </div>

                        <!-- TABS CONTENT CONTAINER -->
                        <div class="flex-1 overflow-y-auto space-y-6 pr-1" id="hub-tab-contents">
                            <!-- Populated dynamically via JS -->
                        </div>
                    </div>
                </div>

                <!-- Footer Panel Info -->
                <div class="bg-matteBlack border-t border-glassBorder py-3 px-6 flex flex-wrap justify-between items-center text-[9px] font-mono text-boneWhite/30 gap-4">
                    <span>SECURITY CRITERIA: ALL SWIPE SCRIPTS COMPLY WITH Alternative Lending Act Regulations.</span>
                    <span>MOONSHINE CAPITAL DIRECT PIPELINE</span>
                </div>
            </div>
        `;

        setupHubEventListeners(modal);
        renderActiveTab("emails");
    }

    // 5. RENDERING CONTENT UNDER SELECTED TAB
    function renderActiveTab(tabName, searchQuery = "") {
        const container = document.getElementById("hub-tab-contents");
        if (!container) return;

        container.innerHTML = "";
        const query = searchQuery.toLowerCase().trim();

        if (tabName === "emails") {
            const list = resourceData.emailTemplates.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.subject.toLowerCase().includes(query) || 
                item.body.toLowerCase().includes(query)
            );

            if (list.length === 0) {
                renderEmptyState(container);
                return;
            }

            list.forEach(item => {
                const updatedBody = replacePlaceholderVariables(item.body);
                const updatedSubject = item.subject.replace("[Client Name]", "your client").replace("[Company Name]", "your company");
                
                const card = document.createElement("div");
                card.className = "glass-panel p-5 rounded-lg border border-glassBorder space-y-4 hover:border-white/10 transition-all";
                card.innerHTML = `
                    <div class="flex flex-wrap justify-between items-start gap-2">
                        <div>
                            <span class="text-[9px] font-mono bg-cobaltBlue/15 text-cobaltBlue px-2 py-0.5 rounded border border-cobaltBlue/25">${item.category}</span>
                            <h4 class="font-display font-bold text-white text-sm mt-2">${item.title}</h4>
                            <p class="text-[11px] text-boneWhite/50 font-sans mt-1">${item.description}</p>
                        </div>
                        <button class="hub-copy-card-btn bg-electricGreen hover:bg-white text-matteBlack text-[10px] font-display font-bold uppercase tracking-wider px-3.5 py-1.5 rounded transition-colors" data-copy-target="${item.id}">
                            Copy Copy
                        </button>
                    </div>

                    <div class="p-4 bg-matteBlack/80 rounded border border-glassBorder space-y-2">
                        <div class="flex items-center gap-2 border-b border-glassBorder/60 pb-2 text-[10px] font-mono text-boneWhite/40">
                            <span class="font-semibold text-white/50">Subject:</span>
                            <span class="text-boneWhite/80 select-all">${updatedSubject}</span>
                        </div>
                        <pre id="${item.id}" class="text-[11px] font-mono text-boneWhite/70 leading-relaxed whitespace-pre-wrap select-all focus:outline-none pt-2">${updatedBody}</pre>
                    </div>
                `;
                container.appendChild(card);
            });

        } else if (tabName === "socials") {
            const list = resourceData.socialSwipes.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.body.toLowerCase().includes(query)
            );

            if (list.length === 0) {
                renderEmptyState(container);
                return;
            }

            list.forEach(item => {
                const updatedBody = replacePlaceholderVariables(item.body);
                const card = document.createElement("div");
                card.className = "glass-panel p-5 rounded-lg border border-glassBorder space-y-4 hover:border-white/10 transition-all";
                card.innerHTML = `
                    <div class="flex flex-wrap justify-between items-start gap-2">
                        <div>
                            <span class="text-[9px] font-mono bg-signalOrange/15 text-signalOrange px-2 py-0.5 rounded border border-signalOrange/25">${item.category}</span>
                            <h4 class="font-display font-bold text-white text-sm mt-2">${item.title}</h4>
                            <p class="text-[11px] text-boneWhite/50 font-sans mt-1">${item.description}</p>
                        </div>
                        <button class="hub-copy-card-btn bg-electricGreen hover:bg-white text-matteBlack text-[10px] font-display font-bold uppercase tracking-wider px-3.5 py-1.5 rounded transition-colors" data-copy-target="${item.id}">
                            Copy Post Script
                        </button>
                    </div>

                    <div class="p-4 bg-matteBlack/80 rounded border border-glassBorder">
                        <pre id="${item.id}" class="text-[11px] font-mono text-boneWhite/70 leading-relaxed whitespace-pre-wrap select-all focus:outline-none">${updatedBody}</pre>
                    </div>
                `;
                container.appendChild(card);
            });

        } else if (tabName === "banners") {
            // RENDERING THE INTERACTIVE VECTOR SWAG GENERATOR
            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <!-- Banner Template 1 -->
                    <div class="glass-panel p-5 rounded-lg border border-glassBorder space-y-4 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-center">
                                <span class="text-[9px] font-mono bg-electricGreen/15 text-electricGreen px-2 py-0.5 rounded border border-electricGreen/25">Interactive SVG Display Badge</span>
                                <span class="text-[9px] font-mono text-boneWhite/40">1200 x 630</span>
                            </div>
                            <h4 class="font-display font-bold text-white text-sm mt-3">Digital Promotion Badge</h4>
                            <p class="text-xs text-boneWhite/50 mt-1">Live vector canvas rendering custom partner parameters inside high-impact Moonshine layout rules.</p>
                        </div>
                        
                        <!-- Visual Preview Frame -->
                        <div class="border border-glassBorder bg-[#0b0b0c] p-4 rounded relative overflow-hidden flex items-center justify-center h-48 group">
                            <div class="absolute inset-0 bg-gradient-to-tr from-[#39FF14]/5 to-transparent pointer-events-none"></div>
                            <!-- Dynamic SVG Badge -->
                            <svg id="svg-badge-1" width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="400" height="200" rx="8" fill="#121214" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
                                <line x1="20" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.04)" stroke-dasharray="4 4"/>
                                <rect x="25" y="45" width="350" height="110" rx="4" fill="#0B0B0C" stroke="#39FF14" stroke-width="1.5" />
                                <text x="40" y="80" fill="#39FF14" font-family="'Space Grotesk', sans-serif" font-size="11" font-weight="bold" letter-spacing="2">MOONSHINE VERIFIED DESK</text>
                                <text id="svg-text-name-1" x="40" y="112" fill="#F5F5F7" font-family="'Space Grotesk', sans-serif" font-size="18" font-weight="900" letter-spacing="0.5">${resourceData.partnerName}</text>
                                <text id="svg-text-desc-1" x="40" y="135" fill="rgba(245, 245, 247, 0.4)" font-family="monospace" font-size="9" letter-spacing="1">LINK ID: ${resourceData.subId || "DIRECT_DEAL"}</text>
                                <circle cx="345" cy="110" r="15" fill="#39FF14" fill-opacity="0.1" />
                                <circle cx="345" cy="110" r="5" fill="#39FF14" />
                            </svg>
                        </div>

                        <div class="flex gap-2">
                            <button id="download-badge-1-btn" class="w-1/2 bg-glassBorder hover:bg-white/10 text-white text-center py-2 rounded text-[10px] font-mono uppercase transition-colors border border-white/5">
                                Download SVG
                            </button>
                            <button id="copy-svg-code-1" class="w-1/2 bg-electricGreen hover:bg-white text-matteBlack text-center py-2 rounded text-[10px] font-display font-bold uppercase tracking-wider transition-colors">
                                Copy SVG Code
                            </button>
                        </div>
                    </div>

                    <!-- Banner Template 2 -->
                    <div class="glass-panel p-5 rounded-lg border border-glassBorder space-y-4 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-center">
                                <span class="text-[9px] font-mono bg-signalOrange/15 text-signalOrange px-2 py-0.5 rounded border border-signalOrange/25">Interactive Dark Luxe Card</span>
                                <span class="text-[9px] font-mono text-boneWhite/40">1200 x 630</span>
                            </div>
                            <h4 class="font-display font-bold text-white text-sm mt-3">Luxe Direct Funding Desk</h4>
                            <p class="text-xs text-boneWhite/50 mt-1">Branded commercial funding desk design with signal orange neon borders, optimized for newsletter inserts.</p>
                        </div>
                        
                        <!-- Visual Preview Frame -->
                        <div class="border border-glassBorder bg-[#0b0b0c] p-4 rounded relative overflow-hidden flex items-center justify-center h-48">
                            <div class="absolute inset-0 bg-gradient-to-br from-[#FF5722]/5 to-transparent pointer-events-none"></div>
                            <!-- Dynamic SVG Badge 2 -->
                            <svg id="svg-badge-2" width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="400" height="200" rx="8" fill="#0B0B0C" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
                                <rect x="15" y="15" width="370" height="170" rx="6" fill="#121214" stroke="#FF5722" stroke-width="1.5" />
                                <text x="35" y="45" fill="#FF5722" font-family="monospace" font-size="9" font-weight="bold" letter-spacing="3">// MOONSHINE LIQUIDITY CHANNEL</text>
                                <text id="svg-text-name-2" x="35" y="80" fill="#F5F5F7" font-family="'Space Grotesk', sans-serif" font-size="16" font-weight="bold">${resourceData.partnerName}</text>
                                <text x="35" y="105" fill="rgba(245, 245, 247, 0.6)" font-family="sans-serif" font-size="10">Active Commercial Underwriting Matcher</text>
                                <rect x="35" y="130" width="160" height="25" rx="3" fill="#0B0B0C" stroke="rgba(255,255,255,0.12)" />
                                <text id="svg-text-desc-2" x="45" y="146" fill="#FF5722" font-family="monospace" font-size="9">SOURCE: ${resourceData.source.toUpperCase()}</text>
                                <path d="M330 110L350 130M350 130L330 150M350 130H290" stroke="#FF5722" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>

                        <div class="flex gap-2">
                            <button id="download-badge-2-btn" class="w-1/2 bg-glassBorder hover:bg-white/10 text-white text-center py-2 rounded text-[10px] font-mono uppercase transition-colors border border-white/5">
                                Download SVG
                            </button>
                            <button id="copy-svg-code-2" class="w-1/2 bg-electricGreen hover:bg-white text-matteBlack text-center py-2 rounded text-[10px] font-display font-bold uppercase tracking-wider transition-colors">
                                Copy SVG Code
                            </button>
                        </div>
                    </div>

                </div>
            `;
            setupBannerDownloadEvents();

        } else if (tabName === "assets") {
            // DOWNLOADABLE AND COMPLIANCE ASSETS
            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <!-- Asset Card 1 -->
                    <div class="glass-panel p-5 rounded-lg border border-glassBorder flex flex-col justify-between hover:border-white/10 transition-all">
                        <div class="space-y-3">
                            <span class="text-[9px] font-mono bg-cobaltBlue/15 text-cobaltBlue px-2 py-0.5 rounded border border-cobaltBlue/25">Compliance Presentation</span>
                            <h4 class="font-display font-bold text-white text-sm">Underwriting Pitch Deck (PDF)</h4>
                            <p class="text-xs text-boneWhite/60 leading-relaxed">Full 12-page sales presentation deck with pre-configured underwriting models for SBA, MCA, bridge lines and equipment acquisitions.</p>
                            <div class="p-3 bg-matteBlack/60 rounded border border-glassBorder/50 space-y-1.5 text-[10px] font-mono text-boneWhite/40">
                                <div>• Updated: Current Quarter</div>
                                <div>• Format: Secure Web PDF</div>
                                <div>• Regulatory: Compliant with MCA criteria</div>
                            </div>
                        </div>
                        <div class="pt-5 border-t border-glassBorder mt-4">
                            <a href="javascript:void(0)" onclick="alert('Asset Download Initiated: Secure Compliance Deck')" class="w-full block bg-glassBorder hover:bg-white/10 text-white text-center py-2 rounded text-xs font-mono uppercase transition-colors border border-white/5">
                                Download PDF Package (4.2 MB)
                            </a>
                        </div>
                    </div>

                    <!-- Asset Card 2 -->
                    <div class="glass-panel p-5 rounded-lg border border-glassBorder flex flex-col justify-between hover:border-white/10 transition-all">
                        <div class="space-y-3">
                            <span class="text-[9px] font-mono bg-signalOrange/15 text-signalOrange px-2 py-0.5 rounded border border-signalOrange/25">Underwriting Guideline</span>
                            <h4 class="font-display font-bold text-white text-sm">Quick Match Flowsheet (Sheet)</h4>
                            <p class="text-xs text-boneWhite/60 leading-relaxed">The internal playbook explaining daily transaction flows, high-intent keywords, and sub-broker split commissions routing guidelines.</p>
                            <div class="p-3 bg-matteBlack/60 rounded border border-glassBorder/50 space-y-1.5 text-[10px] font-mono text-boneWhite/40">
                                <div>• Updated: Real-time dynamic sync</div>
                                <div>• Format: Interactive Grid Sheet</div>
                                <div>• Compensation: 1.5% - 4.0% direct splits</div>
                            </div>
                        </div>
                        <div class="pt-5 border-t border-glassBorder mt-4">
                            <a href="javascript:void(0)" onclick="alert('Asset Download Initiated: Operational Guidelines Excel Sheet')" class="w-full block bg-electricGreen hover:bg-white text-matteBlack text-center py-2.5 rounded text-xs font-display font-bold uppercase tracking-wider transition-colors">
                                Access Quick Match Sheet
                            </a>
                        </div>
                    </div>

                </div>
            `;
        }

        // Attach listener for dynamic template copy buttons
        setupCopyCardButtons();
    }

    function renderEmptyState(container) {
        container.innerHTML = `
            <div class="text-center py-12 glass-panel rounded border border-dashed border-glassBorder">
                <span class="text-signalOrange font-mono text-xs uppercase tracking-widest block mb-2">// NO RESULTS FOUND</span>
                <p class="text-xs text-boneWhite/40">No matching scripts or files found. Clear your search or enter a different term.</p>
            </div>
        `;
    }

    // 6. HELPER TO REPLACE VARIABLE PLACEHOLDERS IN SWIPES ON THE FLY
    function replacePlaceholderVariables(text) {
        let result = text;
        result = result.replace(/{TRACKING_URL}/g, getGeneratedLink());
        result = result.replace(/{PARTNER_NAME}/g, resourceData.partnerName);
        return result;
    }

    // 7. SETUP DEBOUNCED FORM INPUT AND SYNC SYSTEM
    function setupHubEventListeners(modal) {
        const inputPartnerName = modal.querySelector("#hub-input-partner-name");
        const inputSubId = modal.querySelector("#hub-input-subid");
        const inputSource = modal.querySelector("#hub-input-source");
        const inputCampaign = modal.querySelector("#hub-input-campaign");
        
        const liveUrlDisplay = modal.querySelector("#hub-live-url-display");
        const copyLiveUrlBtn = modal.querySelector("#hub-copy-live-url-btn");
        const testLinkBtn = modal.querySelector("#hub-test-link-btn");
        const searchInput = modal.querySelector("#hub-search-input");
        const closeBtn = modal.querySelector("#close-hub-btn");

        function updateAllData() {
            resourceData.partnerName = inputPartnerName.value || "Elite Operator";
            resourceData.subId = inputSubId.value.trim();
            resourceData.source = inputSource.value;
            resourceData.campaign = inputCampaign.value.trim();

            // Render live url display
            liveUrlDisplay.innerText = getGeneratedLink();

            // Rerender active tab to show dynamic live values in preview boxes
            const activeTabBtn = modal.querySelector(".hub-tab-btn.active");
            if (activeTabBtn) {
                const activeTab = activeTabBtn.getAttribute("data-hub-tab");
                renderActiveTab(activeTab, searchInput.value);
            }
        }

        // Inputs triggering dynamic template updates
        [inputPartnerName, inputSubId, inputSource, inputCampaign].forEach(elem => {
            elem.addEventListener("input", updateAllData);
            elem.addEventListener("change", updateAllData);
        });

        // Copy Live Custom Link Action
        copyLiveUrlBtn.addEventListener("click", () => {
            const link = getGeneratedLink();
            navigator.clipboard.writeText(link).then(() => {
                showToast("Custom tracking link copied!", "success");
            }).catch(() => {
                showToast("Failed to copy link.", "error");
            });
        });

        // Test Link Action
        testLinkBtn.addEventListener("click", () => {
            window.open(getGeneratedLink(), "_blank");
        });

        // Search Input Functionality
        searchInput.addEventListener("input", (e) => {
            const activeTabBtn = modal.querySelector(".hub-tab-btn.active");
            if (activeTabBtn) {
                const activeTab = activeTabBtn.getAttribute("data-hub-tab");
                renderActiveTab(activeTab, e.target.value);
            }
        });

        // Tab selection events
        const tabBtns = modal.querySelectorAll(".hub-tab-btn");
        tabBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                tabBtns.forEach(b => {
                    b.classList.remove("active", "border-electricGreen", "text-electricGreen", "bg-electricGreen/5");
                    b.classList.add("border-glassBorder", "text-boneWhite/60", "hover:text-white");
                });
                btn.classList.add("active", "border-electricGreen", "text-electricGreen", "bg-electricGreen/5");
                btn.classList.remove("border-glassBorder", "text-boneWhite/60", "hover:text-white");

                const targetTab = btn.getAttribute("data-hub-tab");
                renderActiveTab(targetTab, searchInput.value);
            });
        });

        // Close Hub Modal Actions
        closeBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
            document.body.classList.remove("overflow-hidden");
        });

        // Close on clicking backdrop
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
                document.body.classList.remove("overflow-hidden");
            }
        });
    }

    // 8. SETUP INDIVIDUAL COPY CLIPBOARD EVENTS
    function setupCopyCardButtons() {
        const copyBtns = document.querySelectorAll(".hub-copy-card-btn");
        copyBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetId = btn.getAttribute("data-copy-target");
                const targetPre = document.getElementById(targetId);
                if (targetPre) {
                    navigator.clipboard.writeText(targetPre.innerText).then(() => {
                        showToast("Script copied successfully!", "success");
                    }).catch(() => {
                        showToast("Failed to copy script.", "error");
                    });
                }
            });
        });
    }

    // 9. HANDLERS FOR SVG DYNAMIC DOWNLOADS
    function setupBannerDownloadEvents() {
        const downloadBtn1 = document.getElementById("download-badge-1-btn");
        const downloadBtn2 = document.getElementById("download-badge-2-btn");
        const copySvgBtn1 = document.getElementById("copy-svg-code-1");
        const copySvgBtn2 = document.getElementById("copy-svg-code-2");

        if (downloadBtn1) {
            downloadBtn1.addEventListener("click", () => {
                triggerSvgDownload("svg-badge-1", "moonshine_verified_badge.svg");
            });
        }
        if (downloadBtn2) {
            downloadBtn2.addEventListener("click", () => {
                triggerSvgDownload("svg-badge-2", "moonshine_luxe_banner.svg");
            });
        }

        if (copySvgBtn1) {
            copySvgBtn1.addEventListener("click", () => {
                copySvgCode("svg-badge-1");
            });
        }
        if (copySvgBtn2) {
            copySvgBtn2.addEventListener("click", () => {
                copySvgCode("svg-badge-2");
            });
        }
    }

    function triggerSvgDownload(svgId, fileName) {
        const svgEl = document.getElementById(svgId);
        if (!svgEl) return;
        
        // Clone element to manipulate and download properly
        const svgClone = svgEl.cloneNode(true);
        const svgString = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
        showToast("SVG Download Started!", "success");
    }

    function copySvgCode(svgId) {
        const svgEl = document.getElementById(svgId);
        if (!svgEl) return;
        const svgClone = svgEl.cloneNode(true);
        const svgString = new XMLSerializer().serializeToString(svgClone);
        navigator.clipboard.writeText(svgString).then(() => {
            showToast("Raw SVG code copied!", "success");
        }).catch(() => {
            showToast("Failed to copy SVG code.", "error");
        });
    }

    // 10. API CONTROLLER & AUTOMATIC INTEGRATION WITH DOM
    window.MoonshineHub = {
        open: function (partnerName = "", partnerSlug = "") {
            if (partnerName) resourceData.partnerName = partnerName;
            if (partnerSlug) {
                resourceData.partnerSlug = partnerSlug;
                resourceData.trackingUrl = window.location.origin + "/partners/" + partnerSlug + "/index.html";
            }
            
            renderHubDashboard();
            const modal = document.getElementById("moonshine-resource-hub-modal");
            if (modal) {
                modal.classList.remove("hidden");
                document.body.classList.add("overflow-hidden");
                // Pre-populate input values dynamically
                const inputName = modal.querySelector("#hub-input-partner-name");
                if (inputName && partnerName) {
                    inputName.value = partnerName;
                    // Trigger input update
                    inputName.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }
    };

    // 11. REPLACING STANDARD ALERTS ON TOOLS GRID WITH DYNAMIC RESOURCE HUB
    document.addEventListener("DOMContentLoaded", () => {
        // Find existing tool links and bind clicks automatically
        const toolCards = document.querySelectorAll("#tools .glass-panel");
        
        toolCards.forEach(card => {
            const titleEl = card.querySelector("h4");
            if (!titleEl) return;

            const title = titleEl.innerText;
            const actionBtn = card.querySelector("a");
            
            if (actionBtn) {
                // Intercept campaign link builders or partner kits to launch our magnificent Hub instead of generic alerts
                if (title.includes("Referral Partner Kit") || title.includes("Campaign Link Builder")) {
                    actionBtn.setAttribute("onclick", ""); // Clear inline alerts
                    actionBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        window.MoonshineHub.open("Elite Operator", "partner-portal");
                    });
                    
                    // Style the buttons nicely with neon glowing properties
                    actionBtn.classList.remove("border-glassBorder");
                    actionBtn.classList.add("border-electricGreen", "text-electricGreen", "neo-glow-green");
                }
            }
        });
    });
})();