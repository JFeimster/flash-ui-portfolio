const MATCHER_DATA = {
    // Configured Funding Routes with detailed underwriting requirements
    routes: [
        {
            id: 'sba-7a',
            name: 'SBA 7(a) Loan Program',
            niche: 'Prime Institutional Capital',
            accentColor: 'var(--cobalt-blue)',
            badge: 'Federal-Backed',
            description: 'Long-term government-supported working capital designed for established enterprises seeking lower interest rates and permanent growth capital.',
            averageCloseTime: '30-45 Business Days',
            minRequirements: {
                credit: 680,
                monthlyRevenue: 30000,
                timeInBusiness: 24 // in months
            },
            weightScale: {
                credit: 0.35,
                revenue: 0.35,
                tib: 0.30
            },
            checklist: [
                '3 Years Personal & Corporate Tax Returns',
                'Year-to-Date P&L & Balance Sheet',
                'Comprehensive Business Debt Schedule',
                '6 Months Verified Business Bank Statements'
            ],
            pipelineValue: 'Best for long-term capitalization'
        },
        {
            id: 'revenue-loc',
            name: 'Revenue-Based Line of Credit',
            niche: 'Flexible Operating Capital',
            accentColor: 'var(--electric-green)',
            badge: 'Fast Flowing',
            description: 'A dynamic revolving line of credit that scales in real-time alongside your monthly credit card receipts and invoice pipelines.',
            averageCloseTime: '48-72 Hours',
            minRequirements: {
                credit: 600,
                monthlyRevenue: 15000,
                timeInBusiness: 6 // in months
            },
            weightScale: {
                credit: 0.15,
                revenue: 0.60,
                tib: 0.25
            },
            checklist: [
                '3 Months Verified Business Bank Statements',
                'Active Credit Card Merchant Processing Ledger',
                'Business Voided Check & State Filing Docs'
            ],
            pipelineValue: 'Best for ongoing inventory & inventory spikes'
        },
        {
            id: 'bridge-loan',
            name: 'Commercial Bridge / Hard Money',
            niche: 'Structured Real Estate Asset',
            accentColor: 'var(--signal-orange)',
            badge: 'Asset-Backed',
            description: 'Short-term transitional financing backed by physical real estate, multi-unit complexes, or commercial developments awaiting permanent positioning.',
            averageCloseTime: '5-10 Business Days',
            minRequirements: {
                credit: 580,
                monthlyRevenue: 0, // Collateral backed
                timeInBusiness: 1 // Asset-driven
            },
            weightScale: {
                credit: 0.20,
                revenue: 0.10,
                tib: 0.10,
                collateral: 0.60
            },
            checklist: [
                'Purchase and Sale Agreement / Property Deed',
                'Comprehensive Property Appraisal Report',
                'Entity Formation Docs & Corporate Operating Agreement'
            ],
            pipelineValue: 'Best for real estate developers & rehab properties'
        },
        {
            id: 'mca-financing',
            name: 'Revenue Capital / Merchant Advance',
            niche: 'High-Velocity Scaling Finance',
            accentColor: 'var(--chrome-accent)',
            badge: 'Speed First',
            description: 'Immediate liquidity advances based entirely on future receivables. Ideal for high-turnover companies requiring capital within hours.',
            averageCloseTime: '24 Hours',
            minRequirements: {
                credit: 500,
                monthlyRevenue: 10000,
                timeInBusiness: 3 // in months
            },
            weightScale: {
                credit: 0.10,
                revenue: 0.70,
                tib: 0.20
            },
            checklist: [
                '3 Months Business Bank Statements',
                'Drivers License or Government ID',
                'Voided Corporate Business Check'
            ],
            pipelineValue: 'Best for high-volume retail, eCommerce & transport'
        },
        {
            id: 'credit-prep',
            name: 'Business Credit Builder Pathway',
            niche: 'Non-Guarantee Pre-Flight Prep',
            accentColor: 'var(--bone-white)',
            badge: 'Pre-Revenue Allowed',
            description: 'Designed specifically for startups or credit-challenged entities. Systematically establishes high-grade corporate files that do not rely on personal FICO backing.',
            averageCloseTime: '30-60 Days (Program Prep)',
            minRequirements: {
                credit: 0, // No minimums
                monthlyRevenue: 0,
                timeInBusiness: 0
            },
            weightScale: {
                credit: 0.50, // Evaluates improvement trajectory
                revenue: 0.20,
                tib: 0.30
            },
            checklist: [
                'Active Employer Identification Number (EIN)',
                'Registered Secretary of State Filing Docs',
                'Business Phone Utility & D-U-N-S Number Activation'
            ],
            pipelineValue: 'Best for pre-revenue startups and entity builders'
        }
    ],

    // Underwriting Thresholds and Input Options for the interactive widget
    thresholds: {
        timeInBusiness: [
            { label: 'Pre-Launch / Startup (< 3 Months)', value: 0, weight: 10 },
            { label: 'Early-Stage (3 to 11 Months)', value: 6, weight: 50 },
            { label: 'Established (1 to 2 Years)', value: 18, weight: 80 },
            { label: 'Veteran Operator (2+ Years)', value: 24, weight: 100 }
        ],
        monthlyRevenue: [
            { label: 'Under $10,000 / month', value: 5000, weight: 20 },
            { label: '$10,000 to $29,999 / month', value: 15000, weight: 55 },
            { label: '$30,000 to $99,999 / month', value: 50000, weight: 85 },
            { label: '$100,000+ / month', value: 120000, weight: 100 }
        ],
        creditScore: [
            { label: 'Subprime (< 580 FICO)', value: 500, weight: 20 },
            { label: 'Moderate (580 to 659 FICO)', value: 620, weight: 55 },
            { label: 'Strong (660 to 719 FICO)', value: 680, weight: 85 },
            { label: 'Elite (720+ FICO)', value: 740, weight: 100 }
        ]
    },

    // Evaluates inputs against mathematical threshold models to return Match Scores
    evaluateMatch: function (inputs) {
        const results = this.routes.map(route => {
            let score = 0;
            const reasons = [];
            const barriers = [];

            // 1. Time In Business Check
            const tibVal = inputs.timeInBusiness;
            const tibReq = route.minRequirements.timeInBusiness;
            if (tibVal >= tibReq) {
                const ratio = tibReq === 0 ? 1 : Math.min(1.2, tibVal / tibReq);
                score += ratio * 100 * route.weightScale.tib;
                reasons.push('Meets or exceeds operational timeline threshold.');
            } else {
                score += (tibVal / Math.max(1, tibReq)) * 100 * route.weightScale.tib;
                barriers.push(`Time in business (${tibVal}mo) is below the preferred target of ${tibReq}mo.`);
            }

            // 2. Monthly Revenue Check
            const revVal = inputs.monthlyRevenue;
            const revReq = route.minRequirements.monthlyRevenue;
            if (revVal >= revReq) {
                const ratio = revReq === 0 ? 1 : Math.min(1.2, revVal / revReq);
                score += ratio * 100 * route.weightScale.revenue;
                reasons.push('Monthly commercial income supports pipeline underwriting levels.');
            } else {
                score += (revVal / Math.max(1, revReq)) * 100 * route.weightScale.revenue;
                barriers.push(`Monthly revenue of $${revVal.toLocaleString()} is below the preferred target of $${revReq.toLocaleString()}.`);
            }

            // 3. FICO Credit Score Check
            const creditVal = inputs.creditScore;
            const creditReq = route.minRequirements.credit;
            if (creditVal >= creditReq) {
                const ratio = creditReq === 0 ? 1 : Math.min(1.1, creditVal / creditReq);
                score += ratio * 100 * route.weightScale.credit;
                reasons.push('FICO score matches premium lending parameters.');
            } else {
                score += (creditVal / Math.max(1, creditReq)) * 100 * route.weightScale.credit;
                barriers.push(`FICO profile (${creditVal}) is below the preferred institutional baseline of ${creditReq}.`);
            }

            // 4. Industry modifier if provided (Custom adjust rules)
            if (inputs.industry) {
                const highRiskIndustries = ['gambling', 'cannabis', 'adult', 'non-profit'];
                if (highRiskIndustries.includes(inputs.industry.toLowerCase()) && route.id === 'sba-7a') {
                    score = Math.max(20, score - 30);
                    barriers.push('Sector contains high institutional regulatory restrictions.');
                }
            }

            // Bound score values cleanly
            const finalScore = Math.min(100, Math.max(0, Math.round(score)));

            return {
                ...route,
                matchPercentage: finalScore,
                reasons: reasons.slice(0, 2),
                barriers: barriers.slice(0, 2),
                isViable: finalScore >= 70
            };
        });

        // Sort descending based on match score
        return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }
};

// Export pattern for both modular and global script injection
if (typeof exports !== 'undefined') {
    module.exports = MATCHER_DATA;
} else {
    window.MATCHER_DATA = MATCHER_DATA;
}