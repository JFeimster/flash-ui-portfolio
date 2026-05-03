import { SectionHeading } from "@/components/section-heading";
import { PartnerOpportunity } from "@/components/sections/partner-opportunity";

export const metadata = {
  title: "Partners",
  description: "Join the Moonshine Capital partner network and earn recurring income by introducing better financing."
};

export default function PartnersPage() {
  return (
    <div className="pt-10">
      <SectionHeading
        kicker="Partners"
        title="A partner program with editorial clarity."
        subtitle="Transparent tiers, clear payouts, and tools your clients actually use."
      />
      <div className="mt-10">
        <PartnerOpportunity />
      </div>
    </div>
  );
}
