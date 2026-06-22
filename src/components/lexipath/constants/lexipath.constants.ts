import type {
  CheckpointState,
  GoldenTimeReason,
  ReviewReason,
  SkillKey,
} from "../types";

/* -------------------------------------------------------------------------- */
/* Skill lane labels (Vietnamese)                                              */
/* -------------------------------------------------------------------------- */

export const SKILL_LABELS: Record<SkillKey, string> = {
  meaning: "Nghĩa",
  listening: "Nghe",
  spelling: "Chính tả",
  usage: "Cách dùng",
  collocation: "Kết hợp",
};

/* -------------------------------------------------------------------------- */
/* Checkpoint state labels (Vietnamese)                                        */
/* -------------------------------------------------------------------------- */

export const CHECKPOINT_STATE_LABELS: Record<CheckpointState, string> = {
  current: "Đang học",
  due: "Đến hạn",
  weak: "Điểm yếu",
  premium: "Premium",
  completed: "Hoàn thành",
  locked: "Khoá",
  available: "Sẵn sàng",
};

/* -------------------------------------------------------------------------- */
/* Review reason labels (Vietnamese)                                           */
/* -------------------------------------------------------------------------- */

export const REVIEW_REASON_LABELS: Record<ReviewReason, string> = {
  due: "Đến hạn",
  overdue: "Quá hạn",
  weak: "Điểm yếu",
  exam_miss: "Sai câu thi",
};

/* -------------------------------------------------------------------------- */
/* Golden Time reason labels (Vietnamese)                                      */
/* -------------------------------------------------------------------------- */

export const GOLDEN_TIME_REASON_LABELS: Record<GoldenTimeReason, string> = {
  post_session: "Sau buổi học",
  forgetting_curve: "Đường quên lãng",
  exam_wrong: "Sai câu thi",
};
