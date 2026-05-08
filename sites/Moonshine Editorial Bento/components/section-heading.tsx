export function SectionHeading({
  kicker,
  title,
  subtitle
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <p className="text-xs uppercase tracking-[0.18em] text-ink/60">{kicker}</p>
        <h2 className="mt-2 text-balance font-display text-3xl md:text-4xl">{title}</h2>
      </div>
      {subtitle ? (
        <p className="md:col-span-5 md:justify-self-end md:text-right text-sm text-ink/75">{subtitle}</p>
      ) : null}
    </div>
  );
}
