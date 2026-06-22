import type * as React from "react";

export interface AdminTableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  enableSorting?: boolean;
  enableSelection?: boolean;
}

export interface AdminTableAction {
  id: string;
  label: string;
  variant?: "default" | "danger" | "secondary";
  icon?: React.ReactNode;
  onClick: (selectedIds: string[]) => void;
}

export interface AdminFilterState {
  search?: string;
  status?: string;
  type?: string;
  [key: string]: string | undefined;
}

export interface AdminFilterField {
  id: string;
  label: string;
  type: "search" | "select";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface ReviewTask {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_review" | "approved" | "rejected";
  priority?: "low" | "medium" | "high";
  assigneeName?: string;
  updatedAtLabel?: string;
}

export interface VersionHistoryItem {
  id: string;
  title: string;
  description?: string;
  createdAtLabel: string;
  actorName?: string;
  isCurrent?: boolean;
}

export interface PublishWorkflowStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "error";
}

export interface CollectionEditorField {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  level?: string;
  tags?: string[];
}

export interface SenseEditorField {
  id: string;
  partOfSpeech?: string;
  definition: string;
  exampleSentence?: string;
  notes?: string;
}

export interface ExampleEditorField {
  id: string;
  sentence: string;
  translation?: string;
  sourceLabel?: string;
  notes?: string;
}

export interface LessonReorderItem {
  id: string;
  title: string;
  itemCount?: number;
  position: number;
}

export interface SourceInfo {
  origin?: string;
  author?: string;
  license?: string;
  url?: string;
  retrievedAtLabel?: string;
  notes?: string;
}

export interface AdminSidebarNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface AdminSidebarNavSection {
  id?: string;
  label?: string;
  items: AdminSidebarNavItem[];
}
