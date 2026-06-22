import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type AuthCardProps = {
  /** Brand mark shown above the title. */
  logo?: React.ReactNode;
  title: string;
  description?: string;
  /** Form / body content. */
  children: React.ReactNode;
  /** Footer row (e.g. "Chưa có tài khoản? Đăng ký"). */
  footer?: React.ReactNode;
  className?: string;
};

/**
 * AuthCard — centered container for login / register / reset flows. Logo,
 * title, description, body, and an optional footer. Presentation only; the
 * interactive form is passed in as `children`.
 */
function AuthCard({
  logo,
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-md gap-0 p-8 shadow-card", className)}>
      <div className="flex flex-col items-center text-center">
        {logo ? <div className="mb-5">{logo}</div> : null}
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-xs text-sm text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-6 w-full">{children}</div>

      {footer ? (
        <div className="mt-5 text-center text-sm text-text-secondary">
          {footer}
        </div>
      ) : null}
    </Card>
  );
}

export { AuthCard };
