const leadData = [
    { id: 1, name: "Nexus Innovations Ltd", source: "Funding Readiness Score", status: "In Review", commission: 1250, date: "2023-11-04" },
    { id: 2, name: "CloudStream SaaS", source: "Funding Route Matcher", status: "Funded", commission: 4800, date: "2023-11-02" },
    { id: 3, name: "Oasis Supply Co", source: "Application CTA Button", status: "Pending", commission: 0, date: "2023-10-31" },
    { id: 4, name: "Vertex Logistics", source: "Funding Readiness Score", status: "Declined", commission: 0, date: "2023-10-30" },
    { id: 5, name: "GreenPulse Energy", source: "Commission Estimator", status: "Funded", commission: 2100, date: "2023-10-28" },
    { id: 6, name: "Horizon FinTech", source: "Funding Route Matcher", status: "In Review", commission: 3200, date: "2023-10-25" },
    { id: 7, name: "BlueSky Retail", source: "Partner Profile Card", status: "Pending", commission: 0, date: "2023-10-22" }
];

function initTracker() {
    const searchInput = document.getElementById('leadSearch');
    const statusFilter = document.getElementById('statusFilter');
    const sourceFilter = document.getElementById('sourceFilter');
    const tableBody = document.getElementById('leadsTableBody');
    const totalDisplay = document.getElementById('totalCommission');
    const leadCount = document.getElementById('activeLeadCount');

    function getStatusBadge(status) {
        let color = 'var(--text-dim)';
        let bg = 'rgba(139, 148, 158, 0.1)';
        
        if (status === 'Funded') {
            color = 'var(--accent-green)';
            bg = 'rgba(57, 255, 20, 0.1)';
        } else if (status === 'In Review') {
            color = 'var(--accent-blue)';
            bg = 'rgba(0, 242, 255, 0.1)';
        } else if (status === 'Declined') {
            color = '#ff4d4d';
            bg = 'rgba(255, 77, 77, 0.1)';
        } else if (status === 'Pending') {
            color = '#ffa500';
            bg = 'rgba(255, 165, 0, 0.1)';
        }

        return `<span style="color: ${color}; background: ${bg}; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; border: 1px solid ${color}44; display: inline-block; min-width: 80px; text-align: center;">${status}</span>`;
    }

    function renderLeads(filteredLeads) {
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        let total = 0;

        filteredLeads.forEach(lead => {
            total += lead.commission;
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--border-color)';
            
            row.innerHTML = `
                <td style="padding: 16px; font-weight: 600; color: var(--text-main);">${lead.name}</td>
                <td style="padding: 16px; color: var(--text-dim); font-size: 0.85rem;">
                    <code style="font-family: 'JetBrains Mono', monospace; background: var(--bg-input); padding: 2px 6px; border-radius: 4px; font-size: 11px;">${lead.source}</code>
                </td>
                <td style="padding: 16px;">${getStatusBadge(lead.status)}</td>
                <td style="padding: 16px; font-family: 'JetBrains Mono', monospace; color: ${lead.commission > 0 ? 'var(--accent-green)' : 'var(--text-dim)'}; font-weight: 600; text-align: right;">
                    ${lead.commission > 0 ? '$' + lead.commission.toLocaleString() : '—'}
                </td>
                <td style="padding: 16px; color: var(--text-dim); font-size: 0.8rem; text-align: right;">${lead.date}</td>
            `;
            tableBody.appendChild(row);
        });

        if (totalDisplay) {
            totalDisplay.innerText = `$${total.toLocaleString()}`;
        }

        if (leadCount) {
            leadCount.innerText = filteredLeads.length;
        }

        if (filteredLeads.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="padding: 60px 20px; text-align: center; color: var(--text-dim);">
                        <div style="font-size: 2rem; margin-bottom: 10px;">∅</div>
                        <p>No applications found matching your current filters.</p>
                    </td>
                </tr>`;
        }
    }

    function filterData() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedStatus = statusFilter ? statusFilter.value : 'all';
        const selectedSource = sourceFilter ? sourceFilter.value : 'all';

        const filtered = leadData.filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(searchTerm);
            const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
            const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
            return matchesSearch && matchesStatus && matchesSource;
        });

        renderLeads(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', filterData);
    if (statusFilter) statusFilter.addEventListener('change', filterData);
    if (sourceFilter) sourceFilter.addEventListener('change', filterData);

    // Initial render
    renderLeads(leadData);
}

// Global invocation or export depending on environment
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracker);
} else {
    initTracker();
}