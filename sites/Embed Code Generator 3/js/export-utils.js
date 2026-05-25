/**
 * Moonshine Capital | Partner Portal
 * Export & Analytics Utilities v2.0
 */

const ExportUtils = {
    // Mock data based on widget types from base component
    generateMockLeads: function(count = 5) {
        const sources = ['wix_site', 'partner_portal', 'webflow_footer', 'framer_blog', 'email_campaign'];
        const widgets = ['score', 'matcher', 'cta', 'docs', 'calc'];
        const statuses = ['Pending', 'Reviewing', 'Approved', 'Funded'];
        
        return Array.from({ length: count }, (_, i) => {
            const score = Math.floor(Math.random() * 40) + 60; // 60-100 range
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            return {
                id: `LD-${1000 + i}`,
                date: date.toISOString().split('T')[0],
                source: sources[Math.floor(Math.random() * sources.length)],
                widget: widgets[Math.floor(Math.random() * widgets.length)],
                readinessScore: score,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                email: `user_${i}@example.com`
            };
        });
    },

    // Convert lead data to CSV and trigger download
    exportLeadsToCSV: function(leads) {
        if (!leads || leads.length === 0) return;

        const headers = ['Lead ID', 'Date', 'Source', 'Widget Type', 'Readiness Score', 'Status', 'User Email'];
        const rows = leads.map(lead => [
            lead.id,
            lead.date,
            lead.source,
            lead.widget,
            `${lead.readinessScore}%`,
            lead.status,
            lead.email
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `moonshine_leads_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Get color based on readiness score (matching UI theme)
    getScoreColor: function(score) {
        if (score >= 85) return '#39ff14'; // Neon Green
        if (score >= 70) return '#00f0ff'; // Neon Blue
        return '#f4f4f5'; // Text Primary
    },

    // Helper to render the Lead Management UI addition
    renderAnalyticsDashboard: function(targetContainerId) {
        const container = document.getElementById(targetContainerId);
        if (!container) return;

        const leads = this.generateMockLeads(8);

        const html = `
            <div class="output-card animate" style="margin-top: 2rem;">
                <div class="preview-header" style="background: none; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; padding: 0 0 1rem 0;">
                    <div class="section-title" style="margin-bottom: 0;">Lead Analytics & Readiness Scores</div>
                    <button class="copy-btn" id="btnExportCSV" style="position: static; font-size: 0.75rem;">Export CSV</button>
                </div>
                
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                        <thead>
                            <tr style="color: var(--text-muted); border-bottom: 1px solid var(--border);">
                                <th style="padding: 1rem 0.5rem;">ID</th>
                                <th style="padding: 1rem 0.5rem;">Source</th>
                                <th style="padding: 1rem 0.5rem;">Widget</th>
                                <th style="padding: 1rem 0.5rem;">Readiness</th>
                                <th style="padding: 1rem 0.5rem;">Status</th>
                            </tr>
                        </thead>
                        <tbody id="leadTableBody">
                            ${leads.map(lead => `
                                <tr style="border-bottom: 1px solid var(--border);">
                                    <td style="padding: 0.75rem 0.5rem; font-family: 'JetBrains Mono'; color: var(--text-secondary);">${lead.id}</td>
                                    <td style="padding: 0.75rem 0.5rem;">${lead.source}</td>
                                    <td style="padding: 0.75rem 0.5rem; text-transform: capitalize;">${lead.widget}</td>
                                    <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: ${this.getScoreColor(lead.readinessScore)}">${lead.readinessScore}%</td>
                                    <td style="padding: 0.75rem 0.5rem;"><span class="badge" style="font-size: 0.6rem;">${lead.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', html);

        // Bind Export Event
        document.getElementById('btnExportCSV').addEventListener('click', () => {
            this.exportLeadsToCSV(leads);
        });
    }
};

// Initialize if target exists
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const dashboardWrapper = document.createElement('div');
        dashboardWrapper.id = 'analytics-dashboard-container';
        mainContent.appendChild(dashboardWrapper);
        ExportUtils.renderAnalyticsDashboard('analytics-dashboard-container');
    }
});