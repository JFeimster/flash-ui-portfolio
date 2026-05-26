const CHANNEL_MOCK_DATA = [
    {
        id: "ch-001",
        channel: "Organic Search (SEO)",
        ltvCac: 5.4,
        volume: 78,
        spend: 4200,
        trend: "up",
        quadrant: "Golden Goose",
        color: "var(--neon-green)",
        metrics: {
            arpu: 185,
            churn: 3.2,
            cac: 1080
        },
        analysis: "High-intent traffic with compounding returns. Current content velocity is capturing top-of-funnel efficiently."
    },
    {
        id: "ch-002",
        channel: "Paid Search (SEM)",
        ltvCac: 2.8,
        volume: 92,
        spend: 15500,
        trend: "stable",
        quadrant: "Scalable Growth",
        color: "var(--neon-cyan)",
        metrics: {
            arpu: 150,
            churn: 4.5,
            cac: 1190
        },
        analysis: "Maximum reach achieved. CAC is sensitive to bid competition; minor optimizations needed to move into Golden Goose quadrant."
    },
    {
        id: "ch-003",
        channel: "Referral / Affiliate",
        ltvCac: 8.2,
        volume: 25,
        spend: 1200,
        trend: "up",
        quadrant: "Under-Utilized",
        color: "var(--neon-purple)",
        metrics: {
            arpu: 210,
            churn: 2.1,
            cac: 1220
        },
        analysis: "Highest unit economics but lowest volume. Scaling this channel via improved partner incentives should be priority #1."
    },
    {
        id: "ch-004",
        channel: "Paid Social (Ads)",
        ltvCac: 1.4,
        volume: 85,
        spend: 12800,
        trend: "down",
        quadrant: "Efficiency Trap",
        color: "var(--neon-red)",
        metrics: {
            arpu: 135,
            churn: 6.8,
            cac: 1420
        },
        analysis: "High volume is masking poor retention. Users acquired here have high churn sensitivity. Re-evaluate targeting parameters."
    },
    {
        id: "ch-005",
        channel: "Cold Outbound",
        ltvCac: 2.1,
        volume: 45,
        spend: 6000,
        trend: "stable",
        quadrant: "Manual Grind",
        color: "var(--text-dim)",
        metrics: {
            arpu: 250,
            churn: 4.0,
            cac: 3000
        },
        analysis: "Predictable but labor intensive. Efficiency is limited by sales team headcount and manual prospecting bottlenecks."
    }
];

const QUADRANT_DEFINITIONS = {
    GOLDEN_GOOSE: {
        label: "Golden Goose",
        description: "High Scale / High Efficiency",
        action: "Aggressive Reinvestment",
        minRatio: 3.5,
        minVolume: 60
    },
    SCALABLE_GROWTH: {
        label: "Scalable Growth",
        description: "High Scale / Moderate Efficiency",
        action: "Tighten CAC Constraints",
        minRatio: 2.0,
        minVolume: 60
    },
    UNDER_UTILIZED: {
        label: "The Gold Mine",
        description: "Low Scale / High Efficiency",
        action: "Increase Budget / Fuel",
        minRatio: 3.5,
        minVolume: 0
    },
    EFFICIENCY_TRAP: {
        label: "Danger Zone",
        description: "High Scale / Low Efficiency",
        action: "Immediate Cut / Pivot",
        minRatio: 0,
        minVolume: 60
    }
};

/**
 * Calculates budget reallocation suggestions based on LTV:CAC efficiency
 * @param {Array} channels 
 * @returns {Object} suggestions
 */
function getBudgetReallocations(channels) {
    return channels.map(ch => ({
        channel: ch.channel,
        recommendation: ch.ltvCac > 4 ? "INCREASE BUDGET" : (ch.ltvCac < 1.5 ? "REDUCE SPEND" : "MAINTAIN"),
        impactScore: (ch.ltvCac * ch.volume) / 100
    })).sort((a, b) => b.impactScore - a.impactScore);
}

export { CHANNEL_MOCK_DATA, QUADRANT_DEFINITIONS, getBudgetReallocations };