"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/shared/navigation/breadcrumb";
import { UnsavedChangesDialog } from "@/components/shared/feedback/unsaved-changes-dialog";
import { showSuccessToast, showWarningToast } from "@/components/shared/feedback/toast";
import { CollectionStickyBar } from "./collection-sticky-bar";
import { CollectionArchiveDialog } from "./collection-archive-dialog";
import { LessonInfoTab } from "./lesson-info-tab";
import { LessonItemsTab } from "./lesson-items-tab";
import { LessonPreviewTab } from "./lesson-preview-tab";
import type {
  AdminLesson,
  AdminLessonItem,
  AdminCollection,
} from "@/features/admin-collections/types";
import { DEFAULT_LESSON } from "@/features/admin-collections/types";

export interface LessonEditorClientProps {
  collection: AdminCollection;
  initialLesson: AdminLesson | null;
  initialItems: AdminLessonItem[];
  collectionHref: Route;
}

export function LessonEditorClient({
  collection,
  initialLesson,
  initialItems,
  collectionHref,
}: LessonEditorClientProps) {
  const router = useRouter();
  const isNew = !initialLesson;
  const uid = React.useId();

  const [form, setForm] = React.useState<AdminLesson>(() =>
    initialLesson ?? {
      ...DEFAULT_LESSON,
      id: `l_${uid}`,
      collection_id: collection.id,
      title: "Bài học mới",
      sort_order: 99,
    },
  );
  const [items, setItems] = React.useState<AdminLessonItem[]>(initialItems);
  const [isDirty, setIsDirty] = React.useState(false);
  const [showUnsaved, setShowUnsaved] = React.useState(false);
  const [pendingHref, setPendingHref] = React.useState<Route | null>(null);
  const [showArchive, setShowArchive] = React.useState(false);

  const setField = <K extends keyof AdminLesson>(k: K, v: AdminLesson[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setIsDirty(true);
  };

  const handleSave = (newStatus?: AdminLesson["status_code"]) => {
    if (newStatus) setForm((f) => ({ ...f, status_code: newStatus }));
    setIsDirty(false);
    showSuccessToast("✓ Đã lưu bài học.");
  };

  const handlePublish = () => {
    if (items.length === 0) {
      showWarningToast("⚠ Cần ít nhất 1 từ vựng trước khi xuất bản.");
      return;
    }
    handleSave("published");
  };

  const handleNavAway = (href: Route) => {
    if (isDirty) {
      setPendingHref(href);
      setShowUnsaved(true);
    } else {
      router.push(href);
    }
  };

  return (
    <div className={isDirty ? "pb-16" : ""}>
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "Bộ sưu tập", href: "/admin/collections" },
          { label: collection.name, href: collectionHref },
          { label: isNew ? "Bài học mới" : form.title || "Bài học" },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isNew ? "Tạo bài học mới" : form.title || "Bài học"}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {collection.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowArchive(true)}
            >
              <Archive className="mr-1.5 size-3.5" />
              Xóa
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleNavAway(collectionHref)}
          >
            Quay lại
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSave()}
          >
            Lưu nháp
          </Button>
          <Button type="button" onClick={handlePublish}>
            {form.status_code === "published" ? "Cập nhật" : "Xuất bản"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="items">
            Nội dung từ ({items.length})
          </TabsTrigger>
          <TabsTrigger value="preview">Xem trước</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <LessonInfoTab
            form={form}
            onChange={setField}
            itemCount={items.length}
          />
        </TabsContent>

        <TabsContent value="items">
          <LessonItemsTab
            lessonId={form.id}
            langCode={collection.language_code}
            items={items}
            onChange={(updated) => { setItems(updated); setIsDirty(true); }}
          />
        </TabsContent>

        <TabsContent value="preview">
          <LessonPreviewTab lesson={form} items={items} />
        </TabsContent>
      </Tabs>

      <CollectionStickyBar
        visible={isDirty}
        onDiscard={() => {
          setForm(initialLesson ?? { ...DEFAULT_LESSON, id: form.id, collection_id: collection.id, title: "", sort_order: 99 });
          setItems(initialItems);
          setIsDirty(false);
        }}
        onSaveDraft={() => handleSave()}
        onPublish={handlePublish}
        publishLabel={form.status_code === "published" ? "Cập nhật" : "Xuất bản"}
      />

      <UnsavedChangesDialog
        open={showUnsaved}
        onDiscard={() => {
          setShowUnsaved(false);
          if (pendingHref) { router.push(pendingHref); setPendingHref(null); }
        }}
        onSave={() => {
          handleSave();
          setShowUnsaved(false);
          if (pendingHref) { router.push(pendingHref); setPendingHref(null); }
        }}
        onCancel={() => setShowUnsaved(false)}
      />

      <CollectionArchiveDialog
        open={showArchive}
        target={showArchive ? { type: "lesson", id: form.id, name: form.title } : null}
        onClose={() => setShowArchive(false)}
        onConfirm={() => {
          setShowArchive(false);
          showSuccessToast("Đã lưu trữ bài học.");
          router.push(collectionHref);
        }}
      />
    </div>
  );
}
