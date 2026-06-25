"use client";

import * as React from "react";
import { RefreshCw, Send, Clock, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/page-header";
import { ReliabilityStatCards } from "@/components/admin-reliability/reliability-stat-cards";
import { ReliabilityStatusBadge } from "@/components/admin-reliability/reliability-status-badge";
import { OutboxDetailSheet } from "@/components/admin-reliability/outbox-detail-sheet";
import { ConfirmDialog } from "@/components/shared/feedback/confirm-dialog";
import { toast } from "@/components/shared/feedback/toast";
import type { OutboxEvent } from "@/features/admin-reliability";

export type OutboxClientProps = {
  events: OutboxEvent[];
};

export function OutboxClient({ events }: OutboxClientProps) {
  const [selected, setSelected] = React.useState<OutboxEvent | null>(null);
  const [retryTarget, setRetryTarget] = React.useState<OutboxEvent | null>(null);

  const failed = events.filter((e) => e.status === "failed");

  function handleRetryAll() {
    toast.success(`Đã đưa ${failed.length} sự kiện vào hàng chờ thử lại`);
  }

  function handleRetryConfirm() {
    toast.success(
      `Đã đưa sự kiện ${retryTarget?.event ?? ""} vào hàng chờ thử lại`
    );
    setRetryTarget(null);
  }

  function openRetryFromSheet() {
    if (!selected) return;
    setRetryTarget(selected);
    setSelected(null);
  }

  function openRetryFromRow(e: React.MouseEvent, row: OutboxEvent) {
    e.stopPropagation();
    setRetryTarget(row);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Outbox events"
        description={`${events.length} sự kiện — bảng outbox_events`}
      />

      <ReliabilityStatCards
        items={[
          {
            label: "Đã đẩy",
            value: events.filter((e) => e.status === "published").length,
            icon: <Send className="size-5" aria-hidden />,
            colorClass: "text-primary",
          },
          {
            label: "Chờ đẩy",
            value: events.filter((e) => e.status === "pending").length,
            icon: <Clock className="size-5" aria-hidden />,
            colorClass: "text-info-foreground",
          },
          {
            label: "Thất bại",
            value: failed.length,
            icon: <TriangleAlert className="size-5" aria-hidden />,
            colorClass: "text-danger-foreground",
          },
        ]}
      />

      {failed.length > 0 ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-danger bg-danger-soft p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-danger">
              <TriangleAlert className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-danger-foreground">
                {failed.length} sự kiện chưa đẩy được
              </p>
              <p className="text-xs text-danger-foreground/80">
                Người tiêu thụ có thể đang gặp sự cố. Thử lại sau khi kiểm tra.
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="shrink-0"
            onClick={handleRetryAll}
          >
            <RefreshCw className="mr-1.5 size-3.5" aria-hidden />
            Thử lại tất cả
          </Button>
        </div>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Sự kiện</TableHead>
                <TableHead>Aggregate</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lần thử</TableHead>
                <TableHead>Tạo lúc</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(row)}
                >
                  <TableCell className="pl-4">
                    <code className="font-mono text-xs font-semibold">
                      {row.event}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.aggregate}{" "}
                    <code className="font-mono text-xs text-text-muted">
                      {row.aggregateId}
                    </code>
                  </TableCell>
                  <TableCell>
                    <ReliabilityStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        row.attempts > 1
                          ? "text-sm font-medium text-danger-foreground"
                          : "text-sm text-text-secondary"
                      }
                    >
                      {row.attempts}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.created}
                  </TableCell>
                  <TableCell>
                    {row.status === "failed" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => openRetryFromRow(e, row)}
                      >
                        Thử lại
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <OutboxDetailSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        event={selected}
        onRetry={openRetryFromSheet}
      />

      <ConfirmDialog
        open={!!retryTarget}
        onOpenChange={(v) => !v && setRetryTarget(null)}
        title="Thử lại sự kiện?"
        description={
          retryTarget
            ? `Sự kiện ${retryTarget.event} (${retryTarget.aggregateId}) sẽ được đưa lại vào hàng chờ để đẩy đến người tiêu thụ.`
            : undefined
        }
        confirmLabel="Thử lại"
        onConfirm={handleRetryConfirm}
      />
    </div>
  );
}
