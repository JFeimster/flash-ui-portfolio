/**
 * Moonshine Capital | Settings & Data Management
 * This module handles profile preferences, automation rules, and data portability.
 */

const MoonshineSettings = {
    preferences: JSON.parse(localStorage.getItem('moonshine_settings')) || {
        userName: "Partner",
        userEmail: "",
        defaultFollowUpDays: 14,
        notificationsEnabled: true,
        autoScore: true
    },

    init() {
        this.injectSettingsButton();
        this.createSettingsModal();
        this.loadSettings();
    },

    injectSettingsButton() {
        const filtersBar = document.querySelector('nav .max-w-7xl');
        if (filtersBar) {
            const settingsBtn = document.createElement('button');
            settingsBtn.onclick = () => this.toggleModal(true);
            settingsBtn.className = "ml-auto flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-sm font-bold transition-all border border-slate-200";
            settingsBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Settings
            `;
            filtersBar.appendChild(settingsBtn);
        }
    },

    createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'settings-modal-overlay';
        modal.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] hidden items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div class="bg-[#020617] p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold">Preferences & Automation</h2>
                        <p class="text-slate-400 text-xs">Configure your workspace and data portability</p>
                    </div>
                    <button onclick="MoonshineSettings.toggleModal(false)" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div class="p-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Left: Profile & Automation -->
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">User Profile</h3>
                                <div class="space-y-3">
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Display Name</label>
                                        <input type="text" id="pref-name" class="w-full text-sm p-2 border border-slate-200 rounded" placeholder="Your Name">
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                                        <input type="email" id="pref-email" class="w-full text-sm p-2 border border-slate-200 rounded" placeholder="partner@moonshine.cap">
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Automation Rules</h3>
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-slate-600">Auto-set Follow-up (Days)</span>
                                        <input type="number" id="pref-followup" class="w-20 text-sm p-1 border border-slate-200 rounded" min="1" max="365">
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-slate-600">Notification Alerts</span>
                                        <input type="checkbox" id="pref-notify" class="w-4 h-4 accent-[#d4af37]">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Data Management -->
                        <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Data Management</h3>
                            <div class="space-y-4">
                                <button onclick="MoonshineSettings.exportToCSV()" class="w-full bg-white border border-slate-300 hover:border-[#d4af37] p-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    Export Records (CSV)
                                </button>
                                <button onclick="MoonshineSettings.exportToJSON()" class="w-full bg-white border border-slate-300 hover:border-[#d4af37] p-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
                                    Backup Data (JSON)
                                </button>
                                <div class="pt-4 border-t border-slate-200">
                                    <button onclick="MoonshineSettings.clearStorage()" class="w-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        Wipe Local Storage
                                    </button>
                                    <p class="text-[9px] text-slate-400 mt-2 text-center">Caution: This will permanently delete your referral tracking data.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-8 flex justify-end gap-3">
                        <button onclick="MoonshineSettings.toggleModal(false)" class="px-6 py-2 text-slate-500 font-bold text-sm">Cancel</button>
                        <button onclick="MoonshineSettings.saveSettings()" class="bg-[#d4af37] text-[#020617] px-8 py-2 rounded-lg font-bold text-sm shadow-lg shadow-yellow-500/20">Apply Preferences</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    toggleModal(show) {
        const modal = document.getElementById('settings-modal-overlay');
        modal.style.display = show ? 'flex' : 'none';
    },

    loadSettings() {
        document.getElementById('pref-name').value = this.preferences.userName;
        document.getElementById('pref-email').value = this.preferences.userEmail;
        document.getElementById('pref-followup').value = this.preferences.defaultFollowUpDays;
        document.getElementById('pref-notify').checked = this.preferences.notificationsEnabled;
    },

    saveSettings() {
        this.preferences = {
            userName: document.getElementById('pref-name').value,
            userEmail: document.getElementById('pref-email').value,
            defaultFollowUpDays: parseInt(document.getElementById('pref-followup').value),
            notificationsEnabled: document.getElementById('pref-notify').checked,
            autoScore: true
        };
        localStorage.setItem('moonshine_settings', JSON.stringify(this.preferences));
        this.toggleModal(false);
        alert('Preferences updated successfully.');
    },

    exportToCSV() {
        const sources = JSON.parse(localStorage.getItem('moonshine_referrals')) || [];
        if (sources.length === 0) return alert('No data to export.');

        let csv = "Name,Company,Category,Location,Email,Phone,Stage,Last Contact,Next FollowUp,Quality Score\n";
        sources.forEach(s => {
            csv += `"${s.name}","${s.company}","${s.category}","${s.location}","${s.email}","${s.phone}","${s.stage}","${s.lastContact || ''}","${s.nextFollowUp || ''}",${s.qualityScore}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        this.downloadFile(blob, 'moonshine_referrals_export.csv');
    },

    exportToJSON() {
        const sources = localStorage.getItem('moonshine_referrals') || '[]';
        const blob = new Blob([sources], { type: 'application/json' });
        this.downloadFile(blob, 'moonshine_referrals_backup.json');
    },

    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    },

    clearStorage() {
        if (confirm('Are you absolutely sure? This will delete all referral sources and settings.')) {
            localStorage.removeItem('moonshine_referrals');
            localStorage.removeItem('moonshine_settings');
            window.location.reload();
        }
    }
};

// Initialize Settings Hub
document.addEventListener('DOMContentLoaded', () => {
    MoonshineSettings.init();
});