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
import type { ArchiveTarget } from "./collection-archive-dialog";
import { CollectionGeneralTab } from "./collection-general-tab";
import { CollectionTagsTab } from "./collection-tags-tab";
import { CollectionAccessTab } from "./collection-access-tab";
import { CollectionLessonsTab } from "./collection-lessons-tab";
import { CollectionHistoryTab } from "./collection-history-tab";
import type {
  AdminCollection,
  AdminLesson,
  AdminLessonItem,
  AdminAccessRule,
  AdminCollectionVersion,
} from "@/features/admin-collections/types";
import { DEFAULT_COLLECTION, DEFAULT_LESSON } from "@/features/admin-collections/types";

export interface CollectionEditorClientProps {
  initialCollection: AdminCollection | null;
  initialLessons: AdminLesson[];
  initialItems: Record<string, AdminLessonItem[]>;
  initialAccessRule: AdminAccessRule | null;
  initialVersions: AdminCollectionVersion[];
}

const DEFAULT_RULE = (collectionId: string): AdminAccessRule => ({
  id: "new",
  collection_id: collectionId,
  required_tier: "free",
  free_lesson_count: 2,
  allow_trial: true,
  allow_one_time_purchase: false,
  is_active: true,
});

export function CollectionEditorClient({
  initialCollection,
  initialLessons,
  initialItems,
  initialAccessRule,
  initialVersions,
}: CollectionEditorClientProps) {
  const router = useRouter();
  const isNew = !initialCollection;
  const uid = React.useId();
  const tmpId = initialCollection?.id ?? `c_${uid}`;

  const [form, setForm] = React.useState<AdminCollection>(() =>
    initialCollection ?? {
      ...DEFAULT_COLLECTION,
      id: tmpId,
      updated: "",
    },
  );
  const [lessons, setLessons] = React.useState<AdminLesson[]>(initialLessons);
  const [items, setItems] = React.useState<Record<string, AdminLessonItem[]>>(initialItems);
  const [accessRule, setAccessRule] = React.useState<AdminAccessRule>(
    () => initialAccessRule ?? DEFAULT_RULE(tmpId),
  );
  const [isDirty, setIsDirty] = React.useState(false);
  const [showUnsaved, setShowUnsaved] = React.useState(false);
  const [pendingHref, setPendingHref] = React.useState<Route | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<ArchiveTarget | null>(null);

  const setField = <K extends keyof AdminCollection>(k: K, v: AdminCollection[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setIsDirty(true);
  };

  const handleSave = (newStatus?: AdminCollection["status_code"]) => {
    if (newStatus) setForm((f) => ({ ...f, status_code: newStatus }));
    setIsDirty(false);
    showSuccessToast("✓ Đã lưu bộ sưu tập.");
  };

  const handlePublish = () => {
    if (lessons.length === 0) {
      showWarningToast("⚠ Không thể xuất bản: cần ít nhất 1 bài học.");
      return;
    }
    const emptyLessons = lessons.filter((l) => (items[l.id]?.length ?? 0) === 0);
    if (emptyLessons.length > 0) {
      showWarningToast(`⚠ ${emptyLessons.length} bài học chưa có từ vựng.`);
      handleSave("draft");
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

  const handleAddLesson = () => {
    const newLesson: AdminLesson = {
      ...DEFAULT_LESSON,
      id: `l_${Date.now()}`,
      collection_id: form.id,
      title: `Bài ${lessons.length + 1}: Tiêu đề mới`,
      sort_order: lessons.length + 1,
    };
    setLessons((prev) => [...prev, newLesson]);
    setItems((prev) => ({ ...prev, [newLesson.id]: [] }));
    setIsDirty(true);
    router.push(`/admin/collections/${form.id}/lessons/${newLesson.id}` as Route);
  };

  const handleDuplicateLesson = (lesson: AdminLesson) => {
    const dup: AdminLesson = {
      ...lesson,
      id: `l_${Date.now()}`,
      title: `${lesson.title} (nhân bản)`,
      sort_order: lessons.length + 1,
      status_code: "draft",
      item_count: 0,
    };
    setLessons((prev) => [...prev, dup]);
    setItems((prev) => ({ ...prev, [dup.id]: [] }));
    setIsDirty(true);
    showSuccessToast("Đã nhân bản bài học.");
  };

  const lessonCount = lessons.length;
  const tagCount = (form.tags ?? []).length;

  return (
    <div className={isDirty ? "pb-16" : ""}>
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "Bộ sưu tập", href: "/admin/collections" as Route },
          { label: isNew ? "Mới" : form.name || "…" },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isNew ? "Tạo bộ sưu tập mới" : form.name || "Bộ sưu tập"}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {isNew
              ? "Điền thông tin để tạo bộ sưu tập mới."
              : `${form.total_items.toLocaleString("vi-VN")} từ · ${form.total_lessons} bài`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && form.status_code !== "archived" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() =>
                setArchiveTarget({ type: "collection", id: form.id, name: form.name })
              }
            >
              <Archive className="mr-1.5 size-3.5" />
              Lưu trữ
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleNavAway("/admin/collections" as Route)}
          >
            Hủy
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
          <TabsTrigger value="tags">Tags ({tagCount})</TabsTrigger>
          <TabsTrigger value="access">Quyền truy cập</TabsTrigger>
          <TabsTrigger value="lessons">Bài học ({lessonCount})</TabsTrigger>
          <TabsTrigger value="history">Lịch sử &amp; Duyệt</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <CollectionGeneralTab form={form} onChange={setField} />
        </TabsContent>

        <TabsContent value="tags">
          <CollectionTagsTab
            tags={form.tags ?? []}
            onChange={(tags) => { setField("tags", tags); }}
          />
        </TabsContent>

        <TabsContent value="access">
          <CollectionAccessTab
            rule={accessRule}
            onChange={(k, v) => {
              setAccessRule((r) => ({ ...r, [k]: v }));
              setIsDirty(true);
            }}
          />
        </TabsContent>

        <TabsContent value="lessons">
          <CollectionLessonsTab
            collectionId={form.id}
            lessons={lessons}
            items={items}
            onReorder={(reordered) => { setLessons(reordered); setIsDirty(true); }}
            onAddLesson={handleAddLesson}
            onEditLesson={(lessonId) =>
              router.push(`/admin/collections/${form.id}/lessons/${lessonId}` as Route)
            }
            onDuplicateLesson={handleDuplicateLesson}
            onArchiveLesson={(lessonId, lessonTitle) =>
              setArchiveTarget({ type: "lesson", id: lessonId, name: lessonTitle })
            }
          />
        </TabsContent>

        <TabsContent value="history">
          <CollectionHistoryTab
            collectionId={form.id}
            status={form.status_code}
            versions={initialVersions}
            onSubmitReview={() => handleSave("review")}
          />
        </TabsContent>
      </Tabs>

      <CollectionStickyBar
        visible={isDirty}
        onDiscard={() => {
          setForm(
            initialCollection ?? { ...DEFAULT_COLLECTION, id: tmpId, updated: "" },
          );
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
        open={archiveTarget !== null}
        target={archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => {
          if (archiveTarget?.type === "collection") {
            setForm((f) => ({ ...f, status_code: "archived" }));
            showSuccessToast("Đã lưu trữ bộ sưu tập.");
            setArchiveTarget(null);
            router.push("/admin/collections" as Route);
          } else if (archiveTarget?.type === "lesson") {
            setLessons((prev) =>
              prev.map((l) =>
                l.id === archiveTarget.id
                  ? { ...l, status_code: "archived" as const }
                  : l,
              ),
            );
            showSuccessToast("Đã lưu trữ bài học.");
            setArchiveTarget(null);
          }
        }}
      />
    </div>
  );
}
