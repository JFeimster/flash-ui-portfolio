import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { getSite } from "@/lib/site";

export const metadata: Metadata = { title: "Login", description: "Static shell placeholder for partner dashboard login." };

export default function LoginPage() {
  const site = getSite();
  return (
    <Section eyebrow={<Badge variant="outline">APP SHELL</Badge>} title="Partner dashboard login (static shell)." subtitle="If/when you add a real dashboard, route this page to your app."
      actions={<div className="flex gap-3"><Button href="/partners" variant="secondary">Partners</Button><Button href={site.cta.primary.url} variant="primary">{site.cta.primary.label}</Button></div>}
    >
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="What this is" kicker="Marketing-safe" bullets={["Nav destination for Login", "Future link to real app", "Credibility signal"]} />
        <Card title="Next" kicker="Implementation path" bullets={["Build dashboard (any stack)", "SSO/magic links", "Route /login to app URL", "Keep docs here"]} />
      </div>
    </Section>
  );
}
