const DEALS_STORAGE_KEY = 'moonshine_deals';
const REFERRALS_STORAGE_KEY = 'moonshine_referrals';

let deals = JSON.parse(localStorage.getItem(DEALS_STORAGE_KEY)) || [
    { id: 101, sourceId: 1, clientName: "Acme Manufacturing", amount: 250000, feePercent: 3, affiliateSplit: 15, status: "Funded", date: "2023-12-01" },
    { id: 102, sourceId: 2, clientName: "Main St Bakery", amount: 45000, feePercent: 5, affiliateSplit: 10, status: "Underwriting", date: "2023-12-10" },
    { id: 103, sourceId: 1, clientName: "TechFlow Solutions", amount: 120000, feePercent: 4, affiliateSplit: 15, status: "Pipeline", date: "2023-12-15" }
];

function initCommissionModule(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    renderCommissionUI(container);
}

function calculateCommission(deal) {
    const totalFee = deal.amount * (deal.feePercent / 100);
    return totalFee * (deal.affiliateSplit / 100);
}

function getStatusBadge(status) {
    const styles = {
        'Funded': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Underwriting': 'bg-amber-100 text-amber-700 border-amber-200',
        'Pipeline': 'bg-blue-100 text-blue-700 border-blue-200',
        'Declined': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return `<span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${styles[status] || styles['Pipeline']}">${status}</span>`;
}

function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

function renderCommissionUI(container) {
    const sources = JSON.parse(localStorage.getItem(REFERRALS_STORAGE_KEY)) || [];
    
    const totalFunded = deals.filter(d => d.status === 'Funded').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingComm = deals.filter(d => d.status !== 'Funded' && d.status !== 'Declined').reduce((acc, curr) => acc + calculateCommission(curr), 0);
    const earnedComm = deals.filter(d => d.status === 'Funded').reduce((acc, curr) => acc + calculateCommission(curr), 0);

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="glass-card p-6 rounded-xl border border-white/10 text-white">
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Funded Volume</p>
                <h3 class="text-3xl font-black text-[#d4af37]">${formatCurrency(totalFunded)}</h3>
            </div>
            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Projected Commissions</p>
                <h3 class="text-3xl font-black text-slate-900">${formatCurrency(pendingComm)}</h3>
            </div>
            <div class="bg-emerald-600 p-6 rounded-xl border border-emerald-500 shadow-lg shadow-emerald-900/20 text-white">
                <p class="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Earned & Paid</p>
                <h3 class="text-3xl font-black">${formatCurrency(earnedComm)}</h3>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 class="font-bold text-slate-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#d4af37]"><path d="M12 2v20M17 5H9.5a4.5 4.5 0 0 0 0 9H11a4.5 4.5 0 0 1 0 9H4"></path></svg>
                    Deal Pipeline & Commissions
                </h3>
                <button onclick="document.getElementById('deal-modal').style.display='flex'" class="text-xs font-bold bg-navy-deep text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all">
                    + Log New Deal
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-[11px] uppercase tracking-widest text-slate-400 border-b border-slate-100">
                            <th class="px-6 py-4 font-bold">Client / Date</th>
                            <th class="px-6 py-4 font-bold">Referral Source</th>
                            <th class="px-6 py-4 font-bold">Deal Amount</th>
                            <th class="px-6 py-4 font-bold">Split %</th>
                            <th class="px-6 py-4 font-bold">Commission</th>
                            <th class="px-6 py-4 font-bold">Status</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-slate-50">
                        ${deals.map(deal => {
                            const source = sources.find(s => s.id == deal.sourceId) || { name: 'Unknown', company: 'N/A' };
                            const commission = calculateCommission(deal);
                            return `
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="font-bold text-slate-900">${deal.clientName}</div>
                                        <div class="text-[10px] text-slate-400">${deal.date}</div>
                                    </td>
                                    <td class="px-6 py-4 text-slate-600">
                                        <div class="font-medium">${source.name}</div>
                                        <div class="text-[10px] text-slate-400 italic">${source.company}</div>
                                    </td>
                                    <td class="px-6 py-4 font-bold text-slate-700">${formatCurrency(deal.amount)}</td>
                                    <td class="px-6 py-4 text-slate-500">${deal.affiliateSplit}% <span class="text-[10px] block opacity-50">of ${deal.feePercent}% fee</span></td>
                                    <td class="px-6 py-4">
                                        <span class="font-black ${deal.status === 'Funded' ? 'text-emerald-600' : 'text-slate-900'}">
                                            ${formatCurrency(commission)}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">${getStatusBadge(deal.status)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add Deal Modal (Simplified for this component) -->
        <div id="deal-modal" class="fixed inset-0 bg-slate-900/80 z-[60] hidden items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div class="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <h2 class="font-bold">Log Referral Deal</h2>
                    <button onclick="document.getElementById('deal-modal').style.display='none'" class="text-slate-400 hover:text-white">✕</button>
                </div>
                <form id="deal-form" class="p-6 grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Client Name</label>
                        <input type="text" id="d-client" class="w-full p-2 border rounded-md" required>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Referral Source</label>
                        <select id="d-source" class="w-full p-2 border rounded-md">
                            ${sources.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Deal Amount ($)</label>
                        <input type="number" id="d-amount" class="w-full p-2 border rounded-md" placeholder="50000" required>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Fee %</label>
                        <input type="number" step="0.1" id="d-fee" class="w-full p-2 border rounded-md" value="3.0">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Affiliate Split %</label>
                        <input type="number" id="d-split" class="w-full p-2 border rounded-md" value="10">
                    </div>
                    <div class="col-span-2 mt-4">
                        <button type="submit" class="w-full bg-[#d4af37] text-navy-deep font-bold py-3 rounded-lg hover:brightness-110 transition-all">Create Deal Entry</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Handle Form Submit
    document.getElementById('deal-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newDeal = {
            id: Date.now(),
            sourceId: document.getElementById('d-source').value,
            clientName: document.getElementById('d-client').value,
            amount: parseFloat(document.getElementById('d-amount').value),
            feePercent: parseFloat(document.getElementById('d-fee').value),
            affiliateSplit: parseFloat(document.getElementById('d-split').value),
            status: "Pipeline",
            date: new Date().toISOString().split('T')[0]
        };
        deals.push(newDeal);
        localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(deals));
        renderCommissionUI(container);
    });
}

// Auto-init if container exists
document.addEventListener('DOMContentLoaded', () => {
    initCommissionModule('commission-root');
});

export { initCommissionModule };