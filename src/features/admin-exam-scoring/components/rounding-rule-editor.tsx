"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { RoundingRule } from "../types/scoring.types";
import { ScoringSectionLabel } from "./scoring-section-label";

interface RoundingRuleEditorProps {
  rules: RoundingRule[];
  activeId: string;
  onPick: (id: string) => void;
}

export function RoundingRuleEditor({ rules, activeId, onPick }: RoundingRuleEditorProps) {
  return (
    <div>
      <ScoringSectionLabel>Quy tắc làm tròn</ScoringSectionLabel>
      <div className="flex flex-col gap-2.5">
        {rules.map((rule) => {
          const active = rule.id === activeId;
          return (
            <button
              key={rule.id}
              type="button"
              onClick={() => onPick(rule.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-success bg-success-soft"
                  : "border-border bg-card hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  active
                    ? "border-success bg-success"
                    : "border-border bg-transparent",
                )}
              >
                {active && <Check className="size-3 text-white" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary">{rule.name}</div>
                <div className="text-xs text-text-muted">{rule.desc}</div>
              </div>
              <Badge variant="outline" className="shrink-0 text-[11px]">
                bước {rule.precision}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
