import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type PaymentStatItem = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
};

export type PaymentStatCardsProps = {
  items: PaymentStatItem[];
};

export function PaymentStatCards({ items }: PaymentStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <span
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted",
                item.colorClass
              )}
            >
              {item.icon}
            </span>
            <div>
              <p className="text-2xl font-semibold leading-none text-text-primary">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-text-secondary">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
