/**
 * ACQUISITION INDEX // DEAL INTELLIGENCE ROOM
 * File: listing-vault.js
 * Purpose: Interactive Financial Tear Sheet & Due Diligence Vault
 */

const ListingVault = (function() {
    const state = {
        activeDeal: null,
        isUnlocked: false
    };

    const styles = `
        .vault-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--obsidian);
            z-index: 2000;
            overflow-y: auto;
            padding: 0;
            display: none;
            color: var(--bone);
        }

        .vault-container {
            max-width: 1400px;
            margin: 0 auto;
            border-left: 1px solid var(--graphite);
            border-right: 1px solid var(--graphite);
            min-height: 100vh;
        }

        .vault-header {
            padding: 2rem;
            border-bottom: 2px solid var(--bone);
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            background: linear-gradient(to bottom, #0a0a0a, var(--obsidian));
        }

        .intel-badge {
            background: var(--blood-orange);
            color: var(--bone);
            padding: 4px 12px;
            font-size: 0.7rem;
            font-weight: 900;
            letter-spacing: 0.1em;
            margin-bottom: 1rem;
            display: inline-block;
        }

        .vault-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 0;
            border-bottom: 1px solid var(--graphite);
        }

        .main-intelligence {
            padding: 3rem;
            border-right: 1px solid var(--graphite);
        }

        .sidebar-vault {
            padding: 3rem;
            background: rgba(20, 20, 20, 0.5);
        }

        .financial-hero {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
            margin-bottom: 4rem;
        }

        .big-metric {
            border-top: 1px solid var(--copper);
            padding-top: 1rem;
        }

        .big-metric .label {
            font-family: 'JetBrains Mono';
            color: var(--copper);
            font-size: 0.7rem;
            margin-bottom: 0.5rem;
        }

        .big-metric .value {
            font-size: 2.5rem;
            font-weight: 900;
        }

        .chart-container {
            height: 300px;
            width: 100%;
            margin: 2rem 0;
            background: repeating-linear-gradient(0deg, transparent, transparent 39px, var(--graphite) 40px);
            position: relative;
            display: flex;
            align-items: flex-end;
            gap: 10px;
            padding: 0 10px;
        }

        .chart-bar {
            flex: 1;
            background: var(--acid-green);
            position: relative;
            transition: height 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .chart-bar::after {
            content: attr(data-year);
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'JetBrains Mono';
            font-size: 0.6rem;
            color: var(--copper);
        }

        .narrative-section {
            margin-top: 5rem;
            max-width: 800px;
        }

        .narrative-section h2 {
            font-family: 'Playfair Display', serif;
            text-transform: none;
            font-style: italic;
            font-size: 3rem;
            margin-bottom: 2rem;
            color: var(--bone);
        }

        .narrative-body {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #ccc;
            column-count: 2;
            column-gap: 3rem;
        }

        .doc-item {
            padding: 1.5rem;
            border: 1px solid var(--graphite);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: all 0.2s;
            cursor: pointer;
        }

        .doc-item:hover {
            border-color: var(--acid-green);
            background: #1a1a1a;
        }

        .doc-icon {
            color: var(--copper);
        }

        .lock-overlay {
            background: rgba(5, 5, 5, 0.9);
            backdrop-filter: blur(4px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
            border: 1px dashed var(--blood-orange);
        }

        .btn-close {
            background: transparent;
            border: 1px solid var(--bone);
            color: var(--bone);
            padding: 0.5rem 1rem;
            font-family: 'JetBrains Mono';
            cursor: pointer;
        }

        .btn-close:hover {
            background: var(--bone);
            color: var(--obsidian);
        }
    `;

    function init() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const overlay = document.createElement("div");
        overlay.id = "vault-intelligence-room";
        overlay.className = "vault-overlay";
        document.body.appendChild(overlay);
    }

    function generateBars(data) {
        const max = Math.max(...data.values);
        return data.values.map((v, i) => `
            <div class="chart-bar" 
                 style="height: ${(v / max) * 100}%" 
                 data-year="${data.years[i]}">
                 <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono'; font-size: 0.6rem;">
                    $${(v / 1000).toFixed(0)}k
                 </div>
            </div>
        `).join('');
    }

    function open(deal) {
        state.activeDeal = deal;
        const container = document.getElementById("vault-intelligence-room");
        
        // Mock historical data
        const history = {
            years: [2020, 2021, 2022, 2023, 2024],
            values: [deal.revenue * 0.7, deal.revenue * 0.8, deal.revenue * 0.85, deal.revenue * 0.95, deal.revenue]
        };

        container.innerHTML = `
            <div class="vault-container">
                <header class="vault-header">
                    <div>
                        <div class="intel-badge">CONFIDENTIAL TEAR SHEET // SUBJECT: ${deal.id}</div>
                        <h1 style="font-size: 4rem;">${deal.title}</h1>
                        <div class="mono" style="color: var(--copper)">Location: ${deal.location} // Status: UNDER REVIEW</div>
                    </div>
                    <button class="btn-close" onclick="ListingVault.close()">CLOSE_TERMINAL</button>
                </header>

                <div class="vault-grid">
                    <section class="main-intelligence">
                        <div class="financial-hero">
                            <div class="big-metric">
                                <div class="label">ASKING PRICE</div>
                                <div class="value">$${(deal.asking / 1000000).toFixed(2)}M</div>
                            </div>
                            <div class="big-metric">
                                <div class="label">SDE (T12)</div>
                                <div class="value" style="color: var(--acid-green)">$${(deal.sde / 1000).toFixed(0)}K</div>
                            </div>
                            <div class="big-metric">
                                <div class="label">REVENUE (T12)</div>
                                <div class="value">$${(deal.revenue / 1000000).toFixed(1)}M</div>
                            </div>
                            <div class="big-metric">
                                <div class="label">MULTIPLE</div>
                                <div class="value" style="color: var(--copper)">${deal.multiple}</div>
                            </div>
                        </div>

                        <div class="mono" style="margin-bottom: 1rem;">// Revenue Growth Trajectory (5-Year)</div>
                        <div class="chart-container">
                            ${generateBars(history)}
                        </div>

                        <div class="narrative-section">
                            <div class="mono" style="color: var(--copper); margin-bottom: 1rem;">Operator Narrative</div>
                            <h2>A legacy of operational excellence and <span style="color: var(--copper)">moated market share.</span></h2>
                            <div class="narrative-body">
                                <p>Founded over a decade ago, this asset represents a dominant position in the ${deal.industry} space. Unlike typical competitors, the business has successfully pivoted to a recurring model with a 92% retention rate among its core client base. The current owner has focused on automating fulfillment, allowing for an owner-absentee structure.</p>
                                <p style="margin-top: 1rem;">There is significant white space in regional expansion and digital optimization. The sale includes all proprietary systems, a seasoned middle-management team, and long-term contracts currently valued at $1.2M in backlog. Ideal for a searcher or strategic buyer looking to bolt on a high-margin service arm.</p>
                            </div>
                        </div>

                        <div style="margin-top: 4rem;">
                            <div class="mono" style="margin-bottom: 2rem;">Asset Breakdown</div>
                            <table style="width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono'; font-size: 0.8rem;">
                                <tr style="border-bottom: 1px solid var(--graphite); color: var(--copper);">
                                    <th style="text-align: left; padding: 1rem;">ASSET TYPE</th>
                                    <th style="text-align: left; padding: 1rem;">VALUATION</th>
                                    <th style="text-align: right; padding: 1rem;">NOTES</th>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--graphite);">
                                    <td style="padding: 1rem;">Inventory / FFE</td>
                                    <td style="padding: 1rem;">$145,000</td>
                                    <td style="padding: 1rem; text-align: right;">Verified 2024</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--graphite);">
                                    <td style="padding: 1rem;">Intellectual Property</td>
                                    <td style="padding: 1rem;">$450,000</td>
                                    <td style="padding: 1rem; text-align: right;">Proprietary CMS</td>
                                </tr>
                                <tr>
                                    <td style="padding: 1rem;">Goodwill</td>
                                    <td style="padding: 1rem;">$605,000</td>
                                    <td style="padding: 1rem; text-align: right;">12+ Year Brand</td>
                                </tr>
                            </table>
                        </div>
                    </section>

                    <aside class="sidebar-vault">
                        <div class="mono" style="margin-bottom: 2rem; display: flex; align-items: center; gap: 10px;">
                            <span style="width: 8px; height: 8px; background: var(--blood-orange); border-radius: 50%;"></span>
                            SECURE DOCUMENT VAULT
                        </div>

                        <div class="doc-item">
                            <div class="doc-icon">PDF</div>
                            <div style="flex: 1">
                                <div class="mono" style="font-size: 0.7rem;">P&L_STATEMENTS_3YR.pdf</div>
                                <div style="font-size: 0.6rem; color: var(--copper);">2.4 MB // ENCRYPTED</div>
                            </div>
                        </div>

                        <div class="doc-item">
                            <div class="doc-icon">XLS</div>
                            <div style="flex: 1">
                                <div class="mono" style="font-size: 0.7rem;">CUSTOMER_CONCENTRATION.xlsx</div>
                                <div style="font-size: 0.6rem; color: var(--copper);">1.1 MB // ENCRYPTED</div>
                            </div>
                        </div>

                        <div class="doc-item">
                            <div class="doc-icon">PDF</div>
                            <div style="flex: 1">
                                <div class="mono" style="font-size: 0.7rem;">TAX_RETURNS_2021_2023.pdf</div>
                                <div style="font-size: 0.6rem; color: var(--copper);">8.9 MB // ENCRYPTED</div>
                            </div>
                        </div>

                        <div class="lock-overlay" style="margin-top: 2rem;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem; color: var(--blood-orange);">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <div class="mono" style="font-size: 0.8rem; margin-bottom: 1rem;">NDA REQUIRED FOR ACCESS</div>
                            <button class="btn-primary" style="padding: 1rem; width: 100%; background: var(--bone); color: var(--obsidian); border: none; font-weight: 900; text-transform: uppercase; cursor: pointer;">
                                Execute NDA & Unlock
                            </button>
                        </div>

                        <div style="margin-top: 4rem; padding: 1.5rem; border: 1px solid var(--copper);">
                            <div class="mono" style="color: var(--copper); font-size: 0.6rem; margin-bottom: 1rem;">Broker Information</div>
                            <div style="font-weight: 700; margin-bottom: 0.5rem;">VANDERBILT & ASSOCIATES</div>
                            <div class="mono" style="font-size: 0.7rem;">M&A Advisory Group</div>
                            <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--copper);">Lead Agent: Marcus Thorne</div>
                        </div>
                    </aside>
                </div>
            </div>
        `;
        
        container.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    function close() {
        document.getElementById("vault-intelligence-room").style.display = "none";
        document.body.style.overflow = "auto";
    }

    // Initialize on load
    init();

    // Export public methods
    return {
        open: open,
        close: close
    };
})();

// Wire into the global scope for the existing buttons
window.openDeal = function(id) {
    const deal = DEALS.find(d => d.id === id);
    if (deal) {
        ListingVault.open(deal);
    }
};

window.ListingVault = ListingVault;