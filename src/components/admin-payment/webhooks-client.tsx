"use client";

import * as React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layouts/page-header";
import { PaymentStatCards } from "@/components/admin-payment/payment-stat-cards";
import { PaymentStatusBadge } from "@/components/admin-payment/payment-status-badge";
import { WebhookDetailSheet } from "@/components/admin-payment/webhook-detail-sheet";
import { toast } from "@/components/shared/feedback/toast";
import { cn } from "@/lib/utils/cn";
import type { WebhookEvent } from "@/features/admin-payment";

export type WebhooksClientProps = {
  webhooks: WebhookEvent[];
  payload: string;
};

export function WebhooksClient({ webhooks, payload }: WebhooksClientProps) {
  const [selected, setSelected] = React.useState<WebhookEvent | null>(null);

  const processedCount = webhooks.filter((w) => w.status === "processed").length;
  const pendingCount = webhooks.filter((w) => w.status === "received").length;
  const failedCount = webhooks.filter((w) => w.status === "failed").length;

  function handleRetry() {
    if (!selected) return;
    toast.success(`Đã gửi lại webhook: ${selected.event}`);
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Webhook"
        description="Theo dõi sự kiện từ các cổng thanh toán"
      />

      <PaymentStatCards
        items={[
          {
            label: "Đã xử lý",
            value: processedCount,
            icon: <CheckCircle2 className="size-5" aria-hidden />,
            colorClass: "text-success-foreground",
          },
          {
            label: "Chờ / mới nhận",
            value: pendingCount,
            icon: <Clock className="size-5" aria-hidden />,
            colorClass: "text-primary",
          },
          {
            label: "Thất bại",
            value: failedCount,
            icon: <XCircle className="size-5" aria-hidden />,
            colorClass: "text-danger-foreground",
          },
        ]}
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Sự kiện</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Số lần</TableHead>
                <TableHead>Nhận lúc</TableHead>
                <TableHead>Tham chiếu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(row)}
                >
                  <TableCell className="pl-4">
                    <code className="font-mono text-xs text-text-secondary">
                      {row.event}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.provider}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        row.attempts > 1
                          ? "text-danger-foreground"
                          : "text-text-secondary"
                      )}
                    >
                      {row.attempts}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.received}
                  </TableCell>
                  <TableCell>
                    <code className="font-mono text-xs text-text-muted">
                      {row.ref}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <WebhookDetailSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        webhook={selected}
        payload={payload}
        onRetry={handleRetry}
      />
    </div>
  );
}
