"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { BookOpen, GraduationCap, NotebookPen } from "lucide-react";

import { useCurrentUser, useLogoutMutation } from "@/features/auth";
import { LexiLogo } from "@/features/marketing";
import { LearnerAppShell } from "@/components/layouts/learner-app-shell";
import type { NavItem } from "@/components/shared/navigation";

const LEARNER_NAV: NavItem[] = [
  {
    id: "vocabulary",
    label: "Từ vựng",
    icon: <BookOpen aria-hidden />,
    href: "/vocabulary" as Route,
  },
  {
    id: "learning",
    label: "Học",
    icon: <GraduationCap aria-hidden />,
    href: "/learning" as Route,
  },
  {
    id: "notebook",
    label: "Sổ tay",
    icon: <NotebookPen aria-hidden />,
    href: "/notebook" as Route,
  },
];

const ACCOUNT_ACTIONS = [
  { id: "profile", label: "Hồ sơ", href: "/profile" as Route },
  { id: "settings", label: "Cài đặt", href: "/settings" as Route },
];

function getActiveNavId(pathname: string): string {
  if (pathname.startsWith("/vocabulary")) return "vocabulary";
  if (pathname.startsWith("/learning")) return "learning";
  if (pathname.startsWith("/notebook")) return "notebook";
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
      accountActions={ACCOUNT_ACTIONS}
      onSignOut={() => logout.mutate()}
    >
      {children}
    </LearnerAppShell>
  );
}
