export type PayoutStatus = 'Pending' | 'Cleared' | 'Processing' | 'Scheduled';

export interface CommissionLedgerEntry {
    id: string;
    referralSourceId: number; // Links to Moonshine Referral Source ID
    referralSourceName: string;
    clientName: string;
    dealType: 'Working Capital' | 'Equipment Finance' | 'SBA' | 'Bridge Loan' | 'Line of Credit';
    dealAmount: number;
    commissionRate: number; // e.g., 0.01 for 1%
    totalCommission: number;
    dateClosed: string;
    datePaid?: string;
    status: PayoutStatus;
    invoiceNumber: string;
}

export interface EarningsSummary {
    totalRevenueGenerated: number;
    totalCommissionsPaid: number;
    pendingPayouts: number;
    activeReferralCount: number;
    topPerformingCategory: string;
    averageCommissionRate: number;
}

export interface PayoutBatch {
    id: string;
    payoutDate: string;
    totalAmount: number;
    sourceCount: number;
    status: 'Completed' | 'Initiated';
    transactionRef: string;
}

export const CommissionCalculations = {
    calculateCommission: (amount: number, rate: number): number => {
        return amount * rate;
    },
    
    getNetworkHealthScore: (entries: CommissionLedgerEntry[]): number => {
        if (entries.length === 0) return 0;
        const totalDeals = entries.length;
        const clearedDeals = entries.filter(e => e.status === 'Cleared').length;
        return Math.round((clearedDeals / totalDeals) * 100);
    }
};