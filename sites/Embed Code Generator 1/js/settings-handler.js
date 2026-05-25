const MS_STORAGE_KEY = 'moonshine_partner_settings';

const SettingsHandler = {
    /**
     * Retrieves stored affiliate settings from localStorage.
     * @returns {Object|null}
     */
    getSettings() {
        const data = localStorage.getItem(MS_STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Failed to parse partner settings", e);
            return null;
        }
    },

    /**
     * Persists current configuration to localStorage as global defaults.
     */
    saveSettings() {
        const settings = {
            partnerName: document.getElementById('partnerName')?.value || '',
            partnerId: document.getElementById('partnerId')?.value || '',
            trackingSource: document.getElementById('trackingSource')?.value || '',
            appUrl: document.getElementById('appUrl')?.value || '',
            brandColor: document.getElementById('brandColor')?.value || '#00f2ff',
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(MS_STORAGE_KEY, JSON.stringify(settings));

        if (typeof showToast === 'function') {
            showToast('Global brand defaults updated!');
        }
    },

    /**
     * Populates the generator inputs with stored defaults.
     */
    applyDefaults() {
        const settings = this.getSettings();
        if (!settings) return;

        const fieldMap = {
            'partnerName': settings.partnerName,
            'partnerId': settings.partnerId,
            'trackingSource': settings.trackingSource,
            'appUrl': settings.appUrl,
            'brandColor': settings.brandColor,
            'brandColorHex': settings.brandColor
        };

        Object.entries(fieldMap).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el && value) {
                el.value = value;
            }
        });

        // Refresh the mockup and code snippets
        if (typeof updateGenerator === 'function') {
            updateGenerator();
        }
    },

    /**
     * Injects a "Save as Default" action into the existing UI.
     */
    injectControls() {
        const configPanel = document.querySelector('.panel');
        if (!configPanel) return;

        // Create the save button element
        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'Save as Global Default';
        saveBtn.className = 'btn-copy';
        saveBtn.style.marginTop = '1rem';
        saveBtn.style.width = '100%';
        saveBtn.style.borderColor = 'var(--neon-green)';
        saveBtn.style.color = 'var(--neon-green)';
        
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveSettings();
        });

        // Append after the build button
        const buildBtn = document.getElementById('btnBuild');
        if (buildBtn) {
            buildBtn.parentNode.insertBefore(saveBtn, buildBtn.nextSibling);
        }
    }
};

// Initialize handler once the DOM and base script are ready
window.addEventListener('load', () => {
    SettingsHandler.applyDefaults();
    SettingsHandler.injectControls();
});