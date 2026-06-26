"use client";

import * as React from "react";
import {
  AlarmClock,
  AlertCircle,
  BarChart3,
  Check,
  CreditCard,
  Flame,
  Info,
  MonitorDot,
  Package,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/page-header";
import { BrowserPermissionBanner } from "@/components/settings/browser-permission-banner";
import { NotificationToggleRow } from "@/components/settings/notification-toggle-row";
import { NotificationAccountRow } from "@/components/settings/notification-account-row";
import { NotificationLangScheduleRow } from "@/components/settings/notification-lang-schedule-row";
import type {
  AccountNotifState,
  BrowserPermState,
  LangScheduleState,
  NotificationPrefsState,
} from "@/features/settings/types";

const INITIAL_STATE: NotificationPrefsState = {
  goldenTime: true,
  dailyNew: true,
  streakWarn: true,
  weeklySummary: false,
  paymentStatus: { enabled: true, email: true, push: false },
  subChanges: { enabled: true, email: true, push: false },
  secEvents: { enabled: true, email: true, push: true },
  newDevice: { enabled: true, email: true, push: true },
  langSchedules: {
    ja: { enabled: true, time: "20:00" },
    en: { enabled: false, time: "08:00" },
    zh: { enabled: true, time: "07:30" },
  },
};

type SaveStatus = "idle" | "saving" | "success" | "error";

function SettingsClient() {
  const [prefs, setPrefs] = React.useState<NotificationPrefsState>(INITIAL_STATE);
  const [permState, setPermState] = React.useState<BrowserPermState>("default");
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>("idle");

  // --- Helpers ---
  function toggleLearning(key: keyof Pick<NotificationPrefsState, "goldenTime" | "dailyNew" | "streakWarn" | "weeklySummary">) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function updateAccount(
    key: keyof Pick<NotificationPrefsState, "paymentStatus" | "subChanges" | "secEvents" | "newDevice">,
    updater: (s: AccountNotifState) => AccountNotifState
  ) {
    setPrefs((p) => ({ ...p, [key]: updater(p[key]) }));
  }

  function updateLangSchedule(lang: string, patch: Partial<LangScheduleState>) {
    setPrefs((p) => {
      const existing: LangScheduleState = p.langSchedules[lang] ?? { enabled: false, time: "08:00" };
      const next: LangScheduleState = {
        enabled: patch.enabled !== undefined ? patch.enabled : existing.enabled,
        time: patch.time !== undefined ? patch.time : existing.time,
      };
      return {
        ...p,
        langSchedules: { ...p.langSchedules, [lang]: next },
      };
    });
  }

  function handleSave() {
    setSaveStatus("saving");
    setTimeout(() => {
      // Simulate success (swap to "error" to test error state)
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2400);
    }, 1200);
  }

  // --- Render ---
  return (
    <div className="mx-auto max-w-[620px]">
      <PageHeader
        title="Cài đặt thông báo"
        description="Quản lý nhắc nhở học tập, lịch học theo ngôn ngữ và thông báo tài khoản."
      />

      <BrowserPermissionBanner
        permState={permState}
        onGrant={() => setPermState("granted")}
        onDismiss={() => setPermState("denied")}
      />

      {/* Section: Learning reminders */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
        Nhắc nhở học tập
      </p>
      <Card className="py-0">
        <NotificationToggleRow
          icon={<AlarmClock className="size-4" />}
          checkedBgClass="bg-golden-soft"
          checkedIconClass="text-golden-foreground"
          label="Nhắc Golden Time"
          desc="Thông báo khi có từ đến hạn ôn tập"
          checked={prefs.goldenTime}
          onChange={() => toggleLearning("goldenTime")}
        />
        <NotificationToggleRow
          icon={<Sparkles className="size-4" />}
          checkedBgClass="bg-primary-soft"
          checkedIconClass="text-primary-soft-foreground"
          label="Nhắc từ mới hằng ngày"
          desc="Nhắc bắt đầu học từ mới theo mục tiêu đã đặt"
          checked={prefs.dailyNew}
          onChange={() => toggleLearning("dailyNew")}
        />
        <NotificationToggleRow
          icon={<Flame className="size-4" />}
          checkedBgClass="bg-surface-muted"
          checkedIconClass="text-[#EA580C]"
          label="Cảnh báo streak"
          desc="Nhắc nhở khi sắp mất chuỗi ngày học liên tiếp"
          checked={prefs.streakWarn}
          onChange={() => toggleLearning("streakWarn")}
        />
        <NotificationToggleRow
          icon={<BarChart3 className="size-4" />}
          checkedBgClass="bg-surface-muted"
          checkedIconClass="text-text-secondary"
          label="Tóm tắt học tập tuần"
          desc="Email tổng kết tiến độ và thành tích mỗi tuần"
          checked={prefs.weeklySummary}
          onChange={() => toggleLearning("weeklySummary")}
          isLast
        />
      </Card>

      {/* Section: Account notifications */}
      <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
        Thông báo tài khoản
      </p>
      <Card className="py-0">
        <NotificationAccountRow
          icon={<CreditCard className="size-4" />}
          checkedIconClass="text-primary-soft-foreground"
          label="Trạng thái thanh toán"
          desc="Thanh toán thành công, thất bại hoặc hoàn tiền"
          state={prefs.paymentStatus}
          onChange={(updater) => updateAccount("paymentStatus", updater)}
        />
        <NotificationAccountRow
          icon={<Package className="size-4" />}
          checkedIconClass="text-primary-soft-foreground"
          label="Thay đổi gói đăng ký"
          desc="Nâng cấp, hạ cấp hoặc gia hạn tự động"
          state={prefs.subChanges}
          onChange={(updater) => updateAccount("subChanges", updater)}
        />
        <NotificationAccountRow
          icon={<ShieldAlert className="size-4" />}
          checkedIconClass="text-[#EA580C]"
          label="Sự kiện bảo mật"
          desc="Đăng nhập thất bại nhiều lần, hoạt động đáng ngờ"
          state={prefs.secEvents}
          onChange={(updater) => updateAccount("secEvents", updater)}
        />
        <NotificationAccountRow
          icon={<MonitorDot className="size-4" />}
          checkedIconClass="text-text-secondary"
          label="Đăng nhập thiết bị mới"
          desc="Khi tài khoản đăng nhập từ thiết bị chưa từng dùng"
          state={prefs.newDevice}
          onChange={(updater) => updateAccount("newDevice", updater)}
          isLast
        />
      </Card>

      {/* Section: Language reminder schedule */}
      <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
        Lịch nhắc theo ngôn ngữ
      </p>
      <Card className="py-0">
        {(() => {
          const DEFAULT_SCHEDULE: LangScheduleState = { enabled: false, time: "08:00" };
          const jaSchedule = prefs.langSchedules["ja"] ?? DEFAULT_SCHEDULE;
          const enSchedule = prefs.langSchedules["en"] ?? DEFAULT_SCHEDULE;
          const zhSchedule = prefs.langSchedules["zh"] ?? DEFAULT_SCHEDULE;
          return (
            <>
              <NotificationLangScheduleRow
                flag="🇯🇵"
                langName="Tiếng Nhật"
                schedule={jaSchedule}
                onTimeChange={(t) => updateLangSchedule("ja", { time: t })}
                onToggle={() =>
                  updateLangSchedule("ja", { enabled: !jaSchedule.enabled })
                }
              />
              <NotificationLangScheduleRow
                flag="🇬🇧"
                langName="Tiếng Anh"
                schedule={enSchedule}
                onTimeChange={(t) => updateLangSchedule("en", { time: t })}
                onToggle={() =>
                  updateLangSchedule("en", { enabled: !enSchedule.enabled })
                }
              />
              <NotificationLangScheduleRow
                flag="🇨🇳"
                langName="Tiếng Trung"
                schedule={zhSchedule}
                onTimeChange={(t) => updateLangSchedule("zh", { time: t })}
                onToggle={() =>
                  updateLangSchedule("zh", { enabled: !zhSchedule.enabled })
                }
                isLast
              />
            </>
          );
        })()}
      </Card>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
        <Info className="size-3.5 shrink-0" />
        Lịch nhắc theo ngôn ngữ yêu cầu quyền thông báo đẩy từ trình duyệt.
      </p>

      {/* Save button */}
      <div className="mt-5">
        <Button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="min-w-[120px]"
        >
          {saveStatus === "saving" && (
            <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
          )}
          {saveStatus === "saving" && "Đang lưu…"}
          {saveStatus === "success" && (
            <>
              <Check className="size-3.5" />
              Đã lưu!
            </>
          )}
          {(saveStatus === "idle" || saveStatus === "error") && "Lưu cài đặt"}
        </Button>

        {saveStatus === "error" && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-danger-foreground">
            <AlertCircle className="size-4 shrink-0" />
            Không thể lưu. Vui lòng thử lại.
          </p>
        )}
      </div>
    </div>
  );
}

export { SettingsClient };
