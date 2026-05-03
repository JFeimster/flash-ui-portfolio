import type { Metadata } from "next";
import Link from "next/link";
import { getPrograms, getSite } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Filters } from "@/components/Filters";
import { Badge } from "@/components/Badge";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return buildPageMetadata(site, {
    title: "Affiliate program directory (business funding) — compare payouts & reality",
    description: "Compare business funding affiliate programs by commission type, best-for, minimum deal size, and a blunt reality check.",
    path: "/programs"
  });
}

export default function ProgramsPage() {
  const site = getSite();
  const programs = getPrograms();

  const categories = Array.from(new Set(programs.map((p) => p.category))).sort();

  return (
    <div className="brut-scanline">
      <Section
        eyebrow="Directory"
        title="Business funding affiliate programs — compared."
        lead="Search, filter, and compare. This isn’t a list of “best links.” It’s a map of tradeoffs."
        ctas={[site.ctas.primary, site.ctas.secondary]}
      >
        <Filters
          items={programs}
          categories={categories}
          placeholder="Search programs, payouts, categories…"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {programs.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{p.name}</h3>
                  <p className="mt-1 text-xs text-[var(--muted2)]">{p.category}</p>
                </div>
                <Badge tone={p.realityCheck.tone}>{p.realityCheck.label}</Badge>
              </div>

              <p className="mt-3 text-sm text-[var(--muted)]">{p.blurb}</p>

              <div className="mt-4 grid gap-2 text-xs text-[var(--muted2)]">
                <div className="flex items-center justify-between">
                  <span>Typical payout</span>
                  <span className="text-[var(--fg)]">{p.commissionSummary}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Best for</span>
                  <span className="text-[var(--fg)]">{p.bestFor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Min deal size</span>
                  <span className="text-[var(--fg)]">{formatCurrency(p.minDealSize)}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {p.tags.slice(0, 4).map((t) => (
                  <Badge key={t} subtle>{t}</Badge>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <Link href={site.pillar.slug} className="focus-ring text-sm underline decoration-[var(--lime)] decoration-2 underline-offset-4">
                  Read the pillar →
                </Link>
                <span className="text-xs text-[var(--muted2)]">Last updated: {p.updated}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
