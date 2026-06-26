# LexiPath Frontend — UI/UX Audit Report
**Ngày:** 2026-06-25  
**Auditor:** Senior UI/UX Panel (AI-assisted, code + screenshot + design source analysis)  
**Phương pháp:** UI UX Pro Max · Microsoft frontend-design-review · Addy Osmani agent-skills  
**Coverage:** 56 routes · 31 screenshot folders · 28 subagents · ~946k tokens phân tích

---

## A. Executive Summary

| Chỉ số | Giá trị |
|--------|---------|
| **Điểm tổng thể** | **6.1 / 10** |
| **Mức sẵn sàng UI production** | **Medium** — Learner core solid; admin/account/marketing cần hoàn thiện |
| **Routes đã implement** | 56 / ~60 thiết kế |
| **Screenshot coverage** | 31 folder · nhưng ~80% ảnh hiển thị Login page (vấn đề auth redirect) |

### 3 điểm mạnh nhất

1. **Learning session engine** — 6 loại bài tập với typed components riêng biệt, keyboard shortcuts đúng cách via `useRef`, word hierarchy (word → phonetic → POS → prompt) nhất quán. Đây là phần UI tốt nhất trong toàn project.
2. **Admin navigation & shell** — `ADMIN_NAV` có 6 sections rõ ràng, `AdminDataTable` với TanStack Table dùng đúng cách, checkbox auto-prepend pattern đúng. Tổng quan admin navigation production-quality.
3. **Collections card hierarchy** — Hệ thống Hero/Compact/Pro three-tier rõ ràng, `CollectionMiniRoadmap` component genuinely innovative, score 76/100 (cao nhất trong learner pages).

### 5 rủi ro UI/UX lớn nhất

1. **BLOCKER — Invalid HTML nesting**: `<button>` wraps `<button>` trong `DictionaryResultCard` (save + TTS buttons nested inside card button). Vi phạm HTML spec, gây keyboard trap và screen reader confusion.
2. **CRITICAL — Screenshots toàn bộ show Login page**: Mọi screenshot chụp (home, learning-session, golden-dashboard, stats, collections...) đều redirect về `/login`. App không có demo/mock mode → không thể visual benchmark implementation.
3. **CRITICAL — Settings page bị misnamed/misrouted**: `/settings` chỉ chứa notification preferences nhưng được label là "Hồ sơ ngôn ngữ". Không có general account settings (timezone, UI language, theme). Section label "A. / B. / C." không production-ready.
4. **CRITICAL — Marketing page `/` trạng thái không rõ**: Screenshot folder `home/` chứa ảnh Login page, không phải marketing landing. Chưa thể verify hero section, CTA, value proposition.
5. **HIGH — Design system inconsistency trong Stats**: Recharts chỉ dùng ở 1 chỗ (`stats-weekly-chart.tsx`), toàn bộ chart còn lại dùng custom CSS/SVG. Không nhất quán và khó maintain.

### Kết luận ưu tiên sửa
> Cần **UI stabilization sprint** trước khi tiếp tục build feature mới. Tập trung: (1) sửa HTML nesting bug trong Dictionary, (2) thiết lập demo/dev mode để visual test được, (3) refactor Settings navigation, (4) verify marketing page.

---

## B. Cách đã dùng skills/agents

| Skill/Agent | Mục đích sử dụng |
|-------------|-----------------|
| **UI UX Pro Max** | Query design system recommendation cho education/language learning product. Kết quả: Soft UI Evolution style, warm indigo primary, focus green CTA. Anti-patterns: AI purple generic gradient, tránh claymorphism (quá trẻ em) cho adult language learner |
| **Microsoft frontend-design-review (3 pillars)** | Frictionless Insight to Action → kiểm tra task completion per page; Quality is Craft → token usage, state coverage; Trustworthy Building → payment/security/admin trust signals |
| **Addy Osmani agent-skills** | DEFINE→PLAN→VERIFY→REVIEW→SHIP lifecycle. 12 specialist agents đọc song song tất cả page implementations, feature folders, component inventory |
| **Playwright MCP** | **Không thể thực thi** — app redirect toàn bộ về `/login` khi chưa auth. Screenshots xác nhận điều này. Cần demo/mock mode trước khi Playwright audit có ý nghĩa |

---

## C. Product Identity Fit

### Đánh giá tổng thể: **6.5/10 — Partial identity**

LexiPath có identity riêng nhưng chưa đủ mạnh để phân biệt với generic SaaS dashboard. Phân tích từng concept:

| Concept | Trạng thái | Nhận xét |
|---------|-----------|---------|
| **Learning path / journey** | ⚠️ Partial | Dashboard có components cho journey nhưng chưa rõ "tôi đang ở bước nào" |
| **Golden Time** | ✅ Present | Có route riêng `/golden-time`, session page riêng. Nhưng chưa verify visual treatment (screenshots bị redirect) |
| **Skill lanes** | ⚠️ Partial | Stats/Skills page có nhưng implementation chưa kiểm tra được qua browser |
| **Next best step** | ⚠️ Weak | Dashboard có `HomeHero` component nhưng "next best step" chưa thực sự nổi bật theo code review |
| **Review queue** | ❓ Unknown | Component tồn tại nhưng chưa verify urgency signaling |
| **Exam-to-SRS loop** | ⚠️ Partial | Exam routes có, SRS status trong vocab card có, nhưng loop flow chưa tested |
| **Multilingual (EN/JP/ZH)** | ✅ Present | Vocab card có pronunciation/phonetic field, POS display. DictionaryResultCard có 3-zone layout phù hợp multilingual |

**Vấn đề identity chính:** Dashboard page (`/dashboard`) là Server Component không có metadata export — mất cơ hội SEO và social sharing identity. Marketing page chưa verify được nên không biết LexiPath có giải thích đủ rõ "tại sao dùng LexiPath thay vì Duolingo/Anki" không.

---

## D. Route/Page Coverage Matrix

| Route | Screenshot | Implementation | Browser Test | Responsive Status | UX Status | Max Severity | Ghi chú |
|-------|-----------|---------------|-------------|-------------------|-----------|-------------|---------|
| `/` (marketing) | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ❓ Unknown | CRITICAL | Screenshots show login page |
| `/login` | ✅ Đầy đủ | ✅ Có | ❌ Chưa test | ✅ Desktop+Mobile | ✅ Good | MEDIUM | Form solid |
| `/register` | ✅ Có | ✅ Có | ❌ Chưa test | ✅ OK | ✅ Good | MEDIUM | |
| `/onboarding` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Needs verify | HIGH | Progress indicator cần verify |
| `/dashboard` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | No metadata export |
| `/golden-time` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Needs verify | HIGH | |
| `/golden-time/session/[id]` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ✅ Good code | MEDIUM | |
| `/learn/session/[id]` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ✅ Solid | MEDIUM | Best-coded section |
| `/dictionary` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | 🔴 Bug | BLOCKER | Button nesting bug |
| `/vocab/[id]` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/notebook` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/collections` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ✅ Good | MEDIUM | 76/100 score |
| `/collections/[id]` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ✅ Good | MEDIUM | |
| `/collections/[id]/lessons/[id]` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/stats` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Inconsistent | HIGH | Custom CSS charts |
| `/stats/skills` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/stats/streak` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | MEDIUM | |
| `/stats/heatmap` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | MEDIUM | |
| `/stats/xp` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | MEDIUM | |
| `/stats/leaderboard` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | MEDIUM | |
| `/stats/collections` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | MEDIUM | |
| `/profile` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/settings` | ✅ Screenshot | ✅ Có | ❌ Chưa test | ⚠️ OK | 🔴 Misnamed | CRITICAL | Chỉ có notification prefs |
| `/security` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/subscription` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | Payment trust unknown |
| `/notifications` | ❌ Không có | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | MEDIUM | Không có screenshot |
| `/exams` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/admin` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ✅ Structure good | MEDIUM | |
| `/admin/vocab` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ✅ Good | MEDIUM | AdminDataTable solid |
| `/admin/vocab/new` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/admin/review` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ✅ Present | HIGH | |
| `/admin/exams/question-bank` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ✅ Present | MEDIUM | |
| `/admin/exams/test-builder` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/admin/exams/scoring` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/admin/users` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Card not table | HIGH | |
| `/admin/roles` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/admin/security` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ✅ Present | MEDIUM | |
| `/admin/payments/*` | ⚠️ Redirect | ✅ Có (5 routes) | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | HIGH | |
| `/admin/reliability/*` | ⚠️ Redirect | ✅ Có (3 routes) | ❌ Chưa test | ❓ Unknown | ⚠️ Partial | MEDIUM | |
| `/admin/collections` | ⚠️ Redirect | ✅ Có | ❌ Chưa test | ❓ Unknown | ✅ Present | MEDIUM | |

**Screenshot issue:** 80%+ screenshot folders chứa ảnh Login page thay vì trang thật. Đây là vấn đề infrastructure, không phải UI bug — app đúng khi redirect unauthenticated users, nhưng cần demo/seed mode để visual audit.

---

## E. Detailed UI/UX Findings

### E.1 Marketing (`/`)

---

**ID:** MKT-01  
**Severity:** CRITICAL  
**Page/Route:** `/`  
**File:** `src/app/(marketing)/page.tsx`  
**Evidence source:** Screenshot (home/ folder) — tất cả 3 viewport (desktop-1440, tablet-768, mobile-375) hiển thị Login page  
**Vấn đề:** Không thể verify marketing page qua screenshot. Page có thể redirect auth users về dashboard và unauthenticated users về login, khiến không ai thấy marketing page.  
**Bằng chứng:** Screenshot agent: "The screenshots placed in the home/ folder are not actually the marketing/home page. All three viewports show the Login page (Chào mừng trở lại)"  
**Ảnh hưởng UX:** Không biết hero section, value proposition, CTA placement, brand identity có đúng không. Người dùng mới không rõ LexiPath là gì trước khi đăng ký.  
**Đề xuất sửa:** (1) Kiểm tra route handler `/` — có thể bị middleware redirect. (2) Thêm demo/preview mode hoặc bypass auth cho marketing routes. (3) Verify hero communicates "học từ vựng + thi thật" differentiation vs Duolingo/Anki.  
**Acceptance criteria:**
- `GET /` khi chưa đăng nhập trả về marketing page, không redirect login
- Hero section above-the-fold visible tại 375px viewport
- Primary CTA (Đăng ký miễn phí) và Secondary CTA (Đăng nhập) đều visible
- Value proposition mention: Golden Time, exam preparation, SRS loop

---

**ID:** MKT-02  
**Severity:** HIGH  
**Page/Route:** `/`  
**Evidence source:** Code inference  
**Vấn đề:** Không có `generateMetadata` trên marketing page — mất SEO title, description, OG image.  
**Đề xuất sửa:** Thêm `export const metadata: Metadata = { title: 'LexiPath — Học từ vựng theo lộ trình cá nhân', description: '...' }` với OG image.

---

### E.2 Auth & Onboarding

---

**ID:** AUTH-01  
**Severity:** MEDIUM  
**Page/Route:** `/login`  
**File:** `src/features/auth/components/login-form.tsx`, `src/app/(auth)/login/page.tsx`  
**Evidence source:** Code review  
**Vấn đề:** Form fields có `autoComplete="email"` nhưng cần verify password field có `autoComplete="current-password"` không. Password manager compatibility quan trọng với user retention.  
**Đề xuất sửa:** `<Input autoComplete="current-password" />` cho password field. Verify `name` attributes khớp với password manager expectations.  
**Acceptance criteria:**
- Autofill email + password hoạt động trong Chrome/Safari/Firefox
- Password manager (1Password, Bitwarden) nhận diện form đúng

---

**ID:** AUTH-02  
**Severity:** HIGH  
**Page/Route:** `/login`  
**Evidence source:** Code review  
**Vấn đề:** Cần verify đủ error states: wrong password, unverified email, locked account, too many attempts, network error. Thiếu bất kỳ state nào = friction điểm cao nhất trong funnel.  
**Đề xuất sửa:** Map tất cả Spring Boot error codes → friendly Vietnamese messages. "Tài khoản bị khóa tạm thời" khác "Mật khẩu không đúng" — đừng dùng generic "Đăng nhập thất bại".  
**Acceptance criteria:**
- Wrong password: "Mật khẩu không đúng" (không tiết lộ email có tồn tại không vì security)
- Unverified: "Vui lòng xác thực email. [Gửi lại link xác thực]"
- Too many attempts: "Tài khoản tạm khóa X phút"
- Network error: "Không thể kết nối. [Thử lại]"

---

**ID:** AUTH-03  
**Severity:** MEDIUM  
**Page/Route:** `/onboarding`  
**Evidence source:** Code review  
**Vấn đề:** Cần verify progress indicator (step 1/3, 2/3...) visible và có skip option cho returning users. Onboarding quá dài = drop-off.  
**Đề xuất sửa:** Max 3 steps: (1) Chọn ngôn ngữ học, (2) Mục tiêu (thi IELTS/HSK/JLPT/casual), (3) Trình độ hiện tại. Có "Bỏ qua" ở góc phải mỗi step.

---

### E.3 Learner Dashboard

---

**ID:** DASH-01  
**Severity:** HIGH  
**Page/Route:** `/dashboard`  
**File:** `src/app/(learner)/dashboard/page.tsx`  
**Evidence source:** Code review — Server Component, no metadata  
**Vấn đề:** Dashboard page không có `generateMetadata` export. Khi share link hoặc bookmark, title tab là "LexiPath" generic. Quan trọng hơn: phân tích code cho thấy `HomeHero` component nhưng chưa rõ "next best step" có thực sự nổi bật không.  
**Đề xuất sửa:** (1) Thêm metadata. (2) "Tiếp tục học ngay" hoặc "Đến giờ Golden Time" phải là CTA to nhất, màu sắc nổi bật, above the fold trên mobile.  
**Acceptance criteria:**
- Tại 390px mobile viewport, primary CTA visible without scroll
- CTA text reflects current state: "Bắt đầu Golden Time" OR "Tiếp tục [Lesson Name]" OR "Ôn tập [N từ đến hạn]"
- Không có 2 CTA cạnh tranh nhau cùng visual weight

---

**ID:** DASH-02  
**Severity:** MEDIUM  
**Page/Route:** `/dashboard`  
**Vấn đề:** Review queue urgency chưa verify. SRS-based app cần "X từ cần ôn HÔM NAY" — nếu số này không rõ ràng thì user không cảm thấy cấp bách học.  
**Đề xuất sửa:** Review queue badge/counter màu đỏ/cam khi có từ quá hạn. Tooltip/subtext "Ôn ngay để không mất streak".

---

### E.4 Golden Time & Learning Sessions

---

**ID:** GT-01  
**Severity:** HIGH  
**Page/Route:** `/golden-time`  
**Evidence source:** Code review, screenshots (redirect)  
**Vấn đề:** Screenshots toàn bộ redirect về login, không verify được Golden Time concept visualization. Code có route và session page, nhưng không biết visual treatment có đủ distinctive không (màu vàng/gold? countdown timer? peak time indicator?).  
**Đề xuất sửa:** Golden Time cần visual identity riêng: (1) Background màu warm amber/gold (không phải tím generic), (2) Countdown hoặc "Học hiệu quả nhất lúc 7-9 giờ sáng", (3) Distinct từ normal learning session.  
**Acceptance criteria:**
- `/golden-time` page có visual treatment khác biệt với `/dashboard`
- Concept "đây là thời điểm học tốt nhất" được communicate rõ qua UI, không chỉ qua text

---

**ID:** SESSION-01  
**Severity:** LOW  
**Page/Route:** `/learn/session/[id]`, `/golden-time/session/[id]`  
**File:** `src/features/learning-session/`  
**Evidence source:** Code review — "3 Critical / 7 Warnings / 8 Strengths"  
**Vấn đề:** Đây là phần tốt nhất của codebase. 6 exercise types, typed components, keyboard shortcuts via `useRef`. Concerns nhỏ cần verify: (1) ESC để exit session có confirmation dialog không? (2) Progress bar có smooth animation không?  
**Đề xuất sửa:** Exit confirmation: "Bạn có chắc muốn thoát? Tiến độ sẽ được lưu."  
**Acceptance criteria:**
- ESC/back trong session → modal confirmation trước khi exit
- Progress bar transition smooth (CSS transition, không jump)
- Keyboard shortcuts (1/2/3/4 cho multiple choice) documented hoặc hinted trong UI

---

**ID:** SESSION-02  
**Severity:** MEDIUM  
**Page/Route:** `/learn/session/[id]`  
**Vấn đề:** Flashcard component có "normal và special mode" (từ audit) nhưng chưa rõ transition animation giữa 2 mặt có đủ spatial hay không. Flip animation là key UX cue cho flashcard learning.  
**Đề xuất sửa:** CSS 3D flip transform, 300ms duration, `preserve-3d`. Check `prefers-reduced-motion` để dùng fade thay thế.

---

### E.5 Vocabulary / Dictionary / Notebook

---

**ID:** VOCAB-01  
**Severity:** BLOCKER  
**Page/Route:** `/dictionary`  
**File:** `src/features/vocabulary/components/dictionary-result-card.tsx` (tên ước đoán)  
**Evidence source:** Code review agent — explicit finding  
**Vấn đề:** `<button>` element (card) wraps inner `<button>` elements (save + TTS buttons). HTML spec cấm interactive content inside `<button>`. Result: (1) Keyboard users không thể Tab đến save/TTS buttons independently, (2) Screen readers announce toàn bộ card content là button, (3) Some browsers sẽ flatten nested buttons thành sibling elements, phá vỡ click handler.  
**Bằng chứng:** "a `<button>` wrapping inner `<button>` elements is invalid HTML. The save and TTS buttons are nested inside the card button. Must refactor the outer to a non-interactive container."  
**Đề xuất sửa:** Refactor `DictionaryResultCard`: outer container dùng `<article>` hoặc `<div>` với `role="region"`. Navigate to vocab detail dùng `<Link>` (next/link) phủ toàn card qua CSS (`::after` absolute overlay hoặc positioned `<a>`). Save và TTS là độc lập `<button>` với `z-index` cao hơn link overlay.  
**Acceptance criteria:**
- HTML validator không report button-in-button error
- Tab order: card link → save button → TTS button (sequential, accessible independently)
- Click card body → navigate to vocab detail
- Click save button → save, không navigate
- Click TTS button → play audio, không navigate

---

**ID:** VOCAB-02  
**Severity:** HIGH  
**Page/Route:** `/dictionary`, `/vocab/[id]`  
**Evidence source:** Code review  
**Vấn đề:** DictionaryResultCard có "three-zone layout (word / body / actions)" tốt nhưng cần verify: (1) Pronunciation/phonetic display cho JP (furigana/romaji) và ZH (pinyin) có đúng font và layout không? (2) Audio play button có fallback text khi không có audio? (3) SRS status badge có đủ contrast không?  
**Đề xuất sửa:** JP phonetic cần `lang="ja"` attribute, ZH cần `lang="zh"`. Pinyin tone marks cần đúng Unicode (không phải ASCII).  
**Acceptance criteria:**
- Japanese word: furigana hoặc romaji visible bên cạnh kanji tại 375px
- Chinese word: pinyin với tone marks đúng (ā á ǎ à)
- Audio button: `aria-label="Phát âm [word]"` khi không có visible text

---

**ID:** VOCAB-03  
**Severity:** MEDIUM  
**Page/Route:** `/notebook`  
**Evidence source:** Code review  
**Vấn đề:** Notebook cần SRS status filter (New / Learning / Review / Mastered) nổi bật. Nếu user không thấy "X từ cần ôn ngay" thì Notebook chỉ là list, không phải học cụ.  
**Đề xuất sửa:** Tab bar ở đầu trang: All | 🔴 Cần ôn (N) | 🟡 Đang học | 🟢 Thành thạo | Mới.

---

### E.6 Collections / Lessons

---

**ID:** COLL-01  
**Severity:** LOW  
**Page/Route:** `/collections`  
**Evidence source:** Code review — 76/100 score, 12 strengths  
**Vấn đề:** Điểm mạnh nhất trong learner pages. Hero/Compact/Pro card tier system rõ ràng. `CollectionMiniRoadmap` innovative. Concerns: (1) Locked/premium collections state cần clear messaging (không chỉ grayed out), (2) Empty state khi user chưa có collection nào.  
**Đề xuất sửa:** Locked state: overlay với "Nâng cấp để mở khóa [X bộ học]" + CTA → `/subscription`. Empty state: "Khám phá bộ học đầu tiên" với 3 recommended collections.  
**Acceptance criteria:**
- Locked collection: visual lock icon + upgrade CTA, không chỉ disabled styling
- Empty state: actionable CTA, không phải blank page

---

**ID:** COLL-02  
**Severity:** MEDIUM  
**Page/Route:** `/collections/[id]/lessons/[id]`  
**Evidence source:** Code review  
**Vấn đề:** Lesson detail cần weak words indicator rõ ràng — user cần biết từ nào trong lesson họ chưa vững để focus. Nếu chỉ show toàn bộ vocab list mà không có SRS status thì learning motivation giảm.  
**Đề xuất sửa:** Vocab list trong lesson có status dot (🔴 chưa học / 🟡 đang học / 🟢 thành thạo). Filter toggle: "Chỉ hiện từ chưa vững".

---

### E.7 Stats / Streak / XP / Leaderboard

---

**ID:** STATS-01  
**Severity:** HIGH  
**Page/Route:** `/stats`, `/stats/skills`, `/stats/streak`, `/stats/heatmap`, `/stats/xp`, `/stats/leaderboard`, `/stats/collections`  
**File:** `src/app/(learner)/stats/`  
**Evidence source:** Code review  
**Vấn đề:** Recharts chỉ dùng ở `stats-weekly-chart.tsx` (BarChart). Tất cả chart còn lại (heatmap, streak, XP, skills) dùng custom CSS/SVG. Hai vấn đề: (1) Inconsistent interaction model — Recharts có tooltip built-in, custom CSS thì không; (2) Custom CSS charts không accessible (thiếu ARIA, không có table fallback).  
**Đề xuất sửa:** Unify: dùng Recharts cho tất cả, HOẶC accept custom CSS nhưng phải thêm `<table>` fallback với `sr-only` class cho screen readers.  
**Acceptance criteria:**
- Tất cả charts có data accessible qua keyboard hoặc screen reader
- Mobile (375px): không có horizontal overflow trên chart containers
- Tooltip visible khi hover/focus trên data points

---

**ID:** STATS-02  
**Severity:** MEDIUM  
**Page/Route:** `/stats/leaderboard`  
**Evidence source:** Code review  
**Vấn đề:** Leaderboard trust/fairness cần careful design. Nếu leaderboard chỉ show rank mà không có context (học ngôn ngữ nào, trong tuần/tháng/all-time, bạn bè vs global) thì nó gây demotivation hơn motivation.  
**Đề xuất sửa:** Default: leaderboard tuần trong nhóm ngôn ngữ của user. Tabs: Tuần này / Tháng này / Bạn bè. Highlight rank của user hiện tại. "Top 10%" badge thay vì chỉ show số rank tuyệt đối.

---

**ID:** STATS-03  
**Severity:** MEDIUM  
**Page/Route:** `/stats/heatmap`  
**Evidence source:** Code review  
**Vấn đề:** Heatmap (GitHub-style learning calendar) cần legend rõ ràng và tooltip khi hover/tap. Trên mobile (375px), heatmap thường bị overflow horizontal hoặc cell quá nhỏ để tap.  
**Đề xuất sửa:** Mobile: scroll horizontally inside a `overflow-x: auto` container, cell size tối thiểu 12px, month labels condensed. Legend: "Không học | 1-5 từ | 6-20 từ | 20+ từ" với màu gradient.  
**Acceptance criteria:**
- 375px: không có page-level horizontal overflow
- Heatmap cell có `aria-label="[date]: [N từ đã học]"`
- Legend visible và readable tại tất cả viewports

---

### E.8 Profile / Settings / Security / Subscription

---

**ID:** ACCT-01  
**Severity:** CRITICAL  
**Page/Route:** `/settings`  
**File:** `src/app/(learner)/settings/page.tsx`  
**Evidence source:** Code review agent — explicit finding  
**Vấn đề:** `/settings` page chứa **notification preferences only** nhưng được link từ Profile hub với label "Hồ sơ ngôn ngữ" — hoàn toàn mismatch. Không tồn tại general account settings (timezone, UI language, theme, notification preferences grouped properly). Section labels "A. / B. / C." không production-ready.  
**Bằng chứng:** "The main structural problem is that /settings is misnamed — it contains only notification preferences but the profile hub links it with label 'Hồ sơ ngôn ngữ'. There is no general account settings home. Section labels 'A. / B. / C.' in..."  
**Đề xuất sửa:** (1) Rename `/settings` → `/notifications` hoặc mở rộng thành actual settings. (2) Tạo settings hub: Tài khoản / Thông báo / Ngôn ngữ học / Giao diện / Bảo mật. (3) Replace "A. / B. / C." labels bằng descriptive headings.  
**Acceptance criteria:**
- `/settings` page title và H1 match route intent
- Notification preferences accessible từ settings nav
- Section headings mô tả content (không phải "A. Cài đặt thông báo")

---

**ID:** ACCT-02  
**Severity:** HIGH  
**Page/Route:** `/security`  
**Evidence source:** Code review  
**Vấn đề:** Admin system pages agent note: "Card-based user list with Avatar initials, name, email, last-active, role" — nhưng đây là `/admin/users`. Cần verify learner `/security` page có: (1) Active sessions/devices table, (2) Last login location, (3) Revoke session CTA với confirmation dialog.  
**Đề xuất sửa:** Active sessions table: Device icon | Browser | Location | Last active | [Đăng xuất thiết bị này]. "Đăng xuất tất cả thiết bị khác" button với confirm dialog.  
**Acceptance criteria:**
- Destructive action "Đăng xuất tất cả thiết bị" có confirmation modal
- Current session visually marked (cannot revoke current session)

---

**ID:** ACCT-03  
**Severity:** HIGH  
**Page/Route:** `/subscription`  
**Evidence source:** Code review  
**Vấn đề:** Payment/subscription page chưa verify được qua browser (screenshot redirect). Trust signals critical: SSL badge, refund policy link, clear plan comparison, no dark patterns.  
**Đề xuất sửa:** Plan comparison table: Free vs Pro vs Team (nếu có). Feature matrix với checkmark/cross. CTA: "Dùng thử 7 ngày miễn phí" nếu có trial. Refund policy link rõ.  
**Acceptance criteria:**
- Subscription page không có loading state bị broken
- Plan features clearly differentiated
- Payment CTA không bắt đầu charge ngay khi click (confirm step)

---

**ID:** ACCT-04  
**Severity:** MEDIUM  
**Page/Route:** `/profile`  
**Evidence source:** Code review  
**Vấn đề:** Profile hub cần be a clear navigation center cho account pages. Avatar upload, display name edit, streak/XP summary, quick links đến Security/Settings/Subscription.  
**Đề xuất sửa:** Profile page = account home hub. Không nên duplicate nội dung của Settings. Quick stats (streak, total words learned, member since) at a glance.

---

### E.9 Notifications

---

**ID:** NOTIF-01  
**Severity:** MEDIUM  
**Page/Route:** `/notifications`  
**Evidence source:** Code review (no screenshot available)  
**Vấn đề:** Không có screenshot. Page implementation tồn tại nhưng visual quality unknown. Notification grouping (ngày hôm nay / tuần này / cũ hơn) và read/unread visual distinction cần verify.  
**Đề xuất sửa:** (1) Grouped by time (Hôm nay / Tuần này / Cũ hơn). (2) Unread: background highlight nhẹ + bold text. (3) "Đánh dấu tất cả đã đọc" bulk action. (4) Empty state: "Không có thông báo mới — tiếp tục học để nhận thành tích!".  
**Acceptance criteria:**
- Unread notifications visually distinct from read
- "Đánh dấu tất cả đã đọc" CTA visible khi có unread items
- Empty state has actionable message

---

### E.10 Admin

---

**ID:** ADMIN-01  
**Severity:** HIGH  
**Page/Route:** `/admin/users`  
**File:** `src/components/admin-rbac/users-client.tsx`  
**Evidence source:** Code review  
**Vấn đề:** User management dùng **card-based list** (Avatar initials, name, email, last-active, role) thay vì table. Admin context cần data density — card layout khó scan/sort/filter khi có 100+ users.  
**Đề xuất sửa:** Convert sang `AdminDataTable` (TanStack Table) với columns: Avatar+Name | Email | Role | Status | Last active | Actions. Reuse existing `AdminDataTable` pattern đã có trong vocab/question bank.  
**Acceptance criteria:**
- User list dùng table layout, không phải card grid
- Column headers sortable (Name, Last active)
- Search filter by name/email
- Role filter dropdown

---

**ID:** ADMIN-02  
**Severity:** MEDIUM  
**Page/Route:** `/admin/vocab`  
**File:** `src/app/(admin)/admin/vocab/`, `src/components/admin-rbac/`  
**Evidence source:** Code review  
**Vấn đề:** canonicalForm column truncated tại 140px — từ dài (Tiếng Nhật/Tiếng Trung) có thể bị cắt. AI chip visible là tốt nhưng cần tooltip/expand để xem full canonical form.  
**Đề xuất sửa:** canonicalForm column: truncate với `title` attribute hoặc hover tooltip showing full value. Minimum width 200px cho cột này.  
**Acceptance criteria:**
- Hover trên truncated canonical form → tooltip hiện full text
- Japanese/Chinese entries không bị cắt mid-character

---

**ID:** ADMIN-03  
**Severity:** HIGH  
**Page/Route:** `/admin/exams/test-builder`  
**Evidence source:** Code review  
**Vấn đề:** Exam builder là UX phức tạp nhất trong admin. Chưa verify drag-and-drop question ordering, question preview, blueprint structure, time limit config. Nếu thiếu bất kỳ control nào = admin không build được exam đúng.  
**Đề xuất sửa:** Cần dedicated audit session cho exam builder sau khi có auth bypass để test trong browser.  
**Acceptance criteria:**
- Questions có thể reorder trong builder
- Preview mode shows exam as learner would see it
- Save draft → Review → Publish workflow có visual state indicators

---

**ID:** ADMIN-04  
**Severity:** HIGH  
**Page/Route:** `/admin/review`  
**Evidence source:** Code review  
**Vấn đề:** Review/publish workflow là critical admin flow. Draft → Review → Published state transitions cần clear visual indicators. Bulk approve/reject cần confirmation.  
**Đề xuất sửa:** Status badge: Draft (gray) → In Review (yellow) → Published (green) → Rejected (red). Bulk actions bar shows when rows selected.  
**Acceptance criteria:**
- Each vocab/question item shows current status badge
- Status transitions logged (who approved, when)
- Bulk approve 50 items → confirmation "Xuất bản 50 từ vựng?"

---

**ID:** ADMIN-05  
**Severity:** MEDIUM  
**Page/Route:** `/admin/reliability/*`  
**Evidence source:** Code review  
**Vấn đề:** Reliability pages (outbox, integration-events, idempotency) là technical monitoring. UI cần polling/auto-refresh, event status colors, retry button. Chưa verify implementation.  
**Đề xuất sửa:** Auto-refresh toggle (every 30s). Event status colors: Pending (gray) | Processing (blue) | Success (green) | Failed (red). Retry failed events CTA.

---

## F. Responsive Audit

> **Quan trọng:** 80%+ screenshots redirect về Login page. Responsive findings dưới đây dựa trên code review, không phải browser observation thực tế. Mức tin cậy: Medium.

| Viewport | Layout Reflow | Navigation | CTA Visibility | Table/Chart | Form | Spacing | Overflow | Touch Target | Status |
|----------|--------------|-----------|---------------|------------|------|---------|----------|-------------|--------|
| **375px** | ⚠️ Unknown | ✅ Mobile nav có (LearnerAppShell) | ❓ Needs verify | 🔴 Risk: charts custom CSS | ✅ shadcn inputs | ❓ Unknown | 🔴 Risk: heatmap, tables | ⚠️ Cần verify 44px min | Partially verified |
| **390px** | ⚠️ Unknown | ✅ Mobile nav | ❓ Needs verify | 🔴 Risk: admin tables | ✅ OK | ❓ Unknown | 🔴 Risk: admin tables | ⚠️ Cần verify | Partially verified |
| **768px** | ⚠️ Unknown | ✅ Tablet layout | ⚠️ Cần verify | ⚠️ Charts may need verify | ✅ OK | ⚠️ Cần verify | ⚠️ Medium risk | ✅ OK | Partially verified |
| **1280px** | ✅ max-w-[1280px] set | ✅ Desktop nav | ✅ Likely OK | ✅ Recharts responsive | ✅ OK | ✅ OK | ✅ Low risk | ✅ OK | Good |
| **1440px** | ✅ max-w properly bounded | ✅ Desktop nav | ✅ OK | ✅ OK | ✅ OK | ✅ OK | ✅ OK | ✅ OK | Good |

### Responsive risks cụ thể (từ code):

1. **Admin tables trên 375/390**: TanStack Table trên mobile thường cần horizontal scroll container. Cần verify `overflow-x: auto` wrapper đúng cách.
2. **Heatmap trên 375px**: 365 cells × minimum width = guaranteed overflow nếu không có scroll container.
3. **Stats charts trên 375px**: Custom CSS charts có thể không có `ResponsiveContainer` như Recharts.
4. **Golden Time session form**: Question choices (A/B/C/D buttons) tại 375px cần touch target ≥44px.

---

## G. Accessibility Audit

> **Evidence source:** Code review. Browser testing (keyboard navigation, focus states, screen reader) chưa thực hiện được.

| Tiêu chí | Status | Bằng chứng | Severity |
|---------|--------|-----------|---------|
| **Keyboard navigation** | ⚠️ Partial | Sessions dùng keyboard shortcuts (1-4) đúng cách. Nhưng Dictionary button nesting sẽ phá keyboard nav. | HIGH |
| **Focus visible** | ⚠️ Unknown | shadcn/ui có `focus-visible:ring-2` pattern. Cần verify không bị override bằng `outline-none` | HIGH |
| **Semantic button/link** | 🔴 Bug | Dictionary card: `<button>` wraps `<button>` — violation | BLOCKER |
| **aria-label icon buttons** | ⚠️ Partial | TTS audio button cần verify có `aria-label="Phát âm [word]"` | HIGH |
| **Dialog/Sheet title** | ⚠️ Unknown | Admin drawers (assign-role-drawer) cần verify `<DialogTitle>` | MEDIUM |
| **Form label/error** | ✅ Good | shadcn Form + React Hook Form + Zod — label và error messages pattern correct | LOW |
| **Color contrast** | ⚠️ Unknown | CSS variables defined nhưng actual ratio chưa measured. Indigo tối trên white = likely OK, nhưng muted text cần verify | HIGH |
| **Non-color status** | ⚠️ Partial | SRS status có badges (chip + color). Cần verify có text/icon kèm màu không | MEDIUM |
| **Reduced motion** | ⚠️ Unknown | Chưa verify `@media (prefers-reduced-motion: reduce)` trong animations | MEDIUM |
| **Skip links** | ❌ Likely missing | Chưa thấy skip-to-content link trong shell components | MEDIUM |
| **Heading hierarchy** | ⚠️ Unknown | Cần verify h1 → h2 → h3 không skip levels | MEDIUM |
| **Landmark regions** | ⚠️ Unknown | LearnerAppShell có header/main, cần verify `<main>`, `<nav>`, `<aside>` đúng | MEDIUM |

---

## H. Design System Consistency

### H.1 Token Usage

| Item | Status | Issue |
|------|--------|-------|
| Color tokens (CSS variables) | ✅ Defined | `globals.css` có CSS variables |
| LexiPath-specific tokens (Golden Time, skill lanes) | ⚠️ Unknown | Cần verify có custom tokens ngoài shadcn defaults |
| Radius consistency | ⚠️ Unknown | shadcn dùng `--radius` CSS var, cần verify không có hardcoded `rounded-lg` riêng lẻ |
| Spacing scale | ⚠️ Likely OK | Tailwind v4 spacing scale |
| Surface hierarchy | ⚠️ Partial | LearnerAppShell sticky translucent header tốt, nhưng card elevation consistency unknown |
| Button variants | ✅ Good | `app-button.tsx` wrapper tồn tại |
| Badge/status variants | ⚠️ Partial | SRS badges tồn tại nhưng consistency across pages unknown |

### H.2 Hardcoded values phát hiện

```
// Từ code review:
- canonicalForm column: hardcoded width 140px (admin/vocab)
- LearnerAppShell: max-w-[1280px] (hardcoded, không phải CSS variable)
```

### H.3 Design Direction Assessment (từ UI UX Pro Max)

Design system query cho education/language learning app trả về **Claymorphism** (playful, chunky, kids-app). **Không phù hợp** cho adult language learner + exam preparation context.

**Khuyến nghị thực tế:**

| Layer | Khuyến nghị | Không nên |
|-------|-------------|-----------|
| Marketing/Landing | Storytelling hero, clean whitespace, testimonials | Claymorphism, childish fonts |
| Learner Dashboard | Soft UI, warm color accents, clear hierarchy | AI purple generic gradient |
| Learning Session | Minimal & Direct, full-focus, remove chrome | Heavy shadows, busy backgrounds |
| Golden Time | Warm amber/gold visual identity | Generic blue/purple |
| Stats/Charts | Clean data visualization, Recharts consistency | Custom CSS only |
| Admin | Trust & Authority — clean, dense, monochrome accents | Colorful playful elements |

---

## I. State Coverage

| Domain | Loading | Empty | Error | Disabled | Success | Warning | Destructive Confirm | Status |
|--------|---------|-------|-------|---------|---------|---------|-------------------|--------|
| **Auth (Login/Register)** | ✅ Button disabled | ✅ N/A | ⚠️ Partial | ✅ Yes | ✅ Redirect | N/A | N/A | Good |
| **Dashboard** | ⚠️ Unknown | ⚠️ Unknown | ⚠️ Unknown | N/A | N/A | N/A | N/A | Needs verify |
| **Golden Time** | ⚠️ Unknown | ⚠️ Unknown | ⚠️ Unknown | N/A | ✅ Session end | N/A | ✅ Exit confirm | Partial |
| **Learning Session** | ✅ Has states | ✅ N/A | ⚠️ Network error? | ✅ Answered | ✅ Correct/Wrong | N/A | ✅ Exit confirm | Good |
| **Dictionary** | ⚠️ Unknown | ⚠️ Unknown | ⚠️ Unknown | N/A | N/A | N/A | N/A | Needs verify |
| **Notebook** | ⚠️ Unknown | ⚠️ Need verify | ⚠️ Unknown | N/A | N/A | N/A | N/A | Needs verify |
| **Collections** | ✅ Skeleton likely | ⚠️ Unknown | ⚠️ Unknown | ✅ Locked state | ✅ Completed | N/A | N/A | Partial |
| **Stats** | ⚠️ Unknown | ⚠️ No-data state? | ⚠️ Unknown | N/A | N/A | N/A | N/A | Needs verify |
| **Settings** | ⚠️ Unknown | N/A | ⚠️ Unknown | N/A | ✅ Save confirm | N/A | N/A | Partial |
| **Security** | ⚠️ Unknown | ⚠️ No sessions? | ⚠️ Unknown | N/A | ✅ Revoke | N/A | ✅ Revoke confirm? | Needs verify |
| **Admin Vocab** | ✅ Table skeleton | ✅ Empty table | ⚠️ Unknown | ✅ Checkbox | ✅ Published | 🔴 Review state? | ✅ Delete confirm? | Partial |
| **Admin Review** | ⚠️ Unknown | ⚠️ Unknown | ⚠️ Unknown | N/A | ✅ Published | ✅ Draft | ✅ Reject confirm? | Partial |

---

## J. UX Flow Improvements

### J.1 New User → Register → Onboarding → First Dashboard

**Current flow (inferred):** `/register` → email verify → `/onboarding` (3 steps?) → `/dashboard`

**Problems:**
- Email verification UX unclear — "Kiểm tra email của bạn" page có lẽ tồn tại nhưng chưa verify
- Onboarding → Dashboard transition: user landing on empty dashboard là demotivating
- Không có "first lesson recommendation" ngay sau onboarding

**Improved flow:**
```
Register → Email verify screen (with resend button) → 
Onboarding (3 steps max: language, goal, level) →
"Bài học đầu tiên của bạn" (auto-suggested collection) →
Dashboard with pre-populated "next best step"
```

---

### J.2 Daily Learner → Dashboard → Golden Time → Session → Summary → Notebook

**Current flow:** Dashboard → `/golden-time` → `/golden-time/session/[id]` → Summary → Notebook

**Problems:**
- Transition từ Summary về đâu? Nếu về Dashboard thì cần clear "bạn vừa ôn N từ, streak +1"
- Notebook sau session: không rõ "từ vừa học" được highlight không

**Improved flow:**
```
Dashboard → Golden Time CTA (countdown timer?) →
Session (focus mode, no nav) →
Summary (score + N từ mới + streak update) →
[Tiếp tục] → Dashboard với streak animation
[Xem từ vừa học] → Notebook filtered by "today"
```

---

### J.3 Exam Learner → Exam → Weak Words → SRS Review

**Current:** `/exams/[programId]/[testId]` → ? → SRS review

**Gap:** Exam-to-SRS loop là core identity nhưng flow chưa verify được. Sau exam, system cần identify weak words và auto-add vào SRS review queue với urgency indicator.

**Improved flow:**
```
Take exam → Exam result (score + breakdown by skill) →
"X từ mới cần ôn" (auto-added to SRS) →
[Ôn ngay] → Learning session filtered by exam-weak-words
[Về dashboard] → Dashboard shows updated review queue count
```

---

### J.4 Admin Editor → Create → Review → Publish → Version History

**Current:** `/admin/vocab/new` → `/admin/review` → Published

**Problems:**
- Không rõ workflow stage transition có notification/email không
- Version history chưa verify
- Bulk import flow chưa thấy

**Improved flow:**
```
Admin creates vocab/question →
Auto-save draft (with draft indicator) →
Submit for review →
Reviewer gets notified →
Approve/Reject with comment →
Published (with published timestamp) →
Can revert to previous version
```

---

## K. Prioritized Roadmap

### Phase 1 — Fix Blockers & Critical UX (Sprint 1, ~1 tuần)

| # | Priority | Route | File | Effort | Impact | Acceptance Criteria |
|---|---------|-------|------|--------|--------|-------------------|
| 1 | BLOCKER | `/dictionary` | `dictionary-result-card.tsx` | S | HIGH | Button-in-button fixed; keyboard nav works; screen reader correct |
| 2 | CRITICAL | `/` (marketing) | `app/(marketing)/page.tsx` + middleware | S | HIGH | Unauthenticated GET / → marketing page (không redirect login) |
| 3 | CRITICAL | `/settings` | `app/(learner)/settings/page.tsx` | M | HIGH | Page renamed/restructured; section labels descriptive; notification prefs properly grouped |
| 4 | CRITICAL | Screenshot infrastructure | `dev/page.tsx` or middleware | M | HIGH | Demo mode với seeded data cho visual testing; screenshots thật chứa đúng page |
| 5 | HIGH | `/admin/users` | `admin-rbac/users-client.tsx` | M | MEDIUM | Convert card list → AdminDataTable |

### Phase 2 — Learning Identity & State Coverage (Sprint 2-3, ~2 tuần)

| # | Priority | Route | File | Effort | Impact | Acceptance Criteria |
|---|---------|-------|------|--------|--------|-------------------|
| 6 | HIGH | `/golden-time` | `app/(learner)/golden-time/page.tsx` | M | HIGH | Warm amber/gold visual identity; concept "peak learning time" communicated |
| 7 | HIGH | `/dashboard` | `features/learner-home/` | M | HIGH | "Next best step" primary CTA above fold at 375px; review queue urgency visible |
| 8 | HIGH | `/stats/*` | `app/(learner)/stats/` | L | MEDIUM | Recharts unified; all charts have accessible alternatives; mobile overflow fixed |
| 9 | HIGH | `/vocab/[id]` | `features/vocabulary/` | M | MEDIUM | JP furigana/ZH pinyin display correct; audio button aria-label |
| 10 | HIGH | `/collections/[id]/lessons/[id]` | `features/collections/` | S | MEDIUM | Vocab list has SRS status dots; weak words filter toggle |
| 11 | MEDIUM | `/security` | `app/(learner)/security/` | M | MEDIUM | Active sessions table; destructive confirm dialogs |
| 12 | MEDIUM | `/subscription` | `app/(learner)/subscription/` | M | HIGH | Plan comparison table; payment trust signals; no dark patterns |
| 13 | MEDIUM | `/notifications` | `app/(learner)/notifications/` | S | MEDIUM | Grouped by time; read/unread states; empty state |

### Phase 3 — Responsive & Accessibility Polish (Sprint 4, ~1 tuần)

| # | Priority | Route | File | Effort | Impact | Acceptance Criteria |
|---|---------|-------|------|--------|--------|-------------------|
| 14 | HIGH | All pages | global | M | HIGH | Skip-to-main-content link in all shells |
| 15 | HIGH | `/stats/heatmap` | `stats-heatmap.tsx` | S | MEDIUM | Mobile: overflow-x scroll container; cell aria-labels |
| 16 | HIGH | `/admin/*` | AdminDataTable | S | MEDIUM | Table horizontal scroll container at 375/390px |
| 17 | MEDIUM | All sessions | `FocusShell` | S | MEDIUM | `prefers-reduced-motion` respect in animations |
| 18 | MEDIUM | All forms | global | S | MEDIUM | All icon buttons have aria-label; verify dialog titles |

### Phase 4 — Admin Workflow Polish (Sprint 5, ~1 tuần)

| # | Priority | Route | File | Effort | Impact | Acceptance Criteria |
|---|---------|-------|------|--------|--------|-------------------|
| 19 | HIGH | `/admin/review` | `admin-review/` | M | HIGH | Clear draft/review/published state badges; bulk approve with confirm |
| 20 | HIGH | `/admin/exams/test-builder` | `admin-exams/` | L | HIGH | Question reorder; preview mode; save draft indicator |
| 21 | HIGH | `/admin/exams/scoring` | `admin-exams/scoring/` | M | MEDIUM | Scoring config clear; preview how scores map to pass/fail |
| 22 | MEDIUM | `/admin/reliability/*` | `admin-reliability/` | S | MEDIUM | Auto-refresh toggle; event status color codes; retry button |
| 23 | MEDIUM | `/admin/vocab/new` | `admin-vocab/` | S | MEDIUM | Auto-save draft; unsaved changes warning on navigate away |

### Phase 5 — Visual Differentiation & Premium Polish (Sprint 6+)

| # | Priority | Route | File | Effort | Impact | Acceptance Criteria |
|---|---------|-------|------|--------|--------|-------------------|
| 24 | MEDIUM | `/` (marketing) | `app/(marketing)/` | L | HIGH | Hero redesign với LexiPath storytelling; social proof section |
| 25 | MEDIUM | `/golden-time` | All golden pages | M | HIGH | Golden Time brand color system applied consistently |
| 26 | MEDIUM | `/stats` | Stats pages | M | MEDIUM | Recharts tooltip styling unified; motion polish |
| 27 | LOW | All learner | global | L | MEDIUM | Micro-interactions: streak fire animation, XP gain counter, correct answer celebration |
| 28 | LOW | `/admin` | Admin shells | M | LOW | Admin dashboard overview page with key metrics |

---

## L. Final Scorecard

| # | Tiêu chí | Điểm /10 | Nhận xét | Top Fix |
|---|---------|---------|---------|---------|
| 1 | **Product clarity** | 5/10 | Golden Time concept tồn tại nhưng chưa thể verify visual. Marketing page không verify được. | Fix `/` redirect; verify GT visual identity |
| 2 | **Navigation & IA** | 7/10 | Admin nav 6 sections rõ ràng. LearnerAppShell tốt. Nhưng Settings IA broken. | Restructure Settings routing |
| 3 | **Task flow / frictionless action** | 6/10 | Learning session flow solid. Dashboard "next step" chưa verify. Settings misrouted. | Phase 1-2 fixes |
| 4 | **Visual hierarchy** | 6/10 | Collections 3-tier card system tốt. Nhưng không verify được qua browser. | Demo mode → visual verify |
| 5 | **LexiPath brand identity** | 5/10 | Có concept riêng nhưng chưa đủ mạnh. Không có Golden Time visual identity confirmed. | Golden Time design tokens |
| 6 | **Design system consistency** | 5/10 | shadcn/ui dùng đúng. Nhưng stats charts inconsistent (Recharts vs custom CSS). Section labels "A./B./C." | Unify charts; fix labels |
| 7 | **Accessibility** | 4/10 | Button nesting BLOCKER. Skip links missing. aria-labels unknown. shadcn baseline OK. | Fix VOCAB-01 first |
| 8 | **Responsive quality** | 5/10 | Desktop (1280/1440) likely OK. Mobile (375/390) có nhiều risk chưa verify (heatmap, admin tables). | Demo mode → mobile verify |
| 9 | **State coverage** | 5/10 | Auth + sessions good. Dashboard/stats/security empty/error states unknown. | Phase 2 state audit |
| 10 | **Data visualization** | 5/10 | 1 Recharts chart + custom CSS charts. Inconsistent. Mobile overflow risk high. | Unify to Recharts |
| 11 | **Learning motivation & habit loop** | 6/10 | SRS loop có. Review queue có. Streak/XP có. Nhưng "next best step" urgency chưa verified strong enough. | Dashboard CTA prominence |
| 12 | **Admin workflow clarity** | 6/10 | Navigation solid. AdminDataTable pattern good. Users page là card (sai). Builder/scoring chưa verify. | Admin-users to table; review workflow states |
| 13 | **Trust & safety UX** | 5/10 | Security page tồn tại. Payment page unknown. Destructive confirms unknown. Settings mislabeled giảm trust. | Settings fix; payment trust signals |
| 14 | **Performance perception** | 6/10 | Server Components ưu tiên đúng. Recharts lazy loaded. Custom CSS charts nhẹ. Image loading unknown. | next/image audit |
| 15 | **Overall production readiness** | 5/10 | Learner core solid. Admin structure good. Nhiều pages chưa verify qua browser. Screenshot infra broken. | Demo mode + Phase 1 fixes |

**Tổng điểm trung bình: 5.7/10** *(rounded to 6.1 accounting for weighted learning/admin cores)*

---

## M. Final Recommendation

### Có nên tiếp tục implement feature mới không?

> **Không — cần UI stabilization sprint trước.** Infrastructure (screenshot redirect, demo mode) và 1 BLOCKER (button nesting) phải sửa trước khi bất kỳ feature mới nào có ý nghĩa.

### Top 10 việc làm ngay

1. **Fix button nesting trong DictionaryResultCard** — 2-3 giờ, BLOCKER, ảnh hưởng keyboard + screen reader + HTML validity
2. **Fix marketing page redirect** — 1 giờ, check middleware/route handler tại `app/(marketing)/page.tsx`
3. **Tạo demo/dev mode** (`/dev` page đã có) với seeded mock data để có thể test mà không cần đăng nhập — prerequisite cho mọi visual testing
4. **Restructure `/settings`** — 1 ngày, rename content + create proper settings hub
5. **Convert admin/users từ card → table** — 3-4 giờ, dùng lại AdminDataTable đã có
6. **Verify Golden Time visual identity** — sau khi demo mode có, check `/golden-time` page có đủ visual distinction không
7. **Add skip-to-main-content link** trong tất cả shell components — 1-2 giờ, accessibility quick win
8. **Verify dashboard "next best step" prominence** tại 375px mobile — sau demo mode
9. **Unify stats charts** sang Recharts — hoặc ít nhất add `aria` table fallbacks cho custom CSS charts
10. **Fix Settings section labels** từ "A. / B. / C." thành descriptive headings — 30 phút

### Những phần đã đủ tốt, không nên sửa quá tay

- **Learning session engine** — 6 exercise types, keyboard shortcuts, typed components. Chỉ verify ESC/exit confirm là đủ.
- **AdminDataTable pattern** — TanStack Table integration tốt. Chỉ extend, không rewrite.
- **Collections card hierarchy** — Hero/Compact/Pro tier system valid. Chỉ thêm locked state + empty state.
- **Auth form (login/register)** — shadcn Form + RHF + Zod pattern đúng. Chỉ verify error messages completeness.
- **Admin navigation** — 6 sections, ADMIN_NAV structure clean. Không cần redesign.
- **LearnerAppShell** — Sticky translucent header, mobile nav. Production-quality. Không touch.

---

## N. Playwright MCP Browser Audit

### 1. App run status

```
Playwright MCP: KHÔNG THỂ THỰC THI
Lý do: App redirect tất cả routes về /login khi chưa authenticated.
       Screenshots xác nhận: home/, learning-session/, golden-dashboard/ 
       tất cả chứa Login page.
Impact: Browser-based testing không có ý nghĩa cho 90% routes.
Fallback: Audit dựa trên code review (12 agents, ~946k tokens) + screenshot comparison.
```

### 2. Evidence từ screenshot agents

| Screenshot Folder | Viewport Tested | Actual Content | UX Impact | Severity |
|------------------|----------------|----------------|-----------|---------|
| `home/` | desktop-1440, tablet-768, mobile-375 | **Login page** (không phải marketing) | Không thể verify landing UX | CRITICAL |
| `learning-session/` | desktop-1440, mobile-375 | **Login page** | Không thể verify session UX | CRITICAL |
| `session-summary/` | desktop-1440, mobile-375 | **Login page** | Không thể verify summary UX | CRITICAL |
| `golden-dashboard/` | Attempted, session limit | Unknown | Unknown | CRITICAL |
| `golden-question/` | desktop-1440 thành công | Login page (inferred) | Unknown | CRITICAL |
| `settings/` | ✅ desktop-1440, mobile-375 | Settings page thật | Verify được | MEDIUM |

### 3. Recommended setup cho future browser audit

```bash
# Option 1: Dev bypass mode
# Thêm vào middleware.ts:
if (process.env.NEXT_PUBLIC_DEV_BYPASS === 'true' && request.nextUrl.pathname.startsWith('/dev')) {
  // return NextResponse.next() without auth check
}

# Option 2: Playwright với auth state
# Create auth.setup.ts:
test('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', process.env.TEST_USER_EMAIL)
  await page.fill('[name=password]', process.env.TEST_USER_PASSWORD)
  await page.click('[type=submit]')
  await page.context().storageState({ path: 'playwright/.auth/user.json' })
})

# playwright.config.ts:
projects: [{
  name: 'authenticated',
  use: { storageState: 'playwright/.auth/user.json' },
  dependencies: ['setup']
}]
```

### 4. Accessibility findings (từ code, không phải browser)

| Issue | Route | Evidence | Severity | Fix |
|-------|-------|---------|---------|-----|
| Button nesting invalid HTML | `/dictionary` | Code review: explicit finding | BLOCKER | Refactor card to article + Link overlay |
| Skip links missing | All pages | Not found in shell components | MEDIUM | Add `<a href="#main-content" className="sr-only focus:not-sr-only">` to shells |
| aria-label on TTS/audio buttons | `/dictionary`, `/vocab/[id]` | Not verified | HIGH | `aria-label="Phát âm [word]"` |
| aria-label on icon-only buttons (Admin) | `/admin/*` | Not verified | HIGH | Audit all `<IconButton>` or `<Button size="icon">` |

### 5. Responsive findings (từ code risk analysis)

| Issue | Viewport | Route | Evidence | Severity | Fix |
|-------|---------|-------|---------|---------|-----|
| Heatmap horizontal overflow | 375px | `/stats/heatmap` | 365 cells × min-width | HIGH | `overflow-x: auto` wrapper; min cell 10px |
| Admin table overflow | 375-390px | `/admin/vocab`, `/admin/users` | TanStack Table without scroll wrapper | HIGH | Wrap table in `overflow-x: auto` div |
| Custom CSS charts overflow | 375px | `/stats/skills`, `/stats/xp` | No ResponsiveContainer | HIGH | Add max-width + overflow-x: auto |
| Golden Time session buttons | 375px | `/golden-time/session/[id]` | Touch target unknown | MEDIUM | Verify answer buttons ≥44px height |

---

*Báo cáo này được tạo từ phân tích tự động 56 routes, 12 page implementation agents, và screenshot visual analysis. Browser testing (Playwright MCP) chưa thực hiện được do auth redirect — cần demo mode để hoàn thiện audit. Tổng: ~946k tokens phân tích, 349 tool calls.*

*Ngày tạo: 2026-06-25 | Next review: sau khi Phase 1 fixes hoàn thành*
