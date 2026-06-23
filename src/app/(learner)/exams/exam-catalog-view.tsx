"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { PageHeader } from "@/components/layouts/page-header";
import {
  ExamPhase1Banner,
  ExamFilterChip,
  ExamProgramCard,
  ExamTestCard,
} from "@/features/exam/components";
import {
  EXAM_PROGRAMS,
  EXAM_TESTS,
  EXAM_TYPE_META,
} from "@/features/exam";

export function ExamCatalogView() {
  const [search, setSearch] = React.useState("");
  const [filterProg, setFilterProg] = React.useState("all");
  const [filterType, setFilterType] = React.useState("all");
  const [filterAccess, setFilterAccess] = React.useState("all");
  const [filterTag, setFilterTag] = React.useState("all");

  const filtered = EXAM_TESTS.filter((t) => {
    if (filterProg !== "all" && t.programId !== filterProg) return false;
    if (filterType !== "all" && t.typeId !== filterType) return false;
    if (filterAccess !== "all" && t.access !== filterAccess) return false;
    if (filterTag === "new" && !t.isNew) return false;
    if (filterTag === "featured" && !t.featured) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.level.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function clearAll() {
    setSearch("");
    setFilterProg("all");
    setFilterType("all");
    setFilterAccess("all");
    setFilterTag("all");
  }

  const hasActiveFilter =
    filterProg !== "all" ||
    filterType !== "all" ||
    filterAccess !== "all" ||
    filterTag !== "all" ||
    search !== "";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kho đề"
        description="Đề thi mô phỏng chính thức cho IELTS, TOEIC, HSK và JLPT — xem cấu trúc, yêu cầu kỹ năng, điểm số và bộ từ liên quan."
      />

      <ExamPhase1Banner />

      {/* Programs section */}
      <section aria-labelledby="programs-heading">
        <div className="mb-4 flex items-center gap-3">
          <h2
            id="programs-heading"
            className="shrink-0 text-base font-bold text-text-primary"
          >
            Chương trình thi
          </h2>
          <div className="h-px flex-1 bg-border" aria-hidden />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXAM_PROGRAMS.map((p) => (
            <ExamProgramCard key={p.id} program={p} />
          ))}
        </div>
      </section>

      {/* All tests section */}
      <section aria-labelledby="tests-heading">
        <div className="mb-4 flex items-center gap-3">
          <h2
            id="tests-heading"
            className="shrink-0 text-base font-bold text-text-primary"
          >
            Tất cả đề thi
          </h2>
          <div className="h-px flex-1 bg-border" aria-hidden />
        </div>

        {/* Search */}
        <div className="mb-4 flex max-w-sm items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
              aria-hidden
            />
            <Input
              placeholder="Tìm đề thi, cấp độ…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Tìm kiếm đề thi"
            />
          </div>
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearch("")}
              aria-label="Xóa tìm kiếm"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Filter bar */}
        <div
          className="mb-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Bộ lọc đề thi"
        >
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Chương trình
          </span>
          <ExamFilterChip
            label="Tất cả"
            active={filterProg === "all"}
            onClick={() => setFilterProg("all")}
          />
          {EXAM_PROGRAMS.map((p) => (
            <ExamFilterChip
              key={p.id}
              label={p.name}
              active={filterProg === p.id}
              onClick={() => setFilterProg(p.id)}
              showDot
              dotColor={p.color}
            />
          ))}

          <span className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />

          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Loại
          </span>
          <ExamFilterChip
            label="Tất cả"
            active={filterType === "all"}
            onClick={() => setFilterType("all")}
          />
          {(Object.entries(EXAM_TYPE_META) as [string, (typeof EXAM_TYPE_META)[keyof typeof EXAM_TYPE_META]][]).map(
            ([id, meta]) => (
              <ExamFilterChip
                key={id}
                label={meta.label}
                active={filterType === id}
                onClick={() => setFilterType(id)}
              />
            )
          )}

          <span className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />

          <ExamFilterChip
            label="Miễn phí"
            active={filterAccess === "free"}
            onClick={() =>
              setFilterAccess(filterAccess === "free" ? "all" : "free")
            }
          />
          <ExamFilterChip
            label="Pro"
            active={filterAccess === "pro"}
            onClick={() =>
              setFilterAccess(filterAccess === "pro" ? "all" : "pro")
            }
          />
          <ExamFilterChip
            label="⭐ Nổi bật"
            active={filterTag === "featured"}
            onClick={() =>
              setFilterTag(filterTag === "featured" ? "all" : "featured")
            }
          />
          <ExamFilterChip
            label="Mới"
            active={filterTag === "new"}
            onClick={() => setFilterTag(filterTag === "new" ? "all" : "new")}
          />

          {hasActiveFilter && (
            <>
              <span className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 text-xs">
                Xóa bộ lọc
              </Button>
            </>
          )}
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm font-medium text-text-muted">
          <strong className="text-text-primary">{filtered.length}</strong> đề thi
          {search ? ` khớp với "${search}"` : ""}
        </p>

        {/* Test grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search />}
            title="Không tìm thấy đề thi"
            description="Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm."
            action={{
              label: "Xóa bộ lọc",
              onClick: clearAll,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <ExamTestCard
                key={t.id}
                test={t}
                program={EXAM_PROGRAMS.find((p) => p.id === t.programId)}
                typeMeta={EXAM_TYPE_META[t.typeId]}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
