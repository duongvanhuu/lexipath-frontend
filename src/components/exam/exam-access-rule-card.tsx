"use client";

import * as React from "react";
import {
  Globe,
  Mail,
  BookOpen,
  CreditCard,
  Pencil,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import type { ExamAccessRule } from "./types";

export interface ExamAccessRuleCardProps {
  rule: ExamAccessRule;
  onToggle?: (id: string, active: boolean) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

const RULE_ICONS: Record<ExamAccessRule["ruleType"], React.ElementType> = {
  public: Globe,
  invite: Mail,
  prerequisite: BookOpen,
  paid: CreditCard,
};

function ExamAccessRuleCard({
  rule,
  onToggle,
  onEdit,
  className,
}: ExamAccessRuleCardProps) {
  const Icon = RULE_ICONS[rule.ruleType];

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-sm">{rule.label}</CardTitle>
              {rule.description ? (
                <p className="text-xs text-muted-foreground">
                  {rule.description}
                </p>
              ) : null}
            </div>
          </div>
          <Switch
            checked={rule.active}
            onCheckedChange={(checked) => onToggle?.(rule.id, checked)}
            aria-label={`${rule.active ? "Tắt" : "Bật"} quy tắc ${rule.label}`}
          />
        </div>
      </CardHeader>
      {onEdit ? (
        <CardContent className="flex justify-end pt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(rule.id)}
            aria-label={`Chỉnh sửa quy tắc ${rule.label}`}
          >
            <Pencil className="size-3.5" />
            Cài đặt
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}

export { ExamAccessRuleCard };
