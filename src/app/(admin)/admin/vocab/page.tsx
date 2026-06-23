import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Từ vựng" };

export default function AdminVocabPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Từ vựng</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý các mục từ vựng tiếng Anh, Nhật và Trung.
          </p>
        </div>
        <Button asChild>
          <Link href={"/admin/vocab/new" as Route}>Thêm mục từ</Link>
        </Button>
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Danh sách mục từ sẽ được triển khai ở Task 7.
      </div>
    </div>
  );
}
