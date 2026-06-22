import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type SolutionStepCardProps = {
  /** Step number shown when no `icon` is provided. */
  number?: number;
  /** Leading icon — use a `lucide-react` icon (takes priority over `number`). */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
};

/**
 * SolutionStepCard — a numbered "how it works" step (icon/number badge + title
 * + copy). Use in a "Cách hoạt động" / "3 bước" section, not in the learner app.
 */
function SolutionStepCard({
  number,
  icon,
  title,
  description,
  className,
}: SolutionStepCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-base font-bold text-primary-soft-foreground [&_svg]:size-5">
          {icon ?? number}
        </span>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base leading-snug font-semibold text-text-primary">
            {title}
          </h3>
          {description ? (
            <p className="text-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export { SolutionStepCard };
