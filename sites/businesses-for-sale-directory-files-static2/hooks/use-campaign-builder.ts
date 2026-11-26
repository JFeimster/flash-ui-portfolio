import { useState, useCallback, useMemo } from 'react';

export interface OutreachStep {
  id: number;
  type: 'physical_letter' | 'direct_email' | 'advisory_call';
  title: string;
  delayDays: number;
  subject?: string;
  template: string;
}

export interface CampaignState {
  name: string;
  industries: string[];
  geographies: string[];
  minEbitda: number;
  maxMultiple: number;
  steps: OutreachStep[];
  currentStep: 'criteria' | 'sequence' | 'review' | 'deployed';
}

const INDUSTRY_LEAD_MULTIPLIERS: Record<string, number> = {
  'SaaS': 18,
  'Home Services': 45,
  'Logistics': 22,
  'Manufacturing': 31,
};

const GEO_LEAD_MULTIPLIERS: Record<string, number> = {
  'Northeast': 1.4,
  'Southeast': 1.6,
  'Midwest': 1.2,
  'West Coast': 1.5,
  'Remote/Nationwide': 3.2,
};

const DEFAULT_TEMPLATES = {
  physical_letter: `[CONFIDENTIAL OUTBOUND TRANSMISSION]

To: [OWNER_NAME], Founder of [COMPANY_NAME]
From: AcquireMeta Origination Suite // Partner Platform

Dear [OWNER_LAST_NAME],

I am writing to you directly and with absolute confidentiality regarding your operations at [COMPANY_NAME] in [LOCATION]. 

Our syndicate, backed by Moonshine Capital, is actively deploying dedicated acquisition equity into the [INDUSTRY] sector. Unlike standard institutional private equity pools, our objective is to acquire, step in to operationally protect, and compound a single high-quality enterprise.

Your structural footprints match our core investment thesis:
- Clean operating margins
- High regional/niche reliability
- Clear historical workflow authority

We are positioned to structure a clean transaction with an SBA-preferred framework or structured cash-out configuration. This would ensure your legacy is preserved and your staff is retained.

If you are open to a brief, strictly confidential 15-minute phone call to explore what an eventual transition of your business could look like, please respond to my direct secure channel at [SENDER_EMAIL] or call [SENDER_PHONE].

Respectfully submitted,
[SENDER_NAME]
Managing Partner, AcquireMeta Syndicate`,

  direct_email: `Subject: SECURE: Direct Acquisition Inquiry - [COMPANY_NAME]

Dear [OWNER_LAST_NAME],

I followed up my previous physical letter with this direct transmission. I recognize that as the founder of [COMPANY_NAME], your operational bandwidth is highly guarded.

We have finalized our preliminary market mapping for the [INDUSTRY] landscape. Your company remains our primary target in the [LOCATION] territory for a proprietary, off-market transaction. 

Because we bypass traditional intermediated broker networks, we are able to structure more efficient, founder-friendly transitions:
1. Flexible standby seller notes with premium interest.
2. Structured equity roll-overs if you prefer to retain upside.
3. Rapid 45-day close via pre-vetted SBA 7(a) capital pipelines.

Do you have 10 minutes for an off-the-record, high-level introductory call next Tuesday or Thursday?

Secure Line: [SENDER_PHONE]
Origin Code: AM-OUTBOUND-[ID]

Regards,
[SENDER_NAME]
AcquireMeta Syndicate`,

  advisory_call: `[OUTBOUND ADVISORY PHONE SCRIPT - SECURE DIRECT]

1. THE HOOK:
"Hello [OWNER_NAME], this is [SENDER_NAME] calling directly from the AcquireMeta Syndicate. I sent a priority briefing package to your office in [LOCATION] last week regarding [COMPANY_NAME]—did that cross your desk?"

2. THE VALUE PROP:
"We are local operators looking to acquire a single legacy platform in the [INDUSTRY] space. We aren't brokers; we are looking to personally step in, fund the exit, and run the day-to-day operations. We have $25M in verified pool assets ready for deployment."

3. THE OBJECTION HANDLE (If 'Not for Sale'):
"Completely understand. Most of our best acquisitions started this way. We are looking to build a long-term relationship. If we could structure a deal that secures your legacy, pays out clean cash at closing, and has you transition out on your own terms in 12 months, would that be worth a confidential cup of coffee?"

4. THE CLOSE:
"Let's schedule 10 minutes next Tuesday at 9 AM for a secure, private Zoom. No commitment, just a high-level introduction."`
};

export function useCampaignBuilder() {
  const [campaign, setCampaign] = useState<CampaignState>({
    name: 'UNTITLED ORIGINATION PIPELINE',
    industries: [],
    geographies: [],
    minEbitda: 400000,
    maxMultiple: 4.0,
    currentStep: 'criteria',
    steps: [
      {
        id: 1,
        type: 'physical_letter',
        title: 'Step 1: High-Impact Priority Letter',
        delayDays: 1,
        template: DEFAULT_TEMPLATES.physical_letter
      },
      {
        id: 2,
        type: 'direct_email',
        title: 'Step 2: Secure Email Follow-Up',
        delayDays: 7,
        subject: 'Confidential Inquiry // Re: [COMPANY_NAME] Asset Transition',
        template: DEFAULT_TEMPLATES.direct_email
      },
      {
        id: 3,
        type: 'advisory_call',
        title: 'Step 3: Direct Owner Advisory Call',
        delayDays: 12,
        template: DEFAULT_TEMPLATES.advisory_call
      }
    ]
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  // Dynamic calculations for terminal statistics
  const estimatedLeads = useMemo(() => {
    if (campaign.industries.length === 0 || campaign.geographies.length === 0) {
      return 0;
    }

    let base = 0;
    campaign.industries.forEach(ind => {
      base += INDUSTRY_LEAD_MULTIPLIERS[ind] || 15;
    });

    let geoMultiplier = 1;
    campaign.geographies.forEach(geo => {
      geoMultiplier = Math.max(geoMultiplier, GEO_LEAD_MULTIPLIERS[geo] || 1.0);
    });

    // Discount or scale based on EBITDA criteria limits
    const ebitdaScale = campaign.minEbitda > 750000 ? 0.4 : campaign.minEbitda > 400000 ? 0.75 : 1.0;
    
    return Math.round(base * geoMultiplier * ebitdaScale);
  }, [campaign.industries, campaign.geographies, campaign.minEbitda]);

  const estimatedMonthlyCost = useMemo(() => {
    // Letters cost $1.50 print/postage, emails are free, dials are simulated CRM costs
    const letterCount = campaign.steps.some(s => s.type === 'physical_letter') ? estimatedLeads : 0;
    const baseCost = (letterCount * 1.85) + 49; // $49/mo platform subscription fee
    return estimatedLeads > 0 ? Math.round(baseCost) : 0;
  }, [estimatedLeads, campaign.steps]);

  // Handle Basic Campaign Configuration Changes
  const updateCampaignField = useCallback(<K extends keyof CampaignState>(field: K, value: CampaignState[K]) => {
    setCampaign(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const toggleIndustry = useCallback((industry: string) => {
    setCampaign(prev => {
      const exists = prev.industries.includes(industry);
      const updated = exists 
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry];
      return { ...prev, industries: updated };
    });
  }, []);

  const toggleGeography = useCallback((geo: string) => {
    setCampaign(prev => {
      const exists = prev.geographies.includes(geo);
      const updated = exists 
        ? prev.geographies.filter(g => g !== geo)
        : [...prev.geographies, geo];
      return { ...prev, geographies: updated };
    });
  }, []);

  // Modify sequence steps
  const updateStepTemplate = useCallback((stepId: number, updatedTemplate: string, updatedSubject?: string) => {
    setCampaign(prev => {
      const updatedSteps = prev.steps.map(step => {
        if (step.id === stepId) {
          return { 
            ...step, 
            template: updatedTemplate,
            ...(updatedSubject !== undefined ? { subject: updatedSubject } : {})
          };
        }
        return step;
      });
      return { ...prev, steps: updatedSteps };
    });
  }, []);

  // AI Generation simulation helper
  const triggerAIGeneration = useCallback(async () => {
    if (campaign.industries.length === 0) return;
    setIsGenerating(true);

    // Simulate specialized API synthesis delay
    await new Promise(resolve => setTimeout(resolve, 1400));

    const primeIndustry = campaign.industries[0] || 'Niche Industry';
    const primeGeo = campaign.geographies[0] || 'Target Market';

    setCampaign(prev => {
      const updatedSteps = prev.steps.map(step => {
        let customized = step.template
          .replace(/\[INDUSTRY\]/g, primeIndustry.toUpperCase())
          .replace(/\[LOCATION\]/g, primeGeo.toUpperCase())
          .replace(/\[SENDER_NAME\]/g, 'AcquireMeta Authorized Searcher')
          .replace(/\[SENDER_PHONE\]/g, '+1 (800) 555-8311')
          .replace(/\[SENDER_EMAIL\]/g, 'secure.pipeline@acquiremeta.com');

        return {
          ...step,
          template: customized
        };
      });

      return {
        ...prev,
        steps: updatedSteps
      };
    });

    setIsGenerating(false);
  }, [campaign.industries, campaign.geographies, campaign.steps]);

  // Deployment action
  const deployCampaign = useCallback(async () => {
    setIsDeploying(true);
    // Simulate campaign compilation & webhook triggers to mail/SMTP servers
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeploying(false);
    setCampaign(prev => ({ ...prev, currentStep: 'deployed' }));
  }, []);

  const resetBuilder = useCallback(() => {
    setCampaign({
      name: 'UNTITLED ORIGINATION PIPELINE',
      industries: [],
      geographies: [],
      minEbitda: 400000,
      maxMultiple: 4.0,
      currentStep: 'criteria',
      steps: [
        {
          id: 1,
          type: 'physical_letter',
          title: 'Step 1: High-Impact Priority Letter',
          delayDays: 1,
          template: DEFAULT_TEMPLATES.physical_letter
        },
        {
          id: 2,
          type: 'direct_email',
          title: 'Step 2: Secure Email Follow-Up',
          delayDays: 7,
          subject: 'Confidential Inquiry // Re: [COMPANY_NAME] Asset Transition',
          template: DEFAULT_TEMPLATES.direct_email
        },
        {
          id: 3,
          type: 'advisory_call',
          title: 'Step 3: Direct Owner Advisory Call',
          delayDays: 12,
          template: DEFAULT_TEMPLATES.advisory_call
        }
      ]
    });
  }, []);

  return {
    campaign,
    estimatedLeads,
    estimatedMonthlyCost,
    isGenerating,
    isDeploying,
    updateCampaignField,
    toggleIndustry,
    toggleGeography,
    updateStepTemplate,
    triggerAIGeneration,
    deployCampaign,
    resetBuilder,
    setStep: (step: CampaignState['currentStep']) => updateCampaignField('currentStep', step)
  };
}