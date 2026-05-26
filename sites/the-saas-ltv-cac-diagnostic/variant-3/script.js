const arpuInput = document.getElementById('arpu');
    const churnInput = document.getElementById('churn');
    const cacInput = document.getElementById('cac');
    
    const gaugeFill = document.getElementById('gauge-fill');
    const needle = document.getElementById('needle');
    const ratioText = document.getElementById('ratio-text');
    const statusBadge = document.getElementById('status-badge');
    const ctaMessage = document.getElementById('cta-message');

    function calculate() {
        const arpu = parseFloat(arpuInput.value) || 0;
        const churn = parseFloat(churnInput.value) || 0;
        const cac = parseFloat(cacInput.value) || 1; // Avoid div by 0

        // LTV = ARPU / Churn Rate
        const ltv = churn > 0 ? (arpu / (churn / 100)) : 0;
        const ratio = ltv / cac;
        
        updateUI(ratio);
    }

    function updateUI(ratio) {
        const displayRatio = ratio.toFixed(1);
        ratioText.innerText = `${displayRatio}:1`;

        // Map ratio to degrees (0 to 10:1 ratio scale)
        // -90deg is 0, 90deg is 10+
        let rotation = (ratio / 6) * 180 - 90;
        if (rotation > 90) rotation = 90;
        if (rotation < -90) rotation = -90;

        needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        
        // Gauge color mapping
        if (ratio >= 3) {
            gaugeFill.style.borderTopColor = 'var(--success)';
            gaugeFill.style.borderRightColor = 'var(--success)';
            statusBadge.innerText = "Compounding Asset";
            statusBadge.className = "status-badge status-healthy";
            ctaMessage.innerHTML = `Your ratio is <span>${displayRatio}:1</span>. Stop using equity to fund this.`;
        } else {
            gaugeFill.style.borderTopColor = 'var(--danger)';
            gaugeFill.style.borderRightColor = 'var(--danger)';
            statusBadge.innerText = "Leaky Bucket";
            statusBadge.className = "status-badge status-danger";
            ctaMessage.innerHTML = `Your ratio is <span>${displayRatio}:1</span>. Fix retention before scaling.`;
        }
    }

    [arpuInput, churnInput, cacInput].forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Initial calculation
    calculate();