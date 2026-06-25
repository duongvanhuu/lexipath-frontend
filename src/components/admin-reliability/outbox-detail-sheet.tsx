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
import { ReliabilityStatusBadge } from "@/components/admin-reliability/reliability-status-badge";
import { cn } from "@/lib/utils/cn";
import type { OutboxEvent } from "@/features/admin-reliability";

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

export type OutboxDetailSheetProps = {
  open: boolean;
  onClose: () => void;
  event: OutboxEvent | null;
  onRetry?: () => void;
};

export function OutboxDetailSheet({
  open,
  onClose,
  event,
  onRetry,
}: OutboxDetailSheetProps) {
  if (!event) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[500px]">
        <SheetHeader className="pb-2">
          <SheetTitle>
            <code className="font-mono text-base">{event.event}</code>
          </SheetTitle>
          <SheetDescription>
            {event.aggregate} · <code className="font-mono text-xs">{event.aggregateId}</code>
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-2">
          <KVRow label="Loại sự kiện" mono>
            {event.event}
          </KVRow>
          <KVRow label="Aggregate">{event.aggregate}</KVRow>
          <KVRow label="Aggregate ID" mono>
            {event.aggregateId}
          </KVRow>
          <KVRow label="Trạng thái">
            <ReliabilityStatusBadge status={event.status} />
          </KVRow>
          <KVRow label="Số lần thử">
            <span className={event.attempts > 1 ? "text-danger-foreground" : undefined}>
              {event.attempts}
            </span>
          </KVRow>
          <KVRow label="Tạo lúc">{event.created}</KVRow>

          {event.lastError ? (
            <div className="mt-4 rounded-xl bg-danger-soft p-3 text-sm text-danger-foreground">
              <strong>Lỗi cuối:</strong> {event.lastError}
            </div>
          ) : null}

          {event.payload ? (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
                Payload
              </p>
              <pre className="overflow-x-auto rounded-xl bg-zinc-900 p-4 font-mono text-xs leading-relaxed text-gray-200">
                <code>{event.payload}</code>
              </pre>
            </div>
          ) : null}
        </div>

        {event.status === "failed" && onRetry ? (
          <SheetFooter>
            <Button variant="default" size="sm" onClick={onRetry}>
              <RefreshCw className="mr-1.5 size-3.5" aria-hidden />
              Thử lại sự kiện
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
