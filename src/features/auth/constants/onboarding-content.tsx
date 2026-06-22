import {
  Briefcase,
  GraduationCap,
  Plane,
  Sparkles,
  Trophy,
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

export type LevelChoice = {
  code: LevelCode;
  /** Short display code shown prominently, e.g. "A1", "N5", "HSK1". */
  displayCode: string;
  label: string;
  hint?: string;
};

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

export const GOAL_CHOICES: {
  goal: LearningGoal;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    goal: "exam",
    title: "Thi chứng chỉ",
    description: "TOEIC, IELTS, JLPT…",
    icon: <Trophy aria-hidden />,
  },
  {
    goal: "work",
    title: "Công việc",
    description: "Tiếng chuyên ngành",
    icon: <Briefcase aria-hidden />,
  },
  {
    goal: "travel",
    title: "Du lịch",
    description: "Giao tiếp hằng ngày",
    icon: <Plane aria-hidden />,
  },
  {
    goal: "academic",
    title: "Học thuật",
    description: "Du học, nghiên cứu",
    icon: <GraduationCap aria-hidden />,
  },
  {
    goal: "hobby",
    title: "Sở thích",
    description: "Học vì đam mê",
    icon: <Sparkles aria-hidden />,
  },
];

export const DAILY_GOAL_OPTIONS: DailyGoalOption[] = [
  { value: 5, label: "Thư giãn" },
  { value: 10, label: "Đều đặn" },
  { value: 15, label: "Tích cực" },
  { value: 20, label: "Nghiêm túc" },
];

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

export const GOAL_LABELS: Record<LearningGoal, string> = {
  exam: "Thi chứng chỉ",
  work: "Công việc",
  travel: "Du lịch",
  academic: "Học thuật",
  hobby: "Sở thích",
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

export type SuggestedCollection = {
  name: string;
  description: string;
};

export function getSuggestedCollection(
  lang: LanguageCode | undefined,
  goal: LearningGoal | undefined,
  level: LevelCode | undefined,
): SuggestedCollection {
  if (!lang || !level) return { name: "Khởi động cơ bản", description: "Từ vựng căn bản cho người mới bắt đầu" };

  if (lang === "en") {
    if (goal === "exam") {
      if (level === "CEFR_A1" || level === "CEFR_A2") return { name: "TOEIC 450 Starter", description: "450 từ TOEIC thiết yếu nhất" };
      if (level === "CEFR_B1") return { name: "TOEIC 600 Essential", description: "Từ vựng TOEIC band 600+" };
      if (level === "CEFR_B2") return { name: "TOEIC 785 Advanced", description: "800 từ nâng cao vượt band 785" };
      return { name: "IELTS Academic Vocabulary", description: "2.500 từ học thuật cho IELTS 7.0+" };
    }
    if (goal === "work") return { name: "Business English Essentials", description: "750 từ tiếng Anh công sở" };
    if (goal === "travel") return { name: "Travel & Everyday English", description: "500 từ giao tiếp du lịch" };
    return { name: "English Core 1000", description: "1.000 từ tiếng Anh phổ biến nhất" };
  }

  if (lang === "ja") {
    if (level === "JLPT_N5") return { name: "JLPT N5 Vocabulary", description: "800 từ thiết yếu cho kỳ thi N5" };
    if (level === "JLPT_N4") return { name: "JLPT N4 Vocabulary", description: "1.500 từ hướng tới N4" };
    if (level === "JLPT_N3") return { name: "JLPT N3 Vocabulary", description: "3.750 từ hướng tới N3" };
    if (level === "JLPT_N2") return { name: "JLPT N2 Vocabulary", description: "6.000 từ cho kỳ thi N2" };
    return { name: "JLPT N1 Vocabulary", description: "10.000 từ cấp độ N1" };
  }

  if (lang === "zh") {
    if (level === "HSK_1") return { name: "HSK 1 核心词汇", description: "150 từ cơ bản HSK 1" };
    if (level === "HSK_2") return { name: "HSK 2 词汇", description: "300 từ HSK 2" };
    if (level === "HSK_3") return { name: "HSK 3 词汇", description: "600 từ HSK 3" };
    if (level === "HSK_4") return { name: "HSK 4 词汇", description: "1.200 từ HSK 4" };
    if (level === "HSK_5") return { name: "HSK 5 词汇", description: "2.500 từ HSK 5" };
    return { name: "HSK 6 词汇", description: "5.000+ từ HSK 6 nâng cao" };
  }

  return { name: "Khởi động cơ bản", description: "Từ vựng căn bản cho người mới bắt đầu" };
}
