import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { skillBadgeVariants, type SkillLane } from "@/lib/styles/variants";
import { cn } from "@/lib/utils/cn";

/** Default Vietnamese labels per skill lane (overridable via children). */
const SKILL_LABELS: Record<SkillLane, string> = {
  meaning: "Nghĩa",
  listening: "Nghe",
  spelling: "Chính tả",
  usage: "Cách dùng",
  collocation: "Kết hợp",
};

export type SkillBadgeProps = Omit<
  React.ComponentProps<typeof Badge>,
  "variant"
> & {
  /** Which of the five LexiPath skill lanes this badge represents. */
  skill: SkillLane;
};

/**
 * SkillBadge — a coloured pill for one of the five LexiPath skill lanes
 * (meaning / listening / spelling / usage / collocation). Falls back to the
 * default lane label when no children are provided.
 */
function SkillBadge({ skill, className, children, ...props }: SkillBadgeProps) {
  return (
    <Badge
      className={cn(skillBadgeVariants({ skill }), className)}
      {...props}
    >
      {children ?? SKILL_LABELS[skill]}
    </Badge>
  );
}

export { SkillBadge, SKILL_LABELS, type SkillLane };
