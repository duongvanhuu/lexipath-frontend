import type { VocabEditorTabId } from "@/features/admin-vocab/types/vocab-item.types";

export const VOCAB_EDITOR_TABS = [
  { id: "basic",        label: "Cơ bản" },
  { id: "scripts",      label: "Scripts" },
  { id: "phonetics",    label: "Phát âm" },
  { id: "audio",        label: "Audio" },
  { id: "senses",       label: "Nghĩa" },
  { id: "translations", label: "Bản dịch" },
  { id: "examples",     label: "Ví dụ" },
  { id: "relations",    label: "Liên quan" },
  { id: "tags",         label: "Tags" },
  { id: "sources",      label: "Nguồn" },
  { id: "preview",      label: "Xem trước" },
  { id: "versions",     label: "Lịch sử" },
  { id: "review",       label: "Duyệt" },
  { id: "publish",      label: "Xuất bản" },
] satisfies Array<{ id: VocabEditorTabId; label: string }>;
