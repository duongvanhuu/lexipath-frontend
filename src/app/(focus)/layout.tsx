import type { Metadata } from "next";
import type * as React from "react";

/**
 * Focus route group — distraction-free learning sessions (lesson player,
 * flashcards, exam exercises). FocusLearningShell is composed by each page
 * rather than here because it needs session-specific props: onClose handler,
 * lesson title, and live progress that the layout can't provide.
 */

export const metadata: Metadata = {
  title: { template: "%s | LexiPath", default: "LexiPath" },
  robots: { index: false },
};

export default function FocusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
