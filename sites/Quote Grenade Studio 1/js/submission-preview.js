/**
 * QUOTE GRENADE | Live Fuse Submission Preview
 * Handles real-time rendering of user-submitted philosophical grenades.
 */

(function() {
    'use strict';

    // DOM Selectors - Assuming the submission page uses these IDs
    const selectors = {
        input: 'submission-input',
        category: 'submission-category',
        previewCard: 'preview-card',
        previewText: 'preview-text',
        previewMeta: 'preview-meta',
        submitBtn: 'fuse-submit-btn',
        charCount: 'char-count'
    };

    const init = () => {
        const inputEl = document.getElementById(selectors.input);
        const categoryEl = document.getElementById(selectors.category);
        const previewTextEl = document.getElementById(selectors.previewText);
        const previewMetaEl = document.getElementById(selectors.previewMeta);
        const previewCardEl = document.getElementById(selectors.previewCard);
        const charCountEl = document.getElementById(selectors.charCount);

        if (!inputEl || !previewTextEl) return;

        /**
         * Updates the preview card in real-time
         */
        const updatePreview = () => {
            const text = inputEl.value.trim();
            const category = categoryEl ? categoryEl.value : 'COMMUNITY';
            const count = inputEl.value.length;

            // Update Text
            previewTextEl.innerText = text.length > 0 ? text : "TYPE YOUR THOUGHT GRENADE HERE...";
            
            // Update Meta Info
            const fragmentId = Math.floor(Math.random() * 9000) + 1000;
            previewMetaEl.innerText = `TYPE: ${category.toUpperCase()} // ORIGIN: USER_${fragmentId}`;

            // Update Char Counter if exists
            if (charCountEl) {
                charCountEl.innerText = `${count}/140`;
                charCountEl.style.color = count > 140 ? 'var(--red)' : 'inherit';
            }
        };

        /**
         * Triggers the shake animation from the base component
         */
        const detonatePreview = () => {
            if (!previewCardEl) return;
            previewCardEl.classList.remove('detonate');
            void previewCardEl.offsetWidth; // Trigger reflow
            previewCardEl.classList.add('detonate');
        };

        // Event Listeners
        inputEl.addEventListener('input', () => {
            updatePreview();
        });

        if (categoryEl) {
            categoryEl.addEventListener('change', () => {
                updatePreview();
                detonatePreview();
            });
        }

        // Add a subtle "pulse" effect when user starts typing
        inputEl.addEventListener('focus', () => {
            if (previewCardEl) {
                previewCardEl.style.boxShadow = '12px 12px 0px var(--black)';
            }
        });

        inputEl.addEventListener('blur', () => {
            if (previewCardEl) {
                previewCardEl.style.boxShadow = '12px 12px 0px var(--red)';
            }
        });

        // Initial Run
        updatePreview();
    };

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();