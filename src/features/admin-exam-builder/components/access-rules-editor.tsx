"use client";

import { Crown, Repeat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { AccessRule } from "../types/exam-builder.types";

interface AccessRulesEditorProps {
  rules: AccessRule[];
  onChange: (rules: AccessRule[]) => void;
}

function RuleIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "crown":  return <Crown className="size-4" aria-hidden />;
    case "repeat": return <Repeat className="size-4" aria-hidden />;
    default:       return null;
  }
}

export function AccessRulesEditor({ rules, onChange }: AccessRulesEditorProps) {
  const toggle = (i: number) =>
    onChange(rules.map((r, idx) => (idx === i ? { ...r, enabled: !r.enabled } : r)));

  const setVal = (i: number, v: string) =>
    onChange(rules.map((r, idx) => (idx === i ? { ...r, value: v } : r)));

  return (
    <Card className="p-5">
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-text-secondary">
        Quy tắc truy cập
      </p>
      <div className="flex flex-col gap-3">
        {rules.map((rule, i) => (
          <div
            key={rule.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border px-3.5 py-3 transition-opacity",
              !rule.enabled && "opacity-60",
            )}
          >
            <span className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              rule.enabled ? "bg-blue-50 text-blue-600" : "bg-surface-muted text-text-muted",
            )}>
              <RuleIcon icon={rule.icon} />
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">{rule.label}</p>
              <Input
                className="mt-1.5 h-7 max-w-60 text-xs"
                value={rule.value}
                disabled={!rule.enabled}
                onChange={(e) => setVal(i, e.target.value)}
                aria-label={`Giá trị: ${rule.label}`}
              />
            </div>

            <Switch
              checked={rule.enabled}
              onCheckedChange={() => toggle(i)}
              aria-label={`${rule.enabled ? "Tắt" : "Bật"} quy tắc: ${rule.label}`}
            />
          </div>
        ))}

        {rules.length === 0 && (
          <p className="py-4 text-center text-sm text-text-muted">
            Chưa có quy tắc truy cập nào.
          </p>
        )}
      </div>
    </Card>
  );
}
