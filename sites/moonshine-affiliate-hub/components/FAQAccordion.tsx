"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import type { FAQItem } from "@/lib/types";

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const normalized = useMemo(() => items, [items]);

  return (
    <div className="grid gap-3">
      {normalized.map((it) => {
        const isOpen = openId === it.id;
        return (
          <Card key={it.id} variant="flat">
            <button
              className="focus-ring w-full text-left rounded-md"
              onClick={() => setOpenId(isOpen ? null : it.id)}
              aria-expanded={isOpen}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-base font-semibold">{it.q}</div>
                <div className="text-lg leading-none text-[var(--muted2)]">{isOpen ? "−" : "+"}</div>
              </div>
            </button>
            {isOpen && <p className="mt-3 text-sm text-[var(--muted)] leading-7">{it.a}</p>}
          </Card>
        );
      })}
    </div>
  );
}
