export type PartnerType = 'BRK' | 'REF' | 'AFF' | 'VND';

export interface CommissionTransaction {
    txId: string;
    partnerId: string;
    entityName: string;
    grossVolume: number;
    commissionRate: number;
    netPayout: number;
    taxWithholding: number;
    timestamp: string;
    status: 'PENDING' | 'LOCKED' | 'AUTHORIZED' | 'DISBURSED';
}

const PROTOCOL_RATES: Record<PartnerType, number> = {
    BRK: 0.055, // 5.5% Broker Base
    REF: 0.020, // 2.0% Referral Base
    AFF: 0.035, // 3.5% Affiliate Base
    VND: 0.015  // 1.5% Vendor Base
};

const TAX_WITHHOLDING_RATE = 0.15; // 15% Default Provision

/**
 * MOONSHINE CAPITAL - FINANCIAL ENGINE
 * Calculates settlement ledger entries based on partner provisioning protocols.
 */
export const calculateSettlement = (
    amount: number, 
    type: PartnerType
): Pick<CommissionTransaction, 'commissionRate' | 'netPayout' | 'taxWithholding'> => {
    const rate = PROTOCOL_RATES[type] || 0.01;
    const grossCommission = amount * rate;
    const taxWithholding = grossCommission * TAX_WITHHOLDING_RATE;
    const netPayout = grossCommission - taxWithholding;

    return {
        commissionRate: rate,
        taxWithholding: parseFloat(taxWithholding.toFixed(2)),
        netPayout: parseFloat(netPayout.toFixed(2))
    };
};

/**
 * Authorizes a disbursement action within the ledger.
 * Requires internal node validation simulation.
 */
export const authorizeDisbursement = (txId: string, authCode: string): boolean => {
    // Security Protocol: LND-88 Authorization Check
    const AUTH_PREFIX = "SEC-ALPHA-";
    if (!authCode.startsWith(AUTH_PREFIX)) {
        console.error(`[TERMINAL_ERROR] INVALID AUTHORIZATION ATTEMPT FOR TX: ${txId}`);
        return false;
    }
    
    console.log(`[LEDGER_SYSTEM] TRANSACTION ${txId} AUTHORIZED FOR DISBURSEMENT`);
    return true;
};

/**
 * Formats values for the Emerald-Green Terminal UI.
 */
export const formatTerminalCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);
};

/**
 * Generates a cryptographic-style transaction hash for the audit log.
 */
export const generateTxHash = (partnerId: string): string => {
    const salt = Math.random().toString(36).substring(7).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `TXH-${partnerId}-${salt}-${timestamp}`;
};

/**
 * Validates tax documentation status for high-value disbursements.
 */
export const checkComplianceStatus = (grossVolume: number, hasW9: boolean): boolean => {
    if (grossVolume > 10000 && !hasW9) {
        return false; // Compliance Lock
    }
    return true;
};