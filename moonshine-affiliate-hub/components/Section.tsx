import { CTACluster } from "@/components/CTACluster";
import type { CTA } from "@/lib/types";

export function Section({
  eyebrow,
  title,
  lead,
  ctas,
  id,
  children
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  ctas?: CTA[];
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid gap-4">
        {eyebrow && (
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted2)]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">{title}</h1>
        {lead && <p className="max-w-3xl text-sm md:text-base text-[var(--muted)] leading-7">{lead}</p>}
        {ctas && ctas.length > 0 && (
          <div className="mt-3">
            <CTACluster ctas={ctas} />
          </div>
        )}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
