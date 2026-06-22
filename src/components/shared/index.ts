/**
 * Shared UI barrel — LexiPath wrappers built on top of the shadcn primitives in
 * `@/components/ui`. Import primitives directly from `@/components/ui/*`; import
 * the LexiPath-flavored wrappers from here.
 */

/* Buttons */
export {
  LexiButton,
  type LexiButtonProps,
  type LexiButtonVariant,
} from "./lexi-button";
export { IconButton, type IconButtonProps } from "./icon-button";
export {
  ActionButton,
  type ActionButtonProps,
  type ActionDescriptor,
} from "./action-button";

/* Navigation primitives (shells compose these) */
export * from "./navigation";

/* Cards */
export * from "./cards";

/* Badges */
export * from "./badges";

/* Progress ring (custom primitive, surfaced here for convenience) */
export {
  ProgressRing,
  type ProgressRingProps,
  type ProgressRingTone,
} from "@/components/ui/progress-ring";

/* Toast — sonner. Mount <Toaster /> once (see src/providers/toaster.tsx). */
export { toast } from "sonner";
export { Toaster } from "@/components/ui/sonner";
