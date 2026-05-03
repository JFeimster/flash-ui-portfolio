"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { cn, debounce } from "@/lib/ui";

type FilterItem = {
  id: string;
  name: string;
  blurb: string;
  category: string;
  tags: string[];
  commissionSummary: string;
};

export function Filters({
  items,
  categories,
  placeholder
}: {
  items: FilterItem[];
  categories: string[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const setQueryDebounced = useMemo(
    () =>
      debounce((v: string) => {
        setQuery(v);
      }, 150),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const catOk = category === "All" || it.category === category;
      if (!catOk) return false;
      if (!q) return true;

      const hay = [
        it.name,
        it.blurb,
        it.category,
        it.commissionSummary,
        ...(it.tags ?? [])
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [items, query, category]);

  return (
    <div className="grid gap-4">
      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_260px]">
          <div>
            <label className="text-xs text-[var(--muted2)]">Search</label>
            <input
              className={cn(
                "mt-2 w-full rounded-md bg-transparent px-3 py-2 text-sm text-[var(--fg)]",
                "brut-border focus-ring"
              )}
              placeholder={placeholder ?? "Search…"}
              onChange={(e) => setQueryDebounced(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-[var(--muted2)]">Category</label>
            <select
              className={cn("mt-2 w-full rounded-md bg-transparent px-3 py-2 text-sm brut-border focus-ring")}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All</option>
              {categories.map((c) => (
                <option value={c} key={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge subtle>Results: {filtered.length}</Badge>
          <Badge subtle>Tip: search “CPA”, “split”, “MCA”, “term”</Badge>
        </div>
      </Card>

      {/* This component only renders the filter UI (state is local). 
          The page below renders items; this stays purely presentational. */}
    </div>
  );
}
