import type { Metadata } from "next";
import type * as React from "react";

import { AdminShellProvider } from "./admin-shell-provider";

export const metadata: Metadata = {
  title: { template: "%s | Admin — LexiPath", default: "Admin — LexiPath" },
  robots: { index: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShellProvider>{children}</AdminShellProvider>;
}
