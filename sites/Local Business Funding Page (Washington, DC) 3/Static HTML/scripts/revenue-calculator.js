/**
 * DC Restaurant & Hospitality Funding Calculator
 * Tailored for District of Columbia operators
 */

document.addEventListener('DOMContentLoaded', () => {
    const revenueInput = document.getElementById('monthly-revenue');
    const revenueRange = document.getElementById('revenue-range');
    const restaurantType = document.getElementById('establishment-type');
    const liquorLicense = document.getElementById('liquor-license');
    const calculateBtn = document.getElementById('calculate-funding-btn');
    
    const displayMin = document.getElementById('est-min');
    const displayMax = document.getElementById('est-max');
    const revenueDisplay = document.getElementById('revenue-val-display');

    /**
     * Format numbers to US Currency
     */
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    /**
     * Update the range display label
     */
    if (revenueRange && revenueDisplay) {
        revenueRange.addEventListener('input', (e) => {
            const val = e.target.value;
            revenueDisplay.textContent = formatCurrency(val);
            if (revenueInput) revenueInput.value = val;
        });
    }

    /**
     * Calculation Logic for DC Market
     * Factors in neighborhood volatility and liquor license equity
     */
    const performCalculation = () => {
        const monthlyRevenue = parseFloat(revenueRange ? revenueRange.value : revenueInput.value);
        
        if (isNaN(monthlyRevenue) || monthlyRevenue <= 0) {
            return;
        }

        // Base multipliers for hospitality (typically 1x to 2.5x monthly gross)
        let multiplierMin = 1.1;
        let multiplierMax = 2.4;

        // Establishment type adjustments
        // DC specific: QSR/Fast Casual moves faster, Fine Dining gets larger blocks
        const type = restaurantType ? restaurantType.value : 'standard';
        switch (type) {
            case 'fine-dining':
                multiplierMin += 0.2;
                multiplierMax += 0.4;
                break;
            case 'qsr':
                multiplierMin += 0.1;
                multiplierMax += 0.2;
                break;
            case 'bar-nightclub':
                multiplierMin -= 0.1; // Higher risk profile in DC
                multiplierMax += 0.5; // But higher cash flow potential
                break;
        }

        // Liquor License Factor
        // In DC, a transferable liquor license is a significant asset for underwriters
        if (liquorLicense && liquorLicense.checked) {
            multiplierMax += 0.3;
        }

        const finalMin = monthlyRevenue * multiplierMin;
        const finalMax = monthlyRevenue * multiplierMax;

        animateValue(displayMin, finalMin);
        animateValue(displayMax, finalMax);
    };

    /**
     * Counter Animation for UI Polish
     */
    const animateValue = (element, endValue) => {
        if (!element) return;
        
        let start = 0;
        const duration = 800;
        const startTime = performance.now();

        const step = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentVal = Math.floor(progress * (endValue - start) + start);
            element.textContent = formatCurrency(currentVal);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = formatCurrency(endValue);
            }
        };

        window.requestAnimationFrame(step);
    };

    if (calculateBtn) {
        calculateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performCalculation();
            
            // Visual feedback
            calculateBtn.innerText = "Recalculating...";
            setTimeout(() => {
                calculateBtn.innerText = "Get Your Quote";
            }, 1000);
        });
    }

    // Run once on load if values exist
    if (revenueRange && revenueRange.value > 0) {
        performCalculation();
    }
});