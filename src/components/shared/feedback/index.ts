/**
 * Feedback & state surfaces — empty / error / loading / locked / permission
 * states, confirmation dialogs, status badges and toast helpers. Built on the
 * shadcn primitives (Card/Button/Badge/AlertDialog/Skeleton/Sonner) + LexiPath
 * tokens. None of these fetch data — pages drive them from query state.
 */

/* Types */
export { type StatusVariant, type EmptyStateAction } from "./types";

/* States */
export { EmptyState, type EmptyStateProps } from "./empty-state";
export { ErrorState, type ErrorStateProps } from "./error-state";
export {
  LoadingSkeleton,
  type LoadingSkeletonProps,
  type LoadingSkeletonVariant,
} from "./loading-skeleton";
export {
  DisabledActionState,
  type DisabledActionStateProps,
  type DisabledActionHelp,
} from "./disabled-action-state";
export {
  LockedFeatureState,
  type LockedFeatureStateProps,
} from "./locked-feature-state";
export {
  PermissionDeniedState,
  type PermissionDeniedStateProps,
} from "./permission-denied-state";

/* Dialogs */
export { ConfirmDialog, type ConfirmDialogProps } from "./confirm-dialog";
export {
  UnsavedChangesDialog,
  type UnsavedChangesDialogProps,
} from "./unsaved-changes-dialog";

/* Toasts (sonner) */
export {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  toast,
  type ToastOptions,
} from "./toast";
export { Toaster } from "@/components/ui/sonner";

/* Status badges (canonical implementations live in ../badges) */
export {
  StatusBadge,
  type StatusBadgeProps,
  type LexiStatus,
  ContentStatusBadge,
  CONTENT_LABELS,
  type ContentStatus,
  type ContentStatusBadgeProps,
  PaymentStatusBadge,
  PAYMENT_LABELS,
  type PaymentStatus,
  type PaymentStatusBadgeProps,
  EntitlementBadge,
  TIER_LABELS,
  type EntitlementTier,
  type EntitlementBadgeProps,
} from "@/components/shared/badges";
