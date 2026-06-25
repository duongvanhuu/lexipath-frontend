"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
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
import type { WebhookEvent } from "@/features/admin-payment";

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

export type WebhookDetailSheetProps = {
  open: boolean;
  onClose: () => void;
  webhook: WebhookEvent | null;
  payload: string;
  onRetry?: () => void;
};

export function WebhookDetailSheet({
  open,
  onClose,
  webhook,
  payload,
  onRetry,
}: WebhookDetailSheetProps) {
  if (!webhook) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[500px] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle>
            <code className="font-mono text-sm">{webhook.event}</code>
          </SheetTitle>
          <SheetDescription>
            {webhook.provider} · {webhook.received}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-2">
          <KVRow label="Loại sự kiện" mono>
            {webhook.event}
          </KVRow>
          <KVRow label="Nhà cung cấp">{webhook.provider}</KVRow>
          <KVRow label="Trạng thái">
            <PaymentStatusBadge status={webhook.status} />
          </KVRow>
          <KVRow label="Số lần thử">{webhook.attempts}</KVRow>
          <KVRow label="Tham chiếu" mono>
            {webhook.ref}
          </KVRow>
          <KVRow label="Nhận lúc">{webhook.received}</KVRow>

          <Separator className="my-4" />

          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
            Payload
          </p>
          <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-xs font-mono overflow-x-auto leading-relaxed">
            <code>{payload}</code>
          </pre>
        </div>

        {webhook.status === "failed" && onRetry ? (
          <SheetFooter>
            <Button size="sm" onClick={onRetry}>
              <RefreshCw className="mr-1.5 size-3.5" aria-hidden />
              Gửi lại
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
