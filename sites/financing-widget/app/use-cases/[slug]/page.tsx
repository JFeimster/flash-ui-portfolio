import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import useCases from "@/data/useCases.json";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return useCases.map((u) => ({ slug: u.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const u = useCases.find((x) => x.slug === params.slug);
  if (!u) return {};
  return { title: u.title, description: u.summary, alternates: { canonical: `/use-cases/${u.slug}` } };
}

export default function UseCasePage({ params }: { params: Params }) {
  const u = useCases.find((x) => x.slug === params.slug);
  if (!u) return notFound();

  return (
    <Section eyebrow={<Badge>{u.segment.toUpperCase()}</Badge>} title={u.title} subtitle={u.summary}>
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Best placement" kicker="Where to embed" description={u.placement} />
        <Card title="Offer strategy" kicker="What to quote" description={u.offerStrategy} />
        <Card title="Partner KPI" kicker="What they track" description={u.kpi} />
      </div>
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Implementation notes" kicker="Friction killers" bullets={u.bullets} />
        <Card title="Dashboard tiles" kicker="Proof of ROI" bullets={u.dashboardTiles} />
      </div>
    </Section>
  );
}
