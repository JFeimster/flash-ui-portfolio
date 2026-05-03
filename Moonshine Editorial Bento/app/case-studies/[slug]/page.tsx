import caseStudies from "@/data/caseStudies.json";
import site from "@/data/site.json";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

type Params = { slug: string };

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const cs = caseStudies.find((x) => x.slug === params.slug);
  if (!cs) return {};
  const url = `${site.url}/case-studies/${cs.slug}/`;
  return {
    title: cs.title,
    description: cs.summary,
    alternates: { canonical: url },
    openGraph: {
      title: cs.title,
      description: cs.summary,
      url,
      type: "article",
      siteName: site.name,
      images: [{ url: "/og/og.svg", width: 1200, height: 630, alt: `${site.name} cover` }]
    }
  };
}

export default function CaseStudyPage({ params }: { params: Params }) {
  const cs = caseStudies.find((x) => x.slug === params.slug);
  if (!cs) notFound();

  return (
    <div className="pt-10">
      <div className="cardSurfaceMuted p-8 md:p-12 grain">
        <p className="text-xs uppercase tracking-[0.18em] text-ink/60">{cs.industry}</p>
        <h1 className="mt-3 text-balance font-display text-4xl md:text-5xl">{cs.title}</h1>
        <p className="mt-4 max-w-[72ch] text-ink/75">{cs.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {cs.highlights.map((h) => (
            <span key={h} className="rounded-full bg-white/60 px-3 py-1 text-xs text-ink/70 hairline">
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-2 md:grid-cols-12">
        <Card className="md:col-span-7">
          <h2 className="font-display text-2xl">The structure</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink/75">
            {cs.structure.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-accent" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="md:col-span-5 cardSurfaceMuted grain">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Outcome</p>
          <div className="mt-3 space-y-3">
            {cs.outcomes.map((o) => (
              <div key={o.label} className="rounded-xl bg-white/60 p-4 hairline">
                <p className="text-sm font-semibold">{o.label}</p>
                <p className="mt-1 text-sm text-ink/75">{o.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="md:col-span-12">
          <h2 className="font-display text-2xl">What changed</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {cs.narrative.map((p) => (
              <div key={p.title} className="rounded-xl bg-fog p-4 hairline">
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="mt-2 text-sm text-ink/75">{p.body}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="md:col-span-12 cardSurfaceMuted grain">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Next step</p>
              <h3 className="mt-2 font-display text-2xl">See your best-fit option.</h3>
              <p className="mt-1 text-sm text-ink/75">A short application unlocks a recommended structure and timeline.</p>
            </div>
            <a
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              href="/apply/"
            >
              Start Your Application
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
