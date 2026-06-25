import type { Metadata } from "next";
import {
  BLUEPRINTS_MOCK,
  TASK_TYPES_MOCK,
} from "@/features/admin-exam-blueprints";
import { BlueprintListClient } from "@/features/admin-exam-blueprints";
import { PROGRAMS_MOCK, EXAM_TYPES_MOCK } from "@/features/admin-exam-programs";

export const metadata: Metadata = { title: "Blueprints" };

export default function AdminBlueprintsPage() {
  return (
    <BlueprintListClient
      blueprints={BLUEPRINTS_MOCK}
      programs={PROGRAMS_MOCK}
      examTypes={EXAM_TYPES_MOCK}
    />
  );
}
