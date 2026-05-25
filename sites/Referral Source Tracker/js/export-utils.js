/**
 * export-utils.js
 * Utility functions for generating, rendering, and exporting Meeting Summary & Minutes.
 * Visually matched to the UI system of the Schedule Session modal.
 */

const ExportUtils = {
    /**
     * Formats meeting data into a structured HTML template
     * @param {Object} meetingData - Object containing title, date, attendees, notes, and tasks
     */
    generateSummaryTemplate: (meetingData) => {
        const { title, date, attendees, notes, tasks } = meetingData;

        const attendeesHtml = attendees.map((user, index) => {
            if (user.img) {
                return `<div class="avatar" style="z-index: ${10 - index}"><img src="${user.img}" alt="${user.name}"></div>`;
            }
            return `<div class="avatar" style="z-index: ${10 - index}; background: var(--surface-hover);">${user.initials}</div>`;
        }).join('');

        const tasksHtml = tasks.map(task => `
            <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: var(--surface); border-radius: 12px; margin-bottom: 8px; border: 1px solid var(--border);">
                <div style="width: 18px; height: 18px; border: 2px solid var(--text-secondary); border-radius: 4px; margin-top: 2px;"></div>
                <div style="flex: 1;">
                    <p style="margin: 0; color: var(--text-primary); font-size: 0.875rem;">${task.text}</p>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">${task.assignee}</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="modal" style="max-width: 520px;">
                <div class="header">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                        <span class="label" style="margin-bottom: 0; color: #10b981;">Completed</span>
                        <span style="font-size: 0.75rem; color: var(--text-secondary);">${date}</span>
                    </div>
                    <h2>${title}</h2>
                    <p>Meeting minutes and generated action items from the session.</p>
                </div>

                <div class="section">
                    <span class="label">Attendees</span>
                    <div class="avatar-group">
                        ${attendeesHtml}
                    </div>
                </div>

                <div class="section">
                    <span class="label">Key Discussion</span>
                    <div style="color: var(--text-primary); font-size: 0.9rem; line-height: 1.6; padding: 16px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; border: 1px solid var(--border);">
                        ${notes}
                    </div>
                </div>

                <div class="section">
                    <span class="label">Action Items</span>
                    <div class="tasks-container">
                        ${tasksHtml}
                    </div>
                </div>

                <div class="footer">
                    <button class="btn btn-secondary" onclick="window.print()">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg>
                        Print PDF
                    </button>
                    <button class="btn btn-primary" id="btn-export-csv">Export .CSV</button>
                </div>
            </div>
        `;
    },

    /**
     * Converts task data to a CSV string and triggers download
     * @param {Array} tasks - Array of task objects
     */
    downloadCSV: (tasks) => {
        const headers = ['Task', 'Assignee', 'Status'];
        const rows = tasks.map(t => [t.text, t.assignee, 'Pending']);
        
        const csvContent = [headers, ...rows]
            .map(e => e.map(String).map(v => `"${v.replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", "meeting_action_items.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Initializes the summary view listeners
     * @param {Array} tasks - Task data for CSV export
     */
    init: (tasks) => {
        const exportBtn = document.getElementById('btn-export-csv');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => ExportUtils.downloadCSV(tasks));
        }
    }
};

// Example usage data structure
const sampleMeetingData = {
    title: "Project Phoenix Sync",
    date: "Oct 24, 2023 • 13:00 - 14:00",
    attendees: [
        { name: "Sarah", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" },
        { name: "David", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80" },
        { name: "Elena", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" },
        { name: "John", initials: "JD" },
        { name: "Mike", initials: "ML" }
    ],
    notes: "Reviewed the Q4 roadmap and identified critical path for the mobile release. Discussion centered on API stability and frontend performance benchmarks.",
    tasks: [
        { text: "Update documentation for API endpoints", assignee: "Sarah Chen" },
        { text: "Fix hydration errors on landing page", assignee: "David Miller" },
        { text: "Finalize design assets for mobile", assignee: "Elena Rose" }
    ]
};

export default ExportUtils;