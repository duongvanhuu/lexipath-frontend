# LexiPath Identity Layer, Learning Dashboard, Vocabulary & Collection

**Date:** 2026-06-22  
**Status:** Approved  
**Milestones:** A (Identity Layer) → B (Learning Dashboard) → C (Vocabulary + Collection)

---

## 1. Scope

Three subsystems built in dependency order:

| Milestone | Target | Depends on |
|-----------|--------|------------|
| A | `src/components/lexipath/` | Nothing |
| B | `src/features/learning/` | Milestone A |
| C | `src/features/vocabulary/` | Milestone A |

Pages (thin Server Component wrappers) land in `src/app/(learner)/` for B and C, and `src/app/design-system/identity/` for A.

---

## 2. Architecture

```
src/components/lexipath/          ← A: Identity Layer, pure UI, no API
        ↓
src/features/learning/            ← B: Dashboard
src/features/vocabulary/          ← C: Vocabulary + Collection
        ↓
src/app/(learner)/                ← thin route pages
src/app/design-system/identity/   ← preview page
```

### Import rules for `src/components/lexipath/`

**Allowed:**
- `@/components/ui/*`
- `@/components/shared/*`
- `@/lib/utils/cn`
- `@/lib/styles/variants`
- Local lexipath types/constants

**Forbidden:**
- `@/features/*`
- `@/app/*`
- `@/lib/api/*`
- Any backend/API client files

---

## 3. Identity Layer (`src/components/lexipath/`)

### File structure

```
src/components/lexipath/
├── constants/
│   └── lexipath.constants.ts
├── types/
│   ├── lexipath.types.ts
│   └── index.ts
├── path/
│   ├── checkpoint-node.tsx
│   ├── path-rail.tsx
│   ├── path-card.tsx
│   ├── today-path.tsx
│   ├── journey-rail.tsx
│   ├── journey-checkpoint-card.tsx
│   └── learning-route-preview.tsx
├── golden-time/
│   ├── golden-time-window.tsx
│   ├── golden-queue-preview.tsx
│   └── review-reason-chip.tsx
├── skills/
│   ├── skill-progress-lane.tsx
│   ├── skill-lane-group.tsx
│   └── skill-branch-panel.tsx
├── layout/
│   ├── learner-canvas.tsx
│   ├── learning-atmosphere.tsx
│   ├── page-journey-header.tsx
│   └── today-command-center.tsx
├── cta/
│   └── next-best-step-card.tsx
├── insights/
│   ├── learning-insight-card.tsx
│   └── insight-action-card.tsx
├── loop/
│   └── exam-to-srs-loop.tsx
├── vocabulary/
│   └── vocab-learning-header.tsx
└── index.ts
```

### Core types (`lexipath.types.ts`)

```ts
export type CheckpointState =
  | "current" | "due" | "weak" | "premium"
  | "completed" | "locked" | "available";

export type SkillKey =
  | "meaning" | "listening" | "spelling" | "usage" | "collocation";

export type GoldenTimeReason = "post_session" | "forgetting_curve" | "exam_wrong";
export type ReviewReason = "due" | "overdue" | "weak" | "exam_miss";
```

### Constants (`lexipath.constants.ts`)

Centralized label/mapping constants:
- `SKILL_LABELS: Record<SkillKey, string>`
- `CHECKPOINT_STATE_LABELS: Record<CheckpointState, string>`
- `REVIEW_REASON_LABELS: Record<ReviewReason, string>`
- `GOLDEN_TIME_REASON_LABELS: Record<GoldenTimeReason, string>`

### CVA strategy

| Variant group | Axis | Used by |
|---------------|------|---------|
| `checkpointVariants` | `state: CheckpointState` | `CheckpointNode` |
| `reviewReasonVariants` | `reason: ReviewReason` | `ReviewReasonChip` |
| `skillLaneVariants` | `skill: SkillKey` | `SkillProgressLane` |

`skillLaneVariants` is separate from `skillBadgeVariants` — lanes have different visual responsibilities than badges, even though both use the same `SkillKey` union.

### Client boundary rule

Server Components by default. Add `"use client"` only when the component owns:
- Local interaction state (`useState`, `useReducer`)
- Browser API usage
- Client-only hooks (Zustand, TanStack Query, `useEffect`)

**Always server:** PathRail, PathCard, JourneyRail, JourneyCheckpointCard, SkillProgressLane, SkillLaneGroup, GoldenTimeWindow, ReviewReasonChip, LearnerCanvas, LearningAtmosphere, PageJourneyHeader, TodayCommandCenter, NextBestStepCard, LearningInsightCard, InsightActionCard, ExamToSrsLoop, VocabLearningHeader, LearningRoutePreview

**Client if needed:** CheckpointNode (if owns non-nav click/collapsed state), GoldenQueuePreview (if owns expand/filter state), SkillBranchPanel (if owns collapsible branch state)

### Golden Time token rule

Never use `warning`, `yellow`, or generic amber. Always use:
- `bg-golden-soft`, `text-golden-foreground`, `border-golden/40`, `shadow-golden`
- Or CSS variable equivalents if tokens are not yet configured.

---

## 4. Learning Dashboard (`src/features/learning/`)

### File structure

```
src/features/learning/
├── components/dashboard/
│   ├── continue-learning-card.tsx
│   ├── today-goal-card.tsx
│   ├── daily-stats-card.tsx
│   ├── daily-summary-card.tsx
│   ├── due-now-card.tsx
│   ├── overdue-card.tsx
│   ├── upcoming-review-card.tsx
│   ├── golden-time-card.tsx
│   ├── golden-time-queue-item.tsx
│   ├── golden-time-summary-card.tsx
│   ├── streak-card.tsx
│   ├── streak-heatmap.tsx
│   ├── weekly-progress-card.tsx
│   ├── xp-stat-card.tsx
│   ├── xp-history-row.tsx
│   ├── achievement-card.tsx
│   ├── leaderboard-row.tsx
│   ├── stat-tile.tsx
│   ├── skill-stat-card.tsx
│   └── weak-skill-card.tsx
├── api/
│   ├── learning.api.ts
│   ├── learning.dto.ts
│   └── learning.mapper.ts
├── types/
│   └── learning.types.ts
├── hooks/
│   └── use-learning-dashboard.ts
├── constants/
│   └── learning.constants.ts
├── mocks/
│   └── learning.mocks.ts
└── index.ts
```

### UI/domain types (`learning.types.ts`)

```ts
interface LearningDashboardSummary {
  continueLesson?: { title: string; collectionName: string; progressPct: number; href: string }
  todayGoal: { targetWords: number; completedWords: number }
  dailyStats: { reviewed: number; learned: number; accuracy: number }
  streak: StreakSummary
  xp: XpSummary
  dueNow: ReviewQueueItem[]
  overdue: ReviewQueueItem[]
  upcoming: ReviewQueueItem[]
  goldenTime: GoldenTimeSummary | null
  skillSummaries: SkillSummary[]
  weakSkills: SkillSummary[]
}

interface ReviewQueueItem {
  id: string; word: string; dueAt: string
  reason: ReviewReason; skillKey: SkillKey
}

interface StreakSummary {
  days: number; longestDays: number
  weekDays: boolean[]  // 7 entries Mon–Sun
}

interface XpSummary {
  total: number; todayEarned: number
  weeklyHistory: { day: string; xp: number }[]
}

interface SkillSummary {
  key: SkillKey; masteredCount: number
  totalCount: number; accuracyPct: number
}

interface GoldenTimeSummary {
  windowOpen: boolean; closeAt: string
  queueCount: number; reasons: GoldenTimeReason[]
}
```

### DTO types (`learning.dto.ts`) — Spring Boot JSON contract

```ts
interface LearningDashboardResponse {
  continueLearning?: ContinueLearningResponse
  todayGoal: TodayGoalResponse
  dailyStats: DailyStatsResponse
  streak: StreakSummaryResponse
  xp: XpSummaryResponse
  reviewQueue: ReviewQueueItemResponse[]
  goldenTime: GoldenTimeResponse | null
  skillSummaries: SkillSummaryResponse[]
}

interface ReviewQueueItemResponse {
  id: string; word: string; dueAt: string
  reason: string; skill: string
}

interface StreakSummaryResponse {
  currentDays: number; longestDays: number
  weekActivity: string[]  // ISO date strings for active days
}

interface XpSummaryResponse {
  totalXp: number; todayXp: number
  dailyXp: { date: string; xp: number }[]
}

interface SkillSummaryResponse {
  skillKey: string; mastered: number
  total: number; accuracy: number
}
```

### Mapper (`learning.mapper.ts`)

`mapLearningDashboardResponseToSummary(dto: LearningDashboardResponse): LearningDashboardSummary`

Responsibility: normalize backend field names, split `reviewQueue` into `dueNow` / `overdue` / `upcoming` buckets, map `weekActivity` ISO dates to Mon–Sun boolean array, narrow string unions to typed unions via guard functions.

### TanStack Query hook (`use-learning-dashboard.ts`)

`useLearningDashboard()` — calls `learning.api.ts`, returns mapped `LearningDashboardSummary`, exposes `isLoading`, `error`.

### Dashboard page

`src/app/(learner)/dashboard/page.tsx` — Server Component. Fetches via query hook boundary (or React `use()`), renders `LearnerAppShell` + dashboard composition.

Golden Time CTA: `buttonToneVariants({ tone: "golden" })`  
Next learning CTA: `buttonToneVariants({ tone: "nextStep" })`  
Charts: Recharts for real XP history chart.  
Streak heatmap: CSS grid via Tailwind (no chart library needed).  
Data: always from props, never hardcoded in components.

---

## 5. Vocabulary + Collection (`src/features/vocabulary/`)

### File structure

```
src/features/vocabulary/
├── components/
│   ├── vocab-item-card.tsx
│   ├── vocab-item-row.tsx
│   ├── vocab-item-detail-panel.tsx
│   ├── sense-card.tsx
│   ├── meaning-card.tsx
│   ├── example-sentence-card.tsx
│   ├── phonetic-audio-row.tsx
│   ├── related-items-list.tsx
│   ├── collection-card.tsx
│   ├── recommended-collection-card.tsx
│   ├── collection-journey-card.tsx
│   ├── collection-progress-card.tsx
│   ├── collection-progress-story.tsx
│   ├── collection-stats-card.tsx
│   ├── lesson-card.tsx
│   ├── lesson-roadmap-item.tsx
│   └── lesson-checkpoint-row.tsx
├── api/
│   ├── vocabulary.api.ts
│   ├── vocabulary.dto.ts
│   └── vocabulary.mapper.ts
├── schemas/
│   └── vocabulary.schemas.ts
├── types/
│   └── vocabulary.types.ts
├── hooks/
│   ├── use-vocabulary-item.ts
│   ├── use-collection.ts
│   └── use-speech-synthesis.ts
├── constants/
│   └── vocabulary.constants.ts
├── mocks/
│   └── vocabulary.mocks.ts
└── index.ts
```

### UI/domain types (`vocabulary.types.ts`)

```ts
interface VocabularyItem {
  id: string; word: string; partOfSpeech: string
  phonetic?: string; audioUrl?: string
  senses: VocabularySense[]
  relatedItems?: Pick<VocabularyItem, 'id' | 'word' | 'partOfSpeech'>[]
  skillProgress: SkillSummary[]
}

interface VocabularySense {
  id: string; definition: string
  examples: VocabularyExample[]
  collocations?: string[]
}

interface VocabularyExample {
  id: string; sentence: string; translation?: string
}

interface CollectionSummary {
  id: string; title: string; description?: string
  totalItems: number; masteredItems: number; progressPct: number
  lessons: LessonSummary[]
  coverImageUrl?: string
}

interface LessonSummary {
  id: string; title: string; itemCount: number
  completedCount: number; checkpointState: CheckpointState
}
```

### DTO types (`vocabulary.dto.ts`) — Spring Boot JSON contract

```ts
interface VocabularyItemResponse { id: string; word: string; pos: string; phonetic?: string; audioUrl?: string; senses: VocabularySenseResponse[]; relatedItems?: RelatedItemResponse[]; skills: SkillSummaryResponse[] }
interface VocabularySenseResponse { id: string; definition: string; examples: VocabularyExampleResponse[]; collocations?: string[] }
interface VocabularyExampleResponse { id: string; sentence: string; translation?: string }
interface CollectionSummaryResponse { id: string; title: string; description?: string; totalItems: number; masteredItems: number; progressPct: number; lessons: LessonSummaryResponse[]; coverImageUrl?: string }
interface LessonSummaryResponse { id: string; title: string; itemCount: number; completedCount: number; state: string }

// Write DTOs
interface CreateVocabularyItemRequest { word: string; pos: string; collectionId?: string }
interface UpdateVocabularyItemRequest { word?: string; pos?: string }
```

### Mappers (`vocabulary.mapper.ts`)

- `mapVocabularyItemResponseToItem(dto): VocabularyItem`
- `mapCollectionSummaryResponseToSummary(dto): CollectionSummary`

### Speech synthesis hook (`use-speech-synthesis.ts`)

`useSpeechSynthesis()` — returns `speak(text: string, lang?: string): void` and `isSpeaking: boolean`. Uses `window.speechSynthesis`. Client-only hook.

### Routes

- `src/app/(learner)/vocabulary/[id]/page.tsx`
- `src/app/(learner)/collections/[id]/page.tsx`

Collection roadmap uses `CheckpointNode` + `JourneyRail` from the identity layer.  
Skill progress uses `SkillLaneGroup` from the identity layer.  
Audio button: lucide `Volume2` icon, `aria-label="Nghe phát âm"`.

---

## 6. Cross-cutting rules (all milestones)

- All new files: `.tsx` or `.ts`
- No inline style for layout/color/spacing — Tailwind v4 utilities only
- No `window.lucide`, CDN icons, `dangerouslySetInnerHTML`, or clickable `div`
- Icon buttons need `aria-label`
- Dialogs/Sheets need visible title
- Form fields need label + error message
- Loading, empty, error states use `src/components/shared/feedback/*`
- Components never call APIs directly — data flows in via props or hooks
- Components must not depend on DTOs when DTO shape differs from UI model
- Zod schemas live in `schemas/`; TanStack Query hooks in `hooks/`

---

## 7. Definition of Done

### Milestone A

1. All files `.tsx` / `.ts`
2. Identity layer has zero imports from `features`, `app`, or `lib/api`
3. Server Components by default; `"use client"` only where required
4. CVA variants: `checkpointVariants`, `reviewReasonVariants`, `skillLaneVariants`
5. Golden Time: dedicated golden tokens only
6. No inline style for layout/color/spacing
7. No prototype artifacts (window icons, CDN, inline style blobs)
8. `src/components/lexipath/index.ts` exports all public components
9. Preview page at `src/app/design-system/identity/page.tsx`
10. `npm run lint` passes
11. `npm run typecheck` passes

### Milestone B (after A)

1. DTO/UI types separated; mapper exists
2. TanStack Query hook wired, mock data in `mocks/`
3. Dashboard page renders under `LearnerAppShell`
4. Golden Time CTA uses `tone: "golden"`, next-learning uses `tone: "nextStep"`
5. Charts use Recharts; heatmap uses CSS grid
6. `npm run lint` + `npm run typecheck` pass

### Milestone C (after A)

1. DTO/UI types separated; mapper exists
2. Speech synthesis hook is client-only
3. Collection roadmap uses identity layer path components
4. Skill progress uses `SkillLaneGroup`
5. `npm run lint` + `npm run typecheck` pass
