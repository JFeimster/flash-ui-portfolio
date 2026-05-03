export function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <ul className="space-y-2 text-sm text-[var(--muted)]">
      {items.map((it) => (
        <li key={it.id}>
          <a className="focus-ring inline-flex rounded-md px-2 py-1 underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={`#${it.id}`}>
            {it.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
