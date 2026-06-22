import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { buttonToneVariants } from "@/lib/styles/variants";

import type { SkillSummary } from "./types";

export type WeakSkillCardProps = {
  skill: SkillSummary;
  practiceHref?: string;
  className?: string;
};

function WeakSkillCard({ skill, practiceHref, className }: WeakSkillCardProps) {
  const dueCount = skill.totalCount - skill.masteredCount;

  return (
    <Card
      className={cn(
        "rounded-card shadow-card border-danger/30",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <AlertTriangle
          className="size-4 shrink-0 text-danger-foreground"
          aria-hidden
        />
        <CardTitle className="text-sm font-semibold text-danger-foreground">
          Kỹ năng cần cải thiện
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-text-primary">
            {skill.label}
          </span>
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span>
              Độ chính xác:{" "}
              <span className="font-semibold text-danger-foreground">
                {skill.accuracyPct}%
              </span>
            </span>
            <span>
              Cần ôn:{" "}
              <span className="font-semibold text-text-primary">{dueCount}</span>{" "}
              từ
            </span>
          </div>
        </div>

        {practiceHref ? (
          <Button
            asChild
            size="sm"
            className={cn(buttonToneVariants({ tone: "nextStep" }), "w-full")}
          >
            <a href={practiceHref}>Luyện tập ngay</a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { WeakSkillCard };
