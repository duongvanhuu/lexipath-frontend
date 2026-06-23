# LexiPath Frontend — Source Audit (tiền triển khai UI)

> **Mục đích:** Bản đồ toàn diện trạng thái hiện tại trước khi bắt đầu triển khai giao diện theo từng page.
> **Ngày audit:** 2026-06-23
> **Phạm vi:** Routes, components, features, prototype, screenshots, database domain, thứ tự triển khai, rủi ro.

---

## 1. Routes hiện có

| Route | File | Layout | Trạng thái |
|---|---|---|---|
| `/` | `src/app/page.tsx` | MarketingShell (PublicHeader) | ✅ Đầy đủ — landing page hoàn chỉnh |
| `/login` | `src/app/(auth)/login/page.tsx` | AuthShell | ✅ Có trang |
| `/register` | `src/app/(auth)/register/page.tsx` | AuthShell | ✅ Có trang |
| `/onboarding` | `src/app/(auth)/onboarding/page.tsx` | AuthShell | ✅ Có trang (step: lang + goal) |
| `/dashboard` | `src/app/(app)/dashboard/page.tsx` | LearnerAppShell | ⚠️ Placeholder — chỉ có QuickAccessCard cứng, chưa real data |

**Route groups đã khai báo:**
- `(auth)/` → `src/app/(auth)/layout.tsx` — áp dụng cho login / register / onboarding
- `(app)/` → `src/app/(app)/layout.tsx` + `loading.tsx` — áp dụng cho tất cả learner pages

---

## 2. Routes còn thiếu

Dựa theo 31 screenshot folders (mỗi folder = 1 page / trạng thái):

### 2.1 Learner routes (cần thêm vào `(app)/`)

| Screenshot folder | Route đề xuất | Ghi chú |
|---|---|---|
| `collections` | `/collections` | Danh sách bộ sưu tập từ vựng |
| `collection-detail` | `/collections/[id]` | Chi tiết + lộ trình bài học |
| `lesson-detail` | `/collections/[id]/lessons/[lessonId]` | Chi tiết bài học |
| `learning-session` | `/collections/[id]/lessons/[lessonId]/session` | FocusShell |
| `session-summary` | `/collections/[id]/lessons/[lessonId]/summary` | Tổng kết phiên học |
| `golden-dashboard` | `/golden-time` | Dashboard Golden Time |
| `golden-question` | `/golden-time/session` | FocusShell — câu hỏi ôn |
| `golden-summary` | `/golden-time/summary` | Tổng kết Golden Time |
| `notebook` | `/notebook` | Sổ tay từ vựng + dictionary search |
| `dictionary` | `/notebook/dictionary` | Tìm kiếm từ điển |
| `vocab-detail` | `/notebook/[itemId]` | Chi tiết word mastery |
| `stats` | `/stats` | Tổng quan thống kê |
| `streak-heatmap` | `/stats/streak` | Chuỗi học + heatmap |
| `xp-summary` | `/stats/xp` | Lịch sử XP |
| `profile` | `/profile` | Hồ sơ học viên |
| `notifications` | `/notifications` | Thông báo |
| `settings` | `/settings` | Cài đặt tài khoản |
| `subscription` | `/subscription` | Gói đăng ký / nâng cấp |
| `security` | `/settings/security` | Bảo mật: device, event, lock |

### 2.2 Admin routes (cần route group mới `(admin)/`)

| Screenshot folder | Route đề xuất | Ghi chú |
|---|---|---|
| `admin-vocab` | `/admin/vocabulary` | Quản lý vocab items |
| `admin-builder` | `/admin/vocabulary/[id]` | Vocab editor |
| `admin-collection` | `/admin/collections` | Quản lý bộ sưu tập |
| `admin-review` | `/admin/review` | Duyệt nội dung |
| `admin-exam` | `/admin/exam` | Quản lý đề thi |
| `admin-questions` | `/admin/exam/questions` | Question bank |
| `admin-scoring` | `/admin/exam/scoring` | Thang điểm |

### 2.3 Chưa có route group + layout

- `(admin)/layout.tsx` — AdminShell + sidebar
- `(focus)/layout.tsx` (hoặc tích hợp vào `(app)`) — FocusLearningShell (không nav)

---

## 3. Components hiện có

### 3.1 `src/components/ui/` — shadcn primitives (28 files)

`accordion`, `alert-dialog`, `avatar`, `badge`, `button`, `card`, `checkbox`, `command`, `dialog`, `dropdown-menu`, `form`, `input`, `input-group`, `label`, `popover`, `progress`, `progress-ring`, `radio-group`, `select`, `separator`, `sheet`, `skeleton`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `tooltip`

### 3.2 `src/components/shared/` — product-level shared

| Sub-nhóm | Files |
|---|---|
| Root | `action-button`, `icon-button`, `lexi-button` |
| `badges/` | `content-status-badge`, `entitlement-badge`, `payment-status-badge`, `skill-badge`, `status-badge` |
| `cards/` | `card-variants`, `insight-card`, `interactive-card`, `lexi-card`, `metric-card` |
| `feedback/` | `confirm-dialog`, `disabled-action-state`, `empty-state`, `error-state`, `loading-skeleton`, `locked-feature-state`, `permission-denied-state`, `toast`, `unsaved-changes-dialog` |
| `navigation/` | `admin-sidebar`, `breadcrumb`, `nav-tabs` |

### 3.3 `src/components/layouts/`

`admin-mobile-nav`, `admin-shell`, `focus-close-button`, `focus-learning-shell`, `learner-account-menu`, `learner-app-shell`, `learner-chrome`, `learner-mobile-nav`, `learner-status-cluster`, `marketing-mobile-nav`, `marketing-shell`, `page-header`

> ⚠️ Chưa có `(admin)/layout.tsx` sử dụng `admin-shell`. Shell đã build nhưng chưa wired vào App Router.

### 3.4 `src/components/learning/`

| Sub-nhóm | Files |
|---|---|
| `dashboard/` (17) | `achievement-card`, `continue-learning-card`, `daily-stats-card`, `daily-summary-card`, `due-now-card`, `golden-time-card`, `golden-time-queue-item`, `golden-time-summary-card`, `leaderboard-row`, `overdue-card`, `skill-stat-card`, `stat-tile`, `streak-card`, `streak-heatmap`, `today-goal-card`, `upcoming-review-card`, `weak-skill-card`, `weekly-progress-card`, `xp-history-row`, `xp-stat-card` |
| `exercises/` (11) | `answer-choice-button`, `audio-question-card`, `choice-option`, `collocation-practice-card`, `feedback-card`, `fill-blank-card`, `flashcard`, `flashcard-intro-card`, `golden-time-question-card`, `spelling-input-card` + `index.ts` |
| `session/` (3) | `exit-session-dialog`, `learning-session-top-bar`, `session-summary-card` + `index.ts` |
| Root | `types.ts` |

### 3.5 `src/components/lexipath/` — LexiPath identity

| Sub-nhóm | Files |
|---|---|
| `constants/` | `lexipath.constants.ts` |
| `cta/` | `next-best-step-card` |
| `golden-time/` | `golden-queue-preview`, `golden-time-window`, `review-reason-chip` |
| `insights/` | `insight-action-card`, `learning-insight-card` |
| `layout/` | `learner-canvas`, `learning-atmosphere`, `page-journey-header`, `today-command-center` |
| `loop/` | `exam-to-srs-loop` |
| `path/` | `checkpoint-node`, `journey-checkpoint-card`, `journey-rail`, `learning-route-preview`, `path-card`, `path-rail`, `today-path` |
| `skills/` | `skill-branch-panel`, `skill-lane-group`, `skill-progress-lane` |
| `vocabulary/` | `vocab-learning-header` |
| Root | `types.ts`, `index.ts` |

### 3.6 `src/components/collections/`

`collection-card`, `collection-journey-card`, `collection-progress-card`, `collection-progress-story`, `collection-stats-card`, `lesson-card`, `lesson-checkpoint-row`, `lesson-roadmap-item`, `recommended-collection-card`, `types.ts`

### 3.7 `src/components/vocabulary/`

`example-sentence-card`, `meaning-card`, `phonetic-audio-row`, `related-items-list`, `sense-card`, `vocab-item-card`, `vocab-item-detail-panel`, `vocab-item-row`, `types.ts`

### 3.8 `src/components/notebook/`

`add-to-learning-dialog`, `dictionary-search-command`, `notebook-filter-tabs`, `notebook-item-row`, `notebook-split-layout`, `search-result-group`, `skill-weakness-panel`, `word-mastery-canvas`, `word-mastery-header`, `word-relation-map`, `word-senses-list`, `types.ts`

### 3.9 `src/components/exam/`

`answer-key-editor`, `coming-soon-exam-player-state`, `exam-access-rule-card`, `exam-blueprint-card`, `exam-program-card`, `exam-section-part-builder`, `exam-test-card`, `exam-test-detail-preview`, `media-library-card`, `passage-paragraph-editor`, `question-bank-table`, `question-editor-panel`, `rubric-criteria-card`, `scoring-scale-table`, `test-builder-canvas`, `transcript-editor-panel`, `types.ts`

### 3.10 `src/components/admin/`

`admin-data-table`, `admin-sidebar-section`, `bulk-action-toolbar`, `collection-editor-form`, `create-edit-form`, `detail-drawer`, `example-editor-form`, `filter-toolbar`, `item-editor-tabs`, `lesson-item-reorder-list`, `publish-workflow-bar`, `review-task-card`, `sense-editor-form`, `source-info-panel`, `submit-footer`, `version-history-panel`, `types.ts`

### 3.11 `src/components/payment/`

`feature-usage-card`, `payment-transaction-row`, `plan-comparison-card`, `types.ts`

### 3.12 `src/components/security/`

`account-lock-banner`, `device-session-row`, `security-event-row`, `types.ts`

---

## 4. Feature folders hiện có

| Feature | Trạng thái | Nội dung |
|---|---|---|
| `auth/` | ✅ Đầy đủ | api, dto, mapper, components (12), hooks, schemas, types, constants |
| `marketing/` | ✅ Đầy đủ | components (22), constants, types |
| `admin/` | ❌ Chỉ có `.gitkeep` | Chưa có api / dto / mapper / hooks |
| `exam/` | ❌ Chỉ có `.gitkeep` | Chưa có api / dto / mapper / hooks |
| `learning/` | ❌ Chỉ có `.gitkeep` | Chưa có api / dto / mapper / hooks |
| `vocabulary/` | ❌ Chỉ có `.gitkeep` | Chưa có api / dto / mapper / hooks |

**Features cần tạo mới hoàn toàn:**
- `features/notebook/` — sổ tay, dictionary, word mastery
- `features/payment/` — subscription, plan, transaction
- `features/security/` — device session, security event, account lock
- `features/stats/` — learning stats, streak, xp
- `features/profile/` — user profile, notifications, settings
- `features/exam-catalog/` — exam catalog (learner side)

---

## 5. Prototype files quan trọng trong `LexiPath Web Design`

> **Lưu ý:** Theo `docs/migration/lexipath-component-migration-map.md`, thư mục thiết kế thật nằm tại `/Users/vanhuu/Downloads/lexipath-vocabulary-web-kit` (NGOÀI repo). CLAUDE.md khai báo `DESIGN_SOURCE_DIR=./LexiPath Web Design` nhưng path này **không tồn tại** trong repo. Phải trỏ đúng khi migrate.

### File nguồn chính (theo component audit)

| File prototype | Domain |
|---|---|
| `LexiPath Prototype FINAL.html` | Toàn bộ app learner — source-of-truth cuối |
| `LexiPath Landing Page FINAL.html` | Marketing landing |
| `app_v5.jsx` | Router + screen orchestration |
| `_ds_v21_supplement.js` | LexiPath identity v21 (LearnerCanvas, GoldenTime, Path, etc.) |
| `shared_player_runner_3b.jsx` | Learning session exercises |
| `shared_golden_time.jsx` | Golden Time session |
| `learner_shell.jsx` | Learner shell / top bar / nav |
| `screens_home_v21.jsx` | Dashboard v21 (identity chuẩn) |
| `screens_collection_v21b.jsx` | Collections + lesson detail |
| `screens_notebook_v21b.jsx` | Notebook + word mastery |
| `screens_golden_v21b.jsx` | Golden Time dashboard + session |
| `screens_golden_english.jsx` | Golden Time (English variant) |
| `screens_stats_overview.jsx` | Stats tổng quan |
| `screens_stats_social.jsx` | Stats leaderboard / public |
| `screens_profile_v3.jsx` | Profile |
| `screens_settings.jsx` | Settings |
| `screens_notifications_v2.jsx` | Notifications |
| `screens_subscription_v2.jsx` / `_v3.jsx` | Subscription / payment |
| `screens_security_v2.jsx` | Security |
| `screens_exam_catalog_3c.jsx` | Exam catalog |
| `screens_auth_v2.jsx` | Auth login/register |
| `screens_onboarding_v2.jsx` / `_v21.jsx` | Onboarding |
| `screens_lesson_detail_shared.jsx` | Lesson detail |
| `screens_admin.jsx` | Admin tổng hợp |
| `screens_admin_vocab_editor.jsx` / `_v4.jsx` / `_v15.jsx` | Admin vocab builder |
| `screens_admin_pipeline.jsx` | Admin content pipeline |
| `screens_admin_review_v2.jsx` | Admin review |
| `screens_admin_exam_qbank.jsx` / `_media.jsx` / `_testbuilder.jsx` / `_scoring.jsx` | Admin exam |
| `screens_admin_payment_full.jsx` | Admin payment |
| `screens_admin_security_full.jsx` | Admin security |
| `screens_admin_lessons.jsx` | Admin lessons |
| `screens_global_states.jsx` | Empty/error/permission/locked states |
| `lp_features.jsx` | LexiPath feature highlights |

---

## 6. Screenshot folders — ánh xạ từng page

| Screenshot folder | Route đề xuất | Layout shell | Viewport files |
|---|---|---|---|
| `home` | `/` | MarketingShell | desktop-1440, laptop-1280, tablet-768, mobile-390, mobile-375 |
| `login` | `/login` | AuthShell | 5 viewports |
| `register` | `/register` | AuthShell | 5 viewports |
| `onboard-lang` | `/onboarding` (step lang) | AuthShell | 5 viewports |
| `onboard-goal` | `/onboarding` (step goal) | AuthShell | 5 viewports |
| `collections` | `/collections` | LearnerAppShell | 5 viewports |
| `collection-detail` | `/collections/[id]` | LearnerAppShell | 5 viewports |
| `lesson-detail` | `/collections/[id]/lessons/[lessonId]` | LearnerAppShell | 5 viewports |
| `learning-session` | `/collections/[id]/lessons/[lessonId]/session` | FocusLearningShell | 5 viewports |
| `session-summary` | `/collections/[id]/lessons/[lessonId]/summary` | FocusLearningShell | 5 viewports |
| `golden-dashboard` | `/golden-time` | LearnerAppShell | 5 viewports |
| `golden-question` | `/golden-time/session` | FocusLearningShell | 5 viewports |
| `golden-summary` | `/golden-time/summary` | FocusLearningShell | 5 viewports |
| `notebook` | `/notebook` | LearnerAppShell | 5 viewports |
| `dictionary` | `/notebook/dictionary` | LearnerAppShell | 5 viewports |
| `vocab-detail` | `/notebook/[itemId]` | LearnerAppShell | 5 viewports |
| `stats` | `/stats` | LearnerAppShell | 5 viewports |
| `streak-heatmap` | `/stats/streak` | LearnerAppShell | 5 viewports |
| `xp-summary` | `/stats/xp` | LearnerAppShell | 5 viewports |
| `profile` | `/profile` | LearnerAppShell | 5 viewports |
| `notifications` | `/notifications` | LearnerAppShell | 5 viewports |
| `settings` | `/settings` | LearnerAppShell | 5 viewports |
| `subscription` | `/subscription` | LearnerAppShell | 5 viewports |
| `security` | `/settings/security` | LearnerAppShell | 5 viewports |
| `admin-vocab` | `/admin/vocabulary` | AdminShell | 5 viewports |
| `admin-builder` | `/admin/vocabulary/[id]` | AdminShell | 5 viewports |
| `admin-collection` | `/admin/collections` | AdminShell | 5 viewports |
| `admin-review` | `/admin/review` | AdminShell | 5 viewports |
| `admin-exam` | `/admin/exam` | AdminShell | 5 viewports |
| `admin-questions` | `/admin/exam/questions` | AdminShell | 5 viewports |
| `admin-scoring` | `/admin/exam/scoring` | AdminShell | 5 viewports |

---

## 7. Data / domain chính từ database (157 tables)

### 7.1 Nhóm Domain

| Nhóm | Tables chính | Pages liên quan |
|---|---|---|
| **Core Config** | `languages`, `subscription_plans`, `vocab_item_types`, `vocab_skill_types`, `learning_status_types`, `exercise_types` | Onboarding, settings, admin |
| **Users & Auth** | `users`, `user_language_profiles`, `user_devices`, `user_auth_providers`, `user_sessions`, `user_refresh_tokens`, `user_security_events`, `user_account_locks` | Login, register, profile, security |
| **Payment** | `user_subscriptions`, `user_entitlements`, `payment_orders`, `payment_transactions`, `user_feature_usage` | Subscription, admin-payment |
| **Vocabulary** | `vocab_items`, `vocab_item_scripts`, `vocab_item_phonetics`, `vocab_item_audio`, `vocab_item_senses`, `vocab_item_examples`, `vocab_item_relations` | Notebook, vocab-detail, admin-vocab |
| **Collections & Lessons** | `vocab_collections`, `vocab_lessons`, `lesson_items`, `collection_access_rules` | Collections, collection-detail, lesson-detail, admin-collection |
| **Japanese** | `kanji_details`, `furigana_compounds`, `japanese_verb_forms`, `japanese_grammar_points` | Vocab-detail (JP), admin-builder |
| **Chinese** | `hanzi_details`, `chinese_polyphones`, `chinese_measure_words`, `chinese_char_components` | Vocab-detail (ZH), admin-builder |
| **Learning Progress** | `user_collection_progress`, `user_lesson_progress`, `user_lesson_item_progress`, `user_item_progress`, `user_sense_progress`, `user_item_skill_progress` | Dashboard, collections, stats |
| **SRS / Golden Time** | `srs_algorithm_versions`, `srs_reviews`, `golden_time_queue`, `user_item_learning_events`, `learn_sessions`, `item_attempts` | Golden-dashboard, golden-question, golden-summary |
| **Stats & Gamification** | `user_daily_learning_stats`, `user_daily_skill_stats`, `user_streaks`, `user_xp_ledger`, `user_public_stats`, `leaderboards`, `leaderboard_entries` | Stats, streak-heatmap, xp-summary, profile |
| **Exam Content** | `exam_blueprints`, `exam_media`, `exam_passages`, `exam_questions`, `exam_tests`, `exam_score_scales`, `exam_rubrics` | Admin-exam, admin-questions, admin-scoring |
| **Exam Attempts** | `user_exam_attempts`, `user_exam_answers`, `user_exam_results`, `user_exam_weak_items`, `user_exam_to_srs_queue` | (Exam catalog — future) |
| **Content Management** | `content_versions`, `content_review_tasks`, `content_review_comments`, `content_sources` | Admin-review, admin-builder |
| **Notifications** | `push_notifications` | Notifications |
| **System** | `idempotency_records`, `outbox_events`, `roles`, `permissions`, `role_permissions` | Admin RBAC |

---

## 8. Thứ tự triển khai đề xuất

### Phase 1 — Route shells & navigation wiring (không cần API)
1. Tạo `(app)/` sub-routes còn thiếu: `collections`, `golden-time`, `notebook`, `stats`, `profile`, `notifications`, `settings`, `subscription`, `settings/security`
2. Tạo `(admin)/layout.tsx` + `(admin)/` routes: vocabulary, collections, review, exam
3. Tạo `(focus)/` hoặc dùng `FocusLearningShell` cho `learning-session`, `session-summary`, `golden-question`, `golden-summary`
4. Kiểm tra shell responsive với screenshots từng folder

### Phase 2 — Dashboard (home)
5. Migrate `/dashboard` từ placeholder → full UI: `TodayCommandCenter`, `GoldenTimeCard`, `DueNowCard`, `StreakCard`, `ContinueLearningCard`, `WeakSkillCard`, learning dashboard components

### Phase 3 — Collections & Learning path
6. `/collections` — `CollectionCard`, `RecommendedCollectionCard`, `CollectionJourneyCard`
7. `/collections/[id]` — `CollectionProgressStory`, `JourneyRail`, `LessonCard`, `LessonRoadmapItem`
8. `/collections/[id]/lessons/[lessonId]` — `LessonDetail`, `LessonCheckpointRow`

### Phase 4 — Learning Session & Exercises
9. `/learning-session` + `/session-summary` — `FocusLearningShell`, `LearningSessionTopBar`, exercises, `SessionSummaryCard`
10. feature `learning/` — api, dto, mapper, hooks cho session player

### Phase 5 — Golden Time
11. `/golden-time` dashboard — `GoldenTimeWindow`, `GoldenQueuePreview`, `SkillBranchPanel`
12. `/golden-time/session` — `GoldenTimeQuestionCard`, `ReviewReasonChip`
13. `/golden-time/summary` — `GoldenTimeSummaryCard`

### Phase 6 — Notebook & Vocabulary
14. `/notebook` — `NotebookSplitLayout`, `NotebookFilterTabs`, `NotebookItemRow`, `SkillWeaknessPanel`
15. `/notebook/dictionary` — `DictionarySearchCommand`, `SearchResultGroup`
16. `/notebook/[itemId]` — `WordMasteryCanvas`, `WordMasteryHeader`, `WordSensesList`, `WordRelationMap`

### Phase 7 — Stats & Gamification
17. `/stats` — `StatTile`, `SkillStatCard`, `WeeklyProgressCard`, `DailyStatsCard`
18. `/stats/streak` — `StreakHeatmap`, `StreakCard`
19. `/stats/xp` — `XpStatCard`, `XpHistoryRow`

### Phase 8 — Profile / Settings / Notifications
20. `/profile` — `LearnerCanvas`, `PublicStats`, `LeaderboardRow`
21. `/settings` — form fields, script preference, language profile
22. `/notifications` — notification list

### Phase 9 — Payment & Security
23. `/subscription` — `PlanComparisonCard`, `PaymentTransactionRow`, `FeatureUsageCard`, `EntitlementBadge`
24. `/settings/security` — `AccountLockBanner`, `DeviceSessionRow`, `SecurityEventRow`

### Phase 10 — Admin
25. `/admin/vocabulary` + `/admin/vocabulary/[id]` — vocab table, vocab editor, sense editor, publish workflow
26. `/admin/collections` — collection management
27. `/admin/review` — review task queue, version history, content pipeline
28. `/admin/exam` + questions + scoring — exam blueprint, question bank, test builder, scoring scale

---

## 9. Rủi ro

### 9.1 Routing

| Rủi ro | Mức độ | Giải pháp |
|---|---|---|
| `(app)/` layout hiện thiếu sub-folders cho 19 routes | Cao | Tạo đồng loạt folder + `page.tsx` placeholder trước, rồi migrate từng trang |
| Route group `(admin)/` chưa tồn tại | Cao | Tạo `(admin)/layout.tsx` dùng `AdminShell` trước khi migrate bất kỳ admin page nào |
| Focus-mode routes (`/session`, `/summary`) cần `FocusLearningShell` không có topnav | Trung bình | Tạo `(focus)/layout.tsx` riêng hoặc dùng route-level `layout.tsx` trong `(app)/` |
| `typedRoutes` bật → mọi `href` phải khớp route thật | Trung bình | Tạo đủ route folders trước khi dùng các href trong nav items |

### 9.2 Component reuse

| Rủi ro | Mức độ | Giải pháp |
|---|---|---|
| 100+ components đã build nhưng chưa wired vào bất kỳ page nào | Cao | Mỗi page prompt phải bắt đầu bằng inspect `src/components` — không tạo component mới nếu đã có |
| `dashboard/` có 20 components nhưng `/dashboard` page chỉ dùng placeholder | Cao | Phase 2 phải refactor `/dashboard` page sử dụng đúng components |
| Một số components trùng concept: `lexi-button` vs `action-button` vs `icon-button` | Thấp | Đọc types.ts và props interface của từng file trước khi chọn |

### 9.3 Screenshot

| Rủi ro | Mức độ | Giải pháp |
|---|---|---|
| Mỗi folder có 5 viewports — desktop-1440 là canonical, mobile có thể khác layout đáng kể | Trung bình | Luôn kiểm tra cả 5 viewports. Không kết luận layout mobile từ desktop |
| `onboard-lang` và `onboard-goal` là 2 steps của cùng 1 route `/onboarding` | Thấp | Nhận ra đây là multi-step wizard, không tạo 2 routes riêng |
| `golden-question` và `learning-session` có thể dùng cùng exercise components | Thấp | So sánh 2 folder trước khi build, tái dùng components từ `learning/exercises/` |

### 9.4 Data / API

| Rủi ro | Mức độ | Giải pháp |
|---|---|---|
| 4 features rỗng (`admin`, `exam`, `learning`, `vocabulary`) cần api/dto/mapper trước khi gắn real data | Cao | Dùng typed mock data trong page khi chưa có backend, theo đúng database shape |
| `golden_time_queue` phụ thuộc SRS algorithm phức tạp | Cao | UI-first với mock data; không build SRS logic trong frontend |
| `user_exam_to_srs_queue` link exam → SRS là concept cốt lõi | Trung bình | Phải thể hiện đúng trong UI (ExamToSrsLoop component đã có) |
| Vocab có 3 language variants (EN/JP/ZH) với fields khác nhau (kanji, hanzi, furigana) | Trung bình | `vocab-item-detail-panel` cần render đúng theo `language.code` — kiểm tra types.ts |
| Payment: VND currency, không phải USD — format số đúng | Thấp | Dùng `Intl.NumberFormat('vi-VN')` |

---

## 10. Checklist chung cho các prompt triển khai UI

Áp dụng cho mọi prompt migrate/build page:

```
Trước khi viết code:
  [ ] Đọc screenshot folder tương ứng: desktop-1440 + mobile-375 (tối thiểu).
  [ ] Đọc prototype file liên quan từ DESIGN_SOURCE_DIR.
  [ ] Inspect src/components/<domain>/ — tìm component có thể tái dùng.
  [ ] Inspect src/features/<feature>/ — tìm api/dto/mapper/hook sẵn có.
  [ ] Xác định layout shell: LearnerAppShell / AdminShell / FocusLearningShell / MarketingShell.

Khi viết code:
  [ ] Mọi file component phải là .tsx với typed props.
  [ ] Không dùng any (nếu bắt buộc, giải thích).
  [ ] Import alias @/ thay vì đường dẫn tương đối dài.
  [ ] Tái dùng shadcn/ui + Radix primitives trước khi tự viết.
  [ ] Không inline style cho layout/color/spacing thông thường.
  [ ] Không clickable div — dùng button hoặc Link.
  [ ] Không gọi API trực tiếp trong UI component.
  [ ] "use client" chỉ khi thực sự cần (hook, event, Radix interactive, Zustand, TanStack Query).
  [ ] DTO ↔ UI type ↔ Mapper phân tách khi có data backend.
  [ ] Dùng typed mock data (gần với database shape) khi chưa có backend endpoint.

Trước khi kết thúc:
  [ ] Kiểm tra loading / empty / error / disabled states.
  [ ] Kiểm tra responsive: desktop-1440 + tablet-768 + mobile-375.
  [ ] Kiểm tra aria-label cho icon buttons, title cho Dialog/Sheet.
  [ ] Giữ LexiPath identity (learning path, Golden Time, skill lanes, next best step, exam→SRS).
  [ ] npm run lint && npm run typecheck — không kết thúc nếu lỗi.
```
