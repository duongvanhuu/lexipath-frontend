"use client";

import * as React from "react";
import { AlertTriangle, Check, LogOut } from "lucide-react";
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
import { SecurityRiskBadge } from "@/components/admin-security/security-risk-badge";
import type { RiskLevel } from "@/features/admin-security";
import { cn } from "@/lib/utils/cn";

const RISK_SIGNALS: Record<RiskLevel, string[]> = {
  high: [
    "Đăng nhập từ quốc gia mới (Singapore)",
    "Vượt ngưỡng đăng nhập sai (5 lần)",
    "Thiết bị chưa được tin cậy",
  ],
  medium: [
    "Vị trí địa lý mới trong nước",
    "Thiết bị đã từng dùng trước đây",
  ],
  low: [
    "Thiết bị đã tin cậy",
    "Vị trí quen thuộc",
    "Không có dấu hiệu bất thường",
  ],
};

type KVRowProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function KVRow({ label, value, mono }: KVRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="shrink-0 text-sm text-text-secondary">{label}</span>
      <span
        className={cn(
          "break-all text-right text-sm font-medium",
          mono && "font-mono text-xs"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export type RiskDetailData = {
  user: string;
  email?: string | undefined;
  risk: RiskLevel;
  device?: string | undefined;
  ip?: string | undefined;
  location?: string | undefined;
  started?: string | undefined;
  lastActive?: string | undefined;
  current?: boolean | undefined;
};

export type RiskDetailSheetProps = {
  open: boolean;
  onClose: () => void;
  data: RiskDetailData | null;
  onRevoke?: (() => void) | undefined;
};

export function RiskDetailSheet({
  open,
  onClose,
  data,
  onRevoke,
}: RiskDetailSheetProps) {
  if (!data) return null;

  const signals = RISK_SIGNALS[data.risk];
  const signalIcon = data.risk === "low" ? "check" : "alert";

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[460px] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle>Hồ sơ rủi ro — {data.user}</SheetTitle>
          {data.email ? (
            <SheetDescription>{data.email}</SheetDescription>
          ) : null}
        </SheetHeader>

        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 py-3">
            <span className="text-sm text-text-secondary">Mức rủi ro:</span>
            <SecurityRiskBadge risk={data.risk} />
          </div>

          <Separator className="mb-3" />

          {data.device ? <KVRow label="Thiết bị" value={data.device} /> : null}
          {data.ip ? <KVRow label="Địa chỉ IP" value={data.ip} mono /> : null}
          {data.location ? <KVRow label="Vị trí" value={data.location} /> : null}
          {data.started ? <KVRow label="Bắt đầu" value={data.started} /> : null}
          {data.lastActive ? <KVRow label="Hoạt động cuối" value={data.lastActive} /> : null}

          <div className="mt-5 mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Tín hiệu rủi ro
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {signals.map((signal, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                <span
                  className={cn(
                    "inline-flex size-[22px] shrink-0 items-center justify-center rounded-md",
                    data.risk === "low"
                      ? "bg-success-soft text-success-foreground"
                      : data.risk === "high"
                        ? "bg-danger-soft text-danger-foreground"
                        : "bg-warning-soft text-warning-foreground"
                  )}
                >
                  {data.risk === "low" ? (
                    <Check className="size-3" aria-hidden />
                  ) : (
                    <AlertTriangle className="size-3" aria-hidden />
                  )}
                </span>
                <span className="text-text-secondary">{signal}</span>
              </div>
            ))}
          </div>
        </div>

        {!data.current && onRevoke ? (
          <SheetFooter>
            <Button
              variant="outline"
              size="sm"
              className="text-danger-foreground border-danger/30 hover:bg-danger-soft"
              onClick={onRevoke}
            >
              <LogOut className="mr-1.5 size-3.5" aria-hidden />
              Thu hồi phiên
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
