import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug, getGuides, getSite } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Toc } from "@/components/Toc";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const site = getSite();
  const g = getGuideBySlug(params.slug);
  if (!g) return buildPageMetadata(site, { title: "Guide not found", description: "This guide does not exist.", path: `/guides/${params.slug}` });

  return buildPageMetadata(site, {
    title: g.seoTitle ?? g.title,
    description: g.seoDescription ?? g.excerpt,
    path: `/guides/${g.slug}`
  });
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const site = getSite();
  const g = getGuideBySlug(params.slug);
  if (!g) notFound();

  const toc = g.sections.map((s) => ({ id: s.id, label: s.title }));

  return (
    <div className="brut-scanline">
      <Section eyebrow="Guide" title={g.title} lead={g.excerpt} ctas={[site.ctas.primary, site.ctas.secondary]}>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_320px]">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              {g.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
              <span className="ml-auto text-xs text-[var(--muted2)]">{g.readingTime}</span>
            </div>

            <article className="prose prose-invert max-w-none prose-a:text-[var(--lime)] prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 prose-strong:text-[var(--fg)] prose-headings:font-mono prose-headings:tracking-tight">
              {g.sections.map((s) => (
                <section key={s.id} id={s.id} className="mt-7">
                  <h2 className="text-lg font-semibold">{s.title}</h2>
                  {s.paragraphs.map((p, idx) => (
                    <p key={idx} className="mt-3 text-sm text-[var(--muted)] leading-7">
                      {p}
                    </p>
                  ))}
                  {s.bullets && s.bullets.length > 0 && (
                    <ul className="mt-3 list-disc pl-5 text-sm text-[var(--muted)] space-y-2">
                      {s.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={site.pillar.slug}
                className="focus-ring inline-flex items-center rounded-md bg-[var(--card)] px-4 py-2 font-semibold brut-border brut-shadow"
              >
                Back to pillar →
              </Link>
              <Link
                href="/programs"
                className="focus-ring inline-flex items-center rounded-md bg-[var(--fg)] px-4 py-2 text-black font-semibold brut-border brut-shadow"
              >
                Compare programs →
              </Link>
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <h3 className="text-base font-semibold">On this page</h3>
              <div className="mt-3">
                <Toc items={toc} />
              </div>
            </Card>

            <Card variant="loud">
              <h3 className="text-base font-semibold">Pick a lane</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Stop reading. Start submitting clean files.
              </p>
              <div className="mt-4 grid gap-2">
                <a
                  className="focus-ring inline-flex items-center justify-center rounded-md bg-[var(--lime)] px-4 py-2 text-black font-semibold brut-border brut-shadow"
                  href={site.ctas.primary.url}
                >
                  {site.ctas.primary.label} →
                </a>
                <a className="focus-ring inline-flex items-center justify-center rounded-md bg-[var(--card)] px-4 py-2 font-semibold brut-border brut-shadow" href={site.ctas.secondary.url}>
                  {site.ctas.secondary.label} →
                </a>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
