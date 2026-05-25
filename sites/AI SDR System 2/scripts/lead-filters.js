const leads = [
    { id: 1, name: "Marcus Chen", company: "Aether AI", niche: "SaaS", score: 98, status: "Verified", match: "High" },
    { id: 2, name: "Sarah Jenkins", company: "CloudScale", niche: "Infrastructure", score: 82, status: "Researching", match: "Medium" },
    { id: 3, name: "David Vark", company: "Vark Labs", niche: "B2B Agency", score: 45, status: "Low Intent", match: "Low" },
    { id: 4, name: "Elena Rossi", company: "Solaris Tech", niche: "SaaS", score: 91, status: "Verified", match: "High" },
    { id: 5, name: "Julian Thorne", company: "Nexus Growth", niche: "Fintech", score: 76, status: "Researching", match: "Medium" }
];

const styles = `
    .lead-vault {
        margin-top: 2rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        overflow: hidden;
    }

    .vault-header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--glass-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.01);
    }

    .vault-title {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1rem;
        color: var(--text-secondary);
    }

    .lead-grid {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.8rem;
    }

    .lead-grid th {
        text-align: left;
        padding: 1rem 1.5rem;
        color: var(--text-secondary);
        font-weight: 500;
        text-transform: uppercase;
        font-size: 0.65rem;
        letter-spacing: 0.05rem;
        border-bottom: 1px solid var(--glass-border);
    }

    .lead-grid td {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--glass-border);
        color: var(--text-primary);
    }

    .lead-grid tr:hover {
        background: rgba(255, 255, 255, 0.02);
    }

    .score-badge {
        font-family: 'JetBrains Mono', monospace;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.75rem;
    }

    .score-high { color: #4ade80; background: rgba(74, 222, 128, 0.1); }
    .score-med { color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
    .score-low { color: #f87171; background: rgba(248, 113, 113, 0.1); }

    .action-btn {
        background: transparent;
        border: 1px solid var(--glass-border);
        color: var(--text-secondary);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.65rem;
        cursor: pointer;
        transition: all 0.2s;
        margin-right: 4px;
    }

    .action-btn:hover {
        border-color: var(--text-primary);
        color: var(--text-primary);
    }

    .btn-repersonalize {
        background: rgba(255, 255, 255, 0.05);
        color: var(--accent-color);
    }
`;

function injectLeadVault() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const vaultHTML = `
        <div class="lead-vault">
            <div class="vault-header">
                <h3 class="vault-title">Lead Intelligence Vault</h3>
                <span style="font-size: 0.65rem; color: var(--text-secondary);">Filtered by ICP Relevance</span>
            </div>
            <table class="lead-grid">
                <thead>
                    <tr>
                        <th>Prospect / Company</th>
                        <th>Niche</th>
                        <th>AI Qual Score</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="lead-body">
                    ${leads.map(lead => `
                        <tr>
                            <td>
                                <div style="font-weight: 500;">${lead.name}</div>
                                <div style="font-size: 0.7rem; color: var(--text-secondary);">${lead.company}</div>
                            </td>
                            <td><span class="tool-tag" style="margin:0;">${lead.niche}</span></td>
                            <td>
                                <span class="score-badge ${lead.score > 85 ? 'score-high' : lead.score > 60 ? 'score-med' : 'score-low'}">
                                    ${lead.score}/100
                                </span>
                            </td>
                            <td>
                                <button class="action-btn" onclick="overrideResearch(${lead.id})">Override</button>
                                <button class="action-btn btn-repersonalize" onclick="repersonalize(${lead.id})">Re-gen AI</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    const mainCanvas = document.querySelector('.main-canvas');
    if (mainCanvas) {
        const analytics = document.querySelector('.analytics-strip');
        mainCanvas.insertBefore(document.createRange().createContextualFragment(vaultHTML), analytics);
    }
}

window.overrideResearch = (id) => {
    console.log(`Manual override triggered for Lead ID: ${id}`);
    alert(`Entering Manual Override for Lead #${id}. AI research paused.`);
};

window.repersonalize = (id) => {
    console.log(`Triggering LLM re-personalization for Lead ID: ${id}`);
    const row = document.querySelector(`button[onclick="repersonalize(${id})"]`).closest('tr');
    row.style.opacity = '0.5';
    setTimeout(() => {
        row.style.opacity = '1';
        console.log(`New icebreaker generated for Lead #${id}`);
    }, 1200);
};

document.addEventListener('DOMContentLoaded', injectLeadVault);