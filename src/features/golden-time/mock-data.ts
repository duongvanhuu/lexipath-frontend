import type { LearningInsightCardProps } from "@/components/lexipath/insights/learning-insight-card";

import type { GoldenTimeDashboardData } from "./types";

export const MOCK_GOLDEN_TIME_DASHBOARD: GoldenTimeDashboardData = {
  queueCount: 12,
  overdueCount: 3,
  windowOpen: true,
  closeAt: "22:00",
  timeWindowMessage: "Ôn đúng thời điểm — trước khi quên · ~7 phút",
  reasons: ["post_session", "forgetting_curve"],
  estimatedMinutes: 7,
  weakSkillLabel: "Chính tả",
  goalDone: 8,
  goalTotal: 30,
  queue: [
    { id: "1", word: "accomplish",  meaningVi: "hoàn thành",  reason: "overdue",   skillKey: "meaning",     dueLabel: "Quá hạn 2 ngày" },
    { id: "2", word: "determine",   meaningVi: "xác định",    reason: "exam_miss", skillKey: "listening" },
    { id: "3", word: "negotiate",   meaningVi: "đàm phán",    reason: "weak",      skillKey: "usage" },
    { id: "4", word: "revenue",     meaningVi: "doanh thu",   reason: "due",       skillKey: "collocation", dueLabel: "Hôm nay" },
    { id: "5", word: "persevere",   meaningVi: "kiên trì",    reason: "due",       skillKey: "spelling",    dueLabel: "Hôm nay" },
    { id: "6", word: "collaborate", meaningVi: "hợp tác",     reason: "weak",      skillKey: "meaning" },
    { id: "7", word: "initiative",  meaningVi: "sáng kiến",   reason: "overdue",   skillKey: "usage",       dueLabel: "Quá hạn 1 ngày" },
    { id: "8", word: "implement",   meaningVi: "triển khai",  reason: "due",       skillKey: "listening",   dueLabel: "Hôm nay" },
  ],
  schedule: [
    {
      id: "now",
      timeLabel: "Ngay bây giờ",
      title: "Golden Time",
      itemCount: 12,
      status: "now",
    },
    {
      id: "s1",
      timeLabel: "15:00",
      title: "Ôn từ Business",
      itemCount: 6,
      status: "upcoming",
      reason: "overdue",
    },
    {
      id: "s2",
      timeLabel: "19:00",
      title: "Ôn Phrasal verbs",
      itemCount: 5,
      status: "upcoming",
      reason: "weak",
    },
    {
      id: "s3",
      timeLabel: "22:00",
      title: "Kiểm tra từ mới học",
      itemCount: 4,
      status: "upcoming",
      reason: "newly_learned",
    },
  ],
  skillLanes: [
    { skill: "meaning",     masteredCount: 58, totalCount: 80, accuracyPct: 87 },
    { skill: "listening",   masteredCount: 34, totalCount: 80, accuracyPct: 72 },
    { skill: "spelling",    masteredCount: 20, totalCount: 80, accuracyPct: 61 },
    { skill: "usage",       masteredCount: 45, totalCount: 80, accuracyPct: 78 },
    { skill: "collocation", masteredCount: 12, totalCount: 80, accuracyPct: 55 },
  ],
};

export const MOCK_GOLDEN_TIME_INSIGHTS: LearningInsightCardProps[] = [
  {
    title: "Đã ôn hôm nay",
    value: 24,
    unit: "từ",
    sublabel: "Trong phiên Golden Time",
    trend: "up",
  },
  {
    title: "Độ chính xác",
    value: "82%",
    sublabel: "Phiên gần nhất",
    trend: "up",
  },
  {
    title: "Chuỗi học",
    value: 7,
    unit: "ngày",
    sublabel: "Liên tiếp không nghỉ",
    trend: "up",
  },
  {
    title: "XP kiếm được",
    value: "+120",
    sublabel: "Golden Time hôm nay",
    trend: "flat",
  },
];
