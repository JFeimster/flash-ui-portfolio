export type CTA = {
  label: string;
  url: string;
};

export type SiteNavItem = {
  label: string;
  href: string;
};

export type SiteConfig = {
  brandName: string;
  wordmark: string;
  tagline: string;
  locale?: string;
  pillar: {
    title: string;
    slug: string;
  };
  nav: SiteNavItem[];
  footerBlurb: string;
  contactEmail: string;
  ctas: {
    primary: CTA;
    secondary: CTA;
    tertiary: CTA;
  };
  seo: {
    siteUrl: string;
    defaultTitle: string;
    defaultDescription: string;
    ogImagePath: string;
  };
  legal: {
    disclaimer: string;
  };
};

export type Program = {
  id: string;
  name: string;
  category: string;
  blurb: string;
  commissionSummary: string;
  bestFor: string;
  minDealSize: number;
  tags: string[];
  updated: string;
  realityCheck: {
    label: string;
    tone: "ok" | "warn" | "hot" | "neutral";
  };
};

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  readingTime: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  sections: Array<{
    id: string;
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
};

export type FAQItem = {
  id: string;
  q: string;
  a: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};
