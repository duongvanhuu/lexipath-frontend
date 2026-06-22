import * as React from "react";

/**
 * Auth route-group layout — a centered, minimal frame for login / register /
 * onboarding. No marketing chrome and no learner navigation.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-surface-muted px-4 py-10">
      <div className="w-full">{children}</div>
    </div>
  );
}
