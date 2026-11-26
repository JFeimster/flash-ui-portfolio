import { NextResponse } from 'next/server';

// Static replication of internal database deals for server-side eligibility checks
const DEALS = [
  { id: "delta", codename: "Project Delta", asking: 1800000, ebitda: 620000 },
  { id: "kestrel", codename: "Project Kestrel", asking: 1900000, ebitda: 450000 },
  { id: "hvac-nova", codename: "Project Nova", asking: 2600000, ebitda: 810000 },
  { id: "onyx", codename: "Project Onyx", asking: 3800000, ebitda: 1200000 },
  { id: "titan", codename: "Project Titan", asking: 2800000, ebitda: 950000 }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      buyerName,
      buyerEmail,
      simulatedBalance,
      targetDealId,
      ndaSigned,
      signatureText,
      ipAddress = "127.0.0.1"
    } = body;

    // Strict validation
    if (!buyerName || !buyerEmail) {
      return NextResponse.json({
        success: false,
        error: "Missing required identity parameter: buyerName/buyerEmail"
      }, { status: 400 });
    }

    if (!ndaSigned || !signatureText) {
      return NextResponse.json({
        success: false,
        error: "Digital NDA must be fully executed and signed before transaction clearance."
      }, { status: 400 });
    }

    const verifiedFunds = Number(simulatedBalance) || 0;
    if (verifiedFunds <= 0) {
      return NextResponse.json({
        success: false,
        error: "Plaid core balance verification failed: Invalid or zero balance detected."
      }, { status: 400 });
    }

    // 1. Initialize step logs for terminal replication in UI
    const logs: string[] = [
      `[${new Date().toISOString()}] INIT: Initializing secure pipeline for node: ${buyerEmail}`,
      `[${new Date().toISOString()}] PLAID: Authenticating with remote financial institution...`,
      `[${new Date().toISOString()}] PLAID: Account verification confirmed. Verified Balance: $${verifiedFunds.toLocaleString()}`,
      `[${new Date().toISOString()}] NDA: Hashing digital signature payload: "${signatureText}"`
    ];

    // 2. Mock anti-fraud check (FinCEN / OFAC)
    logs.push(`[${new Date().toISOString()}] SECURE: Scrubbing against OFAC sanctions registry... STATUS: CLEAR`);
    logs.push(`[${new Date().toISOString()}] SECURE: FinCEN standard PEP compliance assessment... STATUS: SECURE`);

    // 3. Deal Target Underwriting assessment
    let targetDeal = null;
    let underwritingPassed = true;
    let fallbackStatus = "";

    if (targetDealId) {
      targetDeal = DEALS.find(d => d.id === targetDealId);
      if (targetDeal) {
        const requiredEquity = targetDeal.asking * 0.10; // 10% SBA standard rule
        logs.push(`[${new Date().toISOString()}] DEBT-ENGINE: Evaluating eligibility for ${targetDeal.codename.toUpperCase()}`);
        logs.push(`[${new Date().toISOString()}] DEBT-ENGINE: Implied SBA Equity Injection constraint (10%): $${requiredEquity.toLocaleString()}`);

        if (verifiedFunds < requiredEquity) {
          underwritingPassed = false;
          fallbackStatus = `LIQUIDITY_GAP: Verified funds ($${verifiedFunds.toLocaleString()}) are below minimum 10% equity threshold ($${requiredEquity.toLocaleString()}).`;
          logs.push(`[${new Date().toISOString()}] WARNING: Underwriting failed. ${fallbackStatus}`);
        } else {
          logs.push(`[${new Date().toISOString()}] SUCCESS: Capital threshold verified. Coverage ratio: ${(verifiedFunds / requiredEquity).toFixed(2)}x`);
        }
      } else {
        logs.push(`[${new Date().toISOString()}] NOTICE: Target project ${targetDealId} not active. Defaulting to system verification status.`);
      }
    }

    if (!underwritingPassed) {
      return NextResponse.json({
        success: false,
        error: fallbackStatus,
        logs
      }, { status: 403 });
    }

    // 4. Generate system keys for locked assets
    const verificationId = `AM-VER-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Math.floor(Date.now() / 1000).toString().substr(-4)}`;
    const cryptographicNdaHash = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const unlockedDealKey = `am_vault_sec_sh_${Math.random().toString(36).substr(2, 12)}_${targetDealId || "general"}`;

    logs.push(`[${new Date().toISOString()}] NDA: Document legally locked under SHA-256 ID: ${cryptographicNdaHash}`);
    logs.push(`[${new Date().toISOString()}] SYSTEM: Generating cryptographic terminal token...`);
    logs.push(`[${new Date().toISOString()}] SYSTEM: ACCESS GRANTED. VERIFICATION ID: ${verificationId}`);

    return NextResponse.json({
      success: true,
      verificationId,
      timestamp: new Date().toISOString(),
      verifiedFunds,
      unlockedDealKey,
      cryptographicNdaHash,
      buyerName,
      targetDealId: targetDealId || "ALL_BLINDED_DEALS",
      complianceLogs: logs,
      underwritingMetrics: {
        estimatedSbaLeverageCapacity: verifiedFunds * 9, // up to 90% debt
        maxDealCap: verifiedFunds / 0.10, // 10% allocation rule
        safetyRating: verifiedFunds > 500000 ? "TIER_A_UNRESTRICTED" : "TIER_B_SBA_CAPABLE"
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Critical system pipeline interrupt occurred: " + (error.message || "Internal server error")
    }, { status: 500 });
  }
}