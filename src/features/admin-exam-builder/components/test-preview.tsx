import { Clock, List, Award, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/shared/badges/content-status-badge";
import type { ContentStatus } from "@/components/shared/badges/content-status-badge";
import { QuestionTypeChip } from "@/features/admin-exam-qbank/components/atoms/question-type-chip";
import { QB_QUESTIONS } from "@/features/admin-exam-qbank/mock/question-bank.mock";
import type { QuestionType } from "@/features/admin-exam-qbank/types/question-bank.types";
import type { ExamTest, TestSection } from "../types/exam-builder.types";
import { getProgramColor, getProgramCode, getSkillName } from "../mock/exam-builder.mock";

interface TestPreviewProps {
  test: ExamTest;
  structure: TestSection[];
}

function qById(id: string) {
  return QB_QUESTIONS.find((q) => q.id === id);
}

export function TestPreview({ test, structure }: TestPreviewProps) {
  const totalQ = structure.reduce(
    (a, s) => a + s.parts.reduce((b, p) => b + p.questionIds.length, 0),
    0,
  );
  const totalPts = structure.reduce(
    (a, s) =>
      a + s.parts.reduce(
        (b, p) => b + p.questionIds.reduce((c, qid) => c + (qById(qid)?.points ?? 0), 0),
        0,
      ),
    0,
  );

  const color = getProgramColor(test.programId);
  const code = getProgramCode(test.programId);
  const statusForBadge = (test.status === "archived" ? "archived" : test.status) as ContentStatus;

  const stats: { label: string; value: string | number; Icon: React.ElementType }[] = [
    { label: "Thời lượng", value: `${test.durationMin} phút`, Icon: Clock },
    { label: "Tổng câu",   value: totalQ,                     Icon: List   },
    { label: "Tổng điểm",  value: totalPts,                   Icon: Award  },
    { label: "Số phần",    value: structure.length,            Icon: Layers },
  ];

  return (
    <div>
      <Card
        className="mb-4 p-5"
        style={{ background: `linear-gradient(135deg, ${color}14, transparent)` }}
      >
        <div className="mb-1.5 flex items-center gap-2">
          <code
            className="rounded px-1.5 py-0.5 text-[11px] font-bold"
            style={{ color, background: `${color}18` }}
          >
            {code}
          </code>
          <ContentStatusBadge status={statusForBadge} />
        </div>
        <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight text-text-primary">
          {test.name || "—"}
        </h2>
        {test.desc && (
          <p className="mb-4 text-sm text-text-secondary">{test.desc}</p>
        )}
        <div className="flex flex-wrap gap-6">
          {stats.map(({ label, value, Icon }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-text-muted" aria-hidden />
              <div>
                <div className="text-lg font-bold text-text-primary">{value}</div>
                <div className="text-[11px] text-text-muted">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {structure.map((sec, si) => (
        <Card key={sec.id} className="mb-3 p-4">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-lg bg-primary-soft text-xs font-bold text-primary">
              {si + 1}
            </span>
            <span className="font-bold text-text-primary">{sec.name}</span>
            <Badge variant="outline">{getSkillName(sec.skill)}</Badge>
            <span className="text-xs text-text-muted">· {sec.durationMin} phút</span>
          </div>

          {sec.parts.map((part) => (
            <div key={part.id} className="mb-2.5 border-l-2 border-border pl-3.5">
              <p className="mb-1.5 text-sm font-semibold text-text-secondary">
                {part.name}{" "}
                <span className="font-normal text-text-muted">· {part.questionIds.length} câu</span>
              </p>
              <div className="flex flex-col gap-1">
                {part.questionIds.map((qid, qi) => {
                  const item = qById(qid);
                  return (
                    <div key={qid} className="flex items-center gap-2 text-sm text-text-primary">
                      <span className="w-5 text-right text-xs text-text-muted">{qi + 1}.</span>
                      {item && <QuestionTypeChip type={item.type as QuestionType} size="sm" />}
                      <span className="truncate">{item?.stem ?? "(đã xóa)"}</span>
                    </div>
                  );
                })}
                {part.questionIds.length === 0 && (
                  <p className="text-xs text-text-muted italic">Chưa có câu hỏi.</p>
                )}
              </div>
            </div>
          ))}

          {sec.parts.length === 0 && (
            <p className="text-xs text-text-muted italic">Chưa có part nào.</p>
          )}
        </Card>
      ))}

      {structure.length === 0 && (
        <Card className="p-8 text-center">
          <Layers className="mx-auto mb-2 size-8 text-text-muted" aria-hidden />
          <p className="text-sm text-text-secondary">Chưa có cấu trúc đề thi.</p>
        </Card>
      )}
    </div>
  );
}
