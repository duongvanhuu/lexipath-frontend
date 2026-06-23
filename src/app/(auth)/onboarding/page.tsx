"use client";

import * as React from "react";
import {
  AlarmClock,
  ArrowRight,
  BookOpen,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import {
  LevelChoiceCard,
  OnboardingJourneyShell,
  OnboardingLearningPath,
  ScriptPreferenceSelector,
  SetupStepCard,
  LanguageChoiceCard,
  type LanguageCode,
  type LevelCode,
} from "@/features/auth";
import {
  CERT_BY_LANG,
  LANG_META,
  LANGUAGE_CHOICES,
  RICH_DAILY_GOAL_OPTIONS,
  getGoalLabel,
  getGoalsForLang,
  getLevelChoices,
  getPathForLang,
  getScriptPreferences,
  getSuggestedCollection,
} from "@/features/auth/constants/onboarding-content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/* ── Step order ── */

type StepId =
  | "welcome"
  | "language"
  | "goal"
  | "level"
  | "daily-goal"
  | "script"
  | "recommended-path";

const STEP_ORDER: StepId[] = [
  "welcome",
  "language",
  "goal",
  "level",
  "daily-goal",
  "script",
  "recommended-path",
];

const SCRIPT_STEP_IDX = STEP_ORDER.indexOf("script");
const RECOMMENDED_PATH_IDX = STEP_ORDER.indexOf("recommended-path");
const DAILY_GOAL_IDX = STEP_ORDER.indexOf("daily-goal");

/* ── Step copy ── */

const STEP_COPY: Record<StepId, { title: string; subtitle: string }> = {
  welcome: {
    title: "Chào mừng đến LexiPath 👋",
    subtitle:
      "Học từ vựng theo lộ trình cá nhân — từng checkpoint, đúng lúc, đúng kỹ năng.",
  },
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
    title: "Bạn muốn học bao nhiêu từ mỗi ngày?",
    subtitle: "Chọn nhịp phù hợp với thói quen — có thể thay đổi bất cứ lúc nào.",
  },
  script: {
    title: "Hiển thị chữ viết thế nào?",
    subtitle: "Ảnh hưởng đến cách từ vựng hiển thị khi bạn học và ôn tập.",
  },
  "recommended-path": {
    title: "Lộ trình của bạn đã sẵn sàng!",
    subtitle: "Cá nhân hóa dựa trên ngôn ngữ, mục tiêu và nhịp học của bạn.",
  },
};

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */

export default function OnboardingPage() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = React.useState(0);
  const [language, setLanguage] = React.useState<LanguageCode>();
  const [goal, setGoal] = React.useState<string>();
  const [levelCode, setLevelCode] = React.useState<LevelCode>();
  const [targetCert, setTargetCert] = React.useState<string>();
  const [dailyGoal, setDailyGoal] = React.useState<number>();
  const [scriptId, setScriptId] = React.useState<string>();

  const step = STEP_ORDER[stepIndex] ?? "welcome";
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
  const langGoals = getGoalsForLang(language);
  const scriptPreferences = getScriptPreferences(language);
  const selectedScript = scriptPreferences.find((s) => s.id === scriptId);
  const suggestedCollection = getSuggestedCollection(language, goal, levelCode);
  const pathItems = getPathForLang(language, goal);
  const goalLabel = language ? getGoalLabel(language, goal) : "";
  const certs = language ? (CERT_BY_LANG[language] ?? []) : [];
  const dailyOpt = RICH_DAILY_GOAL_OPTIONS.find((o) => o.value === dailyGoal);

  function handleLanguageSelect(code: LanguageCode) {
    setLanguage(code);
    setGoal(undefined);
    setLevelCode(undefined);
    setTargetCert(undefined);
    setScriptId(undefined);
  }

  const canContinue =
    step === "welcome" ||
    (step === "language" && language !== undefined) ||
    (step === "goal" && goal !== undefined) ||
    (step === "level" && levelCode !== undefined) ||
    (step === "daily-goal" && dailyGoal !== undefined) ||
    (step === "script" && scriptId !== undefined) ||
    step === "recommended-path";

  const continueLabel =
    step === "recommended-path" ? "Vào trang học" : "Tiếp theo";

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
    // Back from recommended-path when script was skipped → jump to daily-goal.
    if (step === "recommended-path" && !showScriptStep) {
      setStepIndex(DAILY_GOAL_IDX);
      return;
    }
    setStepIndex((i) => i - 1);
  }

  const companion = (
    <OnboardingLearningPath
      {...(language !== undefined ? { lang: language } : {})}
      {...(goal !== undefined ? { goalId: goal } : {})}
    />
  );

  const dynamicTitle =
    step === "level" && selectedLanguage
      ? `Trình độ ${selectedLanguage.name} của bạn?`
      : step === "goal" && selectedLanguage
        ? `Mục tiêu học ${selectedLanguage.name}?`
        : STEP_COPY[step].title;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <OnboardingJourneyShell
        stepLabel={`Bước ${displayStep} / ${totalDisplaySteps}`}
        title={dynamicTitle}
        subtitle={STEP_COPY[step].subtitle}
        stepProgress={{ current: displayStep, total: totalDisplaySteps }}
        companion={companion}
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
        {/* ── WELCOME ── */}
        {step === "welcome" ? <WelcomeStep /> : null}

        {/* ── LANGUAGE ── */}
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

        {/* ── GOAL ── */}
        {step === "goal" ? (
          <div className="flex flex-col gap-2">
            {langGoals.map((g) => (
              <SetupStepCard
                key={g.id}
                icon={g.icon}
                title={g.title}
                description={g.description}
                selected={goal === g.id}
                onSelect={() => setGoal(g.id)}
              />
            ))}
          </div>
        ) : null}

        {/* ── LEVEL ── */}
        {step === "level" ? (
          <div className="flex flex-col gap-5">
            {/* Current → Target framing banner */}
            {levelCode || targetCert ? (
              <div className="flex items-center gap-3 rounded-input border border-primary/20 bg-primary-soft/30 px-4 py-3">
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Hiện tại
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-text-primary">
                    {selectedLevel
                      ? `${selectedLevel.displayCode} · ${selectedLevel.label}`
                      : "Chưa chọn"}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden />
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Mục tiêu
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-primary">
                    {targetCert ?? "Chưa chọn"}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Current level */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                Trình độ hiện tại
              </p>
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
            </div>

            {/* Target cert (optional) */}
            {certs.length > 0 ? (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                  Mục tiêu chứng chỉ{" "}
                  <span className="normal-case font-normal text-text-muted">
                    (tùy chọn)
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {certs.map((cert) => (
                    <button
                      key={cert}
                      type="button"
                      onClick={() =>
                        setTargetCert(targetCert === cert ? undefined : cert)
                      }
                      className={cn(
                        "rounded-pill border px-3 py-1.5 text-sm font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        targetCert === cert
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-card text-text-secondary hover:border-primary/40",
                      )}
                    >
                      {cert}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ── DAILY GOAL ── */}
        {step === "daily-goal" ? (
          <DailyGoalStep
            {...(dailyGoal !== undefined ? { value: dailyGoal } : {})}
            onChange={setDailyGoal}
          />
        ) : null}

        {/* ── SCRIPT ── */}
        {step === "script" ? (
          <div className="flex flex-col gap-4">
            <ScriptPreferenceSelector
              options={scriptPreferences}
              {...(scriptId !== undefined ? { value: scriptId } : {})}
              onChange={setScriptId}
            />
            <div className="flex items-start gap-2 rounded-input border border-border bg-surface-muted/60 p-3">
              <BookOpen
                className="mt-0.5 size-4 shrink-0 text-text-muted"
                aria-hidden
              />
              <p className="text-xs text-text-secondary leading-relaxed">
                Bạn có thể thay đổi cài đặt này bất cứ lúc nào trong{" "}
                <strong>Hồ sơ ngôn ngữ</strong>.
              </p>
            </div>
          </div>
        ) : null}

        {/* ── RECOMMENDED PATH ── */}
        {step === "recommended-path" ? (
          <RecommendedPathStep
            {...(language !== undefined ? { language } : {})}
            goalLabel={goalLabel}
            {...(selectedLevel !== undefined ? { selectedLevel } : {})}
            {...(targetCert !== undefined ? { targetCert } : {})}
            {...(dailyGoal !== undefined ? { dailyGoal } : {})}
            {...(dailyOpt?.label !== undefined ? { dailyOptLabel: dailyOpt.label } : {})}
            {...(selectedScript?.label !== undefined ? { selectedScript: selectedScript.label } : {})}
            suggestedCollection={suggestedCollection}
            pathItems={pathItems}
          />
        ) : null}
      </OnboardingJourneyShell>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STEP SUB-COMPONENTS
══════════════════════════════════════════════════════ */

function WelcomeStep() {
  const benefits = [
    {
      icon: <Zap className="size-5" aria-hidden />,
      title: "Bài học ngắn 5–10 phút",
      desc: "Học theo từng checkpoint, không quá tải.",
    },
    {
      icon: <AlarmClock className="size-5" aria-hidden />,
      title: "Golden Time đúng lúc",
      desc: "Ôn ngay trước khi quên — tự động lên lịch.",
    },
    {
      icon: <TrendingUp className="size-5" aria-hidden />,
      title: "Cá nhân hóa theo kỹ năng",
      desc: "5 kỹ năng được theo dõi và luyện riêng.",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Mini route preview */}
      <div className="flex flex-wrap items-center gap-2 rounded-input border border-primary/20 bg-primary-soft/30 px-4 py-3">
        {["Chọn ngôn ngữ", "Mục tiêu", "Bài đầu tiên", "Golden Time"].map(
          (s, i, arr) => (
            <React.Fragment key={s}>
              <span
                className={cn(
                  "text-xs font-semibold whitespace-nowrap",
                  i === 0 ? "text-primary" : "text-text-secondary",
                )}
              >
                {s}
              </span>
              {i < arr.length - 1 ? (
                <ArrowRight
                  className="size-3 shrink-0 text-text-muted"
                  aria-hidden
                />
              ) : null}
            </React.Fragment>
          ),
        )}
      </div>

      {/* Benefits */}
      <div className="flex flex-col gap-2.5">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="flex items-start gap-3 rounded-card border border-border bg-card p-3.5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              {b.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">{b.title}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyGoalStep({
  value,
  onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) {
  const reviewCount =
    RICH_DAILY_GOAL_OPTIONS.find((o) => o.value === value)?.reviewCount ?? 30;

  return (
    <div className="flex flex-col gap-4">
      {/* Rich options using SetupStepCard */}
      <div className="flex flex-col gap-2">
        {RICH_DAILY_GOAL_OPTIONS.map((opt) => (
          <SetupStepCard
            key={opt.value}
            icon={opt.icon}
            title={opt.label}
            description={opt.description}
            preview={`≈ ${opt.reviewCount} lượt ôn Golden Time mỗi ngày`}
            selected={value === opt.value}
            {...(opt.recommended !== undefined ? { recommended: opt.recommended } : {})}
            onSelect={() => onChange(opt.value)}
          />
        ))}
      </div>

      {/* Golden Time note */}
      <div className="flex items-start gap-2.5 rounded-input border border-golden-border bg-golden-soft px-4 py-3">
        <AlarmClock
          className="mt-0.5 size-4 shrink-0 text-golden-foreground"
          aria-hidden
        />
        <div>
          <p className="text-xs font-semibold text-golden-foreground">
            Lượt ôn mỗi ngày sẽ được lên Golden Time
          </p>
          <p className="mt-0.5 text-xs text-text-secondary">
            ~{reviewCount} lượt/ngày · trải đều trong ngày · tự động nhắc đúng
            lúc trước khi quên.
          </p>
        </div>
      </div>
    </div>
  );
}

type RecommendedPathStepProps = {
  language?: LanguageCode;
  goalLabel: string;
  selectedLevel?: { displayCode: string; label: string };
  targetCert?: string;
  dailyGoal?: number;
  dailyOptLabel?: string;
  selectedScript?: string;
  suggestedCollection: { name: string; description: string };
  pathItems: ReturnType<typeof getPathForLang>;
};

function RecommendedPathStep({
  language,
  goalLabel,
  selectedLevel,
  targetCert,
  dailyGoal,
  dailyOptLabel,
  selectedScript,
  suggestedCollection,
  pathItems,
}: RecommendedPathStepProps) {
  const langMeta = language ? LANG_META[language] : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Selection chips */}
      <div className="flex flex-wrap gap-1.5">
        {langMeta ? (
          <span className="rounded-pill bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-soft-foreground">
            {langMeta.flag} {langMeta.name}
          </span>
        ) : null}
        {goalLabel ? (
          <span className="rounded-pill bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
            {goalLabel}
          </span>
        ) : null}
        {selectedLevel ? (
          <span className="rounded-pill bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
            {selectedLevel.displayCode} · {selectedLevel.label}
          </span>
        ) : null}
        {targetCert ? (
          <span className="rounded-pill bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
            🎯 {targetCert}
          </span>
        ) : null}
        {dailyGoal ? (
          <span className="rounded-pill bg-golden-soft px-2.5 py-1 text-xs font-medium text-golden-foreground">
            {dailyGoal} từ/ngày
            {dailyOptLabel ? ` · ${dailyOptLabel}` : ""}
          </span>
        ) : null}
        {selectedScript ? (
          <span className="rounded-pill bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
            {selectedScript}
          </span>
        ) : null}
      </div>

      {/* Suggested collection */}
      <div className="flex items-start gap-3.5 rounded-card border border-primary/20 bg-primary-soft/30 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <BookOpen className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
            Bộ sưu tập đề xuất
          </p>
          <p className="mt-0.5 text-base font-semibold text-text-primary">
            {suggestedCollection.name}
          </p>
          <p className="mt-0.5 text-sm text-text-secondary">
            {suggestedCollection.description}
          </p>
        </div>
        <span className="shrink-0 rounded-pill bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
          Gợi ý
        </span>
      </div>

      {/* Path checkpoints */}
      {pathItems.length > 0 ? (
        <div className="flex flex-col gap-0">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">
            Lộ trình bắt đầu
          </p>
          <ol className="flex flex-col gap-1.5">
            {pathItems.map((item, i) => (
              <li
                key={item.id}
                className={cn(
                  "flex items-start gap-3 rounded-card border px-3.5 py-3",
                  item.state === "current"
                    ? "border-primary/30 bg-primary-soft/40"
                    : item.state === "due"
                      ? "border-golden-border bg-golden-soft/60"
                      : item.state === "locked"
                        ? "border-border bg-surface-muted/50 opacity-60"
                        : "border-border bg-card",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    item.state === "current"
                      ? "bg-primary text-primary-foreground"
                      : item.state === "due"
                        ? "bg-golden-soft text-golden-foreground"
                        : item.state === "locked"
                          ? "border-2 border-border bg-card text-text-muted"
                          : "border-2 border-primary/50 bg-card text-primary",
                  )}
                >
                  {item.state === "locked" ? (
                    <span className="block size-2.5 rounded-full bg-border" />
                  ) : item.state === "due" ? (
                    <AlarmClock className="size-3" aria-hidden />
                  ) : (
                    i + 1
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      item.state === "current"
                        ? "text-primary"
                        : item.state === "locked"
                          ? "text-text-muted"
                          : "text-text-primary",
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">{item.desc}</p>
                </div>
                {item.state === "current" ? (
                  <span className="shrink-0 rounded-pill bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                    Tiếp theo
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {/* Stats tiles */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2.5 rounded-input border border-border bg-card p-3">
          <BookOpen className="size-4 shrink-0 text-text-muted" aria-hidden />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
              Từ mới/ngày
            </p>
            <p className="text-xl font-bold text-primary">{dailyGoal ?? 10}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-input border border-border bg-card p-3">
          <Clock className="size-4 shrink-0 text-text-muted" aria-hidden />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
              Lượt ôn/ngày
            </p>
            <p className="text-xl font-bold text-golden-foreground">
              {RICH_DAILY_GOAL_OPTIONS.find((o) => o.value === (dailyGoal ?? 10))
                ?.reviewCount ?? 30}
            </p>
          </div>
        </div>
      </div>

      {/* Golden Time note */}
      <div className="flex items-start gap-2.5 rounded-input border border-golden-border bg-golden-soft px-4 py-3">
        <AlarmClock
          className="mt-0.5 size-4 shrink-0 text-golden-foreground"
          aria-hidden
        />
        <p className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-text-primary">Golden Time:</strong> LexiPath
          sẽ nhắc bạn ôn đúng lúc trước khi quên — không bỏ sót từ nào.
        </p>
      </div>

      <p className="text-xs text-text-muted">
        Bạn có thể thay đổi tất cả tuỳ chọn này bất cứ lúc nào trong phần{" "}
        <strong>Cài đặt</strong>.
      </p>
    </div>
  );
}
