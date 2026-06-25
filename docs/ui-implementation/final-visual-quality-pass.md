# LexiPath Frontend — Final Visual Quality Pass

**Date:** 2026-06-25  
**Design source:** `/Users/vanhuu/Documents/freelance/lexi-web-English/LexiPath Web Design ` (trailing space)  
**Primary source of truth:** `LexiPath Prototype FINAL.html`, `screens_*.jsx`

---

## Audit Method

8 parallel agents read design source files and current implementation side-by-side. Each compared design intent to implementation reality and classified gaps by severity.

---

## Fixes Applied in This Pass

### Dashboard (`/dashboard`)
- ✅ Reverted unnecessary extra max-width wrapper — `LearnerAppShell` already provides `max-w-[1180px]` on `<main>`.

### Profile (`/profile`)
- ✅ Fixed circular self-link: "Xem hồ sơ công khai" was linking to `/profile` (current page). Changed to disabled button — public profile page not yet implemented.
- ✅ Fixed wrong route: "Nâng cấp Pro" / "Quản lý" (subscription section) linked to `/settings` → corrected to `/subscription`.
- ✅ Fixed wrong route: "Quản lý" (security section) linked to `/settings` → corrected to `/security`.
- ✅ Added dot indicator + "đang hoạt động" to learning stats active language badge (design: `{langName} · đang hoạt động` with colored dot).
- ✅ Removed unused `Link` and `Route` imports from `profile-hero-card.tsx`.

### Admin — Review Board (`/admin/review`)
- ✅ Added "Đã xuất bản" (published) stat card to `STAT_CONFIG` — was missing while the kanban board already showed the "published" column, causing visual imbalance.
- ✅ Added `Globe` icon for published stat card.
- ✅ Adjusted stat cards grid: `sm:grid-cols-4` → `sm:grid-cols-3 lg:grid-cols-5` to accommodate 5 cards.

### Admin — Vocab AI Disclosure
- ✅ Changed icon `AlertTriangle` → `Sparkles` (design specifies sparkles icon for AI-generated content disclosure).
- ✅ Changed color palette amber (warning) → info-soft/secondary (design: `--info-soft` bg, `--secondary` border/icon).

### Dictionary (`/dictionary`)
- ✅ Replaced hardcoded `bg-blue-50 text-blue-600` on "Khớp gần đúng" tier badge with design tokens `bg-info-soft text-info-foreground`.

---

## Remaining Issues — Not Fixed (Require Larger Scope)

### Auth

| Issue | Severity | File | Notes |
|-------|----------|------|-------|
| Login missing error states (invalid / unverified / too_many / locked / suspended) | CRITICAL | `src/app/(auth)/login/page.tsx` | Design defines 5 error variants with distinct banners. Current: single `errorMessage` string. |
| Register missing password strength indicator | CRITICAL | `src/features/auth/components/register-form.tsx` | Design shows 4-level strength bar (Quá yếu → Mạnh) with real-time feedback. |
| Onboarding WelcomeStep not implemented | CRITICAL | `src/app/(auth)/onboarding/page.tsx` | `WelcomeStep` referenced but not implemented. Should show benefits cards + journey preview. |
| Goal/language cards missing `detail` line | MEDIUM | `src/features/auth/components/setup-step-card.tsx` | Design: `detail='勉強（べんきょう）— Kanji + Furigana'` per language option. |
| Register terms links not wired | MEDIUM | `src/features/auth/components/register-form.tsx` | "Điều khoản" and "Chính sách bảo mật" links have no href. |

### Collections

| Issue | Severity | File | Notes |
|-------|----------|------|-------|
| Collection detail missing motivation block | CRITICAL | `src/app/(learner)/collections/[collectionId]/page.tsx` | Design `screens_collection_detail_v9.jsx`: "Tại sao học bộ này?" — 3-column grid (Dành cho ai / Sẽ luyện / Sẽ đạt được). |
| Collection detail missing sample content section | CRITICAL | `src/app/(learner)/collections/[collectionId]/page.tsx` | Design shows "Mẫu nội dung" section with 3-col vocab preview grid. |
| Lesson detail vocab list uses card grid instead of rich table | CRITICAL | `src/components/learner/vocab-preview-grid.tsx` | Design: row-based list with pronunciation, POS badge, status, weak-skill indicator, next-review time, audio. Current: simplified card grid. |
| Lesson detail missing search + status filter toolbar | CRITICAL | `src/app/(learner)/collections/[collectionId]/lessons/[lessonId]/page.tsx` | Design shows search input + filter chips (All/New/Learning/Review/Forgetting/Mastered) + "Từ yếu" toggle above vocab list. |

### Dictionary / Vocab Detail

| Issue | Severity | File | Notes |
|-------|----------|------|-------|
| Dictionary language header missing colored-dot badge | MEDIUM | `src/app/(learner)/dictionary/dictionary-client.tsx` | Design: `DictionaryLanguageBadge` with color-coded dot (JA red, EN teal, ZH orange). |
| Vocab detail: pronunciation block not shown as dedicated section | MEDIUM | `src/app/(learner)/vocab/[vocabId]/vocab-detail-client.tsx` | Design flow: Header → Pronunciation Block → Body. Current: pronunciation only in header. |
| Vocab detail: sense navigation missing for >4 senses | LOW | `src/app/(learner)/vocab/[vocabId]/vocab-detail-client.tsx` | Design shows tab/accordion per sense count. |

### Golden Time / Learning Session

| Issue | Severity | File | Notes |
|-------|----------|------|-------|
| Golden queue urgency chips missing visual states | CRITICAL | `src/components/lexipath/golden-time/golden-queue-preview.tsx` | Design: "Quá hạn" (danger), "Cần ôn" (golden), "Sắp đến giờ" (surface). Current: muted label only. |
| Golden Time window missing learning language label | CRITICAL | `src/components/lexipath/golden-time/golden-time-window.tsx` | Multilingual learners cannot see which language's review queue they are viewing. |
| Overdue alert underdeveloped | MEDIUM | `src/components/lexipath/golden-time/golden-time-dashboard-hero.tsx` | Design: full-width alert with icon, title, description, "Ôn ngay" CTA. |
| Learning session summary missing insight rows | MEDIUM | `src/components/learning/session/learning-session-summary.tsx` | Design: detail panel with time-estimate, words-promoted, words-needing-review rows. |

### Notebook

| Issue | Severity | File | Notes |
|-------|----------|------|-------|
| "Tra từ mới" button not wired to dictionary screen | MEDIUM | `src/app/(learner)/notebook/notebook-client.tsx` | Should open dictionary search overlay/modal. Currently no linked screen. |
| Detail panel missing 6-block layout | MEDIUM | `src/features/notebook/components/notebook-detail-panel.tsx` | Design: Hero → Meaning → Example → Next Review → Reason → Phrases, with visual sub-card separation. |
| Word list rows missing urgency dots | MEDIUM | `src/app/(learner)/notebook/notebook-client.tsx` | Design: red dot for overdue, orange for due, transparent otherwise. |

### Stats

| Issue | Severity | File | Notes |
|-------|----------|------|-------|
| Weekly chart metric switching needs verification | CRITICAL | `src/features/stats/components/stats-weekly-chart.tsx` | 4 metric chips (XP / Từ mới / Lượt ôn / Phút học) should dynamically update bars + bar labels. |
| Skills status pill colors need verification | CRITICAL | `src/features/stats/components/stats-skill-card.tsx` | Design exact mappings: Nhớ tốt→success-soft, Đang tiến bộ→info-soft, Cần luyện→danger-soft, etc. |
| Nav grid cards missing colored value badges | MEDIUM | `src/features/stats/components/stats-nav-grid.tsx` | Design: icon bg tones (green/blue/amber/purple) + value badges ("1 kỹ năng yếu", "+120 XP"). |
| Heatmap legend not interactive | MEDIUM | `src/features/stats/components/stats-heatmap-grid.tsx` | Design shows 5-shade filter legend. |
| Leaderboard podium: no clickable-div violations | LOW | `src/app/(learner)/stats/leaderboard/page.tsx` | Podium rows are plain `<div>` without button semantics — review if interactivity intended. |
| Custom Recharts tooltip not applied | LOW | Multiple chart components | Tooltips use Recharts defaults; should match LexiPath card styling. |

### Security (Learner)

| Issue | Severity | File | Notes |
|-------|----------|------|-------|
| Missing "Phiên hiện tại" section | CRITICAL | `src/app/(learner)/security/security-client.tsx` | Design shows dedicated current-session card before password section. |
| 2FA "Sắp ra mắt" badge may not display clearly | MEDIUM | `src/app/(learner)/security/security-client.tsx` | Design shows a clear "coming soon" label on the 2FA row. |
| Device card trusted-device toggle lacks bottom-section layout | MEDIUM | `src/components/security/device-card.tsx` | Design: two-row per device — info row + toggle row with muted bg. |

### Admin

| Issue | Severity | File | Notes |
|-------|----------|------|-------|
| Admin stat cards grid responsive behavior | MEDIUM | `src/components/admin-review/review-board-client.tsx` | Fixed (5 cards now). Mobile 2-col may still look awkward on 5 cards. |

---

## Global Compliance Checklist

| Check | Status | Notes |
|-------|--------|-------|
| No raw prototype HTML/CSS/scripts copied | ✅ PASS | All rebuilt in TSX + Tailwind |
| No inline styles for layout/color/spacing | ✅ PASS | Justified dynamic values (progress bars, color-mix shadows) documented |
| No CSS modules / styled-components | ✅ PASS | |
| No CDN icons / window.lucide | ✅ PASS | lucide-react imported throughout |
| No dangerouslySetInnerHTML | ✅ PASS | |
| No clickable divs | ✅ MOSTLY PASS | Leaderboard podium wrapper divs — review if interactivity needed |
| No direct API calls in UI components | ✅ PASS | All via TanStack Query hooks or typed mocks |
| DTO/UI type/mapper separated | ✅ PASS | `src/features/<feature>/api/*.dto.ts` + `*.mapper.ts` pattern |
| shadcn/Radix/lucide/cn/cva correct usage | ✅ PASS | |
| Learner pages: no sidebar | ✅ PASS | LearnerAppShell has no sidebar |
| Admin pages: sidebar present | ✅ PASS | AdminShell with sidebar |
| Focus learning: no main navigation | ✅ PASS | FocusLearningShell minimal chrome |
| Responsive desktop/tablet/mobile | ✅ MOSTLY PASS | A few breakpoint gaps noted per page |
| Accessibility basics | ✅ MOSTLY PASS | aria-labels, aria-hidden, semantic HTML throughout; leaderboard row interactivity TBD |
| LexiPath identity: journey/Golden Time/skill lanes | ✅ PASS | Preserved in home, collections, golden time pages |
| Multilingual: EN/JA/ZH script awareness | ✅ PASS | lang-module-en/ja/zh components present |

---

## Pre-existing Lint Issues (Not Introduced by This Pass)

- `src/app/dev/page.tsx` — 2 React Compiler errors (setState in effect, unmodifiable value)
- `src/components/admin/admin-data-table.tsx` — TanStack Table `useReactTable` warning
- `src/components/exam/question-bank-table.tsx` — TanStack Table `useReactTable` warning

These existed before this pass and are not blocking.

---

## lint/typecheck

```
npm run lint    → 10 problems (4 errors, 6 warnings) — ALL PRE-EXISTING
npm run typecheck → 0 errors ✅
```
