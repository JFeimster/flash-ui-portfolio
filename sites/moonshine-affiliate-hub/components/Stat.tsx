import { Card } from "@/components/Card";

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card variant="flat">
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted2)]">{label}</div>
      <div className="mt-2 text-base font-semibold">{value}</div>
    </Card>
  );
}
