import type { Metadata } from "next";

import { DictionaryClient } from "./dictionary-client";

export const metadata: Metadata = {
  title: "Từ điển",
};

export default function DictionaryPage() {
  return <DictionaryClient />;
}
