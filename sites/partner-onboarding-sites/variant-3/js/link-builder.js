(function () {
    // Strict Neo-Brutalist Tracking Link Generator & Marketing Asset Vault Script
    // For Moonshine Capital Partners - Affiliate Integration Engine

    const ASSET_VAULT_DATA = {
        swipes: [
            {
                id: "email-1",
                category: "Email Sequence",
                title: "COMMISSION PIPELINE ACTIVATION",
                subject: "⚡️ Institutional Liquidity Route: [PARTNER_ID] Secured",
                body: "COLLEAGUE,\n\nWe have initialized direct routing channels with Moonshine Capital Partners.\n\nIf you require high-liquidity project funding, bridge financing, or capital injections from $500K to $20M+, our dedicated pipeline is officially open.\n\nSecure institutional evaluation here:\n[TRACKING_URL]\n\nUnderwriting parameters are optimized for high-speed term sheet execution.\n\nREGARDS,\n[PARTNER_ID]\nMOONSHINE INTEGRATED PARTNER"
            },
            {
                id: "social-1",
                category: "Social Post",
                title: "DEFI / TRADFI BRIDGE CODENAME",
                subject: "LinkedIn / X Campaign",
                body: "⚠️ PIPELINE UPGRADE: Direct institutional capital routing is now active. Processing commercial projects, real estate developments, and tech-driven debt solutions from $500K - $20M+ via Moonshine Capital Partners. \n\nSubmit your term sheet request immediately:\n[TRACKING_URL]\n\n// REFERRAL ROUTE: [PARTNER_ID] // ARMED"
            },
            {
                id: "short-1",
                category: "Short Telegram/Discord",
                title: "TELEGRAM DISPATCH PROTOCOL",
                subject: "Direct Broadcast",
                body: "🚨 MOONSHINE LIQUIDITY ROUTE OPEN. Need bridge debt or corporate capital injections? Skip regional bank delays. Deploy through our verified affiliate link: [TRACKING_URL] v3.44 initialized."
            }
        ],
        banners: [
            {
                id: "banner-rect",
                name: "TOXIC VOLT BILLBOARD (728x90)",
                width: 728,
                height: 90,
                bg: "#E2FF00",
                textColor: "#000000",
                accent: "#000000",
                tagline: "MOONSHINE CAPITAL // DEPLOY LIQUIDITY"
            },
            {
                id: "banner-square",
                name: "HARD SHADOW BLOCK (300x250)",
                width: 300,
                height: 250,
                bg: "#000000",
                textColor: "#FFFFFF",
                accent: "#FF0055",
                tagline: "CAPITAL PIPELINE SECURED"
            },
            {
                id: "banner-neon",
                name: "TOXIC PINK TERMINAL (336x280)",
                width: 336,
                height: 280,
                bg: "#FF0055",
                textColor: "#FFFFFF",
                accent: "#E2FF00",
                tagline: "$500K - $20M+ DEBT ROUTING"
            }
        ]
    };

    class MoonshineLinkBuilder {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            if (!this.container) {
                console.warn(`MoonshineLinkBuilder: Container '#${containerId}' not found. Initializing target injector.`);
                this.injectTargetContainer();
            }
            
            // State
            this.affiliateId = "ALPHA_PARTNER";
            this.utmSource = "affiliate_network";
            this.utmMedium = "digital_dispatch";
            this.utmCampaign = "capital_run_v1";
            this.subId = "tracking_tag_01";
            this.activeSwipeIndex = 0;
            this.terminalLogs = [
                "SYSTEM: INITIALIZING LINK INJECTION COMPILER v4.9...",
                "CONFIG: LOADED NEON BRUTALIST UI HOOKS.",
                "LEDGER: CONNECTED TO PARTNER ENGINE."
            ];

            this.init();
        }

        injectTargetContainer() {
            // Find main or body to append if target not found
            const mainEl = document.querySelector('main') || document.body;
            const section = document.createElement('section');
            section.id = "moonshine-link-builder-root";
            section.className = "w-full max-w-7xl mx-auto mb-8";
            mainEl.appendChild(section);
            this.container = section;
        }

        init() {
            this.renderStructure();
            this.bindEvents();
            this.updateOutput();
            this.addLog("SYSTEM READY. ARMED FOR LINK BUILDING PROTOCOL.");
        }

        renderStructure() {
            this.container.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                    <!-- Left: Terminal Controls -->
                    <div class="lg:col-span-6 bg-white brutalist-border brutalist-shadow-black p-6 flex flex-col justify-between">
                        <div class="border-b-4 border-black pb-4 mb-6">
                            <span class="text-xs font-black uppercase bg-black text-[#E2FF00] px-2 py-0.5">VAULT PROTOCOL // 01</span>
                            <h3 class="text-3xl font-black mt-2">LINK INJECTION TERMINAL</h3>
                            <p class="text-xs font-bold text-gray-500 uppercase mt-1">CONSTRUCT HIGH-CONVERSION DEEP LINKS</p>
                        </div>

                        <!-- CLI / Input Terminal Panel -->
                        <div class="flex flex-col gap-4 font-mono text-sm">
                            <div>
                                <label class="block text-xs font-black uppercase mb-1 text-black">// CODENAME ID</label>
                                <input type="text" id="terminal-affiliate-id" value="${this.affiliateId}" class="w-full bg-black text-[#E2FF00] brutalist-border p-3 outline-none font-bold uppercase tracking-wider focus:border-[#FF0055]">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-black uppercase mb-1 text-black">// UTM SOURCE</label>
                                    <input type="text" id="terminal-utm-source" value="${this.utmSource}" class="w-full brutalist-input p-3 uppercase text-xs">
                                </div>
                                <div>
                                    <label class="block text-xs font-black uppercase mb-1 text-black">// UTM MEDIUM</label>
                                    <input type="text" id="terminal-utm-medium" value="${this.utmMedium}" class="w-full brutalist-input p-3 uppercase text-xs">
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-black uppercase mb-1 text-black">// UTM CAMPAIGN</label>
                                    <input type="text" id="terminal-utm-campaign" value="${this.utmCampaign}" class="w-full brutalist-input p-3 uppercase text-xs">
                                </div>
                                <div>
                                    <label class="block text-xs font-black uppercase mb-1 text-black">// SUB ID / TRACKER</label>
                                    <input type="text" id="terminal-sub-id" value="${this.subId}" class="w-full brutalist-input p-3 uppercase text-xs">
                                </div>
                            </div>
                        </div>

                        <!-- Command Line Simulated Output -->
                        <div class="bg-black text-[#E2FF00] p-4 brutalist-border mt-6 font-mono text-xs h-36 overflow-y-auto flex flex-col gap-1" id="terminal-screen">
                            <!-- Logs will dynamically write here -->
                        </div>

                        <!-- Generated Link Result -->
                        <div class="bg-[#E2FF00] text-black p-4 brutalist-border mt-6 flex flex-col gap-2 relative">
                            <span class="text-xs font-black uppercase tracking-wider">// COMPILED TRACKING PATH:</span>
                            <div class="font-mono text-xs md:text-sm font-bold bg-white text-black p-3 brutalist-border break-all select-all border-dashed" id="compiled-link-display">
                                loading...
                            </div>
                            <button id="btn-copy-link" class="brutalist-btn brutalist-btn-white py-2 text-xs font-black mt-2">
                                📋 COPY PIPELINE LINK TO CLIPBOARD
                            </button>
                        </div>
                    </div>

                    <!-- Right: Marketing Asset Vault -->
                    <div class="lg:col-span-6 bg-white brutalist-border brutalist-shadow-pink p-6 flex flex-col justify-between">
                        <div class="border-b-4 border-black pb-4 mb-6 flex justify-between items-center">
                            <div>
                                <span class="text-xs font-black uppercase bg-[#FF0055] text-white px-2 py-0.5">VAULT PROTOCOL // 02</span>
                                <h3 class="text-3xl font-black mt-2">ASSET DISPATCH</h3>
                            </div>
                            <span class="bg-black text-[#E2FF00] border-2 border-black font-black text-xs px-2 py-1">READY</span>
                        </div>

                        <!-- Swipe Tabs -->
                        <div class="flex border-b-4 border-black mb-4 overflow-x-auto">
                            ${ASSET_VAULT_DATA.swipes.map((swipe, idx) => `
                                <button data-index="${idx}" class="swipe-tab-btn px-4 py-2 text-xs font-black uppercase border-r-2 border-t-2 border-black whitespace-nowrap ${idx === 0 ? 'bg-black text-white' : 'bg-white text-black'}">
                                    ${swipe.title}
                                </button>
                            `).join('')}
                        </div>

                        <!-- Swipe Content Drawer -->
                        <div class="bg-gray-50 brutalist-border p-4 mb-6 relative">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-xs font-bold text-gray-400 uppercase" id="swipe-category-display">EMAIL CAMPAIGN</span>
                                <span class="bg-[#FF0055] text-white text-[10px] font-black px-1 border border-black uppercase">READY TO SEND</span>
                            </div>
                            <div class="text-xs font-mono font-bold text-gray-900 border-b border-gray-300 pb-2 mb-2" id="swipe-subject-display">
                                SUBJECT: ...
                            </div>
                            <textarea id="swipe-body-display" readonly class="w-full bg-white font-mono text-xs p-3 brutalist-border h-48 focus:outline-none resize-none"></textarea>
                            
                            <button id="btn-copy-swipe" class="w-full brutalist-btn brutalist-btn-accent py-3 text-xs font-black mt-4">
                                📋 COPY SWIPE TEXT PROTOCOL
                            </button>
                        </div>

                        <!-- Dynamic Visual Banner Previews -->
                        <div>
                            <span class="text-xs font-black uppercase block mb-3">// LIVE BRAND BANNER GENERATOR:</span>
                            <div class="flex flex-col gap-4">
                                ${ASSET_VAULT_DATA.banners.map(banner => `
                                    <div class="brutalist-border p-3 bg-gray-50 flex flex-col gap-2">
                                        <div class="flex justify-between items-center">
                                            <span class="text-xs font-mono font-black text-black">${banner.name}</span>
                                            <button onclick="window.MoonshineLinkBuilderInstance.copyBannerCode('${banner.id}')" class="text-[10px] bg-black text-white hover:text-[#E2FF00] font-black px-2 py-1 brutalist-border border-black">
                                                GET BANNER EMBED CODE
                                            </button>
                                        </div>
                                        
                                        <!-- Interactive Mock Live Banner Container -->
                                        <div class="overflow-x-auto w-full p-2 bg-white brutalist-border border-dashed">
                                            <div id="banner-preview-${banner.id}" class="flex items-center justify-center text-center p-4 border-4 border-black select-none" style="background-color: ${banner.bg}; color: ${banner.textColor}; font-family: 'Syne', sans-serif; min-height: 80px;">
                                                <div>
                                                    <span class="block font-black text-lg tracking-tight uppercase">${banner.tagline}</span>
                                                    <span class="text-[9px] font-bold block uppercase border-t border-current mt-1 pt-1 opacity-80 font-mono">TRACKING AFFILIATE: <span class="banner-affiliate-indicator">ALPHA_PARTNER</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                    </div>
                </div>
            `;
        }

        bindEvents() {
            // Live Terminal Inputs binding
            const affIdInput = document.getElementById('terminal-affiliate-id');
            const sourceInput = document.getElementById('terminal-utm-source');
            const mediumInput = document.getElementById('terminal-utm-medium');
            const campaignInput = document.getElementById('terminal-utm-campaign');
            const subIdInput = document.getElementById('terminal-sub-id');

            const handleInputChange = () => {
                this.affiliateId = affIdInput.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') || "ALPHA_PARTNER";
                affIdInput.value = this.affiliateId;
                this.utmSource = sourceInput.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                sourceInput.value = this.utmSource;
                this.utmMedium = mediumInput.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                mediumInput.value = this.utmMedium;
                this.utmCampaign = campaignInput.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                campaignInput.value = this.utmCampaign;
                this.subId = subIdInput.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                subIdInput.value = this.subId;

                this.addLog(`LINK METADATA UPDATE: ${this.affiliateId}`);
                this.updateOutput();
            };

            affIdInput.addEventListener('keyup', handleInputChange);
            sourceInput.addEventListener('keyup', handleInputChange);
            mediumInput.addEventListener('keyup', handleInputChange);
            campaignInput.addEventListener('keyup', handleInputChange);
            subIdInput.addEventListener('keyup', handleInputChange);

            // Copy Link
            document.getElementById('btn-copy-link').addEventListener('click', () => {
                const linkText = document.getElementById('compiled-link-display').innerText;
                this.copyTextToClipboard(linkText, "AFFILIATE DYNAMIC LINK COPIED!");
            });

            // Swipe Tabs binding
            const tabButtons = document.querySelectorAll('.swipe-tab-btn');
            tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    tabButtons.forEach(b => b.classList.remove('bg-black', 'text-white'));
                    btn.classList.add('bg-black', 'text-white');
                    this.activeSwipeIndex = parseInt(btn.getAttribute('data-index'), 10);
                    this.updateSwipeDisplay();
                    this.addLog(`SWIPE ACQUIRED: TAB [${this.activeSwipeIndex + 1}]`);
                });
            });

            // Copy Swipe
            document.getElementById('btn-copy-swipe').addEventListener('click', () => {
                const swipeBody = document.getElementById('swipe-body-display').value;
                this.copyTextToClipboard(swipeBody, "MARKETING SWIPE CONTENT DEPLOYED TO CLIPBOARD!");
            });
        }

        updateOutput() {
            // Build dynamic target path link
            const baseUrl = `https://moonshine.capital/?ref=${this.affiliateId}`;
            const utmParts = [];
            if (this.utmSource) utmParts.push(`utm_source=${this.utmSource}`);
            if (this.utmMedium) utmParts.push(`utm_medium=${this.utmMedium}`);
            if (this.utmCampaign) utmParts.push(`utm_campaign=${this.utmCampaign}`);
            if (this.subId) utmParts.push(`sub_id=${this.subId}`);

            const compiledUrl = utmParts.length > 0 ? `${baseUrl}&${utmParts.join('&')}` : baseUrl;
            this.compiledLink = compiledUrl;

            // Output generated path
            document.getElementById('compiled-link-display').innerText = compiledUrl;

            // Inject into live brand asset indicators inside banners
            const indicators = document.querySelectorAll('.banner-affiliate-indicator');
            indicators.forEach(ind => {
                ind.innerText = this.affiliateId;
            });

            // Update Marketing Swipes live previews
            this.updateSwipeDisplay();
        }

        updateSwipeDisplay() {
            const currentSwipe = ASSET_VAULT_DATA.swipes[this.activeSwipeIndex];
            if (!currentSwipe) return;

            document.getElementById('swipe-category-display').innerText = currentSwipe.category;
            
            // Render dynamically replaced tags
            let resolvedSubject = currentSwipe.subject
                .replace(/\[PARTNER_ID\]/g, this.affiliateId)
                .replace(/\[TRACKING_URL\]/g, this.compiledLink);
            
            let resolvedBody = currentSwipe.body
                .replace(/\[PARTNER_ID\]/g, this.affiliateId)
                .replace(/\[TRACKING_URL\]/g, this.compiledLink);

            document.getElementById('swipe-subject-display').innerText = resolvedSubject;
            document.getElementById('swipe-body-display').value = resolvedBody;
        }

        copyBannerCode(bannerId) {
            const banner = ASSET_VAULT_DATA.banners.find(b => b.id === bannerId);
            if (!banner) return;

            const codeStr = `<!-- MOONSHINE PARTNER NEON BANNER EMBED -->\n<a href="${this.compiledLink}" target="_blank" style="text-decoration: none; display: inline-block;">\n  <div style="background-color: ${banner.bg}; color: ${banner.textColor}; font-family: sans-serif; border: 4px solid #000000; padding: 20px; text-align: center; max-width: ${banner.width}px; box-shadow: 6px 6px 0px 0px #000000;">\n    <p style="font-weight: 900; font-size: 1.25rem; margin: 0; text-transform: uppercase;">${banner.tagline}</p>\n    <p style="font-size: 0.75rem; font-weight: bold; margin-top: 5px; opacity: 0.8;">TRACKING ID: ${this.affiliateId}</p>\n  </div>\n</a>`;
            this.copyTextToClipboard(codeStr, "BANNER IFRAME/HTML COMPONENT COPIED!");
        }

        addLog(message) {
            const time = new Date().toTimeString().split(' ')[0];
            const formattedLog = `&gt; [${time}] ${message}`;
            this.terminalLogs.push(formattedLog);

            // Keep array size checked
            if (this.terminalLogs.length > 15) this.terminalLogs.shift();

            const terminalScreen = document.getElementById('terminal-screen');
            if (terminalScreen) {
                terminalScreen.innerHTML = this.terminalLogs.map(log => `<div>${log}</div>`).join('');
                // Instant snap scroll to bottom of simulated command line
                terminalScreen.scrollTop = terminalScreen.scrollHeight;
            }
        }

        copyTextToClipboard(text, successMessage) {
            navigator.clipboard.writeText(text).then(() => {
                this.addLog(`CLIPBOARD SUCCESS: DATA SAVED.`);
                alert(`[MOONSHINE CORE DESK SECURE]\n\n${successMessage}`);
            }).catch(err => {
                this.addLog(`CLIPBOARD FAILURE ERROR.`);
                console.error('Could not copy text: ', err);
            });
        }
    }

    // Export class globally and instantiate
    window.MoonshineLinkBuilder = MoonshineLinkBuilder;

    document.addEventListener("DOMContentLoaded", () => {
        // Automatically inject inside a default target container if it exists, or dynamically append to main
        window.MoonshineLinkBuilderInstance = new MoonshineLinkBuilder("moonshine-link-builder-root");
    });
})();