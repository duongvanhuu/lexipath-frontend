import type { GoldenTimeExercise, GoldenTimeSessionMeta } from "./golden-time-session.types";

/* ── English exercises ─────────────────────────────────────────────────── */

const EN_EXERCISES: GoldenTimeExercise[] = [
  {
    id: "gt-1",
    type: "choice",
    reason: "overdue",
    skillKey: "meaning",
    dueLabel: "Quá hạn 2 ngày",
    word: "accomplish",
    ipa: "/əˈkʌm.plɪʃ/",
    meaning: "hoàn thành, đạt được",
    pos: "verb",
    lang: "en-US",
    prompt: "Chọn nghĩa đúng của từ:",
    choices: [
      "hoàn thành, đạt được",
      "từ chối, phủ nhận",
      "tranh luận, phản đối",
      "mô tả, giải thích",
    ],
    correctChoiceIndex: 0,
    explanation:
      "'Accomplish' có nghĩa là hoàn thành hoặc đạt được điều gì đó sau nhiều nỗ lực.",
    xpReward: 12,
  },
  {
    id: "gt-2",
    type: "audio",
    reason: "exam_miss",
    skillKey: "listening",
    word: "determine",
    ipa: "/dɪˈtɜː.mɪn/",
    meaning: "xác định, quyết tâm",
    pos: "verb",
    lang: "en-US",
    prompt: "Nghe và chọn từ bạn vừa nghe:",
    choices: ["determine", "terminate", "germinate", "denominate"],
    correctChoiceIndex: 0,
    explanation:
      "'Determine' có nghĩa là xác định hoặc quyết định điều gì đó một cách dứt khoát.",
    xpReward: 12,
  },
  {
    id: "gt-3",
    type: "fill_blank",
    reason: "weak",
    skillKey: "usage",
    word: "negotiate",
    ipa: "/nɪˈɡəʊ.ʃi.eɪt/",
    meaning: "đàm phán, thương lượng",
    pos: "verb",
    lang: "en-US",
    sentenceBefore: "The two sides agreed to",
    sentenceAfter: "a new trade deal.",
    correctAnswer: "negotiate",
    explanation:
      "'Negotiate' được dùng khi hai bên thảo luận để đạt được thỏa thuận.",
    xpReward: 15,
  },
  {
    id: "gt-4",
    type: "collocation",
    reason: "due",
    skillKey: "collocation",
    dueLabel: "Hôm nay",
    word: "revenue",
    ipa: "/ˈrev.ə.njuː/",
    meaning: "doanh thu, nguồn thu",
    pos: "noun",
    lang: "en-US",
    prompt: "Chọn cụm từ đúng đi với 'revenue':",
    baseWord: "revenue",
    collocationOptions: [
      "generate revenue",
      "make revenue",
      "do revenue",
      "create revenue",
    ],
    correctCollocationIndex: 0,
    explanation:
      "'Generate revenue' (tạo ra doanh thu) là cụm cố định đúng. 'Make/do/create revenue' không tự nhiên trong tiếng Anh kinh doanh.",
    xpReward: 15,
  },
  {
    id: "gt-5",
    type: "spelling",
    reason: "due",
    skillKey: "spelling",
    dueLabel: "Hôm nay",
    word: "persevere",
    ipa: "/ˌpɜː.sɪˈvɪər/",
    meaning: "kiên trì, bền bỉ",
    pos: "verb",
    lang: "en-US",
    prompt: "Nghe phát âm và gõ lại từ:",
    hint: "Gợi ý: p _ r s _ v _ r _",
    correctAnswer: "persevere",
    explanation:
      "'Persevere' có nghĩa là tiếp tục nỗ lực dù gặp khó khăn — chú ý cách viết: per-se-vere.",
    xpReward: 18,
  },
  {
    id: "gt-6",
    type: "choice",
    reason: "weak",
    skillKey: "meaning",
    word: "collaborate",
    ipa: "/kəˈlæb.ər.eɪt/",
    meaning: "cộng tác, hợp tác",
    pos: "verb",
    lang: "en-US",
    prompt: "Chọn nghĩa đúng của từ:",
    choices: [
      "cộng tác, hợp tác",
      "cạnh tranh, đối đầu",
      "phê bình, chỉ trích",
      "suy nghĩ, cân nhắc",
    ],
    correctChoiceIndex: 0,
    explanation:
      "'Collaborate' nghĩa là làm việc cùng nhau hướng đến một mục tiêu chung.",
    xpReward: 12,
  },
  {
    id: "gt-7",
    type: "fill_blank",
    reason: "overdue",
    skillKey: "usage",
    dueLabel: "Quá hạn 1 ngày",
    word: "initiative",
    ipa: "/ɪˈnɪʃ.ə.tɪv/",
    meaning: "sáng kiến, chủ động",
    pos: "noun",
    lang: "en-US",
    sentenceBefore: "She took the",
    sentenceAfter: "to launch the new campaign.",
    correctAnswer: "initiative",
    explanation:
      "'Take the initiative' (chủ động ra tay trước) là cụm cố định phổ biến trong tiếng Anh.",
    xpReward: 15,
  },
  {
    id: "gt-8",
    type: "audio",
    reason: "due",
    skillKey: "listening",
    dueLabel: "Hôm nay",
    word: "implement",
    ipa: "/ˈɪm.plɪ.ment/",
    meaning: "thực hiện, triển khai",
    pos: "verb",
    lang: "en-US",
    prompt: "Nghe và chọn từ bạn vừa nghe:",
    choices: ["implement", "compliment", "supplement", "replicate"],
    correctChoiceIndex: 0,
    explanation:
      "'Implement' có nghĩa là đưa vào thực tế, triển khai một kế hoạch hay quyết định.",
    xpReward: 12,
  },
];

/* ── Japanese exercises ────────────────────────────────────────────────── */

const JA_EXERCISES: GoldenTimeExercise[] = [
  {
    id: "ja-1",
    type: "choice",
    reason: "overdue",
    skillKey: "meaning",
    dueLabel: "Quá hạn",
    word: "勉強",
    reading: "べんきょう",
    meaning: "học tập",
    pos: "noun",
    lang: "ja-JP",
    prompt: "Chọn nghĩa đúng của từ:",
    choices: ["học tập", "công việc", "nghỉ ngơi", "du lịch"],
    correctChoiceIndex: 0,
    explanation:
      "勉強 (benkyō) — 'việc học'. Ví dụ: 毎日勉強します (Tôi học mỗi ngày).",
    xpReward: 12,
  },
  {
    id: "ja-2",
    type: "audio",
    reason: "due",
    skillKey: "listening",
    dueLabel: "Hôm nay",
    word: "約束",
    reading: "やくそく",
    meaning: "lời hứa, cuộc hẹn",
    pos: "noun",
    lang: "ja-JP",
    prompt: "Nghe và chọn từ đúng:",
    choices: ["約束 (やくそく)", "勉強 (べんきょう)", "感謝 (かんしゃ)", "努力 (どりょく)"],
    correctChoiceIndex: 0,
    explanation: "約束 (yakusoku) — 'lời hứa, cuộc hẹn'. Âm: ya-ku-so-ku.",
    xpReward: 12,
  },
  {
    id: "ja-3",
    type: "spelling",
    reason: "weak",
    skillKey: "spelling",
    word: "感謝",
    reading: "かんしゃ",
    meaning: "lòng biết ơn",
    pos: "noun",
    lang: "ja-JP",
    prompt: "Nghe từ và gõ phiên âm romaji:",
    hint: "Gợi ý: bắt đầu bằng 'k'",
    correctAnswer: "kansha",
    explanation: "感謝 (kansha) — 'lòng biết ơn'. Phiên âm: k-a-n-s-h-a.",
    xpReward: 15,
  },
  {
    id: "ja-4",
    type: "fill_blank",
    reason: "due",
    skillKey: "usage",
    dueLabel: "Hôm nay",
    word: "努力",
    reading: "どりょく",
    meaning: "nỗ lực",
    pos: "noun",
    lang: "ja-JP",
    sentenceBefore: "___",
    sentenceAfter: "は裏切らない。",
    correctAnswer: "努力",
    explanation:
      "努力は裏切らない — 'Nỗ lực sẽ không phản bội bạn.' Câu danh ngôn nổi tiếng trong tiếng Nhật.",
    xpReward: 15,
  },
  {
    id: "ja-5",
    type: "choice",
    reason: "exam_miss",
    skillKey: "collocation",
    dueLabel: "Sai bài thi",
    word: "経験",
    reading: "けいけん",
    meaning: "kinh nghiệm",
    pos: "noun",
    lang: "ja-JP",
    prompt: "Chọn cách đọc đúng của từ này:",
    choices: ["けいけん (keiken)", "かんしゃ (kansha)", "きんちょう (kinchō)", "せいちょう (seichō)"],
    correctChoiceIndex: 0,
    explanation:
      "経験 — 'kinh nghiệm'. 経 (kei) = trải qua, 験 (ken) = kiểm nghiệm.",
    xpReward: 15,
  },
];

/* ── Chinese exercises ─────────────────────────────────────────────────── */

const ZH_EXERCISES: GoldenTimeExercise[] = [
  {
    id: "zh-1",
    type: "choice",
    reason: "overdue",
    skillKey: "meaning",
    dueLabel: "Quá hạn",
    word: "你好",
    reading: "nǐ hǎo",
    meaning: "xin chào",
    pos: "phrase",
    lang: "zh-CN",
    prompt: "Chọn nghĩa đúng của từ:",
    choices: ["xin chào", "cảm ơn", "tạm biệt", "bạn khỏe không?"],
    correctChoiceIndex: 0,
    explanation: '"你好" (nǐ hǎo) — xin chào. 你 = bạn, 好 = tốt.',
    xpReward: 12,
  },
  {
    id: "zh-2",
    type: "audio",
    reason: "exam_miss",
    skillKey: "listening",
    dueLabel: "Sai bài thi",
    word: "谢谢",
    reading: "xiè xie",
    meaning: "cảm ơn",
    pos: "phrase",
    lang: "zh-CN",
    prompt: "Nghe và chọn từ đúng:",
    choices: ["谢谢 (xiè xie)", "你好 (nǐ hǎo)", "再见 (zài jiàn)", "对不起 (duì bu qǐ)"],
    correctChoiceIndex: 0,
    explanation: '"谢谢" (xiè xie) — cảm ơn. Thanh điệu: 4-neutral.',
    xpReward: 12,
  },
  {
    id: "zh-3",
    type: "spelling",
    reason: "weak",
    skillKey: "spelling",
    word: "老师",
    reading: "lǎo shī",
    meaning: "giáo viên, thầy cô",
    pos: "noun",
    lang: "zh-CN",
    prompt: "Nghe và gõ Pinyin của từ này:",
    hint: "Gợi ý: lao shi (thanh 3-1)",
    correctAnswer: "lǎo shī",
    explanation: '"老师" (lǎo shī) — giáo viên. 老=lǎo (già), 师=shī (thầy).',
    xpReward: 15,
  },
  {
    id: "zh-4",
    type: "choice",
    reason: "due",
    skillKey: "collocation",
    dueLabel: "Hôm nay",
    word: "学生",
    reading: "xuésheng",
    meaning: "học sinh",
    pos: "noun",
    lang: "zh-CN",
    prompt: 'Chọn chữ Hán đúng cho "xuésheng" (học sinh):',
    choices: ["学生", "老师", "朋友", "家人"],
    correctChoiceIndex: 0,
    explanation: '"学生" (xuésheng) — học sinh. 学=học, 生=sinh/người.',
    xpReward: 15,
  },
];

/* ── Session getter ────────────────────────────────────────────────────── */

function resolveExercises(sessionId: string): {
  exercises: GoldenTimeExercise[];
  lang: string;
  windowMessage: string;
} {
  if (sessionId.startsWith("ja")) {
    return {
      exercises: JA_EXERCISES,
      lang: "ja-JP",
      windowMessage: "Ôn đúng thời điểm — trước khi quên · ~5 phút",
    };
  }
  if (sessionId.startsWith("zh")) {
    return {
      exercises: ZH_EXERCISES,
      lang: "zh-CN",
      windowMessage: "Ôn ngay — cửa sổ tốt nhất trong ngày hôm nay · ~4 phút",
    };
  }
  return {
    exercises: EN_EXERCISES,
    lang: "en-US",
    windowMessage: "Ôn đúng thời điểm — trước khi quên · ~7 phút",
  };
}

export function getMockGoldenTimeSession(sessionId: string): {
  exercises: GoldenTimeExercise[];
  meta: GoldenTimeSessionMeta;
} {
  const { exercises, lang, windowMessage } = resolveExercises(sessionId);
  return {
    exercises,
    meta: {
      sessionId,
      lessonTitle: "Golden Time",
      queueCount: exercises.length,
      windowMessage,
      lang,
      returnHref: "/golden-time",
    },
  };
}
