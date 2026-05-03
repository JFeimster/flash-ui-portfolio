import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { getSite } from "@/lib/site";

export const metadata: Metadata = { title: "Apply", description: "Apply to embed the financing widget and earn revenue share." };

export default function ApplyPage() {
  const site = getSite();
  return (
    <Section eyebrow={<Badge>PARTNER APPLICATION</Badge>} title="Apply to become a partner." subtitle="Replace the placeholder form URL in data/site.json."
      actions={<div className="flex gap-3"><Button href={site.integrations.applyFormUrl} variant="primary">Open application form</Button><Button href="/docs" variant="secondary">Docs</Button></div>}
    >
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="What we need" kicker="Fast approval" bullets={["Offer type + AOV", "Checkout placement", "Monthly volume estimate", "Primary contact"]} />
        <Card title="What you get" kicker="Day-one assets" bullets={["Partner ID + rev-share tier", "Embed snippet", "Launch copy blocks", "Reporting access"]} />
        <Card title="Timeline" kicker="Operationally simple" bullets={["Day 0: approve", "Day 1: embed + test", "Day 2: go live", "Week 1: optimize"]} />
      </div>

      <div className="mt-10 rounded-xl2 border border-[rgba(244,241,233,0.18)] bg-[rgba(15,17,23,0.55)] shadow-brutal overflow-hidden">
        <div className="p-5 border-b border-[rgba(244,241,233,0.14)] flex items-center justify-between gap-3">
          <div>
            <div className="text-sm tracking-[0.2em] uppercase text-[rgba(244,241,233,0.72)]">Embedded application</div>
            <div className="mt-2 text-sm text-[rgba(244,241,233,0.72)]">If your provider blocks iframes, use the button above.</div>
          </div>
          <Button href="/thank-you" variant="ghost">Preview thank-you →</Button>
        </div>
        <div className="p-5">
          <iframe title="Partner application" src={site.integrations.applyFormEmbedUrl} className="w-full h-[900px] rounded-xl2 border border-[rgba(244,241,233,0.16)] bg-ink" />
        </div>
      </div>
    </Section>
  );
}
