import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type StatTileProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  tone?: "default" | "golden" | "success" | "danger";
  className?: string;
};

const VALUE_COLOR: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "text-text-primary",
  golden: "text-golden-foreground",
  success: "text-success-foreground",
  danger: "text-danger-foreground",
};

function StatTile({ label, value, icon, tone = "default", className }: StatTileProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex items-center gap-1.5">
        {icon ? (
          <span className="inline-flex shrink-0 text-text-muted [&_svg]:size-3.5">
            {icon}
          </span>
        ) : null}
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <span className={cn("text-xl font-bold leading-none", VALUE_COLOR[tone])}>
        {value}
      </span>
    </div>
  );
}

export { StatTile };
