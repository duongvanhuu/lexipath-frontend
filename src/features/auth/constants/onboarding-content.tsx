import {
  Briefcase,
  GraduationCap,
  Plane,
  Sparkles,
  Trophy,
} from "lucide-react";

import type {
  LanguageCode,
  LearningGoal,
  ScriptPreference,
} from "../types/auth.types";
import type { DailyGoalOption } from "../components/daily-goal-selector";

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
