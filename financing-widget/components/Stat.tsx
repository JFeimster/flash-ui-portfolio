export function Stat({ kpi, label, note }: { kpi: string; label: string; note?: string }) {
  return (
    <div className="rounded-xl2 border border-[rgba(244,241,233,0.16)] bg-[rgba(15,17,23,0.55)] shadow-brutal p-5 noise">
      <div className="text-3xl font-semibold tracking-[-0.04em]">{kpi}</div>
      <div className="mt-2 text-sm text-[rgba(244,241,233,0.78)]">{label}</div>
      {note ? <div className="mt-1 text-xs text-[rgba(244,241,233,0.60)]">{note}</div> : null}
    </div>
  );
}
