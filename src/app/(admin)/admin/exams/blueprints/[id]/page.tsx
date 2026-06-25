import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BLUEPRINTS_MOCK,
  BLUEPRINT_SECTIONS_MOCK,
  TASK_TYPES_MOCK,
} from "@/features/admin-exam-blueprints";
import { BlueprintEditorClient } from "@/features/admin-exam-blueprints";
import { PROGRAMS_MOCK, EXAM_TYPES_MOCK } from "@/features/admin-exam-programs";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const bp = BLUEPRINTS_MOCK.find((b) => b.id === id);
  return { title: bp ? `${bp.code} — Blueprint` : "Blueprint" };
}

export default async function AdminBlueprintEditorPage({ params }: Props) {
  const { id } = await params;
  const blueprint = BLUEPRINTS_MOCK.find((b) => b.id === id);
  if (!blueprint) notFound();

  const sections = BLUEPRINT_SECTIONS_MOCK[id] ?? [];

  return (
    <BlueprintEditorClient
      blueprint={blueprint}
      initialSections={sections}
      programs={PROGRAMS_MOCK}
      examTypes={EXAM_TYPES_MOCK}
      taskTypes={TASK_TYPES_MOCK}
    />
  );
}
