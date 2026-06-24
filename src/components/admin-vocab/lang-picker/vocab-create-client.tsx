"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VocabLang } from "@/features/admin-vocab/types/vocab-item.types";
import { VocabLangPicker } from "./vocab-lang-picker";

const LANG_LABELS: Record<VocabLang, string> = {
  en: "🇬🇧 Tiếng Anh",
  ja: "🇯🇵 Tiếng Nhật",
  zh: "🇨🇳 Tiếng Trung",
};

export function VocabCreateClient() {
  const [selectedLang, setSelectedLang] = useState<VocabLang | null>(null);

  if (selectedLang === null) {
    return (
      <div className="space-y-6 p-6">
        {/* Back link */}
        <Link
          href="/admin/vocab"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Quay lại danh sách từ vựng
        </Link>

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Chọn ngôn ngữ
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chọn ngôn ngữ cho mục từ mới trước khi mở editor.
          </p>
        </div>

        {/* Lang picker */}
        <VocabLangPicker value={selectedLang} onSelect={setSelectedLang} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Back link */}
      <Link
        href="/admin/vocab"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Quay lại danh sách từ vựng
      </Link>

      {/* Placeholder editor area */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Editor mục từ mới
        </h1>
        <Badge variant="secondary">{LANG_LABELS[selectedLang]}</Badge>
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Editor sẽ được triển khai ở Task 14.
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedLang(null)}
      >
        Đổi ngôn ngữ
      </Button>
    </div>
  );
}
