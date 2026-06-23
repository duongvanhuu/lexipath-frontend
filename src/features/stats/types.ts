export type LangCode = "ja" | "en" | "zh";
export type StatsScope = "lang" | "account";
export type StatsRange = "7d" | "30d" | "90d";
export type SkillStatus = "good" | "improving" | "stable" | "attention" | "weak" | "no-data";
export type XpEntryType = "lesson" | "golden" | "daily" | "streak" | "weak" | "bonus";
export type TrendDir = 1 | 0 | -1;

export type LangMeta = {
  code: LangCode;
  name: string;
  flag: string;
};

export type WeekDay = {
  day: string;
  date: string;
  xp: number;
  learned: number;
  reviewed: number;
  mins: number;
  active: boolean;
  isToday: boolean;
};

export type TodayStats = {
  newItems: number;
  reviewItems: number;
  accuracy: number;
  accuracyDelta: number;
  time: string;
  lessons: number;
  xp: number;
  xpDelta: number;
  newDelta: number;
  goal: number;
  progress: number;
  metGoal: boolean;
};

export type LangStats = {
  code: LangCode;
  name: string;
  flag: string;
  today: TodayStats;
  xpTotal: number;
  xpWeek: number;
  streak: number;
  streakRecord: number;
  streakStatus: "active" | "at-risk" | "broken";
  streakRemaining: number;
  streakCalendar: boolean[];
  heatmapCells: number[];
  week: WeekDay[];
};

export type AccountStats = {
  xpTotal: number;
  xpWeek: number;
  streak: number;
  streakRecord: number;
};

export type SkillStat = {
  id: string;
  label: string;
  icon: string;
  accuracy: number;
  attempts: number;
  weakItems: number;
  trendDir: TrendDir;
  status: SkillStatus;
  rec: string;
  recent: number[];
};

export type SkillsData = {
  ja: SkillStat[];
  en: SkillStat[];
  zh: SkillStat[];
};

export type CollectionStat = {
  id: string;
  title: string;
  icon: string;
  status: "learning" | "not-started" | "completed";
  access: "free" | "pro";
  total: number;
  learned: number;
  mastered: number;
  accuracy: number;
  lastStudied: string;
  timeSpent: string;
  nextLesson: string;
  progress: number;
};

export type CollectionsData = {
  ja: CollectionStat[];
  en: CollectionStat[];
  zh: CollectionStat[];
};

export type XpEntry = {
  type: XpEntryType;
  lang: LangCode;
  xp: number;
  label: string;
  detail: string;
  time: string;
  icon: string;
  bgClass: string;
  fgClass: string;
};

export type BoardEntry = {
  rank: number;
  name: string;
  initials: string;
  xp: number;
  streak: number;
  status: "active" | "closed";
  isMe?: boolean;
  isPrivate?: boolean;
  userId?: string;
};

export type WeakEvidence = {
  skillId: string;
  title: string;
  evidence: string;
  items: Array<{
    word: string;
    reading: string;
    meaning: string;
    wrong: number;
    sessions: number;
  }>;
  exercises: Array<{
    icon: string;
    label: string;
    desc: string;
    time: string;
  }>;
  cta: string;
};

export type WeakEvidenceData = {
  ja: WeakEvidence;
  en: WeakEvidence;
  zh: WeakEvidence;
};
