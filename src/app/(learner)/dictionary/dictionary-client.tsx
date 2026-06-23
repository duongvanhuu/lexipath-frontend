"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AddToLearningDialog } from "@/components/notebook/add-to-learning-dialog";
import { DictionarySearchPanel } from "@/components/vocabulary/dictionary-search-panel";
import { DictionaryResultList } from "@/components/vocabulary/dictionary-result-list";
import { DictionaryBeforeSearch } from "@/components/vocabulary/dictionary-before-search";
import { DictionaryEmptyState } from "@/components/vocabulary/dictionary-empty-state";
import { DictionarySuggestionBanner } from "@/components/vocabulary/dictionary-suggestion-banner";
import {
  DICT_ENTRIES,
  SEARCH_MODES,
  VOCAB_GROUPS,
  POPULAR_WORDS,
  LANG_LABELS,
  buildTieredResults,
  findTypoSuggestion,
  groupByType,
  filterByLang,
} from "@/features/dictionary";
import type { DictLang, DictionaryEntry, SearchMode } from "@/features/dictionary";

/* ── Constants ────────────────────────────────────────────────── */

const LANGS: { id: DictLang; label: string }[] = [
  { id: "ja", label: "Tiếng Nhật" },
  { id: "en", label: "Tiếng Anh" },
  { id: "zh", label: "Tiếng Trung" },
];

const MOCK_COLLECTIONS = [
  { id: "col-1", name: "JLPT N3 — Danh từ" },
  { id: "col-2", name: "Business English" },
  { id: "col-3", name: "HSK 4 — Luyện tập hàng ngày" },
];

const RECENT_STORAGE_KEY = (lang: DictLang) => `lp_dict_recent_${lang}`;

function readRecent(lang: DictLang): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY(lang)) ?? "[]");
  } catch {
    return [];
  }
}

function writeRecent(lang: DictLang, items: string[]) {
  try {
    localStorage.setItem(RECENT_STORAGE_KEY(lang), JSON.stringify(items));
  } catch {
    // ignore
  }
}

/* ── Component ────────────────────────────────────────────────── */

export function DictionaryClient() {
  const router = useRouter();

  const [lang, setLang] = React.useState<DictLang>("en");
  const [mode, setMode] = React.useState<SearchMode>("any");
  const [query, setQuery] = React.useState("");
  const [saved, setSaved] = React.useState<Set<string>>(new Set());
  const [recent, setRecent] = React.useState<string[]>([]);
  const [addDialogEntry, setAddDialogEntry] =
    React.useState<DictionaryEntry | null>(null);
  const [selectedCollection, setSelectedCollection] = React.useState("");

  function handleLangChange(next: DictLang) {
    setLang(next);
    setMode("any");
    setQuery("");
    setRecent(readRecent(next));
  }

  /* ── Derived data ─────────────────────────────────────────── */

  const langEntries = React.useMemo(
    () => filterByLang(DICT_ENTRIES, lang),
    [lang]
  );

  const modes = SEARCH_MODES[lang];
  const groups = VOCAB_GROUPS[lang];

  const tiers = React.useMemo(
    () =>
      query.trim()
        ? buildTieredResults(langEntries, query, mode)
        : { exact: [], norm: [], related: [] },
    [langEntries, query, mode]
  );

  const allResults = React.useMemo(
    () => [...tiers.exact, ...tiers.norm, ...tiers.related],
    [tiers]
  );

  const byGroup = React.useMemo(
    () => groupByType(allResults),
    [allResults]
  );

  const byGroupAll = React.useMemo(
    () => groupByType(langEntries),
    [langEntries]
  );

  const typoSuggestion = React.useMemo(
    () =>
      query.trim()
        ? findTypoSuggestion(langEntries, query, tiers)
        : null,
    [langEntries, query, tiers]
  );

  const popularEntries = React.useMemo(() => {
    const words = POPULAR_WORDS[lang] ?? [];
    return words
      .map((w) => langEntries.find((e) => e.word === w))
      .filter((e): e is DictionaryEntry => e !== undefined);
  }, [lang, langEntries]);

  /* ── Handlers ─────────────────────────────────────────────── */

  function commitRecent(q: string) {
    if (!q.trim()) return;
    const next = [q.trim(), ...recent.filter((r) => r !== q.trim())].slice(
      0,
      8
    );
    setRecent(next);
    writeRecent(lang, next);
  }

  function handleSelect(entry: DictionaryEntry) {
    commitRecent(entry.word);
    // Navigate to vocab detail when backend available
    // router.push(`/vocabulary/${entry.id}`);
  }

  function handleSave(entry: DictionaryEntry) {
    setAddDialogEntry(entry);
    setSelectedCollection("");
  }

  function handleSaveDirect(entry: DictionaryEntry) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(entry.id) ? next.delete(entry.id) : next.add(entry.id);
      return next;
    });
  }

  function handleAddConfirm() {
    if (addDialogEntry) {
      setSaved((prev) => new Set(prev).add(addDialogEntry.id));
    }
    setAddDialogEntry(null);
  }

  function handleCategoryClick(groupId: string) {
    const first = langEntries.find((e) => e.type === groupId);
    if (first) setQuery(first.word);
  }

  /* ── Render ───────────────────────────────────────────────── */

  const isSearching = query.trim().length > 0;
  const hasResults = allResults.length > 0;

  return (
    <div className="mx-auto max-w-[920px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} />
          Sổ tay
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Từ điển
        </h1>

        {/* Language tabs */}
        <div className="ml-auto flex items-center gap-1 rounded-full border border-border bg-muted/50 p-0.5">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => handleLangChange(l.id)}
              aria-pressed={lang === l.id}
              className={
                lang === l.id
                  ? "rounded-full bg-card px-3 py-1 text-xs font-semibold text-text-primary shadow-sm"
                  : "rounded-full px-3 py-1 text-xs font-medium text-text-muted hover:text-text-secondary"
              }
            >
              {LANG_LABELS[l.id]}
            </button>
          ))}
        </div>
      </div>

      {/* Search panel */}
      <DictionarySearchPanel
        lang={lang}
        modes={modes}
        mode={mode}
        onModeChange={setMode}
        query={query}
        onQueryChange={setQuery}
      />

      {/* Before search */}
      {!isSearching ? (
        <DictionaryBeforeSearch
          lang={lang}
          recentSearches={recent}
          onClearRecent={() => {
            setRecent([]);
            writeRecent(lang, []);
          }}
          onRecentClick={setQuery}
          groups={groups}
          entriesByGroup={byGroupAll}
          popularEntries={popularEntries}
          saved={saved}
          onSelect={handleSelect}
          onSave={handleSaveDirect}
          onCategoryClick={handleCategoryClick}
        />
      ) : (
        /* After search */
        <div>
          {/* Typo suggestion */}
          {typoSuggestion && (
            <DictionarySuggestionBanner
              suggestion={typoSuggestion}
              onApply={setQuery}
            />
          )}

          {hasResults ? (
            <DictionaryResultList
              results={allResults}
              tiers={tiers}
              groups={groups}
              byGroup={byGroup}
              lang={lang}
              query={query}
              saved={saved}
              onSelect={handleSelect}
              onSave={handleSaveDirect}
            />
          ) : (
            !typoSuggestion && <DictionaryEmptyState query={query} />
          )}
        </div>
      )}

      {/* Add to learning dialog */}
      <AddToLearningDialog
        open={addDialogEntry !== null}
        onOpenChange={(open) => { if (!open) setAddDialogEntry(null); }}
        word={addDialogEntry?.word ?? ""}
        {...(addDialogEntry?.meaning ? { meaning: addDialogEntry.meaning } : {})}
        collections={MOCK_COLLECTIONS}
        selectedCollectionId={selectedCollection}
        onSelectedCollectionChange={setSelectedCollection}
        onConfirm={handleAddConfirm}
      />
    </div>
  );
}
