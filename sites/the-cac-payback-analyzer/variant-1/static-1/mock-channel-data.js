const CHANNEL_PERFORMANCE_DATA = [
    {
        id: "meta-ads-01",
        name: "Meta Ads (FB/IG)",
        spend: 42500,
        customers: 340,
        arpu: 115,
        margin: 82,
        trend: 12.4,
        paybackMonths: 1.3,
        status: "bankable",
        lastSync: "2023-10-24T14:20:00Z"
    },
    {
        id: "google-search-01",
        name: "Google Search",
        spend: 28000,
        customers: 190,
        arpu: 145,
        margin: 75,
        trend: -2.1,
        paybackMonths: 2.5,
        status: "bankable",
        lastSync: "2023-10-24T14:15:00Z"
    },
    {
        id: "tiktok-spark-01",
        name: "TikTok Spark",
        spend: 15000,
        customers: 410,
        arpu: 48,
        margin: 60,
        trend: 45.8,
        paybackMonths: 5.2,
        status: "bankable",
        lastSync: "2023-10-24T13:45:00Z"
    },
    {
        id: "linkedin-b2b-01",
        name: "LinkedIn Pro",
        spend: 12000,
        customers: 28,
        arpu: 450,
        margin: 88,
        trend: 5.2,
        paybackMonths: 10.8,
        status: "neutral",
        lastSync: "2023-10-24T12:00:00Z"
    },
    {
        id: "yt-discovery-01",
        name: "YouTube Discovery",
        spend: 31000,
        customers: 115,
        arpu: 110,
        margin: 70,
        trend: -8.4,
        paybackMonths: 14.2,
        status: "risky",
        lastSync: "2023-10-24T10:30:00Z"
    },
    {
        id: "twitter-x-01",
        name: "X (Twitter) Ads",
        spend: 8500,
        customers: 42,
        arpu: 65,
        margin: 65,
        trend: -15.2,
        paybackMonths: 21.4,
        status: "risky",
        lastSync: "2023-10-24T09:15:00Z"
    }
];

const DASHBOARD_METRICS = {
    totalSpend: 137000,
    blendedPayback: 4.8,
    capitalEfficiency: "High",
    protocolVersion: "2.4.1",
    nodeStatus: "Operational"
};

/**
 * Utility function to calculate metrics for a channel object
 * following the Emerald Circuit logic.
 */
function getChannelAnalysis(channel) {
    const cac = channel.spend / channel.customers;
    const contributionMargin = channel.arpu * (channel.margin / 100);
    const payback = cac / contributionMargin;
    
    let classification = "risky";
    if (payback < 6) classification = "bankable";
    else if (payback <= 12) classification = "neutral";
    
    return {
        cac: Math.round(cac),
        monthlyContribution: contributionMargin.toFixed(2),
        paybackMonths: payback.toFixed(1),
        classification: classification
    };
}

// Global exposure for the analyzer dashboard
window.MOCK_CHANNELS = CHANNEL_PERFORMANCE_DATA;
window.MOCK_METRICS = DASHBOARD_METRICS;
window.calculateChannel = getChannelAnalysis;