document.addEventListener('DOMContentLoaded', function() {
    /**
     * SWISS LEDGER | LTV:CAC DEEP-DIVE LOGIC
     * Focuses on long-term capital efficiency and ROI verification.
     */

    const inputIds = ['spend', 'customers', 'arpu', 'margin', 'churn', 'discount'];
    const cacValue = document.getElementById('cacValue');
    const ltvValue = document.getElementById('ltvValue');
    const ratioValue = document.getElementById('ratioValue');
    const statusBox = document.getElementById('statusBox');
    const dialProgress = document.getElementById('dialProgress');

    function calculate() {
        // Extraction of inputs
        const spend = parseFloat(document.getElementById('spend').value) || 0;
        const customers = parseFloat(document.getElementById('customers').value) || 0;
        const arpu = parseFloat(document.getElementById('arpu').value) || 0;
        const margin = (parseFloat(document.getElementById('margin').value) || 0) / 100;
        const churn = (parseFloat(document.getElementById('churn').value) || 0) / 100;
        const discount = (parseFloat(document.getElementById('discount').value) || 0) / 100 / 12;

        // Validation - prevent division by zero or negative logic
        if (customers <= 0 || arpu <= 0) return;

        // CAC Calculation
        const cac = spend / customers;
        
        // Lifetime Value (LTV) Calculation
        // Adjusted for Churn and Discount Rate (NPV of customer)
        const monthlyGrossProfit = arpu * margin;
        const retentionFactor = churn + discount;
        
        // If churn and discount are both 0, the LTV is theoretically infinite
        // We cap the divisor to prevent mathematical errors
        const ltv = monthlyGrossProfit / (retentionFactor || 0.0001);
        
        // LTV:CAC Ratio
        const ratio = ltv / cac;

        // Update Textual Displays
        if (cacValue) {
            cacValue.innerText = `$${cac.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        if (ltvValue) {
            ltvValue.innerText = `$${ltv.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        if (ratioValue) {
            ratioValue.innerText = `${ratio.toFixed(2)}x`;
        }

        // Update Bankability Dial
        // Standard SaaS Benchmarks: < 1.5x Rejected, 1.5-3x Caution, > 3x Bankable
        // Max range for dial visualization is a 5.0 ratio
        const maxRatio = 5;
        const percentage = Math.max(0, Math.min(100, (ratio / maxRatio) * 100));
        
        // Swiss Ledger Dial Math: Dashoffset 440 (empty) to 190 (full)
        const offset = 440 - (percentage * 2.5);
        
        if (dialProgress) {
            dialProgress.style.strokeDashoffset = offset;

            if (ratio >= 3.0) {
                dialProgress.style.stroke = "var(--success)";
                updateStatus("PRINTER STATUS: BANKABLE", "success");
            } else if (ratio >= 1.5) {
                dialProgress.style.stroke = "var(--warning)";
                updateStatus("PRINTER STATUS: CAUTION", "warning");
            } else {
                dialProgress.style.stroke = "var(--danger)";
                updateStatus("PRINTER STATUS: REJECTED", "danger");
            }
        }
    }

    /**
     * Updates the status box visual styling to match Swiss Ledger UI
     */
    function updateStatus(text, level) {
        if (!statusBox) return;
        
        statusBox.innerText = text;
        
        const config = {
            success: {
                bg: "rgba(0, 129, 72, 0.1)",
                color: "var(--success)",
                border: "var(--success)"
            },
            warning: {
                bg: "rgba(235, 203, 0, 0.1)",
                color: "#8a7700",
                border: "var(--warning)"
            },
            danger: {
                bg: "rgba(255, 59, 48, 0.1)",
                color: "var(--danger)",
                border: "var(--danger)"
            }
        };

        const style = config[level];
        statusBox.style.backgroundColor = style.bg;
        statusBox.style.color = style.color;
        statusBox.style.borderColor = style.border;
    }

    // Attach listeners to all input fields
    inputIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calculate);
        }
    });

    // Execute initial calculation on load
    calculate();
});