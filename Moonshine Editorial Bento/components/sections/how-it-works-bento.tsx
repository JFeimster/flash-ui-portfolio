import { Card } from "@/components/ui/card";

const steps = [
  {
    n: "01",
    title: "Signal capture",
    body: "A short intake captures revenue patterns, runway, and constraints—no sprawling questionnaire."
  },
  {
    n: "02",
    title: "Structure match",
    body: "We map signals to structures: revenue-based, asset-backed, non-dilutive startup, and beyond."
  },
  {
    n: "03",
    title: "Term clarity",
    body: "See timelines and tradeoffs in plain language, with a recommended path based on your goals."
  },
  {
    n: "04",
    title: "Document checklist",
    body: "A minimal list of docs to move quickly—built for operators who value velocity."
  },
  {
    n: "05",
    title: "Funding path",
    body: "Close with confidence. Keep ownership. Keep momentum."
  }
];

export function HowItWorksBento() {
  return (
    <section aria-label="How it works" className="mt-10">
      <div className="grid gap-2 md:grid-cols-12">
        {/* Rhythmic modular blocks */}
        <IllustrationBlock className="md:col-span-5 md:row-span-2" title="Visual rhythm">
          Modular blocks alternate size to create editorial pacing—illustrations where you need breath, copy where you need clarity.
        </IllustrationBlock>

        <StepBlock className="md:col-span-4" step={steps[0]} />
        <StepBlock className="md:col-span-3 cardSurfaceMuted grain" step={steps[1]} />

        <StepBlock className="md:col-span-3" step={steps[2]} />
        <StepBlock className="md:col-span-4" step={steps[3]} />

        <IllustrationBlock className="md:col-span-5 md:row-span-2" title="Legible terms">
          Clear, modular terms you can explain in one sentence—built to reduce ambiguity and keep teams aligned.
        </IllustrationBlock>

        <StepBlock className="md:col-span-7 md:row-span-1" step={steps[4]} />

        {/* CTA block at end */}
        <Card className="md:col-span-12 cardSurfaceMuted grain">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Ready</p>
              <h3 className="mt-2 font-display text-2xl md:text-3xl">Start Your Application</h3>
              <p className="mt-2 text-sm text-ink/75">
                Fast intake. Clear options. A recommended next step with an operator-friendly checklist.
              </p>
            </div>
            <a
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              href="/apply/"
            >
              Start Your Application
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
}

function StepBlock({ step, className }: { step: { n: string; title: string; body: string }; className?: string }) {
  return (
    <Card className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Step {step.n}</p>
        <span className="h-px flex-1 bg-black/10" />
      </div>
      <h4 className="mt-3 font-display text-2xl">{step.title}</h4>
      <p className="mt-2 text-sm text-ink/75">{step.body}</p>
    </Card>
  );
}

function IllustrationBlock({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={["grain overflow-hidden", className ?? ""].join(" ")}>
      <p className="text-xs uppercase tracking-[0.18em] text-ink/60">{title}</p>
      <div className="mt-4 rounded-xl bg-fog p-5 hairline">
        <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-white to-fog hairline relative overflow-hidden">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-2xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-black/5 blur-2xl" />
          <div className="absolute inset-0 grid place-items-center">
            <p className="text-xs text-ink/60">Illustration placeholder</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink/75">{children}</p>
    </Card>
  );
}
