"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type LanguageChoiceCardProps = {
  name: string;
  /** Native rendering of the language name (e.g. "日本語"). */
  nativeName?: string;
  /** Flag / glyph — a string or node. */
  icon?: React.ReactNode;
  description?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
};

/**
 * LanguageChoiceCard — selectable card for choosing a target language during
 * onboarding (flag, name + native name, short description). Renders a `button`.
 */
function LanguageChoiceCard({
  name,
  nativeName,
  icon,
  description,
  selected = false,
  onSelect,
  className,
}: LanguageChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-input border p-4 text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary bg-primary-soft"
          : "border-border bg-card hover:border-primary/40",
        className
      )}
    >
      {icon ? (
        <span className="text-2xl leading-none">{icon}</span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-text-primary">
          {name}
          {nativeName ? (
            <span className="ml-1.5 text-sm font-medium text-text-secondary">
              {nativeName}
            </span>
          ) : null}
        </span>
        {description ? (
          <span className="mt-0.5 block text-xs text-text-secondary">
            {description}
          </span>
        ) : null}
      </span>
      {selected ? (
        <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3.5" aria-hidden />
        </span>
      ) : null}
    </button>
  );
}

export { LanguageChoiceCard };
