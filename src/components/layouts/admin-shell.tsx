"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { IconButton } from "@/components/shared/icon-button";
import {
  AdminSidebar,
  getInitials,
  type NavSection,
  type UserSummary,
} from "@/components/shared/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";

export type AdminShellProps = {
  logo?: React.ReactNode;
  sections: NavSection[];
  activeNavId?: string;
  /** Signed-in admin summary shown at the foot of the sidebar. */
  user?: UserSummary;
  /** Top-bar left slot — title, breadcrumb, or search. */
  topBarStart?: React.ReactNode;
  /** Top-bar right slot — actions / status. */
  topBarActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function SidebarUser({ user }: { user: UserSummary }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
        <AvatarFallback>{getInitials(user)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-sidebar-foreground">
          {user.name}
        </p>
        {user.email ? (
          <p className="truncate text-xs text-sidebar-foreground/60">
            {user.email}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * AdminShell — internal / admin layout: a fixed dark 240px sidebar, a top bar,
 * and a scrollable content area. Denser than the learner UI. The sidebar is the
 * only place LexiPath uses a left rail; on small screens it collapses into a
 * `Sheet`. Self-contained — pass nav sections, the active id, and the user.
 */
function AdminShell({
  logo,
  sections,
  activeNavId,
  user,
  topBarStart,
  topBarActions,
  children,
  className,
}: AdminShellProps) {
  const [open, setOpen] = React.useState(false);
  const footer = user ? <SidebarUser user={user} /> : undefined;

  return (
    <div className={cn("flex h-svh overflow-hidden bg-background", className)}>
      <aside className="hidden lg:block">
        <AdminSidebar
          logo={logo}
          sections={sections}
          activeNavId={activeNavId}
          footer={footer}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <IconButton variant="ghost" label="Mở menu">
                  <Menu />
                </IconButton>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 gap-0 p-0" showCloseButton={false}>
                <SheetTitle className="sr-only">Điều hướng quản trị</SheetTitle>
                <AdminSidebar
                  logo={logo}
                  sections={sections}
                  activeNavId={activeNavId}
                  footer={footer}
                  onNavigate={() => setOpen(false)}
                  className="w-full"
                />
              </SheetContent>
            </Sheet>
            <div className="flex min-w-0 items-center gap-3">{topBarStart}</div>
          </div>
          {topBarActions ? (
            <div className="flex shrink-0 items-center gap-2">{topBarActions}</div>
          ) : null}
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export { AdminShell };
