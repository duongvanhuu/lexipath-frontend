"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { SESSION_COOKIE } from "@/lib/auth/session";

if (process.env.NODE_ENV === "production") {
  throw new Error("Dev login page must not be accessible in production.");
}

const DEV_USER = {
  name: "Nguyễn Văn A",
  email: "dev@lexipath.app",
};

const PAGES: { label: string; href: Route; desc: string }[] = [
  { label: "Dashboard", href: "/dashboard", desc: "Trang chủ học viên" },
  { label: "Golden Time", href: "/golden-time", desc: "Dashboard ôn tập" },
  {
    label: "Golden Time Session",
    href: "/golden-time/session/gt-demo" as Route,
    desc: "Phiên ôn tập (focus mode)",
  },
  {
    label: "Learning Session",
    href: "/learn/session/demo-1" as Route,
    desc: "Phiên học bài (focus mode)",
  },
  {
    label: "Collections",
    href: "/collections/english-academic" as Route,
    desc: "Chi tiết bộ từ vựng",
  },
  { label: "Login", href: "/login", desc: "Trang đăng nhập" },
  { label: "Register", href: "/register", desc: "Trang đăng ký" },
];

export default function DevLoginPage() {
  const router = useRouter();
  const [authed, setAuthed] = React.useState(false);

  React.useEffect(() => {
    setAuthed(document.cookie.includes(`${SESSION_COOKIE}=1`));
  }, []);

  function setAuth() {
    document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=86400; SameSite=Lax`;
    setAuthed(true);
  }

  function clearAuth() {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    setAuthed(false);
  }

  function go(href: Route) {
    if (!authed) setAuth();
    router.push(href);
  }

  return (
    <div className="min-h-svh bg-background px-6 py-12">
      <div className="mx-auto max-w-lg space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-pill bg-warning-soft px-3 py-1 text-xs font-semibold text-warning-foreground">
            DEV ONLY
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Dev Login</h1>
          <p className="text-sm text-text-secondary">
            Bypass auth để test giao diện. Chỉ hoạt động khi{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              NODE_ENV=development
            </code>
            .
          </p>
        </div>

        {/* Auth status */}
        <div className="flex items-center justify-between rounded-card border border-border bg-card px-5 py-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-text-primary">
              {authed ? `${DEV_USER.name} — ${DEV_USER.email}` : "Chưa đăng nhập"}
            </p>
            <p className="text-xs text-text-muted">
              Cookie{" "}
              <code className="rounded bg-muted px-1 py-0.5">lexi-authed</code>
              {authed ? " đang active" : " chưa được set"}
            </p>
          </div>
          {authed ? (
            <button
              type="button"
              onClick={clearAuth}
              className="rounded-button border border-danger px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger-soft"
            >
              Xoá cookie
            </button>
          ) : (
            <button
              type="button"
              onClick={setAuth}
              className="rounded-button bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
            >
              Set cookie
            </button>
          )}
        </div>

        {/* Page list */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Tất cả pages
          </p>
          <ul className="space-y-1.5" role="list">
            {PAGES.map((p) => (
              <li key={p.href}>
                <button
                  type="button"
                  onClick={() => go(p.href)}
                  className="flex w-full items-center justify-between rounded-card border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-text-primary">
                      {p.label}
                    </p>
                    <p className="text-xs text-text-muted">{p.desc}</p>
                  </div>
                  <code className="ml-3 shrink-0 text-[11px] text-text-muted">
                    {p.href}
                  </code>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
