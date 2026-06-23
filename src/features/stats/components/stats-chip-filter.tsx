"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type FilterOption = {
  id: string;
  label: string;
};

export type StatsChipFilterProps = {
  items: FilterOption[];
  active: string;
  onChange: (id: string) => void;
  label?: string;
};

function StatsChipFilter({ items, active, onChange, label }: StatsChipFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label ? (
        <span className="min-w-[72px] shrink-0 text-xs text-text-muted">{label}</span>
      ) : null}
      <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-0.5">
        {items.map((f) => (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            aria-pressed={active === f.id}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              active === f.id
                ? "border-primary bg-primary-soft text-primary-soft-foreground"
                : "border-border bg-background text-text-secondary hover:border-primary/40"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { StatsChipFilter };
