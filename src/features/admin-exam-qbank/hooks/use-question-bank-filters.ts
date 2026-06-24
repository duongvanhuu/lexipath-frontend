"use client";

import { useState, useMemo } from "react";
import type { Question, QuestionType, Skill, QuestionStatus } from "../types/question-bank.types";

// ── Types ────────────────────────────────────────────────────────────────────

export type QuestionBankFilterState = {
  search: string;
  type: "all" | QuestionType;
  skill: "all" | Skill;
  programId: "all" | string;
  status: "all" | QuestionStatus;
};

const DEFAULT_FILTERS: QuestionBankFilterState = {
  search: "",
  type: "all",
  skill: "all",
  programId: "all",
  status: "all",
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useQuestionBankFilters(questions: readonly Question[]): {
  filters: QuestionBankFilterState;
  setFilters: (filters: QuestionBankFilterState) => void;
  updateFilter: <K extends keyof QuestionBankFilterState>(
    key: K,
    value: QuestionBankFilterState[K]
  ) => void;
  clearFilters: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  clearSelection: () => void;
  filteredQuestions: Question[];
  activeFilterCount: number;
  stats: {
    total: number;
    published: number;
    review: number;
    draft: number;
  };
} {
  const [filters, setFiltersRaw] = useState<QuestionBankFilterState>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIdsRaw] = useState<string[]>([]);

  // ── Derived: filtered list ────────────────────────────────────────────────
  const filteredQuestions = useMemo<Question[]>(() => {
    return questions.filter((q) => {
      if (filters.search !== "") {
        const needle = filters.search.toLowerCase();
        if (!q.stem.toLowerCase().includes(needle)) return false;
      }
      if (filters.type !== "all" && q.type !== filters.type) return false;
      if (filters.skill !== "all" && q.skill !== filters.skill) return false;
      if (filters.programId !== "all" && q.programId !== filters.programId) return false;
      if (filters.status !== "all" && q.status !== filters.status) return false;
      return true;
    });
  }, [questions, filters]);

  // ── Derived: selection pruned to current filtered set ────────────────────
  const prunedSelectedIds = useMemo<string[]>(() => {
    const filteredSet = new Set(filteredQuestions.map((q) => q.id));
    return selectedIds.filter((id) => filteredSet.has(id));
  }, [filteredQuestions, selectedIds]);

  // ── Derived: active filter count ─────────────────────────────────────────
  const activeFilterCount = useMemo<number>(() => {
    let count = 0;
    if (filters.search !== "") count++;
    if (filters.type !== "all") count++;
    if (filters.skill !== "all") count++;
    if (filters.programId !== "all") count++;
    if (filters.status !== "all") count++;
    return count;
  }, [filters]);

  // ── Derived: stats from full list ────────────────────────────────────────
  const stats = useMemo(() => {
    let published = 0;
    let review = 0;
    let draft = 0;
    for (const q of questions) {
      if (q.status === "published") published++;
      else if (q.status === "review") review++;
      else if (q.status === "draft") draft++;
    }
    return { total: questions.length, published, review, draft };
  }, [questions]);

  // ── Actions ───────────────────────────────────────────────────────────────

  function setFilters(next: QuestionBankFilterState): void {
    setFiltersRaw(next);
  }

  function updateFilter<K extends keyof QuestionBankFilterState>(
    key: K,
    value: QuestionBankFilterState[K]
  ): void {
    setFiltersRaw((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters(): void {
    setFiltersRaw(DEFAULT_FILTERS);
  }

  function setSelectedIds(ids: string[]): void {
    setSelectedIdsRaw(ids);
  }

  function clearSelection(): void {
    setSelectedIdsRaw([]);
  }

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    selectedIds: prunedSelectedIds,
    setSelectedIds,
    clearSelection,
    filteredQuestions,
    activeFilterCount,
    stats,
  };
}
