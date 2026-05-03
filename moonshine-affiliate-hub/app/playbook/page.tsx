import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { CTACluster } from "@/components/CTACluster";
import { Badge } from "@/components/Badge";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return buildPageMetadata(site, {
    title: "Business loan affiliate playbook — scripts, process, weekly plan",
    description: "A practical affiliate playbook: niche selection, lists, scripts, qualification, doc collection, follow-up, and submission quality.",
    path: "/playbook"
  });
}

export default function PlaybookPage() {
  const site = getSite();

  return (
    <div className="brut-scanline">
      <Section
        eyebrow="Playbook"
        title="The business loan affiliate playbook (no fluff)."
        lead="This is the simple system: pick a niche, build a list, run a qualification script, collect docs early, submit clean files, follow up until the owner says yes or no."
        ctas={[site.ctas.primary, site.ctas.secondary, site.ctas.tertiary]}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card variant="loud">
            <h2 className="text-base font-semibold">Rules</h2>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li>Don’t pitch “funding.” Pitch outcomes.</li>
              <li>Don’t chase. Qualify.</li>
              <li>Docs early. Always.</li>
              <li>Write everything down: pipeline is your job.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>quality &gt; volume</Badge>
              <Badge>docs early</Badge>
              <Badge>follow-up</Badge>
              <Badge>clean submissions</Badge>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold">Weekly plan (copy/paste)</h2>
            <ol className="mt-3 space-y-2 text-sm text-[var(--muted)] list-decimal pl-5">
              <li><span className="text-[var(--fg)] font-semibold">Mon:</span> 25 new outreach attempts + 10 follow-ups</li>
              <li><span className="text-[var(--fg)] font-semibold">Tue:</span> 5 qualification calls</li>
              <li><span className="text-[var(--fg)] font-semibold">Wed:</span> collect docs + package files</li>
              <li><span className="text-[var(--fg)] font-semibold">Thu:</span> submit clean files + update pipeline</li>
              <li><span className="text-[var(--fg)] font-semibold">Fri:</span> follow-up + referrals + re-activation</li>
            </ol>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="text-base font-semibold">Qualification script (core)</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li>How long in business?</li>
              <li>Monthly revenue range?</li>
              <li>What do you need funding for?</li>
              <li>Any recent NSF / negative days?</li>
              <li>Credit reality (owner + biz)?</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-base font-semibold">Docs to request (minimum)</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li>3–6 months bank statements</li>
              <li>ID + voided check</li>
              <li>Application details (simple)</li>
              <li>Debt schedule (if relevant)</li>
            </ul>
          </Card>

          <Card variant="flat">
            <h3 className="text-base font-semibold">The “no ghosting” follow-up</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              “Quick check: are we still solving this this month, or should I close your file and circle back next quarter?”
            </p>
            <p className="mt-3 text-xs text-[var(--muted2)]">
              Works because it’s respectful and forces a yes/no.
            </p>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <h2 className="text-base font-semibold">Choose your lane</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Pick one CTA and ship today. You can optimize later.</p>
            <div className="mt-4">
              <CTACluster ctas={[site.ctas.primary, site.ctas.secondary, site.ctas.tertiary]} />
            </div>
            <div className="mt-4">
              <Link href={site.pillar.slug} className="focus-ring inline-flex text-sm underline decoration-[var(--lime)] decoration-2 underline-offset-4">
                Back to pillar guide →
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
