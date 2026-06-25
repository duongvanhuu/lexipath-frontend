import type {
  ExamTest,
  AccessRule,
  TestStructureMap,
  AccessRulesMap,
  ExamProgramRef,
  ExamTypeRef,
  ExamBlueprintRef,
  TaskTypeRef,
} from "../types/exam-builder.types";

export const BUILDER_PROGRAMS: ExamProgramRef[] = [
  { id: "p-ielts", code: "IELTS", name: "IELTS", color: "#2563EB" },
  { id: "p-toeic", code: "TOEIC", name: "TOEIC", color: "#0284C7" },
  { id: "p-hsk",   code: "HSK",   name: "HSK",   color: "#DC2626" },
  { id: "p-jlpt",  code: "JLPT",  name: "JLPT",  color: "#7C3AED" },
];

export const BUILDER_EXAM_TYPES: ExamTypeRef[] = [
  { id: "t-full",     name: "Đề đầy đủ" },
  { id: "t-mini",     name: "Đề mini" },
  { id: "t-skill",    name: "Luyện kỹ năng" },
  { id: "t-practice", name: "Bộ luyện tập" },
];

export const BUILDER_BLUEPRINTS: ExamBlueprintRef[] = [
  { id: "bp-ielts-ac", programId: "p-ielts", name: "IELTS Academic — Đề đầy đủ v1" },
  { id: "bp-ielts-gt", programId: "p-ielts", name: "IELTS General Training — Đề đầy đủ v1" },
  { id: "bp-toeic-lr", programId: "p-toeic", name: "TOEIC L&R — Đề mô phỏng v1" },
  { id: "bp-hsk3",     programId: "p-hsk",   name: "HSK 3 — Đề thực hành v1" },
];

export const BUILDER_TASK_TYPES: TaskTypeRef[] = [
  { id: "mcq",      name: "Trắc nghiệm" },
  { id: "fill",     name: "Điền chỗ trống" },
  { id: "matching", name: "Ghép đôi" },
  { id: "ordering", name: "Sắp xếp" },
  { id: "short",    name: "Trả lời ngắn" },
  { id: "essay",    name: "Bài viết" },
  { id: "speaking", name: "Nói" },
  { id: "image",    name: "Mô tả hình" },
];

export const BUILDER_SKILLS = [
  { id: "listening", name: "Nghe" },
  { id: "reading",   name: "Đọc" },
  { id: "writing",   name: "Viết" },
  { id: "speaking",  name: "Nói" },
  { id: "grammar",   name: "Ngữ pháp" },
  { id: "vocab",     name: "Từ vựng" },
];

export const MOCK_TESTS: ExamTest[] = [
  {
    id: "tst-ielts-01", code: "IELTS-AC-T01",
    name: "IELTS Academic — Đề thực hành 1",
    desc: "Mô phỏng đề IELTS Academic đầy đủ 4 kỹ năng.",
    programId: "p-ielts", typeId: "t-full", blueprintId: "bp-ielts-ac",
    durationMin: 165, questionTotal: 9, sectionCount: 4,
    status: "published", version: 2, updatedAt: "10/06/2026",
  },
  {
    id: "tst-toeic-01", code: "TOEIC-LR-T01",
    name: "TOEIC L&R — Đề mô phỏng 1",
    desc: "Đề TOEIC đầy đủ 200 câu, 2 phần Nghe và Đọc.",
    programId: "p-toeic", typeId: "t-full", blueprintId: "bp-toeic-lr",
    durationMin: 120, questionTotal: 200, sectionCount: 2,
    status: "draft", version: 1, updatedAt: "09/06/2026",
  },
  {
    id: "tst-ielts-02", code: "IELTS-AC-T02",
    name: "IELTS Academic — Đề thực hành 2",
    desc: "Phiên bản 2, bổ sung Reading Passage 3.",
    programId: "p-ielts", typeId: "t-full", blueprintId: "bp-ielts-ac",
    durationMin: 170, questionTotal: 82, sectionCount: 4,
    status: "draft", version: 1, updatedAt: "08/06/2026",
  },
  {
    id: "tst-hsk3-01", code: "HSK3-T01",
    name: "HSK 3 — Đề thực hành",
    desc: "Đề thực hành HSK cấp độ 3.",
    programId: "p-hsk", typeId: "t-full", blueprintId: "bp-hsk3",
    durationMin: 85, questionTotal: 100, sectionCount: 3,
    status: "archived", version: 1, updatedAt: "05/06/2026",
  },
];

export const MOCK_STRUCTURES: TestStructureMap = {
  "tst-ielts-01": [
    {
      id: "s-l", order: 1, name: "Nghe (Listening)", skill: "listening", durationMin: 30,
      parts: [
        { id: "p-l-1", order: 1, name: "Section 1", taskType: "fill",     qCount: 10, questionIds: ["q-fill-2"] },
        { id: "p-l-2", order: 2, name: "Section 2", taskType: "mcq",      qCount: 10, questionIds: ["q-mcq-2"] },
      ],
    },
    {
      id: "s-r", order: 2, name: "Đọc (Reading)", skill: "reading", durationMin: 60,
      parts: [
        { id: "p-r-1", order: 1, name: "Passage 1", taskType: "mcq",  qCount: 13, questionIds: ["q-mcq-1", "q-tfng-1", "q-short-1"] },
        { id: "p-r-2", order: 2, name: "Passage 2", taskType: "fill", qCount: 14, questionIds: ["q-fill-1"] },
      ],
    },
    {
      id: "s-w", order: 3, name: "Viết (Writing)", skill: "writing", durationMin: 60,
      parts: [
        { id: "p-w-1", order: 1, name: "Task 1", taskType: "essay", qCount: 1, questionIds: [] },
        { id: "p-w-2", order: 2, name: "Task 2", taskType: "essay", qCount: 1, questionIds: ["q-write-1"] },
      ],
    },
    {
      id: "s-sp", order: 4, name: "Nói (Speaking)", skill: "speaking", durationMin: 15,
      parts: [
        { id: "p-sp-1", order: 1, name: "Part 2", taskType: "speaking", qCount: 1, questionIds: ["q-speak-1"] },
      ],
    },
  ],
  "tst-toeic-01": [],
  "tst-ielts-02": [],
  "tst-hsk3-01": [],
};

export const DEFAULT_ACCESS_RULES = (prefix = "ar"): AccessRule[] => [
  { id: `${prefix}-plan`,     type: "plan",     label: "Yêu cầu gói",       value: "Miễn phí",       enabled: true,  icon: "crown"  },
  { id: `${prefix}-attempts`, type: "attempts", label: "Số lần làm tối đa", value: "Không giới hạn", enabled: false, icon: "repeat" },
];

export const MOCK_ACCESS_RULES: AccessRulesMap = {
  "tst-ielts-01": [
    { id: "ar1-plan",     type: "plan",     label: "Yêu cầu gói",       value: "Gói Premium", enabled: true,  icon: "crown"  },
    { id: "ar1-attempts", type: "attempts", label: "Số lần làm tối đa", value: "3",           enabled: true,  icon: "repeat" },
  ],
  "tst-toeic-01": DEFAULT_ACCESS_RULES("ar2"),
  "tst-ielts-02": DEFAULT_ACCESS_RULES("ar3"),
  "tst-hsk3-01":  DEFAULT_ACCESS_RULES("ar4"),
};

export function getProgramColor(programId: string): string {
  return BUILDER_PROGRAMS.find((p) => p.id === programId)?.color ?? "#6B7280";
}

export function getProgramCode(programId: string): string {
  return BUILDER_PROGRAMS.find((p) => p.id === programId)?.code ?? programId;
}

export function getSkillName(skillId: string): string {
  return BUILDER_SKILLS.find((s) => s.id === skillId)?.name ?? skillId;
}
