import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { PublishWorkflowStep } from "./types";

export interface PublishWorkflowBarProps {
  steps: PublishWorkflowStep[];
  onAction?: (stepId: string) => void;
  actionLabel?: string;
  className?: string;
}

function dotClass(status: PublishWorkflowStep["status"]): string {
  switch (status) {
    case "active":
      return "bg-primary animate-pulse";
    case "done":
      return "bg-success";
    case "error":
      return "bg-destructive";
    default:
      return "bg-muted-foreground/40";
  }
}

function labelClass(status: PublishWorkflowStep["status"]): string {
  switch (status) {
    case "active":
      return "text-foreground font-medium";
    case "error":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

export function PublishWorkflowBar({
  steps,
  onAction,
  actionLabel,
  className,
}: PublishWorkflowBarProps) {
  const activeStep = steps.find((s) => s.status === "active");

  return (
    <div className={cn("flex items-center flex-wrap gap-y-2", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn("size-3 rounded-full inline-block shrink-0", dotClass(step.status))}
              aria-hidden="true"
            />
            <span className={cn("text-xs whitespace-nowrap", labelClass(step.status))}>
              {step.status === "done" && (
                <Check className="size-3 inline-block mr-0.5 -mt-px" aria-hidden="true" />
              )}
              {step.label}
            </span>
          </div>

          {/* Connector line (not after last step) */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-px min-w-4 w-6 bg-border mx-2 shrink-0" />
          )}
        </div>
      ))}

      {onAction && actionLabel && activeStep && (
        <div className="ml-3">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onAction(activeStep.id)}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
