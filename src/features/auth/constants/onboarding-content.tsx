import * as React from "react";
import {
  BookMarked,
  BookOpen,
  Briefcase,
  Feather,
  Flame,
  GraduationCap,
  Layers,
  MessageCircle,
  Music,
  PenTool,
  Target,
  Zap,
} from "lucide-react";

import type {
  CefrLevel,
  HskLevel,
  JlptLevel,
  LanguageCode,
  LearningGoal,
  LevelCode,
  ScriptPreference,
} from "../types/auth.types";
import type { DailyGoalOption } from "../components/daily-goal-selector";

/* ══════════════════════════════════════════════════════
   LANGUAGE META
══════════════════════════════════════════════════════ */

export type LangMeta = { flag: string; name: string };

export const LANG_META: Record<LanguageCode, LangMeta> = {
  en: { flag: "🇬🇧", name: "Tiếng Anh" },
  ja: { flag: "🇯🇵", name: "Tiếng Nhật" },
  zh: { flag: "🇨🇳", name: "Tiếng Trung" },
};

/* ══════════════════════════════════════════════════════
   LANGUAGE CHOICES
══════════════════════════════════════════════════════ */

export const LANGUAGE_CHOICES: {
  code: LanguageCode;
  name: string;
  nativeName: string;
  icon: string;
  description: string;
  glyph: string;
}[] = [
  {
    code: "en",
    name: "Tiếng Anh",
    nativeName: "English",
    icon: "🇬🇧",
    description: "TOEIC, IELTS và tiếng Anh giao tiếp",
    glyph: "A",
  },
  {
    code: "ja",
    name: "Tiếng Nhật",
    nativeName: "日本語",
    icon: "🇯🇵",
    description: "JLPT N5–N1, kanji và kana",
    glyph: "あ",
  },
  {
    code: "zh",
    name: "Tiếng Trung",
    nativeName: "中文",
    icon: "🇨🇳",
    description: "HSK 1–6, Hán tự và pinyin",
    glyph: "中",
  },
];

/* ══════════════════════════════════════════════════════
   LANGUAGE-SPECIFIC GOALS
══════════════════════════════════════════════════════ */

export type LangGoalChoice = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export const GOAL_BY_LANG: Record<LanguageCode, LangGoalChoice[]> = {
  en: [
    {
      id: "vocab-basic",
      title: "Từ vựng cơ bản",
      description: "Nền tảng tiếng Anh thiết thực",
      icon: <BookOpen aria-hidden />,
    },
    {
      id: "daily-en",
      title: "Giao tiếp hằng ngày",
      description: "Nói chuyện tự nhiên, tự tin",
      icon: <MessageCircle aria-hidden />,
    },
    {
      id: "ielts",
      title: "IELTS",
      description: "Học thuật, du học, định cư",
      icon: <GraduationCap aria-hidden />,
    },
    {
      id: "toeic",
      title: "TOEIC",
      description: "Tiếng Anh công việc và văn phòng",
      icon: <Briefcase aria-hidden />,
    },
    {
      id: "idioms",
      title: "Phrasal verbs / Idioms",
      description: "Diễn đạt tự nhiên như người bản xứ",
      icon: <Zap aria-hidden />,
    },
  ],
  ja: [
    {
      id: "jlpt-n5",
      title: "JLPT N5",
      description: "Từ vựng và ngữ pháp cơ bản nhất",
      icon: <GraduationCap aria-hidden />,
    },
    {
      id: "jlpt-n4",
      title: "JLPT N4",
      description: "Sơ-trung cấp, giao tiếp cơ bản",
      icon: <BookMarked aria-hidden />,
    },
    {
      id: "kanji-basic",
      title: "Kanji cơ bản",
      description: "Học chữ Hán thực dụng hằng ngày",
      icon: <PenTool aria-hidden />,
    },
    {
      id: "daily-ja",
      title: "Giao tiếp hằng ngày",
      description: "Hội thoại tự nhiên, du lịch",
      icon: <MessageCircle aria-hidden />,
    },
    {
      id: "grammar-ja",
      title: "Ngữ pháp sơ cấp",
      description: "Nền tảng ngữ pháp tiếng Nhật",
      icon: <Layers aria-hidden />,
    },
  ],
  zh: [
    {
      id: "hsk1",
      title: "HSK 1",
      description: "150 từ cơ bản nhất",
      icon: <GraduationCap aria-hidden />,
    },
    {
      id: "hsk2",
      title: "HSK 2",
      description: "300 từ, giao tiếp đơn giản",
      icon: <BookMarked aria-hidden />,
    },
    {
      id: "pinyin-tone",
      title: "Pinyin & Tone",
      description: "Phát âm chuẩn từ đầu",
      icon: <Music aria-hidden />,
    },
    {
      id: "hanzi-basic",
      title: "Hanzi cơ bản",
      description: "Nhận diện và viết chữ Hán",
      icon: <PenTool aria-hidden />,
    },
    {
      id: "daily-zh",
      title: "Giao tiếp cơ bản",
      description: "Hội thoại thực tế hằng ngày",
      icon: <MessageCircle aria-hidden />,
    },
  ],
};

export function getGoalsForLang(lang: LanguageCode | undefined): LangGoalChoice[] {
  if (!lang) return [];
  return GOAL_BY_LANG[lang] ?? [];
}

export function getGoalLabel(lang: LanguageCode | undefined, goalId: string | undefined): string {
  if (!lang || !goalId) return "";
  const goal = GOAL_BY_LANG[lang]?.find((g) => g.id === goalId);
  return goal?.title ?? goalId;
}

/* ══════════════════════════════════════════════════════
   LEGACY GOAL CHOICES (generic — kept for compat)
══════════════════════════════════════════════════════ */

export const GOAL_CHOICES: {
  goal: LearningGoal;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  { goal: "exam", title: "Thi chứng chỉ", description: "TOEIC, IELTS, JLPT…", icon: <GraduationCap aria-hidden /> },
  { goal: "work", title: "Công việc", description: "Tiếng chuyên ngành", icon: <Briefcase aria-hidden /> },
  { goal: "travel", title: "Du lịch", description: "Giao tiếp hằng ngày", icon: <MessageCircle aria-hidden /> },
  { goal: "academic", title: "Học thuật", description: "Du học, nghiên cứu", icon: <BookOpen aria-hidden /> },
  { goal: "hobby", title: "Sở thích", description: "Học vì đam mê", icon: <Zap aria-hidden /> },
];

export const GOAL_LABELS: Record<LearningGoal, string> = {
  exam: "Thi chứng chỉ",
  work: "Công việc",
  travel: "Du lịch",
  academic: "Học thuật",
  hobby: "Sở thích",
};

/* ══════════════════════════════════════════════════════
   LEVEL CHOICES
══════════════════════════════════════════════════════ */

export type LevelChoice = {
  code: LevelCode;
  displayCode: string;
  label: string;
  hint?: string;
};

export const LEVEL_CHOICES_EN: LevelChoice[] = [
  { code: "CEFR_A1" as CefrLevel, displayCode: "A1", label: "Mới bắt đầu", hint: "Chưa biết tiếng Anh" },
  { code: "CEFR_A2" as CefrLevel, displayCode: "A2", label: "Cơ bản", hint: "Giao tiếp đơn giản" },
  { code: "CEFR_B1" as CefrLevel, displayCode: "B1", label: "Trung cấp thấp", hint: "TOEIC ~450–600" },
  { code: "CEFR_B2" as CefrLevel, displayCode: "B2", label: "Trung cấp cao", hint: "TOEIC ~600–785" },
  { code: "CEFR_C1" as CefrLevel, displayCode: "C1", label: "Nâng cao", hint: "IELTS 7.0+" },
  { code: "CEFR_C2" as CefrLevel, displayCode: "C2", label: "Thành thạo", hint: "IELTS 8.5+" },
];

export const LEVEL_CHOICES_JA: LevelChoice[] = [
  { code: "JLPT_N5" as JlptLevel, displayCode: "N5", label: "Mới bắt đầu", hint: "Hiragana, Katakana cơ bản" },
  { code: "JLPT_N4" as JlptLevel, displayCode: "N4", label: "Cơ bản", hint: "~300 từ vựng" },
  { code: "JLPT_N3" as JlptLevel, displayCode: "N3", label: "Trung cấp", hint: "~650 từ vựng" },
  { code: "JLPT_N2" as JlptLevel, displayCode: "N2", label: "Trung cấp cao", hint: "~6.000 từ vựng" },
  { code: "JLPT_N1" as JlptLevel, displayCode: "N1", label: "Nâng cao", hint: "~10.000 từ vựng" },
];

export const LEVEL_CHOICES_ZH: LevelChoice[] = [
  { code: "HSK_1" as HskLevel, displayCode: "HSK1", label: "Mới bắt đầu", hint: "150 từ cơ bản" },
  { code: "HSK_2" as HskLevel, displayCode: "HSK2", label: "Cơ bản", hint: "300 từ vựng" },
  { code: "HSK_3" as HskLevel, displayCode: "HSK3", label: "Trung cấp thấp", hint: "600 từ vựng" },
  { code: "HSK_4" as HskLevel, displayCode: "HSK4", label: "Trung cấp", hint: "1.200 từ vựng" },
  { code: "HSK_5" as HskLevel, displayCode: "HSK5", label: "Trung cấp cao", hint: "2.500 từ vựng" },
  { code: "HSK_6" as HskLevel, displayCode: "HSK6", label: "Nâng cao", hint: "5.000+ từ vựng" },
];

export function getLevelChoices(lang: LanguageCode | undefined): LevelChoice[] {
  if (lang === "ja") return LEVEL_CHOICES_JA;
  if (lang === "zh") return LEVEL_CHOICES_ZH;
  return LEVEL_CHOICES_EN;
}

/* ══════════════════════════════════════════════════════
   TARGET CERTIFICATIONS
══════════════════════════════════════════════════════ */

export const CERT_BY_LANG: Record<LanguageCode, string[]> = {
  en: ["IELTS 5.5+", "IELTS 6.5+", "IELTS 7.0+", "TOEIC 600+", "TOEIC 800+", "Cambridge B2", "Không thi"],
  ja: ["JLPT N5", "JLPT N4", "JLPT N3", "JLPT N2", "JLPT N1", "Không thi"],
  zh: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "Không thi"],
};

export function getCertsForLang(lang: LanguageCode | undefined): string[] {
  if (!lang) return [];
  return CERT_BY_LANG[lang] ?? [];
}

/* ══════════════════════════════════════════════════════
   ONBOARDING PATH ITEMS (companion panel learning path)
══════════════════════════════════════════════════════ */

export type OnboardingPathItem = {
  id: string;
  title: string;
  desc: string;
  state: "current" | "available" | "due" | "locked";
};

const OB_PATH_EN_DEFAULT: OnboardingPathItem[] = [
  { id: "cp1", title: "1000 từ TOEIC", desc: "Business English nền tảng", state: "current" },
  { id: "cp2", title: "Bài 1 — Từ vựng văn phòng", desc: "10 từ đầu tiên", state: "available" },
  { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
  { id: "cp4", title: "Phrasal Verbs thực tế", desc: "200 cụm · mở sau Bài 5", state: "locked" },
  { id: "cp5", title: "IELTS Academic 6.0+", desc: "1200 từ · mở sau B1", state: "locked" },
];

const OB_PATH_EN_BY_GOAL: Record<string, OnboardingPathItem[]> = {
  ielts: [
    { id: "cp1", title: "IELTS Academic 6.0+", desc: "1200 từ học thuật", state: "current" },
    { id: "cp2", title: "Bài 1 — Academic Vocabulary", desc: "10 từ học thuật đầu tiên", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Reading & Writing Words", desc: "Từ vựng học thuật · mở sau Bài 5", state: "locked" },
    { id: "cp5", title: "IELTS 7.0+ Advanced", desc: "Nâng cao · mở sau IELTS 5.5", state: "locked" },
  ],
  "vocab-basic": [
    { id: "cp1", title: "Từ vựng cơ bản A1–A2", desc: "500 từ thiết yếu nhất", state: "current" },
    { id: "cp2", title: "Bài 1 — Từ hằng ngày", desc: "10 từ đầu tiên", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Giao tiếp cơ bản", desc: "200 mẫu câu · mở sau Bài 3", state: "locked" },
    { id: "cp5", title: "TOEIC 450+", desc: "mở sau A2", state: "locked" },
  ],
  "daily-en": [
    { id: "cp1", title: "Giao tiếp hằng ngày", desc: "300 mẫu câu thực tế", state: "current" },
    { id: "cp2", title: "Bài 1 — Chào hỏi & giới thiệu", desc: "12 từ đầu tiên", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Phrasal Verbs thực dụng", desc: "150 cụm · mở sau Bài 4", state: "locked" },
    { id: "cp5", title: "Idioms tự nhiên", desc: "100 thành ngữ · mở sau B1", state: "locked" },
  ],
  idioms: [
    { id: "cp1", title: "Phrasal Verbs thực tế", desc: "200 cụm từ thông dụng", state: "current" },
    { id: "cp2", title: "Bài 1 — Động từ + giới từ", desc: "12 cụm đầu tiên", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Idioms văn phòng", desc: "100 thành ngữ · mở sau Bài 4", state: "locked" },
    { id: "cp5", title: "Business English nâng cao", desc: "mở sau B2", state: "locked" },
  ],
  toeic: [
    { id: "cp1", title: "TOEIC 600+ Vocabulary", desc: "1000 từ thực chiến", state: "current" },
    { id: "cp2", title: "Bài 1 — Từ vựng văn phòng", desc: "15 từ đầu tiên", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Collocations & Idioms", desc: "150 cụm · mở sau Bài 6", state: "locked" },
    { id: "cp5", title: "Business English", desc: "300 từ chuyên ngành · mở sau B2", state: "locked" },
  ],
};

const OB_PATH_JA: OnboardingPathItem[] = [
  { id: "cp1", title: "Từ vựng JLPT N5", desc: "800 từ cơ bản nhất", state: "current" },
  { id: "cp2", title: "Bài 1 — Chào hỏi cơ bản", desc: "12 từ đầu tiên của bộ N5", state: "available" },
  { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn lại ngay trước khi quên", state: "due" },
  { id: "cp4", title: "Kanji cơ bản N5", desc: "80 chữ Hán thực dụng", state: "locked" },
  { id: "cp5", title: "JLPT N4 Vocabulary", desc: "1600 từ · mở khóa sau N5", state: "locked" },
];

const OB_PATH_JA_BY_GOAL: Record<string, OnboardingPathItem[]> = {
  "kanji-basic": [
    { id: "cp1", title: "Kanji cơ bản N5", desc: "80 chữ Hán thực dụng nhất", state: "current" },
    { id: "cp2", title: "Bài 1 — Bộ thủ cơ bản", desc: "20 bộ thủ đầu tiên", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Kanji N4", desc: "160 chữ · mở sau N5", state: "locked" },
    { id: "cp5", title: "JLPT N5 Vocabulary", desc: "800 từ · mở song song", state: "locked" },
  ],
  "daily-ja": [
    { id: "cp1", title: "Giao tiếp N5", desc: "150 mẫu câu hằng ngày", state: "current" },
    { id: "cp2", title: "Bài 1 — Chào hỏi", desc: "12 từ đầu tiên", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Hội thoại nâng cao", desc: "200 mẫu · mở sau Bài 5", state: "locked" },
    { id: "cp5", title: "JLPT N4 Giao tiếp", desc: "mở sau N5", state: "locked" },
  ],
  "grammar-ja": [
    { id: "cp1", title: "Ngữ pháp N5 cơ bản", desc: "60 mẫu câu thiết yếu", state: "current" },
    { id: "cp2", title: "Bài 1 — Trợ từ cơ bản は・が・を", desc: "Nền tảng ngữ pháp", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Ngữ pháp N4", desc: "80 mẫu câu · mở sau N5", state: "locked" },
    { id: "cp5", title: "JLPT N5 Vocabulary", desc: "800 từ · học song song", state: "locked" },
  ],
};

const OB_PATH_ZH: OnboardingPathItem[] = [
  { id: "cp1", title: "HSK 1 cơ bản", desc: "150 từ thiết yếu nhất", state: "current" },
  { id: "cp2", title: "Bài 1 — Giới thiệu bản thân", desc: "12 từ đầu tiên", state: "available" },
  { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
  { id: "cp4", title: "Hanzi cơ bản HSK 1–2", desc: "100 chữ · mở sau Bài 3", state: "locked" },
  { id: "cp5", title: "HSK 2 — Sơ cấp", desc: "300 từ · mở sau HSK 1", state: "locked" },
];

const OB_PATH_ZH_BY_GOAL: Record<string, OnboardingPathItem[]> = {
  hsk2: [
    { id: "cp1", title: "HSK 2 — Sơ cấp", desc: "300 từ giao tiếp đơn giản", state: "current" },
    { id: "cp2", title: "Bài 1 — Cảm xúc & trạng thái", desc: "20 từ đầu tiên", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Mua sắm & tiền tệ", desc: "20 từ · mở sau Bài 3", state: "locked" },
    { id: "cp5", title: "HSK 3 — Trung cấp", desc: "600 từ · mở sau HSK 2", state: "locked" },
  ],
  "pinyin-tone": [
    { id: "cp1", title: "4 thanh điệu Pinyin", desc: "Phát âm chuẩn từ đầu", state: "current" },
    { id: "cp2", title: "Bài 1 — Thanh 1 & 2", desc: "Phân biệt mā / má", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Thanh 3 & 4", desc: "mǎ / mà · mở sau Bài 2", state: "locked" },
    { id: "cp5", title: "HSK 1 cơ bản", desc: "150 từ · học sau phát âm", state: "locked" },
  ],
  "hanzi-basic": [
    { id: "cp1", title: "Hanzi cơ bản HSK 1–2", desc: "100 chữ phổ biến nhất", state: "current" },
    { id: "cp2", title: "Bài 1 — Bộ thủ cơ bản", desc: "20 bộ thủ đầu tiên", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Số đếm & thời gian", desc: "20 chữ · mở sau Bài 3", state: "locked" },
    { id: "cp5", title: "HSK 1 cơ bản", desc: "150 từ · học song song", state: "locked" },
  ],
  "daily-zh": [
    { id: "cp1", title: "Giao tiếp HSK 1", desc: "150 từ hằng ngày", state: "current" },
    { id: "cp2", title: "Bài 1 — Chào hỏi cơ bản", desc: "12 từ đầu tiên", state: "available" },
    { id: "cp3", title: "Golden Time sau phiên học", desc: "Ôn ngay trước khi quên", state: "due" },
    { id: "cp4", title: "Gia đình & mối quan hệ", desc: "12 từ · mở sau Bài 3", state: "locked" },
    { id: "cp5", title: "HSK 2 — Sơ cấp", desc: "300 từ · mở sau HSK 1", state: "locked" },
  ],
};

export function getPathForLang(
  lang: LanguageCode | undefined,
  goalId: string | undefined,
): OnboardingPathItem[] {
  if (!lang) return [];
  if (lang === "en") {
    if (goalId && OB_PATH_EN_BY_GOAL[goalId]) return OB_PATH_EN_BY_GOAL[goalId];
    return OB_PATH_EN_DEFAULT;
  }
  if (lang === "ja") {
    if (goalId && OB_PATH_JA_BY_GOAL[goalId]) return OB_PATH_JA_BY_GOAL[goalId];
    return OB_PATH_JA;
  }
  if (lang === "zh") {
    if (goalId && OB_PATH_ZH_BY_GOAL[goalId]) return OB_PATH_ZH_BY_GOAL[goalId];
    return OB_PATH_ZH;
  }
  return [];
}

/* ══════════════════════════════════════════════════════
   DAILY GOAL OPTIONS
══════════════════════════════════════════════════════ */

export const DAILY_GOAL_OPTIONS: DailyGoalOption[] = [
  { value: 5, label: "Thư giãn" },
  { value: 10, label: "Đều đặn" },
  { value: 15, label: "Tích cực" },
  { value: 20, label: "Nghiêm túc" },
];

export type RichDailyGoalOption = {
  value: number;
  label: string;
  description: string;
  icon: React.ReactNode;
  reviewCount: number;
  recommended?: boolean;
};

export const RICH_DAILY_GOAL_OPTIONS: RichDailyGoalOption[] = [
  {
    value: 5,
    label: "5 từ mỗi ngày",
    description: "Nhẹ nhàng — ~3 phút mỗi ngày",
    icon: <Feather aria-hidden />,
    reviewCount: 15,
  },
  {
    value: 10,
    label: "10 từ mỗi ngày",
    description: "Cân bằng — ~7 phút mỗi ngày",
    icon: <Target aria-hidden />,
    reviewCount: 30,
    recommended: true,
  },
  {
    value: 15,
    label: "15 từ mỗi ngày",
    description: "Tích cực — ~10 phút mỗi ngày",
    icon: <Zap aria-hidden />,
    reviewCount: 45,
  },
  {
    value: 20,
    label: "20 từ mỗi ngày",
    description: "Thử thách — ~15 phút mỗi ngày",
    icon: <Flame aria-hidden />,
    reviewCount: 60,
  },
];

/* ══════════════════════════════════════════════════════
   SCRIPT PREFERENCES
══════════════════════════════════════════════════════ */

export const SCRIPT_PREFERENCES: ScriptPreference[] = [
  {
    id: "furigana-on",
    label: "Hiện furigana",
    description: "Phiên âm kana phía trên kanji — phù hợp người mới.",
    example: "日本語 (にほんご)",
  },
  {
    id: "furigana-off",
    label: "Ẩn furigana",
    description: "Chỉ hiện kanji — luyện đọc như người bản xứ.",
    example: "日本語",
  },
];

export const SCRIPT_PREFERENCES_ZH: ScriptPreference[] = [
  {
    id: "simplified-pinyin",
    label: "Giản thể + Phiên âm",
    description: "Hiện chữ giản thể kèm phiên âm pinyin — phù hợp người mới.",
    example: "你好 (nǐ hǎo)",
  },
  {
    id: "simplified",
    label: "Giản thể",
    description: "Chỉ hiện chữ giản thể — luyện đọc tự nhiên hơn.",
    example: "你好",
  },
  {
    id: "traditional-pinyin",
    label: "Phồn thể + Phiên âm",
    description: "Hiện chữ phồn thể kèm phiên âm pinyin.",
    example: "你好 (nǐ hǎo)",
  },
  {
    id: "traditional",
    label: "Phồn thể",
    description: "Chỉ hiện chữ phồn thể — dùng cho người học Đài Loan / Hong Kong.",
    example: "你好",
  },
];

export function getScriptPreferences(lang: LanguageCode | undefined): ScriptPreference[] {
  if (lang === "ja") return SCRIPT_PREFERENCES;
  if (lang === "zh") return SCRIPT_PREFERENCES_ZH;
  return [];
}

/* ══════════════════════════════════════════════════════
   SUGGESTED COLLECTION (recommended path)
══════════════════════════════════════════════════════ */

export type SuggestedCollection = {
  name: string;
  description: string;
};

export function getSuggestedCollection(
  lang: LanguageCode | undefined,
  goalId: string | undefined,
  level: LevelCode | undefined,
): SuggestedCollection {
  if (!lang) return { name: "Khởi động cơ bản", description: "Từ vựng căn bản cho người mới bắt đầu" };

  if (lang === "en") {
    if (goalId === "ielts") {
      if (level === "CEFR_A1" || level === "CEFR_A2")
        return { name: "IELTS Starter Vocabulary", description: "600 từ học thuật cơ bản" };
      if (level === "CEFR_B1")
        return { name: "IELTS Academic 6.0+", description: "1200 từ học thuật cho band 6.0+" };
      return { name: "IELTS Academic 7.0+", description: "2500 từ nâng cao cho band 7.0+" };
    }
    if (goalId === "toeic") {
      if (level === "CEFR_A1" || level === "CEFR_A2")
        return { name: "TOEIC 450 Starter", description: "450 từ TOEIC thiết yếu nhất" };
      if (level === "CEFR_B1")
        return { name: "TOEIC 600 Essential", description: "Từ vựng TOEIC band 600+" };
      return { name: "TOEIC 785 Advanced", description: "800 từ nâng cao vượt band 785" };
    }
    if (goalId === "vocab-basic")
      return { name: "English Core 500", description: "500 từ tiếng Anh căn bản nhất" };
    if (goalId === "daily-en")
      return { name: "Everyday English 300", description: "300 mẫu câu giao tiếp hằng ngày" };
    if (goalId === "idioms")
      return { name: "Phrasal Verbs thực tế", description: "200 phrasal verbs phổ biến nhất" };
    return { name: "English Core 1000", description: "1.000 từ tiếng Anh phổ biến nhất" };
  }

  if (lang === "ja") {
    if (goalId === "jlpt-n4" || level === "JLPT_N4")
      return { name: "JLPT N4 Vocabulary", description: "1.500 từ hướng tới N4" };
    if (goalId === "kanji-basic")
      return { name: "Kanji N5 cơ bản", description: "80 chữ Hán thực dụng nhất" };
    if (goalId === "daily-ja")
      return { name: "Giao tiếp N5", description: "150 mẫu câu giao tiếp hằng ngày" };
    if (goalId === "grammar-ja")
      return { name: "Ngữ pháp N5 cơ bản", description: "60 mẫu câu ngữ pháp thiết yếu" };
    if (level === "JLPT_N3") return { name: "JLPT N3 Vocabulary", description: "3.750 từ hướng tới N3" };
    if (level === "JLPT_N2") return { name: "JLPT N2 Vocabulary", description: "6.000 từ cho kỳ thi N2" };
    if (level === "JLPT_N1") return { name: "JLPT N1 Vocabulary", description: "10.000 từ cấp độ N1" };
    return { name: "JLPT N5 Vocabulary", description: "800 từ thiết yếu cho kỳ thi N5" };
  }

  if (lang === "zh") {
    if (goalId === "hsk2" || level === "HSK_2")
      return { name: "HSK 2 词汇", description: "300 từ HSK 2" };
    if (goalId === "pinyin-tone")
      return { name: "Phát âm Pinyin chuẩn", description: "4 thanh điệu + 21 phụ âm + 36 nguyên âm" };
    if (goalId === "hanzi-basic")
      return { name: "Hanzi cơ bản HSK 1–2", description: "100 chữ Hán phổ biến" };
    if (goalId === "daily-zh")
      return { name: "Giao tiếp HSK 1", description: "150 từ giao tiếp hằng ngày" };
    if (level === "HSK_3") return { name: "HSK 3 词汇", description: "600 từ HSK 3" };
    if (level === "HSK_4") return { name: "HSK 4 词汇", description: "1.200 từ HSK 4" };
    if (level === "HSK_5") return { name: "HSK 5 词汇", description: "2.500 từ HSK 5" };
    if (level === "HSK_6") return { name: "HSK 6 词汇", description: "5.000+ từ HSK 6 nâng cao" };
    return { name: "HSK 1 核心词汇", description: "150 từ cơ bản HSK 1" };
  }

  return { name: "Khởi động cơ bản", description: "Từ vựng căn bản cho người mới bắt đầu" };
}
