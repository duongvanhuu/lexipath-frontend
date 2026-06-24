"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface JudgeOption {
  value: string;
  label: string;
}

type ActiveVariant = "green" | "red" | "slate";

interface JudgeOptionConfig extends JudgeOption {
  activeVariant: ActiveVariant;
}

const TFNG_OPTS: JudgeOptionConfig[] = [
  { value: "true",  label: "True",      activeVariant: "green" },
  { value: "false", label: "False",     activeVariant: "red"   },
  { value: "ng",    label: "Not Given", activeVariant: "slate" },
];

const YNNG_OPTS: JudgeOptionConfig[] = [
  { value: "yes", label: "Yes",       activeVariant: "green" },
  { value: "no",  label: "No",        activeVariant: "red"   },
  { value: "ng",  label: "Not Given", activeVariant: "slate" },
];

const ACTIVE_CLASSES: Record<ActiveVariant, string> = {
  green: "border-green-600 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  red:   "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  slate: "border-slate-500 bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
};

const HELPER_TEXT: Record<"tfng" | "ynng", string> = {
  tfng: "Chọn đáp án đúng cho dạng True / False / Not Given.",
  ynng: "Chọn đáp án đúng cho dạng Yes / No / Not Given.",
};

export interface JudgeEditorProps {
  type: "tfng" | "ynng";
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function JudgeEditor({ type, value, onChange, className }: JudgeEditorProps) {
  const opts = type === "tfng" ? TFNG_OPTS : YNNG_OPTS;

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Đáp án đúng
      </p>

      <div className="flex gap-2">
        {opts.map((o) => {
          const isActive = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(o.value)}
              className={cn(
                "flex-1 rounded-xl border-2 px-2 py-2.5 text-sm font-bold transition-all",
                isActive
                  ? ACTIVE_CLASSES[o.activeVariant]
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">{HELPER_TEXT[type]}</p>
    </div>
  );
}
