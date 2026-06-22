"use client";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <svg
          className="size-6 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374l5.304-9.748c.866-1.5 3.032-1.5 3.898 0L21.303 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      <div className="space-y-1.5">
        <h2 className="text-base font-semibold text-foreground">
          Có lỗi xảy ra
        </h2>
        <p className="text-sm text-muted-foreground">
          {error.message || "Đã xảy ra lỗi không mong đợi. Vui lòng thử lại."}
        </p>
      </div>

      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Thử lại
      </button>
    </div>
  );
}
