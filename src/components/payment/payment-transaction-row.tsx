import * as React from "react";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/badges/status-badge";
import type { LexiStatus } from "@/components/shared/badges/status-badge";
import type { PaymentTransaction } from "./types";

export interface PaymentTransactionRowProps {
  transaction: PaymentTransaction;
  onViewInvoice?: (id: string) => void;
}

const STATUS_TO_LEXI: Record<PaymentTransaction["status"], LexiStatus> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "neutral",
};

const STATUS_LABELS: Record<PaymentTransaction["status"], string> = {
  paid: "Đã thanh toán",
  pending: "Chờ thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
};

function PaymentTransactionRow({
  transaction,
  onViewInvoice,
}: PaymentTransactionRowProps) {
  const { id, amountLabel, status, description, createdAtLabel, invoiceUrl } =
    transaction;

  return (
    <TableRow>
      <TableCell className="text-sm text-text-secondary">
        {createdAtLabel}
      </TableCell>

      <TableCell className="max-w-[200px] truncate text-sm text-text-primary">
        {description ?? "—"}
      </TableCell>

      <TableCell className="text-sm font-semibold text-text-primary tabular-nums">
        {amountLabel}
      </TableCell>

      <TableCell>
        <StatusBadge status={STATUS_TO_LEXI[status]}>
          {STATUS_LABELS[status]}
        </StatusBadge>
      </TableCell>

      <TableCell>
        {invoiceUrl ? (
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Xem hóa đơn cho giao dịch ${createdAtLabel}`}
            onClick={() => onViewInvoice?.(id)}
            asChild
          >
            <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" aria-hidden />
              Hóa đơn
            </a>
          </Button>
        ) : (
          <span className="text-sm text-text-muted">—</span>
        )}
      </TableCell>
    </TableRow>
  );
}

export { PaymentTransactionRow };
