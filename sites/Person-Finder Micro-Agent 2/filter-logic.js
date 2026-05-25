const LEAD_DATABASE = [
    { id: 1, name: "Sarah Jenkins", role: "Lead Designer", industry: "Interior Design", location: "Brooklyn, NY", email: "s.jenkins@auradesign.io", status: "Verified" },
    { id: 2, name: "Marcus Thorne", role: "Founder", industry: "SaaS", location: "Austin, TX", email: "marcus@cloudpulse.vibe", status: "Verified" },
    { id: 3, name: "Elena Rodriguez", role: "Managing Director", industry: "Fintech", location: "Miami, FL", email: "e.rodriguez@neon-cap.com", status: "High Confidence" },
    { id: 4, name: "David Miller", role: "CEO", industry: "E-commerce", location: "Chicago, IL", email: "dmiller@shopwave.net", status: "Verified" },
    { id: 5, name: "Jessica Wu", role: "Operations Manager", industry: "Logistics", location: "Seattle, WA", email: "j.wu@fasttrack.log", status: "Inferred" },
    { id: 6, name: "Thomas Kael", role: "President", industry: "Manufacturing", location: "Detroit, MI", email: "tkael@heavy-iron.com", status: "Verified" },
    { id: 7, name: "Sofia Alves", role: "Co-Founder", industry: "Interior Design", location: "Brooklyn, NY", email: "sofia@auradesign.io", status: "Verified" }
];

let activeFilters = {
    search: '',
    industry: '',
    role: '',
    location: ''
};

/**
 * Initializes the lead directory logic
 */
function initDirectory() {
    const tableBody = document.getElementById('leadsTableBody');
    const searchInput = document.getElementById('searchLeads');
    const industryFilter = document.getElementById('filterIndustry');
    const roleFilter = document.getElementById('filterRole');
    const locationFilter = document.getElementById('filterLocation');
    const exportBtn = document.getElementById('exportBtn');

    if (tableBody) {
        renderLeads(LEAD_DATABASE);
    }

    // Event Listeners
    [searchInput, industryFilter, roleFilter, locationFilter].forEach(el => {
        if (el) {
            el.addEventListener('input', (e) => {
                activeFilters[e.target.dataset.filterType] = e.target.value.toLowerCase();
                applyFilters();
            });
        }
    });

    if (exportBtn) {
        exportBtn.addEventListener('click', exportLeadsToCSV);
    }
}

/**
 * Filters the database based on active filter state
 */
function applyFilters() {
    const filteredResults = LEAD_DATABASE.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(activeFilters.search) || 
                              lead.email.toLowerCase().includes(activeFilters.search);
        const matchesIndustry = lead.industry.toLowerCase().includes(activeFilters.industry);
        const matchesRole = lead.role.toLowerCase().includes(activeFilters.role);
        const matchesLocation = lead.location.toLowerCase().includes(activeFilters.location);

        return matchesSearch && matchesIndustry && matchesRole && matchesLocation;
    });

    renderLeads(filteredResults);
}

/**
 * Renders the lead rows into the table
 */
function renderLeads(leads) {
    const tableBody = document.getElementById('leadsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = leads.map(lead => `
        <tr class="lead-row">
            <td>
                <div class="lead-name">${lead.name}</div>
                <div class="lead-email">${lead.email}</div>
            </td>
            <td><span class="lead-role">${lead.role}</span></td>
            <td><span class="lead-industry">${lead.industry}</span></td>
            <td><span class="lead-location">${lead.location}</span></td>
            <td>
                <span class="status-pill status-${lead.status.toLowerCase().replace(' ', '-')}">
                    ${lead.status}
                </span>
            </td>
            <td class="actions">
                <button class="icon-btn" onclick="copyEmail('${lead.email}')" title="Copy Email">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Exports current view to CSV
 */
function exportLeadsToCSV() {
    const headers = ["Name", "Role", "Industry", "Location", "Email", "Status"];
    const rows = LEAD_DATABASE.map(l => [l.name, l.role, l.industry, l.location, l.email, l.status].join(","));
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `person_finder_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Utility for clipboard interaction
 */
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        // Simple notification logic would go here
        console.log('Copied: ' + email);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDirectory);