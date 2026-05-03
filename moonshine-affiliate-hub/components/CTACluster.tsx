import type { CTA } from "@/lib/types";

export function CTACluster({ ctas }: { ctas: CTA[] }) {
  const [primary, secondary, tertiary] = ctas;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {primary && (
        <a
          href={primary.url}
          className="focus-ring inline-flex items-center justify-center rounded-md bg-[var(--lime)] px-4 py-2 text-black font-semibold brut-border brut-shadow"
        >
          {primary.label} →
        </a>
      )}
      {secondary && (
        <a
          href={secondary.url}
          className="focus-ring inline-flex items-center justify-center rounded-md bg-[var(--card)] px-4 py-2 font-semibold brut-border brut-shadow"
        >
          {secondary.label} →
        </a>
      )}
      {tertiary && (
        <a
          href={tertiary.url}
          className="focus-ring inline-flex items-center justify-center rounded-md bg-transparent px-4 py-2 font-semibold underline decoration-[var(--magenta)] decoration-2 underline-offset-4"
        >
          {tertiary.label} →
        </a>
      )}
    </div>
  );
}
