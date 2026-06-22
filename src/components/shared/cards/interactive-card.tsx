import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import { cardToneVariants, type LexiCardTone } from "./card-variants";

/**
 * Shared surface for a clickable card. Mirrors the shadcn `Card` look but on a
 * real interactive element (`button` / `Link`) so we never ship a clickable
 * `div` (LexiPath a11y rule). Includes keyboard focus styling.
 */
const interactiveCardBase =
  "group/card relative flex w-full flex-col gap-3 overflow-hidden rounded-xl bg-card p-4 text-left text-sm text-card-foreground ring-1 ring-foreground/10 outline-none transition-shadow hover:shadow-card focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-60";

type InteractiveCardBaseProps = {
  tone?: LexiCardTone;
  /** Marks the current path step / focused card with the brand glow ring. */
  current?: boolean;
  className?: string;
  children: React.ReactNode;
};

type InteractiveCardLinkProps = InteractiveCardBaseProps & {
  href: React.ComponentProps<typeof Link>["href"];
} & Omit<
    React.ComponentProps<typeof Link>,
    "href" | "className" | "children"
  >;

type InteractiveCardButtonProps = InteractiveCardBaseProps & {
  href?: undefined;
} & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

export type InteractiveCardProps =
  | InteractiveCardLinkProps
  | InteractiveCardButtonProps;

/**
 * InteractiveCard — a fully clickable card rendered as a `next/link` (when
 * `href` is provided) or a `button`. Use for "open detail", "continue lesson",
 * "select collection" surfaces.
 */
function InteractiveCard({
  tone = "default",
  current = false,
  className,
  children,
  ...props
}: InteractiveCardProps) {
  const classes = cn(
    interactiveCardBase,
    cardToneVariants({ tone }),
    current && "ring-2 ring-primary/40",
    className
  );

  if (props.href !== undefined) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} data-tone={tone} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props;
  return (
    <button type={type} data-tone={tone} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

export { InteractiveCard };
