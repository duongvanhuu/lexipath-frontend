import type { Metadata } from "next";
import { VocabCreateClient } from "@/components/admin-vocab/lang-picker/vocab-create-client";

export const metadata: Metadata = { title: "Thêm mục từ" };

export default function AdminVocabNewPage() {
  return <VocabCreateClient />;
}
