"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
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
import type { PaymentOrder, PaymentTransaction } from "@/features/admin-payment";

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

export type OrderDetailSheetProps = {
  open: boolean;
  onClose: () => void;
  order: PaymentOrder | null;
  transactions: PaymentTransaction[];
  onRefund?: () => void;
};

export function OrderDetailSheet({
  open,
  onClose,
  order,
  transactions,
  onRefund,
}: OrderDetailSheetProps) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[500px] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle>Chi tiết giao dịch</SheetTitle>
          <SheetDescription>
            <code className="font-mono text-xs">{order.code}</code>
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-2">
          <KVRow label="Khách hàng">
            <div className="text-right">
              <div>{order.user}</div>
              <div className="text-xs text-text-muted">{order.email}</div>
            </div>
          </KVRow>
          <KVRow label="Sản phẩm">{order.item}</KVRow>
          <KVRow label="Số tiền">
            <span className="font-bold">{order.amount}</span>
          </KVRow>
          <KVRow label="Trạng thái">
            <PaymentStatusBadge status={order.status} />
          </KVRow>
          <KVRow label="Phương thức">{order.method}</KVRow>
          <KVRow label="Tạo lúc">{order.created}</KVRow>

          {transactions.length > 0 && (
            <>
              <Separator className="my-4" />
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
                Giao dịch
              </p>
              <div className="flex flex-col gap-3">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="rounded-lg border border-border p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-text-primary">
                        {txn.type}
                      </span>
                      <PaymentStatusBadge status={txn.status} />
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-text-secondary">
                      <div className="flex items-center justify-between gap-2">
                        <span>Mã TXN</span>
                        <code className="font-mono">{txn.code}</code>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span>Số tiền</span>
                        <span className="font-medium text-text-primary">
                          {txn.amount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span>{txn.gateway}</span>
                        <code className="font-mono text-text-muted">
                          {txn.gatewayRef}
                        </code>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span>Thời gian</span>
                        <span>{txn.at}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {order.status === "success" && onRefund ? (
          <SheetFooter>
            <Button
              variant="outline"
              size="sm"
              className="text-danger-foreground border-danger/30 hover:bg-danger-soft"
              onClick={onRefund}
            >
              <RotateCcw className="mr-1.5 size-3.5" aria-hidden />
              Hoàn tiền
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
