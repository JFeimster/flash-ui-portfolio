import posts from "@/data/posts.json";
import { Card } from "@/components/ui/card";

export function EditorialBlocks() {
  const feature = posts.find((p) => p.slug === "future-of-alternative-financing") ?? posts[0];
  const teasers = posts.filter((p) => p.slug !== feature.slug).slice(0, 3);

  return (
    <section aria-label="Editorial blocks" className="mt-10">
      <div className="grid gap-2 md:grid-cols-12">
        {/* Feature article block */}
        <Card className="md:col-span-8 cardSurfaceMuted grain">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Feature</p>
          <h3 className="mt-2 text-balance font-display text-3xl">{feature.title}</h3>
          <p className="mt-2 max-w-[70ch] text-sm text-ink/75">{feature.excerpt}</p>

          {/* Pull quote */}
          <div className="mt-6 rounded-xl bg-accent/10 p-5 hairline">
            <p className="text-sm text-ink/85">
              “The next decade belongs to founders who can finance growth without selling their future.”
            </p>
            <p className="mt-2 text-xs text-ink/60">— Moonshine Editorial</p>
          </div>

          {/* Stat callouts */}
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {[
              { k: "Decisioning", v: "Hours, not weeks" },
              { k: "Structure", v: "Non-dilutive by default" },
              { k: "Clarity", v: "Plain-language terms" }
            ].map((s) => (
              <div key={s.k} className="rounded-xl bg-white/60 p-4 hairline">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/60">{s.k}</p>
                <p className="mt-2 text-sm font-semibold">{s.v}</p>
              </div>
            ))}
          </div>

          <a className="mt-6 inline-flex text-sm font-semibold text-accent" href={`/insights/${feature.slug}/`}>
            Read the feature →
          </a>
        </Card>

        {/* Video embed block */}
        <Card className="md:col-span-4 overflow-hidden">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Platform</p>
          <h3 className="mt-2 font-display text-2xl">A short walkthrough.</h3>
          <p className="mt-2 text-sm text-ink/75">
            Replace this embed with your product video (YouTube/Vimeo). Kept static-export safe.
          </p>

          <div className="mt-4 aspect-video overflow-hidden rounded-xl hairline bg-fog">
            <iframe
              className="h-full w-full"
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
              title="Moonshine Capital overview"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-xs text-ink/60">Tip: swap to your own video ID + title.</p>
        </Card>

        {/* Blog teasers in 3-column grid */}
        <div className="md:col-span-12 grid gap-2 md:grid-cols-3">
          {teasers.map((p, idx) => (
            <Card key={p.slug} className={idx === 1 ? "cardSurfaceMuted grain" : ""}>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/60">{p.category}</p>
              <h4 className="mt-2 text-balance font-display text-xl">{p.title}</h4>
              <p className="mt-2 text-sm text-ink/75">{p.excerpt}</p>
              <a className="mt-4 inline-flex text-sm font-semibold text-accent" href={`/insights/${p.slug}/`}>
                Read →
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
