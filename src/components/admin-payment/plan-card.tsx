import * as React from "react";
import { Check, Pencil, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/admin-payment/payment-status-badge";
import type { SubscriptionPlan } from "@/features/admin-payment";

export type PlanCardProps = {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
};

export function PlanCard({ plan, onEdit }: PlanCardProps) {
  return (
    <Card className="flex flex-col gap-0">
      <CardContent className="flex flex-col gap-4 pt-5 pb-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-text-primary">{plan.name}</h3>
            <code className="mt-0.5 block text-xs text-text-muted font-mono">
              {plan.code}
            </code>
          </div>
          <PaymentStatusBadge status={plan.status} />
        </div>

        <div>
          <span className="text-xl font-bold text-text-primary">{plan.price}</span>
          {plan.interval !== "—" && (
            <span className="ml-1 text-sm text-text-secondary">/ {plan.interval}</span>
          )}
        </div>

        <ul className="flex flex-col gap-1.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-success-soft text-success-foreground">
                <Check className="size-2.5" aria-hidden />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Users className="size-3.5" aria-hidden />
            <span>{plan.subscribers.toLocaleString("vi-VN")} người</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(plan)}
            aria-label={`Chỉnh sửa gói ${plan.name}`}
          >
            <Pencil className="mr-1.5 size-3.5" aria-hidden />
            Chỉnh sửa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
