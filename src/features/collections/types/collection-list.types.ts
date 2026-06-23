export type CollectionListStatus = "not-started" | "learning" | "done";
export type CollectionListAccess = "free" | "pro";
export type CollectionListLang = "en" | "ja" | "zh";

export type CollectionRoadmapNodeState =
  | "completed"
  | "current"
  | "available"
  | "locked";

export interface CollectionRoadmapNode {
  id: number;
  title: string;
  state: CollectionRoadmapNodeState;
}

export interface CollectionListItem {
  id: string;
  glyph: string;
  glyphIsHan?: boolean;
  title: string;
  level: string;
  totalWords: number;
  masteredWords: number;
  progressPercent: number;
  status: CollectionListStatus;
  access: CollectionListAccess;
  tags: string[];
  roadmap?: CollectionRoadmapNode[];
  href: string;
  nextLessonHref?: string;
  currentLessonTitle?: string;
}

export interface CollectionListPageData {
  langCode: CollectionListLang;
  langLabel: string;
  langSubtitle: string;
  collections: CollectionListItem[];
}
