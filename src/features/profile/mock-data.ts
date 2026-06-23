import type { UserProfile, LangProfileSummary, ProfileStats } from "./types";

export const MOCK_USER_PROFILE: UserProfile = {
  id: "u1",
  name: "Minh Anh",
  email: "minh.anh@example.com",
  emailVerified: true,
  phone: "+84 90 123 4567",
  timezone: "Asia/Ho_Chi_Minh",
  plan: "free",
};

export const MOCK_LANG_PROFILES: LangProfileSummary[] = [
  {
    id: "ja",
    active: true,
    xp: 1240,
    streak: 12,
    wordsLearned: 612,
    totalSessions: 24,
    level: { current: "N5 — Cơ bản" },
  },
  {
    id: "en",
    active: false,
    xp: 480,
    streak: 3,
    wordsLearned: 220,
    totalSessions: 10,
    level: { current: "Pre-Intermediate" },
  },
];

export const MOCK_PROFILE_STATS: ProfileStats = {
  activeLang: "ja",
  langXp: 1240,
  totalXp: 1720,
  langStreak: 12,
  longestStreak: 21,
  wordsLearned: 612,
  wordsMastered: 337,
  totalSessions: 24,
};
