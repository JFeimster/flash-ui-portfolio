"use client";

import { useMemo, useState } from "react";

export function IncomeCalculator() {
  const [clients, setClients] = useState(4);
  const [avgFunding, setAvgFunding] = useState(120000);
  const [payoutBps, setPayoutBps] = useState(50); // 0.50%

  const estimate = useMemo(() => {
    const payoutRate = payoutBps / 10000;
    const monthly = clients * avgFunding * payoutRate;
    const annual = monthly * 12;
    return { monthly, annual };
  }, [clients, avgFunding, payoutBps]);

  return (
    <div className="rounded-xl bg-fog p-5 hairline">
      <div className="grid gap-4">
        <RangeField
          label="Clients / month"
          value={clients}
          min={0}
          max={20}
          step={1}
          onChange={(v) => setClients(v)}
        />
        <RangeField
          label="Avg funded amount"
          value={avgFunding}
          min={10000}
          max={500000}
          step={5000}
          format={(n) => `$${n.toLocaleString()}`}
          onChange={(v) => setAvgFunding(v)}
        />
        <RangeField
          label="Payout (bps)"
          value={payoutBps}
          min={10}
          max={150}
          step={5}
          format={(n) => `${n} bps`}
          onChange={(v) => setPayoutBps(v)}
        />

        <div className="rounded-xl bg-white p-4 hairline">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Estimate</p>
          <p className="mt-2 text-2xl font-semibold">${Math.round(estimate.monthly).toLocaleString()} / mo</p>
          <p className="mt-1 text-sm text-ink/75">${Math.round(estimate.annual).toLocaleString()} / year</p>
          <p className="mt-2 text-xs text-ink/60">Illustrative only. Replace with your real tier logic.</p>
        </div>
      </div>
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (n: number) => string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 hairline">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm text-ink/70">{format ? format(value) : value}</p>
      </div>
      <input
        className="mt-3 w-full accent-[var(--accent)]"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}
