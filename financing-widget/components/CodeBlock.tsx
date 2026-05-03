export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="rounded-xl2 border border-[rgba(244,241,233,0.16)] bg-[rgba(7,8,11,0.65)] p-4 overflow-x-auto">
      <pre className="text-[12px] leading-relaxed font-mono text-[rgba(244,241,233,0.80)] whitespace-pre">{code}</pre>
    </div>
  );
}
