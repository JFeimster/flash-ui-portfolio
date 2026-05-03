import type { ReactNode } from "react";
export function Section({ eyebrow, title, subtitle, actions, children, className = "" }: { eyebrow?: ReactNode; title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; }) {
  return (
    <section className={`px-4 py-16 md:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter2 leading-[1.03]">{title}</h1>
          {subtitle ? <p className="mt-4 text-base md:text-lg text-[rgba(244,241,233,0.72)] leading-relaxed">{subtitle}</p> : null}
          {actions ? <div className="mt-6">{actions}</div> : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
