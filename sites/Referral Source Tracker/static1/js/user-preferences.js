(function() {
    const PREFS_KEY = 'moonshine_prefs';
    const DATA_KEY = 'moonshine_referrals';

    let preferences = JSON.parse(localStorage.getItem(PREFS_KEY)) || {
        userName: "Partner",
        userEmail: "",
        reminderDays: 14,
        enableBrowserNotifications: false,
        theme: "dark",
        autoScore: true
    };

    /**
     * UI Injection: Adds the settings trigger and the modal structure to the DOM
     */
    const injectSettingsUI = () => {
        // Add Settings Link to the Hero Section next to the status badges
        const statusContainer = document.querySelector('header .flex.items-center.gap-4.text-sm');
        if (statusContainer) {
            const divider = document.createElement('span');
            divider.className = "text-slate-600";
            divider.innerText = "|";
            
            const settingsBtn = document.createElement('button');
            settingsBtn.className = "text-slate-400 hover:text-[#d4af37] transition-colors flex items-center gap-1";
            settingsBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Config
            `;
            settingsBtn.onclick = openSettings;
            statusContainer.appendChild(divider);
            statusContainer.appendChild(settingsBtn);
        }

        // Create Preferences Modal
        const modal = document.createElement('div');
        modal.id = 'pref-modal-overlay';
        modal.style.cssText = "display:none; position:fixed; inset:0; z-index:100; background:rgba(2,6,23,0.85); align-items:center; justify-content:center; backdrop-filter:blur(8px);";
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div class="bg-[#020617] p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold">System Preferences</h2>
                        <p class="text-slate-400 text-xs">Manage your profile and data automation</p>
                    </div>
                    <button onclick="closeSettings()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div class="p-8 max-h-[80vh] overflow-y-auto">
                    <div class="space-y-8">
                        <!-- User Profile -->
                        <section>
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span class="w-8 h-[1px] bg-slate-200"></span> User Identity
                            </h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Display Name</label>
                                    <input type="text" id="p-username" class="w-full text-sm border-slate-200" value="${preferences.userName}">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email for Exports</label>
                                    <input type="email" id="p-email" class="w-full text-sm border-slate-200" value="${preferences.userEmail}" placeholder="partners@moonshine.cap">
                                </div>
                            </div>
                        </section>

                        <!-- Automation Preferences -->
                        <section>
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span class="w-8 h-[1px] bg-slate-200"></span> Automation & Alerts
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p class="text-sm font-bold text-slate-800">Default Follow-up Interval</p>
                                        <p class="text-[11px] text-slate-500">Days until a new lead is marked overdue</p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <input type="number" id="p-interval" class="w-16 text-sm text-center" value="${preferences.reminderDays}">
                                        <span class="text-xs text-slate-400 font-bold">Days</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between px-3">
                                    <div>
                                        <p class="text-sm font-bold text-slate-800">Quality Auto-Scoring</p>
                                        <p class="text-[11px] text-slate-500">Calculate score based on pipeline stage</p>
                                    </div>
                                    <input type="checkbox" id="p-autoscore" class="w-5 h-5 accent-[#d4af37]" ${preferences.autoScore ? 'checked' : ''}>
                                </div>
                                <div class="flex items-center justify-between px-3">
                                    <div>
                                        <p class="text-sm font-bold text-slate-800">Browser Alerts</p>
                                        <p class="text-[11px] text-slate-500">Notify me of missed follow-ups via browser</p>
                                    </div>
                                    <input type="checkbox" id="p-alerts" class="w-5 h-5 accent-[#d4af37]" ${preferences.enableBrowserNotifications ? 'checked' : ''}>
                                </div>
                            </div>
                        </section>

                        <!-- Data Management -->
                        <section class="pt-6 border-t border-slate-100">
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Local Storage & Portability</h3>
                            <div class="grid grid-cols-2 gap-3">
                                <button onclick="exportJSON()" class="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="text-slate-400 group-hover:text-blue-600 mb-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    <span class="text-[11px] font-bold text-slate-700">Backup JSON</span>
                                </button>
                                <button onclick="clearVault()" class="flex flex-col items-center justify-center p-4 border border-red-100 rounded-xl hover:bg-red-50 transition-colors group">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="text-red-300 group-hover:text-red-600 mb-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    <span class="text-[11px] font-bold text-red-600">Purge Local Vault</span>
                                </button>
                            </div>
                            <p class="text-[9px] text-slate-400 mt-4 leading-relaxed text-center italic">
                                Moonshine Capital Tracker saves data locally to your browser's Cache. 
                                We never see your referral data. Clear your history to wipe data.
                            </p>
                        </section>
                    </div>

                    <div class="mt-10 flex justify-end gap-3">
                        <button onclick="closeSettings()" class="px-6 py-2 text-slate-500 font-bold text-sm">Cancel</button>
                        <button onclick="savePreferences()" class="bg-[#d4af37] text-slate-900 px-10 py-2.5 rounded-lg font-bold text-sm shadow-xl hover:bg-[#b8962e] transition-all active:scale-95">
                            Update Preferences
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.openSettings = () => {
        document.getElementById('pref-modal-overlay').style.display = 'flex';
    };

    window.closeSettings = () => {
        document.getElementById('pref-modal-overlay').style.display = 'none';
    };

    window.savePreferences = () => {
        const updated = {
            userName: document.getElementById('p-username').value || "Partner",
            userEmail: document.getElementById('p-email').value,
            reminderDays: parseInt(document.getElementById('p-interval').value) || 14,
            enableBrowserNotifications: document.getElementById('p-alerts').checked,
            theme: "dark",
            autoScore: document.getElementById('p-autoscore').checked
        };

        localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
        
        // Dynamic UI Update
        const saveBtn = document.querySelector('[onclick="savePreferences()"]');
        saveBtn.innerText = "Preferences Applied";
        saveBtn.classList.replace('bg-[#d4af37]', 'bg-emerald-500');
        saveBtn.classList.add('text-white');

        setTimeout(() => {
            closeSettings();
            location.reload(); // Refresh to apply cycle logic and labels
        }, 700);
    };

    window.exportJSON = () => {
        const fullData = {
            app: "Moonshine Referral Tracker",
            timestamp: new Date().toISOString(),
            preferences: preferences,
            sources: JSON.parse(localStorage.getItem(DATA_KEY)) || []
        };
        
        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `moonshine_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    window.clearVault = () => {
        if (confirm("CRITICAL ACTION: This will permanently erase all referral partners and settings from this browser. This cannot be undone. Proceed?")) {
            localStorage.removeItem(DATA_KEY);
            localStorage.removeItem(PREFS_KEY);
            location.reload();
        }
    };

    // Initialize module
    document.addEventListener('DOMContentLoaded', () => {
        injectSettingsUI();
        
        // Personalize Greeting
        const portalBadge = document.querySelector('.hero-gradient span.bg-yellow-500');
        if (portalBadge && preferences.userName !== "Partner") {
            portalBadge.innerText = `${preferences.userName}'s Portal`;
        }
    });
})();
```