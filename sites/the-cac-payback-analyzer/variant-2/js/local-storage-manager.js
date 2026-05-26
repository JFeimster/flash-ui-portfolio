const STORAGE_KEY = 'SWISS_LEDGER_AUDIT_LOG';

const AuditLogManager = {
    /**
     * Capture current state of the calculator and persist to localStorage
     */
    saveEntry: function() {
        const spend = document.getElementById('spend').value;
        const customers = document.getElementById('customers').value;
        const arpu = document.getElementById('arpu').value;
        const margin = document.getElementById('margin').value;
        const cac = document.getElementById('cacValue').innerText;
        const payback = document.getElementById('paybackValue').innerText;
        const status = document.getElementById('statusBox').innerText;
        const paybackNumeric = parseFloat(payback);

        const entry = {
            timestamp: new Date().toLocaleString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            isoDate: new Date().toISOString(),
            metrics: { spend, customers, arpu, margin },
            results: { cac, payback, status, paybackNumeric }
        };

        const history = this.getHistory();
        // Prevent duplicate consecutive entries with same payback
        if (history.length > 0 && history[0].results.payback === entry.results.payback) return;

        history.unshift(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20))); // Keep last 20 audits
        this.renderAuditUI();
    },

    /**
     * Retrieve history from localStorage
     */
    getHistory: function() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Calculate trend between the two most recent audit logs
     */
    calculateTrend: function() {
        const history = this.getHistory();
        if (history.length < 2) return { label: 'BASELINE ESTABLISHED', color: 'var(--ink)' };

        const current = history[0].results.paybackNumeric;
        const previous = history[1].results.paybackNumeric;
        
        if (isNaN(current) || isNaN(previous)) return { label: 'DATA PENDING', color: 'var(--ink)' };

        const diff = previous - current;
        const percentChange = ((diff / previous) * 100).toFixed(1);

        if (diff > 0.01) {
            return { 
                label: `↑ EFFICIENCY IMPROVED BY ${percentChange}%`, 
                color: 'var(--success)' 
            };
        } else if (diff < -0.01) {
            return { 
                label: `↓ EFFICIENCY REDUCED BY ${Math.abs(percentChange)}%`, 
                color: 'var(--danger)' 
            };
        }
        return { label: 'STABLE CAPITAL EFFICIENCY', color: 'var(--ink)' };
    },

    /**
     * Inject the Audit Log and Trend Report into the UI
     */
    renderAuditUI: function() {
        let container = document.getElementById('auditLogContainer');
        
        if (!container) {
            const ledger = document.querySelector('.ledger-container');
            container = document.createElement('div');
            container.id = 'auditLogContainer';
            container.style.padding = '0 40px 40px 40px';
            container.style.position = 'relative';
            container.style.zIndex = '1';
            ledger.appendChild(container);
        }

        const history = this.getHistory();
        const trend = this.calculateTrend();

        if (history.length === 0) {
            container.innerHTML = '';
            return;
        }

        let html = `
            <div style="margin-top: 40px; border-top: 2px solid var(--border); padding-top: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 15px;">
                    <div>
                        <div class="badge" style="margin-bottom: 5px;">REPORT: BANKABILITY TREND</div>
                        <h2 style="font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em;">Efficiency Audit Log</h2>
                    </div>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${trend.color}; text-align: right;">
                        ${trend.label}
                    </div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                            <th style="padding: 10px 0;">TIMESTAMP</th>
                            <th style="padding: 10px 0;">CAC</th>
                            <th style="padding: 10px 0;">PAYBACK</th>
                            <th style="padding: 10px 0; text-align: right;">VERDICT</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        history.forEach((entry, index) => {
            const isLatest = index === 0;
            html += `
                <tr style="border-bottom: 1px solid var(--grid); background: ${isLatest ? 'rgba(0,0,0,0.03)' : 'transparent'}">
                    <td style="padding: 12px 0;">${entry.timestamp}</td>
                    <td style="padding: 12px 0;">${entry.results.cac}</td>
                    <td style="padding: 12px 0;">${entry.results.payback}</td>
                    <td style="padding: 12px 0; text-align: right; font-weight: 700;">
                        ${entry.results.status.replace('PRINTER STATUS: ', '')}
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <p style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #666; text-transform: uppercase;">
                        Confidential Unit Economics Data • Internal Use Only
                    </p>
                    <button id="clearAudit" style="background: none; border: none; font-family: 'JetBrains Mono', monospace; font-size: 9px; text-decoration: underline; cursor: pointer; text-transform: uppercase;">
                        Purge Audit History
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        document.getElementById('clearAudit').addEventListener('click', () => {
            if (confirm('CONFIRM PURGE: Permanent deletion of audit history?')) {
                localStorage.removeItem(STORAGE_KEY);
                this.renderAuditUI();
            }
        });
    },

    /**
     * Initialization
     */
    init: function() {
        // Listen for "Money Printer" button clicks to log the data
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                this.saveEntry();
            });
        }

        // Initial render
        this.renderAuditUI();
    }
};

// Start manager on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuditLogManager.init());
} else {
    AuditLogManager.init();
}