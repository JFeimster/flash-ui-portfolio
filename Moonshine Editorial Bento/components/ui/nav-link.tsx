export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-xl px-3 py-2 text-sm font-semibold text-ink/80 transition-colors hover:bg-fog hover:text-ink"
    >
      {children}
    </a>
  );
}
