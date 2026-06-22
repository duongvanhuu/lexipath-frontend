"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import {
  DailyGoalSelector,
  GoalChoiceCard,
  LanguageChoiceCard,
  LevelChoiceCard,
  OnboardingJourneyShell,
  OnboardingPathPreview,
  ScriptPreferenceSelector,
  type LanguageCode,
  type LearningGoal,
  type LevelCode,
  type OnboardingCheckpoint,
} from "@/features/auth";
import {
  DAILY_GOAL_OPTIONS,
  GOAL_CHOICES,
  GOAL_LABELS,
  LANGUAGE_CHOICES,
  getLevelChoices,
  getScriptPreferences,
  getSuggestedCollection,
} from "@/features/auth/constants/onboarding-content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type StepId =
  | "language"
  | "goal"
  | "level"
  | "daily-goal"
  | "script"
  | "recommended-path";

const STEP_ORDER: StepId[] = [
  "language",
  "goal",
  "level",
  "daily-goal",
  "script",
  "recommended-path",
];

const SCRIPT_STEP_IDX = STEP_ORDER.indexOf("script");
const RECOMMENDED_PATH_IDX = STEP_ORDER.indexOf("recommended-path");

const STEP_COPY: Record<StepId, { title: string; subtitle: string }> = {
  language: {
    title: "Bạn muốn học ngôn ngữ nào?",
    subtitle: "Chọn ngôn ngữ mục tiêu để LexiPath dựng lộ trình phù hợp.",
  },
  goal: {
    title: "Mục tiêu học của bạn là gì?",
    subtitle: "Lộ trình và bài ôn sẽ được điều chỉnh theo mục tiêu này.",
  },
  level: {
    title: "Trình độ hiện tại của bạn?",
    subtitle: "LexiPath sẽ dựng lộ trình phù hợp với điểm xuất phát của bạn.",
  },
  "daily-goal": {
    title: "Mỗi ngày bạn muốn học bao nhiêu?",
    subtitle: "Bạn có thể đổi mục tiêu này bất cứ lúc nào trong cài đặt.",
  },
  script: {
    title: "Tuỳ chọn hiển thị chữ viết",
    subtitle: "Chọn cách hiển thị phù hợp với trình độ của bạn.",
  },
  "recommended-path": {
    title: "Lộ trình của bạn đã sẵn sàng!",
    subtitle: "Xem lại các lựa chọn và bắt đầu hành trình học của bạn.",
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [language, setLanguage] = React.useState<LanguageCode>();
  const [goal, setGoal] = React.useState<LearningGoal>();
  const [levelCode, setLevelCode] = React.useState<LevelCode>();
  const [dailyGoal, setDailyGoal] = React.useState<number>();
  const [scriptId, setScriptId] = React.useState<string>();

  const step = STEP_ORDER[stepIndex] ?? "language";
  const showScriptStep = language === "ja" || language === "zh";
  const totalDisplaySteps = showScriptStep
    ? STEP_ORDER.length
    : STEP_ORDER.length - 1;

  // When script step is skipped (EN), map real index → display step number.
  const displayStep =
    !showScriptStep && stepIndex >= SCRIPT_STEP_IDX
      ? stepIndex
      : stepIndex + 1;

  const selectedLanguage = LANGUAGE_CHOICES.find((l) => l.code === language);
  const levelChoices = getLevelChoices(language);
  const selectedLevel = levelChoices.find((l) => l.code === levelCode);
  const scriptPreferences = getScriptPreferences(language);
  const selectedScript = scriptPreferences.find((s) => s.id === scriptId);
  const suggestedCollection = getSuggestedCollection(language, goal, levelCode);

  function handleLanguageSelect(code: LanguageCode) {
    setLanguage(code);
    // Reset level and script when language changes to avoid stale codes.
    setLevelCode(undefined);
    setScriptId(undefined);
  }

  const canContinue =
    (step === "language" && language !== undefined) ||
    (step === "goal" && goal !== undefined) ||
    (step === "level" && levelCode !== undefined) ||
    (step === "daily-goal" && dailyGoal !== undefined) ||
    (step === "script" && scriptId !== undefined) ||
    step === "recommended-path";

  const continueLabel =
    step === "recommended-path" ? "Bắt đầu hành trình" : "Tiếp tục";

  function goNext() {
    if (step === "recommended-path") {
      router.push("/dashboard" as Route);
      return;
    }
    // Skip script step for English.
    if (step === "daily-goal" && !showScriptStep) {
      setStepIndex(RECOMMENDED_PATH_IDX);
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function goBack() {
    if (stepIndex === 0) return;
    // When going back from recommended-path and script was skipped, jump to daily-goal.
    if (step === "recommended-path" && !showScriptStep) {
      setStepIndex(STEP_ORDER.indexOf("daily-goal"));
      return;
    }
    setStepIndex((i) => i - 1);
  }

  const checkpoints: OnboardingCheckpoint[] = [
    {
      label: "Thiết lập ngôn ngữ",
      ...(selectedLanguage?.name ? { sublabel: selectedLanguage.name } : {}),
      state: language ? "complete" : "current",
    },
    {
      label: "Mục tiêu học",
      sublabel: goal ? GOAL_LABELS[goal] : "Theo mục tiêu của bạn",
      state: goal ? "complete" : language ? "current" : "locked",
    },
    {
      label: "Trình độ hiện tại",
      sublabel: selectedLevel
        ? `${selectedLevel.displayCode} · ${selectedLevel.label}`
        : "Chọn trình độ của bạn",
      state: levelCode ? "complete" : goal ? "current" : "locked",
    },
    {
      label: "Học mỗi ngày",
      sublabel: dailyGoal ? `${dailyGoal} từ/ngày` : "Chọn nhịp độ",
      state: dailyGoal ? "complete" : levelCode ? "current" : "locked",
    },
    {
      label: "Golden Time",
      sublabel: "Ôn đúng thời điểm",
      state: dailyGoal ? "available" : "locked",
    },
  ];

  const dynamicTitle =
    step === "level" && selectedLanguage
      ? `Trình độ ${selectedLanguage.name} hiện tại của bạn?`
      : STEP_COPY[step].title;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <OnboardingJourneyShell
        stepLabel={`Bước ${displayStep} / ${totalDisplaySteps}`}
        title={dynamicTitle}
        subtitle={STEP_COPY[step].subtitle}
        stepProgress={{ current: displayStep, total: totalDisplaySteps }}
        companion={
          <OnboardingPathPreview
            summary={{
              ...(selectedLanguage
                ? { language: `${selectedLanguage.icon} ${selectedLanguage.name}` }
                : {}),
              ...(goal ? { goal: GOAL_LABELS[goal] } : {}),
              ...(dailyGoal ? { daily: `${dailyGoal} từ/ngày` } : {}),
            }}
            checkpoints={checkpoints}
          />
        }
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              Quay lại
            </Button>
            <Button type="button" onClick={goNext} disabled={!canContinue}>
              {continueLabel}
            </Button>
          </>
        }
      >
        {step === "language" ? (
          <div className="flex flex-col gap-2.5">
            {LANGUAGE_CHOICES.map((lang) => (
              <LanguageChoiceCard
                key={lang.code}
                name={lang.name}
                nativeName={lang.nativeName}
                icon={lang.icon}
                description={lang.description}
                selected={language === lang.code}
                onSelect={() => handleLanguageSelect(lang.code)}
              />
            ))}
          </div>
        ) : null}

        {step === "goal" ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {GOAL_CHOICES.map((g) => (
              <GoalChoiceCard
                key={g.goal}
                title={g.title}
                description={g.description}
                icon={g.icon}
                selected={goal === g.goal}
                onSelect={() => setGoal(g.goal)}
              />
            ))}
          </div>
        ) : null}

        {step === "level" ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {levelChoices.map((lc) => (
              <LevelChoiceCard
                key={lc.code}
                displayCode={lc.displayCode}
                label={lc.label}
                {...(lc.hint !== undefined ? { hint: lc.hint } : {})}
                selected={levelCode === lc.code}
                onSelect={() => setLevelCode(lc.code)}
              />
            ))}
          </div>
        ) : null}

        {step === "daily-goal" ? (
          <DailyGoalSelector
            options={DAILY_GOAL_OPTIONS}
            {...(dailyGoal !== undefined ? { value: dailyGoal } : {})}
            onChange={setDailyGoal}
          />
        ) : null}

        {step === "script" ? (
          <ScriptPreferenceSelector
            options={scriptPreferences}
            {...(scriptId !== undefined ? { value: scriptId } : {})}
            onChange={setScriptId}
          />
        ) : null}

        {step === "recommended-path" ? (
          <div className="flex flex-col gap-5">
            {/* Selection summary chips */}
            <div className="flex flex-wrap gap-2">
              {selectedLanguage ? (
                <span className="rounded-pill bg-primary-soft px-3 py-1 text-sm font-medium text-primary-soft-foreground">
                  {selectedLanguage.icon} {selectedLanguage.name}
                </span>
              ) : null}
              {selectedLevel ? (
                <span className="rounded-pill bg-surface-muted px-3 py-1 text-sm font-medium text-text-secondary">
                  {selectedLevel.displayCode} · {selectedLevel.label}
                </span>
              ) : null}
              {goal ? (
                <span className="rounded-pill bg-surface-muted px-3 py-1 text-sm font-medium text-text-secondary">
                  {GOAL_LABELS[goal]}
                </span>
              ) : null}
              {dailyGoal ? (
                <span className="rounded-pill bg-golden-soft px-3 py-1 text-sm font-medium text-golden-foreground">
                  {dailyGoal} từ/ngày
                </span>
              ) : null}
              {selectedScript ? (
                <span className="rounded-pill bg-surface-muted px-3 py-1 text-sm font-medium text-text-secondary">
                  {selectedScript.label}
                </span>
              ) : null}
            </div>

            {/* Suggested first collection */}
            <div
              className={cn(
                "flex items-start gap-3.5 rounded-card border border-primary/20 bg-primary-soft/30 p-4"
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <BookOpen className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                  Bộ sưu tập đề xuất
                </p>
                <p className="mt-0.5 text-base font-semibold text-text-primary">
                  {suggestedCollection.name}
                </p>
                <p className="mt-0.5 text-sm text-text-secondary">
                  {suggestedCollection.description}
                </p>
              </div>
            </div>

            <p className="text-xs text-text-muted">
              Bạn có thể thay đổi tất cả tuỳ chọn này bất cứ lúc nào trong phần Cài đặt.
            </p>
          </div>
        ) : null}
      </OnboardingJourneyShell>
    </div>
  );
}
