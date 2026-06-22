import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { Plan } from "./types";

export interface PlanComparisonCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSelect?: (id: string) => void;
}

function PlanComparisonCard({
  plan,
  isCurrentPlan = false,
  onSelect,
}: PlanComparisonCardProps) {
  const {
    id,
    name,
    priceLabel,
    billingCycleLabel,
    description,
    features,
    highlighted = false,
    ctaLabel = "Chọn gói",
    badge,
  } = plan;

  return (
    <Card
      className={cn(
        "relative flex flex-col",
        highlighted && "ring-2 ring-primary"
      )}
    >
      {(highlighted || badge) ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-0.5 text-xs font-semibold">
            {badge ?? "Phổ biến"}
          </Badge>
        </div>
      ) : null}

      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div>
          <span className="text-2xl font-bold text-text-primary">
            {priceLabel}
          </span>
          {billingCycleLabel ? (
            <span className="ml-1 text-sm text-muted-foreground">
              {billingCycleLabel}
            </span>
          ) : null}
        </div>

        <ul className="flex flex-col gap-2" aria-label={`Tính năng của gói ${name}`}>
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-success-foreground"
                aria-hidden
              />
              <span className="text-text-secondary">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          variant={highlighted ? "default" : "outline"}
          disabled={isCurrentPlan}
          aria-label={
            isCurrentPlan
              ? `Đang dùng gói ${name}`
              : `${ctaLabel} ${name}`
          }
          onClick={() => onSelect?.(id)}
        >
          {isCurrentPlan ? "Gói hiện tại" : ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

export { PlanComparisonCard };
