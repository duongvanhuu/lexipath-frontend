import * as React from "react";

import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* LearnerCanvas                                                               */
/* -------------------------------------------------------------------------- */

const MAX_WIDTH_CLASSES = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
} as const;

export type LearnerCanvasProps = {
  children: React.ReactNode;
  maxWidth?: keyof typeof MAX_WIDTH_CLASSES;
  className?: string;
};

/**
 * LearnerCanvas — thin page-level content wrapper that constrains content
 * width and provides consistent horizontal padding for learner pages.
 */
function LearnerCanvas({
  children,
  maxWidth = "lg",
  className,
}: LearnerCanvasProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8 py-6",
        MAX_WIDTH_CLASSES[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}

export { LearnerCanvas };
