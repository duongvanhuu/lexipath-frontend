"use client";

import * as React from "react";
import { Download } from "lucide-react";
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
import { PaymentStatusBadge } from "@/components/admin-payment/payment-status-badge";
import { OrderDetailSheet } from "@/components/admin-payment/order-detail-sheet";
import { toast } from "@/components/shared/feedback/toast";
import type { PaymentOrder, PaymentTransaction } from "@/features/admin-payment";

export type OrdersClientProps = {
  orders: PaymentOrder[];
  transactionsMap: Record<string, PaymentTransaction[]>;
};

export function OrdersClient({ orders, transactionsMap }: OrdersClientProps) {
  const [selected, setSelected] = React.useState<PaymentOrder | null>(null);

  function handleRefund() {
    if (!selected) return;
    toast.success(`Đã gửi yêu cầu hoàn tiền cho đơn ${selected.code}`);
    setSelected(null);
  }

  function handleExportCsv() {
    toast.info("Đang xuất file CSV...");
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Đơn hàng"
        description="Lịch sử giao dịch và thanh toán"
        actions={[
          {
            id: "export-csv",
            label: "Xuất CSV",
            icon: <Download className="size-4" aria-hidden />,
            variant: "outline",
            onClick: handleExportCsv,
          },
        ]}
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((row) => (
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
                  <TableCell className="text-sm text-text-secondary">
                    {row.item}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-text-primary">
                      {row.amount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.method}
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.created}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <OrderDetailSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        order={selected}
        transactions={selected ? (transactionsMap[selected.id] ?? []) : []}
        onRefund={handleRefund}
      />
    </div>
  );
}
