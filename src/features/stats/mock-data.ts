import type {
  AccountStats,
  BoardEntry,
  CollectionsData,
  LangStats,
  SkillsData,
  WeakEvidenceData,
  XpEntry,
} from "./types";

function mkHeatCells(seed: number): number[] {
  return Array.from({ length: 126 }, (_, i) => (((i + seed) * 2654435761) >>> 0) % 5);
}

export const LANG_META = {
  ja: { code: "ja" as const, name: "Tiếng Nhật", flag: "🇯🇵" },
  en: { code: "en" as const, name: "Tiếng Anh", flag: "🇬🇧" },
  zh: { code: "zh" as const, name: "Tiếng Trung", flag: "🇨🇳" },
};

export const MOCK_LANG_STATS: Record<"ja" | "en" | "zh", LangStats> = {
  ja: {
    code: "ja",
    name: "Tiếng Nhật",
    flag: "🇯🇵",
    today: {
      newItems: 12,
      reviewItems: 18,
      accuracy: 87,
      accuracyDelta: 6,
      time: "24 phút",
      lessons: 2,
      xp: 120,
      xpDelta: 15,
      newDelta: 3,
      goal: 15,
      progress: 12,
      metGoal: false,
    },
    xpTotal: 1240,
    xpWeek: 715,
    streak: 12,
    streakRecord: 18,
    streakStatus: "active",
    streakRemaining: 3,
    streakCalendar: [
      true, true, false, true, true, true, true, true,
      true, false, true, true, true, true, true, true,
      true, false, true, true, true, true, true, true,
      true, true, true, true,
    ],
    heatmapCells: mkHeatCells(0),
    week: [
      { day: "T2", date: "2/6", xp: 80, learned: 8, reviewed: 12, mins: 18, active: true, isToday: false },
      { day: "T3", date: "3/6", xp: 120, learned: 12, reviewed: 18, mins: 24, active: true, isToday: false },
      { day: "T4", date: "4/6", xp: 0, learned: 0, reviewed: 0, mins: 0, active: false, isToday: false },
      { day: "T5", date: "5/6", xp: 95, learned: 10, reviewed: 14, mins: 22, active: true, isToday: false },
      { day: "T6", date: "6/6", xp: 140, learned: 14, reviewed: 20, mins: 28, active: true, isToday: false },
      { day: "T7", date: "7/6", xp: 160, learned: 15, reviewed: 22, mins: 32, active: true, isToday: false },
      { day: "CN", date: "8/6", xp: 120, learned: 12, reviewed: 18, mins: 24, active: true, isToday: true },
    ],
  },
  en: {
    code: "en",
    name: "Tiếng Anh",
    flag: "🇬🇧",
    today: {
      newItems: 6,
      reviewItems: 10,
      accuracy: 82,
      accuracyDelta: 0,
      time: "18 phút",
      lessons: 1,
      xp: 90,
      xpDelta: 5,
      newDelta: -2,
      goal: 15,
      progress: 6,
      metGoal: false,
    },
    xpTotal: 890,
    xpWeek: 445,
    streak: 8,
    streakRecord: 15,
    streakStatus: "at-risk",
    streakRemaining: 5,
    streakCalendar: [
      true, false, true, true, true, true, true, false,
      true, true, true, false, true, true, true, true,
      false, true, true, true, true, false, true, true,
      true, true, true, true,
    ],
    heatmapCells: mkHeatCells(42),
    week: [
      { day: "T2", date: "2/6", xp: 60, learned: 6, reviewed: 8, mins: 14, active: true, isToday: false },
      { day: "T3", date: "3/6", xp: 80, learned: 8, reviewed: 12, mins: 18, active: true, isToday: false },
      { day: "T4", date: "4/6", xp: 0, learned: 0, reviewed: 0, mins: 0, active: false, isToday: false },
      { day: "T5", date: "5/6", xp: 75, learned: 7, reviewed: 10, mins: 16, active: true, isToday: false },
      { day: "T6", date: "6/6", xp: 90, learned: 9, reviewed: 14, mins: 20, active: true, isToday: false },
      { day: "T7", date: "7/6", xp: 100, learned: 10, reviewed: 15, mins: 22, active: true, isToday: false },
      { day: "CN", date: "8/6", xp: 80, learned: 6, reviewed: 10, mins: 18, active: true, isToday: true },
    ],
  },
  zh: {
    code: "zh",
    name: "Tiếng Trung",
    flag: "🇨🇳",
    today: {
      newItems: 4,
      reviewItems: 8,
      accuracy: 76,
      accuracyDelta: -3,
      time: "12 phút",
      lessons: 1,
      xp: 80,
      xpDelta: 0,
      newDelta: 0,
      goal: 10,
      progress: 4,
      metGoal: false,
    },
    xpTotal: 640,
    xpWeek: 265,
    streak: 7,
    streakRecord: 14,
    streakStatus: "at-risk",
    streakRemaining: 2,
    streakCalendar: [
      true, true, true, false, true, true, true, true,
      false, true, true, true, true, false, true, true,
      true, true, false, true, true, true, true, false,
      true, true, true, true,
    ],
    heatmapCells: mkHeatCells(77),
    week: [
      { day: "T2", date: "2/6", xp: 40, learned: 4, reviewed: 6, mins: 10, active: true, isToday: false },
      { day: "T3", date: "3/6", xp: 60, learned: 5, reviewed: 8, mins: 14, active: true, isToday: false },
      { day: "T4", date: "4/6", xp: 0, learned: 0, reviewed: 0, mins: 0, active: false, isToday: false },
      { day: "T5", date: "5/6", xp: 50, learned: 4, reviewed: 7, mins: 12, active: true, isToday: false },
      { day: "T6", date: "6/6", xp: 65, learned: 6, reviewed: 9, mins: 15, active: true, isToday: false },
      { day: "T7", date: "7/6", xp: 70, learned: 7, reviewed: 10, mins: 16, active: true, isToday: false },
      { day: "CN", date: "8/6", xp: 60, learned: 4, reviewed: 8, mins: 12, active: true, isToday: true },
    ],
  },
};

export const MOCK_ACCOUNT_STATS: AccountStats = {
  xpTotal: 4820,
  xpWeek: 1380,
  streak: 12,
  streakRecord: 18,
};

export const MOCK_SKILLS: SkillsData = {
  ja: [
    { id: "meaning", label: "Nhớ nghĩa", icon: "brain", accuracy: 92, attempts: 148, weakItems: 2, trendDir: 1, status: "good", rec: "Duy trì ôn tập định kỳ là đủ", recent: [88, 91, 89, 93, 90, 92, 94] },
    { id: "listening", label: "Nghe hiểu", icon: "ear", accuracy: 63, attempts: 76, weakItems: 8, trendDir: -1, status: "weak", rec: "Luyện thêm nghe — đây là kỹ năng yếu nhất", recent: [74, 71, 68, 65, 62, 64, 63] },
    { id: "kana", label: "Kana", icon: "pen-line", accuracy: 88, attempts: 65, weakItems: 1, trendDir: 1, status: "good", rec: "Đang tiến bộ tốt, tiếp tục nhé!", recent: [82, 84, 85, 86, 87, 88, 89] },
    { id: "romaji", label: "Romaji", icon: "type", accuracy: 81, attempts: 95, weakItems: 4, trendDir: 1, status: "improving", rec: "Đang cải thiện đều, tiếp tục nhé!", recent: [74, 76, 78, 79, 80, 81, 82] },
    { id: "kanji-r", label: "Nhận diện Kanji", icon: "languages", accuracy: 77, attempts: 88, weakItems: 5, trendDir: 1, status: "improving", rec: "Cải thiện đều — tiếp tục nhé!", recent: [70, 72, 73, 75, 76, 77, 78] },
    { id: "kanji-p", label: "Cách đọc Kanji", icon: "book-open", accuracy: 69, attempts: 52, weakItems: 7, trendDir: -1, status: "attention", rec: "Luyện thêm cách đọc — nhiều lỗi gần đây", recent: [76, 74, 72, 70, 68, 69, 69] },
    { id: "usage", label: "Cách dùng", icon: "pen-tool", accuracy: 74, attempts: 62, weakItems: 6, trendDir: 0, status: "stable", rec: "Luyện điền câu mỗi ngày thêm một chút", recent: [73, 74, 72, 75, 74, 73, 74] },
    { id: "grammar", label: "Grammar", icon: "git-branch", accuracy: 55, attempts: 28, weakItems: 0, trendDir: 0, status: "no-data", rec: "Chưa đủ dữ liệu — thử luyện thêm nhé", recent: [55, 55, 55, 55, 55, 55, 55] },
  ],
  en: [
    { id: "meaning", label: "Nhớ nghĩa", icon: "brain", accuracy: 85, attempts: 112, weakItems: 2, trendDir: 1, status: "good", rec: "Tiếp tục ôn đều đặn là đủ", recent: [80, 82, 83, 84, 84, 85, 86] },
    { id: "listening", label: "Nghe hiểu", icon: "ear", accuracy: 70, attempts: 68, weakItems: 5, trendDir: -1, status: "attention", rec: "Luyện nghe thêm mỗi ngày", recent: [75, 74, 72, 71, 70, 70, 70] },
    { id: "spelling", label: "Chính tả", icon: "type", accuracy: 76, attempts: 54, weakItems: 4, trendDir: 0, status: "stable", rec: "Luyện chính tả đều đặn", recent: [74, 75, 76, 75, 76, 77, 76] },
    { id: "usage", label: "Cách dùng", icon: "pen-tool", accuracy: 62, attempts: 48, weakItems: 7, trendDir: -1, status: "attention", rec: "Luyện điền câu hằng ngày", recent: [70, 68, 65, 63, 62, 63, 62] },
    { id: "colloc", label: "Cụm từ", icon: "link", accuracy: 58, attempts: 36, weakItems: 8, trendDir: -1, status: "weak", rec: "Xem lại ví dụ collocation — kỹ năng yếu nhất", recent: [65, 63, 60, 59, 58, 58, 58] },
  ],
  zh: [
    { id: "meaning", label: "Nhớ nghĩa", icon: "brain", accuracy: 88, attempts: 95, weakItems: 2, trendDir: 1, status: "good", rec: "Tiếp tục nhé!", recent: [84, 85, 86, 87, 87, 88, 89] },
    { id: "listening", label: "Nghe hiểu", icon: "ear", accuracy: 65, attempts: 60, weakItems: 6, trendDir: -1, status: "attention", rec: "Luyện nghe thanh điệu nhiều hơn", recent: [71, 69, 67, 66, 65, 65, 65] },
    { id: "pinyin", label: "Pinyin", icon: "type", accuracy: 72, attempts: 78, weakItems: 4, trendDir: 1, status: "improving", rec: "Đang cải thiện tốt!", recent: [66, 68, 69, 70, 71, 72, 73] },
    { id: "tone", label: "Thanh điệu", icon: "music", accuracy: 60, attempts: 70, weakItems: 9, trendDir: -1, status: "weak", rec: "Luyện thanh điệu — kỹ năng yếu nhất", recent: [68, 66, 64, 62, 61, 60, 60] },
    { id: "hanzi", label: "Nhận diện Hán tự", icon: "languages", accuracy: 75, attempts: 55, weakItems: 3, trendDir: 0, status: "stable", rec: "Ổn định — luyện thêm đều", recent: [73, 74, 74, 75, 75, 75, 75] },
    { id: "usage", label: "Cách dùng", icon: "pen-tool", accuracy: 68, attempts: 42, weakItems: 5, trendDir: 0, status: "stable", rec: "Luyện điền câu hằng ngày", recent: [66, 67, 68, 67, 68, 68, 68] },
    { id: "measure", label: "Lượng từ", icon: "hash", accuracy: 52, attempts: 22, weakItems: 0, trendDir: 0, status: "no-data", rec: "Chưa đủ dữ liệu — thử luyện thêm", recent: [52, 52, 52, 52, 52, 52, 52] },
  ],
};

export const MOCK_COLLECTIONS: CollectionsData = {
  ja: [
    { id: "n5", title: "JLPT N5 Vocabulary", icon: "graduation-cap", status: "learning", access: "free", total: 800, learned: 612, mastered: 341, accuracy: 89, lastStudied: "Hôm nay", timeSpent: "18g 40p", nextLesson: "Hoạt động hằng ngày", progress: 76 },
    { id: "kanji", title: "Kanji cơ bản", icon: "languages", status: "learning", access: "free", total: 200, learned: 87, mastered: 42, accuracy: 74, lastStudied: "3 ngày trước", timeSpent: "5g 20p", nextLesson: "Bộ thủ cơ bản 2", progress: 43 },
    { id: "daily", title: "Giao tiếp tiếng Nhật hằng ngày", icon: "message-circle", status: "learning", access: "free", total: 400, learned: 38, mastered: 12, accuracy: 81, lastStudied: "1 tuần trước", timeSpent: "2g 10p", nextLesson: "Ở nhà hàng", progress: 9 },
    { id: "n4", title: "JLPT N4 Vocabulary", icon: "book-open", status: "not-started", access: "free", total: 600, learned: 0, mastered: 0, accuracy: 0, lastStudied: "—", timeSpent: "—", nextLesson: "Bài 1", progress: 0 },
    { id: "biz", title: "Tiếng Nhật thương mại", icon: "briefcase", status: "not-started", access: "pro", total: 300, learned: 0, mastered: 0, accuracy: 0, lastStudied: "—", timeSpent: "—", nextLesson: "Bài 1", progress: 0 },
  ],
  en: [
    { id: "toeic", title: "TOEIC 600+ Vocabulary", icon: "briefcase", status: "learning", access: "free", total: 240, learned: 78, mastered: 32, accuracy: 84, lastStudied: "Hôm nay", timeSpent: "8g 20p", nextLesson: "Contracts & Negotiation", progress: 32 },
    { id: "phrasal", title: "Phrasal Verbs thực tế", icon: "message-circle", status: "learning", access: "free", total: 200, learned: 45, mastered: 20, accuracy: 81, lastStudied: "2 ngày trước", timeSpent: "3g 10p", nextLesson: "put / set", progress: 22 },
    { id: "ielts", title: "IELTS Academic 6.0+", icon: "award", status: "not-started", access: "free", total: 1200, learned: 0, mastered: 0, accuracy: 0, lastStudied: "—", timeSpent: "—", nextLesson: "Bài 1", progress: 0 },
    { id: "colls", title: "Collocations & Idioms", icon: "link", status: "not-started", access: "pro", total: 150, learned: 0, mastered: 0, accuracy: 0, lastStudied: "—", timeSpent: "—", nextLesson: "Bài 1", progress: 0 },
  ],
  zh: [
    { id: "hsk1", title: "HSK 1 Vocabulary", icon: "languages", status: "learning", access: "free", total: 150, learned: 95, mastered: 40, accuracy: 88, lastStudied: "Hôm nay", timeSpent: "5g 30p", nextLesson: "Hoạt động hằng ngày", progress: 63 },
    { id: "hanzi", title: "Hanzi cơ bản HSK 1–2", icon: "pen-tool", status: "learning", access: "free", total: 100, learned: 24, mastered: 9, accuracy: 85, lastStudied: "3 ngày trước", timeSpent: "2g 10p", nextLesson: "Số và đếm", progress: 24 },
    { id: "hsk2", title: "HSK 2 Vocabulary", icon: "book-open", status: "not-started", access: "free", total: 300, learned: 0, mastered: 0, accuracy: 0, lastStudied: "—", timeSpent: "—", nextLesson: "Bài 1", progress: 0 },
    { id: "chengyu", title: "Thành ngữ Hán — Chéngyu", icon: "star", status: "not-started", access: "pro", total: 50, learned: 0, mastered: 0, accuracy: 0, lastStudied: "—", timeSpent: "—", nextLesson: "Bài 1", progress: 0 },
  ],
};

export const MOCK_XP_LEDGER: XpEntry[] = [
  { type: "lesson", lang: "ja", xp: 50, label: "Hoàn thành bài", detail: "Hoạt động hằng ngày", time: "Hôm nay, 09:30", icon: "book-open", bgClass: "bg-success-soft", fgClass: "text-success-foreground" },
  { type: "daily", lang: "ja", xp: 30, label: "Đạt mục tiêu ngày", detail: "15 từ trong ngày", time: "Hôm nay, 09:30", icon: "target", bgClass: "bg-success-soft", fgClass: "text-success-foreground" },
  { type: "golden", lang: "en", xp: 20, label: "Ôn Golden Time", detail: "Ôn 5 từ", time: "Hôm nay, 08:15", icon: "alarm-clock", bgClass: "bg-golden-soft", fgClass: "text-golden-foreground" },
  { type: "streak", lang: "ja", xp: 10, label: "Giữ streak", detail: "12 ngày liên tục 🔥", time: "Hôm nay, 08:15", icon: "flame", bgClass: "bg-golden-soft", fgClass: "text-golden-foreground" },
  { type: "weak", lang: "ja", xp: 15, label: "Luyện kỹ năng yếu", detail: "Nghe — 5 phút", time: "Hôm qua, 20:30", icon: "ear", bgClass: "bg-primary-soft", fgClass: "text-primary-soft-foreground" },
  { type: "lesson", lang: "ja", xp: 50, label: "Hoàn thành bài", detail: "Số đếm & thời gian", time: "Hôm qua, 20:10", icon: "book-open", bgClass: "bg-success-soft", fgClass: "text-success-foreground" },
  { type: "golden", lang: "zh", xp: 20, label: "Ôn Golden Time", detail: "Ôn 3 từ", time: "Hôm qua, 07:45", icon: "alarm-clock", bgClass: "bg-golden-soft", fgClass: "text-golden-foreground" },
  { type: "bonus", lang: "en", xp: 100, label: "Bonus tuần", detail: "Hoàn thành 5 bài liên tiếp", time: "3 ngày trước", icon: "gift", bgClass: "bg-warning-soft", fgClass: "text-warning-foreground" },
  { type: "lesson", lang: "en", xp: 50, label: "Hoàn thành bài", detail: "Business & Office", time: "3 ngày trước", icon: "book-open", bgClass: "bg-success-soft", fgClass: "text-success-foreground" },
  { type: "streak", lang: "zh", xp: 10, label: "Giữ streak", detail: "7 ngày liên tục 🔥", time: "4 ngày trước", icon: "flame", bgClass: "bg-golden-soft", fgClass: "text-golden-foreground" },
];

export const MOCK_LEADERBOARD: BoardEntry[] = [
  { rank: 1, name: "Thanh Hà", initials: "TH", xp: 1840, streak: 28, status: "active", userId: "user-th" },
  { rank: 2, name: "Minh Đức", initials: "MĐ", xp: 1620, streak: 14, status: "active", userId: "user-md" },
  { rank: 3, name: "Bảo Ngọc", initials: "BN", xp: 1450, streak: 9, status: "active" },
  { rank: 4, name: "Minh Anh", initials: "MA", xp: 1240, streak: 12, status: "active", isMe: true, userId: "self" },
  { rank: 5, name: "Hải Yến", initials: "HY", xp: 1180, streak: 6, status: "active" },
  { rank: 6, name: "Trọng Hiếu", initials: "TH", xp: 980, streak: 3, status: "active" },
  { rank: 7, name: "Mỹ Linh", initials: "ML", xp: 720, streak: 0, status: "closed" },
  { rank: 8, name: "—", initials: "?", xp: 0, streak: 2, status: "active", isPrivate: true },
];

export const MOCK_WEAK_EVIDENCE: WeakEvidenceData = {
  ja: {
    skillId: "listening",
    title: "Nghe cần luyện thêm",
    evidence: "Bạn nghe nhầm 4 từ trong 2 phiên gần nhất.",
    items: [
      { word: "勉強する", reading: "べんきょうする", meaning: "Học bài", wrong: 3, sessions: 3 },
      { word: "食べる", reading: "たべる", meaning: "Ăn", wrong: 2, sessions: 3 },
      { word: "飲む", reading: "のむ", meaning: "Uống", wrong: 2, sessions: 2 },
    ],
    exercises: [
      { icon: "ear", label: "Nghe và chọn đáp án", desc: "Chọn từ đúng từ âm bạn nghe", time: "3 phút" },
      { icon: "type", label: "Luyện Romaji từ nghe", desc: "Gõ phiên âm của từ vừa nghe", time: "3 phút" },
      { icon: "pen-line", label: "Điền vào câu", desc: "Hoàn thành câu với từ nghe", time: "4 phút" },
    ],
    cta: "Luyện Nghe · 5 phút",
  },
  en: {
    skillId: "colloc",
    title: "Cụm từ cần luyện thêm",
    evidence: "Bạn ghép sai cụm từ 5 lần trong 2 phiên gần nhất.",
    items: [
      { word: "negotiate", reading: "/nɪˈɡoʊʃɪeɪt/", meaning: "Đàm phán", wrong: 3, sessions: 4 },
      { word: "agreement", reading: "/əˈɡriːmənt/", meaning: "Thoả thuận", wrong: 2, sessions: 3 },
      { word: "deadline", reading: "/ˈdedlaɪn/", meaning: "Hạn chốt", wrong: 2, sessions: 2 },
    ],
    exercises: [
      { icon: "link", label: "Ghép cụm từ đúng", desc: "Nối từ với đối tác đúng", time: "3 phút" },
      { icon: "ear", label: "Nghe và chọn cụm từ", desc: "Phân biệt collocation qua nghe", time: "3 phút" },
      { icon: "type", label: "Gõ cụm từ đúng", desc: "Điền collocation vào câu", time: "4 phút" },
    ],
    cta: "Luyện Cụm từ · 5 phút",
  },
  zh: {
    skillId: "tone",
    title: "Thanh điệu cần luyện thêm",
    evidence: "Bạn nhầm thanh điệu 5 lần trong 2 phiên gần nhất.",
    items: [
      { word: "妈/马/骂", reading: "mā / mǎ / mà", meaning: "Mẹ / Ngựa / Mắng", wrong: 4, sessions: 5 },
      { word: "老师", reading: "lǎo shī", meaning: "Giáo viên", wrong: 3, sessions: 4 },
      { word: "谢谢", reading: "xiè xie", meaning: "Cảm ơn", wrong: 2, sessions: 3 },
    ],
    exercises: [
      { icon: "music", label: "Nhận diện thanh điệu", desc: "Chọn thanh điệu đúng khi nghe", time: "3 phút" },
      { icon: "ear", label: "Nghe và chọn từ", desc: "Nhận biết từ từ âm thanh", time: "3 phút" },
      { icon: "type", label: "Luyện Pinyin + dấu", desc: "Gõ pinyin kèm dấu thanh", time: "4 phút" },
    ],
    cta: "Luyện Thanh điệu · 5 phút",
  },
};
