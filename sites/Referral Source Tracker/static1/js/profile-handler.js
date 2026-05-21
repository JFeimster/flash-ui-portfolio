/**
 * Moonshine Capital | Profile & Integration Handler
 * Manages partner profile, banking info, and browser notifications.
 */

const ProfileHandler = {
    state: {
        profile: JSON.parse(localStorage.getItem('moonshine_partner_profile')) || {
            fullName: "Partner Name",
            company: "Partner Firm",
            email: "partner@example.com",
            phone: "",
            bankName: "",
            routingNumber: "",
            accountNumber: "",
            notificationsEnabled: false,
            weeklySummary: true
        }
    },

    init() {
        // Add settings button to the header dynamically if not present
        this.injectSettingsButton();
        this.checkNotificationStatus();
    },

    injectSettingsButton() {
        const headerActionArea = document.querySelector('header .flex.flex-col.gap-4');
        if (headerActionArea) {
            const settingsBtn = document.createElement('button');
            settingsBtn.onclick = () => this.openSettingsModal();
            settingsBtn.className = "text-slate-400 hover:text-[#d4af37] text-xs font-bold flex items-center justify-center gap-2 transition-colors mt-2";
            settingsBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Account Settings & Payouts
            `;
            headerActionArea.appendChild(settingsBtn);
        }
    },

    openSettingsModal() {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContent = modalOverlay.querySelector('.bg-white');
        
        // Save current modal state to restore later if needed
        this.cachedModalHTML = modalContent.innerHTML;

        modalContent.innerHTML = `
            <div class="bg-[#020617] p-6 text-white flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-bold">Partner Settings</h2>
                    <p class="text-xs text-slate-400">Manage profile, banking, and system preferences</p>
                </div>
                <button onclick="ProfileHandler.closeSettings()" class="text-slate-400 hover:text-white">&times;</button>
            </div>
            <div class="p-8 max-h-[80vh] overflow-y-auto">
                <div class="grid grid-cols-2 gap-6">
                    <!-- Profile Section -->
                    <div class="col-span-2">
                        <h3 class="text-xs font-black text-[#d4af37] uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Business Profile</h3>
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <input type="text" id="p-name" class="w-full text-sm" value="${this.state.profile.fullName}">
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company / Entity</label>
                        <input type="text" id="p-company" class="w-full text-sm" value="${this.state.profile.company}">
                    </div>

                    <!-- Banking Section -->
                    <div class="col-span-2 mt-4">
                        <h3 class="text-xs font-black text-[#d4af37] uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Commission Payout (ACH)</h3>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bank Name</label>
                        <input type="text" id="p-bank" class="w-full text-sm" placeholder="Chase, BofA, etc." value="${this.state.profile.bankName}">
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Routing Number</label>
                        <input type="password" id="p-routing" class="w-full text-sm" placeholder="•••••••••" value="${this.state.profile.routingNumber}">
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Account Number</label>
                        <input type="password" id="p-account" class="w-full text-sm" placeholder="•••••••••" value="${this.state.profile.accountNumber}">
                    </div>

                    <!-- Integrations Section -->
                    <div class="col-span-2 mt-4">
                        <h3 class="text-xs font-black text-[#d4af37] uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">System Preferences</h3>
                    </div>
                    <div class="col-span-2 flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                        <div>
                            <p class="text-sm font-bold text-slate-900">Browser Notifications</p>
                            <p class="text-xs text-slate-500">Alerts for upcoming referral follow-ups</p>
                        </div>
                        <button onclick="ProfileHandler.toggleNotifications()" id="notif-toggle" class="px-4 py-1.5 rounded-full text-xs font-bold ${this.state.profile.notificationsEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}">
                            ${this.state.profile.notificationsEnabled ? 'Enabled' : 'Enable'}
                        </button>
                    </div>

                    <div class="col-span-2 flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                        <div>
                            <p class="text-sm font-bold text-slate-900">Data Portability</p>
                            <p class="text-xs text-slate-500">Securely export all local database records</p>
                        </div>
                        <button onclick="ProfileHandler.exportMasterData()" class="border border-slate-300 px-4 py-1.5 rounded text-xs font-bold hover:bg-white transition-colors">Export CSV</button>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-10 pt-6 border-t">
                    <button onclick="ProfileHandler.closeSettings()" class="px-6 py-2 text-slate-500 font-bold text-sm">Cancel</button>
                    <button onclick="ProfileHandler.saveSettings()" class="bg-[#d4af37] text-[#020617] px-8 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform">Save Preferences</button>
                </div>
            </div>
        `;
        modalOverlay.style.display = 'flex';
    },

    saveSettings() {
        this.state.profile.fullName = document.getElementById('p-name').value;
        this.state.profile.company = document.getElementById('p-company').value;
        this.state.profile.bankName = document.getElementById('p-bank').value;
        this.state.profile.routingNumber = document.getElementById('p-routing').value;
        this.state.profile.accountNumber = document.getElementById('p-account').value;

        localStorage.setItem('moonshine_partner_profile', JSON.stringify(this.state.profile));
        
        // Visual feedback
        const saveBtn = event.target;
        saveBtn.innerText = "Saved!";
        saveBtn.classList.replace('bg-[#d4af37]', 'bg-emerald-500');
        saveBtn.classList.add('text-white');

        setTimeout(() => this.closeSettings(), 800);
    },

    closeSettings() {
        const modalOverlay = document.getElementById('modal-overlay');
        modalOverlay.style.display = 'none';
        
        // Reset the form in the original UI state
        if (typeof renderBoard === 'function') renderBoard();
    },

    async toggleNotifications() {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications");
            return;
        }

        if (Notification.permission === "granted") {
            this.state.profile.notificationsEnabled = !this.state.profile.notificationsEnabled;
            this.updateNotifUI();
        } else {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                this.state.profile.notificationsEnabled = true;
                this.updateNotifUI();
                new Notification("Moonshine Capital", { body: "Follow-up reminders activated." });
            }
        }
        localStorage.setItem('moonshine_partner_profile', JSON.stringify(this.state.profile));
    },

    updateNotifUI() {
        const btn = document.getElementById('notif-toggle');
        if (btn) {
            btn.innerText = this.state.profile.notificationsEnabled ? 'Enabled' : 'Enable';
            btn.className = `px-4 py-1.5 rounded-full text-xs font-bold ${this.state.profile.notificationsEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`;
        }
    },

    checkNotificationStatus() {
        if (Notification.permission !== "granted") {
            this.state.profile.notificationsEnabled = false;
        }
    },

    exportMasterData() {
        const sources = JSON.parse(localStorage.getItem('moonshine_referrals')) || [];
        const profile = this.state.profile;
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "METADATA\n";
        csvContent += `Partner Name,${profile.fullName}\n`;
        csvContent += `Partner Company,${profile.company}\n`;
        csvContent += `Export Date,${new Date().toLocaleDateString()}\n\n`;
        
        csvContent += "REFERRAL SOURCES\n";
        csvContent += "Name,Company,Category,Location,Email,Stage,Quality Score,Next Followup\n";
        
        sources.forEach(s => {
            const row = [
                s.name, s.company, s.category, s.location, s.email, s.stage, s.qualityScore, s.nextFollowUp
            ].map(v => `"${v}"`).join(",");
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `moonshine_master_export_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Initialize once document is ready
document.addEventListener('DOMContentLoaded', () => {
    ProfileHandler.init();
});