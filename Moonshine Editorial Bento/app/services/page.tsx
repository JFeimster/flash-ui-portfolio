import services from "@/data/services.json";
import { SectionHeading } from "@/components/section-heading";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Services",
  description: "Explore Moonshine Capital’s alternative financing structures."
};

export default function ServicesPage() {
  return (
    <div className="pt-10">
      <SectionHeading
        kicker="Services"
        title="Eight categories. One editorial standard."
        subtitle="Each option below is designed to reduce friction, preserve upside, and keep terms legible."
      />

      <div className="mt-10 grid gap-2 md:grid-cols-12">
        {services.map((s) => (
          <Card key={s.id} className="md:col-span-6 lg:col-span-4">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-fog hairline">
                <Icon name={s.icon} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-ink/75">{s.description}</p>
                <p className="mt-3 text-sm text-ink/70">{s.detail}</p>
                <a className="mt-4 inline-flex text-sm font-semibold text-accent" href="/apply/">
                  Learn More →
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
