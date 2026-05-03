import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CodeBlock } from "@/components/CodeBlock";
import { Section } from "@/components/Section";
import docs from "@/data/docs.json";
import { getSite } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return docs.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const d = docs.find((x) => x.slug === params.slug);
  if (!d) return {};
  return { title: d.title, description: d.summary, alternates: { canonical: `/docs/${d.slug}` } };
}

export default function DocPage({ params }: { params: Params }) {
  const site = getSite();
  const d = docs.find((x) => x.slug === params.slug);
  if (!d) return notFound();

  return (
    <Section eyebrow={<Badge variant="outline">{d.category}</Badge>} title={d.title} subtitle={d.summary}
      actions={<div className="flex gap-3"><Button href={site.cta.primary.url} variant="primary">{site.cta.primary.label}</Button><Button href="/docs" variant="secondary">Back to docs</Button></div>}
    >
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {d.callouts.map((c) => (<Card key={c.title} title={c.title} kicker={c.kicker} description={c.body} />))}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4">
        {d.sections.map((s) => (
          <div key={s.heading} className="rounded-xl2 border border-[rgba(244,241,233,0.16)] bg-[rgba(15,17,23,0.55)] shadow-brutal p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl md:text-2xl font-semibold tracking-[-0.03em]">{s.heading}</h2>
              {s.tag ? <Badge variant="outline">{s.tag}</Badge> : null}
            </div>
            <p className="mt-3 text-[rgba(244,241,233,0.78)] leading-relaxed">{s.body}</p>
            {s.code ? <div className="mt-4"><CodeBlock code={s.code} /></div> : null}
            {s.bullets?.length ? (
              <ul className="mt-4 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-[rgba(244,241,233,0.78)]">
                    <span className="mt-[6px] h-2 w-2 rounded-full bg-gold shadow-glow" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}
