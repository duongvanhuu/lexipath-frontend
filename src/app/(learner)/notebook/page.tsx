import type { Metadata } from "next";

import { NotebookClient } from "./notebook-client";

export const metadata: Metadata = {
  title: "Sổ tay",
};

export default function NotebookPage() {
  return <NotebookClient />;
}
