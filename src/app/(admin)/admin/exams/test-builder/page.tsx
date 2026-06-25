import type { Metadata } from "next";
import { TestBuilderClient } from "@/features/admin-exam-builder";
import { MOCK_TESTS, MOCK_STRUCTURES, MOCK_ACCESS_RULES } from "@/features/admin-exam-builder";

export const metadata: Metadata = { title: "Tạo đề thi" };

export default function AdminTestBuilderPage() {
  return (
    <TestBuilderClient
      initialTests={MOCK_TESTS}
      initialStructures={MOCK_STRUCTURES}
      initialAccessRules={MOCK_ACCESS_RULES}
    />
  );
}
