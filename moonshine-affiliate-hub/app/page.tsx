import Link from "next/link";
import { getGuides, getPrograms, getSite } from "@/lib/data";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { CTACluster } from "@/components/CTACluster";
import { Badge } from "@/components/Badge";
import { Stat } from "@/components/Stat";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-static";

export default function HomePage() {
  const site = getSite();
  const guides = getGuides().slice(0, 4);
  const programs = getPrograms().slice(0, 6);

  return (
    <div className="brut-scanline">
      <Section
        eyebrow="Business Loan Affiliate / Partner Hub"
        title="Recruit affiliates who can sell—and filter out the ones who can’t."
        lead="This hub is a brutally honest guide to business loan affiliate programs, plus a clear path to the platform we actually trust to close deals."
        ctas={[
          site.ctas.primary,
          site.ctas.secondary,
          site.ctas.tertiary
        ]}
      >
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Stat label="What this is" value="A playbook + directory + proofs" />
          <Stat label="What this is not" value="A hypey side hustle page" />
          <Stat label="Outcome" value="Partners who submit fundable deals" />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card variant="loud">
            <h2 className="text-lg font-semibold">Start here</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Read the pillar guide first. It explains commissions, gotchas, “no license” realities,
              and what separates real broker ops from link-spammers.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href={site.pillar.slug} className="focus-ring inline-flex items-center rounded-md bg-[var(--lime)] px-4 py-2 text-black font-semibold brut-border brut-shadow">
                Read the pillar guide
              </Link>
              <span className="text-xs text-[var(--muted2)]">~12 min read · zero fluff</span>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">What partners get</h2>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li className="flex gap-2">
                <span className="mt-0.5 inline-block h-2 w-2 rounded-[2px] bg-[var(--magenta)]"></span>
                A real funnel for submissions (not “DM me” chaos)
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 inline-block h-2 w-2 rounded-[2px] bg-[var(--lime)]"></span>
                Clear commission mechanics + expectations
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 inline-block h-2 w-2 rounded-[2px] bg-[var(--warning)]"></span>
                A network that values deal quality over volume
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Directory" title="Programs people ask about (and what they don’t tell you)">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>commission structures</Badge>
          <Badge>approval reality</Badge>
          <Badge>compliance notes</Badge>
          <Badge>support quality</Badge>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
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
                  <span>Who it fits</span>
                  <span className="text-[var(--fg)]">{p.bestFor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Min deal size</span>
                  <span className="text-[var(--fg)]">{formatCurrency(p.minDealSize)}</span>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/programs" className="focus-ring inline-flex text-sm underline decoration-[var(--lime)] decoration-2 underline-offset-4">
                  Compare in directory →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Guides" title="Brutally honest articles you can send your prospects">
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {guides.map((g) => (
            <Card key={g.slug} variant="flat">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">{g.title}</h3>
                <span className="text-xs text-[var(--muted2)]">{g.readingTime}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{g.excerpt}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/guides/${g.slug}`}
                  className="focus-ring inline-flex items-center rounded-md bg-[var(--card)] px-3 py-2 text-sm brut-border brut-shadow"
                >
                  Read →
                </Link>
                <div className="flex flex-wrap gap-2">
                  {g.tags.slice(0, 3).map((t) => (
                    <Badge key={t} subtle>{t}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/guides" className="focus-ring inline-flex items-center rounded-md bg-[var(--fg)] px-4 py-2 text-black font-semibold brut-border brut-shadow">
            View all guides →
          </Link>
        </div>
      </Section>

      <Section eyebrow="Get in" title="If you want a side hustle, this won’t feel fun.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="text-base font-semibold">You bring</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li>Warm network or outbound skill</li>
              <li>Ability to qualify business owners</li>
              <li>Comfort saying “not fundable” fast</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-base font-semibold">We bring</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li>Platform + routing that closes</li>
              <li>Clear partner expectations</li>
              <li>Playbooks you can reuse</li>
            </ul>
          </Card>
          <Card variant="loud">
            <h3 className="text-base font-semibold">Pick your lane</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Join the platform, build an agency, or book a 1:1 plan to shortcut the mistakes.
            </p>
            <div className="mt-4">
              <CTACluster ctas={[site.ctas.primary, site.ctas.secondary, site.ctas.tertiary]} />
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
