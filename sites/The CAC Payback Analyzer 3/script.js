function calculate() {
            const spend = parseFloat(document.getElementById('spend').value) || 0;
            const customers = parseFloat(document.getElementById('customers').value) || 0;
            const arpu = parseFloat(document.getElementById('arpu').value) || 0;
            const margin = parseFloat(document.getElementById('margin').value) || 0;

            const cac = customers > 0 ? spend / customers : 0;
            const monthlyContribution = arpu * (margin / 100);
            const payback = monthlyContribution > 0 ? cac / monthlyContribution : 0;

            // Update UI
            document.getElementById('cacValue').innerText = `$${cac.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            document.getElementById('paybackValue').innerText = payback.toFixed(1);

            // Gauge Logic
            // Scale: 0 to 24 months. 0 is leftmost, 24 is rightmost.
            // We want < 6 months to be in the "Good" zone.
            // Invert the visual: Lower payback = more green (left side).
            // Actually, let's map 0-24 months to -90 to +90 degrees.
            let clampedPayback = Math.min(Math.max(payback, 0), 24);
            let percentage = clampedPayback / 24;
            
            // Rotation: -90deg is 0 months, +90deg is 24 months
            let rotation = -90 + (percentage * 180);
            document.getElementById('needle').style.transform = `translateX(-50%) rotate(${rotation}deg)`;

            // Path Dashoffset (Full is 282)
            const fill = document.getElementById('gaugeFill');
            fill.style.strokeDashoffset = 282 - (percentage * 282);

            // Status Logic
            const statusEl = document.getElementById('bankabilityStatus');
            if (payback <= 6) {
                statusEl.innerText = "MONEY PRINTER DETECTED";
                statusEl.className = "bankability-status status-bankable";
                fill.style.stroke = "var(--accent)";
            } else if (payback <= 12) {
                statusEl.innerText = "EFFICIENT ENGINE";
                statusEl.className = "bankability-status status-neutral";
                fill.style.stroke = "var(--warning)";
            } else {
                statusEl.innerText = "HIGH ACQUISITION RISK";
                statusEl.className = "bankability-status status-risky";
                fill.style.stroke = "var(--danger)";
            }
        }

        // Init
        calculate();