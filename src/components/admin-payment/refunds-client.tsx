"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
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
import { RefundDetailSheet } from "@/components/admin-payment/refund-detail-sheet";
import { toast } from "@/components/shared/feedback/toast";
import type { RefundRecord } from "@/features/admin-payment";

export type RefundsClientProps = {
  refunds: RefundRecord[];
};

export function RefundsClient({ refunds }: RefundsClientProps) {
  const [selected, setSelected] = React.useState<RefundRecord | null>(null);

  const pendingCount = refunds.filter((r) => r.status === "requested").length;
  const approvedCount = refunds.filter((r) => r.status === "approved").length;
  const processedCount = refunds.filter((r) => r.status === "processed").length;
  const rejectedCount = refunds.filter((r) => r.status === "rejected").length;

  function handleApprove() {
    if (!selected) return;
    toast.success(`Đã duyệt hoàn tiền cho ${selected.user}`);
    setSelected(null);
  }

  function handleReject() {
    if (!selected) return;
    toast.error(`Đã từ chối yêu cầu hoàn tiền của ${selected.user}`);
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Hoàn tiền"
        description="Quản lý yêu cầu và xử lý hoàn tiền"
      />

      <PaymentStatCards
        items={[
          {
            label: "Chờ duyệt",
            value: pendingCount,
            icon: <Clock className="size-5" aria-hidden />,
            colorClass: "text-warning",
          },
          {
            label: "Đã duyệt",
            value: approvedCount,
            icon: <CheckCircle2 className="size-5" aria-hidden />,
            colorClass: "text-success-foreground",
          },
          {
            label: "Đã hoàn",
            value: processedCount,
            icon: <AlertCircle className="size-5" aria-hidden />,
            colorClass: "text-primary",
          },
          {
            label: "Từ chối",
            value: rejectedCount,
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
                <TableHead className="pl-4">Mã</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày yêu cầu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(row)}
                >
                  <TableCell className="pl-4">
                    <code className="font-mono text-xs text-text-secondary">
                      {row.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-text-primary">{row.user}</div>
                    <div className="text-xs text-text-muted">{row.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-text-primary">
                      {row.amount}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[180px]">
                    <span className="text-sm text-text-secondary line-clamp-1">
                      {row.reason}
                    </span>
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.requested}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <RefundDetailSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        refund={selected}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
