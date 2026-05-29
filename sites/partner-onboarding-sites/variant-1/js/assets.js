/**
 * MOONSHINE CAPITAL PARTNERS - MARKETING ASSET & LINK VAULT
 * Core Assets Database and Interactive Neo-Brutalist Rendering Engine
 */

window.MoonshineAssets = {
    categories: {
        BANNERS: 'banners',
        SWIPES: 'swipes',
        EMAILS: 'emails',
        URL_BUILDER: 'url-builder'
    },

    banners: [
        {
            id: 'banner-01',
            title: 'THE LIQUIDITY ENGINE',
            dim: '1080 x 1080',
            aspect: 'SQUARE (FEED)',
            format: 'SVG / VECTOR',
            color: '#ff4800',
            bg: '#000000',
            text: '24HR CAPITAL',
            accentText: 'NO BUREAUCRACY',
            svgMarkup: `
                <svg viewBox="0 0 400 400" class="w-full h-full bg-black border-4 border-white font-sans" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#222" stroke-width="2"/>
                        </pattern>
                    </defs>
                    <rect width="400" height="400" fill="url(#grid)" />
                    <!-- Diagonal stripes -->
                    <path d="M 0 0 L 80 0 L 0 80 Z" fill="#ff4800" />
                    <path d="M 320 400 L 400 400 L 400 320 Z" fill="#ff4800" />
                    <!-- Central Brutalist Frame -->
                    <rect x="40" y="40" width="320" height="320" fill="none" stroke="#ffffff" stroke-width="6" />
                    <rect x="48" y="48" width="304" height="304" fill="none" stroke="#ff4800" stroke-width="4" />
                    
                    <!-- Text blocks -->
                    <rect x="60" y="80" width="280" height="50" fill="#ff4800" stroke="#ffffff" stroke-width="4" />
                    <text x="75" y="115" font-family="'Impact', 'Arial Black', sans-serif" font-size="28" font-weight="900" fill="#000000" letter-spacing="1">MOONSHINE</text>
                    
                    <text x="60" y="195" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="2">24HR CAPITAL</text>
                    <text x="60" y="245" font-family="'Impact', 'Arial Black', sans-serif" font-size="34" font-weight="900" fill="#00ff66" letter-spacing="1">NO BUREAUCRACY</text>
                    
                    <!-- Subline -->
                    <line x1="60" y1="280" x2="340" y2="280" stroke="#ffffff" stroke-width="4" />
                    <text x="60" y="315" font-family="monospace" font-size="12" fill="#aaaaaa">// ZERO LIQUIDITY DELAYS. DEALS SECURED QUICKLY.</text>
                </svg>
            `
        },
        {
            id: 'banner-02',
            title: 'MAX VELOCITY FUNDING',
            dim: '1200 x 630',
            aspect: 'LANDSCAPE (SHARE)',
            format: 'SVG / VECTOR',
            color: '#00ff66',
            bg: '#111111',
            text: 'FAST WIRE CODES',
            accentText: '4% COMMISSION',
            svgMarkup: `
                <svg viewBox="0 0 600 315" class="w-full h-full bg-[#111111] border-4 border-white font-sans" xmlns="http://www.w3.org/2000/svg">
                    <rect width="600" height="315" fill="#111111" />
                    <!-- Tech grids & crosshairs -->
                    <line x1="0" y1="157" x2="600" y2="157" stroke="#333" stroke-dasharray="5,5" stroke-width="2" />
                    <line x1="300" y1="0" x2="300" y2="315" stroke="#333" stroke-dasharray="5,5" stroke-width="2" />
                    
                    <!-- Outer Brutalist frame -->
                    <rect x="20" y="20" width="560" height="275" fill="none" stroke="#ffffff" stroke-width="4" />
                    
                    <!-- Top tag -->
                    <rect x="40" y="40" width="180" height="30" fill="#00ff66" stroke="#ffffff" stroke-width="3" />
                    <text x="50" y="60" font-family="'Impact', 'Arial Black', sans-serif" font-size="15" font-weight="900" fill="#000" letter-spacing="1">SYSTEM INITIALIZED</text>
                    
                    <!-- Huge heading -->
                    <text x="40" y="140" font-family="'Impact', 'Arial Black', sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="1">FAST WIRE CODES</text>
                    <text x="40" y="195" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-weight="900" fill="#ff4800" letter-spacing="1">UNLIMITED CAPITAL</text>
                    
                    <!-- Subtitle -->
                    <rect x="40" y="225" width="320" height="35" fill="#000000" stroke="#00ff66" stroke-width="2" />
                    <text x="50" y="247" font-family="monospace" font-size="14" fill="#00ff66" font-weight="bold">// TARGET: SMALL BUSINESSES $50K-$2M</text>
                </svg>
            `
        },
        {
            id: 'banner-03',
            title: 'STREET OPERATOR STORM',
            dim: '1080 x 1920',
            aspect: 'VERTICAL (STORY)',
            format: 'SVG / VECTOR',
            color: '#ffffff',
            bg: '#ff4800',
            text: 'WE FUND. YOU EARN.',
            accentText: 'DIRECT PIPELINE',
            svgMarkup: `
                <svg viewBox="0 0 360 640" class="w-full h-full bg-[#ff4800] border-4 border-white font-sans" xmlns="http://www.w3.org/2000/svg">
                    <rect width="360" height="640" fill="#ff4800" />
                    <!-- Extreme checkerboard strip -->
                    <g fill="#000000">
                        <rect x="0" y="0" width="40" height="40" />
                        <rect x="80" y="0" width="40" height="40" />
                        <rect x="160" y="0" width="40" height="40" />
                        <rect x="240" y="0" width="40" height="40" />
                        <rect x="320" y="0" width="40" height="40" />
                        
                        <rect x="40" y="40" width="40" height="40" />
                        <rect x="120" y="40" width="40" height="40" />
                        <rect x="200" y="40" width="40" height="40" />
                        <rect x="280" y="40" width="40" height="40" />
                    </g>
                    <!-- Frame -->
                    <rect x="20" y="100" width="320" height="510" fill="#000000" stroke="#ffffff" stroke-width="6" />
                    
                    <!-- Huge typography -->
                    <text x="40" y="190" font-family="'Impact', 'Arial Black', sans-serif" font-size="52" fill="#ffffff" letter-spacing="1">WE FUND.</text>
                    <text x="40" y="250" font-family="'Impact', 'Arial Black', sans-serif" font-size="52" fill="#00ff66" letter-spacing="1">YOU EARN.</text>
                    
                    <rect x="40" y="300" width="280" height="6" fill="#ff4800" />
                    
                    <!-- Middle text -->
                    <text x="40" y="350" font-family="'Impact', 'Arial Black', sans-serif" font-size="28" fill="#ffffff">NO MID-MAN DELAYS</text>
                    <text x="40" y="390" font-family="'Impact', 'Arial Black', sans-serif" font-size="22" fill="#ff4800">CASH APPROVED IN 24H</text>
                    
                    <!-- Decorative bottom code -->
                    <rect x="40" y="440" width="280" height="130" fill="#111" stroke="#333" stroke-width="2" />
                    <text x="55" y="475" font-family="monospace" font-size="14" fill="#00ff66">> PIPELINE ACTIVE</text>
                    <text x="55" y="505" font-family="monospace" font-size="14" fill="#ffffff">> UP TO 4% PAYOUTS</text>
                    <text x="55" y="535" font-family="monospace" font-size="14" fill="#aaaaaa">> SCAN PORTAL NOW</text>
                </svg>
            `
        }
    ],

    swipes: [
        {
            id: 'swipe-01',
            platform: 'X / TWITTER',
            hook: 'Ditch the corporate desk gymnastics.',
            body: 'Traditional banks take 45 days to reject business loans. We close and fund bridge capital structures in 24 hours. Got deals? Push them into Moonshine Capital Partner pipelines and clear uncapped commissions immediately. ⚡\n\nInitialize route below:',
            tags: '#AlternativeFinance #SMEFunding #HighVelocity #CapitalPartners'
        },
        {
            id: 'swipe-02',
            platform: 'LINKEDIN PROFESSIONAL',
            hook: 'High-octane commercial liquidity is no longer optional.',
            body: 'If your business operations are restricted by slow capital acquisition cycles, it is time to bypass traditional bureaucratic corridors. Moonshine Capital Partners provides real-time debt instruments, invoice factoring, and cash infusions up to $2M with simple, fast approvals.\n\nIntroduce your targets. Secure up to 4% commission structures. Zero friction.',
            tags: '#CommercialFinance #VentureCapital #PrivateDebt #AssetBacking'
        },
        {
            id: 'swipe-03',
            platform: 'DIRECT / CHAT / DISCORD',
            hook: 'Need emergency runway or scaling liquidity in 10 days?',
            body: 'Stop talking to account reps who don\'t own decisions. Moonshine Capital processes raw commercial deals straight to underwriting desk loops within hours. Tell me what cash injection you require to scale fleet, stock, or payroll today. Let\'s route it.',
            tags: ''
        }
    ],

    emails: [
        {
            id: 'email-01',
            subject: 'HIGH VELOCITY BRIDGE CAPITAL FOR [Company_Name] // INSTRUCTIONS',
            preview: 'Your bank is slowing down your scaling engine. Let\'s bypass them.',
            body: 'Hey [First_Name],\n\nI’ve been monitoring operations in your space. Most teams are suffering from standard banking lag—taking 4-6 weeks just to evaluate simple debt instruments.\n\nAt Moonshine Capital Partners, we execute fast. We deliver $50k to $2M bridges backed by raw performance data, deposits, or receivables. Process time is typically 24-48 hours from intake to wire.\n\nLet’s check your pipeline options here. No complex slide decks or soft handshakes needed.\n\nInitialize direct route: [Your_Custom_Route]\n\nBest,\n[Your_Name]'
        },
        {
            id: 'email-02',
            subject: 'UNBLOCKED LIQUIDITY PIPELINE: [Company_Name] REQUESTED',
            preview: 'Let’s clear the parameters for immediate cash infusion.',
            body: 'Hi [First_Name],\n\nIf you need heavy capital deployment options for expansion, inventory, or equipment acquisitions, do not wait on traditional venture debt.\n\nWe specialize in non-dilutive, fast-turnaround capital. Our team handles the heavy lifting, and we operate on clean, high-velocity terms.\n\nVerify your eligibility parameters now:\n[Your_Custom_Route]\n\nWe secure approval decisions within one business loop.\n\nRegards,\n[Your_Name]\nMoonshine Capital Route Operator'
        }
    ],

    destinations: [
        { label: 'Main Funnel Splash', value: 'https://moonshine.capital/' },
        { label: 'Quick Underwriting Portal', value: 'https://moonshine.capital/apply' },
        { label: 'High-Value Pitch Room', value: 'https://moonshine.capital/high-octane' }
    ],

    sources: [
        { label: 'Twitter (X)', value: 'twitter' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Email Outreach', value: 'cold-email' },
        { label: 'Direct Pitch / Call', value: 'direct' }
    ],

    /**
     * Copy text to clipboard with extreme flashing visual indicator
     */
    copyToClipboard: function(text, btnElement) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btnElement.innerHTML;
            
            // Extreme tactile feedback: Flash screen/button to highlight raw system action
            btnElement.classList.remove('bg-white', 'text-black', 'bg-[#ff4800]');
            btnElement.classList.add('bg-[#00ff66]', 'text-black');
            btnElement.innerHTML = 'COPIED TO SYSTEM LEDGER! ✓';

            // Custom Brutalist mini banner notification inside viewport
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-[#00ff66] text-black font-black p-4 border-4 border-black shadow-[4px_4px_0px_#000] z-50 uppercase font-mono tracking-wider text-xs animate-bounce';
            toast.innerText = '// PIPELINE INTEL COMMITTED TO MEMORY';
            document.body.appendChild(toast);

            setTimeout(() => {
                btnElement.innerHTML = originalText;
                btnElement.classList.remove('bg-[#00ff66]');
                btnElement.classList.add('bg-white', 'text-black');
                toast.remove();
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy to ledger: ', err);
        });
    },

    /**
     * Download SVG markup as a raw vector asset
     */
    downloadVector: function(svgMarkup, filename) {
        const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'moonshine-asset.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Initialize Dynamic Asset & Link Vault Interface inside target container
     */
    init: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Target container not found for Asset Vault Initialization: ' + containerId);
            return;
        }

        // Draw Brutalist Scaffold UI
        container.innerHTML = `
            <div class="bg-black text-white neo-border-white neo-shadow-white p-6 space-y-6">
                <!-- Vault Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-white pb-6 gap-4">
                    <div>
                        <div class="inline-block bg-[#ff4800] text-black text-xs font-black px-3 py-1 uppercase tracking-widest mb-2">
                            PARTNER DEPOT // LEVEL 01 ACCESS
                        </div>
                        <h2 class="text-3xl md:text-5xl font-black uppercase tracking-tight">MARKETING ASSETS & LINK VAULT</h2>
                    </div>
                    <div class="font-mono text-xs bg-zinc-900 border-2 border-zinc-700 p-2 text-[#00ff66]">
                        // SEED_STATUS: FULLY_LOADED<br>
                        // ARTIFACTS: ${this.banners.length + this.swipes.length + this.emails.length} FILES PRE-ROUTED
                    </div>
                </div>

                <!-- Blocky Filter Tabs -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button id="tab-btn-banners" onclick="window.MoonshineAssets.switchCategory('banners')" class="vault-tab-btn bg-[#ff4800] text-black font-black p-3 uppercase text-sm border-4 border-black hover:bg-white hover:text-black transition-colors focus:outline-none shadow-[4px_4px_0px_#fff]">
                        01. SOCIAL BANNERS
                    </button>
                    <button id="tab-btn-swipes" onclick="window.MoonshineAssets.switchCategory('swipes')" class="vault-tab-btn bg-black text-white font-black p-3 uppercase text-sm border-4 border-white hover:bg-white hover:text-black transition-colors focus:outline-none">
                        02. SWIPE COPY
                    </button>
                    <button id="tab-btn-emails" onclick="window.MoonshineAssets.switchCategory('emails')" class="vault-tab-btn bg-black text-white font-black p-3 uppercase text-sm border-4 border-white hover:bg-white hover:text-black transition-colors focus:outline-none">
                        03. EMAIL TEMPLATES
                    </button>
                    <button id="tab-btn-builder" onclick="window.MoonshineAssets.switchCategory('url-builder')" class="vault-tab-btn bg-black text-white font-black p-3 uppercase text-sm border-4 border-white hover:bg-white hover:text-black transition-colors focus:outline-none">
                        04. LINK BUILDER
                    </button>
                </div>

                <!-- Dynamic Workspace Content Pane -->
                <div id="vault-workspace" class="bg-zinc-950 p-4 md:p-6 border-4 border-white min-h-[400px]">
                    <!-- Injected Dynamically by Category Switcher -->
                </div>
            </div>
        `;

        // Load Default Tab
        this.switchCategory('banners');
    },

    /**
     * Switch Active UI Category
     */
    switchCategory: function(category) {
        // Reset tab designs
        const tabBtns = document.querySelectorAll('.vault-tab-btn');
        tabBtns.forEach(btn => {
            btn.className = "vault-tab-btn bg-black text-white font-black p-3 uppercase text-sm border-4 border-white hover:bg-white hover:text-black transition-colors focus:outline-none";
        });

        // Highlight Active Tab
        const activeBtn = document.getElementById(`tab-btn-${category}`);
        if (activeBtn) {
            activeBtn.className = "vault-tab-btn bg-[#ff4800] text-black font-black p-3 uppercase text-sm border-4 border-black hover:bg-white hover:text-black transition-colors focus:outline-none shadow-[4px_4px_0px_#fff]";
        }

        // Render target category data inside workspace
        const workspace = document.getElementById('vault-workspace');
        if (!workspace) return;

        workspace.innerHTML = '';

        if (category === this.categories.BANNERS) {
            this.renderBanners(workspace);
        } else if (category === this.categories.SWIPES) {
            this.renderSwipes(workspace);
        } else if (category === this.categories.EMAILS) {
            this.renderEmails(workspace);
        } else if (category === this.categories.URL_BUILDER) {
            this.renderUrlBuilder(workspace);
        }
    },

    /**
     * Render Banners Section
     */
    renderBanners: function(workspace) {
        let html = `
            <div class="space-y-6">
                <div class="border-b-2 border-zinc-800 pb-4">
                    <h3 class="text-xl font-black text-[#ff4800] uppercase">// HIGH-CONTRAST SOCMED DEPLOYMENTS</h3>
                    <p class="text-zinc-400 text-xs font-mono mt-1">RAW VECTOR GRAPHICS OPTIMIZED FOR AGGRESSIVE FEED PENETRATION. CLICK DOWNLOADS TO RETRIEVE RAW SVGS.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        `;

        this.banners.forEach((banner, idx) => {
            html += `
                <div class="bg-black border-4 border-white flex flex-col justify-between overflow-hidden shadow-[6px_6px_0px_#222]">
                    <div class="p-2 border-b-4 border-white bg-zinc-900 font-mono text-xs flex justify-between">
                        <span class="text-[#ff4800] font-black">${banner.aspect}</span>
                        <span>${banner.dim}</span>
                    </div>
                    
                    <div class="p-4 flex items-center justify-center bg-zinc-950 aspect-square relative group">
                        ${banner.svgMarkup}
                        <div class="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                            <span class="font-black text-lg text-white mb-2">${banner.title}</span>
                            <span class="font-mono text-xs text-[#00ff66] mb-4">// RAW VECTOR COMPILED</span>
                            <button onclick="window.MoonshineAssets.downloadVector(window.MoonshineAssets.banners[${idx}].svgMarkup, '${banner.id}.svg')" class="bg-[#ff4800] hover:bg-white text-black font-black text-xs uppercase py-2 px-4 border-2 border-black tracking-widest neo-btn active:translate-y-1">
                                FORCE DOWNLOAD SVG
                            </button>
                        </div>
                    </div>

                    <div class="p-4 bg-zinc-900 border-t-4 border-white flex flex-col gap-2">
                        <h4 class="font-black text-sm uppercase">${banner.title}</h4>
                        <div class="flex gap-2">
                            <button onclick="window.MoonshineAssets.downloadVector(window.MoonshineAssets.banners[${idx}].svgMarkup, '${banner.id}.svg')" class="flex-grow bg-white hover:bg-[#ff4800] text-black font-black text-xs uppercase py-2 border-2 border-black transition-all">
                                GET SVG
                            </button>
                            <button onclick="window.MoonshineAssets.copyToClipboard(window.MoonshineAssets.banners[${idx}].svgMarkup, this)" class="flex-grow bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase py-2 border-2 border-white transition-all">
                                COPY CODE
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        workspace.innerHTML = html;
    },

    /**
     * Render Social Swipe Copy Section
     */
    renderSwipes: function(workspace) {
        let html = `
            <div class="space-y-6">
                <div class="border-b-2 border-zinc-800 pb-4">
                    <h3 class="text-xl font-black text-[#ff4800] uppercase">// SOCIAL VECTORIZED SHORTS & POST SWIPES</h3>
                    <p class="text-zinc-400 text-xs font-mono mt-1">HIGH-CONVERTING COPY BLOCKS READY FOR BROADCAST LOOPS. RE-ROUTE TARGET LINK SLUG MANUALLY.</p>
                </div>
                <div class="space-y-4">
        `;

        this.swipes.forEach((swipe) => {
            html += `
                <div class="bg-black border-4 border-white p-4 md:p-6 shadow-[6px_6px_0px_#ff4800] flex flex-col gap-4">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-dashed border-zinc-700 pb-2 gap-2">
                        <span class="bg-[#00ff66] text-black font-black text-xs px-2 py-1 uppercase tracking-wider">${swipe.platform}</span>
                        <span class="font-mono text-zinc-500 text-xs">// ARTIFACT ID: ${swipe.id}</span>
                    </div>

                    <div class="space-y-2">
                        <div class="text-white font-bold text-lg border-l-4 border-[#ff4800] pl-3 italic">
                            "${swipe.hook}"
                        </div>
                        <div class="bg-zinc-950 p-4 border border-zinc-800 font-mono text-xs md:text-sm text-zinc-300 whitespace-pre-line leading-relaxed selection:bg-[#ff4800] selection:text-black">
                            ${swipe.body}
                        </div>
                        ${swipe.tags ? `<div class="text-[#00ff66] font-mono text-xs font-black">${swipe.tags}</div>` : ''}
                    </div>

                    <div class="flex justify-end pt-2">
                        <button onclick="window.MoonshineAssets.copyToClipboard(\`${swipe.hook}\\n\\n${swipe.body}\\n\\n${swipe.tags}\`, this)" class="bg-white hover:bg-[#ff4800] hover:text-black text-black font-black px-6 py-3 uppercase text-xs border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all">
                            COPY TOTAL SWIPE BLOCK
                        </button>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        workspace.innerHTML = html;
    },

    /**
     * Render Email Outreaches
     */
    renderEmails: function(workspace) {
        let html = `
            <div class="space-y-6">
                <div class="border-b-2 border-zinc-800 pb-4">
                    <h3 class="text-xl font-black text-[#ff4800] uppercase">// COLD COGNITIVE COUPLINGS (EMAIL TEMPLATES)</h3>
                    <p class="text-zinc-400 text-xs font-mono mt-1">DIRECT OUTREACH STRUCTURES FOR CORPORATE PRODUCERS. SWAP RECIPIENT FIELDS IN YOUR SYSTEMS INSIDE BRACKETS.</p>
                </div>
                <div class="space-y-6">
        `;

        this.emails.forEach((email) => {
            html += `
                <div class="bg-zinc-900 border-4 border-white p-4 md:p-6 shadow-[6px_6px_0px_#222] flex flex-col gap-4">
                    <div class="border-b-2 border-white pb-3 space-y-1">
                        <div class="text-xs font-mono text-zinc-400 uppercase tracking-widest">// SUBJECT PROTOCOL</div>
                        <div class="font-black text-sm md:text-base text-white bg-black border border-zinc-800 p-2 break-words selection:bg-[#ff4800] selection:text-black">
                            ${email.subject}
                        </div>
                    </div>

                    <div class="space-y-1">
                        <div class="text-xs font-mono text-zinc-400 uppercase tracking-widest">// BODY ENGINE</div>
                        <div class="bg-black text-zinc-300 font-mono text-xs md:text-sm p-4 border border-zinc-800 whitespace-pre-wrap leading-relaxed selection:bg-[#ff4800] selection:text-black">
                            ${email.body}
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-2 justify-between items-center pt-2">
                        <span class="text-xs font-mono text-zinc-500 italic">// REPLACE: [Company_Name], [First_Name], [Your_Name]</span>
                        <button onclick="window.MoonshineAssets.copyToClipboard(\`Subject: ${email.subject}\\n\\n${email.body}\`, this)" class="w-full md:w-auto bg-white hover:bg-[#ff4800] hover:text-black text-black font-black px-6 py-3 uppercase text-xs border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all">
                            COPY TOTAL EMAIL INTEL
                        </button>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        workspace.innerHTML = html;
    },

    /**
     * Render Custom URL / Link Builder Engine
     */
    renderUrlBuilder: function(workspace) {
        // Find existing custom affiliate ID in system to lock as defaults, or default fallback
        const existingAffiliateInput = document.getElementById('affiliate-input');
        const defaultAffiliate = existingAffiliateInput && existingAffiliateInput.value.trim() 
            ? existingAffiliateInput.value.trim().toUpperCase().replace(/[^A-Z0-9-_]/g, '')
            : 'PARTNER_ROUTE_01';

        let html = `
            <div class="space-y-6">
                <div class="border-b-2 border-zinc-800 pb-4">
                    <h3 class="text-xl font-black text-[#ff4800] uppercase">// INTERACTIVE ROUTE DEPLOYMENT UTILITY</h3>
                    <p class="text-zinc-400 text-xs font-mono mt-1">GENERATE ACCURATE DEEP LINKS FOR SPECIFIC LANDINGS WITH UTM ATTRIBUTIONS TO HARNESS SYSTEM COMMISSIONS INSTANTLY.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Config Controls -->
                    <div class="bg-black p-4 border-4 border-white space-y-4 shadow-[4px_4px_0px_#fff]">
                        <div>
                            <label class="block text-xs font-black uppercase tracking-widest mb-1 text-[#ff4800]">// ENTER YOUR PARTNER SLUG</label>
                            <input type="text" id="builder-affiliate-id" value="${defaultAffiliate}" oninput="window.MoonshineAssets.generateUrlPreview()" 
                                class="w-full bg-zinc-950 text-white font-mono uppercase p-3 border-2 border-white focus:outline-none focus:border-[#ff4800]">
                        </div>

                        <div>
                            <label class="block text-xs font-black uppercase tracking-widest mb-1 text-zinc-400">// CHOOSE LANDING TARGET</label>
                            <select id="builder-destination" onchange="window.MoonshineAssets.generateUrlPreview()" 
                                class="w-full bg-zinc-950 text-white font-mono p-3 border-2 border-white focus:outline-none focus:border-[#ff4800]">
                                ${this.destinations.map(d => `<option value="${d.value}">${d.label} [${d.value}]</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-black uppercase tracking-widest mb-1 text-zinc-400">// CONTEXT TRACKING CHANNEL (UTM_SOURCE)</label>
                            <select id="builder-source" onchange="window.MoonshineAssets.generateUrlPreview()" 
                                class="w-full bg-zinc-950 text-white font-mono p-3 border-2 border-white focus:outline-none focus:border-[#ff4800]">
                                ${this.sources.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-black uppercase tracking-widest mb-1 text-zinc-400">// CAMPAIGN TAG (UTM_CAMPAIGN)</label>
                            <input type="text" id="builder-campaign" value="ONBOARD_LAUNCH_2024" oninput="window.MoonshineAssets.generateUrlPreview()" 
                                class="w-full bg-zinc-950 text-white font-mono uppercase p-3 border-2 border-white focus:outline-none focus:border-[#ff4800]">
                        </div>
                    </div>

                    <!-- Live Real-Time Output Console -->
                    <div class="bg-[#ff4800] text-black p-6 border-4 border-black flex flex-col justify-between shadow-[6px_6px_0px_#fff]">
                        <div class="space-y-4">
                            <div class="flex items-center gap-2">
                                <span class="bg-black text-[#00ff66] text-xs font-mono font-black px-2 py-1 uppercase tracking-widest blink">SYS_GENERATED_LIVE</span>
                            </div>
                            
                            <h4 class="font-black text-2xl uppercase tracking-tighter leading-none border-b-2 border-black pb-2">YOUR ACTIVE RAW OUTREACH ENDPOINT</h4>
                            
                            <div class="bg-black text-white p-4 border-2 border-black font-mono text-sm break-all font-bold min-h-[100px] select-all flex items-center shadow-[4px_4px_0px_#000]">
                                <span id="builder-output-preview" class="text-[#00ff66]">https://moonshine.capital/?aff=PARTNER_ROUTE_01&utm_source=twitter&utm_campaign=ONBOARD_LAUNCH_2024</span>
                            </div>
                        </div>

                        <div class="pt-4">
                            <button onclick="window.MoonshineAssets.copyBuiltUrl(this)" class="w-full bg-black text-white hover:bg-white hover:text-black font-black text-base py-4 border-4 border-black uppercase tracking-widest shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all">
                                LOCK & COPY LINK TO CLIPBOARD 📡
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        workspace.innerHTML = html;
        this.generateUrlPreview();
    },

    /**
     * Compute and Preview live dynamic URL parameters in Link Builder UI
     */
    generateUrlPreview: function() {
        const affVal = document.getElementById('builder-affiliate-id').value.trim().toUpperCase().replace(/[^A-Z0-9-_]/g, '') || 'YOUR-ID';
        const destVal = document.getElementById('builder-destination').value;
        const srcVal = document.getElementById('builder-source').value;
        const campVal = document.getElementById('builder-campaign').value.trim().toUpperCase().replace(/[^A-Z0-9-_]/g, '') || 'CAMPAIGN_NODE';

        // Build cleanly with standard parameters
        const urlObj = new URL(destVal);
        urlObj.searchParams.set('aff', affVal);
        urlObj.searchParams.set('utm_source', srcVal);
        urlObj.searchParams.set('utm_campaign', campVal);

        const targetField = document.getElementById('builder-output-preview');
        if (targetField) {
            targetField.innerText = urlObj.toString();
        }
    },

    /**
     * Copy constructed URL to Clipboard helper
     */
    copyBuiltUrl: function(btnElement) {
        const urlText = document.getElementById('builder-output-preview').innerText;
        this.copyToClipboard(urlText, btnElement);
    }
};

// Auto-inject vault dynamic container block once script is evaluated and root elements exist
document.addEventListener('DOMContentLoaded', () => {
    const rootEl = document.getElementById('asset-vault-root');
    if (rootEl) {
        window.MoonshineAssets.init('asset-vault-root');
    }
});