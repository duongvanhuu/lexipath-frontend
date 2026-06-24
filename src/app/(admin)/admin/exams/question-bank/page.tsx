import type { Metadata } from "next";
import { QUESTION_BANK_MOCK } from "@/features/admin-exam-qbank/mock/question-bank.mock";
import { QuestionBankClient } from "@/features/admin-exam-qbank/components/question-bank-client";

export const metadata: Metadata = { title: "Ngân hàng câu hỏi" };

export default function AdminQuestionBankPage() {
  return <QuestionBankClient mock={QUESTION_BANK_MOCK} />;
}
