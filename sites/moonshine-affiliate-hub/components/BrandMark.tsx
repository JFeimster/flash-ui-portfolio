export function BrandMark({ wordmark }: { wordmark: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--lime)] text-black font-black brut-border brut-shadow">
        M
      </span>
      <span className="text-sm font-semibold tracking-tight">{wordmark}</span>
    </div>
  );
}
