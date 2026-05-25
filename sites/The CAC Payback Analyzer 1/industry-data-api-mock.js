/**
 * EMERALD CIRCUIT - INDUSTRY BENCHMARK DATASET v1.0.4
 * MOCK API INTERFACE FOR CAC PAYBACK COMPARISON
 */

const IndustryBenchmarks = {
    saas: {
        label: "SaaS (Subscription)",
        topQuartile: 5.2,
        median: 11.8,
        bottomQuartile: 18.5,
        description: "Focus on Net Revenue Retention (NRR) and LTV/CAC ratios."
    },
    ecommerce: {
        label: "E-Commerce (D2C)",
        topQuartile: 1.0,
        median: 4.5,
        bottomQuartile: 9.0,
        description: "Requires rapid payback due to lower recurring predictability."
    },
    b2b: {
        label: "B2B Enterprise",
        topQuartile: 8.0,
        median: 14.5,
        bottomQuartile: 22.0,
        description: "Higher upfront CAC justified by high contract values (ACV)."
    },
    fintech: {
        label: "Fintech / Lending",
        topQuartile: 6.5,
        median: 12.0,
        bottomQuartile: 20.0,
        description: "Heavy emphasis on cost of capital and default-adjusted margins."
    }
};

/**
 * Simulates an asynchronous API call to fetch industry data
 */
async function fetchIndustryData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(IndustryBenchmarks);
        }, 450); // Simulated latency
    });
}

/**
 * Calculates quartile placement for user metrics
 * @param {string} industry 
 * @param {number} userPayback 
 */
function analyzeQuartilePlacement(industry, userPayback) {
    const data = IndustryBenchmarks[industry];
    if (!data) return null;

    let status, color, percentile;

    if (userPayback <= data.topQuartile) {
        status = "TOP QUARTILE";
        color = "#00ff88"; // --emerald
        percentile = "90th+ Percentile";
    } else if (userPayback <= data.median) {
        status = "ABOVE MEDIAN";
        color = "#00ff88"; 
        percentile = "60th-80th Percentile";
    } else if (userPayback <= data.bottomQuartile) {
        status = "BELOW MEDIAN";
        color = "#ffa502"; // --warning
        percentile = "30th-50th Percentile";
    } else {
        status = "BOTTOM QUARTILE";
        color = "#ff4757"; // --danger
        percentile = "Under-performing";
    }

    return {
        industry: data.label,
        status: status,
        color: color,
        percentile: percentile,
        benchmarkTop: data.topQuartile,
        benchmarkMedian: data.median,
        advice: data.description,
        timestamp: new Date().toISOString()
    };
}

// Global scope attachment for the static demo
window.IndustryDataAPI = {
    getBenchmarks: fetchIndustryData,
    compare: analyzeQuartilePlacement,
    raw: IndustryBenchmarks
};