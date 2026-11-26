(function () {
    // 1. DEFAULT PARTNER CONFIGURATION (Fallback if window.partnerConfig is not defined)
    const defaultConfig = {
        slug: "darwin-hanneman",
        name: "Darwin Hanneman",
        title: "Enterprise Funding Specialist",
        badge: "Verified Elite Underwriter",
        avatarText: "DH",
        avatarColor: "#39FF14", // Electric Green
        accentColor: "#39FF14", 
        secondaryAccent: "#2979FF", // Cobalt Blue
        status: "Active & Accepting Intake",
        bio: "Darwin specializes in high-velocity cash flow mapping, revenue-based financing, and custom working capital desks. Backed directly by Moonshine Capital backend liquidity, Darwin empowers mid-market operators to unlock capital desks up to $5M+ with zero procedural friction.",
        market: "National Enterprise, Retail & High-Growth Contractors",
        maxLimit: "$5,000,000",
        phone: "+1 (800) 555-0192",
        email: "d.hanneman@moonshinecapital.com",
        location: "New York Metro / Remote",
        applyUrl: "https://apply.moonshinecapital.com/?aff=darwin-hanneman",
        specialties: [
            {
                name: "Revenue-Based Financing",
                desc: "Flexible repayment mapped directly to your daily/weekly merchant card sales.",
                limit: "Up to $2.5M",
                timeframe: "24-48 Hours"
            },
            {
                name: "Contractor Cash Flow Desk",
                desc: "Bridge mobilization costs, pay materials suppliers, and balance seasonal backlogs.",
                limit: "Up to $1.5M",
                timeframe: "3-5 Days"
            },
            {
                name: "SBA & Bridge Capital",
                desc: "Long-term amortizing expansion capital underwritten with premium direct routing.",
                limit: "Up to $5.0M",
                timeframe: "14-30 Days"
            }
        ],
        checklists: {
            "rbf": [
                { id: "r1", label: "4 Months Business Bank Statements", required: true, desc: "PDF downloads, all pages required" },
                { id: "r2", label: "Merchant Processing Statements", required: false, desc: "Last 3 months of CC processing reports" },
                { id: "r3", label: "Signed Application Form", required: true, desc: "Digital signature via direct portal link" },
                { id: "r4", label: "Drivers License / ID Copy", required: true, desc: "Color scan of front & back" }
            ],
            "contractor": [
                { id: "c1", label: "6 Months Business Bank Statements", required: true, desc: "Demonstrating baseline monthly deposits" },
                { id: "c2", label: "Active Project Contracts / Backlog", required: true, desc: "Fully executed commercial contracts" },
                { id: "c3", label: "Recent Year-End P&L Sheet", required: false, desc: "Internal accounting or tax-prepared copy" },
                { id: "c4", label: "W9 & Corporate Registration", required: true, desc: "Active business status proof" }
            ],
            "sba": [
                { id: "s1", label: "3 Years Federal Corporate Tax Returns", required: true, desc: "Including all schedules & attachments" },
                { id: "s2", label: "Personal Financial Statement (SBA Form 413)", required: true, desc: "For all owners with >20% equity" },
                { id: "s3", label: "Year-To-Date Balance Sheet & P&L", required: true, desc: "Generated within the last 30 days" },
                { id: "s4", label: "Business Debt Schedule", required: true, desc: "Itemizing all active liabilities & payments" }
            ]
        }
    };

    // Use global config if defined, otherwise use default
    const config = window.partnerConfig || defaultConfig;

    // 2. INJECT CSS STYLES & FONTS DYNAMICALLY
    function injectStylesAndFonts() {
        // Space Grotesk and Inter fonts
        if (!document.getElementById('moonshine-fonts')) {
            const fontLink = document.createElement('link');
            fontLink.id = 'moonshine-fonts';
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';
            document.head.appendChild(fontLink);
        }

        // Custom Utility Styles Matching Base Component
        if (!document.getElementById('moonshine-profile-styles')) {
            const style = document.createElement('style');
            style.id = 'moonshine-profile-styles';
            style.textContent = `
                .profile-glass {
                    background: rgba(18, 18, 20, 0.75);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }
                .profile-glass-hover:hover {
                    border-color: ${config.accentColor};
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.12);
                    transform: translateY(-2px);
                }
                .glow-accent {
                    box-shadow: 0px 0px 20px 0px rgba(57, 255, 20, 0.3);
                }
                .brutal-shadow {
                    border: 2px solid #000;
                    box-shadow: 3px 3px 0px #000;
                }
                .text-glow {
                    text-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
                }
                .bg-grid {
                    background-size: 40px 40px;
                    background-image: 
                        linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 3. MAIN UI GENERATOR TEMPLATE
    function generateUI() {
        const root = document.getElementById('partner-profile-root') || document.body;
        
        // Construct the full page structure visually congruent to the base design
        const html = `
        <div class="min-h-screen bg-[#0B0B0C] text-[#F5F5F7] font-sans antialiased bg-grid pb-20 selection:bg-[${config.accentColor}] selection:text-[#0B0B0C]">
            
            <!-- STICKY CONTEXT HEADER -->
            <header class="sticky top-0 z-50 w-full profile-glass border-b border-white/5 transition-all duration-300">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <!-- Anchor and Brand Info -->
                    <div class="flex items-center gap-3">
                        <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF5722] via-[#0B0B0C] to-[${config.accentColor}] p-[1px]">
                            <div class="w-full h-full bg-[#0B0B0C] rounded-lg flex items-center justify-center font-display font-black text-[10px] text-[${config.accentColor}]">
                                M
                            </div>
                        </div>
                        <div>
                            <span class="font-display font-bold text-xs uppercase tracking-tight block">MOONSHINE CAPITAL</span>
                            <span class="text-[8px] font-mono tracking-widest uppercase text-white/40 block -mt-1">Verified Partner Portal</span>
                        </div>
                    </div>
                    
                    <!-- Direct Action Matrix Links -->
                    <div class="flex items-center gap-3">
                        <span class="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono bg-[rgba(57,255,20,0.1)] text-[${config.accentColor}] border border-[rgba(57,255,20,0.2)]">
                            <span class="w-1.5 h-1.5 rounded-full bg-[${config.accentColor}] animate-pulse"></span>
                            ${config.status}
                        </span>
                        <a href="#intake" class="bg-[${config.accentColor}] hover:bg-white text-[#0B0B0C] font-display font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded transition-all duration-300 shadow-lg shadow-[${config.accentColor}]/10">
                            Apply Direct
                        </a>
                    </div>
                </div>
            </header>

            <!-- PROFILE HERO SEGMENT -->
            <section class="relative pt-12 pb-16 overflow-hidden">
                <!-- Radial Glow Backdrop -->
                <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-[${config.secondaryAccent}]/5 to-[${config.accentColor}]/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        <!-- Bio & Brand Desk -->
                        <div class="lg:col-span-7 space-y-6">
                            <!-- Badge and Verified Matrix -->
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="bg-[${config.accentColor}]/10 text-[${config.accentColor}] border border-[${config.accentColor}]/20 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded">
                                    ${config.badge}
                                </span>
                                <span class="bg-white/5 text-white/60 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded border border-white/5">
                                    ID Code: MS-${config.slug.toUpperCase()}
                                </span>
                            </div>

                            <div class="space-y-3">
                                <h1 class="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight text-white">
                                    The Funding Desk of <br class="hidden sm:inline" />
                                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">${config.name}</span>
                                </h1>
                                <p class="text-[11px] font-mono text-[#FF5722] uppercase tracking-wider">${config.title}</p>
                            </div>

                            <p class="text-white/70 text-sm leading-relaxed max-w-xl font-light">
                                ${config.bio}
                            </p>

                            <!-- Mini Metadata Checklist -->
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-[10px]">
                                <div class="p-3 rounded bg-white/5 border border-white/5">
                                    <span class="block text-white/40 uppercase mb-1">Target Niche</span>
                                    <span class="text-white font-semibold">${config.market}</span>
                                </div>
                                <div class="p-3 rounded bg-white/5 border border-white/5">
                                    <span class="block text-white/40 uppercase mb-1">Max desk limit</span>
                                    <span class="text-[${config.accentColor}] font-bold text-xs">${config.maxLimit}</span>
                                </div>
                                <div class="p-3 rounded bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
                                    <span class="block text-white/40 uppercase mb-1">Operational Area</span>
                                    <span class="text-white font-semibold">${config.location}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Mini Scorecard / Hero Visual Widget -->
                        <div class="lg:col-span-5">
                            <div class="profile-glass rounded-xl p-6 border border-white/5 shadow-2xl relative overflow-hidden space-y-4">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-display font-bold text-lg text-[${config.accentColor}] shadow-inner">
                                        ${config.avatarText}
                                    </div>
                                    <div>
                                        <h4 class="font-display font-bold text-sm text-white">${config.name}</h4>
                                        <p class="text-[10px] font-mono text-white/40">Secure Verification Hub</p>
                                    </div>
                                </div>

                                <div class="border-t border-white/5 pt-4 space-y-3 font-mono text-[11px]">
                                    <div class="flex justify-between">
                                        <span class="text-white/40">Email:</span>
                                        <a href="mailto:${config.email}" class="text-[${config.accentColor}] hover:underline text-right">${config.email}</a>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-white/40">Secured Line:</span>
                                        <span class="text-white text-right">${config.phone}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-white/40">Tracking Status:</span>
                                        <span class="bg-[#2979FF]/15 text-[#2979FF] border border-[#2979FF]/30 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded">
                                            Vercel Ready
                                        </span>
                                    </div>
                                </div>

                                <div class="pt-2">
                                    <button onclick="document.getElementById('intake').scrollIntoView({behavior: 'smooth'})" class="w-full bg-[${config.accentColor}] hover:bg-white text-[#0B0B0C] py-2.5 rounded text-[11px] font-display font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2">
                                        <span>Initialize Onboarding</span>
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <!-- DYNAMIC HUB SECTIONS -->
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- LEFT PANELS (SPECIALTIES, CALCULATOR, SECURE INTAKE) -->
                <div class="lg:col-span-7 space-y-8">
                    
                    <!-- Funding Specialty Desk Details -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-2">
                            <span class="text-[#FF5722] font-mono text-xs font-bold">// DESK CAPABILITIES</span>
                            <h2 class="font-display font-bold text-lg uppercase tracking-wider text-white">Underwritten Specializations</h2>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${config.specialties.map(spec => `
                                <div class="profile-glass p-5 rounded-lg border border-white/5 flex flex-col justify-between space-y-4">
                                    <div class="space-y-2">
                                        <div class="flex justify-between items-start">
                                            <h4 class="font-display font-bold text-white text-xs tracking-wide uppercase">${spec.name}</h4>
                                            <span class="bg-white/5 text-white/50 font-mono text-[8px] uppercase px-1.5 py-0.5 rounded border border-white/5">${spec.timeframe}</span>
                                        </div>
                                        <p class="text-[11px] text-white/60 leading-relaxed font-light">${spec.desc}</p>
                                    </div>
                                    <div class="flex justify-between items-baseline pt-2 border-t border-white/5">
                                        <span class="text-[9px] font-mono text-white/30">CAP LIMIT</span>
                                        <span class="text-[${config.accentColor}] font-mono font-bold text-xs">${spec.limit}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- INTERACTIVE PRE-QUAL SCORECARD WIDGET -->
                    <div class="profile-glass p-6 rounded-lg border border-white/5 space-y-4 relative overflow-hidden" id="readiness-calculator">
                        <!-- Top status visual -->
                        <div class="flex justify-between items-center border-b border-white/5 pb-3">
                            <div>
                                <span class="text-[${config.secondaryAccent}] font-mono text-[9px] uppercase tracking-widest block">// COMPLIANCE CALCULATOR</span>
                                <h3 class="font-display font-bold text-sm text-white uppercase tracking-wider">Dynamic Pre-Qualifier Matrix</h3>
                            </div>
                            <span class="text-[9px] font-mono bg-white/5 text-white/50 px-2 py-1 rounded">V2.1 Router Logic</span>
                        </div>

                        <!-- Scorecard Inputs -->
                        <div class="space-y-3 pt-2">
                            <!-- Monthly Sales -->
                            <div class="space-y-1.5">
                                <label class="flex justify-between text-[10px] font-mono text-white/60">
                                    <span>Average Monthly Gross Deposits</span>
                                    <span id="val-rev" class="text-[${config.accentColor}] font-bold">$45,000</span>
                                </label>
                                <input type="range" id="input-rev" min="5000" max="250000" step="5000" value="45000" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[${config.accentColor}]">
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <!-- Credit Score -->
                                <div class="space-y-1.5">
                                    <label class="block text-[10px] font-mono text-white/60">Average Credit Score</label>
                                    <select id="input-credit" class="w-full bg-[#1E1E24]/60 border border-white/10 focus:border-[${config.accentColor}] text-white px-3 py-2 text-[11px] font-mono rounded">
                                        <option value="high">700+ (Excellent)</option>
                                        <option value="mid" selected>620 - 699 (Fair / Good)</option>
                                        <option value="low">500 - 619 (Needs MCA Route)</option>
                                        <option value="under500">&lt; 500 (Credit Prep Desk)</option>
                                    </select>
                                </div>
                                <!-- Time in Business -->
                                <div class="space-y-1.5">
                                    <label class="block text-[10px] font-mono text-white/60">Years in Operation</label>
                                    <select id="input-time" class="w-full bg-[#1E1E24]/60 border border-white/10 focus:border-[${config.accentColor}] text-white px-3 py-2 text-[11px] font-mono rounded">
                                        <option value="old">2+ Years</option>
                                        <option value="mid" selected>1 - 2 Years</option>
                                        <option value="young">6 - 12 Months</option>
                                        <option value="startup">&lt; 6 Months (Startup Desk)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Calculated Results Output Area -->
                        <div class="bg-[#0B0B0C] p-4 rounded-lg border border-white/5 space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] font-mono text-white/40">SYSTEM APPROVAL PROBABILITY:</span>
                                <span id="score-text" class="text-xs font-mono font-bold text-[${config.accentColor}] tracking-widest uppercase">78% - HIGH MATCH</span>
                            </div>
                            
                            <!-- Dynamic Probability Bar -->
                            <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div id="score-bar" class="h-full bg-[${config.accentColor}] transition-all duration-300" style="width: 78%"></div>
                            </div>

                            <p id="calculator-recommendation" class="text-[10px] text-white/50 leading-relaxed font-mono">
                                Ideal fit discovered for <span class="text-white font-semibold">Revenue-Based Financing Route</span>. We require 4 months of corporate bank statements.
                            </p>
                        </div>
                    </div>

                    <!-- SECURE lead intake client-side routing FORM -->
                    <div class="profile-glass p-6 rounded-lg border border-white/5 space-y-4" id="intake">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-[${config.accentColor}] animate-pulse"></span>
                            <h3 class="font-display font-bold text-sm text-white uppercase tracking-wider">Start Private Desk Onboarding</h3>
                        </div>
                        <p class="text-[11px] text-white/50 font-light">
                            Fill out the basic corporate facts below to register your submission. Submissions routed here track immediately under tracking node <code class="bg-white/5 px-1 rounded text-[10px] text-[#2979FF]">${config.slug}</code>.
                        </p>

                        <form id="profile-intake-form" class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="block text-[10px] font-mono text-white/50">LEGAL ENTITY NAME</label>
                                    <input required type="text" id="intake-company" placeholder="e.g. Acme Contracting LLC" class="w-full bg-[#1E1E24]/60 border border-white/10 focus:border-[${config.accentColor}] focus:ring-1 focus:ring-[${config.accentColor}] text-white px-3 py-2 text-xs rounded transition-all duration-200">
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-[10px] font-mono text-white/50">CONTACT EXECUTIVE NAME</label>
                                    <input required type="text" id="intake-name" placeholder="e.g. Jane Doe" class="w-full bg-[#1E1E24]/60 border border-white/10 focus:border-[${config.accentColor}] focus:ring-1 focus:ring-[${config.accentColor}] text-white px-3 py-2 text-xs rounded transition-all duration-200">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="block text-[10px] font-mono text-white/50">DIRECT SECURE EMAIL</label>
                                    <input required type="email" id="intake-email" placeholder="jane@company.com" class="w-full bg-[#1E1E24]/60 border border-white/10 focus:border-[${config.accentColor}] focus:ring-1 focus:ring-[${config.accentColor}] text-white px-3 py-2 text-xs rounded transition-all duration-200">
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-[10px] font-mono text-white/50">MOBILE PHONE (LEAD LOGS)</label>
                                    <input required type="tel" id="intake-phone" placeholder="(555) 000-0000" class="w-full bg-[#1E1E24]/60 border border-white/10 focus:border-[${config.accentColor}] focus:ring-1 focus:ring-[${config.accentColor}] text-white px-3 py-2 text-xs rounded transition-all duration-200">
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label class="block text-[10px] font-mono text-white/50">BRIEF EXPLANATION OF FUNDING DESIRE / MONTHLY RUNS</label>
                                <textarea id="intake-notes" rows="2" placeholder="Describe current active projects, contracts, or cash flow demands..." class="w-full bg-[#1E1E24]/60 border border-white/10 focus:border-[${config.accentColor}] focus:ring-1 focus:ring-[${config.accentColor}] text-white px-3 py-2 text-xs rounded transition-all duration-200"></textarea>
                            </div>

                            <!-- Interactive Agreement Checkbox -->
                            <label class="flex items-start gap-2.5 cursor-pointer group">
                                <input required type="checkbox" class="mt-1 rounded bg-[#1E1E24] border-white/10 text-[${config.accentColor}] focus:ring-0">
                                <span class="text-[9px] text-white/40 leading-relaxed font-mono select-none group-hover:text-white/60 transition-colors">
                                    I authorize underwriter ${config.name} to establish a secure file profile in the Moonshine Capital client system.
                                </span>
                            </label>

                            <!-- Submit Action -->
                            <button type="submit" class="w-full bg-white hover:bg-[${config.accentColor}] text-[#0B0B0C] py-3 rounded text-xs font-display font-extrabold uppercase tracking-widest transition-all duration-300">
                                Submit lead desk package
                            </button>
                        </form>

                        <!-- Form Submission Success Overlay / Message -->
                        <div id="intake-success" class="hidden bg-[#000] border-2 border-[${config.accentColor}] p-6 rounded-lg text-center space-y-4 glow-accent">
                            <span class="text-3xl">🚀</span>
                            <h4 class="font-display font-black text-white text-lg uppercase">System Intake Registration Initialized!</h4>
                            <p class="text-xs text-white/70 max-w-md mx-auto">
                                Lead package successfully compiled & mapped under desk reference ID: <span class="text-[${config.accentColor}] font-mono font-bold">${config.slug.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}</span>. A secure document ingestion line will be text and emailed shortly.
                            </p>
                            <button onclick="document.getElementById('intake-success').classList.add('hidden'); document.getElementById('profile-intake-form').classList.remove('hidden');" class="bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded">
                                Register Another Desk Lead
                            </button>
                        </div>
                    </div>

                </div>

                <!-- RIGHT PANELS (DYNAMIC CHECKLISTS, BOOKING SYSTEM, UTILITY TOOLS) -->
                <div class="lg:col-span-5 space-y-8">
                    
                    <!-- DYNAMIC DOCUMENT REQUIREMENTS SELECTOR -->
                    <div class="profile-glass p-6 rounded-lg border border-white/5 space-y-4">
                        <div class="border-b border-white/5 pb-3">
                            <span class="text-[#FF5722] font-mono text-[9px] uppercase tracking-widest block">// UNDERWRITER LIST</span>
                            <h3 class="font-display font-bold text-sm text-white uppercase tracking-wider">Required Document Desks</h3>
                        </div>

                        <!-- Selector Tab Buttons -->
                        <div class="grid grid-cols-3 gap-1 font-mono text-[9px]">
                            <button data-chk="rbf" class="chk-tab-btn active bg-[${config.accentColor}] text-[#0B0B0C] font-semibold py-1.5 rounded transition-all duration-150">RBF Desk</button>
                            <button data-chk="contractor" class="chk-tab-btn bg-white/5 hover:bg-white/10 text-white py-1.5 rounded transition-all duration-150">Contractor</button>
                            <button data-chk="sba" class="chk-tab-btn bg-white/5 hover:bg-white/10 text-white py-1.5 rounded transition-all duration-150">SBA Desk</button>
                        </div>

                        <!-- Interactive Requirement Checklist Wrapper -->
                        <div id="checklist-container" class="space-y-3 pt-2">
                            <!-- Checklist items get injected here dynamically -->
                        </div>

                        <!-- Dynamic Progress State of Preparation -->
                        <div class="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                            <span class="text-white/40">Preparation completeness:</span>
                            <span id="chk-progress" class="text-[${config.accentColor}] font-bold">0 / 4 Prepared</span>
                        </div>
                    </div>

                    <!-- INTERACTIVE CALENDAR BOOKING SYSTEM -->
                    <div class="profile-glass p-6 rounded-lg border border-white/5 space-y-4" id="calendar-widget">
                        <div class="border-b border-white/5 pb-3">
                            <span class="text-[${config.secondaryAccent}] font-mono text-[9px] uppercase tracking-widest block">// APPOINTMENT DESK</span>
                            <h3 class="font-display font-bold text-sm text-white uppercase tracking-wider">Book Strategy Desk Call</h3>
                        </div>
                        <p class="text-[11px] text-white/50 leading-relaxed font-light">
                            Select an upcoming dispatch slot to reserve a dedicated strategy and capability review mapping with ${config.name}.
                        </p>

                        <!-- Fast Date Picker Visual -->
                        <div class="grid grid-cols-4 gap-2 font-mono text-[9px] text-center" id="calendar-dates">
                            <!-- Dates will be populated dynamically -->
                        </div>

                        <!-- Dynamic Time Slots Container -->
                        <div class="space-y-1.5" id="calendar-slots-wrapper">
                            <span class="block text-[9px] font-mono text-white/40">AVAILABLE SLOTS:</span>
                            <div class="grid grid-cols-3 gap-1.5 font-mono text-[10px]" id="calendar-slots">
                                <!-- Slots populated dynamically -->
                            </div>
                        </div>

                        <!-- Mini Booking Confirm Area -->
                        <div id="booking-form-area" class="hidden p-3 bg-white/5 rounded border border-white/10 space-y-2">
                            <span class="block text-[9px] font-mono text-[${config.accentColor}] uppercase">// CONFIRM APPOINTMENT</span>
                            <p id="booking-details-text" class="text-[10px] text-white/70 font-mono"></p>
                            <input type="text" id="booking-client-name" placeholder="Contact Representative Name" class="w-full bg-[#0B0B0C] border border-white/10 focus:border-[${config.accentColor}] text-white text-[11px] px-2 py-1.5 rounded font-mono">
                            <button id="confirm-booking-btn" class="w-full bg-[${config.accentColor}] hover:bg-white text-[#0B0B0C] font-mono font-bold text-[10px] py-2 rounded uppercase tracking-wider transition-colors">
                                Schedule Strategy Call
                            </button>
                        </div>

                        <!-- Booking Success -->
                        <div id="booking-success" class="hidden p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-lg text-center space-y-2">
                            <span class="text-xs">📅</span>
                            <p class="font-mono font-bold text-xs text-white uppercase">Appointment Confirmed!</p>
                            <p class="text-[10px] text-white/60 font-mono">Calendar link and connection details dispatched to security files.</p>
                        </div>
                    </div>

                    <!-- REVENUE DESK UTILITY FOR ADVISORS -->
                    <div class="profile-glass p-6 rounded-lg border border-white/5 space-y-3">
                        <span class="text-white/40 font-mono text-[9px] uppercase tracking-widest block">// SUB-AFFILIATE LINK BUILDER</span>
                        <h4 class="font-display font-bold text-white text-xs uppercase tracking-wider">Secondary Referral Engine</h4>
                        <p class="text-[10px] text-white/50 leading-relaxed font-mono">
                            CPAs, coaches, and strategic operators can embed this desk link with custom sub-tracking codes to route client leads directly through ${config.name}'s underwriting file.
                        </p>
                        <div class="space-y-2 pt-1 font-mono text-[10px]">
                            <div class="flex gap-2">
                                <input type="text" id="sub-id-input" placeholder="e.g. cpa-chicago" class="w-full bg-[#1E1E24]/60 border border-white/10 focus:border-[${config.accentColor}] text-white text-[11px] px-2.5 py-1.5 rounded">
                                <button onclick="window.buildSubLink()" class="bg-white/10 hover:bg-white text-white hover:text-[#0B0B0C] px-3 rounded uppercase text-[9px] font-bold tracking-widest transition-colors">
                                    Build
                                </button>
                            </div>
                            <div id="sub-link-output-wrapper" class="hidden p-2.5 bg-[#0B0B0C] rounded border border-white/5 text-[10px] overflow-x-auto text-[${config.accentColor}] flex justify-between items-center">
                                <span id="sub-link-text"></span>
                                <button onclick="window.copySubLink()" class="text-white hover:text-[${config.accentColor}] text-[9px] uppercase tracking-wider font-bold">Copy</button>
                            </div>
                        </div>
                    </div>

                </div>

            </section>

            <!-- LEGAL COMPLIANCE BLOCK -->
            <footer class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/5 text-center space-y-3">
                <p class="text-[9px] leading-relaxed text-white/30 font-mono max-w-4xl mx-auto">
                    COMPLIANCE UNDERWRITING NOTE: All application reviews, processing pipelines, and funding packages underwritten by ${config.name} are subject to full document authorization, verification checks, and final program approvals by Moonshine Capital risk parameters. Commissions are distributed directly to tracking nodes securely logged.
                </p>
                <p class="text-[9px] font-mono text-white/20">
                    © 2026 Moonshine Capital. Desk verification active. Vercel static asset node.
                </p>
            </footer>

        </div>
        `;

        root.innerHTML = html;
        attachInteractiveEngine();
    }

    // 4. ATTACH THE INTERACTIVE CALCULATION & ACTION ENGINE
    function attachInteractiveEngine() {
        
        // --- 4.1. Pre-Qualifier Scorecard Matrix Calculations ---
        const revInput = document.getElementById('input-rev');
        const revVal = document.getElementById('val-rev');
        const creditInput = document.getElementById('input-credit');
        const timeInput = document.getElementById('input-time');
        const scoreText = document.getElementById('score-text');
        const scoreBar = document.getElementById('score-bar');
        const calcRec = document.getElementById('calculator-recommendation');

        function runCalculation() {
            const revValue = parseInt(revInput.value);
            revVal.textContent = `$${revValue.toLocaleString()}`;

            let score = 50;

            // Revenue impact
            if (revValue > 150000) score += 25;
            else if (revValue > 80000) score += 18;
            else if (revValue > 40000) score += 12;
            else if (revValue > 15000) score += 5;
            else score -= 15;

            // Credit impact
            if (creditInput.value === 'high') score += 20;
            else if (creditInput.value === 'mid') score += 12;
            else if (creditInput.value === 'low') score += 5;
            else score -= 10;

            // Time impact
            if (timeInput.value === 'old') score += 15;
            else if (timeInput.value === 'mid') score += 10;
            else if (timeInput.value === 'young') score += 3;
            else score -= 15;

            // Boundaries
            score = Math.max(10, Math.min(99, score));

            // UI feedback classes
            scoreBar.style.width = `${score}%`;
            
            let resultText = "";
            let recText = "";

            if (score >= 80) {
                resultText = `${score}% - EXCELLENT APPLICANT MATCH`;
                scoreBar.className = `h-full bg-[${config.accentColor}] transition-all duration-300`;
                recText = `Outstanding profile alignment. System detects premier eligibility for <span class="text-white font-semibold">Asset-Backed Factoring</span> or <span class="text-white font-semibold">Premium RBF desk terms</span> up to $2M+ with accelerated deployment.`;
            } else if (score >= 60) {
                resultText = `${score}% - STRONG MATCH MATCH`;
                scoreBar.className = `h-full bg-blue-500 transition-all duration-300`;
                recText = `Solid profile alignment. Excellent fit discovered for <span class="text-white font-semibold">Revenue-Based Working Capital Route</span>. Fast tracking can proceed with standard bank statement packages.`;
            } else if (score >= 40) {
                resultText = `${score}% - ROUTE SPECIFIC MATCH`;
                scoreBar.className = `h-full bg-orange-500 transition-all duration-300`;
                recText = `Specialized profile alignment. Fit discovered for <span class="text-white font-semibold">Micro-Desk Financing</span>. Strong focus will be on operational deposit stability over historical credit depth.`;
            } else {
                resultText = `${score}% - SPECIALTY / CREDIT PREP DESK`;
                scoreBar.className = `h-full bg-red-600 transition-all duration-300`;
                recText = `Standard programs do not map perfectly. Strategic alignment directs this applicant profile to the <span class="text-white font-semibold">Business Credit & Readiness Optimization Desk</span> to construct eligibility.`;
            }

            scoreText.textContent = resultText;
            calcRec.innerHTML = recText;
        }

        if (revInput) {
            revInput.addEventListener('input', runCalculation);
            creditInput.addEventListener('change', runCalculation);
            timeInput.addEventListener('change', runCalculation);
            runCalculation(); // Run once initially
        }


        // --- 4.2. Dynamic Tabbed Requirement Checklist ---
        const tabBtns = document.querySelectorAll('.chk-tab-btn');
        const chkContainer = document.getElementById('checklist-container');
        const chkProgress = document.getElementById('chk-progress');

        function renderChecklist(type) {
            const list = config.checklists[type] || [];
            chkContainer.innerHTML = '';

            list.forEach(item => {
                const checked = localStorage.getItem(`chk_state_${config.slug}_${item.id}`) === 'true';
                const el = document.createElement('div');
                el.className = 'flex items-start gap-3 p-3 bg-white/5 rounded border border-white/5 hover:border-white/10 transition-colors';
                el.innerHTML = `
                    <input type="checkbox" id="chk-${item.id}" ${checked ? 'checked' : ''} class="mt-0.5 rounded bg-[#1E1E24] border-white/10 text-[${config.accentColor}] focus:ring-0 cursor-pointer">
                    <div class="space-y-0.5 flex-1 select-none">
                        <label for="chk-${item.id}" class="block text-xs font-semibold text-white cursor-pointer hover:text-[${config.accentColor}] transition-colors">
                            ${item.label}
                            ${item.required ? `<span class="text-red-500 text-[9px] font-mono ml-1 uppercase">[Req]</span>` : ''}
                        </label>
                        <p class="text-[10px] text-white/50 font-mono">${item.desc}</p>
                    </div>
                `;
                chkContainer.appendChild(el);

                // Listen to individual checks
                const checkbox = el.querySelector('input');
                checkbox.addEventListener('change', (e) => {
                    localStorage.setItem(`chk_state_${config.slug}_${item.id}`, e.target.checked);
                    updateChecklistProgress(type);
                });
            });

            updateChecklistProgress(type);
        }

        function updateChecklistProgress(type) {
            const list = config.checklists[type] || [];
            let checkedCount = 0;
            list.forEach(item => {
                if (localStorage.getItem(`chk_state_${config.slug}_${item.id}`) === 'true') {
                    checkedCount++;
                }
            });
            chkProgress.textContent = `${checkedCount} / ${list.length} Document${list.length !== 1 ? 's' : ''} Prepared`;
        }

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => {
                    b.classList.remove('active', `bg-[${config.accentColor}]`, 'text-[#0B0B0C]', 'font-semibold');
                    b.classList.add('bg-white/5', 'hover:bg-white/10', 'text-white');
                });
                btn.classList.add('active', `bg-[${config.accentColor}]`, 'text-[#0B0B0C]', 'font-semibold');
                btn.classList.remove('bg-white/5', 'hover:bg-white/10', 'text-white');

                const key = btn.getAttribute('data-chk');
                renderChecklist(key);
            });
        });

        // Initialize first tab
        if (tabBtns.length > 0) {
            renderChecklist('rbf');
        }


        // --- 4.3. Interactive Calendar Dispatch Scheduling Desk ---
        const datesWrapper = document.getElementById('calendar-dates');
        const slotsWrapper = document.getElementById('calendar-slots');
        const confirmArea = document.getElementById('booking-form-area');
        const confirmText = document.getElementById('booking-details-text');
        const bookingClientName = document.getElementById('booking-client-name');
        const confirmBtn = document.getElementById('confirm-booking-btn');
        const bookingSuccess = document.getElementById('booking-success');
        const slotsMainWrapper = document.getElementById('calendar-slots-wrapper');

        const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        let selectedDateStr = "";
        let selectedTimeStr = "";

        // Build upcoming 4 business days dynamically
        function setupCalendar() {
            datesWrapper.innerHTML = '';
            let count = 0;
            let currentOffset = 1;

            while (count < 4) {
                const d = new Date();
                d.setDate(d.getDate() + currentOffset);
                
                // Skip Sundays
                if (d.getDay() !== 0) {
                    const el = document.createElement('button');
                    el.className = 'p-2 rounded bg-white/5 hover:bg-white/10 text-white font-mono flex flex-col items-center transition-colors border border-white/5';
                    el.innerHTML = `
                        <span class="text-[8px] text-white/40 block">${weekdays[d.getDay()]}</span>
                        <span class="text-xs font-bold block">${d.getDate()}</span>
                        <span class="text-[8px] text-white/40 block">${months[d.getMonth()]}</span>
                    `;
                    
                    const dateFormatted = `${months[d.getMonth()]} ${d.getDate()}`;
                    el.addEventListener('click', () => {
                        // Toggle visual selected
                        Array.from(datesWrapper.children).forEach(child => {
                            child.classList.remove(`border-[${config.accentColor}]`, 'bg-white/10');
                        });
                        el.classList.add(`border-[${config.accentColor}]`, 'bg-white/10');
                        selectedDateStr = dateFormatted;
                        showTimeSlots(dateFormatted);
                    });

                    datesWrapper.appendChild(el);
                    count++;
                }
                currentOffset++;
            }
        }

        const timeslots = ['09:30 AM EST', '11:00 AM EST', '01:30 PM EST', '03:00 PM EST', '04:30 PM EST'];

        function showTimeSlots(dateStr) {
            slotsWrapper.innerHTML = '';
            slotsMainWrapper.classList.remove('hidden');
            confirmArea.classList.add('hidden');

            timeslots.forEach(time => {
                const el = document.createElement('button');
                el.className = 'py-1.5 rounded bg-white/5 hover:bg-white/10 text-white font-mono text-[9px] border border-white/5 transition-colors';
                el.textContent = time;
                el.addEventListener('click', () => {
                    Array.from(slotsWrapper.children).forEach(child => {
                        child.classList.remove(`border-[${config.accentColor}]`, 'bg-white/10');
                    });
                    el.classList.add(`border-[${config.accentColor}]`, 'bg-white/10');
                    selectedTimeStr = time;
                    initiateConfirmation();
                });
                slotsWrapper.appendChild(el);
            });
        }

        function initiateConfirmation() {
            confirmArea.classList.remove('hidden');
            confirmText.innerHTML = `Reserve Call for: <span class="text-white font-bold">${selectedDateStr} @ ${selectedTimeStr}</span> under ${config.name}'s Desk.`;
        }

        confirmBtn.addEventListener('click', () => {
            const clientName = bookingClientName.value.trim();
            if (!clientName) {
                alert('Please input a representative contact name.');
                return;
            }

            // Save to LocalStorage
            const bookingObj = {
                date: selectedDateStr,
                time: selectedTimeStr,
                advisor: config.name,
                client: clientName,
                bookedAt: new Date().toISOString()
            };
            localStorage.setItem(`active_booking_${config.slug}`, JSON.stringify(bookingObj));

            confirmArea.classList.add('hidden');
            slotsMainWrapper.classList.add('hidden');
            datesWrapper.classList.add('hidden');
            bookingSuccess.classList.remove('hidden');
        });

        setupCalendar();


        // --- 4.4. Lead Ingestion Intake Form Processing ---
        const intakeForm = document.getElementById('profile-intake-form');
        const intakeSuccess = document.getElementById('intake-success');

        intakeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const leadObj = {
                company: document.getElementById('intake-company').value,
                name: document.getElementById('intake-name').value,
                email: document.getElementById('intake-email').value,
                phone: document.getElementById('intake-phone').value,
                notes: document.getElementById('intake-notes').value,
                underwriter: config.slug,
                timestamp: new Date().toISOString()
            };

            // Save lead details securely in localStorage log database
            const localLeads = JSON.parse(localStorage.getItem(`desk_leads_${config.slug}`)) || [];
            localLeads.push(leadObj);
            localStorage.setItem(`desk_leads_${config.slug}`, JSON.stringify(localLeads));

            intakeForm.classList.add('hidden');
            intakeSuccess.classList.remove('hidden');
            intakeForm.reset();
        });


        // --- 4.5. Secondary Sub-Tracking Link Builder ---
        const subIdInput = document.getElementById('sub-id-input');
        const subWrapper = document.getElementById('sub-link-output-wrapper');
        const subLinkText = document.getElementById('sub-link-text');

        window.buildSubLink = function() {
            const subVal = subIdInput.value.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
            if (!subVal) {
                alert('Please input an alphanumeric advisor node ID.');
                return;
            }

            const generatedUrl = `${window.location.origin}/partners/${config.slug}/index.html?sub=${subVal}`;
            subWrapper.classList.remove('hidden');
            subLinkText.textContent = generatedUrl;
        };

        window.copySubLink = function() {
            const link = subLinkText.textContent;
            navigator.clipboard.writeText(link).then(() => {
                alert('Secondary sub-tracking link copied to secure clipboard!');
            }).catch(err => {
                console.error('Copy mismatch: ', err);
            });
        };
    }

    // 5. BOOTSTRAP EXECUTION PROTOCOL
    injectStylesAndFonts();
    document.addEventListener('DOMContentLoaded', generateUI);
    // Safe manual run if script inject occurs after DOMContentLoaded is fired
    if (document.readyState === "complete" || document.readyState === "interactive") {
        generateUI();
    }
})();
```