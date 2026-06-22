import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type ProblemCardProps = {
  /** Leading icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
};

/**
 * ProblemCard — articulates a learner pain point: a danger-toned icon, title,
 * and supporting copy. Use in the "Vấn đề bạn đang gặp" grid.
 */
function ProblemCard({ icon, title, description, className }: ProblemCardProps) {
  return (
    <Card className={cn("gap-3 p-5", className)}>
      {icon ? (
        <span className="flex size-11 items-center justify-center rounded-xl bg-danger-soft text-danger-foreground [&_svg]:size-5">
          {icon}
        </span>
      ) : null}
      <h3 className="text-base leading-snug font-semibold text-text-primary">
        {title}
      </h3>
      {description ? (
        <p className="text-sm text-text-secondary">{description}</p>
      ) : null}
    </Card>
  );
}

export { ProblemCard };
