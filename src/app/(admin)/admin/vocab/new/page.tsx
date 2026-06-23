import type { Metadata } from "next";

export const metadata: Metadata = { title: "Thêm mục từ" };

export default function AdminVocabNewPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Thêm mục từ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tạo mục từ vựng mới cho hệ thống.
        </p>
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Bộ chọn ngôn ngữ và editor sẽ được triển khai ở Task 8–14.
      </div>
    </div>
  );
}
