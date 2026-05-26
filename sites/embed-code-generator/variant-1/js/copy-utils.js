/**
 * Moonshine Capital - UTM & Lead Tracking Lab
 * Specialized utility for generating and copying advanced tracking configurations.
 */

const CopyUtils = {
    /**
     * Copies a string of text to the user's clipboard
     * @param {string} text - The content to copy
     * @param {string} successMsg - Message to show in toast
     */
    copyToClipboard: async function(text, successMsg = 'Copied to clipboard!') {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(successMsg);
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showToast(successMsg);
            } catch (err) {
                this.showToast('Error copying text');
            }
            document.body.removeChild(textArea);
        }
    },

    /**
     * Triggers the UI toast notification
     * Matches the base component CSS selector #toast
     */
    showToast: function(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = msg;
        toast.style.display = 'block';
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2500);
    },

    /**
     * Formats a raw configuration object into a clean JSON string for display
     * @param {Object} config - The configuration object
     * @returns {string}
     */
    formatConfigJson: function(config) {
        return JSON.stringify(config, null, 4);
    },

    /**
     * Builds a URL with appended UTM parameters and Sub-IDs
     * @param {string} baseUrl 
     * @param {Object} params 
     * @returns {string}
     */
    buildTrackingUrl: function(baseUrl, params) {
        const url = new URL(baseUrl);
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.append(key, params[key]);
            }
        });
        return url.toString();
    },

    /**
     * Generates a script-ready snippet for passing JSON config to the SDK
     * @param {Object} config 
     * @returns {string}
     */
    generateSdkSnippet: function(config) {
        const json = this.formatConfigJson(config);
        return `<!-- Moonshine Lead Tracking SDK Initialization -->
<script>
    window.MoonshineConfig = ${json};
    
    // Initialize tracking hooks
    (function(m,s,c,a,p){
        m.MS_TRACK=m.MS_TRACK||function(){(m.MS_TRACK.q=m.MS_TRACK.q||[]).push(arguments)};
        // ... SDK Loader Logic
    })(window, document);
</script>`;
    },

    /**
     * Handles visual state of copy buttons (changes text briefly)
     * @param {HTMLElement} btn 
     */
    animateButton: function(btn) {
        if (!btn) return;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied';
        btn.style.borderColor = 'var(--neon-green)';
        btn.style.color = 'var(--neon-green)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 1500);
    }
};

// Integration for UI elements
document.addEventListener('DOMContentLoaded', () => {
    // Global listener for elements with data-copy attribute
    document.body.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('[data-copy-target]');
        if (copyBtn) {
            const targetId = copyBtn.getAttribute('data-copy-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                const text = targetEl.textContent || targetEl.value;
                CopyUtils.copyToClipboard(text);
                CopyUtils.animateButton(copyBtn);
            }
        }
    });
});

window.CopyUtils = CopyUtils;