import type { ReactNode } from "react";
export function Card({ title, kicker, description, bullets, footer, highlight, mono, code }: { title: string; kicker?: string; description?: string; bullets?: string[]; footer?: ReactNode; highlight?: boolean; mono?: boolean; code?: string; }) {
  return (
    <div className={["rounded-xl2 border bg-[rgba(15,17,23,0.55)] shadow-brutal p-5 noise", highlight ? "border-[rgba(212,175,55,0.38)] shadow-glow" : "border-[rgba(244,241,233,0.16)]"].join(" ")}>
      {kicker ? <div className="text-[11px] uppercase tracking-[0.22em] text-[rgba(244,241,233,0.65)]">{kicker}</div> : null}
      <div className="mt-2 text-xl font-semibold tracking-[-0.03em]">{title}</div>
      {description ? <p className="mt-3 text-sm text-[rgba(244,241,233,0.75)] leading-relaxed">{description}</p> : null}
      {bullets?.length ? (
        <ul className="mt-4 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-[rgba(244,241,233,0.78)]">
              <span className="mt-[7px] h-2 w-2 rounded-full bg-gold shadow-glow" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {code ? (
        <div className="mt-4">
          <div className={["rounded-xl2 border border-[rgba(244,241,233,0.14)] bg-[rgba(7,8,11,0.55)] p-4 overflow-x-auto", mono ? "font-mono text-[12px]" : ""].join(" ")}>
            <pre className="whitespace-pre">{code}</pre>
          </div>
        </div>
      ) : null}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </div>
  );
}
