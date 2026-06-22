import * as React from "react";

import { LexiButton, type LexiButtonProps } from "./lexi-button";

/**
 * IconButton — square, icon-only action. Merges the prototype `IconButton`
 * into the shadcn Button via `size="icon"`. An accessible `label` is required
 * and is wired to both `aria-label` and `title`.
 */
export type IconButtonProps = Omit<
  LexiButtonProps,
  "iconLeft" | "iconRight" | "fullWidth" | "children" | "aria-label"
> & {
  /** Accessible name for the icon-only button (required for a11y). */
  label: string;
  /** The icon to render — use a `lucide-react` icon. */
  children: React.ReactNode;
};

function IconButton({
  label,
  variant = "ghost",
  size = "icon",
  children,
  ...props
}: IconButtonProps) {
  return (
    <LexiButton
      variant={variant}
      size={size}
      aria-label={label}
      title={label}
      {...props}
    >
      {children}
    </LexiButton>
  );
}

export { IconButton };
