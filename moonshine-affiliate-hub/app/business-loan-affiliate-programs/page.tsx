import Link from "next/link";
import { getFAQs, getPrograms, getSite, getTestimonials } from "@/lib/data";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { CTACluster } from "@/components/CTACluster";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ProCon } from "@/components/ProCon";
import { Toc } from "@/components/Toc";
import { formatCurrency } from "@/lib/format";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return buildPageMetadata(site, {
    title: "Business loan affiliate programs (brutally honest guide + best plays)",
    description:
      "A no-BS breakdown of business funding affiliate programs: commissions, real approval rates, compliance notes, and how to become a business loan broker without delusion.",
    path: "/business-loan-affiliate-programs"
  });
}

export default function PillarPage() {
  const site = getSite();
  const programs = getPrograms();
  const faqs = getFAQs();
  const testimonials = getTestimonials();

  const toc = [
    { id: "what-it-is", label: "What a business loan affiliate program really is" },
    { id: "commission", label: "How commissions actually work" },
    { id: "no-license", label: "“Become a loan broker no license” (reality)" },
    { id: "best-programs", label: "Best programs: categories + picks" },
    { id: "moonshine", label: "Why Moonshine Capital is built differently" },
    { id: "playbook", label: "The affiliate playbook (what to do this week)" },
    { id: "faq", label: "FAQs" }
  ];

  const topPrograms = programs.slice(0, 8);

  return (
    <div className="brut-scanline">
      <Section
        eyebrow="Pillar Guide"
        title="Business loan affiliate programs: the honest version."
        lead="If you’re here for a quick “link in bio” side hustle, stop now. If you want broker-level commissions, you need broker-level behavior: qualification, compliance, and consistency."
        ctas={[site.ctas.primary, site.ctas.secondary, site.ctas.tertiary]}
      >
        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_320px]">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>best business loan affiliate programs</Badge>
              <Badge>business loan broker commission</Badge>
              <Badge>CPA referrals</Badge>
              <Badge>affiliate playbook</Badge>
            </div>

            <p className="mt-5 text-sm text-[var(--muted)]">
              Most “business funding affiliate programs” have the same funnel: drive traffic → submit leads → wait → get ghosted →
              blame the market. That cycle happens because qualification is weak and expectations are fake.
            </p>

            <p className="mt-4 text-sm text-[var(--muted)]">
              This guide gives you: (1) a clean mental model for how payouts really work, (2) the gotchas that kill commissions,
              and (3) a direct lane into a platform designed for partners who can sell.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <ProCon
                title="You’ll win if"
                items={[
                  "You can have real conversations with business owners",
                  "You can disqualify fast without ego",
                  "You can follow a 5-step process repeatedly"
                ]}
                tone="ok"
              />
              <ProCon
                title="You’ll lose if"
                items={[
                  "You chase every lead like a lottery ticket",
                  "You won’t ask for docs early",
                  "You rely on hope instead of pipeline"
                ]}
                tone="warn"
              />
            </div>
          </Card>

          <div className="space-y-4">
            <Card variant="loud">
              <h2 className="text-base font-semibold">Quick actions</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">Pick one lane. Do it today. Don’t “research” for 3 weeks.</p>
              <div className="mt-4">
                <CTACluster ctas={[site.ctas.primary, site.ctas.secondary, site.ctas.tertiary]} />
              </div>
            </Card>

            <Card>
              <h2 className="text-base font-semibold">Table of contents</h2>
              <div className="mt-3">
                <Toc items={toc} />
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section eyebrow="Model" title="What a business loan affiliate program really is" id="what-it-is">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="text-base font-semibold">Affiliate</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              You generate introductions. You may or may not handle qualification. Payouts vary wildly.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold">Broker</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              You qualify, package, and shepherd the file. Commissions are bigger because you do the work.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold">Partner platform</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              You get tools, routing, training, and expectations. Less chaos. More closed deals.
            </p>
          </Card>
        </div>

        <Card className="mt-4">
          <h3 className="text-base font-semibold">The part nobody says out loud</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Your “commission rate” doesn’t matter if your leads aren’t fundable. Approval reality matters more than payout fantasy.
            Your job is to deliver fundable files, not vibes.
          </p>
        </Card>
      </Section>

      <Section eyebrow="Money" title="How commissions actually work" id="commission">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="text-base font-semibold">Common payout models</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li><span className="text-[var(--fg)] font-semibold">CPA / per funded deal:</span> simple, but usually smaller.</li>
              <li><span className="text-[var(--fg)] font-semibold">% of broker fee:</span> bigger potential, requires packaging/ops.</li>
              <li><span className="text-[var(--fg)] font-semibold">Tiered:</span> higher splits after volume or quality thresholds.</li>
              <li><span className="text-[var(--fg)] font-semibold">Rev share:</span> rare; watch terms and clawbacks.</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-base font-semibold">What kills commissions</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li>Submitting “interested” leads without docs</li>
              <li>Not confirming time in business + revenue</li>
              <li>Wrong product fit (MCA vs term vs LOC)</li>
              <li>Compliance issues / misrepresentation</li>
            </ul>
          </Card>
        </div>

        <Card className="mt-4">
          <h3 className="text-base font-semibold">Reality numbers (ballpark)</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Typical min deal sizes for “real” commissions often start around <span className="text-[var(--fg)] font-semibold">{formatCurrency(25000)}</span>–<span className="text-[var(--fg)] font-semibold">{formatCurrency(50000)}</span>.
            If a program says “anyone can do this with no experience,” you’re usually looking at low intent leads or thin payouts.
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Your edge is qualification + follow-up. Not a “secret lender list.”
          </p>
        </Card>
      </Section>

      <Section eyebrow="Truth" title="“Become a loan broker no license” (reality)" id="no-license">
        <Card>
          <p className="text-sm text-[var(--muted)]">
            In many cases you can operate as a referral partner without a formal license—but that does <span className="text-[var(--fg)] font-semibold">not</span> mean “no rules.”
            You still have to follow program terms, avoid misleading claims, and understand basic compliance boundaries. If your pitch is sloppy, your accounts will get flagged or your deals will die in underwriting.
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Translation: you can start without a law degree, but you can’t start without professionalism.
          </p>
        </Card>
      </Section>

      <Section eyebrow="Directory picks" title="Best business loan affiliate programs: categories + picks" id="best-programs">
        <div className="grid gap-4 md:grid-cols-2">
          {topPrograms.map((p) => (
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
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/programs" className="focus-ring inline-flex items-center rounded-md bg-[var(--fg)] px-4 py-2 text-black font-semibold brut-border brut-shadow">
            Open the full directory →
          </Link>
        </div>
      </Section>

      <Section eyebrow="Why us" title="Why Moonshine Capital is built differently" id="moonshine">
        <div className="grid gap-4 md:grid-cols-3">
          <Card variant="loud">
            <h3 className="text-base font-semibold">Built for closers</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              We don’t optimize for “signups.” We optimize for submitted files that fund.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold">Clear lanes</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Join the platform, build an agency, or book a 1:1 plan. No maze of funnels.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold">Honest expectations</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              If you’re not willing to qualify and follow up, you’ll hate this. Good.
            </p>
          </Card>
        </div>

        <Card className="mt-4">
          <h3 className="text-base font-semibold">CTAs (pick one)</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Don’t “save for later.” Choose a lane and ship your first 10 conversations this week.
          </p>
          <div className="mt-4">
            <CTACluster ctas={[site.ctas.primary, site.ctas.secondary, site.ctas.tertiary]} />
          </div>
        </Card>
      </Section>

      <Section eyebrow="Do this now" title="The affiliate playbook (what to do this week)" id="playbook">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="text-base font-semibold">Day 1: pick a niche</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Stop selling “funding.” Sell outcomes to a niche: trades, medical, logistics, agencies, ecommerce, restaurants, etc.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold">Day 2–3: build a list</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              100 names. Real businesses. Real owners. If you can’t build a list, you don’t have a business.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold">Day 4: run the script</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Ask about revenue, time in business, credit reality, and urgency. Then ask for docs early.
            </p>
          </Card>
          <Card variant="loud">
            <h3 className="text-base font-semibold">Day 5: submit clean files</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Clean submissions beat high volume. Always.
            </p>
            <div className="mt-4">
              <Link
                href={site.ctas.primary.url}
                className="focus-ring inline-flex items-center rounded-md bg-[var(--lime)] px-4 py-2 text-black font-semibold brut-border brut-shadow"
              >
                {site.ctas.primary.label} →
              </Link>
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <Link href="/playbook" className="focus-ring inline-flex items-center rounded-md bg-[var(--card)] px-4 py-2 font-semibold brut-border brut-shadow">
            Open the full playbook →
          </Link>
        </div>
      </Section>

      <Section eyebrow="Proof" title="Partner notes (unedited)" >
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.slice(0, 6).map((t) => (
            <Card key={t.id} variant="flat">
              <p className="text-sm text-[var(--muted)]">“{t.quote}”</p>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[var(--muted2)]">
                <span className="text-[var(--fg)] font-semibold">{t.name}</span>
                <span>{t.role}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="FAQ" title="FAQs" id="faq">
        <FAQAccordion items={faqs} />
      </Section>
    </div>
  );
}
