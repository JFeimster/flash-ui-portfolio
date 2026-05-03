import type { Metadata } from "next";
import { getSite } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { CTACluster } from "@/components/CTACluster";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return buildPageMetadata(site, {
    title: "About — Moonshine Capital Partner Hub",
    description: "Why this hub exists: to set real expectations for affiliates and brokers and route serious operators into a proven platform.",
    path: "/about"
  });
}

export default function AboutPage() {
  const site = getSite();
  return (
    <div className="brut-scanline">
      <Section eyebrow="About" title="We don’t sell dreams. We sell process." lead="Moonshine Capital is for people who can qualify, package, and follow up—because that’s what gets deals funded." ctas={[site.ctas.primary, site.ctas.secondary]}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="text-base font-semibold">The problem</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Most affiliate pages are built to maximize signups, not funded deals. That attracts the wrong behavior: spam leads,
              unrealistic expectations, and angry partners.
            </p>
          </Card>
          <Card>
            <h2 className="text-base font-semibold">The stance</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              We’d rather have fewer partners who submit clean files than thousands who “try it for a week.”
              If that feels harsh, good—this is a performance business.
            </p>
          </Card>
        </div>

        <div className="mt-6">
          <Card variant="loud">
            <h2 className="text-base font-semibold">If you’re serious</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Join the platform, start your agency, or book a 1:1 plan. Pick one lane and move.
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
