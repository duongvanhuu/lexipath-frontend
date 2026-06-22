import Link from "next/link";
import type { Metadata } from "next";
import type { Route } from "next";

export const metadata: Metadata = {
  title: "Không tìm thấy trang — LexiPath",
};

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-surface-muted px-4 py-16 text-center">
      <div className="flex max-w-sm flex-col items-center gap-6">
        <p className="text-7xl font-bold tracking-tight text-primary">404</p>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-foreground">
            Trang không tồn tại
          </h1>
          <p className="text-sm text-muted-foreground">
            Trang bạn tìm kiếm đã bị xóa, đổi tên, hoặc chưa từng tồn tại.
          </p>
        </div>

        <Link
          href={"/" as Route}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
