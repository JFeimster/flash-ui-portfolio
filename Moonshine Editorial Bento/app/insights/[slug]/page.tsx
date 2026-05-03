import posts from "@/data/posts.json";
import site from "@/data/site.json";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatDate } from "@/lib/format";
import { Prose } from "@/components/ui/prose";
import { Card } from "@/components/ui/card";

type Params = { slug: string };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const p = posts.find((x) => x.slug === params.slug);
  if (!p) return {};
  const url = `${site.url}/insights/${p.slug}/`;
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: p.title,
      description: p.excerpt,
      url,
      type: "article",
      siteName: site.name,
      images: [{ url: "/og/og.svg", width: 1200, height: 630, alt: `${site.name} cover` }]
    }
  };
}

export default function InsightArticlePage({ params }: { params: Params }) {
  const p = posts.find((x) => x.slug === params.slug);
  if (!p) notFound();

  return (
    <div className="pt-10">
      <div className="cardSurfaceMuted p-8 md:p-12 grain">
        <p className="text-xs uppercase tracking-[0.18em] text-ink/60">{formatDate(p.date)}</p>
        <h1 className="mt-3 text-balance font-display text-4xl md:text-5xl">{p.title}</h1>
        <p className="mt-4 max-w-[70ch] text-ink/75">{p.excerpt}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-ink/60">
          <span className="rounded-full bg-white/60 px-3 py-1 hairline">{p.readingTime}</span>
          <span className="rounded-full bg-white/60 px-3 py-1 hairline">{p.category}</span>
          <span className="rounded-full bg-white/60 px-3 py-1 hairline">Moonshine Editorial</span>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <Prose content={p.content} />
        </div>
        <div className="md:col-span-4">
          <div className="sticky top-6 space-y-2">
            <Card>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Next step</p>
              <h3 className="mt-2 font-display text-2xl">Explore your options.</h3>
              <p className="mt-2 text-sm text-ink/75">
                Apply in minutes—get a recommended structure and timeline based on revenue and goals.
              </p>
              <a
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
                href="/apply/"
              >
                Start Your Application
              </a>
            </Card>

            <Card className="cardSurfaceMuted">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Callout</p>
              <p className="mt-2 text-sm text-ink/80">
                “The best financing is the one you can explain in a sentence. If you can’t, keep looking.”
              </p>
              <p className="mt-3 text-xs text-ink/60">— Moonshine Investment Committee</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
