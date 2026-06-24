export type AdminCollectionLang = "ja" | "en" | "zh";
export type AdminCollectionType =
  | "roadmap"
  | "thematic"
  | "exam_prep"
  | "grammar"
  | "phrasebook";
export type AdminCollectionPlan = "free" | "pro" | "team" | "enterprise";
export type AdminCollectionStatus = "draft" | "review" | "published" | "archived";
export type AdminLessonStatus = "draft" | "review" | "published" | "archived";

export interface AdminCollection {
  id: string;
  language_code: AdminCollectionLang;
  name: string;
  slug: string;
  type: AdminCollectionType;
  description: string;
  thumbnail_url: string;
  total_items: number;
  total_lessons: number;
  min_plan: AdminCollectionPlan;
  free_lesson_count: number;
  cert_type: string;
  level_min: string;
  level_max: string;
  sort_order: number;
  is_featured: boolean;
  status_code: AdminCollectionStatus;
  updated: string;
  tags: string[];
}

export interface AdminLesson {
  id: string;
  collection_id: string;
  title: string;
  subtitle: string;
  thumbnail_url: string;
  item_count: number;
  estimated_minutes: number;
  sort_order: number;
  is_free: boolean;
  min_plan: AdminCollectionPlan;
  is_new: boolean;
  status_code: AdminLessonStatus;
}

export interface AdminLessonItem {
  id: string;
  item_id: string;
  sense_id: string;
  sort_order: number;
  is_key_item: boolean;
  custom_example_id: string | null;
  word: string;
  reading: string;
  meaning: string;
}

export interface AdminAccessRule {
  id: string;
  collection_id: string;
  required_tier: AdminCollectionPlan;
  free_lesson_count: number;
  allow_trial: boolean;
  allow_one_time_purchase: boolean;
  is_active: boolean;
}

export interface AdminCollectionVersion {
  id: string;
  version: string;
  author: string;
  date: string;
  status: AdminCollectionStatus;
  note: string;
  isCurrent?: boolean;
}

export interface AdminTagItem {
  id: string;
  name: string;
}

export const COLL_LANG_LABELS: Record<AdminCollectionLang, string> = {
  ja: "Tiếng Nhật",
  en: "Tiếng Anh",
  zh: "Tiếng Trung",
};

export const COLL_TYPE_OPTS: Array<{ v: AdminCollectionType; l: string }> = [
  { v: "roadmap", l: "Lộ trình" },
  { v: "thematic", l: "Chủ đề" },
  { v: "exam_prep", l: "Luyện thi" },
  { v: "grammar", l: "Ngữ pháp" },
  { v: "phrasebook", l: "Hội thoại" },
];

export const COLL_PLAN_OPTS: Array<{ v: AdminCollectionPlan; l: string }> = [
  { v: "free", l: "Miễn phí" },
  { v: "pro", l: "Pro" },
  { v: "team", l: "Team" },
  { v: "enterprise", l: "Enterprise" },
];

export const CERT_OPTS = [
  "JLPT", "TOEIC", "IELTS", "HSK", "TOPIK", "DELE", "Không có",
];

export const LEVEL_OPTS: Record<string, string[]> = {
  ja: ["N5", "N4", "N3", "N2", "N1"],
  en: ["A1", "A2", "B1", "B2", "C1", "C2"],
  zh: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"],
};

export const TAGS_POOL: AdminTagItem[] = [
  { id: "t1", name: "TOEIC" }, { id: "t2", name: "IELTS" },
  { id: "t3", name: "Business" }, { id: "t4", name: "Academic" },
  { id: "t5", name: "Phrasal Verb" }, { id: "t6", name: "Idiom" },
  { id: "t7", name: "JLPT N5" }, { id: "t8", name: "JLPT N4" },
  { id: "t9", name: "HSK" }, { id: "t10", name: "Vocabulary" },
  { id: "t11", name: "Grammar" }, { id: "t12", name: "Common" },
  { id: "t13", name: "Daily" }, { id: "t14", name: "Formal" },
  { id: "t15", name: "Kanji" }, { id: "t16", name: "Hanzi" },
  { id: "t17", name: "Listening" }, { id: "t18", name: "Reading" },
];

export const DEFAULT_COLLECTION: Omit<AdminCollection, "id"> = {
  language_code: "ja",
  name: "",
  slug: "",
  type: "roadmap",
  description: "",
  thumbnail_url: "",
  total_items: 0,
  total_lessons: 0,
  min_plan: "free",
  free_lesson_count: 2,
  cert_type: "Không có",
  level_min: "N5",
  level_max: "N5",
  sort_order: 99,
  is_featured: false,
  status_code: "draft",
  updated: "",
  tags: [],
};

export const DEFAULT_LESSON: Omit<AdminLesson, "id" | "collection_id"> = {
  title: "",
  subtitle: "",
  thumbnail_url: "",
  item_count: 0,
  estimated_minutes: 0,
  sort_order: 99,
  is_free: false,
  min_plan: "pro",
  is_new: true,
  status_code: "draft",
};
