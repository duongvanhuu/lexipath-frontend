"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Bell,
  Languages,
  ChevronRight,
  BadgeCheck,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EntitlementBadge } from "@/components/shared/badges";
import { ProfileHeroCard } from "@/components/profile/profile-hero-card";
import { ProfileLearningStats } from "@/components/profile/profile-learning-stats";
import { ProfileLangProfilesSection } from "@/components/profile/profile-lang-profiles-section";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { cn } from "@/lib/utils/cn";
import {
  MOCK_USER_PROFILE,
  MOCK_LANG_PROFILES,
  MOCK_PROFILE_STATS,
} from "@/features/profile";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
      {children}
    </h2>
  );
}

function NavShortcutRow({
  href,
  iconBg,
  icon,
  label,
  description,
}: {
  href: Route;
  iconBg: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10",
        "transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      )}
    >
      <span
        className={cn(
          "flex size-[38px] shrink-0 items-center justify-center rounded-[10px]",
          iconBg
        )}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
      <ChevronRight
        className="size-4 shrink-0 text-text-muted"
        aria-hidden
      />
    </Link>
  );
}

export function ProfileClient() {
  const [editOpen, setEditOpen] = React.useState(false);

  const user = MOCK_USER_PROFILE;
  const stats = MOCK_PROFILE_STATS;
  const langProfiles = MOCK_LANG_PROFILES;
  const isPro = user.plan !== "free";

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Section 1: Hero card */}
        <ProfileHeroCard user={user} onEditClick={() => setEditOpen(true)} />

        {/* Section 2: Learning stats */}
        <ProfileLearningStats stats={stats} />

        <Separator />

        {/* Section 3: Language profiles */}
        <ProfileLangProfilesSection profiles={langProfiles} />

        <Separator />

        {/* Section 4: Settings shortcuts */}
        <section aria-labelledby="settings-heading">
          <div className="mb-3">
            <SectionLabel>Cài đặt</SectionLabel>
          </div>
          <div className="flex flex-col gap-2">
            <NavShortcutRow
              href={"/notifications" as Route}
              iconBg="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
              icon={<Bell className="size-4" />}
              label="Thông báo"
              description="Quản lý thông báo và nhắc nhở học"
            />
            <NavShortcutRow
              href={"/settings" as Route}
              iconBg="bg-primary-soft text-primary-soft-foreground"
              icon={<Languages className="size-4" />}
              label="Hồ sơ ngôn ngữ"
              description="Thêm và cấu hình ngôn ngữ học"
            />
          </div>
        </section>

        <Separator />

        {/* Section 5: Subscription */}
        <section aria-labelledby="subscription-heading">
          <div className="mb-3">
            <SectionLabel>Đăng ký</SectionLabel>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <span
              className={cn(
                "flex size-[38px] shrink-0 items-center justify-center rounded-[10px]",
                isPro
                  ? "bg-golden-soft text-golden-foreground"
                  : "bg-surface-muted text-text-secondary"
              )}
              aria-hidden
            >
              {isPro ? (
                <BadgeCheck className="size-4" />
              ) : (
                <Package className="size-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-text-primary">
                  {isPro ? "Pro" : "Gói miễn phí"}
                </p>
                <EntitlementBadge
                  tier={user.plan === "pro" ? "pro" : user.plan === "team" ? "premium" : "free"}
                />
              </div>
              <p className="text-xs text-text-muted">
                {isPro
                  ? "Truy cập không giới hạn mọi tính năng"
                  : "Nâng cấp để mở khóa toàn bộ tính năng"}
              </p>
            </div>
            <Button size="sm" variant={isPro ? "outline" : "default"} asChild>
              <Link href={"/subscription" as Route}>{isPro ? "Quản lý" : "Nâng cấp Pro"}</Link>
            </Button>
          </div>
        </section>

        <Separator />

        {/* Section 6: Security */}
        <section aria-labelledby="security-heading">
          <div className="mb-3">
            <SectionLabel>Bảo mật</SectionLabel>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <span
              className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-success-soft text-success-foreground"
              aria-hidden
            >
              <ShieldCheck className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text-primary">
                Tài khoản được bảo vệ
              </p>
              <p className="text-xs text-text-muted">
                4 phiên hoạt động · Đăng nhập gần nhất: hôm nay 08:15 · Chrome · Hà Nội
              </p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href={"/security" as Route}>Quản lý</Link>
            </Button>
          </div>
        </section>
      </div>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
      />
    </>
  );
}
