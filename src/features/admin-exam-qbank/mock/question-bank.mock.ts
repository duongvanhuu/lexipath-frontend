import type {
  Question, QuestionGroup, QuestionTag, QuestionSource,
  ExamProgram, ExamRubric, QuestionVocabItem,
  QuestionBankMock, QuestionTypeInfo, QuestionDiffInfo, QuestionSkillInfo,
  QuestionType, Difficulty, Skill,
} from "../types/question-bank.types";

// ─── Type registry ────────────────────────────────────────────────────────
const QB_TYPES: QuestionTypeInfo[] = [
  { id:"mcq",      name:"Trắc nghiệm 1 đáp án",  short:"MCQ",   icon:"circle-dot",    color:"#2563EB", auto:true,  desc:"Chọn đúng 1 trong nhiều lựa chọn." },
  { id:"multi",    name:"Chọn nhiều đáp án",      short:"Multi", icon:"check-square",  color:"#0891B2", auto:true,  desc:"Chọn 2 hoặc nhiều lựa chọn đúng." },
  { id:"fill",     name:"Điền chỗ trống",         short:"Fill",  icon:"pencil-line",   color:"#7C3AED", auto:true,  desc:"Điền từ vào ô trống trong câu/đoạn." },
  { id:"matching", name:"Ghép đôi",               short:"Match", icon:"shuffle",       color:"#DB2777", auto:true,  desc:"Nối các mục bên trái với bên phải." },
  { id:"tfng",     name:"True / False / NG",      short:"TFNG",  icon:"scale",         color:"#059669", auto:true,  desc:"Đúng / Sai / Không có thông tin." },
  { id:"ynng",     name:"Yes / No / NG",          short:"YNNG",  icon:"check-check",   color:"#16A34A", auto:true,  desc:"Có / Không / Không có thông tin." },
  { id:"ordering", name:"Sắp xếp thứ tự",         short:"Order", icon:"list-ordered",  color:"#D97706", auto:true,  desc:"Kéo sắp xếp các mục theo đúng thứ tự." },
  { id:"short",    name:"Trả lời ngắn",           short:"Short", icon:"type",          color:"#0284C7", auto:true,  desc:"Nhập câu trả lời ngắn (tự chấm theo từ khóa)." },
  { id:"writing",  name:"Bài viết",               short:"Write", icon:"file-text",     color:"#9333EA", auto:false, desc:"Đề bài viết luận — chấm bằng rubric." },
  { id:"speaking", name:"Nói",                    short:"Speak", icon:"mic",           color:"#E11D48", auto:false, desc:"Đề nói — chấm bằng rubric." },
];

export const QB_TYPE_REGISTRY: Record<QuestionType, QuestionTypeInfo> =
  Object.fromEntries(QB_TYPES.map((t) => [t.id, t])) as Record<QuestionType, QuestionTypeInfo>;

// ─── Difficulty registry ──────────────────────────────────────────────────
export const QB_DIFF_REGISTRY: Record<Difficulty, QuestionDiffInfo> = {
  easy:   { label: "Dễ",         color: "#2563EB" },
  medium: { label: "Trung bình", color: "#D97706" },
  hard:   { label: "Khó",        color: "#DC2626" },
};

// ─── Skill registry ───────────────────────────────────────────────────────
export const QB_SKILL_REGISTRY: QuestionSkillInfo[] = [
  { id: "listening", name: "Nghe",     icon: "headphones" },
  { id: "reading",   name: "Đọc",      icon: "book-open" },
  { id: "writing",   name: "Viết",     icon: "pen-line" },
  { id: "speaking",  name: "Nói",      icon: "mic" },
  { id: "grammar",   name: "Ngữ pháp", icon: "spell-check" },
  { id: "vocab",     name: "Từ vựng",  icon: "book-text" },
];

// ─── Programs ─────────────────────────────────────────────────────────────
export const QB_PROGRAMS: ExamProgram[] = [
  { id: "p-ielts", code: "IELTS", name: "IELTS",  color: "#2563EB" },
  { id: "p-toeic", code: "TOEIC", name: "TOEIC",  color: "#0284C7" },
  { id: "p-hsk",   code: "HSK",   name: "HSK",    color: "#DC2626" },
  { id: "p-jlpt",  code: "JLPT",  name: "JLPT",   color: "#7C3AED" },
];

// ─── Tags ─────────────────────────────────────────────────────────────────
export const QB_TAGS: QuestionTag[] = [
  { id: "tg-main-idea",   label: "Ý chính",      usage: 42 },
  { id: "tg-detail",      label: "Chi tiết",      usage: 67 },
  { id: "tg-inference",   label: "Suy luận",      usage: 38 },
  { id: "tg-vocab",       label: "Từ vựng",       usage: 54 },
  { id: "tg-paraphrase",  label: "Diễn giải",     usage: 29 },
  { id: "tg-gist",        label: "Nghe ý chính",  usage: 21 },
  { id: "tg-grammar",     label: "Ngữ pháp",      usage: 48 },
  { id: "tg-collocation", label: "Cụm từ",        usage: 18 },
];

// ─── Sources ──────────────────────────────────────────────────────────────
export const QB_SOURCES: QuestionSource[] = [
  { id: "qsrc-cam18",  name: "Cambridge IELTS 18",    type: "adapted",  ref: "Test 2, Reading P1" },
  { id: "qsrc-ets",    name: "ETS TOEIC Official",    type: "licensed", ref: "Set 7, Part 5" },
  { id: "qsrc-bc",     name: "British Council",       type: "licensed", ref: "Listening bank" },
  { id: "qsrc-lp",     name: "Nội dung gốc LexiPath", type: "original", ref: "Biên soạn nội bộ" },
  { id: "qsrc-hanban", name: "Hanban Official",       type: "licensed", ref: "HSK 3 mẫu" },
];

// ─── Groups ───────────────────────────────────────────────────────────────
export const QB_GROUPS: QuestionGroup[] = [
  {
    id: "grp-read-renewable", code: "RD-RENEW-01",
    title: "Đọc hiểu — Renewable Energy",
    stimulusType: "passage", skill: "reading", programId: "p-ielts", mediaId: "m-ielts-p1",
    instructions: "Đọc đoạn văn và trả lời các câu hỏi 1–4.",
    stimulus: "Over the past two decades, renewable energy sources have moved from the periphery to the mainstream of global energy policy. Solar photovoltaic technology has seen the most dramatic cost reductions of any energy technology in history — falling more than 90% over the past decade. Despite this growth, renewables still face integration challenges around grid stability and storage.",
    questionIds: ["q-tfng-1", "q-mcq-1", "q-fill-1", "q-short-1"],
    status: "published", updatedAt: "10/06/2026",
  },
  {
    id: "grp-listen-apt", code: "LS-APT-01",
    title: "Nghe — Apartment Enquiry",
    stimulusType: "audio", skill: "listening", programId: "p-ielts", mediaId: "m-ielts-l1",
    instructions: "Nghe đoạn hội thoại và hoàn thành các câu hỏi 5–7.",
    stimulus: "[Audio] IELTS AC Section 1 — Conversation · 180s · 3 phân đoạn",
    questionIds: ["q-fill-2", "q-match-1", "q-mcq-2"],
    status: "published", updatedAt: "09/06/2026",
  },
  {
    id: "grp-toeic-grammar", code: "GR-TOEIC-01",
    title: "Ngữ pháp TOEIC Part 5",
    stimulusType: "standalone", skill: "grammar", programId: "p-toeic", mediaId: null,
    instructions: "Chọn đáp án đúng nhất để hoàn thành câu.",
    stimulus: "",
    questionIds: ["q-mcq-3", "q-multi-1", "q-order-1"],
    status: "published", updatedAt: "08/06/2026",
  },
  {
    id: "grp-writing-speaking", code: "WS-OPEN-01",
    title: "Viết & Nói — Đề mở (rubric)",
    stimulusType: "standalone", skill: "writing", programId: "p-ielts", mediaId: null,
    instructions: "Hoàn thành bài viết / phần nói theo yêu cầu.",
    stimulus: "",
    questionIds: ["q-write-1", "q-speak-1"],
    status: "draft", updatedAt: "11/06/2026",
  },
  {
    id: "grp-hsk-judge", code: "JD-HSK-01",
    title: "HSK 3 — Đúng/Sai",
    stimulusType: "passage", skill: "reading", programId: "p-hsk", mediaId: null,
    instructions: "读句子，判断对错。",
    stimulus: "小王每天坐地铁去公司上班，路上要花四十分钟。他喜欢在地铁上看书。",
    questionIds: ["q-ynng-1"],
    status: "review", updatedAt: "07/06/2026",
  },
];

// ─── Questions ────────────────────────────────────────────────────────────
export const QB_QUESTIONS: Question[] = [
  {
    id: "q-tfng-1", groupId: "grp-read-renewable", type: "tfng",
    skill: "reading", programId: "p-ielts", difficulty: "medium", points: 1, status: "published",
    stem: "Solar panel costs have fallen by more than 90% in the last ten years.",
    answerKeys: [{ value: "true" }], judgeAnswer: "true",
    explanation: "Đoạn văn nêu rõ chi phí giảm hơn 90% trong thập kỷ qua.",
    tagIds: ["tg-detail", "tg-paraphrase"], sourceId: "qsrc-cam18", vocabIds: ["qv-1"], updatedAt: "10/06/2026",
  },
  {
    id: "q-mcq-1", groupId: "grp-read-renewable", type: "mcq",
    skill: "reading", programId: "p-ielts", difficulty: "easy", points: 1, status: "published",
    stem: "According to the passage, which technology had the most dramatic cost reduction?",
    choices: [
      { key: "A", text: "Wind power",         correct: false },
      { key: "B", text: "Solar photovoltaic", correct: true  },
      { key: "C", text: "Hydroelectric power",correct: false },
      { key: "D", text: "Nuclear energy",     correct: false },
    ],
    explanation: "\"Solar photovoltaic technology has seen the most dramatic cost reductions...\"",
    tagIds: ["tg-detail"], sourceId: "qsrc-cam18", vocabIds: [], updatedAt: "10/06/2026",
  },
  {
    id: "q-fill-1", groupId: "grp-read-renewable", type: "fill",
    skill: "reading", programId: "p-ielts", difficulty: "medium", points: 2, status: "published",
    stem: "Renewables still face integration challenges around grid {{1}} and {{2}}.",
    blanks: [
      { pos: 1, accepted: ["stability", "grid stability"], caseSensitive: false },
      { pos: 2, accepted: ["storage", "energy storage"],   caseSensitive: false },
    ],
    explanation: "Hai chỗ trống lấy trực tiếp từ câu cuối đoạn.",
    tagIds: ["tg-detail", "tg-vocab"], sourceId: "qsrc-cam18", vocabIds: [], updatedAt: "10/06/2026",
  },
  {
    id: "q-short-1", groupId: "grp-read-renewable", type: "short",
    skill: "reading", programId: "p-ielts", difficulty: "hard", points: 2, status: "review",
    stem: "In no more than THREE words, what has renewable energy moved into the mainstream of?",
    answerKeys: [{ value: "global energy policy" }, { value: "energy policy" }],
    maxWords: 3,
    explanation: "Chấp nhận \"global energy policy\" hoặc \"energy policy\".",
    tagIds: ["tg-detail"], sourceId: "qsrc-cam18", vocabIds: [], updatedAt: "10/06/2026",
  },
  {
    id: "q-fill-2", groupId: "grp-listen-apt", type: "fill",
    skill: "listening", programId: "p-ielts", difficulty: "easy", points: 1, status: "published",
    stem: "The rent is £{{1}} per month, excluding bills.",
    blanks: [{ pos: 1, accepted: ["850", "850.00"], caseSensitive: false }],
    explanation: "Phân đoạn 2 của audio nêu \"£850 per month excluding bills\".",
    tagIds: ["tg-detail", "tg-gist"], sourceId: "qsrc-bc", vocabIds: [], updatedAt: "09/06/2026",
  },
  {
    id: "q-match-1", groupId: "grp-listen-apt", type: "matching",
    skill: "listening", programId: "p-ielts", difficulty: "medium", points: 3, status: "published",
    stem: "Match each requirement to its detail.",
    pairs: [
      { left: "Deposit",   right: "One month upfront" },
      { left: "Viewing",   right: "Tomorrow at 2 pm" },
      { left: "Documents", right: "Photo ID + 2 references" },
    ],
    explanation: "Các chi tiết nằm rải rác trong phân đoạn 2 và 3.",
    tagIds: ["tg-detail"], sourceId: "qsrc-bc", vocabIds: [], updatedAt: "09/06/2026",
  },
  {
    id: "q-mcq-2", groupId: "grp-listen-apt", type: "mcq",
    skill: "listening", programId: "p-ielts", difficulty: "easy", points: 1, status: "published",
    stem: "When is the caller invited to view the apartment?",
    choices: [
      { key: "A", text: "Today at 2 pm",    correct: false },
      { key: "B", text: "Tomorrow at 2 pm", correct: true  },
      { key: "C", text: "Tomorrow morning", correct: false },
    ],
    explanation: "\"Could you come in tomorrow at 2pm to view it?\"",
    tagIds: ["tg-detail"], sourceId: "qsrc-bc", vocabIds: [], updatedAt: "09/06/2026",
  },
  {
    id: "q-mcq-3", groupId: "grp-toeic-grammar", type: "mcq",
    skill: "grammar", programId: "p-toeic", difficulty: "medium", points: 1, status: "published",
    stem: "The committee will _____ the new proposal at next week's meeting.",
    choices: [
      { key: "A", text: "discuss",    correct: true  },
      { key: "B", text: "discussion", correct: false },
      { key: "C", text: "discussed",  correct: false },
      { key: "D", text: "discussing", correct: false },
    ],
    explanation: "Sau trợ động từ \"will\" cần động từ nguyên thể.",
    tagIds: ["tg-grammar"], sourceId: "qsrc-ets", vocabIds: ["qv-2"], updatedAt: "08/06/2026",
  },
  {
    id: "q-multi-1", groupId: "grp-toeic-grammar", type: "multi",
    skill: "grammar", programId: "p-toeic", difficulty: "hard", points: 2, status: "published",
    stem: "Which TWO words can correctly complete: \"The report was _____ and well organised.\"",
    choices: [
      { key: "A", text: "thorough",   correct: true  },
      { key: "B", text: "thoroughly", correct: false },
      { key: "C", text: "detailed",   correct: true  },
      { key: "D", text: "detail",     correct: false },
    ],
    explanation: "Cần tính từ — \"thorough\" và \"detailed\".",
    tagIds: ["tg-grammar", "tg-vocab"], sourceId: "qsrc-ets", vocabIds: [], updatedAt: "08/06/2026",
  },
  {
    id: "q-order-1", groupId: "grp-toeic-grammar", type: "ordering",
    skill: "grammar", programId: "p-toeic", difficulty: "medium", points: 2, status: "review",
    stem: "Arrange the words to form a correct sentence.",
    orderItems: [
      { text: "the meeting", correctPos: 4 },
      { text: "please",      correctPos: 1 },
      { text: "confirm",     correctPos: 2 },
      { text: "before",      correctPos: 3 },
    ],
    explanation: "\"Please confirm before the meeting.\"",
    tagIds: ["tg-grammar"], sourceId: "qsrc-lp", vocabIds: [], updatedAt: "08/06/2026",
  },
  {
    id: "q-write-1", groupId: "grp-writing-speaking", type: "writing",
    skill: "writing", programId: "p-ielts", difficulty: "hard", points: 9, status: "draft",
    stem: "Some people think students should study the subjects they enjoy. Others believe they should study subjects useful for the future. Discuss both views and give your opinion. Write at least 250 words.",
    rubricId: "rb-ielts-writing", minWords: 250, suggestedTime: 40,
    explanation: "Chấm theo rubric IELTS Writing Task 2 (4 tiêu chí).",
    tagIds: [], sourceId: "qsrc-lp", vocabIds: [], updatedAt: "11/06/2026",
  },
  {
    id: "q-speak-1", groupId: "grp-writing-speaking", type: "speaking",
    skill: "speaking", programId: "p-ielts", difficulty: "medium", points: 9, status: "draft",
    stem: "Describe a skill you would like to learn. You should say: what it is, why you want to learn it, how you would learn it, and explain how it would help you.",
    rubricId: "rb-ielts-speaking", suggestedTime: 2, prepTime: 1,
    explanation: "IELTS Speaking Part 2 — thẻ gợi ý (cue card). Chấm bằng rubric.",
    tagIds: [], sourceId: "qsrc-lp", vocabIds: [], updatedAt: "11/06/2026",
  },
  {
    id: "q-ynng-1", groupId: "grp-hsk-judge", type: "ynng",
    skill: "reading", programId: "p-hsk", difficulty: "easy", points: 1, status: "review",
    stem: "小王坐公共汽车去上班。",
    answerKeys: [{ value: "no" }], judgeAnswer: "no",
    explanation: "原文说他坐地铁，不是公共汽车。",
    tagIds: ["tg-detail"], sourceId: "qsrc-hanban", vocabIds: ["qv-3"], updatedAt: "07/06/2026",
  },
];

// ─── Rubrics ──────────────────────────────────────────────────────────────
export const QB_RUBRICS: ExamRubric[] = [
  { id: "rb-ielts-writing",  name: "IELTS Writing Task 2", programId: "p-ielts", scaleMax: 9, status: "published" },
  { id: "rb-ielts-speaking", name: "IELTS Speaking",       programId: "p-ielts", scaleMax: 9, status: "published" },
  { id: "rb-toeic-writing",  name: "TOEIC Writing",        programId: "p-toeic", scaleMax: 5, status: "draft"     },
];

// ─── Vocab items (for LinkVocabDialog) ───────────────────────────────────
export const QB_VOCAB_ITEMS: QuestionVocabItem[] = [
  { id: "qv-1", word: "renewable",  reading: "/rɪˈnjuːəbəl/", meaning: "có thể tái tạo",  lang: "en" },
  { id: "qv-2", word: "committee",  reading: "/kəˈmɪti/",     meaning: "ủy ban",            lang: "en" },
  { id: "qv-3", word: "地铁",        reading: "dìtiě",          meaning: "tàu điện ngầm",    lang: "zh" },
  { id: "qv-4", word: "stability",  reading: "/stəˈbɪlɪti/",  meaning: "sự ổn định",        lang: "en" },
  { id: "qv-5", word: "integration",reading: "/ˌɪntɪˈɡreɪʃn/",meaning: "sự tích hợp",      lang: "en" },
];

// ─── Bundle export ─────────────────────────────────────────────────────────
export const QUESTION_BANK_MOCK: QuestionBankMock = {
  questions:    QB_QUESTIONS,
  groups:       QB_GROUPS,
  tags:         QB_TAGS,
  sources:      QB_SOURCES,
  programs:     QB_PROGRAMS,
  rubrics:      QB_RUBRICS,
  vocabItems:   QB_VOCAB_ITEMS,
  typeRegistry: QB_TYPE_REGISTRY,
  diffRegistry: QB_DIFF_REGISTRY,
  skillRegistry: QB_SKILL_REGISTRY,
};
