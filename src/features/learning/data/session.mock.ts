import type { SessionExercise, SessionMeta } from "../types/session.types";

const EXERCISES: SessionExercise[] = [
  {
    id: "1",
    type: "flashcard",
    word: "resilient",
    ipa: "/rɪˈzɪliənt/",
    meaning: "có khả năng hồi phục, kiên cường",
    pos: "adj",
    example: "She is remarkably resilient despite the hardships.",
    exampleTranslation: "Cô ấy rất kiên cường dù trải qua nhiều khó khăn.",
    lang: "en-US",
    xpReward: 10,
  },
  {
    id: "2",
    type: "choice",
    word: "ephemeral",
    ipa: "/ɪˈfem.ər.əl/",
    meaning: "phù du, ngắn ngủi",
    pos: "adj",
    lang: "en-US",
    prompt: "Chọn nghĩa đúng của từ:",
    choices: [
      "phù du, ngắn ngủi",
      "bất diệt, trường tồn",
      "mơ hồ, không rõ ràng",
      "đáng kính, trang trọng",
    ],
    correctChoiceIndex: 0,
    explanation:
      "'Ephemeral' mô tả thứ gì đó chỉ tồn tại trong thời gian rất ngắn.",
    xpReward: 10,
  },
  {
    id: "3",
    type: "audio",
    word: "ambiguous",
    ipa: "/æmˈbɪɡ.ju.əs/",
    meaning: "mơ hồ, hai nghĩa",
    pos: "adj",
    lang: "en-US",
    prompt: "Nghe và chọn từ bạn vừa nghe:",
    choices: ["ambiguous", "ambitious", "ambivalent", "ambiance"],
    correctChoiceIndex: 0,
    explanation:
      "'Ambiguous' có nghĩa là không rõ ràng, có thể hiểu theo nhiều cách khác nhau.",
    xpReward: 10,
  },
  {
    id: "4",
    type: "fill_blank",
    word: "persevere",
    meaning: "kiên trì, bền bỉ",
    lang: "en-US",
    sentenceBefore: "You must",
    sentenceAfter: "even when things get difficult.",
    correctAnswer: "persevere",
    explanation:
      "'Persevere' có nghĩa là tiếp tục nỗ lực dù gặp khó khăn hoặc thất vọng.",
    xpReward: 15,
  },
  {
    id: "5",
    type: "spelling",
    word: "meticulous",
    ipa: "/məˈtɪk.jʊ.ləs/",
    meaning: "tỉ mỉ, cẩn thận từng chi tiết",
    pos: "adj",
    lang: "en-US",
    prompt: "Nghe phát âm và gõ lại từ:",
    hint: "Gợi ý: m _ t _ c _ l _ _ s",
    correctAnswer: "meticulous",
    explanation:
      "'Meticulous' dùng để chỉ người rất cẩn thận và chú ý đến từng chi tiết nhỏ.",
    xpReward: 20,
  },
  {
    id: "6",
    type: "collocation",
    word: "make",
    meaning: "make + ?",
    lang: "en-US",
    prompt: "Chọn cụm từ đúng đi với 'make':",
    baseWord: "make",
    collocationOptions: ["a decision", "a travel", "a weather", "a research"],
    correctCollocationIndex: 0,
    explanation:
      "'Make a decision' (đưa ra quyết định) là cụm cố định đúng trong tiếng Anh. Các cụm khác không tự nhiên.",
    xpReward: 15,
  },
];

export function getMockSession(sessionId: string): {
  exercises: SessionExercise[];
  meta: SessionMeta;
} {
  return {
    exercises: EXERCISES,
    meta: {
      sessionId,
      lessonTitle: "Từ vựng học thuật",
      collectionTitle: "Academic English",
      lang: "en-US",
      returnHref: "/collections/english-academic",
    },
  };
}
