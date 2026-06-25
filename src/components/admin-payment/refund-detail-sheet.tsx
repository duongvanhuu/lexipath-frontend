"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PaymentStatusBadge } from "@/components/admin-payment/payment-status-badge";
import { cn } from "@/lib/utils/cn";
import type { RefundRecord } from "@/features/admin-payment";

function KVRow({
  label,
  children,
  mono = false,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="shrink-0 text-sm text-text-secondary">{label}</span>
      <span
        className={cn(
          "break-all text-right text-sm font-medium",
          mono && "font-mono text-xs"
        )}
      >
        {children}
      </span>
    </div>
  );
}

export type RefundDetailSheetProps = {
  open: boolean;
  onClose: () => void;
  refund: RefundRecord | null;
  onApprove?: () => void;
  onReject?: () => void;
};

export function RefundDetailSheet({
  open,
  onClose,
  refund,
  onApprove,
  onReject,
}: RefundDetailSheetProps) {
  if (!refund) return null;

  const isActionable = refund.status === "requested";

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[460px] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle>Yêu cầu hoàn tiền</SheetTitle>
          <SheetDescription>
            <code className="font-mono text-xs">{refund.code}</code>
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 py-3">
            <PaymentStatusBadge status={refund.status} />
          </div>

          <Separator className="mb-3" />

          <KVRow label="Khách hàng">
            <div className="text-right">
              <div>{refund.user}</div>
              <div className="text-xs text-text-muted">{refund.email}</div>
            </div>
          </KVRow>
          <KVRow label="Đơn gốc" mono>
            {refund.order}
          </KVRow>
          <KVRow label="Số tiền">
            <span className="font-bold">{refund.amount}</span>
          </KVRow>
          <KVRow label="Lý do">{refund.reason}</KVRow>
          <KVRow label="Người yêu cầu">{refund.by}</KVRow>
          <KVRow label="Ngày yêu cầu">{refund.requested}</KVRow>
        </div>

        {isActionable && (onReject ?? onApprove) ? (
          <SheetFooter>
            {onReject ? (
              <Button
                variant="outline"
                size="sm"
                className="text-danger-foreground border-danger/30 hover:bg-danger-soft"
                onClick={onReject}
              >
                <XCircle className="mr-1.5 size-3.5" aria-hidden />
                Từ chối
              </Button>
            ) : null}
            {onApprove ? (
              <Button size="sm" onClick={onApprove}>
                <CheckCircle2 className="mr-1.5 size-3.5" aria-hidden />
                Duyệt hoàn tiền
              </Button>
            ) : null}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
