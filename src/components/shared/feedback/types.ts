import type * as React from "react";
import type { Route } from "next";

import type { LexiButtonVariant } from "@/components/shared/lexi-button";
import type { LexiStatus } from "@/lib/styles/variants";

/**
 * Canonical status tones used across feedback surfaces (badges, banners,
 * dialog accents): success · warning · danger · info · golden · neutral.
 */
export type StatusVariant = LexiStatus;

/**
 * A call-to-action inside a feedback state (empty / error / locked …). Renders
 * as a `next/link` when `href` is set, otherwise a button via `onClick`.
 */
export type EmptyStateAction = {
  label: string;
  href?: Route;
  onClick?: () => void;
  /** Leading icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  variant?: LexiButtonVariant;
  external?: boolean;
  disabled?: boolean;
};
