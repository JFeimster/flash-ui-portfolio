import { cn } from "@/lib/ui";

export function Card({
  children,
  className,
  variant = "default"
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "loud" | "flat";
}) {
  const variants: Record<string, string> = {
    default: "bg-[var(--card)] brut-border brut-shadow",
    loud: "bg-[var(--card2)] brut-border brut-shadow ring-1 ring-[rgba(199,240,0,0.25)]",
    flat: "bg-[rgba(246,246,247,0.04)] border border-[var(--border)]"
  };

  return (
    <div className={cn("rounded-xl p-5", variants[variant], className)}>
      {children}
    </div>
  );
}
