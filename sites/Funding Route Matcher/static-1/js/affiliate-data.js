/**
 * Moonshine Capital - Affiliate Performance Engine
 * Path: js/affiliate-data.js
 * Purpose: Analytics and tracking logic for the Affiliate Dashboard
 */

const AffiliateDataEngine = {
    config: {
        partnerId: "AFF-9982",
        currency: "USD",
        refreshInterval: 30000
    },

    stats: {
        sessions: 1458,
        completions: 84,
        conversionRate: 5.76,
        totalEarnings: 12450.00,
        pendingPayout: 3200.00,
        averageEPC: 8.54
    },

    routeDistribution: [
        { label: "Working Capital", value: 38, color: "#00f2ff" },
        { label: "Quick Micro-Funding", value: 29, color: "#39ff14" },
        { label: "Real Estate Funding", value: 15, color: "#7000ff" },
        { label: "Equipment Financing", value: 12, color: "#ffb800" },
        { label: "Business Credit Prep", value: 6, color: "#8a8f9d" }
    ],

    recentConversions: [
        { id: "TXN-8821", route: "Working Capital", quality: "High", status: "Funded", commission: 450.00, timestamp: "2 mins ago" },
        { id: "TXN-8819", route: "Micro-Funding", quality: "Med", status: "Verified", commission: 120.00, timestamp: "45 mins ago" },
        { id: "TXN-8815", route: "Real Estate", quality: "High", status: "Funded", commission: 1250.00, timestamp: "3 hours ago" },
        { id: "TXN-8812", route: "Equipment", quality: "Med", status: "Processing", commission: 300.00, timestamp: "5 hours ago" },
        { id: "TXN-8804", route: "Credit Prep", quality: "Low", status: "Nurturing", commission: 15.00, timestamp: "1 day ago" }
    ],

    init() {
        this.syncPartnerData();
        this.renderDashboard();
        this.startRealTimeSimulation();
    },

    syncPartnerData() {
        const affiliateInput = document.querySelector('input[name="partner_id"]');
        if (affiliateInput) {
            this.config.partnerId = affiliateInput.value;
        }
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.config.currency
        }).format(amount);
    },

    renderDashboard() {
        const container = document.getElementById('affiliate-dashboard-container');
        if (!container) return;

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                ${this.renderStatCard("Total Earnings", this.formatCurrency(this.stats.totalEarnings), "var(--neon-green)")}
                ${this.renderStatCard("Conversion Rate", this.stats.conversionRate + "%", "var(--electric-blue)")}
                ${this.renderStatCard("EPC", this.formatCurrency(this.stats.averageEPC), "var(--text-main)")}
                ${this.renderStatCard("Active Sessions", this.stats.sessions, "var(--text-muted)")}
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px;">
                <div class="dash-card" style="background: #161922; border: 1px solid var(--card-border); border-radius: 16px; padding: 24px;">
                    <h3 style="margin-bottom: 20px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted);">Recent Match Conversions</h3>
                    <table style="width: 100%; border-collapse: collapse; color: var(--text-main);">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid var(--card-border); font-size: 0.75rem; color: var(--text-muted);">
                                <th style="padding-bottom: 12px;">ID</th>
                                <th style="padding-bottom: 12px;">ROUTE</th>
                                <th style="padding-bottom: 12px;">STATUS</th>
                                <th style="padding-bottom: 12px; text-align: right;">PAYOUT</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.recentConversions.map(conv => `
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem;">
                                    <td style="padding: 12px 0; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;">${conv.id}</td>
                                    <td style="padding: 12px 0;">${conv.route}</td>
                                    <td style="padding: 12px 0;">
                                        <span style="color: ${conv.status === 'Funded' ? 'var(--neon-green)' : 'var(--electric-blue)'}; font-size: 0.75rem;">
                                            ● ${conv.status}
                                        </span>
                                    </td>
                                    <td style="padding: 12px 0; text-align: right; font-weight: 600;">${this.formatCurrency(conv.commission)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="dash-card" style="background: #161922; border: 1px solid var(--card-border); border-radius: 16px; padding: 24px;">
                    <h3 style="margin-bottom: 20px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted);">Route Popularity</h3>
                    ${this.routeDistribution.map(item => `
                        <div style="margin-bottom: 18px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.8rem;">
                                <span>${item.label}</span>
                                <span style="color: var(--text-muted);">${item.value}%</span>
                            </div>
                            <div style="height: 4px; background: #07080a; border-radius: 2px;">
                                <div style="width: ${item.value}%; height: 100%; background: ${item.color}; box-shadow: 0 0 8px ${item.color}88; border-radius: 2px;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderStatCard(label, value, accentColor) {
        return `
            <div style="background: #111318; border: 1px solid var(--card-border); padding: 20px; border-radius: 16px;">
                <p style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">${label}</p>
                <h2 style="font-size: 1.8rem; color: ${accentColor}; font-weight: 800;">${value}</h2>
            </div>
        `;
    },

    trackInteraction(eventName, data = {}) {
        console.log(`[Moonshine-Affiliate] Event: ${eventName}`, {
            partnerId: this.config.partnerId,
            timestamp: new Date().toISOString(),
            ...data
        });
        // In production, this sends an beacon to the tracking API
    },

    startRealTimeSimulation() {
        setInterval(() => {
            const randomIncrement = Math.floor(Math.random() * 5);
            this.stats.sessions += randomIncrement;
            const sessionDisplay = document.querySelector('h2[style*="var(--text-muted)"]');
            if (sessionDisplay) sessionDisplay.innerText = this.stats.sessions;
        }, 5000);
    }
};

document.addEventListener('DOMContentLoaded', () => AffiliateDataEngine.init());