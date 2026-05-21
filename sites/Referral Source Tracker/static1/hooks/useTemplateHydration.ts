import { useCallback } from 'react';

export interface ReferralSource {
  name: string;
  company: string;
  category: string;
  location: string;
}

export interface OutreachTemplate {
  id: string;
  label: string;
  archetype: string;
  body: string;
}

const TEMPLATE_LIBRARY: OutreachTemplate[] = [
  {
    id: 'banker-intro',
    label: 'The Bank Manager Intro',
    archetype: 'Bank Manager',
    body: "Hi {{name}}, I've been seeing a few business owners in {{location}} who don't quite fit the traditional bank lending criteria. Since you're at {{company}}, I'd love to discuss how I can be a secondary resource for your 'turndowns'—ensuring they get funded while you maintain the primary banking relationship."
  },
  {
    id: 'cpa-value',
    label: 'The Accountant Value-Add',
    archetype: 'CPA/Accountant',
    body: "Hello {{name}}, I know {{company}} is focused on maximizing tax and cash flow efficiency for your clients. We've developed a capital strategy at Moonshine that allows businesses to scale without depleting cash reserves. I'd love to share how this has helped other firms in {{location}}."
  },
  {
    id: 'broker-close',
    label: 'The Broker Fast-Close',
    archetype: 'Business Broker',
    body: "Hi {{name}}, I saw your recent listing. At Moonshine Capital, we specialize in bridge and alternative financing that helps buyers close deals faster when SBA timelines are too long. I'd love to help you get more of your {{company}} deals across the finish line in {{location}}."
  },
  {
    id: 'equipment-dealer',
    label: 'The Inventory/Equipment Partner',
    archetype: 'Equipment Dealer',
    body: "Hi {{name}}, we are seeing high demand for equipment financing in {{location}} right now. If your customers at {{company}} are stalling on purchases due to capital constraints, let's chat. We can often get approvals in 24 hours to help you move inventory faster."
  },
  {
    id: 'general-checkin',
    label: 'The Relationship Builder',
    archetype: 'All',
    body: "Hi {{name}}, just wanted to send a quick note and stay on your radar. I recently saw a case study in the {{category}} space that reminded me of our conversation. Hope things are going well at {{company}} in {{location}}!"
  }
];

export const useTemplateHydration = () => {
  const hydrateTemplate = useCallback((template: string, source: Partial<ReferralSource>) => {
    const placeholders: Record<string, string> = {
      name: source.name || '[Partner Name]',
      company: source.company || '[Company Name]',
      location: source.location || '[Location]',
      category: source.category || '[Category]',
    };

    return Object.entries(placeholders).reduce((acc, [key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      return acc.replace(regex, value);
    }, template);
  }, []);

  const getTemplatesByArchetype = useCallback((archetype: string) => {
    return TEMPLATE_LIBRARY.filter(
      (t) => t.archetype === archetype || t.archetype === 'All'
    );
  }, []);

  return {
    library: TEMPLATE_LIBRARY,
    hydrateTemplate,
    getTemplatesByArchetype,
  };
};