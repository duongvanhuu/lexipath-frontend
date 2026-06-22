"use client";

import * as React from "react";

import {
  DailyGoalSelector,
  GoalChoiceCard,
  LanguageChoiceCard,
  OnboardingJourneyShell,
  OnboardingPathPreview,
  ScriptPreferenceSelector,
  type LanguageCode,
  type LearningGoal,
  type OnboardingCheckpoint,
} from "@/features/auth";
import {
  DAILY_GOAL_OPTIONS,
  GOAL_CHOICES,
  GOAL_LABELS,
  LANGUAGE_CHOICES,
  SCRIPT_PREFERENCES,
} from "@/features/auth/constants/onboarding-content";
import { Button } from "@/components/ui/button";

type StepId = "language" | "goal" | "daily-goal" | "script";

const STEP_ORDER: StepId[] = ["language", "goal", "daily-goal", "script"];

const STEP_COPY: Record<StepId, { title: string; subtitle: string }> = {
  language: {
    title: "Bạn muốn học ngôn ngữ nào?",
    subtitle: "Chọn ngôn ngữ mục tiêu để LexiPath dựng lộ trình phù hợp.",
  },
  goal: {
    title: "Mục tiêu học của bạn là gì?",
    subtitle: "Lộ trình và bài ôn sẽ được điều chỉnh theo mục tiêu này.",
  },
  "daily-goal": {
    title: "Mỗi ngày bạn muốn học bao nhiêu?",
    subtitle: "Bạn có thể đổi mục tiêu này bất cứ lúc nào trong cài đặt.",
  },
  script: {
    title: "Tuỳ chọn hiển thị chữ viết",
    subtitle: "Chọn cách hiển thị phù hợp với trình độ của bạn.",
  },
};

/**
 * Onboarding demo route — a 4-step journey (language → goal → daily goal →
 * script) using `OnboardingJourneyShell`. The companion panel previews the
 * LexiPath learning path being assembled from each choice.
 */
export default function OnboardingPage() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [language, setLanguage] = React.useState<LanguageCode>();
  const [goal, setGoal] = React.useState<LearningGoal>();
  const [dailyGoal, setDailyGoal] = React.useState<number>();
  const [scriptId, setScriptId] = React.useState<string>();

  const step = STEP_ORDER[stepIndex] ?? "language";
  const total = STEP_ORDER.length;

  const selectedLanguage = LANGUAGE_CHOICES.find((l) => l.code === language);
  const showScriptStep = language === "ja";
  const isLastStep = stepIndex === total - 1;

  const canContinue =
    (step === "language" && language !== undefined) ||
    (step === "goal" && goal !== undefined) ||
    (step === "daily-goal" && dailyGoal !== undefined) ||
    (step === "script" && scriptId !== undefined);

  function goNext() {
    // Skip the script step for non-Japanese languages.
    if (step === "daily-goal" && !showScriptStep) return;
    if (!isLastStep) setStepIndex((i) => i + 1);
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  const checkpoints: OnboardingCheckpoint[] = [
    {
      label: "Chẩn đoán trình độ",
      sublabel: "Bài kiểm tra đầu vào",
      state: language ? "complete" : "current",
    },
    {
      label: selectedLanguage
        ? `Lộ trình ${selectedLanguage.name}`
        : "Dựng lộ trình",
      sublabel: goal ? GOAL_LABELS[goal] : "Theo mục tiêu của bạn",
      state: goal ? "complete" : language ? "current" : "locked",
    },
    {
      label: "Học mỗi ngày",
      sublabel: dailyGoal ? `${dailyGoal} từ/ngày` : "Chọn nhịp độ",
      state: dailyGoal ? "complete" : goal ? "current" : "locked",
    },
    {
      label: "Golden Time",
      sublabel: "Ôn đúng thời điểm",
      state: dailyGoal ? "available" : "locked",
    },
  ];

  const lastReachableIndex = showScriptStep ? total - 1 : total - 2;
  const continueLabel = stepIndex >= lastReachableIndex ? "Hoàn tất" : "Tiếp tục";

  return (
    <div className="mx-auto w-full max-w-4xl">
      <OnboardingJourneyShell
        stepLabel={`Bước ${stepIndex + 1} / ${total}`}
        title={STEP_COPY[step].title}
        subtitle={STEP_COPY[step].subtitle}
        stepProgress={{ current: stepIndex + 1, total }}
        companion={
          <OnboardingPathPreview
            summary={{
              ...(selectedLanguage ? { language: selectedLanguage.name } : {}),
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
                onSelect={() => setLanguage(lang.code)}
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

        {step === "daily-goal" ? (
          <DailyGoalSelector
            options={DAILY_GOAL_OPTIONS}
            {...(dailyGoal !== undefined ? { value: dailyGoal } : {})}
            onChange={setDailyGoal}
          />
        ) : null}

        {step === "script" ? (
          <ScriptPreferenceSelector
            options={SCRIPT_PREFERENCES}
            {...(scriptId !== undefined ? { value: scriptId } : {})}
            onChange={setScriptId}
          />
        ) : null}
      </OnboardingJourneyShell>
    </div>
  );
}
