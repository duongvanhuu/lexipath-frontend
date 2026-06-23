"use client";

import * as React from "react";
import {
  BellRing,
  Lock,
  MonitorCheck,
  Shield,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/layouts/page-header";
import { DeviceCard } from "@/components/security/device-card";
import { SecurityEventRow } from "@/components/security/security-event-row";
import { MOCK_DEVICES, MOCK_SECURITY_EVENTS } from "@/features/security/mock-data";
import type { SecurityDevice } from "@/features/security/types";
import { cn } from "@/lib/utils/cn";

// ─── Section wrapper ─────────────────────────────────────────────────────────

interface SecSectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

function SecSection({ title, action, children }: SecSectionProps) {
  return (
    <div className="mb-7">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
          {title}
        </p>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Password section ─────────────────────────────────────────────────────────

interface PasswordSectionProps {
  changingPw: boolean;
  pwSaved: boolean;
  onStartChange: () => void;
  onCancel: () => void;
  onSave: () => void;
}

function PasswordSection({
  changingPw,
  pwSaved,
  onStartChange,
  onCancel,
  onSave,
}: PasswordSectionProps) {
  return (
    <SecSection title="Mật khẩu">
      <Card>
        {!changingPw ? (
          <div className="flex items-center gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success-soft text-primary-soft-foreground">
              <Lock className="size-5" aria-hidden />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">
                Mật khẩu
              </p>
              <p className="mt-0.5 text-xs text-text-secondary">
                Đã cập nhật 3 ngày trước
              </p>
            </div>
            {pwSaved && (
              <Badge className="bg-success-soft text-primary-soft-foreground">
                Đã lưu!
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={onStartChange}>
              Đổi mật khẩu
            </Button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {(
              [
                {
                  label: "Mật khẩu hiện tại",
                  placeholder: "••••••••",
                  id: "pw-current",
                },
                {
                  label: "Mật khẩu mới",
                  placeholder: "Tối thiểu 8 ký tự",
                  id: "pw-new",
                },
                {
                  label: "Xác nhận mật khẩu mới",
                  placeholder: "Nhập lại mật khẩu mới",
                  id: "pw-confirm",
                },
              ] as const
            ).map((f) => (
              <div key={f.id}>
                <label
                  htmlFor={f.id}
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  {f.label}
                </label>
                <Input id={f.id} type="password" placeholder={f.placeholder} />
              </div>
            ))}
            <div className="flex justify-end gap-2.5">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Hủy
              </Button>
              <Button size="sm" onClick={onSave}>
                Lưu mật khẩu
              </Button>
            </div>
          </div>
        )}
      </Card>
    </SecSection>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

function SecurityClient() {
  const [devices, setDevices] = React.useState<SecurityDevice[]>(MOCK_DEVICES);
  const [changingPw, setChangingPw] = React.useState(false);
  const [pwSaved, setPwSaved] = React.useState(false);
  const [loginAlerts, setLoginAlerts] = React.useState(true);
  const [revokeTarget, setRevokeTarget] =
    React.useState<SecurityDevice | null>(null);
  const [revokeAllOpen, setRevokeAllOpen] = React.useState(false);
  const [lockWarningDismissed, setLockWarningDismissed] = React.useState(false);

  const currentDevice = devices.find((d) => d.current);
  const otherDevices = devices.filter((d) => !d.current);

  function handleSavePw() {
    setChangingPw(false);
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2400);
  }

  function confirmRevoke() {
    if (!revokeTarget) return;
    setDevices((prev) => prev.filter((d) => d.id !== revokeTarget.id));
    setRevokeTarget(null);
  }

  function confirmRevokeAll() {
    setDevices((prev) => prev.filter((d) => d.current));
    setRevokeAllOpen(false);
  }

  function toggleTrusted(id: string) {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, trusted: !d.trusted } : d))
    );
  }

  return (
    <div className="mx-auto max-w-[700px]">
      <PageHeader
        title="Bảo mật"
        description="Mật khẩu, thiết bị đăng nhập và hoạt động tài khoản."
      />

      <div className="mt-6 space-y-0">
        {/* Account lock warning */}
        {!lockWarningDismissed && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-5 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-soft p-4"
          >
            <ShieldAlert
              className="mt-0.5 size-5 shrink-0 text-warning-foreground"
              aria-hidden
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-warning-foreground">
                Cảnh báo bảo mật
              </p>
              <p className="text-sm text-warning-foreground/80">
                Phát hiện 4 lần đăng nhập sai liên tiếp. Tài khoản sẽ tạm khóa
                nếu có thêm lần thử sai.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLockWarningDismissed(true)}
              aria-label="Đóng cảnh báo"
              className="shrink-0 rounded p-0.5 text-warning-foreground transition-colors hover:bg-warning/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        )}

        {/* Current session */}
        {currentDevice && (
          <SecSection title="Phiên hiện tại">
            <Card>
              <div className="flex items-center gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  <MonitorCheck className="size-5" aria-hidden />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">
                      {currentDevice.deviceName}
                    </span>
                    <Badge className="bg-primary-soft text-primary-soft-foreground text-xs">
                      Thiết bị này
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {[
                      currentDevice.locationLabel,
                      currentDevice.ipAddress,
                      currentDevice.sessionExpiryLabel,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
            </Card>
          </SecSection>
        )}

        {/* Password */}
        <PasswordSection
          changingPw={changingPw}
          pwSaved={pwSaved}
          onStartChange={() => setChangingPw(true)}
          onCancel={() => setChangingPw(false)}
          onSave={handleSavePw}
        />

        {/* Verification & alerts */}
        <SecSection title="Xác minh & cảnh báo">
          <Card className="py-0">
            {/* 2FA — coming soon */}
            <div className="flex items-center gap-3.5 border-b border-border px-4.5 py-3.5 opacity-60">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-surface-muted text-text-muted">
                <Shield className="size-4" aria-hidden />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">
                    Xác thực hai bước
                  </p>
                  <span className="rounded-full border border-border bg-surface-muted px-2 py-px text-[10px] font-semibold uppercase tracking-[0.04em] text-text-muted">
                    Sắp ra mắt
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-text-muted">
                  Bảo vệ tài khoản bằng TOTP — sẽ có trong bản cập nhật tới
                </p>
              </div>
              <Switch
                checked={false}
                onCheckedChange={() => {}}
                size="sm"
                disabled
                aria-label="Xác thực hai bước (chưa khả dụng)"
              />
            </div>
            {/* Login alerts */}
            <div className="flex items-center gap-3.5 px-4.5 py-3.5">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-[9px] transition-colors",
                  loginAlerts
                    ? "bg-primary-soft text-primary-soft-foreground"
                    : "bg-surface-muted text-text-muted"
                )}
              >
                <BellRing className="size-4" aria-hidden />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  Cảnh báo đăng nhập lạ
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Nhận email khi có thiết bị mới đăng nhập
                </p>
              </div>
              <Switch
                checked={loginAlerts}
                onCheckedChange={() => setLoginAlerts((v) => !v)}
                size="sm"
                aria-label="Cảnh báo đăng nhập lạ"
              />
            </div>
          </Card>
        </SecSection>

        {/* Devices */}
        <SecSection
          title="Thiết bị đăng nhập"
          action={
            otherDevices.length > 0 ? (
              <button
                type="button"
                onClick={() => setRevokeAllOpen(true)}
                className="text-sm font-semibold text-danger-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded"
              >
                Đăng xuất {otherDevices.length} thiết bị khác
              </button>
            ) : null
          }
        >
          <div className="space-y-2.5">
            {devices.map((d) => (
              <DeviceCard
                key={d.id}
                session={d}
                onRevoke={(id) =>
                  setRevokeTarget(devices.find((x) => x.id === id) ?? null)
                }
                onToggleTrusted={toggleTrusted}
              />
            ))}
          </div>
        </SecSection>

        {/* Security event timeline */}
        <SecSection title="Nhật ký hoạt động bảo mật">
          <Card className="py-0">
            {MOCK_SECURITY_EVENTS.map((ev, i) => (
              <div
                key={ev.id}
                className={cn(
                  "px-4.5",
                  i < MOCK_SECURITY_EVENTS.length - 1 && "border-b border-border"
                )}
              >
                <SecurityEventRow event={ev} />
              </div>
            ))}
          </Card>
        </SecSection>

        {/* Danger zone */}
        <SecSection title="Vùng nguy hiểm">
          <Card className="border-danger/20">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger-soft text-danger-foreground">
                <Trash2 className="size-5" aria-hidden />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-danger-foreground">
                  Xóa tài khoản
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu học tập. Không
                  thể hoàn tác.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-danger/30 text-danger-foreground hover:bg-danger-soft"
              >
                Xóa tài khoản
              </Button>
            </div>
          </Card>
        </SecSection>
      </div>

      {/* Revoke single device dialog */}
      <Dialog
        open={!!revokeTarget}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Đăng xuất thiết bị này?</DialogTitle>
            <DialogDescription>
              {revokeTarget?.deviceName} sẽ bị đăng xuất ngay lập tức và cần
              đăng nhập lại để tiếp tục sử dụng.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeTarget(null)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmRevoke}>
              Đăng xuất
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke all other devices dialog */}
      <Dialog
        open={revokeAllOpen}
        onOpenChange={(open) => !open && setRevokeAllOpen(false)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Đăng xuất tất cả thiết bị khác?</DialogTitle>
            <DialogDescription>
              {otherDevices.length} thiết bị (trừ thiết bị hiện tại) sẽ bị
              đăng xuất. Mọi phiên và refresh token sẽ bị thu hồi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeAllOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmRevokeAll}>
              Đăng xuất tất cả
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { SecurityClient };
