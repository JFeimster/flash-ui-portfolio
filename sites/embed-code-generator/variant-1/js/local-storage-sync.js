(function() {
    /**
     * Moonshine Capital | Local Storage Sync
     * Synchronizes global partner brand settings with the Embed Generator.
     */
    const SETTINGS_KEY = 'ms_partner_brand_settings';

    function initStorageSync() {
        const savedData = localStorage.getItem(SETTINGS_KEY);
        if (!savedData) return;

        try {
            const settings = JSON.parse(savedData);
            
            // Map of storage keys to DOM element IDs
            const fieldMap = {
                'partnerId': settings.partnerId,
                'partnerName': settings.partnerName,
                'appUrl': settings.defaultRedirectUrl,
                'brandColor': settings.primaryHex,
                'brandColorHex': settings.primaryHex
            };

            let hasUpdated = false;

            Object.keys(fieldMap).forEach(targetId => {
                const element = document.getElementById(targetId);
                const value = fieldMap[targetId];

                if (element && value) {
                    element.value = value;
                    hasUpdated = true;
                }
            });

            // If we are on the Embed Generator page and have the update function, refresh the UI
            if (hasUpdated && typeof window.updateGenerator === 'function') {
                window.updateGenerator();
            }

        } catch (error) {
            console.error('Moonshine Sync Error:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStorageSync);
    } else {
        initStorageSync();
    }

    /**
     * Utility to save settings from a settings-specific page
     * This can be called from the Brand Settings UI if present on the same site
     */
    window.saveGlobalPartnerSettings = function(settingsObj) {
        // settingsObj format: { partnerId, partnerName, defaultRedirectUrl, primaryHex }
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsObj));
    };
})();