// Self-contained Mock Partner Dashboard and Lead Tracker Engine
// For Moonshine Capital Partners | Public Partner Profile Hub
// Persists all data client-side using localStorage

(function () {
    // Inject Custom Neobrutalist Styles for the Dashboard Dashboard Overlay
    const styles = `
        #moonshine-dashboard-root {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .db-font-mono {
            font-family: 'Space Grotesk', monospace !important;
        }
        .db-glass {
            background: rgba(13, 13, 13, 0.95);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 2px solid #f4f3ef;
        }
        .shadow-brutal-green {
            box-shadow: 4px 4px 0px 0px #00ff66;
        }
        .shadow-brutal-orange {
            box-shadow: 4px 4px 0px 0px #ff5500;
        }
        .shadow-brutal-blue {
            box-shadow: 4px 4px 0px 0px #0066ff;
        }
        .shadow-brutal-white {
            box-shadow: 6px 6px 0px 0px #f4f3ef;
        }
        .shadow-brutal-black {
            box-shadow: 4px 4px 0px 0px #0d0d0d;
        }
        .db-border {
            border: 2px solid #1a1a1a;
        }
        .db-input {
            background-color: #1a1a1a;
            border: 2px solid rgba(255,255,255,0.1);
            color: #f4f3ef;
            transition: all 0.2s ease;
        }
        .db-input:focus {
            border-color: #00ff66;
            outline: none;
        }
        /* Custom Scrollbar for dashboard lists */
        .db-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .db-scrollbar::-webkit-scrollbar-track {
            background: #0d0d0d;
        }
        .db-scrollbar::-webkit-scrollbar-thumb {
            background: #a3a3a3;
            border-radius: 3px;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Default Mock Data for Partner Profiles
    const DEFAULT_PARTNERS = {
        "darwin-hanneman": {
            name: "Darwin Hanneman",
            niche: "Contractors",
            specialty: "SBA Funding",
            clicks: 142,
            commissionRate: 2.5, // % payout
            leads: [
                { id: "L-9081", businessName: "Apex Drywall Inc.", amount: 150000, sector: "Contractors", status: "Funded", date: "2026-02-10" },
                { id: "L-9082", businessName: "Vanguard Masonry", amount: 85000, sector: "Contractors", status: "Underwriting", date: "2026-02-18" },
                { id: "L-9083", businessName: "Summit Civil Works", amount: 320000, sector: "Contractors", status: "Pending Docs", date: "2026-02-23" }
            ]
        },
        "sarah-jenkins": {
            name: "Sarah Jenkins",
            niche: "Ecommerce",
            specialty: "Working Capital",
            clicks: 389,
            commissionRate: 3.0,
            leads: [
                { id: "L-8011", businessName: "Velvet Threads Co.", amount: 45000, sector: "Ecommerce", status: "Funded", date: "2026-02-14" },
                { id: "L-8012", businessName: "GlowUp Cosmetics", amount: 120000, sector: "Ecommerce", status: "Funded", date: "2026-02-21" },
                { id: "L-8013", businessName: "Pure Hydration Shop", amount: 60000, sector: "Ecommerce", status: "Declined", date: "2026-02-24" }
            ]
        },
        "marcus-sterling": {
            name: "Marcus Sterling",
            niche: "Real Estate",
            specialty: "Lines of Credit",
            clicks: 94,
            commissionRate: 2.0,
            leads: [
                { id: "L-7041", businessName: "Sterling Heights Holdings", amount: 750000, sector: "Real Estate", status: "Underwriting", date: "2026-02-19" }
            ]
        }
    };

    // State Management using LocalStorage
    class DashboardState {
        static getStorage() {
            let data = localStorage.getItem("moonshine_partners_tracker");
            if (!data) {
                localStorage.setItem("moonshine_partners_tracker", JSON.stringify(DEFAULT_PARTNERS));
                return DEFAULT_PARTNERS;
            }
            return JSON.parse(data);
        }

        static saveStorage(data) {
            localStorage.setItem("moonshine_partners_tracker", JSON.stringify(data));
        }

        static getActivePartner() {
            return localStorage.getItem("moonshine_active_partner_slug") || null;
        }

        static setActivePartner(slug) {
            if (slug) {
                localStorage.setItem("moonshine_active_partner_slug", slug);
            } else {
                localStorage.removeItem("moonshine_active_partner_slug");
            }
        }

        static resetData() {
            localStorage.setItem("moonshine_partners_tracker", JSON.stringify(DEFAULT_PARTNERS));
            return DEFAULT_PARTNERS;
        }
    }

    // Main Dashboard Element Injected on runtime
    class PartnerDashboard {
        constructor() {
            this.state = DashboardState.getStorage();
            this.activeSlug = DashboardState.getActivePartner();
            this.initUI();
        }

        initUI() {
            // Create Floating Trigger Button on bottom-right
            const triggerBtn = document.createElement("button");
            triggerBtn.id = "dashboard-trigger-btn";
            triggerBtn.className = "fixed bottom-24 right-6 z-50 db-font-mono bg-[#00ff66] text-black font-extrabold px-5 py-3 border-2 border-black shadow-brutal-black hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-xs uppercase tracking-wider flex items-center gap-2";
            triggerBtn.innerHTML = `
                <span class="flex h-2 w-2 relative">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                </span>
                Partner Dashboard
            `;
            triggerBtn.addEventListener("click", () => this.toggleDashboard());
            document.body.appendChild(triggerBtn);

            // Create Dashboard Modal Overlay container
            const container = document.createElement("div");
            container.id = "moonshine-dashboard-root";
            container.className = "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4 transition-all duration-300";
            document.body.appendChild(container);
            this.container = container;
        }

        toggleDashboard() {
            if (this.container.classList.contains("hidden")) {
                this.container.classList.remove("hidden");
                this.render();
            } else {
                this.container.classList.add("hidden");
            }
        }

        render() {
            this.state = DashboardState.getStorage();
            this.activeSlug = DashboardState.getActivePartner();

            if (!this.activeSlug) {
                this.renderLoginView();
            } else {
                this.renderDashboardView();
            }
        }

        // --- Render Login/Selection Panel ---
        renderLoginView() {
            this.container.innerHTML = `
                <div class="db-glass text-[#f4f3ef] max-w-lg w-full p-8 shadow-brutal-green relative db-border">
                    <button id="db-close-btn" class="absolute top-4 right-4 text-[#a3a3a3] hover:text-[#ff5500] db-font-mono font-bold text-lg">✕</button>
                    
                    <div class="mb-6">
                        <span class="db-font-mono text-xs text-[#00ff66] font-extrabold uppercase tracking-widest block mb-1">Internal Sandbox Engine</span>
                        <h3 class="db-font-mono font-bold text-2xl text-white">Partner Dashboard Entry</h3>
                        <p class="text-[#a3a3a3] text-xs mt-1">Select an active referral desk profile from local memory to load diagnostic analytics.</p>
                    </div>

                    <div class="space-y-3 mb-6">
                        ${Object.keys(this.state).map(slug => {
                            const partner = this.state[slug];
                            return `
                                <button data-slug="${slug}" class="partner-select-btn w-full text-left p-4 bg-[#1a1a1a] border border-white/10 hover:border-[#00ff66] transition-colors flex justify-between items-center group">
                                    <div>
                                        <h4 class="font-bold text-white text-sm group-hover:text-[#00ff66]">${partner.name}</h4>
                                        <span class="db-font-mono text-[10px] text-[#a3a3a3] uppercase">${partner.niche} Desk • ${partner.specialty}</span>
                                    </div>
                                    <span class="db-font-mono text-xs text-[#00ff66] opacity-0 group-hover:opacity-100 transition-opacity">Launch →</span>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <div class="border-t border-white/10 pt-4 flex justify-between items-center">
                        <span class="text-[10px] text-[#a3a3a3] db-font-mono uppercase">Local Simulator Ready</span>
                        <button id="db-reset-btn" class="text-xs text-[#ff5500] hover:underline db-font-mono uppercase">Reset Sandbox Data</button>
                    </div>
                </div>
            `;

            // Event Listeners for Login View
            this.container.querySelector("#db-close-btn").addEventListener("click", () => this.toggleDashboard());
            
            this.container.querySelectorAll(".partner-select-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const slug = e.currentTarget.getAttribute("data-slug");
                    DashboardState.setActivePartner(slug);
                    this.render();
                });
            });

            this.container.querySelector("#db-reset-btn").addEventListener("click", () => {
                if(confirm("Reset all custom modifications to standard default dataset?")) {
                    this.state = DashboardState.resetData();
                    this.render();
                }
            });
        }

        // --- Render Main Dashboard Panel ---
        renderDashboardView() {
            const partner = this.state[this.activeSlug];
            
            // Calculate Quick Metrics
            const totalLeads = partner.leads.length;
            const fundedLeads = partner.leads.filter(l => l.status === 'Funded');
            const totalFundedVolume = fundedLeads.reduce((acc, curr) => acc + curr.amount, 0);
            const conversionRate = totalLeads > 0 ? ((fundedLeads.length / totalLeads) * 100).toFixed(1) : 0;
            const totalCommission = (totalFundedVolume * (partner.commissionRate / 100)).toLocaleString('en-US', { maximumFractionDigits: 0 });

            this.container.innerHTML = `
                <div class="db-glass text-[#f4f3ef] max-w-5xl w-full p-6 lg:p-8 shadow-brutal-white relative db-border flex flex-col gap-6 max-h-[90vh] overflow-y-auto db-scrollbar">
                    
                    <!-- Header -->
                    <div class="flex flex-wrap justify-between items-start gap-4 pb-6 border-b border-white/10">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span class="db-font-mono text-[10px] bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 px-2 py-0.5 uppercase tracking-wider font-extrabold">Active Partner Session</span>
                                <span class="db-font-mono text-[10px] bg-white/5 text-[#a3a3a3] px-2 py-0.5 uppercase">Local Simulation</span>
                            </div>
                            <h3 class="db-font-mono font-bold text-2xl text-white">${partner.name}</h3>
                            <p class="text-xs text-[#a3a3a3]">Public Desk Path: <span class="text-[#00ff66]">/partners/${this.activeSlug}/</span></p>
                        </div>
                        
                        <div class="flex items-center gap-3">
                            <button id="db-simulate-click-btn" class="db-font-mono bg-[#0066ff] hover:bg-[#0066ff]/80 text-white font-bold px-3 py-1.5 text-xs border border-black shadow-brutal-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                                ⚡ Simulate Bio Link Click
                            </button>
                            <button id="db-logout-btn" class="db-font-mono bg-transparent hover:bg-white/5 text-white font-semibold px-3 py-1.5 text-xs border border-white/20 transition-all">
                                Switch Partner
                            </button>
                            <button id="db-close-btn" class="text-[#a3a3a3] hover:text-[#ff5500] db-font-mono font-bold text-lg px-2">✕</button>
                        </div>
                    </div>

                    <!-- Metrics Grid -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-[#1a1a1a] p-4 border border-white/10 relative">
                            <span class="db-font-mono text-[10px] text-[#a3a3a3] block uppercase tracking-wider">Estimated Earned</span>
                            <span class="db-font-mono text-xl sm:text-2xl font-black text-[#00ff66] mt-1 block">$${totalCommission}</span>
                            <span class="text-[9px] text-[#a3a3a3] block mt-1">Based on ${partner.commissionRate}% average payout</span>
                        </div>
                        <div class="bg-[#1a1a1a] p-4 border border-white/10 relative">
                            <span class="db-font-mono text-[10px] text-[#a3a3a3] block uppercase tracking-wider">Referral Clicks</span>
                            <span class="db-font-mono text-xl sm:text-2xl font-black text-white mt-1 block">${partner.clicks}</span>
                            <span class="text-[9px] text-[#a3a3a3] block mt-1">Clicks on partner landing url</span>
                        </div>
                        <div class="bg-[#1a1a1a] p-4 border border-white/10 relative">
                            <span class="db-font-mono text-[10px] text-[#a3a3a3] block uppercase tracking-wider">Registered Leads</span>
                            <span class="db-font-mono text-xl sm:text-2xl font-black text-[#ff5500] mt-1 block">${totalLeads}</span>
                            <span class="text-[9px] text-[#a3a3a3] block mt-1">${fundedLeads.length} deals processed & funded</span>
                        </div>
                        <div class="bg-[#1a1a1a] p-4 border border-white/10 relative">
                            <span class="db-font-mono text-[10px] text-[#a3a3a3] block uppercase tracking-wider">Conversion Ratio</span>
                            <span class="db-font-mono text-xl sm:text-2xl font-black text-white mt-1 block">${conversionRate}%</span>
                            <span class="text-[9px] text-[#a3a3a3] block mt-1">Intake ratio click-to-funded</span>
                        </div>
                    </div>

                    <!-- Main Section: Split Tracker Column & Interactive Calculators -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        <!-- Left Panel: Leads Management & Direct Register -->
                        <div class="lg:col-span-7 flex flex-col gap-6">
                            
                            <!-- Lead List Panel -->
                            <div class="bg-[#1a1a1a] border border-white/10 p-5 flex flex-col gap-4">
                                <div class="flex justify-between items-center pb-3 border-b border-white/5">
                                    <h4 class="db-font-mono font-bold text-sm text-white uppercase flex items-center gap-2">
                                        <span class="h-2 w-2 rounded-full bg-[#ff5500]"></span> Tracked Referrals
                                    </h4>
                                    <span class="db-font-mono text-[11px] text-[#a3a3a3]">${totalLeads} items</span>
                                </div>

                                <div class="space-y-2.5 max-h-[220px] overflow-y-auto db-scrollbar pr-1">
                                    ${partner.leads.map(lead => {
                                        let statusColor = "text-[#ff5500]";
                                        let statusBg = "bg-[#ff5500]/10";
                                        if (lead.status === "Funded") {
                                            statusColor = "text-[#00ff66]";
                                            statusBg = "bg-[#00ff66]/10";
                                        } else if (lead.status === "Declined") {
                                            statusColor = "text-white/40";
                                            statusBg = "bg-white/5";
                                        }

                                        return `
                                            <div class="bg-black/40 border border-white/5 p-3 flex justify-between items-center gap-4 text-xs transition-all hover:border-white/10">
                                                <div>
                                                    <div class="flex items-center gap-2">
                                                        <span class="font-bold text-white text-sm">${lead.businessName}</span>
                                                        <span class="db-font-mono text-[9px] text-[#a3a3a3] uppercase">${lead.sector}</span>
                                                    </div>
                                                    <div class="text-[10px] text-[#a3a3a3] mt-0.5">
                                                        Requested: <span class="text-[#f4f3ef] font-semibold">$${lead.amount.toLocaleString()}</span> • ${lead.date}
                                                    </div>
                                                </div>
                                                
                                                <div class="flex items-center gap-2">
                                                    <!-- Live status toggle selector simulation -->
                                                    <select data-lead-id="${lead.id}" class="db-status-select bg-[#0d0d0d] border border-white/10 font-mono text-[10px] text-white px-2 py-1 focus:outline-none focus:border-[#00ff66]">
                                                        <option value="Pending Docs" ${lead.status === "Pending Docs" ? "selected" : ""}>Pending Docs</option>
                                                        <option value="Underwriting" ${lead.status === "Underwriting" ? "selected" : ""}>Underwriting</option>
                                                        <option value="Funded" ${lead.status === "Funded" ? "selected" : ""}>Funded</option>
                                                        <option value="Declined" ${lead.status === "Declined" ? "selected" : ""}>Declined</option>
                                                    </select>
                                                    
                                                    <button data-lead-id="${lead.id}" class="db-lead-delete-btn text-[#ff5500] hover:text-white px-1.5 py-0.5 transition-colors" title="Delete lead">
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>

                            <!-- Register Mock Lead Form -->
                            <div class="bg-[#1a1a1a] border border-white/10 p-5">
                                <h4 class="db-font-mono font-bold text-sm text-white uppercase pb-3 border-b border-white/5 mb-4">
                                    Simulate Referral Inbound
                                </h4>
                                <form id="db-add-lead-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block db-font-mono text-[10px] text-[#a3a3a3] uppercase mb-1">Merchant Business Name</label>
                                        <input type="text" required id="db-new-lead-name" placeholder="e.g. Ironclad Builders" class="db-input w-full px-3 py-2 text-xs">
                                    </div>
                                    <div>
                                        <label class="block db-font-mono text-[10px] text-[#a3a3a3] uppercase mb-1">Target Capital Amount ($)</label>
                                        <input type="number" required id="db-new-lead-amount" placeholder="e.g. 150000" class="db-input w-full px-3 py-2 text-xs">
                                    </div>
                                    <div>
                                        <label class="block db-font-mono text-[10px] text-[#a3a3a3] uppercase mb-1">Lead Industry Niche</label>
                                        <select id="db-new-lead-sector" class="db-input w-full px-3 py-2 text-xs">
                                            <option value="Contractors">Contracting</option>
                                            <option value="Ecommerce">Ecommerce & SaaS</option>
                                            <option value="Real Estate">Real Estate Developers</option>
                                            <option value="Local Business">Local Retail / Main Street</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block db-font-mono text-[10px] text-[#a3a3a3] uppercase mb-1">Immediate Status</label>
                                        <select id="db-new-lead-status" class="db-input w-full px-3 py-2 text-xs">
                                            <option value="Pending Docs">Pending Docs</option>
                                            <option value="Underwriting">Underwriting</option>
                                            <option value="Funded">Funded</option>
                                        </select>
                                    </div>
                                    <div class="sm:col-span-2 pt-2">
                                        <button type="submit" class="w-full text-center py-2.5 bg-[#00ff66] text-black db-font-mono font-extrabold text-xs uppercase tracking-wider border border-black shadow-brutal-black hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                                            Inject Simulated Referral Lead
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>

                        <!-- Right Panel: Strategic Comm calculator & specs -->
                        <div class="lg:col-span-5 flex flex-col gap-6">
                            
                            <!-- Dynamic Split Calculator -->
                            <div class="bg-[#1a1a1a] border border-white/10 p-5">
                                <div class="mb-4">
                                    <h4 class="db-font-mono font-bold text-sm text-white uppercase flex items-center gap-2">
                                        <span class="h-2 w-2 rounded-full bg-[#0066ff]"></span> Strategic Split Tool
                                    </h4>
                                    <p class="text-[10px] text-[#a3a3a3] mt-1">Calculate real-time commission payout metrics based on gross deal metrics.</p>
                                </div>

                                <div class="space-y-3.5">
                                    <div>
                                        <div class="flex justify-between text-xs mb-1">
                                            <span class="db-font-mono text-[#a3a3a3] uppercase">Simulated Funded Deal</span>
                                            <span id="calc-val-loan" class="font-bold text-white">$250,000</span>
                                        </div>
                                        <input type="range" id="calc-range-loan" min="10000" max="1000000" step="10000" value="250000" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00ff66]">
                                    </div>

                                    <div>
                                        <div class="flex justify-between text-xs mb-1">
                                            <span class="db-font-mono text-[#a3a3a3] uppercase">Gross Origination Fee</span>
                                            <span id="calc-val-fee" class="font-bold text-white">4.0%</span>
                                        </div>
                                        <input type="range" id="calc-range-fee" min="1" max="10" step="0.5" value="4.0" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff5500]">
                                    </div>

                                    <div>
                                        <div class="flex justify-between text-xs mb-1">
                                            <span class="db-font-mono text-[#a3a3a3] uppercase">Your Partner Tier Split</span>
                                            <span id="calc-val-split" class="font-bold text-white">50%</span>
                                        </div>
                                        <input type="range" id="calc-range-split" min="30" max="80" step="5" value="50" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#0066ff]">
                                    </div>

                                    <!-- Output Block -->
                                    <div class="bg-black/50 border border-white/5 p-4 space-y-2 mt-4">
                                        <div class="flex justify-between text-xs">
                                            <span class="text-[#a3a3a3]">Total Generated Fee:</span>
                                            <span id="calc-res-total" class="font-bold text-[#f4f3ef]">$10,000</span>
                                        </div>
                                        <div class="flex justify-between text-xs">
                                            <span class="text-[#a3a3a3]">Partner Payout Split:</span>
                                            <span id="calc-res-partner" class="font-bold text-[#00ff66]">$5,000</span>
                                        </div>
                                        <div class="flex justify-between text-xs">
                                            <span class="text-[#a3a3a3]">Moonshine Capital Share:</span>
                                            <span id="calc-res-moonshine" class="font-bold text-[#ff5500]">$5,000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Real-time Desk Rules Info -->
                            <div class="bg-[#1a1a1a] border border-white/10 p-5 relative overflow-hidden">
                                <div class="absolute -top-12 -right-12 h-24 w-24 bg-[#00ff66]/5 rounded-full filter blur-xl"></div>
                                <h4 class="db-font-mono font-bold text-xs text-white uppercase tracking-wider mb-2">Static-First Commission Rules</h4>
                                <ul class="space-y-2 text-[11px] text-[#a3a3a3] list-disc list-inside">
                                    <li>Commissions process daily on merchant bank clearing validation metrics.</li>
                                    <li>Tiers automatically advance from <strong class="text-white">50%</strong> to <strong class="text-white">70%</strong> based on rolling 30-day funded volumes.</li>
                                    <li>API lead submissions generate a parallel web hook ping configuration instantly.</li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            `;

            this.setupDashboardEvents(partner);
        }

        setupDashboardEvents(partner) {
            // Close Action
            this.container.querySelector("#db-close-btn").addEventListener("click", () => this.toggleDashboard());

            // Switch/Logout Action
            this.container.querySelector("#db-logout-btn").addEventListener("click", () => {
                DashboardState.setActivePartner(null);
                this.render();
            });

            // Simulate Link Click Button Action
            this.container.querySelector("#db-simulate-click-btn").addEventListener("click", () => {
                this.state[this.activeSlug].clicks += 1;
                DashboardState.saveStorage(this.state);
                this.render();
            });

            // Status Update dropdown handling
            this.container.querySelectorAll(".db-status-select").forEach(select => {
                select.addEventListener("change", (e) => {
                    const leadId = e.currentTarget.getAttribute("data-lead-id");
                    const newStatus = e.currentTarget.value;
                    
                    const leadIndex = this.state[this.activeSlug].leads.findIndex(l => l.id === leadId);
                    if (leadIndex !== -1) {
                        this.state[this.activeSlug].leads[leadIndex].status = newStatus;
                        DashboardState.saveStorage(this.state);
                        this.render();
                    }
                });
            });

            // Lead deletion handling
            this.container.querySelectorAll(".db-lead-delete-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const leadId = e.currentTarget.getAttribute("data-lead-id");
                    if (confirm("Permanently delete this mock lead record?")) {
                        this.state[this.activeSlug].leads = this.state[this.activeSlug].leads.filter(l => l.id !== leadId);
                        DashboardState.saveStorage(this.state);
                        this.render();
                    }
                });
            });

            // Register Lead Form Submission
            const leadForm = this.container.querySelector("#db-add-lead-form");
            leadForm.addEventListener("submit", (e) => {
                e.preventDefault();
                
                const nameInput = this.container.querySelector("#db-new-lead-name");
                const amountInput = this.container.querySelector("#db-new-lead-amount");
                const sectorSelect = this.container.querySelector("#db-new-lead-sector");
                const statusSelect = this.container.querySelector("#db-new-lead-status");

                const newLead = {
                    id: "L-" + Math.floor(1000 + Math.random() * 9000),
                    businessName: nameInput.value.trim(),
                    amount: parseFloat(amountInput.value) || 0,
                    sector: sectorSelect.value,
                    status: statusSelect.value,
                    date: new Date().toISOString().split('T')[0]
                };

                this.state[this.activeSlug].leads.push(newLead);
                DashboardState.saveStorage(this.state);
                this.render();
            });

            // Commission Calculator Events
            const loanRange = this.container.querySelector("#calc-range-loan");
            const feeRange = this.container.querySelector("#calc-range-fee");
            const splitRange = this.container.querySelector("#calc-range-split");

            const updateCalcOutputs = () => {
                const loanVal = parseInt(loanRange.value);
                const feeVal = parseFloat(feeRange.value);
                const splitVal = parseInt(splitRange.value);

                // Update text targets
                this.container.querySelector("#calc-val-loan").innerText = `$${loanVal.toLocaleString()}`;
                this.container.querySelector("#calc-val-fee").innerText = `${feeVal.toFixed(1)}%`;
                this.container.querySelector("#calc-val-split").innerText = `${splitVal}%`;

                // Calculate sums
                const totalFee = loanVal * (feeVal / 100);
                const partnerPayout = totalFee * (splitVal / 100);
                const moonshineCut = totalFee - partnerPayout;

                this.container.querySelector("#calc-res-total").innerText = `$${totalFee.toLocaleString('en-US', {maximumFractionDigits: 0})}`;
                this.container.querySelector("#calc-res-partner").innerText = `$${partnerPayout.toLocaleString('en-US', {maximumFractionDigits: 0})}`;
                this.container.querySelector("#calc-res-moonshine").innerText = `$${moonshineCut.toLocaleString('en-US', {maximumFractionDigits: 0})}`;
            };

            loanRange.addEventListener("input", updateCalcOutputs);
            feeRange.addEventListener("input", updateCalcOutputs);
            splitRange.addEventListener("input", updateCalcOutputs);

            // Trigger calc values load init instantly
            updateCalcOutputs();
        }
    }

    // Initialize once DOM is complete
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => new PartnerDashboard());
    } else {
        new PartnerDashboard();
    }
})();