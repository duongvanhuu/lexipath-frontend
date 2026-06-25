"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  BookOpen,
  ClipboardList,
  CreditCard,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Library,
  Package,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ShoppingCart,
  Star,
  Users,
  Webhook,
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
        id: "admin-exam-programs",
        label: "Chương trình thi",
        icon: <Library aria-hidden />,
        href: "/admin/exams/programs" as Route,
      },
      {
        id: "admin-exam-blueprints",
        label: "Blueprints",
        icon: <Layers aria-hidden />,
        href: "/admin/exams/blueprints" as Route,
      },
      {
        id: "admin-exam",
        label: "Tạo đề thi",
        icon: <GraduationCap aria-hidden />,
        href: "/admin/exams/test-builder" as Route,
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
        label: "Thang điểm",
        icon: <ShieldCheck aria-hidden />,
        href: "/admin/exams/scoring" as Route,
      },
    ],
  },
  {
    id: "payment",
    label: "Thanh toán",
    items: [
      {
        id: "admin-payment-plans",
        label: "Gói dịch vụ",
        icon: <Package aria-hidden />,
        href: "/admin/payments/plans" as Route,
      },
      {
        id: "admin-payment-subscriptions",
        label: "Đăng ký",
        icon: <CreditCard aria-hidden />,
        href: "/admin/payments/subscriptions" as Route,
      },
      {
        id: "admin-payment-orders",
        label: "Đơn hàng",
        icon: <ShoppingCart aria-hidden />,
        href: "/admin/payments/orders" as Route,
      },
      {
        id: "admin-payment-webhooks",
        label: "Webhook",
        icon: <Webhook aria-hidden />,
        href: "/admin/payments/webhooks" as Route,
      },
      {
        id: "admin-payment-refunds",
        label: "Hoàn tiền",
        icon: <RotateCcw aria-hidden />,
        href: "/admin/payments/refunds" as Route,
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
      {
        id: "admin-roles",
        label: "Vai trò",
        icon: <ShieldCheck aria-hidden />,
        href: "/admin/roles" as Route,
      },
      {
        id: "admin-security",
        label: "Bảo mật",
        icon: <ShieldAlert aria-hidden />,
        href: "/admin/security" as Route,
      },
    ],
  },
];

function getActiveNavId(pathname: string): string {
  if (pathname === "/admin") return "admin-dashboard";
  if (pathname.startsWith("/admin/vocab")) return "admin-vocab";
  if (pathname.startsWith("/admin/collections")) return "admin-collections";
  if (pathname.startsWith("/admin/exams/question-bank")) return "admin-questions";
  if (pathname.startsWith("/admin/exams/test-builder")) return "admin-exam";
  if (pathname.startsWith("/admin/exams/programs")) return "admin-exam-programs";
  if (pathname.startsWith("/admin/exams/blueprints")) return "admin-exam-blueprints";
  if (pathname.startsWith("/admin/exam")) return "admin-exam";
  if (pathname.startsWith("/admin/review")) return "admin-review";
  if (pathname.startsWith("/admin/exams/scoring")) return "admin-scoring";
  if (pathname.startsWith("/admin/roles")) return "admin-roles";
  if (pathname.startsWith("/admin/users")) return "admin-users";
  if (pathname.startsWith("/admin/security")) return "admin-security";
  if (pathname.startsWith("/admin/payments/plans")) return "admin-payment-plans";
  if (pathname.startsWith("/admin/payments/subscriptions")) return "admin-payment-subscriptions";
  if (pathname.startsWith("/admin/payments/orders")) return "admin-payment-orders";
  if (pathname.startsWith("/admin/payments/webhooks")) return "admin-payment-webhooks";
  if (pathname.startsWith("/admin/payments/refunds")) return "admin-payment-refunds";
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
