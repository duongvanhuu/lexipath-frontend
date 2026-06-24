export type ReviewItemLang = "en" | "ja" | "zh";

export type ReviewTaskStatus =
  | "pending"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "published";

export type ReviewTaskPriority = "high" | "medium" | "low";

export type ReviewCommentRole = "author" | "reviewer";

export type ReviewCommentSeverity = "blocker" | "major" | "minor";

export type ValidationCheckLevel = "error" | "warning";

export interface ReviewBoardTask {
  id: string;
  itemTitle: string;
  itemType: string;
  lang: ReviewItemLang;
  author: string;
  assignee: string;
  status: ReviewTaskStatus;
  priority: ReviewTaskPriority;
  created: string;
  updated: string;
  commentCount: number;
  changeCount: number;
}

export interface ReviewDiffRow {
  field: string;
  before: string;
  after: string;
}

export interface ReviewComment {
  id: string;
  author: string;
  role: ReviewCommentRole;
  text: string;
  timestamp: string;
  resolved: boolean;
  field?: string;
  severity?: ReviewCommentSeverity;
}

export interface ReviewItemMeta {
  title: string;
  lang: ReviewItemLang;
  type: string;
  contentStatus: string;
}

export interface ReviewTaskDetail {
  taskId: string;
  item: ReviewItemMeta;
  authorName: string;
  assigneeName: string;
  priority: ReviewTaskPriority;
  status: ReviewTaskStatus;
  created: string;
  updated: string;
  changeCount: number;
  comments: ReviewComment[];
  diff: ReviewDiffRow[];
}

export interface ValidationCheck {
  label: string;
  ok: boolean;
  level: ValidationCheckLevel;
}

export interface ReviewSourceInfo {
  name: string;
  license: string;
  citation: boolean;
}
