import * as React from "react";

import { SkillLaneGroup } from "@/components/lexipath";
import { cn } from "@/lib/utils/cn";
import type { SkillLaneData } from "@/components/lexipath";

/* -------------------------------------------------------------------------- */
/* SkillCoverageSection                                                        */
/* -------------------------------------------------------------------------- */

export type SkillCoverageSectionProps = {
  skillLanes: SkillLaneData[];
  className?: string;
};

function SkillCoverageSection({
  skillLanes,
  className,
}: SkillCoverageSectionProps) {
  if (skillLanes.length === 0) return null;

  return (
    <section
      aria-labelledby="skill-coverage-heading"
      className={cn("flex flex-col gap-3", className)}
    >
      <h2
        id="skill-coverage-heading"
        className="text-base font-semibold text-text-primary"
      >
        Kỹ năng luyện tập
      </h2>
      <SkillLaneGroup lanes={skillLanes} />
    </section>
  );
}

export { SkillCoverageSection };
