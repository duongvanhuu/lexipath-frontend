"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Library, BookOpen, CheckCircle2, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatsChipFilter } from "@/features/stats/components/stats-chip-filter";
import { StatsCollectionCard } from "@/features/stats/components/stats-collection-card";
import { MOCK_COLLECTIONS, MOCK_LANG_STATS } from "@/features/stats";
import type { LangCode } from "@/features/stats";

const STATUS_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "learning", label: "Đang học" },
  { id: "not-started", label: "Chưa bắt đầu" },
];

const ACCESS_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "free", label: "Miễn phí" },
  { id: "pro", label: "Pro" },
];

export default function StatsCollectionsPage() {
  const lang: LangCode = "ja";
  const langStats = MOCK_LANG_STATS[lang];
  const allColls = MOCK_COLLECTIONS[lang];

  const [statusF, setStatusF] = React.useState("all");
  const [accessF, setAccessF] = React.useState("all");

  const filtered = allColls.filter((c) => {
    const sOk = statusF === "all" || c.status === statusF;
    const aOk = accessF === "all" || c.access === accessF;
    return sOk && aOk;
  });

  const learning = allColls.filter((c) => c.status === "learning");
  const totalLearned = learning.reduce((s, c) => s + c.learned, 0);
  const totalMastered = learning.reduce((s, c) => s + c.mastered, 0);
  const totalWords = learning.reduce((s, c) => s + c.total, 0);
  const avgAcc = learning.length
    ? Math.round(learning.reduce((s, c) => s + c.accuracy, 0) / learning.length)
    : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/stats">
            <ArrowLeft className="size-4" aria-hidden />
            Thống kê
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Bộ sưu tập</h1>
        <Badge variant="secondary">{langStats.flag} {langStats.name}</Badge>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: <Library className="size-4 text-text-muted" />, value: learning.length, label: "Bộ đang học", sub: langStats.name },
          { icon: <BookOpen className="size-4 text-text-muted" />, value: `${totalLearned}/${totalWords}`, label: "Tổng đã học", sub: "từ" },
          { icon: <CheckCircle2 className="size-4 text-text-muted" />, value: totalMastered, label: "Đã thành thạo", sub: "từ" },
          { icon: <Target className="size-4 text-text-muted" />, value: avgAcc ? `${avgAcc}%` : "—", label: "Chính xác TB", sub: "đang học" },
        ].map((t) => (
          <Card key={t.label}>
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                {t.icon}
                <span className="text-xs text-text-muted">{t.label}</span>
              </div>
              <div className="text-lg font-bold">{t.value}</div>
              <div className="text-[11px] text-text-muted">{t.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <StatsChipFilter items={STATUS_FILTERS} active={statusF} onChange={setStatusF} label="Trạng thái:" />
        <StatsChipFilter items={ACCESS_FILTERS} active={accessF} onChange={setAccessF} label="Gói:" />
      </div>

      {/* Collection list */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-text-secondary">Không có bộ sưu tập nào phù hợp bộ lọc này.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((c) => (
            <StatsCollectionCard key={c.id} collection={c} />
          ))}
        </div>
      )}
    </div>
  );
}
