"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  BookOpen,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { useCurrentUser } from "@/features/auth";
import { LexiLogo } from "@/features/marketing";
import { AdminShell } from "@/components/layouts/admin-shell";
import type { NavSection } from "@/components/shared/navigation";

const ADMIN_NAV: NavSection[] = [
  {
    id: "overview",
    items: [
      {
        id: "admin-dashboard",
        label: "Tổng quan",
        icon: <LayoutDashboard aria-hidden />,
        href: "/admin" as Route,
      },
    ],
  },
  {
    id: "content",
    label: "Nội dung",
    items: [
      {
        id: "admin-vocab",
        label: "Từ vựng",
        icon: <BookOpen aria-hidden />,
        href: "/admin/vocab" as Route,
      },
      {
        id: "admin-collections",
        label: "Bộ sưu tập",
        icon: <Star aria-hidden />,
        href: "/admin/collections" as Route,
      },
      {
        id: "admin-exam",
        label: "Bài thi",
        icon: <GraduationCap aria-hidden />,
        href: "/admin/exam" as Route,
      },
      {
        id: "admin-questions",
        label: "Câu hỏi",
        icon: <FileQuestion aria-hidden />,
        href: "/admin/exams/question-bank" as Route,
      },
    ],
  },
  {
    id: "review",
    label: "Xét duyệt",
    items: [
      {
        id: "admin-review",
        label: "Duyệt nội dung",
        icon: <ClipboardList aria-hidden />,
        href: "/admin/review" as Route,
      },
      {
        id: "admin-scoring",
        label: "Chấm điểm",
        icon: <ShieldCheck aria-hidden />,
        href: "/admin/scoring" as Route,
      },
    ],
  },
  {
    id: "system",
    label: "Hệ thống",
    items: [
      {
        id: "admin-users",
        label: "Người dùng",
        icon: <Users aria-hidden />,
        href: "/admin/users" as Route,
      },
    ],
  },
];

function getActiveNavId(pathname: string): string {
  if (pathname === "/admin") return "admin-dashboard";
  if (pathname.startsWith("/admin/vocab")) return "admin-vocab";
  if (pathname.startsWith("/admin/collections")) return "admin-collections";
  if (pathname.startsWith("/admin/exams/question-bank")) return "admin-questions";
  if (pathname.startsWith("/admin/exam")) return "admin-exam";
  if (pathname.startsWith("/admin/review")) return "admin-review";
  if (pathname.startsWith("/admin/scoring")) return "admin-scoring";
  if (pathname.startsWith("/admin/users")) return "admin-users";
  return "";
}

export function AdminShellProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();

  const userSummary = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        ...(user.avatarUrl !== undefined ? { avatarUrl: user.avatarUrl } : {}),
      }
    : undefined;

  return (
    <AdminShell
      logo={<LexiLogo />}
      sections={ADMIN_NAV}
      activeNavId={getActiveNavId(pathname)}
      {...(userSummary !== undefined ? { user: userSummary } : {})}
    >
      {children}
    </AdminShell>
  );
}
