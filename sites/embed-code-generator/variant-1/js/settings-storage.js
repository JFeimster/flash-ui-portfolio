/**
 * Moonshine Capital | Settings Storage Engine
 * Manages global partner configuration and persistence across sessions.
 */

const SETTINGS_KEY = 'ms_partner_global_config';

const SettingsStorage = {
    /**
     * Persists current form values to local storage as global defaults
     */
    saveDefaults: function() {
        const config = {
            partnerId: document.getElementById('partnerId').value,
            partnerName: document.getElementById('partnerName').value,
            brandColor: document.getElementById('brandColor').value,
            brandColorHex: document.getElementById('brandColorHex').value,
            appUrl: document.getElementById('appUrl').value,
            trackingSource: document.getElementById('trackingSource').value,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
        
        if (typeof showToast === 'function') {
            showToast('Global Defaults Saved');
        }
    },

    /**
     * Retrieves saved config and populates the UI
     */
    loadDefaults: function() {
        const savedData = localStorage.getItem(SETTINGS_KEY);
        if (!savedData) return;

        try {
            const config = JSON.parse(savedData);
            
            // Map keys to element IDs
            const fields = ['partnerId', 'partnerName', 'brandColor', 'brandColorHex', 'appUrl', 'trackingSource'];
            
            fields.forEach(field => {
                const element = document.getElementById(field);
                if (element && config[field]) {
                    element.value = config[field];
                }
            });

            // Trigger visual refresh if the base script is loaded
            if (typeof updateGenerator === 'function') {
                updateGenerator();
            }
        } catch (e) {
            console.error("Failed to load partner settings:", e);
        }
    },

    /**
     * Injects the "Save as Default" UI action into the configuration panel
     */
    injectInterface: function() {
        const configPanel = document.querySelector('.panel');
        if (!configPanel) return;

        // Create secondary action container
        const actionContainer = document.createElement('div');
        actionContainer.style.marginTop = '1rem';
        actionContainer.style.paddingTop = '1rem';
        actionContainer.style.borderTop = '1px solid var(--border)';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn-copy';
        saveBtn.style.width = '100%';
        saveBtn.style.justifyContent = 'center';
        saveBtn.innerHTML = 'Set as Global Defaults';
        saveBtn.title = 'Save these settings for future sessions';
        
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveDefaults();
        });

        actionContainer.appendChild(saveBtn);
        
        // Find position before recent-section or at end
        const recentSection = configPanel.querySelector('.recent-section');
        if (recentSection) {
            configPanel.insertBefore(actionContainer, recentSection);
        } else {
            configPanel.appendChild(actionContainer);
        }
    },

    /**
     * Clears all saved settings
     */
    clearSettings: function() {
        localStorage.removeItem(SETTINGS_KEY);
        location.reload();
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    SettingsStorage.loadDefaults();
    SettingsStorage.injectInterface();
});

// Export for global access
window.MoonshineSettings = SettingsStorage;