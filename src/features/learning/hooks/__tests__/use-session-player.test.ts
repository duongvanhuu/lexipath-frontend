import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useSessionPlayer } from "../use-session-player";
import type { SessionExercise } from "@/features/learning/types/session.types";

const CHOICE_EXERCISE: SessionExercise = {
  id: "ex-1",
  type: "choice",
  word: "ephemeral",
  meaning: "phù du",
  lang: "en-US",
  choices: ["phù du", "bất diệt", "mơ hồ", "đáng kính"],
  correctChoiceIndex: 0,
  xpReward: 10,
};

const SPELLING_EXERCISE: SessionExercise = {
  id: "ex-2",
  type: "spelling",
  word: "meticulous",
  meaning: "tỉ mỉ",
  lang: "en-US",
  correctAnswer: "meticulous",
  xpReward: 20,
};

describe("useSessionPlayer — exerciseResults", () => {
  it("starts with empty exerciseResults", () => {
    const { result } = renderHook(() =>
      useSessionPlayer([CHOICE_EXERCISE, SPELLING_EXERCISE])
    );
    expect(result.current.exerciseResults).toEqual([]);
  });

  it("records a correct result after selectAndSubmit with correct choice", () => {
    const { result } = renderHook(() =>
      useSessionPlayer([CHOICE_EXERCISE, SPELLING_EXERCISE])
    );
    act(() => {
      result.current.selectAndSubmit(0); // index 0 = correct
    });
    expect(result.current.exerciseResults).toEqual([
      { exerciseId: "ex-1", type: "choice", correct: true },
    ]);
  });

  it("records an incorrect result after selectAndSubmit with wrong choice", () => {
    const { result } = renderHook(() =>
      useSessionPlayer([CHOICE_EXERCISE, SPELLING_EXERCISE])
    );
    act(() => {
      result.current.selectAndSubmit(2); // index 2 = wrong
    });
    expect(result.current.exerciseResults).toEqual([
      { exerciseId: "ex-1", type: "choice", correct: false },
    ]);
  });

  it("does not record duplicate result if selectAndSubmit called twice for same exercise", () => {
    const { result } = renderHook(() =>
      useSessionPlayer([CHOICE_EXERCISE, SPELLING_EXERCISE])
    );
    act(() => {
      result.current.selectAndSubmit(2); // wrong
      result.current.selectAndSubmit(0); // would be correct — but locked
    });
    expect(result.current.exerciseResults).toHaveLength(1);
    expect(result.current.exerciseResults[0]?.correct).toBe(false);
  });
});

describe("useSessionPlayer — skillBreakdown", () => {
  it("starts with empty skillBreakdown", () => {
    const { result } = renderHook(() =>
      useSessionPlayer([CHOICE_EXERCISE, SPELLING_EXERCISE])
    );
    expect(result.current.skillBreakdown).toEqual([]);
  });

  it("groups choice exercise under meaning skill", () => {
    const { result } = renderHook(() =>
      useSessionPlayer([CHOICE_EXERCISE, SPELLING_EXERCISE])
    );
    act(() => {
      result.current.selectAndSubmit(0); // correct choice
    });
    expect(result.current.skillBreakdown).toEqual([
      { skill: "meaning", label: "Ý nghĩa", correct: 1, total: 1 },
    ]);
  });

  it("groups spelling exercise under spelling skill", () => {
    const { result } = renderHook(() =>
      useSessionPlayer([CHOICE_EXERCISE, SPELLING_EXERCISE])
    );
    // advance to spelling exercise
    act(() => {
      result.current.selectAndSubmit(0); // correct choice on ex-1
    });
    act(() => {
      result.current.advance();
    });
    // now on ex-2 (spelling)
    act(() => {
      result.current.setTextInput("meticulous");
    });
    act(() => {
      result.current.submit();
    });
    const breakdown = result.current.skillBreakdown;
    expect(breakdown).toContainEqual({
      skill: "meaning",
      label: "Ý nghĩa",
      correct: 1,
      total: 1,
    });
    expect(breakdown).toContainEqual({
      skill: "spelling",
      label: "Chính tả",
      correct: 1,
      total: 1,
    });
  });

  it("sorts breakdown in skill order: meaning before spelling", () => {
    const { result } = renderHook(() =>
      useSessionPlayer([CHOICE_EXERCISE, SPELLING_EXERCISE])
    );
    act(() => { result.current.selectAndSubmit(0); });
    act(() => { result.current.advance(); });
    act(() => { result.current.setTextInput("meticulous"); });
    act(() => { result.current.submit(); });
    const skills = result.current.skillBreakdown.map((s) => s.skill);
    expect(skills.indexOf("meaning")).toBeLessThan(skills.indexOf("spelling"));
  });
});
