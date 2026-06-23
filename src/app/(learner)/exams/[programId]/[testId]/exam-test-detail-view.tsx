"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ChevronRight,
  ArrowLeft,
  Clock,
  ListChecks,
  Trophy,
  BarChart2,
  Unlock,
  Star,
  Layers,
  List,
  Info,
  ClipboardList,
  Calculator,
  CheckCircle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ExamComingSoonNotice,
  ExamToSrsPreviewCard,
  ExamPrepPathCard,
  ExamSectionAccordion,
} from "@/features/exam/components";
import type { LearnerExamProgram, LearnerExamTest, ExamBlueprintData } from "@/features/exam/types";
import { EXAM_TYPE_META } from "@/features/exam";

interface ExamTestDetailViewProps {
  test: LearnerExamTest;
  program: LearnerExamProgram;
  blueprint: ExamBlueprintData | null;
}

type Tab = "overview" | "structure" | "vocab";

export function ExamTestDetailView({
  test,
  program,
  blueprint,
}: ExamTestDetailViewProps) {
  const [tab, setTab] = React.useState<Tab>("overview");
  const typeMeta = EXAM_TYPE_META[test.typeId];
  const isLocked = test.access === "pro";

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Tổng quan" },
    { id: "structure", label: "Cấu trúc đề" },
    { id: "vocab", label: "Từ vựng liên quan" },
  ];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-sm text-text-muted"
      >
        <Link
          href="/exams"
          className="inline-flex items-center gap-1 font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Kho đề
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <Link
          href={`/exams/${program.id}` as Route}
          className="font-medium text-text-secondary hover:text-text-primary"
        >
          {program.langFlag} {program.name}
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="font-medium text-text-primary line-clamp-1">{test.title}</span>
      </nav>

      {/* Header card */}
      <div className="rounded-[var(--radius-panel)] border border-border bg-card px-7 py-6 shadow-[var(--shadow-card)]">
        {/* Badges */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            style={{ backgroundColor: program.colorSoft, color: program.colorSoftFg }}
          >
            {program.langFlag} {program.name}
          </span>
          {typeMeta && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: typeMeta.soft, color: typeMeta.softFg }}
            >
              {typeMeta.label}
            </span>
          )}
          {test.isNew && (
            <span className="inline-flex items-center rounded-full bg-success-soft px-2.5 py-0.5 text-[11px] font-bold text-success-foreground">
              Mới
            </span>
          )}
          {isLocked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-0.5 text-[11px] font-bold text-warning-foreground">
              <Star className="size-2.5" aria-hidden />
              Pro
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-extrabold leading-snug tracking-tight text-text-primary">
          {test.title}
        </h1>

        {/* Meta row */}
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
            <Clock className="size-4" aria-hidden />
            <strong className="text-text-primary">{test.durationMin}</strong> phút
          </span>
          <span className="h-4 w-px bg-border" aria-hidden />
          <span className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
            <ListChecks className="size-4" aria-hidden />
            <strong className="text-text-primary">{test.questions}</strong> câu hỏi
          </span>
          <span className="h-4 w-px bg-border" aria-hidden />
          <span className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
            <Trophy className="size-4" aria-hidden />
            <strong className="text-text-primary">{test.maxScore}</strong>
          </span>
          <span className="h-4 w-px bg-border" aria-hidden />
          <span className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
            <BarChart2 className="size-4" aria-hidden />
            <strong className="text-text-primary">{test.level}</strong>
          </span>
        </div>

        {/* Phase 1 actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="default"
            onClick={() => setTab("structure")}
          >
            <Layers className="size-4" aria-hidden />
            Xem cấu trúc đề
          </Button>
          <Button variant="outline" onClick={() => setTab("vocab")}>
            <RefreshCw className="size-4" aria-hidden />
            Xem bộ từ liên quan
          </Button>
          {test.access === "free" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success-foreground">
              <Unlock className="size-3.5" aria-hidden />
              Miễn phí
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-3 py-1 text-sm font-semibold text-warning-foreground">
              <Star className="size-3.5" aria-hidden />
              Pro
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <nav
        className="flex gap-1 rounded-[var(--radius-card)] border border-border bg-surface-muted p-1"
        aria-label="Nội dung đề thi"
        role="tablist"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`tabpanel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-[calc(var(--radius-card)-4px)] px-3 py-2 text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-card font-semibold text-text-primary shadow-[var(--shadow-card)]"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Tab panels */}
      <div>
        {/* Overview */}
        {tab === "overview" && (
          <div
            id="tabpanel-overview"
            role="tabpanel"
            aria-label="Tổng quan"
            className="flex flex-col gap-3"
          >
            {blueprint && (
              <>
                {/* Description */}
                <InfoBlock icon={<Info className="size-3.5" />} label="Giới thiệu">
                  {blueprint.description}
                </InfoBlock>

                {/* Instruction */}
                <InfoBlock icon={<ClipboardList className="size-3.5" />} label="Hướng dẫn làm bài">
                  {blueprint.instruction}
                </InfoBlock>

                {/* Score + pass */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoBlock icon={<Calculator className="size-3.5" />} label="Hệ thống tính điểm">
                    {blueprint.scoreSystem}
                  </InfoBlock>
                  <InfoBlock icon={<CheckCircle className="size-3.5" />} label="Điểm đạt">
                    {blueprint.passMark}
                  </InfoBlock>
                </div>

                {/* Access status */}
                {blueprint.accessLocked ? (
                  <div className="flex items-start gap-4 rounded-[var(--radius-card)] border border-warning/30 bg-warning-soft px-5 py-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-warning-soft text-warning-foreground">
                      <Star className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-warning-foreground">
                        Yêu cầu tài khoản Pro
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                        Đề thi này dành riêng cho thành viên LexiPath Pro. Nâng cấp để truy cập toàn bộ thư viện đề thi.
                      </p>
                      <Button variant="default" size="sm" className="mt-3">
                        <Star className="size-3.5" aria-hidden />
                        Nâng cấp Pro
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 rounded-[var(--radius-card)] border border-success/30 bg-success-soft px-5 py-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success-foreground">
                      <Unlock className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-success-foreground">
                        Miễn phí cho tất cả người học
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-success-foreground/80">
                        Bạn có thể xem cấu trúc đề và các bộ từ liên quan bất cứ lúc nào.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Phase 2 coming soon */}
            <ExamComingSoonNotice className="mt-1" />
          </div>
        )}

        {/* Structure */}
        {tab === "structure" && (
          <div
            id="tabpanel-structure"
            role="tabpanel"
            aria-label="Cấu trúc đề"
            className="flex flex-col gap-3"
          >
            {blueprint?.sections && blueprint.sections.length > 0 ? (
              <>
                {/* Summary row */}
                <div className="flex flex-wrap gap-4 rounded-[var(--radius-card)] border border-border bg-surface-muted px-5 py-3.5">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-text-muted">
                    <Layers className="size-4" aria-hidden />
                    {blueprint.sections.length} phần thi
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-text-muted">
                    <List className="size-4" aria-hidden />
                    {blueprint.sections.reduce((a, s) => a + s.totalQ, 0)} câu hỏi
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-text-muted">
                    <Clock className="size-4" aria-hidden />
                    {blueprint.sections.reduce((a, s) => a + s.durationMin, 0)} phút
                  </span>
                </div>

                {blueprint.sections.map((sec, i) => (
                  <ExamSectionAccordion key={i} section={sec} defaultOpen={i === 0} />
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-text-muted">
                <List className="size-8" aria-hidden />
                <p className="text-sm">Thông tin cấu trúc đề thi sẽ được cập nhật sớm.</p>
              </div>
            )}

            {/* Phase 2 notice */}
            <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-border bg-surface-muted px-4 py-3 text-sm text-text-muted">
              <Clock className="size-4 shrink-0" aria-hidden />
              <span>
                Sắp có luyện đề theo từng phần —{" "}
                <strong className="text-text-secondary">Phase 2</strong>
              </span>
            </div>
          </div>
        )}

        {/* Vocab */}
        {tab === "vocab" && (
          <div
            id="tabpanel-vocab"
            role="tabpanel"
            aria-label="Từ vựng liên quan"
            className="flex flex-col gap-3"
          >
            {blueprint?.relatedCollections && blueprint.relatedCollections.length > 0 ? (
              <>
                <div className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-primary/20 bg-primary-soft px-4 py-3">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <p className="text-sm text-text-secondary">
                    Học từ vựng trong các bộ sưu tập liên quan trước khi làm đề thi để đạt điểm cao hơn.
                  </p>
                </div>
                {blueprint.relatedCollections.map((c) => (
                  <ExamPrepPathCard key={c.id} collection={c} />
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-text-muted">
                <RefreshCw className="size-8" aria-hidden />
                <p className="text-sm">Chưa có bộ sưu tập từ vựng liên quan cho đề thi này.</p>
              </div>
            )}

            {/* Exam→SRS explainer */}
            <div className="mt-2">
              <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                <RefreshCw className="size-3" aria-hidden />
                Cách LexiPath kết nối đề thi với SRS
              </p>
              <ExamToSrsPreviewCard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Reusable info block ── */
function InfoBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card px-5 py-4">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
        {icon}
        {label}
      </p>
      <p className="text-sm leading-relaxed text-text-secondary">{children}</p>
    </div>
  );
}
