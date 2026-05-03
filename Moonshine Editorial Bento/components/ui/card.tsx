export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={["cardSurface p-6", className ?? ""].join(" ")}>{children}</div>;
}
