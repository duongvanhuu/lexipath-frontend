import * as React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

import type { CheckpointNodeProps } from "../types";
import { PathRail } from "./path-rail";

/* -------------------------------------------------------------------------- */
/* PathCard                                                                    */
/* -------------------------------------------------------------------------- */

export type PathCardProps = {
  title: string;
  description?: string;
  checkpoints: CheckpointNodeProps[];
  badge?: string;
  className?: string;
};

/**
 * PathCard — a named path section card containing a PathRail of checkpoints.
 * Uses shadcn Card for consistent surface treatment.
 */
function PathCard({
  title,
  description,
  checkpoints,
  badge,
  className,
}: PathCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold text-text-primary">
            {title}
          </CardTitle>
          {badge ? (
            <Badge className="rounded-pill bg-primary-soft text-primary-soft-foreground">
              {badge}
            </Badge>
          ) : null}
        </div>
        {description ? (
          <p className="text-sm text-text-secondary">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">
        <PathRail checkpoints={checkpoints} />
      </CardContent>
    </Card>
  );
}

export { PathCard };
