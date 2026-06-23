import * as React from "react";
import {
  Ban,
  CheckCircle2,
  Clock,
  RefreshCw,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/shared/badges/payment-status-badge";
import { cn } from "@/lib/utils/cn";
import type { SubscriptionPayment } from "@/features/subscription/types";

const STATUS_ICON: Record<
  SubscriptionPayment["status"],
  { Icon: React.ComponentType<{ className?: string }>; bg: string; color: string }
> = {
  success: {
    Icon: CheckCircle2,
    bg: "bg-success-soft",
    color: "text-success-foreground",
  },
  failed: {
    Icon: XCircle,
    bg: "bg-danger-soft",
    color: "text-danger-foreground",
  },
  pending: {
    Icon: Clock,
    bg: "bg-warning-soft",
    color: "text-warning-foreground",
  },
  refunded: {
    Icon: RotateCcw,
    bg: "bg-primary-soft",
    color: "text-primary-soft-foreground",
  },
  refund_pending: {
    Icon: RefreshCw,
    bg: "bg-warning-soft",
    color: "text-warning-foreground",
  },
  cancelled: {
    Icon: Ban,
    bg: "bg-surface-muted",
    color: "text-text-muted",
  },
};

export interface SubscriptionPaymentRowProps {
  payment: SubscriptionPayment;
  isLast?: boolean;
}

function SubscriptionPaymentRow({ payment, isLast }: SubscriptionPaymentRowProps) {
  const { plan, order, created, provider, amount, status } = payment;
  const config = STATUS_ICON[status];
  const { Icon, bg, color } = config;
  const isRefund = amount.startsWith("−");

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-[18px] py-[13px]",
        !isLast && "border-b"
      )}
    >
      <span
        className={cn(
          "flex size-[34px] shrink-0 items-center justify-center rounded-[10px]",
          bg,
          color
        )}
      >
        <Icon className="size-[15px]" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-medium text-text-primary">{plan}</span>
          <span className="text-xs text-text-muted">· {order}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-text-secondary">{created}</span>
          <span className="text-xs text-text-muted">·</span>
          <span className="text-xs text-text-secondary">{provider}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={cn(
            "text-sm font-bold tabular-nums",
            isRefund ? "text-danger-foreground" : "text-text-primary"
          )}
        >
          {amount}
        </span>
        <PaymentStatusBadge status={status} />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-auto shrink-0 px-1.5 py-1 text-xs font-semibold text-primary hover:text-primary"
        aria-label={`Xem chi tiết đơn ${order}`}
      >
        Xem chi tiết
      </Button>
    </div>
  );
}

export { SubscriptionPaymentRow };
