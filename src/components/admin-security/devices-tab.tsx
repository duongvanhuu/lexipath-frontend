"use client";

import * as React from "react";
import {
  Monitor,
  MoreVertical,
  Shield,
  ShieldOff,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/badges/status-badge";
import { toast } from "@/components/shared/feedback/toast";
import type { DeviceRecord } from "@/features/admin-security";
import { cn } from "@/lib/utils/cn";

const DEVICE_ICON: Record<string, React.ReactNode> = {
  desktop: <Monitor className="size-5" aria-hidden />,
  mobile: <Smartphone className="size-5" aria-hidden />,
  tablet: <Tablet className="size-5" aria-hidden />,
};

export function DevicesTab({ initialDevices }: { initialDevices: DeviceRecord[] }) {
  const [devices, setDevices] = React.useState(initialDevices);

  function toggleTrust(id: string) {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, trusted: !d.trusted } : d))
    );
    toast.success("Đã cập nhật trạng thái tin cậy");
  }

  function removeDevice(id: string, name: string) {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    toast.success(`Đã xóa thiết bị ${name}`);
  }

  return (
    <Card className="p-0 overflow-hidden">
      <ul role="list" className="divide-y divide-border">
        {devices.map((d) => (
          <li
            key={d.id}
            className="flex items-center gap-3.5 px-4 py-3.5"
          >
            <span
              className={cn(
                "inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-text-muted"
              )}
            >
              {DEVICE_ICON[d.type]}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-text-primary">
                  {d.name}
                </span>
                {d.trusted ? (
                  <StatusBadge status="info" dot>
                    Tin cậy
                  </StatusBadge>
                ) : (
                  <StatusBadge status="warning" dot>
                    Chưa tin cậy
                  </StatusBadge>
                )}
              </div>
              <div className="mt-0.5 text-xs text-text-muted">
                {d.user} · {d.os} · {d.browser}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-xs text-text-secondary">{d.sessions} phiên</div>
              <div className="text-xs text-text-muted">Lần cuối: {d.lastSeen}</div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Tùy chọn cho ${d.name}`}
                >
                  <MoreVertical className="size-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleTrust(d.id)}>
                  {d.trusted ? (
                    <ShieldOff className="mr-2 size-4" aria-hidden />
                  ) : (
                    <Shield className="mr-2 size-4" aria-hidden />
                  )}
                  {d.trusted ? "Bỏ tin cậy" : "Đánh dấu tin cậy"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-danger-foreground focus:text-danger-foreground"
                  onClick={() => removeDevice(d.id, d.name)}
                >
                  <Trash2 className="mr-2 size-4" aria-hidden />
                  Xóa thiết bị
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </Card>
  );
}
