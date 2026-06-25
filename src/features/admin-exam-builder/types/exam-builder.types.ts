export type TestStatus = "draft" | "published" | "archived";

export interface ExamTest {
  id: string;
  code: string;
  name: string;
  desc: string;
  programId: string;
  typeId: string;
  blueprintId: string;
  durationMin: number;
  questionTotal: number;
  sectionCount: number;
  status: TestStatus;
  version: number;
  updatedAt: string;
}

export interface TestSection {
  id: string;
  order: number;
  name: string;
  skill: string;
  durationMin: number;
  parts: TestPart[];
}

export interface TestPart {
  id: string;
  order: number;
  name: string;
  taskType: string;
  qCount: number;
  questionIds: string[];
}

export interface AccessRule {
  id: string;
  type: string;
  label: string;
  value: string;
  enabled: boolean;
  icon: string;
}

export interface ValidationError {
  sev: "error" | "warning";
  msg: string;
}

export interface ExamBlueprintRef {
  id: string;
  programId: string;
  name: string;
}

export interface ExamTypeRef {
  id: string;
  name: string;
}

export interface ExamProgramRef {
  id: string;
  code: string;
  name: string;
  color: string;
}

export interface TaskTypeRef {
  id: string;
  name: string;
}

export type TestStructureMap = Record<string, TestSection[]>;
export type AccessRulesMap = Record<string, AccessRule[]>;
