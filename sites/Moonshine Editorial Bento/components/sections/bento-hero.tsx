import site from "@/data/site.json";
import metrics from "@/data/metrics.json";
import partners from "@/data/partners.json";
import testimonials from "@/data/testimonials.json";
import { CountUp } from "@/components/ui/count-up";
import { Card } from "@/components/ui/card";

export function BentoHero() {
  const t = testimonials[0];

  return (
    <section aria-label="Hero" className="mt-2">
      <div className="bentoGrid bentoHero">
        {/* Large headline block (spans 4 columns) */}
        <div className="cardSurfaceMuted grain p-8 md:col-span-4 md:row-span-3">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Moonshine Capital</p>
          <h1 className="mt-4 text-balance font-display text-5xl leading-[1.02] md:text-6xl">
            Alternative Financing, <span className="text-accent">Redefined</span>
          </h1>
          <p className="mt-5 max-w-[52ch] text-sm text-ink/75">
            {site.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <a
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              href="/apply/"
            >
              Explore Funding Options
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl bg-white/60 px-6 py-3 text-sm font-semibold text-ink hairline transition-transform hover:-translate-y-0.5"
              href="/case-studies/"
            >
              See outcomes
            </a>
          </div>

          <div className="mt-8 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl bg-white/60 p-4 hairline">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Speed</p>
              <p className="mt-2 text-sm font-semibold">Minutes to apply</p>
            </div>
            <div className="rounded-xl bg-white/60 p-4 hairline">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Clarity</p>
              <p className="mt-2 text-sm font-semibold">Plain-language terms</p>
            </div>
            <div className="rounded-xl bg-white/60 p-4 hairline">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Ownership</p>
              <p className="mt-2 text-sm font-semibold">Non-dilutive paths</p>
            </div>
          </div>
        </div>

        {/* Stats block (2×2): Animated funding metrics */}
        <div className="cardSurface p-6 md:col-span-2 md:row-span-2">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Funding metrics</p>
          <div className="mt-4 grid gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-xl bg-fog p-4 hairline">
                <p className="text-xs text-ink/60">{m.label}</p>
                <p className="mt-2 text-2xl font-semibold">
                  <CountUp value={m.value} prefix={m.prefix} suffix={m.suffix} />
                </p>
                <p className="mt-1 text-xs text-ink/60">{m.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA block (2×1): button */}
        <div className="cardSurfaceMuted grain p-6 md:col-span-2 md:row-span-1">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Get matched</p>
          <p className="mt-2 text-sm text-ink/75">Tell us revenue, goals, and constraints. We’ll recommend the structure.</p>
          <a
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            href="/apply/"
          >
            Explore Funding Options
          </a>
        </div>

        {/* Image block (2×2): editorial imagery */}
        <div className="cardSurface grain md:col-span-2 md:row-span-2 overflow-hidden">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(1200px 500px at 20% 20%, rgba(37,99,235,0.28), transparent 60%), radial-gradient(1000px 600px at 80% 40%, rgba(26,26,26,0.18), transparent 55%), linear-gradient(135deg, #ffffff, #f5f5f5)",
              minHeight: "100%"
            }}
          >
            <div className="flex h-full flex-col justify-end p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Editorial image</p>
              <p className="mt-2 text-sm font-semibold">Replace with a high-quality business photo in /public/images.</p>
              <p className="mt-1 text-xs text-ink/60">Current: gradient + grain placeholder (fast + export-safe).</p>
            </div>
          </div>
        </div>

        {/* Testimonial snippet block (2×1) */}
        <div className="cardSurface p-6 md:col-span-2 md:row-span-1">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Testimonial</p>
          <p className="mt-3 text-sm text-ink/80">“{t.quote}”</p>
          <p className="mt-3 text-xs text-ink/60">
            — {t.name}, {t.role}
          </p>
        </div>

        {/* Partner logos block (6×1) */}
        <div className="cardSurfaceMuted p-5 md:col-span-6 md:row-span-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Trusted by teams from</p>
            <div className="flex flex-wrap items-center gap-3">
              {partners.slice(0, 6).map((p) => (
                <span
                  key={p.name}
                  className="rounded-full bg-white/60 px-3 py-2 text-xs font-semibold text-ink/70 hairline"
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Below-hero editorial strip */}
      <div className="mt-10 grid gap-2 md:grid-cols-12">
        <Card className="md:col-span-7">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Operator note</p>
          <h2 className="mt-2 text-balance font-display text-2xl md:text-3xl">Better capital is legible capital.</h2>
          <p className="mt-2 text-sm text-ink/75">
            Moonshine organizes alternative financing into clear categories, with timelines and tradeoffs you can
            explain. Less mystery. More momentum.
          </p>
        </Card>
        <Card className="md:col-span-5 cardSurfaceMuted grain">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Quick links</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <a className="rounded-xl bg-white/60 p-4 text-sm font-semibold hairline hover:bg-white" href="/services/">
              Browse services →
            </a>
            <a className="rounded-xl bg-white/60 p-4 text-sm font-semibold hairline hover:bg-white" href="/insights/">
              Read insights →
            </a>
            <a className="rounded-xl bg-white/60 p-4 text-sm font-semibold hairline hover:bg-white" href="/partners/">
              Partner program →
            </a>
            <a className="rounded-xl bg-white/60 p-4 text-sm font-semibold hairline hover:bg-white" href="/case-studies/">
              Case studies →
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
}
