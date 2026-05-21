/**
 * Moonshine Capital | Deal Status & Commission Tracker
 * Links referral sources to financial outcomes and ROI.
 */

const DealTracker = {
    deals: JSON.parse(localStorage.getItem('moonshine_deals')) || [
        { id: 101, partnerId: 1, client: "ABC Manufacturing", amount: 250000, status: "Funded", commission: 5000, date: "2023-11-15" },
        { id: 102, partnerId: 1, client: "Global Logistics", amount: 120000, status: "In Underwriting", commission: 2400, date: "2023-12-01" },
        { id: 103, partnerId: 2, client: "Jenkins Bakery", amount: 45000, status: "Approved", commission: 900, date: "2023-12-10" }
    ],

    init() {
        this.injectStyles();
        this.renderDashboard();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .status-pill { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; }
            .status-funded { background: #d1fae5; color: #065f46; }
            .status-underwriting { background: #fef3c7; color: #92400e; }
            .status-approved { background: #dbeafe; color: #1e40af; }
            .status-dead { background: #fee2e2; color: #991b1b; }
            .roi-card { border-left: 4px solid var(--gold); background: white; transition: all 0.3s ease; }
            .roi-card:hover { transform: translateX(5px); }
        `;
        document.head.appendChild(style);
    },

    getPartnerName(id) {
        const sources = JSON.parse(localStorage.getItem('moonshine_referrals')) || [];
        const partner = sources.find(s => s.id === id);
        return partner ? partner.name : "Unknown Partner";
    },

    calculatePartnerStats() {
        const stats = {};
        this.deals.forEach(deal => {
            if (!stats[deal.partnerId]) {
                stats[deal.partnerId] = { totalVolume: 0, totalCommission: 0, dealCount: 0 };
            }
            stats[deal.partnerId].dealCount++;
            if (deal.status === "Funded") {
                stats[deal.partnerId].totalVolume += deal.amount;
                stats[deal.partnerId].totalCommission += deal.commission;
            }
        });
        return stats;
    },

    renderDashboard() {
        const container = document.querySelector('main');
        if (!container) return;

        const dashboardHTML = `
            <section class="mt-12 mb-12">
                <div class="flex items-center gap-3 mb-6">
                    <div class="h-8 w-2 bg-[#d4af37]"></div>
                    <h2 class="text-2xl font-black text-white uppercase tracking-tight">Financial Outcomes & ROI</h2>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Deal Pipeline -->
                    <div class="lg:col-span-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                        <div class="bg-slate-900 px-6 py-4 flex justify-between items-center">
                            <h3 class="text-white font-bold text-sm uppercase tracking-wider">Active Deal Pipeline</h3>
                            <button onclick="DealTracker.openDealModal()" class="text-[10px] bg-[#d4af37] text-slate-900 px-3 py-1 rounded font-black hover:bg-white transition-colors">Log New Deal</button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th class="px-6 py-3 text-[10px] font-black text-slate-500 uppercase">Partner</th>
                                        <th class="px-6 py-3 text-[10px] font-black text-slate-500 uppercase">Client</th>
                                        <th class="px-6 py-3 text-[10px] font-black text-slate-500 uppercase">Amount</th>
                                        <th class="px-6 py-3 text-[10px] font-black text-slate-500 uppercase">Status</th>
                                        <th class="px-6 py-3 text-[10px] font-black text-slate-500 uppercase">Est. Payout</th>
                                    </tr>
                                </thead>
                                <tbody id="deal-table-body">
                                    ${this.deals.map(deal => `
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td class="px-6 py-4 text-xs font-bold text-slate-700">${this.getPartnerName(deal.partnerId)}</td>
                                            <td class="px-6 py-4 text-xs text-slate-600">${deal.client}</td>
                                            <td class="px-6 py-4 text-xs font-bold text-slate-900">$${deal.amount.toLocaleString()}</td>
                                            <td class="px-6 py-4">
                                                <span class="status-pill status-${deal.status.toLowerCase().replace(' ', '')}">${deal.status}</span>
                                            </td>
                                            <td class="px-6 py-4 text-xs font-bold text-emerald-600">$${deal.commission.toLocaleString()}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Partner ROI Leaderboard -->
                    <div class="space-y-6">
                        <div class="bg-slate-900 rounded-xl p-6 text-white shadow-2xl relative overflow-hidden">
                            <div class="relative z-10">
                                <p class="text-[10px] font-black text-[#d4af37] uppercase mb-1">Total Pipeline Value</p>
                                <p class="text-3xl font-black mb-4">$${this.deals.reduce((a, b) => a + b.amount, 0).toLocaleString()}</p>
                                <div class="flex justify-between border-t border-white/10 pt-4">
                                    <div>
                                        <p class="text-[10px] text-slate-400 uppercase">Pending Comm.</p>
                                        <p class="text-lg font-bold text-emerald-400">$${this.deals.filter(d => d.status !== 'Funded' && d.status !== 'Dead').reduce((a, b) => a + b.commission, 0).toLocaleString()}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-[10px] text-slate-400 uppercase">Paid YTD</p>
                                        <p class="text-lg font-bold text-[#d4af37]">$${this.deals.filter(d => d.status === 'Funded').reduce((a, b) => a + b.commission, 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                                <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h3 class="text-slate-900 font-black text-xs uppercase tracking-widest mb-4">Top Referral Sources (ROI)</h3>
                            <div class="space-y-3" id="roi-list">
                                ${Object.entries(this.calculatePartnerStats())
                                    .sort(([, a], [, b]) => b.totalVolume - a.totalVolume)
                                    .map(([id, data]) => `
                                    <div class="roi-card p-3 rounded shadow-sm border border-slate-100">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <p class="text-xs font-black text-slate-800">${this.getPartnerName(parseInt(id))}</p>
                                                <p class="text-[10px] text-slate-500">${data.dealCount} deals submitted</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-xs font-black text-emerald-600">$${data.totalVolume.toLocaleString()}</p>
                                                <p class="text-[9px] text-slate-400 uppercase font-bold">Total Funded</p>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        const dashboardWrapper = document.createElement('div');
        dashboardWrapper.innerHTML = dashboardHTML;
        container.appendChild(dashboardWrapper);
    },

    openDealModal() {
        const sources = JSON.parse(localStorage.getItem('moonshine_referrals')) || [];
        const partnerOptions = sources.map(s => `<option value="${s.id}">${s.name} (${s.company})</option>`).join('');
        
        const modal = document.createElement('div');
        modal.id = 'deal-modal-overlay';
        modal.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div class="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <h2 class="font-bold">Log New Deal Status</h2>
                    <button onclick="document.getElementById('deal-modal-overlay').remove()" class="text-slate-400 hover:text-white">&times;</button>
                </div>
                <form id="deal-form" class="p-6 space-y-4">
                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Referral Partner</label>
                        <select id="d-partner" class="w-full border border-slate-200 rounded p-2 text-sm">${partnerOptions}</select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Client / Business Name</label>
                        <input type="text" id="d-client" class="w-full border border-slate-200 rounded p-2 text-sm" placeholder="Acme Corp" required>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Deal Amount ($)</label>
                            <input type="number" id="d-amount" class="w-full border border-slate-200 rounded p-2 text-sm" placeholder="100000" required>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Comm. Rate (%)</label>
                            <input type="number" id="d-rate" class="w-full border border-slate-200 rounded p-2 text-sm" value="2" step="0.1">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Status</label>
                        <select id="d-status" class="w-full border border-slate-200 rounded p-2 text-sm">
                            <option>Submitted</option>
                            <option>In Underwriting</option>
                            <option>Approved</option>
                            <option>Funded</option>
                            <option>Dead</option>
                        </select>
                    </div>
                    <button type="submit" class="w-full bg-[#10b981] text-white font-bold py-3 rounded-lg mt-2 shadow-lg hover:bg-[#059669] transition-all">Record Deal</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('deal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const amt = parseFloat(document.getElementById('d-amount').value);
            const rate = parseFloat(document.getElementById('d-rate').value) / 100;
            
            const newDeal = {
                id: Date.now(),
                partnerId: parseInt(document.getElementById('d-partner').value),
                client: document.getElementById('d-client').value,
                amount: amt,
                status: document.getElementById('d-status').value,
                commission: amt * rate,
                date: new Date().toISOString().split('T')[0]
            };

            this.deals.push(newDeal);
            localStorage.setItem('moonshine_deals', JSON.stringify(this.deals));
            location.reload(); // Refresh to update all metrics and UI
        });
    }
};

// Auto-initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DealTracker.init());
} else {
    DealTracker.init();
}