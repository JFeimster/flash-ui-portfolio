/**
 * Moonshine Capital | Settings Handler
 * Manages global partner defaults and persists brand configurations.
 */

const SETTINGS_KEY = 'ms_partner_settings';

const defaultSettings = {
    partnerId: 'MS-882',
    partnerName: 'My Affiliate Name',
    brandColor: '#00f0ff',
    source: 'partner_portal',
    appUrl: 'https://moonshine.capital/apply'
};

/**
 * Loads settings from localStorage and populates any matching 
 * input elements on the current page.
 */
function loadPartnerSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    const settings = saved ? JSON.parse(saved) : defaultSettings;

    // List of input IDs to sync from the Base Component
    const generatorInputs = [
        'partnerId', 
        'partnerName', 
        'brandColor', 
        'source', 
        'appUrl'
    ];

    generatorInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element && settings[id]) {
            element.value = settings[id];
        }
    });

    // Populate Settings Page specific fields (marked with data-setting)
    const settingFields = document.querySelectorAll('[data-setting]');
    settingFields.forEach(field => {
        const key = field.getAttribute('data-setting');
        if (settings[key]) {
            field.value = settings[key];
        }
    });

    // Refresh the generator preview if the function exists in global scope
    if (typeof updateGenerator === 'function') {
        updateGenerator();
    }
}

/**
 * Captures values from the settings UI and saves to localStorage.
 */
function savePartnerSettings() {
    const settings = {};
    const settingFields = document.querySelectorAll('[data-setting]');
    
    // If no specific settings fields found, try to grab from generator inputs
    if (settingFields.length === 0) {
        const ids = ['partnerId', 'partnerName', 'brandColor', 'source', 'appUrl'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) settings[id] = el.value;
        });
    } else {
        settingFields.forEach(field => {
            const key = field.getAttribute('data-setting');
            settings[key] = field.value;
        });
    }

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    showSaveFeedback();
}

/**
 * Visual feedback for save actions matching the component's neon aesthetic.
 */
function showSaveFeedback() {
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (!saveBtn) return;

    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = 'CHANGES DEPLOYED';
    saveBtn.style.borderColor = 'var(--neon-green)';
    saveBtn.style.color = 'var(--neon-green)';
    
    setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.borderColor = '';
        saveBtn.style.color = '';
    }, 2000);
}

/**
 * Reset settings to factory defaults
 */
function resetSettings() {
    if (confirm('Reset all brand settings to default?')) {
        localStorage.removeItem(SETTINGS_KEY);
        loadPartnerSettings();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadPartnerSettings();

    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', savePartnerSettings);
    }

    const resetBtn = document.getElementById('resetSettingsBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSettings);
    }
    
    // Listen for changes on generator page to offer "Save as Default" 
    const inputs = ['partnerId', 'partnerName', 'brandColor', 'source', 'appUrl'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => {
                // Optional: Auto-save or trigger a "Save Defaults" toast
            });
        }
    });
});