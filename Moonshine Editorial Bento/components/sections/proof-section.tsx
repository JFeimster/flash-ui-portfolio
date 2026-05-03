import testimonials from "@/data/testimonials.json";
import trust from "@/data/trust.json";
import caseStudies from "@/data/caseStudies.json";
import { Card } from "@/components/ui/card";

export function ProofSection() {
  const featured = caseStudies.slice(0, 2);

  return (
    <section aria-label="Proof" className="mt-10">
      <div className="grid gap-2 md:grid-cols-12">
        {/* Testimonial blocks varying sizes */}
        <Card className="md:col-span-7 cardSurfaceMuted grain">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Client voice</p>
          <h3 className="mt-2 font-display text-3xl">{testimonials[1]?.headline ?? "Clear terms. Fast momentum."}</h3>
          <p className="mt-3 text-sm text-ink/80">“{testimonials[1]?.quote ?? "Moonshine gave us financing options that matched our cash flow and kept ownership intact."}”</p>
          <p className="mt-3 text-xs text-ink/60">
            — {testimonials[1]?.name ?? "Operator"}, {testimonials[1]?.role ?? "Founder"}
          </p>
        </Card>

        <Card className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Trust signals</p>
          <div className="mt-4 grid gap-2">
            {trust.badges.map((b) => (
              <div key={b.title} className="rounded-xl bg-fog p-4 hairline">
                <p className="text-sm font-semibold">{b.title}</p>
                <p className="mt-1 text-sm text-ink/75">{b.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Company logo blocks */}
        <div className="md:col-span-12 grid gap-2 md:grid-cols-6">
          {trust.logos.map((l) => (
            <div key={l} className="grid place-items-center rounded-xl bg-white p-5 hairline shadow-soft">
              <span className="text-xs font-semibold text-ink/70">{l}</span>
            </div>
          ))}
        </div>

        {/* Case study preview blocks */}
        {featured.map((cs, idx) => (
          <Card key={cs.slug} className={idx === 0 ? "md:col-span-7" : "md:col-span-5 cardSurfaceMuted grain"}>
            <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Case study</p>
            <h3 className="mt-2 text-balance font-display text-2xl">{cs.title}</h3>
            <p className="mt-2 text-sm text-ink/75">{cs.summary}</p>
            <a className="mt-4 inline-flex text-sm font-semibold text-accent" href={`/case-studies/${cs.slug}/`}>
              View story →
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}
