"use client";

import * as React from "react";
import { LockOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/badges/status-badge";
import { ConfirmDialog } from "@/components/shared/feedback/confirm-dialog";
import { toast } from "@/components/shared/feedback/toast";
import type { AccountLockRecord } from "@/features/admin-security";

function LockTypeBadge({ type }: { type: "auto" | "manual" }) {
  return (
    <StatusBadge status={type === "auto" ? "neutral" : "info"}>
      {type === "auto" ? "Tự động" : "Thủ công"}
    </StatusBadge>
  );
}

function LockStatusBadge({ status }: { status: "active" | "released" }) {
  return (
    <StatusBadge status={status === "active" ? "danger" : "success"} dot>
      {status === "active" ? "Đang khóa" : "Đã mở"}
    </StatusBadge>
  );
}

export function LocksTab({ locks }: { locks: AccountLockRecord[] }) {
  const [releaseTarget, setReleaseTarget] = React.useState<AccountLockRecord | null>(
    null
  );

  const activeCount = locks.filter((l) => l.status === "active").length;

  function handleRelease(record: AccountLockRecord) {
    toast.success(`Đã mở khóa tài khoản ${record.user}`);
    setReleaseTarget(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {activeCount > 0 ? (
        <div className="rounded-xl border border-danger/25 bg-danger-soft px-4 py-3">
          <p className="text-sm font-medium text-danger-foreground">
            {activeCount} tài khoản đang bị khóa. Xem lại lý do trước khi mở khóa.
          </p>
        </div>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Tài khoản</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Kiểu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Khóa lúc</TableHead>
                <TableHead>Bởi</TableHead>
                <TableHead className="pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {locks.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="pl-4">
                    <div className="font-medium text-text-primary">{row.user}</div>
                    <div className="text-xs text-text-muted">{row.email}</div>
                  </TableCell>
                  <TableCell className="max-w-[180px]">
                    <span className="text-sm text-text-secondary line-clamp-2">
                      {row.reason}
                    </span>
                  </TableCell>
                  <TableCell>
                    <LockTypeBadge type={row.type} />
                  </TableCell>
                  <TableCell>
                    <LockStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.lockedAt}
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {row.by}
                  </TableCell>
                  <TableCell className="pr-4">
                    {row.status === "active" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReleaseTarget(row)}
                      >
                        <LockOpen className="mr-1.5 size-3.5" aria-hidden />
                        Mở khóa
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ConfirmDialog
        open={!!releaseTarget}
        onOpenChange={(v) => !v && setReleaseTarget(null)}
        title="Mở khóa tài khoản?"
        description={
          releaseTarget
            ? `Tài khoản ${releaseTarget.user} (${releaseTarget.email}) sẽ có thể đăng nhập trở lại ngay.`
            : undefined
        }
        confirmLabel="Mở khóa"
        onConfirm={() => releaseTarget && handleRelease(releaseTarget)}
      />
    </div>
  );
}
