export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  timezone: string;
  avatarUrl?: string;
  plan: "free" | "pro" | "team";
}

export interface LangProfileSummary {
  id: "en" | "ja" | "zh";
  active: boolean;
  xp: number;
  streak: number;
  wordsLearned: number;
  totalSessions: number;
  level: { current: string };
}

export interface ProfileStats {
  activeLang: "en" | "ja" | "zh";
  langXp: number;
  totalXp: number;
  langStreak: number;
  longestStreak: number;
  wordsLearned: number;
  wordsMastered: number;
  totalSessions: number;
}
