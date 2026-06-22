import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type TrustPillarCardProps = {
  /** Leading icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  /** Headline stat, e.g. "92%". */
  stat?: string;
  label?: string;
  description?: string;
  className?: string;
};

/**
 * TrustPillarCard — a social-proof / trust signal (icon + key stat + label).
 * Use in a "Tại sao chọn LexiPath?" section; use StatTile inside the app.
 */
function TrustPillarCard({
  icon,
  stat,
  label,
  description,
  className,
}: TrustPillarCardProps) {
  return (
    <Card className={cn("items-center gap-2 p-5 text-center", className)}>
      {icon ? (
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground [&_svg]:size-6">
          {icon}
        </span>
      ) : null}
      {stat ? (
        <span className="font-heading text-3xl font-bold text-primary">
          {stat}
        </span>
      ) : null}
      {label ? (
        <span className="text-sm font-semibold text-text-primary">{label}</span>
      ) : null}
      {description ? (
        <p className="text-sm text-text-secondary">{description}</p>
      ) : null}
    </Card>
  );
}

export { TrustPillarCard };
