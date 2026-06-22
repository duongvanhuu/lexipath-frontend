"use client";

import * as React from "react";
import { Check, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type SetupStepCardProps = {
  title: string;
  description?: string;
  /** A CJK/letter glyph (e.g. "あ", "中", "A") shown in the leading tile. */
  glyph?: React.ReactNode;
  /** Or a `lucide-react` icon node (used when no `glyph`). */
  icon?: React.ReactNode;
  /** Small preview line, e.g. "12.500 từ · 8 cấp độ". */
  preview?: string;
  selected?: boolean;
  recommended?: boolean;
  onSelect?: () => void;
  className?: string;
};

/**
 * SetupStepCard — a selectable choice card for onboarding setup steps (language
 * / goal / schedule / script). Leading glyph/icon, title, preview line, a clear
 * selected state, and an optional "Đề xuất" badge. Renders a real `button`.
 */
function SetupStepCard({
  title,
  description,
  glyph,
  icon,
  preview,
  selected = false,
  recommended = false,
  onSelect,
  className,
}: SetupStepCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative flex w-full items-center gap-3.5 rounded-card border p-4 text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary bg-primary-soft shadow-card"
          : "border-border bg-card hover:border-primary/40",
        className
      )}
    >
      {recommended ? (
        <span className="absolute -top-2.5 right-3.5 inline-flex items-center gap-1 rounded-pill bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
          <Sparkles className="size-3" aria-hidden />
          Đề xuất
        </span>
      ) : null}

      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold [&_svg]:size-5",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-surface-muted text-text-secondary"
        )}
      >
        {glyph ?? icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-text-primary">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-sm text-text-secondary">
            {description}
          </span>
        ) : null}
        {preview ? (
          <span className="mt-1.5 block text-xs text-text-muted">{preview}</span>
        ) : null}
      </span>

      <span
        className={cn(
          "flex size-5.5 shrink-0 items-center justify-center rounded-full border-2",
          selected
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-border"
        )}
      >
        {selected ? <Check className="size-3" aria-hidden /> : null}
      </span>
    </button>
  );
}

export { SetupStepCard };
