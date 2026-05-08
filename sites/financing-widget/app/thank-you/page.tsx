import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { getSite } from "@/lib/site";

export const metadata: Metadata = { title: "Thank You", description: "Application received." };

export default function ThankYouPage() {
  const site = getSite();
  return (
    <Section eyebrow={<Badge variant="outline">SUBMITTED</Badge>} title="Application received." subtitle="We’ll respond with your Partner ID, tier, and embed guide."
      actions={<div className="flex gap-3"><Button href="/docs/widget" variant="primary">Read embed guide</Button><Button href={site.cta.primary.url} variant="secondary">{site.cta.primary.label}</Button></div>}
    >
      <div className="mt-10 rounded-xl2 border border-[rgba(244,241,233,0.18)] bg-[rgba(15,17,23,0.55)] shadow-brutal p-5">
        <div className="text-sm tracking-[0.2em] uppercase text-[rgba(244,241,233,0.72)]">Next steps</div>
        <ol className="mt-4 space-y-2 text-[rgba(244,241,233,0.78)]">
          <li>1) Confirm fit + disclosures</li>
          <li>2) Issue Partner ID + terms</li>
          <li>3) Embed + test events</li>
          <li>4) Launch + optimize</li>
        </ol>
      </div>
    </Section>
  );
}
