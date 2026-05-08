import type { Metadata } from "next";
import Link from "next/link";
import { getGuides, getSite } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return buildPageMetadata(site, {
    title: "Guides — business funding affiliate & broker playbooks",
    description: "Practical, blunt guides for business loan affiliates and brokers: commissions, qualification, scripts, and process.",
    path: "/guides"
  });
}

export default function GuidesIndexPage() {
  const site = getSite();
  const guides = getGuides();

  return (
    <div className="brut-scanline">
      <Section
        eyebrow="Guides"
        title="Articles you can actually use."
        lead="Short, sharp, operational. These are designed to be forwarded to prospects and partners."
        ctas={[site.ctas.primary, site.ctas.secondary]}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((g) => (
            <Card key={g.slug} variant="flat">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold">{g.title}</h2>
                <span className="text-xs text-[var(--muted2)]">{g.readingTime}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{g.excerpt}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {g.tags.map((t) => (
                  <Badge key={t} subtle>{t}</Badge>
                ))}
              </div>
              <div className="mt-5">
                <Link
                  href={`/guides/${g.slug}`}
                  className="focus-ring inline-flex items-center rounded-md bg-[var(--card)] px-3 py-2 text-sm brut-border brut-shadow"
                >
                  Read →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
