"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { IconButton } from "@/components/shared/icon-button";
import {
  AdminSidebar,
  type NavSection,
} from "@/components/shared/navigation";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type AdminMobileNavProps = {
  logo?: React.ReactNode;
  sections: NavSection[];
  activeNavId?: string;
  footer?: React.ReactNode;
};

function AdminMobileNav({
  logo,
  sections,
  activeNavId,
  footer,
}: AdminMobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
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
  );
}

export { AdminMobileNav };
