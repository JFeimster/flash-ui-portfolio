const INITIAL_LEADS = [
    {
        id: "MS-9082",
        company: "APEX LOGISTICS LLC",
        contact: "Marcus Vance",
        email: "m.vance@apexlogistics.com",
        phone: "+1 (555) 342-9011",
        revenue: "$120,000 / mo",
        fundingNeeded: 180000,
        status: "FUNDED",
        submittedAt: "2024-03-12 09:14",
        useOfFunds: "Fleet Expansion & Fuel deposit",
        notes: "Highly qualified merchant. Invoices cleared with clean track record.",
        history: [
            { date: "2024-03-12 09:14", msg: "Lead ingested via affiliate pipeline." },
            { date: "2024-03-12 11:30", msg: "Underwriting matched with Tier-1 liquidity pool." },
            { date: "2024-03-13 16:00", msg: "Capital cleared. Payout finalized. 4% Commission locked." }
        ]
    },
    {
        id: "MS-8421",
        company: "TITAN METALS CO.",
        contact: "Sarah Lin",
        email: "s.lin@titanmetals.io",
        phone: "+1 (555) 901-4433",
        revenue: "$450,000 / mo",
        fundingNeeded: 500000,
        status: "UNDERWRITING",
        submittedAt: "2024-03-14 14:22",
        useOfFunds: "Raw materials acquisition",
        notes: "Demanding fast close within 5 banking days. Credit score optimal.",
        history: [
            { date: "2024-03-14 14:22", msg: "Lead route established." },
            { date: "2024-03-14 15:00", msg: "Assigned to Lead Underwriter (M. Sterling)." }
        ]
    },
    {
        id: "MS-7719",
        company: "KRAKEN ROOFING",
        contact: "Dale Rogers",
        email: "dale@krakenroofing.com",
        phone: "+1 (555) 123-9002",
        revenue: "$45,000 / mo",
        fundingNeeded: 65000,
        status: "VERIFYING",
        submittedAt: "2024-03-15 08:05",
        useOfFunds: "Emergency payroll & supplies",
        notes: "Urgent request. High seasonality risk but bank statements verify stable daily balances.",
        history: [
            { date: "2024-03-15 08:05", msg: "Lead created. Verification call scheduled." }
        ]
    }
];

class MoonshineLeadsEngine {
    constructor(containerId = "leads-submission-app") {
        this.containerId = containerId;
        this.leads = JSON.parse(localStorage.getItem("moonshine_leads")) || INITIAL_LEADS;
        this.currentStep = 1;
        this.filterStatus = "ALL";
        this.expandedLeadId = null;
        
        // Temporary state for the new lead
        this.formData = {
            company: "",
            contact: "",
            email: "",
            phone: "",
            revenue: "",
            fundingNeeded: "",
            useOfFunds: "",
            notes: ""
        };

        this.init();
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.warn(`MoonshineLeadsEngine: Container with ID "${this.containerId}" not found.`);
            return;
        }

        // Apply global style requirements for brutalist component
        this.renderLayout(container);
        this.bindEvents();
        this.renderLeadsTable();
        this.updateFormUI();
    }

    saveLeads() {
        localStorage.setItem("moonshine_leads", JSON.stringify(this.leads));
    }

    renderLayout(container) {
        container.innerHTML = `
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch w-full">
                <!-- LEFT SIDE: MASSIVE MULTI-STEP SUBMISSION FORM (5 COLS) -->
                <div class="xl:col-span-5 bg-black text-white border-4 border-white shadow-[8px_8px_0px_#ff4800] p-6 flex flex-col justify-between relative overflow-hidden">
                    <div class="absolute top-0 right-0 bg-[#ff4800] text-black font-black px-3 py-1 text-xs uppercase tracking-widest border-b-4 border-l-4 border-white z-10">
                        DIRECT INTAKE
                    </div>

                    <div>
                        <div class="mb-6">
                            <span class="bg-[#ff4800] text-black text-xs font-black px-2 py-0.5 uppercase tracking-widest inline-block mb-1">
                                PORTAL ENGINE // V2
                            </span>
                            <h3 class="text-3xl font-black uppercase tracking-tight leading-none">
                                INJECT <span class="text-[#ff4800]">RAW</span> TARGETS
                            </h3>
                            <p class="text-zinc-400 font-mono text-xs mt-1">Submit opportunities to the algorithmic underwriting pipeline.</p>
                        </div>

                        <!-- Step tracker progress bar -->
                        <div class="grid grid-cols-3 gap-2 mb-8 border-4 border-white p-2 bg-zinc-950">
                            <div id="step-indicator-1" class="text-center py-2 font-black text-xs uppercase border-2 transition-all">
                                01 / PROFILE
                            </div>
                            <div id="step-indicator-2" class="text-center py-2 font-black text-xs uppercase border-2 transition-all">
                                02 / CAPITAL
                            </div>
                            <div id="step-indicator-3" class="text-center py-2 font-black text-xs uppercase border-2 transition-all">
                                03 / FINALIZE
                            </div>
                        </div>

                        <!-- FORM FIELDS CONTAINER -->
                        <form id="multi-step-lead-form" onsubmit="return false;" class="space-y-6">
                            
                            <!-- STEP 1: COMPANY PROFILE -->
                            <div id="form-step-1" class="form-step-panel space-y-4">
                                <h4 class="font-black text-lg text-[#ff4800] uppercase tracking-wide border-b-2 border-zinc-800 pb-1">// STEP 1: COMPANY DATA</h4>
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">COMPANY NAME *</label>
                                    <input type="text" id="input-company" placeholder="APEX CO." class="w-full bg-black text-white font-black p-3 border-4 border-white focus:outline-none focus:border-[#ff4800] uppercase placeholder-zinc-800">
                                </div>
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">ANNUAL/MONTHLY REVENUE *</label>
                                    <input type="text" id="input-revenue" placeholder="$50,000 / MO" class="w-full bg-black text-white font-black p-3 border-4 border-white focus:outline-none focus:border-[#ff4800] uppercase placeholder-zinc-800">
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <label class="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">KEY CONTACT *</label>
                                        <input type="text" id="input-contact" placeholder="JOHN DOE" class="w-full bg-black text-white font-black p-3 border-4 border-white focus:outline-none focus:border-[#ff4800] uppercase placeholder-zinc-800">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">DIRECT PHONE *</label>
                                        <input type="text" id="input-phone" placeholder="555-0199" class="w-full bg-black text-white font-black p-3 border-4 border-white focus:outline-none focus:border-[#ff4800] uppercase placeholder-zinc-800">
                                    </div>
                                </div>
                            </div>

                            <!-- STEP 2: FUNDING SPECIFICATIONS -->
                            <div id="form-step-2" class="form-step-panel hidden space-y-4">
                                <h4 class="font-black text-lg text-[#ff4800] uppercase tracking-wide border-b-2 border-zinc-800 pb-1">// STEP 2: PARAMETERS</h4>
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">CAPITAL WANTED ($ USD) *</label>
                                    <input type="number" id="input-fundingNeeded" placeholder="250000" class="w-full bg-black text-white font-black p-3 border-4 border-white focus:outline-none focus:border-[#ff4800] placeholder-zinc-800">
                                </div>
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">USE OF FUNDS *</label>
                                    <textarea id="input-useOfFunds" rows="3" placeholder="EQUIPMENT REQUISITION & WORKING CAPITAL" class="w-full bg-black text-white font-black p-3 border-4 border-white focus:outline-none focus:border-[#ff4800] uppercase placeholder-zinc-800"></textarea>
                                </div>
                            </div>

                            <!-- STEP 3: CONTACT & FINALIZE -->
                            <div id="form-step-3" class="form-step-panel hidden space-y-4">
                                <h4 class="font-black text-lg text-[#ff4800] uppercase tracking-wide border-b-2 border-zinc-800 pb-1">// STEP 3: SUBMITTER DETAILS</h4>
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">DECISION MAKER EMAIL *</label>
                                    <input type="email" id="input-email" placeholder="CONTACT@APEX.COM" class="w-full bg-black text-white font-black p-3 border-4 border-white focus:outline-none focus:border-[#ff4800] uppercase placeholder-zinc-800">
                                </div>
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">INTEL NOTES (OPTIONAL)</label>
                                    <textarea id="input-notes" rows="3" placeholder="ANY EXTENUATING CIRCUMSTANCES OR SPECIAL STRUCTURING REQUIRED..." class="w-full bg-black text-white font-black p-3 border-4 border-white focus:outline-none focus:border-[#ff4800] uppercase placeholder-zinc-800"></textarea>
                                </div>
                                <div class="bg-zinc-950 p-3 border-2 border-dashed border-[#ff4800] text-xs font-mono text-zinc-400">
                                    * SUBMITTING STAMPS TARGET TO YOUR PARTNER ROUTE PERMANENTLY. COMMISSION APPLIES ONCE COMPLETED.
                                </div>
                            </div>

                        </form>
                    </div>

                    <!-- Step Controls -->
                    <div class="mt-8 pt-4 border-t-4 border-white flex justify-between items-center gap-4">
                        <button id="btn-form-prev" class="bg-zinc-800 text-white font-black px-4 py-3 uppercase border-4 border-white shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-sm tracking-wider disabled:opacity-30 disabled:pointer-events-none">
                            ← BACK
                        </button>
                        
                        <button id="btn-form-next" class="bg-[#ff4800] text-black font-black px-6 py-3 uppercase border-4 border-white shadow-[4px_4px_0px_#ffffff] hover:bg-white active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-sm tracking-widest flex-grow text-center justify-center flex items-center">
                            NEXT PHASE →
                        </button>
                    </div>
                </div>

                <!-- RIGHT SIDE: ACTIVE DEALS LEDGER (7 COLS) -->
                <div class="xl:col-span-7 bg-black text-white border-4 border-white shadow-[8px_8px_0px_#ffffff] p-6 flex flex-col justify-between relative">
                    <div>
                        <!-- Header & Ledger Filter controls -->
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h3 class="text-3xl font-black uppercase tracking-tight leading-none text-white">
                                    PIPELINE <span class="text-[#ff4800]">LEDGER</span>
                                </h3>
                                <p class="text-zinc-500 font-mono text-xs mt-1">// TRACK YOUR ACTIVE CONVERSIONS AND PAYOUT STATUS</p>
                            </div>
                            
                            <!-- Filter Tabs (Brutalist Blocks) -->
                            <div class="flex flex-wrap gap-1 border-2 border-white p-1 bg-zinc-950">
                                <button data-filter="ALL" class="filter-btn bg-[#ff4800] text-black font-bold text-xs uppercase px-3 py-1 border border-black hover:bg-white transition-colors">ALL</button>
                                <button data-filter="VERIFYING" class="filter-btn bg-black text-white font-bold text-xs uppercase px-3 py-1 border border-transparent hover:bg-white hover:text-black transition-colors">VERIFYING</button>
                                <button data-filter="UNDERWRITING" class="filter-btn bg-black text-white font-bold text-xs uppercase px-3 py-1 border border-transparent hover:bg-white hover:text-black transition-colors">UNDERWRITING</button>
                                <button data-filter="FUNDED" class="filter-btn bg-black text-white font-bold text-xs uppercase px-3 py-1 border border-transparent hover:bg-white hover:text-black transition-colors">FUNDED</button>
                            </div>
                        </div>

                        <!-- LEDGER TABLE CONTAINER -->
                        <div class="overflow-x-auto border-4 border-white bg-zinc-950">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-white text-black font-black uppercase text-xs tracking-wider border-b-4 border-white">
                                        <th class="p-3 border-r-2 border-black">COMPANY</th>
                                        <th class="p-3 border-r-2 border-black">TARGET ID</th>
                                        <th class="p-3 border-r-2 border-black">CAPITAL</th>
                                        <th class="p-3 border-r-2 border-black">STATUS</th>
                                        <th class="p-3 text-center">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody id="leads-table-body" class="divide-y-2 divide-zinc-800">
                                    <!-- Dynamic rows loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Ledger Status Footer Legend -->
                    <div class="mt-6 pt-4 border-t-2 border-zinc-800 flex flex-wrap justify-between items-center text-xs font-mono text-zinc-500 gap-4">
                        <span>TOTAL TRACKED: <span id="ledger-count-total" class="text-[#ff4800] font-black">0</span></span>
                        <div class="flex gap-4">
                            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-yellow-300 border border-black inline-block"></span> VERIFYING</span>
                            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-blue-400 border border-black inline-block"></span> UNDERWRITING</span>
                            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-[#00ff66] border border-black inline-block"></span> FUNDED</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Multi-step buttons
        document.getElementById("btn-form-prev").addEventListener("click", () => this.navigateForm(-1));
        document.getElementById("btn-form-next").addEventListener("click", () => this.navigateForm(1));

        // Form Inputs Sync to Temporary State
        const fields = ["company", "contact", "email", "phone", "revenue", "fundingNeeded", "useOfFunds", "notes"];
        fields.forEach(field => {
            const el = document.getElementById(`input-${field}`);
            if (el) {
                el.addEventListener("input", (e) => {
                    this.formData[field] = e.target.value;
                });
            }
        });

        // Filter button binds
        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                filterBtns.forEach(b => {
                    b.className = "filter-btn bg-black text-white font-bold text-xs uppercase px-3 py-1 border border-transparent hover:bg-white hover:text-black transition-colors";
                });
                e.target.className = "filter-btn bg-[#ff4800] text-black font-bold text-xs uppercase px-3 py-1 border border-black hover:bg-white transition-colors";
                this.filterStatus = e.target.getAttribute("data-filter");
                this.renderLeadsTable();
            });
        });
    }

    navigateForm(direction) {
        // Basic validation for current steps before moving forward
        if (direction === 1) {
            if (this.currentStep === 1) {
                if (!this.formData.company || !this.formData.revenue || !this.formData.contact) {
                    alert("CRITICAL REQUIREMENT MISSING: Complete all Step 1 profile parameters.");
                    return;
                }
            } else if (this.currentStep === 2) {
                if (!this.formData.fundingNeeded || !this.formData.useOfFunds) {
                    alert("CRITICAL REQUIREMENT MISSING: Input required capital metrics.");
                    return;
                }
            } else if (this.currentStep === 3) {
                // Submit target action
                if (!this.formData.email) {
                    alert("CRITICAL REQUIREMENT MISSING: Valid contact email needed for execution.");
                    return;
                }
                this.submitNewLead();
                return;
            }
        }

        this.currentStep += direction;
        this.updateFormUI();
    }

    updateFormUI() {
        // Toggle Step Panels
        document.querySelectorAll(".form-step-panel").forEach((panel, i) => {
            if (i + 1 === this.currentStep) {
                panel.classList.remove("hidden");
            } else {
                panel.classList.add("hidden");
            }
        });

        // Toggle Step Indicators
        for (let i = 1; i <= 3; i++) {
            const ind = document.getElementById(`step-indicator-${i}`);
            if (i === this.currentStep) {
                ind.className = "text-center py-2 font-black text-xs uppercase border-2 bg-[#ff4800] text-black border-white";
            } else if (i < this.currentStep) {
                ind.className = "text-center py-2 font-black text-xs uppercase border-2 bg-zinc-900 text-zinc-500 border-zinc-800 line-through";
            } else {
                ind.className = "text-center py-2 font-black text-xs uppercase border-2 bg-black text-zinc-600 border-zinc-800";
            }
        }

        // Handle button labels and states
        const prevBtn = document.getElementById("btn-form-prev");
        const nextBtn = document.getElementById("btn-form-next");

        if (this.currentStep === 1) {
            prevBtn.disabled = true;
            nextBtn.innerHTML = "NEXT PHASE →";
        } else if (this.currentStep === 2) {
            prevBtn.disabled = false;
            nextBtn.innerHTML = "NEXT PHASE →";
        } else if (this.currentStep === 3) {
            prevBtn.disabled = false;
            nextBtn.innerHTML = "LAUNCH OPPORTUNITY 📡";
            nextBtn.className = "bg-[#00ff66] text-black font-black px-6 py-3 uppercase border-4 border-white shadow-[4px_4px_0px_#ffffff] hover:bg-white active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-sm tracking-widest flex-grow text-center justify-center flex items-center";
            return;
        }

        nextBtn.className = "bg-[#ff4800] text-black font-black px-6 py-3 uppercase border-4 border-white shadow-[4px_4px_0px_#ffffff] hover:bg-white active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-sm tracking-widest flex-grow text-center justify-center flex items-center";
    }

    submitNewLead() {
        const idNum = Math.floor(1000 + Math.random() * 9000);
        const newLead = {
            id: `MS-${idNum}`,
            company: this.formData.company.toUpperCase(),
            contact: this.formData.contact.toUpperCase(),
            email: this.formData.email.toUpperCase(),
            phone: this.formData.phone || "N/A",
            revenue: this.formData.revenue.toUpperCase(),
            fundingNeeded: Number(this.formData.fundingNeeded),
            status: "VERIFYING",
            submittedAt: new Date().toISOString().slice(0, 19).replace('T', ' ').substring(0, 16),
            useOfFunds: this.formData.useOfFunds.toUpperCase(),
            notes: this.formData.notes ? this.formData.notes.toUpperCase() : "NO ADDITIONAL INTEL GIVEN.",
            history: [
                { date: new Date().toISOString().slice(0, 19).replace('T', ' ').substring(0, 16), msg: "Initial intake completed. Routing system locked." }
            ]
        };

        // Prepend new lead
        this.leads.unshift(newLead);
        this.saveLeads();

        // Trigger dynamic terminal messages if parent terminal exists
        if (typeof window.triggerTerminalOnStep === 'function') {
            window.triggerTerminalOnStep(3);
        } else {
            console.log(`SYSTEM EVENT: New opportunity ${newLead.id} initialized.`);
        }

        // Reset Form
        this.formData = { company: "", contact: "", email: "", phone: "", revenue: "", fundingNeeded: "", useOfFunds: "", notes: "" };
        const fields = ["company", "contact", "email", "phone", "revenue", "fundingNeeded", "useOfFunds", "notes"];
        fields.forEach(field => {
            const el = document.getElementById(`input-${field}`);
            if (el) el.value = "";
        });

        this.currentStep = 1;
        this.updateFormUI();
        this.renderLeadsTable();

        alert(`OPPORTUNITY LOCKED: ${newLead.id} registered into ledger!`);
    }

    renderLeadsTable() {
        const tbody = document.getElementById("leads-table-body");
        if (!tbody) return;

        tbody.innerHTML = "";
        
        const filtered = this.leads.filter(lead => {
            if (this.filterStatus === "ALL") return true;
            return lead.status === this.filterStatus;
        });

        document.getElementById("ledger-count-total").innerText = this.leads.length;

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="p-8 text-center text-zinc-500 font-mono uppercase text-xs tracking-wider">
                        // NO CORRESPONDING LEADS REGISTERED IN THIS SECTOR
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach(lead => {
            const isExpanded = this.expandedLeadId === lead.id;
            
            // Generate status badge color
            let badgeClass = "bg-yellow-300 text-black border-2 border-black font-black text-xs px-2 py-0.5 inline-block";
            if (lead.status === "UNDERWRITING") {
                badgeClass = "bg-blue-400 text-black border-2 border-black font-black text-xs px-2 py-0.5 inline-block";
            } else if (lead.status === "FUNDED") {
                badgeClass = "bg-[#00ff66] text-black border-2 border-black font-black text-xs px-2 py-0.5 inline-block";
            }

            // Main Row
            const row = document.createElement("tr");
            row.className = "hover:bg-zinc-900 transition-colors cursor-pointer";
            row.innerHTML = `
                <td class="p-3 font-bold border-r-2 border-zinc-800 uppercase text-sm">${lead.company}</td>
                <td class="p-3 font-mono text-zinc-400 border-r-2 border-zinc-800 text-xs">${lead.id}</td>
                <td class="p-3 font-black border-r-2 border-zinc-800 text-xs">$${lead.fundingNeeded.toLocaleString()}</td>
                <td class="p-3 border-r-2 border-zinc-800"><span class="${badgeClass}">${lead.status}</span></td>
                <td class="p-3 text-center">
                    <button class="toggle-drawer-btn bg-white hover:bg-[#ff4800] text-black font-black px-3 py-1 text-xs border-2 border-black transition-colors" data-id="${lead.id}">
                        ${isExpanded ? "HIDE" : "DRILL"}
                    </button>
                </td>
            `;

            // Row click event to expand
            row.addEventListener("click", (e) => {
                if (e.target.closest(".toggle-drawer-btn")) return; // prevent dual triggers
                this.toggleLeadDrawer(lead.id);
            });

            tbody.appendChild(row);

            // Expandable Drawer Row
            if (isExpanded) {
                const drawerRow = document.createElement("tr");
                drawerRow.className = "bg-zinc-950 text-white border-b-2 border-white";
                
                // History Items Generation
                const historyHtml = lead.history.map(item => `
                    <div class="border-l-2 border-[#ff4800] pl-3 py-1">
                        <span class="text-[10px] font-mono text-zinc-500">${item.date}</span>
                        <p class="text-xs uppercase font-mono text-zinc-300">${item.msg}</p>
                    </div>
                `).join("");

                drawerRow.innerHTML = `
                    <td colspan="5" class="p-6 border-t-2 border-white">
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            <!-- Left: Lead parameters -->
                            <div class="lg:col-span-4 space-y-3 bg-black p-4 border-2 border-white">
                                <h5 class="text-[#ff4800] font-black text-xs uppercase tracking-wider">// OPPORTUNITY DOSSIER</h5>
                                <div class="text-xs space-y-1 font-mono">
                                    <p><span class="text-zinc-500">CONTACT:</span> ${lead.contact}</p>
                                    <p><span class="text-zinc-500">EMAIL:</span> ${lead.email}</p>
                                    <p><span class="text-zinc-500">PHONE:</span> ${lead.phone}</p>
                                    <p><span class="text-zinc-500">EST_REVENUE:</span> ${lead.revenue}</p>
                                    <p><span class="text-zinc-500">USE_OF_CAPITAL:</span> ${lead.useOfFunds}</p>
                                    <p><span class="text-zinc-500">SUBMITTED:</span> ${lead.submittedAt}</p>
                                </div>
                            </div>

                            <!-- Middle: Custom notes & action parameters -->
                            <div class="lg:col-span-4 space-y-3 flex flex-col justify-between">
                                <div>
                                    <h5 class="text-white font-black text-xs uppercase tracking-wider">// AFFILIATE INTEL NOTES</h5>
                                    <p class="text-xs text-zinc-400 font-mono mt-1 uppercase leading-relaxed bg-black p-3 border border-zinc-800">
                                        ${lead.notes}
                                    </p>
                                </div>
                                
                                <!-- Form to add a quick note directly into history -->
                                <div class="flex gap-2">
                                    <input type="text" id="new-note-input-${lead.id}" placeholder="APPEND INTEL..." class="bg-black text-white font-mono text-xs uppercase p-2 border-2 border-white focus:outline-none focus:border-[#ff4800] flex-grow placeholder-zinc-800">
                                    <button class="add-note-btn bg-[#ff4800] text-black font-black px-4 text-xs border-2 border-black hover:bg-white active:translate-y-0.5" data-id="${lead.id}">
                                        POST
                                    </button>
                                </div>
                            </div>

                            <!-- Right: Lead timeline history tracking -->
                            <div class="lg:col-span-4 space-y-3">
                                <h5 class="text-white font-black text-xs uppercase tracking-wider">// SECURE TRANSACTION TIMELINE</h5>
                                <div class="space-y-3 max-h-44 overflow-y-auto pr-2">
                                    ${historyHtml}
                                </div>
                            </div>

                        </div>
                    </td>
                `;
                tbody.appendChild(drawerRow);
            }
        });

        // Bind dynamic action buttons in table after rendering
        const toggleBtns = tbody.querySelectorAll(".toggle-drawer-btn");
        toggleBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const leadId = e.target.getAttribute("data-id");
                this.toggleLeadDrawer(leadId);
            });
        });

        const addNoteBtns = tbody.querySelectorAll(".add-note-btn");
        addNoteBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const leadId = e.target.getAttribute("data-id");
                this.addNoteToLead(leadId);
            });
        });
    }

    toggleLeadDrawer(leadId) {
        if (this.expandedLeadId === leadId) {
            this.expandedLeadId = null;
        } else {
            this.expandedLeadId = leadId;
        }
        this.renderLeadsTable();
    }

    addNoteToLead(leadId) {
        const input = document.getElementById(`new-note-input-${leadId}`);
        if (!input) return;

        const noteText = input.value.trim().toUpperCase();
        if (noteText === "") return;

        const lead = this.leads.find(l => l.id === leadId);
        if (lead) {
            const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ').substring(0, 16);
            lead.history.unshift({
                date: timestamp,
                msg: `PARTNER NOTE ADDED: ${noteText}`
            });
            this.saveLeads();
            this.renderLeadsTable();
        }
    }
}

// Global initialization bound directly to global window scope so affiliates can execute it on demand.
window.initMoonshineLeads = function (containerId) {
    return new MoonshineLeadsEngine(containerId);
};

// Auto-run if the default brutalist container exists in DOM
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("leads-submission-app")) {
        window.activeLeadsEngine = new MoonshineLeadsEngine("leads-submission-app");
    }
});