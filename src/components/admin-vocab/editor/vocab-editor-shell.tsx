"use client";

import type { VocabLang } from "@/features/admin-vocab";

export function VocabEditorShell(_: {
  mode: "create" | "edit";
  initialLang: VocabLang;
  vocabItemId?: string;
}) {
  return <div>VocabEditorShell stub</div>;
}
