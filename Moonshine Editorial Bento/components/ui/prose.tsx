export function Prose({ content }: { content: string[] }) {
  return (
    <article className="prose max-w-none">
      <div className="space-y-4">
        {content.map((p, i) => (
          <p key={i} className="text-sm leading-7 text-ink/80">
            {p}
          </p>
        ))}
      </div>

      <style>{`
        .prose h2 { font-family: var(--font-display); font-size: 1.5rem; margin-top: 2rem; }
        .prose a { color: var(--accent); font-weight: 600; }
      `}</style>
    </article>
  );
}
