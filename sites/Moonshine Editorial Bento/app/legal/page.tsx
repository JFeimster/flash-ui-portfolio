import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Legal",
  description: "Compliance, privacy, and disclosures for Moonshine Capital."
};

export default function LegalPage() {
  return (
    <div className="pt-10">
      <SectionHeading
        kicker="Legal"
        title="Disclosures & compliance."
        subtitle="This starter is a template. Replace with counsel-approved copy for your jurisdiction and offering types."
      />

      <div className="mt-10 grid gap-2 md:grid-cols-12">
        <Card className="md:col-span-7">
          <h2 className="font-display text-2xl">General disclosure</h2>
          <p className="mt-3 text-sm text-ink/75">
            Moonshine Capital provides information about financing options. Nothing on this website constitutes legal,
            tax, or investment advice. Financing availability and terms depend on applicant eligibility and underwriting.
          </p>

          <h2 className="mt-8 font-display text-2xl">Privacy</h2>
          <p className="mt-3 text-sm text-ink/75">
            Replace this section with your privacy policy. If you collect form data, specify what you collect, how you
            store it, and how users can request deletion.
          </p>

          <h2 className="mt-8 font-display text-2xl">Cookies & analytics</h2>
          <p className="mt-3 text-sm text-ink/75">
            This starter ships without analytics. If you add analytics, disclose usage here and ensure consent where required.
          </p>
        </Card>

        <Card className="md:col-span-5 cardSurfaceMuted grain">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Contact</p>
          <h3 className="mt-2 font-display text-2xl">Compliance inbox</h3>
          <p className="mt-2 text-sm text-ink/75">
            For legal and compliance questions, contact: <span className="font-semibold">hello@moonshine.capital</span>
          </p>
          <a className="mt-4 inline-flex text-sm font-semibold text-accent" href="/apply/">
            Apply (intake) →
          </a>
        </Card>
      </div>
    </div>
  );
}
