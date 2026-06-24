import type { Question, QuestionType } from "../types/question-bank.types";

function baseQuestion(type: QuestionType): Question {
  return {
    id: `q-new-${Date.now()}`,
    type,
    skill: "reading",
    programId: "p-ielts",
    difficulty: "medium",
    points: 1,
    status: "draft",
    stem: "",
    explanation: "",
    groupId: null,
    tagIds: [],
    sourceId: "",
    vocabIds: [],
    updatedAt: new Date().toLocaleDateString("vi-VN"),
  };
}

export function blankQuestion(type: QuestionType): Question {
  const base = baseQuestion(type);
  switch (type) {
    case "mcq":
      return { ...base, choices: [
        { key: "A", text: "", correct: true  },
        { key: "B", text: "", correct: false },
        { key: "C", text: "", correct: false },
      ]};
    case "multi":
      return { ...base, choices: [
        { key: "A", text: "", correct: true  },
        { key: "B", text: "", correct: true  },
        { key: "C", text: "", correct: false },
        { key: "D", text: "", correct: false },
      ]};
    case "fill":
      return { ...base, stem: "{{1}} …", blanks: [{ pos: 1, accepted: [], caseSensitive: false }] };
    case "matching":
      return { ...base, pairs: [{ left: "", right: "" }, { left: "", right: "" }] };
    case "ordering":
      return { ...base, orderItems: [{ text: "", correctPos: 1 }, { text: "", correctPos: 2 }] };
    case "tfng":
      return { ...base, judgeAnswer: "true", answerKeys: [{ value: "true" }] };
    case "ynng":
      return { ...base, judgeAnswer: "yes", answerKeys: [{ value: "yes" }] };
    case "short":
      return { ...base, answerKeys: [{ value: "" }], maxWords: 3 };
    case "writing":
      return { ...base, points: 9, rubricId: "", minWords: 250, suggestedTime: 40 };
    case "speaking":
      return { ...base, points: 9, rubricId: "", suggestedTime: 2, prepTime: 1 };
  }
}
