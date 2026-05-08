import siteJson from "@/data/site.json";
import programsJson from "@/data/programs.json";
import guidesJson from "@/data/guides.json";
import faqsJson from "@/data/faqs.json";
import testimonialsJson from "@/data/testimonials.json";

import type { FAQItem, Guide, Program, SiteConfig, Testimonial } from "@/lib/types";

export function getSite(): SiteConfig {
  return siteJson as SiteConfig;
}

export function getPrograms(): Program[] {
  return programsJson as Program[];
}

export function getGuides(): Guide[] {
  return guidesJson as Guide[];
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return getGuides().find((g) => g.slug === slug);
}

export function getFAQs(): FAQItem[] {
  return faqsJson as FAQItem[];
}

export function getTestimonials(): Testimonial[] {
  return testimonialsJson as Testimonial[];
}
