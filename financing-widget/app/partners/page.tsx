import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { getSite } from "@/lib/site";

export const metadata: Metadata = { title: "Partners", description: "What partners embed, what they see, and how they earn." };

export default function PartnersPage() {
  const site = getSite();
  return (
    <Section eyebrow={<Badge variant="outline">PARTNER EXPERIENCE</Badge>} title="They embed. They track. They earn." subtitle="Simple dashboard + rev-share, while you keep the engine."
      actions={<div className="flex gap-3"><Button href="/apply" variant="primary">Apply to partner</Button><Button href="/docs" variant="secondary">Docs</Button></div>}
    >
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Partner dashboard (preview)" kicker="Conversions + earnings" bullets={[
          "Impressions → Quotes → Submitted → Approved → Funded",
          "Rev-share accrued + payout schedule",
          "Cohort + placement breakdown (optional)"
        ]} />
        <Card title="Onboarding" kicker="5-minute setup" bullets={[
          "Issue Partner ID + payout terms",
          "Copy/paste script tag",
          "Test events",
          "Go live"
        ]} />
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {site.proofPoints.map((p) => (<Card key={p.title} title={p.title} kicker={p.kicker} description={p.description} />))}
      </div>
    </Section>
  );
}
