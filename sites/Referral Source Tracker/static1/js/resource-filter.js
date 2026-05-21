const RESOURCES = [
    {
        id: 1,
        title: "SBA 7(a) Comparison Guide",
        category: "CPA/Accountant",
        type: "PDF Explainer",
        description: "A one-page breakdown comparing traditional bank loans vs. fast-track bridge funding.",
        tags: ["High-Level", "Educational"],
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`
    },
    {
        id: 2,
        title: "Closing the Gap Sequence",
        category: "Business Broker",
        type: "Email Sequence",
        description: "3-part email series designed to re-engage buyers who failed to qualify for SBA loans.",
        tags: ["Re-engagement", "Sales"],
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`
    },
    {
        id: 3,
        title: "Equipment Financing Cheat Sheet",
        category: "Equipment Dealer",
        type: "PDF Explainer",
        description: "A quick-reference for sales teams to identify which credit profiles fit which loan programs.",
        tags: ["Reference", "Sales"],
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>`
    },
    {
        id: 4,
        title: "The 'Tax Season' Liquidity Pitch",
        category: "CPA/Accountant",
        type: "Email Sequence",
        description: "Soft outreach for accountants to send to clients with high tax liabilities and low cash reserves.",
        tags: ["Seasonal", "Advisory"],
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`
    }
];

const DECK_TEMPLATES = {
    "CPA/Accountant": {
        headline: "Maximizing Your Client's Financial Health",
        sub: "Beyond Tax Planning: Providing Liquidity Solutions",
        points: ["Zero-Collateral Options", "Debt Consolidation", "24-Hour Funding Speed"],
        cta: "Download Co-Branded Slides"
    },
    "Business Broker": {
        headline: "Save Your Deal Pipeline",
        sub: "Creative Gap Financing for Acquisition Transactions",
        points: ["Bridge Loans for SBA Delays", "Non-Recourse Funding", "Higher Closing Ratios"],
        cta: "Download Deal-Saver Deck"
    },
    "Equipment Dealer": {
        headline: "Sell More Units Today",
        sub: "Instant Financing Solutions for Heavy Equipment",
        points: ["Credit scores down to 550", "App-only up to $250k", "Lease-back options"],
        cta: "Download Sales Toolset"
    }
};

/**
 * Initializes the Resource Library components
 */
function initResourceLibrary() {
    renderResources('All');
    setupPitchGenerator();
}

/**
 * Renders filtered resources to the container
 * @param {string} filterCategory 
 */
function renderResources(filterCategory) {
    const container = document.getElementById('resource-grid');
    if (!container) return;

    const filtered = filterCategory === 'All' 
        ? RESOURCES 
        : RESOURCES.filter(r => r.category === filterCategory);

    container.innerHTML = filtered.map(res => `
        <div class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all group">
            <div class="flex items-start justify-between mb-4">
                <div class="p-3 bg-slate-50 rounded-lg text-slate-700 group-hover:bg-amber-50 group-hover:text-[#d4af37] transition-colors">
                    ${res.icon}
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 rounded text-slate-500">
                    ${res.type}
                </span>
            </div>
            <h4 class="font-bold text-slate-900 mb-2">${res.title}</h4>
            <p class="text-sm text-slate-500 mb-4 leading-relaxed">${res.description}</p>
            <div class="flex flex-wrap gap-1 mb-4">
                ${res.tags.map(tag => `<span class="text-[9px] text-slate-400 border border-slate-100 px-2 rounded-full">${tag}</span>`).join('')}
            </div>
            <button onclick="handleDownload('${res.title}')" class="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-[#d4af37] hover:text-slate-900 transition-all">
                Download Resource
            </button>
        </div>
    `).join('');
}

/**
 * Updates the pitch deck preview based on persona
 */
function setupPitchGenerator() {
    const select = document.getElementById('deck-persona');
    const preview = document.getElementById('deck-preview');
    
    if (!select || !preview) return;

    const updatePreview = () => {
        const persona = select.value;
        const data = DECK_TEMPLATES[persona] || DECK_TEMPLATES["CPA/Accountant"];

        preview.innerHTML = `
            <div class="border-2 border-slate-900 rounded-lg overflow-hidden bg-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
                <div class="bg-slate-900 p-6 text-white">
                    <div class="flex justify-between items-center mb-4">
                        <div class="h-6 w-24 bg-white/20 rounded"></div>
                        <div class="text-[10px] uppercase tracking-widest opacity-60">Pitch Deck Preview</div>
                    </div>
                    <h2 class="text-2xl font-black text-[#d4af37] leading-tight mb-2">${data.headline}</h2>
                    <p class="text-slate-400 text-sm italic">${data.sub}</p>
                </div>
                <div class="p-6">
                    <ul class="space-y-3 mb-6">
                        ${data.points.map(p => `
                            <li class="flex items-center gap-3 text-sm font-medium text-slate-700">
                                <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                                ${p}
                            </li>
                        `).join('')}
                    </ul>
                    <button class="w-full py-3 bg-[#d4af37] text-slate-900 font-black uppercase text-xs tracking-widest rounded shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                        ${data.cta}
                    </button>
                </div>
            </div>
        `;
    };

    select.addEventListener('change', updatePreview);
    updatePreview();
}

/**
 * Mock download handler
 * @param {string} title 
 */
function handleDownload(title) {
    const btn = event.target;
    const originalText = btn.innerText;
    
    btn.innerText = "Downloading...";
    btn.classList.add('opacity-50');
    
    setTimeout(() => {
        alert(`Success: "${title}" has been added to your download queue.`);
        btn.innerText = originalText;
        btn.classList.remove('opacity-50');
    }, 800);
}

// Global filter bridge for existing navigation
window.filterResources = renderResources;

// Initial Call
document.addEventListener('DOMContentLoaded', initResourceLibrary);