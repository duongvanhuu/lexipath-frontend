"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import type { NavItem } from "@/components/shared/navigation";
import { cn } from "@/lib/utils/cn";

export function LearnerMoreMenu({
  items,
  activeNavId,
  homeHref,
}: {
  items: NavItem[];
  activeNavId?: string;
  homeHref: Route;
}) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const isActive = items.some((it) => it.id === activeNavId);

  React.useEffect(() => {
    if (!open) return;
    const onOut = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onOut);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onOut);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div className="relative" ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Thêm điều hướng"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-pill px-3 text-sm font-medium whitespace-nowrap transition-colors",
          isActive
            ? "bg-primary-soft font-semibold text-primary-soft-foreground"
            : "text-text-secondary hover:bg-surface-muted hover:text-foreground"
        )}
      >
        Thêm
        {open ? (
          <ChevronUp className="size-3.5 text-text-muted" aria-hidden />
        ) : (
          <ChevronDown className="size-3.5 text-text-muted" aria-hidden />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[182px] overflow-hidden rounded-card border border-border bg-card p-1.5 shadow-lg"
          style={{ transformOrigin: "top left" }}
        >
          {items.map((item) => {
            const active = item.id === activeNavId;
            return (
              <Link
                key={item.id}
                href={item.href ?? homeHref}
                role="menuitem"
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-button px-3 py-2.5 text-sm transition-colors [&_svg]:size-4",
                  active
                    ? "bg-primary-soft font-semibold text-primary-soft-foreground [&_svg]:text-primary"
                    : "font-medium text-foreground hover:bg-surface-muted"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {active && (
                  <Check className="size-3.5 text-primary" aria-hidden />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
