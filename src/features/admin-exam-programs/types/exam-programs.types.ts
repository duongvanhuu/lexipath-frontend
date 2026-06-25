export type ExamLanguage = "en" | "ja" | "zh";
export type ExamProgramStatus = "active" | "inactive";

export interface ExamProgram {
  id: string;
  code: string;
  name: string;
  fullName: string;
  lang: ExamLanguage;
  icon: string;
  color: string;
  desc: string;
  status: ExamProgramStatus;
  blueprintCount: number;
  testCount: number;
  updatedAt: string;
}

export interface ExamType {
  id: string;
  code: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
  usageCount: number;
}

export interface ProgramFormValues {
  code: string;
  name: string;
  fullName: string;
  lang: ExamLanguage;
  color: string;
  icon: string;
  desc: string;
  status: ExamProgramStatus;
}

export interface ExamTypeFormValues {
  code: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
}
