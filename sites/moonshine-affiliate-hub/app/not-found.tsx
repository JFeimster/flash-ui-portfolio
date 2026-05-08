import Link from "next/link";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { getSite } from "@/lib/data";

export default function NotFound() {
  const site = getSite();
  return (
    <div className="brut-scanline">
      <Section eyebrow="404" title="Page not found" lead="Either the link is wrong, or the page got removed. Use the hub links." ctas={[site.ctas.primary, site.ctas.secondary]}>
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="focus-ring inline-flex items-center rounded-md bg-[var(--fg)] px-4 py-2 text-black font-semibold brut-border brut-shadow">
              Back to home →
            </Link>
            <Link href={site.pillar.slug} className="focus-ring inline-flex items-center rounded-md bg-[var(--card)] px-4 py-2 font-semibold brut-border brut-shadow">
              Pillar guide →
            </Link>
            <Link href="/programs" className="focus-ring inline-flex items-center rounded-md bg-[var(--card)] px-4 py-2 font-semibold brut-border brut-shadow">
              Directory →
            </Link>
          </div>
        </Card>
      </Section>
    </div>
  );
}
