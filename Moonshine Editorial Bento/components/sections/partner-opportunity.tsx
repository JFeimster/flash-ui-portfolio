import partnerProgram from "@/data/partnerProgram.json";
import { Card } from "@/components/ui/card";
import { IncomeCalculator } from "@/components/ui/income-calculator";

export function PartnerOpportunity() {
  return (
    <section aria-label="Partner opportunity" className="mt-10">
      <div className="grid gap-2 md:grid-cols-12">
        {/* Split bento: left benefits */}
        <Card className="md:col-span-7 cardSurfaceMuted grain">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Partner benefits</p>
          <h3 className="mt-2 text-balance font-display text-3xl">Add a revenue line—without adding complexity.</h3>
          <p className="mt-2 text-sm text-ink/75">
            Moonshine gives you an operator-ready offer: clear categories, transparent tiers, and assets to educate clients.
          </p>

          <div className="mt-6 grid gap-2 md:grid-cols-2">
            {partnerProgram.benefits.map((b) => (
              <div key={b.title} className="rounded-xl bg-white/60 p-4 hairline">
                <p className="text-sm font-semibold">{b.title}</p>
                <p className="mt-2 text-sm text-ink/75">{b.body}</p>
              </div>
            ))}
          </div>

          {/* Tiered program blocks stacked vertically */}
          <div className="mt-6 space-y-2">
            {partnerProgram.tiers.map((t) => (
              <div key={t.name} className="rounded-xl bg-fog p-5 hairline">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-ink/70 hairline">{t.payout}</span>
                </div>
                <p className="mt-2 text-sm text-ink/75">{t.detail}</p>
              </div>
            ))}
          </div>

          {/* Success story blocks interspersed */}
          <div className="mt-6 rounded-xl bg-accent/10 p-5 hairline">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Success story</p>
            <p className="mt-2 text-sm text-ink/85">
              “We introduced Moonshine to three clients in a month. The terms were clear, approvals were fast, and we added
              a predictable partner income stream.”
            </p>
            <p className="mt-3 text-xs text-ink/60">— Fractional CFO partner</p>
          </div>
        </Card>

        {/* Right income calculator */}
        <Card className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Income calculator</p>
          <h3 className="mt-2 font-display text-2xl">Estimate partner earnings.</h3>
          <p className="mt-2 text-sm text-ink/75">Tune client count and average funded amount to get a simple estimate.</p>
          <div className="mt-5">
            <IncomeCalculator />
          </div>

          {/* Large Join Network CTA block */}
          <div className="mt-6 rounded-xl bg-fog p-5 hairline">
            <p className="text-sm font-semibold">Join the network</p>
            <p className="mt-2 text-sm text-ink/75">
              Get the partner deck, referral portal access, and editorial assets for client education.
            </p>
            <a
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              href="/apply/"
            >
              Join Network
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
}
