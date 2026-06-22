# PROMPT 07 — Learning Session, Exercise, Notebook & Dictionary UI Components

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Learning Session, Exercise, Notebook, and Dictionary prototype components from the `lexipath-vocabulary-web-kit` source into production-ready TSX components using shadcn/ui, Tailwind v4, cva, and lucide-react.

**Architecture:** All new files are pure UI components — no API calls, no DTOs, no mappers, no feature folders. Components are controlled via props; any local state (flip, play/pause, open) only exists in components that cannot be controlled externally. Shared types live at `src/components/learning/types.ts` and `src/components/notebook/types.ts`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui (alert-dialog, command, dialog, input, progress, radio-group, sheet, tabs), Radix UI, lucide-react, cva, cn, Vitest + @testing-library/react.

## Global Constraints

- Only create/modify files under `src/components/learning/` and `src/components/notebook/`.
- Never create `src/features/*`, `*.api.ts`, `*.dto.ts`, `*.mapper.ts`, `*.schema.ts`, or `page.tsx`.
- All new files must be `.tsx` (components) or `.ts` (types/barrel).
- No `window.lucide`, no `dangerouslySetInnerHTML`, no inline `style={}` for layout/color/spacing.
- No `"use client"` on purely presentational components — only where local state, browser APIs, Dialog/Sheet/Command interaction, or controlled input onChange requires it.
- Use `rounded-card`, `rounded-button`, `rounded-pill`, `rounded-input` (registered Tailwind utilities from globals.css `@theme`).
- Use `bg-golden-soft`, `text-golden-foreground`, `bg-danger-soft`, `text-danger-foreground`, `bg-success-soft`, `text-success-foreground`, `bg-warning-soft`, `text-warning-foreground`, `bg-skill-*-soft`, `text-skill-*-foreground`, `text-text-primary`, `text-text-secondary`, `text-text-muted` (all registered in `@theme inline`).
- Source design files: `/Users/vanhuu/Downloads/lexipath-vocabulary-web-kit/components/learning/` and `components/notebook/`.
- Run `npm run lint && npm run typecheck` after every task.

---

## File Map

```
src/components/learning/
├── types.ts                                   CREATE — shared UI types for session + exercises
├── session/
│   ├── learning-session-top-bar.tsx           CREATE — standalone progress bar header
│   ├── exit-session-dialog.tsx                CREATE — AlertDialog to confirm exit
│   ├── session-summary-card.tsx               CREATE — end-of-session stats card
│   └── index.ts                               CREATE — barrel export
└── exercises/
    ├── flashcard.tsx                          CREATE — flip card with TTS audio
    ├── flashcard-intro-card.tsx               CREATE — first-encounter word card
    ├── choice-option.tsx                      CREATE — selectable MCQ row
    ├── answer-choice-button.tsx               CREATE — MCQ button with richer feedback icons
    ├── audio-question-card.tsx                CREATE — listen + choose card
    ├── golden-time-question-card.tsx          CREATE — golden-themed question wrapper
    ├── fill-blank-card.tsx                    CREATE — sentence fill-in with Input
    ├── spelling-input-card.tsx                CREATE — spell-the-word Input card
    ├── collocation-practice-card.tsx          CREATE — ___ + word pill selector
    ├── feedback-card.tsx                      CREATE — post-answer feedback surface
    └── index.ts                               CREATE — barrel export

src/components/notebook/
├── types.ts                                   CREATE — shared UI types for notebook
├── notebook-split-layout.tsx                  CREATE — desktop grid + mobile Sheet layout
├── notebook-filter-tabs.tsx                   CREATE — shadcn Tabs switcher with counts
├── notebook-item-row.tsx                      CREATE — clickable word row
├── search-result-group.tsx                    CREATE — grouped search result section
├── dictionary-search-command.tsx              CREATE — CommandDialog dictionary search
├── add-to-learning-dialog.tsx                 CREATE — Dialog + RadioGroup to pick collection
├── skill-weakness-panel.tsx                   CREATE — skill bars with weakest callout
├── word-mastery-header.tsx                    CREATE — word hero + next-review card
├── word-senses-list.tsx                       CREATE — numbered senses list
├── word-mastery-canvas.tsx                    CREATE — orchestrator layout
├── word-relation-map.tsx                      CREATE — hub-and-rail related words
└── index.ts                                   CREATE — barrel export
```

---

## Task 1: Shared Types

**Files:**
- Create: `src/components/learning/types.ts`
- Create: `src/components/notebook/types.ts`

**Interfaces:**
- Consumes: `SkillKey` from `@/components/lexipath`
- Produces: `ExerciseAnswerState`, `FeedbackState`, `SessionProgress`, `SessionSummary` (used by Tasks 2–4); `NotebookItem`, `NotebookTab`, `DictionaryResult`, `WordSense`, `WordSkillStat`, `WordRelationGroup`, `WordRelation`, `NextReview` (used by Tasks 5–8)

- [ ] **Step 1: Create `src/components/learning/types.ts`**

```ts
export type ExerciseAnswerState =
  | "idle"
  | "selected"
  | "correct"
  | "incorrect"
  | "partial"
  | "disabled";

export type ExerciseQuestionType =
  | "flashcard"
  | "choice"
  | "audio"
  | "fill_blank"
  | "spelling"
  | "collocation";

export type FeedbackState = "correct" | "incorrect" | "partial" | "hint";

export interface SessionProgress {
  currentIndex: number;
  totalCount: number;
  progressPercent: number;
}

export interface SessionSummary {
  correctCount: number;
  incorrectCount: number;
  xpEarned: number;
  durationLabel?: string;
}
```

- [ ] **Step 2: Create `src/components/notebook/types.ts`**

```ts
import type { SkillKey } from "@/components/lexipath";

export interface NotebookItem {
  id: string;
  word: string;
  reading?: string;
  meaning?: string;
  status?: "new" | "learning" | "review" | "mastered" | "locked";
  statusLabel?: string;
  addedAt?: string;
}

export interface NotebookTab {
  id: string;
  label: string;
  count?: number;
}

export interface DictionaryResult {
  id: string;
  word: string;
  reading?: string;
  partOfSpeech?: string;
  meaning: string;
}

export interface WordSense {
  pos?: string;
  gloss: string;
  example?: string;
  exampleTranslation?: string;
}

export interface WordSkillStat {
  skill: SkillKey;
  label: string;
  accuracy: number;
  attempts?: number;
}

export interface WordRelation {
  id: string;
  word: string;
  reading?: string;
}

export interface WordRelationGroup {
  id: string;
  label: string;
  type: "synonym" | "antonym" | "confusable" | "collocation" | "grammar";
  relations: WordRelation[];
}

export interface WordMastery {
  wordId: string;
  masteryPercent: number;
  weakSkills: SkillKey[];
}

export interface NextReview {
  label?: string;
  when: string;
}
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/learning/types.ts src/components/notebook/types.ts
git commit -m "feat(components): add shared UI types for learning and notebook"
```

---

## Task 2: Session Components

**Files:**
- Create: `src/components/learning/session/learning-session-top-bar.tsx`
- Create: `src/components/learning/session/exit-session-dialog.tsx`
- Create: `src/components/learning/session/session-summary-card.tsx`
- Create: `src/components/learning/session/index.ts`
- Create: `src/components/learning/session/__tests__/exit-session-dialog.test.tsx`

**Interfaces:**
- Consumes: `Progress` from `@/components/ui/progress`; `AlertDialog*` from `@/components/ui/alert-dialog`; `IconButton`, `LexiButton` from `@/components/shared`; `SessionSummary` from `@/components/learning/types`
- Produces: `LearningSessionTopBar`, `ExitSessionDialog`, `SessionSummaryCard` (used by pages that compose sessions)

- [ ] **Step 1: Write the failing test for `ExitSessionDialog`**

Create `src/components/learning/session/__tests__/exit-session-dialog.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ExitSessionDialog } from "../exit-session-dialog";

describe("ExitSessionDialog", () => {
  it("does not render content when open=false", () => {
    render(
      <ExitSessionDialog
        open={false}
        onOpenChange={vi.fn()}
        onExit={vi.fn()}
      />
    );
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("renders when open=true", () => {
    render(
      <ExitSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onExit={vi.fn()}
      />
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Thoát buổi học?")).toBeInTheDocument();
  });

  it("calls onExit when exit button clicked", async () => {
    const user = userEvent.setup();
    const onExit = vi.fn();
    render(
      <ExitSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onExit={onExit}
      />
    );
    await user.click(screen.getByRole("button", { name: "Thoát" }));
    expect(onExit).toHaveBeenCalledOnce();
  });

  it("shows progress bar when progress prop provided", () => {
    render(
      <ExitSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onExit={vi.fn()}
        progress={60}
      />
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText(/60%/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- src/components/learning/session/__tests__/exit-session-dialog.test.tsx
```

Expected: FAIL — "Cannot find module '../exit-session-dialog'"

- [ ] **Step 3: Create `learning-session-top-bar.tsx`**

```tsx
import * as React from "react";
import { X } from "lucide-react";

import { IconButton } from "@/components/shared";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

/**
 * Standalone session top bar for custom learning layouts.
 * Use FocusLearningShell for full-page learning sessions.
 */
export type LearningSessionTopBarProps = {
  current: number;
  total: number;
  title?: string;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
};

function LearningSessionTopBar({
  current,
  total,
  title,
  onClose,
  closeLabel = "Thoát",
  className,
}: LearningSessionTopBarProps) {
  const pct =
    total > 0 ? Math.max(0, Math.min(100, Math.round((current / total) * 100))) : 0;

  return (
    <div className={cn("border-b border-border bg-card", className)}>
      <div className="flex h-14 items-center gap-3 px-4">
        {onClose ? (
          <IconButton variant="ghost" label={closeLabel} onClick={onClose}>
            <X />
          </IconButton>
        ) : null}
        <div className="flex-1">
          <Progress
            value={pct}
            aria-label={`Tiến độ: ${current}/${total}`}
            className="h-1.5"
          />
        </div>
        <span className="shrink-0 text-xs font-medium text-text-muted">
          {current}/{total}
        </span>
        {title ? (
          <span className="hidden shrink-0 text-xs text-text-muted sm:inline">
            {title}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export { LearningSessionTopBar };
```

- [ ] **Step 4: Create `exit-session-dialog.tsx`**

```tsx
"use client";

import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

export type ExitSessionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit: () => void;
  progress?: number;
};

function ExitSessionDialog({
  open,
  onOpenChange,
  onExit,
  progress,
}: ExitSessionDialogProps) {
  const hasProgress = typeof progress === "number";
  const pct = hasProgress ? Math.max(0, Math.min(100, progress)) : 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm text-center">
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>Thoát buổi học?</AlertDialogTitle>
          <AlertDialogDescription>
            Tiến độ của bạn sẽ được lưu lại. Bạn có thể quay lại bất cứ lúc nào.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {hasProgress ? (
          <div className="space-y-1.5">
            <Progress value={pct} aria-label="Tiến độ" className="h-1.5" />
            <p className="text-xs text-text-muted">Đã hoàn thành {pct}%</p>
          </div>
        ) : null}
        <AlertDialogFooter className="justify-center sm:justify-center">
          <AlertDialogCancel>Tiếp tục học</AlertDialogCancel>
          <AlertDialogAction
            className="border-transparent bg-danger text-white hover:bg-danger/90"
            onClick={onExit}
          >
            Thoát
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ExitSessionDialog };
```

- [ ] **Step 5: Create `session-summary-card.tsx`**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";

export type SessionSummaryCardProps = {
  wordsLearned?: number;
  wordsReviewed?: number;
  accuracy?: number;
  xpEarned: number;
  streakDays?: number;
  durationLabel?: string;
  onContinue?: () => void;
  onHome?: () => void;
  className?: string;
};

const statTileVariants = cva(
  "flex flex-col items-center gap-1 rounded-md px-3 py-3",
  {
    variants: {
      tone: {
        primary: "bg-primary/10 text-primary",
        info: "bg-muted text-muted-foreground",
        warning: "bg-warning-soft text-warning-foreground",
        streak: "bg-golden-soft text-golden-foreground",
      },
    },
    defaultVariants: { tone: "primary" },
  }
);

type StatTileTone = NonNullable<VariantProps<typeof statTileVariants>["tone"]>;

function StatTile({
  value,
  label,
  tone = "primary",
}: {
  value: string | number;
  label: string;
  tone?: StatTileTone;
}) {
  return (
    <div className={statTileVariants({ tone })}>
      <span className="text-xl font-bold leading-none">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

function SessionSummaryCard({
  wordsLearned,
  wordsReviewed,
  accuracy,
  xpEarned,
  streakDays,
  durationLabel,
  onContinue,
  onHome,
  className,
}: SessionSummaryCardProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md rounded-card border border-border bg-card px-8 py-8 text-center",
        className
      )}
    >
      <p className="text-3xl" aria-hidden>
        🎉
      </p>
      <h2 className="mt-2 text-2xl font-bold text-text-primary">Tuyệt vời!</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Bạn đã hoàn thành buổi học.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {typeof wordsLearned === "number" && wordsLearned > 0 ? (
          <StatTile value={wordsLearned} label="Từ mới" tone="primary" />
        ) : null}
        {typeof wordsReviewed === "number" && wordsReviewed > 0 ? (
          <StatTile value={wordsReviewed} label="Đã ôn" tone="info" />
        ) : null}
        {typeof accuracy === "number" ? (
          <StatTile
            value={`${Math.round(accuracy)}%`}
            label="Chính xác"
            tone={accuracy >= 80 ? "primary" : "warning"}
          />
        ) : null}
        <StatTile value={`+${xpEarned}`} label="XP" tone="streak" />
        {typeof streakDays === "number" ? (
          <StatTile value={streakDays} label="Streak" tone="streak" />
        ) : null}
        {durationLabel ? (
          <StatTile value={durationLabel} label="Thời gian" tone="info" />
        ) : null}
      </div>
      <div className="mt-7 flex justify-center gap-2">
        {onHome ? (
          <LexiButton variant="quiet" onClick={onHome}>
            Trang chủ
          </LexiButton>
        ) : null}
        {onContinue ? (
          <LexiButton variant="nextStep" onClick={onContinue}>
            Học tiếp
          </LexiButton>
        ) : null}
      </div>
    </div>
  );
}

export { SessionSummaryCard };
```

- [ ] **Step 6: Create `session/index.ts`**

```ts
export {
  LearningSessionTopBar,
  type LearningSessionTopBarProps,
} from "./learning-session-top-bar";
export {
  ExitSessionDialog,
  type ExitSessionDialogProps,
} from "./exit-session-dialog";
export {
  SessionSummaryCard,
  type SessionSummaryCardProps,
} from "./session-summary-card";
```

- [ ] **Step 7: Run test to verify it passes**

```bash
npm run test -- src/components/learning/session/__tests__/exit-session-dialog.test.tsx
```

Expected: 4 tests PASS.

- [ ] **Step 8: Lint and typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/learning/session/
git commit -m "feat(components): add learning session components (top bar, exit dialog, summary card)"
```

---

## Task 3: Presentational Exercise Components

**Files:**
- Create: `src/components/learning/exercises/flashcard-intro-card.tsx`
- Create: `src/components/learning/exercises/choice-option.tsx`
- Create: `src/components/learning/exercises/answer-choice-button.tsx`
- Create: `src/components/learning/exercises/golden-time-question-card.tsx`
- Create: `src/components/learning/exercises/feedback-card.tsx`

**Interfaces:**
- Consumes: `ExerciseAnswerState`, `FeedbackState` from `@/components/learning/types`; `LexiButton`, `IconButton` from `@/components/shared`; `ReviewReasonChip` from `@/components/lexipath` (as an opaque `React.ReactNode` prop)
- Produces: `ChoiceOption`, `AnswerChoiceButton`, `FlashcardIntroCard`, `GoldenTimeQuestionCard`, `FeedbackCard` (used by Task 4's index and by pages)

- [ ] **Step 1: Write failing test for `ChoiceOption` state rendering**

Create `src/components/learning/exercises/__tests__/choice-option.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChoiceOption } from "../choice-option";

describe("ChoiceOption", () => {
  it("renders children and optionKey", () => {
    render(
      <ChoiceOption optionKey="A" state="idle">
        Tokyo
      </ChoiceOption>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
  });

  it("calls onClick when idle and clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChoiceOption state="idle" onClick={onClick}>
        Tokyo
      </ChoiceOption>
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when state is correct", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChoiceOption state="correct" onClick={onClick}>
        Tokyo
      </ChoiceOption>
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows check icon on correct state", () => {
    render(<ChoiceOption state="correct">Tokyo</ChoiceOption>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- src/components/learning/exercises/__tests__/choice-option.test.tsx
```

Expected: FAIL — "Cannot find module '../choice-option'"

- [ ] **Step 3: Create `flashcard-intro-card.tsx`**

```tsx
import * as React from "react";
import { Play } from "lucide-react";

import { IconButton, LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";

export type FlashcardIntroCardProps = {
  word: string;
  reading?: string;
  partOfSpeech?: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  onPlayAudio?: () => void;
  onContinue?: () => void;
  className?: string;
};

function FlashcardIntroCard({
  word,
  reading,
  partOfSpeech,
  meaning,
  example,
  exampleTranslation,
  onPlayAudio,
  onContinue,
  className,
}: FlashcardIntroCardProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-sm flex-col items-center gap-4 rounded-card border border-border bg-card px-8 py-8 text-center",
        className
      )}
    >
      <div className="text-5xl font-bold tracking-tight text-text-primary">
        {word}
      </div>
      {reading ? (
        <div className="text-lg text-text-secondary">{reading}</div>
      ) : null}
      {partOfSpeech ? (
        <div className="text-xs italic text-text-muted">{partOfSpeech}</div>
      ) : null}
      {onPlayAudio ? (
        <IconButton
          variant="ghost"
          label="Nghe phát âm"
          className="size-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
          onClick={onPlayAudio}
        >
          <Play className="size-4" />
        </IconButton>
      ) : null}
      <div className="text-xl font-semibold text-text-primary">{meaning}</div>
      {example ? (
        <div className="w-full rounded-md bg-muted px-4 py-3 text-left">
          <p className="text-sm leading-relaxed text-text-primary">{example}</p>
          {exampleTranslation ? (
            <p className="mt-1 text-xs text-text-muted">
              {exampleTranslation}
            </p>
          ) : null}
        </div>
      ) : null}
      {onContinue ? (
        <LexiButton variant="primary" onClick={onContinue} className="w-full">
          Tiếp tục
        </LexiButton>
      ) : null}
    </div>
  );
}

export { FlashcardIntroCard };
```

- [ ] **Step 4: Create `choice-option.tsx`**

```tsx
import * as React from "react";
import { Check, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import type { ExerciseAnswerState } from "@/components/learning/types";

const choiceOptionVariants = cva(
  "flex w-full items-center gap-3 rounded-button border-[1.5px] px-4 py-4 text-left text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none",
  {
    variants: {
      state: {
        idle: "border-border bg-card text-text-primary hover:border-border/80 hover:bg-muted/40",
        selected: "border-primary bg-primary/10 text-text-primary",
        correct: "border-success bg-success-soft text-success-foreground",
        incorrect: "border-danger bg-danger-soft text-danger-foreground",
        partial: "border-warning bg-warning-soft text-warning-foreground",
        disabled: "border-border bg-muted text-text-muted",
      },
    },
    defaultVariants: { state: "idle" },
  }
);

const keyBadgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[8px] text-sm font-semibold size-7",
  {
    variants: {
      state: {
        idle: "bg-muted text-text-secondary",
        selected: "bg-primary text-white",
        correct: "bg-success text-white",
        incorrect: "bg-danger text-white",
        partial: "bg-warning text-white",
        disabled: "bg-muted text-text-muted",
      },
    },
    defaultVariants: { state: "idle" },
  }
);

export type ChoiceOptionProps = {
  optionKey?: string;
  state?: ExerciseAnswerState;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

function ChoiceOption({
  optionKey,
  state = "idle",
  onClick,
  disabled,
  className,
  children,
}: ChoiceOptionProps) {
  const isDisabled =
    disabled ||
    state === "disabled" ||
    state === "correct" ||
    state === "incorrect";

  return (
    <button
      type="button"
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      className={cn(choiceOptionVariants({ state }), className)}
      aria-pressed={state === "selected"}
    >
      {optionKey ? (
        <span className={keyBadgeVariants({ state })}>{optionKey}</span>
      ) : null}
      <span className="flex-1">{children}</span>
      {state === "correct" ? (
        <Check className="size-4 shrink-0 text-success" aria-hidden />
      ) : null}
      {state === "incorrect" ? (
        <X className="size-4 shrink-0 text-danger" aria-hidden />
      ) : null}
    </button>
  );
}

export { ChoiceOption, choiceOptionVariants };
```

- [ ] **Step 5: Create `answer-choice-button.tsx`**

```tsx
import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import type { ExerciseAnswerState } from "@/components/learning/types";

const answerVariants = cva(
  "flex w-full items-center gap-3 rounded-button border-[1.5px] px-4 py-3.5 text-left text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none",
  {
    variants: {
      state: {
        idle: "border-border bg-card text-text-primary hover:border-border/80 hover:bg-muted/40",
        selected: "border-primary bg-primary/10 text-text-primary",
        correct: "border-success bg-success-soft text-success-foreground",
        incorrect: "border-danger bg-danger-soft text-danger-foreground",
        partial: "border-warning bg-warning-soft text-warning-foreground",
        disabled: "border-border bg-muted text-text-muted",
      },
    },
    defaultVariants: { state: "idle" },
  }
);

const keyBadgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[8px] text-sm font-semibold size-[30px]",
  {
    variants: {
      state: {
        idle: "bg-muted text-text-secondary",
        selected: "bg-primary text-white",
        correct: "bg-success text-white",
        incorrect: "bg-danger text-white",
        partial: "bg-warning text-white",
        disabled: "bg-muted text-text-muted",
      },
    },
    defaultVariants: { state: "idle" },
  }
);

export type AnswerChoiceButtonProps = {
  optionKey?: string;
  state?: ExerciseAnswerState;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
};

function AnswerChoiceButton({
  optionKey,
  state = "idle",
  onClick,
  className,
  children,
}: AnswerChoiceButtonProps) {
  const isDisabled =
    state === "disabled" || state === "correct" || state === "incorrect";

  return (
    <button
      type="button"
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      className={cn(answerVariants({ state }), className)}
      aria-pressed={state === "selected"}
    >
      {optionKey ? (
        <span className={keyBadgeVariants({ state })}>{optionKey}</span>
      ) : null}
      <span className="flex-1">{children}</span>
      {state === "correct" ? (
        <CheckCircle2
          className="size-[18px] shrink-0 text-success"
          aria-hidden
        />
      ) : null}
      {state === "incorrect" ? (
        <XCircle
          className="size-[18px] shrink-0 text-danger"
          aria-hidden
        />
      ) : null}
    </button>
  );
}

export { AnswerChoiceButton, answerVariants };
```

- [ ] **Step 6: Create `golden-time-question-card.tsx`**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type GoldenTimeQuestionCardProps = {
  word: string;
  reading?: string;
  questionType?: string;
  reviewChip?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

function GoldenTimeQuestionCard({
  word,
  reading,
  questionType,
  reviewChip,
  className,
  children,
}: GoldenTimeQuestionCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-golden/20 bg-golden-soft px-5 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-text-primary">{word}</span>
          {reading ? (
            <span className="text-xs text-text-muted">{reading}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {questionType ? (
            <span className="rounded-pill bg-white/60 px-2 py-0.5 text-[10px] text-text-muted">
              {questionType}
            </span>
          ) : null}
          {reviewChip}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export { GoldenTimeQuestionCard };
```

- [ ] **Step 7: Create `feedback-card.tsx`**

```tsx
import * as React from "react";
import { AlertTriangle, CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import { cva } from "class-variance-authority";

import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";
import type { FeedbackState } from "@/components/learning/types";

const feedbackVariants = cva(
  "flex items-start gap-3.5 rounded-sm border-l-[3px] px-5 py-4",
  {
    variants: {
      state: {
        correct: "border-success bg-success-soft text-success-foreground",
        incorrect: "border-danger bg-danger-soft text-danger-foreground",
        partial: "border-warning bg-warning-soft text-warning-foreground",
        hint: "border-border bg-muted text-text-secondary",
      },
    },
    defaultVariants: { state: "correct" },
  }
);

const ICON_MAP: Record<FeedbackState, React.ReactElement> = {
  correct: <CheckCircle2 className="size-5 shrink-0" aria-hidden />,
  incorrect: <XCircle className="size-5 shrink-0" aria-hidden />,
  partial: <AlertTriangle className="size-5 shrink-0" aria-hidden />,
  hint: <Lightbulb className="size-5 shrink-0" aria-hidden />,
};

const DEFAULT_TITLE: Record<FeedbackState, string> = {
  correct: "Chính xác!",
  incorrect: "Chưa đúng",
  partial: "Gần đúng",
  hint: "Gợi ý",
};

export type FeedbackCardProps = {
  state: FeedbackState;
  title?: string;
  explanation?: string;
  continueLabel?: string;
  onContinue?: () => void;
  className?: string;
};

function FeedbackCard({
  state,
  title,
  explanation,
  continueLabel = "Tiếp tục",
  onContinue,
  className,
}: FeedbackCardProps) {
  return (
    <div className={cn(feedbackVariants({ state }), className)}>
      {ICON_MAP[state]}
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-base font-semibold">{title ?? DEFAULT_TITLE[state]}</p>
        {explanation ? (
          <p className="text-sm leading-normal opacity-85">{explanation}</p>
        ) : null}
      </div>
      {onContinue ? (
        <LexiButton
          variant="primary"
          size="sm"
          onClick={onContinue}
          className="shrink-0 self-start"
        >
          {continueLabel}
        </LexiButton>
      ) : null}
    </div>
  );
}

export { FeedbackCard, feedbackVariants };
```

- [ ] **Step 8: Run test to verify it passes**

```bash
npm run test -- src/components/learning/exercises/__tests__/choice-option.test.tsx
```

Expected: 4 tests PASS.

- [ ] **Step 9: Lint and typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add src/components/learning/exercises/flashcard-intro-card.tsx \
        src/components/learning/exercises/choice-option.tsx \
        src/components/learning/exercises/answer-choice-button.tsx \
        src/components/learning/exercises/golden-time-question-card.tsx \
        src/components/learning/exercises/feedback-card.tsx \
        src/components/learning/exercises/__tests__/choice-option.test.tsx
git commit -m "feat(components): add presentational exercise components"
```

---

## Task 4: Interactive Exercise Components + Exercises Barrel

**Files:**
- Create: `src/components/learning/exercises/flashcard.tsx`
- Create: `src/components/learning/exercises/audio-question-card.tsx`
- Create: `src/components/learning/exercises/fill-blank-card.tsx`
- Create: `src/components/learning/exercises/spelling-input-card.tsx`
- Create: `src/components/learning/exercises/collocation-practice-card.tsx`
- Create: `src/components/learning/exercises/__tests__/flashcard.test.tsx`
- Create: `src/components/learning/exercises/index.ts`

**Interfaces:**
- Consumes: `ExerciseAnswerState` from `@/components/learning/types`; `Input` from `@/components/ui/input`; `IconButton`, `LexiButton` from `@/components/shared`
- Produces: `Flashcard`, `AudioQuestionCard`, `FillBlankCard`, `SpellingInputCard`, `CollocationPracticeCard` (used by learning session pages)

- [ ] **Step 1: Write failing test for `Flashcard`**

Create `src/components/learning/exercises/__tests__/flashcard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Flashcard } from "../flashcard";

const baseProps = {
  word: "猫",
  meaning: "Con mèo",
};

describe("Flashcard", () => {
  it("shows front face by default (unflipped)", () => {
    render(<Flashcard {...baseProps} />);
    expect(screen.getByText("Nhấn vào thẻ để xem nghĩa")).toBeInTheDocument();
  });

  it("flips to back face on click", async () => {
    const user = userEvent.setup();
    render(<Flashcard {...baseProps} />);
    await user.click(screen.getByRole("button", { name: /xem nghĩa/i }));
    expect(screen.getByRole("button", { name: /ẩn nghĩa/i })).toBeInTheDocument();
  });

  it("calls onFlip with toggled value when controlled", async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(<Flashcard {...baseProps} isFlipped={false} onFlip={onFlip} />);
    await user.click(screen.getByRole("button", { name: /xem nghĩa/i }));
    expect(onFlip).toHaveBeenCalledWith(true);
  });

  it("flips on Enter key press", async () => {
    const user = userEvent.setup();
    render(<Flashcard {...baseProps} />);
    const card = screen.getByRole("button", { name: /xem nghĩa/i });
    card.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: /ẩn nghĩa/i })).toBeInTheDocument();
  });

  it("renders audio buttons with aria-labels", () => {
    render(<Flashcard {...baseProps} audioLabel="Nghe" />);
    expect(screen.getByRole("button", { name: "Nghe" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nghe chậm" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- src/components/learning/exercises/__tests__/flashcard.test.tsx
```

Expected: FAIL — "Cannot find module '../flashcard'"

- [ ] **Step 3: Create `flashcard.tsx`**

```tsx
"use client";

import * as React from "react";
import { Turtle, Volume2 } from "lucide-react";

import { IconButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";

function speakWord(word: string, lang: string, slow: boolean) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = lang;
    u.rate = slow ? 0.45 : 0.95;
    window.speechSynthesis.speak(u);
  } catch {
    // TTS unavailable
  }
}

export type FlashcardProps = {
  word: string;
  reading?: string;
  ipa?: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  pos?: string;
  lang?: string;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  onPlayAudio?: () => void;
  audioLabel?: string;
  isAudioPlaying?: boolean;
  className?: string;
};

function Flashcard({
  word,
  reading,
  ipa,
  meaning,
  example,
  exampleTranslation,
  pos,
  lang = "ja-JP",
  isFlipped: controlledFlipped,
  onFlip,
  onPlayAudio,
  audioLabel = "Nghe phát âm",
  className,
}: FlashcardProps) {
  const [internalFlipped, setInternalFlipped] = React.useState(false);
  const isFlipped =
    controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  function handleFlip() {
    const next = !isFlipped;
    if (onFlip) {
      onFlip(next);
    } else {
      setInternalFlipped(next);
    }
  }

  function handleAudio(slow: boolean) {
    if (onPlayAudio) {
      onPlayAudio();
    } else {
      speakWord(word, lang, slow);
    }
  }

  const highlightedExample = React.useMemo(() => {
    if (!example || !word) return example;
    const parts = example.split(word);
    if (parts.length < 2) return example;
    return (
      <>
        {parts[0]}
        <strong className="border-b-2 border-primary pb-px text-primary">
          {word}
        </strong>
        {parts.slice(1).join(word)}
      </>
    );
  }, [example, word]);

  return (
    <div
      className={cn(
        "flex w-full max-w-lg flex-col items-center gap-4",
        className
      )}
    >
      {/* Audio controls */}
      <div className="flex gap-3">
        <IconButton
          variant="ghost"
          label={audioLabel}
          className="size-12 rounded-full border border-border bg-card shadow-sm text-primary"
          onClick={() => handleAudio(false)}
        >
          <Volume2 className="size-5" />
        </IconButton>
        <IconButton
          variant="ghost"
          label="Nghe chậm"
          className="size-12 rounded-full border border-border bg-card shadow-sm text-golden-foreground"
          onClick={() => handleAudio(true)}
        >
          <Turtle className="size-5" />
        </IconButton>
      </div>

      {/* Card */}
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Ẩn nghĩa" : "Xem nghĩa"}
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleFlip();
          }
        }}
        className="relative h-[360px] w-full cursor-pointer select-none overflow-hidden rounded-card border border-border bg-card shadow-sm"
      >
        {/* Front */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center transition-all duration-300",
            isFlipped
              ? "pointer-events-none -translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          )}
        >
          <div className="flex h-32 w-48 shrink-0 items-center justify-center rounded-md bg-muted text-text-muted" />
          <div className="text-2xl leading-snug text-text-primary">
            {highlightedExample ?? word}
          </div>
          {exampleTranslation ? (
            <div className="text-sm text-text-secondary">
              {exampleTranslation}
            </div>
          ) : null}
          <div className="absolute bottom-4 text-xs text-text-muted">
            Nhấn vào thẻ để xem nghĩa
          </div>
        </div>

        {/* Back */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center transition-all duration-300",
            isFlipped
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          )}
        >
          <div className="text-5xl font-bold tracking-tight text-text-primary">
            {word}
          </div>
          <div className="text-xl font-medium text-text-secondary">
            {reading}
            {ipa ? (
              <span className="ml-2 text-base text-text-muted">{ipa}</span>
            ) : null}
          </div>
          {pos ? (
            <div className="text-xs uppercase tracking-wide text-text-muted">
              {pos}
            </div>
          ) : null}
          <div className="text-3xl font-semibold text-text-primary">
            {meaning}
          </div>
          {example ? (
            <div className="mt-2 max-w-sm text-base leading-relaxed text-text-secondary">
              {example}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { Flashcard };
```

- [ ] **Step 4: Create `audio-question-card.tsx`**

```tsx
"use client";

import * as React from "react";
import { PauseCircle, PlayCircle } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type AudioQuestionCardProps = {
  prompt?: string;
  isPlaying?: boolean;
  onPlay?: () => void;
  className?: string;
  children?: React.ReactNode;
};

function AudioQuestionCard({
  prompt = "Nghe và chọn đáp án đúng",
  isPlaying: controlledPlaying,
  onPlay,
  className,
  children,
}: AudioQuestionCardProps) {
  const [internalPlaying, setInternalPlaying] = React.useState(false);
  const isPlaying =
    controlledPlaying !== undefined ? controlledPlaying : internalPlaying;

  function handlePlay() {
    if (onPlay) {
      onPlay();
    } else {
      setInternalPlaying((v) => !v);
    }
  }

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card px-7 py-7 text-center",
        className
      )}
    >
      <p className="mb-4 text-sm text-text-secondary">{prompt}</p>
      <button
        type="button"
        aria-label={isPlaying ? "Dừng audio" : "Phát audio"}
        aria-pressed={isPlaying}
        onClick={handlePlay}
        className={cn(
          "mb-5 inline-flex size-16 items-center justify-center rounded-full border-2 border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isPlaying
            ? "bg-primary text-white"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        {isPlaying ? (
          <PauseCircle className="size-6" aria-hidden />
        ) : (
          <PlayCircle className="size-6" aria-hidden />
        )}
      </button>
      {children ? <div className="text-left">{children}</div> : null}
    </div>
  );
}

export { AudioQuestionCard };
```

- [ ] **Step 5: Create `fill-blank-card.tsx`**

```tsx
"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";
import type { ExerciseAnswerState } from "@/components/learning/types";

export type FillBlankCardProps = {
  sentenceBefore: string;
  sentenceAfter: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  state?: ExerciseAnswerState;
  correctAnswer?: string;
  className?: string;
};

function FillBlankCard({
  sentenceBefore,
  sentenceAfter,
  value,
  onChange,
  onSubmit,
  state = "idle",
  correctAnswer,
  className,
}: FillBlankCardProps) {
  const blankClass = cn(
    "mx-1 inline-block min-w-[80px] border-b-2 px-3 py-0.5 text-center font-semibold",
    state === "correct" && "border-success text-success-foreground",
    state === "incorrect" && "border-danger text-danger-foreground",
    (state === "idle" || state === "selected") &&
      "border-primary text-text-primary"
  );

  const isLocked = state !== "idle" && state !== "selected";

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card px-7 py-7",
        className
      )}
    >
      <div className="mb-4 text-center text-lg leading-loose text-text-primary">
        {sentenceBefore}
        <span className={blankClass}>{value || "   "}</span>
        {sentenceAfter}
      </div>
      <div className="flex flex-col items-center gap-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) onSubmit();
          }}
          disabled={isLocked}
          aria-label="Điền vào chỗ trống"
          className={cn("max-w-xs text-center text-lg font-semibold", {
            "border-success bg-success-soft": state === "correct",
            "border-danger bg-danger-soft": state === "incorrect",
          })}
          autoFocus
        />
        {!isLocked && onSubmit ? (
          <LexiButton variant="primary" onClick={onSubmit}>
            Kiểm tra
          </LexiButton>
        ) : null}
        {state === "incorrect" && correctAnswer ? (
          <p className="text-sm text-danger-foreground">
            Đáp án đúng: <strong>{correctAnswer}</strong>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { FillBlankCard };
```

- [ ] **Step 6: Create `spelling-input-card.tsx`**

```tsx
"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";
import type { ExerciseAnswerState } from "@/components/learning/types";

export type SpellingInputCardProps = {
  prompt: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  state?: ExerciseAnswerState;
  correctAnswer?: string;
  className?: string;
};

function SpellingInputCard({
  prompt,
  hint,
  value,
  onChange,
  onSubmit,
  state = "idle",
  correctAnswer,
  className,
}: SpellingInputCardProps) {
  const isLocked = state !== "idle" && state !== "selected";

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card px-7 py-7 text-center",
        className
      )}
    >
      <p className="mb-2 text-sm text-text-secondary">{prompt}</p>
      {hint ? (
        <p className="mb-4 text-xs text-text-muted">{hint}</p>
      ) : null}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
        disabled={isLocked}
        aria-label="Nhập từ"
        className={cn(
          "mx-auto h-12 max-w-xs text-center text-xl font-semibold",
          {
            "border-success bg-success-soft": state === "correct",
            "border-danger bg-danger-soft": state === "incorrect",
          }
        )}
        autoFocus
      />
      {state === "incorrect" && correctAnswer ? (
        <p className="mt-3 text-sm text-danger-foreground">
          Đáp án đúng: <strong>{correctAnswer}</strong>
        </p>
      ) : null}
      {!isLocked && onSubmit ? (
        <LexiButton variant="primary" className="mt-4" onClick={onSubmit}>
          Kiểm tra
        </LexiButton>
      ) : null}
    </div>
  );
}

export { SpellingInputCard };
```

- [ ] **Step 7: Create `collocation-practice-card.tsx`**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type CollocationPracticeCardProps = {
  baseWord: string;
  prompt?: string;
  options: string[];
  selectedIndex?: number;
  correctIndex?: number;
  state?: "idle" | "answered";
  onSelect?: (index: number) => void;
  className?: string;
};

function CollocationPracticeCard({
  baseWord,
  prompt,
  options,
  selectedIndex,
  correctIndex,
  state = "idle",
  onSelect,
  className,
}: CollocationPracticeCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card px-7 py-7 text-center",
        className
      )}
    >
      {prompt ? (
        <p className="mb-2 text-sm text-text-secondary">{prompt}</p>
      ) : null}
      <div className="mb-5 text-2xl font-bold text-text-primary">
        ___ + {baseWord}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((opt, i) => {
          const isSelected = i === selectedIndex;
          const isCorrect = state === "answered" && i === correctIndex;
          const isWrong =
            state === "answered" && isSelected && i !== correctIndex;

          return (
            <button
              key={i}
              type="button"
              onClick={() => state === "idle" && onSelect?.(i)}
              disabled={state === "answered"}
              aria-pressed={isSelected}
              className={cn(
                "rounded-button border-[1.5px] px-[18px] py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none",
                isCorrect &&
                  "border-success bg-success-soft text-success-foreground",
                isWrong &&
                  "border-danger bg-danger-soft text-danger-foreground",
                isSelected &&
                  state === "idle" &&
                  "border-primary bg-primary/10 text-primary",
                !isSelected &&
                  !isCorrect &&
                  !isWrong &&
                  "border-border bg-card text-text-primary hover:border-border/80 hover:bg-muted/40"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { CollocationPracticeCard };
```

- [ ] **Step 8: Create `exercises/index.ts`**

```ts
export { Flashcard, type FlashcardProps } from "./flashcard";
export {
  FlashcardIntroCard,
  type FlashcardIntroCardProps,
} from "./flashcard-intro-card";
export {
  ChoiceOption,
  type ChoiceOptionProps,
  choiceOptionVariants,
} from "./choice-option";
export {
  AnswerChoiceButton,
  type AnswerChoiceButtonProps,
  answerVariants,
} from "./answer-choice-button";
export {
  AudioQuestionCard,
  type AudioQuestionCardProps,
} from "./audio-question-card";
export {
  GoldenTimeQuestionCard,
  type GoldenTimeQuestionCardProps,
} from "./golden-time-question-card";
export { FillBlankCard, type FillBlankCardProps } from "./fill-blank-card";
export {
  SpellingInputCard,
  type SpellingInputCardProps,
} from "./spelling-input-card";
export {
  CollocationPracticeCard,
  type CollocationPracticeCardProps,
} from "./collocation-practice-card";
export {
  FeedbackCard,
  type FeedbackCardProps,
  feedbackVariants,
} from "./feedback-card";
// Re-export shared types
export type {
  ExerciseAnswerState,
  ExerciseQuestionType,
  FeedbackState,
  SessionProgress,
  SessionSummary,
} from "@/components/learning/types";
```

- [ ] **Step 9: Run test to verify Flashcard tests pass**

```bash
npm run test -- src/components/learning/exercises/__tests__/flashcard.test.tsx
```

Expected: 5 tests PASS.

- [ ] **Step 10: Lint and typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: no errors.

- [ ] **Step 11: Commit**

```bash
git add src/components/learning/exercises/
git commit -m "feat(components): add interactive exercise components and exercises barrel"
```

---

## Task 5: Notebook Layout & List Primitives

**Files:**
- Create: `src/components/notebook/notebook-split-layout.tsx`
- Create: `src/components/notebook/notebook-filter-tabs.tsx`
- Create: `src/components/notebook/notebook-item-row.tsx`
- Create: `src/components/notebook/search-result-group.tsx`

**Interfaces:**
- Consumes: `NotebookItem`, `NotebookTab`, `DictionaryResult` from `./types`; `Sheet*` from `@/components/ui/sheet`; `Tabs*` from `@/components/ui/tabs`
- Produces: `NotebookSplitLayout`, `NotebookFilterTabs`, `NotebookItemRow`, `SearchResultGroup` (used by notebook pages and Task 9's barrel)

- [ ] **Step 1: Create `notebook-split-layout.tsx`**

```tsx
"use client";

import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";

export type NotebookSplitLayoutProps = {
  list: React.ReactNode;
  detail: React.ReactNode;
  detailOpen?: boolean;
  onDetailOpenChange?: (open: boolean) => void;
  detailTitle?: string;
  className?: string;
};

function NotebookSplitLayout({
  list,
  detail,
  detailOpen = false,
  onDetailOpenChange,
  detailTitle = "Chi tiết",
  className,
}: NotebookSplitLayoutProps) {
  return (
    <>
      {/* Desktop */}
      <div
        className={cn(
          "hidden h-full md:grid md:grid-cols-[320px_1fr]",
          className
        )}
      >
        <aside className="flex flex-col overflow-hidden border-r border-border bg-card">
          {list}
        </aside>
        <main className="overflow-auto bg-card">{detail}</main>
      </div>

      {/* Mobile */}
      <div className="flex h-full flex-col md:hidden">
        <div className="flex-1 overflow-auto bg-card">{list}</div>
        <Sheet open={detailOpen} onOpenChange={onDetailOpenChange}>
          <SheetContent side="bottom" className="h-[85dvh]">
            <SheetHeader>
              <SheetTitle>{detailTitle}</SheetTitle>
            </SheetHeader>
            <div className="mt-4 overflow-auto">{detail}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export { NotebookSplitLayout };
```

- [ ] **Step 2: Create `notebook-filter-tabs.tsx`**

```tsx
import * as React from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";
import type { NotebookTab } from "./types";

export type NotebookFilterTabsProps = {
  tabs: NotebookTab[];
  activeId: string;
  onTabChange: (id: string) => void;
  className?: string;
};

function NotebookFilterTabs({
  tabs,
  activeId,
  onTabChange,
  className,
}: NotebookFilterTabsProps) {
  return (
    <Tabs
      value={activeId}
      onValueChange={onTabChange}
      className={cn(className)}
    >
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex-1 gap-1.5"
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <span className="rounded-pill bg-muted px-1.5 py-0.5 text-[10px] text-text-muted">
                {tab.count}
              </span>
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export { NotebookFilterTabs };
```

- [ ] **Step 3: Create `notebook-item-row.tsx`**

```tsx
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import type { NotebookItem } from "./types";

const statusTextVariants = cva("text-[10px] font-semibold", {
  variants: {
    status: {
      new: "text-text-muted",
      learning: "text-text-secondary",
      review: "text-warning-foreground",
      mastered: "text-success-foreground",
      locked: "text-text-muted",
    },
  },
  defaultVariants: { status: "new" },
});

export type NotebookItemRowProps = {
  item: NotebookItem;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

function NotebookItemRow({
  item,
  selected = false,
  onClick,
  className,
}: NotebookItemRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary/10"
          : "border-transparent hover:bg-muted/50",
        className
      )}
      aria-current={selected ? "true" : undefined}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-text-primary">
            {item.word}
          </span>
          {item.reading ? (
            <span className="text-xs text-text-muted">{item.reading}</span>
          ) : null}
        </div>
        {item.meaning ? (
          <div className="mt-0.5 truncate text-xs text-text-secondary">
            {item.meaning}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        {item.statusLabel ? (
          <span
            className={statusTextVariants({ status: item.status ?? "new" })}
          >
            {item.statusLabel}
          </span>
        ) : null}
        {item.addedAt ? (
          <span className="text-[10px] text-text-muted">{item.addedAt}</span>
        ) : null}
      </div>
    </button>
  );
}

export { NotebookItemRow };
```

- [ ] **Step 4: Create `search-result-group.tsx`**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { DictionaryResult } from "./types";

export type SearchResultGroupProps = {
  title: string;
  items: DictionaryResult[];
  onSelect?: (item: DictionaryResult) => void;
  className?: string;
};

function SearchResultGroup({
  title,
  items,
  onSelect,
  className,
}: SearchResultGroupProps) {
  return (
    <div className={cn(className)}>
      <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item)}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-sm font-semibold text-text-primary">
            {item.word}
          </span>
          {item.reading ? (
            <span className="text-xs text-text-muted">{item.reading}</span>
          ) : null}
          <span className="ml-auto text-xs text-text-secondary">
            {item.meaning}
          </span>
        </button>
      ))}
    </div>
  );
}

export { SearchResultGroup };
```

- [ ] **Step 5: Lint and typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/notebook/notebook-split-layout.tsx \
        src/components/notebook/notebook-filter-tabs.tsx \
        src/components/notebook/notebook-item-row.tsx \
        src/components/notebook/search-result-group.tsx
git commit -m "feat(components): add notebook layout and list primitive components"
```

---

## Task 6: Notebook Dialog Components

**Files:**
- Create: `src/components/notebook/dictionary-search-command.tsx`
- Create: `src/components/notebook/add-to-learning-dialog.tsx`
- Create: `src/components/notebook/__tests__/add-to-learning-dialog.test.tsx`

**Interfaces:**
- Consumes: `DictionaryResult`, notebook collection type from `./types`; `CommandDialog*` from `@/components/ui/command`; `Dialog*` from `@/components/ui/dialog`; `RadioGroup`, `RadioGroupItem` from `@/components/ui/radio-group`; `Label` from `@/components/ui/label`; `LexiButton` from `@/components/shared`
- Produces: `DictionarySearchCommand`, `AddToLearningDialog` (used by notebook pages)

- [ ] **Step 1: Write failing test for `AddToLearningDialog`**

Create `src/components/notebook/__tests__/add-to-learning-dialog.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AddToLearningDialog } from "../add-to-learning-dialog";

const collections = [
  { id: "col-1", name: "JLPT N4" },
  { id: "col-2", name: "Business Japanese" },
];

describe("AddToLearningDialog", () => {
  it("renders collection options when open", () => {
    render(
      <AddToLearningDialog
        open={true}
        onOpenChange={vi.fn()}
        word="猫"
        collections={collections}
        onSelectedCollectionChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText("JLPT N4")).toBeInTheDocument();
    expect(screen.getByText("Business Japanese")).toBeInTheDocument();
  });

  it("calls onSelectedCollectionChange when radio changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AddToLearningDialog
        open={true}
        onOpenChange={vi.fn()}
        word="猫"
        collections={collections}
        selectedCollectionId="col-1"
        onSelectedCollectionChange={onChange}
        onConfirm={vi.fn()}
      />
    );
    await user.click(screen.getByLabelText("Business Japanese"));
    expect(onChange).toHaveBeenCalledWith("col-2");
  });

  it("calls onConfirm when confirm button clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <AddToLearningDialog
        open={true}
        onOpenChange={vi.fn()}
        word="猫"
        collections={collections}
        selectedCollectionId="col-1"
        onSelectedCollectionChange={vi.fn()}
        onConfirm={onConfirm}
      />
    );
    await user.click(screen.getByRole("button", { name: "Thêm" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- src/components/notebook/__tests__/add-to-learning-dialog.test.tsx
```

Expected: FAIL — "Cannot find module '../add-to-learning-dialog'"

- [ ] **Step 3: Create `dictionary-search-command.tsx`**

```tsx
"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { DictionaryResult } from "./types";

export type DictionarySearchCommandProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: DictionaryResult[];
  loading?: boolean;
  onSelect?: (item: DictionaryResult) => void;
};

function DictionarySearchCommand({
  open,
  onOpenChange,
  query,
  onQueryChange,
  results,
  loading = false,
  onSelect,
}: DictionarySearchCommandProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Tìm từ, kanji, hanzi…"
        value={query}
        onValueChange={onQueryChange}
      />
      <CommandList>
        {loading ? (
          <div className="px-4 py-3 text-center text-sm text-text-muted">
            Đang tìm...
          </div>
        ) : (
          <>
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            {results.length > 0 ? (
              <CommandGroup heading="Kết quả">
                {results.map((r) => (
                  <CommandItem
                    key={r.id}
                    value={r.word}
                    onSelect={() => onSelect?.(r)}
                    className="gap-2"
                  >
                    <span className="text-sm font-semibold text-text-primary">
                      {r.word}
                    </span>
                    {r.reading ? (
                      <span className="text-xs text-text-muted">
                        {r.reading}
                      </span>
                    ) : null}
                    {r.partOfSpeech ? (
                      <span className="text-xs italic text-text-muted">
                        {r.partOfSpeech}
                      </span>
                    ) : null}
                    <span className="ml-auto text-xs text-text-secondary">
                      {r.meaning}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export { DictionarySearchCommand };
```

- [ ] **Step 4: Create `add-to-learning-dialog.tsx`**

```tsx
"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";

export type AddToLearningDialogCollection = {
  id: string;
  name: string;
};

export type AddToLearningDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: string;
  meaning?: string;
  collections: AddToLearningDialogCollection[];
  selectedCollectionId?: string;
  onSelectedCollectionChange: (id: string) => void;
  onConfirm: () => void;
};

function AddToLearningDialog({
  open,
  onOpenChange,
  word,
  meaning,
  collections,
  selectedCollectionId,
  onSelectedCollectionChange,
  onConfirm,
}: AddToLearningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Thêm vào học</DialogTitle>
          {meaning ? (
            <DialogDescription>
              <strong>{word}</strong> — {meaning}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-primary">
            Chọn bộ sưu tập:
          </p>
          <RadioGroup
            value={selectedCollectionId}
            onValueChange={onSelectedCollectionChange}
            className="gap-2"
          >
            {collections.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
                  selectedCollectionId === c.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <RadioGroupItem value={c.id} id={`col-${c.id}`} />
                <Label
                  htmlFor={`col-${c.id}`}
                  className="flex-1 cursor-pointer text-sm text-text-primary"
                >
                  {c.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <LexiButton variant="quiet" onClick={() => onOpenChange(false)}>
            Hủy
          </LexiButton>
          <LexiButton
            variant="primary"
            onClick={onConfirm}
            disabled={!selectedCollectionId}
          >
            Thêm
          </LexiButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AddToLearningDialog };
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm run test -- src/components/notebook/__tests__/add-to-learning-dialog.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 6: Lint and typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/notebook/dictionary-search-command.tsx \
        src/components/notebook/add-to-learning-dialog.tsx \
        src/components/notebook/__tests__/add-to-learning-dialog.test.tsx
git commit -m "feat(components): add notebook dialog components (search command, add to learning)"
```

---

## Task 7: Word Mastery Components

**Files:**
- Create: `src/components/notebook/skill-weakness-panel.tsx`
- Create: `src/components/notebook/word-mastery-header.tsx`
- Create: `src/components/notebook/word-senses-list.tsx`
- Create: `src/components/notebook/word-mastery-canvas.tsx`

**Interfaces:**
- Consumes: `WordSkillStat`, `WordSense`, `NextReview` from `./types`; `SkillKey` from `@/components/lexipath`; `SkillProgressLane` from `@/components/lexipath`; `LexiButton` from `@/components/shared`
- Produces: `SkillWeaknessPanel`, `WordMasteryHeader`, `WordSensesList`, `WordMasteryCanvas` (composed by notebook pages)

- [ ] **Step 1: Create `skill-weakness-panel.tsx`**

`SkillProgressLane` takes `{ skill, masteredCount, totalCount, accuracyPct }`. Adapt `WordSkillStat.accuracy` as `masteredCount` with `totalCount: 100` to drive the bar width.

```tsx
import * as React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { SkillProgressLane } from "@/components/lexipath";
import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";
import type { SkillKey } from "@/components/lexipath";
import type { WordSkillStat } from "./types";

export type SkillWeaknessPanelProps = {
  title?: string;
  skills: WordSkillStat[];
  threshold?: number;
  onPractice?: (skill: SkillKey) => void;
  className?: string;
};

function SkillWeaknessPanel({
  title = "Kỹ năng cần củng cố",
  skills,
  threshold = 70,
  onPractice,
  className,
}: SkillWeaknessPanelProps) {
  const sorted = [...skills].sort(
    (a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0)
  );
  const weakest = sorted[0];
  const isWeak =
    weakest !== undefined && (weakest.accuracy ?? 0) < threshold;

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-card border border-border bg-card p-4",
        className
      )}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </div>

      {isWeak ? (
        <div className="flex items-center gap-3 rounded-md bg-danger-soft p-3">
          <span className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-card text-danger-foreground">
            <AlertTriangle className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary">
              {weakest.label} là kỹ năng yếu nhất
            </p>
            <p className="text-xs text-text-secondary">
              Chính xác {weakest.accuracy}%
              {weakest.attempts != null
                ? ` · ${weakest.attempts} lần thử`
                : ""}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2.5">
        {sorted.map((s) => (
          <SkillProgressLane
            key={s.skill}
            skill={s.skill}
            masteredCount={s.accuracy}
            totalCount={100}
            accuracyPct={s.accuracy}
          />
        ))}
      </div>

      {isWeak && onPractice ? (
        <LexiButton
          variant="primary"
          size="sm"
          className="self-start"
          onClick={() => onPractice(weakest.skill)}
        >
          Luyện {weakest.label}
          <ArrowRight className="ml-1.5 size-3.5" aria-hidden />
        </LexiButton>
      ) : null}
    </div>
  );
}

export { SkillWeaknessPanel };
```

- [ ] **Step 2: Create `word-mastery-header.tsx`**

```tsx
import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { NextReview } from "./types";

export type WordMasteryHeaderProps = {
  headword: string;
  reading?: string;
  partOfSpeech?: string;
  script?: "latin" | "jp" | "cjk";
  reviewChip?: React.ReactNode;
  nextReview?: NextReview;
  className?: string;
};

function WordMasteryHeader({
  headword,
  reading,
  partOfSpeech,
  script = "latin",
  reviewChip,
  nextReview,
  className,
}: WordMasteryHeaderProps) {
  const headwordClass = cn(
    "font-bold text-text-primary leading-tight",
    script === "latin" ? "text-5xl tracking-tight" : "text-5xl tracking-wide"
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="rounded-card border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {reading && script !== "latin" ? (
              <div className="mb-1 text-sm text-text-secondary">{reading}</div>
            ) : null}
            <h1 className={headwordClass}>{headword}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {reading && script === "latin" ? (
                <span className="rounded-sm bg-muted px-2 py-0.5 font-mono text-sm text-text-secondary">
                  {reading}
                </span>
              ) : null}
              {partOfSpeech ? (
                <span className="text-xs italic text-text-muted">
                  {partOfSpeech}
                </span>
              ) : null}
            </div>
          </div>
          {reviewChip ? (
            <div className="shrink-0">{reviewChip}</div>
          ) : null}
        </div>
      </div>

      {nextReview ? (
        <div className="flex items-center gap-3 rounded-card border border-golden/40 bg-golden-soft px-4 py-3">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-golden/20 text-golden-foreground">
            <Clock className="size-4" aria-hidden />
          </span>
          <div className="flex-1">
            <div className="text-xs text-golden-foreground">
              {nextReview.label ?? "Ôn tập tiếp theo"}
            </div>
            <div className="text-sm font-semibold text-golden-foreground">
              {nextReview.when}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { WordMasteryHeader };
```

- [ ] **Step 3: Create `word-senses-list.tsx`**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { WordSense } from "./types";

export type WordSensesListProps = {
  senses: WordSense[];
  className?: string;
};

function WordSensesList({ senses, className }: WordSensesListProps) {
  if (senses.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2.5", className)} role="list">
      {senses.map((sense, i) => (
        <div
          key={i}
          className="rounded-card border border-border bg-card p-4"
          role="listitem"
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary"
              aria-label={`Nghĩa ${i + 1}`}
            >
              {i + 1}
            </span>
            {sense.pos ? (
              <span className="text-xs italic text-text-muted">{sense.pos}</span>
            ) : null}
          </div>
          <p className="mt-2 text-base leading-normal text-text-primary">
            {sense.gloss}
          </p>
          {sense.example ? (
            <p className="mt-2 border-l-2 border-border pl-3 text-sm italic leading-relaxed text-text-secondary">
              {sense.example}
            </p>
          ) : null}
          {sense.exampleTranslation ? (
            <p className="mt-1 pl-3 text-xs text-text-muted">
              {sense.exampleTranslation}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export { WordSensesList };
```

- [ ] **Step 4: Create `word-mastery-canvas.tsx`**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { SkillKey } from "@/components/lexipath";
import { WordMasteryHeader } from "./word-mastery-header";
import { WordSensesList } from "./word-senses-list";
import { SkillWeaknessPanel } from "./skill-weakness-panel";
import type { WordSense, WordSkillStat, NextReview } from "./types";

export type WordMasteryCanvasProps = {
  headword: string;
  reading?: string;
  partOfSpeech?: string;
  script?: "latin" | "jp" | "cjk";
  reviewChip?: React.ReactNode;
  senses?: WordSense[];
  skills?: WordSkillStat[];
  nextReview?: NextReview;
  aside?: React.ReactNode;
  onPracticeSkill?: (skill: SkillKey) => void;
  className?: string;
};

function WordMasteryCanvas({
  headword,
  reading,
  partOfSpeech,
  script,
  reviewChip,
  senses = [],
  skills = [],
  nextReview,
  aside,
  onPracticeSkill,
  className,
}: WordMasteryCanvasProps) {
  const hasAside = aside !== undefined || skills.length > 0;

  return (
    <div
      className={cn(
        "grid gap-4",
        hasAside && "md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]",
        className
      )}
    >
      {/* Main column */}
      <div className="flex flex-col gap-4">
        <WordMasteryHeader
          headword={headword}
          reading={reading}
          partOfSpeech={partOfSpeech}
          script={script}
          reviewChip={reviewChip}
          nextReview={nextReview}
        />
        {senses.length > 0 ? <WordSensesList senses={senses} /> : null}
      </div>

      {/* Aside column */}
      {hasAside ? (
        <div className="flex flex-col gap-4">
          {skills.length > 0 ? (
            <SkillWeaknessPanel
              skills={skills}
              onPractice={onPracticeSkill}
            />
          ) : null}
          {aside}
        </div>
      ) : null}
    </div>
  );
}

export { WordMasteryCanvas };
```

- [ ] **Step 5: Lint and typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/notebook/skill-weakness-panel.tsx \
        src/components/notebook/word-mastery-header.tsx \
        src/components/notebook/word-senses-list.tsx \
        src/components/notebook/word-mastery-canvas.tsx
git commit -m "feat(components): add word mastery components (header, senses, canvas, skill weakness panel)"
```

---

## Task 8: Word Relation Map + Notebook Barrel

**Files:**
- Create: `src/components/notebook/word-relation-map.tsx`
- Create: `src/components/notebook/index.ts`

**Interfaces:**
- Consumes: `WordRelationGroup`, `WordRelation` from `./types`
- Produces: `WordRelationMap`; complete `notebook` barrel export (used by notebook pages)

- [ ] **Step 1: Create `word-relation-map.tsx`**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { WordRelationGroup, WordRelation } from "./types";

const RELATION_META: Record<
  WordRelationGroup["type"],
  { label: string; colorClass: string; dotClass: string }
> = {
  synonym: {
    label: "Đồng nghĩa",
    colorClass: "text-skill-meaning",
    dotClass: "border-skill-meaning",
  },
  antonym: {
    label: "Trái nghĩa",
    colorClass: "text-skill-usage",
    dotClass: "border-skill-usage",
  },
  confusable: {
    label: "Dễ nhầm",
    colorClass: "text-danger-foreground",
    dotClass: "border-danger",
  },
  collocation: {
    label: "Kết hợp",
    colorClass: "text-skill-collocation",
    dotClass: "border-skill-collocation",
  },
  grammar: {
    label: "Ngữ pháp",
    colorClass: "text-skill-spelling",
    dotClass: "border-skill-spelling",
  },
};

export type WordRelationMapProps = {
  headword?: string;
  groups?: WordRelationGroup[];
  onWordClick?: (word: WordRelation) => void;
  className?: string;
};

function WordRelationMap({
  headword,
  groups = [],
  onWordClick,
  className,
}: WordRelationMapProps) {
  return (
    <div
      className={cn("rounded-card border border-border bg-card p-4", className)}
    >
      <div className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Từ liên quan
      </div>

      {headword ? (
        <div className="mb-1 inline-flex items-center gap-2 rounded-pill border border-primary/30 bg-primary/10 px-3.5 py-1.5">
          <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />
          <span className="text-sm font-semibold text-primary">{headword}</span>
        </div>
      ) : null}

      <div className="flex flex-col" role="list">
        {groups.map((group, gi) => {
          const meta = RELATION_META[group.type];
          const isLast = gi === groups.length - 1;

          return (
            <div key={group.id} className="flex gap-3" role="listitem">
              {/* Connector rail */}
              <div className="flex w-3 shrink-0 flex-col items-center pt-1.5">
                <span
                  className={cn(
                    "size-2.5 shrink-0 rounded-full border-2 bg-card",
                    meta.dotClass
                  )}
                  aria-hidden
                />
                {!isLast ? (
                  <span
                    className="mt-0.5 w-0.5 flex-1 rounded-full bg-border"
                    aria-hidden
                  />
                ) : null}
              </div>

              {/* Group content */}
              <div
                className={cn("min-w-0 flex-1 pt-0.5", !isLast && "pb-4")}
              >
                <div
                  className={cn(
                    "mb-1.5 text-xs font-semibold",
                    meta.colorClass
                  )}
                  id={`relation-group-${group.id}`}
                >
                  {group.label || meta.label}
                </div>
                <div
                  className="flex flex-wrap gap-1.5"
                  aria-labelledby={`relation-group-${group.id}`}
                >
                  {group.relations.map((rel) => (
                    <button
                      key={rel.id}
                      type="button"
                      onClick={
                        onWordClick ? () => onWordClick(rel) : undefined
                      }
                      disabled={!onWordClick}
                      aria-label={`${rel.word}${rel.reading ? ` (${rel.reading})` : ""}`}
                      className={cn(
                        "inline-flex items-baseline gap-1.5 rounded-pill border border-border bg-muted/50 px-2.5 py-1 text-sm font-medium text-text-primary transition-colors",
                        onWordClick
                          ? "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          : "pointer-events-none"
                      )}
                    >
                      {rel.word}
                      {rel.reading ? (
                        <span className="text-xs text-text-muted">
                          {rel.reading}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { WordRelationMap };
```

- [ ] **Step 2: Create `notebook/index.ts`**

```ts
export {
  NotebookSplitLayout,
  type NotebookSplitLayoutProps,
} from "./notebook-split-layout";
export {
  NotebookFilterTabs,
  type NotebookFilterTabsProps,
} from "./notebook-filter-tabs";
export {
  NotebookItemRow,
  type NotebookItemRowProps,
} from "./notebook-item-row";
export {
  SearchResultGroup,
  type SearchResultGroupProps,
} from "./search-result-group";
export {
  DictionarySearchCommand,
  type DictionarySearchCommandProps,
} from "./dictionary-search-command";
export {
  AddToLearningDialog,
  type AddToLearningDialogProps,
  type AddToLearningDialogCollection,
} from "./add-to-learning-dialog";
export {
  SkillWeaknessPanel,
  type SkillWeaknessPanelProps,
} from "./skill-weakness-panel";
export {
  WordMasteryHeader,
  type WordMasteryHeaderProps,
} from "./word-mastery-header";
export {
  WordSensesList,
  type WordSensesListProps,
} from "./word-senses-list";
export {
  WordMasteryCanvas,
  type WordMasteryCanvasProps,
} from "./word-mastery-canvas";
export {
  WordRelationMap,
  type WordRelationMapProps,
} from "./word-relation-map";
export type {
  NotebookItem,
  NotebookTab,
  DictionaryResult,
  WordSense,
  WordSkillStat,
  WordRelation,
  WordRelationGroup,
  WordMastery,
  NextReview,
} from "./types";
```

- [ ] **Step 3: Lint and typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/notebook/word-relation-map.tsx \
        src/components/notebook/index.ts
git commit -m "feat(components): add word relation map and notebook barrel export"
```

---

## Task 9: Final Lint, Typecheck, and Test Run

**Files:** No new files — verification only.

**Interfaces:** All 23 components + 3 type/barrel files must pass.

- [ ] **Step 1: Run full test suite**

```bash
npm run test
```

Expected: all tests PASS. Specific tests:
- `src/components/learning/session/__tests__/exit-session-dialog.test.tsx` — 4 PASS
- `src/components/learning/exercises/__tests__/choice-option.test.tsx` — 4 PASS
- `src/components/learning/exercises/__tests__/flashcard.test.tsx` — 5 PASS
- `src/components/notebook/__tests__/add-to-learning-dialog.test.tsx` — 3 PASS

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: 0 errors, 0 warnings.

Common issues to fix:
- Unused imports → remove them
- `React` import not needed in React 19 → remove if present and unused
- Missing `aria-*` on interactive elements → add as needed

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

Common issues to fix:
- `exactOptionalPropertyTypes` violations: use `prop?: T` (not `prop?: T | undefined`) and assign conditionally, not with `=== undefined ? undefined : value`
- `href` on `next/link` must use `Route` type if `typedRoutes` is enabled — not applicable here (no Link usage in these components)
- `SkillKey` import path — always import from `@/components/lexipath`, never from the internal module

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore(components): verify lint and typecheck pass for PROMPT 07 components"
```

---

## Spec Reference

Full design spec: `docs/superpowers/specs/2026-06-22-prompt-07-learning-session-exercise-notebook-design.md`

## Client Boundary Quick Reference

| `"use client"` | Server-compatible |
|---|---|
| `flashcard.tsx` | `flashcard-intro-card.tsx` |
| `audio-question-card.tsx` | `choice-option.tsx` |
| `fill-blank-card.tsx` | `answer-choice-button.tsx` |
| `spelling-input-card.tsx` | `golden-time-question-card.tsx` |
| `exit-session-dialog.tsx` | `feedback-card.tsx` |
| `dictionary-search-command.tsx` | `collocation-practice-card.tsx` |
| `add-to-learning-dialog.tsx` | `session-summary-card.tsx` |
| `notebook-split-layout.tsx` | `learning-session-top-bar.tsx` |
| | `notebook-filter-tabs.tsx` |
| | `notebook-item-row.tsx` |
| | `search-result-group.tsx` |
| | `skill-weakness-panel.tsx` |
| | `word-mastery-header.tsx` |
| | `word-senses-list.tsx` |
| | `word-mastery-canvas.tsx` |
| | `word-relation-map.tsx` |
