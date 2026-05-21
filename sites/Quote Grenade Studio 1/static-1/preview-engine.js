document.addEventListener('DOMContentLoaded', () => {
    const fuseInput = document.getElementById('fuse-input');
    const charCounter = document.getElementById('char-count');
    const previewText = document.getElementById('quote-text');
    const previewMeta = document.getElementById('quote-meta');
    const tagButtons = document.querySelectorAll('.fuse-tag-btn');
    const submitBtn = document.getElementById('fuse-submit');
    const grenadeCard = document.getElementById('grenade-card');
    
    const MAX_CHARS = 140;
    const DEFAULT_PREVIEW = "Your radical insight appears here in real-time.";

    /**
     * Updates the card preview and character counter as user types
     */
    if (fuseInput) {
        fuseInput.addEventListener('input', (e) => {
            const val = e.target.value;
            const currentLength = val.length;

            // Enforce hard limit
            if (currentLength > MAX_CHARS) {
                fuseInput.value = val.substring(0, MAX_CHARS);
            }

            // Live update preview
            previewText.innerText = val.length > 0 ? val.toUpperCase() : DEFAULT_PREVIEW;

            // Update counter UI
            if (charCounter) {
                charCounter.innerText = `${currentLength}/${MAX_CHARS}`;
                
                // Brutalist visual warning
                if (currentLength >= MAX_CHARS) {
                    charCounter.style.background = '#ff3c00';
                    charCounter.style.color = '#ffffff';
                } else if (currentLength >= MAX_CHARS * 0.8) {
                    charCounter.style.background = '#000000';
                    charCounter.style.color = '#ffffff';
                } else {
                    charCounter.style.background = 'transparent';
                    charCounter.style.color = '#000000';
                }
            }
        });
    }

    /**
     * Handles category selection within the submission form
     */
    tagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state
            tagButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update Meta preview
            const category = btn.dataset.cat || 'UNKNOWN';
            const fragmentID = Math.floor(Math.random() * 8999) + 1000;
            
            if (previewMeta) {
                previewMeta.innerText = `TYPE: ${category.toUpperCase()} // FRAGMENT: ${fragmentID}`;
            }

            // Visual feedback - glitch effect
            if (grenadeCard) {
                grenadeCard.style.transform = 'translate(-2px, -2px)';
                setTimeout(() => {
                    grenadeCard.style.transform = 'translate(0, 0)';
                }, 50);
            }
        });
    });

    /**
     * Handles submission logic and animation
     */
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const content = fuseInput.value.trim();

            if (content.length < 10) {
                alert("DETONATION FAILED: GRENADE CONTENT TOO LIGHT. ADD MORE DENSITY.");
                return;
            }

            // Detonate animation
            grenadeCard.classList.add('detonate');
            submitBtn.innerText = "ARMING...";
            submitBtn.disabled = true;

            // Simulate server dispatch
            setTimeout(() => {
                grenadeCard.classList.remove('detonate');
                
                // Clear UI
                fuseInput.value = "";
                previewText.innerText = "GRENADE DISPATCHED TO THE FRONT LINES.";
                charCounter.innerText = `0/${MAX_CHARS}`;
                submitBtn.innerText = "FUSE SUBMITTED";
                
                // Show toast if available in main app
                const toast = document.getElementById('toast');
                if (toast) {
                    toast.innerText = "INSIGHT DISPATCHED";
                    toast.style.display = 'block';
                    setTimeout(() => toast.style.display = 'none', 2000);
                }

                // Reset button after cooldown
                setTimeout(() => {
                    submitBtn.innerText = "SUBMIT ANOTHER FUSE";
                    submitBtn.disabled = false;
                }, 3000);
                
            }, 800);
        });
    }
});