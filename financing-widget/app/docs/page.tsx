import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import docs from "@/data/docs.json";

export const metadata: Metadata = { title: "Docs", description: "Implementation guide for the embedded financing widget." };

export default function DocsIndexPage() {
  return (
    <Section eyebrow={<Badge variant="outline">DOCS</Badge>} title="Implement in 5 minutes." subtitle="Static docs. Replace snippet URLs with your real CDN/widget.">
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((d) => (
          <Link key={d.slug} href={`/docs/${d.slug}`} className="focus-ring rounded-xl2">
            <Card title={d.title} kicker={d.category} description={d.summary} />
          </Link>
        ))}
      </div>
    </Section>
  );
}
