import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useQuestionBankFilters } from "../use-question-bank-filters";
import { QB_QUESTIONS } from "../../mock/question-bank.mock";

// ── helpers ──────────────────────────────────────────────────────────────────
const published = QB_QUESTIONS.filter((q) => q.status === "published").length;
const review    = QB_QUESTIONS.filter((q) => q.status === "review").length;
const draft     = QB_QUESTIONS.filter((q) => q.status === "draft").length;

describe("useQuestionBankFilters", () => {
  // ── default state ───────────────────────────────────────────────────────
  it("default: returns all questions (no filters applied)", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    expect(result.current.filteredQuestions.length).toBe(QB_QUESTIONS.length);
  });

  // ── search ──────────────────────────────────────────────────────────────
  it("search by stem substring", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("search", "solar"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) =>
      expect(q.stem.toLowerCase()).toContain("solar")
    );
  });

  it("search is case-insensitive (uppercase search finds lowercase stem)", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("search", "SOLAR"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) =>
      expect(q.stem.toLowerCase()).toContain("solar")
    );
  });

  // ── type filters ────────────────────────────────────────────────────────
  it("type filter narrows to matching question.type", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("type", "mcq"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) => expect(q.type).toBe("mcq"));
  });

  it("filter by at least one 'choice' type (mcq or multi)", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("type", "multi"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) => expect(q.type).toBe("multi"));
  });

  it("filter by at least one 'structured' type (fill, matching, ordering, short)", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("type", "fill"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) => expect(q.type).toBe("fill"));
  });

  it("filter by at least one 'open prompt' type (writing or speaking)", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("type", "writing"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) => expect(q.type).toBe("writing"));
  });

  // ── skill filter ────────────────────────────────────────────────────────
  it("skill filter narrows to matching question.skill", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("skill", "grammar"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) => expect(q.skill).toBe("grammar"));
  });

  // ── programId filter ────────────────────────────────────────────────────
  it("program filter narrows to matching question.programId", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("programId", "p-hsk"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) => expect(q.programId).toBe("p-hsk"));
  });

  // ── status filter ───────────────────────────────────────────────────────
  it("status filter: 'published' returns only published questions", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("status", "published"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) => expect(q.status).toBe("published"));
  });

  it("status filter: 'review' returns only review questions", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("status", "review"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) => expect(q.status).toBe("review"));
  });

  it("status filter: 'draft' returns only draft questions", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("status", "draft"));
    expect(result.current.filteredQuestions.length).toBeGreaterThan(0);
    result.current.filteredQuestions.forEach((q) => expect(q.status).toBe("draft"));
  });

  // ── combined filter ─────────────────────────────────────────────────────
  it("combined type+skill uses AND logic", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => {
      result.current.setFilters({
        search: "",
        type: "mcq",
        skill: "grammar",
        programId: "all",
        status: "all",
      });
    });
    result.current.filteredQuestions.forEach((q) => {
      expect(q.type).toBe("mcq");
      expect(q.skill).toBe("grammar");
    });
  });

  // ── clearFilters ────────────────────────────────────────────────────────
  it("clearFilters resets to default (all questions returned, activeFilterCount=0)", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("type", "mcq"));
    act(() => result.current.clearFilters());
    expect(result.current.filteredQuestions.length).toBe(QB_QUESTIONS.length);
    expect(result.current.activeFilterCount).toBe(0);
  });

  // ── activeFilterCount ───────────────────────────────────────────────────
  it("activeFilterCount is 0 by default", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    expect(result.current.activeFilterCount).toBe(0);
  });

  it("activeFilterCount increments per active filter", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => {
      result.current.setFilters({
        search: "test",
        type: "mcq",
        skill: "all",
        programId: "all",
        status: "all",
      });
    });
    expect(result.current.activeFilterCount).toBe(2); // search + type
  });

  // ── stats ───────────────────────────────────────────────────────────────
  it("stats.total equals QB_QUESTIONS.length regardless of active filters", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("type", "mcq"));
    expect(result.current.stats.total).toBe(QB_QUESTIONS.length);
  });

  it("stats.published/review/draft counts come from full list, not filtered", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("type", "mcq"));
    expect(result.current.stats.published).toBe(published);
    expect(result.current.stats.review).toBe(review);
    expect(result.current.stats.draft).toBe(draft);
  });

  // ── selection ───────────────────────────────────────────────────────────
  it("setSelectedIds sets selectedIds", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.setSelectedIds(["q-mcq-1", "q-mcq-2"]));
    expect(result.current.selectedIds).toEqual(["q-mcq-1", "q-mcq-2"]);
  });

  it("clearSelection empties selectedIds", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.setSelectedIds(["q-mcq-1"]));
    act(() => result.current.clearSelection());
    expect(result.current.selectedIds).toEqual([]);
  });

  it("selectedIds pruned when filters change (select an id, set type filter that excludes it, verify it's gone)", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    // q-match-1 is type "matching", not "mcq"
    act(() => result.current.setSelectedIds(["q-mcq-1", "q-match-1"]));
    // Filter to mcq only — q-match-1 should be pruned
    act(() => result.current.updateFilter("type", "mcq"));
    expect(result.current.selectedIds).toContain("q-mcq-1");
    expect(result.current.selectedIds).not.toContain("q-match-1");
  });

  // ── edge cases ──────────────────────────────────────────────────────────
  it("empty result: non-matching search returns []", () => {
    const { result } = renderHook(() => useQuestionBankFilters(QB_QUESTIONS));
    act(() => result.current.updateFilter("search", "ZZZNOMATCH99"));
    expect(result.current.filteredQuestions).toEqual([]);
  });

  it("hook does not mutate the input array (check input.length unchanged after filtering)", () => {
    const input = [...QB_QUESTIONS];
    const originalLength = input.length;
    const { result } = renderHook(() => useQuestionBankFilters(input));
    act(() => result.current.updateFilter("type", "mcq"));
    expect(input.length).toBe(originalLength);
  });

  // ── readonly input (compile-time check via type assignment) ─────────────
  it("readonly input: hook accepts readonly Question[]", () => {
    const readonlyQuestions: readonly (typeof QB_QUESTIONS)[number][] = QB_QUESTIONS;
    const { result } = renderHook(() => useQuestionBankFilters(readonlyQuestions));
    expect(result.current.filteredQuestions.length).toBe(QB_QUESTIONS.length);
  });
});
