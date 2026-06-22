import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Crown, Lock, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

/**
 * EntitlementBadge — the user's plan / access tier. `premium` uses the Golden
 * Time amber to signal the paid tier; `locked` flags gated content. Callers map
 * their entitlement DTO to a tier key.
 */
export const entitlementBadgeVariants = cva("", {
  variants: {
    tier: {
      free: "bg-surface-muted text-text-secondary",
      pro: "bg-primary-soft text-primary-soft-foreground",
      premium: "bg-golden-soft text-golden-foreground",
      locked: "bg-surface-muted text-text-muted",
    },
  },
  defaultVariants: {
    tier: "free",
  },
});

export type EntitlementTier = NonNullable<
  VariantProps<typeof entitlementBadgeVariants>["tier"]
>;

const TIER_LABELS: Record<EntitlementTier, string> = {
  free: "Miễn phí",
  pro: "Pro",
  premium: "Premium",
  locked: "Đã khóa",
};

const TIER_ICONS: Record<EntitlementTier, React.ComponentType<{ className?: string }>> = {
  free: Sparkles,
  pro: Sparkles,
  premium: Crown,
  locked: Lock,
};

export type EntitlementBadgeProps = Omit<
  React.ComponentProps<typeof Badge>,
  "variant" | "children"
> & {
  tier: EntitlementTier;
  /** Hide the leading tier icon. */
  hideIcon?: boolean;
  /** Override the default Vietnamese label. */
  children?: React.ReactNode;
};

function EntitlementBadge({
  tier,
  hideIcon = false,
  className,
  children,
  ...props
}: EntitlementBadgeProps) {
  const Icon = TIER_ICONS[tier];
  return (
    <Badge
      className={cn(entitlementBadgeVariants({ tier }), className)}
      {...props}
    >
      {hideIcon ? null : <Icon className="size-3" aria-hidden />}
      {children ?? TIER_LABELS[tier]}
    </Badge>
  );
}

export { EntitlementBadge, TIER_LABELS };
