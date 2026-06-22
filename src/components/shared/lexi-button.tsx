import * as React from "react";

import { Button } from "@/components/ui/button";
import { buttonToneVariants } from "@/lib/styles/variants";
import { cn } from "@/lib/utils/cn";

/**
 * LexiPath identity button. Layers the LexiPath variant set on top of the
 * shadcn `Button` primitive — it does not fork it. The four identity tones
 * (nextStep / golden / path / quiet) come from the canonical
 * `buttonToneVariants` cva in `@/lib/styles/variants`.
 *
 * Variant guidance (LexiPath identity rules):
 * - `primary`  — generic CTAs.
 * - `nextStep` — the #1 "next best step" action ("Tiếp tục học", "Ôn tập ngay").
 * - `golden`   — Golden Time CTAs ONLY.
 * - `path`     — path / journey navigation ("Xem lộ trình", "Tiếp theo").
 * - `quiet`    — secondary / cancel / close in the learner app.
 *
 * RULE: never use `primary` for the next-step CTA (use `nextStep`) or for
 * Golden Time (use `golden`).
 */
export type LexiButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "nextStep"
  | "golden"
  | "path"
  | "quiet";

type ShadcnButtonVariant = NonNullable<
  React.ComponentProps<typeof Button>["variant"]
>;

/** Map a LexiPath variant to a shadcn base variant + extra identity classes. */
export function resolveLexiButtonVariant(variant: LexiButtonVariant): {
  base: ShadcnButtonVariant;
  tone?: string;
} {
  switch (variant) {
    case "primary":
      return { base: "default" };
    case "secondary":
      return { base: "secondary" };
    case "outline":
      return { base: "outline" };
    case "ghost":
      return { base: "ghost" };
    case "danger":
      return {
        base: "default",
        tone: "border-transparent bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/30",
      };
    case "nextStep":
      return {
        base: "default",
        tone: cn(buttonToneVariants({ tone: "nextStep" }), "shadow-card"),
      };
    case "golden":
      return {
        base: "default",
        tone: cn(buttonToneVariants({ tone: "golden" }), "shadow-golden"),
      };
    case "path":
      return { base: "default", tone: buttonToneVariants({ tone: "path" }) };
    case "quiet":
      return { base: "ghost", tone: buttonToneVariants({ tone: "quiet" }) };
  }
}

export type LexiButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant"
> & {
  variant?: LexiButtonVariant;
  /** Icon rendered before the label (use a `lucide-react` icon). */
  iconLeft?: React.ReactNode;
  /** Icon rendered after the label (use a `lucide-react` icon). */
  iconRight?: React.ReactNode;
  /** Stretch the button to fill its container. */
  fullWidth?: boolean;
};

function LexiButton({
  variant = "primary",
  size,
  className,
  iconLeft,
  iconRight,
  fullWidth = false,
  children,
  ...props
}: LexiButtonProps) {
  const { base, tone } = resolveLexiButtonVariant(variant);

  return (
    <Button
      variant={base}
      size={size}
      className={cn(tone, fullWidth && "w-full", className)}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Button>
  );
}

export { LexiButton };
