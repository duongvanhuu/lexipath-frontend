import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Chỉnh sửa mục từ — ${id}` };
}

export default async function AdminVocabEditPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Chỉnh sửa mục từ
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ID: <code className="font-mono text-xs">{id}</code>
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={"/admin/vocab" as Route}>← Quay lại danh sách</Link>
        </Button>
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Bộ chọn ngôn ngữ và editor sẽ được triển khai ở Task 8–14.
      </div>
    </div>
  );
}
