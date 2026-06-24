import { describe, it, expect } from "vitest";
import { blankQuestion } from "../../mock/blank-question";

describe("blankQuestion()", () => {
  it("mcq: has 3 default choices, exactly one correct", () => {
    const q = blankQuestion("mcq");
    expect(q.type).toBe("mcq");
    expect(q.choices).toHaveLength(3);
    expect(q.choices!.filter((c) => c.correct)).toHaveLength(1);
    expect(q.choices![0]!.correct).toBe(true);
  });

  it("multi: has 4 choices, first two correct", () => {
    const q = blankQuestion("multi");
    expect(q.choices).toHaveLength(4);
    expect(q.choices!.filter((c) => c.correct)).toHaveLength(2);
  });

  it("fill: stem contains {{1}}, one blank at pos 1", () => {
    const q = blankQuestion("fill");
    expect(q.stem).toContain("{{1}}");
    expect(q.blanks).toHaveLength(1);
    expect(q.blanks![0]!.pos).toBe(1);
  });

  it("matching: has 2 empty pairs", () => {
    const q = blankQuestion("matching");
    expect(q.pairs).toHaveLength(2);
    expect(q.pairs![0]!.left).toBe("");
  });

  it("ordering: has 2 items, correctPos 1 and 2", () => {
    const q = blankQuestion("ordering");
    expect(q.orderItems).toHaveLength(2);
    expect(q.orderItems![0]!.correctPos).toBe(1);
    expect(q.orderItems![1]!.correctPos).toBe(2);
  });

  it("tfng: judgeAnswer is 'true', has one answerKey", () => {
    const q = blankQuestion("tfng");
    expect(q.judgeAnswer).toBe("true");
    expect(q.answerKeys).toHaveLength(1);
    expect(q.answerKeys![0]!.value).toBe("true");
  });

  it("ynng: judgeAnswer is 'yes'", () => {
    const q = blankQuestion("ynng");
    expect(q.judgeAnswer).toBe("yes");
    expect(q.answerKeys![0]!.value).toBe("yes");
  });

  it("short: has one empty answerKey, maxWords=3", () => {
    const q = blankQuestion("short");
    expect(q.answerKeys).toHaveLength(1);
    expect(q.maxWords).toBe(3);
  });

  it("writing: points=9, rubricId empty, minWords=250", () => {
    const q = blankQuestion("writing");
    expect(q.points).toBe(9);
    expect(q.rubricId).toBe("");
    expect(q.minWords).toBe(250);
  });

  it("speaking: points=9, suggestedTime=2, prepTime=1", () => {
    const q = blankQuestion("speaking");
    expect(q.points).toBe(9);
    expect(q.suggestedTime).toBe(2);
    expect(q.prepTime).toBe(1);
  });

  it("all types: status is 'draft', groupId is null, tagIds is []", () => {
    const types = ["mcq","multi","fill","matching","tfng","ynng","ordering","short","writing","speaking"] as const;
    for (const t of types) {
      const q = blankQuestion(t);
      expect(q.status).toBe("draft");
      expect(q.groupId).toBeNull();
      expect(q.tagIds).toEqual([]);
    }
  });
});
