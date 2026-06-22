"use client";

import * as React from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

import type { ScriptPreference } from "../types/auth.types";

export type ScriptPreferenceSelectorProps = {
  options: ScriptPreference[];
  value?: string;
  onChange?: (id: string) => void;
  className?: string;
};

/**
 * ScriptPreferenceSelector — picks a script-rendering option for CJK languages
 * (kanji/kana, hanzi/pinyin). Built on the shadcn (Radix) RadioGroup so the
 * native radio semantics and keyboard behaviour are preserved (replacing the
 * prototype's clickable `div`s).
 */
function ScriptPreferenceSelector({
  options,
  value,
  onChange,
  className,
}: ScriptPreferenceSelectorProps) {
  return (
    <RadioGroup
      value={value ?? ""}
      onValueChange={(next) => onChange?.(next)}
      className={cn("gap-2.5", className)}
    >
      {options.map((opt) => {
        const selected = opt.id === value;
        const itemId = `script-${opt.id}`;
        return (
          <Label
            key={opt.id}
            htmlFor={itemId}
            className={cn(
              "flex cursor-pointer items-start gap-3.5 rounded-card border p-4 transition-all",
              selected
                ? "border-primary bg-primary-soft"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <RadioGroupItem id={itemId} value={opt.id} className="mt-1" />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-semibold text-text-primary">
                {opt.label}
              </span>
              <span className="text-xs text-text-secondary">
                {opt.description}
              </span>
              <span className="mt-1.5 text-lg font-medium text-text-primary">
                {opt.example}
              </span>
            </span>
          </Label>
        );
      })}
    </RadioGroup>
  );
}

export { ScriptPreferenceSelector };
