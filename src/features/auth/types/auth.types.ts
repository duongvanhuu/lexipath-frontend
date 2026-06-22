/**
 * Auth / onboarding UI (domain) models. These are component-facing types —
 * decoupled from the Spring Boot DTOs in `../api/auth.dto.ts`. DTOs are mapped
 * to these via `../api/auth.mapper.ts`.
 */

/** OAuth identity providers LexiPath supports. */
export type AuthProvider = "google" | "facebook" | "apple";

/** Email verification states surfaced by `VerificationStateCard`. */
export type VerificationState = "pending" | "sent" | "verified" | "expired";

/** Target learning language. */
export type LanguageCode = "en" | "ja" | "zh";

/** Why the learner is studying — drives the generated path. */
export type LearningGoal = "exam" | "travel" | "work" | "academic" | "hobby";

/** CEFR proficiency codes (English). */
export type CefrLevel =
  | "CEFR_A1"
  | "CEFR_A2"
  | "CEFR_B1"
  | "CEFR_B2"
  | "CEFR_C1"
  | "CEFR_C2";

/** JLPT proficiency codes (Japanese). */
export type JlptLevel =
  | "JLPT_N5"
  | "JLPT_N4"
  | "JLPT_N3"
  | "JLPT_N2"
  | "JLPT_N1";

/** HSK proficiency codes (Chinese). */
export type HskLevel =
  | "HSK_1"
  | "HSK_2"
  | "HSK_3"
  | "HSK_4"
  | "HSK_5"
  | "HSK_6";

/** Language-specific proficiency level code. */
export type LevelCode = CefrLevel | JlptLevel | HskLevel;

/** A signed-in LexiPath user as the UI consumes it. */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider?: AuthProvider;
  emailVerified: boolean;
};

/** A daily learning target (words/day) chosen during onboarding. */
export type DailyGoal = {
  value: number;
  /** Optional descriptor, e.g. "Thư giãn" / "Nghiêm túc". */
  label?: string;
};

/** A script-rendering preference for CJK languages (kana/kanji, hanzi/pinyin). */
export type ScriptPreference = {
  id: string;
  label: string;
  description: string;
  /** A representative glyph sample, e.g. "日本語" / "日本語 (にほんご)". */
  example: string;
};

/** The ordered onboarding steps. */
export type OnboardingStepId =
  | "language"
  | "goal"
  | "level"
  | "daily-goal"
  | "script"
  | "recommended-path";

/** Progress descriptor for the onboarding journey shell. */
export type OnboardingStep = {
  id: OnboardingStepId;
  /** 1-based index in the flow. */
  index: number;
  total: number;
  title: string;
  subtitle?: string;
};

/** The choices accumulated across onboarding, used to preview the path. */
export type OnboardingSelection = {
  language?: LanguageCode;
  goal?: LearningGoal;
  levelCode?: LevelCode;
  dailyGoal?: number;
  scriptId?: string;
};
