"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  AlarmClock,
  BarChart3,
  BookOpen,
  FileText,
  Home,
  NotebookPen,
  Search,
} from "lucide-react";

import { useCurrentUser, useLogoutMutation } from "@/features/auth";
import { LexiLogo } from "@/features/marketing";
import { LearnerAppShell } from "@/components/layouts/learner-app-shell";
import {
  MOCK_LEARNING_PROFILES,
} from "@/components/layouts/learner-language-switcher";
import { MOCK_NOTIFICATIONS } from "@/components/layouts/learner-notification-panel";
import type { NavItem } from "@/components/shared/navigation";
import type { UserStats } from "@/components/layouts/learner-chrome";

const LEARNER_NAV: NavItem[] = [
  {
    id: "home",
    label: "Trang chủ",
    icon: <Home aria-hidden />,
    href: "/dashboard" as Route,
  },
  {
    id: "learn",
    label: "Học từ vựng",
    icon: <BookOpen aria-hidden />,
    href: "/collections" as Route,
  },
  {
    id: "review",
    label: "Ôn tập",
    icon: <AlarmClock aria-hidden />,
    href: "/golden-time" as Route,
  },
  {
    id: "notebook",
    label: "Sổ tay",
    icon: <NotebookPen aria-hidden />,
    href: "/notebook" as Route,
  },
  {
    id: "dictionary",
    label: "Từ điển",
    icon: <Search aria-hidden />,
    href: "/dictionary" as Route,
  },
  {
    id: "exams",
    label: "Kho đề",
    icon: <FileText aria-hidden />,
    href: "/exams" as Route,
  },
  {
    id: "stats",
    label: "Thống kê",
    icon: <BarChart3 aria-hidden />,
    href: "/stats" as Route,
  },
];

const MOCK_USER_STATS: UserStats = {
  streak: 12,
  xp: 1240,
};

function getActiveNavId(pathname: string): string {
  if (pathname === "/dashboard" || pathname === "/") return "home";
  if (pathname.startsWith("/collections") || pathname.startsWith("/vocab")) return "learn";
  if (pathname.startsWith("/golden-time") || pathname.startsWith("/review")) return "review";
  if (pathname.startsWith("/notebook")) return "notebook";
  if (pathname.startsWith("/dictionary")) return "dictionary";
  if (pathname.startsWith("/exams")) return "exams";
  if (pathname.startsWith("/stats")) return "stats";
  return "";
}

export function LearnerShellProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const logout = useLogoutMutation();

  const userSummary = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        ...(user.avatarUrl !== undefined ? { avatarUrl: user.avatarUrl } : {}),
      }
    : { name: "…" };

  return (
    <LearnerAppShell
      logo={<LexiLogo />}
      homeHref={"/dashboard" as Route}
      navItems={LEARNER_NAV}
      activeNavId={getActiveNavId(pathname)}
      user={userSummary}
      userStats={MOCK_USER_STATS}
      learningProfiles={MOCK_LEARNING_PROFILES}
      activeLanguage="ja"
      notifications={MOCK_NOTIFICATIONS}
      goldenTime={{ count: 5, href: "/golden-time" as Route }}
      onSignOut={() => logout.mutate()}
    >
      {children}
    </LearnerAppShell>
  );
}
