import { Card } from "@/components/Card";

export function ProCon({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: "ok" | "warn";
}) {
  const dot = tone === "ok" ? "bg-[var(--ok)]" : "bg-[var(--warning)]";

  return (
    <Card variant="flat">
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className={`mt-1.5 inline-block h-2 w-2 rounded-[2px] ${dot}`}></span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
