import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type ProfileStatTileProps = {
  icon: React.ReactNode;
  scope: string;
  value: string;
  unit?: string;
  className?: string;
};

function ProfileStatTile({
  icon,
  scope,
  value,
  unit,
  className,
}: ProfileStatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-[12px] bg-surface-muted p-3",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {scope}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-extrabold text-text-primary leading-tight">
          {value}
        </span>
        {unit ? (
          <span className="text-xs text-text-secondary">{unit}</span>
        ) : null}
      </div>
    </div>
  );
}

export { ProfileStatTile };
