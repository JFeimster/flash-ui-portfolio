import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Section } from "@/components/Section";
import { getSite } from "@/lib/site";

export const metadata: Metadata = { title: "Legal", description: "Basic legal and compliance placeholders." };

export default function LegalPage() {
  const site = getSite();
  return (
    <Section eyebrow={<Badge variant="outline">LEGAL</Badge>} title="Legal & compliance placeholders." subtitle="Replace with counsel-approved language.">
      <div className="mt-10 rounded-xl2 border border-[rgba(244,241,233,0.16)] bg-[rgba(15,17,23,0.55)] shadow-brutal p-5 space-y-6">
        <div>
          <div className="text-sm tracking-[0.2em] uppercase text-[rgba(244,241,233,0.72)]">Disclosures</div>
          <p className="mt-3 text-[rgba(244,241,233,0.78)] leading-relaxed">
            Financing offers are subject to eligibility and underwriting. Partners embed the widget and may receive revenue share.
          </p>
        </div>
        <div>
          <div className="text-sm tracking-[0.2em] uppercase text-[rgba(244,241,233,0.72)]">Lead handling</div>
          <p className="mt-3 text-[rgba(244,241,233,0.78)] leading-relaxed">
            Partner-submitted client information is processed by {site.brand.wordmark} per your privacy policy and partner agreement.
          </p>
        </div>
      </div>
    </Section>
  );
}
