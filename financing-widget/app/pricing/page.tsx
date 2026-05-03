import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import pricing from "@/data/pricing.json";
import { getSite } from "@/lib/site";

export const metadata: Metadata = { title: "Pricing", description: "Revenue share tiers and implementation options for partners." };

export default function PricingPage() {
  const site = getSite();
  return (
    <Section eyebrow={<Badge>PRICING / REV-SHARE</Badge>} title="Partners win. You win harder." subtitle="Starting tiers. Adjust per partner and compliance needs."
      actions={<div className="flex gap-3"><Button href={site.cta.primary.url} variant="primary">{site.cta.primary.label}</Button><Button href="/apply" variant="secondary">Apply</Button></div>}
    >
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {pricing.tiers.map((t) => (
          <Card key={t.name} title={t.name} kicker={t.kicker} description={t.description} bullets={t.bullets} highlight={t.highlight}
            footer={<div className="text-sm text-[rgba(244,241,233,0.72)]">Suggested rev-share: <span className="text-bone font-semibold">{t.revShare}</span></div>}
          />
        ))}
      </div>
    </Section>
  );
}
