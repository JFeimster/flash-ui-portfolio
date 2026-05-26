/**
 * Export Utility & Lead Management Logic
 * Part of the Person-Finder Micro-Agent Suite
 */

const LEAD_DATA = [
    { id: 1, name: 'Sarah Jenkins', role: 'Founder', company: 'Aura Design Studio', industry: 'Interior Design', location: 'Brooklyn, NY', email: 's.jenkins@auradesign.io', status: 'Verified' },
    { id: 2, name: 'Marcus Chen', role: 'Creative Director', company: 'Aura Design Studio', industry: 'Interior Design', location: 'Brooklyn, NY', email: 'm.chen@auradesign.io', status: 'Extracted' },
    { id: 3, name: 'Elena Rodriguez', role: 'CEO', company: 'Vertex Tech', industry: 'SaaS', location: 'Austin, TX', email: 'elena@vertex.io', status: 'Verified' },
    { id: 4, name: 'David Miller', role: 'Operations Manager', company: 'Swift Logistics', industry: 'Logistics', location: 'Chicago, IL', email: 'd.miller@swift-log.com', status: 'Queued' },
    { id: 5, name: 'Julianne Vought', role: 'Founder', company: 'Neon Media', industry: 'Marketing', location: 'Los Angeles, CA', email: 'jv@neon.media', status: 'Verified' }
];

class LeadManagementUtility {
    constructor() {
        this.leads = [...LEAD_DATA];
        this.filters = {
            industry: 'all',
            role: 'all',
            location: ''
        };
    }

    /**
     * Filters the lead database based on current criteria
     */
    applyFilters(criteria) {
        this.filters = { ...this.filters, ...criteria };
        
        return this.leads.filter(lead => {
            const matchIndustry = this.filters.industry === 'all' || lead.industry.toLowerCase() === this.filters.industry.toLowerCase();
            const matchRole = this.filters.role === 'all' || lead.role.toLowerCase().includes(this.filters.role.toLowerCase());
            const matchLocation = !this.filters.location || lead.location.toLowerCase().includes(this.filters.location.toLowerCase());
            
            return matchIndustry && matchRole && matchLocation;
        });
    }

    /**
     * Converts lead data to CSV format
     */
    convertToCSV(data) {
        const headers = ['Name', 'Role', 'Company', 'Industry', 'Location', 'Email', 'Status'];
        const rows = data.map(l => [
            l.name, 
            l.role, 
            l.company, 
            l.industry, 
            `"${l.location}"`, 
            l.email, 
            l.status
        ].join(','));
        
        return [headers.join(','), ...rows].join('\n');
    }

    /**
     * Triggers a browser download for the data
     */
    exportData(format = 'csv') {
        const dataToExport = this.applyFilters(this.filters);
        let content, mimeType, filename;

        if (format === 'json') {
            content = JSON.stringify(dataToExport, null, 2);
            mimeType = 'application/json';
            filename = `leads_export_${Date.now()}.json`;
        } else {
            content = this.convertToCSV(dataToExport);
            mimeType = 'text/csv';
            filename = `leads_export_${Date.now()}.csv`;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Generates HTML for the directory view matching the Micro-Agent UI
     */
    renderLeadTable(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const filtered = this.applyFilters(this.filters);
        
        const tableStyles = `
            style="width:100%; border-collapse: collapse; font-family: 'Inter', sans-serif; color: #e0e0e0; font-size: 13px;"
        `;

        const headerStyles = `
            style="text-align: left; padding: 12px 16px; color: #404040; font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #222;"
        `;

        const cellStyles = `
            style="padding: 16px; border-bottom: 1px solid #1a1a1a;"
        `;

        let html = `
            <table ${tableStyles}>
                <thead>
                    <tr>
                        <th ${headerStyles}>Identity</th>
                        <th ${headerStyles}>Role</th>
                        <th ${headerStyles}>Organization</th>
                        <th ${headerStyles}>Location</th>
                        <th ${headerStyles}>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        filtered.forEach(lead => {
            html += `
                <tr style="background: transparent; transition: background 0.2s;" onmouseover="this.style.background='#0d0d0d'" onmouseout="this.style.background='transparent'">
                    <td ${cellStyles}>
                        <div style="font-weight: 600; color: #fff;">${lead.name}</div>
                        <div style="font-size: 11px; color: #707070;">${lead.email}</div>
                    </td>
                    <td ${cellStyles}>
                        <span style="font-family: 'JetBrains Mono', monospace; color: #00ff88; font-size: 11px;">${lead.role}</span>
                    </td>
                    <td ${cellStyles}>
                        <div>${lead.company}</div>
                        <div style="font-size: 11px; color: #404040;">${lead.industry}</div>
                    </td>
                    <td ${cellStyles}>${lead.location}</td>
                    <td ${cellStyles}>
                        <span style="padding: 2px 6px; border: 1px solid ${lead.status === 'Verified' ? '#00ff88' : '#404040'}; color: ${lead.status === 'Verified' ? '#00ff88' : '#707070'}; border-radius: 4px; font-size: 9px; font-family: 'JetBrains Mono', monospace;">
                            ${lead.status.toUpperCase()}
                        </span>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    }
}

// Global initialization for the static component
window.LeadManager = new LeadManagementUtility();