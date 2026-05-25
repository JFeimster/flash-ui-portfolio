const settingsStyle = document.createElement('style');
settingsStyle.textContent = `
    /* Admin Settings Button */
    .admin-settings-trigger {
        background: var(--accent-cyan);
        color: #000;
        border: var(--border-width) solid #fff;
        padding: 16px 28px;
        cursor: pointer;
        font-weight: 900;
        font-size: 15px;
        text-transform: uppercase;
        transition: all var(--transition-speed);
        box-shadow: 4px 4px 0px #fff;
        font-family: 'Space Grotesk', sans-serif;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .admin-settings-trigger:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px #fff;
    }

    /* Settings Overlay & Layout */
    .settings-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: var(--bg);
        z-index: 1001;
        transform: translateY(110%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        overflow-y: auto;
        padding: 40px 20px;
    }

    .settings-overlay.active {
        transform: translateY(0);
    }

    .settings-container {
        max-width: 1000px;
        margin: 0 auto;
    }

    .settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: var(--border-width) solid #fff;
        padding-bottom: 24px;
        margin-bottom: 40px;
    }

    .settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
        gap: 30px;
    }

    @media (max-width: 600px) {
        .settings-grid {
            grid-template-columns: 1fr;
        }
    }

    /* Settings Cards */
    .settings-card {
        background: var(--surface);
        border: var(--border-width) solid #fff;
        padding: 30px;
        box-shadow: var(--brutal-shadow-yellow);
        position: relative;
    }

    .settings-card.cyan-shadow {
        box-shadow: var(--brutal-shadow-cyan);
    }

    .settings-card.magenta-shadow {
        box-shadow: var(--brutal-shadow-magenta);
    }

    .settings-card h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 22px;
        text-transform: uppercase;
        margin-bottom: 20px;
        border-bottom: 2px dashed rgba(255,255,255,0.15);
        padding-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    /* Quota Meter */
    .quota-container {
        margin: 15px 0;
    }

    .quota-bar-bg {
        background: var(--surface-card);
        border: 2px solid #fff;
        height: 24px;
        width: 100%;
        position: relative;
        overflow: hidden;
    }

    .quota-bar-fill {
        background: var(--accent-cyan);
        height: 100%;
        width: 68%;
        transition: width 0.5s ease;
    }

    .quota-labels {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-weight: 700;
        margin-top: 8px;
        text-transform: uppercase;
    }

    /* Color Customizer Controls */
    .branding-color-row {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
    }

    .color-picker-wrapper {
        position: relative;
        width: 50px;
        height: 50px;
        border: 2px solid #fff;
        cursor: pointer;
        overflow: hidden;
    }

    .color-picker-wrapper input[type="color"] {
        position: absolute;
        top: -10px;
        left: -10px;
        width: 80px;
        height: 80px;
        cursor: pointer;
    }

    .branding-label {
        font-weight: 800;
        font-size: 14px;
        text-transform: uppercase;
    }

    /* Custom Notification Switches */
    .pref-switch-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        background: var(--surface-card);
        border: 2px solid #fff;
        margin-bottom: 12px;
        cursor: pointer;
        user-select: none;
    }

    .pref-switch-row.checked {
        border-color: var(--accent-magenta);
    }

    .pref-toggle-box {
        width: 48px;
        height: 24px;
        background: #000;
        border: 2px solid #fff;
        position: relative;
        transition: background 0.2s;
    }

    .pref-toggle-box::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background: #fff;
        transition: transform 0.2s;
    }

    .pref-switch-row.checked .pref-toggle-box {
        background: var(--accent-magenta);
    }

    .pref-switch-row.checked .pref-toggle-box::after {
        transform: translateX(24px);
        background: #000;
    }

    /* MFA Layout */
    .mfa-status-badge {
        display: inline-block;
        padding: 6px 12px;
        border: 2px solid #000;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: 15px;
    }

    .mfa-active {
        background: var(--accent-cyan);
        color: #000;
    }

    .mfa-inactive {
        background: var(--accent-magenta);
        color: #fff;
    }

    .mfa-setup-zone {
        background: var(--surface-card);
        border: 2px solid #fff;
        padding: 20px;
        margin-top: 15px;
    }

    /* Logo Uploader Preview */
    .logo-preview-box {
        width: 100%;
        height: 80px;
        border: 2px dashed #fff;
        background: var(--surface-card);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 12px;
        position: relative;
    }

    .logo-preview-box img {
        max-height: 90%;
        max-width: 90%;
        object-fit: contain;
    }

    /* Save Notification Toast */
    .settings-toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translate(-50%, 100px);
        background: var(--accent-yellow);
        color: #000;
        border: 3px solid #000;
        padding: 15px 30px;
        font-weight: 900;
        text-transform: uppercase;
        box-shadow: 6px 6px 0px #fff;
        z-index: 1002;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .settings-toast.show {
        transform: translate(-50%, 0);
    }
`;
document.head.appendChild(settingsStyle);

// State Management
const DEFAULT_SETTINGS = {
    theme: {
        cyan: '#00f3ff',
        magenta: '#ff0055',
        yellow: '#ffee00'
    },
    notifications: {
        fileUpload: true,
        fileDownload: false,
        factorAlerts: true,
        mfaPrompts: true
    },
    mfaEnabled: false,
    storageUsed: 68.2 // GB out of 100GB
};

let appSettings = JSON.parse(localStorage.getItem('fintech_utility_settings')) || { ...DEFAULT_SETTINGS };

// Render & Inject Elements
document.addEventListener('DOMContentLoaded', () => {
    injectTriggerButton();
    injectSettingsOverlay();
    applyStoredBranding();
});

// Create dynamic settings entry point inside filters bar
function injectTriggerButton() {
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
        const trigger = document.createElement('button');
        trigger.className = 'admin-settings-trigger';
        trigger.innerHTML = `⚙️ SETTINGS`;
        trigger.onclick = openSettings;
        filterBar.appendChild(trigger);
    }
}

// Generate full Administrative Settings Overlay
function injectSettingsOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'settings-overlay';
    overlay.id = 'settingsOverlay';

    overlay.innerHTML = `
        <div class="settings-container">
            <div class="settings-header">
                <h1 style="margin-bottom:0; font-size: clamp(28px, 4vw, 44px);">ADMIN <span>SETTINGS</span></h1>
                <button class="close-calc" onclick="closeSettings()">EXIT SETTINGS [X]</button>
            </div>

            <div class="settings-grid">
                <!-- Card 1: Storage Quota & Subscriptions -->
                <div class="settings-card cyan-shadow">
                    <h3>💾 SYSTEM STORAGE QUOTA</h3>
                    <p style="font-size:14px; color: var(--text-muted); margin-bottom: 15px;">
                        Allocated administrative data limits for client-facing transaction histories, contracts, and dynamic credit scoring files.
                    </p>
                    <div class="quota-container">
                        <div class="quota-bar-bg">
                            <div class="quota-bar-fill" id="quotaFill" style="width: ${appSettings.storageUsed}%"></div>
                        </div>
                        <div class="quota-labels">
                            <span id="quotaLabelText">${appSettings.storageUsed} GB USED</span>
                            <span>100 GB PLAN CAPACITY</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 25px;">
                        <button class="tool-action" onclick="simulateDataCleanup()">CLEANUP SYSTEM CACHE</button>
                        <button class="tool-action" style="background: var(--accent-cyan); color: #000;" onclick="upgradeStoragePlan()">UPGRADE PLAN ↗</button>
                    </div>
                </div>

                <!-- Card 2: Portal Custom Branding -->
                <div class="settings-card yellow-shadow">
                    <h3>🎨 BRANDING & THEME ENGINE</h3>
                    <p style="font-size:14px; color: var(--text-muted); margin-bottom: 15px;">
                        Dynamically configure client portal styles. Changes adjust core CSS system properties globally.
                    </p>
                    
                    <div class="branding-color-row">
                        <div class="color-picker-wrapper">
                            <input type="color" id="pickerCyan" value="${appSettings.theme.cyan}" oninput="updateLiveColor('cyan', this.value)">
                        </div>
                        <div>
                            <span class="branding-label">Portal Cyan Accent</span>
                            <div style="font-size:11px; color:var(--text-muted);" id="valCyan">${appSettings.theme.cyan}</div>
                        </div>
                    </div>

                    <div class="branding-color-row">
                        <div class="color-picker-wrapper">
                            <input type="color" id="pickerMagenta" value="${appSettings.theme.magenta}" oninput="updateLiveColor('magenta', this.value)">
                        </div>
                        <div>
                            <span class="branding-label">Portal Magenta Accent</span>
                            <div style="font-size:11px; color:var(--text-muted);" id="valMagenta">${appSettings.theme.magenta}</div>
                        </div>
                    </div>

                    <div class="logo-uploader-section" style="margin-top: 20px;">
                        <span class="branding-label" style="display:block; margin-bottom:10px;">Portal Logo Asset</span>
                        <div class="logo-preview-box" id="logoPreviewZone">
                            NO CUSTOM LOGO UPLOADED
                        </div>
                        <input type="file" id="logoFileInput" accept="image/*" style="display:none;" onchange="handleLogoUpload(event)">
                        <button class="tool-action" onclick="document.getElementById('logoFileInput').click()">UPLOAD CUSTOM ASSET ↗</button>
                    </div>
                </div>

                <!-- Card 3: Notification Control Panel -->
                <div class="settings-card magenta-shadow">
                    <h3>🔔 NOTIFICATION DISPATCH PREFERENCES</h3>
                    <p style="font-size:14px; color: var(--text-muted); margin-bottom: 20px;">
                        Choose which critical parameters dispatch email and SMS payloads to registered brokers and processors.
                    </p>

                    <div class="pref-switch-row ${appSettings.notifications.fileUpload ? 'checked' : ''}" onclick="togglePref(this, 'fileUpload')">
                        <div>
                            <div style="font-weight: 800; font-size:15px;">New Client Invoices Uploaded</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Trigger automated accounting checks</div>
                        </div>
                        <div class="pref-toggle-box"></div>
                    </div>

                    <div class="pref-switch-row ${appSettings.notifications.fileDownload ? 'checked' : ''}" onclick="togglePref(this, 'fileDownload')">
                        <div>
                            <div style="font-weight: 800; font-size:15px;">Underwriter Terms Downloaded</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Dispatch immediately on file read</div>
                        </div>
                        <div class="pref-toggle-box"></div>
                    </div>

                    <div class="pref-switch-row ${appSettings.notifications.factorAlerts ? 'checked' : ''}" onclick="togglePref(this, 'factorAlerts')">
                        <div>
                            <div style="font-weight: 800; font-size:15px;">MCA Factor Warning Thresholds</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Alert on APR thresholds exceeding 80%</div>
                        </div>
                        <div class="pref-toggle-box"></div>
                    </div>
                </div>

                <!-- Card 4: Multi-Factor Authentication (MFA) -->
                <div class="settings-card cyan-shadow">
                    <h3>🔒 IDENTITY SECURITY & MFA</h3>
                    <p style="font-size:14px; color: var(--text-muted); margin-bottom: 15px;">
                        Mandate secondary verification structures (TOTP) during client intake workflows to preserve secure pipeline access.
                    </p>
                    
                    <div id="mfaStatusBadge" class="mfa-status-badge ${appSettings.mfaEnabled ? 'mfa-active' : 'mfa-inactive'}">
                        MFA STATUS: ${appSettings.mfaEnabled ? 'ENFORCED' : 'INACTIVE'}
                    </div>

                    <div id="mfaActionContainer">
                        ${appSettings.mfaEnabled ? renderMfaActiveView() : renderMfaInactiveView()}
                    </div>
                </div>
            </div>

            <div style="margin-top: 40px; display: flex; gap: 20px; border-top: 3px solid #fff; padding-top: 30px;">
                <button class="btn-primary" onclick="saveSettings()">SAVE ACTIVE PARAMETERS</button>
                <button class="btn-white" style="background:#000; color:#fff;" onclick="resetToDefaults()">RESTORE STANDARD CONSTANTS</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Toast Container
    const toast = document.createElement('div');
    toast.className = 'settings-toast';
    toast.id = 'settingsToast';
    toast.innerText = 'CONFIGURATION SAVED SUCCESSFULLY';
    document.body.appendChild(toast);

    // Initial load logo verification
    const savedLogo = localStorage.getItem('fintech_portal_logo');
    if (savedLogo) {
        const preview = document.getElementById('logoPreviewZone');
        if (preview) preview.innerHTML = `<img src="${savedLogo}" alt="Logo Preview">`;
    }
}

// Window Navigation
function openSettings() {
    document.getElementById('settingsOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSettings() {
    document.getElementById('settingsOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Global System Colors Applying Engine
function applyStoredBranding() {
    const root = document.documentElement;
    root.style.setProperty('--accent-cyan', appSettings.theme.cyan);
    root.style.setProperty('--accent-magenta', appSettings.theme.magenta);
    root.style.setProperty('--accent-yellow', appSettings.theme.yellow);
}

function updateLiveColor(key, value) {
    const root = document.documentElement;
    if (key === 'cyan') {
        root.style.setProperty('--accent-cyan', value);
        document.getElementById('valCyan').innerText = value.toUpperCase();
        appSettings.theme.cyan = value;
    } else if (key === 'magenta') {
        root.style.setProperty('--accent-magenta', value);
        document.getElementById('valMagenta').innerText = value.toUpperCase();
        appSettings.theme.magenta = value;
    }
}

// Save & Restore Operations
function saveSettings() {
    localStorage.setItem('fintech_utility_settings', JSON.stringify(appSettings));
    showToast('SYSTEM SETTINGS RECONFIGURED');
}

function resetToDefaults() {
    if (confirm('RESET ALL CONFIGURATIONS TO SYSTEM DEFAULT?')) {
        appSettings = {
            theme: {
                cyan: '#00f3ff',
                magenta: '#ff0055',
                yellow: '#ffee00'
            },
            notifications: {
                fileUpload: true,
                fileDownload: false,
                factorAlerts: true,
                mfaPrompts: true
            },
            mfaEnabled: false,
            storageUsed: 68.2
        };

        // Reset inputs
        document.getElementById('pickerCyan').value = appSettings.theme.cyan;
        document.getElementById('pickerMagenta').value = appSettings.theme.magenta;
        document.getElementById('valCyan').innerText = appSettings.theme.cyan.toUpperCase();
        document.getElementById('valMagenta').innerText = appSettings.theme.magenta.toUpperCase();
        
        applyStoredBranding();

        // Reset toggles
        document.querySelectorAll('.pref-switch-row').forEach(row => row.classList.remove('checked'));
        if(appSettings.notifications.fileUpload) document.querySelector('[onclick*="fileUpload"]').classList.add('checked');
        if(appSettings.notifications.fileDownload) document.querySelector('[onclick*="fileDownload"]').classList.add('checked');
        if(appSettings.notifications.factorAlerts) document.querySelector('[onclick*="factorAlerts"]').classList.add('checked');

        // Reset storage
        document.getElementById('quotaFill').style.width = '68.2%';
        document.getElementById('quotaLabelText').innerText = '68.2 GB USED';

        // Reset MFA
        document.getElementById('mfaStatusBadge').className = 'mfa-status-badge mfa-inactive';
        document.getElementById('mfaStatusBadge').innerText = 'MFA STATUS: INACTIVE';
        document.getElementById('mfaActionContainer').innerHTML = renderMfaInactiveView();

        // Remove custom logo
        localStorage.removeItem('fintech_portal_logo');
        document.getElementById('logoPreviewZone').innerHTML = 'NO CUSTOM LOGO UPLOADED';

        saveSettings();
    }
}

function showToast(message) {
    const toast = document.getElementById('settingsToast');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Quota Utilities
function simulateDataCleanup() {
    document.getElementById('quotaFill').style.width = '24.1%';
    appSettings.storageUsed = 24.1;
    document.getElementById('quotaLabelText').innerText = '24.1 GB USED';
    showToast('CLEARED 44.1 GB RAW LOG FILES');
}

function upgradeStoragePlan() {
    showToast('TRANSFERRING TO SECURE STRIPE CHECKOUT...');
}

// Logo File Handler
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('logoPreviewZone').innerHTML = `<img src="${e.target.result}" alt="Uploaded Logo">`;
            localStorage.setItem('fintech_portal_logo', e.target.result);
            showToast('CUSTOM LOGO LOADED TO CACHE');
        };
        reader.readAsDataURL(file);
    }
}

// Notification toggling
function togglePref(elem, key) {
    elem.classList.toggle('checked');
    appSettings.notifications[key] = elem.classList.contains('checked');
}

// MFA UI Generators & Actions
function renderMfaInactiveView() {
    return `
        <button class="tool-action" style="background:var(--accent-magenta); color:#fff;" onclick="initializeMfaSetup()">ENABLE SECURE MFA 🛡️</button>
    `;
}

function renderMfaActiveView() {
    return `
        <div style="background: rgba(0, 243, 255, 0.05); border: 2px solid var(--accent-cyan); padding: 15px; margin-bottom: 15px;">
            <div style="font-weight:900; color: var(--accent-cyan); margin-bottom: 5px;">MFA PROTECTED SYSTEM</div>
            <div style="font-size:12px; color:var(--text-muted)">Your authentication metrics are bound to Google Authenticator or registered hardware tokens.</div>
        </div>
        <div style="background: var(--surface-card); border: 2px dashed #fff; padding: 10px; font-family: monospace; font-size: 11px; margin-bottom: 15px; text-transform:uppercase;">
            Backup Keys:<br>
            <span style="color:var(--accent-yellow)">FT-893J-XK92<br>FT-112A-PP90</span>
        </div>
        <button class="tool-action" onclick="deactivateMfa()">DEACTIVATE ENFORCEMENT</button>
    `;
}

function initializeMfaSetup() {
    document.getElementById('mfaActionContainer').innerHTML = `
        <div class="mfa-setup-zone">
            <div style="font-weight:900; margin-bottom: 10px; text-transform: uppercase;">SCAN METRIC QR CODE</div>
            <div style="display:flex; gap: 20px; align-items:center;">
                <!-- Simulated QR matrix -->
                <div style="width: 100px; height: 100px; background: #fff; padding: 5px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;">
                    <div style="background:#000;"></div><div style="background:#000;"></div><div></div><div style="background:#000;"></div>
                    <div></div><div style="background:#000;"></div><div style="background:#000;"></div><div></div>
                    <div style="background:#000;"></div><div></div><div style="background:#000;"></div><div style="background:#000;"></div>
                    <div style="background:#000;"></div><div style="background:#000;"></div><div></div><div style="background:#000;"></div>
                </div>
                <div style="flex: 1;">
                    <label class="calc-label">Verification Code</label>
                    <input type="text" id="mfaCodeInp" class="calc-input" placeholder="000 000" maxlength="6" style="padding: 8px;">
                    <button class="tool-action" style="margin-top: 10px; font-size:12px;" onclick="verifySetupMfa()">VERIFY TOKEN</button>
                </div>
            </div>
        </div>
    `;
}

function verifySetupMfa() {
    const code = document.getElementById('mfaCodeInp').value;
    if (code.length === 6) {
        appSettings.mfaEnabled = true;
        document.getElementById('mfaStatusBadge').className = 'mfa-status-badge mfa-active';
        document.getElementById('mfaStatusBadge').innerText = 'MFA STATUS: ENFORCED';
        document.getElementById('mfaActionContainer').innerHTML = renderMfaActiveView();
        showToast('MFA ENFORCED SUCCESSFULLY');
    } else {
        alert('PLEASE ENTER A VALID 6-DIGIT SIMULATED TOKEN');
    }
}

function deactivateMfa() {
    if (confirm('REMOVE MFA HARDWARE BOUNDARIES? THIS LOWERS SECURITY COMPLIANCE.')) {
        appSettings.mfaEnabled = false;
        document.getElementById('mfaStatusBadge').className = 'mfa-status-badge mfa-inactive';
        document.getElementById('mfaStatusBadge').innerText = 'MFA STATUS: INACTIVE';
        document.getElementById('mfaActionContainer').innerHTML = renderMfaInactiveView();
        showToast('MFA SECURITY REMOVED');
    }
}