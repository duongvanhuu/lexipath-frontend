import type * as React from "react";
import type { Metadata } from "next";

import { LearnerShellProvider } from "./learner-shell-provider";

export const metadata: Metadata = {
  title: { template: "%s | LexiPath", default: "LexiPath" },
  description: "Vocabulary and exam learning platform",
};

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LearnerShellProvider>{children}</LearnerShellProvider>;
}
