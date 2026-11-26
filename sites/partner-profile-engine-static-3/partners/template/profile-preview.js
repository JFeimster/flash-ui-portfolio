/**
 * Moonshine Partner Profile Engine - Live Profile Preview Engine
 * File: partners/template/profile-preview.js
 * 
 * Dynamically builds and controls the public-facing "Funding Desk Command Center"
 * for individual affiliate partners. Handles hydration from static configs, 
 * interactive route calculators, document checklist state management, 
 * and dynamic scoring tools.
 */

(function () {
    // 1. Core Config / Mock Database for Live Partner Previewing
    const PARTNER_DATABASE = {
        'darwin-hanneman': {
            name: "Darwin Hanneman",
            stableId: "DN-04",
            tier: "VERIFIED DESK",
            tierColor: "green",
            role: "Local Business Funding Partner",
            niche: "Retail, Main Street, and Service Contractors",
            bio: "Helping local Main Street operators structure optimized capital plans. Specializing in SBA readiness routing, cash flow expansion loans, and rapid-advance operating facilities.",
            metrics: { niche: "RETAIL & MAIN ST", ratio: "97.4%", routed: "$8.4M" },
            nicheFocus: "local-business",
            bestFit: "SBA & Revenue Advances",
            calendarLink: "https://calendly.com/moonshine-darwin",
            checklist: [
                { id: "banks", label: "6 Months Business Bank Statements", required: true, status: "pending" },
                { id: "tax", label: "2 Years Corporate Tax Returns", required: true, status: "pending" },
                { id: "pl", label: "Interim Year-to-Date P&L Statement", required: true, status: "pending" },
                { id: "ar", label: "Accounts Receivable Aging Ledger", required: false, status: "pending" },
                { id: "id", label: "Owner Drivers License / Passport Copy", required: true, status: "pending" }
            ]
        },
        'amanda-sterling': {
            name: "Amanda Sterling",
            stableId: "AS-09",
            tier: "VIP ELITE DESK",
            tierColor: "blue",
            role: "Ecommerce Funding Specialist",
            niche: "Direct-to-Consumer Brands, Shopify Partners, and SaaS Solutions",
            bio: "Engineered specifically for hyper-growth digital storefronts. Expert in structuring non-dilutive inventory capital, dynamic advertising lines of credit, and revenue-based assets.",
            metrics: { niche: "E-COMMERCE & SAAS", ratio: "99.1%", routed: "$18.2M" },
            nicheFocus: "e-commerce",
            bestFit: "Revenue-Based Lines",
            calendarLink: "https://calendly.com/moonshine-amanda",
            checklist: [
                { id: "banks", label: "3 Months Bank Statements & Stripe Export", required: true, status: "pending" },
                { id: "shopify", label: "Shopify/Amazon Store Analytics Access", required: true, status: "pending" },
                { id: "marketing", label: "Ad Platform Performance Ledger", required: false, status: "pending" },
                { id: "pl", label: "P&L Statement (Past 12 Months)", required: true, status: "pending" }
            ]
        },
        'jackson-vance': {
            name: "Jackson Vance",
            stableId: "JV-22",
            tier: "VERIFIED DESK",
            tierColor: "green",
            role: "Contractor Funding Specialist",
            niche: "Commercial Trade Builders, Electrical Contractors, and Civil Engineers",
            bio: "Bridging mobilization cash deficits for commercial contractors. Custom designs invoice factoring platforms, equipment leases, and upfront material procurement financing lines.",
            metrics: { niche: "CONSTRUCTION / INDUSTRIAL", ratio: "96.8%", routed: "$11.1M" },
            nicheFocus: "contractors",
            bestFit: "Invoice Factoring & Equipment",
            calendarLink: "https://calendly.com/moonshine-jackson",
            checklist: [
                { id: "banks", label: "6 Months Corporate Bank Statements", required: true, status: "pending" },
                { id: "contracts", label: "Signed Project Mobilization Agreement", required: true, status: "pending" },
                { id: "tax", label: "Most Recent Federal Tax Filing", required: true, status: "pending" },
                { id: "ar", label: "A/R Aging Report & Outstanding Invoices", required: true, status: "pending" }
            ]
        },
        'helena-rostova': {
            name: "Helena Rostova",
            stableId: "HR-71",
            tier: "VIP ELITE DESK",
            tierColor: "blue",
            role: "Real Estate Investor Partner",
            niche: "Residential Flips, Multifamily Bridging, and Commercial Developments",
            bio: "Custom real estate capital deployment pipelines. Specialized in bridging short-term acquisition gaps, hard-money scheduling, and portfolio balance sheet restructuring.",
            metrics: { niche: "RE DEVELOPMENTS", ratio: "98.7%", routed: "$22.4M" },
            nicheFocus: "real-estate",
            bestFit: "Bridge Debt & CRE Loans",
            calendarLink: "https://calendly.com/moonshine-helena",
            checklist: [
                { id: "experience", label: "REI Track Record / Project Resume", required: true, status: "pending" },
                { id: "appraisal", label: "Subject Property Evaluation / Appraisal", required: true, status: "pending" },
                { id: "llc", label: "Corporate entity docs / Operating Agreement", required: true, status: "pending" },
                { id: "liquidity", label: "Proof of Down Payment Funds / Liquidity", required: true, status: "pending" }
            ]
        }
    };

    // 2. Global Runtime State
    let activePartner = null;
    let currentMatcherFilters = { revenue: 15000, credit: 650, yearsInBiz: 1 };
    let currentScorecardAnswers = { revenue: null, credit: null, time: null, products: null };
    let currentScorecardStep = 1;

    // 3. Init Function - Instantly runs on script load
    window.addEventListener('DOMContentLoaded', () => {
        // Detect target root container or fall back to injecting a floating sandbox preview trigger
        const previewRoot = document.getElementById('profile-preview-root');
        
        // 1. Identify which partner to show
        let partnerKey = getQueryParam('partner') || 'darwin-hanneman';
        if (!PARTNER_DATABASE[partnerKey]) {
            partnerKey = 'darwin-hanneman'; // Default fallback
        }
        activePartner = JSON.parse(JSON.stringify(PARTNER_DATABASE[partnerKey])); // deep copy

        if (previewRoot) {
            renderFullDeskTemplate(previewRoot);
            initInteractiveEngines();
        } else {
            console.warn("Moonshine Engine: target container '#profile-preview-root' not detected in active DOM.");
        }
    });

    // Helper: Read query parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // 4. Dom Template Generator
    function renderFullDeskTemplate(container) {
        const themeColorClass = activePartner.tierColor === 'blue' ? 'brand-blue' : 'brand-green';
        const accentHex = activePartner.tierColor === 'blue' ? '#004BFF' : '#00FF66';
        
        container.innerHTML = `
            <div class="max-w-7xl mx-auto space-y-12 pb-24">
                
                <!-- TOP META TELEMETRY BAR -->
                <div class="bg-brand-black/80 border border-brand-borderGray p-4 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-zinc-500 gap-4">
                    <div class="flex items-center space-x-3">
                        <span class="flex items-center space-x-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-${themeColorClass} animate-pulse"></span>
                            <span class="text-brand-bone font-bold tracking-wider">ACTIVE ROUTER SECURE</span>
                        </span>
                        <span>|</span>
                        <span>DESK ID: MN-PORTAL-${activePartner.stableId}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <span>STATIC COMPILATION V1.2.1</span>
                        <button id="btn-share-preview" class="px-2.5 py-1 bg-brand-graphite hover:bg-brand-borderGray text-brand-bone text-[10px] border border-brand-borderGray flex items-center gap-1.5 transition-colors">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 10.742l4.586-2.548m0 0a3 3 0 10-4.586-2.548 3 3 0 004.586 2.548zm0 5.116l-4.586-2.548m0 0a3 3 0 104.586 2.548 3 3 0 00-4.586-2.548z"/></svg>
                            Copy Portal Path
                        </button>
                    </div>
                </div>

                <!-- MAIN WORKSPACE HERO LAYOUT -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    <!-- LEFT COLUMN: Profile info, Metrics and Primary CTA Intake -->
                    <div class="lg:col-span-5 space-y-8">
                        
                        <!-- PARTNER AVATAR CARD -->
                        <div class="bg-brand-darkGray border-2 border-brand-borderGray shadow-[6px_6px_0px_#1E1E22] p-6 relative">
                            <!-- Tactical floating badge -->
                            <span class="absolute top-4 right-4 bg-${themeColorClass}/15 text-${themeColorClass} text-[9px] font-mono font-bold px-2.5 py-1 border border-${themeColorClass}/40 uppercase tracking-widest">
                                ${activePartner.tier}
                            </span>

                            <div class="flex items-start space-x-5">
                                <div class="w-20 h-20 bg-brand-graphite border border-brand-borderGray p-1 flex-shrink-0 relative">
                                    <div class="w-full h-full bg-gradient-to-tr from-brand-black via-brand-graphite to-${themeColorClass} flex items-center justify-center text-2xl font-mono text-brand-bone font-extrabold select-none">
                                        ${getInitials(activePartner.name)}
                                    </div>
                                    <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-${themeColorClass} border border-brand-black"></div>
                                </div>
                                <div class="space-y-1">
                                    <h1 class="text-2xl md:text-3xl font-bold uppercase tracking-tight text-brand-bone">${activePartner.name}</h1>
                                    <span class="text-xs font-mono text-${themeColorClass} uppercase tracking-widest block">${activePartner.role}</span>
                                    <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Affiliated Capital Strategist</span>
                                </div>
                            </div>

                            <p class="mt-6 text-sm text-zinc-400 font-sans leading-relaxed">
                                ${activePartner.bio}
                            </p>

                            <!-- Mini Metrics Panel -->
                            <div class="grid grid-cols-3 gap-2 mt-6 border-t border-brand-borderGray pt-4 text-center font-mono">
                                <div class="bg-brand-black border border-brand-borderGray/80 p-2.5">
                                    <span class="text-[8px] text-zinc-500 block uppercase">Niche Focus</span>
                                    <span class="text-[11px] font-bold text-brand-bone mt-0.5 block truncate">${activePartner.metrics.niche}</span>
                                </div>
                                <div class="bg-brand-black border border-brand-borderGray/80 p-2.5">
                                    <span class="text-[8px] text-zinc-500 block uppercase">Conversion Ratio</span>
                                    <span class="text-[11px] font-bold text-brand-orange mt-0.5 block">${activePartner.metrics.ratio}</span>
                                </div>
                                <div class="bg-brand-black border border-brand-borderGray/80 p-2.5">
                                    <span class="text-[8px] text-zinc-500 block uppercase">Funds Routed</span>
                                    <span class="text-[11px] font-bold text-brand-green mt-0.5 block">${activePartner.metrics.routed}</span>
                                </div>
                            </div>
                        </div>

                        <!-- LIVE SUBMISSION INTAKE BAR -->
                        <div class="bg-brand-black border-2 border-brand-borderGray p-6 shadow-[6px_6px_0px_#1E1E22] space-y-4">
                            <div class="flex items-center space-x-2 border-b border-brand-borderGray pb-3">
                                <div class="w-2 h-2 rounded-full bg-brand-green"></div>
                                <h3 class="font-bold font-mono text-xs uppercase tracking-wider text-brand-bone">Direct Intake Console</h3>
                            </div>
                            <p class="text-xs text-zinc-400 font-sans">
                                Launch a secure capital request mapped directly under ${activePartner.name}'s affiliate channel. Processed in 3 minutes via SSL secure gateway.
                            </p>
                            <div class="pt-2 flex flex-col sm:flex-row gap-3">
                                <a href="https://moonshine-intake.vercel.app/apply?partner=${activePartner.stableId}" target="_blank" class="flex-1 text-center bg-brand-green hover:bg-brand-green/90 text-brand-black font-mono font-bold text-xs py-3 border-2 border-brand-black hover:-translate-y-0.5 transition-transform active:translate-y-0 uppercase tracking-wider">
                                    Start Application
                                </a>
                                <a href="${activePartner.calendarLink}" target="_blank" class="px-4 py-3 bg-brand-graphite hover:bg-brand-borderGray border border-brand-borderGray text-xs font-mono font-bold text-brand-bone hover:-translate-y-0.5 transition-transform uppercase text-center tracking-wider">
                                    Book Consult
                                </a>
                            </div>
                        </div>

                    </div>

                    <!-- RIGHT COLUMN: Interactive Engines Container -->
                    <div class="lg:col-span-7 space-y-8">
                        
                        <!-- TAB NAVIGATION PANEL -->
                        <div class="bg-brand-darkGray border-2 border-brand-borderGray p-1 flex font-mono text-xs select-none shadow-[4px_4px_0px_#1E1E22]">
                            <button id="tab-checklist" class="flex-1 py-2.5 text-center font-bold tracking-wider text-brand-bone bg-brand-graphite border border-brand-borderGray uppercase transition-all duration-150">
                                Checklist Matrix
                            </button>
                            <button id="tab-matcher" class="flex-1 py-2.5 text-center font-bold tracking-wider text-zinc-500 hover:text-brand-bone hover:bg-brand-graphite/40 uppercase transition-all duration-150">
                                Capital Matcher
                            </button>
                            <button id="tab-scorecard" class="flex-1 py-2.5 text-center font-bold tracking-wider text-zinc-500 hover:text-brand-bone hover:bg-brand-graphite/40 uppercase transition-all duration-150">
                                Readiness Scorecard
                            </button>
                        </div>

                        <!-- DYNAMIC ENGINE CONTAINER -->
                        <div id="dynamic-engine-view" class="bg-brand-darkGray border-2 border-brand-borderGray p-6 shadow-[6px_6px_0px_#1E1E22] min-h-[400px]">
                            <!-- Content hydrated by active tabs dynamically -->
                        </div>

                    </div>
                </div>

                <!-- TACTICAL ADVISOR RECOMMENDATION HEADER -->
                <div class="border-2 border-brand-borderGray bg-brand-black/30 p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div class="space-y-1 max-w-xl">
                        <span class="text-[9px] font-mono text-brand-orange uppercase tracking-widest block">// SECURE UNDERWRITING DIRECTIVE</span>
                        <h4 class="font-sans font-bold text-lg text-brand-bone">Optimal Capital Path Selection</h4>
                        <p class="text-xs text-zinc-400 font-sans leading-relaxed">
                            These diagnostic tools compile your operational files in real-time. Choose your preferred workspace engine above to evaluate compatibility.
                        </p>
                    </div>
                    <div class="flex items-center space-x-4 bg-brand-darkGray/80 border border-brand-borderGray py-3 px-5">
                        <div class="text-right">
                            <span class="text-[8px] font-mono text-zinc-500 uppercase block">Configured Route</span>
                            <span class="font-mono text-xs font-bold text-brand-green uppercase">${activePartner.bestFit}</span>
                        </div>
                    </div>
                </div>

            </div>
        `;

        // Add Share Preview trigger handler
        document.getElementById('btn-share-preview').addEventListener('click', () => {
            const path = `${window.location.origin}/partners/template/index.html?partner=${activePartner.stableId.toLowerCase()}`;
            navigator.clipboard.writeText(path).then(() => {
                triggerLocalToast('LINK EXTRACTED', 'Custom sandbox template query URL copied to clipboard!', 'border-brand-green');
            }).catch(() => {
                triggerLocalToast('SYSTEM PATH', `Active slug: /partners/${activePartner.stableId}`, 'border-brand-orange');
            });
        });
    }

    // 5. Interactive Workspace Engine Switchers
    function initInteractiveEngines() {
        const tabChecklist = document.getElementById('tab-checklist');
        const tabMatcher = document.getElementById('tab-matcher');
        const tabScorecard = document.getElementById('tab-scorecard');

        // Initial launch default
        renderChecklistEngine();

        tabChecklist.addEventListener('click', () => {
            setActiveTab(tabChecklist, [tabMatcher, tabScorecard]);
            renderChecklistEngine();
        });

        tabMatcher.addEventListener('click', () => {
            setActiveTab(tabMatcher, [tabChecklist, tabScorecard]);
            renderMatcherEngine();
        });

        tabScorecard.addEventListener('click', () => {
            setActiveTab(tabScorecard, [tabChecklist, tabMatcher]);
            renderScorecardEngine();
        });
    }

    function setActiveTab(active, inactiveList) {
        active.className = "flex-1 py-2.5 text-center font-bold tracking-wider text-brand-bone bg-brand-graphite border border-brand-borderGray uppercase transition-all duration-150";
        inactiveList.forEach(tab => {
            tab.className = "flex-1 py-2.5 text-center font-bold tracking-wider text-zinc-500 hover:text-brand-bone hover:bg-brand-graphite/40 uppercase transition-all duration-150";
        });
    }

    // ==========================================
    // MODULE A: Checklist Matrix Engine
    // ==========================================
    function renderChecklistEngine() {
        const container = document.getElementById('dynamic-engine-view');
        
        // Calculate progress percentage
        const completed = activePartner.checklist.filter(item => item.status === 'completed').length;
        const total = activePartner.checklist.length;
        const pct = Math.round((completed / total) * 100);

        let statusText = "PRE-FLIGHT REQUISITES OUTSTANDING";
        let statusColor = "text-brand-orange border-brand-orange/30 bg-brand-orange/10";
        if (pct === 100) {
            statusText = "UNDERWRITING FILE IN-COMPLIANCE";
            statusColor = "text-brand-green border-brand-green/30 bg-brand-green/10";
        } else if (pct > 50) {
            statusText = "INTERIM DOCUMENT REVIEW PHASE";
            statusColor = "text-brand-blue border-brand-blue/30 bg-brand-blue/10";
        }

        let itemsHtml = activePartner.checklist.map(item => {
            const isCompleted = item.status === 'completed';
            const statusIndicator = isCompleted 
                ? `<span class="text-brand-green font-bold font-mono">✓ COMPLIANT</span>` 
                : `<span class="text-zinc-500 font-mono">■ PENDING</span>`;
            const checkIcon = isCompleted
                ? `<svg class="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`
                : `<span class="w-4 h-4 border border-brand-borderGray inline-block bg-brand-black"></span>`;

            return `
                <div class="flex items-center justify-between p-3.5 bg-brand-black border border-brand-borderGray hover:border-zinc-700 transition-colors cursor-pointer" onclick="toggleChecklistItem('${item.id}')">
                    <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0 flex items-center justify-center">
                            ${checkIcon}
                        </div>
                        <span class="text-xs text-brand-bone font-sans leading-none ${isCompleted ? 'line-through text-zinc-500' : ''}">
                            ${item.label} ${item.required ? '<span class="text-brand-orange text-[10px] ml-1 font-mono uppercase">*req</span>' : ''}
                        </span>
                    </div>
                    <div class="flex-shrink-0 text-[10px]">
                        ${statusIndicator}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="space-y-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-borderGray pb-4">
                    <div>
                        <span class="font-mono text-[9px] text-zinc-500 uppercase block">Underwriting Matrix Tool</span>
                        <h3 class="font-bold text-lg text-brand-bone uppercase tracking-tight">Required Document Checklist</h3>
                    </div>
                    <span class="px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wide ${statusColor}">
                        ${statusText}
                    </span>
                </div>

                <p class="text-xs text-zinc-400 leading-relaxed font-sans">
                    Mark off the items you possess. As your file gets populated, your profile compliance ratio improves, reducing manual underwriting delays.
                </p>

                <!-- Dynamic Progress bar -->
                <div class="space-y-2">
                    <div class="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span>Pre-Flight Readiness Index:</span>
                        <span class="font-bold text-brand-bone">${pct}% Complete</span>
                    </div>
                    <div class="w-full bg-brand-black border border-brand-borderGray h-3 p-0.5">
                        <div class="bg-brand-green h-full transition-all duration-300" style="width: ${pct}%"></div>
                    </div>
                </div>

                <!-- Checklist List -->
                <div class="space-y-2 pt-2">
                    ${itemsHtml}
                </div>

                <div class="border-t border-brand-borderGray pt-4 text-[10px] font-mono text-zinc-500 flex justify-between items-center">
                    <span>*REQUIRED TO DEPLOY FINAL QUOTATION</span>
                    <button onclick="resetChecklist()" class="text-brand-orange hover:underline text-[10px] uppercase">Reset List State</button>
                </div>
            </div>
        `;
    }

    window.toggleChecklistItem = function (id) {
        const item = activePartner.checklist.find(i => i.id === id);
        if (item) {
            item.status = item.status === 'pending' ? 'completed' : 'pending';
            renderChecklistEngine();
            if (item.status === 'completed') {
                triggerLocalToast('MATRIX UPDATE', `Flagged "${item.label}" as compliant.`, 'border-brand-green');
            }
        }
    };

    window.resetChecklist = function () {
        activePartner.checklist.forEach(item => item.status = 'pending');
        renderChecklistEngine();
        triggerLocalToast('STATE RESET', 'Checklist cleared to raw state.', 'border-brand-orange');
    };


    // ==========================================
    // MODULE B: Capital Route Matcher
    // ==========================================
    function renderMatcherEngine() {
        const container = document.getElementById('dynamic-engine-view');

        // Evaluate algorithms to calculate route match percentages
        const matches = calculateMatcherMatrix();

        container.innerHTML = `
            <div class="space-y-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-borderGray pb-4">
                    <div>
                        <span class="font-mono text-[9px] text-zinc-500 uppercase block">Diagnostic Dynamic Matching</span>
                        <h3 class="font-bold text-lg text-brand-bone uppercase tracking-tight">Interactive Match Engine</h3>
                    </div>
                    <span class="px-2.5 py-0.5 border border-brand-blue/30 bg-brand-blue/10 text-brand-blue text-[10px] font-mono uppercase tracking-wide">
                        ALGORITHM_DECISION_READY
                    </span>
                </div>

                <p class="text-xs text-zinc-400 leading-relaxed font-sans">
                    Toggle your operational parameters to live-scan matches against Moonshine Capital's premium credit matrices.
                </p>

                <!-- Parameter Sliders Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <!-- Revenue -->
                    <div class="bg-brand-black border border-brand-borderGray p-3.5 space-y-2">
                        <div class="flex justify-between items-center text-[10px] font-mono">
                            <span class="text-zinc-500 uppercase">MONTHLY REV</span>
                            <span class="text-brand-green font-bold">$${formatNumber(currentMatcherFilters.revenue)}</span>
                        </div>
                        <input type="range" min="5000" max="150000" step="5000" value="${currentMatcherFilters.revenue}" 
                            oninput="updateMatcherFilter('revenue', this.value)" 
                            class="w-full accent-brand-green h-1 bg-brand-borderGray rounded-lg cursor-pointer">
                    </div>

                    <!-- Credit -->
                    <div class="bg-brand-black border border-brand-borderGray p-3.5 space-y-2">
                        <div class="flex justify-between items-center text-[10px] font-mono">
                            <span class="text-zinc-500 uppercase">CREDIT SCORE</span>
                            <span class="text-brand-blue font-bold">${currentMatcherFilters.credit}</span>
                        </div>
                        <input type="range" min="450" max="850" step="10" value="${currentMatcherFilters.credit}" 
                            oninput="updateMatcherFilter('credit', this.value)" 
                            class="w-full accent-brand-blue h-1 bg-brand-borderGray rounded-lg cursor-pointer">
                    </div>

                    <!-- Years in Business -->
                    <div class="bg-brand-black border border-brand-borderGray p-3.5 space-y-2">
                        <div class="flex justify-between items-center text-[10px] font-mono">
                            <span class="text-zinc-500 uppercase">TIME IN BIZ</span>
                            <span class="text-brand-orange font-bold">${currentMatcherFilters.yearsInBiz} Year${currentMatcherFilters.yearsInBiz > 1 ? 's' : ''}</span>
                        </div>
                        <input type="range" min="0" max="5" step="1" value="${currentMatcherFilters.yearsInBiz}" 
                            oninput="updateMatcherFilter('yearsInBiz', this.value)" 
                            class="w-full accent-brand-orange h-1 bg-brand-borderGray rounded-lg cursor-pointer">
                    </div>
                </div>

                <!-- Calculations Output Cards -->
                <div class="space-y-2 pt-2">
                    <span class="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Calculated Product Compatibilities:</span>
                    ${matches.map(p => {
                        const pctClass = p.score > 80 ? 'text-brand-green' : p.score > 50 ? 'text-brand-blue' : 'text-brand-orange';
                        const scoreBg = p.score > 80 ? 'bg-brand-green' : p.score > 50 ? 'bg-brand-blue' : 'bg-brand-orange';
                        return `
                            <div class="flex items-center justify-between p-3.5 bg-brand-black border border-brand-borderGray">
                                <div class="space-y-1">
                                    <h4 class="text-xs font-bold font-sans text-brand-bone uppercase tracking-tight">${p.name}</h4>
                                    <span class="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">${p.desc}</span>
                                </div>
                                <div class="text-right flex items-center space-x-4">
                                    <div>
                                        <span class="text-[8px] font-mono text-zinc-500 block uppercase">Match Ratio</span>
                                        <span class="text-xs font-mono font-bold ${pctClass}">${p.score}%</span>
                                    </div>
                                    <div class="w-1.5 h-8 ${scoreBg}"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    window.updateMatcherFilter = function (key, val) {
        currentMatcherFilters[key] = parseInt(val);
        renderMatcherEngine();
    };

    function calculateMatcherMatrix() {
        const { revenue, credit, yearsInBiz } = currentMatcherFilters;

        // Base products evaluate logic
        let sbaScore = 0;
        let revenueScore = 0;
        let invoiceScore = 0;

        // 1. SBA Scoring
        if (revenue >= 35000) sbaScore += 30;
        if (credit >= 680) sbaScore += 40;
        if (yearsInBiz >= 2) sbaScore += 30;

        // 2. Revenue-Based
        if (revenue >= 15000) revenueScore += 40;
        if (credit >= 550) revenueScore += 30;
        if (yearsInBiz >= 1) { revenueScore += 30; } else { revenueScore += 10; }

        // 3. Invoice / Asset Factoring
        if (revenue >= 10000) invoiceScore += 40;
        if (credit >= 500) invoiceScore += 30;
        if (yearsInBiz >= 0) invoiceScore += 30;

        return [
            { name: "SBA Capital Prep Path", score: sbaScore, desc: "SBA 7(a) & Express preparation mapping. High compliance require.", minRev: 35000, minCred: 680, minBiz: 2 },
            { name: "Dynamic Revenue Advances", score: revenueScore, desc: "Fast-turn capital based directly on gross credit card or merchant flow.", minRev: 15000, minCred: 550, minBiz: 1 },
            { name: "Invoice & Material Lines", score: invoiceScore, desc: "Factoring receivables for working capital mobilization. Low credit friction.", minRev: 10000, minCred: 500, minBiz: 0 }
        ];
    }

    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }


    // ==========================================
    // MODULE C: Readiness Scorecard Quiz
    // ==========================================
    function renderScorecardEngine() {
        const container = document.getElementById('dynamic-engine-view');

        // Quiz State machine UI renderer
        if (currentScorecardStep <= 4) {
            renderQuizStep(container);
        } else {
            renderQuizResult(container);
        }
    }

    function renderQuizStep(container) {
        let questionTitle = "";
        let optionsHtml = "";

        switch (currentScorecardStep) {
            case 1:
                questionTitle = "Choose Your Average Gross Monthly Revenue Layer:";
                optionsHtml = `
                    <button onclick="submitScorecardAnswer('revenue', 'low', 15)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        Under $10,000 monthly
                    </button>
                    <button onclick="submitScorecardAnswer('revenue', 'mid', 25)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        $10,000 to $40,000 monthly
                    </button>
                    <button onclick="submitScorecardAnswer('revenue', 'high', 35)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        $40,000 to $100,000+ monthly
                    </button>
                `;
                break;
            case 2:
                questionTitle = "Estimate Your Current Personal Credit Ranking:";
                optionsHtml = `
                    <button onclick="submitScorecardAnswer('credit', 'low', 10)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        Under 600 (High friction)
                    </button>
                    <button onclick="submitScorecardAnswer('credit', 'mid', 20)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        600 to 679 (Standard tier)
                    </button>
                    <button onclick="submitScorecardAnswer('credit', 'high', 30)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        680+ (Excellent tier)
                    </button>
                `;
                break;
            case 3:
                questionTitle = "Specify Active Trading Age of Current Enterprise Entity:";
                optionsHtml = `
                    <button onclick="submitScorecardAnswer('time', 'low', 10)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        Under 6 months
                    </button>
                    <button onclick="submitScorecardAnswer('time', 'mid', 20)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        6 months to 2 years
                    </button>
                    <button onclick="submitScorecardAnswer('time', 'high', 25)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        Over 2 years (Full corporate history)
                    </button>
                `;
                break;
            case 4:
                questionTitle = "Current State of Corporate Document Mobilization:";
                optionsHtml = `
                    <button onclick="submitScorecardAnswer('products', 'low', 5)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        Scattered. I will need manual preparation assistance.
                    </button>
                    <button onclick="submitScorecardAnswer('products', 'high', 10)" class="w-full text-left p-4 bg-brand-black border border-brand-borderGray hover:border-brand-green text-xs font-sans text-brand-bone transition-all">
                        Organized. Bank statements and tax returns are prepared.
                    </button>
                `;
                break;
        }

        container.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center border-b border-brand-borderGray pb-4">
                    <div>
                        <span class="font-mono text-[9px] text-zinc-500 uppercase block">Underwriting Readiness Index</span>
                        <h3 class="font-bold text-lg text-brand-bone uppercase tracking-tight">Pre-Flight Qualification Index</h3>
                    </div>
                    <span class="text-xs font-mono text-zinc-500">Step ${currentScorecardStep} of 4</span>
                </div>

                <div class="p-3 bg-brand-black border-l-2 border-brand-orange text-[10px] font-mono text-brand-orange uppercase">
                    SELF-EVALUATION IN PROCESS
                </div>

                <div class="space-y-4">
                    <h4 class="text-sm font-bold text-brand-bone tracking-wide font-sans">${questionTitle}</h4>
                    <div class="space-y-2">
                        ${optionsHtml}
                    </div>
                </div>

                <div class="w-full bg-brand-black border border-brand-borderGray h-2 p-0.5">
                    <div class="bg-brand-orange h-full transition-all duration-300" style="width: ${(currentScorecardStep / 4) * 100}%"></div>
                </div>
            </div>
        `;
    }

    window.submitScorecardAnswer = function (key, value, scoreVal) {
        currentScorecardAnswers[key] = { value, score: scoreVal };
        currentScorecardStep++;
        renderScorecardEngine();
    };

    function renderQuizResult(container) {
        // Calculate cumulative totals
        const totalScore = 
            (currentScorecardAnswers.revenue ? currentScorecardAnswers.revenue.score : 0) +
            (currentScorecardAnswers.credit ? currentScorecardAnswers.credit.score : 0) +
            (currentScorecardAnswers.time ? currentScorecardAnswers.time.score : 0) +
            (currentScorecardAnswers.products ? currentScorecardAnswers.products.score : 0);

        let rankText = "EMERGING PHASE DEBT";
        let rankDesc = "Your business profile is scaling but displays underwriting compliance gaps. Focus on securing clean bank files and improving payment histories before seeking high-volume bank limits.";
        let badgeColor = "border-brand-orange/30 bg-brand-orange/10 text-brand-orange";

        if (totalScore >= 80) {
            rankText = "PRIME CAPITAL ELIGIBLE";
            rankDesc = "Outstanding readiness indicators. Highly compatible with Moonshine Premium SBA express, invoice matching structures, and optimal dynamic lines of credit. Immediate dispatch advised.";
            badgeColor = "border-brand-green/30 bg-brand-green/10 text-brand-green";
        } else if (totalScore >= 50) {
            rankText = "ESTABLISHED MID-TIER LIQUIDITY";
            rankDesc = "Excellent compatibility with alternative revenue-based options, working capital advances, and dynamic hardware/equipment leasing paths. Minimal delay parameters anticipated.";
            badgeColor = "border-brand-blue/30 bg-brand-blue/10 text-brand-blue";
        }

        container.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center border-b border-brand-borderGray pb-4">
                    <div>
                        <span class="font-mono text-[9px] text-zinc-500 uppercase block">Underwriting Readiness Index</span>
                        <h3 class="font-bold text-lg text-brand-bone uppercase tracking-tight">Calculation Results</h3>
                    </div>
                    <span class="px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wide ${badgeColor}">
                        Score: ${totalScore} / 100
                    </span>
                </div>

                <div class="p-4 bg-brand-black border border-brand-borderGray space-y-2">
                    <span class="text-[8px] font-mono text-zinc-500 uppercase block">Underwriting Rank Assignment</span>
                    <h4 class="text-base font-mono font-bold text-brand-bone uppercase tracking-tight">${rankText}</h4>
                    <p class="text-xs text-zinc-400 font-sans leading-relaxed">
                        ${rankDesc}
                    </p>
                </div>

                <div class="p-3 bg-brand-darkGray border-l-2 border-brand-green space-y-1">
                    <span class="text-[9px] font-mono text-zinc-500 uppercase block">ADVISOR ROUTING NOTES // FROM: ${activePartner.name.toUpperCase()}</span>
                    <p class="text-xs italic text-brand-bone font-sans leading-relaxed">
                        "Your performance score dictates our optimal filing strategy. Let's submit your prepared files straight to underwriting for high-converting fast-track routing."
                    </p>
                </div>

                <div class="flex gap-4 pt-2">
                    <button onclick="resetScorecard()" class="flex-1 py-3 bg-brand-black border border-brand-borderGray hover:bg-brand-graphite text-zinc-400 hover:text-brand-bone font-mono text-xs font-bold uppercase transition-all tracking-wider text-center">
                        Restart Scorecard
                    </button>
                    <a href="https://moonshine-intake.vercel.app/apply?partner=${activePartner.stableId}&score=${totalScore}" target="_blank" class="flex-1 py-3 bg-brand-green hover:bg-brand-green/90 text-brand-black font-mono text-xs font-bold uppercase tracking-wider text-center block border-2 border-brand-black">
                        Route Pre-Approved Desk
                    </a>
                </div>
            </div>
        `;
    }

    window.resetScorecard = function () {
        currentScorecardStep = 1;
        currentScorecardAnswers = { revenue: null, credit: null, time: null, products: null };
        renderScorecardEngine();
        triggerLocalToast('WIDGET RE-INIT', 'Scorecard algorithm reset.', 'border-brand-orange');
    };


    // ==========================================
    // UTILITY METHODS
    // ==========================================
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }

    // Direct drop-in Toast module for custom template triggers
    function triggerLocalToast(title, message, borderClass = 'border-brand-green') {
        const toast = document.getElementById('toast');
        const toastTitle = document.getElementById('toast-title');
        const toastBody = document.getElementById('toast-body');

        if (toast && toastTitle && toastBody) {
            // Reset configurations
            toast.className = `fixed bottom-24 md:bottom-8 right-4 md:right-8 bg-brand-black border-2 p-4 max-w-sm z-50 transform transition-all duration-300 pointer-events-auto ${borderClass}`;
            
            if (borderClass.includes('green')) {
                toast.style.boxShadow = '4px 4px 0px #00FF66';
                toastTitle.className = 'block font-mono text-[10px] text-brand-green uppercase tracking-wider';
            } else if (borderClass.includes('orange')) {
                toast.style.boxShadow = '4px 4px 0px #FF5500';
                toastTitle.className = 'block font-mono text-[10px] text-brand-orange uppercase tracking-wider';
            } else if (borderClass.includes('blue')) {
                toast.style.boxShadow = '4px 4px 0px #004BFF';
                toastTitle.className = 'block font-mono text-[10px] text-brand-blue uppercase tracking-wider';
            }

            toastTitle.innerText = title;
            toastBody.innerText = message;

            // Trigger IN animation
            toast.classList.remove('translate-y-24', 'opacity-0');
            
            // Trigger OUT timeout
            setTimeout(() => {
                toast.classList.add('translate-y-24', 'opacity-0');
            }, 3500);
        } else {
            console.log(`Moonshine Toast Fail: ${title} - ${message}`);
        }
    }

})();