"use client";

import "@/styles/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="flex min-h-svh flex-col items-center justify-center bg-background p-8 text-center font-sans">
        <div className="flex max-w-md flex-col items-center gap-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="size-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">
              Đã xảy ra lỗi
            </h1>
            <p className="text-sm text-muted-foreground">
              Ứng dụng gặp sự cố không mong đợi. Vui lòng thử lại.
            </p>
            {error.digest ? (
              <p className="font-mono text-xs text-muted-foreground/60">
                {error.digest}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
