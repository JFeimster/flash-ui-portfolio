import Link from "next/link";
import type { ReactNode } from "react";
export function Button({ href, children, variant = "primary", className = "" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string; }) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl2 border text-sm font-semibold tracking-[0.08em] uppercase transition focus-ring";
  const styles: Record<string, string> = {
    primary: "border-[rgba(212,175,55,0.55)] bg-[rgba(212,175,55,0.12)] hover:bg-[rgba(212,175,55,0.18)] shadow-glow",
    secondary: "border-[rgba(244,241,233,0.18)] bg-[rgba(244,241,233,0.06)] hover:bg-[rgba(244,241,233,0.10)]",
    ghost: "border-transparent bg-transparent hover:bg-[rgba(244,241,233,0.06)]"
  };
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  if (isExternal) return <a href={href} className={`${base} ${styles[variant]} ${className}`}>{children}</a>;
  return <Link href={href} className={`${base} ${styles[variant]} ${className}`}>{children}</Link>;
}
