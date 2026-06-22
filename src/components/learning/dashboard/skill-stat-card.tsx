import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { SkillProgressLane } from "@/components/lexipath";

import type { SkillSummary } from "./types";

const SKILL_SOFT_BG: Record<SkillSummary["key"], string> = {
  meaning: "bg-skill-meaning-soft",
  listening: "bg-skill-listening-soft",
  spelling: "bg-skill-spelling-soft",
  usage: "bg-skill-usage-soft",
  collocation: "bg-skill-collocation-soft",
};

export type SkillStatCardProps = {
  skill: SkillSummary;
  className?: string;
};

function SkillStatCard({ skill, className }: SkillStatCardProps) {
  return (
    <Card
      className={cn(
        "rounded-card shadow-card overflow-hidden",
        SKILL_SOFT_BG[skill.key],
        className
      )}
    >
      <CardContent className="p-4">
        <SkillProgressLane
          skill={skill.key}
          masteredCount={skill.masteredCount}
          totalCount={skill.totalCount}
          accuracyPct={skill.accuracyPct}
        />
      </CardContent>
    </Card>
  );
}

export { SkillStatCard };
