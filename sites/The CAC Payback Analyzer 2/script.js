const inputs = ['spend', 'customers', 'arpu', 'margin'];
    const dialProgress = document.getElementById('dialProgress');
    const cacValue = document.getElementById('cacValue');
    const paybackValue = document.getElementById('paybackValue');
    const statusBox = document.getElementById('statusBox');

    function calculate() {
        const spend = parseFloat(document.getElementById('spend').value) || 0;
        const customers = parseFloat(document.getElementById('customers').value) || 0;
        const arpu = parseFloat(document.getElementById('arpu').value) || 0;
        const margin = parseFloat(document.getElementById('margin').value) / 100 || 0;

        if (customers === 0 || arpu === 0 || margin === 0) return;

        const cac = spend / customers;
        const monthlyGrossProfit = arpu * margin;
        const payback = cac / monthlyGrossProfit;

        // Update Text
        cacValue.innerText = `$${cac.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        paybackValue.innerText = `${payback.toFixed(2)} Mo.`;

        // Update Dial (Inverted: Lower is better. 18 months = 0%, 0 months = 100%)
        // Max range is 18 months for the dial
        const maxMonths = 18;
        const percentage = Math.max(0, Math.min(100, ((maxMonths - payback) / maxMonths) * 100));
        
        // Dashoffset: 440 (empty) to 190 (full)
        // Correct range calculation for the path:
        const offset = 440 - (percentage * 2.5); 
        dialProgress.style.strokeDashoffset = offset;

        // Visual Colors and Status
        if (payback < 6) {
            dialProgress.style.stroke = "var(--success)";
            statusBox.innerText = "PRINTER STATUS: BANKABLE";
            statusBox.style.backgroundColor = "rgba(0, 129, 72, 0.1)";
            statusBox.style.color = "var(--success)";
            statusBox.style.borderColor = "var(--success)";
        } else if (payback < 12) {
            dialProgress.style.stroke = "var(--warning)";
            statusBox.innerText = "PRINTER STATUS: CAUTION";
            statusBox.style.backgroundColor = "rgba(235, 203, 0, 0.1)";
            statusBox.style.color = "#8a7700";
            statusBox.style.borderColor = "var(--warning)";
        } else {
            dialProgress.style.stroke = "var(--danger)";
            statusBox.innerText = "PRINTER STATUS: REJECTED";
            statusBox.style.backgroundColor = "rgba(255, 59, 48, 0.1)";
            statusBox.style.color = "var(--danger)";
            statusBox.style.borderColor = "var(--danger)";
        }
    }

    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculate);
    });

    // Initial run
    calculate();