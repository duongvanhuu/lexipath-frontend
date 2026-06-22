import type * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trang chủ" };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
