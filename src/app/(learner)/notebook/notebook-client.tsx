"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlarmClock,
  ArrowDownAZ,
  ArrowUpDown,
  Award,
  Check,
  ChevronDown,
  History,
  List,
  Search,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LexiButton } from "@/components/shared";
import { NotebookSplitLayout, NotebookItemRow } from "@/components/notebook";
import type { NotebookItem } from "@/components/notebook";
import { NotebookDetailPanel } from "@/features/notebook/components/notebook-detail-panel";
import { MOCK_NOTEBOOK_WORDS } from "@/features/notebook";
import type { NotebookWord, VocabLang } from "@/features/notebook";
import { cn } from "@/lib/utils/cn";

/* ── Constants ─────────────────────────────────────────────────── */

const LANGS: { id: VocabLang; label: string }[] = [
  { id: "ja", label: "Tiếng Nhật" },
  { id: "en", label: "Tiếng Anh" },
  { id: "zh", label: "Tiếng Trung" },
];

const STATUS_TABS = [
  { id: "all",      label: "Tất cả"    },
  { id: "review",   label: "Cần ôn"    },
  { id: "learning", label: "Đang học"  },
  { id: "mastered", label: "Thành thạo" },
];

const SORTS = [
  { id: "recent",   label: "Gần đây",          icon: History    },
  { id: "due",      label: "Sắp đến giờ ôn",   icon: AlarmClock },
  { id: "weak",     label: "Yếu nhất",          icon: ArrowUpDown },
  { id: "az",       label: "A–Z / theo chữ",    icon: ArrowDownAZ },
  { id: "mastered", label: "Thành thạo nhất",   icon: Award      },
];

/* ── Helpers ────────────────────────────────────────────────────── */

function wordToItem(w: NotebookWord): NotebookItem {
  const statusLabel =
    w.status === "mastered"   ? "Thành thạo" :
    w.status === "learning"   ? "Đang học"   :
    w.status === "review"     ? "Cần ôn"     :
    w.status === "forgetting" ? "Sắp quên"   : "Mới";

  const itemStatus: NotebookItem["status"] =
    w.status === "forgetting" ? "review" : w.status;

  return {
    id: w.id,
    word: w.word,
    ...(w.reading !== undefined ? { reading: w.reading } : {}),
    ...(w.meaning !== undefined ? { meaning: w.meaning } : {}),
    status: itemStatus,
    statusLabel,
    lang: w.lang,
    ...(w.urgency === "overdue" || w.urgency === "due"
      ? { urgency: w.urgency }
      : {}),
    ...(w.urgency === "overdue"
      ? { reviewLabel: "Ôn ngay" }
      : w.urgency === "due" && w.nextReview !== undefined
        ? { reviewLabel: w.nextReview }
        : {}),
    ...(w.weakSkill?.label !== undefined
      ? { weakSkillLabel: w.weakSkill.label }
      : {}),
  };
}

const URGENCY_RANK: Record<string, number> = {
  overdue: 0,
  due:     1,
  ok:      2,
  none:    3,
};

function sortWords(words: NotebookWord[], sort: string): NotebookWord[] {
  return [...words].sort((a, b) => {
    if (sort === "due") {
      return (URGENCY_RANK[a.urgency ?? "none"] ?? 3) -
             (URGENCY_RANK[b.urgency ?? "none"] ?? 3);
    }
    if (sort === "weak") {
      const minAcc = (w: NotebookWord) =>
        w.skills?.length ? Math.min(...w.skills.map((s) => s.accuracy)) : 100;
      return minAcc(a) - minAcc(b);
    }
    if (sort === "az") return a.word.localeCompare(b.word);
    if (sort === "mastered") {
      const avg = (w: NotebookWord) =>
        w.skills?.length
          ? w.skills.reduce((s, x) => s + x.accuracy, 0) / w.skills.length
          : 0;
      return avg(b) - avg(a);
    }
    return 0;
  });
}

/* ── Component ──────────────────────────────────────────────────── */

export function NotebookClient() {
  const router = useRouter();

  const [activeLang, setActiveLang] = React.useState<VocabLang>("ja");
  const [search, setSearch]         = React.useState("");
  const [statusTab, setStatusTab]   = React.useState("all");
  const [sort, setSort]             = React.useState("recent");
  const [sortOpen, setSortOpen]     = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = React.useState(false);

  const sortMenuRef = React.useRef<HTMLDivElement>(null);

  /* Close sort menu on outside click */
  React.useEffect(() => {
    function handle(e: MouseEvent) {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(e.target as Node)
      ) {
        setSortOpen(false);
      }
    }
    if (sortOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [sortOpen]);

  /* Vocab for current language */
  const allVocab = React.useMemo(
    () => MOCK_NOTEBOOK_WORDS.filter((w) => w.lang === activeLang),
    [activeLang]
  );

  /* Stats */
  const stats = React.useMemo(
    () => ({
      total:    allVocab.length,
      review:   allVocab.filter((w) => w.status === "review" || w.status === "forgetting").length,
      mastered: allVocab.filter((w) => w.status === "mastered").length,
    }),
    [allVocab]
  );

  /* Tab counts */
  const tabCounts = React.useMemo(
    () => ({
      all:      allVocab.length,
      review:   allVocab.filter((w) => w.status === "review" || w.status === "forgetting").length,
      learning: allVocab.filter((w) => w.status === "learning" || w.status === "new").length,
      mastered: allVocab.filter((w) => w.status === "mastered").length,
    }),
    [allVocab]
  );

  /* Filtered + sorted */
  const filtered = React.useMemo(() => {
    const list = allVocab.filter((w) => {
      const matchStatus =
        statusTab === "review"   ? w.status === "review" || w.status === "forgetting" :
        statusTab === "learning" ? w.status === "learning" || w.status === "new" :
        statusTab === "mastered" ? w.status === "mastered" : true;
      if (!matchStatus) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        w.word.toLowerCase().includes(q) ||
        (w.reading?.toLowerCase().includes(q) ?? false) ||
        w.meaning.toLowerCase().includes(q)
      );
    });
    return sortWords(list, sort);
  }, [allVocab, statusTab, search, sort]);

  /* Selected word */
  const selectedWord = React.useMemo(
    () => filtered.find((w) => w.id === selectedId) ?? null,
    [filtered, selectedId]
  );

  /* Handlers */
  function selectWord(id: string) {
    setSelectedId(id);
    setMobileDetailOpen(true);
  }

  function handleReview(_word: NotebookWord) {
    router.push("/golden-time" as never);
  }

  function handleLearn(_word: NotebookWord) {
    router.push("/golden-time" as never);
  }

  const sortLabel = SORTS.find((s) => s.id === sort)?.label ?? "Gần đây";

  /* ── List pane ──────────────────────────────────────────────── */
  const listPane = (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Search */}
      <div className="shrink-0 border-b border-border p-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
            aria-hidden
          />
          <Input
            className="pl-9 pr-9 text-sm"
            placeholder="Tìm trong sổ tay…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedId(null);
            }}
            aria-label="Tìm từ trong sổ tay"
          />
          {search ? (
            <button
              type="button"
              aria-label="Xóa tìm kiếm"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus-visible:outline-none"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Status tabs */}
      <div className="shrink-0 border-b border-border px-3 pt-2 pb-0">
        <Tabs
          value={statusTab}
          onValueChange={(t) => {
            setStatusTab(t);
            setSelectedId(null);
          }}
        >
          <TabsList className="h-auto w-full gap-0 bg-transparent p-0">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative h-9 flex-1 rounded-none border-b-2 border-transparent bg-transparent px-2 text-xs font-medium text-text-muted data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {tab.label}
                {tab.id !== "all" ? (
                  <span className="ml-1 text-[10px] text-text-muted">
                    ({tabCounts[tab.id as keyof typeof tabCounts]})
                  </span>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Toolbar: count + sort */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-muted/40 px-3 py-1.5">
        <span className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
          <List className="size-3.5" aria-hidden />
          {filtered.length} từ
        </span>
        <div className="relative" ref={sortMenuRef}>
          <button
            type="button"
            aria-label="Sắp xếp danh sách"
            aria-expanded={sortOpen}
            onClick={() => setSortOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowUpDown className="size-3.5" aria-hidden />
            {sortLabel}
            <ChevronDown className="size-3.5" aria-hidden />
          </button>
          {sortOpen ? (
            <div className="absolute right-0 top-full z-30 mt-1.5 min-w-[190px] rounded-[12px] border border-border bg-card p-1.5 shadow-lg">
              {SORTS.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSort(s.id);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                      sort === s.id
                        ? "bg-primary-soft font-semibold text-primary"
                        : "text-text-primary"
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" aria-hidden />
                    {s.label}
                    {sort === s.id ? (
                      <Check className="ml-auto size-3.5" aria-hidden />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Word list */}
      <div
        className="flex-1 overflow-y-auto"
        role="listbox"
        aria-label="Danh sách từ"
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <span className="inline-flex size-10 items-center justify-center rounded-[12px] bg-muted text-text-muted">
              <Search className="size-5" aria-hidden />
            </span>
            <p className="text-sm text-text-muted">
              {stats.total === 0
                ? "Sổ tay của bạn đang trống."
                : "Không tìm thấy từ nào."}
            </p>
          </div>
        ) : (
          filtered.map((w) => (
            <NotebookItemRow
              key={w.id}
              item={wordToItem(w)}
              selected={selectedId === w.id}
              onClick={() => selectWord(w.id)}
            />
          ))
        )}
      </div>
    </div>
  );

  /* ── Detail pane ────────────────────────────────────────────── */
  const detailPane = (
    <NotebookDetailPanel
      word={selectedWord}
      onReview={handleReview}
      onLearn={handleLearn}
    />
  );

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Sổ tay của bạn
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Mọi từ bạn đã lưu, sắp xếp theo trạng thái học.
          </p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="font-semibold text-text-primary">
              {stats.total}
            </span>
            <span className="text-text-muted">Đã lưu</span>
            <span className="h-4 w-px bg-border" aria-hidden />
            <span className="font-semibold text-warning-foreground">
              {stats.review}
            </span>
            <span className="text-text-muted">Cần ôn</span>
            <span className="h-4 w-px bg-border" aria-hidden />
            <span className="font-semibold text-success-foreground">
              {stats.mastered}
            </span>
            <span className="text-text-muted">Thành thạo</span>
          </div>
        </div>
        <LexiButton variant="outline">
          <Search className="mr-1.5 size-4" aria-hidden />
          Tra từ điển
        </LexiButton>
      </div>

      {/* Language selector */}
      <div className="flex items-center gap-1.5" role="group" aria-label="Chọn ngôn ngữ học">
        {LANGS.map((lang) => (
          <button
            key={lang.id}
            type="button"
            onClick={() => {
              setActiveLang(lang.id);
              setSelectedId(null);
              setStatusTab("all");
              setSearch("");
            }}
            className={cn(
              "rounded-button px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeLang === lang.id
                ? "bg-primary text-white"
                : "border border-border bg-card text-text-secondary hover:bg-muted"
            )}
            aria-pressed={activeLang === lang.id}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Split layout */}
      <NotebookSplitLayout
        list={listPane}
        detail={detailPane}
        detailOpen={mobileDetailOpen}
        onDetailOpenChange={setMobileDetailOpen}
        detailTitle={selectedWord?.word ?? "Chi tiết"}
        className="h-[calc(100svh-15rem)] min-h-[520px]"
      />
    </div>
  );
}
