import type { GoldenTimeReason, GoldenQueueItem, SkillLaneData } from "@/components/lexipath";

export type GoldenTimeScheduleItemStatus = "now" | "upcoming" | "completed";

export type GoldenTimeScheduleItemReason =
  | "weak"
  | "overdue"
  | "exam_mistake"
  | "newly_learned";

export interface GoldenTimeScheduleItem {
  id: string;
  timeLabel: string;
  title: string;
  itemCount: number;
  status: GoldenTimeScheduleItemStatus;
  reason?: GoldenTimeScheduleItemReason;
}

export interface GoldenTimeDashboardData {
  queueCount: number;
  overdueCount: number;
  windowOpen: boolean;
  closeAt?: string;
  timeWindowMessage: string;
  reasons: GoldenTimeReason[];
  queue: GoldenQueueItem[];
  schedule: GoldenTimeScheduleItem[];
  skillLanes: SkillLaneData[];
  estimatedMinutes?: number;
  weakSkillLabel?: string;
  goalDone?: number;
  goalTotal?: number;
}
