import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  statusBadgeVariants,
  type LexiStatus,
  type StatusBadgeVariantProps,
} from "@/lib/styles/variants";
import { cn } from "@/lib/utils/cn";

export type StatusBadgeProps = Omit<
  React.ComponentProps<typeof Badge>,
  "variant"
> &
  StatusBadgeVariantProps & {
    /** Show a leading status dot. */
    dot?: boolean;
  };

/**
 * StatusBadge — soft (or solid) status pill built on the shadcn `Badge` using
 * the canonical `statusBadgeVariants`. For domain enums prefer the dedicated
 * `ContentStatusBadge` / `PaymentStatusBadge` / `EntitlementBadge`.
 */
function StatusBadge({
  status = "neutral",
  solid = false,
  dot = false,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      className={cn(statusBadgeVariants({ status, solid }), className)}
      {...props}
    >
      {dot ? (
        <span
          className="size-1.5 rounded-full bg-current opacity-80"
          aria-hidden
        />
      ) : null}
      {children}
    </Badge>
  );
}

export { StatusBadge, type LexiStatus };
