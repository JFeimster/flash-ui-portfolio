export interface OutreachHook {
  id: string;
  name: string;
  angle: string;
  subjectTemplate: string;
  bodySnippet: string;
}

export interface MicroNiche {
  id: string;
  name: string;
  naicsCodes: string[];
  sicCodes: string[];
  typicalMultipleRange: [number, number];
  typicalEbitdaMargin: [number, number]; // Percentages, e.g., [15, 25] for 15%-25%
  commonPainPoints: string[];
  outreachHooks: OutreachHook[];
}

export interface IndustryVertical {
  id: string;
  name: string;
  codeName: string; // Terminal taxonomy (e.g., SEC-DIGITAL-01)
  colorCode: string; // Hex matching global dashboard terminal theme
  microNiches: MicroNiche[];
}

export const INDUSTRY_VERTICALS: IndustryVertical[] = [
  {
    id: "saas-digital",
    name: "SaaS & Digital Infrastructure",
    codeName: "SEC-DIGITAL-01",
    colorCode: "#0EA5E9", // copper/blue
    microNiches: [
      {
        id: "vertical-saas",
        name: "Vertical-Specific ERP & Workflow Software",
        naicsCodes: ["511210", "541511"],
        sicCodes: ["7372"],
        typicalMultipleRange: [3.5, 5.5],
        typicalEbitdaMargin: [25, 45],
        commonPainPoints: [
          "Legacy infrastructure code-debt",
          "Single-point engineering reliance (key-man risk)",
          "Customer acquisition cost (CAC) scaling limits",
          "Founder burnout from multi-decade support cycles"
        ],
        outreachHooks: [
          {
            id: "legacy-preservation",
            name: "Legacy Safe-Keeper",
            angle: "Emphasize preserving the customer-first culture and structural integrity rather than stripping assets like traditional private equity.",
            subjectTemplate: "Strategic transition options for [Company] software ecosystem",
            bodySnippet: "We're not a leveraged buy-out firm. We are dedicated capital searchers looking to transition [Company]'s legacy codebase and protect your decade-long customer relationships under permanent management."
          },
          {
            id: "quick-underwrite",
            name: "SBA Fast-Track Execution",
            angle: "Positioning our acquisition system to bypass long, drawn-out capital calls with pre-secured capital lines.",
            subjectTemplate: "Direct Acquisition inquiry: [Company] (Strictly Confidential)",
            bodySnippet: "Our capital is structured specifically to minimize transition Friction. We are targeting legacy B2B micro-SaaS firms generating $400k-$1M in annual cash flow, allowing for rapid owner-liquidity inside 60-90 days."
          }
        ]
      },
      {
        id: "proptech-contech",
        name: "PropTech & Construction Management Systems",
        naicsCodes: ["518210", "541512"],
        sicCodes: ["7373", "7374"],
        typicalMultipleRange: [3.0, 4.8],
        typicalEbitdaMargin: [20, 35],
        commonPainPoints: [
          "High reliance on local localized real estate cyclical trends",
          "Enterprise contract sales friction",
          "Lack of marketing infrastructure/sales team"
        ],
        outreachHooks: [
          {
            id: "real-estate-angle",
            name: "Industry Consolidation Playbook",
            angle: "Positioning the searcher as someone backed by operational real estate capital.",
            subjectTemplate: "Expansion partnership regarding [Company] software solutions",
            bodySnippet: "Our capital network operates extensively in physical distribution and real estate. We see immediate integration opportunities to scale [Company]'s tools across our existing portfolio bases."
          }
        ]
      }
    ]
  },
  {
    id: "home-services",
    name: "Home Services & Specialty Infrastructure",
    codeName: "SEC-HOMESERV-02",
    colorCode: "#00FF66", // toxic green
    microNiches: [
      {
        id: "hvac-commercial",
        name: "Commercial & Industrial HVAC Systems",
        naicsCodes: ["238220"],
        sicCodes: ["1711"],
        typicalMultipleRange: [3.2, 4.5],
        typicalEbitdaMargin: [18, 26],
        commonPainPoints: [
          "Severe master-technician labor shortage",
          "Extreme summer/winter seasonal capacity strain",
          "Owner trapped in daily dispatch operations",
          "Strict state licensing transfer friction"
        ],
        outreachHooks: [
          {
            id: "owner-operator-relief",
            name: "The 'Tools-Down' Transition",
            angle: "Targeting owners who are tired of handling midnight crisis calls and want to transition to a pure advisory role.",
            subjectTemplate: "Confidential succession: Stepping back from day-to-day operations at [Company]",
            bodySnippet: "I am a local operator looking to take over the daily management of an established HVAC business. My goal is to let you step back, put down the dispatch phone, and fully monetize your years of physical building equity."
          },
          {
            id: "license-continuity",
            name: "Strategic Joint Venture / Retainer Phase",
            angle: "Addressing the legal headache of licensing transfers by keeping the owner on as an advisor.",
            subjectTemplate: "Securing the legacy of [Company]'s HVAC Operations",
            bodySnippet: "We understand that your operational license is the lifeblood of [Company]. Our transition model structures an advisory retainership to keep you involved at a high level while we absorb all capital and personnel management liability."
          }
        ]
      },
      {
        id: "plumbing-infrastructure",
        name: "Specialty Plumbing & Trenchless Sewer Utilities",
        naicsCodes: ["238220", "221310"],
        sicCodes: ["1711", "1623"],
        typicalMultipleRange: [2.8, 3.8],
        typicalEbitdaMargin: [15, 22],
        commonPainPoints: [
          "Heavy capital expenditure requirements (re-piping rigs/fleet)",
          "Highly variable project pipelines vs recurring maintenance contracts",
          "Worker compensation insurance escalation risks"
        ],
        outreachHooks: [
          {
            id: "reinvestment-capital",
            name: "Capex Co-investment Option",
            angle: "Approaching owners looking to hand off heavy fleet liability and capital reinvestment cycles.",
            subjectTemplate: "Capital partnership & fleet succession for [Company]",
            bodySnippet: "We specialize in acquiring infrastructure assets where legacy owners are looking to step away from constant heavy equipment reinvestment. We bring structured capital to modernise the fleet while retaining your core field crew."
          }
        ]
      }
    ]
  },
  {
    id: "logistics-transport",
    name: "Logistics & Fleet Distribution",
    codeName: "SEC-LOGISTICS-03",
    colorCode: "#F9F9F9", // bone white
    microNiches: [
      {
        id: "cold-chain",
        name: "Cold-Chain Logistics & Temperature Controlled Storage",
        naicsCodes: ["484230", "493120"],
        sicCodes: ["4213", "4222"],
        typicalMultipleRange: [3.5, 4.8],
        typicalEbitdaMargin: [12, 18],
        commonPainPoints: [
          "High utility and refrigeration backup vulnerability",
          "Strict FDA/FSMA food safety compliance costs",
          "Fuel surcharge volatility squeezing immediate margins",
          "Complex warehouse labor dispatch mechanics"
        ],
        outreachHooks: [
          {
            id: "compliance-safeguard",
            name: "Compliance Shield Transition",
            angle: "Mitigating fears of compliance auditing and rising operational insurance costs under new ownership.",
            subjectTemplate: "Operational transition plans: temperature-controlled supply chains",
            bodySnippet: "Our group specializes in complex shipping compliance. We recognize the operational excellence you have built at [Company] and want to integrate your distribution footprints into our standardized regulatory backend."
          }
        ]
      },
      {
        id: "last-mile-courier",
        name: "B2B Last-Mile & Contracted Parcel Routing",
        naicsCodes: ["492110", "484110"],
        sicCodes: ["4215", "4212"],
        typicalMultipleRange: [2.5, 3.5],
        typicalEbitdaMargin: [8, 14],
        commonPainPoints: [
          "Extreme client concentration (e.g., massive Amazon/FedEx route reliance)",
          "Driver recruiting pipelines and high turnover friction",
          "Rising commercial auto insurance liability rates"
        ],
        outreachHooks: [
          {
            id: "concentration-mitigation",
            name: "Concentration Valuation Arbitrage",
            angle: "Addressing the elephant in the room—heavy customer concentration—by offering pricing structures that insulate the owner's payout.",
            subjectTemplate: "Structured acquisition inquiry for [Company] routing networks",
            bodySnippet: "We know how to value contracted distribution routes. While traditional banks shy away from single-client concentration issues, we have the direct debt relationships required to underwrite your contract structures seamlessly."
          }
        ]
      }
    ]
  },
  {
    id: "precision-mfg",
    name: "Precision CNC & Advanced Manufacturing",
    codeName: "SEC-MANUFACTURING-04",
    colorCode: "#FF3333", // crimson
    microNiches: [
      {
        id: "aerospace-components",
        name: "Defense & Aerospace Precision Machining",
        naicsCodes: ["332710", "336412"],
        sicCodes: ["3599", "3724"],
        typicalMultipleRange: [4.0, 5.8],
        typicalEbitdaMargin: [22, 32],
        commonPainPoints: [
          "Complex ITAR/AS9100 regulatory overhead",
          "Multi-million dollar machine tooling lease overhead",
          "Sourcing apprentice-level manual tooling machinists"
        ],
        outreachHooks: [
          {
            id: "itar-compliance",
            name: "Secure Sovereign Transition",
            angle: "Focusing on security clearance, ITAR standards, and ensuring defence capabilities are kept in-country.",
            subjectTemplate: "Confidential succession: ITAR and precision assets at [Company]",
            bodySnippet: "As certified domestic searchers, we are committed to maintaining defense supplier integrity. We aim to inject secondary engineering management to sustain [Company]'s critical precision supply pipelines for decades to come."
          }
        ]
      },
      {
        id: "medical-molding",
        name: "Medical Device Precision Injection Molding",
        naicsCodes: ["326199", "339112"],
        sicCodes: ["3089", "3841"],
        typicalMultipleRange: [4.2, 6.0],
        typicalEbitdaMargin: [25, 38],
        commonPainPoints: [
          "Extremely long validation cycle times with ISO 13485 compliance",
          "Founder-led technical sales bottlenecks",
          "Cleanroom HVAC and environmental upgrade costs"
        ],
        outreachHooks: [
          {
            id: "sales-engine-scale",
            name: "Unlocking ISO Cleanroom Capacity",
            angle: "Showing how to professionalize sales to utilize idle high-margin machine capacity.",
            subjectTemplate: "Strategic capacity utilization and exit avenues - [Company]",
            bodySnippet: "You have built world-class validation capabilities. We want to deploy professional outbound sales systems to double cleanroom utilization, freeing you from direct customer management while preserving your technical standard of excellence."
          }
        ]
      }
    ]
  },
  {
    id: "managed-services",
    name: "Managed IT & Cybersecurity",
    codeName: "SEC-MSP-05",
    colorCode: "#A855F7", // purple
    microNiches: [
      {
        id: "managed-it-services",
        name: "Regional B2B Managed Services Providers (MSPs)",
        naicsCodes: ["541513", "541519"],
        sicCodes: ["7379", "7371"],
        typicalMultipleRange: [4.5, 6.2],
        typicalEbitdaMargin: [18, 28],
        commonPainPoints: [
          "Rising cyber-liability insurance overhead",
          "Intense wage pressure for Tier-2/Tier-3 engineers",
          "Conversion friction from time-and-material accounts to fixed monthly contracts"
        ],
        outreachHooks: [
          {
            id: "security-stack-upgrade",
            name: "Modern Cybersecurity Integration",
            angle: "Highlighting how the searcher's specialized security resources protect the existing client base.",
            subjectTemplate: "Protecting [Company]'s legacy and recurring clients",
            bodySnippet: "With cyber threats growing, legacy MSP owners face increasing systemic risk. Our acquisition structure provides the resources to instantly upgrade your security operations center (SOC) while giving you a clean, low-stress financial exit."
          }
        ]
      }
    ]
  },
  {
    id: "healthcare-infrastructure",
    name: "Specialty Healthcare & Allied Services",
    codeName: "SEC-HEALTH-06",
    colorCode: "#EAB308", // amber/yellow
    microNiches: [
      {
        id: "allied-physical-therapy",
        name: "Multi-Location Outpatient Physical Therapy Clinics",
        naicsCodes: ["621340"],
        sicCodes: ["8049"],
        typicalMultipleRange: [3.5, 5.0],
        typicalEbitdaMargin: [14, 20],
        commonPainPoints: [
          "Escalating Medicare and insurance billing audit overhead",
          "High physical therapist credentialing attrition",
          "Dependence on localized orthopedist referral networks"
        ],
        outreachHooks: [
          {
            id: "billing-optimization-scale",
            name: "Billing & Compliance Relief",
            angle: "Taking on complex payer-mix, auditing, and collections operations to optimize clinical practice operations.",
            subjectTemplate: "Succession strategy and billing administration relief for [Company] clinics",
            bodySnippet: "Medicare red tape shouldn't detract from clinical care. We are seeking to buy clinical infrastructure and handle the administrative burden so your medical staff can stay focused entirely on patient outcomes."
          }
        ]
      }
    ]
  }
];

export const GEOGRAPHIC_REGIONS = [
  { id: "us-midwest", name: "US Midwest", states: ["IL", "IN", "MI", "OH", "WI", "MN", "IA", "MO"] },
  { id: "us-southeast", name: "US Southeast", states: ["GA", "FL", "NC", "SC", "VA", "TN", "AL", "MS"] },
  { id: "us-midatlantic", name: "US Mid-Atlantic", states: ["NY", "NJ", "PA", "MD", "DE", "DC"] },
  { id: "us-southwest", name: "US Southwest", states: ["TX", "AZ", "NM", "OK", "UT", "CO"] },
  { id: "us-westcoast", name: "US West Coast", states: ["CA", "OR", "WA", "NV", "ID"] },
  { id: "us-newengland", name: "US New England", states: ["MA", "CT", "RI", "NH", "VT", "ME"] }
];

export const LETTER_TEMPLATES_MARKUP = {
  directMail: {
    terminalLabel: "DIRECT-MAIL // LTR-01-V3",
    rawTemplate: `[Owner Name]
[Company Name]
[Physical Street Address]
[City, State, Zip]

Subject: Confidential Acquisition & Succession Planning Inquiry

Dear [Owner Name],

I am writing to you directly because of the stellar operational reputation you have built at [Company Name] within the [Micro-Niche Name] sector. 

Unlike traditional private equity groups or strategic competitors, I am an independent acquisition professional backed by private capital looking to step into a local operating business. I do not intend to break up your business or cut your staff. My core objective is to ensure absolute legacy preservation, business continuity, and to transition your daily operational burden to direct, qualified management.

We recognize that [Common Pain Point 1] and [Common Pain Point 2] present massive challenges in today's micro-economic climate. Our capital structure is optimized specifically for owner liquidity, and we are pre-qualified to utilize streamlined SBA 7(a) frameworks to secure transitions within 60-90 days.

If you have considered stepping back from day-to-day operations or are planning your long-term estate succession, I would appreciate the opportunity to have a highly confidential, introductory discussion. 

I can be reached directly at [Searcher Phone Number] or via email at [Searcher Email]. I am happy to sign a standard mutual Non-Disclosure Agreement (NDA) prior to any details being shared.

Thank you for your time, your dedication to the industry, and your contribution to local commercial infrastructure.

Sincerely,

[Searcher Name]
Principal, [Searcher Entity Name]
[Searcher Contact Info/Secure Portal]`
  },
  outboundEmail: {
    terminalLabel: "SECURE-SMTP // EMAIL-INIT-01",
    rawTemplate: `Subject: Strategic transition options for [Company Name] - [Micro-Niche Name]

Dear [Owner Name],

I hope this confidential note finds you well. 

I've been tracking active developments in the [Geographical Region] [Micro-Niche Name] ecosystem, and [Company Name] stands out as a highly specialized leader in the region.

I am an independent acquisition principal looking to directly buy and operate an established business in your industry. I am not a broker; I have direct access to transaction equity and am looking to take on full, day-to-day management of a business whose owner is looking to transition out.

Specifically, our model addresses common succession roadblocks like [Common Pain Point 1] or navigating complex transition mechanics. We structures acquisitions to:
1. Retain and protect your existing workforce.
2. Structure flexible consulting/advisory hand-offs so your legacy remains intact.
3. Complete due diligence rapidly without public listing exposure.

Would you be open to a brief, confidential 10-minute phone call next Tuesday at 2:00 PM EST to discuss potential options? We can execute a formal NDA beforehand if you prefer.

Best regards,

[Searcher Name]
[Searcher Entity Name]
[Searcher Phone Number]
[Searcher Secure Portal URL]`
  }
};