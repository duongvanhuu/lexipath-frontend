/**
 * LexiPath layout shells. Pick the shell by surface:
 * - `LearnerAppShell`     — signed-in learner pages (top header, no sidebar).
 * - `FocusLearningShell`  — distraction-free learning sessions.
 * - `MarketingShell`      — public marketing / pricing / FAQ pages.
 * - `AdminShell`          — internal / admin tools (dark left sidebar).
 *
 * Shells never fetch data — pages pass nav items, the active id, the user
 * summary and action descriptors down.
 */

export { LearnerAppShell, type LearnerAppShellProps } from "./learner-app-shell";
export {
  FocusLearningShell,
  type FocusLearningShellProps,
} from "./focus-learning-shell";
export { MarketingShell, type MarketingShellProps } from "./marketing-shell";
export { AdminShell, type AdminShellProps } from "./admin-shell";
export { PageHeader, type PageHeaderProps } from "./page-header";

export {
  type LearnerChrome,
  type LanguageOption,
  type GoldenTimeSummary,
  type NotificationSummary,
} from "./learner-chrome";

/* Re-exported for convenience when composing shells. */
export {
  Breadcrumb,
  NavTabs,
  type NavItem,
  type NavSection,
  type UserSummary,
  type ShellAction,
} from "@/components/shared/navigation";
