import type { VocabEditorTabId } from "@/features/admin-vocab/types/vocab-item.types";

export const VOCAB_EDITOR_TABS = [
  { id: "basic",        label: "Cơ bản" },
  { id: "scripts",      label: "Chữ viết" },
  { id: "phonetics",    label: "Phát âm" },
  { id: "audio",        label: "Âm thanh" },
  { id: "senses",       label: "Nghĩa" },
  { id: "translations", label: "Dịch thuật" },
  { id: "examples",     label: "Ví dụ" },
  { id: "relations",    label: "Quan hệ từ" },
  { id: "tags",         label: "Thẻ" },
  { id: "sources",      label: "Nguồn" },
  { id: "preview",      label: "Xem trước" },
  { id: "versions",     label: "Lịch sử" },
  { id: "review",       label: "Duyệt" },
  { id: "publish",      label: "Xuất bản" },
] satisfies Array<{ id: VocabEditorTabId; label: string }>;
