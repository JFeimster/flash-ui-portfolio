/**
 * Moonshine Capital | Export & Settings Utility
 * Handles data portability, browser notifications, and partner configuration
 */

const ExportUtility = {
    // --- Data Export Core ---
    
    /**
     * Exports referral source data to CSV
     * @param {Array} data - The sources array from local storage
     */
    exportToCSV: function(data) {
        if (!data || data.length === 0) {
            alert("No data available to export.");
            return;
        }

        const headers = ["Full Name", "Company", "Category", "Location", "Email", "Phone", "Stage", "Quality Score", "Next Follow Up", "Notes"];
        const rows = data.map(s => [
            `"${s.name}"`,
            `"${s.company || ''}"`,
            `"${s.category}"`,
            `"${s.location || ''}"`,
            `"${s.email || ''}"`,
            `"${s.phone || ''}"`,
            `"${s.stage}"`,
            s.qualityScore,
            s.nextFollowUp || 'N/A',
            `"${(s.notes || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        this.downloadFile(csvContent, 'moonshine_referrals_export.csv', 'text/csv;charset=utf-8;');
    },

    /**
     * Exports referral source data to a basic Excel-compatible XML format
     * @param {Array} data - The sources array
     */
    exportToExcel: function(data) {
        let tab = '\t';
        let content = "Name" + tab + "Company" + tab + "Category" + tab + "Stage" + tab + "Quality" + tab + "Follow-Up\n";
        
        data.forEach(s => {
            content += `${s.name}${tab}${s.company}${tab}${s.category}${tab}${s.stage}${tab}${s.qualityScore}${tab}${s.nextFollowUp}\n`;
        });

        this.downloadFile(content, 'moonshine_referrals_report.xls', 'application/vnd.ms-excel');
    },

    downloadFile: function(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // --- Browser Notifications ---

    initNotifications: function() {
        const settings = this.getSettings();
        if (settings.notificationsEnabled && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    },

    toggleNotifications: function(enabled) {
        if (enabled) {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    this.updateSettings({ notificationsEnabled: true });
                    new Notification("Moonshine Capital", {
                        body: "Follow-up reminders are now active.",
                        icon: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
                    });
                }
            });
        } else {
            this.updateSettings({ notificationsEnabled: false });
        }
    },

    checkReminders: function(sources) {
        const settings = this.getSettings();
        if (!settings.notificationsEnabled || Notification.permission !== "granted") return;

        const today = new Date().toISOString().split('T')[0];
        const dueToday = sources.filter(s => s.nextFollowUp === today);

        if (dueToday.length > 0) {
            new Notification("Follow-up Reminders", {
                body: `You have ${dueToday.length} referral partners to contact today.`,
                badge: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
            });
        }
    },

    // --- Profile & Integration Settings ---

    getSettings: function() {
        const defaults = {
            notificationsEnabled: false,
            payoutMethod: 'ACH',
            accountName: '',
            bankName: '',
            routingNumber: '',
            accountNumber: '',
            autoExportMonthly: false
        };
        const saved = localStorage.getItem('moonshine_settings');
        return saved ? JSON.parse(saved) : defaults;
    },

    updateSettings: function(newSettings) {
        const current = this.getSettings();
        const updated = { ...current, ...newSettings };
        localStorage.setItem('moonshine_settings', JSON.stringify(updated));
        return updated;
    },

    /**
     * UI Injection for the Settings Panel
     * Can be called by the main component to render the configuration area
     */
    renderSettingsPanel: function(containerId) {
        const settings = this.getSettings();
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Profile & Banking -->
                <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="bg-slate-900 p-4 text-white font-bold">Partner Payout Profile</div>
                    <form id="settings-form" class="p-6 grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Account Holder Name</label>
                            <input type="text" id="set-acc-name" class="w-full" value="${settings.accountName}" placeholder="Legal Entity or Personal Name">
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Bank Name</label>
                            <input type="text" id="set-bank" class="w-full" value="${settings.bankName}" placeholder="e.g. Chase Bank">
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Payout Method</label>
                            <select id="set-payout" class="w-full">
                                <option ${settings.payoutMethod === 'ACH' ? 'selected' : ''}>ACH</option>
                                <option ${settings.payoutMethod === 'Wire' ? 'selected' : ''}>Wire Transfer</option>
                                <option ${settings.payoutMethod === 'Check' ? 'selected' : ''}>Mailed Check</option>
                            </select>
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Routing Number</label>
                            <input type="password" id="set-routing" class="w-full" value="${settings.routingNumber}" placeholder="*********">
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Account Number</label>
                            <input type="password" id="set-account" class="w-full" value="${settings.accountNumber}" placeholder="*********">
                        </div>
                        <div class="col-span-2 flex justify-end pt-4">
                            <button type="button" onclick="ExportUtility.saveFormSettings()" class="bg-[#d4af37] text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-[#b8962e] transition-all">
                                Update Banking Profile
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Integration & Tools -->
                <div class="space-y-6">
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h4 class="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Automation</h4>
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="text-sm font-bold">Browser Notifications</p>
                                <p class="text-xs text-slate-500">Alerts for follow-ups</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" onchange="ExportUtility.toggleNotifications(this.checked)" class="sr-only peer" ${settings.notificationsEnabled ? 'checked' : ''}>
                                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h4 class="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Portability</h4>
                        <button onclick="ExportUtility.runExportFromGlobal()" class="w-full mb-3 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-bold transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download CSV Backup
                        </button>
                        <button onclick="ExportUtility.runExcelExportFromGlobal()" class="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-bold transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                            Export to MS Excel
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    saveFormSettings: function() {
        const data = {
            accountName: document.getElementById('set-acc-name').value,
            bankName: document.getElementById('set-bank').value,
            payoutMethod: document.getElementById('set-payout').value,
            routingNumber: document.getElementById('set-routing').value,
            accountNumber: document.getElementById('set-account').value
        };
        this.updateSettings(data);
        alert("Banking information securely updated locally.");
    },

    // Bridge functions for global scope access
    runExportFromGlobal: function() {
        const sources = JSON.parse(localStorage.getItem('moonshine_referrals')) || [];
        this.exportToCSV(sources);
    },

    runExcelExportFromGlobal: function() {
        const sources = JSON.parse(localStorage.getItem('moonshine_referrals')) || [];
        this.exportToExcel(sources);
    }
};

// Auto-init notifications on load
window.addEventListener('load', () => ExportUtility.initNotifications());