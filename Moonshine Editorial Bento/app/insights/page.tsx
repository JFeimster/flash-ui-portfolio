import posts from "@/data/posts.json";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Insights",
  description: "Editorial research on alternative financing and modern capital structures."
};

export default function InsightsPage() {
  return (
    <div className="pt-10">
      <SectionHeading
        kicker="Insights"
        title="The magazine desk."
        subtitle="Short, readable briefings on capital, cash flow, and non-dilutive strategy."
      />

      <div className="mt-10 grid gap-2 md:grid-cols-12">
        {posts.map((p, idx) => (
          <Card
            key={p.slug}
            className={[
              "md:col-span-6",
              idx === 0 ? "md:col-span-12 grain" : "",
              idx === 1 ? "lg:col-span-7" : "lg:col-span-5"
            ].join(" ")}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-ink/60">{formatDate(p.date)}</p>
            <h3 className="mt-2 text-balance font-display text-2xl">{p.title}</h3>
            <p className="mt-2 text-sm text-ink/75">{p.excerpt}</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-xs text-ink/60">{p.readingTime}</span>
              <a className="text-sm font-semibold text-accent" href={`/insights/${p.slug}/`}>
                Read →
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
