# PROMPT 07 — Learning Session, Exercise, Notebook & Dictionary UI Components

**Date:** 2026-06-22  
**Status:** Approved  
**Scope:** Component-only migration. No features, APIs, DTOs, mappers, schemas, hooks, or routes.

---

## 1. Scope Constraints

Only create or modify files under:

```
src/components/learning/types.ts
src/components/learning/session/
src/components/learning/exercises/
src/components/notebook/
```

Never create:
- `src/features/*`
- `*.api.ts`, `*.dto.ts`, `*.mapper.ts`, `*.schema.ts`
- `page.tsx` or any route file

---

## 2. Context & Existing Codebase

**Source files:** `/Users/vanhuu/Downloads/lexipath-vocabulary-web-kit/components/learning/` and `components/notebook/`

**Existing components to compose (not recreate):**
- `FocusLearningShell` — `src/components/layouts/focus-learning-shell.tsx` — full-page learning wrapper with progress + close button.
- `ReviewReasonChip` — `@/components/lexipath` — coloured pill for review reasons (`due / overdue / weak / exam_miss`).
- `SkillProgressLane`, `SkillLaneGroup` — `@/components/lexipath` — skill lane bar charts.
- `EmptyState`, `ErrorState`, `LoadingSkeleton` — `@/components/shared` — empty/error/loading surfaces.
- `LexiButton`, `IconButton` — `@/components/shared` — LexiPath-flavoured buttons.

**shadcn/ui primitives available:**
`alert-dialog`, `button`, `command`, `dialog`, `input`, `progress`, `radio-group`, `separator`, `sheet`, `tabs`

**CSS tokens available (Tailwind utilities):**
- Golden: `bg-golden-soft`, `text-golden-foreground`, `border-golden/20`
- Status: `bg-success-soft`, `text-success-foreground`, `bg-danger-soft`, `text-danger-foreground`, `bg-warning-soft`, `text-warning-foreground`
- Skill: `bg-skill-meaning-soft`, `text-skill-meaning-foreground`, etc.

---

## 3. Shared Learning Types

**File:** `src/components/learning/types.ts`

Component-only types shared by session and exercise components. Not DTOs.

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

---

## 4. Learning Session Components

### 4.1 `learning-session-top-bar.tsx`

**JSDoc:**
```ts
/**
 * Standalone session top bar for custom learning layouts.
 * Use FocusLearningShell for full-page learning sessions.
 */
```

**Props:**
```ts
type LearningSessionTopBarProps = {
  current: number;
  total: number;
  title?: string;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
};
```

**Behavior:**
- Renders a slim progress bar (shadcn `Progress`) driven by `current/total`.
- Optional close button (`X` from lucide, `IconButton` from `@/components/shared`).
- Optional title string.
- No `"use client"` — fully controlled via props, no local state.

---

### 4.2 `exit-session-dialog.tsx`

**Props:**
```ts
type ExitSessionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit: () => void;
  progress?: number;  // 0–100
};
```

**Behavior:**
- Uses shadcn `AlertDialog` (`AlertDialogRoot`, `AlertDialogContent`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`).
- Shows optional progress bar if `progress` is provided.
- Exit button uses danger styling (`bg-danger text-white` or `variant="destructive"`).
- `"use client"` — AlertDialog interaction is client-side.

---

### 4.3 `session-summary-card.tsx`

**Props:**
```ts
type SessionSummaryCardProps = {
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
```

**Behavior:**
- Grid of stat tiles with cva tone variants (`primary / info / warning / streak`).
- Stats are optional — only rendered when provided.
- No `"use client"` — props-only rendering.

---

## 5. Exercise Components

### 5.1 `flashcard.tsx`

**Props:**
```ts
type FlashcardProps = {
  word: string;
  reading?: string;
  ipa?: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  pos?: string;
  imageIcon?: string;           // lucide icon name (not rendered via window.lucide)
  lang?: string;                // TTS language, default "ja-JP"
  isFlipped?: boolean;          // controlled
  onFlip?: (flipped: boolean) => void;
  onPlayAudio?: () => void;     // controlled audio callback
  audioLabel?: string;
  isAudioPlaying?: boolean;
  className?: string;
};
```

**Behavior:**
- Controlled flip via `isFlipped`/`onFlip` props. Falls back to internal state if both absent.
- Keyboard accessible: Enter/Space flips the card.
- Audio buttons use `Volume2` and `Turtle` from lucide with `aria-label`.
- If `onPlayAudio` is not provided and browser TTS is desired, wrap in:
  ```ts
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  ```
  with try/catch. TTS only triggered from explicit button click.
- No `dangerouslySetInnerHTML`. No `window.lucide`.
- `"use client"` — owns possible internal flip state + browser TTS.

---

### 5.2 `flashcard-intro-card.tsx`

**Props:**
```ts
type FlashcardIntroCardProps = {
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
```

**Behavior:**
- Server-compatible (no `"use client"`).
- Audio button: `Play` icon, `aria-label="Nghe phát âm"`.
- Continue button: shadcn `Button` default variant.

---

### 5.3 `choice-option.tsx`

**Props:**
```ts
type ChoiceOptionProps = {
  optionKey?: string;           // A / B / C / D label
  state?: ExerciseAnswerState;  // from learning/types.ts
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};
```

**Behavior:**
- cva variants for `idle / selected / correct / incorrect / disabled`.
- `Check` icon for correct, `X` icon for incorrect (lucide).
- Server-compatible if fully controlled.

---

### 5.4 `answer-choice-button.tsx`

Extends `ChoiceOption` with richer `CheckCircle2` / `XCircle` lucide feedback icons. Same state model.

---

### 5.5 `audio-question-card.tsx`

**Props:**
```ts
type AudioQuestionCardProps = {
  prompt?: string;
  isPlaying?: boolean;
  onPlay?: () => void;
  className?: string;
  children?: React.ReactNode;
};
```

**Behavior:**
- `PlayCircle` / `PauseCircle` from lucide on the trigger button.
- `aria-label` on audio button.
- `"use client"` — owns `isPlaying` internal state when prop is not provided; always marked client since the button's onClick is always interactive.

---

### 5.6 `golden-time-question-card.tsx`

**Props:**
```ts
type GoldenTimeQuestionCardProps = {
  word: string;
  reading?: string;
  questionType?: string;
  reviewChip?: React.ReactNode;   // e.g. <ReviewReasonChip reason="overdue" />
  className?: string;
  children?: React.ReactNode;
};
```

**Behavior:**
- Header band: `bg-golden-soft border-b border-golden/20`.
- `reviewChip` slot — parent passes `ReviewReasonChip` or nothing.
- Server-compatible (no `"use client"`).

---

### 5.7 `fill-blank-card.tsx`

**Props:**
```ts
type FillBlankCardProps = {
  sentenceBefore: string;
  sentenceAfter: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  state?: ExerciseAnswerState;
  correctAnswer?: string;
  className?: string;
};
```

**Behavior:**
- Sentence rendered with blank slot styled by state.
- shadcn `Input` for text entry; `onKeyDown` submits on Enter.
- `"use client"` — owns onChange handler.

---

### 5.8 `spelling-input-card.tsx`

**Props:**
```ts
type SpellingInputCardProps = {
  prompt: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  state?: ExerciseAnswerState;
  correctAnswer?: string;
  className?: string;
};
```

**Behavior:**
- shadcn `Input` centered, large (`text-xl`), `autoFocus`.
- Enter triggers `onSubmit`.
- Shows correct answer when `state === "incorrect"`.
- `"use client"` — owns input interaction.

---

### 5.9 `collocation-practice-card.tsx`

**Props:**
```ts
type CollocationPracticeCardProps = {
  baseWord: string;
  prompt?: string;
  options: string[];
  selectedIndex?: number;
  correctIndex?: number;
  state?: "idle" | "answered";
  onSelect?: (index: number) => void;
  className?: string;
};
```

**Behavior:**
- `___ + baseWord` pattern display.
- Pill buttons: shadcn `Button` variant `outline` with cva state overrides.
- Server-compatible — fully controlled via `selectedIndex` / `onSelect` props. Parent owns selection state.

---

### 5.10 `feedback-card.tsx`

**Props:**
```ts
type FeedbackCardProps = {
  state: FeedbackState;   // correct | incorrect | partial | hint
  title?: string;
  explanation?: string;
  continueLabel?: string;
  onContinue?: () => void;
  className?: string;
};
```

**Behavior:**
- Left accent border, icon, title, explanation.
- `correct` → success tokens; `incorrect` → danger; `partial` → warning; `hint` → info/muted.
- Server-compatible (no `"use client"`).

---

## 6. Notebook Component Types

**File:** `src/components/notebook/types.ts`

```ts
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
  skill: import("@/components/lexipath").SkillKey;
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
  weakSkills: import("@/components/lexipath").SkillKey[];
}

export interface NextReview {
  label?: string;
  when: string;
}
```

---

## 7. Notebook Components

### 7.1 `notebook-split-layout.tsx`

**Props:**
```ts
type NotebookSplitLayoutProps = {
  list: React.ReactNode;
  detail: React.ReactNode;
  detailOpen?: boolean;              // mobile sheet open state (controlled)
  onDetailOpenChange?: (open: boolean) => void;
  detailTitle?: string;
  className?: string;
};
```

**Behavior:**
- Desktop: `grid md:grid-cols-[320px_1fr]`, left pane has `border-r border-border`.
- Mobile: list full-width; detail renders in shadcn `Sheet` (bottom or side).
- `"use client"` — owns sheet open state if not controlled externally.

---

### 7.2 `notebook-filter-tabs.tsx`

**Props:**
```ts
type NotebookFilterTabsProps = {
  tabs: NotebookTab[];
  activeId: string;
  onTabChange: (id: string) => void;
  className?: string;
};
```

**Behavior:**
- shadcn `Tabs` (`TabsList`, `TabsTrigger`).
- Optional count: small `Badge` or muted text inside trigger.
- No `"use client"` if fully controlled.

---

### 7.3 `notebook-item-row.tsx`

**Props:**
```ts
type NotebookItemRowProps = {
  item: NotebookItem;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};
```

**Behavior:**
- `button` element, not `div onClick`.
- Selected state: `bg-primary/10 border-l-2 border-primary`.
- Status label colored via cva.
- Server-compatible.

---

### 7.4 `search-result-group.tsx`

**Props:**
```ts
type SearchResultGroupProps = {
  title: string;
  items: DictionaryResult[];
  onSelect?: (item: DictionaryResult) => void;
  className?: string;
};
```

**Behavior:**
- Section header (uppercase muted label).
- Items as buttons. No `div onClick`.
- Server-compatible.

---

### 7.5 `dictionary-search-command.tsx`

**Props:**
```ts
type DictionarySearchCommandProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: DictionaryResult[];
  loading?: boolean;
  onSelect?: (item: DictionaryResult) => void;
};
```

**Behavior:**
- shadcn `CommandDialog` + `CommandInput` + `CommandList` + `CommandItem`.
- Loading: `LoadingSkeleton` from `@/components/shared`.
- Empty: inline "Không tìm thấy kết quả." text in `CommandEmpty`.
- `"use client"` — CommandDialog interaction is client-side.

---

### 7.6 `add-to-learning-dialog.tsx`

**Props:**
```ts
type AddToLearningDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: string;
  meaning?: string;
  collections: Array<{ id: string; name: string }>;
  selectedCollectionId?: string;
  onSelectedCollectionChange: (id: string) => void;
  onConfirm: () => void;
};
```

**Behavior:**
- shadcn `Dialog` + `RadioGroup` + `RadioGroupItem`.
- `radio-group` confirmed available at `src/components/ui/radio-group.tsx`.
- Cancel + confirm buttons (shadcn `Button`).
- No API call inside component.
- `"use client"` — Dialog/RadioGroup interaction.

---

### 7.7 `skill-weakness-panel.tsx`

**Props:**
```ts
type SkillWeaknessPanelProps = {
  title?: string;
  skills: WordSkillStat[];
  threshold?: number;          // accuracy below this = weak; default 70
  onPractice?: (skill: SkillKey) => void;
  className?: string;
};
```

**Behavior:**
- Sorts skills weakest-first.
- Weakest skill callout with danger/skill tokens.
- Renders `SkillProgressLane` from `@/components/lexipath` for each skill, adapting `WordSkillStat.accuracy` → `SkillLaneData.accuracyPct` and using `accuracy` as `masteredCount` with `totalCount: 100` as a proxy display value.
- CTA practice button when weakest is below threshold.
- Server-compatible.

---

### 7.8 `word-mastery-header.tsx`

**Props:**
```ts
type WordMasteryHeaderProps = {
  headword: string;
  reading?: string;
  partOfSpeech?: string;
  script?: "latin" | "jp" | "cjk";
  reviewChip?: React.ReactNode;
  nextReview?: NextReview;
  className?: string;
};
```

**Behavior:**
- Word hero text with font/size driven by `script` prop.
- IPA/phonetic rendered as monospace badge for latin.
- Next review row uses `bg-golden-soft border-golden/20`.
- Server-compatible.

---

### 7.9 `word-senses-list.tsx`

**Props:**
```ts
type WordSensesListProps = {
  senses: WordSense[];
  className?: string;
};
```

**Behavior:**
- Numbered sense items (index badge + gloss + example).
- Example indented with left border.
- Server-compatible.

---

### 7.10 `word-mastery-canvas.tsx`

**Props:**
```ts
type WordMasteryCanvasProps = {
  headword: string;
  reading?: string;
  partOfSpeech?: string;
  script?: "latin" | "jp" | "cjk";
  reviewChip?: React.ReactNode;
  senses?: WordSense[];
  skills?: WordSkillStat[];
  nextReview?: NextReview;
  aside?: React.ReactNode;
  className?: string;
};
```

**Behavior:**
- Orchestrator layout only: composes `WordMasteryHeader` + `WordSensesList` + aside slot.
- Aside: skills panel + optional `aside` node.
- Responsive: `grid md:grid-cols-[1.6fr_1fr]` collapsing to 1 column on mobile.
- Server-compatible.

---

### 7.11 `word-relation-map.tsx`

**Props:**
```ts
type WordRelationMapProps = {
  headword?: string;
  groups?: WordRelationGroup[];
  onWordClick?: (word: WordRelation) => void;
  className?: string;
};
```

**Behavior:**
- Hub-and-rail Tailwind layout (no graph library).
- Hub pill: `bg-primary/10 border border-primary/30 rounded-full`.
- Each group has a connector dot (small circle with group-type color) + vertical line.
- Relation items as accessible buttons with `aria-label`.
- Server-compatible.

---

### 7.12 Barrel Exports

```
src/components/learning/session/index.ts
src/components/learning/exercises/index.ts
src/components/notebook/index.ts
```

Each re-exports all components and types from that group.

---

## 8. Client Boundary Summary

| Component | `"use client"` | Reason |
|-----------|---------------|--------|
| `flashcard.tsx` | Yes | internal flip state, browser TTS |
| `audio-question-card.tsx` | Yes | owns isPlaying internal state |
| `fill-blank-card.tsx` | Yes | input onChange |
| `spelling-input-card.tsx` | Yes | input onChange, Enter key |
| `exit-session-dialog.tsx` | Yes | AlertDialog interaction |
| `dictionary-search-command.tsx` | Yes | CommandDialog interaction |
| `add-to-learning-dialog.tsx` | Yes | Dialog/RadioGroup interaction |
| `notebook-split-layout.tsx` | Yes | Sheet open state |
| `session-summary-card.tsx` | No | props-only |
| `feedback-card.tsx` | No | props-only |
| `flashcard-intro-card.tsx` | No | props-only |
| `choice-option.tsx` | No | fully controlled |
| `answer-choice-button.tsx` | No | fully controlled |
| `golden-time-question-card.tsx` | No | props-only |
| `search-result-group.tsx` | No | props-only |
| `notebook-item-row.tsx` | No | props-only |
| `skill-weakness-panel.tsx` | No | props-only |
| `word-mastery-header.tsx` | No | props-only |
| `word-senses-list.tsx` | No | props-only |
| `word-mastery-canvas.tsx` | No | props-only |
| `word-relation-map.tsx` | No | props-only |
| `collocation-practice-card.tsx` | No | fully controlled via props |
| `notebook-filter-tabs.tsx` | No | fully controlled |

---

## 9. Implementation Order

1. `src/components/learning/types.ts` — shared component types
2. `src/components/learning/session/` — top bar, exit dialog, summary card, index
3. `src/components/learning/exercises/` — all 10 exercise components + index
4. `src/components/notebook/types.ts` — notebook component types
5. `src/components/notebook/` — layout, filter, item row, search group
6. `src/components/notebook/` — command dialog, add dialog, skill weakness
7. `src/components/notebook/` — word-mastery-header, word-senses-list, word-mastery-canvas
8. `src/components/notebook/word-relation-map.tsx`
9. `src/components/notebook/index.ts`
10. `npm run lint && npm run typecheck`

---

## 10. Definition of Done

- No `src/features/*` files.
- No `*.api.ts`, `*.dto.ts`, `*.mapper.ts`, `*.schema.ts`, `page.tsx`.
- All new files are `.tsx` with typed props.
- shadcn/ui, Tailwind v4, `cn`, `cva`, lucide-react used appropriately.
- No `window.lucide`, no `dangerouslySetInnerHTML`, no inline style for layout/color/spacing.
- Long components are split (≤ ~200 lines).
- Dialogs/Sheets/Tabs/Command/RadioGroup use shadcn/Radix primitives.
- Audio/TTS only from explicit user action.
- Barrel exports in place.
- `npm run lint` passes.
- `npm run typecheck` passes.
