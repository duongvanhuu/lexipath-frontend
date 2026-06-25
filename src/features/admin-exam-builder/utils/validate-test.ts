import type { ExamTest, TestSection, ValidationError } from "../types/exam-builder.types";

export function validateTest(test: ExamTest, structure: TestSection[]): ValidationError[] {
  const errs: ValidationError[] = [];

  if (!structure || structure.length === 0) {
    errs.push({ sev: "error", msg: "Đề thi chưa có phần (section) nào." });
    return errs;
  }

  let qSum = 0;
  let dSum = 0;

  structure.forEach((sec) => {
    dSum += sec.durationMin || 0;
    const secQ = sec.parts.reduce((a, p) => a + (p.questionIds?.length ?? 0), 0);
    qSum += secQ;

    if (sec.parts.length === 0) {
      errs.push({ sev: "warning", msg: `"${sec.name}": chưa có phần con (part).` });
    }

    sec.parts.forEach((p) => {
      if ((p.questionIds?.length ?? 0) === 0) {
        errs.push({ sev: "warning", msg: `"${sec.name} › ${p.name}": chưa thêm câu hỏi.` });
      }
      if (p.qCount && p.questionIds && p.questionIds.length !== p.qCount) {
        errs.push({
          sev: "error",
          msg: `"${sec.name} › ${p.name}": ${p.questionIds.length}/${p.qCount} câu — chưa đủ số câu khai báo.`,
        });
      }
    });
  });

  if (test.questionTotal && qSum !== test.questionTotal) {
    errs.push({
      sev: "error",
      msg: `Tổng câu hỏi (${qSum}) ≠ khai báo của đề (${test.questionTotal}).`,
    });
  }
  if (test.durationMin && dSum !== test.durationMin) {
    errs.push({
      sev: "warning",
      msg: `Tổng thời lượng các phần (${dSum} phút) ≠ thời lượng đề (${test.durationMin} phút).`,
    });
  }

  return errs;
}
