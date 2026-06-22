import type { Metadata } from "next";
import type * as React from "react";

import { PublicHeader, PublicFooter } from "@/features/marketing";
import {
  HEADER_NAV,
  HEADER_ACTIONS,
  FOOTER_COLUMNS,
} from "@/features/marketing/constants/landing-content";

export const metadata: Metadata = {
  title: { template: "%s | LexiPath", default: "LexiPath" },
  description: "Vocabulary and exam learning platform",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicHeader navItems={HEADER_NAV} actions={HEADER_ACTIONS}>
      {children}
      <PublicFooter columns={FOOTER_COLUMNS} />
    </PublicHeader>
  );
}
