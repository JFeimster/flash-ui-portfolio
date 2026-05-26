const vettingLedgerData = [
    {
        title: 'Financial Audit',
        progress: 85,
        items: [
            { label: 'YTD Profit & Loss', status: true },
            { label: '3-Year Tax Returns', status: true },
            { label: 'A/R Aging Schedule', status: true },
            { label: 'Debt Service Coverage', status: false }
        ]
    },
    {
        title: 'Legal Review',
        progress: 60,
        items: [
            { label: 'Articles of Incorporation', status: true },
            { label: 'Operating Agreement', status: true },
            { label: 'Material Contracts', status: false },
            { label: 'Intellectual Property', status: false }
        ]
    },
    {
        title: 'Operational Assessment',
        progress: 35,
        items: [
            { label: 'Inventory Ledger', status: true },
            { label: 'Employee Handbook', status: false },
            { label: 'SOP Documentation', status: false },
            { label: 'Customer Concentration', status: false }
        ]
    }
];

function renderVettingLedger() {
    const container = document.querySelector('.calc-container');
    const footer = document.querySelector('.stats-footer');
    
    if (!container) return;

    const ledgerWrapper = document.createElement('div');
    ledgerWrapper.id = 'vetting-ledger';
    ledgerWrapper.style.cssText = `
        margin-top: 80px;
        border-top: var(--border-width) solid var(--bone-white);
        padding-top: 60px;
    `;

    const styles = document.createElement('style');
    styles.textContent = `
        .ledger-header {
            margin-bottom: 40px;
        }
        .ledger-title {
            font-family: 'DM Serif Display', serif;
            font-size: 3rem;
            text-transform: uppercase;
            line-height: 0.9;
            margin-bottom: 20px;
        }
        .ledger-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 50px;
        }
        .checklist-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .checklist-item {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.65rem;
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 12px;
            border: 1px solid rgba(245, 245, 240, 0.2);
            transition: all 0.3s ease;
        }
        .checklist-item.checked {
            border-color: var(--verdigris);
            background: rgba(67, 179, 174, 0.05);
        }
        .status-box {
            width: 12px;
            height: 12px;
            border: 1px solid var(--bone-white);
            flex-shrink: 0;
            position: relative;
        }
        .status-box.active::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            background: var(--acid-green);
        }
        @media (max-width: 600px) {
            .ledger-title { font-size: 2rem; }
            .checklist-grid { grid-template-columns: 1fr; }
        }
    `;
    document.head.appendChild(styles);

    let ledgerHTML = `
        <div class="ledger-header">
            <h2 class="ledger-title">The Vetting<br>Ledger</h2>
        </div>
        <div class="ledger-grid">
    `;

    vettingLedgerData.forEach(cat => {
        ledgerHTML += `
            <div class="result-row">
                <div class="label-group">
                    <span class="editorial-label" style="color: var(--bone-white);">${cat.title}</span>
                    <span class="percentage" style="color: var(--acid-green);">${cat.progress}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${cat.progress}%"></div>
                </div>
                <div class="checklist-grid">
                    ${cat.items.map(item => `
                        <div class="checklist-item ${item.status ? 'checked' : ''}">
                            <div class="status-box ${item.status ? 'active' : ''}"></div>
                            <span>${item.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    ledgerHTML += `</div>`;
    ledgerWrapper.innerHTML = ledgerHTML;
    
    if (footer) {
        container.insertBefore(ledgerWrapper, footer);
    } else {
        container.appendChild(ledgerWrapper);
    }
}

document.addEventListener('DOMContentLoaded', renderVettingLedger);