import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useVocabListFilters } from "../use-vocab-list-filters";
import { VOCAB_ITEMS_MOCK } from "../../mock/vocab-items.mock";

describe("useVocabListFilters", () => {
  // Default state
  it("returns all 12 items when no filters set", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    expect(result.current.filtered.length).toBe(12);
  });

  it("first page has at most 8 items", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    expect(result.current.paginated.length).toBeLessThanOrEqual(8);
    expect(result.current.paginated.length).toBeGreaterThan(0);
  });

  // Search
  it("filters by canonicalForm search (case-insensitive)", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.setFilters({ search: "EPHEMERAL" }));
    expect(result.current.filtered.length).toBe(1);
    expect(result.current.filtered[0]?.canonicalForm).toBe("ephemeral");
  });

  it("filters by pronunciation search (case-insensitive)", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    // "たべる" is the pronunciation of vi-004 (食べる)
    act(() => result.current.setFilters({ search: "たべる" }));
    expect(result.current.filtered.length).toBe(1);
    expect(result.current.filtered[0]?.id).toBe("vi-004");
  });

  // Strip filter ai_generated
  it("filters by strip filter 'ai_generated'", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.setStripFilter("ai_generated"));
    // vi-003, vi-005, vi-009, vi-012 are isAiGenerated
    expect(result.current.filtered.length).toBe(4);
    expect(result.current.filtered.every((i) => i.isAiGenerated === true)).toBe(true);
  });

  // Lifecycle strip
  it("filters by lifecycle strip 'published'", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.setStripFilter("published"));
    // vi-001, vi-002, vi-004, vi-007, vi-010 = 5
    const expected = VOCAB_ITEMS_MOCK.filter((i) => i.status === "published");
    expect(result.current.filtered.length).toBe(expected.length);
    expect(result.current.filtered.every((i) => i.status === "published")).toBe(true);
  });

  // filters.status overrides lifecycle strip
  it("filters.status overrides lifecycle strip filter", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    // Set strip to "published", then override with status "draft"
    act(() => result.current.setStripFilter("published"));
    act(() => result.current.setFilters({ status: "draft" }));
    // Should show draft items, NOT published
    // vi-005, vi-009 = 2 drafts
    expect(result.current.filtered.length).toBe(2);
    expect(result.current.filtered.every((i) => i.status === "draft")).toBe(true);
  });

  // lang filter
  it("filters by lang", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.setFilters({ lang: "ja" }));
    // vi-004, vi-005, vi-010 = 3 items
    expect(result.current.filtered.length).toBe(3);
    expect(result.current.filtered.every((i) => i.lang === "ja")).toBe(true);
  });

  // activeAdvancedFilterCount
  it("activeAdvancedFilterCount counts only advanced keys (pos, source, reviewer, hasAudio, hasExample, missing)", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    // search and lang should NOT count
    act(() => result.current.setFilters({ search: "test", lang: "en" }));
    expect(result.current.activeAdvancedFilterCount).toBe(0);
  });

  it("activeAdvancedFilterCount increments for advanced keys", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.setFilters({ pos: "Noun", source: "OAL", reviewer: "Minh" }));
    expect(result.current.activeAdvancedFilterCount).toBe(3);
  });

  it("activeAdvancedFilterCount counts hasAudio and missing", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.setFilters({ hasAudio: true, missing: "example" }));
    expect(result.current.activeAdvancedFilterCount).toBe(2);
  });

  // Page resets to 1 on filter change
  it("resets page to 1 when filters change", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
    act(() => result.current.setFilters({ search: "ephemeral" }));
    expect(result.current.page).toBe(1);
  });

  it("resets page to 1 when strip filter changes", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.setPage(2));
    act(() => result.current.setStripFilter("published"));
    expect(result.current.page).toBe(1);
  });

  // selectPage
  it("selectPage() sets selectedIds to IDs of current paginated items", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.selectPage());
    const paginatedIds = result.current.paginated.map((i) => i.id);
    expect(result.current.selectedIds).toEqual(paginatedIds);
  });

  it("selectPage() replaces previous selection rather than appending", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    // Select all on page 1
    act(() => result.current.selectPage());
    const page1Ids = [...result.current.selectedIds];
    // Go to page 2 and selectPage again
    act(() => result.current.setPage(2));
    act(() => result.current.selectPage());
    const page2Ids = result.current.paginated.map((i) => i.id);
    // Should be only page 2 IDs, not page 1 + page 2
    expect(result.current.selectedIds).toEqual(page2Ids);
    expect(result.current.selectedIds).not.toEqual(expect.arrayContaining(page1Ids));
  });

  // clearSelection
  it("clearSelection() resets selectedIds to empty array", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.selectPage());
    expect(result.current.selectedIds.length).toBeGreaterThan(0);
    act(() => result.current.clearSelection());
    expect(result.current.selectedIds).toEqual([]);
  });

  // Selection pruning
  it("prunes selectedIds when filter narrows results", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    // Select vi-001 (en/published) and vi-004 (ja/published)
    act(() => {
      result.current.toggleSelect("vi-001");
      result.current.toggleSelect("vi-004");
    });
    expect(result.current.selectedIds).toContain("vi-001");
    expect(result.current.selectedIds).toContain("vi-004");
    // Now filter to only ja items — vi-001 (en) should be pruned
    act(() => result.current.setFilters({ lang: "ja" }));
    expect(result.current.selectedIds).not.toContain("vi-001");
    expect(result.current.selectedIds).toContain("vi-004");
  });

  // toggleSelect
  it("toggleSelect adds an ID if absent", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.toggleSelect("vi-001"));
    expect(result.current.selectedIds).toContain("vi-001");
  });

  it("toggleSelect removes an ID if present", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => result.current.toggleSelect("vi-001"));
    act(() => result.current.toggleSelect("vi-001"));
    expect(result.current.selectedIds).not.toContain("vi-001");
  });

  // statusCounts
  it("statusCounts returns correct total and per-status counts", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    expect(result.current.statusCounts["all"]).toBe(12);
    // vi-001, vi-002, vi-004, vi-007, vi-010 = 5 published
    expect(result.current.statusCounts["published"]).toBe(5);
    // vi-005, vi-009 = 2 draft
    expect(result.current.statusCounts["draft"]).toBe(2);
    // vi-003, vi-005, vi-009, vi-012 = 4 ai_generated
    expect(result.current.statusCounts["ai_generated"]).toBe(4);
  });

  // totalPages
  it("totalPages is at least 1", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    // Filter to 0 results
    act(() => result.current.setFilters({ search: "ZZZNOMATCH99999" }));
    expect(result.current.filtered.length).toBe(0);
    expect(result.current.totalPages).toBe(1);
  });

  it("totalPages is 2 for 12 items with PAGE_SIZE=8", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    expect(result.current.totalPages).toBe(2);
  });

  // clearFilters
  it("clearFilters resets all filters and strip to defaults", () => {
    const { result } = renderHook(() => useVocabListFilters(VOCAB_ITEMS_MOCK));
    act(() => {
      result.current.setStripFilter("published");
      result.current.setFilters({ search: "test", lang: "en" });
    });
    act(() => result.current.clearFilters());
    expect(result.current.stripFilter).toBe("all");
    expect(result.current.filters).toEqual({});
    expect(result.current.filtered.length).toBe(12);
  });
});
