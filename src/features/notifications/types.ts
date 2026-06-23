export type NotifType =
  | "golden_time"
  | "streak"
  | "daily_goal"
  | "new_content"
  | "payment"
  | "security"
  | "exam";

export type NotifFilterTab =
  | "all"
  | "unread"
  | "learning"
  | "golden_time"
  | "streak"
  | "payment"
  | "security"
  | "system";

export interface AppNotification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  sentAt: Date;
  openedAt: Date | null;
  lang: "en" | "ja" | "zh" | null;
  action: string;
  dest: string;
}
