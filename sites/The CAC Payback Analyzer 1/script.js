const inputs = ['spend', 'customers', 'arpu', 'margin'];
        const needle = document.getElementById('needle');
        const gaugeTrack = document.getElementById('gauge-track');
        const paybackDisplay = document.getElementById('payback-value');
        const statusBadge = document.getElementById('status-badge');
        const cacDisplay = document.getElementById('cac-val');
        const cmDisplay = document.getElementById('cm-val');
        const ctaMessage = document.getElementById('cta-message');

        function updateAnalyzer() {
            const spend = parseFloat(document.getElementById('spend').value) || 0;
            const customers = parseFloat(document.getElementById('customers').value) || 0;
            const arpu = parseFloat(document.getElementById('arpu').value) || 0;
            const margin = parseFloat(document.getElementById('margin').value) || 0;

            if (customers === 0 || arpu === 0 || margin === 0) {
                resetUI();
                return;
            }

            const cac = spend / customers;
            const contributionMargin = arpu * (margin / 100);
            const paybackMonths = cac / contributionMargin;

            // Update Text
            cacDisplay.textContent = `$${Math.round(cac).toLocaleString()}`;
            cmDisplay.textContent = `$${Math.round(contributionMargin).toLocaleString()}`;
            paybackDisplay.textContent = paybackMonths.toFixed(1);

            // Gauge Logic
            // 0 months = -90deg, 18 months = 90deg
            let rotation = -90 + (Math.min(paybackMonths, 18) / 18) * 180;
            needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;

            // SVG Track Logic
            // Total length is approx 251 (Pi * r)
            const circumference = 251;
            const percentage = Math.min(paybackMonths, 18) / 18;
            gaugeTrack.style.strokeDashoffset = circumference * (1 - percentage);

            // Coloring & Status
            if (paybackMonths < 6) {
                statusBadge.textContent = "Elite Bankability";
                statusBadge.className = "status-badge status-bankable";
                gaugeTrack.style.stroke = "var(--emerald)";
                paybackDisplay.style.color = "var(--emerald)";
                paybackDisplay.classList.add('bankable-glow');
                ctaMessage.textContent = "You have a money printer. Let us fund your CAC.";
            } else if (paybackMonths <= 12) {
                statusBadge.textContent = "Market Neutral";
                statusBadge.className = "status-badge status-neutral";
                gaugeTrack.style.stroke = "var(--warning)";
                paybackDisplay.style.color = "var(--warning)";
                paybackDisplay.classList.remove('bankable-glow');
                ctaMessage.textContent = "Solid unit economics. We can optimize this.";
            } else {
                statusBadge.textContent = "High Risk Profile";
                statusBadge.className = "status-badge status-risky";
                gaugeTrack.style.stroke = "var(--danger)";
                paybackDisplay.style.color = "var(--danger)";
                paybackDisplay.classList.remove('bankable-glow');
                ctaMessage.textContent = "Efficiency warning. Tighten your engine.";
            }
        }

        function resetUI() {
            paybackDisplay.textContent = "0.0";
            statusBadge.textContent = "Awaiting Data";
            statusBadge.className = "status-badge";
            needle.style.transform = `translateX(-50%) rotate(-90deg)`;
            gaugeTrack.style.strokeDashoffset = 251;
        }

        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', updateAnalyzer);
        });

        // Init
        updateAnalyzer();