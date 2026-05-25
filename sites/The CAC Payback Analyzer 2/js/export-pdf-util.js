const AUDIT_STORAGE_KEY = 'swiss_ledger_audit_trail';

/**
 * Unit Economics Audit Log & Export Utility
 * Handles persistent storage of calculation attempts and report generation
 */
const AuditLogUtil = {
    /**
     * Captures current state from the UI and persists to localStorage
     */
    saveCurrentAudit: () => {
        const getVal = (id) => document.getElementById(id).value;
        const getText = (id) => document.getElementById(id).innerText;

        const entry = {
            timestamp: new Date().toISOString(),
            input: {
                spend: getVal('spend'),
                customers: getVal('customers'),
                arpu: getVal('arpu'),
                margin: getVal('margin')
            },
            results: {
                cac: getText('cacValue'),
                payback: getText('paybackValue'),
                status: getText('statusBox').replace('PRINTER STATUS: ', '')
            }
        };

        const logs = JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || '[]');
        logs.unshift(entry);
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 20))); // Keep last 20 records
        console.log('Audit Log Updated:', entry);
        return entry;
    },

    /**
     * Retrieves the history of calculations
     */
    getHistory: () => {
        return JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || '[]');
    },

    /**
     * Calculates trend percentage between current and previous entry
     */
    calculateTrend: () => {
        const logs = AuditLogUtil.getHistory();
        if (logs.length < 2) return "INITIAL_AUDIT";
        
        const current = parseFloat(logs[0].results.payback);
        const previous = parseFloat(logs[1].results.payback);
        const diff = ((current - previous) / previous) * 100;
        
        return diff > 0 ? `+${diff.toFixed(1)}% (Slower)` : `${diff.toFixed(1)}% (Improved)`;
    },

    /**
     * Generates a printable Bankability Trend report
     */
    exportBankabilityReport: () => {
        AuditLogUtil.saveCurrentAudit();
        const logs = AuditLogUtil.getHistory();
        const trend = AuditLogUtil.calculateTrend();

        const reportWindow = window.open('', '_blank');
        const style = `
            body { 
                background: #F9F9F7; 
                color: #1A1A1A; 
                font-family: 'Inter', sans-serif; 
                padding: 40px;
                line-height: 1.4;
            }
            .report-header { 
                border-bottom: 4px solid #1A1A1A; 
                padding-bottom: 20px; 
                margin-bottom: 30px; 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-end;
            }
            h1 { font-weight: 800; text-transform: uppercase; font-size: 32px; letter-spacing: -0.02em; margin: 0; }
            .mono { font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; }
            .trend-card { 
                background: #1A1A1A; 
                color: white; 
                padding: 30px; 
                margin-bottom: 40px;
            }
            .trend-val { font-size: 48px; font-weight: 800; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #1A1A1A; }
            td { padding: 12px; border-bottom: 1px solid #ddd; }
            .status-tag { 
                display: inline-block; 
                padding: 2px 8px; 
                font-weight: 700; 
                font-size: 10px; 
                border: 1px solid #1A1A1A;
            }
            @media print { .no-print { display: none; } }
            .grid-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-image: linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
                background-size: 20px 20px;
                z-index: -1;
            }
        `;

        const rows = logs.map(log => `
            <tr>
                <td class="mono">${new Date(log.timestamp).toLocaleDateString()} ${new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td class="mono">$${parseFloat(log.input.spend).toLocaleString()}</td>
                <td style="font-weight:700">${log.results.cac}</td>
                <td style="font-weight:700">${log.results.payback}</td>
                <td><span class="status-tag">${log.results.status}</span></td>
            </tr>
        `).join('');

        reportWindow.document.write(`
            <html>
                <head>
                    <title>Bankability Trend Report - Swiss Ledger</title>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
                    <style>${style}</style>
                </head>
                <body>
                    <div class="grid-bg"></div>
                    <div class="report-header">
                        <div>
                            <div class="mono">Unit Economics Audit Log</div>
                            <h1>BANKABILITY TREND</h1>
                        </div>
                        <div class="mono" style="text-align: right;">
                            Generated: ${new Date().toLocaleString()}<br>
                            Auth: SL-VERIFIED-SYSTEM
                        </div>
                    </div>

                    <div class="trend-card">
                        <div class="mono">Current Efficiency Vector</div>
                        <div class="trend-val">${trend}</div>
                        <div class="mono">Based on last ${logs.length} calculation iterations</div>
                    </div>

                    <h2 class="mono">Historical Performance Log</h2>
                    <table>
                        <thead>
                            <tr class="mono">
                                <th>Timestamp</th>
                                <th>Ad Spend</th>
                                <th>CAC</th>
                                <th>Payback</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>

                    <div style="margin-top: 50px; border-top: 1px solid #1A1A1A; padding-top: 20px;" class="mono">
                        CONFIDENTIAL // FOR LENDER REVIEW ONLY // SWISS LEDGER AUDIT REV 2024-B
                    </div>

                    <div class="no-print" style="margin-top: 30px;">
                        <button onclick="window.print()" style="background:#FF3B30; color:white; border:none; padding:15px 30px; font-weight:800; cursor:pointer; text-transform:uppercase;">Print Official Report</button>
                    </div>
                </body>
            </html>
        `);
        reportWindow.document.close();
    }
};

// Auto-save logic: listen for changes on inputs but debounce slightly
let saveTimeout;
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => AuditLogUtil.saveCurrentAudit(), 2000);
    });
});

// Override the default print button behavior if needed
window.addEventListener('load', () => {
    const printBtn = document.querySelector('.cta-button');
    if (printBtn) {
        printBtn.setAttribute('onclick', 'AuditLogUtil.exportBankabilityReport()');
        printBtn.innerHTML = 'Generate Audit Log & Bankability Trend';
    }
});