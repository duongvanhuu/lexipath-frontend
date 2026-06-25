import * as React from "react";
import { cn } from "@/lib/utils/cn";
import type { ExamProgramStatus } from "../types/exam-programs.types";

interface ProgramStatusDotProps {
  status: ExamProgramStatus;
  className?: string;
}

export function ProgramStatusDot({ status, className }: ProgramStatusDotProps) {
  const isActive = status === "active";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        isActive ? "text-success-foreground" : "text-text-muted",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block size-1.5 rounded-full",
          isActive ? "bg-success-foreground" : "bg-text-muted",
        )}
        aria-hidden
      />
      {isActive ? "Hoạt động" : "Tạm dừng"}
    </span>
  );
}
