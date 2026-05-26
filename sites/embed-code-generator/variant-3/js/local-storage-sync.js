/**
 * js/local-storage-sync.js
 * Moonshine Capital | Partner Portal Persistence Layer
 * Synchronizes brand settings and partner credentials across the UI.
 */

(function() {
    const PERSISTENCE_KEY = 'ms_partner_profile_v2';
    
    // Fields designated as "Global Defaults" for partner branding
    const GLOBAL_FIELDS = [
        'partnerName',
        'partnerId',
        'source',
        'brandColor',
        'appUrl'
    ];

    /**
     * Retrieves settings from localStorage and populates the UI inputs
     */
    const syncFromStorage = () => {
        const storedData = localStorage.getItem(PERSISTENCE_KEY);
        if (!storedData) return;

        try {
            const config = JSON.parse(storedData);
            
            GLOBAL_FIELDS.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input && config[fieldId] !== undefined) {
                    input.value = config[fieldId];
                }
            });

            // Trigger the UI refresh logic if present in the base component
            if (typeof window.updateGenerator === 'function') {
                window.updateGenerator();
            }
        } catch (e) {
            console.warn('Moonshine Capital: Sync from local storage failed.', e);
        }
    };

    /**
     * Captures current state of global fields and saves to localStorage
     */
    const syncToStorage = () => {
        const config = {};
        let hasData = false;
        
        GLOBAL_FIELDS.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input) {
                config[fieldId] = input.value;
                hasData = true;
            }
        });

        if (hasData) {
            localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(config));
        }
    };

    /**
     * Setup event observers
     */
    const initPersistence = () => {
        // Initial sync on page load
        syncFromStorage();

        // Attach change listeners to sync data whenever user modifies a global field
        GLOBAL_FIELDS.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input) {
                // Save on change to ensure the latest defaults are captured for next session
                input.addEventListener('change', syncToStorage);
            }
        });

        // Handle cross-tab/window synchronization for multi-screen workflows
        window.addEventListener('storage', (e) => {
            if (e.key === PERSISTENCE_KEY) {
                syncFromStorage();
            }
        });
    };

    // Execution timing management
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPersistence);
    } else {
        initPersistence();
    }
})();