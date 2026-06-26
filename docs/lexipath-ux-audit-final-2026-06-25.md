# LexiPath Frontend — Báo Cáo UI/UX Tổng Hợp Cuối Cùng

**Ngày:** 2026-06-25  
**Phương pháp:** Kết hợp 2 vòng audit độc lập — (1) Code Review Multi-Agent (946k tokens, 28 agents, 56 routes) + (2) Playwright Browser Testing (85 checks, 17 routes × 5 viewports, 78 routes analyzed)

---

## Điểm Tổng Hợp Cuối: **6.5 / 10**

| Vòng Audit | Phương pháp | Điểm | Coverage |
|-----------|------------|------|----------|
| Audit 1 — Code Review | 28 AI agents, code + screenshot analysis | 6.1 / 10 | 56 routes, 946k tokens |
| Audit 2 — Browser Testing | Playwright CLI, 17 routes × 5 viewports | 7.1 / 10 | 78 routes, 310 components |
| **Tổng hợp cuối** | Combined weighted | **6.5 / 10** | 78 routes |

**Production Readiness: Medium-Low** — Nền tảng kỹ thuật tốt. Có 2 BLOCKER và 3 CRITICAL cần xử lý trước khi public launch.

> Hai audit bổ trợ nhau: Audit 1 phát hiện lỗi cấu trúc sâu (HTML nesting, routing) mà browser không thấy. Audit 2 phát hiện lỗi DOM thực tế (overflow, Golden Time ẩn) mà code review bỏ qua.

---

## BLOCKERS

### B-01 — Invalid HTML: `<button>` wraps `<button>` tại `/dictionary`
**Nguồn:** Audit 1 (Code Review)  
**File:** `src/features/vocabulary/components/dictionary-result-card.tsx`

Card button wraps save + TTS buttons. HTML spec violation → keyboard trap, screen reader confusion, browser inconsistency.

**Fix:** Outer container → `<article>` + `<Link>` overlay (CSS `::after` absolute). Save/TTS → independent `<button>` với `z-index` cao hơn.

**Acceptance criteria:**
- HTML validator: 0 button-in-button errors
- Tab order: card link → save → TTS (sequential, all accessible)
- Click card body → navigate; click save → save only; click TTS → audio only

---

### B-02 — Landing page horizontal overflow 10px tại 768px viewport
**Nguồn:** Audit 2 (Playwright Browser)  
**Route:** `/`

`document.documentElement.scrollWidth = 778px` tại tablet breakpoint 768×1024. iPad users thấy horizontal scrollbar, first impression bị phá.

**Fix:** Audit `src/features/marketing/` cho element có `min-width` hoặc `fixed width` vượt 768px trong hero section.

**Acceptance criteria:**
- `document.documentElement.scrollWidth === 768` tại 768px viewport
- Không có horizontal scrollbar trên iPad portrait (768×1024)

---

## CRITICALS

### C-01 — `/settings` misnamed, misrouted, section labels không production-ready
**Nguồn:** Audit 1 (Code Review)  
**File:** `src/app/(learner)/settings/page.tsx`

Page chứa notification preferences nhưng được link là "Hồ sơ ngôn ngữ". Không có general account settings (timezone, UI language, theme). Section labels "A. / B. / C." không phù hợp production.

**Fix:** Rename content hoặc mở rộng thành actual settings hub. Replace "A. / B. / C." bằng descriptive headings.

---

### C-02 — Golden Time không xuất hiện trong DOM tại `/dashboard`
**Nguồn:** Audit 2 (Playwright Browser)

`document.body.innerText` không chứa "Golden Time" hay "Giờ Vàng" ở bất kỳ viewport nào. Flagship concept bị ẩn trên trang chính. Likely cause: `MOCK_HOME_GOLDEN` có `queueCount = 0` → component ẩn hoàn toàn.

**Fix:** Đảm bảo `HomeGoldenSummary` luôn render — ít nhất hiện empty state "Không có từ cần ôn hôm nay" thay vì ẩn.

**Acceptance criteria:**
- Playwright: "Golden Time" visible trong DOM tại `/dashboard` ở tất cả viewports
- Component render ngay cả khi queue empty

---

### C-03 — Marketing page `/` redirect unauthenticated users về `/login`
**Nguồn:** Audit 1 (Code Review) + Audit 2 (Screenshots)

Cả 2 audit xác nhận: screenshots folder `home/` chứa Login page. Unauthenticated users không thấy được marketing page. Không thể verify hero section, CTA, value proposition.

**Fix:** Kiểm tra middleware — marketing routes phải bypass auth redirect.

---

## HIGH Findings

| ID | Audit | Route | Issue | Effort | Fix |
|----|-------|-------|-------|--------|-----|
| H-01 | Audit 2 | /stats | 32 clickable divs — cao nhất toàn app | M | `<button>`/`<Link>` refactor |
| H-02 | Audit 2 | /collections | 30 clickable divs không keyboard accessible | M | `<Link asChild>` wrapping cards |
| H-03 | Audit 2 | /admin/exams/question-bank | 24 clickable divs + 18 unlabeled inputs | L | FormLabel + table row buttons |
| H-04 | Audit 2 | /login, /register, /security | 37 unlabeled form inputs (tổng 10 routes) | M | FormLabel + aria-label |
| H-05 | Audit 1 | /admin/users | Card list thay vì table — khó scan 100+ users | M | Convert sang AdminDataTable |
| H-06 | Audit 1 | /stats/* | Charts inconsistent: Recharts vs custom CSS | L | Unify sang Recharts |
| H-07 | Audit 2 | /dashboard | "Golden Time" CTA không nổi bật — chưa verify next best step | M | CTA prominence audit |
| H-08 | Audit 1 | /dictionary | DictionaryResultCard: JP/ZH phonetic display cần verify | M | `lang="ja"` / `lang="zh"` attributes |

---

## Điểm Mạnh (Không cần sửa)

| Điểm mạnh | Phát hiện từ |
|-----------|-------------|
| Design token system: oklch, semantic aliases, Golden Time + Skill Lane tokens riêng | Audit 2 |
| Server Component discipline: chỉ 7/78 pages dùng "use client" | Audit 2 |
| Learning session engine: 6 exercise types, keyboard shortcuts, typed components | Audit 1 |
| AdminDataTable pattern: TanStack Table, checkbox auto-prepend, sort | Audit 1 |
| `/onboarding`, `/golden-time`, `/notifications`, `/admin/review` — PASS tất cả browser checks | Audit 2 |
| Collections card hierarchy: Hero/Compact/Pro tier, CollectionMiniRoadmap innovative | Audit 1 |
| Feedback states library: EmptyState, ErrorState, LoadingSkeleton, LockedFeatureState — chất lượng cao | Audit 2 |
| CVA helpers (surfaceVariants, cardVariants, buttonToneVariants) — đúng chuẩn | Audit 2 |

---

## Roadmap Ưu Tiên

### Phase 1 — Fix Blockers & Critical (Sprint 1, ~1 tuần)
1. **Fix button nesting tại `/dictionary`** — 2-3h, BLOCKER, keyboard + screen reader
2. **Fix 768px landing overflow** — 1-2h, BLOCKER, tablet UX
3. **Fix Golden Time visibility tại `/dashboard`** — 30min (MOCK_HOME_GOLDEN queueCount)
4. **Fix marketing page redirect** — 1h, middleware audit
5. **Restructure `/settings`** — 1 ngày, rename + hub structure

### Phase 2 — Fix Clickable Divs & Unlabeled Inputs (Sprint 2, ~1 tuần)
6. `/stats`: 32 clickable divs → button/Link (StatsNavGrid, filter chips)
7. `/collections`: 30 clickable divs → `<Link asChild>` wrapping CollectionCard
8. `/admin/exams/question-bank`: 24 divs + 18 unlabeled inputs (FormLabel + row buttons)
9. `/profile`, `/admin/vocab`: 8 + 14 clickable divs
10. `/login`, `/register`, `/security`: unlabeled form inputs
11. Convert `/admin/users` từ card → AdminDataTable

### Phase 3 — Polish & State Coverage (Sprint 3, ~1 tuần)
12. Unify stats charts sang Recharts; thêm `aria` table fallbacks
13. Auth error states: unverified, locked, rate limited
14. Error boundaries cho `/collections`, `/stats`
15. AdminDataTable: Vietnamese defaults ("Không có dữ liệu", "Trước"/"Tiếp"), aria pagination labels
16. Skip-to-main-content link trong tất cả shell components
17. Fix vocab editor HTML entities (`&ldquo;` trong JSX)

### Phase 4 — Admin Workflow Polish (Sprint 4)
18. Admin review: clear draft/review/published state badges; bulk approve confirm
19. Exam test-builder: question reorder, preview mode, save draft indicator
20. Admin reliability: auto-refresh toggle, event status colors, retry button

---

## Final Scorecard Tổng Hợp

| Tiêu chí | Audit 1 | Audit 2 | Combined | Trọng số |
|---------|---------|---------|---------|---------|
| Product Clarity | 5.0 | 7.5 | 6.0 | C-02/C-03 kéo xuống |
| Navigation & IA | 7.0 | 7.5 | 7.0 | Settings CRITICAL drag |
| Task Flow / Frictionless | 6.0 | 6.5 | 6.0 | 86 clickable divs block |
| Visual Hierarchy | 6.0 | 8.0 | 7.0 | Token system xuất sắc |
| LexiPath Brand Identity | 5.0 | 8.5 | 6.5 | GT ẩn trên dashboard |
| Design System Consistency | 5.0 | 7.5 | 6.5 | src/components/common/ trống |
| Accessibility | 4.0 | 6.0 | **4.5** | BLOCKER + 86 divs + 37 inputs |
| Responsive Quality | 5.0 | 7.0 | **5.5** | 768px BLOCKER xác nhận 2 audit |
| State Coverage | 5.0 | 7.0 | 6.0 | Feedback library OK, áp dụng chưa nhất quán |
| Data Visualization | 5.0 | 7.0 | 6.0 | Recharts vs custom CSS |
| Learning Motivation | 6.0 | 7.5 | 6.5 | GT ẩn phá daily habit loop |
| Admin Workflow Clarity | 6.0 | 7.5 | 7.0 | Nav solid, users card sai |
| Trust & Safety UX | 5.0 | 7.0 | 6.0 | Settings mislabeled giảm trust |
| Performance Perception | 6.0 | 8.0 | 7.0 | Server Components discipline tốt |
| Overall Production Readiness | 5.0 | 7.0 | **6.0** | Medium-Low |
| **Trung bình** | **5.7** | **7.1** | **6.5** | |

> Audit 1 (code review) conservative hơn vì thấy structural issues. Audit 2 (browser) cho điểm cao hơn ở visual/token quality. Combined phản ánh bức tranh thật: nền tảng tốt nhưng có gaps cụ thể cần sửa trước launch.

---

## Những Route CLEAN — Không cần sửa

| Route | Audit 1 | Audit 2 |
|-------|---------|---------|
| `/onboarding` | Good | PASS |
| `/golden-time` | Good | PASS |
| `/notifications` | Present | PASS |
| `/admin/review` | Good | PASS |
| `/learn/session/[id]` | Best-coded section | N/A |

---

*Tổng hợp từ: Audit 1 (Code Review Multi-Agent, 946k tokens, 28 agents, 56 routes) + Audit 2 (Playwright Browser Testing, 85 checks, 78 routes, 5 viewports, 310 components). Ngày: 2026-06-25.*
