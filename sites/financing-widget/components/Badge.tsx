import type { ReactNode } from "react";
export function Badge({ children, variant = "solid" }: { children: ReactNode; variant?: "solid" | "outline" }) {
  const base = "inline-flex items-center px-3 py-1 rounded-xl2 text-[11px] uppercase tracking-[0.22em] border";
  const styles =
    variant === "solid"
      ? "border-[rgba(212,175,55,0.45)] bg-[rgba(212,175,55,0.10)] text-bone shadow-glow"
      : "border-[rgba(244,241,233,0.18)] bg-[rgba(244,241,233,0.04)] text-[rgba(244,241,233,0.78)]";
  return <span className={`${base} ${styles}`}>{children}</span>;
}
