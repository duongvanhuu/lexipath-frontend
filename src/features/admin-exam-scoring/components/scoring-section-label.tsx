import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface ScoringSectionLabelProps {
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export function ScoringSectionLabel({ children, right, className }: ScoringSectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-2.5 mb-3 mt-0.5", className)}>
      <span className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.06em] whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-border" />
      {right}
    </div>
  );
}
