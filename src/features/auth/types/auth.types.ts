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
export type OnboardingStepId = "language" | "goal" | "daily-goal" | "script";

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
  dailyGoal?: number;
  scriptId?: string;
};
