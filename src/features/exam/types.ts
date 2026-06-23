export type ExamLang = 'en' | 'zh' | 'ja';
export type ExamAccess = 'free' | 'pro';
export type ExamTypeId = 'full' | 'mini' | 'skill' | 'practice';

export interface LearnerExamProgram {
  id: string;
  name: string;
  fullName: string;
  lang: ExamLang;
  langFlag: string;
  /** Brand hex color for accent rail and icon badge */
  color: string;
  colorSoft: string;
  colorSoftFg: string;
  glyphBig: string;
  desc: string;
  levels: string[];
  testCount: number;
  freeCount: number;
  skills: string[];
  featured: boolean;
}

export interface ExamTypeInfo {
  label: string;
  icon: string;
  color: string;
  soft: string;
  softFg: string;
}

export interface LearnerExamTest {
  id: string;
  programId: string;
  typeId: ExamTypeId;
  title: string;
  level: string;
  durationMin: number;
  questions: number;
  maxScore: string;
  access: ExamAccess;
  featured: boolean;
  isNew: boolean;
  skills: string[];
  desc: string;
}

export interface RelatedCollection {
  id: string;
  title: string;
  items: number;
  collId: string;
}

export interface ExamBlueprintPart {
  name: string;
  desc: string;
  q: number;
  type: string;
}

export interface ExamBlueprintSection {
  name: string;
  durationMin: number;
  totalQ: number;
  parts: ExamBlueprintPart[];
}

export interface ExamBlueprintData {
  description: string;
  instruction: string;
  scoreSystem: string;
  passMark: string;
  accessLocked: boolean;
  relatedCollections: RelatedCollection[];
  sections: ExamBlueprintSection[];
}

export type ExamBlueprintsMap = Record<string, ExamBlueprintData>;
export type ExamTypeMeta = Record<ExamTypeId, ExamTypeInfo>;
