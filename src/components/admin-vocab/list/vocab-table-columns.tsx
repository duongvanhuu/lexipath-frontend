import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Bot, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type {
  VocabItem,
  VocabLang,
  VocabStatus,
} from "@/features/admin-vocab/types/vocab-item.types";
import { VOCAB_STATUS_LABELS } from "@/features/admin-vocab/types/vocab-item.types";
import { VocabRowMenu } from "./vocab-row-menu";

// ── helpers ─────────────────────────────────────────────────────────────────

const CJK_LANGS = new Set<VocabLang>(["ja", "zh"]);

const LANG_FLAG: Record<VocabLang, string> = {
  en: "🇬🇧",
  ja: "🇯🇵",
  zh: "🇨🇳",
};

function getVocabLangFlag(lang: VocabLang): string {
  return LANG_FLAG[lang];
}

function getVocabStatusLabel(status: VocabStatus): string {
  return VOCAB_STATUS_LABELS[status];
}

const STATUS_CLASS: Record<VocabStatus, string> = {
  draft: "border bg-background text-muted-foreground",
  in_review: "bg-amber-100 text-amber-800 border-amber-200",
  reviewed: "bg-sky-100 text-sky-800 border-sky-200",
  published: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  archived: "border bg-muted text-muted-foreground",
};

function getVocabStatusClassName(status: VocabStatus): string {
  return STATUS_CLASS[status] ?? "";
}

// ── column-factory options ────────────────────────────────────────────────────

export interface VocabTableColumnsOptions {
  onOpenQuickView: (item: VocabItem) => void;
  onEdit: (item: VocabItem) => void;
  onDuplicate: (item: VocabItem) => void;
  onSendReview: (item: VocabItem) => void;
  onPublish: (item: VocabItem) => void;
  onArchive: (item: VocabItem) => void;
}

// ── factory ──────────────────────────────────────────────────────────────────

/**
 * Returns TanStack Table column definitions for the admin vocab list.
 *
 * Note: AdminDataTable prepends its own __select__ checkbox column automatically,
 * so this factory does NOT include a select column.
 */
export function createVocabTableColumns(
  options: VocabTableColumnsOptions
): ColumnDef<VocabItem>[] {
  const {
    onOpenQuickView,
    onEdit,
    onDuplicate,
    onSendReview,
    onPublish,
    onArchive,
  } = options;

  return [
    // canonicalForm ─────────────────────────────────────────────────────────
    {
      id: "canonicalForm",
      accessorKey: "canonicalForm",
      header: "Từ",
      enableSorting: true,
      cell: ({ row }) => {
        const item = row.original;
        const isCjk = CJK_LANGS.has(item.lang);
        return (
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className={cn(
                "truncate max-w-[140px] text-sm font-medium",
                isCjk && "font-sans"
              )}
            >
              {item.canonicalForm}
            </span>
            {item.isAiGenerated && (
              <Bot
                className="size-3.5 shrink-0 text-violet-500"
                aria-label="AI tạo"
              />
            )}
            {item.issues.length > 0 && (
              <AlertTriangle
                className="size-3.5 shrink-0 text-amber-500"
                aria-label="Có vấn đề"
              />
            )}
          </div>
        );
      },
    },

    // lang ──────────────────────────────────────────────────────────────────
    {
      id: "lang",
      accessorKey: "lang",
      header: "Ngôn ngữ",
      cell: ({ getValue }) => (
        <span aria-label={getValue<VocabLang>()}>
          {getVocabLangFlag(getValue<VocabLang>())}
        </span>
      ),
    },

    // itemType ──────────────────────────────────────────────────────────────
    {
      id: "itemType",
      accessorKey: "itemType",
      header: "Loại",
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
      ),
    },

    // pronunciation ─────────────────────────────────────────────────────────
    {
      id: "pronunciation",
      accessorKey: "pronunciation",
      header: "Phiên âm",
      cell: ({ getValue }) => {
        const v = getValue<string | undefined>();
        return v ? (
          <span className="font-mono text-xs text-muted-foreground">{v}</span>
        ) : (
          <span className="text-xs text-muted-foreground/40">—</span>
        );
      },
    },

    // pos ───────────────────────────────────────────────────────────────────
    {
      id: "pos",
      accessorKey: "pos",
      header: "Từ loại",
      cell: ({ getValue }) => {
        const v = getValue<string | undefined>();
        return v ? (
          <span className="text-xs">{v}</span>
        ) : (
          <span className="text-xs text-muted-foreground/40">—</span>
        );
      },
    },

    // level ─────────────────────────────────────────────────────────────────
    {
      id: "level",
      accessorKey: "level",
      header: "Cấp độ",
      cell: ({ getValue }) => {
        const v = getValue<string | undefined>();
        return v ? (
          <span className="text-xs font-semibold">{v}</span>
        ) : (
          <span className="text-xs text-muted-foreground/40">—</span>
        );
      },
    },

    // status ────────────────────────────────────────────────────────────────
    {
      id: "status",
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }) => {
        const status = getValue<VocabStatus>();
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
              getVocabStatusClassName(status)
            )}
          >
            {getVocabStatusLabel(status)}
          </span>
        );
      },
    },

    // source ────────────────────────────────────────────────────────────────
    {
      id: "source",
      accessorKey: "source",
      header: "Nguồn",
      cell: ({ getValue }) => {
        const v = getValue<string | undefined>();
        return v ? (
          <code className="rounded border bg-muted px-1 py-0.5 text-xs">{v}</code>
        ) : (
          <span className="text-xs text-muted-foreground/40">—</span>
        );
      },
    },

    // reviewer ──────────────────────────────────────────────────────────────
    {
      id: "reviewer",
      accessorKey: "reviewer",
      header: "Người duyệt",
      cell: ({ getValue }) => {
        const v = getValue<string | undefined>();
        if (!v) {
          return <span className="text-xs text-muted-foreground/40">—</span>;
        }
        const initials = v
          .split(" ")
          .map((w) => w[0] ?? "")
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
              {initials}
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {v.split(" ").at(-1)}
            </span>
          </div>
        );
      },
    },

    // updatedAt ─────────────────────────────────────────────────────────────
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "Cập nhật",
      enableSorting: true,
      cell: ({ getValue }) => {
        const d = new Date(getValue<string>());
        return (
          <span className="text-xs text-muted-foreground">
            {d.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        );
      },
    },

    // actions ───────────────────────────────────────────────────────────────
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <span
            role="none"
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Chỉnh sửa"
              onClick={() => onEdit(item)}
            >
              <Pencil aria-hidden />
            </Button>
            <VocabRowMenu
              item={item}
              onOpenQuickView={onOpenQuickView}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onSendReview={onSendReview}
              onPublish={onPublish}
              onArchive={onArchive}
            />
          </span>
        );
      },
    },
  ];
}
