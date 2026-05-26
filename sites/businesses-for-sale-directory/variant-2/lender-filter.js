const LENDER_DATA = [
    {
        id: "fin-1",
        name: "First National SBA",
        type: "SBA 7(a)",
        rate: "7.5% - 9.25%",
        maxLTV: "90%",
        closingTime: "45-60 Days",
        minCheck: "$250k",
        maxCheck: "$5M",
        focus: "Main Street, Franchises",
        status: "Preferred"
    },
    {
        id: "fin-2",
        name: "Obsidian Credit Partners",
        type: "Mezzanine Debt",
        rate: "12% - 15%",
        maxLTV: "75%",
        closingTime: "21 Days",
        minCheck: "$1M",
        maxCheck: "$20M",
        focus: "SaaS, Manufacturing",
        status: "Institutional"
    },
    {
        id: "fin-3",
        name: "Alpha Equity Group",
        type: "Equity Partner",
        rate: "N/A (Equity)",
        maxLTV: "100%",
        closingTime: "60 Days",
        minCheck: "$500k",
        maxCheck: "No Limit",
        focus: "Roll-ups, Industrial",
        status: "High-Alpha"
    },
    {
        id: "fin-4",
        name: "Bridge Capital Direct",
        type: "Asset-Based",
        rate: "Prime + 2%",
        maxLTV: "80%",
        closingTime: "14 Days",
        minCheck: "$100k",
        maxCheck: "$10M",
        focus: "Inventory, Receivables",
        status: "Fast-Track"
    },
    {
        id: "fin-5",
        name: "Sovereign SBA 504",
        type: "SBA 504",
        rate: "6.2% Fixed",
        maxLTV: "90%",
        closingTime: "75 Days",
        minCheck: "$1M",
        maxCheck: "$15M",
        focus: "Owner-Occupied Real Estate",
        status: "Stable"
    },
    {
        id: "fin-6",
        name: "Blue-Chip Mezz Fund",
        type: "Unitranche",
        rate: "10% - 13%",
        maxLTV: "65%",
        closingTime: "30 Days",
        minCheck: "$3M",
        maxCheck: "$50M",
        focus: "EBITDA > $1M",
        status: "Growth"
    }
];

function initLenderMarketplace() {
    const mainContainer = document.querySelector('section.cta-section');
    if (!mainContainer) return;

    // Inject Marketplace styles
    const styles = document.createElement('style');
    styles.textContent = `
        .marketplace-overlay {
            background: var(--obsidian);
            padding: 4rem 2rem;
            border-top: var(--border-width) solid var(--bone);
        }
        .lender-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
            margin-top: 3rem;
        }
        .lender-card {
            background: var(--graphite);
            border: 1px solid #333;
            padding: 2rem;
            position: relative;
            transition: border-color 0.3s;
        }
        .lender-card:hover {
            border-color: var(--acid-green);
        }
        .lender-card .type-tag {
            font-size: 0.6rem;
            background: var(--bone);
            color: var(--obsidian);
            padding: 2px 6px;
            display: inline-block;
            margin-bottom: 1rem;
        }
        .lender-card h4 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            font-family: 'Inter', sans-serif;
            font-weight: 900;
        }
        .lender-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            border-top: 1px solid #333;
            padding-top: 1rem;
            margin-bottom: 1.5rem;
        }
        .l-stat .l-lbl { font-size: 0.6rem; color: var(--copper); text-transform: uppercase; }
        .l-stat .l-val { font-family: 'JetBrains Mono'; font-size: 0.9rem; color: var(--bone); }
        .lender-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .lender-status {
            font-family: 'JetBrains Mono';
            font-size: 0.65rem;
            color: var(--acid-green);
        }
        .apply-btn {
            background: transparent;
            border: 1px solid var(--bone);
            color: var(--bone);
            padding: 0.5rem 1rem;
            font-size: 0.7rem;
            font-weight: 700;
            cursor: pointer;
            text-transform: uppercase;
        }
        .apply-btn:hover {
            background: var(--bone);
            color: var(--obsidian);
        }
        .marketplace-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 2rem;
        }
        .filter-nav {
            display: flex;
            gap: 1rem;
        }
        .filter-nav button {
            background: none;
            border: none;
            color: var(--copper);
            font-family: 'JetBrains Mono';
            font-size: 0.7rem;
            cursor: pointer;
            padding-bottom: 4px;
            border-bottom: 1px solid transparent;
        }
        .filter-nav button.active {
            color: var(--acid-green);
            border-bottom-color: var(--acid-green);
        }
    `;
    document.head.appendChild(styles);

    // Create Marketplace Section
    const marketSection = document.createElement('section');
    marketSection.className = 'marketplace-overlay';
    marketSection.id = 'capital-stack-marketplace';
    marketSection.innerHTML = `
        <div class="marketplace-header">
            <div>
                <div class="mono" style="color: var(--acid-green); margin-bottom: 0.5rem;">// CAPITAL STACK MARKETPLACE</div>
                <h2 style="font-size: 3rem; text-transform: uppercase; font-weight: 900;">Vetted Funding <span class="editorial">Sources</span></h2>
            </div>
            <div class="filter-nav">
                <button class="active" data-type="all">ALL SOURCES</button>
                <button data-type="SBA">SBA LENDERS</button>
                <button data-type="Debt">PRIVATE DEBT</button>
                <button data-type="Equity">EQUITY</button>
            </div>
        </div>
        <div class="lender-grid" id="lender-grid"></div>
    `;

    mainContainer.after(marketSection);

    const renderLenders = (filter = 'all') => {
        const grid = document.getElementById('lender-grid');
        const filtered = LENDER_DATA.filter(l => {
            if (filter === 'all') return true;
            return l.type.includes(filter);
        });

        grid.innerHTML = filtered.map(l => `
            <div class="lender-card">
                <span class="type-tag mono">${l.type}</span>
                <h4>${l.name}</h4>
                <div class="lender-stats">
                    <div class="l-stat">
                        <div class="l-lbl">Interest Rate</div>
                        <div class="l-val">${l.rate}</div>
                    </div>
                    <div class="l-stat">
                        <div class="l-lbl">Max LTV</div>
                        <div class="l-val">${l.maxLTV}</div>
                    </div>
                    <div class="l-stat">
                        <div class="l-lbl">Closing Time</div>
                        <div class="l-val">${l.closingTime}</div>
                    </div>
                    <div class="l-stat">
                        <div class="l-lbl">Check Size</div>
                        <div class="l-val">${l.minCheck}+</div>
                    </div>
                </div>
                <div style="font-size: 0.75rem; color: var(--copper); margin-bottom: 1.5rem; height: 2.4rem; overflow: hidden;">
                    Focus: ${l.focus}
                </div>
                <div class="lender-footer">
                    <span class="lender-status mono">// ${l.status}</span>
                    <button class="apply-btn" onclick="alert('Accessing lender terminal for ${l.id}...')">Request Terms</button>
                </div>
            </div>
        `).join('');
    };

    // Filter Logic
    document.querySelectorAll('.filter-nav button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-nav button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderLenders(e.target.dataset.type);
        });
    });

    renderLenders();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenderMarketplace);
} else {
    initLenderMarketplace();
}

// Hook into existing navigation
const financingLink = document.querySelector('nav a:nth-child(3)');
if (financingLink) {
    financingLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('capital-stack-marketplace').scrollIntoView({ behavior: 'smooth' });
    });
}