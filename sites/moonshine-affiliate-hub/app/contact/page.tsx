import type { Metadata } from "next";
import { getSite } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return buildPageMetadata(site, {
    title: "Contact — Moonshine Capital Partner Hub",
    description: "Contact Moonshine Capital for partner support or program questions.",
    path: "/contact"
  });
}

export default function ContactPage() {
  const site = getSite();

  return (
    <div className="brut-scanline">
      <Section
        eyebrow="Contact"
        title="Questions? Keep it specific."
        lead="If you send “how do I start?” you’ll get a link back to the playbook. If you send deal details, we can help."
        ctas={[site.ctas.primary, site.ctas.secondary]}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="text-base font-semibold">Email</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              <a className="focus-ring underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={`mailto:${site.contactEmail}`}>
                {site.contactEmail}
              </a>
            </p>
            <p className="mt-3 text-xs text-[var(--muted2)]">
              Include: business type, monthly revenue range, time in business, urgency, and what you already collected.
            </p>
          </Card>

          <Card variant="loud">
            <h2 className="text-base font-semibold">Fastest path</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Book the 1:1 Q&A + launch plan and leave with a roadmap.</p>
            <a
              className="focus-ring mt-4 inline-flex w-full items-center justify-center rounded-md bg-[var(--lime)] px-4 py-2 text-black font-semibold brut-border brut-shadow"
              href={site.ctas.tertiary.url}
            >
              {site.ctas.tertiary.label} →
            </a>
          </Card>
        </div>
      </Section>
    </div>
  );
}
