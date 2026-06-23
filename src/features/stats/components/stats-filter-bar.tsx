"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils/cn";
import type { LangCode, StatsRange, StatsScope } from "@/features/stats";

type ChipProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        active
          ? "border-primary bg-primary-soft text-primary-soft-foreground"
          : "border-border bg-background text-text-secondary hover:border-primary/40"
      )}
    >
      {children}
    </button>
  );
}

export type StatsFilterBarProps = {
  scope: StatsScope;
  range: StatsRange;
  lang: LangCode;
  langName: string;
  langFlag: string;
  motivation?: string;
};

const RANGES: { id: StatsRange; label: string }[] = [
  { id: "7d", label: "7 ngày" },
  { id: "30d", label: "30 ngày" },
  { id: "90d", label: "90 ngày" },
];

function StatsFilterBar({ scope, range, lang, langName, langFlag, motivation }: StatsFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(params: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(params)) next.set(k, v);
    router.push(`${pathname}?${next.toString()}` as never);
  }

  const scopeLbl = scope === "account" ? "Toàn tài khoản" : `${langFlag} ${langName}`;
  const rangeLbl = RANGES.find((r) => r.id === range)?.label ?? "7 ngày";

  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thống kê học tập</h1>
          {motivation ? (
            <p className="mt-0.5 text-sm text-text-secondary">{motivation}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1">
            <Chip active={scope === "lang"} onClick={() => update({ scope: "lang" })}>
              {langFlag}&nbsp;{langName}
            </Chip>
            <Chip active={scope === "account"} onClick={() => update({ scope: "account" })}>
              Toàn tài khoản
            </Chip>
          </div>
          <div className="h-4 w-px shrink-0 bg-border" />
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <Chip key={r.id} active={range === r.id} onClick={() => update({ range: r.id })}>
                {r.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-text-muted" aria-live="polite">
        <span>Đang xem:</span>
        <strong className="text-text-secondary">{scopeLbl}</strong>
        <span>·</span>
        <span>{rangeLbl} qua</span>
      </p>
    </div>
  );
}

export { StatsFilterBar };
