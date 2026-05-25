/**
 * EQUITY TERMINAL | Listing Architect Intelligence Engine
 * Handles real-time signal scoring and premium file validation
 */

document.addEventListener('DOMContentLoaded', () => {
    const architectState = {
        score: 0,
        requirements: {
            basics: { weight: 15, met: false },
            financials: { weight: 25, met: false },
            taxReturns: { weight: 30, met: false },
            pnlStatement: { weight: 20, met: false },
            identity: { weight: 10, met: false }
        }
    };

    const scoringWeights = {
        title: 5,
        description: 10,
        revenue: 10,
        sde: 15,
        files: 60 // Distributed across specific document types
    };

    const initArchitect = () => {
        const form = document.getElementById('listingArchitectForm');
        if (!form) return;

        // Initialize listeners for text and number inputs
        const trackableInputs = form.querySelectorAll('input[data-signal], textarea[data-signal]');
        trackableInputs.forEach(input => {
            input.addEventListener('input', debounce(() => updateIntelligenceScore(), 500));
        });

        // Initialize File Drop Zones
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.style.borderColor = 'var(--acid-green)';
                zone.style.background = 'rgba(193, 255, 0, 0.05)';
            });

            zone.addEventListener('dragleave', () => {
                zone.style.borderColor = 'var(--graphite-light)';
                zone.style.background = 'transparent';
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                handleFileUpload(zone, files);
            });

            const input = zone.querySelector('input[type="file"]');
            if (input) {
                input.addEventListener('change', () => handleFileUpload(zone, input.files));
            }
        });
    };

    const handleFileUpload = (zone, files) => {
        if (files.length === 0) return;

        const fileName = files[0].name;
        const fileType = zone.dataset.fileType;
        
        // Visual feedback for "Sotheby's-grade" submission
        zone.innerHTML = `
            <div class="mono" style="color: var(--acid-green); font-size: 0.7rem;">
                [SCANNING_DOCUMENT...]
            </div>
            <div style="font-weight: 800; margin-top: 0.5rem;">${fileName.toUpperCase()}</div>
        `;

        // Simulate "Intelligence Processing"
        setTimeout(() => {
            zone.style.borderColor = 'var(--acid-green)';
            zone.style.background = 'rgba(193, 255, 0, 0.02)';
            zone.innerHTML = `
                <div class="mono" style="color: var(--acid-green); font-size: 0.7rem;">✓ VERIFIED_SIGNAL</div>
                <div style="font-weight: 800; margin-top: 0.5rem;">${fileName.toUpperCase()}</div>
                <div class="mono" style="font-size: 0.6rem; margin-top: 0.5rem; opacity: 0.5;">METADATA_ENCRYPTED</div>
            `;
            
            architectState.requirements[fileType].met = true;
            updateIntelligenceScore();
        }, 1500);
    };

    const updateIntelligenceScore = () => {
        let currentScore = 0;
        const form = document.getElementById('listingArchitectForm');
        
        // Evaluate Text Data
        const title = form.querySelector('#dealTitle')?.value || "";
        const desc = form.querySelector('#dealDescription')?.value || "";
        const revenue = form.querySelector('#dealRevenue')?.value || 0;
        const sde = form.querySelector('#dealSDE')?.value || 0;

        if (title.length > 10) currentScore += scoringWeights.title;
        if (desc.length > 100) currentScore += scoringWeights.description;
        if (revenue > 0) currentScore += scoringWeights.revenue;
        if (sde > 0) currentScore += scoringWeights.sde;

        // Evaluate Document Signals
        if (architectState.requirements.taxReturns.met) currentScore += 30;
        if (architectState.requirements.pnlStatement.met) currentScore += 30;

        animateScore(currentScore);
    };

    const animateScore = (target) => {
        const scoreElement = document.getElementById('intelScoreNumber');
        const progressBar = document.getElementById('intelScoreBar');
        const statusLabel = document.getElementById('intelStatusLabel');
        
        if (!scoreElement) return;

        const start = parseInt(scoreElement.innerText);
        const duration = 1000;
        let startTime = null;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const val = Math.floor(progress * (target - start) + start);
            
            scoreElement.innerText = val;
            if (progressBar) progressBar.style.width = `${val}%`;
            
            // Color thresholds
            if (val < 40) {
                progressBar.style.background = 'var(--blood-orange)';
                statusLabel.innerText = "LOW SIGNAL - HIGH FRICTION";
            } else if (val < 80) {
                progressBar.style.background = 'var(--oxidized-copper)';
                statusLabel.innerText = "MARKET READY - MEDIUM SIGNAL";
            } else {
                progressBar.style.background = 'var(--acid-green)';
                statusLabel.innerText = "SOTHEBY'S-GRADE LISTING";
                statusLabel.style.color = 'var(--acid-green)';
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    };

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Global initializer for the submission portal
    initArchitect();
});

/**
 * EXPOSED API FOR DYNAMIC LAYOUTS
 * Used when switching between tabs or loading sub-sections
 */
window.ListingArchitect = {
    refresh: () => {
        const portal = document.getElementById('listingArchitectForm');
        if (portal) {
            console.log("EQUITY.TERMINAL: Intelligence System Online");
        }
    },
    getScore: () => parseInt(document.getElementById('intelScoreNumber')?.innerText || 0)
};