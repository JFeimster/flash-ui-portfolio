import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import changelog from "@/data/changelog.json";

export const metadata: Metadata = { title: "Changelog", description: "Product updates." };

export default function ChangelogPage() {
  return (
    <Section eyebrow={<Badge variant="outline">CHANGELOG</Badge>} title="Shipping updates." subtitle="Public notes build partner confidence.">
      <div className="mt-10 grid grid-cols-1 gap-4">
        {changelog.entries.map((e) => (
          <Card key={e.date} title={e.title} kicker={e.date} description={e.summary} bullets={e.items} />
        ))}
      </div>
    </Section>
  );
}
