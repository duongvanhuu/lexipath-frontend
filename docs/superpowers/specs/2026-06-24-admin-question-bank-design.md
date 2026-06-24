# Admin Question Bank — Design Spec

**Date:** 2026-06-24  
**Route:** `/admin/exams/question-bank`  
**Feature:** `admin-exam-qbank`  
**Design source:** `LexiPath Web Design /screens_admin_exam_qbank*.jsx`, `screens_admin_exam_media.jsx`, `data_exam_qbank.jsx`, `data_exam_admin.jsx`  
**Screenshots:** `admin-questions` folder — all viewports show login placeholder, **unusable**. Design JSX is authoritative.

---

## 1. Purpose

Admin tool for managing the LexiPath exam question bank:

- Browse, filter, search, and bulk-act on questions.
- Create and edit questions for 10 question types, each with a dedicated answer editor.
- Organise questions into groups (shared stimulus: passage / audio / standalone).
- Manage question tags and content sources.
- Preview how a question renders for learners.

---

## 2. Route & Navigation

```
URL:   /admin/exams/question-bank
File:  src/app/(admin)/admin/exams/question-bank/page.tsx
```

**Admin nav update** (`admin-shell-provider.tsx`):
- Change `"Câu hỏi"` href from `/admin/questions` → `/admin/exams/question-bank`.
- Update `getActiveNavId` to match `pathname.startsWith("/admin/exams/question-bank")`.
- No redirect needed from `/admin/questions` (not yet live).

**Domain grouping** — scales to:
```
/admin/exams/question-bank
/admin/exams/test-builder
/admin/exams/programs
/admin/exams/blueprints
/admin/exams/scoring
```

---

## 3. Feature Folder Structure

```
src/features/admin-exam-qbank/
  types/
    question-bank.types.ts        ← QuestionType, Question, QuestionGroup, …
  mock/
    question-bank.mock.ts         ← QB_QUESTIONS, QB_GROUPS, QB_TAGS, QB_SOURCES, EA_PROGRAMS, QB_RUBRICS
  components/
    question-bank-client.tsx      ← "use client" root — tab/filter/editing state
    question-bank-table.tsx       ← question table using AdminDataTable
    question-editor-panel.tsx     ← full-page editor, "use client"
    question-preview.tsx          ← renders question as learner sees it
    groups-view.tsx               ← group cards list
    tag-source-manager.tsx        ← tags + sources two-column manager
    new-question-dialog.tsx       ← type-picker grid dialog
    review-question-dialog.tsx    ← preview + approve/reject/edit dialog
    group-editor-dialog.tsx       ← group create/edit form dialog
    link-vocab-dialog.tsx         ← vocab search + toggle link dialog
    answer-editors/
      choice-editor.tsx           ← MCQ / Multi (correct toggle, add/delete)
      fill-blank-editor.tsx       ← {{n}} blank slots + accepted answers
      matching-pair-editor.tsx    ← left ↔ right pair builder
      ordering-editor.tsx         ← items with reorder controls
      judge-editor.tsx            ← TFNG / YNNG three-button toggle
      answer-key-editor.tsx       ← short answer accepted variants + max words
      open-prompt-editor.tsx      ← writing / speaking rubric config
    atoms/
      question-type-chip.tsx      ← small colored chip with icon + short name
      question-diff-pill.tsx      ← difficulty text in matching color
      question-grade-chip.tsx     ← auto-grade vs rubric indicator
  index.ts
```

---

## 4. Data & Types

### 4.1 Core Types (`question-bank.types.ts`)

```ts
type QuestionStatus = "draft" | "review" | "published";
type QuestionType = "mcq" | "multi" | "fill" | "matching" | "tfng" | "ynng" | "ordering" | "short" | "writing" | "speaking";
type Skill = "listening" | "reading" | "writing" | "speaking" | "grammar" | "vocab";
type Difficulty = "easy" | "medium" | "hard";

interface QuestionChoice { key: string; text: string; correct: boolean; }
interface QuestionBlank { pos: number; accepted: string[]; caseSensitive: boolean; }
interface MatchingPair { left: string; right: string; }
interface OrderItem { text: string; correctPos: number; }
interface AnswerKey { value: string; }

interface Question {
  id: string; type: QuestionType; skill: Skill; programId: string;
  difficulty: Difficulty; points: number; status: QuestionStatus;
  stem: string; explanation: string;
  groupId: string | null; tagIds: string[]; sourceId: string; vocabIds: string[];
  updatedAt: string;
  // type-specific (optional):
  choices?: QuestionChoice[];       // mcq, multi
  blanks?: QuestionBlank[];         // fill
  pairs?: MatchingPair[];           // matching
  orderItems?: OrderItem[];         // ordering
  judgeAnswer?: string;             // tfng, ynng
  answerKeys?: AnswerKey[];         // short, tfng, ynng
  maxWords?: number;                // short
  rubricId?: string;                // writing, speaking
  minWords?: number;                // writing
  suggestedTime?: number;           // writing, speaking
  prepTime?: number;                // speaking
}

interface QuestionGroup {
  id: string; code: string; title: string;
  stimulusType: "passage" | "audio" | "standalone";
  skill: Skill; programId: string; mediaId: string | null;
  instructions: string; stimulus: string;
  questionIds: string[]; status: QuestionStatus; updatedAt: string;
}

interface QuestionTag { id: string; label: string; usage: number; }
interface QuestionSource { id: string; name: string; type: "licensed" | "original" | "adapted"; ref: string; }
interface ExamProgram { id: string; code: string; name: string; color: string; }
interface ExamRubric { id: string; name: string; programId: string; scaleMax: number; status: QuestionStatus; }
```

### 4.2 Mock Data

Sourced from `data_exam_qbank.jsx` and `data_exam_admin.jsx`. No backend endpoint — mock data lives in `mock/question-bank.mock.ts`. Shape closely follows the database tables:

```
questions → exam_questions + exam_question_choices + exam_answer_keys + exam_question_blanks + exam_matching_pairs
groups → exam_question_groups
tags → exam_question_tags
sources → exam_question_sources (links to content_sources)
programs → exam_programs
rubrics → exam_rubrics
```

### 4.3 `blankQuestion(type)` factory

Each question type has a valid default structure (blank choices, blank blanks, etc.) used when creating a new question. Implemented as a pure function in types or utils.

---

## 5. Main Screen (`QuestionBankClient`)

### 5.1 Page Header
- Title: "Ngân hàng câu hỏi"
- Description: "{total} câu hỏi · {groups} nhóm · 10 dạng câu hỏi"
- Primary CTA: "Tạo câu hỏi" → opens `NewQuestionDialog`

### 5.2 Stat Tiles (4-column grid)
| Key | Icon | Color |
|---|---|---|
| Tổng câu hỏi | database | secondary |
| Đã xuất bản | check-circle | green |
| Chờ duyệt | clock | amber |
| Bản nháp | file-edit | muted |

### 5.3 Tabs
`Câu hỏi` | `Nhóm câu hỏi` | `Tags & Nguồn`

### 5.4 Questions Tab
- `BulkActionToolbar` (renders only when selection > 0): "N câu đã chọn", Xuất bản, Gán tag, Bỏ chọn
- `FilterToolbar` fields: search (stem text), type (10 types + Tất cả), skill (6 + Tất cả), program (IELTS/TOEIC/HSK/JLPT + Tất cả), status (3 + Tất cả)
- `QuestionBankTable` (wraps `AdminDataTable`):
  - Columns: checkbox | stem + tag pills + vocab link count | type chip | skill | difficulty | program | points | status badge | action
  - Click row → full editor takeover
  - "Duyệt" button on `review` rows → `ReviewQuestionDialog`
  - Pencil button on other rows → editor

### 5.5 Groups Tab (`GroupsView`)
- "Tạo nhóm" button → `GroupEditorDialog`
- Cards: icon (by stimulusType), code + title + status, program + skill + question count, stimulus text (truncated), question chips (click → opens editor)
- Edit button → `GroupEditorDialog` pre-filled

### 5.6 Tags & Nguồn Tab (`TagSourceManager`)
- Left column: tag list with usage counts, add-new input, delete button per tag
- Right column: source list with type badge + ref, "Thêm nguồn" button (toast demo)

---

## 6. Question Editor Panel (`QuestionEditorPanel`)

Full content-area takeover — no URL change, back button returns to bank.

### 6.1 Header Bar
```
[← Ngân hàng] [TypeChip] [Chỉnh sửa câu hỏi | Câu hỏi mới] [StatusBadge]  ·  [GradeChip]  [Lưu nháp]  [Xuất bản ✓]
```
- "Lưu nháp" → saves with `status: "draft"`
- "Xuất bản" → saves with `status: "published"`, disabled when validation errors exist

### 6.2 Two-Column Layout
- Left (`1fr`): tabs
- Right (`280px`, `sticky top-2`): validation + summary cards

### 6.3 Left Tabs

**Nội dung & đáp án:**
- Type picker: 10-button grid, colored border+bg on active, title with icon
- Stem textarea (`{{n}}` hint for fill type)
- Type-specific answer editor (see §7)
- Explanation textarea

**Phân loại & nguồn:**
- 3-column grid: Chương trình, Kỹ năng, Độ khó
- Row 2: Điểm, Nguồn (spans 2 cols)
- Tags section: toggle chips (green when selected)
- Vocab section: linked vocab chips + `LinkVocabDialog` trigger

**Xem trước:** renders `QuestionPreview`

### 6.4 Right Rail

**Kiểm tra card:** list of validation errors (icon + message), or green "Sẵn sàng xuất bản" when no errors.

**Tóm tắt card:** read-only rows: Chương trình, Kỹ năng, Chấm điểm (Tự động / Rubric), Điểm, Tags count, Từ vựng count.

---

## 7. Answer Editors (per type)

| Type | Component | Data fields |
|---|---|---|
| MCQ | `ChoiceEditor` (multi=false) | choices[]: { key, text, correct } |
| Multi | `ChoiceEditor` (multi=true) | choices[]: multiple correct |
| Fill | `FillBlankEditor` | blanks[]: { pos, accepted[], caseSensitive } |
| Matching | `MatchingPairEditor` | pairs[]: { left, right } |
| Ordering | `OrderingEditor` | orderItems[]: { text, correctPos } |
| TFNG | `JudgeEditor` (type="tfng") | judgeAnswer: "true"/"false"/"ng" |
| YNNG | `JudgeEditor` (type="ynng") | judgeAnswer: "yes"/"no"/"ng" |
| Short | `AnswerKeyEditor` | answerKeys[], maxWords |
| Writing | `OpenPromptEditor` | rubricId, minWords, suggestedTime |
| Speaking | `OpenPromptEditor` | rubricId, suggestedTime, prepTime |

---

## 8. Dialogs

### NewQuestionDialog
- 2-column grid of 10 type cards (icon + name + desc), colored hover border
- Pick type → opens editor with blank question

### ReviewQuestionDialog
- Shows `QuestionPreview` for the question
- Footer: Sửa | Trả lại nháp | Duyệt & xuất bản

### GroupEditorDialog
- 2-column grid: code, title, stimulusType, skill, program, (conditional) mediaId if audio
- Instructions field, stimulus textarea (conditional on type ≠ standalone)

### LinkVocabDialog (Sheet / Dialog 560px wide)
- Search input
- Scrollable list of vocab items: checkbox, word (CJK font), reading, meaning, lang badge
- Footer: "Xong (N)"

---

## 9. QuestionPreview

Read-only, renders question as learner sees it. Per type:

- **MCQ/Multi:** choices with circle/checkbox, green correct highlight
- **TFNG/YNNG:** 3 equal-width buttons, green + check on correct answer
- **Matching:** left items → arrow → right items
- **Ordering:** numbered items in correct order
- **Fill:** stem with blank slots rendered inline, blanks listed below with `{{n}} → accepted values`
- **Short:** "Đáp án chấp nhận" badge list
- **Writing/Speaking:** purple info callout with rubric name + min words / time
- Explanation section (dashed top border) when present

---

## 10. Atom Components

### QuestionTypeChip
- Small pill: colored bg (type.color + 14 opacity), type icon, short name
- `size="sm"` variant

### QuestionDiffPill
- Text-only, colored by difficulty (blue/amber/red)

### QuestionGradeChip
- "⚡ Tự chấm" (green) or "✓ Rubric" (purple)

---

## 11. Existing Components Reused

| Component | Where used |
|---|---|
| `FilterToolbar` | Questions tab |
| `AdminDataTable` | `QuestionBankTable` |
| `BulkActionToolbar` | Questions tab bulk bar |
| `PageHeader` | Main screen header |
| `DetailDrawer` | NOT used (editor is full-page takeover) |
| `ContentStatusBadge` | `QuestionStatusBadge` wraps it |
| `Dialog` (shadcn) | All 4 dialogs |
| `Tabs` (shadcn) | Main screen + editor |
| `Card` (shadcn) | Stat tiles, right rail, group cards |
| `Badge` (shadcn) | Tags, type chips, etc. |
| `Button` (shadcn) | All CTAs |
| `Checkbox` (shadcn) | Table row selection + choice editor |
| `Textarea`, `Input`, `Select` | Editor fields |

---

## 12. Client / Server Boundaries

| File | Boundary | Reason |
|---|---|---|
| `page.tsx` | Server Component | Passes mock data as props |
| `question-bank-client.tsx` | `"use client"` | Tab/filter/selection/editing state |
| `question-editor-panel.tsx` | `"use client"` | Form state |
| All answer editors | `"use client"` | Interactive UI |
| `question-preview.tsx` | `"use client"` | Used inside editor panel (client tree) |
| `question-type-chip.tsx` | Server-safe | Pure display |

---

## 13. States Covered

| State | Where |
|---|---|
| Empty (no questions match filter) | Table empty cell with icon + description |
| Loading | Skeleton rows in `AdminDataTable` |
| Validation errors | Right rail checklist, publish button disabled |
| Bulk selected | `BulkActionToolbar` appears |
| Question in "review" status | "Duyệt" button instead of pencil |
| New question | Header shows "Câu hỏi mới", blank form |
| No vocab linked | `QEmptyBox` in vocab section |
| No groups | Empty state in groups view |
| Group with no questions | Group card shows no question chips |

---

## 14. Responsive

- Desktop (≥1280px): two-column editor, 4-column stat tiles, full table
- Tablet (768px): stat tiles wrap to 2×2, editor right rail moves below
- Mobile (≤390px): stat tiles stack 1 col, table uses horizontal scroll, editor single column

---

## 15. Accessibility

- All icon buttons have `aria-label`
- Dialogs have `title` and `description`
- Form fields have `<label>` + associated `id`
- Table rows use `<button>` / `<Link>` not bare divs
- Type picker buttons: `title` attribute for full type description
- Keyboard: tab-through works, focus-visible ring visible

---

## 16. Done Criteria

- [ ] `lint` passes
- [ ] `typecheck` passes
- [ ] All 10 question type editors functional
- [ ] Tabs render (Câu hỏi / Nhóm / Tags)
- [ ] Filter toolbar narrows the table
- [ ] Bulk selection + publish action works
- [ ] Editor opens and saves back to list
- [ ] Preview renders for each type
- [ ] Responsive at 1440/1280/768/390
- [ ] LexiPath identity preserved (no generic SaaS chrome)
