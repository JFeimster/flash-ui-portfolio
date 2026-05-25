document.addEventListener('DOMContentLoaded', () => {
    /**
     * DC Business Eligibility & Rates Calculator
     * Fintech logic for District Capital Partners
     */

    // Selectors
    const revenueSlider = document.getElementById('rev-range');
    const yearsSlider = document.getElementById('years-range');
    const revDisplay = document.getElementById('rev-display');
    const yearsDisplay = document.getElementById('years-display');
    
    const amountOutput = document.getElementById('est-funding-amount');
    const rateOutput = document.getElementById('est-rate');
    const productOutput = document.getElementById('est-product');
    const eligibilityTag = document.getElementById('eligibility-status');

    /**
     * Formatter for Currency
     */
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    });

    /**
     * Core Calculation Logic
     */
    const updateCalculator = () => {
        const revenue = parseInt(revenueSlider.value);
        const years = parseFloat(yearsSlider.value);

        // Update UI labels
        revDisplay.textContent = formatter.format(revenue);
        yearsDisplay.textContent = years === 0.5 ? "6+ Months" : `${years} Year${years > 1 ? 's' : ''}`;

        let multiplier = 1.0;
        let baseRate = 18.5;
        let product = "Working Capital Line";
        let status = "High Eligibility";

        // Logic based on Time in Business
        if (years >= 3) {
            multiplier = 2.2;
            baseRate = 7.9;
            product = "SBA-Backed Expansion Loan";
        } else if (years >= 1) {
            multiplier = 1.5;
            baseRate = 12.4;
            product = "Revenue-Based Financing";
        } else {
            multiplier = 0.8;
            baseRate = 16.9;
            product = "Bridge Funding";
        }

        // Revenue adjustments
        if (revenue < 10000) {
            status = "Review Required";
            baseRate += 2;
        } else if (revenue > 150000) {
            baseRate -= 1.5;
        }

        const estimatedFunding = revenue * multiplier;

        // Apply DOM Updates with a subtle "counting" feel if needed, 
        // but here we update directly for performance
        amountOutput.textContent = formatter.format(estimatedFunding);
        rateOutput.textContent = `As low as ${baseRate.toFixed(1)}%`;
        productOutput.textContent = product;
        
        if (eligibilityTag) {
            eligibilityTag.textContent = status;
            eligibilityTag.style.color = status === "High Eligibility" ? "#C5A059" : "#94A3B8";
        }

        // Sync slider background track (Gold accent)
        const updateTrack = (el) => {
            const val = (el.value - el.min) / (el.max - el.min) * 100;
            el.style.background = `linear-gradient(to right, #C5A059 ${val}%, #162B45 ${val}%)`;
        };

        updateTrack(revenueSlider);
        updateTrack(yearsSlider);
    };

    /**
     * Event Listeners
     */
    if (revenueSlider && yearsSlider) {
        revenueSlider.addEventListener('input', updateCalculator);
        yearsSlider.addEventListener('input', updateCalculator);

        // Initialized calculation
        updateCalculator();
    }

    /**
     * CTA Tracking Logic
     * Simulates high-intent lead capture for the District Capital funnel
     */
    const calcCta = document.querySelector('.calculator-card .cta-button');
    if (calcCta) {
        calcCta.addEventListener('click', (e) => {
            const data = {
                revenue: revenueSlider.value,
                tenure: yearsSlider.value,
                timestamp: new Date().toISOString(),
                location: "DC Metro Area"
            };
            console.log("Lead Metadata Captured:", data);
            // Functionality would typically redirect to deep-application form here
        });
    }
});

/**
 * CSS Dynamic Injection for Sliders
 * Ensures the sliders match the District Capital gold/navy aesthetic
 */
const style = document.createElement('style');
style.textContent = `
    input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background: #162B45;
        outline: none;
        margin: 20px 0;
    }
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #C5A059;
        cursor: pointer;
        border-radius: 50%;
        border: 2px solid #0A1629;
        transition: all 0.2s ease;
    }
    input[type=range]::-webkit-slider-thumb:hover {
        transform: scale(1.2);
        background: #D4AF37;
    }
`;
document.head.appendChild(style);