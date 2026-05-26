/**
 * scripts/data-filter.js
 * Lead Management Logic for Person-Finder Micro-Agent Dashboard
 */

const LeadDashboard = (() => {
    // Mock data store representing processed and pending entities
    const state = {
        leads: [
            { id: 1, name: 'Sarah Jenkins', title: 'Operations Director', company: 'Acme Corp', industry: 'SaaS', status: 'completed', phone: '+1 555-0102', email: 's.jenkins@acme.com' },
            { id: 2, name: 'Michael Chen', title: 'Founder', company: 'Nexus Tech', industry: 'Hardware', status: 'pending', phone: null, email: null },
            { id: 3, name: 'Elena Rodriguez', title: 'VP Sales', company: 'Global Logistics', industry: 'Logistics', status: 'completed', phone: '+1 555-0199', email: 'elena.r@globallog.io' },
            { id: 4, name: 'David Smith', title: 'CEO', company: 'Vertex Solutions', industry: 'SaaS', status: 'processing', phone: null, email: null },
            { id: 5, name: 'Julia Vance', title: 'Marketing Lead', company: 'Retail Hub', industry: 'Retail', status: 'completed', phone: '+1 555-0244', email: 'julia@retailhub.com' },
            { id: 6, name: 'Marcus Thorne', title: 'Managing Director', company: 'Thorne & Co', industry: 'Finance', status: 'pending', phone: null, email: null }
        ],
        filters: {
            search: '',
            status: 'all',
            industry: 'all'
        },
        selectedIds: new Set()
    };

    // UI Selectors
    const selectors = {
        grid: document.getElementById('leads-grid'),
        statFound: document.getElementById('stat-found'),
        statPending: document.getElementById('stat-pending'),
        statTotal: document.getElementById('stat-total'),
        searchInput: document.querySelector('.search-bar input'),
        statusFilters: document.querySelectorAll('.filter-chip'),
        bulkActionBtn: document.getElementById('bulk-action-exec')
    };

    const init = () => {
        render();
        attachEventListeners();
        updateMetrics();
    };

    const updateMetrics = () => {
        const found = state.leads.filter(l => l.status === 'completed').length;
        const pending = state.leads.filter(l => l.status !== 'completed').length;
        
        if (selectors.statFound) selectors.statFound.innerText = found;
        if (selectors.statPending) selectors.statPending.innerText = pending;
        if (selectors.statTotal) selectors.statTotal.innerText = state.leads.length;
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'var(--accent)';
            case 'processing': return 'var(--primary)';
            case 'pending': return 'var(--text-dim)';
            default: return 'var(--border)';
        }
    };

    const render = () => {
        if (!selectors.grid) return;

        const filteredLeads = state.leads.filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(state.filters.search.toLowerCase()) || 
                                lead.company.toLowerCase().includes(state.filters.search.toLowerCase());
            const matchesStatus = state.filters.status === 'all' || lead.status === state.filters.status;
            return matchesSearch && matchesStatus;
        });

        selectors.grid.innerHTML = filteredLeads.map(lead => `
            <div class="contact-card lead-item ${state.selectedIds.has(lead.id) ? 'selected' : ''}" 
                 data-id="${lead.id}" 
                 style="opacity: ${lead.status === 'pending' ? '0.6' : '1'}; border-style: ${lead.status === 'pending' ? 'dashed' : 'solid'}">
                <div class="bulk-check" style="position:absolute; top:12px; right:12px;">
                    <input type="checkbox" ${state.selectedIds.has(lead.id) ? 'checked' : ''} onclick="LeadDashboard.toggleSelection(${lead.id})">
                </div>
                <div class="contact-name">${lead.name}</div>
                <div class="contact-title">${lead.title} <span style="color:var(--text-dim)">at</span> ${lead.company}</div>
                <div class="contact-meta">
                    <div class="meta-item">
                        <span class="step-badge" style="background: ${getStatusColor(lead.status)}22; color: ${getStatusColor(lead.status)}; border: 1px solid ${getStatusColor(lead.status)}44">
                            ${lead.status.toUpperCase()}
                        </span>
                    </div>
                    <div class="meta-item" style="font-size: 0.65rem">
                        ${lead.industry} • ${lead.email || 'No Email Extracted'}
                    </div>
                </div>
            </div>
        `).join('');
    };

    const attachEventListeners = () => {
        if (selectors.searchInput) {
            selectors.searchInput.addEventListener('input', (e) => {
                state.filters.search = e.target.value;
                render();
            });
        }

        selectors.statusFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                selectors.statusFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.filters.status = btn.dataset.status;
                render();
            });
        });

        if (selectors.bulkActionBtn) {
            selectors.bulkActionBtn.addEventListener('click', () => {
                if (state.selectedIds.size === 0) return alert('Select leads to export');
                console.log('Exporting IDs:', Array.from(state.selectedIds));
                alert(`Bulk Action: Exporting ${state.selectedIds.size} leads to CSV.`);
            });
        }
    };

    const toggleSelection = (id) => {
        if (state.selectedIds.has(id)) {
            state.selectedIds.delete(id);
        } else {
            state.selectedIds.add(id);
        }
        render();
    };

    const bulkSelectAll = (checked) => {
        if (checked) {
            state.leads.forEach(l => state.selectedIds.add(l.id));
        } else {
            state.selectedIds.clear();
        }
        render();
    };

    return { init, toggleSelection, bulkSelectAll };
})();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', LeadDashboard.init);