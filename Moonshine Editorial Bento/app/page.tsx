import { BentoHero } from "@/components/sections/bento-hero";
import { ServicesBento } from "@/components/sections/services-bento";
import { EditorialBlocks } from "@/components/sections/editorial-blocks";
import { HowItWorksBento } from "@/components/sections/how-it-works-bento";
import { PartnerOpportunity } from "@/components/sections/partner-opportunity";
import { ProofSection } from "@/components/sections/proof-section";
import { SectionHeading } from "@/components/section-heading";

export default function HomePage() {
  return (
    <div className="pt-6">
      <BentoHero />

      <div className="mt-20">
        <SectionHeading
          kicker="Services"
          title="Capital structures that match how you actually grow."
          subtitle="Pick the approach that fits your cash-flow reality—from revenue-based to asset-backed and credit-building pathways."
        />
        <ServicesBento />
      </div>

      <div className="mt-20">
        <SectionHeading
          kicker="Insights"
          title="Editorial research, operator-first."
          subtitle="A magazine-style view of the alternative financing landscape—written for founders who want options, not noise."
        />
        <EditorialBlocks />
      </div>

      <div className="mt-20">
        <SectionHeading
          kicker="Process"
          title="A modular path from signal to funding."
          subtitle="Clear steps, minimal friction, and transparent terms—designed to keep momentum."
        />
        <HowItWorksBento />
      </div>

      <div className="mt-20">
        <SectionHeading
          kicker="Partners"
          title="Build a revenue line by introducing better capital."
          subtitle="Join the Moonshine network and offer clients flexible financing while earning recurring partner income."
        />
        <PartnerOpportunity />
      </div>

      <div className="mt-20">
        <SectionHeading
          kicker="Proof"
          title="Trusted by operators who measure outcomes."
          subtitle="Testimonials, case studies, and signals from the teams building durable growth."
        />
        <ProofSection />
      </div>

      <div className="mt-24 cardSurfaceMuted p-8 md:p-12 grain">
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <p className="text-sm uppercase tracking-[0.18em] text-ink/70">Get started</p>
            <h2 className="mt-3 text-balance font-display text-3xl md:text-4xl">
              Explore funding options built for modern cash flow.
            </h2>
            <p className="mt-3 max-w-[60ch] text-ink/75">
              Apply in minutes. Get matched to structures that preserve ownership and align to revenue reality.
            </p>
          </div>
          <div className="md:col-span-5 md:flex md:justify-end">
            <a
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              href="/apply/"
            >
              Start Your Application
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
