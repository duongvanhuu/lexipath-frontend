/**
 * Auth + onboarding feature barrel. Components are callback-driven and never
 * call the API directly — pages wire `onSubmit` to the hooks in `./hooks`,
 * which call `./api`. DTOs live in `./api/*.dto`, UI models in `./types`.
 */

/* Auth components */
export { AuthCard, type AuthCardProps } from "./components/auth-card";
export {
  SocialLoginButton,
  type SocialLoginButtonProps,
} from "./components/social-login-button";
export {
  VerificationStateCard,
  type VerificationStateCardProps,
} from "./components/verification-state-card";
export { LoginForm, type LoginFormProps } from "./components/login-form";
export { RegisterForm, type RegisterFormProps } from "./components/register-form";

/* Onboarding components */
export {
  OnboardingJourneyShell,
  type OnboardingJourneyShellProps,
} from "./components/onboarding-journey-shell";
export {
  OnboardingStepLayout,
  type OnboardingStepLayoutProps,
} from "./components/onboarding-step-layout";
export {
  OnboardingPathPreview,
  type OnboardingPathPreviewProps,
  type OnboardingCheckpoint,
  type OnboardingCheckpointState,
  type OnboardingPathSummary,
} from "./components/onboarding-path-preview";
export { SetupStepCard, type SetupStepCardProps } from "./components/setup-step-card";
export {
  LevelChoiceCard,
  type LevelChoiceCardProps,
} from "./components/level-choice-card";
export {
  LanguageChoiceCard,
  type LanguageChoiceCardProps,
} from "./components/language-choice-card";
export {
  GoalChoiceCard,
  type GoalChoiceCardProps,
} from "./components/goal-choice-card";
export {
  DailyGoalSelector,
  type DailyGoalSelectorProps,
  type DailyGoalOption,
} from "./components/daily-goal-selector";
export {
  ScriptPreferenceSelector,
  type ScriptPreferenceSelectorProps,
} from "./components/script-preference-selector";

/* Schemas */
export {
  loginSchema,
  registerSchema,
  languagePreferenceSchema,
  onboardingGoalSchema,
  type LoginValues,
  type RegisterValues,
  type LanguagePreferenceValues,
  type OnboardingGoalValues,
} from "./schemas/auth.schemas";

/* Hooks */
export {
  authKeys,
  useCurrentUser,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "./hooks/use-auth";

/* Types */
export type {
  AuthProvider,
  AuthUser,
  VerificationState,
  LanguageCode,
  LearningGoal,
  DailyGoal,
  ScriptPreference,
  OnboardingStep,
  OnboardingStepId,
  OnboardingSelection,
  CefrLevel,
  JlptLevel,
  HskLevel,
  LevelCode,
} from "./types/auth.types";
