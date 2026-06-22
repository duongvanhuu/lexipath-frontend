# LexiPath component usage audit — Web Design (16)

## Phạm vi phân tích
- Source-of-truth chính: `LexiPath Prototype FINAL.html` và `LexiPath Landing Page FINAL.html`.
- Bỏ qua `uploads/`, các bản prototype/archive cũ, QA report và screenshot assets.
- Kết quả dưới đây dùng chế độ **strict final-route**: chỉ tính các file screen cuối cùng được route bởi `app_v5.jsx` hoặc landing final.

## Tóm tắt
- Tổng component trong `lexipath-vocabulary-web-kit`: **167**.
- Component được dùng trong final app/landing: **90**.
- Component có thể bỏ qua giai đoạn migrate đầu: **77**.
- Component chỉ thấy trong file cũ/override cũ, không nằm trong strict final-route: **11**.

## Component cần migrate

### admin (11)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `AdminDataTable` | `components/admin/AdminDataTable.jsx` | 15 | `screens_admin_payment_full.jsx; screens_admin.jsx; screens_admin_reliability.jsx` |
| `AdminShell` | `components/admin/AdminShell.jsx` | 3 | `screens_admin.jsx` |
| `AdminSidebarSection` | `components/admin/AdminSidebarSection.jsx` | 2 | `screens_admin.jsx` |
| `DetailDrawer` | `components/admin/DetailDrawer.jsx` | 14 | `screens_admin_payment_full.jsx; screens_admin_security_full.jsx; screens_admin_rbac.jsx` |
| `FilterToolbar` | `components/admin/FilterToolbar.jsx` | 9 | `screens_admin.jsx; screens_admin_pipeline.jsx; screens_admin_exam_qbank.jsx` |
| `FormField` | `components/admin/CreateEditForm.jsx` | 41 | `screens_admin_pipeline.jsx; screens_admin_vocab_v15.jsx; screens_admin_review_v2.jsx` |
| `PublishWorkflowBar` | `components/admin/PublishWorkflowBar.jsx` | 1 | `screens_admin_vocab_editor.jsx` |
| `ReviewTaskCard` | `components/admin/ReviewTaskCard.jsx` | 3 | `screens_admin.jsx; screens_new.jsx` |
| `SenseEditorForm` | `components/admin/SenseEditorForm.jsx` | 1 | `screens_admin_vocab_editor.jsx` |
| `SourceInfoPanel` | `components/admin/SourceInfoPanel.jsx` | 2 | `screens_admin_review_v2.jsx` |
| `VersionHistoryPanel` | `components/admin/VersionHistoryPanel.jsx` | 2 | `screens_admin_vocab_editor.jsx; screens_admin_pipeline.jsx` |

### auth (5)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `AuthCard` | `components/auth/AuthCard.jsx` | 40 | `screens_auth_v2.jsx; screens_extras.jsx; screens_new.jsx` |
| `GoalChoiceCard` | `components/auth/GoalChoiceCard.jsx` | 5 | `screens_onboarding_v2.jsx; screens_new.jsx` |
| `LanguageChoiceCard` | `components/auth/LanguageChoiceCard.jsx` | 3 | `screens_onboarding_v2.jsx; screens_new.jsx` |
| `OnboardingStepLayout` | `components/auth/OnboardingStepLayout.jsx` | 25 | `screens_onboarding_v2.jsx; screens_new.jsx` |
| `SocialLoginButton` | `components/auth/SocialLoginButton.jsx` | 6 | `screens_extras.jsx; screens_auth_v2.jsx` |

### core (11)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `Avatar` | `components/core/Avatar.jsx` | 17 | `screens_stats_social.jsx; screens_admin_review_v2.jsx; screens_admin_pipeline.jsx` |
| `Badge` | `components/core/Badge.jsx` | 196 | `screens_admin_review_v2.jsx; screens_admin_pipeline.jsx; shared_golden_time.jsx` |
| `Button` | `components/core/Button.jsx` | 462 | `screens_admin_lessons.jsx; shared_golden_time.jsx; screens_admin_pipeline.jsx` |
| `Card` | `components/core/Card.jsx` | 270 | `shared_golden_time.jsx; screens_stats_overview.jsx; screens_settings.jsx` |
| `DropdownMenu` | `components/core/DropdownMenu.jsx` | 1 | `screens_admin_security_full.jsx` |
| `IconButton` | `components/core/IconButton.jsx` | 2 | `screens_admin_security_full.jsx` |
| `Input` | `components/core/Input.jsx` | 29 | `screens_auth_v2.jsx; screens_extras.jsx; screens_settings.jsx` |
| `Progress` | `components/core/Progress.jsx` | 19 | `screens_stats_social.jsx; screens_new.jsx; screens_global_states.jsx` |
| `ProgressRing` | `components/core/ProgressRing.jsx` | 1 | `screens_stats_overview.jsx` |
| `Switch` | `components/core/Switch.jsx` | 12 | `screens_settings.jsx; screens_notifications_v2.jsx; screens_admin_lessons.jsx` |
| `Textarea` | `components/core/Textarea.jsx` | 1 | `screens_settings.jsx` |

### exam (9)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `ComingSoonExamPlayerState` | `components/exam/ComingSoonExamPlayerState.jsx` | 1 | `screens_exam_catalog_3c.jsx` |
| `ExamProgramCard` | `components/exam/ExamProgramCard.jsx` | 2 | `screens_exam_catalog_3c.jsx; screens_admin.jsx` |
| `ExamTestCard` | `components/exam/ExamTestCard.jsx` | 2 | `screens_exam_catalog_3c.jsx; screens_admin.jsx` |
| `PassageParagraphEditor` | `components/exam/PassageParagraphEditor.jsx` | 2 | `screens_admin_exam_media.jsx` |
| `QuestionBankTable` | `components/exam/QuestionBankTable.jsx` | 1 | `screens_admin.jsx` |
| `QuestionEditorPanel` | `components/exam/QuestionEditorPanel.jsx` | 1 | `screens_admin_exam_qbank.jsx` |
| `RubricCriteriaCard` | `components/exam/RubricCriteriaCard.jsx` | 4 | `screens_admin.jsx` |
| `ScoringScaleTable` | `components/exam/ScoringScaleTable.jsx` | 2 | `screens_admin.jsx` |
| `TestBuilderCanvas` | `components/exam/TestBuilderCanvas.jsx` | 1 | `screens_admin.jsx` |

### feedback (10)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `ContentStatusBadge` | `components/feedback/ContentStatusBadge.jsx` | 17 | `screens_admin.jsx; screens_admin_vocab_v15.jsx; screens_admin_lessons.jsx` |
| `Dialog` | `components/feedback/Dialog.jsx` | 14 | `screens_profile_v3.jsx; screens_admin_security_full.jsx; screens_admin_exam_qbank.jsx` |
| `EmptyState` | `components/feedback/EmptyState.jsx` | 12 | `screens_admin_lessons.jsx; screens_admin_exam_qbank.jsx; screens_admin_exam_scoring.jsx` |
| `EntitlementBadge` | `components/feedback/EntitlementBadge.jsx` | 9 | `screens_admin_payment_full.jsx; screens_subscription_v2.jsx; screens_profile_v3.jsx` |
| `ErrorState` | `components/feedback/ErrorState.jsx` | 1 | `screens_global_states.jsx` |
| `LoadingSkeleton` | `components/feedback/LoadingSkeleton.jsx` | 5 | `shared_golden_time.jsx; screens_golden_english.jsx` |
| `LockedFeatureState` | `components/feedback/LockedFeatureState.jsx` | 1 | `screens_global_states.jsx` |
| `PaymentStatusBadge` | `components/feedback/PaymentStatusBadge.jsx` | 3 | `screens_subscription_v3.jsx; screens_subscription_v2.jsx` |
| `PermissionDeniedState` | `components/feedback/PermissionDeniedState.jsx` | 2 | `screens_admin_rbac.jsx; screens_global_states.jsx` |
| `StatusBadge` | `components/feedback/StatusBadge.jsx` | 1 | `screens_lesson_detail_shared.jsx` |

### layout (2)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `Breadcrumb` | `components/layout/Breadcrumb.jsx` | 6 | `screens_admin_vocab_editor.jsx; screens_admin_vocab_editor_v4.jsx; screens_admin_pipeline.jsx` |
| `PageHeader` | `components/layout/PageHeader.jsx` | 60 | `screens_admin.jsx; screens_admin_payment_full.jsx; screens_admin_rbac.jsx` |

### learning (12)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `AudioQuestionCard` | `components/learning/AudioQuestionCard.jsx` | 2 | `shared_player_runner_3b.jsx` |
| `ChoiceOption` | `components/learning/ChoiceOption.jsx` | 6 | `shared_player_runner_3b.jsx; shared_golden_time.jsx; screens_golden_english.jsx` |
| `ExampleSentenceCard` | `components/learning/ExampleSentenceCard.jsx` | 2 | `shared_player_runner_3b.jsx` |
| `ExitSessionDialog` | `components/learning/ExitSessionDialog.jsx` | 4 | `app_v5.jsx; screens_extras.jsx` |
| `FeedbackCard` | `components/learning/FeedbackCard.jsx` | 1 | `shared_player_runner_3b.jsx` |
| `FillBlankCard` | `components/learning/FillBlankCard.jsx` | 1 | `shared_player_runner_3b.jsx` |
| `Flashcard` | `components/learning/Flashcard.jsx` | 1 | `lp_features.jsx` |
| `LearningSessionTopBar` | `components/learning/LearningSessionTopBar.jsx` | 2 | `shared_golden_time.jsx; screens_golden_english.jsx` |
| `MistakeTypeBadge` | `components/learning/MistakeTypeBadge.jsx` | 2 | `shared_player_runner_3b.jsx; shared_golden_time.jsx` |
| `SessionSummaryCard` | `components/learning/SessionSummaryCard.jsx` | 1 | `shared_player_runner_3b.jsx` |
| `SpellingInputCard` | `components/learning/SpellingInputCard.jsx` | 1 | `shared_player_runner_3b.jsx` |
| `StatTile` | `components/learning/StatTile.jsx` | 27 | `screens_stats_overview.jsx; screens_new.jsx; screens_stats_social.jsx` |

### navigation (3)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `Streak` | `components/navigation/TopBar.jsx` | 18 | `screens_stats_overview.jsx; screens_public_profile.jsx; screens_profile_v3.jsx` |
| `Tabs` | `components/navigation/Tabs.jsx` | 8 | `screens_admin_exam_qbank.jsx; screens_admin_exam_scoring.jsx; screens_admin_exam_testbuilder.jsx` |
| `XpPill` | `components/navigation/TopBar.jsx` | 1 | `learner_shell.jsx` |

### notebook (1)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `AddToLearningDialog` | `components/notebook/AddToLearningDialog.jsx` | 3 | `screens_extras.jsx; app_v5.jsx` |

### other (20)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `CollectionJourneyCard` | `_ds_v21_supplement.js` | 2 | `screens_home_v21.jsx; screens_collection_v21b.jsx` |
| `CollectionProgressStory` | `_ds_v21_supplement.js` | 1 | `screens_collection_v21b.jsx` |
| `EmptySpaceCompanionPanel` | `_ds_v21_supplement.js` | 2 | `screens_notebook_v21b.jsx; screens_collection_v21b.jsx` |
| `GoldenQueuePreview` | `_ds_v21_supplement.js` | 1 | `screens_golden_v21b.jsx` |
| `GoldenTimeWindow` | `_ds_v21_supplement.js` | 2 | `screens_golden_v21b.jsx; screens_home_v21.jsx` |
| `JourneyCheckpointCard` | `_ds_v21_supplement.js` | 1 | `screens_onboarding_v21.jsx` |
| `JourneyRail` | `_ds_v21_supplement.js` | 1 | `screens_collection_v21b.jsx` |
| `LearnerCanvas` | `_ds_v21_supplement.js` | 9 | `screens_notebook_v21b.jsx; screens_collection_v21b.jsx; screens_golden_v21b.jsx` |
| `LearningInsightCard` | `_ds_v21_supplement.js` | 1 | `screens_home_v21.jsx` |
| `NextBestStepCard` | `_ds_v21_supplement.js` | 2 | `screens_onboarding_v21.jsx; screens_home_v21.jsx` |
| `OnboardingJourneyShell` | `_ds_v21_supplement.js` | 1 | `screens_onboarding_v21.jsx` |
| `OnboardingPathPreview` | `_ds_v21_supplement.js` | 1 | `screens_onboarding_v21.jsx` |
| `PageJourneyHeader` | `_ds_v21_supplement.js` | 7 | `screens_notebook_v21b.jsx; screens_collection_v21b.jsx; screens_golden_v21b.jsx` |
| `ReviewReasonChip` | `_ds_v21_supplement.js` | 1 | `shared_player_runner_3b.jsx` |
| `SetupStepCard` | `_ds_v21_supplement.js` | 1 | `screens_onboarding_v21.jsx` |
| `SkillBranchPanel` | `_ds_v21_supplement.js` | 4 | `screens_golden_v21b.jsx; screens_home_v21.jsx; screens_notebook_v21b.jsx` |
| `SkillWeaknessPanel` | `_ds_v21_supplement.js` | 2 | `screens_notebook_v21b.jsx` |
| `TodayCommandCenter` | `_ds_v21_supplement.js` | 1 | `screens_home_v21.jsx` |
| `WordMasteryCanvas` | `_ds_v21_supplement.js` | 2 | `screens_notebook_v21b.jsx` |
| `WordRelationMap` | `_ds_v21_supplement.js` | 2 | `screens_notebook_v21b.jsx` |

### payment (6)
| Component | Source kit | Refs | Files chính |
|---|---|---:|---|
| `AccountLockBanner` | `components/payment/AccountLockBanner.jsx` | 5 | `screens_auth_v2.jsx; screens_admin_security_full.jsx; screens_admin_v4.jsx` |
| `DeviceSessionRow` | `components/payment/DeviceSessionRow.jsx` | 2 | `screens_admin_v4.jsx; screens_security_v2.jsx` |
| `FeatureUsageCard` | `components/payment/FeatureUsageCard.jsx` | 2 | `screens_admin_payment_full.jsx; screens_subscription_v2.jsx` |
| `PaymentTransactionRow` | `components/payment/PaymentTransactionRow.jsx` | 2 | `screens_subscription_v2.jsx; screens_admin_v4.jsx` |
| `PlanComparisonCard` | `components/payment/PlanComparisonCard.jsx` | 2 | `screens_subscription_v3.jsx; screens_subscription_v2.jsx` |
| `SecurityEventRow` | `components/payment/SecurityEventRow.jsx` | 3 | `screens_admin_security_full.jsx; screens_admin_v4.jsx; screens_security_v2.jsx` |

## Cần cân nhắc nhưng chưa cần migrate ngay
Các component này xuất hiện trong file được load hoặc prototype cũ, nhưng không nằm trong route/screen cuối cùng theo `app_v5.jsx`. Chỉ migrate khi bạn còn muốn giữ các màn cũ hoặc phát hiện route thực tế đang dùng chúng.
- **admin:** `ItemEditorTabs`
- **core:** `Separator`
- **exam:** `AnswerKeyEditor`
- **learning:** `LearningCard`, `MeaningCard`, `PhoneticAudioRow`, `SenseCard`, `VocabItemDetailPanel`
- **notebook:** `NotebookFilterTabs`, `NotebookItemRow`, `NotebookSplitLayout`

## Có thể skip ở phase migrate component đầu
- **admin (6):** `BulkActionToolbar`, `CollectionEditorForm`, `CreateEditForm`, `ExampleEditorForm`, `ItemEditorTabs`, `LessonItemReorderList`
- **auth (3):** `DailyGoalSelector`, `ScriptPreferenceSelector`, `VerificationStateCard`
- **core (9):** `CardTitle`, `Checkbox`, `CommandSearch`, `RadioGroup`, `Select`, `Separator`, `Sheet`, `Toast`, `Tooltip`
- **exam (7):** `AnswerKeyEditor`, `ExamAccessRuleCard`, `ExamBlueprintCard`, `ExamSectionPartBuilder`, `ExamTestDetailPreview`, `MediaLibraryCard`, `TranscriptEditorPanel`
- **feedback (3):** `DisabledActionState`, `SuccessToast`, `UnsavedChangesDialog`
- **learning (39):** `AchievementCard`, `AnswerChoiceButton`, `CollectionCard`, `CollectionProgressCard`, `CollectionStatsCard`, `CollocationPracticeCard`, `ContinueLearningCard`, `DailyStatsCard`, `DailySummaryCard`, `DueNowCard`, `FlashcardIntroCard`, `GoldenTimeCard`, `GoldenTimeQuestionCard`, `GoldenTimeQueueItem`, `GoldenTimeSummaryCard`, `LeaderboardRow`, `LearningCard`, `LessonCard`, `LessonRoadmapItem`, `MeaningCard`, `NotificationReminderCard`, `OverdueCard`, `PhoneticAudioRow`, `RecommendedCollectionCard`, `RelatedItemsList`, `SenseCard`, `SkillReviewGroupCard`, `SkillStatCard`, `StreakCard`, `StreakHeatmap`, `TodayGoalCard`, `UpcomingReviewCard`, `VocabItemCard`, `VocabItemDetailPanel`, `VocabItemRow`, `WeakSkillCard`, `WeeklyProgressCard`, `XPHistoryRow`, `XPStatCard`
- **navigation (2):** `Sidebar`, `TopBar`
- **notebook (5):** `DictionarySearchCommand`, `NotebookFilterTabs`, `NotebookItemRow`, `NotebookSplitLayout`, `SearchResultGroup`
- **other (3):** `LearningAtmosphere`, `LearningRoutePreview`, `LessonCheckpointRow`

## Thứ tự migrate khuyến nghị
1. **Foundation/shared:** Button, Card, Badge, Input, Progress, Avatar, Switch, Dialog, PageHeader, Breadcrumb, Status/Payment/Content/Entitlement badges, Empty/Error/Permission states.
2. **Shell + navigation:** AdminShell, AdminSidebarSection, LearnerShell replacement, Streak, XpPill, Tabs.
3. **LexiPath identity V2.1:** LearnerCanvas, PageJourneyHeader, GoldenTimeWindow, GoldenQueuePreview, SkillBranchPanel, NextBestStepCard, ReviewReasonChip, JourneyRail/Checkpoint, WordMastery/Relation.
4. **Learner feature:** learning session/exercise, vocabulary/detail/notebook v21b, stats components.
5. **Admin + exam + payment/security:** DataTable, FilterToolbar, DetailDrawer, exam builder/qbank/scoring, plan/payment/security rows.
6. **Skip old prototype components** nếu không xuất hiện trong danh sách cần migrate.