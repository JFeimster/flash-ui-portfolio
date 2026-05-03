import services from "@/data/services.json";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const layoutSpans = [
  "md:col-span-5 md:row-span-2",
  "md:col-span-4 md:row-span-1",
  "md:col-span-3 md:row-span-1",
  "md:col-span-3 md:row-span-2",
  "md:col-span-4 md:row-span-2",
  "md:col-span-5 md:row-span-1",
  "md:col-span-6 md:row-span-1",
  "md:col-span-6 md:row-span-1"
];

export function ServicesBento() {
  return (
    <section aria-label="Services bento" className="mt-10">
      <div className="grid gap-2 md:grid-cols-12">
        {services.map((s, i) => (
          <HoverExpandCard key={s.id} className={layoutSpans[i] ?? "md:col-span-6"}>
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-fog hairline">
                <Icon name={s.icon} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-ink/75">{s.description}</p>

                <div className="mt-4 hidden rounded-xl bg-fog p-4 hairline group-hover:block">
                  <p className="text-sm text-ink/75">{s.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-full bg-white px-3 py-1 text-xs text-ink/70 hairline">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <a className="mt-4 inline-flex text-sm font-semibold text-accent" href="/apply/">
                  Learn More →
                </a>
              </div>
            </div>
          </HoverExpandCard>
        ))}
      </div>
    </section>
  );
}

function HoverExpandCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Card
      className={[
        "group relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5",
        "hover:shadow-soft",
        className ?? ""
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-black/5 blur-2xl" />
      </div>

      <div className="relative">{children}</div>
    </Card>
  );
}
