import caseStudies from "@/data/caseStudies.json";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Case Studies",
  description: "Outcomes from teams using Moonshine Capital to fund growth without dilution."
};

export default function CaseStudiesPage() {
  return (
    <div className="pt-10">
      <SectionHeading
        kicker="Case studies"
        title="Outcomes, not anecdotes."
        subtitle="Short, readable summaries that show structure, timeline, and measurable impact."
      />

      <div className="mt-10 grid gap-2 md:grid-cols-12">
        {caseStudies.map((cs, idx) => (
          <Card
            key={cs.slug}
            className={[
              "md:col-span-6",
              idx === 0 ? "md:col-span-12 grain" : "",
              idx % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"
            ].join(" ")}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-ink/60">{cs.industry}</p>
            <h3 className="mt-2 text-balance font-display text-2xl">{cs.title}</h3>
            <p className="mt-2 text-sm text-ink/75">{cs.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {cs.highlights.map((h) => (
                <span key={h} className="rounded-full bg-fog px-3 py-1 text-xs text-ink/70 hairline">
                  {h}
                </span>
              ))}
            </div>
            <a className="mt-5 inline-flex text-sm font-semibold text-accent" href={`/case-studies/${cs.slug}/`}>
              Read the story →
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
