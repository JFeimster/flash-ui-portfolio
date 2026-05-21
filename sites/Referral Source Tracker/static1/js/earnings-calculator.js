/**
 * Moonshine Capital | Commissions & Deal Tracker
 * Links the Referral Source Tracker to financial outcomes and partner ROI.
 */

const EarningsTracker = {
    // Mock deal data linking to referral source IDs
    deals: JSON.parse(localStorage.getItem('moonshine_deals')) || [
        { id: 101, sourceId: 1, client: "Global Tech Solutions", amount: 250000, status: "Funded", commissionRate: 0.03, date: "2023-12-15" },
        { id: 102, sourceId: 1, client: "Green Valley Organics", amount: 85000, status: "Underwriting", commissionRate: 0.02, date: "2024-01-02" },
        { id: 103, sourceId: 2, client: "Apex Manufacturing", amount: 450000, status: "Funded", commissionRate: 0.025, date: "2023-11-20" },
        { id: 104, sourceId: 1, client: "River Side Cafe", amount: 45000, status: "Approved", commissionRate: 0.04, date: "2024-01-08" },
        { id: 105, sourceId: 3, client: "Starlight Logistics", amount: 150000, status: "In Review", commissionRate: 0.03, date: "2024-01-12" }
    ],

    init() {
        this.injectStyles();
        this.renderDashboard();
        this.updateSourceCards();
        this.patchRenderBoard();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .earnings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
            .stat-card { background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .table-row:hover { background-color: #f8fafc; }
            .status-pill { font-size: 0.65rem; padding: 2px 8px; border-radius: 9999px; font-weight: 700; text-transform: uppercase; }
            .roi-badge { background: #fef3c7; color: #92400e; font-size: 0.6rem; padding: 1px 6px; border-radius: 4px; font-weight: 800; }
        `;
        document.head.appendChild(style);
    },

    calculateMetrics() {
        const fundedDeals = this.deals.filter(d => d.status === "Funded");
        const pipelineDeals = this.deals.filter(d => d.status !== "Funded");

        const totalFunded = fundedDeals.reduce((sum, d) => sum + d.amount, 0);
        const totalCommissionPaid = fundedDeals.reduce((sum, d) => sum + (d.amount * d.commissionRate), 0);
        const projectedCommission = pipelineDeals.reduce((sum, d) => sum + (d.amount * d.commissionRate), 0);

        return { 
            totalFunded, 
            totalCommissionPaid, 
            projectedCommission, 
            activePipeline: pipelineDeals.length 
        };
    },

    getEarningsBySource(sourceId) {
        const sourceDeals = this.deals.filter(d => d.sourceId === sourceId);
        const commission = sourceDeals
            .filter(d => d.status === "Funded")
            .reduce((sum, d) => sum + (d.amount * d.commissionRate), 0);
        return { 
            commission, 
            dealCount: sourceDeals.length,
            fundedCount: sourceDeals.filter(d => d.status === "Funded").length
        };
    },

    renderDashboard() {
        const metrics = this.calculateMetrics();
        const mainElement = document.querySelector('main');
        
        const dashboardHTML = `
            <section id="earnings-section" class="max-w-[1600px] mx-auto p-6 mt-6 border-t border-slate-200">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Financial Performance</h2>
                        <p class="text-slate-500 text-sm">Tracking conversion and commission payouts across your network</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="EarningsTracker.exportCommissions()" class="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-lg hover:bg-slate-50 shadow-sm transition">
                            Download Commission Report
                        </button>
                    </div>
                </div>

                <div class="earnings-grid">
                    <div class="stat-card">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Funded Volume</p>
                        <p class="text-3xl font-black text-slate-900">$${metrics.totalFunded.toLocaleString()}</p>
                        <div class="flex items-center gap-1 mt-2">
                            <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <p class="text-[10px] text-slate-500 font-bold uppercase">Settled Deals</p>
                        </div>
                    </div>
                    <div class="stat-card border-t-4 border-emerald-500">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Earnings Distributed</p>
                        <p class="text-3xl font-black text-emerald-600">$${metrics.totalCommissionPaid.toLocaleString()}</p>
                        <p class="text-[10px] text-slate-400 mt-2">Historical payouts to partners</p>
                    </div>
                    <div class="stat-card border-t-4 border-[#d4af37]">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Projected Payouts</p>
                        <p class="text-3xl font-black text-[#d4af37]">$${metrics.projectedCommission.toLocaleString()}</p>
                        <p class="text-[10px] text-slate-400 mt-2">Based on ${metrics.activePipeline} active pipeline deals</p>
                    </div>
                    <div class="stat-card">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Network ROI</p>
                        <p class="text-3xl font-black text-slate-900">${((metrics.totalCommissionPaid / (metrics.totalFunded || 1)) * 100).toFixed(1)}%</p>
                        <p class="text-[10px] text-slate-400 mt-2">Average effective commission rate</p>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                    <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
                        <h3 class="font-bold text-slate-800 text-sm">Recent Deal Activity</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-white text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                <tr>
                                    <th class="p-4 border-b">Referral Partner</th>
                                    <th class="p-4 border-b">Business Name</th>
                                    <th class="p-4 border-b">Funding Amount</th>
                                    <th class="p-4 border-b">Status</th>
                                    <th class="p-4 border-b">Partner Commission</th>
                                    <th class="p-4 border-b text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm">
                                ${this.deals.map(deal => {
                                    const source = typeof sources !== 'undefined' ? sources.find(s => s.id === deal.sourceId) : { name: 'External Partner' };
                                    return `
                                        <tr class="table-row border-b border-slate-100 transition-colors">
                                            <td class="p-4">
                                                <div class="font-bold text-slate-900">${source ? source.name : 'Unknown'}</div>
                                                <div class="text-[10px] text-slate-400">${source ? source.company : ''}</div>
                                            </td>
                                            <td class="p-4 text-slate-600 font-medium">${deal.client}</td>
                                            <td class="p-4 font-mono font-bold text-slate-700">$${deal.amount.toLocaleString()}</td>
                                            <td class="p-4">
                                                <span class="status-pill ${this.getStatusClass(deal.status)}">${deal.status}</span>
                                            </td>
                                            <td class="p-4 font-bold text-emerald-600">$${(deal.amount * deal.commissionRate).toLocaleString()}</td>
                                            <td class="p-4 text-right text-slate-400 font-medium text-xs">${deal.date}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        `;

        const existingDashboard = document.getElementById('earnings-section');
        if (existingDashboard) existingDashboard.remove();
        mainElement.insertAdjacentHTML('beforeend', dashboardHTML);
    },

    getStatusClass(status) {
        switch(status) {
            case 'Funded': return 'bg-emerald-100 text-emerald-700';
            case 'Underwriting': return 'bg-blue-100 text-blue-700';
            case 'Approved': return 'bg-amber-100 text-amber-700';
            case 'In Review': return 'bg-slate-200 text-slate-600';
            default: return 'bg-slate-100 text-slate-500';
        }
    },

    updateSourceCards() {
        if (typeof sources === 'undefined') return;
        
        const cards = document.querySelectorAll('.source-card');
        cards.forEach(card => {
            const nameHeader = card.querySelector('h4');
            if (!nameHeader) return;
            
            const sourceName = nameHeader.innerText;
            const source = sources.find(s => s.name === sourceName);
            
            if (source) {
                const stats = this.getEarningsBySource(source.id);
                if (stats.dealCount > 0) {
                    const existingBadge = card.querySelector('.earnings-info');
                    if (existingBadge) existingBadge.remove();

                    const earningsDiv = document.createElement('div');
                    earningsDiv.className = 'earnings-info mt-3 pt-3 border-t border-slate-100 flex justify-between items-center';
                    earningsDiv.innerHTML = `
                        <div class="flex items-center gap-1.5">
                            <span class="roi-badge">${stats.dealCount} DEALS</span>
                        </div>
                        <div class="text-right">
                            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Earnings</p>
                            <p class="text-xs font-black text-emerald-600">$${stats.commission.toLocaleString()}</p>
                        </div>
                    `;
                    
                    const actionsDiv = card.querySelector('.border-t');
                    if (actionsDiv) actionsDiv.before(earningsDiv);
                }
            }
        });
    },

    patchRenderBoard() {
        const originalRender = window.renderBoard;
        window.renderBoard = () => {
            if (originalRender) originalRender();
            this.updateSourceCards();
            this.renderDashboard();
        };
    },

    exportCommissions() {
        let csv = "Referral Source,Client,Deal Amount,Status,Commission Rate,Payout Amount,Date\n";
        this.deals.forEach(d => {
            const source = typeof sources !== 'undefined' ? sources.find(s => s.id === d.sourceId) : { name: 'Unknown' };
            const payout = d.amount * d.commissionRate;
            csv += `"${source ? source.name : 'Unknown'}","${d.client}",${d.amount},"${d.status}",${d.commissionRate},${payout},${d.date}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'moonshine_commissions_report.csv');
        a.click();
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => EarningsTracker.init(), 200);
});