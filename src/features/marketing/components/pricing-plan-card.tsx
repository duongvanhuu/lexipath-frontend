import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import type { PricingPlan } from "../types/marketing.types";

export type PricingPlanCardProps = {
  plan: PricingPlan;
  className?: string;
};

/**
 * PricingPlanCard — a pricing tier with feature list and CTA. The `isPopular`
 * tier inverts to the brand surface and floats a golden "Phổ biến nhất" badge.
 * Marketing only — the in-app upgrade prompt uses `PlanComparisonCard`.
 */
function PricingPlanCard({ plan, className }: PricingPlanCardProps) {
  const {
    name,
    price,
    period = "/tháng",
    features,
    ctaLabel,
    ctaHref,
    isPopular = false,
    isFree = false,
  } = plan;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-5 rounded-card border p-6",
        isPopular
          ? "border-primary bg-primary text-primary-foreground shadow-pop"
          : "border-border bg-card text-card-foreground",
        className
      )}
    >
      {isPopular ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-golden-strong px-3.5 py-0.5 text-xs font-bold whitespace-nowrap text-white">
          Phổ biến nhất
        </span>
      ) : null}

      <div className="flex flex-col gap-2">
        <span
          className={cn(
            "text-base font-semibold",
            isPopular ? "text-primary-foreground" : "text-text-primary"
          )}
        >
          {name}
        </span>
        <span className="flex items-baseline gap-1">
          <span className="font-heading text-4xl font-bold">
            {isFree ? "Miễn phí" : price}
          </span>
          {!isFree ? (
            <span
              className={cn(
                "text-sm",
                isPopular ? "text-primary-foreground/70" : "text-text-muted"
              )}
            >
              {period}
            </span>
          ) : null}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full",
                isPopular
                  ? "bg-white/20 text-primary-foreground"
                  : "bg-success-soft text-success-foreground"
              )}
            >
              <Check className="size-2.5" aria-hidden />
            </span>
            <span
              className={cn(
                "text-sm leading-snug",
                isPopular ? "text-primary-foreground/90" : "text-text-secondary"
              )}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        size="lg"
        className={cn(
          "mt-auto w-full",
          isPopular
            ? "bg-card text-primary hover:bg-card/90"
            : "bg-primary text-primary-foreground hover:bg-primary-hover"
        )}
      >
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}

export { PricingPlanCard };
