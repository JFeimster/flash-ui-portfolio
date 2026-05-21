const DEAL_STORAGE_KEY = 'moonshine_deals';
const REFERRAL_STORAGE_KEY = 'moonshine_referrals';

/**
 * Deal Pipeline & Commission Tracker Logic
 * Manages the relationship between referral sources and actual funding volume.
 */

const DEAL_STATUS_CONFIG = {
    'Prequalified': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '○' },
    'Underwriting': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '⋯' },
    'Funded': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '✓' },
    'Declined': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '✕' }
};

class DealStorage {
    static init() {
        if (!localStorage.getItem(DEAL_STORAGE_KEY)) {
            this.seedData();
        }
    }

    static seedData() {
        const initialDeals = [
            {
                id: 1704100000000,
                sourceId: 1, 
                clientName: "Vertex Logistics LLC",
                amount: 450000,
                status: "Funded",
                commissionRate: 0.02, // 2%
                dateSubmitted: "2023-11-15",
                lastUpdated: "2023-12-01",
                notes: "Marcus's primary logistics referral."
            },
            {
                id: 1704100000001,
                sourceId: 1,
                clientName: "Cloud9 SaaS",
                amount: 125000,
                status: "Underwriting",
                commissionRate: 0.015,
                dateSubmitted: "2024-01-02",
                lastUpdated: "2024-01-08",
                notes: "RBF financing structure."
            },
            {
                id: 1704100000002,
                sourceId: 2,
                clientName: "Downtown Bistro",
                amount: 75000,
                status: "Prequalified",
                commissionRate: 0.01,
                dateSubmitted: "2024-01-10",
                lastUpdated: "2024-01-10",
                notes: "Equipment lease for new kitchen."
            }
        ];
        this.saveDeals(initialDeals);
    }

    static getDeals() {
        return JSON.parse(localStorage.getItem(DEAL_STORAGE_KEY)) || [];
    }

    static saveDeals(deals) {
        localStorage.setItem(DEAL_STORAGE_KEY, JSON.stringify(deals));
    }

    static addDeal(dealData) {
        const deals = this.getDeals();
        const newDeal = {
            id: Date.now(),
            ...dealData,
            amount: parseFloat(dealData.amount),
            commissionRate: parseFloat(dealData.commissionRate) || 0.01,
            dateSubmitted: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        deals.push(newDeal);
        this.saveDeals(deals);
        return newDeal;
    }

    static calculateCommission(amount, rate) {
        return amount * rate;
    }

    static getSourcePerformance(sourceId) {
        const deals = this.getDeals().filter(d => d.sourceId == sourceId);
        const funded = deals.filter(d => d.status === 'Funded');
        
        const totalFundedVolume = funded.reduce((sum, d) => sum + d.amount, 0);
        const totalCommission = funded.reduce((sum, d) => sum + (d.amount * d.commissionRate), 0);
        const pipelineVolume = deals.filter(d => d.status === 'Underwriting' || d.status === 'Prequalified')
                                   .reduce((sum, d) => sum + d.amount, 0);

        return {
            dealCount: deals.length,
            fundedVolume: totalFundedVolume,
            pipelineVolume: pipelineVolume,
            commissionEarned: totalCommission,
            projectedCommission: deals.filter(d => d.status !== 'Funded' && d.status !== 'Declined')
                                      .reduce((sum, d) => sum + (d.amount * d.commissionRate), 0)
        };
    }

    static updateDealStatus(dealId, status) {
        const deals = this.getDeals();
        const index = deals.findIndex(d => d.id == dealId);
        if (index !== -1) {
            deals[index].status = status;
            deals[index].lastUpdated = new Date().toISOString().split('T')[0];
            this.saveDeals(deals);
        }
    }

    static getGlobalSummary() {
        const deals = this.getDeals();
        const funded = deals.filter(d => d.status === 'Funded');
        
        return {
            totalFunded: funded.reduce((sum, d) => sum + d.amount, 0),
            totalPipeline: deals.filter(d => d.status === 'Underwriting' || d.status === 'Prequalified')
                               .reduce((sum, d) => sum + d.amount, 0),
            totalCommissions: funded.reduce((sum, d) => sum + (d.amount * d.commissionRate), 0),
            activeDealsCount: deals.filter(d => d.status !== 'Declined').length
        };
    }

    static formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    }

    static getStatusUI(status) {
        return DEAL_STATUS_CONFIG[status] || DEAL_STATUS_CONFIG['Prequalified'];
    }
}

// Initialize Storage
DealStorage.init();

// Export for UI scripts
window.DealStorage = DealStorage;