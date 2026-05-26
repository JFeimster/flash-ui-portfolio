const arpuInput = document.getElementById('arpu');
        const churnInput = document.getElementById('churn');
        const cacInput = document.getElementById('cac');
        const ratioDisplay = document.getElementById('ratio-display');
        const ltvDisplay = document.getElementById('ltv-calc');
        const statusText = document.getElementById('status-text');
        const gaugePath = document.getElementById('gauge-path');
        const ctaButton = document.getElementById('cta-button');
        const glow = document.getElementById('status-glow');

        function updateDiagnostic() {
            const arpu = parseFloat(arpuInput.value) || 0;
            const churnPercent = parseFloat(churnInput.value) || 0;
            const cac = parseFloat(cacInput.value) || 1; // Prevent div by zero

            const churnDecimal = churnPercent / 100;
            const ltv = churnDecimal > 0 ? (arpu / churnDecimal) : 0;
            const ratio = ltv / cac;

            // Update Text
            ratioDisplay.textContent = ratio.toFixed(1);
            ltvDisplay.textContent = `Calculated LTV: $${ltv.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

            // Gauge Calculation (stroke-dashoffset from 314 to 0)
            // We'll map 0-6 ratio to the gauge arc.
            const maxGaugeRatio = 6;
            const percentage = Math.min(ratio / maxGaugeRatio, 1);
            const offset = 314 - (percentage * 314);
            gaugePath.style.strokeDashoffset = offset;

            // Logic Styling & CTA
            if (ratio >= 3) {
                gaugePath.style.stroke = 'var(--success)';
                statusText.textContent = "Compounding Asset";
                statusText.style.color = 'var(--success)';
                glow.style.background = 'radial-gradient(circle, var(--success) 0%, transparent 70%)';
                ctaButton.textContent = `Your ratio is ${ratio.toFixed(1)}:1. Stop using equity to fund this.`;
            } else if (ratio >= 1.5) {
                gaugePath.style.stroke = 'var(--warning)';
                statusText.textContent = "Sustainable Growth";
                statusText.style.color = 'var(--warning)';
                glow.style.background = 'radial-gradient(circle, var(--warning) 0%, transparent 70%)';
                ctaButton.textContent = `Your ratio is ${ratio.toFixed(1)}:1. Optimize for scale.`;
            } else {
                gaugePath.style.stroke = 'var(--danger)';
                statusText.textContent = "Leaky Bucket";
                statusText.style.color = 'var(--danger)';
                glow.style.background = 'radial-gradient(circle, var(--danger) 0%, transparent 70%)';
                ctaButton.textContent = `Ratio: ${ratio.toFixed(1)}:1. Fix churn before burning.`;
            }
        }

        [arpuInput, churnInput, cacInput].forEach(input => {
            input.addEventListener('input', updateDiagnostic);
        });

        // Initialize
        updateDiagnostic();