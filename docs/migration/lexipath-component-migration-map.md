# LexiPath — Component Migration Map

> **Mục đích:** Bản đồ migrate toàn bộ component từ design kit cũ sang `lexipath-frontend`.
> **Phạm vi prompt này:** CHỈ lập tài liệu mapping. **Không** migrate code ở bước này.

---

## 0. Nguồn & quy ước

### Đường dẫn thật

| Khai báo trong CLAUDE.md | Đường dẫn thật trên máy |
|---|---|
| `DESIGN_SOURCE_DIR=./lexipath-vocabulary-web-kit` | `/Users/vanhuu/Downloads/lexipath-vocabulary-web-kit` |

> ⚠️ **Rủi ro:** Folder thiết kế hiện **nằm ngoài repo** (`~/Downloads`), không phải trong `lexipath-frontend`. Trước khi migrate nên copy/đối chiếu vào trong repo (ví dụ `design-source/`) hoặc cố định một bản snapshot, để mọi path trong tài liệu này khớp tuyệt đối với `DESIGN_SOURCE_DIR`.

### Hiện trạng kit cũ (điều mọi component đều phải xử lý)

Mỗi component trong kit là `.jsx` + **inline `style={{…}}`** dùng CSS variables (`var(--primary)`, `var(--radius-card)`…). Ví dụ thực tế từ `core/Button.jsx`, `learning/VocabItemCard.jsx`, `admin/AdminDataTable.jsx`. Do đó **MỌI component khi migrate đều bắt buộc:**

1. Đổi `.jsx` → **`.tsx`** + type đầy đủ cho props (cấm `any`).
2. Bỏ inline `style` → **Tailwind v4 utilities** + `cn()` + `cva()` cho variant. Giữ CSS variables LexiPath qua token Tailwind / `globals.css`.
3. Thay icon ký tự / emoji (`✓`, `↑`) → **`lucide-react`**.
4. Ưu tiên **shadcn/ui + Radix** thay vì primitive tự viết.
5. Tách file > ~200 dòng.
6. Tách **DTO ↔ UI type** + **mapper** nếu có dữ liệu backend.
7. Giữ **LexiPath identity** (learning path, Golden Time, skill lanes, next best step, exam→SRS, review queue).
8. `"use client"` chỉ khi cần (hooks/event/form/Radix tương tác/Zustand/Query).

### Chú thích cột bảng

| Cột | Nghĩa |
|---|---|
| **Old component** | Tên export trong kit |
| **Old path** | Đường dẫn trong `DESIGN_SOURCE_DIR` |
| **New path** | Đích trong `src/` |
| **Nhóm** | `shared` / `layout` / `lexipath identity` / `feature` |
| **Lib** | Thư viện nên dùng |
| **Split** | Có cần chia nhỏ (>200 dòng / nhiều phần) |
| **Type** | Có cần UI/domain type riêng |
| **DTO** | Có cần DTO backend + mapper |
| **Status** | TODO (tất cả) |
| **Rủi ro** | Ghi chú |

> **shadcn đã cài sẵn** trong `src/components/ui/`: `avatar, badge, button, card, dialog, dropdown-menu, input, progress, select, separator, sheet, skeleton, table, tabs, textarea, tooltip`.
> **Cần `add` thêm:** `checkbox, radio-group, switch, command, sonner (toast), accordion, breadcrumb, form, label, popover`.

---

## 1. Cấu trúc thư mục chuẩn đề xuất

Tuân thủ `docs/architecture/folder-rules.md` (không monorepo / apps / packages / workspace / pnpm).

```txt
src/
├── app/                      # Next.js App Router (route groups: (marketing) (learner) (admin) (auth))
├── components/
│   ├── ui/                   # shadcn primitives (core/* map về đây)
│   ├── shared/               # state/badge/empty/error tái dùng nhiều feature (feedback/*)
│   ├── layouts/              # shells + navigation (layout/* + navigation/*)
│   └── lexipath/             # LexiPath identity: journey, golden time, skill lane, next best step
├── features/
│   ├── auth/                 # auth + onboarding
│   ├── marketing/            # landing page (MỚI — chưa có)
│   ├── vocabulary/           # vocab item / collection / notebook entity
│   ├── learning/             # session player, dashboard, stats, golden time
│   ├── notebook/             # sổ tay từ vựng (MỚI — chưa có)
│   ├── exam/                 # exam catalog + builder + qbank
│   ├── admin/                # admin shell, datatable, editors
│   ├── payment/              # subscription, plan, transaction (MỚI — chưa có)
│   └── security/             # device session, security event, account lock (MỚI — chưa có)
├── hooks/
├── lib/
│   ├── api/                  # http-client.ts (đã có), api-error.ts (đã có)
│   ├── styles/
│   └── utils/                # cn.ts (đã có)
├── styles/                   # globals.css + tokens (đã có)
├── types/
├── constants/
└── config/
```

Mỗi feature theo chuẩn CLAUDE.md:

```txt
src/features/<feature>/
├── api/      <feature>.api.ts · <feature>.dto.ts · <feature>.mapper.ts
├── components/
├── hooks/    (TanStack Query)
├── schemas/  (Zod)
├── types/    (UI/domain model)
└── index.ts
```

> **Hiện trạng `src/features`:** đã có `admin, auth, exam, learning, vocabulary`. **Cần tạo mới:** `marketing, notebook, payment, security`.

---

## 2. Bảng migrate theo nhóm

> Status mọi dòng = **TODO**. (`Split/Type/DTO`: Y = cần, N = không.)

### 2.1 core (19) → `components/ui` — Nhóm: shared

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| Button | `components/core/Button.jsx` | `components/ui/button.tsx` | shadcn button + **cva** | N | Y | N | **Identity-critical:** giữ variant `nextStep/golden/path/quiet` bằng `cva`; cấm dùng `primary` cho next-step/golden |
| Card | `components/core/Card.jsx` | `components/ui/card.tsx` | shadcn card | N | Y | N | Dùng nhiều nhất (270 refs); chuẩn hóa padding qua token |
| Badge | `components/core/Badge.jsx` | `components/ui/badge.tsx` | shadcn badge + cva | N | Y | N | 196 refs; map tone sang variant |
| Input | `components/core/Input.jsx` | `components/ui/input.tsx` | shadcn input | N | Y | N | Ghép với shadcn Form khi vào form |
| Textarea | `components/core/Textarea.jsx` | `components/ui/textarea.tsx` | shadcn textarea | N | Y | N | — |
| Select | `components/core/Select.jsx` | `components/ui/select.tsx` | shadcn select (Radix) | N | Y | N | Native `<select>` → Radix; giữ keyboard |
| Checkbox | `components/core/Checkbox.jsx` | `components/ui/checkbox.tsx` | shadcn checkbox (add) | N | Y | N | `accentColor` inline → Radix |
| RadioGroup | `components/core/RadioGroup.jsx` | `components/ui/radio-group.tsx` | shadcn radio-group (add) | N | Y | N | — |
| Switch | `components/core/Switch.jsx` | `components/ui/switch.tsx` | shadcn switch (add) | N | Y | N | 12 refs (settings) |
| Progress | `components/core/Progress.jsx` | `components/ui/progress.tsx` | shadcn progress | N | Y | N | — |
| ProgressRing | `components/core/ProgressRing.jsx` | `components/ui/progress-ring.tsx` | **Custom SVG** + Tailwind | N | Y | N | Không có shadcn tương đương; giữ SVG ring, type `value/size/stroke` |
| Separator | `components/core/Separator.jsx` | `components/ui/separator.tsx` | shadcn separator | N | N | N | — |
| Sheet | `components/core/Sheet.jsx` | `components/ui/sheet.tsx` | shadcn sheet (Radix) | N | N | N | — |
| Dialog | `components/core/DropdownMenu.jsx`→ | — | — | — | — | — | (xem DropdownMenu) |
| DropdownMenu | `components/core/DropdownMenu.jsx` | `components/ui/dropdown-menu.tsx` | shadcn dropdown-menu | N | N | N | — |
| IconButton | `components/core/IconButton.jsx` | `components/ui/button.tsx` (`size="icon"`) | shadcn button variant | N | N | N | Gộp vào Button; **bắt buộc `aria-label`** |
| Tooltip | `components/core/Tooltip.jsx` | `components/ui/tooltip.tsx` | shadcn tooltip | N | N | N | — |
| Toast | `components/core/Toast.jsx` | `components/ui/sonner.tsx` | shadcn **sonner** (add) | N | N | N | Đổi sang sonner; provider ở `src/providers` |
| CommandSearch | `components/core/CommandSearch.jsx` | `components/ui/command.tsx` | shadcn **command** (cmdk, add) | Y | Y | N | Dùng lại cho notebook `DictionarySearchCommand` |

### 2.2 layout (5) + navigation (3) → `components/layouts` — Nhóm: layout

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| LearnerAppShell | `components/layout/LearnerAppShell.jsx` | `components/layouts/learner-app-shell.tsx` | TSX + Tailwind | Y | Y | N | **Learner KHÔNG dùng sidebar** (folder-rules); top nav only |
| FocusLearningShell | `components/layout/FocusLearningShell.jsx` | `components/layouts/focus-learning-shell.tsx` | TSX + Tailwind | Y | Y | N | **Không hiển thị main navigation** khi focus learning |
| MarketingShell | `components/layout/MarketingShell.jsx` | `components/layouts/marketing-shell.tsx` | TSX + Tailwind | N | Y | N | Header/footer marketing |
| PageHeader | `components/layout/PageHeader.jsx` | `components/layouts/page-header.tsx` | TSX + Tailwind | N | Y | N | 60 refs — API ổn định, làm sớm |
| Breadcrumb | `components/layout/Breadcrumb.jsx` | `components/ui/breadcrumb.tsx` | shadcn **breadcrumb** (add) | N | N | N | Dùng `next/link` |
| Sidebar | `components/navigation/Sidebar.jsx` | `components/layouts/admin-sidebar.tsx` | shadcn sidebar / TSX | Y | Y | N | **CHỈ admin** được dùng sidebar |
| TopBar | `components/navigation/TopBar.jsx` | `components/layouts/top-bar.tsx` (+ `Streak`, `XpPill` tách) | TSX + Tailwind | Y | Y | N | Audit gọi riêng `Streak`/`XpPill` — tách thành component con |
| Tabs | `components/navigation/Tabs.jsx` | `components/ui/tabs.tsx` | shadcn tabs | N | N | N | Trùng vai trò shadcn tabs |

### 2.3 feedback (13) → `components/shared` — Nhóm: shared

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| Dialog | `components/feedback/Dialog.jsx` | `components/ui/dialog.tsx` | shadcn dialog | N | N | N | **Bắt buộc title** (a11y) |
| UnsavedChangesDialog | `components/feedback/UnsavedChangesDialog.jsx` | `components/shared/unsaved-changes-dialog.tsx` | shadcn alert-dialog | N | Y | N | — |
| EmptyState | `components/feedback/EmptyState.jsx` | `components/shared/empty-state.tsx` | TSX + lucide | N | Y | N | 12 refs |
| ErrorState | `components/feedback/ErrorState.jsx` | `components/shared/error-state.tsx` | TSX + lucide | N | Y | N | — |
| LoadingSkeleton | `components/feedback/LoadingSkeleton.jsx` | `components/ui/skeleton.tsx` (wrap) | shadcn skeleton | N | N | N | — |
| LockedFeatureState | `components/feedback/LockedFeatureState.jsx` | `components/shared/locked-feature-state.tsx` | TSX + lucide | N | Y | N | Gắn entitlement/paywall |
| PermissionDeniedState | `components/feedback/PermissionDeniedState.jsx` | `components/shared/permission-denied-state.tsx` | TSX + lucide | N | Y | N | RBAC |
| DisabledActionState | `components/feedback/DisabledActionState.jsx` | `components/shared/disabled-action-state.tsx` | TSX | N | Y | N | — |
| SuccessToast | `components/feedback/SuccessToast.jsx` | `components/ui/sonner.tsx` (wrap) | shadcn sonner | N | N | N | Gộp vào Toast |
| StatusBadge | `components/feedback/StatusBadge.jsx` | `components/shared/status-badge.tsx` | shadcn badge + cva | N | Y | N | — |
| ContentStatusBadge | `components/feedback/ContentStatusBadge.jsx` | `components/shared/content-status-badge.tsx` | shadcn badge + cva | N | Y | N | 17 refs (admin); enum trạng thái content |
| PaymentStatusBadge | `components/feedback/PaymentStatusBadge.jsx` | `features/payment/components/payment-status-badge.tsx` | shadcn badge + cva | N | Y | N | Map enum payment backend |
| EntitlementBadge | `components/feedback/EntitlementBadge.jsx` | `features/payment/components/entitlement-badge.tsx` | shadcn badge + cva | N | Y | N | Gắn gói/quyền |

### 2.4 marketing (23) → `features/marketing/components` — Nhóm: feature (+ vài identity)

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| LandingHero | `components/marketing/LandingHero.jsx` | `features/marketing/components/landing-hero.tsx` | TSX + Tailwind + `next/image` | Y | Y | N | LCP — tối ưu ảnh hero |
| HeroProductMockup | `components/marketing/HeroProductMockup.jsx` | `features/marketing/components/hero-product-mockup.tsx` | TSX + `next/image` | Y | Y | N | Ảnh nặng |
| FloatingMetricCard | `components/marketing/FloatingMetricCard.jsx` | `features/marketing/components/floating-metric-card.tsx` | TSX | N | Y | N | — |
| MarketingShell→ | (xem layout) | — | — | — | — | — | — |
| MarketingSection | `components/marketing/MarketingSection.jsx` | `features/marketing/components/marketing-section.tsx` | TSX | N | Y | N | — |
| MarketingSectionHeader | `components/marketing/MarketingSectionHeader.jsx` | `features/marketing/components/marketing-section-header.tsx` | TSX | N | Y | N | — |
| MarketingEyebrowBadge | `components/marketing/MarketingEyebrowBadge.jsx` | `features/marketing/components/marketing-eyebrow-badge.tsx` | shadcn badge | N | N | N | — |
| ProblemCard | `components/marketing/ProblemCard.jsx` | `features/marketing/components/problem-card.tsx` | shadcn card | N | Y | N | — |
| SolutionStepCard | `components/marketing/SolutionStepCard.jsx` | `features/marketing/components/solution-step-card.tsx` | shadcn card | N | Y | N | — |
| TrustPillarCard | `components/marketing/TrustPillarCard.jsx` | `features/marketing/components/trust-pillar-card.tsx` | shadcn card | N | Y | N | — |
| DiagnosisCard | `components/marketing/DiagnosisCard.jsx` | `features/marketing/components/diagnosis-card.tsx` | shadcn card | N | Y | N | LexiPath: chẩn đoán trình độ |
| LanguageSupportCard | `components/marketing/LanguageSupportCard.jsx` | `features/marketing/components/language-support-card.tsx` | shadcn card | N | Y | N | EN/JP/CN context |
| PricingPlanCard | `components/marketing/PricingPlanCard.jsx` | `features/marketing/components/pricing-plan-card.tsx` | shadcn card + cva | N | Y | N⚠️ | Giá nên lấy từ API về sau → cân nhắc DTO khi nối backend |
| FAQAccordion | `components/marketing/FAQAccordion.jsx` | `features/marketing/components/faq-accordion.tsx` | shadcn **accordion** (add) | N | Y | N | — |
| FinalCTABand | `components/marketing/FinalCTABand.jsx` | `features/marketing/components/final-cta-band.tsx` | TSX | N | Y | N | — |
| PublicHeader | `components/marketing/PublicHeader.jsx` | `features/marketing/components/public-header.tsx` | TSX + `next/link` | N | Y | N | Gộp vào MarketingShell? |
| PublicFooter | `components/marketing/PublicFooter.jsx` | `features/marketing/components/public-footer.tsx` | TSX + `next/link` | N | Y | N | — |
| GoldenTimeExplainer | `components/marketing/GoldenTimeExplainer.jsx` | `components/lexipath/golden-time-explainer.tsx` | TSX | Y | Y | N | **Identity** Golden Time |
| GoldenTimeReasonCallout | `components/marketing/GoldenTimeReasonCallout.jsx` | `components/lexipath/golden-time-reason-callout.tsx` | TSX | N | Y | N | **Identity** |
| GoldenTimeQueuePreview | `components/marketing/GoldenTimeQueuePreview.jsx` | `components/lexipath/golden-time-queue-preview.tsx` | TSX | N | Y | N | **Identity** review queue |
| GoldenTimeWordCard | `components/marketing/GoldenTimeWordCard.jsx` | `components/lexipath/golden-time-word-card.tsx` | shadcn card | N | Y | N | **Identity** |
| LearningLoopFlow | `components/marketing/LearningLoopFlow.jsx` | `components/lexipath/learning-loop-flow.tsx` | TSX | Y | Y | N | **Identity** exam→SRS loop |
| ExamToSrsFlow | `components/marketing/ExamToSrsFlow.jsx` | `components/lexipath/exam-to-srs-flow.tsx` | TSX | Y | Y | N | **Identity** exam→SRS |
| ExamQuestionPreviewCard | `components/marketing/ExamQuestionPreviewCard.jsx` | `features/marketing/components/exam-question-preview-card.tsx` | shadcn card | N | Y | N | — |

### 2.5 auth (11) → `features/auth/components` — Nhóm: feature

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| AuthCard | `components/auth/AuthCard.jsx` | `features/auth/components/auth-card.tsx` | shadcn card + **Form** | N | Y | Y | 40 refs; **RHF + Zod**, login/register DTO |
| SocialLoginButton | `components/auth/SocialLoginButton.jsx` | `features/auth/components/social-login-button.tsx` | shadcn button + lucide | N | Y | N | OAuth providers |
| OnboardingStepLayout | `components/auth/OnboardingStepLayout.jsx` | `features/auth/components/onboarding-step-layout.tsx` | TSX | N | Y | N | 25 refs |
| OnboardingJourneyShell | `components/auth/OnboardingJourneyShell.jsx` | `features/auth/components/onboarding-journey-shell.tsx` | TSX | Y | Y | N | **Identity** journey |
| OnboardingPathPreview | `components/auth/OnboardingPathPreview.jsx` | `features/auth/components/onboarding-path-preview.tsx` | TSX | N | Y | Y | Preview lộ trình → path DTO |
| GoalChoiceCard | `components/auth/GoalChoiceCard.jsx` | `features/auth/components/goal-choice-card.tsx` | shadcn card (radio) | N | Y | N | — |
| LanguageChoiceCard | `components/auth/LanguageChoiceCard.jsx` | `features/auth/components/language-choice-card.tsx` | shadcn card (radio) | N | Y | N | EN/JP/CN |
| DailyGoalSelector | `components/auth/DailyGoalSelector.jsx` | `features/auth/components/daily-goal-selector.tsx` | shadcn radio-group | N | Y | N | — |
| ScriptPreferenceSelector | `components/auth/ScriptPreferenceSelector.jsx` | `features/auth/components/script-preference-selector.tsx` | shadcn radio-group | N | Y | N | Kanji/kana, hanzi/pinyin |
| SetupStepCard | `components/auth/SetupStepCard.jsx` | `features/auth/components/setup-step-card.tsx` | shadcn card | N | Y | N | — |
| VerificationStateCard | `components/auth/VerificationStateCard.jsx` | `features/auth/components/verification-state-card.tsx` | shadcn card | N | Y | N | Email verify states |

### 2.6 path (24) → `components/lexipath` + `features/learning` — Nhóm: lexipath identity

> **Toàn bộ nhóm này = LexiPath identity.** Tuyệt đối không biến thành SaaS card generic.

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| NextBestStepCard | `components/path/NextBestStepCard.jsx` | `components/lexipath/next-best-step-card.tsx` | shadcn card + cva | N | Y | Y | **Identity #1** "next best step"; tone nextStep/golden; DTO recommendation |
| NextStepCTA | `components/path/NextStepCTA.jsx` | `components/lexipath/next-step-cta.tsx` | shadcn button | N | Y | N | — |
| TodayCommandCenter | `components/path/TodayCommandCenter.jsx` | `features/learning/components/today-command-center.tsx` | TSX | Y | Y | Y | Tổng hợp due/golden/path → nhiều DTO |
| TodayPath | `components/path/TodayPath.jsx` | `features/learning/components/today-path.tsx` | TSX | Y | Y | Y | — |
| JourneyRail | `components/path/JourneyRail.jsx` | `components/lexipath/journey-rail.tsx` | TSX + Tailwind | Y | Y | Y | **Identity** journey; layout phức tạp |
| PathRail | `components/path/PathRail.jsx` | `components/lexipath/path-rail.tsx` | TSX | Y | Y | Y | — |
| PathCard | `components/path/PathCard.jsx` | `components/lexipath/path-card.tsx` | shadcn card | N | Y | Y | — |
| CheckpointNode | `components/path/CheckpointNode.jsx` | `components/lexipath/checkpoint-node.tsx` | TSX | N | Y | Y | **Identity** checkpoint |
| JourneyCheckpointCard | `components/path/JourneyCheckpointCard.jsx` | `components/lexipath/journey-checkpoint-card.tsx` | shadcn card | N | Y | Y | — |
| PageJourneyHeader | `components/path/PageJourneyHeader.jsx` | `components/lexipath/page-journey-header.tsx` | TSX | N | Y | N | 7 refs (v21 screens) |
| VocabLearningHeader | `components/path/VocabLearningHeader.jsx` | `features/learning/components/vocab-learning-header.tsx` | TSX | N | Y | N | — |
| SkillLaneGroup | `components/path/SkillLaneGroup.jsx` | `components/lexipath/skill-lane-group.tsx` | TSX | Y | Y | Y | **Identity** skill lanes |
| SkillProgressLane | `components/path/SkillProgressLane.jsx` | `components/lexipath/skill-progress-lane.tsx` | shadcn progress | N | Y | Y | **Identity** skill lane |
| SkillBranchPanel | `components/path/SkillBranchPanel.jsx` | `components/lexipath/skill-branch-panel.tsx` | TSX | Y | Y | Y | **Identity** |
| GoldenTimeWindow | `components/path/GoldenTimeWindow.jsx` | `components/lexipath/golden-time-window.tsx` | TSX | N | Y | Y | **Identity** Golden Time |
| GoldenQueuePreview | `components/path/GoldenQueuePreview.jsx` | `components/lexipath/golden-queue-preview.tsx` | TSX | N | Y | Y | **Identity** review queue; trùng GoldenTimeQueuePreview (marketing) → dùng chung |
| ExamToSrsLoop | `components/path/ExamToSrsLoop.jsx` | `components/lexipath/exam-to-srs-loop.tsx` | TSX | Y | Y | N | **Identity** exam→SRS |
| ReviewReasonChip | `components/path/ReviewReasonChip.jsx` | `components/lexipath/review-reason-chip.tsx` | shadcn badge | N | Y | N | **Identity** "vì sao ôn" |
| InsightActionCard | `components/path/InsightActionCard.jsx` | `components/lexipath/insight-action-card.tsx` | shadcn card | N | Y | Y | — |
| LearningInsightCard | `components/path/LearningInsightCard.jsx` | `components/lexipath/learning-insight-card.tsx` | shadcn card | N | Y | Y | — |
| LearningRoutePreview | `components/path/LearningRoutePreview.jsx` | `components/lexipath/learning-route-preview.tsx` | TSX | N | Y | Y | — |
| LearnerCanvas | `components/path/LearnerCanvas.jsx` | `components/lexipath/learner-canvas.tsx` | TSX + Tailwind | Y | Y | N | 9 refs; canvas nền v21 — layout nặng, tách kỹ |
| LearningAtmosphere | `components/path/LearningAtmosphere.jsx` | `components/lexipath/learning-atmosphere.tsx` | TSX | N | Y | N | Hiệu ứng nền; kiểm tra perf |
| EmptySpaceCompanionPanel | `components/path/EmptySpaceCompanionPanel.jsx` | `components/lexipath/empty-space-companion-panel.tsx` | TSX | N | Y | N | — |

### 2.7 learning (57) → `features/learning` & `features/vocabulary` — Nhóm: feature

> Player/session/exercise → `features/learning`. Vocab/collection/word → `features/vocabulary`.

#### Player / Session / Exercise → `features/learning/components`

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| LearningSessionTopBar | `components/learning/LearningSessionTopBar.jsx` | `features/learning/components/learning-session-top-bar.tsx` | TSX | N | Y | N | Dùng trong FocusLearningShell |
| Flashcard | `components/learning/Flashcard.jsx` | `features/learning/components/flashcard.tsx` | TSX (flip anim) | Y | Y | Y | Client; flip state |
| FlashcardIntroCard | `components/learning/FlashcardIntroCard.jsx` | `features/learning/components/flashcard-intro-card.tsx` | shadcn card | N | Y | N | — |
| ChoiceOption | `components/learning/ChoiceOption.jsx` | `features/learning/components/choice-option.tsx` | shadcn button + cva | N | Y | N | 6 refs; trạng thái đúng/sai |
| AnswerChoiceButton | `components/learning/AnswerChoiceButton.jsx` | `features/learning/components/answer-choice-button.tsx` | shadcn button + cva | N | Y | N | Trùng ChoiceOption → cân nhắc gộp |
| AudioQuestionCard | `components/learning/AudioQuestionCard.jsx` | `features/learning/components/audio-question-card.tsx` | shadcn card + audio | N | Y | Y | Client (audio API) |
| FillBlankCard | `components/learning/FillBlankCard.jsx` | `features/learning/components/fill-blank-card.tsx` | shadcn card + input | N | Y | Y | Client |
| SpellingInputCard | `components/learning/SpellingInputCard.jsx` | `features/learning/components/spelling-input-card.tsx` | shadcn card + input | N | Y | Y | Client |
| CollocationPracticeCard | `components/learning/CollocationPracticeCard.jsx` | `features/learning/components/collocation-practice-card.tsx` | shadcn card | N | Y | Y | — |
| ExampleSentenceCard | `components/learning/ExampleSentenceCard.jsx` | `features/learning/components/example-sentence-card.tsx` | shadcn card | N | Y | Y | — |
| FeedbackCard | `components/learning/FeedbackCard.jsx` | `features/learning/components/feedback-card.tsx` | shadcn card | N | Y | N | Đúng/sai feedback |
| MistakeTypeBadge | `components/learning/MistakeTypeBadge.jsx` | `features/learning/components/mistake-type-badge.tsx` | shadcn badge + cva | N | Y | N | — |
| SessionSummaryCard | `components/learning/SessionSummaryCard.jsx` | `features/learning/components/session-summary-card.tsx` | shadcn card | N | Y | Y | — |
| ExitSessionDialog | `components/learning/ExitSessionDialog.jsx` | `features/learning/components/exit-session-dialog.tsx` | shadcn dialog | N | Y | N | 4 refs; **title bắt buộc** |
| GoldenTimeCard | `components/learning/GoldenTimeCard.jsx` | `features/learning/components/golden-time-card.tsx` | shadcn card | N | Y | Y | **Identity** |
| GoldenTimeQuestionCard | `components/learning/GoldenTimeQuestionCard.jsx` | `features/learning/components/golden-time-question-card.tsx` | shadcn card | N | Y | Y | **Identity** |
| GoldenTimeQueueItem | `components/learning/GoldenTimeQueueItem.jsx` | `features/learning/components/golden-time-queue-item.tsx` | TSX | N | Y | Y | **Identity** review queue |
| GoldenTimeSummaryCard | `components/learning/GoldenTimeSummaryCard.jsx` | `features/learning/components/golden-time-summary-card.tsx` | shadcn card | N | Y | Y | **Identity** |

#### Dashboard / Stats / Streak → `features/learning/components`

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| ContinueLearningCard | `components/learning/ContinueLearningCard.jsx` | `features/learning/components/continue-learning-card.tsx` | shadcn card | N | Y | Y | — |
| DueNowCard | `components/learning/DueNowCard.jsx` | `features/learning/components/due-now-card.tsx` | shadcn card | N | Y | Y | Review queue |
| OverdueCard | `components/learning/OverdueCard.jsx` | `features/learning/components/overdue-card.tsx` | shadcn card | N | Y | Y | — |
| UpcomingReviewCard | `components/learning/UpcomingReviewCard.jsx` | `features/learning/components/upcoming-review-card.tsx` | shadcn card | N | Y | Y | — |
| TodayGoalCard | `components/learning/TodayGoalCard.jsx` | `features/learning/components/today-goal-card.tsx` | shadcn card + progress | N | Y | Y | — |
| DailyStatsCard | `components/learning/DailyStatsCard.jsx` | `features/learning/components/daily-stats-card.tsx` | shadcn card | N | Y | Y | — |
| DailySummaryCard | `components/learning/DailySummaryCard.jsx` | `features/learning/components/daily-summary-card.tsx` | shadcn card | N | Y | Y | — |
| WeeklyProgressCard | `components/learning/WeeklyProgressCard.jsx` | `features/learning/components/weekly-progress-card.tsx` | **Recharts** | N | Y | Y | Chart |
| StatTile | `components/learning/StatTile.jsx` | `features/learning/components/stat-tile.tsx` | TSX | N | Y | N | 27 refs — làm sớm |
| SkillStatCard | `components/learning/SkillStatCard.jsx` | `features/learning/components/skill-stat-card.tsx` | shadcn card | N | Y | Y | — |
| WeakSkillCard | `components/learning/WeakSkillCard.jsx` | `features/learning/components/weak-skill-card.tsx` | shadcn card | N | Y | Y | — |
| SkillReviewGroupCard | `components/learning/SkillReviewGroupCard.jsx` | `features/learning/components/skill-review-group-card.tsx` | shadcn card | N | Y | Y | — |
| StreakCard | `components/learning/StreakCard.jsx` | `features/learning/components/streak-card.tsx` | shadcn card | N | Y | Y | — |
| StreakHeatmap | `components/learning/StreakHeatmap.jsx` | `features/learning/components/streak-heatmap.tsx` | TSX / Recharts | Y | Y | Y | Heatmap — perf nhiều ô |
| XPStatCard | `components/learning/XPStatCard.jsx` | `features/learning/components/xp-stat-card.tsx` | shadcn card | N | Y | Y | — |
| XPHistoryRow | `components/learning/XPHistoryRow.jsx` | `features/learning/components/xp-history-row.tsx` | TSX | N | Y | Y | — |
| AchievementCard | `components/learning/AchievementCard.jsx` | `features/learning/components/achievement-card.tsx` | shadcn card | N | Y | Y | — |
| LeaderboardRow | `components/learning/LeaderboardRow.jsx` | `features/learning/components/leaderboard-row.tsx` | TSX + avatar | N | Y | Y | — |
| NotificationReminderCard | `components/learning/NotificationReminderCard.jsx` | `features/learning/components/notification-reminder-card.tsx` | shadcn card | N | Y | Y | — |
| LearningCard | `components/learning/LearningCard.jsx` | `features/learning/components/learning-card.tsx` | shadcn card | N | Y | Y | Có trong file cũ — xác nhận route trước |
| LessonCard | `components/learning/LessonCard.jsx` | `features/learning/components/lesson-card.tsx` | shadcn card | N | Y | Y | — |
| LessonCheckpointRow | `components/learning/LessonCheckpointRow.jsx` | `features/learning/components/lesson-checkpoint-row.tsx` | TSX | N | Y | Y | **Identity** checkpoint |
| LessonRoadmapItem | `components/learning/LessonRoadmapItem.jsx` | `features/learning/components/lesson-roadmap-item.tsx` | TSX | N | Y | Y | — |

#### Vocabulary / Collection / Word → `features/vocabulary/components`

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| VocabItemCard | `components/learning/VocabItemCard.jsx` | `features/vocabulary/components/vocab-item-card.tsx` | shadcn card | N | Y | Y | Clickable → `button`/`Link` (cấm clickable div); DTO word+status |
| VocabItemRow | `components/learning/VocabItemRow.jsx` | `features/vocabulary/components/vocab-item-row.tsx` | TSX | N | Y | Y | List dài → cân nhắc TanStack Virtual |
| VocabItemDetailPanel | `components/learning/VocabItemDetailPanel.jsx` | `features/vocabulary/components/vocab-item-detail-panel.tsx` | shadcn card | Y | Y | Y | Xác nhận route (file cũ) |
| MeaningCard | `components/learning/MeaningCard.jsx` | `features/vocabulary/components/meaning-card.tsx` | shadcn card | N | Y | Y | — |
| SenseCard | `components/learning/SenseCard.jsx` | `features/vocabulary/components/sense-card.tsx` | shadcn card | N | Y | Y | — |
| PhoneticAudioRow | `components/learning/PhoneticAudioRow.jsx` | `features/vocabulary/components/phonetic-audio-row.tsx` | TSX + audio | N | Y | Y | Client (audio) |
| RelatedItemsList | `components/learning/RelatedItemsList.jsx` | `features/vocabulary/components/related-items-list.tsx` | TSX | N | Y | Y | — |
| CollectionCard | `components/learning/CollectionCard.jsx` | `features/vocabulary/components/collection-card.tsx` | shadcn card | N | Y | Y | — |
| CollectionJourneyCard | `components/learning/CollectionJourneyCard.jsx` | `features/vocabulary/components/collection-journey-card.tsx` | shadcn card | N | Y | Y | **Identity** journey |
| CollectionProgressCard | `components/learning/CollectionProgressCard.jsx` | `features/vocabulary/components/collection-progress-card.tsx` | shadcn card + progress | N | Y | Y | — |
| CollectionProgressStory | `components/learning/CollectionProgressStory.jsx` | `features/vocabulary/components/collection-progress-story.tsx` | TSX | Y | Y | Y | — |
| CollectionStatsCard | `components/learning/CollectionStatsCard.jsx` | `features/vocabulary/components/collection-stats-card.tsx` | shadcn card | N | Y | Y | — |
| RecommendedCollectionCard | `components/learning/RecommendedCollectionCard.jsx` | `features/vocabulary/components/recommended-collection-card.tsx` | shadcn card | N | Y | Y | — |

### 2.8 notebook (9) → `features/notebook/components` — Nhóm: feature (MỚI)

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| NotebookSplitLayout | `components/notebook/NotebookSplitLayout.jsx` | `features/notebook/components/notebook-split-layout.tsx` | TSX + Tailwind | Y | Y | N | Layout 2 cột responsive |
| NotebookFilterTabs | `components/notebook/NotebookFilterTabs.jsx` | `features/notebook/components/notebook-filter-tabs.tsx` | shadcn tabs | N | Y | N | — |
| NotebookItemRow | `components/notebook/NotebookItemRow.jsx` | `features/notebook/components/notebook-item-row.tsx` | TSX | N | Y | Y | List dài → TanStack Virtual |
| DictionarySearchCommand | `components/notebook/DictionarySearchCommand.jsx` | `features/notebook/components/dictionary-search-command.tsx` | shadcn **command** | Y | Y | Y | Client; debounce search API |
| SearchResultGroup | `components/notebook/SearchResultGroup.jsx` | `features/notebook/components/search-result-group.tsx` | TSX | N | Y | Y | — |
| AddToLearningDialog | `components/notebook/AddToLearningDialog.jsx` | `features/notebook/components/add-to-learning-dialog.tsx` | shadcn dialog | N | Y | Y | 3 refs; **title bắt buộc**; mutation Query |
| SkillWeaknessPanel | `components/notebook/SkillWeaknessPanel.jsx` | `features/notebook/components/skill-weakness-panel.tsx` | shadcn card | N | Y | Y | **Identity** skill |
| WordMasteryCanvas | `components/notebook/WordMasteryCanvas.jsx` | `features/notebook/components/word-mastery-canvas.tsx` | TSX / Recharts | Y | Y | Y | Canvas/đồ thị — perf |
| WordRelationMap | `components/notebook/WordRelationMap.jsx` | `features/notebook/components/word-relation-map.tsx` | TSX (SVG graph) | Y | Y | Y | Graph layout — phức tạp nhất nhóm |

### 2.9 admin (17) → `features/admin/components` — Nhóm: feature

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| AdminShell | `components/admin/AdminShell.jsx` | `features/admin/components/admin-shell.tsx` | TSX + Tailwind | Y | Y | N | Admin **được** dùng sidebar |
| AdminSidebarSection | `components/admin/AdminSidebarSection.jsx` | `features/admin/components/admin-sidebar-section.tsx` | TSX | N | Y | N | — |
| AdminDataTable | `components/admin/AdminDataTable.jsx` | `features/admin/components/admin-data-table.tsx` | **TanStack Table** + shadcn table | Y | Y | Y | 15 refs; bỏ table tự viết → TanStack; selection/sort |
| FilterToolbar | `components/admin/FilterToolbar.jsx` | `features/admin/components/filter-toolbar.tsx` | shadcn input/select | N | Y | N | 9 refs |
| BulkActionToolbar | `components/admin/BulkActionToolbar.jsx` | `features/admin/components/bulk-action-toolbar.tsx` | shadcn button | N | Y | N | — |
| DetailDrawer | `components/admin/DetailDrawer.jsx` | `features/admin/components/detail-drawer.tsx` | shadcn sheet | N | Y | Y | 14 refs; **title bắt buộc** |
| CreateEditForm (FormField) | `components/admin/CreateEditForm.jsx` | `features/admin/components/create-edit-form.tsx` | **RHF + Zod + shadcn Form** | Y | Y | Y | 41 refs `FormField`; label+error bắt buộc |
| CollectionEditorForm | `components/admin/CollectionEditorForm.jsx` | `features/admin/components/collection-editor-form.tsx` | RHF + Zod + Form | Y | Y | Y | — |
| SenseEditorForm | `components/admin/SenseEditorForm.jsx` | `features/admin/components/sense-editor-form.tsx` | RHF + Zod + Form | Y | Y | Y | — |
| ExampleEditorForm | `components/admin/ExampleEditorForm.jsx` | `features/admin/components/example-editor-form.tsx` | RHF + Zod + Form | N | Y | Y | — |
| ItemEditorTabs | `components/admin/ItemEditorTabs.jsx` | `features/admin/components/item-editor-tabs.tsx` | shadcn tabs | N | Y | N | Xác nhận route (file cũ) |
| LessonItemReorderList | `components/admin/LessonItemReorderList.jsx` | `features/admin/components/lesson-item-reorder-list.tsx` | dnd-kit / TSX | Y | Y | Y | Drag-reorder — chọn lib DnD |
| PublishWorkflowBar | `components/admin/PublishWorkflowBar.jsx` | `features/admin/components/publish-workflow-bar.tsx` | TSX + shadcn button | N | Y | Y | Content workflow state |
| ReviewTaskCard | `components/admin/ReviewTaskCard.jsx` | `features/admin/components/review-task-card.tsx` | shadcn card | N | Y | Y | — |
| SourceInfoPanel | `components/admin/SourceInfoPanel.jsx` | `features/admin/components/source-info-panel.tsx` | shadcn card | N | Y | Y | — |
| VersionHistoryPanel | `components/admin/VersionHistoryPanel.jsx` | `features/admin/components/version-history-panel.tsx` | TSX | N | Y | Y | — |

### 2.10 exam (16) → `features/exam/components` — Nhóm: feature

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| ExamProgramCard | `components/exam/ExamProgramCard.jsx` | `features/exam/components/exam-program-card.tsx` | shadcn card | N | Y | Y | — |
| ExamTestCard | `components/exam/ExamTestCard.jsx` | `features/exam/components/exam-test-card.tsx` | shadcn card | N | Y | Y | — |
| ExamTestDetailPreview | `components/exam/ExamTestDetailPreview.jsx` | `features/exam/components/exam-test-detail-preview.tsx` | shadcn card | Y | Y | Y | — |
| ExamBlueprintCard | `components/exam/ExamBlueprintCard.jsx` | `features/exam/components/exam-blueprint-card.tsx` | shadcn card | N | Y | Y | — |
| ExamAccessRuleCard | `components/exam/ExamAccessRuleCard.jsx` | `features/exam/components/exam-access-rule-card.tsx` | shadcn card | N | Y | Y | Entitlement |
| ComingSoonExamPlayerState | `components/exam/ComingSoonExamPlayerState.jsx` | `features/exam/components/coming-soon-exam-player-state.tsx` | TSX (empty state) | N | Y | N | — |
| TestBuilderCanvas | `components/exam/TestBuilderCanvas.jsx` | `features/exam/components/test-builder-canvas.tsx` | TSX + dnd-kit | Y | Y | Y | Builder phức tạp — tách kỹ |
| ExamSectionPartBuilder | `components/exam/ExamSectionPartBuilder.jsx` | `features/exam/components/exam-section-part-builder.tsx` | RHF + dnd-kit | Y | Y | Y | — |
| QuestionBankTable | `components/exam/QuestionBankTable.jsx` | `features/exam/components/question-bank-table.tsx` | TanStack Table + shadcn | Y | Y | Y | — |
| QuestionEditorPanel | `components/exam/QuestionEditorPanel.jsx` | `features/exam/components/question-editor-panel.tsx` | RHF + Zod + Form | Y | Y | Y | — |
| AnswerKeyEditor | `components/exam/AnswerKeyEditor.jsx` | `features/exam/components/answer-key-editor.tsx` | RHF + Form | N | Y | Y | Xác nhận route (file cũ) |
| PassageParagraphEditor | `components/exam/PassageParagraphEditor.jsx` | `features/exam/components/passage-paragraph-editor.tsx` | RHF + Form | N | Y | Y | — |
| TranscriptEditorPanel | `components/exam/TranscriptEditorPanel.jsx` | `features/exam/components/transcript-editor-panel.tsx` | RHF + Form | N | Y | Y | — |
| MediaLibraryCard | `components/exam/MediaLibraryCard.jsx` | `features/exam/components/media-library-card.tsx` | shadcn card | N | Y | Y | Upload media |
| RubricCriteriaCard | `components/exam/RubricCriteriaCard.jsx` | `features/exam/components/rubric-criteria-card.tsx` | shadcn card | N | Y | Y | — |
| ScoringScaleTable | `components/exam/ScoringScaleTable.jsx` | `features/exam/components/scoring-scale-table.tsx` | TanStack Table + shadcn | N | Y | Y | — |

### 2.11 payment (6) → `features/payment` + `features/security` — Nhóm: feature (MỚI)

| Old component | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| PlanComparisonCard | `components/payment/PlanComparisonCard.jsx` | `features/payment/components/plan-comparison-card.tsx` | shadcn card | N | Y | Y | Upgrade prompt trong app (khác PricingPlanCard) |
| FeatureUsageCard | `components/payment/FeatureUsageCard.jsx` | `features/payment/components/feature-usage-card.tsx` | shadcn card + progress | N | Y | Y | Quota/limit |
| PaymentTransactionRow | `components/payment/PaymentTransactionRow.jsx` | `features/payment/components/payment-transaction-row.tsx` | TSX | N | Y | Y | Số tiền/tiền tệ — format |
| AccountLockBanner | `components/payment/AccountLockBanner.jsx` | `features/security/components/account-lock-banner.tsx` | shadcn alert | N | Y | Y | 5 refs |
| DeviceSessionRow | `components/payment/DeviceSessionRow.jsx` | `features/security/components/device-session-row.tsx` | TSX | N | Y | Y | — |
| SecurityEventRow | `components/payment/SecurityEventRow.jsx` | `features/security/components/security-event-row.tsx` | TSX | N | Y | Y | Audit log |

### 2.12 templates (5) → `src/app/**` (route screens) — Nhóm: feature

> Template `.dc.html` là **bố cục trang hoàn chỉnh** (kèm `ds-base.js`, `support.js` của prototype — **bỏ hết**). Migrate thành page App Router lắp ráp từ component đã migrate.

| Old template | Old path | New path | Lib | Split | Type | DTO | Rủi ro |
|---|---|---|---|:--:|:--:|:--:|---|
| Landing | `templates/landing/Landing.dc.html` | `app/(marketing)/page.tsx` | RSC + marketing/* | Y | Y | N | Server Component; SEO/metadata |
| Dashboard | `templates/dashboard/Dashboard.dc.html` | `app/(learner)/dashboard/page.tsx` | learner shell + learning/* + lexipath/* | Y | Y | Y | **Identity dashboard**; TanStack Query |
| GoldenTimeReview | `templates/golden-time-review/GoldenTimeReview.dc.html` | `app/(learner)/golden-time/page.tsx` | FocusLearningShell + lexipath/* | Y | Y | Y | **Identity** Golden Time; không show main nav |
| CollectionDetail | `templates/collection-detail/CollectionDetail.dc.html` | `app/(learner)/collections/[id]/page.tsx` | vocabulary/* | Y | Y | Y | Dynamic route + DTO |
| VocabDetail | `templates/vocab-detail/VocabDetail.dc.html` | `app/(learner)/vocab/[id]/page.tsx` | vocabulary/* | Y | Y | Y | Dynamic route + DTO |

---

## 3. Checklist theo nhóm

### ☐ core → `components/ui` (shared)
- [ ] `add` shadcn còn thiếu: `checkbox, radio-group, switch, command, sonner`.
- [ ] Button giữ variant `nextStep/golden/path/quiet` bằng `cva` (identity).
- [ ] Gộp `IconButton` vào Button (`size="icon"` + `aria-label`).
- [ ] `Toast`/`SuccessToast` → `sonner`; mount provider ở `src/providers`.
- [ ] `ProgressRing`, `CommandSearch` không có shadcn 1-1 → giữ custom nhưng vẫn Tailwind/typed.

### ☐ layout + navigation → `components/layouts` (layout)
- [ ] Learner shell **không sidebar**; Focus shell **ẩn main nav** (folder-rules).
- [ ] Sidebar **chỉ admin**.
- [ ] `Breadcrumb`/`Tabs` dùng shadcn; `next/link` cho điều hướng.
- [ ] Tách `Streak`/`XpPill` khỏi TopBar.

### ☐ feedback → `components/shared` (shared)
- [ ] State (empty/error/locked/permission/disabled) gom `components/shared`.
- [ ] Badge phụ thuộc domain (`PaymentStatusBadge`, `EntitlementBadge`) chuyển sang feature payment.
- [ ] Mọi Dialog có **title**; mọi state có icon lucide.

### ☐ marketing → `features/marketing` (feature) + identity
- [ ] Tạo feature `marketing`.
- [ ] Golden Time / exam→SRS / learning loop explainer → `components/lexipath` (identity dùng chung learner).
- [ ] `next/image` cho hero/mockup; FAQ dùng shadcn accordion.

### ☐ auth → `features/auth` (feature)
- [ ] AuthCard dùng RHF + Zod + shadcn Form (login/register/reset DTO).
- [ ] Onboarding journey/path preview giữ identity journey.
- [ ] Choice/selector dùng radio-group có label.

### ☐ path → `components/lexipath` (LexiPath identity) ⭐
- [ ] **Không** generic-hóa: giữ journey, checkpoint, skill lane, golden time, next best step, exam→SRS, review reason.
- [ ] Component chia sẻ learner+marketing đặt ở `components/lexipath`.
- [ ] `LearnerCanvas`/`LearningAtmosphere` kiểm tra perf (nền/animation).

### ☐ learning → `features/learning` + `features/vocabulary` (feature)
- [ ] Tách player/session vs dashboard/stats vs vocab/collection.
- [ ] Exercise cards là Client (audio/input/flip state).
- [ ] List dài (`VocabItemRow`) dùng TanStack Virtual; chart dùng Recharts.
- [ ] Card click → `button`/`Link`, không clickable div.

### ☐ notebook → `features/notebook` (feature, MỚI)
- [ ] Tạo feature `notebook`.
- [ ] `DictionarySearchCommand` dùng shadcn command + debounce + Query.
- [ ] `WordMasteryCanvas`/`WordRelationMap` là phần khó nhất (SVG/graph/perf).

### ☐ admin → `features/admin` (feature)
- [ ] DataTable/QuestionBankTable/ScoringScaleTable → **TanStack Table** + shadcn table.
- [ ] Mọi form → RHF + Zod + shadcn Form (label + error).
- [ ] DetailDrawer → shadcn sheet có title.
- [ ] Reorder (`LessonItemReorderList`, builder) → chọn lib DnD (dnd-kit).

### ☐ exam → `features/exam` (feature)
- [ ] Builder/editor phức tạp → tách nhỏ, RHF + Zod.
- [ ] Bảng → TanStack Table; media upload riêng.

### ☐ payment + security → `features/payment`, `features/security` (feature, MỚI)
- [ ] Tạo feature `payment` và `security`.
- [ ] Format tiền tệ/ngày qua util chung; DTO transaction/subscription/device/event.

### ☐ templates → `src/app/**` (route)
- [ ] Bỏ `ds-base.js` / `support.js` / inline script prototype.
- [ ] Lắp ráp từ component đã migrate; RSC mặc định, client boundary thấp.
- [ ] Route group: `(marketing) (learner) (admin) (auth)`.

---

## 4. Thứ tự migrate đề xuất

> Dựa trên `lexipath_component_usage_audit.md` (90/167 component nằm trong route cuối). Ưu tiên nền tảng → identity → feature → quản trị.

1. **Foundation (shared/ui):** Button (variant identity), Card, Badge, Input, Textarea, Select, Progress, Avatar, Switch, Separator, Dialog, Tooltip + state/badge (`EmptyState`, `ErrorState`, `StatusBadge`, `ContentStatusBadge`). → mở khóa mọi màn.
2. **Layout + navigation:** PageHeader (60 refs), Breadcrumb, LearnerAppShell, FocusLearningShell, MarketingShell, AdminShell, TopBar (+Streak/XpPill), Tabs.
3. **LexiPath identity (`components/lexipath`):** NextBestStepCard, GoldenTimeWindow/QueuePreview, SkillLaneGroup/Lane, JourneyRail/CheckpointNode, ReviewReasonChip, ExamToSrsLoop, LearnerCanvas, PageJourneyHeader.
4. **Learner feature:** dashboard (StatTile 27 refs, due/overdue/today, streak/xp), session player (Flashcard, ChoiceOption, audio/fill/spelling, feedback, summary, exit dialog), vocabulary/collection/notebook v21.
5. **Auth + marketing pages:** AuthCard + onboarding; landing sections + pricing/FAQ → ráp template Landing & Dashboard.
6. **Admin + exam + payment/security:** AdminDataTable + FilterToolbar + DetailDrawer + CreateEditForm; exam builder/qbank/scoring; plan/usage/transaction + device/security/account-lock.
7. **Ráp templates còn lại:** GoldenTimeReview, CollectionDetail, VocabDetail.
8. **Skip/sau:** component chỉ thấy trong prototype/file cũ (mục dưới) — chỉ migrate khi xác nhận có route thật.

### Có thể skip ở phase đầu (theo audit — không nằm trong route cuối)
`admin`: BulkActionToolbar, CollectionEditorForm, CreateEditForm(các editor phụ), ExampleEditorForm, ItemEditorTabs, LessonItemReorderList ·
`auth`: DailyGoalSelector, ScriptPreferenceSelector, VerificationStateCard ·
`core`: Checkbox, CommandSearch, RadioGroup, Toast (nếu chưa dùng) ·
`exam`: AnswerKeyEditor, ExamAccessRuleCard, ExamBlueprintCard, ExamSectionPartBuilder, ExamTestDetailPreview, MediaLibraryCard, TranscriptEditorPanel ·
`feedback`: DisabledActionState, SuccessToast, UnsavedChangesDialog ·
`learning`: nhiều card thống kê/collection chưa lên route v21 (xem audit) ·
`notebook`: DictionarySearchCommand, NotebookFilterTabs, NotebookItemRow, NotebookSplitLayout, SearchResultGroup ·
`path`: LearningAtmosphere, LearningRoutePreview.

> Quy ước skip: **không xóa** khỏi map — để Status `TODO (skip-phase-1)` và migrate khi xác nhận route thực dùng đến.

---

## 5. Rủi ro tổng & nguyên tắc bắt buộc

1. **Folder thiết kế nằm ngoài repo** (`~/Downloads`) — snapshot vào repo trước khi migrate để path khớp `DESIGN_SOURCE_DIR`.
2. **Inline style + CSS var khắp nơi** — không bê nguyên; map sang Tailwind token. Giữ biến LexiPath trong `globals.css`.
3. **Icon ký tự/emoji** (`✓ ↑ ↓`) — thay bằng lucide.
4. **Clickable `div`** trong kit (vd `VocabItemCard onClick`) — đổi sang `button`/`Link` (a11y rule).
5. **Trùng lặp component** giữa nhóm (Golden queue ở marketing/path/learning; ChoiceOption vs AnswerChoiceButton; PricingPlanCard vs PlanComparisonCard) — hợp nhất về 1 nguồn, đừng migrate trùng.
6. **`_ds_v21_supplement.js`** — nhiều identity component (audit cột "other") định nghĩa trong file bundle, không phải file `.jsx` riêng → đọc kỹ bundle khi migrate.
7. **DTO ↔ UI type:** component nhận entity backend (vocab/collection/exam/payment/admin list/stats) **bắt buộc** tách DTO + mapper; component thuần trình bày (layout, primitive, marketing tĩnh) **không** cần DTO.
8. **Client boundary thấp:** chỉ exercise/player/form/search/drag mới `"use client"`; card tĩnh giữ Server Component.
9. **Identity là ưu tiên cao nhất** — không biến LexiPath thành dashboard SaaS generic.

### Nhắc lại (áp dụng cho TẤT CẢ dòng trong map)
> Mọi component sau này **phải** migrate sang **TSX + typed props + Tailwind v4 + shadcn/ui (Radix/lucide/cn/cva)** — bỏ `.jsx`, bỏ inline style, bỏ script prototype, tách DTO/UI khi có dữ liệu, giữ LexiPath identity, rồi chạy `npm run lint` + `npm run typecheck`.
