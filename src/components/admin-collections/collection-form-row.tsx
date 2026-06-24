import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CollectionFormRowProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function CollectionFormRow({
  label,
  required,
  hint,
  children,
  className,
}: CollectionFormRowProps) {
  return (
    <div className={cn("mb-3.5", className)}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
        {required && (
          <span className="ml-0.5 text-destructive" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-[11px] text-text-muted">{hint}</p>
      )}
    </div>
  );
}
