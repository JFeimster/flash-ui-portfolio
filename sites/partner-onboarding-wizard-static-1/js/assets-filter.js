// MOONSHINE CAPITAL PARTNERS - MARKETING ASSETS & SWIPE FILES LIBRARY FILTER ENGINE
// Dynamic asymmetrical rendering, clipboard capture systems, and download progress simulations.

const SWIPE_ASSETS = [
    {
        id: "swipe-1",
        title: "THE RAW HOOK SEQUENCE",
        category: "twitter",
        type: "Twitter / X Post",
        size: "1.2 KB",
        tags: ["HIGH-CONVERSION", "SHORT-FORM"],
        content: "Stop begging legacy banks for slow-motion capital. 🛑\n\nWe approve commercial pipelines in under 24 hours. No corporate red tape. Just high-velocity fuel for your business.\n\nLock in your direct coordinate here: {LINK}",
        isFeatured: true
    },
    {
        id: "swipe-2",
        title: "CORPORATE DISRUPTOR FRAMEWORK",
        category: "linkedin",
        type: "LinkedIn Article",
        size: "3.4 KB",
        tags: ["B2B-INTEL", "LONG-FORM"],
        content: "The soft corporate handshake is dead. Business owners don't need pitch decks and 4-week approval cycles; they need raw liquidity.\n\nAt Moonshine Capital Partners, we've automated the bridge-finance architecture to clear targets within a single solar cycle. Direct. Decentralized. Devastatingly fast.\n\nReady to scale without permission? Connect to my private routing portal here: {LINK}\n\n#VentureCapital #Fintech #DebtArchitecture #ScaleOrDie",
        isFeatured: false
    },
    {
        id: "swipe-3",
        title: "LEADERBOARD RADICAL BANNER (728x90)",
        category: "banners",
        type: "Layered Web Asset",
        size: "14.2 MB",
        tags: ["PSD", "RAW-VECTOR", "HIGH-VISIBILITY"],
        content: "--- WEB_BANNER_ASSET_PACK_V1 ---\nIncludes dark-mode neon glitch variants, brutal high-contrast frames, and scalable vector raw SVGs. Fully optimized for high-traffic acquisition funnels.",
        isFeatured: true
    },
    {
        id: "swipe-4",
        title: "COLD INJECTION OUTREACH SEQUENCE",
        category: "emails",
        type: "Email Template",
        size: "4.8 KB",
        tags: ["COLD-OUTREACH", "CONVERSION-OPTIMIZED"],
        content: "Subject: Quick question regarding pipeline expansion at {COMPANY_NAME}\n\nHey {CONTACT_NAME},\n\nI noticed you're scaling operations. Most firms limit themselves to traditional bank lines that take 45 days to close. We don't.\n\nWe provide direct commercial bridge pipelines from $50K to $2M, authorized in 24 hours based entirely on your real operational metrics.\n\nNo board approvals. No bureaucratic friction.\n\nRun the calculation here via my secured channel: {LINK}\n\nRespectfully,\n{PARTNER_NAME}\nMoonshine Alliance Network",
        isFeatured: false
    },
    {
        id: "swipe-5",
        title: "THE NO-NONSENSE TELEGRAM BLAST",
        category: "twitter",
        type: "Telegram / Signal Copy",
        size: "0.8 KB",
        tags: ["DIRECT-FIRE", "URGENT"],
        content: "🚨 RAW CAPITAL ALERT 🚨\n\nNeed operational liquidity to scale your fleet or bridge invoices? Do not dilute equity. Grab non-dilutive capital structures via Moonshine Capital.\n\nInstant target scanning active now: {LINK}",
        isFeatured: false
    },
    {
        id: "swipe-6",
        title: "SQUARE BRAND INTRUSION BOX (1080x1080)",
        category: "banners",
        type: "Social Frame Asset",
        size: "8.7 MB",
        tags: ["FIGMA", "PNG-ALPHAS"],
        content: "--- SOCIAL_SQUARE_ASSET_PACK_V1 ---\nOptimized for high CTR on Instagram and Twitter feeds. Features raw neo-brutalist orange border graphics, hard shadows, and flashing attention badges.",
        isFeatured: false
    }
];

let activeFilter = 'all';

// Initialize component when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    injectAssetsSection();
    renderAssets();
    setupFilters();
});

// Inject UI structure into the page
function injectAssetsSection() {
    const parent = document.getElementById('marketing-assets-root');
    if (!parent) return;

    parent.className = "w-full max-w-7xl mx-auto mt-12 bg-black text-white neo-border-white neo-shadow-white p-6 md:p-10 relative overflow-hidden";
    
    parent.innerHTML = `
        <!-- Header -->
        <div class="border-b-4 border-white pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <span class="bg-[#ff4800] text-black text-xs font-black px-3 py-1 uppercase tracking-widest inline-block mb-2">PROMOTIONAL FUEL DECK</span>
                <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tight">SWIPE & ASSET VAULT</h2>
                <p class="text-zinc-400 font-bold text-sm md:text-base mt-2 max-w-2xl">// DO NOT RE-INVENT THE WHEEL. COPY OUR HIGHEST CONVERTING STRUCTURES TO ROUTE TRAFFIC AND EXTRACT MAX COMMISSIONS.</p>
            </div>
            <div class="text-right font-mono text-xs text-zinc-500 hidden md:block">
                <span>DATABASE STATUS: ONLINE</span><br>
                <span>COORDINATES LOADED: ${SWIPE_ASSETS.length} NODES</span>
            </div>
        </div>

        <!-- Filters Block -->
        <div class="flex flex-wrap gap-2 mb-8" id="filter-triggers-container">
            <button data-filter="all" class="filter-btn bg-[#ff4800] text-black font-black uppercase px-6 py-3 border-4 border-black text-sm tracking-widest transition-all neo-btn-active">
                ALL ASSETS
            </button>
            <button data-filter="twitter" class="filter-btn bg-black text-white font-black uppercase px-6 py-3 border-4 border-white hover:bg-white hover:text-black text-sm tracking-widest transition-all">
                TWITTER / X
            </button>
            <button data-filter="linkedin" class="filter-btn bg-black text-white font-black uppercase px-6 py-3 border-4 border-white hover:bg-white hover:text-black text-sm tracking-widest transition-all">
                LINKEDIN
            </button>
            <button data-filter="banners" class="filter-btn bg-black text-white font-black uppercase px-6 py-3 border-4 border-white hover:bg-white hover:text-black text-sm tracking-widest transition-all">
                WEB BANNERS
            </button>
            <button data-filter="emails" class="filter-btn bg-black text-white font-black uppercase px-6 py-3 border-4 border-white hover:bg-white hover:text-black text-sm tracking-widest transition-all">
                EMAIL SWIPES
            </button>
        </div>

        <!-- Dynamic Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch" id="assets-grid-container">
            <!-- Rendered dynamically -->
        </div>

        <!-- Bottom Status -->
        <div class="border-t-4 border-white mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-zinc-500">
            <span>SECURE DOWNLOAD SHIELD: ACTIVE</span>
            <span>CLICK TO CAPTURE PLATFORM INSTRUCTIONS</span>
        </div>
    `;
}

// Setup click handlers for filters
function setupFilters() {
    const container = document.getElementById('filter-triggers-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        // Reset all button styles
        container.querySelectorAll('.filter-btn').forEach(b => {
            b.className = "filter-btn bg-black text-white font-black uppercase px-6 py-3 border-4 border-white hover:bg-white hover:text-black text-sm tracking-widest transition-all";
        });

        // Set active button style
        btn.className = "filter-btn bg-[#ff4800] text-black font-black uppercase px-6 py-3 border-4 border-black text-sm tracking-widest transition-all neo-btn-active";

        activeFilter = btn.getAttribute('data-filter');
        renderAssets();

        // Terminal Log Integration if available
        logToTerminal(`FILTER TRIGGERED: ${activeFilter.toUpperCase()}`);
    });
}

// Render filtered assets to grid
function renderAssets() {
    const grid = document.getElementById('assets-grid-container');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = SWIPE_ASSETS.filter(item => activeFilter === 'all' || item.category === activeFilter);

    filtered.forEach((asset, index) => {
        // Create asymmetrical spanning
        const isFeatured = asset.isFeatured;
        const colSpanClass = isFeatured ? 'md:col-span-2' : 'col-span-1';
        const cardBgClass = isFeatured ? 'bg-zinc-950 border-4 border-[#ff4800]' : 'bg-black border-4 border-white';

        const tagsHtml = asset.tags.map(t => `<span class="bg-zinc-800 text-zinc-300 px-2 py-0.5 text-[10px] font-mono tracking-widest border border-zinc-700">${t}</span>`).join('');

        const isMedia = asset.category === 'banners';

        const actionBtn = isMedia 
            ? `<button onclick="simulateDownload('${asset.id}', '${asset.size}')" id="dl-btn-${asset.id}" class="w-full bg-[#ff4800] text-black hover:bg-white font-black py-3 px-4 uppercase text-xs tracking-widest border-2 border-black transition-all flex items-center justify-center gap-2">
                <span>DOWNLOAD FILE (${asset.size})</span>
               </button>`
            : `<button onclick="copyToClipboard('${asset.id}')" id="copy-btn-${asset.id}" class="w-full bg-white text-black hover:bg-[#ff4800] font-black py-3 px-4 uppercase text-xs tracking-widest border-2 border-black transition-all flex items-center justify-center gap-2">
                <span>COPY TO CLIPBOARD</span>
               </button>`;

        const previewContainer = isMedia
            ? `<div class="bg-zinc-900 border-2 border-dashed border-zinc-700 p-4 font-mono text-xs text-zinc-500 flex flex-col justify-between min-h-[140px]">
                 <div class="flex items-center justify-between">
                     <span class="text-[#ff4800]">RAW_PREVIEW_ACTIVE</span>
                     <span>${asset.type}</span>
                 </div>
                 <div class="text-center py-4 font-black tracking-widest text-zinc-400">[MEDIA PACK DISPATCH]</div>
                 <div class="flex justify-between items-center text-[10px] text-zinc-600">
                     <span>FILE: MCP_${asset.id.toUpperCase()}_REV2.ZIP</span>
                     <span>COMPRESSED: YES</span>
                 </div>
               </div>`
            : `<div class="relative bg-zinc-900 p-4 border-2 border-zinc-700 font-mono text-xs text-zinc-300 whitespace-pre-wrap select-all leading-relaxed max-h-48 overflow-y-auto break-words">
                 ${asset.content}
               </div>`;

        const card = document.createElement('div');
        card.className = `${colSpanClass} ${cardBgClass} p-5 flex flex-col justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_#ff4800]`;
        card.innerHTML = `
            <div class="space-y-3">
                <div class="flex justify-between items-start gap-2">
                    <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">// ${asset.type}</span>
                    <span class="bg-black border border-white text-white font-mono text-[10px] px-1.5 py-0.5">${asset.size}</span>
                </div>
                <h3 class="text-xl font-black uppercase tracking-tight text-white">${asset.title}</h3>
                <div class="flex flex-wrap gap-1">${tagsHtml}</div>
                ${previewContainer}
            </div>
            
            <!-- Dynamic Progress Bar (Hidden initially) -->
            <div id="progress-container-${asset.id}" class="hidden w-full border-2 border-white bg-zinc-950 p-2 font-mono text-xs">
                <div class="flex justify-between mb-1">
                    <span class="text-[#ff4800] blink">// RUNNING SYSTEM RETRIEVAL</span>
                    <span id="progress-pct-${asset.id}">0%</span>
                </div>
                <div class="w-full bg-zinc-800 h-3 border border-black overflow-hidden relative">
                    <div id="progress-bar-${asset.id}" class="bg-[#ff4800] h-full transition-all duration-75" style="width: 0%"></div>
                </div>
            </div>

            <div>
                ${actionBtn}
            </div>
        `;

        grid.appendChild(card);
    });
}

// Clipboard Action
function copyToClipboard(id) {
    const asset = SWIPE_ASSETS.find(item => item.id === id);
    if (!asset) return;

    // Use Web API to copy
    navigator.clipboard.writeText(asset.content).then(() => {
        const btn = document.getElementById(`copy-btn-${id}`);
        if (!btn) return;

        const originalText = btn.innerHTML;
        btn.className = "w-full bg-[#00ff66] text-black font-black py-3 px-4 uppercase text-xs tracking-widest border-2 border-black transition-all flex items-center justify-center gap-2";
        btn.innerHTML = "<span>COPIED TO CLIPBOARD! ✓</span>";

        logToTerminal(`CLIPBOARD CAPTURED: ${asset.title}`);

        setTimeout(() => {
            btn.className = "w-full bg-white text-black hover:bg-[#ff4800] font-black py-3 px-4 uppercase text-xs tracking-widest border-2 border-black transition-all flex items-center justify-center gap-2";
            btn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy secure package: ', err);
    });
}

// Simulated Brutalist Progress Download
function simulateDownload(id, size) {
    const btn = document.getElementById(`dl-btn-${id}`);
    const progressContainer = document.getElementById(`progress-container-${id}`);
    const progressBar = document.getElementById(`progress-bar-${id}`);
    const progressPct = document.getElementById(`progress-pct-${id}`);

    if (!btn || !progressContainer) return;

    // Hide download button, show dynamic progress block
    btn.classList.add('hidden');
    progressContainer.classList.remove('hidden');

    logToTerminal(`INITIALIZING PACKET FETCH FOR ID: ${id}`);

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            progressPct.innerText = "DONE";
            progressBar.style.backgroundColor = "#00ff66";
            logToTerminal(`PACKET RETRIEVAL COMPLETE. SIZE: ${size}`);

            setTimeout(() => {
                // Return to static state
                progressContainer.classList.add('hidden');
                btn.classList.remove('hidden');
                btn.className = "w-full bg-[#00ff66] text-black font-black py-3 px-4 uppercase text-xs tracking-widest border-2 border-black transition-all flex items-center justify-center gap-2";
                btn.innerHTML = `<span>DOWNLOADED SUCCESSFULLY ✓</span>`;
                
                setTimeout(() => {
                    btn.className = "w-full bg-[#ff4800] text-black hover:bg-white font-black py-3 px-4 uppercase text-xs tracking-widest border-2 border-black transition-all flex items-center justify-center gap-2";
                    btn.innerHTML = `<span>DOWNLOAD FILE (${size})</span>`;
                    progressBar.style.backgroundColor = "#ff4800";
                    progressBar.style.width = "0%";
                    progressPct.innerText = "0%";
                }, 2000);
            }, 800);
        } else {
            width += Math.floor(Math.random() * 15) + 5;
            if (width > 100) width = 100;
            progressBar.style.width = width + '%';
            progressPct.innerText = width + '%';
        }
    }, 120);
}

// Integration Hook to log updates directly back to Moonshine HQ Support Terminal
function logToTerminal(message) {
    const chat = document.getElementById('chat-messages');
    if (!chat) return;

    chat.innerHTML += `<p><span class="text-[#ff4800] font-bold">SWIPE_VAULT_LOG:</span> ${message.toUpperCase()}</p>`;
    chat.scrollTop = chat.scrollHeight;
}