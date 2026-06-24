import type { Metadata } from "next";
import { CollectionEditorClient } from "@/components/admin-collections/collection-editor-client";

export const metadata: Metadata = { title: "Tạo bộ sưu tập" };

export default function NewCollectionPage() {
  return (
    <CollectionEditorClient
      initialCollection={null}
      initialLessons={[]}
      initialItems={{}}
      initialAccessRule={null}
      initialVersions={[]}
    />
  );
}
