import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import useCases from "@/data/useCases.json";

export const metadata: Metadata = { title: "Use Cases", description: "Partner types and embedded financing flows that convert." };

export default function UseCasesIndexPage() {
  return (
    <Section eyebrow={<Badge variant="outline">USE CASES</Badge>} title="Where embedded financing converts." subtitle="Pick a partner type to see placement + dashboard KPIs.">
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {useCases.map((u) => (
          <Link key={u.slug} href={`/use-cases/${u.slug}`} className="focus-ring rounded-xl2">
            <Card title={u.title} kicker={u.segment} description={u.summary} bullets={u.bullets.slice(0,3)} />
          </Link>
        ))}
      </div>
    </Section>
  );
}
