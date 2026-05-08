import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Apply",
  description: "Start a Moonshine Capital application—fast, minimal, and designed for clarity."
};

export default function ApplyPage() {
  return (
    <div className="pt-10">
      <SectionHeading
        kicker="Apply"
        title="Start your application."
        subtitle="This is a static starter. Replace the form action with your intake tool (Tally, Typeform, HubSpot, etc.)."
      />

      <div className="mt-10 grid gap-2 md:grid-cols-12">
        <Card className="md:col-span-7">
          <form className="grid gap-4" action="#" method="post">
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="company">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                  placeholder="Company name"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="revenue">
                  Monthly revenue (approx.)
                </label>
                <input
                  id="revenue"
                  name="revenue"
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                  placeholder="$50,000"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="purpose">
                  Funding purpose
                </label>
                <select id="purpose" name="purpose" className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm">
                  <option>Growth & inventory</option>
                  <option>Marketing scale</option>
                  <option>Runway extension</option>
                  <option>Equipment / assets</option>
                  <option>Credit building</option>
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                className="min-h-[120px] rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                placeholder="Anything we should know (timeline, constraints, goals)."
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Submit Application
            </button>

            <p className="text-xs text-ink/60">
              By submitting, you agree to the terms outlined on the Legal page. Replace this with your compliance language.
            </p>
          </form>
        </Card>

        <Card className="md:col-span-5 cardSurfaceMuted grain">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">What happens next</p>
          <h3 className="mt-2 font-display text-2xl">A clear path forward.</h3>
          <div className="mt-4 space-y-3 text-sm text-ink/75">
            <div className="rounded-xl bg-white/60 p-4 hairline">
              <p className="font-semibold">1) Quick review</p>
              <p className="mt-1">We map your revenue reality to best-fit structures.</p>
            </div>
            <div className="rounded-xl bg-white/60 p-4 hairline">
              <p className="font-semibold">2) Transparent options</p>
              <p className="mt-1">You’ll see terms, timelines, and tradeoffs in plain language.</p>
            </div>
            <div className="rounded-xl bg-white/60 p-4 hairline">
              <p className="font-semibold">3) Next-step checklist</p>
              <p className="mt-1">A small set of docs to move fast—no sprawling process.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
