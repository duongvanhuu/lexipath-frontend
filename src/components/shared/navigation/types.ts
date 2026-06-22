import type * as React from "react";
import type { Route } from "next";

import type { LexiButtonVariant } from "@/components/shared/lexi-button";

/**
 * A single navigation entry. `href` renders a `next/link`; omit it and pass
 * `onClick` for controlled, route-less navigation (e.g. tab switching).
 * Active state is resolved by the shell comparing `id` to its `activeNavId`.
 */
export type NavItem = {
  id: string;
  label: string;
  href?: Route;
  /** Leading icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
};

/** A labelled group of nav items — used by the admin sidebar. */
export type NavSection = {
  id?: string;
  label?: string;
  items: NavItem[];
};

/**
 * Lightweight, presentational view of the signed-in user. Shells never fetch
 * this — the page passes it down. `initials` falls back to the first letter of
 * `name` when not provided.
 */
export type UserSummary = {
  id?: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  initials?: string;
};

/**
 * A header / CTA action descriptor. Renders as a `next/link` when `href` is set,
 * otherwise a button driven by `onClick`.
 */
export type ShellAction = {
  id?: string;
  label: string;
  href?: Route;
  onClick?: () => void;
  /** Leading icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  variant?: LexiButtonVariant;
  external?: boolean;
  disabled?: boolean;
};

/** First-letter fallback initials for an avatar. */
export function getInitials(user: Pick<UserSummary, "name" | "initials">): string {
  if (user.initials) return user.initials;
  const trimmed = user.name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}
