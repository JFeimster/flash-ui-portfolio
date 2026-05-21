const ROUTES_DATA = [
    {
        id: "working-capital",
        category: "standard",
        name: "Working Capital",
        badge: "CORE ROUTE",
        description: "Optimized for established businesses needing growth capital for operations, payroll, or marketing.",
        timeframe: "24-72 Hours",
        maxAmount: "$500,000",
        rates: "8% - 24% APR",
        benefits: ["No collateral required", "Flexible use of funds", "Fixed payment schedules"],
        requirements: ["6 months in business", "$15k+ monthly revenue", "Business bank account"]
    },
    {
        id: "real-estate",
        category: "asset-based",
        name: "Real Estate Funding",
        badge: "ASSET ROUTE",
        description: "Specialized financing for fix-and-flip, bridge loans, or rental portfolio expansion.",
        timeframe: "7-14 Days",
        maxAmount: "$5,000,000",
        rates: "7% - 12% Interest Only",
        benefits: ["Bypasses personal DTI", "High leverage (up to 90% LTC)", "No prepay penalties"],
        requirements: ["Property address", "Experience track record", "Appraisal / HUD statement"]
    },
    {
        id: "equipment",
        category: "asset-based",
        name: "Equipment Financing",
        badge: "EQUIPMENT ROUTE",
        description: "Low-rate financing specifically for hardware, machinery, medical tools, or vehicles.",
        timeframe: "2-5 Days",
        maxAmount: "$1,000,000",
        rates: "5% - 15% APR",
        benefits: ["Tax benefits (Section 179)", "Preserves cash flow", "The equipment is the collateral"],
        requirements: ["Equipment quote/invoice", "620+ Credit Score", "2 Years Tax Returns"]
    },
    {
        id: "ecommerce",
        category: "specialty",
        name: "E-commerce Funding",
        badge: "DIGITAL ROUTE",
        description: "Revenue-based financing designed for high-volume online sellers and SaaS platforms.",
        timeframe: "24 Hours",
        maxAmount: "$2,000,000",
        rates: "6% - 12% Flat Fee",
        benefits: ["Repayment scales with sales", "No fixed term", "API-based underwriting"],
        requirements: ["Connected store data (Shopify/Amazon)", "6+ months sales history", "Consistent digital revenue"]
    },
    {
        id: "micro-funding",
        category: "speed",
        name: "Quick Micro-Funding",
        badge: "SPEED ROUTE",
        description: "Fast, small-batch capital for gig workers, freelancers, and micro-businesses.",
        timeframe: "Same Day",
        maxAmount: "$15,000",
        rates: "Factor-based",
        benefits: ["Ultra-fast approval", "Personal accounts accepted", "Minimum paperwork"],
        requirements: ["3 months bank data", "Government ID", "Active revenue flow"]
    },
    {
        id: "credit-prep",
        category: "nurture",
        name: "Business Credit Prep",
        badge: "REBUILD ROUTE",
        description: "The rebuild path to get you 'funding ready' by addressing credit or documentation gaps.",
        timeframe: "60-90 Days",
        maxAmount: "N/A (Nurture)",
        rates: "N/A",
        benefits: ["Builds Tier 1-3 credit", "Fixes entity compliance", "Unlocks prime rates"],
        requirements: ["Active EIN", "Entity formation docs", "Commitment to 90-day plan"]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('route-directory-grid');
    const searchInput = document.getElementById('route-search');
    const filterButtons = document.querySelectorAll('.filter-pill');

    function renderRoutes(filter = 'all', search = '') {
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const filtered = ROUTES_DATA.filter(route => {
            const matchesFilter = filter === 'all' || route.category === filter;
            const matchesSearch = route.name.toLowerCase().includes(search.toLowerCase()) || 
                                route.description.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-muted);">
                No routes found matching your criteria.
            </div>`;
            return;
        }

        filtered.forEach(route => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.style.cursor = 'default';
            card.innerHTML = `
                <div class="route-badge">${route.badge}</div>
                <h3 class="option-title" style="font-size: 1.4rem; margin-bottom: 10px;">${route.name}</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5;">${route.description}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; border-top: 1px solid var(--card-border); padding-top: 15px;">
                    <div>
                        <span style="display: block; font-size: 0.7rem; color: var(--neon-green); text-transform: uppercase; letter-spacing: 1px;">Speed</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 0.85rem;">${route.timeframe}</span>
                    </div>
                    <div>
                        <span style="display: block; font-size: 0.7rem; color: var(--electric-blue); text-transform: uppercase; letter-spacing: 1px;">Max Cap</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 0.85rem;">${route.maxAmount}</span>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="font-size: 0.75rem; margin-bottom: 8px; color: var(--text-main);">KEY BENEFITS</h4>
                    <ul class="prep-list" style="margin: 0;">
                        ${route.benefits.slice(0, 2).map(b => `<li style="font-size: 0.8rem; padding: 4px 0; border: none;">${b}</li>`).join('')}
                    </ul>
                </div>

                <button class="cta-button btn-outline" style="width: 100%; padding: 12px; font-size: 0.8rem;" onclick="window.location.href='#${route.id}'">
                    View Full Specs
                </button>
            `;
            grid.appendChild(card);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeFilter = document.querySelector('.filter-pill.active')?.dataset.filter || 'all';
            renderRoutes(activeFilter, e.target.value);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderRoutes(btn.dataset.filter, searchInput?.value || '');
        });
    });

    // Initial Render
    renderRoutes();
});

/**
 * UTILITY: Smooth scroll to route anchor
 */
function scrollToRoute(routeId) {
    const element = document.getElementById(routeId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * EXPOSE: For dynamic interactions from the matcher widget
 */
window.RouteFilter = {
    getRouteData: (id) => ROUTES_DATA.find(r => r.id === id),
    getAllRoutes: () => ROUTES_DATA
};