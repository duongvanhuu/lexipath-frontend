import type { Metadata } from "next";

import { ExamCatalogView } from "./exam-catalog-view";

export const metadata: Metadata = {
  title: "Kho đề",
  description:
    "Đề thi mô phỏng chính thức cho IELTS, TOEIC, HSK và JLPT — xem cấu trúc, yêu cầu kỹ năng, điểm số và bộ từ liên quan.",
};

export default function ExamsPage() {
  return <ExamCatalogView />;
}
