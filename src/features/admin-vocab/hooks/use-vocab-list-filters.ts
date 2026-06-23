"use client";

import { useState, useMemo } from "react";
import type { VocabItem, VocabStatus, VocabStripFilter } from "@/features/admin-vocab/types/vocab-item.types";

const PAGE_SIZE = 8;

export interface VocabFilterState {
  search?: string;
  lang?: string;
  status?: VocabStatus;
  pos?: string;
  source?: string;
  reviewer?: string;
  hasAudio?: boolean;
  hasExample?: boolean;
  missing?: "audio" | "example" | "issues";
}

const INITIAL_FILTERS: VocabFilterState = {};

export function useVocabListFilters(items: readonly VocabItem[]): {
  stripFilter: VocabStripFilter;
  filters: VocabFilterState;
  page: number;
  selectedIds: string[];
  filtered: VocabItem[];
  paginated: VocabItem[];
  totalPages: number;
  activeAdvancedFilterCount: number;
  statusCounts: Record<VocabStripFilter, number>;
  setStripFilter: (filter: VocabStripFilter) => void;
  setFilters: (filters: VocabFilterState) => void;
  clearFilters: () => void;
  toggleSelect: (id: string) => void;
  selectPage: () => void;
  clearSelection: () => void;
  setPage: (page: number) => void;
} {
  const [stripFilter, setStripFilterRaw] = useState<VocabStripFilter>("all");
  const [filters, setFiltersRaw] = useState<VocabFilterState>(INITIAL_FILTERS);
  const [page, setPageRaw] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function setStripFilter(f: VocabStripFilter) {
    setStripFilterRaw(f);
    setPageRaw(1);
  }

  function setFilters(f: VocabFilterState) {
    setFiltersRaw(f);
    setPageRaw(1);
  }

  function clearFilters() {
    setFiltersRaw(INITIAL_FILTERS);
    setStripFilterRaw("all");
    setPageRaw(1);
  }

  function setPage(p: number) {
    setPageRaw(p);
  }

  const filtered = useMemo((): VocabItem[] => {
    let result: VocabItem[] = items as VocabItem[];

    // Strip filter: lifecycle status strip — but filters.status overrides it
    if (stripFilter === "ai_generated") {
      result = result.filter((i) => i.isAiGenerated === true);
    } else if (stripFilter !== "all") {
      // Only apply strip filter if filters.status is NOT set (filters.status wins)
      if (!filters.status) {
        result = result.filter((i) => i.status === stripFilter);
      }
    }

    // filters.status overrides lifecycle strip
    if (filters.status) {
      result = result.filter((i) => i.status === filters.status);
    }

    // lang filter
    if (filters.lang) {
      result = result.filter((i) => i.lang === filters.lang);
    }

    // search: case-insensitive on canonicalForm OR pronunciation
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.canonicalForm.toLowerCase().includes(q) ||
          (i.pronunciation ?? "").toLowerCase().includes(q),
      );
    }

    // pos filter
    if (filters.pos) {
      const posQ = filters.pos.toLowerCase();
      result = result.filter((i) => (i.pos ?? "").toLowerCase().includes(posQ));
    }

    // source filter
    if (filters.source) {
      result = result.filter((i) => i.source === filters.source);
    }

    // reviewer: substring match
    if (filters.reviewer) {
      const revQ = filters.reviewer.toLowerCase();
      result = result.filter((i) =>
        (i.reviewer ?? "").toLowerCase().includes(revQ),
      );
    }

    // hasAudio boolean filter
    if (filters.hasAudio === true) {
      result = result.filter((i) => i.hasAudio);
    } else if (filters.hasAudio === false) {
      result = result.filter((i) => !i.hasAudio);
    }

    // hasExample boolean filter
    if (filters.hasExample === true) {
      result = result.filter((i) => i.hasExample);
    } else if (filters.hasExample === false) {
      result = result.filter((i) => !i.hasExample);
    }

    // missing filter
    if (filters.missing === "audio") {
      result = result.filter((i) => !i.hasAudio);
    } else if (filters.missing === "example") {
      result = result.filter((i) => !i.hasExample);
    } else if (filters.missing === "issues") {
      result = result.filter((i) => i.issues.length > 0 || !i.isValid);
    }

    return result;
  }, [items, stripFilter, filters]);

  // Prune selectedIds when filtered changes
  const prunedSelectedIds = useMemo(() => {
    const filteredSet = new Set(filtered.map((i) => i.id));
    return selectedIds.filter((id) => filteredSet.has(id));
  }, [filtered, selectedIds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Clamp page to valid range
  const clampedPage = Math.max(1, Math.min(page, totalPages));

  const paginated = useMemo((): VocabItem[] => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, clampedPage]);

  // activeAdvancedFilterCount: count only pos, source, reviewer, hasAudio, hasExample, missing
  const activeAdvancedFilterCount = useMemo(() => {
    let count = 0;
    if (filters.pos !== undefined && filters.pos !== "") count++;
    if (filters.source !== undefined && filters.source !== "") count++;
    if (filters.reviewer !== undefined && filters.reviewer !== "") count++;
    if (filters.hasAudio !== undefined) count++;
    if (filters.hasExample !== undefined) count++;
    if (filters.missing !== undefined) count++;
    return count;
  }, [filters]);

  // statusCounts: always based on all items (no filter applied)
  const statusCounts = useMemo((): Record<VocabStripFilter, number> => {
    const counts: Record<VocabStripFilter, number> = {
      all: items.length,
      ai_generated: 0,
      draft: 0,
      in_review: 0,
      reviewed: 0,
      published: 0,
      rejected: 0,
      archived: 0,
    };

    for (const item of items) {
      counts[item.status]++;
      if (item.isAiGenerated) {
        counts["ai_generated"]++;
      }
    }

    return counts;
  }, [items]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function selectPage() {
    const pageIds = paginated.map((i) => i.id);
    setSelectedIds(pageIds);
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  return {
    stripFilter,
    filters,
    page: clampedPage,
    selectedIds: prunedSelectedIds,
    filtered,
    paginated,
    totalPages,
    activeAdvancedFilterCount,
    statusCounts,
    setStripFilter,
    setFilters,
    clearFilters,
    toggleSelect,
    selectPage,
    clearSelection,
    setPage,
  };
}
