# Admin Question Bank Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the admin question bank at `/admin/exams/question-bank` — a three-tab screen with a question table, full-page type-specific editor, group manager, and tag/source manager — backed entirely by typed mock data.

**Architecture:** Feature folder `src/features/admin-exam-qbank/` holds all types, mock data, hook, and components. The page is a Server Component that passes mock data to a `"use client"` root component. The question editor is a full-page content-area takeover (no URL change). Ten question types each have their own small answer-editor sub-component.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Tabs, Dialog, Card, Badge, Button, Input, Textarea, Select, Checkbox), lucide-react, TanStack Table via `AdminDataTable`, Vitest + Testing Library for hook and util tests.

## Global Constraints

- Product copy in Vietnamese; learning content follows selected language.
- No API calls, no TanStack Query, no Zustand — mock data only.
- No inline styles for layout/color/spacing — Tailwind classes only.
- No clickable `<div>` — use `<button>` or `<Link>`.
- All icon buttons must have `aria-label`.
- All dialogs must have a `title` prop wired to `DialogTitle`.
- New files must be `.tsx` with typed props; use `@/` alias imports.
- `"use client"` only where hooks, events, forms, or browser APIs are used.
- Lint/typecheck must pass after every task: `npm run lint && npm run typecheck`.
- FilterToolbar: reuse `@/components/admin/filter-toolbar` as-is; wrap as `QuestionBankFilterToolbar` only if filter fidelity would otherwise be lost.
- Feature components stay inside `src/features/admin-exam-qbank/components/` — do not move to `src/components/`.
- Spec file: `docs/superpowers/specs/2026-06-24-admin-question-bank-design.md`.

---

## File Map

```
CREATE src/features/admin-exam-qbank/types/question-bank.types.ts
CREATE src/features/admin-exam-qbank/mock/question-bank.mock.ts
CREATE src/features/admin-exam-qbank/hooks/use-question-bank-filters.ts
CREATE src/features/admin-exam-qbank/hooks/__tests__/use-question-bank-filters.test.ts
CREATE src/features/admin-exam-qbank/components/atoms/question-type-chip.tsx
CREATE src/features/admin-exam-qbank/components/atoms/question-diff-pill.tsx
CREATE src/features/admin-exam-qbank/components/atoms/question-grade-chip.tsx
CREATE src/features/admin-exam-qbank/components/atoms/question-status-badge.tsx
CREATE src/features/admin-exam-qbank/components/answer-editors/choice-editor.tsx
CREATE src/features/admin-exam-qbank/components/answer-editors/judge-editor.tsx
CREATE src/features/admin-exam-qbank/components/answer-editors/fill-blank-editor.tsx
CREATE src/features/admin-exam-qbank/components/answer-editors/answer-key-editor.tsx
CREATE src/features/admin-exam-qbank/components/answer-editors/matching-pair-editor.tsx
CREATE src/features/admin-exam-qbank/components/answer-editors/ordering-editor.tsx
CREATE src/features/admin-exam-qbank/components/answer-editors/open-prompt-editor.tsx
CREATE src/features/admin-exam-qbank/components/question-preview.tsx
CREATE src/features/admin-exam-qbank/components/question-bank-table.tsx
CREATE src/features/admin-exam-qbank/components/new-question-dialog.tsx
CREATE src/features/admin-exam-qbank/components/review-question-dialog.tsx
CREATE src/features/admin-exam-qbank/components/group-editor-dialog.tsx
CREATE src/features/admin-exam-qbank/components/link-vocab-dialog.tsx
CREATE src/features/admin-exam-qbank/components/groups-view.tsx
CREATE src/features/admin-exam-qbank/components/tag-source-manager.tsx
CREATE src/features/admin-exam-qbank/components/question-editor-panel.tsx
CREATE src/features/admin-exam-qbank/components/question-bank-client.tsx
CREATE src/features/admin-exam-qbank/index.ts
CREATE src/app/(admin)/admin/exams/question-bank/page.tsx
MODIFY src/app/(admin)/admin-shell-provider.tsx  (update nav href + activeNavId)
```

---

## Task 1: Types, constants, mock data, and blankQuestion factory

**Files:**
- Create: `src/features/admin-exam-qbank/types/question-bank.types.ts`
- Create: `src/features/admin-exam-qbank/mock/question-bank.mock.ts`
- Create: `src/features/admin-exam-qbank/types/__tests__/blank-question.test.ts`
- Create: `src/features/admin-exam-qbank/index.ts`

**Interfaces:**
- Produces: `Question`, `QuestionGroup`, `QuestionTag`, `QuestionSource`, `ExamProgram`, `ExamRubric`, `QuestionVocabItem`, `QuestionBankMock`, `QUESTION_TYPE_TO_DB_CODE`, `DB_CODE_TO_QUESTION_TYPE`, `DIFFICULTY_TO_DB_VALUE`, `DB_VALUE_TO_DIFFICULTY`, `blankQuestion`, `QB_TYPE_REGISTRY`, `QB_DIFF_REGISTRY`, `QB_SKILL_REGISTRY`

---

- [ ] **Step 1: Write the types file**

Create `src/features/admin-exam-qbank/types/question-bank.types.ts`:

```typescript
// ─── Primitive enums ───────────────────────────────────────────────────────
// UI status — "review" means "Chờ duyệt".
// If backend uses "in_review", the future DTO mapper converts to "review".
export type QuestionStatus = "draft" | "review" | "published";

// Short UI keys. DB uses longer canonical codes — see QUESTION_TYPE_TO_DB_CODE.
export type QuestionType =
  | "mcq" | "multi" | "fill" | "matching"
  | "tfng" | "ynng" | "ordering" | "short"
  | "writing" | "speaking";

// Simplified 3-label difficulty. DB stores 1–5 — see DIFFICULTY_TO_DB_VALUE.
export type Difficulty = "easy" | "medium" | "hard";

// Admin screen skill labels. DB may use finer-grained codes; mapper converts.
export type Skill =
  | "listening" | "reading" | "writing" | "speaking"
  | "grammar" | "vocab";

// ─── UI↔DB mapping constants ──────────────────────────────────────────────
export const QUESTION_TYPE_TO_DB_CODE = {
  mcq:      "mcq",
  multi:    "multi_select",
  fill:     "fill_blank",
  matching: "matching",
  tfng:     "true_false_not_given",
  ynng:     "yes_no_not_given",
  ordering: "ordering",
  short:    "short_answer",
  writing:  "writing",
  speaking: "speaking",
} as const;

export const DB_CODE_TO_QUESTION_TYPE: Record<string, QuestionType> = {
  mcq:                   "mcq",
  multi_select:          "multi",
  fill_blank:            "fill",
  matching:              "matching",
  true_false_not_given:  "tfng",
  yes_no_not_given:      "ynng",
  ordering:              "ordering",
  short_answer:          "short",
  writing:               "writing",
  speaking:              "speaking",
};

// DB stores difficulty as 1–5 integer.
export const DIFFICULTY_TO_DB_VALUE: Record<Difficulty, number> = {
  easy:   1,
  medium: 3,
  hard:   5,
};

export const DB_VALUE_TO_DIFFICULTY: Record<number, Difficulty> = {
  1: "easy", 2: "easy",
  3: "medium", 4: "hard",
  5: "hard",
};

// ─── Sub-types ────────────────────────────────────────────────────────────
// correct is a UI/editor convenience field.
// Backend stores correct answers via answer-key records;
// future mapper splits choices and answer keys into separate DTO payloads.
export interface QuestionChoice {
  key: string;   // "A" | "B" | "C" | "D" | "E" | "F"
  text: string;
  correct: boolean;
}

export interface QuestionBlank {
  pos: number;
  accepted: string[];
  caseSensitive: boolean;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface OrderItem {
  text: string;
  correctPos: number;
}

export interface AnswerKey {
  value: string;
}

// ─── Core entities ────────────────────────────────────────────────────────
export interface Question {
  id: string;
  type: QuestionType;
  skill: Skill;
  programId: string;
  difficulty: Difficulty;
  points: number;
  status: QuestionStatus;
  stem: string;
  explanation: string;
  groupId: string | null;
  tagIds: string[];
  sourceId: string;
  vocabIds: string[];
  updatedAt: string;
  // type-specific — always present for the relevant type, absent for others
  choices?: QuestionChoice[];       // mcq, multi
  blanks?: QuestionBlank[];         // fill
  pairs?: MatchingPair[];           // matching
  orderItems?: OrderItem[];         // ordering
  judgeAnswer?: string;             // tfng ("true"|"false"|"ng"), ynng ("yes"|"no"|"ng")
  answerKeys?: AnswerKey[];         // short, tfng, ynng
  maxWords?: number;                // short
  rubricId?: string;                // writing, speaking
  minWords?: number;                // writing
  suggestedTime?: number;           // writing, speaking (minutes)
  prepTime?: number;                // speaking (minutes)
}

export interface QuestionGroup {
  id: string;
  code: string;
  title: string;
  stimulusType: "passage" | "audio" | "standalone";
  skill: Skill;
  programId: string;
  mediaId: string | null;
  instructions: string;
  stimulus: string;
  questionIds: string[];
  status: QuestionStatus;
  updatedAt: string;
}

export interface QuestionTag {
  id: string;
  label: string;
  usage: number;
}

export interface QuestionSource {
  id: string;
  name: string;
  type: "licensed" | "original" | "adapted";
  ref: string;
}

export interface ExamProgram {
  id: string;
  code: string;
  name: string;
  color: string;
}

export interface ExamRubric {
  id: string;
  name: string;
  programId: string;
  scaleMax: number;
  status: QuestionStatus;
}

// Slim vocab type used only in LinkVocabDialog
export interface QuestionVocabItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  lang: string;
}

// ─── UI registries (used by atom components) ─────────────────────────────
export interface QuestionTypeInfo {
  id: QuestionType;
  name: string;
  short: string;
  icon: string;        // lucide icon name
  color: string;       // hex
  auto: boolean;       // true = auto-graded, false = rubric-graded
  desc: string;
}

export interface QuestionDiffInfo {
  label: string;
  color: string;
}

export interface QuestionSkillInfo {
  id: Skill;
  name: string;
  icon: string;
}

// ─── Mock data bundle ─────────────────────────────────────────────────────
export interface QuestionBankMock {
  questions: Question[];
  groups: QuestionGroup[];
  tags: QuestionTag[];
  sources: QuestionSource[];
  programs: ExamProgram[];
  rubrics: ExamRubric[];
  vocabItems: QuestionVocabItem[];
  typeRegistry: Record<QuestionType, QuestionTypeInfo>;
  diffRegistry: Record<Difficulty, QuestionDiffInfo>;
  skillRegistry: QuestionSkillInfo[];
}
```

- [ ] **Step 2: Write the mock data file**

Create `src/features/admin-exam-qbank/mock/question-bank.mock.ts`:

```typescript
import type {
  Question, QuestionGroup, QuestionTag, QuestionSource,
  ExamProgram, ExamRubric, QuestionVocabItem,
  QuestionBankMock, QuestionTypeInfo, QuestionDiffInfo, QuestionSkillInfo,
  QuestionType, Difficulty, Skill,
} from "../types/question-bank.types";

// ─── Type registry ────────────────────────────────────────────────────────
const QB_TYPES: QuestionTypeInfo[] = [
  { id:"mcq",      name:"Trắc nghiệm 1 đáp án",  short:"MCQ",   icon:"circle-dot",    color:"#2563EB", auto:true,  desc:"Chọn đúng 1 trong nhiều lựa chọn." },
  { id:"multi",    name:"Chọn nhiều đáp án",      short:"Multi", icon:"check-square",  color:"#0891B2", auto:true,  desc:"Chọn 2 hoặc nhiều lựa chọn đúng." },
  { id:"fill",     name:"Điền chỗ trống",         short:"Fill",  icon:"pencil-line",   color:"#7C3AED", auto:true,  desc:"Điền từ vào ô trống trong câu/đoạn." },
  { id:"matching", name:"Ghép đôi",               short:"Match", icon:"shuffle",       color:"#DB2777", auto:true,  desc:"Nối các mục bên trái với bên phải." },
  { id:"tfng",     name:"True / False / NG",      short:"TFNG",  icon:"scale",         color:"#059669", auto:true,  desc:"Đúng / Sai / Không có thông tin." },
  { id:"ynng",     name:"Yes / No / NG",          short:"YNNG",  icon:"check-check",   color:"#16A34A", auto:true,  desc:"Có / Không / Không có thông tin." },
  { id:"ordering", name:"Sắp xếp thứ tự",         short:"Order", icon:"list-ordered",  color:"#D97706", auto:true,  desc:"Kéo sắp xếp các mục theo đúng thứ tự." },
  { id:"short",    name:"Trả lời ngắn",           short:"Short", icon:"type",          color:"#0284C7", auto:true,  desc:"Nhập câu trả lời ngắn (tự chấm theo từ khóa)." },
  { id:"writing",  name:"Bài viết",               short:"Write", icon:"file-text",     color:"#9333EA", auto:false, desc:"Đề bài viết luận — chấm bằng rubric." },
  { id:"speaking", name:"Nói",                    short:"Speak", icon:"mic",           color:"#E11D48", auto:false, desc:"Đề nói — chấm bằng rubric." },
];

export const QB_TYPE_REGISTRY: Record<QuestionType, QuestionTypeInfo> =
  Object.fromEntries(QB_TYPES.map((t) => [t.id, t])) as Record<QuestionType, QuestionTypeInfo>;

// ─── Difficulty registry ──────────────────────────────────────────────────
export const QB_DIFF_REGISTRY: Record<Difficulty, QuestionDiffInfo> = {
  easy:   { label: "Dễ",         color: "#2563EB" },
  medium: { label: "Trung bình", color: "#D97706" },
  hard:   { label: "Khó",        color: "#DC2626" },
};

// ─── Skill registry ───────────────────────────────────────────────────────
export const QB_SKILL_REGISTRY: QuestionSkillInfo[] = [
  { id: "listening", name: "Nghe",     icon: "headphones" },
  { id: "reading",   name: "Đọc",      icon: "book-open" },
  { id: "writing",   name: "Viết",     icon: "pen-line" },
  { id: "speaking",  name: "Nói",      icon: "mic" },
  { id: "grammar",   name: "Ngữ pháp", icon: "spell-check" },
  { id: "vocab",     name: "Từ vựng",  icon: "book-text" },
];

// ─── Programs ─────────────────────────────────────────────────────────────
export const QB_PROGRAMS: ExamProgram[] = [
  { id: "p-ielts", code: "IELTS", name: "IELTS",  color: "#2563EB" },
  { id: "p-toeic", code: "TOEIC", name: "TOEIC",  color: "#0284C7" },
  { id: "p-hsk",   code: "HSK",   name: "HSK",    color: "#DC2626" },
  { id: "p-jlpt",  code: "JLPT",  name: "JLPT",   color: "#7C3AED" },
];

// ─── Tags ─────────────────────────────────────────────────────────────────
export const QB_TAGS: QuestionTag[] = [
  { id: "tg-main-idea",   label: "Ý chính",      usage: 42 },
  { id: "tg-detail",      label: "Chi tiết",      usage: 67 },
  { id: "tg-inference",   label: "Suy luận",      usage: 38 },
  { id: "tg-vocab",       label: "Từ vựng",       usage: 54 },
  { id: "tg-paraphrase",  label: "Diễn giải",     usage: 29 },
  { id: "tg-gist",        label: "Nghe ý chính",  usage: 21 },
  { id: "tg-grammar",     label: "Ngữ pháp",      usage: 48 },
  { id: "tg-collocation", label: "Cụm từ",        usage: 18 },
];

// ─── Sources ──────────────────────────────────────────────────────────────
export const QB_SOURCES: QuestionSource[] = [
  { id: "qsrc-cam18",  name: "Cambridge IELTS 18",    type: "adapted",  ref: "Test 2, Reading P1" },
  { id: "qsrc-ets",    name: "ETS TOEIC Official",    type: "licensed", ref: "Set 7, Part 5" },
  { id: "qsrc-bc",     name: "British Council",       type: "licensed", ref: "Listening bank" },
  { id: "qsrc-lp",     name: "Nội dung gốc LexiPath", type: "original", ref: "Biên soạn nội bộ" },
  { id: "qsrc-hanban", name: "Hanban Official",       type: "licensed", ref: "HSK 3 mẫu" },
];

// ─── Groups ───────────────────────────────────────────────────────────────
export const QB_GROUPS: QuestionGroup[] = [
  {
    id: "grp-read-renewable", code: "RD-RENEW-01",
    title: "Đọc hiểu — Renewable Energy",
    stimulusType: "passage", skill: "reading", programId: "p-ielts", mediaId: "m-ielts-p1",
    instructions: "Đọc đoạn văn và trả lời các câu hỏi 1–4.",
    stimulus: "Over the past two decades, renewable energy sources have moved from the periphery to the mainstream of global energy policy. Solar photovoltaic technology has seen the most dramatic cost reductions of any energy technology in history — falling more than 90% over the past decade. Despite this growth, renewables still face integration challenges around grid stability and storage.",
    questionIds: ["q-tfng-1", "q-mcq-1", "q-fill-1", "q-short-1"],
    status: "published", updatedAt: "10/06/2026",
  },
  {
    id: "grp-listen-apt", code: "LS-APT-01",
    title: "Nghe — Apartment Enquiry",
    stimulusType: "audio", skill: "listening", programId: "p-ielts", mediaId: "m-ielts-l1",
    instructions: "Nghe đoạn hội thoại và hoàn thành các câu hỏi 5–7.",
    stimulus: "[Audio] IELTS AC Section 1 — Conversation · 180s · 3 phân đoạn",
    questionIds: ["q-fill-2", "q-match-1", "q-mcq-2"],
    status: "published", updatedAt: "09/06/2026",
  },
  {
    id: "grp-toeic-grammar", code: "GR-TOEIC-01",
    title: "Ngữ pháp TOEIC Part 5",
    stimulusType: "standalone", skill: "grammar", programId: "p-toeic", mediaId: null,
    instructions: "Chọn đáp án đúng nhất để hoàn thành câu.",
    stimulus: "",
    questionIds: ["q-mcq-3", "q-multi-1", "q-order-1"],
    status: "published", updatedAt: "08/06/2026",
  },
  {
    id: "grp-writing-speaking", code: "WS-OPEN-01",
    title: "Viết & Nói — Đề mở (rubric)",
    stimulusType: "standalone", skill: "writing", programId: "p-ielts", mediaId: null,
    instructions: "Hoàn thành bài viết / phần nói theo yêu cầu.",
    stimulus: "",
    questionIds: ["q-write-1", "q-speak-1"],
    status: "draft", updatedAt: "11/06/2026",
  },
  {
    id: "grp-hsk-judge", code: "JD-HSK-01",
    title: "HSK 3 — Đúng/Sai",
    stimulusType: "passage", skill: "reading", programId: "p-hsk", mediaId: null,
    instructions: "读句子，判断对错。",
    stimulus: "小王每天坐地铁去公司上班，路上要花四十分钟。他喜欢在地铁上看书。",
    questionIds: ["q-ynng-1"],
    status: "review", updatedAt: "07/06/2026",
  },
];

// ─── Questions ────────────────────────────────────────────────────────────
export const QB_QUESTIONS: Question[] = [
  {
    id: "q-tfng-1", groupId: "grp-read-renewable", type: "tfng",
    skill: "reading", programId: "p-ielts", difficulty: "medium", points: 1, status: "published",
    stem: "Solar panel costs have fallen by more than 90% in the last ten years.",
    answerKeys: [{ value: "true" }], judgeAnswer: "true",
    explanation: "Đoạn văn nêu rõ chi phí giảm hơn 90% trong thập kỷ qua.",
    tagIds: ["tg-detail", "tg-paraphrase"], sourceId: "qsrc-cam18", vocabIds: ["qv-1"], updatedAt: "10/06/2026",
  },
  {
    id: "q-mcq-1", groupId: "grp-read-renewable", type: "mcq",
    skill: "reading", programId: "p-ielts", difficulty: "easy", points: 1, status: "published",
    stem: "According to the passage, which technology had the most dramatic cost reduction?",
    choices: [
      { key: "A", text: "Wind power",         correct: false },
      { key: "B", text: "Solar photovoltaic", correct: true  },
      { key: "C", text: "Hydroelectric power",correct: false },
      { key: "D", text: "Nuclear energy",     correct: false },
    ],
    explanation: ""Solar photovoltaic technology has seen the most dramatic cost reductions…"",
    tagIds: ["tg-detail"], sourceId: "qsrc-cam18", vocabIds: [], updatedAt: "10/06/2026",
  },
  {
    id: "q-fill-1", groupId: "grp-read-renewable", type: "fill",
    skill: "reading", programId: "p-ielts", difficulty: "medium", points: 2, status: "published",
    stem: "Renewables still face integration challenges around grid {{1}} and {{2}}.",
    blanks: [
      { pos: 1, accepted: ["stability", "grid stability"], caseSensitive: false },
      { pos: 2, accepted: ["storage", "energy storage"],   caseSensitive: false },
    ],
    explanation: "Hai chỗ trống lấy trực tiếp từ câu cuối đoạn.",
    tagIds: ["tg-detail", "tg-vocab"], sourceId: "qsrc-cam18", vocabIds: [], updatedAt: "10/06/2026",
  },
  {
    id: "q-short-1", groupId: "grp-read-renewable", type: "short",
    skill: "reading", programId: "p-ielts", difficulty: "hard", points: 2, status: "review",
    stem: "In no more than THREE words, what has renewable energy moved into the mainstream of?",
    answerKeys: [{ value: "global energy policy" }, { value: "energy policy" }],
    maxWords: 3,
    explanation: "Chấp nhận "global energy policy" hoặc "energy policy".",
    tagIds: ["tg-detail"], sourceId: "qsrc-cam18", vocabIds: [], updatedAt: "10/06/2026",
  },
  {
    id: "q-fill-2", groupId: "grp-listen-apt", type: "fill",
    skill: "listening", programId: "p-ielts", difficulty: "easy", points: 1, status: "published",
    stem: "The rent is £{{1}} per month, excluding bills.",
    blanks: [{ pos: 1, accepted: ["850", "850.00"], caseSensitive: false }],
    explanation: "Phân đoạn 2 của audio nêu "£850 per month excluding bills".",
    tagIds: ["tg-detail", "tg-gist"], sourceId: "qsrc-bc", vocabIds: [], updatedAt: "09/06/2026",
  },
  {
    id: "q-match-1", groupId: "grp-listen-apt", type: "matching",
    skill: "listening", programId: "p-ielts", difficulty: "medium", points: 3, status: "published",
    stem: "Match each requirement to its detail.",
    pairs: [
      { left: "Deposit",   right: "One month upfront" },
      { left: "Viewing",   right: "Tomorrow at 2 pm" },
      { left: "Documents", right: "Photo ID + 2 references" },
    ],
    explanation: "Các chi tiết nằm rải rác trong phân đoạn 2 và 3.",
    tagIds: ["tg-detail"], sourceId: "qsrc-bc", vocabIds: [], updatedAt: "09/06/2026",
  },
  {
    id: "q-mcq-2", groupId: "grp-listen-apt", type: "mcq",
    skill: "listening", programId: "p-ielts", difficulty: "easy", points: 1, status: "published",
    stem: "When is the caller invited to view the apartment?",
    choices: [
      { key: "A", text: "Today at 2 pm",    correct: false },
      { key: "B", text: "Tomorrow at 2 pm", correct: true  },
      { key: "C", text: "Tomorrow morning", correct: false },
    ],
    explanation: ""Could you come in tomorrow at 2pm to view it?"",
    tagIds: ["tg-detail"], sourceId: "qsrc-bc", vocabIds: [], updatedAt: "09/06/2026",
  },
  {
    id: "q-mcq-3", groupId: "grp-toeic-grammar", type: "mcq",
    skill: "grammar", programId: "p-toeic", difficulty: "medium", points: 1, status: "published",
    stem: "The committee will _____ the new proposal at next week's meeting.",
    choices: [
      { key: "A", text: "discuss",    correct: true  },
      { key: "B", text: "discussion", correct: false },
      { key: "C", text: "discussed",  correct: false },
      { key: "D", text: "discussing", correct: false },
    ],
    explanation: "Sau trợ động từ "will" cần động từ nguyên thể.",
    tagIds: ["tg-grammar"], sourceId: "qsrc-ets", vocabIds: ["qv-2"], updatedAt: "08/06/2026",
  },
  {
    id: "q-multi-1", groupId: "grp-toeic-grammar", type: "multi",
    skill: "grammar", programId: "p-toeic", difficulty: "hard", points: 2, status: "published",
    stem: "Which TWO words can correctly complete: "The report was _____ and well organised."",
    choices: [
      { key: "A", text: "thorough",   correct: true  },
      { key: "B", text: "thoroughly", correct: false },
      { key: "C", text: "detailed",   correct: true  },
      { key: "D", text: "detail",     correct: false },
    ],
    explanation: "Cần tính từ — "thorough" và "detailed".",
    tagIds: ["tg-grammar", "tg-vocab"], sourceId: "qsrc-ets", vocabIds: [], updatedAt: "08/06/2026",
  },
  {
    id: "q-order-1", groupId: "grp-toeic-grammar", type: "ordering",
    skill: "grammar", programId: "p-toeic", difficulty: "medium", points: 2, status: "review",
    stem: "Arrange the words to form a correct sentence.",
    orderItems: [
      { text: "the meeting", correctPos: 4 },
      { text: "please",      correctPos: 1 },
      { text: "confirm",     correctPos: 2 },
      { text: "before",      correctPos: 3 },
    ],
    explanation: ""Please confirm before the meeting."",
    tagIds: ["tg-grammar"], sourceId: "qsrc-lp", vocabIds: [], updatedAt: "08/06/2026",
  },
  {
    id: "q-write-1", groupId: "grp-writing-speaking", type: "writing",
    skill: "writing", programId: "p-ielts", difficulty: "hard", points: 9, status: "draft",
    stem: "Some people think students should study the subjects they enjoy. Others believe they should study subjects useful for the future. Discuss both views and give your opinion. Write at least 250 words.",
    rubricId: "rb-ielts-writing", minWords: 250, suggestedTime: 40,
    explanation: "Chấm theo rubric IELTS Writing Task 2 (4 tiêu chí).",
    tagIds: [], sourceId: "qsrc-lp", vocabIds: [], updatedAt: "11/06/2026",
  },
  {
    id: "q-speak-1", groupId: "grp-writing-speaking", type: "speaking",
    skill: "speaking", programId: "p-ielts", difficulty: "medium", points: 9, status: "draft",
    stem: "Describe a skill you would like to learn. You should say: what it is, why you want to learn it, how you would learn it, and explain how it would help you.",
    rubricId: "rb-ielts-speaking", suggestedTime: 2, prepTime: 1,
    explanation: "IELTS Speaking Part 2 — thẻ gợi ý (cue card). Chấm bằng rubric.",
    tagIds: [], sourceId: "qsrc-lp", vocabIds: [], updatedAt: "11/06/2026",
  },
  {
    id: "q-ynng-1", groupId: "grp-hsk-judge", type: "ynng",
    skill: "reading", programId: "p-hsk", difficulty: "easy", points: 1, status: "review",
    stem: "小王坐公共汽车去上班。",
    answerKeys: [{ value: "no" }], judgeAnswer: "no",
    explanation: "原文说他坐地铁，不是公共汽车。",
    tagIds: ["tg-detail"], sourceId: "qsrc-hanban", vocabIds: ["qv-3"], updatedAt: "07/06/2026",
  },
];

// ─── Rubrics ──────────────────────────────────────────────────────────────
export const QB_RUBRICS: ExamRubric[] = [
  { id: "rb-ielts-writing",  name: "IELTS Writing Task 2", programId: "p-ielts", scaleMax: 9, status: "published" },
  { id: "rb-ielts-speaking", name: "IELTS Speaking",       programId: "p-ielts", scaleMax: 9, status: "published" },
  { id: "rb-toeic-writing",  name: "TOEIC Writing",        programId: "p-toeic", scaleMax: 5, status: "draft"     },
];

// ─── Vocab items (for LinkVocabDialog) ───────────────────────────────────
export const QB_VOCAB_ITEMS: QuestionVocabItem[] = [
  { id: "qv-1", word: "renewable",  reading: "/rɪˈnjuːəbəl/", meaning: "có thể tái tạo",  lang: "en" },
  { id: "qv-2", word: "committee",  reading: "/kəˈmɪti/",     meaning: "ủy ban",            lang: "en" },
  { id: "qv-3", word: "地铁",        reading: "dìtiě",          meaning: "tàu điện ngầm",    lang: "zh" },
  { id: "qv-4", word: "stability",  reading: "/stəˈbɪlɪti/",  meaning: "sự ổn định",        lang: "en" },
  { id: "qv-5", word: "integration",reading: "/ˌɪntɪˈɡreɪʃn/",meaning: "sự tích hợp",      lang: "en" },
];

// ─── Bundle export ─────────────────────────────────────────────────────────
export const QUESTION_BANK_MOCK: QuestionBankMock = {
  questions:    QB_QUESTIONS,
  groups:       QB_GROUPS,
  tags:         QB_TAGS,
  sources:      QB_SOURCES,
  programs:     QB_PROGRAMS,
  rubrics:      QB_RUBRICS,
  vocabItems:   QB_VOCAB_ITEMS,
  typeRegistry: QB_TYPE_REGISTRY,
  diffRegistry: QB_DIFF_REGISTRY,
  skillRegistry: QB_SKILL_REGISTRY,
};
```

- [ ] **Step 3: Write the blankQuestion factory test**

Create `src/features/admin-exam-qbank/types/__tests__/blank-question.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { blankQuestion } from "../../mock/blank-question";

describe("blankQuestion()", () => {
  it("mcq: has 3 default choices, exactly one correct", () => {
    const q = blankQuestion("mcq");
    expect(q.type).toBe("mcq");
    expect(q.choices).toHaveLength(3);
    expect(q.choices!.filter((c) => c.correct)).toHaveLength(1);
    expect(q.choices![0]!.correct).toBe(true);
  });

  it("multi: has 4 choices, first two correct", () => {
    const q = blankQuestion("multi");
    expect(q.choices).toHaveLength(4);
    expect(q.choices!.filter((c) => c.correct)).toHaveLength(2);
  });

  it("fill: stem contains {{1}}, one blank at pos 1", () => {
    const q = blankQuestion("fill");
    expect(q.stem).toContain("{{1}}");
    expect(q.blanks).toHaveLength(1);
    expect(q.blanks![0]!.pos).toBe(1);
  });

  it("matching: has 2 empty pairs", () => {
    const q = blankQuestion("matching");
    expect(q.pairs).toHaveLength(2);
    expect(q.pairs![0]!.left).toBe("");
  });

  it("ordering: has 2 items, correctPos 1 and 2", () => {
    const q = blankQuestion("ordering");
    expect(q.orderItems).toHaveLength(2);
    expect(q.orderItems![0]!.correctPos).toBe(1);
    expect(q.orderItems![1]!.correctPos).toBe(2);
  });

  it("tfng: judgeAnswer is 'true', has one answerKey", () => {
    const q = blankQuestion("tfng");
    expect(q.judgeAnswer).toBe("true");
    expect(q.answerKeys).toHaveLength(1);
    expect(q.answerKeys![0]!.value).toBe("true");
  });

  it("ynng: judgeAnswer is 'yes'", () => {
    const q = blankQuestion("ynng");
    expect(q.judgeAnswer).toBe("yes");
    expect(q.answerKeys![0]!.value).toBe("yes");
  });

  it("short: has one empty answerKey, maxWords=3", () => {
    const q = blankQuestion("short");
    expect(q.answerKeys).toHaveLength(1);
    expect(q.maxWords).toBe(3);
  });

  it("writing: points=9, rubricId empty, minWords=250", () => {
    const q = blankQuestion("writing");
    expect(q.points).toBe(9);
    expect(q.rubricId).toBe("");
    expect(q.minWords).toBe(250);
  });

  it("speaking: points=9, suggestedTime=2, prepTime=1", () => {
    const q = blankQuestion("speaking");
    expect(q.points).toBe(9);
    expect(q.suggestedTime).toBe(2);
    expect(q.prepTime).toBe(1);
  });

  it("all types: status is 'draft', groupId is null, tagIds is []", () => {
    const types = ["mcq","multi","fill","matching","tfng","ynng","ordering","short","writing","speaking"] as const;
    for (const t of types) {
      const q = blankQuestion(t);
      expect(q.status).toBe("draft");
      expect(q.groupId).toBeNull();
      expect(q.tagIds).toEqual([]);
    }
  });
});
```

- [ ] **Step 4: Write the blankQuestion factory**

Create `src/features/admin-exam-qbank/mock/blank-question.ts`:

```typescript
import type { Question, QuestionType } from "../types/question-bank.types";

function baseQuestion(type: QuestionType): Question {
  return {
    id: `q-new-${Date.now()}`,
    type,
    skill: "reading",
    programId: "p-ielts",
    difficulty: "medium",
    points: 1,
    status: "draft",
    stem: "",
    explanation: "",
    groupId: null,
    tagIds: [],
    sourceId: "",
    vocabIds: [],
    updatedAt: new Date().toLocaleDateString("vi-VN"),
  };
}

export function blankQuestion(type: QuestionType): Question {
  const base = baseQuestion(type);
  switch (type) {
    case "mcq":
      return { ...base, choices: [
        { key: "A", text: "", correct: true  },
        { key: "B", text: "", correct: false },
        { key: "C", text: "", correct: false },
      ]};
    case "multi":
      return { ...base, choices: [
        { key: "A", text: "", correct: true  },
        { key: "B", text: "", correct: true  },
        { key: "C", text: "", correct: false },
        { key: "D", text: "", correct: false },
      ]};
    case "fill":
      return { ...base, stem: "{{1}} …", blanks: [{ pos: 1, accepted: [], caseSensitive: false }] };
    case "matching":
      return { ...base, pairs: [{ left: "", right: "" }, { left: "", right: "" }] };
    case "ordering":
      return { ...base, orderItems: [{ text: "", correctPos: 1 }, { text: "", correctPos: 2 }] };
    case "tfng":
      return { ...base, judgeAnswer: "true", answerKeys: [{ value: "true" }] };
    case "ynng":
      return { ...base, judgeAnswer: "yes", answerKeys: [{ value: "yes" }] };
    case "short":
      return { ...base, answerKeys: [{ value: "" }], maxWords: 3 };
    case "writing":
      return { ...base, points: 9, rubricId: "", minWords: 250, suggestedTime: 40 };
    case "speaking":
      return { ...base, points: 9, rubricId: "", suggestedTime: 2, prepTime: 1 };
  }
}
```

- [ ] **Step 5: Run the blankQuestion test**

```bash
cd /Users/vanhuu/Documents/freelance/lexi-web-English/lexipath-frontend
npx vitest run src/features/admin-exam-qbank/types/__tests__/blank-question.test.ts
```

Expected: all 11 tests pass.

- [ ] **Step 6: Create the feature index and run typecheck**

Create `src/features/admin-exam-qbank/index.ts`:

```typescript
export * from "./types/question-bank.types";
export * from "./mock/question-bank.mock";
export * from "./mock/blank-question";
```

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/features/admin-exam-qbank/
git commit -m "feat(admin-exam-qbank): add types, mock data, and blankQuestion factory"
```

---

## Task 2: Filter hook

**Files:**
- Create: `src/features/admin-exam-qbank/hooks/use-question-bank-filters.ts`
- Create: `src/features/admin-exam-qbank/hooks/__tests__/use-question-bank-filters.test.ts`

**Interfaces:**
- Consumes: `Question`, `QuestionGroup` from Task 1
- Produces:
  ```typescript
  useQuestionBankFilters(questions: Question[], groups: QuestionGroup[]): {
    filters: QuestionBankFilterState;
    setFilters: (f: QuestionBankFilterState) => void;
    clearFilters: () => void;
    filtered: Question[];
    paginated: Question[];
    page: number;
    totalPages: number;
    setPage: (n: number) => void;
    selectedIds: string[];
    toggleSelect: (id: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
    statusCounts: Record<"all" | QuestionStatus, number>;
  }
  ```

---

- [ ] **Step 1: Write the filter hook test**

Create `src/features/admin-exam-qbank/hooks/__tests__/use-question-bank-filters.test.ts`:

```typescript
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useQuestionBankFilters } from "../use-question-bank-filters";
import { QB_QUESTIONS, QB_GROUPS } from "../../mock/question-bank.mock";

describe("useQuestionBankFilters", () => {
  it("returns all 13 questions with no filters set", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    expect(result.current.filtered.length).toBe(13);
  });

  it("paginates — first page has at most 20 items", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    expect(result.current.paginated.length).toBeLessThanOrEqual(20);
    expect(result.current.paginated.length).toBeGreaterThan(0);
  });

  it("search filters by stem (case-insensitive)", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.setFilters({ search: "SOLAR" }));
    expect(result.current.filtered.length).toBeGreaterThan(0);
    result.current.filtered.forEach((q) =>
      expect(q.stem.toLowerCase()).toContain("solar")
    );
  });

  it("search for non-existent text returns 0 results", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.setFilters({ search: "ZZZNOMATCH99" }));
    expect(result.current.filtered.length).toBe(0);
  });

  it("type filter narrows to matching question type", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.setFilters({ type: "mcq" }));
    expect(result.current.filtered.length).toBeGreaterThan(0);
    result.current.filtered.forEach((q) => expect(q.type).toBe("mcq"));
  });

  it("skill filter narrows correctly", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.setFilters({ skill: "grammar" }));
    result.current.filtered.forEach((q) => expect(q.skill).toBe("grammar"));
  });

  it("status filter shows only matching questions", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.setFilters({ status: "review" }));
    result.current.filtered.forEach((q) => expect(q.status).toBe("review"));
  });

  it("program filter narrows correctly", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.setFilters({ program: "p-hsk" }));
    result.current.filtered.forEach((q) => expect(q.programId).toBe("p-hsk"));
  });

  it("combined type + skill filter is AND logic", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.setFilters({ type: "mcq", skill: "grammar" }));
    result.current.filtered.forEach((q) => {
      expect(q.type).toBe("mcq");
      expect(q.skill).toBe("grammar");
    });
  });

  it("page resets to 1 when filters change", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
    act(() => result.current.setFilters({ search: "solar" }));
    expect(result.current.page).toBe(1);
  });

  it("clearFilters restores all questions", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.setFilters({ type: "mcq" }));
    act(() => result.current.clearFilters());
    expect(result.current.filtered.length).toBe(13);
    expect(result.current.filters).toEqual({});
  });

  it("toggleSelect adds then removes an id", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.toggleSelect("q-mcq-1"));
    expect(result.current.selectedIds).toContain("q-mcq-1");
    act(() => result.current.toggleSelect("q-mcq-1"));
    expect(result.current.selectedIds).not.toContain("q-mcq-1");
  });

  it("selectAll selects all filtered IDs", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.setFilters({ type: "mcq" }));
    act(() => result.current.selectAll());
    const mcqIds = QB_QUESTIONS.filter((q) => q.type === "mcq").map((q) => q.id);
    expect(result.current.selectedIds).toEqual(expect.arrayContaining(mcqIds));
  });

  it("clearSelection empties selectedIds", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    act(() => result.current.toggleSelect("q-mcq-1"));
    act(() => result.current.clearSelection());
    expect(result.current.selectedIds).toEqual([]);
  });

  it("statusCounts['all'] equals total questions count", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    expect(result.current.statusCounts["all"]).toBe(13);
  });

  it("statusCounts['draft'] counts only draft questions", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    const expected = QB_QUESTIONS.filter((q) => q.status === "draft").length;
    expect(result.current.statusCounts["draft"]).toBe(expected);
  });

  it("totalPages is 1 for 13 items with PAGE_SIZE=20", () => {
    const { result } = renderHook(() =>
      useQuestionBankFilters(QB_QUESTIONS, QB_GROUPS)
    );
    expect(result.current.totalPages).toBe(1);
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run src/features/admin-exam-qbank/hooks/__tests__/use-question-bank-filters.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement the filter hook**

Create `src/features/admin-exam-qbank/hooks/use-question-bank-filters.ts`:

```typescript
"use client";

import { useState, useMemo } from "react";
import type { Question, QuestionGroup, QuestionStatus } from "../types/question-bank.types";

const PAGE_SIZE = 20;

export interface QuestionBankFilterState {
  search?: string;
  type?: string;
  skill?: string;
  program?: string;
  status?: string;
}

export function useQuestionBankFilters(
  questions: Question[],
  _groups: QuestionGroup[],
) {
  const [filters, setFiltersRaw] = useState<QuestionBankFilterState>({});
  const [page, setPageRaw] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function setFilters(f: QuestionBankFilterState) {
    setFiltersRaw(f);
    setPageRaw(1);
  }

  function clearFilters() {
    setFiltersRaw({});
    setPageRaw(1);
  }

  function setPage(n: number) {
    setPageRaw(n);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function selectAll() {
    setSelectedIds(filtered.map((q) => q.id));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!q.stem.toLowerCase().includes(s)) return false;
      }
      if (filters.type && q.type !== filters.type) return false;
      if (filters.skill && q.skill !== filters.skill) return false;
      if (filters.program && q.programId !== filters.program) return false;
      if (filters.status && q.status !== filters.status) return false;
      return true;
    });
  }, [questions, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: questions.length };
    const statuses: QuestionStatus[] = ["draft", "review", "published"];
    for (const s of statuses) {
      counts[s] = questions.filter((q) => q.status === s).length;
    }
    return counts as Record<"all" | QuestionStatus, number>;
  }, [questions]);

  return {
    filters,
    setFilters,
    clearFilters,
    filtered,
    paginated,
    page,
    totalPages,
    setPage,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    statusCounts,
  };
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run src/features/admin-exam-qbank/hooks/__tests__/use-question-bank-filters.test.ts
```

Expected: all 17 tests pass.

- [ ] **Step 5: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/admin-exam-qbank/hooks/
git commit -m "feat(admin-exam-qbank): add useQuestionBankFilters hook with tests"
```

---

## Task 3: Atom components

**Files:**
- Create: `src/features/admin-exam-qbank/components/atoms/question-type-chip.tsx`
- Create: `src/features/admin-exam-qbank/components/atoms/question-diff-pill.tsx`
- Create: `src/features/admin-exam-qbank/components/atoms/question-grade-chip.tsx`
- Create: `src/features/admin-exam-qbank/components/atoms/question-status-badge.tsx`

**Interfaces:**
- Consumes: `QuestionType`, `Difficulty`, `QuestionStatus`, `QB_TYPE_REGISTRY`, `QB_DIFF_REGISTRY` from Task 1
- Produces:
  - `QuestionTypeChip({ typeId: QuestionType; size?: "sm" | "md" }): JSX.Element`
  - `QuestionDiffPill({ value: Difficulty }): JSX.Element`
  - `QuestionGradeChip({ typeId: QuestionType }): JSX.Element`
  - `QuestionStatusBadge({ status: QuestionStatus }): JSX.Element`

---

- [ ] **Step 1: Create QuestionTypeChip**

Create `src/features/admin-exam-qbank/components/atoms/question-type-chip.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { QB_TYPE_REGISTRY } from "../../mock/question-bank.mock";
import type { QuestionType } from "../../types/question-bank.types";

// lucide-react dynamic icon lookup
import {
  CircleDot, CheckSquare, PencilLine, Shuffle, Scale,
  CheckCheck, ListOrdered, Type, FileText, Mic,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  "circle-dot": CircleDot, "check-square": CheckSquare,
  "pencil-line": PencilLine, "shuffle": Shuffle, "scale": Scale,
  "check-check": CheckCheck, "list-ordered": ListOrdered,
  "type": Type, "file-text": FileText, "mic": Mic,
};

export interface QuestionTypeChipProps {
  typeId: QuestionType;
  size?: "sm" | "md";
  className?: string;
}

export function QuestionTypeChip({ typeId, size = "md", className }: QuestionTypeChipProps) {
  const info = QB_TYPE_REGISTRY[typeId];
  if (!info) return null;
  const Icon = ICON_MAP[info.icon];
  const sm = size === "sm";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap",
        sm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]",
        className,
      )}
      style={{
        backgroundColor: `${info.color}22`,
        color: info.color,
      }}
    >
      {Icon && <Icon className={sm ? "size-[11px]" : "size-3"} aria-hidden />}
      {info.short}
    </span>
  );
}
```

- [ ] **Step 2: Create QuestionDiffPill**

Create `src/features/admin-exam-qbank/components/atoms/question-diff-pill.tsx`:

```tsx
import * as React from "react";
import { QB_DIFF_REGISTRY } from "../../mock/question-bank.mock";
import type { Difficulty } from "../../types/question-bank.types";

export interface QuestionDiffPillProps {
  value: Difficulty;
}

export function QuestionDiffPill({ value }: QuestionDiffPillProps) {
  const info = QB_DIFF_REGISTRY[value];
  if (!info) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="text-[11px] font-semibold" style={{ color: info.color }}>
      {info.label}
    </span>
  );
}
```

- [ ] **Step 3: Create QuestionGradeChip**

Create `src/features/admin-exam-qbank/components/atoms/question-grade-chip.tsx`:

```tsx
import * as React from "react";
import { Zap, UserCheck } from "lucide-react";
import { QB_TYPE_REGISTRY } from "../../mock/question-bank.mock";
import type { QuestionType } from "../../types/question-bank.types";

export interface QuestionGradeChipProps {
  typeId: QuestionType;
}

export function QuestionGradeChip({ typeId }: QuestionGradeChipProps) {
  const info = QB_TYPE_REGISTRY[typeId];
  if (!info) return null;
  if (info.auto) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600">
        <Zap className="size-3" aria-hidden />
        Tự chấm
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600">
      <UserCheck className="size-3" aria-hidden />
      Rubric
    </span>
  );
}
```

- [ ] **Step 4: Create QuestionStatusBadge**

Maps the 3 UI statuses to `ContentStatusBadge`'s 6-value `ContentStatus` type.

Create `src/features/admin-exam-qbank/components/atoms/question-status-badge.tsx`:

```tsx
import * as React from "react";
import { ContentStatusBadge } from "@/components/shared/badges/content-status-badge";
import type { QuestionStatus } from "../../types/question-bank.types";
import type { ContentStatus } from "@/components/shared/badges/content-status-badge";

const STATUS_MAP: Record<QuestionStatus, ContentStatus> = {
  draft:     "draft",
  review:    "in_review",
  published: "published",
};

export interface QuestionStatusBadgeProps {
  status: QuestionStatus;
}

export function QuestionStatusBadge({ status }: QuestionStatusBadgeProps) {
  return <ContentStatusBadge status={STATUS_MAP[status]} />;
}
```

- [ ] **Step 5: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/admin-exam-qbank/components/atoms/
git commit -m "feat(admin-exam-qbank): add atom components — TypeChip, DiffPill, GradeChip, StatusBadge"
```

---

## Task 4: Answer editors — ChoiceEditor & JudgeEditor

**Files:**
- Create: `src/features/admin-exam-qbank/components/answer-editors/choice-editor.tsx`
- Create: `src/features/admin-exam-qbank/components/answer-editors/judge-editor.tsx`

**Interfaces:**
- Consumes: `QuestionChoice`, `QuestionType` from Task 1
- Produces:
  - `ChoiceEditor({ choices: QuestionChoice[]; multi: boolean; onChange: (choices: QuestionChoice[]) => void })`
  - `JudgeEditor({ type: "tfng" | "ynng"; value: string; onChange: (value: string) => void })`

---

- [ ] **Step 1: Create ChoiceEditor**

Create `src/features/admin-exam-qbank/components/answer-editors/choice-editor.tsx`:

```tsx
"use client";

import * as React from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { QuestionChoice } from "../../types/question-bank.types";

const CHOICE_KEYS = ["A", "B", "C", "D", "E", "F"] as const;

export interface ChoiceEditorProps {
  choices: QuestionChoice[];
  multi: boolean;
  onChange: (choices: QuestionChoice[]) => void;
}

export function ChoiceEditor({ choices, multi, onChange }: ChoiceEditorProps) {
  function set(i: number, patch: Partial<QuestionChoice>) {
    onChange(choices.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  function setCorrect(i: number) {
    if (multi) {
      set(i, { correct: !choices[i]!.correct });
    } else {
      onChange(choices.map((c, idx) => ({ ...c, correct: idx === i })));
    }
  }

  function addChoice() {
    if (choices.length >= 6) return;
    onChange([...choices, { key: CHOICE_KEYS[choices.length]!, text: "", correct: false }]);
  }

  function deleteChoice(i: number) {
    onChange(
      choices
        .filter((_, idx) => idx !== i)
        .map((c, idx) => ({ ...c, key: CHOICE_KEYS[idx]! })),
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Lựa chọn
        </p>
        <span className="text-[11px] text-muted-foreground">
          {multi ? "Tích các đáp án đúng" : "Chọn 1 đáp án đúng"}
        </span>
      </div>

      {choices.map((c, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-2 rounded-xl border p-2.5 transition-colors",
            c.correct ? "border-primary bg-primary/5" : "border-border bg-card",
          )}
        >
          <button
            type="button"
            aria-label={multi ? "Đánh dấu đáp án đúng" : "Đặt làm đáp án đúng"}
            onClick={() => setCorrect(i)}
            className={cn(
              "size-6 shrink-0 flex items-center justify-center border-2 transition-colors",
              multi ? "rounded-md" : "rounded-full",
              c.correct
                ? "border-green-500 bg-green-500"
                : "border-muted-foreground/40 bg-transparent",
            )}
          >
            {c.correct && <Check className="size-3.5 text-white" aria-hidden />}
          </button>
          <span className="w-5 shrink-0 text-sm font-bold text-muted-foreground">
            {c.key}
          </span>
          <Input
            value={c.text}
            onChange={(e) => set(i, { text: e.target.value })}
            placeholder={`Nội dung lựa chọn ${c.key}`}
            className="h-8 text-sm"
          />
          {choices.length > 2 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Xóa lựa chọn"
              onClick={() => deleteChoice(i)}
              className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      ))}

      {choices.length < 6 && (
        <button
          type="button"
          onClick={addChoice}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="size-3.5" aria-hidden />
          Thêm lựa chọn
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create JudgeEditor**

Create `src/features/admin-exam-qbank/components/answer-editors/judge-editor.tsx`:

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface JudgeOption {
  value: string;
  label: string;
  color: string;
}

const TFNG_OPTS: JudgeOption[] = [
  { value: "true",  label: "True",      color: "#16A34A" },
  { value: "false", label: "False",     color: "#DC2626" },
  { value: "ng",    label: "Not Given", color: "#64748B" },
];

const YNNG_OPTS: JudgeOption[] = [
  { value: "yes", label: "Yes",       color: "#16A34A" },
  { value: "no",  label: "No",        color: "#DC2626" },
  { value: "ng",  label: "Not Given", color: "#64748B" },
];

export interface JudgeEditorProps {
  type: "tfng" | "ynng";
  value: string;
  onChange: (value: string) => void;
}

export function JudgeEditor({ type, value, onChange }: JudgeEditorProps) {
  const opts = type === "tfng" ? TFNG_OPTS : YNNG_OPTS;
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        Đáp án đúng
      </p>
      <div className="flex gap-2">
        {opts.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 rounded-xl border-2 py-2.5 px-2 text-sm font-bold transition-all",
            )}
            style={{
              borderColor: value === o.value ? o.color : undefined,
              backgroundColor: value === o.value ? `${o.color}12` : undefined,
              color: value === o.value ? o.color : undefined,
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/admin-exam-qbank/components/answer-editors/choice-editor.tsx
git add src/features/admin-exam-qbank/components/answer-editors/judge-editor.tsx
git commit -m "feat(admin-exam-qbank): add ChoiceEditor and JudgeEditor"
```

---

## Task 5: Answer editors — FillBlankEditor & AnswerKeyEditor

**Files:**
- Create: `src/features/admin-exam-qbank/components/answer-editors/fill-blank-editor.tsx`
- Create: `src/features/admin-exam-qbank/components/answer-editors/answer-key-editor.tsx`

**Interfaces:**
- Consumes: `QuestionBlank`, `AnswerKey` from Task 1
- Produces:
  - `FillBlankEditor({ stem: string; blanks: QuestionBlank[]; onChange: (blanks: QuestionBlank[]) => void })`
  - `AnswerKeyEditor({ answerKeys: AnswerKey[]; onChange: (keys: AnswerKey[]) => void; maxWords?: number; onMaxWords?: (n: number) => void })`

---

- [ ] **Step 1: Create FillBlankEditor**

Create `src/features/admin-exam-qbank/components/answer-editors/fill-blank-editor.tsx`:

```tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { QuestionBlank } from "../../types/question-bank.types";

export interface FillBlankEditorProps {
  stem: string;
  blanks: QuestionBlank[];
  onChange: (blanks: QuestionBlank[]) => void;
}

export function FillBlankEditor({ stem, blanks, onChange }: FillBlankEditorProps) {
  const tokenCount = (stem.match(/\{\{\d+\}\}/g) ?? []).length;

  function set(i: number, patch: Partial<QuestionBlank>) {
    onChange(blanks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  }

  function setAccepted(i: number, raw: string) {
    set(i, { accepted: raw.split(",").map((s) => s.trim()).filter(Boolean) });
  }

  const syncOk = tokenCount === blanks.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Ô trống
        </p>
        <span className={cn("text-[11px]", syncOk ? "text-green-600" : "text-amber-500")}>
          {tokenCount} ô{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[10px]">{"{{n}}"}</code>{" "}
          · {blanks.length} đáp án
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Dùng{" "}
        <code className="rounded bg-muted px-1 py-0.5">{"{{1}}"}</code>,{" "}
        <code className="rounded bg-muted px-1 py-0.5">{"{{2}}"}</code>
        … trong nội dung câu hỏi để đánh dấu ô trống.
      </p>

      {blanks.map((b, i) => (
        <div key={i} className="rounded-xl border border-border bg-muted/40 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700">
              {`{{${b.pos}}}`}
            </span>
            <span className="text-[11px] text-muted-foreground">Ô số {b.pos}</span>
            <div className="ml-auto flex items-center gap-1.5">
              <input
                id={`case-${i}`}
                type="checkbox"
                checked={!!b.caseSensitive}
                onChange={(e) => set(i, { caseSensitive: e.target.checked })}
                className="rounded"
              />
              <label htmlFor={`case-${i}`} className="text-[11px] text-muted-foreground cursor-pointer">
                Phân biệt hoa/thường
              </label>
            </div>
          </div>
          <Input
            value={(b.accepted ?? []).join(", ")}
            onChange={(e) => setAccepted(i, e.target.value)}
            placeholder="Các đáp án chấp nhận, phân tách bằng dấu phẩy"
            className="h-8 text-sm"
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create AnswerKeyEditor**

Create `src/features/admin-exam-qbank/components/answer-editors/answer-key-editor.tsx`:

```tsx
"use client";

import * as React from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AnswerKey } from "../../types/question-bank.types";

export interface AnswerKeyEditorProps {
  answerKeys: AnswerKey[];
  onChange: (keys: AnswerKey[]) => void;
  maxWords?: number;
  onMaxWords?: (n: number) => void;
}

export function AnswerKeyEditor({ answerKeys, onChange, maxWords, onMaxWords }: AnswerKeyEditorProps) {
  function set(i: number, value: string) {
    onChange(answerKeys.map((a, idx) => (idx === i ? { value } : a)));
  }
  function add() {
    onChange([...answerKeys, { value: "" }]);
  }
  function remove(i: number) {
    onChange(answerKeys.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Đáp án chấp nhận
        </p>
        <span className="text-[11px] text-muted-foreground">Mọi biến thể đều tính đúng</span>
      </div>

      {answerKeys.map((a, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="size-5 shrink-0 rounded-md bg-green-50 flex items-center justify-center">
            <Check className="size-3 text-green-600" aria-hidden />
          </span>
          <Input
            value={a.value}
            onChange={(e) => set(i, e.target.value)}
            placeholder="Đáp án đúng…"
            className="h-8 text-sm"
          />
          {answerKeys.length > 1 && (
            <button
              type="button"
              aria-label="Xóa đáp án"
              onClick={() => remove(i)}
              className="size-8 shrink-0 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-3.5" aria-hidden />
        Thêm đáp án thay thế
      </button>

      {onMaxWords !== undefined && (
        <div className="mt-3 max-w-[200px]">
          <Label htmlFor="max-words" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Giới hạn số từ
          </Label>
          <Input
            id="max-words"
            type="number"
            min={0}
            value={maxWords ?? 0}
            onChange={(e) => onMaxWords(Number(e.target.value))}
            className="mt-1 h-8 text-sm"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">0 = không giới hạn</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/admin-exam-qbank/components/answer-editors/fill-blank-editor.tsx
git add src/features/admin-exam-qbank/components/answer-editors/answer-key-editor.tsx
git commit -m "feat(admin-exam-qbank): add FillBlankEditor and AnswerKeyEditor"
```

---

## Task 6: Answer editors — MatchingPairEditor, OrderingEditor & OpenPromptEditor

**Files:**
- Create: `src/features/admin-exam-qbank/components/answer-editors/matching-pair-editor.tsx`
- Create: `src/features/admin-exam-qbank/components/answer-editors/ordering-editor.tsx`
- Create: `src/features/admin-exam-qbank/components/answer-editors/open-prompt-editor.tsx`

**Interfaces:**
- Consumes: `MatchingPair`, `OrderItem`, `ExamRubric`, `Question` from Task 1; `QB_RUBRICS` from Task 1 mock
- Produces:
  - `MatchingPairEditor({ pairs: MatchingPair[]; onChange: (pairs: MatchingPair[]) => void })`
  - `OrderingEditor({ items: OrderItem[]; onChange: (items: OrderItem[]) => void })`
  - `OpenPromptEditor({ type: "writing" | "speaking"; draft: Partial<Question>; onChange: (patch: Partial<Question>) => void; rubrics: ExamRubric[] })`

---

- [ ] **Step 1: Create MatchingPairEditor**

Create `src/features/admin-exam-qbank/components/answer-editors/matching-pair-editor.tsx`:

```tsx
"use client";

import * as React from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { MatchingPair } from "../../types/question-bank.types";

export interface MatchingPairEditorProps {
  pairs: MatchingPair[];
  onChange: (pairs: MatchingPair[]) => void;
}

export function MatchingPairEditor({ pairs, onChange }: MatchingPairEditorProps) {
  function set(i: number, patch: Partial<MatchingPair>) {
    onChange(pairs.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function add() {
    onChange([...pairs, { left: "", right: "" }]);
  }
  function remove(i: number) {
    onChange(pairs.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Cặp ghép đôi
        </p>
        <span className="text-[11px] text-muted-foreground">Cặp đúng — sẽ xáo trộn cho học viên</span>
      </div>

      <div className="flex items-center gap-2 px-0.5 mb-1">
        <span className="flex-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Cột trái
        </span>
        <ArrowRight className="size-3 text-muted-foreground shrink-0 w-7 text-center" aria-hidden />
        <span className="flex-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Cột phải
        </span>
        <span className="w-8" />
      </div>

      {pairs.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={p.left}
            onChange={(e) => set(i, { left: e.target.value })}
            placeholder={`Mục ${i + 1}`}
            className="h-8 text-sm"
          />
          <ArrowRight className="size-3.5 text-pink-600 shrink-0" aria-hidden />
          <Input
            value={p.right}
            onChange={(e) => set(i, { right: e.target.value })}
            placeholder="Ghép với…"
            className="h-8 text-sm"
          />
          {pairs.length > 2 && (
            <button
              type="button"
              aria-label="Xóa cặp"
              onClick={() => remove(i)}
              className="size-8 shrink-0 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-3.5" aria-hidden />
        Thêm cặp
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create OrderingEditor**

Create `src/features/admin-exam-qbank/components/answer-editors/ordering-editor.tsx`:

```tsx
"use client";

import * as React from "react";
import { ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { OrderItem } from "../../types/question-bank.types";

export interface OrderingEditorProps {
  items: OrderItem[];
  onChange: (items: OrderItem[]) => void;
}

export function OrderingEditor({ items, onChange }: OrderingEditorProps) {
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next.map((it, idx) => ({ ...it, correctPos: idx + 1 })));
  }

  function setText(i: number, text: string) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, text } : it)));
  }

  function add() {
    onChange([...items, { text: "", correctPos: items.length + 1 }]);
  }

  function remove(i: number) {
    onChange(
      items
        .filter((_, idx) => idx !== i)
        .map((it, idx) => ({ ...it, correctPos: idx + 1 })),
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Trình tự đúng
        </p>
        <span className="text-[11px] text-muted-foreground">Thứ tự hiển thị = thứ tự đúng</span>
      </div>

      {items.map((it, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-xl border border-border bg-card p-2"
        >
          <span className="size-6 shrink-0 rounded-md bg-amber-50 flex items-center justify-center text-[12px] font-bold text-amber-600">
            {i + 1}
          </span>
          <Input
            value={it.text}
            onChange={(e) => setText(i, e.target.value)}
            placeholder={`Mục thứ ${i + 1}`}
            className="h-8 text-sm"
          />
          <div className="flex flex-col gap-0.5 shrink-0">
            <button
              type="button"
              aria-label="Di chuyển lên"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="size-4 flex items-center justify-center rounded border border-border bg-card text-muted-foreground disabled:opacity-30 hover:bg-muted transition-colors"
            >
              <ChevronUp className="size-3" />
            </button>
            <button
              type="button"
              aria-label="Di chuyển xuống"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              className="size-4 flex items-center justify-center rounded border border-border bg-card text-muted-foreground disabled:opacity-30 hover:bg-muted transition-colors"
            >
              <ChevronDown className="size-3" />
            </button>
          </div>
          {items.length > 2 && (
            <button
              type="button"
              aria-label="Xóa mục"
              onClick={() => remove(i)}
              className="size-8 shrink-0 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-3.5" aria-hidden />
        Thêm mục
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create OpenPromptEditor**

Create `src/features/admin-exam-qbank/components/answer-editors/open-prompt-editor.tsx`:

```tsx
"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { ExamRubric, Question } from "../../types/question-bank.types";

export interface OpenPromptEditorProps {
  type: "writing" | "speaking";
  draft: Partial<Question>;
  onChange: (patch: Partial<Question>) => void;
  rubrics: ExamRubric[];
}

export function OpenPromptEditor({ type, draft, onChange, rubrics }: OpenPromptEditorProps) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        Cấu hình chấm
      </p>

      <div className="flex items-start gap-2 rounded-xl border border-purple-200 bg-purple-50 p-3">
        <Info className="size-4 text-purple-600 shrink-0 mt-0.5" aria-hidden />
        <span className="text-xs text-purple-700 leading-relaxed">
          Câu hỏi dạng {type === "writing" ? "viết" : "nói"} không tự chấm — giám khảo chấm theo rubric.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label htmlFor="rubric-select" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Rubric chấm điểm <span className="text-destructive">*</span>
          </Label>
          <Select
            value={draft.rubricId ?? ""}
            onValueChange={(v) => onChange({ rubricId: v })}
          >
            <SelectTrigger id="rubric-select" className="mt-1 h-9 text-sm">
              <SelectValue placeholder="— Chọn rubric —" />
            </SelectTrigger>
            <SelectContent>
              {rubrics.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {type === "writing" ? (
          <>
            <div>
              <Label htmlFor="min-words" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Số từ tối thiểu
              </Label>
              <Input
                id="min-words"
                type="number"
                min={0}
                value={draft.minWords ?? 0}
                onChange={(e) => onChange({ minWords: Number(e.target.value) })}
                className="mt-1 h-9 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="suggested-time-w" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Thời gian gợi ý (phút)
              </Label>
              <Input
                id="suggested-time-w"
                type="number"
                min={0}
                value={draft.suggestedTime ?? 0}
                onChange={(e) => onChange({ suggestedTime: Number(e.target.value) })}
                className="mt-1 h-9 text-sm"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="suggested-time-s" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Thời gian nói (phút)
              </Label>
              <Input
                id="suggested-time-s"
                type="number"
                min={0}
                value={draft.suggestedTime ?? 0}
                onChange={(e) => onChange({ suggestedTime: Number(e.target.value) })}
                className="mt-1 h-9 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="prep-time" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Thời gian chuẩn bị (phút)
              </Label>
              <Input
                id="prep-time"
                type="number"
                min={0}
                value={draft.prepTime ?? 0}
                onChange={(e) => onChange({ prepTime: Number(e.target.value) })}
                className="mt-1 h-9 text-sm"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/features/admin-exam-qbank/components/answer-editors/
git commit -m "feat(admin-exam-qbank): add MatchingPairEditor, OrderingEditor, OpenPromptEditor"
```

---

## Task 7: QuestionPreview

**Files:**
- Create: `src/features/admin-exam-qbank/components/question-preview.tsx`

**Interfaces:**
- Consumes: `Question`, `QB_RUBRICS` from Task 1 mock; all atom components from Task 3
- Produces: `QuestionPreview({ q: Question })`

---

- [ ] **Step 1: Create QuestionPreview**

Create `src/features/admin-exam-qbank/components/question-preview.tsx`:

```tsx
"use client";

import * as React from "react";
import { Check, UserCheck, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { QB_RUBRICS } from "../mock/question-bank.mock";
import { QuestionTypeChip } from "./atoms/question-type-chip";
import { QuestionDiffPill } from "./atoms/question-diff-pill";
import type { Question } from "../types/question-bank.types";

export interface QuestionPreviewProps {
  q: Question;
}

export function QuestionPreview({ q }: QuestionPreviewProps) {
  const rubric = QB_RUBRICS.find((r) => r.id === q.rubricId);

  // Render stem with {{n}} replaced by underline placeholders
  const stemContent =
    q.type === "fill" ? (
      <p className="text-base font-semibold leading-relaxed text-foreground">
        {q.stem.split(/(\{\{\d+\}\})/g).map((part, i) =>
          /\{\{\d+\}\}/.test(part) ? (
            <span
              key={i}
              className="mx-1 inline-block min-w-16 border-b-2 border-primary text-center font-bold text-primary"
            >
              {part.replace(/[{}]/g, "")}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>
    ) : (
      <p className="text-base font-semibold leading-relaxed text-foreground">{q.stem}</p>
    );

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center gap-2 flex-wrap">
        <QuestionTypeChip typeId={q.type} size="sm" />
        <QuestionDiffPill value={q.difficulty} />
        <span className="text-[11px] text-muted-foreground">· {q.points} điểm</span>
      </div>

      {stemContent}

      {/* MCQ / Multi */}
      {(q.type === "mcq" || q.type === "multi") && (
        <div className="space-y-2">
          {(q.choices ?? []).map((c) => (
            <div
              key={c.key}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-2.5",
                c.correct ? "border-primary bg-primary/5" : "border-border bg-card",
              )}
            >
              <span
                className={cn(
                  "size-6 shrink-0 flex items-center justify-center border-2 text-xs font-bold",
                  q.type === "multi" ? "rounded-md" : "rounded-full",
                  c.correct
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-muted-foreground/40 text-muted-foreground",
                )}
              >
                {c.correct ? <Check className="size-3.5" aria-hidden /> : c.key}
              </span>
              <span className="text-sm text-foreground">{c.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* TFNG / YNNG */}
      {(q.type === "tfng" || q.type === "ynng") && (
        <div className="flex gap-2">
          {(q.type === "tfng"
            ? [["true", "True"], ["false", "False"], ["ng", "Not Given"]]
            : [["yes", "Yes"], ["no", "No"], ["ng", "Not Given"]]
          ).map(([v, l]) => (
            <div
              key={v}
              className={cn(
                "flex-1 rounded-xl border-2 py-2.5 px-2 text-center text-sm font-bold",
                q.judgeAnswer === v
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {l}
              {q.judgeAnswer === v && <Check className="inline ml-1.5 size-3.5 align-text-top" aria-hidden />}
            </div>
          ))}
        </div>
      )}

      {/* Matching */}
      {q.type === "matching" && (
        <div className="space-y-2">
          {(q.pairs ?? []).map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">{p.left}</div>
              <span className="shrink-0 text-pink-500 font-bold text-base">→</span>
              <div className="flex-1 rounded-lg border border-pink-100 bg-pink-50 px-3 py-2 text-sm">{p.right}</div>
            </div>
          ))}
        </div>
      )}

      {/* Ordering */}
      {q.type === "ordering" && (
        <div className="space-y-2">
          {(q.orderItems ?? [])
            .slice()
            .sort((a, b) => a.correctPos - b.correctPos)
            .map((it, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                <span className="size-6 shrink-0 rounded-md bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-600">
                  {i + 1}
                </span>
                <span className="text-sm">{it.text}</span>
              </div>
            ))}
        </div>
      )}

      {/* Fill blanks key */}
      {q.type === "fill" && (
        <div className="space-y-1">
          {(q.blanks ?? []).map((b) => (
            <div key={b.pos} className="text-sm text-muted-foreground">
              <span className="font-bold text-purple-600">{`{{${b.pos}}}`}</span>
              {" → "}
              {(b.accepted ?? []).join(" / ")}
            </div>
          ))}
        </div>
      )}

      {/* Short answer keys */}
      {q.type === "short" && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Đáp án chấp nhận
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(q.answerKeys ?? []).map((a, i) => (
              <Badge key={i} variant="secondary">{a.value}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Writing / Speaking */}
      {(q.type === "writing" || q.type === "speaking") && (
        <div className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700">
          <UserCheck className="size-4 shrink-0" aria-hidden />
          <span>
            Chấm bằng rubric:{" "}
            <strong>{rubric?.name ?? "chưa gán"}</strong>
            {q.minWords ? ` · tối thiểu ${q.minWords} từ` : null}
          </span>
        </div>
      )}

      {/* Explanation */}
      {q.explanation && (
        <div className="border-t border-dashed border-border pt-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
            <Lightbulb className="size-3" aria-hidden />
            Giải thích
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/admin-exam-qbank/components/question-preview.tsx
git commit -m "feat(admin-exam-qbank): add QuestionPreview — renders all 10 question types"
```

---

## Task 8: QuestionBankTable

**Files:**
- Create: `src/features/admin-exam-qbank/components/question-bank-table.tsx`

**Interfaces:**
- Consumes: `Question`, `ExamProgram` from Task 1; atoms from Task 3; `AdminDataTable` from `@/components/admin`; `ColumnDef` from `@tanstack/react-table`
- Produces: `QuestionBankTable({ questions: Question[]; programs: ExamProgram[]; isLoading?: boolean; onOpen: (q: Question) => void; onReview: (q: Question) => void; onSelectionChange: (selected: Question[]) => void })`

---

- [ ] **Step 1: Create QuestionBankTable**

Create `src/features/admin-exam-qbank/components/question-bank-table.tsx`:

```tsx
"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { QuestionTypeChip } from "./atoms/question-type-chip";
import { QuestionDiffPill } from "./atoms/question-diff-pill";
import { QuestionStatusBadge } from "./atoms/question-status-badge";
import type { Question, ExamProgram } from "../types/question-bank.types";

export interface QuestionBankTableProps {
  questions: Question[];
  programs: ExamProgram[];
  isLoading?: boolean;
  onOpen: (q: Question) => void;
  onReview: (q: Question) => void;
  onSelectionChange: (selected: Question[]) => void;
}

export function QuestionBankTable({
  questions,
  programs,
  isLoading,
  onOpen,
  onReview,
  onSelectionChange,
}: QuestionBankTableProps) {
  const progMap = Object.fromEntries(programs.map((p) => [p.id, p]));

  const columns: ColumnDef<Question>[] = [
    {
      id: "stem",
      header: "Câu hỏi",
      cell: ({ row }) => {
        const q = row.original;
        const prog = progMap[q.programId];
        return (
          <div className="min-w-0 max-w-xs">
            <p className="truncate text-sm font-medium text-foreground">
              {q.stem || "(chưa có nội dung)"}
            </p>
            {q.tagIds.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {q.tagIds.slice(0, 3).map((tid) => (
                  <span
                    key={tid}
                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {tid}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "type",
      header: "Dạng",
      size: 90,
      cell: ({ row }) => <QuestionTypeChip typeId={row.original.type} size="sm" />,
    },
    {
      id: "skill",
      header: "Kỹ năng",
      size: 80,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.skill}</span>
      ),
    },
    {
      id: "difficulty",
      header: "Độ khó",
      size: 70,
      cell: ({ row }) => <QuestionDiffPill value={row.original.difficulty} />,
    },
    {
      id: "program",
      header: "Chương trình",
      size: 90,
      cell: ({ row }) => {
        const prog = progMap[row.original.programId];
        return (
          <span
            className="text-xs font-semibold"
            style={{ color: prog?.color ?? "#64748B" }}
          >
            {prog?.code ?? row.original.programId}
          </span>
        );
      },
    },
    {
      id: "points",
      header: "Điểm",
      size: 50,
      cell: ({ row }) => (
        <span className="text-sm font-semibold">{row.original.points}</span>
      ),
    },
    {
      id: "status",
      header: "Trạng thái",
      size: 100,
      cell: ({ row }) => <QuestionStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      size: 90,
      cell: ({ row }) => {
        const q = row.original;
        if (q.status === "review") {
          return (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={(e) => { e.stopPropagation(); onReview(q); }}
            >
              Duyệt
            </Button>
          );
        }
        return (
          <button
            type="button"
            aria-label="Chỉnh sửa câu hỏi"
            onClick={(e) => { e.stopPropagation(); onOpen(q); }}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="size-3.5" />
          </button>
        );
      },
    },
  ];

  return (
    <AdminDataTable
      data={questions}
      columns={columns}
      isLoading={isLoading}
      emptyTitle="Không có câu hỏi"
      emptyDescription="Thử đổi bộ lọc hoặc tạo câu hỏi mới."
      onRowClick={onOpen}
      onSelectionChange={onSelectionChange}
    />
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/admin-exam-qbank/components/question-bank-table.tsx
git commit -m "feat(admin-exam-qbank): add QuestionBankTable wrapping AdminDataTable"
```

---

## Task 9: Dialogs

**Files:**
- Create: `src/features/admin-exam-qbank/components/new-question-dialog.tsx`
- Create: `src/features/admin-exam-qbank/components/review-question-dialog.tsx`
- Create: `src/features/admin-exam-qbank/components/group-editor-dialog.tsx`
- Create: `src/features/admin-exam-qbank/components/link-vocab-dialog.tsx`

**Interfaces:**
- Consumes: `Question`, `QuestionGroup`, `QuestionVocabItem`, `QuestionType`, `Skill` from Task 1; QB_TYPES, QB_PROGRAMS, QB_SKILLS registries from Task 1 mock; `QuestionPreview` from Task 7
- Produces:
  - `NewQuestionDialog({ open: boolean; onClose: () => void; onPick: (type: QuestionType) => void })`
  - `ReviewQuestionDialog({ open: boolean; q: Question | null; onClose: () => void; onApprove: (q: Question) => void; onReject: (q: Question) => void; onEdit: (q: Question) => void })`
  - `GroupEditorDialog({ open: boolean; initial: QuestionGroup | null | undefined; onClose: () => void; onSave: (g: QuestionGroup) => void; programs: ExamProgram[] })`
  - `LinkVocabDialog({ open: boolean; onClose: () => void; selected: string[]; onChange: (ids: string[]) => void; vocabItems: QuestionVocabItem[] })`

---

- [ ] **Step 1: Create NewQuestionDialog**

Create `src/features/admin-exam-qbank/components/new-question-dialog.tsx`:

```tsx
"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  CircleDot, CheckSquare, PencilLine, Shuffle, Scale,
  CheckCheck, ListOrdered, Type, FileText, Mic,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { QB_TYPE_REGISTRY } from "../mock/question-bank.mock";
import type { QuestionType } from "../types/question-bank.types";

const ICON_MAP: Record<string, React.ElementType> = {
  "circle-dot": CircleDot, "check-square": CheckSquare,
  "pencil-line": PencilLine, "shuffle": Shuffle, "scale": Scale,
  "check-check": CheckCheck, "list-ordered": ListOrdered,
  "type": Type, "file-text": FileText, "mic": Mic,
};

const QB_TYPES_LIST = Object.values(QB_TYPE_REGISTRY);

export interface NewQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onPick: (type: QuestionType) => void;
}

export function NewQuestionDialog({ open, onClose, onPick }: NewQuestionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo câu hỏi mới</DialogTitle>
          <DialogDescription>Chọn dạng câu hỏi để bắt đầu.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2.5 mt-2">
          {QB_TYPES_LIST.map((t) => {
            const Icon = ICON_MAP[t.icon];
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { onPick(t.id); onClose(); }}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-current hover:bg-[color-mix(in_srgb,var(--color)_5%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ "--color": t.color } as React.CSSProperties}
              >
                <span
                  className="size-8 shrink-0 rounded-lg flex items-center justify-center"
                  style={{ background: `${t.color}22`, color: t.color }}
                >
                  {Icon && <Icon className="size-4" aria-hidden />}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none mb-1">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Create ReviewQuestionDialog**

Create `src/features/admin-exam-qbank/components/review-question-dialog.tsx`:

```tsx
"use client";

import * as React from "react";
import { Pencil, X, Check } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionPreview } from "./question-preview";
import type { Question } from "../types/question-bank.types";

export interface ReviewQuestionDialogProps {
  open: boolean;
  q: Question | null;
  onClose: () => void;
  onApprove: (q: Question) => void;
  onReject: (q: Question) => void;
  onEdit: (q: Question) => void;
}

export function ReviewQuestionDialog({
  open, q, onClose, onApprove, onReject, onEdit,
}: ReviewQuestionDialogProps) {
  if (!q) return null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Duyệt câu hỏi</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-1">
          <QuestionPreview q={q} />
        </div>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { onEdit(q); onClose(); }}
          >
            <Pencil className="mr-1.5 size-3.5" aria-hidden />
            Sửa
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { onReject(q); onClose(); }}
            >
              <X className="mr-1.5 size-3.5" aria-hidden />
              Trả lại nháp
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => { onApprove(q); onClose(); }}
            >
              <Check className="mr-1.5 size-3.5" aria-hidden />
              Duyệt & xuất bản
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Create GroupEditorDialog**

Create `src/features/admin-exam-qbank/components/group-editor-dialog.tsx`:

```tsx
"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { QB_SKILL_REGISTRY } from "../mock/question-bank.mock";
import type { QuestionGroup, ExamProgram } from "../types/question-bank.types";

function makeBlankGroup(): QuestionGroup {
  return {
    id: `grp-new-${Date.now()}`,
    code: "", title: "",
    stimulusType: "passage",
    skill: "reading",
    programId: "p-ielts",
    mediaId: null,
    instructions: "",
    stimulus: "",
    questionIds: [],
    status: "draft",
    updatedAt: new Date().toLocaleDateString("vi-VN"),
  };
}

export interface GroupEditorDialogProps {
  open: boolean;
  initial: QuestionGroup | null | undefined;
  onClose: () => void;
  onSave: (g: QuestionGroup) => void;
  programs: ExamProgram[];
}

export function GroupEditorDialog({
  open, initial, onClose, onSave, programs,
}: GroupEditorDialogProps) {
  const [g, setG] = React.useState<QuestionGroup>(initial ?? makeBlankGroup());

  React.useEffect(() => {
    if (open) setG(initial ?? makeBlankGroup());
  }, [open, initial]);

  function upd(patch: Partial<QuestionGroup>) {
    setG((prev) => ({ ...prev, ...patch }));
  }

  const canSave = g.code.trim() !== "" && g.title.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Chỉnh sửa nhóm câu hỏi" : "Tạo nhóm câu hỏi"}
          </DialogTitle>
          <DialogDescription>
            Nhóm các câu hỏi chia sẻ chung ngữ liệu (đoạn văn / audio).
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <Label htmlFor="grp-code" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mã nhóm <span className="text-destructive">*</span>
            </Label>
            <Input id="grp-code" value={g.code} onChange={(e) => upd({ code: e.target.value })} placeholder="RD-RENEW-01" className="mt-1 h-9 text-sm" />
          </div>
          <div>
            <Label htmlFor="grp-title" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tiêu đề <span className="text-destructive">*</span>
            </Label>
            <Input id="grp-title" value={g.title} onChange={(e) => upd({ title: e.target.value })} placeholder="Đọc hiểu — Renewable Energy" className="mt-1 h-9 text-sm" />
          </div>

          <div>
            <Label htmlFor="grp-stimulus-type" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Loại ngữ liệu
            </Label>
            <Select value={g.stimulusType} onValueChange={(v) => upd({ stimulusType: v as QuestionGroup["stimulusType"] })}>
              <SelectTrigger id="grp-stimulus-type" className="mt-1 h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="passage">Đoạn văn (passage)</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="standalone">Độc lập</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="grp-skill" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Kỹ năng
            </Label>
            <Select value={g.skill} onValueChange={(v) => upd({ skill: v as QuestionGroup["skill"] })}>
              <SelectTrigger id="grp-skill" className="mt-1 h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {QB_SKILL_REGISTRY.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="grp-program" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Chương trình
            </Label>
            <Select value={g.programId} onValueChange={(v) => upd({ programId: v })}>
              <SelectTrigger id="grp-program" className="mt-1 h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-2">
          <Label htmlFor="grp-instructions" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Hướng dẫn
          </Label>
          <Input id="grp-instructions" value={g.instructions} onChange={(e) => upd({ instructions: e.target.value })} placeholder="Đọc đoạn văn và trả lời các câu hỏi…" className="mt-1 h-9 text-sm" />
        </div>

        {g.stimulusType !== "standalone" && (
          <div className="mt-2">
            <Label htmlFor="grp-stimulus" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {g.stimulusType === "audio" ? "Mô tả audio" : "Nội dung đoạn văn"}
            </Label>
            <Textarea
              id="grp-stimulus"
              value={g.stimulus}
              onChange={(e) => upd({ stimulus: e.target.value })}
              placeholder={g.stimulusType === "audio" ? "[Audio] mô tả…" : "Dán nội dung đoạn văn ngữ liệu…"}
              className="mt-1 min-h-24 text-sm"
            />
          </div>
        )}

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button disabled={!canSave} onClick={() => { onSave(g); onClose(); }}>Lưu nhóm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Create LinkVocabDialog**

Create `src/features/admin-exam-qbank/components/link-vocab-dialog.tsx`:

```tsx
"use client";

import * as React from "react";
import { Search, Check } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { QuestionVocabItem } from "../types/question-bank.types";

export interface LinkVocabDialogProps {
  open: boolean;
  onClose: () => void;
  selected: string[];
  onChange: (ids: string[]) => void;
  vocabItems: QuestionVocabItem[];
}

export function LinkVocabDialog({
  open, onClose, selected, onChange, vocabItems,
}: LinkVocabDialogProps) {
  const [search, setSearch] = React.useState("");

  const filtered = vocabItems.filter((v) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      v.word.toLowerCase().includes(s) ||
      v.meaning.toLowerCase().includes(s) ||
      v.reading.toLowerCase().includes(s)
    );
  });

  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Liên kết từ vựng</DialogTitle>
          <DialogDescription>
            Gắn câu hỏi với mục từ vựng để theo dõi &amp; gợi ý ôn tập.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm từ, phiên âm, nghĩa…"
            className="pl-8 h-9 text-sm"
          />
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1.5">
          {filtered.map((v) => {
            const on = selected.includes(v.id);
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => toggle(v.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                  on ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/40",
                )}
              >
                <span
                  className={cn(
                    "size-5 shrink-0 flex items-center justify-center rounded-md border-2 transition-colors",
                    on ? "border-green-500 bg-green-500" : "border-muted-foreground/40",
                  )}
                >
                  {on && <Check className="size-3 text-white" aria-hidden />}
                </span>
                <span className="min-w-16 font-bold text-base">{v.word}</span>
                <span className="min-w-20 text-xs text-muted-foreground">{v.reading}</span>
                <span className="text-sm text-muted-foreground">{v.meaning}</span>
                <span className="ml-auto text-[10px] uppercase text-muted-foreground">
                  {v.lang.split("-")[0]}
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Không tìm thấy từ phù hợp.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Xong ({selected.length})</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 5: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/admin-exam-qbank/components/new-question-dialog.tsx
git add src/features/admin-exam-qbank/components/review-question-dialog.tsx
git add src/features/admin-exam-qbank/components/group-editor-dialog.tsx
git add src/features/admin-exam-qbank/components/link-vocab-dialog.tsx
git commit -m "feat(admin-exam-qbank): add four dialogs — NewQuestion, Review, GroupEditor, LinkVocab"
```

---

## Task 10: GroupsView & TagSourceManager

**Files:**
- Create: `src/features/admin-exam-qbank/components/groups-view.tsx`
- Create: `src/features/admin-exam-qbank/components/tag-source-manager.tsx`

**Interfaces:**
- Consumes: `QuestionGroup`, `Question`, `QuestionTag`, `QuestionSource`, `ExamProgram` from Task 1; `GroupEditorDialog` from Task 9; atoms from Task 3
- Produces:
  - `GroupsView({ groups: QuestionGroup[]; questions: Question[]; programs: ExamProgram[]; onEdit: (g: QuestionGroup) => void; onNew: () => void; onOpenQuestion: (q: Question) => void })`
  - `TagSourceManager({ tags: QuestionTag[]; sources: QuestionSource[]; onTagsChange: (tags: QuestionTag[]) => void })`

---

- [ ] **Step 1: Create GroupsView**

Create `src/features/admin-exam-qbank/components/groups-view.tsx`:

```tsx
"use client";

import * as React from "react";
import { FileText, Headphones, LayoutGrid, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionTypeChip } from "./atoms/question-type-chip";
import { QuestionStatusBadge } from "./atoms/question-status-badge";
import type { QuestionGroup, Question, ExamProgram } from "../types/question-bank.types";

const STIMULUS_ICON: Record<QuestionGroup["stimulusType"], React.ElementType> = {
  passage: FileText,
  audio: Headphones,
  standalone: LayoutGrid,
};

export interface GroupsViewProps {
  groups: QuestionGroup[];
  questions: Question[];
  programs: ExamProgram[];
  onEdit: (g: QuestionGroup) => void;
  onNew: () => void;
  onOpenQuestion: (q: Question) => void;
}

export function GroupsView({
  groups, questions, programs, onEdit, onNew, onOpenQuestion,
}: GroupsViewProps) {
  const qById = Object.fromEntries(questions.map((q) => [q.id, q]));
  const progMap = Object.fromEntries(programs.map((p) => [p.id, p]));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onNew}>
          <Plus className="mr-1.5 size-4" aria-hidden />
          Tạo nhóm
        </Button>
      </div>

      {groups.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Chưa có nhóm câu hỏi nào.
        </p>
      )}

      {groups.map((g) => {
        const prog = progMap[g.programId];
        const Icon = STIMULUS_ICON[g.stimulusType];
        const groupQs = g.questionIds.map((id) => qById[id]).filter(Boolean) as Question[];

        return (
          <Card key={g.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span
                  className="size-10 shrink-0 rounded-xl flex items-center justify-center"
                  style={{
                    background: prog ? `${prog.color}20` : undefined,
                    color: prog?.color,
                  }}
                >
                  <Icon className="size-5" aria-hidden />
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-bold text-muted-foreground">
                      {g.code}
                    </code>
                    <span className="text-base font-semibold">{g.title}</span>
                    <QuestionStatusBadge status={g.status} />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span>{prog?.name ?? g.programId}</span>
                    <span>· {g.skill}</span>
                    <span>· {g.questionIds.length} câu hỏi</span>
                  </div>

                  {g.stimulus && (
                    <p className="mb-3 max-h-12 overflow-hidden rounded-lg bg-muted/40 px-3 py-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {g.stimulus}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {groupQs.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => onOpenQuestion(q)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground transition-colors max-w-[180px]"
                      >
                        <QuestionTypeChip typeId={q.type} size="sm" />
                        <span className="truncate">{q.stem || "(trống)"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(g)}
                  className="shrink-0"
                >
                  <Pencil className="mr-1 size-3.5" aria-hidden />
                  Sửa
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create TagSourceManager**

Create `src/features/admin-exam-qbank/components/tag-source-manager.tsx`:

```tsx
"use client";

import * as React from "react";
import { Tag, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { QuestionTag, QuestionSource } from "../types/question-bank.types";

const SOURCE_TYPE_TONE: Record<QuestionSource["type"], "default" | "outline" | "secondary"> = {
  licensed: "default",
  original: "secondary",
  adapted:  "outline",
};

export interface TagSourceManagerProps {
  tags: QuestionTag[];
  sources: QuestionSource[];
  onTagsChange: (tags: QuestionTag[]) => void;
}

export function TagSourceManager({ tags, sources, onTagsChange }: TagSourceManagerProps) {
  const [newTag, setNewTag] = React.useState("");

  function addTag() {
    const label = newTag.trim();
    if (!label) return;
    onTagsChange([...tags, { id: `tg-${Date.now()}`, label, usage: 0 }]);
    setNewTag("");
  }

  function deleteTag(id: string) {
    onTagsChange(tags.filter((t) => t.id !== id));
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {/* Tags */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Tags câu hỏi · exam_question_tags
          </p>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              placeholder="Tên tag mới…"
              className="h-9 text-sm"
            />
            <Button size="sm" onClick={addTag}>
              <Plus className="mr-1 size-3.5" aria-hidden />
              Thêm
            </Button>
          </div>

          <div className="space-y-2">
            {tags.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2"
              >
                <Tag className="size-3.5 text-muted-foreground shrink-0" aria-hidden />
                <span className="flex-1 text-sm font-semibold">{t.label}</span>
                <span className="text-[11px] text-muted-foreground">{t.usage} câu</span>
                <button
                  type="button"
                  aria-label={`Xóa tag ${t.label}`}
                  onClick={() => deleteTag(t.id)}
                  className="size-7 flex items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Nguồn nội dung · exam_question_sources
          </p>
          <div className="space-y-2">
            {sources.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold">{s.name}</span>
                  <Badge variant={SOURCE_TYPE_TONE[s.type]} className="text-[10px]">
                    {s.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{s.ref}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-1 size-3.5" aria-hidden />
            Thêm nguồn
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/admin-exam-qbank/components/groups-view.tsx
git add src/features/admin-exam-qbank/components/tag-source-manager.tsx
git commit -m "feat(admin-exam-qbank): add GroupsView and TagSourceManager"
```

---

## Task 11: QuestionEditorPanel

**Files:**
- Create: `src/features/admin-exam-qbank/components/question-editor-panel.tsx`

**Interfaces:**
- Consumes: `Question`, `ExamProgram`, `ExamRubric`, `QuestionVocabItem`, `QuestionType` from Task 1; all answer editors from Tasks 4–6; `QuestionPreview` from Task 7; `QuestionTypeChip`, `QuestionGradeChip`, `QuestionStatusBadge` from Task 3; `LinkVocabDialog` from Task 9; `QB_TYPE_REGISTRY`, `QB_RUBRICS`, `QB_SKILL_REGISTRY`, `QB_TAGS`, `QB_SOURCES` from Task 1 mock; `blankQuestion` from Task 1
- Produces: `QuestionEditorPanel({ initial: Question; onBack: () => void; onSave: (q: Question) => void; programs: ExamProgram[]; rubrics: ExamRubric[]; vocabItems: QuestionVocabItem[] })`

---

- [ ] **Step 1: Create QuestionEditorPanel**

Create `src/features/admin-exam-qbank/components/question-editor-panel.tsx`:

```tsx
"use client";

import * as React from "react";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  CircleDot, CheckSquare, PencilLine, Shuffle, Scale,
  CheckCheck, ListOrdered, Type, FileText, Mic,
} from "lucide-react";

import { ChoiceEditor } from "./answer-editors/choice-editor";
import { JudgeEditor } from "./answer-editors/judge-editor";
import { FillBlankEditor } from "./answer-editors/fill-blank-editor";
import { AnswerKeyEditor } from "./answer-editors/answer-key-editor";
import { MatchingPairEditor } from "./answer-editors/matching-pair-editor";
import { OrderingEditor } from "./answer-editors/ordering-editor";
import { OpenPromptEditor } from "./answer-editors/open-prompt-editor";
import { QuestionPreview } from "./question-preview";
import { QuestionTypeChip } from "./atoms/question-type-chip";
import { QuestionGradeChip } from "./atoms/question-grade-chip";
import { QuestionStatusBadge } from "./atoms/question-status-badge";
import { LinkVocabDialog } from "./link-vocab-dialog";
import { blankQuestion } from "../mock/blank-question";
import {
  QB_TYPE_REGISTRY, QB_SKILL_REGISTRY, QB_TAGS, QB_SOURCES,
} from "../mock/question-bank.mock";
import type {
  Question, QuestionType, ExamProgram, ExamRubric, QuestionVocabItem,
} from "../types/question-bank.types";

const ICON_MAP: Record<string, React.ElementType> = {
  "circle-dot": CircleDot, "check-square": CheckSquare, "pencil-line": PencilLine,
  "shuffle": Shuffle, "scale": Scale, "check-check": CheckCheck,
  "list-ordered": ListOrdered, "type": Type, "file-text": FileText, "mic": Mic,
};
const QB_TYPES_LIST = Object.values(QB_TYPE_REGISTRY);

function validateQuestion(q: Question): string[] {
  const errs: string[] = [];
  if (!q.stem.trim()) errs.push("Chưa nhập nội dung câu hỏi.");
  if ((q.type === "mcq" || q.type === "multi") && !(q.choices ?? []).some((c) => c.correct))
    errs.push("Chưa chọn đáp án đúng.");
  if ((q.type === "mcq" || q.type === "multi") && (q.choices ?? []).some((c) => !c.text.trim()))
    errs.push("Có lựa chọn bỏ trống.");
  if (q.type === "short" && !(q.answerKeys ?? []).some((a) => a.value.trim()))
    errs.push("Chưa nhập đáp án chấp nhận.");
  if (q.type === "fill" && (q.blanks ?? []).some((b) => !(b.accepted ?? []).length))
    errs.push("Có ô trống chưa có đáp án.");
  if ((q.type === "writing" || q.type === "speaking") && !q.rubricId)
    errs.push("Chưa gán rubric chấm điểm.");
  return errs;
}

export interface QuestionEditorPanelProps {
  initial: Question;
  onBack: () => void;
  onSave: (q: Question) => void;
  programs: ExamProgram[];
  rubrics: ExamRubric[];
  vocabItems: QuestionVocabItem[];
}

export function QuestionEditorPanel({
  initial, onBack, onSave, programs, rubrics, vocabItems,
}: QuestionEditorPanelProps) {
  const [q, setQ] = React.useState<Question>(initial);
  const [tab, setTab] = React.useState("content");
  const [vocabOpen, setVocabOpen] = React.useState(false);
  const isNew = initial.id.startsWith("q-new-");

  function upd(patch: Partial<Question>) {
    setQ((prev) => ({ ...prev, ...patch }));
  }

  function changeType(type: QuestionType) {
    setQ((prev) => ({
      ...blankQuestion(type),
      id: prev.id,
      skill: prev.skill,
      programId: prev.programId,
      difficulty: prev.difficulty,
      stem: prev.stem,
      groupId: prev.groupId,
      status: prev.status,
    }));
  }

  const errs = validateQuestion(q);
  const typeInfo = QB_TYPE_REGISTRY[q.type];
  const linkedVocab = vocabItems.filter((v) => (q.vocabIds ?? []).includes(v.id));

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Ngân hàng
        </button>

        <div className="flex flex-1 items-center gap-2 min-w-0">
          <QuestionTypeChip typeId={q.type} />
          <span className="text-lg font-bold tracking-tight">
            {isNew ? "Câu hỏi mới" : "Chỉnh sửa câu hỏi"}
          </span>
          <QuestionStatusBadge status={q.status} />
        </div>

        <QuestionGradeChip typeId={q.type} />
        <Button variant="outline" onClick={() => onSave({ ...q, status: "draft" })}>
          Lưu nháp
        </Button>
        <Button
          disabled={errs.length > 0}
          onClick={() => onSave({ ...q, status: "published" })}
        >
          Xuất bản
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px] items-start">
        {/* Left — tabbed editor */}
        <div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="content">Nội dung & đáp án</TabsTrigger>
              <TabsTrigger value="meta">Phân loại & nguồn</TabsTrigger>
              <TabsTrigger value="preview">Xem trước</TabsTrigger>
            </TabsList>

            {/* Content tab */}
            <TabsContent value="content">
              <Card>
                <CardContent className="p-5 space-y-5">
                  {/* Type picker */}
                  <div>
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Dạng câu hỏi <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {QB_TYPES_LIST.map((tt) => {
                        const Icon = ICON_MAP[tt.icon];
                        return (
                          <button
                            key={tt.id}
                            type="button"
                            title={tt.desc}
                            onClick={() => changeType(tt.id)}
                            className="flex flex-col items-center gap-1 rounded-lg border-[1.5px] px-2 py-2 text-[10px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            style={{
                              borderColor: q.type === tt.id ? tt.color : undefined,
                              backgroundColor: q.type === tt.id ? `${tt.color}10` : undefined,
                              color: q.type === tt.id ? tt.color : undefined,
                            }}
                          >
                            {Icon && <Icon className="size-4" aria-hidden />}
                            {tt.short}
                          </button>
                        );
                      })}
                    </div>
                    {typeInfo && (
                      <p className="mt-1.5 text-[11px] text-muted-foreground">{typeInfo.desc}</p>
                    )}
                  </div>

                  {/* Stem */}
                  <div>
                    <Label htmlFor="stem" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                      Nội dung câu hỏi (stem) <span className="text-destructive">*</span>
                      {q.type === "fill" && (
                        <span className="ml-2 normal-case font-normal text-muted-foreground">
                          — dùng {"{{1}}"}, {"{{2}}"} để đánh dấu ô trống
                        </span>
                      )}
                    </Label>
                    <Textarea
                      id="stem"
                      value={q.stem}
                      onChange={(e) => upd({ stem: e.target.value })}
                      placeholder="Nhập nội dung câu hỏi / đề bài…"
                      className="min-h-20 text-sm"
                    />
                  </div>

                  {/* Type-specific answer editor */}
                  {(q.type === "mcq" || q.type === "multi") && (
                    <ChoiceEditor
                      choices={q.choices ?? []}
                      multi={q.type === "multi"}
                      onChange={(c) => upd({ choices: c })}
                    />
                  )}
                  {q.type === "fill" && (
                    <FillBlankEditor
                      stem={q.stem}
                      blanks={q.blanks ?? []}
                      onChange={(b) => upd({ blanks: b })}
                    />
                  )}
                  {q.type === "matching" && (
                    <MatchingPairEditor
                      pairs={q.pairs ?? []}
                      onChange={(p) => upd({ pairs: p })}
                    />
                  )}
                  {q.type === "ordering" && (
                    <OrderingEditor
                      items={q.orderItems ?? []}
                      onChange={(o) => upd({ orderItems: o })}
                    />
                  )}
                  {(q.type === "tfng" || q.type === "ynng") && (
                    <JudgeEditor
                      type={q.type}
                      value={q.judgeAnswer ?? ""}
                      onChange={(v) => upd({ judgeAnswer: v, answerKeys: [{ value: v }] })}
                    />
                  )}
                  {q.type === "short" && (
                    <AnswerKeyEditor
                      answerKeys={q.answerKeys ?? []}
                      onChange={(a) => upd({ answerKeys: a })}
                      maxWords={q.maxWords}
                      onMaxWords={(n) => upd({ maxWords: n })}
                    />
                  )}
                  {(q.type === "writing" || q.type === "speaking") && (
                    <OpenPromptEditor
                      type={q.type}
                      draft={q}
                      onChange={(patch) => upd(patch)}
                      rubrics={rubrics}
                    />
                  )}

                  {/* Explanation */}
                  <div>
                    <Label htmlFor="explanation" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                      Giải thích đáp án
                    </Label>
                    <Textarea
                      id="explanation"
                      value={q.explanation}
                      onChange={(e) => upd({ explanation: e.target.value })}
                      placeholder="Giải thích vì sao đáp án đúng (hiển thị sau khi học viên trả lời)."
                      className="min-h-16 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Meta tab */}
            <TabsContent value="meta">
              <Card>
                <CardContent className="p-5 space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    {/* Program */}
                    <div>
                      <Label htmlFor="program" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                        Chương trình
                      </Label>
                      <Select value={q.programId} onValueChange={(v) => upd({ programId: v })}>
                        <SelectTrigger id="program" className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {programs.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Skill */}
                    <div>
                      <Label htmlFor="skill" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                        Kỹ năng
                      </Label>
                      <Select value={q.skill} onValueChange={(v) => upd({ skill: v as Question["skill"] })}>
                        <SelectTrigger id="skill" className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {QB_SKILL_REGISTRY.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <Label htmlFor="difficulty" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                        Độ khó
                      </Label>
                      <Select value={q.difficulty} onValueChange={(v) => upd({ difficulty: v as Question["difficulty"] })}>
                        <SelectTrigger id="difficulty" className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Dễ</SelectItem>
                          <SelectItem value="medium">Trung bình</SelectItem>
                          <SelectItem value="hard">Khó</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Points */}
                    <div>
                      <Label htmlFor="points" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                        Điểm
                      </Label>
                      <Input
                        id="points"
                        type="number"
                        min={0}
                        step={0.5}
                        value={q.points}
                        onChange={(e) => upd({ points: Number(e.target.value) })}
                        className="h-9 text-sm"
                      />
                    </div>

                    {/* Source */}
                    <div className="col-span-2">
                      <Label htmlFor="source" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                        Nguồn nội dung
                      </Label>
                      <Select value={q.sourceId || ""} onValueChange={(v) => upd({ sourceId: v })}>
                        <SelectTrigger id="source" className="h-9 text-sm"><SelectValue placeholder="— Không gắn nguồn —" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">— Không gắn nguồn —</SelectItem>
                          {QB_SOURCES.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} ({s.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {QB_TAGS.map((tg) => {
                        const on = (q.tagIds ?? []).includes(tg.id);
                        return (
                          <button
                            key={tg.id}
                            type="button"
                            onClick={() =>
                              upd({
                                tagIds: on
                                  ? (q.tagIds ?? []).filter((x) => x !== tg.id)
                                  : [...(q.tagIds ?? []), tg.id],
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
                            style={{
                              borderColor: on ? "var(--primary)" : undefined,
                              backgroundColor: on ? "#ECFDF5" : undefined,
                              color: on ? "#16A34A" : undefined,
                            }}
                          >
                            {tg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vocab */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Từ vựng liên kết
                      </p>
                      <Button variant="ghost" size="sm" onClick={() => setVocabOpen(true)}>
                        Liên kết
                      </Button>
                    </div>
                    {linkedVocab.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {linkedVocab.map((v) => (
                          <span
                            key={v.id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-sm"
                          >
                            <span className="font-bold">{v.word}</span>
                            <span className="text-xs text-muted-foreground">{v.meaning}</span>
                            <button
                              type="button"
                              aria-label={`Xóa liên kết ${v.word}`}
                              onClick={() =>
                                upd({ vocabIds: (q.vocabIds ?? []).filter((x) => x !== v.id) })
                              }
                              className="text-muted-foreground hover:text-destructive"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Chưa liên kết từ vựng nào.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <QuestionPreview q={q} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right rail — sticky */}
        <div className="space-y-4 lg:sticky lg:top-4">
          {/* Validation */}
          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Kiểm tra
              </p>
              {errs.length === 0 ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <CheckCircle className="size-4" aria-hidden />
                  Sẵn sàng xuất bản
                </div>
              ) : (
                <ul className="space-y-2">
                  {errs.map((e, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-snug">
                      <AlertCircle className="size-3.5 text-amber-500 shrink-0 mt-0.5" aria-hidden />
                      {e}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Tóm tắt
              </p>
              {[
                ["Chương trình", programs.find((p) => p.id === q.programId)?.name ?? q.programId],
                ["Kỹ năng", QB_SKILL_REGISTRY.find((s) => s.id === q.skill)?.name ?? q.skill],
                ["Chấm điểm", typeInfo?.auto ? "Tự động" : "Rubric"],
                ["Điểm", String(q.points)],
                ["Tags", String((q.tagIds ?? []).length)],
                ["Từ vựng", String((q.vocabIds ?? []).length)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border py-1.5 text-sm last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <LinkVocabDialog
        open={vocabOpen}
        onClose={() => setVocabOpen(false)}
        selected={q.vocabIds ?? []}
        onChange={(ids) => upd({ vocabIds: ids })}
        vocabItems={vocabItems}
      />
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/admin-exam-qbank/components/question-editor-panel.tsx
git commit -m "feat(admin-exam-qbank): add QuestionEditorPanel — full-page editor for all 10 types"
```

---

## Task 12: QuestionBankClient, page route, and nav update

**Files:**
- Create: `src/features/admin-exam-qbank/components/question-bank-client.tsx`
- Create: `src/app/(admin)/admin/exams/question-bank/page.tsx`
- Modify: `src/app/(admin)/admin-shell-provider.tsx`

**Interfaces:**
- Consumes: `QuestionBankMock` from Task 1; `useQuestionBankFilters` from Task 2; all display components from Tasks 3–11; `FilterToolbar`, `BulkActionToolbar`, `PageHeader` from `@/components/admin` and `@/components/layouts`; `Tabs` from shadcn
- Produces: `QuestionBankClient({ mock: QuestionBankMock })`, page at `/admin/exams/question-bank`

---

- [ ] **Step 1: Create QuestionBankClient**

Create `src/features/admin-exam-qbank/components/question-bank-client.tsx`:

```tsx
"use client";

import * as React from "react";
import { Plus, CheckCircle, Clock, Database, FileEdit } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FilterToolbar } from "@/components/admin/filter-toolbar";
import { BulkActionToolbar } from "@/components/admin/bulk-action-toolbar";
import { PageHeader } from "@/components/layouts/page-header";
import type { AdminFilterField } from "@/components/admin/types";

import { useQuestionBankFilters } from "../hooks/use-question-bank-filters";
import { QuestionBankTable } from "./question-bank-table";
import { QuestionEditorPanel } from "./question-editor-panel";
import { GroupsView } from "./groups-view";
import { TagSourceManager } from "./tag-source-manager";
import { NewQuestionDialog } from "./new-question-dialog";
import { ReviewQuestionDialog } from "./review-question-dialog";
import { GroupEditorDialog } from "./group-editor-dialog";
import { blankQuestion } from "../mock/blank-question";
import type {
  QuestionBankMock, Question, QuestionGroup, QuestionTag, QuestionType,
} from "../types/question-bank.types";

const FILTER_FIELDS: AdminFilterField[] = [
  { id: "search", type: "search", label: "Tìm kiếm", placeholder: "Tìm nội dung câu hỏi…" },
  {
    id: "type", type: "select", label: "Dạng",
    options: [
      { value: "mcq",      label: "Trắc nghiệm" },
      { value: "multi",    label: "Chọn nhiều"  },
      { value: "fill",     label: "Điền từ"     },
      { value: "matching", label: "Ghép đôi"    },
      { value: "tfng",     label: "TFNG"        },
      { value: "ynng",     label: "YNNG"        },
      { value: "ordering", label: "Sắp xếp"     },
      { value: "short",    label: "Trả lời ngắn"},
      { value: "writing",  label: "Bài viết"    },
      { value: "speaking", label: "Nói"         },
    ],
  },
  {
    id: "skill", type: "select", label: "Kỹ năng",
    options: [
      { value: "listening", label: "Nghe"     },
      { value: "reading",   label: "Đọc"      },
      { value: "writing",   label: "Viết"     },
      { value: "speaking",  label: "Nói"      },
      { value: "grammar",   label: "Ngữ pháp" },
      { value: "vocab",     label: "Từ vựng"  },
    ],
  },
  {
    id: "program", type: "select", label: "Chương trình",
    options: [
      { value: "p-ielts", label: "IELTS" },
      { value: "p-toeic", label: "TOEIC" },
      { value: "p-hsk",   label: "HSK"   },
      { value: "p-jlpt",  label: "JLPT"  },
    ],
  },
  {
    id: "status", type: "select", label: "Trạng thái",
    options: [
      { value: "published", label: "Đã xuất bản" },
      { value: "review",    label: "Chờ duyệt"   },
      { value: "draft",     label: "Bản nháp"    },
    ],
  },
];

export interface QuestionBankClientProps {
  mock: QuestionBankMock;
}

export function QuestionBankClient({ mock }: QuestionBankClientProps) {
  const [questions, setQuestions] = React.useState(mock.questions);
  const [groups, setGroups] = React.useState(mock.groups);
  const [tags, setTags] = React.useState(mock.tags);

  const {
    filters, setFilters, clearFilters,
    filtered, paginated,
    page, totalPages, setPage,
    selectedIds, toggleSelect, selectAll, clearSelection,
    statusCounts,
  } = useQuestionBankFilters(questions, groups);

  const [mainTab, setMainTab] = React.useState("questions");
  const [editing, setEditing] = React.useState<Question | null>(null);
  const [newOpen, setNewOpen] = React.useState(false);
  const [reviewQ, setReviewQ] = React.useState<Question | null>(null);
  // undefined = dialog closed; null = creating new; QuestionGroup = editing
  const [grpEdit, setGrpEdit] = React.useState<QuestionGroup | null | undefined>(undefined);

  function saveQuestion(q: Question) {
    setQuestions((prev) =>
      prev.some((x) => x.id === q.id)
        ? prev.map((x) => (x.id === q.id ? q : x))
        : [q, ...prev],
    );
    setEditing(null);
  }

  // Full-page editor takeover
  if (editing) {
    return (
      <QuestionEditorPanel
        initial={editing}
        onBack={() => setEditing(null)}
        onSave={saveQuestion}
        programs={mock.programs}
        rubrics={mock.rubrics}
        vocabItems={mock.vocabItems}
      />
    );
  }

  const counts = statusCounts;
  const statTiles = [
    { key: "Tổng câu hỏi",  value: counts["all"],       icon: Database,     color: "#6366F1" },
    { key: "Đã xuất bản",   value: counts["published"],  icon: CheckCircle,  color: "#16A34A" },
    { key: "Chờ duyệt",     value: counts["review"],     icon: Clock,        color: "#D97706" },
    { key: "Bản nháp",      value: counts["draft"],      icon: FileEdit,     color: "#64748B" },
  ];

  const bulkActions = [
    {
      id: "publish",
      label: "Xuất bản",
      variant: "default" as const,
      icon: <CheckCircle className="size-3.5" aria-hidden />,
      onClick: (ids: string[]) => {
        setQuestions((prev) =>
          prev.map((q) => (ids.includes(q.id) ? { ...q, status: "published" as const } : q)),
        );
        clearSelection();
      },
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Ngân hàng câu hỏi"
        description={`${questions.length} câu hỏi · ${groups.length} nhóm · 10 dạng câu hỏi`}
        actions={[{
          label: "Tạo câu hỏi",
          icon: <Plus className="size-4" aria-hidden />,
          onClick: () => setNewOpen(true),
        }]}
      />

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statTiles.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.key}>
              <CardContent className="flex items-center gap-3 p-4">
                <span
                  className="size-9 shrink-0 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}20`, color: s.color }}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-xl font-extrabold tracking-tight leading-none">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.key}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main tabs */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList>
          <TabsTrigger value="questions">Câu hỏi</TabsTrigger>
          <TabsTrigger value="groups">Nhóm câu hỏi</TabsTrigger>
          <TabsTrigger value="meta">Tags & Nguồn</TabsTrigger>
        </TabsList>

        {/* Questions tab */}
        <TabsContent value="questions" className="mt-4 space-y-3">
          <BulkActionToolbar
            selectedCount={selectedIds.length}
            selectedIds={selectedIds}
            actions={bulkActions}
            onClearSelection={clearSelection}
          />
          <FilterToolbar
            filters={filters}
            fields={FILTER_FIELDS}
            onFilterChange={setFilters}
            onClear={clearFilters}
            resultCount={filtered.length}
          />
          <QuestionBankTable
            questions={paginated}
            programs={mock.programs}
            onOpen={setEditing}
            onReview={setReviewQ}
            onSelectionChange={(rows) => {
              // Sync AdminDataTable's internal selection state to our selectedIds
              const ids = rows.map((r) => r.id);
              // Replace selection entirely (AdminDataTable manages its own row state)
              // We only use selectedIds for bulk actions — derive from AdministrationTable callback
              // Store locally so BulkActionToolbar can use them:
              clearSelection();
              ids.forEach((id) => toggleSelect(id));
            }}
          />
        </TabsContent>

        {/* Groups tab */}
        <TabsContent value="groups" className="mt-4">
          <GroupsView
            groups={groups}
            questions={questions}
            programs={mock.programs}
            onEdit={(g) => setGrpEdit(g)}
            onNew={() => setGrpEdit(null)}
            onOpenQuestion={setEditing}
          />
        </TabsContent>

        {/* Tags & sources tab */}
        <TabsContent value="meta" className="mt-4">
          <TagSourceManager
            tags={tags}
            sources={mock.sources}
            onTagsChange={setTags}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NewQuestionDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onPick={(type: QuestionType) => setEditing(blankQuestion(type))}
      />
      <ReviewQuestionDialog
        open={!!reviewQ}
        q={reviewQ}
        onClose={() => setReviewQ(null)}
        onApprove={(q) => {
          setQuestions((prev) =>
            prev.map((x) => (x.id === q.id ? { ...x, status: "published" as const } : x)),
          );
          setReviewQ(null);
        }}
        onReject={(q) => {
          setQuestions((prev) =>
            prev.map((x) => (x.id === q.id ? { ...x, status: "draft" as const } : x)),
          );
          setReviewQ(null);
        }}
        onEdit={(q) => { setEditing(q); setReviewQ(null); }}
      />
      <GroupEditorDialog
        open={grpEdit !== undefined}
        initial={grpEdit ?? null}
        onClose={() => setGrpEdit(undefined)}
        onSave={(g) => {
          setGroups((prev) =>
            prev.some((x) => x.id === g.id)
              ? prev.map((x) => (x.id === g.id ? g : x))
              : [g, ...prev],
          );
          setGrpEdit(undefined);
        }}
        programs={mock.programs}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create the page route**

```bash
mkdir -p /Users/vanhuu/Documents/freelance/lexi-web-English/lexipath-frontend/src/app/\(admin\)/admin/exams/question-bank
```

Create `src/app/(admin)/admin/exams/question-bank/page.tsx`:

```tsx
import type { Metadata } from "next";
import { QUESTION_BANK_MOCK } from "@/features/admin-exam-qbank/mock/question-bank.mock";
import { QuestionBankClient } from "@/features/admin-exam-qbank/components/question-bank-client";

export const metadata: Metadata = { title: "Ngân hàng câu hỏi" };

export default function AdminQuestionBankPage() {
  return <QuestionBankClient mock={QUESTION_BANK_MOCK} />;
}
```

- [ ] **Step 3: Update the admin nav**

Open `src/app/(admin)/admin-shell-provider.tsx`.

Change the `"admin-questions"` nav item href and update `getActiveNavId`:

```tsx
// In ADMIN_NAV — change href for the "Câu hỏi" item:
{
  id: "admin-questions",
  label: "Câu hỏi",
  icon: <FileQuestion aria-hidden />,
  href: "/admin/exams/question-bank" as Route,
},

// In getActiveNavId — change the condition:
if (pathname.startsWith("/admin/exams/question-bank")) return "admin-questions";
```

- [ ] **Step 4: Update index.ts to export client**

Edit `src/features/admin-exam-qbank/index.ts` to add:

```typescript
export * from "./components/question-bank-client";
```

- [ ] **Step 5: Run lint and typecheck**

```bash
npm run lint && npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Run all tests**

```bash
npx vitest run src/features/admin-exam-qbank/
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/features/admin-exam-qbank/
git add src/app/\(admin\)/admin/exams/
git add src/app/\(admin\)/admin-shell-provider.tsx
git commit -m "feat(admin-exam-qbank): wire QuestionBankClient, page route, and nav update

- Full question bank screen at /admin/exams/question-bank
- Three-tab layout: Câu hỏi | Nhóm câu hỏi | Tags & Nguồn
- Stat tiles, filter toolbar, bulk actions, full-page editor
- Nav updated from /admin/questions → /admin/exams/question-bank"
```

---

## Self-Review Checklist

After all 12 tasks complete, verify against the spec:

| Spec requirement | Task |
|---|---|
| Route `/admin/exams/question-bank` | T12 |
| Nav updated | T12 |
| Types + mapping constants | T1 |
| Mock data (13 questions, 5 groups, 8 tags, 5 sources, 4 programs, 3 rubrics) | T1 |
| blankQuestion factory (all 10 types) + tests | T1 |
| Filter hook + tests | T2 |
| QuestionTypeChip, DiffPill, GradeChip, StatusBadge | T3 |
| ChoiceEditor (MCQ/Multi) | T4 |
| JudgeEditor (TFNG/YNNG) | T4 |
| FillBlankEditor | T5 |
| AnswerKeyEditor (Short) | T5 |
| MatchingPairEditor | T6 |
| OrderingEditor | T6 |
| OpenPromptEditor (Writing/Speaking) | T6 |
| QuestionPreview (all 10 types) | T7 |
| QuestionBankTable (AdminDataTable) | T8 |
| NewQuestionDialog | T9 |
| ReviewQuestionDialog | T9 |
| GroupEditorDialog | T9 |
| LinkVocabDialog | T9 |
| GroupsView | T10 |
| TagSourceManager | T10 |
| QuestionEditorPanel (full-page takeover) | T11 |
| QuestionBankClient (stat tiles, 3 tabs, dialogs) | T12 |
| Lint/typecheck pass | Every task |
| No API calls, no TanStack Query, no Zustand | All tasks |
| Vietnamese product copy | All tasks |
| Accessibility (aria-label, dialog titles, form labels) | T3–T12 |
