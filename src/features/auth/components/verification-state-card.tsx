import * as React from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  MailCheck,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import type { VerificationState } from "../types/auth.types";

export type VerificationStateCardProps = {
  state?: VerificationState;
  email?: string;
  onResend?: () => void;
  onChangeEmail?: () => void;
  className?: string;
};

type StateConfig = {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  describe: (email: string) => string;
};

const STATE: Record<VerificationState, StateConfig> = {
  pending: {
    icon: Mail,
    iconClass: "bg-primary-soft text-primary-soft-foreground",
    title: "Xác minh email",
    describe: (email) => `Chúng tôi sẽ gửi mã xác minh đến ${email}.`,
  },
  sent: {
    icon: MailCheck,
    iconClass: "bg-primary-soft text-primary-soft-foreground",
    title: "Kiểm tra email",
    describe: (email) =>
      `Mã xác minh đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư.`,
  },
  verified: {
    icon: CheckCircle2,
    iconClass: "bg-success-soft text-success-foreground",
    title: "Đã xác minh",
    describe: () => "Email của bạn đã được xác minh thành công!",
  },
  expired: {
    icon: Clock,
    iconClass: "bg-warning-soft text-warning-foreground",
    title: "Mã đã hết hạn",
    describe: () => "Mã xác minh đã hết hạn. Vui lòng gửi lại.",
  },
};

/**
 * VerificationStateCard — email verification status during the auth flow:
 * pending / sent / verified / expired, with resend + change-email actions.
 */
function VerificationStateCard({
  state = "pending",
  email,
  onResend,
  onChangeEmail,
  className,
}: VerificationStateCardProps) {
  const config = STATE[state];
  const Icon = config.icon;
  const showResend = state === "sent" || state === "expired";
  const showChangeEmail = Boolean(onChangeEmail) && state !== "verified";

  return (
    <Card className={cn("items-center gap-0 p-8 text-center", className)}>
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-full",
          config.iconClass
        )}
      >
        <Icon className="size-7" aria-hidden />
      </span>
      <h2 className="mt-3 text-lg font-semibold text-text-primary">
        {config.title}
      </h2>
      <p className="mt-2 text-sm text-text-secondary">
        {config.describe(email ?? "email của bạn")}
      </p>

      {showResend || showChangeEmail ? (
        <div className="mt-5 flex items-center justify-center gap-2">
          {showResend ? (
            <Button type="button" onClick={onResend}>
              {state === "expired" ? "Gửi lại mã" : "Gửi lại"}
            </Button>
          ) : null}
          {showChangeEmail ? (
            <Button type="button" variant="ghost" onClick={onChangeEmail}>
              Đổi email
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

export { VerificationStateCard };
