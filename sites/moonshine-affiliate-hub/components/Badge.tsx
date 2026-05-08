import { cn } from "@/lib/ui";

export function Badge({
  children,
  subtle,
  tone
}: {
  children: React.ReactNode;
  subtle?: boolean;
  tone?: "ok" | "warn" | "hot" | "neutral";
}) {
  const toneClass =
    tone === "ok"
      ? "bg-[rgba(44,255,143,0.14)] border-[rgba(44,255,143,0.35)]"
      : tone === "warn"
      ? "bg-[rgba(255,204,0,0.14)] border-[rgba(255,204,0,0.35)]"
      : tone === "hot"
      ? "bg-[rgba(255,61,129,0.14)] border-[rgba(255,61,129,0.35)]"
      : "bg-[rgba(199,240,0,0.10)] border-[rgba(199,240,0,0.22)]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs border",
        subtle ? "text-[var(--muted2)] border-[var(--border)] bg-transparent" : "text-[var(--fg)]",
        subtle ? "" : toneClass
      )}
    >
      {children}
    </span>
  );
}
