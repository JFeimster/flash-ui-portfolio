import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { Stat } from "@/components/Stat";
import { getSite } from "@/lib/site";

export default function HomePage() {
  const site = getSite();
  return (
    <>
      <Section
        className="noise"
        eyebrow={<Badge>WHITE-LABEL EMBEDDED FINANCE</Badge>}
        title={<>Embed financing at checkout.<span className="block text-[rgba(244,241,233,0.72)]">Control the marketplace. Partners earn rev-share.</span></>}
        subtitle="A 5-minute JS snippet for coaches, SaaS platforms, brokers, and equipment sellers."
        actions={<div className="flex flex-col sm:flex-row gap-3"><Button href={site.cta.primary.url} variant="primary">{site.cta.primary.label}</Button><Button href="/docs/widget" variant="secondary">See the 5-minute embed</Button></div>}
      >
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat kpi="5 min" label="Implementation time" note="Drop-in snippet + config JSON" />
          <Stat kpi="Rev-share" label="Partner incentives" note="You set terms per partner tier" />
          <Stat kpi="First-party leads" label="Client → your pipeline" note="Partner clients become your leads" />
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="How it works" kicker="Stripe-style embedded finance model" bullets={[
            "Partner embeds your widget at checkout.",
            "Widget quotes financing and captures intent.",
            "Partner dashboard shows conversions + earnings.",
            "You control underwriting and marketplace rules."
          ]} />
          <Card title="Target partners" kicker="High-consideration purchases" bullets={[
            "High-ticket coaches ($5k+)",
            "Shopify apps / SaaS platforms",
            "Business brokers (acquisition financing)",
            "Equipment sellers"
          ]} />
        </div>
      </Section>
    </>
  );
}
