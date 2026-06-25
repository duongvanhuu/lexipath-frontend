import type { Metadata } from "next";
import { PROGRAMS_MOCK, EXAM_TYPES_MOCK } from "@/features/admin-exam-programs";
import { ProgramsClient } from "@/features/admin-exam-programs";

export const metadata: Metadata = { title: "Chương trình thi" };

export default function AdminExamProgramsPage() {
  return (
    <ProgramsClient
      initialPrograms={PROGRAMS_MOCK}
      initialTypes={EXAM_TYPES_MOCK}
    />
  );
}
