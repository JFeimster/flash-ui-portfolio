import { NextResponse } from 'next/server';

const UNBLINDED_DEALS: Record<string, {
  legalName: string;
  exactLocation: string;
  primaryContact: string;
  contactEmail: string;
  vaultCode: string;
  documents: string[];
}> = {
  delta: {
    legalName: "Apex Logistics Partners LLC",
    exactLocation: "Columbus, OH, USA",
    primaryContact: "Marcus Vance (Managing Partner)",
    contactEmail: "mvance@apex-logistics-partners.com",
    vaultCode: "SECURE-SH-883-DELTA",
    documents: ["CIM_Project_Delta_v4_FINAL.pdf", "Three_Year_Tax_Transcripts.zip"]
  },
  kestrel: {
    legalName: "CloudScale Asset Systems Inc.",
    exactLocation: "Seattle, WA, USA (Fully Remote Corp)",
    primaryContact: "Sarah Koenig (Founder & CEO)",
    contactEmail: "s.koenig@cloudscale-assets.io",
    vaultCode: "SECURE-SH-204-KESTREL",
    documents: ["Kestrel_Financial_Model_Q4.xlsx", "Technology_Infrastructure_Overview.pdf"]
  },
  "hvac-nova": {
    legalName: "Nova Climate Solutions & Mechanical LLC",
    exactLocation: "Franconia, VA, USA",
    primaryContact: "Robert 'Bob' Miller (President)",
    contactEmail: "bob@novaclimateservice.com",
    vaultCode: "SECURE-SH-992-NOVA",
    documents: ["Nova_HVAC_CIM_Blinded.pdf", "Equipment_Schedule_2025.xlsx"]
  },
  onyx: {
    legalName: "Onyx Precision Components & Aerospace Corp",
    exactLocation: "Marietta, GA, USA",
    primaryContact: "Dr. Arthur Pendelton (Chief of Operations)",
    contactEmail: "a.pendelton@onyx-precision.com",
    vaultCode: "SECURE-SH-102-ONYX",
    documents: ["Onyx_Precision_Phase_1_ESA.pdf", "Defense_Contract_Frameworks_Redacted.pdf"]
  },
  titan: {
    legalName: "Titan Freightways Corp",
    exactLocation: "Elk Grove Village, IL, USA",
    primaryContact: "Jameson Diaz (Chief Logistics Officer)",
    contactEmail: "jdiaz@titanfreightways.com",
    vaultCode: "SECURE-SH-505-TITAN",
    documents: ["Titan_Fleet_Depreciation_Matrix.xlsx", "Contract_Overview_Top_10_Customers.pdf"]
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      dealId, 
      fullName, 
      email, 
      signatureConsent, 
      ipAddress, 
      verifiedPlaidBalance 
    } = body;

    if (!dealId || !fullName || !email || !signatureConsent) {
      return NextResponse.json(
        { 
          success: false, 
          error: "CRITICAL COMPLIANCE FAILURE: Missing required NDA fields (FullName, Email, or Signature Consent)." 
        },
        { status: 400 }
      );
    }

    if (signatureConsent !== "I_AGREE" && signatureConsent !== true) {
      return NextResponse.json(
        { 
          success: false, 
          error: "CRITICAL COMPLIANCE FAILURE: Legal binding consent must be explicitly approved." 
        },
        { status: 400 }
      );
    }

    const minimumRequiredFunds = 150000; 
    const fundsInt = parseInt(verifiedPlaidBalance || "0", 10);

    if (fundsInt < minimumRequiredFunds) {
      return NextResponse.json(
        {
          success: false,
          error: `POF INSUFFICIENCY: Verified liquid equity via Plaid ($${fundsInt.toLocaleString()}) does not meet the $${minimumRequiredFunds.toLocaleString()} minimum requirement for standard SBA transaction equity.`
        },
        { status: 403 }
      );
    }

    const unblindedInfo = UNBLINDED_DEALS[dealId.toLowerCase()];
    if (!unblindedInfo) {
      return NextResponse.json(
        { 
          success: false, 
          error: "TARGET NOT FOUND: The requested transaction asset codename is no longer active in our current terminal route." 
        },
        { status: 404 }
      );
    }

    const timestamp = new Date().toISOString();
    const mockHashInput = `${dealId}-${email}-${timestamp}-${ipAddress || '127.0.0.1'}`;
    const generatedNdaHash = `NDA-SHA256-${Buffer.from(mockHashInput).toString('base64').substring(0, 32).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      message: "COMPLIANCE VERIFIED. DIGITAL NDA EXECUTED.",
      timestamp,
      ndaHash: generatedNdaHash,
      signatory: {
        fullName,
        email,
        ipAddress: ipAddress || "0.0.0.0 (Gateway Proxy)",
        verifiedBalance: fundsInt
      },
      unlockedPayload: {
        codename: `PROJECT ${dealId.toUpperCase()}`,
        legalName: unblindedInfo.legalName,
        exactLocation: unblindedInfo.exactLocation,
        primaryContact: unblindedInfo.primaryContact,
        contactEmail: unblindedInfo.contactEmail,
        vaultCode: unblindedInfo.vaultCode,
        documents: unblindedInfo.documents
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: "INTERNAL TERMINAL SERVER ERROR: " + error.message 
      },
      { status: 500 }
    );
  }
}