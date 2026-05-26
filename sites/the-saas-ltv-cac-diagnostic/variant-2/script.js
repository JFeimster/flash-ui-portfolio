function calculate() {
        const arpu = parseFloat(document.getElementById('arpu').value) || 0;
        const churnPercent = parseFloat(document.getElementById('churn').value) || 0;
        const cac = parseFloat(document.getElementById('cac').value) || 0;

        const churnDecimal = churnPercent / 100;
        
        // LTV = ARPU / Churn
        const ltv = churnDecimal > 0 ? arpu / churnDecimal : 0;
        
        // Ratio = LTV / CAC
        const ratio = cac > 0 ? ltv / cac : 0;
        
        updateUI(ratio);
    }

    function updateUI(ratio) {
        const ratioEl = document.getElementById('ratioVal');
        const fill = document.getElementById('gaugeFill');
        const ctaText = document.getElementById('ctaText');
        const ctaBox = document.getElementById('ctaBox');
        const badge = document.getElementById('badge');

        // Animate counter
        ratioEl.innerText = ratio.toFixed(1) + ':1';

        // Gauge Logic: 0 to 6+ ratio scale
        // Max rotation = 314 dashoffset (0%) to 0 (100%)
        // We consider 5:1 as the "full" mark for the gauge visual
        const maxScale = 6;
        const percentage = Math.min(ratio / maxScale, 1);
        const offset = 314 - (percentage * 314);
        fill.style.strokeDashoffset = offset;

        // Color Logic & CTA
        if (ratio >= 3) {
            fill.style.stroke = 'var(--neon-green)';
            fill.style.filter = 'drop-shadow(0 0 12px var(--neon-green))';
            ctaBox.classList.add('optimal');
            badge.innerText = "Compounding Asset";
            badge.className = "status-badge badge-compounding";
            ctaText.innerText = `Your ratio is ${ratio.toFixed(1)}:1. Stop using equity to fund this. Pour fuel on the fire.`;
        } else if (ratio > 1.5) {
            fill.style.stroke = 'var(--neon-cyan)';
            fill.style.filter = 'drop-shadow(0 0 8px var(--neon-cyan))';
            ctaBox.classList.remove('optimal');
            badge.innerText = "Average Efficiency";
            badge.className = "status-badge";
            ctaText.innerText = `Your ratio is ${ratio.toFixed(1)}:1. You're growing, but your unit economics need tightening.`;
        } else {
            fill.style.stroke = 'var(--neon-red)';
            fill.style.filter = 'drop-shadow(0 0 12px var(--neon-red))';
            ctaBox.classList.remove('optimal');
            badge.innerText = "Leaky Bucket";
            badge.className = "status-badge badge-leaky";
            ctaText.innerText = `Your ratio is ${ratio.toFixed(1)}:1. You are burning cash to stay still. Fix churn immediately.`;
        }
    }

    // Initialize
    calculate();