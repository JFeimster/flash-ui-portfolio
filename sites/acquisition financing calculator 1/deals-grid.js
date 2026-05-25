const dealsGridStyles = `
    .deals-registry-container {
        width: 100%;
        max-width: 1200px;
        margin: 60px auto;
        padding: 20px;
        background: var(--black);
    }

    .registry-header {
        border-left: var(--border-width) solid var(--acid-green);
        padding-left: 30px;
        margin-bottom: 60px;
    }

    .registry-header h2 {
        font-family: 'DM Serif Display', serif;
        font-size: 3.5rem;
        text-transform: uppercase;
        line-height: 1;
        letter-spacing: -2px;
    }

    .deals-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: var(--border-width);
        background-color: var(--bone-white);
        border: var(--border-width) solid var(--bone-white);
    }

    .deal-card {
        background-color: var(--black);
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: background-color 0.3s ease;
        min-height: 400px;
    }

    .deal-card:hover {
        background-color: #111;
    }

    .deal-sector {
        font-family: 'Inter', sans-serif;
        font-weight: 900;
        font-size: 0.7rem;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: var(--acid-green);
        margin-bottom: 20px;
    }

    .deal-name {
        font-family: 'DM Serif Display', serif;
        font-size: 2.2rem;
        line-height: 1.1;
        margin-bottom: 40px;
        text-transform: uppercase;
    }

    .deal-stats {
        border-top: 1px solid #333;
        padding-top: 25px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .stat-box .stat-label {
        display: block;
        font-family: 'Inter', sans-serif;
        font-size: 0.65rem;
        font-weight: 900;
        letter-spacing: 1px;
        text-transform: uppercase;
        opacity: 0.6;
        margin-bottom: 8px;
    }

    .stat-box .stat-value {
        font-family: 'DM Serif Display', serif;
        font-size: 1.8rem;
        color: var(--bone-white);
    }

    .stat-box .stat-value.highlight {
        color: var(--verdigris);
        font-style: italic;
    }

    .confidence-meter {
        margin-top: 30px;
    }

    .confidence-track {
        height: 6px;
        background: #222;
        width: 100%;
        margin-top: 10px;
    }

    .confidence-fill {
        height: 100%;
        background: var(--verdigris);
    }

    @media (max-width: 768px) {
        .deals-grid { grid-template-columns: 1fr; }
        .registry-header h2 { font-size: 2.5rem; }
    }
`;

const dealData = [
    {
        name: "Lumina Logistics Systems",
        sector: "Industrial Tech",
        ebitda: "4.2x",
        confidence: 88,
        ref: "AQC-901"
    },
    {
        name: "Vanguard Cold Chain",
        sector: "Infrastructure",
        ebitda: "5.8x",
        confidence: 94,
        ref: "AQC-442"
    },
    {
        name: "Omni-Channel Retail Corp",
        sector: "Consumer Goods",
        ebitda: "3.1x",
        confidence: 62,
        ref: "AQC-118"
    },
    {
        name: "Sovereign Health Data",
        sector: "SaaS / Bio",
        ebitda: "8.4x",
        confidence: 76,
        ref: "AQC-773"
    },
    {
        name: "Titan Precision Tooling",
        sector: "Manufacturing",
        ebitda: "4.9x",
        confidence: 91,
        ref: "AQC-205"
    },
    {
        name: "Neon-Grid Security",
        sector: "Cybersecurity",
        ebitda: "12.2x",
        confidence: 54,
        ref: "AQC-660"
    }
];

function initDealsRegistry() {
    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = dealsGridStyles;
    document.head.appendChild(styleSheet);

    // Create Registry Container
    const registryContainer = document.createElement("div");
    registryContainer.className = "deals-registry-container";

    // Header
    const header = document.createElement("div");
    header.className = "registry-header";
    header.innerHTML = `<h2>Deal Flow<br>Registry</h2>`;
    registryContainer.appendChild(header);

    // Grid
    const grid = document.createElement("div");
    grid.className = "deals-grid";

    // Generate Cards
    dealData.forEach(deal => {
        const card = document.createElement("div");
        card.className = "deal-card";
        card.innerHTML = `
            <div>
                <div class="deal-sector">${deal.sector}</div>
                <div class="deal-name">${deal.name}</div>
            </div>
            <div>
                <div class="deal-stats">
                    <div class="stat-box">
                        <span class="stat-label">EBITDA Mult.</span>
                        <span class="stat-value">${deal.ebitda}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">Acq. Confidence</span>
                        <span class="stat-value highlight">${deal.confidence}%</span>
                    </div>
                </div>
                <div class="confidence-meter">
                    <div class="confidence-track">
                        <div class="confidence-fill" style="width: ${deal.confidence}%"></div>
                    </div>
                </div>
                <div class="stats-footer" style="margin-top: 20px; border: none; padding: 0;">
                    <span>REF: ${deal.ref}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    registryContainer.appendChild(grid);

    // Append to body (or specific selector)
    const target = document.querySelector('.calc-container') || document.body;
    if (target.className === 'calc-container') {
        target.after(registryContainer);
    } else {
        target.appendChild(registryContainer);
    }
}

// Auto-init on load
if (document.readyState === "complete" || document.readyState === "interactive") {
    initDealsRegistry();
} else {
    document.addEventListener("DOMContentLoaded", initDealsRegistry);
}