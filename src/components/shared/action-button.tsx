import * as React from "react";
import Link from "next/link";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import {
  resolveLexiButtonVariant,
  type LexiButtonVariant,
} from "./lexi-button";

/**
 * Structural shape shared by `ShellAction` / `EmptyStateAction`. Lets feedback
 * and layout components render an action without each re-implementing the
 * link-vs-button + LexiPath tone logic.
 */
export type ActionDescriptor = {
  label: string;
  /** Render as a `next/link` when set; otherwise a `<button>` using `onClick`. */
  href?: Route;
  onClick?: (() => void) | undefined;
  /** Leading icon — use a `lucide-react` icon. */
  icon?: React.ReactNode;
  variant?: LexiButtonVariant;
  external?: boolean;
  disabled?: boolean;
};

export type ActionButtonProps = {
  action: ActionDescriptor;
  size?: React.ComponentProps<typeof Button>["size"];
  fullWidth?: boolean;
  className?: string;
};

/**
 * ActionButton — renders an action descriptor as a LexiPath-toned button or,
 * when `href` is set, a `next/link` styled as a button (via `asChild`).
 */
function ActionButton({ action, size, fullWidth, className }: ActionButtonProps) {
  const {
    label,
    href,
    onClick,
    icon,
    variant = "primary",
    external,
    disabled,
  } = action;
  const { base, tone } = resolveLexiButtonVariant(variant);
  const classes = cn(tone, fullWidth && "w-full", className);

  if (href && !disabled) {
    return (
      <Button asChild variant={base} size={size} className={classes}>
        <Link
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {icon}
          {label}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant={base}
      size={size}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {label}
    </Button>
  );
}

export { ActionButton };
