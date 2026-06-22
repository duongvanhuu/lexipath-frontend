import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

/**
 * Payment / transaction status. Presentational mapper only — callers translate
 * their Spring Boot payment enum to one of these keys (DTO mapping lives in the
 * payment feature, not here).
 */
export const paymentStatusBadgeVariants = cva("", {
  variants: {
    status: {
      paid: "bg-success-soft text-success-foreground",
      pending: "bg-warning-soft text-warning-foreground",
      failed: "bg-danger-soft text-danger-foreground",
      refunded: "bg-primary-soft text-primary-soft-foreground",
      canceled: "bg-surface-muted text-text-muted",
    },
  },
  defaultVariants: {
    status: "pending",
  },
});

export type PaymentStatus = NonNullable<
  VariantProps<typeof paymentStatusBadgeVariants>["status"]
>;

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  paid: "Đã thanh toán",
  pending: "Chờ thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
  canceled: "Đã hủy",
};

export type PaymentStatusBadgeProps = Omit<
  React.ComponentProps<typeof Badge>,
  "variant" | "children"
> & {
  status: PaymentStatus;
  /** Override the default Vietnamese label. */
  children?: React.ReactNode;
};

function PaymentStatusBadge({
  status,
  className,
  children,
  ...props
}: PaymentStatusBadgeProps) {
  return (
    <Badge
      className={cn(paymentStatusBadgeVariants({ status }), className)}
      {...props}
    >
      {children ?? PAYMENT_LABELS[status]}
    </Badge>
  );
}

export { PaymentStatusBadge, PAYMENT_LABELS };
